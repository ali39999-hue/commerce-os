import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="clinical-hero" aria-labelledby="hero-main-title">
      <div className="hero-grid-layout">
        {/* Left Column: Clinical Copy & Interactive Dual CTAs */}
        <div className="hero-content-col">
          <div className="hero-eyebrow-chip">
            <span className="chip-pulsing-dot" aria-hidden="true"></span>
            <span className="eyebrow-text">Dr Dermer UK · Innovative Medical Devices & Skincare</span>
            <span className="eyebrow-badge">UK CLINICAL LABS</span>
          </div>

          <h1 id="hero-main-title" className="hero-heading">
            محصولات و تجهیزات پزشکی نوآورانه
            <br />
            <span className="gradient-text">طراحی‌شده برای ایمنی و اثربخشی برتر</span>
          </h1>

          <div className="hero-english-motto" dir="ltr">
            “Innovative medical devices & skincare invented to be more safe and effective”
          </div>

          <p className="hero-description">
            پیشگام در تکنولوژی‌های بالینی نوین با تلفیق کربوکسی‌تراپی غیرتهاجمی CarboxyGel CO₂ بر پایه مکانیسم فیزیولوژیک
            اثر بوهر (Bohr Effect) جهت اکسیژن‌رسانی و بازسازی سلولی، در کنار پلتفرم پیشرفته دستگاه‌های پزشکی ReeMed™
            شامل استیشن کربوکسی‌تراپی دقیق CarboX و سیستم انرژی چندگانه پلاسما PlasmaX ویژه درماتولوژیست‌ها و مراکز تخصصی.
          </p>

          <div className="hero-cta-group">
            <Link href="#featured-products" className="btn-clinical-primary btn-glow">
              <span>مشاهده و خرید محصولات درمانی</span>
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
              <span>ورود به بخش حرفه‌ای‌ها و کلینیک‌ها (B2B)</span>
            </Link>
          </div>

          {/* Floating Clinical Stats Cards */}
          <div className="hero-clinical-stats" aria-label="شاخص‌های بالینی اثبات‌شده">
            <div className="stat-card">
              <div className="stat-card-glow" aria-hidden="true"></div>
              <strong className="stat-number">+۴۵٪</strong>
              <span className="stat-label">اکسیژن‌رسانی عمقی سلولی با تحریک اثر بوهر (Bohr Effect)</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-glow" aria-hidden="true"></div>
              <strong className="stat-number">۱۰۰٪</strong>
              <span className="stat-label">غیرتهاجمی، بدون قرمزی و نقاهت با CarboxyGel CO₂ Therapy</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-glow" aria-hidden="true"></div>
              <strong className="stat-number">ReeMed™</strong>
              <span className="stat-label">تجهیزات پزشکی کلینیکال و های‌تک (CarboX & PlasmaX)</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Impact Visual Card / Authentic Dr Dermer Assets */}
        <div className="hero-visual-col">
          <div className="hero-visual-card">
            <div className="visual-card-glow" aria-hidden="true"></div>

            {/* Top Badges */}
            <div className="visual-badge-top">
              <div className="tech-badge-group">
                <span className="pulse-beacon" aria-hidden="true"></span>
                <span className="badge-tech">BOHR EFFECT CO₂ TECHNOLOGY</span>
              </div>
              <span className="badge-standard">CE MEDICAL 0123</span>
            </div>

            {/* Authentic Hero Showcase Visuals */}
            <div className="hero-real-showcase">
              <div className="hero-main-photo-wrap">
                <img
                  src="/assets/drdermer/2025/07/site-combo-carboxy-1.png"
                  alt="کیت جامع CarboxyGel CO2 Therapy و CarboxyPod دکتر درمر"
                  className="hero-main-photo"
                />
                <div className="hero-bohr-floating-badge" title="Bohr Effect: Hemoglobin O2 Release">
                  <img
                    src="/assets/drdermer/2025/07/bohr-effect.png"
                    alt="مکانیسم علمی اثر بوهر در اکسیژن‌رسانی سلولی"
                    className="hero-bohr-thumb"
                  />
                  <div className="hero-bohr-tag">
                    <strong>Bohr Effect</strong>
                    <span>آزادسازی O₂ سلولی</span>
                  </div>
                </div>
              </div>

              {/* Mini Devices Rail (ReeMed CarboX & PlasmaX) */}
              <div className="hero-devices-preview-grid">
                <Link href="/products/carbox" className="hero-mini-device-card" title="دستگاه پزشکی کربوکسی تراپی CarboX">
                  <img
                    src="/assets/drdermer/2025/08/19carbox.webp"
                    alt="دستگاه پزشکی CarboX"
                    className="hero-mini-device-thumb"
                  />
                  <div className="hero-mini-device-info">
                    <span className="hero-mini-badge">ReeMed Medical</span>
                    <strong className="hero-mini-name">CarboX™</strong>
                    <span className="hero-mini-sub">تزریق گاز CO₂ & پاد</span>
                  </div>
                </Link>

                <Link href="/products/plasmax" className="hero-mini-device-card" title="دستگاه پیشرفته انرژی پلاسما PlasmaX">
                  <img
                    src="/assets/drdermer/2025/08/18plasmax.webp"
                    alt="دستگاه پزشکی PlasmaX"
                    className="hero-mini-device-thumb"
                  />
                  <div className="hero-mini-device-info">
                    <span className="hero-mini-badge">ReeMed Medical</span>
                    <strong className="hero-mini-name">PlasmaX™</strong>
                    <span className="hero-mini-sub">پلاسمای سرد و DBD</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Visual Card Footer */}
            <div className="visual-card-footer">
              <div className="visual-footer-info">
                <span className="pack-name">کیت جامع CarboxyGel + CarboxyPod</span>
                <span className="pack-family">خانواده فرمولاسیون ReeSkin™ و تجهیزات ReeMed™</span>
              </div>
              <div className="visual-footer-status">
                <span className="status-badge cold-chain-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  استاندارد ایمنی MHRA انگلستان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
