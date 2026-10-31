import { Money } from "./money.js";
import { Quote, QuoteLine, QuoteLineInput, CouponRule, DiscountBreakdown } from "./types.js";

export interface CatalogVariantSource {
  id: string;
  productId: string;
  title: string;
  sku: string;
  priceAmount: bigint | number;
  currency: string;
}

export const VAT_BPS = 1000; // 10.00% VAT in Iran
export const FREE_SHIPPING_THRESHOLD = Money.fromRials(30_000_000n); // 3,000,000 Tomans
export const BASE_SHIPPING_RATE = Money.fromRials(1_500_000n); // 150,000 Tomans
export const QUOTE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function computeQuoteFingerprint(
  lines: Array<{ variantId: string; unitPrice: bigint; qty: number }>,
  total: bigint,
  couponCode?: string
): string {
  const normalized = [
    lines.map((l) => [l.variantId, l.unitPrice.toString(), l.qty]),
    total.toString(),
    couponCode?.trim().toUpperCase() ?? "",
  ];
  const s = JSON.stringify(normalized);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

export function calculateQuote(params: {
  storeId: string;
  tenantId: string;
  items: QuoteLineInput[];
  variantFinder: (variantId: string) => CatalogVariantSource | undefined;
  coupon?: CouponRule;
}): Quote {
  const { storeId, tenantId, items, variantFinder, coupon } = params;

  if (items.length === 0) {
    throw new Error("Cannot calculate quote for empty cart");
  }

  // Merge duplicate lines and validate quantities
  const merged = new Map<string, number>();
  for (const it of items) {
    if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 50) {
      throw new Error(`Invalid quantity ${it.qty} for variant ${it.variantId}`);
    }
    merged.set(it.variantId, (merged.get(it.variantId) ?? 0) + it.qty);
  }

  const quoteLines: QuoteLine[] = [];
  let subtotal = Money.zero("IRR");

  for (const [variantId, qty] of merged.entries()) {
    const variant = variantFinder(variantId);
    if (!variant) {
      throw new Error(`Product variant ${variantId} not found in catalog`);
    }

    const unitPrice = Money.fromRials(variant.priceAmount);
    const lineSubtotal = unitPrice.mul(BigInt(qty));

    // Tiered volume discount
    let tierBps = 0;
    if (qty >= 6) tierBps = 800; // 8% for 6+
    else if (qty >= 3) tierBps = 500; // 5% for 3+

    const lineDiscount = tierBps > 0 ? lineSubtotal.bps(tierBps) : Money.zero("IRR");
    const lineTotal = lineSubtotal.sub(lineDiscount);

    quoteLines.push({
      variantId,
      productId: variant.productId,
      title: variant.title,
      sku: variant.sku,
      unitPrice,
      qty,
      subtotal: lineSubtotal,
      discount: lineDiscount,
      total: lineTotal,
    });

    subtotal = subtotal.add(lineSubtotal);
  }

  // Aggregate line discounts
  const lineDiscountsTotal = quoteLines.reduce(
    (acc, l) => acc.add(l.discount),
    Money.zero("IRR")
  );

  const discounts: DiscountBreakdown[] = [];
  if (!lineDiscountsTotal.isZero()) {
    discounts.push({
      title: "تخفیف پلکانی تعداد",
      amount: lineDiscountsTotal,
    });
  }

  // Evaluate coupon discount
  let couponDiscount = Money.zero("IRR");
  if (coupon) {
    if (coupon.minSubtotal && subtotal.lessThan(coupon.minSubtotal)) {
      throw new Error(`حداقل خرید برای اعمال این کوپن ${coupon.minSubtotal.formatTomans()} است`);
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new Error("این کد تخفیف منقضی شده است");
    }
    if (coupon.usageLimit && (coupon.usedCount ?? 0) >= coupon.usageLimit) {
      throw new Error("ظرفیت استفاده از این کد تخفیف تکمیل شده است");
    }

    if (coupon.discountBps) {
      couponDiscount = subtotal.bps(coupon.discountBps);
    } else if (coupon.fixedDiscount) {
      couponDiscount = coupon.fixedDiscount;
    }

    if (coupon.maxDiscount && couponDiscount.greaterThan(coupon.maxDiscount)) {
      couponDiscount = coupon.maxDiscount;
    }

    if (couponDiscount.greaterThan(subtotal)) {
      couponDiscount = subtotal;
    }

    discounts.push({
      code: coupon.code,
      title: `کد تخفیف ${coupon.code}`,
      amount: couponDiscount,
    });
  }

  const totalDiscount = lineDiscountsTotal.add(couponDiscount);
  const taxableBase = subtotal.sub(totalDiscount);
  const vat = taxableBase.isPositive() ? taxableBase.bps(VAT_BPS) : Money.zero("IRR");

  // Shipping
  const shipping = subtotal.greaterThanOrEqual(FREE_SHIPPING_THRESHOLD)
    ? Money.zero("IRR")
    : BASE_SHIPPING_RATE;

  // Final Total
  const total = taxableBase.add(vat).add(shipping);

  const rawLines = quoteLines.map((l) => ({
    variantId: l.variantId,
    unitPrice: l.unitPrice.amount,
    qty: l.qty,
  }));

  const fingerprint = computeQuoteFingerprint(rawLines, total.amount, coupon?.code);
  const quoteId = `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  return {
    id: quoteId,
    storeId,
    tenantId,
    lines: quoteLines,
    subtotal,
    totalDiscount,
    discounts,
    vat,
    shipping,
    total,
    fingerprint,
    expiresAt: new Date(Date.now() + QUOTE_TTL_MS),
    currency: "IRR",
  };
}
