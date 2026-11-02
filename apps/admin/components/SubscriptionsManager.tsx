"use client";

import { useCallback, useEffect, useState } from "react";
import {
  API_BASE,
  TENANT_HEADERS,
  faNumber,
  formatRialAsTomans,
  postTenantJson,
  str,
} from "./types";
import { formatJalaliDateTime } from "@commerce-os/localization";

export interface AdminSubPlan {
  titleFa?: string;
  intervalDays?: number;
  priceRials?: string | number;
}

export interface AdminSubscription {
  id?: string;
  status?: "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
  quantity?: number;
  phone?: string;
  nextRunAt?: string;
  cyclesRun?: number;
  plan?: AdminSubPlan;
}

export interface SubscriptionsResponse {
  items?: AdminSubscription[];
  dbAvailable?: boolean;
}

const SUBS_STATUS_PILL: Record<string, { cls: string; fa: string }> = {
  ACTIVE: { cls: "paid pulse", fa: "فعال" },
  PAUSED: { cls: "paused", fa: "موقتاً متوقف" },
  CANCELLED: { cls: "cancelled", fa: "لغوشده" },
  EXPIRED: { cls: "expired", fa: "منقضی" },
};

export default function SubscriptionsManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/subscriptions/admin`, {
        headers: TENANT_HEADERS,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SubscriptionsResponse;
      if (data?.dbAvailable === false) {
        setFailed(true);
        setSubscriptions([]);
      } else {
        setSubscriptions(Array.isArray(data?.items) ? data.items : []);
        setFailed(false);
      }
    } catch {
      setFailed(true);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const handleAction = async (id: string, action: "pause" | "resume" | "cancel") => {
    if (action === "cancel") {
      const ok = window.confirm("آیا از لغو این اشتراک دوره‌ای مطمئن هستید؟ تکرار سفارش‌ها متوقف خواهد شد.");
      if (!ok) return;
    }
    setActionBusyId(id);
    const result = await postTenantJson(
      `/v1/subscriptions/${encodeURIComponent(id)}/${action}`,
      action === "cancel" ? { reason: "لغو اشتراک از پنل مدیریت عملیات" } : {}
    );
    if (!result.ok) {
      alert(`✕ عملیات روی اشتراک انجام نشد: ${result.message}`);
    } else {
      await loadSubscriptions();
    }
    setActionBusyId(null);
  };

  const activeCount = subscriptions.filter((s) => s?.status === "ACTIVE").length;
  const pausedCount = subscriptions.filter((s) => s?.status === "PAUSED").length;
  const cancelledCount = subscriptions.filter((s) => s?.status === "CANCELLED").length;

  const monthlyRevenueTomans =
    subscriptions
      .filter((s) => s?.status === "ACTIVE")
      .reduce<bigint>((sum, s) => {
        const digits = String(s?.plan?.priceRials ?? "").replace(/[^\d]/g, "");
        const priceRials = digits ? BigInt(digits) : 0n;
        const rawQty = Number(s?.quantity ?? 0);
        const qty = Number.isFinite(rawQty) ? Math.max(0, Math.trunc(rawQty)) : 0;
        return sum + priceRials * BigInt(qty);
      }, 0n) / 10n;

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال به سرویس اشتراک‌های دوره‌ای (AUD-08):</strong> اشتراک‌ها از پایگاه داده بارگذاری نشدند. سیستم به صورت آفلاین محافظت شده است.
          </div>
          <button onClick={() => void loadSubscriptions()} disabled={loading} className="btn-retry">
            {loading ? "در حال دریافت…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">RECURRING SUBSCRIPTIONS ENGINE (LIVE)</span>
        </div>
      )}

      <div className="kpi-grid subs-kpi-row">
        <div className="kpi-card">
          <span className="kpi-title">اشتراک‌های فعال</span>
          <strong className="kpi-value">{faNumber(activeCount)}</strong>
          <span className="kpi-sub">تکرار خودکار سفارش</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">موقتاً متوقف</span>
          <strong className="kpi-value">{faNumber(pausedCount)}</strong>
          <span className="kpi-sub">نیازمند پیگیری تمدید</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">لغوشده</span>
          <strong className="kpi-value">{faNumber(cancelledCount)}</strong>
          <span className="kpi-sub">خارج از چرخه اجرا</span>
        </div>
        <div className="kpi-card highlight">
          <span className="kpi-title">درآمد ماهانه تقریبی</span>
          <strong className="kpi-value">
            {new Intl.NumberFormat("fa-IR").format(monthlyRevenueTomans)} تومان
          </strong>
          <span className="kpi-sub">مجموع اشتراک‌های دوره‌ای فعال</span>
        </div>
      </div>

      <section className="admin-section-box">
        <div className="box-header exception-summary-header">
          <div>
            <h2>مدیریت اشتراک‌های دوره‌ای مشتریان</h2>
            <small>توقف، فعال‌سازی مجدد و لغو مستقیماً روی موتور دوره‌ای اعمال می‌شود.</small>
          </div>
          <div className="exceptions-toolbar">
            <button
              onClick={() => void loadSubscriptions()}
              disabled={loading}
              className="btn-action"
            >
              {loading ? "⏳ در حال دریافت…" : "🔄 بازخوانی فهرست"}
            </button>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <p className="muted-text">
            {loading ? "در حال دریافت اطلاعات از سرور…" : "هیچ اشتراک دوره‌ای ثبت نشده است."}
          </p>
        ) : (
          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>مشترک</th>
                  <th>پلن درمانی</th>
                  <th>تعداد</th>
                  <th>مبلغ دوره (تومان)</th>
                  <th>سیکل‌های اجرا شده</th>
                  <th>اجرای بعدی</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s, idx) => {
                  const statusKey = String(s?.status ?? "");
                  const pill = SUBS_STATUS_PILL[statusKey];
                  const subId = typeof s?.id === "string" && s.id ? s.id : "";
                  const busy = actionBusyId === subId;

                  return (
                    <tr key={subId || `sub-${idx}`}>
                      <td dir="ltr" className="bold tabular-nums">{str(s?.phone)}</td>
                      <td>{str(s?.plan?.titleFa)}</td>
                      <td className="tabular-nums">{faNumber(s?.quantity)}</td>
                      <td className="bold tabular-nums">{formatRialAsTomans(s?.plan?.priceRials)}</td>
                      <td className="tabular-nums">{faNumber(s?.cyclesRun)}</td>
                      <td className="tabular-nums">{s?.nextRunAt ? formatJalaliDateTime(s.nextRunAt) : "—"}</td>
                      <td>
                        <span className={`status-pill ${pill?.cls ?? ""}`}>{pill?.fa ?? str(statusKey)}</span>
                      </td>
                      <td>
                        {statusKey === "ACTIVE" && subId ? (
                          <div className="action-button-group">
                            <button
                              className="btn-action"
                              disabled={busy}
                              onClick={() => void handleAction(subId, "pause")}
                            >
                              {busy ? "⏳" : "توقف"}
                            </button>
                            <button
                              className="btn-reject"
                              disabled={busy}
                              onClick={() => void handleAction(subId, "cancel")}
                            >
                              لغو
                            </button>
                          </div>
                        ) : statusKey === "PAUSED" && subId ? (
                          <div className="action-button-group">
                            <button
                              className="btn-approve"
                              disabled={busy}
                              onClick={() => void handleAction(subId, "resume")}
                            >
                              {busy ? "⏳" : "ادامه"}
                            </button>
                          </div>
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
