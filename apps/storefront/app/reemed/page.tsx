"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./reemed.css";
import { useCart } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";

/* ── Medical Consumables Data ── */
interface MedicalConsumable {
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

const CLINICAL_CONSUMABLES: MedicalConsumable[] = [
  {
    id: "var_cbg_pro_500",
    sku: "RM-CBG-500ML-CAB",
    title: "ژل کربوکسی‌تراپی CarboxyGel حجم ۵۰۰ میلی‌لیتر (کابین کلینیک)",
    category: "کربوکسی‌ژل کلینیکال",
    size: "500ml مخزن کابین",
    priceAmount: "48500000",
    originalPriceAmount: "56000000",
    description: "فرمولاسیون ۲ فاز با ویسکوزیته بالا ویژه استفاده با هندپیس اولتراسونیک دستگاه CarboX یا ماسک‌های شیت.",
    tierInfo: "حداقل خرید کلینیکی: ۱ عدد • تخفیف ۱۰ درصدی برای سفارش‌های بالای ۵ عدد",
    image: "/assets/drdermer/2025/07/carboxygel-lr.png",
    slug: "carboxygel",
  },
  {
    id: "var_cbg_pro_1500",
    sku: "RM-CBG-1500ML-MAX",
    title: "پک حرفه‌ای ژل کربوکسی ۱۵۰۰ میلی‌لیتر + ۵۰ ست ماسک صورت و گردن",
    category: "پک مصرفی مطبی",
    size: "1500ml مخزن بزرگ بیمارستانی",
    priceAmount: "58000000",
    originalPriceAmount: "69000000",
    description: "اقتصادی‌ترین پکیج کلینیکال برای مراکز درماتولوژی با راندمان حداقل ۵۰ جلسه درمانی کامل صورت و غبغب.",
    tierInfo: "پرفروش‌ترین پک کابین • شامل ۳ عدد کارتریج یدک ۵۰۰ml + ۵۰ عدد ماسک",
    image: "/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1.png",
    slug: "carboxygel",
  },
  {
    id: "var_pod_carbon_box10",
    sku: "RM-POD-CRB-BX10",
    title: "باکس ۱۰ عددی کارتریج‌های تک‌نفره CarboxyPod Carbon",
    category: "پاد تک‌دوز کلینیکال",
    size: "جعبه ۱۰ عددی پاد استریل",
    priceAmount: "18000000",
    originalPriceAmount: "21000000",
    description: "کارتریج‌های تک‌دوز کربن فعال دارویی؛ آماده برای اتصال سریع به هندپیس CarboX جهت سم‌زدایی و رفع چربی اضافه.",
    tierInfo: "کارتریج کامپکت یکبارمصرف • کاهش ریسک آلودگی متقاطع در کلینیک",
    image: "/assets/drdermer/2025/07/carbon-carboxypod-1-1.png",
    slug: "carboxypod",
  },
  {
    id: "var_pod_vita_box20",
    sku: "RM-POD-VIT-BX20",
    title: "باکس ۲۰ عددی پادهای تک‌نفره CarboxyPod Vitamin روشن‌کننده",
    category: "پاد تک‌دوز کلینیکال",
    size: "باکس ۲۰ عددی کلینیکال",
    priceAmount: "34000000",
    originalPriceAmount: "40000000",
    description: "حاوی اتیل آسکوربیک اسید پایدار و گلوتاتیون؛ ایجاد اثر هم‌افزا با فرکانس اولتراسونیک جهت درمان تیرگی.",
    tierInfo: "بسته‌بندی بلیستر استریل فویل آلومینیوم با تاریخ انقضای ۳ ساله",
    image: "/assets/drdermer/2025/07/vitamin-carboxypod-1.png",
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
    description: "شیت‌های سلولزی پیش‌برش‌خورده آغشته به اسید سیتریک خشک و بی‌کربنات با خطوط تا شونده ارگونومیک فک و غبغب.",
    tierInfo: "سازگاری کامل با CarboxyGel • رهایش گاز تا ۶۵ میلی‌متر جیوه فشار تبادل بافتی",
    image: "/assets/drdermer/2025/07/carboxypad-1024x198.png",
    slug: "carboxypad",
  },
  {
    id: "var_hea_500ml_cab",
    sku: "RM-HEA-500ML-PRO",
    title: "ژل تسکین‌بخش هیلین Healene مخزن ۵۰۰ میلی‌لیتر با پمپ کلینیکال",
    category: "ترمیم‌کننده پس از پروسیجر",
    size: "500ml بطری فشاری کابین",
    priceAmount: "28500000",
    originalPriceAmount: "33000000",
    description: "تسریع بازسازی سد دفاعی و کاهش اریتما پس از بلفاروپلاستی پلاسما و تزریق گاز CO₂ با نیاسینامید و پانتنول ۵٪.",
    tierInfo: "فاقد چربی (Oil-Free) • خنک‌کننده آنی بافت تحت استرس",
    image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
    slug: "healene",
  },
];

/* ── European CME Workshops Calendar Data ── */
interface WorkshopEvent {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  cmeCredits: string;
  faculty: string;
  venue: string;
  type: string;
  description: string;
}

const CME_WORKSHOPS: WorkshopEvent[] = [
  {
    id: "ws-cme-01",
    day: "۱۸",
    month: "آذر ۱۴۰۵ (Dec 2026)",
    year: "2026",
    title: "مسترکلاس پیشرفته کربوکسی‌تراپی و مهندسی اثر بوهر در رگ‌زایی عروقی",
    cmeCredits: "۸ امتیاز CME اروپا",
    faculty: "پروفسور الکساندر هاوارد (Cambridge) و دکتر سارا جهانشاهی",
    venue: "مرکز همایش‌های بین‌المللی کمبریج (UK) + پخش برخط همزمان ویژه متخصصین",
    type: "تئوری + هندزآن روی مدل زنده",
    description:
      "تنظیم پارامترهای حجم، فشار تزریق زیرجلدی گاز CO₂ در دستگاه CarboX، پیش‌گرمایش هوشمند، مدیریت خطرات عروقی و پروتکل درمان قطعی تیرگی دور چشم و استریا.",
  },
  {
    id: "ws-cme-02",
    day: "۰۵",
    month: "دی ۱۴۰۵ (Jan 2027)",
    year: "2027",
    title: "بلفاروپلاستی غیرتهاجمی و جوان‌سازی بافت نرم با فناوری PlasmaX",
    cmeCredits: "۱۰ امتیاز CME اروپا",
    faculty: "دکتر مارکوس وِبِر (جراح پلاستیک مونیخ) و تیم علمی Dr Dermer",
    venue: "آکادمی درماتولوژی استانبول (Dumankaya Ikon) و تهران",
    type: "کارگاه جراحی محدود و پرکتیس بالینی",
    description:
      "تکنیک‌های پلاسما سابلیمیشن برای افتادگی پلک فوقانی و تحتانی، ترکیب پلاسمای سرد آرگون با کربوکسی‌پاد و پروتکل‌های پیشگیری از هایپرپیگمنتیشن پس از التهاب (PIH).",
  },
  {
    id: "ws-cme-03",
    day: "۲۲",
    month: "بهمن ۱۴۰۵ (Feb 2027)",
    year: "2027",
    title: "دوره جامع ترکیب‌درمانی: پپتیدهای بیومیمتیک، مس GHK-Cu و اثر گازهای ترابافتی",
    cmeCredits: "۶ امتیاز CME اروپا",
    faculty: "دپارتمان بیوشیمی دارویی دکتر درمر انگلستان",
    venue: "آمفی‌تئاتر آکادمی بالینی درمر (تهران - خیابان ولیعصر)",
    type: "سمپوزیوم تخصصی و بازآموزی پزشکان",
    description:
      "مکانیسم سلولی فاکتورهای رشد فیبروبلاستی FGF-2، بازسازی ۳برابری ماتریکس خارج‌سلولی (ECM) و طراحی نسخه‌های ترکیبی کابین برای انواع الگوهای اسکار آکنه.",
  },
];

/* ── Clinical Certifications & Docs Data ── */
interface ClinicalDoc {
  id: string;
  title: string;
  fileSize: string;
  standard: string;
  summary: string;
}

const CLINICAL_DOCS: ClinicalDoc[] = [
  {
    id: "doc-01",
    title: "تاییدیه رسمی CE Medical Class IIb دستگاه‌های CarboX و PlasmaX",
    fileSize: "PDF • 2.4 MB",
    standard: "MDR (EU) 2017/745",
    summary: "گواهی رسمی انطباق صادره از Notified Body BSI انگلستان و هلند با کد بازرسی معتبر اروپایی.",
  },
  {
    id: "doc-02",
    title: "گواهینامه سیستم مدیریت کیفیت تجهیزات پزشکی ISO 13485:2016",
    fileSize: "PDF • 1.8 MB",
    standard: "ISO 13485 Certified",
    summary: "استاندارد فرآیندهای طراحی، تولید پاک در اتاق تمیز و کالیبراسیون دوره‌ای تجهیزات مدیکال.",
  },
  {
    id: "doc-03",
    title: "گزارش بالینی کارآزمایی دوسوکور اثر بوهر بر جریان خون مویرگی (Bohr Trial 2024)",
    fileSize: "PDF • 4.1 MB",
    standard: "Peer-Reviewed Study",
    summary: "داده‌های فلوسیتومتری لیزری داپلر نشان‌دهنده افزایش ۳۲۶ درصدی اشباع اکسیژن مویرگی پس از مصرف CarboxyGel.",
  },
  {
    id: "doc-04",
    title: "دستورالعمل جامع سرویس دوره‌ای و راهنمای کاربری بالینی (Clinical User Manual)",
    fileSize: "PDF • 6.7 MB",
    standard: "User Protocol EN/FA",
    summary: "دستورالعمل کامل عیب‌یابی، تعویض رگولاتورهای پزشکی، تمیزکاری هندپیس‌ها و گایدلاین ایمنی اپراتور.",
  },
];

export default function ReeMedBrandPage() {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();

  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [inquiryStatus, setInquiryStatus] = useState<string | null>(null);

  /* Form states */
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [phone, setPhone] = useState("");
  const [interestTarget, setInterestTarget] = useState("CarboX Medical Station");
  const [inquiryNotes, setInquiryNotes] = useState("");

  const handleAddConsumable = (item: MedicalConsumable) => {
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

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !phone) {
      alert("لطفاً نام پزشک/مسئول و شماره تماس را وارد فرمایید.");
      return;
    }
    setInquiryStatus("sending");
    setTimeout(() => {
      setInquiryStatus("success");
      setClinicName("");
      setDoctorName("");
      setPhone("");
      setInquiryNotes("");
    }, 1200);
  };

  return (
    <main className="reemed-page page-container">
      {/* ── Brand Hero Showcase ── */}
      <section className="reemed-hero" aria-labelledby="reemed-hero-title">
        <div className="reemed-hero-top">
          <div className="reemed-hero-badges">
            <span className="reemed-pill-badge">ADVANCED MEDICAL AESTHETICS</span>
            <span className="reemed-pill-badge cyan">CE Class IIb Medical Certified</span>
            <span className="reemed-pill-badge">EUROPEAN MDR 2017/745</span>
          </div>
          <img
            src="/assets/drdermer/2025/07/reemed-gray.png"
            alt="لوگوی رسمی برند ReeMed انگلستان"
            className="reemed-hero-logo"
          />
        </div>

        <h1 id="reemed-hero-title">ReeMed™ Medical Pro</h1>
        <div className="hero-philosophy">
          <span>فلسفه و بیانیه بالینی:</span>
          <span>Next-Generation Medical Aesthetic Technologies for Dermatologists & Aesthetic Surgeons</span>
        </div>
        <p className="hero-desc">
          پلتفرم مهندسی پزشکی <strong>ReeMed™ Medical Pro</strong> شاخه فوق‌تخصصی کمپانی دکتر درمر انگلستان است که به‌صورت انحصاری به
          توسعه سامانه‌های کلینیکال پرتوان، دستگاه‌های هوشمند تزریق کنترل‌شده گاز پزشکی و فناوری‌های پیشرفته پلاسمای سرد اختصاص دارد.
          تجهیزات ری‌مد با پیاده‌سازی سخت‌گیرانه‌ترین استانداردهای ایمنی مدیکال اروپا، آزادی عمل و اطمینان خاطر بالینی را برای جراحان
          پلاستیک، درماتولوژیست‌ها و مراکز تخصصی پوست به ارمغان می‌آورند.
        </p>

        {/* Hero Stats */}
        <div className="reemed-hero-stats">
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>Class IIb</span>
            <span className="stat-label">سطح استاندارد مدیکال اروپا با کدهای تاییدیه معتبر BSI</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>۲۴ ماه</span>
            <span className="stat-label">گارانتی طلایی تعویض قطعات و ۱۰ سال خدمات پس از فروش رسمی</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>CME Accredited</span>
            <span className="stat-label">آموزش رسمی کاربری و صدور مدارک معتبر آکادمی کمبریج بریتانیا</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: "#38bdf8" }}>+۴۵۰ کلینیک</span>
            <span className="stat-label">مورد استفاده در برترین مراکز جراحی و پوست خاورمیانه و اروپا</span>
          </div>
        </div>
      </section>

      {/* ── Decision Guide: How Clinics Choose ReeMed ── */}
      <section className="reemed-section" id="pro-guide" aria-labelledby="pro-guide-title">
        <div className="reemed-section-header">
          <span className="medical-tag">راهنمای تجهیز و همکاری کلینیک</span>
          <h2 id="pro-guide-title">مدل‌های همکاری و تجهیز مراکز تخصصی پوست</h2>
          <p>
            تسهیل فرآیند تجهیز مطب‌ها، کلینیک‌ها و بیمارستان‌های تخصصی بر اساس سطح خدمات درمانی و تیراژ مراجعین:
          </p>
        </div>

        <div className="reemed-guide-grid">
          <div className="reemed-guide-card">
            <span className="reemed-guide-tag">مدل ۱: تجهیز سخت‌افزاری</span>
            <h3>خرید استیشن‌های CarboX و PlasmaX</h3>
            <p>
              مناسب برای کلینیک‌های جراحی و پوست که نیازمند تجهیزات پیشرفته تزریق میکروگاز CO₂ و بلفاروپلاستی بدون جراحی با گارانتی ۲۴ ماهه هستند.
            </p>
            <div className="reemed-guide-foot">
              <span>شامل ترولی، هندپیس یدک و آموزش اپراتوری</span>
            </div>
          </div>

          <div className="reemed-guide-card">
            <span className="reemed-guide-tag">مدل ۲: تأمین دوره‌ای کابین</span>
            <h3>پک‌های بزرگ ژل ۵۰۰/۱۵۰۰ml و پادها</h3>
            <p>
              مناسب برای بیوتی‌تراپیست‌ها و پزشکان که پروتکل‌های ماهانه دارند؛ با فاکتور رسمی، تخفیف پلکانی حجم و تحویل سرد دارویی.
            </p>
            <div className="reemed-guide-foot">
              <span>تخفیف ۱۰ الی ۱۵ درصدی سفارش‌های تیراژ مطب</span>
            </div>
          </div>

          <div className="reemed-guide-card">
            <span className="reemed-guide-tag">مدل ۳: آموزش و بازآموزی</span>
            <h3>کارگاه‌های عملی و مدارک CME</h3>
            <p>
              دوره‌های هندز-آن (Hands-On) کار با دستگاه‌ها تحت نظارت اساتید درماتولوژی کمبریج با اعطای سرتیفیکیت معتبر بین‌المللی.
            </p>
            <div className="reemed-guide-foot">
              <span>امتیاز بازآموزی رسمی درماتولوژی</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Flagship Medical Devices Showcase ── */}
      <section className="reemed-section" id="devices" aria-labelledby="devices-title">
        <div className="reemed-section-header">
          <span className="medical-tag">سامانه‌های پیشرفته مدیکال</span>
          <h2 id="devices-title">تجهیزات تخصصی و ایستگاه‌های کاری ReeMed™</h2>
          <p>
            تکنولوژی‌های استاندارد بین‌المللی با تلفیق مدالیته‌های تهاجمی زیرجلدی و غیرتهاجمی ترابافتی ویژه مطب‌ها و اتاق‌های جراحی سرپایی
          </p>
        </div>

        <div className="devices-grid">
          {/* Device 1: CarboX Medical Station */}
          <article className="device-card-large" aria-labelledby="dev-carbox-title">
            <div className="device-badge-row">
              <span className="device-medical-class">MDR Class IIb Medical Station</span>
              <span className="device-warranty-tag">گارانتی ۲۴ ماهه تعویض + هندپیس یدک</span>
            </div>

            <div className="device-img-wrap">
              <img
                src="/assets/drdermer/2025/08/19carbox.webp"
                alt="ایستگاه پزشکی CarboX Medical Station"
                loading="lazy"
              />
            </div>

            <div className="device-info-header">
              <h3 id="dev-carbox-title">CarboX™ Medical Station</h3>
              <p className="device-tech-sub">
                ایستگاه تخصصی دوگانه تزریق زیرجلدی CO₂ و فعال‌ساز اولتراسونیک CarboxyPod
              </p>
            </div>

            <p className="device-desc-text">
              سامانه جامع CarboX نخستین پلتفرم مدیکال در جهان است که با بهره‌گیری از رگولاتورهای دیجیتال پیزوالکتریک، امکان تنظیم دوز
              تزریق گاز دی‌اکسید کربن پزشکی را با دقت ۱ سی‌سی در دقیقه (محدوده ۱۰ تا ۱۰۰ cc/min) فراهم می‌سازد. سیستم پیش‌گرمایش هوشمند،
              دمای گاز خروجی را پیش از ورود به بافت تا ۳۶ درجه سانتی‌گراد تثبیت نموده و درد تزریق را به حداقل مطلق می‌رساند.
            </p>

            {/* Technical Specs */}
            <div className="device-specs-table">
              <span className="specs-title">مشخصات و کالیبراسیون فنی دستگاه:</span>
              <div className="spec-line">
                <span className="spec-label">مدالیته درمانی:</span>
                <span className="spec-value">تزریق مستقیم زیرجلدی CO₂ + هندپیس پاد ترابافتی</span>
              </div>
              <div className="spec-line">
                <span className="spec-label">دقت دبی خروجی گاز:</span>
                <span className="spec-value">۱۰ الی ۱۰۰ سی‌سی/دقیقه با خطای کمتر از ۱٪</span>
              </div>
              <div className="spec-line">
                <span className="spec-label">کنترل حرارتی:</span>
                <span className="spec-value">هیتر ترمواستاتیک داخلی ۳۶°C جهت حذف شوک سرمایی بافت</span>
              </div>
              <div className="spec-line">
                <span className="spec-label">کاربردهای کلینیکی:</span>
                <span className="spec-value">لیپولیز موضعی، رفع سلولیت، تیرگی چشم، بازسازی اسکار</span>
              </div>
            </div>

            <div className="device-actions-row">
              <div className="device-price-col">
                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>قیمت شرکتی با ترولی مدیکال:</span>
                <span className="device-price-val">{formatToman(450000000n)}</span>
              </div>
              <Link href="/products/carbox" className="device-pdp-link">
                بررسی ۳۶۰ درجه و مشخصات
              </Link>
              <a href="#contact-distributor" className="device-consult-btn">
                مشاوره فنی و خرید اقساطی
              </a>
            </div>
          </article>

          {/* Device 2: PlasmaX Multi-Energy Plasma Device */}
          <article className="device-card-large" aria-labelledby="dev-plasmax-title">
            <div className="device-badge-row">
              <span className="device-medical-class" style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}>
                Multi-Frequency Argon Cold Jet
              </span>
              <span className="device-warranty-tag">پشتیبانی ۱۰ ساله و آموزش جراحی</span>
            </div>

            <div className="device-img-wrap">
              <img
                src="/assets/drdermer/2025/08/18plasmax.webp"
                alt="دستگاه چندمنظوره پلاسمای پزشکی PlasmaX"
                loading="lazy"
              />
            </div>

            <div className="device-info-header">
              <h3 id="dev-plasmax-title">PlasmaX™ Multi-Energy Plasma Device</h3>
              <p className="device-tech-sub" style={{ color: "#0369a1" }}>
                سیستم چندفرکانسی پلاسمای سرد آرگون/هلیوم، بلفاروپلاستی غیرتهاجمی و DBD پلاسما
              </p>
            </div>

            <p className="device-desc-text">
              پلاسماکس قدرتمندترین سیستم پلاسمای پزشکی اروپا با ۳ مدالیته مستقل تخلیه انرژی است: مد Continuous Discharge برای سابلیمیشن
              دقیق پوست و بلفاروپلاستی بدون برش و خونریزی؛ فناوری Cold Plasma Jet با گاز آرگون با خلوص ۹۹.۹۹۹٪ جهت حذف کامل میکروارگانیسم‌ها،
              تسکین اریتما و نوسازی کلاژن بافت آسیب‌دیده بدون ایجاد زخم حرارتی.
            </p>

            {/* Technical Specs */}
            <div className="device-specs-table">
              <span className="specs-title">مشخصات و کالیبراسیون فنی دستگاه:</span>
              <div className="spec-line">
                <span className="spec-label">مدالیته‌های ۳گانه:</span>
                <span className="spec-value">Continuous Plasma, Cold Argon Jet, DBD Bio-Resonance</span>
              </div>
              <div className="spec-line">
                <span className="spec-label">نوع گاز ورودی جت سرد:</span>
                <span className="spec-value">آرگون مدیکال خلوص ۵.۰ با دبی جریان ۰.۵ الی ۴ لیتر/دقیقه</span>
              </div>
              <div className="spec-line">
                <span className="spec-label">فرکانس مولد پلاسما:</span>
                <span className="spec-value">ژنراتور پیشرفته ۷۰ کیلوهرتز بیورزونانت با نفوذ کنترل‌شده</span>
              </div>
              <div className="spec-line">
                <span className="spec-label">اندیکاسیون‌های اصلی:</span>
                <span className="spec-value">بلفاروپلاستی غیرجراحی، لیفت غیرتهاجمی، ترمیم اسکار و آکنه</span>
              </div>
            </div>

            <div className="device-actions-row">
              <div className="device-price-col">
                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>قیمت شرکتی با پروب‌های کامل:</span>
                <span className="device-price-val">{formatToman(580000000n)}</span>
              </div>
              <Link href="/products/plasmax" className="device-pdp-link">
                بررسی ۳۶۰ درجه و مشخصات
              </Link>
              <a href="#contact-distributor" className="device-consult-btn">
                مشاوره فنی و خرید اقساطی
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ── Clinical Consumables Section ── */}
      <section className="consumables-section" id="consumables" aria-labelledby="consumables-title">
        <div className="reemed-section-header">
          <span className="medical-tag">ملزومات مصرفی کابین و کلینیک</span>
          <h2 id="consumables-title">اقلام مصرفی کلینیکال و پک‌های حرفه‌ای مطب</h2>
          <p>
            تأمین پایدار مخازن کابین CarboxyGel در حجم‌های ۵۰۰ و ۱۵۰۰ میلی‌لیتر، پادهای تک‌دوز استریل و شیت‌های آناتومیک پیش‌برش‌خورده با
            ارسال اختصاصی در بسته‌بندی ایمن دارویی
          </p>
        </div>

        <div className="consumables-grid">
          {CLINICAL_CONSUMABLES.map((item) => {
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
                  <button
                    type="button"
                    className={`btn-consumable-add ${isAdded ? "added" : ""}`}
                    onClick={() => handleAddConsumable(item)}
                  >
                    {isAdded ? "✓ افزوده شد" : "+ ثبت سفارش مصرفی"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Training & CME Certification Calendar ── */}
      <section className="cme-calendar-section" id="training" aria-labelledby="training-title">
        <div className="reemed-section-header">
          <span className="medical-tag">آکادمی بین‌المللی و بازآموزی</span>
          <h2 id="training-title">تقویم کارگاه‌های آموزشی دارای تاییدیه CME اروپا</h2>
          <p>
            دوره‌های علمی و عملی هندزآن زیر نظر اساتید برجسته درماتولوژی کمبریج و مونیخ با اعطای گواهینامه معتبر بازآموزی و سرتیفیکیت
            بین‌المللی اپراتوری دستگاه
          </p>
        </div>

        <div className="workshop-list">
          {CME_WORKSHOPS.map((ws) => (
            <div key={ws.id} className="workshop-item-card">
              <div className="workshop-date-col">
                <span className="ws-day">{ws.day}</span>
                <span className="ws-month">{ws.month}</span>
                <span className="ws-credits-badge">{ws.cmeCredits}</span>
              </div>

              <div className="workshop-main-col">
                <h4>{ws.title}</h4>
                <div className="workshop-faculty">مدرسین: {ws.faculty}</div>
                <p className="workshop-desc">{ws.description}</p>
                <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "var(--brand-dark)", fontWeight: 700 }}>
                  محل برگزاری: {ws.venue} • نحوه اجرا: {ws.type}
                </div>
              </div>

              <div className="workshop-action-col">
                <button
                  type="button"
                  className="btn-register-ws"
                  onClick={() => {
                    setInterestTarget(ws.title);
                    const el = document.getElementById("contact-distributor");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  رزرو صندلی کارگاه
                </button>
                <span className="ws-location-tag">ظرفیت محدود ۱۲ پزشک</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Clinical Documentation & Regulatory Approvals ── */}
      <section className="reemed-section" id="documentation" aria-labelledby="documentation-title">
        <div className="reemed-section-header">
          <span className="medical-tag">رگولاتوری و مستندات فنی</span>
          <h2 id="documentation-title">مستندات بالینی، مقالات داوری‌شده و تاییدیه‌های رسمی</h2>
          <p>
            دسترسی مستقیم پزشکان، کلینیک‌ها و ناظران تجهیزات پزشکی به مدارک انطباق با مقررات MDR اروپا و پروتکل‌های رسمی
          </p>
        </div>

        <div className="docs-certs-grid">
          {CLINICAL_DOCS.map((doc) => (
            <div key={doc.id} className="doc-cert-item">
              <div className="doc-icon">📄</div>
              <div className="doc-info">
                <h4>{doc.title}</h4>
                <p>{doc.summary}</p>
                <span style={{ fontSize: "0.75rem", color: "var(--brand)", fontWeight: 800, display: "block", marginBottom: "8px" }}>
                  کد استاندارد: {doc.standard} • {doc.fileSize}
                </span>
                <a
                  href="/assets/drdermer/2025/07/carboxygel-lr.png"
                  download
                  className="doc-download-link"
                >
                  دریافت نسخه رسمی PDF ←
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Distributor & Clinic Partnership Contact Form ── */}
      <section className="distributor-inquiry-box" id="contact-distributor" aria-labelledby="inquiry-title">
        <div className="inquiry-info-col">
          <span className="medical-tag" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}>
            امور نمایندگی و قراردادهای کلینیکال
          </span>
          <h3 id="inquiry-title">ارتباط با دپارتمان تجهیزات پزشکی و اخذ نمایندگی</h3>
          <p>
            تیم مهندسی پزشکی و امور بازرگانی دکتر درمر آماده ارائه مشاوره حضوری در محل کلینیک، برگزاری جلسات دمو، شرایط خرید منعطف
            اقساطی و عقد قراردادهای تأمین پایدار ملزومات مصرفی با شرکت‌های توزیع و کلینیک‌های زیبایی است.
          </p>

          <div className="inquiry-points">
            <div className="inquiry-point-row">
              <span>📞</span>
              <span>خط ویژه دپارتمان پزشکی: ۰۲۱-۸۸۸۸۰۰۰۰ (داخلی ۱۰۴)</span>
            </div>
            <div className="inquiry-point-row">
              <span>🌐</span>
              <span>مکاتبات بین‌الملل و امور توزیع: info@drdermer.co.uk</span>
            </div>
            <div className="inquiry-point-row">
              <span>📍</span>
              <span>دفتر فنی و مرکز خدمات پس از فروش: تهران، خیابان ولیعصر، برج سپید، واحد ۷۰۲</span>
            </div>
          </div>
        </div>

        <div className="inquiry-form-card">
          <h4>فرم استعلام تجهیزات و ثبت‌نام کارگاه</h4>
          {inquiryStatus === "success" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "2.5rem", color: "var(--success)", marginBottom: "12px" }}>✓</div>
              <h5 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 8px" }}>درخواست شما با موفقیت ثبت گردید</h5>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
                کارشناس بالینی دپارتمان ReeMed ظرف حداکثر ۲ ساعت کاری جهت هماهنگی دمو و ارسال پیش‌فاکتور با شما تماس خواهد گرفت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry}>
              <div className="inquiry-field-group">
                <label htmlFor="clinic-name">نام مرکز یا کلینیک درماتولوژی:</label>
                <input
                  id="clinic-name"
                  type="text"
                  placeholder="مثال: کلینیک تخصصی پوست و لیزر سپهر"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>

              <div className="inquiry-field-group">
                <label htmlFor="doctor-name">نام پزشک / مدیر مرکز (الزامی):</label>
                <input
                  id="doctor-name"
                  type="text"
                  placeholder="مثال: دکتر علیرضا ناصری"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div className="inquiry-field-group">
                <label htmlFor="clinic-phone">شماره تماس مستقیم (الزامی):</label>
                <input
                  id="clinic-phone"
                  type="tel"
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="inquiry-field-group">
                <label htmlFor="inquiry-subject">موضوع استعلام یا دستگاه مورد نظر:</label>
                <select
                  id="inquiry-subject"
                  value={interestTarget}
                  onChange={(e) => setInterestTarget(e.target.value)}
                >
                  <option value="CarboX Medical Station">دستگاه پزشکی کربوکسی‌تراپی CarboX™ Station</option>
                  <option value="PlasmaX Multi-Energy">دستگاه چندمنظوره پلاسمای سرد PlasmaX™</option>
                  <option value="Clinical Consumables Pack">استعلام خرید عمده اقلام مصرفی CarboxyGel و پادها</option>
                  <option value="CME Workshop Registration">رزرو و ثبت‌نام در کارگاه‌های CME اروپا</option>
                  <option value="Distributor Partnership">درخواست اخذ نمایندگی انحصاری استانی/منطقه‌ای</option>
                </select>
              </div>

              <div className="inquiry-field-group">
                <label htmlFor="inquiry-notes">توضیحات تکمیلی یا سوالات بالینی:</label>
                <textarea
                  id="inquiry-notes"
                  rows={3}
                  placeholder="در صورت تمایل به تست دستگاه در کلینیک یا جزئیات شرایط پرداخت، مرقوم فرمایید..."
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-submit-inquiry"
                disabled={inquiryStatus === "sending"}
              >
                {inquiryStatus === "sending" ? "در حال ثبت اطلاعات..." : "ثبت و ارسال استعلام رسمی"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
