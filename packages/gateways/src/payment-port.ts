import { Money } from "@commerce-os/domain";

export interface InitiatePaymentInput {
  intentId: string;
  orderId: string;
  amount: Money; // In IRR
  callbackUrl: string;
  description: string;
  payerPhone?: string;
  payerEmail?: string;
  metadata?: Record<string, any>;
}

export interface InitiatePaymentResult {
  gatewayTrackingId: string;
  redirectUrl: string;
  rawResponse?: Record<string, any>;
}

export interface VerifyCallbackInput {
  intentId: string;
  expectedAmount: Money;
  queryOrBody: Record<string, any>;
}

export interface VerifyCallbackResult {
  success: boolean;
  refId?: string;
  cardPan?: string;
  cardHash?: string;
  feeAmount?: Money;
  errorMessage?: string;
  rawResponse?: Record<string, any>;
}

export interface PaymentGatewayPort {
  readonly gatewayName: string;
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  verifyCallback(input: VerifyCallbackInput): Promise<VerifyCallbackResult>;
}
