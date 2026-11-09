"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  API_BASE,
  TENANT_HEADERS,
  faNumber,
  postTenantJson,
} from "./types";
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Search,
  RefreshCw,
  Send,
  Trash2,
  ShieldCheck,
  Plus,
  MessageCircle,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  productId: string;
  productTitle?: string;
  productSlug?: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerifiedPurchase: boolean;
  moderatedBy?: string | null;
  moderatedAt?: string | null;
  createdAt: string;
}

interface ReviewCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function ReviewsCommentsManager({
  userRole = "SUPER_ADMIN",
}: {
  userRole?: string;
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [counts, setCounts] = useState<ReviewCounts>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reply modal / drawer state
  const [replyingReview, setReplyingReview] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Add review modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewProduct, setNewReviewProduct] = useState("carboxygel");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewBody, setNewReviewBody] = useState("");
  const [addReviewSubmitting, setAddReviewSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/v1/reviews/admin/all${statusFilter !== "ALL" ? `?status=${statusFilter}` : ""}`;
      const res = await fetch(url, {
        headers: TENANT_HEADERS,
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.items)) {
          setReviews(data.items);
          if (data.counts) {
            setCounts(data.counts);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleModerate = async (id: string, decision: "APPROVED" | "REJECTED") => {
    setActionBusyId(id);
    try {
      const res = await postTenantJson(`/v1/reviews/admin/${id}/moderate`, {
        decision,
        moderator: userRole === "SUPER_ADMIN" ? "مدیر ارشد سیستم" : "ناظر کلینیکال",
      });
      if (res.ok) {
        showToast(
          decision === "APPROVED"
            ? "دیدگاه خریدار با موفقیت تأیید و در فروشگاه منتشر شد."
            : "دیدگاه با موفقیت رد شد."
        );
        void loadReviews();
      } else {
        alert(res.message || "خطا در بررسی دیدگاه");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setActionBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف کامل این دیدگاه اطمینان دارید؟")) return;
    setActionBusyId(id);
    try {
      const res = await fetch(`${API_BASE}/v1/reviews/admin/${id}`, {
        method: "DELETE",
        headers: TENANT_HEADERS,
      });
      if (res.ok) {
        showToast("دیدگاه با موفقیت از سیستم حذف گردید.");
        void loadReviews();
      } else {
        alert("خطا در حذف دیدگاه");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setActionBusyId(null);
    }
  };

  const handleSendReply = async () => {
    if (!replyingReview || !replyText.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await postTenantJson(`/v1/reviews/admin/${replyingReview.id}/reply`, {
        replyText: replyText.trim(),
        moderator: "پشتیبانی علمی دکتر درمر",
      });
      if (res.ok) {
        showToast("پاسخ کارشناسی با موفقیت برای این دیدگاه ثبت شد.");
        setReplyingReview(null);
        setReplyText("");
        void loadReviews();
      } else {
        alert(res.message || "خطا در ثبت پاسخ");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewTitle.trim() || !newReviewBody.trim()) {
      alert("لطفاً تمامی فیلدهای الزامی را تکمیل کنید.");
      return;
    }
    setAddReviewSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/v1/reviews/products/${newReviewProduct}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...TENANT_HEADERS,
        },
        body: JSON.stringify({
          authorName: newReviewAuthor.trim(),
          rating: newReviewRating,
          title: newReviewTitle.trim(),
          body: newReviewBody.trim(),
        }),
      });
      if (res.ok) {
        showToast("دیدگاه جدید با موفقیت ثبت شد و در صف بررسی قرار گرفت.");
        setShowAddModal(false);
        setNewReviewAuthor("");
        setNewReviewTitle("");
        setNewReviewBody("");
        void loadReviews();
      } else {
        const err = await res.json();
        alert(err.message || "خطا در ثبت دیدگاه");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setAddReviewSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.authorName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.body.toLowerCase().includes(q) ||
      (r.productTitle && r.productTitle.toLowerCase().includes(q))
    );
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "۵.۰";

  return (
    <div className="tab-pane">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            background: "#047857",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(4, 120, 87, 0.35)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.95rem",
            animation: "slideIn 0.25s ease-out",
          }}
        >
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Top Metrics KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="kpi-card" style={{ background: "#ffffff", border: "1px solid rgba(15,23,42,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="kpi-label">کل دیدگاه‌های ثبت‌شده</span>
              <strong className="kpi-val" style={{ color: "#0f172a" }}>
                {faNumber(counts.all || reviews.length)} <small style={{ fontSize: "0.9rem" }}>دیدگاه</small>
              </strong>
            </div>
            <div style={{ background: "rgba(119,176,145,0.15)", padding: "10px", borderRadius: "14px", color: "#047857" }}>
              <MessageSquare size={22} />
            </div>
          </div>
          <small className="kpi-sub">شامل مراجعین کلینیکال و خریداران خانگی</small>
        </div>

        <div className="kpi-card" style={{ background: "#ffffff", border: "1px solid rgba(245,158,11,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="kpi-label">نیازمند بررسی و تأیید</span>
              <strong className="kpi-val" style={{ color: "#b45309" }}>
                {faNumber(counts.pending)} <small style={{ fontSize: "0.9rem" }}>در انتظار</small>
              </strong>
            </div>
            <div style={{ background: "rgba(245,158,11,0.15)", padding: "10px", borderRadius: "14px", color: "#b45309" }}>
              <Clock size={22} />
            </div>
          </div>
          <small className="kpi-sub" style={{ color: "#b45309" }}>نظرات جدید ارسال‌شده از صفحه محصولات</small>
        </div>

        <div className="kpi-card" style={{ background: "#ffffff", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="kpi-label">منتشر شده در فروشگاه</span>
              <strong className="kpi-val" style={{ color: "#047857" }}>
                {faNumber(counts.approved)} <small style={{ fontSize: "0.9rem" }}>دیدگاه فعال</small>
              </strong>
            </div>
            <div style={{ background: "rgba(16,185,129,0.15)", padding: "10px", borderRadius: "14px", color: "#047857" }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <small className="kpi-sub" style={{ color: "#047857" }}>قابل مشاهده توسط عموم کاربران در سایت</small>
        </div>

        <div className="kpi-card" style={{ background: "#ffffff", border: "1px solid rgba(15,23,42,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="kpi-label">میانگین امتیاز رضایت</span>
              <strong className="kpi-val" style={{ color: "#0f172a" }}>
                {faNumber(avgRating)} <small style={{ fontSize: "0.9rem", color: "#f59e0b" }}>★</small>
              </strong>
            </div>
            <div style={{ background: "rgba(245,158,11,0.15)", padding: "10px", borderRadius: "14px", color: "#d97706" }}>
              <Star size={22} fill="#d97706" />
            </div>
          </div>
          <small className="kpi-sub">شاخص رضایت‌سنجی بالینی مراجعین</small>
        </div>
      </div>

      {/* ── 2. Main Section Box ── */}
      <section className="admin-section-box">
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2>مدیریت نظرات، دیدگاه‌ها و رضایت‌سنجی خریداران</h2>
            <small>پایش برخط دیدگاه‌های ارسالی از فروشگاه، تایید یا رد ادعاها و پاسخ کارشناسی درماتولوژی</small>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => void loadReviews()}
              className="btn-action"
              style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "9999px" }}
              title="بارگذاری مجدد نظرات"
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span>به‌روزرسانی</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "9999px",
                padding: "8px 18px",
                fontSize: "0.85rem",
              }}
            >
              <Plus size={16} />
              <span>افزودن دیدگاه بالینی جدید</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginTop: "16px" }}>
          <div className="admin-search-wrapper" style={{ flex: "1 1 300px", maxWidth: "420px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={16} style={{ position: "absolute", right: "14px", color: "var(--muted)", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="جستجو در نظرات (نام نویسنده، کالا یا متن)..."
                className="admin-search-input"
                style={{ paddingRight: "40px", width: "100%", borderRadius: "9999px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-chips-group" style={{ display: "flex", gap: "8px" }}>
            <button
              className={`filter-chip ${statusFilter === "ALL" ? "active" : ""}`}
              onClick={() => setStatusFilter("ALL")}
            >
              همه ({faNumber(counts.all || reviews.length)})
            </button>
            <button
              className={`filter-chip ${statusFilter === "PENDING" ? "active" : ""}`}
              style={statusFilter === "PENDING" ? { background: "#fef3c7", color: "#b45309", borderColor: "#f59e0b" } : {}}
              onClick={() => setStatusFilter("PENDING")}
            >
              در انتظار بررسی ({faNumber(counts.pending)})
            </button>
            <button
              className={`filter-chip ${statusFilter === "APPROVED" ? "active" : ""}`}
              style={statusFilter === "APPROVED" ? { background: "#ecfdf5", color: "#047857", borderColor: "#10b981" } : {}}
              onClick={() => setStatusFilter("APPROVED")}
            >
              تأیید شده ({faNumber(counts.approved)})
            </button>
            <button
              className={`filter-chip ${statusFilter === "REJECTED" ? "active" : ""}`}
              style={statusFilter === "REJECTED" ? { background: "#fee2e2", color: "#b91c1c", borderColor: "#ef4444" } : {}}
              onClick={() => setStatusFilter("REJECTED")}
            >
              رد شده ({faNumber(counts.rejected)})
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ marginTop: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              در حال دریافت دیدگاه‌ها از پایگاه داده...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "#f8fafc",
                borderRadius: "20px",
                border: "1px dashed rgba(15,23,42,0.15)",
                color: "var(--muted)",
              }}
            >
              <MessageSquare size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ fontWeight: 600, color: "#334155" }}>هیچ دیدگاهی در این وضعیت یافت نشد.</p>
              <small>نظرات جدیدی که کاربران در صفحه کالاها ثبت کنند بلافاصله در این بخش ظاهر می‌شوند.</small>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredReviews.map((item) => {
                const isPending = item.status === "PENDING";
                const isApproved = item.status === "APPROVED";
                const isRejected = item.status === "REJECTED";

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "20px",
                      border: isPending
                        ? "1.5px solid rgba(245,158,11,0.4)"
                        : "1px solid rgba(15,23,42,0.08)",
                      boxShadow: isPending
                        ? "0 4px 16px rgba(245,158,11,0.08)"
                        : "0 2px 8px rgba(15,23,42,0.03)",
                      padding: "20px 24px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Header Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #77B091, #047857)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          {item.authorName.slice(0, 1)}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>{item.authorName}</strong>
                            {item.isVerifiedPurchase && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "0.72rem",
                                  background: "rgba(16,185,129,0.12)",
                                  color: "#047857",
                                  padding: "2px 8px",
                                  borderRadius: "9999px",
                                  fontWeight: 600,
                                }}
                              >
                                <ShieldCheck size={12} />
                                <span>خریدار تأییدشده</span>
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px", fontSize: "0.78rem", color: "var(--muted)" }}>
                            <span style={{ fontWeight: 600, color: "#047857" }}>
                              کالا: {item.productTitle || item.productSlug}
                            </span>
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Rating */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* Rating Stars */}
                        <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }} aria-label={`امتیاز ${item.rating} از ۵`}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={15}
                              fill={s <= item.rating ? "#f59e0b" : "transparent"}
                              color={s <= item.rating ? "#f59e0b" : "#cbd5e1"}
                            />
                          ))}
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`status-pill ${
                            isApproved ? "approved" : isPending ? "pending_review" : "rejected"
                          }`}
                          style={{ borderRadius: "9999px", padding: "4px 12px", fontSize: "0.78rem" }}
                        >
                          {isApproved ? "✓ تأیید و منتشر شده" : isPending ? "⏳ در انتظار بررسی" : "✕ رد شده"}
                        </span>
                      </div>
                    </div>

                    {/* Review Title & Body */}
                    <div style={{ margin: "12px 0 16px", paddingRight: "54px" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                        {item.title}
                      </h4>
                      <p style={{ color: "#334155", lineHeight: "1.7", fontSize: "0.9rem" }}>{item.body}</p>
                    </div>

                    {/* Admin Reply Section (if present) */}
                    {item.moderatedBy && (
                      <div
                        style={{
                          margin: "12px 0 16px 0",
                          marginRight: "54px",
                          background: "rgba(119,176,145,0.08)",
                          borderRight: "3px solid #047857",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          color: "#1e293b",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#047857", marginBottom: "4px" }}>
                          <MessageCircle size={14} />
                          <span>پاسخ رسمی پشتیبانی درماتولوژی:</span>
                        </div>
                        <p style={{ margin: 0, color: "#334155" }}>{item.moderatedBy}</p>
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "12px",
                        borderTop: "1px solid rgba(15,23,42,0.06)",
                        marginRight: "54px",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "8px" }}>
                        {/* Approve Button */}
                        {!isApproved && (
                          <button
                            disabled={actionBusyId === item.id}
                            onClick={() => handleModerate(item.id, "APPROVED")}
                            className="btn-action-pill approve"
                            style={{
                              background: "#ecfdf5",
                              color: "#047857",
                              border: "1px solid #10b981",
                              padding: "6px 14px",
                              borderRadius: "9999px",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>تأیید و انتشار</span>
                          </button>
                        )}

                        {/* Reject Button */}
                        {!isRejected && (
                          <button
                            disabled={actionBusyId === item.id}
                            onClick={() => handleModerate(item.id, "REJECTED")}
                            className="btn-action-pill reject"
                            style={{
                              background: "#fee2e2",
                              color: "#b91c1c",
                              border: "1px solid #ef4444",
                              padding: "6px 14px",
                              borderRadius: "9999px",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <XCircle size={14} />
                            <span>رد دیدگاه</span>
                          </button>
                        )}

                        {/* Reply Button */}
                        <button
                          onClick={() => {
                            setReplyingReview(item);
                            setReplyText("");
                          }}
                          className="btn-action"
                          style={{
                            padding: "6px 14px",
                            borderRadius: "9999px",
                            fontSize: "0.82rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Send size={13} />
                          <span>ثبت پاسخ کارشناسی</span>
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={actionBusyId === item.id}
                        title="حذف دیدگاه"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.8rem",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      >
                        <Trash2 size={14} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Modal: Reply to Review ── */}
      {replyingReview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px 28px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                پاسخ به دیدگاه: {replyingReview.authorName}
              </h3>
              <button
                onClick={() => setReplyingReview(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "0.88rem", color: "#334155" }}>
              <strong>متن دیدگاه خریدار:</strong>
              <p style={{ margin: "4px 0 0" }}>{replyingReview.body}</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                متن پاسخ رسمی کارشناس کلینیکال دکتر درمر:
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="مثال: با سپاس از نظر ارزشمند شما، مصرف همزمان این فرمولاسیون با مرطوب‌کننده هیلین توصیه می‌گردد..."
                className="admin-input"
                style={{ width: "100%", borderRadius: "12px", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setReplyingReview(null)}
                className="btn-action"
                style={{ borderRadius: "9999px" }}
              >
                انصراف
              </button>
              <button
                onClick={handleSendReply}
                disabled={replySubmitting || !replyText.trim()}
                className="btn-primary"
                style={{ borderRadius: "9999px", padding: "8px 20px" }}
              >
                {replySubmitting ? "در حال ثبت..." : "ثبت و ارسال پاسخ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Modal: Add New Clinical Review ── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "26px 30px",
              width: "100%",
              maxWidth: "560px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                افزودن دیدگاه یا ارزیابی بالینی جدید
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReview}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    نام نویسنده / پزشک همکار *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="مثال: دکتر سارا دانش"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    محصول مرتبط *
                  </label>
                  <select
                    value={newReviewProduct}
                    onChange={(e) => setNewReviewProduct(e.target.value)}
                    className="admin-input"
                    style={{ width: "100%" }}
                  >
                    <option value="carboxygel">ژل کربوکسی‌تراپی CarboxyGel</option>
                    <option value="carboxypod">کپسول‌های فعال‌ساز CarboxyPod</option>
                    <option value="carboxypad">شیت‌ماسک‌های CarboxyPad</option>
                    <option value="healene">ژل ترمیم‌کننده هیلین Healene</option>
                    <option value="crystalene">خمیر پولیش کریستالین Crystalene</option>
                    <option value="silicalene">اسکراب دتوکس سیلیکالین Silicalene</option>
                    <option value="plasmax">دستگاه پلاسماکس PlasmaX</option>
                    <option value="retinol-ultra-active">سرم رتینول اولترا اکتیو</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    امتیاز رضایت (۱ تا ۵ ستاره) *
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="admin-input"
                    style={{ width: "100%" }}
                  >
                    <option value={5}>★★★★★ (۵ از ۵ - عالی)</option>
                    <option value={4}>★★★★☆ (۴ از ۵ - خیلی خوب)</option>
                    <option value={3}>★★★☆☆ (۳ از ۵ - متوسط)</option>
                    <option value={2}>★★☆☆☆ (۲ از ۵ - ضعیف)</option>
                    <option value={1}>★☆☆☆☆ (۱ از ۵ - ناراضی)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    عنوان خلاصه دیدگاه *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="مثال: نتایج شگفت‌انگیز در شفاف‌سازی پوست"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  متن کامل دیدگاه و تجربه مصرف *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newReviewBody}
                  onChange={(e) => setNewReviewBody(e.target.value)}
                  placeholder="توضیحات بالینی و اثربخشی فرمولاسیون روی بافت پوست..."
                  className="admin-input"
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-action"
                  style={{ borderRadius: "9999px" }}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={addReviewSubmitting}
                  className="btn-primary"
                  style={{ borderRadius: "9999px", padding: "8px 24px" }}
                >
                  {addReviewSubmitting ? "در حال ثبت..." : "ثبت دیدگاه"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
