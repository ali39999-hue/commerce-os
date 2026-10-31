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
    if (!response.ok) return null;
    const payload = (await response.json()) as ProductResponse;
    return payload.data;
  } catch {
    return null;
  }
}

export function formatPrice(amount: string | number | bigint, currency = 'IRR'): string {
  try {
    const wholeUnits = BigInt(amount);
    const formatted = new Intl.NumberFormat('fa-IR').format(wholeUnits);
    return currency === 'IRR' ? `${formatted} ریال` : `${formatted} ${currency}`;
  } catch {
    return 'قیمت نامعتبر';
  }
}

export function formatToman(amountRials: string | number | bigint): string {
  try {
    const rials = BigInt(amountRials);
    const tomans = rials / 10n;
    return `${new Intl.NumberFormat('fa-IR').format(tomans)} تومان`;
  } catch {
    return 'مبلغ نامعتبر';
  }
}

/**
 * شناسه‌های نمایشی محصولات دموی ویترین؛ برای sitemap و صفحات استاتیک استفاده می‌شود.
 */
export const DEMO_PRODUCT_SLUGS = ['everyday-backpack','wireless-headphones','desk-lamp','ethiopian-specialty-coffee','ceramic-dripper-v60','artisan-mug','digital-brew-guide','latte-art-course'] as const;
