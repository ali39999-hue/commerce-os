'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  brand?: { slug: string; name: string } | null;
  skinConcern?: string | null;
  productType?: 'physical' | 'digital' | 'bundle';
  formulation?: string | null;
  priceRials: string;
  priceTomans: string;
  inStock: boolean;
  availableQty: number | null;
  sku: string | null;
  variantId: string | null;
  popularityScore?: number;
}

interface SearchFacets {
  categories: Array<{ slug: string; titleFa: string }>;
  brands: Array<{ slug: string; name: string }>;
  concerns: Array<{ slug: string; label: string }>;
  formulations: Array<{ slug: string; label: string }>;
  inStockTotal: number;
}

interface SearchState {
  source: 'api' | 'fallback';
  items: SearchItem[];
  total: number;
  facets: SearchFacets;
}

type SortValue = 'popular' | 'newest' | 'price_asc' | 'price_desc';

interface Filters {
  q: string;
  category: string;
  brand: string;
  concern: string;
  type: string;
  formulation: string;
  min: string;
  max: string;
  stock: boolean;
  sort: SortValue;
}

const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: 'popular', label: 'محبوب‌ترین و پرفروش‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
];

const BRAND_FACETS = [
  { slug: 'reeskin', name: 'ReeSkin Clinical (ری‌اسکین)' },
  { slug: 'reemed', name: 'ReeMed Laboratories (ری‌مد)' },
  { slug: 'dr-dermer', name: 'Dr Dermer Central (دکتر درمر)' },
];

const CONCERN_FACETS = [
  { slug: 'dullness', label: 'کدری و تیرگی چهره (Dullness)' },
  { slug: 'anti-aging', label: 'افتادگی و خطوط پیری (Anti-Aging)' },
  { slug: 'scars-pores', label: 'منافذ باز و اسکار (Pores & Scars)' },
  { slug: 'sensitivity-barrier', label: 'ترمیم سد دفاعی و خشکی (Barrier Recovery)' },
];

const FORMULATION_FACETS = [
  { slug: 'gel', label: 'ژل ۲ فاز فعال‌شونده (CO2 Gel)' },
  { slug: 'serum', label: 'سرم کنسانتره پپتیدی (Peptide Serum)' },
  { slug: 'pads', label: 'پد فیبری میکروکپسوله (Fiber Pads)' },
  { slug: 'cream', label: 'کرم سد دفاعی لاملار (Barrier Cream)' },
];

const PRODUCT_TYPE_FACETS = [
  { slug: 'physical', label: 'کالای فیزیکی و کلینیکال' },
  { slug: 'bundle', label: 'کیت و پروتکل کامل (Bundle & Save)' },
  { slug: 'digital', label: 'آموزش و هندبوک دیجیتال' },
];

// Persian & English synonym dictionary
const SYNONYMS_MAP: Record<string, string[]> = {
  کربوکسی: ['carboxy', 'carboxygel', 'کربوکسی‌ژل', 'بوهر', 'bohr', 'co2'],
  carboxy: ['کربوکسی', 'carboxygel', 'بوهر', 'co2', 'اکسیژن'],
  carboxygel: ['کربوکسی', 'carboxy', 'ژل کربوکسی', 'bohr effect'],
  بوهر: ['bohr', 'کربوکسی', 'اکسیژن', 'co2'],
  رتینول: ['retinol', 'باکوچیول', 'bakuchiol', 'ضدچروک', 'پپتید'],
  retinol: ['رتینول', 'باکوچیول', 'پپتید', 'جوانسازی'],
  سیکا: ['cica', 'سنتلا', 'centella', 'ترمیم', 'بریر'],
  بریر: ['barrier', 'سد دفاعی', 'ترمیم', 'سیکا', 'سرامید'],
  barrier: ['بریر', 'سد دفاعی', 'ترمیم', 'سرامید', 'cica'],
  ری‌اسکین: ['reeskin', 'درمر', 'dermer'],
  reeskin: ['ری‌اسکین', 'درمر', 'dermer'],
  ری‌مد: ['reemed', 'درمر', 'dermer'],
  reemed: ['ری‌مد', 'درمر', 'dermer'],
  پد: ['pad', 'carboxypod', 'پاد', 'ماسک'],
  سرم: ['serum', 'پپتید', 'egf'],
  قهوه: ['اسپرسو', 'عربیکا', 'دمی', 'v60'],
};

const SUGGESTED_QUICK_SEARCHES = [
  'کربوکسی ژل CarboxyGel',
  'پدهای فعال‌ساز CarboxyPod',
  'سرم بازسازی سلولی رتینول و پپتید',
  'کرم ترمیم سد دفاعی بریر (Barrier)',
  'شوینده ملایم ری‌اسکین',
  'کیت تخصصی نوسازی سلولی با اثر بوهر',
];

const EMPTY_FACETS: SearchFacets = {
  categories: [],
  brands: BRAND_FACETS,
  concerns: CONCERN_FACETS,
  formulations: FORMULATION_FACETS,
  inStockTotal: 0,
};

const SEARCH_PAGE_SIZE = 24;
const SEARCH_FETCH_TIMEOUT_MS = 3500;
const SEARCH_DEBOUNCE_MS = 300;

function readFilters(sp: URLSearchParams): Filters {
  const sortRaw = sp.get('sort');
  const sort: SortValue =
    sortRaw === 'popular' || sortRaw === 'price_asc' || sortRaw === 'price_desc'
      ? sortRaw
      : 'newest';

  return {
    q: sp.get('q') ?? '',
    category: sp.get('category') ?? '',
    brand: sp.get('brand') ?? '',
    concern: sp.get('concern') ?? '',
    type: sp.get('type') ?? '',
    formulation: sp.get('formulation') ?? '',
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
  if (filters.brand !== '') sp.set('brand', filters.brand);
  if (filters.concern !== '') sp.set('concern', filters.concern);
  if (filters.type !== '') sp.set('type', filters.type);
  if (filters.formulation !== '') sp.set('formulation', filters.formulation);
  if (min !== '') sp.set('min', min);
  if (max !== '') sp.set('max', max);
  if (filters.stock) sp.set('stock', '1');
  if (filters.sort !== 'newest') sp.set('sort', filters.sort);
  const serialized = sp.toString();
  return serialized === '' ? '' : `?${serialized}`;
}

function tomanToRialsParam(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (cleaned === '') return '';
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount < 0) return '';
  return String(Math.round(amount * 10));
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
  const brandRaw = (raw.brand ?? null) as Record<string, unknown> | null;
  const priceRials = toRialsString(raw.priceRials);
  const slug = typeof raw.slug === 'string' ? raw.slug : '';
  const title = typeof raw.title === 'string' ? raw.title : '';

  // Classify clinical properties if present
  let brandObj = brandRaw
    ? { slug: String(brandRaw.slug || ''), name: String(brandRaw.name || '') }
    : null;
  if (!brandObj) {
    if (slug.includes('reeskin') || title.includes('ری‌اسکین')) {
      brandObj = { slug: 'reeskin', name: 'ReeSkin Clinical' };
    } else if (slug.includes('reemed') || title.includes('ری‌مد')) {
      brandObj = { slug: 'reemed', name: 'ReeMed Laboratories' };
    } else if (slug.includes('carboxy') || title.includes('کربوکسی')) {
      brandObj = { slug: 'reeskin', name: 'ReeSkin Clinical' };
    }
  }

  let concern: string | null = null;
  if (slug.includes('carboxy') || title.includes('کربوکسی')) concern = 'dullness';
  else if (slug.includes('serum') || title.includes('سلولی') || title.includes('رتینول')) concern = 'anti-aging';
  else if (slug.includes('pad') || title.includes('پد')) concern = 'scars-pores';
  else if (slug.includes('cream') || slug.includes('barrier') || title.includes('بریر') || title.includes('ترمیم')) concern = 'sensitivity-barrier';

  let formulation: string | null = null;
  if (slug.includes('gel') || title.includes('ژل')) formulation = 'gel';
  else if (slug.includes('serum') || title.includes('سرم')) formulation = 'serum';
  else if (slug.includes('pod') || slug.includes('pad') || title.includes('پد')) formulation = 'pads';
  else if (slug.includes('cream') || title.includes('کرم')) formulation = 'cream';

  const productType: 'physical' | 'digital' | 'bundle' =
    raw.kind === 'DIGITAL' || slug.includes('guide') || slug.includes('course')
      ? 'digital'
      : slug.includes('bundle') || slug.includes('kit')
      ? 'bundle'
      : 'physical';

  return {
    id: typeof raw.id === 'string' ? raw.id : '',
    slug,
    title,
    description: typeof raw.description === 'string' ? raw.description : null,
    category:
      categoryRaw && typeof categoryRaw === 'object'
        ? {
            slug: typeof categoryRaw.slug === 'string' ? categoryRaw.slug : '',
            titleFa: typeof categoryRaw.titleFa === 'string' ? categoryRaw.titleFa : '',
          }
        : null,
    brand: brandObj,
    skinConcern: concern,
    productType,
    formulation,
    priceRials,
    priceTomans: toRialsString(raw.priceTomans) || rialsToTomansString(priceRials),
    inStock: raw.inStock === true,
    availableQty: typeof raw.availableQty === 'number' ? raw.availableQty : 20,
    sku: typeof raw.sku === 'string' ? raw.sku : null,
    variantId: typeof raw.variantId === 'string' ? raw.variantId : null,
    popularityScore: slug.includes('carboxy') ? 98 : slug.includes('serum') ? 92 : 80,
  };
}

function normalizeSearchItems(raw: unknown): SearchItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeSearchItem)
    .filter((item) => item.id !== '' && item.slug !== '' && item.title !== '');
}

function productToSearchItem(product: Product): SearchItem {
  const variant = product.variants[0];
  const priceRials = toRialsString(variant?.priceAmount ?? '0');
  return normalizeSearchItem({
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    priceRials,
    priceTomans: rialsToTomansString(priceRials),
    inStock: variant?.inStock ?? false,
    sku: variant?.sku ?? null,
    variantId: variant?.id ?? null,
  });
}

function priceOf(item: SearchItem): number {
  const amount = Number(item.priceRials);
  return Number.isFinite(amount) ? amount : 0;
}

/** Check if query matches text directly or via English/Persian synonyms */
function matchesQueryWithSynonyms(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  if (lowerText.includes(lowerQuery)) return true;

  const tokens = [lowerQuery];
  for (const [key, syns] of Object.entries(SYNONYMS_MAP)) {
    if (lowerQuery.includes(key.toLowerCase())) {
      syns.forEach((s) => tokens.push(s.toLowerCase()));
    }
  }

  return tokens.some((token) => lowerText.includes(token));
}

function applyLocalFilters(items: SearchItem[], sp: URLSearchParams): SearchItem[] {
  const q = (sp.get('q') ?? '').trim();
  const category = sp.get('category') ?? '';
  const brand = sp.get('brand') ?? '';
  const concern = sp.get('concern') ?? '';
  const type = sp.get('type') ?? '';
  const formulation = sp.get('formulation') ?? '';
  const minRials = Number(tomanToRialsParam(sp.get('min') ?? ''));
  const maxRials = Number(tomanToRialsParam(sp.get('max') ?? ''));
  const stockOnly = sp.get('stock') === '1';
  const sort = (sp.get('sort') ?? 'newest') as SortValue;

  let result = items.filter((item) => {
    if (q !== '') {
      const corpus = `${item.title} ${item.description ?? ''} ${item.brand?.name ?? ''} ${item.sku ?? ''}`;
      if (!matchesQueryWithSynonyms(corpus, q)) return false;
    }
    if (category !== '' && item.category?.slug !== category) return false;
    if (brand !== '' && item.brand?.slug !== brand) return false;
    if (concern !== '' && item.skinConcern !== concern) return false;
    if (type !== '' && item.productType !== type) return false;
    if (formulation !== '' && item.formulation !== formulation) return false;
    if (minRials > 0 && priceOf(item) < minRials) return false;
    if (maxRials > 0 && priceOf(item) > maxRials) return false;
    if (stockOnly && !item.inStock) return false;
    return true;
  });

  if (sort === 'popular') {
    result = [...result].sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
  } else if (sort === 'price_asc') {
    result = [...result].sort((a, b) => priceOf(a) - priceOf(b));
  } else if (sort === 'price_desc') {
    result = [...result].sort((a, b) => priceOf(b) - priceOf(a));
  }

  return result;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serialized = searchParams.toString();

  const filters = useMemo(() => readFilters(new URLSearchParams(serialized)), [serialized]);

  const [queryInput, setQueryInput] = useState(filters.q);
  const [minInput, setMinInput] = useState(filters.min);
  const [maxInput, setMaxInput] = useState(filters.max);
  const [result, setResult] = useState<SearchState | null>(null);
  const [loading, setLoading] = useState(true);

  // Autocomplete state
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions when user types
  const handleQueryInputChange = (val: string) => {
    setQueryInput(val);
    if (val.trim().length > 1) {
      const qLower = val.toLowerCase().trim();
      const matches = SUGGESTED_QUICK_SEARCHES.filter((s) =>
        matchesQueryWithSynonyms(s, qLower)
      );
      // Also inject synonyms
      for (const [k, syns] of Object.entries(SYNONYMS_MAP)) {
        if (k.includes(qLower) || syns.some((s) => s.includes(qLower))) {
          syns.slice(0, 2).forEach((s) => {
            if (!matches.includes(s)) matches.push(`جست‌وجوی مترادف: ${s}`);
          });
        }
      }
      setAutocompleteSuggestions(matches.slice(0, 6));
      setIsAutocompleteOpen(true);
    } else {
      setIsAutocompleteOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const clean = suggestion.replace(/^جست‌وجوی مترادف:\s*/, '');
    setQueryInput(clean);
    setIsAutocompleteOpen(false);
    navigate({ ...filters, q: clean });
  };

  // Sync debounced inputs with URL
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

  // Fetch search results
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const abortTimer = window.setTimeout(() => controller.abort(), SEARCH_FETCH_TIMEOUT_MS);

    const debounceTimer = window.setTimeout(() => {
      const run = async () => {
        setLoading(true);
        const sp = new URLSearchParams(serialized);
        try {
          const response = await fetch(`${apiBase}/v1/search?${sp.toString()}`, {
            cache: 'no-store',
            headers: { accept: 'application/json' },
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`search status ${response.status}`);
          const payload = (await response.json()) as { items?: unknown; total?: unknown; facets?: unknown };
          if (cancelled) return;
          const rawItems = normalizeSearchItems(payload.items);
          const filtered = applyLocalFilters(rawItems, sp);
          setResult({
            source: 'api',
            items: filtered,
            total: filtered.length,
            facets: {
              categories: [
                { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
                { slug: 'coffee', titleFa: 'قهوه و تجهیزات تخصصی' },
                { slug: 'home', titleFa: 'روشنایی و دکوراسیون' },
                { slug: 'digital', titleFa: 'کالای دیجیتال و صوتی' },
              ],
              brands: BRAND_FACETS,
              concerns: CONCERN_FACETS,
              formulations: FORMULATION_FACETS,
              inStockTotal: rawItems.filter((item) => item.inStock).length,
            },
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
              categories: [
                { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
                { slug: 'coffee', titleFa: 'قهوه و تجهیزات تخصصی' },
                { slug: 'home', titleFa: 'روشنایی و دکوراسیون' },
                { slug: 'digital', titleFa: 'کالای دیجیتال و صوتی' },
              ],
              brands: BRAND_FACETS,
              concerns: CONCERN_FACETS,
              formulations: FORMULATION_FACETS,
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

  // Count active filters for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.concern) count++;
    if (filters.type) count++;
    if (filters.formulation) count++;
    if (filters.min || filters.max) count++;
    if (filters.stock) count++;
    return count;
  }, [filters]);

  const renderFilterControls = () => (
    <>
      {/* Brand facet */}
      <div className="filter-group">
        <span className="filter-label">برند محصول (Brand)</span>
        <label className="filter-option">
          <input
            type="radio"
            name="search-brand"
            checked={filters.brand === ''}
            onChange={() => navigate({ ...filters, brand: '' })}
          />
          همه برندها
        </label>
        {facets.brands.map((b) => (
          <label className="filter-option" key={b.slug}>
            <input
              type="radio"
              name="search-brand"
              checked={filters.brand === b.slug}
              onChange={() => navigate({ ...filters, brand: b.slug })}
            />
            {b.name}
          </label>
        ))}
      </div>

      {/* Skin Concern facet */}
      <div className="filter-group">
        <span className="filter-label">دغدغه پوستی و درمانی</span>
        <label className="filter-option">
          <input
            type="radio"
            name="search-concern"
            checked={filters.concern === ''}
            onChange={() => navigate({ ...filters, concern: '' })}
          />
          همه دغدغه‌ها
        </label>
        {facets.concerns.map((c) => (
          <label className="filter-option" key={c.slug}>
            <input
              type="radio"
              name="search-concern"
              checked={filters.concern === c.slug}
              onChange={() => navigate({ ...filters, concern: c.slug })}
            />
            {c.label}
          </label>
        ))}
      </div>

      {/* Formulation facet */}
      <div className="filter-group">
        <span className="filter-label">شکل فرمولاسیون و بافت</span>
        <label className="filter-option">
          <input
            type="radio"
            name="search-formulation"
            checked={filters.formulation === ''}
            onChange={() => navigate({ ...filters, formulation: '' })}
          />
          همه بافت‌ها
        </label>
        {facets.formulations.map((f) => (
          <label className="filter-option" key={f.slug}>
            <input
              type="radio"
              name="search-formulation"
              checked={filters.formulation === f.slug}
              onChange={() => navigate({ ...filters, formulation: f.slug })}
            />
            {f.label}
          </label>
        ))}
      </div>

      {/* Product Type facet */}
      <div className="filter-group">
        <span className="filter-label">نوع کالا</span>
        <label className="filter-option">
          <input
            type="radio"
            name="search-type"
            checked={filters.type === ''}
            onChange={() => navigate({ ...filters, type: '' })}
          />
          همه انواع کالا
        </label>
        {PRODUCT_TYPE_FACETS.map((pt) => (
          <label className="filter-option" key={pt.slug}>
            <input
              type="radio"
              name="search-type"
              checked={filters.type === pt.slug}
              onChange={() => navigate({ ...filters, type: pt.slug })}
            />
            {pt.label}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <span className="filter-label">محدوده قیمت (تومان)</span>
        <div className="filter-price-row">
          <input
            type="number"
            min={0}
            className="input-text"
            placeholder="از"
            aria-label="حداقل قیمت به تومان"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
          />
          <input
            type="number"
            min={0}
            className="input-text"
            placeholder="تا"
            aria-label="حداکثر قیمت به تومان"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
          />
        </div>
      </div>

      {/* In-Stock Filter */}
      <div className="filter-group">
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.stock}
            onChange={(e) => navigate({ ...filters, stock: e.target.checked })}
          />
          فقط کالاهای موجود در انبار مرکزی
        </label>
      </div>

      {/* Clear Filters */}
      <button
        type="button"
        className="btn-clear-filters"
        onClick={() => {
          setIsMobileDrawerOpen(false);
          router.push('/search');
        }}
      >
        ✕ پاک‌کردن همه فیلترها
      </button>
    </>
  );

  return (
    <div className="search-page-container page-shell">
      {/* Header and Quick Search Autocomplete Bar */}
      <div className="search-hero-bar">
        <div className="search-hero-content">
          <h1>کاتالوگ و کاوش تخصصی محصولات</h1>
          <p>
            جست‌وجوی پیشرفته در میان محصولات کربوکسی‌تراپی، لاین‌های بالینی ReeSkin و ReeMed، فرمولاسیون‌های
            پپتیدی و تجهیزات مراقبت پوست
          </p>
        </div>

        {/* Search input with autocomplete & synonyms */}
        <div className="search-autocomplete-box" ref={searchBoxRef}>
          <div className="search-input-wrapper">
            <input
              id="main-search-input"
              type="search"
              role="combobox"
              aria-expanded={isAutocompleteOpen}
              aria-controls="search-autocomplete-list"
              aria-autocomplete="list"
              className="search-large-input"
              placeholder="جست‌وجوی کربوکسی، رتینول، سد دفاعی، نام لاتین (Carboxy, Retinol, ReeSkin)..."
              value={queryInput}
              onChange={(e) => handleQueryInputChange(e.target.value)}
              onFocus={() => {
                if (queryInput.trim().length > 1) setIsAutocompleteOpen(true);
              }}
            />
            {queryInput && (
              <button
                type="button"
                className="search-clear-input-btn"
                onClick={() => {
                  setQueryInput('');
                  setIsAutocompleteOpen(false);
                  navigate({ ...filters, q: '' });
                }}
                aria-label="پاک کردن متن جست‌وجو"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
            <ul
              id="search-autocomplete-list"
              role="listbox"
              className="search-autocomplete-dropdown"
              aria-label="پیشنهادات جست‌وجو"
            >
              {autocompleteSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  role="option"
                  aria-selected="false"
                  className="autocomplete-item"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  <span className="search-mag-icon" aria-hidden="true">🔍</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Trigger & Sort Row */}
      <div className="search-mobile-bar-row">
        <button
          type="button"
          className="search-open-drawer-btn"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-expanded={isMobileDrawerOpen}
          aria-controls="mobile-filter-drawer"
        >
          <span aria-hidden="true">⚙️</span>
          <span>فیلترهای پیشرفته</span>
          {activeFiltersCount > 0 && (
            <span className="filter-badge-count">{activeFiltersCount}</span>
          )}
        </button>

        <div className="search-sort-inline">
          <label htmlFor="search-sort-select">مرتب‌سازی:</label>
          <select
            id="search-sort-select"
            className="sort-select-input"
            value={filters.sort}
            onChange={(e) => navigate({ ...filters, sort: e.target.value as SortValue })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar + Search Results */}
      <section className="search-layout">
        {/* Desktop Persistent Sidebar */}
        <aside className="search-sidebar" aria-label="فیلترهای کاتالوگ و محصولات">
          <div className="sidebar-header-row">
            <h3>فیلترهای کاوش</h3>
            {activeFiltersCount > 0 && (
              <span className="sidebar-active-tag">{activeFiltersCount} فیلتر فعال</span>
            )}
          </div>

          {renderFilterControls()}
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {isMobileDrawerOpen && (
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          >
            <div
              id="mobile-filter-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="فیلترهای پیشرفته محصولات"
              className="mobile-drawer-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer-header">
                <h3>فیلترهای پیشرفته کاتالوگ</h3>
                <button
                  type="button"
                  className="mobile-drawer-close"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="بستن پنجره فیلترها"
                >
                  ✕
                </button>
              </div>

              <div className="mobile-drawer-scrollable">
                {renderFilterControls()}
              </div>

              <div className="mobile-drawer-footer">
                <button
                  type="button"
                  className="mobile-drawer-apply-btn"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  مشاهده نتایج ({totalLabel})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Stream */}
        <div className="search-results">
          <div className="search-results-header">
            <div>
              <div className="eyebrow">
                {result?.source === 'fallback'
                  ? 'کاتالوگ یکپارچه آفلاین و آنلاین'
                  : 'یافته‌های جست‌وجو'}
              </div>
              <h2>
                {filters.q ? `نتایج جست‌وجو برای «${filters.q}»` : 'تمامی محصولات و پروتکل‌ها'}
              </h2>
            </div>
            <span className="count-label">{loading ? 'در حال بارگذاری…' : `${totalLabel} کالا`}</span>
          </div>

          {loading ? (
            <div className="product-grid" aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="rail-skeleton" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="state-panel search-empty" role="status">
              <h3>کالایی با فیلترهای انتخابی یافت نشد</h3>
              <p>
                می‌توانید از عبارات مترادف نظیر «کربوکسی»، «Carboxy»، «سرم» یا «سد دفاعی» استفاده کنید یا
                فیلترهای اعمال‌شده را پاک نمایید.
              </p>
              <button
                type="button"
                className="btn-clear-filters"
                style={{ margin: '16px auto 0' }}
                onClick={() => router.push('/search')}
              >
                پاک‌سازی همه فیلترها
              </button>
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
                        {item.inStock ? '✓ موجود در انبار مرکزی' : 'ناموجود'}
                      </span>
                    </Link>

                    <div className="product-copy">
                      {item.brand && (
                        <span className="product-card-brand">{item.brand.name}</span>
                      )}
                      <h3>
                        <Link href={href}>{item.title}</Link>
                      </h3>
                      <p>{item.description ?? 'توضیحات و مشخصات تکمیلی کالا در صفحه محصول.'}</p>

                      <div className="product-bottom">
                        <div className="price-stack">
                          <strong className="product-card-toman">{formatToman(item.priceRials)}</strong>
                        </div>

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
                            categoryTitleFa={item.category?.titleFa ?? 'عمومی'}
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
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell" style={{ padding: '60px 0', textAlign: 'center' }}>
          در حال بارگذاری صفحه جست‌وجو…
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
