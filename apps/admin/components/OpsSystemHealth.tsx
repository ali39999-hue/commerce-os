"use client";

import { useCallback, useEffect, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { API_BASE, faNumber, str } from "./types";

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

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud_101",
    actor: "admin@commerce-os.local",
    action: "APPROVE_PAYMENT_RECEIPT",
    target: "rcp_202",
    ip: "192.168.1.10",
    timestamp: new Date(Date.now() - 1800 * 1000).toISOString(),
  },
  {
    id: "aud_102",
    actor: "system_worker",
    action: "OUTBOX_EVENT_DISPATCHED",
    target: "ORDER_PAID:ord_101",
    ip: "127.0.0.1",
    timestamp: new Date(Date.now() - 3500 * 1000).toISOString(),
  },
  {
    id: "aud_103",
    actor: "operator@commerce-os.local",
    action: "ORDER_STATUS_CHANGED",
    target: "ord_103:SHIPPED",
    ip: "192.168.1.15",
    timestamp: new Date(Date.now() - 7000 * 1000).toISOString(),
  },
  {
    id: "aud_104",
    actor: "admin@commerce-os.local",
    action: "INVENTORY_RESTOCK",
    target: "SKU:SKN-CRM-01",
    ip: "192.168.1.10",
    timestamp: new Date(Date.now() - 14000 * 1000).toISOString(),
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
    columns: ["تاریخ انقضا"],
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
  const [subTab, setSubTab] = useState<"exceptions" | "leases" | "audit">("exceptions");
  const [exceptions, setExceptions] = useState<ExceptionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [auditLogs] = useState<AuditLogItem[]>(DEFAULT_AUDIT_LOGS);
  const [workerLeases] = useState<WorkerLeaseInfo[]>(DEFAULT_WORKER_LEASES);

  const loadExceptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/ops/exceptions`, {
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ExceptionsResponse;
      if (data?.dbAvailable === false) {
        setFailed(true);
      } else {
        setExceptions(data);
        setFailed(false);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExceptions();
  }, [loadExceptions]);

  const blocks = exceptions?.blocks ?? [];
  const totalExceptions = blocks.reduce((sum, b) => sum + (b?.count ?? 0), 0);

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس مانیتورینگ سلامت سیستم (AUD-08):</strong> ارتباط با Ops API برقرار نیست. وضعیت استثناها نیاز به بررسی مجدد دارد.
          </div>
          <button onClick={() => void loadExceptions()} disabled={loading} className="btn-retry">
            {loading ? "در حال دریافت…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">SYSTEM HEALTH & AUDIT MONITOR (LIVE)</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setSubTab("exceptions")}
          className={`b2b-chip ${subTab === "exceptions" ? "active" : ""}`}
        >
          🚨 مرکز استثناها و صف خروج {totalExceptions > 0 && `(${faNumber(totalExceptions)})`}
        </button>
        <button
          onClick={() => setSubTab("leases")}
          className={`b2b-chip ${subTab === "leases" ? "active" : ""}`}
        >
          ⚡ اجاره‌نامه‌های پردازشگر (Redis Leases)
        </button>
        <button
          onClick={() => setSubTab("audit")}
          className={`b2b-chip ${subTab === "audit" ? "active" : ""}`}
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
                  onClick={() => void loadExceptions()}
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
                            <td>{faNumber(String(item.retryCount || item.status || item.attempts || item.expiresAt))}</td>
                            <td>{str(item.createdAt ? formatJalaliDateTime(String(item.createdAt)) : "—")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              );
            })
          )}
        </>
      )}

      {subTab === "leases" && (
        <section className="admin-section-box">
          <div className="box-header">
            <h2>قفل‌های توزیع‌شده و اجاره‌نامه‌های ورکر (Redis Worker Leases)</h2>
            <small>جلوگیری از اجرای همزمان جاب‌های پس‌زمینه با الگوی توزیع‌شده Redlock و کلیدهای TTL</small>
          </div>
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
                    <span className={`status-pill ${w.status === "ACTIVE" ? "paid" : "processing"}`}>
                      {w.status === "ACTIVE" ? "در حال پردازش" : "آماده به کار"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {subTab === "audit" && (
        <section className="admin-section-box">
          <div className="box-header">
            <h2>ثبت رخدادهای امنیتی و ردپای حسابرسی (Audit Trail)</h2>
            <small>ثبت غیرقابل تغییر (Append-Only) کلیه کنش‌های کاربران دارای مجوز، تغییر وضعیت سفارشات و تغییرات انبار</small>
          </div>
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
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="bold" dir="ltr">{log.id}</td>
                  <td>{log.actor}</td>
                  <td><span className="category-pill">{log.action}</span></td>
                  <td dir="ltr">{log.target}</td>
                  <td dir="ltr">{log.ip}</td>
                  <td>{formatJalaliDateTime(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
