'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CrystaleneIngredient {
  nameFa: string;
  inci: string;
  percentage: string;
  role: string;
  mechanism: string;
  category: 'resurfacing' | 'barrier' | 'soothing';
}

const CRYSTALENE_INGREDIENTS: CrystaleneIngredient[] = [
  {
    nameFa: 'میکروکریستال‌های خالص اکسید آلومینیوم (Alumina)',
    inci: 'Alumina Microcrystals (Corundum)',
    percentage: '12.00%',
    role: 'سایش مکانیکی فوق‌ریز و پولیش ابریشمی',
    mechanism: 'بلورهای بیواینرت با ابعاد یکنواخت ۴۰ تا ۵۰ میکرون و گوشه‌های پخ‌شده، سلول‌های کراتینه کدر سطح شاخی را بدون خراش‌های میکروسکوپی جدا می‌کنند.',
    category: 'resurfacing',
  },
  {
    nameFa: 'نیاسینامید دارویی (Vitamin B3)',
    inci: 'Niacinamide',
    percentage: '4.00%',
    role: 'تقویت سد دفاعی و روشن‌کنندگی پوست',
    mechanism: 'تحریک بیوسنتز سرامیدها، اسیدهای چرب آزاد و مهار انتقال ملانوزوم‌ها به کراتینوسیت‌ها، مانع از قرمزی و التهاب بعد از لایه‌برداری می‌شود.',
    category: 'barrier',
  },
  {
    nameFa: 'اسید لاکتیک (Lactic Acid - AHA)',
    inci: 'Lactic Acid',
    percentage: '2.50%',
    role: 'لایه‌برداری بیوشیمیایی ملایم و تحریک NMF',
    mechanism: 'شکستن پیوندهای دسموزومی بین سلول‌های مرده در کنار ارتقای فاکتورهای مرطوب‌کننده طبیعی پوست (NMF) برای جلوگیری از دهیدراتاسیون پس از پولیش.',
    category: 'resurfacing',
  },
  {
    nameFa: 'بتائین طبیعی (Betaine Osmoprotectant)',
    inci: 'Betaine (Trimethylglycine)',
    percentage: '2.00%',
    role: 'حفظ تعادل اسمزی سلول‌های اپیدرم',
    mechanism: 'به عنوان اسموپروتکتور، مولکول‌های آب را درون سلول نگه داشته و از استرس ناشی از تماس با ذرات و تبخیر رطوبت جلوگیری می‌کند.',
    category: 'barrier',
  },
  {
    nameFa: 'زینک پی‌سی‌ای (Zinc PCA)',
    inci: 'Zinc PCA',
    percentage: '1.00%',
    role: 'کنترل چربی و مهار فلور باکتریایی مولد آکنه',
    mechanism: 'مهار آنزیم ۵-آلفا ردوکتاز جهت کاهش ترشح سبوم اضافه در منافذ باز همراه با اثر آنتی‌باکتریال علیه باکتری Cutibacterium acnes.',
    category: 'resurfacing',
  },
  {
    nameFa: 'ویتامین E استات (Tocopheryl Acetate)',
    inci: 'Tocopheryl Acetate',
    percentage: '0.80%',
    role: 'آنتی‌اکسیدان محافظ غشای لیپیدی',
    mechanism: 'به دام انداختن رادیکال‌های آزاد اکسیژن ناشی از اصطکاک و محافظت از چربی‌های بین‌سلولی استراتوم کورنئوم در برابر پراکسیداسیون.',
    category: 'barrier',
  },
  {
    nameFa: 'روغن آرگان خالص فشرده سرد (Argan Oil)',
    inci: 'Argania Spinosa Kernel Oil',
    percentage: '1.50%',
    role: 'روغن‌رسانی و بازسازی اسیدهای چرب امگا ۶ و ۹',
    mechanism: 'ایجاد یک فیلم نرم‌کننده محافظ بر سطح پوست حین مالش، کاهش ضریب سایش خشن و تغذیه سلول‌های تازه با اسید لینولئیک دارویی.',
    category: 'soothing',
  },
  {
    nameFa: 'کره شی‌باتر تصفیه‌شده (Shea Butter)',
    inci: 'Butyrospermum Parkii Butter',
    percentage: '2.00%',
    role: 'بافت کرمی مغذی و مانع افت رطوبت',
    mechanism: 'ایجاد بستر روان‌کننده لایه‌بردار جهت سرخوردن روان ذرات آلومینا روی بافت و مهار قرمزی زودگذر ناشی از شستشو.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره ریشه شیرین‌بیان (Licorice / Glabridin)',
    inci: 'Glycyrrhiza Glabra Root Extract',
    percentage: '0.70%',
    role: 'ضدالتهاب قوی و روشن‌کننده لک‌های موضعی',
    mechanism: 'ماده گلبریدین موجود در عصاره شیرین‌بیان مسیرهای تیروزیناز را مهار نموده و سیتوکین‌های پیش‌التهابی TNF-α و اینترلوکین را سرکوب می‌کند.',
    category: 'soothing',
  },
];

export function CrystaleneInteractiveSection() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'ingredients' | 'comparison' | 'protocol'>('simulator');
  const [intensityLevel, setIntensityLevel] = useState<1 | 2 | 3>(2);
  const [selectedIngredient, setSelectedIngredient] = useState<CrystaleneIngredient>(CRYSTALENE_INGREDIENTS[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const intensityMetrics = {
    1: {
      label: 'سطح ۱: پولیش ملایم ابریشمی (Gentle Buff)',
      duration: '۴۵ تا ۶۰ ثانیه با نوک انگشتان',
      target: 'پوست‌های حساس، کدر یا دارای مویرگ‌های سطحی نازک',
      depth: '۶ میکرومتر لایه‌برداری اپیدرم',
      roughness: '۲۸٪- کاهش ناهمواری و زبری',
      barrierSafety: '۹۹.۸٪ حفظ کامل سد دفاعی',
      turnover: '+۱۸٪ شتاب چرخه نوسازی سلولی',
    },
    2: {
      label: 'سطح ۲: لایروبی منافذ و پیگمانتاسیون (Pore Polish)',
      duration: '۹۰ تا ۱۲۰ ثانیه با حرکات دورانی مداوم',
      target: 'پوست‌های کدر، دارای کومدون سرسیاه و لکه‌های آفتاب',
      depth: '۱۴ میکرومتر پاکسازی لایه شاخی',
      roughness: '۴۸٪- کاهش ناهمواری و صافی چهره',
      barrierSafety: '۹۹.۲٪ حفظ بالینی چربی‌های میان‌سلولی',
      turnover: '+۳۸٪ تحریک تکثیر سلول‌های بازال',
    },
    3: {
      label: 'سطح ۳: میکرودرم بالینی سالنی (Clinical Resurfacing)',
      duration: '۲ تا ۳ دقیقه با تمرکز روی ناحیه T-Zone',
      target: 'پیش از تزریق و پروتکل‌های کربوکسی‌تراپی غیرتهاجمی',
      depth: '۲۴ میکرومتر سایش هدفمند شاخی',
      roughness: '۶۸٪- شفافیت و درخشش چشمگیر',
      barrierSafety: '۹۸.۶٪ ایمنی تست‌شده در ترایال کلینیکال',
      turnover: '+۵۵٪ افزایش سنتز فیبروبلاست‌ها',
    },
  }[intensityLevel];

  const faqs = [
    {
      q: 'تفاوت خمیر کریستالین با اسکراب‌های حاوی پودر هسته زردآلو یا پوسته گردو چیست؟',
      a: 'اسکراب‌های سنتی میوه دارای لبه‌های شکسته، تیز و ناصاف در مقیاس میکروسکوپی هستند که هنگام سایش باعث پارگی‌های بسیار ریز (Micro-tears) در سد دفاعی پوست شده و خطر باکتری و اگزما را بالا می‌برند. کریستالین از آلومینای خالص دارویی با لبه‌های مهندسی‌شده و کاملاً صیقلی استفاده می‌کند که بدون آسیب به چربی‌های پوست، تنها سلول‌های مرده را بلند می‌کند.',
    },
    {
      q: 'آیا برای پوست‌های مستعد آکنه قابل استفاده است؟',
      a: 'بله، برای کومدون‌ها و جوش‌های سرسیاه و زیرپوستی ایده‌آل است زیرا زینک PCA و اسید لاکتیک منافذ را لایروبی می‌کنند. با این حال، روی جوش‌های فعال ملتهب، چرکی و کیستیک نباید به صورت محکم ماساژ داده شود.',
    },
    {
      q: 'آیا بعد از کریستالین نیازی به ضدآفتاب است؟',
      a: 'قطعاً. لایه‌برداری سلول‌های کدر مرده باعث نمایان شدن لایه جوان و تازه پوست می‌شود. استفاده از ضدآفتاب با SPF50 و ترجیحاً مصرف ژل خنک‌کننده هیلین (Healene) بلافاصله پس از شستشو توصیه اکید می‌شود.',
    },
  ];

  return (
    <section className="cp-section" aria-label="بخش تعاملی بررسی تخصصی کریستالین">
      <div className="cp-section-header">
        <span className="cp-section-eyebrow">Interactive Clinical Dossier</span>
        <h2 className="cp-section-title">بررسی آزمایشگاهی و تعاملی خمیر پولیش Crystalene™</h2>
        <p className="cp-section-subtitle">
          مکانیسم عملکرد ذرات اکسید آلومینیوم میکرونی، غلظت ترکیبات فعال و نتایج بیومتریک تست‌های کلینیکی
        </p>
      </div>

      <div className="cp-interactive-box">
        {/* Navigation Tabs */}
        <div className="cp-interactive-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'simulator'}
            className={`cp-tab-btn emerald ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            🔬 شبیه‌ساز عمق سایش و سایش‌سنجی
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ingredients'}
            className={`cp-tab-btn emerald ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            🧪 آنالیز ۹ ترکیب فعال (Active INCI)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'comparison'}
            className={`cp-tab-btn emerald ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            ⚖️ مقایسه با اسکراب‌های سنتی و میکرودرم
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'protocol'}
            className={`cp-tab-btn emerald ${activeTab === 'protocol' ? 'active' : ''}`}
            onClick={() => setActiveTab('protocol')}
          >
            📋 پروتکل ۴ مرحله‌ای مصرف بالینی
          </button>
        </div>

        {/* Tab 1: Simulator */}
        {activeTab === 'simulator' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '12px' }}>
                شدت پروتکل پولیش را انتخاب کنید تا پارامترهای بیوفیزیکی پوست محاسبه شود:
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensityLevel(lvl as 1 | 2 | 3)}
                    style={{
                      flex: '1',
                      minWidth: '180px',
                      padding: '14px',
                      borderRadius: '12px',
                      background: intensityLevel === lvl ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: intensityLevel === lvl ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: intensityLevel === lvl ? '#34d399' : '#cbd5e1',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textAlign: 'right',
                    }}
                  >
                    <div>سطح {lvl}: {lvl === 1 ? 'ابریشمی ملایم' : lvl === 2 ? 'پاکسازی منافذ' : 'میکرودرم تخصصی'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                      {lvl === 1 ? 'برای پوست حساس و هفتگی ۲ بار' : lvl === 2 ? 'روتین استاندارد خانگی' : 'آماده‌سازی سالنی کربوکسی'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                  {intensityMetrics.label}
                </span>
                <span className="cp-badge-pill emerald">
                  مدت زمان مصرف: {intensityMetrics.duration}
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '20px' }}>
                <strong>اندیکاسیون هدف:</strong> {intensityMetrics.target}
              </div>

              <div className="cp-metrics-row" style={{ border: 'none', padding: 0 }}>
                <div className="cp-metric-box">
                  <div className="cp-metric-val">{intensityMetrics.depth}</div>
                  <div className="cp-metric-label">عمق سایش بدون لمس درم زنده</div>
                </div>
                <div className="cp-metric-box">
                  <div className="cp-metric-val">{intensityMetrics.roughness}</div>
                  <div className="cp-metric-label">کاهش ناهمواری و خطوط سطحی</div>
                </div>
                <div className="cp-metric-box">
                  <div className="cp-metric-val">{intensityMetrics.barrierSafety}</div>
                  <div className="cp-metric-label">شاخص یکپارچگی سد لیپیدی</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Ingredients INCI Explorer */}
        {activeTab === 'ingredients' && (
          <div>
            <div style={{ marginBottom: '20px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              فرمولاسیون کریستالین در داروسازی کمبریج بر پایه تلفیق سایش آلومینا با ترکیبات تقویت‌کننده سد دفاعی توسعه یافته است:
            </div>

            <div className="cp-ingredients-grid">
              {CRYSTALENE_INGREDIENTS.map((ing, idx) => (
                <div
                  key={idx}
                  className="cp-ingredient-card"
                  onClick={() => setSelectedIngredient(ing)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedIngredient.inci === ing.inci ? '#34d399' : undefined,
                  }}
                >
                  <div className="cp-ing-header">
                    <h3 className="cp-ing-name">{ing.nameFa}</h3>
                    <span className="cp-ing-pct">{ing.percentage}</span>
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

            {/* Selected Ingredient Highlight Drawer */}
            {selectedIngredient && (
              <div
                style={{
                  marginTop: '28px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#34d399', fontWeight: 900 }}>
                    {selectedIngredient.nameFa} ({selectedIngredient.percentage})
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

        {/* Tab 3: Comparison Matrix */}
        {activeTab === 'comparison' && (
          <div className="cp-compare-grid">
            {/* Traditional Scrubs */}
            <div className="cp-compare-card">
              <span className="cp-compare-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                اسکراب‌های خشن سنتی
              </span>
              <h3 className="cp-compare-title">پودر هسته زردآلو و گردو</h3>
              <ul className="cp-compare-list">
                <li>❌ لبه‌های ناصاف و زاویه‌دار در ابعاد بزرگ (۱۵۰ تا ۳۰۰ میکرون)</li>
                <li>❌ ایجاد خراش‌های میکروسکوپی در سطح پوست (Micro-tears)</li>
                <li>❌ تشدید قرمزی، سوزش و آسیب به لایه‌های لیپیدی</li>
                <li>❌ عدم سازگاری با پوست حساس و پیلینگ</li>
              </ul>
            </div>

            {/* Crystalene Polish Paste */}
            <div className="cp-compare-card highlight emerald">
              <span className="cp-compare-badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', borderColor: '#34d399' }}>
                فرمولاسیون اختصاصی دکتر درمر
              </span>
              <h3 className="cp-compare-title">Crystalene Polish Paste</h3>
              <ul className="cp-compare-list">
                <li>✓ میکروکریستال‌های آلومینای بیواینرت با لبه‌های مهندسی‌شده و صیقلی</li>
                <li>✓ اندازه ذرات همگن ۴۰ تا ۵۰ میکرومتر بدون خط و خش</li>
                <li>✓ هم‌افزایی با نیاسینامید، اسید لاکتیک، بتائین و زینک PCA</li>
                <li>✓ بدون چربی سنگین؛ تغذیه شده با روغن آرگان و شی‌باتر</li>
                <li>✓ آماده‌کننده پوست برای اثر بوهر و پروتکل‌های کربوکسی</li>
              </ul>
            </div>

            {/* Diamond Suction Microderm */}
            <div className="cp-compare-card">
              <span className="cp-compare-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                میکرودرم ابریژن دستگاهی
              </span>
              <h3 className="cp-compare-title">دستگاه‌های مکش پودری / الماسی</h3>
              <ul className="cp-compare-list">
                <li>⚠️ ایجاد کشش مکانیکی و خطر پارگی مویرگ‌های تلانژکتازی</li>
                <li>⚠️ هزینه بالا به ازای هر جلسه در کلینیک</li>
                <li>⚠️ نیاز به ضدعفونی مداوم پروب و تیپ‌ها</li>
                <li>⚠️ عدم امکان استفاده آسان در روتین خانگی</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Step-by-Step Protocol */}
        {activeTab === 'protocol' && (
          <div className="cp-protocol-steps">
            <div className="cp-protocol-step-card">
              <div className="cp-step-num emerald">01</div>
              <div className="cp-step-content">
                <h4>مرحله اول: تمیزکاری اولیه و آماده‌سازی با آب ولرم</h4>
                <p>
                  آرایش و آلودگی‌های سطحی را پاک کرده و صورت را با آب ولرم مرطوب نمایید. رطوبت پوست برای باز شدن منافذ و روان شدن حرکت کریستال‌ها ضروری است.
                </p>
              </div>
            </div>

            <div className="cp-protocol-step-card">
              <div className="cp-step-num emerald">02</div>
              <div className="cp-step-content">
                <h4>مرحله دوم: اپلیکیشن و ماساژ دورانی با نوک انگشتان</h4>
                <p>
                  به اندازه یک بند انگشت از خمیر کریستالین را روی پیشانی، بینی، گونه‌ها و چانه قرار دهید. با حرکات دورانی بسیار ملایم و بدون فشار دست، به مدت ۱ تا ۲ دقیقه پوست را ماساژ دهید.
                </p>
              </div>
            </div>

            <div className="cp-protocol-step-card">
              <div className="cp-step-num emerald">03</div>
              <div className="cp-step-content">
                <h4>مرحله سوم: آبکشی کامل با آب خنک یا ولرم</h4>
                <p>
                  خمیر را با آب فراوان کاملاً بشویید تا کلیه ذرات میکرونی آلومینا از سطح چهره برداشته شوند. با یک حوله تمیز و پنبه‌ای به صورت ضربه‌ای پوست را خشک کنید.
                </p>
              </div>
            </div>

            <div className="cp-protocol-step-card">
              <div className="cp-step-num emerald">04</div>
              <div className="cp-step-content">
                <h4>مرحله چهارم: مرحله تسکین و ترمیم با ژل هیلین (Healene)</h4>
                <p>
                  بلافاصله پس از شستشو، لایه‌ای از ژل تسکین‌بخش هیلین (Healene) روی پوست قرار دهید تا پانتنول، هیالورونیک اسید و کمپلکس عصاره‌های گیاهی سد دفاعی را بازسازی کنند.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clinical FAQ Accordion */}
      <div style={{ marginTop: '56px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>
          پرسش‌های متداول درماتولوژی درباره خمیر کریستالین
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
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#34d399' }}>
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
