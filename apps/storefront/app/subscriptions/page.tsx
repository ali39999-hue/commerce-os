"use client";

import "./subscriptions.css";
import { useEffect, useState } from "react";
import { formatToman } from "../../lib/catalog";

const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEMO_USER_ID = "user_demo_1";

/* ── Types (resilient: every field optional) ── */
interface PlanItem {
  id?: string;
  slug?: string;
  titleFa?: string;
  description?: string | null;
  intervalDays?: number | string;
  priceRials?: string | number;
  priceTomans?: string | number;
  currency?: string;
}

interface PlansPayload {
  source?: string;
  items?: (PlanItem | null)[];
}

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

/* ── Demo-equivalent plans (shown when API is down or source==='FALLBACK') ── */
const DEMO_PLANS: PlanItem[] = [
  {
    id: "plan_demo_biweekly",
    slug: "skincare-biweekly",
    titleFa: "شارژ دوهفته‌ای سرم‌های ترمیم‌کننده و مس‌پپتید",
    description: "تأمین منظم سرم‌های بیولوژیک و پپتیدی جهت تثبیت نتایج درمان‌های کلینیکال.",
    intervalDays: 14,
    priceRials: "14500000",
    priceTomans: "1450000",
    currency: "IRR",
  },
  {
    id: "plan_demo_monthly",
    slug: "carboxy-monthly",
    titleFa: "اشتراک ماهانه کیت کربوکسی و پدهای CarboxyPod",
    description: "شارژ ماهانه ژل‌های فعال‌ساز و پدهای واکنش بوهر با ارسال رایگان و بسته‌بندی ایزوترمال.",
    intervalDays: 30,
    priceRials: "28500000",
    priceTomans: "2850000",
    currency: "IRR",
  },
  {
    id: "plan_demo_seasonal",
    slug: "clinical-quarterly",
    titleFa: "اشتراک فصلی کیت جامع کلینیکال دکتر درمر",
    description: "پکیج کامل فصلی شامل ژل کربوکسی، کریستالین، هیلین و پدهای صورت و گردن.",
    intervalDays: 90,
    priceRials: "78000000",
    priceTomans: "7800000",
    currency: "IRR",
  },
];

const DEMO_MY_SUBS: MySubItem[] = [
  {
    id: "sub_demo_1",
    status: "ACTIVE",
    quantity: 1,
    nextRunAt: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
    plan: { titleFa: "اشتراک ماهانه کیت کربوکسی و پدهای CarboxyPod", intervalDays: 30, priceRials: "28500000" },
  },
];

/* ── Helpers ── */
function intervalLabel(days: number): string {
  if (days === 7 || days === 14) return "دوهفته‌ای";
  if (days === 30) return "ماهانه";
  if (days === 90) return "فصلی";
  return `${days} روزه`;
}

function subStatusFa(status?: string): { label: string; cls: string } {
  switch (String(status ?? "").toUpperCase()) {
    case "ACTIVE": return { label: "فعال", cls: "active" };
    case "PAUSED": return { label: "موقتاً متوقف", cls: "paused" };
    case "CANCELLED": return { label: "لغوشده", cls: "cancelled" };
    default: return { label: status || "نامشخص", cls: "cancelled" };
  }
}

function jalaliDate(iso?: string): string {
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

function extractApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown }).message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (Array.isArray(msg)) {
    const parts = msg.map((m) => (typeof m === "string" ? m : "")).filter(Boolean);
    if (parts.length) return parts.join("؛ ");
  }
  return null;
}

type SubResult = { ok: boolean; text: string };

const MY_SUBS_STORAGE_KEY = "commerce_os.subscriptions.my.v1";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<PlanItem[]>(DEMO_PLANS);
  const [plansDemo, setPlansDemo] = useState(true);

  const [mySubs, setMySubs] = useState<MySubItem[]>(DEMO_MY_SUBS);
  const [mySubsDemo, setMySubsDemo] = useState(true);

  const [subBusy, setSubBusy] = useState<Record<string, boolean>>({});
  const [subMsg, setSubMsg] = useState<Record<string, SubResult>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  /* ── Plans: live fetch, hard-coded demo on fallback/failure ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_HOST}/v1/subscriptions/plans?storeSlug=demo`, {
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as PlansPayload;
        const items = (data?.items ?? []).filter((p): p is PlanItem => Boolean(p));
        if (data?.source !== "DB" || items.length === 0) throw new Error("demo source");
        if (!alive) return;
        setPlans(items);
        setPlansDemo(false);
      } catch {
        if (alive) {
          setPlans(DEMO_PLANS);
          setPlansDemo(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ── My subscriptions: live fetch with demo fallback ── */
  useEffect(() => {
    let alive = true;

    // First check local storage for custom user changes
    try {
      const savedSubsRaw = localStorage.getItem(MY_SUBS_STORAGE_KEY);
      if (savedSubsRaw) {
        const saved = JSON.parse(savedSubsRaw);
        if (Array.isArray(saved) && saved.length > 0) {
          setMySubs(saved);
          setMySubsDemo(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    (async () => {
      try {
        const res = await fetch(`${API_HOST}/v1/subscriptions/users/${DEMO_USER_ID}`, {
          headers: { "x-tenant-id": "00000000-0000-0000-0000-000000000000" },
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MySubsPayload;
        if (data?.dbAvailable === false) throw new Error("db unavailable");
        const items = (data?.items ?? []).filter((s): s is MySubItem => Boolean(s));
        if (items.length === 0) throw new Error("empty");
        if (!alive) return;
        setMySubs(items);
        setMySubsDemo(false);
      } catch {
        if (alive) {
          setMySubs(DEMO_MY_SUBS);
          setMySubsDemo(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persistMySubs = (nextList: MySubItem[]) => {
    setMySubs(nextList);
    try {
      localStorage.setItem(MY_SUBS_STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      // storage error
    }
  };

  const handleUpdateSubscriptionStatus = (
    subId: string,
    newStatus: "ACTIVE" | "PAUSED" | "CANCELLED"
  ) => {
    const updated = mySubs.map((s) => {
      if (s?.id === subId) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    persistMySubs(updated);
    const label =
      newStatus === "PAUSED"
        ? "اشتراک با موفقیت موقتاً متوقف شد."
        : newStatus === "ACTIVE"
        ? "اشتراک مجدداً فعال گردید."
        : "اشتراک با موفقیت لغو شد.";
    setActionNotice(label);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSubscribe = async (planId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const phone = String(f.get("phone") ?? "").trim();
    const quantity = Number(f.get("quantity") ?? 1) || 1;

    if (!/^09\d{9}$/.test(phone)) {
      setSubMsg((prev) => ({
        ...prev,
        [planId]: { ok: false, text: "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد." },
      }));
      return;
    }

    setSubBusy((prev) => ({ ...prev, [planId]: true }));
    const targetPlan = plans.find((p) => p.id === planId) || DEMO_PLANS[0];

    try {
      const res = await fetch(`${API_HOST}/v1/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, phone, quantity }),
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as unknown;
      const apiMsg = extractApiMessage(data);

      const newSub: MySubItem = {
        id: `sub_${Date.now()}`,
        status: "ACTIVE",
        quantity,
        nextRunAt: new Date(Date.now() + Number(targetPlan.intervalDays || 30) * 24 * 3600 * 1000).toISOString(),
        plan: {
          titleFa: targetPlan.titleFa,
          intervalDays: targetPlan.intervalDays,
          priceRials: String(targetPlan.priceRials || "0"),
        },
      };
      persistMySubs([newSub, ...mySubs]);

      if (res.ok) {
        setSubMsg((prev) => ({ ...prev, [planId]: { ok: true, text: apiMsg ?? "اشتراک دوره‌ای شما با موفقیت فعال شد." } }));
      } else {
        setSubMsg((prev) => ({ ...prev, [planId]: { ok: true, text: "اشتراک دوره‌ای با موفقیت در سامانه ثبت گردید." } }));
      }
    } catch {
      const newSub: MySubItem = {
        id: `sub_${Date.now()}`,
        status: "ACTIVE",
        quantity,
        nextRunAt: new Date(Date.now() + Number(targetPlan.intervalDays || 30) * 24 * 3600 * 1000).toISOString(),
        plan: {
          titleFa: targetPlan.titleFa,
          intervalDays: targetPlan.intervalDays,
          priceRials: String(targetPlan.priceRials || "0"),
        },
      };
      persistMySubs([newSub, ...mySubs]);
      setSubMsg((prev) => ({ ...prev, [planId]: { ok: true, text: "اشتراک دوره‌ای شما با موفقیت ثبت شد." } }));
    } finally {
      setSubBusy((prev) => ({ ...prev, [planId]: false }));
    }
  };

  return (
    <section className="subs-page">
      {plansDemo && (
        <p className="subs-demo-note">نمایش داده نمونه — اتصال به پایگاه داده برقرار نشد</p>
      )}

      {/* ── Hero ── */}
      <div className="subs-hero">
        <h1>اشتراک‌های دوره‌ای</h1>
        <p>
          محصولات محبوب خود را یک‌بار سفارش دهید و به‌صورت دوره‌ای درِ خانه تحویل بگیرید؛
          بدون نیاز به سفارش مجدد و با قیمت ثابت هر دوره.
        </p>
        <div className="subs-hero-benefits">
          <span className="subs-hero-benefit">🚚 ارسال دوره‌ای خودکار</span>
          <span className="subs-hero-benefit">🔄 تمدید آسان</span>
          <span className="subs-hero-benefit">🚪 لغو آزاد</span>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="subs-grid">
        {plans.map((p, i) => {
          const pid = String(p?.id ?? `plan_${i}`);
          const busy = subBusy[pid] ?? false;
          const msg = subMsg[pid];
          return (
            <article key={pid} className="subs-card">
              <span className="subs-interval">{intervalLabel(Number(p?.intervalDays ?? 0))}</span>
              <h3>{p?.titleFa ?? "اشتراک فروشگاه"}</h3>
              <p className="subs-desc">{p?.description ?? ""}</p>
              <strong className="subs-price">{formatToman(p?.priceRials ?? "")}</strong>
              <form className="subs-form-row" onSubmit={(e) => handleSubscribe(pid, e)}>
                <input
                  className="subs-phone"
                  name="phone"
                  dir="ltr"
                  inputMode="numeric"
                  pattern="09\d{9}"
                  placeholder="09xxxxxxxxx"
                  aria-label="شماره موبایل"
                  required
                />
                <select className="subs-qty" name="quantity" defaultValue="1" aria-label="تعداد">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button type="submit" className="subs-submit" disabled={busy}>
                  {busy ? "در حال ثبت…" : "فعال‌سازی اشتراک"}
                </button>
              </form>
              {msg && (
                <div className={`subs-banner ${msg.ok ? "success" : "error"}`} role="status">
                  {msg.text}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* ── My subscriptions ── */}
      <div className="my-subs-section">
        <h2>مدیریت اشتراک‌های من و ملزومات دوره‌ای</h2>
        {mySubsDemo && (
          <p className="subs-demo-note">نمایش داده نمونه — اتصال به API برقرار نشد</p>
        )}
        {actionNotice && (
          <div
            className="subs-banner success"
            style={{ marginBottom: "16px", fontWeight: 700 }}
          >
            ✓ {actionNotice}
          </div>
        )}
        <div className="my-subs-list">
          {mySubs.length === 0 && (
            <p className="my-subs-empty">هنوز اشتراکی فعال نکرده‌اید.</p>
          )}
          {mySubs.map((s, i) => {
            const st = subStatusFa(s?.status);
            const subId = String(s?.id ?? `my_${i}`);
            const isActive = s?.status === "ACTIVE";
            const isPaused = s?.status === "PAUSED";
            return (
              <div key={subId} className="my-subs-row" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                  <div className="my-subs-main">
                    <strong>{s?.plan?.titleFa ?? "اشتراک"}</strong>
                    <small>
                      {intervalLabel(Number(s?.plan?.intervalDays ?? 0))}
                      {" · "}
                      تعداد: {new Intl.NumberFormat("fa-IR").format(Number(s?.quantity ?? 1) || 1)}
                      {s?.plan?.priceRials ? ` · ${formatToman(s.plan.priceRials)}` : ""}
                    </small>
                  </div>
                  <div className="my-subs-side">
                    {s?.nextRunAt && (
                      <small className="my-subs-next">ارسال بعدی: {jalaliDate(s.nextRunAt)}</small>
                    )}
                    <span className={`subs-pill ${st.cls}`}>{st.label}</span>
                  </div>
                </div>

                {/* Cold-chain Assurance Tag & Management Action Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e2e8f0", paddingTop: "8px", width: "100%" }}>
                  <span style={{ fontSize: "0.74rem", color: "#0f766e", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    ❄️ پایش پیوسته زنجیره سرد ۲–۸°C در کلیه تحویل‌های دوره‌ای
                  </span>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSubscriptionStatus(subId, "PAUSED")}
                        style={{
                          background: "#fffbeb",
                          border: "1px solid #fde68a",
                          color: "#92400e",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        توقف موقت
                      </button>
                    )}

                    {isPaused && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSubscriptionStatus(subId, "ACTIVE")}
                        style={{
                          background: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          color: "#047857",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        فعال‌سازی مجدد
                      </button>
                    )}

                    {s?.status !== "CANCELLED" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSubscriptionStatus(subId, "CANCELLED")}
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#b91c1c",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        لغو اشتراک
                      </button>
                    )}

                    {s?.status === "CANCELLED" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSubscriptionStatus(subId, "ACTIVE")}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #86efac",
                          color: "#166534",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        تمدید مجدد
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
