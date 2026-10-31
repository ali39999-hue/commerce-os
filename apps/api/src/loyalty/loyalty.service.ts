import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

// ── ADR-008: امتیاز وفاداری ماهیتاً بدهی شرکت است؛ دفتر تراکنش‌نگار کیف‌پولی ──
// الگو: append-only + balanceAfter در هر ردیف + سطح مشتق از موجودی فعلی.

// ── EARN_RULE: به‌ازای هر ۱۰٬۰۰۰ ریال مبلغ قطعی سفارش، ۱ امتیاز کسب می‌شود ──
// points = floor(totalRials / 10_000)
export const EARN_UNIT_RIALS = 10_000;

export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD";
export type LoyaltyDirection = "EARN" | "REDEEM" | "EXPIRE";

// ── سطوح (ADR-008): BRONZE پیش‌فرض / SILVER از ۱٬۰۰۰ امتیاز / GOLD از ۵٬۰۰۰ امتیاز ──
export function tierFor(points: number): LoyaltyTier {
  if (points >= 5000) return "GOLD";
  if (points >= 1000) return "SILVER";
  return "BRONZE";
}

export interface EarnForOrderInput {
  tenantId: string;
  userId: string;
  orderId: string;
  orderNumber: string;
  totalRials: number;
}

export interface EarnResult {
  earned: number;
  dbAvailable: boolean;
}

export interface LoyaltyTransactionView {
  id: string;
  direction: string;
  points: number;
  refType: string;
  refId: string;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface BalanceResult {
  points: number;
  tier: string;
  transactions: LoyaltyTransactionView[];
  dbAvailable: boolean;
}

export interface HistoryResult {
  transactions: LoyaltyTransactionView[];
  dbAvailable: boolean;
}

export interface AdminAdjustInput {
  tenantId: string;
  userId: string;
  pointsDelta: number;
  reason?: string;
  actor?: string;
}

export interface AdminAdjustResult {
  points: number;
  tier: string;
  dbAvailable: boolean;
}

const HISTORY_DEFAULT_LIMIT = 20;
const HISTORY_MAX_LIMIT = 100;

function clampHistoryLimit(limit: number): number {
  if (!Number.isFinite(limit)) return HISTORY_DEFAULT_LIMIT;
  return Math.min(Math.max(Math.trunc(limit), 1), HISTORY_MAX_LIMIT);
}

function toTransactionView(t: {
  id: string;
  direction: string;
  points: number;
  refType: string;
  refId: string;
  description: string;
  balanceAfter: number;
  createdAt: Date;
}): LoyaltyTransactionView {
  return {
    id: t.id,
    direction: t.direction,
    points: t.points,
    refType: t.refType,
    refId: t.refId,
    description: t.description,
    balanceAfter: t.balanceAfter,
    createdAt: t.createdAt.toISOString(),
  };
}

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  // ── کسب امتیاز سفارش: اجرای خودکار در حلقه Outbox (رویداد ORDER_PAID) ──
  // هرگز throw نمی‌کند — حالت DB-down با { earned: 0, dbAvailable: false } پاسخ می‌دهد.
  async earnForOrder(input: EarnForOrderInput): Promise<EarnResult> {
    // EARN_RULE: 1 point per 10,000 IRR of the order's final total
    const points = Math.floor(input.totalRials / EARN_UNIT_RIALS);
    if (points <= 0) {
      return { earned: 0, dbAvailable: true };
    }

    try {
      await this.applyEarn(
        input.tenantId,
        input.userId,
        points,
        "ORDER_PAID",
        input.orderId,
        `کسب امتیاز سفارش ${input.orderNumber}`
      );
      return { earned: points, dbAvailable: true };
    } catch {
      // Resilient mode: earning must never break payment or order flows
      return { earned: 0, dbAvailable: false };
    }
  }

  // ── موجودی + سطح + تاریخچه اخیر؛ در صورت نبود حساب، با موجودی صفر ساخته می‌شود ──
  async balance(userId: string, tenantId: string, historyLimit = HISTORY_DEFAULT_LIMIT): Promise<BalanceResult> {
    try {
      const account = await this.prisma.loyaltyAccount.upsert({
        where: { tenantId_userId: { tenantId, userId } },
        create: { tenantId, userId },
        update: {},
      });

      const transactions = await this.prisma.loyaltyTransaction.findMany({
        where: { accountId: account.id },
        orderBy: { createdAt: "desc" },
        take: clampHistoryLimit(historyLimit),
      });

      return {
        points: account.points,
        tier: account.tier,
        transactions: transactions.map(toTransactionView),
        dbAvailable: true,
      };
    } catch {
      // DB-down: zero-state so the storefront never breaks
      return { points: 0, tier: "BRONZE", transactions: [], dbAvailable: false };
    }
  }

  // ── تاریخچه تراکنش‌ها (append-only دفتر امتیاز) ──
  async history(userId: string, tenantId: string, limit = HISTORY_DEFAULT_LIMIT): Promise<HistoryResult> {
    try {
      const account = await this.prisma.loyaltyAccount.findUnique({
        where: { tenantId_userId: { tenantId, userId } },
      });

      if (!account) {
        return { transactions: [], dbAvailable: true };
      }

      const transactions = await this.prisma.loyaltyTransaction.findMany({
        where: { accountId: account.id },
        orderBy: { createdAt: "desc" },
        take: clampHistoryLimit(limit),
      });

      return { transactions: transactions.map(toTransactionView), dbAvailable: true };
    } catch {
      return { transactions: [], dbAvailable: false };
    }
  }

  // ── تنظیم دستی ادمین با ردیف حسابرسی (ADR-008 §4) ──
  // علامت delta جهت تراکنش را تعیین می‌کند: مثبت EARN، منفی REDEEM.
  async adminAdjust(input: AdminAdjustInput): Promise<AdminAdjustResult> {
    const pointsDelta = Math.trunc(Number(input.pointsDelta));

    if (!Number.isFinite(pointsDelta) || pointsDelta === 0) {
      throw new BadRequestException("مقدار تغییر امتیاز نامعتبر است");
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const account = await tx.loyaltyAccount.upsert({
          where: { tenantId_userId: { tenantId: input.tenantId, userId: input.userId } },
          create: { tenantId: input.tenantId, userId: input.userId },
          update: {},
        });

        const direction: LoyaltyDirection = pointsDelta > 0 ? "EARN" : "REDEEM";

        if (direction === "REDEEM" && account.points < Math.abs(pointsDelta)) {
          throw new BadRequestException("موجودی امتیاز کافی نیست");
        }

        const newPoints = account.points + pointsDelta;
        const tier = tierFor(newPoints);

        await tx.loyaltyAccount.update({
          where: { id: account.id },
          data: { points: newPoints, tier },
        });

        await tx.loyaltyTransaction.create({
          data: {
            accountId: account.id,
            direction,
            points: Math.abs(pointsDelta),
            refType: "MANUAL_ADJUST",
            refId: input.actor || "ADMIN",
            description: input.reason || "تنظیم دستی امتیاز توسط ادمین",
            balanceAfter: newPoints,
          },
        });

        return { points: newPoints, tier };
      });

      return { ...result, dbAvailable: true };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      // DB-down: never break the admin console
      return { points: 0, tier: "BRONZE", dbAvailable: false };
    }
  }

  // ── الگوی تراکنش‌نگار کیف‌پول: upsert حساب → به‌روزرسانی موجودی/سطح → ردیف دفتر ──
  private async applyEarn(
    tenantId: string,
    userId: string,
    points: number,
    refType: string,
    refId: string,
    description: string
  ): Promise<{ points: number; tier: LoyaltyTier }> {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.loyaltyAccount.upsert({
        where: { tenantId_userId: { tenantId, userId } },
        create: { tenantId, userId, points: 0 },
        update: {},
      });

      const newPoints = account.points + points;
      const tier = tierFor(newPoints);

      await tx.loyaltyAccount.update({
        where: { id: account.id },
        data: { points: newPoints, tier },
      });

      await tx.loyaltyTransaction.create({
        data: {
          accountId: account.id,
          direction: "EARN",
          points,
          refType,
          refId,
          description,
          balanceAfter: newPoints,
        },
      });

      return { points: newPoints, tier };
    });
  }
}
