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
import { PricingService, CreateCouponInput } from "./pricing.service";

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get("coupons")
  async listCoupons(
    @Query("storeSlug") storeSlug?: string,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    return this.pricingService.listCoupons({ storeSlug, tenantId });
  }

  // Coupon management is admin-internal (AUTH-003): storefront checkout
  // validates coupons through the pricing service, never through these routes.
  @Post("coupons")
  @UseGuards(AdminGuard)
  async createCoupon(
    @Body() body: CreateCouponInput,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    return this.pricingService.createCoupon(body, tenantId);
  }

  @Patch("coupons/:id/toggle")
  @UseGuards(AdminGuard)
  async toggleCoupon(@Param("id") id: string) {
    return this.pricingService.toggleCoupon(id);
  }
}
