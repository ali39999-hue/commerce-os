import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "../../lib/blog";
import { INGREDIENT_ENCYCLOPEDIA } from "../../lib/ingredients";

export const metadata: Metadata = {
  title: "آکادمی علوم پوست و پروتکل‌های بالینی | دکتر درمر انگلستان",
  description:
    "پایگاه دانش تخصصی پوست و مو، آموزش پروتکل‌های کربوکسی‌تراپی بدون سوزن، لایه‌برداری و درمان‌های سد دفاعی ویژه پزشکان، درماتولوژیست‌ها و بیوتی‌تراپیست‌ها.",
};

const PROTOCOL_TRACKS = [
  {
    id: "bohr-carboxy",
    title: "کربوکسی‌تراپی بدون سوزن و پدیده بوهر",
    level: "پروتکل کلینیکی پیشرفته",
    duration: "۴۵ دقیقه / جلسه",
    target: "تیرگی اطراف چشم، خطوط بیانی، تیرگی بافت، ادم لنفاوی",
    slug: "bohr-effect-carboxy-therapy-needle-free",
    badge: "Bohr Effect Certified",
  },
  {
    id: "barrier-repair",
    title: "بازسازی سد پوستی و ریکاوری پست-پروسیجر",
    level: "مراقبت تهاجمی و نیمه‌تهاجمی",
    duration: "فاز ۱ تا ۳۰ روزه",
    target: "لیزر CO₂ فرکشنال، میکرونیدلینگ RF، پیلینگ شیمیایی",
    slug: "skin-barrier-restoration-post-procedure",
    badge: "Post-Laser Recovery",
  },
  {
    id: "pigment-protocol",
    title: "مهار چندمسیره ملانوژنز و درمان ملاسما",
    level: "درمان رتینوئیدی بافرشده",
    duration: "دوره ۸ الی ۱۲ هفته‌ای",
    target: "ملاسما، کک‌ومک، لکه‌های پس‌التهابی (PIH)",
    slug: "protocol-hyperpigmentation-retinol-niacinamide",
    badge: "Melasma Target",
  },
  {
    id: "peptide-matrix",
    title: "ریمادلینگ ماتریکس خارج‌سلولی با مس‌پپتید GHK-Cu",
    level: "بیوتکنولوژی ضدپیری",
    duration: "روتین بالینی روز و شب",
    target: "اسکارهای آتروفیک، افتادگی بافت، چروک‌های استاتیک",
    slug: "signal-peptides-vs-copper-peptides",
    badge: "ECM Remodeling",
  },
];

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

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
        "@id": `${SITE_URL}/academy#protocols`,
        name: "پروتکل‌های آموزشی و بالینی مصوب",
        itemListElement: PROTOCOL_TRACKS.map((track, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: track.title,
          url: `${SITE_URL}/blog/${track.slug}`,
          description: `${track.level} - تارگت: ${track.target}`,
        })),
      },
    ],
  };

  return (
    <div style={{ padding: "40px 0 90px" }}>
      {/* ── JSON-LD Structured Data (EducationalOrganization, BreadcrumbList, ItemList) ── */}
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
        <div style={{ maxWidth: "800px" }}>
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
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", margin: "0 0 16px", lineHeight: "1.4", fontWeight: 900 }}>
            آکادمی تخصصی علوم پوست و پروتکل‌های بالینی
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.9", opacity: 0.92, margin: "0 0 28px" }}>
            مرجع علمی پژوهش‌های فیزیولوژی پوست، متدهای پیشرفته درمان ترنس‌درمال، آنالیز بالینی ترکیبات دارویی و
            استانداردهای جهانی درماتولوژی برای پزشکان متخصص، کلینیک‌های زیبایی و محققان کازمتیک.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="#protocols"
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
              مشاهده پروتکل‌های درمانی ↓
            </Link>
            <Link
              href="/ingredients"
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
              دانشنامه ترکیبات فعال (INCI) →
            </Link>
            <Link
              href="/b2b#workshops"
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
              ورکشاپ‌ها و دوره‌های دارای سرتیفیکیت 📜
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scientific Review Board ── */}
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
            تمامی مقالات، دوزهای درمانی و پروتکل‌های اجرایی این آکادمی توسط متخصصین درماتولوژی و شیمیست‌های فرمولاتور
            بررسی و با مقالات معتبر نمایه شده در PubMed و Cochrane مطابقت داده می‌شوند.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "var(--paper)", padding: "10px 16px", borderRadius: "10px", textAlign: "center", border: "1px solid var(--line)" }}>
            <span style={{ display: "block", fontWeight: 800, color: "var(--brand-deep)", fontSize: "0.9rem" }}>دکتر مریم سهرابی</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>بورد تخصصی پوست، مو و زیبایی</span>
          </div>
          <div style={{ background: "var(--paper)", padding: "10px 16px", borderRadius: "10px", textAlign: "center", border: "1px solid var(--line)" }}>
            <span style={{ display: "block", fontWeight: 800, color: "var(--brand-deep)", fontSize: "0.9rem" }}>مهندس کیانوش راد</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>شیمیست ارشد آرایشی (عضو IFSCC)</span>
          </div>
        </div>
      </section>

      {/* ── Section: Treatment Protocol Guides ── */}
      <section id="protocols" style={{ marginBottom: "50px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div className="eyebrow">Treatment Regimens & Guidelines</div>
          <h2 style={{ fontSize: "1.7rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
            پروتکل‌های استاندارد درمانی کلینیکال
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            دستورالعمل‌های مرحله‌به‌مرحله با تعیین دوزهای فارماکولوژیک، موارد منع مصرف و اندیکاسیون‌های بالینی
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {PROTOCOL_TRACKS.map((track) => (
            <div
              key={track.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "18px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-card)",
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
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>⏱️ {track.duration}</span>
              </div>
              <h3 style={{ fontSize: "1.15rem", margin: "0 0 10px", color: "var(--ink)", lineHeight: "1.5" }}>
                {track.title}
              </h3>
              <div style={{ fontSize: "0.82rem", color: "var(--brand)", fontWeight: 700, marginBottom: "8px" }}>
                سطح پروتکل: {track.level}
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.7", flexGrow: 1, marginBottom: "16px" }}>
                <strong>اندیکاسیون:</strong> {track.target}
              </p>
              <Link
                href={`/blog/${track.slug}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  color: "var(--brand-deep)",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  textDecoration: "none",
                }}
              >
                مطالعه راهنمای کامل پروتکل ←
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Clinical Procedure Videos & Protocol Guides ── */}
      <section style={{ marginBottom: "50px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div className="eyebrow">Video Demonstrations & Clinical Protocols</div>
          <h2 style={{ fontSize: "1.7rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
            ویدیوهای آموزشی پروسیجر و مستندات بالینی
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            مشاهده اجرای گام‌به‌گام متدهای بالینی توسط متخصصین پوست همراه با راهنماهای مکتوب قابل دانلود
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                background: "#063935",
                borderRadius: "12px",
                height: "170px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.5rem",
                  marginBottom: "8px",
                  backdropFilter: "blur(4px)",
                }}
              >
                ▶
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>ویدیوی عملیاتی هندزآن</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>مدت: ۱۲ دقیقه • کیفیت HD</span>
            </div>
            <h3 style={{ fontSize: "1.08rem", margin: "0 0 8px", color: "var(--ink)", lineHeight: "1.5" }}>
              نحوه اپلیکیشن ژل کربوکسی ۱۵۰۰ml و پدهای اکتیواتور صورت
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.7", flexGrow: 1, margin: "0 0 14px" }}>
              آموزش صحیح پخش لایه ۲ میلی‌متری ژل، تکنیک اتصال شیت بدون حبس هوا و اندازه‌گیری واکنش گرمازای ترنس‌درمال.
            </p>
            <Link
              href="/blog/bohr-effect-carboxy-therapy-needle-free"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--brand-deep)",
                padding: "8px 14px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.84rem",
                textDecoration: "none",
              }}
            >
              مشاهده راهنما و دستورالعمل پروتکل ←
            </Link>
          </div>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                background: "#0f766e",
                borderRadius: "12px",
                height: "170px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.5rem",
                  marginBottom: "8px",
                  backdropFilter: "blur(4px)",
                }}
              >
                ▶
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>ویدیوی کلینیکال لایه‌بندی</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>مدت: ۹ دقیقه • کیفیت HD</span>
            </div>
            <h3 style={{ fontSize: "1.08rem", margin: "0 0 8px", color: "var(--ink)", lineHeight: "1.5" }}>
              مدیریت رتینوئیدهای انکپسوله در درمان لک‌های مقاوم ملاسما
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.7", flexGrow: 1, margin: "0 0 14px" }}>
              بررسی هم‌افزایی نیاسینامید بافرشده و ترانگزامیک اسید در مهار فلاشینگ و پیشگیری از هایپرپیگمانتاسیون پس‌التهابی.
            </p>
            <Link
              href="/blog/protocol-hyperpigmentation-retinol-niacinamide"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--brand-deep)",
                padding: "8px 14px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.84rem",
                textDecoration: "none",
              }}
            >
              مشاهده راهنما و دستورالعمل پروتکل ←
            </Link>
          </div>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                background: "#1e293b",
                borderRadius: "12px",
                height: "170px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.5rem",
                  marginBottom: "8px",
                  backdropFilter: "blur(4px)",
                }}
              >
                ▶
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>ویدیوی ریکاوری پست-پروسیجر</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>مدت: ۱۵ دقیقه • کیفیت 4K</span>
            </div>
            <h3 style={{ fontSize: "1.08rem", margin: "0 0 8px", color: "var(--ink)", lineHeight: "1.5" }}>
              پروتکل بازسازی اورژانسی سد دفاعی پس از لیزر CO₂ فرکشنال
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.7", flexGrow: 1, margin: "0 0 14px" }}>
              مدیریت ۴۸ ساعت اولیه، استفاده از نسبت طلایی ۳:۱:۱ سرامیدها و تسکین التهاب اریتما با غلظت بالای مادکاسوساید.
            </p>
            <Link
              href="/blog/skin-barrier-restoration-post-procedure"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--brand-deep)",
                padding: "8px 14px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.84rem",
                textDecoration: "none",
              }}
            >
              مشاهده راهنما و دستورالعمل پروتکل ←
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section: Certified Practitioner Roadmap ── */}
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
        <div style={{ marginBottom: "28px" }}>
          <div className="eyebrow">Professional Accreditation Roadmap</div>
          <h2 style={{ fontSize: "1.6rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
            نقشه راه اخذ گواهینامه پزشک و درمانگر معتمد آکادمی (Certified Practitioner)
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            مسیر ۴ مرحله‌ای دستیابی به سرتیفیکیت معتبر درماتولوژی، ثبت در دایرکتوری مراکز مورد تأیید و تخفیف‌های ویژه سازمانی
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ background: "var(--brand)", color: "#ffffff", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.9rem", marginBottom: "12px" }}>
              ۱
            </div>
            <h4 style={{ margin: "0 0 8px", fontSize: "1.02rem", color: "var(--brand-deep)" }}>
              آموزش تئوری و فیزیولوژی
            </h4>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7" }}>
              تسلط بر مبانی فیزیکی انتشار گاز CO₂، اثر بوهر در آزادسازی اکسیژن موضعی و تحلیل تداخلات فارماکولوژی مواد مؤثره.
            </p>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ background: "var(--brand)", color: "#ffffff", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.9rem", marginBottom: "12px" }}>
              ۲
            </div>
            <h4 style={{ margin: "0 0 8px", fontSize: "1.02rem", color: "var(--brand-deep)" }}>
              کارگاه عملی و هندزآن
            </h4>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7" }}>
              شرکت در کارگاه حضوری، تمرین پروسیجر روی کیس زنده و یادگیری تکنیک‌های ترکیبی با اولتراسوند و مزوتراپی.
            </p>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ background: "var(--brand)", color: "#ffffff", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.9rem", marginBottom: "12px" }}>
              ۳
            </div>
            <h4 style={{ margin: "0 0 8px", fontSize: "1.02rem", color: "var(--brand-deep)" }}>
              ارزیابی کیس‌های بالینی
            </h4>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7" }}>
              ثبت مستندات قبل و بعد و ارزیابی اثربخشی حداقل ۵ کیس درمانی در مطب تحت نظارت منتورشیپ هیئت علمی آکادمی.
            </p>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid #a7f3d0", borderRadius: "14px", padding: "20px" }}>
            <div style={{ background: "#059669", color: "#ffffff", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.9rem", marginBottom: "12px" }}>
              ۴
            </div>
            <h4 style={{ margin: "0 0 8px", fontSize: "1.02rem", color: "#065f46" }}>
              اعطای سرتیفیکیت و پلاک
            </h4>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#047857", lineHeight: "1.7" }}>
              اعطای گواهی رسمی، اعطای پلاک کلینیک معتمد، درج در نقشه مراکز مجاز کشور و فعال‌سازی تخفیف‌های ویژه سطح ۳ B2B.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderTop: "1px dashed var(--line)", paddingTop: "20px" }}>
          <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
            📜 دوره‌ها منطبق بر آخرین استانداردهای بازآموزی CME اروپا و مورد تأیید متخصصین درماتولوژی بریتانیا است.
          </div>
          <Link
            href="/b2b#workshops"
            style={{
              background: "var(--accent)",
              color: "#18221d",
              padding: "10px 24px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            شروع فرآیند ثبت‌نام در دوره معتمد ←
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

      {/* ── Section: Quick Ingredient Encyclopedia Preview ── */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "36px 30px",
          marginBottom: "40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="eyebrow">Cosmeceutical Dictionary</div>
            <h2 style={{ fontSize: "1.5rem", color: "var(--brand-deep)", margin: "4px 0 8px" }}>
              دانشنامه مواد مؤثره و تحلیل‌های INCI
            </h2>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              بررسی نقش بیولوژیک، پروفایل ایمنی CIR، تداخلات و سینرژی‌های دارویی
            </p>
          </div>
          <Link
            href="/ingredients"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand-deep)",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            مشاهده تمام ترکیبات فعال ({new Intl.NumberFormat("fa-IR").format(INGREDIENT_ENCYCLOPEDIA.length)} ماده) ←
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {INGREDIENT_ENCYCLOPEDIA.slice(0, 4).map((ing) => (
            <div
              key={ing.id}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "14px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginBottom: "4px" }}>{ing.chemicalClass}</div>
              <h4 style={{ margin: "0 0 6px", fontSize: "0.98rem", color: "var(--brand-deep)" }}>{ing.nameFa}</h4>
              <div style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "monospace", direction: "ltr", textAlign: "right", marginBottom: "8px" }}>
                {ing.inciName}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7", flexGrow: 1, margin: "0 0 12px" }}>
                {ing.clinicalRole}
              </p>
              <Link href={`/ingredients#${ing.slug}`} style={{ fontSize: "0.82rem", color: "var(--brand)", fontWeight: 700 }}>
                مشخصات کامل و ایمنی CIR ←
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── B2B CTA Banner ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #18221d 0%, #0d4239 100%)",
          color: "#ffffff",
          borderRadius: "20px",
          padding: "36px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div style={{ maxWidth: "650px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "1.45rem", color: "#ffffff" }}>
            ویژه کلینیک‌ها، پزشکان و بیوتی‌تراپیست‌ها
          </h3>
          <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: "1.8", opacity: 0.88 }}>
            جهت دسترسی به پک‌های حرفه‌ای کابین (CarboxyGel 1500ml)، نرخ‌های عمده‌فروشی پلکانی، ثبت‌نام ورکشاپ‌های تخصصی و
            احراز هویت پروانه مطب، به پورتال حرفه‌ای B2B ما بپیوندید.
          </p>
        </div>
        <Link
          href="/b2b"
          style={{
            background: "var(--accent)",
            color: "#18221d",
            padding: "14px 28px",
            borderRadius: "12px",
            fontWeight: 800,
            fontSize: "0.96rem",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ورود به پورتال پزشکان و کلینیک‌ها ←
        </Link>
      </section>
    </div>
  );
}
