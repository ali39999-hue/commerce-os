import {
  formatCurrencyAmount,
  formatRialsAsTomans,
  toAsciiDigits,
} from '@commerce-os/localization';

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  variants: Array<{
    id: string;
    sku: string;
    title: string;
    priceAmount: string;
    currency: string;
    inStock: boolean;
  }>;
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

type ProductListResponse = { data: Product[]; meta: { count: number; limit: number } };
type ProductResponse = { data: Product };

export const apiBase = (process.env.STOREFRONT_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');
export const storeSlug = process.env.STORE_SLUG ?? 'demo';

export async function listProducts(): Promise<ProductListResponse | null> {
  try {
    const response = await fetch(`${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/products`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return null;
    return (await response.json()) as ProductListResponse;
  } catch {
    return null;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${apiBase}/v1/stores/${encodeURIComponent(storeSlug)}/products/${encodeURIComponent(slug)}`,
      { cache: 'no-store', headers: { accept: 'application/json' }, signal: AbortSignal.timeout(3500) },
    );
    if (response.ok) {
      const payload = (await response.json()) as ProductResponse;
      if (payload.data) return payload.data;
    }
  } catch {
    // ignore network timeout and check local clinical/demo items
  }

  // Local fallback if API is not running or doesn't have the slug yet
  const { CLINICAL_SKINCARE_PRODUCTS } = require('./pdp-data');
  const clinicalItem = CLINICAL_SKINCARE_PRODUCTS[slug];
  if (clinicalItem) {
    return {
      id: clinicalItem.id,
      slug: clinicalItem.slug,
      title: clinicalItem.title,
      description: clinicalItem.description,
      variants: clinicalItem.variants.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        priceAmount: v.priceAmount,
        currency: v.currency,
        inStock: v.inStock,
      })),
    };
  }

  return null;
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

/**
 * شناسه‌های نمایشی محصولات دموی ویترین؛ برای sitemap و صفحات استاتیک استفاده می‌شود.
 */
export const DEMO_PRODUCT_SLUGS = [
  'carboxygel',
  'carboxypod',
  'carboxypad',
  'crystalene',
  'healene',
  'silicalene',
  'carbox',
  'plasmax',
  'carbox-station',
  'plasmax-pro',
] as const;
