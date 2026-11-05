'use client';

import React from 'react';
import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="clinical-hero-v2" aria-labelledby="hero-main-title">
      {/* Background Subtle Gradient & Mesh Elements */}
      <div className="hero-v2-ambient-glow" aria-hidden="true" />
      <div className="hero-v2-grid-mesh" aria-hidden="true" />

      <div className="hero-v2-container">
        {/* Top Institutional Credibility Strip */}
        <div className="hero-v2-header-badge-row">
          <div className="institution-chip">
            <span className="inst-flag-icon" aria-hidden="true">🇬🇧</span>
            <span className="inst-title">CAMBRIDGE SCIENCE PARK · DERMATOLOGY R&D</span>
            <span className="inst-divider" aria-hidden="true">/</span>
            <span className="inst-reg">BRITISH PHARMACOPOEIA · ISO 22716 GMP</span>
          </div>

          <div className="hero-trust-tag">
            <span>فرمولاسیون دارویی ثبت‌شده در انگلستان</span>
          </div>
        </div>

        {/* Main 2-Column Split Stage */}
        <div className="hero-v2-main-grid">
          {/* Column 1: Editorial Authority, Value Proposition & Actions */}
          <div className="hero-v2-copy-column">
            <div className="clinical-kicker-tag">
              <span className="kicker-dot" />
              <span>پروتکل اکسیژن‌رسانی عمقی بافت بدون سوزن · اثر بوهر (Bohr Effect)</span>
            </div>

            <h1 id="hero-main-title" className="hero-v2-headline">
              مراقبت علمی و پیشرفته پوست
              <br />
              <span className="holographic-gradient">با القای فیزیولوژیک اثر بوهر</span>
            </h1>

            <p className="hero-v2-lead-prose">
              راهکارهای علمی و اثبات‌شده برای پوستی سالم‌تر، شفاف‌تر و جوان‌تر. تلفیق فرمولاسیون‌های ترابافتی CarboxyGel با شیت‌های فعال‌ساز، سبب رهایش انفجاری اکسیژن بافتی و تسریع نوسازی کلاژن بدون کوچک‌ترین درد، سوزن و تهاجم می‌گردد.
            </p>

            {/* Actions Button Deck */}
            <div className="hero-v2-cta-deck">
              <Link href="#featured-products" className="v2-btn-primary teal-glow">
                <span>مشاهده فرمولاسیون‌ها و خرید کیت</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </Link>
              <Link href="#bohr-simulator" className="v2-btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>بررسی شبیه‌ساز بیوفیزیک اثر بوهر</span>
              </Link>
            </div>

            {/* Live Clinical Metric Strip */}
            <div className="hero-v2-telemetry-row">
              <div className="telemetry-card">
                <div className="telemetry-card-glow" />
                <div className="telemetry-top">
                  <span className="telemetry-value">+۴۵٪</span>
                  <span className="telemetry-tag">BOHR EFFECT</span>
                </div>
                <div className="telemetry-label">افزایش اکسیژناسیون موضعی با القای بیوشیمیایی اثر بوهر</div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-glow" />
                <div className="telemetry-top">
                  <span className="telemetry-value">۷۲ ساعت</span>
                  <span className="telemetry-tag">BARRIER RESTORE</span>
                </div>
                <div className="telemetry-label">پایداری ترمیم سد دفاعی پوست با کمپلکس سرامید NP و پپتیدها</div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-glow" />
                <div className="telemetry-top">
                  <span className="telemetry-value">ISO 22716</span>
                  <span className="telemetry-tag">GMP PHARMA</span>
                </div>
                <div className="telemetry-label">استاندارد رسمی تولید بهداشتی و دارویی کمبریج انگلستان</div>
              </div>
            </div>
          </div>

          {/* Column 2: High-Impact Medical Artifact Card */}
          <div className="hero-v2-visual-column">
            <div className="hero-v2-stage-pod theme-home">
              <div className="stage-pod-aurora" />

              {/* Status Header */}
              <div className="stage-pod-status-bar">
                <div className="status-live-pill">
                  <span className="live-dot" />
                  <span>ORIGINAL CLINICAL FORMULATION</span>
                </div>
                <span className="coldchain-cert">2°C – 8°C COLD CHAIN</span>
              </div>

              {/* Main Product Showcase Display */}
              <div className="stage-main-display">
                <div className="showcase-visual-wrapper modern-editorial">
                  <img
                    src="/assets/drdermer/hero-editorial-radiant.png"
                    alt="مراقبت علمی و درخشش طبیعی پوست با فرمولاسیون دکتر درمر"
                    className="stage-featured-image radiant-visual"
                    width={580}
                    height={385}
                    fetchPriority="high"
                  />
                  {/* Floating Mechanism Beacon */}
                  <div className="floating-biotech-beacon modern-floating">
                    <div className="beacon-thumb-box">
                      <img
                        src="/assets/drdermer/2025/07/bohr-effect.png"
                        alt="مکانیسم اثر بوهر"
                        width={44}
                        height={44}
                      />
                    </div>
                    <div className="beacon-info">
                      <strong>اثر فیزیولوژیک بوهر (Bohr)</strong>
                      <span>انفوزیون فوری O₂ و بازسازی بافت سلولی</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flagship Products Quick Rail */}
              <div className="stage-pod-rail">
                <Link href="/carboxygel" className="rail-tile">
                  <span className="rail-tile-badge">ReeSkin</span>
                  <strong>CarboxyGel™</strong>
                  <span>ژل ۲ فاز کربوکسی</span>
                </Link>
                <Link href="/carboxypod" className="rail-tile">
                  <span className="rail-tile-badge">ReeSkin</span>
                  <strong>CarboxyPod™</strong>
                  <span>پادهای فعال‌ساز</span>
                </Link>
                <Link href="/crystalene" className="rail-tile">
                  <span className="rail-tile-badge">ReeSkin</span>
                  <strong>Crystalene™</strong>
                  <span>خمیر پولیش ابریشمی</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
