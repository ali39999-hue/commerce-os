import { resolveProductImage, resolveVariant, type Product } from './catalog';

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
  variantId?: string;
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
  image?: string;
}

/**
 * تبدیل محصول دریافت‌شده از دیتابیس به آیتم استاندارد برای مقایسه، جستجو و علاقه‌مندی‌ها
 */
export function toClinicalCatalogItem(product: Product): CuratedProductItem {
  const variant = resolveVariant(product);
  const firstConcern =
    product.skinConcerns?.[0]?.name ||
    (Array.isArray(product.clinicalData?.skinConcerns)
      ? product.clinicalData.skinConcerns[0]
      : null) ||
    product.category?.titleFa ||
    'مراقبت تخصصی پوست';

  return {
    id: product.id,
    slug: product.slug,
    variantId: variant?.id,
    title: product.titleFa || product.title,
    brand: product.brand?.name || 'Dr Dermer Clinical',
    sku: variant?.sku || product.slug.toUpperCase(),
    priceAmount: String(variant?.priceAmount ?? '0'),
    inStock: Boolean(variant?.inStock),
    categoryTitleFa: product.category?.titleFa || 'محصول تخصصی',
    formulation:
      product.formulation ||
      product.clinicalData?.formulation ||
      'فرمولاسیون درماتولوژیک استاندارد',
    concern: String(firstConcern),
    volume:
      variant?.sizeOrVolume ||
      variant?.titleFa ||
      variant?.title ||
      product.clinicalData?.sizeOrVolume ||
      'استاندارد',
    description:
      product.description ||
      product.subtitleFa ||
      'فرمولاسیون تخصصی تاییدشده با ضمانت اصالت کالا',
    image: resolveProductImage(product),
  };
}

/**
 * استخراج مشخصات بالینی و فرمولاسیون محصول (اولویت با داده‌های واقعی دیتابیس،
 * سپس fallback سبک برای آیتم‌های ذخیره‌شده قدیمی در مرورگر)
 */
export function getClinicalSpecs(item: {
  slug?: string;
  title?: string;
  product?: Product | null;
}): ClinicalSpecs {
  const product = item.product;
  if (product) {
    const cd = product.clinicalData ?? {};
    const variant = resolveVariant(product);
    const dbIngredients = (product.ingredients ?? [])
      .filter((i) => i.isKeyIngredient !== false)
      .map((i) => (i.concentrationPercent ? `${i.name} (${i.concentrationPercent})` : i.name))
      .slice(0, 3);
    const extendedIngs = Array.isArray(cd.extendedIngredients)
      ? cd.extendedIngredients
          .filter((i: any) => i.isKeyActive !== false)
          .map((i: any) => i.nameFa || i.inciName)
          .slice(0, 3)
      : [];

    const activeIngredients =
      dbIngredients.length > 0
        ? dbIngredients
        : extendedIngs.length > 0
        ? extendedIngs
        : ['کمپلکس اکتیو کلینیکال استاندارد'];

    const certs = Array.isArray(cd.clinicalOrigin?.ceIsoStandards)
      ? cd.clinicalOrigin.ceIsoStandards
      : Array.isArray(cd.cleanBadges)
      ? cd.cleanBadges.slice(0, 3)
      : ['تضمین اصالت اورجینال', 'کنترل کیفیت آزمایشگاهی'];

    return {
      brand: product.brand?.name || 'Dr Dermer Clinical',
      volume: variant?.sizeOrVolume || variant?.titleFa || variant?.title || 'استاندارد',
      activeIngredients,
      clinicalFunction:
        cd.scienceMechanism?.heading ||
        product.claims?.[0]?.claimText ||
        product.subtitleFa ||
        'بهبود سلامت و سد دفاعی پوست',
      certifications: certs,
    };
  }

  const slug = (item.slug ?? '').toLowerCase();
  const title = (item.title ?? '').toLowerCase();

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
      activeIngredients: ['رتینول خالص انکپسوله', 'باکوچیول گیاهی', 'ویتامین E توکوفرول'],
      clinicalFunction: 'تسریع نوسازی اپیدرم، کلاژن‌سازی و رفع هایپرپیگمنتیشن',
      certifications: ['Dermatologist Approved', 'فاقد پارابن', 'GMP Certified'],
    };
  }

  if (slug.includes('serum') || title.includes('سرم') || title.includes('آمپول')) {
    return {
      brand: 'Clinical Skincare',
      volume: '۵۰ میلی‌لیتر',
      activeIngredients: ['هیالورونیک اسید چندوزنی', 'نیاسینامید خالص', 'عصاره سنتلا آسیاتیکا'],
      clinicalFunction: 'آبرسانی عمقی، تقویت سد دفاعی و روشن‌سازی اپیدرم',
      certifications: ['Hypoallergenic Clinical', 'تست درماتولوژی', 'فاقد عطر مصنوعی'],
    };
  }

  return {
    brand: title.includes('reemed') ? 'ReeMed Medical Pro' : 'ReeSkin Clinical',
    volume: 'سایز استاندارد کلینیکال',
    activeIngredients: ['کمپلکس بیواکتیو درماتولوژی', 'هیالورونات سدیم', 'ویتامین‌های مغذی پوست'],
    clinicalFunction: 'مراقبت بالینی، تغذیه بافتی و ارتقای سلامت لایه‌های پوستی',
    certifications: ['استاندارد درموسوتیکال UK', 'Cruelty-Free', 'CE Standards'],
  };
}

/**
 * مسیر صفحه اختصاصی محصول (در صورت وجود صفحه کلینیکال اختصاصی) یا صفحه عمومی محصول
 */
export function getCanonicalProductHref(slug?: string | null): string {
  if (!slug) return '/search';
  const clean = slug.toLowerCase().trim();
  const dedicatedRoutes = new Set([
    'carboxygel',
    'carboxypod',
    'carboxypad',
    'crystalene',
    'healene',
    'silicalene',
    'carbox',
    'plasmax',
  ]);
  if (dedicatedRoutes.has(clean)) {
    return `/${clean}`;
  }
  return `/products/${encodeURIComponent(clean)}`;
}
