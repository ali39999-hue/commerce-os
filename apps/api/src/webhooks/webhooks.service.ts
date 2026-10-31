import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { computeHmacSha256 } from "@commerce-os/security";

const BLOCKED_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Nil UUID used as a stable placeholder tenant for demo/headerless dispatches.
const NIL_TENANT_UUID = "00000000-0000-0000-0000-000000000000";

const WEBHOOK_TIMEOUT_MS = 5000;

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  private resolveSecret(): string {
    return process.env.WEBHOOK_SECRET || process.env.AUTH_SECRET || "dev-webhook-secret";
  }

  /**
   * SSRF guard: only http(s) targets are ever allowed. Loopback hostnames are
   * rejected in production (local test receivers are legitimate in dev).
   */
  private assertSafeTarget(targetUrl: string): void {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      throw new BadRequestException("آدرس مقصد وب‌هوک نامعتبر است");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new BadRequestException("تنها پروتکل‌های HTTP و HTTPS برای وب‌هوک مجاز هستند");
    }

    // URL.hostname keeps IPv6 literals bracketed ("[::1]"); normalize before matching.
    const hostname = parsed.hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();

    if (process.env.NODE_ENV === "production" && BLOCKED_HOSTNAMES.has(hostname)) {
      throw new BadRequestException("ارسال وب‌هوک به آدرس‌های داخلی در محیط تولید مجاز نیست");
    }
  }

  /**
   * WebhookDelivery.tenantId is a NOT NULL uuid column; header-provided demo
   * values (e.g. "demo-tenant-header") are mapped to the nil UUID so the
   * simulated pipeline stays functional while real tenant UUIDs pass through.
   */
  private normalizeTenantId(tenantId: string): string {
    if (UUID_REGEX.test(tenantId)) {
      return tenantId;
    }
    this.logger.warn(`Non-UUID tenantId "${tenantId}" received; using nil tenant UUID for webhook delivery.`);
    return NIL_TENANT_UUID;
  }

  /**
   * Persists a signed webhook delivery row, POSTs the exact canonical JSON
   * body to the target and records the outcome. Transport failures are
   * captured as FAILED + lastError (never thrown).
   */
  async dispatch(
    eventType: string,
    payload: Record<string, any>,
    targetUrl: string,
    tenantId: string
  ) {
    this.assertSafeTarget(targetUrl);

    const canonicalJson = JSON.stringify(payload ?? {});
    const signature = computeHmacSha256(canonicalJson, this.resolveSecret());

    let deliveryId: string | null = null;
    try {
      const delivery = await this.prisma.webhookDelivery.create({
        data: {
          tenantId: this.normalizeTenantId(tenantId),
          eventType,
          targetUrl,
          payloadJson: payload ?? {},
          signature,
          status: "PENDING",
          attempts: 0,
        },
      });
      deliveryId = delivery.id;
    } catch (err: any) {
      // DB-down: signing + transport still proceed; the row is simply not persisted.
      this.logger.warn(`WebhookDelivery persist skipped (DB unavailable): ${err?.message ?? err}`);
    }

    return await this.attemptDelivery(
      deliveryId,
      eventType,
      targetUrl,
      canonicalJson,
      signature
    );
  }

  private async attemptDelivery(
    deliveryId: string | null,
    eventType: string,
    targetUrl: string,
    canonicalJson: string,
    signature: string
  ) {
    let status = "FAILED";
    let lastError: string | null = null;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-commerce-signature": signature,
          "x-commerce-event": eventType,
        },
        body: canonicalJson,
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (response.ok) {
        status = "DELIVERED";
      } else {
        lastError = `HTTP status ${response.status} from target`;
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
    }

    // Ephemeral path (DB-down): no row to update — return the outcome inline
    // so callers and the E2E still observe signing + transport results.
    if (!deliveryId) {
      return {
        id: "ephemeral-no-db",
        eventType,
        targetUrl,
        signature,
        status,
        attempts: 1,
        lastError,
        deliveredAt: status === "DELIVERED" ? new Date() : null,
      };
    }

    return await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status,
        attempts: { increment: 1 },
        lastError,
        ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
      },
    });
  }

  async testWebhook(url: string, eventType = "ORDER_PAID") {
    const samplePayload: Record<string, any> = {
      eventType,
      orderId: "ORD-DEMO-1001",
      orderNumber: "14040815-0001",
      customerName: "مشتری نمونه",
      totalAmount: 1250000,
      occurredAt: new Date().toISOString(),
      message: "رویداد آزمایشی وب‌هوک از Commerce OS",
    };

    return this.dispatch(eventType, samplePayload, url, "demo-tenant-header");
  }

  async list(limit = 50) {
    try {
      const items = await this.prisma.webhookDelivery.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return { items, dbAvailable: true };
    } catch (err: any) {
      this.logger.warn(`Webhook list unavailable: ${err?.message || err}`);
      return { items: [], dbAvailable: false };
    }
  }
}
