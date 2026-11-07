export function ClinicalResultsTestimonials() {
  const metrics = [
    {
      percentage: '۹۴٪',
      title: 'افزایش شفافیت و یکنواختی تن رنگ پوست',
      sample: 'مطالعه دوسوکور بر روی ۱۲۰ داوطلب پس از ۳ جلسه هفتگی پروتکل CarboxyGel',
      metricCode: 'CHROMAMETER CR-400',
      cohort: 'کوهورت بالینی ۱۲۰ نفره (n=120)',
      deltaLabel: 'سنجش شاخص ملانین L*a*b*',
    },
    {
      percentage: '۸۸٪',
      title: 'کاهش عمق خطوط ریز و شیارهای اطراف چشم',
      sample: 'سنجش کمی با سیستم آنالیزور تصویری پیشرفته Visia در هفته چهارم مداخله',
      metricCode: 'VISIA 3D DERMAL PROFILOMETRY',
      cohort: 'ارزیابی ۳ بعدی فاز ۴ بالینی',
      deltaLabel: 'تحلیل عمق شیار بر حسب میکرومتر',
    },
    {
      percentage: '۹۶٪',
      title: 'ترمیم فوری التهاب و قرمزی پس از لایه‌برداری و پیلینگ',
      sample: 'ارزیابی بیومتریک، بیوپسی اپیدرمال و سنجش TEWL در کارآزمایی‌های دوسوکور بالینی',
      metricCode: 'TEWL TEWAMETER TM 300',
      cohort: 'سنجش هدررفت آب ترنس‌اپیدرمال',
      deltaLabel: 'پایداری سد دفاعی ظرف کمتر از ۲۴ ساعت',
    },
  ];

  const visiaCards = [
    {
      parameter: 'Porcelain Smoothness',
      label: 'شاخص بافت و زبری اپیدرم',
      improvement: '-۳۸٪ زبری سطحی',
      status: 'Visia Grade A+',
      desc: 'کاهش زبری شاخی اپیدرم و هموارسازی منافذ باز پس از اکسیژن‌رسانی عروقی اثر بوهر.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
    },
    {
      parameter: 'Deep Wrinkle Depth',
      label: 'عمق شیارهای خط اخم و پنجه‌کلاغی',
      improvement: '-۴۲٪ عمق چروک',
      status: 'Profilometry Verified',
      desc: 'تحریک نئوکلاژنز و افزایش ضخامت لایه میانی درم با فعال‌سازی فیبروبلاست‌های عمقی.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      parameter: 'Redness & Erythema',
      label: 'شاخص قرمزی و عروق مویرگی سطحی',
      improvement: '-۶۱٪ اریتم پوستی',
      status: 'Hemoglobin Mapping',
      desc: 'بهبود میکروسیرکولاسیون عروقی و تسریع بازجذب التهابات پس از لایه‌برداری عمیق و پیلینگ‌های اسیدی.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="clinical-results" className="clinical-results-section" aria-labelledby="results-title">
      <div className="section-header-compact">
        <div className="section-eyebrow">
          <span className="eyebrow-pulse" aria-hidden="true" />
          شواهد معتبر کارآزمایی‌های بالینی
        </div>
        <h2 id="results-title" className="section-title">
          نتایج مستند و تأییدشده در آزمایشگاه‌های درماتولوژی
        </h2>
        <p className="section-subtext">
          تمامی ادعاها بر پایه سنجش‌های بیومدیکال، آنالیزهای کامپیوتری Visia و پروتکل‌های دوسوکور آزمایشگاهی به ثبت رسیده‌اند.
        </p>
      </div>

      {/* Numerical Evidence Cards */}
      <div className="metrics-grid">
        {metrics.map((m, idx) => (
          <div className="metric-card" key={idx}>
            <div className="metric-card-top">
              <span className="metric-device-tag">{m.metricCode}</span>
              <span className="metric-cohort-tag">{m.cohort}</span>
            </div>
            <div className="metric-number-display">{m.percentage}</div>
            <h3 className="metric-title">{m.title}</h3>
            <p className="metric-sample">{m.sample}</p>
            <div className="metric-card-foot">
              <span className="metric-delta-indicator">{m.deltaLabel}</span>
            </div>
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
          <span className="visia-sub">سنجش چندطیفی لایه‌های اپیدرم و درمیس تحت استاندارد ISO 13485</span>
        </div>

        <div className="visia-cards-grid">
          {visiaCards.map((v, idx) => (
            <div className="visia-card" key={idx}>
              <div className="visia-card-header">
                <span className="visia-card-icon" aria-hidden="true">{v.icon}</span>
                <span className="visia-badge-status">{v.status}</span>
                <span className="visia-improvement">{v.improvement}</span>
              </div>
              <h4 className="visia-card-title">{v.label}</h4>
              <p className="visia-card-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
