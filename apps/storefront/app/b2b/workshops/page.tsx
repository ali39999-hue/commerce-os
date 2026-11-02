import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقویم مسترکلاس‌ها و ورکشاپ‌های دارای سرتیفیکیت بالینی | دکتر درمر انگلستان",
  description:
    "کارگاه‌های عملی و هندزآن کربوکسی‌تراپی بدون سوزن، پیلینگ شیمیایی درموسوتیکال، و مدالیته‌های انرژی پلاسما با اعطای گواهی‌نامه رسمی آکادمی پوست و زیبایی.",
};

const WORKSHOPS_DATA = [
  {
    id: "ws-bohr-carboxy",
    title: "مسترکلاس جامع کربوکسی‌تراپی بدون سوزن و فیزیولوژی پدیده بوهر (Bohr Effect Masterclass)",
    dateFa: "پنجشنبه ۲۱ آبان ۱۴۰۵ - ساعت ۹:۰۰ الی ۱۶:۰۰",
    instructor: "دکتر مریم سهرابی (متخصص پوست و مو) و مهندس کیانوش راد",
    targetLevel: "پزشکان متخصص پوست، پزشکان عمومی و بیوتی‌تراپیست‌های ارشد",
    prerequisites: "آشنایی با آناتومی سطحی عروق سر و گردن و اصول فیزیولوژی تبادل گازها",
    capacity: "ظرفیت محدود: ۱۸ نفر (جهت کار عملی هندزآن بر روی کیس بالینی)",
    location: "مرکز همایش‌ها و سالن کارگاه‌های بالینی آکادمی علوم پوست دکتر درمر - تهران",
    topics: [
      "مبانی بیوفیزیک انتشار گاز دی‌اکسید کربن و شیفت منحنی هموگلوبین به راست (Bohr Effect)",
      "پروتکل‌بندی اختصاصی برای پف و تیرگی مقاوم دور چشم و تیرگی‌های موضعی بدن",
      "آماده‌سازی پوست قبل از تزریق مزوتراپی، فیلر و پی‌آرپی جهت ارتقای ضریب جذب سلولی",
      "کارگاه عملی کامل روی دو کیس بالینی با ژل‌های حرفه‌ای ۱۵۰۰ میلی‌لیتر و کارتریج‌های تک‌دوز",
      "مدیریت اریتما، تنظیم دمای بافت و کنترل حساسیت در بیماران با پوست‌های فوق‌العاده حساس",
    ],
    certification: "اعطای گواهینامه معتبر رسمی آکادمی دکتر درمر انگلستان با کد رجیستری بین‌المللی و هولوگرام امنیتی.",
    handouts: "همراه با پکیج آموزشی شامل پروتکل‌بوک مکتوب، ویدیوی باکیفیت 4K پروسیجر و پوستر آناتومی کابین.",
  },
  {
    id: "ws-advanced-peeling",
    title: "مسترکلاس پیلینگ شیمیایی پیشرفته، اسیدهای ترکیبی و ترمیم سد دفاعی پوست",
    dateFa: "جمعه ۲۲ آبان ۱۴۰۵ - ساعت ۹:۰۰ الی ۱۵:۰۰",
    instructor: "مهندس کیانوش راد (شیمیست ارشد فرمولاتور IFSCC) و دکتر مریم سهرابی",
    targetLevel: "پزشکان، داروسازان و اسکین‌کر تراپیست‌های دارای گواهی پایه",
    prerequisites: "تسلط بر رده‌بندی فوتوتایپ فیتزپاتریک و مبانی پیلینگ‌های سطحی",
    capacity: "ظرفیت: ۲۰ نفر",
    location: "کلینیک آموزش عملی و سالن سمینارهای آکادمی پوست",
    topics: [
      "مقایسه سینتیک نفوذ اسیدهای AHA، BHA، PHA و کاربرد موضعی ترانگزامیک اسید در درمان ملاسما",
      "معیارهای تشخیص عمق نفوذ، زمان‌بندی خنثی‌سازی و پدیده فراستینگ ایمن (Safety Frosting)",
      "پروتکل اورژانس بازسازی سد دفاعی لاملار با نسبت طلایی ۳:۱:۱ سرامیدها و مس‌پپتید GHK-Cu",
      "مدیریت و پیشگیری از عوارض سوختگی ناخواسته و هایپرپیگمانتاسیون پس‌التهابی (PIH)",
      "کار عملی با لایه‌بردارهای تخصصی و خنثی‌سازهای بافر فیزیولوژیک بر روی کیس‌های واقعی",
    ],
    certification: "اعطای سرتیفیکیت تخصصی کار با پیلینگ‌های درموسوتیکال و مدیریت سد دفاعی اپیدرم.",
    handouts: "کیت سمپل اسیدهای آکادمی به همراه فرم‌های رضایت‌نامه بیمار و راهنمای مراقبت خانگی.",
  },
  {
    id: "ws-plasma-modalities",
    title: "کارگاه پیشرفته مولتی‌مدالیته‌های پلاسما: سابلیمیشن جراحی، جت سرد و DBD",
    dateFa: "پنجشنبه ۲۸ آبان ۱۴۰۵ - ساعت ۹:۰۰ الی ۱۶:۰۰",
    instructor: "دکتر مریم سهرابی و تیم بالینی مهندسی پزشکی ReeMed",
    targetLevel: "منحصراً ویژه پزشکان متخصص پوست، جراحان عمومی و پلاستیک",
    prerequisites: "پروانه مطب یا شماره نظام پزشکی معتبر",
    capacity: "ظرفیت محدود: ۱۲ نفر (کار مستقیم با دستگاه‌های ایستگاه بالینی PlasmaX)",
    location: "واحد جراحی سرپایی و آموزش بالینی تجهیزات مدیکال ReeMed",
    topics: [
      "فیزیک حالت چهارم ماده، تفکیک پلاسمای حرارتی سابلیمیشن از پلاسمای غیرحرارتی جت سرد",
      "بلفاروپلاستی غیرجراحی پلک با پروب میکروتنگستن و جلوگیری از اسکار یا فرورفتگی بافتی",
      "استریلیزاسیون عمیق آکنه فعال و درمان زخم‌های مزمن با گازهای نجیب آرگون و هلیوم (<38°C)",
      "تکنیک‌های الکتروپوریشن گذرا و مزوپلاسمای ترنس‌درمال با پروب سرامیکی DBD",
      "تنظیم ایمن ولتاژ تخلیه (۲.۵ تا ۱۲ کیلوولت) بر مبنای ضخامت اپیدرم در نواحی مختلف آناتومیک",
    ],
    certification: "اعطای گواهینامه معتبر اپراتوری جراحی پلاسما و مجوز رسمی کار با سامانه PlasmaX.",
    handouts: "دفترچه راهنمای کالیبراسیون، هندبوک پروتکل‌های بالینی پلاسما و سرنگ‌های استریل مزوپلاسما.",
  },
];

export default function WorkshopsSubPage() {
  return (
    <div style={{ padding: "40px 0 90px" }}>
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "24px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/b2b">پورتال B2B کلینیک‌ها</Link>
        <span>/</span>
        <span>تقویم دوره‌های آموزشی و ورکشاپ‌ها</span>
      </nav>

      {/* ── Page Header ── */}
      <header className="blog-header" style={{ marginBottom: "36px" }}>
        <div className="eyebrow">Accredited Clinical Masterclasses</div>
        <h1 style={{ margin: "6px 0 10px" }}>ورکشاپ‌های عملی، هندزآن و مسترکلاس‌های دارای سرتیفیکیت معتبر</h1>
        <p style={{ maxWidth: "760px", color: "var(--muted)", lineHeight: "1.9" }}>
          دوره‌های معتبر آموزشی با تدریس اعضای هیئت علمی پوست و فرمولاتورهای ارشد آرایشی، شامل آموزش مبانی تئوری،
          کار عملی بر روی کیس زنده در اتاق پروسیجر کلینیک و اعطای گواهینامه رسمی با کد استعلام آنلاین.
        </p>
      </header>

      {/* ── Workshops Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "50px" }}>
        {WORKSHOPS_DATA.map((ws) => (
          <article
            key={ws.id}
            id={ws.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "var(--shadow-card)",
              borderTop: "5px solid var(--brand)",
            }}
          >
            {/* Header / Badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "16px",
                borderBottom: "1px solid var(--line)",
                paddingBottom: "18px",
              }}
            >
              <div>
                <span
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand-deep)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    padding: "4px 14px",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  📅 {ws.dateFa}
                </span>
                <h2 style={{ margin: 0, fontSize: "1.35rem", color: "var(--brand-deep)", lineHeight: "1.4" }}>
                  {ws.title}
                </h2>
              </div>
              <div
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                }}
              >
                {ws.capacity}
              </div>
            </div>

            {/* Meta Row: Instructor, Level, Location */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
                background: "var(--paper)",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "0.84rem",
              }}
            >
              <div>
                <strong style={{ color: "var(--brand-deep)", display: "block", marginBottom: "2px" }}>
                  👨‍⚕️ اساتید و مدرسان دوره:
                </strong>
                <span style={{ color: "var(--ink)" }}>{ws.instructor}</span>
              </div>
              <div>
                <strong style={{ color: "var(--brand-deep)", display: "block", marginBottom: "2px" }}>
                  🎓 سطح مخاطب و پیشنیاز:
                </strong>
                <span style={{ color: "var(--ink)" }}>{ws.targetLevel}</span>
                <small style={{ display: "block", color: "var(--muted)", marginTop: "2px" }}>{ws.prerequisites}</small>
              </div>
              <div>
                <strong style={{ color: "var(--brand-deep)", display: "block", marginBottom: "2px" }}>
                  📍 محل برگزاری:
                </strong>
                <span style={{ color: "var(--ink)" }}>{ws.location}</span>
              </div>
            </div>

            {/* Syllabus */}
            <div style={{ marginBottom: "22px" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--brand-deep)", margin: "0 0 10px" }}>
                سرفصل‌های آموزشی و تمرین‌های هندزآن:
              </h3>
              <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {ws.topics.map((t, idx) => (
                  <li key={idx} style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.8" }}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificate and Handouts */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "14px",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  padding: "14px 18px",
                  borderRadius: "12px",
                }}
              >
                <strong style={{ fontSize: "0.86rem", color: "#065f46", display: "block", marginBottom: "4px" }}>
                  📜 وضعیت گواهینامه اعطایی:
                </strong>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#047857", lineHeight: "1.7" }}>
                  {ws.certification}
                </p>
              </div>

              <div
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  padding: "14px 18px",
                  borderRadius: "12px",
                }}
              >
                <strong style={{ fontSize: "0.86rem", color: "var(--brand-deep)", display: "block", marginBottom: "4px" }}>
                  📦 پکیج آموزشی و مدارک همراه:
                </strong>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7" }}>
                  {ws.handouts}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
                borderTop: "1px dashed var(--line)",
                paddingTop: "18px",
              }}
            >
              <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                جهت ثبت‌نام، شماره پروانه مطب یا کارت نظام پزشکی مورد نیاز است.
              </span>
              <Link
                href="/b2b#wizard-section"
                style={{
                  background: "var(--accent)",
                  color: "#18221d",
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                رزرو سهمیه ورکشاپ در فرم مرحله‌ای B2B ←
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
