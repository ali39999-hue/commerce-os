import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "کیت‌های مصرفی پروتکل و تجهیزات کلینیک | دکتر درمر B2B",
  description:
    "مشخصات فنی و استانداردهای کیت ژل کربوکسی ۱۵۰۰ میلی‌لیتر، کارتریج‌های تک‌دوز Box of 10/20 و کیت‌های بازسازی سد دفاعی پوست.",
};

const PROTOCOL_ITEMS = [
  {
    id: "carboxy-1500",
    title: "ژل حرفه‌ای کربوکسی‌تراپی بدون سوزن ۱۵۰۰ میلی‌لیتر (CarboxyGel Pro 1500ml)",
    sku: "CBX-PRO-1500",
    capacity: "۵۰ سشن درمانی کامل صورت و گردن",
    features: [
      "تولید بیش از ۱۱۰۰ ppm گاز دی‌اکسید کربن فعال به محض تماس با شیت ماسک اختصاصی",
      "دارای بافر تنظیم‌کننده پی‌اچ پوست جهت جلوگیری از تحریک بیش از حد مویرگ‌ها",
      "پمپ وکیوم ایزوله جهت حفظ پایداری ترکیبات فعال و ممانعت از نفوذ هوا",
      "همراه با ۵۰ ست ماسک صورت پنبه‌ای فعال‌ساز فشرده و ۵۰ پچ غبغب",
    ],
    application: "رفع تیرگی و پف دور چشم، بستن منافذ باز، لیفت سریع بافت قبل از میکاپ و تسریع ساخت کلاژن.",
    priceInfo: "نرخ پایه: ۵,۸۰۰,۰۰۰ تومان | نرخ کلینیکال بالای ۲۰ عدد: ۴,۱۰۰,۰۰۰ تومان",
  },
  {
    id: "cartridge-box-20",
    title: "باکس ۲۰ عددی کارتریج‌های سرنگی تک‌نفره ژل کربوکسی (Box of 20)",
    sku: "CBX-BOX-20",
    capacity: "۲۰ سشن تک‌دوز کلینیکال",
    features: [
      "دوزبندی دقیق ۲۵ میلی‌لیتر در هر کارتریج بدون نیاز به وزن‌کشی یا اندازه‌گیری دستی",
      "بهداشت صددرصد تضمین‌شده و عدم امکان آلودگی ثانویه در محیط مطب",
      "مناسب برای کلینیک‌های پرتردد با چند اتاق فیشیال و اپراتورهای مجزا",
      "شامل ۲۰ ست ماسک ارگونومیک صورت و ناحیه گردن",
    ],
    application: "پروتکل‌های روشن‌کننده، درمان اسکار آکنه و آماده‌ساز پوست برای مزوتراپی.",
    priceInfo: "نرخ پایه: ۵,۴۰۰,۰۰۰ تومان | نرخ پکیج همکار: ۳,۸۰۰,۰۰۰ تومان",
  },
  {
    id: "barrier-laser",
    title: "کیت اورژانس ترمیم سد پوستی پست-لیزر و میکرونیدلینگ (Barrier Recovery Kit)",
    sku: "BRK-CLINIC-10",
    capacity: "۱۰ پک درمان خانگی ترخیص بیمار",
    features: [
      "فرمولاسیون کریستال مایع لاملار حاوی نسبت طلایی ۳:۱:۱ سرامیدها، کلسترول و اسیدهای چرب",
      "غنی‌شده با مادکاسوساید ۹۵٪ جهت کاهش سریع التهاب و فلاشینگ عروقی",
      "فاقد الکل، عطر، اسانس و پارابن با تاییدیه تست درماتولوژیک بر روی پوست‌های حساس",
      "بسته‌بندی تیوب استریل ۵۰ میلی‌لیتری جهت تحویل به بیمار پس از پروسیجر",
    ],
    application: "استفاده بلافاصله پس از لیزر CO₂ فرکشنال، میکرونیدلینگ، سابسیژن و پیلینگ شیمیایی.",
    priceInfo: "نرخ پایه: ۳,۶۰۰,۰۰۰ تومان | نرخ کلینیکال بالای ۱۰ عدد: ۲,۶۰۰,۰۰۰ تومان",
  },
];

export default function ProtocolsSubPage() {
  return (
    <div style={{ padding: "40px 0 90px" }}>
      <nav className="breadcrumbs-nav" style={{ marginBottom: "24px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/b2b">پورتال B2B کلینیک‌ها</Link>
        <span>/</span>
        <span>کیت‌های مصرفی و پروتکل‌های کابین</span>
      </nav>

      <header className="blog-header" style={{ marginBottom: "32px" }}>
        <div className="eyebrow">Professional Clinic Consumables</div>
        <h1 style={{ margin: "6px 0 10px" }}>کیت‌های مصرفی، کارتریج‌های درمانی و تجهیزات کابین</h1>
        <p style={{ maxWidth: "720px", color: "var(--muted)", lineHeight: "1.8" }}>
          محصولات تخصصی ارائه‌شده منحصراً برای استفاده در محیط‌های کلینیکی و تحت نظارت پزشک متخصص پوست، جراح پلاستیک یا
          بیوتی‌تراپیست مجاز فرموله شده‌اند.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "40px" }}>
        {PROTOCOL_ITEMS.map((item) => (
          <article
            key={item.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "12px",
                borderBottom: "1px solid var(--line)",
                paddingBottom: "16px",
                marginBottom: "18px",
              }}
            >
              <div>
                <span
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand-deep)",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "6px",
                  }}
                >
                  SKU: {item.sku}
                </span>
                <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--brand-deep)" }}>{item.title}</h2>
              </div>
              <div
                style={{
                  background: "var(--paper)",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--line)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                ظرفیت: {item.capacity}
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <h3 style={{ fontSize: "0.95rem", color: "var(--brand-deep)", margin: "0 0 10px" }}>
                مشخصات فنی و استاندارد فارماسیوتیکال:
              </h3>
              <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {item.features.map((feat, idx) => (
                  <li key={idx} style={{ fontSize: "0.86rem", color: "var(--muted)", lineHeight: "1.8" }}>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: "var(--paper)", padding: "14px 18px", borderRadius: "12px", marginBottom: "20px" }}>
              <strong style={{ fontSize: "0.86rem", color: "var(--ink)", display: "block", marginBottom: "4px" }}>
                اندیکاسیون‌های بالینی:
              </strong>
              <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--muted)", lineHeight: "1.7" }}>
                {item.application}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
                borderTop: "1px dashed var(--line)",
                paddingTop: "16px",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "#047857", fontWeight: 700 }}>
                💰 {item.priceInfo}
              </div>
              <Link
                href="/b2b#quote-form"
                style={{
                  background: "var(--accent)",
                  color: "#18221d",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                درخواست پیش‌فاکتور رسمی این کیت ←
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
