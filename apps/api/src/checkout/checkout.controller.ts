import { Controller, Post, Body, Headers, BadRequestException } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { QuoteLineInput, AddressSnapshot } from "@commerce-os/domain";

@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("session")
  async createSession(
    @Body()
    body: {
      storeId?: string;
      storeSlug?: string;
      items: QuoteLineInput[];
      customerPhone: string;
      customerName: string;
      address: AddressSnapshot;
      couponCode?: string;
    }
  ) {
    return this.checkoutService.startCheckout(body);
  }

  @Post("place-order")
  async placeOrder(
    @Body()
    body: {
      sessionId: string;
      paymentMethod: "ZARINPAL" | "CARD_TO_CARD" | "WALLET";
    },
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
