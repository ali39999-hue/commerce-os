import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "../../lib/blog";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export const metadata: Metadata = {
  title: "وبلاگ و مقالات آموزشی تخصصی | Dr. Dermer UK Clinical Laboratories",
  description: "مقالات تخصصی و بالینی درماتولوژی، راهنماهای خرید آگاهانه، بررسی ترکیبات و پروتکل‌های ترمیم پوست.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const scientificPosts = BLOG_POSTS.filter((p) => p.isPeerReviewed);
  const generalPosts = BLOG_POSTS.filter((p) => !p.isPeerReviewed);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        name: "پایگاه مقالات و دانش درماتولوژی دکتر درمر",
        description: "مقالات تخصصی و بالینی درماتولوژی، راهنماهای خرید آگاهانه، بررسی ترکیبات و پروتکل‌های ترمیم پوست.",
        url: `${SITE_URL}/blog`,
        publisher: {
          "@type": "MedicalBusiness",
          name: "دکتر درمر | Dr. Dermer UK Clinical Laboratories",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "وبلاگ و مقالات", item: `${SITE_URL}/blog` },
        ],
      },
    ],
  };

  return (
    <section className="blog-layout">
      {/* ── JSON-LD Structured Data (Blog, BreadcrumbList) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <header className="blog-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="eyebrow">مرکز نشر دانش و مقالات</div>
            <h1>دانستنی‌ها، مقالات علمی و راهنماهای بالینی</h1>
            <p>محتوای علمی و آموزشی بر پایه شواهد بالینی و استانداردهای درماتولوژی جهانی</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href="/academy"
              style={{
                background: "var(--brand-deep)",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              🎓 ورود به آکادمی تخصصی
            </Link>
            <Link
              href="/ingredients"
              style={{
                background: "var(--surface)",
                color: "var(--brand-deep)",
                border: "1px solid var(--line)",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              🔬 دانشنامه ترکیبات (INCI)
            </Link>
          </div>
        </div>
      </header>

      {/* Peer-Reviewed Scientific Section */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", color: "var(--brand-deep)", margin: 0 }}>
            🔬 مقالات بالینی و داوری‌شده همتا (Peer-Reviewed)
          </h2>
          <span style={{ fontSize: "0.8rem", background: "#ecfdf5", color: "#047857", padding: "2px 10px", borderRadius: "999px", fontWeight: 700 }}>
            تأییدیه متخصص پوست و مو
          </span>
        </div>
        <div className="blog-grid">
          {scientificPosts.map((post) => (
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
                  <span>بازبینی علمی: {post.reviewer.name}</span>
                </div>
              )}
              <div className="blog-card-footer">
                <span>⏱️ {new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه</span>
                <Link href={`/blog/${post.slug}`} className="text-link">
                  مطالعه پروتکل ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* General Storefront & Shopping Guides */}
      {generalPosts.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--ink)", marginBottom: "20px" }}>
            📦 راهنماهای خرید و اطلاعیه‌های عمومی
          </h2>
          <div className="blog-grid">
            {generalPosts.map((post) => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card-top">
                  <span className="blog-category">{post.category}</span>
                  <small>{new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt))}</small>
                </div>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.excerpt}</p>
                <div className="blog-card-footer">
                  <span>⏱️ {new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه</span>
                  <Link href={`/blog/${post.slug}`} className="text-link">
                    ادامه مطلب ←
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
