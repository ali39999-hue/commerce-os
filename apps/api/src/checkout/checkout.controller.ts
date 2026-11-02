import { Controller, Post, Body, Headers, BadRequestException } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutSessionDto, PlaceOrderDto } from "./dto/checkout.dto";

@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("session")
  async createSession(@Body() body: CheckoutSessionDto) {
    return this.checkoutService.startCheckout(body);
  }

  @Post("place-order")
  async placeOrder(
    @Body() body: PlaceOrderDto,
    @Headers("x-idempotency-key") idempotencyKey?: string
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException("ارسال هدر x-idempotency-key برای ثبت سفارش الزامی است");
    }

    return this.checkoutService.placeOrder({
      sessionId: body.sessionId,
      paymentMethod: body.paymentMethod,
      idempotencyKey,
    });
  }
}
