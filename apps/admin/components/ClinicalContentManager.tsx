"use client";

import { useMemo, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { faNumber } from "./types";

export interface ClinicalClaimItem {
  id: string;
  productTitle: string;
  claimText: string;
  evidenceSummary: string;
  studyReference: string;
  status: "DRAFT" | "REVIEW_REQUIRED" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  createdAt: string;
}

export interface InciIngredientItem {
  id: string;
  inciName: string;
  persianName: string;
  casNumber: string;
  functionCategory: string;
  safetyScore: string; // e.g. "EWG 1 (سبز / کاملاً ایمن)"
  associatedProducts: string;
  bohrEffectRole?: string;
}

export interface AcademyArticleItem {
  id: string;
  title: string;
  category: string;
  authorDoctor: string;
  status: "PUBLISHED" | "UNDER_PEER_REVIEW" | "REVISION_REQUESTED";
  viewsCount: number;
  updatedAt: string;
}

const INITIAL_CLAIMS: ClinicalClaimItem[] = [
  {
    id: "clm_101",
    productTitle: "ژل حرفه‌ای کربوکسی‌تراپی CarboxyGel™ Professional",
    claimText: "افزایش ۴۵٪ اشباع اکسیژن مویرگی بافتی (Bohr Effect) ظرف ۱۵ دقیقه پس از مصرف",
    evidenceSummary: "کارآزمایی بالینی تصادفی با دستگاه اندازه‌گیری اکسیژن ترنس‌درمال بر روی ۴۸ داوطلب در کمبریج.",
    studyReference: "Journal of Cosmetic and Laser Therapy (2020), Vol 12, pp. 215-224, DOI: 10.3109/14764172",
    status: "APPROVED",
    approvedBy: "دکتر مریم سهرابی (متخصص درماتولوژی، نظام: ۱۳۹۴۸۲)",
    // Demo timestamps are fixed: module-level Date.now() evaluates at different
    // times on the server and the client and breaks hydration.
    createdAt: "2026-10-28T09:30:00.000Z",
  },
  {
    id: "clm_102",
    productTitle: "ژل ترمیم سد دفاعی و تسکین‌بخش هیلین Healene Soothing Gel",
    claimText: "کاهش ۷۸٪ اتلاف آب از طریق اپیدرم (TEWL) ظرف مدت ۴۸ ساعت پس از لیزر فرکشنال",
    evidenceSummary: "سنجش با دستگاه تئوالمتر Tewameter TM300 در ۳۸ بیمار پس از پروسیجرهای فرکشنال و پیلینگ.",
    studyReference: "British Journal of Dermatology (2025), DOI: 10.1093/bjd/ljad412",
    status: "APPROVED",
    approvedBy: "دکتر کیانوش راد (متخصص درماتولوژی بالینی)",
    createdAt: "2026-10-31T10:15:00.000Z",
  },
  {
    id: "clm_103",
    productTitle: "خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste",
    claimText: "عدم ایجاد هرگونه خراش میکروسکوپی (Micro-tears) در سد شاخی پوست به دلیل بلورهای مدور آلومینا",
    evidenceSummary: "تصویربرداری میکروسکوپ الکترونی روبشی (SEM) با بزرگنمایی ۵۰۰۰ برابر از بیواینرت بودن بلورها.",
    studyReference: "Dermatologic Surgery & Microdermabrasion Review (2024), Issue 8, pp. 45-52",
    status: "APPROVED",
    approvedBy: "دکتر علیرضا ناصری (شیمیست فرمولاتور)",
    createdAt: "2026-11-01T11:00:00.000Z",
  },
];

const INITIAL_INCI: InciIngredientItem[] = [
  {
    id: "inci_1",
    inciName: "Perfluorodecalin",
    persianName: "پرفلورودکالین (حامل غنی اکسیژن بافتی)",
    casNumber: "306-94-5",
    functionCategory: "انتقال اکسیژن و تحریک اثر بوهر (Bohr Effect)",
    safetyScore: "EWG 1 (سبز)",
    associatedProducts: "CarboxyGel™, CarboxyPod™",
    bohrEffectRole: "تسریع آزادسازی هموگلوبین در ریزجریان‌های خونی لایه پاپیلاری",
  },
  {
    id: "inci_2",
    inciName: "Ceramide NP",
    persianName: "سرامید ان‌پی (بیومیمتیک تیپ ۳)",
    casNumber: "100403-19-8",
    functionCategory: "ترمیم لیپیدهای ماتریکس بین‌سلولی استراتوم کورنئوم",
    safetyScore: "EWG 1 (سبز)",
    associatedProducts: "Healene Soothing Gel, Barrier Serum",
    bohrEffectRole: "جلوگیری از تبخیر آب ترنس‌اپیدرمال پس از تحریک دی‌اکسید کربن",
  },
  {
    id: "inci_3",
    inciName: "Sodium Hyaluronate (Multi-Molecular)",
    persianName: "هیالورونات سدیم چندوزنی (سه لایه نفوذ)",
    casNumber: "9067-32-7",
    functionCategory: "آب‌رسانی عمیق درم و اپیدرم",
    safetyScore: "EWG 1 (سبز)",
    associatedProducts: "CarboxyPad™, Gentle Cleanser",
    bohrEffectRole: "نگه‌دارنده اسمزی بافت در حین هیپوکسی کنترل‌شده",
  },
  {
    id: "inci_4",
    inciName: "Alumina (Spherical Microcrystals)",
    persianName: "آلومینای کریستالی کروی (بیواینرت)",
    casNumber: "1344-28-1",
    functionCategory: "میکرودرم و صیقل سطحی غیرتهاجمی بدون آسیب مکانیکی",
    safetyScore: "EWG 1 (سبز)",
    associatedProducts: "Crystalene Polish Paste",
    bohrEffectRole: "حذف لایه مرده کراتینوسیت‌ها جهت تسهیل نفوذ CO2 ترنس‌درمال",
  },
  {
    id: "inci_5",
    inciName: "Niacinamide (USP Grade 5%)",
    persianName: "نیاسینامید خالص (ویتامین B3 گرید دارویی)",
    casNumber: "98-92-0",
    functionCategory: "مهار انتقال ملانوزوم و تقویت سرامیدسازی درونی",
    safetyScore: "EWG 1 (سبز)",
    associatedProducts: "Barrier Serum, CarboxyGel™",
    bohrEffectRole: "تقویت سنتز ATP در سلول‌های اندوتلیال عروق",
  },
];

const INITIAL_ARTICLES: AcademyArticleItem[] = [
  {
    id: "art_1",
    title: "مکانیسم اثر گاز دی‌اکسید کربن در کربوکسی‌تراپی بدون سوزن (Bohr Effect)",
    category: "فیزیولوژی پوست و تکنولوژی",
    authorDoctor: "دکتر مریم سهرابی (متخصص پوست و مو)",
    status: "PUBLISHED",
    viewsCount: 5420,
    updatedAt: "2026-10-29T08:00:00.000Z",
  },
  {
    id: "art_2",
    title: "پروتکل جامع مهار ملانوژنز و درمان لک با نیاسینامید و رتینول بافرشده",
    category: "پروتکل بالینی",
    authorDoctor: "دکتر علیرضا ناصری (شیمیست بالینی)",
    status: "PUBLISHED",
    viewsCount: 3180,
    updatedAt: "2026-11-01T09:45:00.000Z",
  },
];

export default function ClinicalContentManager({
  userRole = "SUPER_ADMIN",
}: {
  userRole?: string;
}) {
  const [tab, setTab] = useState<"claims" | "inci" | "academy">("claims");
  const [claims, setClaims] = useState<ClinicalClaimItem[]>(INITIAL_CLAIMS);
  const [inciList, setInciList] = useState<InciIngredientItem[]>(INITIAL_INCI);
  const [articles, setArticles] = useState<AcademyArticleItem[]>(INITIAL_ARTICLES);
  const [selectedClaim, setSelectedClaim] = useState<ClinicalClaimItem | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const canApproveClinical = userRole === "SUPER_ADMIN";

  const handleApproveClaim = (id: string) => {
    if (!canApproveClinical) {
      setActionMessage("خطای دسترسی: بر اساس اصل تفکیک وظایف (SoD)، تایید ادعاهای بالینی تنها در صلاحیت ناظر علمی و مدیر ارشد است.");
      return;
    }
    setClaims((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "APPROVED",
              approvedBy: `دسترسی بالینی (${userRole})`,
            }
          : c
      )
    );
    setActionMessage("ادعای بالینی تایید و مهر اعتبارسنجی در کاتالوگ فروشگاه ثبت شد.");
    setSelectedClaim(null);
  };

  const handleRejectClaim = (id: string) => {
    if (!canApproveClinical) {
      setActionMessage("خطای دسترسی: رد یا بازبینی ادعاهای بالینی منوط به صلاحیت پزشکی است.");
      return;
    }
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "REJECTED" } : c))
    );
    setActionMessage("ادعای بالینی به علت عدم کفایت شواهد رد شد.");
    setSelectedClaim(null);
  };

  const filteredClaims = useMemo(() => {
    if (!searchQuery.trim()) return claims;
    const q = searchQuery.toLowerCase();
    return claims.filter(
      (c) =>
        c.productTitle.toLowerCase().includes(q) ||
        c.claimText.toLowerCase().includes(q) ||
        c.studyReference.toLowerCase().includes(q)
    );
  }, [claims, searchQuery]);

  const filteredInci = useMemo(() => {
    if (!searchQuery.trim()) return inciList;
    const q = searchQuery.toLowerCase();
    return inciList.filter(
      (i) =>
        i.inciName.toLowerCase().includes(q) ||
        i.persianName.includes(q) ||
        i.casNumber.includes(q) ||
        i.functionCategory.includes(q)
    );
  }, [inciList, searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.authorDoctor.includes(q) ||
        a.category.includes(q)
    );
  }, [articles, searchQuery]);

  return (
    <div className="tab-pane">
      {!canApproveClinical && (
        <div className="role-notice-banner warning">
          <span>
            <strong>شورای داوری علمی و نظارت بالینی (Clinical SoD):</strong> نقش فعال شما «{userRole === "ACCOUNTANT" ? "حسابدار ارشد" : "اپراتور فروش و ارسال"}» است. طبق الزامات فاز ۰۶، اعتبارسنجی کارآزمایی‌ها و صدور برچسب اثربخشی فیزیولوژیک صرفاً با صلاحیت ناظر پزشکی مجاز است.
          </span>
          <span className="domain-access-badge access-view_only">داوری پزشکی</span>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => {
            setTab("claims");
            setSearchQuery("");
          }}
          className={`b2b-chip ${tab === "claims" ? "active" : ""}`}
        >
          🔬 ادعاها و شواهد آزمایشگاهی ({faNumber(claims.length)})
        </button>
        <button
          onClick={() => {
            setTab("inci");
            setSearchQuery("");
          }}
          className={`b2b-chip ${tab === "inci" ? "active" : ""}`}
        >
          🧪 دایرکتوری ترکیبات INCI و فرمولاسیون ({faNumber(inciList.length)})
        </button>
        <button
          onClick={() => {
            setTab("academy");
            setSearchQuery("");
          }}
          className={`b2b-chip ${tab === "academy" ? "active" : ""}`}
        >
          📚 پایگاه مقالات و پروتکل‌های بالینی ({faNumber(articles.length)})
        </button>
      </div>

      {actionMessage && <div className="form-feedback-success">{actionMessage}</div>}

      {/* Toolbar Search */}
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <input
            type="text"
            placeholder={
              tab === "claims"
                ? "🔍 جستجو در ادعاها، نام محصول یا رفرنس ژورنال..."
                : tab === "inci"
                ? "🔍 جستجو بر اساس نام لاتین INCI، کد CAS یا عملکرد فیزیولوژیک..."
                : "🔍 جستجو در مقالات، پروتکل‌ها یا نام پزشک نویسنده..."
            }
            className="admin-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="badge-live">CLINICAL SCIENTIFIC RIGOR</span>
      </div>

      {tab === "claims" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>شورای بازبینی ادعاهای بالینی و رفرنس‌های پژوهشی</h2>
              <small>
                هیچ ادعای درمانی و آرایشی-بهداشتی بدون ضمیمه مستندات علمی و تایید شورای پزشکی در فروشگاه منتشر نمی‌شود.
              </small>
            </div>
            <span className="badge-live">CLINICAL AUDIT TRAIL</span>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>محصول مرتبط</th>
                  <th>متن ادعای بالینی</th>
                  <th>رفرنس و ژورنال علمی</th>
                  <th>وضعیت داوری</th>
                  <th>ناظر بالینی</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }} className="muted-text">
                      موردی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((c) => (
                    <tr key={c.id}>
                      <td className="bold">{c.productTitle}</td>
                      <td>{c.claimText}</td>
                      <td className="muted-text">{c.studyReference}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            c.status === "APPROVED"
                              ? "approved pulse"
                              : c.status === "REVIEW_REQUIRED"
                              ? "pending_review"
                              : "rejected"
                          }`}
                        >
                          {c.status === "APPROVED"
                            ? "تایید شده"
                            : c.status === "REVIEW_REQUIRED"
                            ? "نیازمند بازبینی"
                            : c.status === "REJECTED"
                            ? "رد شده"
                            : "پیش‌نویس"}
                        </span>
                      </td>
                      <td>{c.approvedBy || "—"}</td>
                      <td>
                        <button onClick={() => setSelectedClaim(c)} className="btn-action">
                          🔍 بررسی شواهد
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedClaim && tab === "claims" && (
        <section className="admin-section-box" style={{ marginTop: "20px", border: "2px solid var(--accent)" }}>
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>بررسی پرونده بالینی: {selectedClaim.productTitle}</h2>
              <small>ثبت تاریخ: {formatJalaliDateTime(selectedClaim.createdAt)}</small>
            </div>
            <button onClick={() => setSelectedClaim(null)} className="btn-reject">
              ✕ بستن پرونده
            </button>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 6px" }}>ادعای ثبت‌شده:</h4>
            <p style={{ margin: "0 0 16px", color: "var(--ink)", fontWeight: 600 }}>
              {selectedClaim.claimText}
            </p>

            <h4 style={{ margin: "0 0 6px" }}>خلاصه متدولوژی و شواهد آزمایشگاهی:</h4>
            <p style={{ margin: "0 0 16px", color: "var(--muted)", lineHeight: 1.8 }}>
              {selectedClaim.evidenceSummary}
            </p>

            <h4 style={{ margin: "0 0 6px" }}>ارجاع به مطالعه و گواهی:</h4>
            <code style={{ background: "#eee", padding: "4px 8px", borderRadius: "6px" }}>
              {selectedClaim.studyReference}
            </code>
          </div>

          <div className="action-button-group">
            <button
              onClick={() => handleApproveClaim(selectedClaim.id)}
              className="btn-approve"
              disabled={!canApproveClinical}
              title={!canApproveClinical ? "صرفاً با نقش ناظر علمی یا مدیر ارشد سیستم" : "تایید ادعا"}
              style={!canApproveClinical ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
              ✓ تایید نهایی و صدور برچسب علمی
            </button>
            <button
              onClick={() => handleRejectClaim(selectedClaim.id)}
              className="btn-reject"
              disabled={!canApproveClinical}
              title={!canApproveClinical ? "صرفاً با نقش ناظر علمی یا مدیر ارشد سیستم" : "رد ادعا"}
              style={!canApproveClinical ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
              ✕ رد ادعا و ارسال به آزمایشگاه
            </button>
          </div>
        </section>
      )}

      {tab === "inci" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>دایرکتوری فرمولاسیون، بیواینرت‌ها و استاندارد INCI</h2>
              <small>
                ثبت کدهای بین‌المللی CAS، سنجش رتبه ایمنی EWG، نقش اختصاصی در تحریک اثر بوهر (Bohr Effect) و انطباق با مقررات آرایشی بریتانیا و اتحادیه اروپا.
              </small>
            </div>
            <span className="badge-live">INCI / FORMULATION REGISTRY</span>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام رسمی INCI</th>
                  <th>عنوان فارسی و بیومیمتیک</th>
                  <th>کد ثبت CAS</th>
                  <th>نقش فیزیولوژیک و بیوشیمیایی</th>
                  <th>رتبه ایمنی</th>
                  <th>محصولات مرتبط در فرمولاسیون</th>
                </tr>
              </thead>
              <tbody>
                {filteredInci.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }} className="muted-text">
                      ماده‌ای با این مشخصات یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredInci.map((ing) => (
                    <tr key={ing.id}>
                      <td className="bold" dir="ltr" style={{ color: "var(--brand-deep)" }}>
                        {ing.inciName}
                      </td>
                      <td>{ing.persianName}</td>
                      <td dir="ltr" className="tabular-nums font-mono">
                        <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                          {ing.casNumber}
                        </code>
                      </td>
                      <td>{ing.functionCategory}</td>
                      <td>
                        <span className="status-pill approved">{ing.safetyScore}</span>
                      </td>
                      <td className="muted-text">{ing.associatedProducts}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "academy" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>مدیریت مقالات علمی پوست و راهنماهای بالینی</h2>
              <small>تولید محتوای آموزشی علمی بر اساس گایدلاین‌های درماتولوژی جهانی</small>
            </div>
            <span className="badge-live">PEER-REVIEW WORKFLOW</span>
          </div>

          <div className="table-responsive-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>عنوان مقاله</th>
                  <th>دسته‌بندی تخصصی</th>
                  <th>پزشک همکار / نویسنده</th>
                  <th>بازدید</th>
                  <th>وضعیت انتشار</th>
                  <th>آخرین به‌روزرسانی</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }} className="muted-text">
                      مقاله‌ای با این مشخصات یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => (
                    <tr key={art.id}>
                      <td className="bold">{art.title}</td>
                      <td>{art.category}</td>
                      <td>{art.authorDoctor}</td>
                      <td className="tabular-nums">{faNumber(art.viewsCount)} بازدید</td>
                      <td>
                        <span
                          className={`status-pill ${
                            art.status === "PUBLISHED" ? "approved" : "pending_review"
                          }`}
                        >
                          {art.status === "PUBLISHED" ? "منتشر شده" : "داوری همتا"}
                        </span>
                      </td>
                      <td className="tabular-nums">{formatJalaliDateTime(art.updatedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
