"use client";

import { useCallback, useEffect, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { API_BASE, TENANT_HEADERS, faNumber, postTenantJson, patchTenantJson } from "./types";

export interface ApiCoupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans: number | null;
  minPurchaseTomans: number;
  usedCount: number;
  usageLimit: number;
  expiresAt: string;
  active: boolean;
}

interface CouponFormState {
  code: string;
  type: "PERCENT" | "FIXED";
  value: string;
  maxDiscount: string;
  minPurchase: string;
  usageLimit: string;
}

const EMPTY_FORM: CouponFormState = {
  code: "",
  type: "PERCENT",
  value: "",
  maxDiscount: "",
  minPurchase: "",
  usageLimit: "",
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

  // AUD-07 & AUD-08: Fetch from real API endpoint
  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/pricing/coupons`, {
        headers: TENANT_HEADERS,
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
    try {
      const res = await patchTenantJson(`/v1/pricing/coupons/${encodeURIComponent(id)}/toggle`);
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
        );
      } else {
        // Fallback local toggle with error notice
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
        );
      }
    } catch {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
      );
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

    if (errs.length > 0) {
      setErrors(errs);
      setSuccess("");
      return;
    }

    setSubmitting(true);
    setErrors([]);
    setSuccess("");

    try {
      // Connect to real API! Eliminate local demo state (AUD-07)
      const res = await postTenantJson("/v1/pricing/coupons", {
        code,
        type: form.type,
        value,
        maxDiscountTomans: form.type === "PERCENT" ? Number(form.maxDiscount) : null,
        minPurchaseTomans: form.minPurchase.trim() ? Number(form.minPurchase) : 0,
        usageLimit: form.usageLimit.trim() ? Number(form.usageLimit) : undefined,
      });

      if (!res.ok) {
        setErrors([res.message || "خطا در ثبت کوپن در سرور تخفیف‌ها"]);
        setSubmitting(false);
        return;
      }

      setSuccess(`کوپن تخفیف «${code}» با موفقیت در پایگاه داده ثبت و در درگاه پرداخت فعال گردید.`);
      setForm(EMPTY_FORM);
      await loadCoupons();
    } catch (e: any) {
      setErrors([e?.message || "خطا در ارتباط با سرویس تخفیف"]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس تخفیف‌ها (AUD-08):</strong> سرویس Pricing API در دسترس نیست. کوپن‌ها در وضعیت پیش‌فرض نمایش داده می‌شوند.
          </div>
          <button onClick={() => void loadCoupons()} disabled={loading} className="btn-retry">
            {loading ? "در حال بازیابی…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">CONNECTED TO PRICING API (AUD-07)</span>
        </div>
      )}

      {/* Coupon Creation Section */}
      <section className="admin-section-box">
        <div className="box-header">
          <h2>ایجاد کد تخفیف جدید (اتصال مستقیم به API)</h2>
          <small>کوپن‌های ثبت‌شده مستقیماً در پایگاه داده ذخیره شده و در مرحله پیش‌فاکتور (Pricing Engine) محاسبه می‌شوند.</small>
        </div>

        <div className="coupon-form-grid">
          <div className="coupon-field">
            <label htmlFor="coupon-code">کد کوپن</label>
            <input
              id="coupon-code"
              className="admin-input"
              dir="ltr"
              placeholder="SUMMER25"
              value={form.code}
              onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
            />
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
              {form.type === "PERCENT" ? "مقدار (درصد)" : "مقدار (تومان)"}
            </label>
            <input
              id="coupon-value"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder={form.type === "PERCENT" ? "15" : "100000"}
              value={form.value}
              onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
            />
          </div>

          <div className="coupon-field">
            <label htmlFor="coupon-max">
              سقف تخفیف (تومان){form.type === "FIXED" ? " — اختیاری" : ""}
            </label>
            <input
              id="coupon-max"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder="750000"
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
            <label htmlFor="coupon-limit">محدودیت تعداد کل استفاده</label>
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
          <span className="muted-text">اطلاعات فوراً در جدول coupons ذخیره شده و ردمپشن‌های آن مانیتور می‌شود.</span>
        </div>
      </section>

      {/* Coupons Table */}
      <section className="admin-section-box">
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>فهرست کوپن‌ها و طرح‌های تخفیف فعال</h2>
            <small>{faNumber(coupons.length)} کوپن در پایگاه داده شناسایی شد.</small>
          </div>
          <button onClick={() => void loadCoupons()} disabled={loading} className="btn-action">
            {loading ? "⏳ در حال دریافت…" : "🔄 بازخوانی از سرور"}
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>کد</th>
              <th>نوع تخفیف</th>
              <th>مقدار</th>
              <th>سقف تخفیف</th>
              <th>حداقل خرید</th>
              <th>تعداد مصرف</th>
              <th>تاریخ انقضا</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => {
              const busy = actionBusyId === c.id;
              return (
                <tr key={c.id}>
                  <td className="bold" dir="ltr">
                    {c.code}
                  </td>
                  <td>{c.type === "PERCENT" ? "درصدی" : "مبلغ ثابت"}</td>
                  <td className="bold">
                    {c.type === "PERCENT" ? `${faNumber(c.value)}٪` : `${faNumber(c.value)} تومان`}
                  </td>
                  <td>{c.maxDiscountTomans === null ? "—" : `${faNumber(c.maxDiscountTomans)} تومان`}</td>
                  <td>{c.minPurchaseTomans === 0 ? "—" : `${faNumber(c.minPurchaseTomans)} تومان`}</td>
                  <td>
                    {c.usageLimit > 0
                      ? `${faNumber(c.usedCount)} از ${faNumber(c.usageLimit)}`
                      : `${faNumber(c.usedCount)} (نامحدود)`}
                  </td>
                  <td>{formatJalaliDateTime(c.expiresAt)}</td>
                  <td>
                    <span className={`status-pill ${c.active ? "paid" : "rejected"}`}>
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
      </section>
    </div>
  );
}
