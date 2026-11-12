import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

/**
 * AUTH-004 DTOs for admin/customer resource writes. Every field a service
 * consumes is declared and validated at runtime; unknown keys are rejected
 * by the global forbidNonWhitelisted ValidationPipe.
 */

export class CreateCouponDto {
  @IsString()
  @MinLength(2)
  code!: string;

  @IsOptional()
  @IsString()
  titleFa?: string;

  @IsIn(["PERCENT", "FIXED"])
  type!: "PERCENT" | "FIXED";

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  value!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscountTomans?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPurchaseTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  perUserLimit?: number;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  storeSlug?: string;

  @IsOptional()
  @IsIn(["PUBLIC", "B2B_CLINIC", "VISITOR_EXCLUSIVE", "SPECIFIC_PHONE"])
  audienceType?: "PUBLIC" | "B2B_CLINIC" | "VISITOR_EXCLUSIVE" | "SPECIFIC_PHONE";

  @IsOptional()
  @IsIn(["ALL", "B2C", "B2B"])
  customerSegment?: "ALL" | "B2C" | "B2B";

  @IsOptional()
  @IsBoolean()
  b2bOnly?: boolean;

  @IsOptional()
  @IsString()
  clinicName?: string;

  @IsOptional()
  @IsString()
  clinicLicenseNumber?: string;

  @IsOptional()
  @IsString()
  visitorName?: string;

  @IsOptional()
  @IsString()
  visitorCode?: string;

  @IsOptional()
  @IsString()
  visitorPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedPhones?: string[];
}

export class ValidateCouponDto {
  @IsString()
  @MinLength(2)
  code!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalRials?: number;

  @IsOptional()
  @IsString()
  storeSlug?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsIn(["B2C", "B2B", "B2B_CLINIC"])
  customerType?: "B2C" | "B2B" | "B2B_CLINIC";

  @IsOptional()
  @IsString()
  medicalLicenseNumber?: string;
}

export class SyncCartItemDto {
  @IsString()
  @MinLength(3)
  variantId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(999)
  qty!: number;

  @IsOptional()
  @IsString()
  titleFa?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPriceTomans?: number;
}

export class SyncCartDto {
  @IsString()
  @MinLength(4)
  sessionId!: string;

  @IsOptional()
  @IsString()
  storeSlug?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCartItemDto)
  items!: SyncCartItemDto[];

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsIn(["B2C", "B2B", "B2B_CLINIC"])
  customerType?: "B2C" | "B2B" | "B2B_CLINIC";

  @IsOptional()
  @IsIn(["BROWSING", "CART_REVIEW", "CHECKOUT_STARTED", "SHIPPING_SELECTED", "PAYMENT_INITIATED", "ORDER_PLACED", "ABANDONED"])
  stage?: "BROWSING" | "CART_REVIEW" | "CHECKOUT_STARTED" | "SHIPPING_SELECTED" | "PAYMENT_INITIATED" | "ORDER_PLACED" | "ABANDONED";

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalTomans?: number;
}

export class UpdateCartStageDto {
  @IsString()
  @MinLength(4)
  sessionId!: string;

  @IsOptional()
  @IsString()
  storeSlug?: string;

  @IsIn(["BROWSING", "CART_REVIEW", "CHECKOUT_STARTED", "SHIPPING_SELECTED", "PAYMENT_INITIATED", "ORDER_PLACED", "ABANDONED"])
  stage!: "BROWSING" | "CART_REVIEW" | "CHECKOUT_STARTED" | "SHIPPING_SELECTED" | "PAYMENT_INITIATED" | "ORDER_PLACED" | "ABANDONED";

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsIn(["B2C", "B2B", "B2B_CLINIC"])
  customerType?: "B2C" | "B2B" | "B2B_CLINIC";

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalTomans?: number;
}

export class WalletOperationDto {
  @IsNumber()
  @Min(1)
  amountRials!: number;

  @IsString()
  refType!: string;

  @IsString()
  refId!: string;

  @IsString()
  description!: string;
}

export class LoyaltyAdjustDto {
  @IsOptional()
  @IsNumber()
  pointsDelta?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  actor?: string;
}

export class OrderTransitionDto {
  @IsString()
  toStatus!: string;

  @IsOptional()
  @IsString()
  actor?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class PaymentInitiateDto {
  @IsOptional()
  @IsString()
  callbackBaseUrl?: string;
}

export class ReceiptSubmitDto {
  @IsString()
  referenceNumber!: string;

  @IsOptional()
  @IsString()
  payerCardNumber?: string;

  @IsOptional()
  @IsString()
  receiptImageUrl?: string;
}

export class ReceiptApproveDto {
  @IsOptional()
  @IsString()
  reviewer?: string;
}

export class ReceiptRejectDto {
  @IsOptional()
  @IsString()
  reviewer?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class SubscriptionCreateDto {
  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  quantity?: number;
}

export class ReviewCreateDto {
  @IsString()
  @MinLength(2)
  authorName!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(3)
  body!: string;
}

export class B2bQuoteRequestDto {
  @IsString()
  @MinLength(2)
  companyName!: string;

  @IsString()
  @MinLength(2)
  contactName!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @MinLength(3)
  itemsSummary!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  desiredQty?: number;
}

export class B2bQuoteStatusDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class AdminIngredientInputDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  inciName?: string | null;

  @IsOptional()
  @IsString()
  concentrationPercent?: string | null;

  @IsOptional()
  @IsString()
  purpose?: string | null;

  @IsOptional()
  @IsBoolean()
  isKeyIngredient?: boolean;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

export class AdminClaimInputDto {
  @IsString()
  @MinLength(2)
  claimText!: string;

  @IsOptional()
  @IsString()
  evidenceSummary?: string | null;

  @IsOptional()
  @IsString()
  studyReference?: string | null;

  @IsOptional()
  @IsString()
  approvedBy?: string | null;

  @IsOptional()
  @IsIn(["APPROVED", "DRAFT", "REVIEW_REQUIRED"])
  status?: "APPROVED" | "DRAFT" | "REVIEW_REQUIRED";
}

export class AdminUsageStepInputDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stepNumber?: number;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  instruction!: string;

  @IsOptional()
  @IsString()
  iconOrImageUrl?: string | null;
}

export class CreateAdminProductDto {
  @IsString()
  @MinLength(2)
  titleFa!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  subtitleFa?: string | null;

  @IsOptional()
  @IsString()
  scientificName?: string | null;

  @IsOptional()
  @IsString()
  formulation?: string | null;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsOptional()
  @IsString()
  brandId?: string | null;

  @IsOptional()
  @IsString()
  brandName?: string | null;

  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsString()
  categorySlug?: string | null;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priceTomans!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  originalPriceTomans?: number | null;

  @IsOptional()
  @IsString()
  sku?: string | null;

  @IsOptional()
  @IsString()
  sizeOrVolume?: string | null;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  inci?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminIngredientInputDto)
  ingredients?: AdminIngredientInputDto[];

  @IsOptional()
  @IsString()
  claim?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminClaimInputDto)
  claims?: AdminClaimInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminUsageStepInputDto)
  usageSteps?: AdminUsageStepInputDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  concernSlugs?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isSpecialOffer?: boolean;

  @IsOptional()
  @IsBoolean()
  isNewest?: boolean;

  @IsOptional()
  @IsBoolean()
  coldChainRequired?: boolean;

  @IsOptional()
  @IsObject()
  clinicalData?: Record<string, unknown> | null;
}

export class UpdateAdminProductPriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priceTomans!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  originalPriceTomans?: number | null;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsString()
  variantId?: string;
}

export class UpdateAdminProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  titleFa?: string;

  @IsOptional()
  @IsString()
  subtitleFa?: string | null;

  @IsOptional()
  @IsString()
  scientificName?: string | null;

  @IsOptional()
  @IsString()
  formulation?: string | null;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsString()
  brandId?: string | null;

  @IsOptional()
  @IsString()
  brandName?: string | null;

  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsString()
  categorySlug?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priceTomans?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  originalPriceTomans?: number | null;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  newIngredient?: string | null;

  @IsOptional()
  @IsString()
  newClaim?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminIngredientInputDto)
  ingredients?: AdminIngredientInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminClaimInputDto)
  claims?: AdminClaimInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminUsageStepInputDto)
  usageSteps?: AdminUsageStepInputDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  concernSlugs?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isSpecialOffer?: boolean;

  @IsOptional()
  @IsBoolean()
  isNewest?: boolean;

  @IsOptional()
  @IsBoolean()
  coldChainRequired?: boolean;

  @IsOptional()
  @IsObject()
  clinicalData?: Record<string, unknown> | null;
}

export class RestockInventoryDto {
  @IsOptional()
  @IsString()
  variantId?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  warehouseCode?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100000)
  quantityDelta!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
