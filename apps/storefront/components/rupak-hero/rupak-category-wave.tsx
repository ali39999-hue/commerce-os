'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { listCategories, type CategoryDto } from '../../lib/catalog';
import './rupak-hero.css';

export interface RupakCategoryItem {
  id: string;
  title: string;
  image: string;
  href: string;
  staggerClass: string;
}

export interface RupakCategoryWaveProps {
  categories?: CategoryDto[];
}

function mapCategoriesToWaveItems(cats: CategoryDto[]): RupakCategoryItem[] {
  const storefrontCats = cats
    .filter((c) => c.slug !== 'reeskin' && c.slug !== 'reemed')
    .slice(0, 6);

  return storefrontCats.map((cat, idx) => ({
    id: cat.id || cat.slug,
    title: cat.titleFa,
    image: cat.imageUrl || '/assets/rupak/categories/cat-clinical.png',
    href: `/shop?cat=${encodeURIComponent(cat.slug)}`,
    staggerClass: `stagger-${(idx % 6) + 1}`,
  }));
}

export function RupakCategoryWave({ categories }: RupakCategoryWaveProps) {
  const [liveCategories, setLiveCategories] = useState<CategoryDto[]>(categories ?? []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setLiveCategories(categories);
      return;
    }
    let cancelled = false;
    listCategories().then((res) => {
      if (!cancelled && res.length > 0) setLiveCategories(res);
    });
    return () => {
      cancelled = true;
    };
  }, [categories]);

  const items = mapCategoriesToWaveItems(liveCategories);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="rupak-category-wave"
      className="rupak-category-section"
      aria-label="دسته‌بندی‌های تخصصی مراقبت پوست روپاک"
    >
      <div className="rupak-category-container">
        <div className="rupak-category-box">
          <div className="rupak-category-notch-wrapper">
            <svg
              className="rupak-notch-svg"
              viewBox="0 0 280 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 0 0
                   C 40 0, 52 46, 88 46
                   L 192 46
                   C 228 46, 240 0, 280 0
                   Z"
                fill="#ffffff"
              />
            </svg>

            <div
              className="rupak-category-notch-badge font-mybaby"
              style={{ fontFamily: "'MyBaby', 'MyBaby Chubby', 'MyBaby-Chubby', cursive, sans-serif" }}
            >
              <span className="rupak-notch-sparkle-icon" aria-hidden="true">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </span>
              <span
                className="rupak-notch-title font-mybaby"
                style={{
                  fontFamily: "'MyBaby', 'MyBaby Chubby', 'MyBaby-Chubby', cursive, sans-serif",
                  fontWeight: 900,
                  fontSize: '16.5px',
                  letterSpacing: '-0.02em',
                }}
              >
                دسته‌بندی‌های برگزیده
              </span>
            </div>
          </div>

          <div className="rupak-category-grid">
            {items.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className={`rupak-category-card-wrapper ${cat.staggerClass}`}
                title={`مشاهده دسته‌بندی ${cat.title}`}
              >
                <div className="rupak-category-card">
                  <div className="rupak-category-img-wrap">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="rupak-category-img"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="rupak-category-title">{cat.title}</h3>

                  <span className="rupak-category-btn">
                    <span>مشاهده</span>
                    <span className="rupak-category-btn-icon">
                      <ChevronLeft className="w-3 h-3" />
                    </span>
                  </span>
                </div>

                <div className="rupak-category-stand" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
