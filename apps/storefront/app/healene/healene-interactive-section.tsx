'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface HealeneIngredient {
  nameFa: string;
  inci: string;
  role: string;
  mechanism: string;
  category: 'barrier' | 'soothing' | 'hydration';
}

const HEALENE_INGREDIENTS: HealeneIngredient[] = [
  {
    nameFa: 'نیاسینامید دارویی (Vitamin B3)',
    inci: 'Niacinamide',
    role: 'مهار سایتوکین‌های التهابی و یکنواخت‌سازی تن پوست',
    mechanism: 'مهار بیان اینترلوکین‌های IL-6 و IL-8 و آنزیم COX-2، کاهش واکنش‌های واسکولار و گرگرفتگی، تقویت سنتز سرامیدها در کراتینوسیت‌ها.',
    category: 'barrier',
  },
  {
    nameFa: 'پانتنول پروویتامین B5 (D-Panthenol)',
    inci: 'Panthenol',
    role: 'بازسازی سریع اپیدرم و رفع سوزش بافت',
    mechanism: 'تبدیل سریع به کوآنزیم A، تحریک تکثیر فیبروبلاست‌ها و اپیتلیزاسیون مجدد در لایه‌های آسیب‌دیده، ایجاد رطوبت پایدار غیرچرب.',
    category: 'barrier',
  },
  {
    nameFa: 'هیالورونیک اسید چندوزنی (Multi-Weight HA)',
    inci: 'Sodium Hyaluronate',
    role: 'هیدراتاسیون ۲ سطحی (سطحی و ترنس‌اپیدرمال)',
    mechanism: 'زنجیره‌های با وزن مولکولی بالا یک لایه محافظ رطوبت الاستیک بر سطح پوست تشکیل داده و زنجیره‌های ریز نانو به لایه خاردار نفوذ می‌کنند.',
    category: 'hydration',
  },
  {
    nameFa: 'آلانتوئین خالص دارویی (Allantoin)',
    inci: 'Allantoin',
    role: 'کراتولیتیک فیزیولوژیک و تسکین سوزش عصب‌های حسی',
    mechanism: 'کاهش حساسیت گیرنده‌های درد پوستی، کمک به لایه‌برداری بسیار ملایم سلول‌های پوسته پوسته شده پس از التهاب و نرمی فوری.',
    category: 'soothing',
  },
  {
    nameFa: 'سدیم پی‌سی‌ای (Sodium PCA)',
    inci: 'Sodium PCA',
    role: 'عنصر کلیدی فاکتور مرطوب‌کننده طبیعی (NMF)',
    mechanism: 'دارای قابلیت جذب آب تا ۲۵۰ برابر وزن مولکولی خود، بازگرداننده طبیعی‌ترین هیدراتاسیون پوست بدون ایجاد حس چربی یا چسبندگی.',
    category: 'hydration',
  },
  {
    nameFa: 'عصاره برگ آلوئه‌ورا (Aloe Barbadensis)',
    inci: 'Aloe Barbadensis Leaf Juice',
    role: 'خنک‌کنندگی فوری و سرکوب اریتمای حرارتی',
    mechanism: 'سرشار از پلی‌ساکاریدهای آسمانان (Acemannan) با اثر سینرژیک در کاهش دمای موضعی پوست و تسریع ترمیم بافت سوخته یا تحریک‌شده.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره سنتلا آسیاتیکا (Centella Asiatica / Cica)',
    inci: 'Centella Asiatica Extract (Madecassoside)',
    role: 'تحریک کلاژن‌سازی نوع اول و تقویت دیواره مویرگ‌ها',
    mechanism: 'حاوی مادکاسوزید و آسیاتیکوزید خالص، تقویت گردش خون میکروواسکولار، مهار التهاب مزمن و رفع لک‌های قرمز ناشی از درمان‌های تهاجمی.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره گل همیشه‌بهار (Calendula Officinalis)',
    inci: 'Calendula Officinalis Flower Extract',
    role: 'کاهش نفوذپذیری مویرگی و پیشگیری از ادم',
    mechanism: 'فلاونوئیدها و استرهای تری‌ترپنوئید موجود در کالاندولا التهاب مویرگی و قرمزی اریتما را مهار نموده و احساس کشیدگی پوست را مرتفع می‌سازند.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره پوست درخت میموزا (Mimosa Tenuiflora)',
    inci: 'Mimosa Tenuiflora Bark Extract',
    role: 'ترمیم‌کننده کلاسیک پزشکی سوختگی و ضایعات تروماتیک',
    mechanism: 'معروف به "درخت پوست" (Skin Tree) غنی از تانن‌ها، فلاونوئیدها و میکروالمان‌های فعال که تکثیر کراتینوسیت‌ها را تا ۴۰٪ تسریع می‌بخشند.',
    category: 'barrier',
  },
  {
    nameFa: 'عصاره میوه آسای (Acai Fruit Extract)',
    inci: 'Euterpe Oleracea Fruit Extract',
    role: 'سوپر آنتی‌اکسیدان قوی با شاخص ORAC بالا',
    mechanism: 'خنثی‌کننده استرس‌های اکسیداتیو ناشی از اشعه UV و انرژی‌های نوری/حرارتی لیزر، مهار پراکسیداسیون چربی‌های غشای سلول.',
    category: 'barrier',
  },
  {
    nameFa: 'عصاره بابونه آلمانی (Chamomilla Recutita)',
    inci: 'Chamomilla Recutita Flower Extract',
    role: 'آرام‌بخش عصبی-حسی پوست‌های ملتهب و واکنش‌پذیر',
    mechanism: 'آلفا-بیزابولول و کامازولن طبیعی به عنوان عوامل ضداسپاسم مویرگی و مهارکننده هیستامین در پوست عمل می‌کنند.',
    category: 'soothing',
  },
  {
    nameFa: 'عصاره ریشه شیرین‌بیان (Licorice / Glabridin)',
    inci: 'Glycyrrhiza Glabra Root Extract',
    role: 'مهار گرگرفتگی، پیگمانتاسیون PIH و روشن‌کننده',
    mechanism: 'ترکیب فعال گلیسیریزین مانع از آزادسازی آراشیدونیک اسید شده و گلبریدین از بروز لکه‌های قهوه‌ای پس از التهاب جلوگیری به عمل می‌آورد.',
    category: 'soothing',
  },
];

export function HealeneInteractiveSection() {
  const [activeTab, setActiveTab] = useState<'recovery' | 'ingredients' | 'indications' | 'cooling'>('recovery');
  const [timeStep, setTimeStep] = useState<0 | 10 | 30 | 1440>(30);
  const [selectedIngredient, setSelectedIngredient] = useState<HealeneIngredient>(HEALENE_INGREDIENTS[1]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const recoveryMetrics = {
    0: {
      title: 'لحظه اپلیکیشن (Immediate Post-Treatment)',
      temp: 'کاهش ۳.۲- درجه سانتی‌گراد',
      erythema: 'شروع تسکین گرگرفتگی',
      tewl: 'قفل شدن فیلم رطوبت هیالورونیک',
      desc: 'احساس خنکی خوشایند ناشی از ژل کریستالی آلوئه‌ورا و سنتلا، رفع سوزش تیز اولیه.',
    },
    10: {
      title: '۱۰ دقیقه پس از جذب اولیه',
      temp: 'پایداری دمای نرمال فیزیولوژیک',
      erythema: '۳۴٪- کاهش قرمزی و لکه‌های تهاجمی',
      tewl: 'نفوذ پانتنول به استراتوم ژرمیناتیووم',
      desc: 'مهار مسیرهای التهابی اینترلوکین و آرامش کامل بافت‌های تحت استرس.',
    },
    30: {
      title: '۳۰ دقیقه پس از درمان',
      temp: 'دمای خنک و باطراوت بدون بازگشت حرارت',
      erythema: '۶۱٪- افت چشمگیر اریتما و التهاب',
      tewl: '۴۲٪+ افزایش ظرفیت نگهداری آب',
      desc: 'حالت مخملی و ارتجاعی بدون کمترین چسبندگی یا چربی، آماده برای ضدآفتاب یا استراحت.',
    },
    1440: {
      title: '۲۴ ساعت پس از روتین',
      temp: 'تعادل کامل بیودینامیک پوست',
      erythema: '۸۸٪- پاکسازی کامل سرخی و واکنش‌ها',
      tewl: '۸۴٪+ بازسازی ساختار سرامیدی سد دفاعی',
      desc: 'عدم ایجاد پوسته‌ریزی نامنظم، شفافیت یکنواخت و آماده برای ادامه جلسات درمانی.',
    },
  }[timeStep];

  const faqs = [
    {
      q: 'آیا ژل هیلین برای دور چشم قابل استفاده است؟',
      a: 'بله، فرمولاسیون فاقد عطر و اسانس، فاقد چربی و دارای pH فیزیولوژیک هیلین به طور ویژه برای تسکین پف، تیرگی و حساسیت پلک‌ها و ناحیه اطراف چشم مناسب و تست‌شده است.',
    },
    {
      q: 'چند بار در طول روز می‌توان از ژل هیلین استفاده کرد؟',
      a: 'استفاده از هیلین هیچ محدودیتی ندارد. در روزهای اول پس از لیزر، پیلینگ یا کربوکسی‌تراپی، تجدید مصرف ۳ الی ۴ بار در روز تا رفع کامل قرمزی و سوزش اکیداً توصیه می‌شود.',
    },
    {
      q: 'آیا می‌توان ژل هیلین را در یخچال نگهداری کرد؟',
      a: 'بله! نگهداری بطری پمپی هیلین در دمای خنک یخچال اثر خنک‌کنندگی، انقباض عروق متسع‌شده مویرگی و سرکوب پف را دوچندان می‌کند.',
    },
  ];

  return (
    <section className="cp-section" aria-label="بخش تعاملی ژل تسکین‌بخش هیلین">
      <div className="cp-section-header">
        <span className="cp-section-eyebrow cyan">CLINICAL SOOTHING TELEMETRY</span>
        <h2 className="cp-section-title">بررسی علمی و فارماکولوژی ژل هیلین Healene™</h2>
        <p className="cp-section-subtitle">
          سرعت خنک‌کنندگی، ترمیم زخم بدون اسکار و بررسی تخصصی ۱۲ ماده مؤثره فعال دارویی
        </p>
      </div>

      <div className="cp-interactive-box">
        {/* Navigation Tabs */}
        <div className="cp-interactive-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'recovery'}
            className={`cp-tab-btn cyan ${activeTab === 'recovery' ? 'active' : ''}`}
            onClick={() => setActiveTab('recovery')}
          >
            ⏱️ شبیه‌ساز تایم‌لاین ریکاوری پوست
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ingredients'}
            className={`cp-tab-btn cyan ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            🌿 پرونده ۱۲ ترکیب تسکین‌بخش (Active INCI)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'indications'}
            className={`cp-tab-btn cyan ${activeTab === 'indications' ? 'active' : ''}`}
            onClick={() => setActiveTab('indications')}
          >
            🏥 اندیکاسیون‌های بالینی (Post-Procedure)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cooling'}
            className={`cp-tab-btn cyan ${activeTab === 'cooling' ? 'active' : ''}`}
            onClick={() => setActiveTab('cooling')}
          >
            ❄️ مکانیسم ترمودینامیک خنک‌سازی
          </button>
        </div>

        {/* Tab 1: Recovery Timeline Simulator */}
        {activeTab === 'recovery' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '12px' }}>
                بازه زمانی ریکاوری را انتخاب کنید تا پاسخ فیزیولوژیک بافت پوست را مشاهده نمایید:
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { step: 0, label: 'لحظه مصرف (۰ دقیقه)' },
                  { step: 10, label: '۱۰ دقیقه بعد' },
                  { step: 30, label: '۳۰ دقیقه بعد' },
                  { step: 1440, label: '۲۴ ساعت بعد' },
                ].map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setTimeStep(item.step as 0 | 10 | 30 | 1440)}
                    style={{
                      flex: '1',
                      minWidth: '150px',
                      padding: '14px',
                      borderRadius: '12px',
                      background: timeStep === item.step ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: timeStep === item.step ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: timeStep === item.step ? '#38bdf8' : '#cbd5e1',
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
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  {recoveryMetrics.title}
                </span>
                <span className="cp-badge-pill cyan">ارزیابی اولتراسونوگرافی درم</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.8', margin: '0 0 20px' }}>
                {recoveryMetrics.desc}
              </p>

              <div className="cp-metrics-row" style={{ border: 'none', padding: 0 }}>
                <div className="cp-metric-box">
                  <div className="cp-metric-val cyan">{recoveryMetrics.temp}</div>
                  <div className="cp-metric-label">دمای سطحی اپیدرم</div>
                </div>
                <div className="cp-metric-box">
                  <div className="cp-metric-val cyan">{recoveryMetrics.erythema}</div>
                  <div className="cp-metric-label">شاخص قرمزی اریتما</div>
                </div>
                <div className="cp-metric-box">
                  <div className="cp-metric-val cyan">{recoveryMetrics.tewl}</div>
                  <div className="cp-metric-label">آبرسانی و سد ترنس‌اپیدرمال</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 12 Active Ingredients */}
        {activeTab === 'ingredients' && (
          <div>
            <div style={{ marginBottom: '20px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              فرمول هیلین از ۱۲ اکتیو هم‌افزا با خلوص بالا برای تسریع مسیرهای ترمیم بیومتریک بافت بهره می‌برد:
            </div>

            <div className="cp-ingredients-grid">
              {HEALENE_INGREDIENTS.map((ing, idx) => (
                <div
                  key={idx}
                  className="cp-ingredient-card cyan"
                  onClick={() => setSelectedIngredient(ing)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedIngredient.inci === ing.inci ? '#38bdf8' : undefined,
                  }}
                >
                  <div className="cp-ing-header">
                    <h3 className="cp-ing-name">{ing.nameFa}</h3>
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
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#38bdf8', fontWeight: 900 }}>
                    {selectedIngredient.nameFa}
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

        {/* Tab 3: Post-Procedure Indications */}
        {activeTab === 'indications' && (
          <div className="indications-grid">
            <div className="indication-card cyan">
              <div className="indication-header">
                <div className="indication-icon cyan">01</div>
                <h3 className="indication-title">پس از کربوکسی‌تراپی و CarboxyGel</h3>
              </div>
              <p className="indication-desc">
                تثبیت اکسیژن آزادشده ناشی از اثر بوهر، هیدراته نگه‌داشتن ماتریکس خارج‌سلولی و تغذیه بافت تازه اکسیژن‌گرفته.
              </p>
              <div className="indication-protocol cyan">پروتکل: لایه نازک بلافاصله پس از شستشوی ژل کربوکسی</div>
            </div>

            <div className="indication-card cyan">
              <div className="indication-header">
                <div className="indication-icon cyan">02</div>
                <h3 className="indication-title">پس از لیزرهای ابلیتیو و فرکشنال</h3>
              </div>
              <p className="indication-desc">
                کاهش سریع حرارت باقی‌مانده در درم، مهار سوختگی ثانویه و تسریع روند دلمه‌بندی و پوست‌اندازی منظم بدون اسکار.
              </p>
              <div className="indication-protocol cyan">پروتکل: ۳ بار در روز طی ۷۲ ساعت اولیه</div>
            </div>

            <div className="indication-card cyan">
              <div className="indication-header">
                <div className="indication-icon cyan">03</div>
                <h3 className="indication-title">پس از میکرونیدلینگ و مزوتراپی</h3>
              </div>
              <p className="indication-desc">
                بستن میکروکانال‌های باز پوستی با سد محافظت استریل، رفع سوزش نقاط ورود سوزن و مهار پاسخ التهابی اغراق‌آمیز.
              </p>
              <div className="indication-protocol cyan">پروتکل: اپلیکیشن بدون ماساژ شدید</div>
            </div>

            <div className="indication-card cyan">
              <div className="indication-header">
                <div className="indication-icon cyan">04</div>
                <h3 className="indication-title">آفتاب‌سوختگی و استرس محیطی</h3>
              </div>
              <p className="indication-desc">
                رفع سوزش و قرمزی ناشی از تابش خورشید، بادهای خشک و سرمای کوهستانی، بازسازی لایه سطحی NMF با سدیم PCA و آلوئه‌ورا.
              </p>
              <div className="indication-protocol cyan">پروتکل: مصرف خنک‌شده در یخچال</div>
            </div>
          </div>
        )}

        {/* Tab 4: Thermodynamic Cooling */}
        {activeTab === 'cooling' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 800, margin: '0 0 12px' }}>
                مکانیسم انتقال حرارت تبخیری بدون خشکی
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>
                فرمولاسیون هیلین بر پایه شبکه ژلی پیوندخورده با پلیمرهای آلی آبدوست شکل گرفته است. این شبکه مولکول‌های آب آزاد را
                به آرامی در دمای ۳۲ تا ۳۵ درجه پوست تبخیر نموده و گرمای نهان تبخیر را از بافت جذب می‌کند، بدون اینکه رطوبت طبیعی سلول‌ها را بیرون بکشد.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 800, margin: '0 0 12px' }}>
                عدم ایجاد سد انسدادی چرب (Zero Occlusive Lipids)
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>
                بر خلاف پمادهای سنگین وازلینی که گرمای بافت را محبوس کرده و باعث تشدید التهاب و جوش‌های میلیایی می‌شوند،
                هیلین ۱۰۰٪ فاقد فاز چربی سنگین بوده و به پوست اجازه تنفس کامل، تبادل گازی و خنک‌سازی فیزیولوژیک را می‌دهد.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FAQs */}
      <div style={{ marginTop: '56px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>
          پرسش‌های متداول پزشکان و بیماران درباره ژل هیلین
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
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#38bdf8' }}>
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
