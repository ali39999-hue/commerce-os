import Link from 'next/link';

export function ClinicB2BStrip() {
  return (
    <section className="clinic-b2b-strip" aria-labelledby="b2b-strip-title">
      <div className="b2b-strip-container">
        <div className="b2b-content-side">
          <div className="b2b-eyebrow">
            <span className="b2b-pulse-dot" aria-hidden="true" />
            <span>پورتال اختصاصی متخصصین پوست، جراحان و مدیران کلینیک‌های زیبایی</span>
          </div>

          <h2 id="b2b-strip-title" className="b2b-title">
            تأمین مستقیم تجهیزات پزشکی ReeMed و کیت‌های کلینیکال CarboxyPod
          </h2>

          <p className="b2b-text">
            با پیوستن به شبکه کلینیک‌های طرف قرارداد Dr. Dermer UK در سراسر کشور، از قیمت‌گذاری پلکانی همکار، صدور رسمی پیش‌فاکتور شرکتی، کارگاه‌های عملی حضوری برای کادر درمان و خدمات پس از فروش کمپانی انگلستان بهره‌مند شوید.
          </p>

          <div className="b2b-perks">
            <div className="perk-item">
              <div className="perk-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="perk-copy">
                <strong>فاکتور رسمی شرکتی و شناسه اقتصادی:</strong>
                <span>صدور آنی فاکتور رسمی معتبر در سامانه مودیان و دارایی.</span>
              </div>
            </div>

            <div className="perk-item">
              <div className="perk-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className="perk-copy">
                <strong>سرتیفیکیت رسمی آکادمی دکتر درمر:</strong>
                <span>اعطای گواهی معتبر اپراتوری و کاربری بالینی دستگاه‌های CarboX و PlasmaX.</span>
              </div>
            </div>

            <div className="perk-item">
              <div className="perk-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="perk-copy">
                <strong>زنجیره تأمین اختصاصی و پرداخت اعتباری:</strong>
                <span>ارسال منظم ماهانه ژل‌ها و پادها با شرایط پرداخت منعطف برای مراکز درمانی.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="b2b-action-side">
          <div className="b2b-cta-card">
            <span className="cta-card-badge">B2B PARTNERSHIP PORTAL</span>
            <h3 className="cta-card-title">ثبت استعلام و پورتال همکاران</h3>
            <p className="cta-card-desc">
              درخواست خود را برای دریافت پیش‌فاکتور قیمت همکاری، جدول اقساط و کاتالوگ جامع ارتوپدی و پوست ارسال فرمایید.
            </p>
            <Link href="/b2b" className="btn-b2b-primary">
              <span>ورود به پورتال B2B و درخواست همکاری</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <div className="b2b-support-phone">
              <span>خط مستقیم مدیریت امور بالینی: </span>
              <a href="tel:02188880002" dir="ltr" className="phone-num">۰۲۱-۸۸۸۸۰۰۰۲</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
