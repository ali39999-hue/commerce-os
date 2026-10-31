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
  itemCount: number;
  freeShippingProgressPct: number;
  freeShippingRemainingTomans: bigint;
  isFreeShipping: boolean;
  freeShippingMessage: string;
}

export const FREE_SHIPPING_THRESHOLD_TOMANS = 3_000_000n; // 3,000,000 Tomans
export const FREE_SHIPPING_THRESHOLD_RIALS = 30_000_000n;
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
    message: "کد تخفیف وارد شده نامعتبر یا منقضی شده است (کدهای فعال: OFF10 ، WELCOME10)",
    title: "",
  };
}

/**
 * Calculates free shipping progress bar details.
 */
export function getFreeShippingProgress(subtotalTomans: bigint) {
  const threshold = FREE_SHIPPING_THRESHOLD_TOMANS;
  if (subtotalTomans >= threshold) {
    return {
      progressPct: 100,
      remainingTomans: 0n,
      isFree: true,
      message: "تبریک! هزینه ارسال سفارش شما رایگان شد 🎉",
    };
  }

  const remainingTomans = threshold - subtotalTomans;
  const progressPct = Math.max(0, Math.min(100, Number((subtotalTomans * 100n) / threshold)));
  const formattedRemaining = new Intl.NumberFormat("fa-IR").format(remainingTomans);

  return {
    progressPct,
    remainingTomans,
    isFree: false,
    message: `فقط ${formattedRemaining} تومان تا ارسال رایگان`,
  };
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
  const freeShipping = getFreeShippingProgress(subtotalTomans);

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
    itemCount,
    freeShippingProgressPct: freeShipping.progressPct,
    freeShippingRemainingTomans: freeShipping.remainingTomans,
    isFreeShipping: freeShipping.isFree,
    freeShippingMessage: freeShipping.message,
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
