"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart";
import { COMPARE_CHANGED_EVENT, getCompare } from "../lib/compare";
import { WISHLIST_CHANGED_EVENT, getWishlist } from "../lib/wishlist";
import { LocaleCurrencySelector } from "./localization/locale-currency-selector";
import { SkinDiagnosticDrawer } from "./skin-diagnostic-drawer";
import { useCustomerSession } from "../lib/customer-session";
import { maskIranianMobile } from "@commerce-os/localization";

export function SiteHeader() {
  const { session: customerSession } = useCustomerSession();
  const { itemCount, isReady, openDrawer } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<Record<string, boolean>>({
    reeskin: true,
    concerns: false,
    reemed: false,
    science: false,
    about: false,
  });
  const [diagnosticDrawerOpen, setDiagnosticDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const subnavRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileAccordion = (section: string) => {
    setMobileAccordion((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDropdownEnter = (name: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const handleDropdownToggle = (name: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    // If user explicitly clicks the trigger, ensure it opens (or toggles if already opened via click)
    setOpenDropdown(name);
  };

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
        setOpenDropdown(null);
        setDiagnosticDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (subnavRef.current && !subnavRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
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
              <span className="promo-text">ارسال در بسته‌بندی ایزوترمال با ژل یخ دارویی</span>
            </div>

            <div className="promo-divider-bullet" aria-hidden="true">•</div>

            <div className="promo-item">
              <span className="promo-badge-secondary">ارسال رایگان</span>
              <span className="promo-text">سفارش‌های تخصصی بالای ۱٬۵۰۰٬۰۰۰ تومان</span>
            </div>

            <div className="promo-divider-bullet" aria-hidden="true">•</div>

            {/* Interactive Skin Diagnostic CTA Button */}
            <button
              type="button"
              onClick={() => setDiagnosticDrawerOpen(true)}
              className="promo-diagnostic-cta"
              aria-label="مشاوره آنلاین هوشمند پوست و نسخه اختصاصی"
            >
              <span className="promo-pulse-ring" aria-hidden="true"></span>
              <span>مشاوره آنلاین پوست</span>
              <span className="promo-cta-hint">(تشخیص ۳ مرحله‌ای)</span>
            </button>
          </div>

          <div className="promo-actions">
            <LocaleCurrencySelector compact className="promo-locale-selector" />
            <span className="promo-sep" aria-hidden="true">|</span>
            <a href="tel:02188880000" className="promo-hotline" dir="ltr" aria-label="تلفن مشاوره بالینی ۰۲۱-۸۸۸۸۰۰۰۰">
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
              <img
                src="/dr-dermer-logo.png"
                alt="Dr. Dermer - Science. Skincare. Confidence."
                className="brand-logo-img"
                width={190}
                height={38}
                fetchPriority="high"
              />
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
            <Link
              href="/account"
              className={`header-action-btn ${customerSession ? "header-action-authed" : ""}`}
              aria-label={
                customerSession
                  ? (customerSession.user.fullName
                      ? customerSession.user.fullName.split(" ")[0]
                      : maskIranianMobile(customerSession.user.phone))
                  : "ورود / حساب"
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {customerSession ? (
                <span className="action-label authed-user-label">
                  <span className="authed-online-dot" aria-hidden="true"></span>
                  <span className="authed-name-truncate">
                    {customerSession.user.fullName
                      ? customerSession.user.fullName.split(" ")[0]
                      : maskIranianMobile(customerSession.user.phone)}
                  </span>
                </span>
              ) : (
                <span className="action-label">ورود / حساب</span>
              )}
            </Link>

            <Link href="/wishlist" className="header-action-btn" aria-label="علاقه‌مندی‌ها">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="action-label">علاقه‌مندی‌ها</span>
              {wishlistCount > 0 && <span className="action-badge pulse-badge">{wishlistCount}</span>}
            </Link>

            <Link href="/compare" className="header-action-btn" aria-label="مقایسه">
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
              aria-label="سبد نسخه"
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

        {/* ── 3. Six-Tier Clean Clinical Navigation (Blueprint 4.1 Architecture) ── */}
        <nav className="header-subnav" ref={subnavRef} aria-label="دسته‌بندی‌های تخصصی و علمی">
          <div className="subnav-inner">
            {/* Tier 1: Products & Home Care (ReeSkin) */}
            <div
              className={`subnav-dropdown-trigger ${openDropdown === "products" ? "active" : ""}`}
              onMouseEnter={() => handleDropdownEnter("products")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="subnav-link"
                onClick={() => handleDropdownToggle("products")}
                aria-expanded={openDropdown === "products"}
              >
                <span>محصولات (ReeSkin™)</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className="subnav-mega-menu">
                <div className="mega-grid-layout">
                  {/* Col 1: Links */}
                  <div className="mega-col">
                    <div className="mega-col-heading">فرمولاسیون‌های مراقبت خانگی ReeSkin™</div>
                    <div className="mega-links-list">
                      <Link href="/carboxygel" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>ژل کربوکسی‌تراپی CarboxyGel™</strong>
                        <span>تحریک اثر بوهر با ۳ فرمولاسیون گلیکولیک، آزالائیک و مولتی‌اکتیو</span>
                      </Link>
                      <Link href="/carboxypod" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>پادهای فعال‌ساز CarboxyPod™</strong>
                        <span>کپسول‌های فعال‌ساز گاز CO₂ در انواع Vitamin، Carbon و Hydra</span>
                      </Link>
                      <Link href="/carboxypad" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>پدهای آلکالاین صورت و گردن CarboxyPad™</strong>
                        <span>ماسک‌های ارگونومیک رهایش یکدست دی‌اکسید کربن</span>
                      </Link>
                      <Link href="/crystalene" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>خمیر لایه‌بردار کریستالین Crystalene™</strong>
                        <span>میکرودرم ابریشمی با کریستال‌های فوق‌ریز آلومینا و نیاسینامید</span>
                      </Link>
                      <Link href="/healene" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>ژل تسکین‌بخش هیلین Healene™</strong>
                        <span>التیام فوری قرمزی، پانتنول، نیاسینامید و عصاره‌های آرام‌بخش</span>
                      </Link>
                      <Link href="/silicalene" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>اسکراب دتوکس سیلیکالین Silicalene™</strong>
                        <span>تخلیه عمقی منافذ با کره‌های سیلیکا و کربن فعال</span>
                      </Link>
                    </div>
                  </div>

                  {/* Col 2: Feature Preview Card */}
                  <div className="mega-col">
                    <div className="mega-preview-card reeskin-theme">
                      <span className="mpc-badge green">HERO REGIMEN 2026</span>
                      <div className="mpc-image-wrap">
                        <img
                          src="/assets/drdermer/2025/07/azelaic-acid-carboxygel-207x300.png"
                          alt="Azelaic Acid CarboxyGel"
                          className="mpc-thumb-img"
                        />
                      </div>
                      <h4 className="mpc-title">کربوکسی‌ژل هدفمند آزالائیک</h4>
                      <p className="mpc-desc">
                        تحریک رهاسازی اکسیژن با اثر بوهر در کنار مهار اختصاصی آنزیم تیروزیناز برای درمان قطعی لک‌های مقاوم
                      </p>
                      <Link href="/reeskin" className="mpc-cta-link" onClick={() => setOpenDropdown(null)}>
                        کاتالوگ کامل و شوکیس ReeSkin ←
                      </Link>
                    </div>
                  </div>

                  {/* Col 3: Clinical Specs */}
                  <div className="mega-col">
                    <div className="mega-spec-col">
                      <div className="mega-col-heading">استانداردهای مراقبت خانگی</div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>فرمولاسیون بافرشده فیزیولوژیک pH 3.8</span>
                      </div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>شاخص تحریک سطحی صفر درصد (Zero Downtime)</span>
                      </div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>تحویل با نظارت زنجیره سرمایی (Cold-Chain)</span>
                      </div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>ثبت‌شده در پورتال لوازم آرایشی اروپا (CPNP)</span>
                      </div>
                      <div className="spec-bottom-note">
                        <Link href="/reeskin" style={{ color: "var(--brand)", fontWeight: 700 }}>
                          مشاهده خانواده برند ReeSkin™ ←
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 2: Skin Concerns (راهکارهای پوستی) */}
            <div
              className={`subnav-dropdown-trigger ${openDropdown === "concerns" ? "active" : ""}`}
              onMouseEnter={() => handleDropdownEnter("concerns")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="subnav-link"
                onClick={() => handleDropdownToggle("concerns")}
                aria-expanded={openDropdown === "concerns"}
              >
                <span>راهکارهای پوستی</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className="subnav-dropdown-menu categories-menu">
                <div className="categories-grid-dropdown">
                  <Link href="/search?q=کربوکسی" className="cat-drop-link" onClick={() => setOpenDropdown(null)}>
                    <span className="cat-drop-dot" style={{ background: "#14B8A6" }}></span>
                    <div>
                      <strong>کربوکسی‌تراپی و اکسیژناسیون</strong>
                      <small>انفوزیون ترابافتی CO₂ و تحریک اثر بوهر</small>
                    </div>
                  </Link>
                  <Link href="/search?q=پپتید" className="cat-drop-link" onClick={() => setOpenDropdown(null)}>
                    <span className="cat-drop-dot" style={{ background: "#10B981" }}></span>
                    <div>
                      <strong>جوانسازی و پپتیدهای ضدپیری</strong>
                      <small>ماتریکسیل، آرژیرلین، پپتید مس و EGF</small>
                    </div>
                  </Link>
                  <Link href="/search?q=سرامید" className="cat-drop-link" onClick={() => setOpenDropdown(null)}>
                    <span className="cat-drop-dot" style={{ background: "#F59E0B" }}></span>
                    <div>
                      <strong>ترمیم سد دفاعی اپیدرم</strong>
                      <small>سرامید NP کمپلکس، اکتوئین و بپانتن</small>
                    </div>
                  </Link>
                  <Link href="/search?q=روشن+کننده" className="cat-drop-link" onClick={() => setOpenDropdown(null)}>
                    <span className="cat-drop-dot" style={{ background: "#8B5CF6" }}></span>
                    <div>
                      <strong>درمان لک و تیرگی ملاسما</strong>
                      <small>ترانگزامیک اسید، آربوتین و ویتامین C پایدار</small>
                    </div>
                  </Link>
                  <Link href="/search?q=آکنه" className="cat-drop-link" onClick={() => setOpenDropdown(null)}>
                    <span className="cat-drop-dot" style={{ background: "#0EA5E9" }}></span>
                    <div>
                      <strong>کنترل آکنه و تنظیم سبوم</strong>
                      <small>سالیسیلیک اسید BHA و زینک PCA دارویی</small>
                    </div>
                  </Link>
                  <Link href="/subscriptions" className="cat-drop-link" onClick={() => setOpenDropdown(null)}>
                    <span className="cat-drop-dot" style={{ background: "#EC4899" }}></span>
                    <div>
                      <strong>اشتراک دوره‌ای نسخه</strong>
                      <small>تکرار منظم روتین پوستی با تخفیف دائمی</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tier 3: Skincare Science & Clinical Knowledge (دانش و پژوهش پوست) */}
            <div
              className={`subnav-dropdown-trigger ${openDropdown === "science" ? "active" : ""}`}
              onMouseEnter={() => handleDropdownEnter("science")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="subnav-link"
                onClick={() => handleDropdownToggle("science")}
                aria-expanded={openDropdown === "science"}
              >
                <span>دانش و پژوهش بالینی</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className="subnav-mega-menu">
                <div className="mega-grid-academy">
                  {/* Col 1: Links */}
                  <div className="mega-col">
                    <div className="mega-col-heading">پایگاه دانش بالینی و درماتولوژی</div>
                    <div className="mega-links-list">
                      <Link href="/#science" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>علم و مکانیسم فیزیولوژیک اثر بوهر (Bohr Effect)</strong>
                        <span>مبانی بیوشیمیایی نوسازی هموگلوبین و اکسیژناسیون سلولی بدون سوزن</span>
                      </Link>
                      <Link href="/ingredients" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>دانشنامه ترکیبات فعال (INCI Explorer)</strong>
                        <span>تحلیل فارماکولوژی، گرید دارویی و شاخص ایمنی ترکیبات فعال</span>
                      </Link>
                      <Link href="/#clinical-results" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>شواهد بالینی و ارزیابی درماتولوژی</strong>
                        <span>تصویربرداری Visia و نتایج آزمون‌های دوسوکور کلینیکال</span>
                      </Link>
                      <Link href="/blog" className="mega-link-item" onClick={() => setOpenDropdown(null)}>
                        <strong>ژورنال علمی درماتولوژی</strong>
                        <span>مجموعه مقالات پژوهشی، راهنماهای روتین و تازه‌های سلامت پوست</span>
                      </Link>
                    </div>
                  </div>

                  {/* Col 2: Feature Preview Card */}
                  <div className="mega-col">
                    <div className="mega-preview-card academy-theme">
                      <span className="mpc-badge gold">CLINICAL MONOGRAPH</span>
                      <div className="mpc-image-wrap">
                        <img
                          src="/assets/drdermer/2025/07/azelaic-acid-carboxygel-207x300.png"
                          alt="CarboxyGel Clinical Monograph"
                          className="mpc-thumb-img"
                        />
                      </div>
                      <h4 className="mpc-title">پرونده زیست‌شیمیایی CarboxyGel</h4>
                      <p className="mpc-desc">
                        آشنایی با فرمولاسیون‌های ۲ فاز ترابافتی و نحوه فعال‌سازی رهایش اکسیژن بافتی بدون هیچ‌گونه تهاجم
                      </p>
                      <Link href="/carboxygel" className="mpc-cta-link" onClick={() => setOpenDropdown(null)}>
                        مطالعه پرونده کامل CarboxyGel ←
                      </Link>
                    </div>
                  </div>

                  {/* Col 3: Standards Specs */}
                  <div className="mega-col">
                    <div className="mega-spec-col">
                      <div className="mega-col-heading">استانداردهای علمی و پژوهشی</div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>استاندارد فارماکوپه انگلستان (BP)</span>
                      </div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>گواهینامه تولید پاکیزه ISO 22716 GMP</span>
                      </div>
                      <div className="spec-bullet-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>پشتیبانی و پاسخگویی دپارتمان علمی</span>
                      </div>
                      <div className="spec-bottom-note">
                        مطابق با پروتکل‌های انجمن درماتولوژی اروپا EADV
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 4: About Us (درباره ما) */}
            <div
              className={`subnav-dropdown-trigger ${openDropdown === "about" ? "active" : ""}`}
              onMouseEnter={() => handleDropdownEnter("about")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="subnav-link"
                onClick={() => handleDropdownToggle("about")}
                aria-expanded={openDropdown === "about"}
              >
                <span>درباره ما</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className="subnav-dropdown-menu luxury-menu" style={{ minWidth: "300px" }}>
                <Link href="/about" className="dropdown-item brand-item" onClick={() => setOpenDropdown(null)}>
                  <div className="item-content">
                    <strong>درباره کمپانی Dr Dermer UK</strong>
                    <p>تاریخچه، آزمایشگاه‌های انگلستان، فلسفه فرمولاسیون و استانداردها</p>
                  </div>
                </Link>
                <div className="dropdown-divider" aria-hidden="true"></div>
                <Link href="/contact" className="dropdown-item brand-item" onClick={() => setOpenDropdown(null)}>
                  <div className="item-content">
                    <strong>تماس و پشتیبانی مشتریان</strong>
                    <p>مشاوره دارویی، ثبت عوارض ناخواسته و آدرس دفتر مرکزی</p>
                  </div>
                </Link>
                <div className="dropdown-divider" aria-hidden="true"></div>
                <Link href="/faq" className="dropdown-item brand-item" onClick={() => setOpenDropdown(null)}>
                  <div className="item-content">
                    <strong>پرسش‌های متداول (FAQ)</strong>
                    <p>پاسخ‌های تخصصی پیرامون اثربخشی، نحوه مصرف و عوارض احتمالی</p>
                  </div>
                </Link>
              </div>
            </div>
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

            {/* Mobile Diagnostic CTA Banner */}
            <div className="drawer-section" style={{ padding: "16px 20px 0" }}>
              <button
                type="button"
                style={{
                  background: "var(--surface-soft)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  width: "100%",
                  textAlign: "right",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  boxShadow: "var(--shadow-sm)"
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDiagnosticDrawerOpen(true);
                }}
              >
                <div style={{ color: "var(--color-brand-forest)", fontWeight: 800, fontSize: "0.95rem" }}>
                  مشاوره آنلاین هوشمند پوست (تشخیص ۳ مرحله‌ای)
                </div>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem", margin: 0, lineHeight: 1.6 }}>
                  تعیین پروتکل بهینه CarboxyGel و پاد فعال‌ساز همگام با نوع پوست شما
                </p>
                <span style={{ color: "var(--color-brand-forest)", fontWeight: 700, fontSize: "0.82rem", marginTop: "4px" }}>
                  شروع مشاوره تخصصی ←
                </span>
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="mobile-drawer-content">
              {/* 1. Products & Home Care */}
              <div className="drawer-section">
                <button
                  type="button"
                  className={`drawer-section-btn ${mobileAccordion.reeskin ? "open" : ""}`}
                  onClick={() => toggleMobileAccordion("reeskin")}
                >
                  <div className="drawer-section-title">
                    <span>۱. محصولات مراقبت خانگی (ReeSkin™)</span>
                    <span className="drawer-section-toggle-icon">▼</span>
                  </div>
                </button>
                {mobileAccordion.reeskin && (
                  <div className="drawer-section-body">
                    <div className="drawer-brand-cards" style={{ marginBottom: "12px" }}>
                      <Link
                        href="/reeskin"
                        className="drawer-brand-card reeskin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="dbc-tag">HOME REGIMEN</div>
                        <strong>ReeSkin™ Clinical</strong>
                        <small>کیت‌های خانگی، ترمیم سد دفاعی و پپتیدها</small>
                      </Link>
                    </div>
                    <nav className="drawer-nav-list">
                      <Link href="/carboxygel" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>ژل کربوکسی‌تراپی CarboxyGel™</span>
                      </Link>
                      <Link href="/carboxypod" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>پادهای فعال‌ساز CarboxyPod™</span>
                      </Link>
                      <Link href="/carboxypad" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>پدهای آلکالاین CarboxyPad™</span>
                      </Link>
                      <Link href="/crystalene" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>خمیر لایه‌بردار کریستالین Crystalene™</span>
                      </Link>
                      <Link href="/healene" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>ژل تسکین‌بخش هیلین Healene™</span>
                      </Link>
                      <Link href="/silicalene" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>اسکراب دتوکس سیلیکالین Silicalene™</span>
                      </Link>
                    </nav>
                  </div>
                )}
              </div>

              {/* 2. Skin Concerns */}
              <div className="drawer-section">
                <button
                  type="button"
                  className={`drawer-section-btn ${mobileAccordion.concerns ? "open" : ""}`}
                  onClick={() => toggleMobileAccordion("concerns")}
                >
                  <div className="drawer-section-title">
                    <span>۲. راهکارهای پوستی (بر پایه نیاز)</span>
                    <span className="drawer-section-toggle-icon">▼</span>
                  </div>
                </button>
                {mobileAccordion.concerns && (
                  <div className="drawer-section-body">
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
                        <span>اشتراک دوره‌ای نسخه</span>
                        <span className="dnl-tag discount">تخفیف دائمی</span>
                      </Link>
                    </nav>
                  </div>
                )}
              </div>

              {/* 3. Professional Formulations (ReeMed) */}
              <div className="drawer-section">
                <button
                  type="button"
                  className={`drawer-section-btn ${mobileAccordion.reemed ? "open" : ""}`}
                  onClick={() => toggleMobileAccordion("reemed")}
                >
                  <div className="drawer-section-title">
                    <span>۳. کیت‌های تخصصی (ReeMed™)</span>
                    <span className="drawer-section-toggle-icon">▼</span>
                  </div>
                </button>
                {mobileAccordion.reemed && (
                  <div className="drawer-section-body">
                    <div className="drawer-brand-cards" style={{ marginBottom: "12px" }}>
                      <Link
                        href="/reemed"
                        className="drawer-brand-card reemed"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="dbc-tag medical">CLINICAL KITS</div>
                        <strong>ReeMed™ Clinical Solutions</strong>
                        <small>شیت‌های آناتومیک CarboxyPad و پادهای ترابافتی</small>
                      </Link>
                    </div>
                    <nav className="drawer-nav-list">
                      <Link href="/carboxypad" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>ماسک‌ها و شیت‌های صورت و گردن CarboxyPad™</span>
                      </Link>
                      <Link href="/carboxypod" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>کپسول‌های فعال‌ساز ترابافتی CarboxyPod™</span>
                      </Link>
                      <Link href="/carboxygel" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>ژل‌های تخصصی کربوکسی‌تراپی ۲ فاز</span>
                      </Link>
                    </nav>
                  </div>
                )}
              </div>

              {/* 4. Science & Clinical Knowledge */}
              <div className="drawer-section">
                <button
                  type="button"
                  className={`drawer-section-btn ${mobileAccordion.science ? "open" : ""}`}
                  onClick={() => toggleMobileAccordion("science")}
                >
                  <div className="drawer-section-title">
                    <span>۴. دانش و پژوهش بالینی</span>
                    <span className="drawer-section-toggle-icon">▼</span>
                  </div>
                </button>
                {mobileAccordion.science && (
                  <div className="drawer-section-body">
                    <nav className="drawer-nav-list">
                      <Link href="/#science" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>علم و مکانیسم اثر بوهر (Bohr Effect)</span>
                      </Link>
                      <Link href="/ingredients" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>دانشنامه ترکیبات فعال (INCI)</span>
                      </Link>
                      <Link href="/#clinical-results" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>شواهد بالینی و سنجش Visia</span>
                      </Link>
                      <Link href="/blog" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>ژورنال علمی درماتولوژی</span>
                      </Link>
                    </nav>
                  </div>
                )}
              </div>

              {/* 5. About & Support */}
              <div className="drawer-section">
                <button
                  type="button"
                  className={`drawer-section-btn ${mobileAccordion.about ? "open" : ""}`}
                  onClick={() => toggleMobileAccordion("about")}
                >
                  <div className="drawer-section-title">
                    <span>۶. درباره ما و پشتیبانی</span>
                    <span className="drawer-section-toggle-icon">▼</span>
                  </div>
                </button>
                {mobileAccordion.about && (
                  <div className="drawer-section-body">
                    <nav className="drawer-nav-list">
                      <Link href="/about" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>درباره کمپانی Dr Dermer UK</span>
                      </Link>
                      <Link href="/contact" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>تماس و پشتیبانی مشتریان</span>
                      </Link>
                      <Link href="/faq" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        <span>پرسش‌های متداول (FAQ)</span>
                      </Link>
                    </nav>
                  </div>
                )}
              </div>

              {/* Account Quick Shortcuts */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  {customerSession ? `حساب: ${customerSession.user.fullName || maskIranianMobile(customerSession.user.phone)}` : "حساب کاربری و سوابق"}
                </div>
                <div className="drawer-quick-actions">
                  <Link href="/account" className="dqa-btn" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>{customerSession ? "پروفایل من" : "ورود به حساب"}</span>
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

      {/* ── 5. Intelligent Skin Diagnostic Consultation Drawer ── */}
      <SkinDiagnosticDrawer
        isOpen={diagnosticDrawerOpen}
        onClose={() => setDiagnosticDrawerOpen(false)}
      />
    </>
  );
}
