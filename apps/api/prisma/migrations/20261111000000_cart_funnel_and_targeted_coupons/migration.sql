-- Idempotent migration for live Cart Funnel ERP tracking and B2B/Clinic/Visitor Coupon targeting
DO $$
BEGIN
  CREATE TYPE "CouponAudienceType" AS ENUM ('PUBLIC', 'B2B_CLINIC', 'VISITOR_EXCLUSIVE', 'SPECIFIC_PHONE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "CartStage" AS ENUM ('BROWSING', 'CART_REVIEW', 'CHECKOUT_STARTED', 'SHIPPING_SELECTED', 'PAYMENT_INITIATED', 'ORDER_PLACED', 'ABANDONED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Extend carts for real-time ERP funnel telemetry
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "customerName" VARCHAR(150);
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "customerPhone" VARCHAR(20);
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "customerType" VARCHAR(20) NOT NULL DEFAULT 'B2C';
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "stage" "CartStage" NOT NULL DEFAULT 'BROWSING';
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "couponCode" VARCHAR(50);
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "shippingMethod" VARCHAR(60);
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "subtotalAmount" DECIMAL(20,0) NOT NULL DEFAULT 0;
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "discountAmount" DECIMAL(20,0) NOT NULL DEFAULT 0;
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "totalAmount" DECIMAL(20,0) NOT NULL DEFAULT 0;
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "convertedOrderId" UUID;
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "convertedOrderNumber" VARCHAR(50);
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "lastActivityAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "carts_tenantId_storeId_sessionId_key" ON "carts"("tenantId", "storeId", "sessionId");
CREATE INDEX IF NOT EXISTS "carts_tenantId_storeId_stage_lastActivityAt_idx" ON "carts"("tenantId", "storeId", "stage", "lastActivityAt");

-- Extend cart_lines snapshot metadata
ALTER TABLE "cart_lines" ADD COLUMN IF NOT EXISTS "titleFa" VARCHAR(250);
ALTER TABLE "cart_lines" ADD COLUMN IF NOT EXISTS "sku" VARCHAR(100);
ALTER TABLE "cart_lines" ADD COLUMN IF NOT EXISTS "unitPrice" DECIMAL(20,0);

-- Extend checkout_sessions metadata
ALTER TABLE "checkout_sessions" ADD COLUMN IF NOT EXISTS "customerName" VARCHAR(150);
ALTER TABLE "checkout_sessions" ADD COLUMN IF NOT EXISTS "customerPhone" VARCHAR(20);
ALTER TABLE "checkout_sessions" ADD COLUMN IF NOT EXISTS "customerType" VARCHAR(20) NOT NULL DEFAULT 'B2C';
ALTER TABLE "checkout_sessions" ADD COLUMN IF NOT EXISTS "couponCode" VARCHAR(50);

-- Extend orders attribution & channel separation
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerType" VARCHAR(20) NOT NULL DEFAULT 'B2C';
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "couponCode" VARCHAR(50);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "visitorCode" VARCHAR(60);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "clinicName" VARCHAR(200);

-- Extend coupons for non-destructive toggle & B2B/Clinic/Visitor targeting
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "titleFa" VARCHAR(200);
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "audienceType" "CouponAudienceType" NOT NULL DEFAULT 'PUBLIC';
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "customerSegment" VARCHAR(20) NOT NULL DEFAULT 'ALL';
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "b2bOnly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "clinicName" VARCHAR(200);
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "clinicLicenseNumber" VARCHAR(60);
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "visitorName" VARCHAR(150);
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "visitorCode" VARCHAR(60);
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "visitorPhone" VARCHAR(20);
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "allowedPhones" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "perUserLimit" INTEGER;

CREATE INDEX IF NOT EXISTS "coupons_tenantId_storeId_audienceType_isActive_idx" ON "coupons"("tenantId", "storeId", "audienceType", "isActive");

-- Extend coupon_redemptions for phone/visitor auditing
ALTER TABLE "coupon_redemptions" ADD COLUMN IF NOT EXISTS "customerPhone" VARCHAR(20);
ALTER TABLE "coupon_redemptions" ADD COLUMN IF NOT EXISTS "customerName" VARCHAR(150);
ALTER TABLE "coupon_redemptions" ADD COLUMN IF NOT EXISTS "visitorCode" VARCHAR(60);
ALTER TABLE "coupon_redemptions" ADD COLUMN IF NOT EXISTS "discountAmount" DECIMAL(20,0) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "coupon_redemptions_couponId_customerPhone_idx" ON "coupon_redemptions"("couponId", "customerPhone");
CREATE INDEX IF NOT EXISTS "coupon_redemptions_couponId_userId_idx" ON "coupon_redemptions"("couponId", "userId");
