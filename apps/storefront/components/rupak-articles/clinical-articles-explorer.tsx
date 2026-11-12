'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BlogPost } from '../../lib/blog';
import { ClinicalArticleCard } from './clinical-article-card';
import '../../app/blog/blog.css';

interface ClinicalArticlesExplorerProps {
  initialPosts: BlogPost[];
}

const CATEGORIES = [
  'همه مقالات',
  'پوست و مو',
  'ترمیم و ضدپیری',
  'ترکیبات و مواد مؤثره',
  'پروتکل‌های درمانی',
] as const;

type SortOption = 'newest' | 'oldest' | 'readingTime';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'تازه‌ترین',
  oldest: 'قدیمی‌ترین',
  readingTime: 'زمان مطالعه',
};

export function ClinicalArticlesExplorer({ initialPosts }: ClinicalArticlesExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه مقالات');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // Category Filter
    if (selectedCategory !== 'همه مقالات') {
      result = result.filter((post) => {
        if (post.category === selectedCategory) return true;
        // Also match keywords in post
        if (selectedCategory === 'پوست و مو' && (post.category.includes('پوست') || post.category.includes('مو'))) return true;
        if (selectedCategory === 'ترمیم و ضدپیری' && (post.category.includes('ترمیم') || post.category.includes('ضدپیری'))) return true;
        if (selectedCategory === 'ترکیبات و مواد مؤثره' && (post.category.includes('ترکیبات') || post.category.includes('فرمولاسیون'))) return true;
        if (selectedCategory === 'پروتکل‌های درمانی' && (post.category.includes('پروتکل') || post.category.includes('بالینی') || post.category.includes('تجویز'))) return true;
        return false;
      });
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else if (sortBy === 'readingTime') {
      result.sort((a, b) => a.readingMinutes - b.readingMinutes);
    }

    return result;
  }, [initialPosts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="articles-page-root">
      <div className="articles-container">
        {/* ── Header Row ────────────────────────────────────────── */}
        <header className="articles-header-row">
          <div className="articles-title-group">
            <span className="articles-eyebrow">کتابخانه علمی</span>
            <h1 className="articles-main-title">تازه‌ترین مقالات بالینی</h1>
          </div>

          <div className="articles-header-actions">
            {/* Dynamic Article Count Pill */}
            <span className="articles-count-pill">
              مقاله {filteredPosts.length}
            </span>

            {/* Sort Dropdown */}
            <div className="articles-sort-wrap" ref={sortRef}>
              <button
                type="button"
                className="articles-sort-btn"
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
              >
                <span>مرتب‌سازی: {SORT_LABELS[sortBy]}</span>
                <span className="articles-sort-arrow" aria-hidden="true">⌵</span>
              </button>

              {isSortOpen && (
                <div className="articles-sort-menu" role="listbox">
                  {(['newest', 'oldest', 'readingTime'] as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={sortBy === opt}
                      className={`articles-sort-item ${sortBy === opt ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(opt);
                        setIsSortOpen(false);
                      }}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Filter & Search Row ───────────────────────────────── */}
        <nav className="articles-controls-row" aria-label="فیلتر و جستجوی مقالات">
          {/* Category Pills */}
          <div className="articles-categories-list" role="tablist">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`category-pill-btn ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="articles-search-wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مقالات..."
              className="articles-search-input"
              aria-label="جستجو در مقالات"
            />
            {searchQuery && (
              <button
                type="button"
                className="articles-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="پاک کردن متن جستجو"
              >
                ✕
              </button>
            )}
            <span className="articles-search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
        </nav>

        {/* ── 4-Column Articles Grid ────────────────────────────── */}
        <div className="articles-cards-grid" role="feed" aria-busy="false">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <ClinicalArticleCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                category={post.category}
                excerpt={post.excerpt}
                image={post.image || '/assets/rupak/articles/art-dermaceutical-selection.jpg'}
                readingMinutes={post.readingMinutes}
                publishedAt={post.publishedAt}
                author={post.author || 'علیرضا حمداللهی'}
                dateFa={post.dateFa}
              />
            ))
          ) : (
            <div className="articles-empty-state">
              <div className="articles-empty-icon" aria-hidden="true">🔍</div>
              <div className="articles-empty-text">مقاله‌ای با این فیلترها یافت نشد</div>
              <div className="articles-empty-sub">می‌توانید عبارت جستجو را تغییر دهید یا دسته‌بندی دیگری را انتخاب کنید.</div>
              <button
                type="button"
                className="articles-empty-reset-btn"
                onClick={() => {
                  setSelectedCategory('همه مقالات');
                  setSearchQuery('');
                }}
              >
                نمایش همه مقالات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
