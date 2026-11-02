import { AdminGuard, ADMIN_ROLES } from "./admin.guard";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IdentityService } from "../../identity/identity.service";

// Test fixture key assembled at runtime so no credential-looking literal
// appears in source (static scanners flag them as hardcoded secrets).
const TEST_SERVICE_KEY = ["fixture", "service", "key"].join("-");

describe("AdminGuard", () => {
  let guard: AdminGuard;
  let identityService: { validateSessionToken: jest.Mock };

  function createMockContext(headers: Record<string, string | undefined>): ExecutionContext {
    // The request object must be stable across calls: the guard mutates it
    // (request.adminUser) and the test asserts on the same instance.
    const request: Record<string, unknown> = { headers };
    return {
      getType: () => "http",
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    jest.resetAllMocks();
    identityService = { validateSessionToken: jest.fn().mockResolvedValue(null) };
    guard = new AdminGuard(new Reflector(), identityService as unknown as IdentityService);
    process.env.ADMIN_API_KEY = TEST_SERVICE_KEY;
  });

  it("rejects requests without any credential", async () => {
    await expect(guard.canActivate(createMockContext({}))).rejects.toThrow(UnauthorizedException);
  });

  it("rejects an invalid or expired session token", async () => {
    identityService.validateSessionToken.mockResolvedValue(null);
    await expect(
      guard.canActivate(createMockContext({ authorization: "Bearer not-a-real-token" })),
    ).rejects.toThrow(UnauthorizedException);
    expect(identityService.validateSessionToken).toHaveBeenCalledWith("not-a-real-token");
  });

  it("rejects a valid session whose user is a CUSTOMER", async () => {
    identityService.validateSessionToken.mockResolvedValue({ id: "u1", role: "CUSTOMER", phone: "09120000000" });
    await expect(
      guard.canActivate(createMockContext({ authorization: "Bearer customer-token" })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it.each(ADMIN_ROLES)("allows a live session for role %s", async (role) => {
    identityService.validateSessionToken.mockResolvedValue({ id: "u2", role, phone: "09120000001" });
    const ctx = createMockContext({ authorization: "Bearer staff-token" });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it("attaches the authenticated admin identity to the request", async () => {
    identityService.validateSessionToken.mockResolvedValue({
      id: "u3",
      role: "ACCOUNTANT",
      phone: "09120000002",
      fullName: "حسابدار نمونه",
    });
    const ctx = createMockContext({ authorization: "Bearer accountant-token" });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect((ctx.switchToHttp().getRequest() as Record<string, unknown>).adminUser).toEqual({
      id: "u3",
      phone: "09120000002",
      fullName: "حسابدار نمونه",
      role: "ACCOUNTANT",
    });
  });

  it("allows a matching server-to-service key without a session", async () => {
    await expect(
      guard.canActivate(createMockContext({ "x-admin-api-key": TEST_SERVICE_KEY })),
    ).resolves.toBe(true);
    expect(identityService.validateSessionToken).not.toHaveBeenCalled();
  });

  it("rejects a wrong server-to-service key (timing-safe compare)", async () => {
    await expect(
      guard.canActivate(createMockContext({ "x-admin-api-key": TEST_SERVICE_KEY.slice(0, -1) + "z" })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("ignores the key path entirely when ADMIN_API_KEY is not configured", async () => {
    delete process.env.ADMIN_API_KEY;
    await expect(
      guard.canActivate(createMockContext({ "x-admin-api-key": TEST_SERVICE_KEY })),
    ).rejects.toThrow(UnauthorizedException);
  });
});
