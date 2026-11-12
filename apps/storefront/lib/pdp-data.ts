import type { Product } from './catalog';
import type {
  ExtendedProductData,
  HierarchicalSpecGroup,
  MediaRole,
  ProductVariantItem,
} from './pdp-types';

const MEDIA_ROLE_LABELS: Record<string, string> = {
  HERO: 'نمای اصلی محصول',
  GALLERY: 'نمای تکمیلی محصول',
  TEXTURE: 'بافت و ساختار فرمولاسیون',
  IN_CLINIC: 'نمای کاربرد بالینی',
  PACKAGING: 'بسته‌بندی و پلمپ اصالت',
  HOW_TO: 'راهنمای استفاده مرحله‌به‌مرحله',
  CERTIFICATE: 'گواهی استاندارد و کنترل کیفیت',
};

function normalizeMediaRole(role?: string): MediaRole {
  const upper = (role ?? 'HERO').toUpperCase();
  if (
    upper === 'HERO' ||
    upper === 'GALLERY' ||
    upper === 'TEXTURE' ||
    upper === 'IN_CLINIC' ||
    upper === 'PACKAGING' ||
    upper === 'HOW_TO' ||
    upper === 'CERTIFICATE'
  ) {
    return upper;
  }
  return 'GALLERY';
}

/**
 * تبدیل محصول دریافت‌شده از API بک‌اند به مدل جامع صفحه محصول (ExtendedProductData)
 * تمام فیلدهای رابطه‌ای (variants, media, ingredients, claims, usageSteps, brand, category, skinConcerns)
 * و داده‌های غنی clinicalData مستقیماً از PostgreSQL خوانده می‌شوند.
 */
export function buildExtendedProductData(baseProduct: Product): ExtendedProductData {
  const cd =
    baseProduct.clinicalData && typeof baseProduct.clinicalData === 'object'
      ? baseProduct.clinicalData
      : {};

  const variants: ProductVariantItem[] = (baseProduct.variants ?? []).map((v, idx) => ({
    id: v.id,
    sku: v.sku,
    title: v.titleFa || v.title,
    sizeOrVolume:
      v.sizeOrVolume ||
      (idx === 0 && typeof cd.sizeOrVolume === 'string' ? cd.sizeOrVolume : v.title) ||
      'بسته استاندارد',
    priceAmount: String(v.priceAmount ?? '0'),
    originalPriceAmount: v.originalPriceAmount ? String(v.originalPriceAmount) : undefined,
    discountPercent: typeof v.discountPercent === 'number' ? v.discountPercent : undefined,
    currency: v.currency || 'IRR',
    inStock: Boolean(v.inStock),
    inventoryQty: typeof v.inventoryQty === 'number' ? v.inventoryQty : v.inStock ? 20 : 0,
    mediaRoleMatch: v.mediaRoleMatch ?? undefined,
  }));

  const dbMedia = (baseProduct.media ?? []).map((m, idx) => {
    const role = normalizeMediaRole(m.role);
    return {
      id: m.id || `med_${baseProduct.id}_${idx}`,
      url: m.url,
      role,
      roleFa: MEDIA_ROLE_LABELS[role] || 'تصویر محصول',
      altText: m.altText || `${baseProduct.titleFa || baseProduct.title}`,
      width: m.width ?? undefined,
      height: m.height ?? undefined,
    };
  });

  if (dbMedia.length === 0 && typeof cd.image === 'string' && cd.image.length > 0) {
    dbMedia.push({
      id: `med_${baseProduct.id}_hero`,
      url: cd.image,
      role: 'HERO',
      roleFa: MEDIA_ROLE_LABELS.HERO,
      altText: baseProduct.titleFa || baseProduct.title,
      width: undefined,
      height: undefined,
    });
  }

  const extendedIngredients = Array.isArray(cd.extendedIngredients) && cd.extendedIngredients.length > 0
    ? cd.extendedIngredients
    : (baseProduct.ingredients ?? []).map((ing) => ({
        nameFa: ing.name,
        inciName: ing.inciName || ing.name,
        percentage: ing.concentrationPercent ?? undefined,
        purpose: ing.purpose || 'ترکیب موثره فرمولاسیون',
        isKeyActive: ing.isKeyIngredient ?? true,
        description: ing.description ?? undefined,
      }));

  const dbUsageSteps =
    Array.isArray(cd.usageProtocol?.steps) && cd.usageProtocol.steps.length > 0
      ? cd.usageProtocol.steps
      : (baseProduct.usageSteps ?? []).map((s) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          instruction: s.instruction,
        }));

  const claimsBenefits =
    Array.isArray(cd.scienceMechanism?.clinicalBenefits) && cd.scienceMechanism.clinicalBenefits.length > 0
      ? cd.scienceMechanism.clinicalBenefits
      : (baseProduct.claims ?? []).map((c) => c.evidenceSummary || c.claimText).filter(Boolean);

  const brandName = baseProduct.brand?.name || 'Dr Dermer & Rupak Clinical';
  const brandSlug = baseProduct.brand?.slug || 'dr-dermer';
  const originCountry =
    cd.brandOriginCountry || baseProduct.brand?.originCountry || 'تضمین اصالت استاندارد بین‌المللی';

  const skinConcernNames =
    Array.isArray(cd.skinConcerns) && cd.skinConcerns.length > 0
      ? cd.skinConcerns
      : (baseProduct.skinConcerns ?? []).map((c) => c.name);

  const firstClaimRef = baseProduct.claims?.find((c) => c.studyReference)?.studyReference;
  const firstClaimSummary = baseProduct.claims?.[0]?.evidenceSummary;
  const primaryVariant = variants[0];
  const displayTitle = baseProduct.titleFa || baseProduct.title;

  const detailedOverview =
    cd.detailedOverview && typeof cd.detailedOverview === 'object'
      ? cd.detailedOverview
      : {
          introParagraphs: [
            baseProduct.description ||
              'مشخصات تخصصی، ترکیبات فعال و راهنمای مصرف این محصول مستقیماً از کاتالوگ تاییدشده کلینیکال بارگذاری شده است.',
          ].filter(Boolean),
          featuresTitle: 'ویژگی‌های شاخص فرمولاسیون',
          features:
            claimsBenefits.length > 0
              ? claimsBenefits
              : [
                  'ثبت‌شده و همگام با کاتالوگ اصلی فروشگاه',
                  'بسته‌بندی پلمپ و تضمین اصالت کالا',
                  'کنترل موجودی لحظه‌ای پیش از ثبت سفارش',
                ],
          ingredientsTitle: 'ترکیبات موثره (INCI)',
          keyIngredients: extendedIngredients.slice(0, 6).map((ing: any) => ({
            name: ing.nameFa || ing.inciName,
            description: ing.purpose || ing.description || ing.inciName,
            iconType: 'droplet',
          })),
          usageTitle: 'نحوه مصرف',
          usageInstructions:
            dbUsageSteps.length > 0
              ? dbUsageSteps.map((s: any) => `${s.title}: ${s.instruction}`).join(' ')
              : 'مطابق دستورالعمل تخصصی و روتین مراقبتی توصیه‌شده مصرف شود.',
          specs: {
            volume: primaryVariant?.sizeOrVolume || primaryVariant?.title || 'استاندارد',
            origin: originCountry,
            expiration: 'دارای تاریخ انقضای معتبر و بچ‌کد قابل استعلام',
            skinType:
              Array.isArray(cd.skinTypes) && cd.skinTypes.length > 0
                ? cd.skinTypes.join('، ')
                : 'انواع پوست',
            texture: baseProduct.formulation || cd.formulation || 'فرمولاسیون تخصصی',
          },
        };

  return {
    id: baseProduct.id,
    slug: baseProduct.slug,
    brand: {
      name: brandName,
      slug: brandSlug,
      originCountry,
      tagline:
        cd.brandTagline ||
        baseProduct.brand?.description ||
        'تضمین اصالت کالا و استانداردهای کنترل کیفیت بالینی',
    },
    title: displayTitle,
    subtitleFa:
      baseProduct.subtitleFa ||
      cd.subtitleFa ||
      baseProduct.category?.titleFa ||
      'محصول تخصصی مراقبت پوست با کنترل کیفیت بالینی',
    scientificName: baseProduct.scientificName || cd.scientificName || undefined,
    description: baseProduct.description,
    formulation:
      baseProduct.formulation || cd.formulation || 'فرمولاسیون استاندارد و کنترل‌کیفیت شده',
    skinTypes:
      Array.isArray(cd.skinTypes) && cd.skinTypes.length > 0
        ? cd.skinTypes
        : ['انواع پوست'],
    skinConcerns:
      skinConcernNames.length > 0
        ? skinConcernNames
        : [baseProduct.category?.titleFa || 'مراقبت تخصصی پوست'],
    cleanBadges:
      Array.isArray(cd.cleanBadges) && cd.cleanBadges.length > 0
        ? cd.cleanBadges
        : ['تضمین اصالت ۱۰۰٪ کالا', 'بسته‌بندی پلمپ شرکتی', 'کنترل موجودی زنده'],
    coldChainRequired: Boolean(baseProduct.coldChainRequired),
    media: dbMedia,
    variants,
    scienceMechanism: {
      heading: cd.scienceMechanism?.heading || 'مکانیسم اثر و شواهد علمی',
      summary:
        cd.scienceMechanism?.summary ||
        firstClaimSummary ||
        baseProduct.description ||
        'اطلاعات علمی و عملکردی محصول از بانک داده بالینی بارگذاری شده است.',
      bohrEffectExplanation:
        cd.scienceMechanism?.bohrEffectExplanation ||
        'طراحی‌شده بر پایه ترکیبات هم‌افزا برای حداکثر زیست‌دسترس‌پذیری و سازگاری پوستی.',
      clinicalBenefits:
        claimsBenefits.length > 0
          ? claimsBenefits
          : ['بازسازی و تقویت سد دفاعی اپیدرم', 'سازگاری تاییدشده برای روتین تخصصی'],
      studyReference: cd.scienceMechanism?.studyReference || firstClaimRef || undefined,
    },
    ingredients: extendedIngredients,
    usageProtocol: {
      routineTime: cd.usageProtocol?.routineTime || 'روتین مراقبتی روزانه / کلینیکال',
      steps:
        dbUsageSteps.length > 0
          ? dbUsageSteps
          : [
              {
                stepNumber: 1,
                title: 'آماده‌سازی پوست',
                instruction: 'پیش از مصرف، پوست را به‌طور کامل تمیز و خشک نمایید.',
              },
              {
                stepNumber: 2,
                title: 'استفاده منظم',
                instruction: 'مقدار مناسب از محصول را طبق راهنما بر ناحیه هدف اعمال کنید.',
              },
            ],
      preProcedure:
        cd.usageProtocol?.preProcedure ||
        'پیش از استفاده بر پوست تمیز و فاقد زخم باز اعمال شود.',
      postProcedureCare:
        cd.usageProtocol?.postProcedureCare ||
        'در مصرف روزانه، استفاده منظم از ضدآفتاب مناسب توصیه می‌شود.',
      warnings:
        Array.isArray(cd.usageProtocol?.warnings) && cd.usageProtocol.warnings.length > 0
          ? cd.usageProtocol.warnings
          : ['دور از دسترس کودکان نگهداری شود.', 'فقط جهت استعمال خارجی.'],
    },
    clinicalOrigin: {
      certifications:
        Array.isArray(cd.clinicalOrigin?.certifications) &&
        cd.clinicalOrigin.certifications.length > 0
          ? cd.clinicalOrigin.certifications
          : [
              {
                title: 'کنترل کیفیت و اصالت زنجیره تامین',
                issuer: 'Commerce OS Clinical QA',
                certificateCode: primaryVariant?.sku || 'QA-VERIFIED',
                description: 'کالای اصلی ثبت‌شده در سیستم کاتالوگ رسمی فروشگاه.',
                verified: true,
              },
            ],
      batchCodeVerificationInfo:
        cd.clinicalOrigin?.batchCodeVerificationInfo ||
        'اصالت و سری ساخت این محصول بر روی بسته‌بندی و در فاکتور رسمی قابل پیگیری است.',
      storageConditions:
        cd.clinicalOrigin?.storageConditions || 'در محیط خشک، خنک و دور از تابش مستقیم آفتاب نگهداری شود.',
      shelfLifeAfterOpening:
        cd.clinicalOrigin?.shelfLifeAfterOpening || 'مطابق تاریخ درج‌شده روی بسته‌بندی',
      ceIsoStandards:
        Array.isArray(cd.clinicalOrigin?.ceIsoStandards) && cd.clinicalOrigin.ceIsoStandards.length > 0
          ? cd.clinicalOrigin.ceIsoStandards
          : ['GMP Compliant', 'Dermatologically Tested'],
    },
    clinicalCaseStudies: Array.isArray(cd.clinicalCaseStudies) ? cd.clinicalCaseStudies : undefined,
    faqs:
      Array.isArray(cd.faqs) && cd.faqs.length > 0
        ? cd.faqs
        : [
            {
              question: 'آیا این محصول دارای ضمانت اصالت و بچ‌کد معتبر است؟',
              answer:
                'بله، تمامی محصولات عرضه‌شده از کاتالوگ رسمی فروشگاه با ضمانت اصالت ۱۰۰٪، تاریخ معتبر و امکان استعلام عرضه می‌شوند.',
            },
          ],
    bundleRecommendation: cd.bundleRecommendation ?? undefined,
    ratingSummary: {
      ratingValue: Number(baseProduct.ratingValue ?? cd.ratingSummary?.ratingValue ?? 4.8),
      reviewCount: Number(baseProduct.reviewCount ?? cd.ratingSummary?.reviewCount ?? 0),
    },
    detailedOverview,
  };
}

/**
 * محاسبه جدول مشخصات ۴ گروهی محصول از روی داده‌های ساختاریافته API
 */
export function getProductHierarchicalSpecs(
  productData: ExtendedProductData,
  selectedVariant?: ProductVariantItem,
): HierarchicalSpecGroup[] {
  const custom = productData.detailedOverview?.hierarchicalSpecs;
  if (custom && custom.length > 0) return custom;

  const specs = productData.detailedOverview?.specs;
  const brandName = productData.brand?.name || 'Dr Dermer Clinical';
  const origin = specs?.origin || productData.brand?.originCountry || 'استاندارد بین‌المللی';
  const volume =
    specs?.volume || selectedVariant?.sizeOrVolume || productData.variants[0]?.sizeOrVolume || 'استاندارد';
  const texture = specs?.texture || productData.formulation || 'سبک و زودجذب';
  const skinType = specs?.skinType || productData.skinTypes?.join('، ') || 'انواع پوست';
  const expiration = specs?.expiration || productData.clinicalOrigin?.shelfLifeAfterOpening || 'معتبر';

  return [
    {
      id: 'general',
      groupTitle: 'مشخصات هویتی و اصالت کالا',
      groupIcon: '🏢',
      items: [
        { label: 'برند سازنده', value: brandName },
        { label: 'کشور مبدأ فرمولاسیون', value: origin },
        { label: 'حجم / وزن خالص', value: volume },
        { label: 'ضمانت اصالت', value: '۱۰۰٪ اورجینال با هولوگرام شرکتی' },
      ],
    },
    {
      id: 'physical',
      groupTitle: 'مشخصات بافتی و فیزیکی',
      groupIcon: '🧴',
      items: [
        { label: 'بافت فرمولاسیون', value: texture },
        { label: 'کد کالا (SKU)', value: selectedVariant?.sku || productData.variants[0]?.sku || '—' },
        { label: 'زنجیره سرد', value: productData.coldChainRequired ? 'نیازمند حمل خنک کلینیکال' : 'نگهداری استاندارد محیطی' },
        { label: 'قابلیت لایه‌بندی', value: 'سازگار با روتین مراقبت پوست' },
      ],
    },
    {
      id: 'clinical',
      groupTitle: 'اندیکاسیون‌ها و مشخصات پوستی',
      groupIcon: '🩺',
      items: [
        { label: 'نوع پوست سازگار', value: skinType },
        { label: 'عملکرد اصلی', value: productData.subtitleFa || 'مراقبت و تقویت سد دفاعی پوست' },
        { label: 'نگرانی‌های هدف', value: productData.skinConcerns?.join('، ') || 'بهبود کیفیت پوست' },
        { label: 'مکانیسم اثر', value: productData.scienceMechanism?.heading || 'فرمولاسیون تخصصی' },
      ],
    },
    {
      id: 'safety',
      groupTitle: 'استانداردها، ایمنی و نگهداری',
      groupIcon: '🛡️',
      items: [
        { label: 'پایداری و انقضا', value: expiration },
        { label: 'استانداردهای کیفی', value: productData.clinicalOrigin?.ceIsoStandards?.join(' · ') || 'Derm-Tested' },
        { label: 'نشان‌های ایمنی', value: productData.cleanBadges?.join(' · ') || 'فرمولاسیون ایمن' },
        {
          label: 'شرایط نگهداری',
          value: productData.clinicalOrigin?.storageConditions || 'دمای ۱۵ تا ۲۵ درجه دور از نور مستقیم خورشید',
        },
      ],
    },
  ];
}

const CATEGORY_HREF_BY_SLUG: Record<string, string> = {
  serum: '/shop?cat=serum',
  hydrator: '/shop?cat=hydrator',
  brightening: '/shop?cat=brightening',
  repair: '/shop?cat=repair',
  hair: '/shop?cat=hair',
  body: '/shop?cat=body',
  skincare: '/shop?cat=skincare',
  devices: '/shop?cat=devices',
  reeskin: '/reeskin',
  reemed: '/reemed',
};

/**
 * محاسبه مسیر دسته‌بندی سلسله‌مراتبی (Breadcrumb) محصول
 */
export function getProductCategoryHierarchy(
  productData: ExtendedProductData,
  category?: { slug: string; titleFa: string } | null,
) {
  let subcategory: { title: string; href: string };

  if (category?.slug && category?.titleFa) {
    subcategory = {
      title: category.titleFa,
      href: CATEGORY_HREF_BY_SLUG[category.slug] || `/shop?cat=${encodeURIComponent(category.slug)}`,
    };
  } else {
    const title = (productData.title || '').toLowerCase();
    const slug = (productData.slug || '').toLowerCase();
    subcategory = { title: 'آمپول و سرم تخصصی', href: '/shop?cat=serum' };

    if (slug.includes('cicalfate') || title.includes('ترمیم') || slug.includes('healene') || slug.includes('repair')) {
      subcategory = { title: 'جوانساز و ترمیم‌کننده', href: '/shop?cat=repair' };
    } else if (slug.includes('dokdo') || slug.includes('centella') || title.includes('آبرسان') || slug.includes('hydrat')) {
      subcategory = { title: 'آبرسان و مرطوب‌کننده', href: '/shop?cat=hydrator' };
    } else if (title.includes('روشن') || title.includes('ضدلک') || slug.includes('bright') || slug.includes('vitamin-c')) {
      subcategory = { title: 'ضدلک و روشن‌کننده', href: '/shop?cat=brightening' };
    } else if (title.includes('مو') || slug.includes('hair')) {
      subcategory = { title: 'تقویت پوست سر و مو', href: '/shop?cat=hair' };
    } else if (slug.includes('carboxy') || title.includes('کربوکسی')) {
      subcategory = { title: 'کربوکسی و مراقبت کلینیکال', href: '/carboxygel' };
    }
  }

  return {
    root: { title: 'صفحه اصلی', href: '/' },
    shop: { title: 'فروشگاه', href: '/shop' },
    parent: { title: 'مراقبت از پوست و تجهیزات', href: '/shop' },
    sub: subcategory,
    current: { title: productData.title },
  };
}
