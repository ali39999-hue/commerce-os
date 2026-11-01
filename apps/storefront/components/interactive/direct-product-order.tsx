'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';

export interface DirectProductOrderProps {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  volume: string;
  priceAmount: string;
  originalPriceAmount?: string;
  discountPercent?: number;
  inStock?: boolean;
  theme?: 'emerald' | 'cyan' | 'teal';
  badgeText?: string;
}

export function DirectProductOrder({
  productId,
  variantId,
  sku,
  title,
  volume,
  priceAmount,
  originalPriceAmount,
  discountPercent,
  inStock = true,
  theme = 'emerald',
  badgeText = 'تضمین اصالت داروسازی کمبریج',
}: DirectProductOrderProps) {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const priceBigInt = BigInt(priceAmount);
  const totalRials = priceBigInt * BigInt(qty);

  const handleAddToCart = () => {
    addItem(
      {
        variantId,
        productId,
        title,
        sku,
        priceAmount,
      },
      qty
    );
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className={`cp-order-card ${theme}`} aria-label={`سفارش مستقیم ${title}`}>
      <div className="cp-order-header">
        <div>
          <span className="cp-badge-pill" style={{ marginBottom: '6px' }}>
            <span className="pulse-dot" />
            {badgeText}
          </span>
          <div className="cp-order-item-title">{title}</div>
        </div>
        <div className="cp-order-volume-tag">{volume}</div>
      </div>

      <div className="cp-price-display-row">
        <div>
          <span className={`cp-price-main ${theme}`}>
            {formatToman(totalRials)}
          </span>
          {originalPriceAmount && (
            <span className="cp-price-original">
              {formatToman(BigInt(originalPriceAmount) * BigInt(qty))}
            </span>
          )}
        </div>
        {discountPercent ? (
          <span className="cp-discount-badge">{discountPercent}٪ تخفیف کلینیکی</span>
        ) : null}
      </div>

      <div className="cp-action-controls">
        <div className="cp-qty-stepper" aria-label="تعداد سفارش">
          <button
            type="button"
            className="cp-qty-btn"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="افزایش تعداد"
          >
            +
          </button>
          <span className="cp-qty-num">{qty}</span>
          <button
            type="button"
            className="cp-qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="کاهش تعداد"
          >
            -
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`cp-btn-add-cart ${theme} ${added ? 'added' : ''}`}
        >
          {added ? (
            <>
              <span>✓</span>
              <span>به سبد اضافه شد (باز کردن سبد)</span>
            </>
          ) : inStock ? (
            <>
              <span>🛒</span>
              <span>سفارش آنی {volume}</span>
            </>
          ) : (
            <span>اتمام موجودی در انبار مرکزی</span>
          )}
        </button>
      </div>

      <div className="cp-order-assurances">
        <div className="cp-assurance-item">
          <span className="cp-assurance-icon">❄️</span>
          <span>زنجیره سرد استاندارد</span>
        </div>
        <div className="cp-assurance-item">
          <span className="cp-assurance-icon">🔬</span>
          <span>بچ دارویی تست‌شده</span>
        </div>
        <div className="cp-assurance-item">
          <span className="cp-assurance-icon">🚚</span>
          <span>ارسال سریع کلینیکال</span>
        </div>
      </div>
    </div>
  );
}
