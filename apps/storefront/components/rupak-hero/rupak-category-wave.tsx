'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import './rupak-hero.css';

export interface RupakCategoryItem {
  id: string;
  title: string;
  image: string;
  href: string;
  staggerClass: string;
}

const DEFAULT_CATEGORIES: RupakCategoryItem[] = [
  {
    id: 'makeup',
    title: 'لوازم آرایشی',
    image: '/assets/rupak/categories/cat-makeup.jpg',
    href: '/shop',
    staggerClass: 'stagger-1',
  },
  {
    id: 'skincare',
    title: 'مراقبت پوستی',
    image: '/assets/rupak/categories/cat-skincare.jpg',
    href: '/shop',
    staggerClass: 'stagger-2',
  },
  {
    id: 'hygiene',
    title: 'لوازم بهداشتی',
    image: '/assets/rupak/categories/cat-hygiene.jpg',
    href: '/shop',
    staggerClass: 'stagger-3',
  },
  {
    id: 'perfume',
    title: 'عطر و ادکلن',
    image: '/assets/rupak/categories/cat-perfume.jpg',
    href: '/shop',
    staggerClass: 'stagger-4',
  },
  {
    id: 'electric',
    title: 'لوازم برقی',
    image: '/assets/rupak/categories/cat-electric.jpg',
    href: '/plasmax',
    staggerClass: 'stagger-5',
  },
  {
    id: 'health',
    title: 'ابزار سلامت',
    image: '/assets/rupak/categories/cat-health.jpg',
    href: '/carbox',
    staggerClass: 'stagger-6',
  },
];

export interface RupakCategoryWaveProps {
  categories?: RupakCategoryItem[];
}

export function RupakCategoryWave({
  categories = DEFAULT_CATEGORIES,
}: RupakCategoryWaveProps) {
  return (
    <section
      id="rupak-category-wave"
      className="rupak-category-section"
      aria-label="دسته‌بندی‌های برگزیده محصولات"
    >
      <div className="rupak-category-container">
        {/* Peach / Apricot Gradient Box */}
        <div className="rupak-category-box">
          {/* Top Center Cutout Notch directly beneath hero scroll button */}
          <div className="rupak-category-notch" aria-hidden="true" />

          {/* Staggered Wave Cards Grid */}
          <div className="rupak-category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className={`rupak-category-card-wrapper ${cat.staggerClass}`}
                title={`مشاهده دسته‌بندی ${cat.title}`}
              >
                {/* Main White Card Body */}
                <div className="rupak-category-card">
                  {/* Category Image */}
                  <div className="rupak-category-img-wrap">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="rupak-category-img"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="rupak-category-title">{cat.title}</h3>

                  {/* Capsule "مشاهده" Action */}
                  <span className="rupak-category-btn">
                    <span>مشاهده</span>
                    <span className="rupak-category-btn-icon">
                      <ChevronLeft className="w-3 h-3" />
                    </span>
                  </span>
                </div>

                {/* Pedestal / Diamond Stand under card */}
                <div className="rupak-category-stand" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
