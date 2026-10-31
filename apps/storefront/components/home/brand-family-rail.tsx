import Link from 'next/link';

export function BrandFamilyRail() {
  return (
    <section id="brands" className="brand-family-section" aria-labelledby="brand-family-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">معماری خطوط تخصصی دکتر درمر</div>
        <h2 id="brand-family-title" className="section-title">
          دو خانواده محصولی مکمل: از مراقبت خانگی تا تجهیزات کلینیک
        </h2>
        <p className="section-subtext">
          توسعه‌یافته بر پایه استانداردهای بیومدیکال درمر انگلستان جهت پوشش نیازهای بیمار و تیم درمانی.
        </p>
      </div>

      <div className="brand-family-grid">
        {/* Family 1: ReeSkin */}
        <div className="brand-family-card reeskin-card">
          <div className="brand-card-header">
            <span className="family-flag">HOME CLINICAL REGIMEN</span>
            <h3 className="family-name">ReeSkin™ Clinical</h3>
            <p className="family-tagline">مراقبت روزانه و دوره‌ای با فرمولاسیون دارای گرید دارویی برای مصرف خانگی</p>
          </div>
          <div className="brand-features-list">
            <div className="feature-row">
              <span className="feature-bullet">✓</span>
              <span><strong>کیت‌های CarboxyGel خانگی:</strong> تحریک اکسیژن‌رسانی بدون نیاز به ابزار تهاجمی</span>
            </div>
            <div className="feature-row">
              <span className="feature-bullet">✓</span>
              <span><strong>کمپلکس سد دفاعی:</strong> پپتیدهای مس (GHK-Cu) و سرامید خالص جهت بازسازی پوست دهیدراته</span>
            </div>
            <div className="feature-row">
              <span className="feature-bullet">✓</span>
              <span><strong>سرم‌های تثبیت‌کننده:</strong> پایدارسازی نتایج درمان‌های مطبی در منزل</span>
            </div>
          </div>
          <div className="brand-card-footer">
            <Link href="/search?q=ReeSkin" className="btn-family-link">
              <span>کاوش محصولات خانواده ReeSkin</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Link>
          </div>
        </div>

        {/* Family 2: ReeMed */}
        <div className="brand-family-card reemed-card">
          <div className="brand-card-header">
            <span className="family-flag medical">PROFESSIONAL MEDICAL</span>
            <h3 className="family-name">ReeMed™ Medical Pro</h3>
            <p className="family-tagline">سیستم‌ها، پادهای ترابافتی CarboxyPod و ژل‌های غلیظ ویژه کلینیک‌ها و مطب‌ها</p>
          </div>
          <div className="brand-features-list">
            <div className="feature-row">
              <span className="feature-bullet">✓</span>
              <span><strong>دستگاه و پادهای CarboxyPod Pro:</strong> انفوزیون پرسرعت مولکول‌های ترابافتی CO2</span>
            </div>
            <div className="feature-row">
              <span className="feature-bullet">✓</span>
              <span><strong>ویال‌های مزوتراپی بدون سوزن:</strong> نفوذ عمقی هیالورونیک اسید اولترا کراس‌لینک</span>
            </div>
            <div className="feature-row">
              <span className="feature-bullet">✓</span>
              <span><strong>فاکتور رسمی و آموزش بالینی:</strong> گواهی معتبر آکادمی و پشتیبانی علمی مستمر</span>
            </div>
          </div>
          <div className="brand-card-footer">
            <Link href="/b2b" className="btn-family-link medical-btn">
              <span>درخواست نمایندگی و کاتالوگ پزشکان (ReeMed)</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
