import Link from "next/link";
import type { Metadata } from "next";
import { INGREDIENT_ENCYCLOPEDIA } from "../../lib/ingredients";

export const metadata: Metadata = {
  title: "دانشنامه ترکیبات فعال و استانداردهای INCI | Commerce OS Skin Science",
  description:
    "مرجع تخصصی مواد مؤثره آرایشی و درموسوتیکال: اسامی بین‌المللی INCI، نقش بیولوژیک سلولی، پروفایل ایمنی و CIR، تداخلات و سینرژی‌های بالینی.",
};

export default function IngredientsPage() {
  return (
    <div style={{ padding: "40px 0 90px" }}>
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "24px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/academy">آکادمی علوم پوست</Link>
        <span>/</span>
        <span>دانشنامه ترکیبات فعال و INCI</span>
      </nav>

      {/* ── Header ── */}
      <header className="blog-header" style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="eyebrow">Cosmeceutical Active Ingredients Registry</div>
            <h1 style={{ margin: "6px 0 10px" }}>دانشنامه ترکیبات فعال و استانداردهای بالینی (INCI)</h1>
            <p style={{ maxWidth: "720px", color: "var(--muted)", lineHeight: "1.8" }}>
              تحلیل علمی مواد مؤثره بر پایه شواهد آزمایشگاهی و بالینی، تعیین غلظت مؤثر، وضعیت ارزیابی سازمان CIR
              (Cosmetic Ingredient Review) و هم‌افزایی‌های دارویی در فرمولاسیون‌های مدرن.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href="/academy"
              style={{
                background: "var(--surface)",
                color: "var(--brand-deep)",
                border: "1px solid var(--line)",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              🎓 بازگشت به آکادمی
            </Link>
            <Link
              href="/b2b"
              style={{
                background: "var(--brand-deep)",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              پورتال همکاران B2B →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Ingredients Grid ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {INGREDIENT_ENCYCLOPEDIA.map((ing) => (
          <article
            key={ing.id}
            id={ing.slug}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "var(--shadow-card)",
              scrollMarginTop: "110px",
            }}
          >
            {/* Header info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "14px",
                borderBottom: "1px solid var(--line)",
                paddingBottom: "18px",
                marginBottom: "20px",
              }}
            >
              <div>
                <span
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand-deep)",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    padding: "3px 12px",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  {ing.chemicalClass}
                </span>
                <h2 style={{ margin: "0 0 6px", fontSize: "1.45rem", color: "var(--brand-deep)" }}>{ing.nameFa}</h2>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.86rem",
                    color: "#475569",
                    direction: "ltr",
                    textAlign: "right",
                  }}
                >
                  <strong>INCI:</strong> {ing.inciName}
                </div>
              </div>

              <div
                style={{
                  background: "var(--paper)",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                  textAlign: "right",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>دوز بالینی استاندارد:</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--ink)", marginTop: "2px" }}>
                  {ing.clinicalConcentration}
                </div>
              </div>
            </div>

            {/* Clinical Role and Biological Mechanisms */}
            <div style={{ marginBottom: "22px" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--ink)", margin: "0 0 8px" }}>
                🎯 نقش بالینی و تارگت‌های فیزیولوژیک
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.8", color: "#334155", margin: "0 0 14px" }}>
                {ing.clinicalRole}
              </p>

              <h4 style={{ fontSize: "0.9rem", color: "var(--brand-deep)", margin: "0 0 8px" }}>
                مکانیسم عملکرد بیولوژیک در سطح سلول:
              </h4>
              <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {ing.biologicalMechanism.map((mech, idx) => (
                  <li key={idx} style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: "1.8" }}>
                    {mech}
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Profile Matrix */}
            <div
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "18px 20px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", color: "var(--brand-deep)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🛡️</span>
                <span>پروفایل ایمنی و سم‌شناسی (Toxicological & Safety Profile)</span>
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                }}
              >
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>وضعیت CIR Rating:</span>
                  <strong style={{ fontSize: "0.82rem", color: "#047857" }}>{ing.safetyProfile.cirRating}</strong>
                </div>
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>شاخص کومدوژنیک (Comedogenic):</span>
                  <strong style={{ fontSize: "0.82rem", color: "var(--ink)" }}>{ing.safetyProfile.comedogenicRating} از ۵</strong>
                </div>
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>تحمل‌پذیری پوستی:</span>
                  <strong style={{ fontSize: "0.82rem", color: "var(--ink)" }}>{ing.safetyProfile.tolerability}</strong>
                </div>
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>ایمنی در دوران بارداری:</span>
                  <strong
                    style={{
                      fontSize: "0.82rem",
                      color:
                        ing.safetyProfile.pregnancySafe === true
                          ? "#047857"
                          : ing.safetyProfile.pregnancySafe === "ممنوع در بارداری"
                          ? "#b91c1c"
                          : "#b45309",
                    }}
                  >
                    {ing.safetyProfile.pregnancySafe === true ? "مجاز و ایمن" : String(ing.safetyProfile.pregnancySafe)}
                  </strong>
                </div>
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>محدوده پایداری pH:</span>
                  <strong style={{ fontSize: "0.82rem", color: "var(--ink)" }} dir="ltr">
                    {ing.safetyProfile.phRange}
                  </strong>
                </div>
              </div>
            </div>

            {/* Synergies & Incompatibilities */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <h4 style={{ margin: "0 0 10px", color: "#166534", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🤝</span>
                  <span>سینرژی و ترکیب‌های هم‌افزا (Synergistic Pairings):</span>
                </h4>
                <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {ing.synergisticCombinations.map((syn, sIdx) => (
                    <li key={sIdx} style={{ fontSize: "0.84rem", color: "#14532d", lineHeight: "1.7" }}>
                      <strong>{syn.withIngredient}:</strong> {syn.mechanism}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <h4 style={{ margin: "0 0 10px", color: "#9a3412", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⚡</span>
                  <span>تداخلات فرمولاسیونی و ناسازگاری‌ها:</span>
                </h4>
                <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {ing.incompatibilities.map((inc, iIdx) => (
                    <li key={iIdx} style={{ fontSize: "0.84rem", color: "#7c2d12", lineHeight: "1.7" }}>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clinical Evidence Note */}
            <div
              style={{
                borderTop: "1px dashed var(--line)",
                paddingTop: "14px",
                fontSize: "0.82rem",
                color: "var(--muted)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <strong>شواهد بالینی مرجع:</strong> {ing.clinicalEvidence}
              </div>
              <Link href="/academy" style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
                مشاهده پروتکل‌های درمانی این ترکیب ←
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
