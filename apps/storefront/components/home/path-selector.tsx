'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Re-architected Audience Path Selector (Luxury Clinical Triage)
 * Dr Dermer UK Clinical & Commerce OS — Phase 09 Architectural Redesign
 *
 * Implements:
 * - Interactive 3-Way Journey Triage: At-Home Patient vs Clinic Cabin Consumables vs Medical Hardware
 * - Rich visual badges, active ingredient highlights, and direct pathway preview
 * - Clinical metrics & statutory regulatory classifications
 */
export function PathSelector() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const paths = [
    {
      id: 'home-care',
      tag: 'HOME CLINICAL REGIMEN',
      regBadge: 'نسخه بدون سوزن • استفاده فردی',
      category: 'ReeSkin™ Cosmeceuticals',
      title: 'رژیم مراقبت بالینی خانگی',
      lead: 'فرمولاسیون‌های دارویی ترنس‌درمال ۲ فاز CarboxyGel، ترمیم سد دفاعی پوست، لایه‌برداری ملایم میکرودرم و پپتیدهای جوانساز با تحریک طبیعی اثر بوهر در منزل.',
      metrics: [
        { label: 'افزایش اکسیژناسیون', val: '+۴۵٪' },
        { label: 'پایداری سد دفاعی', val: '۷۲ ساعت' },
      ],
      highlights: [
        'کیت‌های ۵ و ۱۰ عددی CarboxyGel خانگی',
        'خمیر پولیش ابریشمی آلومینا Crystalene',
        'اسکراب دتوکس منافذ و جاذب سبوم Silicalene',
        'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene',
      ],
      iconSvg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
      ctaLabel: 'مشاهده و سفارش محصولات خانگی',
      catalogCount: '۸ فرمولاسیون فعال',
      href: '/reeskin',
      themeKey: 'theme-homecare',
      accentColor: '#06b6d4',
    },
    {
      id: 'clinical-pro',
      tag: 'CLINIC CONSUMABLES & PROTOCOLS',
      regBadge: 'ویژه مطب و مراکز درمانی',
      category: 'ReeMed™ Cabin Consumables',
      title: 'اقلام کابین و پروتکل‌های مطبی',
      lead: 'مخازن بزرگ اقتصادی ۵۰۰ و ۱۵۰۰ میلی‌لیتر ژل کربوکسی همراه با شیت‌های استریل ۵۰ ستی صورت و گردن و کارتریج‌های تک‌دوز فعال‌ساز CarboxyPod.',
      metrics: [
        { label: 'سفارش حجم بالا', val: 'تخفیف پلکانی' },
        { label: 'ارسال سرد ایمن', val: '۲°C - ۸°C' },
      ],
      highlights: [
        'مخازن ۵۰۰ml و ۱۵۰۰ml کربوکسی کابین',
        'پدهای فیبری استریل ۵۰ ستی صورت و گردن',
        'فاکتور رسمی شرکتی با شناسه رهگیری TTAC',
        'پک‌های ژل تخصصی بعد از لیزر و میکرونیدلینگ',
      ],
      iconSvg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      ctaLabel: 'مشاهده اقلام کابین و مطب',
      catalogCount: 'پک‌های حرفه‌ای کلینیک',
      href: '/reemed#consumables',
      themeKey: 'theme-pro',
      accentColor: '#10b981',
    },
    {
      id: 'medical-equipment',
      tag: 'MEDICAL HARDWARE & STATIONS',
      regBadge: 'MDR Class IIb Certified · CE 0123',
      category: 'ReeMed™ Digital Consoles',
      title: 'تجهیزات و سامانه‌های پزشکی',
      lead: 'ایستگاه‌های پیشرفته تزریق دیجیتال CO₂ با دقت فوق‌العاده ۱cc/min در کنار سامانه بیورزونانس پلاسمای سرد اتمسفری ویژه متخصصین درماتولوژی و جراحان پوست.',
      metrics: [
        { label: 'دقت دوز گاز', val: '±۰.۵ cc' },
        { label: 'گارانتی طلایی', val: '۲۴ ماه تعویض' },
      ],
      highlights: [
        'ایستگاه تخصصی تزریق گاز CarboX™ Digital',
        'سامانه انرژی پلاسمای سرد و تخلیه جرقه‌ای PlasmaX™',
        'آموزش‌های دارای امتیاز بازآموزی (CME بریتانیا)',
        'پشتیبانی فنی و تأمین قطعات یدکی شرکتی',
      ],
      iconSvg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      ctaLabel: 'بررسی تجهیزات و استعلام B2B',
      catalogCount: 'کنسول‌های MDR اروپا',
      href: '/reemed#devices',
      themeKey: 'theme-equipment',
      accentColor: '#8b5cf6',
    },
  ];

  return (
    <section className="path-triage-section" aria-labelledby="path-triage-title">
      <div className="path-triage-container">
        {/* Section Header */}
        <div className="path-triage-header">
          <div className="triage-eyebrow-pill">
            <span className="triage-dot" />
            <span>CLINICAL AUDIENCE TRIAGE · مسیرهای سه‌گانه تخصصی</span>
          </div>

          <h2 id="path-triage-title" className="triage-headline">
            شما در کدام مسیر تخصصی همراه دکتر درمر هستید؟
          </h2>

          <p className="triage-lead">
            برای تسریع در دسترسی به محصولات و پروتکل‌ها، رسته مورد نظر خود را متناسب با نیاز مصرف فردی، ملزومات کابین مطب یا تجهیزات جراحی انتخاب فرمایید.
          </p>
        </div>

        {/* 3-Column Luxury Cards Grid */}
        <div className="path-triage-cards-grid">
          {paths.map((p) => {
            const isHovered = hoveredPath === p.id;
            return (
              <article
                key={p.id}
                className={`triage-card ${p.themeKey} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredPath(p.id)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                {/* Visual Top Glow Aura */}
                <div className="triage-card-aura" />

                {/* Top Badge & Category */}
                <div className="triage-card-header">
                  <div className="triage-badge-group">
                    <span className="triage-tag">{p.tag}</span>
                    <span className="triage-reg-pill">{p.regBadge}</span>
                  </div>
                  <div className="triage-icon-wrap" aria-hidden="true">
                    {p.iconSvg}
                  </div>
                </div>

                <div className="triage-category-kicker">{p.category}</div>
                <h3 className="triage-card-title">{p.title}</h3>
                <p className="triage-card-lead">{p.lead}</p>

                {/* Quick Metrics Bar */}
                <div className="triage-metrics-row">
                  {p.metrics.map((m, idx) => (
                    <div className="triage-metric-box" key={idx}>
                      <span className="tmb-label">{m.label}</span>
                      <strong className="tmb-val">{m.val}</strong>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <ul className="triage-features-list" aria-label="شاخص‌های برجسته این مسیر">
                  {p.highlights.map((h, idx) => (
                    <li key={idx}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Action Footer */}
                <div className="triage-action-footer">
                  <Link href={p.href} className="triage-cta-button">
                    <div className="cta-txt-wrap">
                      <span className="cta-main-txt">{p.ctaLabel}</span>
                      <span className="cta-sub-txt">{p.catalogCount}</span>
                    </div>
                    <div className="cta-arrow-circle" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
