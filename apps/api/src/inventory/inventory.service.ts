import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { QuoteLineInput } from "@commerce-os/domain";

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
}
