import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { validateIranianMobile } from "@commerce-os/localization";
import { PrismaService } from "../database/prisma.service";
import type { SubscriptionStatus } from "../generated/prisma/client";

// ── ADR-009: اشتراک‌های دوره‌ای (Recurring Subscriptions) ──
// درگاه‌های ایرانی توکن‌سازی کارت عمومی ندارند؛ کسر خودکار فعلاً ممکن نیست.
// اصل تاب‌آوری: فهرست پلن‌ها در DB-down با پلن‌های نمونه پاسخ می‌دهد، اما
// «ثبت عضویت» تعهد دوره‌ای است و هرگز ساختگی ثبت نمی‌شود (۵۰۳ صادقانه).

export type PlansSource = "DB" | "FALLBACK";

export interface SubscriptionPlanItem {
  id: string;
  slug: string;
  titleFa: string;
  description: string | null;
  intervalDays: number;
  priceRials: string;
  priceTomans: string;
  currency: string;
}

export interface PlansResponse {
  source: PlansSource;
  items: SubscriptionPlanItem[];
}

export interface CreateSubscriptionInput {
  planId?: string;
  userId?: string;
  phone?: string;
  quantity?: number;
}

export interface SubscriptionPlanRef {
  id: string;
  slug: string;
  titleFa: string;
  intervalDays: number;
}

export interface SubscriptionView {
  id: string;
  status: string;
  quantity: number;
  phone: string;
  nextRunAt: string;
  lastRunAt: string | null;
  cyclesRun: number;
  cancelReason: string | null;
  createdAt: string;
  plan: SubscriptionPlanRef;
}

export interface CreateSubscriptionResult {
  id: string;
  // برای کاربر ناشناس: شناسه‌ای که بعداً می‌تواند حساب خودش را به آن متصل کند
  profileBindingId: string;
  status: string;
  quantity: number;
  phone: string;
  nextRunAt: string;
  cyclesRun: number;
  plan: SubscriptionPlanRef;
}

export interface UserSubscriptionsResult {
  items: SubscriptionView[];
  dbAvailable: boolean;
}

export interface AdminSubscriptionsResult {
  items: SubscriptionView[];
  dbAvailable: boolean;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 12;

const VALID_STATUSES: readonly SubscriptionStatus[] = ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"];

// ── پلن‌های نمونه (FALLBACK): سناریوی فروشگاه قهوه — ADR-009 ──
const FALLBACK_PLANS: SubscriptionPlanItem[] = [
  {
    id: "plan_demo_1",
    slug: "monthly-ethiopia-coffee",
    titleFa: "اشتراک ماهانه قهوه اتیوپی",
    description: "هر ماه یک بسته قهوه تک‌خاستگاه اتیوپی، تازه‌برشت، درب منزل شما تحویل داده می‌شود.",
    intervalDays: 30,
    priceRials: "4500000",
    priceTomans: "450000",
    currency: "IRR",
  },
  {
    id: "plan_demo_2",
    slug: "biweekly-coffee",
    titleFa: "اشتراک دوهفته‌ای قهوه",
    description: "هر دو هفته یک بسته قهوه تازه‌برشت؛ مناسب مصرف روزانه خانواده‌های قهوه‌دوست.",
    intervalDays: 14,
    priceRials: "2500000",
    priceTomans: "250000",
    currency: "IRR",
  },
  {
    id: "plan_demo_3",
    slug: "seasonal-blend",
    titleFa: "اشتراک فصلی ترکیبی",
    description: "هر فصل یک بسته ترکیبی ویژه از برشت‌های فصل با تخفیف اشتراکی.",
    intervalDays: 90,
    priceRials: "12000000",
    priceTomans: "1200000",
    currency: "IRR",
  },
];

function toPlanItem(plan: {
  id: string;
  slug: string;
  titleFa: string;
  description: string | null;
  intervalDays: number;
  priceRials: { toString(): string };
  currency: string;
}): SubscriptionPlanItem {
  const price = BigInt(plan.priceRials.toString());
  return {
    id: plan.id,
    slug: plan.slug,
    titleFa: plan.titleFa,
    description: plan.description,
    intervalDays: plan.intervalDays,
    priceRials: price.toString(),
    priceTomans: (price / 10n).toString(),
    currency: plan.currency,
  };
}

function toSubscriptionView(row: {
  id: string;
  status: SubscriptionStatus;
  quantity: number;
  phone: string;
  nextRunAt: Date;
  lastRunAt: Date | null;
  cyclesRun: number;
  cancelReason: string | null;
  createdAt: Date;
  plan: { id: string; slug: string; titleFa: string; intervalDays: number };
}): SubscriptionView {
  return {
    id: row.id,
    status: row.status,
    quantity: row.quantity,
    phone: row.phone,
    nextRunAt: row.nextRunAt.toISOString(),
    lastRunAt: row.lastRunAt ? row.lastRunAt.toISOString() : null,
    cyclesRun: row.cyclesRun,
    cancelReason: row.cancelReason,
    createdAt: row.createdAt.toISOString(),
    plan: {
      id: row.plan.id,
      slug: row.plan.slug,
      titleFa: row.plan.titleFa,
      intervalDays: row.plan.intervalDays,
    },
  };
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

type SubscriptionAction = "pause" | "resume" | "cancel";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── فهرست پلن‌های فعال فروشگاه؛ DB-down → پلن‌های نمونه (FALLBACK) ──
  async listPlans(storeSlug: string): Promise<PlansResponse> {
    if (!storeSlug || storeSlug.trim().length === 0) {
      throw new BadRequestException("شناسه فروشگاه الزامی است");
    }

    try {
      // Resolve store exactly like catalog.resolveStore (active store of active tenant)
      const store = await this.prisma.store.findFirst({
        where: {
          slug: storeSlug,
          status: "ACTIVE",
          organization: { is: { tenant: { is: { status: "ACTIVE" } } } },
        },
        select: { id: true, tenantId: true },
      });

      if (!store) {
        throw new NotFoundException("فروشگاهی با این شناسه فعال یافت نشد");
      }

      const plans = await this.prisma.subscriptionPlan.findMany({
        where: { tenantId: store.tenantId, storeId: store.id, isActive: true },
        orderBy: { createdAt: "asc" },
      });

      return { source: "DB", items: plans.map(toPlanItem) };
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }
      // DB-down (store lookup or plans query): resilient demo plans below
    }

    return { source: "FALLBACK", items: FALLBACK_PLANS };
  }

  // ── ثبت عضویت؛ DB-down → ۵۰۳ صادقانه (تعهد دوره‌ای ساختگی ثبت نمی‌شود) ──
  async create(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult> {
    const phone = (input.phone ?? "").trim();
    if (!validateIranianMobile(phone)) {
      throw new BadRequestException("شماره موبایل نامعتبر است (باید ۱۱ رقم و با ۰۹ شروع شود)");
    }

    const quantity = Math.trunc(Number(input.quantity ?? 1));
    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      throw new BadRequestException(`تعداد باید عددی بین ${MIN_QUANTITY} تا ${MAX_QUANTITY} باشد`);
    }

    const planId = (input.planId ?? "").trim();
    if (!planId) {
      throw new BadRequestException("شناسه پلن اشتراک الزامی است");
    }

    try {
      const plan = await this.prisma.subscriptionPlan.findFirst({
        where: { id: planId, isActive: true },
      });

      if (!plan) {
        throw new NotFoundException("پلن اشتراک یافت نشد");
      }

      // کاربر ناشناس: شناسه موقت صادر می‌شود تا بعداً حساب واقعی خود را متصل کند
      const profileBindingId = (input.userId ?? "").trim() || randomUUID();

      const now = new Date();
      const subscription = await this.prisma.subscription.create({
        data: {
          tenantId: plan.tenantId,
          planId: plan.id,
          userId: profileBindingId,
          phone,
          quantity,
          status: "ACTIVE",
          nextRunAt: addDays(now, plan.intervalDays),
        },
      });

      return {
        id: subscription.id,
        profileBindingId,
        status: subscription.status,
        quantity: subscription.quantity,
        phone: subscription.phone,
        nextRunAt: subscription.nextRunAt.toISOString(),
        cyclesRun: subscription.cyclesRun,
        plan: {
          id: plan.id,
          slug: plan.slug,
          titleFa: plan.titleFa,
          intervalDays: plan.intervalDays,
        },
      };
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }
      // DB-down: honest refusal per ADR-009 — a fake recurring commitment is never recorded
      throw new ServiceUnavailableException(
        "ثبت اشتراک موقتاً در دسترس نیست — تعهد دوره‌ای ساختگی ثبت نمی‌شود"
      );
    }
  }

  // ── اشتراک‌های من (جدیدترین اول) ──
  async listForUser(userId: string, tenantId: string): Promise<UserSubscriptionsResult> {
    try {
      const rows = await this.prisma.subscription.findMany({
        where: { tenantId, userId },
        orderBy: { createdAt: "desc" },
        include: {
          plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } },
        },
      });

      return { items: rows.map(toSubscriptionView), dbAvailable: true };
    } catch {
      // DB-down: zero-state so the user panel never breaks
      return { items: [], dbAvailable: false };
    }
  }

  // ── توقف: فقط ACTIVE → PAUSED ──
  async pause(id: string, tenantId: string, reason?: string): Promise<SubscriptionView> {
    return this.applyTransition(id, tenantId, "pause", reason);
  }

  // ── ادامه: فقط PAUSED → ACTIVE ──
  async resume(id: string, tenantId: string): Promise<SubscriptionView> {
    return this.applyTransition(id, tenantId, "resume");
  }

  // ── لغو: ACTIVE|PAUSED → CANCELLED (با ثبت دلیل) ──
  async cancel(id: string, tenantId: string, reason?: string): Promise<SubscriptionView> {
    return this.applyTransition(id, tenantId, "cancel", reason);
  }

  // ── لیست ادمین: همه اشتراک‌ها با عنوان پلن (جدیدترین اول) ──
  async adminList(tenantId: string, status?: string): Promise<AdminSubscriptionsResult> {
    let statusFilter: SubscriptionStatus | undefined;
    if (status !== undefined && status.trim().length > 0) {
      const candidate = status.trim();
      if (!VALID_STATUSES.includes(candidate as SubscriptionStatus)) {
        throw new BadRequestException("وضعیت درخواست‌شده نامعتبر است");
      }
      statusFilter = candidate as SubscriptionStatus;
    }

    try {
      const rows = await this.prisma.subscription.findMany({
        where: { tenantId, ...(statusFilter ? { status: statusFilter } : {}) },
        orderBy: { createdAt: "desc" },
        include: {
          plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } },
        },
      });

      return { items: rows.map(toSubscriptionView), dbAvailable: true };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      return { items: [], dbAvailable: false };
    }
  }

  // ── ماشین وضعیت: ACTIVE→PAUSED→ACTIVE و ACTIVE|PAUSED→CANCELLED ──
  private async applyTransition(
    id: string,
    tenantId: string,
    action: SubscriptionAction,
    reason?: string
  ): Promise<SubscriptionView> {
    try {
      const sub = await this.prisma.subscription.findFirst({
        where: { id, tenantId },
        include: {
          plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } },
        },
      });

      if (!sub) {
        throw new NotFoundException("اشتراک یافت نشد");
      }

      if (action === "pause" && sub.status !== "ACTIVE") {
        throw new BadRequestException("فقط اشتراک فعال قابل توقف است");
      }
      if (action === "resume" && sub.status !== "PAUSED") {
        throw new BadRequestException("فقط اشتراک متوقف‌شده قابل ادامه است");
      }
      if (action === "cancel" && sub.status !== "ACTIVE" && sub.status !== "PAUSED") {
        throw new BadRequestException("اشتراک لغو‌شده یا منقضی قابل لغو مجدد نیست");
      }

      const data: {
        status: SubscriptionStatus;
        cancelReason?: string | null;
      } =
        action === "pause"
          ? { status: "PAUSED" }
          : action === "resume"
            ? { status: "ACTIVE" }
            : { status: "CANCELLED", cancelReason: reason?.trim() || null };

      const updated = await this.prisma.subscription.update({
        where: { id: sub.id },
        data,
        include: {
          plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } },
        },
      });

      return toSubscriptionView(updated);
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }
      // DB-down: honest refusal — state changes on real commitments are not faked
      throw new ServiceUnavailableException(
        "عملیات اشتراک موقتاً در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید"
      );
    }
  }
}
