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
    title: `${post.title} | وبلاگ بازارک`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Commerce OS فروشگاه بازارک" },
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
        <Link href="/blog">وبلاگ</Link>
        <span>/</span>
        <span>{post.title}</span>
      </nav>

      <header className="blog-post-header">
        <span className="blog-category">{post.category}</span>
        <h1>{post.title}</h1>
        <div className="blog-post-meta">
          <span>✍️ {post.author}</span>
          <span>📅 {new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt))}</span>
          <span>⏱️ {new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه</span>
        </div>
      </header>

      <div className="blog-post-body">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <footer className="blog-post-footer">
        <div className="blog-tags">
          {post.tags.map((t) => (
            <span key={t} className="blog-tag">#{t}</span>
          ))}
        </div>
        <Link href="/blog" className="text-link">← بازگشت به وبلاگ</Link>
      </footer>
    </article>
  );
}
