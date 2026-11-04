"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "./cart";
import { COMPARE_CHANGED_EVENT, getCompare } from "../lib/compare";
import { WISHLIST_CHANGED_EVENT, getWishlist } from "../lib/wishlist";
import { LocaleCurrencySelector } from "./localization/locale-currency-selector";
import { SkinDiagnosticDrawer } from "./skin-diagnostic-drawer";

export function SiteHeader() {
  const cart = useCart();
  const { itemCount = 0, isReady = true, openDrawer } = cart ?? {};
  const computedTotal =
    cart?.calculations?.grandTotalTomans != null
      ? `${cart.calculations.grandTotalTomans.toLocaleString('fa-IR')} تومان`
      : '۰ تومان';
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const prevCountRef = useRef(itemCount);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (itemCount !== prevCountRef.current && isReady) {
      setIsCartBumping(true);
      timer = setTimeout(() => setIsCartBumping(false), 900);
      prevCountRef.current = itemCount;
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [itemCount, isReady]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const handleBump = () => {
      setIsCartBumping(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setIsCartBumping(false), 900);
    };
    window.addEventListener("commerce_os:cart_bump", handleBump);
    return () => {
      window.removeEventListener("commerce_os:cart_bump", handleBump);
      if (timer) clearTimeout(timer);
    };
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [diagnosticDrawerOpen, setDiagnosticDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<{ username: string; fullName?: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncWishlist = () => setWishlistCount(getWishlist().length);
    const syncCompare = () => setCompareCount(getCompare().length);
    const syncAuth = () => {
      try {
        const raw = localStorage.getItem("commerce_os.auth.user");
        if (raw) setAuthUser(JSON.parse(raw));
        else setAuthUser(null);
      } catch {
        setAuthUser(null);
      }
    };
    const syncAll = () => {
      syncWishlist();
      syncCompare();
      syncAuth();
    };
    syncWishlist();
    syncCompare();
    syncAuth();
    window.addEventListener(WISHLIST_CHANGED_EVENT, syncWishlist);
    window.addEventListener(COMPARE_CHANGED_EVENT, syncCompare);
    window.addEventListener("commerce_os:auth_change", syncAuth);
    window.addEventListener("storage", syncAll);
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncWishlist);
      window.removeEventListener(COMPARE_CHANGED_EVENT, syncCompare);
      window.removeEventListener("commerce_os:auth_change", syncAuth);
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

  // Handle ESC key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setDiagnosticDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  if (pathname === '/' || pathname === '/rupak' || pathname === '/auth' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      {/* ── 1. Top Clinical Announcement & Utility Bar ── */}
      <div className="rupak-store-topbar">
        <a href="tel:09358727492" className="rupak-phone-badge" title="پشتیبانی روپاک">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>کمک می‌خوای؟ ۰۹۳۵۸۷۲۷۴۹۲</span>
        </a>
        <div className="rupak-store-topbar-links">
          <span>ارسال سراسری به تمام نقاط ایران • ضمانت ۱۰۰٪ اصالت کالا</span>
        </div>
      </div>

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

            <Link className="rupak-brand-link" href="/" aria-label="فروشگاه روپاک - صفحه اصلی">
              <div className="rupak-logo-mark">
                <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 36V10C12 10 18 8 26 8C33 8 36 12 36 17C36 22 31 25 24 25" stroke="#1e293b" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 24L34 37" stroke="#1e293b" strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M23 15C25 12 29 11 31 13C33 15 32 19 28 21" stroke="#77B091" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="rupak-logo-text" style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.04em' }}>RUPAK</span>
            </Link>
          </div>

          {/* Clinical Search Input */}
          <form onSubmit={handleSearch} className="header-search-form" role="search">
            <input
              type="search"
              placeholder="جستجوی محصولات..."
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
          <div className="header-actions rupak-actions-style">
            {/* 1. Cart with amount pill (۰ تومان) */}
            <Link
              href="/cart"
              className={`rupak-header-cart-btn ${isCartBumping ? 'cart-bump-active' : ''}`}
              aria-label={`سبد خرید با ${itemCount} قلم کالا و مبلغ ${computedTotal}`}
            >
              <span className={`rupak-cart-amount ${isCartBumping ? 'amount-bump' : ''}`}>{computedTotal}</span>
              <div className="rupak-cart-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {isReady && itemCount > 0 && (
                  <span className={`rupak-cart-badge ${isCartBumping ? 'badge-pop' : ''}`} key={itemCount}>
                    {itemCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </div>
            </Link>

            {/* 2. Wishlist Heart Icon */}
            <Link href="/wishlist" className="rupak-header-icon-btn" aria-label="علاقه‌مندی‌ها">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="rupak-header-badge">{wishlistCount}</span>}
            </Link>

            {/* 3. Account User Icon / Login Pill */}
            {authUser ? (
              <Link
                href="/account"
                className="rupak-header-icon-btn rupak-auth-active"
                aria-label={`حساب کاربری: ${authUser.fullName || authUser.username}`}
                title={`حساب کاربری: ${authUser.fullName || authUser.username}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="rupak-auth-dot" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="rupak-header-auth-pill"
                aria-label="ورود و ثبت‌نام در سایت"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
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
            <div className="drawer-section" style={{ paddingBottom: 0 }}>
              <button
                type="button"
                className="drawer-b2b-banner"
                style={{
                  background: "linear-gradient(135deg, rgba(15, 118, 110, 0.15) 0%, rgba(20, 184, 166, 0.25) 100%)",
                  border: "1.5px solid rgba(45, 212, 191, 0.5)",
                  width: "100%",
                  textAlign: "right",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDiagnosticDrawerOpen(true);
                }}
              >
                <div className="b2b-banner-title" style={{ color: "var(--brand-deep)" }}>
                  مشاوره آنلاین هوشمند پوست (تشخیص ۳ مرحله‌ای)
                </div>
                <p>تعیین پروتکل بهینه CarboxyGel و پاد فعال‌ساز همگام با نوع پوست شما</p>
                <span className="b2b-banner-cta" style={{ color: "var(--brand)" }}>شروع مشاوره تخصصی ←</span>
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="mobile-drawer-content">
              {/* Brand Families Cards */}
              <div className="drawer-section">
                <div className="drawer-section-title">خانواده برندها (Brand Families)</div>
                <div className="drawer-brand-cards">
                  <Link
                    href="/reeskin"
                    className="drawer-brand-card reeskin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="dbc-tag">HOME REGIMEN</div>
                    <strong>ReeSkin™ Clinical</strong>
                    <small>کیت‌های خانگی، ترمیم سد دفاعی و پپتیدها</small>
                  </Link>

                  <Link
                    href="/reemed"
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
                  <Link href="/shop" className="drawer-nav-link" style={{ fontWeight: 700, color: '#477c60' }} onClick={() => setMobileMenuOpen(false)}>
                    <span>فروشگاه و آرشیو محصولات</span>
                    <span className="dnl-tag">همه کالاها</span>
                  </Link>
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
                  {authUser ? (
                    <Link href="/account" className="dqa-btn" onClick={() => setMobileMenuOpen(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>حساب: {authUser.fullName || authUser.username}</span>
                    </Link>
                  ) : (
                    <Link href="/auth" className="dqa-btn" onClick={() => setMobileMenuOpen(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      <span>ورود / ثبت‌نام</span>
                    </Link>
                  )}
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
