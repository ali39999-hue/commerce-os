import {
  resolveProductImage,
  resolveVariant,
  type CategoryDto,
  type Product,
} from './catalog';

export interface ShopProductItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryKey: string;
  price: number; // in Tomans
  originalPrice: number; // in Tomans
  discountPercent: number;
  image: string;
  badge: string;
  inStock: boolean;
  rating: number;
  description?: string;
  variantId?: string;
  sku?: string;
  brandName?: string;
  brandSlug?: string;
}

export interface ShopCategoryOption {
  key: string;
  label: string;
  count?: number;
}

/**
 * تبدیل دسته‌بندی‌های دریافت‌شده از دیتابیس به فهرست فیلترهای فروشگاه
 */
export function toShopCategoryOptions(categories: CategoryDto[]): ShopCategoryOption[] {
  const mapped = categories
    .filter((c) => c.slug !== 'reeskin' && c.slug !== 'reemed')
    .map((c) => ({
      key: c.slug,
      label: c.titleFa,
      count: c.productCount,
    }));
  return [{ key: 'all', label: 'همه دسته‌ها' }, ...mapped];
}

/**
 * نگاشت محصول دریافت‌شده از API بک‌اند به کارت فروشگاهی ShopProductItem
 */
export function mapApiProductToShopItem(product: Product): ShopProductItem {
  const variant = resolveVariant(product);
  const priceRials = BigInt(variant?.priceAmount ?? '0');
  const originalRials = variant?.originalPriceAmount
    ? BigInt(variant.originalPriceAmount)
    : priceRials;

  const priceTomans = Number(priceRials / 10n);
  const originalTomans = Number(originalRials / 10n);

  const computedDiscount =
    typeof variant?.discountPercent === 'number'
      ? variant.discountPercent
      : originalTomans > priceTomans && originalTomans > 0
      ? Math.round(((originalTomans - priceTomans) * 100) / originalTomans)
      : 0;

  return {
    id: product.id,
    slug: product.slug,
    title: product.titleFa || product.title,
    category: product.category?.titleFa || 'مراقبت پوست',
    categoryKey: product.category?.slug || 'skincare',
    price: priceTomans,
    originalPrice: originalTomans > 0 ? originalTomans : priceTomans,
    discountPercent: computedDiscount,
    image: resolveProductImage(product),
    badge:
      product.badge ||
      (computedDiscount > 0 ? `${computedDiscount}٪ تخفیف` : ''),
    inStock: Boolean(variant?.inStock),
    rating: Number(product.ratingValue ?? 4.8),
    description: product.subtitleFa || product.description || undefined,
    variantId: variant?.id,
    sku: variant?.sku,
    brandName: product.brand?.name,
    brandSlug: product.brand?.slug,
  };
}
