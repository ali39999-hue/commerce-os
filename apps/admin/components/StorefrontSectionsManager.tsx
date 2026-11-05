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
    titleFa: "کاتالوگ بنتوی محصولات برگزیده (Featured Products)",
    category: "COMMERCE",
    description: "نمایش ۶ محصول اصلی با نشان زنجیره سرد و مشخصات فعال دارویی",
    enabled: true,
    order: 3,
  },
  {
    id: "brandFamilies",
    titleFa: "معرفی لاین‌های درمانی ReeSkin و ReeMed (Brand Families)",
    category: "COMMERCE",
    description: "تفکیک تخصصی رژیم‌های خانگی و کیت‌های بالینی مطب",
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
    titleFa: "کنسول شبیه‌ساز اثر بوهر (Bohr Oxygenation Simulator)",
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
    titleFa: "دانش کاربردی مصرف و پروتکل‌های بالینی (Clinical Guides)",
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
          setSections(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggle = (id: string) => {
    if (!canEdit) return;
    setSections((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("commerce_os_sections_changed", { detail: updated }));
      } catch {
        // ignore
      }
      return updated;
    });

    const target = sections.find((s) => s.id === id);
    const nextState = target ? !target.enabled : true;
    setStatusNotice(`بخش «${target?.titleFa || id}» با موفقیت ${nextState ? "فعال" : "غیرفعال"} شد.`);
    setTimeout(() => setStatusNotice(""), 3500);
  };

  const handleResetDefaults = () => {
    if (!canEdit) return;
    setSections(DEFAULT_HOMEPAGE_SECTIONS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS));
    } catch {
      // ignore
    }
    setStatusNotice("تمام بخش‌های ویترین به حالت پیش‌فرض استاندارد بازگردانده شدند.");
    setTimeout(() => setStatusNotice(""), 3500);
  };

  const filteredSections = sections.filter((s) => {
    if (filterCat === "ALL") return true;
    return s.category === filterCat;
  });

  const activeCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="tab-pane">
      <section className="admin-section-box">
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>مدیریت ویترین و بخش‌های صفحه اصلی (Storefront Layout CMS)</h2>
            <small>امکان فعال‌سازی یا غیرفعال‌سازی آنی بخش‌های مختلف صفحه اصلی بر اساس نیازهای تجاری و بالینی</small>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge-live" style={{ background: "var(--brand)", color: "#FFFFFF" }}>
              {activeCount} از {sections.length} بخش فعال
            </span>
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

          {canEdit && (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="btn-action"
              style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--muted)" }}
            >
              بازنشانی به پیش‌فرض
            </button>
          )}
        </div>

        {/* Sections Grid / Table */}
        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>ترتیب</th>
                <th>نام و عنوان بخش</th>
                <th>دسته‌بندی</th>
                <th>کارکرد در ویترین</th>
                <th style={{ width: "140px" }}>وضعیت در ویترین</th>
                <th style={{ width: "160px" }}>عملیات سوییچ</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((sec) => (
                <tr key={sec.id} style={{ opacity: sec.enabled ? 1 : 0.65 }}>
                  <td className="tabular-nums" style={{ fontWeight: 800 }}>{sec.order}</td>
                  <td className="bold">{sec.titleFa}</td>
                  <td>
                    <span className="category-pill">{sec.category}</span>
                  </td>
                  <td className="muted-text" style={{ fontSize: "0.82rem" }}>
                    {sec.description}
                  </td>
                  <td>
                    <span className={`status-pill ${sec.enabled ? "approved pulse" : "pending_review"}`}>
                      {sec.enabled ? "فعال در سایت" : "غیرفعال (مخفی)"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={!canEdit}
                      onClick={() => handleToggle(sec.id)}
                      className="btn-action"
                      style={{
                        background: sec.enabled ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.15)",
                        color: sec.enabled ? "#DC2626" : "#059669",
                        borderColor: sec.enabled ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.4)",
                        fontWeight: 800,
                      }}
                    >
                      {sec.enabled ? "غیرفعال‌سازی" : "فعال‌سازی"}
                    </button>
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
