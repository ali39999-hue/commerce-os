'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Re-architected Audience Path Selector (Skincare & Clinical Formulations Focus)
 * Pure formulations, carboxy regimens, and transdermal protocols — no hardware devices.
 */
export function PathSelector() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const paths = [
    {
      id: 'home-care',
      tag: 'DAILY CLINICAL REGIMEN',
      regBadge: 'مراقبت فردی • نسخه خانگی',
      category: 'ReeSkin™ Skincare Essentials',
      title: 'رژیم مراقبت بالینی خانگی',
      lead: 'فرمولاسیون‌های دارویی ترنس‌درمال، ترمیم سد دفاعی پوست، لایه‌برداری ملایم میکرودرم و پپتیدهای جوانساز با تحریک طبیعی اثر بوهر در منزل.',
      heroImg: '/assets/drdermer/2025/07/azelaic-acid-carboxygel-207x300.png',
      heroAlt: 'فرمولاسیون ژل ترنس‌درمال CarboxyGel دکتر درمر',
      stageBadge: 'ReeSkin™ Daily Care',
      stageSubtitle: 'روتین پایدار سلامت و درخشش پوست',
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
      ctaLabel: 'مشاهده و سفارش روتین خانگی',
      catalogCount: 'فرمولاسیون‌های فعال',
      href: '/reeskin',
      themeKey: 'theme-homecare',
      accentColor: '#1E3A2F',
    },
    {
      id: 'carboxy-protocols',
      tag: 'BOHR EFFECT ADVANCED PROTOCOLS',
      regBadge: 'کربوکسی‌تراپی بدون سوزن',
      category: 'ReeSkin™ Carboxy System',
      title: 'پروتکل‌های کربوکسی‌تراپی ۲ فاز',
      lead: 'هم‌افزایی ژل‌های تخصصی گلیکولیک، آزالائیک و مولتی‌اکتیو با کپسول‌های فعال‌ساز CarboxyPod جهت اکسیژن‌رسانی عمقی و رفع ریشه‌ای لک و چین‌وچروک.',
      heroImg: '/assets/drdermer/2025/07/carbon-carboxypod-1-1-445x600.png',
      heroAlt: 'کارتریج‌های فعال‌ساز ترابافتی CarboxyPod',
      stageBadge: 'CarboxyPod™ Activation',
      stageSubtitle: 'انفوزیون نانوحباب‌های متراکم CO₂',
      metrics: [
        { label: 'رهایش اکسیژن بافتی', val: '+۷۶٪' },
        { label: 'کنترل بدون سوزن', val: '۱۰۰٪ ایمن' },
      ],
      highlights: [
        'ژل اسید آزالائیک ۱۵٪ ضدلک و تیرگی ملاسما',
        'ژل اسید گلیکولیک ۱۰٪ جوانساز و ضدچروک',
        'ژل مولتی‌اکتیو ترمیم‌کننده پوست‌های حساس',
        'کپسول‌های تخصص‌یافته کربن، ویتامین و هیدرا',
      ],
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      ctaLabel: 'بررسی کیت‌های کربوکسی‌تراپی',
      catalogCount: 'کیت‌های کامل درمانی',
      href: '/carboxygel',
      themeKey: 'theme-pro',
      accentColor: '#4D6B58',
    },
    {
      id: 'activator-pads',
      tag: 'ANATOMIC ACTIVATOR SHEETS',
      regBadge: 'شیت‌های میکروپرمنبران',
      category: 'ReeSkin™ Sheet Matrices',
      title: 'ماسک‌ها و پدهای فعال‌ساز ترنس‌درمال',
      lead: 'پدهای کاتالیزور پیش‌برش‌خورده با برش آناتومیک برای صورت، گردن، زیر چشم و دکلته؛ به دام انداختن گاز CO₂ و بیشینه‌سازی راندمان اثر بوهر روی پوست.',
      heroImg: '/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png',
      heroAlt: 'پدهای فعال‌ساز آناتومیک صورت و گردن CarboxyPad',
      stageBadge: 'CarboxyPad™ Matrices',
      stageSubtitle: 'برش آناتومیک صورت، گردن و پلک',
      metrics: [
        { label: 'راندمان تبادل گازی', val: '+۴۰٪' },
        { label: 'پکینگ استریل', val: 'فویل محافظ' },
      ],
      highlights: [
        'ماسک‌های کامل ارگونومیک صورت (Facial Sheets)',
        'پدهای پیش‌برش‌خورده اختصاصی گردن و غبغب',
        'پدهای ظریف مخصوص خطوط دور چشم و پلک',
        'سازگار با تمامی فرمولاسیون‌های ژل کربوکسی',
      ],
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      ctaLabel: 'مشاهده شیت‌ها و پدهای فعال‌ساز',
      catalogCount: 'پدهای آناتومیک',
      href: '/carboxypad',
      themeKey: 'theme-equipment',
      accentColor: '#755A38',
    },
  ];

  return (
    <section className="path-triage-section" aria-labelledby="path-triage-title">
      <div className="path-triage-container">
        {/* Section Header */}
        <div className="path-triage-header">
          <div className="triage-eyebrow-pill">
            <span className="triage-dot" />
            <span>CLINICAL SKINCARE TRIAGE · مسیرهای سه‌گانه تخصصی پوست</span>
          </div>

          <h2 id="path-triage-title" className="triage-headline">
            شما در کدام مسیر مراقبت پوستی همراه دکتر درمر هستید؟
          </h2>

          <p className="triage-lead">
            برای تسریع در دسترسی به محصولات و پروتکل‌ها، رسته مورد نظر خود را متناسب با روتین روزمره، پروتکل‌های تخصصی کربوکسی‌تراپی یا شیت‌های فعال‌ساز انتخاب فرمایید.
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
                {/* Top Identification Badge */}
                <div className="triage-top-bar">
                  <span className="triage-reg-badge">{p.regBadge}</span>
                  <span className="triage-cat-tag">{p.category}</span>
                </div>

                {/* Hero Title & Lead */}
                <div className="triage-hero-text">
                  <div className="triage-title-row">
                    <span className="triage-icon-wrap" aria-hidden="true">
                      {p.iconSvg}
                    </span>
                    <h3 className="triage-card-title">{p.title}</h3>
                  </div>
                  <p className="triage-card-lead">{p.lead}</p>
                </div>

                {/* Visual Product Showcase Stage */}
                <div className="triage-visual-stage">
                  <div className="triage-image-box">
                    <img
                      src={p.heroImg}
                      alt={p.heroAlt}
                      className="triage-product-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="triage-stage-caption">
                    <span className="stage-badge">{p.stageBadge}</span>
                    <span className="stage-sub">{p.stageSubtitle}</span>
                  </div>
                </div>

                {/* Clinical Metrics Strip */}
                <div className="triage-metrics-strip">
                  {p.metrics.map((m, i) => (
                    <div className="triage-metric-item" key={i}>
                      <span className="triage-metric-val">{m.val}</span>
                      <span className="triage-metric-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <ul className="triage-highlights-list">
                  {p.highlights.map((h, i) => (
                    <li key={i}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Action Link */}
                <div className="triage-action-wrap">
                  <Link href={p.href} className="triage-action-btn">
                    <span>{p.ctaLabel}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </Link>
                  <span className="triage-count-note">{p.catalogCount}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
