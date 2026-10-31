import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { InventoryService } from "../inventory/inventory.service";
import { LedgerService } from "../ledger/ledger.service";
import { ZarinpalGateway, CardToCardGateway } from "@commerce-os/gateways";
import { Money } from "@commerce-os/domain";

@Injectable()
export class PaymentsService {
  private readonly zarinpalGateway: ZarinpalGateway;
  private readonly cardToCardGateway: CardToCardGateway;

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly ledgerService: LedgerService
  ) {
    this.zarinpalGateway = new ZarinpalGateway({
      merchantId: process.env.ZARINPAL_MERCHANT_ID || "00000000-0000-0000-0000-000000000000",
      isSandbox: process.env.ZARINPAL_SANDBOX !== "false",
    });

    this.cardToCardGateway = new CardToCardGateway({
      cardNumber: process.env.MERCHANT_CARD_NUMBER || "6219861012345678",
      cardHolder: process.env.MERCHANT_CARD_HOLDER || "فروشگاه مرکزی کامرس او اس",
      bankName: process.env.MERCHANT_BANK_NAME || "بانک سامان",
    });
  }

  async initiate(intentId: string, callbackBaseUrl: string) {
    const intent = await this.prisma.paymentIntent.findUnique({
      where: { id: intentId },
      include: { order: true },
    });

    if (!intent) {
      throw new NotFoundException("تراکنش پرداخت یافت نشد");
    }

    const amount = Money.fromRials(BigInt(intent.amount.toString()));
    const callbackUrl = `${callbackBaseUrl}/api/v1/payments/callback/${intent.method.toLowerCase()}?intentId=${intent.id}`;

    if (intent.method === "ZARINPAL") {
      const res = await this.zarinpalGateway.initiate({
        intentId: intent.id,
        orderId: intent.orderId,
        amount,
        callbackUrl,
        description: `پرداخت سفارش ${intent.order.orderNumber}`,
        payerPhone: intent.order.customerPhone,
      });

      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          gatewayTrackingId: res.gatewayTrackingId,
          status: "PENDING_PROVIDER",
        },
      });

      return {
        redirectUrl: res.redirectUrl,
        gatewayTrackingId: res.gatewayTrackingId,
        method: "ZARINPAL",
      };
    } else if (intent.method === "CARD_TO_CARD") {
      const res = await this.cardToCardGateway.initiate({
        intentId: intent.id,
        orderId: intent.orderId,
        amount,
        callbackUrl,
        description: `کارت به کارت سفارش ${intent.order.orderNumber}`,
      });

      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          gatewayTrackingId: res.gatewayTrackingId,
          status: "PENDING_PROVIDER",
        },
      });

      return {
        merchant: (res.rawResponse as any)?.merchant,
        amountRials: intent.amount.toString(),
        amountTomans: amount.toTomans().toString(),
        method: "CARD_TO_CARD",
      };
    }

    throw new BadRequestException("روش پرداخت پشتیبانی نمی‌شود");
  }

  async verifyZarinpalCallback(intentId: string, query: Record<string, any>) {
    const intent = await this.prisma.paymentIntent.findUnique({
      where: { id: intentId },
      include: { order: true },
    });

    if (!intent) {
      throw new NotFoundException("تراکنش پرداخت یافت نشد");
    }

    if (intent.status === "CAPTURED") {
      return { success: true, orderId: intent.orderId, refId: intent.refId, alreadyCaptured: true };
    }

    const amount = Money.fromRials(BigInt(intent.amount.toString()));
    const verifyResult = await this.zarinpalGateway.verifyCallback({
      intentId: intent.id,
      expectedAmount: amount,
      queryOrBody: query,
    });

    if (!verifyResult.success) {
      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: "FAILED",
          errorMessage: verifyResult.errorMessage,
        },
      });
      return { success: false, errorMessage: verifyResult.errorMessage };
    }

    // Capture payment and settle in atomic transaction
    await this.prisma.$transaction(async (tx) => {
      // 1. Update PaymentIntent
      await tx.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: "CAPTURED",
          refId: verifyResult.refId,
          cardPan: verifyResult.cardPan,
        },
      });

      // 2. Update Order to PAID
      await tx.order.update({
        where: { id: intent.orderId },
        data: { status: "PAID" },
      });

      // 3. Record order status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: intent.orderId,
          fromStatus: "PENDING_PAYMENT",
          toStatus: "PAID",
          actor: "ZARINPAL_GATEWAY",
          reason: `پرداخت موفق با شناسه پیگیری ${verifyResult.refId}`,
        },
      });

      // 4. Emit Outbox Event for SMS and fulfillment
      await tx.outboxEvent.create({
        data: {
          tenantId: intent.tenantId,
          eventType: "ORDER_PAID",
          payloadJson: {
            orderId: intent.orderId,
            orderNumber: intent.order.orderNumber,
            totalAmount: intent.amount.toString(),
            phone: intent.order.customerPhone,
          },
        },
      });
    });

    // Post double-entry accounting sale journal
    const quoteSnapshot: any = intent.order.priceSnapshot;
    await this.ledgerService.postSaleJournal({
      orderId: intent.orderId,
      tenantId: intent.tenantId,
      storeId: intent.storeId,
      quote: quoteSnapshot,
      paymentMethod: "GATEWAY",
    });

    return {
      success: true,
      orderId: intent.orderId,
      orderNumber: intent.order.orderNumber,
      refId: verifyResult.refId,
    };
  }

  async submitCardToCardReceipt(params: {
    intentId: string;
    referenceNumber: string;
    payerCardNumber?: string;
    receiptImageUrl?: string;
  }) {
    const { intentId, referenceNumber, payerCardNumber, receiptImageUrl } = params;
    const intent = await this.prisma.paymentIntent.findUnique({
      where: { id: intentId },
    });

    if (!intent) {
      throw new NotFoundException("تراکنش پرداخت یافت نشد");
    }

    return await this.prisma.cardToCardReceipt.create({
      data: {
        paymentIntentId: intent.id,
        referenceNumber,
        payerCardNumber,
        receiptImageUrl,
        status: "PENDING_REVIEW",
      },
    });
  }

  async approveCardToCardReceipt(receiptId: string, reviewer: string) {
    const receipt = await this.prisma.cardToCardReceipt.findUnique({
      where: { id: receiptId },
      include: {
        paymentIntent: {
          include: { order: true },
        },
      },
    });

    if (!receipt || receipt.status !== "PENDING_REVIEW") {
      throw new BadRequestException("فیش واریزی در وضعیت انتظار بررسی نیست");
    }

    const intent = receipt.paymentIntent;

    await this.prisma.$transaction(async (tx) => {
      await tx.cardToCardReceipt.update({
        where: { id: receiptId },
        data: {
          status: "APPROVED",
          reviewedBy: reviewer,
          reviewedAt: new Date(),
        },
      });

      await tx.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: "CAPTURED",
          refId: `C2C-${receipt.referenceNumber}`,
          cardPan: receipt.payerCardNumber,
        },
      });

      await tx.order.update({
        where: { id: intent.orderId },
        data: { status: "PAID" },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: intent.orderId,
          fromStatus: "PENDING_PAYMENT",
          toStatus: "PAID",
          actor: reviewer,
          reason: `تایید دستی فیش واریز بانکی شماره ${receipt.referenceNumber}`,
        },
      });
    });

    // Post double-entry accounting journal
    await this.ledgerService.postSaleJournal({
      orderId: intent.orderId,
      tenantId: intent.tenantId,
      storeId: intent.storeId,
      quote: intent.order.priceSnapshot as any,
      paymentMethod: "CARD_TO_CARD",
    });

    return {
      success: true,
      orderId: intent.orderId,
      refId: `C2C-${receipt.referenceNumber}`,
    };
  }
}
