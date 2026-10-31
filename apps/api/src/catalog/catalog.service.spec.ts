import { NotFoundException } from '@nestjs/common';
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

      const carboxy = products.find((p) => p.slug === 'carboxygel-professional-therapy');
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

      const product = await service.getPublished('demo', 'carboxygel-professional-therapy');
      expect(product.slug).toBe('carboxygel-professional-therapy');
      expect(product.brand?.slug).toBe('reeskin-clinical');
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

      const media = await service.getMedia('demo', 'carboxygel-professional-therapy');
      expect(Array.isArray(media)).toBe(true);
      expect(media.length).toBeGreaterThanOrEqual(1);
      expect(media[0].role).toBe('HERO');
      expect(media[0].isPrimary).toBe(true);
    });

    it('returns ingredients array for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const ingredients = await service.getIngredients('demo', 'carboxygel-professional-therapy');
      expect(Array.isArray(ingredients)).toBe(true);
      expect(ingredients.some((i: any) => i.isKeyIngredient)).toBe(true);
    });

    it('returns claims array for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const claims = await service.getClaims('demo', 'carboxygel-professional-therapy');
      expect(Array.isArray(claims)).toBe(true);
      expect(claims[0].claimText).toContain('اکسیژن‌رسانی');
    });

    it('returns usage steps for product', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const steps = await service.getUsageSteps('demo', 'carboxygel-professional-therapy');
      expect(Array.isArray(steps)).toBe(true);
      expect(steps[0].stepNumber).toBe(1);
    });

    it('returns list of brands for store', async () => {
      prisma.store.findFirst.mockRejectedValue(new Error('DB unreachable'));

      const brands = await service.listBrands('demo');
      expect(Array.isArray(brands)).toBe(true);
      expect(brands.some((b) => b.slug === 'reeskin-clinical')).toBe(true);
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
        vendor: null,
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
});
