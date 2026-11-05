"use client";

import Link from "next/link";
import { useState } from "react";
import { LocaleCurrencySelector } from "./localization/locale-currency-selector";

export function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes("@")) {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    } else {
      setNewsletterStatus("error");
    }
  };

  return (
    <footer className="clinical-footer" role="contentinfo">
      {/* ── Main 4-Column Ultra-Premium Footer ── */}
      <div className="footer-top">
        <div className="footer-grid">
          {/* Column 1: Brand & Medical Laboratory Credentials */}
          <div className="footer-col brand-col">
            <div className="footer-brand-title">
              <span className="brand-logo-txt">DR. DERMER</span>
              <span className="brand-badge-pill">UK CLINICAL LABS</span>
            </div>
            
            <p className="footer-bio">
              آزمایشگاه‌های پژوهشی دکتر درمر بریتانیا (کمبریج و لندن)، مرجع پیشگام درمان‌های ترابافتی بدون تهاجم و توسعه فرمولاسیون‌های کربوکسی‌تراپی بر پایه اثر بوهر (Bohr Effect). ارائه‌دهنده رژیم‌های درمانی درجه دارویی برای سلامت و زیبایی پایدار پوست.
            </p>

            {/* Certifications Badge Row */}
            <div className="footer-cert-badges" aria-label="گواهینامه‌های پزشکی و استانداردهای دارویی">
              <div className="cert-pill" title="استاندارد مدیریت کیفیت تجهیزات پزشکی">
                <span className="cert-code">ISO 13485</span>
                <span className="cert-desc">تجهیزات پزشکی</span>
              </div>
              <div className="cert-pill" title="استاندارد شرایط خوب تولید مواد آرایشی و درموسوتیکال">
                <span className="cert-code">GMP / ISO 22716</span>
                <span className="cert-desc">گرید دارویی</span>
              </div>
              <div className="cert-pill" title="انطباق با استانداردهای بهداشت و سلامت اتحادیه اروپا">
                <span className="cert-code">CE MEDICAL</span>
                <span className="cert-desc">نشان رسمی اروپا</span>
              </div>
            </div>

            {/* Contact & Pharmacovigilance Hotline */}
            <div className="footer-contacts">
              <div className="contact-row">
                <span className="contact-icon" aria-hidden="true">📍</span>
                <span>تهران، خیابان ولیعصر، بالاتر از ظفر، مجتمع بین‌المللی پزشکی درمر، طبقه ۵</span>
              </div>
              <div className="contact-row">
                <span className="contact-icon" aria-hidden="true">📞</span>
                <span>تلفن مشاوره علمی و پشتیبانی نسخه: <strong dir="ltr">۰۲۱-۸۸۸۸۰۰۰۰</strong></span>
              </div>
              <div className="contact-row hotline-highlight">
                <span className="contact-icon alert-icon" aria-hidden="true">⚡</span>
                <span>
                  خط شبانه‌روزی ثبت عوارض ناخواسته (فارماکوویژلانس ۲۴/۷):{" "}
                  <strong dir="ltr" className="hotline-phone">۰۲۱-۸۸۸۸۰۰۰۱</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Product Lines & Clinical Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">خانواده محصولات و پروتکل‌ها</h4>
            <ul className="footer-links">
              <li>
                <Link href="/reeskin">
                  <strong>ReeSkin™ Clinical</strong>
                  <span className="link-sub">کیت‌های مراقبت پوستی ترابافتی و رژیم‌ها</span>
                </Link>
              </li>
              <li>
                <Link href="/carboxygel">
                  <strong>ژل کربوکسی‌تراپی CarboxyGel™</strong>
                  <span className="link-sub">کربوکسی‌تراپی غیرتهاجمی و اثر بوهر</span>
                </Link>
              </li>
              <li>
                <Link href="/carboxypod">
                  <strong>کپسول‌های فعال‌ساز CarboxyPod™</strong>
                  <span className="link-sub">پادهای فعال‌ساز نانوحباب‌های CO₂</span>
                </Link>
              </li>
              <li>
                <Link href="/carboxypad">
                  <strong>پدهای آلکالاین CarboxyPad™</strong>
                  <span className="link-sub">شیت‌های آناتومیک صورت و گردن</span>
                </Link>
              </li>
              <li>
                <Link href="/crystalene">
                  <strong>خمیر پولیش ابریشمی Crystalene™</strong>
                  <span className="link-sub">میکرودرم آلومینا و نوسازی اپیدرم</span>
                </Link>
              </li>
              <li>
                <Link href="/subscriptions">
                  اشتراک دوره‌ای نسخه با ارسال یخچال‌دار
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Science & Clinical Knowledge */}
          <div className="footer-col">
            <h4 className="footer-heading">دانش بالینی و پژوهش</h4>
            <ul className="footer-links">
              <li>
                <Link href="/#science">
                  مکانیسم بیوشیمیایی اثر بوهر (Bohr Effect)
                </Link>
              </li>
              <li>
                <Link href="/#clinical-results">
                  نتایج کارآزمایی‌های بالینی و آنالیز Visia
                </Link>
              </li>
              <li>
                <Link href="/ingredients">
                  دانشنامه مواد مؤثره و فرمولاسیون (INCI)
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  ژورنال علمی مقالات درماتولوژی
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  پرسش‌های متداول درماتولوژی و منع مصرف
                </Link>
              </li>
              <li>
                <Link href="/about">
                  درباره آزمایشگاه‌های دکتر درمر کمبریج
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter, Trust Symbols & Official Seals */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-heading">خبرنامه پژوهشی و نمادهای اعتماد</h4>
            <p className="newsletter-desc">
              دریافت تازه‌ترین پروتکل‌های بالینی، گایدلاین‌های درماتولوژی و دعوت‌نامه شرکت در کارآزمایی‌های جدید دکتر درمر:
            </p>

            <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="ایمیل کاری یا دانشگاهی شما..."
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus !== "idle") setNewsletterStatus("idle");
                  }}
                  className="newsletter-email-input"
                  dir="ltr"
                  aria-label="آدرس ایمیل برای خبرنامه بالینی"
                />
                <button type="submit" className="newsletter-submit-btn">
                  عضویت
                </button>
              </div>

              {newsletterStatus === "success" && (
                <div className="newsletter-msg success">
                  ✓ اشتراک شما با موفقیت در فهرست VIP بالینی ثبت گردید.
                </div>
              )}
              {newsletterStatus === "error" && (
                <div className="newsletter-msg error">
                  لطفاً یک آدرس ایمیل معتبر وارد فرمایید.
                </div>
              )}
            </form>

            {/* Official Trust Seals Container */}
            <div className="trust-badges-container" aria-label="مجوزها و نمادهای اعتماد رسمی">
              <div className="trust-badge-card" title="نماد اعتماد الکترونیکی (اینماد)">
                <div className="badge-icon-wrap enamad-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <span className="badge-initial">اینماد</span>
                <span className="badge-meta">کسب‌وکار ۵ ستاره</span>
              </div>

              <div className="trust-badge-card" title="نشان ملی ثبت رسانه‌های دیجیتال (ساماندهی)">
                <div className="badge-icon-wrap samandehi-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <span className="badge-initial">ساماندهی</span>
                <span className="badge-meta">احراز هویت طلایی</span>
              </div>

              <div className="trust-badge-card" title="تاییدیه سلامت و اصالت ملزومات وزارت بهداشت (TTAC)">
                <div className="badge-icon-wrap ttac-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <span className="badge-initial">TTAC</span>
                <span className="badge-meta">رهگیری اصالت دارو</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pharmacovigilance & Medical Disclaimer Band ── */}
      <div className="footer-disclaimer-band">
        <div className="disclaimer-inner">
          <div className="disclaimer-box">
            <div className="disclaimer-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <strong>بیانیه سلب مسئولیت پزشکی و پروتکل فارماکوویژلانس (Pharmacovigilance)</strong>
            </div>
            <p>
              اطلاعات علمی، سازوکار اثر بوهر و راهنماهای بالینی منتشرشده در پلتفرم دکتر درمر صرفاً جنبه آموزشی و آگاهی‌بخشی داشته و هرگز نباید جایگزین معاینه، تشخیص بالینی، تجویز دارو یا مشاوره مستقیم با پزشک متخصص پوست و مو تلقی شوند. پیش از شروع هرگونه پروتکل درمانی با اسیدهای میوه، کربوکسی‌تراپی، رتینوئیدها یا لایه‌بردارهای تخصصی، انجام تست حساسیت پوستی و بررسی عدم کنترااندیکاسیون الزامی است. در صورت بروز هرگونه واکنش آلرژیک غیرمنتظره، مصرف محصول را متوقف کرده و مراتب را سریعاً به سامانه ملی عوارض ناخواسته دارویی یا خط شبانه‌روزی فارماکوویژلانس دکتر درمر (۰۲۱-۸۸۸۸۰۰۰۱) گزارش فرمایید.
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer Bottom Copyright & Tech Infrastructure Bar ── */}
      <div className="footer-bottom">
        <div className="bottom-inner">
          <div className="copyright-text">
            <span>© ۲۰۲۶ لابراتوارهای دکتر درمر (Dr Dermer UK Clinical Laboratories). تمامی حقوق مادی و معنوی محفوظ است.</span>
            <span className="tech-credit">طراحی شده بر بستر هسته مالی Commerce OS · معماری حسابداری دوطرفه بدون خطا، تسویه امن و ضمانت اصالت ۱۰۰٪</span>
          </div>

          <div className="bottom-links">
            <LocaleCurrencySelector compact className="footer-locale-selector" />
            <span className="sep" aria-hidden="true">•</span>
            <Link href="/legal">حریم خصوصی و داده‌های بالینی</Link>
            <span className="sep" aria-hidden="true">•</span>
            <Link href="/legal">ضمانت اصالت و پلمپ آزمایشگاهی</Link>
            <span className="sep" aria-hidden="true">•</span>
            <Link href="/faq">شرایط مرجوعی و لجستیک سرد</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
