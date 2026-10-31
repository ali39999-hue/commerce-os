"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import {
  API_BASE,
  TENANT_HEADERS,
  faNumber,
  postTenantJson,
  str,
  truncateFa,
} from "./types";

export type B2bQuoteStatus = "NEW" | "IN_REVIEW" | "QUOTED" | "CLOSED";

export interface B2bQuoteRequest {
  id?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  itemsSummary?: string;
  desiredQty?: number;
  status?: B2bQuoteStatus;
  adminNote?: string;
  medicalLicenseNumber?: string;
  clinicType?: string;
  proposedQuoteTomans?: number;
  createdAt?: string;
}

export interface B2bQuoteResponse {
  items?: B2bQuoteRequest[];
  dbAvailable?: boolean;
}

export type B2bFilter = "ALL" | B2bQuoteStatus;

const B2B_STATUS_PILL: Record<string, { cls: string; fa: string }> = {
  NEW: { cls: "b2b-new", fa: "جدید (نیازمند بررسی)" },
  IN_REVIEW: { cls: "b2b-inreview", fa: "در حال استعلام و ارزیابی" },
  QUOTED: { cls: "b2b-quoted", fa: "پیش‌فاکتور ارسال شد" },
  CLOSED: { cls: "b2b-closed", fa: "مختومه / قطعی" },
};

const B2B_FILTERS: { value: B2bFilter; fa: string }[] = [
  { value: "ALL", fa: "همه استعلام‌ها" },
  { value: "NEW", fa: "جدید" },
  { value: "IN_REVIEW", fa: "در حال بررسی" },
  { value: "QUOTED", fa: "قیمت‌گذاری شده" },
  { value: "CLOSED", fa: "مختومه" },
];

const B2B_TRANSITIONS: Record<string, { next: B2bQuoteStatus; label: string }> = {
  NEW: { next: "IN_REVIEW", label: "شروع بررسی پروانه و اقلام" },
  IN_REVIEW: { next: "QUOTED", label: "صدور پیش‌فاکتور رسمی" },
  QUOTED: { next: "CLOSED", label: "تکمیل و بستن استعلام" },
};

export default function B2BQuotesManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [b2bQuotes, setB2bQuotes] = useState<B2bQuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<B2bFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [quotePrices, setQuotePrices] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadB2b = useCallback(async (currentFilter: B2bFilter) => {
    setLoading(true);
    try {
      const query = currentFilter === "ALL" ? "" : `?status=${encodeURIComponent(currentFilter)}`;
      const res = await fetch(`${API_BASE}/v1/b2b/quote-requests${query}`, {
        headers: TENANT_HEADERS,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as B2bQuoteResponse;
      if (data?.dbAvailable === false) {
        setFailed(true);
        setB2bQuotes([]);
      } else {
        setB2bQuotes(Array.isArray(data?.items) ? data.items : []);
        setFailed(false);
      }
    } catch {
      setFailed(true);
      setB2bQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadB2b(filter);
  }, [loadB2b, filter]);

  const handleTransition = async (id: string, nextStatus: B2bQuoteStatus) => {
    setBusyId(id);
    setSuccessMsg(null);
    const note = (notes[id] ?? "").trim();
    const proposedQuote = quotePrices[id] ? Number(quotePrices[id]) : undefined;

    const payload: any = { status: nextStatus };
    if (note) payload.adminNote = note;
    if (proposedQuote) payload.proposedQuoteTomans = proposedQuote;

    const result = await postTenantJson(
      `/v1/b2b/quote-requests/${encodeURIComponent(id)}/status`,
      payload
    );

    if (!result.ok) {
      alert(`✕ تغییر وضعیت استعلام کلینیک انجام نشد: ${result.message}`);
    } else {
      setSuccessMsg(`وضعیت استعلام کلینیک با موفقیت به «${nextStatus}» انتقال یافت.`);
      setExpandedId(null);
      await loadB2b(filter);
    }
    setBusyId(null);
  };

  return (
    <div className="tab-pane">
      {failed ? (
        <div className="banner-offline-warning">
          <div>
            <strong>⚠️ هشدار اتصال سرویس استعلام B2B (AUD-08):</strong> سرویس B2B API در دسترس نیست. هیچ داده دمو جعل نمی‌شود.
          </div>
          <button onClick={() => void loadB2b(filter)} disabled={loading} className="btn-retry">
            {loading ? "در حال دریافت…" : "تلاش مجدد"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <span className="badge-live">B2B CLINIC QUOTES API (LIVE)</span>
        </div>
      )}

      {successMsg && <div className="form-feedback-success">{successMsg}</div>}

      <section className="admin-section-box">
        <div className="box-header exception-summary-header">
          <div>
            <h2>استعلام‌های خرید عمده کلینیک‌ها و مراکز درمانی</h2>
            <small>
              بررسی مجوزهای درمانی، پروانه طبابت، فرمولاسیون سفارش داده‌شده و قیمت‌گذاری سفارشی عمده.
            </small>
          </div>
          <div className="exceptions-toolbar">
            <button
              onClick={() => void loadB2b(filter)}
              disabled={loading}
              className="btn-action"
            >
              {loading ? "⏳ در حال دریافت…" : "🔄 بازخوانی فهرست"}
            </button>
          </div>
        </div>

        <div className="b2b-chips">
          {B2B_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`b2b-chip ${filter === f.value ? "active" : ""}`}
              disabled={loading}
              onClick={() => {
                setExpandedId(null);
                setFilter(f.value);
              }}
            >
              {f.fa}
            </button>
          ))}
        </div>

        {b2bQuotes.length === 0 ? (
          <p className="muted-text">
            {loading
              ? "در حال دریافت اطلاعات استعلام‌ها از سرور…"
              : filter === "ALL"
              ? "هیچ استعلامی ثبت نشده است."
              : "استعلامی با این فیلتر یافت نشد."}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>کلینیک / مرکز درمانی</th>
                <th>پزشک مسئول / رابط</th>
                <th>اطلاعات تماس</th>
                <th>اقلام درخواستی</th>
                <th>تعداد</th>
                <th>تاریخ ثبت</th>
                <th>وضعیت</th>
                <th>عملیات ارزیابی</th>
              </tr>
            </thead>
            <tbody>
              {b2bQuotes.map((q, idx) => {
                const quoteId = typeof q?.id === "string" && q.id ? q.id : "";
                const statusKey = String(q?.status ?? "");
                const pill = B2B_STATUS_PILL[statusKey];
                const transition = quoteId ? B2B_TRANSITIONS[statusKey] : undefined;
                const expanded = quoteId !== "" && expandedId === quoteId;
                const busy = busyId === quoteId;

                return (
                  <Fragment key={quoteId || `b2b-${idx}`}>
                    <tr
                      className={quoteId ? "b2b-row-clickable" : undefined}
                      onClick={quoteId ? () => setExpandedId(expanded ? null : quoteId) : undefined}
                    >
                      <td className="bold">{str(q?.companyName)}</td>
                      <td>{str(q?.contactName)}</td>
                      <td dir="ltr">
                        {str(q?.phone)}
                        {q?.email ? (
                          <>
                            <br />
                            <span className="muted-text">{String(q.email)}</span>
                          </>
                        ) : null}
                      </td>
                      <td>{truncateFa(q?.itemsSummary)}</td>
                      <td>{faNumber(q?.desiredQty)} عدد</td>
                      <td>{q?.createdAt ? formatJalaliDateTime(q.createdAt) : "—"}</td>
                      <td>
                        <span className={`status-pill ${pill?.cls ?? ""}`}>{pill?.fa ?? str(statusKey)}</span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {transition ? (
                          <button
                            className="btn-action"
                            disabled={busy}
                            onClick={() => void handleTransition(quoteId, transition.next)}
                          >
                            {busy ? "⏳" : transition.label}
                          </button>
                        ) : (
                          <span className="muted-text">—</span>
                        )}
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="b2b-expand-row">
                        <td colSpan={8}>
                          <div className="b2b-expand">
                            <strong>شرح کامل اقلام بالینی و احراز مجوزهای پزشکی</strong>
                            <p>{str(q?.itemsSummary)}</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                              <div>
                                <label htmlFor={`b2b-price-${quoteId}`}>
                                  قیمت پیشنهادی پیش‌فاکتور (تومان):
                                </label>
                                <input
                                  id={`b2b-price-${quoteId}`}
                                  className="admin-input"
                                  dir="ltr"
                                  type="number"
                                  placeholder="مبلغ کل توافق‌شده"
                                  value={quotePrices[quoteId] ?? ""}
                                  onChange={(e) =>
                                    setQuotePrices((prev) => ({ ...prev, [quoteId]: e.target.value }))
                                  }
                                />
                              </div>
                              <div>
                                <label htmlFor={`b2b-note-${quoteId}`}>
                                  یادداشت مدیر و استعلام قیمت مواد اولیه:
                                </label>
                                <textarea
                                  id={`b2b-note-${quoteId}`}
                                  rows={2}
                                  placeholder="بررسی پروانه طبابت توسط واحد حقوقی انجام شد..."
                                  value={notes[quoteId] ?? ""}
                                  onChange={(e) =>
                                    setNotes((prev) => ({ ...prev, [quoteId]: e.target.value }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
