'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Redesigned Luxury Clinical Flagship Hero Banner
 * Dr Dermer UK Clinical & Commerce OS — Phase 09 Architectural Redesign
 *
 * Combines:
 * - Institutional Cambridge Science Park origin & CE MDR IIb certifications
 * - Dual-mode clinical selector: At-Home Transdermal Regimen (ReeSkin) vs In-Clinic Hardware (ReeMed)
 * - Live physiological telemetry readout (Bohr Effect tcpO2, TEWL barrier recovery, pH dissociation)
 * - Premium Dark Obsidian Glassmorphism with holographic glow physics
 */
export function HeroBanner() {
  const [activeMode, setActiveMode] = useState<'home' | 'clinic'>('home');

  return (
    <section className="clinical-hero-v2" aria-labelledby="hero-main-title">
      {/* Background Optical Grid & Ambient Light Fields */}
      <div className="hero-v2-ambient-glow" aria-hidden="true" />
      <div className="hero-v2-grid-mesh" aria-hidden="true" />

      <div className="hero-v2-container">
        {/* Top Institutional Credibility Strip */}
        <div className="hero-v2-header-badge-row">
          <div className="institution-chip">
            <span className="inst-flag-icon" aria-hidden="true">🇬🇧</span>
            <span className="inst-title">CAMBRIDGE SCIENCE PARK · R&D LABORATORIES</span>
            <span className="inst-divider" aria-hidden="true">/</span>
            <span className="inst-reg">UK MDR 2002 · CE 0123 CLASS IIb</span>
          </div>

          {/* Interactive Mode Switcher */}
          <div className="hero-mode-switcher" role="tablist" aria-label="انتخاب نوع فرآیند درمانی">
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === 'home'}
              className={`mode-btn ${activeMode === 'home' ? 'active' : ''}`}
              onClick={() => setActiveMode('home')}
            >
              <span className="mode-pulse-dot teal" />
              <span>رژیم‌های بالینی خانگی (ReeSkin™)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === 'clinic'}
              className={`mode-btn ${activeMode === 'clinic' ? 'active' : ''}`}
              onClick={() => setActiveMode('clinic')}
            >
              <span className="mode-pulse-dot purple" />
              <span>سامانه‌ها و تجهیزات مطبی (ReeMed™)</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Split Stage */}
        <div className="hero-v2-main-grid">
          {/* Column 1: Editorial Authority, Value Proposition & Actions */}
          <div className="hero-v2-copy-column">
            <div className="clinical-kicker-tag">
              {activeMode === 'home' ? (
                <>
                  <span className="kicker-dot" />
                  <span>پروتکل اکسیژن‌رسانی عمقی بافت بدون سوزن · اثر بور (Bohr Effect)</span>
                </>
              ) : (
                <>
                  <span className="kicker-dot purple" />
                  <span>ایستگاه‌های پیشرفته تزریق دیجیتال CO₂ و پلاسما اتمسفری پزشکی</span>
                </>
              )}
            </div>

            <h1 id="hero-main-title" className="hero-v2-headline">
              {activeMode === 'home' ? (
                <>
                  تحول درمان‌های ترابافتی پوست
                  <br />
                  <span className="holographic-gradient">با القای فیزیولوژیک اثر بوهر</span>
                </>
              ) : (
                <>
                  تجهیزات و فناوری‌های جراحی پوست
                  <br />
                  <span className="holographic-gradient-purple">مهندسی‌شده برای دقت کلینیکال بریتانیا</span>
                </>
              )}
            </h1>

            <div className="hero-v2-motto" dir="ltr">
              {activeMode === 'home'
                ? '“Pharmaceutical-grade transdermal formulations with bio-active Bohr Effect delivery”'
                : '“High-precision medical stations & atmospheric cold plasma for advanced dermatology”'}
            </div>

            <p className="hero-v2-lead-prose">
              {activeMode === 'home'
                ? 'تلفیق فرمولاسیون ۲ فاز ماتریکسی CarboxyGel با شیت‌های فیبری میکروپرمنبران، سبب القای افت موضعی pH، آزادسازی فوری اکسیژن متصل به هموگلوبین و تسریع کلاژن‌سازی پوست بدون کوچک‌ترین درد و تهاجم می‌گردد.'
                : 'استیشن تزریق دیجیتال CarboX با کنترل جریان دقیق ۱cc/min در کنار سامانه بیورزونانس پلاسمای سرد PlasmaX، بالاترین استاندارد اثربخشی را در کلینیک‌های پوست و مراکز جراحی فراهم می‌سازد.'}
            </p>

            {/* Actions Button Deck */}
            <div className="hero-v2-cta-deck">
              {activeMode === 'home' ? (
                <>
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
                    <span>بررسی شبیه‌ساز بیوفیزیک اثر بور</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/b2b" className="v2-btn-primary purple-glow">
                    <span>استعلام قیمت تجهیزات و پیش‌فاکتور رسمی</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </Link>
                  <Link href="/b2b/protocols" className="v2-btn-secondary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span>پروتکل‌های مصرفی کابین و مطب</span>
                  </Link>
                </>
              )}
            </div>

            {/* Live Telemetry Ticker Cards */}
            <div className="hero-v2-telemetry-grid" aria-label="داده‌های بالینی اثبات‌شده آزمایشگاهی">
              <div className="telemetry-card">
                <div className="telemetry-card-glow" />
                <div className="telemetry-top">
                  <span className="telemetry-value tabular-nums">+۴۵٪</span>
                  <span className="telemetry-tag">O₂ FLUX</span>
                </div>
                <div className="telemetry-label">افزایش اکسیژناسیون موضعی با القای بیوشیمیایی اثر بور</div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-glow" />
                <div className="telemetry-top">
                  <span className="telemetry-value tabular-nums">۷۸٪</span>
                  <span className="telemetry-tag">TEWL RECOVERY</span>
                </div>
                <div className="telemetry-label">کاهش تبخیر آب ترنس‌اپیدرمال طی ۴۸ ساعت بازسازی سد دفاعی</div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-glow" />
                <div className="telemetry-top">
                  <span className="telemetry-value">MDR IIb</span>
                  <span className="telemetry-tag">EU DIRECTIVE</span>
                </div>
                <div className="telemetry-label">گواهینامه رسمی تجهیزات پزشکی اتحادیه اروپا و استاندارد ISO 13485</div>
              </div>
            </div>
          </div>

          {/* Column 2: 3D Hardware Stage / High-Impact Medical Artifact Card */}
          <div className="hero-v2-visual-column">
            <div className={`hero-v2-stage-pod ${activeMode === 'clinic' ? 'theme-clinic' : 'theme-home'}`}>
              <div className="stage-pod-aurora" />

              {/* Status Header */}
              <div className="stage-pod-status-bar">
                <div className="status-live-pill">
                  <span className="live-dot" />
                  <span>{activeMode === 'home' ? 'READY FOR AT-HOME DISPENSING' : 'MDR CLASS IIb ACTIVE CONSOLE'}</span>
                </div>
                <span className="coldchain-cert">2°C – 8°C COLD CHAIN</span>
              </div>

              {/* Main Product Showcase Display */}
              <div className="stage-main-display">
                {activeMode === 'home' ? (
                  <div className="showcase-visual-wrapper">
                    <img
                      src="/assets/drdermer/2025/07/site-combo-carboxy-1.png"
                      alt="کیت جامع CarboxyGel CO2 Therapy و CarboxyPod دکتر درمر"
                      className="stage-featured-image"
                      width={520}
                      height={480}
                      fetchPriority="high"
                    />
                    {/* Floating Mechanism Beacon */}
                    <div className="floating-biotech-beacon">
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
                        <span>تبادل فوری گاز CO₂ و غنی‌سازی O₂ سلولی</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="showcase-visual-wrapper">
                    <img
                      src="/assets/drdermer/2025/08/19carbox.webp"
                      alt="ایستگاه تخصصی مدیکال CarboX دکتر درمر"
                      className="stage-featured-image hardware-view"
                      width={480}
                      height={480}
                      fetchPriority="high"
                    />
                    {/* Floating Hardware Specs */}
                    <div className="floating-biotech-beacon purple">
                      <div className="beacon-thumb-box purple">
                        <img
                          src="/assets/drdermer/2025/08/18plasmax.webp"
                          alt="سامانه پلاسمای سرد PlasmaX"
                          width={44}
                          height={44}
                        />
                      </div>
                      <div className="beacon-info">
                        <strong>دستگاه‌های پزشکی ReeMed™</strong>
                        <span>کربوکسی‌تراپی دیجیتال CarboX و پلاسمای سرد PlasmaX</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Jump Rail for Consoles & Formulations */}
              <div className="stage-pod-rail">
                <Link href="/carboxygel" className="rail-tile">
                  <div className="rail-tile-badge">ReeSkin</div>
                  <strong>ژل CarboxyGel</strong>
                  <span>فرمولاسیون ۲ فاز</span>
                </Link>
                <Link href="/carbox" className="rail-tile">
                  <div className="rail-tile-badge purple">ReeMed</div>
                  <strong>کنسول CarboX™</strong>
                  <span>تزریق گاز دقیق</span>
                </Link>
                <Link href="/plasmax" className="rail-tile">
                  <div className="rail-tile-badge purple">ReeMed</div>
                  <strong>پلاسما PlasmaX™</strong>
                  <span>میکروپلاسمای سرد</span>
                </Link>
              </div>

              {/* Bottom Security / Authenticity Seal */}
              <div className="stage-pod-footer">
                <div className="batch-ttac-wrap">
                  <span className="ttac-icon">🛡️</span>
                  <span>کد اصالت رهگیری سلامت (TTAC) و ضمانت پلمپ آزمایشگاهی کمبریج</span>
                </div>
                <Link href="/about" className="learn-science-link">
                  <span>اسناد بالینی</span>
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
