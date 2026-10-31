import { Injectable, Logger } from '@nestjs/common';
import * as net from 'node:net';
import { PrismaService } from '../database/prisma.service';
import { OutboxStatus, ReservationStatus } from '../generated/prisma/client';

export interface HealthProbeCheck {
  status: 'ok' | 'degraded' | 'unavailable';
  latencyMs?: number;
  count?: number;
  threshold?: number;
  error?: string;
  details?: Record<string, unknown>;
}

export interface ReadinessReport {
  status: 'ready' | 'not_ready' | 'degraded';
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  dependencies: {
    postgres: 'ok' | 'unavailable';
    redis: 'ok' | 'unavailable' | 'degraded';
    outboxDlq: 'ok' | 'degraded' | 'unavailable';
    staleReservations: 'ok' | 'degraded' | 'unavailable';
  };
  checks: {
    postgres: HealthProbeCheck;
    redis: HealthProbeCheck;
    outboxDlq: HealthProbeCheck;
    staleReservations: HealthProbeCheck;
  };
}

export interface LivenessReport {
  status: 'ok';
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  pid: number;
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
}

/**
 * Native socket-based Redis PING check.
 * Connects to the Redis instance, executes RESP PING, and measures round-trip latency.
 */
export async function pingRedisServer(
  redisUrl: string = process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  timeoutMs = 1500,
): Promise<{ status: 'ok' | 'unavailable'; latencyMs: number; error?: string }> {
  const started = Date.now();
  return new Promise((resolve) => {
    let client: net.Socket | null = null;
    let settled = false;

    const finish = (status: 'ok' | 'unavailable', error?: string) => {
      if (settled) return;
      settled = true;
      if (client) {
        client.removeAllListeners();
        client.destroy();
      }
      resolve({ status, latencyMs: Date.now() - started, ...(error ? { error } : {}) });
    };

    const timer = setTimeout(() => {
      finish('unavailable', 'Redis connection timeout');
    }, timeoutMs);

    try {
      const parsed = new URL(redisUrl);
      const port = Number(parsed.port) || 6379;
      const host = parsed.hostname || '127.0.0.1';
      const password = parsed.password ? decodeURIComponent(parsed.password) : null;

      client = net.createConnection({ host, port });
      client.setTimeout(timeoutMs);

      client.on('connect', () => {
        if (password) {
          const authCmd = `*2\r\n$4\r\nAUTH\r\n$${Buffer.byteLength(password)}\r\n${password}\r\n`;
          client?.write(authCmd);
        } else {
          client?.write('*1\r\n$4\r\nPING\r\n');
        }
      });

      client.on('data', (chunk) => {
        const text = chunk.toString();
        if (text.startsWith('+OK') && password) {
          client?.write('*1\r\n$4\r\nPING\r\n');
          return;
        }
        if (text.includes('PONG')) {
          clearTimeout(timer);
          finish('ok');
        } else if (text.startsWith('-')) {
          clearTimeout(timer);
          finish('unavailable', text.trim());
        }
      });

      client.on('error', (err) => {
        clearTimeout(timer);
        finish('unavailable', err.message);
      });

      client.on('timeout', () => {
        clearTimeout(timer);
        finish('unavailable', 'Socket timeout');
      });
    } catch (err: any) {
      clearTimeout(timer);
      finish('unavailable', err?.message || String(err));
    }
  });
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  liveness(): LivenessReport {
    const mem = process.memoryUsage();
    return {
      status: 'ok',
      service: 'commerce-os-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      pid: process.pid,
      memory: {
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      },
    };
  }

  async readiness(): Promise<ReadinessReport> {
    const [pgCheck, redisCheck, dlqCheck, staleResCheck] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
      this.checkOutboxDlq(),
      this.checkStaleReservations(),
    ]);

    const isPgHealthy = pgCheck.status === 'ok';
    const isRedisRequired =
      process.env.REDIS_REQUIRED === 'true' || process.env.NODE_ENV === 'production';
    const isRedisHealthy = redisCheck.status === 'ok' || !isRedisRequired;

    let overallStatus: 'ready' | 'not_ready' | 'degraded' = 'ready';
    if (!isPgHealthy || !isRedisHealthy) {
      overallStatus = 'not_ready';
    } else if (
      dlqCheck.status === 'degraded' ||
      staleResCheck.status === 'degraded' ||
      redisCheck.status === 'unavailable'
    ) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      service: 'commerce-os-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      dependencies: {
        postgres: isPgHealthy ? 'ok' : 'unavailable',
        redis: redisCheck.status === 'ok' ? 'ok' : isRedisRequired ? 'unavailable' : 'degraded',
        outboxDlq: dlqCheck.status,
        staleReservations: staleResCheck.status,
      },
      checks: {
        postgres: pgCheck,
        redis: redisCheck,
        outboxDlq: dlqCheck,
        staleReservations: staleResCheck,
      },
    };
  }

  async checkPostgres(): Promise<HealthProbeCheck> {
    const started = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        latencyMs: Date.now() - started,
      };
    } catch (err: any) {
      return {
        status: 'unavailable',
        latencyMs: Date.now() - started,
        error: err?.message || String(err),
      };
    }
  }

  async checkRedis(): Promise<HealthProbeCheck> {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    const res = await pingRedisServer(redisUrl);
    return {
      status: res.status,
      latencyMs: res.latencyMs,
      ...(res.error ? { error: res.error } : {}),
      details: { url: redisUrl.replace(/\/\/[^@]+@/, '//***@') },
    };
  }

  async checkOutboxDlq(threshold = 50): Promise<HealthProbeCheck> {
    try {
      const count = await this.prisma.outboxEvent.count({
        where: {
          status: { in: [OutboxStatus.FAILED, OutboxStatus.DEAD_LETTER] },
        },
      });
      return {
        status: count > threshold ? 'degraded' : 'ok',
        count,
        threshold,
      };
    } catch (err: any) {
      return {
        status: 'unavailable',
        count: 0,
        threshold,
        error: err?.message || String(err),
      };
    }
  }

  async checkStaleReservations(threshold = 20): Promise<HealthProbeCheck> {
    try {
      const count = await this.prisma.inventoryReservation.count({
        where: {
          status: ReservationStatus.ACTIVE,
          expiresAt: { lt: new Date() },
        },
      });
      return {
        status: count > threshold ? 'degraded' : 'ok',
        count,
        threshold,
      };
    } catch (err: any) {
      return {
        status: 'unavailable',
        count: 0,
        threshold,
        error: err?.message || String(err),
      };
    }
  }
}
