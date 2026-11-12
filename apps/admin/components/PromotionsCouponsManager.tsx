"use client";

import { useCallback, useEffect, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { authedFetch, faNumber, postTenantJson, patchTenantJson } from "./types";

export type CouponAudienceType =
  | "PUBLIC"
  | "B2B_CLINIC"
  | "VISITOR_EXCLUSIVE"
  | "SPECIFIC_PHONE";

export interface ApiCoupon {
  id: string;
  code: string;
  titleFa?: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans: number | null;
  minPurchaseTomans: number;
  usedCount: number;
  usageLimit: number;
  perUserLimit?: number | null;
  expiresAt: string;
  active: boolean;
  isActive?: boolean;
  audienceType?: CouponAudienceType;
  customerSegment?: "ALL" | "B2C" | "B2B";
  b2bOnly?: boolean;
  clinicName?: string | null;
  clinicLicenseNumber?: string | null;
  visitorName?: string | null;
  visitorCode?: string | null;
  visitorPhone?: string | null;
  allowedPhones?: string[];
}

interface CouponFormState {
  code: string;
  titleFa: string;
  type: "PERCENT" | "FIXED";
  value: string;
  maxDiscount: string;
  minPurchase: string;
  usageLimit: string;
  perUserLimit: string;
  audienceType: CouponAudienceType;
  customerSegment: "ALL" | "B2C" | "B2B";
  clinicName: string;
  clinicLicenseNumber: string;
  visitorName: string;
  visitorCode: string;
  visitorPhone: string;
  allowedPhonesText: string;
}

const EMPTY_FORM: CouponFormState = {
  code: "",
  titleFa: "",
  type: "PERCENT",
  value: "",
  maxDiscount: "",
  minPurchase: "",
  usageLimit: "",
  perUserLimit: "",
  audienceType: "PUBLIC",
  customerSegment: "ALL",
  clinicName: "",
  clinicLicenseNumber: "",
  visitorName: "",
  visitorCode: "",
  visitorPhone: "",
  allowedPhonesText: "",
};

const AUDIENCE_LABELS: Record<CouponAudienceType, { label: string; bg: string; color: string }> = {
  PUBLIC: { label: "عمومی فروشگاه", bg: "#f1f5f9", color: "#334155" },
  B2B_CLINIC: { label: "کلینیک اختصاصی (B2B)", bg: "#f5f3ff", color: "#6d28d9" },
  VISITOR_EXCLUSIVE: { label: "ویزیتور علمی / نماینده", bg: "#e0f2fe", color: "#0369a1" },
  SPECIFIC_PHONE: { label: "شماره‌های مجاز اختصاصی", bg: "#fef3c7", color: "#b45309" },
};

export default function PromotionsCouponsManager({
  userRole = "SUPER_ADMIN",
}: {
  userRole?: string;
}) {
  const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CouponFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [audienceFilter, setAudienceFilter] = useState<"ALL" | CouponAudienceType>("ALL");

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/v1/pricing/coupons", {
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data?.items)) {
        setCoupons(data.items);
        setFailed(data?.dbAvailable === false);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const handleToggleCoupon = async (id: string) => {
    setActionBusyId(id);
    setErrors([]);
    setSuccess("");
    try {
      const res = await patchTenantJson(`/v1/pricing/coupons/${encodeURIComponent(id)}/toggle`);
      if (!res.ok) {
        setErrors([res.message || `خطا در تغییر وضعیت کوپن (کد ${res.status})`]);
        return;
      }
      const data = res.data as { active?: boolean; isActive?: boolean } | null;
      const nextActive = typeof data?.active === "boolean" ? data.active : undefined;
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                active: nextActive !== undefined ? nextActive : !c.active,
                isActive: data?.isActive ?? nextActive ?? !c.active,
              }
            : c,
        ),
      );
      setSuccess("وضعیت کوپن در پایگاه داده به‌روزرسانی شد.");
    } catch (err: unknown) {
      setErrors([err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور تخفیف‌ها"]);
    } finally {
      setActionBusyId(null);
    }
  };

  const handleCreateCoupon = async () => {
    const errs: string[] = [];
    const code = form.code.trim().toUpperCase();
    if (!code) {
      errs.push("وارد کردن کد تخفیف الزامی است.");
    } else if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
      errs.push("کد کوپن باید بین ۳ تا ۲۴ نویسه لاتین، رقم یا خط تیره باشد.");
    } else if (coupons.some((c) => c.code.toUpperCase() === code)) {
      errs.push("این کد تخفیف قبلاً در سامانه ثبت شده است.");
    }

    const value = Number(form.value);
    if (!form.value.trim() || !Number.isFinite(value) || value <= 0) {
      errs.push("مقدار تخفیف باید عددی بزرگ‌تر از صفر باشد.");
    } else if (form.type === "PERCENT" && value > 100) {
      errs.push("درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد.");
    }

    if (form.type === "PERCENT") {
      const maxDiscount = Number(form.maxDiscount);
      if (!form.maxDiscount.trim() || !Number.isFinite(maxDiscount) || maxDiscount <= 0) {
        errs.push("برای تخفیف درصدی، تعیین سقف مبلغ (تومان) الزامی است.");
      }
    }

    if (form.audienceType === "B2B_CLINIC" && !form.clinicName.trim()) {
      errs.push("برای کوپن کلینیکی، نام کلینیک یا مرکز درمانی الزامی است.");
    }
    if (
      form.audienceType === "VISITOR_EXCLUSIVE" &&
      !form.visitorName.trim() &&
      !form.visitorCode.trim()
    ) {
      errs.push("برای کد اختصاصی ویزیتور، نام یا کد ویزیتور علمی را وارد کنید.");
    }
    const allowedPhones = form.allowedPhonesText
      .split(/[,،\n\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (form.audienceType === "SPECIFIC_PHONE" && allowedPhones.length === 0) {
      errs.push("برای کوپن محدود به شماره، حداقل یک شماره موبایل وارد کنید.");
    }

    if (errs.length > 0) {
      setErrors(errs);
      setSuccess("");
      return;
    }

    setSubmitting(true);
    setErrors([]);
    setSuccess("");

    try {
      const b2bOnly = form.audienceType === "B2B_CLINIC" || form.customerSegment === "B2B";
      const res = await postTenantJson("/v1/pricing/coupons", {
        code,
        titleFa: form.titleFa.trim() || undefined,
        type: form.type,
        value,
        maxDiscountTomans: form.type === "PERCENT" ? Number(form.maxDiscount) : null,
        minPurchaseTomans: form.minPurchase.trim() ? Number(form.minPurchase) : 0,
        usageLimit: form.usageLimit.trim() ? Number(form.usageLimit) : undefined,
        perUserLimit: form.perUserLimit.trim() ? Number(form.perUserLimit) : undefined,
        audienceType: form.audienceType,
        customerSegment: form.audienceType === "B2B_CLINIC" ? "B2B" : form.customerSegment,
        b2bOnly,
        clinicName: form.clinicName.trim() || undefined,
        clinicLicenseNumber: form.clinicLicenseNumber.trim() || undefined,
        visitorName: form.visitorName.trim() || undefined,
        visitorCode: form.visitorCode.trim() || undefined,
        visitorPhone: form.visitorPhone.trim() || undefined,
        allowedPhones: allowedPhones.length > 0 ? allowedPhones : undefined,
      });

      if (!res.ok) {
        setErrors([res.message || "خطا در ثبت کوپن در سرور تخفیف‌ها"]);
        setSubmitting(false);
        return;
      }

      setSuccess(`کوپن تخفیف «${code}» با موفقیت با قوانین تفکیک‌شده B2B/B2C در پایگاه داده ثبت گردید.`);
      setForm(EMPTY_FORM);
      await loadCoupons();
    } catch (e: any) {
      setErrors([e?.message || "خطا در ارتباط با سرویس تخفیف"]);
    } finally {
      setSubmitting(false);
    }
  };

  const visibleCoupons =
    audienceFilter === "ALL"
      ? coupons
      : coupons.filter((c) => (c.audienceType ?? "PUBLIC") === audienceFilter);

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس تخفیف‌ها:</strong> ارتباط با سرویس Pricing API برقرار نشد.
          </div>
          <button onClick={() => void loadCoupons()} disabled={loading} className="btn-retry">
            {loading ? "در حال بازیابی…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <span className="muted-text">تفکیک کامل نرخ‌گذاری مصرف‌کننده (B2C)، قراردادهای کلینیکی (B2B) و سهمیه ویزیتورهای علمی</span>
          <span className="badge-live">CONNECTED TO PRICING DB (AUTHED)</span>
        </div>
      )}

      {/* Coupon Creation Section */}
      <section className="admin-section-box">
        <div className="box-header">
          <h2>ایجاد کد تخفیف هدفمند (B2C / کلینیک B2B / ویزیتور)</h2>
          <small>قوانین اعتبارسنجی مستقیماً در سبد خرید فروشگاه و موتور محاسبه قیمت در سرور اعمال می‌شوند.</small>
        </div>

        <div className="coupon-form-grid">
          <div className="coupon-field">
            <label htmlFor="coupon-code">کد کوپن *</label>
            <input
              id="coupon-code"
              className="admin-input"
              dir="ltr"
              placeholder="CLINIC30"
              value={form.code}
              onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-title">عنوان فارسی طرح (نمایش در پیش‌فاکتور)</label>
            <input
              id="coupon-title"
              className="admin-input"
              placeholder="مثال: سهمیه قراردادی کلینیک‌ها"
              value={form.titleFa}
              onChange={(e) => setForm((prev) => ({ ...prev, titleFa: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-audience">جامعه هدف و محدودیت کاربری</label>
            <select
              id="coupon-audience"
              className="admin-input"
              value={form.audienceType}
              onChange={(e) => {
                const nextAudience = e.target.value as CouponAudienceType;
                setForm((prev) => ({
                  ...prev,
                  audienceType: nextAudience,
                  customerSegment: nextAudience === "B2B_CLINIC" ? "B2B" : prev.customerSegment,
                }));
              }}
            >
              <option value="PUBLIC">عمومی فروشگاه</option>
              <option value="B2B_CLINIC">اختصاصی کلینیک / مرکز درمانی (B2B)</option>
              <option value="VISITOR_EXCLUSIVE">کد اختصاصی ویزیتور / نماینده علمی</option>
              <option value="SPECIFIC_PHONE">محدود به شماره‌های موبایل خاص</option>
            </select>
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-segment">کانال قیمتی مجاز (B2B / B2C)</label>
            <select
              id="coupon-segment"
              className="admin-input"
              value={form.audienceType === "B2B_CLINIC" ? "B2B" : form.customerSegment}
              disabled={form.audienceType === "B2B_CLINIC"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  customerSegment: e.target.value as "ALL" | "B2C" | "B2B",
                }))
              }
            >
              <option value="ALL">همه مشتریان (B2C + B2B)</option>
              <option value="B2C">فقط مصرف‌کننده خانگی (B2C)</option>
              <option value="B2B">فقط خرید کلینیکی / عمده (B2B)</option>
            </select>
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-type">نوع تخفیف</label>
            <select
              id="coupon-type"
              className="admin-input"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value as "PERCENT" | "FIXED" }))
              }
            >
              <option value="PERCENT">درصدی (Percent)</option>
              <option value="FIXED">مبلغ ثابت (Fixed Tomans)</option>
            </select>
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-value">
              {form.type === "PERCENT" ? "مقدار (درصد) *" : "مقدار (تومان) *"}
            </label>
            <input
              id="coupon-value"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder={form.type === "PERCENT" ? "20" : "150000"}
              value={form.value}
              onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-max">
              سقف تخفیف (تومان){form.type === "FIXED" ? " — اختیاری" : " *"}
            </label>
            <input
              id="coupon-max"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder="2000000"
              value={form.maxDiscount}
              onChange={(e) => setForm((prev) => ({ ...prev, maxDiscount: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-min">حداقل خرید (تومان)</label>
            <input
              id="coupon-min"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder="1500000"
              value={form.minPurchase}
              onChange={(e) => setForm((prev) => ({ ...prev, minPurchase: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-limit">سقف کل استفاده</label>
            <input
              id="coupon-limit"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder="خالی = نامحدود"
              value={form.usageLimit}
              onChange={(e) => setForm((prev) => ({ ...prev, usageLimit: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-per-user">سقف استفاده به ازای هر خریدار</label>
            <input
              id="coupon-per-user"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder="مثلاً 1 یا 3"
              value={form.perUserLimit}
              onChange={(e) => setForm((prev) => ({ ...prev, perUserLimit: e.target.value }))}
            />
          </div>

          {form.audienceType === "B2B_CLINIC" && (
            <>
              <div className="coupon-field">
                <label htmlFor="coupon-clinic-name">نام کلینیک یا مرکز درمانی *</label>
                <input
                  id="coupon-clinic-name"
                  className="admin-input"
                  placeholder="کلینیک فوق تخصصی اکسیر ونک"
                  value={form.clinicName}
                  onChange={(e) => setForm((prev) => ({ ...prev, clinicName: e.target.value }))}
                />
              </div>
              <div className="coupon-field">
                <label htmlFor="coupon-clinic-lic">شماره نظام پزشکی / کد مجوز مرکز</label>
                <input
                  id="coupon-clinic-lic"
                  className="admin-input"
                  dir="ltr"
                  placeholder="MED-992140"
                  value={form.clinicLicenseNumber}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, clinicLicenseNumber: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          {form.audienceType === "VISITOR_EXCLUSIVE" && (
            <>
              <div className="coupon-field">
                <label htmlFor="coupon-visitor-name">نام ویزیتور / نماینده علمی *</label>
                <input
                  id="coupon-visitor-name"
                  className="admin-input"
                  placeholder="مهندس سارا دانش"
                  value={form.visitorName}
                  onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                />
              </div>
              <div className="coupon-field">
                <label htmlFor="coupon-visitor-code">کد پورسانت و پیگیری ویزیتور</label>
                <input
                  id="coupon-visitor-code"
                  className="admin-input"
                  dir="ltr"
                  placeholder="VIS-DANESH-01"
                  value={form.visitorCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, visitorCode: e.target.value }))}
                />
              </div>
              <div className="coupon-field">
                <label htmlFor="coupon-visitor-phone">شماره موبایل ویزیتور</label>
                <input
                  id="coupon-visitor-phone"
                  className="admin-input"
                  dir="ltr"
                  placeholder="09124444444"
                  value={form.visitorPhone}
                  onChange={(e) => setForm((prev) => ({ ...prev, visitorPhone: e.target.value }))}
                />
              </div>
            </>
          )}

          {(form.audienceType === "B2B_CLINIC" ||
            form.audienceType === "SPECIFIC_PHONE" ||
            form.audienceType === "VISITOR_EXCLUSIVE") && (
            <div className="coupon-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="coupon-allowed-phones">
                شماره موبایل‌های مجاز خریدار (با کاما یا خط جدید جدا کنید{" "}
                {form.audienceType === "SPECIFIC_PHONE" ? "— الزامی" : "— اختیاری برای محدودسازی"}
                )
              </label>
              <input
                id="coupon-allowed-phones"
                className="admin-input"
                dir="ltr"
                placeholder="09123333333, 09121111111"
                value={form.allowedPhonesText}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, allowedPhonesText: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div className="form-feedback-error">
            <ul className="feedback-list">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {success && <div className="form-feedback-success">{success}</div>}

        <div className="coupon-form-actions">
          <button
            onClick={() => void handleCreateCoupon()}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "در حال ذخیره در API…" : "+ ثبت و فعال‌سازی کوپن"}
          </button>
          <span className="muted-text">اطلاعات فوراً در جدول coupons ذخیره شده و در سبد خرید و پیش‌فاکتور اعمال می‌شود.</span>
        </div>
      </section>

      {/* Coupons Table */}
      <section className="admin-section-box">
        <div
          className="box-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            <h2>فهرست کوپن‌ها، سهمیه‌های کلینیکی (B2B) و کدهای ویزیتور</h2>
            <small>{faNumber(visibleCoupons.length)} کوپن در پایگاه داده شناسایی شد.</small>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setAudienceFilter("ALL")}
              className={`filter-chip ${audienceFilter === "ALL" ? "active" : ""}`}
            >
              همه ({faNumber(coupons.length)})
            </button>
            <button
              type="button"
              onClick={() => setAudienceFilter("B2B_CLINIC")}
              className={`filter-chip ${audienceFilter === "B2B_CLINIC" ? "active" : ""}`}
            >
              کلینیک‌های B2B
            </button>
            <button
              type="button"
              onClick={() => setAudienceFilter("VISITOR_EXCLUSIVE")}
              className={`filter-chip ${audienceFilter === "VISITOR_EXCLUSIVE" ? "active" : ""}`}
            >
              ویزیتورها
            </button>
            <button
              type="button"
              onClick={() => setAudienceFilter("PUBLIC")}
              className={`filter-chip ${audienceFilter === "PUBLIC" ? "active" : ""}`}
            >
              عمومی
            </button>
            <button onClick={() => void loadCoupons()} disabled={loading} className="btn-action">
              {loading ? "⏳ در حال دریافت…" : "🔄 بازخوانی"}
            </button>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>کد و عنوان</th>
                <th>جامعه هدف / کانال</th>
                <th>جزئیات اختصاصی (کلینیک / ویزیتور / شماره)</th>
                <th>مقدار و سقف</th>
                <th>حداقل خرید</th>
                <th>مصرف</th>
                <th>تاریخ انقضا</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {visibleCoupons.map((c) => {
                const busy = actionBusyId === c.id;
                const aud = (c.audienceType ?? "PUBLIC") as CouponAudienceType;
                const audMeta = AUDIENCE_LABELS[aud] ?? AUDIENCE_LABELS.PUBLIC;
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="bold" dir="ltr">
                        {c.code}
                      </div>
                      {c.titleFa && (
                        <small style={{ color: "var(--muted)", display: "block" }}>{c.titleFa}</small>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 700,
                          background: audMeta.bg,
                          color: audMeta.color,
                        }}
                      >
                        {audMeta.label}
                      </span>
                      <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--muted)" }}>
                        کانال: {c.customerSegment === "B2B" || c.b2bOnly ? "فقط B2B" : c.customerSegment === "B2C" ? "فقط B2C" : "B2C + B2B"}
                      </div>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {c.clinicName && (
                        <div>
                          🏥 {c.clinicName}
                          {c.clinicLicenseNumber ? ` (${c.clinicLicenseNumber})` : ""}
                        </div>
                      )}
                      {c.visitorName && (
                        <div>
                          💼 {c.visitorName}
                          {c.visitorCode ? ` [${c.visitorCode}]` : ""}
                        </div>
                      )}
                      {c.allowedPhones && c.allowedPhones.length > 0 && (
                        <div dir="ltr" style={{ color: "var(--muted)" }}>
                          📱 {c.allowedPhones.join(", ")}
                        </div>
                      )}
                      {!c.clinicName && !c.visitorName && (!c.allowedPhones || c.allowedPhones.length === 0) && (
                        <span className="muted-text">آزاد برای عموم</span>
                      )}
                    </td>
                    <td className="bold tabular-nums">
                      <div>
                        {c.type === "PERCENT"
                          ? `${faNumber(c.value)}٪`
                          : `${new Intl.NumberFormat("fa-IR").format(c.value)} تومان`}
                      </div>
                      {c.maxDiscountTomans !== null && (
                        <small style={{ color: "var(--muted)", fontWeight: 500 }}>
                          سقف {new Intl.NumberFormat("fa-IR").format(c.maxDiscountTomans)} ت
                        </small>
                      )}
                    </td>
                    <td className="tabular-nums">
                      {c.minPurchaseTomans === 0
                        ? "—"
                        : `${new Intl.NumberFormat("fa-IR").format(c.minPurchaseTomans)} تومان`}
                    </td>
                    <td className="tabular-nums">
                      <div>
                        {c.usageLimit > 0
                          ? `${faNumber(c.usedCount)} از ${faNumber(c.usageLimit)}`
                          : `${faNumber(c.usedCount)} (نامحدود)`}
                      </div>
                      {c.perUserLimit && (
                        <small style={{ color: "var(--muted)" }}>
                          هر کاربر حداکثر {faNumber(c.perUserLimit)} بار
                        </small>
                      )}
                    </td>
                    <td className="tabular-nums">{formatJalaliDateTime(c.expiresAt)}</td>
                    <td>
                      <span className={`status-pill ${c.active ? "approved" : "rejected"}`}>
                        {c.active ? "فعال" : "غیرفعال"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => void handleToggleCoupon(c.id)}
                        disabled={busy}
                        className={c.active ? "btn-reject" : "btn-approve"}
                      >
                        {busy ? "⏳" : c.active ? "غیرفعال‌سازی" : "فعال‌سازی"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
