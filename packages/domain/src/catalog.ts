export type MediaRole =
  | "HERO"
  | "GALLERY"
  | "LIFESTYLE"
  | "DETAIL"
  | "HOW_TO"
  | "CERTIFICATE";

export type ClinicalClaimStatus = "APPROVED" | "DRAFT" | "REVIEW_REQUIRED";

export interface ProductMediaDto {
  id: string;
  role: MediaRole;
  sortOrder: number;
  altText: string | null;
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  isPrimary: boolean;
  variantId?: string | null;
}

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  originCountry: string | null;
}

export interface ProductIngredientDto {
  id: string;
  name: string;
  inciName: string | null;
  concentrationPercent: string | null;
  purpose: string | null;
  isKeyIngredient: boolean;
  description: string | null;
  sortOrder: number;
}

export interface SkinConcernDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
}

export interface ClinicalClaimDto {
  id: string;
  claimText: string;
  evidenceSummary: string | null;
  studyReference: string | null;
  approvedBy: string | null;
  status: ClinicalClaimStatus;
}

export interface UsageStepDto {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  iconOrImageUrl: string | null;
}
