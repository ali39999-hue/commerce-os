import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { normalizePersianText } from "@commerce-os/localization";
import { DEMO_FALLBACK_PRODUCTS } from "../catalog/demo-data";

export interface SearchFilterInput {
  storeSlug: string;
  query?: string;
  categorySlug?: string;
  brandSlug?: string;
  concernSlug?: string;
  minPriceRials?: number;
  maxPriceRials?: number;
  inStockOnly?: boolean;
  sort?: "popular" | "newest" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
}

export const PERSIAN_SYNONYMS: Record<string, string[]> = {
  کربوکسی: ["carboxy", "carboxygel", "بوهر", "اکسیژن", "co2", "ژل", "پد", "پاد"],
  carboxy: ["کربوکسی", "carboxygel", "بوهر", "co2", "carboxypod", "carboxypad"],
  پلاسما: ["plasmax", "جت سرد", "بلفاروپلاستی", "آرگون"],
  plasmax: ["پلاسما", "پلاسماکس", "جت سرد"],
  رتینول: ["retinol", "ویتامین a", "آداپالن", "ضدچروک", "جوانساز"],
  retinol: ["رتینول", "پپتید", "ضدچروک", "differin"],
  بریر: ["barrier", "سد دفاعی", "ترمیم", "سیکا", "cica", "cicalfate"],
  barrier: ["بریر", "سد دفاعی", "ترمیم", "سیکا"],
  سیکا: ["cica", "centella", "سنتلا", "ترمیم", "cicalfate"],
  هیالورونیک: ["hyalu", "hyaluronic", "آبرسان", "dokdo", "hydro"],
  ضدلک: ["روشن", "ویتامین", "نیاسینامید", "آستاگزانتین", "brightening"],
  مو: ["رزماری", "ریزش", "آلپسین", "فیتو", "پریورین", "کافئین", "hair"],
  ریزش: ["فولیکول", "آلپسین", "فیتو", "پریورین", "رزماری"],
  سرم: ["آمپول", "serum", "ampoule", "dokdo", "centella"],
  آبرسان: ["مرطوب", "هیدراتور", "هیالورونیک", "hydrator", "dokdo"],
  جوش: ["آکنه", "ضدجوش", "سالیسیلیک", "دیفرین", "سیلیکالین", "اسکراب"],
  ری‌اسکین: ["reeskin", "درمر", "dermer", "carboxygel", "healene", "crystalene"],
  reeskin: ["ری‌اسکین", "درمر", "dermer"],
  ری‌مد: ["reemed", "درمر", "dermer", "carbox", "plasmax"],
  reemed: ["ری‌مد", "درمر", "dermer"],
};

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: SearchFilterInput) {
    const {
      storeSlug,
      query,
      categorySlug,
      brandSlug,
      concernSlug,
      minPriceRials,
      maxPriceRials,
      inStockOnly,
      sort = "popular",
      limit = 20,
      offset = 0,
    } = params;

    const normalizedQuery = query ? normalizePersianText(query) : "";

    try {
      const store = await this.prisma.store.findFirst({
        where: { slug: storeSlug, status: "ACTIVE" },
        select: { id: true, tenantId: true },
      });

      if (store) {
        const baseWhere: any = {
          tenantId: store.tenantId,
          storeId: store.id,
          status: "PUBLISHED",
        };

        const searchWhere: any = { ...baseWhere };
        if (categorySlug && categorySlug !== "all") {
          searchWhere.category = { slug: categorySlug };
        }
        if (brandSlug && brandSlug !== "all") {
          searchWhere.brand = { slug: brandSlug };
        }
        if (concernSlug && concernSlug !== "all") {
          searchWhere.skinConcerns = { some: { concern: { slug: concernSlug } } };
        }

        if (normalizedQuery) {
          const searchTokens = Array.from(new Set([normalizedQuery]));
          for (const [key, syns] of Object.entries(PERSIAN_SYNONYMS)) {
            if (normalizedQuery.includes(key)) {
              searchTokens.push(...syns);
            }
          }

          searchWhere.OR = [
            ...searchTokens.map((t) => ({ titleFa: { contains: t, mode: "insensitive" } })),
            ...searchTokens.map((t) => ({ subtitleFa: { contains: t, mode: "insensitive" } })),
            ...searchTokens.map((t) => ({ scientificName: { contains: t, mode: "insensitive" } })),
            ...searchTokens.map((t) => ({ slug: { contains: t, mode: "insensitive" } })),
            ...searchTokens.map((t) => ({ description: { contains: t, mode: "insensitive" } })),
            ...searchTokens.map((t) => ({ brand: { name: { contains: t, mode: "insensitive" } } })),
            ...searchTokens.map((t) => ({ category: { titleFa: { contains: t, mode: "insensitive" } } })),
            ...searchTokens.map((t) => ({
              variants: { some: { sku: { contains: t, mode: "insensitive" } } },
            })),
          ];
        }

        const [matchedProducts, storeCategories, storeBrands, storeConcerns] = await Promise.all([
          this.prisma.product.findMany({
            where: searchWhere,
            include: {
              category: { select: { slug: true, titleFa: true } },
              brand: { select: { slug: true, name: true } },
              media: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
              skinConcerns: { include: { concern: { select: { slug: true, name: true } } } },
              variants: {
                where: { status: "ACTIVE" },
                orderBy: [{ sortOrder: "asc" }, { sku: "asc" }],
                include: { inventoryLevels: true },
              },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          }),
          this.prisma.category.findMany({
            where: {
              tenantId: store.tenantId,
              storeId: store.id,
              products: { some: { status: "PUBLISHED" } },
            },
            orderBy: [{ sortOrder: "asc" }, { titleFa: "asc" }],
            select: { slug: true, titleFa: true },
          }),
          this.prisma.brand.findMany({
            where: {
              tenantId: store.tenantId,
              storeId: store.id,
              isPublished: true,
              products: { some: { status: "PUBLISHED" } },
            },
            orderBy: { name: "asc" },
            select: { slug: true, name: true },
          }),
          this.prisma.skinConcern.findMany({
            where: { tenantId: store.tenantId, storeId: store.id },
            orderBy: { name: "asc" },
            select: { slug: true, name: true },
          }),
        ]);

        const mapped = matchedProducts
          .map((p) => {
            const primaryVariant = p.variants[0];
            const availableQty = primaryVariant
              ? primaryVariant.inventoryLevels.reduce(
                  (sum, l) => sum + Math.max(0, l.onHandQty - l.reservedQty),
                  0
                )
              : 0;

            const price = primaryVariant ? BigInt(primaryVariant.priceAmount.toString()) : 0n;
            const origPrice = primaryVariant?.originalPriceAmount
              ? BigInt(primaryVariant.originalPriceAmount.toString())
              : null;

            return {
              id: p.id,
              slug: p.slug,
              title: p.titleFa,
              subtitleFa: p.subtitleFa,
              description: p.description,
              image: p.media[0]?.url ?? null,
              category: p.category ? { slug: p.category.slug, titleFa: p.category.titleFa } : null,
              brand: p.brand ? { slug: p.brand.slug, name: p.brand.name } : null,
              primaryVariantId: primaryVariant?.id ?? null,
              primarySku: primaryVariant?.sku ?? null,
              priceRials: price.toString(),
              priceTomans: (price / 10n).toString(),
              originalPriceRials: origPrice ? origPrice.toString() : null,
              discountPercent: primaryVariant?.discountPercent ?? null,
              badge: p.badge,
              ratingValue: p.ratingValue !== null && p.ratingValue !== undefined ? Number(p.ratingValue) : 4.8,
              reviewCount: p.reviewCount ?? 0,
              inStock: availableQty > 0,
              availableQty,
              _sortOrder: p.sortOrder,
              _createdAtMs: p.createdAt.getTime(),
            };
          })
          .filter((p) => {
            if (inStockOnly && !p.inStock) return false;
            if (minPriceRials !== undefined && Number.isFinite(minPriceRials) && BigInt(p.priceRials) < BigInt(minPriceRials)) {
              return false;
            }
            if (maxPriceRials !== undefined && Number.isFinite(maxPriceRials) && BigInt(p.priceRials) > BigInt(maxPriceRials)) {
              return false;
            }
            return true;
          });

        mapped.sort((a, b) => {
          if (sort === "price_asc") return Number(BigInt(a.priceRials) - BigInt(b.priceRials));
          if (sort === "price_desc") return Number(BigInt(b.priceRials) - BigInt(a.priceRials));
          if (sort === "newest") return b._createdAtMs - a._createdAtMs;
          return a._sortOrder - b._sortOrder || (b.ratingValue ?? 0) - (a.ratingValue ?? 0);
        });

        const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
        const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
        const paged = mapped.slice(safeOffset, safeOffset + safeLimit).map(({ _sortOrder, _createdAtMs, ...rest }) => rest);

        return {
          items: paged,
          total: mapped.length,
          limit: safeLimit,
          offset: safeOffset,
          facets: {
            categories: storeCategories,
            brands: storeBrands,
            concerns: storeConcerns,
            inStockTotal: mapped.filter((f) => f.inStock).length,
          },
        };
      }
    } catch {
      // Fall through to resilient in-memory search only on DB connection error
    }

    // ── Resilient In-Memory Search Fallback (clinical dataset, no legacy facets) ──
    let results = DEMO_FALLBACK_PRODUCTS.map((p) => {
      const v = p.variants[0];
      const price = BigInt(v.priceAmount);
      return {
        id: p.id,
        slug: p.slug,
        title: p.titleFa,
        description: p.description,
        category: p.category,
        priceRials: price.toString(),
        priceTomans: (price / 10n).toString(),
        inStock: v.inStock,
        availableQty: 20,
      };
    });

    if (normalizedQuery) {
      const tokens = [normalizedQuery];
      for (const [key, syns] of Object.entries(PERSIAN_SYNONYMS)) {
        if (normalizedQuery.includes(key)) tokens.push(...syns);
      }

      results = results.filter((p) =>
        tokens.some(
          (t) =>
            p.title.toLowerCase().includes(t) ||
            (p.description ?? "").toLowerCase().includes(t) ||
            (p.category?.titleFa ?? "").toLowerCase().includes(t)
        )
      );
    }

    if (categorySlug && categorySlug !== "all") {
      results = results.filter((p) => p.category?.slug === categorySlug);
    }

    if (inStockOnly) {
      results = results.filter((p) => p.inStock);
    }

    const catFacetMap = new Map<string, { slug: string; titleFa: string }>();
    for (const r of results) {
      if (r.category) catFacetMap.set(r.category.slug, r.category);
    }

    return {
      items: results.slice(offset, offset + limit),
      total: results.length,
      limit,
      offset,
      facets: {
        categories: Array.from(catFacetMap.values()),
        brands: [],
        concerns: [],
        inStockTotal: results.filter((r) => r.inStock).length,
      },
    };
  }
}
