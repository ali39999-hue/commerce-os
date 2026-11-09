'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Phone,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  User,
  Bell,
  Package,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../cart';
import { showNotificationModal } from '../notification-modal';
import './rupak-hero.css';

export interface RupakSlide {
  id: string;
  badge: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageSrc?: string;
  imageAlt?: string;
}

const DEFAULT_SLIDES: RupakSlide[] = [
  {
    id: 'rupak-botanical',
    badge: 'هدیه‌ای برای خاص پسندان',
    titlePrefix: 'با محصولات ',
    titleAccent: 'مراقبت پوستی روپاک شاپ،',
    titleSuffix: 'زیبایی و شادابی به پوستت هدیه بده',
    description:
      'از مرطوب‌کننده‌ها و سرم‌ها تا ضدآفتاب‌ها و ماسک‌های صورت، هرچی که نیاز داری رو می‌تونی اینجا پیدا کنی و از سلامت و زیبایی پوستت لذت ببری!',
    primaryCtaText: 'مشاهده محصولات',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'تماس با ما',
    secondaryCtaLink: '#contact-footer',
  },
  {
    id: 'carboxygel-bohr',
    badge: 'کربوکسی‌تراپی غیرتهاجمی با اثر بوهر',
    titlePrefix: 'تجربه اکسیژن‌رسانی عمیق با ',
    titleAccent: 'CarboxyGel Pro 1500ml،',
    titleSuffix: 'تحریک فیزیولوژیک نوسازی سلولی پوست',
    description:
      'آزادسازی بیش از ۱۱۰۰ppm گاز CO2 نفوذی در بافت و رهایش انفجاری اکسیژن (+۴۵٪ تا +۹۴٪) بر پایه اثر فیزیولوژیک بوهر (Bohr Effect) ویژه متخصصین و کلینیک‌ها.',
    primaryCtaText: 'خرید ژل و پاد فعال‌ساز',
    primaryCtaLink: '/carboxygel',
    secondaryCtaText: 'مستندات اثر بوهر',
    secondaryCtaLink: '#science',
  },
  {
    id: 'plasmax-device',
    badge: 'تکنولوژی انحصاری انرژی میکروپلاسما',
    titlePrefix: 'ایستگاه درمانی سه‌گانه ',
    titleAccent: 'PlasmaX Tri-Modality،',
    titleSuffix: 'بلفاروپلاستی غیرجراحی و لیفت پیشرفته',
    description:
      'تلفیق نوآورانه ۳ مدالیته آرک پیوسته جراحی، جت پلاسمای سرد اتمسفری (CAP) و تخلیه سد دی‌الکتریک (DBD) برای جوانسازی کامل بدون بیهوشی و بدون اسکار.',
    primaryCtaText: 'مشخصات دستگاه PlasmaX',
    primaryCtaLink: '/plasmax',
    secondaryCtaText: 'درخواست دمو حضوری',
    secondaryCtaLink: '/b2b',
  },
];

export interface RupakHeroProps {
  slides?: RupakSlide[];
  onSearch?: (query: string) => void;
  phoneNumber?: string;
  showImage?: boolean;
  cartCount?: number;
  cartTotalFormatted?: string;
}

export function RupakHero({
  slides = DEFAULT_SLIDES,
  onSearch,
  phoneNumber = '۰۹۳۵۸۷۲۷۴۹۲',
  showImage = false,
  cartCount,
  cartTotalFormatted,
}: RupakHeroProps) {
  const router = useRouter();
  const cart = useCart();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 55);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const touchStartX = useRef<number | null>(null);
  const currentSlide = slides[currentSlideIndex] ?? slides[0];

  // Auto-advance slides every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNextSlide();
    } else if (diff < -50) {
      handlePrevSlide();
    }
    touchStartX.current = null;
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('09358727492');
      setIsCopiedPhone(true);
      setTimeout(() => setIsCopiedPhone(false), 2200);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const scrollToCatalog = () => {
    const target =
      document.getElementById('rupak-category-wave') ||
      document.getElementById('rupak-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 580, behavior: 'smooth' });
    }
  };

  const finalCartCount = cartCount ?? cart?.itemCount ?? 0;
  const computedTotal =
    cart?.calculations?.grandTotalTomans != null
      ? `${cart.calculations.grandTotalTomans.toLocaleString('fa-IR')} تومان`
      : '۰ تومان';
  const finalCartTotal = cartTotalFormatted ?? computedTotal;
  const handleUserLogout = () => {
    try {
      localStorage.removeItem("commerce_os.auth.token");
      localStorage.removeItem("commerce_os.auth.user");
      setAuthUser(null);
      window.dispatchEvent(new Event("commerce_os:auth_change"));
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [isCartBumping, setIsCartBumping] = useState(false);
  const [authUser, setAuthUser] = useState<{ username: string; fullName?: string } | null>(null);
  const prevCountRef = useRef(finalCartCount);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const raw = localStorage.getItem("commerce_os.auth.user");
        if (raw) setAuthUser(JSON.parse(raw));
        else setAuthUser(null);
      } catch {
        setAuthUser(null);
      }
    };
    syncAuth();
    window.addEventListener("commerce_os:auth_change", syncAuth);
    return () => window.removeEventListener("commerce_os:auth_change", syncAuth);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (finalCartCount !== prevCountRef.current) {
      setIsCartBumping(true);
      timer = setTimeout(() => setIsCartBumping(false), 900);
      prevCountRef.current = finalCartCount;
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [finalCartCount]);

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

  const renderNavbar = (sticky: boolean) => (
    <header className={`rupak-navbar-wrapper ${sticky ? 'is-sticky' : ''}`}>
      <nav className="rupak-navbar" aria-label="ناوبری اصلی فروشگاه">
        {/* Right Nav Menu (in RTL) */}
        <ul className="rupak-nav-menu">
          <li>
            <Link href="/" className="rupak-nav-link active">
              صفحه اصلی
            </Link>
          </li>
          <li>
            <Link href="/shop" className="rupak-nav-link">
              فروشگاه
            </Link>
          </li>
          <li>
            <Link href="/blog" className="rupak-nav-link">
              وبلاگ
            </Link>
          </li>
          <li>
            <Link href="/contact" className="rupak-nav-link">
              تماس با ما
            </Link>
          </li>
          <li>
            <Link href="/about" className="rupak-nav-link">
              درباره ما
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rupak-mobile-toggle"
          aria-label="باز کردن منوی موبایل"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* --------------------------------------------------------------
            CENTER LOGO & CUSTOM SVG CURVED PROTRUSION (THE EMBLEM BULGE)
            C1 Continuous Bezier Curve that flushes smoothly with navbar
            -------------------------------------------------------------- */}
        <svg
          className="rupak-logo-bulge-svg"
          viewBox="0 0 160 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 10 20
               C 40 20, 52 4, 80 4
               C 108 4, 120 20, 150 20
               L 150 88
               C 120 88, 108 104, 80 104
               C 52 104, 40 88, 10 88
               Z"
            fill="#ffffff"
          />
        </svg>

        {/* Center Logo Content */}
        <Link href="/" className="rupak-logo-container" aria-label="لوگوی فروشگاه روپاک">
          <div className="rupak-logo-mark">
            <svg
              width="36"
              height="36"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 36V10C12 10 18 8 26 8C33 8 36 12 36 17C36 22 31 25 24 25"
                stroke="#1e293b"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 24L34 37"
                stroke="#1e293b"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <path
                d="M23 15C25 12 29 11 31 13C33 15 32 19 28 21"
                stroke="#77B091"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="rupak-logo-text">RUPAK</span>
        </Link>

        {/* Left Nav Actions (in RTL) */}
        <div className="rupak-nav-actions">
          {authUser ? (
            <div className="rupak-user-dropdown-container">
              <Link
                href="/account"
                className="rupak-btn-login rupak-btn-logged-in"
                title={`حساب کاربری: ${authUser.fullName || authUser.username || "کاربر"}`}
              >
                <span className="rupak-user-dot" />
                <span>{authUser.fullName ? authUser.fullName.split(" ")[0] : "کاربر"}</span>
                <ChevronDown className="rupak-user-chevron" size={13} />
              </Link>

              {/* Submenu Dropdown on Hover */}
              <div className="rupak-user-dropdown-menu" role="menu" aria-label="منوی حساب کاربری">
                {/* User Header */}
                <div className="rupak-dropdown-header">
                  <div className="rupak-dropdown-avatar">
                    <User size={18} />
                  </div>
                  <div className="rupak-dropdown-user-info">
                    <strong className="rupak-dropdown-user-name">
                      {authUser.fullName || authUser.username || "کاربر روپاک"}
                    </strong>
                    <span className="rupak-dropdown-user-badge">
                      <span className="rupak-user-dot-pulse" />
                      حساب فعال روپاک
                    </span>
                  </div>
                </div>

                <div className="rupak-dropdown-divider" />

                {/* 1. اطلاعات حساب */}
                <Link
                  href="/account?tab=profile"
                  className="rupak-dropdown-item"
                  role="menuitem"
                >
                  <div className="rupak-dropdown-item-icon">
                    <User size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">اطلاعات حساب</span>
                    <span className="rupak-dropdown-item-desc">مشاهده و ویرایش مشخصات فردی</span>
                  </div>
                  <ChevronLeft size={14} className="rupak-dropdown-item-arrow" />
                </Link>

                {/* 2. داشبورد و وضعیت سفارش */}
                <Link
                  href="/account?tab=orders"
                  className="rupak-dropdown-item"
                  role="menuitem"
                >
                  <div className="rupak-dropdown-item-icon">
                    <Package size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">داشبورد و وضعیت سفارش</span>
                    <span className="rupak-dropdown-item-desc">پیگیری سفارش‌ها و فاکتورها</span>
                  </div>
                  <ChevronLeft size={14} className="rupak-dropdown-item-arrow" />
                </Link>

                {/* 3. تنظیمات */}
                <Link
                  href="/account?tab=addresses"
                  className="rupak-dropdown-item"
                  role="menuitem"
                >
                  <div className="rupak-dropdown-item-icon">
                    <Settings size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">تنظیمات</span>
                    <span className="rupak-dropdown-item-desc">آدرس‌های ارسال و امنیت حساب</span>
                  </div>
                  <ChevronLeft size={14} className="rupak-dropdown-item-arrow" />
                </Link>

                {/* 4. اعلان‌ها و پیام‌ها */}
                <button
                  type="button"
                  onClick={() => {
                    showNotificationModal({
                      type: "center",
                      title: "مرکز اعلان‌ها و پیام‌ها",
                      message: "۳ اعلان جدید در پرونده کاربری شما ثبت شده است.",
                    });
                  }}
                  className="rupak-dropdown-item"
                  role="menuitem"
                >
                  <div className="rupak-dropdown-item-icon">
                    <Bell size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">اعلان‌ها و پیام‌ها</span>
                    <span className="rupak-dropdown-item-desc">مشاهده پیام‌های سیستمی و تخفیف‌ها</span>
                  </div>
                  <span className="rupak-cart-badge" style={{ fontSize: "11px", padding: "1px 6px" }}>۳</span>
                </button>

                <div className="rupak-dropdown-divider" />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleUserLogout}
                  className="rupak-dropdown-item rupak-dropdown-item-logout"
                  role="menuitem"
                >
                  <div className="rupak-dropdown-item-icon logout-icon">
                    <LogOut size={15} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">خروج از حساب</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="rupak-user-dropdown-container">
              <Link href="/login" className="rupak-btn-login">
                ورود / ثبت‌نام
              </Link>

              {/* Submenu Dropdown for Guest on Hover */}
              <div className="rupak-user-dropdown-menu" role="menu" aria-label="منوی ورود">
                <div className="rupak-dropdown-header guest">
                  <div className="rupak-dropdown-user-info">
                    <strong className="rupak-dropdown-user-name">خوش آمدید!</strong>
                    <span className="rupak-dropdown-user-badge">جهت دسترسی به سفارشات وارد شوید</span>
                  </div>
                </div>

                <div className="rupak-dropdown-divider" />

                <Link href="/login" className="rupak-dropdown-item" role="menuitem">
                  <div className="rupak-dropdown-item-icon">
                    <User size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">ورود به حساب</span>
                    <span className="rupak-dropdown-item-desc">ورود با شماره موبایل و رمز عبور</span>
                  </div>
                  <ChevronLeft size={14} className="rupak-dropdown-item-arrow" />
                </Link>

                <Link href="/register" className="rupak-dropdown-item" role="menuitem">
                  <div className="rupak-dropdown-item-icon">
                    <Sparkles size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">ثبت‌نام سریع</span>
                    <span className="rupak-dropdown-item-desc">ایجاد حساب جدید در فروشگاه</span>
                  </div>
                  <ChevronLeft size={14} className="rupak-dropdown-item-arrow" />
                </Link>

                <Link href="/account?tab=orders" className="rupak-dropdown-item" role="menuitem">
                  <div className="rupak-dropdown-item-icon">
                    <Package size={16} />
                  </div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">داشبورد و وضعیت سفارش</span>
                    <span className="rupak-dropdown-item-desc">پیگیری مرسوله با کد رهگیری</span>
                  </div>
                  <ChevronLeft size={14} className="rupak-dropdown-item-arrow" />
                </Link>
              </div>
            </div>
          )}

          <button
            type="button"
            className={`rupak-btn-cart ${isCartBumping ? 'cart-bump-active' : ''}`}
            onClick={() => {
              if (cart?.openDrawer) {
                cart.openDrawer();
              } else {
                const cartBtn = document.getElementById('open-cart-drawer');
                if (cartBtn) cartBtn.click();
              }
            }}
            aria-label={`سبد خرید با ${finalCartCount} قلم کالا و مبلغ ${finalCartTotal}`}
          >
            <span>{finalCartTotal}</span>
            <div className="rupak-cart-icon-wrapper">
              <ShoppingBag className="w-4 h-4 text-slate-800" />
              {finalCartCount > 0 && (
                <span className={`rupak-cart-badge ${isCartBumping ? 'badge-pop' : ''}`} key={finalCartCount}>
                  {finalCartCount.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            left: 0,
            marginTop: '10px',
            background: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
            padding: '20px',
            zIndex: 35,
            color: '#1e293b',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li>
              <Link href="/" className="rupak-nav-link active" onClick={() => setIsMobileMenuOpen(false)}>
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link href="/shop" className="rupak-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                فروشگاه محصولات
              </Link>
            </li>
            <li>
              <Link href="/blog" className="rupak-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                وبلاگ و آموزش مراقبت پوست
              </Link>
            </li>
            <li>
              <Link href="/contact" className="rupak-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                تماس با کارشناسان
              </Link>
            </li>
            <li>
              <Link href="/about" className="rupak-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                درباره ما
              </Link>
            </li>
          </ul>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            {authUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(119, 176, 145, 0.1)', borderRadius: '12px' }}>
                  <User size={18} style={{ color: '#274b24' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                    {authUser.fullName || authUser.username || "کاربر روپاک"}
                  </span>
                </div>
                <Link
                  href="/account?tab=profile"
                  className="rupak-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="rupak-dropdown-item-icon"><User size={16} /></div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">اطلاعات حساب</span>
                  </div>
                </Link>
                <Link
                  href="/account?tab=orders"
                  className="rupak-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="rupak-dropdown-item-icon"><Package size={16} /></div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">داشبورد و وضعیت سفارش</span>
                  </div>
                </Link>
                <Link
                  href="/account?tab=addresses"
                  className="rupak-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="rupak-dropdown-item-icon"><Settings size={16} /></div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">تنظیمات</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleUserLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="rupak-dropdown-item rupak-dropdown-item-logout"
                  style={{ width: '100%' }}
                >
                  <div className="rupak-dropdown-item-icon logout-icon"><LogOut size={15} /></div>
                  <div className="rupak-dropdown-item-content">
                    <span className="rupak-dropdown-item-title">خروج از حساب</span>
                  </div>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rupak-btn-primary"
                style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ورود یا ثبت‌نام کاربر
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );

  return (
    <section
      dir="rtl"
      className="rupak-hero-root"
      aria-label="بخش هیرو فروشگاه روپاک"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="rupak-container">
        {/* ==================================================================
            1. TOP UTILITY BAR (Phone Badge & Search Bar)
            ================================================================== */}
        <div className="rupak-topbar">
          {/* Phone Badge (Right in RTL) */}
          <a
            href="tel:09358727492"
            onClick={handlePhoneClick}
            className="rupak-phone-badge"
            title="کلیک برای تماس مستقیم یا کپی شماره"
          >
            {isCopiedPhone ? (
              <CheckCircle2 className="rupak-phone-icon text-emerald-800" />
            ) : (
              <Phone className="rupak-phone-icon" />
            )}
            <span>
              {isCopiedPhone ? 'شماره کپی شد!' : `کمک می‌خوای؟ ${phoneNumber}`}
            </span>
          </a>

          {/* Search Form (Left in RTL) */}
          <form onSubmit={handleSearchSubmit} className="rupak-search-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder="جستجو محصولات..."
              className="rupak-search-input"
              aria-label="جستجوی محصولات روپاک"
            />
            <Search className="rupak-search-icon" aria-hidden="true" />

            {/* Quick Live Search Suggestions */}
            {isSearchFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  left: 0,
                  marginTop: '6px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '10px 14px',
                  color: '#334155',
                  fontSize: '12px',
                  zIndex: 40,
                }}
              >
                <div style={{ fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  جستجوهای پرتکرار:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['کربوکسی ژل', 'روغن درخت چای', 'سرم ضدلک', 'ماسک CarboxyPad', 'PlasmaX'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                          router.push(`/search?q=${encodeURIComponent(tag)}`);
                        }}
                        style={{
                          background: '#f1f5f9',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          color: '#0f172a',
                        }}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ==================================================================
            2. MAIN FLOATING NAVBAR (With Custom Center SVG Bulge)
            ================================================================== */}
        {isSticky ? (
          <>
            <div className="rupak-navbar-placeholder" aria-hidden="true" />
            {mounted && createPortal(renderNavbar(true), document.body)}
          </>
        ) : (
          renderNavbar(false)
        )}

        {/* ==================================================================
            3. HERO CONTENT
            (When showImage=false: Centered Mode with Photo Removed)
            ================================================================== */}
        <div className={`rupak-hero-content ${!showImage ? 'centered-mode' : ''}`}>
          {/* Text Column */}
          <div className="rupak-text-col">
            <span className="rupak-eyebrow-badge">
              <Sparkles className="w-3.5 h-3.5 ms-1.5 text-amber-700 inline" />
              {currentSlide.badge}
            </span>

            <h1 className="rupak-hero-heading">
              {currentSlide.titlePrefix}
              <span className="rupak-heading-accent">{currentSlide.titleAccent}</span>
              <br />
              {currentSlide.titleSuffix}
            </h1>

            <p className="rupak-hero-desc">{currentSlide.description}</p>

            <div className="rupak-cta-row">
              <Link href={currentSlide.primaryCtaLink} className="rupak-btn-primary">
                {currentSlide.primaryCtaText}
              </Link>

              <Link href={currentSlide.secondaryCtaLink} className="rupak-btn-secondary">
                {currentSlide.secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* Visual Column: Rendered ONLY if showImage=true */}
          {showImage && currentSlide.imageSrc && (
            <div className="rupak-visual-col">
              <div className="rupak-glow-sphere" aria-hidden="true" />
              <div className="rupak-product-floating-stage">
                <img
                  src={currentSlide.imageSrc}
                  alt={currentSlide.imageAlt ?? ''}
                  className="rupak-hero-product-img"
                  loading="eager"
                />
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================
            4. SLIDER NAVIGATION ARROWS & DOTS
            ================================================================== */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="rupak-slider-arrow arrow-right"
          aria-label="اسلاید قبلی"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="rupak-slider-arrow arrow-left"
          aria-label="اسلاید بعدی"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="rupak-slider-dots">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`rupak-dot ${idx === currentSlideIndex ? 'active' : ''}`}
              aria-label={`رفتن به اسلاید ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ==================================================================
          5. BOTTOM WAVE SVG CURVE & SCROLL DOWN BUTTON
          ================================================================== */}
      <div className="rupak-bottom-wave-container" aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rupak-bottom-wave-svg"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 100
               L 0 35
               Q 720 100, 1440 35
               L 1440 100
               Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <button
        type="button"
        onClick={scrollToCatalog}
        className={`rupak-scroll-btn ${isSticky ? 'scrolled-hidden' : ''}`}
        aria-label="اسکرول به بخش محصولات و کاتالوگ"
      >
        <ArrowDown className="rupak-scroll-arrow" />
      </button>
    </section>
  );
}
