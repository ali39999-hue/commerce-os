"use client";

import { useEffect, useState } from "react";
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
import StorefrontSectionsManager from "../components/StorefrontSectionsManager";
import AdminLoginGate from "../components/AdminLoginGate";
import {
  ADMIN_ROLES,
  clearAdminSession,
  readAdminSession,
  type AdminSessionUser,
} from "../components/types";
import { buildSepidarCsv } from "@commerce-os/finance";

export type AdminTab =
  | "overview"
  | "orders"
  | "catalog"
  | "inventory"
  | "coupons"
  | "b2b"
  | "clinical"
  | "cms"
  | "finance"
  | "ops"
  | "subscriptions"
  | "vendors"
  | "digital";

export type AdminUserRole = "SUPER_ADMIN" | "OPERATOR" | "ACCOUNTANT";

export interface DomainAccess {
  access: "FULL" | "VIEW_ONLY" | "RESTRICTED";
  labelFa: string;
}

export const DOMAIN_ACCESS_CONFIG: Record<AdminUserRole, Record<string, DomainAccess>> = {
  SUPER_ADMIN: {
    sales: { access: "FULL", labelFa: "دسترسی کامل" },
    catalog: { access: "FULL", labelFa: "دسترسی کامل" },
    clinical: { access: "FULL", labelFa: "دسترسی کامل" },
    b2b: { access: "FULL", labelFa: "دسترسی کامل" },
    finance: { access: "FULL", labelFa: "دسترسی کامل" },
    ops: { access: "FULL", labelFa: "دسترسی کامل" },
  },
  OPERATOR: {
    sales: { access: "FULL", labelFa: "عملیات سفارشات" },
    catalog: { access: "FULL", labelFa: "انبار و ارسال" },
    clinical: { access: "VIEW_ONLY", labelFa: "فقط خواندنی" },
    b2b: { access: "FULL", labelFa: "بررسی استعلام" },
    finance: { access: "RESTRICTED", labelFa: "محدود به مالی" },
    ops: { access: "VIEW_ONLY", labelFa: "پایش صف" },
  },
  ACCOUNTANT: {
    sales: { access: "FULL", labelFa: "تایید فیش‌ها" },
    catalog: { access: "VIEW_ONLY", labelFa: "ارزش‌گذاری انبار" },
    clinical: { access: "VIEW_ONLY", labelFa: "فقط خواندنی" },
    b2b: { access: "VIEW_ONLY", labelFa: "فقط خواندنی" },
    finance: { access: "FULL", labelFa: "دفترکل و تراز" },
    ops: { access: "VIEW_ONLY", labelFa: "پایش صف" },
  },
};

interface TabMeta {
  breadcrumb: [string, string, string];
  title: string;
  description: string;
}

const TAB_METADATA: Record<AdminTab, TabMeta> = {
  overview: {
    breadcrumb: ["خانه ERP", "عملیات فروش", "داشبورد و شاخص‌های کلیدی"],
    title: "میز کار مدیریت یکپارچه و شاخص‌های عملیاتی ERP",
    description: "پایش برخط فروش، موجودی، تراز دوبل‌اندر مالی و سلامت پردازشگرها",
  },
  orders: {
    breadcrumb: ["خانه ERP", "عملیات فروش", "سفارشات و فیش‌های بانکی"],
    title: "مدیریت سفارشات و تایید فیش‌های کارت‌به‌کارت",
    description: "پایش جریان تسویه شتاب، آماده‌سازی انبار، ارسال به باربری و صدور فاکتور",
  },
  coupons: {
    breadcrumb: ["خانه ERP", "عملیات فروش", "تخفیف و پروموشن‌ها"],
    title: "موتور قیمت‌گذاری، تخفیف‌ها و کدهای پروموشن",
    description: "تنظیم سقف و حداقل خرید، کنترل ظرفیت مصرف و فعال‌سازی لحظه‌ای از طریق API",
  },
  catalog: {
    breadcrumb: ["خانه ERP", "کاتالوگ و موجودی", "کاتالوگ و مدیریت PIM"],
    title: "کاتالوگ تخصصی محصولات، واریانت‌ها و PIM",
    description: "مدیریت فرمولاسیون، بیواینرت‌ها، ادعاهای بالینی و دارایی‌های رسانه‌ای DAM",
  },
  inventory: {
    breadcrumb: ["خانه ERP", "کاتالوگ و موجودی", "انبار، رزروها و زنجیره سرد"],
    title: "کنترل انبار، رزروهای سبد خرید و زنجیره سرد",
    description: "ردیابی موقعیت قفسه‌ها، پایش دمای سردخانه ۲-۸ درجه و کنترل آستانه هشدار کسری",
  },
  clinical: {
    breadcrumb: ["خانه ERP", "کلینیکال و محتوا", "ادعاهای بالینی، INCI و مقالات"],
    title: "شورای نظارت علمی، ادعاهای بالینی و استاندارد INCI",
    description: "اعتبارسنجی آزمایشگاهی کارآزمایی‌های بالینی و کدینگ ترکیبات فرمولاسیون",
  },
  cms: {
    breadcrumb: ["خانه ERP", "کلینیکال و محتوا", "مدیریت بخش‌های ویترین و CMS"],
    title: "مدیریت ویترین و فعال/غیرفعال‌سازی بخش‌های صفحه اصلی",
    description: "کنترل سوییچ برخط سکشن‌های ویترین، تریاژ، کاتالوگ، شبیه‌سازها و خبرنامه",
  },
  b2b: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "استعلام‌های خرید عمده (B2B)"],
    title: "مدیریت استعلام‌های خرید عمده و بسته‌های تجاری",
    description: "بررسی استعلام حجم فرمولاسیون، تخفیفات تیراژ و صدور پیش‌فاکتور رسمی شرکتی",
  },
  subscriptions: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "اشتراک‌های دوره‌ای و تکرارشونده"],
    title: "مدیریت اشتراک‌های درمانی و شارژ دوره‌ای",
    description: "پایش سیکل‌های اجرای خودکار، توقف موقت و تکرار سفارشات بیماران",
  },
  vendors: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "فروشندگان و تأمین‌کنندگان"],
    title: "مدیریت تأمین‌کنندگان و فروشندگان رسمی مواد اولیه",
    description: "پایش نرخ کمیسیون پلتفرم، اصالت فرآورده‌ها و قراردادهای تأمین",
  },
  digital: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "اسناد علمی و لایسنس‌های دیجیتال"],
    title: "لایسنس‌های دیجیتال و حق دسترسی مونوگراف‌ها",
    description: "مدیریت سقف دانلود، توکن‌های یکبارمصرف و دسترسی فایل‌های مونوگراف علمی",
  },
  finance: {
    breadcrumb: ["خانه ERP", "امور مالی", "دفتر روزنامه و خروجی سپیدار"],
    title: "دفترکل مالی، اسناد دوبل‌اندر و خروجی استاندارد سپیدار",
    description: "ثبت غیرقابل تغییر اسناد حسابداری، بررسی تراز آزمایشی و مغایرت‌گیری بانکی",
  },
  ops: {
    breadcrumb: ["خانه ERP", "سلامت سیستم و عملیات", "صف خروج Outbox و Worker Leases"],
    title: "مرکز پایش سلامت زیرساخت، صف Outbox و اجاره‌نامه‌ها",
    description: "نظارت بر Dead-Letter Queue، لتینسی دیتابیس و قفل‌های توزیع‌شده ردیس",
  },
};

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord_101",
    orderNumber: "ORD-948210",
    customerName: "سارا محمدی",
    customerPhone: "09123456789",
    status: "PAID",
    totalAmountTomans: 950000,
    paymentMethod: "زرین‌پال (شاپرک)",
    // Demo timestamps are fixed: module-level Date.now() evaluates at different
    // times on the server and the client and breaks hydration.
    createdAt: "2026-11-02T13:45:00.000Z",
  },
  {
    id: "ord_102",
    orderNumber: "ORD-948211",
    customerName: "امیرحسین رضایی",
    customerPhone: "09351234567",
    status: "PROCESSING",
    totalAmountTomans: 1650000,
    paymentMethod: "کارت‌به‌کارت بانکی",
    createdAt: "2026-11-02T12:45:00.000Z",
  },
  {
    id: "ord_103",
    orderNumber: "ORD-948212",
    customerName: "مریم حسینی",
    customerPhone: "09197654321",
    status: "SHIPPED",
    totalAmountTomans: 450000,
    paymentMethod: "زرین‌پال (شاپرک)",
    createdAt: "2026-11-01T14:00:00.000Z",
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
    createdAt: "2026-11-02T13:45:00.000Z",
  },
  {
    id: "rcp_202",
    orderNumber: "ORD-948195",
    referenceNumber: "۷۷۲۱۰۵۴۹",
    payerCard: "۶۲۱۹-۸۶**-****-۱۲۳۴",
    amountTomans: 780000,
    status: "APPROVED",
    createdAt: "2026-11-01T18:00:00.000Z",
  },
];

export default function AdminDashboardPage() {
  const [session, setSession] = useState<{ token: string; user: AdminSessionUser } | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [userRole, setUserRole] = useState<AdminUserRole>("SUPER_ADMIN");
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [receipts, setReceipts] = useState<ReceiptItem[]>(INITIAL_RECEIPTS);

  // Restore the OTP session after hydration (localStorage is client-only).
  useEffect(() => {
    const existing = readAdminSession();
    setSession(existing);
    if (existing && (ADMIN_ROLES as readonly string[]).includes(existing.user.role)) {
      setUserRole(existing.user.role as AdminUserRole);
    }
    setSessionLoaded(true);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    setSession(null);
    setActiveTab("overview");
  };

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

  const canExportSepidar = userRole === "SUPER_ADMIN" || userRole === "ACCOUNTANT";

  const handleDownloadSepidarCsv = () => {
    if (!canExportSepidar) {
      alert("خطای دسترسی تفکیک وظایف (SoD): خروجی اسناد رسمی سپیدار صرفاً با دسترسی حسابدار یا مدیر ارشد مجاز است.");
      return;
    }
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

  // Wait for the localStorage session check before rendering (avoids a
  // post-hydration flash of the gate for logged-in operators).
  if (!sessionLoaded) {
    return <div style={{ minHeight: "100vh", background: "#F7F6F2" }} />;
  }

  if (!session) {
    return <AdminLoginGate onSession={setSession} />;
  }

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
          <label htmlFor="admin-role-select" style={{ fontSize: "0.75rem", color: "#c4d4cc", display: "block", marginBottom: "4px" }}>
            نقش عملیاتی فعال:
          </label>
          <select
            id="admin-role-select"
            aria-label="نقش عملیاتی فعال"
            className="admin-input"
            style={{ width: "100%", background: "#053733", color: "#fff", border: "1px solid #145e57", fontSize: "0.82rem", padding: "6px" }}
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as AdminUserRole)}
          >
            <option value="SUPER_ADMIN">مدیر ارشد (دسترسی سراسری)</option>
            <option value="OPERATOR">اپراتور فروش و ارسال</option>
            <option value="ACCOUNTANT">حسابدار مالی و انبار</option>
          </select>
          <button
            onClick={handleLogout}
            className="admin-btn"
            style={{
              width: "100%",
              marginTop: "8px",
              background: "transparent",
              color: "#9FD6CB",
              border: "1px solid #145e57",
              fontSize: "0.8rem",
              padding: "6px",
              cursor: "pointer",
            }}
            title={`خروج از نشست ${session?.user.phone ?? ""}`}
          >
            خروج از نشست ({session?.user.role === "SUPER_ADMIN" ? "مدیر ارشد" : session?.user.role === "OPERATOR" ? "اپراتور" : session?.user.role === "ACCOUNTANT" ? "حسابدار" : session?.user.role})
          </button>
        </div>

        <nav className="admin-nav" style={{ overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
          {/* 1. Sales Operations (عملیات فروش) */}
          <div className="nav-category-header">
            <span>عملیات فروش (Sales)</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].sales.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].sales.labelFa}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("overview")}
            className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
          >
            داشبورد و شاخص‌ها
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`nav-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            سفارشات و فیش‌ها
            {pendingReceiptCount > 0 && (
              <span className="badge-count">{pendingReceiptCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`nav-btn ${activeTab === "coupons" ? "active" : ""}`}
          >
            تخفیف و کوپن‌ها (API)
          </button>

          {/* 2. Catalog & Inventory (کاتالوگ و موجودی) */}
          <div className="nav-category-header">
            <span>کاتالوگ و موجودی</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].catalog.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].catalog.labelFa}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`nav-btn ${activeTab === "catalog" ? "active" : ""}`}
          >
            کاتالوگ و مدیریت PIM
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`nav-btn ${activeTab === "inventory" ? "active" : ""}`}
          >
            کنترل انبار و رزروها
            {lowStockCount > 0 && <span className="badge-alert">!</span>}
          </button>

          {/* 3. Clinical & Content (کلینیکال و محتوا) */}
          <div className="nav-category-header">
            <span>کلینیکال و محتوا</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].clinical.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].clinical.labelFa}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("clinical")}
            className={`nav-btn ${activeTab === "clinical" ? "active" : ""}`}
          >
            ادعاهای بالینی، INCI و مقالات
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`nav-btn ${activeTab === "cms" ? "active" : ""}`}
          >
            مدیریت ویترین و بخش‌ها (CMS)
          </button>

          {/* 4. B2B Commercial (همکاری تجاری و B2B) */}
          <div className="nav-category-header">
            <span>همکاری تجاری (B2B)</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].b2b.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].b2b.labelFa}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("b2b")}
            className={`nav-btn ${activeTab === "b2b" ? "active" : ""}`}
          >
            استعلام‌های عمده B2B
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`nav-btn ${activeTab === "subscriptions" ? "active" : ""}`}
          >
            اشتراک‌های دوره‌ای
          </button>
          <button
            onClick={() => setActiveTab("vendors")}
            className={`nav-btn ${activeTab === "vendors" ? "active" : ""}`}
          >
            فروشندگان مارکت‌پلیس
          </button>
          <button
            onClick={() => setActiveTab("digital")}
            className={`nav-btn ${activeTab === "digital" ? "active" : ""}`}
          >
            لایسنس‌های دیجیتال
          </button>

          {/* 5. Finance (امور مالی) */}
          <div className="nav-category-header">
            <span>امور مالی (Finance)</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].finance.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].finance.labelFa}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("finance")}
            className={`nav-btn ${activeTab === "finance" ? "active" : ""}`}
          >
            دفتر روزنامه و خروجی سپیدار
          </button>

          {/* 6. System Health & Ops (سلامت سیستم و عملیات) */}
          <div className="nav-category-header">
            <span>سلامت سیستم و عملیات</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].ops.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].ops.labelFa}
            </span>
          </div>
          <button
            onClick={() => setActiveTab("ops")}
            className={`nav-btn ${activeTab === "ops" ? "active" : ""}`}
          >
            صف Outbox و اجاره‌نامه‌ها
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "6px" }}>
              <span>{TAB_METADATA[activeTab].breadcrumb[0]}</span>
              <span>/</span>
              <span>{TAB_METADATA[activeTab].breadcrumb[1]}</span>
              <span>/</span>
              <span style={{ color: "var(--brand-deep)", fontWeight: 700 }}>{TAB_METADATA[activeTab].breadcrumb[2]}</span>
            </div>
            <h1>{TAB_METADATA[activeTab].title}</h1>
            <p>{TAB_METADATA[activeTab].description}</p>
          </div>
          <div className="topbar-actions">
            <button
              onClick={handleDownloadSepidarCsv}
              className="btn-sepidar-export"
              disabled={!canExportSepidar}
              title={!canExportSepidar ? "منحصر به حسابدار یا مدیر ارشد" : "دانلود خروجی رسمی سپیدار"}
              style={!canExportSepidar ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
            >
              دانلود خروجی استاندارد سپیدار
            </button>
            <div className="server-status-pill">
              <span className="pulse-dot"></span>
              پایگاه داده PostgreSQL 17 متصل
            </div>
          </div>
        </header>

        {/* Role Access / SoD Banners */}
        {activeTab === "finance" && userRole === "OPERATOR" && (
          <div className="role-notice-banner restricted">
            <span>
              <strong>حالت دسترسی محدود (View-Only):</strong> نقش شما اپراتور فروش و ارسال است. بر اساس اصل تفکیک وظایف (SoD)، اصلاح دفاتر، ثبت اسناد و استخراج خروجی سپیدار فقط توسط حسابدار ارشد یا مدیر سیستم مجاز است.
            </span>
            <span className="badge-alert">SoD PROTECTED</span>
          </div>
        )}

        {activeTab === "clinical" && userRole !== "SUPER_ADMIN" && (
          <div className="role-notice-banner warning">
            <span>
              <strong>شورای داوری پزشکی (Scientific Governance):</strong> تایید رسمی یا رد ادعاهای درمانی نیازمند صلاحیت ناظر بالینی / پزشک معتمد و نقش مدیر ارشد سیستم است.
            </span>
            <span className="status-pill in_review">نظارت پزشکی</span>
          </div>
        )}

        {activeTab === "ops" && userRole !== "SUPER_ADMIN" && (
          <div className="role-notice-banner warning">
            <span>
              <strong>پایش عملیاتی (Ops Telemetry):</strong> دسترسی ورکرها و اجاره‌نامه‌های توزیع‌شده ردیس در حالت پایش برخط قرار دارد. تغییر وضعیت ورکرها منحصر به مدیر سیستم است.
            </span>
            <span className="badge-live">LIVE TELEMETRY</span>
          </div>
        )}

        {/* Tab Modules */}
        {activeTab === "overview" && (
          <DashboardOverview
            orders={orders}
            pendingReceiptCount={pendingReceiptCount}
            lowStockCount={lowStockCount}
            userRole={userRole}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
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

        {activeTab === "cms" && (
          <StorefrontSectionsManager userRole={userRole} />
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
