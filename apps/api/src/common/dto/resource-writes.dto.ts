import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
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

  @IsIn(["PERCENT", "FIXED"])
  type!: "PERCENT" | "FIXED";

  @IsNumber()
  @Min(1)
  value!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountTomans?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseTomans?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  storeSlug?: string;
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

// ── Admin ERP product authoring (canonical money = RIALS, integer) ──
// Money/stock live on the default ProductVariant (+ InventoryLevel), not on Product.

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  storeSlug!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @MinLength(2)
  titleFa!: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  categoryFa?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsInt()
  @Min(1)
  priceRials!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  compareAtPriceRials?: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED"])
  status?: "DRAFT" | "PUBLISHED";

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  coldChain?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsIn(["PHYSICAL", "DIGITAL"])
  kind?: "PHYSICAL" | "DIGITAL";
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  storeSlug?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  titleFa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  categoryFa?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  priceRials?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  compareAtPriceRials?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED"])
  status?: "DRAFT" | "PUBLISHED";

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  coldChain?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsIn(["PHYSICAL", "DIGITAL"])
  kind?: "PHYSICAL" | "DIGITAL";
}

// Flag-only bulk edit: price/stock are deliberately NOT whitelisted here — the
// global forbidNonWhitelisted pipe rejects them before the service runs.
export class BulkUpdateProductsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID(undefined, { each: true })
  ids!: string[];

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
