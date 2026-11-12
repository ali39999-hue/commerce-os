import { PrismaService } from "../database/prisma.service";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LEGACY_SLUG_ALIASES: Record<string, string> = {
  "carboxygel-professional-therapy": "carboxygel",
  "carboxypod-activation-pads": "carboxypod",
  "carbox-station": "carbox",
  "plasmax-pro": "plasmax",
  "bath-and-body-works-perfect-in-pink": "perfect-in-pink",
};

export interface VariantLookupInput {
  variantId: string;
  sku?: string;
}

export interface ResolvedStoreVariant {
  id: string;
  productId: string;
  productSlug: string;
  titleFa: string;
  sku: string;
  priceAmount: bigint;
  currency: string;
}

/**
 * Extracts normalized product slug candidates from legacy client-side IDs
 * such as `var-prod_shop_perfect_in_pink` or `SKU-PROD_SHOP_PERFECT_IN_PINK`.
 */
export function extractLegacySlugCandidates(raw?: string | null): string[] {
  if (!raw || UUID_REGEX.test(raw)) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const stripped = trimmed
    .replace(/^(sku-|var-)/i, "")
    .replace(/^prod_(shop_)?/i, "")
    .replace(/_/g, "-")
    .toLowerCase();

  if (!stripped || stripped.length < 2) return [];
  const candidates = new Set<string>([stripped]);
  const aliased = LEGACY_SLUG_ALIASES[stripped];
  if (aliased) candidates.add(aliased);
  return Array.from(candidates);
}

/**
 * Resolves store variants from UUIDs, SKUs, or legacy synthetic shop IDs without
 * ever passing non-UUID values to PostgreSQL's UUID column filter.
 */
export async function resolveStoreVariants(
  prisma: PrismaService,
  storeId: string,
  items: VariantLookupInput[],
): Promise<Map<string, ResolvedStoreVariant>> {
  const uuidIds = new Set<string>();
  const skus = new Set<string>();
  const slugCandidates = new Set<string>();

  for (const item of items) {
    if (item.variantId && UUID_REGEX.test(item.variantId)) {
      uuidIds.add(item.variantId);
    } else if (item.variantId) {
      for (const slug of extractLegacySlugCandidates(item.variantId)) {
        slugCandidates.add(slug);
      }
      if (!item.variantId.toLowerCase().startsWith("var-prod")) {
        skus.add(item.variantId.trim());
      }
    }
    if (item.sku) {
      skus.add(item.sku.trim());
      for (const slug of extractLegacySlugCandidates(item.sku)) {
        slugCandidates.add(slug);
      }
    }
  }

  const orClauses: any[] = [];
  if (uuidIds.size > 0) orClauses.push({ id: { in: Array.from(uuidIds) } });
  if (skus.size > 0) orClauses.push({ sku: { in: Array.from(skus) } });
  if (slugCandidates.size > 0) {
    orClauses.push({
      product: {
        slug: { in: Array.from(slugCandidates) },
        status: "PUBLISHED",
      },
    });
  }

  const result = new Map<string, ResolvedStoreVariant>();
  if (orClauses.length === 0) return result;

  const dbVariants = await prisma.productVariant.findMany({
    where: {
      storeId,
      status: "ACTIVE",
      OR: orClauses,
    },
    include: {
      product: { select: { slug: true, titleFa: true } },
    },
    orderBy: [{ isRecommended: "desc" }, { sortOrder: "asc" }],
  });

  const byId = new Map<string, ResolvedStoreVariant>();
  const bySku = new Map<string, ResolvedStoreVariant>();
  const bySlug = new Map<string, ResolvedStoreVariant>();

  for (const v of dbVariants) {
    const resolved: ResolvedStoreVariant = {
      id: v.id,
      productId: v.productId,
      productSlug: v.product?.slug ?? "",
      titleFa: v.product?.titleFa
        ? `${v.product.titleFa}${v.titleFa && v.titleFa !== v.product.titleFa ? ` - ${v.titleFa}` : ""}`
        : v.titleFa,
      sku: v.sku,
      priceAmount: BigInt(v.priceAmount.toString()),
      currency: v.currency,
    };
    byId.set(resolved.id, resolved);
    if (resolved.sku) bySku.set(resolved.sku.toUpperCase(), resolved);
    if (resolved.productSlug && !bySlug.has(resolved.productSlug.toLowerCase())) {
      bySlug.set(resolved.productSlug.toLowerCase(), resolved);
    }
  }

  for (const item of items) {
    let matched = byId.get(item.variantId);
    if (!matched && item.sku) {
      matched = bySku.get(item.sku.trim().toUpperCase());
    }
    if (!matched) {
      const slugs = [
        ...extractLegacySlugCandidates(item.variantId),
        ...extractLegacySlugCandidates(item.sku),
      ];
      for (const s of slugs) {
        matched = bySlug.get(s);
        if (matched) break;
      }
    }
    if (matched) {
      result.set(item.variantId, matched);
      result.set(matched.id, matched);
    }
  }

  return result;
}
