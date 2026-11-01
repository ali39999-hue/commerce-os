import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقویم ورکشاپ‌های تخصصی و گواهینامه‌های بالینی | دکتر درمر انگلستان",
  description:
    "دوره‌های آموزشی هندزآن کربوکسی‌تراپی بدون سوزن، پیلینگ شیمیایی و ترمیم سد پوستی با اعطای سرتیفیکیت معتبر آکادمی پوست و زیبایی.",
};

const WORKSHOPS_DATA = [
  {
    id: "ws-bohr-carboxy",
    title: "مسترکلاس جامع کربوکسی‌تراپی بدون سوزن بر پایه پدیده بوهر (Bohr Effect Masterclass)",
    dateFa: "پنجشنبه ۲۱ آبان ۱۴۰۵ - ساعت ۹:۰۰ الی ۱۶:۰۰",
    instructor: "دکتر مریم سهرابی (متخصص پوست و مو) و تیم کلینیکال",
    capacity: "ظرفیت محدود: ۱۸ نفر (جهت کار عملی هندزآن بر روی کیس بالینی)",
    topics: [
      "مبانی فیزیولوژی تبادل گاز CO₂ و مکانیسم‌های عروقی پدیده بوهر",
      "پروتکل‌بندی اختصاصی برای پف و تیرگی مقاوم دور چشم و تیرگی‌های بادی",
      "پروتکل‌های آماده‌ساز قبل از تزریق مزوتراپی و پی‌آرپی جهت افزایش جذب سلولی",
      "تمرین عملی کامل روی دو کیس بالینی با ژل‌های حرفه‌ای ۱۵۰۰ میلی‌لیتر و کارتریج‌ها",
      "مدیریت اریتما و تنظیم آستانه تحمل در پوست‌های حساس و آتوپیک",
    ],
    certification: "اعطای گواهینامه رسمی بین‌المللی ممهور به مهر آکادمی تخصصی پوست و سرتیفیکیت اپراتوری مجاز.",
  },
  {
    id: "ws-advanced-peeling",
    title: "ورکشاپ تخصصی پیلینگ شیمیایی و فرمولاسیون‌های ترمیم سد دفاعی پوست",
    dateFa: "جمعه ۲۲ آبان ۱۴۰۵ - ساعت ۹:۰۰ الی ۱۵:۰۰",
    instructor: "مهندس کیانوش راد (شیمیست فرمولاتور آرایشی) و دکتر مریم سهرابی",
    capacity: "ظرفیت: ۲۰ نفر",
    topics: [
      "بررسی اسیدهای AHA، BHA، PHA و ترکیب ترانگزامیک اسید در درمان ملاسما",
      "معیارهای تعیین عمق نفوذ و پدیده فراستینگ (Frosting) ایمن",
      "پروتکل بازسازی فوری سد دفاعی پوست با نسبت طلایی ۳:۱:۱ سرامیدها و مس‌پپتید",
      "کار عملی با لایه‌بردارهای تخصصی و خنثی‌سازهای فیزیولوژیک",
    ],
    certification: "اعطای سرتیفیکیت کارگاه پیشرفته پیلینگ درموسوتیکال.",
  },
];

export default function WorkshopsSubPage() {
  return (
    <div style={{ padding: "40px 0 90px" }}>
      <nav className="breadcrumbs-nav" style={{ marginBottom: "24px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/b2b">پورتال B2B کلینیک‌ها</Link>
        <span>/</span>
        <span>تقویم دوره‌های آموزشی و ورکشاپ‌ها</span>
      </nav>

      <header className="blog-header" style={{ marginBottom: "32px" }}>
        <div className="eyebrow">Accredited Clinical Training</div>
        <h1 style={{ margin: "6px 0 10px" }}>کارگاه‌های عملی و مسترکلاس‌های دارای سرتیفیکیت معتبر</h1>
        <p style={{ maxWidth: "720px", color: "var(--muted)", lineHeight: "1.8" }}>
          ارتقای مهارت‌های کلینیکی پزشکان و بیوتی‌تراپیست‌ها با جدیدترین متدهای ترنس‌درمال و استانداردهای نوین
          درماتولوژی همراه با تمرین عملی بر روی کیس زنده و پشتیبانی علمی پیوسته.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "40px" }}>
        {WORKSHOPS_DATA.map((ws) => (
          <article
            key={ws.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "var(--shadow-card)",
              borderTop: "4px solid var(--brand)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
              <div>
                <span
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand-deep)",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    padding: "3px 12px",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  📅 {ws.dateFa}
                </span>
                <h2 style={{ margin: 0, fontSize: "1.35rem", color: "var(--ink)", lineHeight: "1.5" }}>{ws.title}</h2>
              </div>
              <div
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {ws.capacity}
              </div>
            </div>

            <div style={{ fontSize: "0.88rem", color: "var(--brand-deep)", fontWeight: 700, marginBottom: "16px" }}>
              👨‍⚕️ مدرسان دوره: {ws.instructor}
            </div>

            <div style={{ marginBottom: "18px" }}>
              <h3 style={{ fontSize: "0.95rem", color: "var(--ink)", margin: "0 0 10px" }}>
                سرفصل‌های آموزشی و مباحث دوره:
              </h3>
              <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {ws.topics.map((top, idx) => (
                  <li key={idx} style={{ fontSize: "0.86rem", color: "var(--muted)", lineHeight: "1.8" }}>
                    {top}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "14px 18px", borderRadius: "12px", marginBottom: "20px" }}>
              <strong style={{ fontSize: "0.86rem", color: "#065f46", display: "block", marginBottom: "4px" }}>
                📜 وضعیت مدرک و گواهینامه اعطایی:
              </strong>
              <p style={{ margin: 0, fontSize: "0.84rem", color: "#047857", lineHeight: "1.7" }}>
                {ws.certification}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                href="/b2b#quote-form"
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
                رزرو سهمیه ورکشاپ در پورتال B2B ←
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
