export type MediaRole = 'HERO' | 'GALLERY' | 'TEXTURE' | 'IN_CLINIC' | 'PACKAGING' | 'HOW_TO' | 'CERTIFICATE';

export interface ProductMediaItem {
  id: string;
  url: string;
  role: MediaRole;
  roleFa: string;
  altText: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  title: string;
  sizeOrVolume: string; // e.g. "50ml", "100ml", "Box of 5"
  priceAmount: string; // Rials string
  originalPriceAmount?: string; // For discount display
  discountPercent?: number;
  currency: string;
  inStock: boolean;
  inventoryQty?: number;
  mediaRoleMatch?: string;
}

export interface IngredientItem {
  nameFa: string;
  inciName: string;
  percentage?: string; // e.g. "5%", "2%"
  purity?: string; // e.g. "99.8% Ph. Eur. / USP Grade"
  cirRating?: string; // e.g. "Safe as Used (CIR Expert Panel)"
  molecularMechanism?: string; // Detailed physiological/biochemical pathway
  casNumber?: string; // e.g. "144-55-8"
  ewgScore?: number; // 1-2 green safe
  comedogenicRating?: number; // 0-5
  purpose: string;
  isKeyActive: boolean;
  description?: string;
}

export interface VisiaMetricItem {
  id: string;
  labelFa: string;
  baseline: string;
  week4Result: string;
  percentageChange: string; // e.g. "+185%", "-42%"
  isImprovement: boolean;
  description: string;
}

export interface ClinicalCaseStudy {
  id: string;
  patientAge: number;
  patientGender: string;
  condition: string;
  protocolDescription: string;
  durationWeeks: number;
  sessionsCount: number;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  visiaMetrics: VisiaMetricItem[];
  dermatologistReview: {
    doctorName: string;
    doctorTitleFa: string;
    medicalLicenseNo: string;
    clinicName: string;
    avatarUrl?: string;
    quote: string;
    verifiedBadge: string;
  };
}

export interface UsageStepItem {
  stepNumber: number;
  title: string;
  instruction: string;
  frequency?: string; // "AM/PM", "هفتگی ۱ الی ۲ بار"
  warning?: string;
}

export interface ClinicalCertificateItem {
  title: string;
  issuer: string;
  certificateCode: string;
  description: string;
  verified: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SkincareBundleItem {
  id: string;
  slug: string;
  title: string;
  brand: string;
  subtitle: string;
  priceAmount: string;
  originalPriceAmount: string;
  discountBadge: string;
  roleInRoutine: string;
  inStock: boolean;
}

export interface ProductDetailedOverview {
  introParagraphs?: string[];
  featuresTitle?: string;
  features?: string[];
  ingredientsTitle?: string;
  keyIngredients?: Array<{
    name: string;
    description: string;
  }>;
  usageTitle?: string;
  usageInstructions?: string;
}

export interface ExtendedProductData {
  id: string;
  slug: string;
  brand: {
    name: string;
    slug: string;
    originCountry: string;
    tagline: string;
  };
  title: string;
  subtitleFa: string;
  scientificName?: string;
  description: string | null;
  formulation: string; // "ژل فعال شونده با پد", "سرم کنسانتره", "ماسک ورقی بیوسلولز"
  skinTypes: string[];
  skinConcerns: string[];
  cleanBadges: string[]; // "فاقد پارابن", "بدون تست حیوانی (Cruelty-Free)", "سازگار با میکروبیوم"
  coldChainRequired?: boolean; // ارسال تحت پروتکل زنجیره سرد
  media: ProductMediaItem[];
  variants: ProductVariantItem[];
  scienceMechanism: {
    heading: string;
    summary: string;
    bohrEffectExplanation: string;
    clinicalBenefits: string[];
    studyReference?: string;
  };
  ingredients: IngredientItem[];
  usageProtocol: {
    routineTime: string; // "پروتکل حرفه‌ای کلینیکال و روتین شبانه"
    steps: UsageStepItem[];
    preProcedure: string;
    postProcedureCare: string;
    warnings: string[];
  };
  clinicalOrigin: {
    certifications: ClinicalCertificateItem[];
    batchCodeVerificationInfo: string;
    storageConditions: string;
    shelfLifeAfterOpening: string;
    ceIsoStandards: string[];
  };
  clinicalCaseStudies?: ClinicalCaseStudy[];
  faqs: FaqItem[];
  bundleRecommendation?: {
    bundleTitle: string;
    bundleDescription: string;
    savingsText: string;
    items: SkincareBundleItem[];
  };
  ratingSummary: {
    ratingValue: number;
    reviewCount: number;
  };
  detailedOverview?: ProductDetailedOverview;
}
