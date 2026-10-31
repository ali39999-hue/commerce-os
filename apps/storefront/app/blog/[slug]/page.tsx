import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS, getPost } from "../../../lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "مقاله یافت نشد" };
  return {
    title: `${post.title} | آکادمی تخصصی علوم پوست و درماتولوژی`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalScholarlyArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    ...(post.reviewer
      ? {
          reviewedBy: {
            "@type": "Person",
            name: post.reviewer.name,
            jobTitle: post.reviewer.role,
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "Commerce OS Clinical Academy & Storefront",
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "fa-IR",
  };

  return (
    <article className="blog-post-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumbs-nav">
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/academy">آکادمی علوم پوست</Link>
        <span>/</span>
        <Link href="/blog">وبلاگ و مقالات</Link>
        <span>/</span>
        <span>{post.title}</span>
      </nav>

      <header className="blog-post-header">
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
          <span className="blog-category">{post.category}</span>
          {post.isPeerReviewed && (
            <span
              style={{
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #10b981",
                fontSize: "0.76rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ✓ داوری‌شده همتا (Peer-Reviewed)
            </span>
          )}
        </div>

        <h1>{post.title}</h1>

        <div className="blog-post-meta">
          <span>✍️ {post.author}</span>
          <span>📅 {new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt))}</span>
          <span>⏱️ {new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه تخصصی</span>
        </div>

        {/* Scientific Reviewer Badge */}
        {post.reviewer && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 18px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#16a34a",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#14532d", fontSize: "0.95rem" }}>
                  {post.reviewer.badgeLabel}: {post.reviewer.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#166534" }}>
                  {post.reviewer.role} {post.reviewer.medicalCouncilOrId && `· ${post.reviewer.medicalCouncilOrId}`}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#15803d", background: "#dcfce7", padding: "4px 10px", borderRadius: "8px" }}>
              تاریخ بازبینی علمی: {post.reviewer.reviewDate}
            </div>
          </div>
        )}
      </header>

      {/* Clinical Protocol Summary Box if applicable */}
      {post.clinicalProtocol && (
        <section
          style={{
            margin: "0 0 28px 0",
            padding: "22px 24px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "1px solid #cbd5e1",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "1.15rem", color: "var(--brand-deep)" }}>
              📋 خلاصه پروتکل و اندیکاسیون بالینی
            </h2>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>منطبق بر گایدلاین‌های کلینیکی ۲۰۲۶</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "16px" }}>
            <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <strong style={{ display: "block", color: "#475569", fontSize: "0.82rem", marginBottom: "4px" }}>
                اندیکاسیون هدف (Primary Indication):
              </strong>
              <span style={{ fontSize: "0.88rem", color: "#0f172a" }}>{post.clinicalProtocol.primaryIndication}</span>
            </div>
            <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <strong style={{ display: "block", color: "#475569", fontSize: "0.82rem", marginBottom: "4px" }}>
                تیپ پوستی مناسب (Target Skin Type):
              </strong>
              <span style={{ fontSize: "0.88rem", color: "#0f172a" }}>{post.clinicalProtocol.skinTypeTarget}</span>
            </div>
          </div>

          {post.clinicalProtocol.contraindications.length > 0 && (
            <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px" }}>
              <strong style={{ color: "#9f1239", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                ⚠️ موارد منع مصرف و احتیاطات (Contraindications):
              </strong>
              <ul style={{ margin: 0, paddingRight: "20px", fontSize: "0.85rem", color: "#881337", lineHeight: "1.8" }}>
                {post.clinicalProtocol.contraindications.map((ci, idx) => (
                  <li key={idx}>{ci}</li>
                ))}
              </ul>
            </div>
          )}

          {post.clinicalProtocol.regimenSteps && post.clinicalProtocol.regimenSteps.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--brand-deep)", marginBottom: "8px" }}>
                مراحل اجرای پروتکل (Regimen Flow):
              </strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {post.clinicalProtocol.regimenSteps.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--brand)", fontSize: "0.88rem" }}>{s.step}: </strong>
                      <span style={{ fontSize: "0.85rem", color: "#334155" }}>{s.instruction}</span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.76rem",
                        color: "#0284c7",
                        background: "#e0f2fe",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.clinicalProtocol.keyIngredients.length > 0 && (
            <div>
              <strong style={{ display: "block", fontSize: "0.84rem", color: "#475569", marginBottom: "6px" }}>
                مواد مؤثره کلیدی پروتکل:
              </strong>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {post.clinicalProtocol.keyIngredients.map((ing) => (
                  <Link
                    key={ing}
                    href="/ingredients"
                    style={{
                      background: "var(--brand-tint)",
                      color: "var(--brand-deep)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    🔬 {ing}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Main Content Body */}
      <div className="blog-post-body">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Bibliography References */}
      {post.bibliography && post.bibliography.length > 0 && (
        <section
          style={{
            marginTop: "32px",
            padding: "20px 24px",
            background: "#fafafa",
            border: "1px solid #e5e5e5",
            borderRadius: "14px",
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: "1rem", color: "var(--brand-deep)", display: "flex", alignItems: "center", gap: "8px" }}>
            📚 مراجع علمی و مقالات مرجع (Bibliography & Clinical Evidence)
          </h3>
          <ol style={{ margin: 0, paddingRight: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {post.bibliography.map((ref, idx) => (
              <li key={idx} style={{ fontSize: "0.84rem", color: "#4b5563", lineHeight: "1.7" }} dir="ltr">
                <div>{ref.citation}</div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                  <em>{ref.journal}</em> ({ref.year})
                  {ref.doiOrUrl && (
                    <>
                      {" · "}
                      <a
                        href={ref.doiOrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0284c7", textDecoration: "underline" }}
                      >
                        [Link / DOI]
                      </a>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Tags and Navigation */}
      <footer className="blog-post-footer">
        <div className="blog-tags">
          {post.tags.map((t) => (
            <span key={t} className="blog-tag">
              #{t}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <Link href="/academy" className="text-link">
            ← بازگشت به آکادمی
          </Link>
          <Link href="/blog" className="text-link">
            همه مقالات
          </Link>
        </div>
      </footer>
    </article>
  );
}
