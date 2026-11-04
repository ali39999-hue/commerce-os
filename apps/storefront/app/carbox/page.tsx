'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CanvasSequencePlayer, HotspotPin } from '../../components/interactive/canvas-sequence-player';

// ── Interactive Hotspots on CarboX 360 Console ──
const CARBOX_HOTSPOTS: HotspotPin[] = [
  {
    id: 1,
    label: '۱',
    title: 'سیستم پیش‌گرمایش هوشمند پیزوالکتریک گاز (36°C)',
    desc: 'واحد ترموالکتریک دیجیتال جهت گرم‌کردن گاز CO₂ طبی تا ۳۶ درجه سانتی‌گراد، حذف کامل حس سرما و اسپاسم عروقی ناشی از تزریق.',
    spec: 'Piezo-Thermo Active Chamber, Target 36.0°C ± 0.5°C, Zero Vascular Spasm',
    badge: '36°C HEATING',
    frame: 12,
    frameRange: [1, 28],
    xPercent: 54,
    yPercent: 32,
  },
  {
    id: 2,
    label: '۲',
    title: 'ترانسدیوسر دیجیتال و کالیبراسیون فشار پیوسته',
    desc: 'سنسور پیشرفته فشار میکرونی با سیستم بازخورد بلادرنگ (Closed-Loop) برای تنظیم دبی جریان از ۱۰ تا ۱۰۰ سی‌سی بر دقیقه.',
    spec: 'Digital Pressure Transducer 0.1–2.5 bar, Flow Rate 10–100 cc/min, Closed-Loop Sensor',
    badge: '10–100 CC/MIN',
    frame: 38,
    frameRange: [22, 58],
    xPercent: 48,
    yPercent: 46,
  },
  {
    id: 3,
    label: '۳',
    title: 'درگاه دوگانه اتصال هندپیس ترنس‌درمال CarboxyPod',
    desc: 'خروجی اولتراسونیک هوشمند با فرکانس تشدید برای استفاده همزمان از پادهای کربوکسی‌پاد و ژل بدون نیاز به نیدلینگ.',
    spec: 'Dual Modality Output, Ultrasonic Resonance 120Hz, Non-Invasive Transdermal Port',
    badge: 'DUAL PORT',
    frame: 68,
    frameRange: [50, 82],
    xPercent: 55,
    yPercent: 68,
  },
];

// ── Modalities Data ──
const MODALITY_DATA = [
  {
    id: 'subcutaneous',
    title: 'تکنولوژی تزریق زیرجلدی میکرودوز (Subcutaneous CO₂ Micro-Injection)',
    shortTitle: 'تزریق میکرودوز زیرجلدی',
    badge: 'MEDICAL INVASIVE PRO',
    image: '/assets/drdermer/2025/hpinject/01.webp',
    summary:
      'سیستم تزریق کنترل‌شده با سوزن‌های مزوتراپی گیج ۳۰ و ۳۲، تنظیم دیجیتال سرعت جریان گاز از ۱۰ تا ۱۰۰ سی‌سی در دقیقه، و پیش‌گرمایش گاز تا دمای فیزیولوژیک بدن (۳۶°C).',
    features: [
      'ترانسدیوسر فشار دیجیتال با دقت اندازه‌گیری ۰.۱ بار جهت ایمنی حداکثری بافت',
      'سیستم گرمایش پیزوالکتریک گاز تا ۳۶ درجه سانتی‌گراد جهت حذف درد و اسپاسم مویرگی',
      'امکان برنامه‌ریزی دوز دقیق تزریق از ۵ تا ۵۰۰ سی‌سی بر حسب اندیکاسیون بالینی',
      'تخلیه خودکار هوای سیستم و تزریق گاز با خلوص مدیکال گرید ۹۹.۹۹٪',
    ],
    indications: [
      'سلولیت و فیبروز بافتی (Gynoid Lipodystrophy)',
      'چربی‌های موضعی مقاوم شکم، پهلو و غبغب',
      'تیرگی و پف مقاوم پریکولار (اطراف چشم)',
      'استریا و خطوط کشش پوستی (Striae Distensae)',
      'اسکارهای آتروفیک ناشی از آکنه و جراحی',
    ],
  },
  {
    id: 'transdermal',
    title: 'هندپیس ترنس‌درمال CarboxyPod (Transdermal CarboxyPod Handpiece)',
    shortTitle: 'هندپیس ترنس‌درمال CarboxyPod',
    badge: 'NON-INVASIVE BOHR EFFECT',
    image: '/assets/drdermer/2025/hppod/01.webp',
    summary:
      'مدالیته کاملاً غیرتهاجمی با هندپیس ارگونومیک اولتراسونیک که با ایجاد ارتعاش فرکانسی ۱۲۰ هرتز، واکنش شیمیایی میان ژل CarboxyGel و پاد CarboxyPod را بر سطح پوست تسریع و نفوذ گاز CO₂ را به حداکثر می‌رساند.',
    features: [
      'انتقال ترنس‌درمال گاز دی‌اکسید کربن با فعال‌سازی فیزیولوژیک پدیده بوهر بدون سوراخ‌کردن پوست',
      'میکروماساژ اولتراسونیک جهت افزایش جذب ترکیبات فعال سرم‌ها و عصاره‌های پپتیدی',
      'لایه برداری ملایم فیزیکی همگام با جوشش گاز برای درخشش و روشن‌شدن فوری بافت',
      'صفر درصد دوره نقاهت و ایمنی کامل برای انواع تایپ‌های پوستی فیتزپاتریک I تا VI',
    ],
    indications: [
      'روشن‌سازی و اکسیژناسیون فوری پوست‌های کدر و خسته',
      'کاهش تیرگی سطحی و خطوط ریز دور چشم',
      'آماده‌سازی پوست قبل از پروسیجرهای تزریقی و مزوتراپی',
      'تقویت اتصالات دسموزومی و استحکام سد دفاعی پوست',
      'درمان پوست‌های حساس و با تحمل پایین نسبت به سوزن',
    ],
  },
];

// ── Technical Specs Detailed Database ──
const TECHNICAL_SPECS = {
  gasDelivery: [
    { label: 'دامنه دبی جریان گاز (Flow Rate)', value: '10 to 100 cc/min', note: 'تنظیم پیوسته با گام‌های ۵ سی‌سی جهت تطابق با بافت‌های مختلف' },
    { label: 'سنسور پایش فشار (Pressure Transducer)', value: 'Digital Piezo-Resistive', note: 'سنسور دیجیتال فیدبک بلادرنگ با قطع خودکار در افزایش فشار غیرمجاز' },
    { label: 'سامانه پیش‌گرمایش گاز (Pre-Heating)', value: 'Piezo-Thermal 36°C ± 0.5°C', note: 'حفظ دمای یکنواخت گاز ورودی هم‌دما با بافت فیزیولوژیک انسان' },
    { label: 'حداکثر فشار تزریق ایمن (Max Safe Pressure)', value: '2.5 bar', note: 'سوپاپ اطمینان دوگانه کالیبره‌شده مکانیکی و دیجیتال' },
  ],
  transdermalSystem: [
    { label: 'فرکانس ارتعاش هندپیس CarboxyPod', value: '120 Hz Sinusoidal', note: 'موج سینوسی استاندارد پزشکی جهت تسریع نفوذ ترابافتی بدون درد' },
    { label: 'سازگاری کپسول و پاد', value: 'ReeMed CarboxyPod 170ml', note: 'تراکم الیاف فیبریک فعال‌ساز بیکربنات سدیم و اسیدهای ارگانیک' },
    { label: 'کنترل دیجیتال سرعت نوسان', value: '3 Levels (Low, Med, High)', note: 'تنظیم بر اساس حساسیت موضع درمان و ضخامت اپیدرم' },
  ],
  standards: [
    { label: 'کلاس استاندارد پزشکی (Medical Class)', value: 'CE Medical Class IIb', note: 'انطباق کامل با استاندارد سخت‌گیرانه تجهیزات پزشکی اتحادیه اروپا MDR 2017/745' },
    { label: 'گواهینامه مدیریت کیفیت (Quality System)', value: 'ISO 13485:2016', note: 'تأییدیه تولید تخصصی ادوات پزشکی و تضمین کنترل کیفی' },
    { label: 'کد استاندارد ایمنی الکتریکی', value: 'IEC 60601-1 / IEC 60601-1-2', note: 'حفاظت کامل الکترومغناطیسی و ایزولاسیون کامل بیمار' },
    { label: 'گارانتی و پشتیبانی تخصصی', value: '24 Months Official Warranty', note: '۱۰ سال خدمات پس از فروش رسمی و تأمین مداوم قطعات یدکی' },
  ],
};

// ── Clinical Indications ──
const CLINICAL_INDICATIONS = [
  {
    title: 'سلولیت و ناهمواری‌های بافتی',
    scientific: 'Cellulite (Gynoid Lipodystrophy)',
    desc: 'تجزیه اتصالات فیبروز بین لوپ‌های چربی زیرجلدی، بهبود تخلیه لنفاوی و بازگرداندن یکنواختی سطح پوست ران و باسن.',
    protocol: '۸ الی ۱۰ جلسه - هفته‌ای ۱ تا ۲ بار با دبی ۶۰ الی ۸۰ cc/min',
    tag: 'BODY CONTOURING',
  },
  {
    title: 'تجمع چربی موضعی',
    scientific: 'Localized Adiposity',
    desc: 'تحریک آپوپتوز سلول‌های چربی و تسریع لیپولیز ناشی از اکسیژناسیون بافتی و اتساع بستر مویرگی با CO₂.',
    protocol: '۶ الی ۸ جلسه - همراه با پروتکل‌های لاغری مکمل',
    tag: 'METABOLIC LIPOLYSIS',
  },
  {
    title: 'تیرگی و پف دور چشم',
    scientific: 'Periorbital Dark Circles',
    desc: 'اکسیژن‌رسانی شدید به شبکه مویرگی هیپوکسی‌شده پلک پایین از طریق اثر بوهر و افزایش ضخامت درمیس برای رفع سایه‌های تیره.',
    protocol: '۴ الی ۶ جلسه - میکرودوز ۳ الی ۵ سی‌سی در هر تزریق با گاز ۳۶°C',
    tag: 'PERIORBITAL VASCULAR',
  },
  {
    title: 'ترک‌های پوستی و استریا',
    scientific: 'Striae Distensae',
    desc: 'شکستن بافت اسکار قدیمی و تحریک فیبروبلاست‌ها برای نئوکلاژنز و ساخت رشته‌های الاستین جدید در خطوط کششی سفید و قرمز.',
    protocol: '۶ الی ۱۰ جلسه - تزریق خطی پیوسته همراه با پاد ترنس‌درمال',
    tag: 'NEO-COLLAGENESIS',
  },
  {
    title: 'اسکارهای آتروفیک',
    scientific: 'Atrophic & Acne Scars',
    desc: 'سابسیژن ملایم گازی در لایه رتیکولار درمیس، آزادسازی فرورفتگی‌ها و تسهیل جریان خون در بستر اسکار جهت پر شدن طبیعی بافت.',
    protocol: '۴ الی ۶ جلسه - ترکیب تزریق نقطه‌ای و ماسک‌های ترمیمی',
    tag: 'DERMAL REMODELING',
  },
];

export default function CarboxLandingPage() {
  const [activeModality, setActiveModality] = useState<'subcutaneous' | 'transdermal'>('subcutaneous');
  const [activeSpecTab, setActiveSpecTab] = useState<'gasDelivery' | 'transdermalSystem' | 'standards'>('gasDelivery');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(CARBOX_HOTSPOTS[0]);

  // B2B Quote Form State
  const [clinicName, setClinicName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName || !doctorName || !phone) return;
    setFormSubmitted(true);
  };

  const currentModality = MODALITY_DATA.find((m) => m.id === activeModality) || MODALITY_DATA[0];

  return (
    <div className="clinical-station-page">
      <div className="station-ambient-glow" />

      <div className="clinical-container">
        {/* Breadcrumb Navigation & Regulatory Badge */}
        <div className="station-breadcrumb-bar">
          <div className="station-breadcrumb-links">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reemed">تجهیزات پزشکی ReeMed</Link>
            <span>/</span>
            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>ایستگاه بالینی CarboX™</span>
          </div>

          <div className="station-regulatory-pill">
            <span className="dot" />
            <span>CE Medical Class IIb</span>
            <span>•</span>
            <span>ISO 13485:2016 Certified</span>
          </div>
        </div>

        {/* ── HERO SECTION WITH 360 INTERACTIVE CANVAS ── */}
        <section className="station-hero-grid">
          {/* Right Column (Text in RTL) */}
          <div className="station-hero-info">
            <div className="station-badge-wrapper">
              <span className="station-badge">ایستگاه کربوکسی‌تراپی پیشرفته</span>
              <span className="station-regulatory-pill">MDR 2017/745</span>
            </div>

            <h1 className="station-title">
              سامانه جامع کربوکسی‌تراپی مدیکال{' '}
              <span className="highlight">ReeMed CarboX™ Station</span>
            </h1>

            <p className="station-lead">
              کامل‌ترین ایستگاه بالینی کربوکسی‌تراپی اروپا با ترکیب انحصاری دو مدالیته: تزریق زیرجلدی
              فوق‌دقیق گاز CO₂ با ترانسدیوسر دیجیتال و پیش‌گرمایش هوشمند ۳۶ درجه سانتی‌گراد، همگام با
              هندپیس ترنس‌درمال اولتراسونیک CarboxyPod بدون نیاز به سوزن و بدون دوره نقاهت.
            </p>

            {/* Quick Specs Strip */}
            <div className="station-quick-specs">
              <div className="quick-spec-item">
                <span className="quick-spec-value">10–100</span>
                <span className="quick-spec-label">دبی خروجی گاز (cc/min)</span>
              </div>
              <div className="quick-spec-item">
                <span className="quick-spec-value">36.0°C</span>
                <span className="quick-spec-label">گرمایش پیزوالکتریک گاز</span>
              </div>
              <div className="quick-spec-item">
                <span className="quick-spec-value">Class IIb</span>
                <span className="quick-spec-label">کلاس تجهیزات پزشکی CE</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="station-actions-row">
              <a href="#quote-section" className="station-btn-primary">
                <span>استعلام رسمی قیمت و شرایط فروش اقساطی کلینیک</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </a>

              <Link href="/b2b/workshops" className="station-btn-secondary">
                <span>رزرو ورکشاپ هندزآن CarboX</span>
              </Link>
            </div>
          </div>

          {/* Left Column: 360 Interactive Canvas Player */}
          <div>
            <CanvasSequencePlayer
              frameFolder="/assets/drdermer/2025/carbox"
              totalFrames={82}
              framePrefix=""
              padDigits={2}
              fileExtension=".webp"
              autoRotate={true}
              autoRotateSpeedMs={55}
              aspectRatio={1.33}
              overlayHotspots={CARBOX_HOTSPOTS}
              label="نمایش تعاملی و ۳۶۰ درجه ایستگاه پزشکی CarboX"
              onHotspotSelect={(hs) => setSelectedHotspot(hs)}
              selectedHotspotId={selectedHotspot?.id}
            />

            {/* Active Hotspot Callout Details */}
            {selectedHotspot && (
              <div
                style={{
                  marginTop: '16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
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
                    <span style={{ fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 800 }}>
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
                      background: 'rgba(45, 212, 191, 0.15)',
                      color: '#2dd4bf',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(45, 212, 191, 0.3)',
                    }}
                  >
                    {selectedHotspot.badge}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── MODALITIES COMPARISON: SUBCUTANEOUS VS TRANSDERMAL ── */}
        <section className="station-section">
          <div className="station-section-header">
            <span className="station-section-eyebrow">Dual Engineering Architecture</span>
            <h2 className="station-section-title">
              مقایسه دو تکنولوژی تزریق زیرجلدی گاز CO₂ و هندپیس CarboxyPod
            </h2>
            <p className="station-section-subtitle">
              ایستگاه CarboX نیاز پزشک به انتخاب میان پروسیجر تهاجمی یا غیرتهاجمی را از میان برداشته است؛
              در هر جلسه درمانی می‌توانید دقیق‌ترین پروتکل را برای بیمار تنظیم نمایید.
            </p>
          </div>

          {/* Modality Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px' }}>
            {MODALITY_DATA.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModality(m.id as 'subcutaneous' | 'transdermal')}
                className={`specs-tab-btn ${activeModality === m.id ? 'active' : ''}`}
                style={{ padding: '12px 28px', fontSize: '0.94rem' }}
              >
                {m.shortTitle}
              </button>
            ))}
          </div>

          {/* Active Modality Detailed View */}
          <div className="station-card" style={{ padding: '36px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span className="station-badge">{currentModality.badge}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>انحصاری سیستم CarboX</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', margin: '0 0 16px' }}>
                  {currentModality.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 24px' }}>
                  {currentModality.summary}
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: '#2dd4bf', marginBottom: '12px' }}>
                    مشخصات فنی و ایمنی اختصاصی:
                  </strong>
                  <ul className="station-card-list">
                    {currentModality.features.map((feat, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Handpiece Showcase Image Card */}
              <div
                style={{
                  background: 'rgba(2, 6, 23, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '18px',
                  padding: '28px',
                  textAlign: 'center',
                }}
              >
                <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img
                    src={currentModality.image}
                    alt={currentModality.title}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))' }}
                  />
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                    اندیکاسیون‌های بالینی هدف:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentModality.indications.map((ind, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#e2e8f0',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE TECHNICAL SPECIFICATIONS ── */}
        <section className="station-section">
          <div className="station-section-header">
            <span className="station-section-eyebrow">Medical Precision Engineering</span>
            <h2 className="station-section-title">مشخصات فنی و سنسورهای کالیبراسیون CarboX</h2>
            <p className="station-section-subtitle">
              بررسی پارامترهای کنترل دیجیتال فشار گاز، سنسور فیدبک هوشمند و استانداردهای الکترومکانیکی
            </p>
          </div>

          <div className="station-specs-table-wrapper">
            <div className="specs-tabs-header">
              <button
                type="button"
                onClick={() => setActiveSpecTab('gasDelivery')}
                className={`specs-tab-btn ${activeSpecTab === 'gasDelivery' ? 'active' : ''}`}
              >
                سامانه تزریق گاز و ترانسدیوسر فشار
              </button>
              <button
                type="button"
                onClick={() => setActiveSpecTab('transdermalSystem')}
                className={`specs-tab-btn ${activeSpecTab === 'transdermalSystem' ? 'active' : ''}`}
              >
                هندپیس CarboxyPod و ماژول اولتراسونیک
              </button>
              <button
                type="button"
                onClick={() => setActiveSpecTab('standards')}
                className={`specs-tab-btn ${activeSpecTab === 'standards' ? 'active' : ''}`}
              >
                استانداردهای بین‌المللی و گواهینامه‌ها
              </button>
            </div>

            <div className="specs-grid-display">
              {TECHNICAL_SPECS[activeSpecTab].map((item, index) => (
                <div key={index} className="spec-parameter-card">
                  <span className="spec-parameter-label">{item.label}</span>
                  <span className="spec-parameter-val">{item.value}</span>
                  <span className="spec-parameter-note">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLINICAL INDICATIONS ── */}
        <section className="station-section">
          <div className="station-section-header">
            <span className="station-section-eyebrow">Evidence-Based Dermatological Indications</span>
            <h2 className="station-section-title">اندیکاسیون‌های بالینی مورد تأیید مراجع علمی</h2>
            <p className="station-section-subtitle">
              پروتکل‌های درمانی استانداردشده بر اساس صدها کارآزمایی بالینی معتبر و مطالعات منتشرشده
            </p>
          </div>

          <div className="indications-grid">
            {CLINICAL_INDICATIONS.map((ind, i) => (
              <div key={i} className="indication-card">
                <div className="indication-header">
                  <div className="indication-icon">{i + 1}</div>
                  <div>
                    <h3 className="indication-title">{ind.title}</h3>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {ind.scientific}
                    </span>
                  </div>
                </div>

                <p className="indication-desc">{ind.desc}</p>

                <div className="indication-protocol">
                  <strong>پروتکل توصیه شده:</strong> {ind.protocol}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CE MEDICAL CLASS IIB & REGULATORY DOSSIER ── */}
        <section className="station-section">
          <div className="certification-dossier-card">
            <div className="dossier-content">
              <span className="station-badge">دوسیه رگولاتوری رسمی</span>
              <h3 style={{ marginTop: '12px' }}>
                گواهینامه CE Medical Class IIb و استاندارد ISO 13485:2016
              </h3>
              <p>
                دستگاه ReeMed CarboX بر خلاف دستگاه‌های شبه‌پزشکی و بیوتی، دارای سرتیفیکیت رسمی کلاس IIb
                از ناتیفای بادی معتبر اتحادیه اروپا (Notified Body 0123) می‌باشد. این گواهینامه متضمن
                ایمنی بافتی صددرصدی، استریلیزاسیون مسیر گاز، کالیبراسیون الکترونیکی فشار و تضمین عدم
                ایجاد آمبولی گازی است.
              </p>

              <div className="dossier-badges">
                <div className="dossier-badge-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>MDR 2017/745 Compliant</span>
                </div>
                <div className="dossier-badge-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>ISO 13485:2016 Medical Devices</span>
                </div>
                <div className="dossier-badge-item">
                  <span>Directive 93/42/EEC Annex II</span>
                </div>
              </div>
            </div>

            <div className="dossier-meta-card">
              <div>
                <strong>طبقه تجهیزات:</strong>
                <span style={{ display: 'block' }}>Active Therapeutic Medical Device Class IIb</span>
              </div>
              <div>
                <strong>شاخص تست ایمنی بیمار:</strong>
                <span style={{ display: 'block' }}>IEC 60601-1 Type BF Applied Part</span>
              </div>
              <div>
                <strong>خدمات پس از فروش:</strong>
                <span style={{ display: 'block' }}>۲۴ ماه گارانتی تعویض + ۱۰ سال خدمات قطعات</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── B2B QUOTE REQUEST & WORKSHOP BOOKING ── */}
        <section id="quote-section" className="station-section">
          <div className="station-b2b-cta-card">
            <span className="station-badge">پورتال اختصاصی تأمین کلینیک‌ها</span>
            <h2>استعلام قیمت همکاری و رزرو ورکشاپ آموزشی CarboX</h2>
            <p>
              پزشکان گرامی، مدیران کلینیک‌های پوست و مراکز درمانی می‌توانند با ثبت فرم زیر پیش‌فاکتور رسمی،
              کاتالوگ فنی مهندسی پزشکی، و شرایط پرداخت اقساطی تجهیزات را دریافت نمایند. همچنین امکان
              هماهنگی جلسه دموی حضوری در کلینیک فراهم است.
            </p>

            <div className="station-b2b-btn-group">
              <Link href="/b2b" className="station-btn-primary">
                ورود به پورتال اصلی تأمین B2B
              </Link>
              <Link href="/b2b/workshops" className="station-btn-secondary">
                مشاهده تقویم ورکشاپ‌های تخصصی پوست
              </Link>
            </div>

            {/* Quick In-Page Quote Form */}
            <div className="station-quote-box">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '20px', textAlign: 'right' }}>
                فرم سریع درخواست پیش‌فاکتور و دموی حضوری
              </h3>

              {formSubmitted ? (
                <div className="station-alert-success">
                  <strong>درخواست شما با موفقیت ثبت شد.</strong>
                  <p style={{ margin: '6px 0 0', fontSize: '0.82rem' }}>
                    کارشناس ارشد تجهیزات کلینیکال ReeMed حداکثر ظرف مدت ۲ ساعت کاری با شما تماس خواهد گرفت و
                    پیش‌فاکتور رسمی همراه با جدول استهلاک و شرایط اقساطی برای شما ارسال می‌گردد.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="station-quote-form-grid">
                  <div className="station-input-group">
                    <label>نام مرکز یا کلینیک درمانی *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: کلینیک تخصصی پوست و لیزر سپهر"
                      className="station-input-field"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group">
                    <label>نام و نام خانوادگی پزشک / مدیر مرکز *</label>
                    <input
                      type="text"
                      required
                      placeholder="دکتر ..."
                      className="station-input-field"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group">
                    <label>شماره تماس مستقیم (موبایل) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="۰۹۱۲..."
                      className="station-input-field"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group">
                    <label>شهر و استان محل استقرار کلینیک</label>
                    <input
                      type="text"
                      placeholder="تهران، اصفهان، شیراز..."
                      className="station-input-field"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group full-width">
                    <label>توضیحات یا نیازمندی‌های خاص (تعداد پرسنل، نیاز به دموی حضوری یا پادهای اضافی)</label>
                    <textarea
                      rows={3}
                      placeholder="لطفاً در صورت نیاز به بررسی شرایط خرید اقساطی یا درخواست جلسه آزمایشی در مطب قید فرمایید..."
                      className="station-input-field"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="station-input-group full-width" style={{ marginTop: '10px' }}>
                    <button type="submit" className="station-btn-primary" style={{ width: '100%' }}>
                      ارسال درخواست رسمی پیش‌فاکتور و استعلام CarboX
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
