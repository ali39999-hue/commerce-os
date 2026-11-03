import Link from 'next/link';

export function PathSelector() {
  const paths = [
    {
      id: 'home-care',
      tag: 'HOME CLINICAL REGIMEN',
      badge: 'نسخه بدون سوزن • استفاده فردی',
      title: 'رژیم مراقبت خانگی ReeSkin™',
      desc: 'فرمولاسیون‌های درمانی ترنس‌درمال ۲ فاز CarboxyGel، ترمیم سد دفاعی و پپتیدهای ضدپیری با تحریک طبیعی اثر بوهر در منزل.',
      highlights: ['کیت‌های ۵ عددی CarboxyGel', 'خمیر پولیش ابریشمی Crystalene', 'اسکراب دتوکس منافذ Silicalene'],
      ctaLabel: 'مشاهده محصولات خانگی',
      href: '/reeskin',
      themeClass: 'theme-homecare',
    },
    {
      id: 'clinical-pro',
      tag: 'CLINIC CONSUMABLES & PROTOCOLS',
      badge: 'ویژه مطب و کلینیک',
      title: 'اقلام کابین و پروتکل‌های مطبی',
      desc: 'مخازن بزرگ ۵۰۰ و ۱۵۰۰ میلی‌لیتر ژل کربوکسی همراه با شیت‌های ۵۰ ستی صورت و کارتریج‌های تک‌دوز استریل CarboxyPod.',
      highlights: ['پک‌های بزرگ اقتصادی کابین', 'پدهای استریل ۵۰ ستی صورت و گردن', 'فاکتور رسمی دارویی و ارسال کلدچین'],
      ctaLabel: 'مشاهده اقلام کابین و مطب',
      href: '/reemed#consumables',
      themeClass: 'theme-pro',
    },
    {
      id: 'medical-equipment',
      tag: 'MEDICAL HARDWARE & STATIONS',
      badge: 'MDR Class IIb Certified',
      title: 'تجهیزات و سامانه‌های پزشکی ReeMed™',
      desc: 'ایستگاه‌های تخصصی تزریق دیجیتال CO₂ با دقت ۱cc/min و فناوری پلاسمای سرد اتمسفری ویژه درماتولوژیست‌ها و جراحان پوست.',
      highlights: ['ایستگاه دوگانه مدیکال CarboX', 'سامانه پلاسمای سرد PlasmaX', '۲۴ ماه گارانتی طلایی و امتیاز CME'],
      ctaLabel: 'بررسی تجهیزات پزشکی',
      href: '/reemed#devices',
      themeClass: 'theme-equipment',
    },
  ];

  return (
    <section className="path-selector-section" aria-labelledby="path-selector-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">انتخاب مسیر تخصصی متناسب با نیاز شما</div>
        <h2 id="path-selector-title" className="section-title">
          شما در کدام مسیر درمانی همراه دکتر درمر هستید؟
        </h2>
        <p className="section-subtext">
          برای دسترسی سریع‌تر به محصولات و خدمات، حوزه مورد نظر خود را از میان رژیم‌های خانگی، ملزومات مطب و تجهیزات تخصصی انتخاب فرمایید.
        </p>
      </div>

      <div className="path-selector-grid">
        {paths.map((p) => (
          <article key={p.id} className={`path-card ${p.themeClass}`}>
            <div className="path-card-top">
              <span className="path-tag">{p.tag}</span>
              <span className="path-badge">{p.badge}</span>
            </div>

            <h3 className="path-title">{p.title}</h3>
            <p className="path-desc">{p.desc}</p>

            <ul className="path-highlights" aria-label="شاخص‌های برجسته">
              {p.highlights.map((h, idx) => (
                <li key={idx}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="path-action-wrap">
              <Link href={p.href} className="path-action-btn">
                <span>{p.ctaLabel}</span>
                <span className="path-btn-sub" aria-hidden="true">مشاهده پروتکل و کاتالوگ</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
