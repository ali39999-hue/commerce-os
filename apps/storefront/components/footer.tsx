'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Clock, ChevronUp } from 'lucide-react';
import './rupak-footer/rupak-footer.css';

export function SiteFooter() {
  const pathname = usePathname();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (pathname === '/auth' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="rupak-footer-root" dir="rtl" role="contentinfo">
      {/* ── Top Curve & Floating Scroll-to-Top Button ── */}
      <div className="rupak-footer-top-curve">
        <button
          type="button"
          onClick={scrollToTop}
          className="rupak-footer-scroll-top-btn"
          aria-label="بازگشت به بالای صفحه"
          title="بازگشت به بالای صفحه"
        >
          <ChevronUp className="rupak-footer-scroll-top-icon" />
        </button>
      </div>

      <div className="rupak-footer-main">
        <div className="rupak-footer-container">
          {/* ── 1. Top Contact / Info 3-Column Bar ── */}
          <div className="rupak-footer-contact-row" aria-label="اطلاعات تماس و دسترسی">
            {/* Contact Item 1: Phone (Right in RTL) */}
            <div className="rupak-footer-contact-item">
              <div className="rupak-footer-contact-icon-box" aria-hidden="true">
                <Phone className="rupak-footer-contact-icon" />
              </div>
              <div className="rupak-footer-contact-text">
                <span className="rupak-footer-contact-label">شماره تماس:</span>
                <span className="rupak-footer-contact-value" dir="ltr">
                  ۰۹۳۵۸۷۲۷۴۹۲ و ۰۹۲۱۹۸۶۵۱۴۶
                </span>
              </div>
            </div>

            <div className="rupak-footer-contact-divider" aria-hidden="true" />

            {/* Contact Item 2: Address (Center) */}
            <div className="rupak-footer-contact-item">
              <div className="rupak-footer-contact-icon-box" aria-hidden="true">
                <MapPin className="rupak-footer-contact-icon" />
              </div>
              <div className="rupak-footer-contact-text">
                <span className="rupak-footer-contact-label">آدرس:</span>
                <span className="rupak-footer-contact-value">تهران، بازار بزرگ، چهار سوق بزرگ</span>
              </div>
            </div>

            <div className="rupak-footer-contact-divider" aria-hidden="true" />

            {/* Contact Item 3: Working Hours (Left in RTL) */}
            <div className="rupak-footer-contact-item">
              <div className="rupak-footer-contact-icon-box" aria-hidden="true">
                <Clock className="rupak-footer-contact-icon" />
              </div>
              <div className="rupak-footer-contact-text">
                <span className="rupak-footer-contact-label">ساعت کاری:</span>
                <span className="rupak-footer-contact-value">روز های کاری ساعت ۹ صبح تا ۵ بعد ظهر</span>
              </div>
            </div>
          </div>

          {/* ── 2. Middle Row: Nav Pill (Right) + Socials Pill (Left) ── */}
          <div className="rupak-footer-nav-social-row">
            {/* Right in RTL: White Nav Pill */}
            <nav className="rupak-footer-nav-pill" aria-label="منوی دسترسی سریع فوتر">
              <Link href="/" className="rupak-footer-nav-link active">
                صفحه اصلی
              </Link>
              <Link href="/shop" className="rupak-footer-nav-link">
                فروشگاه
              </Link>
              <Link href="/blog" className="rupak-footer-nav-link">
                وبلاگ
              </Link>
              <Link href="/contact" className="rupak-footer-nav-link">
                تماس با ما
              </Link>
              <Link href="/about" className="rupak-footer-nav-link">
                درباره ما
              </Link>
            </nav>

            {/* Left in RTL: Social Icons Pill */}
            <div className="rupak-footer-social-pill" aria-label="شبکه‌های اجتماعی">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="rupak-footer-social-btn"
                aria-label="کانال تلگرام روپاک شاپ"
                title="تلگرام"
              >
                <svg className="rupak-footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rupak-footer-social-btn"
                aria-label="صفحه اینستاگرام روپاک شاپ"
                title="اینستاگرام"
              >
                <svg
                  className="rupak-footer-social-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* ── 3. Bottom Cards: About Box (Right) + Enamad Trust Box (Left) ── */}
          <div className="rupak-footer-content-grid">
            {/* Right in RTL: About Rupak Shop Card */}
            <div className="rupak-footer-about-card">
              <h3 className="rupak-footer-about-title">درباره روپاک شاپ</h3>
              <p className="rupak-footer-about-text">
                روپاک مقصدی منحصر به فرد برای علاقه مندان به محصولات آرایشی و مراقبت از پوست است. ما برندهای معتبر و با کیفیت را با دقت انتخاب کرده‌ایم تا به شما در زیبایی و سلامتی کمک کنیم. ماموریت ما ارائه محصولات اصل و با کیفیت برای ایجاد تجربه‌ای مطمئن و لذت‌بخش است. با انتخاب‌های درست، به زیبایی و اعتماد به نفس خود بیفزایید و به دنیای زیبایی و مراقبت از خود سفر کنید.
              </p>
            </div>

            {/* Left in RTL: Enamad Trust Card */}
            <div className="rupak-footer-trust-card">
              <h3 className="rupak-footer-trust-title">نماد اعتماد</h3>
              <div className="rupak-footer-enamad-badge">
                <svg className="rupak-enamad-logo" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                  <path
                    d="M50 12 C28 12 18 30 18 50 C18 72 34 84 52 84 C66 84 76 76 80 68 L68 62 C64 68 58 72 50 72 C38 72 30 64 28 50 L84 50 C86 46 86 40 86 36 C86 24 70 12 50 12 Z M30 38 C32 28 40 24 50 24 C60 24 68 28 68 38 L30 38 Z"
                    fill="#1e3a8a"
                  />
                </svg>
                <span className="rupak-enamad-brand">eNAMAD.ir</span>
                <div className="rupak-enamad-stars" aria-label="۵ ستاره اعتماد">
                  <span aria-hidden="true">⭐</span>
                  <span aria-hidden="true">⭐</span>
                  <span aria-hidden="true">⭐</span>
                  <span aria-hidden="true">⭐</span>
                  <span aria-hidden="true">⭐</span>
                </div>
                <span className="rupak-enamad-sub">جهت اطمینان کلیک نمایید</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Very Bottom Copyright Bar ── */}
      <div className="rupak-footer-copyright-bar">
        <div className="rupak-footer-copyright-inner">
          <span>کلیه حقوق متعلق به روپاک شاپ می باشد | طراحی شده توسط feloraweb.ir</span>
        </div>
      </div>
    </footer>
  );
}
