/**
 * Dependency-free in-memory rate limiter (threat model T-12: DoS -> rate limit).
 *
 * Strategy: fixed-window counters keyed by `scope:ip` (60s window), with a
 * periodic sweep that evicts expired buckets so the Map cannot grow unbounded.
 *
 * NOTE (production swap): this store is per-process and resets on restart.
 * In production, replace it with a Redis-backed store implementing the exact
 * same `check(ip, scope)` interface (e.g. INCR + EXPIRE per `scope:ip` key) so
 * limits are shared across horizontally scaled instances. Nothing else in the
 * codebase touches this store directly — only RateLimitGuard consumes it.
 */

export type RateLimitScope = "global" | "auth";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface BucketState {
  windowStartMs: number;
  count: number;
}

/** Fixed window length: 1 minute. */
const WINDOW_MS = 60_000;

function parsePositiveIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export class RateLimitService {
  /** Requests per minute per IP for ordinary API traffic. Env: RATE_LIMIT_GLOBAL_PER_MIN (default 300). */
  private readonly globalLimit: number;

  /** Requests per minute per IP for /v1/auth endpoints (brute-force protection). Env: RATE_LIMIT_AUTH_PER_MIN (default 10). */
  private readonly authLimit: number;

  private readonly buckets = new Map<string, BucketState>();

  /** Unref'd so it never keeps the Node process alive on its own. */
  private readonly cleanupTimer: NodeJS.Timeout;

  constructor() {
    this.globalLimit = parsePositiveIntEnv("RATE_LIMIT_GLOBAL_PER_MIN", 300);
    this.authLimit = parsePositiveIntEnv("RATE_LIMIT_AUTH_PER_MIN", 10);
    this.cleanupTimer = setInterval(() => this.sweep(), WINDOW_MS);
    // Guard against very old runtimes without unref.
    this.cleanupTimer.unref?.();
  }

  /**
   * Consume one request from the bucket for `ip` in `scope`.
   * Pure in-memory read/increment — no store side effects beyond the counter.
   */
  check(ip: string, scope: RateLimitScope): RateLimitResult {
    const limit = scope === "auth" ? this.authLimit : this.globalLimit;
    const now = Date.now();
    const key = `${scope}:${ip}`;

    let bucket = this.buckets.get(key);
    if (bucket === undefined || now - bucket.windowStartMs >= WINDOW_MS) {
      bucket = { windowStartMs: now, count: 0 };
      this.buckets.set(key, bucket);
    }

    bucket.count += 1;
    const allowed = bucket.count <= limit;
    const windowEndsAtMs = bucket.windowStartMs + WINDOW_MS;
    const retryAfterSeconds = allowed ? 0 : Math.max(1, Math.ceil((windowEndsAtMs - now) / 1000));
    const remaining = allowed ? Math.max(0, limit - bucket.count) : 0;

    return { allowed, remaining, retryAfterSeconds };
  }

  /** Evict buckets whose window has fully elapsed. Called by the interval; safe to call manually. */
  private sweep(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.windowStartMs >= WINDOW_MS) {
        this.buckets.delete(key);
      }
    }
  }

  /** Stop the cleanup interval (useful in tests / graceful shutdown). */
  dispose(): void {
    this.cleanupTimer.unref?.();
    clearInterval(this.cleanupTimer);
  }
}
