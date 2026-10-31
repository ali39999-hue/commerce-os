// ── دیتاست دموی تاب‌آور کاتالوگ (W18) ──
// هر محصول اکنون `kind` (PHYSICAL | DIGITAL — ADR-012) و `vendor` اختیاری
// (ADR-011) دارد؛ فروشگاه مستقل بدون فروشنده می‌ماند (vendor: null).
export const DEMO_FALLBACK_PRODUCTS = [
  {
    id: "prod_001",
    slug: "everyday-backpack",
    title: "کوله‌پشتی روزمره ضدآب",
    titleFa: "کوله‌پشتی روزمره ضدآب",
    description: "طراحی ارگونومیک، ضدآب با جای لپ‌تاپ تا ۱۵.۶ اینچ و زیپ‌های مخفی ضدسرقت.",
    category: { slug: "bags", titleFa: "کیف و کوله‌پشتی" },
    kind: "PHYSICAL",
    vendor: null,
    variants: [
      {
        id: "var_001",
        sku: "BAG-URB-001",
        title: "مشکی کربنی",
        titleFa: "مشکی کربنی",
        priceAmount: "18500000", // 1,850,000 Tomans
        currency: "IRR",
        inStock: true,
      },
    ],
  },
  {
    id: "prod_002",
    slug: "wireless-headphones",
    title: "هدفون بی‌سیم نویزکنسلینگ",
    titleFa: "هدفون بی‌سیم نویزکنسلینگ",
    description: "صدای شفاف Hi-Res با حذف نویز فعال (ANC)، باتری ۴۰ ساعته و شارژ سریع تایپ C.",
    category: { slug: "digital", titleFa: "کالای دیجیتال و صوتی" },
    kind: "PHYSICAL",
    vendor: null,
    variants: [
      {
        id: "var_002",
        sku: "AUD-ANC-002",
        title: "خاکستری مات",
        titleFa: "خاکستری مات",
        priceAmount: "34500000", // 3,450,000 Tomans
        currency: "IRR",
        inStock: true,
      },
    ],
  },
  {
    id: "prod_003",
    slug: "desk-lamp",
    title: "چراغ مطالعه هوشمند رومیزی",
    titleFa: "چراغ مطالعه هوشمند رومیزی",
    description: "تنظیم هوشمند دمای رنگ و شدت نور، پنل لمسی، استاندارد محافظت از چشم و بدنه مینیمال آلومینیومی.",
    category: { slug: "home", titleFa: "روشنایی و دکوراسیون" },
    kind: "PHYSICAL",
    vendor: null,
    variants: [
      {
        id: "var_003",
        sku: "LMP-DSK-003",
        title: "سفید صدفی",
        titleFa: "سفید صدفی",
        priceAmount: "9400000", // 940,000 Tomans
        currency: "IRR",
        inStock: true,
      },
    ],
  },
  {
    id: "prod_004",
    slug: "ethiopian-specialty-coffee",
    title: "قهوه تخصصی اتیوپی یرگاچف ۲۵۰ گرمی",
    titleFa: "قهوه تخصصی اتیوپی یرگاچف ۲۵۰ گرمی",
    description: "دانه قهوه ۱۰۰٪ عربیکا تخصصی، برشته‌کاری تازه با طعم‌یادهای گلی، مرکباتی و اسیدیته ملایم میوه‌ای.",
    category: { slug: "coffee", titleFa: "قهوه و تجهیزات تخصصی" },
    kind: "PHYSICAL",
    vendor: { slug: "roast-coffee", titleFa: "روست قهوه" },
    variants: [
      {
        id: "var_004",
        sku: "COF-ETH-250",
        title: "دانه کامل ۲۵۰ گرم",
        titleFa: "دانه کامل ۲۵۰ گرم",
        priceAmount: "4500000", // 450,000 Tomans
        currency: "IRR",
        inStock: true,
      },
    ],
  },
  {
    id: "prod_005",
    slug: "ceramic-dripper-v60",
    title: "دریپر قهوه سرامیکی V60 سایز ۰۲",
    titleFa: "دریپر قهوه سرامیکی V60 سایز ۰۲",
    description: "سرامیک حرارتی دست‌ساز ژاپنی، جریان یکنواخت استخراج عصاره قهوه همراه با شیارهای مارپیچ استاندارد.",
    category: { slug: "coffee", titleFa: "قهوه و تجهیزات تخصصی" },
    kind: "PHYSICAL",
    vendor: { slug: "roast-coffee", titleFa: "روست قهوه" },
    variants: [
      {
        id: "var_005",
        sku: "DRP-V60-002",
        title: "سفید کلاسیک",
        titleFa: "سفید کلاسیک",
        priceAmount: "3200000", // 320,000 Tomans
        currency: "IRR",
        inStock: true,
      },
    ],
  },
  {
    id: "prod_006",
    slug: "artisan-mug",
    title: "ماگ سرامیکی دست‌ساز لعاب‌دار",
    titleFa: "ماگ سرامیکی دست‌ساز لعاب‌دار",
    description: "ماگ سفالی دست‌ساز با لعاب دورنگ نسکافه‌ای-فیروزه‌ای، مناسب برای انواع نوشیدنی‌های گرم.",
    category: { slug: "home", titleFa: "روشنایی و دکوراسیون" },
    kind: "PHYSICAL",
    vendor: null,
    variants: [
      {
        id: "var_006",
        sku: "MUG-ART-006",
        title: "فیروزه‌ای عسلی",
        titleFa: "فیروزه‌ای عسلی",
        priceAmount: "1900000", // 190,000 Tomans
        currency: "IRR",
        inStock: true,
      },
    ],
  },
  {
    id: "prod_007",
    slug: "digital-brew-guide",
    title: "کتاب الکترونیکی راهنمای جامع دم‌آوری",
    titleFa: "کتاب الکترونیکی راهنمای جامع دم‌آوری",
    description: "PDF ۱۲۰ صفحه‌ای راهنمای گام‌به‌گام دم‌آوری قهوه؛ از انتخاب دانه و نسبت‌های طلایی تا جدول‌های رفرنس روش‌های V60، فرنچ‌پرس و اسپرسو.",
    category: { slug: "coffee", titleFa: "قهوه و تجهیزات تخصصی" },
    kind: "DIGITAL",
    vendor: { slug: "brew-studio", titleFa: "استودیو دم‌آوری" },
    digitalFileUrl: "https://cdn.commerce-os.local/digital/brew-guide.pdf",
    variants: [
      {
        id: "var_007",
        sku: "EBOOK-BREW-01",
        title: "نسخه PDF",
        titleFa: "نسخه PDF",
        priceAmount: "980000", // 98,000 Tomans
        currency: "IRR",
        inStock: true,
        digitalFileUrl: "https://cdn.commerce-os.local/digital/brew-guide.pdf",
      },
    ],
  },
  {
    id: "prod_008",
    slug: "latte-art-course",
    title: "دوره ویدیویی لاته‌آرت از صفر",
    titleFa: "دوره ویدیویی لاته‌آرت از صفر",
    description: "دوره ویدیویی گام‌به‌گام لاته‌آرت از صفر تا نقش‌های حرفه‌ای؛ فایل ZIP شامل درس‌های تصویری و برگه‌های تمرین قابل چاپ.",
    category: { slug: "coffee", titleFa: "قهوه و تجهیزات تخصصی" },
    kind: "DIGITAL",
    vendor: { slug: "brew-studio", titleFa: "استودیو دم‌آوری" },
    digitalFileUrl: "https://cdn.commerce-os.local/digital/latte-art.zip",
    variants: [
      {
        id: "var_008",
        sku: "COURSE-LATTE-01",
        title: "دسترسی کامل دوره",
        titleFa: "دسترسی کامل دوره",
        priceAmount: "24500000", // 2,450,000 Tomans
        currency: "IRR",
        inStock: true,
        digitalFileUrl: "https://cdn.commerce-os.local/digital/latte-art.zip",
      },
    ],
  },
];
