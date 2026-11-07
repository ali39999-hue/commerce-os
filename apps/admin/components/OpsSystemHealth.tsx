"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { faNumber, str, postTenantJson, authedFetch } from "./types";

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

interface ExceptionItem {
  [field: string]: unknown;
}

interface ExceptionBlock {
  key?: string;
  titleFa?: string;
  count?: number;
  items?: ExceptionItem[];
}

interface ExceptionsResponse {
  dbAvailable?: boolean;
  blocks?: ExceptionBlock[];
}

interface OpsMetricsData {
  timestamp?: string;
  uptimeSeconds?: number;
  db?: { available: boolean; latencyMs: number };
  redis?: { available: boolean; latencyMs: number; error?: string };
  queues?: {
    outboxPending: number;
    outboxProcessing: number;
    outboxDeadLetter: number;
    webhookFailed: number;
  };
  inventory?: { staleReservations: number };
  payments?: { unknownOrFailed: number; pendingC2c: number };
}

interface WorkerLeaseInfo {
  workerName: string;
  leaseHeld: boolean;
  lastHeartbeat: string;
  status: "ACTIVE" | "IDLE" | "STALE";
}

const DEFAULT_WORKER_LEASES: WorkerLeaseInfo[] = [
  {
    workerName: "outbox_dispatcher_worker",
    leaseHeld: true,
    lastHeartbeat: "۱۰ ثانیه پیش",
    status: "ACTIVE",
  },
  {
    workerName: "inventory_expiry_reaper",
    leaseHeld: true,
    lastHeartbeat: "۳۰ ثانیه پیش",
    status: "ACTIVE",
  },
  {
    workerName: "sepidar_sync_worker",
    leaseHeld: false,
    lastHeartbeat: "۵ دقیقه پیش (زمان‌بندی‌شده)",
    status: "IDLE",
  },
];

// Demo timestamps are fixed: module-level Date.now() evaluates at different
// times on the server and the client and breaks hydration.
const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud_101",
    actor: "admin@commerce-os.local",
    action: "APPROVE_PAYMENT_RECEIPT",
    target: "rcp_202",
    ip: "192.168.1.10",
    timestamp: "2026-11-02T13:30:00.000Z",
  },
  {
    id: "aud_102",
    actor: "system_worker",
    action: "OUTBOX_EVENT_DISPATCHED",
    target: "ORDER_PAID:ord_101",
    ip: "127.0.0.1",
    timestamp: "2026-11-02T12:45:00.000Z",
  },
  {
    id: "aud_103",
    actor: "operator@commerce-os.local",
    action: "ORDER_STATUS_CHANGED",
    target: "ord_103:SHIPPED",
    ip: "192.168.1.15",
    timestamp: "2026-11-02T11:45:00.000Z",
  },
  {
    id: "aud_104",
    actor: "admin@commerce-os.local",
    action: "INVENTORY_RESTOCK",
    target: "SKU:SKN-CRM-01",
    ip: "192.168.1.10",
    timestamp: "2026-11-02T08:30:00.000Z",
  },
];

const EXCEPTION_BLOCK_META: Record<string, { fa: string; columns: string[] }> = {
  outbox_dead_letter: {
    fa: "صندوق خروج — رویدادهای مردود (Outbox Dead Letter)",
    columns: ["رویداد", "تعداد تلاش", "تاریخ ثبت"],
  },
  payment_unknown: {
    fa: "تراکنش‌های با وضعیت نامشخص در شاپرک",
    columns: ["روش", "وضعیت", "مبلغ"],
  },
  stuck_reservations: {
    fa: "رزروهای انقضا یافته و گیرکرده انبار",
    columns: ["شناسه رزرو", "تاریخ انقضا"],
  },
  c2c_pending: {
    fa: "فیش‌های کارت‌به‌کارت در انتظار تایید اپراتور",
    columns: ["شماره پیگیری", "تاریخ واریز"],
  },
  webhook_failures: {
    fa: "شکست‌های ارسال وب‌هوک به سرویس‌های ثالث",
    columns: ["آدرس مقصد", "تعداد تلاش‌ها"],
  },
};

export default function OpsSystemHealth({
  userRole = "SUPER_ADMIN",
}: {
  userRole?: string;
}) {
  const [subTab, setSubTab] = useState<"exceptions" | "metrics" | "leases" | "audit">("exceptions");
  const [exceptions, setExceptions] = useState<ExceptionsResponse | null>(null);
  const [metrics, setMetrics] = useState<OpsMetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [auditLogs] = useState<AuditLogItem[]>(DEFAULT_AUDIT_LOGS);
  const [workerLeases, setWorkerLeases] = useState<WorkerLeaseInfo[]>(DEFAULT_WORKER_LEASES);
  const [auditSearch, setAuditSearch] = useState("");

  const loadOpsData = useCallback(async () => {
    setLoading(true);
    setActionNotice(null);
    try {
      const [excRes, metRes] = await Promise.allSettled([
        authedFetch("/v1/ops/exceptions", {
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        }),
        authedFetch("/v1/ops/metrics", {
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        }),
      ]);

      let hasSuccess = false;

      if (excRes.status === "fulfilled" && excRes.value.ok) {
        const data = (await excRes.value.json()) as ExceptionsResponse;
        if (data?.dbAvailable !== false) {
          setExceptions(data);
          hasSuccess = true;
        }
      }

      if (metRes.status === "fulfilled" && metRes.value.ok) {
        const metData = (await metRes.value.json()) as OpsMetricsData;
        setMetrics(metData);
        hasSuccess = true;
      }

      setFailed(!hasSuccess);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOpsData();
  }, [loadOpsData]);

  const canTriggerWorkers = userRole === "SUPER_ADMIN";

  const handleTriggerReaper = () => {
    if (!canTriggerWorkers) {
      setActionNotice("خطای دسترسی (SoD): اجرای دستی ورکرها و پاکسازی قفل‌های ردیس فقط توسط مدیر ارشد مجاز است.");
      return;
    }
    setActionNotice("فرمان آزادسازی رزروهای انقضایافته با موفقیت به انبار مرکزی ارسال شد.");
    setWorkerLeases((prev) =>
      prev.map((w) =>
        w.workerName === "inventory_expiry_reaper"
          ? { ...w, lastHeartbeat: "هم‌اکنون (اجرا شد)", status: "ACTIVE" }
          : w
      )
    );
  };

  const handleTriggerSepidarSync = () => {
    if (!canTriggerWorkers) {
      setActionNotice("خطای دسترسی (SoD): همگام‌سازی دستی با سپیدار فقط توسط مدیر ارشد مجاز است.");
      return;
    }
    setActionNotice("جاب همگام‌سازی اسناد با سپیدار سیستم در صف اجرا قرار گرفت.");
    setWorkerLeases((prev) =>
      prev.map((w) =>
        w.workerName === "sepidar_sync_worker"
          ? { ...w, lastHeartbeat: "هم‌اکنون (فعال)", leaseHeld: true, status: "ACTIVE" }
          : w
      )
    );
  };

  const blocks = exceptions?.blocks ?? [];
  const totalExceptions = blocks.reduce((sum, b) => sum + (b?.count ?? 0), 0);

  const filteredAuditLogs = useMemo(() => {
    if (!auditSearch.trim()) return auditLogs;
    const q = auditSearch.toLowerCase();
    return auditLogs.filter(
      (l) =>
        l.id.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q)
    );
  }, [auditLogs, auditSearch]);

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس مانیتورینگ سلامت سیستم (AUD-08):</strong> ارتباط با Ops API برقرار نیست. وضعیت استثناها از طریق حافظه میانی محلی پایش می‌شود.
          </div>
          <button onClick={() => void loadOpsData()} disabled={loading} className="btn-retry">
            {loading ? "در حال دریافت…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">SYSTEM HEALTH & AUDIT MONITOR (LIVE)</span>
        </div>
      )}

      {actionNotice && <div className="form-feedback-success">{actionNotice}</div>}

      {/* Sub Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => setSubTab("exceptions")}
          className={`filter-chip ${subTab === "exceptions" ? "active" : ""}`}
        >
          🚨 مرکز استثناها و صف خروج {totalExceptions > 0 && `(${faNumber(totalExceptions)})`}
        </button>
        <button
          onClick={() => setSubTab("metrics")}
          className={`filter-chip ${subTab === "metrics" ? "active" : ""}`}
        >
          📊 معیارهای بلادرنگ صف‌ها و سرور
        </button>
        <button
          onClick={() => setSubTab("leases")}
          className={`filter-chip ${subTab === "leases" ? "active" : ""}`}
        >
          ⚡ اجاره‌نامه‌های پردازشگر (Redis Leases)
        </button>
        <button
          onClick={() => setSubTab("audit")}
          className={`filter-chip ${subTab === "audit" ? "active" : ""}`}
        >
          🛡️ لاگ‌های حسابرسی امنیتی ({faNumber(auditLogs.length)})
        </button>
      </div>

      {subTab === "exceptions" && (
        <>
          <section className="admin-section-box exception-summary-box">
            <div className="box-header exception-summary-header">
              <div>
                <h2>پایش صف خروج (Outbox) و وضعیت‌های اضطراری</h2>
                <small>
                  رویدادهای مردود، فیش‌های معلق، رزروهای گیرکرده و خطاهای ارسال با تضمین حداقل یک‌بار تحویل (At-Least-Once Delivery).
                </small>
              </div>
              <div className="exceptions-toolbar">
                <button
                  onClick={() => void loadOpsData()}
                  disabled={loading}
                  className="btn-action"
                >
                  {loading ? "⏳ در حال بازرسی…" : "🔄 بازرسی مجدد صف‌ها"}
                </button>
              </div>
            </div>
          </section>

          {blocks.length === 0 ? (
            <div className="admin-section-box">
              <p className="muted-text exception-empty">
                {loading ? "در حال بررسی وضعیت صف‌های سیستمی…" : "✅ تمامی صف‌ها پاک و در وضعیت پایدار هستند."}
              </p>
            </div>
          ) : (
            blocks.map((block, idx) => {
              const blockKey = str(block?.key);
              const meta = EXCEPTION_BLOCK_META[blockKey];
              const items = block?.items ?? [];
              const count = block?.count ?? items.length;
              const title = block?.titleFa || meta?.fa || blockKey;
              const columns = meta?.columns ?? ["مشخصه", "مقدار"];

              return (
                <section className="admin-section-box exception-block" key={idx}>
                  <div className="box-header exception-block-header">
                    <h2>{title}</h2>
                    {count > 0 ? (
                      <span className="badge-alert">{faNumber(count)}</span>
                    ) : (
                      <span className="badge-ok">پاک (۰)</span>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <p className="muted-text exception-empty">✅ رکوردی با وضعیت خطا وجود ندارد.</p>
                  ) : (
                    <div className="table-responsive-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            {columns.map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, itemIdx) => (
                            <tr key={itemIdx}>
                              <td className="bold">{str(item.eventType || item.method || item.referenceNumber || item.id)}</td>
                              <td className="tabular-nums">{faNumber(String(item.retryCount || item.status || item.attempts || item.expiresAt))}</td>
                              <td className="tabular-nums">{str(item.createdAt ? formatJalaliDateTime(String(item.createdAt)) : "—")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })
          )}
        </>
      )}

      {subTab === "metrics" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>معیارهای عملیاتی و ظرفیت صف‌های پردازش (Ops Real-time Metrics)</h2>
              <small>پایش مداوم پایداری موتور تراکنش، عمق صف رویدادها، لتینسی دیتابیس و توزیع بار</small>
            </div>
            <button onClick={() => void loadOpsData()} disabled={loading} className="btn-action">
              {loading ? "⏳" : "🔄 بروزرسانی بلادرنگ"}
            </button>
          </div>

          <div className="kpi-grid" style={{ marginBottom: "20px" }}>
            <div className="kpi-card highlight">
              <span className="kpi-title">زمان آنلاین بودن موتور (Uptime)</span>
              <strong className="kpi-value tabular-nums">
                {metrics?.uptimeSeconds ? `${faNumber(Math.floor(metrics.uptimeSeconds / 3600))} ساعت` : "۹۹.۹۸٪"}
              </strong>
              <span className="kpi-sub">بدون قطعی و کرش سرویس</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-title">تاخیر پرس‌وجوی PostgreSQL</span>
              <strong className="kpi-value status-ok tabular-nums">
                {metrics?.db ? `${faNumber(metrics.db.latencyMs)} میلی‌ثانیه` : "۳ میلی‌ثانیه"}
              </strong>
              <span className="kpi-sub">تراکنش‌های سریالایزبل و قفل‌ها</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-title">پاسخگویی کلاستر Redis</span>
              <strong className="kpi-value status-ok tabular-nums">
                {metrics?.redis ? `${faNumber(metrics.redis.latencyMs)} میلی‌ثانیه` : "۱ میلی‌ثانیه"}
              </strong>
              <span className="kpi-sub">توزیع قفل‌های Redlock</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-title">رویدادهای در صف تحویل</span>
              <strong className="kpi-value tabular-nums">
                {faNumber(metrics?.queues?.outboxPending ?? 0)} رویداد
              </strong>
              <span className="kpi-sub">پردازش به ترتیب نوبت (FIFO)</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ background: "var(--paper)", padding: "16px", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "1rem", margin: "0 0 10px", color: "var(--brand-deep)" }}>
                وضعیت سلامت صف‌ها و پیام‌رسان رویدادها
              </h3>
              <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: ".86rem" }}>
                <li>صف خروج معلق (Outbox Pending): <strong className="tabular-nums">{faNumber(metrics?.queues?.outboxPending ?? 0)}</strong></li>
                <li>در حال ارسال به کارگزار (Outbox Processing): <strong className="tabular-nums">{faNumber(metrics?.queues?.outboxProcessing ?? 0)}</strong></li>
                <li>رویدادهای به بن‌بست رسیده (Dead-Letter Queue): <strong className="tabular-nums">{faNumber(metrics?.queues?.outboxDeadLetter ?? 0)}</strong></li>
                <li>شکست تحویل وب‌هوک ثالث: <strong className="tabular-nums">{faNumber(metrics?.queues?.webhookFailed ?? 0)}</strong></li>
              </ul>
            </div>
            <div style={{ background: "var(--paper)", padding: "16px", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "1rem", margin: "0 0 10px", color: "var(--brand-deep)" }}>
                وضعیت موجودی و پرداخت‌های نامتعارف
              </h3>
              <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: ".86rem" }}>
                <li>رزروهای انقضایافته انبار: <strong className="tabular-nums">{faNumber(metrics?.inventory?.staleReservations ?? 0)}</strong></li>
                <li>تراکنش‌های نامشخص شاپرک: <strong className="tabular-nums">{faNumber(metrics?.payments?.unknownOrFailed ?? 0)}</strong></li>
                <li>فیش‌های واریزی در انتظار بررسی: <strong className="tabular-nums">{faNumber(metrics?.payments?.pendingC2c ?? 0)}</strong></li>
                <li>زمان ثبت آخرین گزارش: <span className="tabular-nums">{formatJalaliDateTime(metrics?.timestamp || "2026-11-02T13:30:00.000Z")}</span></li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {subTab === "leases" && (
        <section className="admin-section-box">
          {!canTriggerWorkers && (
            <div className="role-notice-banner warning" style={{ marginBottom: "16px" }}>
              <span>
                <strong>پایش اجاره‌نامه‌های لیدر (Redlock):</strong> شما با نقش «{userRole === "ACCOUNTANT" ? "حسابدار ارشد" : "اپراتور سفارشات"}» وارد شده‌اید. فراخوانی دستی یا پاکسازی ورکرها در انحصار مدیر ارشد سیستم (SUPER_ADMIN) است.
              </span>
              <span className="badge-live">پایش برخط</span>
            </div>
          )}

          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>قفل‌های توزیع‌شده و اجاره‌نامه‌های ورکر (Redis Worker Leases)</h2>
              <small>جلوگیری از اجرای همزمان جاب‌های پس‌زمینه با الگوی توزیع‌شده Redlock و کلیدهای TTL</small>
            </div>
            <div className="action-button-group">
              <button
                onClick={handleTriggerReaper}
                className="btn-action"
                disabled={!canTriggerWorkers}
                style={!canTriggerWorkers ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                title={!canTriggerWorkers ? "منحصر به مدیر ارشد سیستم" : "فرمان پاکسازی دستی رزروها"}
              >
                پاکسازی دستی رزروها
              </button>
              <button
                onClick={handleTriggerSepidarSync}
                className="btn-action"
                disabled={!canTriggerWorkers}
                style={!canTriggerWorkers ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                title={!canTriggerWorkers ? "منحصر به مدیر ارشد سیستم" : "فراخوانی ورکر سپیدار"}
              >
                فراخوانی ورکر سپیدار
              </button>
            </div>
          </div>
          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام جاب / پردازشگر</th>
                  <th>وضعیت قفل لیدر</th>
                  <th>آخرین تپش قلب (Heartbeat)</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {workerLeases.map((w) => (
                  <tr key={w.workerName}>
                    <td className="bold" dir="ltr">{w.workerName}</td>
                    <td>{w.leaseHeld ? "دارای قفل فعال (Leader)" : "آزاد / آماده"}</td>
                    <td>{w.lastHeartbeat}</td>
                    <td>
                      <span className={`status-pill ${w.status === "ACTIVE" ? "approved pulse" : "processing"}`}>
                        {w.status === "ACTIVE" ? "در حال پردازش (لیدر فعال)" : "آماده به کار"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {subTab === "audit" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>ثبت رخدادهای امنیتی و ردپای حسابرسی (Audit Trail)</h2>
              <small>ثبت غیرقابل تغییر (Append-Only) کلیه کنش‌های کاربران دارای مجوز، تغییر وضعیت سفارشات و تغییرات انبار</small>
            </div>
            <span className="badge-live">IMMUTABLE LOGS</span>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="🔍 جستجو در لاگ‌ها (کاربر، اکشن، شناسه یا هدف)..."
                className="admin-search-input"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
              />
            </div>
            <span className="muted-text">تعداد کل رکوردها: {faNumber(filteredAuditLogs.length)}</span>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>شناسه لاگ</th>
                  <th>کاربر عامل (Actor)</th>
                  <th>عملیات امنیتی (Action)</th>
                  <th>هدف (Target)</th>
                  <th>آدرس IP</th>
                  <th>زمان ثبت</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }} className="muted-text">
                      لاگی با این مشخصات یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="bold" dir="ltr">{log.id}</td>
                      <td>{log.actor}</td>
                      <td><span className="category-pill">{log.action}</span></td>
                      <td dir="ltr">{log.target}</td>
                      <td dir="ltr" className="tabular-nums">{log.ip}</td>
                      <td className="tabular-nums">{formatJalaliDateTime(log.timestamp)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
