import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { ShippingService } from "./shipping.service";

@Controller("shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post("quote")
  async quote(
    @Body()
    body: {
      originCity: string;
      destinationProvince: string;
      destinationCity: string;
      totalWeightGrams: number;
      packageValueRials: number;
      isFragile?: boolean;
    }
  ) {
    return this.shippingService.calculateQuotes(body);
  }

  @Get("track")
  async track(
    @Query("carrier") carrier: string,
    @Query("trackingCode") trackingCode: string
  ) {
    return this.shippingService.track(carrier, trackingCode);
  }
}
