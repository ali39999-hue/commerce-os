'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  listProducts,
  resolveProductImage,
  resolveVariant,
  type Product,
} from '../../lib/catalog';
import { useCart } from '../cart';
import './rupak-special-offers.css';

export interface SpecialOfferItem {
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

export interface RupakSpecialOffersProps {
  products?: Product[];
}

function toSpecialOfferItems(products: Product[]): SpecialOfferItem[] {
  const offers = products.filter((p) => {
    const v = resolveVariant(p);
    return (p.isSpecialOffer || (v?.discountPercent ?? 0) > 0) && Boolean(v?.inStock);
  });
  const pool = (offers.length > 0 ? offers : products.filter((p) => resolveVariant(p)?.inStock)).slice(0, 12);

  return pool
    .map((p): SpecialOfferItem | null => {
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
    .filter((item): item is SpecialOfferItem => item !== null);
}

export function RupakSpecialOffers({ products }: RupakSpecialOffersProps) {
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

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    if (products && products.length > 0) {
      setLiveProducts(products);
      return;
    }
    let cancelled = false;
    listProducts({ collection: 'special-offers', limit: 20 }).then((res) => {
      if (!cancelled && res?.data) setLiveProducts(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [products]);

  const offerItems = useMemo(() => toSpecialOfferItems(liveProducts), [liveProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
  }, [updateScrollState, offerItems.length]);

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
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
    updateScrollState();
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const handleAddToCart = (e: React.MouseEvent, item: SpecialOfferItem) => {
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

  if (offerItems.length === 0) {
    return null;
  }

  return (
    <section
      id="rupak-special-offers"
      className="rupak-offers-section"
      aria-label="پیشنهادهای شگفت‌انگیز و بنرهای تبلیغاتی"
    >
      <div className="rupak-offers-container">
        <div className="rupak-offers-box">
          <div className="rupak-offers-inner">
            <div className="rupak-offers-lead">
              <div className="rupak-offers-title-block">
                <h2 className="rupak-offers-title" style={{ fontFamily: "'MyBaby', 'MyBaby Chubby', sans-serif" }}>
                  پیشنهاد
                  <br />
                  شگفت
                  <br />
                  انگیز
                </h2>

                <div
                  className="rupak-countdown-wrap"
                  aria-label="زمان باقی‌مانده تا پایان تخفیف"
                >
                  <div className="rupak-countdown-box">
                    {String(timeLeft.seconds).padStart(2, '۰')}
                  </div>
                  <span className="rupak-countdown-sep">:</span>
                  <div className="rupak-countdown-box">
                    {String(timeLeft.minutes).padStart(2, '۰')}
                  </div>
                  <span className="rupak-countdown-sep">:</span>
                  <div className="rupak-countdown-box">
                    {String(timeLeft.hours).padStart(2, '۰')}
                  </div>
                </div>
              </div>

              <div className="rupak-offers-art-wrap">
                <img
                  src="/assets/rupak/offers/offer-title-art.png"
                  alt="پیشنهاد ویژه عطر و مراقبت پوست"
                  className="rupak-offers-art-img"
                  loading="lazy"
                />
              </div>

              <Link href="/shop" className="rupak-offers-viewall">
                <span>مشاهده همه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="rupak-offers-carousel-wrap">
              <button
                type="button"
                onClick={handleScrollNext}
                className={`rupak-carousel-swipe-btn swipe-left ${!canScrollLeft ? 'disabled' : ''}`}
                aria-label="مشاهده پیشنهادهای بعدی"
                title="پیشنهادهای بعدی"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleScrollPrev}
                className={`rupak-carousel-swipe-btn swipe-right ${!canScrollRight ? 'disabled' : ''}`}
                aria-label="مشاهده پیشنهادهای قبلی"
                title="پیشنهادهای قبلی"
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
                className={`rupak-offers-carousel ${isMouseDown ? 'is-dragging' : ''}`}
              >
                {offerItems.map((item) => (
                  <div key={item.id} className="rupak-offer-card">
                    {item.discountPercent && (
                      <span className="rupak-offer-discount-badge">
                        {item.discountPercent}٪
                      </span>
                    )}

                    <Link
                      href={`/products/${encodeURIComponent(item.slug)}`}
                      className="rupak-offer-img-box"
                      draggable={false}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rupak-offer-img"
                        loading="lazy"
                        draggable={false}
                      />
                    </Link>

                    <span className="rupak-offer-category">{item.category}</span>

                    <Link href={`/products/${encodeURIComponent(item.slug)}`}>
                      <h3 className="rupak-offer-title">{item.title}</h3>
                    </Link>

                    <div className="rupak-offer-price-row">
                      {item.oldPriceTomans && (
                        <span className="rupak-offer-old-price">
                          {item.oldPriceTomans} تومان
                        </span>
                      )}
                      <span className="rupak-offer-price">
                        {item.priceTomans}
                        <span className="rupak-offer-unit">تومان</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className="rupak-offer-add-btn"
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
