'use client';

import React from 'react';
import {
  ShoppingBag,
  ClipboardCheck,
  CreditCard,
  PackageCheck,
  GraduationCap,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import './rupak-services.css';

export function RupakServicesSection() {
  return (
    <section className="rupak-services-root" dir="rtl" aria-label="راهنمای سفارش و خدمات روپاک شاپ">
      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: نحوه سفارش محصول در روپاک شاپ
          ══════════════════════════════════════════════════════════════ */}
      <div className="rupak-order-guide-card">
        {/* Top Header Pill Badge */}
        <div className="rupak-order-guide-badge-wrap">
          <span className="rupak-order-guide-badge">
            نحوه سفارش محصول در روپاک شاپ
          </span>
        </div>

        {/* 4 Steps Row */}
        <div className="rupak-order-steps-grid" aria-label="مراحل ثبت سفارش آنلاین">
          {/* Step 1 (Right in RTL) */}
          <div className="rupak-order-step-item">
            <div className="rupak-order-step-meta">
              <span className="rupak-order-step-num">۰۱</span>
              <div className="rupak-order-step-icon-box peach" aria-hidden="true">
                <ShoppingBag className="rupak-order-step-icon text-[#5c3813]" />
              </div>
            </div>
            <span className="rupak-order-step-title">
              انتخاب محصول و افزودن به سبد خرید
            </span>
          </div>

          <div className="rupak-order-step-divider" aria-hidden="true" />

          {/* Step 2 */}
          <div className="rupak-order-step-item">
            <div className="rupak-order-step-meta">
              <span className="rupak-order-step-num">۰۲</span>
              <div className="rupak-order-step-icon-box peach" aria-hidden="true">
                <ClipboardCheck className="rupak-order-step-icon text-[#5c3813]" />
              </div>
            </div>
            <span className="rupak-order-step-title">
              پر کردن فرم مشخصات و آدرس ارسال
            </span>
          </div>

          <div className="rupak-order-step-divider" aria-hidden="true" />

          {/* Step 3 */}
          <div className="rupak-order-step-item">
            <div className="rupak-order-step-meta">
              <span className="rupak-order-step-num">۰۳</span>
              <div className="rupak-order-step-icon-box peach" aria-hidden="true">
                <CreditCard className="rupak-order-step-icon text-[#5c3813]" />
              </div>
            </div>
            <span className="rupak-order-step-title">
              پرداخت آنلاین و ثبت سفارش
            </span>
          </div>

          <div className="rupak-order-step-divider" aria-hidden="true" />

          {/* Step 4 (Left in RTL) */}
          <div className="rupak-order-step-item">
            <div className="rupak-order-step-meta">
              <span className="rupak-order-step-num green">۰۴</span>
              <div className="rupak-order-step-icon-box green" aria-hidden="true">
                <PackageCheck className="rupak-order-step-icon text-white" />
              </div>
            </div>
            <span className="rupak-order-step-title">
              تبریک، سفارش شما آماده ارسال است
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: خدمات روپاک شاپ (Green Curved Card with Watermarks)
          ══════════════════════════════════════════════════════════════ */}
      <div className="rupak-services-showcase" aria-label="خدمات و تخصص‌های روپاک شاپ">
        <h2 className="rupak-services-main-title">خدمات روپاک شاپ</h2>

        {/* 3 Cards Container with Watermark Numbers */}
        <div className="rupak-services-cards-grid">
          {/* Card 1 (Right in RTL): محصولات مراقبت پوستی */}
          <div className="rupak-service-card-wrapper">
            <span className="rupak-service-watermark" aria-hidden="true">۰۱</span>
            <div className="rupak-service-card">
              <div className="rupak-service-card-header">
                <div className="rupak-service-icon-box" aria-hidden="true">
                  <GraduationCap className="rupak-service-icon" />
                </div>
                <h3 className="rupak-service-title">محصولات مراقبت پوستی</h3>
              </div>
              <p className="rupak-service-desc">
                ما در زمینه انواع روتین پوستی و مراقبت از پوست تخصص داریم و می‌توانیم به شما در انتخاب بهترین روش‌ها و محصولات متناسب با نوع پوستتان کمک کنیم.
              </p>
            </div>
          </div>

          {/* Card 2 (Center): بهترین محصولات آرایشی */}
          <div className="rupak-service-card-wrapper">
            <span className="rupak-service-watermark" aria-hidden="true">۰۲</span>
            <div className="rupak-service-card">
              <div className="rupak-service-card-header">
                <div className="rupak-service-icon-box" aria-hidden="true">
                  <Sparkles className="rupak-service-icon" />
                </div>
                <h3 className="rupak-service-title">بهترین محصولات آرایشی</h3>
              </div>
              <p className="rupak-service-desc">
                ما در زمینه محصولات آرایشی نیز تخصص داریم و می‌توانیم به شما در انتخاب بهترین گزینه‌ها برای زیبایی و پوشش مناسب کمک کنیم.
              </p>
            </div>
          </div>

          {/* Card 3 (Left in RTL): انواع مکمل های تقویتی */}
          <div className="rupak-service-card-wrapper">
            <span className="rupak-service-watermark" aria-hidden="true">۰۳</span>
            <div className="rupak-service-card">
              <div className="rupak-service-card-header">
                <div className="rupak-service-icon-box" aria-hidden="true">
                  <HeartPulse className="rupak-service-icon" />
                </div>
                <h3 className="rupak-service-title">انواع مکمل های تقویتی</h3>
              </div>
              <p className="rupak-service-desc">
                ما در زمینه مکمل‌های سلامتی و تقویتی هم تخصص داریم و می‌توانیم شما را در انتخاب محصولات مناسب برای بهبود سلامت و انرژی بدن راهنمایی کنیم.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Wave Scallop tips */}
        <div className="rupak-services-bottom-tips" aria-hidden="true">
          <span className="tip" />
          <span className="tip" />
          <span className="tip" />
        </div>
      </div>
    </section>
  );
}
