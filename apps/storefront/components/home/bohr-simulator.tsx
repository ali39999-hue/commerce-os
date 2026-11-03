"use client";

import React, { useState, useId } from "react";
import Link from "next/link";

export function BohrOxygenationSimulator() {
  const gradientId = useId();
  // co2Concentration from 0% (baseline atmospheric / passive) to 100% (Dr. Dermer CarboxyGel Active Infusion)
  const [co2Concentration, setCo2Concentration] = useState<number>(65);

  // Biological derivations based on the Bohr Effect equations
  // As CO2 increases:
  // 1. Local pH drops from 7.40 down to ~7.15 (causing right-shift of Hb-O2 dissociation curve)
  // 2. O2 dissociation / release increases from baseline 18% up to 94%
  // 3. Capillary dilation (vasodilation) diameter increases from 6.2 µm to 14.8 µm (+138%)
  // 4. Fibroblast ATP generation rate increases up to 3.4x
  const pH = (7.40 - (co2Concentration / 100) * 0.25).toFixed(2);
  const o2Release = Math.round(18 + (co2Concentration / 100) * 76);
  const vasodilation = Math.round(100 + (co2Concentration / 100) * 138);
  const atpBoost = (1.0 + (co2Concentration / 100) * 2.4).toFixed(1);

  // Dynamic status descriptor
  const getPhaseData = () => {
    if (co2Concentration < 25) {
      return {
        stage: "فاز پایه و غیرفعال (Homeostatic Baseline)",
        desc: "اکسیژن به شدت به هموگلوبین متصل مانده و درصد اندکی از آن به درم زنده منتقل می‌شود. متابولیسم فیبروبلاست‌ها در سطح حداقل قرار دارد.",
        badgeColor: "#64748b",
        glowColor: "rgba(100, 116, 139, 0.2)",
      };
    }
    if (co2Concentration < 70) {
      return {
        stage: "فاز فعال‌سازی و افت اسیدیته (Bohr Transduction Phase)",
        desc: "نفوذ حباب‌های میکرو CO2 باعث افت کنترل‌شده pH بافتی و گسست پیوند آهن-اکسیژن هموگلوبین می‌گردد. عروق مویرگی متسع شده و پرفیوژن خونی سرعت می‌گیرد.",
        badgeColor: "#14b8a6",
        glowColor: "rgba(20, 184, 166, 0.35)",
      };
    }
    return {
      stage: "حداکثر اشباع بافتی (Optimal Clinical Hyper-Oxygenation)",
      desc: "سیلاب اکسیژن درون‌سلولی؛ تنفس میتوکندریایی به اوج ۳.۴ برابری رسیده، فیبروبلاست‌ها سنتز کلاژن نوع ۱ و ۳ را آغاز کرده و بازسازی سد دفاعی فعال می‌شود.",
      badgeColor: "#0284c7",
      glowColor: "rgba(2, 132, 199, 0.45)",
    };
  };

  const phase = getPhaseData();

  // Capillary radius for SVG visualization
  const capillaryWidth = 28 + (co2Concentration / 100) * 44;
  // Dissociation shift curve coordinate
  // Standard curve: start (40, 220), control (120, 160), end (300, 40)
  // Right shifted curve: start (40, 220), control (170 + co2*0.6, 190), end (300, 80 - co2*0.3)
  const curveCtrlX = 140 + (co2Concentration / 100) * 70;
  const curveCtrlY = 175 + (co2Concentration / 100) * 20;

  return (
    <section className="bohr-simulator-section" aria-labelledby="bohr-sim-title">
      <div className="bohr-sim-wrapper">
        {/* Top Header & Context */}
        <div className="bohr-sim-header">
          <div className="sim-badge-row">
            <span className="sim-chip">
              <span className="sim-chip-pulse"></span>
              PHYSIOLOGICAL BOHR EFFECT SIMULATOR
            </span>
            <span className="sim-chip-sub">مدل دینامیک هموگلوبین و اکسیژن‌رسانی عروقی</span>
          </div>

          <h2 id="bohr-sim-title" className="bohr-sim-title">
            شبیه‌ساز تعاملی اثر بوهر: کنترل غلظت CO₂ و رهاسازی اکسیژن بافتی
          </h2>
          <p className="bohr-sim-lead">
            اسلایدر غلظت دی‌اکسید کربن ترابافتی را تغییر دهید تا ببینید چگونه فرمولاسیون CarboxyGel دکتر درمر با تغییر میلی‌متری pH، منحنی گسست هموگلوبین را جابه‌جا کرده و سلول‌ها را بدون سوزن از عمق مویرگ‌ها اکسیژن‌باران می‌کند.
          </p>
        </div>

        {/* Interactive Controls & Interactive Readouts */}
        <div className="bohr-sim-control-panel">
          <div className="sim-slider-group">
            <div className="sim-slider-labels">
              <label htmlFor="co2-slider" className="sim-slider-title">
                غلظت ترابافتی CO₂ فعال (CarboxyGel + CarboxyPod):
              </label>
              <div className="sim-slider-val-badge">
                <span className="val-number">{co2Concentration}٪</span>
                <span className="val-unit">انفوزیون نانوحباب</span>
              </div>
            </div>

            <input
              id="co2-slider"
              type="range"
              min="0"
              max="100"
              value={co2Concentration}
              onChange={(e) => setCo2Concentration(Number(e.target.value))}
              className="bohr-range-slider"
              aria-label="اسلایدر غلظت دی‌اکسید کربن"
            />

            <div className="sim-slider-ticks">
              <span>۰٪ (هوای محیط / بدون اثر)</span>
              <span>۳۰٪ (ژل ساده)</span>
              <span>۶۵٪ (کیت خانگی ReeSkin)</span>
              <span>۱۰۰٪ (پروتکل کلینیکال CarboX)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="sim-presets-bar">
            <span className="presets-label">پروتکل‌های پیش‌فرض:</span>
            <button
              type="button"
              className={`preset-btn ${co2Concentration === 10 ? "active" : ""}`}
              onClick={() => setCo2Concentration(10)}
            >
              پوست عادی (قبل از مداخله)
            </button>
            <button
              type="button"
              className={`preset-btn ${co2Concentration === 65 ? "active" : ""}`}
              onClick={() => setCo2Concentration(65)}
            >
              رژیم خانگی ReeSkin™ (۶۵٪)
            </button>
            <button
              type="button"
              className={`preset-btn ${co2Concentration === 100 ? "active" : ""}`}
              onClick={() => setCo2Concentration(100)}
            >
              پروتکل کلینیکال CarboX™ (۱۰۰٪)
            </button>
          </div>
        </div>

        {/* Main Twin Visualization Grid */}
        <div className="bohr-sim-grid">
          {/* Card 1: Dynamic Capillary Vasodilation & RBC Cross-Section */}
          <div className="sim-visual-card">
            <div className="svc-header">
              <div className="svc-title-wrap">
                <span className="svc-badge">VASCULAR IN VIVO RESPONSE</span>
                <h3 className="svc-title">اتساع مویرگ‌های درم و رهاسازی O₂ از گلبول‌های قرمز</h3>
              </div>
              <div className="svc-metric-live">
                <span>قطر عروق:</span>
                <strong>+{vasodilation - 100}٪</strong>
              </div>
            </div>

            <div className="svc-canvas-wrap">
              <svg viewBox="0 0 460 260" className="svc-capillary-svg" aria-hidden="true" style={{ overflow: 'hidden' }}>
                <defs>
                  {/* Capillary walls gradient */}
                  <linearGradient id={`${gradientId}-wall`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.95" />
                  </linearGradient>
                  {/* Blood lumen plasma gradient */}
                  <radialGradient id={`${gradientId}-plasma`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef2f2" />
                    <stop offset="100%" stopColor="#fee2e2" />
                  </radialGradient>
                  {/* Oxygen burst glow */}
                  <radialGradient id={`${gradientId}-o2glow`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Epidermis Surface Line */}
                <rect x="0" y="0" width="460" height="22" fill="#fdf2e9" />
                <text x="230" y="15" fill="#9a3412" fontSize="9" fontWeight="700" textAnchor="middle">
                  سطح پوست / لایه شاخی استراتوم کورنئوم (CarboxyGel Layer)
                </text>

                {/* Transdermal CO2 micro-bubbles penetrating down */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <circle
                    key={`co2-bub-${i}`}
                    cx={50 + i * 50}
                    cy={22 + ((i * 17) % 35)}
                    r={3 + (co2Concentration / 100) * 3.5}
                    fill="#14b8a6"
                    opacity={0.4 + (co2Concentration / 100) * 0.55}
                  />
                ))}

                {/* Dermis background */}
                <rect x="0" y="22" width="460" height="238" fill="#faf5ff" opacity="0.6" />

                {/* Capillary Tube Wall Upper */}
                <rect
                  x="0"
                  y={130 - capillaryWidth}
                  width="460"
                  height="10"
                  rx="3"
                  fill={`url(#${gradientId}-wall)`}
                />
                {/* Lumen Area */}
                <rect
                  x="0"
                  y={140 - capillaryWidth}
                  width="460"
                  height={capillaryWidth * 2 - 20}
                  fill={`url(#${gradientId}-plasma)`}
                />
                {/* Capillary Tube Wall Lower */}
                <rect
                  x="0"
                  y={120 + capillaryWidth}
                  width="460"
                  height="10"
                  rx="3"
                  fill={`url(#${gradientId}-wall)`}
                />

                {/* Red Blood Cells (RBCs) traversing capillary */}
                {[
                  { cx: 70, cy: 130 },
                  { cx: 180, cy: 125 },
                  { cx: 290, cy: 135 },
                  { cx: 400, cy: 128 },
                ].map((rbc, idx) => (
                  <g key={`rbc-${idx}`}>
                    {/* Erythrocyte Ellipse */}
                    <ellipse
                      cx={rbc.cx}
                      cy={rbc.cy}
                      rx={20 + (co2Concentration / 100) * 5}
                      ry={13 + (co2Concentration / 100) * 3}
                      fill="#dc2626"
                      stroke="#991b1b"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx={rbc.cx}
                      cy={rbc.cy}
                      rx={8}
                      ry={5}
                      fill="#ef4444"
                    />
                    {/* Released O2 Molecules bursting towards interstitial tissue */}
                    {co2Concentration > 20 && (
                      <>
                        <circle cx={rbc.cx - 15} cy={rbc.cy - (capillaryWidth - 5)} r="5" fill="#0284c7" />
                        <circle cx={rbc.cx + 10} cy={rbc.cy - (capillaryWidth - 10)} r="6" fill="#38bdf8" />
                        <circle cx={rbc.cx} cy={rbc.cy + (capillaryWidth - 8)} r="5" fill="#0284c7" />
                      </>
                    )}
                  </g>
                ))}

                {/* Tissue Oxygenation Density Clouds */}
                {co2Concentration > 35 && (
                  <circle
                    cx="230"
                    cy="65"
                    r={35 + (co2Concentration / 100) * 35}
                    fill={`url(#${gradientId}-o2glow)`}
                  />
                )}

                <text x="230" y="245" fill="#0369a1" fontSize="11" fontWeight="800" textAnchor="middle">
                  {`پرفیوژن عروق و رهاسازی اکسیژن آزاد O₂ در مایع بین‌سلولی درمیس`}
                </text>
              </svg>
            </div>

            <div className="svc-footer-info">
              <div className="svc-status-pill" style={{ borderColor: phase.badgeColor }}>
                <span className="dot" style={{ background: phase.badgeColor }}></span>
                <strong>{phase.stage}</strong>
              </div>
              <p className="svc-status-desc">{phase.desc}</p>
            </div>
          </div>

          {/* Card 2: Interactive Bohr Dissociation Curve & Real-Time Bio-Metrics */}
          <div className="sim-visual-card">
            <div className="svc-header">
              <div className="svc-title-wrap">
                <span className="svc-badge">BIOCHEMISTRY GRAPH</span>
                <h3 className="svc-title">منحنی تفکیک اکسی‌هموگلوبین و افت کنترل‌شده pH</h3>
              </div>
              <div className="svc-metric-live">
                <span>اسیدیته لایه شاخی:</span>
                <strong>pH {pH}</strong>
              </div>
            </div>

            <div className="svc-canvas-wrap">
              <svg viewBox="0 0 460 260" className="svc-bohr-graph-svg" aria-hidden="true" style={{ overflow: 'hidden' }}>
                {/* Graph Grid Lines */}
                <line x1="60" y1="30" x2="60" y2="210" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="60" y1="210" x2="430" y2="210" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Grid ticks */}
                {[0.25, 0.5, 0.75].map((tick, i) => (
                  <line
                    key={`gt-${i}`}
                    x1="60"
                    y1={210 - tick * 170}
                    x2="430"
                    y2={210 - tick * 170}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Axis Labels */}
                <text x="20" y="120" fill="#64748b" fontSize="10" transform="rotate(-90 20 120)" textAnchor="middle">
                  درصد اشباع هموگلوبین با اکسیژن (HbO₂ %)
                </text>
                <text x="245" y="235" fill="#64748b" fontSize="10" textAnchor="middle">
                  فشار جزئی اکسیژن بافتی pO₂ (mmHg)
                </text>

                {/* Baseline Normal Curve (Static dashed line, pH 7.40) */}
                <path
                  d="M 60 210 Q 140 170, 260 85 T 420 45"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <text x="320" y="70" fill="#94a3b8" fontSize="9">
                  منحنی نرمال (pH 7.40)
                </text>

                {/* Dynamic Bohr Shift Curve (Right shifted with CO2) */}
                <path
                  d={`M 60 210 Q ${curveCtrlX} ${curveCtrlY}, 280 115 T 420 ${50 + (co2Concentration / 100) * 35}`}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="3.5"
                />
                <text x="280" y="145" fill="#0284c7" fontSize="10" fontWeight="800">
                  انتقال به راست (Bohr Shift)
                </text>

                {/* Visual marker of O2 release gap */}
                <line
                  x1="220"
                  y1="135"
                  x2="220"
                  y2={135 + (co2Concentration / 100) * 45}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
                <text x="230" y={150 + (co2Concentration / 100) * 15} fill="#dc2626" fontSize="10" fontWeight="900">
                  {`Δ O₂ رهاشده: +${o2Release}٪`}
                </text>
              </svg>
            </div>

            {/* 4 Quantitative Telemetry Boxes */}
            <div className="svc-metrics-quad">
              <div className="sm-box">
                <span className="smb-label">رهاسازی اکسیژن (O₂ Release)</span>
                <span className="smb-val highlight-blue">+{o2Release}٪</span>
                <small className="smb-sub">انتقال مستقیم به فیبروبلاست</small>
              </div>

              <div className="sm-box">
                <span className="smb-label">اتساع مویرگ‌های درمیس</span>
                <span className="smb-val highlight-teal">+{vasodilation - 100}٪</span>
                <small className="smb-sub">افزایش پرفیوژن اریتروسیت‌ها</small>
              </div>

              <div className="sm-box">
                <span className="smb-label">افت اسیدیته هدفمند</span>
                <span className="smb-val">pH {pH}</span>
                <small className="smb-sub">تحریک آنزیم‌های بازسازی</small>
              </div>

              <div className="sm-box">
                <span className="smb-label">شتاب تولید ATP سلولی</span>
                <span className="smb-val highlight-gold">{atpBoost}x</span>
                <small className="smb-sub">انرژی تنفس میتوکندریایی</small>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Callout Footer */}
        <div className="bohr-sim-footer">
          <div className="bsf-content">
            <strong>نتیجه فارماکولوژی بالینی:</strong>
            <p>
              برخلاف روش‌های تهاجمی تزریق مزوتراپی، ژل کربوکسی‌تراپی دکتر درمر با تولید کنترل‌شده گاز CO₂ در غشای پاد ترابافتی، عوارض قرمزی و نکروز بافتی را به صفر می‌رساند.
            </p>
          </div>
          <Link href="/#featured-products" className="bsf-cta-btn">
            مشاهده کیت‌های CarboxyGel و شروع پروتکل ←
          </Link>
        </div>
      </div>
    </section>
  );
}
