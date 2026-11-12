'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, PhoneCall, Smartphone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import './rupak-footer/rupak-footer.css';

/* ── dermavia Brand Logo ── */
function BotanicalBrandLogo() {
  return (
    <div className="botanical-brand-wrap">
      <img
        src="/assets/dermavia-logo.svg"
        alt="dermavia"
        width={170}
        height={42}
        style={{ display: 'block', height: '42px', width: 'auto', objectFit: 'contain' }}
      />
      <span className="botanical-brand-tagline">فروشگاه تخصصی پوست و زیبایی</span>
    </div>
  );
}

/* ── App Store Badges (Google Play, Cafe Bazaar, SibApp) ── */
function GooglePlayBadge() {
  return (
    <a
      href="https://play.google.com"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-app-badge"
      aria-label="دریافت از گوگل پلی"
    >
      <div className="app-badge-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3.6 2.5C3.3 2.8 3.1 3.3 3.1 3.9V20.1C3.1 20.7 3.3 21.2 3.6 21.5L3.7 21.6L12.7 12.6V12.4V12.2L3.7 3.2L3.6 2.5Z" fill="#00D2FF" />
          <path d="M15.7 15.6L12.7 12.6V12.4V12.2L15.7 9.2L15.8 9.3L19.4 11.3C20.4 11.9 20.4 12.9 19.4 13.5L15.8 15.5L15.7 15.6Z" fill="#FFCE00" />
          <path d="M15.8 15.5L12.7 12.4L3.6 21.5C3.9 21.8 4.4 21.9 5.1 21.5L15.8 15.5Z" fill="#00F076" />
          <path d="M15.8 9.3L5.1 3.3C4.4 2.9 3.9 3 3.6 3.3L12.7 12.4L15.8 9.3Z" fill="#FF3A44" />
        </svg>
      </div>
      <div className="app-badge-text">
        <span className="app-badge-sub">دریافت از</span>
        <strong className="app-badge-name">Google Play</strong>
      </div>
    </a>
  );
}

function CafeBazaarBadge() {
  return (
    <a
      href="https://cafebazaar.ir"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-app-badge"
      aria-label="دریافت از بازار"
    >
      <div className="app-badge-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9C6 7.34 7.34 6 9 6H15C16.66 6 18 7.34 18 9V17C18 18.66 16.66 20 15 20H9C7.34 20 6 18.66 6 17V9Z"
            fill="#38AA43"
          />
          <path
            d="M9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="13" r="2.2" fill="#ffffff" />
        </svg>
      </div>
      <div className="app-badge-text">
        <span className="app-badge-sub">دریافت از</span>
        <strong className="app-badge-name">بازار</strong>
      </div>
    </a>
  );
}

function SibAppBadge() {
  return (
    <a
      href="https://sibapp.com"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-app-badge"
      aria-label="دریافت نسخه iOS از سیب‌اپ"
    >
      <div className="app-badge-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          {/* Apple shape with bite & leaf */}
          <path
            d="M14.5 3.5C15.2 2.7 15.6 1.6 15.5 0.5C14.5 0.6 13.3 1.2 12.6 2C12 2.7 11.5 3.8 11.7 4.9C12.8 5 13.9 4.3 14.5 3.5Z"
            fill="#1e293b"
          />
          <path
            d="M17.5 13.5C17.5 10.5 19.9 9 20 9C18.6 7 16.5 6.7 15.7 6.6C13.9 6.4 12.1 7.7 11.2 7.7C10.3 7.7 8.8 6.6 7.4 6.6C5.5 6.6 3.7 7.7 2.8 9.3C0.8 12.7 2.3 17.7 4.2 20.4C5.2 21.8 6.2 23.3 7.7 23.2C9.2 23.1 9.8 22.2 11.5 22.2C13.2 22.2 13.8 23.2 15.3 23.2C16.9 23.2 17.8 21.8 18.7 20.4C19.8 18.8 20.2 17.3 20.3 17.1C20.2 17.1 17.5 16 17.5 13.5Z"
            fill="#1e293b"
          />
        </svg>
      </div>
      <div className="app-badge-text">
        <span className="app-badge-sub">دریافت نسخه iOS از</span>
        <strong className="app-badge-name">سیب‌اپ</strong>
      </div>
    </a>
  );
}

/* ── Trust Certificates (eNAMAD & Virtual Business Union) ── */
function TrustCertificates() {
  return (
    <div className="footer-trust-certs-group">
      {/* eNAMAD Card */}
      <div className="footer-trust-badge" title="نماد اعتماد الکترونیکی ۵ ستاره">
        <div className="enamad-icon-wrap">
          <svg className="enamad-e-mark" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 6C13.5 6 8 15 8 24C8 33 15 39 24 39C31 39 36 35 38 31L32 28C30 31 27 33 24 33C18 33 14 29 13 24H40C41 22 41 19 41 17C41 11 34 6 24 6ZM14 19C15 14 19 11 24 11C29 11 33 14 34 19H14Z"
              fill="#1e3a8a"
            />
          </svg>
        </div>
        <span className="enamad-brand-label">eNAMAD.ir</span>
        <div className="enamad-five-stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <span className="enamad-sub-desc">مرکز توسعه تجارت الکترونیکی</span>
      </div>

      {/* Virtual Business Union Card */}
      <div className="footer-trust-badge" title="اتحادیه کشوری کسب و کارهای مجازی">
        <div className="union-icon-wrap">
          <svg className="union-hexagon-mark" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
              stroke="#0284c7"
              strokeWidth="3.2"
              fill="#e0f2fe"
            />
            <path
              d="M24 12L34 18V30L24 36L14 30V18L24 12Z"
              fill="#0284c7"
            />
            <circle cx="24" cy="24" r="3.5" fill="#ffffff" />
          </svg>
        </div>
        <span className="union-brand-label">اتحادیه کشوری</span>
        <span className="union-sub-desc">کسب و کارهای مجازی</span>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Exclude footer on bare auth pages
  if (pathname === '/auth' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      toast.error('لطفاً یک آدرس ایمیل معتبر وارد کنید.');
      return;
    }
    setIsSubmitted(true);
    toast.success('عضویت شما در خبرنامه dermavia با موفقیت ثبت شد!');
    setEmailInput('');
  };

  return (
    <footer className="rupak-goldoni-footer-root" dir="rtl" role="contentinfo">
      {/* ── 1. Top Newsletter Bar (Deep Forest Green) ── */}
      <div className="footer-newsletter-section">
        <div className="footer-newsletter-inner">
          {/* Right in RTL: Headline & Subtitle */}
          <div className="newsletter-text-block">
            <h3 className="newsletter-main-heading">عضویت در خبرنامه</h3>
            <p className="newsletter-sub-desc">
              با عضویت در خبرنامه dermavia، از آخرین تخفیف‌ها با خبر شوید.
            </p>
          </div>

          {/* Left in RTL: Newsletter Subscription Form */}
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form-box">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="ایمیل خود را وارد کنید."
              className="newsletter-email-input"
              aria-label="آدرس ایمیل برای عضویت در خبرنامه"
              required
            />
            <button
              type="submit"
              className="newsletter-submit-btn"
              aria-label="تأیید عضویت در خبرنامه"
            >
              عضویت
            </button>
          </form>
        </div>
      </div>

      {/* ── 2. Main Curved White Card with Golden Accent ── */}
      <div className="footer-card-container">
        <div className="footer-main-curved-card">
          {/* ── Upper Grid: 4 Columns on Desktop ── */}
          <div className="footer-top-columns-grid">
            {/* Column 1 (Far Right in RTL): Brand Info & About */}
            <div className="footer-col footer-col-brand">
              <BotanicalBrandLogo />
              <p className="footer-brand-about-paragraph">
                dermavia؛ مرجع تخصصی پوست، زیبایی و محصولات بالینی پیشرفته.
                ما بهترین فرمولاسیون‌های درمانی را با استانداردهای بین‌المللی به خانه‌ها و کلینیک‌های
                سراسر کشور می‌رسانیم.
              </p>
            </div>

            {/* Column 2 (Right Center in RTL): آموزشی */}
            <div className="footer-col footer-col-links">
              <h4 className="footer-col-title">آموزشی</h4>
              <ul className="footer-links-list">
                <li><Link href="/blog">بلاگ و اخبار</Link></li>
                <li><Link href="/contact">مشاوره رایگان</Link></li>
                <li><Link href="/shop">گالری تصویری</Link></li>
                <li><Link href="/blog">مراقبت از گیاهان</Link></li>
              </ul>
            </div>

            {/* Column 3 (Left Center in RTL): پیوندها */}
            <div className="footer-col footer-col-links">
              <h4 className="footer-col-title">پیوندها</h4>
              <ul className="footer-links-list">
                <li><Link href="/legal">قوانین سایت</Link></li>
                <li><Link href="/legal">حریم خصوصی</Link></li>
                <li><Link href="/contact">فرصت‌های شغلی</Link></li>
                <li><Link href="/contact">انتقاد و پیشنهاد</Link></li>
              </ul>
            </div>

            {/* Column 4 (Far Left in RTL): راه‌های ارتباطی */}
            <div className="footer-col footer-col-contact">
              <h4 className="footer-col-title">راه‌های ارتباطی</h4>
              <ul className="footer-contact-items-list">
                <li className="footer-contact-row">
                  <span className="contact-text">تهران، میدان هفتم تیر، خیابان لطفی</span>
                  <span className="contact-icon-wrap" aria-hidden="true">
                    <MapPin size={18} strokeWidth={2} />
                  </span>
                </li>
                <li className="footer-contact-row">
                  <span className="contact-text" dir="ltr">۰۲۱–۲۲۳۳۴۴۰۰</span>
                  <span className="contact-icon-wrap" aria-hidden="true">
                    <PhoneCall size={18} strokeWidth={2} />
                  </span>
                </li>
                <li className="footer-contact-row">
                  <span className="contact-text" dir="ltr">۴۰۰۰۲۳۵۰</span>
                  <span className="contact-icon-wrap" aria-hidden="true">
                    <Smartphone size={18} strokeWidth={2} />
                  </span>
                </li>
                <li className="footer-contact-row">
                  <span className="contact-text" dir="ltr">info@dermavia.ir</span>
                  <span className="contact-icon-wrap" aria-hidden="true">
                    <Mail size={18} strokeWidth={2} />
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Thin Divider on Mobile */}
          <div className="footer-mobile-divider" aria-hidden="true" />

          {/* ── Lower Section: Socials (Right), App Stores (Center), Trust Badges (Left) ── */}
          <div className="footer-bottom-interactive-row">
            {/* Right in RTL: Social Media */}
            <div className="footer-social-block">
              <h5 className="footer-sub-heading">شبکه‌های اجتماعی</h5>
              <div className="footer-social-icons-group">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="کانال تلگرام dermavia"
                  title="تلگرام"
                >
                  <Send size={18} strokeWidth={2} />
                </a>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="واتس‌اپ پشتیبانی dermavia"
                  title="واتس‌اپ"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="صفحه اینستاگرام dermavia"
                  title="اینستاگرام"
                >
                  <svg
                    width="18"
                    height="18"
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
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="فیس‌بوک dermavia"
                  title="فیس‌بوک"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Center: App Store Downloads */}
            <div className="footer-app-download-block">
              <h5 className="footer-sub-heading">دریافت اپلیکیشن موبایل</h5>
              <div className="footer-app-badges-group">
                <GooglePlayBadge />
                <CafeBazaarBadge />
                <SibAppBadge />
              </div>
            </div>

            {/* Left in RTL: Trust Badges */}
            <div className="footer-trust-certs-block">
              <TrustCertificates />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Copyright Bar (Deep Forest Green) ── */}
      <div className="footer-copyright-bottom-bar">
        <p className="copyright-text">
          تمامی حقوق این وب‌سایت متعلق به dermavia است.
        </p>
      </div>
    </footer>
  );
}
