"use client";

import { useCallback, useEffect, useState } from "react";
import {
  API_BASE,
  TENANT_HEADERS,
  faNumber,
  postTenantJson,
  str,
  truncateFa,
} from "./types";

export interface VendorSummary {
  id: string;
  slug: string;
  titleFa: string;
  description: string | null;
  logoColor: string;
  productCount: number;
  commissionBps?: number;
}

interface VendorFormState {
  slug: string;
  titleFa: string;
  description: string;
  logoColor: string;
  commissionPct: string;
}

const EMPTY_FORM: VendorFormState = {
  slug: "",
  titleFa: "",
  description: "",
  logoColor: "#0b6e66",
  commissionPct: "10",
};

export default function VendorsManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [vendors, setVendors] = useState<VendorSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [form, setForm] = useState<VendorFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/vendors?storeSlug=demo`, {
        headers: TENANT_HEADERS,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.source === "FALLBACK") {
        setFailed(true);
      } else {
        setVendors(Array.isArray(data?.items) ? data.items : []);
        setFailed(false);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  const handleCreateVendor = async () => {
    const errs: string[] = [];
    const slug = form.slug.trim().toLowerCase();
    if (!slug || !/^[a-z0-9-]{3,60}$/.test(slug)) {
      errs.push("شناسه فروشنده باید بین ۳ تا ۶۰ نویسه لاتین کوچک و رقم باشد.");
    }
    if (!form.titleFa.trim()) {
      errs.push("وارد کردن عنوان فارسی فروشنده الزامی است.");
    }

    if (errs.length > 0) {
      setErrors(errs);
      setSuccess("");
      return;
    }

    setSubmitting(true);
    setErrors([]);
    setSuccess("");

    const result = await postTenantJson("/v1/vendors", {
      slug,
      titleFa: form.titleFa.trim(),
      description: form.description.trim() || undefined,
      logoColor: form.logoColor,
      commissionBps: form.commissionPct ? Math.round(Number(form.commissionPct) * 100) : 1000,
    });

    setSubmitting(false);
    if (!result.ok) {
      setErrors([result.message || "خطا در ثبت فروشنده"]);
    } else {
      setSuccess(`فروشنده «${form.titleFa}» با موفقیت افزوده شد.`);
      setForm(EMPTY_FORM);
      await loadVendors();
    }
  };

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس فروشندگان (AUD-08):</strong> سرویس فروشندگان مارکت‌پلیس موقتاً قطع است.
          </div>
          <button onClick={() => void loadVendors()} disabled={loading} className="btn-retry">
            {loading ? "در حال دریافت…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">MARKETPLACE VENDORS (LIVE)</span>
        </div>
      )}

      <section className="admin-section-box">
        <div className="box-header">
          <h2>ثبت و فعال‌سازی فروشنده تخصصی (تامین‌کننده داروخانه‌ای و بهداشتی)</h2>
          <small>تامین‌کنندگان مارکت‌پلیس با محاسبه خودکار کمیسیون و تسویه حساب‌های دوره‌ای پشتیبانی می‌شوند.</small>
        </div>

        <div className="vendor-form-row">
          <div className="coupon-field">
            <label htmlFor="vendor-slug">شناسه یکتای فروشنده (slug)</label>
            <input
              id="vendor-slug"
              className="admin-input"
              dir="ltr"
              placeholder="derma-lab"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            />
          </div>
          <div className="coupon-field">
            <label htmlFor="vendor-title">عنوان فارسی فروشگاه / شرکت</label>
            <input
              id="vendor-title"
              className="admin-input"
              placeholder="لابراتوار تخصصی درما لَب"
              value={form.titleFa}
              onChange={(e) => setForm((prev) => ({ ...prev, titleFa: e.target.value }))}
            />
          </div>
          <div className="coupon-field">
            <label htmlFor="vendor-commission">درصد کمیسیون پلتفرم</label>
            <input
              id="vendor-commission"
              className="admin-input"
              dir="ltr"
              type="number"
              placeholder="10"
              value={form.commissionPct}
              onChange={(e) => setForm((prev) => ({ ...prev, commissionPct: e.target.value }))}
            />
          </div>
          <div className="coupon-field">
            <label htmlFor="vendor-desc">توضیحات و مجوز فعالیت</label>
            <input
              id="vendor-desc"
              className="admin-input"
              placeholder="تولیدکننده رسمی محصولات درموسیوتیكال"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
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

        <div className="coupon-form-actions" style={{ marginTop: "16px" }}>
          <button
            onClick={() => void handleCreateVendor()}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "در حال ثبت…" : "+ ایجاد فروشنده"}
          </button>
        </div>
      </section>

      <section className="admin-section-box">
        <div className="box-header exception-summary-header">
          <div>
            <h2>فهرست فروشندگان همکار</h2>
            <small>{faNumber(vendors.length)} فروشنده فعال ثبت گردیده است.</small>
          </div>
          <div className="exceptions-toolbar">
            <button
              onClick={() => void loadVendors()}
              disabled={loading}
              className="btn-action"
            >
              {loading ? "⏳ در حال دریافت…" : "🔄 بازخوانی"}
            </button>
          </div>
        </div>

        {vendors.length === 0 ? (
          <p className="muted-text">
            {loading ? "در حال دریافت اطلاعات از سرور…" : "هیچ فروشنده‌ای ثبت نشده است."}
          </p>
        ) : (
          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>فروشنده</th>
                  <th>شناسه (slug)</th>
                  <th>تعداد محصولات</th>
                  <th>کمیسیون پلتفرم</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td className="bold">{v.titleFa}</td>
                    <td dir="ltr" className="font-mono">{v.slug}</td>
                    <td className="tabular-nums">{faNumber(v.productCount)} کالا</td>
                    <td className="bold tabular-nums">{faNumber((v.commissionBps ?? 1000) / 100)}٪</td>
                    <td><span className="status-pill approved">فعال</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
