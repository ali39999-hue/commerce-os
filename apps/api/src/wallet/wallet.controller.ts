import { Controller, Get, Post, Body, Param, Headers, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { WalletService } from "./wallet.service";

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(":userId")
  async getBalance(
    @Param("userId") userId: string,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    if (!tenantId) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }
    return this.walletService.getBalance(userId, tenantId);
  }

  // Wallet ledger mutations move real money (BigInt Rial, double-entry) —
  // admin/internal only (AUTH-003). Checkout spends via the wallet service,
  // never through these public routes.
  @Post(":userId/credit")
  @UseGuards(AdminGuard)
  async credit(
    @Param("userId") userId: string,
    @Headers("x-tenant-id") tenantId: string,
    @Body() body: { amountRials: number; refType: string; refId: string; description: string }
  ) {
    return this.walletService.credit({
      userId,
      tenantId,
      amountRials: body.amountRials,
      refType: body.refType,
      refId: body.refId,
      description: body.description,
    });
  }

  @Post(":userId/debit")
  @UseGuards(AdminGuard)
  async debit(
    @Param("userId") userId: string,
    @Headers("x-tenant-id") tenantId: string,
    @Body() body: { amountRials: number; refType: string; refId: string; description: string }
  ) {
    return this.walletService.debit({
      userId,
      tenantId,
      amountRials: body.amountRials,
      refType: body.refType,
      refId: body.refId,
      description: body.description,
    });
  }
}
