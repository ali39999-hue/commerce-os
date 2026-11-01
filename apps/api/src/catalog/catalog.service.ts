import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      // Resilient mode (DB-down): fall back to demo store
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
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
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
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              logoUrl: true,
              websiteUrl: true,
              originCountry: true,
            },
          },
          media: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              role: true,
              sortOrder: true,
              altText: true,
              url: true,
              width: true,
              height: true,
              mimeType: true,
              isPrimary: true,
              variantId: true,
            },
          },
          ingredients: {
            orderBy: [{ isKeyIngredient: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              name: true,
              inciName: true,
              concentrationPercent: true,
              purpose: true,
              isKeyIngredient: true,
              description: true,
              sortOrder: true,
            },
          },
          claims: {
            where: { status: 'APPROVED' },
            select: {
              id: true,
              claimText: true,
              evidenceSummary: true,
              studyReference: true,
              approvedBy: true,
              status: true,
            },
          },
          usageSteps: {
            orderBy: { stepNumber: 'asc' },
            select: {
              id: true,
              stepNumber: true,
              title: true,
              instruction: true,
              iconOrImageUrl: true,
            },
          },
          skinConcerns: {
            select: {
              concern: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  iconUrl: true,
                },
              },
            },
          },
          variants: {
            where: { tenantId: store.tenantId, storeId: store.id, status: 'ACTIVE' },
            orderBy: { sku: 'asc' },
            include: { inventoryLevels: { where: { tenantId: store.tenantId, storeId: store.id } } },
          },
        },
      });

      if (products.length === 0) {
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
      }

      return products.map((product) => this.toPublicProduct(product));
    } catch {
      return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
    }
  }

  async getPublished(storeSlug: string, productSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (!store) {
        const fallback = DEMO_FALLBACK_PRODUCTS.find(
          (p) => p.slug === productSlug || (productSlug === 'carboxygel-professional-therapy' && p.slug === 'carboxygel'),
        );
        if (fallback) return this.toPublicProduct(fallback);
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      const product = await this.prisma.product.findFirst({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          OR: [
            { slug: productSlug },
            ...(productSlug === 'carboxygel-professional-therapy' ? [{ slug: 'carboxygel' }] : []),
          ],
          status: 'PUBLISHED',
          publishedAt: { not: null },
        },
        include: {
          vendor: { select: { slug: true, titleFa: true } },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              logoUrl: true,
              websiteUrl: true,
              originCountry: true,
            },
          },
          media: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              role: true,
              sortOrder: true,
              altText: true,
              url: true,
              width: true,
              height: true,
              mimeType: true,
              isPrimary: true,
              variantId: true,
            },
          },
          ingredients: {
            orderBy: [{ isKeyIngredient: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              name: true,
              inciName: true,
              concentrationPercent: true,
              purpose: true,
              isKeyIngredient: true,
              description: true,
              sortOrder: true,
            },
          },
          claims: {
            where: { status: 'APPROVED' },
            select: {
              id: true,
              claimText: true,
              evidenceSummary: true,
              studyReference: true,
              approvedBy: true,
              status: true,
            },
          },
          usageSteps: {
            orderBy: { stepNumber: 'asc' },
            select: {
              id: true,
              stepNumber: true,
              title: true,
              instruction: true,
              iconOrImageUrl: true,
            },
          },
          skinConcerns: {
            select: {
              concern: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  iconUrl: true,
                },
              },
            },
          },
          variants: {
            where: { tenantId: store.tenantId, storeId: store.id, status: 'ACTIVE' },
            orderBy: { sku: 'asc' },
            include: { inventoryLevels: { where: { tenantId: store.tenantId, storeId: store.id } } },
          },
        },
      });

      if (!product) {
        const fallback = DEMO_FALLBACK_PRODUCTS.find(
          (p) => p.slug === productSlug || (productSlug === 'carboxygel-professional-therapy' && p.slug === 'carboxygel'),
        );
        if (fallback) return this.toPublicProduct(fallback);
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      return this.toPublicProduct(product);
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const fallback = DEMO_FALLBACK_PRODUCTS.find(
        (p) => p.slug === productSlug || (productSlug === 'carboxygel-professional-therapy' && p.slug === 'carboxygel'),
      );
      if (fallback) return this.toPublicProduct(fallback);
      throw new NotFoundException('کالای مورد نظر یافت نشد.');
    }
  }

  async getMedia(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.media ?? [];
  }

  async getIngredients(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.ingredients ?? [];
  }

  async getClaims(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.claims ?? [];
  }

  async getUsageSteps(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.usageSteps ?? [];
  }

  async listBrands(storeSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (store) {
        const brands = await this.prisma.brand.findMany({
          where: { tenantId: store.tenantId, storeId: store.id, isPublished: true },
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logoUrl: true,
            websiteUrl: true,
            originCountry: true,
          },
        });
        if (brands.length > 0) return brands;
      }
    } catch {
      // DB-down fallback
    }

    // Extract brands from fallback
    const brandsMap = new Map<string, any>();
    for (const p of DEMO_FALLBACK_PRODUCTS as any[]) {
      if (p.brand && !brandsMap.has(p.brand.slug)) {
        brandsMap.set(p.brand.slug, p.brand);
      }
    }
    return Array.from(brandsMap.values());
  }

  async listSkinConcerns(storeSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (store) {
        const concerns = await this.prisma.skinConcern.findMany({
          where: { tenantId: store.tenantId, storeId: store.id },
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            iconUrl: true,
          },
        });
        if (concerns.length > 0) return concerns;
      }
    } catch {
      // DB-down fallback
    }

    const concernMap = new Map<string, any>();
    for (const p of DEMO_FALLBACK_PRODUCTS as any[]) {
      if (Array.isArray(p.skinConcerns)) {
        for (const c of p.skinConcerns) {
          if (!concernMap.has(c.slug)) {
            concernMap.set(c.slug, c);
          }
        }
      }
    }
    return Array.from(concernMap.values());
  }

  // ── Admin Endpoints (Tenant-Isolated) ──

  async adminListProducts(tenantId: string, storeSlug?: string, limit = 50) {
    try {
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { tenantId, slug: storeSlug },
          select: { id: true },
        });
        if (store) storeId = store.id;
      }

      const products = await this.prisma.product.findMany({
        where: {
          tenantId,
          ...(storeId ? { storeId } : {}),
        },
        orderBy: { updatedAt: 'desc' },
        take: Math.min(Math.max(limit, 1), 100),
        include: {
          brand: true,
          category: true,
          vendor: true,
          media: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          claims: true,
          ingredients: true,
          usageSteps: true,
          skinConcerns: { include: { concern: true } },
        },
      });

      return products.map((p) => this.toPublicProduct(p));
    } catch {
      // Resilient fallback for admin
      return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
    }
  }

  async adminGetProduct(tenantId: string, productId: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          id: productId,
          tenantId,
        },
        include: {
          brand: true,
          category: true,
          vendor: true,
          media: { orderBy: { sortOrder: 'asc' } },
          variants: { include: { inventoryLevels: true } },
          claims: true, // Includes DRAFT, REVIEW_REQUIRED, APPROVED
          ingredients: { orderBy: { sortOrder: 'asc' } },
          usageSteps: { orderBy: { stepNumber: 'asc' } },
          skinConcerns: { include: { concern: true } },
        },
      });

      if (!product) {
        throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
      }

      return this.toPublicProduct(product);
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const fallback = DEMO_FALLBACK_PRODUCTS.find((p) => p.id === productId);
      if (fallback) return this.toPublicProduct(fallback);
      throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
    }
  }

  async adminListBrands(tenantId: string, storeSlug?: string) {
    try {
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { tenantId, slug: storeSlug },
          select: { id: true },
        });
        if (store) storeId = store.id;
      }

      return await this.prisma.brand.findMany({
        where: {
          tenantId,
          ...(storeId ? { storeId } : {}),
        },
        orderBy: { name: 'asc' },
      });
    } catch {
      return this.listBrands(storeSlug ?? 'demo');
    }
  }

  async adminListSkinConcerns(tenantId: string, storeSlug?: string) {
    try {
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { tenantId, slug: storeSlug },
          select: { id: true },
        });
        if (store) storeId = store.id;
      }

      return await this.prisma.skinConcern.findMany({
        where: {
          tenantId,
          ...(storeId ? { storeId } : {}),
        },
        orderBy: { name: 'asc' },
      });
    } catch {
      return this.listSkinConcerns(storeSlug ?? 'demo');
    }
  }

  private toPublicProduct(product: any) {
    const brand = product.brand
      ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
          description: product.brand.description ?? null,
          logoUrl: product.brand.logoUrl ?? null,
          websiteUrl: product.brand.websiteUrl ?? null,
          originCountry: product.brand.originCountry ?? null,
        }
      : null;

    const media = Array.isArray(product.media)
      ? product.media.map((m: any) => ({
          id: m.id,
          role: m.role,
          sortOrder: m.sortOrder,
          altText: m.altText ?? null,
          url: m.url,
          width: m.width ?? null,
          height: m.height ?? null,
          mimeType: m.mimeType ?? null,
          isPrimary: Boolean(m.isPrimary),
          variantId: m.variantId ?? null,
        }))
      : [];

    const ingredients = Array.isArray(product.ingredients)
      ? product.ingredients.map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          inciName: ing.inciName ?? null,
          concentrationPercent: ing.concentrationPercent
            ? typeof ing.concentrationPercent === 'string'
              ? ing.concentrationPercent
              : ing.concentrationPercent.toFixed?.(2) ?? String(ing.concentrationPercent)
            : null,
          purpose: ing.purpose ?? null,
          isKeyIngredient: Boolean(ing.isKeyIngredient),
          description: ing.description ?? null,
          sortOrder: ing.sortOrder ?? 0,
        }))
      : [];

    const claims = Array.isArray(product.claims)
      ? product.claims.map((c: any) => ({
          id: c.id,
          claimText: c.claimText,
          evidenceSummary: c.evidenceSummary ?? null,
          studyReference: c.studyReference ?? null,
          approvedBy: c.approvedBy ?? null,
          status: c.status,
        }))
      : [];

    const usageSteps = Array.isArray(product.usageSteps)
      ? product.usageSteps.map((s: any) => ({
          id: s.id,
          stepNumber: s.stepNumber,
          title: s.title,
          instruction: s.instruction,
          iconOrImageUrl: s.iconOrImageUrl ?? null,
        }))
      : [];

    const skinConcerns = Array.isArray(product.skinConcerns)
      ? product.skinConcerns.map((sc: any) => {
          const concern = sc.concern ?? sc;
          return {
            id: concern.id,
            name: concern.name,
            slug: concern.slug,
            description: concern.description ?? null,
            iconUrl: concern.iconUrl ?? null,
          };
        })
      : [];

    const variants = Array.isArray(product.variants)
      ? product.variants.map((variant: any) => {
          const availableQty = Array.isArray(variant.inventoryLevels)
            ? variant.inventoryLevels.reduce(
                (sum: number, level: any) => sum + Math.max(0, level.onHandQty - level.reservedQty),
                0,
              )
            : 20;

          const priceStr =
            typeof variant.priceAmount === 'string'
              ? variant.priceAmount
              : variant.priceAmount?.toFixed?.(0) ?? String(variant.priceAmount ?? '0');

          return {
            id: variant.id,
            sku: variant.sku,
            title: variant.titleFa ?? variant.title,
            titleFa: variant.titleFa ?? variant.title,
            priceAmount: priceStr,
            currency: variant.currency ?? 'IRR',
            inStock: availableQty > 0 || variant.inStock === true,
            digitalFileUrl: variant.digitalFileUrl ?? null,
          };
        })
      : [];

    return {
      id: product.id,
      slug: product.slug,
      title: product.titleFa ?? product.title,
      titleFa: product.titleFa ?? product.title,
      description: product.description ?? null,
      kind: product.kind ?? 'PHYSICAL',
      vendor: product.vendor ? { slug: product.vendor.slug, titleFa: product.vendor.titleFa } : null,
      brand,
      media,
      ingredients,
      claims,
      usageSteps,
      skinConcerns,
      variants,
    };
  }
}
