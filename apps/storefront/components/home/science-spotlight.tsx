'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MechanismPhase {
  id: string;
  stepNum: string;
  phaseEn: string;
  titleFa: string;
  shortDesc: string;
  scientificDossier: string;
  telemetry: {
    ph: string;
    o2Burst: string;
    dilation: string;
    persistence: string;
  };
  chemicalFormula: string;
  activeLayerFa: string;
  activeLayerEn: string;
  svgHighlight: number; // 0: Gel, 1: Stratum Corneum, 2: Capillary Bohr, 3: Fibroblasts
}

const MECHANISM_PHASES: MechanismPhase[] = [
  {
    id: 'infusion',
    stepNum: '۰۱',
    phaseEn: 'EPIDERMAL INFUSION',
    titleFa: 'واکنش زیست‌شیمیایی در سطح اپیدرم و نفوذ CO₂',
    shortDesc: 'ترکیب پایه قلیایی ژل CarboxyGel با پاد یا ماسک اکتیواتور، واکنش خنثی‌سازی ترابافتی ایجاد کرده و میلیاردها میکروحباب اشباع CO₂ پایدار تولید می‌کند.',
    scientificDossier: 'واکنش اسید-باز کنترل‌شده روی لایه استراتوم کورنئوم بدون سوزن، گرادیان غلظت بالای گاز دی‌اکسید کربن را در محفظه بسته تشکیل می‌دهد.',
    telemetry: {
      ph: '۳.۸ pH',
      o2Burst: '+۱۸٪ پایه',
      dilation: '+۲۵٪ قطر',
      persistence: '۲۴ ساعت',
    },
    chemicalFormula: 'NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3H₂O + 3CO₂↑',
    activeLayerFa: 'لایه شاخی اپیدرم و ژل فعال',
    activeLayerEn: 'Stratum Corneum & CarboxyGel Matrix',
    svgHighlight: 0,
  },
  {
    id: 'dissociation',
    stepNum: '۰۲',
    phaseEn: 'BOHR TRANSDUCTION',
    titleFa: 'تحریک اختصاصی اثر بوهر (Bohr Effect)',
    shortDesc: 'نفوذ دی‌اکسید کربن به مایع بین‌سلولی مویرگ‌ها باعث افت موضعی و کنترل‌شده pH خون می‌شود؛ این رخداد پیوند هموگلوبین و اکسیژن را گسسته می‌سازد.',
    scientificDossier: 'طبق اصل بیوشیمیایی کریستین بوهر (۱۹۰۴)، در حضور اسیدیته موضعی و پروتون‌های هیدروژن، منحنی تفکیک اکسی‌هموگلوبین به راست شیفت پیدا می‌کند.',
    telemetry: {
      ph: '۷.۲۲ pH',
      o2Burst: '+۷۶٪ رهایش',
      dilation: '+۸۵٪ قطر',
      persistence: '۴۸ ساعت',
    },
    chemicalFormula: 'Hb(O₂)₄ + H⁺ + CO₂ ⇌ Hb·H⁺·CO₂ + 4O₂ (تخلیه سلولی)',
    activeLayerFa: 'بستر مویرگی درمیس پاپیولار',
    activeLayerEn: 'Papillary Dermis Capillary Loop',
    svgHighlight: 2,
  },
  {
    id: 'vasodilation',
    stepNum: '۰۳',
    phaseEn: 'MICROVASCULAR PERFUSION',
    titleFa: 'اتساع عروقی مویرگ‌ها و بهبود پرفیوژن خونی',
    shortDesc: 'واکنش بافت به هیپرکاپنی موضعی منجر به اتساع شدید عروق خونی و افزایش سرعت گردش خون لنفاوی و رفع احتقان مایع بافتی می‌گردد.',
    scientificDossier: 'افزایش قطر لومن مویرگ‌ها تا ۲.۴ برابر، جریان خون حاوی مواد مغذی را به سمت نواحی آسیب‌دیده، لک‌های پیگمانته و بافت‌های ملتهب هدایت می‌کند.',
    telemetry: {
      ph: '۷.۳۵ pH',
      o2Burst: '+۹۲٪ رهایش',
      dilation: '+۱۳۸٪ قطر',
      persistence: '۶۰ ساعت',
    },
    chemicalFormula: 'Endothelial NO Activation → Microvascular Vasodilation',
    activeLayerFa: 'عروق ریز بستر درمیس',
    activeLayerEn: 'Deep Dermis Microvascular Network',
    svgHighlight: 2,
  },
  {
    id: 'neocollagenesis',
    stepNum: '۰۴',
    phaseEn: 'ATP BURST & COLLAGENESIS',
    titleFa: 'جهش تنفس میتوکندری و سنتز کلاژن I و III',
    shortDesc: 'سلول‌های فیبروبلاست با غوطه‌ور شدن در سیلاب اکسیژن، تولید انرژی زیستی (ATP) را ۳.۸ برابر ارتقا داده و نئوکلاژنز عمقی را فعال می‌کنند.',
    scientificDossier: 'سنتز پروتئین‌های پروکلاژن و زنجیره‌های الاستین در ماتریکس برون‌سلولی شتاب گرفته و سد دفاعی پوست تا ۴۸ ساعت نفوذپذیری بهینه را حفظ می‌کند.',
    telemetry: {
      ph: '۷.۴۰ pH',
      o2Burst: '+۳۰۰٪ اکسیژن',
      dilation: '+۱۰۰٪ پایدار',
      persistence: '۷۲ ساعت پایداری',
    },
    chemicalFormula: 'ADP + Pi + O₂ (Bohr Induced) → 38 ATP + Procollagen I/III',
    activeLayerFa: 'فیبروبلاست‌های ماتریکس خارج‌سلولی',
    activeLayerEn: 'Extracellular Matrix & Active Fibroblasts',
    svgHighlight: 3,
  },
];

export function ScienceMechanismSpotlight() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(1);
  const activePhase = MECHANISM_PHASES[activePhaseIndex];

  return (
    <section id="science" className="science-spotlight-section" aria-labelledby="science-title">
      <div className="science-layout-grid">
        {/* Top Header Row with Editorial Clinical Hierarchy */}
        <div className="science-header-block">
          <div className="science-eyebrow-row">
            <span className="science-eyebrow-chip">
              <span className="science-chip-pulse" aria-hidden="true" />
              PHYSIOLOGY ATLAS · CAMBRIDGE RESEARCH DOSSIER
            </span>
            <span className="science-patent-id">PATENT WO2024/091218 · BOHR EFFECT MEDICAL OS</span>
          </div>

          <div className="science-title-flex">
            <div className="science-title-col">
              <h2 id="science-title" className="science-main-heading">
                مکانیسم زیست‌شیمیایی اثر بوهر: اکسیژن‌رسانی عمقی سلول‌ها بدون سوزن
              </h2>
              <p className="science-lead">
                سیستم کربوکسی‌تراپی غیرتهاجمی Dr. Dermer UK بر پایه اصل فیزیولوژیک کریستین بوهر (۱۹۰۴) عمل می‌کند؛ جایی که تعامل هدفمند ژل فعال ۲ فاز و پادهای ترابافتی، بدون هیچ‌گونه نیدلینگ یا درد، سلول‌های هیپوکسی‌شده پوست را از درون مویرگ‌ها اکسیژن‌باران می‌کند.
              </p>
            </div>

            <div className="science-header-ctas">
              <a href="#bohr-simulator" className="btn-science-explore">
                <span>تست تعاملی شبیه‌ساز اثر بوهر</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </a>
              <Link href="/carboxygel" className="btn-science-secondary">
                مشاهده پرونده فرمولاسیون CarboxyGel
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Phase Navigator */}
        <div className="science-steps-navigator" role="tablist" aria-label="مراحل ۴ گانه واکنش اثر بوهر">
          {MECHANISM_PHASES.map((phase, idx) => {
            const isActive = idx === activePhaseIndex;
            return (
              <button
                type="button"
                role="tab"
                key={phase.id}
                aria-selected={isActive}
                aria-controls={`phase-panel-${phase.id}`}
                className={`science-phase-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActivePhaseIndex(idx)}
              >
                <div className="tab-top-row">
                  <span className="tab-step-num">{phase.stepNum}</span>
                  <span className="tab-metric-pill">{phase.telemetry.o2Burst}</span>
                </div>
                <h3 className="tab-step-title">{phase.titleFa}</h3>
                <span className="tab-phase-en">{phase.phaseEn}</span>
              </button>
            );
          })}
        </div>

        {/* Master Stage: Dual Panel with Clinical Dossier (Right) & Skin Anatomy Cross-Section (Left) */}
        <div className="science-master-stage" id={`phase-panel-${activePhase.id}`} role="tabpanel">
          {/* Column 1 (Right in RTL): Clinical Dossier & Real Product Anchoring */}
          <div className="science-dossier-card">
            <div className="dossier-head">
              <div className="dossier-phase-badge">
                <span>فاز {activePhase.stepNum}:</span>
                <strong>{activePhase.phaseEn}</strong>
              </div>
              <h3 className="dossier-title">{activePhase.titleFa}</h3>
              <p className="dossier-desc">{activePhase.shortDesc}</p>
            </div>

            <div className="dossier-chemical-callout">
              <div className="callout-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
                </svg>
                <span>معادله استوکیومتری بالینی واکنش:</span>
              </div>
              <code className="chemical-code">{activePhase.chemicalFormula}</code>
            </div>

            <div className="dossier-details-block">
              <h4 className="dossier-subheading">ارزیابی بالینی درموسوتیکال (Clinical Assessment):</h4>
              <p className="dossier-detail-text">{activePhase.scientificDossier}</p>
            </div>

            {/* Official Product Pairing Stage: Genuine Packaging */}
            <div className="dossier-product-anchor">
              <div className="product-anchor-image-wrap">
                <img
                  src="/assets/drdermer/2025/07/site-combo-carboxy-1-600x600.png"
                  alt="کیت رسمی کربوکسی‌تراپی ReeSkin Dr. Dermer"
                  className="product-anchor-img"
                  loading="lazy"
                />
              </div>
              <div className="product-anchor-copy">
                <span className="anchor-tag">کیت کلینیکال و خانگی رسمی</span>
                <h4 className="anchor-name">ReeSkin™ CarboxyGel & CarboxyPod Combo</h4>
                <p className="anchor-brief">
                  تنها سامانه ثبت‌شده فعال‌ساز اثر بوهر با ژل‌های سه‌گانه گلیکولیک، آزالائیک و مولتی‌اکتیو.
                </p>
                <div className="anchor-links">
                  <Link href="/carboxygel" className="anchor-link-primary">
                    بررسی مشخصات دارویی CarboxyGel ←
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 (Left in RTL): High-Precision Histological Skin Cross-Section */}
          <div className="science-histology-card">
            <div className="histology-top-bar">
              <div className="histology-status">
                <span className="status-indicator live" aria-hidden="true" />
                <span>شبیه‌سازی بافت‌شناسی و فلوی گازی ترنس‌درمال</span>
              </div>
              <div className="histology-layer-tags">
                <span className="histology-layer-badge">{activePhase.activeLayerFa}</span>
                <span className="histology-layer-sub">{activePhase.activeLayerEn}</span>
              </div>
            </div>

            {/* High-Fidelity Clinical Cross-Section SVG (Direction-Isolated) */}
            <div className="histology-svg-wrap" aria-hidden="true">
              <svg viewBox="0 0 540 330" className="histology-diagram-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Top Gel Layer Gradient */}
                  <linearGradient id="cbgGelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E3A2F" />
                    <stop offset="100%" stopColor="#142820" />
                  </linearGradient>

                  {/* Stratum Corneum */}
                  <linearGradient id="scGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F5EFE6" />
                    <stop offset="100%" stopColor="#EADCCB" />
                  </linearGradient>

                  {/* Viable Epidermis */}
                  <linearGradient id="epidermisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FAF2EB" />
                    <stop offset="100%" stopColor="#F2DFD3" />
                  </linearGradient>

                  {/* Dermis Matrix */}
                  <linearGradient id="dermisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FAF7F2" />
                    <stop offset="100%" stopColor="#F1EDE4" />
                  </linearGradient>

                  {/* Capillary Blood Vessel */}
                  <linearGradient id="capillaryGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#BE123C" />
                    <stop offset="50%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>

                  {/* Oxygen Molecule Burst */}
                  <radialGradient id="o2Burst" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0369A1" />
                  </radialGradient>

                  {/* CO2 Nano Bubble */}
                  <radialGradient id="co2Bubble" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#A7F3D0" />
                    <stop offset="70%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </radialGradient>
                </defs>

                {/* Layer 1: Topical CarboxyGel Active Formula */}
                <rect
                  x="15"
                  y="15"
                  width="510"
                  height="40"
                  rx="7"
                  fill="url(#cbgGelGrad)"
                  stroke={activePhase.svgHighlight === 0 ? '#C69C70' : 'rgba(198,156,112,0.3)'}
                  strokeWidth={activePhase.svgHighlight === 0 ? 2.5 : 1}
                />
                <text x="32" y="39" fill="#E4C9A8" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
                  CarboxyGel™ Topical Matrix
                </text>
                <text x="505" y="39" fill="#A7F3D0" fontSize="9.5" fontWeight="700" textAnchor="end" fontFamily="sans-serif">
                  pH 3.8 · CO₂ Infusion (1,200+ PPM)
                </text>

                {/* Effervescent Micro-Bubbles */}
                <g className="co2-bubbles-cluster">
                  <circle cx="215" cy="35" r="5.5" fill="url(#co2Bubble)" opacity="0.9" />
                  <circle cx="245" cy="33" r="7" fill="url(#co2Bubble)" opacity="0.85" />
                  <circle cx="275" cy="36" r="5" fill="url(#co2Bubble)" opacity="0.95" />
                  <circle cx="305" cy="32" r="7.5" fill="url(#co2Bubble)" opacity="0.9" />
                  <circle cx="335" cy="37" r="6" fill="url(#co2Bubble)" opacity="0.85" />
                </g>

                {/* Layer 2: Stratum Corneum & Skin Surface Barrier */}
                <rect
                  x="15"
                  y="60"
                  width="510"
                  height="24"
                  fill="url(#scGrad)"
                  stroke={activePhase.svgHighlight === 0 ? '#10B981' : '#D6C7B2'}
                  strokeWidth="1"
                />
                <text x="32" y="76" fill="#786650" fontSize="9" fontWeight="800" fontFamily="sans-serif">
                  Stratum Corneum (لایه سد شاخی)
                </text>
                <text x="505" y="76" fill="#8C7A64" fontSize="8.5" fontWeight="600" textAnchor="end" fontFamily="sans-serif">
                  Non-Invasive Barrier Diffusion
                </text>

                {/* Layer 3: Viable Epidermis */}
                <rect x="15" y="86" width="510" height="50" fill="url(#epidermisGrad)" stroke="#E5D6C5" strokeWidth="1" />
                <text x="32" y="106" fill="#8F5E4B" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                  Viable Epidermis (اپیدرم زنده)
                </text>
                <text x="505" y="106" fill="#A16207" fontSize="8.5" fontWeight="600" textAnchor="end" fontFamily="sans-serif">
                  Bicarbonate & H⁺ Ion Transport
                </text>

                {/* Transdermal downward diffusion arrows */}
                <g stroke="#10B981" strokeWidth="1.6" strokeDasharray="3 3" fill="none">
                  <path d="M 175,55 L 175,125" />
                  <path d="M 365,55 L 365,125" />
                </g>
                <polygon points="175,129 171,121 179,121" fill="#10B981" />
                <polygon points="365,129 361,121 369,121" fill="#10B981" />

                {/* Layer 4: Dermis with Collagen Matrix & Microcapillary */}
                <rect
                  x="15"
                  y="138"
                  width="510"
                  height="178"
                  rx="6"
                  fill="url(#dermisGrad)"
                  stroke={activePhase.svgHighlight >= 2 ? 'rgba(30,58,47,0.35)' : '#E0D7C8'}
                  strokeWidth="1.2"
                />

                {/* Collagen & Elastin Fibers in Background */}
                <g stroke="#D5CBBB" strokeWidth="1" strokeLinecap="round" opacity="0.6">
                  <line x1="45" y1="162" x2="160" y2="152" />
                  <line x1="85" y1="192" x2="220" y2="182" />
                  <line x1="340" y1="158" x2="480" y2="172" />
                  <line x1="310" y1="188" x2="450" y2="202" />
                  <line x1="120" y1="285" x2="260" y2="300" />
                  <line x1="280" y1="280" x2="420" y2="270" />
                </g>

                {/* Active Spindle-Shaped Fibroblasts */}
                <g fill="#B45309" opacity="0.85">
                  <path d="M 80,175 Q 95,165 120,175 Q 95,185 80,175 Z" />
                  <text x="100" y="167" fill="#92400E" fontSize="7.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Fibroblast</text>

                  <path d="M 430,170 Q 445,160 470,170 Q 445,180 430,170 Z" />
                  <text x="450" y="162" fill="#92400E" fontSize="7.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Fibroblast</text>
                </g>

                {/* Anatomical Capillary Blood Loop */}
                <path
                  d="M 35,240 C 160,200 380,200 505,240"
                  fill="none"
                  stroke="url(#capillaryGlow)"
                  strokeWidth={activePhase.id === 'vasodilation' ? 38 : 32}
                  strokeLinecap="round"
                />
                <path
                  d="M 35,240 C 160,200 380,200 505,240"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  opacity="0.4"
                />

                {/* Erythrocytes (Red Blood Cells) Inside Capillary */}
                {/* RBC 1: Oxy-hemoglobin (Hb-O2) before dissociation */}
                <g transform="translate(130, 222)">
                  <ellipse cx="0" cy="0" rx="16" ry="11" fill="#BE123C" />
                  <ellipse cx="0" cy="0" rx="9" ry="6" fill="#9F1239" />
                  <text x="0" y="3" fill="#FFFFFF" fontSize="7.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Hb-O₂</text>
                </g>

                {/* RBC 2: Active Bohr Dissociation in Middle */}
                <g transform="translate(270, 214)">
                  <ellipse cx="0" cy="0" rx="19" ry="12" fill="#E11D48" filter="drop-shadow(0 0 6px rgba(225,29,72,0.5))" />
                  <ellipse cx="0" cy="0" rx="11" ry="7" fill="#9F1239" />
                  <text x="0" y="3.5" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">Hb</text>
                </g>

                {/* RBC 3: Deoxygenated RBC leaving capillary */}
                <g transform="translate(410, 226)">
                  <ellipse cx="0" cy="0" rx="15" ry="10" fill="#4338CA" />
                  <ellipse cx="0" cy="0" rx="8" ry="5" fill="#3730A3" />
                  <text x="0" y="3" fill="#E0E7FF" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Deoxy-Hb</text>
                </g>

                {/* Released Oxygen Cascades Bursting Out into Dermis */}
                <g transform="translate(270, 214)">
                  {/* Oxygen Molecule 1 */}
                  <g transform="translate(-45, -42)">
                    <circle cx="0" cy="0" r="12" fill="url(#o2Burst)" filter="drop-shadow(0 3px 8px rgba(3,105,161,0.5))" />
                    <text x="0" y="4" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">O₂</text>
                    <path d="M 22,24 L 5,6" stroke="#0284C7" strokeWidth="2" strokeDasharray="2 2" />
                  </g>

                  {/* Oxygen Molecule 2 */}
                  <g transform="translate(0, -56)">
                    <circle cx="0" cy="0" r="13" fill="url(#o2Burst)" filter="drop-shadow(0 4px 10px rgba(3,105,161,0.6))" />
                    <text x="0" y="4" fill="#FFFFFF" fontSize="9.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">O₂</text>
                    <path d="M 0,28 L 0,8" stroke="#0284C7" strokeWidth="2" strokeDasharray="2 2" />
                  </g>

                  {/* Oxygen Molecule 3 */}
                  <g transform="translate(48, -40)">
                    <circle cx="0" cy="0" r="12" fill="url(#o2Burst)" filter="drop-shadow(0 3px 8px rgba(3,105,161,0.5))" />
                    <text x="0" y="4" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">O₂</text>
                    <path d="M -22,24 L -5,6" stroke="#0284C7" strokeWidth="2" strokeDasharray="2 2" />
                  </g>
                </g>

                {/* Scientific Capillary Description */}
                <text x="270" y="274" fill="#1E3A2F" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
                  BOHR DISMUTATION & DEEP TISSUE HYPER-OXYGENATION
                </text>
                <text x="270" y="292" fill="#64748B" fontSize="8.5" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
                  Capillary Vasodilation · VEGF Neovascularization · Fibroblast ATP Acceleration
                </text>
              </svg>
            </div>

            {/* In Vivo Telemetry Banner (Dynamically linked to selected phase) */}
            <div className="histology-telemetry-strip">
              <div className="telemetry-item">
                <span className="tel-val">{activePhase.telemetry.ph}</span>
                <span className="tel-lbl">اسیدیته ژل فعال</span>
              </div>
              <div className="tel-separator" aria-hidden="true" />
              <div className="telemetry-item">
                <span className="tel-val">{activePhase.telemetry.o2Burst}</span>
                <span className="tel-lbl">آزادسازی اکسیژن O₂</span>
              </div>
              <div className="tel-separator" aria-hidden="true" />
              <div className="telemetry-item">
                <span className="tel-val">{activePhase.telemetry.dilation}</span>
                <span className="tel-lbl">اتساع عروقی موضعی</span>
              </div>
              <div className="tel-separator" aria-hidden="true" />
              <div className="telemetry-item">
                <span className="tel-val">{activePhase.telemetry.persistence}</span>
                <span className="tel-lbl">پایداری سنتز کلاژن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
