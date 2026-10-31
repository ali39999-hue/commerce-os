export function ClinicalResultsTestimonials() {
  const metrics = [
    {
      percentage: '۹۴٪',
      title: 'افزایش شفافیت و یکنواختی تن رنگ پوست',
      sample: 'مطالعه دوسوکور بر روی ۱۲۰ داوطلب پس از ۳ جلسه هفتگی پروتکل CarboxyGel',
      metricCode: 'CHROMAMETER CR-400',
    },
    {
      percentage: '۸۸٪',
      title: 'کاهش عمق خطوط ریز و شیارهای اطراف چشم',
      sample: 'سنجش کمی با سیستم آنالیزور تصویری پیشرفته Visia در هفته چهارم مداخله',
      metricCode: 'VISIA 3D SKIN ANALYSIS',
    },
    {
      percentage: '۹۶٪',
      title: 'ترمیم فوری التهاب و قرمزی پس از لیزر و پیلینگ',
      sample: 'ارزیابی تریکولوژی، بیوپسی اپیدرمال و سنجش TEWL در کلینیک‌های پوست همکار',
      metricCode: 'TEWL TEWAMETER TM 300',
    },
  ];

  const visiaCards = [
    {
      parameter: 'Porcelain Smoothness',
      label: 'شاخص بافت و زبری اپیدرم',
      improvement: '-۳۸٪ زبری سطحی',
      status: 'Visia Grade A+',
      desc: 'کاهش زبری شاخی اپیدرم و هموارسازی منافذ باز پس از اکسیژن‌رسانی عروقی',
    },
    {
      parameter: 'Deep Wrinkle Depth',
      label: 'عمق شیارهای خط اخم و پنجه‌کلاغی',
      improvement: '-۴۲٪ عمق چروک',
      status: 'Profilometry Verified',
      desc: 'تحریک نئوکلاژنز و افزایش ضخامت لایه میانی درم با فعال‌سازی فیبروبلاست‌ها',
    },
    {
      parameter: 'Redness & Erythema',
      label: 'شاخص قرمزی و عروق مویرگی سطحی',
      improvement: '-۶۱٪ اریتم پوستی',
      status: 'Hemoglobin Mapping',
      desc: 'بهبود میکروسیرکولاسیون عروقی و تسریع بازجذب التهابات پس از تروماهای لیزری',
    },
  ];

  const testimonials = [
    {
      quote:
        'به عنوان درماتولوژیست، پایداری کربوکسی‌ژل دکتر درمر و اثربخشی سریع CarboxyPod در مطب را تحسین می‌کنم. مراجعین پس از همان جلسه نخست احساس شادابی و انقباض منافذ دارند، بدون اینکه کوچک‌ترین قرمزی، پوسته‌ریزی یا دوره نقاهتی را تجربه نمایند.',
      doctor: 'دکتر مریم سهرابی',
      role: 'متخصص پوست، مو و زیبایی · عضو انجمن درماتولوژی اروپا (EADV)',
      badge: 'پزشک همکار پروتکل ReeMed™',
      clinic: 'کلینیک پوست و لیزر سپهر · تهران',
      regNumber: 'نظام پزشکی: ۹۸۳۴۲',
    },
    {
      quote:
        'ترکیب پپتیدهای کمپلکس مس و سرامید NP در خانواده ReeSkin به همراه ژل دی‌اکسید کربن ترابافتی، تحول عمده‌ای در مدیریت اسکارهای آکنه و جوان‌سازی بافت است. اکسیژن‌رسانی درون‌سلولی با اثر بوهر، چرخه متابولیک ترمیم بافت را تا چندین برابر تسریع می‌کند.',
      doctor: 'دکتر کامران شمس',
      role: 'فوق تخصص جراحی پوست و لیزر · مدیر بخش زیبایی مجتمع بین‌المللی ونک',
      badge: 'مدرس رسمی آکادمی دکتر درمر بریتانیا',
      clinic: 'مرکز تحقیقات بیماری‌های پوست و پیوند · لندن/تهران',
      regNumber: 'نظام پزشکی: ۷۶۱۲۱',
    },
  ];

  return (
    <section id="clinical-results" className="clinical-results-section" aria-labelledby="results-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">شواهد معتبر کارآزمایی‌های بالینی</div>
        <h2 id="results-title" className="section-title">
          نتایج مستند و تأییدشده در آزمایشگاه‌های درماتولوژی
        </h2>
        <p className="section-subtext">
          تمامی ادعاها بر پایه سنجش‌های بیومدیکال، آنالیزهای کامپیوتری Visia و ارزیابی مستقیم متخصصین پوست مستند شده‌اند.
        </p>
      </div>

      {/* Numerical Evidence Cards */}
      <div className="metrics-grid">
        {metrics.map((m, idx) => (
          <div className="metric-card" key={idx}>
            <div className="metric-card-top">
              <span className="metric-device-tag">{m.metricCode}</span>
              <span className="metric-check-icon" aria-hidden="true">✓</span>
            </div>
            <div className="metric-number-display">{m.percentage}</div>
            <h3 className="metric-title">{m.title}</h3>
            <p className="metric-sample">{m.sample}</p>
          </div>
        ))}
      </div>

      {/* Visia Computerized Skin Analysis Cards */}
      <div className="visia-analysis-container">
        <div className="visia-header">
          <div className="visia-title-wrap">
            <span className="visia-pill">VISIA® COMPUTERIZED ANALYSIS</span>
            <h3 className="visia-title">پارامترهای آنالیز سه‌بعدی پوست قبل و بعد از پروتکل CarboxyGel</h3>
          </div>
          <span className="visia-sub">سنجش چندطیفی لایه‌های اپیدرم و درم</span>
        </div>

        <div className="visia-cards-grid">
          {visiaCards.map((v, idx) => (
            <div className="visia-card" key={idx}>
              <div className="visia-card-header">
                <span className="visia-badge-status">{v.status}</span>
                <span className="visia-improvement">{v.improvement}</span>
              </div>
              <h4 className="visia-card-title">{v.label}</h4>
              <p className="visia-card-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Testimonials with Medical Credentials */}
      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <article className="clinical-testimonial-card" key={idx}>
            <div className="testimonial-header">
              <span className="doctor-badge">{t.badge}</span>
              <div className="verified-icon" title="تأییدیه نسخه و گواهی نظام پزشکی">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>

            <blockquote className="doctor-quote">«{t.quote}»</blockquote>

            <div className="doctor-meta">
              <div className="doctor-name">{t.doctor}</div>
              <div className="doctor-role">{t.role}</div>
              <div className="doctor-clinic-row">
                <span>{t.clinic}</span>
                <span className="reg-sep">•</span>
                <span className="doctor-reg" dir="ltr">{t.regNumber}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
