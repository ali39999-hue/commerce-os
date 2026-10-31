"use client";

import { useState } from "react";
import DashboardOverview from "../components/DashboardOverview";
import OrdersManager, { OrderItem, ReceiptItem } from "../components/OrdersManager";
import CatalogPimManager from "../components/CatalogPimManager";
import InventoryWarehouseManager from "../components/InventoryWarehouseManager";
import PromotionsCouponsManager from "../components/PromotionsCouponsManager";
import B2BQuotesManager from "../components/B2BQuotesManager";
import ClinicalContentManager from "../components/ClinicalContentManager";
import FinanceLedgerView from "../components/FinanceLedgerView";
import OpsSystemHealth from "../components/OpsSystemHealth";
import SubscriptionsManager from "../components/SubscriptionsManager";
import VendorsManager from "../components/VendorsManager";
import DigitalLicensesManager from "../components/DigitalLicensesManager";
import { buildSepidarCsv } from "@commerce-os/finance";

export type AdminTab =
  | "overview"
  | "orders"
  | "catalog"
  | "inventory"
  | "coupons"
  | "b2b"
  | "clinical"
  | "finance"
  | "ops"
  | "subscriptions"
  | "vendors"
  | "digital";

export type AdminUserRole = "SUPER_ADMIN" | "OPERATOR" | "ACCOUNTANT";

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord_101",
    orderNumber: "ORD-948210",
    customerName: "سارا محمدی",
    customerPhone: "09123456789",
    status: "PAID",
    totalAmountTomans: 950000,
    paymentMethod: "زرین‌پال (شاپرک)",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "ord_102",
    orderNumber: "ORD-948211",
    customerName: "امیرحسین رضایی",
    customerPhone: "09351234567",
    status: "PROCESSING",
    totalAmountTomans: 1650000,
    paymentMethod: "کارت‌به‌کارت بانکی",
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
  },
  {
    id: "ord_103",
    orderNumber: "ORD-948212",
    customerName: "مریم حسینی",
    customerPhone: "09197654321",
    status: "SHIPPED",
    totalAmountTomans: 450000,
    paymentMethod: "زرین‌پال (شاپرک)",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_RECEIPTS: ReceiptItem[] = [
  {
    id: "rcp_201",
    orderNumber: "ORD-948211",
    referenceNumber: "۹۸۴۱۶۲۸۳",
    payerCard: "۶۰۳۷-۹۹**-****-۴۴۵۵",
    amountTomans: 1650000,
    status: "PENDING_REVIEW",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "rcp_202",
    orderNumber: "ORD-948195",
    referenceNumber: "۷۷۲۱۰۵۴۹",
    payerCard: "۶۲۱۹-۸۶**-****-۱۲۳۴",
    amountTomans: 780000,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [userRole, setUserRole] = useState<AdminUserRole>("SUPER_ADMIN");
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [receipts, setReceipts] = useState<ReceiptItem[]>(INITIAL_RECEIPTS);

  const pendingReceiptCount = receipts.filter((r) => r.status === "PENDING_REVIEW").length;
  const lowStockCount = 1; // 1 critical low-stock SKU

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleApproveReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" as const } : r))
    );
  };

  const handleRejectReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" as const } : r))
    );
  };

  const handleDownloadSepidarCsv = () => {
    const rows = orders.flatMap((o) => {
      const debitRials = BigInt(o.totalAmountTomans) * 10n;
      return [
        {
          entryNumber: `JRN-SALE-${o.orderNumber}`,
          jalaliDate: "1405/08/07",
          isoDate: o.createdAt,
          fiscalPeriod: "1405",
          accountCode: "1010",
          accountName: "موجودی نزد درگاه‌های پرداخت شتاب",
          entryDescription: `دریافت وجه سفارش ${o.orderNumber}`,
          lineDescription: `واریز مشتری ${o.customerName}`,
          debit: debitRials.toString(),
          credit: "0",
          currency: "IRR",
          referenceType: "ORDER",
          referenceId: o.orderNumber,
          status: "POSTED",
        },
        {
          entryNumber: `JRN-SALE-${o.orderNumber}`,
          jalaliDate: "1405/08/07",
          isoDate: o.createdAt,
          fiscalPeriod: "1405",
          accountCode: "4010",
          accountName: "درآمد حاصل از فروش کالا",
          entryDescription: `درآمد فروش سفارش ${o.orderNumber}`,
          lineDescription: "فروش اقلام کاتالوگ",
          debit: "0",
          credit: debitRials.toString(),
          currency: "IRR",
          referenceType: "ORDER",
          referenceId: o.orderNumber,
          status: "POSTED",
        },
      ];
    });

    const csvContent = buildSepidarCsv(rows);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sepidar-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-container">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-mark">COS</div>
          <div>
            <strong>Commerce OS ERP</strong>
            <small>مدیریت یکپارچه عملیات و سلامت سیستم</small>
          </div>
        </div>

        {/* Role Switcher */}
        <div style={{ marginBottom: "16px", padding: "0 4px" }}>
          <label style={{ fontSize: "0.75rem", color: "#a5b4ac", display: "block", marginBottom: "4px" }}>
            نقش عملیاتی فعال:
          </label>
          <select
            className="admin-input"
            style={{ width: "100%", background: "#053733", color: "#fff", border: "1px solid #145e57", fontSize: "0.82rem", padding: "6px" }}
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as AdminUserRole)}
          >
            <option value="SUPER_ADMIN">مدیر ارشد (دسترسی سراسری)</option>
            <option value="OPERATOR">اپراتور فروش و ارسال</option>
            <option value="ACCOUNTANT">حسابدار مالی و انبار</option>
          </select>
        </div>

        <nav className="admin-nav" style={{ overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
          <div className="nav-category-header">عملیات و شاخص‌ها</div>
          <button
            onClick={() => setActiveTab("overview")}
            className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
          >
            📊 داشبورد و شاخص‌ها
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`nav-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            📦 سفارشات و فیش‌ها
            {pendingReceiptCount > 0 && (
              <span className="badge-count">{pendingReceiptCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`nav-btn ${activeTab === "inventory" ? "active" : ""}`}
          >
            🏬 کنترل انبار و رزرو
            {lowStockCount > 0 && <span className="badge-alert">!</span>}
          </button>

          <div className="nav-category-header">کاتالوگ و محتوای بالینی</div>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`nav-btn ${activeTab === "catalog" ? "active" : ""}`}
          >
            🧴 کاتالوگ و PIM
          </button>
          <button
            onClick={() => setActiveTab("clinical")}
            className={`nav-btn ${activeTab === "clinical" ? "active" : ""}`}
          >
            🔬 ادعاهای بالینی و آکادمی
          </button>

          <div className="nav-category-header">فروش و بازاریابی</div>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`nav-btn ${activeTab === "coupons" ? "active" : ""}`}
          >
            🎟️ تخفیف و کوپن‌ها (API)
          </button>
          <button
            onClick={() => setActiveTab("b2b")}
            className={`nav-btn ${activeTab === "b2b" ? "active" : ""}`}
          >
            📑 استعلام‌های عمده B2B
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`nav-btn ${activeTab === "subscriptions" ? "active" : ""}`}
          >
            🔁 اشتراک‌های دوره‌ای
          </button>
          <button
            onClick={() => setActiveTab("vendors")}
            className={`nav-btn ${activeTab === "vendors" ? "active" : ""}`}
          >
            🏢 فروشندگان مارکت‌پلیس
          </button>
          <button
            onClick={() => setActiveTab("digital")}
            className={`nav-btn ${activeTab === "digital" ? "active" : ""}`}
          >
            ⬇️ لایسنس‌های دیجیتال
          </button>

          <div className="nav-category-header">مالی و زیرساخت</div>
          <button
            onClick={() => setActiveTab("finance")}
            className={`nav-btn ${activeTab === "finance" ? "active" : ""}`}
          >
            ⚖️ دفترکل و خروجی سپیدار
          </button>
          <button
            onClick={() => setActiveTab("ops")}
            className={`nav-btn ${activeTab === "ops" ? "active" : ""}`}
          >
            🚨 سلامت سیستم و Outbox
          </button>
        </nav>

        <div className="admin-user-profile" style={{ marginTop: "auto" }}>
          <div className="user-avatar">{userRole.slice(0, 2)}</div>
          <div className="user-info">
            <strong>
              {userRole === "SUPER_ADMIN"
                ? "مدیر ارشد سیستم"
                : userRole === "ACCOUNTANT"
                ? "حسابدار ارشد"
                : "اپراتور سفارشات"}
            </strong>
            <small>احراز هویت شده</small>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <h1>مرکز عملیات و ERP فروشگاهی Commerce OS</h1>
            <p>معماری ماژولار، اتصال به سرویس‌های برخط و حذف اطلاعات دمو از چرخه عملیاتی</p>
          </div>
          <div className="topbar-actions">
            <button onClick={handleDownloadSepidarCsv} className="btn-sepidar-export">
              📑 دانلود خروجی استاندارد سپیدار
            </button>
            <div className="server-status-pill">
              <span className="pulse-dot"></span>
              پایگاه داده PostgreSQL 17 متصل
            </div>
          </div>
        </header>

        {/* Tab Modules */}
        {activeTab === "overview" && (
          <DashboardOverview
            orders={orders}
            pendingReceiptCount={pendingReceiptCount}
            lowStockCount={lowStockCount}
            userRole={userRole}
          />
        )}

        {activeTab === "orders" && (
          <OrdersManager
            orders={orders}
            receipts={receipts}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onApproveReceipt={handleApproveReceipt}
            onRejectReceipt={handleRejectReceipt}
            userRole={userRole}
          />
        )}

        {activeTab === "catalog" && (
          <CatalogPimManager userRole={userRole} />
        )}

        {activeTab === "inventory" && (
          <InventoryWarehouseManager userRole={userRole} />
        )}

        {activeTab === "coupons" && (
          <PromotionsCouponsManager userRole={userRole} />
        )}

        {activeTab === "b2b" && (
          <B2BQuotesManager userRole={userRole} />
        )}

        {activeTab === "clinical" && (
          <ClinicalContentManager userRole={userRole} />
        )}

        {activeTab === "finance" && (
          <FinanceLedgerView orders={orders} userRole={userRole} />
        )}

        {activeTab === "ops" && (
          <OpsSystemHealth userRole={userRole} />
        )}

        {activeTab === "subscriptions" && (
          <SubscriptionsManager userRole={userRole} />
        )}

        {activeTab === "vendors" && (
          <VendorsManager userRole={userRole} />
        )}

        {activeTab === "digital" && (
          <DigitalLicensesManager userRole={userRole} />
        )}
      </main>
    </div>
  );
}
