'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../components/cart';
import './shop.css';
import { listCategories, listProducts } from '../../lib/catalog';
import { isBackendServiceError, reportBackendError } from '../../lib/backend-error';
import {
  mapApiProductToShopItem,
  toShopCategoryOptions,
  type ShopCategoryOption,
  type ShopProductItem,
} from '../../lib/shop-catalog-data';

export type SortOptionKey =
  | 'relevant'
  | 'popular'
  | 'newest'
  | 'bestselling'
  | 'price-low'
  | 'price-high'
  | 'fast-shipping'
  | 'rating'
  | 'featured';

interface SortOptionItem {
  key: SortOptionKey;
  label: string;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { key: 'relevant', label: 'مرتبط‌ترین' },
  { key: 'popular', label: 'پربازدیدترین' },
  { key: 'newest', label: 'جدیدترین' },
  { key: 'bestselling', label: 'پرفروش‌ترین' },
  { key: 'price-low', label: 'ارزان‌ترین' },
  { key: 'price-high', label: 'گران‌ترین' },
  { key: 'fast-shipping', label: 'سریع‌ترین ارسال' },
  { key: 'rating', label: 'پیشنهاد خریداران' },
  { key: 'featured', label: 'منتخب' },
];

function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export default function ShopPage() {
  const cart = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceCap, setPriceCap] = useState<number>(200_000_000);
  const [maxPrice, setMaxPrice] = useState<number>(200_000_000);
  const [sortBy, setSortBy] = useState<SortOptionKey>('relevant');
  const [categories, setCategories] = useState<ShopCategoryOption[]>([
    { key: 'all', label: 'همه دسته‌ها' },
  ]);
  const [products, setProducts] = useState<ShopProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAddToCart = (e: React.MouseEvent, prod: ShopProductItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!prod.variantId || !prod.inStock) {
      return;
    }

    if (cart?.addItem) {
      cart.addItem(
        {
          variantId: prod.variantId,
          productId: prod.id,
          title: prod.title,
          sku: prod.sku || prod.slug.toUpperCase(),
          priceAmount: (BigInt(prod.price) * 10n).toString(), // Tomans to Rials
          image: prod.image,
        },
        1
      );
      setAddedId(prod.id);
      setTimeout(() => setAddedId(null), 1800);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const urlCat = sp.get('cat');
      const urlSort = sp.get('sort');
      if (urlCat) setSelectedCategory(urlCat);
      if (urlSort === 'newest') setSortBy('newest');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([listProducts({ limit: 100 }), listCategories()])
      .then(([catalogRes, catRes]) => {
        if (cancelled) return;
        const apiItems = (catalogRes?.data ?? []).map(mapApiProductToShopItem);
        setProducts(apiItems);
        if (apiItems.length > 0) {
          const highestPrice = Math.max(...apiItems.map((i) => i.price), 5_000_000);
          setPriceCap(highestPrice);
          setMaxPrice(highestPrice);
        }
        if (catRes.length > 0) {
          setCategories(toShopCategoryOptions(catRes));
        }
      })
      .catch((err) => {
        if (!cancelled && isBackendServiceError(err)) {
          reportBackendError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categoryKey === selectedCategory ||
          p.brandSlug === selectedCategory ||
          p.category.includes(selectedCategory)
      );
    }

    result = result.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'bestselling':
        result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'popular':
        result.sort(
          (a, b) =>
            (b.rating || 0) * (b.discountPercent || 1) -
            (a.rating || 0) * (a.discountPercent || 1)
        );
        break;
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'fast-shipping':
        result.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        break;
      case 'featured':
        result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
      case 'relevant':
      default:
        break;
    }

    return result;
  }, [selectedCategory, maxPrice, sortBy, products]);

  return (
    <div className="shop-page-container">
      <div className="shop-page-inner">
        {/* ── 1. Top Bar: Subtitle & Navigation Toolbar ── */}
        <header className="shop-top-header">
          <p className="shop-subtitle-text">خرید اینترنتی محصولات پوست و مو</p>

          <div className="shop-nav-toolbar">
            {/* Breadcrumb Navigation */}
            <nav className="shop-breadcrumbs" aria-label="مسیر راهنما">
              <Link href="/" className="shop-breadcrumb-link">
                خانه
              </Link>
              <span className="shop-breadcrumb-sep" aria-hidden="true">
                /
              </span>
              <span className="shop-breadcrumb-active">فروشگاه</span>
              {selectedCategory !== 'all' && (
                <>
                  <span className="shop-breadcrumb-sep" aria-hidden="true">
                    /
                  </span>
                  <span className="shop-breadcrumb-active">
                    {categories.find((c) => c.key === selectedCategory)?.label ?? selectedCategory}
                  </span>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* ── 2. Main Two-Column Layout ── */}
        <div className="shop-layout-grid">
          {/* ── Sidebar Filters (Right Column in RTL) ── */}
          <aside className="shop-sidebar" aria-label="فیلترهای کاتالوگ">
            {/* Price Filter Box */}
            <div className="shop-filter-card">
              <h2 className="shop-filter-heading">فیلتر بر اساس قیمت</h2>

              <div className="shop-price-slider-track">
                <div
                  className="shop-price-slider-bar"
                  style={{
                    width: `${priceCap > 0 ? Math.min(100, (maxPrice / priceCap) * 100) : 100}%`,
                    right: 0,
                  }}
                />
                <input
                  type="range"
                  min="500000"
                  max={priceCap}
                  step="500000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="shop-range-input"
                  aria-label="فیلتر بازه قیمت"
                />
              </div>

              <div className="shop-slider-knobs">
                <span className="shop-slider-knob" aria-hidden="true" />
                <span className="shop-slider-knob" aria-hidden="true" />
              </div>

              <div className="shop-price-readout-row">
                <span className="shop-price-text">
                  قیمت: ۰ تومان — {formatNumber(maxPrice)} تومان
                </span>
                <button
                  type="button"
                  onClick={() => setMaxPrice(maxPrice)}
                  className="shop-filter-btn"
                >
                  فیلتر
                </button>
              </div>
            </div>

            {/* Category Dropdown Box */}
            <div className="shop-filter-card">
              <h2 className="shop-filter-heading">دسته‌بندی محصولات</h2>

              <div className="shop-category-select-wrapper">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="shop-category-select"
                  aria-label="انتخاب دسته محصولات"
                >
                  <option value="all">یک دسته انتخاب نمایید</option>
                  {categories.filter((c) => c.key !== 'all').map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="shop-category-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>

              {/* Quick Pills */}
              <div className="shop-category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`shop-category-pill-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.key && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Product Grid (Left Column in RTL) ── */}
          <main className="shop-catalog-main" id="shop-catalog-list">
            {/* ── Modern Digikala-style Horizontal Sort Bar ── */}
            <div className="shop-sort-bar" role="toolbar" aria-label="مرتب‌سازی محصولات">
              <div className="shop-sort-bar-header">
                <svg
                  className="shop-sort-bar-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="M11 4h10" />
                  <path d="M11 9h7" />
                  <path d="M11 14h4" />
                </svg>
                <span className="shop-sort-bar-title">مرتب‌سازی:</span>
              </div>

              <div className="shop-sort-bar-items">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSortBy(opt.key)}
                    className={`shop-sort-item-btn ${sortBy === opt.key ? 'active' : ''}`}
                    aria-pressed={sortBy === opt.key}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="shop-sort-bar-count">
                <span>{formatNumber(filteredProducts.length)} کالا</span>
              </div>
            </div>

            {loading ? (
              <div className="shop-empty-state">
                <h3>در حال بارگذاری کاتالوگ محصولات…</h3>
                <p>در حال دریافت موجودی و قیمت‌های به‌روز از سرور.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="shop-empty-state">
                <h3>هیچ محصولی با این فیلتر یافت نشد</h3>
                <p>لطفاً بازه قیمت را تغییر داده یا دسته‌بندی دیگری انتخاب نمایید.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(priceCap);
                  }}
                  className="shop-reset-btn"
                >
                  مشاهده همه محصولات
                </button>
              </div>
            ) : (
              <div className="shop-grid">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="shop-card"
                  >
                    {/* Discount Badge */}
                    {prod.badge && <span className="shop-badge-discount">{prod.badge}</span>}

                    {/* Bottle Image */}
                    <Link
                      href={`/products/${prod.slug}`}
                      className="shop-card-image-box"
                      title={prod.title}
                    >
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="shop-card-img"
                        loading="lazy"
                      />
                    </Link>

                    {/* Content */}
                    <div className="shop-card-content">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="shop-card-title-link"
                        title={prod.title}
                      >
                        <h3 className="shop-card-title">{prod.title}</h3>
                      </Link>

                      <div className="shop-card-meta">
                        <span>{prod.category}</span>
                        <span className="shop-card-dash">–</span>
                        <span>{prod.brandName || 'درمر شاپ'}</span>
                      </div>

                      <p className="shop-card-desc">
                        {prod.description || 'فرمولاسیون بالینی مراقبت پوست با استانداردهای درماتولوژی بریتانیا.'}
                      </p>

                      <div className="shop-card-prices">
                        <div className="shop-price-stack">
                          {prod.originalPrice > prod.price && (
                            <span className="shop-old-price">
                              {formatNumber(prod.originalPrice)} تومان
                            </span>
                          )}
                          <span className="shop-current-price">
                            {formatNumber(prod.price)} تومان
                          </span>
                        </div>

                        {/* Quick Cart Trigger */}
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, prod)}
                          disabled={!prod.inStock || !prod.variantId}
                          className={`shop-card-quick-add ${addedId === prod.id ? 'added' : ''}`}
                          aria-label={`افزودن ${prod.title} به سبد خرید`}
                          title={prod.inStock && prod.variantId ? 'افزودن سریع به سبد خرید' : 'ناموجود در انبار'}
                        >
                          {addedId === prod.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>

                      {/* Detail CTA Button Matching Reference Photo */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="shop-card-detail-btn"
                        title={`جزئیات بیشتر ${prod.title}`}
                      >
                        <span>جزئیات بیشتر</span>
                        <span className="shop-card-arrow" aria-hidden="true">←</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* ── 3. WhatsApp Support Floating Button ── */}
        <a
          href="https://wa.me/989358727492"
          target="_blank"
          rel="noopener noreferrer"
          className="shop-whatsapp-float"
          aria-label="پشتیبانی واتساپ"
        >
          <div className="shop-whatsapp-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <span>پشتیبانی واتساپ</span>
        </a>
      </div>
    </div>
  );
}
