import { Controller, Get, Post, Body, Param, Headers, UnauthorizedException } from "@nestjs/common";
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

  @Post(":userId/credit")
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
