import { Money, Quote } from "@commerce-os/domain";

export type LedgerDirection = "DEBIT" | "CREDIT";

export interface LedgerLeg {
  accountCode: string;
  direction: LedgerDirection;
  amount: Money;
  descriptionFa?: string;
  metadata?: Record<string, any>;
}

export interface JournalBatch {
  ref: string;
  sourceType: "ORDER_SALE" | "ORDER_REFUND" | "WALLET_DEPOSIT" | "WALLET_WITHDRAW" | "CARRIER_PAYMENT";
  sourceId: string;
  tenantId: string;
  storeId?: string;
  description: string;
  legs: LedgerLeg[];
}

export class UnbalancedJournalError extends Error {
  constructor(debit: string, credit: string, ref: string) {
    super(`Accounting Invariant Violation: Journal ref [${ref}] is unbalanced: DEBIT (${debit}) !== CREDIT (${credit})`);
    this.name = "UnbalancedJournalError";
  }
}

/**
 * Validates that total debits strictly equal total credits.
 */
export function validateBalancedJournal(legs: LedgerLeg[], ref: string): void {
  let totalDebit = Money.zero("IRR");
  let totalCredit = Money.zero("IRR");

  for (const leg of legs) {
    if (leg.direction === "DEBIT") {
      totalDebit = totalDebit.add(leg.amount);
    } else {
      totalCredit = totalCredit.add(leg.amount);
    }
  }

  if (!totalDebit.equals(totalCredit)) {
    throw new UnbalancedJournalError(
      totalDebit.formatRials(),
      totalCredit.formatRials(),
      ref
    );
  }

  if (totalDebit.isZero()) {
    throw new Error(`Accounting Invariant Violation: Journal ref [${ref}] has zero balance`);
  }
}

/**
 * Constructs a balanced double-entry journal for a captured order sale from Quote.
 * Debit:
 *   - 1010 Gateway Cash (Total paid by customer)
 *   - 4030 Sales Discounts (if any discounts applied)
 * Credit:
 *   - 4010 Sales Revenue (Gross subtotal of items)
 *   - 2030 VAT Payable (10% VAT)
 *   - 4020 Shipping Revenue (Shipping fee charged)
 *
 * Invariant: DEBIT (Gateway Cash + Discounts) === CREDIT (Gross Revenue + VAT + Shipping)
 */
export function createOrderSaleJournal(params: {
  orderId: string;
  tenantId: string;
  storeId: string;
  quote: Quote;
  paymentMethod: "GATEWAY" | "CARD_TO_CARD" | "WALLET";
}): JournalBatch {
  const { orderId, tenantId, storeId, quote, paymentMethod } = params;
  const legs: LedgerLeg[] = [];

  // Cash / Receivable account based on payment method
  const debitAccount =
    paymentMethod === "WALLET" ? "2010" : paymentMethod === "CARD_TO_CARD" ? "1020" : "1010";

  // 1. Debit Cash/Wallet received: total paid
  legs.push({
    accountCode: debitAccount,
    direction: "DEBIT",
    amount: quote.total,
    descriptionFa: `دریافت وجه بابت سفارش ${orderId}`,
  });

  // 2. Debit Discounts (contra-revenue)
  if (!quote.totalDiscount.isZero()) {
    legs.push({
      accountCode: "4030",
      direction: "DEBIT",
      amount: quote.totalDiscount,
      descriptionFa: `تخفیفات و کوپن سفارش ${orderId}`,
    });
  }

  // 3. Credit Gross Merchandise Revenue (subtotal)
  legs.push({
    accountCode: "4010",
    direction: "CREDIT",
    amount: quote.subtotal,
    descriptionFa: `درآمد ناخالص فروش کالاهای سفارش ${orderId}`,
  });

  // 4. Credit VAT Payable
  if (!quote.vat.isZero()) {
    legs.push({
      accountCode: "2030",
      direction: "CREDIT",
      amount: quote.vat,
      descriptionFa: `مالیات بر ارزش افزوده سفارش ${orderId}`,
    });
  }

  // 5. Credit Shipping Revenue
  if (!quote.shipping.isZero()) {
    legs.push({
      accountCode: "4020",
      direction: "CREDIT",
      amount: quote.shipping,
      descriptionFa: `درآمد کرایه حمل سفارش ${orderId}`,
    });
  }

  const ref = `JRN-SALE-${orderId}`;
  validateBalancedJournal(legs, ref);

  return {
    ref,
    sourceType: "ORDER_SALE",
    sourceId: orderId,
    tenantId,
    storeId,
    description: `سند شناسایی درآمد فروش سفارش ${orderId}`,
    legs,
  };
}

/**
 * Constructs a reversing refund journal.
 */
export function createOrderRefundJournal(saleJournal: JournalBatch, refundId: string): JournalBatch {
  const reversedLegs: LedgerLeg[] = saleJournal.legs.map((leg) => ({
    accountCode: leg.accountCode,
    direction: leg.direction === "DEBIT" ? "CREDIT" : "DEBIT",
    amount: leg.amount,
    descriptionFa: `استرداد وجه سفارش: ${leg.descriptionFa}`,
  }));

  const ref = `REV-${refundId}-${saleJournal.ref}`;
  validateBalancedJournal(reversedLegs, ref);

  return {
    ref,
    sourceType: "ORDER_REFUND",
    sourceId: refundId,
    tenantId: saleJournal.tenantId,
    storeId: saleJournal.storeId,
    description: `سند برگشت از فروش و استرداد وجه ${saleJournal.ref}`,
    legs: reversedLegs,
  };
}
