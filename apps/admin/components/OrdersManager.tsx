"use client";

import { useMemo, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import {
  API_BASE,
  LiveCartSessionItem,
  LiveCartSummary,
  faNumber,
  postTenantJson,
} from "./types";

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerType?: "B2C" | "B2B_CLINIC";
  couponCode?: string;
  visitorCode?: string;
  clinicName?: string;
  status: "PAID" | "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  totalAmountTomans: number;
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
}

export interface ReceiptItem {
  id: string;
  orderNumber: string;
  referenceNumber: string;
  payerCard: string;
  amountTomans: number;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface OrdersManagerProps {
  orders: OrderItem[];
  receipts: ReceiptItem[];
  liveCarts?: LiveCartSessionItem[];
  cartSummary?: LiveCartSummary | null;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderItem["status"]) => void;
  onApproveReceipt: (receiptId: string) => void;
  onRejectReceipt: (receiptId: string) => void;
  onRefreshOrders?: () => void;
  isLoading?: boolean;
  userRole?: string;
}

const STAGE_PILL_STYLE: Record<string, { bg: string; color: string }> = {
  BROWSING: { bg: "#f1f5f9", color: "#334155" },
  CART_REVIEW: { bg: "#e0f2fe", color: "#0369a1" },
  CHECKOUT_STARTED: { bg: "#fef3c7", color: "#b45309" },
  SHIPPING_SELECTED: { bg: "#ffedd5", color: "#c2410c" },
  PAYMENT_INITIATED: { bg: "#ede9fe", color: "#6d28d9" },
  ORDER_PLACED: { bg: "#dcfce7", color: "#15803d" },
  ABANDONED: { bg: "#fee2e2", color: "#b91c1c" },
};

export default function OrdersManager({
  orders,
  receipts,
  liveCarts = [],
  cartSummary,
  onUpdateOrderStatus,
  onApproveReceipt,
  onRejectReceipt,
  onRefreshOrders,
  isLoading,
  userRole = "SUPER_ADMIN",
}: OrdersManagerProps) {
  const [subTab, setSubTab] = useState<"orders" | "carts" | "receipts">("orders");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [cartSearch, setCartSearch] = useState("");
  const [cartStageFilter, setCartStageFilter] = useState<string>("ACTIVE_ONLY");
  const [receiptSearch, setReceiptSearch] = useState("");
  const [receiptStatusFilter, setReceiptStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check roles: ACCOUNTANT and OPERATOR have different permissions (SoD)
  const canVerifyPayment = userRole === "SUPER_ADMIN" || userRole === "ACCOUNTANT";
  const canDispatchOrder = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";

  const handlePrintInvoice = (orderId: string, _orderNumber: string) => {
    window.open(`${API_BASE}/v1/orders/${encodeURIComponent(orderId)}/invoice`, "_blank");
  };

  const handleStatusTransition = async (orderId: string, nextStatus: OrderItem["status"]) => {
    setActionBusyId(orderId);
    setFeedback(null);
    try {
      const res = await postTenantJson(`/v1/orders/${encodeURIComponent(orderId)}/transition`, {
        toStatus: nextStatus,
        actor: userRole,
        reason: "تغییر وضعیت از پنل مدیریت عملیات",
      });
      if (res.ok) {
        onUpdateOrderStatus(orderId, nextStatus);
        setFeedback({
          type: "success",
          text: `وضعیت سفارش با موفقیت به «${nextStatus}» به‌روزرسانی شد.`,
        });
        onRefreshOrders?.();
      } else {
        setFeedback({
          type: "error",
          text: res.message || `خطا در به‌روزرسانی وضعیت سفارش (کد ${res.status})`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطای ارتباط با سرور هنگام تغییر وضعیت سفارش";
      setFeedback({ type: "error", text: msg });
    } finally {
      setActionBusyId(null);
    }
  };

  const handleApproveC2c = async (receiptId: string) => {
    setActionBusyId(receiptId);
    setFeedback(null);
    try {
      const res = await postTenantJson(
        `/v1/payments/receipts/${encodeURIComponent(receiptId)}/approve`,
        { reviewer: userRole },
      );
      if (!res.ok) {
        setFeedback({
          type: "error",
          text: res.message || `تایید فیش ناموفق بود (کد ${res.status})`,
        });
        return;
      }
      onApproveReceipt(receiptId);
      setFeedback({
        type: "success",
        text: "فیش بانکی تایید و سند حسابداری دوبل‌اندر به‌صورت اتمیک صادر گردید.",
      });
      onRefreshOrders?.();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرویس پرداخت",
      });
    } finally {
      setActionBusyId(null);
    }
  };

  const handleRejectC2c = async (receiptId: string) => {
    setActionBusyId(receiptId);
    setFeedback(null);
    try {
      const res = await postTenantJson(
        `/v1/payments/receipts/${encodeURIComponent(receiptId)}/reject`,
        { reviewer: userRole, reason: "مغایرت شماره پیگیری در کنترل حسابداری" },
      );
      if (!res.ok) {
        setFeedback({
          type: "error",
          text: res.message || `رد فیش ناموفق بود (کد ${res.status})`,
        });
        return;
      }
      onRejectReceipt(receiptId);
      setFeedback({
        type: "success",
        text: "فیش بانکی رد شد و در تاریخچه سفارش ثبت گردید.",
      });
      onRefreshOrders?.();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "خطا در ارتباط با سرویس پرداخت",
      });
    } finally {
      setActionBusyId(null);
    }
  };

  const pendingReceipts = receipts.filter((r) => r.status === "PENDING_REVIEW");
  const activeInFunnelCount = liveCarts.filter(
    (c) => c.stage !== "ORDER_PLACED" && c.stage !== "ABANDONED",
  ).length;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !orderSearch.trim() ||
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.includes(orderSearch) ||
        o.customerPhone.includes(orderSearch) ||
        (o.couponCode || "").toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === "ALL" || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredCarts = useMemo(() => {
    return liveCarts.filter((c) => {
      const matchSearch =
        !cartSearch.trim() ||
        c.customerName.includes(cartSearch) ||
        (c.customerPhone || "").includes(cartSearch) ||
        (c.couponCode || "").toLowerCase().includes(cartSearch.toLowerCase()) ||
        (c.convertedOrderNumber || "").toLowerCase().includes(cartSearch.toLowerCase()) ||
        c.lines.some((l) => l.titleFa.includes(cartSearch));
      const matchStage =
        cartStageFilter === "ALL"
          ? true
          : cartStageFilter === "ACTIVE_ONLY"
            ? c.stage !== "ABANDONED"
            : c.stage === cartStageFilter;
      return matchSearch && matchStage;
    });
  }, [liveCarts, cartSearch, cartStageFilter]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchSearch =
        !receiptSearch.trim() ||
        r.orderNumber.toLowerCase().includes(receiptSearch.toLowerCase()) ||
        r.referenceNumber.includes(receiptSearch) ||
        r.payerCard.includes(receiptSearch);
      const matchStatus = receiptStatusFilter === "ALL" || r.status === receiptStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [receipts, receiptSearch, receiptStatusFilter]);

  return (
    <div className="tab-pane">
      {/* Sub-navigation */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => setSubTab("orders")}
          className={`b2b-chip ${subTab === "orders" ? "active" : ""}`}
        >
          📦 سفارشات فروشگاه ({faNumber(orders.length)})
        </button>
        <button
          onClick={() => setSubTab("carts")}
          className={`b2b-chip ${subTab === "carts" ? "active" : ""}`}
        >
          🛒 سبدهای زنده و مراحل تسویه
          {activeInFunnelCount > 0 && (
            <span className="badge-count" style={{ marginRight: "8px", background: "#0ea5e9" }}>
              {faNumber(activeInFunnelCount)}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab("receipts")}
          className={`b2b-chip ${subTab === "receipts" ? "active" : ""}`}
        >
          💳 تایید فیش‌های واریزی
          {pendingReceipts.length > 0 && (
            <span className="badge-count" style={{ marginRight: "8px" }}>
              {faNumber(pendingReceipts.length)}
            </span>
          )}
        </button>
      </div>

      {feedback && (
        <div className={feedback.type === "success" ? "form-feedback-success" : "form-feedback-error"}>
          {feedback.text}
        </div>
      )}

      {subTab === "orders" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2>مدیریت سفارشات، باربری و ارسال مرسولات</h2>
              <small>کنترل چرخه پرداخت، تخصیص انبار، تفکیک B2B/B2C، کوپن‌های مصرف‌شده و فاکتور رسمی</small>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {onRefreshOrders && (
                <button
                  type="button"
                  onClick={onRefreshOrders}
                  disabled={isLoading}
                  className="b2b-chip"
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "6px 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  🔄 {isLoading ? "در حال دریافت..." : "بروزرسانی از دیتابیس"}
                </button>
              )}
              <span className="badge-live">LIVE ORDERS DISPATCH</span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="🔍 جستجو با شماره سفارش، نام، موبایل یا کد تخفیف..."
                className="admin-search-input"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
            <div className="filter-chips-group">
              <button
                className={`filter-chip ${orderStatusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setOrderStatusFilter("ALL")}
              >
                همه ({faNumber(orders.length)})
              </button>
              <button
                className={`filter-chip ${orderStatusFilter === "PENDING_PAYMENT" ? "active" : ""}`}
                onClick={() => setOrderStatusFilter("PENDING_PAYMENT")}
              >
                در انتظار پرداخت ({faNumber(orders.filter((o) => o.status === "PENDING_PAYMENT").length)})
              </button>
              <button
                className={`filter-chip ${orderStatusFilter === "PAID" ? "active" : ""}`}
                onClick={() => setOrderStatusFilter("PAID")}
              >
                پرداخت‌شده ({faNumber(orders.filter((o) => o.status === "PAID").length)})
              </button>
              <button
                className={`filter-chip ${orderStatusFilter === "PROCESSING" ? "active" : ""}`}
                onClick={() => setOrderStatusFilter("PROCESSING")}
              >
                آماده‌سازی ({faNumber(orders.filter((o) => o.status === "PROCESSING").length)})
              </button>
              <button
                className={`filter-chip ${orderStatusFilter === "SHIPPED" ? "active" : ""}`}
                onClick={() => setOrderStatusFilter("SHIPPED")}
              >
                ارسال‌شده ({faNumber(orders.filter((o) => o.status === "SHIPPED").length)})
              </button>
              <button
                className={`filter-chip ${orderStatusFilter === "DELIVERED" ? "active" : ""}`}
                onClick={() => setOrderStatusFilter("DELIVERED")}
              >
                تحویل‌شده ({faNumber(orders.filter((o) => o.status === "DELIVERED").length)})
              </button>
            </div>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>کد سفارش</th>
                  <th>خریدار و کانال</th>
                  <th>شماره تماس</th>
                  <th>تخفیف / ویزیتور</th>
                  <th>مبلغ کل</th>
                  <th>روش پرداخت</th>
                  <th>وضعیت سفارش</th>
                  <th>تاریخ و ساعت</th>
                  <th>عملیات ردیفی</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "24px" }} className="muted-text">
                      سفارشی با این مشخصات یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const busy = actionBusyId === o.id;
                    return (
                      <tr key={o.id}>
                        <td className="bold" dir="ltr">
                          {o.orderNumber}
                        </td>
                        <td>
                          <div>{o.customerName}</div>
                          <small style={{ color: o.customerType === "B2B_CLINIC" ? "#6d28d9" : "#64748b", fontWeight: 700 }}>
                            {o.customerType === "B2B_CLINIC"
                              ? `🏥 B2B${o.clinicName ? ` · ${o.clinicName}` : ""}`
                              : "شخصی B2C"}
                          </small>
                        </td>
                        <td dir="ltr" className="tabular-nums">{o.customerPhone}</td>
                        <td>
                          {o.couponCode ? (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                background: "#ecfdf5",
                                color: "#047857",
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                              dir="ltr"
                            >
                              {o.couponCode}
                            </span>
                          ) : (
                            <span className="muted-text">—</span>
                          )}
                          {o.visitorCode && (
                            <div style={{ fontSize: "11px", color: "#0369a1", marginTop: "2px" }} dir="ltr">
                              {o.visitorCode}
                            </div>
                          )}
                        </td>
                        <td className="bold tabular-nums">
                          {new Intl.NumberFormat("fa-IR").format(o.totalAmountTomans)} تومان
                        </td>
                        <td>{o.paymentMethod}</td>
                        <td>
                          <span className={`status-pill ${
                            o.status === "PAID"
                              ? "paid pulse"
                              : o.status === "PENDING_PAYMENT"
                                ? "pending_review"
                                : o.status === "PROCESSING"
                                  ? "processing"
                                  : o.status === "SHIPPED"
                                    ? "shipped"
                                    : o.status === "DELIVERED"
                                      ? "active pulse"
                                      : "rejected"
                          }`}>
                            {o.status === "PENDING_PAYMENT"
                              ? "در انتظار پرداخت"
                              : o.status === "PAID"
                                ? "پرداخت‌شده"
                                : o.status === "PROCESSING"
                                  ? "آماده‌سازی انبار"
                                  : o.status === "SHIPPED"
                                    ? "ارسال به باربری"
                                    : o.status === "DELIVERED"
                                      ? "تحویل موفق"
                                      : o.status}
                          </span>
                        </td>
                        <td className="tabular-nums">{formatJalaliDateTime(o.createdAt)}</td>
                        <td>
                          <div className="action-button-group">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="btn-action"
                              title="بررسی جزئیات سفارش"
                            >
                              🔍 جزئیات
                            </button>
                            {canDispatchOrder && o.status === "PAID" && (
                              <button
                                onClick={() => void handleStatusTransition(o.id, "PROCESSING")}
                                disabled={busy}
                                className="btn-action"
                              >
                                {busy ? "⏳" : "آماده‌سازی"}
                              </button>
                            )}
                            {canDispatchOrder && o.status === "PROCESSING" && (
                              <button
                                onClick={() => void handleStatusTransition(o.id, "SHIPPED")}
                                disabled={busy}
                                className="btn-action"
                              >
                                {busy ? "⏳" : "تحویل باربری"}
                              </button>
                            )}
                            {canDispatchOrder && o.status === "SHIPPED" && (
                              <button
                                onClick={() => void handleStatusTransition(o.id, "DELIVERED")}
                                disabled={busy}
                                className="btn-action"
                              >
                                {busy ? "⏳" : "تایید تحویل"}
                              </button>
                            )}
                            <button
                              onClick={() => handlePrintInvoice(o.id, o.orderNumber)}
                              className="btn-action"
                              title="چاپ فاکتور رسمی"
                            >
                              🖨️ فاکتور
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "var(--paper)",
                border: "2px solid var(--brand)",
                borderRadius: "var(--radius)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ margin: 0, color: "var(--brand-deep)" }}>
                  پرونده سفارش {selectedOrder.orderNumber} ({selectedOrder.customerName})
                </h3>
                <button onClick={() => setSelectedOrder(null)} className="btn-reject">
                  ✕ بستن جزئیات
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", fontSize: ".86rem" }}>
                <div>
                  <strong>شماره تماس: </strong>
                  <span dir="ltr">{selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <strong>کانال و کلینیک: </strong>
                  <span>{selectedOrder.customerType === "B2B_CLINIC" ? `کلینیکی B2B ${selectedOrder.clinicName || ""}` : "مصرف‌کننده B2C"}</span>
                </div>
                <div>
                  <strong>کد تخفیف / ویزیتور: </strong>
                  <span dir="ltr">{selectedOrder.couponCode || "—"} {selectedOrder.visitorCode ? `(${selectedOrder.visitorCode})` : ""}</span>
                </div>
                <div>
                  <strong>روش پرداخت: </strong>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <strong>مبلغ نهایی: </strong>
                  <span className="bold">{new Intl.NumberFormat("fa-IR").format(selectedOrder.totalAmountTomans)} تومان</span>
                </div>
                <div>
                  <strong>زمان ثبت در سیستم: </strong>
                  <span>{formatJalaliDateTime(selectedOrder.createdAt)}</span>
                </div>
                <div>
                  <strong>شناسه پیگیری دیتابیس: </strong>
                  <code dir="ltr" style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: "4px" }}>{selectedOrder.id}</code>
                </div>
                <div>
                  <strong>بارنامه / کد رهگیری پستی: </strong>
                  <span dir="ltr">{selectedOrder.trackingNumber || "— (صادر نشده)"}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {subTab === "carts" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2>رصد برخط سبدهای خرید و قیف تسویه‌حساب (Live Cart & Checkout Funnel)</h2>
              <small>هر زمان کاربری محصولی را به سبد بیفزاید یا وارد مراحل تسویه شود، وضعیت لحظه‌ای آن در این جدول ثبت و بروزرسانی می‌شود.</small>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {onRefreshOrders && (
                <button
                  type="button"
                  onClick={onRefreshOrders}
                  disabled={isLoading}
                  className="b2b-chip"
                >
                  🔄 {isLoading ? "در حال دریافت..." : "بروزرسانی لحظه‌ای"}
                </button>
              )}
              <span className="badge-live">REAL-TIME BUYER TELEMETRY</span>
            </div>
          </div>

          {cartSummary && (
            <div className="kpi-grid" style={{ marginBottom: "18px" }}>
              <div className="kpi-card">
                <span className="kpi-title">در سبد خرید و بازبینی</span>
                <strong className="kpi-value tabular-nums">{faNumber(cartSummary.activeBrowsing)} کاربر</strong>
              </div>
              <div className="kpi-card">
                <span className="kpi-title">شروع تسویه / انتخاب ارسال</span>
                <strong className="kpi-value tabular-nums">{faNumber(cartSummary.inCheckout)} کاربر</strong>
              </div>
              <div className="kpi-card">
                <span className="kpi-title">اقدام به پرداخت</span>
                <strong className="kpi-value tabular-nums">{faNumber(cartSummary.paymentInitiated)} مورد</strong>
              </div>
              <div className="kpi-card highlight">
                <span className="kpi-title">ارزش سبدهای فعال باز</span>
                <strong className="kpi-value tabular-nums">
                  {new Intl.NumberFormat("fa-IR").format(cartSummary.potentialRevenueTomans)} تومان
                </strong>
              </div>
            </div>
          )}

          <div className="admin-toolbar">
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="🔍 جستجو با نام، موبایل، محصول داخل سبد یا کد تخفیف..."
                className="admin-search-input"
                value={cartSearch}
                onChange={(e) => setCartSearch(e.target.value)}
              />
            </div>
            <div className="filter-chips-group">
              <button
                className={`filter-chip ${cartStageFilter === "ACTIVE_ONLY" ? "active" : ""}`}
                onClick={() => setCartStageFilter("ACTIVE_ONLY")}
              >
                سبدهای فعال و تبدیل‌شده
              </button>
              <button
                className={`filter-chip ${cartStageFilter === "ALL" ? "active" : ""}`}
                onClick={() => setCartStageFilter("ALL")}
              >
                همه ({faNumber(liveCarts.length)})
              </button>
              <button
                className={`filter-chip ${cartStageFilter === "CHECKOUT_STARTED" ? "active" : ""}`}
                onClick={() => setCartStageFilter("CHECKOUT_STARTED")}
              >
                در حال تسویه
              </button>
              <button
                className={`filter-chip ${cartStageFilter === "PAYMENT_INITIATED" ? "active" : ""}`}
                onClick={() => setCartStageFilter("PAYMENT_INITIATED")}
              >
                اقدام به پرداخت
              </button>
              <button
                className={`filter-chip ${cartStageFilter === "ORDER_PLACED" ? "active" : ""}`}
                onClick={() => setCartStageFilter("ORDER_PLACED")}
              >
                سفارش ثبت‌شده
              </button>
            </div>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>خریدار و کانال</th>
                  <th>وضعیت زنده در قیف</th>
                  <th>اقلام داخل سبد</th>
                  <th>کوپن / ارسال</th>
                  <th>مبلغ سبد</th>
                  <th>سفارش تبدیل‌شده</th>
                  <th>آخرین فعالیت</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }} className="muted-text">
                      هنوز سبد خرید فعالی از فروشگاه همگام‌سازی نشده است.
                    </td>
                  </tr>
                ) : (
                  filteredCarts.map((c) => {
                    const pill = STAGE_PILL_STYLE[c.stage] ?? STAGE_PILL_STYLE.BROWSING;
                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="bold">{c.customerName}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }} dir="ltr">
                            {c.customerPhone || "مهمان (بدون موبایل)"}
                          </div>
                          <small style={{ color: c.customerType === "B2B_CLINIC" ? "#6d28d9" : "#475569", fontWeight: 700 }}>
                            {c.customerType === "B2B_CLINIC" ? "🏥 کلینیک B2B" : "B2C"}
                          </small>
                        </td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "11px",
                              fontWeight: 700,
                              background: pill.bg,
                              color: pill.color,
                            }}
                          >
                            {c.stageLabelFa}
                          </span>
                        </td>
                        <td style={{ fontSize: "12px" }}>
                          {c.lines.length === 0 ? (
                            <span className="muted-text">— ({faNumber(c.itemsCount)} قلم)</span>
                          ) : (
                            c.lines.slice(0, 3).map((l) => (
                              <div key={l.id}>
                                • {l.titleFa} ({faNumber(l.qty)}×)
                              </div>
                            ))
                          )}
                        </td>
                        <td style={{ fontSize: "12px" }}>
                          {c.couponCode && (
                            <span
                              dir="ltr"
                              style={{
                                display: "inline-block",
                                background: "#ecfdf5",
                                color: "#047857",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                fontWeight: 700,
                              }}
                            >
                              {c.couponCode}
                            </span>
                          )}
                          {c.shippingMethod && (
                            <div style={{ color: "var(--muted)", marginTop: "3px" }} dir="ltr">
                              {c.shippingMethod}
                            </div>
                          )}
                        </td>
                        <td className="bold tabular-nums">
                          {new Intl.NumberFormat("fa-IR").format(c.totalTomans)} تومان
                          {c.discountTomans > 0 && (
                            <small style={{ display: "block", color: "#059669", fontWeight: 600 }}>
                              تخفیف: {new Intl.NumberFormat("fa-IR").format(c.discountTomans)} ت
                            </small>
                          )}
                        </td>
                        <td dir="ltr" className="bold">
                          {c.convertedOrderNumber || "—"}
                        </td>
                        <td className="tabular-nums">{formatJalaliDateTime(c.lastActivityAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {subTab === "receipts" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>بررسی، تطبیق و تایید فیش‌های کارت‌به‌کارت بانکی</h2>
              <small>تایید هر فیش به‌صورت تراکنشی سفارش را به وضعیت قطعی رسانده و سند حسابداری صادر می‌کند.</small>
            </div>
            <span className="badge-live">VERIFICATION GATEWAY</span>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="🔍 جستجو با شماره سفارش، شماره پیگیری یا کارت..."
                className="admin-search-input"
                value={receiptSearch}
                onChange={(e) => setReceiptSearch(e.target.value)}
              />
            </div>
            <div className="filter-chips-group">
              <button
                className={`filter-chip ${receiptStatusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setReceiptStatusFilter("ALL")}
              >
                همه ({faNumber(receipts.length)})
              </button>
              <button
                className={`filter-chip ${receiptStatusFilter === "PENDING_REVIEW" ? "active" : ""}`}
                onClick={() => setReceiptStatusFilter("PENDING_REVIEW")}
              >
                در انتظار بررسی ({faNumber(receipts.filter((r) => r.status === "PENDING_REVIEW").length)})
              </button>
              <button
                className={`filter-chip ${receiptStatusFilter === "APPROVED" ? "active" : ""}`}
                onClick={() => setReceiptStatusFilter("APPROVED")}
              >
                تایید شده ({faNumber(receipts.filter((r) => r.status === "APPROVED").length)})
              </button>
              <button
                className={`filter-chip ${receiptStatusFilter === "REJECTED" ? "active" : ""}`}
                onClick={() => setReceiptStatusFilter("REJECTED")}
              >
                رد شده ({faNumber(receipts.filter((r) => r.status === "REJECTED").length)})
              </button>
            </div>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>شناسه سفارش</th>
                  <th>شماره پیگیری فیش</th>
                  <th>کارت واریزکننده</th>
                  <th>مبلغ واریزی</th>
                  <th>وضعیت فیش</th>
                  <th>تاریخ ثبت</th>
                  <th>عملیات مالی</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }} className="muted-text">
                      فیشی با این مشخصات یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((r) => {
                    const busy = actionBusyId === r.id;
                    return (
                      <tr key={r.id}>
                        <td className="bold" dir="ltr">
                          {r.orderNumber}
                        </td>
                        <td className="bold" dir="ltr">
                          {r.referenceNumber}
                        </td>
                        <td dir="ltr" className="tabular-nums">{r.payerCard}</td>
                        <td className="bold tabular-nums">
                          {new Intl.NumberFormat("fa-IR").format(r.amountTomans)} تومان
                        </td>
                        <td>
                          <span className={`status-pill ${
                            r.status === "APPROVED"
                              ? "approved pulse"
                              : r.status === "PENDING_REVIEW"
                                ? "pending_review"
                                : "rejected"
                          }`}>
                            {r.status === "PENDING_REVIEW"
                              ? "در انتظار بررسی"
                              : r.status === "APPROVED"
                                ? "تایید شده"
                                : "رد شده"}
                          </span>
                        </td>
                        <td className="tabular-nums">{formatJalaliDateTime(r.createdAt)}</td>
                        <td>
                          {r.status === "PENDING_REVIEW" ? (
                            canVerifyPayment ? (
                              <div className="action-button-group">
                                <button
                                  onClick={() => void handleApproveC2c(r.id)}
                                  disabled={busy}
                                  className="btn-approve"
                                >
                                  {busy ? "⏳" : "✓ تایید و صدور سند"}
                                </button>
                                <button
                                  onClick={() => void handleRejectC2c(r.id)}
                                  disabled={busy}
                                  className="btn-reject"
                                >
                                  ✕ رد فیش
                                </button>
                              </div>
                            ) : (
                              <span className="muted-text">نیازمند دسترسی حسابداری</span>
                            )
                          ) : (
                            <span className="muted-text">بررسی شد</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
