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
  if (slug === 'carboxygel-professional-therapy' || slug === 'carboxygel-advanced-system') {
    return {
      id: 'prod_skin_001',
      slug: 'carboxygel-professional-therapy',
      title: 'ژل کربوکسی تراپی تخصصی کلینیکال CarboxyGel Professional Therapy',
      description: 'سیستم کربوکسی تراپی غیرتهاجمی با تولید دی‌اکسید کربن فعال (Bohr Effect) جهت اکسیژن‌رسانی عمیق بافتی، تحریک فیبروبلاست‌ها و کلاژن‌سازی تخصصی در کلینیک.',
      variants: [
        {
          id: 'var_skin_001_single',
          sku: 'CBG-PRO-500ML',
          title: 'پک حرفه‌ای کلینیکال ۵۰۰ میلی‌لیتر',
          priceAmount: '48500000',
          currency: 'IRR',
          inStock: true,
        },
        {
          id: 'var_skin_001_home',
          sku: 'CBG-HOME-5X',
          title: 'کیت خانگی ۵ عددی',
          priceAmount: '19500000',
          currency: 'IRR',
          inStock: true,
        },
      ],
    };
  }

  if (slug === 'carboxypod-activation-pads') {
    return {
      id: 'prod_clinical_carboxypod',
      slug: 'carboxypod-activation-pads',
      title: 'پدهای فعال‌ساز فیبری CarboxyPod ری‌مد (بسته ۵ عددی)',
      description: 'پدهای فعال‌ساز CarboxyPod ری‌مد به‌طور اختصاصی برای ترکیب با ژل کربوکسی طراحی شده‌اند.',
      variants: [
        {
          id: 'var_cpd_box5',
          sku: 'RMD-CPD-005',
          title: 'بسته ۵ ساشه وکیوم (صورت و گردن)',
          priceAmount: '12500000',
          currency: 'IRR',
          inStock: true,
        },
      ],
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
  'everyday-backpack',
  'wireless-headphones',
  'desk-lamp',
  'ethiopian-specialty-coffee',
  'ceramic-dripper-v60',
  'artisan-mug',
  'digital-brew-guide',
  'latte-art-course',
  'carboxygel-professional-therapy',
  'carboxypod-activation-pads',
  'reeskin-gentle-hydrating-cleanser',
  'reemed-cellular-renewal-serum',
  'barrier-recovery-cream',
] as const;
