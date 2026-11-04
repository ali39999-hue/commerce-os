import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IdentityService } from "../../identity/identity.service";

export interface SessionCustomer {
  id: string;
  phone: string;
  fullName: string;
  role: string;
}

declare module "express" {
  // eslint-disable-next-line @typescript-eslint/no-interface-default
  interface Request {
    customerUser?: SessionCustomer;
  }
}

/**
 * Optional-auth guard for customer storefront endpoints (AUTH-002 step 2).
 * Validates the OTP session Bearer token when present and attaches
 * request.customerUser; guests pass through untouched so handlers decide
 * whether identity is required.
 */
@Injectable()
export class SessionUserGuard implements CanActivate {
  constructor(private readonly identityService: IdentityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers["authorization"];
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) return true;

    const user = await this.identityService.validateSessionToken(token);
    if (user) {
      request.customerUser = { id: user.id, phone: user.phone, fullName: user.fullName, role: user.role };
    }
    return true;
  }
}
