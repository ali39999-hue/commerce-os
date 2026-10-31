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
    formulation: 'gel',
    concern: 'dullness',
    volume: '۵۰۰ میلی‌لیتر کلینیکال',
    description: 'سیستم کربوکسی تراپی غیرتهاجمی با تولید دی‌اکسید کربن فعال (Bohr Effect) جهت اکسیژن‌رسانی عمیق بافتی.',
  },
  {
    id: 'prod_clinical_carboxypod',
    slug: 'carboxypod-activation-pads',
    title: 'پدهای فعال‌ساز فیبری CarboxyPod ری‌مد (بسته ۵ عددی)',
    brand: 'ReeMed Laboratories',
    sku: 'RMD-CPD-005',
    priceAmount: '12500000',
    inStock: true,
    categoryTitleFa: 'تجهیزات و ملزومات کلینیکال',
    formulation: 'pads',
    concern: 'scars-pores',
    volume: 'باکس ۵ ساشه وکیوم',
    description: 'پدهای فعال‌ساز فیبری متخلخل غنی از اسید سیتریک میکروکپسوله برای فعال‌سازی آنی واکنش اثر بوهر.',
  },
  {
    id: 'prod_peptide_barrier_serum',
    slug: 'reeskin-ceramide-peptide-recovery-serum',
    title: 'سرم بازسازی سد دفاعی پوست با پپتید مس و سرامید NP',
    brand: 'ReeSkin Clinical',
    sku: 'RS-SRM-50ML',
    priceAmount: '18500000',
    inStock: true,
    categoryTitleFa: 'مراقبت تخصصی پوست و کلینیکال',
    formulation: 'serum',
    concern: 'anti-aging',
    volume: '۵۰ میلی‌لیتر',
    description: 'کنسانتره پپتیدی پپتید مس GHK-Cu و کمپلکس سرامید لاملار جهت ترمیم بافت و مهار قرمزی و خطوط سطحی.',
  },
  {
    id: 'prod_barrier_recovery_cream',
    slug: 'barrier-recovery-cream',
    title: 'کرم ترمیم سد دفاعی و تسکین‌بخش لاملار پوست (Barrier Recovery)',
    brand: 'ReeSkin Clinical',
    sku: 'RS-BRC-75ML',
    priceAmount: '14800000',
    inStock: true,
    categoryTitleFa: 'مراقبت تخصصی پوست و کلینیکال',
    formulation: 'cream',
    concern: 'barrier',
    volume: '۷۵ میلی‌لیتر',
    description: 'فرمولاسیون تقویت لایه چربی محافظ پوست با مادکاسوساید خالص ۹۵٪ و کاهش تبخیر آب ترنس‌اپیدرمال.',
  },
];

export function getClinicalSpecs(item: { slug?: string; title?: string }): ClinicalSpecs {
  const slug = (item.slug ?? '').toLowerCase();
  const title = (item.title ?? '').toLowerCase();

  // 1. Check exact match in CLINICAL_SKINCARE_PRODUCTS
  const exact = CLINICAL_SKINCARE_PRODUCTS[slug];
  if (exact) {
    return {
      brand: exact.brand.name,
      volume: exact.variants[0]?.sizeOrVolume ?? '۵۰۰ میلی‌لیتر',
      activeIngredients: exact.ingredients
        .filter((i) => i.isKeyActive)
        .map((i) => i.nameFa)
        .slice(0, 3),
      clinicalFunction: exact.scienceMechanism?.heading || exact.subtitleFa,
      certifications: exact.clinicalOrigin?.ceIsoStandards?.length
        ? exact.clinicalOrigin.ceIsoStandards
        : exact.cleanBadges.slice(0, 3),
    };
  }

  // 2. Intelligent heuristics based on clinical keywords
  if (slug.includes('carboxypod') || title.includes('پد') || title.includes('pod')) {
    return {
      brand: 'ReeMed Laboratories',
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
    brand: title.includes('reemed') ? 'ReeMed Laboratories' : 'ReeSkin Clinical',
    volume: 'سایز استاندارد کلینیکال',
    activeIngredients: ['کمپلکس بیواکتیو درماتولوژی', 'هیالورونات سدیم', 'ویتامین‌های مغذی پوست'],
    clinicalFunction: 'مراقبت بالینی، تغذیه بافتی و ارتقای سلامت لایه‌های پوستی',
    certifications: ['استاندارد درموسوتیکال UK', 'Cruelty-Free', 'CE Standards'],
  };
}
