import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="clinical-hero" aria-labelledby="hero-main-title">
      <div className="hero-grid-layout">
        {/* Left Column: Clinical Copy & Interactive Dual CTAs */}
        <div className="hero-content-col">
          <div className="hero-eyebrow-chip">
            <span className="chip-pulsing-dot" aria-hidden="true"></span>
            <span className="eyebrow-text">انقلاب بازسازی ترابافتی پوست · آزمایشگاه‌های انگلستان</span>
            <span className="eyebrow-badge">UK FORMULATION</span>
          </div>

          <h1 id="hero-main-title" className="hero-heading">
            اکسیژن‌رسانی سلولی با اثر بوهر؛
            <br />
            <span className="gradient-text">CarboxyGel CO₂ Therapy</span>
          </h1>

          <p className="hero-description">
            تلفیق نوآورانه دی‌اکسید کربن ترابافتی و پپتیدهای بیومیمتیک برای تحریک چرخه هموگلوبین و آزادسازی فوری اکسیژن در
            بافت‌های عمقی پوست. نتایج اثبات‌شده بالینی در کاهش چین‌وچروک، رفع اسکار آکنه و بازیابی قوام اپیدرمال بدون نیاز به سوزن و
            جراحی.
          </p>

          <div className="hero-cta-group">
            <Link href="#featured-products" className="btn-clinical-primary btn-glow">
              <span>خرید نسخه خانگی ReeSkin™</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link href="/b2b" className="btn-clinical-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span>پورتال پزشکان و کلینیک‌ها (ReeMed™)</span>
            </Link>
          </div>

          {/* Floating Clinical Stats Cards */}
          <div className="hero-clinical-stats" aria-label="شاخص‌های بالینی اثبات‌شده">
            <div className="stat-card">
              <div className="stat-card-glow" aria-hidden="true"></div>
              <strong className="stat-number">+۴۵٪</strong>
              <span className="stat-label">افزایش اشباع اکسیژن مویرگی (O₂ Saturation)</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-glow" aria-hidden="true"></div>
              <strong className="stat-number">۷ روز</strong>
              <span className="stat-label">آغاز چرخه بازسازی فیبروبلاست و سنتز کلاژن</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-glow" aria-hidden="true"></div>
              <strong className="stat-number">۱۰۰٪</strong>
              <span className="stat-label">غیرتهاجمی، بدون قرمزی و بدون نقاهت (Zero Downtime)</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Impact Visual Card / Device & Molecular Pod */}
        <div className="hero-visual-col">
          <div className="hero-visual-card">
            <div className="visual-card-glow" aria-hidden="true"></div>

            {/* Top Badges */}
            <div className="visual-badge-top">
              <div className="tech-badge-group">
                <span className="pulse-beacon" aria-hidden="true"></span>
                <span className="badge-tech">BOHR EFFECT TECHNOLOGY</span>
              </div>
              <span className="badge-standard">CE MEDICAL 0123</span>
            </div>

            {/* Animated Molecular Canvas Graphic */}
            <div className="visual-graphic-container">
              <div className="molecular-graphic" aria-hidden="true">
                <svg viewBox="0 0 420 340" className="molecule-svg" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <radialGradient id="gelGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#0F766E" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#042F2E" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="podGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="40%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#94A3B8" />
                    </linearGradient>
                    <linearGradient id="co2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2DD4BF" />
                      <stop offset="100%" stopColor="#0F766E" />
                    </linearGradient>
                    <linearGradient id="o2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Bio-energy fields */}
                  <circle cx="210" cy="165" r="145" fill="url(#gelGlow)" />
                  <circle cx="210" cy="165" r="115" fill="none" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="6 6" opacity="0.65" />
                  <circle cx="210" cy="165" r="90" fill="none" stroke="#14B8A6" strokeWidth="1.5" opacity="0.85" />

                  {/* Device / Pod Representation */}
                  <rect x="145" y="80" width="130" height="170" rx="40" fill="url(#podGrad)" stroke="#CBD5E1" strokeWidth="2.5" filter="drop-shadow(0 20px 35px rgba(15, 23, 42, 0.4))" />
                  <rect x="165" y="105" width="90" height="90" rx="45" fill="#0F766E" />
                  <circle cx="210" cy="150" r="32" fill="#14B8A6" opacity="0.85" />
                  <circle cx="210" cy="150" r="18" fill="#F8FAFC" />

                  {/* Floating Transdermal Microbubbles with Glow */}
                  {/* CO2 Infusion microbubbles */}
                  <g className="bubble-float-1">
                    <circle cx="95" cy="100" r="16" fill="url(#co2Grad)" filter="drop-shadow(0 4px 10px rgba(45,212,191,0.5))" />
                    <text x="95" y="104" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">CO₂</text>
                  </g>

                  <g className="bubble-float-2">
                    <circle cx="85" cy="220" r="14" fill="url(#co2Grad)" filter="drop-shadow(0 4px 8px rgba(45,212,191,0.4))" />
                    <text x="85" y="224" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">CO₂</text>
                  </g>

                  {/* O2 Released microbubbles */}
                  <g className="bubble-float-3">
                    <circle cx="325" cy="115" r="18" fill="url(#o2Grad)" filter="drop-shadow(0 4px 12px rgba(56,189,248,0.5))" />
                    <text x="325" y="120" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">O₂</text>
                  </g>

                  <g className="bubble-float-4">
                    <circle cx="330" cy="225" r="15" fill="url(#o2Grad)" filter="drop-shadow(0 4px 10px rgba(56,189,248,0.4))" />
                    <text x="330" y="229" fill="#FFFFFF" fontSize="10" fontWeight="800" textAnchor="middle">O₂</text>
                  </g>

                  {/* Device Text Details */}
                  <text x="210" y="222" fill="#0F172A" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="0.08em">CARBOXY-POD PRO</text>
                  <text x="210" y="238" fill="#475569" fontSize="8.5" fontWeight="600" textAnchor="middle">TRANSDERMAL INFUSION</text>
                </svg>
              </div>
            </div>

            {/* Visual Card Footer */}
            <div className="visual-card-footer">
              <div className="visual-footer-info">
                <span className="pack-name">کیت جامع CarboxyGel + CarboxyPod</span>
                <span className="pack-family">خانواده محصولی ReeSkin™ & ReeMed™</span>
              </div>
              <div className="visual-footer-status">
                <span className="status-badge cold-chain-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                  توزیع با زنجیره سرمایی (Cold-Chain)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
