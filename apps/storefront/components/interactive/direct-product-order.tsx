'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { getProduct, resolveProductImage, resolveVariant } from '../../lib/catalog';

export interface DirectProductOrderProps {
  productId: string;
  variantId: string;
  productSlug?: string;
  sku: string;
  title: string;
  volume: string;
  priceAmount: string;
  originalPriceAmount?: string;
  discountPercent?: number;
  inStock?: boolean;
  theme?: 'emerald' | 'cyan' | 'teal';
  badgeText?: string;
  image?: string;
}

export function DirectProductOrder({
  productId,
  variantId,
  productSlug,
  sku,
  title,
  volume,
  priceAmount,
  originalPriceAmount,
  discountPercent,
  inStock = true,
  theme = 'emerald',
  badgeText = 'تضمین اصالت داروسازی کمبریج',
  image,
}: DirectProductOrderProps) {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [liveState, setLiveState] = useState({
    productId,
    variantId,
    sku,
    title,
    priceAmount,
    originalPriceAmount,
    discountPercent,
    inStock,
    image,
  });

  useEffect(() => {
    setLiveState({
      productId,
      variantId,
      sku,
      title,
      priceAmount,
      originalPriceAmount,
      discountPercent,
      inStock,
      image,
    });
  }, [productId, variantId, sku, title, priceAmount, originalPriceAmount, discountPercent, inStock, image]);

  useEffect(() => {
    if (liveState.variantId || !productSlug) return;
    let mounted = true;
    getProduct(productSlug).then((prod) => {
      if (!mounted || !prod) return;
      const v = resolveVariant(prod, sku ? [sku] : undefined);
      if (!v) return;
      setLiveState({
        productId: prod.id,
        variantId: v.id,
        sku: v.sku,
        title: prod.title,
        priceAmount: v.priceAmount,
        originalPriceAmount: v.originalPriceAmount ?? undefined,
        discountPercent: v.discountPercent ?? undefined,
        inStock: v.inStock,
        image: resolveProductImage(prod, image),
      });
    });
    return () => {
      mounted = false;
    };
  }, [liveState.variantId, productSlug, sku, image]);

  const priceBigInt = BigInt(liveState.priceAmount || '0');
  const totalRials = priceBigInt * BigInt(qty);

  const handleAddToCart = () => {
    if (!liveState.variantId || !liveState.productId) return;
    addItem(
      {
        variantId: liveState.variantId,
        productId: liveState.productId,
        title: liveState.title,
        sku: liveState.sku,
        priceAmount: liveState.priceAmount,
        image: liveState.image,
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
            {priceBigInt > 0n ? formatToman(totalRials) : 'استعلام قیمت'}
          </span>
          {liveState.originalPriceAmount && liveState.originalPriceAmount !== liveState.priceAmount && (
            <span className="cp-price-original">
              {formatToman(BigInt(liveState.originalPriceAmount) * BigInt(qty))}
            </span>
          )}
        </div>
        {liveState.discountPercent ? (
          <span className="cp-discount-badge">{liveState.discountPercent}٪ تخفیف کلینیکی</span>
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
          disabled={!liveState.inStock || !liveState.variantId}
          className={`cp-btn-add-cart ${theme} ${added ? 'added' : ''}`}
        >
          {added ? (
            <>
              <span>✓</span>
              <span>به سبد اضافه شد (باز کردن سبد)</span>
            </>
          ) : liveState.inStock ? (
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
