import { Money } from "./money.js";

export interface AddressSnapshot {
  province: string;
  city: string;
  postalAddress: string;
  postalCode: string;
  receiverName: string;
  receiverPhone: string;
}

export interface CustomerContext {
  id: string;
  phone: string;
  name?: string;
  nationalId?: string;
}

export interface QuoteLineInput {
  variantId: string;
  qty: number;
}

export interface QuoteLine {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  unitPrice: Money;
  qty: number;
  subtotal: Money;
  discount: Money;
  total: Money;
}

export interface DiscountBreakdown {
  code?: string;
  title: string;
  amount: Money;
}

export interface Quote {
  id: string;
  storeId: string;
  tenantId: string;
  lines: QuoteLine[];
  subtotal: Money;
  totalDiscount: Money;
  discounts: DiscountBreakdown[];
  vat: Money;
  shipping: Money;
  total: Money;
  fingerprint: string;
  expiresAt: Date;
  currency: string;
}

export interface CouponRule {
  code: string;
  discountBps?: number; // e.g. 1000 = 10%
  fixedDiscount?: Money;
  minSubtotal?: Money;
  maxDiscount?: Money;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount?: number;
}
