import { IsIn, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

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
