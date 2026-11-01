import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره ما | دکتر درمر | Dr. Dermer UK Clinical Laboratories',
  description:
    'آشنایی با لابراتوارهای تخصصی دکتر درمر (Dr. Dermer UK)؛ پیشگام در سیستم‌های کربوکسی‌تراپی غیرتهاجمی ترنس‌درمال بر پایه اثر بوهر (Bohr Effect)، پپتیدهای بیومیمتیک و نوآوری‌های پزشکی ReeSkin و ReeMed.',
};

const VALUES = [
  {
    emoji: '🧬',
    title: 'کربوکسی‌تراپی ترنس‌درمال با CarboxyGel و CarboxyPod',
    text: 'پیشگام تکنولوژی تولید گاز دی‌اکسید کربن نفوذی (Transdermal CO₂) با فعال‌سازی اثر بوهر (Bohr Effect)؛ اکسیژن‌رسانی عمقی بافتی و اتساع مویرگی بدون تروما و بدون نیدلینگ.',
  },
  {
    emoji: '🔬',
    title: 'پپتیدهای بیومیمتیک و ماتریکس سلولی',
    text: 'توسعه فرمولاسیون‌های انحصاری غنی‌شده با پپتیدهای سیگنال‌دهنده، مس‌پپتید خالص (GHK-Cu) و پالمیتوئیل تری‌پپتیدها جهت نوسازی کلاژن و ماتریکس خارج‌سلولی.',
  },
  {
    emoji: '🛡️',
    title: 'نوآوری‌های بالینی ReeSkin و ReeMed',
    text: 'توسعه راهکارهای تخصصی ترمیم سد دفاعی پوست با ساختار لیپیدی لاملار ۳:۱:۱، مدیریت ریکاوری پس از پروسیجر و منطبق بر استانداردهای آزمایشگاهی بریتانیا.',
  },
] as const;

const STATS = [
  { number: 'CE Medical', label: 'انطباق با استانداردهای تجهیزات پزشکی اروپا' },
  { number: '+۱۵۰', label: 'کلینیک و مرکز پوست همکار' },
  { number: '٪۱۰۰', label: 'پایش زنجیره سرد و اصالت TTAC' },
  { number: 'Bohr Effect', label: 'مکانیزم اثبات‌شده آزادسازی O2 بافتی' },
] as const;

export default function AboutPage() {
  return (
    <section className="static-layout">
      <header className="static-header">
        <div className="eyebrow">دکتر درمر | Dr. Dermer UK Clinical Laboratories</div>
        <h1>نوآوری علمی و درماتولوژی بالینی</h1>
        <p>
          لابراتوارهای تخصصی دکتر درمر (Dr. Dermer UK Clinical Laboratories) مرجع نوآوری و توسعه فرآورده‌های درموسوتیکال،
          سیستم‌های کربوکسی‌تراپی غیرتهاجمی ترنس‌درمال و فرمولاسیون‌های بالینی بازسازی پوست است.
        </p>
      </header>

      <article className="static-card">
        <h2>داستان پژوهش و نوآوری در پارک علم و فناوری کمبریج</h2>
        <p>
          پژوهش‌های بنیادین لابراتوارهای دکتر درمر (Dr. Dermer UK Clinical Laboratories) بر پایه همگرایی علوم زیست‌پزشکی، بیوتکنولوژی پپتیدها و فیزیولوژی عروقی پوست در پارک علم و فناوری کمبریج انگلستان (Cambridge Science Park, UK) پایه‌گذاری شد.
          رسالت اصلی تیم پژوهشگران بالینی ما، جایگزینی روش‌های دردناک، تهاجمی و نیازمند دوره نقاهت با تکنولوژی‌های غیرتهاجمی، ایمن و مبتنی بر شواهد پزشکی دقیق بوده است.
        </p>
        <p>
          هسته اصلی این دگرگونی، توسعه سامانه پیشرفته <strong>کربوکسی‌تراپی ترنس‌درمال (Transdermal CO₂)</strong> و بهره‌گیری از اصل فیزیولوژیک <strong>اثر بوهر (Bohr Effect)</strong> بدون نیاز به هرگونه نیدلینگ است.
          در این فناوری، با قرارگیری ژل تخصصی <strong>CarboxyGel</strong> و واکنش کاتالیزوری هدایت‌شده با پدهای اختصاصی <strong>CarboxyPod</strong>، جریانی متراکم و پایدار از مولکول‌های دی‌اکسید کربن نفوذی در سطح پوست پدید می‌آید.
          افت موضعی و کنترل‌شده pH بافتی ناشی از نفوذ CO₂، آزادسازی فوری و پرفشار اکسیژن (O₂) از هموگلوبین مویرگی به سلول‌های هایپوکسیک را تحریک کرده و موجب تحریک فیبروبلاست‌ها، نئوواسکولاریزاسیون و ترمیم بافت آسیب‌دیده می‌گردد.
        </p>
        <p>
          در تکمیل این چرخه درمانی، خطوط تخصصی <strong>ReeSkin</strong> و <strong>ReeMed</strong> با تلفیق کمپلکس‌های پپتیدی بیومیمتیک، مس‌پپتید خالص (GHK-Cu) و ماتریس لاملار لیپیدی ۳:۱:۱ مهندسی شده‌اند تا پس از پروسیجرهای فرکشنال، لیزر و درماتیت‌های ناشی از نقض سد اپیدرمال، سرعت و کیفیت اپیتلیزاسیون را به حداکثر برسانند.
        </p>
        <div style={{ marginTop: "24px", padding: "18px 20px", background: "var(--paper)", borderRadius: "14px", border: "1px solid var(--line)" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "1.05rem", color: "var(--brand-deep)" }}>
            مراکز اصلی و دفاتر بین‌المللی Dr. Dermer UK Clinical Laboratories
          </h3>
          <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.88rem", color: "var(--muted)", lineHeight: "1.8" }}>
            <li>
              <strong>مرکز پژوهش و فرمولاسیون انگلستان:</strong> Cambridge Science Park, Milton Rd, Cambridge CB4 0GF, United Kingdom (طراحی متدولوژی‌های بوهر، پپتیدها و کنترل کیفیت فارماکوپه)
            </li>
            <li>
              <strong>دفتر مرکزی و مدیریت لجستیک خاورمیانه:</strong> Dumankaya Ikon Towers, Floor 34, No: 370, Atasehir, Istanbul, Turkey (پایش زنجیره تأمین منطقه‌ای، گمرک دارویی و هماهنگی توزیع اکسپرس)
            </li>
          </ul>
        </div>
      </article>

      <div className="values-grid">
        {VALUES.map((value) => (
          <div className="value-card" key={value.title}>
            <span className="value-emoji" aria-hidden="true">{value.emoji}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </div>
        ))}
      </div>

      <div className="stats-row">
        {STATS.map((stat) => (
          <div className="stat-box" key={stat.label}>
            <span className="stat-number">{stat.number}</span>
            <small>{stat.label}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
