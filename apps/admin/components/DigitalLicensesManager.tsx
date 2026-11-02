"use client";

import { useCallback, useEffect, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { API_BASE, TENANT_HEADERS, faNumber, postTenantJson, str } from "./types";

export interface DigitalGrant {
  id: string;
  orderId?: string;
  phone?: string;
  productTitle?: string;
  token?: string;
  downloadCount?: number;
  maxDownloads?: number;
  expiresAt?: string;
  revokedAt?: string | null;
}

export default function DigitalLicensesManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [grants, setGrants] = useState<DigitalGrant[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadGrants = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/v1/digital/grants?phone=${encodeURIComponent(phone)}`,
        {
          headers: TENANT_HEADERS,
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.dbAvailable === false) {
        setFailed(true);
        setGrants([]);
      } else {
        setGrants(Array.isArray(data?.items) ? data.items : []);
        setFailed(false);
      }
    } catch {
      setFailed(true);
      setGrants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGrants(phoneFilter);
  }, [loadGrants, phoneFilter]);

  const handleRevoke = async (id: string) => {
    const ok = window.confirm(
      "آیا از ابطال این لایسنس دیجیتال مطمئن هستید؟ پس از ابطال، دسترسی دانلود مسدود خواهد شد."
    );
    if (!ok) return;

    setBusyId(id);
    const result = await postTenantJson(`/v1/digital/grants/${encodeURIComponent(id)}/revoke`, {});
    if (!result.ok) {
      alert(`✕ ابطال لایسنس انجام نشد: ${result.message}`);
    } else {
      await loadGrants(phoneFilter);
    }
    setBusyId(null);
  };

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس لایسنس‌های دیجیتال (AUD-08):</strong> سرویس لایسنس دیجیتال در دسترس نیست.
          </div>
          <button onClick={() => void loadGrants(phoneFilter)} disabled={loading} className="btn-retry">
            {loading ? "در حال بازیابی…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">DIGITAL GRANTS & DRM (LIVE)</span>
        </div>
      )}

      <section className="admin-section-box">
        <div className="box-header exception-summary-header">
          <div>
            <h2>مدیریت لایسنس‌ها و دانلود فایل‌های دیجیتال (Digital Grants)</h2>
            <small>پایش توکن‌های یکبارمصرف، سقف دانلود و امکان ابطال فوری دسترسی کاربران</small>
          </div>
          <div className="exceptions-toolbar">
            <button
              onClick={() => void loadGrants(phoneFilter)}
              disabled={loading}
              className="btn-action"
            >
              {loading ? "⏳ در حال دریافت…" : "🔄 بازخوانی"}
            </button>
          </div>
        </div>

        <div className="grant-filter-row">
          <div className="coupon-field">
            <label htmlFor="grant-phone">فیلتر شماره موبایل خریدار</label>
            <input
              id="grant-phone"
              className="admin-input"
              dir="ltr"
              placeholder="09123456789"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setPhoneFilter(searchInput.trim());
              }}
            />
          </div>
          <button
            className="btn-action"
            onClick={() => setPhoneFilter(searchInput.trim())}
            disabled={loading}
          >
            🔎 جست‌وجو
          </button>
          {phoneFilter && (
            <button
              className="btn-reject"
              onClick={() => {
                setSearchInput("");
                setPhoneFilter("");
              }}
            >
              ✕ حذف فیلتر
            </button>
          )}
        </div>

        {grants.length === 0 ? (
          <p className="muted-text">
            {loading ? "در حال دریافت لایسنس‌ها…" : "هیچ لایسنس فعالی برای این فیلتر ثبت نشده است."}
          </p>
        ) : (
          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>عنوان محصول دیجیتال</th>
                  <th>خریدار</th>
                  <th>پیش‌نمایش توکن</th>
                  <th>سقف دانلود</th>
                  <th>انقضا</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {grants.map((g) => {
                  const isRevoked = Boolean(g.revokedAt);
                  const isExpired = g.expiresAt && new Date(g.expiresAt).getTime() < Date.now();
                  const busy = busyId === g.id;

                  return (
                    <tr key={g.id}>
                      <td className="bold">{str(g.productTitle)}</td>
                      <td dir="ltr" className="tabular-nums">{str(g.phone)}</td>
                      <td dir="ltr" className="bold font-mono">
                        <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                          {g.token ? `${g.token.slice(0, 8)}...` : "—"}
                        </code>
                      </td>
                      <td className="tabular-nums">
                        {faNumber(g.downloadCount)} از {faNumber(g.maxDownloads)} بار
                      </td>
                      <td className="tabular-nums">{g.expiresAt ? formatJalaliDateTime(g.expiresAt) : "نامحدود"}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            isRevoked
                              ? "rejected"
                              : isExpired
                              ? "expired"
                              : "approved"
                          }`}
                        >
                          {isRevoked ? "باطل شده" : isExpired ? "منقضی" : "فعال"}
                        </span>
                      </td>
                      <td>
                        {!isRevoked && !isExpired ? (
                          <button
                            onClick={() => void handleRevoke(g.id)}
                            disabled={busy}
                            className="btn-reject"
                          >
                            {busy ? "⏳" : "ابطال لایسنس"}
                          </button>
                        ) : (
                          <span className="muted-text">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
