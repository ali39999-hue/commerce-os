'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { ProductVariantItem } from '../../lib/pdp-types';

interface StickyCartBarProps {
  productId: string;
  productTitle: string;
  thumbnailUrl?: string;
  variant: ProductVariantItem;
  qty: number;
  onQtyChange: (qty: number) => void;
}

export function StickyCartBar({
  productId,
  productTitle,
  thumbnailUrl,
  variant,
  qty,
  onQtyChange,
}: StickyCartBarProps) {
    const { addItem } = useCart();
    const { formatToman } = useLocalizedFormatter();
    const [added, setAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down past the hero purchase box (> 450px)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    if (!variant.inStock) return;
    addItem(
      {
        variantId: variant.id,
        productId,
        title: `${productTitle} - ${variant.title}`,
        sku: variant.sku,
        priceAmount: variant.priceAmount,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const lineTotalRials = BigInt(variant.priceAmount) * BigInt(qty);
  const isLowStock = variant.inStock && variant.inventoryQty !== undefined && variant.inventoryQty < 10;

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="pdp-sticky-bar"
      role="region"
      aria-label="نوار چسبان سفارش سریع کالا"
    >
      <div className="pdp-sticky-inner page-shell">
        <div className="pdp-sticky-info">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="" className="pdp-sticky-thumb" />
          ) : (
            <div className="pdp-sticky-thumb-fallback">
              <span>{productTitle.charAt(0)}</span>
            </div>
          )}

          <div className="pdp-sticky-title-wrap">
            <strong className="pdp-sticky-title">{productTitle}</strong>
            <span className="pdp-sticky-variant-tag">{variant.title}</span>
          </div>

          <div className="pdp-sticky-price-wrap">
            <span className="pdp-sticky-toman">{formatToman(lineTotalRials)}</span>
            {isLowStock && (
              <span className="pdp-sticky-stock-alert">
                فقط {variant.inventoryQty} عدد مانده در انبار
              </span>
            )}
          </div>
        </div>

        <div className="pdp-sticky-actions">
          {variant.inStock ? (
            <>
              <div className="pdp-sticky-qty-ctrl" aria-label="تنظیم تعداد سفارش">
                <button
                  type="button"
                  onClick={() => onQtyChange(Math.min(30, qty + 1))}
                  className="pdp-qty-btn"
                  aria-label="افزایش تعداد"
                >
                  +
                </button>
                <span className="pdp-qty-val" aria-live="polite">{qty}</span>
                <button
                  type="button"
                  onClick={() => onQtyChange(Math.max(1, qty - 1))}
                  className="pdp-qty-btn"
                  aria-label="کاهش تعداد"
                >
                  -
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`pdp-sticky-buy-btn ${added ? 'btn-added' : ''}`}
                aria-live="polite"
              >
                {added ? '✓ به سبد اضافه شد' : '+ افزودن به سبد خرید'}
              </button>

              {added && (
                <Link href="/cart" className="pdp-sticky-cart-link">
                  مشاهده سبد ←
                </Link>
              )}
            </>
          ) : (
            <span className="pdp-sticky-out-tag">ناموجود در انبار</span>
          )}
        </div>
      </div>
    </aside>
  );
}
