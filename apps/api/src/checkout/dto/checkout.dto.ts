import { ArrayMinSize, IsArray, IsIn, IsNumber, IsOptional, IsString, Max, Min, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

/**
 * Per-endpoint DTOs for the money-critical checkout flow (AUTH-004).
 * With the global ValidationPipe (whitelist + forbidNonWhitelisted) these
 * classes give runtime shape enforcement that plain interfaces cannot.
 */

export class QuoteLineDto {
  // Variant ids are slugs in this system (e.g. "var_cbg_pro"), not UUIDs.
  @IsString()
  @MinLength(3)
  variantId!: string;

  @IsNumber()
  @Min(1)
  @Max(999)
  qty!: number;
}

export class AddressSnapshotDto {
  @IsString()
  province!: string;

  @IsString()
  city!: string;

  @IsString()
  postalAddress!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  receiverName!: string;

  @IsString()
  receiverPhone!: string;
}

export class CheckoutSessionDto {
  @IsOptional()
  @IsString()
  storeId?: string;

  @IsOptional()
  @IsString()
  storeSlug?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuoteLineDto)
  items!: QuoteLineDto[];

  @IsString()
  customerPhone!: string;

  @IsString()
  customerName!: string;

  @ValidateNested()
  @Type(() => AddressSnapshotDto)
  address!: AddressSnapshotDto;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class PlaceOrderDto {
  @IsString()
  sessionId!: string;

  @IsIn(["ZARINPAL", "CARD_TO_CARD", "WALLET"])
  paymentMethod!: "ZARINPAL" | "CARD_TO_CARD" | "WALLET";
}
