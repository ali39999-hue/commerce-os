"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart";
import { COMPARE_CHANGED_EVENT, getCompare } from "../lib/compare";
import { WISHLIST_CHANGED_EVENT, getWishlist } from "../lib/wishlist";
import { LocaleCurrencySelector } from "./localization/locale-currency-selector";

export function SiteHeader() {
  const { itemCount, isReady, openDrawer } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const brandMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncWishlist = () => setWishlistCount(getWishlist().length);
    const syncCompare = () => setCompareCount(getCompare().length);
    const syncAll = () => {
      syncWishlist();
      syncCompare();
    };
    syncWishlist();
    syncCompare();
    window.addEventListener(WISHLIST_CHANGED_EVENT, syncWishlist);
    window.addEventListener(COMPARE_CHANGED_EVENT, syncCompare);
    window.addEventListener("storage", syncAll);
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncWishlist);
      window.removeEventListener(COMPARE_CHANGED_EVENT, syncCompare);
      window.removeEventListener("storage", syncAll);
    };
  }, []);

  // Handle sticky scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle ESC key for mobile drawer & dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setBrandDropdownOpen(false);
        setCategoryDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (brandMenuRef.current && !brandMenuRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push("/#featured-products");
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* ── 1. Top Clinical Announcement & Utility Bar ── */}
      <aside className="promo-banner" aria-label="اطلاعیه ویژه و خدمات بالینی">
        <div className="promo-banner-inner">
          <div className="promo-highlights">
            <div className="promo-item promo-cold-chain">
              <span className="promo-badge cold-chain-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
                زنجیره سرمایی (Cold-Chain)
              </span>
              <span className="promo-text">تحویل با بسته‌بندی عایق حرارتی برای حفظ فعالیت بیولوژیک پپتیدها</span>
            </div>

            <div className="promo-divider-bullet" aria-hidden="true">•</div>

            <div className="promo-item">
              <span className="promo-badge-secondary">ارسال رایگان</span>
              <span className="promo-text">سفارش‌های تخصصی بالای ۱٬۵۰۰٬۰۰۰ تومان</span>
            </div>
          </div>

          <div className="promo-actions">
            <Link href="/b2b" className="promo-clinic-link">
              <span className="promo-dot pulse" aria-hidden="true"></span>
              <span>پورتال تأمین مطب‌ها و کلینیک‌ها (ReeMed B2B)</span>
            </Link>
            <span className="promo-sep" aria-hidden="true">|</span>
            <LocaleCurrencySelector compact className="promo-locale-selector" />
            <span className="promo-sep" aria-hidden="true">|</span>
            <a href="tel:02188880000" className="promo-hotline" dir="ltr" aria-label="تلفن مشاوره بالینی">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              ۰۲۱-۸۸۸۸۰۰۰۰
            </a>
          </div>
        </div>
      </aside>

      {/* ── 2. Sticky Glassmorphism Header ── */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          {/* Brand Group */}
          <div className="header-brand-group">
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? "بستن منوی ناوبری" : "باز کردن منوی دسته‌بندی‌ها"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            <Link className="brand" href="/" aria-label="دکتر درمر - صفحه اصلی">
              <div className="brand-title-wrap">
                <span className="brand-primary">DR. DERMER</span>
                <span className="brand-lab-badge">UK CLINICAL LABS</span>
              </div>
              <span className="brand-sub">TRANSDERMAL CO₂ & BIOMIMETIC PEPTIDES</span>
            </Link>
          </div>

          {/* Clinical Search Input */}
          <form onSubmit={handleSearch} className="header-search-form" role="search">
            <input
              type="search"
              placeholder="جست‌وجوی پروتکل، محصول یا ترکیب (کربوکسی، رتینول، پپتید، سرامید…)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="header-search-input"
              aria-label="جست‌وجوی محصولات، مواد مؤثره و مقالات بالینی"
            />
            <button type="submit" className="header-search-btn" aria-label="اجرای جست‌وجو">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Action Hub */}
          <div className="header-actions">
            <Link href="/account" className="header-action-btn" aria-label="پورتال کاربری و پرونده نسخه">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="action-label">حساب من</span>
            </Link>

            <Link href="/wishlist" className="header-action-btn" aria-label="محصولات ذخیره‌شده و علاقه‌مندی‌ها">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="action-label">علاقه‌مندی‌ها</span>
              {wishlistCount > 0 && <span className="action-badge pulse-badge">{wishlistCount}</span>}
            </Link>

            <Link href="/compare" className="header-action-btn" aria-label="مقایسه فرمولاسیون و ترکیبات">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
              </svg>
              <span className="action-label">مقایسه</span>
              {compareCount > 0 && <span className="action-badge">{compareCount}</span>}
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="cart-trigger clinical-cart-btn"
              aria-label="مشاهده سبد خرید و نسخه درمانی"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-label">سبد نسخه</span>
              {isReady && itemCount > 0 && (
                <span className="cart-badge badge-animated">{itemCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* ── 3. Multi-Tier Secondary Clinical Sub-navigation ── */}
        <nav className="header-subnav" aria-label="دسته‌بندی‌های تخصصی و علمی">
          <div className="subnav-inner">
            {/* Brand Family Mega Dropdown */}
            <div
              className={`subnav-dropdown-trigger ${brandDropdownOpen ? "active" : ""}`}
              ref={brandMenuRef}
              onMouseEnter={() => setBrandDropdownOpen(true)}
              onMouseLeave={() => setBrandDropdownOpen(false)}
            >
              <button
                type="button"
                className="subnav-link highlight"
                onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                aria-expanded={brandDropdownOpen}
              >
                <span>خانواده برندها (Brand Families)</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className="subnav-dropdown-menu luxury-menu">
                <Link
                  href="/#brands"
                  className="dropdown-item brand-item reeskin"
                  onClick={() => setBrandDropdownOpen(false)}
                >
                  <div className="item-icon-tag reeskin-tag">HOME CLINICAL</div>
                  <div className="item-content">
                    <strong>ReeSkin™ Clinical Regimen</strong>
                    <p>مراقبت خانگی تخصصی، ترمیم سد دفاعی لیپیدی، کیت CarboxyGel و سرم‌های پپتیدی</p>
                    <span className="item-action-hint">مشاهده محصولات خانگی ←</span>
                  </div>
                </Link>

                <div className="dropdown-divider" aria-hidden="true"></div>

                <Link
                  href="/#brands"
                  className="dropdown-item brand-item reemed"
                  onClick={() => setBrandDropdownOpen(false)}
                >
                  <div className="item-icon-tag reemed-tag">CLINIC PRO</div>
                  <div className="item-content">
                    <strong>ReeMed™ Medical Pro</strong>
                    <p>پروتکل‌های کربوکسی‌تراپی مطبی، پادهای ترابافتی CarboxyPod و سیستم‌های کلینیکال</p>
                    <span className="item-action-hint">پورتال ملزومات پزشکی ←</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Clinical Categories Dropdown */}
            <div
              className={`subnav-dropdown-trigger ${categoryDropdownOpen ? "active" : ""}`}
              ref={categoryMenuRef}
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                className="subnav-link"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                aria-expanded={categoryDropdownOpen}
              >
                <span>دسته‌بندی‌های درمانی</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className="subnav-dropdown-menu categories-menu">
                <div className="categories-grid-dropdown">
                  <Link href="/search?q=کربوکسی" className="cat-drop-link" onClick={() => setCategoryDropdownOpen(false)}>
                    <span className="cat-drop-dot" style={{ background: "#14B8A6" }}></span>
                    <div>
                      <strong>کربوکسی‌تراپی CO2</strong>
                      <small>انفوزیون ترابافتی و ژل اکسیژن</small>
                    </div>
                  </Link>
                  <Link href="/search?q=پپتید" className="cat-drop-link" onClick={() => setCategoryDropdownOpen(false)}>
                    <span className="cat-drop-dot" style={{ background: "#10B981" }}></span>
                    <div>
                      <strong>پپتیدها و جوانسازی</strong>
                      <small>ماتریکسیل، آرژیرلین، فاکتور EGF</small>
                    </div>
                  </Link>
                  <Link href="/search?q=سرامید" className="cat-drop-link" onClick={() => setCategoryDropdownOpen(false)}>
                    <span className="cat-drop-dot" style={{ background: "#F59E0B" }}></span>
                    <div>
                      <strong>ترمیم سد دفاعی</strong>
                      <small>سرامید NP، اکتوئین و بپانتن</small>
                    </div>
                  </Link>
                  <Link href="/search?q=روشن+کننده" className="cat-drop-link" onClick={() => setCategoryDropdownOpen(false)}>
                    <span className="cat-drop-dot" style={{ background: "#8B5CF6" }}></span>
                    <div>
                      <strong>درمان لک و ملاسما</strong>
                      <small>ترانگزامیک اسید و ویتامین C</small>
                    </div>
                  </Link>
                  <Link href="/search?q=آکنه" className="cat-drop-link" onClick={() => setCategoryDropdownOpen(false)}>
                    <span className="cat-drop-dot" style={{ background: "#0EA5E9" }}></span>
                    <div>
                      <strong>کنترل آکنه و چربی</strong>
                      <small>سالیسیلیک اسید و زینک PCA</small>
                    </div>
                  </Link>
                  <Link href="/subscriptions" className="cat-drop-link" onClick={() => setCategoryDropdownOpen(false)}>
                    <span className="cat-drop-dot" style={{ background: "#EC4899" }}></span>
                    <div>
                      <strong>اشتراک دوره‌ای نسخه</strong>
                      <small>تکرار منظم پروتکل با تخفیف دائمی</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/#science" className="subnav-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <span>دانش و اثر بوهر (Bohr Effect)</span>
            </Link>

            <Link href="/academy" className="subnav-link">
              <span>آکادمی و پروتکل‌ها</span>
            </Link>

            <Link href="/ingredients" className="subnav-link">
              <span>دانشنامه ترکیبات (INCI)</span>
            </Link>

            <Link href="/#clinical-results" className="subnav-link">
              <span>شواهد بالینی و ارزیابی پزشکان</span>
            </Link>

            <Link href="/b2b" className="subnav-link b2b-nav-badge">
              <span className="pulse-mini-dot" aria-hidden="true"></span>
              <span>پورتال پزشکان و کلینیک‌ها (B2B)</span>
            </Link>

            <Link href="/blog" className="subnav-link">
              <span>ژورنال علمی</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── 4. Mobile Navigation Drawer (Luxury Clinical Slide-in) ── */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="mobile-drawer-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="منوی ناوبری موبایل"
          >
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="drawer-brand">
                <span className="drawer-brand-title">DR. DERMER</span>
                <span className="drawer-brand-badge">UK CLINICAL LABS</span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="بستن منو"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Search */}
            <div className="mobile-drawer-search">
              <form onSubmit={handleSearch} className="drawer-search-form" role="search">
                <input
                  type="search"
                  placeholder="جست‌وجوی محصول، ترکیب، پروتکل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="drawer-search-input"
                  aria-label="جست‌وجوی موبایل"
                />
                <button type="submit" className="drawer-search-submit" aria-label="جست‌وجو">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </form>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="mobile-drawer-content">
              {/* Brand Families Cards */}
              <div className="drawer-section">
                <div className="drawer-section-title">خانواده برندها (Brand Families)</div>
                <div className="drawer-brand-cards">
                  <Link
                    href="/#brands"
                    className="drawer-brand-card reeskin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="dbc-tag">HOME REGIMEN</div>
                    <strong>ReeSkin™ Clinical</strong>
                    <small>کیت‌های خانگی، ترمیم سد دفاعی و پپتیدها</small>
                  </Link>

                  <Link
                    href="/#brands"
                    className="drawer-brand-card reemed"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="dbc-tag medical">CLINIC PRO</div>
                    <strong>ReeMed™ Medical Pro</strong>
                    <small>پادهای ترابافتی CarboxyPod و تجهیزات کلینیک</small>
                  </Link>
                </div>
              </div>

              {/* Categories & Concerns */}
              <div className="drawer-section">
                <div className="drawer-section-title">دغدغه‌های بالینی پوست</div>
                <nav className="drawer-nav-list">
                  <Link href="/search?q=کربوکسی" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>کربوکسی‌تراپی CO2 و اثر بوهر</span>
                    <span className="dnl-tag">فناوری انحصاری</span>
                  </Link>
                  <Link href="/search?q=پپتید" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>پپتیدها و جوانسازی سلولی</span>
                  </Link>
                  <Link href="/search?q=سرامید" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>ترمیم سد دفاعی و بازسازی اپیدرم</span>
                  </Link>
                  <Link href="/search?q=روشن+کننده" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>درمان لک و تیرگی ملاسما</span>
                  </Link>
                  <Link href="/search?q=آکنه" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>کنترل آکنه و تنظیم سبوم</span>
                  </Link>
                  <Link href="/subscriptions" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>اشتراک دوره‌ای ترمیم و پروتکل‌ها</span>
                    <span className="dnl-tag discount">تخفیف دائمی</span>
                  </Link>
                </nav>
              </div>

              {/* Science & Academy */}
              <div className="drawer-section">
                <div className="drawer-section-title">دانش، آکادمی و مستندات</div>
                <nav className="drawer-nav-list">
                  <Link href="/#science" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>علم و اثر بوهر (Bohr Effect)</span>
                  </Link>
                  <Link href="/academy" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>آکادمی و پروتکل‌های گام‌به‌گام</span>
                  </Link>
                  <Link href="/ingredients" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>دانشنامه ترکیبات فعال (INCI)</span>
                  </Link>
                  <Link href="/#clinical-results" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>شواهد بالینی و تأییدیه پزشکان</span>
                  </Link>
                  <Link href="/blog" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <span>ژورنال علمی درماتولوژی</span>
                  </Link>
                </nav>
              </div>

              {/* Professional Clinic Section */}
              <div className="drawer-section">
                <div className="drawer-section-title">ویژه همکاران درمانی و پزشکان</div>
                <Link href="/b2b" className="drawer-b2b-banner" onClick={() => setMobileMenuOpen(false)}>
                  <div className="b2b-banner-title">پورتال اختصاصی کلینیک‌ها (ReeMed B2B)</div>
                  <p>تأمین عمده کارتریج‌ها و ژل‌های کلینیک با فاکتور رسمی و آموزش رایگان</p>
                  <span className="b2b-banner-cta">ورود به پورتال پزشکان ←</span>
                </Link>
              </div>

              {/* Account Quick Shortcuts */}
              <div className="drawer-section">
                <div className="drawer-section-title">حساب کاربری و سوابق</div>
                <div className="drawer-quick-actions">
                  <Link href="/account" className="dqa-btn" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>داشبورد کاربری</span>
                  </Link>
                  <Link href="/wishlist" className="dqa-btn" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>علاقه‌مندی‌ها ({wishlistCount})</span>
                  </Link>
                  <Link href="/compare" className="dqa-btn" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
                    </svg>
                    <span>مقایسه فرمول‌ها ({compareCount})</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer with Market Selector & Hotline */}
            <div className="mobile-drawer-footer">
              <div className="drawer-market-selector">
                <span className="dms-label">تنظیمات منطقه و ارز:</span>
                <LocaleCurrencySelector compact className="drawer-locale-picker" />
              </div>
              <div className="drawer-emergency-hotline">
                <span className="deh-label">پشتیبانی و ثبت عوارض (۲۴/۷):</span>
                <a href="tel:02188880001" dir="ltr" className="deh-phone">۰۲۱-۸۸۸۸۰۰۰۱</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
