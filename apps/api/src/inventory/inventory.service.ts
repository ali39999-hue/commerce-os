import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { QuoteLineInput } from "@commerce-os/domain";

export interface AdminInventoryItem {
  variantId: string;
  productId: string;
  sku: string;
  title: string;
  slug: string;
  warehouseCode: string;
  warehouseLocation: string;
  isColdChain: boolean;
  onHand: number;
  reserved: number;
  available: number;
  threshold: number;
  updatedAt: string;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Atomically reserve stock for cart items with row locking.
   * Sorts variant IDs to guarantee deadlock freedom.
   */
  async reserveStock(params: {
    tenantId: string;
    storeId: string;
    items: QuoteLineInput[];
    ttlMinutes?: number;
  }): Promise<{ reservationId: string; expiresAt: Date }> {
    const { tenantId, storeId, items, ttlMinutes = 15 } = params;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Helper regex to test standard UUID format
    const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const validUuidVariantIds = items.map((i) => i.variantId).filter(isUuid);

    // Digital variants (ADR-012) are exempt from stock reservation:
    // they have no on-hand inventory and are delivered via DigitalGrant.
    let digitalVariantIds = new Set<string>();
    if (validUuidVariantIds.length > 0) {
      try {
        const variantKinds = await this.prisma.productVariant.findMany({
          where: { id: { in: validUuidVariantIds } },
          select: { id: true, product: { select: { kind: true } } },
        });
        digitalVariantIds = new Set(
          variantKinds.filter((v) => v.product.kind === "DIGITAL").map((v) => v.id)
        );
      } catch {
        // DB fallback or resilient catch
      }
    }
    const physicalItems = items.filter((i) => !digitalVariantIds.has(i.variantId));

    // Sort variant IDs deterministically to avoid database deadlocks
    const sortedItems = [...physicalItems].sort((a, b) => a.variantId.localeCompare(b.variantId));

    return await this.prisma.$transaction(async (tx) => {
      // Create parent reservation
      const reservation = await tx.inventoryReservation.create({
        data: {
          tenantId,
          storeId,
          status: "ACTIVE",
          expiresAt,
        },
      });

      for (const item of sortedItems) {
        if (!isUuid(item.variantId)) {
          // If in demo or non-uuid mode, record reservation line without DB level lock
          await tx.inventoryReservationLine.create({
            data: {
              reservationId: reservation.id,
              variantId: "00000000-0000-0000-0000-000000000001",
              reservedQty: item.qty,
            },
          });
          continue;
        }

        // Find inventory row with row-level lock
        const inventoryRows: any[] = await tx.$queryRaw`
          SELECT id, "onHandQty", "reservedQty"
          FROM inventory_levels
          WHERE "tenantId" = ${tenantId}::uuid
            AND "storeId" = ${storeId}::uuid
            AND "variantId" = ${item.variantId}::uuid
          FOR UPDATE
        `;

        if (inventoryRows.length === 0) {
          throw new BadRequestException(`موجودی کالا با شناسه ${item.variantId} یافت نشد`);
        }

        const inv = inventoryRows[0];
        const available = inv.onHandQty - inv.reservedQty;

        if (available < item.qty) {
          throw new BadRequestException(
            `موجودی کالا ناکافی است (موجودی در دسترس: ${available} عدد، درخواستی: ${item.qty} عدد)`
          );
        }

        // Increment reserved quantity atomically
        await tx.inventoryLevel.update({
          where: { id: inv.id },
          data: {
            reservedQty: { increment: item.qty },
          },
        });

        // Record line
        await tx.inventoryReservationLine.create({
          data: {
            reservationId: reservation.id,
            variantId: item.variantId,
            reservedQty: item.qty,
          },
        });
      }

      return {
        reservationId: reservation.id,
        expiresAt,
      };
    });
  }

  /**
   * Commits the reservation: permanently decrements onHandQty and frees reservedQty.
   */
  async commitReservation(reservationId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const reservation = await tx.inventoryReservation.findUnique({
        where: { id: reservationId },
        include: { lines: true },
      });

      if (!reservation || reservation.status !== "ACTIVE") {
        return; // Already processed or expired
      }

      for (const line of reservation.lines) {
        await tx.inventoryLevel.updateMany({
          where: {
            tenantId: reservation.tenantId,
            storeId: reservation.storeId,
            variantId: line.variantId,
          },
          data: {
            onHandQty: { decrement: line.reservedQty },
            reservedQty: { decrement: line.reservedQty },
          },
        });
      }

      await tx.inventoryReservation.update({
        where: { id: reservationId },
        data: { status: "COMMITTED" },
      });
    });
  }

  /**
   * Releases an active or expired reservation back to available stock.
   */
  async releaseReservation(reservationId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const reservation = await tx.inventoryReservation.findUnique({
        where: { id: reservationId },
        include: { lines: true },
      });

      if (!reservation || reservation.status !== "ACTIVE") {
        return;
      }

      for (const line of reservation.lines) {
        await tx.inventoryLevel.updateMany({
          where: {
            tenantId: reservation.tenantId,
            storeId: reservation.storeId,
            variantId: line.variantId,
          },
          data: {
            reservedQty: { decrement: line.reservedQty },
          },
        });
      }

      await tx.inventoryReservation.update({
        where: { id: reservationId },
        data: { status: "EXPIRED" },
      });
    });
  }

  /**
   * Sweeps expired reservations using SKIP LOCKED to avoid worker contention.
   */
  async sweepExpiredReservations(): Promise<number> {
    const expired: any[] = await this.prisma.$queryRaw`
      SELECT id FROM inventory_reservations
      WHERE status = 'ACTIVE' AND "expiresAt" <= NOW()
      LIMIT 50
      FOR UPDATE SKIP LOCKED
    `;

    for (const row of expired) {
      await this.releaseReservation(row.id);
    }

    return expired.length;
  }

  /**
   * Maps a variant + optional InventoryLevel row into the Admin ERP view shape.
   */
  private toAdminInventoryItem(variant: {
    id: string;
    productId: string;
    sku: string;
    titleFa: string;
    updatedAt: Date;
    product?: { titleFa: string; slug: string; coldChainRequired: boolean } | null;
    inventoryLevels?: Array<{
      warehouseCode: string;
      onHandQty: number;
      reservedQty: number;
      updatedAt: Date;
    }>;
  }): AdminInventoryItem {
    const primaryLevel = variant.inventoryLevels?.[0];
    const onHand = primaryLevel?.onHandQty ?? 0;
    const reserved = primaryLevel?.reservedQty ?? 0;
    const available = Math.max(0, onHand - reserved);
    const isColdChain = Boolean(variant.product?.coldChainRequired);
    const warehouseCode = primaryLevel?.warehouseCode ?? "MAIN";
    const threshold = isColdChain ? 10 : 8;
    const productTitle = variant.product?.titleFa ?? "";
    const fullTitle =
      productTitle && variant.titleFa && variant.titleFa !== productTitle
        ? `${productTitle} — ${variant.titleFa}`
        : productTitle || variant.titleFa;

    return {
      variantId: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      title: fullTitle,
      slug: variant.product?.slug ?? "",
      warehouseCode,
      warehouseLocation: isColdChain
        ? `سردخانه کلینیکال (${warehouseCode} • ۲-۸°C)`
        : `انبار مرکزی (${warehouseCode})`,
      isColdChain,
      onHand,
      reserved,
      available,
      threshold,
      updatedAt: (primaryLevel?.updatedAt ?? variant.updatedAt).toISOString(),
    };
  }

  /**
   * Lists live SKU inventory levels from PostgreSQL for Admin Warehouse ERP.
   */
  async listAdminInventory(
    tenantId: string,
    params?: { search?: string; filter?: string },
  ) {
    const isDefaultTenant =
      !tenantId || tenantId === "00000000-0000-0000-0000-000000000000";

    const variants = await this.prisma.productVariant.findMany({
      where: {
        status: "ACTIVE",
        ...(!isDefaultTenant ? { tenantId } : {}),
        product: {
          status: { not: "ARCHIVED" },
        },
      },
      include: {
        product: {
          select: {
            titleFa: true,
            slug: true,
            coldChainRequired: true,
            sortOrder: true,
          },
        },
        inventoryLevels: {
          orderBy: { updatedAt: "asc" },
        },
      },
      orderBy: [{ product: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    });

    const allItems = variants.map((v) => this.toAdminInventoryItem(v));

    const summary = {
      totalSkus: allItems.length,
      totalOnHand: allItems.reduce((sum, i) => sum + i.onHand, 0),
      totalReserved: allItems.reduce((sum, i) => sum + i.reserved, 0),
      totalAvailable: allItems.reduce((sum, i) => sum + i.available, 0),
      coldChainCount: allItems.filter((i) => i.isColdChain).length,
      coldChainAvailable: allItems
        .filter((i) => i.isColdChain)
        .reduce((sum, i) => sum + i.available, 0),
      lowStockCount: allItems.filter((i) => i.available <= i.threshold).length,
    };

    const search = params?.search?.trim().toLowerCase();
    const filter = params?.filter?.toUpperCase();

    const filtered = allItems.filter((item) => {
      if (search) {
        const hit =
          item.sku.toLowerCase().includes(search) ||
          item.title.toLowerCase().includes(search) ||
          item.warehouseLocation.toLowerCase().includes(search);
        if (!hit) return false;
      }
      if (filter === "LOW_STOCK") return item.available <= item.threshold;
      if (filter === "COLD_CHAIN") return item.isColdChain;
      return true;
    });

    return {
      items: filtered,
      summary,
      source: "DB",
    };
  }

  /**
   * Atomically increments physical warehouse stock (onHandQty) in PostgreSQL and records AuditLog.
   */
  async restockVariant(
    tenantId: string,
    input: {
      variantId?: string;
      sku?: string;
      warehouseCode?: string;
      quantityDelta: number;
      note?: string;
      actorId?: string;
    },
  ) {
    const qty = Math.round(Number(input.quantityDelta));
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new BadRequestException("تعداد شارژ موجودی باید عددی صحیح و بزرگ‌تر از صفر باشد");
    }
    if (!input.variantId && !input.sku) {
      throw new BadRequestException("شناسه واریانت یا کد SKU برای شارژ موجودی الزامی است");
    }

    const isDefaultTenant =
      !tenantId || tenantId === "00000000-0000-0000-0000-000000000000";

    const variant = await this.prisma.productVariant.findFirst({
      where: {
        ...(!isDefaultTenant ? { tenantId } : {}),
        ...(input.variantId
          ? { id: input.variantId }
          : { sku: input.sku!.trim() }),
      },
      include: {
        product: {
          select: { titleFa: true, slug: true, coldChainRequired: true },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException("کالای مورد نظر در انبار این مستأجر یافت نشد");
    }

    const warehouseCode = input.warehouseCode?.trim() || "MAIN";

    const updated = await this.prisma.$transaction(async (tx) => {
      const existingLevel = await tx.inventoryLevel.findFirst({
        where: {
          tenantId: variant.tenantId,
          storeId: variant.storeId,
          variantId: variant.id,
          warehouseCode,
        },
      });

      const previousOnHand = existingLevel?.onHandQty ?? 0;

      const savedLevel = existingLevel
        ? await tx.inventoryLevel.update({
            where: { id: existingLevel.id },
            data: { onHandQty: { increment: qty } },
          })
        : await tx.inventoryLevel.create({
            data: {
              tenantId: variant.tenantId,
              storeId: variant.storeId,
              variantId: variant.id,
              warehouseCode,
              onHandQty: qty,
              reservedQty: 0,
            },
          });

      await tx.auditLog.create({
        data: {
          tenantId: variant.tenantId,
          actorId: input.actorId || "admin",
          action: "INVENTORY_RESTOCK",
          targetType: "ProductVariant",
          targetId: variant.id,
          diffJson: {
            sku: variant.sku,
            warehouseCode,
            quantityDelta: qty,
            previousOnHand,
            newOnHand: savedLevel.onHandQty,
            note: input.note?.trim() || null,
          },
        },
      });

      return savedLevel;
    });

    return {
      ok: true,
      item: this.toAdminInventoryItem({
        ...variant,
        inventoryLevels: [updated],
      }),
    };
  }
}
