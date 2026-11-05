"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

interface ClinicalCase {
  id: string;
  category: string;
  title: string;
  patientMeta: string;
  indication: string;
  regimen: string;
  statImprovement: string;
  statMetric: string;
  scientificNotes: string;
  beforeImg: string;
  afterImg: string;
  visiaScoreBefore: string;
  visiaScoreAfter: string;
  protocolSlug: string;
}

const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: "melasma_pigmentation",
    category: "ملاسما و هایپرپیگمانتاسیون",
    title: "درمان لک‌های هورمونی مقاوم و تیرگی یکنواخت گونه و پیشانی",
    patientMeta: "بیمار ۳۸ ساله · فنوتیپ پوستی فیتزپاتریک III · ملاسما اپیدرمال-درمال",
    indication: "مقاوم به هیدروکینون ۴٪ و لایه‌برداری‌های شیمیایی تهاجمی سنتی",
    regimen: "پروتکل ۴ هفته‌ای: کربوکسی‌ژل اسید آزالائیک ۱۵٪ + پاد ترابافتی Hydra-Pod (هفته‌ای ۲ بار)",
    statImprovement: "-۴۸٪",
    statMetric: "کاهش تراکم ملانین در طیف‌سنجی فلورسانس Visia (Grade A+)",
    scientificNotes:
      "افزایش نفوذپذیری فعال آزالائیک با تحریک اثر بوهر موجب مهار رقابتی آنزیم تیروزیناز در ملانوسیت‌ها بدون ایجاد هیپوپیگمانتاسیون راجعه گردید.",
    beforeImg: "/assets/drdermer/trial-melasma-before.png",
    afterImg: "/assets/drdermer/trial-melasma-after.png",
    visiaScoreBefore: "Visia Melanin Score: 42%",
    visiaScoreAfter: "Visia Melanin Score: 89%",
    protocolSlug: "/carboxygel",
  },
  {
    id: "rhytids_crowfeet",
    category: "شیارهای پری‌اوربیتال و پنجه‌کلاغی",
    title: "ترمیم عمق خطوط دور چشم و تحریک کلاژن‌سازی نوع ۱ درمیس",
    patientMeta: "بیمار ۴۶ ساله · فنوتیپ فیتزپاتریک II · خطوط دینامیک پنجه‌کلاغی و افت الاستیسیته",
    indication: "تحلیل ماتریکس برون‌سلولی فیبروبلاست ناشی از افت خون‌رسانی مویرگی",
    regimen: "پروتکل ۳ جلسه‌ای: کربوکسی‌ژل اسید گلیکولیک ۱۰٪ + پاد ترابافتی Carbo-Pod",
    statImprovement: "-۵۴٪",
    statMetric: "کاهش عمق شیارهای پری‌اوربیتال و افزایش ۴۲٪ ضخامت درمیس در اولتراسوند",
    scientificNotes:
      "سیلاب اکسیژن بافتی ناشی از اثر بوهر و اتساع مویرگی پایدار، تولید فاکتور رشد کلاژنی TGF-β را تحریک نموده و شبکه الاستین را نوسازی کرد.",
    beforeImg: "/assets/drdermer/trial-wrinkle-before.png",
    afterImg: "/assets/drdermer/trial-wrinkle-after.png",
    visiaScoreBefore: "Visia Wrinkle Depth: 51%",
    visiaScoreAfter: "Visia Wrinkle Depth: 94%",
    protocolSlug: "/carboxygel",
  },
  {
    id: "eyelid_blepharoplasty",
    category: "بلفاروپلاستی غیرتهاجمی و افتادگی پلک",
    title: "سفت‌سازی بافت سست پلک و بهبود قوام فیبروبلاستی بدون جراحی",
    patientMeta: "بیمار ۵۲ ساله · فنوتیپ فیتزپاتریک II · پتوز خفیف پوستی و سستی کلاژن پلک فوقانی",
    indication: "افت الاستین بافتی بدون اندیکاسیون جراحی تهاجمی بلفاروپلاستی",
    regimen: "پروتکل ترکیبی: پدهای آناتومیک CarboxyPad + سرم پپتیدی هیلین (Healene)",
    statImprovement: "+۶۲٪",
    statMetric: "افزایش استحکام کشسانی پوست پلک و رفع سایه‌های تیره احتقانی",
    scientificNotes:
      "اتساع مویرگ‌های موضعی و خروج ادم لنفاوی همراه با نئوکلاژنز عمقی، قوام پوستی کانتور چشم را بدون تروما، اسکار یا زمان نقاهت ترمیم نمود.",
    beforeImg: "/assets/drdermer/trial-blepharo-before.png",
    afterImg: "/assets/drdermer/trial-blepharo-after.png",
    visiaScoreBefore: "Visia Firmness: 38%",
    visiaScoreAfter: "Visia Firmness: 92%",
    protocolSlug: "/carboxypad",
  },
  {
    id: "inflammatory_acne",
    category: "آکنه التهابی و بافت ناهموار",
    title: "پاکسازی کمدون‌های عمقی، کنترل سبوم و رفع قرمزی پس از التهاب (PIE)",
    patientMeta: "بیمار ۲۹ ساله · فنوتیپ فیتزپاتریک III · آکنه ولگاریس و التهاب اریتماتوز",
    indication: "کلونیزاسیون باکتری بی‌هوازی C. acnes و ترشح بیش از حد چربی سباسه",
    regimen: "پروتکل ۴ جلسه‌ای: کربوکسی‌ژل مولتی‌اکتیو + اسکراب دتوکس سیلیکالین (Silicalene)",
    statImprovement: "-۷۱٪",
    statMetric: "کاهش بار میکروبی بی‌هوازی و فروکش کامل کانون‌های التهابی آکنه",
    scientificNotes:
      "اشباع اکسیژن موضعی پدیده بوهر محیط بی‌هوازی مورد نیاز باکتری‌های آکنه را تخریب کرده و تکثیر کراتینوسیت‌های دهانه فولیکول را منظم می‌سازد.",
    beforeImg: "/assets/drdermer/trial-acne-before.png",
    afterImg: "/assets/drdermer/trial-acne-after.png",
    visiaScoreBefore: "Visia Porphyrins: 68%",
    visiaScoreAfter: "Visia Porphyrins: 14%",
    protocolSlug: "/silicalene",
  },
];

export function VisiaTrialComparisonSlider() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = CLINICAL_CASES[activeCaseIndex];

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    }
  };

  return (
    <section className="visia-slider-section" aria-labelledby="visia-title">
      <div className="visia-slider-wrapper">
        {/* Section Header with Clinical Hierarchy */}
        <div className="visia-slider-header">
          <div className="visia-chip-badge">
            <span className="visia-chip-pulse" aria-hidden="true" />
            CLINICAL VISIA® 7TH GEN DERMATOLOGICAL AUDIT
          </div>
          <h2 id="visia-title" className="visia-main-title">
            ارزیابی مقایسه‌ای پیش و پس از درمان با آنالیزور تصویری Visia
          </h2>
          <p className="visia-lead-text">
            اهرم مقایسه را به چپ و راست بکشید تا تغییرات عینی بافت پوست، عمق شیارها و توزیع ملانین را در کیس‌های بالینی واقعی مستندشده در آزمایشگاه‌های درماتولوژی مشاهده فرمایید.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="visia-case-tabs" role="tablist" aria-label="انتخاب کیس بالینی">
          {CLINICAL_CASES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activeCaseIndex === i}
              className={`visia-case-tab-btn ${activeCaseIndex === i ? "active" : ""}`}
              onClick={() => {
                setActiveCaseIndex(i);
                setSliderPos(50);
              }}
            >
              <span>{c.category}</span>
            </button>
          ))}
        </div>

        {/* Comparison Stage + Clinical Metadata Panel */}
        <div className="visia-interactive-container">
          {/* Right Column in RTL: Clinical Case Details Side Panel */}
          <div className="visia-case-details-panel">
            <div className="vcd-badge-strip">
              <span className="vcd-pill dark">کیس بالینی مستندشده</span>
              <span className="vcd-pill teal">{currentCase.category}</span>
            </div>

            <h3 className="vcd-title">{currentCase.title}</h3>
            <p className="vcd-patient-meta">{currentCase.patientMeta}</p>

            {/* Primary Stat Card */}
            <div className="vcd-stat-card">
              <div className="vcd-stat-info">
                <span className="vcd-stat-label">بهبود سنجیده‌شده با Visia:</span>
                <span className="vcd-stat-val">{currentCase.statImprovement}</span>
              </div>
              <div className="vcd-stat-icon-wrap" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>

            <p className="vcd-desc">{currentCase.statMetric}</p>

            <div className="vcd-protocol-box">
              <strong className="protocol-title">پروتکل درمانی اعمال‌شده:</strong>
              <span className="protocol-content">{currentCase.regimen}</span>
            </div>

            <div className="vcd-notes-box">
              <strong className="notes-heading">ملاحظه پاتوفیزیولوژی:</strong>
              <p className="notes-body">{currentCase.scientificNotes}</p>
            </div>

            <Link href={currentCase.protocolSlug} className="vcd-cta-btn">
              مشاهده محصولات مرتبط با این پروتکل ←
            </Link>
          </div>

          {/* Left Column in RTL: Interactive Comparison Slider Stage (Strict LTR Coordinate Isolation) */}
          <div className="visia-stage-outer">
            <div
              className="visia-compare-stage"
              ref={containerRef}
              dir="ltr"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ touchAction: "none" }}
            >
              {/* Layer 1: AFTER image (full-size background) */}
              <div className="visia-image-layer visia-after-layer">
                <img
                  src={currentCase.afterImg}
                  alt={`نتیجه پس از درمان - ${currentCase.title}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Layer 2: BEFORE image (clipped with clip-path strictly matching sliderPos) */}
              <div
                className="visia-image-layer visia-before-layer"
                style={{
                  clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={currentCase.beforeImg}
                  alt={`قبل از درمان - ${currentCase.title}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Persistent Header Tags Outside Clipping Boundary */}
              <div className="visia-label-tag before">
                <span>قبل از درمان (Baseline Day 0)</span>
              </div>
              <div className="visia-label-tag after">
                <span>پس از درمان ({currentCase.visiaScoreAfter})</span>
              </div>

              {/* Draggable Divider Handle Line */}
              <div
                className="visia-divider-handle"
                style={{
                  left: `${sliderPos}%`,
                }}
              >
                <div
                  className="visia-handle-knob"
                  role="slider"
                  aria-label="اهرم کششی مقایسه تصاویر قبل و بعد"
                  aria-valuenow={Math.round(sliderPos)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") setSliderPos((p) => Math.max(0, p - 5));
                    if (e.key === "ArrowRight") setSliderPos((p) => Math.min(100, p + 5));
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="7 8 3 12 7 16" />
                    <polyline points="17 8 21 12 17 16" />
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stage Footer Bar with Clinical Telemetry Info */}
            <div className="visia-stage-caption">
              <span className="caption-text">
                تصویربرداری اپیدرمال با نور پلاریزه متقاطع (Cross-Polarized Light) جهت حذف بازتاب سطحی
              </span>
              <span className="caption-standard">ISO 13485 CERTIFIED CLINICAL AUDIT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
