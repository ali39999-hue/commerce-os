'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  miniGameLabel: string;
  miniGameSub: string;
  badgeId: string;
  badgeTitle: string;
  badgeIcon: string;
}

const PROTOCOL_STEPS: ProtocolStepInfo[] = [
  {
    number: 1,
    title: 'پاکسازی عمقی و چربی‌زدایی پوست',
    durationSeconds: 120, // 2 mins
    phaseLabel: 'آماده‌سازی لایه شاخی و حذف سبوم',
    actionGuidance:
      'صورت را با شوینده بدون صابون بشویید و با پد تمیز کاملاً خشک کنید. هیچ‌گونه لایه چربی، لوسیون یا رطوبت سطحی نباید باقی بماند تا ماتریکس ژل مستقیم به اپیدرم متصل شود.',
    sensationGuide: 'حس خشکی و پاکیزگی بدون کشیدگی.',
    chemicalReaction: 'حذف سبوم اکسیدشده و تنظیم pH سطحی پوست در محدوده ۵.۵.',
    proTip: 'در صورت استفاده بیمار از رتینول یا لایه‌بردار اسیدی، ۲۴ ساعت فاصله درمان الزامی است.',
    miniGameLabel: 'شبیه‌سازی پاکسازی اپیدرم',
    miniGameSub: 'کلیک کنید تا سبوم و آلودگی‌های سطحی حذف شوند',
    badgeId: 'clean_prep',
    badgeTitle: 'پاکسازی بی‌نقص',
    badgeIcon: '🛡️',
  },
  {
    number: 2,
    title: 'توزیع یکنواخت ژل CarboxyGel بر صورت و گردن',
    durationSeconds: 90, // 1.5 mins
    phaseLabel: 'توزیع ماتریکس بی‌کربنات سدیم',
    actionGuidance:
      'تمام محتویات سرنگ استریل (۲۵ میلی‌لیتر) را به صورت لایه‌ای ضخیم و یکدست (حداقل ۱ تا ۲ میلی‌متر) بر تمام نقاط صورت بمالید. ناحیه دور لب و اطراف پلک را خالی بگذارید.',
    sensationGuide: 'حس خنکی، سبکی و چسبندگی ملایم ژل شفاف.',
    chemicalReaction: 'پخش همگن یون‌های بی‌کربنات سدیم بر سطح پوست آماده واکنش با اسید سیتریک.',
    proTip: 'صرفه‌جویی در مصرف ژل اشتباه است؛ ضخامت کم باعث تبخیر سریع و کاهش غلظت گاز تولیدی می‌شود.',
    miniGameLabel: 'تزریق و پخش ماتریکس ۲ میلی‌متری',
    miniGameSub: 'کلیک کنید تا لایه ژل به ضخامت استاندارد ۲ میلی‌متر برسد',
    badgeId: 'gel_matrix',
    badgeTitle: 'ماتریکس همگن',
    badgeIcon: '🧪',
  },
  {
    number: 3,
    title: 'اعمال پد CarboxyPod/CarboxyPad و القای اثر بوهر',
    durationSeconds: 1200, // 20 mins
    phaseLabel: 'تولید انفجاری CO2 و آزادسازی اکسیژن O2 بافتی',
    actionGuidance:
      'پد مخصوص را از ساشه خارج کرده و فوراً روی ژل فیکس کنید. با کف دست و نوک انگشتان به صورت دوره‌ای ضربات ملایم وارد کنید تا الیاف پد با ژل فعال شوند.',
    sensationGuide:
      'شنیدن صدای جوشش حباب‌ها (جلزولز)، احساس گرمای مطبوع و سوزش ملایم در ۵ دقیقه اول که کاملاً طبیعی و نشانه ورود اکسیژن است.',
    chemicalReaction:
      'واکنش اسید-باز: C6H8O7 + 3NaHCO3 → Na3C6H5O7 + 3H2O + 3CO2↑. شیفت فوری منحنی تفکیک اکسی‌هموگلوبین و تخلیه اکسیژن بافتی.',
    proTip:
      'هر ۳ دقیقه یک‌بار پد را با کف دست مجدداً به آرامی فشار دهید تا لایه‌های زیرین گاز CO2 به عمق منافذ هدایت شوند.',
    warning: 'قرمزی گذرا و گرگرفتگی به دلیل وازودیلاتاسیون عروقی رخ داده و ظرف ۲۰ دقیقه پس از شستشو برطرف می‌گردد.',
    miniGameLabel: '💥 تپ روی پد برای فعال‌سازی حباب‌ها (Tap to Effervesce)',
    miniGameSub: 'روی پد ضربه بزنید تا غلظت گاز CO2 به ۱۲۰۰ ppm برسد',
    badgeId: 'bohr_legend',
    badgeTitle: 'قهرمان اثر بوهر',
    badgeIcon: '⚡',
  },
  {
    number: 4,
    title: 'برداشتن پد و آبکشی با آب ولرم',
    durationSeconds: 120, // 2 mins
    phaseLabel: 'تثبیت و پاکسازی باقیمانده ماتریکس',
    actionGuidance:
      'پد را از پایین چانه به آرامی بردارید. باقیمانده ماتریکس ژل را با دستمال حوله‌ای نرم یا اسفنج اسکین‌کر آغشته به آب ولرم پاک کرده و سپس آبکشی نمایید.',
    sensationGuide: 'پوست برافروخته، شاداب و بسیار نرم با حس طراوت عمیق.',
    chemicalReaction: 'بازگشت pH اپیدرم به تعادل طبیعی و تثبیت ریزجریان خون لنفاوی.',
    proTip: 'از آب داغ برای شستشو استفاده نکنید تا عروق متسع شده دچار شوک حرارتی نشوند.',
    miniGameLabel: 'شستشو با آب ولرم و تعادل pH',
    miniGameSub: 'کلیک کنید تا pH اپیدرم روی ۵.۵ متعادل شود',
    badgeId: 'ph_balance',
    badgeTitle: 'تعادل فیزیولوژیک',
    badgeIcon: '🌊',
  },
  {
    number: 5,
    title: 'تسکین با ژل Healene و تقویت سد دفاعی',
    durationSeconds: 60, // 1 min
    phaseLabel: 'ریکاوری و نفوذ حداکثری اکتیوها به درم',
    actionGuidance:
      'بلافاصله یک پمپ از ژل التیام‌بخش هیلین (حاوی پانتنول، نیاسینامید و سنتلا) را روی صورت ماساژ دهید تا خنکی و ترمیم آغاز شود. در طول روز حتماً از ضدآفتاب SPF 50+ استفاده فرمایید.',
    sensationGuide: 'حس خنکی ابریشمی، رفع آنی گرگرفتگی و نرمی مخملی بدون چربی.',
    chemicalReaction: 'بهره‌گیری از پیک نفوذپذیری ۶۵٪ پوست جهت انتقال نیاسینامید و پانتنول به درم.',
    proTip: 'ژل هیلین را می‌توانید پیش از پروتکل برای ۱۰ دقیقه در یخچال قرار دهید تا خنک‌کنندگی مضاعف داشته باشد.',
    miniGameLabel: 'ماساژ ژل Healene و قفل سد دفاعی',
    miniGameSub: 'کلیک کنید تا درخشش و سد دفاعی پوست ۱۰۰٪ تکمیل شود',
    badgeId: 'certified_aesthetician',
    badgeTitle: 'اسکین‌تراپیست ارشد',
    badgeIcon: '👑',
  },
];

interface FloatingBubble {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
}

export function ProtocolTimerSimulation() {
  const [activeStepIndex, setActiveStepIndex] = useState(2); // Default to Step 3 (The main treatment)
  const [timeLeft, setTimeLeft] = useState(PROTOCOL_STEPS[2].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 5 | 10>(1);

  // Gamification States
  const [xp, setXp] = useState(200);
  const [skinGlow, setSkinGlow] = useState(45);
  const [o2Sat, setO2Sat] = useState(65);
  const [co2Ppm, setCo2Ppm] = useState(600);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['clean_prep', 'gel_matrix']);
  const [stepActionsDone, setStepActionsDone] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [step3Taps, setStep3Taps] = useState(5);
  const [floatingBubbles, setFloatingBubbles] = useState<FloatingBubble[]>([]);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nextBubbleId = useRef(1);

  const currentStep = PROTOCOL_STEPS[activeStepIndex];

  // Synthesize sound effects using Web Audio API safely
  const playSoundEffect = useCallback((type: 'pop' | 'chime' | 'fanfare') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.25, now + i * 0.09);
          gain.gain.linearRampToValueAtTime(0.01, now + i * 0.09 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.28);
        });
      }
    } catch {
      // AudioContext not supported or restricted; silently ignore
    }
  }, []);

  // Compute Aesthetician Rank based on XP
  let rankTitle = '🎓 کارآموز کلینیکال (Trainee)';
  let rankClass = 'rank-trainee';
  if (xp >= 500) {
    rankTitle = '👑 استاد اثر بوهر و اکسیژن‌تراپی (Master Aesthetician)';
    rankClass = 'rank-master';
  } else if (xp >= 350) {
    rankTitle = '🧪 متخصص بیوشیمی اپیدرم (Epidermal Specialist)';
    rankClass = 'rank-specialist';
  } else if (xp >= 200) {
    rankTitle = '💆‍♀️ اسکین‌تراپیست مجاز (Certified Therapist)';
    rankClass = 'rank-therapist';
  }

  // Timer Tick Loop with speedMultiplier
  useEffect(() => {
    if (isRunning) {
      const intervalMs = Math.max(50, Math.floor(1000 / speedMultiplier));
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleStepFinished(activeStepIndex);
            return 0;
          }
          return prev - 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speedMultiplier, activeStepIndex]);

  // When step reaches 0 seconds
  const handleStepFinished = (stepIdx: number) => {
    playSoundEffect('chime');
    setCompletedSteps((prev) => Array.from(new Set([...prev, stepIdx])));
    const currentBadge = PROTOCOL_STEPS[stepIdx].badgeId;
    setUnlockedBadges((prev) => Array.from(new Set([...prev, currentBadge])));

    // Increase XP and Glow
    setXp((prev) => Math.min(500, prev + 60));
    setSkinGlow((prev) => Math.min(100, prev + 15));
    setO2Sat((prev) => Math.min(99, prev + 8));

    // Check if whole protocol finished
    if (stepIdx === 4 || completedSteps.length >= 4) {
      playSoundEffect('fanfare');
      setIsVictoryModalOpen(true);
    }
  };

  // Switch step
  const selectStep = (index: number) => {
    setIsRunning(false);
    setActiveStepIndex(index);
    setTimeLeft(PROTOCOL_STEPS[index].durationSeconds);
  };

  // Interactive Mini-Action Handler
  const handleMiniAction = () => {
    playSoundEffect('pop');
    setStepActionsDone((prev) => ({ ...prev, [activeStepIndex]: true }));

    if (activeStepIndex === 0) {
      // Step 1: Cleansing
      setXp((prev) => Math.min(500, prev + 50));
      setSkinGlow((prev) => Math.min(100, Math.max(prev, 35)));
      setUnlockedBadges((prev) => Array.from(new Set([...prev, 'clean_prep'])));
      spawnBubble('+۵۰ XP', '#10b981');
    } else if (activeStepIndex === 1) {
      // Step 2: Gel application
      setXp((prev) => Math.min(500, prev + 50));
      setSkinGlow((prev) => Math.min(100, Math.max(prev, 55)));
      setUnlockedBadges((prev) => Array.from(new Set([...prev, 'gel_matrix'])));
      spawnBubble('ماتریکس ۲mm ✓', '#06b6d4');
    } else if (activeStepIndex === 2) {
      // Step 3: Tap to Effervesce
      setStep3Taps((prev) => prev + 1);
      setCo2Ppm((prev) => Math.min(1200, prev + 75));
      setO2Sat((prev) => Math.min(99, prev + 4));
      setSkinGlow((prev) => Math.min(95, prev + 5));
      setXp((prev) => Math.min(500, prev + 25));

      const bubbleTexts = ['CO₂ 🫧', 'O₂ ↑', '+۲۵ XP', 'اثر بوهر ⚡', 'نفوذ درم 🧬'];
      const randomText = bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)];
      const randomColor = Math.random() > 0.5 ? '#0d9488' : '#3b82f6';
      spawnBubble(randomText, randomColor);

      if (co2Ppm >= 1100) {
        setUnlockedBadges((prev) => Array.from(new Set([...prev, 'bohr_legend'])));
      }
    } else if (activeStepIndex === 3) {
      // Step 4: Rinse
      setXp((prev) => Math.min(500, prev + 50));
      setSkinGlow((prev) => Math.min(100, Math.max(prev, 85)));
      setUnlockedBadges((prev) => Array.from(new Set([...prev, 'ph_balance'])));
      spawnBubble('pH ۵.۵ متوازن ✓', '#6366f1');
    } else if (activeStepIndex === 4) {
      // Step 5: Healene & Lock
      setXp(500);
      setSkinGlow(100);
      setO2Sat(99);
      setCompletedSteps([0, 1, 2, 3, 4]);
      setUnlockedBadges(['clean_prep', 'gel_matrix', 'bohr_legend', 'ph_balance', 'certified_aesthetician']);
      spawnBubble('۱۰۰٪ درخشش 👑', '#f59e0b');
      playSoundEffect('fanfare');
      setIsVictoryModalOpen(true);
    }
  };

  // Helper to spawn floating bubbles
  const spawnBubble = (label: string, color: string) => {
    const id = nextBubbleId.current++;
    const x = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    const y = Math.floor(Math.random() * 40) + 30; // 30% to 70%
    setFloatingBubbles((prev) => [...prev.slice(-6), { id, label, x, y, color }]);
    setTimeout(() => {
      setFloatingBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 1500);
  };

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((currentStep.durationSeconds - timeLeft) / currentStep.durationSeconds) * 100
  );

  // Copy coupon handler
  const handleCopyCoupon = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('BOHR-MASTER-10');
      setCopiedCoupon(true);
      playSoundEffect('chime');
      setTimeout(() => setCopiedCoupon(false), 3000);
    }
  };

  // Reset entire challenge
  const handleResetAll = () => {
    setIsRunning(false);
    setActiveStepIndex(0);
    setTimeLeft(PROTOCOL_STEPS[0].durationSeconds);
    setXp(50);
    setSkinGlow(25);
    setO2Sat(50);
    setCo2Ppm(0);
    setStep3Taps(0);
    setCompletedSteps([]);
    setUnlockedBadges([]);
    setStepActionsDone({});
    setIsVictoryModalOpen(false);
  };

  // Bohr status string
  let bohrPhase = 'آماده آغاز واکنش CO2';
  let bohrBadgeClass = 'idle';
  if (activeStepIndex === 2) {
    if (co2Ppm < 400) {
      bohrPhase = 'مرحله ۱: آزادسازی اولیه میکروحباب‌های گاز CO2 و نفوذ به ماتریکس';
      bohrBadgeClass = 'effervescent';
    } else if (co2Ppm < 900) {
      bohrPhase = 'مرحله ۲: اوج اثر بوهر (Bohr Peak) - تخلیه اکسیژن هموگلوبین به بافت';
      bohrBadgeClass = 'peak-bohr';
    } else {
      bohrPhase = 'مرحله ۳: اشباع حداکثری اکسیژن سلولی (۱۲۰۰ ppm) و نوسازی میتوکندری';
      bohrBadgeClass = 'synthesis';
    }
  }

  return (
    <div className="protocol-gamified-root" aria-label="شبیه‌ساز گیمیفیکیشن و دستیار پروتکل بالینی">
      {/* 1. Gamification HUD Header */}
      <div className="gamified-hud-card">
        <div className="gamified-hud-top">
          <div className="hud-player-profile">
            <span className="hud-avatar-icon">🩺</span>
            <div className="hud-player-text">
              <div className="hud-player-rank-row">
                <span className="hud-rank-tag">{rankTitle}</span>
                <span className="hud-xp-badge">⚡ {xp} / ۵۰۰ XP</span>
              </div>
              <div className="hud-xp-track" title={`پیشرفت امتیاز مهارت: ${xp} از ۵۰۰`}>
                <div className="hud-xp-fill" style={{ width: `${(xp / 500) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Simulation Speed Control */}
          <div className="hud-speed-control">
            <span className="hud-speed-label">سرعت شبیه‌ساز:</span>
            <div className="speed-pills-row" role="group" aria-label="انتخاب سرعت شبیه‌ساز">
              {([1, 5, 10] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSpeedMultiplier(spd)}
                  className={`speed-pill-btn ${speedMultiplier === spd ? 'active' : ''}`}
                  title={`سرعت ${spd} برابر`}
                >
                  {spd === 1 ? '۱x (عادی)' : spd === 5 ? '۵x (سریع)' : '۱۰x (توربو)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Physiological Telemetry Gauges */}
        <div className="hud-telemetry-gauges-row">
          {/* Skin Glow Meter */}
          <div className="hud-gauge-card glow-card">
            <div className="gauge-header">
              <span className="gauge-icon">✨</span>
              <span className="gauge-title">شاخص درخشش پوست (Skin Glow)</span>
              <strong className="gauge-val glow-val">{skinGlow}٪</strong>
            </div>
            <div className="gauge-track">
              <div className="gauge-fill glow-fill" style={{ width: `${skinGlow}%` }} />
            </div>
          </div>

          {/* Cellular Oxygen Saturation Meter */}
          <div className="hud-gauge-card o2-card">
            <div className="gauge-header">
              <span className="gauge-icon">🫀</span>
              <span className="gauge-title">اشباع اکسیژن سلولی (O₂ Sat)</span>
              <strong className="gauge-val o2-val">{o2Sat}٪</strong>
            </div>
            <div className="gauge-track">
              <div className="gauge-fill o2-fill" style={{ width: `${o2Sat}%` }} />
            </div>
          </div>

          {/* Active CO2 PPM Gauge */}
          <div className="hud-gauge-card co2-card">
            <div className="gauge-header">
              <span className="gauge-icon">🫧</span>
              <span className="gauge-title">غلظت CO₂ فعال بالینی</span>
              <strong className="gauge-val co2-val">{co2Ppm} ppm</strong>
            </div>
            <div className="gauge-track">
              <div className="gauge-fill co2-fill" style={{ width: `${Math.min(100, (co2Ppm / 1200) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Step Selector Wizard Tabs */}
      <div className="protocol-steps-wizard" role="tablist" aria-label="مراحل گیمیفیکیشن پروتکل کربوکسی‌تراپی">
        {PROTOCOL_STEPS.map((st, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isDone = completedSteps.includes(idx);
          return (
            <button
              key={st.number}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => selectStep(idx)}
              className={`protocol-wizard-btn ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}`}
            >
              <div className="wizard-step-indicator">
                <span className="step-circle-badge">
                  {isDone ? '✓' : st.number}
                </span>
                <span className="step-time-tag">{Math.ceil(st.durationSeconds / 60)} دقیقه</span>
              </div>
              <span className="wizard-step-name">{st.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Stage Box */}
      <div className="protocol-active-stage-card">
        <div className="protocol-stage-grid">
          {/* Left Column: Live Digital Timer & Reaction Controls */}
          <div className="protocol-timer-column">
            <div className={`protocol-timer-display ${isRunning ? 'is-ticking' : ''}`}>
              <div
                className="timer-radial-progress"
                style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
              >
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
                onClick={() => setIsRunning(!isRunning)}
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
                <div className="protocol-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="protocol-progress-meta">
                <span>پیشرفت: {progressPercent}٪</span>
                <span>کل زمان: {Math.ceil(currentStep.durationSeconds / 60)} دقیقه</span>
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
                disabled={activeStepIndex === PROTOCOL_STEPS.length - 1}
                onClick={() => selectStep(activeStepIndex + 1)}
                className="protocol-nav-next"
              >
                گام بعدی →
              </button>
            </div>
          </div>

          {/* Right Column: Gamified Mini-Game, Clinical Guidance & Biochemical Status */}
          <div className="protocol-details-column">
            <div className="protocol-step-header-tag">
              <span className="step-tag-pill">گام {currentStep.number} از ۵</span>
              <h4 className="protocol-step-title">{currentStep.title}</h4>
            </div>

            {/* INTERACTIVE MINI-GAME ACTION BOX */}
            <div className="gamified-action-box">
              <div className="gamified-action-head">
                <span className="action-game-tag">🎮 مأموریت تعاملی این گام</span>
                <span className="action-xp-gain">+۵۰ تا +۱۰۰ XP</span>
              </div>
              <div className="gamified-action-body">
                <div className="gamified-action-info">
                  <h5 className="gamified-action-title">{currentStep.miniGameLabel}</h5>
                  <p className="gamified-action-sub">{currentStep.miniGameSub}</p>
                </div>

                <div className="gamified-btn-relative-container">
                  <button
                    type="button"
                    onClick={handleMiniAction}
                    className={`gamified-interactive-btn ${activeStepIndex === 2 ? 'is-bohr-clicker' : ''}`}
                  >
                    {activeStepIndex === 2 ? (
                      <>
                        <span className="clicker-bubble-icon">💥</span>
                        <span>فشار روی پد ({step3Taps} ضربه)</span>
                      </>
                    ) : (
                      <>
                        <span>{stepActionsDone[activeStepIndex] ? '✓ انجام شد (کلیک مجدد)' : 'اجرای شبیه‌سازی'}</span>
                        <span className="btn-sparkle">✨</span>
                      </>
                    )}
                  </button>

                  {/* Floating Bubbles Canvas */}
                  {floatingBubbles.map((fb) => (
                    <div
                      key={fb.id}
                      className="floating-bubble-particle"
                      style={{
                        left: `${fb.x}%`,
                        top: `${fb.y}%`,
                        backgroundColor: fb.color,
                      }}
                    >
                      {fb.label}
                    </div>
                  ))}
                </div>
              </div>
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
                  <span className="bubble-caption">
                    غلظت گاز به {co2Ppm} ppm رسید — تفکیک اکسی‌هموگلوبین فعال است
                  </span>
                </div>
              </div>
            )}

            {/* Action Instruction */}
            <div className="protocol-info-card action">
              <div className="info-card-header">
                <span className="card-icon" aria-hidden="true">📋</span>
                <h5>دستورالعمل بالینی و شیوه اجرا</h5>
              </div>
              <p>{currentStep.actionGuidance}</p>
            </div>

            {/* Sensory Experience */}
            <div className="protocol-info-card sensation">
              <div className="info-card-header">
                <span className="card-icon" aria-hidden="true">✨</span>
                <h5>حس مراجع در این مرحله (Sensory Experience)</h5>
              </div>
              <p>{currentStep.sensationGuide}</p>
            </div>

            {/* Biochemical Reaction */}
            <div className="protocol-info-card chemistry">
              <div className="info-card-header">
                <span className="card-icon" aria-hidden="true">🧪</span>
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

      {/* 4. Achievement Badges Ribbon */}
      <div className="protocol-badges-ribbon-card">
        <div className="badges-ribbon-head">
          <span className="badges-title">🏅 مدال‌ها و دستاوردهای بالینی آنلاک‌شده</span>
          <span className="badges-count">{unlockedBadges.length} از ۵ مدال</span>
        </div>
        <div className="badges-grid-strip">
          {PROTOCOL_STEPS.map((step) => {
            const isUnlocked = unlockedBadges.includes(step.badgeId);
            return (
              <div
                key={step.badgeId}
                className={`badge-item-pill ${isUnlocked ? 'unlocked' : 'locked'}`}
                title={isUnlocked ? `مدال ${step.badgeTitle} آزاد شد!` : `برای باز شدن، گام ${step.number} را کامل کنید`}
              >
                <span className="badge-icon">{isUnlocked ? step.badgeIcon : '🔒'}</span>
                <div className="badge-meta">
                  <strong className="badge-name">{step.badgeTitle}</strong>
                  <span className="badge-status-txt">{isUnlocked ? 'کسب شد (+100 XP)' : `گام ${step.number}`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. VICTORY CELEBRATION MODAL */}
      {isVictoryModalOpen && (
        <div className="victory-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="victory-title">
          <div className="victory-modal-content">
            <div className="victory-confetti-top">🎊 🏆 🎊</div>
            <h3 id="victory-title" className="victory-main-title">
              تبریک! شما به مقام «استاد اثر بوهر» نائل شدید!
            </h3>
            <p className="victory-sub-desc">
              تمام مراحل بیوشیمیایی و بالینی CarboxyGel را با موفقیت شبیه‌سازی کردید. نفوذ اکسیژن سلولی و بازسازی بافتی در بالاترین استاندارد فیزیولوژیک ثبت شد.
            </p>

            {/* Summary Metrics Grid */}
            <div className="victory-stats-grid">
              <div className="victory-stat-box">
                <span className="v-stat-num">۵۰۰ / ۵۰۰</span>
                <span className="v-stat-lbl">امتیاز تجربه (XP)</span>
              </div>
              <div className="victory-stat-box">
                <span className="v-stat-num">۹۹٪</span>
                <span className="v-stat-lbl">شادابی و درخشش پوست</span>
              </div>
              <div className="victory-stat-box">
                <span className="v-stat-num">۱۲۰۰ ppm</span>
                <span className="v-stat-lbl">غلظت درمانی گاز CO₂</span>
              </div>
              <div className="victory-stat-box">
                <span className="v-stat-num">+۸۸٪</span>
                <span className="v-stat-lbl">تزریق اکسیژن سلولی O₂</span>
              </div>
            </div>

            {/* Exclusive Reward Coupon Box */}
            <div className="victory-coupon-card">
              <div className="coupon-card-header">
                <span className="coupon-star">🎁</span>
                <strong>کد تخفیف اختصاصی فارغ‌التحصیلی بالینی</strong>
              </div>
              <p className="coupon-card-desc">
                ۱۰٪ تخفیف ویژه خرید کیت تخصصی CarboxyGel برای سفارش بعدی شما:
              </p>
              <div className="coupon-action-row">
                <div className="coupon-code-chip" dir="ltr">BOHR-MASTER-10</div>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="coupon-copy-btn"
                >
                  {copiedCoupon ? 'کپی شد! ✓' : '📋 کپی کد تخفیف'}
                </button>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="victory-modal-actions">
              <button
                type="button"
                onClick={() => setIsVictoryModalOpen(false)}
                className="victory-close-btn"
              >
                مشاهده و ادامه در صفحه محصول
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="victory-replay-btn"
              >
                ↺ شروع مجدد چالش گیمیفیکیشن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
