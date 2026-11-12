'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './clinical-article-card.css';

export interface ClinicalArticleCardProps {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  readingMinutes: number;
  publishedAt: string;
  author?: string;
  dateFa?: string;
}

export function ClinicalArticleCard({
  slug,
  title,
  category,
  excerpt,
  image,
  readingMinutes,
  publishedAt,
  author = 'علیرضا حمداللهی',
  dateFa,
}: ClinicalArticleCardProps) {
  // Format Persian Date or use explicit dateFa
  let formattedDate = dateFa;
  if (!formattedDate) {
    try {
      const d = new Date(publishedAt);
      if (!isNaN(d.getTime())) {
        formattedDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(d);
      }
    } catch {
      formattedDate = '۱۲ اردیبهشت ۱۴۰۳';
    }
  }

  return (
    <article className="clinical-article-card">
      <Link href={`/blog/${slug}`} className="art-card-link-wrapper" aria-label={title}>
        {/* Top Image Box with Rounded Corners */}
        <div className="art-card-img-wrap">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="art-card-img"
            priority={false}
          />
        </div>

        {/* Content Box */}
        <div className="art-card-content">
          {/* Title in Deep Green */}
          <h3 className="art-card-title">{title}</h3>

          {/* Subtitle / Meta (Author & Date) */}
          <div className="art-card-meta">
            <span>{author}</span>
            <span className="art-card-dash">–</span>
            <span>{formattedDate}</span>
          </div>

          {/* Excerpt */}
          <p className="art-card-excerpt">{excerpt}</p>

          {/* Bottom Action Button (Soft Green Pill with Arrow) */}
          <div className="art-card-btn">
            <span>جزئیات بیشتر</span>
            <span className="art-card-arrow" aria-hidden="true">←</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
