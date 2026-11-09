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
import AdminLoginGate from "../components/AdminLoginGate";
import ApprovalsManager from "../components/ApprovalsManager";
import ExceptionCenterManager from "../components/ExceptionCenterManager";
import ClinicCustomer360Manager from "../components/ClinicCustomer360Manager";
import AdvancedFinancialReports from "../components/AdvancedFinancialReports";
import ReviewsCommentsManager from "../components/ReviewsCommentsManager";
import {
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Package,
  Warehouse,
  Stethoscope,
  Building2,
  Sparkles,
  Repeat,
  Store,
  KeyRound,
  FileSpreadsheet,
  BarChart3,
  AlertTriangle,
  Activity,
  LogOut,
  Shield,
  MessageSquare,
} from "lucide-react";
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
  | "approvals"
  | "exceptions"
  | "catalog"
  | "inventory"
  | "coupons"
  | "clinics360"
  | "b2b"
  | "clinical"
  | "finance"
  | "finance_reports"
  | "ops"
  | "subscriptions"
  | "vendors"
  | "digital"
  | "reviews";

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
  approvals: {
    breadcrumb: ["خانه ERP", "کنترل سازمانی", "مرکز تأیید و کنترل دوطرفه (Maker-Checker)"],
    title: "مرکز تأیید و کنترل‌های دوطرفه سازمانی (Maker-Checker Approval Desk)",
    description: "تأیید سفارشات سنگین، تغییر سقف اعتبار B2B، امحای ضایعات سردخانه و تفکیک وظایف (SoD)",
  },
  exceptions: {
    breadcrumb: ["خانه ERP", "سلامت و عملیات", "مرکز رسیدگی به استثناها و هشدارهای فوری"],
    title: "مرکز پایش استثناها و هشدارهای فوری کلینیکال و عملیات (Control Tower)",
    description: "پایش بلادرنگ زنجیره سرد ۲-۸ درجه، خطاهای درگاه پرداخت و کسری کارتریج استریل",
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
    description: "اعتبارسنجی آزمایشگاهی کارآزمایی‌های بالینی، کدینگ ترکیبات فرمولاسیون و آکادمی",
  },
  reviews: {
    breadcrumb: ["خانه ERP", "کلینیکال و محتوا", "نظرات و دیدگاه‌های خریداران"],
    title: "مدیریت نظرات، دیدگاه‌ها و رضایت‌سنجی خریداران",
    description: "پایش برخط دیدگاه‌های ارسالی از فروشگاه، تایید یا رد ادعاها و پاسخ کارشناسی درماتولوژی",
  },
  clinics360: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "پرونده ۳۶۰ درجه کلینیک‌ها و پزشکان"],
    title: "پرونده جامع ۳۶۰ درجه کلینیک‌ها، پزشکان و مراکز درمانی همکار",
    description: "استعلام پروانه نظام پزشکی، سقف اعتبار Net-30، گواهی اثر بور و استیشن‌های PlasmaX",
  },
  b2b: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "استعلام‌های عمده کلینیک‌ها (B2B)"],
    title: "پرتال تجاری استعلام خرید عمده و کلینیک‌های همکار",
    description: "بررسی پروانه‌های پزشکی، استعلام حجم فرمولاسیون و صدور پیش‌فاکتور رسمی B2B",
  },
  subscriptions: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "اشتراک‌های دوره‌ای و تکرارشونده"],
    title: "مدیریت اشتراک‌های درمانی و شارژ دوره‌ای",
    description: "پایش سیکل‌های اجرای خودکار، توقف موقت و تکرار سفارشات بیماران",
  },
  vendors: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "فروشندگان مارکت‌پلیس"],
    title: "مدیریت فروشندگان همکار و کلینیک‌های مارکت‌پلیس",
    description: "پایش نرخ کمیسیون پلتفرم، تعداد کالاها و اعتبارسنجی مجوزهای فروش",
  },
  digital: {
    breadcrumb: ["خانه ERP", "همکاری تجاری", "لایسنس‌ها و گرنت‌های دیجیتال"],
    title: "لایسنس‌های دیجیتال و حق دسترسی فایل‌ها",
    description: "مدیریت سقف دانلود، توکن‌های یکبارمصرف و ابطال دسترسی دوره‌های آموزشی",
  },
  finance: {
    breadcrumb: ["خانه ERP", "امور مالی", "دفتر روزنامه و خروجی سپیدار"],
    title: "دفترکل مالی، اسناد دوبل‌اندر و خروجی استاندارد سپیدار",
    description: "ثبت غیرقابل تغییر اسناد حسابداری، بررسی تراز آزمایشی و مغایرت‌گیری بانکی",
  },
  finance_reports: {
    breadcrumb: ["خانه ERP", "امور مالی", "تراز آزمایشی و سود و زیان خطوط محصول"],
    title: "گزارش‌های جامع مالی، تراز آزمایشی ۴ ستونی و تحلیل سود و زیان (P&L)",
    description: "پایش برابری بدهکار و بستانکار، حاشیه سود فرمولاسیون ReeSkin و ترازنامه",
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
    return <div style={{ minHeight: "100vh", background: "#f8fafc" }} />;
  }

  if (!session) {
    return <AdminLoginGate onSession={setSession} />;
  }

  return (
    <div className="admin-container">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div className="admin-brand">
          <div className="admin-logo-mark">DR</div>
          <div>
            <strong>Dr Dermer UK ERP</strong>
            <small>سیستم یکپارچه کلینیکال و بازرگانی</small>
          </div>
        </div>

        {/* Executive Role Switcher Capsule */}
        <div className="admin-role-capsule">
          <div className="admin-role-capsule-header">
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Shield size={13} style={{ color: "#274b24" }} />
              <span>نقش عملیاتی فعال</span>
            </span>
            <span
              style={{
                display: "inline-block",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: userRole === "SUPER_ADMIN" ? "#10b981" : userRole === "ACCOUNTANT" ? "#38bdf8" : "#f59e0b",
                boxShadow: `0 0 8px ${userRole === "SUPER_ADMIN" ? "#10b981" : userRole === "ACCOUNTANT" ? "#38bdf8" : "#f59e0b"}`,
              }}
              title="نشست فعال"
            />
          </div>
          <select
            id="admin-role-select"
            aria-label="نقش عملیاتی فعال"
            className="admin-role-select"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as AdminUserRole)}
          >
            <option value="SUPER_ADMIN">مدیر ارشد (دسترسی سراسری)</option>
            <option value="OPERATOR">اپراتور فروش و ارسال</option>
            <option value="ACCOUNTANT">حسابدار مالی و انبار</option>
          </select>
        </div>

        {/* Navigation Categories with Lucide Icons */}
        <nav className="admin-nav">
          {/* 1. Sales Operations */}
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
            <span className="nav-item-content">
              <LayoutDashboard size={17} className="nav-icon" />
              <span>داشبورد و شاخص‌ها</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`nav-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <ShoppingBag size={17} className="nav-icon" />
              <span>سفارشات و فیش‌ها</span>
            </span>
            {pendingReceiptCount > 0 && (
              <span className="badge-count">{pendingReceiptCount}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("approvals")}
            className={`nav-btn ${activeTab === "approvals" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <ShieldCheck size={17} className="nav-icon" />
              <span>مرکز تأیید (Maker-Checker)</span>
            </span>
            <span className="badge-count" style={{ background: "#e8f3ee", color: "#274b24", border: "1px solid #77B091" }}>۳</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`nav-btn ${activeTab === "coupons" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Tag size={17} className="nav-icon" />
              <span>تخفیف و کوپن‌ها (API)</span>
            </span>
          </button>

          {/* 2. Catalog & Inventory */}
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
            <span className="nav-item-content">
              <Package size={17} className="nav-icon" />
              <span>کاتالوگ و مدیریت PIM</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`nav-btn ${activeTab === "inventory" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Warehouse size={17} className="nav-icon" />
              <span>کنترل انبار و رزروها</span>
            </span>
            {lowStockCount > 0 && <span className="badge-alert">!</span>}
          </button>

          {/* 3. Clinical & Content */}
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
            <span className="nav-item-content">
              <Stethoscope size={17} className="nav-icon" />
              <span>ادعاهای بالینی، INCI و مقالات</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`nav-btn ${activeTab === "reviews" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <MessageSquare size={17} className="nav-icon" />
              <span>نظرات و دیدگاه‌های خریداران</span>
            </span>
          </button>

          {/* 4. B2B Commercial */}
          <div className="nav-category-header">
            <span>همکاری تجاری (B2B)</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].b2b.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].b2b.labelFa}
            </span>
          </div>

          <button
            onClick={() => setActiveTab("clinics360")}
            className={`nav-btn ${activeTab === "clinics360" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Building2 size={17} className="nav-icon" />
              <span>پرونده ۳۶۰ درجه کلینیک‌ها</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("b2b")}
            className={`nav-btn ${activeTab === "b2b" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Sparkles size={17} className="nav-icon" />
              <span>استعلام‌های عمده B2B</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`nav-btn ${activeTab === "subscriptions" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Repeat size={17} className="nav-icon" />
              <span>اشتراک‌های دوره‌ای</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("vendors")}
            className={`nav-btn ${activeTab === "vendors" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Store size={17} className="nav-icon" />
              <span>فروشندگان مارکت‌پلیس</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("digital")}
            className={`nav-btn ${activeTab === "digital" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <KeyRound size={17} className="nav-icon" />
              <span>لایسنس‌های دیجیتال</span>
            </span>
          </button>

          {/* 5. Finance */}
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
            <span className="nav-item-content">
              <FileSpreadsheet size={17} className="nav-icon" />
              <span>دفتر روزنامه و خروجی سپیدار</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("finance_reports")}
            className={`nav-btn ${activeTab === "finance_reports" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <BarChart3 size={17} className="nav-icon" />
              <span>تراز آزمایشی و P&L</span>
            </span>
          </button>

          {/* 6. System Health & Ops */}
          <div className="nav-category-header">
            <span>سلامت سیستم و عملیات</span>
            <span className={`domain-access-badge access-${DOMAIN_ACCESS_CONFIG[userRole].ops.access.toLowerCase()}`}>
              {DOMAIN_ACCESS_CONFIG[userRole].ops.labelFa}
            </span>
          </div>

          <button
            onClick={() => setActiveTab("exceptions")}
            className={`nav-btn ${activeTab === "exceptions" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <AlertTriangle size={17} className="nav-icon" />
              <span>مرکز استثناها (Control Tower)</span>
            </span>
            <span className="badge-alert">!</span>
          </button>

          <button
            onClick={() => setActiveTab("ops")}
            className={`nav-btn ${activeTab === "ops" ? "active" : ""}`}
          >
            <span className="nav-item-content">
              <Activity size={17} className="nav-icon" />
              <span>صف Outbox و اجاره‌نامه‌ها</span>
            </span>
          </button>
        </nav>

        {/* Floating User Profile Card & Seamless Logout */}
        <div className="admin-user-profile">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
            <div className="user-avatar">{userRole.slice(0, 2)}</div>
            <div className="user-info">
              <strong>
                {userRole === "SUPER_ADMIN"
                  ? "مدیر ارشد سیستم"
                  : userRole === "ACCOUNTANT"
                  ? "حسابدار ارشد"
                  : "اپراتور سفارشات"}
              </strong>
              <small>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 6px #10b981",
                    display: "inline-block",
                  }}
                />
                <span>احراز هویت شده</span>
              </small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="logout-icon-btn"
            title={`خروج از نشست (${session?.user.phone ?? ""})`}
            aria-label="خروج از نشست"
          >
            <LogOut size={16} />
          </button>
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

        {activeTab === "approvals" && (
          <ApprovalsManager
            userRole={userRole}
            currentUserId={session?.user.id || "usr_admin_master"}
          />
        )}

        {activeTab === "exceptions" && (
          <ExceptionCenterManager userRole={userRole} />
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

        {activeTab === "clinics360" && (
          <ClinicCustomer360Manager userRole={userRole} />
        )}

        {activeTab === "b2b" && (
          <B2BQuotesManager userRole={userRole} />
        )}

        {activeTab === "clinical" && (
          <ClinicalContentManager userRole={userRole} />
        )}

        {activeTab === "reviews" && (
          <ReviewsCommentsManager userRole={userRole} />
        )}

        {activeTab === "finance" && (
          <FinanceLedgerView orders={orders} userRole={userRole} />
        )}

        {activeTab === "finance_reports" && (
          <AdvancedFinancialReports userRole={userRole} />
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
