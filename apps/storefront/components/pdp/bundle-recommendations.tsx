'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { SkincareBundleItem } from '../../lib/pdp-types';

interface BundleRecommendationsProps {
  bundleTitle?: string;
  bundleDescription?: string;
  savingsText?: string;
  items?: SkincareBundleItem[];
}

export function BundleRecommendations({
  bundleTitle = 'پروتکل کامل درمان (Complete Treatment Regimen)',
  bundleDescription = 'ترکیب محصولات مکمل بر اساس پروتکل کلینیکال جهت تسریع نتایج درمانی با تخفیف ویژه خرید همزمان',
  savingsText = '۱۵٪ تخفیف روی کیت کامل',
  items = [],
}: BundleRecommendationsProps) {
  const { addItem } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      initial[item.id] = true;
    });
    return initial;
  });
  const [addedBundle, setAddedBundle] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = items.filter((i) => selectedItemIds[i.id]);

  const totalBundleRials = selectedItems.reduce(
    (sum, i) => sum + BigInt(i.priceAmount),
    0n
  );

  const totalOriginalRials = selectedItems.reduce(
    (sum, i) => sum + BigInt(i.originalPriceAmount || i.priceAmount),
    0n
  );

  const totalSavingsRials = totalOriginalRials > totalBundleRials ? totalOriginalRials - totalBundleRials : 0n;

  const handleAddBundle = () => {
    selectedItems.forEach((item) => {
      addItem({
        variantId: `var_${item.id}`,
        productId: item.id,
        title: item.title,
        sku: `BND-${item.slug.slice(0, 8).toUpperCase()}`,
        priceAmount: item.priceAmount,
      });
    });
    setAddedBundle(true);
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
          {items.map((item, idx) => {
            const isChecked = !!selectedItemIds[item.id];
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
                      <Link href={`/products/${encodeURIComponent(item.slug)}`}>
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
              <span>قیمت نهایی کیت ({selectedItems.length} قلم):</span>
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
              disabled={selectedItems.length === 0}
              className={`pdp-bundle-add-btn ${addedBundle ? 'btn-added' : ''}`}
            >
              {addedBundle ? '✓ کیت به سبد خرید اضافه شد' : 'افزودن کل پکیج با ۱۵٪ تخفیف'}
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
