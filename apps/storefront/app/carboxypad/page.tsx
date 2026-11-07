"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./carboxypad.css";
import { useCart } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";

/* ── Types ── */
interface AnatomicalZone {
  id: string;
  nameFa: string;
  nameEn: string;
  cutGeometry: string;
  coverage: string;
  targetDepth: string;
  indication: string;
  clinicalAction: string;
}

interface ReactionPhase {
  id: number;
  titleFa: string;
  titleEn: string;
  duration: string;
  summary: string;
  highlightText: string;
  bubbleDensity: "low" | "medium" | "high" | "peak";
}

interface PadVariant {
  id: string;
  sku: string;
  title: string;
  packCount: number;
  sizeDesc: string;
  priceAmount: string; // in IRR
  originalPriceAmount?: string;
  badge?: string;
  recommendedFor: string;
}

/* ── Data: 5 Anatomical Pre-Cut Zones ── */
const ANATOMICAL_ZONES: AnatomicalZone[] = [
  {
    id: "forehead",
    nameFa: "ناحیه پیشانی و خطوط اخم",
    nameEn: "Frontal & Glabellar Zone",
    cutGeometry: "قوس ارگونومیک فوقانی با برش‌های کاهش تنش سطحی (Tension-Relief Slits)",
    coverage: "پوشش سراسری عضله فرونتالیس تا لبه رویش مو و خطوط اخم گلابلا",
    targetDepth: "درم پاپیلاری و رتیکولار (۱.۲ تا ۱.۸ میلی‌متر)",
    indication: "خطوط افقی پیشانی، خط اخم ناشی از انقباض مداوم، دهیدراتاسیون اپیدرمی",
    clinicalAction:
      "تثبیت تماس کامل شیت بدون حباب هوا، نفوذ یکنواخت گاز CO₂ و تحریک ترشح اکسیژن برای شل‌شدن میکروتنش‌های عضلانی و آبرسانی عمقی.",
  },
  {
    id: "cheeks",
    nameFa: "گونه‌ها، قوس مالار و منافذ مرکزی",
    nameEn: "Malar & Zygomatic Cheeks",
    cutGeometry: "پنل‌های بالدار ارگونومیک سازگار با برآمدگی طبیعی استخوان زیگوماتیک",
    coverage: "سطح برجسته گونه‌ها، خطوط پنجه‌کلاغی جانبی و ناحیه میانی صورت (Midface)",
    targetDepth: "درم میانی و شبکه عروق مویرگی سطحی (۱.۵ تا ۲.۰ میلی‌متر)",
    indication: "منافذ اتساع‌یافته، ملاسما و لک‌های منتشر، کدری بافت ناشی از هیپوکسی",
    clinicalAction:
      "ایجاد محفظه پرفشار گاز دی‌اکسید کربن که با متراکم‌کردن جریان خون مویرگی، بازجذب پیگمانتاسیون و انقباض کلاژنی اطراف دهانه منافذ را تسریع می‌کند.",
  },
  {
    id: "nose",
    nameFa: "پل، کناره‌ها و پره‌های بینی",
    nameEn: "Nasal Bridge & Lateral Ala",
    cutGeometry: "شکاف ارگونومیک سه‌بعدی برای نشست کامل روی تیغه و بال‌های بینی",
    coverage: "پل استخوانی، غضروف جانبی و پره‌های خارجی بدون ایجاد فاصله هوایی",
    targetDepth: "اپیدرم و درم سطحی غنی از غدد سباسه (۰.۸ تا ۱.۲ میلی‌متر)",
    indication: "کومدون‌های سرسیاه اکسیدشده، چربی مازاد موضعی و زبری بافتی تی-زون",
    clinicalAction:
      "نفوذ گاز حل‌شده در فاز ژل به دهانه فولیکول‌ها، تخلیه آلودگی‌ها و تعدیل متابولیک ترشح سبوم همزمان با لایه‌برداری شیمیایی ملایم سیتریک اسید.",
  },
  {
    id: "chin",
    nameFa: "اطراف دهان، خطوط خنده و چانه",
    nameEn: "Perioral & Mentalis Area",
    cutGeometry: "بریدگی دقیق برای روزنه لب‌ها با زبانه اتصالی محکم زیر لب پایینی",
    coverage: "چین نازولبیال، خطوط ماریونت اطراف زاویه لب و عضله منتالیس چانه",
    targetDepth: "اتصالات درمو-اپیدرمال و بافت فیبروزه پیرامون دهان (۱.۴ تا ۲.۲ میلی‌متر)",
    indication: "خطوط عمقی خنده، افتادگی گوشه‌های لب و ناهمواری بافت چانه",
    clinicalAction:
      "تحریک فیبروبلاست‌های عمقی جهت سنتز هیالورونان و پروکلاژن، بازگرداندن حجم الاستیک و صاف‌کردن چین‌های دینامیک اطراف دهان.",
  },
  {
    id: "neck",
    nameFa: "ناحیه ساب‌منتال (غبغب) و زاویه گردن",
    nameEn: "Submental & Cervical Neck Area",
    cutGeometry: "شیت مستقل هلالی عریض با زوایای کششی جهت کانتورینگ ارگونومیک فک و گردن",
    coverage: "ناحیه چربی زیر چانه (Submental Fat)، زاویه خط فک و نوار عضلانی پلاتیسما",
    targetDepth: "درم عمقی و بافت همبند چربی زیرجلدی (۲.۰ تا ۴.۰ میلی‌متر)",
    indication: "شلی و افتادگی پوست گردن (Neck Laxity)، خطوط افقی، غبغب و کاهش زاویه فک",
    clinicalAction:
      "بهبود شدید درناژ لنفاوی، تسریع متابولیسم لیپولیز چربی‌های انباشته، تحریک متراکم فیبرهای الاستین و سفت‌کردن محسوس غلاف پلاتیسما بدون نیاز به جراحی.",
  },
];

/* ── Data: 4 Reaction Chemical Mechanism Phases ── */
const REACTION_PHASES: ReactionPhase[] = [
  {
    id: 1,
    titleFa: "۱. برقراری تماس و انحلال کریستال‌ها",
    titleEn: "Contact & Crystal Dissolution",
    duration: "ثانیه‌های ۱ تا ۱۰",
    summary:
      "پد CarboxyPad حاوی اسید سیتریک میکروکریستالی خشک گرید پزشکی روی لایه ژل CarboxyGel حاوی بی‌کربنات سدیم قرار می‌گیرد. با فشردن ملایم دست، رطوبت ژل کریستال‌های اسید را حل کرده و واکنش کاتالیزوری اسید-باز بی‌درنگ کلید می‌خورد.",
    highlightText: "آغاز انحلال اسید سیتریک خشک در فاز پایه سدیم بی‌کربنات",
    bubbleDensity: "low",
  },
  {
    id: 2,
    titleFa: "۲. جوشش پرفشار و محفظه به دام‌انداز",
    titleEn: "Occlusive Trapping Chamber",
    duration: "دقیقه‌های ۱ تا ۵",
    summary:
      "واکنش شیمیایی گاز دی‌اکسید کربن (CO₂) آزاد می‌کند. الیاف سلولزی نبافته (Non-Woven Matrix) به عنوان یک سد فیزیکی عمل کرده و مانع از هدررفت و فرار گاز به اتمسفر می‌شوند. این محفظه بسته، غلظت CO₂ محلول بر سطح پوست را به بالای ۱۰۰۰ppm می‌رساند.",
    highlightText: "به دام انداختن گاز توسط الیاف نبافته و ایجاد فشار مثبت سطحی",
    bubbleDensity: "high",
  },
  {
    id: 3,
    titleFa: "۳. نفوذ ترنس‌درمال گاز دی‌اکسید کربن",
    titleEn: "Forced Transdermal Penetration",
    duration: "دقیقه‌های ۵ تا ۱۵",
    summary:
      "گرادیان فشار اسمزی و غلظت بالای CO₂، مولکول‌های ریز گاز را مجبور می‌کند تا از لایه شاخی (Stratum Corneum) عبور کرده و به درون درم زنده و بستر مویرگی میکروواسکولار نفوذ کنند.",
    highlightText: "عبور فیزیکی CO₂ از سد شاخی بدون نیاز به سرسوزن یا نیدلینگ",
    bubbleDensity: "peak",
  },
  {
    id: 4,
    titleFa: "۴. القای اثر بوهر و تخلیه اکسیژن",
    titleEn: "Bohr Effect & Capillary Surge",
    duration: "دقیقه‌های ۱۵ تا ۲۰+",
    summary:
      "با افزایش اسیدیته موضعی ناشی از ورود CO₂، میل ترکیبی هموگلوبین به اکسیژن ناگهان افت می‌کند. گلبول‌های قرمز مقادیر عظیمی اکسیژن خالص آزاد می‌کنند که سبب اتساع فوری مویرگ‌ها (Vasodilation)، تقویت جریان خون و تغذیه سلولی شدید می‌گردد.",
    highlightText: "افزایش تا ۴۵ درصدی اشباع اکسیژن درونی بافت و نوسازی کلاژن",
    bubbleDensity: "medium",
  },
];

/* ── Data: 2 Product Purchase Variants ── */
const CARBOXYPAD_VARIANTS: PadVariant[] = [
  {
    id: "var_cpad_20x",
    sku: "DD-PAD-20X",
    title: "بسته ۲۰ عددی صورت و گردن CarboxyPad™",
    packCount: 20,
    sizeDesc: "شامل ۲۰ شیت کامل صورت + ۲۰ شیت مستقل گردن و غبغب (مجموعاً ۴۰ پد تخصصی)",
    priceAmount: "14000000", // 1,400,000 Tomans
    originalPriceAmount: "16500000",
    badge: "پک مصرفی استاندارد",
    recommendedFor: "دوره‌های درمان کلینیکال و روتین ماهیانه مراقبت در منزل",
  },
  {
    id: "var_cpad_50x",
    sku: "DD-PAD-50X",
    title: "باکس کلینیکال ۵۰ عددی ویژه مراکز درمانی",
    packCount: 50,
    sizeDesc: "شامل ۵۰ شیت کامل صورت + ۵۰ شیت گردن در بسته‌بندی اقتصادی سالنی",
    priceAmount: "31000000", // 3,100,000 Tomans
    originalPriceAmount: "37000000",
    badge: "تخفیف همکاری مطب",
    recommendedFor: "پزشکان، کلینیک‌های پوست، مو و زیبایی و مراکز درماتولوژی",
  },
];

export default function CarboxypadPage() {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();

  // Active States
  const [selectedZone, setSelectedZone] = useState<string>("neck");
  const [activePhase, setActivePhase] = useState<number>(2);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("var_cpad_20x");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Active items lookup
  const currentZone = ANATOMICAL_ZONES.find((z) => z.id === selectedZone) ?? ANATOMICAL_ZONES[4];
  const currentPhase = REACTION_PHASES.find((p) => p.id === activePhase) ?? REACTION_PHASES[1];
  const currentVariant = CARBOXYPAD_VARIANTS.find((v) => v.id === selectedVariantId) ?? CARBOXYPAD_VARIANTS[0];

  // Cart Handler
  const handleAddToCart = () => {
    addItem(
      {
        variantId: currentVariant.id,
        productId: "prod_drdermer_003",
        title: currentVariant.title,
        sku: currentVariant.sku,
        priceAmount: currentVariant.priceAmount,
        image: "/assets/drdermer/2025/07/carboxypad-1024x198.png",
      },
      quantity
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      openDrawer();
    }, 800);
  };

  return (
    <div className="carboxypad-page">
      <div className="cpad-ambient-glow" />

      <div className="cpad-container">
        {/* Top Breadcrumbs & Regulatory Pill */}
        <div className="cpad-top-nav">
          <div className="cpad-breadcrumbs">
            <Link href="/">صفحه نخست</Link>
            <span>/</span>
            <Link href="/reeskin">لاین درموسوتیکال ReeSkin™</Link>
            <span>/</span>
            <span style={{ color: "#ffffff", fontWeight: 700 }}>CarboxyPad™ Activator</span>
          </div>
          <div className="cpad-reg-badge">
            <span className="cpad-reg-dot" />
            <span>گرید دارویی الیاف نبافته | استاندارد CE Medical Class I اروپا</span>
          </div>
        </div>

        {/* ── Hero Section ── */}
        <section className="cpad-hero-grid">
          {/* Right Column (Text in RTL) */}
          <div className="cpad-hero-content">
            <div className="cpad-step-pill">
              <span className="cpad-step-num">STEP 02</span>
              <span>سیستم فعال‌ساز آلکالاین غیرتهاجمی صورت و گردن</span>
            </div>

            <div className="cpad-hero-titles">
              <h1>
                پدهای فعال‌ساز آلکالاین صورت و گردن{" "}
                <span className="highlight">ReeSkin CarboxyPad™</span>
              </h1>
              <p className="subtitle-en">Step 2: Alkaline Activator Pads for Face & Neck</p>
            </div>

            <p className="cpad-lead-text">
              شیت‌های پیش‌برش‌خورده ارگونومیک با الیاف سلولزی نبافته و لایه اسید سیتریک میکروکریستالی خشک.
              این پدها با قرارگیری بر روی لایه ژل کربوکسی، گاز دی‌اکسید کربن تولیدشده را در محفظه‌ای کاملاً
              بسته به دام انداخته و مانع از هدررفت سطحی آن می‌شوند؛ در نتیجه گاز پرفشار مجبور به نفوذ عمقی ترنس‌درمال
              و القای شدید اثر فیزیولوژیک بوهر (Bohr Effect) می‌گردد.
            </p>

            {/* Telemetry Metrics Bar */}
            <div className="cpad-telemetry-row">
              <div className="cpad-metric-item">
                <span className="cpad-metric-val">&gt; 1000</span>
                <span className="cpad-metric-lbl">غلظت CO₂ موضعی (ppm)</span>
              </div>
              <div className="cpad-metric-item">
                <span className="cpad-metric-val">100%</span>
                <span className="cpad-metric-lbl">پوشش صورت و خط گردن</span>
              </div>
              <div className="cpad-metric-item">
                <span className="cpad-metric-val">0 needle</span>
                <span className="cpad-metric-lbl">نفوذ ترنس‌درمال بدون سوزن</span>
              </div>
              <div className="cpad-metric-item">
                <span className="cpad-metric-val">+45%</span>
                <span className="cpad-metric-lbl">افزایش اکسیژن‌رسانی بافتی</span>
              </div>
            </div>

            {/* Hero CTA Actions */}
            <div className="cpad-hero-actions">
              <a href="#order-terminal" className="cpad-btn-primary">
                سفارش مستقیم بسته ۲۰ عددی CarboxyPad ←
              </a>
              <Link href="/carboxygel" className="cpad-btn-secondary">
                بررسی گام اول: ژل‌های فعال مکمل CarboxyGel
              </Link>
            </div>
          </div>

          {/* Left Column (Showcase Card in RTL) */}
          <div className="cpad-showcase-card">
            <div className="cpad-showcase-header">
              <span className="cpad-showcase-tag">CLINICAL DUAL-SHEET PACK</span>
              <span style={{ fontSize: "0.78rem", color: "#6ee7b7", fontFamily: "monospace" }}>
                REF: DD-PAD-20X
              </span>
            </div>

            <div className="cpad-image-viewport">
              <img
                src="/assets/drdermer/2025/07/carboxypad-1024x198.png"
                alt="ReeSkin CarboxyPad Alkaline Activator Pads for Face and Neck"
                className="cpad-main-img"
              />
            </div>

            <p className="cpad-image-subtext">
              نمای اختصاصی شیت صورت و پد کانتورینگ ارگونومیک گردن و غبغب CarboxyPad دکتر درمر انگلستان
            </p>
          </div>
        </section>

        {/* ── Section 1: Anatomical Pre-Cut Mask Design ── */}
        <section className="cpad-section-block">
          <div className="cpad-section-title-wrap">
            <h2>طراحی آناتومیک شیت‌های پیش‌برش‌خورده صورت و گردن</h2>
            <p>
              برخلاف ماسک‌های ورقی معمولی، شیت‌های CarboxyPad با هندسه ارگونومیک سه‌بعدی و برش‌های محاسبه‌شده
              روی ۵ زون اصلی صورت و ناحیه گردن فیکس می‌شوند تا هیچ فاصله هوایی یا هدررفت گازی ایجاد نگردد.
            </p>
          </div>

          <div className="cpad-anatomy-explorer">
            {/* Zone Buttons */}
            <div className="cpad-region-list" role="tablist" aria-label="زوایای آناتومیک ماسک">
              {ANATOMICAL_ZONES.map((zone) => {
                const isActive = zone.id === selectedZone;
                return (
                  <button
                    key={zone.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`cpad-region-btn ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedZone(zone.id)}
                  >
                    <span>{zone.nameFa}</span>
                    <span className="cpad-region-badge">{zone.id.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {/* Zone Details */}
            <div className="cpad-region-detail-card" role="tabpanel">
              <div className="cpad-region-detail-header">
                <div>
                  <h3>{currentZone.nameFa}</h3>
                  <div className="cpad-region-en">{currentZone.nameEn}</div>
                </div>
                <span className="cpad-showcase-tag">ANATOMICAL CUT MATRIX</span>
              </div>

              <div className="cpad-region-meta-grid">
                <div className="cpad-meta-box">
                  <span className="cpad-meta-lbl">هندسه برش ارگونومیک</span>
                  <span className="cpad-meta-val green">{currentZone.cutGeometry}</span>
                </div>
                <div className="cpad-meta-box">
                  <span className="cpad-meta-lbl">وسعت پوشش آناتومیک</span>
                  <span className="cpad-meta-val">{currentZone.coverage}</span>
                </div>
                <div className="cpad-meta-box">
                  <span className="cpad-meta-lbl">عمق هدف نفوذ ترنس‌درمال</span>
                  <span className="cpad-meta-val green">{currentZone.targetDepth}</span>
                </div>
              </div>

              <p className="cpad-region-desc">
                <strong>اندیکاسیون کلیدی زون:</strong> {currentZone.indication}
              </p>

              <div className="cpad-region-actionable">
                <strong>عملکرد بالینی در این ناحیه:</strong> {currentZone.clinicalAction}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Chemical Mechanism & Occlusive Trapping ── */}
        <section className="cpad-section-block">
          <div className="cpad-section-title-wrap">
            <h2>مکانیسم واکنش شیمیایی و به دام انداختن گاز CO₂</h2>
            <p>
              اسید سیتریک جامد میکروکریستالی تثبیت‌شده در ماتریکس پد با سدیم بی‌کربنات ژل پایه وارد واکنش
              اسید-باز شده و به دلیل ساختار فیبری بسته، بیش از ۱۰۰۰ppm گاز را محبوس و به عمق بافت می‌راند.
            </p>
          </div>

          <div className="cpad-reaction-container">
            {/* Chemical Equation Box */}
            <div className="cpad-reaction-eq-box">
              <div className="cpad-eq-title">BIOCHEMICAL ACID-BASE NEUTRALIZATION REACTION</div>
              <div className="cpad-eq-formula">
                <span className="react">3 NaHCO₃ (Gel)</span> + <span className="react">C₆H₈O₇ (Solid Pad)</span>
                <span className="arrow">⟶</span>
                <span className="react">Na₃C₆H₅O₇</span> + <span className="react">3 H₂O</span> +{" "}
                <span className="gas">3 CO₂ ⇈ (Trapped Flux &gt; 1000ppm)</span>
              </div>
            </div>

            {/* Stepper Tabs */}
            <div className="cpad-phase-nav">
              {REACTION_PHASES.map((phase) => {
                const isActive = phase.id === activePhase;
                return (
                  <button
                    key={phase.id}
                    className={`cpad-phase-tab ${isActive ? "active" : ""}`}
                    onClick={() => setActivePhase(phase.id)}
                  >
                    <span className="cpad-phase-num">PHASE 0{phase.id} ({phase.duration})</span>
                    <span className="cpad-phase-label">{phase.titleFa}</span>
                  </button>
                );
              })}
            </div>

            {/* Phase Display & Occlusion Diagram */}
            <div className="cpad-phase-display">
              <div className="cpad-phase-text">
                <h4>{currentPhase.titleFa}</h4>
                <div style={{ fontFamily: "monospace", color: "#34d399", fontSize: "0.8rem", marginBottom: "8px" }}>
                  {currentPhase.titleEn} | بازه زمانی: {currentPhase.duration}
                </div>
                <p>{currentPhase.summary}</p>
                <div className="cpad-phase-highlight">
                  <span>✓</span>
                  <span>{currentPhase.highlightText}</span>
                </div>
              </div>

              {/* Occlusion Chamber Layer Graphic */}
              <div className="cpad-occlusion-graphic">
                <div className="cpad-layer-bar cpad-layer-pad">
                  <span>لایه ۱: پد سلولزی CarboxyPad (اسید سیتریک خشک فارماکوپه)</span>
                  <span style={{ fontFamily: "monospace" }}>SOLID ACID WEB</span>
                </div>

                <div className="cpad-gas-arrow">⬇ فشار مثبت محبوس‌شده و جوشش میکروحباب‌ها ⬇</div>

                <div className="cpad-layer-bar cpad-layer-gas">
                  <span>لایه ۲: محفظه بسته گاز CO₂ (تراکم نفوذی بالای ۱۰۰۰ppm)</span>
                  <span style={{ fontWeight: 900 }}>TRAPPED CO₂ CHAMBER</span>
                </div>

                <div className="cpad-gas-arrow">⬇ نفوذ پرفشار گاز از طریق حلالیت در ژل ⬇</div>

                <div className="cpad-layer-bar cpad-layer-gel">
                  <span>لایه ۳: ژل CarboxyGel (سدیم بی‌کربنات + سنتلا + نیاسینامید)</span>
                  <span style={{ fontFamily: "monospace" }}>ALKALINE GEL MATRIX</span>
                </div>

                <div className="cpad-gas-arrow">⬇ عبور ترنس‌درمال از سد اپیدرم ⬇</div>

                <div className="cpad-layer-bar cpad-layer-skin">
                  <span>لایه ۴: درم زنده و مویرگ‌ها (تحریک اثر بوهر و تخلیه انفجاری اکسیژن O₂)</span>
                  <span style={{ fontFamily: "monospace" }}>DERMAL MICROVESSELS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Clinical Indications (3 Columns) ── */}
        <section className="cpad-section-block">
          <div className="cpad-section-title-wrap">
            <h2>اندیکاسیون‌های بالینی و درمانی CarboxyPad™</h2>
            <p>
              بهینه‌سازی شده برای درمان عارضه‌های مقاوم پوستی که نیازمند اکسیژن‌رسانی شدید، نوسازی شبکه کلاژن
              و افزایش خونرسانی بدون دوره نقاهت یا عوارض جانبی هستند.
            </p>
          </div>

          <div className="cpad-indications-grid">
            {/* Indication 1: Neck Skin Laxity */}
            <article className="cpad-indication-card">
              <div className="cpad-ind-top">
                <span className="cpad-ind-badge">INDICATION 01</span>
                <h3>شلی و افتادگی پوست گردن (Neck Skin Laxity)</h3>
                <div className="latin-name">Cervical Cutaneous Laxity &amp; Platysmal Rings</div>
                <p>
                  پوست گردن به دلیل ضخامت کم درم و کاهش طبیعی غدد سباسه، بسیار سریع‌تر از صورت دچار چین‌های
                  افقی و افتادگی می‌گردد. پد اختصاصی گردن CarboxyPad با احاطه کامل عضله پلاتیسما، سبب نوسازی
                  ماتریکس الاستیک و سفت‌شدن محسوس پوست گردن می‌شود.
                </p>
              </div>
              <div className="cpad-ind-clinical-points">
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span>کاهش عمق خطوط افقی گردن (Horizontal Neck Lines)</span>
                </div>
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span>تحریک تولید پروکلاژن نوع I و III در ناحیه گردن</span>
                </div>
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span><strong>نتیجه بالینی:</strong> لیفت و یکدستی بافت پس از ۳ تا ۵ جلسه</span>
                </div>
              </div>
            </article>

            {/* Indication 2: Jawline Sagging */}
            <article className="cpad-indication-card">
              <div className="cpad-ind-top">
                <span className="cpad-ind-badge">INDICATION 02</span>
                <h3>افتادگی خط فک و غبغب (Jawline Sagging)</h3>
                <div className="latin-name">Submental Adiposity &amp; Mandibular Sagging</div>
                <p>
                  تجمع مایع میان‌بافتی، کندی درناژ لنفاوی و هایپرتروفی بافت چربی ساب‌منتال خط فک را محو می‌کنند.
                  نفوذ متراکم گاز CO₂ متابولیسم سلول‌های چربی را فعال کرده و با تخلیه لنفاوی، زاویه فک و چانه را
                  کانتور و تفکیک می‌نماید.
                </p>
              </div>
              <div className="cpad-ind-clinical-points">
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span>تسریع لیپولیز موضعی و کاهش حجم غبغب زیر چانه</span>
                </div>
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span>افزایش درناژ لنفاوی و رفع ورم و احتباس آب بافتی</span>
                </div>
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span><strong>نتیجه بالینی:</strong> کانتورینگ واضح خط فک و کشش ناحیه ساب‌منتال</span>
                </div>
              </div>
            </article>

            {/* Indication 3: Facial Hypoxia */}
            <article className="cpad-indication-card">
              <div className="cpad-ind-top">
                <span className="cpad-ind-badge">INDICATION 03</span>
                <h3>هیپوکسی و کم‌اکسیژنی بافت چهره (Facial Hypoxia)</h3>
                <div className="latin-name">Microvascular Hypoperfusion &amp; Tissue Asphyxia</div>
                <p>
                  استرس محیطی، آلودگی هوا، مصرف دخانیات و افزایش سن جریان خون مویرگی پوست را تضعیف کرده و چهره را
                  کدر، خسته و خاکستری نشان می‌دهند. القای اثر بوهر باعث آزادشدن سیل‌آسای اکسیژن و گلگون‌شدن فوری چهره می‌شود.
                </p>
              </div>
              <div className="cpad-ind-clinical-points">
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span>اتساع فوری عروق مویرگی بستر درم (Capillary Vasodilation)</span>
                </div>
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span>حذف فوری کدری، تیرگی و بازیابی شفافیت درخشان پوست</span>
                </div>
                <div className="cpad-ind-point">
                  <span>•</span>
                  <span><strong>نتیجه بالینی:</strong> درخشش آنی و شادابی بافت بلافاصله پس از برداشتن پد</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── Section 4: Direct Order CTA Terminal (20-Pack & 50-Pack) ── */}
        <section id="order-terminal" className="cpad-section-block">
          <div className="cpad-order-terminal">
            <div className="cpad-terminal-grid">
              {/* Terminal Info */}
              <div className="cpad-terminal-info">
                <div className="cpad-step-pill" style={{ marginBottom: "16px" }}>
                  <span>سفارش مستقیم و تأمین فوری کلینیک</span>
                </div>
                <h3>سفارش آنلاین شیت‌های فعال‌ساز CarboxyPad™</h3>
                <p>
                  سفارش خود را با تضمین اصالت رسمی دکتر درمر انگلستان، تاریخ انقضای معتبر و برچسب اصالت کالا
                  ثبت فرمایید. ارسال فوری با پست پیشتاز و پیک اختصاصی در سراسر کشور.
                </p>

                <div className="cpad-terminal-features">
                  <div className="cpad-feature-line">
                    <span className="cpad-check-icon">✓</span>
                    <span>شیت‌های دوبخشی استریل مجزا برای صورت و گردن (Face &amp; Neck)</span>
                  </div>
                  <div className="cpad-feature-line">
                    <span className="cpad-check-icon">✓</span>
                    <span>سازگار با انواع ژل‌های CarboxyGel (گلیکولیک، آزالائیک و مولتی‌اکتیو)</span>
                  </div>
                  <div className="cpad-feature-line">
                    <span className="cpad-check-icon">✓</span>
                    <span>تخفیف ویژه برای خرید باکس‌های کلینیکال ۵۰ عددی مراکز درمانی</span>
                  </div>
                </div>

                <div className="cpad-cross-sell">
                  <p>
                    آیا هنوز ژل کربوکسی گام اول را تهیه نکرده‌اید؟ برای بهترین نتیجه نیاز به ژل مکمل دارید.
                  </p>
                  <Link href="/carboxygel">مشاهده و خرید ژل‌های CarboxyGel ←</Link>
                </div>
              </div>

              {/* Variant Selector & Add to Cart Card */}
              <div className="cpad-variant-card-box">
                <div className="cpad-variant-options">
                  {CARBOXYPAD_VARIANTS.map((variant) => {
                    const isSelected = variant.id === selectedVariantId;
                    return (
                      <div
                        key={variant.id}
                        className={`cpad-variant-choice ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedVariantId(variant.id)}
                      >
                        <div className="cpad-choice-meta">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <h4>{variant.title}</h4>
                            {variant.badge && (
                              <span className="cpad-region-badge" style={{ color: "#34d399" }}>
                                {variant.badge}
                              </span>
                            )}
                          </div>
                          <span>{variant.sizeDesc}</span>
                        </div>

                        <div className="cpad-choice-price">
                          <div className="cpad-price-amount">{formatToman(variant.priceAmount)}</div>
                          {variant.originalPriceAmount && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#64748b",
                                textDecoration: "line-through",
                                display: "block",
                              }}
                            >
                              {formatToman(variant.originalPriceAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity and Action Button */}
                <div className="cpad-cart-row">
                  <div className="cpad-qty-selector">
                    <button
                      type="button"
                      className="cpad-qty-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="کاهش تعداد"
                    >
                      -
                    </button>
                    <span className="cpad-qty-num">{quantity}</span>
                    <button
                      type="button"
                      className="cpad-qty-btn"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      aria-label="افزایش تعداد"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className={`cpad-btn-add ${addedSuccess ? "success" : ""}`}
                    onClick={handleAddToCart}
                  >
                    {addedSuccess ? "✓ به سبد خرید افزوده شد" : `افزودن ${currentVariant.packCount} عدد پد به سبد خرید`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
