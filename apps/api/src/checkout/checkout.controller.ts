import { Controller, Post, Body, Headers, BadRequestException, UseGuards } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutSessionDto, PlaceOrderDto } from "./dto/checkout.dto";
import { SessionUserGuard } from "../common/guards/session-user.guard";
import { CurrentCustomer } from "../common/guards/current-tenant.decorator";
import type { SessionCustomer } from "../common/guards/session-user.guard";

// Optional customer auth (AUTH-002 step 4): guests keep full checkout access;
// signed-in customers get their orders bound to the session identity so
// downstream entitlements (digital grants, order history) land on their phone.
@Controller("checkout")
@UseGuards(SessionUserGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("session")
  async createSession(
    @Body() body: CheckoutSessionDto,
    @CurrentCustomer() customer?: SessionCustomer
  ) {
    // Session identity wins over the client-supplied phone for signed-in
    // customers; guests pass their own phone as before.
    return this.checkoutService.startCheckout({
      ...body,
      customerPhone: customer?.phone ?? body.customerPhone,
    });
  }

  @Post("place-order")
  async placeOrder(
    @Body() body: PlaceOrderDto,
    @Headers("x-idempotency-key") idempotencyKey?: string,
    @CurrentCustomer() customer?: SessionCustomer
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException("ارسال هدر x-idempotency-key برای ثبت سفارش الزامی است");
    }

    return this.checkoutService.placeOrder({
      sessionId: body.sessionId,
      paymentMethod: body.paymentMethod,
      idempotencyKey,
      customer: customer ? { id: customer.id, phone: customer.phone, fullName: customer.fullName } : undefined,
    });
  }
}
