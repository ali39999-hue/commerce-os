'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiBase, listProducts, type Product } from '../../lib/catalog';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { WishlistButton } from './wishlist-button';
import { CompareButton } from './compare-button';

export interface RailItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: { slug: string; titleFa: string } | null;
  priceRials: string;
  priceTomans: string;
  inStock: boolean;
  availableQty: number | null;
  sku: string | null;
  variantId: string | null;
}

const RAIL_SKELETON_COUNT = 6;
const RAIL_FETCH_TIMEOUT_MS = 3500;

function toRialsString(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) return String(Math.round(value));
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed !== '' && Number.isFinite(Number(trimmed))) return String(Math.round(Number(trimmed)));
  }
  return '0';
}

function rialsToTomansString(rials: string): string {
  try {
    return (BigInt(rials) / 10n).toString();
  } catch {
    return '0';
  }
}

function normalizeRailItem(entry: unknown): RailItem {
  const raw = (entry ?? {}) as Record<string, unknown>;
  const categoryRaw = (raw.category ?? null) as Record<string, unknown> | null;
  const priceRials = toRialsString(raw.priceRials);
  return {
    id: typeof raw.id === 'string' ? raw.id : '',
    slug: typeof raw.slug === 'string' ? raw.slug : '',
    title: typeof raw.title === 'string' ? raw.title : '',
    description: typeof raw.description === 'string' ? raw.description : null,
    category:
      categoryRaw && typeof categoryRaw === 'object'
        ? {
            slug: typeof categoryRaw.slug === 'string' ? categoryRaw.slug : '',
            titleFa: typeof categoryRaw.titleFa === 'string' ? categoryRaw.titleFa : '',
          }
        : null,
    priceRials,
    priceTomans: toRialsString(raw.priceTomans),
    inStock: raw.inStock === true,
    availableQty: typeof raw.availableQty === 'number' ? raw.availableQty : null,
    sku: typeof raw.sku === 'string' ? raw.sku : null,
    variantId: typeof raw.variantId === 'string' ? raw.variantId : null,
  };
}

function productToRailItem(product: Product): RailItem {
  const variant = product.variants[0];
  const priceRials = toRialsString(variant?.priceAmount ?? '0');
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    category: null,
    priceRials,
    priceTomans: rialsToTomansString(priceRials),
    inStock: variant?.inStock ?? false,
    availableQty: null,
    sku: variant?.sku ?? null,
    variantId: variant?.id ?? null,
  };
}

/**
 * ریل افقی محصولات؛ خروجی endpoint با قالب {source, items} خوانده می‌شود.
 * زنجیره جایگزین (fallback): خطای شبکه/وضعیت غیر ۲۰۰، پاسخ با source=FALLBACK،
 * یا فهرست خالی → فراخوانی listProducts() و نمایش ۶ کالای اول فروشگاه.
 */
function getProductPhoto(slug: string): { src: string; alt: string } {
  const s = slug.toLowerCase();
  if (s.includes('carboxygel') || s.includes('gel')) {
    return {
      src: '/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png',
      alt: 'ژل کربوکسی‌تراپی CarboxyGel دکتر درمر',
    };
  }
  if (s.includes('carboxypad') || s.includes('pad')) {
    return {
      src: '/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png',
      alt: 'پدهای فعال‌ساز CarboxyPad دکتر درمر',
    };
  }
  if (s.includes('carboxypod') || s.includes('pod')) {
    return {
      src: '/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png',
      alt: 'پادهای فعال‌ساز CarboxyPod دکتر درمر',
    };
  }
  if (s.includes('crystalene')) {
    return {
      src: '/assets/drdermer/2025/08/crystalene-scrub.webp',
      alt: 'خمیر پولیش کریستالین Crystalene دکتر درمر',
    };
  }
  if (s.includes('healene')) {
    return {
      src: '/assets/drdermer/2025/08/healene-gel.webp',
      alt: 'ژل تسکین‌بخش هیلین Healene دکتر درمر',
    };
  }
  if (s.includes('silicalene')) {
    return {
      src: '/assets/drdermer/2025/08/silicalene-scrub.webp',
      alt: 'اسکراب دتوکس سیلیکالین Silicalene دکتر درمر',
    };
  }
  return {
    src: '/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png',
    alt: 'ژل کربوکسی‌تراپی CarboxyGel دکتر درمر',
  };
}

const CURATED_FALLBACK_PRODUCTS: RailItem[] = [
  {
    id: 'prod_drdermer_001',
    slug: 'carboxygel',
    title: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel',
    description: 'ژل ۲ فاز ماتریکسی با القای فیزیولوژیک اثر بوهر (Bohr Effect) جهت رهایش اکسیژن بافتی بدون سوزن.',
    category: { slug: 'carboxy', titleFa: 'کربوکسی‌تراپی' },
    priceRials: '48500000',
    priceTomans: '4850000',
    inStock: true,
    availableQty: 50,
    sku: 'DD-CBG-500ML',
    variantId: 'var_cbg_pro_500',
  },
  {
    id: 'prod_drdermer_002',
    slug: 'carboxypod',
    title: 'پادهای فعال‌ساز ترابافتی CarboxyPod',
    description: 'کپسول‌های فعال‌ساز گاز CO₂ و لایه‌برداری همزمان ترابافتی در سه مدل درمانی کربن فعال و ویتامین.',
    category: { slug: 'carboxy', titleFa: 'کربوکسی‌تراپی' },
    priceRials: '18000000',
    priceTomans: '1800000',
    inStock: true,
    availableQty: 100,
    sku: 'DD-POD-CRB-10X',
    variantId: 'var_pod_carbon_10',
  },
  {
    id: 'prod_drdermer_003',
    slug: 'carboxypad',
    title: 'پدهای آلکالاین صورت و گردن CarboxyPad',
    description: 'شیت‌های فیبری میکروپرمنبران پیش‌برش‌خورده با برش آناتومیک صورت و گردن جهت تبادل گازی سریع.',
    category: { slug: 'carboxy', titleFa: 'کربوکسی‌تراپی' },
    priceRials: '14000000',
    priceTomans: '1400000',
    inStock: true,
    availableQty: 80,
    sku: 'DD-PAD-20X',
    variantId: 'var_pad_20x',
  },
  {
    id: 'prod_drdermer_004',
    slug: 'crystalene',
    title: 'خمیر پولیش و لایه‌بردار Crystalene',
    description: 'میکرودرم ابریشمی با کریستال‌های خالص آلومینای گرید پزشکی، نیاسینامید و اسید لاکتیک.',
    category: { slug: 'homecare', titleFa: 'مراقبت خانگی' },
    priceRials: '17500000',
    priceTomans: '1750000',
    inStock: true,
    availableQty: 60,
    sku: 'DD-CRY-200ML',
    variantId: 'var_cry_200ml',
  },
  {
    id: 'prod_drdermer_005',
    slug: 'healene',
    title: 'ژل تسکین‌بخش و التیام‌دهنده Healene',
    description: 'ژل سبک آبرسان و ترمیم‌کننده با نیاسینامید، پانتنول B5، هیالورونیک اسید و عصاره‌های گیاهی.',
    category: { slug: 'homecare', titleFa: 'مراقبت خانگی' },
    priceRials: '16000000',
    priceTomans: '1600000',
    inStock: true,
    availableQty: 40,
    sku: 'DD-HEA-250ML',
    variantId: 'var_hea_250ml',
  },
  {
    id: 'prod_drdermer_006',
    slug: 'silicalene',
    title: 'اسکراب دتوکس منافذ Silicalene',
    description: 'پاکسازی عمقی منافذ، کنترل چربی اضافه و رفع جوش‌های سرسیاه با میکروسفرهای کروی سیلیکا.',
    category: { slug: 'homecare', titleFa: 'مراقبت خانگی' },
    priceRials: '15500000',
    priceTomans: '1550000',
    inStock: true,
    availableQty: 45,
    sku: 'DD-SIL-200ML',
    variantId: 'var_sil_200ml',
  },
];

export function ProductRail({ endpoint, titleFa }: { endpoint: string; titleFa: string }) {
  const { formatToman } = useLocalizedFormatter();
  const [items, setItems] = useState<RailItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const applyFallback = async () => {
      try {
        const catalog = await listProducts();
        if (cancelled) return;
        const products = catalog?.data ?? [];
        if (products.length > 0) {
          setItems(products.slice(0, 6).map(productToRailItem));
          return;
        }
      } catch {
        // ignore
      }
      if (!cancelled) {
        setItems(CURATED_FALLBACK_PRODUCTS);
      }
    };

    const load = async () => {
      try {
        const response = await fetch(`${apiBase}${endpoint}`, {
          cache: 'no-store',
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(RAIL_FETCH_TIMEOUT_MS),
        });
        if (!response.ok) throw new Error(`rail status ${response.status}`);
        const payload = (await response.json()) as { source?: unknown; items?: unknown };
        const rawItems = Array.isArray(payload.items) ? payload.items : [];
        if (payload.source === 'FALLBACK' || rawItems.length === 0) throw new Error('rail unavailable');
        const normalized = rawItems
          .map(normalizeRailItem)
          .filter((item) => item.id !== '' && item.slug !== '' && item.title !== '');
        if (normalized.length === 0) throw new Error('rail unusable');
        if (!cancelled) {
          setItems(normalized);
        }
      } catch {
        if (!cancelled) await applyFallback();
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (items === null) {
    return (
      <section className="rail" aria-busy="true">
        <div className="rail-head">
          <h2>{titleFa}</h2>
        </div>
        <div className="rail-grid">
          {Array.from({ length: RAIL_SKELETON_COUNT }, (_, index) => (
            <div key={index} className="rail-skeleton" aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="rail">
      <div className="rail-head">
        <h2>{titleFa}</h2>
        <span className="rail-curated-badge">
          فرمولاسیون‌های منتخب بالینی و پروتکل‌های برتر درماتولوژی
        </span>
      </div>
      <div className="rail-grid">
        {items.map((item) => {
          const href = `/products/${encodeURIComponent(item.slug)}`;
          const variantId = item.variantId ?? item.id;
          const photo = getProductPhoto(item.slug);

          return (
            <article className="product-card" key={item.id}>
              <Link className="product-art" href={href} aria-label={`مشاهده پرونده تخصصی ${item.title}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="product-card-real-img"
                  loading="lazy"
                />
                <span className="art-caption">
                  {item.inStock ? 'موجود در زنجیره رسمی' : 'در انتظار ترخیص'}
                </span>
              </Link>
              <div className="product-copy">
                <h3>
                  <Link href={href}>{item.title}</Link>
                </h3>
                <p>{item.description ?? 'توضیحات و مشخصات تکمیلی کالا در صفحه محصول.'}</p>
                <div className="product-bottom">
                  <strong>{formatToman(item.priceRials)}</strong>
                  <div className="rail-actions">
                    <WishlistButton
                      variantId={variantId}
                      productId={item.id}
                      slug={item.slug}
                      title={item.title}
                      sku={item.sku ?? ''}
                      priceAmount={item.priceRials}
                    />
                    <CompareButton
                      variantId={variantId}
                      productId={item.id}
                      slug={item.slug}
                      title={item.title}
                      sku={item.sku ?? ''}
                      priceAmount={item.priceRials}
                      inStock={item.inStock}
                      categoryTitleFa={item.category?.titleFa ?? null}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
