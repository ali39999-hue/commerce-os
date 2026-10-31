import { Controller, Post, Get, Body, Param, Query } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(":intentId/initiate")
  async initiate(
    @Param("intentId") intentId: string,
    @Body() body: { callbackBaseUrl?: string }
  ) {
    const callback = body.callbackBaseUrl || process.env.API_PUBLIC_URL || "http://localhost:4000";
    return this.paymentsService.initiate(intentId, callback);
  }

  @Get("callback/zarinpal")
  async zarinpalCallback(
    @Query("intentId") intentId: string,
    @Query() query: Record<string, any>
  ) {
    return this.paymentsService.verifyZarinpalCallback(intentId, query);
  }

  @Post(":intentId/receipt")
  async submitReceipt(
    @Param("intentId") intentId: string,
    @Body()
    body: {
      referenceNumber: string;
      payerCardNumber?: string;
      receiptImageUrl?: string;
    }
  ) {
    return this.paymentsService.submitCardToCardReceipt({
      intentId,
      referenceNumber: body.referenceNumber,
      payerCardNumber: body.payerCardNumber,
      receiptImageUrl: body.receiptImageUrl,
    });
  }

  @Post("receipts/:receiptId/approve")
  async approveReceipt(
    @Param("receiptId") receiptId: string,
    @Body() body: { reviewer?: string }
  ) {
    return this.paymentsService.approveCardToCardReceipt(
      receiptId,
      body.reviewer || "admin"
    );
  }
}
