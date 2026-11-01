import { apiBase, storeSlug, formatToman } from "./catalog";

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

/**
 * Validates promo coupons with server rules.
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

export const CLINICAL_CROSS_SELLS: CrossSellProtocol[] = [
  {
    id: "cross_carboxypod",
    variantId: "var_cpd_box5",
    productId: "prod_clinical_carboxypod",
    title: "پدهای فیبری فعال‌ساز CarboxyPod (بسته ۵ عددی)",
    subtitle: "مکمل رسمی ژل کربوکسی ری‌اسکین با اسید سیتریک کپسوله",
    sku: "RMD-CPD-005",
    originalPriceRials: "12500000", // 1,250,000 Tomans
    bundlePriceRials: "10625000", // 1,062,500 Tomans (15% Bundle Discount)
    discountBadge: "۱۵٪ تخفیف پروتکل ترکیبی",
    clinicalRationale:
      "هم‌افزایی بالینی اثر بوهر (Bohr Effect): فعال‌سازی پایدار CO2 و اکسیژن‌رسانی عمقی بدون اتلاف گاز",
    targetTriggerMatch: (items) => {
      // Suggest CarboxyPod if user has CarboxyGel and doesn't already have CarboxyPod
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
    variantId: "var_hea_250ml",
    productId: "prod_drdermer_005",
    title: "ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing",
    subtitle: "تسکین فوری التهاب و ترمیم سد دفاعی اپیدرم",
    sku: "DD-HEA-250ML",
    originalPriceRials: "16000000", // 1,600,000 Tomans
    bundlePriceRials: "13600000", // 1,360,000 Tomans (15% Protocol Discount)
    discountBadge: "۱۵٪ تخفیف مراقبت پس از درمان",
    clinicalRationale:
      "پروتکل پست-تریتمنت: مهار ترشح اینترلوکین‌های التهابی و کاهش ۶۱٪ قرمزی اریتما در ۳۰ دقیقه اول",
    targetTriggerMatch: (items) => {
      // Suggest Healene if cart has any clinical item and doesn't have Healene
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
    variantId: "var_cry_200ml",
    productId: "prod_drdermer_004",
    title: "خمیر پولیش و لایه‌بردار کریستالین Crystalene",
    subtitle: "میکرودرم ابریشمی با کریستال‌های آلومینای خالص",
    sku: "DD-CRY-200ML",
    originalPriceRials: "14500000", // 1,450,000 Tomans
    bundlePriceRials: "12325000", // 1,232,500 Tomans (15% Bundle Discount)
    discountBadge: "۱۵٪ تخفیف آماده‌سازی بافت",
    clinicalRationale:
      "پاکسازی شاخی لایه استراتوم کورنئوم جهت افزایش ۴ برابری نفوذ ترکیبات مزوتراپی و کربوکسی",
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
  shippingMethod: string = "POST_PISHTAZ"
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

  // 2. Coupon discount
  let couponDiscountRials = 0n;
  if (couponCode && couponCode.trim()) {
    const couponResult = validateCoupon(couponCode, subtotalRials);
    if (couponResult.valid) {
      couponDiscountRials = couponResult.discountRials;
      discounts.push({
        code: couponCode.trim().toUpperCase(),
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
  if (!isFree) {
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

/**
 * Real-time inventory and pricing check against server API.
 */
export async function verifyCartWithServer(
  items: CartItem[]
): Promise<{ verifiedItems: CartItem[]; priceChanges: string[]; stockIssues: string[] }> {
  const priceChanges: string[] = [];
  const stockIssues: string[] = [];
  const verifiedItems: CartItem[] = [];

  try {
    const res = await fetch(`${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/products`, {
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(3500),
    });

    if (!res.ok) {
      // In offline/demo mode, retain existing items
      return { verifiedItems: items, priceChanges, stockIssues };
    }

    const payload = await res.json();
    const products: any[] = payload?.data || [];

    const variantCatalog = new Map<string, { priceAmount: string; inStock: boolean; title: string }>();
    for (const p of products) {
      for (const v of p.variants || []) {
        variantCatalog.set(v.id, {
          priceAmount: v.priceAmount,
          inStock: v.inStock !== false,
          title: `${p.title} - ${v.title}`,
        });
      }
    }

    for (const it of items) {
      const serverVariant = variantCatalog.get(it.variantId);
      if (serverVariant) {
        if (!serverVariant.inStock) {
          stockIssues.push(`کالای «${it.title}» در حال حاضر در انبار ناموجود است`);
        }
        if (serverVariant.priceAmount !== it.priceAmount) {
          priceChanges.push(
            `قیمت «${it.title}» در سیستم به‌روزرسانی شد (${formatToman(serverVariant.priceAmount)})`
          );
        }
        verifiedItems.push({
          ...it,
          priceAmount: serverVariant.priceAmount,
        });
      } else {
        verifiedItems.push(it);
      }
    }

    return { verifiedItems, priceChanges, stockIssues };
  } catch {
    // Network or timeout fallback: trust local cart
    return { verifiedItems: items, priceChanges, stockIssues };
  }
}
