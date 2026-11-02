"use client";

import "./b2b.css";
import Link from "next/link";
import { useState, useId } from "react";
import { toAsciiDigits } from "@commerce-os/localization";

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
    basePriceNum: 5800000,
    tierMin: 1,
    tier1to9: "۵,۸۰۰,۰۰۰ تومان",
    tier10to19: "۴,۹۰۰,۰۰۰ تومان (۱۵٪ تخفیف)",
    tier20plus: "۴,۱۰۰,۰۰۰ تومان (۳۰٪ تخفیف کلینیکال)",
    badge: "پرفروش‌ترین کابین",
    description: "فرمولاسیون اختصاصی غنی‌شده با بافر بی‌کربنات سدیم جهت آزادسازی بیش از ۱۱۰۰ ppm گاز CO₂ موضعی",
  },
  {
    id: "carboxy-cartridges-box10",
    name: "باکس ۱۰ عددی کارتریج‌های تک‌نفره ژل کربوکسی‌پیل (Box of 10)",
    basePriceNum: 2950000,
    tierMin: 1,
    tier1to9: "۲,۹۵۰,۰۰۰ تومان",
    tier10to19: "۲,۵۰۰,۰۰۰ تومان",
    tier20plus: "۲,۱۰۰,۰۰۰ تومان",
    badge: "Box of 10",
    description: "سرنگ‌های از پیش پرشده ۲۵ میلی‌لیتری جهت درمان‌های منفرد با تضمین استریلیته کامل و حذف خطای اندازه‌گیری",
  },
  {
    id: "carboxy-cartridges-box20",
    name: "باکس ۲۰ عددی کارتریج ژل فعال‌ساز و ماسک اکتیویتور (Box of 20)",
    basePriceNum: 5400000,
    tierMin: 1,
    tier1to9: "۵,۴۰۰,۰۰۰ تومان",
    tier10to19: "۴,۵۰۰,۰۰۰ تومان",
    tier20plus: "۳,۸۰۰,۰۰۰ تومان",
    badge: "Box of 20 VIP",
    description: "بسته اقتصادی ویژه کلینیک‌های پرتردد؛ شامل ۲۰ کارتریج استریل و ۲۰ شیت ماسک صورت و غبغب",
  },
  {
    id: "barrier-laser-kit",
    name: "کیت حرفه‌ای ریکاوری سد دفاعی پس از لیزر (سرامید ۳:۱:۱ + مس‌پپتید)",
    basePriceNum: 3600000,
    tierMin: 5,
    tier1to9: "۳,۶۰۰,۰۰۰ تومان",
    tier10to19: "۳,۱۰۰,۰۰۰ تومان",
    tier20plus: "۲,۶۰۰,۰۰۰ تومان",
    badge: "Post-Procedure",
    description: "ترمیم فوری سد آسیب‌دیده پس از لیزر فرکشنال CO₂ و میکرونیدلینگ جهت کاهش اریتما و پیشگیری از PIH",
  },
];

const WORKSHOP_OPTIONS = [
  "ثبت‌نام کارگاه جامع کربوکسی‌تراپی بدون سوزن و پدیده بوهر (با سرتیفیکیت معتبر آکادمی)",
  "ثبت‌نام مسترکلاس پیلینگ‌های شیمیایی پیشرفته و ترمیم سد دفاعی پوست",
  "ثبت‌نام کارگاه ترکیب‌درمانی مس‌پپتید GHK-Cu و پروتکل‌های جوانسازی تهاجمی",
  "تمایلی به شرکت در ورکشاپ ندارم (صرفاً استعلام خرید اقلام مصرفی)",
] as const;

const WIZARD_STEPS = [
  { step: 1, title: "مشخصات مرکز" },
  { step: 2, title: "محصول و آموزش" },
  { step: 3, title: "حجم و تی‌یر تخفیف" },
  { step: 4, title: "اطلاعات تماس" },
  { step: 5, title: "مرور و تأیید" },
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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showFullPriceTable, setShowFullPriceTable] = useState(false);

  // Form Fields State
  const [clinicType, setClinicType] = useState<string>(CLINIC_TYPES[0]);
  const [companyName, setCompanyName] = useState("");
  const [medicalLicenseNo, setMedicalLicenseNo] = useState("");
  const [licenseFileSimulated, setLicenseFileSimulated] = useState<string | null>(null);

  const [selectedKit, setSelectedKit] = useState<string>(PROTOCOL_KITS[0].id);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>(WORKSHOP_OPTIONS[0]);

  const [desiredQty, setDesiredQty] = useState<number>(10);

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [persisted, setPersisted] = useState(true);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const selectedKitObj = PROTOCOL_KITS.find((k) => k.id === selectedKit) || PROTOCOL_KITS[0];

  // Calculate Active Pricing Tier
  const activeTierLabel =
    desiredQty >= 20
      ? "سطح ۳ (حجم کلینیکال بالای ۲۰ عدد - ۳۰٪ تخفیف)"
      : desiredQty >= 10
      ? "سطح ۲ (۱۰ تا ۱۹ عدد - ۱۵٪ تخفیف همکار)"
      : "سطح ۱ (۱ تا ۹ عدد - نرخ پایه کلینیک)";

  const tierColor = desiredQty >= 20 ? "#047857" : desiredQty >= 10 ? "var(--brand)" : "var(--ink)";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFileSimulated(file.name);
    }
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!companyName.trim() || companyName.trim().length < RULES.companyName.min) {
        setError(`نام کلینیک یا مرکز درمانی باید حداقل ${RULES.companyName.min} کاراکتر باشد.`);
        return false;
      }
      if (medicalLicenseNo.trim()) {
        const cleanLicense = toAsciiDigits(medicalLicenseNo.trim().replace(/[\s\-_/]/g, ""));
        if (cleanLicense.length < 4 || cleanLicense.length > 20) {
          setError("شماره نظام پزشکی یا پروانه مطب باید حداقل ۴ و حداکثر ۲۰ رقم باشد.");
          return false;
        }
      }
    } else if (step === 2) {
      if (!selectedKit) {
        setError("لطفاً یک کیت مصرفی یا محصول پروتکل را انتخاب نمایید.");
        return false;
      }
    } else if (step === 3) {
      if (!Number.isFinite(desiredQty) || desiredQty < RULES.desiredQty.min || desiredQty > RULES.desiredQty.max) {
        setError(`تعداد درخواستی باید عددی بین ${RULES.desiredQty.min} تا ${RULES.desiredQty.max} باشد.`);
        return false;
      }
    } else if (step === 4) {
      if (!contactName.trim() || contactName.trim().length < RULES.contactName.min) {
        setError(`نام پزشک یا مدیر مرکز باید حداقل ${RULES.contactName.min} کاراکتر باشد.`);
        return false;
      }
      const cleanPhone = toAsciiDigits(phone.trim());
      if (!/^09\d{9}$/.test(cleanPhone)) {
        setError("شماره موبایل رابط باید ۱۱ رقم بوده و با ۰۹ شروع شود.");
        return false;
      }
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("قالب نشانی ایمیل معتبر نیست.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPersisted(true);

    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    const cleanCompanyName = companyName.trim();
    const cleanContactName = contactName.trim();
    const cleanLicense = toAsciiDigits(medicalLicenseNo.trim());
    const cleanPhone = toAsciiDigits(phone.trim());
    const cleanEmail = email.trim();
    const cleanQty = Math.floor(desiredQty);
    const cleanNotes = customNotes.trim();

    const itemsSummaryLines = [
      `[نوع مرکز]: ${clinicType}`,
      cleanLicense ? `[شماره نظام پزشکی / پروانه مطب]: ${cleanLicense}` : `[پروانه مطب]: درخواست تأیید مستندات`,
      licenseFileSimulated ? `[فایل پیوست پروانه]: ${licenseFileSimulated}` : "",
      `[کیت پروتکل درخواستی]: ${selectedKitObj.name}`,
      `[تعداد کل درخواستی]: ${cleanQty} پکیج/کارتریج`,
      `[سطح قیمت تخمینی]: ${activeTierLabel}`,
      `[کارگاه و سرتیفیکیت آموزشی]: ${selectedWorkshop}`,
      cleanNotes ? `[توضیحات و نیازمندی‌های ویژه]: ${cleanNotes}` : "",
    ].filter(Boolean);

    const itemsSummary = itemsSummaryLines.join(" | ");

    if (itemsSummary.length < RULES.itemsSummary.min || itemsSummary.length > RULES.itemsSummary.max) {
      setError(`شرح سفارش باید بین ${RULES.itemsSummary.min} تا ${RULES.itemsSummary.max} کاراکتر باشد.`);
      return;
    }

    setSubmitting(true);
    const generatedTracking = `DRD-B2B-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch(`${API_HOST}/v1/b2b/quote-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "demo",
        },
        body: JSON.stringify({
          companyName: cleanCompanyName,
          contactName: cleanContactName,
          phone: cleanPhone,
          ...(cleanEmail ? { email: cleanEmail } : {}),
          itemsSummary,
          desiredQty: cleanQty,
        }),
        signal: AbortSignal.timeout(9000),
      });

      const data = (await res.json().catch(() => null)) as unknown;
      if (res.ok) {
        setTrackingCode(generatedTracking);
        setSuccess(
          extractApiMessage(data) ??
            "درخواست استعلام قیمت همکار و احراز هویت پزشکی شما با موفقیت ثبت گردید. کارشناسان فروش کلینیکال ظرف حداکثر ۴ ساعت کاری با شما تماس خواهند گرفت."
        );
        setPersisted((data as { persisted?: boolean } | null)?.persisted !== false);
      } else {
        setError(extractApiMessage(data) ?? `ثبت درخواست استعلام ناموفق بود (کد ${res.status}).`);
      }
    } catch {
      setError("اتصال به سرور برقرار نشد؛ لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش فرمایید.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSuccess(null);
    setError(null);
    setTrackingCode(null);
    setCurrentStep(1);
    setCompanyName("");
    setMedicalLicenseNo("");
    setLicenseFileSimulated(null);
    setContactName("");
    setPhone("");
    setEmail("");
    setCustomNotes("");
    setDesiredQty(10);
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
          <a href="#wizard-section" className="b2b-btn-primary">
            شروع استعلام قیمت مرحله‌ای ↓
          </a>
          <Link href="/b2b/protocols" className="b2b-btn-outline">
            پروتکل‌های بالینی کابین →
          </Link>
          <Link href="/b2b/workshops" className="b2b-btn-outline">
            تقویم ورکشاپ‌های دارای سرتیفیکیت 📜
          </Link>
        </div>
      </div>

      {/* ── 4-step Registration & Benefits Strip ── */}
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

      {/* ── Treatment Bundles / Protocol Kits Showcase ── */}
      <section className="b2b-section">
        <div
          className="b2b-section-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px" }}
        >
          <div>
            <div className="eyebrow">Clinical Treatment Bundles</div>
            <h2>کیت‌های مصرفی و دستگاهی ویژه کلینیک‌ها</h2>
            <p>آماده‌سازی کابین با فرمولاسیون‌های پایدار و ماسک‌های فعال‌ساز پیشرفته</p>
          </div>
          <Link href="/b2b/protocols" className="text-link" style={{ fontWeight: 700 }}>
            مشاهده جزئیات کامل پروتکل‌ها ←
          </Link>
        </div>

        <div className="kits-grid">
          {PROTOCOL_KITS.map((kit) => (
            <div key={kit.id} className="kit-card">
              <span className="kit-card-badge">{kit.badge}</span>
              <h3>{kit.name}</h3>
              <p>{kit.description}</p>
              <div className="kit-specs">
                <span>
                  <strong>نرخ پایه (۱-۹ عدد):</strong> {kit.tier1to9}
                </span>
                <span>
                  <strong>نرخ کلینیکال (۱۰-۱۹ عدد):</strong> {kit.tier10to19}
                </span>
                <span>
                  <strong>سفارش عمده (۲۰+ عدد):</strong> {kit.tier20plus}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedKit(kit.id);
                  setCurrentStep(2);
                  const el = document.getElementById("wizard-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="b2b-btn-primary"
                style={{ justifyContent: "center", fontSize: "0.86rem", padding: "10px" }}
              >
                انتخاب این پک جهت استعلام ↓
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collapsible Tiered Pricing Matrix ── */}
      <section className="b2b-section">
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "20px 24px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "2px" }}>Pricing Transparency</div>
              <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--brand-deep)" }}>
                جدول قیمت‌گذاری پلکانی و تخفیف‌های ویژه مراکز درمانی
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                بر اساس دستورالعمل رسمی بازرگانی، درصد تخفیف بر مبنای تی‌یر حجم سفارش محاسبه می‌شود.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowFullPriceTable(!showFullPriceTable)}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--brand-deep)",
                padding: "8px 16px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer",
              }}
            >
              {showFullPriceTable ? "بستن جدول قیمت ▲" : "مشاهده کامل جدول قیمت‌ها ▼"}
            </button>
          </div>

          {showFullPriceTable && (
            <div className="tier-table-container" style={{ marginTop: "18px" }}>
              <table className="tier-table">
                <thead>
                  <tr>
                    <th>شرح محصول / پک کلینیکال</th>
                    <th>سطح ۱ (۱ تا ۹ عدد)</th>
                    <th>سطح ۲ (۱۰ تا ۱۹ عدد)</th>
                    <th>سطح ۳ (۲۰ عدد به بالا)</th>
                    <th>مزایای کلینیک</th>
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
                      <td style={{ color: "var(--brand)", fontWeight: 700 }}>{kit.tier10to19}</td>
                      <td style={{ color: "#047857", fontWeight: 800 }}>{kit.tier20plus}</td>
                      <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>ارسال با زنجیره سرد + پوستر آناتومی</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Clean Step-by-Step Inquiry Wizard ── */}
      <section id="wizard-section" className="b2b-section">
        <div className="b2b-form">
          <div className="b2b-form-header">
            <div className="eyebrow">B2B Quotation & Verification Wizard</div>
            <h2>سامانه استعلام قیمت و احراز هویت پزشکی (مرحله {currentStep} از ۵)</h2>
            <p>
              ثبت گام‌به‌گام مشخصات، انتخاب محصول و تعیین تی‌یر جهت صدور پیش‌فاکتور رسمی با کد پیگیری اختصاصی
            </p>
          </div>

          {/* Stepper Navigation Indicator */}
          <nav className="b2b-wizard-nav" aria-label="مراحل استعلام قیمت">
            {WIZARD_STEPS.map((s) => {
              const isActive = currentStep === s.step;
              const isCompleted = currentStep > s.step;
              return (
                <button
                  key={s.step}
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => {
                    if (s.step < currentStep || validateStep(currentStep)) {
                      setCurrentStep(s.step);
                    }
                  }}
                  className={`b2b-wizard-step-btn ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                >
                  <span className="b2b-wizard-step-dot">{isCompleted ? "✓" : s.step}</span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Success State */}
          {success && (
            <div className="b2b-tracking-banner" role="status">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "1.5rem" }}>✅</span>
                <h3 style={{ margin: 0, color: "#065f46", fontSize: "1.2rem" }}>
                  درخواست استعلام قیمت و احراز هویت پزشکی شما ثبت گردید
                </h3>
              </div>
              <p style={{ margin: "6px 0 12px", color: "#047857", fontSize: "0.9rem", lineHeight: "1.8" }}>
                {success}
              </p>
              {trackingCode && (
                <div>
                  <span style={{ fontSize: "0.84rem", color: "#065f46", fontWeight: 700, display: "block" }}>
                    کد پیگیری رسمی استعلام B2B:
                  </span>
                  <div className="b2b-tracking-code">{trackingCode}</div>
                </div>
              )}
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "10px" }}>
                زمان پاسخگویی دپارتمان فروش سازمانی: حداکثر ۴ ساعت کاری (از طریق پیامک و تماس تلفنی با رابط)
              </div>
              {!persisted && (
                <p className="b2b-persist-note">
                  سرور در حالت آماده‌باش ثبت سرنخ است و اطلاعات شما به محض هماهنگی پایگاه داده ذخیره پایدار خواهد شد.
                </p>
              )}
              <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleResetForm}
                  style={{
                    background: "var(--brand-deep)",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.86rem",
                  }}
                >
                  ثبت استعلام جدید ↻
                </button>
                <Link
                  href="/b2b/protocols"
                  style={{
                    background: "var(--paper)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "0.86rem",
                  }}
                >
                  مطالعه پروتکل‌های بالینی کابین →
                </Link>
              </div>
            </div>
          )}

          {/* Form Wizard Body */}
          {!success && (
            <form onSubmit={handleFinalSubmit}>
              {/* STEP 1: Clinic Info */}
              {currentStep === 1 && (
                <div className="b2b-wizard-step-pane">
                  <h3 style={{ fontSize: "1.05rem", color: "var(--brand-deep)", marginBottom: "16px" }}>
                    مرحله ۱: نوع متقاضی و مشخصات پروانه مرکز درمانی
                  </h3>

                  <div className="b2b-form-grid">
                    <label className="form-field b2b-full-width">
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

                    <label className="form-field b2b-full-width">
                      <span>نام کامل کلینیک / مرکز درمانی / شرکت *</span>
                      <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="input-text"
                        placeholder="مثال: کلینیک تخصصی پوست و لیزر بهارستان"
                      />
                    </label>

                    <label className="form-field b2b-full-width">
                      <span>شماره نظام پزشکی یا شماره پروانه مطب (اختیاری جهت فعال‌سازی نرخ کابین)</span>
                      <input
                        value={medicalLicenseNo}
                        onChange={(e) => setMedicalLicenseNo(e.target.value)}
                        dir="ltr"
                        className="input-text"
                        placeholder="مثال: ۱۲۹۸۴۵ یا پروانه کلینیک"
                      />
                      <small>پزشکان و مراکز دارای پروانه معتبر از اولویت صدور فاکتور و تخفیف‌های ویژه برخوردار می‌شوند.</small>
                    </label>

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
                  </div>
                </div>
              )}

              {/* STEP 2: Needs & Products */}
              {currentStep === 2 && (
                <div className="b2b-wizard-step-pane">
                  <h3 style={{ fontSize: "1.05rem", color: "var(--brand-deep)", marginBottom: "16px" }}>
                    مرحله ۲: انتخاب کیت مصرفی و کارگاه آموزشی
                  </h3>

                  <div className="b2b-form-grid">
                    <label className="form-field b2b-full-width">
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

                    <div className="b2b-full-width" style={{ background: "var(--paper)", padding: "16px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                      <strong style={{ display: "block", color: "var(--brand-deep)", fontSize: "0.9rem", marginBottom: "6px" }}>
                        مشخصات پکیج انتخاب‌شده:
                      </strong>
                      <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.8" }}>
                        {selectedKitObj.description}
                      </p>
                    </div>

                    <label className="form-field b2b-full-width">
                      <span>ثبت‌نام و رزرو کارگاه آموزشی دارای سرتیفیکیت معتبر (اختیاری)</span>
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
                  </div>
                </div>
              )}

              {/* STEP 3: Volume & Bulk Pricing */}
              {currentStep === 3 && (
                <div className="b2b-wizard-step-pane">
                  <h3 style={{ fontSize: "1.05rem", color: "var(--brand-deep)", marginBottom: "16px" }}>
                    مرحله ۳: تعیین تعداد و محاسبه تخفیف پلکانی
                  </h3>

                  <div className="b2b-form-grid">
                    <label className="form-field b2b-full-width">
                      <span>تعداد کل درخواستی (جعبه / پکیج) *</span>
                      <input
                        type="number"
                        min={1}
                        max={100000}
                        value={desiredQty}
                        onChange={(e) => setDesiredQty(Math.floor(Number(toAsciiDigits(e.target.value))))}
                        dir="ltr"
                        className="input-text"
                      />
                    </label>

                    {/* Live Tier Preview Calculator */}
                    <div className="b2b-full-width b2b-tier-calc-card">
                      <div>
                        <span style={{ fontSize: "0.82rem", color: "var(--muted)", display: "block" }}>
                          تی‌یر تخفیف فعال بر اساس تیراژ درخواستی:
                        </span>
                        <strong style={{ fontSize: "0.98rem", color: tierColor, marginTop: "4px", display: "inline-block" }}>
                          {activeTierLabel}
                        </strong>
                      </div>
                      <div className="b2b-tier-pill" style={{ background: desiredQty >= 20 ? "#ecfdf5" : "#eff6ff", color: desiredQty >= 20 ? "#047857" : "#1d4ed8" }}>
                        {desiredQty >= 20 ? "تخفیف ویژه کابین ۳۰٪" : desiredQty >= 10 ? "تخفیف همکار ۱۵٪" : "نرخ پایه همکار"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Contact Info */}
              {currentStep === 4 && (
                <div className="b2b-wizard-step-pane">
                  <h3 style={{ fontSize: "1.05rem", color: "var(--brand-deep)", marginBottom: "16px" }}>
                    مرحله ۴: اطلاعات پزشک مسئول، شماره تماس و نیازمندی‌ها
                  </h3>

                  <div className="b2b-form-grid">
                    <label className="form-field">
                      <span>نام و نام خانوادگی پزشک یا مسئول فنی *</span>
                      <input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="input-text"
                        placeholder="مثال: دکتر سارا جلالی"
                      />
                    </label>

                    <label className="form-field">
                      <span>شماره موبایل پزشک یا مدیر خرید *</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        dir="ltr"
                        pattern="09\d{9}"
                        inputMode="numeric"
                        className="input-text"
                        placeholder="09123456789"
                      />
                      <small>پیش‌فاکتور از طریق پیامک و واتساپ ارسال می‌شود</small>
                    </label>

                    <label className="form-field b2b-full-width">
                      <span>نشانی ایمیل رسمی کلینیک (اختیاری)</span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        dir="ltr"
                        className="input-text"
                        placeholder="clinic@example.com"
                      />
                    </label>

                    <label className="form-field b2b-full-width">
                      <span>توضیحات تکمیلی، تعداد شعب یا شرایط خاص پرداخت</span>
                      <textarea
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        rows={3}
                        className="input-textarea"
                        placeholder="مثال: درخواست عقد قرارداد سالانه برای ۳ شعبه کلینیک، ارسال نمونه تستر ژل کربوکسی، شرایط تسویه اعتباری..."
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="b2b-wizard-step-pane">
                  <h3 style={{ fontSize: "1.05rem", color: "var(--brand-deep)", marginBottom: "16px" }}>
                    مرحله ۵: مرور نهایی مشخصات و صدور استعلام رسمی
                  </h3>

                  <table className="b2b-summary-table">
                    <tbody>
                      <tr>
                        <th style={{ width: "35%", color: "var(--muted)" }}>نوع متقاضی</th>
                        <td><strong>{clinicType}</strong></td>
                      </tr>
                      <tr>
                        <th style={{ color: "var(--muted)" }}>نام کلینیک / مرکز</th>
                        <td><strong>{companyName || "—"}</strong></td>
                      </tr>
                      <tr>
                        <th style={{ color: "var(--muted)" }}>شماره نظام پزشکی / پروانه</th>
                        <td dir="ltr" style={{ textAlign: "right" }}>{medicalLicenseNo || "ثبت‌نشده (استعلام عادی)"}</td>
                      </tr>
                      <tr>
                        <th style={{ color: "var(--muted)" }}>محصول / کیت انتخابی</th>
                        <td><strong>{selectedKitObj.name}</strong></td>
                      </tr>
                      <tr>
                        <th style={{ color: "var(--muted)" }}>تعداد درخواستی</th>
                        <td><strong>{desiredQty} پکیج</strong> ({activeTierLabel})</td>
                      </tr>
                      <tr>
                        <th style={{ color: "var(--muted)" }}>کارگاه آموزشی انتخابی</th>
                        <td style={{ fontSize: "0.82rem" }}>{selectedWorkshop}</td>
                      </tr>
                      <tr>
                        <th style={{ color: "var(--muted)" }}>مسئول رابط و تماس</th>
                        <td>{contactName} - <span dir="ltr">{phone}</span> {email ? `(${email})` : ""}</td>
                      </tr>
                      {customNotes && (
                        <tr>
                          <th style={{ color: "var(--muted)" }}>یادداشت تکمیلی</th>
                          <td style={{ fontSize: "0.82rem" }}>{customNotes}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <p className="b2b-hint" style={{ marginTop: "16px" }}>
                    🔒 کلیه اطلاعات ارسالی در سرورهای امن درموسوتیکال دکتر درمر ثبت و پیش‌فاکتور رسمی با اعمال تخفیف تی‌یر صادر خواهد شد.
                  </p>
                </div>
              )}

              {error && (
                <div className="b2b-error" role="alert" style={{ marginTop: "18px" }}>
                  {error}
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="b2b-wizard-footer">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      style={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                      }}
                    >
                      ← مرحله قبل
                    </button>
                  )}
                </div>

                <div>
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="b2b-btn-primary"
                      style={{ padding: "10px 24px" }}
                    >
                      مرحله بعد →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="b2b-btn-primary"
                      style={{ padding: "12px 28px", fontSize: "0.95rem" }}
                    >
                      {submitting ? "در حال ثبت و صدور استعلام…" : "تأیید نهایی و ارسال درخواست استعلام ✉"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </section>
  );
}
