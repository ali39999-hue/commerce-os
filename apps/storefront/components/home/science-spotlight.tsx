export function ScienceMechanismSpotlight() {
  const steps = [
    {
      num: '۰۱',
      title: 'واکنش زیستی در سطح اپیدرم',
      desc: 'با ترکیب ژل غنی از بیومواد فعال و پاد ترابافتی CarboxyPod، میلیون‌ها میکروحباب CO2 پایدار در سطح پوست آزاد می‌شوند.',
    },
    {
      num: '۰۲',
      title: 'تحریک اثر بوهر (Bohr Effect)',
      desc: 'افزایش غلظت موضعی دی‌اکسید کربن سبب تغییر pH در عروق مویرگی شده و هموگلوبین را وادار به آزادسازی اکسیژن خالص (O2) در سلول‌ها می‌کند.',
    },
    {
      num: '۰۳',
      title: 'تکثیر فیبروبلاست و سنتز کلاژن',
      desc: 'سیلاب اکسیژن درون‌سلولی، متابولیسم و چرخه تنفس میتوکندری را سرعت بخشیده و روند بازسازی الاستین و کلاژن نوع I و III را آغاز می‌نماید.',
    },
    {
      num: '۰۴',
      title: 'نفوذپذیری فعال پپتیدها',
      desc: 'سد پوستی به مدت ۴۸ ساعت نفوذپذیری بهینه پیدا کرده و مولکول‌های درمانی ویتامینه و پپتیدی عمیقاً به لایه‌های زنده درم منتقل می‌شوند.',
    },
  ];

  return (
    <section id="science" className="science-spotlight-section" aria-labelledby="science-title">
      <div className="science-layout-grid">
        <div className="science-text-side">
          <div className="section-eyebrow light">بیوشیمی سلولی و فیزیولوژی پوست</div>
          <h2 id="science-title" className="science-main-heading">
            اثر بوهر چگونه بدون سوزن، سلول‌ها را اکسیژن‌باران می‌کند؟
          </h2>
          <p className="science-lead">
            پدیده‌ای علمی که در سال ۱۹۰۴ توسط فیزیولوژیست دانمارکی کریستین بوهر کشف شد؛ اکنون با فناوری اختصاصی دکتر درمر،
            به پیشرفته‌ترین روش جوانسازی غیرتهاجمی پوست در کلینیک‌های بریتانیا و اروپا تبدیل شده است.
          </p>

          <div className="science-steps-list">
            {steps.map((st) => (
              <div className="science-step-card" key={st.num}>
                <span className="step-num-badge">{st.num}</span>
                <div className="step-content">
                  <h3 className="step-title">{st.title}</h3>
                  <p className="step-desc">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="science-diagram-side">
          <div className="diagram-card">
            <div className="diagram-header">
              <span className="diagram-badge">MECHANISM OF ACTION</span>
              <h4>چرخه آزادسازی هموگلوبین (Hb-O2 Saturation)</h4>
            </div>

            <div className="diagram-illustration" aria-hidden="true">
              <svg viewBox="0 0 360 280" className="science-svg">
                <defs>
                  <linearGradient id="o2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="co2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#0F766E" />
                  </linearGradient>
                </defs>

                {/* Vessel Graphic */}
                <path d="M 30,140 Q 180,90 330,140" fill="none" stroke="#FDA4AF" strokeWidth="36" strokeLinecap="round" opacity="0.3" />
                <path d="M 30,140 Q 180,90 330,140" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="4 4" opacity="0.8" />

                {/* Hemoglobin Cell */}
                <circle cx="180" cy="115" r="42" fill="#E11D48" opacity="0.85" filter="drop-shadow(0 4px 12px rgba(225,29,72,0.3))" />
                <text x="180" y="118" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Hb (هموگلوبین)</text>

                {/* CO2 Infusion from above */}
                <g transform="translate(180, 40)">
                  <circle cx="-35" cy="0" r="14" fill="url(#co2Grad)" />
                  <text x="-35" y="4" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">CO₂</text>
                  <path d="M -35,16 L -20,60" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeDasharray="3 3" />

                  <circle cx="35" cy="0" r="14" fill="url(#co2Grad)" />
                  <text x="35" y="4" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">CO₂</text>
                  <path d="M 35,16 L 20,60" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeDasharray="3 3" />
                </g>

                {/* O2 Released to Tissues */}
                <g transform="translate(180, 200)">
                  <circle cx="-50" cy="20" r="15" fill="url(#o2Grad)" />
                  <text x="-50" y="24" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">O₂</text>
                  <path d="M -30,-30 L -45,5" fill="none" stroke="#38BDF8" strokeWidth="2" />

                  <circle cx="50" cy="20" r="15" fill="url(#o2Grad)" />
                  <text x="50" y="24" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">O₂</text>
                  <path d="M 30,-30 L 45,5" fill="none" stroke="#38BDF8" strokeWidth="2" />
                </g>

                <text x="180" y="260" fill="#94A3B8" fontSize="10" textAnchor="middle">
                  انتقال اکسیژن به بافت‌های سلولی فیبروبلاست درم
                </text>
              </svg>
            </div>

            <div className="diagram-caption">
              <div className="caption-metric">
                <span className="metric-val">+۳۰۰٪</span>
                <span className="metric-lbl">نفوذ بیواکتیوهای درمانی</span>
              </div>
              <div className="caption-metric">
                <span className="metric-val">۳.۸ pH</span>
                <span className="metric-lbl">تنظیم فیزیولوژیک اسیدیته</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
