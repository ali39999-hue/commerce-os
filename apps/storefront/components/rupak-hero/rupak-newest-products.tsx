'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  listProducts,
  resolveProductImage,
  resolveVariant,
  type Product,
} from '../../lib/catalog';
import { useCart } from '../cart';
import './rupak-newest-products.css';

export interface NewestProductItem {
  id: string;
  slug: string;
  variantId: string;
  productId: string;
  title: string;
  category: string;
  image: string;
  discountPercent?: number;
  oldPriceTomans?: string;
  priceTomans: string;
  priceAmount: string;
  sku: string;
}

export interface RupakNewestProductsProps {
  products?: Product[];
}

function toNewestItems(products: Product[]): NewestProductItem[] {
  const newest = products.filter((p) => p.isNewest && Boolean(resolveVariant(p)?.inStock));
  const pool = (newest.length > 0 ? newest : products.filter((p) => resolveVariant(p)?.inStock)).slice(0, 12);

  return pool
    .map((p): NewestProductItem | null => {
      const v = resolveVariant(p);
      if (!v) return null;
      const priceTomansNum = Number(BigInt(v.priceAmount || '0') / 10n);
      const origTomansNum = v.originalPriceAmount
        ? Number(BigInt(v.originalPriceAmount) / 10n)
        : 0;
      const discountPercent =
        typeof v.discountPercent === 'number' && v.discountPercent > 0
          ? v.discountPercent
          : origTomansNum > priceTomansNum && origTomansNum > 0
          ? Math.round(((origTomansNum - priceTomansNum) * 100) / origTomansNum)
          : undefined;

      return {
        id: p.id,
        slug: p.slug,
        variantId: v.id,
        productId: p.id,
        title: p.titleFa || p.title,
        category: p.category?.titleFa || 'مراقبت پوستی',
        image: resolveProductImage(p),
        discountPercent,
        oldPriceTomans:
          origTomansNum > priceTomansNum ? origTomansNum.toLocaleString('fa-IR') : undefined,
        priceTomans: priceTomansNum.toLocaleString('fa-IR'),
        priceAmount: v.priceAmount,
        sku: v.sku,
      };
    })
    .filter((item): item is NewestProductItem => item !== null);
}

export function RupakNewestProducts({ products }: RupakNewestProductsProps) {
  const cart = useCart();
  const [liveProducts, setLiveProducts] = useState<Product[]>(products ?? []);
  const [addedId, setAddedId] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      setLiveProducts(products);
      return;
    }
    let cancelled = false;
    listProducts({ collection: 'newest', limit: 20 }).then((res) => {
      if (!cancelled && res?.data) setLiveProducts(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [products]);

  const newestItems = useMemo(() => toNewestItems(liveProducts), [liveProducts]);

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
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, newestItems.length]);

  const handleScrollNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  const handleScrollPrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

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
        1,
      );
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 1800);
    }
  };

  if (newestItems.length === 0) {
    return null;
  }

  return (
    <section
      id="rupak-newest-products"
      className="rupak-newest-section"
      aria-label="جدیدترین محصولات روپاک شاپ"
      dir="rtl"
    >
      <div className="rupak-newest-container">
        <div className="rupak-newest-box">
          <div className="rupak-newest-inner">
            <div className="rupak-newest-lead">
              <div className="rupak-newest-title-block">
                <h2 className="rupak-newest-title" style={{ fontFamily: "'MyBaby', 'MyBaby Chubby', sans-serif" }}>
                  جدیدترین
                  <br />
                  محصولات
                </h2>
              </div>

              <div className="rupak-newest-art-wrap">
                <img
                  src="/assets/rupak/newest/newest-art.png"
                  alt="جدیدترین محصولات آرایشی و بهداشتی"
                  className="rupak-newest-art-img"
                  loading="lazy"
                />
              </div>

              <div className="rupak-newest-lead-actions">
                <Link href="/shop?sort=newest" className="rupak-newest-viewall">
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

            <div className="rupak-newest-carousel-wrap">
              <button
                type="button"
                onClick={handleScrollNext}
                className={`rupak-carousel-swipe-btn swipe-left ${!canScrollLeft ? 'disabled' : ''}`}
                aria-label="مشاهده محصولات بعدی"
                title="محصولات بعدی"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

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
                {newestItems.map((item) => (
                  <div key={item.id} className="rupak-newest-card">
                    {item.discountPercent && (
                      <span className="rupak-newest-discount-badge">
                        {item.discountPercent}٪
                      </span>
                    )}

                    <Link
                      href={`/products/${encodeURIComponent(item.slug)}`}
                      className="rupak-newest-img-box"
                      draggable={false}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rupak-newest-img"
                        loading="lazy"
                        draggable={false}
                      />
                    </Link>

                    <span className="rupak-newest-category">{item.category}</span>

                    <Link href={`/products/${encodeURIComponent(item.slug)}`}>
                      <h3 className="rupak-newest-card-title">{item.title}</h3>
                    </Link>

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

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className="rupak-newest-add-btn"
                    >
                      {addedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
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
