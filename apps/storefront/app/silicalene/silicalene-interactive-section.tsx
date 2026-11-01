'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SilicaleneIngredient {
  nameFa: string;
  inci: string;
  percentage?: string;
  role: string;
  mechanism: string;
  category: 'detox' | 'exfoliation' | 'soothing';
}

const SILICALENE_INGREDIENTS: SilicaleneIngredient[] = [
  {
    nameFa: 'کره‌های کاملاً مدور سیلیکا (Smooth Silica Spheres)',
    inci: 'Hydrated Silica (Spherical Micro-Beads)',
    percentage: '6.00%',
    role: 'لایروبی بیومکانیکی منافذ بدون ایجاد ریزپارگی',
    mechanism: 'میکروسفرهای ژئودینامیک کاملاً کروی و صیقلی، به دیواره داخلی مجرای فولیکول چسبیده و بدون خراش، سبوم سفت‌شده را خارج می‌کنند.',
    category: 'detox',
  },
  {
    nameFa: 'کربن فعال دارویی (Activated Carbon)',
    inci: 'Charcoal Powder (Medical Grade Activated Carbon)',
    percentage: '2.00%',
    role: 'مگنت جاذب آلودگی‌های شهری و ذرات نانو',
    mechanism: 'سطح متخلخل کربن فعال مساحتی معادل ۱۰۰۰ مترمربع به ازای هر گرم دارد که چربی‌های اکسیدشده، فلزات سنگین و ذرات دوده PM2.5 را به دام می‌اندازد.',
    category: 'detox',
  },
  {
    nameFa: 'سالیسیلیک اسید (BHA - Salicylic Acid)',
    inci: 'Salicylic Acid',
    percentage: '1.20%',
    role: 'نفوذ محلول در چربی به عمق غدد سباسه',
    mechanism: 'به عنوان بتا-هیدروکسی اسید محلول در چربی، سبوم متراکم درون منافذ را مایع کرده و دیسکواماسیون طبیعی کومدون‌ها را تسهیل می‌کند.',
    category: 'exfoliation',
  },
  {
    nameFa: 'اسید گلیکولیک (AHA - Glycolic Acid)',
    inci: 'Glycolic Acid',
    percentage: '2.00%',
    role: 'لایه‌برداری شیمیایی سطحی و رفع کدری شاخی',
    mechanism: 'کوچک‌ترین مولکول AHA که پیوندهای پروتئینی سلول‌های مرده خارجی را سست کرده و جذب اکتیوهای سم‌زدا را به حداکثر می‌رساند.',
    category: 'exfoliation',
  },
  {
    nameFa: 'زینک پی‌سی‌ای (Zinc PCA)',
    inci: 'Zinc PCA',
    percentage: '1.00%',
    role: 'تنظیم‌کننده ترشح سبوم و آنتی‌میکروبیال',
    mechanism: 'مهار فعالیت آنزیم ۵-آلفا ردوکتاز جهت کاهش برق‌افتادگی پوست و کنترل تکثیر باکتری‌های بی‌هوازی داخل منافذ.',
    category: 'detox',
  },
  {
    nameFa: 'بتائین طبیعی (Natural Betaine)',
    inci: 'Betaine',
    percentage: '2.00%',
    role: 'اسموپروتکتور و محافظ هیدراتاسیون اپیدرم',
    mechanism: 'حفظ آب درون سلولی و جلوگیری از خشکی حاد پس از فرآیند چربی‌زدایی و لایه‌برداری BHA.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره برگ آلوئه‌ورا (Aloe Barbadensis)',
    inci: 'Aloe Barbadensis Leaf Juice',
    percentage: '3.00%',
    role: 'التیام‌بخش فوری و آبرسان سبک',
    mechanism: 'سرشار از ویتامین‌ها و آنزیم‌های ضدالتهاب، مانع از احساس کشیدگی و سوزش پس از ماساژ اسکراب روی پوست می‌شود.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره ریشه شیرین‌بیان (Licorice / Glabridin)',
    inci: 'Glycyrrhiza Glabra Root Extract',
    percentage: '0.80%',
    role: 'مهار تیرگی منافذ و ضد لک',
    mechanism: 'گلبریدین مانع از اکسیداسیون لیپیدها در دهانه منافذ شده و از سیاه شدن رنگ چربی‌های مجاری جلوگیری می‌نماید.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره بابونه آلمانی (Chamomilla Recutita)',
    inci: 'Chamomilla Recutita Flower Extract',
    percentage: '1.00%',
    role: 'تسکین‌دهنده قرمزی و ضدحساسیت',
    mechanism: 'حاوی بیزابولول خالص با اثر آرام‌بخشی بر اعصاب حسی پوست در طول ماساژ فیزیکی دانه‌های اسکراب.',
    category: 'soothing',
  },
];

export function SilicaleneInteractiveSection() {
  const [activeTab, setActiveTab] = useState<'pore-cleanser' | 'ingredients' | 'microbeads' | 'protocol'>('pore-cleanser');
  const [sebumLevel, setSebumLevel] = useState<'oily' | 'combination' | 'normal'>('oily');
  const [selectedIngredient, setSelectedIngredient] = useState<SilicaleneIngredient>(SILICALENE_INGREDIENTS[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const skinTelemetry = {
    oily: {
      title: 'پوست بسیار چرب با منافذ مسدود و کومدون‌های باز',
      recommendation: '۳ بار در هفته (شب‌ها به مدت ۶۰ الی ۹۰ ثانیه)',
      sebumReduction: '۵۴٪- کاهش ترشح سبوم پس از شستشو',
      poreClearance: '۷۲٪ لایروبی کومدون‌های سرسیاه بینی و چانه',
      mattifyingDuration: 'تا ۸ ساعت ماتی بدون براق شدن پوست',
    },
    combination: {
      title: 'پوست مختلط با چربی ناحیه T-Zone و گونه‌های نرمال',
      recommendation: '۲ بار در هفته (تمرکز ویژه روی پیشانی، بینی و چانه)',
      sebumReduction: '۴۲٪- تنظیم چربی در ناحیه T-Zone',
      poreClearance: '۶۵٪ پاکسازی منافذ و یکنواختی بافت گونه‌ها',
      mattifyingDuration: 'تا ۱۰ ساعت حفظ طراوت طبیعی',
    },
    normal: {
      title: 'پوست معمولی کدر شده ناشی از آلودگی شهری و ذرات معلق',
      recommendation: '۱ تا ۲ بار در هفته (ماساژ ملایم سراسر صورت)',
      sebumReduction: '۳۰٪- حذف آلاینده‌های چرب و کراتین کدر',
      poreClearance: '۸۵٪ جذب ذرات معلق توسط کربن فعال',
      mattifyingDuration: '۱۲ ساعت شفافیت و تنفس سلولی عمیق',
    },
  }[sebumLevel];

  const faqs = [
    {
      q: 'آیا دانه‌های اسکراب سیلیکالین مانند میکروبیدهای پلاستیکی محیط زیست را آلوده می‌کنند؟',
      a: 'خیر! سیلیکالین ۱۰۰٪ فاقد پلی‌اتیلن و میکروپلاستیک است (Microplastic-Free). دانه‌های سیلیکای آن از ماده معدنی سیلیس با منشأ طبیعی ژئودینامیک فرآوری شده‌اند که کاملاً زیست‌تخریب‌پذیر و بی‌خطر برای محیط زیست و اقیانوس‌ها هستند.',
    },
    {
      q: 'آیا برای پوست‌های دارای جوش فعال مناسب است؟',
      a: 'به دلیل داشتن سالیسیلیک اسید (BHA)، زینک PCA و کربن فعال، اسکراب سیلیکالین ترشح چربی را مهار کرده و باکتری مولد جوش را کنترل می‌کند. در صورت وجود جوش‌های چرکی ملتهب، بهتر است خمیر بدون ماساژ شدید روی پوست قرار گرفته و پس از یک دقیقه شسته شود.',
    },
    {
      q: 'آیا مصرف همزمان اسکراب سیلیکالین و ژل هیلین پیشنهاد می‌شود؟',
      a: 'بله، ترکیب این دو محصول یکی از محبوب‌ترین پروتکل‌های درماتولوژی است. سیلیکالین منافذ را کاملاً تخلیه و مات می‌کند و ژل هیلین بدون ایجاد ذره‌ای چربی، رطوبت عمقی و ترکیبات سیکا و پانتنول را به منافذ پاک‌شده تزریق می‌نماید.',
    },
  ];

  return (
    <section className="cp-section" aria-label="بخش تعاملی اسکراب دتوکس سیلیکالین">
      <div className="cp-section-header">
        <span className="cp-section-eyebrow teal">BIO-MECHANICAL DETOX MATRIX</span>
        <h2 className="cp-section-title">بررسی علمی و آزمایشگاهی اسکراب Silicalene™</h2>
        <p className="cp-section-subtitle">
          هندسه ذرات میکروسفر سیلیکا، جذب مغناطیسی کربن فعال دارویی و هم‌افزایی هیدروکسی‌اسیدهای AHA/BHA
        </p>
      </div>

      <div className="cp-interactive-box">
        {/* Navigation Tabs */}
        <div className="cp-interactive-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pore-cleanser'}
            className={`cp-tab-btn teal ${activeTab === 'pore-cleanser' ? 'active' : ''}`}
            onClick={() => setActiveTab('pore-cleanser')}
          >
            🫧 شبیه‌ساز لایروبی منافذ و تنظیم سبوم
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ingredients'}
            className={`cp-tab-btn teal ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            🧪 پرونده ۹ ترکیب دتوکس و التیام‌بخش
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'microbeads'}
            className={`cp-tab-btn teal ${activeTab === 'microbeads' ? 'active' : ''}`}
            onClick={() => setActiveTab('microbeads')}
          >
            ⚖️ مقایسه میکروسفرهای سیلیکا و کربن فعال با اسکراب‌های سنتی
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'protocol'}
            className={`cp-tab-btn teal ${activeTab === 'protocol' ? 'active' : ''}`}
            onClick={() => setActiveTab('protocol')}
          >
            📋 پروتکل بالینی سم‌زدایی و لایروبی
          </button>
        </div>

        {/* Tab 1: Pore Cleanser Simulator */}
        {activeTab === 'pore-cleanser' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '12px' }}>
                نوع پوست و وضعیت منافذ را انتخاب کنید تا بیومتریک پاکسازی سیلیکالین محاسبه گردد:
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'oily', label: 'پوست چرب و جوش‌های سرسیاه' },
                  { id: 'combination', label: 'پوست مختلط (ناحیه T چرب)' },
                  { id: 'normal', label: 'پوست معمولی با کدری آلودگی هوا' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSebumLevel(item.id as 'oily' | 'combination' | 'normal')}
                    style={{
                      flex: '1',
                      minWidth: '180px',
                      padding: '14px',
                      borderRadius: '12px',
                      background: sebumLevel === item.id ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: sebumLevel === item.id ? '1px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: sebumLevel === item.id ? '#2dd4bf' : '#cbd5e1',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Display */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  {skinTelemetry.title}
                </span>
                <span className="cp-badge-pill teal">پروتکل: {skinTelemetry.recommendation}</span>
              </div>

              <div className="cp-metrics-row" style={{ border: 'none', padding: 0 }}>
                <div className="cp-metric-box">
                  <div className="cp-metric-val teal">{skinTelemetry.sebumReduction}</div>
                  <div className="cp-metric-label">مهار ترشح چربی اضافه سبوم</div>
                </div>
                <div className="cp-metric-box">
                  <div className="cp-metric-val teal">{skinTelemetry.poreClearance}</div>
                  <div className="cp-metric-label">لایروبی کومدون‌های متراکم</div>
                </div>
                <div className="cp-metric-box">
                  <div className="cp-metric-val teal">{skinTelemetry.mattifyingDuration}</div>
                  <div className="cp-metric-label">ماندگاری جلوه مات ابریشمی</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 9 Detox Ingredients */}
        {activeTab === 'ingredients' && (
          <div>
            <div style={{ marginBottom: '20px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              فرمولاسیون سیلیکالین با تلفیق دانه‌های صیقلی سیلیکا، کربن فعال و اسیدهای AHA/BHA توسعه یافته است:
            </div>

            <div className="cp-ingredients-grid">
              {SILICALENE_INGREDIENTS.map((ing, idx) => (
                <div
                  key={idx}
                  className="cp-ingredient-card teal"
                  onClick={() => setSelectedIngredient(ing)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedIngredient.inci === ing.inci ? '#2dd4bf' : undefined,
                  }}
                >
                  <div className="cp-ing-header">
                    <h3 className="cp-ing-name">{ing.nameFa}</h3>
                    {ing.percentage && <span className="cp-ing-pct teal">{ing.percentage}</span>}
                  </div>
                  <div className="cp-ing-inci">{ing.inci}</div>
                  <p className="cp-ing-purpose">{ing.role}</p>
                  <div className="cp-ing-target">
                    <span>🔬</span>
                    <span>{ing.mechanism.slice(0, 75)}...</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Ingredient Highlight */}
            {selectedIngredient && (
              <div
                style={{
                  marginTop: '28px',
                  background: 'rgba(20, 184, 166, 0.08)',
                  border: '1px solid rgba(45, 212, 191, 0.35)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#2dd4bf', fontWeight: 900 }}>
                    {selectedIngredient.nameFa} {selectedIngredient.percentage ? `(${selectedIngredient.percentage})` : ''}
                  </h4>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {selectedIngredient.inci}
                  </span>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#f1f5f9', lineHeight: '1.8' }}>
                  {selectedIngredient.mechanism}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Comparison with Microbeads & Harsh Charcoal */}
        {activeTab === 'microbeads' && (
          <div className="cp-compare-grid">
            {/* Harsh Charcoal / Peel-off Masks */}
            <div className="cp-compare-card">
              <span className="cp-compare-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                ماسک‌ها و اسکراب‌های زغال سنتی
              </span>
              <h3 className="cp-compare-title">ماسک‌های پیل‌آف و پودر زغال سنگین</h3>
              <ul className="cp-compare-list">
                <li>❌ کندن فیزیکی و تهاجمی موهای کرکی و لایه محافظ شاخی</li>
                <li>❌ ایجاد خشکی حاد، کشیدگی و واکنش‌های التهابی شدید</li>
                <li>❌ ذرات ناصاف و زاویه‌دار که ایجاد خراش سطحی می‌کنند</li>
                <li>❌ ناتوان در نفوذ به عمق فولیکول‌ها بدون ماده BHA</li>
              </ul>
            </div>

            {/* Silicalene Spheres */}
            <div className="cp-compare-card highlight teal">
              <span className="cp-compare-badge" style={{ background: 'rgba(20, 184, 166, 0.25)', color: '#2dd4bf', borderColor: '#2dd4bf' }}>
                استاندارد بیومکانیکال دکتر درمر
              </span>
              <h3 className="cp-compare-title">Silicalene Silica Spheres + Charcoal</h3>
              <ul className="cp-compare-list">
                <li>✓ کره‌های میکرونی سیلیکای کاملاً گرد و صیقلی بدون کمترین خراش</li>
                <li>✓ کربن فعال دارویی با مساحت سطحی ۱۰۰۰m²/g به عنوان مگنت جاذب سموم</li>
                <li>✓ سالیسیلیک اسید (BHA) جهت حل‌کردن سبوم سفت‌شده درون مجرای منافذ</li>
                <li>✓ ژل هیدراته با بتائین و آلوئه‌ورا جهت حفظ ۱۰۰٪ سد دفاعی رطوبت</li>
                <li>✓ ۱۰۰٪ فاقد میکروپلاستیک، دوستدار محیط‌زیست و ارگانیسم‌های دریایی</li>
              </ul>
            </div>

            {/* Plastic Microbeads & Seed Scrubs */}
            <div className="cp-compare-card">
              <span className="cp-compare-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                میکروپلاستیک‌ها و نمک/هسته میوه
              </span>
              <h3 className="cp-compare-title">دانه‌های پلی‌اتیلن و پودر هسته</h3>
              <ul className="cp-compare-list">
                <li>⚠️ لبه‌های تیز و ایجاد پارگی‌های میکروسکوپی (Micro-tears)</li>
                <li>⚠️ تجزیه‌ناپذیر و آلاینده چرخه آب و محیط‌زیست</li>
                <li>⚠️ سوزش شدید روی پوست‌های دهیدراته و مستعد آکنه</li>
                <li>⚠️ عدم توانایی در تخلیه سبوم اکسیدشده درون منافذ</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Usage Protocol */}
        {activeTab === 'protocol' && (
          <div className="cp-protocol-steps">
            <div className="cp-protocol-step-card">
              <div className="cp-step-num teal">01</div>
              <div className="cp-step-content">
                <h4>مرحله اول: مرطوب‌سازی پوست با آب ولرم</h4>
                <p>
                  صورت را با شوینده روزانه شسته و کاملاً مرطوب بگذارید. گرما و رطوبت ملایم، چربی‌های مسدودکننده دهانه منافذ را نرم می‌نماید.
                </p>
              </div>
            </div>

            <div className="cp-protocol-step-card">
              <div className="cp-step-num teal">02</div>
              <div className="cp-step-content">
                <h4>مرحله دوم: ماساژ دورانی با تمرکز بر ناحیه T</h4>
                <p>
                  مقدار کافی از ژل اسکراب سیلیکالین را روی نوک انگشتان پخش کرده و به مدت ۶۰ تا ۹۰ ثانیه با حرکات دایره‌ای روی بینی، پیشانی و چانه به آرامی ماساژ دهید.
                </p>
              </div>
            </div>

            <div className="cp-protocol-step-card">
              <div className="cp-step-num teal">03</div>
              <div className="cp-step-content">
                <h4>مرحله سوم: آبکشی کامل با آب خنک</h4>
                <p>
                  با آب خنک پوست را بشویید تا منافذ تمیزشده جمع شوند و اثری از ذرات تیره کربن روی صورت باقی نماند.
                </p>
              </div>
            </div>

            <div className="cp-protocol-step-card">
              <div className="cp-step-num teal">04</div>
              <div className="cp-step-content">
                <h4>مرحله چهارم: آبرسانی با ژل هیلین (Healene)</h4>
                <p>
                  جهت جلوگیری از تبخیر آب و تسکین عمیق سلول‌ها، بلافاصله از ژل فاقد چربی هیلین استفاده فرمایید.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAQs */}
      <div style={{ marginTop: '56px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>
          پرسش‌های متداول درباره اسکراب دتوکس سیلیکالین
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '840px', margin: '0 auto' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    textAlign: 'right',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#2dd4bf' }}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 22px 18px', color: '#94a3b8', fontSize: '0.86rem', lineHeight: '1.8' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
