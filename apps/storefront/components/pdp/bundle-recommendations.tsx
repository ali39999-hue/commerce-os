'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { SkincareBundleItem } from '../../lib/pdp-types';
import {
  listProducts,
  resolveProductImage,
  resolveVariant,
  type Product,
} from '../../lib/catalog';

interface BundleRecommendationsProps {
  bundleTitle?: string;
  bundleDescription?: string;
  savingsText?: string;
  items?: SkincareBundleItem[];
  catalogProducts?: Product[];
}

interface ResolvedBundleItem extends SkincareBundleItem {
  resolvedProductId?: string;
  resolvedVariantId?: string;
  resolvedSku?: string;
  resolvedSlug: string;
  resolvedImage?: string;
}

const SLUG_TO_CATALOG_MAP: Record<string, { slug: string; sku?: string }> = {
  'carboxygel-professional-therapy': { slug: 'carboxygel', sku: 'CBG-HOME-5X' },
  'carboxypod-activation-pads': { slug: 'carboxypod', sku: 'RMD-CPD-005' },
  'barrier-recovery-cream': { slug: 'avene-cicalfate-plus-cream', sku: 'SKU-AVENE-CICALFATE-40ML' },
  'reemed-cica-barrier-serum': { slug: 'healene', sku: 'DD-HEA-250ML' },
};

const ID_TO_CATALOG_MAP: Record<string, { slug: string; sku?: string }> = {
  bundle_cbg_gel: { slug: 'carboxygel', sku: 'CBG-HOME-5X' },
  bundle_cpd_pod: { slug: 'carboxypod', sku: 'RMD-CPD-005' },
  bundle_cca_serum: { slug: 'avene-cicalfate-plus-cream', sku: 'SKU-AVENE-CICALFATE-40ML' },
  bundle_reemed_cica: { slug: 'healene', sku: 'DD-HEA-250ML' },
};

function resolveBundleItems(
  items: SkincareBundleItem[],
  products: Product[]
): ResolvedBundleItem[] {
  return items
    .map((item): ResolvedBundleItem | null => {
      const mapping = SLUG_TO_CATALOG_MAP[item.slug] || ID_TO_CATALOG_MAP[item.id];
      const matched =
        products.find((p) => p.id === item.id || p.slug === item.slug) ||
        (mapping ? products.find((p) => p.slug === mapping.slug) : undefined);

      if (!matched) {
        return {
          ...item,
          resolvedSlug: item.slug,
        };
      }

      const preferredSkus = mapping?.sku ? [mapping.sku] : undefined;
      const variant = resolveVariant(matched, preferredSkus);
      if (!variant) return null;

      return {
        ...item,
        title: item.title || matched.title,
        brand: matched.brand?.name || item.brand,
        priceAmount: variant.priceAmount,
        originalPriceAmount: variant.originalPriceAmount || item.originalPriceAmount,
        inStock: variant.inStock,
        resolvedProductId: matched.id,
        resolvedVariantId: variant.id,
        resolvedSku: variant.sku,
        resolvedSlug: matched.slug,
        resolvedImage: resolveProductImage(matched),
      };
    })
    .filter((x): x is ResolvedBundleItem => x !== null);
}

export function BundleRecommendations({
  bundleTitle = 'پروتکل کامل درمان (Complete Treatment Regimen)',
  bundleDescription = 'ترکیب محصولات مکمل بر اساس پروتکل کلینیکال جهت تسریع نتایج درمانی با تخفیف ویژه خرید همزمان',
  savingsText = '۱۵٪ تخفیف روی کیت کامل',
  items = [],
  catalogProducts,
}: BundleRecommendationsProps) {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [liveProducts, setLiveProducts] = useState<Product[]>(catalogProducts ?? []);
  const [isResolving, setIsResolving] = useState(!catalogProducts);
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      initial[item.id] = true;
    });
    return initial;
  });
  const [addedBundle, setAddedBundle] = useState(false);

  useEffect(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      setLiveProducts(catalogProducts);
      setIsResolving(false);
      return;
    }
    let mounted = true;
    listProducts({ limit: 100 })
      .then((res) => {
        if (mounted && res?.data) {
          setLiveProducts(res.data);
        }
      })
      .finally(() => {
        if (mounted) setIsResolving(false);
      });
    return () => {
      mounted = false;
    };
  }, [catalogProducts]);

  const resolvedItems = useMemo(
    () => resolveBundleItems(items, liveProducts),
    [items, liveProducts]
  );

  if (!resolvedItems || resolvedItems.length === 0) {
    return null;
  }

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = resolvedItems.filter(
    (i) => selectedItemIds[i.id] !== false && Boolean(i.resolvedVariantId)
  );
  const displaySelected = resolvedItems.filter((i) => selectedItemIds[i.id] !== false);

  const totalBundleRials = displaySelected.reduce(
    (sum, i) => sum + BigInt(i.priceAmount),
    0n
  );

  const totalOriginalRials = displaySelected.reduce(
    (sum, i) => sum + BigInt(i.originalPriceAmount || i.priceAmount),
    0n
  );

  const totalSavingsRials =
    totalOriginalRials > totalBundleRials ? totalOriginalRials - totalBundleRials : 0n;

  const handleAddBundle = () => {
    if (selectedItems.length === 0) return;
    selectedItems.forEach((item) => {
      if (!item.resolvedVariantId || !item.resolvedProductId || !item.resolvedSku) return;
      addItem({
        variantId: item.resolvedVariantId,
        productId: item.resolvedProductId,
        title: item.title,
        sku: item.resolvedSku,
        priceAmount: item.priceAmount,
        image: item.resolvedImage,
      });
    });
    setAddedBundle(true);
    openDrawer();
    setTimeout(() => setAddedBundle(false), 2600);
  };

  return (
    <section className="pdp-bundle-section" aria-label="محصولات مکمل و باندل تخفیف‌دار">
      <div className="pdp-bundle-box">
        <div className="pdp-bundle-header">
          <div className="pdp-bundle-badge-tag">{savingsText}</div>
          <h3>{bundleTitle}</h3>
          <p className="pdp-bundle-desc">{bundleDescription}</p>
        </div>

        <div className="pdp-bundle-items-row">
          {resolvedItems.map((item, idx) => {
            const isChecked = selectedItemIds[item.id] !== false;
            return (
              <React.Fragment key={item.id}>
                {idx > 0 && <span className="pdp-bundle-plus" aria-hidden="true">+</span>}
                <div className={`pdp-bundle-card ${isChecked ? 'selected' : 'unselected'}`}>
                  <label className="pdp-bundle-check-wrap">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item.id)}
                      aria-label={`انتخاب ${item.title}`}
                    />
                    <span className="pdp-bundle-role-tag">{item.roleInRoutine}</span>
                  </label>

                  <div className="pdp-bundle-info">
                    <span className="pdp-bundle-brand">{item.brand}</span>
                    <h4 className="pdp-bundle-item-title">
                      <Link href={`/products/${encodeURIComponent(item.resolvedSlug)}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <span className="pdp-bundle-sub">{item.subtitle}</span>
                    <div className="pdp-bundle-price-wrap">
                      <strong className="pdp-bundle-price">{formatToman(item.priceAmount)}</strong>
                      {item.discountBadge && (
                        <span className="pdp-bundle-disc-badge">{item.discountBadge}</span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="pdp-bundle-footer-action">
          <div className="pdp-bundle-totals">
            <div className="pdp-bundle-total-row">
              <span>قیمت نهایی کیت ({displaySelected.length} قلم):</span>
              <strong className="bundle-total-price">{formatToman(totalBundleRials)}</strong>
            </div>
            {totalSavingsRials > 0n && (
              <div className="pdp-bundle-saving-row">
                <span>سود شما از این خرید: </span>
                <span className="saving-value">{formatToman(totalSavingsRials)}</span>
              </div>
            )}
          </div>

          <div className="pdp-bundle-cta-group">
            <button
              type="button"
              onClick={handleAddBundle}
              disabled={isResolving || selectedItems.length === 0}
              className={`pdp-bundle-add-btn ${addedBundle ? 'btn-added' : ''}`}
            >
              {addedBundle
                ? '✓ کیت به سبد خرید اضافه شد'
                : isResolving
                  ? 'در حال استعلام قیمت کاتالوگ...'
                  : 'افزودن کل پکیج با ۱۵٪ تخفیف'}
            </button>
            {addedBundle && (
              <Link href="/cart" className="pdp-bundle-go-cart">
                تکمیل سفارش و پرداخت ←
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
