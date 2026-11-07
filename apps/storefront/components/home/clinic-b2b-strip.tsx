import Link from 'next/link';

export function ClinicB2BStrip() {
  return (
    <section className="clinic-b2b-strip" aria-labelledby="formulation-strip-title">
      <div className="b2b-strip-container">
        <div className="b2b-content-side">
          <div className="b2b-eyebrow">
            <span className="b2b-pulse-dot" aria-hidden="true" />
            <span>فرمولاسیون‌های پیشرفته ۲ فاز با فعال‌سازی بیومتریک</span>
          </div>

          <h2 id="formulation-strip-title" className="b2b-title">
            هم‌افزایی علمی ژل CarboxyGel و پدهای فعال‌ساز واکنش بوهر
          </h2>

          <p className="b2b-text">
            سیستم رهایش ترنس‌درمال دی‌اکسید کربن فعال با تحریک طبیعی اثر بوهر، آزادسازی فوری اکسیژن در بافت و نوسازی عمیق فیبروبلاست‌ها را بدون نیاز به اقدامات تهاجمی به ارمغان می‌آورد.
          </p>

          <div className="b2b-perks">
            <div className="perk-item">
              <div className="perk-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="perk-copy">
                <strong>تحریک فیزیولوژیک اثر بوهر:</strong>
                <span>آزادسازی اکسیژن درون‌بافتی بر پایه شیب غلظت مولکولی دی‌اکسید کربن و هموگلوبین.</span>
              </div>
            </div>

            <div className="perk-item">
              <div className="perk-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="perk-copy">
                <strong>پایداری ماتریکس لاملار و سد دفاعی:</strong>
                <span>تثبیت رطوبت ترنس‌اپیدرمال با بهره‌گیری از سرامید NP و اسیدهای هیالورونیک چندوزنی.</span>
              </div>
            </div>

            <div className="perk-item">
              <div className="perk-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div className="perk-copy">
                <strong>استانداردهای خلوص فارماکوپه اروپایی:</strong>
                <span>تولید و کنترل کیفیت بر اساس استانداردهای ایزو و آزمون‌های غیرکومدوژنیک.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="b2b-action-side">
          <div className="b2b-cta-card">
            <span className="cta-card-badge">ADVANCED CARBOXYGEL FORMULATION</span>
            <h3 className="cta-card-title">مشاهده کیت‌های ۲ فاز CarboxyGel</h3>
            <p className="cta-card-desc">
              کاتالوگ جامع فرمولاسیون‌های موضعی، پدهای فعال‌ساز و سرم‌های ترمیم‌کننده پوست را بررسی فرمایید.
            </p>
            <Link href="/#products" className="btn-b2b-primary">
              <span>مشاهده کاتالوگ فرمولاسیون‌ها</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <div className="b2b-support-phone">
              <span>پاسخگویی به سوالات علمی فرمولاسیون: </span>
              <a href="tel:02188880002" dir="ltr" className="phone-num">۰۲۱-۸۸۸۸۰۰۰۲</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
