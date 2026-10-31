"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart";
import { COMPARE_CHANGED_EVENT, getCompare } from "../lib/compare";
import { WISHLIST_CHANGED_EVENT, getWishlist } from "../lib/wishlist";

export function SiteHeader() {
  const { itemCount, isReady, openDrawer } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/#featured-products");
    }
  };

  return (
    <>
      {/* ── Top Announcement Bar ── */}
      <aside className="promo-banner" aria-label="اطلاعیه ویژه فروشگاه">
        <div className="promo-banner-inner">
          <div className="promo-item">
            <span className="promo-badge">ارسال رایگان کلینیکال</span>
            <span>تحویل اکسپرس یخچال‌دار سفارش‌های بالای ۱٬۵۰۰٬۰۰۰ تومان</span>
          </div>
          <div className="promo-item promo-item-clinic">
            <span className="promo-dot" aria-hidden="true"></span>
            <span>تأمین مستقیم ملزومات مصرفی مطب و کلینیک با فاکتور رسمی</span>
          </div>
          <div className="promo-links">
            <Link href="/b2b" className="promo-sublink">پورتال پزشکان و کلینیک‌ها</Link>
            <span className="promo-sep">|</span>
            <a href="tel:02188880000" className="promo-sublink" dir="ltr">۰۲۱-۸۸۸۸۰۰۰۰</a>
          </div>
        </div>
      </aside>

      {/* ── Global Header with Luxury / Clinical brand navigation ── */}
      <header className="site-header">
        <div className="header-inner">
          <div className="header-brand-group">
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? "بستن منو" : "باز کردن منوی دسته‌بندی‌ها"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>

            <Link className="brand" href="/" aria-label="دکتر درمر - صفحه اصلی">
              <span className="brand-primary">DR. DERMER</span>
              <span className="brand-sub">CLINICAL SKINCARE · UK FORMULATION</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="header-search-form" role="search">
            <input
              type="search"
              placeholder="جست‌وجوی پروتکل، محصول یا ترکیب (کربوکسی، رتینول، پپتید…)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="header-search-input"
              aria-label="جست‌وجوی محصولات و مقالات بالینی"
            />
            <button type="submit" className="header-search-btn" aria-label="اجرای جست‌وجو">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <div className="header-actions">
            <Link href="/account" className="header-action-btn" aria-label="پورتال کاربری و تاریخچه نسخه">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="action-label">حساب من</span>
            </Link>

            <Link href="/wishlist" className="header-action-btn" aria-label="علاقه‌مندی‌ها">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            <Link href="/compare" className="header-action-btn" aria-label="مقایسه فرمولاسیون">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
              </svg>
              {compareCount > 0 && <span className="action-badge">{compareCount}</span>}
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="cart-trigger"
              aria-label="مشاهده سبد خرید"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-label">سبد نسخه</span>
              {isReady && itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
          </div>
        </div>

        {/* ── Secondary Clinical Sub-navigation ── */}
        <nav className={`header-subnav ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="دسته‌بندی‌های تخصصی">
          <div className="subnav-inner">
            <Link href="/#concerns" className="subnav-link" onClick={() => setMobileMenuOpen(false)}>
              دغدغه‌های پوستی
            </Link>
            <div className="subnav-dropdown-trigger">
              <span className="subnav-link highlight">
                خانواده برندها
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
              <div className="subnav-dropdown-menu">
                <Link href="/#brands" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                  <strong>ReeSkin Clinical</strong>
                  <small>مراقبت خانگی تخصصی، ترمیم سد دفاعی و جوانسازی ترابافتی</small>
                </Link>
                <Link href="/#brands" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                  <strong>ReeMed Medical</strong>
                  <small>پروتکل‌های کربوکسی‌تراپی CO2 ویژه کلینیک‌ها و درماتولوژیست‌ها</small>
                </Link>
              </div>
            </div>
            <Link href="/#science" className="subnav-link" onClick={() => setMobileMenuOpen(false)}>
              علم و اثر بوهر (Bohr Effect)
            </Link>
            <Link href="/academy" className="subnav-link" onClick={() => setMobileMenuOpen(false)}>
              آکادمی و پروتکل‌ها
            </Link>
            <Link href="/ingredients" className="subnav-link" onClick={() => setMobileMenuOpen(false)}>
              دانشنامه ترکیبات (INCI)
            </Link>
            <Link href="/#clinical-results" className="subnav-link" onClick={() => setMobileMenuOpen(false)}>
              شواهد بالینی و پزشکان
            </Link>
            <Link href="/b2b" className="subnav-link b2b-nav-badge" onClick={() => setMobileMenuOpen(false)}>
              پورتال پزشکان و کلینیک‌ها (B2B)
            </Link>
            <Link href="/blog" className="subnav-link" onClick={() => setMobileMenuOpen(false)}>
              ژورنال علمی
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
