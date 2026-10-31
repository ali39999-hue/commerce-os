import { Injectable, BadRequestException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { PricingService } from "../pricing/pricing.service";
import { InventoryService } from "../inventory/inventory.service";
import { QuoteLineInput, AddressSnapshot } from "@commerce-os/domain";
import { validateIranianMobile, validatePostalCode } from "@commerce-os/localization";
import * as crypto from "node:crypto";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
    private readonly inventoryService: InventoryService
  ) {}

  async startCheckout(params: {
    storeId?: string;
    storeSlug?: string;
    items: QuoteLineInput[];
    customerPhone: string;
    customerName: string;
    address: AddressSnapshot;
    couponCode?: string;
  }) {
    const { storeId, storeSlug, items, customerPhone, customerName, address, couponCode } = params;

    if (!validateIranianMobile(customerPhone)) {
      throw new BadRequestException("شماره موبایل وارد شده نامعتبر است");
    }

    if (address?.postalCode && !validatePostalCode(address.postalCode)) {
      throw new BadRequestException("کد پستی ۱۰ رقمی نامعتبر است");
    }

    let store: { id: string; tenantId: string } | null = null;

    if (storeId) {
      // Explicit store id (as before)
      store = await this.prisma.store.findUnique({
        where: { id: storeId },
      });
    } else if (storeSlug) {
      try {
        store = await this.prisma.store.findFirst({
          where: { slug: storeSlug, status: "ACTIVE" },
        });
      } catch {
        store = null;
      }
    }

    if (!store) {
      throw new BadRequestException("فروشگاه یافت نشد");
    }

    // 1. Calculate price quote
    const quote = await this.pricingService.generateQuote({
      storeId: store.id,
      items,
      couponCode,
    });

    // 2. Reserve stock atomically
    const { reservationId, expiresAt } = await this.inventoryService.reserveStock({
      tenantId: store.tenantId,
      storeId: store.id,
      items,
      ttlMinutes: 15,
    });

    // 3. Create CheckoutSession
    const session = await this.prisma.checkoutSession.create({
      data: {
        tenantId: store.tenantId,
        storeId: store.id,
        reservationId,
        quoteFingerprint: quote.fingerprint,
        quoteSnapshot: quote as any,
        addressSnapshot: address as any,
        expiresAt,
      },
    });

    return {
      sessionId: session.id,
      quote,
      expiresAt,
    };
  }

  async placeOrder(params: {
    sessionId: string;
    paymentMethod: "ZARINPAL" | "CARD_TO_CARD" | "WALLET";
    idempotencyKey: string;
  }) {
    const { sessionId, paymentMethod, idempotencyKey } = params;

    const session = await this.prisma.checkoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new BadRequestException("جلسه تسویه‌حساب منقضی شده است. لطفاً مجدداً تلاش فرمایید.");
    }

    const quoteSnapshot: any = session.quoteSnapshot;
    const addressSnapshot: any = session.addressSnapshot;

    // Check Idempotency Record
    const requestHash = crypto
      .createHash("sha256")
      .update(`${sessionId}:${paymentMethod}:${quoteSnapshot.total.amount}`)
      .digest("hex");

    const existingIdem = await this.prisma.idempotencyRecord.findUnique({
      where: {
        tenantId_scope_key: {
          tenantId: session.tenantId,
          scope: "ORDER_PLACE",
          key: idempotencyKey,
        },
      },
    });

    if (existingIdem) {
      if (existingIdem.requestHash !== requestHash) {
        throw new ConflictException("این کلید آیدمپوتنسی قبلاً با درخواست دیگری ارسال شده است");
      }
      return existingIdem.responseJson;
    }

    // Register Idempotency as STARTED
    await this.prisma.idempotencyRecord.create({
      data: {
        tenantId: session.tenantId,
        scope: "ORDER_PLACE",
        key: idempotencyKey,
        requestHash,
        status: "STARTED",
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
    });

    // Generate Order in Transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const order = await tx.order.create({
        data: {
          tenantId: session.tenantId,
          storeId: session.storeId,
          orderNumber,
          customerPhone: addressSnapshot?.receiverPhone || "09120000000",
          customerName: addressSnapshot?.receiverName || "مشتری فروشگاه",
          status: "PENDING_PAYMENT",
          subtotalAmount: quoteSnapshot.subtotal.amount,
          discountAmount: quoteSnapshot.totalDiscount?.amount || 0,
          vatAmount: quoteSnapshot.vat.amount,
          shippingAmount: quoteSnapshot.shipping.amount,
          totalAmount: quoteSnapshot.total.amount,
          currency: "IRR",
          addressJson: addressSnapshot || {},
          priceSnapshot: quoteSnapshot,
        },
      });

      // Insert Order Lines
      for (const line of quoteSnapshot.lines) {
        await tx.orderLine.create({
          data: {
            orderId: order.id,
            variantId: line.variantId,
            titleFa: line.title,
            sku: line.sku,
            unitPrice: line.unitPrice.amount,
            qty: line.qty,
            subtotal: line.subtotal.amount,
            discount: line.discount.amount,
            total: line.total.amount,
          },
        });
      }

      // Record Order History
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: "DRAFT",
          toStatus: "PENDING_PAYMENT",
          actor: "CUSTOMER",
          reason: "ایجاد اولیه سفارش و انتظار پرداخت",
        },
      });

      // Create Payment Intent
      const paymentIntent = await tx.paymentIntent.create({
        data: {
          tenantId: session.tenantId,
          storeId: session.storeId,
          orderId: order.id,
          method: paymentMethod as any,
          status: "CREATED",
          amount: quoteSnapshot.total.amount,
          currency: "IRR",
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentIntentId: paymentIntent.id,
        amount: quoteSnapshot.total,
        paymentMethod,
        reservationId: session.reservationId,
      };
    });

    // Update Idempotency with final payload
    await this.prisma.idempotencyRecord.update({
      where: {
        tenantId_scope_key: {
          tenantId: session.tenantId,
          scope: "ORDER_PLACE",
          key: idempotencyKey,
        },
      },
      data: {
        status: "COMPLETED",
        responseJson: result as any,
      },
    });

    return result;
  }
}
