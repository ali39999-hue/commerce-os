import { RateLimitGuard } from "./rate-limit.guard";
import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

describe("RateLimitGuard", () => {
  let guard: RateLimitGuard;

  beforeEach(() => {
    guard = new RateLimitGuard();
    process.env.RATE_LIMIT_GLOBAL_PER_MIN = "300";
    process.env.RATE_LIMIT_AUTH_PER_MIN = "10";
    process.env.RATE_LIMIT_CHECKOUT_PER_MIN = "5";
    process.env.RATE_LIMIT_SEARCH_PER_MIN = "15";
    process.env.RATE_LIMIT_REVIEWS_PER_MIN = "8";
  });

  function createMockContext(path: string, ip = "192.0.2.1", method = "GET"): ExecutionContext {
    return {
      getType: () => "http",
      switchToHttp: () => ({
        getRequest: () => ({
          method,
          path,
          url: path,
          ip,
        }),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;
  }

  it("allows requests within auth limits on /v1/auth/otp/request and /v1/identity/otp/request", () => {
    const ctx = createMockContext("/v1/identity/otp/request", "198.51.100.10", "POST");
    for (let i = 0; i < 10; i++) {
      expect(guard.canActivate(ctx)).toBe(true);
    }
    // 11th request exceeds auth limit (10)
    expect(() => guard.canActivate(ctx)).toThrow(HttpException);
  });

  it("enforces specific checkout rate limit on /v1/checkout/place-order", () => {
    const ctx = createMockContext("/v1/checkout/place-order", "198.51.100.20", "POST");
    for (let i = 0; i < 5; i++) {
      expect(guard.canActivate(ctx)).toBe(true);
    }
    // 6th request exceeds checkout limit (5)
    try {
      guard.canActivate(ctx);
      fail("Should have thrown HttpException");
    } catch (err: any) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      const resp = err.getResponse();
      expect(resp.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("enforces search rate limit on /v1/search", () => {
    const ctx = createMockContext("/v1/search?q=retinol", "198.51.100.30", "GET");
    for (let i = 0; i < 15; i++) {
      expect(guard.canActivate(ctx)).toBe(true);
    }
    expect(() => guard.canActivate(ctx)).toThrow(HttpException);
  });

  it("enforces reviews rate limit on /v1/reviews/products/prod_1", () => {
    const ctx = createMockContext("/v1/reviews/products/prod_1", "198.51.100.40", "POST");
    for (let i = 0; i < 8; i++) {
      expect(guard.canActivate(ctx)).toBe(true);
    }
    expect(() => guard.canActivate(ctx)).toThrow(HttpException);
  });

  it("skips health and options preflight requests", () => {
    const healthCtx = createMockContext("/v1/health", "198.51.100.50", "GET");
    const optionsCtx = createMockContext("/v1/checkout/place-order", "198.51.100.50", "OPTIONS");

    expect(guard.canActivate(healthCtx)).toBe(true);
    expect(guard.canActivate(optionsCtx)).toBe(true);
  });
});
