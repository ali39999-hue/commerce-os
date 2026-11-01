import { CLINICAL_SKINCARE_PRODUCTS } from './pdp-data';

export interface ClinicalSpecs {
  brand: string;
  volume: string;
  activeIngredients: string[];
  clinicalFunction: string;
  certifications: string[];
}

export interface CuratedProductItem {
  id: string;
  slug: string;
  title: string;
  brand: string;
  sku: string;
  priceAmount: string;
  inStock: boolean;
  categoryTitleFa: string;
  formulation: string;
  concern: string;
  volume: string;
  description: string;
}

export const RECOMMENDED_CLINICAL_PRODUCTS: CuratedProductItem[] = [
  {
    id: 'prod_skin_001',
    slug: 'carboxygel-professional-therapy',
    title: 'ژل کربوکسی تراپی تخصصی کلینیکال CarboxyGel Professional Therapy',
    brand: 'ReeSkin Clinical',
    sku: 'CBG-PRO-500ML',
    priceAmount: '48500000',
    inStock: true,
    categoryTitleFa: 'مراقبت تخصصی پوست و کلینیکال',
    formulation: 'carboxy-gel',
    concern: 'anti-aging-lifting',
    volume: '۵۰۰ میلی‌لیتر کلینیکال',
    description: 'سیستم کربوکسی تراپی غیرتهاجمی با تحریک پدیده اثر بوهر (Bohr Effect) جهت اکسیژن‌رسانی عمیق سلولی و لیفتینگ.',
  },
  {
    id: 'prod_clinical_carboxypod',
    slug: 'carboxypod-activation-pads',
    title: 'پدهای فعال‌ساز فیبری CarboxyPod ری‌مد (بسته ۵ عددی)',
    brand: 'ReeMed Medical Pro',
    sku: 'RMD-CPD-005',
    priceAmount: '12500000',
    inStock: true,
    categoryTitleFa: 'تجهیزات و ملزومات کلینیکال',
    formulation: 'activation-pods',
    concern: 'acne-blemish',
    volume: 'باکس ۵ ساشه وکیوم',
    description: 'پدهای فعال‌ساز فیبری متخلخل غنی از اسید سیتریک میکروکپسوله برای فعال‌سازی آنی واکنش گاز CO2.',
  },
  {
    id: 'prod_skin_healene',
    slug: 'healene',
    title: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing Gel',
    brand: 'ReeSkin Clinical',
    sku: 'DD-HEA-250ML',
    priceAmount: '16000000',
    inStock: true,
    categoryTitleFa: 'مراقبت تخصصی پوست و کلینیکال',
    formulation: 'soothing-gel',
    concern: 'barrier-dryness',
    volume: '۲۵۰ میلی‌لیتر بطری پمپی',
    description: 'ژل سبک التیام‌بخش با پانتنول، نیاسینامید، هیالورونیک اسید و ۷ عصاره گیاهی جهت رفع فوری التهاب و ترمیم سد دفاعی.',
  },
  {
    id: 'prod_skin_crystalene',
    slug: 'crystalene',
    title: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste',
    brand: 'ReeSkin Clinical',
    sku: 'DD-CRY-200ML',
    priceAmount: '17500000',
    inStock: true,
    categoryTitleFa: 'مراقبت تخصصی پوست و کلینیکال',
    formulation: 'polish-paste',
    concern: 'acne-blemish',
    volume: '۲۰۰ میلی‌لیتر تیوب سالنی',
    description: 'پولیش میکرودرم ابریشمی با کریستال‌های آلومینای میکرونی، نیاسینامید و لاکتیک اسید جهت پاکسازی سلول‌های مرده.',
  },
  {
    id: 'prod_drdermer_006',
    slug: 'silicalene',
    title: 'اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub',
    brand: 'ReeSkin Clinical',
    sku: 'DD-SIL-200ML',
    priceAmount: '15500000',
    inStock: true,
    categoryTitleFa: 'مراقبت تخصصی پوست و کلینیکال',
    formulation: 'detox-scrub',
    concern: 'acne-blemish',
    volume: '۲۰۰ میلی‌لیتر تیوب',
    description: 'اسکراب دتوکس روزانه با میکروسفرهای گرد سیلیکا، کربن فعال و سالیسیلیک اسید برای لایروبی عمیق منافذ.',
  },
  {
    id: 'prod_drdermer_003',
    slug: 'carboxypad',
    title: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad',
    brand: 'ReeSkin Clinical',
    sku: 'DD-PAD-20X',
    priceAmount: '14000000',
    inStock: true,
    categoryTitleFa: 'ملزومات و پدهای مصرفی',
    formulation: 'alkaline-pad',
    concern: 'anti-aging-lifting',
    volume: 'بسته ۲۰ عددی صورت و گردن',
    description: 'شیت‌های فیبری یکپارچه صورت و گردن جهت ایجاد حداکثر واکنش تبادل گازی بر سطح ژل کربوکسی.',
  },
  {
    id: 'prod_drdermer_007',
    slug: 'carbox',
    title: 'دستگاه تخصصی تزریق گاز CO2 و کربوکسی‌پاد کلینیکال CarboX',
    brand: 'ReeMed Medical Pro',
    sku: 'RM-DEV-CARBOX-PRO',
    priceAmount: '450000000',
    inStock: true,
    categoryTitleFa: 'تجهیزات و دستگاه‌های کلینیکال',
    formulation: 'clinical-equipment',
    concern: 'scar-recovery',
    volume: 'کنسول پرتابل مدیکال با ترولی',
    description: 'سیستم دوگانه کربوکسی‌تراپی تهاجمی و غیرتهاجمی با کنترل دیجیتال فشار و دوز دی‌اکسید کربن پزشکی.',
  },
  {
    id: 'prod_drdermer_008',
    slug: 'plasmax',
    title: 'دستگاه پیشرفته انرژی پلاسما و جت پلاسمای سرد PlasmaX',
    brand: 'ReeMed Medical Pro',
    sku: 'RM-DEV-PLASMAX-PRO',
    priceAmount: '580000000',
    inStock: true,
    categoryTitleFa: 'تجهیزات و دستگاه‌های کلینیکال',
    formulation: 'clinical-equipment',
    concern: 'anti-aging-lifting',
    volume: 'کنسول ایستاده کلینیکال با پروب‌ها',
    description: 'سیستم مولد انرژی پلاسمای مدیکال مجهز به جت پلاسمای سرد آرگون و هلیوم برای بلفاروپلاستی غیرجراحی و اسکار.',
  },
];

export function getClinicalSpecs(item: { slug?: string; title?: string }): ClinicalSpecs {
  const slug = (item.slug ?? '').toLowerCase();
  const title = (item.title ?? '').toLowerCase();

  // 1. Check exact match in CLINICAL_SKINCARE_PRODUCTS
  const exact = CLINICAL_SKINCARE_PRODUCTS[slug];
  if (exact) {
    const keyActives = exact.ingredients
      .filter((i) => i.isKeyActive)
      .map((i) => i.nameFa)
      .slice(0, 3);
    const fallbackActives = exact.ingredients.map((i) => i.nameFa).slice(0, 3);

    return {
      brand: exact.brand.name,
      volume: exact.variants[0]?.sizeOrVolume ?? '۵۰۰ میلی‌لیتر',
      activeIngredients:
        keyActives.length > 0
          ? keyActives
          : fallbackActives.length > 0
          ? fallbackActives
          : exact.cleanBadges.slice(0, 3),
      clinicalFunction: exact.scienceMechanism?.heading || exact.subtitleFa,
      certifications: exact.clinicalOrigin?.ceIsoStandards?.length
        ? exact.clinicalOrigin.ceIsoStandards
        : exact.cleanBadges.slice(0, 3),
    };
  }

  // 2. Intelligent heuristics based on clinical keywords
  if (slug.includes('carboxypod') || title.includes('پد') || title.includes('pod')) {
    return {
      brand: 'ReeMed Medical Pro',
      volume: 'باکس ۵ ساشه استریل',
      activeIngredients: ['اسید سیتریک میکروکپسوله ۱۲٪', 'الیاف سلولزی گرید پزشکی', 'کلسیم کربنات خالص'],
      clinicalFunction: 'فعال‌سازی کاتالیزوری واکنش CO2 و مهار فرار گاز در بافت',
      certifications: ['CE Class I Medical', 'ISO 13485', 'استریل پرتو گاما'],
    };
  }

  if (slug.includes('carboxy') || title.includes('کربوکسی')) {
    return {
      brand: 'ReeSkin Clinical',
      volume: '۵۰۰ میلی‌لیتر کلینیکال',
      activeIngredients: ['سدیم بی‌کربنات دارویی', 'هیالورونیک اسید چندوزنی', 'عصاره تسکین‌بخش سنتلا'],
      clinicalFunction: 'القای پدیده اثر بوهر (Bohr Effect) و اکسیژن‌رسانی سلولی بافت',
      certifications: ['CE Class I Medical', 'ISO 13485', 'Cruelty-Free'],
    };
  }

  if (slug.includes('retinol') || title.includes('رتینول')) {
    return {
      brand: 'ReeSkin Clinical',
      volume: '۳۰ میلی‌لیتر',
      activeIngredients: ['رتینول خالص ۰.۵٪ انکپسوله', 'باکوچیول گیاهی', 'ویتامین E توکوفرول'],
      clinicalFunction: 'تسریع نوسازی اپیدرم، کلاژن‌سازی و رفع هایپرپیگمنتیشن',
      certifications: ['Dermatologist Approved', 'فاقد پارابن', 'GMP Certified'],
    };
  }

  if (slug.includes('serum') || title.includes('سرم') || title.includes('peptide') || title.includes('پپتید')) {
    return {
      brand: 'ReeSkin Clinical',
      volume: '۵۰ میلی‌لیتر',
      activeIngredients: ['پپتید مس GHK-Cu', 'سرامید NP لاملار', 'سنتلا آسیاتیکا ۴۰٪'],
      clinicalFunction: 'بازسازی فیبروبلاست‌ها، تقویت سد دفاعی و التیام التهاب مزمن',
      certifications: ['Hypoallergenic Clinical', 'تست درماتولوژی لندن', 'فاقد عطر مصنوعی'],
    };
  }

  if (slug.includes('cream') || slug.includes('barrier') || title.includes('کرم') || title.includes('بریر')) {
    return {
      brand: 'ReeSkin Clinical',
      volume: '۷۵ میلی‌لیتر تیوب ایرلس',
      activeIngredients: ['لیپیدهای بیومیمتیک سد دفاعی', 'مادکاسوساید خالص ۹۵٪', 'نیاسینامید ۴٪'],
      clinicalFunction: 'کاهش TEWL، تسریع ترمیم لایه اپیدرم و رطوبت‌رسانی ماندگار ۷۲ ساعته',
      certifications: ['ISO 22716 GMP', 'سازگار با میکروبیوم', 'Cruelty-Free'],
    };
  }

  if (slug.includes('mask') || title.includes('ماسک')) {
    return {
      brand: 'ReeSkin Clinical',
      volume: 'پک ۶ عددی شیت ماسک',
      activeIngredients: ['فاکتور رشد اپیدرمال EGF', 'بیوسلولز آب نارگیل تخمیری', 'پپتید الاستین'],
      clinicalFunction: 'لیفتینگ فوری، آبرسانی عمیق و آرام‌بخشی بافت پس از درمان‌های کلینیکی',
      certifications: ['استریل ساشه منفرد', 'سازگار با انواع پوست', 'فاقد الکل'],
    };
  }

  // Generic fallback
  return {
    brand: title.includes('reemed') ? 'ReeMed Medical Pro' : 'ReeSkin Clinical',
    volume: 'سایز استاندارد کلینیکال',
    activeIngredients: ['کمپلکس بیواکتیو درماتولوژی', 'هیالورونات سدیم', 'ویتامین‌های مغذی پوست'],
    clinicalFunction: 'مراقبت بالینی، تغذیه بافتی و ارتقای سلامت لایه‌های پوستی',
    certifications: ['استاندارد درموسوتیکال UK', 'Cruelty-Free', 'CE Standards'],
  };
}
