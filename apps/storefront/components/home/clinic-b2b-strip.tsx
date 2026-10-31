import Link from 'next/link';

export function ClinicB2BStrip() {
  return (
    <section className="clinic-b2b-strip" aria-labelledby="b2b-strip-title">
      <div className="b2b-strip-container">
        <div className="b2b-content-side">
          <div className="b2b-eyebrow">
            <span className="b2b-pulse-dot" aria-hidden="true"></span>
            <span>ویژه پزشکان، متخصصین پوست و مدیران کلینیک‌های زیبایی</span>
          </div>

          <h2 id="b2b-strip-title" className="b2b-title">
            تأمین مستقیم تجهیزات CarboxyPod و ژل‌های کلینیکال ReeMed
          </h2>

          <p className="b2b-text">
            با عضویت در شبکه کلینیک‌های معتبر دکتر درمر، از تخفیف‌های پلکانی سازمانی، صدور رسمی فاکتور دارای شناسه رهگیری
            مالیاتی، کارگاه‌های آموزشی حضوری برای کادر درمان و پشتیبانی علمی ۲۴/۷ بهره‌مند شوید.
          </p>

          <div className="b2b-perks">
            <div className="perk-item">
              <span className="perk-icon" aria-hidden="true">📑</span>
              <span>فاکتور رسمی شرکتی با کد اقتصادی معتبر</span>
            </div>
            <div className="perk-item">
              <span className="perk-icon" aria-hidden="true">🎓</span>
              <span>اعطای سرتیفیکیت رسمی دوره اپراتوری CarboxyPod</span>
            </div>
            <div className="perk-item">
              <span className="perk-icon" aria-hidden="true">🚚</span>
              <span>تأمین منظم ماهانه با شرایط پرداخت اعتباری</span>
            </div>
          </div>
        </div>

        <div className="b2b-action-side">
          <div className="b2b-cta-card">
            <h3>ثبت استعلام و پورتال همکاران</h3>
            <p>درخواست خود را برای دریافت پیش‌فاکتور قیمت همکاری و کاتالوگ پزشکان ارسال کنید.</p>
            <Link href="/b2b" className="btn-b2b-primary">
              <span>ورود به پورتال B2B و درخواست خرید عمده</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <div className="b2b-support-phone">
              <span>خط ویژه واحد روابط بالینی: </span>
              <a href="tel:02188880002" dir="ltr">۰۲۱-۸۸۸۸۰۰۰۲</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
