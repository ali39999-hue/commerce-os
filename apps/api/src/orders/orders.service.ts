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

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          storeId,
          ...(status ? { status } : {}),
        },
        include: {
          lines: true,
          paymentIntents: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({
        where: {
          storeId,
          ...(status ? { status } : {}),
        },
      }),
    ]);

    return { items, total, limit, offset };
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
