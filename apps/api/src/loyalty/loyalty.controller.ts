import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { LoyaltyService } from "./loyalty.service";

// ADR-008: باشگاه مشتریان — موجودی/تاریخچه کاربر + تنظیم دستی ادمین
@Controller("loyalty")
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get("users/:userId")
  async getUserLoyalty(
    @Param("userId") userId: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Query("limit") limit?: string
  ) {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }

    const result = await this.loyaltyService.balance(
      userId,
      tenantId.trim(),
      limit !== undefined ? Number.parseInt(limit, 10) : 20
    );

    return { userId, tenantId: tenantId.trim(), ...result };
  }

  @Post("admin/users/:userId/adjust")
  adminAdjust(
    @Param("userId") userId: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Body() body?: { pointsDelta?: number; reason?: string; actor?: string }
  ) {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }

    return this.loyaltyService.adminAdjust({
      tenantId: tenantId.trim(),
      userId,
      pointsDelta: body?.pointsDelta ?? 0,
      reason: body?.reason,
      actor: body?.actor,
    });
  }
}
