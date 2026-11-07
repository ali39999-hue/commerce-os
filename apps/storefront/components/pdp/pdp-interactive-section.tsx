'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExtendedProductData, ProductVariantItem } from '../../lib/pdp-types';
import { ProductGallery } from './product-gallery';
import { VariantSelector, ServerAuthoritativePrice } from './variant-selector';
import { StickyCartBar } from './sticky-cart-bar';
import { ClinicalTabs } from './clinical-tabs';
import { BundleRecommendations } from './bundle-recommendations';
import { DynamicRegimenBuilder } from './dynamic-regimen-builder';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { WishlistButton } from '../discovery/wishlist-button';
import { CompareButton } from '../discovery/compare-button';
import { trackViewItem } from '../../lib/analytics';

interface PdpInteractiveSectionProps {
  productData: ExtendedProductData;
  isDigital?: boolean;
  reviewsElement: React.ReactNode;
}

export function PdpInteractiveSection({
  productData,
  isDigital,
  reviewsElement,
}: PdpInteractiveSectionProps) {
  const { addItem } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem>(
    () => productData.variants[0] || {
      id: 'default',
      sku: 'SKU-DEFAULT',
      title: 'پیش‌فرض',
      sizeOrVolume: 'استاندارد',
      priceAmount: '0',
      currency: 'IRR',
      inStock: false,
    }
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Track view_item on mount and when variant changes
  useEffect(() => {
    trackViewItem(
      {
        item_id: productData.id,
        item_name: productData.title,
        item_variant: selectedVariant.id,
        sku: selectedVariant.sku,
        item_brand: productData.brand.name,
        price: Number(selectedVariant.priceAmount) || 0,
        quantity: 1,
        currency: selectedVariant.currency || 'IRR',
      },
      selectedVariant.currency || 'IRR'
    );
  }, [productData.id, productData.title, productData.brand.name, selectedVariant]);

  const handleAddToCart = () => {
    if (!selectedVariant.inStock) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productId: productData.id,
        title: `${productData.title} - ${selectedVariant.title}`,
        sku: selectedVariant.sku,
        priceAmount: selectedVariant.priceAmount,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const lineTotalRials = BigInt(selectedVariant.priceAmount) * BigInt(qty);
  const isLowStock =
    selectedVariant.inStock &&
    selectedVariant.inventoryQty !== undefined &&
    selectedVariant.inventoryQty < 10 &&
    selectedVariant.inventoryQty > 0;

  return (
    <>
      <section className="pdp-hero-layout" aria-label="خرید و مشخصات محصول">
        {/* Left Column: Interactive High-Quality Image Gallery */}
        <div className="pdp-gallery-column">
          <ProductGallery media={productData.media} productTitle={productData.title} />

          {/* Quick trust metrics */}
          <div className="pdp-trust-badges-card">
            <div className="pdp-trust-item">
              <span className="pdp-trust-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <strong>تضمین ۱۰۰٪ اصالت و پلمپ</strong>
                <small>بچ‌کد اختصاصی قابل استعلام و بارکد رهگیری</small>
              </div>
            </div>
            <div className="pdp-trust-item">
              <span className="pdp-trust-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <div>
                <strong>ارسال سریع کلینیکال</strong>
                <small>بسته‌بندی ضربه‌گیر عایق دما با پست پیشتاز و تیپاکس</small>
              </div>
            </div>
            <div className="pdp-trust-item">
              <span className="pdp-trust-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <div>
                <strong>مشاوره تخصصی بیوتی‌ترپیست</strong>
                <small>پشتیبانی داروسازان و اسکین‌تراپیست‌های بالینی</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Copy Box, Variant Selector, Authoritative Pricing & Cart CTA */}
        <div className="pdp-copy-column">
          {/* Brand & Category Eyebrow */}
          <div className="pdp-brand-header-row">
            <div className="pdp-brand-tag-wrap">
              <span className="pdp-brand-name">{productData.brand.name}</span>
              <span className="pdp-brand-origin">{productData.brand.originCountry}</span>
              {productData.coldChainRequired && (
                <span className="cold-chain-badge" title="ارسال تحت زنجیره سرمایی کنترل‌شده جهت حفظ فعالیت بیولوژیک اکتیوها">
                  <span aria-hidden="true">❄️</span>
                  پایش زنجیره سرد (Cold-Chain)
                </span>
              )}
            </div>

            <div className="pdp-discovery-actions-wrap">
              <WishlistButton
                variantId={selectedVariant.id}
                productId={productData.id}
                slug={productData.slug}
                title={productData.title}
                sku={selectedVariant.sku}
                priceAmount={selectedVariant.priceAmount}
              />
              <CompareButton
                variantId={selectedVariant.id}
                productId={productData.id}
                slug={productData.slug}
                title={productData.title}
                sku={selectedVariant.sku}
                priceAmount={selectedVariant.priceAmount}
                inStock={selectedVariant.inStock}
                categoryTitleFa="مراقبت بالینی پوست"
              />
            </div>
          </div>

          <h1 className="pdp-main-title">{productData.title}</h1>
          <p className="pdp-sub-title">{productData.subtitleFa}</p>

          {/* Rating Summary Snippet */}
          <div className="pdp-rating-strip" aria-label={`امتیاز ${productData.ratingSummary.ratingValue} از ۵`}>
            <span className="stars-gold" aria-hidden="true">★★★★★</span>
            <span className="rating-score">{productData.ratingSummary.ratingValue}</span>
            <span className="rating-count">({productData.ratingSummary.reviewCount} دیدگاه کارشناسی و تأییدشده)</span>
          </div>

          {/* Skin Concerns & Types Tag Cloud */}
          <div className="pdp-skin-profile-row" aria-label="تیپ‌های پوستی و نیازهای درمان">
            <div className="pdp-tag-group">
              <span className="pdp-tag-label">مناسب برای:</span>
              {productData.skinTypes.map((st, i) => (
                <span key={i} className="pdp-skin-chip">{st}</span>
              ))}
            </div>
            <div className="pdp-tag-group">
              <span className="pdp-tag-label">دغدغه‌های پوستی:</span>
              {productData.skinConcerns.map((sc, i) => (
                <span key={i} className="pdp-concern-chip">{sc}</span>
              ))}
            </div>
          </div>

          {/* Server-authoritative Price Box */}
          <ServerAuthoritativePrice variant={selectedVariant} />

          {/* Dynamic Variant Selector */}
          <VariantSelector
            variants={productData.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={(v) => {
              setSelectedVariant(v);
              setQty(1);
            }}
          />

          {/* Purchase Action Box */}
          <div className="pdp-purchase-card">
            <div className="pdp-purchase-meta-row">
              <div className="pdp-sku-display">
                <span>کد کالای انتخابی (SKU): </span>
                <code dir="ltr">{selectedVariant.sku}</code>
              </div>

              {isLowStock && (
                <div className="pdp-stock-threshold-warning" role="alert">
                  <span className="warn-pulse" aria-hidden="true">●</span>
                  موجودی محدود: فقط {selectedVariant.inventoryQty} عدد در انبار مرکزی باقی‌مانده است
                </div>
              )}
            </div>

            {selectedVariant.inStock ? (
              <div className="pdp-action-controls-row">
                <div className="pdp-qty-selector" aria-label="انتخاب تعداد سفارش">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(50, q + 1))}
                    className="pdp-qty-btn"
                    aria-label="افزایش تعداد"
                  >
                    +
                  </button>
                  <span className="pdp-qty-val" aria-live="polite">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="pdp-qty-btn"
                    aria-label="کاهش تعداد"
                  >
                    -
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`pdp-main-buy-btn ${added ? 'btn-success' : ''}`}
                  aria-live="polite"
                >
                  {added ? '✓ به سبد خرید اضافه شد' : `افزودن به سبد خرید (${formatToman(lineTotalRials)})`}
                </button>
              </div>
            ) : (
              <div className="pdp-out-of-stock-banner" role="status">
                <span className="out-icon" aria-hidden="true">✕</span>
                <div>
                  <strong>این سایز در حال حاضر در انبار ناموجود است</strong>
                  <p>می‌توانید سایر سایزها را انتخاب کرده یا وضعیت موجودی را از پشتیبانی استعلام نمایید.</p>
                </div>
              </div>
            )}

            {added && (
              <div className="pdp-cart-success-feedback" role="alert">
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>کالا با موفقیت به سبد خرید شما اضافه گردید.</span>
                <Link href="/cart" className="pdp-checkout-direct-link">
                  مشاهده سبد و تسویه حساب ←
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Bar for Quick Add to Cart during scroll */}
      <StickyCartBar
        productId={productData.id}
        productTitle={productData.title}
        thumbnailUrl={productData.media[0]?.url}
        variant={selectedVariant}
        qty={qty}
        onQtyChange={setQty}
      />

      {/* Rich Accordion / Tabs */}
      <ClinicalTabs
        productData={productData}
        productSlug={productData.slug}
        reviewsElement={reviewsElement}
      />

      {/* Dynamic Bundle & Regimen Builder for Carboxy/Clinical Products */}
      <DynamicRegimenBuilder />

      {/* Bundle Recommendation & Save */}
      {productData.bundleRecommendation && (
        <BundleRecommendations
          bundleTitle={productData.bundleRecommendation.bundleTitle}
          bundleDescription={productData.bundleRecommendation.bundleDescription}
          savingsText={productData.bundleRecommendation.savingsText}
          items={productData.bundleRecommendation.items}
        />
      )}
    </>
  );
}
