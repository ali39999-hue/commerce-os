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
import { CurrentTenant, CurrentCustomer, DEFAULT_TENANT_ID } from "../common/guards/current-tenant.decorator";
import { SessionUserGuard, SessionCustomer } from "../common/guards/session-user.guard";
import { LoyaltyAdjustDto } from "../common/dto/resource-writes.dto";
import { LoyaltyService } from "./loyalty.service";

// ADR-008: باشگاه مشتریان — موجودی/تاریخچه کاربر + تنظیم دستی ادمین
@Controller("loyalty")
@UseGuards(SessionUserGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  // GET /v1/loyalty/my-balance — session-bound (AUTH-002 step 5): points and
  // tier always resolve from the OTP session identity.
  @Get("my-balance")
  async myBalance(
    @CurrentCustomer() customer?: SessionCustomer,
    @Query("limit") limit?: string
  ) {
    if (!customer) {
      throw new UnauthorizedException("برای مشاهده امتیازهای باشگاه مشتریان ابتدا وارد شوید");
    }
    const result = await this.loyaltyService.balance(
      customer.id,
      DEFAULT_TENANT_ID,
      limit !== undefined ? Number.parseInt(limit, 10) : 20
    );
    return { userId: customer.id, ...result };
  }

  // Legacy verification-script route, locked behind the AdminGuard
  // (AUTH-002 final): loyalty balances must not be readable by arbitrary
  // user ids from a browser.
  @Get("users/:userId")
  @UseGuards(AdminGuard)
  async getUserLoyalty(
    @Param("userId") userId: string,
    @CurrentTenant() tenantId: string,
    @Query("limit") limit?: string
  ) {
    const result = await this.loyaltyService.balance(
      userId,
      tenantId,
      limit !== undefined ? Number.parseInt(limit, 10) : 20
    );

    return { userId, tenantId, ...result };
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
