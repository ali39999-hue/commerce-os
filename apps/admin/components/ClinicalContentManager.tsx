"use client";

import { useState } from "react";
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
    createdAt: new Date(Date.now() - 3600 * 24 * 5 * 1000).toISOString(),
  },
  {
    id: "clm_102",
    productTitle: "ژل ترمیم سد دفاعی و تسکین‌بخش هیلین Healene Soothing Gel",
    claimText: "کاهش ۷۸٪ اتلاف آب از طریق اپیدرم (TEWL) ظرف مدت ۴۸ ساعت پس از لیزر فرکشنال",
    evidenceSummary: "سنجش با دستگاه تئوالمتر Tewameter TM300 در ۳۸ بیمار پس از پروسیجرهای فرکشنال و پیلینگ.",
    studyReference: "British Journal of Dermatology (2025), DOI: 10.1093/bjd/ljad412",
    status: "APPROVED",
    approvedBy: "دکتر کیانوش راد (متخصص درماتولوژی بالینی)",
    createdAt: new Date(Date.now() - 3600 * 24 * 2 * 1000).toISOString(),
  },
  {
    id: "clm_103",
    productTitle: "خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste",
    claimText: "عدم ایجاد هرگونه خراش میکروسکوپی (Micro-tears) در سد شاخی پوست به دلیل بلورهای مدور آلومینا",
    evidenceSummary: "تصویربرداری میکروسکوپ الکترونی روبشی (SEM) با بزرگنمایی ۵۰۰۰ برابر از بیواینرت بودن بلورها.",
    studyReference: "Dermatologic Surgery & Microdermabrasion Review (2024), Issue 8, pp. 45-52",
    status: "APPROVED",
    approvedBy: "دکتر علیرضا ناصری (شیمیست فرمولاتور)",
    createdAt: new Date(Date.now() - 3600 * 24 * 1 * 1000).toISOString(),
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
    updatedAt: new Date(Date.now() - 3600 * 24 * 4 * 1000).toISOString(),
  },
  {
    id: "art_2",
    title: "پروتکل جامع مهار ملانوژنز و درمان لک با نیاسینامید و رتینول بافرشده",
    category: "پروتکل بالینی",
    authorDoctor: "دکتر علیرضا ناصری (شیمیست بالینی)",
    status: "PUBLISHED",
    viewsCount: 3180,
    updatedAt: new Date(Date.now() - 3600 * 24 * 1 * 1000).toISOString(),
  },
];

export default function ClinicalContentManager({
  userRole = "SUPER_ADMIN",
}: {
  userRole?: string;
}) {
  const [tab, setTab] = useState<"claims" | "academy">("claims");
  const [claims, setClaims] = useState<ClinicalClaimItem[]>(INITIAL_CLAIMS);
  const [articles, setArticles] = useState<AcademyArticleItem[]>(INITIAL_ARTICLES);
  const [selectedClaim, setSelectedClaim] = useState<ClinicalClaimItem | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleApproveClaim = (id: string) => {
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
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "REJECTED" } : c))
    );
    setActionMessage("ادعای بالینی به علت عدم کفایت شواهد رد شد.");
    setSelectedClaim(null);
  };

  return (
    <div className="tab-pane">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setTab("claims")}
          className={`b2b-chip ${tab === "claims" ? "active" : ""}`}
        >
          🔬 ادعاها و شواهد آزمایشگاهی ({faNumber(claims.length)})
        </button>
        <button
          onClick={() => setTab("academy")}
          className={`b2b-chip ${tab === "academy" ? "active" : ""}`}
        >
          📚 آکادمی مقالات و پروتکل‌های بالینی ({faNumber(articles.length)})
        </button>
      </div>

      {actionMessage && <div className="form-feedback-success">{actionMessage}</div>}

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
              {claims.map((c) => (
                <tr key={c.id}>
                  <td className="bold">{c.productTitle}</td>
                  <td>{c.claimText}</td>
                  <td className="muted-text">{c.studyReference}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        c.status === "APPROVED"
                          ? "paid"
                          : c.status === "REVIEW_REQUIRED"
                          ? "processing"
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
              ))}
            </tbody>
          </table>
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
            >
              ✓ تایید نهایی و صدور برچسب علمی
            </button>
            <button
              onClick={() => handleRejectClaim(selectedClaim.id)}
              className="btn-reject"
            >
              ✕ رد ادعا و ارسال به آزمایشگاه
            </button>
          </div>
        </section>
      )}

      {tab === "academy" && (
        <section className="admin-section-box">
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>مدیریت مقالات آکادمی پوست و راهنماهای بالینی</h2>
              <small>تولید محتوای آموزشی علمی بر اساس گایدلاین‌های درماتولوژی جهانی</small>
            </div>
            <span className="badge-live">PEER-REVIEW WORKFLOW</span>
          </div>

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
              {articles.map((art) => (
                <tr key={art.id}>
                  <td className="bold">{art.title}</td>
                  <td>{art.category}</td>
                  <td>{art.authorDoctor}</td>
                  <td>{faNumber(art.viewsCount)} بازدید</td>
                  <td>
                    <span
                      className={`status-pill ${
                        art.status === "PUBLISHED" ? "paid" : "processing"
                      }`}
                    >
                      {art.status === "PUBLISHED" ? "منتشر شده" : "داوری همتا"}
                    </span>
                  </td>
                  <td>{formatJalaliDateTime(art.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
