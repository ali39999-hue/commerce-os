import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { SessionCustomer } from "./session-user.guard";

/**
 * Default tenant for the single-tenant deployment profile. Client-supplied
 * x-tenant-id headers are no longer trusted on guarded routes (AUTH-002):
 * session-authenticated admin calls always resolve to this value, while
 * server-to-service key clients may still pin a tenant through the header.
 */
export const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Parameter decorator that reads the tenant resolved by AdminGuard
 * (request.tenantId) — never the raw client header.
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return typeof request.tenantId === "string" && request.tenantId.length > 0
      ? request.tenantId
      : DEFAULT_TENANT_ID;
  },
);

/**
 * Parameter decorator that reads the session-resolved customer identity
 * attached by SessionUserGuard (request.customerUser) — undefined for guests.
 */
export const CurrentCustomer = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionCustomer | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.customerUser;
  },
);
