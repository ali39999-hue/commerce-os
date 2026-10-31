/**
 * مقایسه کالاها (Compare) — لایه ذخیره‌سازی محلی مرورگر.
 * همان الگوی علاقه‌مندی‌ها: توابع خالص بدون React، با این تفاوت که
 * حداکثر ۴ کالا قابل مقایسه است و رویداد COMPARE_CHANGED_EVENT منتشر می‌شود.
 */

export interface CompareItem {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  sku: string;
  priceAmount: string;
  inStock: boolean;
  categoryTitleFa: string | null;
}

/** ورودی اختیاری؛ فیلدهای وضعیت موجودی/دسته در صورت نبود مقدار پیش‌فرض می‌گیرند. */
export type CompareItemInput = Omit<CompareItem, 'inStock' | 'categoryTitleFa'> &
  Partial<Pick<CompareItem, 'inStock' | 'categoryTitleFa'>>;

export interface CompareMutationResult {
  ok: boolean;
  reason?: 'max';
  active: boolean;
}

export const COMPARE_STORAGE_KEY = 'commerce_os.compare.v1';
export const COMPARE_CHANGED_EVENT = 'commerce-os:compare-changed';
export const COMPARE_MAX_ITEMS = 4;

function normalizeEntry(entry: unknown): CompareItem | null {
  if (typeof entry !== 'object' || entry === null) return null;
  const record = entry as Record<string, unknown>;
  if (typeof record.variantId !== 'string' || typeof record.title !== 'string') return null;
  return {
    variantId: record.variantId,
    productId: typeof record.productId === 'string' ? record.productId : record.variantId,
    slug: typeof record.slug === 'string' ? record.slug : '',
    title: record.title,
    sku: typeof record.sku === 'string' ? record.sku : '',
    priceAmount: typeof record.priceAmount === 'string' ? record.priceAmount : '0',
    inStock: record.inStock === true,
    categoryTitleFa: typeof record.categoryTitleFa === 'string' ? record.categoryTitleFa : null,
  };
}

function readStore(): CompareItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const items: CompareItem[] = [];
    for (const entry of parsed) {
      const normalized = normalizeEntry(entry);
      if (normalized) items.push(normalized);
    }
    return items;
  } catch {
    return [];
  }
}

function writeStore(items: CompareItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // خطای سهمیه ذخیره‌سازی یا حالت ناشناس مرورگر؛ نادیده گرفته می‌شود.
  }
  window.dispatchEvent(new CustomEvent(COMPARE_CHANGED_EVENT));
}

export function getCompare(): CompareItem[] {
  return readStore();
}

export function isComparing(variantId: string): boolean {
  return readStore().some((item) => item.variantId === variantId);
}

export function addToCompare(item: CompareItemInput): CompareMutationResult {
  const items = readStore();
  if (items.some((existing) => existing.variantId === item.variantId)) {
    return { ok: true, active: true };
  }
  if (items.length >= COMPARE_MAX_ITEMS) {
    return { ok: false, reason: 'max', active: false };
  }
  writeStore([
    ...items,
    {
      variantId: item.variantId,
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      sku: item.sku,
      priceAmount: item.priceAmount,
      inStock: item.inStock ?? false,
      categoryTitleFa: item.categoryTitleFa ?? null,
    },
  ]);
  return { ok: true, active: true };
}

export function removeFromCompare(variantId: string): CompareMutationResult {
  const items = readStore();
  if (!items.some((existing) => existing.variantId === variantId)) {
    return { ok: true, active: false };
  }
  writeStore(items.filter((existing) => existing.variantId !== variantId));
  return { ok: true, active: false };
}

export function toggleCompare(item: CompareItemInput): CompareMutationResult {
  if (isComparing(item.variantId)) return removeFromCompare(item.variantId);
  return addToCompare(item);
}
