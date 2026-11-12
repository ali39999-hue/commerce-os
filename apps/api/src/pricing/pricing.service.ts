import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { calculateQuote, Quote, QuoteLineInput, CouponRule, Money } from "@commerce-os/domain";
import { DEMO_FALLBACK_PRODUCTS } from "../catalog/demo-data";
import { resolveStoreVariants } from "./variant-resolver";

export type CouponAudienceKind =
  | "PUBLIC"
  | "B2B_CLINIC"
  | "VISITOR_EXCLUSIVE"
  | "SPECIFIC_PHONE";

export interface CouponView {
  id: string;
  code: string;
  titleFa: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans: number | null;
  minPurchaseTomans: number;
  usedCount: number;
  usageLimit: number;
  perUserLimit: number | null;
  expiresAt: string;
  active: boolean;
  isActive: boolean;
  audienceType: CouponAudienceKind;
  customerSegment: "ALL" | "B2C" | "B2B";
  b2bOnly: boolean;
  clinicName: string | null;
  clinicLicenseNumber: string | null;
  visitorName: string | null;
  visitorCode: string | null;
  visitorPhone: string | null;
  allowedPhones: string[];
}

export interface CreateCouponInput {
  code: string;
  titleFa?: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans?: number | null;
  minPurchaseTomans?: number;
  usageLimit?: number;
  perUserLimit?: number;
  expiresAt?: string;
  storeSlug?: string;
  audienceType?: CouponAudienceKind;
  customerSegment?: "ALL" | "B2C" | "B2B";
  b2bOnly?: boolean;
  clinicName?: string;
  clinicLicenseNumber?: string;
  visitorName?: string;
  visitorCode?: string;
  visitorPhone?: string;
  allowedPhones?: string[];
}

export interface CouponValidationContext {
  subtotalRials?: bigint;
  customerPhone?: string;
  userId?: string;
  customerType?: "B2C" | "B2B" | "B2B_CLINIC";
  medicalLicenseNumber?: string;
}

export interface QuoteCouponMetadata {
  id: string;
  code: string;
  titleFa: string | null;
  audienceType: CouponAudienceKind;
  customerSegment: "ALL" | "B2C" | "B2B";
  b2bOnly: boolean;
  clinicName: string | null;
  visitorName: string | null;
  visitorCode: string | null;
}

export function normalizeIranianPhone(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let out = raw.trim();
  for (let i = 0; i < 10; i++) {
    out = out.replaceAll(persianDigits[i]!, String(i)).replaceAll(arabicDigits[i]!, String(i));
  }
  out = out.replace(/[\s\-().+]/g, "");
  if (out.startsWith("98") && out.length === 12) out = `0${out.slice(2)}`;
  if (out.startsWith("9") && out.length === 10) out = `0${out}`;
  return out || undefined;
}

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  private toCouponView(r: any): CouponView {
    const isPercent = r.discountBps !== null && r.discountBps !== undefined;
    const now = Date.now();
    const notExpired = r.expiresAt ? new Date(r.expiresAt).getTime() > now : true;
    const isEnabled = r.isActive !== false;
    const active = isEnabled && notExpired;
    const value = isPercent ? (r.discountBps ?? 0) / 100 : Math.round(Number(r.fixedDiscount ?? 0) / 10);
    const maxDiscountTomans = r.maxDiscount ? Math.round(Number(r.maxDiscount) / 10) : null;
    const minPurchaseTomans = r.minSubtotal ? Math.round(Number(r.minSubtotal) / 10) : 0;

    return {
      id: r.id,
      code: r.code,
      titleFa: r.titleFa ?? null,
      type: isPercent ? "PERCENT" : "FIXED",
      value,
      maxDiscountTomans,
      minPurchaseTomans,
      usedCount: r.usedCount ?? 0,
      usageLimit: r.usageLimit ?? 0,
      perUserLimit: r.perUserLimit ?? null,
      expiresAt: r.expiresAt
        ? new Date(r.expiresAt).toISOString()
        : new Date(Date.now() + 30 * 86400000).toISOString(),
      active,
      isActive: isEnabled,
      audienceType: (r.audienceType ?? "PUBLIC") as CouponAudienceKind,
      customerSegment: (r.customerSegment ?? (r.b2bOnly ? "B2B" : "ALL")) as "ALL" | "B2C" | "B2B",
      b2bOnly: Boolean(r.b2bOnly),
      clinicName: r.clinicName ?? null,
      clinicLicenseNumber: r.clinicLicenseNumber ?? null,
      visitorName: r.visitorName ?? null,
      visitorCode: r.visitorCode ?? null,
      visitorPhone: r.visitorPhone ?? null,
      allowedPhones: Array.isArray(r.allowedPhones) ? r.allowedPhones : [],
    };
  }

  /**
   * Central eligibility & discount evaluator shared by /pricing/coupons/validate
   * and Checkout Quote generation so Cart UI & Order Placement enforce identical rules.
   */
  private async evaluateDbCouponEligibility(
    dbCoupon: any,
    context: CouponValidationContext,
  ): Promise<{
    couponRule: CouponRule;
    discountRials: bigint;
    meta: QuoteCouponMetadata;
  }> {
    if (dbCoupon.isActive === false) {
      throw new BadRequestException("این کد تخفیف در حال حاضر توسط مدیریت غیرفعال است");
    }

    if (dbCoupon.expiresAt && new Date(dbCoupon.expiresAt).getTime() < Date.now()) {
      throw new BadRequestException("مهلت استفاده از این کد تخفیف به پایان رسیده است");
    }

    if (dbCoupon.usageLimit && dbCoupon.usedCount >= dbCoupon.usageLimit) {
      throw new BadRequestException("ظرفیت کل استفاده از این کد تخفیف تکمیل شده است");
    }

    const isB2BCustomer = context.customerType === "B2B" || context.customerType === "B2B_CLINIC";
    const normalizedCustomerPhone = normalizeIranianPhone(context.customerPhone);
    const allowedPhones = (Array.isArray(dbCoupon.allowedPhones) ? dbCoupon.allowedPhones : [])
      .map((p: string) => normalizeIranianPhone(p))
      .filter((p: string | undefined): p is string => Boolean(p));

    if (dbCoupon.b2bOnly || dbCoupon.customerSegment === "B2B" || dbCoupon.audienceType === "B2B_CLINIC") {
      if (!isB2BCustomer) {
        const clinicHint = dbCoupon.clinicName ? ` (${dbCoupon.clinicName})` : "";
        throw new BadRequestException(
          `کد تخفیف ${dbCoupon.code} ویژه کلینیک‌ها و سفارش‌های حقوقی/B2B${clinicHint} است. برای استفاده، نوع خریدار را روی «کلینیک / مرکز درمانی (B2B)» قرار دهید.`,
        );
      }

      if (allowedPhones.length > 0 || dbCoupon.clinicLicenseNumber) {
        const licenseMatches =
          Boolean(dbCoupon.clinicLicenseNumber) &&
          Boolean(context.medicalLicenseNumber) &&
          context.medicalLicenseNumber!.trim().toUpperCase() ===
            String(dbCoupon.clinicLicenseNumber).trim().toUpperCase();
        const phoneMatches =
          Boolean(normalizedCustomerPhone) && allowedPhones.includes(normalizedCustomerPhone!);

        if (!phoneMatches && !licenseMatches) {
          throw new BadRequestException(
            `این کد اختصاصی کلینیک${dbCoupon.clinicName ? ` «${dbCoupon.clinicName}»` : ""} است؛ شماره موبایل یا شماره نظام پزشکی مجاز مطابقت ندارد.`,
          );
        }
      }
    }

    if (dbCoupon.customerSegment === "B2C" && isB2BCustomer) {
      throw new BadRequestException(
        `کد تخفیف ${dbCoupon.code} صرفاً برای مشتریان مصرف‌کننده (B2C) تعریف شده و برای سفارش‌های عمده/کلینیکی قابل اعمال نیست.`,
      );
    }

    if (dbCoupon.audienceType === "SPECIFIC_PHONE") {
      if (!normalizedCustomerPhone) {
        throw new BadRequestException(
          "برای اعمال این کد اختصاصی، وارد کردن شماره موبایل خریدار الزامی است.",
        );
      }
      if (allowedPhones.length > 0 && !allowedPhones.includes(normalizedCustomerPhone)) {
        throw new BadRequestException(
          "این کد تخفیف اختصاصی فقط برای شماره‌های تاییدشده قابل استفاده است.",
        );
      }
    } else if (
      dbCoupon.audienceType === "VISITOR_EXCLUSIVE" &&
      allowedPhones.length > 0
    ) {
      if (!normalizedCustomerPhone || !allowedPhones.includes(normalizedCustomerPhone)) {
        throw new BadRequestException(
          "این کد ویزیتور برای این شماره موبایل فعال نشده است.",
        );
      }
    }

    // Per-user usage cap enforcement when buyer phone/userId is known
    if (dbCoupon.perUserLimit && (normalizedCustomerPhone || context.userId)) {
      const redemptionWhere: any[] = [];
      if (normalizedCustomerPhone) {
        redemptionWhere.push({ customerPhone: normalizedCustomerPhone });
      }
      if (context.userId) {
        redemptionWhere.push({ userId: context.userId });
      }
      const userRedemptions = await this.prisma.couponRedemption.count({
        where: {
          couponId: dbCoupon.id,
          OR: redemptionWhere,
        },
      });
      if (userRedemptions >= dbCoupon.perUserLimit) {
        throw new BadRequestException(
          `سقف مجاز استفاده از کد ${dbCoupon.code} (${dbCoupon.perUserLimit} بار برای هر خریدار) به اتمام رسیده است.`,
        );
      }
    }

    const couponRule: CouponRule = {
      code: dbCoupon.code,
      title: dbCoupon.titleFa || `کد تخفیف ${dbCoupon.code}`,
      isActive: dbCoupon.isActive !== false,
      discountBps: dbCoupon.discountBps ?? undefined,
      fixedDiscount: dbCoupon.fixedDiscount
        ? Money.fromRials(BigInt(dbCoupon.fixedDiscount.toString()))
        : undefined,
      maxDiscount: dbCoupon.maxDiscount
        ? Money.fromRials(BigInt(dbCoupon.maxDiscount.toString()))
        : undefined,
      minSubtotal: dbCoupon.minSubtotal
        ? Money.fromRials(BigInt(dbCoupon.minSubtotal.toString()))
        : undefined,
      expiresAt: dbCoupon.expiresAt ? new Date(dbCoupon.expiresAt) : undefined,
      usageLimit: dbCoupon.usageLimit ?? undefined,
      usedCount: dbCoupon.usedCount ?? 0,
    };

    const subtotal = context.subtotalRials ?? 0n;
    if (dbCoupon.minSubtotal && subtotal > 0n) {
      const minRials = BigInt(dbCoupon.minSubtotal.toString());
      if (subtotal < minRials) {
        throw new BadRequestException(
          `حداقل مبلغ سبد خرید برای اعمال این کوپن ${Money.fromRials(minRials).formatTomans()} است`,
        );
      }
    }

    let discountRials = 0n;
    if (subtotal > 0n) {
      if (dbCoupon.discountBps) {
        discountRials = (subtotal * BigInt(dbCoupon.discountBps)) / 10000n;
      } else if (dbCoupon.fixedDiscount) {
        discountRials = BigInt(dbCoupon.fixedDiscount.toString());
      }
      if (dbCoupon.maxDiscount) {
        const cap = BigInt(dbCoupon.maxDiscount.toString());
        if (discountRials > cap) discountRials = cap;
      }
      if (discountRials > subtotal) discountRials = subtotal;
    }

    return {
      couponRule,
      discountRials,
      meta: {
        id: dbCoupon.id,
        code: dbCoupon.code,
        titleFa: dbCoupon.titleFa ?? null,
        audienceType: (dbCoupon.audienceType ?? "PUBLIC") as CouponAudienceKind,
        customerSegment: (dbCoupon.customerSegment ?? "ALL") as "ALL" | "B2C" | "B2B",
        b2bOnly: Boolean(dbCoupon.b2bOnly),
        clinicName: dbCoupon.clinicName ?? null,
        visitorName: dbCoupon.visitorName ?? null,
        visitorCode: dbCoupon.visitorCode ?? null,
      },
    };
  }

  async generateQuote(params: {
    storeId: string;
    items: QuoteLineInput[];
    couponCode?: string;
    customerPhone?: string;
    userId?: string;
    customerType?: "B2C" | "B2B" | "B2B_CLINIC";
    medicalLicenseNumber?: string;
  }): Promise<Quote & { couponMeta?: QuoteCouponMetadata }> {
    const {
      storeId,
      items,
      couponCode,
      customerPhone,
      userId,
      customerType,
      medicalLicenseNumber,
    } = params;

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
        const resolved = await resolveStoreVariants(
          this.prisma,
          store.id,
          items.map((i) => ({ variantId: i.variantId })),
        );

        for (const [lookupKey, v] of resolved.entries()) {
          variantMap.set(lookupKey, {
            id: v.id,
            productId: v.productId,
            title: v.titleFa,
            sku: v.sku,
            priceAmount: v.priceAmount,
            currency: v.currency,
          });
        }
      }
    } catch {
      // Fallback in-memory
    }

    for (const line of items) {
      if (!variantMap.has(line.variantId)) {
        throw new BadRequestException(
          `کالای انتخاب‌شده (${line.variantId}) در کاتالوگ فروشگاه یافت نشد. لطفاً سبد خرید را به‌روزرسانی کنید.`,
        );
      }
    }

    let couponRule: CouponRule | undefined;
    let couponMeta: QuoteCouponMetadata | undefined;

    if (couponCode && couponCode.trim().length > 0) {
      const cleanCode = couponCode.trim().toUpperCase();
      let dbCoupon: any = null;
      let dbAvailable = true;

      try {
        dbCoupon = await this.prisma.coupon.findFirst({
          where: {
            code: cleanCode,
            storeId,
          },
        });
      } catch {
        dbAvailable = false;
      }

      if (dbCoupon) {
        const preliminaryQuote = calculateQuote({
          storeId,
          tenantId,
          items,
          variantFinder: (id) => variantMap.get(id),
        });

        const evaluated = await this.evaluateDbCouponEligibility(dbCoupon, {
          subtotalRials: preliminaryQuote.subtotal.amount,
          customerPhone,
          userId,
          customerType,
          medicalLicenseNumber,
        });
        couponRule = evaluated.couponRule;
        couponMeta = evaluated.meta;
      } else if (dbAvailable) {
        throw new BadRequestException(`کد تخفیف «${cleanCode}» معتبر نیست یا در سیستم تعریف نشده است`);
      } else if (cleanCode === "WELCOME10" || cleanCode === "OFF10") {
        couponRule = {
          code: cleanCode,
          discountBps: 1000,
          maxDiscount: Money.fromTomans(500000n),
        };
      }
    }

    try {
      const quote = calculateQuote({
        storeId,
        tenantId,
        items,
        variantFinder: (id) => variantMap.get(id),
        coupon: couponRule,
      });

      return couponMeta ? { ...quote, couponMeta } : quote;
    } catch (err: any) {
      throw new BadRequestException(err?.message || "خطا در محاسبه قیمت سبد خرید");
    }
  }

  async validateCoupon(input: {
    code: string;
    subtotalTomans?: number;
    subtotalRials?: number;
    storeSlug?: string;
    customerPhone?: string;
    userId?: string;
    customerType?: "B2C" | "B2B" | "B2B_CLINIC";
    medicalLicenseNumber?: string;
  }) {
    const cleanCode = (input.code ?? "").trim().toUpperCase();
    if (!cleanCode) {
      throw new BadRequestException("کد تخفیف وارد نشده است");
    }

    const subtotalRials =
      typeof input.subtotalRials === "number" && input.subtotalRials > 0
        ? BigInt(Math.round(input.subtotalRials))
        : typeof input.subtotalTomans === "number" && input.subtotalTomans > 0
          ? BigInt(Math.round(input.subtotalTomans)) * 10n
          : 0n;

    const store = await this.prisma.store.findFirst({
      where: input.storeSlug ? { slug: input.storeSlug } : {},
      select: { id: true, tenantId: true },
    });

    const dbCoupon = await this.prisma.coupon.findFirst({
      where: {
        code: cleanCode,
        ...(store ? { storeId: store.id } : {}),
      },
    });

    if (!dbCoupon) {
      throw new BadRequestException(`کد تخفیف «${cleanCode}» یافت نشد`);
    }

    const evaluated = await this.evaluateDbCouponEligibility(dbCoupon, {
      subtotalRials,
      customerPhone: input.customerPhone,
      userId: input.userId,
      customerType: input.customerType,
      medicalLicenseNumber: input.medicalLicenseNumber,
    });

    const view = this.toCouponView(dbCoupon);
    const discountTomans = Math.round(Number(evaluated.discountRials) / 10);

    return {
      valid: true,
      coupon: view,
      discountRials: evaluated.discountRials.toString(),
      discountTomans,
      message: view.visitorName
        ? `کد اختصاصی ویزیتور «${view.visitorName}» (${view.visitorCode ?? view.code}) تایید شد`
        : view.clinicName
          ? `سهمیه قراردادی B2B «${view.clinicName}» تایید شد`
          : `کد تخفیف ${view.code} با موفقیت اعمال شد`,
    };
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

      const isDefaultTenant =
        !params?.tenantId || params.tenantId === "00000000-0000-0000-0000-000000000000";
      const whereClause: any = {};
      if (store) {
        whereClause.storeId = store.id;
      } else if (!isDefaultTenant && params?.tenantId) {
        whereClause.tenantId = params.tenantId;
      }

      const rows = await this.prisma.coupon.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });

      return {
        items: rows.map((r) => this.toCouponView(r)),
        dbAvailable: true,
        source: "DB",
      };
    } catch {
      return {
        items: [],
        dbAvailable: false,
        source: "FALLBACK",
      };
    }
  }

  async createCoupon(
    input: CreateCouponInput,
    tenantId?: string,
  ): Promise<{ ok: boolean; item?: CouponView; message?: string }> {
    const cleanCode = (input.code ?? "").trim().toUpperCase();
    if (!cleanCode || !/^[A-Z0-9_-]{3,24}$/.test(cleanCode)) {
      throw new BadRequestException("کد کوپن نامعتبر است (۳ تا ۲۴ نویسه لاتین و رقم)");
    }

    try {
      const isDefaultTenant =
        !tenantId || tenantId === "00000000-0000-0000-0000-000000000000";

      let store = await this.prisma.store.findFirst({
        where: {
          ...(input.storeSlug ? { slug: input.storeSlug } : {}),
          ...(!isDefaultTenant ? { tenantId } : {}),
        },
        select: { id: true, tenantId: true },
      });

      if (!store) {
        store = await this.prisma.store.findFirst({
          where: !isDefaultTenant ? { tenantId } : {},
          select: { id: true, tenantId: true },
        });
      }

      if (!store) {
        throw new BadRequestException("فروشگاهی برای ثبت کوپن یافت نشد");
      }

      const audienceType: CouponAudienceKind = input.audienceType ?? "PUBLIC";
      const b2bOnly = Boolean(
        input.b2bOnly || audienceType === "B2B_CLINIC" || input.customerSegment === "B2B",
      );
      const customerSegment: "ALL" | "B2C" | "B2B" =
        input.customerSegment ?? (b2bOnly ? "B2B" : "ALL");

      const normalizedAllowedPhones = (input.allowedPhones ?? [])
        .map((p) => normalizeIranianPhone(p))
        .filter((p): p is string => Boolean(p));

      const normalizedVisitorPhone = normalizeIranianPhone(input.visitorPhone);

      if (audienceType === "SPECIFIC_PHONE" && normalizedAllowedPhones.length === 0) {
        throw new BadRequestException("برای کوپن اختصاصی شماره، حداقل یک شماره موبایل مجاز وارد کنید");
      }
      if (audienceType === "VISITOR_EXCLUSIVE" && !input.visitorCode?.trim() && !input.visitorName?.trim()) {
        throw new BadRequestException("برای کد اختصاصی ویزیتور، نام یا کد ویزیتور را وارد کنید");
      }
      if (audienceType === "B2B_CLINIC" && !input.clinicName?.trim()) {
        throw new BadRequestException("برای کوپن کلینیکی، نام کلینیک یا مرکز درمانی را وارد کنید");
      }

      const isPercent = input.type === "PERCENT";
      const discountBps = isPercent ? Math.round(input.value * 100) : null;
      const fixedDiscount = !isPercent ? (Math.round(input.value) * 10).toString() : null;
      const maxDiscount =
        input.maxDiscountTomans && input.maxDiscountTomans > 0
          ? (Math.round(input.maxDiscountTomans) * 10).toString()
          : null;
      const minSubtotal =
        input.minPurchaseTomans && input.minPurchaseTomans > 0
          ? (Math.round(input.minPurchaseTomans) * 10).toString()
          : null;
      const usageLimit = input.usageLimit && input.usageLimit > 0 ? Math.round(input.usageLimit) : null;
      const perUserLimit =
        input.perUserLimit && input.perUserLimit > 0 ? Math.round(input.perUserLimit) : null;
      const expiresAt = input.expiresAt
        ? new Date(input.expiresAt)
        : new Date(Date.now() + 90 * 86400000);

      const created = await this.prisma.coupon.create({
        data: {
          tenantId: store.tenantId,
          storeId: store.id,
          code: cleanCode,
          titleFa: input.titleFa?.trim() || null,
          isActive: true,
          audienceType,
          customerSegment,
          b2bOnly,
          clinicName: input.clinicName?.trim() || null,
          clinicLicenseNumber: input.clinicLicenseNumber?.trim() || null,
          visitorName: input.visitorName?.trim() || null,
          visitorCode: input.visitorCode?.trim() || null,
          visitorPhone: normalizedVisitorPhone ?? null,
          allowedPhones: normalizedAllowedPhones,
          perUserLimit,
          discountBps,
          fixedDiscount,
          maxDiscount,
          minSubtotal,
          usageLimit,
          expiresAt,
        },
      });

      return { ok: true, item: this.toCouponView(created) };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      if (err?.code === "P2002") {
        throw new BadRequestException("این کد کوپن قبلاً در سیستم ثبت شده است");
      }
      throw new BadRequestException(err?.message || "خطا در ثبت کوپن در پایگاه داده");
    }
  }

  async toggleCoupon(
    id: string,
    tenantId?: string,
  ): Promise<{ ok: boolean; active: boolean; isActive: boolean }> {
    try {
      const isDefaultTenant =
        !tenantId || tenantId === "00000000-0000-0000-0000-000000000000";

      const coupon = await this.prisma.coupon.findFirst({
        where: !isDefaultTenant ? { id, tenantId } : { id },
      });

      if (!coupon) {
        throw new NotFoundException("کوپن در این مستأجر یافت نشد");
      }

      const nextActive = !(coupon.isActive !== false);
      const updated = await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { isActive: nextActive },
      });

      const notExpired = updated.expiresAt ? updated.expiresAt.getTime() > Date.now() : true;
      return {
        ok: true,
        active: updated.isActive && notExpired,
        isActive: updated.isActive,
      };
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      throw new BadRequestException(err?.message || "خطا در به‌روزرسانی کوپن");
    }
  }
}
