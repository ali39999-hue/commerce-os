import Link from 'next/link';

export function BrandFamilyRail() {
  return (
    <section id="brands" className="brand-family-section" aria-labelledby="brand-family-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">معماری خطوط تخصصی دکتر درمر</div>
        <h2 id="brand-family-title" className="section-title">
          دو خانواده محصولی متمایز: از رژیم خانگی تا تجهیزات کلینیکال
        </h2>
        <p className="section-subtext">
          طراحی‌شده بر پایه استانداردهای بیومدیکال درمر انگلستان جهت تفکیک دقیق نیازهای بیمار و پزشک متخصص.
        </p>
      </div>

      <div className="brand-family-grid">
        {/* Family 1: ReeSkin Clinical */}
        <div className="brand-family-card reeskin-card">
          <div className="brand-card-top-stripe reeskin-stripe" aria-hidden="true"></div>
          <div className="brand-card-inner">
            <div className="brand-card-header">
              <div className="brand-flag-group">
                <span className="family-flag reeskin-flag">HOME CLINICAL REGIMEN</span>
                <span className="family-prescription-tag">نسخه بدون سوزن</span>
              </div>
              <h3 className="family-name">ReeSkin™ Clinical</h3>
              <p className="family-tagline">
                مراقبت روزانه و دوره‌ای با فرمولاسیون دارای گرید دارویی جهت استمرار درمان‌های مطبی در منزل
              </p>
            </div>

            <div className="brand-features-list">
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>کیت‌های CarboxyGel خانگی:</strong>
                  <span>اکسیژن‌رسانی عمقی اپیدرمال با پایداری میکروحباب‌های CO2</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>کمپلکس سد دفاعی (Barrier Repair):</strong>
                  <span>پپتیدهای مس (GHK-Cu) و سرامید NP خالص جهت ترمیم پوست دهیدراته</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>سرم‌های ویتامینه بیومیمتیک:</strong>
                  <span>ترانگزامیک اسید، آربوتین و ویتامین C پایدار با جذب ترابافتی فوق‌العاده</span>
                </div>
              </div>
            </div>

            <div className="brand-card-footer">
              <Link href="/search?q=ReeSkin" className="btn-family-link reeskin-btn">
                <span>کاوش محصولات خانواده ReeSkin™</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Family 2: ReeMed Medical Pro */}
        <div className="brand-family-card reemed-card">
          <div className="brand-card-top-stripe reemed-stripe" aria-hidden="true"></div>
          <div className="brand-card-inner">
            <div className="brand-card-header">
              <div className="brand-flag-group">
                <span className="family-flag medical reemed-flag">PROFESSIONAL MEDICAL</span>
                <span className="family-prescription-tag clinic-tag">ویژه کلینیک و مطب</span>
              </div>
              <h3 className="family-name">ReeMed™ Medical Pro</h3>
              <p className="family-tagline">
                سیستم‌ها، پادهای ترابافتی CarboxyPod و ژل‌های غلیظ ویژه متخصصین درماتولوژی و کلینیک‌های زیبایی
              </p>
            </div>

            <div className="brand-features-list">
              <div className="feature-row">
                <span className="feature-bullet medical-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>دستگاه و پادهای CarboxyPod Pro:</strong>
                  <span>انفوزیون پرسرعت مولکول‌های ترابافتی CO2 با هندپیس استاندارد پزشکی</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet medical-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>کارتریج‌های تخصصی مزوتراپی بدون سوزن:</strong>
                  <span>هیالورونیک اسید کراس‌لینک با وزن مولکولی متغیر جهت لیفت و حجم‌دهی طبیعی</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet medical-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>پروتکل B2B، فاکتور رسمی و آموزش بالینی:</strong>
                  <span>صدور گواهی رسمی آکادمی دکتر درمر برای تیم درمان و بیوتی‌تراپیست‌ها</span>
                </div>
              </div>
            </div>

            <div className="brand-card-footer">
              <Link href="/b2b" className="btn-family-link reemed-btn">
                <span>درخواست تأمین کلینیکی و کاتالوگ پزشکان (ReeMed™)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
