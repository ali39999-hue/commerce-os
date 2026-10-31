"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { formatJalaliDate, formatJalaliDateTime } from "@commerce-os/localization";
import { CHART_OF_ACCOUNTS, buildSepidarCsv } from "@commerce-os/finance";

interface DemoOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: "PAID" | "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  totalAmountTomans: number;
  paymentMethod: string;
  createdAt: string;
}

interface DemoReceipt {
  id: string;
  orderNumber: string;
  referenceNumber: string;
  payerCard: string;
  amountTomans: number;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface DemoInventoryItem {
  sku: string;
  title: string;
  onHand: number;
  reserved: number;
  available: number;
}

interface DemoAuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

/* ── Analytics API (GET /v1/analytics/summary?days=7) — all fields optional, render defensively ── */
interface AnalyticsDayRow {
  day?: string;
  product_viewed?: number;
  search_submitted?: number;
  add_to_cart?: number;
  checkout_started?: number;
  order_confirmed?: number;
}

interface AnalyticsFunnelStage {
  stage?: string;
  count?: number;
  conversionToNextPct?: number;
}

interface AnalyticsSummary {
  dbAvailable?: boolean;
  days?: number;
  totalEvents?: number;
  byName?: Record<string, number>;
  byDay?: AnalyticsDayRow[];
  funnel?: AnalyticsFunnelStage[];
}

/* ── Ops exceptions API (GET /v1/ops/exceptions) — heterogeneous items per block ── */
interface ExceptionItem {
  [field: string]: unknown;
}

interface ExceptionBlock {
  key?: string;
  titleFa?: string;
  count?: number;
  items?: ExceptionItem[];
}

interface ExceptionsResponse {
  dbAvailable?: boolean;
  blocks?: ExceptionBlock[];
}

/* ── Coupons (demo state, local to the admin) ── */
interface DemoCoupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountTomans: number | null;
  minPurchaseTomans: number;
  usedCount: number;
  usageLimit: number;
  expiresAt: string;
  active: boolean;
}

interface CouponFormState {
  code: string;
  type: "PERCENT" | "FIXED";
  value: string;
  maxDiscount: string;
  minPurchase: string;
  usageLimit: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const ANALYTICS_KPIS: { key: string; fa: string }[] = [
  { key: "product_viewed", fa: "مشاهده محصول" },
  { key: "search_submitted", fa: "جست‌وجو" },
  { key: "add_to_cart", fa: "افزودن به سبد" },
  { key: "checkout_started", fa: "شروع پرداخت" },
  { key: "order_confirmed", fa: "سفارش قطعی" },
];

const FUNNEL_STAGE_FA: Record<string, string> = {
  product_viewed: "مشاهده محصول",
  search_submitted: "جست‌وجو",
  add_to_cart: "افزودن به سبد",
  checkout_started: "شروع پرداخت",
  order_confirmed: "سفارش قطعی",
};

const EXCEPTION_BLOCK_META: Record<string, { fa: string; columns: string[] }> = {
  outbox_dead_letter: { fa: "صندوق خروج — رویدادهای مردود (Dead Letter)", columns: ["رویداد", "تعداد تلاش", "تاریخ"] },
  payment_unknown: { fa: "پرداخت‌های با وضعیت نامشخص", columns: ["روش", "وضعیت", "مبلغ"] },
  stuck_reservations: { fa: "رزروهای انبار گیرکرده", columns: ["انقضا"] },
  c2c_pending: { fa: "فیش‌های کارت‌به‌کارت در انتظار بررسی", columns: ["شماره پیگیری", "تاریخ"] },
  webhook_failures: { fa: "شکست‌های ارسال وبهوک", columns: ["آدرس", "تلاش‌ها"] },
};

const EXCEPTION_BLOCK_ORDER = [
  "outbox_dead_letter",
  "payment_unknown",
  "stuck_reservations",
  "c2c_pending",
  "webhook_failures",
];

const EMPTY_COUPON_FORM: CouponFormState = {
  code: "",
  type: "PERCENT",
  value: "",
  maxDiscount: "",
  minPurchase: "",
  usageLimit: "",
};

/* ── Subscriptions API (GET /v1/subscriptions/admin, header x-tenant-id) — optional-chained ── */
interface AdminSubPlan {
  titleFa?: string;
  intervalDays?: number;
  priceRials?: string | number;
}

interface AdminSubscription {
  id?: string;
  status?: "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
  quantity?: number;
  phone?: string;
  nextRunAt?: string;
  cyclesRun?: number;
  plan?: AdminSubPlan;
}

interface SubscriptionsResponse {
  items?: AdminSubscription[];
  dbAvailable?: boolean;
}

/* ── B2B quote-requests API (GET /v1/b2b/quote-requests?status=) — optional-chained ── */
type B2bQuoteStatus = "NEW" | "IN_REVIEW" | "QUOTED" | "CLOSED";

interface B2bQuoteRequest {
  id?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  itemsSummary?: string;
  desiredQty?: number;
  status?: B2bQuoteStatus;
  createdAt?: string;
}

interface B2bQuoteResponse {
  items?: B2bQuoteRequest[];
  dbAvailable?: boolean;
}

type B2bFilter = "ALL" | B2bQuoteStatus;

const TENANT_HEADERS: Record<string, string> = {
  "x-tenant-id": "00000000-0000-0000-0000-000000000000",
};

const SUBS_STATUS_PILL: Record<string, { cls: string; fa: string }> = {
  ACTIVE: { cls: "active", fa: "فعال" },
  PAUSED: { cls: "paused", fa: "موقتاً متوقف" },
  CANCELLED: { cls: "cancelled", fa: "لغوشده" },
  EXPIRED: { cls: "expired", fa: "منقضی" },
};

const B2B_STATUS_PILL: Record<string, { cls: string; fa: string }> = {
  NEW: { cls: "b2b-new", fa: "جدید" },
  IN_REVIEW: { cls: "b2b-inreview", fa: "در بررسی" },
  QUOTED: { cls: "b2b-quoted", fa: "پیش‌فاکتور شده" },
  CLOSED: { cls: "b2b-closed", fa: "بسته" },
};

const B2B_FILTERS: { value: B2bFilter; fa: string }[] = [
  { value: "ALL", fa: "همه" },
  { value: "NEW", fa: "جدید" },
  { value: "IN_REVIEW", fa: "در بررسی" },
  { value: "QUOTED", fa: "پیش‌فاکتور شده" },
  { value: "CLOSED", fa: "بسته" },
];

/* Forward-only transitions: NEW → IN_REVIEW → QUOTED → CLOSED */
const B2B_TRANSITIONS: Record<string, { next: B2bQuoteStatus; label: string }> = {
  NEW: { next: "IN_REVIEW", label: "بررسی" },
  IN_REVIEW: { next: "QUOTED", label: "صدور پیش‌فاکتور" },
  QUOTED: { next: "CLOSED", label: "بستن" },
};

/* Demo fallbacks (shown with the Persian fallback note when the API is unreachable / dbAvailable=false) */
const buildDemoSubscriptions = (): AdminSubscription[] => [
  {
    id: "sub_demo_1",
    status: "ACTIVE",
    quantity: 2,
    phone: "09121234567",
    nextRunAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    cyclesRun: 6,
    plan: { titleFa: "اشتراک ماهانه قهوه اتیوپی", intervalDays: 30, priceRials: "4900000" },
  },
  {
    id: "sub_demo_2",
    status: "ACTIVE",
    quantity: 1,
    phone: "09351112233",
    nextRunAt: new Date(Date.now() + 10 * 86400000).toISOString(),
    cyclesRun: 12,
    plan: { titleFa: "اشتراک دوهفته‌ای فیلتر کاغذی", intervalDays: 14, priceRials: "980000" },
  },
  {
    id: "sub_demo_3",
    status: "PAUSED",
    quantity: 1,
    phone: "09198887766",
    nextRunAt: new Date(Date.now() + 21 * 86400000).toISOString(),
    cyclesRun: 3,
    plan: { titleFa: "اشتراک ماهانه ترکیب پرفروش", intervalDays: 30, priceRials: "3500000" },
  },
  {
    id: "sub_demo_4",
    status: "CANCELLED",
    quantity: 1,
    phone: "09365554433",
    nextRunAt: "",
    cyclesRun: 1,
    plan: { titleFa: "اشتراک ماهانه ماگ سرامیکی", intervalDays: 30, priceRials: "1200000" },
  },
  {
    id: "sub_demo_5",
    status: "EXPIRED",
    quantity: 3,
    phone: "09211112244",
    nextRunAt: "",
    cyclesRun: 9,
    plan: { titleFa: "اشتراک سه‌ماهه هدیه سازمانی", intervalDays: 90, priceRials: "8500000" },
  },
];

const buildDemoB2b = (): B2bQuoteRequest[] => [
  {
    id: "b2b_demo_1",
    companyName: "شرکت پخش زرین کالا",
    contactName: "رضا کریمی",
    phone: "02188776655",
    email: "karimi@zarrin.example",
    itemsSummary:
      "۲۰۰ بسته قهوه اتیوپی ۲۵۰ گرمی به‌همراه ۵۰ عدد ماگ سرامیکی لوکس با بسته‌بندی سازمانی و چاپ اختصاصی لوگو",
    desiredQty: 250,
    status: "NEW",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "b2b_demo_2",
    companyName: "کافه‌های شهرام (زنجیره‌ای)",
    contactName: "مریم نادری",
    phone: "09122223344",
    itemsSummary: "قرارداد ماهانه ۱۰۰ کیلوگرم دانه اسپرسو بلند به‌همراه فیلتر کاغذی مخروطی",
    desiredQty: 100,
    status: "IN_REVIEW",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
  {
    id: "b2b_demo_3",
    companyName: "هلدینگ بازرگانی آریا",
    contactName: "حسین صادقی",
    phone: "02177889900",
    email: "sadeqi@aria.example",
    itemsSummary:
      "پک هدیه سالانه ۵۰۰ عددی شامل قهوه تخصصی، ماگ سرامیکی و دریپر V60 در جعبه اختصاصی شرکتی",
    desiredQty: 500,
    status: "QUOTED",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "b2b_demo_4",
    companyName: "فروشگاه آنلاین دمی",
    contactName: "تیم خرید",
    phone: "09359998877",
    itemsSummary: "۵۰ بسته فیلتر کاغذی مخروطی ۱۰۰ عددی",
    desiredQty: 50,
    status: "CLOSED",
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

/* POST with the tenant header + 4s timeout; extracts the API's Persian error message on failure */
const postTenantJson = async (
  path: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; message: string }> => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TENANT_HEADERS },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) {
      let message = "";
      try {
        const data = (await res.json()) as { error?: unknown; message?: unknown; messageFa?: unknown };
        if (typeof data?.error === "string") message = data.error;
        else if (typeof data?.message === "string") message = data.message;
        else if (typeof data?.messageFa === "string") message = data.messageFa;
      } catch {
        /* non-JSON error body */
      }
      if (!message) message = `درخواست با کد ${res.status} رد شد.`;
      return { ok: false, message };
    }
    return { ok: true, message: "" };
  } catch {
    return { ok: false, message: "اتصال به سرور برقرار نشد. لطفاً پس از بررسی شبکه دوباره تلاش کنید." };
  }
};

/* Long Persian strings (itemsSummary) truncate in the table; the full text appears in the expanded row */
const truncateFa = (value: unknown, max = 60): string => {
  const raw = str(value);
  if (raw === "—") return raw;
  return raw.length > max ? `${raw.slice(0, max)}…` : raw;
};

/* ── Resilient formatting helpers (never assume an API field exists) ── */
const faNumber = (value: number | null | undefined): string => {
  const n = Number(value);
  return new Intl.NumberFormat("fa-IR").format(Number.isFinite(n) ? n : 0);
};

const str = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "—";
  }
};

const tryJalali = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  const raw = String(value);
  try {
    const formatted = formatJalaliDateTime(raw) || formatJalaliDate(raw);
    if (formatted) return formatted;
  } catch {
    /* fall back to the raw value below */
  }
  return raw;
};

/* Amount arrives as a Rial (IRR) string — convert to Tomans with BigInt, format fa-IR */
const formatRialAsTomans = (value: unknown): string => {
  const digits = String(value ?? "").replace(/[^\d-]/g, "");
  if (!digits || digits === "-") return "—";
  try {
    const tomans = BigInt(digits) / 10n;
    return `${new Intl.NumberFormat("fa-IR").format(tomans)} تومان`;
  } catch {
    return "—";
  }
};

const formatDayLabel = (value: unknown): string => {
  const raw = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw || "—";
  try {
    const d = new Date(`${raw.slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return raw;
    return formatJalaliDate(d.toISOString());
  } catch {
    return raw;
  }
};

/* Zeroed summary used when the API is unreachable or dbAvailable === false */
const buildZeroAnalytics = (): AnalyticsSummary => {
  const byDay: AnalyticsDayRow[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    byDay.push({
      day: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
      product_viewed: 0,
      search_submitted: 0,
      add_to_cart: 0,
      checkout_started: 0,
      order_confirmed: 0,
    });
  }
  return {
    dbAvailable: false,
    days: 7,
    totalEvents: 0,
    byName: {},
    byDay,
    funnel: Object.keys(FUNNEL_STAGE_FA).map((stage) => ({
      stage,
      count: 0,
      conversionToNextPct: 0,
    })),
  };
};

const buildZeroExceptions = (): ExceptionsResponse => ({
  dbAvailable: false,
  blocks: EXCEPTION_BLOCK_ORDER.map((key) => ({
    key,
    titleFa: EXCEPTION_BLOCK_META[key].fa,
    count: 0,
    items: [],
  })),
});

const exceptionCells = (blockKey: string, item: ExceptionItem): string[] => {
  switch (blockKey) {
    case "outbox_dead_letter":
      return [
        str(item.eventName ?? item.event ?? item.type ?? item.topic),
        str(item.attemptCount ?? item.attempts ?? item.retryCount),
        tryJalali(item.createdAt ?? item.failedAt ?? item.lastAttemptAt),
      ];
    case "payment_unknown":
      return [
        str(item.method ?? item.paymentMethod ?? item.gateway ?? item.provider),
        str(item.status ?? item.paymentStatus),
        formatRialAsTomans(item.amount ?? item.amountRials ?? item.amountRial ?? item.amountIrr),
      ];
    case "stuck_reservations":
      return [tryJalali(item.expiresAt ?? item.expiredAt ?? item.expires_at ?? item.expiry)];
    case "c2c_pending":
      return [
        str(item.referenceNumber ?? item.reference ?? item.trackingNumber),
        tryJalali(item.createdAt ?? item.submittedAt ?? item.uploadedAt),
      ];
    case "webhook_failures":
      return [
        str(item.url ?? item.endpoint ?? item.targetUrl ?? item.address),
        str(item.attempts ?? item.attemptCount ?? item.retryCount),
      ];
    default:
      return [str(item)];
  }
};

/* ── Vendors API (GET /v1/vendors?storeSlug=demo, POST /v1/vendors) — optional-chained ── */
interface VendorItem {
  id?: string;
  slug?: string;
  titleFa?: string;
  description?: string;
  logoColor?: string;
  productCount?: number;
  commissionBps?: number;
}

interface VendorsResponse {
  source?: "DB" | "FALLBACK";
  items?: VendorItem[];
}

interface VendorFormState {
  slug: string;
  titleFa: string;
  description: string;
  logoColor: string;
  commissionPct: string;
}

const EMPTY_VENDOR_FORM: VendorFormState = {
  slug: "",
  titleFa: "",
  description: "",
  logoColor: "#0B6E66",
  commissionPct: "",
};

/* ── Digital grants API (GET /v1/digital/grants?phone=, POST .../revoke) — optional-chained ── */
interface DigitalGrant {
  id?: string;
  token?: string;
  productTitle?: string;
  phone?: string;
  downloadCount?: number;
  maxDownloads?: number;
  expiresAt?: string;
  revokedAt?: string | null;
}

interface DigitalGrantsResponse {
  items?: DigitalGrant[];
  dbAvailable?: boolean;
}

/* Demo fallbacks (shown with the Persian fallback note when the API is unreachable) */
const buildDemoVendors = (): VendorItem[] => [
  {
    id: "vnd_demo_1",
    slug: "roasting-lab",
    titleFa: "کارگاه رست لَب",
    description: "رست تخصصی دانه‌های قهوه اتیوپی و کنیا",
    logoColor: "#0B6E66",
    productCount: 24,
    commissionBps: 800,
  },
  {
    id: "vnd_demo_2",
    slug: "ceramic-studio",
    titleFa: "استودیو سرامیک سفیر",
    description: "ماگ و پارچ سرامیکی دست‌ساز",
    logoColor: "#F2A33A",
    productCount: 12,
    commissionBps: 1000,
  },
];

const buildDemoGrants = (): DigitalGrant[] => [
  {
    id: "grt_demo_1",
    token: "LIC-A7F3K9QW2M4X8ZT",
    productTitle: "دوره ویدیویی جامع رستینگ قهوه",
    phone: "09121234567",
    downloadCount: 2,
    maxDownloads: 5,
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  },
  {
    id: "grt_demo_2",
    token: "LIC-Z4X2C8V6B1N3M5Q7",
    productTitle: "کتاب الکترونیکی اصول اسپرسو",
    phone: "09351112233",
    downloadCount: 5,
    maxDownloads: 5,
    expiresAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    revokedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/* Vendor logo colour: only a strict 6-digit hex is accepted, otherwise the brand colour */
const sanitizeHexColor = (value: unknown): string => {
  const raw = String(value ?? "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : "#0B6E66";
};

/* commissionBps (basis points) → percent with fa-IR digits (800 → ۸٪) */
const formatBpsAsPercent = (value: unknown): string => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${faNumber(n / 100)}٪`;
};

/* Token preview: first 12 characters + ellipsis (full token never rendered in the table) */
const grantTokenPreview = (value: unknown): string => {
  const raw = str(value);
  if (raw === "—") return raw;
  return raw.length > 12 ? `${raw.slice(0, 12)}…` : raw;
};

/* Grant status precedence: revoked (red) → expired (grey) → active (green) */
const grantStatusPill = (g: DigitalGrant): { cls: string; fa: string } => {
  const revokedAt = typeof g?.revokedAt === "string" ? g.revokedAt : "";
  if (revokedAt) return { cls: "digital-revoked", fa: "باطل‌شده" };
  const expiresAt = typeof g?.expiresAt === "string" ? g.expiresAt : "";
  if (expiresAt) {
    const t = new Date(expiresAt).getTime();
    if (Number.isFinite(t) && t < Date.now()) return { cls: "digital-expired", fa: "منقضی" };
  }
  return { cls: "digital-active", fa: "فعال" };
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "receipts" | "inventory" | "ledger" | "audit" | "analytics" | "exceptions" | "coupons" | "subscriptions" | "b2b" | "vendors" | "digital"
  >("overview");

  // Sample operational state
  const [orders, setOrders] = useState<DemoOrder[]>([
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
  ]);

  const [receipts, setReceipts] = useState<DemoReceipt[]>([
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
  ]);

  const [inventory, setInventory] = useState<DemoInventoryItem[]>([
    { sku: "COF-ETH-250", title: "قهوه تخصصی اتیوپی ۲۵۰ گرمی", onHand: 45, reserved: 3, available: 42 },
    { sku: "MUG-CER-01", title: "ماگ سرامیکی دست‌ساز", onHand: 18, reserved: 2, available: 16 },
    { sku: "DRP-V60-02", title: "دریپر قهوه سرامیکی V60", onHand: 8, reserved: 4, available: 4 },
    { sku: "FLT-WHT-100", title: "فیلتر کاغذی مخروطی ۱۰۰ عددی", onHand: 120, reserved: 0, available: 120 },
  ]);

  const [auditLogs] = useState<DemoAuditLog[]>([
    { id: "aud_1", actor: "admin@commerce-os.local", action: "APPROVE_PAYMENT_RECEIPT", target: "rcp_202", ip: "192.168.1.10", timestamp: new Date(Date.now() - 1800 * 1000).toISOString() },
    { id: "aud_2", actor: "system_worker", action: "OUTBOX_EVENT_DISPATCHED", target: "ORDER_PAID:ord_101", ip: "127.0.0.1", timestamp: new Date(Date.now() - 3500 * 1000).toISOString() },
    { id: "aud_3", actor: "operator@commerce-os.local", action: "ORDER_STATUS_CHANGED", target: "ord_103:SHIPPED", ip: "192.168.1.15", timestamp: new Date(Date.now() - 7000 * 1000).toISOString() },
    { id: "aud_4", actor: "admin@commerce-os.local", action: "INVENTORY_RESTOCK", target: "SKU:COF-ETH-250", ip: "192.168.1.10", timestamp: new Date(Date.now() - 14000 * 1000).toISOString() },
  ]);

  const handleApproveReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" as const } : r))
    );
    alert("✓ فیش بانکی با موفقیت تایید شد. سند حسابداری دوبل‌اندر در دفترکل ثبت گردید.");
  };

  const handleRejectReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" as const } : r))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: DemoOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddStock = (sku: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.sku === sku
          ? { ...item, onHand: item.onHand + 10, available: item.available + 10 }
          : item
      )
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

  /* ── Analytics tab: live fetch with 4s timeout, zeroed fallback ── */
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsFailed, setAnalyticsFailed] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/analytics/summary?days=7`, {
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AnalyticsSummary;
      if (data?.dbAvailable === false) {
        setAnalytics(buildZeroAnalytics());
        setAnalyticsFailed(true);
      } else {
        setAnalytics(data);
        setAnalyticsFailed(false);
      }
    } catch {
      setAnalytics(buildZeroAnalytics());
      setAnalyticsFailed(true);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  /* ── Exceptions tab: live fetch, zeroed fallback, manual re-inspection ── */
  const [exceptions, setExceptions] = useState<ExceptionsResponse | null>(null);
  const [exceptionsLoading, setExceptionsLoading] = useState(false);
  const [exceptionsFailed, setExceptionsFailed] = useState(false);

  const loadExceptions = useCallback(async () => {
    setExceptionsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/ops/exceptions`, {
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ExceptionsResponse;
      if (data?.dbAvailable === false) {
        setExceptions(buildZeroExceptions());
        setExceptionsFailed(true);
      } else {
        setExceptions(data);
        setExceptionsFailed(false);
      }
    } catch {
      setExceptions(buildZeroExceptions());
      setExceptionsFailed(true);
    } finally {
      setExceptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
    void loadExceptions();
  }, [loadAnalytics, loadExceptions]);

  /* ── Coupons tab: local demo state ── */
  const [coupons, setCoupons] = useState<DemoCoupon[]>([
    {
      id: "cpn_1",
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      maxDiscountTomans: 500000,
      minPurchaseTomans: 0,
      usedCount: 14,
      usageLimit: 500,
      expiresAt: new Date(Date.now() + 21 * 86400000).toISOString(),
      active: true,
    },
    {
      id: "cpn_2",
      code: "OFF50",
      type: "FIXED",
      value: 50000,
      maxDiscountTomans: null,
      minPurchaseTomans: 2000000,
      usedCount: 3,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 45 * 86400000).toISOString(),
      active: true,
    },
  ]);
  const [couponForm, setCouponForm] = useState<CouponFormState>(EMPTY_COUPON_FORM);
  const [couponErrors, setCouponErrors] = useState<string[]>([]);
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const handleCreateCoupon = () => {
    const errors: string[] = [];
    const code = couponForm.code.trim().toUpperCase();
    if (!code) {
      errors.push("وارد کردن کد کوپن الزامی است.");
    } else if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
      errors.push("کد کوپن باید بین ۳ تا ۲۴ نویسه لاتین، رقم یا خط تیره باشد.");
    } else if (coupons.some((c) => c.code.toUpperCase() === code)) {
      errors.push("این کد کوپن قبلاً ثبت شده است.");
    }

    const value = Number(couponForm.value);
    if (!couponForm.value.trim() || !Number.isFinite(value) || value <= 0) {
      errors.push("مقدار تخفیف باید عددی بزرگ‌تر از صفر باشد.");
    } else if (couponForm.type === "PERCENT" && value > 100) {
      errors.push("درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد.");
    }

    if (couponForm.type === "PERCENT") {
      const maxDiscount = Number(couponForm.maxDiscount);
      if (!couponForm.maxDiscount.trim() || !Number.isFinite(maxDiscount) || maxDiscount <= 0) {
        errors.push("برای تخفیف درصدی، تعیین سقف مبلغ (تومان) الزامی است.");
      }
    }

    if (couponForm.minPurchase.trim()) {
      const minPurchase = Number(couponForm.minPurchase);
      if (!Number.isFinite(minPurchase) || minPurchase < 0) {
        errors.push("حداقل خرید باید عددی نامنفی باشد.");
      }
    }

    if (couponForm.usageLimit.trim()) {
      const usageLimit = Number(couponForm.usageLimit);
      if (!Number.isInteger(usageLimit) || usageLimit < 1) {
        errors.push("محدودیت تعداد استفاده باید عدد صحیح حداقل ۱ باشد.");
      }
    }

    if (errors.length > 0) {
      setCouponErrors(errors);
      setCouponSuccess("");
      return;
    }

    const newCoupon: DemoCoupon = {
      id: `cpn_${Date.now()}`,
      code,
      type: couponForm.type,
      value: Math.round(value),
      maxDiscountTomans:
        couponForm.type === "PERCENT" ? Math.max(0, Math.round(Number(couponForm.maxDiscount))) : null,
      minPurchaseTomans: couponForm.minPurchase.trim()
        ? Math.max(0, Math.round(Number(couponForm.minPurchase)))
        : 0,
      usedCount: 0,
      usageLimit: couponForm.usageLimit.trim() ? Math.round(Number(couponForm.usageLimit)) : 0,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      active: true,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setCouponForm(EMPTY_COUPON_FORM);
    setCouponErrors([]);
    setCouponSuccess(`کوپن «${newCoupon.code}» با موفقیت ایجاد و فعال شد.`);
  };

  /* ── Subscriptions tab: live fetch (4s timeout + x-tenant-id) with demo fallback ── */
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[] | null>(null);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [subscriptionsFailed, setSubscriptionsFailed] = useState(false);
  const [subsActionBusyId, setSubsActionBusyId] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    setSubscriptionsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/subscriptions/admin`, {
        headers: TENANT_HEADERS,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SubscriptionsResponse;
      if (data?.dbAvailable === false) {
        setSubscriptions(buildDemoSubscriptions());
        setSubscriptionsFailed(true);
      } else {
        setSubscriptions(Array.isArray(data?.items) ? data.items : []);
        setSubscriptionsFailed(false);
      }
    } catch {
      setSubscriptions(buildDemoSubscriptions());
      setSubscriptionsFailed(true);
    } finally {
      setSubscriptionsLoading(false);
    }
  }, []);

  /* pause | resume | cancel → POST then re-fetch; Persian alert with the API error on failure */
  const handleSubscriptionAction = async (id: string, action: "pause" | "resume" | "cancel") => {
    if (action === "cancel") {
      const confirmed = window.confirm(
        "آیا از لغو این اشتراک دوره‌ای مطمئن هستید؟ پس از لغو، تکرار خودکار سفارش‌ها متوقف خواهد شد."
      );
      if (!confirmed) return;
    }
    setSubsActionBusyId(id);
    const result = await postTenantJson(
      `/v1/subscriptions/${encodeURIComponent(id)}/${action}`,
      action === "cancel" ? { reason: "لغو اشتراک از پنل مدیریت" } : {}
    );
    if (!result.ok) {
      alert(`✕ عملیات روی اشتراک انجام نشد: ${result.message}`);
    } else {
      await loadSubscriptions();
    }
    setSubsActionBusyId(null);
  };

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  /* ── B2B tab: live fetch (?status= filter) with demo fallback + expandable rows ── */
  const [b2bQuotes, setB2bQuotes] = useState<B2bQuoteRequest[] | null>(null);
  const [b2bLoading, setB2bLoading] = useState(false);
  const [b2bFailed, setB2bFailed] = useState(false);
  const [b2bFilter, setB2bFilter] = useState<B2bFilter>("ALL");
  const [b2bExpandedId, setB2bExpandedId] = useState<string | null>(null);
  const [b2bNotes, setB2bNotes] = useState<Record<string, string>>({});
  const [b2bBusyId, setB2bBusyId] = useState<string | null>(null);

  const loadB2b = useCallback(async (filter: B2bFilter) => {
    setB2bLoading(true);
    try {
      const query = filter === "ALL" ? "" : `?status=${encodeURIComponent(filter)}`;
      const res = await fetch(`${API_BASE}/v1/b2b/quote-requests${query}`, {
        headers: TENANT_HEADERS,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as B2bQuoteResponse;
      if (data?.dbAvailable === false) {
        setB2bQuotes(buildDemoB2b());
        setB2bFailed(true);
      } else {
        setB2bQuotes(Array.isArray(data?.items) ? data.items : []);
        setB2bFailed(false);
      }
    } catch {
      setB2bQuotes(buildDemoB2b());
      setB2bFailed(true);
    } finally {
      setB2bLoading(false);
    }
  }, []);

  /* Forward-only transition; the expanded row's adminNote (if filled) travels with it */
  const handleB2bTransition = async (id: string, nextStatus: B2bQuoteStatus) => {
    setB2bBusyId(id);
    const note = (b2bNotes[id] ?? "").trim();
    const result = await postTenantJson(
      `/v1/b2b/quote-requests/${encodeURIComponent(id)}/status`,
      note ? { status: nextStatus, adminNote: note } : { status: nextStatus }
    );
    if (!result.ok) {
      alert(`✕ تغییر وضعیت استعلام انجام نشد: ${result.message}`);
    } else {
      setB2bExpandedId(null);
      setB2bNotes((prev) => {
        const nextNotes = { ...prev };
        delete nextNotes[id];
        return nextNotes;
      });
      await loadB2b(b2bFilter);
    }
    setB2bBusyId(null);
  };

  useEffect(() => {
    void loadB2b(b2bFilter);
  }, [loadB2b, b2bFilter]);

  /* ── Vendors tab: live fetch (?storeSlug=demo) with demo fallback + inline create form ── */
  const [vendors, setVendors] = useState<VendorItem[] | null>(null);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsFailed, setVendorsFailed] = useState(false);
  const [vendorForm, setVendorForm] = useState<VendorFormState>(EMPTY_VENDOR_FORM);
  const [vendorErrors, setVendorErrors] = useState<string[]>([]);
  const [vendorSuccess, setVendorSuccess] = useState("");
  const [vendorSubmitting, setVendorSubmitting] = useState(false);

  const loadVendors = useCallback(async () => {
    setVendorsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/vendors?storeSlug=demo`, {
        headers: TENANT_HEADERS,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as VendorsResponse;
      if (data?.source === "FALLBACK") {
        setVendors(buildDemoVendors());
        setVendorsFailed(true);
      } else {
        setVendors(Array.isArray(data?.items) ? data.items : []);
        setVendorsFailed(false);
      }
    } catch {
      setVendors(buildDemoVendors());
      setVendorsFailed(true);
    } finally {
      setVendorsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  /* slug ^[a-z0-9-]{3,60}$, title required, commission 0..50 → POST /v1/vendors then re-fetch */
  const handleCreateVendor = async () => {
    const errors: string[] = [];
    const slug = vendorForm.slug.trim().toLowerCase();
    if (!slug) {
      errors.push("وارد کردن شناسه فروشنده (slug) الزامی است.");
    } else if (!/^[a-z0-9-]{3,60}$/.test(slug)) {
      errors.push("شناسه فروشنده باید بین ۳ تا ۶۰ نویسه لاتین کوچک، رقم یا خط تیره باشد.");
    }

    const titleFa = vendorForm.titleFa.trim();
    if (!titleFa) {
      errors.push("وارد کردن عنوان فارسی فروشنده الزامی است.");
    }

    if (vendorForm.commissionPct.trim()) {
      const pct = Number(vendorForm.commissionPct);
      if (!Number.isFinite(pct) || pct < 0 || pct > 50) {
        errors.push("درصد کمیسیون پلتفرم باید عددی بین ۰ تا ۵۰ باشد.");
      }
    }

    if (errors.length > 0) {
      setVendorErrors(errors);
      setVendorSuccess("");
      return;
    }

    const body: Record<string, unknown> = { slug, titleFa };
    if (vendorForm.description.trim()) body.description = vendorForm.description.trim();
    body.logoColor = vendorForm.logoColor;
    if (vendorForm.commissionPct.trim()) {
      body.commissionBps = Math.round(Number(vendorForm.commissionPct) * 100);
    }

    setVendorSubmitting(true);
    const result = await postTenantJson("/v1/vendors", body);
    setVendorSubmitting(false);
    if (!result.ok) {
      setVendorErrors([`ایجاد فروشنده انجام نشد: ${result.message}`]);
      setVendorSuccess("");
      return;
    }
    setVendorForm(EMPTY_VENDOR_FORM);
    setVendorErrors([]);
    setVendorSuccess(`فروشنده «${titleFa}» با موفقیت ایجاد شد.`);
    await loadVendors();
  };

  /* ── Digital grants tab: live fetch (?phone= optional filter) with demo fallback + revoke ── */
  const [grants, setGrants] = useState<DigitalGrant[] | null>(null);
  const [grantsLoading, setGrantsLoading] = useState(false);
  const [grantsFailed, setGrantsFailed] = useState(false);
  const [digitalPhoneInput, setDigitalPhoneInput] = useState("");
  const [digitalPhone, setDigitalPhone] = useState("");
  const [grantsBusyId, setGrantsBusyId] = useState<string | null>(null);

  const loadGrants = useCallback(async (phone: string) => {
    setGrantsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/v1/digital/grants?phone=${encodeURIComponent(phone)}`,
        {
          headers: TENANT_HEADERS,
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as DigitalGrantsResponse;
      if (data?.dbAvailable === false) {
        setGrants(buildDemoGrants());
        setGrantsFailed(true);
      } else {
        setGrants(Array.isArray(data?.items) ? data.items : []);
        setGrantsFailed(false);
      }
    } catch {
      setGrants(buildDemoGrants());
      setGrantsFailed(true);
    } finally {
      setGrantsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGrants(digitalPhone);
  }, [loadGrants, digitalPhone]);

  /* «اطلا‌ی لایسنس» with Persian confirm → POST revoke → re-fetch */
  const handleRevokeGrant = async (id: string) => {
    const confirmed = window.confirm(
      "آیا از اطلا‌ی این لایسنس دیجیتال مطمئن هستید؟ پس از اطلا، امکان دانلود محصول برای خریدار به‌طور کامل مسدود می‌شود."
    );
    if (!confirmed) return;
    setGrantsBusyId(id);
    const result = await postTenantJson(`/v1/digital/grants/${encodeURIComponent(id)}/revoke`, {});
    if (!result.ok) {
      alert(`✕ اطلا‌ی لایسنس انجام نشد: ${result.message}`);
    } else {
      await loadGrants(digitalPhone);
    }
    setGrantsBusyId(null);
  };

  // KPIs
  const totalGrossRevenue = orders.reduce((sum, o) => sum + o.totalAmountTomans, 0);
  const pendingReceiptCount = receipts.filter((r) => r.status === "PENDING_REVIEW").length;
  const lowStockCount = inventory.filter((i) => i.available < 5).length;

  // Derived values for the new tabs
  const analyticsFunnel = analytics?.funnel ?? [];
  const maxFunnelCount = Math.max(0, ...analyticsFunnel.map((s) => s?.count ?? 0));
  const analyticsDays = analytics?.days ?? 7;
  const exceptionsBlocks = exceptions?.blocks ?? [];
  const exceptionsAlertCount = exceptionsBlocks.reduce(
    (sum, b) => sum + ((b?.count ?? 0) > 0 ? (b?.count ?? 0) : 0),
    0
  );

  /* ── Subscriptions derived KPIs (BigInt-safe) ── */
  const subsItems = subscriptions ?? [];
  const subsActiveCount = subsItems.filter((s) => s?.status === "ACTIVE").length;
  const subsPausedCount = subsItems.filter((s) => s?.status === "PAUSED").length;
  const subsCancelledCount = subsItems.filter((s) => s?.status === "CANCELLED").length;
  /* Approximate monthly revenue: Σ (ACTIVE plan priceRials × quantity), Rials → Tomans via BigInt */
  const subsMonthlyRevenueTomans =
    subsItems
      .filter((s) => s?.status === "ACTIVE")
      .reduce<bigint>((sum, s) => {
        const digits = String(s?.plan?.priceRials ?? "").replace(/[^\d]/g, "");
        const priceRials = digits ? BigInt(digits) : 0n;
        const rawQty = Number(s?.quantity ?? 0);
        const qty = Number.isFinite(rawQty) ? Math.max(0, Math.trunc(rawQty)) : 0;
        return sum + priceRials * BigInt(qty);
      }, 0n) / 10n;

  const b2bItems = b2bQuotes ?? [];
  const vendorsItems = vendors ?? [];
  const grantsItems = grants ?? [];

  return (
    <div className="admin-container">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-mark">COS</div>
          <div>
            <strong>Commerce OS</strong>
            <small>مرکز عملیات و ERP</small>
          </div>
        </div>

        <nav className="admin-nav">
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
            📦 سفارشات ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("receipts")}
            className={`nav-btn ${activeTab === "receipts" ? "active" : ""}`}
          >
            💳 تایید کارت‌به‌کارت {pendingReceiptCount > 0 && <span className="badge-count">{pendingReceiptCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`nav-btn ${activeTab === "inventory" ? "active" : ""}`}
          >
            🏬 کنترل انبار {lowStockCount > 0 && <span className="badge-alert">!</span>}
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`nav-btn ${activeTab === "ledger" ? "active" : ""}`}
          >
            ⚖️ دفترکل دوبل‌اندر
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`nav-btn ${activeTab === "audit" ? "active" : ""}`}
          >
            🛡️ لاگ‌های حسابرسی
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`nav-btn ${activeTab === "analytics" ? "active" : ""}`}
          >
            📈 تحلیل و قیف فروش
          </button>
          <button
            onClick={() => setActiveTab("exceptions")}
            className={`nav-btn ${activeTab === "exceptions" ? "active" : ""}`}
          >
            🚨 مرکز استثناها{" "}
            {exceptions !== null && exceptionsAlertCount > 0 && (
              <span className="badge-count">{faNumber(exceptionsAlertCount)}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`nav-btn ${activeTab === "coupons" ? "active" : ""}`}
          >
            🎟️ کوپن‌ها
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`nav-btn ${activeTab === "subscriptions" ? "active" : ""}`}
          >
            🔁 اشتراک‌های دوره‌ای{" "}
            {subscriptions !== null && !subscriptionsFailed && subsActiveCount > 0 && (
              <span className="badge-count">{faNumber(subsActiveCount)}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("b2b")}
            className={`nav-btn ${activeTab === "b2b" ? "active" : ""}`}
          >
            📑 استعلام‌های عمده B2B
          </button>
          <button
            onClick={() => setActiveTab("vendors")}
            className={`nav-btn ${activeTab === "vendors" ? "active" : ""}`}
          >
            🏬 فروشندگان
          </button>
          <button
            onClick={() => setActiveTab("digital")}
            className={`nav-btn ${activeTab === "digital" ? "active" : ""}`}
          >
            ⬇ لایسنس‌های دیجیتال
          </button>
        </nav>

        <div className="admin-user-profile">
          <div className="user-avatar">مدیر</div>
          <div className="user-info">
            <strong>مدیر ارشد عملیات</strong>
            <small>دسترسی سراسری</small>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <h1>مرکز فرماندهی و عملیات Commerce OS</h1>
            <p>مدیریت جامع فروشگاه، رزروهای انبار، اسناد دوبل‌اندر و اعتبارسنجی تراکنش‌ها</p>
          </div>
          <div className="topbar-actions">
            <button onClick={handleDownloadSepidarCsv} className="btn-sepidar-export">
              📑 دانلود خروجی استاندارد سپیدار (CSV + BOM)
            </button>
            <div className="server-status-pill">
              <span className="pulse-dot"></span>
              پایگاه داده PostgreSQL 17 متصل
            </div>
          </div>
        </header>

        {/* ── Tab: Overview ── */}
        {activeTab === "overview" && (
          <div className="tab-pane">
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-title">فروش ناخالص کل</span>
                <strong className="kpi-value">
                  {new Intl.NumberFormat("fa-IR").format(totalGrossRevenue)} تومان
                </strong>
                <span className="kpi-sub">بر اساس اسناد قطعی دفترکل</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">سفارشات نیازمند پردازش</span>
                <strong className="kpi-value">{orders.length} سفارش</strong>
                <span className="kpi-sub">تراکنش‌های قطعی در صف انبار</span>
              </div>

              <div className="kpi-card highlight">
                <span className="kpi-title">فیش‌های در انتظار بررسی</span>
                <strong className="kpi-value">{pendingReceiptCount} فیش</strong>
                <span className="kpi-sub">کارت‌به‌کارت نیازمند تایید اپراتور</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">تراز مالی دوبل‌اندر</span>
                <strong className="kpi-value status-ok">متوازن (۱۰۰٪)</strong>
                <span className="kpi-sub">SUM(DEBIT) === SUM(CREDIT)</span>
              </div>
            </div>

            <section className="admin-section-box">
              <div className="box-header">
                <h2>آخرین تراکنش‌های ثبت‌شده</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>کد سفارش</th>
                    <th>نام خریدار</th>
                    <th>شماره تماس</th>
                    <th>مبلغ</th>
                    <th>روش پرداخت</th>
                    <th>وضعیت</th>
                    <th>تاریخ و ساعت</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="bold" dir="ltr">
                        {o.orderNumber}
                      </td>
                      <td>{o.customerName}</td>
                      <td dir="ltr">{o.customerPhone}</td>
                      <td className="bold">
                        {new Intl.NumberFormat("fa-IR").format(o.totalAmountTomans)} تومان
                      </td>
                      <td>{o.paymentMethod}</td>
                      <td>
                        <span className={`status-pill ${o.status.toLowerCase()}`}>
                          {o.status === "PAID"
                            ? "پرداخت‌شده"
                            : o.status === "PROCESSING"
                            ? "آماده‌سازی"
                            : o.status === "SHIPPED"
                            ? "ارسال‌شده"
                            : o.status}
                        </span>
                      </td>
                      <td>{formatJalaliDateTime(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Orders ── */}
        {activeTab === "orders" && (
          <div className="tab-pane">
            <section className="admin-section-box">
              <div className="box-header">
                <h2>مدیریت چرخه حیات سفارشات</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>کد سفارش</th>
                    <th>نام خریدار</th>
                    <th>مبلغ کل</th>
                    <th>وضعیت جاری</th>
                    <th>تغییر وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="bold" dir="ltr">
                        {o.orderNumber}
                      </td>
                      <td>{o.customerName}</td>
                      <td className="bold">
                        {new Intl.NumberFormat("fa-IR").format(o.totalAmountTomans)} تومان
                      </td>
                      <td>
                        <span className={`status-pill ${o.status.toLowerCase()}`}>{o.status}</span>
                      </td>
                      <td>
                        <div className="action-button-group">
                          {o.status === "PAID" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, "PROCESSING")}
                              className="btn-action"
                            >
                              انتقال به آماده‌سازی
                            </button>
                          )}
                          {o.status === "PROCESSING" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, "SHIPPED")}
                              className="btn-action"
                            >
                              تحویل به پست/تیپاکس
                            </button>
                          )}
                          {o.status === "SHIPPED" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, "DELIVERED")}
                              className="btn-action"
                            >
                              تحویل به مشتری
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Receipts ── */}
        {activeTab === "receipts" && (
          <div className="tab-pane">
            <section className="admin-section-box">
              <div className="box-header">
                <h2>مرکز بررسی و تایید فیش‌های کارت‌به‌کارت</h2>
                <small>تایید هر فیش به‌صورت اتمیک ثبت سفارش را به وضعیت قطعی رسانده و سند دوبل‌اندر ایجاد می‌کند.</small>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>شناسه سفارش</th>
                    <th>شماره پیگیری فیش</th>
                    <th>کارت واریزکننده</th>
                    <th>مبلغ واریزی</th>
                    <th>وضعیت</th>
                    <th>تاریخ ثبت</th>
                    <th>عملیات اپراتور</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r) => (
                    <tr key={r.id}>
                      <td className="bold" dir="ltr">
                        {r.orderNumber}
                      </td>
                      <td className="bold" dir="ltr">
                        {r.referenceNumber}
                      </td>
                      <td dir="ltr">{r.payerCard}</td>
                      <td className="bold">
                        {new Intl.NumberFormat("fa-IR").format(r.amountTomans)} تومان
                      </td>
                      <td>
                        <span className={`status-pill ${r.status.toLowerCase()}`}>
                          {r.status === "PENDING_REVIEW"
                            ? "در انتظار بررسی"
                            : r.status === "APPROVED"
                            ? "تایید شده"
                            : "رد شده"}
                        </span>
                      </td>
                      <td>{formatJalaliDateTime(r.createdAt)}</td>
                      <td>
                        {r.status === "PENDING_REVIEW" ? (
                          <div className="action-button-group">
                            <button
                              onClick={() => handleApproveReceipt(r.id)}
                              className="btn-approve"
                            >
                              ✓ تایید و صدور سند
                            </button>
                            <button
                              onClick={() => handleRejectReceipt(r.id)}
                              className="btn-reject"
                            >
                              ✕ رد فیش
                            </button>
                          </div>
                        ) : (
                          <span className="muted-text">بررسی شد</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Inventory ── */}
        {activeTab === "inventory" && (
          <div className="tab-pane">
            <section className="admin-section-box">
              <div className="box-header">
                <h2>کنترل موجودی انبار و رزروهای موقت</h2>
                <small>رزروها با قفل‌های ردیفی SELECT ... FOR UPDATE محافظت می‌شوند تا فروش مازاد رخ ندهد.</small>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>کد کالا (SKU)</th>
                    <th>عنوان کالا</th>
                    <th>موجودی فیزیکی کل</th>
                    <th>رزرو جاری مشتریان</th>
                    <th>موجودی قابل فروش</th>
                    <th>شارژ انبار</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.sku}>
                      <td className="bold" dir="ltr">
                        {item.sku}
                      </td>
                      <td>{item.title}</td>
                      <td>{item.onHand} عدد</td>
                      <td className="accent-text">{item.reserved} عدد</td>
                      <td>
                        <span className={`stock-tag ${item.available < 5 ? "low" : "ok"}`}>
                          {item.available} عدد
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleAddStock(item.sku)}
                          className="btn-action"
                        >
                          + شارژ ۱۰ واحد
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Ledger ── */}
        {activeTab === "ledger" && (
          <div className="tab-pane">
            <section className="admin-section-box">
              <div className="box-header">
                <h2>دفترکل دوبل‌اندر و کدینگ استاندارد حساب‌ها</h2>
                <small>تمامی اسناد مالی غیرقابل ویرایش و غیرقابل حذف (Append-Only) با دقت کامل ریالی هستند.</small>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>کد حساب معین</th>
                    <th>عنوان حساب (فارسی)</th>
                    <th>عنوان حساب (انگلیسی)</th>
                    <th>ماهیت حساب</th>
                    <th>وضعیت تراز</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(CHART_OF_ACCOUNTS).map((acc) => (
                    <tr key={acc.code}>
                      <td className="bold" dir="ltr">
                        {acc.code}
                      </td>
                      <td>{acc.nameFa}</td>
                      <td dir="ltr">{acc.nameEn}</td>
                      <td>
                        <span className="category-pill">{acc.category}</span>
                      </td>
                      <td>
                        <span className="status-pill active">تراز و معتبر</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Audit Logs ── */}
        {activeTab === "audit" && (
          <div className="tab-pane">
            <section className="admin-section-box">
              <div className="box-header">
                <h2>لاگ‌های حسابرسی و امنیت (Security & Audit Trail)</h2>
                <small>ثبت تغییرناپذیر کلیه فعالیت‌های حساس اپراتورها، تایید پرداخت‌ها و رویدادهای سیستمی.</small>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>شناسه لاگ</th>
                    <th>کاربر / عامل (Actor)</th>
                    <th>عملیات (Action)</th>
                    <th>هدف (Target)</th>
                    <th>آدرس IP</th>
                    <th>زمان ثبت</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="bold" dir="ltr">{log.id}</td>
                      <td>{log.actor}</td>
                      <td><span className="category-pill">{log.action}</span></td>
                      <td dir="ltr">{log.target}</td>
                      <td dir="ltr">{log.ip}</td>
                      <td>{formatJalaliDateTime(log.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Analytics (Sales Funnel) ── */}
        {activeTab === "analytics" && (
          <div className="tab-pane">
            {analyticsFailed && (
              <p className="api-fallback-note">⚠️ نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            {analytics === null ? (
              <p className="muted-text">
                {analyticsLoading ? "در حال دریافت داده‌های تحلیلی از سرور…" : "داده‌ای برای نمایش وجود ندارد."}
              </p>
            ) : (
              <>
                <div className="kpi-grid kpi-grid-5">
                  {ANALYTICS_KPIS.map((kpi) => (
                    <div className="kpi-card" key={kpi.key}>
                      <span className="kpi-title">{kpi.fa}</span>
                      <strong className="kpi-value">{faNumber(analytics?.byName?.[kpi.key])}</strong>
                      <span className="kpi-sub">رویداد در {faNumber(analyticsDays)} روز گذشته</span>
                    </div>
                  ))}
                </div>

                <section className="admin-section-box">
                  <div className="box-header">
                    <h2>قیف تبدیل فروش</h2>
                    <small>حجم رویداد هر مرحله و نرخ تبدیل آن به مرحله بعدی قیف.</small>
                  </div>
                  {analyticsFunnel.length === 0 ? (
                    <p className="muted-text">داده‌ای برای قیف فروش ثبت نشده است.</p>
                  ) : (
                    <div className="funnel-list">
                      {analyticsFunnel.map((stage, idx) => {
                        const stageKey = str(stage?.stage);
                        const count = stage?.count ?? 0;
                        const pct = Math.round(stage?.conversionToNextPct ?? 0);
                        const width =
                          maxFunnelCount > 0
                            ? Math.min(100, Math.max(count > 0 ? 3 : 0, Math.round((count / maxFunnelCount) * 100)))
                            : 0;
                        return (
                          <div className="funnel-row" key={`${stageKey}-${idx}`}>
                            <div className="funnel-meta">
                              <span className="funnel-stage-name">{FUNNEL_STAGE_FA[stageKey] ?? stageKey}</span>
                              <span className="funnel-stage-count">{faNumber(count)} رویداد</span>
                              <span className="funnel-stage-pct">{faNumber(pct)}٪ تبدیل به مرحله بعد</span>
                            </div>
                            <div className="funnel-bar-track">
                              <div className="funnel-bar-fill" style={{ width: `${width}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="admin-section-box">
                  <div className="box-header">
                    <h2>فعالیت {faNumber(analyticsDays)} روز گذشته</h2>
                    <small>شمارش روزانه رویدادهای کلیدی قیف فروش.</small>
                  </div>
                  {(analytics?.byDay ?? []).length === 0 ? (
                    <p className="muted-text">داده‌ای برای نمایش نیست.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>تاریخ</th>
                          <th>مشاهده محصول</th>
                          <th>جست‌وجو</th>
                          <th>افزودن به سبد</th>
                          <th>شروع پرداخت</th>
                          <th>سفارش قطعی</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(analytics?.byDay ?? []).map((row, idx) => (
                          <tr key={str(row?.day) !== "—" ? str(row?.day) : `day-${idx}`}>
                            <td className="bold">{formatDayLabel(row?.day)}</td>
                            <td>{faNumber(row?.product_viewed)}</td>
                            <td>{faNumber(row?.search_submitted)}</td>
                            <td>{faNumber(row?.add_to_cart)}</td>
                            <td>{faNumber(row?.checkout_started)}</td>
                            <td className="bold">{faNumber(row?.order_confirmed)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Exceptions Center ── */}
        {activeTab === "exceptions" && (
          <div className="tab-pane">
            <section className="admin-section-box exception-summary-box">
              <div className="box-header exception-summary-header">
                <div>
                  <h2>مرکز استثناها و وضعیت‌های نیازمند مداخله</h2>
                  <small>
                    پایش رویدادهای مردود صندوق خروج، پرداخت‌های نامشخص، رزروهای گیرکرده، فیش‌های معلق و شکست‌های وبهوک.
                  </small>
                </div>
                <div className="exceptions-toolbar">
                  {exceptionsFailed && (
                    <span className="muted-text">نمایش داده نمونه — اتصال به API برقرار نشد</span>
                  )}
                  <button
                    onClick={() => void loadExceptions()}
                    disabled={exceptionsLoading}
                    className="btn-action"
                  >
                    {exceptionsLoading ? "⏳ در حال بازرسی…" : "🔄 بازرسی مجدد"}
                  </button>
                </div>
              </div>
              {exceptions === null && (
                <p className="muted-text">
                  {exceptionsLoading ? "در حال دریافت وضعیت استثناها از سرور…" : "داده‌ای برای نمایش وجود ندارد."}
                </p>
              )}
            </section>

            {exceptionsBlocks.map((block, blockIdx) => {
              const blockKey = str(block?.key);
              const meta = EXCEPTION_BLOCK_META[blockKey];
              const items = block?.items ?? [];
              const count = block?.count ?? items.length;
              const title = block?.titleFa || meta?.fa || blockKey;
              const columns = meta?.columns ?? ["جزئیات"];
              const cellsForItem = (item: ExceptionItem): string[] =>
                meta ? exceptionCells(blockKey, item) : [str(item)];
              return (
                <section className="admin-section-box exception-block" key={`${blockKey}-${blockIdx}`}>
                  <div className="box-header exception-block-header">
                    <h2>{title}</h2>
                    {count > 0 ? (
                      <span className="badge-alert">{faNumber(count)}</span>
                    ) : (
                      <span className="badge-ok">{faNumber(count)}</span>
                    )}
                  </div>
                  {items.length === 0 ? (
                    <p className="muted-text exception-empty">
                      {count > 0 ? "موردی برای نمایش یافت نشد." : "✅ پاک"}
                    </p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, itemIdx) => (
                          <tr key={itemIdx}>
                            {cellsForItem(item).map((cell, cellIdx) => (
                              <td key={cellIdx} className={cellIdx === 0 ? "bold" : undefined}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* ── Tab: Coupons ── */}
        {activeTab === "coupons" && (
          <div className="tab-pane">
            <section className="admin-section-box">
              <div className="box-header">
                <h2>ایجاد کد تخفیف جدید</h2>
                <small>کوپن‌ها بر اساس نوع تخفیف (درصدی یا مبلغ ثابت) در لحظه پرداخت اعمال می‌شوند.</small>
              </div>
              <div className="coupon-form-grid">
                <div className="coupon-field">
                  <label htmlFor="coupon-code">کد کوپن</label>
                  <input
                    id="coupon-code"
                    className="admin-input"
                    dir="ltr"
                    placeholder="WELCOME10"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="coupon-type">نوع تخفیف</label>
                  <select
                    id="coupon-type"
                    className="admin-input"
                    value={couponForm.type}
                    onChange={(e) =>
                      setCouponForm((prev) => ({ ...prev, type: e.target.value as "PERCENT" | "FIXED" }))
                    }
                  >
                    <option value="PERCENT">درصدی</option>
                    <option value="FIXED">مبلغ ثابت (تومان)</option>
                  </select>
                </div>
                <div className="coupon-field">
                  <label htmlFor="coupon-value">
                    {couponForm.type === "PERCENT" ? "مقدار (درصد)" : "مقدار (تومان)"}
                  </label>
                  <input
                    id="coupon-value"
                    className="admin-input"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder={couponForm.type === "PERCENT" ? "10" : "50000"}
                    value={couponForm.value}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, value: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="coupon-max">
                    سقف تخفیف (تومان){couponForm.type === "FIXED" ? " — اختیاری" : ""}
                  </label>
                  <input
                    id="coupon-max"
                    className="admin-input"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="500000"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, maxDiscount: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="coupon-min">حداقل خرید (تومان)</label>
                  <input
                    id="coupon-min"
                    className="admin-input"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="2000000"
                    value={couponForm.minPurchase}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, minPurchase: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="coupon-limit">محدودیت تعداد استفاده</label>
                  <input
                    id="coupon-limit"
                    className="admin-input"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="خالی = نامحدود"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, usageLimit: e.target.value }))}
                  />
                </div>
              </div>
              {couponErrors.length > 0 && (
                <div className="form-feedback-error">
                  <ul className="feedback-list">
                    {couponErrors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              {couponSuccess && <div className="form-feedback-success">{couponSuccess}</div>}
              <div className="coupon-form-actions">
                <button onClick={handleCreateCoupon} className="btn-primary">
                  + ایجاد کوپن
                </button>
                <span className="muted-text">کوپن‌های ایجادشده بلافاصله برای مشتریان فعال می‌شوند.</span>
              </div>
            </section>

            <section className="admin-section-box">
              <div className="box-header">
                <h2>مدیریت کوپن‌های فروشگاه</h2>
                <small>{faNumber(coupons.length)} کوپن در سیستم ثبت شده است.</small>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>کد</th>
                    <th>نوع</th>
                    <th>مقدار</th>
                    <th>سقف</th>
                    <th>حداقل خرید</th>
                    <th>مصرف</th>
                    <th>انقضا</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="bold" dir="ltr">
                        {c.code}
                      </td>
                      <td>{c.type === "PERCENT" ? "درصدی" : "مبلغ ثابت"}</td>
                      <td className="bold">
                        {c.type === "PERCENT" ? `${faNumber(c.value)}٪` : `${faNumber(c.value)} تومان`}
                      </td>
                      <td>{c.maxDiscountTomans === null ? "—" : `${faNumber(c.maxDiscountTomans)} تومان`}</td>
                      <td>{c.minPurchaseTomans === 0 ? "—" : `${faNumber(c.minPurchaseTomans)} تومان`}</td>
                      <td>
                        {c.usageLimit > 0
                          ? `${faNumber(c.usedCount)} از ${faNumber(c.usageLimit)}`
                          : `${faNumber(c.usedCount)} (نامحدود)`}
                      </td>
                      <td>{formatJalaliDateTime(c.expiresAt)}</td>
                      <td>
                        <span className={`status-pill ${c.active ? "paid" : "rejected"}`}>
                          {c.active ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleCoupon(c.id)}
                          className={c.active ? "btn-reject" : "btn-approve"}
                        >
                          {c.active ? "غیرفعال‌سازی" : "فعال‌سازی مجدد"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ── Tab: Subscriptions (periodic) ── */}
        {activeTab === "subscriptions" && (
          <div className="tab-pane">
            {subscriptionsFailed && (
              <p className="api-fallback-note">⚠️ نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            {subscriptions === null ? (
              <p className="muted-text">
                {subscriptionsLoading ? "در حال دریافت اشتراک‌ها از سرور…" : "داده‌ای برای نمایش وجود ندارد."}
              </p>
            ) : (
              <>
                <div className="kpi-grid subs-kpi-row">
                  <div className="kpi-card">
                    <span className="kpi-title">فعال</span>
                    <strong className="kpi-value">{faNumber(subsActiveCount)}</strong>
                    <span className="kpi-sub">اشتراک در حال تکرار خودکار</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-title">موقتاً متوقف</span>
                    <strong className="kpi-value">{faNumber(subsPausedCount)}</strong>
                    <span className="kpi-sub">نیازمند پیگیری تمدید</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-title">لغوشده</span>
                    <strong className="kpi-value">{faNumber(subsCancelledCount)}</strong>
                    <span className="kpi-sub">خارج از چرخه اجرا</span>
                  </div>
                  <div className="kpi-card highlight">
                    <span className="kpi-title">درآمد ماهانه تقریبی</span>
                    <strong className="kpi-value">
                      {new Intl.NumberFormat("fa-IR").format(subsMonthlyRevenueTomans)} تومان
                    </strong>
                    <span className="kpi-sub">مجموع (قیمت پلن × تعداد) اشتراک‌های فعال</span>
                  </div>
                </div>

                <section className="admin-section-box">
                  <div className="box-header exception-summary-header">
                    <div>
                      <h2>مدیریت اشتراک‌های دوره‌ای مشتریان</h2>
                      <small>توقف/ادامه/لغو مستقیماً روی موتور اجرای دوره‌ای اعمال و فهرست بلافاصله بازخوانی می‌شود.</small>
                    </div>
                    <div className="exceptions-toolbar">
                      <button
                        onClick={() => void loadSubscriptions()}
                        disabled={subscriptionsLoading}
                        className="btn-action"
                      >
                        {subscriptionsLoading ? "⏳ در حال دریافت…" : "🔄 بازخوانی فهرست"}
                      </button>
                    </div>
                  </div>
                  {subsItems.length === 0 ? (
                    <p className="muted-text">هیچ اشتراکی ثبت نشده است.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>مشترک</th>
                          <th>پلن</th>
                          <th>تعداد</th>
                          <th>مبلغ دوره (تومان)</th>
                          <th>سیکل‌های اجرا شده</th>
                          <th>اجرای بعدی</th>
                          <th>وضعیت</th>
                          <th>عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subsItems.map((s, idx) => {
                          const statusKey = String(s?.status ?? "");
                          const pill = SUBS_STATUS_PILL[statusKey];
                          const subId = typeof s?.id === "string" && s.id ? s.id : "";
                          const busy = subsActionBusyId === subId;
                          return (
                            <tr key={subId || `sub-${idx}`}>
                              <td dir="ltr" className="bold">{str(s?.phone)}</td>
                              <td>{str(s?.plan?.titleFa)}</td>
                              <td>{faNumber(s?.quantity)}</td>
                              <td className="bold">{formatRialAsTomans(s?.plan?.priceRials)}</td>
                              <td>{faNumber(s?.cyclesRun)}</td>
                              <td>{tryJalali(s?.nextRunAt)}</td>
                              <td>
                                <span className={`status-pill ${pill?.cls ?? ""}`}>{pill?.fa ?? str(statusKey)}</span>
                              </td>
                              <td>
                                {statusKey === "ACTIVE" && subId ? (
                                  <div className="action-button-group">
                                    <button
                                      className="btn-action"
                                      disabled={busy}
                                      onClick={() => void handleSubscriptionAction(subId, "pause")}
                                    >
                                      {busy ? "⏳" : "توقف"}
                                    </button>
                                    <button
                                      className="btn-reject"
                                      disabled={busy}
                                      onClick={() => void handleSubscriptionAction(subId, "cancel")}
                                    >
                                      لغو
                                    </button>
                                  </div>
                                ) : statusKey === "PAUSED" && subId ? (
                                  <div className="action-button-group">
                                    <button
                                      className="btn-approve"
                                      disabled={busy}
                                      onClick={() => void handleSubscriptionAction(subId, "resume")}
                                    >
                                      {busy ? "⏳" : "ادامه"}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="muted-text">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </section>
              </>
            )}
          </div>
        )}

        {/* ── Tab: B2B Quote Requests ── */}
        {activeTab === "b2b" && (
          <div className="tab-pane">
            {b2bFailed && (
              <p className="api-fallback-note">⚠️ نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            {b2bQuotes === null ? (
              <p className="muted-text">
                {b2bLoading ? "در حال دریافت استعلام‌ها از سرور…" : "داده‌ای برای نمایش وجود ندارد."}
              </p>
            ) : (
              <section className="admin-section-box">
                <div className="box-header exception-summary-header">
                  <div>
                    <h2>استعلام‌های خرید عمده (B2B)</h2>
                    <small>برای مشاهده شرح کامل اقلام و ثبت یادداشت مدیر روی هر ردیف کلیک کنید؛ تغییر وضعیت فقط به جلو (forward-only) است.</small>
                  </div>
                  <div className="exceptions-toolbar">
                    <button
                      onClick={() => void loadB2b(b2bFilter)}
                      disabled={b2bLoading}
                      className="btn-action"
                    >
                      {b2bLoading ? "⏳ در حال دریافت…" : "🔄 بازخوانی فهرست"}
                    </button>
                  </div>
                </div>

                <div className="b2b-chips">
                  {B2B_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      className={`b2b-chip ${b2bFilter === f.value ? "active" : ""}`}
                      disabled={b2bLoading}
                      onClick={() => {
                        setB2bExpandedId(null);
                        setB2bFilter(f.value);
                      }}
                    >
                      {f.fa}
                    </button>
                  ))}
                </div>

                {b2bItems.length === 0 ? (
                  <p className="muted-text">
                    {b2bFilter === "ALL" ? "هیچ استعلامی ثبت نشده است." : "استعلامی با این وضعیت یافت نشد."}
                  </p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>شرکت</th>
                        <th>رابط</th>
                        <th>تماس</th>
                        <th>اقلام</th>
                        <th>تعداد</th>
                        <th>تاریخ</th>
                        <th>وضعیت</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b2bItems.map((q, idx) => {
                        const quoteId = typeof q?.id === "string" && q.id ? q.id : "";
                        const statusKey = String(q?.status ?? "");
                        const pill = B2B_STATUS_PILL[statusKey];
                        const transition = quoteId ? B2B_TRANSITIONS[statusKey] : undefined;
                        const expanded = quoteId !== "" && b2bExpandedId === quoteId;
                        const busy = b2bBusyId === quoteId;
                        return (
                          <Fragment key={quoteId || `b2b-${idx}`}>
                            <tr
                              className={quoteId ? "b2b-row-clickable" : undefined}
                              onClick={quoteId ? () => setB2bExpandedId(expanded ? null : quoteId) : undefined}
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
                              <td>{faNumber(q?.desiredQty)}</td>
                              <td>{tryJalali(q?.createdAt)}</td>
                              <td>
                                <span className={`status-pill ${pill?.cls ?? ""}`}>{pill?.fa ?? str(statusKey)}</span>
                              </td>
                              <td onClick={(e) => e.stopPropagation()}>
                                {transition ? (
                                  <button
                                    className="btn-action"
                                    disabled={busy}
                                    onClick={() => void handleB2bTransition(quoteId, transition.next)}
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
                                    <strong>شرح کامل اقلام درخواستی</strong>
                                    <p>{str(q?.itemsSummary)}</p>
                                    <label htmlFor={`b2b-note-${quoteId}`}>
                                      یادداشت مدیر (همراه تغییر وضعیت ارسال می‌شود — اختیاری)
                                    </label>
                                    <textarea
                                      id={`b2b-note-${quoteId}`}
                                      rows={2}
                                      placeholder="مثال: قیمت از تامین‌کننده استعلام شد؛ منتظر تایید نرخ ارسال…"
                                      value={b2bNotes[quoteId] ?? ""}
                                      onChange={(e) =>
                                        setB2bNotes((prev) => ({ ...prev, [quoteId]: e.target.value }))
                                      }
                                    />
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
            )}
          </div>
        )}

        {/* ── Tab: Vendors (C2C marketplace) ── */}
        {activeTab === "vendors" && (
          <div className="tab-pane">
            {vendorsFailed && (
              <p className="api-fallback-note">⚠️ نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            <section className="admin-section-box">
              <div className="box-header">
                <h2>ثبت فروشنده جدید</h2>
                <small>فروشندگان مارکت‌پلیس با شناسه یکتا (slug) ثبت می‌شوند؛ کمیسیون پلتفرم بر پایه درصد (BPS) محاسبه می‌گردد.</small>
              </div>
              <div className="vendor-form-row">
                <div className="coupon-field">
                  <label htmlFor="vendor-slug">شناسه فروشنده (slug)</label>
                  <input
                    id="vendor-slug"
                    className="admin-input"
                    dir="ltr"
                    placeholder="roasting-lab"
                    value={vendorForm.slug}
                    onChange={(e) => setVendorForm((prev) => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="vendor-title">عنوان فارسی فروشنده</label>
                  <input
                    id="vendor-title"
                    className="admin-input"
                    placeholder="کارگاه رست لَب"
                    value={vendorForm.titleFa}
                    onChange={(e) => setVendorForm((prev) => ({ ...prev, titleFa: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="vendor-commission">درصد کمیسیون پلتفرم (اختیاری — بین ۰ تا ۵۰)</label>
                  <input
                    id="vendor-commission"
                    className="admin-input"
                    dir="ltr"
                    inputMode="decimal"
                    placeholder="8"
                    value={vendorForm.commissionPct}
                    onChange={(e) => setVendorForm((prev) => ({ ...prev, commissionPct: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="vendor-description">توضیحات (اختیاری)</label>
                  <input
                    id="vendor-description"
                    className="admin-input"
                    placeholder="رست تخصصی قهوه اتیوپی"
                    value={vendorForm.description}
                    onChange={(e) => setVendorForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="coupon-field">
                  <label htmlFor="vendor-logo-color">رنگ لوگو</label>
                  <input
                    id="vendor-logo-color"
                    type="color"
                    className="admin-input"
                    value={vendorForm.logoColor}
                    onChange={(e) => setVendorForm((prev) => ({ ...prev, logoColor: e.target.value }))}
                  />
                </div>
              </div>
              {vendorErrors.length > 0 && (
                <div className="form-feedback-error">
                  <ul className="feedback-list">
                    {vendorErrors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              {vendorSuccess && <div className="form-feedback-success">{vendorSuccess}</div>}
              <div className="coupon-form-actions">
                <button
                  onClick={() => void handleCreateVendor()}
                  className="btn-primary"
                  disabled={vendorSubmitting}
                >
                  {vendorSubmitting ? "⏳ در حال ثبت…" : "+ ایجاد فروشنده"}
                </button>
                <span className="muted-text">پس از ثبت موفق، فهرست فروشندگان بلافاصله بازخوانی می‌شود.</span>
              </div>
            </section>

            <section className="admin-section-box">
              <div className="box-header exception-summary-header">
                <div>
                  <h2>فهرست فروشندگان مارکت‌پلیس</h2>
                  <small>{faNumber(vendorsItems.length)} فروشنده در فروشگاه demo ثبت شده است.</small>
                </div>
                <div className="exceptions-toolbar">
                  <button
                    onClick={() => void loadVendors()}
                    disabled={vendorsLoading}
                    className="btn-action"
                  >
                    {vendorsLoading ? "⏳ در حال دریافت…" : "🔄 بازخوانی فهرست"}
                  </button>
                </div>
              </div>
              {vendorsItems.length === 0 ? (
                <p className="muted-text">هیچ فروشنده‌ای ثبت نشده است.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>فروشنده</th>
                      <th>شناسه</th>
                      <th>تعداد محصولات</th>
                      <th>کمیسیون پلتفرم</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorsItems.map((v, idx) => {
                      const vendorId = typeof v?.id === "string" && v.id ? v.id : "";
                      const avatarColor = sanitizeHexColor(v?.logoColor);
                      const titleText = str(v?.titleFa);
                      const letter = titleText === "—" ? "؟" : titleText.trim().charAt(0) || "؟";
                      const desc = typeof v?.description === "string" ? v.description.trim() : "";
                      return (
                        <tr key={vendorId || `vendor-${idx}`}>
                          <td>
                            <div className="vendor-avatar-cell">
                              <span className="vendor-avatar-letter" style={{ background: avatarColor }}>
                                {letter}
                              </span>
                              <div>
                                <div className="bold">{titleText}</div>
                                {desc ? <div className="muted-text">{truncateFa(desc, 40)}</div> : null}
                              </div>
                            </div>
                          </td>
                          <td dir="ltr" className="bold">
                            {str(v?.slug)}
                          </td>
                          <td>{faNumber(v?.productCount)}</td>
                          <td className="bold">{formatBpsAsPercent(v?.commissionBps)}</td>
                          <td>
                            <span className="status-pill active">فعال</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}

        {/* ── Tab: Digital Licenses (grants) ── */}
        {activeTab === "digital" && (
          <div className="tab-pane">
            {grantsFailed && (
              <p className="api-fallback-note">⚠️ نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            <section className="admin-section-box">
              <div className="box-header exception-summary-header">
                <div>
                  <h2>لایسنس‌های محصولات دیجیتال</h2>
                  <small>هر خرید محصول دیجیتال یک توکن دانلود محدود می‌سازد؛ با اطلا‌ی لایسنس، دانلود بلافاصله مسدود می‌شود.</small>
                </div>
                <div className="exceptions-toolbar">
                  <button
                    onClick={() => void loadGrants(digitalPhone)}
                    disabled={grantsLoading}
                    className="btn-action"
                  >
                    {grantsLoading ? "⏳ در حال دریافت…" : "🔄 بازخوانی فهرست"}
                  </button>
                </div>
              </div>

              <div className="grant-filter-row">
                <div className="coupon-field">
                  <label htmlFor="grant-phone-filter">فیلتر شماره خریدار (اختیاری — خالی = همه)</label>
                  <input
                    id="grant-phone-filter"
                    className="admin-input"
                    dir="ltr"
                    placeholder="09121234567"
                    value={digitalPhoneInput}
                    onChange={(e) => setDigitalPhoneInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setDigitalPhone(digitalPhoneInput.trim());
                    }}
                  />
                </div>
                <button
                  className="btn-action"
                  disabled={grantsLoading}
                  onClick={() => setDigitalPhone(digitalPhoneInput.trim())}
                >
                  🔎 اعمال فیلتر
                </button>
                {digitalPhone !== "" && (
                  <button
                    className="btn-reject"
                    disabled={grantsLoading}
                    onClick={() => {
                      setDigitalPhoneInput("");
                      setDigitalPhone("");
                    }}
                  >
                    ✕ حذف فیلتر
                  </button>
                )}
              </div>

              {grantsItems.length === 0 ? (
                <p className="muted-text">
                  {digitalPhone ? "لایسنسی برای این شماره یافت نشد." : "هیچ لایسنسی ثبت نشده است."}
                </p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>محصول</th>
                      <th>خریدار</th>
                      <th>توکن</th>
                      <th>دانلود</th>
                      <th>انقضا</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grantsItems.map((g, idx) => {
                      const grantId = typeof g?.id === "string" && g.id ? g.id : "";
                      const pill = grantStatusPill(g);
                      const dlCount = Number(g?.downloadCount ?? 0);
                      const dlMax = Number(g?.maxDownloads ?? 0);
                      const dlPct =
                        dlMax > 0
                          ? Math.min(100, Math.max(0, Math.round((dlCount / dlMax) * 100)))
                          : 0;
                      const canRevoke = grantId !== "" && pill.cls === "digital-active";
                      const busy = grantsBusyId === grantId;
                      return (
                        <tr key={grantId || `grant-${idx}`}>
                          <td className="bold">{str(g?.productTitle)}</td>
                          <td dir="ltr">{str(g?.phone)}</td>
                          <td dir="ltr" className="bold">
                            {grantTokenPreview(g?.token)}
                          </td>
                          <td>
                            {dlMax > 0 ? (
                              <div className="grant-dl-cell">
                                <span>
                                  {faNumber(dlCount)} از {faNumber(dlMax)}
                                </span>
                                <div className="grant-dl-bar">
                                  <div className="grant-dl-fill" style={{ width: `${dlPct}%` }} />
                                </div>
                              </div>
                            ) : (
                              faNumber(dlCount)
                            )}
                          </td>
                          <td>{tryJalali(g?.expiresAt)}</td>
                          <td>
                            <span className={`status-pill ${pill.cls}`}>{pill.fa}</span>
                          </td>
                          <td>
                            {canRevoke ? (
                              <button
                                className="btn-reject"
                                disabled={busy}
                                onClick={() => void handleRevokeGrant(grantId)}
                              >
                                {busy ? "⏳" : "اطلا‌ی لایسنس"}
                              </button>
                            ) : (
                              <span className="muted-text">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
