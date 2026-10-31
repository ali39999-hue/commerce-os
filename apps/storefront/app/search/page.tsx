'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiBase, formatToman, listProducts, type Product } from '../../lib/catalog';
import { WishlistButton } from '../../components/discovery/wishlist-button';
import { CompareButton } from '../../components/discovery/compare-button';

interface SearchItem {
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

interface SearchFacets {
  categories: Array<{ slug: string; titleFa: string }>;
  inStockTotal: number;
}

interface SearchState {
  source: 'api' | 'fallback';
  items: SearchItem[];
  total: number;
  facets: SearchFacets;
}

type SortValue = 'newest' | 'price_asc' | 'price_desc';

interface Filters {
  q: string;
  category: string;
  min: string;
  max: string;
  stock: boolean;
  sort: SortValue;
}

const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
];

const EMPTY_FACETS: SearchFacets = { categories: [], inStockTotal: 0 };
const SEARCH_PAGE_SIZE = 24;
const SEARCH_FETCH_TIMEOUT_MS = 3500;
const SEARCH_DEBOUNCE_MS = 300;

function readFilters(sp: URLSearchParams): Filters {
  const sortRaw = sp.get('sort');
  const sort: SortValue = sortRaw === 'price_asc' || sortRaw === 'price_desc' ? sortRaw : 'newest';
  return {
    q: sp.get('q') ?? '',
    category: sp.get('category') ?? '',
    min: sp.get('min') ?? '',
    max: sp.get('max') ?? '',
    stock: sp.get('stock') === '1',
    sort,
  };
}

function buildQueryString(filters: Filters): string {
  const sp = new URLSearchParams();
  const q = filters.q.trim();
  const min = filters.min.trim();
  const max = filters.max.trim();
  if (q !== '') sp.set('q', q);
  if (filters.category !== '') sp.set('category', filters.category);
  if (min !== '') sp.set('min', min);
  if (max !== '') sp.set('max', max);
  if (filters.stock) sp.set('stock', '1');
  if (filters.sort !== 'newest') sp.set('sort', filters.sort);
  const serialized = sp.toString();
  return serialized === '' ? '' : `?${serialized}`;
}

/** تبدیل ورودی تومانی کاربر به ریال برای API (ضریب ۱۰). */
function tomanToRialsParam(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (cleaned === '') return '';
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount < 0) return '';
  return String(Math.round(amount * 10));
}

function buildApiUrl(sp: URLSearchParams): string {
  const url = new URL(`${apiBase}/v1/search`);
  const setIf = (key: string, value: string) => {
    if (value !== '') url.searchParams.set(key, value);
  };
  setIf('q', (sp.get('q') ?? '').trim());
  setIf('category', sp.get('category') ?? '');
  setIf('minPrice', tomanToRialsParam(sp.get('min') ?? ''));
  setIf('maxPrice', tomanToRialsParam(sp.get('max') ?? ''));
  setIf('inStock', sp.get('stock') === '1' ? 'true' : '');
  setIf('sort', sp.get('sort') ?? 'newest');
  url.searchParams.set('limit', String(SEARCH_PAGE_SIZE));
  url.searchParams.set('offset', '0');
  return url.toString();
}

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

function normalizeSearchItem(entry: unknown): SearchItem {
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

function normalizeSearchItems(raw: unknown): SearchItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeSearchItem)
    .filter((item) => item.id !== '' && item.slug !== '' && item.title !== '');
}

function normalizeFacets(raw: unknown): SearchFacets {
  const source = (raw ?? {}) as Record<string, unknown>;
  const categoriesRaw = Array.isArray(source.categories) ? source.categories : [];
  const categories = categoriesRaw
    .map((entry) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      return {
        slug: typeof record.slug === 'string' ? record.slug : '',
        titleFa: typeof record.titleFa === 'string' ? record.titleFa : '',
      };
    })
    .filter((category) => category.slug !== '' && category.titleFa !== '');
  return {
    categories,
    inStockTotal: typeof source.inStockTotal === 'number' ? source.inStockTotal : 0,
  };
}

function productToSearchItem(product: Product): SearchItem {
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

function priceOf(item: SearchItem): number {
  const amount = Number(item.priceRials);
  return Number.isFinite(amount) ? amount : 0;
}

/** وقتی API در دسترس نیست، فیلترها سمت مرورگر روی کالاهای فروشگاه اعمال می‌شوند. */
function applyLocalFilters(items: SearchItem[], sp: URLSearchParams): SearchItem[] {
  const q = (sp.get('q') ?? '').trim().toLowerCase();
  const category = sp.get('category') ?? '';
  const minRials = Number(tomanToRialsParam(sp.get('min') ?? ''));
  const maxRials = Number(tomanToRialsParam(sp.get('max') ?? ''));
  const stockOnly = sp.get('stock') === '1';
  const sort = sp.get('sort') ?? 'newest';

  let result = items.filter((item) => {
    if (q !== '' && !`${item.title} ${item.description ?? ''}`.toLowerCase().includes(q)) return false;
    if (category !== '' && item.category?.slug !== category) return false;
    if (minRials > 0 && priceOf(item) < minRials) return false;
    if (maxRials > 0 && priceOf(item) > maxRials) return false;
    if (stockOnly && !item.inStock) return false;
    return true;
  });

  if (sort === 'price_asc') result = [...result].sort((a, b) => priceOf(a) - priceOf(b));
  else if (sort === 'price_desc') result = [...result].sort((a, b) => priceOf(b) - priceOf(a));
  return result;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serialized = searchParams.toString();

  const filters = useMemo(() => readFilters(new URLSearchParams(serialized)), [serialized]);

  // ورودی‌های متنی برای تایپ روان؛ پس از تغییر URL (مثلاً دکمه بازگشت) همگام می‌شوند.
  const [queryInput, setQueryInput] = useState(filters.q);
  const [minInput, setMinInput] = useState(filters.min);
  const [maxInput, setMaxInput] = useState(filters.max);
  const [result, setResult] = useState<SearchState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQueryInput(filters.q);
    setMinInput(filters.min);
    setMaxInput(filters.max);
  }, [filters]);

  const navigate = useCallback(
    (next: Filters) => {
      router.push(`/search${buildQueryString(next)}`);
    },
    [router]
  );

  // تغییر فیلترها URL را به‌روزرسانی می‌کند تا لینک‌ها قابل اشتراک‌گذاری باشند.
  useEffect(() => {
    if (queryInput === filters.q) return;
    const timer = window.setTimeout(() => {
      navigate({ ...filters, q: queryInput });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [queryInput, filters, navigate]);

  useEffect(() => {
    if (minInput === filters.min && maxInput === filters.max) return;
    const timer = window.setTimeout(() => {
      navigate({ ...filters, min: minInput, max: maxInput });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [minInput, maxInput, filters, navigate]);

  // واکشی نتایج با ۳۰۰ میلی‌ثانیه تأخیر و لغو درخواست منسوخ‌شده.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const abortTimer = window.setTimeout(() => controller.abort(), SEARCH_FETCH_TIMEOUT_MS);

    const debounceTimer = window.setTimeout(() => {
      const run = async () => {
        setLoading(true);
        const sp = new URLSearchParams(serialized);
        try {
          const response = await fetch(buildApiUrl(sp), {
            cache: 'no-store',
            headers: { accept: 'application/json' },
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`search status ${response.status}`);
          const payload = (await response.json()) as { items?: unknown; total?: unknown; facets?: unknown };
          if (cancelled) return;
          const items = normalizeSearchItems(payload.items);
          setResult({
            source: 'api',
            items,
            total: typeof payload.total === 'number' ? payload.total : items.length,
            facets: normalizeFacets(payload.facets),
          });
        } catch {
          if (cancelled) return;
          const catalog = await listProducts();
          if (cancelled) return;
          const mapped = (catalog?.data ?? []).map(productToSearchItem);
          const filtered = applyLocalFilters(mapped, sp).slice(0, SEARCH_PAGE_SIZE);
          setResult({
            source: 'fallback',
            items: filtered,
            total: filtered.length,
            facets: {
              categories: [],
              inStockTotal: mapped.filter((item) => item.inStock).length,
            },
          });
        } finally {
          window.clearTimeout(abortTimer);
          if (!cancelled) setLoading(false);
        }
      };
      void run();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(debounceTimer);
      window.clearTimeout(abortTimer);
      controller.abort();
    };
  }, [serialized]);

  const facets = result?.facets ?? EMPTY_FACETS;
  const items = result?.items ?? [];
  const totalLabel = new Intl.NumberFormat('fa-IR').format(result?.total ?? 0);

  return (
    <section className="search-layout">
      <aside className="search-sidebar" aria-label="فیلترهای جست‌وجو">
        <div className="filter-group">
          <label className="filter-label" htmlFor="search-q">
            جست‌وجو
          </label>
          <input
            id="search-q"
            type="search"
            className="input-text"
            placeholder="نام کالا…"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">دسته‌بندی</span>
          <label className="filter-option">
            <input
              type="radio"
              name="search-category"
              checked={filters.category === ''}
              onChange={() => navigate({ ...filters, category: '' })}
            />
            همه دسته‌ها
          </label>
          {facets.categories.map((category) => (
            <label className="filter-option" key={category.slug}>
              <input
                type="radio"
                name="search-category"
                checked={filters.category === category.slug}
                onChange={() => navigate({ ...filters, category: category.slug })}
              />
              {category.titleFa}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">محدوده قیمت (تومان)</span>
          <div className="filter-price-row">
            <input
              type="number"
              min={0}
              className="input-text"
              placeholder="از"
              aria-label="حداقل قیمت (تومان)"
              value={minInput}
              onChange={(event) => setMinInput(event.target.value)}
            />
            <input
              type="number"
              min={0}
              className="input-text"
              placeholder="تا"
              aria-label="حداکثر قیمت (تومان)"
              value={maxInput}
              onChange={(event) => setMaxInput(event.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.stock}
              onChange={(event) => navigate({ ...filters, stock: event.target.checked })}
            />
            فقط کالاهای موجود
          </label>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="search-sort">
            ترتیب نمایش
          </label>
          <select
            id="search-sort"
            className="input-text"
            value={filters.sort}
            onChange={(event) => navigate({ ...filters, sort: event.target.value as SortValue })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn-clear-filters" onClick={() => router.push('/search')}>
          پاک‌کردن فیلترها
        </button>
      </aside>

      <div className="search-results">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              {result?.source === 'fallback'
                ? 'حالت آفلاین — کالاهای فروشگاه بر اساس فیلترها'
                : 'جست‌وجوی پیشرفته کالاها'}
            </div>
            <h2>نتایج جست‌وجو</h2>
          </div>
          <span className="count-label">{loading ? '…' : `${totalLabel} نتیجه`}</span>
        </div>

        {loading ? (
          <div className="product-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="rail-skeleton" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="state-panel search-empty">
            <h3>نتیجه‌ای یافت نشد</h3>
            <p>عبارت دیگری را جست‌وجو کنید یا فیلترها را تغییر دهید.</p>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((item) => {
              const href = `/products/${encodeURIComponent(item.slug)}`;
              const variantId = item.variantId ?? item.id;
              return (
                <article className="product-card" key={item.id}>
                  <Link className="product-art" href={href} aria-label={`مشاهده ${item.title}`}>
                    <span className="art-index">{item.title.slice(0, 1)}</span>
                    <span className="art-caption">
                      {item.inStock ? 'موجود در انبار' : 'اتمام موجودی'}
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
        )}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="state-panel">در حال بارگذاری جست‌وجو…</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
