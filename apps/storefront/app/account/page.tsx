"use client";

import "./loyalty.css";
import "../subscriptions/subscriptions.css";
import "./digital.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { formatToman } from "../../lib/catalog";
import { DigitalBadge } from "../../components/discovery/digital-badge";

interface StoredOrder {
  orderNumber: string;
  status: string;
  totalTomans: string;
  method: string;
  ref: string;
  placedAt: string;
}

/* ── Live orders (W14): GET /v1/orders/stores/demo-store payload ── */
interface LiveOrderRow {
  id?: string;
  orderNumber?: string;
  status?: string;
  totalAmount?: string | number;
  customerName?: string;
  createdAt?: string;
}

interface LiveOrdersPayload {
  items?: (LiveOrderRow | null)[];
  total?: number;
}

interface Address {
  id: string;
  title: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  postalAddress: string;
  isDefault: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "ANSWERED" | "CLOSED";
  createdAt: string;
}

/* ── Loyalty Club (W17) ── */
type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD";

interface LoyaltyTx {
  direction: "EARN" | "REDEEM" | "EXPIRE";
  points: number;
  description: string;
  createdAt: string;
}

interface LoyaltySummary {
  points: number;
  tier: LoyaltyTier;
  transactions: LoyaltyTx[];
}

interface LoyaltyApiPayload {
  points?: number | string;
  tier?: string;
  transactions?: Array<{
    direction?: string;
    points?: number | string;
    description?: string;
    createdAt?: string;
  } | null>;
  dbAvailable?: boolean;
}

const DEMO_LOYALTY: LoyaltySummary = {
  points: 340,
  tier: "BRONZE",
  transactions: [
    {
      direction: "EARN",
      points: 220,
      description: "خرید سفارش ORD-948102",
      createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    },
    {
      direction: "EARN",
      points: 120,
      description: "خرید سفارش ORD-948118",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
  ],
};

const TIER_FA: Record<LoyaltyTier, string> = { BRONZE: "برنزی", SILVER: "نقره‌ای", GOLD: "طلایی" };

function tierProgress(points: number, tier: LoyaltyTier): { pct: number; remaining: number | null } {
  if (tier === "GOLD") return { pct: 100, remaining: null };
  const target = tier === "BRONZE" ? 1000 : 5000;
  const pct = Math.max(0, Math.min(100, Math.round((points / target) * 100)));
  return { pct, remaining: Math.max(0, target - points) };
}

/* ── My Subscriptions ── */
interface MySubItem {
  id?: string;
  status?: string;
  quantity?: number | string;
  nextRunAt?: string;
  plan?: {
    titleFa?: string;
    intervalDays?: number | string;
    priceRials?: string;
  };
}

interface MySubsPayload {
  items?: (MySubItem | null)[];
  dbAvailable?: boolean;
}

const DEMO_MY_SUBS: MySubItem[] = [
  {
    id: "sub_demo_1",
    status: "ACTIVE",
    quantity: 1,
    nextRunAt: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
    plan: { titleFa: "اشتراک ماهانه قهوه اتیوپی", intervalDays: 30, priceRials: "18500000" },
  },
];

function subStatusFa(status?: string): { label: string; cls: string } {
  switch (String(status ?? "").toUpperCase()) {
    case "ACTIVE": return { label: "فعال", cls: "active" };
    case "PAUSED": return { label: "موقتاً متوقف", cls: "paused" };
    case "CANCELLED": return { label: "لغوشده", cls: "cancelled" };
    default: return { label: status || "نامشخص", cls: "cancelled" };
  }
}

function subIntervalLabel(days: number): string {
  if (days === 7 || days === 14) return "دوهفته‌ای";
  if (days === 30) return "ماهانه";
  if (days === 90) return "فصلی";
  return `${days} روزه`;
}

function subJalaliDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

/* ── Digital grants (W18) ── */
interface DigitalGrant {
  id?: string;
  token?: string;
  productTitle?: string;
  downloadCount?: number | string;
  maxDownloads?: number | string;
  expiresAt?: string | null;
  revokedAt?: string | null;
}

interface GrantsPayload {
  items?: (DigitalGrant | null)[];
  dbAvailable?: boolean;
}

interface DownloadPayload {
  ok?: boolean;
  downloadUrl?: string | null;
  remainingDownloads?: number | string | null;
  message?: unknown;
}

const DIGITAL_PHONE = "09123333333";

const DEMO_GRANTS: DigitalGrant[] = [
  {
    id: "grant_demo_1",
    token: "demo-token-brew-guide",
    productTitle: "کتاب الکترونیکی راهنمای جامع دم‌آوری",
    downloadCount: 1,
    maxDownloads: 5,
    expiresAt: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "grant_demo_2",
    token: "demo-token-latte-course",
    productTitle: "دوره ویدیویی لاته‌آرت",
    downloadCount: 0,
    maxDownloads: 5,
    expiresAt: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
  },
];

function grantApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown }).message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (Array.isArray(msg)) {
    const parts = msg.map((m) => (typeof m === "string" ? m : "")).filter(Boolean);
    if (parts.length) return parts.join("؛ ");
  }
  return null;
}

const ACCOUNT_ORDERS_KEY = "commerce_os.account.orders.v1";
const ACCOUNT_ADDRESSES_KEY = "commerce_os.account.addresses.v1";
const ACCOUNT_TICKETS_KEY = "commerce_os.account.tickets.v1";

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr_demo_1",
    title: "منزل",
    receiverName: "علی علوی",
    phone: "09121234567",
    province: "تهران",
    city: "تهران",
    postalCode: "1458963214",
    postalAddress: "خیابان آزادی، خیابان حبیب‌الهی، پلاک ۱۲، واحد ۴",
    isDefault: true,
  },
];

const WALLET_TXS = [
  { id: "wtx_1", title: "شارژ کیف پول از درگاه شاپرک", amount: +5_000_000, date: "۱۴۰۵/۰۸/۰۵", direction: "credit" as const },
  { id: "wtx_2", title: "کشف پاداش باشگاه مشتریان", amount: +250_000, date: "۱۴۰۵/۰۸/۰۳", direction: "credit" as const },
  { id: "wtx_3", title: "پرداخت سفارش ORD-948118", amount: -1_850_000, date: "۱۴۰۵/۰۷/۲۸", direction: "debit" as const },
];

const DEMO_ORDERS: StoredOrder[] = [
  {
    orderNumber: "ORD-948102",
    status: "DELIVERED",
    totalTomans: "3200000",
    method: "درگاه شتابی (زرین‌پال)",
    ref: "ZRP-88213450",
    placedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
  },
  {
    orderNumber: "ORD-948118",
    status: "PAID",
    totalTomans: "1850000",
    method: "درگاه شتابی (زرین‌پال)",
    ref: "ZRP-90345122",
    placedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
];

function statusFa(status: string): { label: string; cls: string } {
  switch (status) {
    case "PAID": return { label: "پرداخت‌شده — در انتظار ارسال", cls: "paid" };
    case "PROCESSING": return { label: "در حال آماده‌سازی", cls: "processing" };
    case "SHIPPED": return { label: "ارسال‌شده", cls: "shipped" };
    case "DELIVERED": return { label: "تحویل‌شده", cls: "delivered" };
    case "PENDING_REVIEW": return { label: "در انتظار بررسی فیش", cls: "processing" };
    case "PENDING_PAYMENT": return { label: "در انتظار پرداخت", cls: "processing" };
    case "REFUNDED": return { label: "مسترد شده", cls: "cancelled" };
    case "CANCELLED": return { label: "لغو شده", cls: "cancelled" };
    default: return { label: status, cls: "" };
  }
}

export default function AccountPage() {
  const [tab, setTab] = useState<"orders" | "wallet" | "loyalty" | "addresses" | "tickets" | "subscriptions" | "digital">("orders");
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });

  useEffect(() => {
    try {
      const o = JSON.parse(localStorage.getItem(ACCOUNT_ORDERS_KEY) ?? "null");
      const lastCheckout = localStorage.getItem("commerce_os.checkout.lastOrder");
      const demo: StoredOrder[] = o ?? [];
      let all = [...demo, ...DEMO_ORDERS];
      if (lastCheckout) {
        const lo = JSON.parse(lastCheckout);
        all = [{ ...lo }, ...all];
      }
      setOrders(all);
      setAddresses(JSON.parse(localStorage.getItem(ACCOUNT_ADDRESSES_KEY) ?? "null") ?? DEFAULT_ADDRESSES);
      setTickets(JSON.parse(localStorage.getItem(ACCOUNT_TICKETS_KEY) ?? "null") ?? [
        {
          id: "tkt_001",
          subject: "پیگیری زمان ارسال سفارش ORD-948102",
          message: "سلام، سفارش من کی ارسال می‌شود؟",
          status: "ANSWERED",
          createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
        },
      ]);
    } catch {
      setOrders(DEMO_ORDERS);
    }
  }, []);

  /* ── Orders (W14): live fetch from API — real orders render first, local/demo fallback kept ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiHost}/v1/orders/stores/demo-store`, {
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as LiveOrdersPayload;
        const items = (data?.items ?? []).filter((o): o is LiveOrderRow => Boolean(o?.orderNumber));
        if (items.length === 0) throw new Error("empty");
        const live: StoredOrder[] = items.map((o) => {
          let totalTomans = "0";
          try {
            totalTomans = (BigInt(String(o.totalAmount)) / 10n).toString();
          } catch { /* keep "0" on malformed amount */ }
          const placed = o.createdAt ? new Date(o.createdAt) : null;
          return {
            orderNumber: String(o.orderNumber),
            status: String(o.status ?? ""),
            totalTomans,
            method: "ثبت‌شده در سیستم",
            ref: String(o.id ?? "").slice(0, 8),
            placedAt: placed && !Number.isNaN(placed.getTime()) ? placed.toISOString() : new Date().toISOString(),
          };
        });
        if (!alive) return;
        setOrders((prev) => {
          const liveNumbers = new Set(live.map((r) => r.orderNumber));
          return [...live, ...prev.filter((p) => !liveNumbers.has(p.orderNumber))];
        });
      } catch {
        // Fallback: keep the current local/demo list untouched (byte-identical render).
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ── Loyalty Club (W17): live fetch with 4s timeout, demo fallback ── */
  const [loyalty, setLoyalty] = useState<LoyaltySummary>(DEMO_LOYALTY);
  const [loyaltyFailed, setLoyaltyFailed] = useState(false);
  const loyaltyProg = tierProgress(loyalty.points, loyalty.tier);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiHost}/v1/loyalty/users/user_demo_1`, {
          headers: { "x-tenant-id": "00000000-0000-0000-0000-000000000000" },
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as LoyaltyApiPayload;
        if (data?.dbAvailable === false) throw new Error("db unavailable");
        if (!alive) return;
        setLoyalty({
          points: Number(data?.points ?? 0) || 0,
          tier: data?.tier === "SILVER" || data?.tier === "GOLD" ? data.tier : "BRONZE",
          transactions: Array.isArray(data?.transactions)
            ? data.transactions.map((t) => ({
                direction: t?.direction === "REDEEM" || t?.direction === "EXPIRE" ? t.direction : "EARN",
                points: Number(t?.points ?? 0) || 0,
                description: String(t?.description ?? ""),
                createdAt: String(t?.createdAt ?? ""),
              }))
            : [],
        });
        setLoyaltyFailed(false);
      } catch {
        if (alive) {
          setLoyalty(DEMO_LOYALTY);
          setLoyaltyFailed(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ── My Subscriptions: live fetch with demo fallback ── */
  const [mySubs, setMySubs] = useState<MySubItem[]>(DEMO_MY_SUBS);
  const [mySubsFailed, setMySubsFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiHost}/v1/subscriptions/users/user_demo_1`, {
          headers: { "x-tenant-id": "00000000-0000-0000-0000-000000000000" },
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MySubsPayload;
        if (data?.dbAvailable === false) throw new Error("db unavailable");
        const items = (data?.items ?? []).filter((s): s is MySubItem => Boolean(s));
        if (items.length === 0) throw new Error("empty");
        if (!alive) return;
        setMySubs(items);
        setMySubsFailed(false);
      } catch {
        if (alive) {
          setMySubs(DEMO_MY_SUBS);
          setMySubsFailed(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ── Digital grants (W18): live fetch with demo fallback ── */
  const [grants, setGrants] = useState<DigitalGrant[]>(DEMO_GRANTS);
  const [grantsFailed, setGrantsFailed] = useState(false);
  const [dlBusy, setDlBusy] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiHost}/v1/digital/grants?phone=${DIGITAL_PHONE}`, {
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GrantsPayload;
        if (data?.dbAvailable === false) throw new Error("db unavailable");
        const items = (data?.items ?? []).filter((g): g is DigitalGrant => Boolean(g));
        if (items.length === 0) throw new Error("empty");
        if (!alive) return;
        setGrants(items);
        setGrantsFailed(false);
      } catch {
        if (alive) {
          setGrants(DEMO_GRANTS);
          setGrantsFailed(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleDownload = async (grant: DigitalGrant) => {
    const token = String(grant?.token ?? "").trim();
    if (!token) return;
    setDlBusy((prev) => ({ ...prev, [token]: true }));
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiHost}/v1/digital/download/${encodeURIComponent(token)}`, {
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      const data = (await res.json().catch(() => null)) as DownloadPayload | null;
      const apiMsg = grantApiMessage(data);
      if (res.ok && data?.ok && typeof data.downloadUrl === "string" && data.downloadUrl.trim()) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        alert(apiMsg ?? "دانلود در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.");
      }
    } catch {
      alert("اتصال به سرور برقرار نشد؛ لطفاً بعداً دوباره تلاش کنید.");
    } finally {
      setDlBusy((prev) => ({ ...prev, [token]: false }));
    }
  };

  const persistAddresses = (next: Address[]) => {
    setAddresses(next);
    try { localStorage.setItem(ACCOUNT_ADDRESSES_KEY, JSON.stringify(next)); } catch {}
  };

  const addAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const addr: Address = {
      id: `addr_${Date.now()}`,
      title: String(f.get("title") || "آدرس جدید"),
      receiverName: String(f.get("receiverName") || ""),
      phone: String(f.get("phone") || ""),
      province: String(f.get("province") || ""),
      city: String(f.get("city") || ""),
      postalCode: String(f.get("postalCode") || ""),
      postalAddress: String(f.get("postalAddress") || ""),
      isDefault: false,
    };
    persistAddresses([addr, ...addresses]);
    setShowAddrForm(false);
  };

  const submitTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTicket.subject.trim()) return;
    const t: Ticket = {
      id: `tkt_${Date.now()}`,
      subject: newTicket.subject,
      message: newTicket.message,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    const next = [t, ...tickets];
    setTickets(next);
    try { localStorage.setItem(ACCOUNT_TICKETS_KEY, JSON.stringify(next)); } catch {}
    setNewTicket({ subject: "", message: "" });
  };

  return (
    <section className="account-layout">
      <aside className="account-sidenav">
        <div className="account-greeting">
          <div className="account-avatar">ع</div>
          <div>
            <strong>علی علوی</strong>
            <small dir="ltr">۰۹۱۲***۴۵۶۷</small>
          </div>
        </div>
        <nav>
          <button onClick={() => setTab("orders")} className={`account-nav-btn ${tab === "orders" ? "active" : ""}`}>📦 سفارش‌های من</button>
          <button onClick={() => setTab("wallet")} className={`account-nav-btn ${tab === "wallet" ? "active" : ""}`}>💳 کیف پول</button>
          <button onClick={() => setTab("loyalty")} className={`account-nav-btn ${tab === "loyalty" ? "active" : ""}`}>🏆 باشگاه مشتریان</button>
          <button onClick={() => setTab("subscriptions")} className={`account-nav-btn ${tab === "subscriptions" ? "active" : ""}`}>🔁 اشتراک‌های من</button>
          <button onClick={() => setTab("digital")} className={`account-nav-btn ${tab === "digital" ? "active" : ""}`}>⬇ محصولات دیجیتال من</button>
          <button onClick={() => setTab("addresses")} className={`account-nav-btn ${tab === "addresses" ? "active" : ""}`}>📍 آدرس‌های من</button>
          <button onClick={() => setTab("tickets")} className={`account-nav-btn ${tab === "tickets" ? "active" : ""}`}>🎫 تیکت‌های پشتیبانی</button>
        </nav>
      </aside>

      <main className="account-content">
        {/* ── Orders ── */}
        {tab === "orders" && (
          <div className="account-pane">
            <h2>سفارش‌های من ({orders.length})</h2>
            {orders.map((o) => {
              const s = statusFa(o.status);
              return (
                <div key={o.orderNumber} className="order-history-card">
                  <div className="ohc-head">
                    <div>
                      <Link href={`/order/${o.orderNumber}`} className="ohc-number" dir="ltr">{o.orderNumber}</Link>
                      <small className="ohc-date">{new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(o.placedAt))}</small>
                    </div>
                    <span className={`status-pill ${s.cls}`}>{s.label}</span>
                  </div>
                  <div className="ohc-body">
                    <span className="ohc-method">{o.method}</span>
                    <span className="ohc-ref" dir="ltr">{o.ref}</span>
                    <strong className="ohc-amount">{formatToman(BigInt(o.totalTomans))}</strong>
                  </div>
                  <div className="ohc-actions">
                    <Link href={`/order/${o.orderNumber}`} className="btn-action">مشاهده جزئیات و فاکتور</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Wallet ── */}
        {tab === "wallet" && (
          <div className="account-pane">
            <h2>کیف پول من</h2>
            <div className="wallet-balance-card">
              <span className="wbc-label">موجودی فعلی</span>
              <strong className="wbc-amount">{new Intl.NumberFormat("fa-IR").format(3_400_000)} تومان</strong>
              <button className="btn-charge-wallet">+ شارژ کیف پول از درگاه بانکی</button>
            </div>
            <h3>تراکنش‌های اخیر</h3>
            <div className="wallet-tx-list">
              {WALLET_TXS.map((t) => (
                <div key={t.id} className="wallet-tx-row">
                  <div>
                    <strong>{t.title}</strong>
                    <small>{t.date}</small>
                  </div>
                  <span className={t.direction === "credit" ? "tx-credit" : "tx-debit"}>
                    {t.direction === "credit" ? "+" : "−"} {new Intl.NumberFormat("fa-IR").format(Math.abs(t.amount))} تومان
                  </span>
                </div>
              ))}
            </div>
            <p className="account-note">🛡️ موجودی کیف پول به‌صورت بدهی شرکت در دفترکل دوبل‌اندر (حساب ۲۰۱۰) ثبت می‌شود.</p>
          </div>
        )}

        {/* ── Loyalty Club (W17) ── */}
        {tab === "loyalty" && (
          <div className="account-pane">
            <h2>🏆 باشگاه مشتریان</h2>
            {loyaltyFailed && (
              <p className="loyalty-demo-note">نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}

            <div className="loyalty-hero">
              <div className="loyalty-hero-top">
                <div>
                  <span className="loyalty-points-label">امتیاز فعلی شما</span>
                  <strong className="loyalty-points">{new Intl.NumberFormat("fa-IR").format(loyalty.points)}</strong>
                  <small className="loyalty-points-unit">امتیاز</small>
                </div>
                <span className={`tier-pill tier-${loyalty.tier.toLowerCase()}`}>{TIER_FA[loyalty.tier]}</span>
              </div>
              <div className="tier-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loyaltyProg.pct}>
                <div className="tier-progress-fill" style={{ width: `${loyaltyProg.pct}%` }} />
              </div>
              <small className="tier-progress-caption">
                {loyaltyProg.remaining === null
                  ? "🎉 به بالاترین سطح (طلایی) رسیده‌اید"
                  : `${new Intl.NumberFormat("fa-IR").format(loyaltyProg.remaining)} امتیاز تا سطح بعد`}
              </small>
            </div>

            <h3>قوانین باشگاه مشتریان</h3>
            <div className="loyalty-rules">
              <div className="loyalty-rule-card">
                <span className="loyalty-rule-icon" aria-hidden>🛒</span>
                <strong>نحوه کسب امتیاز</strong>
                <p>هر ۱۰٬۰۰۰ تومان خرید = ۱ امتیاز</p>
              </div>
              <div className="loyalty-rule-card">
                <span className="loyalty-rule-icon" aria-hidden>🥇</span>
                <strong>سطوح و مزایا</strong>
                <p>سطوح برنزی/نقره‌ای/طلایی و پاداش‌ها</p>
              </div>
              <div className="loyalty-rule-card">
                <span className="loyalty-rule-icon" aria-hidden>⏳</span>
                <strong>انقضای امتیاز</strong>
                <p>امتیازها تا پایان سال مالی معتبرند</p>
              </div>
            </div>

            <h3>تاریخچه امتیازها</h3>
            <div className="loyalty-history">
              {loyalty.transactions.length === 0 && (
                <p className="loyalty-history-empty">هنوز تراکنشی ثبت نشده است.</p>
              )}
              {loyalty.transactions.map((t, i) => (
                <div key={`${i}-${t.createdAt}`} className="loyalty-tx-row">
                  <div className="loyalty-tx-main">
                    <span className={`loyalty-tx-icon ${t.direction === "EARN" ? "earn" : "spend"}`} aria-hidden>
                      {t.direction === "EARN" ? "＋" : t.direction === "REDEEM" ? "－" : "⌛"}
                    </span>
                    <div className="loyalty-tx-desc">
                      <strong>{t.description || (t.direction === "EARN" ? "کسب امتیاز" : t.direction === "REDEEM" ? "خرج امتیاز" : "انقضای امتیاز")}</strong>
                      <small>{formatJalaliDateTime(t.createdAt) || "—"}</small>
                    </div>
                  </div>
                  <span className={t.direction === "EARN" ? "loyalty-points-earn" : "loyalty-points-spend"}>
                    {t.direction === "EARN" ? "+" : "−"} {new Intl.NumberFormat("fa-IR").format(Math.abs(t.points))} امتیاز
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── My Subscriptions ── */}
        {tab === "subscriptions" && (
          <div className="account-pane">
            <h2>🔁 اشتراک‌های من</h2>
            {mySubsFailed && (
              <p className="subs-demo-note">نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            <div className="my-subs-list">
              {mySubs.map((s, i) => {
                const st = subStatusFa(s?.status);
                return (
                  <div key={String(s?.id ?? `my_${i}`)} className="my-subs-row">
                    <div className="my-subs-main">
                      <strong>{s?.plan?.titleFa ?? "اشتراک"}</strong>
                      <small>
                        {subIntervalLabel(Number(s?.plan?.intervalDays ?? 0))}
                        {" · "}
                        تعداد: {new Intl.NumberFormat("fa-IR").format(Number(s?.quantity ?? 1) || 1)}
                        {s?.plan?.priceRials ? ` · ${formatToman(s.plan.priceRials)}` : ""}
                      </small>
                    </div>
                    <div className="my-subs-side">
                      {s?.nextRunAt && (
                        <small>ارسال بعدی: {subJalaliDate(s.nextRunAt)}</small>
                      )}
                      <span className={`subs-pill ${st.cls}`}>{st.label}</span>
                      <Link href="/subscriptions" className="subs-manage-link">مدیریت اشتراک‌ها</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Digital grants (W18) ── */}
        {tab === "digital" && (
          <div className="account-pane">
            <h2>⬇ محصولات دیجیتال من</h2>
            {grantsFailed && (
              <p className="digital-demo-note">نمایش داده نمونه — اتصال به API برقرار نشد</p>
            )}
            <div className="digital-list">
              {grants.length === 0 && (
                <p className="digital-demo-note">هنوز محصول دیجیتالی برای شما صادر نشده است.</p>
              )}
              {grants.map((g, i) => {
                const used = Math.max(0, Number(g?.downloadCount ?? 0) || 0);
                const max = Math.max(used, Number(g?.maxDownloads ?? 0) || 0);
                const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
                const remaining = Math.max(0, max - used);
                const revoked = Boolean(g?.revokedAt);
                const token = String(g?.token ?? "");
                const busy = dlBusy[token] ?? false;
                return (
                  <div key={String(g?.id ?? token ?? `grant_${i}`)} className="digital-row">
                    <div className="digital-main">
                      <div className="digital-title-row">
                        <strong>{g?.productTitle ?? "محصول دیجیتال"}</strong>
                        <DigitalBadge />
                      </div>
                      <small className="grant-meta">
                        <span>انقضا: {subJalaliDate(g?.expiresAt ?? undefined)}</span>
                        <span
                          className="dl-progress"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={pct}
                        >
                          <span className="dl-progress-fill" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="dl-caption">
                          {new Intl.NumberFormat("fa-IR").format(used)} از {new Intl.NumberFormat("fa-IR").format(max)} دانلود
                          {" · "}
                          {new Intl.NumberFormat("fa-IR").format(remaining)} باقی‌مانده
                        </span>
                      </small>
                    </div>
                    <button
                      type="button"
                      className={`dl-btn ${revoked ? "revoked" : ""}`}
                      disabled={revoked || busy || !token}
                      onClick={() => handleDownload(g)}
                    >
                      {revoked ? "لغو شده" : busy ? "در حال آماده‌سازی…" : "دانلود"}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="account-note">⬇ فایل‌های دیجیتال بلافاصله پس از زدن «دانلود» در تب جدید باز می‌شوند.</p>
          </div>
        )}

        {/* ── Addresses ── */}
        {tab === "addresses" && (
          <div className="account-pane">
            <div className="pane-head-row">
              <h2>آدرس‌های من ({addresses.length})</h2>
              <button onClick={() => setShowAddrForm(!showAddrForm)} className="btn-action">+ افزودن آدرس جدید</button>
            </div>

            {showAddrForm && (
              <form onSubmit={addAddress} className="address-form">
                <div className="form-grid">
                  <label className="form-field"><span>عنوان (خانه/محل کار)</span><input name="title" required className="input-text" /></label>
                  <label className="form-field"><span>نام تحویل‌گیرنده</span><input name="receiverName" required className="input-text" /></label>
                  <label className="form-field"><span>موبایل</span><input name="phone" required dir="ltr" pattern="09\d{9}" className="input-text" /></label>
                  <label className="form-field"><span>استان</span><input name="province" required className="input-text" /></label>
                  <label className="form-field"><span>شهر</span><input name="city" required className="input-text" /></label>
                  <label className="form-field"><span>کد پستی ۱۰ رقمی</span><input name="postalCode" required dir="ltr" pattern="\d{10}" className="input-text" /></label>
                </div>
                <label className="form-field full-width"><span>نشانی کامل</span><textarea name="postalAddress" required rows={2} className="input-textarea" /></label>
                <button type="submit" className="btn-purchase-action">ذخیره آدرس</button>
              </form>
            )}

            {addresses.map((a) => (
              <div key={a.id} className="address-card">
                <div className="addr-head">
                  <strong>{a.title} {a.isDefault && <span className="default-badge">پیش‌فرض</span>}</strong>
                  <button
                    onClick={() => persistAddresses(addresses.filter((x) => x.id !== a.id))}
                    className="btn-remove"
                    aria-label="حذف آدرس"
                  >✕</button>
                </div>
                <p>{a.province}، {a.city} — {a.postalAddress}</p>
                <small>گیرنده: {a.receiverName} · موبایل: <span dir="ltr">{a.phone}</span> · کدپستی: <span dir="ltr">{a.postalCode}</span></small>
              </div>
            ))}
          </div>
        )}

        {/* ── Tickets ── */}
        {tab === "tickets" && (
          <div className="account-pane">
            <h2>تیکت‌های پشتیبانی</h2>
            <form onSubmit={submitTicket} className="ticket-form">
              <label className="form-field"><span>موضوع تیکت</span>
                <input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} required className="input-text" placeholder="مثال: پیگیری مرجوعی سفارش..." />
              </label>
              <label className="form-field"><span>شرح درخواست</span>
                <textarea value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} rows={3} className="input-textarea" />
              </label>
              <button type="submit" className="btn-purchase-action">ثبت تیکت</button>
            </form>

            {tickets.map((t) => (
              <div key={t.id} className="ticket-card">
                <div className="ticket-head">
                  <strong>{t.subject}</strong>
                  <span className={`status-pill ${t.status === "OPEN" ? "processing" : t.status === "ANSWERED" ? "shipped" : "delivered"}`}>
                    {t.status === "OPEN" ? "در حال بررسی" : t.status === "ANSWERED" ? "پاسخ داده شد" : "بسته شده"}
                  </span>
                </div>
                <p>{t.message}</p>
                <small>{new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(t.createdAt))}</small>
              </div>
            ))}
          </div>
        )}
      </main>
    </section>
  );
}
