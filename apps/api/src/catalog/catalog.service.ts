import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DEMO_FALLBACK_PRODUCTS } from './demo-data';
import type {
  AdminClaimInputDto,
  AdminIngredientInputDto,
  AdminUsageStepInputDto,
  CreateAdminProductDto,
  UpdateAdminProductDto,
  UpdateAdminProductPriceDto,
} from '../common/dto/resource-writes.dto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SLUG_ALIAS_MAP: Record<string, string> = {
  'carboxygel-professional-therapy': 'carboxygel',
  'carboxypod-activation-pads': 'carboxypod',
  'carbox-station': 'carbox',
  'plasmax-pro': 'plasmax',
  'bath-and-body-works-perfect-in-pink': 'perfect-in-pink',
};

const REVERSE_SLUG_ALIASES: Record<string, string[]> = {
  carboxygel: ['carboxygel', 'carboxygel-professional-therapy'],
  carboxypod: ['carboxypod', 'carboxypod-activation-pads'],
  carbox: ['carbox', 'carbox-station'],
  plasmax: ['plasmax', 'plasmax-pro'],
  'perfect-in-pink': ['perfect-in-pink', 'bath-and-body-works-perfect-in-pink'],
};

const CATEGORY_LABEL_TO_SLUG: Record<string, { slug: string; titleFa: string }> = {
  'آمپول و سرم تخصصی': { slug: 'serum', titleFa: 'آمپول و سرم تخصصی' },
  'کربوکسی‌تراپی و اکسیژن‌رسانی': { slug: 'reeskin', titleFa: 'لاین بالینی مراقبت پوست ReeSkin' },
  'پادهای لایه‌بردار و فعال‌ساز': { slug: 'reeskin', titleFa: 'لاین بالینی مراقبت پوست ReeSkin' },
  'ماسک‌های ترنس‌درمال': { slug: 'reeskin', titleFa: 'لاین بالینی مراقبت پوست ReeSkin' },
  'ترمیم و التیام پوست': { slug: 'hydrator', titleFa: 'آبرسان و مرطوب‌کننده' },
  'میکرودرم و لایه‌برداری': { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
  'دتوکس و کنترل سبوم': { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
  'تجهیزات کلینیکال و پزشکی': { slug: 'reemed', titleFa: 'تجهیزات پزشکی و کلینیکال ReeMed' },
  'آبرسان و مرطوب‌کننده': { slug: 'hydrator', titleFa: 'آبرسان و مرطوب‌کننده' },
  'ضدلک و روشن‌کننده': { slug: 'brightening', titleFa: 'ضدلک و روشن‌کننده' },
  'تقویت کننده پوست سر و مو': { slug: 'hair', titleFa: 'تقویت کننده پوست سر و مو' },
  'بهداشت شخصی و بادی اسپلش': { slug: 'body', titleFa: 'بهداشت شخصی و بادی اسپلش' },
  'لاین بالینی مراقبت پوست ReeSkin': { slug: 'reeskin', titleFa: 'لاین بالینی مراقبت پوست ReeSkin' },
  'تجهیزات پزشکی و کلینیکال ReeMed': { slug: 'reemed', titleFa: 'تجهیزات پزشکی و کلینیکال ReeMed' },
};

const BRAND_NAME_TO_SLUG: Record<string, string> = {
  'reeskin clinical': 'reeskin',
  'reeskin': 'reeskin',
  'reemed medical pro': 'reemed',
  'reemed': 'reemed',
  'round lab': 'round-lab',
  'skin1004 madagascar': 'skin1004',
  'skin1004': 'skin1004',
  'farmstay': 'farmstay',
  'aromatica': 'aromatica',
  'sunol': 'sunol',
  'dr. melaxin': 'dr-melaxin',
  'torriden': 'torriden',
  'bath & body works': 'bath-and-body',
  'eau thermale avene': 'avene',
  'alpecin': 'alpecin',
  'differin galderma': 'differin',
  'guerlain paris': 'guerlain',
  'neutrogena': 'neutrogena',
  'phyto paris': 'phyto',
  'priorin bayer': 'priorin',
};

export interface PublicProductListFilter {
  categorySlug?: string;
  brandSlug?: string;
  collection?: string;
}

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private resolveCanonicalSlug(productSlug: string): string {
    const clean = productSlug.trim();
    return SLUG_ALIAS_MAP[clean] ?? clean;
  }

  private expandSlugCandidates(productSlug: string): string[] {
    const clean = productSlug.trim();
    const canonical = this.resolveCanonicalSlug(clean);
    const reverse = REVERSE_SLUG_ALIASES[canonical] ?? [canonical];
    return Array.from(new Set([clean, canonical, ...reverse]));
  }

  private buildProductInclude(tenantId: string, storeId: string, includeAllClaims = false) {
    return {
      category: { select: { id: true, slug: true, titleFa: true } },
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
        orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }],
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
        orderBy: [{ isKeyIngredient: 'desc' as const }, { sortOrder: 'asc' as const }],
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
        ...(includeAllClaims ? {} : { where: { status: 'APPROVED' as const } }),
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
        orderBy: { stepNumber: 'asc' as const },
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
        ...(includeAllClaims
          ? { orderBy: [{ sortOrder: 'asc' as const }, { sku: 'asc' as const }] }
          : {
              where: { tenantId, storeId, status: 'ACTIVE' as const },
              orderBy: [{ sortOrder: 'asc' as const }, { sku: 'asc' as const }],
            }),
        include: { inventoryLevels: { where: { tenantId, storeId } } },
      },
    };
  }

  private slugify(input: string, fallbackPrefix = 'item'): string {
    const cleaned = input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return cleaned || `${fallbackPrefix}-${Date.now().toString(36)}`;
  }

  private parseIngredientsInput(
    inciText?: string | null,
    structured?: AdminIngredientInputDto[],
  ): Array<{
    name: string;
    inciName: string;
    concentrationPercent: string | null;
    purpose: string;
    isKeyIngredient: boolean;
    description: string | null;
    sortOrder: number;
  }> {
    if (Array.isArray(structured) && structured.length > 0) {
      return structured
        .filter((ing) => ing && ing.name?.trim())
        .map((ing, index) => {
          const pctRaw = ing.concentrationPercent?.replace('%', '').trim();
          const pctNum = pctRaw ? Number(pctRaw) : NaN;
          return {
            name: ing.name.trim(),
            inciName: (ing.inciName || ing.name).trim(),
            concentrationPercent:
              Number.isFinite(pctNum) && pctNum >= 0 && pctNum <= 100 ? pctNum.toFixed(2) : null,
            purpose: ing.purpose?.trim() || 'ترکیب فعال درماتولوژی',
            isKeyIngredient: ing.isKeyIngredient ?? index < 5,
            description: ing.description?.trim() || null,
            sortOrder: ing.sortOrder ?? index + 1,
          };
        });
    }

    if (!inciText || !inciText.trim()) return [];

    // Split on newlines, semicolons, "+", or commas separating discrete active entries
    const tokens = inciText
      .split(/[\r\n;+]+|[,،]\s*(?=[A-Za-z\u0600-\u06FF])/)
      .map((s) => s.trim())
      .filter(Boolean);

    return tokens.map((token, index) => {
      const [rawLeft, rawPurpose] = token.split(/\s*[—–:]\s*/, 2);
      const left = (rawLeft || token).trim();
      const purpose = rawPurpose?.trim() || 'ترکیب موثره بالینی و تقویتی';
      const pctMatch = left.match(/(\d+(?:\.\d+)?)\s*%/);
      const pct = pctMatch ? Number(pctMatch[1]) : NaN;
      const cleanName = left.replace(/\d+(?:\.\d+)?\s*%/g, '').replace(/\s+/g, ' ').trim() || left;

      return {
        name: cleanName.slice(0, 190),
        inciName: left.slice(0, 250),
        concentrationPercent:
          Number.isFinite(pct) && pct >= 0 && pct <= 100 ? pct.toFixed(2) : null,
        purpose: purpose.slice(0, 250),
        isKeyIngredient: true,
        description: rawPurpose?.trim() || null,
        sortOrder: index + 1,
      };
    });
  }

  private parseClaimsInput(
    claimText?: string | null,
    structured?: AdminClaimInputDto[],
  ): Array<{
    claimText: string;
    evidenceSummary: string;
    studyReference: string | null;
    approvedBy: string;
    status: 'APPROVED' | 'DRAFT' | 'REVIEW_REQUIRED';
  }> {
    if (Array.isArray(structured) && structured.length > 0) {
      return structured
        .filter((c) => c && c.claimText?.trim())
        .map((c) => ({
          claimText: c.claimText.trim().slice(0, 490),
          evidenceSummary:
            c.evidenceSummary?.trim() || 'ثبت‌شده در مستندات فرمولاسیون و ارزیابی بالینی',
          studyReference: c.studyReference?.trim() || null,
          approvedBy: c.approvedBy?.trim() || 'کمیته علمی دکتر درمر',
          status: c.status ?? 'APPROVED',
        }));
    }

    if (!claimText || !claimText.trim()) return [];

    const tokens = claimText
      .split(/[\r\n;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return tokens.map((line) => {
      const refMatch = line.match(/\(([^)]+)\)\s*$/);
      const claimOnly = refMatch ? line.slice(0, refMatch.index).trim() : line;
      return {
        claimText: (claimOnly || line).slice(0, 490),
        evidenceSummary: 'ثبت‌شده در آزمایشگاه و ارزیابی درماتولوژی بالینی',
        studyReference: refMatch ? refMatch[1].trim() : 'Clinical Registry 2026',
        approvedBy: 'کمیته علمی دکتر درمر',
        status: 'APPROVED' as const,
      };
    });
  }

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
        where: {
          slug: storeSlug,
          status: 'ACTIVE',
          organization: { is: { tenant: { is: { status: 'ACTIVE' } } } },
        },
        select: { id: true, tenantId: true, defaultCurrency: true },
      });
      return store;
    } catch {
      return null;
    }
  }

  private async resolveTenantStore(tx: any, tenantId: string, storeSlug?: string) {
    const store = await tx.store.findFirst({
      where: {
        tenantId,
        ...(storeSlug ? { slug: storeSlug } : { status: 'ACTIVE' }),
      },
      select: { id: true, tenantId: true, slug: true },
    });
    if (!store) {
      throw new BadRequestException('فروشگاه فعال برای این مستأجر یافت نشد');
    }
    return store as { id: string; tenantId: string; slug: string };
  }

  private async resolveOrCreateCategory(
    tx: any,
    tenantId: string,
    storeId: string,
    input: { categoryId?: string | null; categorySlug?: string | null; category?: string | null },
  ): Promise<string | null> {
    if (input.categoryId && UUID_REGEX.test(input.categoryId)) {
      const byId = await tx.category.findFirst({
        where: { id: input.categoryId, storeId },
        select: { id: true },
      });
      if (byId) return byId.id;
    }

    const mappedFromLabel = input.category ? CATEGORY_LABEL_TO_SLUG[input.category.trim()] : undefined;
    const desiredSlug = input.categorySlug?.trim() || mappedFromLabel?.slug;

    if (desiredSlug) {
      const bySlug = await tx.category.findFirst({
        where: { storeId, slug: desiredSlug },
        select: { id: true },
      });
      if (bySlug) return bySlug.id;
    }

    if (input.category?.trim()) {
      const titleClean = input.category.trim();
      const byTitle = await tx.category.findFirst({
        where: { storeId, titleFa: { contains: titleClean, mode: 'insensitive' } },
        select: { id: true },
      });
      if (byTitle) return byTitle.id;

      const createdSlug = desiredSlug || this.slugify(titleClean, 'cat');
      const created = await tx.category.upsert({
        where: { storeId_slug: { storeId, slug: createdSlug } },
        update: {},
        create: {
          tenantId,
          storeId,
          slug: createdSlug,
          titleFa: mappedFromLabel?.titleFa ?? titleClean,
        },
        select: { id: true },
      });
      return created.id;
    }

    return null;
  }

  private async resolveOrCreateBrand(
    tx: any,
    tenantId: string,
    storeId: string,
    input: { brandId?: string | null; brandName?: string | null },
  ): Promise<string | null> {
    if (input.brandId && UUID_REGEX.test(input.brandId)) {
      const byId = await tx.brand.findFirst({
        where: { id: input.brandId, storeId },
        select: { id: true },
      });
      if (byId) return byId.id;
    }

    if (input.brandName?.trim()) {
      const cleanName = input.brandName.trim();
      const mappedSlug = BRAND_NAME_TO_SLUG[cleanName.toLowerCase()];

      const existing = await tx.brand.findFirst({
        where: {
          storeId,
          OR: [
            ...(mappedSlug ? [{ slug: mappedSlug }] : []),
            { name: { contains: cleanName, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
      });
      if (existing) return existing.id;

      const brandSlug = mappedSlug || this.slugify(cleanName, 'brand');
      const created = await tx.brand.upsert({
        where: { storeId_slug: { storeId, slug: brandSlug } },
        update: {},
        create: {
          tenantId,
          storeId,
          name: cleanName,
          slug: brandSlug,
          isPublished: true,
        },
        select: { id: true },
      });
      return created.id;
    }

    return null;
  }

  async listCategories(storeSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (store) {
        const categories = await this.prisma.category.findMany({
          where: { tenantId: store.tenantId, storeId: store.id },
          orderBy: [{ sortOrder: 'asc' }, { titleFa: 'asc' }],
          select: {
            id: true,
            slug: true,
            titleFa: true,
            description: true,
            imageUrl: true,
            sortOrder: true,
            _count: {
              select: {
                products: {
                  where: { status: 'PUBLISHED' },
                },
              },
            },
          },
        });
        return categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          titleFa: c.titleFa,
          description: c.description ?? null,
          imageUrl: c.imageUrl ?? null,
          sortOrder: c.sortOrder,
          productCount: c._count.products,
        }));
      }
    } catch {
      // DB-down fallback below
    }
    return [];
  }

  async listPublished(
    storeSlug: string,
    limit: number,
    filterOrCategory?: string | PublicProductListFilter,
  ) {
    const filter: PublicProductListFilter =
      typeof filterOrCategory === 'string'
        ? { categorySlug: filterOrCategory }
        : filterOrCategory ?? {};

    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (!store) {
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
      }

      const collectionWhere =
        filter.collection === 'featured'
          ? { isFeatured: true }
          : filter.collection === 'special-offers'
            ? { isSpecialOffer: true }
            : filter.collection === 'newest'
              ? { isNewest: true }
              : {};

      const products = await this.prisma.product.findMany({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          status: 'PUBLISHED',
          publishedAt: { not: null },
          ...(filter.categorySlug && filter.categorySlug !== 'all'
            ? { category: { slug: filter.categorySlug } }
            : {}),
          ...(filter.brandSlug && filter.brandSlug !== 'all'
            ? { brand: { slug: filter.brandSlug } }
            : {}),
          ...collectionWhere,
        },
        orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { id: 'asc' }],
        take: limit,
        include: this.buildProductInclude(store.tenantId, store.id, false),
      });

      if (products.length === 0 && !filter.categorySlug && !filter.brandSlug && !filter.collection) {
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
        const canonical = this.resolveCanonicalSlug(productSlug);
        const fallback = DEMO_FALLBACK_PRODUCTS.find(
          (p) => p.slug === productSlug || p.slug === canonical,
        );
        if (fallback) return this.toPublicProduct(fallback);
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      const candidates = this.expandSlugCandidates(productSlug);
      const products = await this.prisma.product.findMany({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          slug: { in: candidates },
          status: 'PUBLISHED',
          publishedAt: { not: null },
        },
        include: this.buildProductInclude(store.tenantId, store.id, false),
      });

      const canonical = this.resolveCanonicalSlug(productSlug);
      const product =
        products.find((p) => p.slug === productSlug && (p.variants?.length ?? 0) > 0) ??
        products.find((p) => p.slug === canonical) ??
        products[0];

      if (!product) {
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      return this.toPublicProduct(product);
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const canonical = this.resolveCanonicalSlug(productSlug);
      const fallback = DEMO_FALLBACK_PRODUCTS.find(
        (p) => p.slug === productSlug || p.slug === canonical,
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

  // ── Admin Endpoints (Tenant-Isolated, Transactional PIM) ──

  async adminListProducts(tenantId: string, storeSlug?: string, limit = 100) {
    try {
      let storeId: string | undefined;
      const store = await this.prisma.store.findFirst({
        where: storeSlug ? { tenantId, slug: storeSlug } : { tenantId, status: 'ACTIVE' },
        select: { id: true, tenantId: true },
      });
      if (store) {
        storeId = store.id;
      }

      const products = await this.prisma.product.findMany({
        where: {
          tenantId,
          ...(storeId ? { storeId } : {}),
        },
        orderBy: [{ updatedAt: 'desc' }, { sortOrder: 'asc' }],
        take: Math.min(Math.max(limit, 1), 100),
        include: {
          brand: true,
          category: true,
          vendor: true,
          media: { orderBy: { sortOrder: 'asc' } },
          variants: {
            orderBy: [{ sortOrder: 'asc' }, { sku: 'asc' }],
            include: { inventoryLevels: true },
          },
          claims: true,
          ingredients: { orderBy: { sortOrder: 'asc' } },
          usageSteps: { orderBy: { stepNumber: 'asc' } },
          skinConcerns: { include: { concern: true } },
        },
      });

      return products.map((p) => this.toPublicProduct(p));
    } catch {
      return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
    }
  }

  async adminCreateProduct(
    tenantId: string,
    storeSlug: string | undefined,
    dto: CreateAdminProductDto,
  ) {
    if (!dto || !dto.titleFa?.trim() || typeof dto.priceTomans !== 'number' || dto.priceTomans <= 0) {
      throw new BadRequestException('عنوان فارسی محصول و قیمت معتبر به تومان الزامی است');
    }

    const priceRials = BigInt(Math.round(dto.priceTomans)) * 10n;
    const originalPriceRials =
      dto.originalPriceTomans && dto.originalPriceTomans > dto.priceTomans
        ? BigInt(Math.round(dto.originalPriceTomans)) * 10n
        : null;
    const discountPercent =
      originalPriceRials && originalPriceRials > priceRials
        ? Number(((originalPriceRials - priceRials) * 100n) / originalPriceRials)
        : null;
    const inStock = dto.inStock !== false;
    const targetQty = inStock ? Math.max(1, Math.round(dto.stockQty ?? 50)) : 0;

    const parsedIngredients = this.parseIngredientsInput(dto.inci, dto.ingredients);
    const parsedClaims = this.parseClaimsInput(dto.claim, dto.claims);

    return this.prisma.$transaction(async (tx: any) => {
      const store = await this.resolveTenantStore(tx, tenantId, storeSlug);

      let slug = this.slugify(dto.slug || dto.titleFa, 'prod');
      const existingSlug = await tx.product.findFirst({
        where: { storeId: store.id, slug },
        select: { id: true },
      });
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
      }

      const rawSku = dto.sku?.trim() || `SKU-${slug.toUpperCase().slice(0, 12)}`;
      const existingSku = await tx.productVariant.findUnique({
        where: { sku: rawSku },
        select: { id: true },
      });
      const finalSku = existingSku ? `${rawSku}-${Date.now().toString(36).slice(-3).toUpperCase()}` : rawSku;

      const brandId = await this.resolveOrCreateBrand(tx, store.tenantId, store.id, {
        brandId: dto.brandId,
        brandName: dto.brandName,
      });

      const categoryId = await this.resolveOrCreateCategory(tx, store.tenantId, store.id, {
        categoryId: dto.categoryId,
        categorySlug: dto.categorySlug,
        category: dto.category,
      });

      const productStatus = dto.status || 'PUBLISHED';
      const created = await tx.product.create({
        data: {
          tenantId: store.tenantId,
          storeId: store.id,
          slug,
          titleFa: dto.titleFa.trim(),
          subtitleFa: dto.subtitleFa?.trim() || null,
          scientificName: dto.scientificName?.trim() || null,
          formulation: dto.formulation?.trim() || null,
          description: dto.description?.trim() || null,
          badge: dto.badge?.trim() || null,
          kind: 'PHYSICAL',
          status: productStatus,
          publishedAt: productStatus === 'PUBLISHED' ? new Date() : null,
          brandId,
          categoryId,
          isFeatured: Boolean(dto.isFeatured),
          isSpecialOffer: Boolean(dto.isSpecialOffer),
          isNewest: Boolean(dto.isNewest),
          coldChainRequired: Boolean(dto.coldChainRequired),
          clinicalData: (dto.clinicalData as any) ?? undefined,
        },
      });

      const variant = await tx.productVariant.create({
        data: {
          tenantId: store.tenantId,
          storeId: store.id,
          productId: created.id,
          sku: finalSku,
          titleFa: dto.titleFa.trim(),
          sizeOrVolume: dto.sizeOrVolume?.trim() || null,
          priceAmount: priceRials.toString(),
          originalPriceAmount: originalPriceRials ? originalPriceRials.toString() : null,
          discountPercent,
          currency: 'IRR',
          status: inStock ? 'ACTIVE' : 'ARCHIVED',
          sortOrder: 0,
        },
      });

      await tx.inventoryLevel.create({
        data: {
          tenantId: store.tenantId,
          storeId: store.id,
          variantId: variant.id,
          warehouseCode: 'MAIN',
          onHandQty: targetQty,
          reservedQty: 0,
        },
      });

      if (dto.imageUrl?.trim()) {
        await tx.productMedia.create({
          data: {
            tenantId: store.tenantId,
            storeId: store.id,
            productId: created.id,
            url: dto.imageUrl.trim(),
            role: 'HERO',
            isPrimary: true,
            altText: dto.titleFa.trim(),
            sortOrder: 1,
            mimeType: 'image/webp',
          },
        });
      }

      for (const ing of parsedIngredients) {
        await tx.productIngredient.create({
          data: {
            tenantId: store.tenantId,
            storeId: store.id,
            productId: created.id,
            name: ing.name,
            inciName: ing.inciName,
            concentrationPercent: ing.concentrationPercent,
            purpose: ing.purpose,
            isKeyIngredient: ing.isKeyIngredient,
            description: ing.description,
            sortOrder: ing.sortOrder,
          },
        });
      }

      for (const cl of parsedClaims) {
        await tx.clinicalClaim.create({
          data: {
            tenantId: store.tenantId,
            storeId: store.id,
            productId: created.id,
            claimText: cl.claimText,
            evidenceSummary: cl.evidenceSummary,
            studyReference: cl.studyReference,
            approvedBy: cl.approvedBy,
            status: cl.status,
          },
        });
      }

      if (Array.isArray(dto.usageSteps) && dto.usageSteps.length > 0) {
        for (let i = 0; i < dto.usageSteps.length; i++) {
          const step: AdminUsageStepInputDto = dto.usageSteps[i];
          await tx.usageStep.create({
            data: {
              tenantId: store.tenantId,
              storeId: store.id,
              productId: created.id,
              stepNumber: step.stepNumber ?? i + 1,
              title: step.title.trim(),
              instruction: step.instruction.trim(),
              iconOrImageUrl: step.iconOrImageUrl?.trim() || null,
            },
          });
        }
      }

      if (Array.isArray(dto.concernSlugs) && dto.concernSlugs.length > 0) {
        const concerns = await tx.skinConcern.findMany({
          where: { storeId: store.id, slug: { in: dto.concernSlugs } },
          select: { id: true },
        });
        for (const c of concerns) {
          await tx.productSkinConcern.create({
            data: {
              tenantId: store.tenantId,
              storeId: store.id,
              productId: created.id,
              concernId: c.id,
            },
          });
        }
      }

      const full = await tx.product.findUnique({
        where: { id: created.id },
        include: this.buildProductInclude(store.tenantId, store.id, true),
      });

      return this.toPublicProduct(full);
    });
  }

  private async findTenantProductForUpdate(tx: any, tenantId: string, idOrSlug: string) {
    const clean = idOrSlug.trim();
    const isUuid = UUID_REGEX.test(clean);
    const candidates = this.expandSlugCandidates(clean);

    const product = await tx.product.findFirst({
      where: isUuid
        ? { id: clean, tenantId }
        : { slug: { in: candidates }, tenantId },
      include: {
        variants: {
          orderBy: [{ sortOrder: 'asc' }, { sku: 'asc' }],
          include: { inventoryLevels: true },
        },
        ingredients: true,
        claims: true,
        media: true,
      },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
    }

    return product;
  }

  async adminUpdatePrice(
    tenantId: string,
    productIdOrSlug: string,
    dto: UpdateAdminProductPriceDto,
  ) {
    if (!dto || typeof dto.priceTomans !== 'number' || dto.priceTomans <= 0) {
      throw new BadRequestException('مبلغ معتبر به تومان الزامی است');
    }

    const priceRials = BigInt(Math.round(dto.priceTomans)) * 10n;
    const originalPriceRials =
      dto.originalPriceTomans && dto.originalPriceTomans > dto.priceTomans
        ? BigInt(Math.round(dto.originalPriceTomans)) * 10n
        : null;
    const discountPercent =
      originalPriceRials && originalPriceRials > priceRials
        ? Number(((originalPriceRials - priceRials) * 100n) / originalPriceRials)
        : undefined;

    return this.prisma.$transaction(async (tx: any) => {
      const product = await this.findTenantProductForUpdate(tx, tenantId, productIdOrSlug);

      const targetVariants = dto.variantId
        ? product.variants.filter((v: any) => v.id === dto.variantId)
        : product.variants;

      if (targetVariants.length === 0) {
        throw new NotFoundException('واریانت محصول برای بروزرسانی قیمت یافت نشد');
      }

      for (const variant of targetVariants) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            priceAmount: priceRials.toString(),
            ...(originalPriceRials ? { originalPriceAmount: originalPriceRials.toString() } : {}),
            ...(discountPercent !== undefined ? { discountPercent } : {}),
            ...(dto.inStock !== undefined ? { status: dto.inStock ? 'ACTIVE' : 'ARCHIVED' } : {}),
          },
        });

        if (dto.inStock !== undefined || dto.stockQty !== undefined) {
          const existingLevel = variant.inventoryLevels?.find((l: any) => l.warehouseCode === 'MAIN');
          const nextOnHand =
            dto.stockQty !== undefined
              ? Math.max(0, Math.round(dto.stockQty))
              : dto.inStock === false
                ? 0
                : Math.max(existingLevel?.onHandQty ?? 0, 25);

          await tx.inventoryLevel.upsert({
            where: {
              tenantId_storeId_variantId_warehouseCode: {
                tenantId: product.tenantId,
                storeId: product.storeId,
                variantId: variant.id,
                warehouseCode: 'MAIN',
              },
            },
            update: { onHandQty: nextOnHand },
            create: {
              tenantId: product.tenantId,
              storeId: product.storeId,
              variantId: variant.id,
              warehouseCode: 'MAIN',
              onHandQty: nextOnHand,
              reservedQty: 0,
            },
          });
        }
      }

      await tx.product.update({
        where: { id: product.id },
        data: { updatedAt: new Date() },
      });

      const effectiveInStock =
        dto.inStock !== undefined
          ? dto.inStock
          : targetVariants.some((v: any) => v.status === 'ACTIVE');

      return {
        success: true,
        productId: product.id,
        slug: product.slug,
        priceTomans: dto.priceTomans,
        priceRials: priceRials.toString(),
        inStock: effectiveInStock,
      };
    });
  }

  async adminUpdateProduct(
    tenantId: string,
    productIdOrSlug: string,
    dto: UpdateAdminProductDto,
  ) {
    return this.prisma.$transaction(async (tx: any) => {
      const product = await this.findTenantProductForUpdate(tx, tenantId, productIdOrSlug);

      const brandId =
        dto.brandId !== undefined || dto.brandName !== undefined
          ? await this.resolveOrCreateBrand(tx, product.tenantId, product.storeId, {
              brandId: dto.brandId,
              brandName: dto.brandName,
            })
          : undefined;

      const categoryId =
        dto.categoryId !== undefined || dto.categorySlug !== undefined || dto.category !== undefined
          ? await this.resolveOrCreateCategory(tx, product.tenantId, product.storeId, {
              categoryId: dto.categoryId,
              categorySlug: dto.categorySlug,
              category: dto.category,
            })
          : undefined;

      await tx.product.update({
        where: { id: product.id },
        data: {
          ...(dto.titleFa?.trim() ? { titleFa: dto.titleFa.trim() } : {}),
          ...(dto.subtitleFa !== undefined ? { subtitleFa: dto.subtitleFa?.trim() || null } : {}),
          ...(dto.scientificName !== undefined ? { scientificName: dto.scientificName?.trim() || null } : {}),
          ...(dto.formulation !== undefined ? { formulation: dto.formulation?.trim() || null } : {}),
          ...(dto.badge !== undefined ? { badge: dto.badge?.trim() || null } : {}),
          ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
          ...(dto.status
            ? {
                status: dto.status,
                ...(dto.status === 'PUBLISHED' && !product.publishedAt ? { publishedAt: new Date() } : {}),
              }
            : {}),
          ...(brandId !== undefined ? { brandId } : {}),
          ...(categoryId !== undefined ? { categoryId } : {}),
          ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
          ...(dto.isSpecialOffer !== undefined ? { isSpecialOffer: dto.isSpecialOffer } : {}),
          ...(dto.isNewest !== undefined ? { isNewest: dto.isNewest } : {}),
          ...(dto.coldChainRequired !== undefined ? { coldChainRequired: dto.coldChainRequired } : {}),
          ...(dto.clinicalData !== undefined ? { clinicalData: (dto.clinicalData as any) ?? undefined } : {}),
        },
      });

      // Update primary variant / price / stock if specified
      if (dto.priceTomans !== undefined || dto.inStock !== undefined || dto.stockQty !== undefined) {
        const primaryVariant = product.variants?.[0];
        if (primaryVariant) {
          const priceRials =
            dto.priceTomans !== undefined ? BigInt(Math.round(dto.priceTomans)) * 10n : null;
          await tx.productVariant.update({
            where: { id: primaryVariant.id },
            data: {
              ...(priceRials !== null ? { priceAmount: priceRials.toString() } : {}),
              ...(dto.inStock !== undefined ? { status: dto.inStock ? 'ACTIVE' : 'ARCHIVED' } : {}),
            },
          });

          if (dto.inStock !== undefined || dto.stockQty !== undefined) {
            const existingLevel = primaryVariant.inventoryLevels?.find((l: any) => l.warehouseCode === 'MAIN');
            const nextOnHand =
              dto.stockQty !== undefined
                ? Math.max(0, Math.round(dto.stockQty))
                : dto.inStock === false
                  ? 0
                  : Math.max(existingLevel?.onHandQty ?? 0, 25);

            await tx.inventoryLevel.upsert({
              where: {
                tenantId_storeId_variantId_warehouseCode: {
                  tenantId: product.tenantId,
                  storeId: product.storeId,
                  variantId: primaryVariant.id,
                  warehouseCode: 'MAIN',
                },
              },
              update: { onHandQty: nextOnHand },
              create: {
                tenantId: product.tenantId,
                storeId: product.storeId,
                variantId: primaryVariant.id,
                warehouseCode: 'MAIN',
                onHandQty: nextOnHand,
                reservedQty: 0,
              },
            });
          }
        }
      }

      // Full replace OR append INCI ingredients inside the transaction
      if (Array.isArray(dto.ingredients)) {
        await tx.productIngredient.deleteMany({ where: { productId: product.id } });
        const parsed = this.parseIngredientsInput(null, dto.ingredients);
        for (const ing of parsed) {
          await tx.productIngredient.create({
            data: {
              tenantId: product.tenantId,
              storeId: product.storeId,
              productId: product.id,
              name: ing.name,
              inciName: ing.inciName,
              concentrationPercent: ing.concentrationPercent,
              purpose: ing.purpose,
              isKeyIngredient: ing.isKeyIngredient,
              description: ing.description,
              sortOrder: ing.sortOrder,
            },
          });
        }
      } else if (dto.newIngredient?.trim()) {
        const parsed = this.parseIngredientsInput(dto.newIngredient);
        const startOrder = (product.ingredients?.length ?? 0) + 1;
        for (let i = 0; i < parsed.length; i++) {
          const ing = parsed[i];
          await tx.productIngredient.create({
            data: {
              tenantId: product.tenantId,
              storeId: product.storeId,
              productId: product.id,
              name: ing.name,
              inciName: ing.inciName,
              concentrationPercent: ing.concentrationPercent,
              purpose: ing.purpose,
              isKeyIngredient: ing.isKeyIngredient,
              description: ing.description,
              sortOrder: startOrder + i,
            },
          });
        }
      }

      // Full replace OR append clinical claims inside the transaction
      if (Array.isArray(dto.claims)) {
        await tx.clinicalClaim.deleteMany({ where: { productId: product.id } });
        const parsed = this.parseClaimsInput(null, dto.claims);
        for (const cl of parsed) {
          await tx.clinicalClaim.create({
            data: {
              tenantId: product.tenantId,
              storeId: product.storeId,
              productId: product.id,
              claimText: cl.claimText,
              evidenceSummary: cl.evidenceSummary,
              studyReference: cl.studyReference,
              approvedBy: cl.approvedBy,
              status: cl.status,
            },
          });
        }
      } else if (dto.newClaim?.trim()) {
        const parsed = this.parseClaimsInput(dto.newClaim);
        for (const cl of parsed) {
          await tx.clinicalClaim.create({
            data: {
              tenantId: product.tenantId,
              storeId: product.storeId,
              productId: product.id,
              claimText: cl.claimText,
              evidenceSummary: cl.evidenceSummary,
              studyReference: cl.studyReference,
              approvedBy: cl.approvedBy,
              status: cl.status,
            },
          });
        }
      }

      if (dto.imageUrl?.trim()) {
        const primaryMedia = product.media?.find((m: any) => m.isPrimary) ?? product.media?.[0];
        if (primaryMedia) {
          await tx.productMedia.update({
            where: { id: primaryMedia.id },
            data: { url: dto.imageUrl.trim(), isPrimary: true },
          });
        } else {
          await tx.productMedia.create({
            data: {
              tenantId: product.tenantId,
              storeId: product.storeId,
              productId: product.id,
              url: dto.imageUrl.trim(),
              role: 'HERO',
              isPrimary: true,
              altText: dto.titleFa?.trim() || product.titleFa,
              sortOrder: 1,
              mimeType: 'image/webp',
            },
          });
        }
      }

      const updated = await tx.product.findUnique({
        where: { id: product.id },
        include: this.buildProductInclude(product.tenantId, product.storeId, true),
      });

      return this.toPublicProduct(updated);
    });
  }

  async adminArchiveProduct(tenantId: string, productIdOrSlug: string) {
    return this.prisma.$transaction(async (tx: any) => {
      const product = await this.findTenantProductForUpdate(tx, tenantId, productIdOrSlug);
      await tx.product.update({
        where: { id: product.id },
        data: { status: 'ARCHIVED' },
      });
      return { success: true, id: product.id, slug: product.slug, status: 'ARCHIVED' };
    });
  }

  async adminGetProduct(tenantId: string, productId: string) {
    try {
      const isUuidOrMockId = UUID_REGEX.test(productId) || productId.startsWith('prod-');
      const product = await this.prisma.product.findFirst({
        where: isUuidOrMockId
          ? { id: productId, tenantId }
          : { slug: { in: this.expandSlugCandidates(productId) }, tenantId },
        include: {
          brand: true,
          category: true,
          vendor: true,
          media: { orderBy: { sortOrder: 'asc' } },
          variants: {
            orderBy: [{ sortOrder: 'asc' }, { sku: 'asc' }],
            include: { inventoryLevels: true },
          },
          claims: true,
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
      const fallback = DEMO_FALLBACK_PRODUCTS.find(
        (p) => p.id === productId || p.slug === productId,
      );
      if (fallback) return this.toPublicProduct(fallback);
      throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
    }
  }

  async adminListCategories(tenantId: string, storeSlug?: string) {
    try {
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { tenantId, slug: storeSlug },
          select: { id: true },
        });
        if (store) storeId = store.id;
      }

      return await this.prisma.category.findMany({
        where: {
          tenantId,
          ...(storeId ? { storeId } : {}),
        },
        orderBy: [{ sortOrder: 'asc' }, { titleFa: 'asc' }],
      });
    } catch {
      return [];
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
    const category = product.category
      ? {
          id: product.category.id,
          slug: product.category.slug,
          titleFa: product.category.titleFa,
        }
      : null;

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
          const hasInventoryRows =
            Array.isArray(variant.inventoryLevels) && variant.inventoryLevels.length > 0;
          const availableQty = hasInventoryRows
            ? variant.inventoryLevels.reduce(
                (sum: number, level: any) => sum + Math.max(0, level.onHandQty - level.reservedQty),
                0,
              )
            : Array.isArray(variant.inventoryLevels)
              ? 0
              : 20;

          const priceStr =
            typeof variant.priceAmount === 'string'
              ? variant.priceAmount
              : variant.priceAmount?.toFixed?.(0) ?? String(variant.priceAmount ?? '0');

          const originalPriceStr = variant.originalPriceAmount
            ? typeof variant.originalPriceAmount === 'string'
              ? variant.originalPriceAmount
              : variant.originalPriceAmount.toFixed?.(0) ?? String(variant.originalPriceAmount)
            : null;

          const variantActive = variant.status ? variant.status === 'ACTIVE' : true;
          const inStock = variantActive && (availableQty > 0 || variant.inStock === true);

          return {
            id: variant.id,
            sku: variant.sku,
            title: variant.titleFa ?? variant.title,
            titleFa: variant.titleFa ?? variant.title,
            sizeOrVolume: variant.sizeOrVolume ?? null,
            priceAmount: priceStr,
            originalPriceAmount: originalPriceStr,
            discountPercent: variant.discountPercent ?? null,
            currency: variant.currency ?? 'IRR',
            status: variant.status ?? 'ACTIVE',
            inStock,
            inventoryQty: availableQty,
            isRecommended: Boolean(variant.isRecommended),
            mediaRoleMatch: variant.mediaRoleMatch ?? null,
            digitalFileUrl: variant.digitalFileUrl ?? null,
          };
        })
      : [];

    return {
      id: product.id,
      slug: product.slug,
      title: product.titleFa ?? product.title,
      titleFa: product.titleFa ?? product.title,
      subtitleFa: product.subtitleFa ?? null,
      scientificName: product.scientificName ?? null,
      formulation: product.formulation ?? null,
      badge: product.badge ?? null,
      ratingValue: product.ratingValue ? Number(product.ratingValue) : null,
      reviewCount: product.reviewCount ?? 0,
      isFeatured: Boolean(product.isFeatured),
      isSpecialOffer: Boolean(product.isSpecialOffer),
      isNewest: Boolean(product.isNewest),
      coldChainRequired: Boolean(product.coldChainRequired),
      clinicalData: product.clinicalData ?? null,
      status: product.status ?? 'PUBLISHED',
      description: product.description ?? null,
      kind: product.kind ?? 'PHYSICAL',
      category,
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
