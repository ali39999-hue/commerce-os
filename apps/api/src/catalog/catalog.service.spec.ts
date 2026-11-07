import { ConflictException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BulkUpdateProductsDto } from '../common/dto/resource-writes.dto';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../database/prisma.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      store: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
      },
      product: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      brand: {
        findMany: jest.fn(),
      },
      skinConcern: {
        findMany: jest.fn(),
      },
    };
    service = new CatalogService(prisma as unknown as PrismaService);
  });

  describe('resolveStore', () => {
    it('returns store details when active store exists', async () => {
      prisma.store.findFirst.mockResolvedValue({
        id: 'store-1',
        tenantId: 'tenant-1',
        slug: 'demo',
        name: 'Demo Store',
      });

      const res = await service.resolveStore('demo');
      expect(res).toEqual({
        id: 'store-1',
        tenantId: 'tenant-1',
        slug: 'demo',
        name: 'Demo Store',
      });
    });

    it('falls back resiliently when DB is down', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('Connection refused'));

      const res = await service.resolveStore('demo');
      expect(res.id).toBe('demo-store');
      expect((res as any).dbAvailable).toBe(false);
    });
  });

  describe('listPublished & getPublished', () => {
    it('returns fallback clinical skincare products if DB returns empty or errors', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const products = await service.listPublished('demo', 20);
      expect(products.length).toBeGreaterThan(0);

      const carboxy = products.find((p) => p.slug === 'carboxygel' || p.slug === 'carboxygel-professional-therapy');
      expect(carboxy).toBeDefined();
      expect(carboxy?.brand?.name).toBe('ReeSkin Clinical');
      expect(carboxy?.media.length).toBeGreaterThan(0);
      expect(carboxy?.ingredients.length).toBeGreaterThan(0);
      expect(carboxy?.claims.length).toBeGreaterThan(0);
      expect(carboxy?.usageSteps.length).toBeGreaterThan(0);
      expect(carboxy?.variants.length).toBeGreaterThan(0);
    });

    it('returns detailed product with clinical claims and ingredients', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const product = await service.getPublished('demo', 'carboxygel');
      expect(product.slug).toBe('carboxygel');
      expect(product.brand?.slug).toBe('reeskin');
      expect(product.ingredients[0].inciName).toBe('Sodium Bicarbonate');
      expect(product.claims[0].status).toBe('APPROVED');
      expect(product.variants[0].sku).toBe('CBG-PRO-500ML');
    });

    it('throws NotFoundException for non-existent product slug', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      await expect(service.getPublished('demo', 'unknown-nonexistent-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('granular clinical helper queries', () => {
    it('returns media array for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const media = await service.getMedia('demo', 'carboxygel');
      expect(Array.isArray(media)).toBe(true);
      expect(media.length).toBeGreaterThanOrEqual(1);
      expect(media[0].role).toBe('HERO');
      expect(media[0].isPrimary).toBe(true);
    });

    it('returns ingredients array for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const ingredients = await service.getIngredients('demo', 'carboxygel');
      expect(Array.isArray(ingredients)).toBe(true);
      expect(ingredients.some((i: any) => i.isKeyIngredient)).toBe(true);
    });

    it('returns claims array for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const claims = await service.getClaims('demo', 'carboxygel');
      expect(Array.isArray(claims)).toBe(true);
      expect(claims[0].claimText).toContain('اکسیژن‌رسانی');
    });

    it('returns usage steps for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const steps = await service.getUsageSteps('demo', 'carboxygel');
      expect(Array.isArray(steps)).toBe(true);
      expect(steps[0].stepNumber).toBe(1);
    });

    it('returns list of brands for store', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const brands = await service.listBrands('demo');
      expect(Array.isArray(brands)).toBe(true);
      expect(brands.some((b) => b.slug === 'reeskin')).toBe(true);
    });

    it('returns list of skin concerns for store', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const concerns = await service.listSkinConcerns('demo');
      expect(Array.isArray(concerns)).toBe(true);
      expect(concerns.some((c) => c.slug === 'anti-aging')).toBe(true);
    });
  });

  describe('admin tenant isolation', () => {
    it('queries products strictly scoped by tenantId', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 'store-10' });
      prisma.product.findMany.mockResolvedValue([]);

      await service.adminListProducts('tenant-xyz', 'demo-store', 25);

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenantId: 'tenant-xyz',
            storeId: 'store-10',
          },
        }),
      );
    });

    it('queries product by id strictly scoped by tenantId', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'prod-100',
        slug: 'custom-prod',
        titleFa: 'محصول سازمانی',
        description: null,
        kind: 'PHYSICAL',
        brand: null,
        media: [],
        ingredients: [],
        claims: [],
        usageSteps: [],
        skinConcerns: [],
        variants: [
          {
            id: 'v-1',
            sku: 'SKU-1',
            titleFa: 'سایز اصلی',
            priceAmount: '5000000',
            currency: 'IRR',
            inventoryLevels: [{ onHandQty: 10, reservedQty: 0 }],
          },
        ],
      });

      const prod = await service.adminGetProduct('tenant-xyz', 'prod-100');
      expect(prod.id).toBe('prod-100');
      expect(prisma.product.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'prod-100',
            tenantId: 'tenant-xyz',
          },
        }),
      );
    });

    it('adminListBrands filters by tenantId', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 'store-10' });
      prisma.brand.findMany.mockResolvedValue([]);

      await service.adminListBrands('tenant-xyz', 'demo');
      expect(prisma.brand.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenantId: 'tenant-xyz',
            storeId: 'store-10',
          },
        }),
      );
    });

    it('adminListSkinConcerns filters by tenantId', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 'store-10' });
      prisma.skinConcern.findMany.mockResolvedValue([]);

      await service.adminListSkinConcerns('tenant-xyz', 'demo');
      expect(prisma.skinConcern.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenantId: 'tenant-xyz',
            storeId: 'store-10',
          },
        }),
      );
    });
  });

  describe('admin product authoring (ERP)', () => {
    let txOps: any[];

    beforeEach(() => {
      txOps = [];
      prisma.store.findFirst = jest.fn();
      prisma.category = { findFirst: jest.fn().mockResolvedValue(null) };
      prisma.brand.findFirst = jest.fn().mockResolvedValue(null);
      prisma.product = {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      };
      prisma.productVariant = { create: jest.fn(), update: jest.fn() };
      prisma.inventoryLevel = { create: jest.fn(), update: jest.fn() };
      prisma.productMedia = { create: jest.fn() };
      prisma.$transaction = jest.fn().mockImplementation((ops: any[]) => {
        txOps.push(...ops);
        return Promise.resolve(ops);
      });
    });

    it('creates product + default variant + inventory with an auto-slug from a Latin title', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 'store-10', tenantId: 'tenant-xyz' });
      // re-fetch after transaction (slug probes run through product.findUnique)
      prisma.product.findFirst.mockResolvedValueOnce(adminRow({ slug: 'hydrating-serum' }));

      const res = await service.adminCreateProduct('tenant-xyz', {
        storeSlug: 'demo',
        titleFa: 'سرم آبرسان بالینی',
        titleEn: 'Hydrating Serum',
        priceRials: 1250000,
        stock: 7,
        status: 'PUBLISHED',
      } as any);

      const created = prisma.product.create.mock.calls[0][0];
      expect(created.data.slug).toBe('hydrating-serum');
      expect(created.data.status).toBe('PUBLISHED');
      expect(created.data.publishedAt).toBeInstanceOf(Date);
      expect(created.data.isFeatured).toBe(false);

      const variant = prisma.productVariant.create.mock.calls[0][0];
      expect(variant.data.sku).toBe('hydrating-serum-STD');
      expect(variant.data.priceAmount).toBe('1250000');

      const inventory = prisma.inventoryLevel.create.mock.calls[0][0];
      expect(inventory.data).toMatchObject({
        variantId: variant.data.id,
        warehouseCode: 'MAIN',
        onHandQty: 7,
        reservedQty: 0,
      });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(txOps.length).toBe(3);
      expect(res.slug).toBe('hydrating-serum');
    });

    it('falls back to product-<random> when a Persian title slugifies to nothing and de-conflicts with -2, -3…', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 'store-10', tenantId: 'tenant-xyz' });
      // two collisions in generateUniqueSlug, then free; re-fetch returns the row
      prisma.product.findUnique
        .mockResolvedValueOnce({ id: 'taken-1' })
        .mockResolvedValueOnce({ id: 'taken-2' })
        .mockResolvedValue(null);
      prisma.product.findFirst.mockResolvedValueOnce(adminRow());

      const res = await service.adminCreateProduct('tenant-xyz', {
        storeSlug: 'demo',
        titleFa: 'ژل کربوکسی‌تراپی',
        priceRials: 100,
        stock: 1,
      } as any);

      const created = prisma.product.create.mock.calls[0][0];
      expect(created.data.slug).toMatch(/^product-[0-9a-f]{8}-3$/);
      // response is mapped from the post-transaction re-fetch of the created row
      expect(res.id).toBe('prod-1');
    });

    it('conflicts with 409 on an explicit duplicate slug', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 'store-10', tenantId: 'tenant-xyz' });
      prisma.product.findUnique.mockResolvedValue({ id: 'existing-1' });

      await expect(
        service.adminCreateProduct('tenant-xyz', {
          storeSlug: 'demo',
          slug: 'carboxygel',
          titleFa: 'ژل کربوکسی',
          priceRials: 100,
          stock: 1,
        } as any),
      ).rejects.toThrow(ConflictException);
      expect(prisma.product.create).not.toHaveBeenCalled();
    });

    it('refuses with honest 503 when the DB is down (no fake product committed)', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('Connection refused'));

      await expect(
        service.adminCreateProduct('tenant-xyz', {
          storeSlug: 'demo',
          titleFa: 'سرم تست',
          priceRials: 100,
          stock: 1,
        } as any),
      ).rejects.toThrow(ServiceUnavailableException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('patches: stamps publishedAt only when first published, and flows price/stock to the default variant', async () => {
      prisma.product.findFirst
        .mockResolvedValueOnce({
          id: 'prod-1',
          tenantId: 'tenant-xyz',
          storeId: 'store-10',
          slug: 'hydrating-serum',
          status: 'DRAFT',
          publishedAt: null,
          variants: [
            {
              id: 'var-1',
              sku: 'hydrating-serum-STD',
              priceAmount: '1250000',
              inventoryLevels: [{ id: 'lvl-1', onHandQty: 7, reservedQty: 0 }],
            },
          ],
        })
        .mockResolvedValueOnce(adminRow({ status: 'PUBLISHED' }));

      const res = await service.adminUpdateProduct('tenant-xyz', 'prod-1', {
        status: 'PUBLISHED',
        priceRials: 990000,
        stock: 12,
      } as any);

      const productUpdate = prisma.product.update.mock.calls[0][0];
      expect(productUpdate.data.status).toBe('PUBLISHED');
      expect(productUpdate.data.publishedAt).toBeInstanceOf(Date);

      const variantUpdate = prisma.productVariant.update.mock.calls[0][0];
      expect(variantUpdate).toEqual({
        where: { id: 'var-1' },
        data: { priceAmount: '990000' },
      });

      const inventoryUpdate = prisma.inventoryLevel.update.mock.calls[0][0];
      expect(inventoryUpdate).toEqual({
        where: { id: 'lvl-1' },
        data: { onHandQty: 12 },
      });
      expect(res.status).toBe('PUBLISHED');
    });

    it('never overwrites publishedAt on an already-published product', async () => {
      const firstPublishedAt = new Date('2026-01-01T00:00:00.000Z');
      prisma.product.findFirst
        .mockResolvedValueOnce({
          id: 'prod-1',
          tenantId: 'tenant-xyz',
          storeId: 'store-10',
          slug: 'hydrating-serum',
          status: 'PUBLISHED',
          publishedAt: firstPublishedAt,
          variants: [
            {
              id: 'var-1',
              sku: 'hydrating-serum-STD',
              priceAmount: '1250000',
              inventoryLevels: [],
            },
          ],
        })
        .mockResolvedValueOnce(adminRow({ status: 'PUBLISHED' }));

      await service.adminUpdateProduct('tenant-xyz', 'prod-1', { status: 'PUBLISHED' } as any);

      const productUpdate = prisma.product.update.mock.calls[0][0];
      expect(productUpdate.data.status).toBe('PUBLISHED');
      expect(productUpdate.data.publishedAt).toBeUndefined();
    });

    it('returns 404 for an unknown product id', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(
        service.adminUpdateProduct('tenant-xyz', 'missing-id', { isFeatured: true } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('bulk-update runs one tenant-scoped updateMany and reports the count', async () => {
      prisma.product.updateMany.mockResolvedValue({ count: 2 });

      const res = await service.adminBulkUpdateProducts('tenant-xyz', {
        ids: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'],
        isFeatured: true,
      } as any);

      expect(prisma.product.updateMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-xyz',
          id: { in: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'] },
        },
        data: { isFeatured: true },
      });
      expect(res).toEqual({ updated: 2 });
    });

    it('rejects the bulk-update DTO over the 100-id ceiling (whitelist contract)', async () => {
      const tooMany = plainToInstance(BulkUpdateProductsDto, {
        ids: Array.from({ length: 101 }, () => randomUUID()),
      });
      const errors = await validate(tooMany);
      expect(errors.length).toBeGreaterThan(0);

      const withinLimit = plainToInstance(BulkUpdateProductsDto, {
        ids: Array.from({ length: 100 }, () => randomUUID()),
      });
      expect(await validate(withinLimit)).toEqual([]);
    });
  });
});

function adminRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod-1',
    slug: 'hydrating-serum',
    titleFa: 'سرم آبرسان بالینی',
    description: null,
    kind: 'PHYSICAL',
    status: 'DRAFT',
    isFeatured: false,
    publishedAt: null,
    brand: null,
    category: null,
    media: [],
    ingredients: [],
    claims: [],
    usageSteps: [],
    skinConcerns: [],
    variants: [
      {
        id: 'var-1',
        sku: 'hydrating-serum-STD',
        titleFa: 'سرم آبرسان بالینی',
        priceAmount: '1250000',
        currency: 'IRR',
        inventoryLevels: [{ id: 'lvl-1', onHandQty: 7, reservedQty: 0 }],
      },
    ],
    ...overrides,
  };
}
