-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATOR', 'ACCOUNTANT', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VariantStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'COMMITTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'PENDING_PROVIDER', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'EXPIRED', 'UNKNOWN', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ZARINPAL', 'ZIBAL', 'CARD_TO_CARD', 'WALLET');

-- CreateEnum
CREATE TYPE "CardToCardStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LedgerDirection" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "AccountCategory" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PACKED', 'HANDED_TO_CARRIER', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'FAILED_ATTEMPT');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED', 'DEAD_LETTER');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('STARTED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProductKind" AS ENUM ('PHYSICAL', 'DIGITAL');

-- CreateEnum
CREATE TYPE "MediaRole" AS ENUM ('HERO', 'GALLERY', 'LIFESTYLE', 'DETAIL', 'HOW_TO', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "ClinicalClaimStatus" AS ENUM ('APPROVED', 'DRAFT', 'REVIEW_REQUIRED');

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "status" "StoreStatus" NOT NULL DEFAULT 'ACTIVE',
    "defaultCurrency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(120),
    "fullName" VARCHAR(150),
    "passwordHash" VARCHAR(255),
    "nationalId" VARCHAR(20),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_challenges" (
    "id" UUID NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "codeHash" VARCHAR(128) NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "titleFa" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "parentId" UUID,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "categoryId" UUID,
    "brandId" UUID,
    "kind" "ProductKind" NOT NULL DEFAULT 'PHYSICAL',
    "slug" VARCHAR(180) NOT NULL,
    "titleFa" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "titleFa" VARCHAR(200) NOT NULL,
    "priceAmount" DECIMAL(20,0) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "status" "VariantStatus" NOT NULL DEFAULT 'ACTIVE',
    "digitalFileUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" VARCHAR(255),
    "originCountry" VARCHAR(100),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "variantId" UUID,
    "role" "MediaRole" NOT NULL DEFAULT 'GALLERY',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "altText" VARCHAR(255),
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" VARCHAR(100),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_ingredients" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "inciName" VARCHAR(255),
    "concentrationPercent" DECIMAL(5,2),
    "purpose" VARCHAR(255),
    "isKeyIngredient" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skin_concerns" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "skin_concerns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_skin_concerns" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "concernId" UUID NOT NULL,

    CONSTRAINT "product_skin_concerns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_claims" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "claimText" VARCHAR(500) NOT NULL,
    "evidenceSummary" TEXT,
    "studyReference" TEXT,
    "approvedBy" VARCHAR(150),
    "status" "ClinicalClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clinical_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_steps" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "stepNumber" INTEGER NOT NULL DEFAULT 1,
    "title" VARCHAR(200) NOT NULL,
    "instruction" TEXT NOT NULL,
    "iconOrImageUrl" TEXT,

    CONSTRAINT "usage_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_levels" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "warehouseCode" VARCHAR(80) NOT NULL DEFAULT 'MAIN',
    "onHandQty" INTEGER NOT NULL DEFAULT 0,
    "reservedQty" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventory_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_reservations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventory_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_reservation_lines" (
    "id" UUID NOT NULL,
    "reservationId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "warehouseCode" VARCHAR(80) NOT NULL DEFAULT 'MAIN',
    "reservedQty" INTEGER NOT NULL,

    CONSTRAINT "inventory_reservation_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "userId" UUID,
    "sessionId" VARCHAR(128),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_lines" (
    "id" UUID NOT NULL,
    "cartId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_sessions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "cartId" UUID,
    "reservationId" UUID,
    "quoteFingerprint" VARCHAR(64) NOT NULL,
    "quoteSnapshot" JSONB NOT NULL,
    "addressSnapshot" JSONB,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "orderNumber" VARCHAR(50) NOT NULL,
    "userId" UUID,
    "customerPhone" VARCHAR(20) NOT NULL,
    "customerName" VARCHAR(150) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "subtotalAmount" DECIMAL(20,0) NOT NULL,
    "discountAmount" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "vatAmount" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "shippingAmount" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(20,0) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "addressJson" JSONB NOT NULL,
    "priceSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_lines" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "titleFa" VARCHAR(250) NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "unitPrice" DECIMAL(20,0) NOT NULL,
    "qty" INTEGER NOT NULL,
    "subtotal" DECIMAL(20,0) NOT NULL,
    "discount" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "total" DECIMAL(20,0) NOT NULL,

    CONSTRAINT "order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "fromStatus" "OrderStatus" NOT NULL,
    "toStatus" "OrderStatus" NOT NULL,
    "actor" VARCHAR(100) NOT NULL,
    "reason" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_intents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "amount" DECIMAL(20,0) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "gatewayTrackingId" VARCHAR(100),
    "refId" VARCHAR(100),
    "cardPan" VARCHAR(30),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_to_card_receipts" (
    "id" UUID NOT NULL,
    "paymentIntentId" UUID NOT NULL,
    "referenceNumber" VARCHAR(100) NOT NULL,
    "payerCardNumber" VARCHAR(30),
    "receiptImageUrl" TEXT,
    "status" "CardToCardStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewedBy" VARCHAR(100),
    "reviewedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_to_card_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_inbox" (
    "id" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "eventId" VARCHAR(100) NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "balance" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" UUID NOT NULL,
    "walletId" UUID NOT NULL,
    "direction" "LedgerDirection" NOT NULL,
    "amount" DECIMAL(20,0) NOT NULL,
    "refType" VARCHAR(50) NOT NULL,
    "refId" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "balanceAfter" DECIMAL(20,0) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_accounts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "nameFa" VARCHAR(150) NOT NULL,
    "category" "AccountCategory" NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_journals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID,
    "ref" VARCHAR(120) NOT NULL,
    "sourceType" VARCHAR(50) NOT NULL,
    "sourceId" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" UUID NOT NULL,
    "journalId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "direction" "LedgerDirection" NOT NULL,
    "amount" DECIMAL(20,0) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "description" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "discountBps" INTEGER,
    "fixedDiscount" DECIMAL(20,0),
    "minSubtotal" DECIMAL(20,0),
    "maxDiscount" DECIMAL(20,0),
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" UUID NOT NULL,
    "couponId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "userId" UUID,
    "redeemedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "carrier" VARCHAR(50) NOT NULL,
    "titleFa" VARCHAR(150) NOT NULL,
    "baseFee" DECIMAL(20,0) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "methodId" UUID,
    "carrier" VARCHAR(50) NOT NULL,
    "trackingNumber" VARCHAR(100),
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "dispatchedAt" TIMESTAMPTZ(6),
    "deliveredAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_tracking_events" (
    "id" UUID NOT NULL,
    "shipmentId" UUID NOT NULL,
    "titleFa" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(100),
    "occurredAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "eventType" VARCHAR(100) NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMPTZ(6),
    "workerId" VARCHAR(100),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_records" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "scope" VARCHAR(60) NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "requestHash" VARCHAR(64) NOT NULL,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'STARTED',
    "responseJson" JSONB,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_leases" (
    "resourceName" VARCHAR(100) NOT NULL,
    "holderId" VARCHAR(100) NOT NULL,
    "acquiredAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "heartbeatAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "worker_leases_pkey" PRIMARY KEY ("resourceName")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "actorId" VARCHAR(100) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "targetType" VARCHAR(80) NOT NULL,
    "targetId" VARCHAR(100) NOT NULL,
    "diffJson" JSONB,
    "ipAddress" VARCHAR(45),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "userId" UUID,
    "authorName" VARCHAR(100) NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "moderatedBy" VARCHAR(100),
    "moderatedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "channel" VARCHAR(20) NOT NULL,
    "recipient" VARCHAR(160) NOT NULL,
    "templateKey" VARCHAR(60) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'QUEUED',
    "outboxEventId" VARCHAR(64),
    "sentAt" TIMESTAMPTZ(6),
    "error" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "eventType" VARCHAR(60) NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "signature" VARCHAR(128) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMPTZ(6),

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID,
    "storeId" UUID,
    "name" VARCHAR(60) NOT NULL,
    "sessionId" VARCHAR(64),
    "userId" UUID,
    "propsJson" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "tier" VARCHAR(20) NOT NULL DEFAULT 'BRONZE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "loyalty_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "direction" VARCHAR(10) NOT NULL,
    "points" INTEGER NOT NULL,
    "refType" VARCHAR(50) NOT NULL,
    "refId" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "titleFa" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "variantId" UUID,
    "intervalDays" INTEGER NOT NULL DEFAULT 30,
    "priceRials" DECIMAL(20,0) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "nextRunAt" TIMESTAMPTZ(6) NOT NULL,
    "lastRunAt" TIMESTAMPTZ(6),
    "cyclesRun" INTEGER NOT NULL DEFAULT 0,
    "cancelReason" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_grants" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "orderLineId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "userId" UUID,
    "phone" VARCHAR(20) NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "productTitle" VARCHAR(300) NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "maxDownloads" INTEGER NOT NULL DEFAULT 5,
    "revokedAt" TIMESTAMPTZ(6),
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storefront_settings" (
    "id" UUID NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "storefront_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "organizations_tenantId_idx" ON "organizations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_tenantId_slug_key" ON "organizations"("tenantId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_tenantId_id_key" ON "organizations"("tenantId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_tenantId_status_idx" ON "stores"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stores_tenantId_id_key" ON "stores"("tenantId", "id");

-- CreateIndex
CREATE INDEX "users_tenantId_role_idx" ON "users"("tenantId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_expiresAt_idx" ON "user_sessions"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "otp_challenges_phone_expiresAt_isUsed_idx" ON "otp_challenges"("phone", "expiresAt", "isUsed");

-- CreateIndex
CREATE INDEX "categories_tenantId_storeId_idx" ON "categories"("tenantId", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeId_slug_key" ON "categories"("storeId", "slug");

-- CreateIndex
CREATE INDEX "products_tenantId_storeId_status_publishedAt_idx" ON "products"("tenantId", "storeId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_tenantId_storeId_id_key" ON "products"("tenantId", "storeId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_tenantId_storeId_status_idx" ON "product_variants"("tenantId", "storeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_tenantId_storeId_id_key" ON "product_variants"("tenantId", "storeId", "id");

-- CreateIndex
CREATE INDEX "brands_tenantId_storeId_isPublished_idx" ON "brands"("tenantId", "storeId", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "brands_storeId_slug_key" ON "brands"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_media_productId_sortOrder_idx" ON "product_media"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "product_media_tenantId_storeId_role_idx" ON "product_media"("tenantId", "storeId", "role");

-- CreateIndex
CREATE INDEX "product_ingredients_productId_sortOrder_idx" ON "product_ingredients"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "product_ingredients_tenantId_storeId_isKeyIngredient_idx" ON "product_ingredients"("tenantId", "storeId", "isKeyIngredient");

-- CreateIndex
CREATE INDEX "skin_concerns_tenantId_storeId_idx" ON "skin_concerns"("tenantId", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "skin_concerns_storeId_slug_key" ON "skin_concerns"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_skin_concerns_tenantId_storeId_concernId_idx" ON "product_skin_concerns"("tenantId", "storeId", "concernId");

-- CreateIndex
CREATE UNIQUE INDEX "product_skin_concerns_productId_concernId_key" ON "product_skin_concerns"("productId", "concernId");

-- CreateIndex
CREATE INDEX "clinical_claims_productId_status_idx" ON "clinical_claims"("productId", "status");

-- CreateIndex
CREATE INDEX "clinical_claims_tenantId_storeId_status_idx" ON "clinical_claims"("tenantId", "storeId", "status");

-- CreateIndex
CREATE INDEX "usage_steps_productId_stepNumber_idx" ON "usage_steps"("productId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "usage_steps_productId_stepNumber_key" ON "usage_steps"("productId", "stepNumber");

-- CreateIndex
CREATE INDEX "inventory_levels_tenantId_storeId_variantId_idx" ON "inventory_levels"("tenantId", "storeId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_levels_tenantId_storeId_variantId_warehouseCode_key" ON "inventory_levels"("tenantId", "storeId", "variantId", "warehouseCode");

-- CreateIndex
CREATE INDEX "inventory_reservations_tenantId_storeId_status_expiresAt_idx" ON "inventory_reservations"("tenantId", "storeId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "inventory_reservation_lines_reservationId_idx" ON "inventory_reservation_lines"("reservationId");

-- CreateIndex
CREATE INDEX "carts_tenantId_storeId_userId_sessionId_idx" ON "carts"("tenantId", "storeId", "userId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_lines_cartId_variantId_key" ON "cart_lines"("cartId", "variantId");

-- CreateIndex
CREATE INDEX "checkout_sessions_tenantId_storeId_expiresAt_idx" ON "checkout_sessions"("tenantId", "storeId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_tenantId_storeId_status_createdAt_idx" ON "orders"("tenantId", "storeId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_tenantId_storeId_id_key" ON "orders"("tenantId", "storeId", "id");

-- CreateIndex
CREATE INDEX "order_lines_orderId_idx" ON "order_lines"("orderId");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_createdAt_idx" ON "order_status_history"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "payment_intents_orderId_status_idx" ON "payment_intents"("orderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_tenantId_storeId_id_key" ON "payment_intents"("tenantId", "storeId", "id");

-- CreateIndex
CREATE INDEX "card_to_card_receipts_paymentIntentId_status_idx" ON "card_to_card_receipts"("paymentIntentId", "status");

-- CreateIndex
CREATE INDEX "webhook_inbox_status_createdAt_idx" ON "webhook_inbox"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_inbox_provider_eventId_key" ON "webhook_inbox"("provider", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_tenantId_userId_currency_key" ON "wallets"("tenantId", "userId", "currency");

-- CreateIndex
CREATE INDEX "wallet_transactions_walletId_createdAt_idx" ON "wallet_transactions"("walletId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_accounts_tenantId_code_currency_key" ON "ledger_accounts"("tenantId", "code", "currency");

-- CreateIndex
CREATE INDEX "ledger_journals_tenantId_sourceType_sourceId_idx" ON "ledger_journals"("tenantId", "sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_journals_tenantId_ref_key" ON "ledger_journals"("tenantId", "ref");

-- CreateIndex
CREATE INDEX "ledger_entries_journalId_idx" ON "ledger_entries"("journalId");

-- CreateIndex
CREATE INDEX "ledger_entries_accountId_createdAt_idx" ON "ledger_entries"("accountId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_tenantId_storeId_code_key" ON "coupons"("tenantId", "storeId", "code");

-- CreateIndex
CREATE INDEX "coupon_redemptions_couponId_idx" ON "coupon_redemptions"("couponId");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_methods_tenantId_code_key" ON "shipping_methods"("tenantId", "code");

-- CreateIndex
CREATE INDEX "shipments_orderId_status_idx" ON "shipments"("orderId", "status");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_shipmentId_occurredAt_idx" ON "shipment_tracking_events"("shipmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "outbox_events_status_availableAt_idx" ON "outbox_events"("status", "availableAt");

-- CreateIndex
CREATE INDEX "idempotency_records_expiresAt_idx" ON "idempotency_records"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_records_tenantId_scope_key_key" ON "idempotency_records"("tenantId", "scope", "key");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_action_createdAt_idx" ON "audit_logs"("tenantId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "reviews_productId_status_createdAt_idx" ON "reviews"("productId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "reviews_tenantId_status_idx" ON "reviews"("tenantId", "status");

-- CreateIndex
CREATE INDEX "notification_deliveries_status_createdAt_idx" ON "notification_deliveries"("status", "createdAt");

-- CreateIndex
CREATE INDEX "notification_deliveries_tenantId_channel_idx" ON "notification_deliveries"("tenantId", "channel");

-- CreateIndex
CREATE INDEX "webhook_deliveries_status_createdAt_idx" ON "webhook_deliveries"("status", "createdAt");

-- CreateIndex
CREATE INDEX "webhook_deliveries_tenantId_eventType_idx" ON "webhook_deliveries"("tenantId", "eventType");

-- CreateIndex
CREATE INDEX "analytics_events_name_createdAt_idx" ON "analytics_events"("name", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_storeId_createdAt_idx" ON "analytics_events"("storeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_tenantId_userId_key" ON "loyalty_accounts"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_accountId_createdAt_idx" ON "loyalty_transactions"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "subscription_plans_tenantId_storeId_isActive_idx" ON "subscription_plans"("tenantId", "storeId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_tenantId_slug_key" ON "subscription_plans"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "subscriptions_tenantId_status_nextRunAt_idx" ON "subscriptions"("tenantId", "status", "nextRunAt");

-- CreateIndex
CREATE INDEX "subscriptions_userId_status_idx" ON "subscriptions"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "digital_grants_token_key" ON "digital_grants"("token");

-- CreateIndex
CREATE INDEX "digital_grants_phone_createdAt_idx" ON "digital_grants"("phone", "createdAt");

-- CreateIndex
CREATE INDEX "digital_grants_tenantId_createdAt_idx" ON "digital_grants"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "digital_grants_orderLineId_key" ON "digital_grants"("orderLineId");

-- CreateIndex
CREATE UNIQUE INDEX "storefront_settings_key_key" ON "storefront_settings"("key");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_tenantId_organizationId_fkey" FOREIGN KEY ("tenantId", "organizationId") REFERENCES "organizations"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_tenantId_storeId_productId_fkey" FOREIGN KEY ("tenantId", "storeId", "productId") REFERENCES "products"("tenantId", "storeId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skin_concerns" ADD CONSTRAINT "skin_concerns_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_skin_concerns" ADD CONSTRAINT "product_skin_concerns_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_skin_concerns" ADD CONSTRAINT "product_skin_concerns_concernId_fkey" FOREIGN KEY ("concernId") REFERENCES "skin_concerns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_claims" ADD CONSTRAINT "clinical_claims_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_steps" ADD CONSTRAINT "usage_steps_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_tenantId_storeId_variantId_fkey" FOREIGN KEY ("tenantId", "storeId", "variantId") REFERENCES "product_variants"("tenantId", "storeId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservation_lines" ADD CONSTRAINT "inventory_reservation_lines_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "inventory_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservation_lines" ADD CONSTRAINT "inventory_reservation_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_to_card_receipts" ADD CONSTRAINT "card_to_card_receipts_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "ledger_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ledger_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_tenantId_storeId_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_tracking_events" ADD CONSTRAINT "shipment_tracking_events_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "loyalty_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

