export function ClinicalResultsTestimonials() {
  const metrics = [
    {
      percentage: '۹۴٪',
      title: 'افزایش شفافیت و یکنواختی تن رنگ پوست',
      sample: 'مطالعه دوسوکور بر روی ۱۲۰ داوطلب پس از ۳ جلسه هفتگی CarboxyGel',
    },
    {
      percentage: '۸۸٪',
      title: 'کاهش عمق خطوط ریز و شیارهای اطراف چشم',
      sample: 'سنجش با دستگاه آنالیزور تصویری Visia در هفته چهارم پروتکل',
    },
    {
      percentage: '۹۶٪',
      title: 'ترمیم سریع التهاب پس از پیلینگ و لیزر',
      sample: 'ارزیابی تریکولوژی و بیوپسی اپیدرمال در کلینیک‌های پوست همکار',
    },
  ];

  const testimonials = [
    {
      quote:
        'به عنوان درماتولوژیست، پایداری کربوکسی ژل دکتر درمر و اثربخشی سریع CarboxyPod در مطب را تحسین می‌کنم. بیماران پس از همان جلسه نخست احساس شادابی و انقباض منافذ دارند، بدون اینکه کوچک‌ترین قرمزی یا پوسته‌ریزی آزاردهنده‌ای را تجربه کنند.',
      doctor: 'دکتر مریم سهرابی',
      role: 'متخصص پوست، مو و زیبایی · عضو انجمن درماتولوژی اروپا',
      badge: 'پزشک همکار پروتکل ReeMed',
    },
    {
      quote:
        'ترکیب پپتیدهای کمپلکس ReeSkin به همراه ژل دی‌اکسید کربن، تحول عمده‌ای در مدیریت اسکارهای پس از آکنه است. اکسیژن‌رسانی عمقی متابولیسم ترمیم بافت را تا چندین برابر تسریع می‌کند.',
      doctor: 'دکتر کامران شمس',
      role: 'فوق تخصص جراحی پوست و لیزر · مدیر کلینیک پوست ونک',
      badge: 'مدرس رسمی آکادمی دکتر درمر',
    },
  ];

  return (
    <section id="clinical-results" className="clinical-results-section" aria-labelledby="results-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">شواهد معتبر کارآزمایی بالینی</div>
        <h2 id="results-title" className="section-title">
          نتایج مستند و تأییدشده در آزمایشگاه‌های درماتولوژی
        </h2>
        <p className="section-subtext">
          تمامی ادعاها بر پایه سنجش‌های بیومدیکال، آنالیزهای تصویری دقیق و ارزیابی مستقیم متخصصین پوست مستند شده‌اند.
        </p>
      </div>

      {/* Numerical Evidence Cards */}
      <div className="metrics-grid">
        {metrics.map((m, idx) => (
          <div className="metric-card" key={idx}>
            <div className="metric-number-display">{m.percentage}</div>
            <h3 className="metric-title">{m.title}</h3>
            <p className="metric-sample">{m.sample}</p>
          </div>
        ))}
      </div>

      {/* Doctor Testimonials */}
      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <article className="clinical-testimonial-card" key={idx}>
            <div className="testimonial-header">
              <span className="doctor-badge">{t.badge}</span>
              <div className="verified-icon" title="تأییدیه نسخه و گواهی نظام پزشکی">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <blockquote className="doctor-quote">«{t.quote}»</blockquote>
            <div className="doctor-meta">
              <div className="doctor-name">{t.doctor}</div>
              <div className="doctor-role">{t.role}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
