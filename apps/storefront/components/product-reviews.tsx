"use client";

import React, { useEffect, useMemo, useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  title: string;
  body: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

const REVIEWS_KEY = (slug: string) => `commerce_os.reviews.${slug}.v1`;

const SEED_REVIEWS: Record<string, Review[]> = {
  "ethiopian-specialty-coffee": [
    { id: "r1", author: "مهدی ک.", rating: 5, title: "کیفیت برشته‌کاری فوق‌العاده", body: "راستش منتظر یک قهوه با این کیفیت بودم. اسیدیته ملایم و عطر گلی‌اش کاملاً محسوسه. حتماً باز هم می‌خرم.", createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(), verifiedPurchase: true },
    { id: "r2", author: "نگار ص.", rating: 4, title: "خیلی خوب، فقط بسته‌بندی", body: "طعم عالیه ولی ای کاش بسته‌بندی زیپ‌کیپ محکم‌تری داشت.", createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), verifiedPurchase: true },
  ],
  "wireless-headphones": [
    { id: "r1", author: "آرش م.", rating: 5, title: "نویزکنسلینگ واقعی!", body: "تو مترو واقعاً صدای محیط رو حذف می‌کنه. باتری هم واقعاً به ادعای ۴۰ ساعت می‌رسه.", createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(), verifiedPurchase: true },
  ],
};

const GENERIC_SEED: Review[] = [
  { id: "g1", author: "سارا ن.", rating: 5, title: "ارسال سریع و بسته‌بندی عالی", body: "دو روزه رسید، بسته‌بندی خیلی تمیز و ایمن بود. از خرید راضی‌ام.", createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), verifiedPurchase: true },
  { id: "g2", author: "حسین ر.", rating: 4, title: "کیفیت متناسب با قیمت", body: "برای این محدوده قیمتی انتظار بیشتری نداشتم. پیشنهاد می‌کنم.", createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString() },
];

function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`stars stars-${size}`} aria-label={`امتیاز ${value} از ۵`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

export function ProductReviews({ slug, productTitle }: { slug: string; productTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ author: "", title: "", body: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let userReviews: Review[] = [];
    try {
      userReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY(slug)) ?? "[]");
    } catch {}
    setReviews([...userReviews, ...(SEED_REVIEWS[slug] ?? GENERIC_SEED)]);
  }, [slug]);

  const avg = useMemo(
    () => (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0),
    [reviews]
  );

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    for (const r of reviews) dist[r.rating - 1]++;
    return dist;
  }, [reviews]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: `ur_${Date.now()}`,
      author: form.author.trim() || "کاربر فروشگاه",
      rating,
      title: form.title.trim() || "نظر خریدار",
      body: form.body.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };
    if (!review.body) return;

    const nextUser = [review, ...(reviews.filter((r) => !r.id.startsWith("g") && !SEED_REVIEWS[slug]?.some((s) => s.id === r.id)))];
    try { localStorage.setItem(REVIEWS_KEY(slug), JSON.stringify(nextUser)); } catch {}
    setReviews([review, ...reviews]);
    setForm({ author: "", title: "", body: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="reviews-section" id="reviews">
      <h2 className="reviews-title">نظرات و امتیاز خریداران</h2>

      <div className="reviews-summary-grid">
        <div className="reviews-avg-card">
          <strong className="avg-number">{avg ? avg.toFixed(1) : "—"}</strong>
          <Stars value={avg} size="lg" />
          <small>از مجموع {new Intl.NumberFormat("fa-IR").format(reviews.length)} نظر ثبت‌شده</small>
        </div>
        <div className="reviews-dist">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star - 1];
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="dist-row">
                <span className="dist-star">{star} ★</span>
                <div className="dist-bar"><div style={{ width: `${pct}%` }} /></div>
                <span className="dist-count">{new Intl.NumberFormat("fa-IR").format(count)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((r) => (
          <article key={r.id} className="review-card">
            <div className="review-head">
              <div className="review-author">
                <span className="review-avatar">{r.author.slice(0, 1)}</span>
                <div>
                  <strong>{r.author}</strong>
                  {r.verifiedPurchase && <span className="verified-badge">✓ خریدار تأییدشده</span>}
                </div>
              </div>
              <div className="review-meta">
                <Stars value={r.rating} size="sm" />
                <small>{new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(new Date(r.createdAt))}</small>
              </div>
            </div>
            <h4>{r.title}</h4>
            <p>{r.body}</p>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="review-form">
        <h3>تجربه خرید خود را ثبت کنید</h3>

        <div className="star-picker" role="radiogroup" aria-label="انتخاب امتیاز">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={rating === i}
              className={(hoverRating || rating) >= i ? "star-btn filled" : "star-btn"}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i)}
            >★</button>
          ))}
          <span className="star-hint">{["", "خیلی بد", "بد", "متوسط", "خوب", "عالی"][hoverRating || rating]}</span>
        </div>

        <div className="form-grid">
          <label className="form-field"><span>نام شما</span>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-text" placeholder="مثال: محمدی" />
          </label>
          <label className="form-field"><span>عنوان نظر</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-text" placeholder="خلاصه تجربه شما" />
          </label>
        </div>
        <label className="form-field full-width"><span>متن نظر درباره {productTitle}</span>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className="input-textarea" required />
        </label>

        {submitted && <div className="success-banner">✓ نظر شما ثبت شد. پس از تأیید کارشناسان منتشر می‌شود.</div>}

        <button type="submit" className="btn-purchase-action">ثبت نظر</button>
      </form>
    </section>
  );
}
