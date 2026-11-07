'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Check,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  Share2,
} from 'lucide-react';
import { ExtendedProductData, ProductVariantItem } from '../../lib/pdp-types';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { isWishlisted, toggleWishlist, WISHLIST_CHANGED_EVENT } from '../../lib/wishlist';
import { trackViewItem } from '../../lib/analytics';
import { ClinicalTabs } from './clinical-tabs';
import { StickyCartBar } from './sticky-cart-bar';
import './rupak-pdp.css';

export interface RupakPdpSectionProps {
  productData: ExtendedProductData;
  isDigital?: boolean;
  reviewsElement: React.ReactNode;
}

export function RupakPdpSection({
  productData,
  isDigital,
  reviewsElement,
}: RupakPdpSectionProps) {
  const { addItem, openDrawer } = useCart();
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
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isInWishlistState, setIsInWishlistState] = useState(false);

  // Sync wishlist state
  useEffect(() => {
    setIsInWishlistState(isWishlisted(selectedVariant.id));
    const handleWishlistChange = () => {
      setIsInWishlistState(isWishlisted(selectedVariant.id));
    };
    window.addEventListener(WISHLIST_CHANGED_EVENT, handleWishlistChange);
    return () => window.removeEventListener(WISHLIST_CHANGED_EVENT, handleWishlistChange);
  }, [selectedVariant.id]);

  // Analytics tracking
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

  // Price & Discount Calculations
  const currentPriceRials = BigInt(selectedVariant.priceAmount || '0');
  const originalPriceRials = selectedVariant.originalPriceAmount
    ? BigInt(selectedVariant.originalPriceAmount)
    : (currentPriceRials * 116n) / 100n; // Default ~16% anchor if not specified

  const discountPercent =
    selectedVariant.discountPercent ??
    (originalPriceRials > currentPriceRials
      ? Math.round(Number(((originalPriceRials - currentPriceRials) * 100n) / originalPriceRials))
      : 16);

  const formatPriceNum = (numRials: bigint) => {
    const tomans = numRials / 10n;
    return tomans.toLocaleString('fa-IR');
  };

  const handleAddToCart = () => {
    if (!selectedVariant.inStock) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productId: productData.id,
        title: `${productData.title}${productData.variants.length > 1 ? ` - ${selectedVariant.title}` : ''}`,
        sku: selectedVariant.sku,
        priceAmount: selectedVariant.priceAmount,
        image: productData.media[0]?.url,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    openDrawer?.();
  };

  const handleWishlistClick = () => {
    toggleWishlist({
      variantId: selectedVariant.id,
      productId: productData.id,
      slug: productData.slug,
      title: productData.title,
      sku: selectedVariant.sku,
      priceAmount: selectedVariant.priceAmount,
    });
  };

  const activeMedia = productData.media[activeMediaIndex] || productData.media[0];

  // Category & tags text
  const categoryTitle = productData.formulation || 'بادی اسپلش، بهداشت شخصی و مراقبت پوست';
  const tagKeywords = [productData.title, productData.brand.name, 'مراقبت پوست'].join('، ');

  // Detailed Overview data with robust fallbacks
  const detailedOverview = productData.detailedOverview || {
    introParagraphs: [
      productData.description || 'توضیحات تکمیلی محصول به زودی اضافه می‌شود.',
      productData.scienceMechanism?.summary,
      productData.subtitleFa,
    ].filter(Boolean) as string[],
    featuresTitle: 'ویژگی ها:',
    features: [
      ...(productData.scienceMechanism?.clinicalBenefits || []),
      ...(productData.cleanBadges || []),
    ],
    ingredientsTitle: 'ترکیبات کلیدی:',
    keyIngredients: productData.ingredients?.map((ing) => ({
      name: ing.nameFa,
      description: ing.purpose,
    })) || [],
    usageTitle: 'نحوه ی مصرف:',
    usageInstructions:
      productData.usageProtocol?.steps?.map((s) => `${s.title}: ${s.instruction}`).join(' ') ||
      productData.usageProtocol?.routineTime ||
      'پس از شستشوی کامل پوست، مقدار مناسبی را روی صورت ماساژ دهید.',
  };

  return (
    <div dir="rtl" className="rupak-pdp-root">
      {/* ==================================================================
          MAIN 2-CARD SHOWCASE (Exact translation from reference layout)
          In RTL grid:
            - First column = Gallery Card (Rendered on Right)
            - Second column = Product Info Card (Rendered on Left)
          ================================================================== */}
      <section className="rupak-pdp-hero-grid" aria-label="مشخصات و خرید محصول">
        {/* ── CARD 1: PRODUCT GALLERY (Right Column in RTL) ── */}
        <div className="rupak-pdp-card rupak-pdp-gallery-card">
          {/* Top Discount Badge (-۱۶٪) */}
          {discountPercent > 0 && (
            <div className="rupak-pdp-discount-badge" aria-label={`تخفیف ${discountPercent} درصد`}>
              -{discountPercent}٪
            </div>
          )}

          {/* Main Product Image Stage */}
          <div className="rupak-pdp-gallery-stage">
            <img
              src={activeMedia?.url || '/assets/rupak/products/perfect-in-pink.png'}
              alt={activeMedia?.altText || productData.title}
              className="rupak-pdp-main-img"
              loading="eager"
            />
          </div>

          {/* Miniature Thumbnails Row (if multiple photos) */}
          {productData.media.length > 1 && (
            <div className="rupak-pdp-thumbnails-strip" aria-label="تصاویر تکمیلی محصول">
              {productData.media.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`rupak-pdp-thumb-btn ${idx === activeMediaIndex ? 'active' : ''}`}
                  aria-label={`نمایش تصویر ${idx + 1}`}
                >
                  <img src={item.url} alt={item.altText} className="rupak-pdp-thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── CARD 2: PRODUCT DETAILS & PURCHASE (Left Column in RTL) ── */}
        <div className="rupak-pdp-card rupak-pdp-info-card">
          {/* Top Category / Brand Pill Badge */}
          <div className="rupak-pdp-top-badge-row">
            <span className="rupak-pdp-category-pill">
              {productData.brand.name}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="rupak-pdp-title">{productData.title}</h1>

          {/* Price Block */}
          <div className="rupak-pdp-price-block">
            {originalPriceRials > currentPriceRials && (
              <span className="rupak-pdp-old-price">
                {formatPriceNum(originalPriceRials)} تومان
              </span>
            )}
            <span className="rupak-pdp-current-price">
              {formatPriceNum(currentPriceRials)} <span className="rupak-pdp-price-unit">تومان</span>
            </span>
          </div>

          {/* In-Stock Badge */}
          <div className="rupak-pdp-stock-row">
            {selectedVariant.inStock ? (
              <span className="rupak-pdp-stock-badge in-stock">
                <svg
                  className="w-3.5 h-3.5 ml-1 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                موجود
              </span>
            ) : (
              <span className="rupak-pdp-stock-badge out-of-stock">
                ناموجود در انبار
              </span>
            )}
          </div>

          {/* Variant Selector (if more than 1 variant) */}
          {productData.variants.length > 1 && (
            <div className="rupak-pdp-variants-wrapper">
              <span className="rupak-pdp-variants-label">انتخاب سایز / مدل:</span>
              <div className="rupak-pdp-variants-list">
                {productData.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rupak-pdp-variant-pill ${variant.id === selectedVariant.id ? 'active' : ''}`}
                  >
                    <span>{variant.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart & Quantity Selector Row */}
          <div className="rupak-pdp-actions-row">
            {/* Primary Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant.inStock}
              className={`rupak-pdp-btn-buy ${added ? 'btn-success' : ''}`}
              aria-label="افزودن محصول به سبد خرید"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 ml-1.5" />
                  <span>به سبد خرید اضافه شد</span>
                </>
              ) : (
                <span>افزودن به سبد خرید</span>
              )}
            </button>

            {/* Quantity Selector (+ 1 -) */}
            <div className="rupak-pdp-qty-stepper" aria-label="انتخاب تعداد">
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(50, q + 1))}
                className="rupak-pdp-qty-btn"
                aria-label="افزایش تعداد"
              >
                +
              </button>
              <span className="rupak-pdp-qty-number" aria-live="polite">
                {qty.toLocaleString('fa-IR')}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rupak-pdp-qty-btn"
                aria-label="کاهش تعداد"
              >
                -
              </button>
            </div>
          </div>

          {/* Add to Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`rupak-pdp-btn-wishlist ${isInWishlistState ? 'is-active' : ''}`}
            aria-label={isInWishlistState ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}
          >
            <span>{isInWishlistState ? 'در لیست علاقه‌مندی‌ها' : 'افزودن به علاقه مندی'}</span>
            <Heart
              className={`w-4 h-4 mr-2 ${isInWishlistState ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
            />
          </button>

          {/* Category & Tag Metadata */}
          <div className="rupak-pdp-meta-section">
            <div className="rupak-pdp-meta-item">
              <span className="rupak-pdp-meta-label">دسته:</span>
              <span className="rupak-pdp-meta-value">{categoryTitle}</span>
            </div>
            <div className="rupak-pdp-meta-item">
              <span className="rupak-pdp-meta-label">برچسب:</span>
              <span className="rupak-pdp-meta-value">{tagKeywords}</span>
            </div>
          </div>

          {/* 4 Trust & Guarantee Badges Grid */}
          <div className="rupak-pdp-trust-grid" aria-label="مزایا و ضمانت‌های فروشگاه روپاک">
            {/* 1. ضمانت اصالت */}
            <div className="rupak-pdp-trust-item">
              <div className="rupak-pdp-trust-text">
                <span className="rupak-pdp-trust-title">ضمانت اصالت</span>
                <span className="rupak-pdp-trust-subtitle">محصولات اصل و معتبر</span>
              </div>
              <div className="rupak-pdp-trust-icon-box" aria-hidden="true">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* 2. ارسال سراسری */}
            <div className="rupak-pdp-trust-item">
              <div className="rupak-pdp-trust-text">
                <span className="rupak-pdp-trust-title">ارسال سراسری</span>
                <span className="rupak-pdp-trust-subtitle">ارسال به سراسر ایران</span>
              </div>
              <div className="rupak-pdp-trust-icon-box" aria-hidden="true">
                <Truck className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* 3. پرداخت امن */}
            <div className="rupak-pdp-trust-item">
              <div className="rupak-pdp-trust-text">
                <span className="rupak-pdp-trust-title">پرداخت امن</span>
                <span className="rupak-pdp-trust-subtitle">درگاه پرداخت مطمئن</span>
              </div>
              <div className="rupak-pdp-trust-icon-box" aria-hidden="true">
                <CreditCard className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* 4. پشتیبانی خرید */}
            <div className="rupak-pdp-trust-item">
              <div className="rupak-pdp-trust-text">
                <span className="rupak-pdp-trust-title">پشتیبانی خرید</span>
                <span className="rupak-pdp-trust-subtitle">راهنمایی پیش از خرید</span>
              </div>
              <div className="rupak-pdp-trust-icon-box" aria-hidden="true">
                <Headphones className="w-5 h-5 text-slate-700" />
              </div>
            </div>
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

      {/* ==================================================================
          CARD 3: PRODUCT INTRODUCTION & DETAILED DESCRIPTION (معرفی و توضیحات)
          Exact match for reference card layout styled with #77B091 & #FFD098
          ================================================================== */}
      <section className="rupak-pdp-card rupak-pdp-description-card" aria-label="معرفی و توضیحات محصول">
        {/* Card Header with palette accents */}
        <div className="rupak-pdp-desc-header">
          <div className="rupak-pdp-desc-title-wrap">
            <span className="rupak-pdp-desc-pill-accent" aria-hidden="true" />
            <h2 className="rupak-pdp-desc-title">معرفی و توضیحات</h2>
          </div>
          <span className="rupak-pdp-desc-badge">اصالت و سلامت تضمین‌شده</span>
        </div>

        {/* Intro Paragraphs */}
        <div className="rupak-pdp-desc-body">
          {detailedOverview.introParagraphs?.map((paragraph, idx) => (
            <p key={idx} className="rupak-pdp-desc-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Features Bullet List */}
        {detailedOverview.features && detailedOverview.features.length > 0 && (
          <div className="rupak-pdp-desc-features-section">
            <h3 className="rupak-pdp-desc-subtitle">
              <span className="rupak-pdp-desc-dot" aria-hidden="true" />
              {detailedOverview.featuresTitle || 'ویژگی ها:'}
            </h3>
            <ul className="rupak-pdp-features-list">
              {detailedOverview.features.map((feature, idx) => (
                <li key={idx} className="rupak-pdp-feature-item">
                  <span className="rupak-pdp-feature-bullet" aria-hidden="true">•</span>
                  <span className="rupak-pdp-feature-text">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Ingredients */}
        {detailedOverview.keyIngredients && detailedOverview.keyIngredients.length > 0 && (
          <div className="rupak-pdp-desc-ingredients-section">
            <h3 className="rupak-pdp-desc-subtitle">
              <span className="rupak-pdp-desc-dot accent-peach" aria-hidden="true" />
              {detailedOverview.ingredientsTitle || 'ترکیبات کلیدی:'}
            </h3>
            <ul className="rupak-pdp-ingredients-list">
              {detailedOverview.keyIngredients.map((item, idx) => (
                <li key={idx} className="rupak-pdp-ingredient-item">
                  <span className="rupak-pdp-feature-bullet accent-peach" aria-hidden="true">•</span>
                  <div className="rupak-pdp-ingredient-content">
                    <strong className="rupak-pdp-ingredient-name">{item.name}:</strong>{' '}
                    <span className="rupak-pdp-ingredient-desc">{item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage Instructions */}
        {detailedOverview.usageInstructions && (
          <div className="rupak-pdp-desc-usage-section">
            <h3 className="rupak-pdp-desc-subtitle">
              <span className="rupak-pdp-desc-dot" aria-hidden="true" />
              {detailedOverview.usageTitle || 'نحوه ی مصرف:'}
            </h3>
            <p className="rupak-pdp-usage-text">
              {detailedOverview.usageInstructions}
            </p>
          </div>
        )}
      </section>

      {/* Rich Tabs (توضیحات، ترکیبات، راهنما و نظرات) */}
      <div className="rupak-pdp-tabs-container">
        <ClinicalTabs
          productData={productData}
          productSlug={productData.slug}
          reviewsElement={reviewsElement}
        />
      </div>
    </div>
  );
}
