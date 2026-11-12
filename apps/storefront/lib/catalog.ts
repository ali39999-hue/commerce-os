import {
  formatCurrencyAmount,
  formatRialsAsTomans,
  toAsciiDigits,
} from '@commerce-os/localization';

export type ProductVariantDto = {
  id: string;
  sku: string;
  title: string;
  titleFa?: string;
  sizeOrVolume?: string | null;
  priceAmount: string;
  originalPriceAmount?: string | null;
  discountPercent?: number | null;
  currency: string;
  status?: string;
  inStock: boolean;
  inventoryQty?: number;
  isRecommended?: boolean;
  mediaRoleMatch?: string | null;
  digitalFileUrl?: string | null;
};

export type CategoryDto = {
  id: string;
  slug: string;
  titleFa: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  productCount?: number;
};

export type BrandDto = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  originCountry?: string | null;
};

export type SkinConcernDto = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
};

export type ProductMediaDto = {
  id?: string;
  role: string;
  sortOrder?: number;
  altText?: string | null;
  url: string;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  isPrimary?: boolean;
  variantId?: string | null;
};

export type ProductIngredientDto = {
  id?: string;
  name: string;
  inciName?: string | null;
  concentrationPercent?: string | null;
  purpose?: string | null;
  isKeyIngredient?: boolean;
  description?: string | null;
  sortOrder?: number;
};

export type ProductClaimDto = {
  id?: string;
  claimText: string;
  evidenceSummary?: string | null;
  studyReference?: string | null;
  approvedBy?: string | null;
  status?: string;
};

export type ProductUsageStepDto = {
  id?: string;
  stepNumber: number;
  title: string;
  instruction: string;
  iconOrImageUrl?: string | null;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  titleFa?: string;
  subtitleFa?: string | null;
  scientificName?: string | null;
  formulation?: string | null;
  badge?: string | null;
  ratingValue?: number | null;
  reviewCount?: number | null;
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  isNewest?: boolean;
  coldChainRequired?: boolean;
  clinicalData?: Record<string, any> | null;
  status?: string;
  description: string | null;
  kind?: string;
  category?: { id: string; slug: string; titleFa: string } | null;
  vendor?: { slug: string; titleFa: string } | null;
  brand?: BrandDto | null;
  media?: ProductMediaDto[];
  ingredients?: ProductIngredientDto[];
  claims?: ProductClaimDto[];
  usageSteps?: ProductUsageStepDto[];
  skinConcerns?: SkinConcernDto[];
  variants: ProductVariantDto[];
};

export type QuoteDto = {
  id: string;
  subtotal: { amount: string; formatted: string };
  totalDiscount: { amount: string; formatted: string };
  discounts: Array<{ title: string; amount: { formatted: string } }>;
  vat: { amount: string; formatted: string };
  shipping: { amount: string; formatted: string };
  total: { amount: string; formatted: string };
  fingerprint: string;
  lines: Array<{
    variantId: string;
    title: string;
    qty: number;
    unitPrice: { formatted: string };
    total: { formatted: string };
  }>;
};

export type ListProductsOptions = {
  limit?: number;
  category?: string;
  brand?: string;
  collection?: 'featured' | 'special-offers' | 'newest';
};

export type SearchItemDto = {
  id: string;
  slug: string;
  title: string;
  subtitleFa?: string | null;
  description: string | null;
  image?: string | null;
  category: { slug: string; titleFa: string } | null;
  brand?: { slug: string; name: string } | null;
  primaryVariantId?: string | null;
  primarySku?: string | null;
  priceRials: string;
  priceTomans: string;
  originalPriceRials?: string | null;
  discountPercent?: number | null;
  badge?: string | null;
  ratingValue?: number;
  reviewCount?: number;
  inStock: boolean;
  availableQty: number;
};

export type SearchResponseDto = {
  items: SearchItemDto[];
  total: number;
  limit: number;
  offset: number;
  facets?: {
    categories: Array<{ slug: string; titleFa: string }>;
    brands?: Array<{ slug: string; name: string }>;
    concerns?: Array<{ slug: string; name: string }>;
    inStockTotal: number;
  };
};

type ProductListResponse = { data: Product[]; meta: { count: number; limit: number } };
type ProductResponse = { data: Product };

import {
  isBackendFailureStatus,
  normalizeNetworkError,
  parseApiErrorPayload,
  reportBackendError,
} from './backend-error';

export const apiBase = (
  (typeof window === 'undefined' ? process.env.STOREFRONT_API_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.STOREFRONT_API_URL ??
  'http://localhost:4000'
).replace(/\/$/, '');

export const storeSlug =
  process.env.NEXT_PUBLIC_STORE_SLUG ?? process.env.STORE_SLUG ?? 'demo';

async function fetchBackendJson<T>(
  url: string,
  options?: { allowNotFound?: boolean; acceptNonOkClientStatus?: boolean },
): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    const backendErr = normalizeNetworkError(err, url);
    reportBackendError(backendErr);
    throw backendErr;
  }

  if (options?.allowNotFound && response.status === 404) {
    return null;
  }

  if (isBackendFailureStatus(response.status)) {
    const backendErr = await parseApiErrorPayload(response, url);
    reportBackendError(backendErr);
    throw backendErr;
  }

  if (!response.ok) {
    if (options?.acceptNonOkClientStatus) {
      return null;
    }
    return null;
  }

  return (await response.json()) as T;
}

export async function listProducts(opts?: ListProductsOptions): Promise<ProductListResponse | null> {
  const params = new URLSearchParams();
  params.set('limit', String(opts?.limit ?? 100));
  if (opts?.category) params.set('category', opts.category);
  if (opts?.brand) params.set('brand', opts.brand);
  if (opts?.collection) params.set('collection', opts.collection);
  const qs = params.toString();
  const url = `${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/products${qs ? `?${qs}` : ''}`;
  return fetchBackendJson<ProductListResponse>(url, { acceptNonOkClientStatus: true });
}

export async function getProduct(slug: string): Promise<Product | null> {
  const url = `${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/products/${encodeURIComponent(slug)}`;
  const payload = await fetchBackendJson<ProductResponse>(url, {
    allowNotFound: true,
    acceptNonOkClientStatus: true,
  });
  return payload?.data ?? null;
}

export async function listCategories(): Promise<CategoryDto[]> {
  const url = `${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/categories`;
  const payload = await fetchBackendJson<{ data?: CategoryDto[] }>(url, {
    acceptNonOkClientStatus: true,
  });
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function listBrands(): Promise<BrandDto[]> {
  const url = `${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/brands`;
  const payload = await fetchBackendJson<{ data?: BrandDto[] }>(url, {
    acceptNonOkClientStatus: true,
  });
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function listConcerns(): Promise<SkinConcernDto[]> {
  const url = `${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/concerns`;
  const payload = await fetchBackendJson<{ data?: SkinConcernDto[] }>(url, {
    acceptNonOkClientStatus: true,
  });
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function searchCatalog(params: {
  q?: string;
  category?: string;
  brand?: string;
  concern?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
  limit?: number;
  offset?: number;
}): Promise<SearchResponseDto | null> {
  const qs = new URLSearchParams();
  qs.set('storeSlug', storeSlug);
  if (params.q) qs.set('q', params.q);
  if (params.category && params.category !== 'all') qs.set('category', params.category);
  if (params.brand && params.brand !== 'all') qs.set('brand', params.brand);
  if (params.concern && params.concern !== 'all') qs.set('concern', params.concern);
  if (typeof params.minPrice === 'number') qs.set('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') qs.set('maxPrice', String(params.maxPrice));
  if (params.inStock) qs.set('inStock', 'true');
  if (params.sort) qs.set('sort', params.sort);
  if (typeof params.limit === 'number') qs.set('limit', String(params.limit));
  if (typeof params.offset === 'number') qs.set('offset', String(params.offset));
  const url = `${apiBase}/v1/search?${qs.toString()}`;
  return fetchBackendJson<SearchResponseDto>(url, { acceptNonOkClientStatus: true });
}

export function resolveProductImage(
  product?: Pick<Product, 'media' | 'clinicalData'> | null,
  fallback = '/assets/rupak/products/prod-01.webp',
): string {
  const media = product?.media ?? [];
  const primary = media.find((m) => m.isPrimary) ?? media.find((m) => m.role === 'HERO') ?? media[0];
  if (primary?.url) return primary.url;
  const clinicalImage = product?.clinicalData?.image;
  if (typeof clinicalImage === 'string' && clinicalImage.length > 0) return clinicalImage;
  return fallback;
}

export function resolveVariant(
  product?: Pick<Product, 'variants'> | null,
  preferredSkus?: string[],
): ProductVariantDto | null {
  const variants = product?.variants ?? [];
  if (variants.length === 0) return null;
  if (preferredSkus && preferredSkus.length > 0) {
    const upperSet = new Set(preferredSkus.map((s) => s.toUpperCase()));
    const skuMatch = variants.find((v) => upperSet.has(v.sku.toUpperCase()));
    if (skuMatch) return skuMatch;
  }
  return variants.find((v) => v.isRecommended) ?? variants.find((v) => v.inStock) ?? variants[0];
}

export function formatPrice(amount: string | number | bigint, currency = 'IRR'): string {
  try {
    const raw = typeof amount === 'bigint' ? amount : BigInt(toAsciiDigits(String(amount)).replace(/\..*$/, '') || '0');
    return formatCurrencyAmount(raw, currency, { locale: 'fa-IR' });
  } catch {
    return 'قیمت نامعتبر';
  }
}

export function formatToman(amountRials: string | number | bigint): string {
  try {
    return formatRialsAsTomans(amountRials, 'fa-IR');
  } catch {
    return 'مبلغ نامعتبر';
  }
}
