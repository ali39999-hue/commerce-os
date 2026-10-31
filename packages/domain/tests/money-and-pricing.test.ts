import { describe, it, expect } from "vitest";
import { Money, CurrencyMismatchError } from "../src/money.js";
import { calculateQuote, computeQuoteFingerprint } from "../src/pricing.js";
import {
  canTransitionOrder,
  assertOrderTransition,
  canTransitionPayment,
  assertPaymentTransition,
  InvalidStateTransitionError,
} from "../src/state-machines.js";

describe("Money Primitive", () => {
  it("creates Money from Rials and Tomans", () => {
    const fromR = Money.fromRials(100_000n);
    const fromT = Money.fromTomans(10_000n);
    expect(fromR.amount).toBe(100_000n);
    expect(fromT.amount).toBe(100_000n);
    expect(fromR.equals(fromT)).toBe(true);
    expect(fromR.toTomans()).toBe(10_000n);
  });

  it("handles addition and subtraction strictly", () => {
    const a = Money.fromRials(50_000n);
    const b = Money.fromRials(30_000n);
    expect(a.add(b).amount).toBe(80_000n);
    expect(a.sub(b).amount).toBe(20_000n);
  });

  it("rejects currency mismatch operations", () => {
    const irr = new Money(1000n, "IRR");
    const usd = new Money(1000n, "USD");
    expect(() => irr.add(usd)).toThrow(CurrencyMismatchError);
    expect(() => irr.sub(usd)).toThrow(CurrencyMismatchError);
    expect(() => irr.greaterThan(usd)).toThrow(CurrencyMismatchError);
  });

  it("computes basis points with half-up rounding", () => {
    const price = Money.fromRials(10_000_000n); // 1,000,000 Tomans
    const vat = price.bps(1000); // 10%
    expect(vat.amount).toBe(1_000_000n);

    // 9.55%
    const discounted = price.bps(955);
    expect(discounted.amount).toBe(955_000n);
  });

  it("allocates amounts proportionally without losing a single Rial", () => {
    const total = Money.fromRials(100n); // 100 Rials to split in 3 equal parts
    const parts = total.allocate([1, 1, 1]);
    expect(parts.length).toBe(3);
    const sum = parts.reduce((acc, p) => acc + p.amount, 0n);
    expect(sum).toBe(100n);
    // 34 + 33 + 33 = 100
    expect(parts[0].amount).toBe(34n);
    expect(parts[1].amount).toBe(33n);
    expect(parts[2].amount).toBe(33n);
  });
});

describe("Pricing Engine & Quotes", () => {
  const catalog = [
    {
      id: "v1",
      productId: "p1",
      title: "قهوه تخصصی اتیوپی",
      sku: "COF-ETH-250",
      priceAmount: 4_500_000n, // 450,000 Tomans
      currency: "IRR",
    },
    {
      id: "v2",
      productId: "p2",
      title: "ماگ سرامیکی دست‌ساز",
      sku: "MUG-CER-01",
      priceAmount: 2_000_000n, // 200,000 Tomans
      currency: "IRR",
    },
  ];

  const finder = (id: string) => catalog.find((c) => c.id === id);

  it("calculates basic quote correctly with VAT and shipping", () => {
    const quote = calculateQuote({
      storeId: "store_1",
      tenantId: "tenant_1",
      items: [{ variantId: "v1", qty: 2 }], // 2 * 4,500,000 = 9,000,000 Rials
      variantFinder: finder,
    });

    expect(quote.subtotal.amount).toBe(9_000_000n);
    expect(quote.totalDiscount.amount).toBe(0n);
    // Subtotal < 30,000,000 so shipping applies (1,500,000)
    expect(quote.shipping.amount).toBe(1_500_000n);
    // 10% VAT on 9,000,000 = 900,000
    expect(quote.vat.amount).toBe(900_000n);
    // Total = 9,000,000 + 900,000 + 1,500,000 = 11,400,000
    expect(quote.total.amount).toBe(11_400_000n);
    expect(quote.fingerprint).toBeDefined();
  });

  it("applies free shipping for subtotal >= 30,000,000 Rials", () => {
    const quote = calculateQuote({
      storeId: "store_1",
      tenantId: "tenant_1",
      items: [{ variantId: "v1", qty: 8 }], // 8 * 4,500,000 = 36,000,000 Rials
      variantFinder: finder,
    });

    expect(quote.shipping.amount).toBe(0n);
    // Qty >= 6 gets 8% tier discount
    expect(quote.totalDiscount.amount).toBe(36_000_000n * 800n / 10000n);
  });

  it("evaluates coupon discounts and obeys max caps", () => {
    const quote = calculateQuote({
      storeId: "store_1",
      tenantId: "tenant_1",
      items: [{ variantId: "v1", qty: 2 }], // Subtotal: 9,000,000 Rials
      variantFinder: finder,
      coupon: {
        code: "WELCOME20",
        discountBps: 2000, // 20% = 1,800,000
        maxDiscount: Money.fromRials(1_000_000n), // Capped at 1,000,000
      },
    });

    expect(quote.totalDiscount.amount).toBe(1_000_000n);
    const expectedTaxable = 9_000_000n - 1_000_000n; // 8,000,000
    expect(quote.vat.amount).toBe(800_000n);
  });

  it("produces identical fingerprints for identical cart contents", () => {
    const fp1 = computeQuoteFingerprint([{ variantId: "v1", unitPrice: 4_500_000n, qty: 2 }], 11_400_000n);
    const fp2 = computeQuoteFingerprint([{ variantId: "v1", unitPrice: 4_500_000n, qty: 2 }], 11_400_000n);
    const fp3 = computeQuoteFingerprint([{ variantId: "v1", unitPrice: 4_500_000n, qty: 3 }], 15_000_000n);

    expect(fp1).toBe(fp2);
    expect(fp1).not.toBe(fp3);
  });
});

describe("State Machines", () => {
  it("allows legal order transitions", () => {
    expect(canTransitionOrder("DRAFT", "PENDING_PAYMENT")).toBe(true);
    expect(canTransitionOrder("PENDING_PAYMENT", "PAID")).toBe(true);
    expect(canTransitionOrder("PAID", "PROCESSING")).toBe(true);
    expect(canTransitionOrder("PROCESSING", "SHIPPED")).toBe(true);
    expect(canTransitionOrder("SHIPPED", "DELIVERED")).toBe(true);
    expect(canTransitionOrder("DELIVERED", "COMPLETED")).toBe(true);
  });

  it("blocks illegal order transitions", () => {
    expect(canTransitionOrder("DRAFT", "COMPLETED")).toBe(false);
    expect(canTransitionOrder("CANCELLED", "PAID")).toBe(false);
    expect(() => assertOrderTransition("CANCELLED", "PAID")).toThrow(InvalidStateTransitionError);
  });

  it("guards payment intent transitions", () => {
    expect(canTransitionPayment("CREATED", "PENDING_PROVIDER")).toBe(true);
    expect(canTransitionPayment("PENDING_PROVIDER", "CAPTURED")).toBe(true);
    expect(canTransitionPayment("PENDING_PROVIDER", "UNKNOWN")).toBe(true);
    expect(canTransitionPayment("UNKNOWN", "CAPTURED")).toBe(true);
    expect(canTransitionPayment("FAILED", "CAPTURED")).toBe(false);
    expect(() => assertPaymentTransition("FAILED", "CAPTURED")).toThrow(InvalidStateTransitionError);
  });
});
