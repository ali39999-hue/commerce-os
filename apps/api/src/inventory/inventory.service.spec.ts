import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryService & InventoryController (Admin Warehouse)', () => {
  let service: InventoryService;
  let controller: InventoryController;
  let prisma: any;

  const tenantId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    prisma = {
      productVariant: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      inventoryLevel: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn(async (cb: (tx: any) => Promise<any>) => cb(prisma)),
    };

    service = new InventoryService(prisma as unknown as PrismaService);
    controller = new InventoryController(service);
  });

  describe('listAdminInventory', () => {
    const sampleVariants = [
      {
        id: 'var-cold-low',
        productId: 'prod-1',
        sku: 'SKN-CRM-01',
        titleFa: '۵۰ میل',
        updatedAt: new Date('2026-10-01T10:00:00Z'),
        product: {
          titleFa: 'سرم پپتیدی کلینیکال',
          slug: 'clinical-peptide-serum',
          coldChainRequired: true,
        },
        inventoryLevels: [
          {
            warehouseCode: 'COLD-01',
            onHandQty: 8,
            reservedQty: 2,
            updatedAt: new Date('2026-10-02T12:00:00Z'),
          },
        ],
      },
      {
        id: 'var-ambient-ok',
        productId: 'prod-2',
        sku: 'BBW-PINK-SPY',
        titleFa: 'اسپری کلینیکال صورتی',
        updatedAt: new Date('2026-10-01T10:00:00Z'),
        product: {
          titleFa: 'اسپری کلینیکال صورتی',
          slug: 'shop-perfect-in-pink',
          coldChainRequired: false,
        },
        inventoryLevels: [
          {
            warehouseCode: 'MAIN',
            onHandQty: 25,
            reservedQty: 5,
            updatedAt: new Date('2026-10-03T08:30:00Z'),
          },
        ],
      },
    ];

    it('returns DB-backed inventory items with computed cold-chain and low-stock summary', async () => {
      prisma.productVariant.findMany.mockResolvedValue(sampleVariants);

      const res = await controller.listAdminInventory(tenantId);

      expect(res.source).toBe('DB');
      expect(res.items).toHaveLength(2);
      expect(res.items[0]).toMatchObject({
        variantId: 'var-cold-low',
        sku: 'SKN-CRM-01',
        title: 'سرم پپتیدی کلینیکال — ۵۰ میل',
        warehouseCode: 'COLD-01',
        isColdChain: true,
        onHand: 8,
        reserved: 2,
        available: 6,
        threshold: 10,
      });
      expect(res.items[1]).toMatchObject({
        variantId: 'var-ambient-ok',
        title: 'اسپری کلینیکال صورتی',
        isColdChain: false,
        available: 20,
        threshold: 8,
      });
      expect(res.summary).toEqual({
        totalSkus: 2,
        totalOnHand: 33,
        totalReserved: 7,
        totalAvailable: 26,
        coldChainCount: 1,
        coldChainAvailable: 6,
        lowStockCount: 1,
      });
    });

    it('filters by LOW_STOCK, COLD_CHAIN, and search while preserving full summary', async () => {
      prisma.productVariant.findMany.mockResolvedValue(sampleVariants);

      const lowOnly = await service.listAdminInventory(tenantId, {
        filter: 'LOW_STOCK',
      });
      expect(lowOnly.items.map((i) => i.sku)).toEqual(['SKN-CRM-01']);
      expect(lowOnly.summary.totalSkus).toBe(2);

      const searchMatch = await service.listAdminInventory(tenantId, {
        search: 'pink',
      });
      expect(searchMatch.items.map((i) => i.sku)).toEqual(['BBW-PINK-SPY']);
    });
  });

  describe('restockVariant', () => {
    const mockVariant = {
      id: 'var-1',
      tenantId,
      storeId: 'store-1',
      productId: 'prod-1',
      sku: 'CBG-PRO-500ML',
      titleFa: 'تیوب ۵۰۰ میل',
      updatedAt: new Date('2026-10-01T00:00:00Z'),
      product: {
        titleFa: 'کربوکسی‌ژل تراپی',
        slug: 'carboxygel',
        coldChainRequired: false,
      },
    };

    it('increments existing InventoryLevel atomically and logs INVENTORY_RESTOCK audit event', async () => {
      prisma.productVariant.findFirst.mockResolvedValue(mockVariant);
      prisma.inventoryLevel.findFirst.mockResolvedValue({
        id: 'lvl-1',
        warehouseCode: 'MAIN',
        onHandQty: 12,
        reservedQty: 2,
        updatedAt: new Date('2026-10-01T00:00:00Z'),
      });
      prisma.inventoryLevel.update.mockResolvedValue({
        id: 'lvl-1',
        warehouseCode: 'MAIN',
        onHandQty: 22,
        reservedQty: 2,
        updatedAt: new Date('2026-10-05T10:00:00Z'),
      });
      prisma.auditLog.create.mockResolvedValue({ id: 'aud-1' });

      const result = await controller.restockVariant(tenantId, {
        sku: 'CBG-PRO-500ML',
        quantityDelta: 10,
        note: 'شارژ محموله جدید',
      });

      expect(prisma.inventoryLevel.update).toHaveBeenCalledWith({
        where: { id: 'lvl-1' },
        data: { onHandQty: { increment: 10 } },
      });
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenantId,
          action: 'INVENTORY_RESTOCK',
          targetType: 'ProductVariant',
          targetId: 'var-1',
          diffJson: expect.objectContaining({
            sku: 'CBG-PRO-500ML',
            warehouseCode: 'MAIN',
            quantityDelta: 10,
            previousOnHand: 12,
            newOnHand: 22,
            note: 'شارژ محموله جدید',
          }),
        }),
      });
      expect(result.ok).toBe(true);
      expect(result.item.onHand).toBe(22);
      expect(result.item.available).toBe(20);
    });

    it('creates InventoryLevel row when variant has no stock record yet', async () => {
      prisma.productVariant.findFirst.mockResolvedValue(mockVariant);
      prisma.inventoryLevel.findFirst.mockResolvedValue(null);
      prisma.inventoryLevel.create.mockResolvedValue({
        id: 'lvl-new',
        warehouseCode: 'COLD-01',
        onHandQty: 15,
        reservedQty: 0,
        updatedAt: new Date('2026-10-05T11:00:00Z'),
      });
      prisma.auditLog.create.mockResolvedValue({ id: 'aud-2' });

      const result = await service.restockVariant(tenantId, {
        variantId: 'var-1',
        warehouseCode: 'COLD-01',
        quantityDelta: 15,
      });

      expect(prisma.inventoryLevel.create).toHaveBeenCalledWith({
        data: {
          tenantId,
          storeId: 'store-1',
          variantId: 'var-1',
          warehouseCode: 'COLD-01',
          onHandQty: 15,
          reservedQty: 0,
        },
      });
      expect(result.item.onHand).toBe(15);
      expect(result.item.warehouseCode).toBe('COLD-01');
    });

    it('throws NotFoundException on unknown SKU', async () => {
      prisma.productVariant.findFirst.mockResolvedValue(null);

      await expect(
        service.restockVariant(tenantId, {
          sku: 'DOES-NOT-EXIST',
          quantityDelta: 5,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException on non-positive quantity or missing identifier', async () => {
      await expect(
        service.restockVariant(tenantId, { sku: 'CBG-PRO-500ML', quantityDelta: 0 }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.restockVariant(tenantId, { sku: 'CBG-PRO-500ML', quantityDelta: -4 }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.restockVariant(tenantId, { quantityDelta: 5 }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
