import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
import { LoyaltyAdjustDto } from "../common/dto/resource-writes.dto";
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

  // Manual point adjustment is an admin op (AUTH-003); tenant resolves from
  // the guard, not the client header (AUTH-002). Balance reads stay
  // tenant-header gated until the storefront session binding lands.
  @Post("admin/users/:userId/adjust")
  @UseGuards(AdminGuard)
  adminAdjust(
    @Param("userId") userId: string,
    @CurrentTenant() tenantId: string,
    @Body() body?: LoyaltyAdjustDto
  ) {
    return this.loyaltyService.adminAdjust({
      tenantId,
      userId,
      pointsDelta: body?.pointsDelta ?? 0,
      reason: body?.reason,
      actor: body?.actor,
    });
  }
}
