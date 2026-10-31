import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

export interface OutboxEventLike {
  id: string;
  eventType: string;
  payloadJson: unknown;
  tenantId?: string | null;
}

export interface NotificationTemplateMeta {
  key: string;
  titleFa: string;
  requiredPayloadFields: string[];
}

interface NotificationTemplate {
  key: string;
  titleFa: string;
  requiredPayloadFields: string[];
  render(payload: Record<string, any>): { title: string; body: string };
}

const FALLBACK_RECIPIENT = "customer@commerce-os.local";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function persianNumber(value: unknown): string {
  return new Intl.NumberFormat("fa-IR").format(Number(value ?? 0));
}

function persianDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

/**
 * Persian business notification templates (Outbox consumer registry).
 * Unknown event types are intentionally absent so the caller can skip them.
 */
const TEMPLATE_REGISTRY: Record<string, NotificationTemplate> = {
  ORDER_PAID: {
    key: "ORDER_PAID",
    titleFa: "پرداخت سفارش شما تأیید شد",
    requiredPayloadFields: ["orderId", "totalAmount"],
    render: (payload) => ({
      title: "پرداخت سفارش شما تأیید شد",
      body: `سفارش ${payload.orderNumber || payload.orderId || "شما"} به مبلغ ${persianNumber(payload.totalAmount)} ریال در تاریخ ${persianDateTime(new Date())} با موفقیت پرداخت و تأیید شد. از اعتماد شما سپاسگزاریم.`,
    }),
  },
  ORDER_SHIPPED: {
    key: "ORDER_SHIPPED",
    titleFa: "سفارش شما ارسال شد",
    requiredPayloadFields: ["orderId", "trackingCode"],
    render: (payload) => ({
      title: "سفارش شما ارسال شد",
      body: `سفارش ${payload.orderNumber || payload.orderId || "شما"} در تاریخ ${persianDateTime(new Date())} تحویل شرکت حمل‌ونقل شد. کد رهگیری مرسوله: ${payload.trackingCode || "در حال تکمیل"}.`,
    }),
  },
  C2C_RECEIPT_APPROVED: {
    key: "C2C_RECEIPT_APPROVED",
    titleFa: "رسید کارت‌به‌کارت شما تأیید شد",
    requiredPayloadFields: ["orderId"],
    render: (payload) => ({
      title: "رسید کارت‌به‌کارت شما تأیید شد",
      body: `رسید پرداخت کارت‌به‌کارت شما برای سفارش ${payload.orderNumber || payload.orderId || "ثبت‌شده"} در تاریخ ${persianDateTime(new Date())} بررسی و تأیید شد. فرایند آماده‌سازی سفارش آغاز شده است.`,
    }),
  },
  WALLET_DEPOSIT: {
    key: "WALLET_DEPOSIT",
    titleFa: "کیف پول شما شارژ شد",
    requiredPayloadFields: ["amount"],
    render: (payload) => ({
      title: "کیف پول شما شارژ شد",
      body: `مبلغ ${persianNumber(payload.amount)} ریال در تاریخ ${persianDateTime(new Date())} به کیف پول شما واریز شد. موجودی فعلی کیف پول شما: ${persianNumber(payload.balance)} ریال.`,
    }),
  },
};

function normalizePayload(payloadJson: unknown): Record<string, any> {
  return typeof payloadJson === "object" && payloadJson !== null ? (payloadJson as Record<string, any>) : {};
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps an outbox event onto notification deliveries (SMS + EMAIL) and
   * simulates transport (no real gateway). Never throws to the caller:
   * a DB outage degrades to { queued, dbAvailable: false }.
   */
  async createFromOutboxEvent(
    event: OutboxEventLike
  ): Promise<{ queued: number; dbAvailable: boolean } | null> {
    const template = TEMPLATE_REGISTRY[event.eventType];
    if (!template) {
      return null;
    }

    const payload = normalizePayload(event.payloadJson);
    const rendered = template.render(payload);
    const tenantId = typeof event.tenantId === "string" && UUID_REGEX.test(event.tenantId) ? event.tenantId : null;

    const smsRecipient =
      typeof payload.phone === "string" && payload.phone.trim().length > 0 ? payload.phone : FALLBACK_RECIPIENT;
    const emailRecipient =
      typeof payload.email === "string" && payload.email.trim().length > 0 ? payload.email : FALLBACK_RECIPIENT;

    const channels: Array<{ channel: string; recipient: string }> = [
      { channel: "SMS", recipient: smsRecipient },
      { channel: "EMAIL", recipient: emailRecipient },
    ];

    let queued = 0;
    try {
      for (const { channel, recipient } of channels) {
        const delivery = await this.prisma.notificationDelivery.create({
          data: {
            tenantId,
            channel,
            recipient,
            templateKey: template.key,
            title: rendered.title,
            body: rendered.body,
            status: "QUEUED",
            outboxEventId: event.id,
          },
        });

        // Simulate transport: mark as SENT immediately (no real SMS/email gateway).
        await this.prisma.notificationDelivery.update({
          where: { id: delivery.id },
          data: { status: "SENT", sentAt: new Date() },
        });

        queued += 1;
      }

      return { queued, dbAvailable: true };
    } catch (err: any) {
      this.logger.warn(
        `Notification pipeline unavailable (outbox event ${event.id}): ${err?.message || err}`
      );
      return { queued, dbAvailable: false };
    }
  }

  async list(limit = 50, status?: string) {
    try {
      const items = await this.prisma.notificationDelivery.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return { items, dbAvailable: true };
    } catch (err: any) {
      this.logger.warn(`Notification list unavailable: ${err?.message || err}`);
      return { items: [], dbAvailable: false };
    }
  }

  templates(): NotificationTemplateMeta[] {
    return Object.values(TEMPLATE_REGISTRY).map((template) => ({
      key: template.key,
      titleFa: template.titleFa,
      requiredPayloadFields: template.requiredPayloadFields,
    }));
  }
}
