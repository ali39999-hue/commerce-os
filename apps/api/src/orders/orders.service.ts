import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { assertOrderTransition, OrderStatus } from "@commerce-os/domain";
import {
  generateOfficialTaxInvoiceHtml,
  DEFAULT_SELLER_INFO,
  numberToPersianWords,
  formatAccountingJalaliDate,
} from "@commerce-os/finance";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrder(idOrNumber: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
    const order = await this.prisma.order.findFirst({
      where: isUuid ? { OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }] } : { orderNumber: idOrNumber },
      include: {
        user: true,
        lines: true,
        history: { orderBy: { createdAt: "desc" } },
        paymentIntents: {
          include: { cardToCardReceipts: true },
        },
        shipments: {
          include: { events: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException("سفارش یافت نشد");
    }

    return order;
  }

  // «سفارش‌های من» (AUTH-002 step 6): orders bound to the session identity —
  // the phone always comes from the OTP session, never a client parameter.
  async listMyOrders(params: { phone: string; limit?: number; offset?: number }) {
    const { phone, limit = 20, offset = 0 } = params;

    const where = { customerPhone: phone };
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          lines: true,
          paymentIntents: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, limit, offset, dbAvailable: true };
  }

  async listStoreOrders(params: {
    storeId: string;
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  }) {
    const { storeId, status, limit = 20, offset = 0 } = params;

    let resolvedStoreId = storeId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
    if (!isUuid) {
      const store = await this.prisma.store.findFirst({
        where: { slug: storeId },
        select: { id: true },
      });
      if (store) {
        resolvedStoreId = store.id;
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          storeId: resolvedStoreId,
          ...(status ? { status } : {}),
        },
        include: {
          lines: true,
          paymentIntents: true,
          shipments: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({
        where: {
          storeId: resolvedStoreId,
          ...(status ? { status } : {}),
        },
      }),
    ]);

    return { items, total, limit, offset };
  }

  async listAdminOrders(params: {
    tenantId?: string;
    storeId?: string;
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  }) {
    const { tenantId, storeId, status, limit = 50, offset = 0 } = params;

    let resolvedStoreId = storeId;
    if (storeId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
      if (!isUuid) {
        const store = await this.prisma.store.findFirst({
          where: { slug: storeId },
          select: { id: true },
        });
        if (store) resolvedStoreId = store.id;
      }
    }

    const isDefaultTenant = !tenantId || tenantId === "00000000-0000-0000-0000-000000000000";
    const where = {
      ...(!isDefaultTenant ? { tenantId } : {}),
      ...(resolvedStoreId ? { storeId: resolvedStoreId } : {}),
      ...(status ? { status } : {}),
    };

    const [rawOrders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          lines: true,
          paymentIntents: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          shipments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({ where }),
    ]);

    const methodMap: Record<string, string> = {
      ZARINPAL: "زرین‌پال (شاپرک)",
      ZIBAL: "زیبال (شاپرک)",
      CARD_TO_CARD: "کارت‌به‌کارت بانکی",
      WALLET: "کیف پول اعتباری",
    };

    const items = rawOrders.map((order) => {
      const pi = order.paymentIntents?.[0];
      const paymentMethod = (pi && methodMap[pi.method]) || "پرداخت آنلاین";
      const totalAmountTomans = Math.round(Number(order.totalAmount) / 10);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerType: (order.customerType || "B2C") as "B2C" | "B2B_CLINIC",
        couponCode: order.couponCode || undefined,
        visitorCode: order.visitorCode || undefined,
        clinicName: order.clinicName || undefined,
        status: order.status,
        totalAmountTomans,
        paymentMethod,
        createdAt: order.createdAt.toISOString(),
        trackingNumber: order.shipments?.[0]?.trackingNumber || undefined,
        itemsCount: order.lines.reduce((acc, l) => acc + l.qty, 0),
        lines: order.lines.map((l) => ({
          id: l.id,
          titleFa: l.titleFa,
          sku: l.sku,
          qty: l.qty,
          unitPriceTomans: Math.round(Number(l.unitPrice) / 10),
          subtotalTomans: Math.round(Number(l.subtotal) / 10),
        })),
      };
    });

    return { items, total, limit, offset };
  }

  async listAdminReceipts(params: {
    tenantId?: string;
    status?: string;
    limit?: number;
  }) {
    const { tenantId, status, limit = 50 } = params;
    const isDefaultTenant = !tenantId || tenantId === "00000000-0000-0000-0000-000000000000";

    const receipts = await this.prisma.cardToCardReceipt.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(!isDefaultTenant
          ? { paymentIntent: { tenantId } }
          : {}),
      },
      include: {
        paymentIntent: {
          include: {
            order: {
              select: {
                id: true,
                orderNumber: true,
                customerName: true,
                customerPhone: true,
                customerType: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const items = receipts.map((r) => ({
      id: r.id,
      orderId: r.paymentIntent.orderId,
      orderNumber: r.paymentIntent.order.orderNumber,
      customerName: r.paymentIntent.order.customerName,
      customerPhone: r.paymentIntent.order.customerPhone,
      customerType: r.paymentIntent.order.customerType || "B2C",
      amountTomans: Math.round(Number(r.paymentIntent.amount) / 10),
      referenceNumber: r.referenceNumber,
      payerCardNumber: r.payerCardNumber || "****",
      receiptImageUrl: r.receiptImageUrl || undefined,
      status: r.status,
      reviewedBy: r.reviewedBy || undefined,
      reviewedAt: r.reviewedAt?.toISOString(),
      submittedAt: r.createdAt.toISOString(),
    }));

    return { items, total: items.length };
  }

  async transitionStatus(orderIdOrNumber: string, toStatus: OrderStatus, actor: string, reason?: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);
    const order = await this.prisma.order.findFirst({
      where: isUuid ? { OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }] } : { orderNumber: orderIdOrNumber },
    });

    if (!order) {
      throw new NotFoundException("سفارش یافت نشد");
    }

    // Enforce domain transition rules
    assertOrderTransition(order.status as any, toStatus);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: { status: toStatus },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus,
          actor,
          reason,
        },
      });

      return updated;
    });
  }

  async generateInvoiceHtml(orderId: string): Promise<string> {
    const order = await this.getOrder(orderId);
    const address: any = order.addressJson || {};
    const payment = order.paymentIntents?.[0];

    const lines = order.lines.map((l, idx) => {
      const uPrice = BigInt(l.unitPrice.toString());
      const qty = BigInt(l.qty);
      const sub = uPrice * qty;
      const disc = BigInt(l.discount?.toString() || 0);
      const net = sub - disc;
      const vat = (net * 1000n + 5000n) / 10000n; // 10%
      const finalTot = net + vat;

      return {
        rowNumber: idx + 1,
        itemCode: l.sku,
        itemTitle: l.titleFa,
        quantity: l.qty,
        unitPriceRials: uPrice,
        totalPriceRials: sub,
        discountRials: disc,
        netPriceRials: net,
        vatRateBps: 1000,
        vatAmountRials: vat,
        finalTotalRials: finalTot,
      };
    });

    const subtotal = BigInt(order.subtotalAmount.toString());
    const discount = BigInt(order.discountAmount.toString());
    const vat = BigInt(order.vatAmount.toString());
    const shipping = BigInt(order.shippingAmount.toString());
    const grandTotal = BigInt(order.totalAmount.toString());

    return generateOfficialTaxInvoiceHtml({
      invoiceNumber: `INV-${order.orderNumber.replace(/^ORD-/, "")}`,
      invoiceDateJalali: formatAccountingJalaliDate(order.createdAt),
      seller: DEFAULT_SELLER_INFO,
      buyer: {
        name: order.customerName,
        nationalId: (order.user as any)?.nationalId || "0010312013",
        postalCode: address.postalCode || "1458963214",
        phone: order.customerPhone,
        province: address.province || "تهران",
        city: address.city || "تهران",
        address: address.postalAddress || "آدرس تحویل ثبت‌شده",
      },
      lines,
      subtotalRials: subtotal,
      discountTotalRials: discount,
      taxableTotalRials: subtotal - discount,
      vatTotalRials: vat,
      shippingTotalRials: shipping,
      grandTotalRials: grandTotal,
      grandTotalTomansInWords: numberToPersianWords(grandTotal / 10n),
      paymentMethodFa: payment?.method === "CARD_TO_CARD" ? "کارت‌به‌کارت بانکی" : "درگاه شتابی شاپرک",
      transactionRef: payment?.refId || "N/A",
      ledgerJournalRef: `JRN-SALE-${order.id}`,
    });
  }
}
