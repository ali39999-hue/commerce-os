'use client';

import Link from 'next/link';

export function BrandFamilyRail() {
  return (
    <section id="brands" className="brand-family-section" aria-labelledby="brand-family-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">معماری خطوط تخصصی دکتر درمر انگلستان</div>
        <h2 id="brand-family-title" className="section-title">
          دو خط درمانی تخصصی: از مراقبت فردی ReeSkin تا کیت‌های پیشرفته ReeMed
        </h2>
        <p className="section-subtext">
          طراحی‌شده بر پایه استانداردهای بیومدیکال درمر انگلستان جهت تفکیک دقیق نیازهای مراقبت روتین فردی و کیت‌های تخصصی اثر بوهر.
        </p>
      </div>

      <div className="brand-family-grid">
        {/* Family 1: ReeSkin Clinical */}
        <div className="brand-family-card reeskin-card">
          <div className="brand-card-top-stripe reeskin-stripe" aria-hidden="true" />
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
                فرمولاسیون‌های درمانی ترابافتی بر پایه اثر فیزیولوژیک بوهر (Bohr Effect) جهت اکسیژن‌رسانی عمقی، نوسازی سد دفاعی و جوانسازی بدون تهاجم در منزل.
              </p>
            </div>

            {/* Visual Products Strip Showcase */}
            <div className="family-products-visual-strip" aria-label="فرمولاسیون‌های شاخص خانواده ReeSkin">
              <Link href="/products/carboxygel" className="fp-visual-item">
                <div className="fp-visual-thumb">
                  <img
                    src="/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png"
                    alt="CarboxyGel Professional"
                    className="fp-thumb-img"
                  />
                </div>
                <strong>CarboxyGel™</strong>
                <span>کربوکسی‌تراپی ۲ فاز</span>
              </Link>

              <Link href="/products/carboxypod" className="fp-visual-item">
                <div className="fp-visual-thumb">
                  <img
                    src="/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png"
                    alt="CarboxyPod Activation Pods"
                    className="fp-thumb-img"
                  />
                </div>
                <strong>CarboxyPod™</strong>
                <span>کپسول‌های فعال‌ساز</span>
              </Link>

              <Link href="/products/crystalene" className="fp-visual-item">
                <div className="fp-visual-thumb">
                  <img
                    src="/assets/drdermer/2025/08/crystalene-scrub.webp"
                    alt="Crystalene Polish Paste"
                    className="fp-thumb-img"
                  />
                </div>
                <strong>Crystalene™</strong>
                <span>پولیش آلومینا</span>
              </Link>

              <Link href="/products/healene" className="fp-visual-item">
                <div className="fp-visual-thumb">
                  <img
                    src="/assets/drdermer/2025/08/healene-gel.webp"
                    alt="Healene Soothing Gel"
                    className="fp-thumb-img"
                  />
                </div>
                <strong>Healene™</strong>
                <span>ژل تسکین و التیام</span>
              </Link>
            </div>

            {/* Core Clinical Pillars */}
            <div className="family-pillars-list">
              <div className="pillar-item">
                <span className="pillar-icon" aria-hidden="true">🔬</span>
                <div>
                  <strong>انفوزیون بیوشیمیایی اثر بوهر:</strong>
                  <span>تحریک رهایش طبیعی اکسیژن موضعی هموگلوبین بدون سوزن</span>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon" aria-hidden="true">🛡️</span>
                <div>
                  <strong>پایداری سد دفاعی پوست:</strong>
                  <span>کاهش ۷۸ درصدی TEWL و بازسازی لیپیدی اپیدرم ظرف ۷۲ ساعت</span>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon" aria-hidden="true">❄️</span>
                <div>
                  <strong>پروتکل زنجیره سرمایی:</strong>
                  <span>حفظ اثربخشی مواد مؤثره در دمای ۲ الی ۸ درجه سانتی‌گراد</span>
                </div>
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

        {/* Family 2: ReeMed Clinical Solutions */}
        <div className="brand-family-card reemed-card">
          <div className="brand-card-top-stripe reemed-stripe" aria-hidden="true" />
          <div className="brand-card-inner">
            <div className="brand-card-header">
              <div className="brand-top-row">
                <div className="brand-flag-group">
                  <span className="family-flag medical reemed-flag">PROFESSIONAL CLINICAL</span>
                  <span className="family-prescription-tag clinic-tag">پروتکل‌های پیشرفته</span>
                </div>
                <div className="brand-logo-wrap reemed-logo-wrap">
                  <img
                    src="/assets/drdermer/2025/07/reemed-gray.png"
                    alt="لوگوی رسمی ReeMed"
                    className="brand-official-logo"
                  />
                </div>
              </div>
              <h3 className="family-name">ReeMed™ Clinical Solutions</h3>
              <p className="family-tagline">
                پلتفرم پیشرفته کیت‌های ترابافتی، شیت‌های میکروپرمنبران و فرمولاسیون‌های تخصصی دارای استانداردهای فارماکوپه انگلستان و ISO 22716.
              </p>
            </div>

            {/* Visual Products Dual Spotlight */}
            <div className="family-duo-showcase" aria-label="محصولات و کیت‌های خانواده ReeMed">
              <Link href="/carboxypod" className="duo-modern-card">
                <div className="dmc-image-wrap">
                  <img
                    src="/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png"
                    alt="کپسول‌های فعال‌ساز ترابافتی CarboxyPod"
                    className="dmc-thumb-img"
                  />
                </div>
                <div className="dmc-info">
                  <span className="dmc-badge">TRANSDERMAL PODS</span>
                  <strong>کپسول‌های CarboxyPod™</strong>
                  <span>پادهای فعال‌ساز نانوحباب‌های CO₂ در مدل‌های کربن، هیدرا و ویتامین</span>
                  <span className="dmc-action-txt">بررسی فرمولاسیون و سفارش ←</span>
                </div>
              </Link>

              <Link href="/carboxypad" className="duo-modern-card">
                <div className="dmc-image-wrap">
                  <img
                    src="/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png"
                    alt="شیت ماسک‌های فعال‌ساز CarboxyPad"
                    className="dmc-thumb-img"
                  />
                </div>
                <div className="dmc-info">
                  <span className="dmc-badge bronze">ANATOMIC SHEETS</span>
                  <strong>ماسک‌های CarboxyPad™</strong>
                  <span>شیت‌های فیبری صورت، گردن و پلک جهت تثبیت تبادل گازی اثر بوهر</span>
                  <span className="dmc-action-txt">بررسی شیت‌ها و پدها ←</span>
                </div>
              </Link>
            </div>

            {/* Core Clinical Pillars */}
            <div className="family-pillars-list">
              <div className="pillar-item">
                <span className="pillar-icon" aria-hidden="true">🔬</span>
                <div>
                  <strong>خلوص فارماکوپه انگلستان:</strong>
                  <span>بالاترین گرید ترکیبات بیواکتیو با خلوص ۹۹.۸٪ بدون مواد نگهدارنده مضر</span>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon" aria-hidden="true">📊</span>
                <div>
                  <strong>سنجش بالینی Visia:</strong>
                  <span>اثربخشی مستندشده در کاهش عمق شیارها و یکنواختی تن رنگ چهره</span>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon" aria-hidden="true">📦</span>
                <div>
                  <strong>بسته‌بندی هرمتیک هوابند:</strong>
                  <span>پکینگ استریل فویل آلومینیوم و پایداری کامل تا آخرین قطره مصرف</span>
                </div>
              </div>
            </div>

            <div className="brand-card-footer">
              <Link href="/reemed" className="btn-family-link reemed-btn">
                <span>مشاهده پروتکل‌ها و کیت‌های جامع (ReeMed™)</span>
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
