"use client";

import "./b2b.css";
import { useState } from "react";

const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ── Persian client validation mirroring the API rules ── */
const RULES = {
  companyName: { min: 2, max: 200 },
  contactName: { min: 2, max: 150 },
  itemsSummary: { min: 5, max: 2000 },
  desiredQty: { min: 1, max: 100000 },
} as const;

const B2B_STEPS = [
  { n: "۱", title: "ثبت درخواست", desc: "فرم زیر را با مشخصات شرکت و اقلام موردنیاز پر کنید." },
  { n: "۲", title: "پیش‌فاکتور ادمین", desc: "کارشناسان فروش سازمانی پیش‌فاکتور با تخفیف پلکانی صادر می‌کنند." },
  { n: "۳", title: "قرارداد و ارسال", desc: "پس از تأیید قرارداد، سفارش عمده با ارسال ویژه ارسال می‌شود." },
];

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [persisted, setPersisted] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // capture sync: currentTarget is null after await
    setError(null);
    setSuccess(null);
    setPersisted(true);

    const f = new FormData(form);
    const companyName = String(f.get("companyName") ?? "").trim();
    const contactName = String(f.get("contactName") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const itemsSummary = String(f.get("itemsSummary") ?? "").trim();
    const desiredQty = Math.floor(Number(f.get("desiredQty") ?? 0));

    if (companyName.length < RULES.companyName.min || companyName.length > RULES.companyName.max) {
      setError(`نام شرکت باید بین ${RULES.companyName.min} تا ${RULES.companyName.max} کاراکتر باشد.`);
      return;
    }
    if (contactName.length < RULES.contactName.min || contactName.length > RULES.contactName.max) {
      setError(`نام رابط باید بین ${RULES.contactName.min} تا ${RULES.contactName.max} کاراکتر باشد.`);
      return;
    }
    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("قالب ایمیل معتبر نیست.");
      return;
    }
    if (itemsSummary.length < RULES.itemsSummary.min || itemsSummary.length > RULES.itemsSummary.max) {
      setError(`شرح اقلام باید بین ${RULES.itemsSummary.min} تا ${RULES.itemsSummary.max} کاراکتر باشد.`);
      return;
    }
    if (!Number.isFinite(desiredQty) || desiredQty < RULES.desiredQty.min || desiredQty > RULES.desiredQty.max) {
      setError(`تعداد مطلوب باید عددی بین ${new Intl.NumberFormat("fa-IR").format(RULES.desiredQty.min)} تا ${new Intl.NumberFormat("fa-IR").format(RULES.desiredQty.max)} باشد.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_HOST}/v1/b2b/quote-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          phone,
          ...(email ? { email } : {}),
          itemsSummary,
          desiredQty,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as unknown;
      if (res.ok) {
        setSuccess(extractApiMessage(data) ?? "درخواست شما ثبت شد؛ کارشناسان فروش سازمانی به‌زودی با شما تماس می‌گیرند.");
        setPersisted((data as { persisted?: boolean } | null)?.persisted !== false);
        form.reset();
      } else {
        setError(extractApiMessage(data) ?? `ثبت درخواست ناموفق بود (کد ${res.status}).`);
      }
    } catch {
      setError("اتصال به سرور برقرار نشد؛ لطفاً بعداً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="b2b-page">
      {/* ── Hero ── */}
      <div className="b2b-hero">
        <h1>استعلام قیمت عمده (B2B)</h1>
        <p>
          ویژه کافه‌ها، رستوران‌ها و فروشگاه‌ها — تخفیف پلکانی از ۱۰ عدد؛
          قیمت‌گذاری شفاف بر اساس تعداد و ارسال اختصاصی برای سفارش‌های سازمانی.
        </p>
      </div>

      {/* ── 3-step strip ── */}
      <div className="b2b-steps">
        {B2B_STEPS.map((s, i) => (
          <div key={s.n} className="b2b-step-wrap">
            <div className="b2b-step">
              <span className="b2b-step-num">{s.n}</span>
              <div className="b2b-step-body">
                <strong>{s.title}</strong>
                <span>{s.desc}</span>
              </div>
            </div>
            {i < B2B_STEPS.length - 1 && <span className="b2b-step-arrow" aria-hidden>←</span>}
          </div>
        ))}
      </div>

      {/* ── Quote request form ── */}
      <form onSubmit={handleSubmit} className="b2b-form">
        <h2>فرم ثبت درخواست پیش‌فاکتور</h2>
        <div className="b2b-form-grid">
          <label className="form-field">
            <span>نام شرکت *</span>
            <input name="companyName" required className="input-text" placeholder="مثال: کافه رستوران سبز" />
          </label>
          <label className="form-field">
            <span>نام رابط *</span>
            <input name="contactName" required className="input-text" placeholder="نام و نام خانوادگی" />
          </label>
          <label className="form-field">
            <span>موبایل *</span>
            <input name="phone" required dir="ltr" pattern="09\d{9}" inputMode="numeric" className="input-text" placeholder="09xxxxxxxxx" />
          </label>
          <label className="form-field">
            <span>ایمیل (اختیاری)</span>
            <input name="email" type="email" dir="ltr" className="input-text" placeholder="name@company.com" />
          </label>
          <label className="form-field b2b-full-width">
            <span>شرح اقلام *</span>
            <textarea
              name="itemsSummary"
              required
              rows={4}
              className="input-textarea"
              placeholder="مثال: ۳۰ کیسه ۲۵۰ گرمی قهوه اتیوپی + ۵۰ عدد ماگ سرامیکی"
            />
          </label>
          <label className="form-field">
            <span>تعداد مطلوب *</span>
            <input name="desiredQty" required type="number" min={1} max={100000} dir="ltr" className="input-text" placeholder="10" />
          </label>
        </div>
        <button type="submit" className="btn-purchase-action" disabled={submitting}>
          {submitting ? "در حال ارسال…" : "ثبت درخواست استعلام"}
        </button>
        <p className="b2b-hint">پس از ثبت درخواست، پیش‌فاکتور رسمی حداکثر ظرف یک روز کاری برای شما ارسال می‌شود.</p>
      </form>

      {success && (
        <div className="b2b-success" role="status">
          <strong>{success}</strong>
          {!persisted && (
            <p className="b2b-persist-note">ذخیره دائمی پس از اتصال پایگاه داده انجام می‌شود</p>
          )}
        </div>
      )}
      {error && (
        <div className="b2b-error" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}
