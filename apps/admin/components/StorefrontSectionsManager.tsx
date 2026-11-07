"use client";

import { useEffect, useState } from "react";
import { faNumber, authedFetch, postTenantJson } from "./types";

export interface HomepageSectionMeta {
  id: string;
  titleFa: string;
  category: "HERO" | "COMMERCE" | "SCIENCE" | "CLINICAL" | "TRUST";
  description: string;
  order: number;
}

/**
 * Canonical homepage section ids — must stay in lockstep with
 * apps/storefront/lib/storefront-sections.ts (HOMEPAGE_SECTIONS). Renamed ids
 * (e.g. the old guides id → "clinicalGuides") leave legacy rows ignored.
 */
const HOMEPAGE_SECTIONS: HomepageSectionMeta[] = [
  {
    id: "hero",
    titleFa: "بنر اصلی و هیرو بالینی (Hero Banner)",
    category: "HERO",
    description: "معرفی هویت سازمانی کمبریج، پروتکل اثر بوهر و فراخوان‌های اقدام اصلی",
    order: 1,
  },
  {
    id: "pathSelector",
    titleFa: "مسیرهای سه‌گانه تخصصی مراجعین (Path Selector)",
    category: "HERO",
    description: "تریاژ ۳ مسیره: روتین خانگی، پروتکل‌های کربوکسی و شیت‌های فعال‌ساز",
    order: 2,
  },
  {
    id: "featuredShowcase",
    titleFa: "کاتالوگ بنتوی محصولات برگزیده (Bento Featured Products)",
    category: "COMMERCE",
    description: "نمایش ۶ محصول اصلی با نشان زنجیره سرد و مشخصات فعال دارویی",
    order: 3,
  },
  {
    id: "brandFamilies",
    titleFa: "معرفی لاین‌های درمانی ReeSkin و ReeMed (Brand Families)",
    category: "COMMERCE",
    description: "تفکیک تخصصی رژیم‌های خانگی و کیت‌های بالینی مراقبت پوست",
    order: 4,
  },
  {
    id: "concernsNav",
    titleFa: "راهنمای سریع دغدغه‌های پوستی (Concerns Quick-Nav)",
    category: "COMMERCE",
    description: "دسترسی سریع بر اساس دغدغه: آکنه، لک ملاسما، جوانسازی و سد دفاعی",
    order: 5,
  },
  {
    id: "skinFinder",
    titleFa: "ابزار هوشمند انتخاب ژل کربوکسی (Skin Regimen Finder)",
    category: "COMMERCE",
    description: "فرم ۳ مرحله‌ای تشخیص ساختار پوست و پیشنهاد کیت متناظر با ثبت سفارش",
    order: 6,
  },
  {
    id: "productRail",
    titleFa: "ریل محبوب‌ترین فرمولاسیون‌های بالینی (Popular Product Rail)",
    category: "COMMERCE",
    description: "قفسه چرخشی محصولات پرفروش با فچ دینامیک از سرور و لیست علاقه‌مندی",
    order: 7,
  },
  {
    id: "scienceSpotlight",
    titleFa: "مکانیسم زیست‌شیمیایی اثر بوهر (Science Mechanism Spotlight)",
    category: "SCIENCE",
    description: "اطلس بافت‌شناسی مقطع پوست، ۴ فاز استوکیومتری و واکنش گاز CO₂",
    order: 8,
  },
  {
    id: "bohrSimulator",
    titleFa: "شبیه‌ساز تعاملی اثر بوهر (Bohr Oxygenation Simulator)",
    category: "SCIENCE",
    description: "اسلایدر دوزیمتری گاز CO₂، منحنی شیفت بوهر و اتساع مویرگ‌های درمیس",
    order: 9,
  },
  {
    id: "visiaSlider",
    titleFa: "اسلایدر مقایسه‌ای پیش و پس از درمان Visia (Before/After Slider)",
    category: "CLINICAL",
    description: "مقایسه کششی تصاویر بیماران در ملاسما، چروک، بلفاروپلاستی و آکنه",
    order: 10,
  },
  {
    id: "clinicalGuides",
    titleFa: "پروتکل‌ها و راهنماهای بالینی مصرف (Clinical Guides & Protocols)",
    category: "CLINICAL",
    description: "راهنماهای بالینی گام‌به‌گام مصرف محصولات، رتینول و مراقبت‌های پوستی",
    order: 11,
  },
  {
    id: "clinicalResults",
    titleFa: "شواهد کارآزمایی‌های بالینی و نظرات پزشکان (Clinical Results)",
    category: "TRUST",
    description: "سنجه‌های بیومدیکال، آنالیزهای کامپیوتری و نظرات متخصصین پوست",
    order: 12,
  },
  {
    id: "trustBar",
    titleFa: "نوار اعتبار سازمانی و استانداردها (Trust & Credibility Bar)",
    category: "TRUST",
    description: "نمادهای زنجیره سرد، گواهی اصالت دارو و ارسال محرمانه",
    order: 13,
  },
  {
    id: "newsletter",
    titleFa: "عضویت ویژه VIP و خبرنامه (Newsletter & VIP Club)",
    category: "TRUST",
    description: "فرم ثبت ایمیل جهت دریافت کدهای تخفیف دوره‌ای و مقالات علمی",
    order: 14,
  },
];

const SETTINGS_ENDPOINT = "/v1/settings/storefront/home-sections";
const OFFLINE_DRAFT_KEY = "commerce_os_homepage_sections_v1";
const CONFIRM_RESET_TIMEOUT_MS = 6000;

const sanitizeOverrides = (value: unknown): Record<string, boolean> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const out: Record<string, boolean> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "boolean") out[key] = entry;
  }
  return out;
};

// Offline draft only: the storefront no longer reads this key. It survives an
// API outage so the operator can re-save the same overrides once the server
// is reachable again (see the banner copy in the UI).
const readOfflineDraft = (): Record<string, boolean> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(OFFLINE_DRAFT_KEY);
    if (!raw) return null;
    const draft = sanitizeOverrides(JSON.parse(raw) as unknown);
    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
};

const writeOfflineDraft = (overrides: Record<string, boolean>): void => {
  try {
    window.localStorage.setItem(OFFLINE_DRAFT_KEY, JSON.stringify(overrides));
  } catch {
    // strict browser privacy mode — draft is best-effort only
  }
};

const clearOfflineDraft = (): void => {
  try {
    window.localStorage.removeItem(OFFLINE_DRAFT_KEY);
  } catch {
    // ignore
  }
};

const isEnabled = (overrides: Record<string, boolean>, id: string): boolean => overrides[id] !== false;

type Notice = { type: "success" | "error" | "warning"; text: string } | null;

export default function StorefrontSectionsManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const canEdit = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [serverOverrides, setServerOverrides] = useState<Record<string, boolean>>({});
  const [connection, setConnection] = useState<"LOADING" | "LIVE" | "OFFLINE">("LOADING");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const draft = readOfflineDraft();

    const load = async () => {
      setConnection("LOADING");
      try {
        const res = await authedFetch("/v1/settings/storefront");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json().catch(() => null)) as
          | { overrides?: unknown; source?: string }
          | null;
        if (cancelled) return;
        const remote = sanitizeOverrides(data?.overrides);
        setServerOverrides(remote);
        if (draft) {
          // Reconnected with a pending offline draft: stage it over the server
          // state so the operator can re-save it (banner told them to).
          setOverrides({ ...remote, ...draft });
          setDirty(true);
          setConnection("LIVE");
          setNotice({
            type: "warning",
            text: "پیش‌نویس آفلاین ذخیره‌سازی محلی بازیابی شد. برای اعمال روی سرور، دکمه «ذخیره در سرور» را بزنید.",
          });
        } else {
          setOverrides(remote);
          setDirty(false);
          setConnection("LIVE");
        }
      } catch {
        if (cancelled) return;
        setServerOverrides({});
        setOverrides(draft ? { ...draft } : {});
        setDirty(false);
        setConnection("OFFLINE");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const stagedDiffCount = HOMEPAGE_SECTIONS.filter(
    (s) => isEnabled(overrides, s.id) !== isEnabled(serverOverrides, s.id),
  ).length;

  const handleToggle = (id: string) => {
    if (!canEdit || busy || connection === "LOADING") return;
    setOverrides((prev) => ({ ...prev, [id]: !isEnabled(prev, id) }));
    setDirty(true);
    setNotice(null);
  };

  const handleBulkEnable = (enable: boolean) => {
    if (!canEdit || busy || connection === "LOADING") return;
    const next: Record<string, boolean> = {};
    for (const s of HOMEPAGE_SECTIONS) next[s.id] = enable;
    setOverrides(next);
    setDirty(true);
    setNotice(null);
  };

  const buildPayload = (): Record<string, boolean> => {
    const payload: Record<string, boolean> = {};
    for (const s of HOMEPAGE_SECTIONS) payload[s.id] = isEnabled(overrides, s.id);
    return payload;
  };

  const handleSave = async () => {
    if (!canEdit || busy || connection === "LOADING") return;
    setBusy(true);
    setNotice(null);
    const payload = buildPayload();
    const result = await postTenantJson(SETTINGS_ENDPOINT, { overrides: payload }, "PUT");
    if (result.ok) {
      const saved = sanitizeOverrides(result.data);
      const applied = Object.keys(saved).length > 0 ? saved : payload;
      setServerOverrides(applied);
      setOverrides(applied);
      setDirty(false);
      setConnection("LIVE");
      clearOfflineDraft();
      setNotice({
        type: "success",
        text: "تنظیمات ویترین در سرور ذخیره شد. پس از ذخیره، صفحه اصلی فروشگاه در بازدید بعدی به‌روزرسانی می‌شود.",
      });
    } else if (result.status === 0) {
      setConnection("OFFLINE");
      writeOfflineDraft(payload);
      setNotice({
        type: "error",
        text: "ارتباط با سرور برقرار نشد. تغییرات به‌صورت پیش‌نویس در مرورگر ذخیره شد؛ پس از اتصال به سرور دوباره ذخیره کنید.",
      });
    } else {
      setNotice({
        type: "error",
        text: result.message || `ذخیره‌سازی در سرور ناموفق بود (کد ${result.status}).`,
      });
    }
    setBusy(false);
  };

  const handleReset = async () => {
    if (!canEdit || busy || connection === "LOADING") return;
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), CONFIRM_RESET_TIMEOUT_MS);
      return;
    }
    setConfirmReset(false);
    setBusy(true);
    setNotice(null);
    const result = await postTenantJson(SETTINGS_ENDPOINT, undefined, "DELETE");
    if (result.ok) {
      setServerOverrides({});
      setOverrides({});
      setDirty(false);
      setConnection("LIVE");
      clearOfflineDraft();
      setNotice({
        type: "success",
        text: "تمام بخش‌های ویترین به حالت پیش‌فرض (فعال) بازگشتند. پس از ذخیره، صفحه اصلی فروشگاه در بازدید بعدی به‌روزرسانی می‌شود.",
      });
    } else if (result.status === 0) {
      setConnection("OFFLINE");
      clearOfflineDraft();
      setNotice({
        type: "error",
        text: "ارتباط با سرور برقرار نشد و بازنشانی ثبت نشد. پس از اتصال به سرور دوباره تلاش کنید.",
      });
    } else {
      setNotice({
        type: "error",
        text: result.message || `بازنشانی در سرور ناموفق بود (کد ${result.status}).`,
      });
    }
    setBusy(false);
  };

  const handleRetryConnection = () => {
    if (busy) return;
    setNotice(null);
    setReloadToken((token) => token + 1);
  };

  const filteredSections = HOMEPAGE_SECTIONS.filter((s) => {
    if (filterCat === "ALL") return true;
    return s.category === filterCat;
  });

  const activeCount = HOMEPAGE_SECTIONS.filter((s) => isEnabled(overrides, s.id)).length;
  const interactionsLocked = !canEdit || busy || connection === "LOADING";

  return (
    <div className="tab-pane">
      {connection === "OFFLINE" && (
        <div className="banner-offline-warning" style={{ marginBottom: "18px" }}>
          <div>
            <strong>⚠️ حالت آفلاین — ذخیره‌سازی محلی مرورگر؛ پس از اتصال به سرور دوباره ذخیره کنید.</strong>
            <div style={{ fontSize: "0.82rem", marginTop: "6px", lineHeight: 1.8 }}>
              تغییرات فعلی فقط به‌عنوان پیش‌نویس در حافظه مرورگر (localStorage) نگه‌داری می‌شوند؛ فروشگاه این پیش‌نویس را
              نمی‌خواند و صرفاً برای راحتی شماست. پس از برقراری ارتباط با سرور، دکمه «ذخیره در سرور» را بزنید تا تنظیمات
              واقعی ویترین اعمال شود.
            </div>
          </div>
          <button onClick={handleRetryConnection} disabled={busy} className="btn-retry">
            تلاش مجدد اتصال
          </button>
        </div>
      )}

      <section className="admin-section-box">
        {/* Header */}
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2>مدیریت ویترین و بخش‌های صفحه اصلی (Storefront Layout CMS)</h2>
            <small>سوییچ بخش‌های صفحه اصلی فروشگاه از طریق تنظیمات ERP؛ همه بخش‌ها به‌صورت پیش‌فرض فعال هستند.</small>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {connection === "LIVE" && <span className="badge-live">LIVE</span>}
            {connection === "OFFLINE" && <span className="badge-offline-warning">OFFLINE</span>}
            {connection === "LOADING" && <span className="status-pill pending_review">در حال دریافت تنظیمات…</span>}
            <span className="badge-live" style={{ background: "var(--brand, #1E3A2F)", color: "#FFFFFF", fontWeight: 800 }}>
              {faNumber(activeCount)} از {faNumber(HOMEPAGE_SECTIONS.length)} بخش فعال
            </span>
          </div>
        </div>

        {notice && (
          <div
            className={
              notice.type === "success"
                ? "form-feedback-success"
                : notice.type === "error"
                ? "form-feedback-error"
                : "form-feedback-error"
            }
            style={
              notice.type === "warning"
                ? {
                    background: "#FFF8E6",
                    border: "1px solid #E8C97A",
                    color: "#8A6410",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    marginBottom: "16px",
                    lineHeight: 1.8,
                  }
                : { marginBottom: "16px", lineHeight: 1.8 }
            }
            role="status"
          >
            {notice.text}
          </div>
        )}

        {/* Toolbar: filters + server persistence actions */}
        <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div className="filter-chips-group">
            <button
              type="button"
              className={`filter-chip ${filterCat === "ALL" ? "active" : ""}`}
              onClick={() => setFilterCat("ALL")}
            >
              همه بخش‌ها ({faNumber(HOMEPAGE_SECTIONS.length)})
            </button>
            <button
              type="button"
              className={`filter-chip ${filterCat === "HERO" ? "active" : ""}`}
              onClick={() => setFilterCat("HERO")}
            >
              سربرگ و تریاژ
            </button>
            <button
              type="button"
              className={`filter-chip ${filterCat === "COMMERCE" ? "active" : ""}`}
              onClick={() => setFilterCat("COMMERCE")}
            >
              کاتالوگ و محصولات
            </button>
            <button
              type="button"
              className={`filter-chip ${filterCat === "SCIENCE" ? "active" : ""}`}
              onClick={() => setFilterCat("SCIENCE")}
            >
              مکانیسم و شبیه‌سازها
            </button>
            <button
              type="button"
              className={`filter-chip ${filterCat === "CLINICAL" ? "active" : ""}`}
              onClick={() => setFilterCat("CLINICAL")}
            >
              کارآزمایی و راهنماها
            </button>
            <button
              type="button"
              className={`filter-chip ${filterCat === "TRUST" ? "active" : ""}`}
              onClick={() => setFilterCat("TRUST")}
            >
              اعتبار و خبرنامه
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {canEdit && (
              <>
                <button
                  type="button"
                  onClick={() => handleBulkEnable(true)}
                  disabled={interactionsLocked}
                  className="btn-action"
                  style={{ fontSize: "0.78rem" }}
                  title="فعال‌سازی همگانی (تا پیش از ذخیره، فقط محلی است)"
                >
                  ✓ فعال‌سازی همه
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkEnable(false)}
                  disabled={interactionsLocked}
                  className="btn-action"
                  style={{ fontSize: "0.78rem", color: "#DC2626", borderColor: "rgba(220, 38, 38, 0.3)" }}
                  title="غیرفعال‌سازی همگانی (تا پیش از ذخیره، فقط محلی است)"
                >
                  ✕ غیرفعال‌سازی همه
                </button>
                {confirmReset ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void handleReset()}
                      disabled={busy}
                      className="btn-action"
                      style={{ fontSize: "0.78rem", background: "#DC2626", color: "#FFFFFF", borderColor: "#DC2626" }}
                      title="حذف همه تنظیمات از سرور و بازگشت به حالت پیش‌فرض"
                    >
                      {busy ? "⏳ در حال بازنشانی…" : "⚠️ تایید بازنشانی روی سرور"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      disabled={busy}
                      className="btn-action"
                      style={{ fontSize: "0.78rem", background: "rgba(255, 255, 255, 0.08)", color: "var(--muted)" }}
                    >
                      انصراف
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={interactionsLocked}
                    className="btn-action"
                    style={{ fontSize: "0.78rem", background: "rgba(255, 255, 255, 0.08)", color: "var(--muted)" }}
                    title="حذف همه تنظیمات از سرور و بازگشت به حالت پیش‌فرض"
                  >
                    بازنشانی پیش‌فرض
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={interactionsLocked || (!dirty && connection === "LIVE")}
                  className="btn-action"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    background: dirty ? "var(--brand, #1E3A2F)" : "rgba(255, 255, 255, 0.08)",
                    color: dirty ? "#FFFFFF" : "var(--muted)",
                    cursor: interactionsLocked || (!dirty && connection === "LIVE") ? "not-allowed" : "pointer",
                  }}
                  title="ذخیره تغییرات در تنظیمات سرور (ERP)"
                >
                  {busy ? "⏳ در حال ذخیره…" : dirty ? `ذخیره در سرور (${faNumber(stagedDiffCount)} تغییر)` : "ذخیره در سرور"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sections Table */}
        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "70px", textAlign: "center" }}>ترتیب</th>
                <th>نام و عنوان بخش</th>
                <th>دسته‌بندی</th>
                <th>کارکرد در ویترین</th>
                <th style={{ width: "130px", textAlign: "center" }}>وضعیت در سایت</th>
                <th style={{ width: "160px", textAlign: "center" }}>سوییچ فعال/غیرفعال</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((sec) => {
                const enabled = isEnabled(overrides, sec.id);
                const changedOnServer = isEnabled(overrides, sec.id) !== isEnabled(serverOverrides, sec.id);
                return (
                  <tr key={sec.id} style={{ opacity: enabled ? 1 : 0.6 }}>
                    <td style={{ textAlign: "center" }}>
                      <span className="tabular-nums" style={{ fontWeight: 900 }}>{faNumber(sec.order)}</span>
                    </td>
                    <td className="bold">
                      <div style={{ fontSize: "0.93rem" }}>{sec.titleFa}</div>
                      <span className="muted-text" style={{ direction: "ltr", fontSize: "0.75rem", fontFamily: "monospace" }}>
                        id: #{sec.id}
                      </span>
                    </td>
                    <td>
                      <span className="category-pill">{sec.category}</span>
                    </td>
                    <td className="muted-text" style={{ fontSize: "0.82rem" }}>
                      {sec.description}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill ${enabled ? "approved pulse" : "pending_review"}`}>
                        {enabled ? "✓ فعال در سایت" : "✕ غیرفعال"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <label
                        className="toggle-switch-wrapper"
                        title={enabled ? "غیرفعال‌سازی بخش" : "فعال‌سازی بخش"}
                      >
                        <input
                          type="checkbox"
                          className="toggle-switch-input"
                          checked={enabled}
                          disabled={interactionsLocked}
                          onChange={() => handleToggle(sec.id)}
                        />
                        <span className="toggle-switch-track">
                          <span className="toggle-switch-thumb" />
                        </span>
                        <span className="toggle-switch-label-text" style={{ color: enabled ? "#059669" : "var(--muted)" }}>
                          {enabled ? "روشن" : "خاموش"}
                        </span>
                      </label>
                      {changedOnServer && (
                        <span className="badge-offline-warning" style={{ display: "inline-block", marginTop: "6px", fontSize: "0.68rem" }}>
                          ذخیره نشده
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="muted-text" style={{ fontSize: "0.8rem", marginTop: "14px", lineHeight: 1.9 }}>
          تغییر سوییچ‌ها ابتدا به‌صورت محلی ثبت می‌شود؛ با کلیک روی «ذخیره در سرور»، تنظیمات در ERP ثبت و صفحه اصلی
          فروشگاه در بازدید بعدی بازدیدکنندگان با چیدمان جدید رندر می‌شود. «بازنشانی پیش‌فرض» همه بخش‌ها را روی سرور
          فعال می‌کند و نیاز به تایید دومرحله‌ای دارد.
        </div>
      </section>
    </div>
  );
}
