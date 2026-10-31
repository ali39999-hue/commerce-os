'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiBase, formatToman, listProducts, type Product } from '../../lib/catalog';
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
export function ProductRail({ endpoint, titleFa }: { endpoint: string; titleFa: string }) {
  const [items, setItems] = useState<RailItem[] | null>(null);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const applyFallback = async () => {
      const catalog = await listProducts();
      if (cancelled) return;
      const products = catalog?.data ?? [];
      if (products.length === 0) {
        setItems([]);
        setDegraded(true);
        return;
      }
      setItems(products.slice(0, 6).map(productToRailItem));
      setDegraded(true);
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
          setDegraded(false);
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
        {degraded && (
          <span className="rail-source-hint">
            سرویس پیشنهادگر در دسترس نیست؛ کالاهای منتخب فروشگاه نمایش داده می‌شوند
          </span>
        )}
      </div>
      <div className="rail-grid">
        {items.map((item) => {
          const href = `/products/${encodeURIComponent(item.slug)}`;
          const variantId = item.variantId ?? item.id;
          return (
            <article className="product-card" key={item.id}>
              <Link className="product-art" href={href} aria-label={`مشاهده ${item.title}`}>
                <span className="art-index">{item.title.slice(0, 1)}</span>
                <span className="art-caption">{item.inStock ? 'موجود در انبار' : 'اتمام موجودی'}</span>
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
