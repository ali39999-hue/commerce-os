"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, ChevronLeft, ChevronRight, Activity, Sparkles, RefreshCw } from "lucide-react";
import "./visia-comparison-slider.css";

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
  beforeFilter?: string;
  afterImg: string;
  afterFilter?: string;
  visiaScoreBefore: string;
  visiaScoreAfter: string;
  metricName: string;
  metricValBefore: number;
  metricValAfter: number;
  unit: string;
}

const CLINICAL_CASES: ClinicalCase[] = [
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
    beforeImg: "/assets/rupak/visia/visia-melasma-before.jpg",
    afterImg: "/assets/rupak/visia/visia-melasma-after.jpg",
    visiaScoreBefore: "۴۱٪",
    visiaScoreAfter: "۸۹٪",
    metricName: "تراکم پیگمان و ملانین",
    metricValBefore: 89,
    metricValAfter: 41,
    unit: "٪",
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
    beforeImg: "/assets/rupak/visia/visia-wrinkles-before.jpg",
    afterImg: "/assets/rupak/visia/visia-wrinkles-before.jpg",
    afterFilter: "rejuvenated",
    visiaScoreBefore: "۵۲٪",
    visiaScoreAfter: "۹۴٪",
    metricName: "عمق شیارهای بیانی",
    metricValBefore: 78,
    metricValAfter: 36,
    unit: "µm",
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
    beforeImg: "/assets/rupak/visia/visia-melasma-before.jpg",
    beforeFilter: "erythema-active",
    afterImg: "/assets/rupak/visia/visia-melasma-after.jpg",
    visiaScoreBefore: "۳۶٪",
    visiaScoreAfter: "۹۱٪",
    metricName: "اریتم و قرمزی موضعی",
    metricValBefore: 84,
    metricValAfter: 23,
    unit: "٪",
  },
];

export function VisiaTrialComparisonSlider() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoPlayPhase = useRef(0);

  const currentCase = CLINICAL_CASES[activeCaseIndex];

  // Universal position updater
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Math.round(pos * 10) / 10);
  }, []);

  // Pointer Event Handlers with full pointer capture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    setIsAutoPlaying(false);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setIsAutoPlaying(false);
      setSliderPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setIsAutoPlaying(false);
      setSliderPos((p) => Math.min(100, p + 5));
    }
  };

  // Auto-play demo mode (gentle sinusoidal glide)
  useEffect(() => {
    if (!isAutoPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = () => {
      autoPlayPhase.current += 0.02;
      // Oscillate smoothly between 20% and 80%
      const newPos = 50 + 30 * Math.sin(autoPlayPhase.current);
      setSliderPos(Math.round(newPos * 10) / 10);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoPlaying]);

  // Interpolated real-time telemetry metrics
  const progressRatio = sliderPos / 100;
  const currentMetricVal = Math.round(
    currentCase.metricValBefore + (currentCase.metricValAfter - currentCase.metricValBefore) * progressRatio
  );
  const currentScoreVal = Math.round(
    parseInt(currentCase.visiaScoreBefore) +
      (parseInt(currentCase.visiaScoreAfter) - parseInt(currentCase.visiaScoreBefore)) * progressRatio
  );

  return (
    <section className="visia-slider-section" id="visia-audit" aria-labelledby="visia-title">
      <div className="visia-slider-wrapper">
        {/* Section Header */}
        <div className="visia-slider-header">
          <div className="visia-chip-badge">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            <span>CLINICAL VISIA® 3D DERMATOLOGICAL AUDIT</span>
          </div>
          <h2 id="visia-title" className="visia-main-title">
            ارزیابی مقایسه‌ای پیش و پس از درمان با آنالیزور تصویری Visia
          </h2>
          <p className="visia-lead-text">
            اسلایدر تعاملی را به چپ و راست بکشید یا دکمه حرکت خودکار را لمس کنید تا تغییرات واقعی بافت پوست و رفع ملاسما را در کیس‌های بالینی مستند مرکز تحقیقات مشاهده نمایید.
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
                setIsAutoPlaying(false);
              }}
            >
              <span>{c.category}</span>
            </button>
          ))}
        </div>

        {/* Comparison Stage + Clinical Metadata Panel */}
        <div className="visia-interactive-container">
          {/* Left Column: Interactive Comparison Stage + Controls */}
          <div className="visia-stage-column">
            {/* The Before/After Image Comparison Box */}
            <div
              className="visia-compare-stage"
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-label="اسلایدر مقایسه تصاویر قبل و بعد درمان"
            >
              {/* Layer 1: AFTER TREATMENT (Base Layer - Left side) */}
              <div className="visia-layer after">
                <img
                  src={currentCase.afterImg}
                  alt={`نتیجه پس از درمان - ${currentCase.title}`}
                  className={`visia-img ${currentCase.afterFilter || ""}`}
                  loading="eager"
                />
                <div className="visia-tag-badge after">
                  <span className="visia-tag-dot" aria-hidden="true"></span>
                  <span>پس از مداخله بالینی (Visia Score: {currentCase.visiaScoreAfter})</span>
                </div>
              </div>

              {/* Layer 2: BEFORE TREATMENT (Top Layer - Right side, clipped precisely) */}
              <div
                className="visia-layer before"
                style={{
                  clipPath: `inset(0 0 0 ${sliderPos}%)`,
                  WebkitClipPath: `inset(0 0 0 ${sliderPos}%)`,
                }}
              >
                <img
                  src={currentCase.beforeImg}
                  alt={`قبل از درمان - ${currentCase.title}`}
                  className={`visia-img ${currentCase.beforeFilter || ""}`}
                  loading="eager"
                />
                <div className="visia-tag-badge before">
                  <span className="visia-tag-dot red" aria-hidden="true"></span>
                  <span>قبل از درمان (Baseline Day 0)</span>
                </div>
              </div>

              {/* Draggable Divider Line & Knob */}
              <div
                className="visia-divider"
                style={{
                  left: `${sliderPos}%`,
                }}
              >
                <div
                  className="visia-knob"
                  role="slider"
                  aria-label="اهرم کششی مقایسه تصاویر قبل و بعد"
                  aria-valuenow={Math.round(sliderPos)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <ChevronRight className="w-4 h-4" />
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Interactive Controls Bar Below Stage */}
            <div className="visia-controls-bar">
              {/* Dynamic Live HUD */}
              <div className="visia-live-hud">
                <div className="visia-hud-item">
                  <span>امتیاز تحلیلی Visia:</span>
                  <span className="visia-hud-val">{currentScoreVal}٪</span>
                </div>

                <div className="visia-hud-item">
                  <span>{currentCase.metricName}:</span>
                  <span className="visia-hud-val">
                    {currentMetricVal} {currentCase.unit}
                  </span>
                </div>

                <div className="visia-hud-pos">
                  <span>
                    {sliderPos < 20
                      ? "نمای پایه (قبل درمان)"
                      : sliderPos > 80
                      ? "نتیجه قطعی (پس از درمان)"
                      : `مقایسه ۵۰/۵۰ (موقعیت: ${Math.round(sliderPos)}٪)`}
                  </span>
                </div>
              </div>

              {/* Range input for quick manual drag */}
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={sliderPos}
                onChange={(e) => {
                  setIsAutoPlaying(false);
                  setSliderPos(parseFloat(e.target.value));
                }}
                className="visia-range-slider"
                aria-label="نوار لغزنده مقایسه قبل و بعد"
              />

              {/* Quick Jump Presets & Auto-Play Toggle */}
              <div className="visia-presets-row">
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className={`visia-preset-btn ${sliderPos === 0 ? "active" : ""}`}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSliderPos(0);
                    }}
                  >
                    قبل از درمان (۰٪)
                  </button>

                  <button
                    type="button"
                    className={`visia-preset-btn ${sliderPos === 50 ? "active" : ""}`}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSliderPos(50);
                    }}
                  >
                    مقایسه متقارن (۵۰٪)
                  </button>

                  <button
                    type="button"
                    className={`visia-preset-btn ${sliderPos === 100 ? "active" : ""}`}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSliderPos(100);
                    }}
                  >
                    پس از درمان (۱۰۰٪)
                  </button>
                </div>

                <button
                  type="button"
                  className={`visia-autoplay-btn ${isAutoPlaying ? "playing" : ""}`}
                  onClick={() => setIsAutoPlaying((v) => !v)}
                  title={isAutoPlaying ? "توقف انیمیشن خودکار" : "پخش خودکار مقایسه"}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>توقف انیمیشن</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>حرکت خودکار</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clinical Case Details Side Panel */}
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
              <Sparkles className="w-8 h-8 text-teal-700" aria-hidden="true" />
            </div>

            <p className="vcd-desc">{currentCase.statMetric}</p>

            <div className="vcd-protocol-box">
              <strong>پروتکل درمانی اعمال‌شده:</strong>
              <span>{currentCase.regimen}</span>
            </div>

            <p className="vcd-notes">
              <strong>ملاحظه پاتوفیزیولوژی:</strong> {currentCase.scientificNotes}
            </p>

            <Link href="/#rupak-catalog" className="vcd-cta-btn">
              مشاهده محصولات مرتبط با این پروتکل ←
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
