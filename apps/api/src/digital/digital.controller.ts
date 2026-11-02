import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
import { CurrentCustomer, DEFAULT_TENANT_ID } from "../common/guards/current-tenant.decorator";
import { SessionUserGuard, SessionCustomer } from "../common/guards/session-user.guard";
import { DigitalService } from "./digital.service";

// ── ADR-012: کالای دیجیتال — لایسنس‌های من، دانلود لایسنس‌دار، ابطال (W18) ──
@Controller("digital")
@UseGuards(SessionUserGuard)
export class DigitalController {
  constructor(private readonly digitalService: DigitalService) {}

  // GET /v1/digital/my-grants — session-bound (AUTH-002 step 2): the phone
  // always comes from the OTP session, never a client-supplied query param.
  @Get("my-grants")
  async myGrants(@CurrentCustomer() customer?: SessionCustomer) {
    if (!customer) {
      throw new UnauthorizedException("برای مشاهده لایسنس‌های دیجیتال خود ابتدا وارد شوید");
    }
    return this.digitalService.listGrantsByPhone(customer.phone);
  }

  // GET /v1/digital/grants?phone=… — legacy verification-script route,
  // deprecated for browsers: grants are entitlements and must not be
  // enumerable by arbitrary phone numbers.
  @Get("grants")
  async grants(@Query("phone") phone?: string) {
    return this.digitalService.listGrantsByPhone(phone ?? "");
  }

  @Get("download/:token")
  async download(@Param("token") token: string) {
    return this.digitalService.downloadByToken(token);
  }

  // License revocation is an admin decision (AUTH-003); downloads stay
  // token-gated per ADR-012 and tenant resolves from the guard (AUTH-002).
  @Post("grants/:id/revoke")
  @UseGuards(AdminGuard)
  async revoke(@Param("id") grantId: string, @CurrentTenant() tenantId: string) {
    return this.digitalService.revokeGrant(grantId, tenantId);
  }
}
