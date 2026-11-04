"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "./cart";

interface DiagnosticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepOption {
  id: string;
  title: string;
  desc: string;
  iconSvg: React.ReactNode;
}

export function SkinDiagnosticDrawer({ isOpen, onClose }: DiagnosticDrawerProps) {
  const { addItem, openDrawer: openCartDrawer } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [skinType, setSkinType] = useState<string>("");
  const [concern, setConcern] = useState<string>("");
  const [treatmentLevel, setTreatmentLevel] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!isOpen) return null;

  // Step 1: Skin Phenotype & Barrier State
  const skinTypes: StepOption[] = [
    {
      id: "sensitive_barrier",
      title: "حساس، کم‌آب و سد دفاعی آسیب‌دیده",
      desc: "احساس سوزش، کشیدگی، قرمزی مداوم و نفوذپذیری به عوامل محیطی",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "oily_acneic",
      title: "چرب، مختلط و مستعد آکنه و کومدون",
      desc: "ترشح بیش‌ازحد سبوم، منافذ اتساع‌یافته، جوش‌های التهابی و لک جای جوش (PIH)",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
    },
    {
      id: "pigmented_dull",
      title: "کدر، دارای لک ملاسما و پیگمانتاسیون",
      desc: "عدم یکنواختی تن رنگ، لکه‌های ناشی از آفتاب، تغییرات هورمونی و اکسیداسیون سلولی",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ),
    },
    {
      id: "mature_laxity",
      title: "بالغ، خطوط ریز، افتادگی و کاهش الاستیسیته",
      desc: "تخریب شبکه کلاژن درمیس، خطوط پنجه‌کلاغی، افتادگی کانتور صورت و کاهش اکسیژن بافتی",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  // Step 2: Primary Clinical Objective
  const concerns: StepOption[] = [
    {
      id: "oxygenation_glow",
      title: "اکسیژن‌رسانی عمیق، درخشش و تحریک متابولیسم سلولی",
      desc: "فعال‌سازی اثر بوهر برای رهاسازی اکسیژن درون‌سلولی و افزایش فوری شادابی",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      id: "blemish_clarity",
      title: "رفع لک، ملاسما و یکدست‌سازی رنگ چهره",
      desc: "مهار مسیرهای تیروزیناز و تحریک لایه‌برداری ملایم ترابافتی بدون تحریک التهابی",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: "firming_collagen",
      title: "کلاژن‌سازی نوع ۱ و ۳ و پر کردن شیارهای عمیق",
      desc: "تحریک فیبروبلاست‌ها و نئواسکولاریزاسیون جهت سفت‌شدن پوست و لیفت نامرئی",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      id: "post_procedure_repair",
      title: "ترمیم فوق‌سریع پس از لیزر، پیلینگ یا میکرونیدلینگ",
      desc: "کاهش TEWL و بازسازی لیپیدهای لایه شاخی با اثر التیام‌بخش فوری",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  // Step 3: Intensity & Environment
  const levels: StepOption[] = [
    {
      id: "home_routine",
      title: "پروتکل خانگی منظم (ReeSkin Clinical Kit)",
      desc: "استفاده هفتگی با اپلیکاتورهای استاندارد خانگی و پادهای فعال‌ساز",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
    },
    {
      id: "intensive_weekly",
      title: "دوره درمانی فشرده (Intensive 4-Week Program)",
      desc: "دو بار در هفته همراه با سرم‌های بیومیمتیک پپتیدی و ماسک‌های بسته‌بندی عایق",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: "clinical_in_office",
      title: "پروتکل کلینیکال و ارجاع به پزشک (ReeMed Clinic Suite)",
      desc: "درمان ترکیبی با دستگاه‌های مطبی CarboX و پلاسما سرد، نیازمند اپراتور مجرب",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsCompleted(true);
    }, 1100);
  };

  const resetDiagnostic = () => {
    setCurrentStep(1);
    setSkinType("");
    setConcern("");
    setTreatmentLevel("");
    setIsAnalyzing(false);
    setIsCompleted(false);
    setAddedToCart(false);
  };

  // Prescription matching logic
  const getPrescription = () => {
    if (concern === "blemish_clarity" || skinType === "pigmented_dull") {
      return {
        gelName: "کربوکسی‌ژل اسید آزالائیک (Azelaic Acid CarboxyGel)",
        gelSub: "ReeSkin™ Targeted Depigmenting Formula · pH 4.0",
        podName: "پاد ترابافتی CarboxyPod Hydra-Pod",
        actives: ["اسید آزالائیک میکرونیزه ۱۵٪", "نیاسینامید ۴٪", "ترانگزامیک اسید ۲٪", "آلفا آربوتین"],
        frequency: "هفته‌ای ۱ الی ۲ بار بعد از شستشوی ملایم",
        bohrSurge: "+۳۱۰٪ رهاسازی اکسیژن بافتی",
        expectedWeeks: "۴ هفته تا کاهش قابل لمس شاخص ملانین (-۴۸٪ Visia)",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel-207x300.png",
        variantId: "azelaic-gel-1",
        price: 2450000,
        sku: "RS-AZL-CG",
      };
    }
    if (concern === "firming_collagen" || skinType === "mature_laxity") {
      return {
        gelName: "کربوکسی‌ژل اسید گلیکولیک بازسازی‌کننده (Glycolic CarboxyGel)",
        gelSub: "ReeSkin™ Epidermal Resurfacing & Neocollagenesis · pH 3.5",
        podName: "پاد ترابافتی CarboxyPod Carbo-Pod Carbon Core",
        actives: ["اسید گلیکولیک بافرشده ۱۰٪", "پپتید ماتریکسیل ۳۰۰۰", "اسید هیالورونیک اولترا-لو", "سرامید NP"],
        frequency: "هر ۵ الی ۷ روز یک جلسه (ترجیحاً عصرها)",
        bohrSurge: "+۳۴۰٪ اشباع اکسیژن مویرگی",
        expectedWeeks: "۳ هفته تا بازگشت قوام درم (-۴۲٪ عمق شیارها)",
        image: "/assets/drdermer/2025/07/glycolic-acid-carboxygel-207x300.png",
        variantId: "glycolic-gel-1",
        price: 2680000,
        sku: "RS-GLY-CG",
      };
    }
    // Default / Sensitive / Multi-Active
    return {
      gelName: "کربوکسی‌ژل مولتی‌اکتیو و ترمیم سد دفاعی (Multi-Active CarboxyGel)",
      gelSub: "ReeSkin™ Biomimetic Peptides & Barrier Complex · pH 3.8",
      podName: "پاد ترابافتی CarboxyPod Vita-Pod Multi-Vitamin",
      actives: ["فاکتور رشد بیومیمتیک EGF", "پپتیدهای مس (GHK-Cu)", "اکتوئین ۲٪", "پانتنول B5 و عصاره جو دوسر"],
      frequency: "هفته‌ای ۱ بار (بسیار ایمن حتی برای پوست‌های ملتهب و روزاسه)",
      bohrSurge: "+۲۸۰٪ افزایش پرفیوژن خونی",
      expectedWeeks: "۲ هفته تا التیام کامل سد دفاعی و کاهش اریتم (-۶۱٪)",
      image: "/assets/drdermer/2025/07/multi-active-carboxygel-207x300.png",
      variantId: "multi-gel-1",
      price: 2550000,
      sku: "RS-MLT-CG",
    };
  };

  const rx = getPrescription();

  const handleAddToCart = () => {
    addItem({
      variantId: rx.variantId,
      productId: "rx-" + rx.variantId,
      title: rx.gelName,
      sku: rx.sku,
      priceAmount: (BigInt(rx.price) * 10n).toString(),
      image: rx.image,
    }, 1);
    setAddedToCart(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="diagnostic-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="diag-title">
      <div className="diagnostic-drawer-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="diagnostic-drawer-header">
          <div className="diag-header-info">
            <span className="diag-badge-pill">
              <span className="diag-pulse-dot"></span>
              DR. DERMER INTELLIGENT CLINICAL TRIAGE
            </span>
            <h2 id="diag-title" className="diag-modal-title">
              مشاوره آنلاین هوشمند پوست و پروتکل اختصاصی
            </h2>
          </div>
          <button type="button" className="diag-close-btn" onClick={onClose} aria-label="بستن پنجره مشاوره">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="diagnostic-drawer-body">
          {!isCompleted && !isAnalyzing && (
            <>
              {/* Stepper Progress */}
              <div className="diag-progress-bar-wrap">
                <div className="diag-steps-indicator">
                  <div className={`diag-step-dot ${currentStep >= 1 ? "active" : ""}`}>
                    <span>۱</span>
                    <label>فنوتیپ پوست</label>
                  </div>
                  <div className={`diag-step-line ${currentStep >= 2 ? "active" : ""}`}></div>
                  <div className={`diag-step-dot ${currentStep >= 2 ? "active" : ""}`}>
                    <span>۲</span>
                    <label>هدف بالینی</label>
                  </div>
                  <div className={`diag-step-line ${currentStep >= 3 ? "active" : ""}`}></div>
                  <div className={`diag-step-dot ${currentStep >= 3 ? "active" : ""}`}>
                    <span>۳</span>
                    <label>سطح درمان</label>
                  </div>
                </div>
              </div>

              {/* Step 1: Skin Type */}
              {currentStep === 1 && (
                <div className="diag-step-container">
                  <h3 className="diag-step-question">
                    گام اول: وضعیت فعلی و ویژگی غالب پوست شما چیست؟
                  </h3>
                  <p className="diag-step-hint">
                    سیستم تشخیصی دکتر درمر بر اساس فیزیولوژی لایه شاخی و افت pH هموگلوبین طراحی شده است.
                  </p>
                  <div className="diag-options-grid">
                    {skinTypes.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        className={`diag-option-card ${skinType === st.id ? "selected" : ""}`}
                        onClick={() => setSkinType(st.id)}
                      >
                        <div className="diag-opt-icon">{st.iconSvg}</div>
                        <div className="diag-opt-text">
                          <strong>{st.title}</strong>
                          <p>{st.desc}</p>
                        </div>
                        <div className="diag-check-indicator">
                          {skinType === st.id && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Target Concern */}
              {currentStep === 2 && (
                <div className="diag-step-container">
                  <h3 className="diag-step-question">
                    گام دوم: اولویت اصلی درمانی که می‌خواهید طی ۴ هفته بهبود یابد چیست؟
                  </h3>
                  <p className="diag-step-hint">
                    مکانیسم اثر بوهر متناسب با غلظت و اسیدیته CarboxyGel برای هر دغدغه کالیبره می‌شود.
                  </p>
                  <div className="diag-options-grid">
                    {concerns.map((cn) => (
                      <button
                        key={cn.id}
                        type="button"
                        className={`diag-option-card ${concern === cn.id ? "selected" : ""}`}
                        onClick={() => setConcern(cn.id)}
                      >
                        <div className="diag-opt-icon">{cn.iconSvg}</div>
                        <div className="diag-opt-text">
                          <strong>{cn.title}</strong>
                          <p>{cn.desc}</p>
                        </div>
                        <div className="diag-check-indicator">
                          {concern === cn.id && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Intensity & Setting */}
              {currentStep === 3 && (
                <div className="diag-step-container">
                  <h3 className="diag-step-question">
                    گام سوم: چه ساختار درمانی و زمانی برای شما مناسب‌تر است؟
                  </h3>
                  <p className="diag-step-hint">
                    محصولات خانگی ReeSkin و ملزومات کلینیکال ReeMed هر دو بر پایه فناوری ثبت‌شده CarboxyPod می‌باشند.
                  </p>
                  <div className="diag-options-grid">
                    {levels.map((lv) => (
                      <button
                        key={lv.id}
                        type="button"
                        className={`diag-option-card ${treatmentLevel === lv.id ? "selected" : ""}`}
                        onClick={() => setTreatmentLevel(lv.id)}
                      >
                        <div className="diag-opt-icon">{lv.iconSvg}</div>
                        <div className="diag-opt-text">
                          <strong>{lv.title}</strong>
                          <p>{lv.desc}</p>
                        </div>
                        <div className="diag-check-indicator">
                          {treatmentLevel === lv.id && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <div className="diag-analyzing-box">
              <div className="diag-spinner-orbit">
                <div className="diag-orbit-circle"></div>
                <div className="diag-orbit-core">CO₂</div>
              </div>
              <h3 className="diag-analyzing-title">در حال سنتز اطلاعات بالینی و شبیه‌سازی اثر بوهر...</h3>
              <p className="diag-analyzing-sub">
                تطبیق بیومواد مؤثره، اسیدیته بهینه، فرمولاسیون CarboxyGel و پاد فعال‌ساز متناسب با پرونده شما
              </p>
              <div className="diag-analyzing-pills">
                <span className="an-pill">Hemoglobin Hb-O2 Curve Calibrating</span>
                <span className="an-pill">Peptide Permeability Mapping</span>
                <span className="an-pill">Barrier Lipid Integrity Match</span>
              </div>
            </div>
          )}

          {/* Result / Prescription Card */}
          {isCompleted && (
            <div className="diag-prescription-wrapper">
              <div className="prescription-badge-verified">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                نسخه و پروتکل بالینی تأییدشده بر پایه بیوشیمی سلولی
              </div>

              <div className="prescription-card">
                <div className="rx-card-top">
                  <div className="rx-img-col">
                    <img src={rx.image} alt={rx.gelName} className="rx-product-thumb" />
                  </div>
                  <div className="rx-details-col">
                    <span className="rx-brand-tag">CLINICAL REGIMEN RECOMMENDATION</span>
                    <h3 className="rx-prod-name">{rx.gelName}</h3>
                    <p className="rx-prod-sub">{rx.gelSub}</p>

                    <div className="rx-pair-pod">
                      <span className="pod-pair-label">پاد فعال‌ساز همگام:</span>
                      <strong>{rx.podName}</strong>
                    </div>

                    <div className="rx-metrics-strip">
                      <div className="rx-metric-cell">
                        <span className="rm-val">{rx.bohrSurge}</span>
                        <span className="rm-lbl">اکسیژناسیون بافتی</span>
                      </div>
                      <div className="rx-metric-cell">
                        <span className="rm-val">{rx.frequency}</span>
                        <span className="rm-lbl">تواتر مصرف</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rx-card-actives">
                  <strong>مواد مؤثره هدفمند (Key Active Molecules):</strong>
                  <div className="rx-active-chips">
                    {rx.actives.map((act) => (
                      <span key={act} className="rx-chip">{act}</span>
                    ))}
                  </div>
                </div>

                <div className="rx-timeline-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>
                    <strong>پیش‌بینی دوره پاسخ‌دهی بالینی:</strong> {rx.expectedWeeks}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="diag-rx-actions">
                <button
                  type="button"
                  className={`diag-add-cart-btn ${addedToCart ? "success" : ""}`}
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      افزوده شد! در حال انتقال به سبد نسخه...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      افزودن پروتکل کامل به سبد نسخه ({rx.price.toLocaleString("fa-IR")} تومان)
                    </>
                  )}
                </button>

                <div className="diag-secondary-actions">
                  <a href="tel:02188880000" className="diag-call-doc-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>تماس فوری با مشاور پوست Dr. Dermer</span>
                  </a>
                  <button type="button" className="diag-reset-btn" onClick={resetDiagnostic}>
                    شروع مجدد ارزیابی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation (when not completed) */}
        {!isCompleted && !isAnalyzing && (
          <div className="diagnostic-drawer-footer">
            <button
              type="button"
              className="diag-nav-prev"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            >
              مرحله قبل
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                className="diag-nav-next"
                disabled={(currentStep === 1 && !skinType) || (currentStep === 2 && !concern)}
                onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
              >
                مرحله بعد ←
              </button>
            ) : (
              <button
                type="button"
                className="diag-nav-finish"
                disabled={!treatmentLevel}
                onClick={handleRunAnalysis}
              >
                تحلیل و استخراج پروتکل بالینی
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
