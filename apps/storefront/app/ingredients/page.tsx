import Link from "next/link";
import type { Metadata } from "next";
import { INGREDIENT_ENCYCLOPEDIA } from "../../lib/ingredients";
import { IngredientsInteractiveRegistry } from "./ingredients-interactive-registry";

export const metadata: Metadata = {
  title: "دانشنامه ترکیبات فعال و استانداردهای INCI | دکتر درمر انگلستان",
  description:
    "مرجع تخصصی مواد مؤثره آرایشی و درموسوتیکال: اسامی بین‌المللی INCI، نقش بیولوژیک سلولی، پروفایل ایمنی و CIR، تداخلات و سینرژی‌های بالینی.",
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export default function IngredientsPage() {
  const ingredientsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${SITE_URL}/ingredients#webpage`,
        name: "دانشنامه ترکیبات فعال و استانداردهای INCI",
        description:
          "مرجع تخصصی مواد مؤثره آرایشی و درموسوتیکال: اسامی بین‌المللی INCI، نقش بیولوژیک سلولی، پروفایل ایمنی و CIR.",
        url: `${SITE_URL}/ingredients`,
        specialty: "Dermatology",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "آکادمی علوم پوست", item: `${SITE_URL}/academy` },
            { "@type": "ListItem", position: 3, name: "دانشنامه ترکیبات فعال", item: `${SITE_URL}/ingredients` },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/ingredients#list`,
        name: "ترکیبات فعال بیوتکنولوژیک و استانداردهای INCI",
        itemListElement: INGREDIENT_ENCYCLOPEDIA.map((ing, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: ing.nameFa,
          alternateName: ing.inciName,
          description: ing.clinicalRole,
          url: `${SITE_URL}/ingredients#${ing.slug}`,
        })),
      },
    ],
  };

  return (
    <div style={{ padding: "40px 0 90px" }}>
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ingredientsJsonLd) }}
      />

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

        {/* Regulatory Governance Disclaimer */}
        <div
          style={{
            marginTop: "20px",
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            padding: "12px 18px",
            fontSize: "0.8rem",
            color: "#475569",
            lineHeight: "1.7",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>⚖️</span>
          <span>
            <strong>انطباق با استانداردهای رگولاتوری:</strong> اطلاعات مندرج در این اطلس صرفاً جنبه تشریح بیوشیمیایی و بیوفیزیک مواد مؤثره داشته و بدون اغراق درمانی است. این داده‌ها جایگزین مشاوره و پروتکل‌های تجویزی متخصصین پوست نمی‌باشد.
          </span>
        </div>
      </header>

      {/* ── Interactive Ingredients Registry with Live Search, CAS, CIR & Filter Pills ── */}
      <IngredientsInteractiveRegistry ingredients={INGREDIENT_ENCYCLOPEDIA} />
    </div>
  );
}
