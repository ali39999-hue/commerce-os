'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../cart';
import './rupak-newest-products.css';

export interface NewestProductItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  category: string;
  image: string;
  discountPercent?: number;
  oldPriceTomans?: string;
  priceTomans: string;
  priceAmount: string; // Rials string
  sku: string;
}

const DEFAULT_NEWEST: NewestProductItem[] = [
  {
    id: 'newest-1',
    variantId: 'var-differin-01',
    productId: 'prod-differin',
    title: 'ژل ضدجوش و لایه‌بردار دیفرین Differin اصل',
    category: 'ضد جوش، مراقبت پوستی',
    image: '/assets/rupak/newest/prod-differin.jpg',
    discountPercent: 9,
    oldPriceTomans: '۶۴۰,۰۰۰',
    priceTomans: '۵۹۰,۰۰۰',
    priceAmount: '5900000',
    sku: 'DIF-GEL-01',
  },
  {
    id: 'newest-2',
    variantId: 'var-guerlain-24k',
    productId: 'prod-guerlain',
    title: 'پرایمر آبرسان و جوانساز گلد گرلن Guerlain 24K Primer Parure Gold',
    category: 'آرایش صورت، آرایشی',
    image: '/assets/rupak/newest/prod-guerlain.jpg',
    discountPercent: 10,
    oldPriceTomans: '۳,۸۰۰,۰۰۰',
    priceTomans: '۳,۴۰۰,۰۰۰',
    priceAmount: '34000000',
    sku: 'GRL-24K-PRIM',
  },
  {
    id: 'newest-3',
    variantId: 'var-skin-detox',
    productId: 'prod-skin-detox',
    title: 'میسلار واتر نوتروژینا مدل اسکین دتوکس Skin Detox اصل ۴۰۰ میل',
    category: 'آرایشی، مراقبت پوستی',
    image: '/assets/rupak/newest/prod-skindetox.jpg',
    discountPercent: 24,
    oldPriceTomans: '۳۸۰,۰۰۰',
    priceTomans: '۲۹۰,۰۰۰',
    priceAmount: '2900000',
    sku: 'NTG-DETOX-400',
  },
  {
    id: 'newest-4',
    variantId: 'var-hydro-boost',
    productId: 'prod-hydro-boost',
    title: 'میسلار واتر نوتروژینا مدل هیدروبوست Hydro Boost اصل ۴۰۰ میل',
    category: 'آرایشی، مراقبت پوستی',
    image: '/assets/rupak/newest/prod-hydroboost.jpg',
    discountPercent: 24,
    oldPriceTomans: '۳۸۰,۰۰۰',
    priceTomans: '۲۹۰,۰۰۰',
    priceAmount: '2900000',
    sku: 'NTG-HYDRO-400',
  },
  {
    id: 'newest-5',
    variantId: 'var-healene-150',
    productId: 'prod-healene',
    title: 'ژل ترمیم‌کننده سد دفاعی پوست Healene 150ml دکسپانتنول ۵٪',
    category: 'مراقبت بالینی پوست',
    image: '/assets/drdermer/2024/10/2-azel-170-hydrapod.webp',
    priceTomans: '۹۸۰,۰۰۰',
    priceAmount: '9800000',
    sku: 'HLN-GEL-150',
  },
  {
    id: 'newest-6',
    variantId: 'var-silicalene-200',
    productId: 'prod-silicalene',
    title: 'اسکراب دتوکس و لایروبی منافذ Silicalene 200ml با کربن فعال',
    category: 'پاکسازی عمیق و لایه‌بردار',
    image: '/assets/drdermer/2024/10/v-glycolic-170-carbo-pod.webp',
    priceTomans: '۱,۲۸۰,۰۰۰',
    priceAmount: '12800000',
    sku: 'SLC-SCRUB-200',
  },
];

export function RupakNewestProducts() {
  const cart = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse Drag state for desktop swipe
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const currentScroll = Math.abs(scrollLeft);
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollRight(currentScroll > 15);
    setCanScrollLeft(currentScroll < maxScroll - 15);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = carouselRef.current;
    if (!el) return;

    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const handleScrollNext = () => {
    if (!carouselRef.current) return;
    // In RTL, next items are to the left, so scrollBy negative
    carouselRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  const handleScrollPrev = () => {
    if (!carouselRef.current) return;
    // In RTL, prev items are back to the right, so scrollBy positive
    carouselRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  // Drag-to-swipe handlers for mouse users
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftPos(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
    updateScrollState();
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const handleAddToCart = (e: React.MouseEvent, item: NewestProductItem) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    if (cart?.addItem) {
      cart.addItem(
        {
          variantId: item.variantId,
          productId: item.productId,
          title: item.title,
          sku: item.sku,
          priceAmount: item.priceAmount,
          image: item.image,
        },
        1
      );
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 1800);
    }
  };

  return (
    <section
      id="rupak-newest-products"
      className="rupak-newest-section"
      aria-label="جدیدترین محصولات روپاک شاپ"
      dir="rtl"
    >
      <div className="rupak-newest-container">
        {/* Soft Sage-Green Banner Outer Container */}
        <div className="rupak-newest-box">
          <div className="rupak-newest-inner">
            {/* Lead Column (Right in RTL): Title, 3 Bottles Art, View All */}
            <div className="rupak-newest-lead">
              <div className="rupak-newest-title-block">
                <h2 className="rupak-newest-title">
                  جدیدترین
                  <br />
                  محصولات
                </h2>
              </div>

              {/* 3 Bottles Art Illustration */}
              <div className="rupak-newest-art-wrap">
                <img
                  src="/assets/rupak/newest/newest-art.png"
                  alt="جدیدترین محصولات آرایشی و بهداشتی"
                  className="rupak-newest-art-img"
                  loading="lazy"
                />
              </div>

              {/* Lead Actions: "مشاهده همه" + Mini Directional Nav */}
              <div className="rupak-newest-lead-actions">
                <Link href="/shop" className="rupak-newest-viewall">
                  <span>مشاهده همه</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
                <div className="rupak-newest-mini-arrows" aria-label="پیمایش محصولات">
                  <button
                    type="button"
                    onClick={handleScrollNext}
                    disabled={!canScrollLeft}
                    className={`rupak-mini-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
                    title="محصولات بعدی"
                    aria-label="محصولات بعدی"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleScrollPrev}
                    disabled={!canScrollRight}
                    className={`rupak-mini-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
                    title="محصولات قبلی"
                    aria-label="محصولات قبلی"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Carousel (Left in RTL) */}
            <div className="rupak-newest-carousel-wrap">
              {/* Floating Swipe Left Button (Next products in RTL) */}
              <button
                type="button"
                onClick={handleScrollNext}
                className={`rupak-carousel-swipe-btn swipe-left ${!canScrollLeft ? 'disabled' : ''}`}
                aria-label="مشاهده محصولات بعدی"
                title="محصولات بعدی"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Floating Swipe Right Button (Prev products in RTL) */}
              <button
                type="button"
                onClick={handleScrollPrev}
                className={`rupak-carousel-swipe-btn swipe-right ${!canScrollRight ? 'disabled' : ''}`}
                aria-label="مشاهده محصولات قبلی"
                title="محصولات قبلی"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div
                ref={carouselRef}
                onScroll={updateScrollState}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`rupak-newest-carousel ${isMouseDown ? 'is-dragging' : ''}`}
              >
                {DEFAULT_NEWEST.map((item) => (
                  <div key={item.id} className="rupak-newest-card">
                    {/* Discount Badge */}
                    {item.discountPercent && (
                      <span className="rupak-newest-discount-badge">
                        {item.discountPercent}٪
                      </span>
                    )}

                    {/* Product Image */}
                    <div className="rupak-newest-img-box">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rupak-newest-img"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>

                    {/* Category */}
                    <span className="rupak-newest-category">{item.category}</span>

                    {/* Product Title */}
                    <h3 className="rupak-newest-card-title">{item.title}</h3>

                    {/* Price Row */}
                    <div className="rupak-newest-price-row">
                      {item.oldPriceTomans && (
                        <span className="rupak-newest-old-price">
                          {item.oldPriceTomans} تومان
                        </span>
                      )}
                      <span className="rupak-newest-price">
                        {item.priceTomans}
                        <span className="rupak-newest-unit">تومان</span>
                      </span>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className="rupak-newest-add-btn"
                    >
                      {addedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>به سبد اضافه شد</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>افزودن به سبد خرید</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
