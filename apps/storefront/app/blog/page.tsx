import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "../../lib/blog";

export const metadata: Metadata = {
  title: "وبلاگ بازارک | راهنمای خرید و دانستنی‌های فروشگاه",
  description: "مقالات آموزشی، راهنمای خرید و اطلاعیه‌های رسمی فروشگاه Commerce OS.",
};

export default function BlogIndexPage() {
  return (
    <section className="blog-layout">
      <header className="blog-header">
        <div className="eyebrow">وبلاگ فروشگاه</div>
        <h1>راهنماها، دانستنی‌ها و اطلاعیه‌ها</h1>
        <p>محتوای تخصصی برای خرید بهتر و آگاهانه‌تر</p>
      </header>

      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
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
    </section>
  );
}
