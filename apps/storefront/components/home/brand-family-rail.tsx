import Link from 'next/link';

export function BrandFamilyRail() {
  return (
    <section id="brands" className="brand-family-section" aria-labelledby="brand-family-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">معماری خطوط تخصصی دکتر درمر انگلستان</div>
        <h2 id="brand-family-title" className="section-title">
          دو خانواده محصولی متمایز: از فرمولاسیون خانگی ReeSkin تا تجهیزات پزشکی ReeMed
        </h2>
        <p className="section-subtext">
          طراحی‌شده بر پایه استانداردهای بیومدیکال درمر انگلستان جهت تفکیک دقیق نیازهای مراقبت روتین خانگی و تجهیزات مطبی متخصصین.
        </p>
      </div>

      <div className="brand-family-grid">
        {/* Family 1: ReeSkin Clinical */}
        <div className="brand-family-card reeskin-card">
          <div className="brand-card-top-stripe reeskin-stripe" aria-hidden="true"></div>
          <div className="brand-card-inner">
            <div className="brand-card-header">
              <div className="brand-top-row">
                <div className="brand-flag-group">
                  <span className="family-flag reeskin-flag">HOME CLINICAL REGIMEN</span>
                  <span className="family-prescription-tag">نسخه بدون سوزن</span>
                </div>
                <div className="brand-logo-wrap reeskin-logo-wrap">
                  <img
                    src="/assets/drdermer/2025/07/reeskin.png"
                    alt="لوگوی رسمی ReeSkin"
                    className="brand-official-logo"
                  />
                </div>
              </div>
              <h3 className="family-name">ReeSkin™ Clinical</h3>
              <p className="family-tagline">
                فرمولاسیون‌های درمانی دارای گرید دارویی با ۶ محصول کلیدی جهت استمرار رژیم مراقبت بالینی در منزل:
              </p>
            </div>

            <div className="brand-features-list">
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>CarboxyGel:</strong>
                  <span>ژل ۲ فاز کربوکسی‌تراپی غیرتهاجمی با تحریک اثر بوهر (Bohr Effect) و اکسیژن‌رسانی عمیق سلولی.</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>CarboxyPod:</strong>
                  <span>پادهای ترابافتی لایه‌بردار و فعال‌ساز گاز CO₂ در انواع Carbon، Hydra و Multi-Vita.</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>CarboxyPad:</strong>
                  <span>شیت‌ها و پدهای آلکالاین صورت و گردن جهت القای حداکثر تبادل گازی بر سطح ژل.</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>Healene:</strong>
                  <span>ژل ترمیم‌کننده، آبرسان عمقی و تسکین‌بخش فوری قرمزی و التهاب پس از پیلینگ و لیزر.</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>Crystalene:</strong>
                  <span>خمیر پولیش و لایه‌بردار ابریشمی با میکروکریستال‌های آلومینای گرید پزشکی و اسید لاکتیک.</span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>Silicalene:</strong>
                  <span>اسکراب دتوکس و پاکسازی عمقی منافذ با میکروسفرهای کروی سیلیکا، زغال فعال و BHA.</span>
                </div>
              </div>
            </div>

            {/* ReeSkin 6 Products Fast Navigation Chips */}
            <div className="brand-products-rail" aria-label="محصولات ۶گانه خانواده ReeSkin">
              <span className="products-rail-title">دسترسی سریع به لاین ReeSkin:</span>
              <div className="products-chip-group">
                <Link href="/products/carboxygel" className="product-fast-chip">CarboxyGel</Link>
                <Link href="/products/carboxypod" className="product-fast-chip">CarboxyPod</Link>
                <Link href="/products/carboxypad" className="product-fast-chip">CarboxyPad</Link>
                <Link href="/products/healene" className="product-fast-chip">Healene</Link>
                <Link href="/products/crystalene" className="product-fast-chip">Crystalene</Link>
                <Link href="/products/silicalene" className="product-fast-chip">Silicalene</Link>
              </div>
            </div>

            <div className="brand-card-footer">
              <Link href="/reeskin" className="btn-family-link reeskin-btn">
                <span>مشاهده پورتال و کاتالوگ جامع لاین ReeSkin™</span>
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
              <div className="brand-top-row">
                <div className="brand-flag-group">
                  <span className="family-flag medical reemed-flag">PROFESSIONAL MEDICAL</span>
                  <span className="family-prescription-tag clinic-tag">ویژه کلینیک و مطب</span>
                </div>
                <div className="brand-logo-wrap reemed-logo-wrap">
                  <img
                    src="/assets/drdermer/2025/07/reemed-gray.png"
                    alt="لوگوی رسمی ReeMed"
                    className="brand-official-logo"
                  />
                </div>
              </div>
              <h3 className="family-name">ReeMed™ Medical Pro</h3>
              <p className="family-tagline">
                پلتفرم پیشرفته دستگاه‌های پزشکی کلینیکال و های‌تک ویژه درماتولوژیست‌ها و جراحان زیبایی:
              </p>
            </div>

            <div className="brand-features-list">
              <div className="feature-row">
                <span className="feature-bullet medical-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>دستگاه CarboX™:</strong>
                  <span>
                    ایستگاه کاری دوگانه تزریق زیرجلدی فوق‌دقیق گاز دی‌اکسید کربن پزشکی همراه با هندپیس ارگونومیک فعال‌سازی CarboxyPod
                    جهت درمان تیرگی دور چشم، استریا، سلولیت و جوان‌سازی پوست.
                  </span>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-bullet medical-bullet" aria-hidden="true">✓</span>
                <div>
                  <strong>دستگاه PlasmaX™:</strong>
                  <span>
                    سیستم پیشرفته انرژی چندگانه پلاسما مجهز به تکنولوژی Continuous Discharge، جت پلاسمای سرد آرگون و هلیوم و
                    DBD پلاسما جهت بلفاروپلاستی غیرتهاجمی، رفع اسکار آکنه و استریل‌سازی بافتی.
                  </span>
                </div>
              </div>
            </div>

            {/* ReeMed Medical Devices Visual Preview */}
            <div className="brand-devices-showcase">
              <span className="products-rail-title">تجهیزات پزشکی کلینیکال خانواده ReeMed:</span>
              <div className="devices-dual-grid">
                <Link href="/products/carbox" className="device-spotlight-card">
                  <img
                    src="/assets/drdermer/2025/08/19carbox.webp"
                    alt="دستگاه کربوکسی تراپی CarboX"
                    className="device-spotlight-img"
                  />
                  <div className="device-spotlight-content">
                    <span className="device-chip">کربوکسی‌تراپی مطبی</span>
                    <strong className="device-title">دستگاه CarboX™</strong>
                    <span className="device-link-txt">مشخصات فنی و استعلام ←</span>
                  </div>
                </Link>

                <Link href="/products/plasmax" className="device-spotlight-card">
                  <img
                    src="/assets/drdermer/2025/08/18plasmax.webp"
                    alt="دستگاه پلاسما و جت سرد PlasmaX"
                    className="device-spotlight-img"
                  />
                  <div className="device-spotlight-content">
                    <span className="device-chip">پلاسمای سرد و DBD</span>
                    <strong className="device-title">دستگاه PlasmaX™</strong>
                    <span className="device-link-txt">مشخصات فنی و استعلام ←</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="brand-card-footer">
              <Link href="/reemed" className="btn-family-link reemed-btn">
                <span>مشاهده پورتال تجهیزات پزشکی و آموزش (ReeMed™)</span>
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
