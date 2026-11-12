-- Extend MediaRole enum for clinical/PDP asset roles
ALTER TYPE "MediaRole" ADD VALUE IF NOT EXISTS 'TEXTURE';
ALTER TYPE "MediaRole" ADD VALUE IF NOT EXISTS 'IN_CLINIC';
ALTER TYPE "MediaRole" ADD VALUE IF NOT EXISTS 'PACKAGING';

-- Extend categories with visual & ordering metadata
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Extend products with clinical dossier & merchandising metadata
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subtitleFa" VARCHAR(400);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "scientificName" VARCHAR(255);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "formulation" VARCHAR(300);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "badge" VARCHAR(120);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ratingValue" DECIMAL(3, 2);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isSpecialOffer" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isNewest" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "coldChainRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "clinicalData" JSONB;

-- Extend product_variants with pack size, original pricing, discounts, and ordering
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "sizeOrVolume" VARCHAR(120);
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "originalPriceAmount" DECIMAL(20, 0);
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "discountPercent" INTEGER;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "mediaRoleMatch" VARCHAR(64);
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "isRecommended" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
