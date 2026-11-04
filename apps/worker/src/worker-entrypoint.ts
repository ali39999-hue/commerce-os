import { PrismaPg } from "@prisma/adapter-pg";
// Import the generated client from apps/api
import { PrismaClient } from "../../api/src/generated/prisma/client.js";
import * as dotenv from "dotenv";
import * as crypto from "node:crypto";

dotenv.config({ path: ["../../.env", ".env"] });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/commerce_os?schema=public";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const WORKER_ID = `worker_${process.pid}_${Math.random().toString(36).slice(2, 7)}`;
let isRunning = true;

// Outbox event types that close into customer-facing notifications.
const NOTIFICATION_EVENT_TYPES = ["ORDER_PAID", "ORDER_SHIPPED", "C2C_RECEIPT_APPROVED", "WALLET_DEPOSIT"];

// Nil UUID placeholder for webhook rows when the outbox event has no tenant.
const NIL_TENANT_UUID = "00000000-0000-0000-0000-000000000000";

const WEBHOOK_TIMEOUT_MS = 5000;

// ── امتیاز وفاداری (ADR-008): به‌ازای هر ۱۰٬۰۰۰ ریال مبلغ قطعی سفارش، ۱ امتیاز کسب می‌شود ──
const LOYALTY_POINTS_PER_10000_IRR = 1;

// ── کالای دیجیتال (ADR-012): سقف دانلود پیش‌فرض ۵ و انقضای ۳۰ روزه لایسنس ──
const DIGITAL_GRANT_MAX_DOWNLOADS = 5;
const DIGITAL_GRANT_TTL_DAYS = 30;

/** سطوح باشگاه مشتریان (ADR-008): BRONZE پیش‌فرض / SILVER از ۱٬۰۰۰ امتیاز / GOLD از ۵٬۰۰۰ امتیاز */
function loyaltyTierFor(points: number): "BRONZE" | "SILVER" | "GOLD" {
  if (points >= 5000) return "GOLD";
  if (points >= 1000) return "SILVER";
  return "BRONZE";
}

function formatPersianDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function formatPersianNumber(value: unknown): string {
  return new Intl.NumberFormat("fa-IR").format(Number(value ?? 0));
}

/** Small local Persian template registry (worker does not import @commerce-os packages beyond the client). */
function renderNotificationTemplate(eventType: string, payload: Record<string, any>): { title: string; body: string } | null {
  const when = formatPersianDateTime(new Date());
  const orderRef = payload.orderNumber || payload.orderId || "";

  switch (eventType) {
    case "ORDER_PAID":
      return {
        title: "پرداخت سفارش شما تأیید شد",
        body: `سفارش ${orderRef} به مبلغ ${formatPersianNumber(payload.totalAmount)} ریال در تاریخ ${when} با موفقیت پرداخت و تأیید شد. از اعتماد شما سپاسگزاریم.`,
      };
    case "ORDER_SHIPPED":
      return {
        title: "سفارش شما ارسال شد",
        body: `سفارش ${orderRef} در تاریخ ${when} تحویل شرکت حمل‌ونقل شد. کد رهگیری مرسوله: ${payload.trackingCode || "در حال تکمیل"}.`,
      };
    case "C2C_RECEIPT_APPROVED":
      return {
        title: "رسید کارت‌به‌کارت شما تأیید شد",
        body: `رسید پرداخت کارت‌به‌کارت شما برای سفارش ${orderRef} در تاریخ ${when} بررسی و تأیید شد. فرایند آماده‌سازی سفارش آغاز شده است.`,
      };
    case "WALLET_DEPOSIT":
      return {
        title: "کیف پول شما شارژ شد",
        body: `مبلغ ${formatPersianNumber(payload.amount)} ریال در تاریخ ${when} به کیف پول شما واریز شد.`,
      };
    case "SUBSCRIPTION_RENEWAL_DUE":
      return {
        title: "یادآوری تمدید اشتراک شما",
        body: `دوره اشتراک شما در تاریخ ${when} سررسید شد و آماده تمدید است. تعداد سفارش این دوره: ${formatPersianNumber(payload.quantity)}. پس از تأیید پرداخت، دوره بعدی به‌صورت خودکار برنامه‌ریزی می‌شود.`,
      };
    default:
      return null;
  }
}

/**
 * Outbox → Notification closure + HMAC-signed outgoing webhook.
 * Every failure is logged and swallowed so the batch loop keeps running.
 */
async function handleOutboxEventSideEffects(event: any): Promise<void> {
  const eventType = String(event.eventType || "");
  const payload: Record<string, any> =
    typeof event.payloadJson === "object" && event.payloadJson !== null ? event.payloadJson : {};

  // ── Notifications (SMS + EMAIL, simulated transport) ──
  if (NOTIFICATION_EVENT_TYPES.includes(eventType)) {
    const rendered = renderNotificationTemplate(eventType, payload);

    if (rendered) {
      const smsRecipient =
        typeof payload.phone === "string" && payload.phone.trim().length > 0
          ? payload.phone
          : "customer@commerce-os.local";
      const emailRecipient =
        typeof payload.email === "string" && payload.email.trim().length > 0
          ? payload.email
          : "customer@commerce-os.local";

      const channels: Array<{ channel: string; recipient: string }> = [
        { channel: "SMS", recipient: smsRecipient },
        { channel: "EMAIL", recipient: emailRecipient },
      ];

      for (const { channel, recipient } of channels) {
        try {
          const delivery = await prisma.notificationDelivery.create({
            data: {
              tenantId: typeof event.tenantId === "string" && event.tenantId ? event.tenantId : null,
              channel,
              recipient,
              templateKey: eventType,
              title: rendered.title,
              body: rendered.body,
              status: "QUEUED",
              outboxEventId: event.id,
            },
          });

          // Simulate transport: mark as SENT immediately (no real SMS/email gateway).
          await prisma.notificationDelivery.update({
            where: { id: delivery.id },
            data: { status: "SENT", sentAt: new Date() },
          });

          console.log(`[Worker ${WORKER_ID}] Notification ${channel} sent for ${eventType} (event ${event.id})`);
        } catch (err: any) {
          console.error(`[Worker ${WORKER_ID}] Notification write failed for ${eventType} (${channel}):`, err?.message);
        }
      }
    }
  }

  // ── Loyalty earning (ADR-008): ORDER_PAID → 1 point per 10,000 IRR ──
  if (eventType === "ORDER_PAID") {
    try {
      const orderId =
        typeof payload.orderId === "string" && payload.orderId.trim().length > 0
          ? payload.orderId
          : null;

      if (!orderId) {
        console.log(`[Worker ${WORKER_ID}] Loyalty earn skipped for event ${event.id}: payload has no orderId`);
      } else {
        // The order may not exist (DB-down / demo mode): skip silently with a debug log.
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: { id: true, tenantId: true, userId: true, orderNumber: true, totalAmount: true },
        });

        if (!order) {
          console.log(`[Worker ${WORKER_ID}] Loyalty earn skipped for event ${event.id}: order ${orderId} not found`);
        } else {
          const { tenantId: orderTenantId, userId, orderNumber, id: paidOrderId } = order;

          if (!userId) {
            console.log(`[Worker ${WORKER_ID}] Loyalty earn skipped for event ${event.id}: order ${orderId} has no user`);
          } else {
            // EARN_RULE: points = floor(totalRials / 10,000) × LOYALTY_POINTS_PER_10000_IRR
            const totalRials = Number(order.totalAmount.toString());
            const points = Math.floor((totalRials / 10000) * LOYALTY_POINTS_PER_10000_IRR);

            if (points > 0) {
              const newBalance = await prisma.$transaction(async (tx: any) => {
                const account = await tx.loyaltyAccount.upsert({
                  where: { tenantId_userId: { tenantId: orderTenantId, userId } },
                  create: { tenantId: orderTenantId, userId },
                  update: {},
                });

                const newPoints = account.points + points;

                await tx.loyaltyAccount.update({
                  where: { id: account.id },
                  data: { points: newPoints, tier: loyaltyTierFor(newPoints) },
                });

                await tx.loyaltyTransaction.create({
                  data: {
                    accountId: account.id,
                    direction: "EARN",
                    points,
                    refType: "ORDER_PAID",
                    refId: paidOrderId,
                    description: `کسب امتیاز سفارش ${orderNumber}`,
                    balanceAfter: newPoints,
                  },
                });

                return newPoints;
              });

              console.log(`[Worker ${WORKER_ID}] Loyalty +${points} points for order ${orderNumber} (balance ${newBalance})`);
            }
          }
        }
      }
    } catch (err: any) {
      console.error(`[Worker ${WORKER_ID}] Loyalty earn failed for event ${event.id}:`, err?.message);
    }
  }

  // ── Digital grants (ADR-012): ORDER_PAID → لایسنس دانلود برای خطوط دیجیتال ──
  // Idempotent via the orderLineId unique constraint: SELECT existing → skip,
  // concurrent create races (P2002) count as skipped. DB-down stays silent so
  // the outbox loop (and every other side effect) keeps running.
  if (eventType === "ORDER_PAID") {
    try {
      const grantOrderId =
        typeof payload.orderId === "string" && payload.orderId.trim().length > 0
          ? payload.orderId
          : null;

      if (!grantOrderId) {
        console.log(`[Worker ${WORKER_ID}] Digital grants skipped for event ${event.id}: payload has no orderId`);
      } else {
        // The order may not exist (DB-down / demo mode): skip silently with a debug log.
        const grantOrder = await prisma.order.findUnique({
          where: { id: grantOrderId },
          select: {
            id: true,
            tenantId: true,
            userId: true,
            customerPhone: true,
            lines: {
              select: {
                id: true,
                variantId: true,
                titleFa: true,
                variant: { select: { digitalFileUrl: true } },
              },
            },
          },
        });

        if (!grantOrder) {
          console.log(`[Worker ${WORKER_ID}] Digital grants skipped for event ${event.id}: order ${grantOrderId} not found`);
        } else {
          const now = new Date();
          const expiresAt = new Date(now.getTime() + DIGITAL_GRANT_TTL_DAYS * 24 * 60 * 60 * 1000);
          const grantPhone =
            typeof payload.phone === "string" && payload.phone.trim().length > 0
              ? payload.phone
              : grantOrder.customerPhone;

          let grantsCreated = 0;
          let grantsSkipped = 0;

          for (const line of grantOrder.lines) {
            // Only digital lines (variant has a file) get a license — physical untouched (ADR-012)
            if (!line.variant?.digitalFileUrl) {
              continue;
            }

            try {
              const existing = await prisma.digitalGrant.findUnique({
                where: { orderLineId: line.id },
                select: { id: true },
              });

              if (existing) {
                grantsSkipped++;
                continue;
              }

              await prisma.digitalGrant.create({
                data: {
                  tenantId: grantOrder.tenantId,
                  orderId: grantOrder.id,
                  orderLineId: line.id,
                  variantId: line.variantId,
                  userId: grantOrder.userId ?? null,
                  phone: grantPhone,
                  token: crypto.randomBytes(32).toString("hex"),
                  productTitle: line.titleFa,
                  maxDownloads: DIGITAL_GRANT_MAX_DOWNLOADS,
                  expiresAt,
                },
              });

              grantsCreated++;
            } catch (err: any) {
              // Concurrent worker won the orderLineId unique race → idempotent skip
              if (err?.code === "P2002") {
                grantsSkipped++;
                continue;
              }
              throw err;
            }
          }

          console.log(
            `[Worker ${WORKER_ID}] Digital grants for order ${grantOrderId}: created ${grantsCreated}, skipped ${grantsSkipped}`
          );
        }
      }
    } catch (err: any) {
      // DB-down: silent — grant creation must never break the outbox loop
      console.error(`[Worker ${WORKER_ID}] Digital grants failed for event ${event.id}:`, err?.message);
    }
  }

  // ── HMAC-signed outgoing webhook ──
  const webhookTarget = process.env.WEBHOOK_TARGET_URL;
  if (webhookTarget) {
    try {
      const payloadJson = JSON.stringify(payload);
      const secret = process.env.WEBHOOK_SECRET || process.env.AUTH_SECRET || "dev-webhook-secret";
      const signature = crypto.createHmac("sha256", secret).update(payloadJson).digest("hex");
      const tenantId = typeof event.tenantId === "string" && event.tenantId ? event.tenantId : NIL_TENANT_UUID;

      const delivery = await prisma.webhookDelivery.create({
        data: {
          tenantId,
          eventType,
          targetUrl: webhookTarget,
          payloadJson: payload,
          signature,
          status: "PENDING",
          attempts: 0,
        },
      });

      let status = "FAILED";
      let lastError: string | null = null;
      try {
        const response = await fetch(webhookTarget, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-commerce-signature": signature,
            "x-commerce-event": eventType,
          },
          body: payloadJson,
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

      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status,
          attempts: { increment: 1 },
          lastError,
          ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
        },
      });

      console.log(`[Worker ${WORKER_ID}] Webhook ${eventType} → ${status} (${webhookTarget})`);
    } catch (err: any) {
      console.error(`[Worker ${WORKER_ID}] Webhook delivery failed for ${eventType}:`, err?.message);
    }
  }
}

async function processOutboxBatch(): Promise<number> {
  const claimed: any[] = await prisma.$queryRaw`
    UPDATE outbox_events
    SET status = 'PROCESSING', "lockedAt" = NOW(), "workerId" = ${WORKER_ID}
    WHERE id IN (
      SELECT id FROM outbox_events
      WHERE status = 'PENDING' AND "availableAt" <= NOW()
      ORDER BY "availableAt" ASC
      LIMIT 10
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id, "eventType", "payloadJson", "tenantId"
  `;

  for (const event of claimed) {
    try {
      console.log(`[Worker ${WORKER_ID}] Processing event: ${event.eventType} (ID: ${event.id})`);

      await prisma.$executeRaw`
        UPDATE outbox_events
        SET status = 'PROCESSED'
        WHERE id = ${event.id}::uuid
      `;

      // Real handling: close the outbox event into notifications and,
      // when configured, fire the HMAC-signed outgoing webhook.
      await handleOutboxEventSideEffects(event);
    } catch (err: any) {
      console.error(`[Worker ${WORKER_ID}] Error processing event ${event.id}:`, err?.message);
      await prisma.$executeRaw`
        UPDATE outbox_events
        SET status = 'PENDING', "retryCount" = "retryCount" + 1, "lockedAt" = NULL, "workerId" = NULL
        WHERE id = ${event.id}::uuid
      `;
    }
  }

  return claimed.length;
}

async function sweepExpiredReservations(): Promise<number> {
  const expired: any[] = await prisma.$queryRaw`
    SELECT id, "tenantId", "storeId" FROM inventory_reservations
    WHERE status = 'ACTIVE' AND "expiresAt" <= NOW()
    LIMIT 20
    FOR UPDATE SKIP LOCKED
  `;

  for (const res of expired) {
    console.log(`[Worker ${WORKER_ID}] Expiring inventory reservation: ${res.id}`);
    const lines: any[] = await prisma.$queryRaw`
      SELECT "variantId", "reservedQty" FROM inventory_reservation_lines
      WHERE "reservationId" = ${res.id}::uuid
    `;

    await prisma.$transaction(async (tx: any) => {
      for (const line of lines) {
        await tx.$executeRaw`
          UPDATE inventory_levels
          SET "reservedQty" = GREATEST(0, "reservedQty" - ${line.reservedQty})
          WHERE "tenantId" = ${res.tenantId}::uuid
            AND "storeId" = ${res.storeId}::uuid
            AND "variantId" = ${line.variantId}::uuid
        `;
      }

      await tx.$executeRaw`
        UPDATE inventory_reservations
        SET status = 'EXPIRED', "updatedAt" = NOW()
        WHERE id = ${res.id}::uuid
      `;
    });
  }

  return expired.length;
}

// ── ADR-009: اسکن دوره‌ای اعضای سررسیدشده اشتراک (بدون بار روی مسیر پرداخت) ──
// برای هر عضو ACTIVE با nextRunAt <= now: صدور رویداد Outbox
// SUBSCRIPTION_RENEWAL_DUE + نوتیفیکیشن فارسی (SMS + EMAIL) + جلو بردن
// nextRunAt به‌اندازه بازه پلن. تبدیل به سفارش/پرداخت در فاز درگاه توکن‌پذیر.
// Production note: with multiple worker instances this claim should use
// `FOR UPDATE SKIP LOCKED` raw SQL (like processOutboxBatch); with the single
// daemon instance plain findMany is sufficient and keeps the code simple.
async function processDueSubscriptions(): Promise<number> {
  let due: any[];
  try {
    due = await prisma.subscription.findMany({
      where: { status: "ACTIVE", nextRunAt: { lte: new Date() } },
      include: { plan: { select: { intervalDays: true } } },
      orderBy: { nextRunAt: "asc" },
      take: 20,
    });
  } catch (err: any) {
    // DB-down: the whole sweep is skipped so the main loop keeps running
    console.error(`[Worker ${WORKER_ID}] Subscription sweep skipped (DB unavailable):`, err?.message);
    return 0;
  }

  let processed = 0;

  for (const sub of due) {
    try {
      await prisma.$transaction(async (tx: any) => {
        // Plan row missing (FK restrict normally prevents this): expire honestly
        if (!sub.plan) {
          await tx.subscription.update({
            where: { id: sub.id },
            data: { status: "EXPIRED" },
          });
          console.log(`[Worker ${WORKER_ID}] Subscription ${sub.id} EXPIRED (plan missing)`);
          return;
        }

        const now = new Date();
        const payload = {
          subscriptionId: sub.id,
          planId: sub.planId,
          userId: sub.userId,
          phone: sub.phone,
          quantity: sub.quantity,
        };

        // Outbox event for downstream consumers (order capture in a later phase)
        const outboxEvent = await tx.outboxEvent.create({
          data: {
            tenantId: sub.tenantId,
            eventType: "SUBSCRIPTION_RENEWAL_DUE",
            payloadJson: payload,
            status: "PENDING",
          },
        });

        // Renewal reminders (SMS + EMAIL, simulated transport) rendered by the
        // local Persian template registry. Created directly in this transaction —
        // SUBSCRIPTION_RENEWAL_DUE is deliberately NOT in NOTIFICATION_EVENT_TYPES
        // (the outbox handler would then duplicate these notifications).
        const rendered = renderNotificationTemplate("SUBSCRIPTION_RENEWAL_DUE", payload);

        if (rendered) {
          const channels: Array<{ channel: string; recipient: string }> = [
            { channel: "SMS", recipient: sub.phone },
            { channel: "EMAIL", recipient: "customer@commerce-os.local" },
          ];

          for (const { channel, recipient } of channels) {
            const delivery = await tx.notificationDelivery.create({
              data: {
                tenantId: sub.tenantId,
                channel,
                recipient,
                templateKey: "SUBSCRIPTION_RENEWAL_DUE",
                title: rendered.title,
                body: rendered.body,
                status: "QUEUED",
                outboxEventId: outboxEvent.id,
              },
            });

            // Simulate transport: mark as SENT immediately (no real SMS/email gateway).
            await tx.notificationDelivery.update({
              where: { id: delivery.id },
              data: { status: "SENT", sentAt: now },
            });
          }
        }

        // Advance the cycle: lastRunAt = now, nextRunAt += plan interval
        await tx.subscription.update({
          where: { id: sub.id },
          data: {
            lastRunAt: now,
            nextRunAt: new Date(now.getTime() + sub.plan.intervalDays * 24 * 60 * 60 * 1000),
            cyclesRun: { increment: 1 },
          },
        });
      });

      processed++;
      console.log(`[Worker ${WORKER_ID}] Subscription renewal processed: ${sub.id}`);
    } catch (err: any) {
      // One bad subscription must not stop the batch
      console.error(`[Worker ${WORKER_ID}] Subscription renewal failed for ${sub.id}:`, err?.message);
    }
  }

  return processed;
}

async function mainLoop() {
  console.log(`🚀 [Commerce OS Worker] Started daemon ${WORKER_ID}`);

  while (isRunning) {
    try {
      const outboxCount = await processOutboxBatch();
      const expiredCount = await sweepExpiredReservations();
      const dueSubscriptionsCount = await processDueSubscriptions();

      if (outboxCount === 0 && expiredCount === 0 && dueSubscriptionsCount === 0) {
        // Sleep 2 seconds when idle
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err: any) {
      // If DB is offline during startup/testing, log gracefully
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log(`[Worker ${WORKER_ID}] Shutdown complete`);
}

process.on("SIGINT", () => {
  console.log("Shutting down worker...");
  isRunning = false;
});

process.on("SIGTERM", () => {
  console.log("Shutting down worker...");
  isRunning = false;
});

mainLoop();
