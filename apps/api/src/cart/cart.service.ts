import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { normalizeIranianPhone } from "../pricing/pricing.service";
import { resolveStoreVariants } from "../pricing/variant-resolver";

export const CART_STAGE_LABELS_FA: Record<string, string> = {
  BROWSING: "در حال انتخاب محصول",
  CART_REVIEW: "بازبینی سبد خرید",
  CHECKOUT_STARTED: "ورود به تسویه‌حساب",
  SHIPPING_SELECTED: "انتخاب روش ارسال و زمان",
  PAYMENT_INITIATED: "در حال اتصال به درگاه / ثبت فیش",
  ORDER_PLACED: "سفارش نهایی ثبت شد",
  ABANDONED: "سبد رها شده / خالی‌شده",
};

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeCustomerType(raw?: string): "B2C" | "B2B_CLINIC" {
    if (raw === "B2B" || raw === "B2B_CLINIC") return "B2B_CLINIC";
    return "B2C";
  }

  private async resolveStore(storeSlug?: string) {
    return this.prisma.store.findFirst({
      where: storeSlug ? { slug: storeSlug, status: "ACTIVE" } : { status: "ACTIVE" },
      select: { id: true, tenantId: true, slug: true },
    });
  }

  async syncCart(params: {
    sessionId: string;
    storeSlug?: string;
    items: Array<{
      variantId: string;
      qty: number;
      titleFa?: string;
      sku?: string;
      unitPriceTomans?: number;
    }>;
    userId?: string;
    customerName?: string;
    customerPhone?: string;
    customerType?: "B2C" | "B2B" | "B2B_CLINIC";
    stage?:
      | "BROWSING"
      | "CART_REVIEW"
      | "CHECKOUT_STARTED"
      | "SHIPPING_SELECTED"
      | "PAYMENT_INITIATED"
      | "ORDER_PLACED"
      | "ABANDONED";
    couponCode?: string;
    shippingMethod?: string;
    subtotalTomans?: number;
    discountTomans?: number;
    totalTomans?: number;
  }) {
    const store = await this.resolveStore(params.storeSlug);
    if (!store) {
      return { ok: false, reason: "STORE_NOT_FOUND" };
    }

    const existing = await this.prisma.cart.findFirst({
      where: {
        tenantId: store.tenantId,
        storeId: store.id,
        sessionId: params.sessionId,
      },
    });

    // Preserve completed cart archive if session already converted
    if (existing?.stage === "ORDER_PLACED") {
      return {
        ok: true,
        cartId: existing.id,
        stage: existing.stage,
        alreadyConverted: true,
        convertedOrderNumber: existing.convertedOrderNumber,
      };
    }

    // Empty cart update without cluttering ERP if never created
    if (!existing && (!params.items || params.items.length === 0)) {
      return { ok: true, cartId: null, skippedEmpty: true };
    }

    const resolvedVariants = await resolveStoreVariants(
      this.prisma,
      store.id,
      params.items.map((i) => ({ variantId: i.variantId, sku: i.sku })),
    );

    let computedSubtotalRials = 0n;
    const mergedByCanonicalVariant = new Map<
      string,
      {
        variantId: string;
        qty: number;
        titleFa: string;
        sku: string;
        unitRials: bigint;
      }
    >();

    for (const item of params.items) {
      const matched = resolvedVariants.get(item.variantId);
      const unitRials = matched
        ? matched.priceAmount
        : BigInt(Math.max(0, Math.round((item.unitPriceTomans ?? 0) * 10)));
      const safeQty = Math.max(1, Math.round(item.qty));
      computedSubtotalRials += unitRials * BigInt(safeQty);

      if (matched) {
        const prev = mergedByCanonicalVariant.get(matched.id);
        mergedByCanonicalVariant.set(matched.id, {
          variantId: matched.id,
          qty: (prev?.qty ?? 0) + safeQty,
          titleFa: item.titleFa?.trim() || matched.titleFa,
          sku: matched.sku,
          unitRials,
        });
      }
    }

    const resolvedLines = Array.from(mergedByCanonicalVariant.values()).map((line) => ({
      variantId: line.variantId,
      qty: line.qty,
      titleFa: line.titleFa,
      sku: line.sku,
      unitPrice: line.unitRials.toString(),
    }));

    const subtotalRials =
      computedSubtotalRials > 0n
        ? computedSubtotalRials
        : BigInt(Math.max(0, Math.round((params.subtotalTomans ?? 0) * 10)));
    const discountRials = BigInt(Math.max(0, Math.round((params.discountTomans ?? 0) * 10)));
    const boundedDiscountRials = discountRials > subtotalRials ? subtotalRials : discountRials;
    const totalRials =
      params.totalTomans !== undefined
        ? BigInt(Math.max(0, Math.round(params.totalTomans * 10)))
        : subtotalRials - boundedDiscountRials;

    const normalizedPhone = normalizeIranianPhone(params.customerPhone);
    const normalizedType = this.normalizeCustomerType(params.customerType);
    const nextStage =
      params.items.length === 0 ? "ABANDONED" : (params.stage ?? existing?.stage ?? "BROWSING");

    const cart = await this.prisma.$transaction(async (tx) => {
      const saved = await tx.cart.upsert({
        where: {
          tenantId_storeId_sessionId: {
            tenantId: store.tenantId,
            storeId: store.id,
            sessionId: params.sessionId,
          },
        },
        create: {
          tenantId: store.tenantId,
          storeId: store.id,
          sessionId: params.sessionId,
          userId: params.userId ?? null,
          customerName: params.customerName?.trim() || null,
          customerPhone: normalizedPhone ?? null,
          customerType: normalizedType,
          stage: nextStage as any,
          couponCode: params.couponCode?.trim().toUpperCase() || null,
          shippingMethod: params.shippingMethod?.trim() || null,
          subtotalAmount: subtotalRials.toString(),
          discountAmount: boundedDiscountRials.toString(),
          totalAmount: totalRials.toString(),
          lastActivityAt: new Date(),
        },
        update: {
          ...(params.userId ? { userId: params.userId } : {}),
          ...(params.customerName !== undefined
            ? { customerName: params.customerName.trim() || null }
            : {}),
          ...(normalizedPhone ? { customerPhone: normalizedPhone } : {}),
          ...(params.customerType ? { customerType: normalizedType } : {}),
          stage: nextStage as any,
          couponCode:
            params.couponCode !== undefined
              ? params.couponCode.trim().toUpperCase() || null
              : undefined,
          ...(params.shippingMethod !== undefined
            ? { shippingMethod: params.shippingMethod.trim() || null }
            : {}),
          subtotalAmount: subtotalRials.toString(),
          discountAmount: boundedDiscountRials.toString(),
          totalAmount: totalRials.toString(),
          lastActivityAt: new Date(),
        },
      });

      await tx.cartLine.deleteMany({ where: { cartId: saved.id } });
      if (resolvedLines.length > 0) {
        await tx.cartLine.createMany({
          data: resolvedLines.map((l) => ({
            cartId: saved.id,
            variantId: l.variantId,
            qty: l.qty,
            titleFa: l.titleFa,
            sku: l.sku,
            unitPrice: l.unitPrice,
          })),
        });
      }

      return saved;
    });

    return {
      ok: true,
      cartId: cart.id,
      stage: cart.stage,
      stageLabelFa: CART_STAGE_LABELS_FA[cart.stage] ?? cart.stage,
      linesCount: resolvedLines.length,
    };
  }

  async updateStage(params: {
    sessionId: string;
    storeSlug?: string;
    stage:
      | "BROWSING"
      | "CART_REVIEW"
      | "CHECKOUT_STARTED"
      | "SHIPPING_SELECTED"
      | "PAYMENT_INITIATED"
      | "ORDER_PLACED"
      | "ABANDONED";
    userId?: string;
    customerName?: string;
    customerPhone?: string;
    customerType?: "B2C" | "B2B" | "B2B_CLINIC";
    couponCode?: string;
    shippingMethod?: string;
    subtotalTomans?: number;
    discountTomans?: number;
    totalTomans?: number;
  }) {
    const store = await this.resolveStore(params.storeSlug);
    if (!store) return { ok: false, reason: "STORE_NOT_FOUND" };

    const existing = await this.prisma.cart.findFirst({
      where: {
        tenantId: store.tenantId,
        storeId: store.id,
        sessionId: params.sessionId,
      },
    });

    if (existing?.stage === "ORDER_PLACED") {
      return {
        ok: true,
        cartId: existing.id,
        stage: existing.stage,
        convertedOrderNumber: existing.convertedOrderNumber,
      };
    }

    const normalizedPhone = normalizeIranianPhone(params.customerPhone);
    const normalizedType = params.customerType
      ? this.normalizeCustomerType(params.customerType)
      : undefined;

    const saved = await this.prisma.cart.upsert({
      where: {
        tenantId_storeId_sessionId: {
          tenantId: store.tenantId,
          storeId: store.id,
          sessionId: params.sessionId,
        },
      },
      create: {
        tenantId: store.tenantId,
        storeId: store.id,
        sessionId: params.sessionId,
        userId: params.userId ?? null,
        customerName: params.customerName?.trim() || null,
        customerPhone: normalizedPhone ?? null,
        customerType: normalizedType ?? "B2C",
        stage: params.stage as any,
        couponCode: params.couponCode?.trim().toUpperCase() || null,
        shippingMethod: params.shippingMethod?.trim() || null,
        subtotalAmount: BigInt(Math.max(0, Math.round((params.subtotalTomans ?? 0) * 10))).toString(),
        discountAmount: BigInt(Math.max(0, Math.round((params.discountTomans ?? 0) * 10))).toString(),
        totalAmount: BigInt(Math.max(0, Math.round((params.totalTomans ?? 0) * 10))).toString(),
        lastActivityAt: new Date(),
      },
      update: {
        ...(params.userId ? { userId: params.userId } : {}),
        ...(params.customerName !== undefined
          ? { customerName: params.customerName.trim() || null }
          : {}),
        ...(normalizedPhone ? { customerPhone: normalizedPhone } : {}),
        ...(normalizedType ? { customerType: normalizedType } : {}),
        stage: params.stage as any,
        ...(params.couponCode !== undefined
          ? { couponCode: params.couponCode.trim().toUpperCase() || null }
          : {}),
        ...(params.shippingMethod !== undefined
          ? { shippingMethod: params.shippingMethod.trim() || null }
          : {}),
        ...(params.subtotalTomans !== undefined
          ? { subtotalAmount: BigInt(Math.max(0, Math.round(params.subtotalTomans * 10))).toString() }
          : {}),
        ...(params.discountTomans !== undefined
          ? { discountAmount: BigInt(Math.max(0, Math.round(params.discountTomans * 10))).toString() }
          : {}),
        ...(params.totalTomans !== undefined
          ? { totalAmount: BigInt(Math.max(0, Math.round(params.totalTomans * 10))).toString() }
          : {}),
        lastActivityAt: new Date(),
      },
    });

    return {
      ok: true,
      cartId: saved.id,
      stage: saved.stage,
      stageLabelFa: CART_STAGE_LABELS_FA[saved.stage] ?? saved.stage,
    };
  }

  async listAdminCartSessions(params: { tenantId?: string; limit?: number }) {
    const isDefaultTenant =
      !params.tenantId || params.tenantId === "00000000-0000-0000-0000-000000000000";

    const carts = await this.prisma.cart.findMany({
      where: !isDefaultTenant ? { tenantId: params.tenantId } : {},
      include: {
        lines: {
          include: {
            variant: {
              include: { product: { select: { titleFa: true, slug: true } } },
            },
          },
        },
      },
      orderBy: { lastActivityAt: "desc" },
      take: params.limit ?? 60,
    });

    const items = carts.map((c) => ({
      id: c.id,
      sessionId: c.sessionId,
      customerName: c.customerName || "مهمان فروشگاه",
      customerPhone: c.customerPhone || null,
      customerType: (c.customerType || "B2C") as "B2C" | "B2B_CLINIC",
      stage: c.stage,
      stageLabelFa: CART_STAGE_LABELS_FA[c.stage] ?? c.stage,
      couponCode: c.couponCode,
      shippingMethod: c.shippingMethod,
      subtotalTomans: Math.round(Number(c.subtotalAmount) / 10),
      discountTomans: Math.round(Number(c.discountAmount) / 10),
      totalTomans: Math.round(Number(c.totalAmount) / 10),
      convertedOrderId: c.convertedOrderId,
      convertedOrderNumber: c.convertedOrderNumber,
      itemsCount: c.lines.reduce((acc, l) => acc + l.qty, 0),
      lines: c.lines.map((l) => ({
        id: l.id,
        variantId: l.variantId,
        qty: l.qty,
        titleFa: l.titleFa || l.variant?.product?.titleFa || l.variant?.titleFa || "محصول کلینیکال",
        sku: l.sku || l.variant?.sku || "",
        unitPriceTomans: Math.round(
          Number(l.unitPrice ?? l.variant?.priceAmount ?? 0) / 10,
        ),
      })),
      lastActivityAt: c.lastActivityAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
    }));

    const summary = {
      totalSessions: items.length,
      activeBrowsing: items.filter((i) => i.stage === "BROWSING" || i.stage === "CART_REVIEW").length,
      inCheckout: items.filter(
        (i) => i.stage === "CHECKOUT_STARTED" || i.stage === "SHIPPING_SELECTED",
      ).length,
      paymentInitiated: items.filter((i) => i.stage === "PAYMENT_INITIATED").length,
      convertedOrders: items.filter((i) => i.stage === "ORDER_PLACED").length,
      potentialRevenueTomans: items
        .filter((i) => i.stage !== "ORDER_PLACED" && i.stage !== "ABANDONED")
        .reduce((acc, i) => acc + i.totalTomans, 0),
    };

    return { items, summary, dbAvailable: true };
  }
}
