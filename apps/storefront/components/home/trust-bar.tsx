export function TrustCredibilityBar() {
  const items = [
    {
      badge: 'CE 0123 / ISO 13485',
      title: 'نشان رسمی CE Medical اروپا',
      desc: 'انطباق کامل با استاندارد مدیریت کیفیت تجهیزات پزشکی و استاندارد GMP دارویی بریتانیا',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      ),
    },
    {
      badge: 'CAMBRIDGE DERMA',
      title: 'تأییدیه متخصصین درماتولوژی',
      desc: 'سنجش عدم سمیت سلولی (Cytotoxicity) و اثربخشی بالینی در کلینیک‌های پوست لندن و کمبریج',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
    },
    {
      badge: 'TTAC BATCH VERIFIED',
      title: '۱۰۰٪ اصالت و پلمپ آزمایشگاهی',
      desc: 'قابلیت استعلام برخط شناسه رهگیری TTAC وزارت بهداشت به همراه ضمانت مرجوعی نقض پلمپ',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          <circle cx="12" cy="16" r="1"></circle>
        </svg>
      ),
    },
    {
      badge: '2°C - 8°C MONITORED',
      title: 'لجستیک کنترل دما (Cold Chain)',
      desc: 'بسته‌بندی عایق حرارتی ویژه و حفظ زنجیره سرمایی برای صیانت از فعالیت زیستی پپتیدها و آنزیم‌ها',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
          <line x1="12" y1="9" x2="12" y2="12"></line>
        </svg>
      ),
    },
  ];

  return (
    <section className="clinical-trust-bar" aria-label="شاخص‌های اعتبار بالینی و استانداردها">
      <div className="trust-bar-grid">
        {items.map((item, idx) => (
          <div className="trust-card" key={idx}>
            <div className="trust-card-top">
              <div className="trust-icon-box" aria-hidden="true">
                {item.icon}
              </div>
              <span className="trust-micro-badge">{item.badge}</span>
            </div>
            <div className="trust-text-box">
              <h3 className="trust-title">{item.title}</h3>
              <p className="trust-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
