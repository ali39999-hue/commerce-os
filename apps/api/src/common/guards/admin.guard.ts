import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { timingSafeEqualStrings } from "@commerce-os/security";
import { IdentityService } from "../../identity/identity.service";

/**
 * Roles that grant access to admin-internal endpoints (ops telemetry, ledger
 * exports, ...). Staff roles are granted by a DB update on the User record —
 * OTP login never self-assigns them.
 */
export const ADMIN_ROLES = ["SUPER_ADMIN", "OPERATOR", "ACCOUNTANT"] as const;

export const ADMIN_API_KEY_HEADER = "x-admin-api-key";

/**
 * Guard for admin-internal endpoints. Accepts either:
 *  1. A live OTP session token (Authorization: Bearer) whose user holds an
 *     admin role, or
 *  2. A server-to-server key (x-admin-api-key) matching ADMIN_API_KEY,
 *     compared in constant time.
 *
 * Everything else is rejected with 401 so the static-analysis finding
 * "sensitive operations without role checks" is closed with runtime evidence.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly identityService: IdentityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers["authorization"];
    const apiKeyHeader: string | undefined = request.headers[ADMIN_API_KEY_HEADER];

    // 1) Server-to-server key (CI, verify scripts, internal tooling)
    const configuredKey = process.env.ADMIN_API_KEY;
    if (configuredKey && apiKeyHeader && timingSafeEqualStrings(configuredKey, apiKeyHeader)) {
      return true;
    }

    // 2) OTP session token bound to an admin role
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      const user = await this.identityService.validateSessionToken(token);
      if (user && (ADMIN_ROLES as readonly string[]).includes(user.role)) {
        request.adminUser = { id: user.id, phone: user.phone, fullName: user.fullName, role: user.role };
        return true;
      }
    }

    throw new UnauthorizedException(
      "دسترسی مدیریتی الزامی است: نشست معتبر با نقش ادمین یا کلید سرویس‌به‌سرویس ارائه نشده است",
    );
  }
}
