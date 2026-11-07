'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiBase, listProducts, type Product } from '../../lib/catalog';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { WishlistButton } from '../../components/discovery/wishlist-button';
import { CompareButton } from '../../components/discovery/compare-button';
import { trackSearch, trackViewItemList } from '../../lib/analytics';
import {
  RECOMMENDED_CLINICAL_PRODUCTS,
  getCanonicalProductHref,
  type CuratedProductItem,
} from '../../lib/clinical-specs';

interface SearchItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: { slug: string; titleFa: string } | null;
  brand?: { slug: string; name: string } | null;
  skinConcern?: string | null;
  skinConcerns?: string[];
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
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
];

const BRAND_FACETS = [
  { slug: 'reeskin', name: 'ReeSkin Clinical' },
  { slug: 'reemed', name: 'ReeMed Medical Pro' },
];

const CONCERN_FACETS = [
  { slug: 'acne-blemish', label: 'آکنه و لک' },
  { slug: 'anti-aging-lifting', label: 'ضدچروک و لیفتینگ' },
  { slug: 'barrier-dryness', label: 'سد دفاعی و خشکی' },
  { slug: 'scar-recovery', label: 'ترمیم اسکار' },
];

const FORMULATION_FACETS = [
  { slug: 'carboxy-gel', label: 'ژل کربوکسی' },
  { slug: 'activation-pods', label: 'پادهای فعال‌ساز' },
  { slug: 'alkaline-pad', label: 'پد آلکالاین' },
  { slug: 'polish-paste', label: 'خمیر پولیش' },
  { slug: 'soothing-gel', label: 'ژل تسکین‌بخش' },
  { slug: 'detox-scrub', label: 'اسکراب دتوکس' },
];

const CATEGORY_FACETS = [
  { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
  { slug: 'consumables', titleFa: 'ملزومات و پدهای مصرفی' },
];

const PRODUCT_TYPE_FACETS = [
  { slug: 'physical', label: 'کالای فیزیکی و کلینیکال' },
  { slug: 'bundle', label: 'کیت و پروتکل کامل (Bundle)' },
  { slug: 'digital', label: 'آموزش و هندبوک دیجیتال' },
];

// Persian & English synonym dictionary
const SYNONYMS_MAP: Record<string, string[]> = {
  کربوکسی: ['carboxy', 'carboxygel', 'کربوکسی‌ژل', 'بوهر', 'bohr', 'co2'],
  carboxy: ['کربوکسی', 'carboxygel', 'بوهر', 'co2', 'اکسیژن'],
  carboxygel: ['کربوکسی', 'carboxy', 'ژل کربوکسی', 'bohr effect'],
  بوهر: ['bohr', 'کربوکسی', 'اکسیژن', 'co2'],
  پاد: ['pad', 'carboxypod', 'پد', 'اکتیواتور', 'سیتریک اسید'],
  carboxypod: ['پاد', 'پد', 'pad', 'فعال ساز', 'سیتریک'],
  هیلین: ['healene', 'تسکین', 'سوتینگ', 'آرام‌بخش', 'التیام'],
  healene: ['هیلین', 'تسکین', 'سوتینگ', 'پانتنول'],
  کریستالین: ['crystalene', 'پولیش', 'لایه‌بردار', 'آلومینا', 'میکرودرم'],
  crystalene: ['کریستالین', 'پولیش', 'paste', 'لایه‌بردار'],
  سیلیکالین: ['silicalene', 'دتوکس', 'اسکراب', 'سیلیکا', 'منافذ'],
  silicalene: ['سیلیکالین', 'اسکراب', 'scrub', 'detox'],
  ری‌اسکین: ['reeskin', 'درمر', 'dermer'],
  reeskin: ['ری‌اسکین', 'درمر', 'dermer'],
  ری‌مد: ['reemed', 'درمر', 'dermer'],
  reemed: ['ری‌مد', 'درمر', 'dermer'],
  پد: ['pad', 'carboxypad', 'پاد', 'ماسک', 'آلکالاین'],
  آکنه: ['acne', 'جوش', 'اسکار', 'scar', 'منافذ', 'لک'],
  چروک: ['anti-aging', 'aging', 'خطوط', 'لیفت', 'lift', 'جوانسازی'],
  بریر: ['barrier', 'سد دفاعی', 'ترمیم', 'سرامید', 'cica', 'سیکا', 'خشکی'],
  اسکار: ['scar', 'ترمیم اسکار', 'جای جوش', 'زخم'],
};

const SUGGESTED_QUICK_SEARCHES = [
  'کربوکسی ژل CarboxyGel',
  'پدهای فعال‌ساز CarboxyPod',
  'پدهای آناتومیک CarboxyPad',
  'ژل تسکین‌بخش هیلین Healene',
  'خمیر پولیش کریستالین Crystalene',
  'اسکراب دتوکس سیلیکالین Silicalene',
];

const EMPTY_FACETS: SearchFacets = {
  categories: CATEGORY_FACETS,
  brands: BRAND_FACETS,
  concerns: CONCERN_FACETS,
  formulations: FORMULATION_FACETS,
  inStockTotal: 0,
};

const SEARCH_PAGE_SIZE = 24;
const SEARCH_FETCH_TIMEOUT_MS = 3500;
const SEARCH_DEBOUNCE_MS = 250;

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
  const slug = typeof raw.slug === 'string' ? raw.slug.toLowerCase() : '';
  const title = typeof raw.title === 'string' ? raw.title : '';

  let brandObj: { slug: string; name: string } | null = null;
  if (brandRaw && typeof brandRaw === 'object') {
    const bSlug = String(brandRaw.slug || '').toLowerCase();
    const bName = String(brandRaw.name || '');
    if (bSlug.includes('reemed') || bName.includes('ReeMed') || bName.includes('ری‌مد')) {
      brandObj = { slug: 'reemed', name: 'ReeMed Medical Pro' };
    } else {
      brandObj = { slug: 'reeskin', name: 'ReeSkin Clinical' };
    }
  }

  if (!brandObj) {
    if (
      slug.includes('reemed') ||
      title.includes('ری‌مد') ||
      (slug.includes('carbox') && !slug.includes('carboxygel') && !slug.includes('carboxypod') && !slug.includes('carboxypad')) ||
      slug.includes('plasmax') ||
      slug.includes('pod') ||
      title.includes('پاد')
    ) {
      brandObj = { slug: 'reemed', name: 'ReeMed Medical Pro' };
    } else {
      brandObj = { slug: 'reeskin', name: 'ReeSkin Clinical' };
    }
  }

  // Category mapping (Dr Dermer 1:1 categories: skincare, consumables, clinical-equipment)
  let categoryObj: { slug: string; titleFa: string } | null = null;
  if (categoryRaw && typeof categoryRaw === 'object') {
    const catSlug = typeof categoryRaw.slug === 'string' ? categoryRaw.slug : '';
    if (catSlug === 'consumables' || catSlug === 'پد' || catSlug === 'ملزومات') {
      categoryObj = { slug: 'consumables', titleFa: 'ملزومات و پدهای مصرفی' };
    } else if (catSlug === 'skincare') {
      categoryObj = { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' };
    }
  }
  if (!categoryObj) {
    if (
      slug.includes('pod') ||
      slug.includes('pad') ||
      title.includes('پد') ||
      title.includes('پاد')
    ) {
      categoryObj = { slug: 'consumables', titleFa: 'ملزومات و پدهای مصرفی' };
    } else {
      categoryObj = { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' };
    }
  }

  // Formulation mapping
  // Formulations: ژل کربوکسی، پادهای فعال‌ساز، پد آلکالاین، خمیر پولیش، ژل تسکین‌بخش، اسکراب دتوکس
  let formulation: string | null = null;
  if (slug.includes('carboxypod') || (slug.includes('pod') && !slug.includes('carbox')) || title.includes('پاد')) {
    formulation = 'activation-pods';
  } else if (slug.includes('carboxypad') || (slug.includes('pad') && !slug.includes('carboxypod')) || title.includes('پد آلکالاین')) {
    formulation = 'alkaline-pad';
  } else if (slug.includes('crystalene') || slug.includes('polish') || title.includes('کریستالین') || title.includes('پولیش')) {
    formulation = 'polish-paste';
  } else if (slug.includes('healene') || slug.includes('soothing') || title.includes('هیلین') || title.includes('تسکین‌بخش')) {
    formulation = 'soothing-gel';
  } else if (slug.includes('silicalene') || slug.includes('scrub') || title.includes('سیلیکالین') || title.includes('اسکراب')) {
    formulation = 'detox-scrub';
  } else {
    formulation = 'carboxy-gel';
  }

  // Skin Concerns mapping:
  // Concerns: آکنه و لک (acne-blemish), ضدچروک و لیفتینگ (anti-aging-lifting), سد دفاعی و خشکی (barrier-dryness), ترمیم اسکار (scar-recovery)
  const concernsList: string[] = [];
  if (slug.includes('carboxy') || title.includes('کربوکسی')) {
    concernsList.push('anti-aging-lifting', 'acne-blemish', 'scar-recovery');
  }
  if (slug.includes('pod') || title.includes('پاد')) {
    concernsList.push('acne-blemish', 'scar-recovery');
  }
  if (slug.includes('pad') || title.includes('پد')) {
    concernsList.push('anti-aging-lifting', 'barrier-dryness');
  }
  if (slug.includes('crystalene') || title.includes('کریستالین') || title.includes('پولیش')) {
    concernsList.push('acne-blemish', 'anti-aging-lifting');
  }
  if (slug.includes('healene') || title.includes('هیلین') || title.includes('تسکین') || title.includes('التیام')) {
    concernsList.push('barrier-dryness', 'scar-recovery');
  }
  if (slug.includes('silicalene') || title.includes('سیلیکالین') || title.includes('اسکراب')) {
    concernsList.push('acne-blemish');
  }
  if (title.includes('لک') || title.includes('آکنه') || title.includes('جوش') || title.includes('منافذ')) {
    if (!concernsList.includes('acne-blemish')) concernsList.push('acne-blemish');
  }
  if (title.includes('چروک') || title.includes('لیفت') || title.includes('جوانسازی')) {
    if (!concernsList.includes('anti-aging-lifting')) concernsList.push('anti-aging-lifting');
  }
  if (title.includes('بریر') || title.includes('خشکی') || title.includes('سد دفاعی') || title.includes('سیکا')) {
    if (!concernsList.includes('barrier-dryness')) concernsList.push('barrier-dryness');
  }
  if (title.includes('اسکار') || title.includes('زخم') || title.includes('ترمیم')) {
    if (!concernsList.includes('scar-recovery')) concernsList.push('scar-recovery');
  }

  const primaryConcern = concernsList[0] || 'anti-aging-lifting';

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
    category: categoryObj,
    brand: brandObj,
    skinConcern: primaryConcern,
    skinConcerns: concernsList,
    productType,
    formulation,
    priceRials,
    priceTomans: toRialsString(raw.priceTomans) || rialsToTomansString(priceRials),
    inStock: raw.inStock === true,
    availableQty: typeof raw.availableQty === 'number' ? raw.availableQty : 20,
    sku: typeof raw.sku === 'string' ? raw.sku : null,
    variantId: typeof raw.variantId === 'string' ? raw.variantId : null,
    popularityScore: slug.includes('carboxy') ? 98 : slug.includes('healene') ? 94 : 85,
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

function curatedToSearchItem(item: CuratedProductItem): SearchItem {
  return normalizeSearchItem({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    priceRials: item.priceAmount,
    priceTomans: rialsToTomansString(item.priceAmount),
    inStock: item.inStock,
    sku: item.sku,
    variantId: item.id,
    category: {
      slug: item.slug.includes('pod') || item.slug.includes('pad') ? 'consumables' : 'skincare',
      titleFa: item.categoryTitleFa,
    },
    brand: {
      slug: item.brand.toLowerCase().includes('reemed') ? 'reemed' : 'reeskin',
      name: item.brand.toLowerCase().includes('reemed') ? 'ReeMed Medical Pro' : 'ReeSkin Clinical',
    },
    formulation: item.formulation,
    skinConcern: item.concern,
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
    if (concern !== '') {
      const matchesConcern =
        item.skinConcern === concern ||
        (item.skinConcerns && item.skinConcerns.includes(concern)) ||
        (concern === 'acne-blemish' && item.skinConcern === 'acne') ||
        (concern === 'anti-aging-lifting' && item.skinConcern === 'anti-aging') ||
        (concern === 'barrier-dryness' && item.skinConcern === 'barrier') ||
        (concern === 'scar-recovery' && item.skinConcern === 'scars');
      if (!matchesConcern) return false;
    }
    if (type !== '' && item.productType !== type) return false;
    if (formulation !== '') {
      const matchesFormulation =
        item.formulation === formulation ||
        (formulation === 'carboxy-gel' && (item.formulation === 'gel' || item.formulation === 'carboxy-gel')) ||
        (formulation === 'activation-pods' && (item.formulation === 'pads' || item.formulation === 'activation-pods')) ||
        (formulation === 'soothing-gel' && (item.formulation === 'gel' || item.formulation === 'soothing-gel'));
      if (!matchesFormulation) return false;
    }
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
  const { formatToman } = useLocalizedFormatter();

  const filters = useMemo(() => readFilters(new URLSearchParams(serialized)), [serialized]);

  const [queryInput, setQueryInput] = useState(filters.q);
  const [minInput, setMinInput] = useState(filters.min);
  const [maxInput, setMaxInput] = useState(filters.max);
  const [priceSliderVal, setPriceSliderVal] = useState<number>(
    filters.max ? Number(filters.max) || 6000000 : 6000000
  );
  const [result, setResult] = useState<SearchState | null>(null);
  const [loading, setLoading] = useState(true);

  // View Mode: grid vs list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Collapsible Facet Sections (desktop & drawer)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    category: false,
    brand: false,
    concern: false,
    formulation: false,
    stock: false,
    price: false,
    type: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
    if (filters.max) {
      setPriceSliderVal(Number(filters.max) || 6000000);
    }
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
          const combinedItems =
            rawItems.length > 0 ? rawItems : RECOMMENDED_CLINICAL_PRODUCTS.map(curatedToSearchItem);
          const filtered = applyLocalFilters(combinedItems, sp);
          setResult({
            source: 'api',
            items: filtered,
            total: filtered.length,
            facets: {
              categories: CATEGORY_FACETS,
              brands: BRAND_FACETS,
              concerns: CONCERN_FACETS,
              formulations: FORMULATION_FACETS,
              inStockTotal: combinedItems.filter((item) => item.inStock).length,
            },
          });
          if (filters.q) {
            trackSearch(filters.q, filtered.length);
          }
          trackViewItemList(
            filters.category || 'all-products',
            filters.category || 'کاتالوگ محصولات',
            filtered.map((it) => ({
              item_id: it.id,
              item_name: it.title,
              item_brand: it.brand?.name,
              item_category: it.category?.titleFa,
              price: Number(it.priceRials) || 0,
              currency: 'IRR',
            }))
          );
        } catch {
          if (cancelled) return;
          const catalog = await listProducts();
          if (cancelled) return;
          const mappedCatalog = (catalog?.data ?? []).map(productToSearchItem);
          const curatedItems = RECOMMENDED_CLINICAL_PRODUCTS.map(curatedToSearchItem);
          const allPool = [...curatedItems, ...mappedCatalog.filter((c) => !curatedItems.some((m) => m.slug === c.slug))];
          const filtered = applyLocalFilters(allPool, sp).slice(0, SEARCH_PAGE_SIZE);
          setResult({
            source: 'fallback',
            items: filtered,
            total: filtered.length,
            facets: {
              categories: CATEGORY_FACETS,
              brands: BRAND_FACETS,
              concerns: CONCERN_FACETS,
              formulations: FORMULATION_FACETS,
              inStockTotal: allPool.filter((item) => item.inStock).length,
            },
          });
          if (filters.q) {
            trackSearch(filters.q, filtered.length);
          }
          trackViewItemList(
            filters.category || 'all-products',
            filters.category || 'کاتالوگ محصولات',
            filtered.map((it) => ({
              item_id: it.id,
              item_name: it.title,
              item_brand: it.brand?.name,
              item_category: it.category?.titleFa,
              price: Number(it.priceRials) || 0,
              currency: 'IRR',
            }))
          );
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

  // Active filters list for chips
  const activeChips = useMemo(() => {
    const list: Array<{ id: string; label: string; onRemove: () => void }> = [];
    if (filters.q) {
      list.push({
        id: 'q',
        label: `عبارت: «${filters.q}»`,
        onRemove: () => {
          setQueryInput('');
          navigate({ ...filters, q: '' });
        },
      });
    }
    if (filters.category) {
      const catObj = CATEGORY_FACETS.find((c) => c.slug === filters.category);
      list.push({
        id: 'category',
        label: `دسته: ${catObj ? catObj.titleFa : filters.category}`,
        onRemove: () => navigate({ ...filters, category: '' }),
      });
    }
    if (filters.brand) {
      const bObj = BRAND_FACETS.find((b) => b.slug === filters.brand);
      list.push({
        id: 'brand',
        label: `برند: ${bObj ? bObj.name : filters.brand}`,
        onRemove: () => navigate({ ...filters, brand: '' }),
      });
    }
    if (filters.concern) {
      const cObj = CONCERN_FACETS.find((c) => c.slug === filters.concern);
      list.push({
        id: 'concern',
        label: `دغدغه: ${cObj ? cObj.label : filters.concern}`,
        onRemove: () => navigate({ ...filters, concern: '' }),
      });
    }
    if (filters.formulation) {
      const fObj = FORMULATION_FACETS.find((f) => f.slug === filters.formulation);
      list.push({
        id: 'formulation',
        label: `فرمولاسیون: ${fObj ? fObj.label : filters.formulation}`,
        onRemove: () => navigate({ ...filters, formulation: '' }),
      });
    }
    if (filters.type) {
      const tObj = PRODUCT_TYPE_FACETS.find((t) => t.slug === filters.type);
      list.push({
        id: 'type',
        label: `نوع: ${tObj ? tObj.label : filters.type}`,
        onRemove: () => navigate({ ...filters, type: '' }),
      });
    }
    if (filters.stock) {
      list.push({
        id: 'stock',
        label: 'فقط کالاهای موجود',
        onRemove: () => navigate({ ...filters, stock: false }),
      });
    }
    if (filters.min || filters.max) {
      const minTxt = filters.min ? `${new Intl.NumberFormat('fa-IR').format(Number(filters.min))} تومان` : '۰';
      const maxTxt = filters.max ? `${new Intl.NumberFormat('fa-IR').format(Number(filters.max))} تومان` : 'بی‌نهایت';
      list.push({
        id: 'price',
        label: `قیمت: از ${minTxt} تا ${maxTxt}`,
        onRemove: () => {
          setMinInput('');
          setMaxInput('');
          navigate({ ...filters, min: '', max: '' });
        },
      });
    }
    return list;
  }, [filters, navigate]);

  const activeFiltersCount = activeChips.length;

  const renderFilterControls = () => (
    <>
      {/* 0. Category facet (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('category')}
          aria-expanded={!collapsedSections.category}
        >
          <span>دسته‌بندی بالینی و تخصصی</span>
          <span className={`facet-accordion-chevron ${collapsedSections.category ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.category && (
          <div className="facet-accordion-body">
            <label className="filter-option">
              <input
                type="radio"
                name="search-category"
                checked={filters.category === ''}
                onChange={() => navigate({ ...filters, category: '' })}
              />
              همه دسته‌ها
            </label>
            {facets.categories.map((c) => (
              <label className="filter-option" key={c.slug}>
                <input
                  type="radio"
                  name="search-category"
                  checked={filters.category === c.slug}
                  onChange={() => navigate({ ...filters, category: c.slug })}
                />
                {c.titleFa}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 1. Brand facet (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('brand')}
          aria-expanded={!collapsedSections.brand}
        >
          <span>برند محصول (Brand)</span>
          <span className={`facet-accordion-chevron ${collapsedSections.brand ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.brand && (
          <div className="facet-accordion-body">
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
        )}
      </div>

      {/* 2. Skin Concern facet (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('concern')}
          aria-expanded={!collapsedSections.concern}
        >
          <span>دغدغه پوستی و درمانی</span>
          <span className={`facet-accordion-chevron ${collapsedSections.concern ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.concern && (
          <div className="facet-accordion-body">
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
        )}
      </div>

      {/* 3. Formulation facet (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('formulation')}
          aria-expanded={!collapsedSections.formulation}
        >
          <span>نوع فرمولاسیون (بافت کالا)</span>
          <span className={`facet-accordion-chevron ${collapsedSections.formulation ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.formulation && (
          <div className="facet-accordion-body">
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
        )}
      </div>

      {/* 4. In-Stock Availability (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('stock')}
          aria-expanded={!collapsedSections.stock}
        >
          <span>وضعیت موجودی کالا</span>
          <span className={`facet-accordion-chevron ${collapsedSections.stock ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.stock && (
          <div className="facet-accordion-body">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.stock}
                onChange={(e) => navigate({ ...filters, stock: e.target.checked })}
              />
              فقط کالاهای موجود در انبار مرکزی
            </label>
          </div>
        )}
      </div>

      {/* 5. Price Range with Inputs & Slider (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('price')}
          aria-expanded={!collapsedSections.price}
        >
          <span>محدوده قیمت (تومان)</span>
          <span className={`facet-accordion-chevron ${collapsedSections.price ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.price && (
          <div className="facet-accordion-body">
            <div className="filter-price-row">
              <input
                type="number"
                min={0}
                className="input-text"
                placeholder="از (تومان)"
                aria-label="حداقل قیمت به تومان"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
              />
              <input
                type="number"
                min={0}
                className="input-text"
                placeholder="تا (تومان)"
                aria-label="حداکثر قیمت به تومان"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '8px' }}>
              <label htmlFor="search-budget-slider" style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                حداکثر سقف بودجه: {new Intl.NumberFormat('fa-IR').format(priceSliderVal)} تومان
              </label>
              <input
                id="search-budget-slider"
                type="range"
                min={500000}
                max={8000000}
                step={250000}
                value={priceSliderVal}
                aria-label={`حداکثر سقف بودجه: ${new Intl.NumberFormat('fa-IR').format(priceSliderVal)} تومان`}
                style={{ width: '100%', accentColor: 'var(--brand)' }}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceSliderVal(val);
                  setMaxInput(String(val));
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. Product Type (collapsible) */}
      <div className="facet-accordion-item">
        <button
          type="button"
          className="facet-accordion-trigger"
          onClick={() => toggleSection('type')}
          aria-expanded={!collapsedSections.type}
        >
          <span>نوع ارائه و بسته‌بندی</span>
          <span className={`facet-accordion-chevron ${collapsedSections.type ? '' : 'open'}`}>▼</span>
        </button>
        {!collapsedSections.type && (
          <div className="facet-accordion-body">
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
        )}
      </div>

      {/* Clear Filters CTA */}
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
      {/* 1. Header and Quick Search Autocomplete Bar */}
      <div className="search-hero-bar">
        <div className="search-hero-content">
          <h1>کاتالوگ و کاوش تخصصی محصولات</h1>
          <p>
            جست‌وجوی پیشرفته در میان محصولات کربوکسی‌تراپی، لاین‌های بالینی ReeSkin و ReeMed، فرمولاسیون‌های
            پپتیدی و تجهیزات مراقبت پوست با استانداردهای درموسوتیکال انگلستان.
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
              placeholder="جست‌وجوی کربوکسی، رتینول، سد دفاعی، پپتید، نام لاتین (Carboxy, Retinol, ReeSkin)..."
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

      {/* 2. Mobile Filters Drawer Trigger & Toolbar Row */}
      <div className="search-mobile-bar-row">
        <button
          type="button"
          className="search-open-drawer-btn"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-expanded={isMobileDrawerOpen}
          aria-controls="mobile-filter-drawer"
        >
          <span aria-hidden="true">⚙️</span>
          <span>فیلتر و دسته‌بندی</span>
          {activeFiltersCount > 0 && (
            <span className="filter-badge-count">{activeFiltersCount}</span>
          )}
        </button>

        {/* View Mode Toggle (Grid vs List) */}
        <div className="search-view-mode-toggle" aria-label="تغییر نحوه نمایش کالاها">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
          >
            <span>⊞</span>
            <span>شبکه‌ای</span>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
          >
            <span>☰</span>
            <span>لیستی</span>
          </button>
        </div>

        {/* Sort Dropdown */}
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

      {/* 3. Main Layout: Desktop Sidebar + Search Results */}
      <section className="search-layout">
        {/* Desktop Multi-Facet Sidebar with Collapsible Accordions */}
        <aside className="search-sidebar" aria-label="فیلترهای کاتالوگ و محصولات">
          <div className="sidebar-header-row">
            <h3>فیلترهای پیشرفته</h3>
            {activeFiltersCount > 0 && (
              <span className="sidebar-active-tag">{activeFiltersCount} فیلتر فعال</span>
            )}
          </div>

          {renderFilterControls()}
        </aside>

        {/* Mobile Slide-Up Drawer with Floating Bottom Apply Button */}
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
                <h3>فیلتر و پالایش کاتالوگ</h3>
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
                  مشاهده نتایج ({totalLabel} کالا)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Stream Area */}
        <div className="search-results">
          {/* Active Filter Chips / Badges */}
          {activeChips.length > 0 && (
            <div className="active-filters-bar" aria-label="فیلترهای اعمال‌شده">
              <span className="active-filters-title">فیلترهای فعال:</span>
              {activeChips.map((chip) => (
                <span className="filter-chip" key={chip.id}>
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={chip.onRemove}
                    aria-label={`حذف فیلتر ${chip.label}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="filter-clear-all-chip"
                onClick={() => router.push('/search')}
              >
                پاک‌کردن همه
              </button>
            </div>
          )}

          {/* Header Count & Status */}
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
            <div className={`product-grid ${viewMode === 'list' ? 'view-list' : ''}`} aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="rail-skeleton" />
              ))}
            </div>
          ) : items.length === 0 ? (
            /* Empty State with Curated Clinical Recommendations */
            <div className="search-empty-container" role="status">
              <div className="search-empty-icon" aria-hidden="true">🔍</div>
              <h3>کالایی با فیلترهای انتخابی یافت نشد</h3>
              <p>
                می‌توانید عبارات عمومی‌تر مانند «کربوکسی»، «سرم» یا «سد دفاعی» را جست‌وجو نموده یا فیلترهای اعمال‌شده را ریست کنید.
              </p>
              <button
                type="button"
                className="btn-clear-filters"
                style={{ margin: '0 auto', display: 'inline-block' }}
                onClick={() => router.push('/search')}
              >
                پاک‌سازی همه فیلترها
              </button>

              <div className="empty-recommendations-section">
                <h4 className="empty-recommendations-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', marginLeft: '6px' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>پیشنهادات پرطرفدار کلینیکال برای شما</span>
                </h4>
                <div className="empty-recommendations-grid">
                  {RECOMMENDED_CLINICAL_PRODUCTS.map((rec) => {
                    const recHref = getCanonicalProductHref(rec.slug);
                    return (
                      <article className="product-card" key={rec.id}>
                        <Link className="product-art" href={recHref} tabIndex={-1} aria-hidden="true">
                          <span className="art-index">{rec.title.slice(0, 1)}</span>
                          <span className="art-caption">✓ موجود در انبار</span>
                        </Link>
                        <div className="product-copy">
                          <span className="product-card-brand">{rec.brand}</span>
                          <h3>
                            <Link href={recHref}>{rec.title}</Link>
                          </h3>
                          <p>{rec.description}</p>
                          <div className="product-bottom">
                            <strong className="product-card-toman">{formatToman(rec.priceAmount)}</strong>
                            <div className="rail-actions">
                              <WishlistButton
                                variantId={rec.id}
                                productId={rec.id}
                                slug={rec.slug}
                                title={rec.title}
                                sku={rec.sku}
                                priceAmount={rec.priceAmount}
                              />
                              <CompareButton
                                variantId={rec.id}
                                productId={rec.id}
                                slug={rec.slug}
                                title={rec.title}
                                sku={rec.sku}
                                priceAmount={rec.priceAmount}
                                inStock={rec.inStock}
                                categoryTitleFa={rec.categoryTitleFa}
                              />
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Product Cards (Grid or List View) */
            <div className={`product-grid ${viewMode === 'list' ? 'view-list' : ''}`}>
              {items.map((item) => {
                const href = getCanonicalProductHref(item.slug);
                const variantId = item.variantId ?? item.id;
                return (
                  <article className="product-card" key={item.id}>
                    <Link className="product-art" href={href} tabIndex={-1} aria-hidden="true">
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
