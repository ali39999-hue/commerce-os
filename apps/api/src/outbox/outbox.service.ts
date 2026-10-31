import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publish(eventType: string, payload: Record<string, any>, tenantId?: string) {
    return await this.prisma.outboxEvent.create({
      data: {
        eventType,
        payloadJson: payload,
        tenantId,
        status: "PENDING",
      },
    });
  }

  /**
   * Atomically claims pending outbox events using PostgreSQL FOR UPDATE SKIP LOCKED.
   * Guarantees zero double-claiming across parallel worker processes.
   */
  async claimEvents(workerId: string, limit = 20): Promise<any[]> {
    const claimedRows: any[] = await this.prisma.$queryRaw`
      UPDATE outbox_events
      SET status = 'PROCESSING', "lockedAt" = NOW(), "workerId" = ${workerId}
      WHERE id IN (
        SELECT id FROM outbox_events
        WHERE status = 'PENDING' AND "availableAt" <= NOW()
        ORDER BY "availableAt" ASC
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, "eventType", "payloadJson", "tenantId", "retryCount"
    `;

    return claimedRows;
  }

  async markProcessed(id: string) {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: { status: "PROCESSED" },
    });
  }

  async markFailed(id: string, retryCount: number, errorMsg: string) {
    if (retryCount >= 5) {
      this.logger.error(`Outbox event ${id} moved to DEAD_LETTER after 5 failures: ${errorMsg}`);
      await this.prisma.outboxEvent.update({
        where: { id },
        data: { status: "DEAD_LETTER" },
      });
    } else {
      // Exponential backoff
      const nextDelaySeconds = Math.pow(2, retryCount) * 10;
      const availableAt = new Date(Date.now() + nextDelaySeconds * 1000);

      await this.prisma.outboxEvent.update({
        where: { id },
        data: {
          status: "PENDING",
          retryCount: { increment: 1 },
          availableAt,
          lockedAt: null,
          workerId: null,
        },
      });
    }
  }
}
