"use client";

import React, { useState, useId } from "react";
import Link from "next/link";

export function BohrOxygenationSimulator() {
  const gradientId = useId();
  // co2Concentration from 0% (baseline atmospheric / passive) to 100% (Dr. Dermer CarboxyGel Active Infusion)
  const [co2Concentration, setCo2Concentration] = useState<number>(65);

  // Biological derivations based on the Bohr Effect equations:
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
        stageFa: "فاز پایه و هموستاتیک (Homeostatic Baseline)",
        phaseCode: "PHASE 01 · PASSIVE",
        desc: "اکسیژن به هموگلوبین متصل مانده و تنها ۱۸٪ آن به درم زنده منتقل می‌شود. متابولیسم سلول‌های فیبروبلاست در پایین‌ترین سطح قرار دارد.",
        badgeColor: "#64748B",
        productRecommendation: "پیش‌نیاز: آماده‌سازی پوست با اسکراب کریستالین (Crystalene)",
        productLink: "/crystalene",
      };
    }
    if (co2Concentration < 75) {
      return {
        stageFa: "فاز تفکیک بوهر و اتساع موضعی (Bohr Transduction Phase)",
        phaseCode: "PHASE 02 · TRANSDERMAL ACTIVE",
        desc: "نفوذ حباب‌های نانو دی‌اکسید کربن به مایع بین‌سلولی مویرگ‌ها باعث افت کنترل‌شده pH بافتی و گسست پیوند آهن-اکسیژن هموگلوبین می‌گردد.",
        badgeColor: "#1E3A2F",
        productRecommendation: "پروتکل پیشنهادی: کیت خانگی CarboxyGel + پاد فعال‌ساز CarboxyPod",
        productLink: "/carboxygel",
      };
    }
    return {
      stageFa: "حداکثر اشباع بافتی و نئوکلاژنز (Optimal Clinical Hyper-Oxygenation)",
      phaseCode: "PHASE 03 · CLINICAL PEAK",
      desc: "سیلاب اکسیژن درون‌سلولی؛ تنفس میتوکندریایی به اوج ۳.۴ برابری رسیده، فیبروبلاست‌ها سنتز کلاژن نوع ۱ و ۳ را شتاب بخشیده و بافت عمقی بازسازی می‌شود.",
      badgeColor: "#B83A2E",
      productRecommendation: "پروتکل بالینی: ژل غلیظ CarboxyGel Pro و پدهای آناتومیک CarboxyPad",
      productLink: "/carboxygel",
    };
  };

  const phase = getPhaseData();

  // Capillary radius for SVG visualization
  const capillaryWidth = 26 + (co2Concentration / 100) * 36;
  // Curve coordinate calculation for the Bohr shift
  const curveCtrlX = 140 + (co2Concentration / 100) * 65;
  const curveCtrlY = 175 + (co2Concentration / 100) * 18;

  return (
    <section id="bohr-simulator" className="bohr-simulator-section" aria-labelledby="bohr-sim-title">
      <div className="bohr-sim-wrapper">
        {/* Top Header & Clinical Context */}
        <div className="bohr-sim-header">
          <div className="sim-badge-row">
            <span className="sim-chip">
              <span className="sim-chip-pulse" aria-hidden="true" />
              PHYSIOLOGICAL BOHR EFFECT SIMULATOR
            </span>
            <span className="sim-chip-sub">مدل دینامیک هموگلوبین، دوزیمتری گاز ترابافتی و اکسیژناسیون عروقی</span>
          </div>

          <div className="sim-header-grid">
            <div className="sim-header-copy">
              <h2 id="bohr-sim-title" className="bohr-sim-title">
                شبیه‌ساز اثر بوهر: دوزیمتری غلظت CO₂ و رهاسازی اکسیژن درون‌سلولی
              </h2>
              <p className="bohr-sim-lead">
                اسلایدر غلظت دی‌اکسید کربن ترابافتی را تغییر دهید تا مشاهده فرمایید چگونه فناوری انحصاری CarboxyGel دکتر درمر با افت کالیبره‌شده اسیدیته، منحنی گسست هموگلوبین را جابه‌جا نموده و بدون هیچ‌گونه سوزن، سلول‌ها را از اعماق بستر مویرگی اکسیژن‌باران می‌کند.
              </p>
            </div>

            <div className="sim-header-badge-box">
              <div className="shb-label">فرمول استوکیومتری کاتالیزور:</div>
              <code className="shb-code">CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻</code>
              <div className="shb-sub">منحنی گسست اکسی‌هموگلوبین کریستین بوهر (۱۹۰۴)</div>
            </div>
          </div>
        </div>

        {/* Interactive Controls & Preset Milestones */}
        <div className="bohr-sim-control-panel">
          <div className="sim-slider-group">
            <div className="sim-slider-labels">
              <label htmlFor="co2-slider" className="sim-slider-title">
                <span>تزریق گاز دی‌اکسید کربن فعال (CarboxyGel + CarboxyPod):</span>
                <span className="sim-ppm-telemetry">({Math.round(co2Concentration * 18)} PPM غلظت اشباع ترابافتی)</span>
              </label>
              <div className="sim-slider-val-badge">
                <span className="val-number">{co2Concentration}٪</span>
                <span className="val-unit">دوز درمانی فعال</span>
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
              aria-label="اسلایدر تنظیم غلظت گاز دی‌اکسید کربن"
            />

            <div className="sim-slider-ticks">
              <span>۰٪ (هوای آزاد / عدم القای اثر بوهر)</span>
              <span>۳۰٪ (ژل پایه بدون فعال‌ساز)</span>
              <span>۶۵٪ (پروتکل خانگی استاندارد ReeSkin)</span>
              <span>۱۰۰٪ (پروتکل کلینیکال مافوق بحرانی CarboX)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="sim-presets-bar">
            <span className="presets-label">پروتکل‌های پیش‌تنظیم بالینی:</span>
            <div className="presets-group">
              <button
                type="button"
                className={`preset-btn ${co2Concentration === 10 ? "active" : ""}`}
                onClick={() => setCo2Concentration(10)}
              >
                پوست دست‌نخورده (۱۰٪ - Baseline)
              </button>
              <button
                type="button"
                className={`preset-btn ${co2Concentration === 65 ? "active" : ""}`}
                onClick={() => setCo2Concentration(65)}
              >
                پروتکل خانگی ReeSkin™ (۶۵٪ - Homecare Kit)
              </button>
              <button
                type="button"
                className={`preset-btn ${co2Concentration === 100 ? "active" : ""}`}
                onClick={() => setCo2Concentration(100)}
              >
                پروتکل کلینیکال CarboX™ (۱۰۰٪ - Clinical Pro)
              </button>
            </div>
          </div>
        </div>

        {/* Main Twin Scientific Stage */}
        <div className="bohr-sim-grid">
          {/* Panel 1: Precision Dermal Capillary Cross-Section */}
          <div className="sim-visual-card">
            <div className="svc-header">
              <div className="svc-title-wrap">
                <span className="svc-badge">IN VIVO CAPILLARY RESPONSE</span>
                <h3 className="svc-title">اتساع عروقی مویرگ‌های درم و رهاسازی اکسیژن مولکولی</h3>
              </div>
              <div className="svc-metric-live">
                <span>اتساع لومن عروقی:</span>
                <strong>+{vasodilation - 100}٪</strong>
              </div>
            </div>

            <div className="svc-canvas-wrap" dir="ltr" aria-hidden="true">
              <svg viewBox="0 0 460 250" className="svc-capillary-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Capillary walls gradient */}
                  <linearGradient id={`${gradientId}-wall`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#BE123C" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>
                  {/* Blood lumen plasma gradient */}
                  <linearGradient id={`${gradientId}-plasma`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF1F2" />
                    <stop offset="100%" stopColor="#FFE4E6" />
                  </linearGradient>
                  {/* Oxygen burst glow */}
                  <radialGradient id={`${gradientId}-o2glow`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                  </radialGradient>
                  {/* CO2 Nano Bubble */}
                  <radialGradient id={`${gradientId}-co2bub`} cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#A7F3D0" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                </defs>

                {/* Skin Surface Stratum Corneum */}
                <rect x="0" y="0" width="460" height="24" fill="#1E3A2F" rx="4" />
                <text x="15" y="16" fill="#E4C9A8" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
                  CarboxyGel Matrix (Topical CO₂ Generator)
                </text>
                <text x="445" y="16" fill="#A7F3D0" fontSize="9" fontWeight="700" textAnchor="end" fontFamily="sans-serif">
                  pH {pH} · Controlled Osmotic Flux
                </text>

                {/* Stratum Corneum Diffusion Barrier */}
                <rect x="0" y="24" width="460" height="14" fill="#F5EFE6" stroke="#E2DDD2" strokeWidth="1" />
                <text x="230" y="34" fill="#786650" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                  Stratum Corneum Layer (Non-Invasive Barrier Diffusion)
                </text>

                {/* Transdermal CO2 micro-bubbles penetrating down */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <circle
                    key={`co2-bub-${i}`}
                    cx={35 + i * 48}
                    cy={45 + ((i * 19) % 25)}
                    r={3.5 + (co2Concentration / 100) * 3}
                    fill={`url(#${gradientId}-co2bub)`}
                    opacity={0.5 + (co2Concentration / 100) * 0.5}
                  />
                ))}

                {/* Interstitial Dermis Background */}
                <rect x="0" y="38" width="460" height="212" fill="#FAF8F5" />

                {/* Extracellular matrix fibers */}
                <g stroke="#E8E2D5" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="20" y1="80" x2="160" y2="70" />
                  <line x1="180" y1="85" x2="320" y2="75" />
                  <line x1="340" y1="75" x2="440" y2="85" />
                </g>

                {/* Capillary Tube Wall Upper */}
                <rect
                  x="0"
                  y={130 - capillaryWidth}
                  width="460"
                  height="8"
                  rx="3"
                  fill={`url(#${gradientId}-wall)`}
                />
                {/* Lumen Area */}
                <rect
                  x="0"
                  y={138 - capillaryWidth}
                  width="460"
                  height={capillaryWidth * 2 - 16}
                  fill={`url(#${gradientId}-plasma)`}
                />
                {/* Capillary Tube Wall Lower */}
                <rect
                  x="0"
                  y={122 + capillaryWidth}
                  width="460"
                  height="8"
                  rx="3"
                  fill={`url(#${gradientId}-wall)`}
                />

                {/* Red Blood Cells (Erythrocytes) traversing capillary */}
                {[
                  { cx: 65, cy: 130, label: "Hb-O₂", fill: "#BE123C" },
                  { cx: 175, cy: 126, label: "Hb", fill: "#E11D48" },
                  { cx: 285, cy: 134, label: "Hb", fill: "#E11D48" },
                  { cx: 395, cy: 128, label: "Deoxy", fill: "#4338CA" },
                ].map((rbc, idx) => (
                  <g key={`rbc-${idx}`}>
                    <ellipse
                      cx={rbc.cx}
                      cy={rbc.cy}
                      rx={18 + (co2Concentration / 100) * 4}
                      ry={11 + (co2Concentration / 100) * 3}
                      fill={rbc.fill}
                      stroke="#881337"
                      strokeWidth="1.5"
                    />
                    <ellipse cx={rbc.cx} cy={rbc.cy} rx={9} ry={5.5} fill="rgba(255,255,255,0.2)" />
                    <text x={rbc.cx} y={rbc.cy + 3} fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                      {rbc.label}
                    </text>

                    {/* Released O2 Molecules bursting upward towards hypoxic cells */}
                    {co2Concentration > 20 && (
                      <g transform={`translate(${rbc.cx}, ${rbc.cy})`}>
                        <circle cx="-12" cy={-(capillaryWidth - 2)} r="5.5" fill="#0284C7" />
                        <text x="-12" y={-(capillaryWidth - 5)} fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">O₂</text>

                        <circle cx="10" cy={-(capillaryWidth + 6)} r="6" fill="#38BDF8" />
                        <text x="10" y={-(capillaryWidth + 3)} fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">O₂</text>
                      </g>
                    )}
                  </g>
                ))}

                {/* Oxygenation Density Halo in Interstitial Dermis */}
                {co2Concentration > 35 && (
                  <circle
                    cx="230"
                    cy="65"
                    r={30 + (co2Concentration / 100) * 35}
                    fill={`url(#${gradientId}-o2glow)`}
                  />
                )}

                {/* Subtitle Annotation */}
                <text x="230" y="238" fill="#1E3A2F" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
                  Dermal Capillary Lumen Perfusion · Instant Bohr O₂ Dissociation
                </text>
              </svg>
            </div>

            <div className="svc-footer-info">
              <div className="svc-status-pill">
                <span className="dot" style={{ background: phase.badgeColor }} aria-hidden="true" />
                <span className="pill-code">{phase.phaseCode}</span>
                <strong>{phase.stageFa}</strong>
              </div>
              <p className="svc-status-desc">{phase.desc}</p>
            </div>
          </div>

          {/* Panel 2: Christian Bohr Oxygen Dissociation Monograph & 4 Telemetry Boxes */}
          <div className="sim-visual-card">
            <div className="svc-header">
              <div className="svc-title-wrap">
                <span className="svc-badge">BIOCHEMICAL DISSOCIATION CURVE</span>
                <h3 className="svc-title">منحنی تفکیک اکسی‌هموگلوبین و شیفت به راست بوهر</h3>
              </div>
              <div className="svc-metric-live">
                <span>اسیدیته لایه شاخی:</span>
                <strong>pH {pH}</strong>
              </div>
            </div>

            <div className="svc-canvas-wrap" dir="ltr" aria-hidden="true">
              <svg viewBox="0 0 460 250" className="svc-bohr-graph-svg" preserveAspectRatio="xMidYMid meet">
                {/* Background grid */}
                <rect x="0" y="0" width="460" height="250" fill="#FAF8F5" />

                {/* Graph Axes */}
                <line x1="55" y1="25" x2="55" y2="205" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="55" y1="205" x2="435" y2="205" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Grid ticks */}
                {[0.25, 0.5, 0.75].map((tick, i) => (
                  <line
                    key={`gt-${i}`}
                    x1="55"
                    y1={205 - tick * 165}
                    x2="435"
                    y2={205 - tick * 165}
                    stroke="#E2DDD2"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Axis Labels */}
                <text x="22" y="115" fill="#64748B" fontSize="9.5" fontWeight="700" transform="rotate(-90 22 115)" textAnchor="middle" fontFamily="sans-serif">
                  HbO₂ Saturation (%)
                </text>
                <text x="245" y="228" fill="#64748B" fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                  Tissue Partial Pressure pO₂ (mmHg)
                </text>

                {/* Baseline Normal Curve (Static dashed line, pH 7.40) */}
                <path
                  d="M 55 205 Q 135 165, 255 80 T 425 40"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <text x="315" y="65" fill="#64748B" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                  Normal Baseline (pH 7.40)
                </text>

                {/* Dynamic Bohr Shift Curve (Right shifted with CO2) */}
                <path
                  d={`M 55 205 Q ${curveCtrlX} ${curveCtrlY}, 275 110 T 425 ${45 + (co2Concentration / 100) * 35}`}
                  fill="none"
                  stroke="#1E3A2F"
                  strokeWidth="3.2"
                />
                <text x="280" y="138" fill="#1E3A2F" fontSize="10" fontWeight="900" fontFamily="sans-serif">
                  Rightward Bohr Shift (pH {pH})
                </text>

                {/* Visual marker of O2 release gap */}
                <line
                  x1="225"
                  y1="130"
                  x2="225"
                  y2={130 + (co2Concentration / 100) * 44}
                  stroke="#B83A2E"
                  strokeWidth="2.5"
                />
                <circle cx="225" cy={130 + (co2Concentration / 100) * 44} r="3.5" fill="#B83A2E" />
                <text x="235" y={145 + (co2Concentration / 100) * 16} fill="#B83A2E" fontSize="10" fontWeight="900" fontFamily="sans-serif">
                  {`Δ O₂ Release: +${o2Release}%`}
                </text>
              </svg>
            </div>

            {/* 4 Quantitative Telemetry Boxes */}
            <div className="svc-metrics-quad">
              <div className="sm-box">
                <span className="smb-label">رهاسازی اکسیژن (O₂ Burst)</span>
                <span className="smb-val highlight-forest">+{o2Release}٪</span>
                <small className="smb-sub">انتقال بدون سوزن به فیبروبلاست</small>
              </div>

              <div className="sm-box">
                <span className="smb-label">اتساع مویرگ‌های درمیس</span>
                <span className="smb-val highlight-gold">+{vasodilation - 100}٪</span>
                <small className="smb-sub">افزایش قطر لومن عروق خونی</small>
              </div>

              <div className="sm-box">
                <span className="smb-label">تنظیم اسیدیته موضعی</span>
                <span className="smb-val">{pH} pH</span>
                <small className="smb-sub">تحریک آنزیم‌های بازسازی سد</small>
              </div>

              <div className="sm-box">
                <span className="smb-label">شتاب سنتز ATP سلولی</span>
                <span className="smb-val highlight-red">{atpBoost}x</span>
                <small className="smb-sub">انرژی تنفس میتوکندریایی</small>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Callout Footer & Product Direct Anchoring */}
        <div className="bohr-sim-footer">
          <div className="bsf-content">
            <span className="bsf-tag">نتیجه فارماکولوژی بالینی Dr. Dermer UK:</span>
            <p>
              برخلاف روش‌های تهاجمی تزریق مزوتراپی با سوزن، سیستم کربوکسی‌تراپی دکتر درمر با تولید کنترل‌شده گاز CO₂ در غشای پاد ترابافتی، عوارض درد، کبودی، تروما و نکروز بافتی را به صفر می‌رساند.
            </p>
            <div className="bsf-active-rec">
              <span>توصیه متناظر با دوز انتخابی: </span>
              <strong>{phase.productRecommendation}</strong>
            </div>
          </div>

          <Link href={phase.productLink} className="bsf-cta-btn">
            مشاهده پرونده تخصصی و ثبت سفارش پروتکل ←
          </Link>
        </div>
      </div>
    </section>
  );
}
