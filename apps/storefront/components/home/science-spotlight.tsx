'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import './science-spotlight.css';

export function ScienceMechanismSpotlight() {
  const steps = [
    {
      num: '۰۱',
      title: 'واکنش شیمیایی زیستی در سطح اپیدرم',
      desc: 'ترکیب ژل غنی از بیومواد فعال و پاد ترابافتی CarboxyPod، میلیون‌ها میکروحباب CO2 پایدار با فشار اسمزی بهینه را روی پوست رهاسازی می‌کند.',
      phase: 'Epidermal Infusion',
      badgeVariant: 'peach',
    },
    {
      num: '۰۲',
      title: 'تحریک اثر بوهر (Bohr Effect)',
      desc: 'نفوذ دی‌اکسید کربن به عروق مویرگی باعث افت موضعی pH خون می‌شود؛ این تغییر بیوشیمیایی، هموگلوبین را وادار به رهاسازی اکسیژن متصل (O2) در سلول‌ها می‌کند.',
      phase: 'Hemoglobin Dissociation',
      badgeVariant: 'peach',
    },
    {
      num: '۰۳',
      title: 'تکثیر فیبروبلاست و سنتز کلاژن I و III',
      desc: 'سیلاب اکسیژن بافتی، تنفس سلولی میتوکندری را چند برابر ساخته و فرآیند نئواسکولاریزاسیون (رگ‌زایی نو) و تولید شبکه ماتریکس برون‌سلولی را به راه می‌اندازد.',
      phase: 'Cellular Neovascularization',
      badgeVariant: 'peach',
    },
    {
      num: '۰۴',
      title: 'افزایش نفوذپذیری فعال پپتیدها',
      desc: 'سد شاخی پوست تا ۴۸ ساعت در بالاترین سطح جذب قرار می‌گیرد و مولکول‌های درمانی پپتیدی و EGF به طور مستقیم به درم زنده منتقل می‌شوند.',
      phase: 'Transdermal Permeability',
      badgeVariant: 'green',
    },
  ];

  return (
    <section id="science" className="science-spotlight-section" dir="rtl" aria-labelledby="science-title">
      <div className="science-layout-grid">
        {/* Right Side in RTL: Editorial & 4-Step Mechanism Cards */}
        <div className="science-text-side">
          <div className="science-eyebrow-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#5c3813]" />
            <span>بیوشیمی سلولی و فیزیولوژی پوست</span>
          </div>

          <h2 id="science-title" className="science-main-heading">
            اثر بوهر چگونه بدون سوزن، سلول‌ها را{' '}
            <span className="highlight">اکسیژن‌باران</span> می‌کند؟
          </h2>

          <p className="science-lead">
            پدیده‌ای بیوشیمیایی که در سال ۱۹۰۴ توسط فیزیولوژیست نامدار دانمارکی، کریستین بوهر کشف شد؛ اکنون با فناوری انحصاری دکتر درمر، به پیشرفته‌ترین روش جوانسازی و ترمیم غیرتهاجمی پوست در کلینیک‌های پوست اروپا تبدیل شده است.
          </p>

          <div className="science-steps-list">
            {steps.map((st) => (
              <div className="science-step-card" key={st.num}>
                <div className="step-num-wrap">
                  <span className={`step-num-badge ${st.badgeVariant}`}>{st.num}</span>
                  <span className="step-phase-tag">{st.phase}</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{st.title}</h3>
                  <p className="step-desc">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Side in RTL: Biological Mechanism Diagram */}
        <div className="science-diagram-side">
          <div className="diagram-card">
            <div className="diagram-header">
              <div className="dh-title-group">
                <span className="diagram-badge">MECHANISM OF ACTION</span>
                <span className="diagram-sub">چرخه اشباع هموگلوبین (Hb-O₂ Saturation)</span>
              </div>
              <span className="diagram-standard">CLINICAL IN VIVO MODEL</span>
            </div>

            <div className="diagram-illustration" aria-hidden="true">
              <svg viewBox="0 0 380 300" className="science-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* CO2: Sage Green gradient */}
                  <linearGradient id="co2GradSci" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8ec4a7" />
                    <stop offset="100%" stopColor="#77B091" />
                  </linearGradient>
                  {/* O2: Warm Gold / Peach gradient */}
                  <linearGradient id="o2GradSci" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD098" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  {/* RBC Hemoglobin: Soft clinical rose/ruby */}
                  <radialGradient id="rbcGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </radialGradient>
                </defs>

                {/* Capillary Blood Vessel Arch */}
                <path
                  d="M 25,150 Q 190,95 355,150"
                  fill="none"
                  stroke="#ffe4e6"
                  strokeWidth="44"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <path
                  d="M 25,150 Q 190,95 355,150"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  opacity="0.65"
                />

                {/* Hemoglobin Erythrocyte Cell */}
                <circle
                  cx="190"
                  cy="120"
                  r="46"
                  fill="url(#rbcGlow)"
                  filter="drop-shadow(0 4px 14px rgba(225,29,72,0.3))"
                />
                <circle cx="190" cy="120" r="28" fill="#be123c" opacity="0.45" />
                <text x="190" y="120" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">
                  Hb
                </text>
                <text x="190" y="135" fill="#ffe4e6" fontSize="8.5" fontWeight="700" textAnchor="middle">
                  هموگلوبین خون
                </text>

                {/* CO2 Infusion from Surface */}
                <g transform="translate(190, 35)">
                  <circle
                    cx="-45"
                    cy="5"
                    r="16"
                    fill="url(#co2GradSci)"
                    filter="drop-shadow(0 2px 6px rgba(119,176,145,0.4))"
                  />
                  <text x="-45" y="9" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                    CO₂
                  </text>
                  <path d="M -45,22 L -25,65" fill="none" stroke="#77B091" strokeWidth="2.2" strokeDasharray="3 3" />

                  <circle
                    cx="45"
                    cy="5"
                    r="16"
                    fill="url(#co2GradSci)"
                    filter="drop-shadow(0 2px 6px rgba(119,176,145,0.4))"
                  />
                  <text x="45" y="9" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                    CO₂
                  </text>
                  <path d="M 45,22 L 25,65" fill="none" stroke="#77B091" strokeWidth="2.2" strokeDasharray="3 3" />
                </g>

                {/* O2 Released to Deep Tissues */}
                <g transform="translate(190, 205)">
                  <circle
                    cx="-60"
                    cy="20"
                    r="17"
                    fill="url(#o2GradSci)"
                    filter="drop-shadow(0 3px 8px rgba(245,158,11,0.35))"
                  />
                  <text x="-60" y="24" fill="#452b11" fontSize="10.5" fontWeight="900" textAnchor="middle">
                    O₂
                  </text>
                  <path d="M -30,-25 L -52,3" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                  <circle
                    cx="60"
                    cy="20"
                    r="17"
                    fill="url(#o2GradSci)"
                    filter="drop-shadow(0 3px 8px rgba(245,158,11,0.35))"
                  />
                  <text x="60" y="24" fill="#452b11" fontSize="10.5" fontWeight="900" textAnchor="middle">
                    O₂
                  </text>
                  <path d="M 30,-25 L 52,3" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                </g>

                <text x="190" y="275" fill="#475569" fontSize="10.5" fontWeight="700" textAnchor="middle">
                  آزادسازی اکسیژن فعال به سلول‌های فیبروبلاست درم عمقی
                </text>
              </svg>
            </div>

            <div className="diagram-caption">
              <div className="caption-metric">
                <span className="metric-val green">+۳۰۰٪</span>
                <span className="metric-lbl">نفوذپذیری بیواکتیوها و فاکتورهای رشد</span>
              </div>
              <div className="caption-divider" aria-hidden="true" />
              <div className="caption-metric">
                <span className="metric-val amber">۳.۸ pH</span>
                <span className="metric-lbl">تنظیم فیزیولوژیک شیب اسیدیته پوست</span>
              </div>
              <div className="caption-divider" aria-hidden="true" />
              <div className="caption-metric">
                <span className="metric-val green">۷۲ ساعت</span>
                <span className="metric-lbl">پایداری سنتز ماتریکس کلاژن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
