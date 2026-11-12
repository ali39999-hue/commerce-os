import { apiBase, storeSlug, formatToman, resolveVariant, type Product } from "./catalog";

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  priceAmount: string; // Rials as string
  qty: number;
  maxStock?: number;
  image?: string;
}

export interface DiscountItem {
  code?: string;
  title: string;
  amountRials: bigint;
  amountTomans: bigint;
}

export interface CartCalculation {
  subtotalRials: bigint;
  subtotalTomans: bigint;
  discountRials: bigint;
  discountTomans: bigint;
  discounts: DiscountItem[];
  taxableBaseRials: bigint;
  taxableBaseTomans: bigint;
  vatRials: bigint;
  vatTomans: bigint;
  shippingRials: bigint;
  shippingTomans: bigint;
  grandTotalRials: bigint;
  grandTotalTomans: bigint;
  totalRials: bigint;
  totalTomans: bigint;
  itemCount: number;
  freeShippingProgressPct: number;
  freeShippingRemainingTomans: bigint;
  isFreeShipping: boolean;
  freeShippingMessage: string;
  vipConsultationProgressPct: number;
  vipConsultationRemainingTomans: bigint;
  isVipConsultation: boolean;
  vipConsultationMessage: string;
  overallTierProgressPct: number;
  currentTier: 0 | 1 | 2;
}

export const FREE_SHIPPING_THRESHOLD_TOMANS = 1_500_000n; // 1,500,000 Tomans (1.5M)
export const FREE_SHIPPING_THRESHOLD_RIALS = 15_000_000n;
export const VIP_CONSULTATION_THRESHOLD_TOMANS = 3_000_000n; // 3,000,000 Tomans (3M)
export const VIP_CONSULTATION_THRESHOLD_RIALS = 30_000_000n;
export const BASE_SHIPPING_RATE_TOMANS = 150_000n;
export const BASE_SHIPPING_RATE_RIALS = 1_500_000n;
export const TIPAX_SHIPPING_RATE_TOMANS = 85_000n;
export const TIPAX_SHIPPING_RATE_RIALS = 850_000n;
export const EXPRESS_COURIER_RATE_TOMANS = 200_000n;
export const EXPRESS_COURIER_RATE_RIALS = 2_000_000n;

export const MAX_QTY_PER_ITEM = 50;

export interface ValidatedCouponRule {
  code: string;
  title: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans?: number | null;
  minPurchaseTomans?: number;
  audienceType?: "PUBLIC" | "B2B_CLINIC" | "VISITOR_EXCLUSIVE" | "SPECIFIC_PHONE";
  customerSegment?: "ALL" | "B2C" | "B2B";
  b2bOnly?: boolean;
  clinicName?: string | null;
  visitorName?: string | null;
  visitorCode?: string | null;
}

export type CartFunnelStage =
  | "BROWSING"
  | "CART_REVIEW"
  | "CHECKOUT_STARTED"
  | "SHIPPING_SELECTED"
  | "PAYMENT_INITIATED"
  | "ORDER_PLACED"
  | "ABANDONED";

const CART_SESSION_KEY = "commerce_os.cart.session_id.v1";

export function readStoredCustomerAuth(): { token?: string; phone?: string; fullName?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("dermer_customer_session");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { token?: string; user?: { phone?: string; fullName?: string } };
    return {
      token: parsed.token,
      phone: parsed.user?.phone,
      fullName: parsed.user?.fullName,
    };
  } catch {
    return {};
  }
}

export function getOrCreateCartSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  try {
    const existing = window.localStorage.getItem(CART_SESSION_KEY);
    if (existing && existing.length >= 6) return existing;
    const generated = `cart_${crypto.randomUUID()}`;
    window.localStorage.setItem(CART_SESSION_KEY, generated);
    return generated;
  } catch {
    return `cart_${Date.now()}`;
  }
}

export function rotateCartSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  try {
    const generated = `cart_${crypto.randomUUID()}`;
    window.localStorage.setItem(CART_SESSION_KEY, generated);
    return generated;
  } catch {
    return `cart_${Date.now()}`;
  }
}

export function computeCouponDiscountRials(
  rule: ValidatedCouponRule,
  subtotalRials: bigint,
): { valid: boolean; discountRials: bigint; message: string; title: string } {
  const subtotalTomans = subtotalRials / 10n;
  const minPurchase = BigInt(Math.max(0, Math.round(rule.minPurchaseTomans ?? 0)));
  if (minPurchase > 0n && subtotalTomans < minPurchase) {
    return {
      valid: false,
      discountRials: 0n,
      title: "",
      message: `حداقل مبلغ سبد خرید برای اعمال این کد ${new Intl.NumberFormat("fa-IR").format(minPurchase)} تومان است`,
    };
  }

  let discountRials = 0n;
  if (rule.type === "PERCENT") {
    const bps = BigInt(Math.round(rule.value * 100));
    discountRials = (subtotalRials * bps) / 10000n;
  } else {
    discountRials = BigInt(Math.max(0, Math.round(rule.value))) * 10n;
  }

  if (rule.maxDiscountTomans && rule.maxDiscountTomans > 0) {
    const capRials = BigInt(Math.round(rule.maxDiscountTomans)) * 10n;
    if (discountRials > capRials) discountRials = capRials;
  }

  if (discountRials > subtotalRials) discountRials = subtotalRials;

  return {
    valid: true,
    discountRials,
    title: rule.title || `کد تخفیف ${rule.code}`,
    message: `کد تخفیف ${rule.code} با موفقیت اعمال شد.`,
  };
}

export async function validateCouponRemote(params: {
  code: string;
  subtotalRials: bigint;
  customerPhone?: string;
  customerType?: "B2C" | "B2B_CLINIC";
  medicalLicenseNumber?: string;
}): Promise<{
  valid: boolean;
  rule?: ValidatedCouponRule;
  discountRials: bigint;
  message: string;
}> {
  const clean = params.code.trim().toUpperCase();
  if (!clean) {
    return { valid: false, discountRials: 0n, message: "لطفاً کد تخفیف را وارد کنید." };
  }

  const auth = readStoredCustomerAuth();
  try {
    const res = await fetch(`${apiBase}/v1/pricing/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
      body: JSON.stringify({
        code: clean,
        subtotalRials: Number(params.subtotalRials),
        storeSlug,
        customerPhone: params.customerPhone || auth.phone || undefined,
        customerType: params.customerType || "B2C",
        medicalLicenseNumber: params.medicalLicenseNumber || undefined,
      }),
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        valid: false,
        discountRials: 0n,
        message:
          (Array.isArray(data?.message) ? data.message[0] : data?.message) ||
          "کد تخفیف وارد شده معتبر نیست یا با شرایط سبد مطابقت ندارد.",
      };
    }

    const c = data.coupon || {};
    const rule: ValidatedCouponRule = {
      code: c.code || clean,
      title: c.titleFa || `کد تخفیف ${c.code || clean}`,
      type: c.type === "FIXED" ? "FIXED" : "PERCENT",
      value: Number(c.value ?? 0),
      maxDiscountTomans: c.maxDiscountTomans ?? null,
      minPurchaseTomans: c.minPurchaseTomans ?? 0,
      audienceType: c.audienceType,
      customerSegment: c.customerSegment,
      b2bOnly: Boolean(c.b2bOnly),
      clinicName: c.clinicName ?? null,
      visitorName: c.visitorName ?? null,
      visitorCode: c.visitorCode ?? null,
    };

    return {
      valid: true,
      rule,
      discountRials: BigInt(data.discountRials || "0"),
      message: data.message || `کد تخفیف ${rule.code} اعمال شد.`,
    };
  } catch {
    return {
      valid: false,
      discountRials: 0n,
      message: "برقراری ارتباط با سرور برای اعتبارسنجی کد تخفیف ناموفق بود. لطفاً مجدداً تلاش کنید.",
    };
  }
}

export async function syncCartToServer(params: {
  sessionId: string;
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  customerType?: "B2C" | "B2B_CLINIC";
  stage?: CartFunnelStage;
  couponCode?: string | null;
  shippingMethod?: string;
  subtotalTomans?: number;
  discountTomans?: number;
  totalTomans?: number;
}): Promise<void> {
  if (!params.sessionId || params.sessionId === "ssr-session") return;
  const auth = readStoredCustomerAuth();
  try {
    await fetch(`${apiBase}/v1/cart/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
      body: JSON.stringify({
        sessionId: params.sessionId,
        storeSlug,
        items: params.items.map((i) => ({
          variantId: i.variantId,
          qty: i.qty,
          titleFa: i.title,
          sku: i.sku,
          unitPriceTomans: Math.round(Number(BigInt(i.priceAmount) / 10n)),
        })),
        customerName: params.customerName || auth.fullName || undefined,
        customerPhone: params.customerPhone || auth.phone || undefined,
        customerType: params.customerType || "B2C",
        stage: params.stage,
        couponCode: params.couponCode || undefined,
        shippingMethod: params.shippingMethod || undefined,
        subtotalTomans: params.subtotalTomans,
        discountTomans: params.discountTomans,
        totalTomans: params.totalTomans,
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Non-blocking ERP telemetry sync
  }
}

export async function syncCartStageToServer(params: {
  sessionId: string;
  stage: CartFunnelStage;
  customerName?: string;
  customerPhone?: string;
  customerType?: "B2C" | "B2B_CLINIC";
  couponCode?: string | null;
  shippingMethod?: string;
  subtotalTomans?: number;
  discountTomans?: number;
  totalTomans?: number;
}): Promise<void> {
  if (!params.sessionId || params.sessionId === "ssr-session") return;
  const auth = readStoredCustomerAuth();
  try {
    await fetch(`${apiBase}/v1/cart/stage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
      body: JSON.stringify({
        sessionId: params.sessionId,
        storeSlug,
        stage: params.stage,
        customerName: params.customerName || auth.fullName || undefined,
        customerPhone: params.customerPhone || auth.phone || undefined,
        customerType: params.customerType || "B2C",
        couponCode: params.couponCode || undefined,
        shippingMethod: params.shippingMethod || undefined,
        subtotalTomans: params.subtotalTomans,
        discountTomans: params.discountTomans,
        totalTomans: params.totalTomans,
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Non-blocking stage sync
  }
}

/**
 * Fallback promo validator (legacy local compatibility only when validated rule unavailable).
 */
export function validateCoupon(
  code: string,
  subtotalRials: bigint
): { valid: boolean; discountRials: bigint; message: string; title: string } {
  const clean = code.trim().toUpperCase();
  const subtotalTomans = subtotalRials / 10n;

  if (!clean) {
    return { valid: false, discountRials: 0n, message: "کد تخفیف را وارد کنید", title: "" };
  }

  if (clean === "OFF10" || clean === "WELCOME10") {
    // 10% discount up to 500,000 Tomans (5,000,000 Rials)
    const rawDiscountRials = (subtotalRials * 10n) / 100n;
    const maxDiscountRials = 5_000_000n;
    const discountRials = rawDiscountRials > maxDiscountRials ? maxDiscountRials : rawDiscountRials;
    return {
      valid: true,
      discountRials,
      title: `کد تخفیف ${clean} (۱۰٪ تخفیف)`,
      message: `کد تخفیف ${clean} با موفقیت اعمال شد.`,
    };
  }

  if (clean === "DERMER20") {
    // 20% discount up to 1,000,000 Tomans for orders over 1,500,000 Tomans
    if (subtotalTomans < 1_500_000n) {
      return {
        valid: false,
        discountRials: 0n,
        message: "حداقل خرید برای کوپن DERMER20 مبلغ ۱,۵۰۰,۰۰۰ تومان است",
        title: "",
      };
    }
    const rawDiscountRials = (subtotalRials * 20n) / 100n;
    const maxDiscountRials = 10_000_000n;
    const discountRials = rawDiscountRials > maxDiscountRials ? maxDiscountRials : rawDiscountRials;
    return {
      valid: true,
      discountRials,
      title: "تخفیف ویژه درمر (۲۰٪)",
      message: "تخفیف ویژه سلامت پوست اعمال گردید.",
    };
  }

  return {
    valid: false,
    discountRials: 0n,
    message: "کد تخفیف وارد شده نامعتبر یا منقضی شده است (کدهای فعال: OFF10 ، WELCOME10 ، DERMER20)",
    title: "",
  };
}

export interface CrossSellProtocol {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  subtitle: string;
  sku: string;
  originalPriceRials: string;
  bundlePriceRials: string;
  discountBadge: string;
  clinicalRationale: string;
  targetTriggerMatch: (items: CartItem[]) => boolean;
}

export interface CrossSellRule {
  id: string;
  productSlug: string;
  preferredSkus: string[];
  subtitle: string;
  discountBadge: string;
  clinicalRationale: string;
  targetTriggerMatch: (items: CartItem[]) => boolean;
}

export const CROSS_SELL_PROTOCOLS: CrossSellRule[] = [
  {
    id: "cross_carboxypod",
    productSlug: "carboxypod",
    preferredSkus: ["RMD-CPD-005"],
    subtitle: "مکمل رسمی ژل کربوکسی ری‌اسکین با اسید سیتریک کپسوله",
    discountBadge: "پروتکل هم‌افزایی بوهر",
    clinicalRationale:
      "هم‌افزایی بالینی اثر بوهر (Bohr Effect): فعال‌سازی پایدار CO2 و اکسیژن‌رسانی عمقی بدون اتلاف گاز",
    targetTriggerMatch: (items) => {
      const hasGel = items.some(
        (i) =>
          i.title.toLowerCase().includes("carboxy") ||
          i.title.includes("کربوکسی") ||
          i.sku.includes("CBG")
      );
      const hasPod = items.some(
        (i) =>
          i.title.toLowerCase().includes("pod") ||
          i.title.includes("پاد") ||
          i.sku.includes("CPD")
      );
      return hasGel && !hasPod;
    },
  },
  {
    id: "cross_healene",
    productSlug: "healene",
    preferredSkus: ["DD-HEA-250ML"],
    subtitle: "تسکین فوری التهاب و ترمیم سد دفاعی اپیدرم",
    discountBadge: "مراقبت تخصصی پس از درمان",
    clinicalRationale:
      "پروتکل پست-تریتمنت: مهار ترشح اینترلوکین‌های التهابی و کاهش قرمزی اریتما پس از جلسات کلینیکال",
    targetTriggerMatch: (items) => {
      const hasHealene = items.some(
        (i) =>
          i.title.toLowerCase().includes("healene") ||
          i.title.includes("هیلین") ||
          i.sku.includes("HEA")
      );
      return !hasHealene;
    },
  },
  {
    id: "cross_crystalene",
    productSlug: "crystalene",
    preferredSkus: ["DD-CRY-200ML"],
    subtitle: "میکرودرم ابریشمی با کریستال‌های آلومینای خالص",
    discountBadge: "آماده‌سازی تخصصی بافت",
    clinicalRationale:
      "پاکسازی لایه شاخی استراتوم کورنئوم جهت افزایش نفوذ ترکیبات مزوتراپی و کربوکسی",
    targetTriggerMatch: (items) => {
      const hasCrystalene = items.some(
        (i) =>
          i.title.toLowerCase().includes("crystalene") ||
          i.title.includes("کریستالین") ||
          i.sku.includes("CRY")
      );
      return !hasCrystalene;
    },
  },
];

/**
 * استخراج پیشنهادهای مکمل سبد خرید با شناسه‌های واقعی UUID و قیمت زنده دیتابیس
 */
export function buildCrossSellsFromCatalog(
  apiProducts: Product[],
  cartItems: CartItem[]
): CrossSellProtocol[] {
  const protocols: CrossSellProtocol[] = [];

  for (const rule of CROSS_SELL_PROTOCOLS) {
    if (!rule.targetTriggerMatch(cartItems)) continue;

    const product =
      apiProducts.find((p) => p.slug === rule.productSlug) ??
      apiProducts.find((p) =>
        (p.variants ?? []).some((v) =>
          rule.preferredSkus.includes(v.sku.toUpperCase())
        )
      );

    if (!product) continue;
    const variant = resolveVariant(product, rule.preferredSkus);
    if (!variant || !variant.inStock) continue;

    const alreadyInCart = cartItems.some(
      (it) => it.variantId === variant.id || it.sku === variant.sku
    );
    if (alreadyInCart) continue;

    protocols.push({
      id: rule.id,
      variantId: variant.id,
      productId: product.id,
      title: product.titleFa || product.title,
      subtitle: product.subtitleFa || rule.subtitle,
      sku: variant.sku,
      originalPriceRials: variant.originalPriceAmount || variant.priceAmount,
      bundlePriceRials: variant.priceAmount,
      discountBadge:
        variant.discountPercent && variant.discountPercent > 0
          ? `${variant.discountPercent}٪ تخفیف`
          : rule.discountBadge,
      clinicalRationale: rule.clinicalRationale,
      targetTriggerMatch: rule.targetTriggerMatch,
    });
  }

  return protocols;
}

/**
 * Calculates tiered threshold progress (Free Shipping at 1.5M, VIP Consultation at 3M).
 */
export function getTieredThresholdProgress(subtotalTomans: bigint) {
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD_TOMANS; // 1.5M
  const vipThreshold = VIP_CONSULTATION_THRESHOLD_TOMANS; // 3.0M

  const isFree = subtotalTomans >= freeShippingThreshold;
  const freeRemaining = isFree ? 0n : freeShippingThreshold - subtotalTomans;
  const freePct = Math.max(0, Math.min(100, Number((subtotalTomans * 100n) / freeShippingThreshold)));

  const isVip = subtotalTomans >= vipThreshold;
  const vipRemaining = isVip ? 0n : vipThreshold - subtotalTomans;
  const vipPct = Math.max(0, Math.min(100, Number((subtotalTomans * 100n) / vipThreshold)));

  // Overall meter progress scaled to 3.0M
  const overallPct = Math.max(0, Math.min(100, Number((subtotalTomans * 100n) / vipThreshold)));

  let currentTier: 0 | 1 | 2 = 0;
  if (isVip) currentTier = 2;
  else if (isFree) currentTier = 1;

  const formattedFreeRemaining = new Intl.NumberFormat("fa-IR").format(freeRemaining);
  const formattedVipRemaining = new Intl.NumberFormat("fa-IR").format(vipRemaining);

  return {
    freeShippingProgressPct: freePct,
    freeShippingRemainingTomans: freeRemaining,
    isFreeShipping: isFree,
    freeShippingMessage: isFree
      ? "ارسال رایگان پیشتاز فعال شد"
      : `فقط ${formattedFreeRemaining} تومان تا ارسال رایگان`,
    vipConsultationProgressPct: vipPct,
    vipConsultationRemainingTomans: vipRemaining,
    isVipConsultation: isVip,
    vipConsultationMessage: isVip
      ? "مشاوره اختصاصی رایگان با متخصص پوست فعال شد"
      : `فقط ${formattedVipRemaining} تومان تا مشاوره رایگان با متخصص پوست`,
    overallTierProgressPct: overallPct,
    currentTier,
  };
}

/**
 * Calculates free shipping progress bar details (legacy helper).
 */
export function getFreeShippingProgress(subtotalTomans: bigint) {
  return getTieredThresholdProgress(subtotalTomans);
}

/**
 * Authoritative cart calculation.
 */
export function calculateCartTotals(
  items: CartItem[],
  couponCode?: string | null,
  shippingMethod: string = "POST_PISHTAZ",
  appliedCouponRule?: ValidatedCouponRule | null,
): CartCalculation {
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  // 1. Line subtotals and tiered volume discounts (5% for >=3, 8% for >=6)
  let subtotalRials = 0n;
  let volumeDiscountRials = 0n;

  for (const item of items) {
    const unitPrice = BigInt(item.priceAmount);
    const lineSubtotal = unitPrice * BigInt(item.qty);
    subtotalRials += lineSubtotal;

    let tierBps = 0n;
    if (item.qty >= 6) {
      tierBps = 800n; // 8%
    } else if (item.qty >= 3) {
      tierBps = 500n; // 5%
    }

    if (tierBps > 0n) {
      volumeDiscountRials += (lineSubtotal * tierBps) / 10000n;
    }
  }

  const discounts: DiscountItem[] = [];

  if (volumeDiscountRials > 0n) {
    discounts.push({
      title: "تخفیف پلکانی تعداد اقلام",
      amountRials: volumeDiscountRials,
      amountTomans: volumeDiscountRials / 10n,
    });
  }

  // 2. Coupon discount (prefers live server-validated rule, falls back to local helper)
  let couponDiscountRials = 0n;
  if (couponCode && couponCode.trim()) {
    const clean = couponCode.trim().toUpperCase();
    const couponResult =
      appliedCouponRule && appliedCouponRule.code.toUpperCase() === clean
        ? computeCouponDiscountRials(appliedCouponRule, subtotalRials)
        : validateCoupon(clean, subtotalRials);
    if (couponResult.valid) {
      couponDiscountRials = couponResult.discountRials;
      discounts.push({
        code: clean,
        title: couponResult.title,
        amountRials: couponDiscountRials,
        amountTomans: couponDiscountRials / 10n,
      });
    }
  }

  const totalDiscountRials = volumeDiscountRials + couponDiscountRials;
  const taxableBaseRials = subtotalRials > totalDiscountRials ? subtotalRials - totalDiscountRials : 0n;
  const vatRials = (taxableBaseRials * 10n) / 100n; // 10% Iranian VAT

  // 3. Shipping fee based on method and free shipping threshold
  const subtotalTomans = subtotalRials / 10n;
  const isFree = subtotalTomans >= FREE_SHIPPING_THRESHOLD_TOMANS;

  let shippingRials = 0n;
  if (!isFree && subtotalRials > 0n && items.length > 0) {
    if (shippingMethod === "TIPAX") {
      shippingRials = TIPAX_SHIPPING_RATE_RIALS;
    } else if (shippingMethod === "EXPRESS_COURIER") {
      shippingRials = EXPRESS_COURIER_RATE_RIALS;
    } else {
      shippingRials = BASE_SHIPPING_RATE_RIALS;
    }
  }

  const grandTotalRials = taxableBaseRials + vatRials + shippingRials;
  const tieredProgress = getTieredThresholdProgress(subtotalTomans);

  return {
    subtotalRials,
    subtotalTomans,
    discountRials: totalDiscountRials,
    discountTomans: totalDiscountRials / 10n,
    discounts,
    taxableBaseRials,
    taxableBaseTomans: taxableBaseRials / 10n,
    vatRials,
    vatTomans: vatRials / 10n,
    shippingRials,
    shippingTomans: shippingRials / 10n,
    grandTotalRials,
    grandTotalTomans: grandTotalRials / 10n,
    totalRials: grandTotalRials,
    totalTomans: grandTotalRials / 10n,
    itemCount,
    freeShippingProgressPct: tieredProgress.freeShippingProgressPct,
    freeShippingRemainingTomans: tieredProgress.freeShippingRemainingTomans,
    isFreeShipping: tieredProgress.isFreeShipping,
    freeShippingMessage: tieredProgress.freeShippingMessage,
    vipConsultationProgressPct: tieredProgress.vipConsultationProgressPct,
    vipConsultationRemainingTomans: tieredProgress.vipConsultationRemainingTomans,
    isVipConsultation: tieredProgress.isVipConsultation,
    vipConsultationMessage: tieredProgress.vipConsultationMessage,
    overallTierProgressPct: tieredProgress.overallTierProgressPct,
    currentTier: tieredProgress.currentTier,
  };
}

const LEGACY_CART_SLUG_ALIASES: Record<string, string> = {
  "carboxygel-professional-therapy": "carboxygel",
  "carboxypod-activation-pads": "carboxypod",
  "carbox-station": "carbox",
  "plasmax-pro": "plasmax",
  "bath-and-body-works-perfect-in-pink": "perfect-in-pink",
};

function extractLegacySlugCandidates(raw?: string | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    return [];
  }
  const stripped = trimmed
    .replace(/^(sku-|var-)/i, "")
    .replace(/^prod_(shop_)?/i, "")
    .replace(/_/g, "-")
    .toLowerCase();
  if (!stripped || stripped.length < 2) return [];
  const list = [stripped];
  const alias = LEGACY_CART_SLUG_ALIASES[stripped];
  if (alias) list.push(alias);
  return list;
}

function normalizeTitleKey(raw?: string | null): string {
  return (raw ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Real-time inventory, pricing, and legacy-ID self-healing check against server API.
 */
export async function verifyCartWithServer(
  items: CartItem[]
): Promise<{
  verifiedItems: CartItem[];
  priceChanges: string[];
  stockIssues: string[];
  hasRepairs: boolean;
}> {
  const priceChanges: string[] = [];
  const stockIssues: string[] = [];
  const verifiedItems: CartItem[] = [];
  let hasRepairs = false;

  try {
    const res = await fetch(`${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/products?limit=100`, {
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(4500),
    });

    if (!res.ok) {
      return { verifiedItems: items, priceChanges, stockIssues, hasRepairs: false };
    }

    const payload = await res.json();
    const products: Product[] = payload?.data || [];
    if (products.length === 0) {
      return { verifiedItems: items, priceChanges, stockIssues, hasRepairs: false };
    }

    type CatalogVariantEntry = {
      productId: string;
      variantId: string;
      sku: string;
      priceAmount: string;
      inStock: boolean;
      maxStock?: number;
      title: string;
    };

    const variantCatalog = new Map<string, CatalogVariantEntry>();
    const skuCatalog = new Map<string, CatalogVariantEntry>();
    const slugCatalog = new Map<string, CatalogVariantEntry>();
    const titleCatalog = new Map<string, CatalogVariantEntry>();

    for (const p of products) {
      const preferred = resolveVariant(p);
      for (const v of p.variants || []) {
        const entry: CatalogVariantEntry = {
          productId: p.id,
          variantId: v.id,
          sku: v.sku,
          priceAmount: v.priceAmount,
          inStock: v.inStock !== false,
          maxStock: typeof v.inventoryQty === "number" ? v.inventoryQty : undefined,
          title: `${p.titleFa || p.title}${v.titleFa && v.titleFa !== (p.titleFa || p.title) ? ` - ${v.titleFa}` : ""}`,
        };
        variantCatalog.set(v.id, entry);
        if (v.sku) skuCatalog.set(v.sku.toUpperCase(), entry);
        if (preferred?.id === v.id) {
          if (p.slug) slugCatalog.set(p.slug.toLowerCase(), entry);
          const tk = normalizeTitleKey(p.titleFa || p.title);
          if (tk) titleCatalog.set(tk, entry);
        }
      }
      if (p.slug && !slugCatalog.has(p.slug.toLowerCase()) && preferred) {
        slugCatalog.set(p.slug.toLowerCase(), {
          productId: p.id,
          variantId: preferred.id,
          sku: preferred.sku,
          priceAmount: preferred.priceAmount,
          inStock: preferred.inStock !== false,
          maxStock: typeof preferred.inventoryQty === "number" ? preferred.inventoryQty : undefined,
          title: p.titleFa || p.title,
        });
      }
    }

    const mergedIndexByVariant = new Map<string, number>();

    for (const it of items) {
      let serverVariant =
        variantCatalog.get(it.variantId) ??
        (it.sku ? skuCatalog.get(it.sku.toUpperCase()) : undefined);

      if (!serverVariant) {
        const slugCandidates = [
          ...extractLegacySlugCandidates(it.variantId),
          ...extractLegacySlugCandidates(it.productId),
          ...extractLegacySlugCandidates(it.sku),
        ];
        for (const s of slugCandidates) {
          serverVariant = slugCatalog.get(s);
          if (serverVariant) break;
        }
      }

      if (!serverVariant) {
        const baseTitle = normalizeTitleKey(it.title.split(" - ")[0]);
        serverVariant =
          titleCatalog.get(normalizeTitleKey(it.title)) ??
          titleCatalog.get(baseTitle);
      }

      if (serverVariant) {
        if (!serverVariant.inStock) {
          stockIssues.push(`کالای «${it.title}» در حال حاضر در انبار ناموجود است`);
        }
        if (
          it.variantId !== serverVariant.variantId ||
          it.productId !== serverVariant.productId ||
          (serverVariant.sku && it.sku !== serverVariant.sku)
        ) {
          hasRepairs = true;
          stockIssues.push(`اطلاعات کاتالوگ «${it.title}» با نسخه جدید سرور همگام‌سازی شد`);
        }
        if (serverVariant.priceAmount !== it.priceAmount) {
          priceChanges.push(
            `قیمت «${it.title}» در سیستم به‌روزرسانی شد (${formatToman(serverVariant.priceAmount)})`
          );
        }

        const existingIdx = mergedIndexByVariant.get(serverVariant.variantId);
        if (existingIdx !== undefined) {
          hasRepairs = true;
          verifiedItems[existingIdx] = {
            ...verifiedItems[existingIdx],
            qty: Math.min(MAX_QTY_PER_ITEM, verifiedItems[existingIdx].qty + it.qty),
          };
        } else {
          mergedIndexByVariant.set(serverVariant.variantId, verifiedItems.length);
          verifiedItems.push({
            ...it,
            productId: serverVariant.productId,
            variantId: serverVariant.variantId,
            sku: serverVariant.sku || it.sku,
            priceAmount: serverVariant.priceAmount,
            maxStock: serverVariant.maxStock ?? it.maxStock,
          });
        }
      } else {
        // Drop dead unresolvable legacy cart entries instead of blocking checkout
        hasRepairs = true;
        stockIssues.push(`کالای قدیمی «${it.title}» در کاتالوگ فعلی یافت نشد و از سبد خرید حذف شد`);
      }
    }

    return { verifiedItems, priceChanges, stockIssues, hasRepairs };
  } catch {
    // Network or timeout fallback: trust local cart
    return { verifiedItems: items, priceChanges, stockIssues, hasRepairs: false };
  }
}
