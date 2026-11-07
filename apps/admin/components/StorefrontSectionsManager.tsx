"use client";

import { useState, useEffect } from "react";

export interface SectionToggle {
  id: string;
  titleFa: string;
  category: "HERO" | "COMMERCE" | "SCIENCE" | "CLINICAL" | "TRUST";
  description: string;
  enabled: boolean;
  order: number;
}

export const DEFAULT_HOMEPAGE_SECTIONS: SectionToggle[] = [
  {
    id: "hero",
    titleFa: "بنر اصلی و هیرو بالینی (Hero Banner)",
    category: "HERO",
    description: "معرفی هویت سازمانی کمبریج، پروتکل اثر بوهر و فراخوان‌های اقدام اصلی",
    enabled: true,
    order: 1,
  },
  {
    id: "pathSelector",
    titleFa: "مسیرهای سه‌گانه تخصصی مراجعین (Path Selector)",
    category: "HERO",
    description: "تریاژ ۳ مسیره: روتین خانگی، پروتکل‌های کربوکسی و شیت‌های فعال‌ساز",
    enabled: true,
    order: 2,
  },
  {
    id: "featuredShowcase",
    titleFa: "کاتالوگ بنتوی محصولات برگزیده (Bento Featured Products)",
    category: "COMMERCE",
    description: "نمایش ۶ محصول اصلی با نشان زنجیره سرد و مشخصات فعال دارویی",
    enabled: true,
    order: 3,
  },
  {
    id: "brandFamilies",
    titleFa: "معرفی لاین‌های درمانی ReeSkin و ReeMed (Brand Families)",
    category: "COMMERCE",
    description: "تفکیک تخصصی رژیم‌های خانگی و کیت‌های بالینی مراقبت پوست",
    enabled: true,
    order: 4,
  },
  {
    id: "concernsNav",
    titleFa: "راهنمای سریع دغدغه‌های پوستی (Concerns Quick-Nav)",
    category: "COMMERCE",
    description: "دسترسی سریع بر اساس دغدغه: آکنه، لک ملاسما، جوانسازی و سد دفاعی",
    enabled: true,
    order: 5,
  },
  {
    id: "skinFinder",
    titleFa: "ابزار هوشمند انتخاب ژل کربوکسی (Skin Regimen Finder)",
    category: "COMMERCE",
    description: "فرم ۳ مرحله‌ای تشخیص ساختار پوست و پیشنهاد کیت متناظر با ثبت سفارش",
    enabled: true,
    order: 6,
  },
  {
    id: "productRail",
    titleFa: "ریل محبوب‌ترین فرمولاسیون‌های بالینی (Popular Product Rail)",
    category: "COMMERCE",
    description: "قفسه چرخشی محصولات پرفروش با فچ دینامیک از سرور و لیست علاقه‌مندی",
    enabled: true,
    order: 7,
  },
  {
    id: "scienceSpotlight",
    titleFa: "مکانیسم زیست‌شیمیایی اثر بوهر (Science Mechanism Spotlight)",
    category: "SCIENCE",
    description: "اطلس بافت‌شناسی مقطع پوست، ۴ فاز استوکیومتری و واکنش گاز CO₂",
    enabled: true,
    order: 8,
  },
  {
    id: "bohrSimulator",
    titleFa: "شبیه‌ساز تعاملی اثر بوهر (Bohr Oxygenation Simulator)",
    category: "SCIENCE",
    description: "اسلایدر دوزیمتری گاز CO₂، منحنی شیفت بوهر و اتساع مویرگ‌های درمیس",
    enabled: true,
    order: 9,
  },
  {
    id: "visiaSlider",
    titleFa: "اسلایدر مقایسه‌ای پیش و پس از درمان Visia (Before/After Slider)",
    category: "CLINICAL",
    description: "مقایسه کششی تصاویر بیماران در ملاسما، چروک، بلفاروپلاستی و آکنه",
    enabled: true,
    order: 10,
  },
  {
    id: "academyGuides",
    titleFa: "پروتکل‌ها و راهنماهای بالینی مصرف (Clinical Guides & Protocols)",
    category: "CLINICAL",
    description: "راهنماهای بالینی گام‌به‌گام مصرف محصولات، رتینول و مراقبت‌های پوستی",
    enabled: true,
    order: 11,
  },
  {
    id: "clinicalResults",
    titleFa: "شواهد کارآزمایی‌های بالینی و نظرات پزشکان (Clinical Results)",
    category: "TRUST",
    description: "سنجه‌های بیومدیکال، آنالیزهای کامپیوتری و نظرات متخصصین پوست",
    enabled: true,
    order: 12,
  },
  {
    id: "trustBar",
    titleFa: "نوار اعتبار سازمانی و استانداردها (Trust & Credibility Bar)",
    category: "TRUST",
    description: "نمادهای زنجیره سرد، گواهی اصالت دارو و ارسال محرمانه",
    enabled: true,
    order: 13,
  },
  {
    id: "newsletter",
    titleFa: "عضویت ویژه VIP و خبرنامه (Newsletter & VIP Club)",
    category: "TRUST",
    description: "فرم ثبت ایمیل جهت دریافت کدهای تخفیف دوره‌ای و مقالات علمی",
    enabled: true,
    order: 14,
  },
];

const STORAGE_KEY = "commerce_os_homepage_sections_v1";

export default function StorefrontSectionsManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const canEdit = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";
  const [sections, setSections] = useState<SectionToggle[]>(DEFAULT_HOMEPAGE_SECTIONS);
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [statusNotice, setStatusNotice] = useState<string>("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SectionToggle[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with DEFAULT_HOMEPAGE_SECTIONS to make sure any new section exists
          const map = new Map<string, SectionToggle>();
          for (const s of DEFAULT_HOMEPAGE_SECTIONS) {
            map.set(s.id, { ...s });
          }
          for (const s of parsed) {
            if (map.has(s.id)) {
              map.set(s.id, { ...map.get(s.id)!, enabled: s.enabled, order: s.order ?? map.get(s.id)!.order });
            }
          }
          const merged = Array.from(map.values()).sort((a, b) => a.order - b.order);
          setSections(merged);
        }
      }
    } catch {
      // ignore JSON parse error in strict browser privacy
    }
  }, []);

  const persistSections = (updated: SectionToggle[]) => {
    setSections(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("commerce_os_sections_changed", { detail: updated }));
    } catch {
      // ignore
    }
  };

  const handleToggle = (id: string) => {
    if (!canEdit) return;
    const target = sections.find((s) => s.id === id);
    const nextState = target ? !target.enabled : true;

    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: nextState } : s));
    persistSections(updated);

    setStatusNotice(`بخش «${target?.titleFa || id}» با موفقیت ${nextState ? "فعال" : "غیرفعال"} گردید.`);
    setTimeout(() => setStatusNotice(""), 3500);
  };

  const handleBulkEnable = (enable: boolean) => {
    if (!canEdit) return;
    const updated = sections.map((s) => ({ ...s, enabled: enable }));
    persistSections(updated);
    setStatusNotice(`تمامی بخش‌های ویترین با موفقیت ${enable ? "فعال" : "غیرفعال"} شدند.`);
    setTimeout(() => setStatusNotice(""), 3500);
  };

  const handleResetDefaults = () => {
    if (!canEdit) return;
    if (confirm("آیا مایل به بازگرداندن تمامی سکشن‌های صفحه اصلی به چیدمان و وضعیت پیش‌فرض هستید؟")) {
      persistSections(DEFAULT_HOMEPAGE_SECTIONS);
      setStatusNotice("تمام بخش‌های ویترین به حالت پیش‌فرض استاندارد بازگردانده شدند.");
      setTimeout(() => setStatusNotice(""), 3500);
    }
  };

  const handleMoveOrder = (id: string, direction: "up" | "down") => {
    if (!canEdit) return;
    const index = sections.findIndex((s) => s.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = temp;

    // re-assign sequential order numbers
    const reordered = next.map((item, idx) => ({ ...item, order: idx + 1 }));
    persistSections(reordered);
  };

  const filteredSections = sections.filter((s) => {
    if (filterCat === "ALL") return true;
    return s.category === filterCat;
  });

  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="tab-pane">
      <section className="admin-section-box">
        {/* Header */}
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2>مدیریت ویترین و بخش‌های صفحه اصلی (Storefront Layout CMS)</h2>
            <small>امکان فعال‌سازی یا غیرفعال‌سازی آنی بخش‌های مختلف صفحه اصلی بر اساس نیازهای تجاری و بالینی با همگام‌سازی لحظه‌ای</small>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span className="badge-live" style={{ background: "var(--brand, #1E3A2F)", color: "#FFFFFF", fontWeight: 800 }}>
              {activeCount} از {sections.length} بخش فعال
            </span>
            {canEdit && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => handleBulkEnable(true)}
                  className="btn-action"
                  style={{ fontSize: "0.78rem" }}
                  title="فعال‌سازی همگانی تمامی بخش‌ها"
                >
                  ✓ فعال‌سازی همه
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkEnable(false)}
                  className="btn-action"
                  style={{ fontSize: "0.78rem", color: "#DC2626", borderColor: "rgba(220, 38, 38, 0.3)" }}
                  title="غیرفعال‌سازی همگانی تمامی بخش‌ها"
                >
                  ✕ غیرفعال‌سازی همه
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="btn-action"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--muted)", fontSize: "0.78rem" }}
                >
                  بازنشانی پیش‌فرض
                </button>
              </div>
            )}
          </div>
        </div>

        {statusNotice && (
          <div className="alert-box success-alert" style={{ marginBottom: "18px" }}>
            <span>✓ {statusNotice}</span>
          </div>
        )}

        {/* Toolbar & Filter Chips */}
        <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div className="filter-chips-group">
            <button
              type="button"
              className={`filter-chip ${filterCat === "ALL" ? "active" : ""}`}
              onClick={() => setFilterCat("ALL")}
            >
              همه بخش‌ها ({sections.length})
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
          <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            تغییر وضعیت بلافاصله در ویترین آنلاین اعمال و در Storage کلاینت ثبت می‌شود.
          </div>
        </div>

        {/* Sections Grid / Table */}
        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "70px", textAlign: "center" }}>ترتیب</th>
                <th>نام و عنوان بخش</th>
                <th>دسته‌بندی</th>
                <th>کارکرد در ویترین</th>
                <th style={{ width: "130px", textAlign: "center" }}>وضعیت در سایت</th>
                <th style={{ width: "160px", textAlign: "center" }}>سوییچ فوری فعال/غیرفعال</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((sec, idx) => (
                <tr key={sec.id} style={{ opacity: sec.enabled ? 1 : 0.6 }}>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span className="tabular-nums" style={{ fontWeight: 900, minWidth: "16px" }}>{sec.order}</span>
                      {canEdit && (
                        <div className="reorder-buttons">
                          <button
                            type="button"
                            className="btn-reorder"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(sec.id, "up")}
                            title="انتقال به بالا"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="btn-reorder"
                            disabled={idx === filteredSections.length - 1}
                            onClick={() => handleMoveOrder(sec.id, "down")}
                            title="انتقال به پایین"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                    </div>
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
                    <span className={`status-pill ${sec.enabled ? "approved pulse" : "pending_review"}`}>
                      {sec.enabled ? "✓ فعال در سایت" : "✕ غیرفعال"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <label className="toggle-switch-wrapper" title={sec.enabled ? "کلیک برای خاموش کردن" : "کلیک برای روشن کردن"}>
                      <input
                        type="checkbox"
                        className="toggle-switch-input"
                        checked={sec.enabled}
                        disabled={!canEdit}
                        onChange={() => handleToggle(sec.id)}
                      />
                      <span className="toggle-switch-track">
                        <span className="toggle-switch-thumb" />
                      </span>
                      <span className="toggle-switch-label-text" style={{ color: sec.enabled ? "#059669" : "var(--muted)" }}>
                        {sec.enabled ? "روشن" : "خاموش"}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
