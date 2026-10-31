import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { RateLimitService, RateLimitScope } from "./rate-limit.service";

/**
 * Global rate-limit guard (threat model T-12: DoS -> rate limit).
 *
 * Zero constructor injections on purpose: it is registered via
 * `app.useGlobalGuards(new RateLimitGuard())` in src/main.ts, so it must be
 * instantiable without the AppModule/DI container.
 *
 * Scopes:
 *  - "auth":     any path starting with /v1/auth or /v1/identity (default 10 req/min/IP)
 *  - "checkout": /v1/checkout/place-order (default 20 req/min/IP)
 *  - "search":   any path starting with /v1/search (default 60 req/min/IP)
 *  - "reviews":  any path starting with /v1/reviews (default 40 req/min/IP)
 *  - "global":   everything else (default 300 req/min/IP)
 * Skipped: OPTIONS preflights, /v1/health, /v1/ready.
 */

/** Minimal structural typing for the Express request — no direct express import needed. */
interface RateLimitedRequest {
  method?: string | undefined;
  url?: string | undefined;
  path?: string | undefined;
  ip?: string | undefined;
  socket?: { remoteAddress?: string | undefined } | undefined;
}

const SKIPPED_PATHS = new Set<string>([
  "/v1/health",
  "/v1/ready",
  "/v1/health/liveness",
  "/v1/health/readiness",
]);

export class RateLimitGuard implements CanActivate {
  private readonly rateLimitService = new RateLimitService();

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== "http") return true;

    const request = context.switchToHttp().getRequest<RateLimitedRequest>();

    const method = (request.method ?? "").toUpperCase();
    if (method === "OPTIONS") return true;

    const path = request.path ?? request.url ?? "";
    if (SKIPPED_PATHS.has(path)) return true;

    const scope = this.resolveScope(path);
    const ip = request.ip ?? request.socket?.remoteAddress ?? "unknown";

    const result = this.rateLimitService.check(ip, scope);
    if (!result.allowed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
          retryAfterSeconds: result.retryAfterSeconds,
          error: "Too Many Requests",
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private resolveScope(path: string): RateLimitScope {
    const cleanPath = path.split("?")[0].toLowerCase();

    if (cleanPath.startsWith("/v1/auth") || cleanPath.startsWith("/v1/identity")) {
      return "auth";
    }
    if (cleanPath === "/v1/checkout/place-order" || cleanPath.startsWith("/v1/checkout/place-order")) {
      return "checkout";
    }
    if (cleanPath.startsWith("/v1/search")) {
      return "search";
    }
    if (cleanPath.startsWith("/v1/reviews")) {
      return "reviews";
    }
    return "global";
  }
}
