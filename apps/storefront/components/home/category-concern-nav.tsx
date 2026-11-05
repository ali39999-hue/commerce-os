'use client';

import Link from 'next/link';

export function CategoryConcernNav() {
  const concerns = [
    {
      id: 'acne-blemish',
      title: 'کنترل آکنه و تنظیم سبوم',
      subtitle: 'پاکسازی منافذ، سالیسیلیک و زینک PCA دارویی',
      badge: 'Acne & Blemish',
      count: '۱۲ فرمول فعال',
      icon: '🧪',
      href: '/search?q=آکنه',
      accentColor: '#1E3A2F',
    },
    {
      id: 'anti-aging',
      title: 'جوانسازی و پپتیدهای ضدپیری',
      subtitle: 'ماتریکسیل ۳۰۰۰، آرژیرلین و فاکتور نوسازی EGF',
      badge: 'Peptides & Cellular',
      count: '۱۸ فرمول فعال',
      icon: '✨',
      href: '/search?q=پپتید',
      accentColor: '#1E3A2F',
    },
    {
      id: 'barrier-repair',
      title: 'ترمیم سد دفاعی پوست',
      subtitle: 'سرامید NP کمپلکس، اکتوئین و بپانتن دارویی',
      badge: 'Lipid Barrier Repair',
      count: '۱۵ فرمول فعال',
      icon: '🛡️',
      href: '/search?q=سرامید',
      accentColor: '#1E3A2F',
    },
    {
      id: 'hyperpigmentation',
      title: 'درمان لک و تیرگی ملاسما',
      subtitle: 'ترانگزامیک اسید، آربوتین و ویتامین C پایدار',
      badge: 'Brightening & Melanin',
      count: '۹ فرمول فعال',
      icon: '☀️',
      href: '/search?q=روشن+کننده',
      accentColor: '#755A38',
    },
    {
      id: 'post-procedure',
      title: 'مراقبت پس از لیزر و پیلینگ',
      subtitle: 'کربوکسی‌تراپی تسکینی و ژل بازسازی فوری هیلین',
      badge: 'Post-Procedure Care',
      count: '۸ پروتکل کابین',
      icon: '❄️',
      href: '/search?q=کربوکسی',
      accentColor: '#755A38',
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
          هر روتین پوستی در دکتر درمر بر پایه تشخیص دقیق اختلال عملکرد سلولی و شاخص نفوذ ترابافتی طراحی شده است.
        </p>
      </div>

      <div className="concerns-grid">
        {concerns.map((c) => (
          <Link href={c.href} key={c.id} className="concern-card">
            <div className="concern-card-top">
              <span className="concern-icon" aria-hidden="true">{c.icon}</span>
              <span className="concern-badge">{c.badge}</span>
            </div>
            <h3 className="concern-title">{c.title}</h3>
            <p className="concern-subtitle">{c.subtitle}</p>
            <div className="concern-bottom-row">
              <span className="concern-count-pill">{c.count}</span>
              <div className="concern-action-arrow" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
