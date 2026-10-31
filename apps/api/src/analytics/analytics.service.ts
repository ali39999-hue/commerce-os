import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { Prisma } from "../generated/prisma/client";

// ── Blueprint event catalog (W12): only these names may enter the store ──
export const ALLOWED_ANALYTICS_EVENTS: readonly string[] = [
  "product_viewed",
  "search_submitted",
  "add_to_cart",
  "checkout_started",
  "order_confirmed",
];

// ── PII firewall: these keys must never enter analytics, at any depth ──
const PII_KEYS = new Set(["phone", "email", "nationalId", "cardPan", "address"]);

const FUNNEL_STAGES = [
  "product_viewed",
  "add_to_cart",
  "checkout_started",
  "order_confirmed",
] as const;

export type AnalyticsFunnelStage = (typeof FUNNEL_STAGES)[number];

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_SUMMARY_DAYS = 1;
const MAX_SUMMARY_DAYS = 90;
const DEFAULT_SUMMARY_DAYS = 7;

export interface IngestAnalyticsEventInput {
  name: string;
  sessionId?: string;
  userId?: string;
  tenantId?: string;
  props?: Record<string, unknown>;
}

export interface AnalyticsIngestResult {
  accepted: boolean;
  dbAvailable: boolean;
}

export interface AnalyticsFunnelStageView {
  stage: AnalyticsFunnelStage;
  count: number;
  conversionToNextPct: number | null;
}

export interface AnalyticsSummary {
  dbAvailable: boolean;
  days: number;
  totalEvents: number;
  byName: Record<string, number>;
  byDay: Array<{ day: string; count: number }>;
  funnel: AnalyticsFunnelStageView[];
}

function formatUtcDayKey(date: Date): string {
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async ingest(input: IngestAnalyticsEventInput): Promise<AnalyticsIngestResult> {
    if (!ALLOWED_ANALYTICS_EVENTS.includes(input.name)) {
      throw new BadRequestException("رویداد تحلیلی مجاز نیست");
    }

    const propsJson =
      input.props === undefined
        ? undefined
        : (this.stripPii(input.props) as Prisma.InputJsonValue);

    try {
      await this.prisma.analyticsEvent.create({
        data: {
          name: input.name,
          sessionId: input.sessionId,
          userId: input.userId,
          tenantId: input.tenantId,
          propsJson,
        },
      });

      return { accepted: true, dbAvailable: true };
    } catch {
      // Resilient mode: analytics ingest must never break the storefront
      return { accepted: false, dbAvailable: false };
    }
  }

  async summary(daysInput?: number): Promise<AnalyticsSummary> {
    const days = this.normalizeDays(daysInput);
    const dayBuckets = this.buildDayBuckets(days);
    const since = new Date(dayBuckets[0].startMs);

    try {
      const events = await this.prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { name: true, createdAt: true },
      });

      const byName: Record<string, number> = {};
      for (const name of ALLOWED_ANALYTICS_EVENTS) {
        byName[name] = 0;
      }

      const perDayCounts = new Array<number>(days).fill(0);
      let totalEvents = 0;

      for (const event of events) {
        totalEvents += 1;
        byName[event.name] = (byName[event.name] ?? 0) + 1;

        const bucketIndex = Math.floor(
          (event.createdAt.getTime() - dayBuckets[0].startMs) / DAY_MS
        );
        if (bucketIndex >= 0 && bucketIndex < days) {
          perDayCounts[bucketIndex] += 1;
        }
      }

      const byDay = dayBuckets.map((bucket, index) => ({
        day: bucket.day,
        count: perDayCounts[index],
      }));

      const funnel = this.buildFunnel(byName);

      return { dbAvailable: true, days, totalEvents, byName, byDay, funnel };
    } catch {
      // Resilient mode: all-zero structure so the admin UI never breaks
      return {
        dbAvailable: false,
        days,
        totalEvents: 0,
        byName: this.emptyByName(),
        byDay: dayBuckets.map((bucket) => ({ day: bucket.day, count: 0 })),
        funnel: FUNNEL_STAGES.map((stage, index) => ({
          stage,
          count: 0,
          conversionToNextPct: index < FUNNEL_STAGES.length - 1 ? 0 : null,
        })),
      };
    }
  }

  // ── PII firewall: recursively drop sensitive keys before persisting ──
  private stripPii(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.stripPii(item));
    }

    if (value !== null && typeof value === "object") {
      const source = value as Record<string, unknown>;
      const result: Record<string, unknown> = {};
      for (const [key, nested] of Object.entries(source)) {
        if (PII_KEYS.has(key)) {
          continue;
        }
        result[key] = this.stripPii(nested);
      }
      return result;
    }

    return value;
  }

  private buildFunnel(byName: Record<string, number>): AnalyticsFunnelStageView[] {
    const countOf = (stage: string) => byName[stage] ?? 0;

    return FUNNEL_STAGES.map((stage, index) => {
      const count = countOf(stage);

      if (index === FUNNEL_STAGES.length - 1) {
        return { stage, count, conversionToNextPct: null };
      }

      const nextCount = countOf(FUNNEL_STAGES[index + 1]);
      const pct = count > 0 ? (nextCount / count) * 100 : 0;
      return { stage, count, conversionToNextPct: Math.round(pct * 100) / 100 };
    });
  }

  private buildDayBuckets(days: number): Array<{ day: string; startMs: number }> {
    const now = new Date();
    const todayUtcStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    const buckets: Array<{ day: string; startMs: number }> = [];
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const startMs = todayUtcStartMs - offset * DAY_MS;
      buckets.push({ day: formatUtcDayKey(new Date(startMs)), startMs });
    }
    return buckets;
  }

  private emptyByName(): Record<string, number> {
    const byName: Record<string, number> = {};
    for (const name of ALLOWED_ANALYTICS_EVENTS) {
      byName[name] = 0;
    }
    return byName;
  }

  private normalizeDays(daysInput?: number): number {
    const parsed =
      typeof daysInput === "number" && Number.isFinite(daysInput)
        ? Math.floor(daysInput)
        : DEFAULT_SUMMARY_DAYS;
    return Math.min(Math.max(parsed, MIN_SUMMARY_DAYS), MAX_SUMMARY_DAYS);
  }
}
