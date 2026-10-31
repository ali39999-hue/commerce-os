import { describe, it, expect } from "vitest";
import { Money, calculateQuote } from "@commerce-os/domain";
import {
  createOrderSaleJournal,
  createOrderRefundJournal,
  validateBalancedJournal,
  UnbalancedJournalError,
} from "../src/index.js";

describe("Double-Entry Accounting Ledger", () => {
  const dummyVariant = {
    id: "v1",
    productId: "p1",
    title: "تست کالا",
    sku: "TEST-01",
    priceAmount: 10_000_000n, // 1M Tomans
    currency: "IRR",
  };

  it("produces balanced journal entry for a sale quote", () => {
    const quote = calculateQuote({
      storeId: "store_1",
      tenantId: "tenant_1",
      items: [{ variantId: "v1", qty: 1 }],
      variantFinder: () => dummyVariant,
    });

    const journal = createOrderSaleJournal({
      orderId: "ord_1001",
      tenantId: "tenant_1",
      storeId: "store_1",
      quote,
      paymentMethod: "GATEWAY",
    });

    expect(journal.ref).toBe("JRN-SALE-ord_1001");
    expect(journal.legs.length).toBeGreaterThanOrEqual(3);

    // Sum debit vs credit
    let debit = 0n;
    let credit = 0n;
    for (const leg of journal.legs) {
      if (leg.direction === "DEBIT") debit += leg.amount.amount;
      else credit += leg.amount.amount;
    }
    expect(debit).toBe(credit);
  });

  it("throws UnbalancedJournalError if journal does not balance", () => {
    const unbalanced = [
      { accountCode: "1010", direction: "DEBIT" as const, amount: Money.fromRials(1000n) },
      { accountCode: "4010", direction: "CREDIT" as const, amount: Money.fromRials(900n) },
    ];
    expect(() => validateBalancedJournal(unbalanced, "TEST-REF")).toThrow(UnbalancedJournalError);
  });

  it("generates a balanced refund reversal journal", () => {
    const quote = calculateQuote({
      storeId: "store_1",
      tenantId: "tenant_1",
      items: [{ variantId: "v1", qty: 1 }],
      variantFinder: () => dummyVariant,
    });

    const saleJournal = createOrderSaleJournal({
      orderId: "ord_1001",
      tenantId: "tenant_1",
      storeId: "store_1",
      quote,
      paymentMethod: "GATEWAY",
    });

    const refundJournal = createOrderRefundJournal(saleJournal, "ref_99");
    expect(refundJournal.ref.startsWith("REV-ref_99-")).toBe(true);

    let debit = 0n;
    let credit = 0n;
    for (const leg of refundJournal.legs) {
      if (leg.direction === "DEBIT") debit += leg.amount.amount;
      else credit += leg.amount.amount;
    }
    expect(debit).toBe(credit);
  });
});
