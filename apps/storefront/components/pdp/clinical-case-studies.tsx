'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ClinicalCaseStudy } from '../../lib/pdp-types';

interface ClinicalCaseStudiesProps {
  studies: ClinicalCaseStudy[];
}

export function ClinicalCaseStudies({ studies }: ClinicalCaseStudiesProps) {
  const [selectedStudyIndex, setSelectedStudyIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentStudy = studies[selectedStudyIndex] || studies[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = Math.round((clampedX / rect.width) * 100);
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  if (!studies || studies.length === 0) {
    return null;
  }

  return (
    <div className="clinical-cases-root" aria-label="مطالعات بالینی و نتایج آنالیز ویزیا">
      {/* Header */}
      <div className="clinical-cases-header">
        <div className="clinical-cases-badge">
          <span>ارزیابی چندطیفی سیستم تصویری Canfield VISIA</span>
        </div>
        <h3 className="clinical-cases-title">مستندات و کیس‌های بالینی پیش و پس از درمان (Before & After)</h3>
        <p className="clinical-cases-desc">
          نتایج تصویربرداری مقایسه‌ای استاندارد، سنجش درصد بهبود فاکتورهای اپیدرم و بررسی تأییدشده متخصصین پوست
        </p>
      </div>

      {/* Case Study Switcher Pills */}
      {studies.length > 1 && (
        <div className="clinical-cases-pills" role="tablist" aria-label="انتخاب بیمار و کیس درمانی">
          {studies.map((st, idx) => {
            const isSelected = idx === selectedStudyIndex;
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedStudyIndex(idx);
                  setSliderPosition(50);
                }}
                className={`case-pill-btn ${isSelected ? 'active' : ''}`}
              >
                <span className="case-pill-num">کیس {idx + 1}:</span>
                <span className="case-pill-cond">{st.condition}</span>
                <span className="case-pill-tag">({st.sessionsCount} جلسه درمان)</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Grid: Comparison Slider on Left/Top, VISIA Metrics & Doctor Badge on Right */}
      <div className="clinical-cases-grid">
        {/* Left Column: Interactive Before / After Slider */}
        <div className="clinical-slider-column">
          <div
            ref={containerRef}
            className={`clinical-slider-stage ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            tabIndex={0}
            role="slider"
            aria-label="اسلایدر مقایسه تصویر قبل و بعد از درمان"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sliderPosition}
            onKeyDown={handleKeyDown}
          >
            {/* After Image (Background) */}
            <div className="slider-image-layer after-layer">
              <Image
                src={currentStudy.afterImageUrl}
                alt={`تصویر پس از درمان - ${currentStudy.condition}`}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="slider-img"
                priority
              />
              <span className="slider-badge-tag after">
                {currentStudy.afterLabel || 'پس از درمان (هفته ۴)'}
              </span>
            </div>

            {/* Before Image (Foreground with clip-path) */}
            <div
              className="slider-image-layer before-layer"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={currentStudy.beforeImageUrl}
                alt={`تصویر قبل از درمان - ${currentStudy.condition}`}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="slider-img"
              />
              <span className="slider-badge-tag before">
                {currentStudy.beforeLabel || 'قبل از درمان (جلسه ۰)'}
              </span>
            </div>

            {/* Vertical Divider Line and Handle */}
            <div
              className="slider-divider-line"
              style={{ left: `${sliderPosition}%` }}
              aria-hidden="true"
            >
              <div className="slider-handle-circle">
                <span className="handle-chevron left">◄</span>
                <span className="handle-chevron right">►</span>
              </div>
            </div>
          </div>

          <div className="slider-instruction-strip">
            <span aria-hidden="true">↔</span>
            <span>برای مقایسه دقیق خطوط و رنگ پوست، دستگیره وسط را به چپ و راست بکشید.</span>
          </div>

          {/* Patient Profile Card */}
          <div className="patient-meta-pill-card">
            <div className="patient-meta-item">
              <span className="meta-lbl">بیمار:</span>
              <strong>{currentStudy.patientGender}، {currentStudy.patientAge} ساله</strong>
            </div>
            <div className="patient-meta-item">
              <span className="meta-lbl">طول دوره:</span>
              <strong>{currentStudy.durationWeeks} هفته ({currentStudy.sessionsCount} جلسه)</strong>
            </div>
            <div className="patient-meta-item full">
              <span className="meta-lbl">پروتکل اجرا شده:</span>
              <p>{currentStudy.protocolDescription}</p>
            </div>
          </div>
        </div>

        {/* Right Column: VISIA Metrics & Verified Dermatologist Review */}
        <div className="clinical-metrics-column">
          {/* VISIA Metrics Header Card */}
          <div className="visia-box-header">
            <div className="visia-logo-title">
              <span className="visia-icon" aria-hidden="true">🔬</span>
              <div>
                <h4>شاخص‌های بالینی ثبت‌شده در سیستم VISIA</h4>
                <small>آنالیز چندکاناله طیفی با سنجش تفکیک رنگدانه، اکسیژن و بافت</small>
              </div>
            </div>
          </div>

          {/* Metrics List */}
          <div className="visia-metrics-list" role="list">
            {currentStudy.visiaMetrics.map((metric) => (
              <div key={metric.id} className="visia-metric-card" role="listitem">
                <div className="metric-header-row">
                  <span className="metric-name">{metric.labelFa}</span>
                  <span className={`metric-change-pill ${metric.isImprovement ? 'positive' : ''}`}>
                    {metric.percentageChange}
                  </span>
                </div>

                <div className="metric-values-row">
                  <div className="metric-val-col baseline">
                    <span className="col-sub">مقدار پایه:</span>
                    <strong className="val-text">{metric.baseline}</strong>
                  </div>
                  <div className="metric-arrow" aria-hidden="true">←</div>
                  <div className="metric-val-col result">
                    <span className="col-sub">نتیجه هفته ۴:</span>
                    <strong className="val-text highlight">{metric.week4Result}</strong>
                  </div>
                </div>

                <p className="metric-desc">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Verified Dermatologist Review Badge & Quote */}
          {currentStudy.dermatologistReview && (
            <div className="dermatologist-card" role="region" aria-label="نظر کارشناسی متخصص پوست">
              <div className="derm-badge-banner">
                <span className="derm-seal" aria-hidden="true">🩺</span>
                <span className="derm-badge-txt">{currentStudy.dermatologistReview.verifiedBadge}</span>
              </div>

              <blockquote className="derm-quote">
                «{currentStudy.dermatologistReview.quote}»
              </blockquote>

              <div className="derm-signature-row">
                <div className="derm-avatar">
                  <span>👩‍⚕️</span>
                </div>
                <div className="derm-info">
                  <strong className="derm-name">{currentStudy.dermatologistReview.doctorName}</strong>
                  <span className="derm-title">{currentStudy.dermatologistReview.doctorTitleFa}</span>
                  <span className="derm-licence">
                    {currentStudy.dermatologistReview.medicalLicenseNo} | {currentStudy.dermatologistReview.clinicName}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
