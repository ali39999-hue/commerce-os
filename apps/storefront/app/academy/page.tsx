import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "../../lib/blog";
import { INGREDIENT_ENCYCLOPEDIA } from "../../lib/ingredients";

export const metadata: Metadata = {
  title: "آکادمی علوم پوست و پروتکل‌های بالینی | دکتر درمر انگلستان",
  description:
    "مرجع جامع آموزش‌های تخصصی درماتولوژی، مسیرهای یادگیری کربوکسی‌تراپی بدون سوزن، پیلینگ شیمیایی و ترمیم سد دفاعی، تفکیک سطوح پزشکان و بیوتی‌تراپیست‌ها همراه با صدور سرتیفیکیت رسمی.",
};

interface LearningPath {
  id: string;
  title: string;
  level: "سطح پزشکی (MD / Dermatologist)" | "سطح اسکین‌کر (Esthetician)" | "مشترک (پزشک و تراپیست)";
  targetLevelBadge: string;
  duration: string;
  modulesCount: number;
  prerequisites: string;
  targetIndications: string;
  certificationRequirement: string;
  slug: string;
  badge: string;
  description: string;
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: "path-bohr-carboxy",
    title: "مسیر جامع کربوکسی‌تراپی بدون سوزن و پدیده بوهر",
    level: "مشترک (پزشک و تراپیست)",
    targetLevelBadge: "پزشک و اسکین‌تراپیست",
    duration: "۱۶ ساعت آموزش (تئوری + هندزآن)",
    modulesCount: 4,
    prerequisites: "آشنایی با فیزیولوژی گردش خون مویرگی و آناتومی سطحی پوست صورت",
    targetIndications: "تیرگی مقاوم پریکولار، استریا، خطوط استاتیک، کاهش ادم لنفاوی",
    certificationRequirement: "شرکت در کارگاه حضوری، آزمون کتبی و ارسال مستندات تصویری ۳ کیس درمانی",
    slug: "bohr-effect-carboxy-therapy-needle-free",
    badge: "Bohr Effect Certified",
    description:
      "آموزش سازوکار انتشار ترنس‌درمال دی‌اکسید کربن، تغییر پی‌اچ و افزایش اشباع اکسیژن بافت، تکنیک اپلیکیشن ژل ۱۵۰۰ میلی‌لیتر و پروتکل‌های تلفیقی با اولتراسوند.",
  },
  {
    id: "path-barrier-recovery",
    title: "مسیر پیشرفته بازسازی سد دفاعی پوست و مراقبت‌های پست-پروسیجر",
    level: "مشترک (پزشک و تراپیست)",
    targetLevelBadge: "کلینیکال پست-پروسیجر",
    duration: "۱۲ ساعت آموزش تخصصی",
    modulesCount: 3,
    prerequisites: "گذراندن دوره پایه‌ای بیوشیمی ساختار لاملار اپیدرم و عملکرد لیپیدها",
    targetIndications: "سوختگی پس از لیزر CO₂، مهار PIH، اگزمای تماسی و دهیدراتاسیون حاد",
    certificationRequirement: "ارزیابی آزمون تئوری و دفاع از یک پروتکل بالینی مدیریت عوارض لیزر",
    slug: "skin-barrier-restoration-post-procedure",
    badge: "Post-Laser Recovery",
    description:
      "تحلیل فارماکولوژیک نسبت طلایی ۳:۱:۱ سرامیدها، کلسترول و اسیدهای چرب، خواص ضدالتهابی مادکاسوساید و متدهای پیشگیری از اسکار و لکه‌های تیره.",
  },
  {
    id: "path-melasma-peeling",
    title: "مسیر تخصصی لایه‌بردارهای شیمیایی و مهار چندمسیره ملانوژنز",
    level: "سطح پزشکی (MD / Dermatologist)",
    targetLevelBadge: "اختصاصی پزشکان متخصص",
    duration: "۲۰ ساعت آموزش پیشرفته",
    modulesCount: 5,
    prerequisites: "پروانه معتبر مطب یا شماره نظام پزشکی جهت تجویز اسیدهای مدیکال گرید",
    targetIndications: "ملاسمای مقاوم درمال، لک‌های پیری و کک‌ومک، هایپرپیگمانتاسیون پس‌التهابی",
    certificationRequirement: "انجام پروسیجر روی ۲ کیس بالینی در کارگاه و نمره قبولی بالای ۸۵٪ در آزمون جامع",
    slug: "protocol-hyperpigmentation-retinol-niacinamide",
    badge: "Melasma Target",
    description:
      "بررسی سینتیک نفوذ اسیدهای AHA/BHA/PHA، ترانگزامیک اسید و رتینوئیدهای بافرشده، معیارهای تشخیص عمق نفوذ، ایمنی فراستینگ و خنثی‌سازی بافری.",
  },
  {
    id: "path-plasma-surgery",
    title: "مسیر ابلیشن سابلیمیشن پلاسما و جت سرد نان‌ترمال",
    level: "سطح پزشکی (MD / Dermatologist)",
    targetLevelBadge: "جراحی سرپایی پلاسما",
    duration: "۱۸ ساعت آموزش جراحی سرپایی",
    modulesCount: 4,
    prerequisites: "داشتن مدرک پزشکی عمومی یا تخصص جراحی/پوست و تسلط بر بی‌حسی موضعی",
    targetIndications: "پتوز و شلی پلک (بلفاروپلاستی غیرجراحی)، استریلیزاسیون آکنه فعال و زوائد پوستی",
    certificationRequirement: "آزمون عملی کار با دستگاه PlasmaX بر روی بافت شبیه‌ساز و کیس زنده",
    slug: "signal-peptides-vs-copper-peptides",
    badge: "Plasma Surgery Tech",
    description:
      "کاربرد قوس فرکانس بالا در تصعید میکرونی اپیدرم بدون آسیب به غشای پایه، سازوکار جت سرد آرگون و هلیوم در نابودی باکتری‌ها و الکتروپوریشن DBD.",
  },
];

const CERTIFICATION_LEVELS = [
  {
    levelNumber: "۱",
    title: "تراپیست مجاز آکادمی (Certified Esthetician)",
    targetGroup: "بیوتی‌تراپیست‌ها، تکنسین‌های فیشیال و مراقبت پوستی کلینیک",
    scope: "اجرای پروتکل‌های غیرتهاجمی کربوکسی‌تراپی بوهر، ماسک‌های ترمیمی و تجویز روتین‌های سد دفاعی",
    badgeColor: "#0d9488",
    prereqs: "مدرک معتبر فنی و حرفه‌ای یا پیراپزشکی + قبولی در آزمون سطح ۱",
  },
  {
    levelNumber: "۲",
    title: "پزشک معتمد کلینیکال (Accredited Clinical Practitioner)",
    targetGroup: "پزشکان متخصص پوست، جراحان پلاستیک و پزشکان فعال در حوزه استتیک",
    scope: "اجرای پروسیجرهای پیلینگ درموسوتیکال عمیق، مدیریت عوارض لیزر، تزریق زیرجلدی CO₂ و پلاسما",
    badgeColor: "#0369a1",
    prereqs: "شماره نظام پزشکی معتبر + شرکت در کارگاه هندزآن و دفاع از کیس استادی",
  },
  {
    levelNumber: "۳",
    title: "کلینیک طلایی مرجع (Centre of Excellence)",
    targetGroup: "مراکز درمانی و کلینیک‌های دارای تجهیزات کامل CarboX و PlasmaX",
    scope: "مرکز ارجاع استانی، برگزاری دوره‌های بازآموزی، بهره‌مندی از حداکثر تخفیف‌های تی‌یر B2B",
    badgeColor: "#d97706",
    prereqs: "حداقل ۲ پزشک دارای گواهی سطح ۲ + بازرسی استانداردهای بهداشتی و تجهیزاتی",
  },
];

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdermer.ir").replace(/\/$/, "");

export default function AcademyPage() {
  const clinicalPosts = BLOG_POSTS.filter((p) => p.isPeerReviewed);

  const academyJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/academy#organization`,
        name: "آکادمی علوم پوست دکتر درمر | Dr Dermer Clinical Academy",
        url: `${SITE_URL}/academy`,
        description:
          "مرجع علمی پژوهش‌های فیزیولوژی پوست، آموزش متدهای پیشرفته درمان ترنس‌درمال، کربوکسی‌تراپی بدون سوزن و آنالیز بالینی فرمولاسیون‌های درموسوتیکال.",
        parentOrganization: {
          "@type": "MedicalBusiness",
          name: "دکتر درمر | Dr Dermer Clinical Skin & Health",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/academy#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "آکادمی علوم پوست", item: `${SITE_URL}/academy` },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/academy#learning-paths`,
        name: "مسیرهای یادگیری و دوره‌های مصوب آکادمی",
        itemListElement: LEARNING_PATHS.map((track, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: track.title,
          url: `${SITE_URL}/blog/${track.slug}`,
          description: `${track.level} - تارگت: ${track.targetIndications}`,
        })),
      },
    ],
  };

  return (
    <div style={{ padding: "40px 0 90px" }}>
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(academyJsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "24px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <span>آکادمی علوم پوست و آموزش بالینی</span>
      </nav>

      {/* ── Academy Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #063935 0%, #0b6e66 60%, #0d4239 100%)",
          color: "#ffffff",
          borderRadius: "24px",
          padding: "48px 40px",
          marginBottom: "40px",
          boxShadow: "0 12px 36px rgba(11, 110, 102, 0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "840px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            <span>🎓</span>
            <span>Dr Dermer Clinical Academy &amp; Knowledge Base</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.7rem)", margin: "0 0 16px", lineHeight: "1.4", fontWeight: 900 }}>
            آکادمی تخصصی علوم پوست، مسیرهای یادگیری و استانداردهای بالینی
          </h1>
          <p style={{ fontSize: "1.02rem", lineHeight: "1.9", opacity: 0.92, margin: "0 0 28px" }}>
            مرجع علمی پژوهش‌های فیزیولوژی پوست، متدهای پیشرفته درمان ترنس‌درمال، آنالیز بالینی ترکیبات دارویی و
            استانداردهای جهانی درماتولوژی با مسیرهای یادگیری تفکیک‌شده ویژه پزشکان و بیوتی‌تراپیست‌ها.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="#learning-paths"
              style={{
                background: "#ffffff",
                color: "#084f4a",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            >
              مشاهده مسیرهای آموزشی ↓
            </Link>
            <Link
              href="/b2b/protocols"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              پروتکل‌های مصوب کابین →
            </Link>
            <Link
              href="/b2b/workshops"
              style={{
                background: "var(--accent)",
                color: "#18221d",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              تقویم ورکشاپ‌های دارای سرتیفیکیت 📜
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scientific Advisory Board ── */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "18px",
          padding: "24px 30px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-deep)", fontWeight: 800, fontSize: "1.05rem" }}>
            <span>🛡️</span>
            <span>هیئت بازبینی علمی و استانداردهای بالینی (Scientific Advisory Board)</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "0.86rem", color: "var(--muted)", lineHeight: "1.8" }}>
            تمامی دوره‌ها، سرفصل‌های آموزشی و پروتکل‌های اجرایی این آکادمی توسط متخصصین درماتولوژی و فرمولاتورهای ارشد
            بررسی و با استانداردهای CME اروپا و مقالات نمایه شده در PubMed مطابقت داده می‌شوند.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ background: "var(--paper)", padding: "10px 16px", borderRadius: "10px", textAlign: "center", border: "1px solid var(--line)" }}>
            <span style={{ display: "block", fontWeight: 800, color: "var(--brand-deep)", fontSize: "0.9rem" }}>دکتر مریم سهرابی</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>بورد تخصصی درماتولوژی و لیزر</span>
          </div>
          <div style={{ background: "var(--paper)", padding: "10px 16px", borderRadius: "10px", textAlign: "center", border: "1px solid var(--line)" }}>
            <span style={{ display: "block", fontWeight: 800, color: "var(--brand-deep)", fontSize: "0.9rem" }}>مهندس کیانوش راد</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>فرمولاتور ارشد کازمتیک (عضو IFSCC)</span>
          </div>
        </div>
      </section>

      {/* ── Section: Structured Learning Paths ── */}
      <section id="learning-paths" style={{ marginBottom: "50px" }}>
        <div style={{ marginBottom: "26px" }}>
          <div className="eyebrow">Structured Curriculum & Learning Tracks</div>
          <h2 style={{ fontSize: "1.7rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
            مسیرهای آموزشی آکادمی (تفکیک‌شده بر اساس سطح تخصص)
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            دوره‌های مدون گام‌به‌گام با تعریف دقیق پیش‌نیازها، سطح مجاز فعالیت و شروط اعطای مدرک
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px" }}>
          {LEARNING_PATHS.map((track) => (
            <div
              key={track.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "18px",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-card)",
                borderTop: "4px solid var(--brand)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand-deep)",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {track.badge}
                </span>
                <span style={{ fontSize: "0.76rem", color: "var(--muted)" }}>⏱️ {track.duration}</span>
              </div>

              <h3 style={{ fontSize: "1.2rem", margin: "0 0 10px", color: "var(--brand-deep)", lineHeight: "1.4" }}>
                {track.title}
              </h3>

              <div
                style={{
                  display: "inline-block",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--brand)",
                  marginBottom: "12px",
                  alignSelf: "flex-start",
                }}
              >
                🎯 {track.level}
              </div>

              <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.8", margin: "0 0 14px", flexGrow: 1 }}>
                {track.description}
              </p>

              <div
                style={{
                  background: "var(--paper)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "0.78rem",
                  marginBottom: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  border: "1px solid var(--line)",
                }}
              >
                <div>
                  <strong style={{ color: "var(--brand-deep)" }}>پیش‌نیاز علمی:</strong>{" "}
                  <span style={{ color: "var(--muted)" }}>{track.prerequisites}</span>
                </div>
                <div>
                  <strong style={{ color: "var(--brand-deep)" }}>تارگت‌های بالینی:</strong>{" "}
                  <span style={{ color: "var(--muted)" }}>{track.targetIndications}</span>
                </div>
                <div>
                  <strong style={{ color: "#047857" }}>شرط اخذ گواهینامه:</strong>{" "}
                  <span style={{ color: "var(--muted)" }}>{track.certificationRequirement}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Link
                  href={`/blog/${track.slug}`}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    color: "var(--brand-deep)",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    textDecoration: "none",
                  }}
                >
                  سرفصل و متدها ←
                </Link>
                <Link
                  href="/b2b#wizard-section"
                  style={{
                    background: "var(--accent)",
                    color: "#18221d",
                    padding: "9px 16px",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "0.84rem",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  رزرو دوره ✉
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Certification Requirements & Levels ── */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "36px 30px",
          marginBottom: "50px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ marginBottom: "26px" }}>
          <div className="eyebrow">Professional Certification Levels</div>
          <h2 style={{ fontSize: "1.6rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
            سطوح سرتیفیکیت رسمی و اعتبارسنجی درمانگران
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            معیارهای ۳ گانه آکادمی جهت صدور گواهی ممهور به مهر هیئت علمی و استعلام در دایرکتوری مراکز مجاز
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px", marginBottom: "24px" }}>
          {CERTIFICATION_LEVELS.map((c) => (
            <div
              key={c.levelNumber}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                borderTop: `4px solid ${c.badgeColor}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span
                  style={{
                    background: c.badgeColor,
                    color: "#ffffff",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "0.84rem",
                  }}
                >
                  {c.levelNumber}
                </span>
                <span style={{ fontSize: "0.76rem", color: "var(--muted)", fontWeight: 700 }}>
                  {c.targetGroup.split("،")[0]}
                </span>
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "var(--brand-deep)" }}>
                {c.title}
              </h4>
              <p style={{ margin: "0 0 12px", fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7", flexGrow: 1 }}>
                <strong>حیطه اختیارات:</strong> {c.scope}
              </p>
              <div
                style={{
                  background: "var(--surface)",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  fontSize: "0.76rem",
                  color: "var(--ink)",
                }}
              >
                <strong>شرایط و پیش‌نیاز:</strong> {c.prereqs}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            borderTop: "1px dashed var(--line)",
            paddingTop: "20px",
          }}
        >
          <div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>
            📜 تمامی مدارک اعطایی دارای QR Code اختصاصی استعلام اصالت در سرورهای بین‌المللی آکادمی هستند.
          </div>
          <Link
            href="/b2b#wizard-section"
            style={{
              background: "var(--accent)",
              color: "#18221d",
              padding: "10px 22px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            درخواست ارزیابی مدارک و ثبت‌نام دوره ←
          </Link>
        </div>
      </section>

      {/* ── Section: Peer-Reviewed Scientific Articles ── */}
      <section style={{ marginBottom: "50px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="eyebrow">Evidence-Based Research</div>
            <h2 style={{ fontSize: "1.7rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
              مقالات و شواهد بالینی داوری‌شده
            </h2>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              تحلیل‌های تخصصی با استنادات معتبر علمی و بیوشیمی دارویی
            </p>
          </div>
          <Link href="/blog" className="text-link" style={{ fontWeight: 700 }}>
            مشاهده آرشیو همه مقالات وبلاگ ←
          </Link>
        </div>

        <div className="blog-grid">
          {clinicalPosts.map((post) => (
            <article key={post.slug} className="blog-card" style={{ borderTop: "4px solid var(--brand)" }}>
              <div className="blog-card-top">
                <span className="blog-category">{post.category}</span>
                <small>{new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt))}</small>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              {post.reviewer && (
                <div style={{ fontSize: "0.78rem", color: "#047857", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>✓</span>
                  <span>تأییدیه داور: {post.reviewer.name}</span>
                </div>
              )}
              <div className="blog-card-footer">
                <span>⏱️ {new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه</span>
                <Link href={`/blog/${post.slug}`} className="text-link">
                  مطالعه کامل مقاله ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
