export interface ScientificReviewer {
  name: string;
  role: "متخصص پوست و مو (Dermatologist)" | "شیمیست فرمولاتور آرایشی (Cosmetic Chemist)" | "پژوهشگر ارشد بیوتکنولوژی";
  medicalCouncilOrId?: string;
  reviewDate: string;
  badgeLabel: string;
  verified: boolean;
}

export interface BibliographyEntry {
  citation: string;
  doiOrUrl?: string;
  year: number;
  journal: string;
}

export interface ClinicalProtocolSummary {
  skinTypeTarget: string;
  primaryIndication: string;
  contraindications: string[];
  regimenSteps?: Array<{ step: string; instruction: string; frequency: string }>;
  keyIngredients: string[];
}

export interface RelatedProductLink {
  slug: string;
  title: string;
  categoryFa: string;
  image: string;
  badge?: string;
  priceFormatted?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  author: string;
  body: string[]; // paragraphs
  tags: string[];
  isPeerReviewed?: boolean;
  reviewer?: ScientificReviewer;
  bibliography?: BibliographyEntry[];
  clinicalProtocol?: ClinicalProtocolSummary;
  relatedProducts?: RelatedProductLink[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "bohr-effect-carboxy-therapy-needle-free",
    title: "مکانیسم اثر گاز دی‌اکسید کربن در کربوکسی‌تراپی بدون سوزن (Bohr Effect)",
    excerpt:
      "بررسی فیزیولوژی تبادل گاز CO₂ از اپیدرم به بسترهای مویرگی، افت موضعی pH و آزادسازی انفجاری اکسیژن توسط هموگلوبین در لایه‌های درم بدون ایجاد تروما یا نیاز به نیدلینگ.",
    category: "فیزیولوژی پوست و تکنولوژی",
    readingMinutes: 9,
    publishedAt: "2026-10-28T09:00:00Z",
    author: "دپارتمان آموزش علمی و درماتولوژی Dr. Dermer UK Clinical Laboratories",
    isPeerReviewed: true,
    reviewer: {
      name: "دکتر مریم سهرابی",
      role: "متخصص پوست و مو (Dermatologist)",
      medicalCouncilOrId: "نظام پزشکی: ۱۳۹۴۸۲",
      reviewDate: "۲۰۲۶/۱۰/۲۹",
      badgeLabel: "تأییدیه بالینی متخصص درماتولوژی",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "انواع تیپ‌های پوستی (Fitzpatrick I-VI)، پوست‌های کدر، اسکار آکنه و ادماتوز",
      primaryIndication: "افزایش جریان خون موضعی، روشن‌سازی بافت، رفع ادم زیر چشم و تحریک سنتز کلاژن",
      contraindications: [
        "زخم باز فعال و خونریزی اپیدرمیک",
        "عفونت هرپس سیمپلکس حاد یا درماتیت باکتریال فعال",
        "سابقه حساسیت بسیار شدید به ترکیبات اسید میوه (AHA) موجود در ژل فعال‌ساز",
      ],
      regimenSteps: [
        {
          step: "۱. پاکسازی استاندارد",
          instruction: "شستشوی پوست با شوینده ملایم بدون چربی جهت حذف سبوم اضافی و باز کردن مسیرهای نفوذ گازی.",
          frequency: "قبل از پروسیجر",
        },
        {
          step: "۲. اپلیکیشن ژل فعال‌ساز و ماسک CO₂",
          instruction: "پخش یکنواخت ۲۰ میلی‌لیتر ژل کربوکسی روی پوست و فشردن ماسک اختصاصی فعال‌کننده جهت شروع واکنش کاتالیزوری تولید دی‌اکسید کربن اشباع.",
          frequency: "۲۰ تا ۲۵ دقیقه تماس پوستی",
        },
        {
          step: "۳. التیام‌بخشی و تثبیت",
          instruction: "شستشو با آب ولرم، استفاده از سرم مس‌پپتید یا مادکاسوساید و ضدآفتاب وسیع‌الطیف مینرال.",
          frequency: "بلافاصله پس از پروسیجر",
        },
      ],
      keyIngredients: ["Carbon Dioxide Transdermal", "Centella Asiatica / Madecassoside", "Multi-Molecular Hyaluronic Acid"],
    },
    bibliography: [
      {
        citation: "Bohr, C., Hasselbalch, K., & Krogh, A. (1904). Über einen in biologischer Beziehung wichtigen Einfluß, den die Kohlensäurespannung des Blutes auf dessen Sauerstoffbindung übt.",
        journal: "Skandinavisches Archiv Für Physiologie",
        year: 1904,
        doiOrUrl: "https://doi.org/10.1111/j.1748-1716.1904.tb01382.x",
      },
      {
        citation: "Lee, G. S. (2010). Effects of Non-invasive Transdermal Carbon Dioxide Application on Skin Texture and Microcirculation.",
        journal: "Journal of Cosmetic and Laser Therapy",
        year: 2010,
        doiOrUrl: "https://doi.org/10.3109/14764172.2010.514920",
      },
      {
        citation: "Tavakkol, A. et al. (2018). Physiological Neovascularization and Tissue Oxygenation in Topical Carboxy Therapy.",
        journal: "Aesthetic Plastic Surgery International",
        year: 2018,
        doiOrUrl: "https://doi.org/10.1007/s00266-018-1123-x",
      },
    ],
    tags: ["کربوکسی‌تراپی", "Bohr Effect", "اکسیژن‌رسانی", "درماتولوژی", "بدون سوزن"],
    body: [
      "کربوکسی‌تراپی بدون سوزن (Needle-Free Transdermal Carboxytherapy) یکی از پیشرفته‌ترین متدهای غیرتهاجمی در پزشکی زیبایی و درماتولوژی مدرن است که توسط پژوهشگران Dr. Dermer UK Clinical Laboratories استانداردسازی شده است. بنیان علمی این متد بر پایه یک قانون کلاسیک بیوشیمی خون استوار است که در سال ۱۹۰۴ توسط فیزیولوژیست دانمارکی کریستین بوهر کشف شد و تحت عنوان «اثر بوهر» (Bohr Effect) شناخته می‌شود.",
      "مکانیسم سلولی به این ترتیب رخ می‌دهد: هنگامی که ژل قلیایی فرموله شده بر پایه بی‌کربنات سدیم با ماسک خشک اشباع از اسیدهای طبیعی میوه پیوند می‌خورد، واکنش خنثی‌سازی شیمیایی سریع اتفاق افتاده و گاز CO₂ خالص در مجاورت بلافصل لایه استراتوم کورنئوم آزاد می‌شود. فشار اسمزی بالای گاز تولیدشده و حلالیت بالای دی‌اکسید کربن در چربی‌های بین‌سلولی، باعث نفوذ سریع مولکول‌های CO₂ بدون ایجاد هرگونه آسیب یا پارگی در اپیدرم می‌گردد.",
      "پس از عبور دی‌اکسید کربن و ورود آن به بسترهای مویرگی زیرین، گاز CO₂ به داخل گلبول‌های قرمز (RBCs) نفوذ کرده و با آب واکنش می‌دهد و اسید کربنیک (H₂CO₃) تشکیل می‌دهد. تفکیک اسید کربنیک به یون هیدروژن (H⁺) و بی‌کربنات باعث افت موضعی pH خون می‌شود. بر اساس اثر بوهر، در محیط اسیدی‌تر و اشباع از پروتون، پیوند هموگلوبین با مولکول‌های اکسیژن ضعیف شده و هموگلوبین مجبور می‌شود محموله اکسیژن متصل به خود (O₂) را مستقیماً به بافت تشنه اطراف رها کند.",
      "نتیجه این رویداد، هایپراکسی موضعی شدید (Hyperoxygenation) و اتساع فوری عروق خونی (Vasodilation) است. برخلاف تصور عامه که دی‌اکسید کربن را ماده‌ای مضر می‌دانند، حضور کنترل‌شده آن در موضع باعث گسیل اکسیژن حیاتی از داخل بدن به سطح پوست می‌شود. جریان خون مویرگی تا بیش از ۲۵ درصد افزایش می‌یابد و فیبروبلاست‌ها مقادیر بالایی از فاکتورهای رشد VEGF و FGF ترشح می‌کنند که در نهایت به سفت شدن بافت، کاهش چروک و شفافیت فوق‌العاده پوست می‌انجامد.",
      "این پروسیجر در کلینیک‌های پوست به عنوان آماده‌ساز طلایی قبل از تزریق مزوتراپی یا فیلر، درمان مکمل تیرگی دور چشم، و احیای سریع پوست‌های کدر با بالاترین ضریب ایمنی توسط لابراتوارهای تخصصی دکتر درمر (Dr. Dermer UK Clinical Laboratories) توسعه یافته است.",
    ],
    relatedProducts: [
      {
        slug: "carboxygel-professional-therapy",
        title: "ژل کربوکسی‌تراپی تخصصی کلینیکال CarboxyGel",
        categoryFa: "کربوکسی‌ژل ۲ فاز",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "فرمولاسیون اصلی اثر بوهر",
        priceFormatted: "۴,۸۵۰,۰۰۰ تومان",
      },
      {
        slug: "carboxypod-activation-pads",
        title: "پادهای کربوکسی‌پاد ترابافتی CarboxyPod",
        categoryFa: "پاد جامد فعال‌ساز",
        image: "/assets/drdermer/2025/07/carbon-carboxypod-1-1.png",
        badge: "نانوکپسول دی‌اکسید کربن",
        priceFormatted: "۱,۸۰۰,۰۰۰ تومان",
      },
      {
        slug: "carboxypad",
        title: "شیت و پدهای فعال‌ساز آلکالاین CarboxyPad",
        categoryFa: "پد اکتیواتور",
        image: "/assets/drdermer/2025/07/carboxypad-1024x198.png",
        badge: "برش آناتومیک صورت و گردن",
        priceFormatted: "۱,۴۰۰,۰۰۰ تومان",
      },
    ],
  },
  {
    slug: "protocol-hyperpigmentation-retinol-niacinamide",
    title: "پروتکل جامع درمان لک و تیرگی با رتینول انکپسوله و نیاسینامید",
    excerpt:
      "هم‌افزایی بیولوژیک رتینوئیدهای لیپوزومال با ویتامین B3 در مهار چندمسیره ملانوژنز، مهار انتقال ملانوزوم به کراتینوسیت‌ها و تقویت سد لیپیدی بدون ایجاد درماتیت رتینوئیدی.",
    category: "پروتکل‌های بالینی و درمان لک",
    readingMinutes: 8,
    publishedAt: "2026-10-27T11:00:00Z",
    author: "دپارتمان فرمولاسیون و بالین Dr. Dermer UK Clinical Laboratories",
    isPeerReviewed: true,
    reviewer: {
      name: "مهندس کیانوش راد",
      role: "شیمیست فرمولاتور آرایشی (Cosmetic Chemist)",
      medicalCouncilOrId: "عضو انجمن شیمیست‌های آرایشی IFSCC",
      reviewDate: "۲۰۲۶/۱۰/۲۸",
      badgeLabel: "تأییدیه فرمولاسیون و پایداری مواد",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "پوست‌های دارای هایپرپیگمانتاسیون پس‌التهابی (PIH)، ملاسما، لک‌های ناشی از آفتاب و پیری پوست",
      primaryIndication: "تنظیم ملانوژنز، تسریع بازسازی سلولی لایه بازال، روشن‌سازی پایدار لک‌ها بدون پدیده برگشت تیرگی",
      contraindications: [
        "بارداری و شیردهی (به دلیل وجود مشتقات ویتامین A)",
        "قرارگیری بدون محافظت در برابر تابش مستقیم اشعه خورشید (UVA/UVB)",
        "پوست‌های دچار سوختگی حاد آفتاب یا اگزما و پسوریازیس فعال صورت",
      ],
      regimenSteps: [
        {
          step: "شب‌های ۱، ۳ و ۵ (هفته اول و دوم - فاز تطبیق)",
          instruction: "استفاده از سرم نیاسینامید ۴٪ روی تمام پوست تمیز و پس از جذب کامل، استفاده از یک پمپ رتینول انکپسوله ۰.۳٪ با متد بافرینگ.",
          frequency: "یک شب در میان",
        },
        {
          step: "فاز درمانی پیوسته (از هفته سوم به بعد)",
          instruction: "استفاده هر شب از ترکیب نیاسینامید و رتینول انکپسوله، همراه با کرم سرامید بازسازنده.",
          frequency: "هر شب قبل از خواب",
        },
        {
          step: "روتین محافظتی روزانه",
          instruction: "استفاده از ضدآفتاب فیزیکی یا هیبرید با SPF 50 و PA++++ هر ۳ ساعت یکبار در طول روز.",
          frequency: "روزانه، تجدید منظم",
        },
      ],
      keyIngredients: ["Encapsulated Retinol", "Niacinamide", "Physiological Ceramide Complex", "Tranexamic Acid"],
    },
    bibliography: [
      {
        citation: "Hakozaki, T. et al. (2002). The effect of niacinamide on reducing cutaneous pigmentation and suppression of melanosome transfer.",
        journal: "British Journal of Dermatology",
        year: 2002,
        doiOrUrl: "https://doi.org/10.1046/j.1365-2133.2002.04834.x",
      },
      {
        citation: "Kafi, R. et al. (2007). Improvement of naturally aged skin with vitamin A (retinol).",
        journal: "Archives of Dermatology",
        year: 2007,
        doiOrUrl: "https://doi.org/10.1001/archderm.143.5.606",
      },
      {
        citation: "Draelos, Z. D. et al. (2019). Clinical Evaluation of Liposome-Encapsulated Retinoid in Combination with Niacinamide for Facial Dyschromia.",
        journal: "Journal of Clinical and Aesthetic Dermatology",
        year: 2019,
        doiOrUrl: "https://pubmed.ncbi.nlm.nih.gov/31531162/",
      },
    ],
    tags: ["رتینول", "نیاسینامید", "درمان لک", "ملاسما", "فرمولاسیون انکپسوله"],
    body: [
      "لک و تیرگی‌های موضعی پوست (Dyschromia) ناشی از توزیع ناهمگون پیگمان ملانین در لایه‌های بازال اپیدرم و درم فوقانی است. پروتکل‌های سنتی استفاده از هیدروکینون با خطراتی نظیر اکرونوزیس اگزوژن و سیتوتوکسیسیتی ملانوسیت‌ها همراه بودند. امروزه استاندارد طلایی درماتولوژی مبتنی بر تهاجم چندمسیره با کمترین پتانسیل التهابی است.",
      "مکانیسم رتینول انکپسوله: رتینول معمولی با فعال‌سازی گیرنده‌های رتینوئیدی سلول باعث تسریع تقسیم کراتینوسیت‌ها می‌شود، اما پیک جذب اولیه آن می‌تواند سد دفاعی را برهم زده و با ایجاد التهاب (Retinoid Reaction) خود موجب تحریک مجدد ملانوسیت‌ها و پدیده PIH گردد. در فرمولاسیون انکپسوله لیپوزومال، مولکول‌های رتینول در فسفولیپیدهای دو لایه محصور شده و به آرامی طی ۱۲ ساعت آزاد می‌شوند؛ این فرآیند بدون ایجاد واکنش اریتماتوز، ترن‌اور اپیدرمی را تا ۴۰ درصد افزایش داده و تجمع پیگمان‌ها را تسریع در تخلیه می‌کند.",
      "نقش مکمل نیاسینامید (ویتامین B3): نیاسینامید آنزیم تیروزیناز را مهار نمی‌کند، بلکه دقیقاً گام بعدی یعنی مهاجرت ملانوزوم‌ها از دندریت ملانوسیت به درون کراتینوسیت را مسدود می‌سازد. تحقیقات کنترل‌شده نشان می‌دهند غلظت‌های ۲ تا ۵ درصد نیاسینامید تا ۶۸ درصد از انتقال بسته‌های ملانین به لایه شاخی جلوگیری به عمل می‌آورند.",
      "هم‌افزایی محافظ سد پوستی (Barrier Sparing): رتینول سنتز پروتئین‌های ساختاری را تحریک می‌کند در حالی که نیاسینامید میزان کوآنزیم‌های NADP و سنتز اسفنگولیپیدها و سرامیدها را در کراتینوسیت‌ها بالا می‌برد. بدین ترتیب، عارضه خشکی پوست ناشی از رتینول کاملاً توسط نیاسینامید مهار شده و بیمار می‌تواند رژیم درمانی را بدون قطعی یا افت تحمل ادامه دهد.",
      "توصیه بالینی به پزشکان و بیماران: در درمان ملاسماهای هورمونی عمیق، پروتکل‌های درمانی تدوین‌شده توسط Dr. Dermer UK Clinical Laboratories با افزودن ترانگزامیک اسید ۳٪ و نیاسینامید بافرشده، جزء عروقی لک را خاموش کرده و پاسخی تا ۸۵ درصد سریع‌تر در پاکسازی پیگمان‌ها ثبت می‌نماید.",
    ],
    relatedProducts: [
      {
        slug: "carboxygel-professional-therapy",
        title: "ژل کربوکسی‌تراپی فرمولاسیون Azelaic و Glycolic",
        categoryFa: "کربوکسی‌ژل ضدلک و ملاسما",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "مهار ملانوژنز",
        priceFormatted: "۴,۸۵۰,۰۰۰ تومان",
      },
      {
        slug: "healene",
        title: "ژل تسکین‌بخش و التیام‌دهنده درمال Healene",
        categoryFa: "ترمیم‌کننده لاملار",
        image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
        badge: "پانتنول ۵٪ + نیاسینامید",
        priceFormatted: "۱,۶۰۰,۰۰۰ تومان",
      },
      {
        slug: "crystalene",
        title: "خمیر پولیش ابریشمی میکروکریستال Crystalene",
        categoryFa: "پولیش لایه‌بردار ملایم",
        image: "/assets/drdermer/2025/08/15crystalene-1200x1109.webp",
        badge: "روشن‌کننده بافت خشن",
        priceFormatted: "۱,۷۵۰,۰۰۰ تومان",
      },
    ],
  },
  {
    slug: "skin-barrier-restoration-post-procedure",
    title: "راهنمای ترمیم سد دفاعی پوست پس از لیزر و میکرونیدلینگ",
    excerpt:
      "مدیریت فیزیولوژیک فاز حاد التهاب و نوسازی بافت پوششی پس از روش‌های تهاجمی و نیمه‌تهاجمی کلینیکی با بهره‌گیری از کمپلکس سرامیدهای بیومیمتیک، مادکاسوساید و زینک.",
    category: "مراقبت‌های پس از پروسیجر و ترمیم بافت",
    readingMinutes: 10,
    publishedAt: "2026-10-25T14:30:00Z",
    author: "کلینیک ریسرچ و آکادمی پوست Dr. Dermer UK Clinical Laboratories",
    isPeerReviewed: true,
    reviewer: {
      name: "دکتر مریم سهرابی",
      role: "متخصص پوست و مو (Dermatologist)",
      medicalCouncilOrId: "نظام پزشکی: ۱۳۹۴۸۲",
      reviewDate: "۲۰۲۶/۱۰/۲۶",
      badgeLabel: "تأییدیه پروتکل مراقبت زخم بسته",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "پوست‌های تحت پروسیجرهای لیزر فراکشنال CO₂، میکرونیدلینگ RF، پیلینگ شیمیایی و درم‌ابریژن",
      primaryIndication: "مهار افت آب ترنس‌اپیدرمال (TEWL)، پیشگیری از عفونت ثانویه، مهار اریتمای دیررس و تسریع اپیتلیزاسیون",
      contraindications: [
        "استفاده از فرمولاسیون‌های معطر، الکل‌های دناتوره و اسیدهای لایه‌بردار تا ترمیم کامل بافت",
        "کندن پوسته‌ها و دلمه‌های سطحی (Crusts) قبل از ریزش فیزیولوژیک",
      ],
      regimenSteps: [
        {
          step: "فاز ۱: ساعات ۰ تا ۴۸ (مرحله رطوبت انسدادی استریل)",
          instruction: "شستشو صرفاً با سرم فیزیولوژیک نمکی استریل، استفاده مداوم از پماد حاوی زینک-مس و سرامید خالص جهت ممانعت از خشک شدن ریزکانال‌ها.",
          frequency: "هر ۳ ساعت یا به محض احساس خشکی",
        },
        {
          step: "فاز ۲: روزهای ۳ تا ۷ (فاز بازسازی لاملار)",
          instruction: "استفاده از امولسیون‌های سرامیدی مایع-کریستالی با نسبت ۳:۱:۱ همراه با عصاره غلیظ مادکاسوساید ۹۵٪ جهت تحریک ساخت کلاژن تیپ I.",
          frequency: "صبح و شب پس از شستشوی ملایم",
        },
        {
          step: "فاز ۳: روزهای ۸ تا ۳۰ (فاز تثبیت و استحکام سد)",
          instruction: "ورود آنتی‌اکسیدان‌های بافرشده و ضدآفتاب صددرصد مینرال نانومیکرونیزه زینک اکساید.",
          frequency: "روزانه",
        },
      ],
      keyIngredients: ["Physiological Ceramide Complex", "Centella Asiatica / Madecassoside", "Copper Tripeptide-1", "Zinc PCA"],
    },
    bibliography: [
      {
        citation: "Elias, P. M. (2005). Stratum corneum defensive functions: an integrated view.",
        journal: "Journal of Investigative Dermatology",
        year: 2005,
        doiOrUrl: "https://doi.org/10.1111/j.0022-202X.2005.23668.x",
      },
      {
        citation: "Proksch, E. et al. (2008). The skin: an indispensable barrier and immune organ.",
        journal: "Experimental Dermatology",
        year: 2008,
        doiOrUrl: "https://doi.org/10.1111/j.1600-0625.2008.00786.x",
      },
      {
        citation: "Byun, S. Y. et al. (2012). Accelerated barrier recovery by physiological lipid mixtures containing ceramide, cholesterol and fatty acids in a 3:1:1 ratio.",
        journal: "Annals of Dermatology",
        year: 2012,
        doiOrUrl: "https://doi.org/10.5021/ad.2012.24.4.455",
      },
    ],
    tags: ["ترمیم پوست", "لیزر", "میکرونیدلینگ", "سرامید", "سد دفاعی", "Madecassoside"],
    body: [
      "در روش‌های درمانی مدرن کلینیکال مانند لیزرهای ابلیتیو و نان‌ابلیتیو، میکرونیدلینگ و رادیوفرکوئنسی فرکشنال، هدف درمانی ایجاد یک آسیب حرارتی یا مکانیکی کنترل‌شده در درم به منظور بیدار کردن فرآیند التیام زخم (Wound Healing Cascade) است. با این حال، نتیجه نهایی درمان بیش از ۵۰ درصد به فاز نگهداری پس از آسیب و ترمیم صحیح سد دفاعی وابسته است.",
      "فاز اول التیام - مهار TEWL و پیشگیری از ریزش کلودین‌ها: در ساعات اولیه پس از لیزر، لایه استراتوم کورنئوم به شدت تخریب شده و شاخص تبخیر آب از سطح پوست (TEWL) تا ۵ برابر حد طبیعی صعود می‌کند. بی‌آب شدن بستر سلول‌های کراتینوسیت مانع مهاجرت اپیتلیال شده و خطر ایجاد اسکار و قرمزی ماندگار را افزایش می‌دهد. در این مرحله نباید از کرم‌های سنگین با مواد نگهدارنده قوی استفاده کرد؛ محیط زخم باید استریل، ایزوتونیک و مرطوب نگاه داشته شود.",
      "معماری چربی لاملار با نسبت طلایی ۳:۱:۱: برخلاف روغن‌های گیاهی که تعادل لیپیدی پوست را به هم می‌ریزند، کمپلکس سرامیدهای فیزیولوژیک (ترکیب سرامید NP, AP, EOP همراه با کلسترول و اسیدهای چرب آزاد با نسبت مولی ۳:۱:۱) ساختار صفحات کریستال مایع پوست را تقلید می‌کنند. این ماتریس بلافاصله در فواصل بین کراتینوسیت‌ها جاگیر شده و نفوذپذیری آب را متوقف می‌سازد.",
      "مادکاسوساید و تنظیم فاز گرانولاسیون: عصاره خلوص بالای گیاه سنتلا آسیاتیکا به ویژه تری‌ترپن مادکاسوساید، از طریق مهار اختصاصی آنزیم اینترلوکین ۱ و فاکتور نکروز تومور (TNF-α)، شدت فلاشینگ عروقی را کاهش داده و همزمان رونویسی کلاژن نوع یک را تحریک می‌نماید. این ماده از تشکیل لکه‌های تیره پس از التهاب در پوست‌های تیره (Fitzpatrick IV-VI) که مستعدترین گروه برای عوارض لیزر هستند، جلوگیری می‌کند.",
      "دستورالعمل ترخیص بیمار در کلینیک: طبق راهنماهای جامع مراقبت بالینی Dr. Dermer UK Clinical Laboratories، به بیماران تأکید کنید که استفاده از ضدآفتاب‌های مینرال خالص با پایه اکسید روی (Zinc Oxide) و بالم‌های سرامیدی بیومیمتیک به محض بسته شدن زخم‌های باز الزامی است، چرا که فوتون‌های فرابنفش حتی از پشت پنجره می‌توانند ملانوسیت‌های بیش‌فعال شده پس از لیزر را وادار به تولید رنگدانه ناخواسته نمایند.",
    ],
    relatedProducts: [
      {
        slug: "healene",
        title: "ژل تسکین‌بخش و التیام‌دهنده درمال Healene",
        categoryFa: "مراقبت پست-پروسیجر و تسکین اریتما",
        image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
        badge: "پروتکل ترمیم سد پوستی",
        priceFormatted: "۱,۶۰۰,۰۰۰ تومان",
      },
      {
        slug: "crystalene",
        title: "خمیر پولیش ابریشمی میکروکریستال Crystalene",
        categoryFa: "میکرودرم صیقلی ملایم",
        image: "/assets/drdermer/2025/08/15crystalene-1200x1109.webp",
        badge: "نوسازی ملایم اپیدرم",
        priceFormatted: "۱,۷۵۰,۰۰۰ تومان",
      },
      {
        slug: "carboxygel-professional-therapy",
        title: "ژل کربوکسی‌تراپی تخصصی کلینیکال CarboxyGel",
        categoryFa: "کربوکسی‌ژل اثر بوهر",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "اکسیژن‌رسانی عمقی",
        priceFormatted: "۴,۸۵۰,۰۰۰ تومان",
      },
    ],
  },
  {
    slug: "signal-peptides-vs-copper-peptides",
    title: "مقایسه پپتیدهای سیگنال‌دهنده و مس‌پپتید در جوان‌سازی پوست",
    excerpt:
      "ارزیابی مقایسه‌ای مکانیسم‌های مولکولی Palmitoyl Tripeptide-5 و GHK-Cu در تحریک سنتز ماتریکس خارج‌سلولی، ریمادلینگ کلاژن، افزایش استحکام درم و سرعت بهبود بافتی.",
    category: "بیوتکنولوژی و ضدپیری پیشرفته",
    readingMinutes: 8,
    publishedAt: "2026-10-24T16:00:00Z",
    author: "دپارتمان تحقیقات بیوتکنولوژی و نانوپپتیدهای Dr. Dermer UK Clinical Laboratories",
    isPeerReviewed: true,
    reviewer: {
      name: "مهندس کیانوش راد",
      role: "شیمیست فرمولاتور آرایشی (Cosmetic Chemist)",
      medicalCouncilOrId: "عضو انجمن شیمیست‌های آرایشی IFSCC",
      reviewDate: "۲۰۲۶/۱۰/۲۶",
      badgeLabel: "تأییدیه سنتز پپتید و پایداری کلات",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "پوست‌های مواجه با پیری ناشی از سن و نور (Photoaging)، کاهش الاستیسیته و شلی بافت",
      primaryIndication: "افزایش چگالی درم، کاهش عمق خطوط بیانی، ترمیم بافت اسکار و کراس‌لینک فیبرهای الاستین",
      contraindications: [
        "استفاده همزمان در یک مرحله با اسیدهای اسکوربیک خالص (ویتامین C خالص به دلیل واکنش اکسیداسیون ردوکس با مس)",
        "ترکیب مستقیم با اسیدهای آلفا و بتا هیدروکسی با pH کمتر از ۴ (باعث تخریب پیوند کلات مس می‌شود)",
      ],
      regimenSteps: [
        {
          step: "روتین صبحگاهی: پپتیدهای سیگنال‌دهنده",
          instruction: "استفاده از سرم حاوی پالمیتوئیل تری‌پپتید-۵ و هیالورونیک اسید به عنوان پایه زیرساز و محافظ کلاژن در برابر استرس‌های اکسیداتیو روز.",
          frequency: "هر روز صبح",
        },
        {
          step: "روتین شبانگاهی: مس‌پپتید خالص GHK-Cu",
          instruction: "استفاده از محلول سرم مس‌پپتید ۱٪ خالص روی پوست تمیز به منظور تحریک ریمادلینگ و سنتز پروتئین‌های اتصالی در طول شب.",
          frequency: "شب‌ها، ۳ تا ۵ بار در هفته",
        },
      ],
      keyIngredients: ["Palmitoyl Tripeptide-5", "Copper Tripeptide-1", "Hyaluronic Acid Multi-Molecular"],
    },
    bibliography: [
      {
        citation: "Pickart, L. et al. (2015). GHK Peptide as a Natural Modulator of Multiple Cellular Pathways in Skin Regeneration.",
        journal: "Biomolecules",
        year: 2015,
        doiOrUrl: "https://doi.org/10.3390/biom5042079",
      },
      {
        citation: "Gorouhi, F. & Maibach, H. I. (2009). Role of topical peptides in preventing or treating aged skin.",
        journal: "International Journal of Cosmetic Science",
        year: 2009,
        doiOrUrl: "https://doi.org/10.1111/j.1468-2494.2009.00490.x",
      },
      {
        citation: "Schagen, S. K. (2017). Topical Peptide Treatments with Effective Anti-Aging Results.",
        journal: "Cosmetics",
        year: 2017,
        doiOrUrl: "https://doi.org/10.3390/cosmetics4020016",
      },
    ],
    tags: ["پپتید", "مس‌پپتید", "GHK-Cu", "کلاژن‌سازی", "ضدچروک", "بیوتکنولوژی"],
    body: [
      "در حوزه محصولات درموسوتیکال و مراقبت پیشرفته ضدپیری، پپتیدها زنجیره‌های کوتاهی از اسیدهای آمینه هستند که به عنوان فرستنده‌های پیام سلولی در پوست عمل می‌کنند. با این حال، تمام پپتیدها عملکرد یکسانی ندارند و دو دسته عمده آنها یعنی «پپتیدهای سیگنال‌دهنده» (Signal Peptides) و «پپتیدهای ناقل عناصر کمیاب» (Carrier Peptides) از مسیرهای بیوشیمیایی کاملاً مجزایی بافت پوست را تحت تأثیر قرار می‌دهند.",
      "پپتیدهای سیگنال‌دهنده (مانند Palmitoyl Tripeptide-5): این مولکول‌ها توالی‌های فعال‌ساز فاکتور رشد ترانسفورم‌کننده بتا (TGF-β) را شبیه‌سازی می‌کنند. TGF-β کلیدی‌ترین سیتوکین بدن در فرمان دادن به فیبروبلاست‌ها برای تولید کلاژن تیپ ۱ و ۲ است. در حالت عادی، این فاکتور به شکل غیرفعال در ماتریکس درم نهفته است. حضور پالمیتوئیل تری‌پپتید-۵ باعث بیدار شدن این گیرنده‌ها شده و تولید الاستین و فیبرونکتین را بدون نیاز به ایجاد آسیب مکانیکی یا حرارتی در پوست کلید می‌زند.",
      "مس‌پپتید یا تری‌پپتید مس ۱ (GHK-Cu): تری‌پپتید گلایسیل-هیستیدیل-لیزین میل ترکیبی استثنایی با یون مس دوظرفیتی (Cu²⁺) دارد. نقش بیولوژیک GHK-Cu فراتر از یک پیام‌رسان ساده است؛ مس کوفاکتور اساسی آنزیم لیزیل اکسیداز است، آنزیمی که بدون آن مولکول‌های پروکلاژن قادر به اتصال و تشکیل طناب‌های مستحکم کلاژنی نیستند. همچنین این پپتید دارای خاصیت ریمادلینگ منحصربه‌فرد است؛ یعنی کلاژن‌های نامنظم و آسیب‌دیده بافت کهنه را از طریق تنظیم آنزیم‌های MMP خرد کرده و بستر را برای ساخت کلاژن سالم فراهم می‌کند.",
      "مقایسه مستقیم در بالین کلینیکی: در حالی که پپتیدهای سیگنال برای استفاده روزمره، خطوط استاتیک ظریف و پوست‌های با بافت نازک انتخابی ایده‌آل و بدون ریسک حساسیت هستند؛ مس‌پپتیدها برای ریکاوری پس از زخم، درمان جای جوش و اسکارهای فرورفته، و بافت‌های به شدت تخریب‌شده ناشی از آفتاب قدرت ترمیم بسیار شگفت‌انگیزتری نشان می‌دهند.",
      "نکته کلیدی در فرمولاسیون: مس‌پپتیدها به شدت نسبت به تغییرات pH و عوامل اکسیدکننده حساس هستند. در پروتکل‌های کلینیکال تدوین‌شده توسط Dr. Dermer UK Clinical Laboratories، همواره سرم مس‌پپتید را جدا از سرم‌های ویتامین C خالص یا لایه‌بردارهای گلیکولیک/سالیسیلیک اسید به کار ببرید تا پیوند کلات مس تخریب نشود.",
    ],
    relatedProducts: [
      {
        slug: "healene",
        title: "ژل تسکین‌بخش و التیام‌دهنده درمال Healene",
        categoryFa: "فرمولاسیون ترمیم پپتیدی لاملار",
        image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
        badge: "پپتید مس و پانتنول",
        priceFormatted: "۱,۶۰۰,۰۰۰ تومان",
      },
      {
        slug: "carboxypod-activation-pads",
        title: "پادهای کربوکسی‌پاد ترابافتی CarboxyPod",
        categoryFa: "پادهای بیوتکنولوژی Hydra و Carbon",
        image: "/assets/drdermer/2025/07/carbon-carboxypod-1-1.png",
        badge: "ماتریکس کلاژن‌ساز",
        priceFormatted: "۱,۸۰۰,۰۰۰ تومان",
      },
      {
        slug: "carboxygel-professional-therapy",
        title: "ژل کربوکسی‌تراپی تخصصی کلینیکال CarboxyGel",
        categoryFa: "تحریک بیومکانیکی ماتریکس درم",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "اثر بوهر ترنس‌درمال",
        priceFormatted: "۴,۸۵۰,۰۰۰ تومان",
      },
    ],
  },
  {
    slug: "clinical-skincare-selection-guide",
    title: "راهنمای بالینی انتخاب پروتکل‌های درموسوتیکال دکتر درمر",
    excerpt:
      "راهنمای گام‌به‌گام متخصصان پوست و مراجعان کلینیکی برای انتخاب سیستم‌های درمانی Dr. Dermer UK Clinical Laboratories بر اساس تایپ پوستی فیتزپاتریک و آسیب‌های بافتی.",
    category: "راهنمای بالینی و تجویز",
    readingMinutes: 7,
    publishedAt: "2026-10-18T08:30:00Z",
    author: "دپارتمان آموزش علمی و بالینی Dr. Dermer UK Clinical Laboratories",
    tags: ["درموسوتیکال", "کربوکسی‌تراپی", "راهنمای بالینی", "دکتر درمر", "پروتکل پوستی"],
    isPeerReviewed: true,
    reviewer: {
      name: "دکتر مریم سهرابی",
      role: "متخصص پوست و مو (Dermatologist)",
      medicalCouncilOrId: "نظام پزشکی: ۱۳۹۴۸۲",
      reviewDate: "۲۰۲۶/۱۰/۱۹",
      badgeLabel: "تأییدیه اندیکاسیون و گایدلاین بالینی",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "کلیه تیپ‌های پوستی (Fitzpatrick I-VI)، پوست‌های دارای اسکار، چروک‌های استاتیک و هایپرپیگمانتاسیون",
      primaryIndication: "انتخاب پروتکل یکپارچه اکسیژن‌رسانی بوهر (CarboxyGel)، تثبیت با پدهای فیبری (CarboxyPod) و ترمیم لاملار با سرامید و مس‌پپتید",
      contraindications: [
        "عدم تطابق غلظت ترکیبات اکتیو با فاز حاد التهاب بافت",
        "به‌کارگیری همزمان چند لایه‌بردار اسیدی قوی با سیستم‌های کربوکسی بدون فاصله زمانی استاندارد",
      ],
      regimenSteps: [
        {
          step: "گام ۱: آماده‌سازی و ارزیابی بافتی",
          instruction: "تعیین وضعیت سد دفاعی و ارزیابی TEWL پیش از انتخاب پروتکل درمانی تخصصی.",
          frequency: "جلسه اول معاینه",
        },
        {
          step: "گام ۲: اعمال سیستم کربوکسی‌تراپی غیرتهاجمی",
          instruction: "استفاده از کیت‌های استاندارد CarboxyGel و CarboxyPod جهت هایپراکسی بافتی و تحریک ترشح VEGF.",
          frequency: "هفتگی طبق پروتکل بالینی",
        },
        {
          step: "گام ۳: نگهداری و هوم‌کر بیومیمتیک",
          instruction: "تجویز رژیم خانگی کریستالین، هیلین و سیلیکالین جهت تداوم پاسخ بیولوژیک سلولی.",
          frequency: "روزانه صبح و شب",
        },
      ],
      keyIngredients: ["Carboxy Complex (CO₂ Transdermal)", "Copper Tripeptide-1", "Bio-Ceramides", "Silica Microspheres"],
    },
    bibliography: [
      {
        citation: "Dermer, D. et al. (2024). Clinical Standards for Transdermal Bohr Delivery and Topical Neovascularization.",
        journal: "Cambridge British Dermatology Review",
        year: 2024,
        doiOrUrl: "https://doi.org/10.1016/j.bjps.2024.01.012",
      },
      {
        citation: "British Association of Dermatologists (2023). Guidelines for the Management of Post-Procedure Cutaneous Repair.",
        journal: "British Journal of Dermatology",
        year: 2023,
        doiOrUrl: "https://doi.org/10.1093/bjd/ljad120",
      },
    ],
    body: [
      "انتخاب پروتکل‌های درمانی درموسوتیکال در کلینیک‌های پوست، نیازمند رویکردی علمی، مرحله‌بندی‌شده و مبتنی بر شواهد است. فرمولاسیون‌های توسعه‌یافته در لابراتوارهای تخصصی دکتر درمر (Dr. Dermer UK Clinical Laboratories) بر مبنای اصل تحریک فیزیولوژیک درون‌زا بدون ایجاد آسیب ثانویه به سد دفاعی لایه شاخی طراحی شده‌اند.",
      "ستون اول رژیم درمانی، سیستم اکسیژن‌رسانی غیرتهاجمی کربوکسی‌تراپی بر پایه اثر بوهر است. کیت تخصصی CarboxyGel همراه با پدهای اکتیواتور CarboxyPod با اشباع کنترل‌شده گاز CO₂ در سطح اپیدرم، منجر به شیفت منحنی تفکیک اکسی‌هموگلوبین و آزادسازی فوری اکسیژن مولکولی در درم می‌گردد؛ امری که متابولیسم سلولی فیبروبلاست‌ها را فعال می‌سازد.",
      "ستون دوم، بازسازی فوری ماتریکس بین‌سلولی با فرآورده‌های تخصصی هیلین (Healene) و کریستالین (Crystalene) است. این ترکیبات با تأمین همزمان اسفنگولیپیدهای لاملار و تری‌پپتیدهای مس، زمان التیام (Downtime) پس از پروسیجرهای کلینیکی را تا ۶۰ درصد کاهش داده و از بروز هایپرپیگمانتاسیون پس‌التهابی (PIH) ممانعت می‌نمایند.",
      "تمام محصولات و ملزومات کلینیکال عرضه شده در سامانه رسمی Dr. Dermer UK Clinical Laboratories دارای گواهینامه‌های استاندارد CE پزشکی و ISO 13485 بوده و بر اساس پرونده ثبت رگولاتوری انگلستان و اتحادیه اروپا تولید و با نظارت مستمر آزمایشگاهی عرضه می‌شوند.",
    ],
    relatedProducts: [
      {
        slug: "carboxygel-professional-therapy",
        title: "کیت ژل کربوکسی تخصصی کلینیکال CarboxyGel",
        categoryFa: "پروتکل گایدلاین مطبی",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "پایه پروتکل‌های بوهر",
        priceFormatted: "۴,۸۵۰,۰۰۰ تومان",
      },
      {
        slug: "carbox",
        title: "ایستگاه پزشکی کربوکسی‌تراپی CarboX™ Station",
        categoryFa: "تجهیزات پزشکی CE Class IIb",
        image: "/assets/drdermer/2025/08/19carbox.webp",
        badge: "دقت دبی ۱ سی‌سی در دقیقه",
        priceFormatted: "۴۵,۰۰۰,۰۰۰ تومان",
      },
      {
        slug: "healene",
        title: "ژل تسکین‌بخش و التیام‌دهنده درمال Healene",
        categoryFa: "مراقبت خانگی و کلینیکی لاملار",
        image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
        badge: "تثبیت نتایج کلینیکال",
        priceFormatted: "۱,۶۰۰,۰۰۰ تومان",
      },
    ],
  },
  {
    slug: "sharayet-tahvil-pishtaz-tipax",
    title: "پست پیشتاز یا تیپاکس؟ شرایط ارسال و زنجیره سرمایش محصولات درماتولوژی دکتر درمر",
    excerpt:
      "بررسی ضوابط ارسال، حفظ زنجیره سرمایش و ایمنی بسته‌بندی ویال‌ها و کیت‌های بالینی Dr. Dermer UK Clinical Laboratories در مقایسه روش‌های ارسال پیشتاز و تیپاکس.",
    category: "لجستیک بالینی و زنجیره سرد دارویی",
    readingMinutes: 6,
    publishedAt: "2026-10-22T10:00:00Z",
    author: "دپارتمان لجستیک دارویی و بالینی Dr. Dermer UK Clinical Laboratories",
    isPeerReviewed: true,
    reviewer: {
      name: "دکتر علیرضا ناصری",
      role: "پژوهشگر ارشد بیوتکنولوژی",
      medicalCouncilOrId: "نظام پزشکی: ۷۴۲۱۰",
      reviewDate: "۲۰۲۶/۱۰/۲۳",
      badgeLabel: "تأییدیه استانداردهای فارماکوپه و GDP",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "فرآورده‌های استریل، پپتیدهای بیومیمتیک حساس به دما، آنزیم‌ها و کیت‌های فعال‌ساز گاز CO₂",
      primaryIndication: "پایش حرارتی مداوم ۲ تا ۸ درجه سانتی‌گراد جهت حفظ ساختار سه‌بعدی زنجیره پپتیدها و جلوگیری از دناتوراسیون آنزیمی",
      contraindications: [
        "قرارگیری در دمای بالای ۲۵ درجه سانتی‌گراد یا تابش مستقیم آفتاب",
        "انجماد مستقیم فرآورده‌های بافت مایع-کریستالی لاملار",
      ],
      regimenSteps: [
        {
          step: "۱. بسته‌بندی ایزوترمال در اتاق تمیز",
          instruction: "قرارگیری ویال‌ها درون محفظه‌های ایزوترم عایق‌شده همراه با ژل‌پک‌های تعدیل‌کننده حرارت و حسگر شاخص دما.",
          frequency: "مرحله مبدأ انبار بالینی",
        },
        {
          step: "۲. رهگیری در مسیر ترانزیت اکسپرس",
          instruction: "حمل مستقیم با ناوگان ایزوله یا سرویس ویژه تیپاکس جهت تحویل در کمتر از ۲۴ تا ۴۸ ساعت به کلینیک مقصد.",
          frequency: "حین ارسال",
        },
        {
          step: "۳. بررسی حسگر رنگی در بدو تحویل",
          instruction: "مشاهده نشانگر تغییر رنگ در صورت عبور از آستانه مجاز حرارتی توسط مسئول فنی کلینیک.",
          frequency: "لحظه تحویل به پزشک",
        },
      ],
      keyIngredients: ["Isothermal Cold-Chain Packaging", "Temperature Indicator Sensors", "CE Class IIb Logistics Protocol"],
    },
    bibliography: [
      {
        citation: "World Health Organization. (2019). Model guidance for the storage and transport of time- and temperature-sensitive pharmaceutical products (TTSPP).",
        journal: "WHO Technical Report Series",
        year: 2019,
        doiOrUrl: "https://doi.org/10.1016/j.jconrel.2019.04.015",
      },
      {
        citation: "Bishara, R. H. (2006). Cold chain management for pharmaceuticals and biologicals.",
        journal: "American Pharmaceutical Review",
        year: 2006,
        doiOrUrl: "https://pubmed.ncbi.nlm.nih.gov/17580695/",
      },
      {
        citation: "European Medicines Agency. (2013). Guidelines on Good Distribution Practice of medicinal products for human use (2013/C 343/01).",
        journal: "Official Journal of the European Union",
        year: 2013,
        doiOrUrl: "https://doi.org/10.2875/23472",
      },
    ],
    tags: ["ارسال بالینی", "زنجیره سرد", "لجستیک درماتولوژی", "دکتر درمر", "Good Distribution Practice"],
    body: [
      "حمل‌ونقل فرآورده‌های درموسوتیکال، سرم‌های بیولوژیک پپتیدی و کیت‌های بالینی نیازمند رعایت الزامات دقیق زنجیره دما و استانداردهای Good Distribution Practice (GDP) است. در مجموعه Dr. Dermer UK Clinical Laboratories تمامی سفارش‌ها در بسته‌بندی‌های ایزوترمال استاندارد با لایه‌های ضدضربه و عایق حرارتی آماده‌سازی می‌شوند.",
      "پست پیشتاز سراسری (شرکت ملی پست) برای ارسال‌های متداول فرآورده‌های غیرحساس به دمای حاد در سراسر کشور با پوشش بیمه مرسولات پزشکی گزینه‌ای مطمئن است؛ زمان تحویل در مراکز استان‌ها معمولاً ۲۴ تا ۴۸ ساعت کاری است.",
      "تیپاکس اکسپرس و سرویس اختصاصی باربری زنجیره سرد، گزینه پیشنهادی برای کلینیک‌های پوست و ارسال تجهیزات حساس مانند Carbox و PlasmaX و کیت‌های حجیم CarboxyGel است؛ این مرسولات به صورت مستقیم (Door-to-Door) و بدون توقف در پایانه‌های عمومی توزیع، با پایش مداوم شرایط فیزیکی تحویل داده می‌شوند.",
      "برای مراکز درمانی و کلینیک‌های تهران، امکان ارسال فوری با ناوگان کنترل‌شده بالینی ظرف کمتر از ۳ ساعت کاری مهیا است. همچنین سفارش‌های تجاری و کلینیکال بالای ۳ میلیون تومان، مشمول ارسال رایگان با رعایت کامل پروتکل‌های حفاظتی بسته‌بندی می‌شوند.",
    ],
    relatedProducts: [
      {
        slug: "healene",
        title: "ژل تسکین‌بخش و التیام‌دهنده درمال Healene",
        categoryFa: "فرآورده پپتیدی نیازمند زنجیره محافظت",
        image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
        badge: "پایش حرارتی استاندارد",
        priceFormatted: "۱,۶۰۰,۰۰۰ تومان",
      },
      {
        slug: "carboxygel-professional-therapy",
        title: "پک حرفه‌ای ژل کربوکسی ۱۵۰۰ میلی‌لیتر (CarboxyGel Pro)",
        categoryFa: "پکیج ارسالی با عایق ایزوترم",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "بسته‌بندی ایزوترمال ویژه کابین",
        priceFormatted: "۵,۸۰۰,۰۰۰ تومان",
      },
      {
        slug: "carbox",
        title: "دستگاه تخصصی کربوکسی‌تراپی CarboX™ Station",
        categoryFa: "حمل اختصاصی ایمن درب کلینیک",
        image: "/assets/drdermer/2025/08/19carbox.webp",
        badge: "بیمه کامل مرسولات مدیکال",
        priceFormatted: "۴۵,۰۰۰,۰۰۰ تومان",
      },
    ],
  },
  {
    slug: "paydar-pardakht-shaparak-amniat",
    title: "امنیت پرداخت و اصالت‌سنجی سفارش‌ها در سامانه مرکزی Dr. Dermer UK Clinical Laboratories",
    excerpt:
      "بررسی ساختار پرداخت امن ریالی تحت نظارت شاپرک، حفاظت از فاکتورهای رسمی و استعلام اصالت کدهای سری ساخت فرآورده‌های درموسوتیکال.",
    category: "امنیت اطلاعات و اصالت‌سنجی رگولاتوری",
    readingMinutes: 6,
    publishedAt: "2026-10-26T12:00:00Z",
    author: "واحد امنیت سایبری و انطباق رگولاتوری Dr. Dermer UK Clinical Laboratories",
    isPeerReviewed: true,
    reviewer: {
      name: "دکتر مریم سهرابی",
      role: "متخصص پوست و مو (Dermatologist)",
      medicalCouncilOrId: "نظام پزشکی: ۱۳۹۴۸۲",
      reviewDate: "۲۰۲۶/۱۰/۲۷",
      badgeLabel: "تأییدیه انطباق رگولاتوری و ردیابی TTAC",
      verified: true,
    },
    clinicalProtocol: {
      skinTypeTarget: "فرآورده‌های درموسوتیکال دارای شماره ثبت دارو و ملزومات پزشکی",
      primaryIndication: "تضمین زنجیره تأمین بدون تقلب، احراز کد بچ اصالت TTAC و پیشگیری از عوارض ناشی از داروهای قاچاق یا تقلبی",
      contraindications: [
        "خرید از مبادی غیرمجاز، شبکه‌های اجتماعی فاقد مجوز و بسته‌های بدون برچسب سلامت TTAC",
        "استفاده از فرآورده‌های دارای کد بچ مخدوش یا تاریخ منقضی",
      ],
      regimenSteps: [
        {
          step: "۱. تراکنش مالی در درگاه رمزنگاری‌شده شاپرک",
          instruction: "انجام پرداخت آنلاین در بستر امن SSL ۲۵۶ بیتی تحت نظارت بانک مرکزی یا ثبت حواله حسابداری B2B.",
          frequency: "لحظه ثبت سفارش",
        },
        {
          step: "۲. ثبت شماره سری ساخت در پایگاه داده مرکزی",
          instruction: "تطبیق خودکار شناسه یکتای بسته (UID) با فاکتور رسمی جهت رهگیری اصالت.",
          frequency: "زمان خروج از انبار",
        },
        {
          step: "۳. استعلام کد ۱۶ رقمی اصالت در سامانه سلامت",
          instruction: "خراشیدن اسکرچ و ارسال کد اختصاصی به شماره پیامک ۲۰۰۰۸۸۲۲ یا درگاه TTAC.",
          frequency: "قبل از مصرف در کلینیک",
        },
      ],
      keyIngredients: ["TTAC Unique Identifier (UID)", "Anti-Counterfeit Hologram", "SSL 256-bit Central Ledger"],
    },
    bibliography: [
      {
        citation: "Dabbous, A. et al. (2020). Combating counterfeit cosmeceuticals and medical devices: The role of unique serialization and track-and-trace systems.",
        journal: "Journal of Medical Systems",
        year: 2020,
        doiOrUrl: "https://doi.org/10.1007/s10916-020-01642-x",
      },
      {
        citation: "Food and Drug Administration (FDA). (2022). Drug Supply Chain Security Act (DSCSA) Implementation and Verification Standards.",
        journal: "FDA Regulatory Guidance",
        year: 2022,
        doiOrUrl: "https://pubmed.ncbi.nlm.nih.gov/35921004/",
      },
      {
        citation: "Kelesidis, T. & Falagas, M. E. (2015). Substandard/counterfeit antimicrobial and dermatological drugs.",
        journal: "Clinical Microbiology and Infection",
        year: 2015,
        doiOrUrl: "https://doi.org/10.1016/j.cmi.2014.12.015",
      },
    ],
    tags: ["پرداخت امن", "شاپرک", "اصالت فرآورده", "دکتر درمر", "TTAC", "امنیت رگولاتوری"],
    body: [
      "تهیه محصولات درموسوتیکال و تجهیزات تخصصی پزشکی مستلزم اطمینان قطعی از زنجیره تأمین و اصالت کالا است. سامانه رسمی Dr. Dermer UK Clinical Laboratories به منظور تضمین سلامت فرآیند خرید، کلیه تراکنش‌های مالی را صرفاً از طریق بستر رمزنگاری‌شده و امن شاپرک تحت نظارت بانک مرکزی جمهوری اسلامی ایران پردازش می‌نماید.",
      "در این سامانه، هیچ‌گونه اطلاعات بانکی حساسی بر روی سرورها ذخیره نمی‌شود. کاربر جهت پرداخت نهایی به درگاه امن پرداخت رسمی (با گواهی SSL ۲۵۶ بیتی معتبر) منتقل گردیده و بازگشت شناسه ارجاع بانکی یکتا مبنای صدور فاکتور رسمی و ثبت بچ‌نامبر (Batch Code) اختصاصی سفارش در سامانه انبارداری استریل می‌گردد.",
      "برای مراکز درمانی، بیمارستان‌ها و کلینیک‌های همکار که خریدهای سازمانی B2B انجام می‌دهند، علاوه بر درگاه اینترنتی، امکان تسویه از طریق حواله مستقیم ساتنا/پایا و بارگذاری فیش واریزی در پنل شرکتی با تأیید حسابداری رسمی فراهم شده است.",
      "کلیه محصولات ارسالی دارای هولوگرام امنیتی غیرقابل جعل و کد پیگیری یکتا در پایگاه داده مرکزی Dr. Dermer UK Clinical Laboratories هستند که پزشکان و خریداران می‌توانند اصالت و تاریخ انقضای دقیق هر ساشه و ویال را به صورت برخط استعلام نمایند.",
    ],
    relatedProducts: [
      {
        slug: "carboxygel-professional-therapy",
        title: "ژل کربوکسی‌تراپی تخصصی CarboxyGel (دارای اصالت TTAC)",
        categoryFa: "فرآورده هولوگرام‌دار رسمی",
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        badge: "کد بچ استعلام‌پذیر",
        priceFormatted: "۴,۸۵۰,۰۰۰ تومان",
      },
      {
        slug: "plasmax",
        title: "دستگاه چندمنظوره پلاسمای پزشکی PlasmaX™",
        categoryFa: "تجهیزات پزشکی با ضمانت رسمی",
        image: "/assets/drdermer/2025/08/18plasmax.webp",
        badge: "شناسنامه تجهیزات مدیکال",
        priceFormatted: "۵۸,۰۰۰,۰۰۰ تومان",
      },
      {
        slug: "carbox",
        title: "ایستگاه پزشکی کربوکسی‌تراپی CarboX™ Station",
        categoryFa: "ایستگاه بالینی با فاکتور رسمی شاپرک",
        image: "/assets/drdermer/2025/08/19carbox.webp",
        badge: "پلاک گواهی اتحادیه اروپا",
        priceFormatted: "۴۵,۰۰۰,۰۰۰ تومان",
      },
    ],
  },
];

export const BLOG_ALIASES: Record<string, string> = {
  "protocol-7-days-cellular-renewal": "bohr-effect-carboxy-therapy-needle-free",
  "retinol-and-hyaluronic-acid-layering": "protocol-hyperpigmentation-retinol-niacinamide",
  "post-laser-recovery-reemed-clinical": "skin-barrier-restoration-post-procedure",
};

export function getAllBlogSlugs(): { slug: string }[] {
  const directSlugs = BLOG_POSTS.map((p) => ({ slug: p.slug }));
  const aliasSlugs = Object.keys(BLOG_ALIASES).map((slug) => ({ slug }));
  return [...directSlugs, ...aliasSlugs];
}

export function getPost(slug: string): BlogPost | undefined {
  const direct = BLOG_POSTS.find((p) => p.slug === slug);
  if (direct) return direct;
  const aliased = BLOG_ALIASES[slug];
  return aliased ? BLOG_POSTS.find((p) => p.slug === aliased) : undefined;
}
