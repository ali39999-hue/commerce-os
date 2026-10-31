/**
 * Canonical State Machines for Orders and Payments in Commerce OS.
 */

export type OrderStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED";

export type PaymentIntentStatus =
  | "CREATED"
  | "PENDING_PROVIDER"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "UNKNOWN"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type ShipmentStatus =
  | "PENDING"
  | "PACKED"
  | "HANDED_TO_CARRIER"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "FAILED_ATTEMPT";

export class InvalidStateTransitionError extends Error {
  constructor(domain: string, from: string, to: string) {
    super(`Invalid ${domain} state transition: cannot transition from ${from} to ${to}`);
    this.name = "InvalidStateTransitionError";
  }
}

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ["PENDING_PAYMENT", "CANCELLED"],
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "REFUNDED", "CANCELLED"],
  PROCESSING: ["SHIPPED", "REFUNDED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["COMPLETED", "REFUNDED"],
  COMPLETED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

const PAYMENT_TRANSITIONS: Record<PaymentIntentStatus, PaymentIntentStatus[]> = {
  CREATED: ["PENDING_PROVIDER", "FAILED", "CANCELLED", "EXPIRED"],
  PENDING_PROVIDER: ["AUTHORIZED", "CAPTURED", "FAILED", "EXPIRED", "UNKNOWN"],
  AUTHORIZED: ["CAPTURED", "CANCELLED", "EXPIRED"],
  CAPTURED: ["REFUNDED", "PARTIALLY_REFUNDED"],
  FAILED: [],
  CANCELLED: [],
  EXPIRED: [],
  UNKNOWN: ["CAPTURED", "FAILED", "CANCELLED"],
  PARTIALLY_REFUNDED: ["REFUNDED"],
  REFUNDED: [],
};

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertOrderTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransitionOrder(from, to)) {
    throw new InvalidStateTransitionError("Order", from, to);
  }
}

export function canTransitionPayment(from: PaymentIntentStatus, to: PaymentIntentStatus): boolean {
  if (from === to) return true;
  return PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertPaymentTransition(from: PaymentIntentStatus, to: PaymentIntentStatus): void {
  if (!canTransitionPayment(from, to)) {
    throw new InvalidStateTransitionError("PaymentIntent", from, to);
  }
}
