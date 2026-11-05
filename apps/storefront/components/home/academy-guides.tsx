import Link from 'next/link';

interface AcademyGuideItem {
  slug: string;
  title: string;
  readTime: string;
  category: string;
  summary: string;
  image: string;
  authorDossier: string;
  levelBadge: string;
  tags: string[];
}

export function AcademyGuides() {
  const guides: AcademyGuideItem[] = [
    {
      slug: 'protocol-7-days-cellular-renewal',
      title: 'راهنمای پروتکل بازسازی پوست در ۷ روز با CarboxyGel',
      readTime: '۶ دقیقه مطالعه تخصصی',
      category: 'پروتکل بالینی خانگی',
      summary:
        'مراحل دقیق آماده‌سازی پوست، زمان‌بندی اعمال ماسک فعال‌ساز دی‌اکسید کربن و استفاده از سرم سرامید جهت دستیابی به حداکثر اثر بوهر.',
      image: '/assets/drdermer/2024/10/glycolic-170-carbo-pod.webp',
      authorDossier: 'دپارتمان علمی ReeSkin™ UK',
      levelBadge: 'پروتکل گام‌به‌گام',
      tags: ['کربوکسی‌تراپی', 'اثر بوهر', 'فیبروبلاست'],
    },
    {
      slug: 'retinol-and-hyaluronic-acid-layering',
      title: 'ترکیب هوشمندانه رتینول انکپسوله و هیالورونیک اسید',
      readTime: '۸ دقیقه مطالعه تخصصی',
      category: 'دانشنامه ترکیبات فعال',
      summary:
        'چگونه پایداری مولکولی رتینول را حفظ کنیم و با لایه‌بندی صحیح سرم‌های هیدراته، از خشکی یا تحریک احتمالی لایه شاخی جلوگیری نماییم.',
      image: '/assets/drdermer/2024/10/2-azel-170-hydrapod.webp',
      authorDossier: 'لابراتوار فرمولاسیون کمبریج',
      levelBadge: 'فارماکولوژی فرمولاسیون',
      tags: ['رتینول', 'هیالورونیک اسید', 'سد دفاعی'],
    },
    {
      slug: 'post-laser-recovery-reemed-clinical',
      title: 'مدیریت ریکاوری و التیام پوست پس از لایه‌برداری و پیلینگ',
      readTime: '۵ دقیقه مطالعه تخصصی',
      category: 'پروتکل ترمیم پوست',
      summary:
        'پروتکل اختصاصی جهت مهار سایتوکاین‌های التهابی، تسکین فوری قرمزی اریتما و کوتاه کردن دوره بازسازی پوست به کمتر از ۲۴ ساعت.',
      image: '/assets/drdermer/2024/10/multi-170-vita-pod.webp',
      authorDossier: 'دپارتمان فرمولاسیون دکتر درمر',
      levelBadge: 'پروتکل التیام پوست',
      tags: ['ترمیم پوست', 'التیام سریع', 'پپتید مس'],
    },
  ];

  return (
    <section id="guides" className="academy-section" aria-labelledby="academy-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">
          <span className="eyebrow-pulse" aria-hidden="true" />
          دانش درماتولوژی و راهنماهای بالینی مصرف
        </div>
        <h2 id="academy-title" className="section-title">
          دانش کاربردی مصرف: پروتکل‌های گام‌به‌گام و راهنمای ترکیبات فعال
        </h2>
        <p className="section-subtext">
          پایگاه دانش دکتر درمر با تکیه بر مقالات معتبر درماتولوژی، دستورالعمل‌های صحیح فرمولاسیون‌های دارویی را جهت نوسازی ایمن پوست ارائه می‌دهد.
        </p>
      </div>

      <div className="academy-cards-grid">
        {guides.map((g) => (
          <article className="academy-card" key={g.slug}>
            <Link href={`/blog/${g.slug}`} className="academy-card-art" tabIndex={-1} aria-hidden="true">
              <img
                src={g.image}
                alt=""
                className="academy-card-img"
                loading="lazy"
              />
              <span className="academy-level-badge">{g.levelBadge}</span>
            </Link>

            <div className="academy-card-content">
              <div className="academy-card-meta">
                <span className="academy-category-pill">{g.category}</span>
                <span className="academy-read-time">{g.readTime}</span>
              </div>

              <h3 className="academy-card-title">
                <Link href={`/blog/${g.slug}`}>{g.title}</Link>
              </h3>

              <p className="academy-card-summary">{g.summary}</p>

              <div className="academy-author-strip">
                <span className="author-tag">مرجع تدوین:</span>
                <span className="author-name">{g.authorDossier}</span>
              </div>

              <div className="academy-tags">
                {g.tags.map((t, i) => (
                  <span className="academy-tag" key={i}>#{t}</span>
                ))}
              </div>

              <div className="academy-card-footer">
                <Link href={`/blog/${g.slug}`} className="academy-read-link">
                  <span>مطالعه کامل پروتکل و دستور مصرف</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
