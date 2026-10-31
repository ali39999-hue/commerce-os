import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { calculateQuote, Quote, QuoteLineInput, CouponRule, Money } from "@commerce-os/domain";
import { DEMO_FALLBACK_PRODUCTS } from "../catalog/demo-data";

export interface CouponView {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans: number | null;
  minPurchaseTomans: number;
  usedCount: number;
  usageLimit: number;
  expiresAt: string;
  active: boolean;
}

export interface CreateCouponInput {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans?: number | null;
  minPurchaseTomans?: number;
  usageLimit?: number;
  expiresAt?: string;
  storeSlug?: string;
}

const DEFAULT_COUPONS: CouponView[] = [
  {
    id: "cpn_welcome10",
    code: "WELCOME10",
    type: "PERCENT",
    value: 10,
    maxDiscountTomans: 500000,
    minPurchaseTomans: 0,
    usedCount: 14,
    usageLimit: 500,
    expiresAt: new Date(Date.now() + 21 * 86400000).toISOString(),
    active: true,
  },
  {
    id: "cpn_off50",
    code: "OFF50",
    type: "FIXED",
    value: 50000,
    maxDiscountTomans: null,
    minPurchaseTomans: 2000000,
    usedCount: 3,
    usageLimit: 100,
    expiresAt: new Date(Date.now() + 45 * 86400000).toISOString(),
    active: true,
  },
];

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async generateQuote(params: {
    storeId: string;
    items: QuoteLineInput[];
    couponCode?: string;
  }): Promise<Quote> {
    const { storeId, items, couponCode } = params;

    let tenantId = "demo-tenant-id";
    const variantMap = new Map<string, any>();

    // Pre-populate with fallback data
    for (const p of DEMO_FALLBACK_PRODUCTS) {
      for (const v of p.variants) {
        variantMap.set(v.id, {
          id: v.id,
          productId: p.id,
          title: `${p.titleFa} - ${v.titleFa}`,
          sku: v.sku,
          priceAmount: BigInt(v.priceAmount),
          currency: v.currency,
        });
      }
    }

    try {
      const store = await this.prisma.store.findUnique({
        where: { id: storeId },
      });

      if (store) {
        tenantId = store.tenantId;
        const variantIds = items.map((i) => i.variantId);
        const dbVariants = await this.prisma.productVariant.findMany({
          where: {
            id: { in: variantIds },
            storeId,
            status: "ACTIVE",
          },
        });

        for (const v of dbVariants) {
          variantMap.set(v.id, {
            id: v.id,
            productId: v.productId,
            title: v.titleFa,
            sku: v.sku,
            priceAmount: BigInt(v.priceAmount.toString()),
            currency: v.currency,
          });
        }
      }
    } catch {
      // Fallback in-memory
    }

    let couponRule: CouponRule | undefined;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      try {
        const dbCoupon = await this.prisma.coupon.findFirst({
          where: {
            code: cleanCode,
            storeId,
          },
        });

        if (dbCoupon) {
          const now = Date.now();
          const expired = dbCoupon.expiresAt && dbCoupon.expiresAt.getTime() < now;
          const limitReached = dbCoupon.usageLimit && dbCoupon.usedCount >= dbCoupon.usageLimit;
          if (!expired && !limitReached) {
            couponRule = {
              code: dbCoupon.code,
              discountBps: dbCoupon.discountBps ?? undefined,
              fixedDiscount: dbCoupon.fixedDiscount ? Money.fromRials(BigInt(dbCoupon.fixedDiscount.toString())) : undefined,
              maxDiscount: dbCoupon.maxDiscount ? Money.fromRials(BigInt(dbCoupon.maxDiscount.toString())) : undefined,
              minSubtotal: dbCoupon.minSubtotal ? Money.fromRials(BigInt(dbCoupon.minSubtotal.toString())) : undefined,
            };
          }
        }
      } catch {
        // DB down fallback
      }

      if (!couponRule) {
        if (cleanCode === "WELCOME10" || cleanCode === "OFF10") {
          couponRule = {
            code: cleanCode,
            discountBps: 1000, // 10%
            maxDiscount: Money.fromTomans(500000n),
          };
        }
      }
    }

    return calculateQuote({
      storeId,
      tenantId,
      items,
      variantFinder: (id) => variantMap.get(id),
      coupon: couponRule,
    });
  }

  async listCoupons(params?: {
    storeSlug?: string;
    tenantId?: string;
  }): Promise<{ items: CouponView[]; dbAvailable: boolean; source: "DB" | "FALLBACK" }> {
    try {
      const store = await this.prisma.store.findFirst({
        where: params?.storeSlug ? { slug: params.storeSlug } : {},
        select: { id: true, tenantId: true },
      });

      const whereClause: any = {};
      if (store) {
        whereClause.storeId = store.id;
      } else if (params?.tenantId && params.tenantId !== "00000000-0000-0000-0000-000000000000") {
        whereClause.tenantId = params.tenantId;
      }

      const rows = await this.prisma.coupon.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });

      const items: CouponView[] = rows.map((r) => {
        const isPercent = r.discountBps !== null && r.discountBps !== undefined;
        const now = Date.now();
        const active = r.expiresAt ? r.expiresAt.getTime() > now : true;
        const value = isPercent ? (r.discountBps ?? 0) / 100 : Number(r.fixedDiscount ?? 0) / 10;
        const maxDiscountTomans = r.maxDiscount ? Number(r.maxDiscount) / 10 : null;
        const minPurchaseTomans = r.minSubtotal ? Number(r.minSubtotal) / 10 : 0;

        return {
          id: r.id,
          code: r.code,
          type: isPercent ? "PERCENT" : "FIXED",
          value,
          maxDiscountTomans,
          minPurchaseTomans,
          usedCount: r.usedCount,
          usageLimit: r.usageLimit ?? 0,
          expiresAt: r.expiresAt ? r.expiresAt.toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
          active,
        };
      });

      return {
        items: items.length > 0 ? items : DEFAULT_COUPONS,
        dbAvailable: true,
        source: "DB",
      };
    } catch {
      return {
        items: DEFAULT_COUPONS,
        dbAvailable: false,
        source: "FALLBACK",
      };
    }
  }

  async createCoupon(input: CreateCouponInput, tenantId?: string): Promise<{ ok: boolean; item?: CouponView; message?: string }> {
    const cleanCode = (input.code ?? "").trim().toUpperCase();
    if (!cleanCode || !/^[A-Z0-9_-]{3,24}$/.test(cleanCode)) {
      throw new BadRequestException("کد کوپن نامعتبر است (۳ تا ۲۴ نویسه لاتین و رقم)");
    }

    try {
      let store = await this.prisma.store.findFirst({
        where: input.storeSlug ? { slug: input.storeSlug } : {},
        select: { id: true, tenantId: true },
      });

      if (!store) {
        store = await this.prisma.store.findFirst({
          select: { id: true, tenantId: true },
        });
      }

      if (!store) {
        throw new BadRequestException("فروشگاهی برای ثبت کوپن یافت نشد");
      }

      const isPercent = input.type === "PERCENT";
      const discountBps = isPercent ? Math.round(input.value * 100) : null;
      const fixedDiscount = !isPercent ? (Math.round(input.value) * 10).toString() : null;
      const maxDiscount = input.maxDiscountTomans ? (Math.round(input.maxDiscountTomans) * 10).toString() : null;
      const minSubtotal = input.minPurchaseTomans ? (Math.round(input.minPurchaseTomans) * 10).toString() : null;
      const usageLimit = input.usageLimit && input.usageLimit > 0 ? Math.round(input.usageLimit) : null;
      const expiresAt = input.expiresAt ? new Date(input.expiresAt) : new Date(Date.now() + 30 * 86400000);

      const created = await this.prisma.coupon.create({
        data: {
          tenantId: store.tenantId,
          storeId: store.id,
          code: cleanCode,
          discountBps,
          fixedDiscount,
          maxDiscount,
          minSubtotal,
          usageLimit,
          expiresAt,
        },
      });

      const item: CouponView = {
        id: created.id,
        code: created.code,
        type: isPercent ? "PERCENT" : "FIXED",
        value: input.value,
        maxDiscountTomans: input.maxDiscountTomans ?? null,
        minPurchaseTomans: input.minPurchaseTomans ?? 0,
        usedCount: created.usedCount,
        usageLimit: created.usageLimit ?? 0,
        expiresAt: created.expiresAt ? created.expiresAt.toISOString() : expiresAt.toISOString(),
        active: true,
      };

      return { ok: true, item };
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new BadRequestException("این کد کوپن قبلاً در سیستم ثبت شده است");
      }
      throw new BadRequestException(err?.message || "خطا در ثبت کوپن در پایگاه داده");
    }
  }

  async toggleCoupon(id: string): Promise<{ ok: boolean; active: boolean }> {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: { id },
      });

      if (!coupon) {
        throw new NotFoundException("کوپن یافت نشد");
      }

      const now = Date.now();
      const currentlyActive = coupon.expiresAt ? coupon.expiresAt.getTime() > now : true;
      const newExpiresAt = currentlyActive ? new Date(0) : new Date(Date.now() + 30 * 86400000);

      const updated = await this.prisma.coupon.update({
        where: { id },
        data: { expiresAt: newExpiresAt },
      });

      return {
        ok: true,
        active: updated.expiresAt ? updated.expiresAt.getTime() > Date.now() : true,
      };
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      throw new BadRequestException(err?.message || "خطا در به‌روزرسانی کوپن");
    }
  }
}
