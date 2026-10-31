import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { calculateQuote, Quote, QuoteLineInput, CouponRule, Money } from "@commerce-os/domain";
import { DEMO_FALLBACK_PRODUCTS } from "../catalog/demo-data";

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async generateQuote(params: {
    storeId: string;
    items: QuoteLineInput[];
    couponCode?: string;
  }): Promise<Quote> {
    const { storeId, items, couponCode } = params;

    let tenantId = "demo-tenant-id";
    const variantMap = new Map<string, any>();

    // Pre-populate with fallback data
    for (const p of DEMO_FALLBACK_PRODUCTS) {
      for (const v of p.variants) {
        variantMap.set(v.id, {
          id: v.id,
          productId: p.id,
          title: `${p.titleFa} - ${v.titleFa}`,
          sku: v.sku,
          priceAmount: BigInt(v.priceAmount),
          currency: v.currency,
        });
      }
    }

    try {
      const store = await this.prisma.store.findUnique({
        where: { id: storeId },
      });

      if (store) {
        tenantId = store.tenantId;
        const variantIds = items.map((i) => i.variantId);
        const dbVariants = await this.prisma.productVariant.findMany({
          where: {
            id: { in: variantIds },
            storeId,
            status: "ACTIVE",
          },
        });

        for (const v of dbVariants) {
          variantMap.set(v.id, {
            id: v.id,
            productId: v.productId,
            title: v.titleFa,
            sku: v.sku,
            priceAmount: BigInt(v.priceAmount.toString()),
            currency: v.currency,
          });
        }
      }
    } catch {
      // Fallback in-memory
    }

    let couponRule: CouponRule | undefined;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      if (cleanCode === "WELCOME10" || cleanCode === "OFF10") {
        couponRule = {
          code: cleanCode,
          discountBps: 1000, // 10%
          maxDiscount: Money.fromTomans(500000n),
        };
      }
    }

    return calculateQuote({
      storeId,
      tenantId,
      items,
      variantFinder: (id) => variantMap.get(id),
      coupon: couponRule,
    });
  }
}
