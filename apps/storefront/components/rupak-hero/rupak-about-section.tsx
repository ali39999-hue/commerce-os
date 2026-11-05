'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react';
import './rupak-about-section.css';

export interface RupakAboutSectionProps {
  onConsultationSubmit?: (phone: string) => Promise<boolean> | boolean;
}

export function RupakAboutSection({ onConsultationSubmit }: RupakAboutSectionProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.trim().replace(/[۰-۹]/g, (d) =>
      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    );

    // Validate Iranian mobile format (09xxxxxxxxx or +989xxxxxxxxx)
    const phoneRegex = /^(?:0|\+98)?9\d{9}$/;
    if (!phoneRegex.test(cleanNumber)) {
      setSubmitStatus('error');
      setErrorMessage('لطفاً یک شماره موبایل معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.');
      return;
    }

    setSubmitStatus('loading');

    try {
      if (onConsultationSubmit) {
        await onConsultationSubmit(cleanNumber);
      } else {
        // Default simulated network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSubmitStatus('success');
      setPhoneNumber('');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch {
      setSubmitStatus('error');
      setErrorMessage('خطایی در ثبت درخواست رخ داد. لطفاً مجدداً تلاش فرمایید.');
    }
  };

  return (
    <section
      dir="rtl"
      className="rupak-about-section-root"
      aria-label="بخش بنرهای ویژه، درباره روپاک شاپ و مشاوره رایگان"
    >
      <div className="rupak-about-container">
        {/* ==================================================================
            1. DUAL PROMOTIONAL BANNERS (دو بنر دوقلو با گرافیک اختصاصی)
            ================================================================== */}
        <div className="rupak-dual-banners-grid">
          {/* Right Banner in RTL: انواع ضد آفتاب (Sunscreen Banner) */}
          <Link
            href="/search?q=ضد+آفتاب"
            className="rupak-promo-card sunscreen-banner"
            title="مشاهده انواع ضد آفتاب رنگی، بی‌رنگ، فلوئیدی و استیکی"
            aria-label="مشاهده انواع ضد آفتاب رنگی و بی رنگ اصل"
          >
            <div className="rupak-promo-img-wrapper">
              <img
                src="/assets/rupak/about/banner-sunscreen.png"
                alt="انواع ضد آفتاب اصل، فلوئیدی و استیکی"
                className="rupak-promo-banner-img"
                loading="lazy"
              />
            </div>
            {/* Accessible interactive overlay & focus state */}
            <div className="rupak-promo-overlay" aria-hidden="true">
              <span className="rupak-promo-hover-pill">
                <span>مشاهده محصولات</span>
                <ChevronLeft className="w-4 h-4 mr-1" />
              </span>
            </div>
          </Link>

          {/* Left Banner in RTL: تازه ترین محصولات (Newest Products Banner) */}
          <Link
            href="/newest"
            className="rupak-promo-card newest-banner"
            title="مشاهده تازه‌ترین محصولات آرایشی و بهداشتی"
            aria-label="مشاهده تازه‌ترین محصولات"
          >
            <div className="rupak-promo-img-wrapper">
              <img
                src="/assets/rupak/about/banner-newest.png"
                alt="تازه‌ترین محصولات مراقبت از پوست و آرایشی"
                className="rupak-promo-banner-img"
                loading="lazy"
              />
            </div>
            {/* Accessible interactive overlay & focus state */}
            <div className="rupak-promo-overlay" aria-hidden="true">
              <span className="rupak-promo-hover-pill">
                <span>مشاهده محصولات</span>
                <ChevronLeft className="w-4 h-4 mr-1" />
              </span>
            </div>
          </Link>
        </div>

        {/* ==================================================================
            2. "کمی درباره ی روپاک شاپ" (ABOUT RUPAK SHOP 3-COLUMN SHOWCASE)
            ================================================================== */}
        <div className="rupak-about-main-block">
          <div className="rupak-about-grid">
            {/* Column 1 (Right in RTL): Brand Story & Action Buttons */}
            <div className="rupak-about-col-content">
              <div className="rupak-about-title-wrapper">
                <h2 className="rupak-about-heading">کمی درباره ی روپاک شاپ</h2>
                {/* Decorative Green Wave / Zigzag Underline from design */}
                <svg
                  className="rupak-about-wave-svg"
                  viewBox="0 0 140 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 2 7 Q 12 1, 22 7 T 42 7 T 62 7 T 82 7 T 102 7 T 122 7 T 138 7"
                    stroke="#8db29a"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="rupak-about-description">
                روپاک مقصدی منحصر به فرد برای علاقه مندان به محصولات آرایشی و مراقبت
                از پوست است. ما برندهای معتبر و با کیفیت را با دقت انتخاب کرده ایم
                تا به شما در زیبایی و سلامتی کمک کنیم. مأموریت ما ارائه محصولات اصل
                و با کیفیت برای ایجاد تجربه ای مطمئن و لذت بخش است. با انتخاب های
                درست، به زیبایی و اعتماد به نفس خود بیفزایید و به دنیای زیبایی و
                مراقبت از خود سفر کنید.
              </p>

              <div className="rupak-about-actions-row">
                <Link href="/about" className="rupak-about-btn-primary">
                  درباره ما
                </Link>
                <Link href="/contact" className="rupak-about-btn-secondary">
                  تماس با ما
                </Link>
              </div>
            </div>

            {/* Column 2 (Center in RTL): Botanical Arched Podium & Products */}
            <div className="rupak-about-col-visual">
              <div className="rupak-podium-card">
                <img
                  src="/assets/rupak/about/about-podium.png"
                  alt="محصولات مراقبت از پوست روپاک بر روی پدیوم سبز گیاهی"
                  className="rupak-podium-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Column 3 (Left in RTL): 3 Vertically Stacked Stat Badges */}
            <div className="rupak-about-col-stats">
              {/* Stat 1: +۷ سال سابقه کاری */}
              <div className="rupak-stat-card stat-experience">
                <div className="rupak-stat-number">+۷</div>
                <div className="rupak-stat-text-group">
                  <span className="rupak-stat-title">سال سابقه کاری</span>
                  <span className="rupak-stat-subtitle">پخش محصول به صورت عمده و تک</span>
                </div>
              </div>

              {/* Stat 2: +۲K فروش موفق */}
              <div className="rupak-stat-card stat-sales">
                <div className="rupak-stat-number">+۲K</div>
                <div className="rupak-stat-text-group">
                  <span className="rupak-stat-title">فروش موفق</span>
                  <span className="rupak-stat-subtitle">از بهترین محصولات اصل</span>
                </div>
              </div>

              {/* Stat 3: +۶۰۰ تعداد محصولات */}
              <div className="rupak-stat-card stat-products">
                <div className="rupak-stat-number">+۶۰۰</div>
                <div className="rupak-stat-text-group">
                  <span className="rupak-stat-title">تعداد محصولات</span>
                  <span className="rupak-stat-subtitle">با بیشترین رضایت مشتریان</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            3. FREE CONSULTATION CTA BAR (نوار مشاوره رایگان قبل از خرید)
            ================================================================== */}
        <div className="rupak-consultation-bar">
          <div className="rupak-consultation-inner">
            {/* Right side in RTL: Icon badge & Prompt text */}
            <div className="rupak-consultation-prompt">
              <div className="rupak-consultation-badge" aria-hidden="true">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="rupak-consultation-text">
                شما میتوانید قبل از خرید به صورت رایگان مشاوره کنید
              </span>
            </div>

            {/* Left side in RTL: Interactive Phone Input Form */}
            <form onSubmit={handleSubmitConsultation} className="rupak-consultation-form">
              <div className="rupak-consultation-input-wrap">
                <input
                  type="tel"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="شماره تماس"
                  aria-label="شماره موبایل جهت دریافت مشاوره رایگان"
                  className={`rupak-consultation-input ${submitStatus === 'error' ? 'has-error' : ''}`}
                  disabled={submitStatus === 'loading' || submitStatus === 'success'}
                />
              </div>

              <button
                type="submit"
                className="rupak-consultation-btn"
                disabled={submitStatus === 'loading'}
                aria-label="ارسال شماره برای مشاوره رایگان"
              >
                {submitStatus === 'loading' ? (
                  <span className="rupak-btn-spinner" aria-hidden="true" />
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 ml-1.5" />
                    <span>ثبت شد</span>
                  </>
                ) : (
                  <span>ارسال</span>
                )}
              </button>
            </form>
          </div>

          {/* Status Notifications */}
          {submitStatus === 'success' && (
            <div className="rupak-consultation-feedback success" role="alert">
              <CheckCircle2 className="w-4 h-4 ml-1.5 inline" />
              درخواست شما با موفقیت ثبت گردید. کارشناسان روپاک به زودی با شما تماس خواهند گرفت.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="rupak-consultation-feedback error" role="alert">
              <AlertCircle className="w-4 h-4 ml-1.5 inline" />
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
