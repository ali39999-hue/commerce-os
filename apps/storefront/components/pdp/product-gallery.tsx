'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProductMediaItem } from '../../lib/pdp-types';

interface ProductGalleryProps {
  media: ProductMediaItem[];
  productTitle: string;
}

const ROLE_BADGE_MAP: Record<string, { label: string; color: string; short: string }> = {
  HERO: { label: 'تصویر اصلی', color: 'var(--brand)', short: 'اصلی' },
  TEXTURE: { label: 'بافت و فرمولاسیون (Texture)', color: '#b45309', short: 'Texture' },
  IN_CLINIC: { label: 'کاربرد کلینیکال (Clinic)', color: '#0369a1', short: 'Clinic' },
  HOW_TO: { label: 'راهنمای مصرف (In-Use)', color: '#047857', short: 'In-Use' },
  PACKAGING: { label: 'بسته‌بندی و پلمپ', color: '#4338ca', short: 'پلمپ' },
  CERTIFICATE: { label: 'گواهی اصالت', color: '#6d28d9', short: 'گواهی' },
  GALLERY: { label: 'نمای تکمیلی', color: 'var(--muted)', short: 'گالری' },
};

export function ProductGallery({ media, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const activeMedia = media[selectedIndex] || media[0];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isZoomed && e.key === 'Escape') {
        setIsZoomed(false);
      }
    },
    [isZoomed]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const roleMeta = activeMedia ? ROLE_BADGE_MAP[activeMedia.role] ?? { label: activeMedia.roleFa, color: 'var(--brand)', short: activeMedia.roleFa } : null;

  return (
    <div className="pdp-gallery-root" role="region" aria-label="گالری تصاویر و رسانه‌های محصول">
      {/* Main Display Stage */}
      <div className="pdp-gallery-stage">
        {/* Verification & Certification Floating Badges */}
        <div className="pdp-gallery-trust-overlays">
          <span className="pdp-trust-pill verified">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            مورد تایید متخصصین
          </span>
          <span className="pdp-trust-pill medical-ce">
            CE Medical
          </span>
        </div>

        {roleMeta && (
          <span
            className="pdp-gallery-role-badge"
            style={{ backgroundColor: roleMeta.color }}
          >
            {roleMeta.label}
          </span>
        )}

        <button
          type="button"
          className="pdp-gallery-zoom-btn"
          onClick={() => setIsZoomed(true)}
          aria-label="بزرگ‌نمایی تصویر"
          title="بزرگ‌نمایی تصویر"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        <div
          className="pdp-gallery-main-view"
          onClick={() => setIsZoomed(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsZoomed(true);
            }
          }}
          aria-label={`مشاهده بزرگ‌تر ${activeMedia?.altText || productTitle}`}
        >
          {activeMedia && activeMedia.url && !imageError[activeMedia.id] ? (
            <img
              src={activeMedia.url}
              alt={activeMedia.altText}
              className="pdp-gallery-img"
              loading="eager"
              onError={() => setImageError((prev) => ({ ...prev, [activeMedia.id]: true }))}
            />
          ) : (
            <div className="pdp-gallery-art-fallback" aria-hidden="true">
              <span className="pdp-fallback-letter">{productTitle.slice(0, 1)}</span>
              <span className="pdp-fallback-role">{activeMedia?.roleFa || 'نمای محصول'}</span>
            </div>
          )}
        </div>

        {media.length > 1 && (
          <div className="pdp-gallery-nav-arrows">
            <button
              type="button"
              className="pdp-nav-arrow next"
              onClick={handleNext}
              aria-label="تصویر بعدی"
            >
              ›
            </button>
            <button
              type="button"
              className="pdp-nav-arrow prev"
              onClick={handlePrev}
              aria-label="تصویر قبلی"
            >
              ‹
            </button>
          </div>
        )}

        {activeMedia?.caption && (
          <p className="pdp-gallery-caption">{activeMedia.caption}</p>
        )}
      </div>

      {/* Thumbnails strip */}
      {media.length > 1 && (
        <div className="pdp-thumbnails-strip" role="tablist" aria-label="انتخاب تصاویر محصول">
          {media.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const badge = ROLE_BADGE_MAP[item.role];
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`${item.roleFa}: ${item.altText}`}
                className={`pdp-thumb-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedIndex(idx)}
              >
                {item.url && !imageError[item.id] ? (
                  <img src={item.url} alt="" className="pdp-thumb-img" />
                ) : (
                  <div className="pdp-thumb-fallback">
                    <span>{idx + 1}</span>
                  </div>
                )}
                {badge && (
                  <span
                    className="pdp-thumb-tag"
                    style={{ borderColor: badge.color }}
                  >
                    {badge.short}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div
          className="pdp-zoom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="بزرگ‌نمایی تصویر کالا"
          onClick={() => setIsZoomed(false)}
        >
          <div className="pdp-zoom-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pdp-zoom-close-btn"
              onClick={() => setIsZoomed(false)}
              aria-label="بستن بزرگ‌نمایی"
            >
              ✕
            </button>
            <div className="pdp-zoom-img-wrapper">
              {activeMedia && activeMedia.url && !imageError[activeMedia.id] ? (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.altText}
                  className="pdp-zoom-full-img"
                />
              ) : (
                <div className="pdp-gallery-art-fallback in-modal">
                  <span className="pdp-fallback-letter">{productTitle.slice(0, 1)}</span>
                  <span className="pdp-fallback-role">{activeMedia?.roleFa}</span>
                </div>
              )}
            </div>
            <div className="pdp-zoom-footer">
              <span className="pdp-zoom-title">{productTitle}</span>
              <span className="pdp-zoom-caption">{activeMedia?.caption || activeMedia?.altText}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
