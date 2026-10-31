/**
 * علاقه‌مندی‌ها (Wishlist) — لایه ذخیره‌سازی محلی مرورگر.
 * توابع خالص و بدون وابستگی به React؛ پس از هر تغییر، رویداد سفارشی
 * WISHLIST_CHANGED_EVENT روی window منتشر می‌شود تا هدر، دکمه‌ها و
 * صفحه علاقه‌مندی‌ها بدون رفرش همگام بمانند.
 */

export interface WishlistItem {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  sku: string;
  priceAmount: string;
}

export interface WishlistMutationResult {
  ok: boolean;
  reason?: 'max';
  active: boolean;
}

export const WISHLIST_STORAGE_KEY = 'commerce_os.wishlist.v1';
export const WISHLIST_CHANGED_EVENT = 'commerce-os:wishlist-changed';
export const WISHLIST_MAX_ITEMS = 50;

function readStore(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const items: WishlistItem[] = [];
    for (const entry of parsed) {
      if (typeof entry !== 'object' || entry === null) continue;
      const record = entry as Record<string, unknown>;
      if (typeof record.variantId !== 'string' || typeof record.title !== 'string') continue;
      items.push({
        variantId: record.variantId,
        productId: typeof record.productId === 'string' ? record.productId : record.variantId,
        slug: typeof record.slug === 'string' ? record.slug : '',
        title: record.title,
        sku: typeof record.sku === 'string' ? record.sku : '',
        priceAmount: typeof record.priceAmount === 'string' ? record.priceAmount : '0',
      });
    }
    return items;
  } catch {
    return [];
  }
}

function writeStore(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // خطای سهمیه ذخیره‌سازی یا حالت ناشناس مرورگر؛ نادیده گرفته می‌شود.
  }
  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGED_EVENT));
}

export function getWishlist(): WishlistItem[] {
  return readStore();
}

export function isWishlisted(variantId: string): boolean {
  return readStore().some((item) => item.variantId === variantId);
}

export function addToWishlist(item: WishlistItem): WishlistMutationResult {
  const items = readStore();
  if (items.some((existing) => existing.variantId === item.variantId)) {
    return { ok: true, active: true };
  }
  if (items.length >= WISHLIST_MAX_ITEMS) {
    return { ok: false, reason: 'max', active: false };
  }
  writeStore([...items, item]);
  return { ok: true, active: true };
}

export function removeFromWishlist(variantId: string): WishlistMutationResult {
  const items = readStore();
  if (!items.some((existing) => existing.variantId === variantId)) {
    return { ok: true, active: false };
  }
  writeStore(items.filter((existing) => existing.variantId !== variantId));
  return { ok: true, active: false };
}

export function toggleWishlist(item: WishlistItem): WishlistMutationResult {
  if (isWishlisted(item.variantId)) return removeFromWishlist(item.variantId);
  return addToWishlist(item);
}
