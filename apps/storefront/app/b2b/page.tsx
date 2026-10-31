"use client";

import "./b2b.css";
import Link from "next/link";
import { useState } from "react";

const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ── Persian client validation mirroring the API rules ── */
const RULES = {
  companyName: { min: 2, max: 200 },
  contactName: { min: 2, max: 150 },
  itemsSummary: { min: 5, max: 2000 },
  desiredQty: { min: 1, max: 100000 },
} as const;

const CLINIC_TYPES = [
  "کلینیک تخصصی پوست، مو و لیزر",
  "مطب پزشک متخصص پوست (Dermatologist)",
  "مطب پزشک عمومی / فعال در حوزه زیبایی",
  "مرکز مراقبت پوست و اسپا (بیوتی‌تراپیست)",
  "شرکت پخش و توزیع‌کننده تجهیزات پزشکی / دارویی",
] as const;

const PROTOCOL_KITS = [
  {
    id: "carboxy-1500",
    name: "پک حرفه‌ای ژل کربوکسی ۱۵۰۰ میلی‌لیتر + ۵۰ ست ماسک صورت و گردن",
    tierMin: 1,
    tier1to9: "۵,۸۰۰,۰۰۰ تومان",
    tier10to19: "۴,۹۰۰,۰۰۰ تومان (۱۵٪ تخفیف)",
    tier20plus: "۴,۱۰۰,۰۰۰ تومان (۳۰٪ تخفیف کلینیکال)",
    badge: "پرفروش‌ترین کابین",
  },
  {
    id: "carboxy-cartridges-box10",
    name: "باکس ۱۰ عددی کارتریج‌های تک‌نفره ژل کربوکسی‌پیل (Box of 10)",
    tierMin: 1,
    tier1to9: "۲,۹۵۰,۰۰۰ تومان",
    tier10to19: "۲,۵۰۰,۰۰۰ تومان",
    tier20plus: "۲,۱۰۰,۰۰۰ تومان",
    badge: "Box of 10",
  },
  {
    id: "carboxy-cartridges-box20",
    name: "باکس ۲۰ عددی کارتریج ژل فعال‌ساز و ماسک اکتیویتور (Box of 20)",
    tierMin: 1,
    tier1to9: "۵,۴۰۰,۰۰۰ تومان",
    tier10to19: "۴,۵۰۰,۰۰۰ تومان",
    tier20plus: "۳,۸۰۰,۰۰۰ تومان",
    badge: "Box of 20 VIP",
  },
  {
    id: "barrier-laser-kit",
    name: "کیت حرفه‌ای ریکاوری سد دفاعی پس از لیزر (سرامید ۳:۱:۱ + مس‌پپتید)",
    tierMin: 5,
    tier1to9: "۳,۶۰۰,۰۰۰ تومان",
    tier10to19: "۳,۱۰۰,۰۰۰ تومان",
    tier20plus: "۲,۶۰۰,۰۰۰ تومان",
    badge: "Post-Procedure",
  },
];

const WORKSHOP_OPTIONS = [
  "ثبت‌نام کارگاه جامع کربوکسی‌تراپی بدون سوزن و پدیده بوهر (با سرتیفیکیت معتبر آکادمی)",
  "ثبت‌نام مسترکلاس پیلینگ‌های شیمیایی پیشرفته و ترمیم سد دفاعی پوست",
  "ثبت‌نام کارگاه ترکیب‌درمانی مس‌پپتید GHK-Cu و پروتکل‌های جوانسازی تهاجمی",
  "تمایلی به شرکت در ورکشاپ ندارم (صرفاً استعلام خرید اقلام مصرفی)",
] as const;

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown }).message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (Array.isArray(msg)) {
    const parts = msg.map((m) => (typeof m === "string" ? m : "")).filter(Boolean);
    if (parts.length) return parts.join("؛ ");
  }
  return null;
}

export default function B2BPage() {
  const [clinicType, setClinicType] = useState<string>(CLINIC_TYPES[0]);
  const [selectedKit, setSelectedKit] = useState<string>(PROTOCOL_KITS[0].id);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>(WORKSHOP_OPTIONS[0]);
  const [licenseFileSimulated, setLicenseFileSimulated] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [persisted, setPersisted] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFileSimulated(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setSuccess(null);
    setPersisted(true);

    const f = new FormData(form);
    const companyName = String(f.get("companyName") ?? "").trim();
    const contactName = String(f.get("contactName") ?? "").trim();
    const medicalLicenseNo = String(f.get("medicalLicenseNo") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const desiredQty = Math.floor(Number(f.get("desiredQty") ?? 0));
    const customNotes = String(f.get("customNotes") ?? "").trim();

    // Client validations
    if (companyName.length < RULES.companyName.min || companyName.length > RULES.companyName.max) {
      setError(`نام کلینیک / مرکز باید بین ${RULES.companyName.min} تا ${RULES.companyName.max} کاراکتر باشد.`);
      return;
    }
    if (contactName.length < RULES.contactName.min || contactName.length > RULES.contactName.max) {
      setError(`نام پزشک یا مدیر مرکز باید بین ${RULES.contactName.min} تا ${RULES.contactName.max} کاراکتر باشد.`);
      return;
    }
    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل پزشک/رابط باید با ۰۹ شروع شده و ۱۱ رقم باشد.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("قالب نشانی ایمیل معتبر نیست.");
      return;
    }
    if (!Number.isFinite(desiredQty) || desiredQty < RULES.desiredQty.min || desiredQty > RULES.desiredQty.max) {
      setError(
        `تعداد سفارش باید بین ${new Intl.NumberFormat("fa-IR").format(RULES.desiredQty.min)} تا ${new Intl.NumberFormat(
          "fa-IR"
        ).format(RULES.desiredQty.max)} باشد.`
      );
      return;
    }

    const kitObj = PROTOCOL_KITS.find((k) => k.id === selectedKit);

    // Structure a rich itemsSummary that captures verification and clinical quote needs
    const itemsSummaryLines = [
      `[نوع مرکز]: ${clinicType}`,
      medicalLicenseNo ? `[شماره نظام پزشکی / پروانه مطب]: ${medicalLicenseNo}` : `[پروانه مطب]: درخواست تأیید مستندات`,
      licenseFileSimulated ? `[فایل پیوست پروانه]: ${licenseFileSimulated}` : "",
      `[کیت پروتکل درخواستی]: ${kitObj?.name ?? "پک مصرفی کلینیکال"}`,
      `[تعداد کل درخواستی]: ${desiredQty} پکیج/کارتریج`,
      `[کارگاه و سرتیفیکیت آموزشی]: ${selectedWorkshop}`,
      customNotes ? `[توضیحات و نیازمندی‌های ویژه]: ${customNotes}` : "",
    ].filter(Boolean);

    const itemsSummary = itemsSummaryLines.join(" | ");

    if (itemsSummary.length < RULES.itemsSummary.min || itemsSummary.length > RULES.itemsSummary.max) {
      setError(`شرح سفارش باید بین ${RULES.itemsSummary.min} تا ${RULES.itemsSummary.max} کاراکتر باشد.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_HOST}/v1/b2b/quote-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "demo", // default storefront tenant isolation
        },
        body: JSON.stringify({
          companyName,
          contactName,
          phone,
          ...(email ? { email } : {}),
          itemsSummary,
          desiredQty,
        }),
        signal: AbortSignal.timeout(9000),
      });

      const data = (await res.json().catch(() => null)) as unknown;
      if (res.ok) {
        setSuccess(
          extractApiMessage(data) ??
            "درخواست استعلام قیمت همکار و احراز هویت پزشکی شما با موفقیت ثبت گردید. کارشناسان فروش کلینیکال ظرف حداکثر ۴ ساعت کاری با شما تماس خواهند گرفت."
        );
        setPersisted((data as { persisted?: boolean } | null)?.persisted !== false);
        form.reset();
        setLicenseFileSimulated(null);
      } else {
        setError(extractApiMessage(data) ?? `ثبت درخواست استعلام ناموفق بود (کد ${res.status}).`);
      }
    } catch {
      setError("اتصال به سرور برقرار نشد؛ لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش فرمایید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="b2b-page">
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "20px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/academy">آکادمی علوم پوست</Link>
        <span>/</span>
        <span>پورتال اختصاصی پزشکان و کلینیک‌ها (B2B)</span>
      </nav>

      {/* ── B2B Hero ── */}
      <div className="b2b-hero">
        <div className="b2b-hero-badge">
          <span>🩺</span>
          <span>پورتال همکاران، کلینیک‌های پوست و توزیع‌کنندگان مجاز</span>
        </div>
        <h1>سامانه استعلام قیمت عمده، تجهیزات مصرفی و احراز هویت پزشکی</h1>
        <p>
          دسترسی مستقیم پزشکان متخصص پوست، جراحان پلاستیک و مدیران کلینیک‌های زیبایی به پک‌های حرفه‌ای کابین
          (CarboxyGel Professional 1500ml)، قیمت‌گذاری پلکانی، ژل‌های کارتریجی و ورکشاپ‌های دارای گواهینامه معتبر آکادمی.
        </p>

        <div className="b2b-hero-ctas">
          <a href="#quote-form" className="b2b-btn-primary">
            فرم ثبت درخواست قیمت همکار و احراز پروانه مطب ↓
          </a>
          <Link href="/b2b/protocols" className="b2b-btn-outline">
            مشاهده کیت‌های مصرفی و پروتکل‌ها →
          </Link>
          <Link href="/b2b/workshops" className="b2b-btn-outline">
            تقویم ورکشاپ‌های تخصصی 📜
          </Link>
        </div>
      </div>

      {/* ── 4-step Registration & Verification Process ── */}
      <div className="b2b-steps">
        <div className="b2b-step">
          <span className="b2b-step-num">۱</span>
          <strong>احراز هویت پزشکی</strong>
          <span>ثبت شماره نظام پزشکی یا پروانه مطب جهت فعال‌سازی نرخ‌های کابین کلینیک.</span>
        </div>
        <div className="b2b-step">
          <span className="b2b-step-num">۲</span>
          <strong>انتخاب تی‌یر و پک مصرفی</strong>
          <span>انتخاب پک‌های Box of 10 / 20، کارتریج‌های ژل کربوکسی یا گالن‌های سالنی.</span>
        </div>
        <div className="b2b-step">
          <span className="b2b-step-num">۳</span>
          <strong>صدور پیش‌فاکتور رسمی</strong>
          <span>ارسال پیش‌فاکتور با تخفیف‌های پلکانی تا ۳۵٪ ظرف حداکثر ۴ ساعت کاری.</span>
        </div>
        <div className="b2b-step">
          <span className="b2b-step-num">۴</span>
          <strong>ارسال اکسپرس و پشتیبانی علمی</strong>
          <span>ارسال با زنجیره سرمایش استاندارد همراه با پروتکل‌بوک مکتوب و سرتیفیکیت.</span>
        </div>
      </div>

      {/* ── Section: Tiered Pricing Matrix ── */}
      <section className="b2b-section">
        <div className="b2b-section-header">
          <div className="eyebrow">Tiered Professional Pricing</div>
          <h2>جدول قیمت‌گذاری پلکانی و تخفیف‌های ویژه مراکز درمانی</h2>
          <p>تخفیف‌ها به صورت خودکار بر اساس حجم سفارش در پیش‌فاکتور رسمی لحاظ می‌گردد.</p>
        </div>

        <div className="tier-table-container">
          <table className="tier-table">
            <thead>
              <tr>
                <th>شرح محصول / پک کلینیکال</th>
                <th>سطح ۱ (۱ تا ۹ عدد)</th>
                <th>سطح ۲ (۱۰ تا ۱۹ عدد)</th>
                <th>سطح ۳ (۲۰ عدد به بالا - Box of 20)</th>
                <th>ویژگی اختصاصی کلینیک</th>
              </tr>
            </thead>
            <tbody>
              {PROTOCOL_KITS.map((kit) => (
                <tr key={kit.id}>
                  <td>
                    <strong>{kit.name}</strong>
                    <div style={{ marginTop: "4px" }}>
                      <span className="tier-badge">{kit.badge}</span>
                    </div>
                  </td>
                  <td>{kit.tier1to9}</td>
                  <td style={{ color: "var(--brand)", fontWeight: 700 }}>{kit.tier1to9 === kit.tier10to19 ? kit.tier10to19 : kit.tier10to19}</td>
                  <td style={{ color: "#047857", fontWeight: 800 }}>{kit.tier20plus}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>ارسال رایگان + پوستر آناتومی پروتکل</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section: Protocol Kits Showcase ── */}
      <section className="b2b-section">
        <div className="b2b-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div className="eyebrow">Clinical Treatment Bundles</div>
            <h2>کیت‌های مصرفی و دستگاهی ویژه کلینیک‌ها</h2>
            <p>آماده‌سازی کابین با فرمولاسیون‌های پایدار و ماسک‌های فعال‌ساز پیشرفته</p>
          </div>
          <Link href="/b2b/protocols" className="text-link" style={{ fontWeight: 700 }}>
            مشاهده جزئیات کامل کیت‌ها و ویدیوهای پروتکل ←
          </Link>
        </div>

        <div className="kits-grid">
          <div className="kit-card">
            <span className="kit-card-badge">CarboxyGel Professional 1500ml</span>
            <h3>پک ژل کربوکسی ۱۵۰۰ میلی‌لیتر + ۵۰ شیت ماسک</h3>
            <p>
              فرمولاسیون اختصاصی غنی‌شده با اسیدهای میوه و بافر بی‌کربنات سدیم با بالاترین راندمان تولید موضعی گاز CO₂ بر
              اساس اثر بوهر.
            </p>
            <div className="kit-specs">
              <span><strong>ظرفیت درمانی:</strong> ۵۰ جلسه فیشیال کامل صورت و گردن</span>
              <span><strong>غلظت گاز فعال:</strong> بیش از ۱۱۰۰ ppm در موضع</span>
              <span><strong>لوازم همراه:</strong> ۵۰ شیت ماسک صورت و ۵۰ پچ ساب‌منتال (غبغب)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedKit("carboxy-1500");
                const formElem = document.getElementById("quote-form");
                formElem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="b2b-btn-primary"
              style={{ justifyContent: "center", fontSize: "0.86rem", padding: "10px" }}
            >
              افزودن به فرم استعلام قیمت ↓
            </button>
          </div>

          <div className="kit-card">
            <span className="kit-card-badge">Single-Dose Cartridges</span>
            <h3>کارتریج‌های ژل تک‌دوز کربوکسی (Box of 20)</h3>
            <p>
              سرنگ‌های از پیش پرشده ۲۵ میلی‌لیتری جهت حفظ حداکثر استریلیته و دقت مصرف در هر سشن، بدون نیاز به اندازه‌گیری
              دستی توسط اپراتور.
            </p>
            <div className="kit-specs">
              <span><strong>تعداد در بسته:</strong> ۲۰ عدد سرنگ ۲۵ میلی‌لیتر</span>
              <span><strong>شیت‌های همراه:</strong> ۲۰ ست ماسک ارگونومیک صورت</span>
              <span><strong>صرفه‌جویی زمانی:</strong> آماده‌سازی در کمتر از ۳۰ ثانیه</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedKit("carboxy-cartridges-box20");
                const formElem = document.getElementById("quote-form");
                formElem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="b2b-btn-primary"
              style={{ justifyContent: "center", fontSize: "0.86rem", padding: "10px" }}
            >
              افزودن به فرم استعلام قیمت ↓
            </button>
          </div>

          <div className="kit-card">
            <span className="kit-card-badge">Post-Laser Barrier Recovery</span>
            <h3>کیت بازسازی سد دفاعی پوست آسیب‌دیده</h3>
            <p>
              طراحی‌شده ویژه استفاده بلافاصله پس از پروسیجرهای لیزر CO₂، میکرونیدلینگ و رادیوفرکوئنسی برای مهار TEWL و
              جلوگیری از هایپرپیگمانتاسیون.
            </p>
            <div className="kit-specs">
              <span><strong>ترکیبات:</strong> کمپلکس سرامید ۳:۱:۱ + مادکاسوساید ۹۵٪</span>
              <span><strong>اقلام:</strong> ۱۰ عدد امولسیون ۵۰ میلی‌لیتر استریل</span>
              <span><strong>ایمنی بالینی:</strong> فاقد بو، اسانس و الکل‌های تحریک‌کننده</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedKit("barrier-laser-kit");
                const formElem = document.getElementById("quote-form");
                formElem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="b2b-btn-primary"
              style={{ justifyContent: "center", fontSize: "0.86rem", padding: "10px" }}
            >
              افزودن به فرم استعلام قیمت ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── Section: Workshops and Certification Booking ── */}
      <section id="workshops" className="b2b-section">
        <div className="b2b-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div className="eyebrow">Medical Training & Hands-On Workshops</div>
            <h2>ورکشاپ‌های کلینیکی و صدور گواهینامه معتبر آکادمی</h2>
            <p>آموزش عملی متدهای درمانی بدون سوزن، پروتکل‌های پیلینگ و درمان‌های ترکیبی با تدریس متخصصان پوست</p>
          </div>
          <Link href="/b2b/workshops" className="text-link" style={{ fontWeight: 700 }}>
            مشاهده سرفصل‌های آموزشی و اساتید دوره ←
          </Link>
        </div>

        <div className="workshops-grid">
          <div className="workshop-card">
            <div className="workshop-meta">
              <span>📅 پنجشنبه ۲۱ آبان ۱۴۰۵</span>
              <span>📍 سالن همایش‌های آکادمی پوست</span>
            </div>
            <h3>ورکشاپ جامع کربوکسی‌تراپی بدون سوزن (Bohr Effect Masterclass)</h3>
            <p>
              آموزش تئوری فیزیولوژی تبادل گاز CO₂، تنظیم فشار و واکنش بوهر، همراه با هندزآن بر روی بیمار و آموزش تکنیک
              ترکیب با اولتراسوند و ماسک‌های هیدروژلی.
            </p>
            <div style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 700, marginBottom: "14px" }}>
              ✓ اعطای سرتیفیکیت رسمی ممهور به امضای متخصصین درماتولوژی
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedWorkshop(WORKSHOP_OPTIONS[0]);
                const formElem = document.getElementById("quote-form");
                formElem?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--brand-deep)",
                padding: "8px 14px",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.84rem",
              }}
            >
              رزرو سهمیه ورکشاپ در فرم زیر ↓
            </button>
          </div>

          <div className="workshop-card">
            <div className="workshop-meta">
              <span>📅 جمعه ۲۲ آبان ۱۴۰۵</span>
              <span>📍 کلینیک آموزش بالینی</span>
            </div>
            <h3>دوره پیشرفته لایه‌بردارهای شیمیایی و مدیریت عوارض لیزر</h3>
            <p>
              انتخاب اسید مناسب بر اساس فیتزپاتریک بیمار، پروتکل‌های خنثی‌سازی، مدیریت سوختگی‌های تصادفی، و بازیابی فوری
              سد پوستی با بیومیمتیک سرامیدها.
            </p>
            <div style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 700, marginBottom: "14px" }}>
              ✓ همراه با کیت سمپل کامل اسیدهای آکادمی
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedWorkshop(WORKSHOP_OPTIONS[1]);
                const formElem = document.getElementById("quote-form");
                formElem?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--brand-deep)",
                padding: "8px 14px",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.84rem",
              }}
            >
              رزرو سهمیه ورکشاپ در فرم زیر ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── Main B2B Quote & Medical License Form ── */}
      <section id="quote-form" className="b2b-section">
        <form onSubmit={handleSubmit} className="b2b-form">
          <div className="b2b-form-header">
            <h2>فرم استعلام قیمت همکار و احراز پروانه پزشکی</h2>
            <p>
              اطلاعات ثبت‌شده توسط کارشناسان تأیید مدارک پزشکی بررسی و پیش‌فاکتور با تخفیف‌های کلینیکال صادر خواهد شد.
            </p>
          </div>

          <div className="b2b-form-grid">
            {/* Clinic Type */}
            <label className="form-field">
              <span>نوع مرکز درمانی / متقاضی *</span>
              <select
                className="select-input"
                value={clinicType}
                onChange={(e) => setClinicType(e.target.value)}
              >
                {CLINIC_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            {/* Clinic / Company Name */}
            <label className="form-field">
              <span>نام کلینیک / مرکز درمانی / شرکت *</span>
              <input
                name="companyName"
                required
                className="input-text"
                placeholder="مثال: کلینیک تخصصی پوست و لیزر سپهر"
              />
            </label>

            {/* Contact Name */}
            <label className="form-field">
              <span>نام و نام خانوادگی پزشک یا مسئول فنی *</span>
              <input
                name="contactName"
                required
                className="input-text"
                placeholder="مثال: دکتر سارا جلالی"
              />
            </label>

            {/* Medical License / Council Number */}
            <label className="form-field">
              <span>شماره نظام پزشکی / شماره پروانه مطب (اختیاری)</span>
              <input
                name="medicalLicenseNo"
                dir="ltr"
                className="input-text"
                placeholder="مثال: ۱۲۹۸۴۵ یا پروانه کلینیک"
              />
              <small>جهت تأیید سریع‌تر و برخورداری از آفر ویژه افتتاحیه کلینیک</small>
            </label>

            {/* Phone */}
            <label className="form-field">
              <span>شماره موبایل پزشک یا مدیر خرید *</span>
              <input
                name="phone"
                required
                dir="ltr"
                pattern="09\d{9}"
                inputMode="numeric"
                className="input-text"
                placeholder="09123456789"
              />
              <small>۱۱ رقم و آغاز با ۰۹ (پیش‌فاکتور از طریق پیامک و واتساپ ارسال می‌شود)</small>
            </label>

            {/* Email */}
            <label className="form-field">
              <span>نشانی ایمیل رسمی کلینیک (اختیاری)</span>
              <input
                name="email"
                type="email"
                dir="ltr"
                className="input-text"
                placeholder="clinic@example.com"
              />
            </label>

            {/* Selected Kit */}
            <label className="form-field">
              <span>پک یا محصول پروتکل انتخابی *</span>
              <select
                className="select-input"
                value={selectedKit}
                onChange={(e) => setSelectedKit(e.target.value)}
              >
                {PROTOCOL_KITS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.badge})
                  </option>
                ))}
              </select>
            </label>

            {/* Desired Quantity */}
            <label className="form-field">
              <span>تعداد کل درخواستی (جعبه / پکیج) *</span>
              <input
                name="desiredQty"
                required
                type="number"
                min={1}
                max={100000}
                defaultValue={10}
                dir="ltr"
                className="input-text"
              />
              <small>سفارش‌های بالای ۱۰ و ۲۰ عدد شامل تخفیف‌های ویژه Box of 10/20 هستند</small>
            </label>

            {/* Workshop Booking */}
            <label className="form-field b2b-full-width">
              <span>ثبت‌نام و رزرو کارگاه آموزشی دارای سرتیفیکیت (اختیاری)</span>
              <select
                className="select-input"
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
              >
                {WORKSHOP_OPTIONS.map((w, idx) => (
                  <option key={idx} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </label>

            {/* Medical License Document Upload (Simulated file input) */}
            <div className="form-field b2b-full-width">
              <span>تصویر کارت نظام پزشکی یا پروانه مطب (اختیاری جهت تسریع اعتبارسنجی)</span>
              <label className="b2b-file-upload">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <div style={{ color: "var(--brand-deep)", fontWeight: 700, fontSize: "0.9rem" }}>
                  📁 {licenseFileSimulated ? `فایل انتخاب‌شده: ${licenseFileSimulated}` : "انتخاب یا کشیدن تصویر پروانه مطب / کارت نظام پزشکی"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "4px" }}>
                  فرمت‌های مجاز: JPG, PNG, PDF (حداکثر ۵ مگابایت)
                </div>
              </label>
            </div>

            {/* Custom Notes */}
            <label className="form-field b2b-full-width">
              <span>توضیحات تکمیلی، تعداد شعب یا شرایط خاص پرداخت</span>
              <textarea
                name="customNotes"
                rows={3}
                className="input-textarea"
                placeholder="مثال: درخواست عقد قرارداد سالانه برای ۳ شعبه کلینیک، ارسال نمونه تستر ژل کربوکسی، شرایط تسویه اعتباری..."
              />
            </label>
          </div>

          <button type="submit" className="btn-purchase-action" disabled={submitting}>
            {submitting ? "در حال ثبت و ارسال استعلام…" : "ارسال درخواست استعلام قیمت و احراز هویت پزشکی"}
          </button>

          <p className="b2b-hint">
            🔒 اطلاعات پزشکی و تماس شما به صورت محرمانه در سیستم ثبت می‌گردد. پس از بررسی مدارک، پیش‌فاکتور رسمی با
            تخفیف‌های پلکانی برای شماره تلفن اعلام‌شده ارسال خواهد شد.
          </p>
        </form>

        {success && (
          <div className="b2b-success" role="status">
            <strong>{success}</strong>
            {!persisted && (
              <p className="b2b-persist-note">
                سرور در حالت آماده‌باش ثبت سرنخ است و اطلاعات شما به محض هماهنگی پایگاه داده ذخیره پایدار خواهد شد.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="b2b-error" role="alert">
            {error}
          </div>
        )}
      </section>
    </section>
  );
}
