-- Initial PostgreSQL schema. CHECK constraints are intentional safety invariants.
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE "StoreStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "VariantStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

CREATE TABLE "tenants" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

CREATE TABLE "organizations" (
  "id" UUID NOT NULL,
  "tenantId" UUID NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "organizations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "organizations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "organizations_tenantId_slug_key" ON "organizations"("tenantId", "slug");
CREATE UNIQUE INDEX "organizations_tenantId_id_key" ON "organizations"("tenantId", "id");
CREATE INDEX "organizations_tenantId_idx" ON "organizations"("tenantId");

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
  CONSTRAINT "stores_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "stores_organization_tenant_fkey" FOREIGN KEY ("tenantId", "organizationId") REFERENCES "organizations"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");
CREATE UNIQUE INDEX "stores_tenantId_id_key" ON "stores"("tenantId", "id");
CREATE INDEX "stores_tenantId_status_idx" ON "stores"("tenantId", "status");

CREATE TABLE "products" (
  "id" UUID NOT NULL,
  "tenantId" UUID NOT NULL,
  "storeId" UUID NOT NULL,
  "slug" VARCHAR(180) NOT NULL,
  "titleFa" VARCHAR(300) NOT NULL,
  "description" TEXT,
  "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "products_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "products_store_tenant_fkey" FOREIGN KEY ("tenantId", "storeId") REFERENCES "stores"("tenantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");
CREATE UNIQUE INDEX "products_tenantId_storeId_id_key" ON "products"("tenantId", "storeId", "id");
CREATE INDEX "products_tenantId_storeId_status_publishedAt_idx" ON "products"("tenantId", "storeId", "status", "publishedAt");

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
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_variants_product_scope_fkey" FOREIGN KEY ("tenantId", "storeId", "productId") REFERENCES "products"("tenantId", "storeId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "product_variants_price_nonnegative_check" CHECK ("priceAmount" >= 0)
);
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");
CREATE UNIQUE INDEX "product_variants_tenantId_storeId_id_key" ON "product_variants"("tenantId", "storeId", "id");
CREATE INDEX "product_variants_tenantId_storeId_status_idx" ON "product_variants"("tenantId", "storeId", "status");

CREATE TABLE "inventory_levels" (
  "id" UUID NOT NULL,
  "tenantId" UUID NOT NULL,
  "storeId" UUID NOT NULL,
  "variantId" UUID NOT NULL,
  "warehouseCode" VARCHAR(80) NOT NULL,
  "onHandQty" INTEGER NOT NULL DEFAULT 0,
  "reservedQty" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "inventory_levels_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inventory_levels_variant_scope_fkey" FOREIGN KEY ("tenantId", "storeId", "variantId") REFERENCES "product_variants"("tenantId", "storeId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "inventory_levels_nonnegative_check" CHECK ("onHandQty" >= 0 AND "reservedQty" >= 0),
  CONSTRAINT "inventory_levels_available_check" CHECK ("reservedQty" <= "onHandQty")
);
CREATE UNIQUE INDEX "inventory_levels_tenantId_storeId_variantId_warehouseCode_key" ON "inventory_levels"("tenantId", "storeId", "variantId", "warehouseCode");
CREATE INDEX "inventory_levels_tenantId_storeId_variantId_idx" ON "inventory_levels"("tenantId", "storeId", "variantId");
