import { Money } from "@commerce-os/domain";
import { formatCardNumber, getShetabBank } from "@commerce-os/localization";
import {
  PaymentGatewayPort,
  InitiatePaymentInput,
  InitiatePaymentResult,
  VerifyCallbackInput,
  VerifyCallbackResult,
} from "./payment-port.js";

export interface CardToCardMerchantConfig {
  cardNumber: string; // 16 digits
  cardHolder: string;
  bankName: string;
  sheba?: string;
  instructionsFa?: string;
}

export class CardToCardGateway implements PaymentGatewayPort {
  readonly gatewayName = "card_to_card";
  private readonly config: CardToCardMerchantConfig;

  constructor(config?: Partial<CardToCardMerchantConfig>) {
    this.config = {
      cardNumber: config?.cardNumber || "6219861012345678",
      cardHolder: config?.cardHolder || "فروشگاه مرکزی کامرس او اس",
      bankName: config?.bankName || "بانک سامان",
      sheba: config?.sheba || "IR000000000000000000000000",
      instructionsFa:
        config?.instructionsFa ||
        "لطفاً مبلغ فاکتور را به شماره کارت زیر واریز نموده و شماره پیگیری / کد رهگیری فیش بانکی خود را ثبت فرمایید.",
    };
  }

  getMerchantInfo() {
    const bank = getShetabBank(this.config.cardNumber);
    return {
      ...this.config,
      formattedCard: formatCardNumber(this.config.cardNumber),
      bank,
    };
  }

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    const trackingId = `c2c_${input.intentId}`;
    return {
      gatewayTrackingId: trackingId,
      redirectUrl: `${input.callbackUrl}?c2c_intent=${input.intentId}`,
      rawResponse: {
        merchant: this.getMerchantInfo(),
        amountRials: input.amount.amount.toString(),
        amountTomans: input.amount.toTomans().toString(),
      },
    };
  }

  async verifyCallback(input: VerifyCallbackInput): Promise<VerifyCallbackResult> {
    const referenceNumber = input.queryOrBody.referenceNumber || input.queryOrBody.refNumber;
    const payerCardNumber = input.queryOrBody.payerCardNumber;

    if (!referenceNumber) {
      return {
        success: false,
        errorMessage: "شماره پیگیری فیش واریزی ارسال نشده است",
      };
    }

    // Card-to-card enters pending manual verification stage
    return {
      success: true,
      refId: `C2C-${referenceNumber}`,
      cardPan: payerCardNumber ? formatCardNumber(payerCardNumber) : undefined,
      feeAmount: Money.zero("IRR"),
      rawResponse: {
        status: "PENDING_OPERATOR_REVIEW",
        referenceNumber,
      },
    };
  }
}
