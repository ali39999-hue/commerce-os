export function TrustCredibilityBar() {
  const items = [
    {
      title: 'تأییدیه‌های بین‌المللی',
      desc: 'مطابق استانداردهای سختگیرانه CE اروپا و استاندارد دارویی GMP انگلستان',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 11 14 15 10"></polyline>
        </svg>
      ),
    },
    {
      title: 'آزموده شده توسط درماتولوژیست‌ها',
      desc: 'ارزیابی اثربخشی و عدم سمیت سلولی در کلینیک‌های پوست لندن و کمبریج',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
    },
    {
      title: '۱۰۰٪ تضمین اصالت و پلمپ آزمایشگاهی',
      desc: 'کد رهگیری اصالت TTAC و ضمانت مرجوعی بی‌قیدوشرط در صورت نقض پلمپ',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
    },
    {
      title: 'لجستیک کنترل دما (Cold Chain)',
      desc: 'نگهداری و ارسال در بسته‌بندی عایق حرارتی جهت حفظ فعالیت زیستی پپتیدها',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="clinical-trust-bar" aria-label="شاخص‌های اعتبار بالینی و استانداردها">
      <div className="trust-bar-grid">
        {items.map((item, idx) => (
          <div className="trust-card" key={idx}>
            <div className="trust-icon-box" aria-hidden="true">
              {item.icon}
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
