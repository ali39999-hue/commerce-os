"use client";

import "./loyalty.css";
import "../subscriptions/subscriptions.css";
import "./digital.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatJalaliDateTime, validateNationalId, toAsciiDigits } from "@commerce-os/localization";
import { formatToman } from "../../lib/catalog";
import { DigitalBadge } from "../../components/discovery/digital-badge";

interface StoredOrder {
  orderNumber: string;
  status: string;
  totalTomans: string;
  method: string;
  ref: string;
  placedAt: string;
  customerName?: string;
  customerPhone?: string;
  nationalCode?: string | null;
  address?: string;
  shippingMethod?: string;
  deliverySlot?: string;
  trackingCode?: string;
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

interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  nationalCode: string;
  skinType: "DRY" | "OILY" | "COMBINATION" | "SENSITIVE" | "NORMAL";
  skinConcerns: string[];
  clinicCustomer: boolean;
}

interface SkincareRegimen {
  stepName: string;
  productTitle: string;
  frequency: string;
  instructions: string;
  timeOfDay: "MORNING" | "NIGHT" | "BOTH";
}

interface ConsultationBooking {
  id: string;
  specialistName: string;
  dateJalali: string;
  timeSlot: string;
  concern: string;
  status: "CONFIRMED" | "COMPLETED" | "PENDING";
  meetingLink?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: "علی علوی",
  phone: "09121234567",
  email: "ali.alavi@example.com",
  nationalCode: "0010312013",
  skinType: "COMBINATION",
  skinConcerns: ["لک و تیرگی", "خشکی فصلی", "خطوط ریز دور چشم"],
  clinicCustomer: true,
};

const DEMO_REGIMEN: SkincareRegimen[] = [
  {
    stepName: "مرحله ۱: پاکسازی ترابافتی",
    productTitle: "فوم پاک‌کننده آمینواسیدی ReeSkin Gentle Cleanser",
    frequency: "روزانه (صبح و شب)",
    instructions: "پوست را با آب ولرم مرطوب کرده، ۱ پمپ فوم را ماساژ داده و آبکشی نمایید.",
    timeOfDay: "BOTH",
  },
  {
    stepName: "مرحله ۲: کربوکسی‌تراپی و اکسیژن‌رسانی عمیق",
    productTitle: "ژل فعال‌ساز Carboxy CO2 و ساشه بیوتکنولوژی",
    frequency: "هفته‌ای ۱ الی ۲ بار",
    instructions: "ژل را یکنواخت پخش کرده، پد کربوکسی را قرار دهید تا اثر بوهر فعال شود (۲۰ دقیقه).",
    timeOfDay: "NIGHT",
  },
  {
    stepName: "مرحله ۳: ترمیم سد دفاعی و پپتید",
    productTitle: "کرم بازسازی‌کننده حاوی سرامید و فاکتور رشد EGF",
    frequency: "هر شب پس از کربوکسی",
    instructions: "به آرامی با ضربات ملایم روی پوست صورت و گردن ماساژ دهید.",
    timeOfDay: "NIGHT",
  },
  {
    stepName: "مرحله ۴: محافظت فوتوپروتکشن بالینی",
    productTitle: "ضدآفتاب مینرال SPF 50 بدون رنگ ReeMed Clinical",
    frequency: "هر روز صبح و تجدید هر ۲ ساعت",
    instructions: "حداقل دو بند انگشت روی پوست تمیز استفاده شود.",
    timeOfDay: "MORNING",
  },
];

const DEMO_CONSULTATIONS: ConsultationBooking[] = [
  {
    id: "cns_801",
    specialistName: "دکتر مریم شریفی (متخصص درماتولوژی بالینی)",
    dateJalali: "۱۴۰۵/۰۸/۱۵",
    timeSlot: "ساعت ۱۷:۳۰ الی ۱۸:۰۰",
    concern: "بررسی پروتکل درمان لک‌های پس از آکنه و تجویز CarboxyGel",
    status: "CONFIRMED",
    meetingLink: "https://meet.drdermer.ir/room/cns-801",
  },
  {
    id: "cns_740",
    specialistName: "دکتر کامران رحیمی (مشاور علمی ReeMed)",
    dateJalali: "۱۴۰۵/۰۷/۲۰",
    timeSlot: "ساعت ۱۱:۰۰ الی ۱۱:۳۰",
    concern: "تنظیم روتین پوست مختلط و پیشگیری از هایپرپیگمنتیشن",
    status: "COMPLETED",
  },
];

const ACCOUNT_PROFILE_KEY = "commerce_os.account.profile.v1";
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
    method: "درگاه شتابی (سامان)",
    ref: "SEP-88213450",
    placedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    trackingCode: "POST-94810299IR",
    shippingMethod: "POST_PISHTAZ",
    address: "تهران، خیابان آزادی، پلاک ۱۲",
  },
  {
    orderNumber: "ORD-948118",
    status: "SHIPPED",
    totalTomans: "1850000",
    method: "درگاه شتابی (زرین‌پال)",
    ref: "ZRP-90345122",
    placedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    trackingCode: "TPX-84729103",
    shippingMethod: "TIPAX",
    address: "تهران، خیابان آزادی، پلاک ۱۲",
  },
];

function statusFa(status: string): { label: string; cls: string } {
  switch (status) {
    case "PAID": return { label: "پرداخت‌شده — تخصیص انبار", cls: "paid" };
    case "PROCESSING": return { label: "در حال آماده‌سازی و بسته‌بندی", cls: "processing" };
    case "SHIPPED": return { label: "ارسال‌شده به پست/تیپاکس", cls: "shipped" };
    case "DELIVERED": return { label: "تحویل قطعی به مشتری", cls: "delivered" };
    case "PENDING_REVIEW": return { label: "در انتظار بررسی فیش واریزی", cls: "processing" };
    case "PENDING_PAYMENT": return { label: "در انتظار پرداخت", cls: "processing" };
    case "REFUNDED": return { label: "مسترد شده", cls: "cancelled" };
    case "CANCELLED": return { label: "لغو شده", cls: "cancelled" };
    default: return { label: status, cls: "" };
  }
}

export default function AccountPage() {
  const [tab, setTab] = useState<
    "profile" | "orders" | "wallet" | "regimen" | "addresses" | "tickets" | "loyalty"
  >("profile");

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });
  const [newConsultationConcern, setNewConsultationConcern] = useState("");
  const [consultations, setConsultations] = useState<ConsultationBooking[]>(DEMO_CONSULTATIONS);

  useEffect(() => {
    try {
      const p = localStorage.getItem(ACCOUNT_PROFILE_KEY);
      if (p) setProfile(JSON.parse(p));

      const o = JSON.parse(localStorage.getItem(ACCOUNT_ORDERS_KEY) ?? "null");
      const lastCheckout = localStorage.getItem("commerce_os.checkout.lastOrder");
      const demo: StoredOrder[] = o ?? [];
      let all = [...demo, ...DEMO_ORDERS];
      if (lastCheckout) {
        const lo = JSON.parse(lastCheckout);
        all = [{ ...lo }, ...all.filter((x) => x.orderNumber !== lo.orderNumber)];
      }
      setOrders(all);
      setAddresses(JSON.parse(localStorage.getItem(ACCOUNT_ADDRESSES_KEY) ?? "null") ?? DEFAULT_ADDRESSES);
      setTickets(
        JSON.parse(localStorage.getItem(ACCOUNT_TICKETS_KEY) ?? "null") ?? [
          {
            id: "tkt_001",
            subject: "پیگیری زمان ارسال سفارش کربوکسی‌تراپی",
            message: "سلام، زمان دقیق تحویل مرسوله پیشتاز را بفرمایید.",
            status: "ANSWERED",
            createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
          },
        ]
      );
    } catch {
      setOrders(DEMO_ORDERS);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    const cleanNational = toAsciiDigits(profile.nationalCode);
    if (!validateNationalId(cleanNational)) {
      setProfileError("کد ملی وارد شده با الگوریتم کنترلی ممیزی ۱۱ معتبر نمی‌باشد.");
      return;
    }

    try {
      localStorage.setItem(ACCOUNT_PROFILE_KEY, JSON.stringify({ ...profile, nationalCode: cleanNational }));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      // storage error
    }
  };

  const persistAddresses = (next: Address[]) => {
    setAddresses(next);
    try {
      localStorage.setItem(ACCOUNT_ADDRESSES_KEY, JSON.stringify(next));
    } catch {}
  };

  const addAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const addr: Address = {
      id: `addr_${Date.now()}`,
      title: String(f.get("title") || "آدرس جدید"),
      receiverName: String(f.get("receiverName") || profile.fullName),
      phone: String(f.get("phone") || profile.phone),
      province: String(f.get("province") || "تهران"),
      city: String(f.get("city") || "تهران"),
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
    try {
      localStorage.setItem(ACCOUNT_TICKETS_KEY, JSON.stringify(next));
    } catch {}
    setNewTicket({ subject: "", message: "" });
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultationConcern.trim()) return;
    const newBook: ConsultationBooking = {
      id: `cns_${Date.now().toString().slice(-4)}`,
      specialistName: "دکتر مریم شریفی (درماتولوژی بالینی)",
      dateJalali: "۱۴۰۵/۰۸/۲۲",
      timeSlot: "ساعت ۱۸:۰۰ الی ۱۸:۳۰",
      concern: newConsultationConcern,
      status: "PENDING",
      meetingLink: "https://meet.drdermer.ir/room/cns-new",
    };
    setConsultations([newBook, ...consultations]);
    setNewConsultationConcern("");
    alert("درخواست نوبت ویزیت تخصصی شما ثبت و پیامک تأیید ارسال گردید.");
  };

  return (
    <section className="account-layout">
      {/* Sidenav Navigation */}
      <aside className="account-sidenav">
        <div className="account-greeting">
          <div className="account-avatar">
            {profile.fullName.slice(0, 1) || "ک"}
          </div>
          <div>
            <strong>{profile.fullName || "کاربر گرامی"}</strong>
            <small dir="ltr">{profile.phone}</small>
          </div>
        </div>

        <nav>
          <button
            onClick={() => setTab("profile")}
            className={`account-nav-btn ${tab === "profile" ? "active" : ""}`}
          >
            👤 پروفایل و کد ملی
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`account-nav-btn ${tab === "orders" ? "active" : ""}`}
          >
            📦 سفارش‌ها و رهگیری پستی ({orders.length})
          </button>
          <button
            onClick={() => setTab("regimen")}
            className={`account-nav-btn ${tab === "regimen" ? "active" : ""}`}
          >
            🌿 رژیم پوستی و نوبت مشاوره
          </button>
          <button
            onClick={() => setTab("wallet")}
            className={`account-nav-btn ${tab === "wallet" ? "active" : ""}`}
          >
            💳 کیف پول و اعتبار مالی
          </button>
          <button
            onClick={() => setTab("addresses")}
            className={`account-nav-btn ${tab === "addresses" ? "active" : ""}`}
          >
            📍 آدرس‌های ذخیره‌شده ({addresses.length})
          </button>
          <button
            onClick={() => setTab("tickets")}
            className={`account-nav-btn ${tab === "tickets" ? "active" : ""}`}
          >
            🎫 تیکت‌های پشتیبانی ({tickets.length})
          </button>
          <button
            onClick={() => setTab("loyalty")}
            className={`account-nav-btn ${tab === "loyalty" ? "active" : ""}`}
          >
            🏆 باشگاه مشتریان و امتیازات
          </button>
          <Link
            href="/subscriptions"
            className="account-nav-btn"
            style={{ textDecoration: "none" }}
          >
            🔄 اشتراک‌های دوره‌ای و شارژ ملزومات
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="account-content">
        {/* TAB 1: Profile & National Code */}
        {tab === "profile" && (
          <div className="account-pane">
            <h2>پروفایل کاربری و احراز هویت شاهکار</h2>
            <p className="account-note">
              ثبت کد ملی جهت صدور فاکتور رسمی مالیاتی و استعلام شاهکار الزامی است.
            </p>

            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="form-grid">
                <label className="form-field">
                  <span>نام و نام خانوادگی کامل *</span>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    required
                    className="input-text"
                  />
                </label>

                <label className="form-field">
                  <span>شماره موبایل فعال (تطبیق با شاهکار) *</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    dir="ltr"
                    required
                    className="input-text"
                  />
                </label>

                <label className="form-field">
                  <span>کد ملی ۱۰ رقمی (تطبیق با ممیزی ۱۱) *</span>
                  <input
                    type="text"
                    value={profile.nationalCode}
                    onChange={(e) => setProfile({ ...profile, nationalCode: e.target.value })}
                    dir="ltr"
                    maxLength={10}
                    required
                    className="input-text"
                  />
                </label>

                <label className="form-field">
                  <span>پست الکترونیک</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    dir="ltr"
                    className="input-text"
                  />
                </label>

                <label className="form-field">
                  <span>تیپ پوستی بالینی:</span>
                  <select
                    value={profile.skinType}
                    onChange={(e) =>
                      setProfile({ ...profile, skinType: e.target.value as any })
                    }
                    className="input-text select-box"
                  >
                    <option value="DRY">خشک و کم‌آب (Dry/Dehydrated)</option>
                    <option value="OILY">چرب و مستعد آکنه (Oily/Acne-prone)</option>
                    <option value="COMBINATION">مختلط (Combination)</option>
                    <option value="SENSITIVE">حساس و روزاسه (Sensitive/Rosacea)</option>
                    <option value="NORMAL">معمولی و نرمال (Normal)</option>
                  </select>
                </label>
              </div>

              {profileError && <div className="error-banner">{profileError}</div>}
              {profileSaved && (
                <div className="success-banner">✓ اطلاعات با موفقیت در پایگاه داده ذخیره شد.</div>
              )}

              <button type="submit" className="btn-purchase-action">
                ذخیره تغییرات پروفایل
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Orders with Live Tracking */}
        {tab === "orders" && (
          <div className="account-pane">
            <h2>سفارش‌های من و رهگیری لحظه‌ای ({orders.length})</h2>

            {orders.map((o) => {
              const s = statusFa(o.status);
              const trackingCode = o.trackingCode || `POST-${o.orderNumber.replace(/\D/g, "").slice(0, 8)}IR`;
              return (
                <div key={o.orderNumber} className="order-history-card">
                  <div className="ohc-head">
                    <div>
                      <Link href={`/order/${o.orderNumber}`} className="ohc-number" dir="ltr">
                        {o.orderNumber}
                      </Link>
                      <small className="ohc-date">
                        {new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(o.placedAt))}
                      </small>
                    </div>
                    <span className={`status-pill ${s.cls}`}>{s.label}</span>
                  </div>

                  <div className="ohc-body">
                    <span className="ohc-method">روش: {o.method}</span>
                    <span className="ohc-ref" dir="ltr">
                      پیگیری: {o.ref}
                    </span>
                    <strong className="ohc-amount">
                      {formatToman(BigInt(o.totalTomans) * 10n)}
                    </strong>
                  </div>

                  {/* Active Shipping Tracking Box */}
                  <div className="ohc-tracking-row">
                    <span>کد رهگیری پستی / تیپاکس:</span>
                    <strong dir="ltr">{trackingCode}</strong>
                    <span className="tracking-status-hint">
                      {o.status === "DELIVERED"
                        ? "✓ تحویل داده شده"
                        : "مرسوله در مرکز تفکیک مبادلات پستی"}
                    </span>
                  </div>

                  <div className="ohc-actions">
                    <Link href={`/order/${o.orderNumber}`} className="btn-action">
                      مشاهده فاکتور رسمی و پیگیری
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: Skincare Regimen & Consultations */}
        {tab === "regimen" && (
          <div className="account-pane">
            <h2>رژیم پوستی اختصاصی و مشاوره‌های بالینی</h2>
            <p className="account-note">
              پروتکل نسخه خانگی تدوین‌شده توسط متخصصین درماتولوژی دکتر درمر بر پایه کربوکسی‌تراپی و
              اثر بوهر.
            </p>

            <div className="regimen-steps-grid">
              {DEMO_REGIMEN.map((r, idx) => (
                <div key={idx} className="regimen-card">
                  <div className="regimen-header">
                    <span className="regimen-badge">{r.timeOfDay === "NIGHT" ? "🌙 شب" : r.timeOfDay === "MORNING" ? "☀️ صبح" : "☀️🌙 صبح و شب"}</span>
                    <strong>{r.stepName}</strong>
                  </div>
                  <h4>{r.productTitle}</h4>
                  <div className="regimen-meta">
                    <span>تکرار: {r.frequency}</span>
                    <p>{r.instructions}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="sub-heading">نوبت‌های مشاوره تخصصی پوست و نسخه</h3>
            <div className="consultations-list">
              {consultations.map((c) => (
                <div key={c.id} className="consultation-card">
                  <div className="cns-head">
                    <div>
                      <strong>{c.specialistName}</strong>
                      <small>{c.dateJalali} | {c.timeSlot}</small>
                    </div>
                    <span className={`status-pill ${c.status === "CONFIRMED" ? "paid" : "delivered"}`}>
                      {c.status === "CONFIRMED" ? "تأیید شده (آنلاین)" : "انجام شده"}
                    </span>
                  </div>
                  <p className="cns-concern">دغدغه و علت مشاوره: {c.concern}</p>
                  {c.meetingLink && c.status === "CONFIRMED" && (
                    <a
                      href={c.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-join-room"
                    >
                      ورود به اتاق ویزیت تصویری در زمان مقرر ←
                    </a>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleBookConsultation} className="book-consultation-box">
              <h4>درخواست مشاوره تصویری جدید</h4>
              <textarea
                value={newConsultationConcern}
                onChange={(e) => setNewConsultationConcern(e.target.value)}
                rows={2}
                placeholder="شرح نوع عارضه پوستی، سابقه مصرف کربوکسی‌تراپی یا سوال تخصصی…"
                className="input-textarea"
                required
              />
              <button type="submit" className="btn-purchase-action">
                رزرو نوبت مشاوره با متخصص درماتولوژی
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Wallet */}
        {tab === "wallet" && (
          <div className="account-pane">
            <h2>کیف پول من و اعتبار ریالی</h2>
            <div className="wallet-balance-card">
              <span className="wbc-label">موجودی فعلی قابل برداشت / خرید</span>
              <strong className="wbc-amount">
                {new Intl.NumberFormat("fa-IR").format(3_400_000)} تومان
              </strong>
              <button className="btn-charge-wallet">+ شارژ آنلاین کیف پول از درگاه شاپرک</button>
            </div>

            <h3>تراکنش‌های اخیر کیف پول</h3>
            <div className="wallet-tx-list">
              {WALLET_TXS.map((t) => (
                <div key={t.id} className="wallet-tx-row">
                  <div>
                    <strong>{t.title}</strong>
                    <small>{t.date}</small>
                  </div>
                  <span className={t.direction === "credit" ? "tx-credit" : "tx-debit"}>
                    {t.direction === "credit" ? "+" : "−"}{" "}
                    {new Intl.NumberFormat("fa-IR").format(Math.abs(t.amount))} تومان
                  </span>
                </div>
              ))}
            </div>
            <p className="account-note">
              🛡️ تراکنش‌های کیف پول در چارچوب دفترکل دوبل‌اندر (حساب ۲۰۱۰ بستانکاران) سند می‌خورند.
            </p>
          </div>
        )}

        {/* TAB 5: Addresses */}
        {tab === "addresses" && (
          <div className="account-pane">
            <div className="pane-head-row">
              <h2>آدرس‌های ذخیره‌شده من ({addresses.length})</h2>
              <button onClick={() => setShowAddrForm(!showAddrForm)} className="btn-action">
                + افزودن آدرس جدید
              </button>
            </div>

            {showAddrForm && (
              <form onSubmit={addAddress} className="address-form">
                <div className="form-grid">
                  <label className="form-field">
                    <span>عنوان آدرس (خانه، کلینیک، مطب)</span>
                    <input name="title" required className="input-text" />
                  </label>
                  <label className="form-field">
                    <span>نام و نام خانوادگی تحویل‌گیرنده</span>
                    <input name="receiverName" defaultValue={profile.fullName} required className="input-text" />
                  </label>
                  <label className="form-field">
                    <span>شماره موبایل</span>
                    <input name="phone" defaultValue={profile.phone} required dir="ltr" className="input-text" />
                  </label>
                  <label className="form-field">
                    <span>استان</span>
                    <input name="province" defaultValue="تهران" required className="input-text" />
                  </label>
                  <label className="form-field">
                    <span>شهر</span>
                    <input name="city" defaultValue="تهران" required className="input-text" />
                  </label>
                  <label className="form-field">
                    <span>کد پستی ۱۰ رقمی</span>
                    <input name="postalCode" required dir="ltr" maxLength={10} className="input-text" />
                  </label>
                </div>
                <label className="form-field full-width">
                  <span>نشانی پستی دقیق</span>
                  <textarea name="postalAddress" required rows={2} className="input-textarea" />
                </label>
                <button type="submit" className="btn-purchase-action">
                  ذخیره آدرس جدید
                </button>
              </form>
            )}

            {addresses.map((a) => (
              <div key={a.id} className="address-card">
                <div className="addr-head">
                  <strong>
                    {a.title} {a.isDefault && <span className="default-badge">پیش‌فرض</span>}
                  </strong>
                  <button
                    onClick={() => persistAddresses(addresses.filter((x) => x.id !== a.id))}
                    className="btn-remove"
                    aria-label="حذف آدرس"
                  >
                    ✕
                  </button>
                </div>
                <p>
                  {a.province}، {a.city} — {a.postalAddress}
                </p>
                <small>
                  گیرنده: {a.receiverName} · موبایل: <span dir="ltr">{a.phone}</span> · کدپستی:{" "}
                  <span dir="ltr">{a.postalCode}</span>
                </small>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: Tickets */}
        {tab === "tickets" && (
          <div className="account-pane">
            <h2>تیکت‌های پشتیبانی علمی و فنی</h2>
            <form onSubmit={submitTicket} className="ticket-form">
              <label className="form-field">
                <span>موضوع تیکت</span>
                <input
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  required
                  className="input-text"
                  placeholder="مثال: سوال در خصوص میزان مصرف CarboxyGel..."
                />
              </label>
              <label className="form-field">
                <span>شرح پیام</span>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  rows={3}
                  className="input-textarea"
                />
              </label>
              <button type="submit" className="btn-purchase-action">
                ارسال تیکت جدید
              </button>
            </form>

            {tickets.map((t) => (
              <div key={t.id} className="ticket-card">
                <div className="ticket-head">
                  <strong>{t.subject}</strong>
                  <span
                    className={`status-pill ${
                      t.status === "OPEN"
                        ? "processing"
                        : t.status === "ANSWERED"
                        ? "shipped"
                        : "delivered"
                    }`}
                  >
                    {t.status === "OPEN"
                      ? "در حال بررسی"
                      : t.status === "ANSWERED"
                      ? "پاسخ داده شد"
                      : "بسته شده"}
                  </span>
                </div>
                <p>{t.message}</p>
                <small>
                  {new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(t.createdAt))}
                </small>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: Loyalty */}
        {tab === "loyalty" && (
          <div className="account-pane">
            <h2>🏆 باشگاه مشتریان و سلامت پوست</h2>
            <div className="loyalty-hero">
              <div className="loyalty-hero-top">
                <div>
                  <span className="loyalty-points-label">امتیاز فعلی شما</span>
                  <strong className="loyalty-points">
                    {new Intl.NumberFormat("fa-IR").format(680)}
                  </strong>
                  <small className="loyalty-points-unit">امتیاز سلامت</small>
                </div>
                <span className="tier-pill tier-silver">سطح نقره‌ای</span>
              </div>
              <div
                className="tier-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={68}
              >
                <div className="tier-progress-fill" style={{ width: "68%" }} />
              </div>
              <small className="tier-progress-caption">
                ۳۲۰ امتیاز تا ارتقا به سطح طلایی (تخفیف دائمی ۱۵٪ کلینیکال)
              </small>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}
