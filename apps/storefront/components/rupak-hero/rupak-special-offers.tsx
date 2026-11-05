'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useCart } from '../cart';
import './rupak-special-offers.css';

export interface SpecialOfferItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  category: string;
  image: string;
  discountPercent?: number;
  oldPriceTomans?: string;
  priceTomans: string;
  priceAmount: string; // Rials as string
  sku: string;
}

const DEFAULT_OFFERS: SpecialOfferItem[] = [
  {
    id: 'offer-1',
    variantId: 'var-cicalfate-30',
    productId: 'prod-cicalfate',
    title: 'ژل ترمیم‌کننده فوری سیکالفیت اون Cicalfate اصل ۳۰ میل',
    category: 'جوانساز و ترمیم‌کننده، مراقبت پوستی',
    image: '/assets/rupak/offers/prod-cicalfate.jpg',
    discountPercent: 15,
    oldPriceTomans: '۱,۰۵۰,۰۰۰',
    priceTomans: '۸۹۰,۰۰۰',
    priceAmount: '8900000',
    sku: 'AVN-CIC-30',
  },
  {
    id: 'offer-2',
    variantId: 'var-phyto-120',
    productId: 'prod-phyto',
    title: 'مکمل قرص فیتو فانر تقویت‌کننده مو و ناخن ۱۲۰ عددی ایتالیا اصل',
    category: 'مکمل و نوتریسوتیکال',
    image: '/assets/rupak/offers/prod-phyto.jpg',
    discountPercent: 4,
    oldPriceTomans: '۱,۵۱۰,۰۰۰',
    priceTomans: '۱,۴۵۰,۰۰۰',
    priceAmount: '14500000',
    sku: 'PHY-PHAN-120',
  },
  {
    id: 'offer-3',
    variantId: 'var-priorin-120',
    productId: 'prod-priorin',
    title: 'کپسول مکمل ضد ریزش مو پریورین اصل priorin ۱۲۰ عددی',
    category: 'مراقبت از مو، مکمل',
    image: '/assets/rupak/offers/prod-priorin.jpg',
    discountPercent: 3,
    oldPriceTomans: '۴,۵۵۰,۰۰۰',
    priceTomans: '۴,۴۰۰,۰۰۰',
    priceAmount: '44000000',
    sku: 'PRI-CAPS-120',
  },
  {
    id: 'offer-4',
    variantId: 'var-alpecin-c1',
    productId: 'prod-alpecin',
    title: 'شامپو ضد ریزش و محرک کافئین آلپسین C1 اصل ۲۵۰ میل',
    category: 'مراقبت از مو',
    image: '/assets/rupak/offers/prod-alpecin.jpg',
    priceTomans: '۴۷۰,۰۰۰',
    priceAmount: '4700000',
    sku: 'ALP-SHAMP-C1',
  },
  {
    id: 'offer-5',
    variantId: 'var-cbg-1500',
    productId: 'prod-carboxygel',
    title: 'ژل کربوکسی‌تراپی بالینی CarboxyGel Pro 1500ml اثر بوهر',
    category: 'فرآورده درمانی بالینی',
    image: '/assets/drdermer/2025/07/site-combo-carboxy-1.png',
    discountPercent: 10,
    oldPriceTomans: '۵,۴۰۰,۰۰۰',
    priceTomans: '۴,۸۵۰,۰۰۰',
    priceAmount: '48500000',
    sku: 'CBG-PRO-1500',
  },
  {
    id: 'offer-6',
    variantId: 'var-crystalene-polish',
    productId: 'prod-crystalene',
    title: 'خمیر پولیش ابریشمی میکرودرم Crystalene با نیاسینامید ۲٪',
    category: 'مراقبت پوست و لایه‌بردار',
    image: '/assets/drdermer/2024/10/multi-170-vita-pod.webp',
    discountPercent: 14,
    oldPriceTomans: '۱,۶۵۰,۰۰۰',
    priceTomans: '۱,۴۲۰,۰۰۰',
    priceAmount: '14200000',
    sku: 'CRS-POLISH-200',
  },
];

export function RupakSpecialOffers() {
  const cart = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Live countdown timer: 8 hours, 45 minutes, 30 seconds
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

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

  const handleAddToCart = (e: React.MouseEvent, item: SpecialOfferItem) => {
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
      id="rupak-special-offers"
      className="rupak-offers-section"
      aria-label="پیشنهادهای شگفت‌انگیز و بنرهای تبلیغاتی"
    >
      <div className="rupak-offers-container">
        {/* ==================================================================
            1. AMAZING OFFERS OUTER PEACH CONTAINER (پیشنهاد شگفت‌انگیز)
            ================================================================== */}
        <div className="rupak-offers-box">
          <div className="rupak-offers-inner">
            {/* Lead Column (Right in RTL): Title, Countdown, Perfume & Rose */}
            <div className="rupak-offers-lead">
              <div className="rupak-offers-title-block">
                <h2 className="rupak-offers-title">
                  پیشنهاد
                  <br />
                  شگفت
                  <br />
                  انگیز
                </h2>

                {/* Countdown Timer */}
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

              {/* Perfume Spray & Rose Flower Illustration */}
              <div className="rupak-offers-art-wrap">
                <img
                  src="/assets/rupak/offers/offer-title-art.png"
                  alt="پیشنهاد ویژه عطر و مراقبت پوست"
                  className="rupak-offers-art-img"
                  loading="lazy"
                />
              </div>

              {/* "مشاهده همه" Action Link */}
              <Link href="/shop" className="rupak-offers-viewall">
                <span>مشاهده همه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Product Cards Carousel (Left in RTL) */}
            <div className="rupak-offers-carousel-wrap">
              <div className="rupak-offers-carousel">
                {DEFAULT_OFFERS.map((item) => (
                  <div key={item.id} className="rupak-offer-card">
                    {/* Discount Badge */}
                    {item.discountPercent && (
                      <span className="rupak-offer-discount-badge">
                        {item.discountPercent}٪
                      </span>
                    )}

                    {/* Product Image */}
                    <div className="rupak-offer-img-box">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rupak-offer-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Category */}
                    <span className="rupak-offer-category">{item.category}</span>

                    {/* Product Title */}
                    <h3 className="rupak-offer-title">{item.title}</h3>

                    {/* Price Row */}
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

                    {/* Add to Cart CTA */}
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
