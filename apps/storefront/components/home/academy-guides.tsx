import Link from 'next/link';

export function AcademyGuides() {
  const guides = [
    {
      slug: 'protocol-7-days-cellular-renewal',
      title: 'راهنمای پروتکل بازسازی پوست در ۷ روز با CarboxyGel',
      readTime: '۶ دقیقه مطالعه تخصصی',
      category: 'پروتکل بالینی خانگی',
      summary:
        'مراحل دقیق آماده‌سازی پوست، زمان‌بندی اعمال ماسک فعال‌ساز دی‌اکسید کربن و استفاده از سرم سرامید جهت دستیابی به حداکثر اثر بوهر.',
      tags: ['کربوکسی‌تراپی', 'اثر بوهر', 'فیبروبلاست'],
    },
    {
      slug: 'retinol-and-hyaluronic-acid-layering',
      title: 'ترکیب هوشمندانه رتینول انکپسوله و هیالورونیک اسید',
      readTime: '۸ دقیقه مطالعه تخصصی',
      category: 'دانشنامه ترکیبات فعال',
      summary:
        'چگونه پایداری مولکولی رتینول را حفظ کنیم و با لایه‌بندی صحیح سرم‌های هیدراته، از خشکی یا تحریک احتمالی لایه شاخی جلوگیری نماییم.',
      tags: ['رتینول', 'هیالورونیک اسید', 'سد دفاعی'],
    },
    {
      slug: 'post-laser-recovery-reemed-clinical',
      title: 'مدیریت ریکاوری پس از جلسات میکرونیدلینگ و لیزر فراکشنال',
      readTime: '۵ دقیقه مطالعه تخصصی',
      category: 'پروتکل کلینیکال',
      summary:
        'پروتکل اختصاصی ReeMed جهت مهار سایتوکاین‌های التهابی، تسکین قرمزی اریتما و کوتاه کردن دوره نقاهت به کمتر از ۲۴ ساعت.',
      tags: ['لیزر فراکشنال', 'التیام سریع', 'پپتید مس'],
    },
  ];

  return (
    <section id="academy" className="academy-section" aria-labelledby="academy-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">آکادمی درماتولوژی و راهنماهای پروتکل</div>
        <h2 id="academy-title" className="section-title">
          دانش کاربردی مصرف: پروتکل‌های گام‌به‌گام و تداخلات فعال
        </h2>
        <p className="section-subtext">
          آکادمی علمی دکتر درمر با تکیه بر مقالات معتبر ژورنال‌های بالینی، نحوه استفاده صحیح از فرمولاسیون‌های فعال را تبیین می‌کند.
        </p>
      </div>

      <div className="academy-cards-grid">
        {guides.map((g) => (
          <article className="academy-card" key={g.slug}>
            <div className="academy-card-meta">
              <span className="academy-category-pill">{g.category}</span>
              <span className="academy-read-time">{g.readTime}</span>
            </div>
            <h3 className="academy-card-title">
              <Link href={`/blog/${g.slug}`}>{g.title}</Link>
            </h3>
            <p className="academy-card-summary">{g.summary}</p>
            <div className="academy-tags">
              {g.tags.map((t, i) => (
                <span className="academy-tag" key={i}>#{t}</span>
              ))}
            </div>
            <div className="academy-card-footer">
              <Link href={`/blog/${g.slug}`} className="academy-read-link">
                <span>مطالعه کامل پروتکل و دستور مصرف</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
