import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پروتکل‌های بالینی و استانداردهای کابین درمان | دکتر درمر B2B",
  description:
    "مستندات گام‌به‌گام پروسیجرهای کلینیکال: کربوکسی‌تراپی غیرتهاجمی و پدیده بوهر، ریکاوری سد دفاعی پس از لیزر، و پروتکل مهار ملانوژنز همراه با فایل‌های دانلودی.",
};

interface ProtocolGuide {
  id: string;
  title: string;
  targetAudience: string;
  indications: string[];
  equipmentAndFormulations: string[];
  duration: string;
  steps: {
    stepNumber: number;
    title: string;
    duration: string;
    description: string;
    clinicalPearl: string;
  }[];
  clinicalWarnings: string[];
  contraindications: string[];
  downloads: {
    title: string;
    format: string;
    size: string;
  }[];
  relatedKitId: string;
  relatedKitName: string;
}

const CLINICAL_PROTOCOLS: ProtocolGuide[] = [
  {
    id: "bohr-carboxy-protocol",
    title: "پروتکل جامع کربوکسی‌تراپی غیرتهاجمی و آزادسازی اکسیژن بافتی (اثر بوهر)",
    targetAudience: "پزشکان متخصص پوست، جراحان پلاستیک، پزشکان عمومی و بیوتی‌تراپیست‌های معتمد",
    duration: "۴۵ دقیقه در هر سشن",
    indications: [
      "تیرگی و پف مقاوم اطراف چشم (Periorbital Hyperpigmentation & Edema)",
      "کاهش الاستیسیته و شلی پوست در ناحیه صورت، گردن و خطوط فک (Jawline)",
      "خطوط بیانی سطحی و استاتیک پیشانی و خط خنده",
      "آماده‌سازی بافت قبل از تزریق مزوتراپی یا پی‌آرپی جهت ارتقای ضریب جذب سلولی",
    ],
    equipmentAndFormulations: [
      "ژل حرفه‌ای کربوکسی‌تراپی ۱۵۰۰ میلی‌لیتر دکتر درمر (CarboxyGel Pro 1500ml)",
      "شیت ماسک‌های فشرده پنبه‌ای اکتیویتور صورت و پچ‌های زاویه فک و غبغب",
      "اسپاچولای سیلیکونی طبی جهت پخش یکنواخت ژل",
      "دستگاه اولتراسونیک پروب یا ارتعاش ترنس‌درمال (اختیاری جهت افزایش راندمان)",
      "امولسیون بازسازی سد دفاعی پوست با سرامید ۳:۱:۱ و مادکاسوساید ۹۵٪",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "پاکسازی ملایم و آماده‌سازی سد شاخی اپیدرم",
        duration: "۵ دقیقه",
        description:
          "شستشوی پوست با فوم پاک‌کننده بدون سولفات با پی‌اچ فیزیولوژیک (۵.۵). خشک‌کردن کامل بافت بدون کشش مکانیکی برای جلوگیری از رقیق‌شدن ژل کربوکسی.",
        clinicalPearl: "وجود هرگونه رطوبت مازاد روی پوست می‌تواند واکنش بیوشیمیایی ژل و ماسک را قبل از نفوذ به لایه‌های زنده درم تضعیف کند.",
      },
      {
        stepNumber: 2,
        title: "اپلیکیشن ژل فعال‌ساز کربوکسی به ضخامت یکنواخت",
        duration: "۴ دقیقه",
        description:
          "با استفاده از اسپاچولای سیلیکونی، یک لایه متراکم به ضخامت تقریبی ۲ میلی‌متر از ژل کربوکسی را به آرامی روی تمام سطح صورت، اطراف چشم و ناحیه ساب‌منتال پخش نمایید.",
        clinicalPearl: "از ورود ژل به داخل چشم ممانعت فرمایید؛ فاصله ۱ سانتی‌متری از لبه پلک تحتانی باید رعایت گردد.",
      },
      {
        stepNumber: 3,
        title: "فیکس‌کردن شیت ماسک اکتیویتور و آغاز واکنش پدیده بوهر",
        duration: "۲ دقیقه",
        description:
          "شیت ماسک اکتیویتور را دقیقاً منطبق با آناتومی صورت روی ژل قرار داده و با کف دستکش به آرامی فشار دهید تا حباب‌های هوا تخلیه شوند. واکنش جوشش گاز CO₂ با خلوص بالا فوراً آغاز می‌شود.",
        clinicalPearl: "آزادسازی گاز CO₂ موضعی شیفت منحنی تفکیک اکسی‌هموگلوبین به راست (اثر بوهر) را فعال و مویرگ‌ها را منبسط می‌سازد.",
      },
      {
        stepNumber: 4,
        title: "تثبیت تماس و تحریک مکانیکی / اولتراسونیک جریان خون",
        duration: "۲۰ دقیقه",
        description:
          "هر ۳ دقیقه یک‌بار با ضربات ملایم نوک انگشتان یا پروب اولتراسونیک فرکانس پایین، سطح ماسک را ماساژ دهید تا گازهای جدید در عمق لایه‌های بافتی آزاد شوند.",
        clinicalPearl: "احساس سوزن‌سوزن شدن و گرمای ملایم نشانه طبیعی اتساع مویرگی و خون‌رسانی عروقی است.",
      },
      {
        stepNumber: 5,
        title: "برداشتن ماسک، پاکسازی بقایا و ترمیم سد اپیدرمی",
        duration: "۱۰ دقیقه",
        description:
          "شیت ماسک را برداشته، بقایای ژل را با اسفنج مرطوب نرمال سالین پاک کنید. بلافاصله لایه مناسبی از کرم سرامید ۳:۱:۱ و ضدآفتاب فیزیکال صددرصد مینرال اعمال گردد.",
        clinicalPearl: "تا ۱۲ ساعت پس از درمان، از مصرف مواد لایه‌بردار شیمیایی و رتینوئیدها در منزل خودداری گردد.",
      },
    ],
    clinicalWarnings: [
      "بروز اریتمای منتشر (قرمزی ملایم پوست) تا حداکثر ۳۰ دقیقه پس از خاتمه پروسیجر طبیعی و نشان‌دهنده اکسیژن‌رسانی شدید مویرگی است.",
      "در صورت احساس سوزش بیش از آستانه تحمل بیمار، ماسک را فوراً برداشته و موضع را با آب سرد بشویید.",
      "از تماس محتویات فعال با غشای مخاطی چشم، بینی و داخل دهان جداً خودداری فرمایید.",
    ],
    contraindications: [
      "اگزمای حاد، درماتیت سبورئیک فعال و روزاسه تهاجمی تیپ ۳ (پاپولوپوسچولار)",
      "زخم‌های باز، بریدگی‌های تازه جراحی یا عفونت‌های هرپسی فعال (تبخال)",
      "بیمارانی که در کمتر از ۶ ماه گذشته درمان با ایزوترتینوئین خوراکی داشته‌اند",
    ],
    downloads: [
      { title: "گایدلاین تفصیلی SOP پروتکل کربوکسی‌تراپی بالینی", format: "PDF", size: "۲.۴ مگابایت" },
      { title: "فرم رضایت‌نامه آگاهانه بیمار (Informed Consent Form)", format: "PDF", size: "۱.۱ مگابایت" },
      { title: "چارت تقویم جلسات درمانی و فواصل پروسیجر", format: "PDF", size: "۸۵۰ کیلوبایت" },
    ],
    relatedKitId: "carboxy-1500",
    relatedKitName: "پک حرفه‌ای ژل کربوکسی ۱۵۰۰ میلی‌لیتر + ۵۰ شیت ماسک",
  },
  {
    id: "post-procedure-barrier-protocol",
    title: "پروتکل بازسازی فوری سد دفاعی و ریکاوری پوست پست-لیزر و میکرونیدلینگ",
    targetAudience: "کلینیک‌های مجهز به لیزر CO₂ فرکشنال، میکرونیدلینگ، سابسیژن و هایفوتراپی",
    duration: "۳۰ دقیقه در مطب + دوره مراقبت خانگی ۴۸ ساعته",
    indications: [
      "التهاب، اریتما و سوزش شدید بلافاصله پس از لیزرهای فرکشنال و ابلیتیو",
      "مهار تبخیر آب ترنس‌اپیدرمال (TEWL) پس از پروسیجرهای نیدلینگ و مزوتراپی",
      "پیشگیری از هیپرپیگمانتاسیون پس از التهاب (Post-Inflammatory Hyperpigmentation - PIH)",
      "ترمیم سریع کراتینوسیت‌ها و اتصال مجدد لایه‌های لاملار اپیدرم",
    ],
    equipmentAndFormulations: [
      "کیت بالینی استریل ریکاوری سد پوستی (Barrier Recovery Clinical Kit)",
      "سرم ماتریکس مس‌پپتید ۱٪ خالص با درجه دارویی (GHK-Cu)",
      "امولسیون کریستال مایع لاملار حاوی نسبت طلایی ۳:۱:۱ سرامیدها، کلسترول و اسیدهای چرب آزاد",
      "ماسک بیوسلولز هیدروژلی استریل پزشکی با خاصیت خنک‌کننده آنی",
      "محلول نرمال سالین ۰.۹٪ سرد جهت شستشوی موضع",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "آرام‌سازی اولیه و استریلیزاسیون موضع تحت درمان",
        duration: "۳ دقیقه",
        description:
          "پاکسازی خونابه‌ها و بقایای بافتی ناشی از لیزر یا نیدلینگ با گاز استریل آغشته به نرمال سالین سرد به صورت ضربه‌ای ملایم بدون ایجاد اصطکاک بر روی پوست.",
        clinicalPearl: "استفاده از آب لوله‌کشی یا شوینده‌های دارای اسانس در این مرحله به دلیل باز بودن کانال‌های پوستی اکیداً ممنوع است.",
      },
      {
        stepNumber: 2,
        title: "اعمال پپتیدهای پیام‌رسان ریمادلینگ و تحریک فیبروبلاست‌ها",
        duration: "۳ دقیقه",
        description:
          "چکاندن قطره‌ای سرم استریل مس‌پپتید GHK-Cu به میزان ۲ میلی‌لیتر روی سطح پوست و اجازه جذب غیرتحریکی با نفوذ مویینگی به کانال‌های بازشده.",
        clinicalPearl: "مس‌پپتید علاوه بر اثر ضدالتهابی قوی، سنتز فیبرونکتین و پروکلاژن تیپ I و III را به میزان چشمگیری تسریع می‌کند.",
      },
      {
        stepNumber: 3,
        title: "تسکین دمایی با ماسک بیوسلولز هیدروژلی استریل",
        duration: "۱۵ دقیقه",
        description:
          "قرار دادن شیت ماسک بیوسلولز از پیش خنک‌شده بر روی پوست جهت کاهش فوری دمای بافت، توقف واکنش ترشح سیتوکین‌های التهابی و مهار حس سوزش بیمار.",
        clinicalPearl: "کاهش دمای بافت در ۱۰ دقیقه اول پس از لیزر، ریسک فلاشینگ عروقی مزمن و لک‌های پس‌التهابی را تا ۶۰٪ کاهش می‌دهد.",
      },
      {
        stepNumber: 4,
        title: "سیل‌کردن سد دفاعی با نسبت فیزیولوژیک لیپیدی ۳:۱:۱",
        duration: "۵ دقیقه",
        description:
          "پوشش کل موضع با لایه ضخیمی از امولسیون کریستال مایع سرامیدی جهت جایگزینی لیپیدهای از دست رفته استراتوم کورنئوم و ایجاد لایه نیمه‌تراوا بدون مسدودسازی منافذ.",
        clinicalPearl: "ساختار لاملار بیومیمتیک، ساختار غشای سلولی انسان را شبیه‌سازی نموده و تبخیر ترنس‌اپیدرمال را کنترل می‌کند.",
      },
      {
        stepNumber: 5,
        title: "آموزش پروتکل ۴۸ ساعته ترخیص و تحویل کیت مراقبت در منزل",
        duration: "۴ دقیقه",
        description:
          "تحویل تیوب استریل امولسیون سد دفاعی به همراه بروشور آموزشی جهت تکرار اپلیکیشن هر ۴ ساعت یک‌بار در ۲ شبانه‌روز اول پس از پروسیجر.",
        clinicalPearl: "بیمار باید تا ۴۸ ساعت از هرگونه کرم پودر، مواد لایه‌بردار و تماس مستقیم با نور خورشید پرهیز نماید.",
      },
    ],
    clinicalWarnings: [
      "عدم استفاده از کورتیکواستروئیدهای موضعی قوی بدون نظر پزشک معالج، چرا که می‌توانند روند ترمیم سلولی را مختل سازند.",
      "در صورت مشاهده علائم عفونت موضعی نظیر ترشحات زرد مایل به سبز، تاول‌های جدید یا درد فزاینده، فوراً به کلینیک اطلاع داده شود.",
    ],
    contraindications: [
      "بیماران مبتلا به نقایص سیستم ایمنی یا پیوندهای فعال پوستی بدون مشورت انکولوژیست",
      "حساسیت مستند به مشتقات پپتیدی مس یا سرامیدهای بیوسنتتیک",
    ],
    downloads: [
      { title: "دستورالعمل جامع ریکاوری سد پوستی و مهار عوارض لیزر", format: "PDF", size: "۳.۱ مگابایت" },
      { title: "راهنمای مصور ترخیص و مراقبت در منزل بیمار (Aftercare Guide)", format: "PDF", size: "۱.۴ مگابایت" },
    ],
    relatedKitId: "barrier-laser-kit",
    relatedKitName: "کیت حرفه‌ای ریکاوری سد دفاعی پس از لیزر (سرامید ۳:۱:۱)",
  },
  {
    id: "melasma-pigment-protocol",
    title: "پروتکل کنترل چندمسیره ملاسما و پیگمانتاسیون مقاوم با ترانگزامیک اسید و رتینوئید بافرشده",
    targetAudience: "پزشکان متخصص پوست و مراکز تخصصی درمان لک و تیرگی",
    duration: "۴۰ دقیقه در هر سشن کلینیکال",
    indications: [
      "ملاسمای مزمن اپیدرمال و درمال مقاوم به درمان‌های سنتی",
      "هایپرپیگمانتاسیون پس‌التهابی (PIH) ناشی از آکنه و سوختگی",
      "لکه‌های پیری و آفتابی (Solar Lentigines) ناشی از آسیب فوتونی",
      "ناهمواری و ماتی رنگ پوست همراه با ترشح نامتعادل سبوم",
    ],
    equipmentAndFormulations: [
      "محلول پیلینگ چنداسیده بافرشده با پی‌اچ ۳.۲ حاوی اسیدهای AHA، PHA و ترانگزامیک اسید",
      "سرم نیاسینامید بافرشده ۵٪ + ترانگزامیک اسید ۳٪",
      "کرم رتینول انکپسوله تایم‌ریلیس (Time-Release Micro-Encapsulated Retinol)",
      "محلول خنثی‌ساز فیزیولوژیک قلیایی با عصاره آلوئه‌ورا و سنتلا آسیاتیکا",
      "ضدآفتاب درماتولوژیک فیزیکال صددرصد مینرال با فاکتور محافظتی SPF 50+",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "چربی‌زدایی و تنظیم پی‌اچ پوست (Degreasing)",
        duration: "۳ دقیقه",
        description:
          "پاکسازی سطحی و استفاده از پد دگریسر ملایم جهت حذف یکدست سبوم اکسیدشده و فراهم‌آوری نفوذ همگن اسیدها در سراسر اپیدرم.",
        clinicalPearl: "تجمع نامتقارن سبوم باعث نفوذ ناهمگون اسید و ایجاد فراستینگ‌های تکه‌تکه و ناخواسته می‌گردد.",
      },
      {
        stepNumber: 2,
        title: "اپلیکیشن محلول مهار ملانوژنز با ترانگزامیک اسید",
        duration: "۵ دقیقه",
        description:
          "اعمال لایه اول محلول با براش بادبزنی پزشکی از نواحی مقاوم‌تر (پیشانی و بینی) به سمت نواحی حساس‌تر (گونه‌ها و دور دهان).",
        clinicalPearl: "ترانگزامیک اسید مسیرهای پلاسمینوژن-کراتینوسیت را مهار نموده و سیگنال‌های تولید رنگدانه را پیش از آغاز ملانوژنز متوقف می‌سازد.",
      },
      {
        stepNumber: 3,
        title: "پایش بالینی و اعمال لایه دوم در لکه‌های هدف",
        duration: "۷ دقیقه",
        description:
          "بررسی واکنش اریتمای پوست پس از ۳ دقیقه؛ در صورت عدم حساسیت بیش از حد، لایه دوم صرفاً در مرکز لکه‌های پررنگ ملاسما تکرار می‌شود.",
        clinicalPearl: "از ایجاد فراستینگ عمیق اجتناب گردد؛ هدف در ملاسما پیلینگ سطحی و کنترل‌شده جهت پیشگیری از بازگشت رِباوند ملانین است.",
      },
      {
        stepNumber: 4,
        title: "خنثی‌سازی کامل با محلول بافر و آرام‌سازی بافت",
        duration: "۱۰ دقیقه",
        description:
          "اسپری محلول خنثی‌ساز قلیایی فیزیولوژیک جهت پایان واکنش اسیدی و شستشو با کمپرس آب سرد تا رفع کامل احساس سوزش.",
        clinicalPearl: "خنثی‌سازی دقیق اسیدها، از نفوذ تصادفی آنها به لایه رتیکولار درم جلوگیری می‌کند.",
      },
      {
        stepNumber: 5,
        title: "اعمال سرم تثبیت‌کننده و ضدآفتاب مینرال کامل",
        duration: "۱۵ دقیقه",
        description:
          "استفاده از سرم نیاسینامید بافرشده و کرم محافظ مینرال زینک اکساید جهت ایزولاسیون کامل پوست در برابر طیف نور مرئی و UV.",
        clinicalPearl: "بیمار باید ملزم شود هر ۲ ساعت یک‌بار ضدآفتاب خود را تجدید نماید.",
      },
    ],
    clinicalWarnings: [
      "استفاده از این پروتکل در دوران بارداری و شیردهی ممنوع است.",
      "عدم استفاده از ضدآفتاب در روزهای پس از درمان می‌تواند موجب تشدید هیپرپیگمانتاسیون گردد.",
    ],
    contraindications: [
      "دوران بارداری و شیردهی",
      "سابقه ابتلا به کلوئید و گوشت اضافه پس از جراحات پوستی",
      "آفتاب‌سوختگی فعال یا قرارگیری در معرض سولاریوم ظرف ۲ هفته گذشته",
    ],
    downloads: [
      { title: "پروتکل جامع مهار ملانوژنز و درمان ترکیبی ملاسما", format: "PDF", size: "۲.۸ مگابایت" },
      { title: "جدول ارزیابی فوتوتایپ فیتزپاتریک و تنظیم غلظت اسید", format: "PDF", size: "۹۸۰ کیلوبایت" },
    ],
    relatedKitId: "carboxy-cartridges-box20",
    relatedKitName: "کارتریج‌های ژل تک‌دوز کربوکسی و ست ماسک (Box of 20)",
  },
];

export default function ProtocolsSubPage() {
  return (
    <div style={{ padding: "40px 0 90px" }}>
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "24px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/b2b">پورتال B2B کلینیک‌ها</Link>
        <span>/</span>
        <span>پروتکل‌های بالینی و استانداردهای کابین درمان</span>
      </nav>

      {/* ── Page Header ── */}
      <header className="blog-header" style={{ marginBottom: "36px" }}>
        <div className="eyebrow">Standard Operating Procedures (SOP)</div>
        <h1 style={{ margin: "6px 0 10px" }}>دستورالعمل‌ها و پروتکل‌های رسمی درمان در کابین کلینیک</h1>
        <p style={{ maxWidth: "760px", color: "var(--muted)", lineHeight: "1.9" }}>
          راهنماهای گام‌به‌گام پروسیجرهای بالینی مبتنی بر فیزیولوژی ترنس‌درمال و مقالات داوری‌شده درماتولوژی؛ تدوین‌شده توسط
          هیئت مشاوران علمی دکتر درمر با مشخصات دقیق اندیکاسیون‌ها، تجهیزات، هشدارهای بالینی و مستندات دانلودی.
        </p>
      </header>

      {/* ── Protocols Deep Dossier List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "36px", marginBottom: "50px" }}>
        {CLINICAL_PROTOCOLS.map((proto) => (
          <article
            key={proto.id}
            id={proto.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "var(--shadow-card)",
              borderTop: "5px solid var(--brand)",
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "14px",
                borderBottom: "1px solid var(--line)",
                paddingBottom: "18px",
                marginBottom: "20px",
              }}
            >
              <div>
                <span
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand-deep)",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  ⏱️ {proto.duration}
                </span>
                <h2 style={{ margin: 0, fontSize: "1.4rem", color: "var(--brand-deep)", lineHeight: "1.4" }}>
                  {proto.title}
                </h2>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "6px" }}>
                  <strong>جامعه مخاطب مجاز:</strong> {proto.targetAudience}
                </div>
              </div>

              <Link
                href="/b2b#wizard-section"
                style={{
                  background: "var(--accent)",
                  color: "#18221d",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  textDecoration: "none",
                }}
              >
                استعلام قیمت کیت این پروتکل ←
              </Link>
            </div>

            {/* Grid: Indications & Equipment */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                marginBottom: "26px",
              }}
            >
              {/* Indications */}
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <h3 style={{ fontSize: "0.96rem", color: "var(--brand-deep)", margin: "0 0 10px" }}>
                  🎯 اندیکاسیون‌های بالینی هدف:
                </h3>
                <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {proto.indications.map((ind, i) => (
                    <li key={i} style={{ fontSize: "0.84rem", color: "var(--ink)", lineHeight: "1.7" }}>
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment & Formulations */}
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <h3 style={{ fontSize: "0.96rem", color: "var(--brand-deep)", margin: "0 0 10px" }}>
                  🧪 تجهیزات و فرمولاسیون‌های مورد نیاز:
                </h3>
                <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {proto.equipmentAndFormulations.map((eq, i) => (
                    <li key={i} style={{ fontSize: "0.84rem", color: "var(--ink)", lineHeight: "1.7" }}>
                      {eq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div style={{ marginBottom: "26px" }}>
              <h3 style={{ fontSize: "1.08rem", color: "var(--brand-deep)", margin: "0 0 14px" }}>
                مراحل گام‌به‌گام اجرای بالینی (Procedural Protocol Steps):
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {proto.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "16px 18px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "0.94rem", color: "var(--brand-deep)" }}>
                        مرحله {st.stepNumber}: {st.title}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          background: "var(--brand-tint)",
                          color: "var(--brand-deep)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontWeight: 700,
                        }}
                      >
                        ⏱️ {st.duration}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.8" }}>
                      {st.description}
                    </p>
                    <div
                      style={{
                        background: "#f0fdf4",
                        borderRight: "3px solid #10b981",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "#065f46",
                      }}
                    >
                      💡 <strong>نکته کلینیکال (Clinical Pearl):</strong> {st.clinicalPearl}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings and Contraindications */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginBottom: "26px",
              }}
            >
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <strong style={{ display: "block", color: "#92400e", fontSize: "0.88rem", marginBottom: "8px" }}>
                  ⚠️ هشدارهای بالینی و مدیریت عوارض:
                </strong>
                <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {proto.clinicalWarnings.map((w, i) => (
                    <li key={i} style={{ fontSize: "0.82rem", color: "#78350f", lineHeight: "1.7" }}>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <strong style={{ display: "block", color: "#991b1b", fontSize: "0.88rem", marginBottom: "8px" }}>
                  ⛔ موارد منع مصرف قطعی (Contraindications):
                </strong>
                <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {proto.contraindications.map((c, i) => (
                    <li key={i} style={{ fontSize: "0.82rem", color: "#7f1d1d", lineHeight: "1.7" }}>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Downloadable Documentation */}
            <div
              style={{
                background: "var(--paper)",
                border: "1px dashed var(--line)",
                borderRadius: "14px",
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <div>
                <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--brand-deep)", display: "block" }}>
                  📥 اسناد و مستندات مکتوب بالینی جهت دانلود:
                </span>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
                  {proto.downloads.map((d, i) => (
                    <a
                      key={i}
                      href={`#${proto.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "var(--surface)",
                        border: "1px solid var(--line)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        color: "var(--brand-deep)",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      <span>📄</span>
                      <span>{d.title}</span>
                      <small style={{ color: "var(--muted)", marginRight: "4px" }}>({d.format} - {d.size})</small>
                    </a>
                  ))}
                </div>
              </div>

              <Link
                href={`/b2b#wizard-section`}
                style={{
                  background: "var(--brand-deep)",
                  color: "#ffffff",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                سفارش کیت مصرفی این پروتکل ({proto.relatedKitName.split("+")[0].trim()}) →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
