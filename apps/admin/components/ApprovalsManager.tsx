"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, XCircle, Clock, AlertTriangle, Filter, Search } from "lucide-react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { faNumber } from "./types";

export type ApprovalTier = "LOW" | "MEDIUM" | "HIGH";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApprovalType =
  | "HIGH_VALUE_ORDER"
  | "CREDIT_LIMIT_INCREASE"
  | "COLD_CHAIN_DISPOSAL"
  | "CUSTOM_DISCOUNT"
  | "C2C_OVERRIDE";

export interface ApprovalRequestItem {
  id: string;
  type: ApprovalType;
  titleFa: string;
  tier: ApprovalTier;
  amountTomans: number;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  targetEntity: string;
  targetEntityLabel: string;
  reason: string;
  status: ApprovalStatus;
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
  decisionNote?: string;
}

const TYPE_CONFIG: Record<ApprovalType, { labelFa: string; category: string; badgeCls: string }> = {
  HIGH_VALUE_ORDER: {
    labelFa: "سفارش عمده با مبلغ بالا",
    category: "فروش B2B",
    badgeCls: "pill-type-order",
  },
  CREDIT_LIMIT_INCREASE: {
    labelFa: "افزایش سقف اعتبار کلینیک",
    category: "اعتبارسنجی",
    badgeCls: "pill-type-credit",
  },
  COLD_CHAIN_DISPOSAL: {
    labelFa: "امحای ضایعات زنجیره سرد",
    category: "کیفیت و انبار",
    badgeCls: "pill-type-disposal",
  },
  CUSTOM_DISCOUNT: {
    labelFa: "تخفیف غیراستاندارد استعلام",
    category: "قیمت‌گذاری",
    badgeCls: "pill-type-discount",
  },
  C2C_OVERRIDE: {
    labelFa: "تأیید دستی فیش کارت‌به‌کارت",
    category: "خزانه‌داری",
    badgeCls: "pill-type-c2c",
  },
};

const TIER_CONFIG: Record<ApprovalTier, { labelFa: string; color: string; bg: string; border: string }> = {
  LOW: {
    labelFa: "سطح ۱ (عادی)",
    color: "#047857",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  MEDIUM: {
    labelFa: "سطح ۲ (متوسط)",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  HIGH: {
    labelFa: "سطح ۳ (بحرانی / پرریسک)",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fecaca",
  },
};

const INITIAL_APPROVAL_REQUESTS: ApprovalRequestItem[] = [
  {
    id: "APR-9021",
    type: "HIGH_VALUE_ORDER",
    titleFa: "تأیید پیش‌فاکتور سفارش تجاری دستگاه پلاسما‌ایکس و ویال‌های پپتید",
    tier: "HIGH",
    amountTomans: 85000000,
    requesterId: "usr_op_1",
    requesterName: "رضا محمدی (اپراتور فروش)",
    requesterRole: "OPERATOR",
    targetEntity: "ORD-948250",
    targetEntityLabel: "سفارش عمده کلینیک لاله",
    reason: "مبلغ فاکتور بیش از ۵۰ میلیون تومان و شامل ۲ دستگاه PlasmaX Pro با تخفیف سازمانی است.",
    status: "PENDING",
    createdAt: "2026-11-05T08:30:00.000Z",
  },
  {
    id: "APR-9022",
    type: "COLD_CHAIN_DISPOSAL",
    titleFa: "مجوز کسر و امحای بچ آسیب‌دیده در ترانزیت هوایی ویال ReeSkin",
    tier: "HIGH",
    amountTomans: 32000000,
    requesterId: "usr_wh_2",
    requesterName: "محمد کمالی (سرپرست انبار سرد)",
    requesterRole: "OPERATOR",
    targetEntity: "BATCH-RS-9041",
    targetEntityLabel: "بچ ۹۰۴۱ سرم‌های اثر بور",
    reason: "دیتالاگر دمایی در مسیر ترانزیت افزایش دما به ۱۱.۴ درجه سانتی‌گراد (بالاتر از سقف ۸ درجه) به مدت ۷ ساعت متوالی را ثبت کرده است.",
    status: "PENDING",
    createdAt: "2026-11-05T07:15:00.000Z",
  },
  {
    id: "APR-9023",
    type: "CREDIT_LIMIT_INCREASE",
    titleFa: "درخواست ارتقای سقف خرید اعتباری Net-30 کلینیک دکتر ستوده",
    tier: "MEDIUM",
    amountTomans: 50000000,
    requesterId: "usr_b2b_3",
    requesterName: "سارا دانش (کارشناس B2B)",
    requesterRole: "OPERATOR",
    targetEntity: "CLN-302",
    targetEntityLabel: "کلینیک زیبایی زعفرانیه",
    reason: "پروانه پزشکی و چک صیادی ضمانت استعلام و تأیید شد؛ درخواست افزایش سقف از ۱۰۰ به ۱۵۰ میلیون تومان.",
    status: "PENDING",
    createdAt: "2026-11-04T16:20:00.000Z",
  },
  {
    id: "APR-9019",
    type: "CUSTOM_DISCOUNT",
    titleFa: "اعمال تخفیف ۲۲٪ روی پکیج کربوکسی‌ژل همایش پوست",
    tier: "MEDIUM",
    amountTomans: 14500000,
    requesterId: "usr_b2b_3",
    requesterName: "سارا دانش (کارشناس B2B)",
    requesterRole: "OPERATOR",
    targetEntity: "QUO-8841",
    targetEntityLabel: "استعلام انجمن متخصصین پوست",
    reason: "تخفیف بیشتر از سقف مجاز ۱۵٪ فروش به دلیل درج لوگوی اسپانسری Dr Dermer در سالن همایش.",
    status: "APPROVED",
    createdAt: "2026-11-03T11:00:00.000Z",
    decidedAt: "2026-11-03T14:30:00.000Z",
    decidedBy: "مدیر ارشد سیستم (Super Admin)",
    decisionNote: "به دلیل جنبه بازاریابی B2B و مستندات اسپانسری مورد تأیید است.",
  },
  {
    id: "APR-9018",
    type: "C2C_OVERRIDE",
    titleFa: "تأیید فیش بانکی با مغایرت نام صاحب کارت با حساب کاربری",
    tier: "LOW",
    amountTomans: 8900000,
    requesterId: "usr_op_1",
    requesterName: "رضا محمدی (اپراتور فروش)",
    requesterRole: "OPERATOR",
    targetEntity: "RCP-7740",
    targetEntityLabel: "فیش واریزی سفارش ۹۴۸۱۹۰",
    reason: "واریز از کارت همسر مشتری صورت گرفته و تطبیق پیامک بانک انجام شد.",
    status: "APPROVED",
    createdAt: "2026-11-02T10:15:00.000Z",
    decidedAt: "2026-11-02T11:45:00.000Z",
    decidedBy: "حسابدار ارشد",
    decisionNote: "شماره پیگیری بانک پاسارگاد با گردش حساب انطباق داده شد.",
  },
];

interface ApprovalsManagerProps {
  userRole?: string;
  currentUserId?: string;
}

export default function ApprovalsManager({
  userRole = "SUPER_ADMIN",
  currentUserId = "usr_admin_master",
}: ApprovalsManagerProps) {
  const [requests, setRequests] = useState<ApprovalRequestItem[]>(INITIAL_APPROVAL_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApprovalStatus>("PENDING");
  const [tierFilter, setTierFilter] = useState<"ALL" | ApprovalTier>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ApprovalType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ApprovalRequestItem | null>(null);
  const [decisionModalMode, setDecisionModalMode] = useState<"APPROVE" | "REJECT" | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // SoD Rules:
  // 1. Maker cannot be Checker (Creator cannot approve their own request)
  // 2. High Tier requests require SUPER_ADMIN or ACCOUNTANT
  const canDecideItem = (item: ApprovalRequestItem): { allowed: boolean; reason?: string } => {
    if (item.requesterId === currentUserId) {
      return {
        allowed: false,
        reason: "نقض اصل تفکیک وظایف (SoD): سازنده درخواست (Maker) نمی‌تواند خود تاییدکننده (Checker) باشد.",
      };
    }
    if (item.tier === "HIGH" && userRole === "OPERATOR") {
      return {
        allowed: false,
        reason: "دسترسی ناکافی: تأیید درخواست‌های سطح ۳ (High Risk) منحصراً در اختیار مدیر ارشد سیستم یا ناظر مالی است.",
      };
    }
    return { allowed: true };
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (tierFilter !== "ALL" && r.tier !== tierFilter) return false;
      if (typeFilter !== "ALL" && r.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesText =
          r.id.toLowerCase().includes(query) ||
          r.titleFa.toLowerCase().includes(query) ||
          r.targetEntity.toLowerCase().includes(query) ||
          r.targetEntityLabel.toLowerCase().includes(query) ||
          r.requesterName.toLowerCase().includes(query);
        if (!matchesText) return false;
      }
      return true;
    });
  }, [requests, statusFilter, tierFilter, typeFilter, searchQuery]);

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "PENDING");
    const highRisk = pending.filter((r) => r.tier === "HIGH");
    const pendingAmount = pending.reduce((sum, r) => sum + r.amountTomans, 0);
    const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
    const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;
    return {
      pendingCount: pending.length,
      highRiskCount: highRisk.length,
      pendingAmountTomans: pendingAmount,
      approvedCount,
      rejectedCount,
    };
  }, [requests]);

  const handleOpenDecision = (item: ApprovalRequestItem, mode: "APPROVE" | "REJECT") => {
    const check = canDecideItem(item);
    if (!check.allowed) {
      setFeedback({ type: "error", message: check.reason || "عملیات غیرمجاز است." });
      return;
    }
    setSelectedItem(item);
    setDecisionModalMode(mode);
    setDecisionNote("");
  };

  const handleConfirmDecision = () => {
    if (!selectedItem || !decisionModalMode) return;
    if (!decisionNote.trim()) {
      setFeedback({ type: "error", message: "ثبت توضیحات تصمیم‌گیری (علت تایید یا رد) الزامی است." });
      return;
    }

    const newStatus: ApprovalStatus = decisionModalMode === "APPROVE" ? "APPROVED" : "REJECTED";
    const deciderName =
      userRole === "SUPER_ADMIN"
        ? "مدیر ارشد سیستم (Super Admin)"
        : userRole === "ACCOUNTANT"
        ? "حسابدار ارشد"
        : "اپراتور مجاز";

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedItem.id
          ? {
              ...r,
              status: newStatus,
              decidedAt: new Date().toISOString(),
              decidedBy: deciderName,
              decisionNote: decisionNote.trim(),
            }
          : r
      )
    );

    setFeedback({
      type: "success",
      message: `درخواست ${selectedItem.id} با موفقیت ${
        newStatus === "APPROVED" ? "تأیید شد" : "رد شد"
      } و سند حسابرسی ثانویه ثبت گردید.`,
    });

    setSelectedItem(null);
    setDecisionModalMode(null);
    setDecisionNote("");
  };

  return (
    <div className="tab-pane">
      {/* ── Feedback Message ── */}
      {feedback && (
        <div
          className={feedback.type === "error" ? "form-feedback-error" : "form-feedback-success"}
          style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Executive KPI Cards ── */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card highlight">
          <div className="kpi-title">درخواست‌های در انتظار تأیید (Maker-Checker)</div>
          <div className="kpi-value">{faNumber(stats.pendingCount)} فقره</div>
          <small style={{ color: "#274b24", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            کنترل دوطرفه و تفکیک وظایف سازمانی
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">موارد بحرانی و پرریسک (Tier 3 High)</div>
          <div className="kpi-value" style={{ color: stats.highRiskCount > 0 ? "#ef4444" : "#047857" }}>
            {faNumber(stats.highRiskCount)} فقره
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            نیاز به تایید مدیر ارشد یا ناظر مالی
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">ارزش کل در انتظار تصمیم‌گیری</div>
          <div className="kpi-value tabular-nums">
            {faNumber(stats.pendingAmountTomans.toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            تخصیص بودجه و آزادسازی اعتبارات
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">کارنامه تصمیمات نهایی</div>
          <div className="kpi-value" style={{ display: "flex", gap: "12px", fontSize: "1.2rem" }}>
            <span style={{ color: "#047857" }}>✓ {faNumber(stats.approvedCount)} تأیید</span>
            <span style={{ color: "#dc2626" }}>✕ {faNumber(stats.rejectedCount)} رد</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            ثبت غیرقابل تغییر در لاگ حسابرسی
          </small>
        </div>
      </div>

      {/* ── Filters & Controls Bar ── */}
      <div className="admin-section-box" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", marginLeft: "4px" }}>
              وضعیت بررسی:
            </span>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`filter-btn ${statusFilter === "PENDING" ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: statusFilter === "PENDING" ? "var(--brand)" : "var(--paper)",
                color: statusFilter === "PENDING" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              در انتظار ({faNumber(stats.pendingCount)})
            </button>
            <button
              onClick={() => setStatusFilter("APPROVED")}
              className={`filter-btn ${statusFilter === "APPROVED" ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: statusFilter === "APPROVED" ? "var(--brand)" : "var(--paper)",
                color: statusFilter === "APPROVED" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              تأیید شده ({faNumber(stats.approvedCount)})
            </button>
            <button
              onClick={() => setStatusFilter("REJECTED")}
              className={`filter-btn ${statusFilter === "REJECTED" ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: statusFilter === "REJECTED" ? "var(--brand)" : "var(--paper)",
                color: statusFilter === "REJECTED" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              رد شده ({faNumber(stats.rejectedCount)})
            </button>
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: statusFilter === "ALL" ? "var(--brand)" : "var(--paper)",
                color: statusFilter === "ALL" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              همه ({faNumber(requests.length)})
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <select
              aria-label="فیلتر سطح ریسک"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="admin-input"
              style={{ padding: "6px 10px", fontSize: "0.82rem", minWidth: "140px" }}
            >
              <option value="ALL">همه سطوح ریسک (Tiers)</option>
              <option value="HIGH">سطح ۳: پرریسک (High)</option>
              <option value="MEDIUM">سطح ۲: متوسط (Medium)</option>
              <option value="LOW">سطح ۱: عادی (Low)</option>
            </select>

            <select
              aria-label="فیلتر نوع عملیات"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="admin-input"
              style={{ padding: "6px 10px", fontSize: "0.82rem", minWidth: "160px" }}
            >
              <option value="ALL">همه موضوعات عملیاتی</option>
              <option value="HIGH_VALUE_ORDER">سفارشات عمده سنگین</option>
              <option value="COLD_CHAIN_DISPOSAL">امحای زنجیره سرد</option>
              <option value="CREDIT_LIMIT_INCREASE">سقف اعتبار B2B</option>
              <option value="CUSTOM_DISCOUNT">تخفیف غیراستاندارد</option>
              <option value="C2C_OVERRIDE">فیش کارت‌به‌کارت</option>
            </select>

            <input
              type="text"
              placeholder="جستجو در شناسه، عنوان یا شخص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              style={{ padding: "6px 12px", fontSize: "0.82rem", width: "200px" }}
            />
          </div>
        </div>
      </div>

      {/* ── Approval Requests Data Table ── */}
      <div className="admin-section-box" style={{ padding: 0, overflow: "hidden" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "90px" }}>شناسه</th>
              <th style={{ width: "120px" }}>دسته‌بندی و نوع</th>
              <th>عنوان درخواست و موجودیت هدف</th>
              <th style={{ width: "110px" }}>سطح ریسک</th>
              <th style={{ width: "130px" }}>مبلغ ریالی (تومان)</th>
              <th style={{ width: "140px" }}>درخواست‌دهنده (Maker)</th>
              <th style={{ width: "110px" }}>وضعیت</th>
              <th style={{ width: "140px", textAlign: "center" }}>اقدام عملیاتی</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
                  موردی با شرایط فیلتر انتخاب شده یافت نشد.
                </td>
              </tr>
            ) : (
              filteredRequests.map((item) => {
                const typeInfo = TYPE_CONFIG[item.type];
                const tierInfo = TIER_CONFIG[item.tier];
                const check = canDecideItem(item);

                return (
                  <tr key={item.id} style={{ transition: "background .15s ease" }}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--brand-deep)", background: "rgba(13, 148, 136, 0.08)", padding: "4px 10px", borderRadius: "9999px", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                        {item.id}
                      </span>
                    </td>
                    <td>
                      <span
                        className={typeInfo.badgeCls}
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {typeInfo.labelFa}
                      </span>
                      <small style={{ display: "block", color: "var(--muted)", fontSize: "0.72rem", marginTop: "4px" }}>
                        {typeInfo.category}
                      </small>
                    </td>
                    <td>
                      <strong style={{ display: "block", color: "var(--ink)", fontSize: "0.88rem" }}>
                        {item.titleFa}
                      </strong>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "var(--paper)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            border: "1px solid var(--line)",
                            color: "var(--brand-deep)",
                            fontWeight: 600,
                          }}
                        >
                          {item.targetEntityLabel} ({item.targetEntity})
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          ثبت: {formatJalaliDateTime(item.createdAt)}
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#475569" }}>
                        {item.reason}
                      </p>
                      {item.decisionNote && (
                        <div
                          style={{
                            marginTop: "6px",
                            padding: "6px 8px",
                            background: item.status === "APPROVED" ? "#f0fdf4" : "#fef2f2",
                            borderRight: `3px solid ${item.status === "APPROVED" ? "#16a34a" : "#dc2626"}`,
                            fontSize: "0.78rem",
                            borderRadius: "4px",
                          }}
                        >
                          <strong>نظر ناظر ({item.decidedBy}):</strong> {item.decisionNote}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          background: tierInfo.bg,
                          color: tierInfo.color,
                          border: `1px solid ${tierInfo.border}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tierInfo.color }} />
                        {tierInfo.labelFa}
                      </span>
                    </td>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: "var(--ink)", fontSize: "0.92rem", whiteSpace: "nowrap" }}>
                      {faNumber(item.amountTomans)}{" "}
                      <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "var(--muted)" }}>تومان</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>
                          {item.requesterName}
                        </span>
                        <span style={{ display: "inline-block", width: "fit-content", fontSize: "0.7rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                          نقش: {item.requesterRole}
                        </span>
                      </div>
                    </td>
                    <td>
                      {item.status === "PENDING" && (
                        <span className="status-pill in_review" style={{ fontSize: "0.76rem" }}>
                          در انتظار تأیید
                        </span>
                      )}
                      {item.status === "APPROVED" && (
                        <span className="status-pill paid" style={{ fontSize: "0.76rem" }}>
                          تأیید شد
                        </span>
                      )}
                      {item.status === "REJECTED" && (
                        <span className="status-pill cancelled" style={{ fontSize: "0.76rem" }}>
                          رد شد
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.status === "PENDING" ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleOpenDecision(item, "APPROVE")}
                            disabled={!check.allowed}
                            title={!check.allowed ? check.reason : "تأیید نهایی درخواست"}
                            className="admin-btn"
                            style={{
                              padding: "6px 14px",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              background: "#059669",
                              color: "#fff",
                              border: "none",
                              borderRadius: "9999px",
                              cursor: check.allowed ? "pointer" : "not-allowed",
                              opacity: check.allowed ? 1 : 0.4,
                              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
                              transition: "all .2s ease",
                            }}
                          >
                            ✓ تأیید
                          </button>
                          <button
                            onClick={() => handleOpenDecision(item, "REJECT")}
                            disabled={!check.allowed}
                            title={!check.allowed ? check.reason : "رد درخواست"}
                            className="admin-btn"
                            style={{
                              padding: "6px 14px",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              background: "#dc2626",
                              color: "#fff",
                              border: "none",
                              borderRadius: "9999px",
                              cursor: check.allowed ? "pointer" : "not-allowed",
                              opacity: check.allowed ? 1 : 0.4,
                              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
                              transition: "all .2s ease",
                            }}
                          >
                            ✕ رد
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          تصمیم ثبت شد
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Decision Modal (Approve / Reject) ── */}
      {selectedItem && decisionModalMode && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              backdropFilter: "blur(24px)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "540px",
              padding: "26px",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
              direction: "rtl",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={22} color={decisionModalMode === "APPROVE" ? "#10b981" : "#ef4444"} />
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--ink)" }}>
                  {decisionModalMode === "APPROVE" ? "تأیید رسمی درخواست (Maker-Checker)" : "رد درخواست عملیاتی"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setDecisionModalMode(null);
                }}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid rgba(226, 232, 240, 0.8)", padding: "14px 16px", borderRadius: "10px", marginBottom: "16px" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "4px" }}>
                شناسه درخواست: <strong style={{ color: "#38bdf8" }}>{selectedItem.id}</strong> | سطح ریسک:{" "}
                <span style={{ color: TIER_CONFIG[selectedItem.tier].color, fontWeight: 700 }}>
                  {TIER_CONFIG[selectedItem.tier].labelFa}
                </span>
              </div>
              <strong style={{ fontSize: "0.94rem", color: "var(--ink)", display: "block" }}>
                {selectedItem.titleFa}
              </strong>
              <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#64748b" }}>
                موجودیت هدف: <strong style={{ color: "#1e293b" }}>{selectedItem.targetEntityLabel}</strong> ({selectedItem.targetEntity})
              </div>
              <div style={{ marginTop: "4px", fontSize: "0.82rem", color: "#64748b" }}>
                مبلغ: <strong className="tabular-nums" style={{ color: "#38bdf8" }}>{faNumber(selectedItem.amountTomans)}</strong> تومان
              </div>
              <div style={{ marginTop: "4px", fontSize: "0.8rem", color: "var(--muted)" }}>
                درخواست‌دهنده: {selectedItem.requesterName}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="approval-decision-note"
                style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "6px", color: "var(--ink)" }}
              >
                مستندات و توضیحات ناظر جهت ثبت در دفاتر و لاگ حسابرسی (الزامی):
              </label>
              <textarea
                id="approval-decision-note"
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                placeholder="دلایل پذیرش، شواهد بررسی پروانه پزشکی، مستندات زنجیره سرد یا ادله رد..."
                rows={4}
                className="admin-input"
                style={{ width: "100%", resize: "vertical", fontSize: "0.85rem", padding: "10px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setDecisionModalMode(null);
                }}
                className="admin-btn"
                style={{ padding: "8px 16px", background: "rgba(255, 255, 255, 0.06)", color: "#64748b", border: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmDecision}
                className="admin-btn"
                style={{
                  padding: "8px 20px",
                  background: decisionModalMode === "APPROVE" ? "linear-gradient(135deg, #059669 0%, #10b981 100%)" : "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 800,
                  boxShadow: decisionModalMode === "APPROVE" ? "0 4px 16px rgba(16, 185, 129, 0.3)" : "0 4px 16px rgba(239, 68, 68, 0.3)",
                }}
              >
                {decisionModalMode === "APPROVE" ? "تأیید نهایی و ثبت سند" : "ثبت رد قطعی"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
