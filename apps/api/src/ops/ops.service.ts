import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  CardToCardStatus,
  OutboxStatus,
  PaymentIntentStatus,
  ReservationStatus,
} from "../generated/prisma/client";
import { pingRedisServer } from "../health/health.service";

const MAX_ITEMS_PER_BLOCK = 10;

// ── Block item shapes (W9 / §17.2 Exception Center) ──

export interface OutboxDeadLetterItem {
  id: string;
  eventType: string;
  retryCount: number;
  createdAt: Date;
}

export interface PaymentProblemItem {
  id: string;
  method: string;
  status: string;
  amount: string;
  createdAt: Date;
}

export interface StuckReservationItem {
  id: string;
  expiresAt: Date;
}

export interface C2cPendingItem {
  id: string;
  referenceNumber: string;
  createdAt: Date;
}

export interface WebhookFailureItem {
  id: string;
  eventType: string;
  targetUrl: string;
  attempts: number;
}

export type OpsExceptionItem =
  | OutboxDeadLetterItem
  | PaymentProblemItem
  | StuckReservationItem
  | C2cPendingItem
  | WebhookFailureItem;

export interface OpsExceptionBlock<TItem> {
  key: string;
  titleFa: string;
  count: number;
  items: TItem[];
}

export interface OpsExceptionsReport {
  dbAvailable: boolean;
  blocks: OpsExceptionBlock<OpsExceptionItem>[];
}

export interface OpsMetricsReport {
  timestamp: string;
  uptimeSeconds: number;
  db: {
    available: boolean;
    latencyMs: number;
  };
  redis: {
    available: boolean;
    latencyMs: number;
    error?: string;
  };
  queues: {
    outboxPending: number;
    outboxProcessing: number;
    outboxDeadLetter: number;
    webhookFailed: number;
  };
  inventory: {
    staleReservations: number;
  };
  payments: {
    unknownOrFailed: number;
    pendingC2c: number;
  };
}

interface BlockLoad<TItem> {
  ok: boolean;
  count: number;
  items: TItem[];
}

@Injectable()
export class OpsService {
  constructor(private readonly prisma: PrismaService) {}

  async exceptions(): Promise<OpsExceptionsReport> {
    // Each block is loaded independently so one failing model never kills the endpoint
    const [outbox, payments, reservations, c2c, webhooks] = await Promise.all([
      this.loadOutboxBlock(),
      this.loadPaymentBlock(),
      this.loadReservationBlock(),
      this.loadC2cBlock(),
      this.loadWebhookBlock(),
    ]);

    const dbAvailable = [
      outbox.ok,
      payments.ok,
      reservations.ok,
      c2c.ok,
      webhooks.ok,
    ].some(Boolean);

    return {
      dbAvailable,
      blocks: [
        {
          key: "outbox_dead_letter",
          titleFa: "رویدادهای مرده Outbox",
          count: outbox.count,
          items: outbox.items,
        },
        {
          key: "payment_unknown",
          titleFa: "پرداخت‌های نامعلوم/ناموفق",
          count: payments.count,
          items: payments.items,
        },
        {
          key: "stuck_reservations",
          titleFa: "رزروهای گیرکرده انبار",
          count: reservations.count,
          items: reservations.items,
        },
        {
          key: "c2c_pending",
          titleFa: "فیش‌های کارت‌به‌کارت در انتظار بررسی",
          count: c2c.count,
          items: c2c.items,
        },
        {
          key: "webhook_failures",
          titleFa: "وب‌هک‌های ناموفق",
          count: webhooks.count,
          items: webhooks.items,
        },
      ],
    };
  }

  async metrics(): Promise<OpsMetricsReport> {
    const started = Date.now();
    let dbAvailable = false;
    let dbLatencyMs = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
      dbLatencyMs = Date.now() - started;
    } catch {
      dbAvailable = false;
      dbLatencyMs = Date.now() - started;
    }

    const redisRes = await pingRedisServer();

    let outboxPending = 0;
    let outboxProcessing = 0;
    let outboxDeadLetter = 0;
    let webhookFailed = 0;
    let staleReservations = 0;
    let unknownOrFailed = 0;
    let pendingC2c = 0;

    if (dbAvailable) {
      try {
        const [
          pendingCnt,
          procCnt,
          dlqCnt,
          whFailedCnt,
          staleResCnt,
          payFailedCnt,
          c2cCnt,
        ] = await Promise.all([
          this.prisma.outboxEvent.count({ where: { status: OutboxStatus.PENDING } }),
          this.prisma.outboxEvent.count({ where: { status: OutboxStatus.PROCESSING } }),
          this.prisma.outboxEvent.count({
            where: { status: { in: [OutboxStatus.FAILED, OutboxStatus.DEAD_LETTER] } },
          }),
          this.prisma.webhookDelivery.count({
            where: {
              OR: [{ status: "FAILED" }, { status: "PENDING", attempts: { gt: 0 } }],
            },
          }),
          this.prisma.inventoryReservation.count({
            where: {
              status: ReservationStatus.ACTIVE,
              expiresAt: { lt: new Date() },
            },
          }),
          this.prisma.paymentIntent.count({
            where: {
              status: { in: [PaymentIntentStatus.UNKNOWN, PaymentIntentStatus.FAILED] },
            },
          }),
          this.prisma.cardToCardReceipt.count({
            where: { status: CardToCardStatus.PENDING_REVIEW },
          }),
        ]);

        outboxPending = pendingCnt;
        outboxProcessing = procCnt;
        outboxDeadLetter = dlqCnt;
        webhookFailed = whFailedCnt;
        staleReservations = staleResCnt;
        unknownOrFailed = payFailedCnt;
        pendingC2c = c2cCnt;
      } catch {
        // Fallback on partial metrics count failure
      }
    }

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      db: {
        available: dbAvailable,
        latencyMs: dbLatencyMs,
      },
      redis: {
        available: redisRes.status === "ok",
        latencyMs: redisRes.latencyMs,
        ...(redisRes.error ? { error: redisRes.error } : {}),
      },
      queues: {
        outboxPending,
        outboxProcessing,
        outboxDeadLetter,
        webhookFailed,
      },
      inventory: {
        staleReservations,
      },
      payments: {
        unknownOrFailed,
        pendingC2c,
      },
    };
  }

  private async loadOutboxBlock(): Promise<BlockLoad<OutboxDeadLetterItem>> {
    try {
      const where = { status: { in: [OutboxStatus.FAILED, OutboxStatus.DEAD_LETTER] } };
      const [count, rows] = await Promise.all([
        this.prisma.outboxEvent.count({ where }),
        this.prisma.outboxEvent.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: MAX_ITEMS_PER_BLOCK,
          select: { id: true, eventType: true, retryCount: true, createdAt: true },
        }),
      ]);
      return { ok: true, count, items: rows };
    } catch {
      return { ok: false, count: 0, items: [] };
    }
  }

  private async loadPaymentBlock(): Promise<BlockLoad<PaymentProblemItem>> {
    try {
      const where = { status: { in: [PaymentIntentStatus.UNKNOWN, PaymentIntentStatus.FAILED] } };
      const [count, rows] = await Promise.all([
        this.prisma.paymentIntent.count({ where }),
        this.prisma.paymentIntent.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: MAX_ITEMS_PER_BLOCK,
          select: { id: true, method: true, status: true, amount: true, createdAt: true },
        }),
      ]);
      return {
        ok: true,
        count,
        items: rows.map((row) => ({
          id: row.id,
          method: row.method,
          status: row.status,
          amount: row.amount.toString(),
          createdAt: row.createdAt,
        })),
      };
    } catch {
      return { ok: false, count: 0, items: [] };
    }
  }

  private async loadReservationBlock(): Promise<BlockLoad<StuckReservationItem>> {
    try {
      const where = {
        status: ReservationStatus.ACTIVE,
        expiresAt: { lt: new Date() },
      };
      const [count, rows] = await Promise.all([
        this.prisma.inventoryReservation.count({ where }),
        this.prisma.inventoryReservation.findMany({
          where,
          orderBy: { expiresAt: "asc" },
          take: MAX_ITEMS_PER_BLOCK,
          select: { id: true, expiresAt: true },
        }),
      ]);
      return { ok: true, count, items: rows };
    } catch {
      return { ok: false, count: 0, items: [] };
    }
  }

  private async loadC2cBlock(): Promise<BlockLoad<C2cPendingItem>> {
    try {
      const where = { status: CardToCardStatus.PENDING_REVIEW };
      const [count, rows] = await Promise.all([
        this.prisma.cardToCardReceipt.count({ where }),
        this.prisma.cardToCardReceipt.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: MAX_ITEMS_PER_BLOCK,
          select: { id: true, referenceNumber: true, createdAt: true },
        }),
      ]);
      return { ok: true, count, items: rows };
    } catch {
      return { ok: false, count: 0, items: [] };
    }
  }

  private async loadWebhookBlock(): Promise<BlockLoad<WebhookFailureItem>> {
    try {
      const where = {
        OR: [{ status: "FAILED" }, { status: "PENDING", attempts: { gt: 0 } }],
      };
      const [count, rows] = await Promise.all([
        this.prisma.webhookDelivery.count({ where }),
        this.prisma.webhookDelivery.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: MAX_ITEMS_PER_BLOCK,
          select: { id: true, eventType: true, targetUrl: true, attempts: true },
        }),
      ]);
      return { ok: true, count, items: rows };
    } catch {
      return { ok: false, count: 0, items: [] };
    }
  }
}
