'use client';

import React, { useState } from 'react';

export interface PhotoShowcaseView {
  id: string;
  label: string;
  url: string;
  alt: string;
  caption: string;
}

export interface ClinicalPhotoShowcaseProps {
  primaryPhoto: string;
  productName: string;
  volumeBadge: string;
  theme?: 'emerald' | 'cyan' | 'teal';
  views?: PhotoShowcaseView[];
}

export function ClinicalPhotoShowcase({
  primaryPhoto,
  productName,
  volumeBadge,
  theme = 'emerald',
  views = [],
}: ClinicalPhotoShowcaseProps) {
  const [activePhoto, setActivePhoto] = useState(primaryPhoto);
  const [activeCaption, setActiveCaption] = useState('تصویر واقعی محصول گرید درماتولوژیک');

  const allViews: PhotoShowcaseView[] = views.length > 0
    ? views
    : [
        {
          id: 'primary',
          label: 'نمای اصلی محصول',
          url: primaryPhoto,
          alt: productName,
          caption: 'پکیج رسمی داروسازی با هولوگرام اصالت کالا',
        },
      ];

  const handleSelectView = (view: PhotoShowcaseView) => {
    setActivePhoto(view.url);
    setActiveCaption(view.caption);
  };

  return (
    <div className="cp-hero-media-wrap">
      <div className={`cp-main-photo-card ${theme}`}>
        <span className="cp-badge-overlay">CE Medical Class I</span>
        <span className={`cp-volume-overlay ${theme}`}>{volumeBadge}</span>

        <img
          src={activePhoto}
          alt={productName}
          className="cp-photo-img"
          loading="eager"
        />

        <div
          style={{
            marginTop: '16px',
            fontSize: '0.78rem',
            color: '#94a3b8',
            textAlign: 'center',
            minHeight: '20px',
          }}
        >
          {activeCaption}
        </div>
      </div>

      {allViews.length > 1 && (
        <div className="cp-thumbnails-row" role="tablist" aria-label="زوایای تصویر محصول">
          {allViews.map((v) => {
            const isSelected = activePhoto === v.url;
            return (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`cp-thumb-btn ${theme} ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectView(v)}
                title={v.label}
              >
                <img src={v.url} alt={v.label} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
