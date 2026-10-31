import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="clinical-hero" aria-labelledby="hero-main-title">
      <div className="hero-grid-layout">
        <div className="hero-content-col">
          <div className="hero-eyebrow-chip">
            <span className="chip-pulsing-dot" aria-hidden="true"></span>
            <span>انقلاب بازسازی ترابافتی پوست · آزمایشگاه‌های انگلستان</span>
          </div>

          <h1 id="hero-main-title" className="hero-heading">
            اکسیژن‌رسانی سلولی با اثر بوهر؛
            <br />
            <span className="gradient-text">CarboxyGel CO2 Therapy</span>
          </h1>

          <p className="hero-description">
            تلفیق نوآورانه دی‌اکسید کربن ترابافتی و پپتیدهای بیومیمتیک برای تحریک چرخه هموگلوبین و آزادسازی فوری اکسیژن در
            بافت‌های عمقی پوست. نتایج معتبر بالینی در کاهش چروک، رفع اسکار آکنه و بازیابی الاستیسیته بدون نیاز به سوزن و
            جراحی.
          </p>

          <div className="hero-cta-group">
            <Link href="#featured-products" className="btn-clinical-primary">
              <span>خرید نسخه خانگی ReeSkin</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              <span>ویژه کلینیک‌ها و پزشکان (ReeMed)</span>
            </Link>
          </div>

          {/* Quick clinical stats pill */}
          <div className="hero-clinical-stats">
            <div className="stat-item">
              <strong className="stat-number">+۴۵٪</strong>
              <span className="stat-label">افزایش اکسیژن‌رسانی مویرگی (O2 Saturation)</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <strong className="stat-number">۷ روز</strong>
              <span className="stat-label">شروع چرخه بازسازی فیبروبلاست‌ها</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <strong className="stat-number">۱۰۰٪</strong>
              <span className="stat-label">بدون تهاجم، بدون دوره نقاهت (Zero Downtime)</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card / Medical Aesthetic Presentation */}
        <div className="hero-visual-col">
          <div className="hero-visual-card">
            <div className="visual-card-glow"></div>
            <div className="visual-badge-top">
              <span className="badge-tech">BOHR EFFECT TECHNOLOGY</span>
              <span className="badge-standard">CE MEDICAL CERTIFIED</span>
            </div>

            <div className="visual-graphic-container">
              {/* Artistic SVG rendering of molecular transdermal CO2 release */}
              <div className="molecular-graphic" aria-hidden="true">
                <svg viewBox="0 0 400 320" className="molecule-svg">
                  <defs>
                    <radialGradient id="gelGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0F766E" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="podGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="50%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer aura circles */}
                  <circle cx="200" cy="160" r="140" fill="url(#gelGlow)" />
                  <circle cx="200" cy="160" r="110" fill="none" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="6 6" opacity="0.6" />
                  <circle cx="200" cy="160" r="85" fill="none" stroke="#14B8A6" strokeWidth="1.5" opacity="0.8" />

                  {/* Transdermal Device / Pod Representation */}
                  <rect x="135" y="80" width="130" height="160" rx="36" fill="url(#podGrad)" stroke="#94A3B8" strokeWidth="2" filter="drop-shadow(0 15px 30px rgba(15, 23, 42, 0.15))" />
                  <rect x="155" y="105" width="90" height="90" rx="45" fill="#0F766E" />
                  <circle cx="200" cy="150" r="32" fill="#14B8A6" opacity="0.8" />
                  <circle cx="200" cy="150" r="18" fill="#F8FAFC" />

                  {/* CO2 Microbubble indicators */}
                  <circle cx="105" cy="100" r="8" fill="#2DD4BF" opacity="0.8" />
                  <text x="105" y="104" fill="#042F2E" fontSize="9" fontWeight="bold" textAnchor="middle">CO₂</text>

                  <circle cx="295" cy="120" r="11" fill="#38BDF8" opacity="0.8" />
                  <text x="295" y="124" fill="#082F49" fontSize="10" fontWeight="bold" textAnchor="middle">O₂</text>

                  <circle cx="95" cy="210" r="9" fill="#2DD4BF" opacity="0.7" />
                  <text x="95" y="214" fill="#042F2E" fontSize="9" fontWeight="bold" textAnchor="middle">CO₂</text>

                  <circle cx="305" cy="220" r="8" fill="#38BDF8" opacity="0.7" />
                  <text x="305" y="224" fill="#082F49" fontSize="9" fontWeight="bold" textAnchor="middle">O₂</text>

                  {/* Label */}
                  <text x="200" y="220" fill="#0F172A" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">CARBOXY-POD PRO</text>
                  <text x="200" y="235" fill="#64748B" fontSize="9" textAnchor="middle">TRANSDERMAL INFUSION</text>
                </svg>
              </div>
            </div>

            <div className="visual-card-footer">
              <div className="visual-footer-info">
                <span className="pack-name">کیت جامع CarboxyGel + CarboxyPod</span>
                <span className="pack-family">خانواده محصولی ReeSkin Professional</span>
              </div>
              <div className="visual-footer-status">
                <span className="status-badge available">تحویل با زنجیره سرمایی</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
