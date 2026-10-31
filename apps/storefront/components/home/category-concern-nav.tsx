import Link from 'next/link';

export function CategoryConcernNav() {
  const concerns = [
    {
      id: 'acne-blemish',
      title: 'کنترل آکنه و تنظیم سبوم',
      subtitle: 'پاکسازی منافذ، سالیسیلیک و زینک PCA',
      badge: 'Acne & Blemish',
      count: '۱۲ فرمول',
      href: '/search?q=آکنه',
      accentColor: '#0EA5E9',
    },
    {
      id: 'anti-aging',
      title: 'جوانسازی و پپتیدهای ضدپیری',
      subtitle: 'ماتریکسیل ۳۰۰۰، آرژیرلین و فاکتور EGF',
      badge: 'Peptides & Cellular',
      count: '۱۸ فرمول',
      href: '/search?q=پپتید',
      accentColor: '#10B981',
    },
    {
      id: 'barrier-repair',
      title: 'ترمیم سد دفاعی پوست',
      subtitle: 'سرامید NP کمپلکس، اکتوئین و بپانتن',
      badge: 'Lipid Barrier Repair',
      count: '۱۵ فرمول',
      href: '/search?q=سرامید',
      accentColor: '#F59E0B',
    },
    {
      id: 'hyperpigmentation',
      title: 'درمان لک و تیرگی ملاسما',
      subtitle: 'ترانگزامیک اسید، آربوتین و ویتامین C پایدار',
      badge: 'Brightening & Melanin',
      count: '۹ فرمول',
      href: '/search?q=روشن+کننده',
      accentColor: '#8B5CF6',
    },
    {
      id: 'post-procedure',
      title: 'مراقبت پس از لیزر و پیلینگ',
      subtitle: 'کربوکسی‌تراپی تسکینی و ژل بازسازی فوری',
      badge: 'Post-Procedure Care',
      count: '۸ پروتکل',
      href: '/search?q=کربوکسی',
      accentColor: '#EC4899',
    },
  ];

  return (
    <section id="concerns" className="clinical-concerns-section" aria-labelledby="concerns-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">طبقه‌بندی بالینی بر اساس نیاز پوست</div>
        <h2 id="concerns-title" className="section-title">
          انتخاب نسخه بر پایه دغدغه و وضعیت اپیدرم
        </h2>
        <p className="section-subtext">
          هر روتین پوستی در دکتر درمر بر پایه تشخیص دقیق اختلال عملکرد سلولی طراحی شده است.
        </p>
      </div>

      <div className="concerns-grid">
        {concerns.map((c) => (
          <Link href={c.href} key={c.id} className="concern-card" style={{ '--accent-line': c.accentColor } as React.CSSProperties}>
            <div className="concern-card-top">
              <span className="concern-badge">{c.badge}</span>
              <span className="concern-count">{c.count}</span>
            </div>
            <h3 className="concern-title">{c.title}</h3>
            <p className="concern-subtitle">{c.subtitle}</p>
            <div className="concern-action">
              <span>مشاهده پروتکل‌های درمانی</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
