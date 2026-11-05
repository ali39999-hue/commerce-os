"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./reemed.css";
import { useCart } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";

/* ── Clinical Skincare Formulations & Kits ── */
interface ClinicalKitItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  size: string;
  priceAmount: string; // in IRR
  originalPriceAmount?: string;
  description: string;
  tierInfo: string;
  image: string;
  slug: string;
}

const CLINICAL_KITS: ClinicalKitItem[] = [
  {
    id: "var_cbg_pro_500",
    sku: "RM-CBG-500ML-CAB",
    title: "ژل کربوکسی‌تراپی CarboxyGel حجم ۵۰۰ میلی‌لیتر (پک تخصصی)",
    category: "کربوکسی‌ژل کلینیکال",
    size: "500ml مخزن متمرکز",
    priceAmount: "48500000",
    originalPriceAmount: "56000000",
    description: "فرمولاسیون ۲ فاز با ویسکوزیته بالا ویژه رهایش هدفمند دی‌اکسید کربن و تحریک پایدار اثر بوهر بر سطح اپیدرم.",
    tierInfo: "پک با غلظت دارویی بالا • همراه با سرنگ دوزیمتری میلی‌متری",
    image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png",
    slug: "carboxygel",
  },
  {
    id: "var_cbg_pro_1500",
    sku: "RM-CBG-1500ML-MAX",
    title: "پک جامع ژل کربوکسی ۱۵۰۰ میلی‌لیتر + ۵۰ ست ماسک صورت و گردن",
    category: "پک کامل درمانی",
    size: "1500ml مخزن بزرگ اقتصادی",
    priceAmount: "58000000",
    originalPriceAmount: "69000000",
    description: "کامل‌ترین پکیج درمانی شامل ۳ مخزن ۵۰۰ml ژل کربوکسی فعال به همراه ۵۰ شیت ارگونومیک صورت و گردن.",
    tierInfo: "پرفروش‌ترین پک تخصصی • راندمان ۵۰ نوبت درمان کامل",
    image: "/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png",
    slug: "carboxygel",
  },
  {
    id: "var_pod_carbon_box10",
    sku: "RM-POD-CRB-BX10",
    title: "باکس ۱۰ عددی کارتریج‌های CarboxyPod Carbon زغال بامبو",
    category: "پاد فعال‌ساز ترابافتی",
    size: "جعبه ۱۰ عددی پاد وکیوم",
    priceAmount: "18000000",
    originalPriceAmount: "21000000",
    description: "کارتریج‌های فعال‌ساز گاز CO₂ غنی از کربن فعال دارویی و اسید سیتریک جهت دتوکس عمقی منافذ و لایه‌برداری ملایم.",
    tierInfo: "بسته‌بندی انفرادی فویل آلومینیوم • حفظ حداکثر پایداری ترکیبات فعال",
    image: "/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png",
    slug: "carboxypod",
  },
  {
    id: "var_pod_vita_box20",
    sku: "RM-POD-VIT-BX20",
    title: "باکس ۲۰ عددی پادهای CarboxyPod Vitamin روشن‌کننده و ضدلک",
    category: "پاد فعال‌ساز ترابافتی",
    size: "باکس ۲۰ عددی",
    priceAmount: "34000000",
    originalPriceAmount: "40000000",
    description: "حاوی اتیل آسکوربیک اسید پایدار، گلوتاتیون و آربوتین؛ مهار آنزیم تیروزیناز و رفع لکه‌های هایپرپیگمنتیشن.",
    tierInfo: "فرمولاسیون پایدار بدون اکسیداسیون • مناسب انواع تیپ‌های پوستی",
    image: "/assets/drdermer/2024/10/multi-170-vita-pod.webp",
    slug: "carboxypod",
  },
  {
    id: "var_pad_50x_sterile",
    sku: "RM-PAD-50X-STR",
    title: "پدهای استریل پیش‌برش‌خورده صورت و گردن CarboxyPad (بسته ۵۰ ستی)",
    category: "پد اکتیواتور آلکالاین",
    size: "باکس ۵۰ ستی صورت و گردن",
    priceAmount: "31000000",
    originalPriceAmount: "37000000",
    description: "شیت‌های سلولزی میکروپرمنبران آغشته به بافر قلیایی و اسید سیتریک با خطوط تاشونده آناتومیک فک، گردن و گونه.",
    tierInfo: "سازگاری کامل با ژل‌های CarboxyGel • رهایش یکدست گاز CO₂ بر تمام سطح صورت",
    image: "/assets/drdermer/2025/07/carboxypad-1024x198.png",
    slug: "carboxypad",
  },
  {
    id: "var_hea_500ml_cab",
    sku: "RM-HEA-500ML-PRO",
    title: "ژل تسکین‌بخش و التیام‌دهنده هیلین Healene مخزن ۵۰۰ میلی‌لیتر",
    category: "ترمیم‌کننده و التیام پوست",
    size: "500ml بطری پمپی",
    priceAmount: "28500000",
    originalPriceAmount: "33000000",
    description: "تسریع بازسازی سد دفاعی اپیدرم و رفع فوری قرمزی پس از لایه‌برداری با پپتیدهای مس، نیاسینامید و پانتنول ۵٪.",
    tierInfo: "فاقد چربی و اسانس • خنک‌کننده و تسکین‌دهنده سریع بافت تحت استرس",
    image: "/assets/drdermer/2025/08/healene-gel.webp",
    slug: "healene",
  },
];

export default function ReeMedBrandPage() {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const handleAddKit = (item: ClinicalKitItem) => {
    addItem({
      variantId: item.id,
      productId: item.id,
      title: item.title,
      sku: item.sku,
      priceAmount: item.priceAmount,
      image: item.image,
    });

    setAddedItemMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <main className="reemed-page page-container">
      {/* ── Brand Hero Showcase ── */}
      <section className="reemed-hero" aria-labelledby="reemed-hero-title">
        <div className="reemed-hero-top">
          <div className="reemed-hero-badges">
            <span className="reemed-pill-badge">ADVANCED CLINICAL FORMULATIONS</span>
            <span className="reemed-pill-badge cyan">BRITISH PHARMACOPOEIA STANDARDS</span>
            <span className="reemed-pill-badge">ISO 22716 GMP CERTIFIED</span>
          </div>
          <img
            src="/assets/drdermer/2025/07/reemed-gray.png"
            alt="لوگوی رسمی برند ReeMed انگلستان"
            className="reemed-hero-logo"
          />
        </div>

        <h1 id="reemed-hero-title">ReeMed™ Clinical Solutions</h1>
        <div className="hero-philosophy">
          <span>فلسفه فرمولاسیون و بیانیه بالینی:</span>
          <span>Next-Generation Bio-Active Protocols & Transdermal Matrices</span>
        </div>
        <p className="hero-desc">
          خط فرمولاسیون‌های پیشرفته <strong>ReeMed™ Clinical Solutions</strong> مجموعه کیت‌های غلیظ ترابافتی، ماسک‌های آلکالاین فیبری و پادهای فعال‌ساز کربوکسی‌تراپی کمپانی دکتر درمر انگلستان است. این پروتکل‌ها با تکیه بر سازوکار فیزیولوژیک اثر بوهر (Bohr Effect)، رهایش متراکم اکسیژن بافتی را بدون نیاز به هیچ‌گونه سوزن، درد یا تهاجم محقق می‌سازند.
        </p>

        {/* Hero Stats */}
        <div className="reemed-hero-stats">
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>pH 3.8</span>
            <span className="stat-label">بافر فیزیولوژیک ایمن جهت القای حداکثر تبادل گاز در بافت</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>+۷۶٪</span>
            <span className="stat-label">افزایش موضعی اشباع اکسیژن مویرگی با تحریک اثر بوهر</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>۲°C – ۸°C</span>
            <span className="stat-label">ارسال با زنجیره سرمایی ایزوترمال جهت حفظ کیفیت بیواکتیوها</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>۱۰۰٪ استریل</span>
            <span className="stat-label">بسته‌بندی هوابند فویل آلومینیوم با تاریخ انقضای رسمی ۳ ساله</span>
          </div>
        </div>
      </section>

      {/* ── Clinical Kits Section ── */}
      <section className="consumables-section" id="kits" aria-labelledby="kits-title">
        <div className="reemed-section-header">
          <span className="medical-tag">کیت‌ها و فرمولاسیون‌های تخصصی</span>
          <h2 id="kits-title">فرمولاسیون‌های پیشرفته و پک‌های کامل ترابافتی ReeMed™</h2>
          <p>
            تأمین مستقیم مخازن CarboxyGel در حجم‌های ۵۰۰ و ۱۵۰۰ میلی‌لیتر، کپسول‌های فعال‌ساز نانوحباب‌های CO₂ و شیت‌های آناتومیک پیش‌برش‌خورده با بسته‌بندی مقاوم دارویی
          </p>
        </div>

        <div className="consumables-grid">
          {CLINICAL_KITS.map((item) => {
            const isAdded = !!addedItemMap[item.id];
            return (
              <div key={item.id} className="consumable-card">
                <div className="consumable-img-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <span className="consumable-tag">{item.category}</span>
                <h3 className="consumable-title">{item.title}</h3>
                <p className="consumable-desc">{item.description}</p>

                <div className="consumable-tier-box">
                  <span className="tier-title">{item.size}:</span>
                  <span className="tier-detail">{item.tierInfo}</span>
                </div>

                <div className="consumable-footer">
                  <div>
                    <span className="consumable-price-val">
                      {formatToman(BigInt(item.priceAmount))}
                    </span>
                    {item.originalPriceAmount && (
                      <span style={{ textDecoration: "line-through", color: "var(--muted)", fontSize: "0.8rem", marginRight: "6px" }}>
                        {formatToman(BigInt(item.originalPriceAmount))}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      href={`/products/${item.slug}`}
                      className="btn-consumable-add"
                      style={{ background: "transparent", color: "var(--brand)", border: "1px solid var(--brand)" }}
                    >
                      بررسی پرونده
                    </Link>
                    <button
                      type="button"
                      className={`btn-consumable-add ${isAdded ? "added" : ""}`}
                      onClick={() => handleAddKit(item)}
                    >
                      {isAdded ? "✓ افزوده شد" : "+ ثبت سفارش"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Scientific Mechanism & Standards ── */}
      <section className="reemed-section" id="science-standards" aria-labelledby="science-standards-title">
        <div className="reemed-section-header">
          <span className="medical-tag">استانداردهای بیوشیمیایی</span>
          <h2 id="science-standards-title">اصول طراحی فرمولاسیون و کنترل کیفیت فارماکوپه</h2>
          <p>
            تعهد به خلوص دارویی مواد مؤثره و تطابق با استانداردهای سخت‌گیرانه تولید تمیز در کمبریج انگلستان
          </p>
        </div>

        <div className="reemed-guide-grid">
          <div className="reemed-guide-card">
            <span className="reemed-guide-tag">اصل ۱: القای طبیعی اثر بوهر</span>
            <h3>انفوزیون گازی بدون نیاز به تزریق</h3>
            <p>
              انحلال کنترل‌شده نانوحباب‌های CO₂ در سطح پوست و نفوذ ترابافتی سبب افت پی‌اچ و ترغیب گلبول‌های قرمز به رهاسازی انفجاری اکسیژن در بستر مویرگی می‌گردد.
            </p>
            <div className="reemed-guide-foot">
              <Link href="/#science" style={{ color: "var(--brand)", fontWeight: 700 }}>
                مشاهده انیمیشن اطلس فیزیولوژی ←
              </Link>
            </div>
          </div>

          <div className="reemed-guide-card">
            <span className="reemed-guide-tag">اصل ۲: خلوص مواد مؤثره</span>
            <h3>گرید فارماکوپه انگلستان (BP)</h3>
            <p>
              تمامی اکتیوها نظیر سدیم بی‌کربنات دارویی، اسید سیتریک طبیعی، اسید آزالائیک و ماتریکسیل دارای گواهی خلوص بالای ۹۹.۵٪ و عاری از هرگونه ناخالصی هستند.
            </p>
            <div className="reemed-guide-foot">
              <Link href="/ingredients" style={{ color: "var(--brand)", fontWeight: 700 }}>
                جست‌وجو در دانشنامه INCI ←
              </Link>
            </div>
          </div>

          <div className="reemed-guide-card">
            <span className="reemed-guide-tag">اصل ۳: ایمنی و ثبات بافتی</span>
            <h3>آزمون‌های دوسوکور درماتولوژی</h3>
            <p>
              فرمولاسیون‌ها در کارآزمایی‌های بالینی مستقل بر روی انواع فتوتیپ‌های پوستی ارزیابی شده و شاخص ایجاد اریتم پایدار یا حساسیت آن‌ها صفر گزارش گردیده است.
            </p>
            <div className="reemed-guide-foot">
              <Link href="/#clinical-results" style={{ color: "var(--brand)", fontWeight: 700 }}>
                بررسی شواهد سنجش Visia ←
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
