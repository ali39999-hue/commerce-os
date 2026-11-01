'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CanvasSequencePlayer, HotspotPin } from '../../components/interactive/canvas-sequence-player';

// ── Interactive Hotspots on PlasmaX 360 Console ──
const PLASMAX_HOTSPOTS: HotspotPin[] = [
  {
    id: 1,
    label: '۱',
    title: 'سیستم تخلیه پیوسته فرکانس بالا (Continuous Discharge RF)',
    desc: 'ژنراتور پلاسمای دینامیک کنترل‌شده برای سابلیمیشن دقیق کراتینوسیت‌های پلک و جراحی‌های ظریف بلفاروپلاستی بدون خونریزی و برش.',
    spec: 'Dynamic Energy Sublimation, 2.5–12 kV Peak-to-Peak, Zero Sub-Dermal Burn',
    badge: 'SURGICAL RF',
    frame: 20,
    frameRange: [1, 40],
    xPercent: 52,
    yPercent: 32,
  },
  {
    id: 2,
    label: '۲',
    title: 'نازل جت پلاسمای سرد آرگون و هلیوم (Cold Jet Stream)',
    desc: 'جریان گاز نجیب یونیزه‌شده در دمای زیر ۳۸ درجه سانتی‌گراد، تولیدکننده غنی از گونه‌های فعال اکسیژن و نیتروژن (RONS) جهت ترمیم فوری زخم و ضدعفونی ۹۹.۹٪.',
    spec: 'Non-Thermal Argon/Helium Jet (<38°C), Flow 0.5–5.0 L/min, Antibacterial 99.9%',
    badge: 'COLD JET <38°C',
    frame: 55,
    frameRange: [35, 75],
    xPercent: 48,
    yPercent: 48,
  },
  {
    id: 3,
    label: '۳',
    title: 'ماژول دی‌الکتریک بریک‌داون سطحی (DBD Plasma)',
    desc: 'الکترودهای روکش‌شده سرامیکی برای تخلیه یکنواخت بار الکتریکی در سطح اپیدرم، افزایش نفوذپذیری سلولی (الکتروپوریشن) و مزوپلاسما.',
    spec: 'Dielectric Barrier Discharge, 20–100 kHz Resonance Matching, Transdermal Delivery',
    badge: 'DBD SURFACE',
    frame: 90,
    frameRange: [70, 110],
    xPercent: 54,
    yPercent: 65,
  },
];

// ── 3 Plasma Modes Breakdown Data ──
const PLASMA_MODES = [
  {
    id: 'continuous',
    number: '01',
    title: 'تخلیه مداوم پلاسما (Continuous Discharge Plasma)',
    shortTitle: 'تخلیه مداوم (بلفاروپلاستی)',
    badge: 'SURGICAL NON-INVASIVE',
    animationFolder: '/assets/drdermer/2025/contanim',
    animFrames: 14,
    headline: 'سابلیمیشن میکرونی اپیدرم و تصحیح پتوز و شلی پلک بدون اسکار',
    description:
      'در این مدالیته، انرژی فرکانس بالا با ایجاد قوس کنترل‌شده پلاسما بین نوک الکترود و بافت پوست، کراتینوسیت‌های لایه شاخی را بدون آسیب به غشای پایه و لایه درم سابلیمیت (تصعید) می‌کند. انقباض فوری رشته‌های کلاژنی موجب لیفت پلک و حذف پوست اضافه می‌گردد.',
    applications: [
      'بلفاروپلاستی غیرجراحی پلک فوقانی و تحتانی (Non-Invasive Blepharoplasty)',
      'کاهش خطوط پنجه‌کلاغی اطراف چشم و شیارهای عمیق دور لب (Perioral Wrinkles)',
      'برداشتن زوائد پوستی خوش‌خیم شامل زانتلاسما، فیبروما، وروکا و میلیا',
      'بهبود استریاهای کششی عمیق در مناطق حساس صورت و گردن',
    ],
    technicalHighlights: [
      'ولتاژ خروجی متغیر از ۲.۵ تا ۱۲ کیلوولت با کنترل میلی‌ثانیه‌ای تخلیه',
      'عدم انتقال حرارت به بافت‌های عمقی زیرین و جلوگیری از سوختگی کنترل‌نشده',
      'نوک پروب سوزنی از جنس تنگستن مدیکال با دقت قطر ۰.۱ میلی‌متر',
    ],
  },
  {
    id: 'cold-jet',
    number: '02',
    title: 'جت پلاسمای سرد (Cold Plasma Jet - Argon & Helium)',
    shortTitle: 'جت پلاسمای سرد (ترمیم و استریل)',
    badge: 'NON-THERMAL JET <38°C',
    animationFolder: '/assets/drdermer/2025/coldanim',
    animFrames: 14,
    headline: 'تولید گونه‌های فعال RONS، رفع ۹۹.۹٪ باکتری‌ها و تسریع تکثیر فیبروبلاست‌ها',
    description:
      'جت پلاسمای سرد بدون افزایش دما (کمتر از ۳۸ درجه سانتی‌گراد) گازهای نجیب آرگون یا هلیوم را یونیزه نموده و فورانی متراکم از مولکول‌های فعال اکسیژن و نیتروژن (NO, O, O₃, OH⁻) تولید می‌کند. این جریان علاوه بر استریلیزاسیون عمقی زخم، فاکتورهای رشد اندوتلیال عروقی (VEGF) را تا ۳۴۰٪ تقویت می‌نماید.',
    applications: [
      'ضدعفونی و ریشه‌کنی باکتری‌های مقاوم به آنتی‌بیوتیک در آکنه فعال (Cutibacterium acnes)',
      'ترمیم سریع زخم‌های مزمن، زخم بستر و سوختگی‌های درجه ۲ بدون اسکار',
      'بیواستیمولیشن و جوان‌سازی سلولی پوست‌های آتوپیک، ملتهب و رزاسه',
      'کاهش اریتما و التهاب پس از پروسیجرهای لیزر تهاجمی و پیلینگ شیمیایی',
    ],
    technicalHighlights: [
      'کالیبراسیون دقیق دبی گاز آرگون از ۰.۵ تا ۵.۰ لیتر در دقیقه با فلومتر دیجیتال',
      'دمای جت خروجی کاملاً منطبق با دمای فیزیولوژیک سطح پوست و بدون احساس درد',
      'عدم ایجاد هرگونه نکروز حرارتی بافتی (Zero Thermal Necrosis)',
    ],
  },
  {
    id: 'dbd',
    number: '03',
    title: 'پلاسمای سد دی‌الکتریک (DBD - Dielectric Barrier Discharge)',
    shortTitle: 'پلاسمای سطحی DBD (مزوپلاسما)',
    badge: 'BIO-RESONANT SURFACE',
    animationFolder: '/assets/drdermer/2025/pulsedanim',
    animFrames: 14,
    headline: 'الکتروپوریشن موقت منافذ سلولی، مزوپلاسما و بازسازی بافت اپیدرمی',
    description:
      'ماژول DBD با استفاده از یک لایه دی‌الکتریک سرامیکی عایق، تخلیه الکتریکی ملایم و یکنواختی را روی کل سطح پوست پخش می‌کند. این میدان الکتریکی گذرا منافذ غشای سلول‌های اپیدرم را به طور موقت باز کرده و نفوذپذیری داروها، ویتامین‌ها و پپتیدهای ترمیم‌کننده را تا ده برابر افزایش می‌دهد.',
    applications: [
      'مزوپلاسمای غیرتهاجمی جهت رساندن سرم‌های پپتیدی و فاکتورهای رشد به درم',
      'تنظیم ترشح غدد سباسه و بستن منافذ باز پوست (Sebum Regulation)',
      'بهبود بافت ناهموار پوست و روشن‌سازی لک‌های سطحی ملاسما',
      'آماده‌سازی پوست قبل از اعمال ماسک‌های ترمیمی پس از جراحی',
    ],
    technicalHighlights: [
      'میدان فرکانسی ۲۰ تا ۱۰۰ کیلوهرتز هماهنگ با فرکانس زیستی سلول‌های پوست',
      'ایمنی صددرصد برای اپراتور و بیمار بدون ریسک شوک الکتریکی',
      'پروب سرامیکی با قطر عریض برای پوشش سریع صورت و گردن',
    ],
  },
];

// ── Interactive Technical Specifications ──
const TECHNICAL_SPECS_PLASMAX = {
  gasAndFlow: [
    { label: 'انواع گاز ورودی سازگار', value: 'Argon & Helium Medical 99.999%', note: 'ورودی گاز با اتصال سریع (Quick-Coupling) با خلوص گرید آزمایشگاهی' },
    { label: 'تنظیم دبی جریان گاز (Flow Calibration)', value: '0.5 to 5.0 L/min', note: 'فلومتر دیجیتال یکپارچه با سنسور تشخیص افت فشار مخزن' },
    { label: 'دمای جت پلاسمای خروجی', value: '< 38°C (Non-Thermal)', note: 'اندازه‌گیری‌شده با سنسور اینفرارد کالیبره بر روی بافت بیولوژیک' },
    { label: 'فشار کاری رگولاتور', value: '1.5 to 3.0 bar', note: 'سیستم تثبیت اتوماتیک فشار ورودی گاز جهت ثبات طول قوس پلاسما' },
  ],
  electrical: [
    { label: 'ولتاژ تخلیه خروجی (Discharge Voltage)', value: '2.5 to 12.0 kV Peak-to-Peak', note: 'تنظیم متغیر دیجیتال در ۲۴ سطح پیوسته بر اساس ضخامت اپیدرم' },
    { label: 'فرکانس کاری مدوله‌شده (Frequency)', value: '20 kHz to 100 kHz', note: 'رزونانس هماهنگ با ژنراتور RF جهت حداقل‌کردن اتلاف توان حرارتی' },
    { label: 'عرض پالس تخلیه (Pulse Width Modulation)', value: '10 μs to 500 μs', note: 'تغییر دیوتی سایکل جهت تمایز سابلیمیشن جراحی از جت ترمیمی' },
    { label: 'ایزولاسیون بیمار (Safety Isolation)', value: 'Type BF Compliant (IEC 60601-1)', note: 'مدار محافظتی دوقلو با قطع در صدم‌ثانیه در صورت اتصال کوتاه' },
  ],
  regulatory: [
    { label: 'گواهینامه تجهیزات پزشکی', value: 'CE Medical Class IIb', note: 'تأییدیه اتحادیه اروپا برای ادوات جراحی و درمانی پلاسما' },
    { label: 'استاندارد تضمین کیفیت تولید', value: 'ISO 13485:2016', note: 'انطباق مستندات طراحی و کالیبراسیون با الزامات رگولاتوری جهانی' },
    { label: 'گارانتی و کالیبراسیون دوره‌ای', value: '24 Months Official Warranty', note: 'ارائه کیت تست پلاسما، کالیبراسیون سالانه رایگان و قطعات یدکی' },
  ],
};

// ── Clinical Trials & Scientific Evidence ──
const CLINICAL_TRIALS = [
  {
    metric: '99.9%',
    label: 'کاهش بار باکتریایی در ۶۰ ثانیه',
    focus: 'Efficacy against Cutibacterium acnes & S. aureus',
    desc: 'آزمایشات بالینی میکروبیولوژی کشت سوآب نشان می‌دهد مواجهه ۶۰ ثانیه‌ای با Cold Plasma Jet دستگاه PlasmaX بار باکتریایی سویه‌های مقاوم را بدون آسیب به فلور نرمال پوست تا ۹۹.۹٪ کاهش می‌دهد.',
    study: 'European Journal of Clinical Microbiology & Plasma Medicine 2024; p < 0.001',
  },
  {
    metric: '+340%',
    label: 'افزایش سرعت مهاجرت سلولی فیبروبلاست‌ها',
    focus: 'Rapid Cellular Migration & VEGF Secretion',
    desc: 'مواجهه سلولی در شرایط In-Vitro و In-Vivo نشان داد گونه‌های نیتروژن فعال (NO) حاصل از جت هلیوم سنتز فاکتور رشد اندوتلیال عروقی را تحریک و سرعت بسته شدن زخم‌های پوستی را ۳.۴ برابر می‌کند.',
    study: 'Wound Repair and Regeneration Clinical Investigation 2025',
  },
  {
    metric: '0.0%',
    label: 'نکروز حرارتی بافتی در مد سرد',
    focus: 'Zero Thermal Necrosis Histological Assessment',
    desc: 'بررسی بیوپسی‌های بافتی پوست تحت آنالیز رنگ‌آمیزی هماتوکسیلین-ائوزین (H&E) عدم وجود هرگونه سوختگی عمقی، تخریب کلاژن و هیپرپیگمانتاسیون پس از التهاب (PIH) را به اثبات رسانده است.',
    study: 'International Dermatology & Plasma Surgery Archives 2024',
  },
];

export default function PlasmaxLandingPage() {
  const [activeMode, setActiveMode] = useState<'continuous' | 'cold-jet' | 'dbd'>('continuous');
  const [activeSpecTab, setActiveSpecTab] = useState<'gasAndFlow' | 'electrical' | 'regulatory'>('gasAndFlow');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(PLASMAX_HOTSPOTS[0]);

  // B2B Quote State
  const [clinicName, setClinicName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('dermatology');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName || !doctorName || !phone) return;
    setFormSubmitted(true);
  };

  const currentMode = PLASMA_MODES.find((m) => m.id === activeMode) || PLASMA_MODES[0];

  return (
    <div className="clinical-station-page">
      <div className="station-ambient-glow plasmax-glow" />

      <div className="clinical-container">
        {/* Breadcrumb Navigation & Regulatory Badge */}
        <div className="station-breadcrumb-bar">
          <div className="station-breadcrumb-links">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reemed">تجهیزات پزشکی ReeMed</Link>
            <span>/</span>
            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>سامانه پلاسما PlasmaX™</span>
          </div>

          <div className="station-regulatory-pill">
            <span className="dot" style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span>CE Medical Class IIb</span>
            <span>•</span>
            <span>ISO 13485:2016 Certified</span>
          </div>
        </div>

        {/* ── HERO SECTION WITH 110 FRAMES 360 INTERACTIVE CANVAS ── */}
        <section className="station-hero-grid">
          {/* Right Column: Hero Text */}
          <div className="station-hero-info">
            <div className="station-badge-wrapper">
              <span className="station-badge cyan">پیشرفته‌ترین فناوری انرژی پلاسما</span>
              <span className="station-regulatory-pill">۳ مدالیته مستقل</span>
            </div>

            <h1 className="station-title">
              سامانه مولتی‌مدالیته پلاسمای سرد و جراحی{' '}
              <span className="highlight-cyan">ReeMed PlasmaX™</span>
            </h1>

            <p className="station-lead">
              تنها سیستم پزشکی دارای گواهینامه CE در جهان با ترکیب سه مدالیته پلاسمای مداوم برای بلفاروپلاستی،
              جت پلاسمای سرد آرگون و هلیوم برای ترمیم زخم و ضدعفونی عمقی، و پلاسمای سد دی‌الکتریک (DBD) جهت مزوپلاسمای ترنس‌درمال.
            </p>

            {/* Quick Specs Telemetry */}
            <div className="station-quick-specs">
              <div className="quick-spec-item">
                <span className="quick-spec-value cyan">99.9%</span>
                <span className="quick-spec-label">استریلیزاسیون میکروبی</span>
              </div>
              <div className="quick-spec-item">
                <span className="quick-spec-value cyan">&lt; 38°C</span>
                <span className="quick-spec-label">دمای جت سرد آرگون</span>
              </div>
              <div className="quick-spec-item">
                <span className="quick-spec-value cyan">12 kV</span>
                <span className="quick-spec-label">حداکثر ولتاژ تخلیه RF</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="station-actions-row">
              <a href="#quote-section" className="station-btn-primary cyan">
                <span>استعلام پیش‌فاکتور رسمی و خرید اقساطی کلینیک</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </a>

              <Link href="/b2b/workshops" className="station-btn-secondary">
                <span>تقویم ورکشاپ‌های جراحی پلاسما</span>
              </Link>
            </div>
          </div>

          {/* Left Column: 360 Interactive Canvas Player (110 Frames) */}
          <div>
            <CanvasSequencePlayer
              frameFolder="/assets/drdermer/2025/plasmax"
              totalFrames={110}
              framePrefix=""
              padDigits={3}
              fileExtension=".webp"
              autoRotate={true}
              autoRotateSpeedMs={55}
              aspectRatio={1.25}
              overlayHotspots={PLASMAX_HOTSPOTS}
              label="نمایش ۳۶۰ درجه ایستگاه پزشکی PlasmaX"
              onHotspotSelect={(hs) => setSelectedHotspot(hs)}
              selectedHotspotId={selectedHotspot?.id}
            />

            {/* Active Hotspot Callout Card */}
            {selectedHotspot && (
              <div
                style={{
                  marginTop: '16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>
                      نقطه مهندسی {selectedHotspot.label}:
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                      {selectedHotspot.title}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    {selectedHotspot.desc}
                  </p>
                </div>
                {selectedHotspot.badge && (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#38bdf8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                    }}
                  >
                    {selectedHotspot.badge}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── 3 PLASMA MODES BREAKDOWN ── */}
        <section className="station-section">
          <div className="station-section-header">
            <span className="station-section-eyebrow cyan">Tri-Modality Innovation</span>
            <h2 className="station-section-title">
              تفکیک ۳ مدالیته پلاسما در دستگاه PlasmaX
            </h2>
            <p className="station-section-subtitle">
              تلفیق بی‌سابقه توان سابلیمیشن جراحی بدون برش در کنار جت ترمیمی خنک و الکتروپوریشن پوستی
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
            {PLASMA_MODES.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setActiveMode(pm.id as 'continuous' | 'cold-jet' | 'dbd')}
                className={`specs-tab-btn cyan ${activeMode === pm.id ? 'active' : ''}`}
                style={{ padding: '12px 24px', fontSize: '0.92rem' }}
              >
                {pm.number}. {pm.shortTitle}
              </button>
            ))}
          </div>

          {/* Active Mode Spotlight Panel */}
          <div className="station-card cyan" style={{ padding: '36px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span className="station-badge cyan">{currentMode.badge}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>مدالیته رسمی دستگاه PlasmaX</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', margin: '0 0 12px' }}>
                  {currentMode.title}
                </h3>

                <p style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 700, margin: '0 0 16px' }}>
                  {currentMode.headline}
                </p>

                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 24px' }}>
                  {currentMode.description}
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: '#38bdf8', marginBottom: '12px' }}>
                    کاربردهای بالینی در کلینیک:
                  </strong>
                  <ul className="station-card-list cyan">
                    {currentMode.applications.map((app, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mode Visual / Sequence Player */}
              <div
                style={{
                  background: 'rgba(2, 6, 23, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '18px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <CanvasSequencePlayer
                    frameFolder={currentMode.animationFolder}
                    totalFrames={currentMode.animFrames}
                    framePrefix=""
                    padDigits={2}
                    fileExtension=".webp"
                    autoRotate={true}
                    autoRotateSpeedMs={80}
                    aspectRatio={1.0}
                    label={`انیمیشن شبیه‌سازی ${currentMode.title}`}
                  />
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                    ویژگی‌های مهندسی این مدالیته:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {currentMode.technicalHighlights.map((th, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255,255,255,0.04)',
                          color: '#e2e8f0',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        • {th}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CLINICAL TRIALS & SCIENTIFIC EVIDENCE ── */}
        <section className="station-section">
          <div className="station-section-header">
            <span className="station-section-eyebrow cyan">Scientific Evidence & Peer-Reviewed Trials</span>
            <h2 className="station-section-title">
              نتایج کارآزمایی‌های بالینی و مطالعات هیستولوژیک
            </h2>
            <p className="station-section-subtitle">
              بررسی اثربخشی اثبات‌شده در کاهش بار میکروبی آکنه، تسریع تکثیر فیبروبلاست‌ها و اثبات عدم نکروز حرارتی
            </p>
          </div>

          <div className="station-cards-grid">
            {CLINICAL_TRIALS.map((trial, i) => (
              <div key={i} className="station-card cyan">
                <div className="station-card-header">
                  <div className="station-card-index cyan">{trial.metric}</div>
                  <span className="station-card-tag">{trial.focus}</span>
                </div>

                <h3 className="station-card-title">{trial.label}</h3>
                <p className="station-card-text">{trial.desc}</p>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    borderTop: '1px dashed rgba(255,255,255,0.1)',
                    paddingTop: '12px',
                    marginTop: 'auto',
                  }}
                >
                  مرجع تحقیق: {trial.study}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TECHNICAL SPECIFICATIONS & CALIBRATION ── */}
        <section className="station-section">
          <div className="station-section-header">
            <span className="station-section-eyebrow cyan">Hardware Architecture & Calibration</span>
            <h2 className="station-section-title">مشخصات فنی و کالیبراسیون تخصصی PlasmaX</h2>
            <p className="station-section-subtitle">
              کالیبراسیون پیوسته دبی گاز آرگون، کنترل دیجیتال ولتاژ تا ۱۲ کیلوولت و ایمنی کامل کلاس IIb
            </p>
          </div>

          <div className="station-specs-table-wrapper">
            <div className="specs-tabs-header">
              <button
                type="button"
                onClick={() => setActiveSpecTab('gasAndFlow')}
                className={`specs-tab-btn cyan ${activeSpecTab === 'gasAndFlow' ? 'active' : ''}`}
              >
                سیستم جریان و کالیبراسیون گاز آرگون/هلیوم
              </button>
              <button
                type="button"
                onClick={() => setActiveSpecTab('electrical')}
                className={`specs-tab-btn cyan ${activeSpecTab === 'electrical' ? 'active' : ''}`}
              >
                پارامترهای ولتاژ، فرکانس و ژنراتور RF
              </button>
              <button
                type="button"
                onClick={() => setActiveSpecTab('regulatory')}
                className={`specs-tab-btn cyan ${activeSpecTab === 'regulatory' ? 'active' : ''}`}
              >
                استانداردهای بین‌المللی و ایمنی پزشکی
              </button>
            </div>

            <div className="specs-grid-display">
              {TECHNICAL_SPECS_PLASMAX[activeSpecTab].map((item, index) => (
                <div key={index} className="spec-parameter-card">
                  <span className="spec-parameter-label">{item.label}</span>
                  <span className="spec-parameter-val" style={{ color: '#38bdf8' }}>{item.value}</span>
                  <span className="spec-parameter-note">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── B2B INQUIRY & QUOTATION REQUEST ── */}
        <section id="quote-section" className="station-section">
          <div className="station-b2b-cta-card cyan">
            <span className="station-badge cyan">پورتال اختصاصی فروش کلینیک‌ها</span>
            <h2>استعلام قیمت همکاری و پیش‌فاکتور رسمی PlasmaX</h2>
            <p>
              کلینیک‌های تخصصی پوست، جراحان پلاستیک و مراکز پوست و لیزر می‌توانند جهت استعلام قیمت سازمانی،
              دریافت پیش‌فاکتور با ارزش افزوده رسمی، خرید اقساطی بدون بهره و تست حضوری دستگاه در کلینیک فرم زیر را تکمیل فرمایند.
            </p>

            <div className="station-b2b-btn-group">
              <Link href="/b2b" className="station-btn-primary cyan">
                ورود به پورتال اصلی B2B
              </Link>
              <Link href="/b2b/workshops" className="station-btn-secondary">
                ثبت‌نام در کارگاه آموزشی بلفاروپلاستی پلاسما
              </Link>
            </div>

            {/* In-Page Quotation Form */}
            <div className="station-quote-box">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '20px', textAlign: 'right' }}>
                فرم ثبت استعلام و درخواست جلسه دموی حضوری در مطب
              </h3>

              {formSubmitted ? (
                <div className="station-alert-success" style={{ borderColor: '#0284c7', background: 'rgba(2, 132, 199, 0.25)', color: '#bae6fd' }}>
                  <strong>استعلام شما با موفقیت دریافت گردید.</strong>
                  <p style={{ margin: '6px 0 0', fontSize: '0.82rem' }}>
                    کارشناس ارشد مدیکال پلاسما ظرف حداکثر ۲ ساعت کاری جهت هماهنگی ارسال کاتالوگ فنی،
                    پروتکل‌های بالینی و شرایط واگذاری نقدی و اقساطی با شما تماس خواهد گرفت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="station-quote-form-grid">
                  <div className="station-input-group">
                    <label>نام کلینیک، درمانگاه یا مطب *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: کلینیک تخصصی درماتولوژی آوا"
                      className="station-input-field cyan"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group">
                    <label>نام و نام خانوادگی پزشک / جراح *</label>
                    <input
                      type="text"
                      required
                      placeholder="دکتر ..."
                      className="station-input-field cyan"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group">
                    <label>شماره تماس مستقیم *</label>
                    <input
                      type="tel"
                      required
                      placeholder="۰۹۱۲..."
                      className="station-input-field cyan"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group">
                    <label>حوزه تخصصی مرکز</label>
                    <select
                      className="station-input-field cyan"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="dermatology">متخصص پوست و مو (Dermatologist)</option>
                      <option value="plastic-surgery">فوق تخصص جراحی پلاستیک و زیبایی</option>
                      <option value="general-aesthetic">پزشک عمومی فعال در حوزه زیبایی</option>
                      <option value="clinic-management">مدیریت مرکز یا کلینیک درمانی</option>
                    </select>
                  </div>

                  <div className="station-input-group full-width">
                    <label>شهر و توضیحات تکمیلی (درخواست دمو، تعداد پروب مورد نیاز، شرایط اقساطی)</label>
                    <textarea
                      rows={3}
                      placeholder="در صورت نیاز به بررسی شرایط پرداخت چندمرحله‌ای یا تقویم کارگاه آموزشی بلفاروپلاستی یادداشت بفرمایید..."
                      className="station-input-field cyan"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group full-width" style={{ marginTop: '10px' }}>
                    <button type="submit" className="station-btn-primary cyan" style={{ width: '100%' }}>
                      ارسال درخواست استعلام پیش‌فاکتور PlasmaX
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
