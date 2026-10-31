export function ScienceMechanismSpotlight() {
  const steps = [
    {
      num: '۰۱',
      title: 'واکنش شیمیایی زیستی در سطح اپیدرم',
      desc: 'ترکیب ژل غنی از بیومواد فعال و پاد ترابافتی CarboxyPod، میلیون‌ها میکروحباب CO2 پایدار با فشار اسمزی بهینه را روی پوست رهاسازی می‌کند.',
      phase: 'Epidermal Infusion',
    },
    {
      num: '۰۲',
      title: 'تحریک اثر بوهر (Bohr Effect)',
      desc: 'نفوذ دی‌اکسید کربن به عروق مویرگی باعث افت موضعی pH خون می‌شود؛ این تغییر بیوشیمیایی، هموگلوبین را وادار به رهاسازی اکسیژن متصل (O2) در سلول‌ها می‌کند.',
      phase: 'Hemoglobin Dissociation',
    },
    {
      num: '۰۳',
      title: 'تکثیر فیبروبلاست و سنتز کلاژن I و III',
      desc: 'سیلاب اکسیژن بافتی، تنفس سلولی میتوکندری را چند برابر ساخته و فرآیند نئواسکولاریزاسیون (رگ‌زایی نو) و تولید شبکه ماتریکس برون‌سلولی را به راه می‌اندازد.',
      phase: 'Cellular Neovascularization',
    },
    {
      num: '۰۴',
      title: 'افزایش نفوذپذیری فعال پپتیدها',
      desc: 'سد شاخی پوست تا ۴۸ ساعت در بالاترین سطح جذب قرار می‌گیرد و مولکول‌های درمانی پپتیدی و EGF به طور مستقیم به درم زنده منتقل می‌شوند.',
      phase: 'Transdermal Permeability',
    },
  ];

  return (
    <section id="science" className="science-spotlight-section" aria-labelledby="science-title">
      <div className="science-layout-grid">
        {/* Left Side: Editorial & 4-Step Mechanism Cards */}
        <div className="science-text-side">
          <div className="section-eyebrow light">بیوشیمی سلولی و فیزیولوژی پوست</div>
          <h2 id="science-title" className="science-main-heading">
            اثر بوهر چگونه بدون سوزن، سلول‌ها را اکسیژن‌باران می‌کند؟
          </h2>
          <p className="science-lead">
            پدیده‌ای بیوشیمیایی که در سال ۱۹۰۴ توسط فیزیولوژیست نامدار دانمارکی، کریستین بوهر کشف شد؛ اکنون با فناوری انحصاری دکتر درمر، به پیشرفته‌ترین روش جوانسازی و ترمیم غیرتهاجمی پوست در کلینیک‌های پوست اروپا تبدیل شده است.
          </p>

          <div className="science-steps-list">
            {steps.map((st) => (
              <div className="science-step-card" key={st.num}>
                <div className="step-num-wrap">
                  <span className="step-num-badge">{st.num}</span>
                  <span className="step-phase-tag">{st.phase}</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{st.title}</h3>
                  <p className="step-desc">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Biological Mechanism Diagram */}
        <div className="science-diagram-side">
          <div className="diagram-card">
            <div className="diagram-header">
              <div className="dh-title-group">
                <span className="diagram-badge">MECHANISM OF ACTION</span>
                <span className="diagram-sub">چرخه اشباع هموگلوبین (Hb-O₂ Saturation)</span>
              </div>
              <span className="diagram-standard">CLINICAL IN VIVO MODEL</span>
            </div>

            <div className="diagram-illustration" aria-hidden="true">
              <svg viewBox="0 0 380 300" className="science-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="o2GradSci" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="co2GradSci" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#0F766E" />
                  </linearGradient>
                  <radialGradient id="rbcGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </radialGradient>
                </defs>

                {/* Capillary Blood Vessel Arch */}
                <path d="M 25,150 Q 190,95 355,150" fill="none" stroke="#FDA4AF" strokeWidth="44" strokeLinecap="round" opacity="0.25" />
                <path d="M 25,150 Q 190,95 355,150" fill="none" stroke="#F43F5E" strokeWidth="3" strokeDasharray="5 5" opacity="0.7" />

                {/* Hemoglobin Erythrocyte Cell */}
                <circle cx="190" cy="120" r="46" fill="url(#rbcGlow)" filter="drop-shadow(0 6px 16px rgba(225,29,72,0.4))" />
                <circle cx="190" cy="120" r="28" fill="#BE123C" opacity="0.6" />
                <text x="190" y="120" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">Hb</text>
                <text x="190" y="134" fill="#FFE4E6" fontSize="8" fontWeight="700" textAnchor="middle">هموگلوبین خون</text>

                {/* CO2 Infusion from Surface */}
                <g transform="translate(190, 35)">
                  <circle cx="-45" cy="5" r="15" fill="url(#co2GradSci)" filter="drop-shadow(0 2px 6px rgba(45,212,191,0.4))" />
                  <text x="-45" y="9" fill="#FFFFFF" fontSize="9.5" fontWeight="900" textAnchor="middle">CO₂</text>
                  <path d="M -45,22 L -25,65" fill="none" stroke="#2DD4BF" strokeWidth="2.2" strokeDasharray="3 3" />

                  <circle cx="45" cy="5" r="15" fill="url(#co2GradSci)" filter="drop-shadow(0 2px 6px rgba(45,212,191,0.4))" />
                  <text x="45" y="9" fill="#FFFFFF" fontSize="9.5" fontWeight="900" textAnchor="middle">CO₂</text>
                  <path d="M 45,22 L 25,65" fill="none" stroke="#2DD4BF" strokeWidth="2.2" strokeDasharray="3 3" />
                </g>

                {/* O2 Released to Deep Tissues */}
                <g transform="translate(190, 205)">
                  <circle cx="-60" cy="20" r="17" fill="url(#o2GradSci)" filter="drop-shadow(0 4px 10px rgba(56,189,248,0.5))" />
                  <text x="-60" y="24" fill="#FFFFFF" fontSize="10.5" fontWeight="900" textAnchor="middle">O₂</text>
                  <path d="M -30,-25 L -52,3" fill="none" stroke="#38BDF8" strokeWidth="2.5" />

                  <circle cx="60" cy="20" r="17" fill="url(#o2GradSci)" filter="drop-shadow(0 4px 10px rgba(56,189,248,0.5))" />
                  <text x="60" y="24" fill="#FFFFFF" fontSize="10.5" fontWeight="900" textAnchor="middle">O₂</text>
                  <path d="M 30,-25 L 52,3" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                </g>

                <text x="190" y="275" fill="#94A3B8" fontSize="10.5" fontWeight="600" textAnchor="middle">
                  آزادسازی اکسیژن فعال به سلول‌های فیبروبلاست درم عمقی
                </text>
              </svg>
            </div>

            <div className="diagram-caption">
              <div className="caption-metric">
                <span className="metric-val">+۳۰۰٪</span>
                <span className="metric-lbl">نفوذپذیری بیواکتیوها و فاکتورهای رشد</span>
              </div>
              <div className="caption-divider" aria-hidden="true"></div>
              <div className="caption-metric">
                <span className="metric-val">۳.۸ pH</span>
                <span className="metric-lbl">تنظیم فیزیولوژیک شیب اسیدیته پوست</span>
              </div>
              <div className="caption-divider" aria-hidden="true"></div>
              <div className="caption-metric">
                <span className="metric-val">۷۲ ساعت</span>
                <span className="metric-lbl">پایداری سنتز ماتریکس کلاژن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
