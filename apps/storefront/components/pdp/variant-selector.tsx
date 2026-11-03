'use client';

import React from 'react';
import { ProductVariantItem } from '../../lib/pdp-types';
import { formatPrice } from '../../lib/catalog';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';

interface VariantSelectorProps {
  variants: ProductVariantItem[];
  selectedVariant: ProductVariantItem;
  onSelectVariant: (variant: ProductVariantItem) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  const { formatToman } = useLocalizedFormatter();

  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className="pdp-variant-selector-box" role="group" aria-label="انتخاب اندازه یا بسته‌بندی">
      <div className="pdp-variant-header-row">
        <span className="pdp-variant-label">انتخاب سایز / مدل:</span>
        <strong className="pdp-variant-current-title">{selectedVariant.title}</strong>
      </div>

      <div className="pdp-variant-chips-grid" role="radiogroup" aria-label="گزینه‌های سایز">
        {variants.map((v) => {
          const isSelected = v.id === selectedVariant.id;
          const isLowStock = v.inStock && v.inventoryQty !== undefined && v.inventoryQty < 10 && v.inventoryQty > 0;

          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={!v.inStock}
              disabled={!v.inStock}
              className={`pdp-variant-chip ${isSelected ? 'active' : ''} ${!v.inStock ? 'out-of-stock' : ''}`}
              onClick={() => onSelectVariant(v)}
            >
              <div className="pdp-chip-top">
                <span className="pdp-chip-size">{v.sizeOrVolume}</span>
                {v.discountPercent && v.discountPercent > 0 ? (
                  <span className="pdp-chip-discount-tag">{v.discountPercent}٪ تخفیف</span>
                ) : null}
              </div>

              <div className="pdp-chip-price">
                <span className="pdp-chip-toman">{formatToman(v.priceAmount)}</span>
              </div>

              {v.inStock ? (
                isLowStock ? (
                  <span className="pdp-chip-stock-warn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', marginLeft: '4px' }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    تنها ۳ عدد در انبار باقیست
                  </span>
                ) : (
                  <span className="pdp-chip-stock-ok">موجود و آماده ارسال</span>
                )
              ) : (
                <span className="pdp-chip-stock-none">ناموجود</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PriceDisplayProps {
  variant: ProductVariantItem;
}

export function ServerAuthoritativePrice({ variant }: PriceDisplayProps) {
  const { formatToman, formatNumber } = useLocalizedFormatter();
  const rialsBig = BigInt(variant.priceAmount);
  const tomansBig = rialsBig / 10n;
  const installmentToman = tomansBig / 4n;

  return (
    <div className="pdp-pricing-card" aria-label="اطلاعات قیمت و شرایط پرداخت">
      <div className="pdp-price-primary-row">
        <div className="pdp-price-amount-wrap">
          {variant.originalPriceAmount && variant.originalPriceAmount !== variant.priceAmount && (
            <div className="pdp-price-original-row">
              <span className="pdp-price-strikethrough">
                {formatToman(variant.originalPriceAmount)}
              </span>
              {variant.discountPercent && (
                <span className="pdp-discount-badge">{variant.discountPercent}٪ تخفیف ویژه</span>
              )}
            </div>
          )}

          <div className="pdp-price-final-toman">
            <span className="toman-value">{formatToman(variant.priceAmount)}</span>
          </div>
          <div className="pdp-price-rial-muted">
            مبلغ بر مبنای ریال سیستم شاپرک: {formatPrice(variant.priceAmount)}
          </div>
        </div>

        <div className="pdp-stock-status-pill">
          {variant.inStock ? (
            <span className="stock-pill in-stock">
              <span className="stock-indicator-dot" />
              آماده ارسال از انبار مرکزی
            </span>
          ) : (
            <span className="stock-pill out-of-stock">
              <span className="stock-indicator-dot out" />
              اتمام موجودی در این سایز
            </span>
          )}
        </div>
      </div>

      {/* Snappay 4-installment Notice */}
      <div className="pdp-installment-banner" role="note" aria-label="پرداخت اقساطی اسنپ‌پی">
        <div className="pdp-installment-icon" aria-hidden="true">💳</div>
        <div className="pdp-installment-text">
          <span>خرید اقساطی: ۴ قسط ماهانه </span>
          <strong>{formatNumber(installmentToman)} تومانی</strong>
          <span> (بدون سود و کارمزد با کارت‌های بانکی)</span>
        </div>
      </div>

      {/* Tax & Invoice compliance */}
      <div className="pdp-compliance-row">
        <span>✓ قیمت نهایی با احتساب ۱۰٪ مالیات بر ارزش افزوده و صدور فاکتور رسمی الکترونیک سامانه مودیان</span>
      </div>
    </div>
  );
}
