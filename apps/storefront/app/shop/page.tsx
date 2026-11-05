'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './shop.css';
import {
  INITIAL_SHOP_PRODUCTS,
  SHOP_CATEGORIES,
  ShopProductItem,
} from '../../lib/shop-catalog-data';

function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(56210000);
  const [sortBy, setSortBy] = useState<string>('default');

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_SHOP_PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.categoryKey === selectedCategory || p.category.includes(selectedCategory)
      );
    }

    // Filter by Price
    result = result.filter((p) => p.price <= maxPrice);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep initial order from screenshot
        break;
    }

    return result;
  }, [selectedCategory, maxPrice, sortBy]);

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
                    {SHOP_CATEGORIES.find((c) => c.key === selectedCategory)?.label}
                  </span>
                </>
              )}
            </nav>

            {/* Sorting Dropdown */}
            <div className="shop-sort-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="shop-sort-select"
                aria-label="مرتب‌سازی محصولات"
              >
                <option value="default">مرتب‌سازی پیش‌فرض</option>
                <option value="rating">مرتب‌سازی بر اساس محبوبیت</option>
                <option value="discount">مرتب‌سازی بر اساس بیشترین تخفیف</option>
                <option value="price-low">مرتب‌سازی بر اساس ارزان‌ترین</option>
                <option value="price-high">مرتب‌سازی بر اساس گران‌ترین</option>
              </select>
              <svg
                className="shop-sort-chevron"
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
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
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
                    width: `${Math.min(100, (maxPrice / 56210000) * 100)}%`,
                    right: 0,
                  }}
                />
                <input
                  type="range"
                  min="500000"
                  max="56210000"
                  step="200000"
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
                  {SHOP_CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
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
                {SHOP_CATEGORIES.map((cat) => (
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
            {filteredProducts.length === 0 ? (
              <div className="shop-empty-state">
                <h3>هیچ محصولی با این فیلتر یافت نشد</h3>
                <p>لطفاً بازه قیمت را تغییر داده یا دسته‌بندی دیگری انتخاب نمایید.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(56210000);
                  }}
                  className="shop-reset-btn"
                >
                  مشاهده همه محصولات
                </button>
              </div>
            ) : (
              <div className="shop-grid">
                {filteredProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    className="shop-card"
                    title={prod.title}
                  >
                    {/* Discount Badge */}
                    {prod.badge && <span className="shop-badge-discount">{prod.badge}</span>}

                    {/* Bottle Image */}
                    <div className="shop-card-image-box">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="shop-card-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="shop-card-content">
                      <h3 className="shop-card-title">{prod.title}</h3>

                      <div className="shop-card-prices">
                        {prod.originalPrice > prod.price && (
                          <span className="shop-old-price">
                            {formatNumber(prod.originalPrice)} تومان
                          </span>
                        )}
                        <span className="shop-current-price">
                          {formatNumber(prod.price)} تومان
                        </span>
                      </div>
                    </div>
                  </Link>
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
