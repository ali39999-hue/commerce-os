import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
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

  @Post("grants/:id/revoke")
  async revoke(@Param("id") grantId: string, @Headers("x-tenant-id") tenantId?: string) {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }

    return this.digitalService.revokeGrant(grantId, tenantId.trim());
  }
}
