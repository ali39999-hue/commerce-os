'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { ClinicalArticleCard } from './clinical-article-card';
import './rupak-articles-section.css';

const FEATURED_ARTICLES = [
  {
    slug: 'bohr-effect-carboxy-therapy-needle-free',
    title: 'مکانیسم اثر گاز دی‌اکسید کربن در کربوکسی‌تراپی بدون سوزن (Bohr Effect)',
    category: 'کربوکسی‌تراپی و تکنولوژی',
    excerpt:
      'بررسی فیزیولوژی تبادل گاز CO₂ از اپیدرم به بسترهای مویرگی، افت موضعی pH و آزادسازی انفجاری اکسیژن توسط هموگلوبین در لایه‌های درم.',
    image: '/assets/rupak/articles/art-carboxy-bohr.jpg',
    readingMinutes: 9,
    publishedAt: '2026-10-28T09:00:00Z',
  },
  {
    slug: 'protocol-hyperpigmentation-retinol-niacinamide',
    title: 'پروتکل درمان لک و تیرگی با رتینول انکپسوله و نیاسینامید',
    category: 'دانشنامه ترکیبات فعال',
    excerpt:
      'هم‌افزایی بیولوژیک رتینوئیدهای لیپوزومال با ویتامین B3 در مهار چندمسیره ملانوژنز و تقویت سد لیپیدی بدون ایجاد درماتیت رتینوئیدی.',
    image: '/assets/rupak/articles/art-retinol-layering.jpg',
    readingMinutes: 8,
    publishedAt: '2026-10-27T11:00:00Z',
  },
  {
    slug: 'skin-barrier-restoration-post-procedure',
    title: 'راهنمای ترمیم سد دفاعی پوست پس از لیزر و میکرونیدلینگ',
    category: 'ترمیم سد دفاعی',
    excerpt:
      'مدیریت فیزیولوژیک فاز حاد التهاب و نوسازی بافت پوششی با کمپلکس سرامیدهای بیومیمتیک، مادکاسوساید و زینک پس از درمان‌های کلینیکال.',
    image: '/assets/rupak/articles/art-barrier-repair.jpg',
    readingMinutes: 10,
    publishedAt: '2026-10-25T14:30:00Z',
  },
  {
    slug: 'signal-peptides-vs-copper-peptides',
    title: 'مقایسه پپتیدهای سیگنال‌دهنده و مس‌پپتید (GHK-Cu) در جوان‌سازی',
    category: 'بیوتکنولوژی و ضدپیری',
    excerpt:
      'ارزیابی مقایسه‌ای مکانیسم‌های مولکولی در تحریک سنتز ماتریکس خارج‌سلولی، ریمادلینگ کلاژن، افزایش استحکام درم و سرعت بهبود بافتی.',
    image: '/assets/rupak/articles/art-copper-peptides.jpg',
    readingMinutes: 8,
    publishedAt: '2026-10-24T16:00:00Z',
  },
];

export function RupakArticlesSection() {
  return (
    <section className="rupak-articles-section" aria-labelledby="articles-heading">
      <div className="rupak-articles-container">
        {/* Header Bar */}
        <div className="rupak-articles-header">
          <div className="rupak-articles-lead">
            <div className="rupak-articles-badge">
              <Sparkles className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <span>مرکز نشر دانش و مقالات تخصصی</span>
            </div>
            <h2 id="articles-heading" className="rupak-articles-title">
              دانستنی‌ها، مقالات علمی و راهنماهای بالینی
            </h2>
            <p className="rupak-articles-subtitle">
              بررسی علمی مکانیسم‌های سلولی، پروتکل‌های گام‌به‌گام مراقبت پوستی و راهنماهای جامع خرید آگاهانه
            </p>
          </div>

          <Link href="/blog" className="rupak-articles-all-btn">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>مشاهده همه مقالات</span>
            <ArrowLeft className="w-4 h-4 art-all-arrow" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Cards Grid with New UI */}
        <div className="rupak-articles-grid">
          {FEATURED_ARTICLES.map((article) => (
            <ClinicalArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              category={article.category}
              excerpt={article.excerpt}
              image={article.image}
              readingMinutes={article.readingMinutes}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
