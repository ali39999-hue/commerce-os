"use client";

import React, { useState, useRef, useCallback } from "react";
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
}

export function VisiaTrialComparisonSlider() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cases: ClinicalCase[] = [
    {
      id: "melasma_hyperpigmentation",
      category: "ملاسما و هایپرپیگمانتاسیون",
      title: "درمان لک‌های هورمونی مقاوم و تیرگی یکنواخت پیشانی و گونه",
      patientMeta: "بیمار ۳۸ ساله · فنوتیپ پوستی فیتزپاتریک III · ملاسما اپیدرمال-درمال",
      indication: "مقاوم به هیدروکینون و لایه‌برداری‌های اسیدی سنتی",
      regimen: "پروتکل ۴ هفته‌ای: کربوکسی‌ژل اسید آزالائیک ۱۵٪ + پاد ترابافتی Hydra-Pod (هفته‌ای ۲ بار)",
      statImprovement: "-۴۸٪",
      statMetric: "کاهش تراکم ملانین در ارزیابی طیف‌سنجی Visia (Grade A+)",
      scientificNotes:
        "افزایش نفوذپذیری فعال آزالائیک با اثر بوهر موجب مهار رقابتی آنزیم تیروزیناز در ملانوسیت‌ها بدون ایجاد هیپوپیگمانتاسیون راجعه گردید.",
      beforeImg: "/assets/drdermer/2025/07/skin-copy-2_0001_Frame-18-600x600.png",
      afterImg: "/assets/drdermer/2025/07/skin-copy-2_0002_Frame-17-600x600.png",
      visiaScoreBefore: "Visia Score: 41%",
      visiaScoreAfter: "Visia Score: 89%",
    },
    {
      id: "rhytids_collagen_loss",
      category: "شیارهای پنجه‌کلاغی و افت قوام",
      title: "نوسازی بافت الاستین و تحریک کلاژن‌سازی نوع ۱ درمیس میانی",
      patientMeta: "بیمار ۴۶ ساله · فنوتیپ فیتزپاتریک II · خطوط پنجه‌کلاغی و منافذ اتساع‌یافته",
      indication: "کاهش ضخامت درمیس و تحلیل ماتریکس برون‌سلولی بر اثر استرس اکسیداتیو",
      regimen: "پروتکل ۳ جلسه‌ای: کربوکسی‌ژل اسید گلیکولیک ۱۰٪ + پاد ترابافتی Carbo-Pod",
      statImprovement: "-۴۲٪",
      statMetric: "کاهش عمق شیارهای پری‌اوربیتال و افزایش ۳۸٪ تراکم کلاژن در اولتراسوند",
      scientificNotes:
        "سیلاب اکسیژن بافتی و اتساع موضعی میکرووسکولار، سنتز فاکتور TGF-β را تحریک نموده و قوام ماتریکس درمیس را به شکل چشمگیری ترمیم کرد.",
      beforeImg: "/assets/drdermer/2025/07/skin-copy-2_0006_Frame-13-600x600.png",
      afterImg: "/assets/drdermer/2025/07/skin-copy-2_0007_Frame-12-600x600.png",
      visiaScoreBefore: "Visia Score: 52%",
      visiaScoreAfter: "Visia Score: 94%",
    },
    {
      id: "rosacea_erythema",
      category: "روزاسه، اریتم و تخریب سد دفاعی",
      title: "التیام فوری عروق مویرگی سطحی و بازسازی ساختار لایه شاخی",
      patientMeta: "بیمار ۳۱ ساله · فنوتیپ فیتزپاتریک I · اریتماتوتلانژکتازیک (Subtype 1 Rosacea)",
      indication: "حساسیت بالا، گرگرفتگی، سوزش با محصولات آرایشی و افزایش شاخص TEWL",
      regimen: "پروتکل ۲ هفته‌ای: کربوکسی‌ژل مولتی‌اکتیو + پاد ترابافتی Vita-Pod (هفته‌ای یک جلسه)",
      statImprovement: "-۶۱٪",
      statMetric: "کاهش نقشه اریتم هموگلوبین (Redness Index) در تصویربرداری Visia",
      scientificNotes:
        "ترکیب پپتیدهای مس و اکتوئین ۲٪ به همراه پایداری pH اسیدی لایه شاخی، ریزگردش خون مویرگی را تعدیل و نفوذپذیری عروق التهابی را مهار ساخت.",
      beforeImg: "/assets/drdermer/2025/07/skin-copy-2_0011_Frame-8-1-600x600.png",
      afterImg: "/assets/drdermer/2025/07/skin-copy-2_0013_Frame-6-600x600.png",
      visiaScoreBefore: "Visia Score: 36%",
      visiaScoreAfter: "Visia Score: 91%",
    },
  ];

  const currentCase = cases[activeCaseIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const startDrag = () => {
    isDragging.current = true;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  return (
    <section className="visia-slider-section" aria-labelledby="visia-title">
      <div className="visia-slider-wrapper">
        {/* Section Header */}
        <div className="visia-slider-header">
          <div className="visia-chip-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            CLINICAL VISIA® 3D DERMATOLOGICAL AUDIT
          </div>
          <h2 id="visia-title" className="visia-main-title">
            ارزیابی مقایسه‌ای پیش و پس از درمان با آنالیزور تصویری Visia
          </h2>
          <p className="visia-lead-text">
            اسلایدر تعاملی را به چپ و راست بکشید تا تغییرات عینی بافت پوست، عمق خطوط و توزیع ملانین را در کیس‌های بالینی مستندشده مرکز تحقیقات درماتولوژی مشاهده نمایید.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="visia-case-tabs" role="tablist">
          {cases.map((c, i) => (
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
          {/* Comparison Slider Box */}
          <div
            className="visia-compare-stage"
            ref={containerRef}
            onMouseDown={startDrag}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchStart={startDrag}
            onTouchEnd={stopDrag}
            onClick={(e) => handleMove(e.clientX)}
          >
            {/* Background Layer: AFTER treatment */}
            <div className="visia-image-layer visia-before-layer">
              <img src={currentCase.afterImg} alt={`نتیجه پس از درمان - ${currentCase.title}`} />
              <div className="visia-label-tag after">
                <span>پس از مداخله بالینی ({currentCase.visiaScoreAfter})</span>
              </div>
            </div>

            {/* Foreground Clipped Layer: BEFORE treatment */}
            <div
              className="visia-after-layer"
              style={{
                width: `${sliderPos}%`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                  height: "100%",
                }}
              >
                <img src={currentCase.beforeImg} alt={`قبل از درمان - ${currentCase.title}`} />
              </div>
              <div className="visia-label-tag before">
                <span>قبل از درمان (Baseline Day 0)</span>
              </div>
            </div>

            {/* Draggable Divider Handle */}
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
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                  <polyline points="9 18 3 12 9 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clinical Case Details Side Panel */}
          <div className="visia-case-details-panel">
            <div className="vcd-badge-strip">
              <span className="vcd-pill dark">کیس بالینی تاییدشده</span>
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
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <p className="vcd-desc">{currentCase.statMetric}</p>

            <div className="vcd-protocol-box">
              <strong>پروتکل درمانی اعمال‌شده:</strong>
              <span>{currentCase.regimen}</span>
            </div>

            <p className="vcd-notes" style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
              <strong>ملاحظه پاتوفیزیولوژی:</strong> {currentCase.scientificNotes}
            </p>

            <Link href="/#featured-products" className="bsf-cta-btn" style={{ textAlign: "center", marginTop: 4 }}>
              مشاهده محصولات مرتبط با این پروتکل ←
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
