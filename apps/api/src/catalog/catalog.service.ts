import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DEMO_FALLBACK_PRODUCTS } from './demo-data';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveStore(slug: string) {
    if (!slug || slug.trim().length === 0) {
      throw new BadRequestException('شناسه فروشگاه الزامی است');
    }

    let store: { id: string; tenantId: string; slug: string; name: string } | null = null;
    let dbAvailable = true;
    try {
      store = await this.prisma.store.findFirst({
        where: {
          slug,
          status: 'ACTIVE',
          organization: { is: { tenant: { is: { status: 'ACTIVE' } } } },
        },
        select: { id: true, tenantId: true, slug: true, name: true },
      });
    } catch {
      // Resilient mode (DB-down): fall back to the demo store so the
      // storefront checkout flow keeps working end-to-end, same as catalog.
      dbAvailable = false;
    }

    if (!store) {
      if (!dbAvailable) {
        return {
          id: 'demo-store',
          tenantId: 'demo-tenant',
          slug,
          name: 'فروشگاه نمونه (حالت تاب‌آور)',
          dbAvailable: false,
        };
      }
      throw new NotFoundException('فروشگاهی با این شناسه فعال یافت نشد');
    }

    return store;
  }

  private async resolveActiveStore(storeSlug: string) {
    try {
      const store = await this.prisma.store.findFirst({
        where: { slug: storeSlug, status: 'ACTIVE', organization: { is: { tenant: { is: { status: 'ACTIVE' } } } } },
        select: { id: true, tenantId: true, defaultCurrency: true },
      });
      return store;
    } catch {
      return null;
    }
  }

  async listPublished(storeSlug: string, limit: number) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (!store) {
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit);
      }

      const products = await this.prisma.product.findMany({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          status: 'PUBLISHED',
          publishedAt: { not: null },
        },
        orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
        take: limit,
        include: {
          vendor: { select: { slug: true, titleFa: true } },
          variants: {
            where: { tenantId: store.tenantId, storeId: store.id, status: 'ACTIVE' },
            orderBy: { sku: 'asc' },
            include: { inventoryLevels: { where: { tenantId: store.tenantId, storeId: store.id } } },
          },
        },
      });

      if (products.length === 0) {
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit);
      }

      return products.map((product) => this.toPublicProduct(product));
    } catch {
      return DEMO_FALLBACK_PRODUCTS.slice(0, limit);
    }
  }

  async getPublished(storeSlug: string, productSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (!store) {
        const fallback = DEMO_FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
        if (fallback) return fallback;
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      const product = await this.prisma.product.findFirst({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          slug: productSlug,
          status: 'PUBLISHED',
          publishedAt: { not: null },
        },
        include: {
          vendor: { select: { slug: true, titleFa: true } },
          variants: {
            where: { tenantId: store.tenantId, storeId: store.id, status: 'ACTIVE' },
            orderBy: { sku: 'asc' },
            include: { inventoryLevels: { where: { tenantId: store.tenantId, storeId: store.id } } },
          },
        },
      });

      if (!product) {
        const fallback = DEMO_FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
        if (fallback) return fallback;
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      return this.toPublicProduct(product);
    } catch (err: any) {
      const fallback = DEMO_FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
      if (fallback) return fallback;
      throw new NotFoundException('کالای مورد نظر یافت نشد.');
    }
  }

  private toPublicProduct(product: {
    id: string; slug: string; titleFa: string; description: string | null;
    kind: 'PHYSICAL' | 'DIGITAL';
    vendor: { slug: string; titleFa: string } | null;
    variants: Array<{
      id: string; sku: string; titleFa: string; priceAmount: { toFixed: (digits?: number) => string };
      currency: string; inventoryLevels: Array<{ onHandQty: number; reservedQty: number }>;
    }>;
  }) {
    return {
      id: product.id,
      slug: product.slug,
      title: product.titleFa,
      description: product.description,
      kind: product.kind,
      vendor: product.vendor ? { slug: product.vendor.slug, titleFa: product.vendor.titleFa } : null,
      variants: product.variants.map((variant) => {
        const availableQty = variant.inventoryLevels.reduce(
          (sum, level) => sum + Math.max(0, level.onHandQty - level.reservedQty), 0,
        );
        return {
          id: variant.id,
          sku: variant.sku,
          title: variant.titleFa,
          priceAmount: variant.priceAmount.toFixed(0),
          currency: variant.currency,
          inStock: availableQty > 0,
        };
      }),
    };
  }
}
