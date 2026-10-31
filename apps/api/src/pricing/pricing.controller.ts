import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
} from "@nestjs/common";
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

  @Post("coupons")
  async createCoupon(
    @Body() body: CreateCouponInput,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    return this.pricingService.createCoupon(body, tenantId);
  }

  @Patch("coupons/:id/toggle")
  async toggleCoupon(@Param("id") id: string) {
    return this.pricingService.toggleCoupon(id);
  }
}
