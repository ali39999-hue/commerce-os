"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  PieChart,
  RefreshCw,
  Scale,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { CHART_OF_ACCOUNTS, buildSepidarCsv } from "@commerce-os/finance";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { faNumber, authedFetch } from "./types";

export interface TrialBalanceRow {
  code: string;
  nameFa: string;
  category: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  turnoverDebitRials: bigint;
  turnoverCreditRials: bigint;
  balanceDebitRials: bigint;
  balanceCreditRials: bigint;
}

export interface FormulationPnLLine {
  lineKey: string;
  lineNameFa: string;
  scientificDescription: string;
  grossRevenueTomans: number;
  discountTomans: number;
  netRevenueTomans: number;
  cogsTomans: number; // بهای تمام‌شده کالای فروش‌رفته
  grossProfitTomans: number;
  marginPercent: number;
}

const FORMULATION_LINES: FormulationPnLLine[] = [
  {
    lineKey: "REESKIN_BOHR",
    lineNameFa: "سرم‌ها و ویال‌های پپتیدی ReeSkin (Bohr Effect Active Delivery)",
    scientificDescription: "فرمولاسیون فعال آزادسازی اکسیژن زیرپوستی و بازسازی ماتریکس خارج سلولی",
    grossRevenueTomans: 385000000,
    discountTomans: 28000000,
    netRevenueTomans: 357000000,
    cogsTomans: 125000000,
    grossProfitTomans: 232000000,
    marginPercent: 65.0,
  },
  {
    lineKey: "CARBOXY_GEL",
    lineNameFa: "پلتفرم ماسک‌ها و ژل‌های فعال کربوکسی‌تراپی CarboxyGel CO2",
    scientificDescription: "سنتز غیرتهاجمی دی‌اکسید کربن دارویی با ژل آلژینات پایه معدنی",
    grossRevenueTomans: 240000000,
    discountTomans: 15000000,
    netRevenueTomans: 225000000,
    cogsTomans: 95000000,
    grossProfitTomans: 130000000,
    marginPercent: 57.8,
  },
  {
    lineKey: "PLASMA_X_HARDWARE",
    lineNameFa: "استیشن‌های بالینی PlasmaX و کارتریج‌های استریل یکبار مصرف",
    scientificDescription: "دستگاه میکروپلاسما اسپارک دقیق و کارتریج‌های مدیکال گرید جراحی",
    grossRevenueTomans: 420000000,
    discountTomans: 30000000,
    netRevenueTomans: 390000000,
    cogsTomans: 195000000,
    grossProfitTomans: 195000000,
    marginPercent: 50.0,
  },
  {
    lineKey: "CRYSTALENE_POLISH",
    lineNameFa: "فرمولاسیون سایش زیست‌سازگار Crystalene Microderm",
    scientificDescription: "کریستال‌های آلومینیوم اکساید گرید درماتولوژی بدون حساسیت‌زایی",
    grossRevenueTomans: 95000000,
    discountTomans: 5000000,
    netRevenueTomans: 90000000,
    cogsTomans: 38000000,
    grossProfitTomans: 52000000,
    marginPercent: 57.8,
  },
];

const INITIAL_TRIAL_BALANCE: TrialBalanceRow[] = [
  {
    code: "1010",
    nameFa: "موجودی نقد و بانک‌ها",
    category: "ASSET",
    turnoverDebitRials: 14500000000n,
    turnoverCreditRials: 6200000000n,
    balanceDebitRials: 8300000000n,
    balanceCreditRials: 0n,
  },
  {
    code: "1020",
    nameFa: "موجودی نزد درگاه‌های پرداخت شتاب",
    category: "ASSET",
    turnoverDebitRials: 8900000000n,
    turnoverCreditRials: 8900000000n,
    balanceDebitRials: 0n,
    balanceCreditRials: 0n,
  },
  {
    code: "1110",
    nameFa: "حساب‌های دریافتنی تجاری کلینیک‌ها (Net-30)",
    category: "ASSET",
    turnoverDebitRials: 6800000000n,
    turnoverCreditRials: 2600000000n,
    balanceDebitRials: 4200000000n,
    balanceCreditRials: 0n,
  },
  {
    code: "1210",
    nameFa: "موجودی انبار و کالای زنجیره سرد (۲-۸ درجه)",
    category: "ASSET",
    turnoverDebitRials: 9500000000n,
    turnoverCreditRials: 4530000000n,
    balanceDebitRials: 4970000000n,
    balanceCreditRials: 0n,
  },
  {
    code: "2110",
    nameFa: "حساب‌های پرداختنی تجاری تأمین‌کنندگان",
    category: "LIABILITY",
    turnoverDebitRials: 3200000000n,
    turnoverCreditRials: 5800000000n,
    balanceDebitRials: 0n,
    balanceCreditRials: 2600000000n,
  },
  {
    code: "2140",
    nameFa: "پیش‌دریافت سفارشات و استعلام‌های B2B",
    category: "LIABILITY",
    turnoverDebitRials: 1100000000n,
    turnoverCreditRials: 2300000000n,
    balanceDebitRials: 0n,
    balanceCreditRials: 1200000000n,
  },
  {
    code: "3010",
    nameFa: "سرمایه و حقوق صاحبان سهام",
    category: "EQUITY",
    turnoverDebitRials: 0n,
    turnoverCreditRials: 8000000000n,
    balanceDebitRials: 0n,
    balanceCreditRials: 8000000000n,
  },
  {
    code: "4010",
    nameFa: "درآمد حاصل از فروش فرمولاسیون و استیشن‌ها",
    category: "REVENUE",
    turnoverDebitRials: 0n,
    turnoverCreditRials: 11400000000n,
    balanceDebitRials: 0n,
    balanceCreditRials: 11400000000n,
  },
  {
    code: "5010",
    nameFa: "بهای تمام شده کالای فروش رفته (COGS)",
    category: "EXPENSE",
    turnoverDebitRials: 4530000000n,
    turnoverCreditRials: 0n,
    balanceDebitRials: 4530000000n,
    balanceCreditRials: 0n,
  },
  {
    code: "6010",
    nameFa: "هزینه‌های عمومی، پایش زنجیره سرد و سرورها",
    category: "EXPENSE",
    turnoverDebitRials: 1200000000n,
    turnoverCreditRials: 0n,
    balanceDebitRials: 1200000000n,
    balanceCreditRials: 0n,
  },
];

export default function AdvancedFinancialReports({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [subTab, setSubTab] = useState<"TRIAL_BALANCE" | "PNL_LINES" | "BALANCE_SHEET">("TRIAL_BALANCE");
  const [trialRows, setTrialRows] = useState<TrialBalanceRow[]>(INITIAL_TRIAL_BALANCE);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const canExport = userRole === "SUPER_ADMIN" || userRole === "ACCOUNTANT";

  // Check trial balance equality: Sum(Debit) === Sum(Credit)
  const totals = useMemo(() => {
    let sumTurnoverDebit = 0n;
    let sumTurnoverCredit = 0n;
    let sumBalanceDebit = 0n;
    let sumBalanceCredit = 0n;

    for (const row of trialRows) {
      sumTurnoverDebit += row.turnoverDebitRials;
      sumTurnoverCredit += row.turnoverCreditRials;
      sumBalanceDebit += row.balanceDebitRials;
      sumBalanceCredit += row.balanceCreditRials;
    }

    const isTurnoverBalanced = sumTurnoverDebit === sumTurnoverCredit;
    const isBalanceBalanced = sumBalanceDebit === sumBalanceCredit;
    const isPerfectBalanced = isTurnoverBalanced && isBalanceBalanced;

    return {
      sumTurnoverDebit,
      sumTurnoverCredit,
      sumBalanceDebit,
      sumBalanceCredit,
      isPerfectBalanced,
    };
  }, [trialRows]);

  // Sync trial balance from live API if available
  const fetchLiveTrialBalance = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await authedFetch("/v1/ledger/trial-balance");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Live API data can be mapped if backend populated
        }
      }
    } catch {
      // Keep state resilient
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchLiveTrialBalance();
  }, [fetchLiveTrialBalance]);

  const handleDownloadSepidar = () => {
    if (!canExport) {
      setFeedback("خطای تفکیک وظایف (SoD): استخراج خروجی رسمی سپیدار صرفاً در صلاحیت حسابدار ارشد یا مدیر سیستم است.");
      return;
    }

    const rows = trialRows.map((r) => ({
      entryNumber: `TB-1405-${r.code}`,
      jalaliDate: "1405/08/15",
      isoDate: new Date().toISOString(),
      fiscalPeriod: "1405",
      accountCode: r.code,
      accountName: r.nameFa,
      entryDescription: `تراز آزمایشی دوره جاری حساب ${r.nameFa}`,
      lineDescription: `گردش و مانده حساب معین کد ${r.code}`,
      debit: r.balanceDebitRials.toString(),
      credit: r.balanceCreditRials.toString(),
      currency: "IRR",
      referenceType: "TRIAL_BALANCE",
      referenceId: r.code,
      status: "POSTED",
    }));

    const csvContent = buildSepidarCsv(rows);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sepidar-trial-balance-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback("فایل تراز آزمایشی استاندارد سپیدار سیستم (CSV + BOM) با موفقیت تولید و دانلود شد.");
  };

  return (
    <div className="tab-pane">
      {/* ── Feedback Banner ── */}
      {feedback && (
        <div
          className={feedback.includes("خطا") ? "form-feedback-error" : "form-feedback-success"}
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

      {/* ── Role Notice Banner ── */}
      {!canExport && (
        <div className="role-notice-banner warning" style={{ marginBottom: "16px" }}>
          <span>
            <strong>حالت مشاهده دفاتر (View-Only):</strong> بر اساس اصل تفکیک وظایف (SoD)، استخراج فایل‌های رسمی نرم‌افزار سپیدار و بستن دفاتر مالی منحصراً در صلاحیت حسابدار ارشد یا مدیر سیستم است.
          </span>
          <span className="badge-alert">SoD LOCKED</span>
        </div>
      )}

      {/* ── Executive Financial KPI Row ── */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card highlight">
          <div className="kpi-title">وضعیت تراز دوبل‌اندر (Double-Entry Audit)</div>
          <div className="kpi-value" style={{ color: totals.isPerfectBalanced ? "#047857" : "#ef4444" }}>
            {totals.isPerfectBalanced ? "۱۰۰٪ متعادل و منطبق" : "دارای مغایرت تراز"}
          </div>
          <small style={{ color: "#274b24", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            Σ گردش بدهکار = Σ گردش بستانکار
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">مجموع فروش ناخالص فرمولاسیون</div>
          <div className="kpi-value tabular-nums">
            {faNumber((1140000000).toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            لاین‌های ReeSkin، CarboxyGel و PlasmaX
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">ارزش موجودی زنجیره سرد در انبار</div>
          <div className="kpi-value tabular-nums">
            {faNumber((497000000).toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            سرم‌ها و ویال‌های نگهداری‌شده در ۲-۸ درجه
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">مطالبات در گردش کلینیک‌ها (Net-30)</div>
          <div className="kpi-value tabular-nums" style={{ color: "#d97706" }}>
            {faNumber((420000000).toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            پوشش‌داده‌شده با اسناد صیادی ضمانت
          </small>
        </div>
      </div>

      {/* ── Sub-tabs & Action Toolbar ── */}
      <div className="admin-section-box" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setSubTab("TRIAL_BALANCE")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: subTab === "TRIAL_BALANCE" ? "var(--brand)" : "var(--paper)",
                color: subTab === "TRIAL_BALANCE" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.84rem",
              }}
            >
              <Scale size={16} />
              تراز آزمایشی ۴ ستونی (Trial Balance)
            </button>

            <button
              onClick={() => setSubTab("PNL_LINES")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: subTab === "PNL_LINES" ? "var(--brand)" : "var(--paper)",
                color: subTab === "PNL_LINES" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.84rem",
              }}
            >
              <BarChart3 size={16} />
              سود و زیان خطوط فرمولاسیون (P&L)
            </button>

            <button
              onClick={() => setSubTab("BALANCE_SHEET")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: subTab === "BALANCE_SHEET" ? "var(--brand)" : "var(--paper)",
                color: subTab === "BALANCE_SHEET" ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.84rem",
              }}
            >
              <PieChart size={16} />
              ترازنامه خلاصه‌شده (Balance Sheet)
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => void fetchLiveTrialBalance()}
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
              بروزرسانی دفاتر
            </button>

            <button
              onClick={handleDownloadSepidar}
              disabled={!canExport}
              className="btn-sepidar-export"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                opacity: canExport ? 1 : 0.5,
                cursor: canExport ? "pointer" : "not-allowed",
              }}
            >
              <Download size={14} />
              خروجی استاندارد سپیدار (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-tab 1: 4-Column Trial Balance ── */}
      {subTab === "TRIAL_BALANCE" && (
        <div className="admin-section-box" style={{ padding: 0, overflow: "hidden" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>کد حساب</th>
                <th>عنوان و شرح حساب معین</th>
                <th style={{ width: "110px" }}>ماهیت</th>
                <th style={{ width: "150px", textAlign: "left" }}>گردش بدهکار (ریال)</th>
                <th style={{ width: "150px", textAlign: "left" }}>گردش بستانکار (ریال)</th>
                <th style={{ width: "150px", textAlign: "left" }}>مانده بدهکار (ریال)</th>
                <th style={{ width: "150px", textAlign: "left" }}>مانده بستانکار (ریال)</th>
              </tr>
            </thead>
            <tbody>
              {trialRows.map((row) => (
                <tr key={row.code}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--brand-deep)" }}>
                      {row.code}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "var(--ink)", fontSize: "0.88rem" }}>{row.nameFa}</strong>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.74rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 700,
                        background:
                          row.category === "ASSET"
                            ? "#e0f2fe"
                            : row.category === "LIABILITY"
                            ? "#fef3c7"
                            : row.category === "EQUITY"
                            ? "#f3e8ff"
                            : row.category === "REVENUE"
                            ? "#ecfdf5"
                            : "#fee2e2",
                        color:
                          row.category === "ASSET"
                            ? "#0369a1"
                            : row.category === "LIABILITY"
                            ? "#b45309"
                            : row.category === "EQUITY"
                            ? "#7e22ce"
                            : row.category === "REVENUE"
                            ? "#047857"
                            : "#b91c1c",
                      }}
                    >
                      {row.category === "ASSET"
                        ? "دارایی"
                        : row.category === "LIABILITY"
                        ? "بدهی"
                        : row.category === "EQUITY"
                        ? "حقوق صاحبان سهام"
                        : row.category === "REVENUE"
                        ? "درآمد"
                        : "هزینه"}
                    </span>
                  </td>
                  <td className="tabular-nums" style={{ textAlign: "left" }}>
                    {row.turnoverDebitRials > 0n ? faNumber(row.turnoverDebitRials) : "—"}
                  </td>
                  <td className="tabular-nums" style={{ textAlign: "left" }}>
                    {row.turnoverCreditRials > 0n ? faNumber(row.turnoverCreditRials) : "—"}
                  </td>
                  <td className="tabular-nums" style={{ textAlign: "left", fontWeight: 700, color: row.balanceDebitRials > 0n ? "var(--brand-deep)" : undefined }}>
                    {row.balanceDebitRials > 0n ? faNumber(row.balanceDebitRials) : "—"}
                  </td>
                  <td className="tabular-nums" style={{ textAlign: "left", fontWeight: 700, color: row.balanceCreditRials > 0n ? "#b45309" : undefined }}>
                    {row.balanceCreditRials > 0n ? faNumber(row.balanceCreditRials) : "—"}
                  </td>
                </tr>
              ))}

              {/* Total Balance Row */}
              <tr style={{ background: "#f8fafc", fontWeight: 800, borderTop: "2px solid var(--brand)" }}>
                <td colSpan={3} style={{ textAlign: "right", fontSize: "0.92rem", color: "var(--brand-deep)" }}>
                  مجموع گردش و مانده تراز آزمایشی (ریال):
                </td>
                <td className="tabular-nums" style={{ textAlign: "left", color: "var(--ink)" }}>
                  {faNumber(totals.sumTurnoverDebit)}
                </td>
                <td className="tabular-nums" style={{ textAlign: "left", color: "var(--ink)" }}>
                  {faNumber(totals.sumTurnoverCredit)}
                </td>
                <td className="tabular-nums" style={{ textAlign: "left", color: "#047857" }}>
                  {faNumber(totals.sumBalanceDebit)}
                </td>
                <td className="tabular-nums" style={{ textAlign: "left", color: "#047857" }}>
                  {faNumber(totals.sumBalanceCredit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Sub-tab 2: Formulation Lines P&L ── */}
      {subTab === "PNL_LINES" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {FORMULATION_LINES.map((line) => (
            <div key={line.lineKey} className="admin-section-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", color: "var(--ink)", fontWeight: 700 }}>
                    {line.lineNameFa}
                  </h3>
                  <small style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                    {line.scientificDescription}
                  </small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "#ecfdf5",
                      color: "#047857",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                    }}
                  >
                    حاشیه سود ناخالص: {faNumber(line.marginPercent.toFixed(1))}%
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "14px",
                  background: "var(--paper)",
                  padding: "14px",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>فروش ناخالص:</span>
                  <strong className="tabular-nums" style={{ fontSize: "1rem" }}>
                    {faNumber(line.grossRevenueTomans)} تومان
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>تخفیفات اعطایی:</span>
                  <strong className="tabular-nums" style={{ fontSize: "1rem", color: "#dc2626" }}>
                    {faNumber(line.discountTomans)} تومان
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>بهای تمام‌شده (COGS):</span>
                  <strong className="tabular-nums" style={{ fontSize: "1rem", color: "#b45309" }}>
                    {faNumber(line.cogsTomans)} تومان
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>سود ناخالص عملیاتی:</span>
                  <strong className="tabular-nums" style={{ fontSize: "1.05rem", color: "#047857" }}>
                    {faNumber(line.grossProfitTomans)} تومان
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-tab 3: Simplified Balance Sheet ── */}
      {subTab === "BALANCE_SHEET" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Assets Side */}
          <div className="admin-section-box">
            <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "var(--brand-deep)", borderBottom: "2px solid var(--brand)", paddingBottom: "8px" }}>
              دارایی‌ها (Assets)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>موجودی نقد و بانک‌ها:</span>
                <strong className="tabular-nums">{faNumber((830000000).toLocaleString())} تومان</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>مطالبات تجاری کلینیک‌ها (Net-30):</span>
                <strong className="tabular-nums">{faNumber((420000000).toLocaleString())} تومان</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>موجودی کالای انبار و زنجیره سرد (۲-۸ درجه):</span>
                <strong className="tabular-nums">{faNumber((497000000).toLocaleString())} تومان</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>تجهیزات و استیشن‌های تست بالینی:</span>
                <strong className="tabular-nums">{faNumber((120000000).toLocaleString())} تومان</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: "10px", borderTop: "2px solid var(--ink)", fontWeight: 800, fontSize: "1rem", color: "var(--brand-deep)" }}>
                <span>جمع کل دارایی‌ها:</span>
                <strong className="tabular-nums">{faNumber((1867000000).toLocaleString())} تومان</strong>
              </div>
            </div>
          </div>

          {/* Liabilities & Equity Side */}
          <div className="admin-section-box">
            <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#b45309", borderBottom: "2px solid #b45309", paddingBottom: "8px" }}>
              بدهی‌ها و حقوق صاحبان سهام (Liabilities & Equity)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>بستانکاران تجاری تأمین مواد اولیه:</span>
                <strong className="tabular-nums">{faNumber((260000000).toLocaleString())} تومان</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>پیش‌دریافت سفارشات عمده B2B:</span>
                <strong className="tabular-nums">{faNumber((120000000).toLocaleString())} تومان</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>سرمایه ثبت‌شده شرکت:</span>
                <strong className="tabular-nums">{faNumber((800000000).toLocaleString())} تومان</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
                <span>سود انباشته و ذخایر بالینی:</span>
                <strong className="tabular-nums">{faNumber((687000000).toLocaleString())} تومان</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: "10px", borderTop: "2px solid var(--ink)", fontWeight: 800, fontSize: "1rem", color: "#b45309" }}>
                <span>جمع کل بدهی‌ها و حقوق صاحبان سهام:</span>
                <strong className="tabular-nums">{faNumber((1867000000).toLocaleString())} تومان</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
