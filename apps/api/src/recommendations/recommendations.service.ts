import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { Prisma } from "../generated/prisma/client";
import { DEMO_FALLBACK_PRODUCTS } from "../catalog/demo-data";

// ── ADR-006: heuristic, three-channel recommendation engine ──
// Non-negotiables: ranking always happens server-side, DB-down answers come
// from the resilient demo dataset, and every response carries an auditable
// `source` (DB | FALLBACK). No PII is ever used — sessionId only.

export type RecommendationSource = "DB" | "FALLBACK";

export interface RecommendationItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: { slug: string; titleFa: string } | null;
  priceRials: string;
  priceTomans: string;
  inStock: boolean;
}

export interface RecommendationsResponse {
  source: RecommendationSource;
  items: RecommendationItem[];
}

interface DemoProduct {
  id: string;
  slug: string;
  title: string;
  titleFa: string;
  description: string;
  category: { slug: string; titleFa: string };
  variants: Array<{ priceAmount: string; inStock: boolean }>;
}

// Analytics events that reveal session interest (anonymous — never PII)
const INTEREST_EVENT_NAMES = ["product_viewed", "add_to_cart"] as const;

// Latest N interest events considered per session (ADR-006 for-you channel)
const MAX_INTEREST_EVENTS = 20;

const MIN_LIMIT = 1;
const MAX_LIMIT = 12;

// Clamp limits to 1..12; unparseable input falls back to the endpoint default
export function clampLimit(limitInput: number | undefined, fallback: number): number {
  if (limitInput === undefined || !Number.isFinite(limitInput)) return fallback;
  return Math.min(Math.max(Math.trunc(limitInput), MIN_LIMIT), MAX_LIMIT);
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    variants: { where: { status: "ACTIVE" }; include: { inventoryLevels: true } };
  };
}>;

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 1) Related: same-category products ranked by real sales (order_lines) ──
  async related(productId: string, limit?: number): Promise<RecommendationsResponse> {
    const effectiveLimit = clampLimit(limit, 6);

    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          variants: { where: { status: "ACTIVE" }, include: { inventoryLevels: true } },
        },
      });

      if (product && product.categoryId) {
        const siblings = await this.prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            status: "PUBLISHED",
            id: { not: product.id },
          },
          include: {
            category: true,
            variants: { where: { status: "ACTIVE" }, include: { inventoryLevels: true } },
          },
        });

        if (siblings.length > 0) {
          const salesByProduct = await this.fetchSalesByProduct(siblings.map((s) => s.id));
          // Zero real sales everywhere degrades naturally to publishedAt desc.
          const ranked = this.rankBySales(siblings, salesByProduct);
          return {
            source: "DB",
            items: ranked.slice(0, effectiveLimit).map((p) => this.formatDbProduct(p)),
          };
        }
      }
    } catch {
      // DB-down: resilient demo fallback below
    }

    // DB-down, product not found, product without category, or empty category
    return { source: "FALLBACK", items: this.relatedFromDemo(productId, effectiveLimit) };
  }

  // ── 2) Popular: global ranking by total sold quantity ──
  async popular(limit?: number): Promise<RecommendationsResponse> {
    const effectiveLimit = clampLimit(limit, 8);

    try {
      const published = await this.prisma.product.findMany({
        where: { status: "PUBLISHED" },
        include: {
          category: true,
          variants: { where: { status: "ACTIVE" }, include: { inventoryLevels: true } },
        },
      });

      if (published.length > 0) {
        const salesByProduct = await this.fetchSalesByProduct(published.map((p) => p.id));
        const ranked = this.rankBySales(published, salesByProduct);
        return {
          source: "DB",
          items: ranked.slice(0, effectiveLimit).map((p) => this.formatDbProduct(p)),
        };
      }
    } catch {
      // DB-down: resilient demo fallback below
    }

    // Curated demo order — DEMO_FALLBACK_PRODUCTS kept as-is
    return {
      source: "FALLBACK",
      items: (DEMO_FALLBACK_PRODUCTS as DemoProduct[])
        .slice(0, effectiveLimit)
        .map((p) => this.formatDemoProduct(p)),
    };
  }

  // ── 3) For-you: session interest events → top products of interested categories ──
  async forYou(sessionIdInput: string | undefined, limit?: number): Promise<RecommendationsResponse> {
    const effectiveLimit = clampLimit(limit, 6);
    // sessionId only — the single allowed signal, never any PII (ADR-006)
    const sessionId = (sessionIdInput ?? "").trim().slice(0, 64);

    try {
      const personalized = await this.tryPersonalized(sessionId, effectiveLimit);
      if (personalized) {
        return personalized;
      }
      // No session signal (or nothing usable) → degrade to popular, still from DB
    } catch {
      // DB-down: resilient demo fallback below
    }

    return this.popular(effectiveLimit);
  }

  private async tryPersonalized(
    sessionId: string,
    limit: number
  ): Promise<RecommendationsResponse | null> {
    let viewedSlugs: string[] = [];

    if (sessionId) {
      const events = await this.prisma.analyticsEvent.findMany({
        where: {
          sessionId,
          name: { in: [...INTEREST_EVENT_NAMES] },
        },
        orderBy: { createdAt: "desc" },
        take: MAX_INTEREST_EVENTS,
        select: { propsJson: true },
      });

      viewedSlugs = this.extractInterestSlugs(events.map((e) => e.propsJson));
    }

    if (viewedSlugs.length === 0) {
      return null;
    }

    const viewedProducts = await this.prisma.product.findMany({
      where: { slug: { in: viewedSlugs }, status: "PUBLISHED" },
      include: {
        category: true,
        variants: { where: { status: "ACTIVE" }, include: { inventoryLevels: true } },
      },
    });

    const categoryIds = [
      ...new Set(
        viewedProducts
          .map((p) => p.categoryId)
          .filter((id): id is string => id !== null)
      ),
    ];

    if (categoryIds.length === 0) {
      return null;
    }

    // Exclude the products the session already saw — recommend what's new to them
    const viewedIds = [...viewedProducts.map((p) => p.id)];

    const candidates = await this.prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: "PUBLISHED",
        id: { notIn: viewedIds },
      },
      include: {
        category: true,
        variants: { where: { status: "ACTIVE" }, include: { inventoryLevels: true } },
      },
    });

    if (candidates.length === 0) {
      return null;
    }

    const salesByProduct = await this.fetchSalesByProduct(candidates.map((c) => c.id));
    const ranked = this.rankBySales(candidates, salesByProduct);
    return { source: "DB", items: ranked.slice(0, limit).map((p) => this.formatDbProduct(p)) };
  }

  // ── Shared helpers ──

  // Real-sales aggregation: SUM(order_lines.qty) per product via its variants
  private async fetchSalesByProduct(productIds: string[]): Promise<Map<string, number>> {
    if (productIds.length === 0) return new Map();

    const lines = await this.prisma.orderLine.findMany({
      where: { variant: { productId: { in: productIds } } },
      select: { qty: true, variant: { select: { productId: true } } },
    });

    const salesByProduct = new Map<string, number>();
    for (const line of lines) {
      salesByProduct.set(
        line.variant.productId,
        (salesByProduct.get(line.variant.productId) ?? 0) + line.qty
      );
    }
    return salesByProduct;
  }

  // Sales desc, then publishedAt desc — the zero-sales case is pure recency (ADR-006)
  private rankBySales(
    products: ProductWithRelations[],
    salesByProduct: Map<string, number>
  ): ProductWithRelations[] {
    const salesOf = (p: ProductWithRelations) => salesByProduct.get(p.id) ?? 0;
    const publishedMsOf = (p: ProductWithRelations) => p.publishedAt?.getTime() ?? 0;

    return [...products].sort(
      (a, b) => salesOf(b) - salesOf(a) || publishedMsOf(b) - publishedMsOf(a)
    );
  }

  // Mirror of search.service formatting: BigInt price math, Rials + Tomans
  private formatDbProduct(p: ProductWithRelations): RecommendationItem {
    const primaryVariant = p.variants[0];
    const availableQty = primaryVariant
      ? primaryVariant.inventoryLevels.reduce(
          (sum, level) => sum + Math.max(0, level.onHandQty - level.reservedQty),
          0
        )
      : 0;
    const price = primaryVariant ? BigInt(primaryVariant.priceAmount.toString()) : 0n;

    return {
      id: p.id,
      slug: p.slug,
      title: p.titleFa,
      description: p.description,
      category: p.category ? { slug: p.category.slug, titleFa: p.category.titleFa } : null,
      priceRials: price.toString(),
      priceTomans: (price / 10n).toString(),
      inStock: availableQty > 0,
    };
  }

  private formatDemoProduct(p: DemoProduct): RecommendationItem {
    const variant = p.variants[0];
    const price = BigInt(variant.priceAmount);

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: { slug: p.category.slug, titleFa: p.category.titleFa },
      priceRials: price.toString(),
      priceTomans: (price / 10n).toString(),
      inStock: variant.inStock,
    };
  }

  // Demo fallback for related: anchor by demo id ("prod_001"), else by array index
  private relatedFromDemo(productId: string, limit: number): RecommendationItem[] {
    const demoProducts = DEMO_FALLBACK_PRODUCTS as DemoProduct[];

    let anchorIndex = demoProducts.findIndex((p) => p.id === productId);
    if (anchorIndex < 0) {
      const asIndex = Number.parseInt(productId, 10);
      anchorIndex = Number.isNaN(asIndex)
        ? 0
        : Math.min(Math.max(asIndex, 0), demoProducts.length - 1);
    }

    const anchor = demoProducts[anchorIndex];

    return demoProducts
      .filter((p) => p.id !== anchor.id && p.category.slug === anchor.category.slug)
      .slice(0, limit)
      .map((p) => this.formatDemoProduct(p));
  }

  // PII firewall: only the anonymous `slug` key is ever read from event props
  private extractInterestSlugs(propsList: (Prisma.JsonValue | null)[]): string[] {
    const slugs: string[] = [];

    for (const props of propsList) {
      if (props !== null && typeof props === "object" && !Array.isArray(props)) {
        const slug = (props as Record<string, unknown>).slug;
        if (typeof slug === "string" && slug.trim().length > 0 && !slugs.includes(slug)) {
          slugs.push(slug);
        }
      }
    }

    return slugs;
  }
}
