'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface ProtocolStepInfo {
  number: number;
  title: string;
  durationSeconds: number;
  phaseLabel: string;
  actionGuidance: string;
  sensationGuide: string;
  chemicalReaction: string;
  proTip: string;
  warning?: string;
}

const DEFAULT_PROTOCOL_STEPS: ProtocolStepInfo[] = [
  {
    number: 1,
    title: 'پاکسازی عمقی و چربی‌زدایی پوست',
    durationSeconds: 120, // 2 mins
    phaseLabel: 'آماده‌سازی لایه شاخی',
    actionGuidance:
      'صورت را با شوینده بدون صابون بشویید و با پد تمیز کاملاً خشک کنید. هیچ‌گونه لایه چربی، لوسیون یا رطوبت سطحی نباید باقی بماند تا ماتریکس ژل مستقیم به اپیدرم متصل شود.',
    sensationGuide: 'حس خشکی و پاکیزگی بدون کشیدگی.',
    chemicalReaction: 'حذف سبوم اکسیدشده و تنظیم pH سطحی پوست در محدوده ۵.۵.',
    proTip: 'در صورت استفاده بیمار از رتینول یا لایه‌بردار اسیدی، ۲۴ ساعت فاصله درمان الزامی است.',
  },
  {
    number: 2,
    title: 'توزیع یکنواخت ژل CarboxyGel بر صورت و گردن',
    durationSeconds: 90, // 1.5 mins
    phaseLabel: 'توزیع ماتریکس بی‌کربنات',
    actionGuidance:
      'تمام محتویات سرنگ استریل (۲۵ میلی‌لیتر) را به صورت لایه‌ای ضخیم و یکدست (حداقل ۱ تا ۲ میلی‌متر) بر تمام نقاط صورت بمالید. ناحیه دور لب و اطراف پلک را خالی بگذارید.',
    sensationGuide: 'حس خنکی، سبکی و چسبندگی ملایم ژل شفاف.',
    chemicalReaction: 'پخش همگن یون‌های بی‌کربنات سدیم بر سطح پوست آماده واکنش با اسید سیتریک.',
    proTip: 'صرفه‌جویی در مصرف ژل اشتباه است؛ ضخامت کم باعث تبخیر سریع و کاهش غلظت گاز تولیدی می‌شود.',
  },
  {
    number: 3,
    title: 'اعمال پد CarboxyPod/CarboxyPad و القای اثر بوهر',
    durationSeconds: 1200, // 20 mins
    phaseLabel: 'تولید انفجاری CO2 و آزادسازی اکسیژن O2',
    actionGuidance:
      'پد مخصوص را از ساشه خارج کرده و فوراً روی ژل فیکس کنید. با کف دست و نوک انگشتان به صورت دوره‌ای ضربات ملایم وارد کنید تا الیاف پد با ژل فعال شوند.',
    sensationGuide:
      'شنیدن صدای جوشش حباب‌ها (جلزولز)، احساس گرمای مطبوع و سوزش ملایم در ۵ دقیقه اول که کاملاً طبیعی و نشانه ورود اکسیژن است.',
    chemicalReaction:
      'واکنش اسید-باز: C6H8O7 + 3NaHCO3 → Na3C6H5O7 + 3H2O + 3CO2↑. شیفت فوری منحنی تفکیک اکسی‌هموگلوبین و تخلیه اکسیژن بافتی.',
    proTip:
      'هر ۳ دقیقه یک‌بار پد را با کف دست مجدداً به آرامی فشار دهید تا لایه‌های زیرین گاز CO2 به عمق منافذ هدایت شوند.',
    warning: 'قرمزی گذرا و گرگرفتگی به دلیل وازودیلاتاسیون عروقی رخ داده و ظرف ۲۰ دقیقه پس از شستشو برطرف می‌گردد.',
  },
  {
    number: 4,
    title: 'برداشتن پد و آبکشی با آب ولرم',
    durationSeconds: 120, // 2 mins
    phaseLabel: 'تثبیت و پاکسازی باقیمانده',
    actionGuidance:
      'پد را از پایین چانه به آرامی بردارید. باقیمانده ماتریکس ژل را با دستمال حوله‌ای نرم یا اسفنج اسکین‌کر آغشته به آب ولرم پاک کرده و سپس آبکشی نمایید.',
    sensationGuide: 'پوست برافروخته، شاداب و بسیار نرم با حس طراوت عمیق.',
    chemicalReaction: 'بازگشت pH اپیدرم به تعادل طبیعی و تثبیت ریزجریان خون لنفاوی.',
    proTip: 'از آب داغ برای شستشو استفاده نکنید تا عروق متسع شده دچار شوک حرارتی نشوند.',
  },
  {
    number: 5,
    title: 'تسکین با ژل Healene و تقویت سد دفاعی',
    durationSeconds: 60, // 1 min
    phaseLabel: 'ریکاوری و نفوذ حداکثری اکتیوها',
    actionGuidance:
      'بلافاصله یک پمپ از ژل التیام‌بخش هیلین (حاوی پانتنول، نیاسینامید و سنتلا) را روی صورت ماساژ دهید تا خنکی و ترمیم آغاز شود. در طول روز حتماً از ضدآفتاب SPF 50+ استفاده فرمایید.',
    sensationGuide: 'حس خنکی ابریشمی، رفع آنی گرگرفتگی و نرمی مخملی بدون چربی.',
    chemicalReaction: 'بهره‌گیری از پیک نفوذپذیری ۶۵٪ پوست جهت انتقال نیاسینامید و پانتنول به درم.',
    proTip: 'ژل هیلین را می‌توانید پیش از پروتکل برای ۱۰ دقیقه در یخچال قرار دهید تا خنک‌کنندگی مضاعف داشته باشد.',
  },
];

export function ProtocolTimerSimulation() {
  const [activeStepIndex, setActiveStepIndex] = useState(2); // Default to Step 3 (The main treatment)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_PROTOCOL_STEPS[2].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [effervescentActive, setEffervescentActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = DEFAULT_PROTOCOL_STEPS[activeStepIndex];

  // Sync timer when step is switched manually
  const selectStep = (index: number) => {
    setIsRunning(false);
    setActiveStepIndex(index);
    setTimeLeft(DEFAULT_PROTOCOL_STEPS[index].durationSeconds);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((currentStep.durationSeconds - timeLeft) / currentStep.durationSeconds) * 100
  );

  // Compute live Bohr Effect phase (when in Step 3)
  const elapsedMinutes = (currentStep.durationSeconds - timeLeft) / 60;
  let bohrPhase = 'آماده آغاز واکنش CO2';
  let bohrBadgeClass = 'idle';

  if (activeStepIndex === 2) {
    if (elapsedMinutes < 3) {
      bohrPhase = 'مرحله ۱: آزادسازی انفجاری میکروحباب‌های گاز CO2 و واکنش فعال‌ساز';
      bohrBadgeClass = 'effervescent';
    } else if (elapsedMinutes < 10) {
      bohrPhase = 'مرحله ۲: اوج اثر بوهر (Bohr Effect) - ترشح اکسیژن اشباع O2 به بافت';
      bohrBadgeClass = 'peak-bohr';
    } else {
      bohrPhase = 'مرحله ۳: نوسازی میتوکندریال، تحریک کلاژن و جذب پپتیدها';
      bohrBadgeClass = 'synthesis';
    }
  }

  return (
    <div className="protocol-timer-root" aria-label="شبیه‌ساز و تایمر پروتکل بالینی کربوکسی‌تراپی">
      <div className="protocol-timer-header">
        <div className="protocol-pill-badge">شبیه‌ساز تعاملی کلینیکال و دستیار زمان‌بندی درمان</div>
        <h3 className="protocol-main-title">پروتکل گام‌به‌گام کربوکسی‌تراپی و تایمر هوشمند بالینی</h3>
        <p className="protocol-sub-desc">
          این راهنمای تعاملی زمان، مراحل بیوشیمیایی و واکنش‌های فیزیولوژیک حین کار با CarboxyGel و پدهای فعال‌ساز را شبیه‌سازی می‌کند.
        </p>
      </div>

      {/* Step Selector Wizard Tabs */}
      <div className="protocol-steps-wizard" role="tablist" aria-label="مراحل پروتکل کربوکسی‌تراپی">
        {DEFAULT_PROTOCOL_STEPS.map((st, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isPast = idx < activeStepIndex;
          return (
            <button
              key={st.number}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => selectStep(idx)}
              className={`protocol-wizard-btn ${isCurrent ? 'active' : ''} ${isPast ? 'completed' : ''}`}
            >
              <div className="wizard-step-indicator">
                <span className="step-circle-badge">
                  {isPast ? '✓' : st.number}
                </span>
                <span className="step-time-tag">{Math.ceil(st.durationSeconds / 60)} دقیقه</span>
              </div>
              <span className="wizard-step-name">{st.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Box */}
      <div className="protocol-active-stage-card">
        <div className="protocol-stage-grid">
          {/* Left Column: Live Digital Timer & Reaction Controls */}
          <div className="protocol-timer-column">
            <div className={`protocol-timer-display ${isRunning ? 'is-ticking' : ''}`}>
              <div className="timer-radial-progress" style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}>
                <div className="timer-inner-content">
                  <span className="timer-label-eyebrow">
                    {isRunning ? 'تایمر فعال در حال شمارش' : 'آماده اجرا'}
                  </span>
                  <span className="timer-digit-clock" dir="ltr" aria-live="polite">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="timer-phase-subtitle">{currentStep.phaseLabel}</span>
                </div>
              </div>
            </div>

            {/* Timer Actions */}
            <div className="protocol-timer-actions">
              <button
                type="button"
                onClick={() => {
                  setIsRunning(!isRunning);
                  if (activeStepIndex === 2) setEffervescentActive(true);
                }}
                className={`timer-cta-btn ${isRunning ? 'btn-pause' : 'btn-start'}`}
              >
                {isRunning ? '⏸ توقف موقت تایمر' : '▶ شروع تایمر بالینی'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(currentStep.durationSeconds);
                }}
                className="timer-reset-btn"
                title="شروع مجدد این مرحله"
              >
                ↺ ریست
              </button>
            </div>

            {/* Progress Bar */}
            <div className="protocol-progress-bar-wrap" aria-label={`پیشرفت مرحله ${progressPercent} درصد`}>
              <div className="protocol-progress-track">
                <div
                  className="protocol-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="protocol-progress-meta">
                <span>پیشرفت: {progressPercent}٪</span>
                <span>کل زمان مرحله: {Math.ceil(currentStep.durationSeconds / 60)} دقیقه</span>
              </div>
            </div>

            {/* Step navigation arrows */}
            <div className="protocol-nav-buttons-row">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => selectStep(activeStepIndex - 1)}
                className="protocol-nav-prev"
              >
                ← گام قبل
              </button>
              <button
                type="button"
                disabled={activeStepIndex === DEFAULT_PROTOCOL_STEPS.length - 1}
                onClick={() => selectStep(activeStepIndex + 1)}
                className="protocol-nav-next"
              >
                گام بعدی →
              </button>
            </div>
          </div>

          {/* Right Column: Clinical Guidance, Molecular Phase & Sensations */}
          <div className="protocol-details-column">
            <div className="protocol-step-header-tag">
              <span className="step-tag-pill">گام {currentStep.number} از ۵</span>
              <h4 className="protocol-step-title">{currentStep.title}</h4>
            </div>

            {/* Step 3 Special Bohr Effect Status Visualizer */}
            {activeStepIndex === 2 && (
              <div className="bohr-live-status-box">
                <div className="bohr-status-head">
                  <span className={`bohr-pulse-dot ${bohrBadgeClass}`} aria-hidden="true" />
                  <strong>وضعیت زنده اثر بوهر (Bohr Effect Phase):</strong>
                </div>
                <p className="bohr-status-text">{bohrPhase}</p>
                
                {/* Visual Gas Bubbling Simulation Graphic */}
                <div className="co2-bubbling-visual-strip" aria-hidden="true">
                  <div className="bubble b1">CO₂</div>
                  <div className="bubble b2">O₂ ↑</div>
                  <div className="bubble b3">CO₂</div>
                  <div className="bubble b4">O₂ ↑</div>
                  <div className="bubble b5">CO₂</div>
                  <span className="bubble-caption">شبیه‌سازی آزادسازی گاز دی‌اکسید کربن و ورود اکسیژن هموگلوبین به سلول</span>
                </div>
              </div>
            )}

            {/* Action Instruction */}
            <div className="protocol-info-card action">
              <div className="info-card-header">
                <span className="card-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </span>
                <h5>دستورالعمل بالینی و شیوه اجرا</h5>
              </div>
              <p>{currentStep.actionGuidance}</p>
            </div>

            {/* Sensory Experience (What client feels) */}
            <div className="protocol-info-card sensation">
              <div className="info-card-header">
                <span className="card-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </span>
                <h5>حس مراجع در این مرحله (Sensory Experience)</h5>
              </div>
              <p>{currentStep.sensationGuide}</p>
            </div>

            {/* Biochemical Reaction */}
            <div className="protocol-info-card chemistry">
              <div className="info-card-header">
                <span className="card-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.31L4.62 17.5A2 2 0 0 0 6.31 20h11.38a2 2 0 0 0 1.69-2.5L14 9.31V2" />
                  </svg>
                </span>
                <h5>رویداد بیوشیمیایی و سلولی</h5>
              </div>
              <p>{currentStep.chemicalReaction}</p>
            </div>

            {/* Pro Tip & Warnings */}
            <div className="protocol-tip-card">
              <span className="tip-badge">نکته حرفه‌ای اسکین‌تراپیست:</span>
              <p>{currentStep.proTip}</p>
              {currentStep.warning && (
                <div className="step-warning-note">
                  <span aria-hidden="true">⚠️ </span>
                  <strong>توجه:</strong> {currentStep.warning}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
