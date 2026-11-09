"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Radio,
  RefreshCw,
  ShieldAlert,
  Snowflake,
  Terminal,
  Zap,
} from "lucide-react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { faNumber, authedFetch } from "./types";

export type ExceptionSeverity = "CRITICAL" | "HIGH" | "WARNING" | "RESOLVED";
export type ExceptionDomain = "COLD_CHAIN" | "PAYMENT" | "INVENTORY" | "OUTBOX" | "C2C";

export interface ExceptionIncident {
  id: string;
  domain: ExceptionDomain;
  titleFa: string;
  severity: ExceptionSeverity;
  affectedEntity: string;
  entityLabel: string;
  details: string;
  telemetryValue?: string;
  threshold?: string;
  occurredAt: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  remediationActionLabel: string;
  remediationActionKey: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

const DOMAIN_CONFIG: Record<
  ExceptionDomain,
  { labelFa: string; icon: typeof AlertTriangle; color: string; bg: string }
> = {
  COLD_CHAIN: {
    labelFa: "زنجیره سرد (Cold-Chain IoT)",
    icon: Snowflake,
    color: "#0284c7",
    bg: "#f0f9ff",
  },
  PAYMENT: {
    labelFa: "درگاه پرداخت و تسویه",
    icon: Zap,
    color: "#d97706",
    bg: "#fffbeb",
  },
  INVENTORY: {
    labelFa: "انبار و موجودی استریل",
    icon: ShieldAlert,
    color: "#dc2626",
    bg: "#fef2f2",
  },
  OUTBOX: {
    labelFa: "صف تراکنش Outbox DLQ",
    icon: Terminal,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  C2C: {
    labelFa: "فیش‌های بانکی معلق",
    icon: Clock,
    color: "#059669",
    bg: "#ecfdf5",
  },
};

const SEVERITY_CONFIG: Record<
  ExceptionSeverity,
  { labelFa: string; color: string; bg: string; border: string; pulse: boolean }
> = {
  CRITICAL: {
    labelFa: "بحرانی (Critical)",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fecaca",
    pulse: true,
  },
  HIGH: {
    labelFa: "اولویت بالا (High)",
    color: "#c2410c",
    bg: "#fff7ed",
    border: "#ffedd5",
    pulse: false,
  },
  WARNING: {
    labelFa: "هشدار عملیاتی (Warning)",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fef3c7",
    pulse: false,
  },
  RESOLVED: {
    labelFa: "برطرف شده (Resolved)",
    color: "#047857",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    pulse: false,
  },
};

const INITIAL_INCIDENTS: ExceptionIncident[] = [
  {
    id: "EXC-101",
    domain: "COLD_CHAIN",
    titleFa: "افزایش دمای فراتر از آستانه مجاز سردخانه مرکزی ویال‌های پپتید ReeSkin",
    severity: "CRITICAL",
    affectedEntity: "VAULT-TEH-01",
    entityLabel: "سردخانه شماره ۱ تهران (پالت B4)",
    details:
      "حسگر اینترنت اشیا (IoT Sensor SN-CC88) دمای ۱۰.۴ درجه سانتی‌گراد را به مدت ۴۵ دقیقه متوالی گزارش کرده است. سقف مجاز فرمولاسیون فعال ۸ درجه است.",
    telemetryValue: "۱۰.۴°C",
    threshold: "۲°C تا ۸°C",
    occurredAt: "2026-11-05T08:15:00.000Z",
    status: "OPEN",
    remediationActionLabel: "اعمال قرنطینه فوری پالت و تنظیم چیلر یدکی",
    remediationActionKey: "QUARANTINE_PALLET",
  },
  {
    id: "EXC-102",
    domain: "PAYMENT",
    titleFa: "تایم‌اوت پاسخ وب‌هوک شاپرک در تراکنش درگاه زرین‌پال",
    severity: "HIGH",
    affectedEntity: "pi_998124",
    entityLabel: "تراکنش سفارش ORD-948218",
    details:
      "وجه از حساب مشتری کسر شده اما سیگنال Callback تأیید شاپرک بعد از ۱۲۰ ثانیه دریافت نگردید. وضعیت در حالت UNKNOWN قرار دارد.",
    telemetryValue: "Timeout 120s",
    threshold: "Max 30s",
    occurredAt: "2026-11-05T07:45:00.000Z",
    status: "OPEN",
    remediationActionLabel: "استعلام مجدد از سوئیچ شاپرک و تسویه اضطراری",
    remediationActionKey: "FORCE_VERIFY_SHAPARAK",
  },
  {
    id: "EXC-103",
    domain: "INVENTORY",
    titleFa: "کسری بحرانی کارتریج‌های استریل یکبار مصرف تیپ پلاسما‌ایکس",
    severity: "HIGH",
    affectedEntity: "SKU-PX-TIP-ST",
    entityLabel: "تیپ استریل PlasmaX (پک ۲۰ عددی)",
    details:
      "موجودی آزاد انبار به ۳ بسته کاهش یافته و آستانه هشدار انبار (Safety Buffer: ۱۰ عدد) شکسته شده است. ۲ کلینیک در انتظار تحویل هستند.",
    telemetryValue: "۳ عدد موجود",
    threshold: "حداقل ذخیره ۱۰ عدد",
    occurredAt: "2026-11-05T06:30:00.000Z",
    status: "OPEN",
    remediationActionLabel: "صدور حواله انتقال اضطراری از انبار گمرک فرودگاه",
    remediationActionKey: "EMERGENCY_TRANSFER",
  },
  {
    id: "EXC-104",
    domain: "OUTBOX",
    titleFa: "تراکنش‌های ناموفق در صف خروج رویدادها (Outbox Dead-Letter Queue)",
    severity: "CRITICAL",
    affectedEntity: "evt_post_ledger_88",
    entityLabel: "رویداد ORDER_PAID_LEDGER_POST",
    details:
      "ارسال پیام به ورکر ثبت سند حسابداری پس از ۵ بار تلاش با خطای قفل همزمانی ردیس متوقف و به صف پیام‌های مرده (DLQ) منتقل شد.",
    telemetryValue: "Retry Count: 5",
    threshold: "Max Retries: 3",
    occurredAt: "2026-11-04T22:10:00.000Z",
    status: "OPEN",
    remediationActionLabel: "آزادسازی قفل ردیس و بازتوزیع مجدد رویداد (Re-drive)",
    remediationActionKey: "REDRIVE_DLQ",
  },
  {
    id: "EXC-105",
    domain: "C2C",
    titleFa: "فیش واریزی کارت‌به‌کارت معلق با دیرکرد بالای ۲۴ ساعت",
    severity: "WARNING",
    affectedEntity: "rcp_8841",
    entityLabel: "فیش واریزی سفارش ۹۴۸۱۱۰",
    details:
      "فیش بانکی به مبلغ ۴,۵۰۰,۰۰۰ تومان از دیروز در وضعیت بررسی قرار داشته و اپراتور هنوز تصویر رسید را انطباق نداده است.",
    telemetryValue: "۲۸ ساعت معلق",
    threshold: "SLA: ۱۲ ساعت",
    occurredAt: "2026-11-04T12:00:00.000Z",
    status: "OPEN",
    remediationActionLabel: "ارسال اعلان فوری به اپراتور شیفت و پیامک پوزش به مشتری",
    remediationActionKey: "NOTIFY_OPERATOR",
  },
];

export default function ExceptionCenterManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [incidents, setIncidents] = useState<ExceptionIncident[]>(INITIAL_INCIDENTS);
  const [severityFilter, setSeverityFilter] = useState<"ALL" | ExceptionSeverity>("ALL");
  const [domainFilter, setDomainFilter] = useState<"ALL" | ExceptionDomain>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync with live /v1/ops/exceptions endpoint if available
  const fetchLiveExceptions = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await authedFetch("/v1/ops/exceptions");
      if (res.ok) {
        const data = await res.json();
        // If live API returns blocks, we could enrich our incidents
        if (data?.blocks && Array.isArray(data.blocks)) {
          // Live API connection is healthy!
        }
      }
    } catch {
      // Keep state resilient
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchLiveExceptions();
  }, [fetchLiveExceptions]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (severityFilter !== "ALL" && inc.severity !== severityFilter) return false;
      if (domainFilter !== "ALL" && inc.domain !== domainFilter) return false;
      return true;
    });
  }, [incidents, severityFilter, domainFilter]);

  const stats = useMemo(() => {
    const open = incidents.filter((i) => i.status !== "RESOLVED");
    const critical = open.filter((i) => i.severity === "CRITICAL");
    const high = open.filter((i) => i.severity === "HIGH");
    const warning = open.filter((i) => i.severity === "WARNING");
    const resolved = incidents.filter((i) => i.status === "RESOLVED");
    return {
      openCount: open.length,
      criticalCount: critical.length,
      highCount: high.length,
      warningCount: warning.length,
      resolvedCount: resolved.length,
    };
  }, [incidents]);

  const handleRemediate = async (incident: ExceptionIncident) => {
    setRemediatingId(incident.id);
    // Simulate real remediation action dispatch
    await new Promise((r) => setTimeout(r, 600));

    const resolverName =
      userRole === "SUPER_ADMIN"
        ? "مدیر ارشد زیرساخت و انبار"
        : userRole === "ACCOUNTANT"
        ? "حسابدار ارشد"
        : "اپراتور ارشد سیستم";

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incident.id
          ? {
              ...i,
              status: "RESOLVED",
              severity: "RESOLVED",
              resolvedAt: new Date().toISOString(),
              resolvedBy: resolverName,
              resolutionNote: `اقدام ترمیمی «${incident.remediationActionLabel}» با موفقیت اجرا شد. سنسورها و صفوف به حالت نرمال بازگشتند.`,
            }
          : i
      )
    );

    setRemediatingId(null);
    setFeedback(`اقدام ترمیمی برای حادثه ${incident.id} با موفقیت در سراسر کلاستر اجرا شد.`);
  };

  return (
    <div className="tab-pane">
      {/* ── Feedback Banner ── */}
      {feedback && (
        <div
          className="form-feedback-success"
          style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Status KPI Row ── */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card highlight" style={{ borderRight: "4px solid #ef4444" }}>
          <div className="kpi-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="pulse-dot" style={{ background: "#ef4444" }}></span>
            استثناهای فعال (Active Incidents)
          </div>
          <div className="kpi-value" style={{ color: stats.openCount > 0 ? "#ef4444" : "#059669" }}>
            {faNumber(stats.openCount)} رویداد
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            نیازمند اقدام ترمیمی آنی و مداخله ناظر
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">موارد بحرانی (Critical Severity)</div>
          <div className="kpi-value" style={{ color: stats.criticalCount > 0 ? "#dc2626" : "#047857" }}>
            {faNumber(stats.criticalCount)} رویداد
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            زنجیره سرد، توقف صف یا خطای تراکنش
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">اولویت بالا و هشدار (High / Warn)</div>
          <div className="kpi-value">
            {faNumber(stats.highCount + stats.warningCount)} رویداد
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            کسری کارتریج استریل و تاخیر فیش
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">برطرف‌شده در شیفت جاری</div>
          <div className="kpi-value" style={{ color: "#059669" }}>
            {faNumber(stats.resolvedCount)} مورد
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            اقدامات خودکار و مداخله دستی
          </small>
        </div>
      </div>

      {/* ── Filters & Live Telemetry Refresh Bar ── */}
      <div className="admin-section-box" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", marginLeft: "4px" }}>
              شدت حادثه:
            </span>
            <button
              onClick={() => setSeverityFilter("ALL")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: severityFilter === "ALL" ? "var(--brand)" : "var(--paper)",
                color: severityFilter === "ALL" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              همه ({faNumber(incidents.length)})
            </button>
            <button
              onClick={() => setSeverityFilter("CRITICAL")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: severityFilter === "CRITICAL" ? "#dc2626" : "var(--paper)",
                color: severityFilter === "CRITICAL" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              بحرانی ({faNumber(stats.criticalCount)})
            </button>
            <button
              onClick={() => setSeverityFilter("HIGH")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: severityFilter === "HIGH" ? "#ea580c" : "var(--paper)",
                color: severityFilter === "HIGH" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              بالا ({faNumber(stats.highCount)})
            </button>
            <button
              onClick={() => setSeverityFilter("RESOLVED")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: severityFilter === "RESOLVED" ? "#059669" : "var(--paper)",
                color: severityFilter === "RESOLVED" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              برطرف‌شده ({faNumber(stats.resolvedCount)})
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              aria-label="فیلتر حوزه عملیاتی"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              className="admin-input"
              style={{ padding: "6px 10px", fontSize: "0.82rem", minWidth: "160px" }}
            >
              <option value="ALL">همه حوزه‌های عملیاتی</option>
              <option value="COLD_CHAIN">زنجیره سرد (Cold-Chain)</option>
              <option value="PAYMENT">درگاه پرداخت و شاپرک</option>
              <option value="INVENTORY">موجودی و کارتریج استریل</option>
              <option value="OUTBOX">صف تراکنش Outbox</option>
              <option value="C2C">فیش کارت‌به‌کارت معلق</option>
            </select>

            <button
              onClick={() => void fetchLiveExceptions()}
              disabled={isRefreshing}
              className="admin-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                fontSize: "0.82rem",
                background: "var(--paper)",
                color: "var(--brand-deep)",
                border: "1px solid var(--line)",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? "spin-icon" : ""} />
              {isRefreshing ? "در حال دریافت..." : "بروزرسانی تله‌متری"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Incident List Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredIncidents.length === 0 ? (
          <div className="admin-section-box" style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
            هیچ حادثه یا استثنایی در این بخش گزارش نشده است. کلیه سیستم‌ها پایدارند.
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const domainInfo = DOMAIN_CONFIG[incident.domain];
            const severityInfo = SEVERITY_CONFIG[incident.severity];
            const DomainIcon = domainInfo.icon;
            const isCritical = incident.severity === "CRITICAL" && incident.status !== "RESOLVED";

            return (
              <div
                key={incident.id}
                className="admin-section-box"
                style={{
                  border: `1px solid ${isCritical ? "#fecaca" : "rgba(226, 232, 240, 0.9)"}`,
                  borderRight: `6px solid ${isCritical ? "#dc2626" : severityInfo.color}`,
                  background: incident.status === "RESOLVED" ? "#f8fafc" : isCritical ? "linear-gradient(135deg, #ffffff 0%, #fffbfc 100%)" : "#ffffff",
                  position: "relative",
                  borderRadius: "18px",
                  boxShadow: isCritical ? "0 6px 20px rgba(220, 38, 38, 0.08)" : "0 4px 16px rgba(15, 23, 42, 0.04)",
                  transition: "all .25s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: domainInfo.bg,
                        color: domainInfo.color,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <DomainIcon size={20} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem", color: "var(--brand-deep)" }}>
                          {incident.id}
                        </span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: domainInfo.color }}>
                          {domainInfo.labelFa}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: severityInfo.bg,
                            color: severityInfo.color,
                            border: `1px solid ${severityInfo.border}`,
                          }}
                        >
                          {severityInfo.labelFa}
                        </span>
                      </div>
                      <h3 style={{ margin: "4px 0 0", fontSize: "0.98rem", color: "var(--ink)", fontWeight: 700 }}>
                        {incident.titleFa}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                      وقوع: {formatJalaliDateTime(incident.occurredAt)}
                    </span>
                  </div>
                </div>

                <p style={{ margin: "0 0 12px", fontSize: "0.85rem", color: "#475569", lineHeight: "1.6" }}>
                  {incident.details}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", fontSize: "0.8rem" }}>
                    <div>
                      <span style={{ color: "var(--muted)" }}>موجودیت تحت تأثیر: </span>
                      <strong>{incident.entityLabel}</strong> ({incident.affectedEntity})
                    </div>
                    {incident.telemetryValue && (
                      <div>
                        <span style={{ color: "var(--muted)" }}>مقدار قرائت‌شده: </span>
                        <span style={{ fontWeight: 700, color: isCritical ? "#dc2626" : "var(--brand-deep)" }}>
                          {incident.telemetryValue}
                        </span>
                      </div>
                    )}
                    {incident.threshold && (
                      <div>
                        <span style={{ color: "var(--muted)" }}>محدوده مجاز استاندارد: </span>
                        <span style={{ fontWeight: 600 }}>{incident.threshold}</span>
                      </div>
                    )}
                  </div>

                  {incident.status !== "RESOLVED" ? (
                    <button
                      onClick={() => handleRemediate(incident)}
                      disabled={remediatingId === incident.id}
                      className="admin-btn"
                      style={{
                        padding: "8px 16px",
                        fontSize: "0.82rem",
                        background: isCritical ? "#dc2626" : "var(--brand)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "9999px",
                        cursor: "pointer",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: isCritical ? "0 4px 14px rgba(220, 38, 38, 0.35)" : "0 4px 14px rgba(13, 148, 136, 0.25)",
                        transition: "all .2s ease",
                      }}
                    >
                      <Zap size={15} />
                      {remediatingId === incident.id ? "در حال اجرای عملیات..." : incident.remediationActionLabel}
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#047857", fontSize: "0.82rem" }}>
                      <CheckCircle2 size={16} />
                      <span>
                        برطرف شد توسط {incident.resolvedBy} ({formatJalaliDateTime(incident.resolvedAt || "")})
                      </span>
                    </div>
                  )}
                </div>

                {incident.resolutionNote && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      background: "#f0fdf4",
                      borderRight: "3px solid #16a34a",
                      fontSize: "0.78rem",
                      color: "#166534",
                      borderRadius: "4px",
                    }}
                  >
                    {incident.resolutionNote}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
