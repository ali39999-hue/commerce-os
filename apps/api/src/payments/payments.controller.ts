import { Controller, Post, Get, Body, Param, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { PaymentInitiateDto, ReceiptApproveDto, ReceiptSubmitDto } from "../common/dto/resource-writes.dto";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(":intentId/initiate")
  async initiate(
    @Param("intentId") intentId: string,
    @Body() body: PaymentInitiateDto
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
    @Body() body: ReceiptSubmitDto
  ) {
    return this.paymentsService.submitCardToCardReceipt({
      intentId,
      referenceNumber: body.referenceNumber,
      payerCardNumber: body.payerCardNumber,
      receiptImageUrl: body.receiptImageUrl,
    });
  }

  // Card-to-card receipt approval is the admin SoD decision point (AUTH-003).
  // Customer submission (/:intentId/receipt) stays public by design.
  @Post("receipts/:receiptId/approve")
  @UseGuards(AdminGuard)
  async approveReceipt(
    @Param("receiptId") receiptId: string,
    @Body() body: ReceiptApproveDto
  ) {
    return this.paymentsService.approveCardToCardReceipt(
      receiptId,
      body.reviewer || "admin"
    );
  }
}
