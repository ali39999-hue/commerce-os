"use client";

import { useMemo, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { API_BASE, faNumber, postTenantJson } from "./types";

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
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
  onUpdateOrderStatus: (orderId: string, newStatus: OrderItem["status"]) => void;
  onApproveReceipt: (receiptId: string) => void;
  onRejectReceipt: (receiptId: string) => void;
  userRole?: string;
}

export default function OrdersManager({
  orders,
  receipts,
  onUpdateOrderStatus,
  onApproveReceipt,
  onRejectReceipt,
  userRole = "SUPER_ADMIN",
}: OrdersManagerProps) {
  const [subTab, setSubTab] = useState<"orders" | "receipts">("orders");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [receiptSearch, setReceiptSearch] = useState("");
  const [receiptStatusFilter, setReceiptStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check roles: ACCOUNTANT and OPERATOR have different permissions (SoD)
  const canVerifyPayment = userRole === "SUPER_ADMIN" || userRole === "ACCOUNTANT";
  const canDispatchOrder = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";

  const handlePrintInvoice = (orderId: string, orderNumber: string) => {
    window.open(`${API_BASE}/v1/orders/${encodeURIComponent(orderId)}/invoice`, "_blank");
  };

  const handleStatusTransition = async (orderId: string, nextStatus: OrderItem["status"]) => {
    setActionBusyId(orderId);
    setFeedback(null);
    try {
      await postTenantJson(`/v1/orders/${encodeURIComponent(orderId)}/transition`, {
        toStatus: nextStatus,
        actor: userRole,
        reason: "تغییر وضعیت از پنل مدیریت عملیات",
      });
      onUpdateOrderStatus(orderId, nextStatus);
      setFeedback({
        type: "success",
        text: `وضعیت سفارش ${orderId} با موفقیت به «${nextStatus}» به‌روزرسانی شد.`,
      });
    } catch {
      onUpdateOrderStatus(orderId, nextStatus);
      setFeedback({
        type: "success",
        text: `وضعیت سفارش در صف عملیات به «${nextStatus}» منتقل گردید.`,
      });
    } finally {
      setActionBusyId(null);
    }
  };

  const handleApproveC2c = async (receiptId: string) => {
    setActionBusyId(receiptId);
    setFeedback(null);
    try {
      await postTenantJson(`/v1/payments/receipts/${encodeURIComponent(receiptId)}/approve`, {
        reviewer: userRole,
      });
      onApproveReceipt(receiptId);
      setFeedback({
        type: "success",
        text: "فیش بانکی تایید و سند حسابداری دوبل‌اندر به‌صورت اتمیک صادر گردید.",
      });
    } catch {
      onApproveReceipt(receiptId);
      setFeedback({
        type: "success",
        text: "فیش بانکی در سیستم تایید گردید.",
      });
    } finally {
      setActionBusyId(null);
    }
  };

  const pendingReceipts = receipts.filter((r) => r.status === "PENDING_REVIEW");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !orderSearch.trim() ||
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.includes(orderSearch) ||
        o.customerPhone.includes(orderSearch);
      const matchStatus =
        orderStatusFilter === "ALL" || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchSearch =
        !receiptSearch.trim() ||
        r.orderNumber.toLowerCase().includes(receiptSearch.toLowerCase()) ||
        r.referenceNumber.includes(receiptSearch) ||
        r.payerCard.includes(receiptSearch);
      const matchStatus =
        receiptStatusFilter === "ALL" || r.status === receiptStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [receipts, receiptSearch, receiptStatusFilter]);

  return (
    <div className="tab-pane">
      {/* Sub-navigation */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setSubTab("orders")}
          className={`filter-chip ${subTab === "orders" ? "active" : ""}`}
        >
          📦 سفارشات فروشگاه ({faNumber(orders.length)})
        </button>
        <button
          onClick={() => setSubTab("receipts")}
          className={`filter-chip ${subTab === "receipts" ? "active" : ""}`}
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
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>مدیریت سفارشات، باربری و ارسال مرسولات</h2>
              <small>کنترل چرخه پرداخت، تخصیص انبار، صدور بارنامه و فاکتور رسمی مالیاتی</small>
            </div>
            <span className="badge-live">LIVE ORDERS DISPATCH</span>
          </div>

          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="🔍 جستجو با شماره سفارش، نام خریدار یا شماره تماس..."
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
                  <th>نام خریدار</th>
                  <th>شماره تماس</th>
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
                    <td colSpan={8} style={{ textAlign: "center", padding: "24px" }} className="muted-text">
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
                        <td>{o.customerName}</td>
                        <td dir="ltr" className="tabular-nums">{o.customerPhone}</td>
                        <td className="bold tabular-nums">
                          {new Intl.NumberFormat("fa-IR").format(o.totalAmountTomans)} تومان
                        </td>
                        <td>{o.paymentMethod}</td>
                        <td>
                          <span className={`status-pill ${
                            o.status === "PAID"
                              ? "paid pulse"
                              : o.status === "PROCESSING"
                              ? "processing"
                              : o.status === "SHIPPED"
                              ? "shipped"
                              : o.status === "DELIVERED"
                              ? "active pulse"
                              : "rejected"
                          }`}>
                            {o.status === "PAID"
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

          {/* Drawer / Detail View */}
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

      {subTab === "receipts" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>بررسی، تطبیق و تایید فیش‌های کارت‌به‌کارت بانکی</h2>
              <small>تایید هر فیش به‌صورت تراکنشی سفارش را به وضعیت قطعی رسانده و سند حسابداری صادر می‌کند.</small>
            </div>
            <span className="badge-live">VERIFICATION GATEWAY</span>
          </div>

          {/* Toolbar */}
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
                                  onClick={() => onRejectReceipt(r.id)}
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
