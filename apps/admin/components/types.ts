import {
  buildSepidarCsv,
  formatAccountingJalaliDate,
  getFiscalYear,
  type AccountingExportRow,
} from "@commerce-os/finance";
import {
  isBackendFailureStatus,
  isIntentionalAbort,
  isOptionalRedisOnly503,
  normalizeNetworkError,
  parseApiErrorPayload,
  reportAdminBackendError,
} from "../lib/backend-error";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const ADMIN_API_KEY =
  process.env.NEXT_PUBLIC_ADMIN_API_KEY || "commerce-os-admin-secret-key-2026";

export interface LiveCartLineItem {
  id: string;
  variantId: string;
  qty: number;
  titleFa: string;
  sku: string;
  unitPriceTomans: number;
}

export interface LiveCartSessionItem {
  id: string;
  sessionId: string | null;
  customerName: string;
  customerPhone: string | null;
  customerType: "B2C" | "B2B_CLINIC";
  stage:
    | "BROWSING"
    | "CART_REVIEW"
    | "CHECKOUT_STARTED"
    | "SHIPPING_SELECTED"
    | "PAYMENT_INITIATED"
    | "ORDER_PLACED"
    | "ABANDONED";
  stageLabelFa: string;
  couponCode: string | null;
  shippingMethod: string | null;
  subtotalTomans: number;
  discountTomans: number;
  totalTomans: number;
  convertedOrderId: string | null;
  convertedOrderNumber: string | null;
  itemsCount: number;
  lines: LiveCartLineItem[];
  lastActivityAt: string;
  createdAt: string;
}

export interface LiveCartSummary {
  totalSessions: number;
  activeBrowsing: number;
  inCheckout: number;
  paymentInitiated: number;
  convertedOrders: number;
  potentialRevenueTomans: number;
}

export const TENANT_HEADERS: Record<string, string> = {
  "x-tenant-id": "955982e7-9a09-4bf7-b2f5-a3f2e3bc3291",
  "x-admin-api-key": ADMIN_API_KEY,
};

export interface AdminSessionUser {
  id: string;
  phone: string;
  fullName: string;
  role: string;
}

export const ADMIN_SESSION_KEY = "dermer_admin_session";

export const readAdminSession = (): { token: string; user: AdminSessionUser } | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string; user?: AdminSessionUser };
    if (!parsed.token || !parsed.user) return null;
    return { token: parsed.token, user: parsed.user };
  } catch {
    return null;
  }
};

export const writeAdminSession = (token: string, user: AdminSessionUser): void => {
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ token, user }));
};

export const clearAdminSession = (): void => {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const ADMIN_ROLES = ["SUPER_ADMIN", "OPERATOR", "ACCOUNTANT"] as const;

/**
 * fetch wrapper that attaches the live OTP session token and admin API key
 * so admin-internal endpoints guarded by AdminGuard accept the call.
 */
export const authedFetch = async (
  path: string,
  init: RequestInit = {},
): Promise<Response> => {
  const session = readAdminSession();
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  headers.set("x-tenant-id", "955982e7-9a09-4bf7-b2f5-a3f2e3bc3291");
  headers.set("x-admin-api-key", ADMIN_API_KEY);
  if (session?.token) {
    headers.set("authorization", `Bearer ${session.token}`);
  }
  const url = `${API_BASE}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
      signal: init.signal ?? AbortSignal.timeout(6000),
    });
  } catch (err) {
    if (!isIntentionalAbort(err)) {
      reportAdminBackendError(normalizeNetworkError(err, url));
    }
    throw err;
  }

  if (
    isBackendFailureStatus(response.status) &&
    !(await isOptionalRedisOnly503(response, url))
  ) {
    reportAdminBackendError(await parseApiErrorPayload(response, url));
  }

  return response;
};

export interface PostResult {
  ok: boolean;
  status: number;
  data: unknown;
  message?: string;
}

export const postTenantJson = async (
  path: string,
  body: unknown,
  method = "POST"
): Promise<PostResult> => {
  const url = `${API_BASE}${path}`;
  try {
    const session = readAdminSession();
    const res = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
        ...TENANT_HEADERS,
        ...(session?.token ? { authorization: `Bearer ${session.token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    });
    if (
      isBackendFailureStatus(res.status) &&
      !(await isOptionalRedisOnly503(res, url))
    ) {
      reportAdminBackendError(await parseApiErrorPayload(res, url));
    }
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const msg =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : `HTTP ${res.status}`;
      return { ok: false, status: res.status, data, message: msg };
    }
    return { ok: true, status: res.status, data };
  } catch (err: unknown) {
    if (!isIntentionalAbort(err)) {
      reportAdminBackendError(normalizeNetworkError(err, url));
    }
    const msg = err instanceof Error ? err.message : "خطای شبکه";
    return { ok: false, status: 0, data: null, message: msg };
  }
};

export const patchTenantJson = async (path: string, body?: unknown): Promise<PostResult> => {
  return postTenantJson(path, body ?? {}, "PATCH");
};

export const truncateFa = (value: unknown, max = 60): string => {
  if (typeof value !== "string") return "—";
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
};

export const faNumber = (value: number | string | bigint | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "۰";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "۰";
  return new Intl.NumberFormat("fa-IR").format(num);
};

export const str = (value: unknown): string => {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number") return String(value);
  return "—";
};

export const formatRialAsTomans = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  const strVal = String(value).replace(/[^\d]/g, "");
  if (!strVal) return "—";
  try {
    const rials = BigInt(strVal);
    const tomans = rials / 10n;
    return `${new Intl.NumberFormat("fa-IR").format(tomans)} تومان`;
  } catch {
    return "—";
  }
};

export interface SepidarOrderInput {
  orderNumber: string;
  customerName: string;
  totalAmountTomans: number;
  createdAt: string;
}

const triggerCsvDownload = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Downloads official Sepidar UTF-8 BOM CSV from backend double-entry ledger when populated,
 * falling back to dynamic Jalali/fiscal-year order journal rows without hardcoded dates.
 */
export const exportOrdersSepidarCsv = async (
  orders: SepidarOrderInput[],
): Promise<{ source: "LEDGER_DB" | "ORDERS_DYNAMIC" }> => {
  try {
    const res = await authedFetch("/v1/ledger/export/sepidar");
    if (res.ok) {
      const csvText = await res.text();
      const nonEmptyLines = csvText
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);
      if (nonEmptyLines.length > 1) {
        triggerCsvDownload(csvText, `sepidar-journal-export-${Date.now()}.csv`);
        return { source: "LEDGER_DB" };
      }
    }
  } catch {
    // Fallback cleanly to order list using dynamic Jalali calendar calculation
  }

  const rows: AccountingExportRow[] = orders.flatMap((o) => {
    const debitRials = BigInt(o.totalAmountTomans) * 10n;
    const rawDate = o.createdAt ? new Date(o.createdAt) : new Date();
    const entryDate = Number.isNaN(rawDate.getTime()) ? new Date() : rawDate;
    const jalaliDate = formatAccountingJalaliDate(entryDate);
    const fiscalPeriod = getFiscalYear(entryDate);

    return [
      {
        entryNumber: `JRN-SALE-${o.orderNumber}`,
        jalaliDate,
        isoDate: entryDate.toISOString(),
        fiscalPeriod,
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
        jalaliDate,
        isoDate: entryDate.toISOString(),
        fiscalPeriod,
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

  triggerCsvDownload(buildSepidarCsv(rows), `sepidar-export-${Date.now()}.csv`);
  return { source: "ORDERS_DYNAMIC" };
};
