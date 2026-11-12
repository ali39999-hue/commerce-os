import { Injectable, BadRequestException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { PricingService, normalizeIranianPhone } from "../pricing/pricing.service";
import { resolveStoreVariants } from "../pricing/variant-resolver";
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
    cartSessionId?: string;
    customerId?: string;
    items: QuoteLineInput[];
    customerPhone: string;
    customerName: string;
    customerType?: "B2C" | "B2B" | "B2B_CLINIC";
    clinicName?: string;
    medicalLicenseNumber?: string;
    nationalCode?: string;
    economicCode?: string;
    shippingMethod?: string;
    deliverySlot?: string;
    address: AddressSnapshot;
    couponCode?: string;
  }) {
    const {
      storeId,
      storeSlug,
      cartSessionId,
      customerId,
      items,
      customerPhone,
      customerName,
      customerType,
      clinicName,
      medicalLicenseNumber,
      nationalCode,
      economicCode,
      shippingMethod,
      deliverySlot,
      address,
      couponCode,
    } = params;

    const normalizedPhone = normalizeIranianPhone(customerPhone) ?? customerPhone;
    const normalizedReceiverPhone =
      normalizeIranianPhone(address?.receiverPhone) ?? address?.receiverPhone ?? normalizedPhone;
    const normalizedCustomerType =
      customerType === "B2B" || customerType === "B2B_CLINIC" ? "B2B_CLINIC" : "B2C";
    const cleanCouponCode = couponCode?.trim().toUpperCase() || undefined;

    if (!validateIranianMobile(normalizedPhone)) {
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
    } else {
      store = await this.prisma.store.findFirst({
        where: { status: "ACTIVE" },
      });
    }

    if (!store) {
      throw new BadRequestException("فروشگاه یافت نشد");
    }

    // 0. Normalize any legacy client variant IDs (e.g. var-prod_shop_*) to canonical DB UUIDs
    const resolvedMap = await resolveStoreVariants(
      this.prisma,
      store.id,
      items.map((i) => ({ variantId: i.variantId })),
    );
    const mergedByCanonicalId = new Map<string, number>();
    for (const item of items) {
      const matched = resolvedMap.get(item.variantId);
      if (!matched) {
        throw new BadRequestException(
          `کالای انتخاب‌شده (${item.variantId}) در کاتالوگ فعال فروشگاه یافت نشد. لطفاً صفحه سبد خرید را به‌روزرسانی کنید.`,
        );
      }
      mergedByCanonicalId.set(
        matched.id,
        (mergedByCanonicalId.get(matched.id) ?? 0) + item.qty,
      );
    }
    const normalizedItems: QuoteLineInput[] = Array.from(mergedByCanonicalId.entries()).map(
      ([variantId, qty]) => ({ variantId, qty }),
    );

    // 1. Calculate price quote & enforce targeted coupon rules (B2B/Clinic/Visitor/Per-user)
    const quote = await this.pricingService.generateQuote({
      storeId: store.id,
      items: normalizedItems,
      couponCode: cleanCouponCode,
      customerPhone: normalizedPhone,
      userId: customerId,
      customerType: normalizedCustomerType,
      medicalLicenseNumber,
    });

    const quoteWithContext = {
      ...quote,
      customerType: normalizedCustomerType,
      clinicName: clinicName?.trim() || quote.couponMeta?.clinicName || null,
      visitorCode: quote.couponMeta?.visitorCode || null,
      couponCode: quote.couponMeta?.code || cleanCouponCode || null,
      shippingMethod: shippingMethod || "POST_PISHTAZ",
      deliverySlot: deliverySlot || null,
    };

    const fullAddressSnapshot = {
      ...address,
      receiverPhone: normalizedReceiverPhone,
      nationalCode: nationalCode || undefined,
      economicCode: economicCode || undefined,
      clinicName: clinicName?.trim() || quote.couponMeta?.clinicName || undefined,
      medicalLicenseNumber: medicalLicenseNumber?.trim() || undefined,
      shippingMethod: shippingMethod || "POST_PISHTAZ",
      deliverySlot: deliverySlot || undefined,
    };

    // 2. Reserve stock atomically using canonical variant IDs
    const { reservationId, expiresAt } = await this.inventoryService.reserveStock({
      tenantId: store.tenantId,
      storeId: store.id,
      items: normalizedItems,
      ttlMinutes: 15,
    });

    // 3. Link or upsert live Cart funnel record in ERP to PAYMENT_INITIATED
    let linkedCartId: string | null = null;
    try {
      if (cartSessionId) {
        const upsertedCart = await this.prisma.cart.upsert({
          where: {
            tenantId_storeId_sessionId: {
              tenantId: store.tenantId,
              storeId: store.id,
              sessionId: cartSessionId,
            },
          },
          create: {
            tenantId: store.tenantId,
            storeId: store.id,
            sessionId: cartSessionId,
            userId: customerId ?? null,
            customerName: customerName.trim(),
            customerPhone: normalizedPhone,
            customerType: normalizedCustomerType,
            stage: "PAYMENT_INITIATED",
            couponCode: quoteWithContext.couponCode,
            shippingMethod: shippingMethod || "POST_PISHTAZ",
            subtotalAmount: quote.subtotal.amount.toString(),
            discountAmount: (quote.totalDiscount?.amount ?? 0n).toString(),
            totalAmount: quote.total.amount.toString(),
            lastActivityAt: new Date(),
          },
          update: {
            ...(customerId ? { userId: customerId } : {}),
            customerName: customerName.trim(),
            customerPhone: normalizedPhone,
            customerType: normalizedCustomerType,
            stage: "PAYMENT_INITIATED",
            couponCode: quoteWithContext.couponCode,
            shippingMethod: shippingMethod || "POST_PISHTAZ",
            subtotalAmount: quote.subtotal.amount.toString(),
            discountAmount: (quote.totalDiscount?.amount ?? 0n).toString(),
            totalAmount: quote.total.amount.toString(),
            lastActivityAt: new Date(),
          },
        });
        linkedCartId = upsertedCart.id;
      }
    } catch {
      // Non-fatal: checkout continues cleanly even if live cart record update fails
    }

    // 4. Create CheckoutSession
    const session = await this.prisma.checkoutSession.create({
      data: {
        tenantId: store.tenantId,
        storeId: store.id,
        cartId: linkedCartId,
        reservationId,
        customerName: customerName.trim(),
        customerPhone: normalizedPhone,
        customerType: normalizedCustomerType,
        couponCode: quoteWithContext.couponCode,
        quoteFingerprint: quote.fingerprint,
        quoteSnapshot: quoteWithContext as any,
        addressSnapshot: fullAddressSnapshot as any,
        expiresAt,
      },
    });

    return {
      sessionId: session.id,
      cartId: linkedCartId,
      quote: quoteWithContext,
      expiresAt,
    };
  }

  async placeOrder(params: {
    sessionId: string;
    paymentMethod: "ZARINPAL" | "CARD_TO_CARD" | "WALLET";
    idempotencyKey: string;
    /** Authenticated identity (AUTH-002 step 4): when present, the order's
     * customer identity comes from the OTP session — the delivery receiver
     * phone stays a free-form shipping detail on the address snapshot. */
    customer?: { id?: string; phone: string; fullName: string };
  }) {
    const { sessionId, paymentMethod, idempotencyKey, customer } = params;

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
      const buyerPhone =
        customer?.phone ?? session.customerPhone ?? addressSnapshot?.receiverPhone ?? "09120000000";
      const buyerName =
        session.customerName ?? customer?.fullName ?? addressSnapshot?.receiverName ?? "مشتری فروشگاه";
      const buyerType = session.customerType || quoteSnapshot?.customerType || "B2C";
      const appliedCouponCode = session.couponCode || quoteSnapshot?.couponCode || null;
      const visitorCode = quoteSnapshot?.visitorCode || quoteSnapshot?.couponMeta?.visitorCode || null;
      const clinicName =
        addressSnapshot?.clinicName || quoteSnapshot?.clinicName || quoteSnapshot?.couponMeta?.clinicName || null;

      const order = await tx.order.create({
        data: {
          tenantId: session.tenantId,
          storeId: session.storeId,
          orderNumber,
          userId: customer?.id ?? null,
          customerPhone: buyerPhone,
          customerName: buyerName,
          customerType: buyerType,
          couponCode: appliedCouponCode,
          visitorCode,
          clinicName,
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

      // Record coupon redemption & increment usedCount atomically within order transaction
      if (appliedCouponCode) {
        const dbCoupon = await tx.coupon.findFirst({
          where: {
            storeId: session.storeId,
            code: appliedCouponCode.toUpperCase(),
          },
        });
        if (dbCoupon) {
          const incremented = await tx.coupon.updateMany({
            where: {
              id: dbCoupon.id,
              isActive: true,
              ...(dbCoupon.usageLimit !== null ? { usedCount: { lt: dbCoupon.usageLimit } } : {}),
            },
            data: { usedCount: { increment: 1 } },
          });
          if (incremented.count === 0) {
            throw new BadRequestException(
              `ظرفیت یا اعتبار کد تخفیف ${dbCoupon.code} به پایان رسیده است`,
            );
          }

          await tx.couponRedemption.create({
            data: {
              couponId: dbCoupon.id,
              orderId: order.id,
              userId: customer?.id ?? null,
              customerPhone: normalizeIranianPhone(buyerPhone) ?? buyerPhone,
              customerName: buyerName,
              visitorCode: visitorCode ?? dbCoupon.visitorCode ?? null,
              discountAmount: quoteSnapshot.totalDiscount?.amount || 0,
            },
          });
        }
      }

      // Convert linked live Cart session in ERP funnel
      if (session.cartId) {
        await tx.cart.update({
          where: { id: session.cartId },
          data: {
            stage: "ORDER_PLACED",
            convertedOrderId: order.id,
            convertedOrderNumber: order.orderNumber,
            customerName: buyerName,
            customerPhone: buyerPhone,
            customerType: buyerType,
            couponCode: appliedCouponCode,
            subtotalAmount: quoteSnapshot.subtotal.amount,
            discountAmount: quoteSnapshot.totalDiscount?.amount || 0,
            totalAmount: quoteSnapshot.total.amount,
            lastActivityAt: new Date(),
          },
        });
      }

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
          reason: appliedCouponCode
            ? `ایجاد اولیه سفارش با کد تخفیف ${appliedCouponCode}`
            : "ایجاد اولیه سفارش و انتظار پرداخت",
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
        cartId: session.cartId ?? null,
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
