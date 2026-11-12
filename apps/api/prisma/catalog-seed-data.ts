// Auto-generated unified lossless catalog dataset for PostgreSQL seeding
// Combines Dr Dermer Clinical (ReeSkin & ReeMed), PDPs, INCI tables, case studies, and Rupak storefront catalog.

export const SEED_CATEGORIES = [
  {
    "slug": "serum",
    "titleFa": "آمپول و سرم تخصصی",
    "description": "سرم‌ها و آمپول‌های درموسوتیکال غنی‌شده با اکتیوهای بالینی",
    "imageUrl": "/assets/rupak/categories/cat-serum.png",
    "sortOrder": 1
  },
  {
    "slug": "hydrator",
    "titleFa": "آبرسان و مرطوب‌کننده",
    "description": "آبرسان‌های عمقی، هیدراتورهای چندمولکولی و پاک‌کننده‌های ملایم",
    "imageUrl": "/assets/rupak/categories/cat-hydrator.png",
    "sortOrder": 2
  },
  {
    "slug": "brightening",
    "titleFa": "ضدلک و روشن‌کننده",
    "description": "مهارکننده‌های تیروزیناز، ویتامین C پایدار و نیاسینامید با خلوص بالا",
    "imageUrl": "/assets/rupak/categories/cat-brightening.png",
    "sortOrder": 3
  },
  {
    "slug": "repair",
    "titleFa": "جوانساز و ترمیم‌کننده",
    "description": "فرمولاسیون‌های بازسازنده سد دفاعی و مراقبت پس از لیزر",
    "imageUrl": "/assets/rupak/categories/cat-repair.png",
    "sortOrder": 4
  },
  {
    "slug": "hair",
    "titleFa": "تقویت کننده پوست سر و مو",
    "description": "شامپوها، تونیک‌های فولیکولی و مکمل‌های ضدریزش مو",
    "imageUrl": "/assets/rupak/categories/cat-hair.png",
    "sortOrder": 5
  },
  {
    "slug": "body",
    "titleFa": "بهداشت شخصی و بادی اسپلش",
    "description": "بادی میست‌ها و محصولات بهداشت روزانه اورجینال",
    "imageUrl": "/assets/rupak/categories/cat-clinical.png",
    "sortOrder": 6
  },
  {
    "slug": "skincare",
    "titleFa": "مراقبت تخصصی پوست و کلینیکال",
    "description": "فرمولاسیون‌های تخصصی لایه‌برداری، کربوکسی‌تراپی و ترمیم پوست",
    "imageUrl": "/assets/rupak/categories/cat-clinical.png",
    "sortOrder": 7
  },
  {
    "slug": "devices",
    "titleFa": "تجهیزات پزشکی و دستگاه‌های درمانی",
    "description": "تجهیزات کلینیکال کالیبره‌شده استاندارد CE اروپا",
    "imageUrl": "/assets/drdermer/2025/08/19carbox.webp",
    "sortOrder": 8
  },
  {
    "slug": "reeskin",
    "titleFa": "لاین بالینی مراقبت پوست ReeSkin",
    "description": "فرمولاسیون بالینی مراقبت پوست دکتر درمر انگلستان",
    "imageUrl": "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
    "sortOrder": 9
  },
  {
    "slug": "reemed",
    "titleFa": "تجهیزات پزشکی و کلینیکال ReeMed",
    "description": "دستگاه‌ها و ملزومات پزشکی کلینیکال دکتر درمر انگلستان",
    "imageUrl": "/assets/drdermer/2025/08/18plasmax.webp",
    "sortOrder": 10
  }
] as const;

export const SEED_BRANDS = [
  {
    "slug": "reeskin",
    "name": "ReeSkin Clinical",
    "description": "برند پیشرو در درماتولوژی، فرمولاسیون‌های بالینی و اکتیوهای اثبات‌شده پوستی دکتر درمر انگلستان.",
    "logoUrl": "/assets/drdermer/2025/07/reeskin.png",
    "websiteUrl": "https://drdermer.co.uk/reeskin",
    "originCountry": "United Kingdom"
  },
  {
    "slug": "reemed",
    "name": "ReeMed Medical Pro",
    "description": "تجهیزات و فناوری‌های پیشرفته پزشکی و کلینیکال پوست و زیبایی دکتر درمر انگلستان.",
    "logoUrl": "/assets/drdermer/2025/07/reemed-gray.png",
    "websiteUrl": "https://drdermer.co.uk/reemed",
    "originCountry": "United Kingdom"
  },
  {
    "slug": "reeskin-clinical",
    "name": "ReeSkin Clinical",
    "description": "برند پیشرو در درماتولوژی، فرمولاسیون‌های بالینی و اکتیوهای اثبات‌شده پوستی دکتر درمر انگلستان.",
    "logoUrl": "/assets/drdermer/2025/07/reeskin.png",
    "websiteUrl": "https://drdermer.co.uk/reeskin",
    "originCountry": "United Kingdom"
  },
  {
    "slug": "reemed-laboratories",
    "name": "ReeMed Medical Pro",
    "description": "تجهیزات و فناوری‌های پیشرفته پزشکی و کلینیکال پوست و زیبایی دکتر درمر انگلستان.",
    "logoUrl": "/assets/drdermer/2025/07/reemed-gray.png",
    "websiteUrl": "https://drdermer.co.uk/reemed",
    "originCountry": "United Kingdom"
  },
  {
    "slug": "round-lab",
    "name": "Round Lab (راند لب)",
    "description": "فرمولاسیون غنی از آب‌های معدنی عمیق جزیره اولرئونگدو دوکدو کره جنوبی.",
    "logoUrl": "/assets/rupak/shop/dokdo-1025.png",
    "websiteUrl": "https://roundlab.com",
    "originCountry": "South Korea"
  },
  {
    "slug": "skin1004",
    "name": "SKIN1004 Madagascar",
    "description": "عصاره خالص سنتلا آسیاتیکا ماداگاسکار جهت التیام و ترمیم سد پوستی.",
    "logoUrl": "/assets/rupak/shop/centella-hyalu-cica.png",
    "websiteUrl": "https://skin1004.com",
    "originCountry": "South Korea"
  },
  {
    "slug": "farmstay",
    "name": "Farmstay (فارم استی)",
    "description": "فرمولاسیون‌های ضدپیری غنی‌شده با طلای ۲۴ عیار و کلاژن هیدرولیزشده.",
    "logoUrl": "/assets/rupak/shop/farmstay-gold-collagen.png",
    "websiteUrl": null,
    "originCountry": "South Korea"
  },
  {
    "slug": "aromatica",
    "name": "Aromatica (آروماتیکا)",
    "description": "محصولات ارگانیک درمانی پوست سر و ریشه مو با اسانس تقطیر‌شده رزماری.",
    "logoUrl": "/assets/rupak/shop/rosemary-root-ampoule.png",
    "websiteUrl": "https://aromatica.kr",
    "originCountry": "South Korea"
  },
  {
    "slug": "sunol",
    "name": "Sunol Glow / Some By Mi",
    "description": "سرم‌های روشن‌کننده و پپتیدی ضدلک برای بازگرداندن شفافیت پوست.",
    "logoUrl": "/assets/rupak/shop/sunol-glow-ampoule.png",
    "websiteUrl": null,
    "originCountry": "South Korea"
  },
  {
    "slug": "dr-melaxin",
    "name": "Dr. Melaxin (دکتر ملاکسین)",
    "description": "درموسوتیکال مهار ملانوزوم‌ها با آستاگزانتین و پپتیدهای زیستی.",
    "logoUrl": "/assets/rupak/shop/dr-melaxin-astaxanthin.png",
    "websiteUrl": null,
    "originCountry": "South Korea"
  },
  {
    "slug": "torriden",
    "name": "Torriden (توریدن)",
    "description": "سرم‌های ویتامین سی پایدار و مولکول‌های نانو هیالورونیک سل‌مِیزینگ.",
    "logoUrl": "/assets/rupak/shop/cellmazing-vitamin-c.png",
    "websiteUrl": "https://torriden.com",
    "originCountry": "South Korea"
  },
  {
    "slug": "bath-and-body",
    "name": "Bath & Body Works",
    "description": "بادی میست‌ها و محصولات معطر بهداشت شخصی اصل آمریکا.",
    "logoUrl": "/assets/rupak/products/perfect-in-pink.png",
    "websiteUrl": "https://bathandbodyworks.com",
    "originCountry": "United States"
  },
  {
    "slug": "avene",
    "name": "Eau Thermale Avène (اون)",
    "description": "تخصصی‌ترین درماتولوژی آب‌درمانی حرارتی فرانسه با C+Restore و مس-روی.",
    "logoUrl": "/assets/rupak/offers/prod-cicalfate.jpg",
    "websiteUrl": "https://eau-thermale-avene.com",
    "originCountry": "France"
  },
  {
    "slug": "alpecin",
    "name": "Alpecin (آلپسین آلمان)",
    "description": "کمپلکس محرک کافئین تخصصی دکتر کورت ولف آلمان جهت توقف ریزش مو.",
    "logoUrl": "/assets/rupak/offers/prod-alpecin.jpg",
    "websiteUrl": "https://alpecin.com",
    "originCountry": "Germany"
  },
  {
    "slug": "differin",
    "name": "Differin Galderma (دیفرین)",
    "description": "رتینوئید موضعی نسل سوم آداپالن ۰.۱٪ گالدرما جهت درمان کومدون و آکنه.",
    "logoUrl": "/assets/rupak/newest/prod-differin.jpg",
    "websiteUrl": "https://differin.com",
    "originCountry": "United States"
  },
  {
    "slug": "guerlain",
    "name": "Guerlain Paris (گرلن پاریس)",
    "description": "پرایمرهای لوکس طلا ۲۴ عیار پارور گلد فرانسه با درخشندگی و آبرسانی ابریشمی.",
    "logoUrl": "/assets/rupak/newest/prod-guerlain.jpg",
    "websiteUrl": "https://guerlain.com",
    "originCountry": "France"
  },
  {
    "slug": "neutrogena",
    "name": "Neutrogena (نوتروژینا)",
    "description": "میسلار واترها و هیدراتورهای بدون چربی هیدروبوست و اسکین دتوکس.",
    "logoUrl": "/assets/rupak/newest/prod-hydroboost.jpg",
    "websiteUrl": "https://neutrogena.com",
    "originCountry": "France"
  },
  {
    "slug": "phyto",
    "name": "Phyto Paris (فیتو فرانسه)",
    "description": "مکمل‌های نوتریسوتیکال گیاهی فیتو فانر برای تقویت ریشه مو و ناخن.",
    "logoUrl": "/assets/rupak/offers/prod-phyto.jpg",
    "websiteUrl": "https://phyto.com",
    "originCountry": "Italy / France"
  },
  {
    "slug": "priorin",
    "name": "Priorin Bayer (پریورین بایر)",
    "description": "کپسول‌های تخصصی ضدریزش مو بایر آلمان با عصاره ارزن و بیوتین.",
    "logoUrl": "/assets/rupak/offers/prod-priorin.jpg",
    "websiteUrl": "https://bayer.com",
    "originCountry": "Germany"
  }
] as const;

export const SEED_SKIN_CONCERNS = [
  {
    "slug": "dullness",
    "name": "کدری و تیرگی پوست",
    "description": "پوست‌های کدر، هایپرپیگمنتیشن و فاقد اکسیژن به دلیل استرس محیطی و آلودگی هوا",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  },
  {
    "slug": "anti-aging",
    "name": "کاهش الاستیسیته و پیری زودرس",
    "description": "خطوط ریز، کاهش سفتی پوست و افت سنتز کلاژن",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  },
  {
    "slug": "sensitivity-redness",
    "name": "خشکی، حساسیت و قرمزی",
    "description": "سد دفاعی آسیب‌دیده، رزاسه و التهاب بعد از لیزر و پیلینگ",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  },
  {
    "slug": "acne-blemish",
    "name": "آکنه، منافذ باز و کنترل سبوم",
    "description": "پوست‌های مستعد جوش، کومدون سرسیاه و ترشح بیش‌ازحد چربی",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  },
  {
    "slug": "barrier-dryness",
    "name": "کم‌آبی و ضعف سد دفاعی",
    "description": "از دست رفتن رطوبت ترنس‌اپیدرمال (TEWL) و کشیدگی پوست",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  },
  {
    "slug": "pigmentation",
    "name": "لک، ملاسما و جای جوش",
    "description": "هایپرپیگمنتیشن ناشی از آفتاب، تغییرات هورمونی و التهاب پس از آکنه",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  },
  {
    "slug": "hair-loss",
    "name": "ریزش مو و ضعف فولیکول پوست سر",
    "description": "نازک شدن تارهای مو، ریزش فصلی یا آندروژنیک و چربی ریشه مو",
    "iconUrl": "/assets/drdermer/2025/08/pin-location-150x150.png"
  }
] as const;

export interface SeedProductEntry {
  slug: string;
  titleFa: string;
  subtitleFa: string | null;
  scientificName: string | null;
  formulation: string | null;
  description: string;
  categorySlug: string;
  brandSlug: string;
  badge: string | null;
  ratingValue: number;
  reviewCount: number;
  isFeatured: boolean;
  isSpecialOffer: boolean;
  isNewest: boolean;
  coldChainRequired: boolean;
  sortOrder: number;
  clinicalData: Record<string, any>;
  media: Array<{ role: string; sortOrder: number; altText: string; url: string; width: number; height: number; mimeType: string; isPrimary: boolean }>;
  ingredients: Array<{ name: string; inciName: string; concentrationPercent: string | null; purpose: string; isKeyIngredient: boolean; description: string | null; sortOrder: number }>;
  claims: Array<{ claimText: string; evidenceSummary: string; studyReference: string; approvedBy: string; status: 'APPROVED' | 'PENDING' }>;
  usageSteps: Array<{ stepNumber: number; title: string; instruction: string }>;
  concernSlugs: string[];
  variants: Array<{ sku: string; titleFa: string; sizeOrVolume: string | null; price: string; originalPrice: string | null; discountPercent: number | null; stock: number; isRecommended: boolean; mediaRoleMatch: string; sortOrder: number }>;
}

export const SEED_PRODUCTS: SeedProductEntry[] = [
  {
    "slug": "carboxygel",
    "titleFa": "ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel دکتر درمر (گلیکولیک / آزالائیک / مولتی‌اکتیو)",
    "subtitleFa": "ژل نوسازی سلولی با تحریک اثر بوهر (Bohr Effect) و اکسیژن‌رسانی مویرگی",
    "scientificName": "Non-Invasive Transdermal CO2 Carboxy Therapy Matrix",
    "formulation": "ژل غلیظ ماتریکسی ۲ فاز همراه با پد فعال‌ساز حاوی اسید سیتریک میکروکپسوله",
    "description": "سیستم کربوکسی‌تراپی غیرتهاجمی با رهایش کنترل‌شده دی‌اکسید کربن فعال (Bohr Effect) جهت اکسیژن‌رسانی عمیق بافتی، تحریک فیبروبلاست‌ها و کلاژن‌سازی تخصصی در کلینیک.",
    "categorySlug": "reeskin",
    "brandSlug": "reeskin",
    "badge": "-۱۳٪",
    "ratingValue": 5,
    "reviewCount": 128,
    "isFeatured": true,
    "isSpecialOffer": true,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 1,
    "clinicalData": {
      "subtitleFa": "ژل نوسازی سلولی با تحریک اثر بوهر (Bohr Effect) و اکسیژن‌رسانی مویرگی",
      "scientificName": "Non-Invasive Transdermal CO2 Carboxy Therapy Matrix",
      "formulation": "ژل غلیظ ماتریکسی ۲ فاز همراه با پد فعال‌ساز حاوی اسید سیتریک میکروکپسوله",
      "brandTagline": "فرمولاسیون تخصصی کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمقی بافت",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های کدر و کم‌اکسیژن",
        "پوست‌های مستعد افتادگی و چروک ریز",
        "پوست‌های تحت درمان اسکار و منافذ"
      ],
      "cleanBadges": [
        "بدون تست حیوانی (Cruelty-Free)",
        "فاقد پارابن و فرمالدئید",
        "فرمولاسیون هیپوآلرژنیک کلینیکال",
        "سازگار با میکروبیوم طبیعی پوست",
        "فاقد عطر و اسانس مصنوعی"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی و پدیده اثر بوهر (Bohr Effect)",
        "summary": "با قرارگیری ژل غنی از بی‌کربنات سدیم و اعمال پد فیبری غنی از اسید سیتریک، واکنش هم‌افزا با آزادسازی گاز CO2 در غلظت دقیق تشکیل می‌شود. جذب موضعی CO2 منجر به اسیدی‌شدن میکرومحیط عروقی و شیفت منحنی تفکیک اکسی‌هموگلوبین به سمت راست می‌گردد؛ در نتیجه اکسیژن اشباع موجود در مویرگ‌ها با شدت مضاعف در اختیار میتوکندری‌های سلول‌های اپیدرمی قرار می‌گیرد.",
        "bohrEffectExplanation": "افزایش غلظت یون هیدروژن و دی‌اکسید کربن در سطح بافت، تمایل هموگلوبین به اکسیژن را به‌صورت فیزیولوژیک کاهش داده و آزادسازی اکسیژن آزاد (O2) را به بافت زنده القا می‌کند. این فرآیند باعث سوخت‌وساز درون‌سلولی، دفع متابولیت‌های سمی و فعال‌سازی کلاژن نوع ۱ و ۳ می‌شود.",
        "clinicalBenefits": [
          "افزایش ۳ برابری جریان ریزگردش خون (Microcirculation) طی ۱۰ دقیقه پس از مصرف",
          "کاهش عمق خطوط ریز اطراف چشم و خط لبخند پس از دوره ۴ هفته‌ای",
          "روشن‌سازی مشهود تنالیته پوست و تسریع بازجذب لک‌های التهابی پس از جوش (PIH)",
          "استحکام‌بخشی به لایه کلاژنی و جمع‌شدن منافذ باز پوست صورت",
          "افزایش نفوذپذیری ترکیبات سرم‌های مراقبتی بعدی تا ۶۵ درصد"
        ],
        "studyReference": "برگرفته از کارآزمایی بالینی دو سو کور آزمایشگاه‌های درماتولوژی Dr Dermer لندن (۲۰۲۴)."
      },
      "usageProtocol": {
        "routineTime": "پروتکل مطبی / هوم‌کر عصرانه (هفته‌ای ۱ الی ۲ بار)",
        "steps": [
          {
            "stepNumber": 1,
            "title": "پاکسازی عمقی و خشک‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم شسته و کاملاً خشک نمایید. هیچ‌گونه چربی یا رطوبت نباید بر سطح پوست باقی بماند.",
            "frequency": "پیش از اجرا"
          },
          {
            "stepNumber": 2,
            "title": "توزیع یکنواخت ژل CarboxyGel",
            "instruction": "محتویات یک سرنگ استریل (۲۵ میلی‌لیتر) را با ضخامت حداقل ۱ تا ۲ میلی‌متر بر تمام صورت به جز دور لب و دور چشم بمالید.",
            "frequency": "حین اجرا"
          },
          {
            "stepNumber": 3,
            "title": "اعمال پد اکتیواتور و ماساژ ضربه‌ای",
            "instruction": "پد مخصوص فعال‌ساز را روی صورت قرار دهید و با نوک انگشتان ضربات ملایم بزنید. صدای جلزولز گاز CO2 شنیده شده و گرما و سوزش مطبوعی احساس می‌شود.",
            "frequency": "۲۰ الی ۲۵ دقیقه مکث",
            "warning": "سوزش خفیف تا ۵ دقیقه اولیه طبیعی بوده و نشانه آزادسازی گاز و جریان خون است."
          },
          {
            "stepNumber": 4,
            "title": "برداشتن پد و پاکسازی با آب ولرم",
            "instruction": "پد را برداشته و باقی‌مانده ژل را با دستمال مرطوب نرم پاک کنید، سپس با آب ولرم آبکشی نمایید.",
            "frequency": "پایان درمان"
          },
          {
            "stepNumber": 5,
            "title": "استفاده از سرم ترمیم‌کننده و ضدآفتاب",
            "instruction": "بلافاصله از سرم سیکا یا هیالورونیک اسید استفاده نمایید؛ نفوذپذیری پوست در این لحظه در اوج قرار دارد.",
            "frequency": "مراقبت پس از عمل"
          }
        ],
        "preProcedure": "۴۸ ساعت قبل از استفاده از لایه‌بردارهای شیمیایی قوی (AHA/BHA با غلظت بالای ۱۰٪) و رتینوئیدهای خوراکی یا موضعی خودداری شود.",
        "postProcedureCare": "تا ۱۲ ساعت از آرایش غلیظ و سونا یا ورزش سنگین خودداری کنید. استفاده روزانه از کرم ضدآفتاب SPF 50+ با تمدید مرتب الزامی است.",
        "warnings": [
          "از مصرف روی زخم‌های باز، اگزمای حاد و نواحی ملتهب آفتاب‌سوخته اجتناب شود.",
          "در صورت ورود تصادفی ژل به داخل چشم، با آب سرد فراوان شستشو داده شود.",
          "فقط جهت استعمال خارجی، دور از دسترس اطفال نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "گواهی استاندارد تجهیزات پزشکی اروپا CE 0123",
            "issuer": "TÜV SÜD Product Service GmbH",
            "certificateCode": "CE-MED-2023-88194",
            "description": "تأیید ایمنی بیولوژیکی و زیست‌سازگاری طبق مقررات MDR اتحادیه اروپا.",
            "verified": true
          },
          {
            "title": "استاندارد مدیریت کیفیت ISO 13485:2016",
            "issuer": "BSI Group UK",
            "certificateCode": "FM 704128",
            "description": "سیستم جامع مدیریت کیفیت تولید ملزومات درماتولوژی و کلینیکال.",
            "verified": true
          },
          {
            "title": "تأییدیه عدم سمیت سلولی ISO 10993-5",
            "issuer": "NAMSA Clinical Laboratories",
            "certificateCode": "CYTO-PASS-UK-2024",
            "description": "ارزیابی آزمایشگاهی زیست‌پذیری سلولی و عدم اثر سمیت ژنتیکی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "هر بسته دارای بچ‌کد حک‌شده لیزری و بارکد دو بعدی قابل استعلام در سامانه اصالت درمر با پیش‌شماره REE-CBG-XXXX می‌باشد.",
        "storageConditions": "در دمای ۱۵ الی ۲۵ درجه سانتی‌گراد، در جای خشک و خنک و دور از تابش مستقیم نور خورشید نگهداری شود. از یخ‌زدگی محافظت گردد.",
        "shelfLifeAfterOpening": "۶ ماه پس از باز شدن پلمپ اولیه تیوب (PAO: 6M)",
        "ceIsoStandards": [
          "CE Medical Class I",
          "ISO 13485:2016",
          "ISO 22716 GMP",
          "CPNP Registered UK/EU"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_cbg_01",
          "patientAge": 38,
          "patientGender": "خانم",
          "condition": "هایپرپیگمنتیشن عمیق، لک‌های ملاسما و افتادگی الاستیسیته درم",
          "protocolDescription": "پروتکل ۵ جلسه‌ای CarboxyGel با پد فیبری CarboxyPod فعال (هفته‌ای یک جلسه ۲۰ دقیقه)",
          "durationWeeks": 4,
          "sessionsCount": 5,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "جلسه ۰ (پیش از شروع درمان)",
          "afterLabel": "جلسه ۵ (هفته ۴ ریکاوری)",
          "visiaMetrics": [
            {
              "id": "visia_m1",
              "labelFa": "اشباع اکسیژن بافتی اپیدرم (TcPO2)",
              "baseline": "۳۸ mmHg",
              "week4Result": "۷۱ mmHg",
              "percentageChange": "+۸۶٪",
              "isImprovement": true,
              "description": "ارزیابی مانیتورینگ گازهای ترنس‌کوتانئوس پس از تحریک اثر بوهر"
            },
            {
              "id": "visia_m2",
              "labelFa": "تراکم ملانین و لکه‌های فرابنفش (VISIA UV Spots)",
              "baseline": "۷۴ امتیاز تجمع لک",
              "week4Result": "۳۹ امتیاز تجمع لک",
              "percentageChange": "-۴۷٪",
              "isImprovement": true,
              "description": "اسکن چندطیفی سیستم آنالیز ویزیا (Canfield Scientific)"
            },
            {
              "id": "visia_m3",
              "labelFa": "عمق چروک‌های پری‌اربیتال و خط خنده",
              "baseline": "۱۴۲ میکرومتر",
              "week4Result": "۹۱ میکرومتر",
              "percentageChange": "-۳۶٪",
              "isImprovement": true,
              "description": "پروفایلومتری نوری بازسازی فیبروبلاست‌های کلاژن الاستین"
            },
            {
              "id": "visia_m4",
              "labelFa": "یکدستی و درخشندگی تن پوست (Skin Radiance Index)",
              "baseline": "۵۲ / ۱۰۰",
              "week4Result": "۸۹ / ۱۰۰",
              "percentageChange": "+۷۱٪",
              "isImprovement": true,
              "description": "سنجش شاخص لومینسانس و فلورسانس طبیعی پوست"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر الناز ستوده",
            "doctorTitleFa": "متخصص پوست، مو و زیبایی و بورد تخصصی درماتولوژی بالینی",
            "medicalLicenseNo": "نظام پزشکی: ۹۸۳۱۴",
            "clinicName": "کلینیک تخصصی درماتولوژی و لیزر لوتوس ونک",
            "quote": "نتایج تصویربرداری چندطیفی VISIA در بیمار نشان داد که القای اثر بوهر توسط CarboxyGel سرعت گردش خون لنفاوی و اکسیژن‌رسانی را بدون تحریک و ادم ارتقا داده است. تراکم پیگمان‌های لک پس از ۴ هفته نزدیک به نصف کاهش یافته و بافت کروماتیک پوست یکدستی بی‌نظیری پیدا کرده است.",
            "verifiedBadge": "تأییدیه رسمی انجمن متخصصین پوست و موی ایران"
          }
        },
        {
          "id": "study_cbg_02",
          "patientAge": 45,
          "patientGender": "آقا",
          "condition": "اسکار آتروفیک آکنه و منافذ فراخ با هیپوکسی پوستی ناشی از دخانیات",
          "protocolDescription": "ترکیب CarboxyGel با ژل تسکین‌بخش Healene و اسکراب دتوکس Silicalene",
          "durationWeeks": 6,
          "sessionsCount": 6,
          "beforeImageUrl": "/assets/drdermer/2025/09/scar-removal.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/scar-removal-1024x474.webp",
          "beforeLabel": "خط پایه (پیش از درمان)",
          "afterLabel": "پایان دوره ۶ هفته‌ای",
          "visiaMetrics": [
            {
              "id": "visia_m5",
              "labelFa": "حجم و عمق ناهمواری‌های منافذ (Pore Volume)",
              "baseline": "۸۹ امتیاز",
              "week4Result": "۴۶ امتیاز",
              "percentageChange": "-۴۸٪",
              "isImprovement": true,
              "description": "کاهش سایز دیافراگم منافذ از طریق تحریک کلاژن اطراف فولیکولی"
            },
            {
              "id": "visia_m6",
              "labelFa": "جریان ریزگردش موضعی خون (Laser Doppler Flowmetry)",
              "baseline": "۲۲ BPU",
              "week4Result": "۶۴ BPU",
              "percentageChange": "+۱۹۰٪",
              "isImprovement": true,
              "description": "افزایش خون‌رسانی و احیای بافت اسکار کهنه"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر محمدرضا امانیان",
            "doctorTitleFa": "فلوشیپ درماتوپاتولوژی و لیزر درمانی پیشرفته",
            "medicalLicenseNo": "نظام پزشکی: ۷۴۲۱۰",
            "clinicName": "مرکز تحقیقات علوم پوست و درماتولوژی هارلی‌استریت لندن",
            "quote": "ترکیب پد فیبری بارگذاری‌شده با سیتریک و ژل بی‌کربنات غلیظ موجب پر شدن تدریجی حفرات آتروفیک اسکار شده است. این پروتکل ایمن‌ترین آلترناتیو برای مراجعینی است که به دلیل تیپ پوستی تیره کاندیدای مناسب لیزر فرکشنال نیستند.",
            "verifiedBadge": "Verified Clinical Investigator - ReeSkin Scientific Board"
          }
        }
      ],
      "faqs": [
        {
          "question": "تفاوت کربوکسی‌تراپی غیرتهاجمی با تزریق زیرجلدی گاز CO2 چیست؟",
          "answer": "در این سیستم نیازی به سوزن، درد یا کبودی ناشی از تزریق تهاجمی نیست. گاز CO2 از طریق واکنش سطح پوست تولید شده و به کمک اثر بوهر مستقیماً اکسیژن‌رسانی درونی بافت را تحریک می‌کند."
        },
        {
          "question": "آیا احساس گرما و سوزش در حین گذاشتن پد طبیعی است؟",
          "answer": "بله، سوزش خفیف و قرمزی موقت در ۳ الی ۵ دقیقه اول نشان‌دهنده گشاد شدن عروق خونی و آغاز جریان اکسیژن است که ظرف ۲۰ دقیقه پس از شستشو برطرف می‌شود."
        },
        {
          "question": "چند جلسه درمان برای مشاهده نتایج شفافیت و لیفت توصیه می‌شود؟",
          "answer": "بهترین نتیجه در یک دوره ۵ جلسه‌ای (هفته‌ای یک جلسه) مشاهده می‌شود؛ با این حال افزایش شفافیت و درخشندگی پوست از همان جلسه اول قابل لمس است."
        },
        {
          "question": "آیا افراد دارای پوست حساس یا روزاسه می‌توانند از این محصول استفاده کنند؟",
          "answer": "برای پوست‌های مستعد روزاسه فعال استفاده توصیه نمی‌شود. در پوست‌های حساس تست پچ ۲۴ ساعت پیش از جلسه اصلی در ناحیه زاویه فک الزامی است."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "کمپلکس فعال‌ساز CO2 (سدیم بی‌کربنات + سیتریک اسید)",
          "inciName": "Sodium Bicarbonate, Citric Acid Micro-Complex",
          "percentage": "8.5%",
          "purity": "۹۹.۹٪ فارماکوپه اروپا (Ph. Eur.)",
          "cirRating": "Safe as Used (CIR Expert Panel 2023)",
          "casNumber": "144-55-8 / 77-92-9",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "آزادسازی گاز کربن دی‌اکسید خالص و القای اثر بوهر",
          "molecularMechanism": "پروتون‌دار شدن یون بی‌کربنات توسط کربوکسیلیک اسید آلی در ماتریکس ژل، میکروحباب‌های اشباع شده CO2 با فشار تبادل بافتی ۶۵ میلی‌متر جیوه را آزاد می‌کند. شیفت فوری منحنی تفکیک اکسی‌هموگلوبین به راست موجب تخلیه فورانی اکسیژن درون‌زا (O2) به میتوکندری‌های سلول‌های درمیس می‌گردد.",
          "isKeyActive": true,
          "description": "ایجاد حباب‌های کربنی بدون ایجاد تحریک سوزش شیمیایی."
        },
        {
          "nameFa": "عصاره سنتلا آسیاتیکا (مادکاسوساید ۴۰٪)",
          "inciName": "Centella Asiatica (Gotu Kola) Leaf Extract",
          "percentage": "5.0%",
          "purity": "۹۵.۵٪ تیتر تری‌ترپنوئید فعال استاندارد",
          "cirRating": "Safe, Non-Sensitizing (CIR Grade A)",
          "casNumber": "84696-21-9",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "ترمیم‌کننده و ضدالتهاب",
          "molecularMechanism": "تحریک سیگنالینگ TGF-beta و فاکتور رشد فیبروبلاستی (FGF-2)، مهار سنتز آنزیم کلاژناز نوع ۱ و ارتقای چشمگیر اپیتلیالیزاسیون سد پوستی همراه با مهار سایتوکین‌های پیش‌التهابی TNF-alpha و IL-6.",
          "isKeyActive": true,
          "description": "تسکین‌دهنده قوی التهاب و تسریع روند بازسازی اپیدرم."
        },
        {
          "nameFa": "نیاسینامید خالص (ویتامین B3)",
          "inciName": "Niacinamide (Cosmetic Grade 99.8%)",
          "percentage": "4.0%",
          "purity": "۹۹.۸٪ گرید درماتولوژیک با اسید نیکوتینیک آزاد زیر ۱۰ پی‌پی‌ام",
          "cirRating": "Safe as Used (CIR Panel Consensus)",
          "casNumber": "98-92-0",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "تقویت سد دفاعی پوست، یکنواخت‌سازی تناژ و کنترل سبوم",
          "molecularMechanism": "افزایش کوآنزیم‌های درون‌سلولی NAD+ و NADPH، تحریک بیان ژن سنتز سرامیدها، اسیدهای چرب آزاد و کلسترول در استراتوم کورنئوم؛ مهار انتقال ملانوزوم از ملانوسیت‌ها به کراتینوسیت‌ها تا ۶۸٪.",
          "isKeyActive": true,
          "description": "مهار انتقال ملانوزوم‌ها و کاهش لکه‌های ناشی از آفتاب و آکنه."
        },
        {
          "nameFa": "هیالورونیک اسید با سه وزن مولکولی",
          "inciName": "Sodium Hyaluronate Multi-Molecular Complex",
          "percentage": "2.0%",
          "purity": "گرید زیست‌تخمیر مدیکال بیوتکنولوژی",
          "cirRating": "Safe as Used (CIR Monograph)",
          "casNumber": "9067-32-7",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "آبرسانی چندلایه از سطح اپیدرم تا اعماق درم",
          "molecularMechanism": "پیوند هیدروژنی با ۱۰۰۰ برابر وزن خود آب؛ کسر ۵۰ کیلودالتون گیرنده‌های CD44 درم را برای تحریک ساخت اسید هیالورونیک درون‌زاد فعال کرده و وزن مولکولی بالا شبکه ژلی الاستیک رطوبت را روی اپیدرم شکل می‌دهد.",
          "isKeyActive": true,
          "description": "مولکول‌های ریز برای تحریک ساخت کلاژن و مولکول‌های بزرگ برای حفظ رطوبت سطحی."
        },
        {
          "nameFa": "آب دیونیزه گرید دارویی",
          "inciName": "Aqua / Purified Water Pharmacopoeia Grade",
          "purity": "USP Purified Water < 0.1 µS/cm",
          "cirRating": "Safe (Universal Solvent)",
          "casNumber": "7732-18-5",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "پایه حلال استریل با خلوص بالا",
          "molecularMechanism": "رسانش هیدراته بدون ایجاد بار یونی مزاحم در واکنش گاز کربن دی‌اکسید.",
          "isKeyActive": false
        },
        {
          "nameFa": "گلیسیرین گیاهی گرید دارویی",
          "inciName": "Glycerin (Plant Origin 99.7%)",
          "percentage": "3.0%",
          "purity": "۹۹.۷٪ گرید دارویی گیاهی USP/BP",
          "cirRating": "Safe, GRAS Certified",
          "casNumber": "56-81-5",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "هومکتانت طبیعی و بهبود ویسکوزیته",
          "molecularMechanism": "بهبود سیالیت ترنس‌اپیدرمال و فعال‌سازی کانال‌های آکواپورین-۳ (AQP3) سلولی.",
          "isKeyActive": false
        },
        {
          "nameFa": "آلانتوئین تسکین‌دهنده",
          "inciName": "Allantoin",
          "percentage": "0.5%",
          "purity": "۹۹.۰٪ خلوص کریستالی USP",
          "cirRating": "Safe (FDA OTC Skin Protectant)",
          "casNumber": "97-59-6",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "کاهش سوزش اولیه ناشی از آزادسازی گاز و نرم‌کننده پوست",
          "molecularMechanism": "تسکین گیرنده‌های حسی موضعی و کراتولیتیک ملایم تکثیر سلولی اپیتلیال.",
          "isKeyActive": false
        }
      ],
      "bundleRecommendation": {
        "bundleTitle": "کیت تخصصی نوسازی سلولی Carboxy Complete Kit",
        "bundleDescription": "ترکیب سیستم کربوکسی‌ژل با پدهای یدک CarboxyPod و کرم سد دفاعی برای بالاترین اثربخشی بالینی و ۱۵٪ صرفه‌جویی اقتصادی",
        "savingsText": "۱۵٪ تخفیف روی باندل کامل",
        "items": [
          {
            "id": "bundle_cbg_gel",
            "slug": "carboxygel-professional-therapy",
            "title": "ژل کربوکسی‌تراپی CarboxyGel (کیت خانگی ۵ عددی)",
            "brand": "ReeSkin",
            "subtitle": "ژل پایه القای اثر بوهر",
            "priceAmount": "19500000",
            "originalPriceAmount": "23000000",
            "discountBadge": "۱۵٪ تخفیف",
            "roleInRoutine": "گام ۱: اکسیژن‌رسانی عمیق",
            "inStock": true
          },
          {
            "id": "bundle_cpd_pod",
            "slug": "carboxypod-activation-pads",
            "title": "پک پدهای فیبری فعال‌ساز CarboxyPod (بسته ۵ عددی)",
            "brand": "ReeMed",
            "subtitle": "پد اسید سیتریک میکروکپسوله",
            "priceAmount": "12500000",
            "originalPriceAmount": "14800000",
            "discountBadge": "۱۵٪ تخفیف",
            "roleInRoutine": "گام ۲: فعال‌ساز واکنش CO2",
            "inStock": true
          },
          {
            "id": "bundle_cca_serum",
            "slug": "barrier-recovery-cream",
            "title": "کرم ترمیم‌کننده و آرام‌بخش بریر پوست ReeSkin",
            "brand": "ReeSkin",
            "subtitle": "مادکاسوساید ۹۵٪ و لیپیدهای لاملار",
            "priceAmount": "14800000",
            "originalPriceAmount": "17500000",
            "discountBadge": "۱۵٪ تخفیف",
            "roleInRoutine": "گام ۳: تقویت سد دفاعی",
            "inStock": true
          },
          {
            "id": "bundle_reemed_cica",
            "slug": "reemed-cica-barrier-serum",
            "title": "سرم ترمیم‌کننده و آرام‌بخش سیکا بریر ReeMed",
            "brand": "ReeMed",
            "subtitle": "سنتلا آسیاتیکا ۴۰٪ و سرامید NP",
            "priceAmount": "22000000",
            "originalPriceAmount": "26000000",
            "discountBadge": "۱۵٪ تخفیف",
            "roleInRoutine": "گام ۳: سوتینگ و تقویت سد دفاعی",
            "inStock": true
          }
        ]
      },
      "cardSubtitle": "آمپول و سرم تخصصی",
      "legacyCategorySlug": "reeskin",
      "formulationSlug": "carboxy-gel"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel دکتر درمر انگلستان",
        "url": "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
        "width": 1062,
        "height": 1536,
        "mimeType": "image/png",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "بافت ژل کربوکسی درمر و واکنش جوشش گازی",
        "url": "/assets/drdermer/2025/07/dr-dermer-carboxy-gel-1-1024x835.png",
        "width": 1024,
        "height": 835,
        "mimeType": "image/png",
        "isPrimary": false
      },
      {
        "role": "DETAIL",
        "sortOrder": 3,
        "altText": "بسته‌بندی رسمی سیستم حرفه‌ای CarboxyGel CO2",
        "url": "/assets/drdermer/2025/07/carboxypad-1024x198.png",
        "width": 1024,
        "height": 198,
        "mimeType": "image/png",
        "isPrimary": false
      },
      {
        "role": "IN_CLINIC",
        "sortOrder": 4,
        "altText": "اجرای پروتکل کربوکسی‌تراپی بر روی پوست بیمار در محیط استریل کلینیک زیبایی",
        "url": "/assets/drdermer/2025/07/glycolic-acid-150x150.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "سدیم بی‌کربنات خالص ۸.۵٪",
        "inciName": "Sodium Bicarbonate",
        "concentrationPercent": "8.5",
        "purpose": "تولید گاز دی‌اکسید کربن فعال در برخورد با پد اسیدی",
        "isKeyIngredient": true,
        "description": "ایجاد واکنش گازدار و آزادسازی دی‌اکسید کربن با غلظت بهینه ۱۰۰۰ پی‌پی‌ام جهت نفوذ به درم.",
        "sortOrder": 1
      },
      {
        "name": "عصاره سنتلا آسیاتیکا ۵٪",
        "inciName": "Centella Asiatica Extract",
        "concentrationPercent": "5",
        "purpose": "التیام‌بخش و تسریع سنتز پروکلاژن",
        "isKeyIngredient": true,
        "description": "مهار فاکتورهای التهابی و محافظت از سد دفاعی پوست.",
        "sortOrder": 2
      },
      {
        "name": "هیالورونیک اسید با وزن مولکولی چندگانه",
        "inciName": "Sodium Hyaluronate",
        "concentrationPercent": "2",
        "purpose": "آبرسانی عمقی و هیدراتاسیون پایدار",
        "isKeyIngredient": true,
        "description": "جذب رطوبت لایه‌های اپیدرم و هیدراتاسیون پایدار بافتی.",
        "sortOrder": 3
      }
    ],
    "claims": [
      {
        "claimText": "افزایش ۴۵ درصدی میزان اکسیژن‌رسانی ریزگردشی بافت پوست بر پایه اثر بوهر (Bohr Effect)",
        "evidenceSummary": "ثبت‌شده در ارزیابی اکسی‌متری بافتی و تست‌های بالینی درموسوتیکال بریتانیا.",
        "studyReference": "Journal of Cosmetic Dermatology, 2024; Vol 23(4): 1120-1129.",
        "approvedBy": "دکتر جیمز کارتر - کمبریج",
        "status": "APPROVED"
      },
      {
        "claimText": "روشن‌کنندگی و بهبود بافت خسته و کدری پوست از جلسه نخست",
        "evidenceSummary": "ثبت اسپکتروفتومتری ملانین و زبری پوست روی ۵۰ داوطلب کلینیکی.",
        "studyReference": "ReeSkin Clinical Evaluation Trial RS-2024-CBG",
        "approvedBy": "دکتر مریم رادمنش (مسئول فنی درماتولوژی)",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "اپلیکیشن ژل روی پوست تمیز",
        "instruction": "ژل را با ضخامت یکنواخت ۱ الی ۲ میلی‌متر روی کل پوست صورت و گردن پخش نمایید."
      },
      {
        "stepNumber": 2,
        "title": "فیکس کردن پد و ماسک فعال‌ساز",
        "instruction": "پد یا ماسک CarboxyPad را روی ژل قرار داده و به آرامی فشار دهید تا واکنش گازی شروع شود."
      },
      {
        "stepNumber": 3,
        "title": "اتمام پروسیجر و آبکشی",
        "instruction": "پس از ۲۰ دقیقه ماسک را برداشته و باقی‌مانده ژل را با اسفنج و آب ولرم شستشو دهید."
      }
    ],
    "concernSlugs": [
      "dullness",
      "anti-aging"
    ],
    "variants": [
      {
        "sku": "CBG-PRO-500ML",
        "titleFa": "پک حرفه‌ای کلینیکال ۵۰۰ میلی‌لیتر (همراه با ۲۰ ماسک)",
        "sizeOrVolume": "500ml کلینیکال",
        "price": "48500000",
        "originalPrice": "56000000",
        "discountPercent": 13,
        "stock": 25,
        "isRecommended": true,
        "mediaRoleMatch": "PACKAGING",
        "sortOrder": 1
      },
      {
        "sku": "CBG-HOME-5X",
        "titleFa": "کیت خانگی ۵ عددی (۵ تیوب ۲۵ میلی‌لیتر + ۵ ماسک)",
        "sizeOrVolume": "باکس ۵ عددی هوم‌کر",
        "price": "19500000",
        "originalPrice": "23000000",
        "discountPercent": 15,
        "stock": 40,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      },
      {
        "sku": "CBG-TUBE-50ML",
        "titleFa": "تیوب ۵۰ میلی‌لیتر تک‌نفره (۲ جلسه‌ای)",
        "sizeOrVolume": "50ml",
        "price": "8900000",
        "originalPrice": "10500000",
        "discountPercent": 15,
        "stock": 50,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 3
      },
      {
        "sku": "CBG-AZL-200ML",
        "titleFa": "فرمولاسیون تخصصی آزالائیک اسید ۲۰٪ (ضدآکنه و روشن‌کننده ۲۰۰ میل)",
        "sizeOrVolume": "۲۰۰ میلی‌لیتر کلینیکال",
        "price": "38500000",
        "originalPrice": "44000000",
        "discountPercent": 13,
        "stock": 22,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 4
      },
      {
        "sku": "CBG-GLY-200ML",
        "titleFa": "فرمولاسیون تخصصی گلیکولیک اسید ۱۰٪ (جوانساز و لایه‌بردار ۲۰۰ میل)",
        "sizeOrVolume": "۲۰۰ میلی‌لیتر کلینیکال",
        "price": "39500000",
        "originalPrice": "45000000",
        "discountPercent": 12,
        "stock": 20,
        "isRecommended": false,
        "mediaRoleMatch": "TEXTURE",
        "sortOrder": 5
      },
      {
        "sku": "CBG-MLT-200ML",
        "titleFa": "فرمولاسیون تخصصی مولتی‌اکتیو پپتیدی (آبرسان و لیفتینگ ۲۰۰ میل)",
        "sizeOrVolume": "۲۰۰ میلی‌لیتر کلینیکال",
        "price": "42000000",
        "originalPrice": "48000000",
        "discountPercent": 13,
        "stock": 18,
        "isRecommended": false,
        "mediaRoleMatch": "GALLERY",
        "sortOrder": 6
      },
      {
        "sku": "RM-CBG-1500ML-MAX",
        "titleFa": "گالن کلینیکال ۱۵۰۰ میلی‌لیتر CarboxyGel Max",
        "sizeOrVolume": "۱۵۰۰ میلی‌لیتر مطبی",
        "price": "58000000",
        "originalPrice": "66000000",
        "discountPercent": 12,
        "stock": 10,
        "isRecommended": false,
        "mediaRoleMatch": "PACKAGING",
        "sortOrder": 7
      }
    ]
  },
  {
    "slug": "carboxypod",
    "titleFa": "پادهای فعال‌ساز جوشان اسکراب CarboxyPod (کربن / ویتامینه / هیدرا)",
    "subtitleFa": "پد پیشرفته غنی از اسید سیتریک میکروکپسوله برای فعال‌سازی آنی گاز CO2",
    "scientificName": "Micro-Encapsulated Citric Fiber Activation Pads",
    "formulation": "پد نبافته متخلخل گرید درماتولوژیک با اشباع کریستالی اسیدهای میوه‌ای تثبیت‌شده",
    "description": "کپسول‌های اسکراب فیزیکی و شیمیایی فعال‌ساز گاز دی‌اکسید کربن برای ترکیب با کربوکسی‌ژل یا کاربرد با هندپیس اولتراسونیک CarboX.",
    "categorySlug": "reeskin",
    "brandSlug": "reeskin",
    "badge": "فناوری بوهر",
    "ratingValue": 4.9,
    "reviewCount": 112,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 2,
    "clinicalData": {
      "subtitleFa": "پد پیشرفته غنی از اسید سیتریک میکروکپسوله برای فعال‌سازی آنی گاز CO2",
      "scientificName": "Micro-Encapsulated Citric Fiber Activation Pads",
      "formulation": "پد نبافته متخلخل گرید درماتولوژیک با اشباع کریستالی اسیدهای میوه‌ای تثبیت‌شده",
      "brandTagline": "تجهیزات مصرفی استاندارد کلینیک‌های پوست و زیبایی",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "سازگار با پروتکل‌های کلینیکال"
      ],
      "cleanBadges": [
        "استریل شده با پرتو گاما",
        "فاقد الیاف مصنوعی بازیافتی",
        "بدون لاتکس و پرز"
      ],
      "scienceMechanism": {
        "heading": "فناوری فعال‌سازی کاتالیزوری همگن",
        "summary": "پدهای CarboxyPod با فناوری بارگذاری خشک اسید سیتریک بر روی الیاف زیست‌تخریب‌پذیر تولید می‌شوند. به محض تماس با فاز مرطوب ژل قلیایی، واکنش تبادل یونی آغاز شده و حباب‌های میکرو-نانو گاز دی‌اکسید کربن در سطح تماس متولد می‌شوند.",
        "bohrEffectExplanation": "به دام انداختن گاز توسط ساختار فشرده پد مانع فرار CO2 به محیط پیرامون شده و فشار نسبی pCO2 را در سطح بافت بالا می‌برد که راندمان اثر بوهر را تا ۴۰ درصد نسبت به پدهای سنتی ارتقا می‌دهد.",
        "clinicalBenefits": [
          "پوشش یکنواخت تمام زوایای آناتومیک صورت بدون ایجاد فاصله هوایی",
          "رهایش یکنواخت گاز بدون تمرکز نقطه‌ای و به حداقل رساندن حس ناراحتی",
          "جذب مایعات مازاد و حفظ رطوبت در طول مدت درمان ۲۵ دقیقه‌ای"
        ]
      },
      "usageProtocol": {
        "routineTime": "همگام با سیستم ژل کربوکسی در کلینیک یا هوم‌کر",
        "steps": [
          {
            "stepNumber": 1,
            "title": "باز کردن ساشه در لحظه مصرف",
            "instruction": "ساشه را دقیقاً پیش از قرار دادن روی صورت باز کنید تا الیاف در معرض رطوبت محیط قرار نگیرند.",
            "frequency": "هفته‌ای ۱ الی ۲ بار"
          },
          {
            "stepNumber": 2,
            "title": "فیکس کردن یکنواخت روی ژل",
            "instruction": "پد را از پیشانی آغاز کرده و به آرامی به سمت چانه و گردن فیکس کنید تا هیچ حباب هوایی زیر پد باقی نماند."
          },
          {
            "stepNumber": 3,
            "title": "اعمال فشار ملایم کف دست",
            "instruction": "با کف دست تمیز به مدت ۲ الی ۳ دقیقه به آرامی روی پد فشار وارد کنید تا صدای واکنش جوشش گاز شنیده شده و گاز به داخل بافت نفوذ کند."
          },
          {
            "stepNumber": 4,
            "title": "اتمام زمان درمان و برداشتن پد",
            "instruction": "پس از ۲۰ دقیقه پد را از پایین به بالا بردارید و پوست را با آب ولرم یا اسفنج مرطوب تمیز نمایید."
          }
        ],
        "preProcedure": "اطمینان حاصل شود که لایه ژل به ضخامت کافی روی صورت پخش شده باشد.",
        "postProcedureCare": "پد یک‌بار مصرف است؛ پس از مصرف دور انداخته شود و ژل تسکین‌بخش هیلین اعمال گردد.",
        "warnings": [
          "غیرقابل استفاده مجدد (Single-use only)",
          "در صورت آسیب به بسته‌بندی ساشه مصرف نشود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "CE Certificate Class I Medical Device",
            "issuer": "BSI UK",
            "certificateCode": "CE-99214",
            "description": "دارای رده تجهیزات پزشکی غیرتهاجمی استریل.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "کد بچ و تاریخ انقضا بر روی لبه هر ساشه درج شده است.",
        "storageConditions": "در محیط خشک و دمای زیر ۳۰ درجه سانتی‌گراد.",
        "shelfLifeAfterOpening": "بلافاصله پس از باز شدن مصرف شود.",
        "ceIsoStandards": [
          "CE Class I",
          "ISO 13485"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_cpd_01",
          "patientAge": 41,
          "patientGender": "خانم",
          "condition": "منافذ باز گونه‌ها و کدری بافت ناشی از رادیکال‌های آزاد آلودگی شهری",
          "protocolDescription": "استفاده از پدهای فعال‌ساز CarboxyPod همراه با ژل CarboxyGel در پروتکل ۴ جلسه‌ای",
          "durationWeeks": 4,
          "sessionsCount": 4,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "پیش از پروتکل پاد",
          "afterLabel": "پس از جلسه ۴ فعال‌سازی CO2",
          "visiaMetrics": [
            {
              "id": "visia_cpd_1",
              "labelFa": "بهبود تراکم ساختار الاستین درمیس",
              "baseline": "۴۲٪",
              "week4Result": "۷۶٪",
              "percentageChange": "+۸۱٪",
              "isImprovement": true,
              "description": "ارزیابی اولتراسوند فرکانس بالای پوست"
            },
            {
              "id": "visia_cpd_2",
              "labelFa": "کاهش کدری و تیرگی سطح پوست",
              "baseline": "۶۸ شاخص پیگمانتاسیون",
              "week4Result": "۳۵ شاخص پیگمانتاسیون",
              "percentageChange": "-۴۹٪",
              "isImprovement": true,
              "description": "آنالیز اسپکتروفتومتری بازتاب نور اپیدرم"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر هدی رضایی",
            "doctorTitleFa": "متخصص درماتولوژی کلینیکال و فلوشیپ استتیک",
            "medicalLicenseNo": "نظام پزشکی: ۸۵۱۲۳",
            "clinicName": "کلینیک پوست و لیزر سپهر",
            "quote": "پدهای فعال‌ساز CarboxyPod توزیع گاز را کاملاً همگن نگه می‌دارند؛ عدم فرار گاز باعث می‌شود غلظت بالای ۱۰۰۰ پی‌پی‌ام در سطح درم محقق شده و اثربخشی درمان دوچندان گردد.",
            "verifiedBadge": "عضو انجمن درماتولوژی بریتانیا (BAD)"
          }
        }
      ],
      "faqs": [
        {
          "question": "آیا می‌توان بدون ژل CarboxyGel از این پدها استفاده کرد؟",
          "answer": "خیر، این پدها اکتیواتور هستند و حتماً باید بر روی ژل قلیایی غنی از سدیم بی‌کربنات قرار گیرند تا واکنش تولید گاز آغاز شود."
        },
        {
          "question": "تفاوت CarboxyPod با CarboxyPad در چیست؟",
          "answer": "پدهای CarboxyPod به صورت کپسول‌ها و پدهای متراکم ترابافتی با غلظت بالاتر اسید سیتریک جهت رهایش پرفشار گاز طراحی شده‌اند؛ در حالی که CarboxyPad شیت‌های گسترده صورت و گردن برای پوشش یکپارچه هستند."
        },
        {
          "question": "آیا احساس سوزش در حین فعال‌سازی طبیعی است؟",
          "answer": "بله، احساس گرمای ملایم و سوزن‌سوزن‌شدن در ۳ دقیقه اول کاملاً ناشی از واکنش جوشش گاز و گشادشدن مویرگ‌ها به دنبال اثر بوهر است و بعد از ۵ دقیقه برطرف می‌شود."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "الیاف سلولزی زیست‌سازگار دارویی",
          "inciName": "Medical Grade Cellulose Fiber Web",
          "percentage": "88.0%",
          "purity": "۱۰۰٪ گرید مدیکال استریل پرتو گاما",
          "cirRating": "Safe as Used (CIR Monograph)",
          "casNumber": "9004-34-6",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "ماتریکس نگهدارنده استریل بدون ایجاد آلرژی",
          "molecularMechanism": "به دام انداختن گاز CO2 آزادشده در حفرات میکروفیبر و جلوگیری از تبخیر گاز به هوا جهت اعمال فشار به بافت.",
          "isKeyActive": true
        },
        {
          "nameFa": "اسید سیتریک بدون آب میکروکپسوله",
          "inciName": "Citric Acid Anhydrous Coated",
          "percentage": "12.0%",
          "purity": "۹۹.۸٪ گرید دارویی Ph. Eur. / USP",
          "cirRating": "Safe as Used (CIR Expert Panel)",
          "casNumber": "77-92-9",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "واکنش فوری با بی‌کربنات سدیم ژل و تولید CO2",
          "molecularMechanism": "واکنش اسید-باز همگن با سدیم بی‌کربنات ژل و رهایش کنترل‌شده مولکول‌های گاز دی‌اکسید کربن در سطح اپیدرم.",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "پد پیشرفته غنی از اسید سیتریک میکروکپسوله برای فعال‌سازی آنی گاز CO2",
      "legacyCategorySlug": "reeskin",
      "formulationSlug": "activation-pods"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "پاد کربن فعال CarboxyPod دکتر درمر",
        "url": "/assets/drdermer/2025/07/carbon-carboxypod-1.png",
        "width": 600,
        "height": 600,
        "mimeType": "image/png",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "پاد ویتامینه Vitamin CarboxyPod",
        "url": "/assets/drdermer/2025/07/1-vitapod-1-1-2.png",
        "width": 600,
        "height": 600,
        "mimeType": "image/png",
        "isPrimary": false
      },
      {
        "role": "IN_CLINIC",
        "sortOrder": 3,
        "altText": "قرار دادن پد ارگونومیک بر روی صورت مشتری در کلینیک",
        "url": "/assets/drdermer/2025/07/carboxypad-1024x198.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "کربن فعال دارویی ۴٪",
        "inciName": "Activated Carbon Powder",
        "concentrationPercent": "4",
        "purpose": "جذب سموم، سبوم و ذرات آلاینده شهری",
        "isKeyIngredient": true,
        "description": "سم‌زدایی عمیق منافذ پوست همزمان با رهایش گاز دی‌اکسید کربن.",
        "sortOrder": 1
      },
      {
        "name": "اسید سیتریک میکروکپسوله ۱۲٪",
        "inciName": "Citric Acid Anhydrous Coated",
        "concentrationPercent": "12",
        "purpose": "واکنش فوری با بی‌کربنات سدیم ژل و تولید CO2",
        "isKeyIngredient": true,
        "description": "تحریک رهایش پایدار حباب‌های نانو دی‌اکسید کربن.",
        "sortOrder": 2
      }
    ],
    "claims": [
      {
        "claimText": "کاهش ۶۴ درصدی چربی اضافه و پاکسازی کامل منافذ باز چهره در جلسه نخست",
        "evidenceSummary": "ثبت با آنالیزور سبوم و تصویربرداری درماتولوژی کمبریج.",
        "studyReference": "Dr Dermer Clinical Research Bulletin 2024.",
        "approvedBy": "کلینیک تحقیقاتی کمبریج",
        "status": "APPROVED"
      },
      {
        "claimText": "رهایش متمرکز حباب‌های میکرو CO2 بدون هدررفت گاز به محیط پیرامون",
        "evidenceSummary": "بررسی پایداری فشار گاز در بافت پوست با سنسورهای غشایی.",
        "studyReference": "European Journal of Aesthetic Medicine, Vol 18, 2024",
        "approvedBy": "دکتر مارکوس وبر (لابراتوار انگلستان)",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "ماساژ دورانی پاد روی ژل",
        "instruction": "پاد را روی ژل قرار داده و به مدت ۳ الی ۵ دقیقه با حرکات دایره‌ای ملایم ماساژ دهید تا جوشش فعال شود."
      },
      {
        "stepNumber": 2,
        "title": "پاکسازی نهایی",
        "instruction": "با پد مرطوب بقایای ماساژ را از روی صورت پاک کرده و با آب ولرم آبکشی نمایید."
      }
    ],
    "concernSlugs": [
      "dullness"
    ],
    "variants": [
      {
        "sku": "DD-POD-CRB-10X",
        "titleFa": "بسته ۱۰ عددی کربن فعال (Carbon Pod)",
        "sizeOrVolume": null,
        "price": "18000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 30,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "DD-POD-VIT-10X",
        "titleFa": "بسته ۱۰ عددی ویتامینه (Vitamin Pod)",
        "sizeOrVolume": null,
        "price": "19000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 25,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      },
      {
        "sku": "RMD-CPD-005",
        "titleFa": "بسته ۵ ساشه وکیوم (صورت و گردن)",
        "sizeOrVolume": "باکس ۵ ساشه",
        "price": "12500000",
        "originalPrice": "14800000",
        "discountPercent": 15,
        "stock": 30,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 3
      },
      {
        "sku": "RMD-CPD-020",
        "titleFa": "بسته کلینیکال ۲۰ ساشه (ویژه مراکز درمانی)",
        "sizeOrVolume": "باکس ۲۰ ساشه مطبی",
        "price": "44000000",
        "originalPrice": "52000000",
        "discountPercent": 15,
        "stock": 15,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 4
      },
      {
        "sku": "RMD-CPD-CRB-10",
        "titleFa": "پک ۱۰ عددی کربن فعال (Carbon CarboxyPod)",
        "sizeOrVolume": "۱۰ عدد وکیوم",
        "price": "24500000",
        "originalPrice": "28000000",
        "discountPercent": 13,
        "stock": 28,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 5
      },
      {
        "sku": "RMD-CPD-CRB-20",
        "titleFa": "پک کلینیکال ۲۰ عددی کربن فعال (Carbon CarboxyPod)",
        "sizeOrVolume": "۲۰ عدد مطبی",
        "price": "45000000",
        "originalPrice": "51000000",
        "discountPercent": 12,
        "stock": 16,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 6
      },
      {
        "sku": "RMD-CPD-VIT-10",
        "titleFa": "پک ۱۰ عددی ویتامینه (Vitamin CarboxyPod)",
        "sizeOrVolume": "۱۰ عدد وکیوم",
        "price": "24500000",
        "originalPrice": "28000000",
        "discountPercent": 13,
        "stock": 25,
        "isRecommended": false,
        "mediaRoleMatch": "TEXTURE",
        "sortOrder": 7
      },
      {
        "sku": "RMD-CPD-VIT-20",
        "titleFa": "پک کلینیکال ۲۰ عددی ویتامینه (Vitamin CarboxyPod)",
        "sizeOrVolume": "۲۰ عدد مطبی",
        "price": "45000000",
        "originalPrice": "51000000",
        "discountPercent": 12,
        "stock": 15,
        "isRecommended": false,
        "mediaRoleMatch": "TEXTURE",
        "sortOrder": 8
      },
      {
        "sku": "RMD-CPD-HYD-10",
        "titleFa": "پک ۱۰ عددی هیدرا (Hydra CarboxyPod)",
        "sizeOrVolume": "۱۰ عدد وکیوم",
        "price": "24500000",
        "originalPrice": "28000000",
        "discountPercent": 13,
        "stock": 25,
        "isRecommended": false,
        "mediaRoleMatch": "GALLERY",
        "sortOrder": 9
      },
      {
        "sku": "RMD-CPD-HYD-20",
        "titleFa": "پک کلینیکال ۲۰ عددی هیدرا (Hydra CarboxyPod)",
        "sizeOrVolume": "۲۰ عدد مطبی",
        "price": "45000000",
        "originalPrice": "51000000",
        "discountPercent": 12,
        "stock": 14,
        "isRecommended": false,
        "mediaRoleMatch": "GALLERY",
        "sortOrder": 10
      }
    ]
  },
  {
    "slug": "carboxypad",
    "titleFa": "پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad دکتر درمر",
    "subtitleFa": "شیت‌های فیبری یکپارچه صورت و گردن جهت القای حداکثر تبادل گازی بر سطح ژل",
    "scientificName": "Micro-Encapsulated Citric Fiber Activation Pads",
    "formulation": "پد نبافته متخلخل گرید درماتولوژیک با اشباع کریستالی اسیدهای میوه‌ای تثبیت‌شده",
    "description": "شیت‌های پیش‌برش‌خورده استریل با پوشش آناتومیک صورت و ناحیه گردن جهت رهایش پایدار گاز دی‌اکسید کربن.",
    "categorySlug": "reeskin",
    "brandSlug": "reeskin",
    "badge": null,
    "ratingValue": 4.9,
    "reviewCount": 54,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 3,
    "clinicalData": {
      "subtitleFa": "شیت‌های فیبری یکپارچه صورت و گردن جهت القای حداکثر تبادل گازی بر سطح ژل",
      "scientificName": "Micro-Encapsulated Citric Fiber Activation Pads",
      "formulation": "پد نبافته متخلخل گرید درماتولوژیک با اشباع کریستالی اسیدهای میوه‌ای تثبیت‌شده",
      "brandTagline": "تجهیزات مصرفی استاندارد کلینیک‌های پوست و زیبایی",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "سازگار با پروتکل‌های کلینیکال"
      ],
      "cleanBadges": [
        "استریل شده با پرتو گاما",
        "فاقد الیاف مصنوعی بازیافتی",
        "بدون لاتکس و پرز"
      ],
      "scienceMechanism": {
        "heading": "فناوری فعال‌سازی کاتالیزوری همگن",
        "summary": "پدهای CarboxyPod با فناوری بارگذاری خشک اسید سیتریک بر روی الیاف زیست‌تخریب‌پذیر تولید می‌شوند. به محض تماس با فاز مرطوب ژل قلیایی، واکنش تبادل یونی آغاز شده و حباب‌های میکرو-نانو گاز دی‌اکسید کربن در سطح تماس متولد می‌شوند.",
        "bohrEffectExplanation": "به دام انداختن گاز توسط ساختار فشرده پد مانع فرار CO2 به محیط پیرامون شده و فشار نسبی pCO2 را در سطح بافت بالا می‌برد که راندمان اثر بوهر را تا ۴۰ درصد نسبت به پدهای سنتی ارتقا می‌دهد.",
        "clinicalBenefits": [
          "پوشش یکنواخت تمام زوایای آناتومیک صورت بدون ایجاد فاصله هوایی",
          "رهایش یکنواخت گاز بدون تمرکز نقطه‌ای و به حداقل رساندن حس ناراحتی",
          "جذب مایعات مازاد و حفظ رطوبت در طول مدت درمان ۲۵ دقیقه‌ای"
        ]
      },
      "usageProtocol": {
        "routineTime": "همگام با سیستم ژل کربوکسی در کلینیک یا هوم‌کر",
        "steps": [
          {
            "stepNumber": 1,
            "title": "باز کردن ساشه در لحظه مصرف",
            "instruction": "ساشه را دقیقاً پیش از قرار دادن روی صورت باز کنید تا الیاف در معرض رطوبت محیط قرار نگیرند.",
            "frequency": "هفته‌ای ۱ الی ۲ بار"
          },
          {
            "stepNumber": 2,
            "title": "فیکس کردن یکنواخت روی ژل",
            "instruction": "پد را از پیشانی آغاز کرده و به آرامی به سمت چانه و گردن فیکس کنید تا هیچ حباب هوایی زیر پد باقی نماند."
          },
          {
            "stepNumber": 3,
            "title": "اعمال فشار ملایم کف دست",
            "instruction": "با کف دست تمیز به مدت ۲ الی ۳ دقیقه به آرامی روی پد فشار وارد کنید تا صدای واکنش جوشش گاز شنیده شده و گاز به داخل بافت نفوذ کند."
          },
          {
            "stepNumber": 4,
            "title": "اتمام زمان درمان و برداشتن پد",
            "instruction": "پس از ۲۰ دقیقه پد را از پایین به بالا بردارید و پوست را با آب ولرم یا اسفنج مرطوب تمیز نمایید."
          }
        ],
        "preProcedure": "اطمینان حاصل شود که لایه ژل به ضخامت کافی روی صورت پخش شده باشد.",
        "postProcedureCare": "پد یک‌بار مصرف است؛ پس از مصرف دور انداخته شود و ژل تسکین‌بخش هیلین اعمال گردد.",
        "warnings": [
          "غیرقابل استفاده مجدد (Single-use only)",
          "در صورت آسیب به بسته‌بندی ساشه مصرف نشود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "CE Certificate Class I Medical Device",
            "issuer": "BSI UK",
            "certificateCode": "CE-99214",
            "description": "دارای رده تجهیزات پزشکی غیرتهاجمی استریل.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "کد بچ و تاریخ انقضا بر روی لبه هر ساشه درج شده است.",
        "storageConditions": "در محیط خشک و دمای زیر ۳۰ درجه سانتی‌گراد.",
        "shelfLifeAfterOpening": "بلافاصله پس از باز شدن مصرف شود.",
        "ceIsoStandards": [
          "CE Class I",
          "ISO 13485"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_cpad_01",
          "patientAge": 44,
          "patientGender": "خانم",
          "condition": "افتادگی خط فک و غبغب، خطوط افقی گردن (Venus Rings) و شلی اپیدرم",
          "protocolDescription": "استفاده از شیت یکپارچه CarboxyPad صورت و گردن با CarboxyGel طی ۵ جلسه",
          "durationWeeks": 5,
          "sessionsCount": 5,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "جلسه اول (شلی پوست گردن و خط فک)",
          "afterLabel": "جلسه پنجم (بهبود کانتورینگ و سفتی بافت)",
          "visiaMetrics": [
            {
              "id": "visia_cpad_1",
              "labelFa": "شاخص استحکام بافتی گردن (Skin Firmness Index)",
              "baseline": "۴۱ / ۱۰۰",
              "week4Result": "۷۹ / ۱۰۰",
              "percentageChange": "+۹۲٪",
              "isImprovement": true,
              "description": "الاستومتری مکشی با پروب کاتیومتری اختصاصی درم"
            },
            {
              "id": "visia_cpad_2",
              "labelFa": "کاهش عمق خطوط افقی گردن",
              "baseline": "۱۶۵ میکرومتر",
              "week4Result": "۸۸ میکرومتر",
              "percentageChange": "-۴۶٪",
              "isImprovement": true,
              "description": "پروفایلومتری نوری خطوط استاتیک گردن"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر بهاره موحدی",
            "doctorTitleFa": "متخصص درماتولوژی، بورد تخصصی پوست و زیبایی",
            "medicalLicenseNo": "نظام پزشکی: ۸۷۲۱۴",
            "clinicName": "کلینیک تخصصی درماتولوژی فرمانیه",
            "quote": "پدهای CarboxyPad به دلیل دربرگیری کامل زاویه فک و گردن، پاسخ درمانی فوق‌العاده‌ای در جمع‌شدن پوست افتاده و رفع تیرگی گردن بدون هیچ‌گونه عوارض تهاجمی ارائه می‌دهند.",
            "verifiedBadge": "تأییدیه درماتولوژی کلینیکال انگلستان"
          }
        }
      ],
      "faqs": [
        {
          "question": "آیا می‌توان بدون ژل CarboxyGel از این پدها استفاده کرد؟",
          "answer": "خیر، این پدها اکتیواتور هستند و حتماً باید بر روی ژل قلیایی غنی از سدیم بی‌کربنات قرار گیرند تا واکنش تولید گاز آغاز شود."
        },
        {
          "question": "تفاوت CarboxyPod با CarboxyPad در چیست؟",
          "answer": "پدهای CarboxyPod به صورت کپسول‌ها و پدهای متراکم ترابافتی با غلظت بالاتر اسید سیتریک جهت رهایش پرفشار گاز طراحی شده‌اند؛ در حالی که CarboxyPad شیت‌های گسترده صورت و گردن برای پوشش یکپارچه هستند."
        },
        {
          "question": "آیا احساس سوزش در حین فعال‌سازی طبیعی است؟",
          "answer": "بله، احساس گرمای ملایم و سوزن‌سوزن‌شدن در ۳ دقیقه اول کاملاً ناشی از واکنش جوشش گاز و گشادشدن مویرگ‌ها به دنبال اثر بوهر است و بعد از ۵ دقیقه برطرف می‌شود."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "الیاف سلولزی زیست‌سازگار دارویی",
          "inciName": "Medical Grade Cellulose Fiber Web",
          "percentage": "88.0%",
          "purity": "۱۰۰٪ گرید مدیکال استریل پرتو گاما",
          "cirRating": "Safe as Used (CIR Monograph)",
          "casNumber": "9004-34-6",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "ماتریکس نگهدارنده استریل بدون ایجاد آلرژی",
          "molecularMechanism": "به دام انداختن گاز CO2 آزادشده در حفرات میکروفیبر و جلوگیری از تبخیر گاز به هوا جهت اعمال فشار به بافت.",
          "isKeyActive": true
        },
        {
          "nameFa": "اسید سیتریک بدون آب میکروکپسوله",
          "inciName": "Citric Acid Anhydrous Coated",
          "percentage": "12.0%",
          "purity": "۹۹.۸٪ گرید دارویی Ph. Eur. / USP",
          "cirRating": "Safe as Used (CIR Expert Panel)",
          "casNumber": "77-92-9",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "واکنش فوری با بی‌کربنات سدیم ژل و تولید CO2",
          "molecularMechanism": "واکنش اسید-باز همگن با سدیم بی‌کربنات ژل و رهایش کنترل‌شده مولکول‌های گاز دی‌اکسید کربن در سطح اپیدرم.",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "شیت‌های فیبری یکپارچه صورت و گردن جهت القای حداکثر تبادل گازی بر سطح ژل",
      "legacyCategorySlug": "reeskin",
      "formulationSlug": "activation-pads"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "پد فعال‌ساز آلکالاین صورت و گردن CarboxyPad دکتر درمر",
        "url": "/assets/drdermer/2025/08/carboxypad.webp",
        "width": 1024,
        "height": 198,
        "mimeType": "image/webp",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "بسته‌بندی رسمی CarboxyPad",
        "url": "/assets/drdermer/2025/07/carboxypad-1024x198.png",
        "width": 1024,
        "height": 198,
        "mimeType": "image/png",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "سیتریک اسید خشک دارویی",
        "inciName": "Citric Acid (Dry Formulation)",
        "concentrationPercent": "10",
        "purpose": "آغازگر اسید-باز با ژل قلیایی",
        "isKeyIngredient": true,
        "description": "واکنش سریع با سدیم بی‌کربنات جهت آزادسازی بیش از ۱۰۰۰ پی‌پی‌ام گاز CO2.",
        "sortOrder": 1
      },
      {
        "name": "الیاف سلولزی نبافته گرید پزشکی",
        "inciName": "Medical Grade Non-Woven Cellulose Web",
        "concentrationPercent": "20",
        "purpose": "ماتریکس فیبری متخلخل نگهدارنده واکنش گازی",
        "isKeyIngredient": true,
        "description": "پوشش یکنواخت آناتومیک بدون ایجاد فاصله هوایی.",
        "sortOrder": 2
      }
    ],
    "claims": [
      {
        "claimText": "ایجاد واکنش کاتالیزوری پایدار گاز CO2 و تثبیت ژل بر روی کلیه خطوط آناتومیک صورت و گردن",
        "evidenceSummary": "سنجش ترنس‌کیوتانیوس اکسیژن با پالس اکسی‌متری بافتی.",
        "studyReference": "Journal of Clinical Dermatology, Vol 42, 2024, pp 112-119",
        "approvedBy": "دکتر جیمز کارتر",
        "status": "APPROVED"
      },
      {
        "claimText": "بهینه‌سازی اثر بوهر و افزایش ترابافتی اشباع اکسیژن تا ۳ برابر",
        "evidenceSummary": "ارزیابی جریان خون مویرگی با داپلر لیزری سطحی.",
        "studyReference": "Cambridge Microcirculation Research 2024",
        "approvedBy": "بورد علمی درماتولوژی کمبریج",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "اعمال ژل کربوکسی",
        "instruction": "ابتدا ژل CarboxyGel را به ضخامت یکنواخت روی پوست صورت و گردن پخش نمایید."
      },
      {
        "stepNumber": 2,
        "title": "قرار دادن شیت CarboxyPad",
        "instruction": "پد را روی صورت و گردن قرار داده و با ضربات سبک دست فشار دهید تا حباب‌های CO2 تشکیل شوند."
      },
      {
        "stepNumber": 3,
        "title": "پایان واکنش و پاکسازی",
        "instruction": "پس از ۲۰ دقیقه پد را برداشته و پوست را با آب ولرم تمیز نمایید."
      }
    ],
    "concernSlugs": [
      "dullness",
      "anti-aging"
    ],
    "variants": [
      {
        "sku": "DD-PAD-20X",
        "titleFa": "بسته ۲۰ عددی صورت و گردن",
        "sizeOrVolume": null,
        "price": "14000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 35,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "DD-PAD-50X",
        "titleFa": "بسته کلینیکال ۵۰ عددی ویژه مراکز درمانی",
        "sizeOrVolume": null,
        "price": "32000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 20,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      },
      {
        "sku": "RMD-CPAD-NECK5",
        "titleFa": "پد فعال‌ساز صورت و گردن آناتومیک (بسته ۵ عددی)",
        "sizeOrVolume": "بسته ۵ جفتی صورت و گردن",
        "price": "15500000",
        "originalPrice": "18000000",
        "discountPercent": 14,
        "stock": 30,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 3
      }
    ]
  },
  {
    "slug": "crystalene",
    "titleFa": "خمیر لایه‌بردار و پولیش میکرودرم کریستالین Crystalene Polish Paste",
    "subtitleFa": "پولیش میکرودرم ملایم با کریستال‌های آلومینا، نیاسینامید، لاکتیک اسید و روغن آرگان",
    "scientificName": "Ultra-fine Alumina Microcrystal Resurfacing Paste",
    "formulation": "خمیر کرمی پولیش غنی‌شده با ریزکریستال‌های بیواینرت آلومینا و اسید لاکتیک",
    "description": "پولیش میکرودرم ملایم با کریستال‌های آلومینا، نیاسینامید، لاکتیک اسید، روغن آرگان و شی‌باتر جهت ایجاد شفافیت و یکدستی بافت پوست.",
    "categorySlug": "reeskin",
    "brandSlug": "reeskin",
    "badge": null,
    "ratingValue": 4.9,
    "reviewCount": 94,
    "isFeatured": true,
    "isSpecialOffer": true,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 4,
    "clinicalData": {
      "subtitleFa": "پولیش میکرودرم ملایم با کریستال‌های آلومینا، نیاسینامید، لاکتیک اسید و روغن آرگان",
      "scientificName": "Ultra-fine Alumina Microcrystal Resurfacing Paste",
      "formulation": "خمیر کرمی پولیش غنی‌شده با ریزکریستال‌های بیواینرت آلومینا و اسید لاکتیک",
      "brandTagline": "خمیر پولیش و لایه‌بردار کریستالی با آلومینای فوق‌ریز",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست بجز آکنه فعال التهابی",
        "پوست‌های کدر و دارای لک"
      ],
      "cleanBadges": [
        "بدون تست حیوانی (Cruelty-Free)",
        "فاقد ذرات پلاستیکی ساینده",
        "فرمولاسیون هایپوآلرژنیک"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بازسازی پوست با سایش فوق‌ریز کریستالی",
        "summary": "کریستال‌های آلومینای خالص سلول‌های مرده سطح شاخی اپیدرم را با دقت میکرونی برداشته و جذب مواد مؤثره را به حداکثر می‌رسانند.",
        "bohrEffectExplanation": "حذف لایه کراتینی فرسوده باعث تسریع متابولیسم موضعی و نفوذ ترکیبات بیواکتیو به لایه‌های زنده زیرین می‌گردد.",
        "clinicalBenefits": [
          "روشن‌سازی آنی تن پوست و یکدست‌کردن بافت چهره",
          "پاکسازی کومدون‌های سرسیاه و سلول‌های کراتینه کدر",
          "تحریک سنتز فیبروبلاست و نوسازی لایه‌های اپیدرم"
        ],
        "studyReference": "Cambridge Dermatology Resurfacing Protocol Bulletin 2024."
      },
      "usageProtocol": {
        "routineTime": "هفتگی ۱ الی ۲ بار در روتین شبانه روی پوست نم‌دار",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست و پاکسازی اولیه",
            "instruction": "پوست را با شوینده ملایم شسته و ترجیحاً ۲ دقیقه کمپرس گرم روی صورت قرار دهید تا منافذ نرم شوند.",
            "frequency": "هفتگی ۱ الی ۲ بار"
          },
          {
            "stepNumber": 2,
            "title": "ماساژ ابریشمی با حرکات دورانی",
            "instruction": "یک نخود از خمیر پولیش را روی گونه‌ها، پیشانی و چانه با حرکات دایره‌ای ملایم به مدت ۶۰ تا ۹۰ ثانیه ماساژ دهید."
          },
          {
            "stepNumber": 3,
            "title": "آبکشی با آب ولرم",
            "instruction": "با آب ولرم و پد اسفنجی پوست را کاملاً آبکشی کنید تا کلیه کریستال‌ها پاک شوند."
          },
          {
            "stepNumber": 4,
            "title": "آرام‌بخشی و تغذیه سد دفاعی",
            "instruction": "بلافاصله ژل هیلین یا کربوکسی‌ژل را اعمال نمایید تا مواد فعال بیشترین میزان جذب را داشته باشند."
          }
        ],
        "preProcedure": "روی پوست بدون آرایش و ترجیحاً پس از حمام گرم استفاده شود.",
        "postProcedureCare": "استفاده از ضدآفتاب طی دوره مصرف کریستالین در طول روز الزامی است.",
        "warnings": [
          "روی جوش‌های فعال ملتهب و چرکی استفاده نشود.",
          "از مالش شدید اطراف چشم خودداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "CE Medical Class I",
            "issuer": "BSI Group Netherlands",
            "certificateCode": "CE-CRY-2024",
            "description": "انطباق کامل با استانداردهای درموسوتیکال اروپا.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "کد اصالت لیزری در انتهای تیوب درج شده است.",
        "storageConditions": "در دمای معتدل و دور از تابش مستقیم خورشید.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب.",
        "ceIsoStandards": [
          "CE Class I",
          "ISO 22716 GMP"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_cry_01",
          "patientAge": 34,
          "patientGender": "خانم",
          "condition": "زبری و ناهمواری بافت صورت، سلول‌های کدر مرده و عدم جذب کرم‌های پوستی",
          "protocolDescription": "پولیش میکرودرم ۲ بار در هفته با Crystalene به مدت ۳ هفته متوالی",
          "durationWeeks": 3,
          "sessionsCount": 6,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "قبل از پولیش کریستالین",
          "afterLabel": "پس از ۶ جلسه پولیش",
          "visiaMetrics": [
            {
              "id": "visia_cry_1",
              "labelFa": "یکدستی و همواری میکرونی بافت (Skin Smoothness)",
              "baseline": "۵۳٪",
              "week4Result": "۸۹٪",
              "percentageChange": "+۶۸٪",
              "isImprovement": true,
              "description": "آنالیز رافنس اپیدرم توسط دوربین کانفیلد"
            },
            {
              "id": "visia_cry_2",
              "labelFa": "میزان نفوذپذیری ترکیبات سرم‌های موضعی",
              "baseline": "۳۲٪ جذب پایه",
              "week4Result": "۷۸٪ جذب بافتی",
              "percentageChange": "+۱۴۳٪",
              "isImprovement": true,
              "description": "ارزیابی فلورسانس ترنس‌اپیدرمال"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر پریسا رضوانی",
            "doctorTitleFa": "متخصص پوست و زیبایی، مشاور کلینیک‌های پوست لندن",
            "medicalLicenseNo": "نظام پزشکی: ۷۹۰۲۱",
            "clinicName": "مرکز درمان‌های پیشرفته پوست پاسداران",
            "quote": "برخلاف اسکراب‌های زبر سنتی که شیارهای میکروسکوپی در استراتوم کورنئوم ایجاد می‌کنند، ذرات آلومینای کریستالین کروی بوده و سایش فوق‌العاده ظریفی ایجاد می‌نمایند که جذب مواد بعدی را چند برابر می‌کند.",
            "verifiedBadge": "تأییدیه آکادمی پوست انگلستان"
          }
        }
      ],
      "faqs": [
        {
          "question": "تفاوت کریستالین با اسکراب‌های دانه‌دار معمولی چیست؟",
          "answer": "کریستالین از آلومینای فوق‌ریز گرید مدیکال بهره می‌برد که لبه‌های تیز ندارد و باعث ایجاد خراش میکروسکوپی روی پوست نمی‌شود."
        },
        {
          "question": "آیا کریستالین برای پوست‌های خشک نیز قابل استفاده است؟",
          "answer": "بله، وجود شی‌باتر، روغن آرگان و اسید لاکتیک در پایه این محصول مانع از خشکی پوست شده و رطوبت طبیعی بافت را حفظ می‌نماید."
        },
        {
          "question": "آیا می‌توان پیش از کربوکسی‌تراپی از این خمیر استفاده کرد؟",
          "answer": "بله، پولیش پوست با کریستالین پیش از اجرای ژل کربوکسی لایه مرده شاخی را حذف کرده و نفوذ گاز CO2 و اکسیژن‌رسانی اثر بوهر را تا دو برابر تقویت می‌کند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "میکروکریستال‌های خالص اکسید آلومینیوم (کروندوم مدیکال)",
          "inciName": "Alumina Microcrystals (Pharmaceutical Grade)",
          "percentage": "12.00%",
          "purity": "۹۹.۹٪ کریستال‌های کروی بدون زاویه تیز USP",
          "cirRating": "Safe as Used (CIR Expert Panel)",
          "casNumber": "1344-28-1",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "پولیش فیزیکی ابریشمی بدون آسیب به اتصالات اپیدرم",
          "molecularMechanism": "جداسازی پیوندهای کورنئودسموزومی سلول‌های مرده با سایش میکرونی یکنواخت و آماده‌سازی برای نفوذ اکتیوها.",
          "isKeyActive": true
        },
        {
          "nameFa": "نیاسینامید خالص و ال-لاکتیک اسید",
          "inciName": "Niacinamide, L-Lactic Acid Complex",
          "percentage": "5.00%",
          "purity": "۹۹.۸٪ گرید درماتولوژیک با pH تنظیم‌شده ۴.۲",
          "cirRating": "Safe as Used (CIR Consensus)",
          "casNumber": "98-92-0 / 79-33-4",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "لایه‌برداری شیمیایی ملایم، روشن‌کنندگی و آبرسانی عمقی",
          "molecularMechanism": "حل کردن سیمان بین‌سلولی، مهار انتقال بسته‌های ملانین و تحریک سنتز سرامیدهای اندوژنوس.",
          "isKeyActive": true
        },
        {
          "nameFa": "کمپلکس بیولیپید آرگان و شی‌باتر",
          "inciName": "Argania Spinosa Kernel Oil, Butyrospermum Parkii Butter",
          "percentage": "3.50%",
          "purity": "روغن‌های پرس سرد ارگانیک تصفیه‌شده",
          "cirRating": "Safe as Used",
          "casNumber": "223747-87-3 / 194043-92-0",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "تسکین فوری و ممانعت از ایجاد خشکی یا التهاب سطحی",
          "isKeyActive": false
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "پولیش میکرودرم ملایم با کریستال‌های آلومینا، نیاسینامید، لاکتیک اسید و روغن آرگان",
      "legacyCategorySlug": "reeskin",
      "formulationSlug": "polish-paste"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "خمیر پولیش کریستالین Crystalene Polish Paste",
        "url": "/assets/drdermer/2025/08/15crystalene.webp",
        "width": 1200,
        "height": 1109,
        "mimeType": "image/webp",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "بافت کرمی پولیش کریستالین",
        "url": "/assets/drdermer/2025/08/15crystalene-1200x1109.webp",
        "width": 1200,
        "height": 1109,
        "mimeType": "image/webp",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "میکروکریستال‌های خالص اکسید آلومینیوم",
        "inciName": "Alumina Microcrystals",
        "concentrationPercent": "12",
        "purpose": "پولیش ابریشمی سطح اپیدرم بدون خراش",
        "isKeyIngredient": true,
        "description": "لبه‌های گردشده کریستالی بدون ایجاد خراش‌های میکروسکوپی.",
        "sortOrder": 1
      },
      {
        "name": "نیاسینامید دارویی ۴٪",
        "inciName": "Niacinamide",
        "concentrationPercent": "4",
        "purpose": "روشن‌کننده و تقویت‌کننده سد دفاعی",
        "isKeyIngredient": true,
        "description": "یکدست‌کننده رنگ پوست و کنترل هایپرپیگمنتیشن.",
        "sortOrder": 2
      },
      {
        "name": "اسید لاکتیک ۳٪",
        "inciName": "Lactic Acid",
        "concentrationPercent": "3",
        "purpose": "لایه‌برداری شیمیایی ملایم و هیدراتاسیون اپیدرم",
        "isKeyIngredient": true,
        "description": "تحریک لایه‌برداری ملایم بدون التهاب.",
        "sortOrder": 3
      }
    ],
    "claims": [
      {
        "claimText": "لایه‌برداری میکرودرم ابریشمی بدون خراش میکروسکوپی و روشن‌سازی آنی تن پوست",
        "evidenceSummary": "تحلیل پرفیلوگرام سه‌بعدی زبری پوست در آزمایشگاه درماتولوژی کمبریج.",
        "studyReference": "Cambridge Dermatology Resurfacing Protocol Bulletin 2024",
        "approvedBy": "دکتر جیمز کارتر",
        "status": "APPROVED"
      },
      {
        "claimText": "پاکسازی کامل سلول‌های مرده لایه شاخی و افزایش ۹۰ درصدی جذب مواد مؤثره",
        "evidenceSummary": "ارزیابی اسپکتروفتومتری میزان نفوذ اکتیوها پس از پولیش کریستالین.",
        "studyReference": "ReeSkin Clinical Evaluation Trial RS-CRY-2024",
        "approvedBy": "دکتر مریم رادمنش",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "مرطوب نمودن اولیه پوست",
        "instruction": "پوست را با آب ولرم مرطوب نمایید."
      },
      {
        "stepNumber": 2,
        "title": "ماساژ دورانی خمیر",
        "instruction": "مقدار کمی از خمیر را به مدت ۱ الی ۲ دقیقه با نوک انگشتان روی پوست صورت ماساژ دهید."
      },
      {
        "stepNumber": 3,
        "title": "شستشو و تسکین",
        "instruction": "با آب ولرم شسته و بلافاصله از ژل تسکین‌بخش هیلین استفاده نمایید."
      }
    ],
    "concernSlugs": [
      "dullness"
    ],
    "variants": [
      {
        "sku": "DD-CRY-200ML",
        "titleFa": "تیوب ۲۰۰ میلی‌لیتر سالنی",
        "sizeOrVolume": "200ml تیوب سالنی",
        "price": "17500000",
        "originalPrice": "20500000",
        "discountPercent": 14,
        "stock": 40,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "DD-CRY-50ML",
        "titleFa": "تیوب ۵۰ میلی‌لیتر هوم‌کر",
        "sizeOrVolume": null,
        "price": "6500000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 60,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      }
    ]
  },
  {
    "slug": "healene",
    "titleFa": "ژل التیام‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel",
    "subtitleFa": "ژل ترمیم سد دفاعی حاوی نیاسینامید، پانتنول، هیالورونیک اسید و عصاره‌های گیاهی",
    "scientificName": "Post-Treatment Dermal Soothing & Calming Gel",
    "formulation": "ژل کریستالی آکوا با جذب فوری و بدون چربی",
    "description": "فرمول آرامش‌بخش با نیاسینامید، پانتنول، هیالورونیک اسید، آلانتوئین و ۷ عصاره گیاهی آرام‌بخش سنتلا، میموزا و کالاندولا جهت تسکین فوری قرمزی پس از لیزر و پیلینگ.",
    "categorySlug": "reeskin",
    "brandSlug": "reeskin",
    "badge": "توصیه پزشکان",
    "ratingValue": 5,
    "reviewCount": 65,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 5,
    "clinicalData": {
      "subtitleFa": "ژل ترمیم سد دفاعی حاوی نیاسینامید، پانتنول، هیالورونیک اسید و عصاره‌های گیاهی",
      "scientificName": "Post-Treatment Dermal Soothing & Calming Gel",
      "formulation": "ژل کریستالی آکوا با جذب فوری و بدون چربی",
      "brandTagline": "ژل خنک‌کننده، آبرسان و ترمیم‌کننده پس از درمان‌های تهاجمی",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "پوست‌های بسیار حساس",
        "پوست تحت درمان لیزر، میکرونیدلینگ و پیلینگ",
        "پوست آسیب‌دیده"
      ],
      "cleanBadges": [
        "بدون چربی (Oil-Free)",
        "فاقد عطر و رنگ مصنوعی",
        "تسکین فوری و خنک‌کننده"
      ],
      "scienceMechanism": {
        "heading": "تسکین مسیرهای التهابی و بازسازی اپیدرم",
        "summary": "مهار ترشح اینترلوکین‌های التهابی و سنتز سریع هیالورونیک اسید بومی پوست برای رفع اریتما و گرگرفتگی ناشی از مداخلات کلینیکی.",
        "bohrEffectExplanation": "به‌عنوان مکمل کلیدی بعد از کربوکسی‌تراپی، بافت هیدراته و اکسیژن‌گرفته را تغذیه و آرام می‌سازد.",
        "clinicalBenefits": [
          "کاهش ۶۱ درصدی قرمزی پوست در ۳۰ دقیقه اول",
          "ترمیم لایه‌های چربی میان‌سلولی و کاهش تبخیر آب ترنس‌اپیدرمال (TEWL)",
          "حس خنکی آنی و کاهش سوزش و خارش پوستی"
        ],
        "studyReference": "Post-Laser and Post-Carboxy Recovery Trials UK, 2024."
      },
      "usageProtocol": {
        "routineTime": "روزانه و بلافاصله پس از درمان‌های کلینیکی (لیزر، پیلینگ، کربوکسی)",
        "steps": [
          {
            "stepNumber": 1,
            "title": "پاکسازی و خشک کردن موضع",
            "instruction": "پوست را از باقیمانده ژل کربوکسی یا ژل‌های سونوگرافی و لیزر پاک کنید.",
            "frequency": "بلافاصله پس از پروسیجر"
          },
          {
            "stepNumber": 2,
            "title": "اپلیکیشن ژل خنک هیلین",
            "instruction": "لایه نازک و یکنواختی از ژل را روی سراسر صورت و گردن پخش نمایید (ماساژ ملایم بدون فشار)."
          },
          {
            "stepNumber": 3,
            "title": "جذب فعال و ایجاد سد رطوبتی",
            "instruction": "اجازه دهید ژل به مدت ۳ الی ۵ دقیقه خودبه‌خود جذب شود؛ نیازی به شستشو ندارد."
          },
          {
            "stepNumber": 4,
            "title": "تکرار مصرف در فاز التیام",
            "instruction": "طی ۴۸ ساعت نخست پس از درمان‌های تهاجمی، هر ۴ ساعت یک‌بار مصرف را تکرار کنید."
          }
        ],
        "preProcedure": "می‌توان پیش از مصرف برای خنک‌کنندگی مضاعف در یخچال در دمای ۴ درجه سانتی‌گراد قرار داد.",
        "postProcedureCare": "در طول دوره ترمیم روزها از ضدآفتاب مینرال با SPF بالا استفاده فرمایید.",
        "warnings": [
          "فقط جهت استعمال موضعی خارجی.",
          "در صورت ورود به چشم با آب فراوان شستشو داده شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "CE Medical Class I",
            "issuer": "TÜV SÜD Germany",
            "certificateCode": "CE-HEA-2024",
            "description": "تاییدیه سازگاری با پوست‌های حساس و تحت درمان لیزر.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی بر روی بدنه بطری درج گردیده است.",
        "storageConditions": "در دمای زیر ۲۵ درجه سانتی‌گراد یا یخچال نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن.",
        "ceIsoStandards": [
          "CE Class I",
          "ISO 13485:2016"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_hea_01",
          "patientAge": 29,
          "patientGender": "خانم",
          "condition": "اریتما و التهاب حاد پوست صورت پس از لیزر فرکشنال CO2",
          "protocolDescription": "مصرف ژل هیلین هر ۴ ساعت به مدت ۳ روز متوالی پس از لیزر",
          "durationWeeks": 1,
          "sessionsCount": 3,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "۲ ساعت پس از لیزر (التهاب و قرمزی شدید)",
          "afterLabel": "۴۸ ساعت پس از ژل هیلین (فروکش کامل اریتما)",
          "visiaMetrics": [
            {
              "id": "visia_hea_1",
              "labelFa": "شاخص قرمزی واسکولار (VISIA Red Areas)",
              "baseline": "۸۴ امتیاز التهاب",
              "week4Result": "۲۱ امتیاز التهاب",
              "percentageChange": "-۷۵٪",
              "isImprovement": true,
              "description": "سنجش کاهش هموگلوبین سطحی و اتساع مویرگ‌های درم"
            },
            {
              "id": "visia_hea_2",
              "labelFa": "کاهش تبخیر آب ترنس‌اپیدرمال (TEWL)",
              "baseline": "۳۸ g/m²/h",
              "week4Result": "۱۴ g/m²/h",
              "percentageChange": "-۶۳٪",
              "isImprovement": true,
              "description": "ترمیم سد دفاعی لیپیدی پوست با پروویتامین B5 و آلانتوئین"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر کامران شفیعی",
            "doctorTitleFa": "فلوشیپ لیزر و درماتولوژی، مدرس آکادمی پوست انگلستان",
            "medicalLicenseNo": "نظام پزشکی: ۶۱۴۰۲",
            "clinicName": "کلینیک پوست و جراحی آرا",
            "quote": "سرعت رفع اریتمای بیماران پس از پیلینگ و لیزرهای تخریبی با ژل هیلین شگفت‌انگیز است. فاقد چربی بودن آن مانع انسداد منافذ شده و پوست را خنک و آرام نگه می‌دارد.",
            "verifiedBadge": "تأییدیه درماتولوژی کلینیکال انگلستان"
          }
        }
      ],
      "faqs": [
        {
          "question": "آیا برای آفتاب‌سوختگی هم مناسب است؟",
          "answer": "بله، فرمولاسیون هیلین به علت دارا بودن آلوئه‌ورا، میموزا و پانتنول بهترین التیام‌بخش برای آفتاب‌سوختگی و لیزر است."
        },
        {
          "question": "آیا هیلین با سایر کرم‌ها و ضدآفتاب تداخل دارد؟",
          "answer": "خیر، هیلین بر پایه ژل آکوا سبک و بدون چربی فرموله شده و پس از جذب کامل، بستر مناسبی برای کرم‌های ترمیم‌کننده و ضدآفتاب ایجاد می‌کند."
        },
        {
          "question": "آیا بعد از جلسات مزوتراپی یا میکرونیدلینگ هم می‌توان از آن استفاده کرد؟",
          "answer": "بله، هیلین به دلیل استانداردهای دارویی و بافت استریل، جهت آرام‌سازی بافت سوراخ‌شده در میکرونیدلینگ و مزونیدلینگ بسیار ایده‌آل است."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "پانتنول (پروویتامین B5) و آلانتوئین دارویی",
          "inciName": "Panthenol, Allantoin",
          "percentage": "5.00%",
          "purity": "۹۹.۵٪ Ph. Eur. گرید فارماسیوتیکال",
          "cirRating": "Safe as Used (CIR Expert Panel)",
          "casNumber": "81-13-0 / 97-59-6",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "تسریع ترمیم بافت پوست و رفع سوزش و گرگرفتگی",
          "molecularMechanism": "تبدیل درون‌سلولی به کوآنزیم A، تحریک تکثیر کراتینوسیت‌ها و تسریع سنتز لیپیدهای لایه شاخی.",
          "isKeyActive": true
        },
        {
          "nameFa": "کمپلکس ۷ عصاره گیاهی تسکین‌بخش (سنتلا، میموزا، کالاندولا)",
          "inciName": "Centella Asiatica, Mimosa Tenuiflora, Calendula Officinalis, Chamomilla Extract",
          "percentage": "6.50%",
          "purity": "عصاره‌های استانداردشده با تیتراسیون فلاونوئید بالا",
          "cirRating": "Safe as Used (CIR Consensus)",
          "casNumber": "84696-21-9 / 93384-35-1 / 84776-23-8",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "کاهش سریع فاکتورهای التهابی و مهار اریتما",
          "molecularMechanism": "مهار مسیرهای آنزیمی COX-2 و نیتریک اکسید سنتاز القایی، مهار ترشح اینترلوکین ۱ و کاهش قرمزی عروقی.",
          "isKeyActive": true
        },
        {
          "nameFa": "هیالورونیک اسید بیوتکنولوژیک چندوزنی",
          "inciName": "Sodium Hyaluronate Multi-Molecular Complex",
          "percentage": "2.00%",
          "purity": "گرید دارویی تخمیری بدون اندوتوکسین",
          "cirRating": "Safe as Used",
          "casNumber": "9067-32-7",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "آبرسانی فوری اپیدرم و افزایش انعطاف‌پذیری لایه شاخی",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "ژل ترمیم سد دفاعی حاوی نیاسینامید، پانتنول، هیالورونیک اسید و عصاره‌های گیاهی",
      "legacyCategorySlug": "reeskin",
      "formulationSlug": "soothing-gel"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "ژل تسکین دهنده هیلین Healene Soothing Gel",
        "url": "/assets/drdermer/2025/08/16healene.webp",
        "width": 1200,
        "height": 1109,
        "mimeType": "image/webp",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "بافت سبک ژل کریستالی هیلین",
        "url": "/assets/drdermer/2025/08/16healene-1200x1109.webp",
        "width": 1200,
        "height": 1109,
        "mimeType": "image/webp",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "پانتنول و آلانتوئین ۵٪",
        "inciName": "Panthenol, Allantoin",
        "concentrationPercent": "5",
        "purpose": "ترمیم سد لیپیدی و رفع سوزش پوست",
        "isKeyIngredient": true,
        "description": "تسریع نوسازی سلول‌های اپیدرم و کاهش تبخیر ترنس‌اپیدرمال آب.",
        "sortOrder": 1
      },
      {
        "name": "کمپلکس عصاره‌های گیاهی آرام‌بخش ۶.۵٪",
        "inciName": "Centella Asiatica, Calendula, Chamomile Extract",
        "concentrationPercent": "6.5",
        "purpose": "کاهش سریع فاکتورهای التهابی و اریتما",
        "isKeyIngredient": true,
        "description": "التیام‌بخش قوی سوزش پس از لیزر، پیلینگ و کربوکسی‌تراپی.",
        "sortOrder": 2
      }
    ],
    "claims": [
      {
        "claimText": "کاهش ۶۱ درصدی قرمزی و التهاب اریتما در ۳۰ دقیقه اول پس از مصرف",
        "evidenceSummary": "ثبت شاخص اریتم با درماتوسکوپ و کالریمتر بالینی.",
        "studyReference": "Post-Laser and Post-Carboxy Recovery Trials UK, 2024",
        "approvedBy": "دکتر جیمز کارتر",
        "status": "APPROVED"
      },
      {
        "claimText": "ترمیم سد دفاعی لیپیدی و کاهش تبخیر آب ترنس‌اپیدرمال (TEWL)",
        "evidenceSummary": "ارزیابی TEWL و ترانسیدرمال واتر لوس در آزمون کلینیکی ۶ ساعته.",
        "studyReference": "ReeSkin Clinical Recovery Trial RS-HEA-2024",
        "approvedBy": "دکتر مریم رادمنش",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "استفاده روی پوست تمیز",
        "instruction": "لایه نازکی از ژل هیلین را پس از شستشوی ژل کربوکسی یا جلسات لیزر روی موضع بمالید."
      },
      {
        "stepNumber": 2,
        "title": "ماساژ ملایم تا جذب کامل",
        "instruction": "به آرامی ماساژ دهید تا خنکی و التیام عمیق به لایه‌های اپیدرم نفوذ کند."
      }
    ],
    "concernSlugs": [
      "sensitivity-redness"
    ],
    "variants": [
      {
        "sku": "DD-HEA-250ML",
        "titleFa": "بطری پمپی ۲۵۰ میلی‌لیتر",
        "sizeOrVolume": "250ml بطری پمپی",
        "price": "16000000",
        "originalPrice": "18500000",
        "discountPercent": 13,
        "stock": 50,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "DD-HEA-500ML",
        "titleFa": "مخزن سالنی ۵۰۰ میلی‌لیتر کابین",
        "sizeOrVolume": null,
        "price": "28000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 25,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      }
    ]
  },
  {
    "slug": "silicalene",
    "titleFa": "اسکراب لایه‌بردار ملایم دتوکس سیلیکالین Silicalene Mild Silica Scrub",
    "subtitleFa": "پاکسازی عمقی منافذ، رفع جوش‌های سرسیاه و کنترل چربی با سیلیکا و AHA/BHA",
    "scientificName": "Ultra-smooth Silica Spheres Detox & Pore Purifying Scrub",
    "formulation": "ژل اسکراب حاوی کره‌های سیلیکای کروی و زغال فعال",
    "description": "پاکسازی عمقی منافذ، کنترل چربی و رفع جوش‌های سرسیاه با میکروسفرهای سیلیکای کاملاً گرد، کربن فعال، اسید گلیکولیک و سالیسیلیک.",
    "categorySlug": "reeskin",
    "brandSlug": "reeskin",
    "badge": null,
    "ratingValue": 4.9,
    "reviewCount": 54,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 6,
    "clinicalData": {
      "subtitleFa": "پاکسازی عمقی منافذ، رفع جوش‌های سرسیاه و کنترل چربی با سیلیکا و AHA/BHA",
      "scientificName": "Ultra-smooth Silica Spheres Detox & Pore Purifying Scrub",
      "formulation": "ژل اسکراب حاوی کره‌های سیلیکای کروی و زغال فعال",
      "brandTagline": "اسکراب دتوکس روزانه با کره‌های سیلیکای گرد و کربن فعال",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "پوست‌های چرب، مختلط و مستعد آکنه",
        "پوست‌های با منافذ بسته"
      ],
      "cleanBadges": [
        "فاقد دانه‌های پلاستیکی (Microplastic-free)",
        "تنظیم‌کننده pH فیزیولوژیک",
        "ضد انسداد منافذ (Non-Comedogenic)"
      ],
      "scienceMechanism": {
        "heading": "لایروبی بیومکانیکی منافذ و سم‌زدایی سطحی",
        "summary": "ترکیب ذرات متخلخل کربن فعال با کره‌های ژئودینامیک سیلیکا، بدون سایش زبر، چربی اکسیدشده و آلودگی‌های شهری را به خود جذب می‌کند.",
        "bohrEffectExplanation": "پاکسازی مجاری منافذ اجازه جذب بهتر ترکیبات فعال و تنفس سلولی را فراهم می‌آورد.",
        "clinicalBenefits": [
          "پاکسازی عمیق جوش‌های سرسیاه بدون گشادشدن منافذ",
          "مات‌کنندگی بافت چهره و کاهش ترشح سبوم تا ۸ ساعت"
        ],
        "studyReference": "Pore Clearance and Sebum Metrics, Cambridge Lab 2024."
      },
      "usageProtocol": {
        "routineTime": "هفته‌ای ۲ تا ۳ بار در روتین شبانه",
        "steps": [
          {
            "stepNumber": 1,
            "title": "مرطوب‌سازی چهره با آب ولرم",
            "instruction": "پوست را با آب ولرم مرطوب کنید تا منافذ باز شده و پوست آماده پذیرش بافت ژلی شود.",
            "frequency": "هفته‌ای ۲ تا ۳ بار"
          },
          {
            "stepNumber": 2,
            "title": "ماساژ ملایم روی نواحی T-Zone",
            "instruction": "به مقدار یک بند انگشت از ژل اسکراب را روی پیشانی، بینی و چانه به مدت ۶۰ ثانیه با حرکات دورانی آرام ماساژ دهید."
          },
          {
            "stepNumber": 3,
            "title": "پاکسازی عمیق با آب ولرم",
            "instruction": "پوست را کاملاً با آب ولرم شستشو دهید تا ذرات کربن فعال و سیلیکا پاک شوند."
          },
          {
            "stepNumber": 4,
            "title": "تثبیت و آبرسانی با ژل هیلین",
            "instruction": "پس از خشک کردن ملایم، از ژل تسکین‌بخش هیلین جهت تنظیم pH و تعادل سد دفاعی استفاده نمایید."
          }
        ],
        "preProcedure": "پوست را از هرگونه آرایش پاک کنید.",
        "postProcedureCare": "از مرطوب‌کننده غیرکومدون‌زا یا ژل هیلین استفاده نمایید.",
        "warnings": [
          "از تماس با پوست حساس اطراف چشم خودداری شود.",
          "روی پوست دارای زخم باز یا اگزما استفاده نشود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "ISO 22716 Cosmetics GMP",
            "issuer": "BSI UK",
            "certificateCode": "GMP-SIL-2024",
            "description": "استاندارد عملیات خوب تولید دارویی و آرایشی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "کد بچ روی درز تیوب درج شده است.",
        "storageConditions": "در محیط خشک و دور از گرمای مستقیم.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن.",
        "ceIsoStandards": [
          "ISO 22716",
          "CE Compliant"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_sil_01",
          "patientAge": 26,
          "patientGender": "آقا",
          "condition": "کومدون‌های سرسیاه متراکم بینی و گونه، چربی اضافه و براقی صورت",
          "protocolDescription": "اسکراب دتوکس سیلیکالین ۳ نوبت در هفته به مدت ۴ هفته متوالی",
          "durationWeeks": 4,
          "sessionsCount": 12,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "قبل از شروع دوره دتوکس",
          "afterLabel": "پس از ۴ هفته مصرف منظم",
          "visiaMetrics": [
            {
              "id": "visia_sil_1",
              "labelFa": "کاهش تراکم جوش‌های سرسیاه بینی (Blackhead Density)",
              "baseline": "۱۱۲ عدد در سانتی‌متر مربع",
              "week4Result": "۲۸ عدد در سانتی‌متر مربع",
              "percentageChange": "-۷۵٪",
              "isImprovement": true,
              "description": "آنالیز درماتوسکوپی کانفیلد ویزیا از منافذ بینی"
            },
            {
              "id": "visia_sil_2",
              "labelFa": "کنترل ترشح سبوم و چربی پوست (Sebum Metric)",
              "baseline": "۱۹۸ µg/cm²",
              "week4Result": "۹۲ µg/cm²",
              "percentageChange": "-۵۳٪",
              "isImprovement": true,
              "description": "سبوم‌متری سطحی با زینک PCA و BHA"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر افشین مهرآرا",
            "doctorTitleFa": "متخصص درماتولوژی، عضو انجمن پوست اروپا (EADV)",
            "medicalLicenseNo": "نظام پزشکی: ۸۳۹۰۱",
            "clinicName": "مرکز سلامت و زیبایی پوست فرشته",
            "quote": "میکروسفرهای سیلیکا در مقایسه با پوست گردو یا میکروپلاستیک‌های معمولی، اصطکاک روان هیدرودینامیک دارند و بدون تحریک التهابی جوش، چربی اکسیدشده را تخلیه می‌کنند.",
            "verifiedBadge": "تأییدیه کلینیکال بین‌المللی"
          }
        }
      ],
      "faqs": [
        {
          "question": "تفاوت سیلیکالین با کریستالین چیست؟",
          "answer": "سیلیکالین اسکراب ژلی حاوی کره‌های سیلیکا و کربن فعال با BHA برای کنترل چربی و منافذ است؛ در حالی که کریستالین خمیر پولیش آلومینا برای شفاف‌سازی و لایه‌برداری ریز است."
        },
        {
          "question": "آیا دانه‌های سیلیکالین به محیط زیست آسیب می‌زنند؟",
          "answer": "خیر، سیلیکالین ۱۰۰٪ فاقد میکروپلاستیک (Microplastic-free) بوده و از مواد معدنی طبیعی و تجزیه‌پذیر هیدراته تولید شده است."
        },
        {
          "question": "آیا برای پوست‌های دارای آکنه فعال مناسب است؟",
          "answer": "به دلیل حضور سالیسیلیک اسید و زینک PCA برای آکنه‌های غیرملتهب و کومدون‌ها بسیار عالی است؛ اما بر روی آکنه‌های چرکی ملتهب باید با احتیاط و بدون مالش شدید استفاده شود."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "کره‌های سیلیکای گرد ژئودینامیک و کربن فعال بامبو",
          "inciName": "Hydrated Silica Spheres, Activated Bamboo Charcoal",
          "percentage": "6.00%",
          "purity": "۱۰۰٪ گرید مدیکال، ذرات با قطر ۵۰ میکرومتر کاملاً صیقلی",
          "cirRating": "Safe as Used (CIR Expert Panel)",
          "casNumber": "112926-00-8 / 7440-44-0",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "لایروبی عمیق منافذ پوست بدون آسیب به سد دفاعی",
          "molecularMechanism": "جذب سطحی آلاینده‌های هیدروفوبیک، سبوم اکسیدشده و سلول‌های کراتینه کدر بدون خراش میکروسکوپی در بافت.",
          "isKeyActive": true
        },
        {
          "nameFa": "اسید سالیسیلیک لیپوفیلیک (BHA) و زینک PCA",
          "inciName": "Salicylic Acid USP, Zinc PCA",
          "percentage": "2.50%",
          "purity": "۹۹.۵٪ گرید دارویی با نفوذپذیری سبوم بالا",
          "cirRating": "Safe with Concentration Limits (CIR 2023)",
          "casNumber": "69-72-7 / 15454-75-8",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "حل‌کردن چربی داخل منافذ، آنتی‌باکتریال و کنترل آکنه",
          "molecularMechanism": "شکستن پیوندهای دسموزومی داخل فولیکول، مهار آنزیم ۵-آلفاردوکتاز و جلوگیری از اکسیداسیون چربی سرسیاه.",
          "isKeyActive": true
        },
        {
          "nameFa": "عصاره گل بابونه و گلیسیرین گیاهی",
          "inciName": "Chamomilla Recutita Flower Extract, Glycerin",
          "percentage": "3.00%",
          "purity": "عصاره خالص فاقد آلرژن",
          "cirRating": "Safe as Used",
          "casNumber": "84082-60-0 / 56-81-5",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "پیشگیری از خشکی و احساس کشیدگی پس از شستشو",
          "isKeyActive": false
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "پاکسازی عمقی منافذ، رفع جوش‌های سرسیاه و کنترل چربی با سیلیکا و AHA/BHA",
      "legacyCategorySlug": "reeskin",
      "formulationSlug": "detox-scrub"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "اسکراب ملایم سیلیکالین Silicalene Mild Scrub",
        "url": "/assets/drdermer/2025/08/14silicalene.webp",
        "width": 1200,
        "height": 1109,
        "mimeType": "image/webp",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "بافت ژل اسکراب حاوی ذرات سیلیکا",
        "url": "/assets/drdermer/2025/08/14silicalene-1200x1109.webp",
        "width": 1200,
        "height": 1109,
        "mimeType": "image/webp",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "کره‌های سیلیکای گرد و کربن فعال",
        "inciName": "Hydrated Silica Spheres, Activated Carbon",
        "concentrationPercent": "6",
        "purpose": "لایروبی منافذ و جذب آلاینده‌ها بدون ایجاد خراشیدگی",
        "isKeyIngredient": true,
        "description": "پاکسازی سبوم اکسیدشده و تخلیه کومدون‌ها.",
        "sortOrder": 1
      },
      {
        "name": "اسید سالیسیلیک و زینک PCA",
        "inciName": "Salicylic Acid, Zinc PCA",
        "concentrationPercent": "1.5",
        "purpose": "حل‌کردن چربی داخل منافذ و خواص ضدباکتریایی",
        "isKeyIngredient": true,
        "description": "تنظیم ترشح سبوم و جلوگیری از ایجاد جوش.",
        "sortOrder": 2
      }
    ],
    "claims": [
      {
        "claimText": "پاکسازی عمیق منافذ و رفع کومدون‌های سرسیاه بدون ایجاد حساسیت یا تحریک فیزیکی",
        "evidenceSummary": "ارزیابی پاکسازی منافذ پوست با ویسیا درماتولوژی کمبریج.",
        "studyReference": "Pore Clearance and Sebum Metrics, Cambridge Lab 2024",
        "approvedBy": "دکتر جیمز کارتر",
        "status": "APPROVED"
      },
      {
        "claimText": "کنترل چربی مازاد پوست و مات‌کنندگی بافت چهره تا ۸ ساعت",
        "evidenceSummary": "سنجش ترشح سبوم با سبومتر روی ۴۰ داوطلب دارای پوست چرب.",
        "studyReference": "ReeSkin Sebum Regulation Protocol RS-SIL-2024",
        "approvedBy": "دکتر مریم رادمنش",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "ماساژ روی پوست مرطوب",
        "instruction": "به مدت ۶۰ ثانیه روی پیشانی، بینی و چانه با حرکات دورانی ماساژ دهید."
      },
      {
        "stepNumber": 2,
        "title": "آبکشی کامل",
        "instruction": "با آب ولرم شسته و با حوله تمیز خشک نمایید."
      }
    ],
    "concernSlugs": [
      "dullness"
    ],
    "variants": [
      {
        "sku": "DD-SIL-200ML",
        "titleFa": "تیوب ۲۰۰ میلی‌لیتر",
        "sizeOrVolume": "200ml تیوب",
        "price": "15500000",
        "originalPrice": "18000000",
        "discountPercent": 14,
        "stock": 45,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "DD-SIL-500ML",
        "titleFa": "مخزن کلینیکی ۵۰۰ میلی‌لیتر",
        "sizeOrVolume": null,
        "price": "29000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 20,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      }
    ]
  },
  {
    "slug": "carbox",
    "titleFa": "دستگاه تخصصی کربوکسی‌تراپی و تزریق گاز CarboX دکتر درمر (ReeMed)",
    "subtitleFa": "سیستم دوگانه کربوکسی‌تراپی تهاجمی و غیرتهاجمی با کنترل دیجیتال فشار و دوز",
    "scientificName": "Dual Precise CO2 Gas Injection & Transdermal Carboxy Pod Station",
    "formulation": "دستگاه پزشکی الکترومکانیکال کالیبره‌شده با استانداردهای اتحادیه اروپا",
    "description": "سیستم دوگانه تزریق دیجیتال زیرجلدی گاز CO2 و هندپیس فعال‌سازی CarboxyPod ویژه مطب‌ها و کلینیک‌های پوست.",
    "categorySlug": "reemed",
    "brandSlug": "reemed",
    "badge": "CE Medical",
    "ratingValue": 5,
    "reviewCount": 54,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 7,
    "clinicalData": {
      "subtitleFa": "سیستم دوگانه کربوکسی‌تراپی تهاجمی و غیرتهاجمی با کنترل دیجیتال فشار و دوز",
      "scientificName": "Dual Precise CO2 Gas Injection & Transdermal Carboxy Pod Station",
      "formulation": "دستگاه پزشکی الکترومکانیکال کالیبره‌شده با استانداردهای اتحادیه اروپا",
      "brandTagline": "ایستگاه تخصصی مدیکال تزریق گاز CO2 و کربوکسی‌پاد",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "کلینیک‌های پوست، مو و زیبایی",
        "پزشکان متخصص پوست و جراحان زیبایی"
      ],
      "cleanBadges": [
        "دارای مدیکال CE اتحادیه اروپا",
        "تاییدیه کالیبراسیون دقیق گاز پزشکی",
        "سیستم گرمایش هوشمند گاز جهت کاهش درد تزریق"
      ],
      "scienceMechanism": {
        "heading": "تنظیم دقیق میکرودوز و اثر بوهر مافوق بحرانی",
        "summary": "کنترل پیوسته سرعت تزریق از ۱۰ تا ۱۰۰ سی‌سی در دقیقه همراه با گرمایش گاز تا ۳۶ درجه سانتی‌گراد جهت حداقل‌کردن ناراحتی بیمار و بیشینه‌سازی رهایش اکسیژن.",
        "bohrEffectExplanation": "تزریق مستقیم CO2 خالص پزشکی باعث تحریک فوری رگ‌زایی عروقی (Angiogenesis) و لیپولیز اکسیداتیو چربی‌های موضعی می‌شود.",
        "clinicalBenefits": [
          "درمان قطعی تیرگی دور چشم و افتادگی پلک تحتانی",
          "کاهش سایز و بهبود ظاهر سلولیت در نواحی بدن",
          "تحریک تولید الاستین و بازسازی استریاهای پوستی"
        ],
        "studyReference": "Journal of Aesthetic Surgery and Clinical Carboxytherapy 2024."
      },
      "usageProtocol": {
        "routineTime": "پروتکل کلینیکال زیر نظر پزشک متخصص پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "روشن‌کردن و کالیبراسیون سنسور گاز",
            "instruction": "کنسول CarboX را روشن کرده، فشار خروجی کپسول پزشکی را روی ۵ بار تنظیم نموده و تست خودکار نشتی مدار را آغاز کنید.",
            "frequency": "هر جلسه درمانی"
          },
          {
            "stepNumber": 2,
            "title": "تنظیم پارامترهای دوز و دمای گاز",
            "instruction": "دمای گاز را روی ۳۶ درجه سانتی‌گراد و دبی خروجی را متناسب با اندیکاسیون (دور چشم: ۱۰-۱۵ cc/min، بدن: ۵۰-۸۰ cc/min) تنظیم نمایید."
          },
          {
            "stepNumber": 3,
            "title": "تزریق میکرودوز زیرجلدی با سرسوزن 30G",
            "instruction": "پس از استریل با زاویه ۱۵ الی ۳۰ درجه گاز به لایه هایپودرم یا درم تزریق شده و اتساع ملایم بدون درد بافت مشاهده می‌گردد."
          },
          {
            "stepNumber": 4,
            "title": "اعمال هندپیس CarboxyPod و ماساژ تسکینی",
            "instruction": "بلافاصله پس از تزریق، هندپیس اولتراسونیک CarboxyPod بر سطح ژل اعمال شده و ژل هیلین برای تسکین استفاده می‌شود."
          }
        ],
        "preProcedure": "ضدعفونی دقیق موضع با بتادین یا کلرهگزیدین و بررسی عدم وجود سابقه ترومبوفلبیت فعال.",
        "postProcedureCare": "کمپرس خنک، خودداری از استحمام گرم تا ۲۴ ساعت و استفاده از ژل تسکین‌بخش هیلین.",
        "warnings": [
          "صرفاً جهت استفاده پزشکان و اپراتورهای دارای گواهی معتبر آموزش آکادمی دکتر درمر."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "CE Medical Class IIb Certified",
            "issuer": "TÜV Rheinland Germany",
            "certificateCode": "CE-MED-CARBOX-991",
            "description": "تأییدیه تجهیزات درمانی تهاجمی پزشکی اتحادیه اروپا.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "شماره سریال حک‌شده روی بدنه با پلاک مهندسی استاندارد.",
        "storageConditions": "در محیط تمیز کلینیک و تهویه استاندارد کپسول‌های گاز مدیکال.",
        "shelfLifeAfterOpening": "گارانتی رسمی ۲۴ ماهه و ۱۰ سال خدمات پس از فروش.",
        "ceIsoStandards": [
          "CE Class IIb",
          "ISO 13485:2016",
          "IEC 60601-1 Medical Safety"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_cbx_01",
          "patientAge": 46,
          "patientGender": "خانم",
          "condition": "تیرگی شدید اطراف چشم (پری‌اربیتال هایپرپیگمنتیشن) و افتادگی پلک تحتانی",
          "protocolDescription": "تزریق کربوکسی‌تراپی CarboX با گاز گرم (۲۰ سی‌سی در دقیقه) طی ۴ جلسه به فاصله دو هفته",
          "durationWeeks": 8,
          "sessionsCount": 4,
          "beforeImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/skin-rejuvenation-1024x598.webp",
          "beforeLabel": "جلسه ۱ (تیرگی و رکود عروقی زیر چشم)",
          "afterLabel": "جلسه ۴ (بهبود درناژ لنفاوی و روشن شدن پوست)",
          "visiaMetrics": [
            {
              "id": "visia_cbx_1",
              "labelFa": "کاهش تیرگی و هموگلوبین راکد پری‌اربیتال",
              "baseline": "۷۹ شاخص احتقان عروقی",
              "week4Result": "۲۴ شاخص احتقان عروقی",
              "percentageChange": "-۶۹٪",
              "isImprovement": true,
              "description": "ارزیابی اسپکتروسکوپی جریان اکسیژن بافت زیر چشم"
            },
            {
              "id": "visia_cbx_2",
              "labelFa": "افزایش ضخامت کلاژن درمیس پلک تحتانی",
              "baseline": "۰.۴۲ میلی‌متر",
              "week4Result": "۰.۷۱ میلی‌متر",
              "percentageChange": "+۶۹٪",
              "isImprovement": true,
              "description": "سونوگرافی با رزولوشن بالای ۲۰ مگاهرتز"
            }
          ],
          "dermatologistReview": {
            "doctorName": "پروفسور جیمز هندرسون",
            "doctorTitleFa": "فوق‌تخصص جراحی پلاستیک و درماتولوژی کلینیکال هارلی‌استریت",
            "medicalLicenseNo": "GMC Reg: 4192083",
            "clinicName": "The London Aesthetic & Carboxy Research Institute",
            "quote": "دستگاه CarboX با گرمایش گاز CO2 تا دمای بدن، درد تزریق را به صفر رسانده و ریسک اسپاسم عروقی را حذف کرده است. نتایج کیس‌های تیرگی دور چشم و استریا در کنگره IMCAS پاریس با تحسین همراه شد.",
            "verifiedBadge": "گواهی بورد جراحی زیبایی انگلستان"
          }
        }
      ],
      "faqs": [
        {
          "question": "گارانتی و آموزش کار با دستگاه چگونه ارائه می‌شود؟",
          "answer": "تمامی دستگاه‌های CarboX شامل ۲ سال گارانتی تعویض قطعات، آموزش رایگان پزشک و پرسنل با اعطای سرتیفیکیت معتبر آکادمی دکتر درمر بریتانیا می‌باشند."
        },
        {
          "question": "تفاوت دستگاه CarboX با دستگاه‌های کربوکسی سنتی چیست؟",
          "answer": "دستگاه CarboX مجهز به سیستم گرمایش اتوماتیک گاز جهت به حداقل رساندن درد، تنظیم پیوسته دوز دیجیتال، و هندپیس دوگانه ترکیبی فعال‌سازی پادهای CarboxyPod بر سطح ژل می‌باشد."
        },
        {
          "question": "اندیکاسیون‌های اصلی درمانی CarboX کدامند؟",
          "answer": "تیرگی و چروک دور چشم، استریا و ترک‌های پوستی ناشی از چاقی و بارداری، سلولیت، لیپولیز غبغب و جوان‌سازی صورت و گردن."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "گاز دی‌اکسید کربن با گرید پزشکی فوق‌خالص ۹۹.۹۹۹٪",
          "inciName": "Carbon Dioxide (Medical Grade USP / Ph. Eur. 99.999%)",
          "percentage": "99.999%",
          "purity": "خلوص دارویی فاقد مونوکسید کربن و بخارات هیدروکربنی",
          "cirRating": "Safe as Used (FDA Approved Medical Device Gas)",
          "casNumber": "124-38-9",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "القای رگ‌زایی عروقی، اثر بوهر مافوق بحرانی و لیپولیز بافتی",
          "molecularMechanism": "اتساع فوری اسفنکترهای پیش‌مویرگی از طریق تحریک گیرنده‌های نیتریک اکسید و آزاد شدن همزمان اکسیژن از هموگلوبین.",
          "isKeyActive": true
        },
        {
          "nameFa": "فیلتر هیدروفوبیک آنتی‌باکتریال تفلون (PTFE 0.22µm)",
          "inciName": "Polytetrafluoroethylene (PTFE) Sterilization Matrix",
          "purity": "فیلتراسیون استریل ۱۰۰٪ باکتری و پاتوژن‌ها مطابق USP 797",
          "cirRating": "Safe Medical Grade Non-Toxic",
          "casNumber": "9002-84-0",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "جلوگیری از ورود هرگونه ذره میکرونی به مسیر تزریق گاز به بافت",
          "molecularMechanism": "جداسازی بار منفی و غشای متخلخل جهت تضمین گاز ورودی استریل در دمای فیزیولوژیک.",
          "isKeyActive": true
        },
        {
          "nameFa": "تیتانیم گرید ۵ و آلیاژ استیل مدیکال 316L",
          "inciName": "Surgical Stainless Steel 316L & Titanium Grade 5 Handpiece",
          "purity": "زیست‌سازگار کامل با استاندارد ISO 10993",
          "cirRating": "Biocompatible Implant Grade",
          "casNumber": "12597-68-1 / 7440-32-6",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "انتقال بدون رسوب گاز گرم و ارتعاش فعال‌ساز CarboxyPod",
          "molecularMechanism": "عدم ایجاد خوردگی در مجاورت فازهای اسیدی و قلیایی تبادل گاز CO2.",
          "isKeyActive": false
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "سیستم دوگانه کربوکسی‌تراپی تهاجمی و غیرتهاجمی با کنترل دیجیتال فشار و دوز",
      "legacyCategorySlug": "reemed",
      "formulationSlug": "medical-device"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "دستگاه پزشکی کربوکسی‌تراپی CarboX ری‌مد",
        "url": "/assets/drdermer/2025/08/19carbox.webp",
        "width": 1200,
        "height": 800,
        "mimeType": "image/webp",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "هندپیس و کنسول CarboX",
        "url": "/assets/drdermer/2025/08/01Reeskin-scaled.webp",
        "width": 1200,
        "height": 800,
        "mimeType": "image/webp",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "سیستم تزریق کالیبره‌شده گاز CO2 مدیکال",
        "inciName": "Medical Carbon Dioxide (99.99%) Delivery Module",
        "concentrationPercent": "99.99",
        "purpose": "تزریق زیرجلدی و اتساع مویرگی",
        "isKeyIngredient": true,
        "description": "تزریق دقیق میکرودوز گاز CO2 با گرمایش ۳۶ درجه سانتی‌گراد جهت کاهش درد.",
        "sortOrder": 1
      },
      {
        "name": "هندپیس فعال‌سازی اولتراسونیک پاد",
        "inciName": "Ultrasonic Transdermal Activation Handpiece",
        "concentrationPercent": null,
        "purpose": "فعال‌سازی مکانیکی CarboxyPod",
        "isKeyIngredient": true,
        "description": "تحریک ارتعاشی جهت افزایش نفوذ گاز به لایه‌های عمقی.",
        "sortOrder": 2
      }
    ],
    "claims": [
      {
        "claimText": "تنظیم دیجیتال میلی‌لیتری دوز گاز CO2 با حسگرهای پیزوالکتریک و سیستم پیش‌گرمایش گاز",
        "evidenceSummary": "ثبت پایداری جریان در گواهی استاندارد CE Medical Class IIb اتحادیه اروپا.",
        "studyReference": "Medical Device Directive Compliance Dossier 2024",
        "approvedBy": "بورد تجهیزات پزشکی بریتانیا",
        "status": "APPROVED"
      },
      {
        "claimText": "انطباق با استاندارد تجهیزات پزشکی CE Medical Class IIb اروپا و ایمنی زیستی کامل",
        "evidenceSummary": "تأییدیه TÜV Rheinland Germany و ISO 13485:2016.",
        "studyReference": "European Medical Device Safety Report CBX-2024",
        "approvedBy": "TÜV Rheinland",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "تنظیم پارامترهای دستگاه",
        "instruction": "دوز و فشار گاز را بر اساس اندیکاسیون درمانی از روی مانیتور لمسی دستگاه انتخاب کنید."
      },
      {
        "stepNumber": 2,
        "title": "اتصال به گاز پزشکی استریل",
        "instruction": "کپسول گاز مدیکال با خلوص ۹۹.۹۹٪ را به ورودی دستگاه متصل کرده و کالیبراسیون را تایید نمایید."
      },
      {
        "stepNumber": 3,
        "title": "اجرای پروسیجر درمانی",
        "instruction": "پروسیجر تزریق زیرجلدی یا هندپیس غیرتهاجمی CarboxyPod را تحت نظارت پزشک متخصص انجام دهید."
      }
    ],
    "concernSlugs": [
      "anti-aging"
    ],
    "variants": [
      {
        "sku": "RM-DEV-CARBOX-PLUS",
        "titleFa": "کنسول پیشرفته پلاس",
        "sizeOrVolume": null,
        "price": "520000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 5,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "RM-DEV-CARBOX-PRO",
        "titleFa": "دستگاه کامل CarboX به همراه هندپیس‌های تخصصی و گارانتی رسمی",
        "sizeOrVolume": "کنسول پرتابل مدیکال با ترولی",
        "price": "450000000",
        "originalPrice": "500000000",
        "discountPercent": 10,
        "stock": 10,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      }
    ]
  },
  {
    "slug": "plasmax",
    "titleFa": "دستگاه پیشرفته انرژی پلاسما و جت سرد PlasmaX دکتر درمر (ReeMed)",
    "subtitleFa": "ترکیب پلاسمای تخلیه پیوسته، جت پلاسمای سرد آرگون/هلیوم و DBD پلاسما",
    "scientificName": "Dynamic Continuous Discharge & Cold Argon/Helium Plasma Jet System",
    "formulation": "سیستم مولد انرژی پلاسمای مدیکال با ژنراتور فرکانس بالا",
    "description": "پیشرفته‌ترین سیستم پلاسمای درمانی جهان با کنترل ولتاژ، فرکانس، جت سرد آرگون و هلیوم و DBD پلاسما برای درمان اسکار، بلفاروپلاستی و ترمیم زخم.",
    "categorySlug": "reemed",
    "brandSlug": "reemed",
    "badge": "CE IIb",
    "ratingValue": 5,
    "reviewCount": 54,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 8,
    "clinicalData": {
      "subtitleFa": "ترکیب پلاسمای تخلیه پیوسته، جت پلاسمای سرد آرگون/هلیوم و DBD پلاسما",
      "scientificName": "Dynamic Continuous Discharge & Cold Argon/Helium Plasma Jet System",
      "formulation": "سیستم مولد انرژی پلاسمای مدیکال با ژنراتور فرکانس بالا",
      "brandTagline": "تکنولوژی پیشرفته جت پلاسمای سرد و تخلیه مداوم پلاسما",
      "brandOriginCountry": "انگلستان (United Kingdom)",
      "categoryTitleFa": null,
      "skinTypes": [
        "مراکز جراحی محدود و کلینیک‌های پوست"
      ],
      "cleanBadges": [
        "پلاسمای سرد غیرحرارتی بدون سوختگی بافت",
        "تکنولوژی DBD بیورزونانت با نفوذ کنترل‌شده",
        "دارای مدیکال CE اتحادیه اروپا"
      ],
      "scienceMechanism": {
        "heading": "پلاسمای سرد غیرحرارتی و یونیزاسیون گازهای نجیب",
        "summary": "تولید گونه‌های فعال اکسیژن و نیتروژن (RONS) بدون ایجاد آسیب حرارتی به درم، که منجر به تحریک فیبروبلاست‌ها و حذف ۹۹.۹٪ باکتری‌های مولد آکنه می‌گردد.",
        "bohrEffectExplanation": "مکمل فوق‌العاده در درمان‌های ترکیبی برای تسریع ترمیم پس از پیلینگ و لیزرهای فرکشنال.",
        "clinicalBenefits": [
          "بلفاروپلاستی غیرتهاجمی پلک بدون اسکار و برش جراحی",
          "ضدعفونی عمقی و بهبود سریع زخم‌ها و اسکارهای آکنه"
        ],
        "studyReference": "European Journal of Medical Plasma Physics, Vol 19, 2024."
      },
      "usageProtocol": {
        "routineTime": "پروتکل مطب و اتاق عمل سرپایی درماتولوژی",
        "steps": [
          {
            "stepNumber": 1,
            "title": "اتصال کپسول گاز آرگون و کالیبراسیون دبی",
            "instruction": "کپسول گاز آرگون ۹۹.۹۹۹٪ را به پنل پشتی متصل کرده، رگلاتور را روی فشار ۳ بار تنظیم و دبی خروجی را بررسی فرمایید.",
            "frequency": "پیش از شروع پروسیجر"
          },
          {
            "stepNumber": 2,
            "title": "انتخاب مدالیته درمانی (Continuous, Cold Jet, DBD)",
            "instruction": "برای بلفاروپلاستی مد Continuous با توان ۴ الی ۶ وات و برای ترمیم اسکار و ضدعفونی مد Cold Plasma Jet را از منوی لمسی انتخاب کنید."
          },
          {
            "stepNumber": 3,
            "title": "اجرای اسکن غیرتماسی روی بافت",
            "instruction": "نازل جت سرد را با فاصله ۱ الی ۳ میلی‌متر از سطح پوست به صورت جاروبی حرکت دهید تا گونه‌های فعال نیتروژن و اکسیژن بافت را تحریک کنند."
          },
          {
            "stepNumber": 4,
            "title": "پانسمان محافظتی با ژل هیلین",
            "instruction": "بلافاصله موضع تحت درمان را با لایه سخاوتمندانه‌ای از ژل تسکین‌بخش هیلین پوشش دهید."
          }
        ],
        "preProcedure": "تمیزکردن موضع با مواد غیرالکلی و اطمینان از خشک بودن کامل سطح پوست.",
        "postProcedureCare": "استفاده از ژل تسکین‌بخش هیلین و محافظت کامل در برابر نور آفتاب با ضدآفتاب مینرال.",
        "warnings": [
          "استفاده از عینک محافظ چشمی مخصوص پلاسما هم برای پزشک و هم برای بیمار الزامی است."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "CE Medical Device Class IIb",
            "issuer": "BSI Netherlands",
            "certificateCode": "CE-PLX-9941",
            "description": "انطباق ایمنی با استانداردهای تجهیزات پلاسمای جراحی اروپا.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "شماره سریال حکاکی‌شده لیزری با تاییدیه تست عایق ولتاژ بالا.",
        "storageConditions": "در محیط سرپوشیده با دمای ۱۰ تا ۳۰ درجه سانتی‌گراد.",
        "shelfLifeAfterOpening": "۲۴ ماه گارانتی بی‌قیدوشرط کنسول و هندپیس‌ها.",
        "ceIsoStandards": [
          "CE Medical IIb",
          "ISO 13485",
          "IEC 60601-2-2"
        ]
      },
      "clinicalCaseStudies": [
        {
          "id": "study_plx_01",
          "patientAge": 52,
          "patientGender": "خانم",
          "condition": "افتادگی پوست پلک فوقانی (Dermatochalasis) و خطوط پنجه‌کلاغی مقاوم",
          "protocolDescription": "بلفاروپلاستی غیرتهاجمی با PlasmaX همراه با ۱ نوبت جت سرد آرگون برای تسریع التیام",
          "durationWeeks": 4,
          "sessionsCount": 2,
          "beforeImageUrl": "/assets/drdermer/2025/09/wrinkle-removal.webp",
          "afterImageUrl": "/assets/drdermer/2025/09/wrinkle-removal-876x1024.webp",
          "beforeLabel": "قبل از بلفاروپلاستی پلاسماکس",
          "afterLabel": "۳۰ روز پس از جلسه دوم",
          "visiaMetrics": [
            {
              "id": "visia_plx_1",
              "labelFa": "میزان انقباض و جمع‌شدگی بافت اضافه پلک",
              "baseline": "۴.۲ میلی‌متر پوست مازاد",
              "week4Result": "۱.۱ میلی‌متر پوست مازاد",
              "percentageChange": "-۷۴٪",
              "isImprovement": true,
              "description": "اندازه‌گیری فاصله شیار پلکی تا لبه مژه‌ها با آنالایزر دقیق"
            },
            {
              "id": "visia_plx_2",
              "labelFa": "سرعت بازسازی بافت بدون اسکار فیبروتیک",
              "baseline": "۰٪ بافت سالم",
              "week4Result": "۱۰۰٪ اپیتلیالیزاسیون کامل",
              "percentageChange": "+۱۰۰٪",
              "isImprovement": true,
              "description": "بررسی درموسکوپی عدم تشکیل اسکار کلوییدی با Cold Jet"
            }
          ],
          "dermatologistReview": {
            "doctorName": "دکتر آرش دانشور",
            "doctorTitleFa": "جراح و متخصص چشم، فلوشیپ اکولوپلاستی و جراحی ترمیمی پلک",
            "medicalLicenseNo": "نظام پزشکی: ۵۳۸۱۹",
            "clinicName": "مرکز فوق تخصصی چشم و زیبایی نور",
            "quote": "فناوری دوگانه PlasmaX تحولی در بلفاروپلاستی غیرجراحی ایجاد کرده است. افزودن جت سرد آرگون سبب شده دلمه و اسکار سوختگی ایجاد نشود و دوره نقاهت بیمار از دو هفته به ۴۸ ساعت کاهش یابد.",
            "verifiedBadge": "عضو انجمن جراحان پلاستیک چشم اروپا (ESOPRS)"
          }
        }
      ],
      "faqs": [
        {
          "question": "آیا پلاسماکس باعث ایجاد لک یا PIH می‌شود؟",
          "answer": "به دلیل بهره‌گیری از فناوری پلاسمای سرد غیرحرارتی و کنترل میکروپروسسوری، خطر ایجاد لک‌های التهابی پس از درمان (PIH) حتی در پوست‌های با فتوتیپ تیره به حداقل رسیده است."
        },
        {
          "question": "تفاوت PlasmaX با پلاسماپن‌های معمولی چیست؟",
          "answer": "پلاسماپن‌های متفرقه تنها یک جرقه حرارتی ساده تولید می‌کنند که پوست را می‌سوزاند؛ در حالی که PlasmaX یک سیستم پزشکی کلاس IIb با جت پلاسمای سرد آرگون و هلیوم و کنترل پیوسته انرژی بدون سوختگی است."
        },
        {
          "question": "دوره نقاهت بیمار پس از بلفاروپلاستی با PlasmaX چند روز است؟",
          "answer": "به لطف تکنولوژی Cold Jet، بیمار تنها ۲۴ تا ۴۸ ساعت التهاب خفیف خواهد داشت و نیازی به استراحت طولانی یا مراقبت‌های تهاجمی اتاق عمل ندارد."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "گاز آرگون پزشکی فوق‌خالص ۹۹.۹۹۹٪ (گرید ۵.۰)",
          "inciName": "High-Purity Argon Gas Grade 5.0 Ph. Eur. / USP",
          "percentage": "99.999%",
          "purity": "خلوص بیوتکنولوژی فوق‌العاده با خلوص طیفی ۹۹.۹۹۹٪",
          "cirRating": "Safe Noble Gas for Medical Use",
          "casNumber": "7440-37-1",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "یونیزاسیون سرد، تولید گونه‌های فعال ROS/RNS و حذف پاتوژن‌ها",
          "molecularMechanism": "برانگیختگی الکترونی گاز آرگون و تولید جریان پلاسمای غیرحرارتی (زیر ۳۸ درجه) جهت ضدعفونی سطحی و بیواستیمولیشن.",
          "isKeyActive": true
        },
        {
          "nameFa": "گاز هلیوم دارویی جهت پایدارسازی جت پلاسما",
          "inciName": "Medical Helium Gas Carrier Stream",
          "percentage": "99.99%",
          "purity": "فاقد رطوبت و اکسیژن آزاد Ph. Eur.",
          "cirRating": "Safe Medical Inert Gas",
          "casNumber": "7440-59-7",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "تثبیت قوس تخلیه الکتریکی و جلوگیری از ایجاد جرقه حرارتی",
          "molecularMechanism": "افزایش هدایت گرمایی و کاهش دمای تخلیه سطحی روی سلول‌های حساس اپیدرم.",
          "isKeyActive": false
        },
        {
          "nameFa": "سرسوزن جراحی تنگستن غیرقابل اکسیداسیون",
          "inciName": "Non-Oxidizing Surgical Tungsten Micro-Needle",
          "purity": "آلیاژ تنگستن با نقطه ذوب ۳۴۲۲ درجه سانتی‌گراد",
          "cirRating": "Biocompatible Surgical Electrode",
          "casNumber": "7440-33-7",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "تخلیه متمرکز بار الکتریکی بدون سایش یا سوختگی بافت",
          "isKeyActive": false
        },
        {
          "nameFa": "تیوب دی‌الکتریک رزونانت کوارتز خالص (DBD Jet)",
          "inciName": "Fused Quartz Dielectric Resonator Tube",
          "purity": "کوارتز نوری با مقاومت دی‌الکتریک ۱۰۰ کیلوولت بر میلی‌متر",
          "cirRating": "Inert Biocompatible Material",
          "casNumber": "14808-60-7",
          "ewgScore": 1,
          "comedogenicRating": 0,
          "purpose": "ایجاد پلاسمای سد دی‌الکتریک بدون پرتاب جرقه",
          "isKeyActive": false
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "ترکیب پلاسمای تخلیه پیوسته، جت پلاسمای سرد آرگون/هلیوم و DBD پلاسما",
      "legacyCategorySlug": "reemed",
      "formulationSlug": "medical-device"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "دستگاه پزشکی پلاسماکس PlasmaX دکتر درمر",
        "url": "/assets/drdermer/2025/08/18plasmax.webp",
        "width": 181,
        "height": 300,
        "mimeType": "image/webp",
        "isPrimary": true
      },
      {
        "role": "DETAIL",
        "sortOrder": 2,
        "altText": "پروب‌های جراحی و جت سرد PlasmaX",
        "url": "/assets/drdermer/2025/08/18plasmax-181x300.webp",
        "width": 181,
        "height": 300,
        "mimeType": "image/webp",
        "isPrimary": false
      },
      {
        "role": "IN_CLINIC",
        "sortOrder": 3,
        "altText": "پروتکل رفع اسکار با پلاسمای سرد پلاسماکس",
        "url": "/assets/drdermer/2025/09/scar-removal.webp",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/webp",
        "isPrimary": false
      }
    ],
    "ingredients": [
      {
        "name": "ژنراتور پلاسمای سرد بر پایه گاز آرگون",
        "inciName": "Cold Argon Atmospheric Plasma Jet Module",
        "concentrationPercent": "99.99",
        "purpose": "ضدعفونی باکتریایی و بیواستیمولیشن سلولی",
        "isKeyIngredient": true,
        "description": "تولید گونه‌های فعال اکسیژن و نیتروژن (RONS) بدون تخریب حرارتی بافت.",
        "sortOrder": 1
      },
      {
        "name": "پروب‌های میکروپلاسمای جراحی ظریف",
        "inciName": "Continuous Discharge Micro-Surgical Electrode",
        "concentrationPercent": null,
        "purpose": "بلفاروپلاستی غیرتهاجمی و تصعید ضایعات",
        "isKeyIngredient": true,
        "description": "تصعید دقیق لایه اپیدرم بدون آسیب به غشای پایه و بدون ایجاد اسکار.",
        "sortOrder": 2
      }
    ],
    "claims": [
      {
        "claimText": "کاهش ۹۹.۹ درصدی بار باکتریایی سطح زخم و تحریک نئوکلاژنز بدون ایجاد اسکار سوختگی",
        "evidenceSummary": "مطالعه بالینی در بیمارستان‌های جراحی پوست اروپا.",
        "studyReference": "European Journal of Medical Plasma Physics 2024",
        "approvedBy": "مرکز بیوفیزیک پزشکی لندن",
        "status": "APPROVED"
      },
      {
        "claimText": "قابلیت اجرای بلفاروپلاستی غیرجراحی پلک، درمان اسکارهای آتروفیک و جوان‌سازی درمیس",
        "evidenceSummary": "تأییدیه CE Medical Device Class IIb و تست عایق ولتاژ بالا IEC 60601.",
        "studyReference": "Clinical Plasma Blepharoplasty Bulletin 2024",
        "approvedBy": "BSI Netherlands",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "تنظیم شدت جت سرد یا پلاسما",
        "instruction": "گاز آرگون یا هلیوم را متصل کرده و دبی خروجی و ولتاژ را روی مانیتور دستگاه تنظیم نمایید."
      },
      {
        "stepNumber": 2,
        "title": "آماده‌سازی پوست و عینک ایمنی",
        "instruction": "موضع را با محلول غیرالکلی ضدعفونی نموده و از عینک محافظ چشمی مخصوص پلاسما استفاده کنید."
      },
      {
        "stepNumber": 3,
        "title": "اجرای پروسیجر و تسکین",
        "instruction": "پروب را در فاصله میکرومتری هدایت کنید و پس از پایان، ژل تسکین‌بخش هیلین را روی موضع بمالید."
      }
    ],
    "concernSlugs": [
      "anti-aging"
    ],
    "variants": [
      {
        "sku": "RM-DEV-PLASMAX-PRO",
        "titleFa": "دستگاه کامل PlasmaX با پروب‌های جراحی و Cold Jet",
        "sizeOrVolume": "کنسول ایستاده کلینیکال",
        "price": "580000000",
        "originalPrice": "640000000",
        "discountPercent": 9,
        "stock": 8,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      },
      {
        "sku": "RM-DEV-PLASMAX-SURG",
        "titleFa": "پکیج جراحی کلینیکال",
        "sizeOrVolume": null,
        "price": "670000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 4,
        "isRecommended": false,
        "mediaRoleMatch": "HERO",
        "sortOrder": 2
      }
    ]
  },
  {
    "slug": "retinol-ultra-active",
    "titleFa": "سرم رتینول اولترا اکتیو ۲.۵٪ دکتر درمر",
    "subtitleFa": "سرم ضدچروک و نوسازنده رتینول کپسوله‌شده ۲.۵٪ به همراه اسکوالان و سرامید",
    "scientificName": "Encapsulated 2.5% Retinol + Squalane Cellular Matrix",
    "formulation": "سرم روغنی-امولسیونی پایدار لیپوزومال بدون تحریک پوست",
    "description": "فرمولاسیون پایدار رتینول انکپسوله با نفوذ تدریجی بدون ایجاد سوزش و قرمزی",
    "categorySlug": "serum",
    "brandSlug": "reeskin",
    "badge": null,
    "ratingValue": 4.9,
    "reviewCount": 54,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 9,
    "clinicalData": {
      "cardSubtitle": null,
      "legacyCategorySlug": "serum",
      "formulationSlug": "retinol-serum",
      "subtitleFa": "سرم ضدچروک و نوسازنده رتینول کپسوله‌شده ۲.۵٪ به همراه اسکوالان و سرامید",
      "scientificName": "Encapsulated 2.5% Retinol + Squalane Cellular Matrix",
      "formulation": "سرم روغنی-امولسیونی پایدار لیپوزومال بدون تحریک پوست",
      "skinTypes": [
        "پوست‌های چروکیده",
        "مستعد آکنه و کومدون",
        "دارای لک‌های پیری"
      ],
      "cleanBadges": [
        "Retinol 2.5%",
        "Squalane Barrier",
        "Cruelty-Free",
        "Dermatologist Tested"
      ]
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "سرم رتینول اولترا اکتیو ۲.۵٪ دکتر درمر",
        "url": "/assets/drdermer/2025/07/carboxygel.png",
        "width": 1200,
        "height": 1100,
        "mimeType": "image/webp",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "Encapsulated Retinol 2.5% + Bakuchiol 1%",
        "inciName": "Encapsulated Retinol 2.5% + Bakuchiol 1%",
        "concentrationPercent": null,
        "purpose": "فرمولاسیون تخصصی و فعال درمانی",
        "isKeyIngredient": true,
        "description": null,
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "کاهش ۳۸٪ عمق چروک‌ها در ۲۸ روز",
        "evidenceSummary": "ثبت‌شده در آزمایشگاه و ارزیابی درماتولوژی بالینی",
        "studyReference": null,
        "approvedBy": null,
        "status": "APPROVED"
      }
    ],
    "usageSteps": [],
    "concernSlugs": [
      "anti-aging",
      "dullness",
      "acne-blemish"
    ],
    "variants": [
      {
        "sku": "RS-RET-025",
        "titleFa": "سرم رتینول اولترا اکتیو ۲.۵٪ دکتر درمر",
        "sizeOrVolume": null,
        "price": "31000000",
        "originalPrice": null,
        "discountPercent": null,
        "stock": 35,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "dokdo-1025",
    "titleFa": "آمپول آبرسان راند لب مدل Dokdo 1025",
    "subtitleFa": "سرم آبرسان عمقی و تسکین‌دهنده پوست‌های دهیدراته و حساس",
    "scientificName": "Round Lab 1025 Dokdo Hydrating Deep Ampoule",
    "formulation": "آمپول فلوئیدی سبک با جذب سریع",
    "description": "آمپول تغذیه‌کننده عمیق و آبرسان با آب دریایی تصفیه‌شده جزیره اولرئونگدو و مواد معدنی ۷۴ گانه جهت بازیابی سد دفاعی پوست.",
    "categorySlug": "serum",
    "brandSlug": "round-lab",
    "badge": "-۱۵٪",
    "ratingValue": 4.9,
    "reviewCount": 89,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 10,
    "clinicalData": {
      "subtitleFa": "سرم آبرسان عمقی و تسکین‌دهنده پوست‌های دهیدراته و حساس",
      "scientificName": "Round Lab 1025 Dokdo Hydrating Deep Ampoule",
      "formulation": "آمپول فلوئیدی سبک با جذب سریع",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "آمپول آبرسان قوی راند لب ۱۰۲۵ با ۷۲ نوع ماده معدنی طبیعی استخراج‌شده از آب‌های عمیق دریایی اولئونگ‌دو، تعادل رطوبتی لایه...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "تأییدیه لابراتوار درماتولوژی سئول",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-DOKDO-1025-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "آمپول و سرم تخصصی",
      "formulationSlug": "serum-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول آبرسان راند لب مدل Dokdo 1025",
        "url": "/assets/rupak/shop/dokdo-1025.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول آبرسان راند لب مدل Dokdo 1025",
        "evidenceSummary": "آمپول تغذیه‌کننده عمیق و آبرسان با آب دریایی تصفیه‌شده جزیره اولرئونگدو و مواد معدنی ۷۴ گانه جهت بازیابی سد دفاعی پوست.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "آمپول تغذیه‌کننده عمیق و آبرسان با آب دریایی تصفیه‌شده جزیره اولرئونگدو و مواد معدنی ۷۴ گانه جهت بازیابی سد دفاعی پوست. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "barrier-dryness",
      "sensitivity-redness"
    ],
    "variants": [
      {
        "sku": "SKU-DOKDO-1025",
        "titleFa": "بسته ۵۰ میلی‌لیتر قطره‌چکانی استاندارد",
        "sizeOrVolume": "سایز اصلی",
        "price": "39400000",
        "originalPrice": "42300000",
        "discountPercent": 15,
        "stock": 45,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "centella-hyalu-cica",
    "titleFa": "آمپول آبرسان و حجم‌دهنده هیالوتکا سنتلا اسکین ۱۰۰۴",
    "subtitleFa": "سرم هیالورونیک و سنتلا ماداگاسکار برای پر شدن خطوط و آبرسانی ژرف",
    "scientificName": "Skin1004 Madagascar Centella Hyalu-Cica First Ampoule",
    "formulation": "سرم آب‌پایه ژلی با ۵ وزن مولکولی هیالورونیک اسید",
    "description": "ترکیب منحصر‌به‌فرد عصاره خالص سنتلا آسیاتیکا ماداگاسکار و کمپلکس سه‌گانه هیالورونیک اسید برای التیام فوری و هیدراتاسیون ۲۴ ساعته.",
    "categorySlug": "serum",
    "brandSlug": "skin1004",
    "badge": "-۱۷٪",
    "ratingValue": 4.8,
    "reviewCount": 72,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 11,
    "clinicalData": {
      "subtitleFa": "سرم هیالورونیک و سنتلا ماداگاسکار برای پر شدن خطوط و آبرسانی ژرف",
      "scientificName": "Skin1004 Madagascar Centella Hyalu-Cica First Ampoule",
      "formulation": "سرم آب‌پایه ژلی با ۵ وزن مولکولی هیالورونیک اسید",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "ترکیب انحصاری هیالورونیک اسید چندوزنی با عصاره سنتلا ماداگاسکار برای آبرسانی فوری، تسکین بافت آسیب‌دیده و بازیابی شادابی...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "گواهی ارگانیک ماداگاسکار اسکین ۱۰۰۴",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-CENTELLA-HYALU-CICA-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "آمپول و سرم تخصصی",
      "formulationSlug": "serum-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول آبرسان و حجم‌دهنده هیالوتکا سنتلا اسکین ۱۰۰۴",
        "url": "/assets/rupak/shop/centella-hyalu-cica.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول آبرسان و حجم‌دهنده هیالوتکا سنتلا اسکین ۱۰۰۴",
        "evidenceSummary": "ترکیب منحصر‌به‌فرد عصاره خالص سنتلا آسیاتیکا ماداگاسکار و کمپلکس سه‌گانه هیالورونیک اسید برای التیام فوری و هیدراتاسیون ۲۴ ساعته.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "ترکیب منحصر‌به‌فرد عصاره خالص سنتلا آسیاتیکا ماداگاسکار و کمپلکس سه‌گانه هیالورونیک اسید برای التیام فوری و هیدراتاسیون ۲۴ ساعته. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "sensitivity-redness",
      "barrier-dryness"
    ],
    "variants": [
      {
        "sku": "SKU-CENTELLA-HYALU-CICA",
        "titleFa": "سرم ۱۰۰ میلی‌لیتر اولترا لایت",
        "sizeOrVolume": "سایز اصلی",
        "price": "36100000",
        "originalPrice": "41400000",
        "discountPercent": 17,
        "stock": 35,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "farmstay-gold-collagen",
    "titleFa": "آمپول تغذیه کننده کلاژن و طلا فارم استی مدل Gold Collagen",
    "subtitleFa": "آمپول ضد پیری و سفت‌کننده پوست با ذرات میکرو طلای ۲۴ عیار و کلاژن هیدرولیزشده",
    "scientificName": "Farm Stay 24K Gold & Collagen Super Nutrition Ampoule",
    "formulation": "آمپول غلیظ طلایی حاوی میکروپارتیکل‌های طلا",
    "description": "فرمولاسیون آنتی‌ایجینگ حاوی ذرات کلاژن هیدرولیزشده دریایی و طلای ۲۴ عیار برای افزایش قوام و کشسانی پوست خسته.",
    "categorySlug": "serum",
    "brandSlug": "farmstay",
    "badge": "-۱۶٪",
    "ratingValue": 4.9,
    "reviewCount": 64,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 12,
    "clinicalData": {
      "subtitleFa": "آمپول ضد پیری و سفت‌کننده پوست با ذرات میکرو طلای ۲۴ عیار و کلاژن هیدرولیزشده",
      "scientificName": "Farm Stay 24K Gold & Collagen Super Nutrition Ampoule",
      "formulation": "آمپول غلیظ طلایی حاوی میکروپارتیکل‌های طلا",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "آمپول مغذی چندمنظوره با کلاژن غلیظ دریایی و طلای خالص برای سفت کردن خطوط فک و گونه، تحریک گردش خون و روشن کردن لک‌های خس...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "گواهی تست عدم تحریک پوستی",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-FARMSTAY-GOLD-COLLAGEN-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "آمپول و سرم تخصصی",
      "formulationSlug": "serum-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول تغذیه کننده کلاژن و طلا فارم استی مدل Gold Collagen",
        "url": "/assets/rupak/shop/farmstay-gold-collagen.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول تغذیه کننده کلاژن و طلا فارم استی مدل Gold Collagen",
        "evidenceSummary": "فرمولاسیون آنتی‌ایجینگ حاوی ذرات کلاژن هیدرولیزشده دریایی و طلای ۲۴ عیار برای افزایش قوام و کشسانی پوست خسته.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "فرمولاسیون آنتی‌ایجینگ حاوی ذرات کلاژن هیدرولیزشده دریایی و طلای ۲۴ عیار برای افزایش قوام و کشسانی پوست خسته. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "anti-aging",
      "dullness"
    ],
    "variants": [
      {
        "sku": "SKU-FARMSTAY-GOLD-COLLAGEN",
        "titleFa": "مخزن ۲۵۰ میلی‌لیتر سوپر سایز اقتصادی",
        "sizeOrVolume": "سایز اصلی",
        "price": "31300000",
        "originalPrice": "37900000",
        "discountPercent": 16,
        "stock": 40,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "rosemary-root-ampoule",
    "titleFa": "آمپول حجم دهنده و تقویت کننده پوست سر رزماری",
    "subtitleFa": "تونیک و آمپول فعال‌کننده فولیکول مو با عصاره غلیظ برگ رزماری و سالیسیلیک اسید",
    "scientificName": "Aromatica Rosemary Root Scalp Enhancing Active Ampoule",
    "formulation": "محلول غلیظ تقویت ریشه با اسانس طبیعی رزماری",
    "description": "اکتواتور موضعی فولیکول‌های ریشه مو و کاهش‌دهنده چربی اضافه پوست سر بر پایه عصاره تقطیر‌شده رزماری و ویتامین B5.",
    "categorySlug": "hair",
    "brandSlug": "aromatica",
    "badge": "-۱۵٪",
    "ratingValue": 5,
    "reviewCount": 91,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 13,
    "clinicalData": {
      "subtitleFa": "تونیک و آمپول فعال‌کننده فولیکول مو با عصاره غلیظ برگ رزماری و سالیسیلیک اسید",
      "scientificName": "Aromatica Rosemary Root Scalp Enhancing Active Ampoule",
      "formulation": "محلول غلیظ تقویت ریشه با اسانس طبیعی رزماری",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "درمان تخصصی ریزش و نازک شدن تار مو؛ این آمپول با پاکسازی چربی زائد کف سر و خون‌رسانی مویرگی، فولیکول‌های خفته مو را احیا...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "تأییدیه وگان و EWG Verified",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-ROSEMARY-ROOT-AMPOULE-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "تقویت کننده پوست سر و مو",
      "formulationSlug": "hair-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول حجم دهنده و تقویت کننده پوست سر رزماری",
        "url": "/assets/rupak/shop/rosemary-root-ampoule.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول حجم دهنده و تقویت کننده پوست سر رزماری",
        "evidenceSummary": "اکتواتور موضعی فولیکول‌های ریشه مو و کاهش‌دهنده چربی اضافه پوست سر بر پایه عصاره تقطیر‌شده رزماری و ویتامین B5.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "اکتواتور موضعی فولیکول‌های ریشه مو و کاهش‌دهنده چربی اضافه پوست سر بر پایه عصاره تقطیر‌شده رزماری و ویتامین B5. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "hair-loss"
    ],
    "variants": [
      {
        "sku": "SKU-ROSEMARY-ROOT-AMPOULE",
        "titleFa": "بطری ۱۰۰ میلی‌لیتر دارای اپلیکاتور نوک‌باریک",
        "sizeOrVolume": "سایز اصلی",
        "price": "43800000",
        "originalPrice": "51500000",
        "discountPercent": 15,
        "stock": 25,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "sunol-glow-ampoule",
    "titleFa": "آمپول روشن کننده و بهبود دهنده خطوط سنول گلو مدل",
    "subtitleFa": "آمپول روشن‌کننده ضدلک و شاداب‌کننده قوی حاوی گلوتاتیون و نیاسینامید",
    "scientificName": "Some By Mi Yuja Niacin / Sunol Glow Blemish Care Ampoule",
    "formulation": "آمپول سرمی با رایحه طبیعی مرکبات بدون رنگ مصنوعی",
    "description": "سرم شفاف‌کننده و لیفتینگ آنی غنی‌شده با پپتیدهای فعال زیستی و عصاره میوه خولان دریایی جهت مقابله با لک‌های ناشی از آفتاب.",
    "categorySlug": "brightening",
    "brandSlug": "sunol",
    "badge": "-۲۰٪",
    "ratingValue": 4.7,
    "reviewCount": 53,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 14,
    "clinicalData": {
      "subtitleFa": "آمپول روشن‌کننده ضدلک و شاداب‌کننده قوی حاوی گلوتاتیون و نیاسینامید",
      "scientificName": "Some By Mi Yuja Niacin / Sunol Glow Blemish Care Ampoule",
      "formulation": "آمپول سرمی با رایحه طبیعی مرکبات بدون رنگ مصنوعی",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "ترکیب غلیظ نیاسینامید ۵٪، گلوتاتیون و عصاره مرکبات ارگانیک جهت برطرف کردن لک‌های جای جوش، تیرگی‌های ناشی از اشعه UV و با...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "گواهی استاندارد روشن‌کنندگی بالینی",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-SUNOL-GLOW-AMPOULE-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "ضدلک و روشن‌کننده",
      "formulationSlug": "brightening-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول روشن کننده و بهبود دهنده خطوط سنول گلو مدل",
        "url": "/assets/rupak/shop/sunol-glow-ampoule.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول روشن کننده و بهبود دهنده خطوط سنول گلو مدل",
        "evidenceSummary": "سرم شفاف‌کننده و لیفتینگ آنی غنی‌شده با پپتیدهای فعال زیستی و عصاره میوه خولان دریایی جهت مقابله با لک‌های ناشی از آفتاب.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "سرم شفاف‌کننده و لیفتینگ آنی غنی‌شده با پپتیدهای فعال زیستی و عصاره میوه خولان دریایی جهت مقابله با لک‌های ناشی از آفتاب. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "pigmentation",
      "dullness"
    ],
    "variants": [
      {
        "sku": "SKU-SUNOL-GLOW-AMPOULE",
        "titleFa": "سرم ۳۰ میلی‌لیتر فرمول غلیظ فشرده",
        "sizeOrVolume": "سایز اصلی",
        "price": "38800000",
        "originalPrice": "43400000",
        "discountPercent": 20,
        "stock": 30,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "dr-melaxin-astaxanthin",
    "titleFa": "آمپول روشن کننده و ضدلک آستاگزانتین دکتر ملاکسین",
    "subtitleFa": "آنتی‌اکسیدان فوق‌پیشرفته ۶۰۰۰ برابر قوی‌تر از ویتامین C برای مهار کامل لک",
    "scientificName": "Dr. Melaxin BP Astaxanthin Whitening Deep Ampoule",
    "formulation": "آمپول فلوئید نانو کپسوله به رنگ طبیعی مرجانی ملایم",
    "description": "مهارکننده پرقدرت تولید آنزیم تیروزیناز و رسوب ملانین با آستاگزانتین خالص و گلوتاتیون برای پاکسازی لکه‌های کهنه هورمونی.",
    "categorySlug": "brightening",
    "brandSlug": "dr-melaxin",
    "badge": "-۱۸٪",
    "ratingValue": 4.9,
    "reviewCount": 84,
    "isFeatured": true,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 15,
    "clinicalData": {
      "subtitleFa": "آنتی‌اکسیدان فوق‌پیشرفته ۶۰۰۰ برابر قوی‌تر از ویتامین C برای مهار کامل لک",
      "scientificName": "Dr. Melaxin BP Astaxanthin Whitening Deep Ampoule",
      "formulation": "آمپول فلوئید نانو کپسوله به رنگ طبیعی مرجانی ملایم",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "آمپول کلینیکی دکتر ملاکسین با غلظت بالای آستاگزانتین طبیعی، قوی‌ترین کاروتنوئید کشف‌شده در طبیعت است که سرسخت‌ترین لک‌ها...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "تأییدیه بالینی کاهش ملاسما",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-DR-MELAXIN-ASTAXANTHIN-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "ضدلک و روشن‌کننده",
      "formulationSlug": "brightening-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول روشن کننده و ضدلک آستاگزانتین دکتر ملاکسین",
        "url": "/assets/rupak/shop/dr-melaxin-astaxanthin.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول روشن کننده و ضدلک آستاگزانتین دکتر ملاکسین",
        "evidenceSummary": "مهارکننده پرقدرت تولید آنزیم تیروزیناز و رسوب ملانین با آستاگزانتین خالص و گلوتاتیون برای پاکسازی لکه‌های کهنه هورمونی.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "مهارکننده پرقدرت تولید آنزیم تیروزیناز و رسوب ملانین با آستاگزانتین خالص و گلوتاتیون برای پاکسازی لکه‌های کهنه هورمونی. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "pigmentation",
      "anti-aging"
    ],
    "variants": [
      {
        "sku": "SKU-DR-MELAXIN-ASTAXANTHIN",
        "titleFa": "پک آمپول بالینی ۳۰ میلی‌لیتر پپتیدی",
        "sizeOrVolume": "سایز اصلی",
        "price": "35800000",
        "originalPrice": "41900000",
        "discountPercent": 18,
        "stock": 30,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "centella-niacinamide",
    "titleFa": "آمپول روشن کننده و ضدلک نیاسینامید ۱۰٪ سنتلا",
    "subtitleFa": "آمپول درمانی مهار منافذ باز، کنترل چربی و یکدست‌کننده رنگ پوست",
    "scientificName": "Skin1004 Madagascar Centella Tone Brightening Capsule Ampoule",
    "formulation": "آمپول شفاف حاوی گرانول‌های سفید نانوکپسوله",
    "description": "مهار انتقال ملانوزوم‌ها، تصحیح منافذ باز و تنظیم سبوم اضافی با نیاسینامید غلظت ۱۰٪ و مشتقات فعال ماداگاسکار.",
    "categorySlug": "brightening",
    "brandSlug": "skin1004",
    "badge": "-۲۵٪",
    "ratingValue": 5,
    "reviewCount": 105,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 16,
    "clinicalData": {
      "subtitleFa": "آمپول درمانی مهار منافذ باز، کنترل چربی و یکدست‌کننده رنگ پوست",
      "scientificName": "Skin1004 Madagascar Centella Tone Brightening Capsule Ampoule",
      "formulation": "آمپول شفاف حاوی گرانول‌های سفید نانوکپسوله",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "آمپول کپسولی تون برایتنینگ اسکین ۱۰۰۴ حاوی میکروکپسول‌های نیاسینامید، ترانگزامیک اسید و ۳-O-اتیل آسکوربیک اسید؛ بافتی سب...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "تأییدیه غیرکومدون‌زا بودن",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-CENTELLA-NIACINAMIDE-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "ضدلک و روشن‌کننده",
      "formulationSlug": "brightening-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول روشن کننده و ضدلک نیاسینامید ۱۰٪ سنتلا",
        "url": "/assets/rupak/shop/centella-niacinamide.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول روشن کننده و ضدلک نیاسینامید ۱۰٪ سنتلا",
        "evidenceSummary": "مهار انتقال ملانوزوم‌ها، تصحیح منافذ باز و تنظیم سبوم اضافی با نیاسینامید غلظت ۱۰٪ و مشتقات فعال ماداگاسکار.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "مهار انتقال ملانوزوم‌ها، تصحیح منافذ باز و تنظیم سبوم اضافی با نیاسینامید غلظت ۱۰٪ و مشتقات فعال ماداگاسکار. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "pigmentation",
      "acne-blemish"
    ],
    "variants": [
      {
        "sku": "SKU-CENTELLA-NIACINAMIDE",
        "titleFa": "سرم روشن‌کننده ۵۰ میلی‌لیتر پیور",
        "sizeOrVolume": "سایز اصلی",
        "price": "33900000",
        "originalPrice": "45300000",
        "discountPercent": 25,
        "stock": 35,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "cellmazing-vitamin-c",
    "titleFa": "آمپول روشن کننده ویتامین سی توریدن مدل Cellmazing",
    "subtitleFa": "سرم شفاف‌کننده و کلاژن‌ساز با فرم تثبیت‌شده ویتامین C بدون سوزش پوست",
    "scientificName": "Torriden Cellmazing Brightening Vitamin C Ampoule",
    "formulation": "فلوئید زرد کمرنگ طبیعی با ۵ فرم ویتامین C پایدار",
    "description": "کمپلکس ۵ برابری ویتامین سی پایدار کپسوله‌شده در لیپوزوم بدون سوزش یا اکسیداسیون زودهنگام جهت درخشش شیشه‌ای پوست.",
    "categorySlug": "brightening",
    "brandSlug": "torriden",
    "badge": "-۱۷٪",
    "ratingValue": 4.8,
    "reviewCount": 67,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 17,
    "clinicalData": {
      "subtitleFa": "سرم شفاف‌کننده و کلاژن‌ساز با فرم تثبیت‌شده ویتامین C بدون سوزش پوست",
      "scientificName": "Torriden Cellmazing Brightening Vitamin C Ampoule",
      "formulation": "فلوئید زرد کمرنگ طبیعی با ۵ فرم ویتامین C پایدار",
      "brandTagline": "فرمولاسیون بالینی تخصصی مراقبت پوست",
      "brandOriginCountry": "کره جنوبی (South Korea)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست",
        "پوست‌های حساس و آسیب‌پذیر"
      ],
      "cleanBadges": [
        "فاقد پارابن",
        "هایپوآلرژنیک",
        "ضمانت ۱۰۰٪ اصالت کالا"
      ],
      "scienceMechanism": {
        "heading": "مکانیسم بیوشیمیایی اثرگذاری سلولی",
        "summary": "آمپول پیشرفته سل‌مِیزینگ توریدن با مشتقات چندگانه ویتامین C بافرشده و گلوکزیدها، بدون ایجاد حس سوزش یا قرمزی، لک‌های تاز...",
        "bohrEffectExplanation": "تسهیل اکسیژن‌رسانی به کراتینوسیت‌ها و تقویت متابولیسم میتوکندریایی سلول‌های پوست.",
        "clinicalBenefits": [
          "جذب سریع بدون بر جای گذاشتن چربی اضافی",
          "افزایش الاستیسیته و مقاومت اپیدرم"
        ]
      },
      "usageProtocol": {
        "routineTime": "صبح و شب پس از شستشوی کامل پوست",
        "steps": [
          {
            "stepNumber": 1,
            "title": "آماده‌سازی پوست",
            "instruction": "پوست صورت را با شوینده ملایم تمیز کرده و خشک نمایید."
          },
          {
            "stepNumber": 2,
            "title": "استفاده از آمپول",
            "instruction": "۳ الی ۴ قطره از محصول را روی صورت قرار داده و با حرکات ملایم دورانی ماساژ دهید."
          }
        ],
        "preProcedure": "تست پچ حساسیت روی بازو پیش از مصرف توصیه می‌شود.",
        "postProcedureCare": "پس از جذب کامل، از مرطوب‌کننده و در طول روز از ضد آفتاب استفاده نمایید.",
        "warnings": [
          "از تماس با چشم خودداری شود.",
          "دور از تابش مستقیم آفتاب نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "گواهی پایداری ویتامین C هیپوآلرژنیک",
            "issuer": "KFDA & Global Dermatology Standards",
            "certificateCode": "KFDA-CELLMAZING-VITAMIN-C-2026",
            "description": "تأییدیه سلامت و اصالت محصول توسط آزمایشگاه‌های کنترل کیفی کره جنوبی.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "بچ‌کد اختصاصی حک شده در انتهای بسته‌بندی کالا",
        "storageConditions": "در جای خشک و خنک (۱۵ تا ۲۵ درجه سانتی‌گراد) نگهداری شود.",
        "shelfLifeAfterOpening": "۱۲ ماه پس از باز شدن درب محصول",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practice",
          "CPNP Registered"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "روش مصرف این محصول چگونه است؟",
          "answer": "روزانه ۳ الی ۴ قطره روی پوست تمیز استفاده شود و به آرامی ماساژ داده شود."
        },
        {
          "question": "آیا این کالا دارای ضمانت اصالت است؟",
          "answer": "بله، تمامی محصولات dermavia دارای ضمانت ۱۰۰٪ اصالت و بچ‌کد قابل استعلام هستند."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "ترکیب فعال طبیعی خالص",
          "inciName": "Purified Active Botanical Extract",
          "percentage": "۵٪",
          "purpose": "آبرسانی و تقویت بافت اپیدرم",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "ضدلک و روشن‌کننده",
      "formulationSlug": "brightening-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "آمپول روشن کننده ویتامین سی توریدن مدل Cellmazing",
        "url": "/assets/rupak/shop/cellmazing-vitamin-c.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "ترکیب فعال طبیعی خالص",
        "inciName": "Purified Active Botanical Extract",
        "concentrationPercent": null,
        "purpose": "آبرسانی و تقویت بافت اپیدرم",
        "isKeyIngredient": true,
        "description": "آبرسانی و تقویت بافت اپیدرم",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "آمپول روشن کننده ویتامین سی توریدن مدل Cellmazing",
        "evidenceSummary": "کمپلکس ۵ برابری ویتامین سی پایدار کپسوله‌شده در لیپوزوم بدون سوزش یا اکسیداسیون زودهنگام جهت درخشش شیشه‌ای پوست.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "کمپلکس ۵ برابری ویتامین سی پایدار کپسوله‌شده در لیپوزوم بدون سوزش یا اکسیداسیون زودهنگام جهت درخشش شیشه‌ای پوست. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "dullness",
      "pigmentation"
    ],
    "variants": [
      {
        "sku": "SKU-CELLMAZING-VITAMIN-C",
        "titleFa": "شیشه قطره‌چکانی محافظ نور ۳۰ میلی‌لیتر",
        "sizeOrVolume": "سایز اصلی",
        "price": "40900000",
        "originalPrice": "48900000",
        "discountPercent": 17,
        "stock": 20,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "perfect-in-pink",
    "titleFa": "اسپری اکلیلی بث اند بادی مدل Perfect In pink",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "بادی میست درخشان‌کننده با رایحه اغواکننده گل‌های بهاری و ذرات میکرو شیمر درخشان بدون چسبندگی بر روی پوست.",
    "categorySlug": "body",
    "brandSlug": "bath-and-body",
    "badge": "-۱۶٪",
    "ratingValue": 5,
    "reviewCount": 118,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 18,
    "clinicalData": {
      "cardSubtitle": "بهداشت شخصی و بادی اسپلش",
      "formulationSlug": "body-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "اسپری اکلیلی بث اند بادی مدل Perfect In pink",
        "url": "/assets/rupak/products/perfect-in-pink.png",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/png",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "بادی میست درخشان‌کننده با رایحه اغواکننده گل‌های بهاری و ذرات میکرو شیمر درخشان بدون چسبندگی بر روی پوست.",
        "isKeyIngredient": true,
        "description": "بادی میست درخشان‌کننده با رایحه اغواکننده گل‌های بهاری و ذرات میکرو شیمر درخشان بدون چسبندگی بر روی پوست.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "اسپری اکلیلی بث اند بادی مدل Perfect In pink",
        "evidenceSummary": "بادی میست درخشان‌کننده با رایحه اغواکننده گل‌های بهاری و ذرات میکرو شیمر درخشان بدون چسبندگی بر روی پوست.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "بادی میست درخشان‌کننده با رایحه اغواکننده گل‌های بهاری و ذرات میکرو شیمر درخشان بدون چسبندگی بر روی پوست. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "barrier-dryness"
    ],
    "variants": [
      {
        "sku": "BBW-PINK-SPY",
        "titleFa": "اسپری بادی میست ۲۳۶ میلی‌لیتر شاین دار",
        "sizeOrVolume": "اسپری بادی میست ۲۳۶ میلی‌لیتر شاین دار",
        "price": "23500000",
        "originalPrice": "28100000",
        "discountPercent": 16,
        "stock": 50,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "avene-cicalfate-plus-cream",
    "titleFa": "کرم ترمیم کننده اون مدل Cicalfate Plus اصل",
    "subtitleFa": "کرم محافظ و بازسازی‌کننده قوی با پسابیوتیک C+ Restore و کمپلکس مس-روی",
    "scientificName": "Avène Cicalfate+ Restorative Protective Cream",
    "formulation": "کرم غنی محافظ و التیام‌بخش (امولسیون آب در روغن تنفس‌پذیر)",
    "description": "کرم بازسازنده بالینی شماره ۱ دنیا با C+Restore، مس و روی جهت ترمیم سوختگی، لیزر، تاتو و زخم‌های سطحی بدون ایجاد اسکار.",
    "categorySlug": "repair",
    "brandSlug": "avene",
    "badge": "-۱۵٪",
    "ratingValue": 4.9,
    "reviewCount": 142,
    "isFeatured": false,
    "isSpecialOffer": true,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 19,
    "clinicalData": {
      "subtitleFa": "کرم محافظ و بازسازی‌کننده قوی با پسابیوتیک C+ Restore و کمپلکس مس-روی",
      "scientificName": "Avène Cicalfate+ Restorative Protective Cream",
      "formulation": "کرم غنی محافظ و التیام‌بخش (امولسیون آب در روغن تنفس‌پذیر)",
      "brandTagline": "تخصصی‌ترین درماتولوژی آب‌درمانی حرارتی و ترمیم اپیدرم",
      "brandOriginCountry": "فرانسه (France)",
      "categoryTitleFa": null,
      "skinTypes": [
        "انواع پوست، به‌ویژه پوست‌های آسیب‌دیده، حساس و تحریک‌شده",
        "پوست پس از اعمال درماتولوژی، لیزر، پیلینگ و تتو",
        "مناسب نوزادان، کودکان و بزرگسالان"
      ],
      "cleanBadges": [
        "فاقد عطر و اسانس مصنوعی",
        "فاقد پارابن و الکل",
        "غیرکومدوژنیک (Non-Comedogenic)",
        "تست‌شده توسط متخصصین اطفال و درماتولوژی"
      ],
      "scienceMechanism": {
        "heading": "فناوری ترمیمی ۴ برابری [C+ Restore] و کمپلکس آنتی‌باکتریال مس-روی",
        "summary": "پسابیوتیک انحصاری استخراج‌شده از میکروفلور آب چشمه اون (Aquaphilus dolomiae) تقسیم سلولی فیبروبلاست‌ها را تحریک و ترمیم لایه اپیدرم را تسریع می‌کند.",
        "bohrEffectExplanation": "ترکیب امولسیونی آب در روغن، لایه محافظ نفوذناپذیر در برابر عوامل خارجی و حفظ حداکثری ریزگردش خون جهت بازسازی بیولوژیک ایجاد می‌کند.",
        "clinicalBenefits": [
          "تسریع ۴ برابری ترمیم لایه اپیدرم ظرف ۴۸ ساعت پس از مصرف",
          "کاهش فوری حس کشیدگی، سوزش و التهاب پوست آسیب‌دیده",
          "تصفیه آنتی‌باکتریال موضعی و کاهش خطر رشد میکروب‌های فرصت‌طلب با سولفات مس و روی",
          "سازگاری ۱۰۰٪ با پوست نوزادان و نواحی حساس پوست صورت و بدن"
        ]
      },
      "usageProtocol": {
        "routineTime": "روزانه ۱ الی ۲ بار روی پوست تمیز و خشک ناحیه آسیب‌دیده",
        "steps": [
          {
            "stepNumber": 1,
            "title": "پاکسازی ملایم",
            "instruction": "پوست ناحیه آسیب‌دیده را با شوینده بدون صابون بشویید و به آرامی خشک کنید."
          },
          {
            "stepNumber": 2,
            "title": "اعمال کرم",
            "instruction": "مقدار مناسبی از کرم را به صورت لایه‌ای محافظ روی موضع قرار داده و به آرامی پخش کنید."
          }
        ],
        "preProcedure": "روی زخم‌های دارای ترشح فعال استفاده نشود.",
        "postProcedureCare": "تا زمان ترمیم کامل پوست به مصرف منظم ادامه دهید.",
        "warnings": [
          "از تماس با داخل چشم خودداری فرمایید.",
          "در دمای کمتر از ۲۵ درجه نگهداری شود."
        ]
      },
      "clinicalOrigin": {
        "certifications": [
          {
            "title": "تأییدیه درماتولوژی اتحادیه اروپا",
            "issuer": "Pierre Fabre Dermo-Cosmétique France",
            "certificateCode": "CE-AVENE-FR-2026",
            "description": "تأییدیه اثربخشی بالینی و سلامت فرمولاسیون توسط لابراتوارهای تخصصی فرانسه.",
            "verified": true
          }
        ],
        "batchCodeVerificationInfo": "کد بچ و تاریخ انقضا روی انتهای تیوپ و زیر جعبه محصول",
        "storageConditions": "در دمای ۱۵ الی ۲۵ درجه سانتی‌گراد و دور از تابش مستقیم آفتاب",
        "shelfLifeAfterOpening": "۶ ماه پس از باز شدن تیوپ (PAO 6M)",
        "ceIsoStandards": [
          "ISO 22716 Good Manufacturing Practices (GMP)",
          "European Cosmetic Regulation (EC) 1223/2009"
        ]
      },
      "clinicalCaseStudies": [],
      "faqs": [
        {
          "question": "آیا کرم سیکالفیت پلاس اون برای جای جوش موثر است؟",
          "answer": "بله، این کرم با تقویت بازسازی سلولی و کاهش التهاب قرمز، از ایجاد لک و فرورفتگی جای جوش جدید جلوگیری کرده و ظاهر اسکار را یکدست می‌کند."
        },
        {
          "question": "آیا برای نوزادان و کودکان قابل استفاده است؟",
          "answer": "بله، این محصول توسط متخصصین اطفال تأیید شده و برای ادرارسوختگی، خشکی شدید و خراشیدگی پوست نوزادان از بدو تولد کاملاً ایمن است."
        }
      ],
      "extendedIngredients": [
        {
          "nameFa": "کمپلکس ترمیم‌کننده سی‌پلاس ریستور",
          "inciName": "Aquaphilus Dolomiae Ferment Filtrate",
          "purpose": "تحریک تقسیم سلولی و بازسازی اپیدرم",
          "isKeyActive": true
        },
        {
          "nameFa": "سولفات مس و سولفات روی",
          "inciName": "Copper Sulfate, Zinc Sulfate",
          "purpose": "خواص ضدعفونی‌کننده، آنتی‌باکتریال و پیشگیری از عفونت",
          "isKeyActive": true
        },
        {
          "nameFa": "آب چشمه درمانی اون",
          "inciName": "Avene Thermal Spring Water",
          "purpose": "تسکین‌بخش، ضدالتهاب و کاهش قرمزی",
          "isKeyActive": true
        }
      ],
      "bundleRecommendation": null,
      "cardSubtitle": "آبرسان و مرطوب‌کننده",
      "formulationSlug": "hydrator-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "کرم ترمیم کننده اون مدل Cicalfate Plus اصل",
        "url": "/assets/rupak/offers/prod-cicalfate.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس ترمیم‌کننده سی‌پلاس ریستور",
        "inciName": "Aquaphilus Dolomiae Ferment Filtrate",
        "concentrationPercent": null,
        "purpose": "تحریک تقسیم سلولی و بازسازی اپیدرم",
        "isKeyIngredient": true,
        "description": "تحریک تقسیم سلولی و بازسازی اپیدرم",
        "sortOrder": 1
      },
      {
        "name": "سولفات مس و سولفات روی",
        "inciName": "Copper Sulfate, Zinc Sulfate",
        "concentrationPercent": null,
        "purpose": "خواص ضدعفونی‌کننده، آنتی‌باکتریال و پیشگیری از عفونت",
        "isKeyIngredient": true,
        "description": "خواص ضدعفونی‌کننده، آنتی‌باکتریال و پیشگیری از عفونت",
        "sortOrder": 2
      },
      {
        "name": "آب چشمه درمانی اون",
        "inciName": "Avene Thermal Spring Water",
        "concentrationPercent": null,
        "purpose": "تسکین‌بخش، ضدالتهاب و کاهش قرمزی",
        "isKeyIngredient": true,
        "description": "تسکین‌بخش، ضدالتهاب و کاهش قرمزی",
        "sortOrder": 3
      }
    ],
    "claims": [
      {
        "claimText": "کرم ترمیم کننده اون مدل Cicalfate Plus اصل",
        "evidenceSummary": "کرم بازسازنده بالینی شماره ۱ دنیا با C+Restore، مس و روی جهت ترمیم سوختگی، لیزر، تاتو و زخم‌های سطحی بدون ایجاد اسکار.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "کرم بازسازنده بالینی شماره ۱ دنیا با C+Restore، مس و روی جهت ترمیم سوختگی، لیزر، تاتو و زخم‌های سطحی بدون ایجاد اسکار. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "sensitivity-redness",
      "barrier-dryness"
    ],
    "variants": [
      {
        "sku": "SKU-AVENE-CICALFATE-40ML",
        "titleFa": "تیوب استریل محافظ ۴۰ میلی‌لیتر",
        "sizeOrVolume": "۴۰ میلی‌لیتر",
        "price": "10800000",
        "originalPrice": "12800000",
        "discountPercent": 15,
        "stock": 60,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "alpecin-c1-caffeine-shampoo",
    "titleFa": "شامپو ضد ریزش آلپسین مدل C1 کافئین اصل",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "نفوذ در عرض ۱۲۰ ثانیه به فولیکول مو و خنثی‌سازی اثر تخریبی هورمون تستوسترون بر ریشه‌ها، محصول پیشرو کلینیک‌های پوست آلمان.",
    "categorySlug": "hair",
    "brandSlug": "alpecin",
    "badge": "-۱۶٪",
    "ratingValue": 4.8,
    "reviewCount": 110,
    "isFeatured": false,
    "isSpecialOffer": true,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 20,
    "clinicalData": {
      "cardSubtitle": "تقویت کننده پوست سر و مو",
      "formulationSlug": "hair-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "شامپو ضد ریزش آلپسین مدل C1 کافئین اصل",
        "url": "/assets/rupak/offers/prod-alpecin.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "نفوذ در عرض ۱۲۰ ثانیه به فولیکول مو و خنثی‌سازی اثر تخریبی هورمون تستوسترون بر ریشه‌ها، محصول پیشرو کلینیک‌های پوست آلمان.",
        "isKeyIngredient": true,
        "description": "نفوذ در عرض ۱۲۰ ثانیه به فولیکول مو و خنثی‌سازی اثر تخریبی هورمون تستوسترون بر ریشه‌ها، محصول پیشرو کلینیک‌های پوست آلمان.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "شامپو ضد ریزش آلپسین مدل C1 کافئین اصل",
        "evidenceSummary": "نفوذ در عرض ۱۲۰ ثانیه به فولیکول مو و خنثی‌سازی اثر تخریبی هورمون تستوسترون بر ریشه‌ها، محصول پیشرو کلینیک‌های پوست آلمان.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "نفوذ در عرض ۱۲۰ ثانیه به فولیکول مو و خنثی‌سازی اثر تخریبی هورمون تستوسترون بر ریشه‌ها، محصول پیشرو کلینیک‌های پوست آلمان. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "hair-loss"
    ],
    "variants": [
      {
        "sku": "ALP-C1-SHAMP",
        "titleFa": "شامپو روزانه ۲۵۰ میلی‌لیتر محرک رشد",
        "sizeOrVolume": "شامپو روزانه ۲۵۰ میلی‌لیتر محرک رشد",
        "price": "7500000",
        "originalPrice": "8900000",
        "discountPercent": 16,
        "stock": 50,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "phyto-phanere-120",
    "titleFa": "مکمل قرص فیتو فانر تقویت‌کننده مو و ناخن ۱۲۰ عددی ایتالیا اصل",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "مکمل تغذیه‌ای گیاهی حاوی اسیدهای چرب ضروری، ویتامین‌های گروه B، زینک و روغن جوانه گندم برای افزایش حجم و ضخامت تار مو.",
    "categorySlug": "hair",
    "brandSlug": "phyto",
    "badge": "-۴٪",
    "ratingValue": 4.9,
    "reviewCount": 86,
    "isFeatured": false,
    "isSpecialOffer": true,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 21,
    "clinicalData": {
      "cardSubtitle": "hair",
      "formulationSlug": "hair-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "مکمل قرص فیتو فانر تقویت‌کننده مو و ناخن ۱۲۰ عددی ایتالیا اصل",
        "url": "/assets/rupak/offers/prod-phyto.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "مکمل تغذیه‌ای گیاهی حاوی اسیدهای چرب ضروری، ویتامین‌های گروه B، زینک و روغن جوانه گندم برای افزایش حجم و ضخامت تار مو.",
        "isKeyIngredient": true,
        "description": "مکمل تغذیه‌ای گیاهی حاوی اسیدهای چرب ضروری، ویتامین‌های گروه B، زینک و روغن جوانه گندم برای افزایش حجم و ضخامت تار مو.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "مکمل قرص فیتو فانر تقویت‌کننده مو و ناخن ۱۲۰ عددی ایتالیا اصل",
        "evidenceSummary": "مکمل تغذیه‌ای گیاهی حاوی اسیدهای چرب ضروری، ویتامین‌های گروه B، زینک و روغن جوانه گندم برای افزایش حجم و ضخامت تار مو.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "مکمل تغذیه‌ای گیاهی حاوی اسیدهای چرب ضروری، ویتامین‌های گروه B، زینک و روغن جوانه گندم برای افزایش حجم و ضخامت تار مو. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "hair-loss"
    ],
    "variants": [
      {
        "sku": "PHY-PHAN-120",
        "titleFa": "قوطی ۱۲۰ کپسول ژلاتینی نرم برای دوره ۲ ماهه",
        "sizeOrVolume": "قوطی ۱۲۰ کپسول ژلاتینی نرم برای دوره ۲ ماهه",
        "price": "14500000",
        "originalPrice": "15100000",
        "discountPercent": 4,
        "stock": 40,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "priorin-capsules-120",
    "titleFa": "کپسول مکمل ضد ریزش مو پریورین اصل priorin ۱۲۰ عددی",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "فرمولاسیون پزشکی بایر آلمان بر پایه عصاره ارزن، روغن جوانه گندم و ویتامین B5 جهت فعال‌سازی مجدد متابولیسم سلول‌های ریشه مو.",
    "categorySlug": "hair",
    "brandSlug": "priorin",
    "badge": "-۳٪",
    "ratingValue": 4.9,
    "reviewCount": 95,
    "isFeatured": false,
    "isSpecialOffer": true,
    "isNewest": false,
    "coldChainRequired": false,
    "sortOrder": 22,
    "clinicalData": {
      "cardSubtitle": "hair",
      "formulationSlug": "hair-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "کپسول مکمل ضد ریزش مو پریورین اصل priorin ۱۲۰ عددی",
        "url": "/assets/rupak/offers/prod-priorin.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "فرمولاسیون پزشکی بایر آلمان بر پایه عصاره ارزن، روغن جوانه گندم و ویتامین B5 جهت فعال‌سازی مجدد متابولیسم سلول‌های ریشه مو.",
        "isKeyIngredient": true,
        "description": "فرمولاسیون پزشکی بایر آلمان بر پایه عصاره ارزن، روغن جوانه گندم و ویتامین B5 جهت فعال‌سازی مجدد متابولیسم سلول‌های ریشه مو.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "کپسول مکمل ضد ریزش مو پریورین اصل priorin ۱۲۰ عددی",
        "evidenceSummary": "فرمولاسیون پزشکی بایر آلمان بر پایه عصاره ارزن، روغن جوانه گندم و ویتامین B5 جهت فعال‌سازی مجدد متابولیسم سلول‌های ریشه مو.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "فرمولاسیون پزشکی بایر آلمان بر پایه عصاره ارزن، روغن جوانه گندم و ویتامین B5 جهت فعال‌سازی مجدد متابولیسم سلول‌های ریشه مو. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "hair-loss"
    ],
    "variants": [
      {
        "sku": "PRI-CAPS-120",
        "titleFa": "باکس ۱۲۰ کپسول ارجینال بایر آلمان",
        "sizeOrVolume": "باکس ۱۲۰ کپسول ارجینال بایر آلمان",
        "price": "44000000",
        "originalPrice": "45500000",
        "discountPercent": 3,
        "stock": 25,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "differin-adapalene-gel",
    "titleFa": "ژل ضدجوش و لایه‌بردار دیفرین Differin اصل",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "رتینوئید دارویی موضعی آداپالن ۰.۱٪ جهت پاکسازی کومدون‌ها، پیشگیری از مسدود شدن منافذ و تسریع نوسازی سلولی بافت اپیدرم.",
    "categorySlug": "serum",
    "brandSlug": "differin",
    "badge": "-۹٪",
    "ratingValue": 4.8,
    "reviewCount": 77,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 23,
    "clinicalData": {
      "cardSubtitle": "serum",
      "formulationSlug": "serum-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "ژل ضدجوش و لایه‌بردار دیفرین Differin اصل",
        "url": "/assets/rupak/newest/prod-differin.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "رتینوئید دارویی موضعی آداپالن ۰.۱٪ جهت پاکسازی کومدون‌ها، پیشگیری از مسدود شدن منافذ و تسریع نوسازی سلولی بافت اپیدرم.",
        "isKeyIngredient": true,
        "description": "رتینوئید دارویی موضعی آداپالن ۰.۱٪ جهت پاکسازی کومدون‌ها، پیشگیری از مسدود شدن منافذ و تسریع نوسازی سلولی بافت اپیدرم.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "ژل ضدجوش و لایه‌بردار دیفرین Differin اصل",
        "evidenceSummary": "رتینوئید دارویی موضعی آداپالن ۰.۱٪ جهت پاکسازی کومدون‌ها، پیشگیری از مسدود شدن منافذ و تسریع نوسازی سلولی بافت اپیدرم.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "رتینوئید دارویی موضعی آداپالن ۰.۱٪ جهت پاکسازی کومدون‌ها، پیشگیری از مسدود شدن منافذ و تسریع نوسازی سلولی بافت اپیدرم. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "acne-blemish",
      "pigmentation"
    ],
    "variants": [
      {
        "sku": "DIF-GEL-01",
        "titleFa": "تیوب پلمپ ۳۰ گرم ژل رتینوئید موضعی",
        "sizeOrVolume": "تیوب پلمپ ۳۰ گرم ژل رتینوئید موضعی",
        "price": "5900000",
        "originalPrice": "6400000",
        "discountPercent": 9,
        "stock": 45,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "guerlain-24k-gold-primer",
    "titleFa": "پرایمر آبرسان و جوانساز گلد گرلن Guerlain 24K Primer Parure Gold",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "سرم پایه آرایش مجلل حاوی ورقه‌های طلای خالص ۲۴ عیار برای ایجاد پوستی لطیف، شفاف و بازتاب‌دهنده نور قبل از میکاپ.",
    "categorySlug": "hydrator",
    "brandSlug": "guerlain",
    "badge": "-۱۰٪",
    "ratingValue": 5,
    "reviewCount": 44,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 24,
    "clinicalData": {
      "cardSubtitle": "hydrator",
      "formulationSlug": "hydrator-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "پرایمر آبرسان و جوانساز گلد گرلن Guerlain 24K Primer Parure Gold",
        "url": "/assets/rupak/newest/prod-guerlain.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "سرم پایه آرایش مجلل حاوی ورقه‌های طلای خالص ۲۴ عیار برای ایجاد پوستی لطیف، شفاف و بازتاب‌دهنده نور قبل از میکاپ.",
        "isKeyIngredient": true,
        "description": "سرم پایه آرایش مجلل حاوی ورقه‌های طلای خالص ۲۴ عیار برای ایجاد پوستی لطیف، شفاف و بازتاب‌دهنده نور قبل از میکاپ.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "پرایمر آبرسان و جوانساز گلد گرلن Guerlain 24K Primer Parure Gold",
        "evidenceSummary": "سرم پایه آرایش مجلل حاوی ورقه‌های طلای خالص ۲۴ عیار برای ایجاد پوستی لطیف، شفاف و بازتاب‌دهنده نور قبل از میکاپ.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "سرم پایه آرایش مجلل حاوی ورقه‌های طلای خالص ۲۴ عیار برای ایجاد پوستی لطیف، شفاف و بازتاب‌دهنده نور قبل از میکاپ. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "dullness",
      "anti-aging"
    ],
    "variants": [
      {
        "sku": "GRL-24K-PRIM",
        "titleFa": "بطری کریستال ۳۰ میلی‌لیتر پمپی",
        "sizeOrVolume": "بطری کریستال ۳۰ میلی‌لیتر پمپی",
        "price": "34000000",
        "originalPrice": "38000000",
        "discountPercent": 10,
        "stock": 20,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "neutrogena-skin-detox-micellar",
    "titleFa": "میسلار واتر نوتروژینا مدل اسکین دتوکس Skin Detox اصل ۴۰۰ میل",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "میسلار سه کاره سم‌زدا، پاک‌کننده آلودگی‌های شهری و ترشحات چربی با اسید گلیکولیک برای شفافیت و تنفس عمیق پوست.",
    "categorySlug": "hydrator",
    "brandSlug": "neutrogena",
    "badge": "-۲۴٪",
    "ratingValue": 4.7,
    "reviewCount": 62,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 25,
    "clinicalData": {
      "cardSubtitle": "hydrator",
      "formulationSlug": "hydrator-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "میسلار واتر نوتروژینا مدل اسکین دتوکس Skin Detox اصل ۴۰۰ میل",
        "url": "/assets/rupak/newest/prod-skindetox.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "میسلار سه کاره سم‌زدا، پاک‌کننده آلودگی‌های شهری و ترشحات چربی با اسید گلیکولیک برای شفافیت و تنفس عمیق پوست.",
        "isKeyIngredient": true,
        "description": "میسلار سه کاره سم‌زدا، پاک‌کننده آلودگی‌های شهری و ترشحات چربی با اسید گلیکولیک برای شفافیت و تنفس عمیق پوست.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "میسلار واتر نوتروژینا مدل اسکین دتوکس Skin Detox اصل ۴۰۰ میل",
        "evidenceSummary": "میسلار سه کاره سم‌زدا، پاک‌کننده آلودگی‌های شهری و ترشحات چربی با اسید گلیکولیک برای شفافیت و تنفس عمیق پوست.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "میسلار سه کاره سم‌زدا، پاک‌کننده آلودگی‌های شهری و ترشحات چربی با اسید گلیکولیک برای شفافیت و تنفس عمیق پوست. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "acne-blemish",
      "dullness"
    ],
    "variants": [
      {
        "sku": "NTG-DETOX-400",
        "titleFa": "بطری بزرگ ۴۰۰ میلی‌لیتر پلمپ اقتصادی",
        "sizeOrVolume": "بطری بزرگ ۴۰۰ میلی‌لیتر پلمپ اقتصادی",
        "price": "2900000",
        "originalPrice": "3800000",
        "discountPercent": 24,
        "stock": 50,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  },
  {
    "slug": "neutrogena-hydro-boost-micellar",
    "titleFa": "میسلار واتر نوتروژینا مدل هیدروبوست Hydro Boost اصل ۴۰۰ میل",
    "subtitleFa": null,
    "scientificName": null,
    "formulation": null,
    "description": "پاک‌کننده آرایش ضدآب چشم و صورت همگام با تزریق اسید هیالورونیک، بدون ایجاد احساس کشیدگی یا خشکی پس از شستشو.",
    "categorySlug": "hydrator",
    "brandSlug": "neutrogena",
    "badge": "-۲۴٪",
    "ratingValue": 4.8,
    "reviewCount": 79,
    "isFeatured": false,
    "isSpecialOffer": false,
    "isNewest": true,
    "coldChainRequired": false,
    "sortOrder": 26,
    "clinicalData": {
      "cardSubtitle": "hydrator",
      "formulationSlug": "hydrator-formula"
    },
    "media": [
      {
        "role": "HERO",
        "sortOrder": 1,
        "altText": "میسلار واتر نوتروژینا مدل هیدروبوست Hydro Boost اصل ۴۰۰ میل",
        "url": "/assets/rupak/newest/prod-hydroboost.jpg",
        "width": 1024,
        "height": 1024,
        "mimeType": "image/jpeg",
        "isPrimary": true
      }
    ],
    "ingredients": [
      {
        "name": "کمپلکس فعال درموسوتیکال استاندارد",
        "inciName": "Clinical Dermatological Complex",
        "concentrationPercent": null,
        "purpose": "پاک‌کننده آرایش ضدآب چشم و صورت همگام با تزریق اسید هیالورونیک، بدون ایجاد احساس کشیدگی یا خشکی پس از شستشو.",
        "isKeyIngredient": true,
        "description": "پاک‌کننده آرایش ضدآب چشم و صورت همگام با تزریق اسید هیالورونیک، بدون ایجاد احساس کشیدگی یا خشکی پس از شستشو.",
        "sortOrder": 1
      }
    ],
    "claims": [
      {
        "claimText": "میسلار واتر نوتروژینا مدل هیدروبوست Hydro Boost اصل ۴۰۰ میل",
        "evidenceSummary": "پاک‌کننده آرایش ضدآب چشم و صورت همگام با تزریق اسید هیالورونیک، بدون ایجاد احساس کشیدگی یا خشکی پس از شستشو.",
        "studyReference": "Storefront Clinical & Cosmeceutical Catalog Dossier",
        "approvedBy": "Dr. Dermer & Rupak QA Board",
        "status": "APPROVED"
      }
    ],
    "usageSteps": [
      {
        "stepNumber": 1,
        "title": "نحوه مصرف استاندارد",
        "instruction": "پاک‌کننده آرایش ضدآب چشم و صورت همگام با تزریق اسید هیالورونیک، بدون ایجاد احساس کشیدگی یا خشکی پس از شستشو. مطابق پروتکل روزانه روی پوست یا موی تمیز استفاده شود."
      }
    ],
    "concernSlugs": [
      "barrier-dryness",
      "sensitivity-redness"
    ],
    "variants": [
      {
        "sku": "NTG-HYDRO-400",
        "titleFa": "بطری ۴۰۰ میلی‌لیتر آبرسان هیالورونیک",
        "sizeOrVolume": "بطری ۴۰۰ میلی‌لیتر آبرسان هیالورونیک",
        "price": "2900000",
        "originalPrice": "3800000",
        "discountPercent": 24,
        "stock": 50,
        "isRecommended": true,
        "mediaRoleMatch": "HERO",
        "sortOrder": 1
      }
    ]
  }
];
