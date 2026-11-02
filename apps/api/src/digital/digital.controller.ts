import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
import { DigitalService } from "./digital.service";

// ── ADR-012: کالای دیجیتال — لایسنس‌های من، دانلود لایسنس‌دار، ابطال (W18) ──
@Controller("digital")
export class DigitalController {
  constructor(private readonly digitalService: DigitalService) {}

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
