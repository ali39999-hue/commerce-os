import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { SessionUserGuard } from "../common/guards/session-user.guard";
import type { SessionCustomer } from "../common/guards/session-user.guard";
import { CurrentCustomer, CurrentTenant } from "../common/guards/current-tenant.decorator";
import { CreateCouponDto, ValidateCouponDto } from "../common/dto/resource-writes.dto";
import { PricingService, CreateCouponInput } from "./pricing.service";

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get("coupons")
  async listCoupons(
    @Query("storeSlug") storeSlug?: string,
    @Headers("x-tenant-id") tenantId?: string,
  ) {
    return this.pricingService.listCoupons({ storeSlug, tenantId });
  }

  /**
   * Public/Storefront live coupon eligibility check against PostgreSQL rules
   * (expiration, usage limit, B2B clinic restrictions, visitor code, per-user cap).
   */
  @Post("coupons/validate")
  @UseGuards(SessionUserGuard)
  async validateCoupon(
    @Body() body: ValidateCouponDto,
    @CurrentCustomer() customer?: SessionCustomer,
  ) {
    return this.pricingService.validateCoupon({
      ...body,
      customerPhone: customer?.phone ?? body.customerPhone,
      userId: customer?.id,
    });
  }

  // Coupon management is admin-internal (AUTH-003): storefront checkout
  // validates coupons through the pricing service, never through these
  // routes. Tenant resolves from the guard, not the client header (AUTH-002).
  @Post("coupons")
  @UseGuards(AdminGuard)
  async createCoupon(
    @Body() body: CreateCouponDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.pricingService.createCoupon(body as CreateCouponInput, tenantId);
  }

  @Patch("coupons/:id/toggle")
  @UseGuards(AdminGuard)
  async toggleCoupon(
    @Param("id") id: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.pricingService.toggleCoupon(id, tenantId);
  }
}
