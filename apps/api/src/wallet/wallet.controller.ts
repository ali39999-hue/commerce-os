import { Controller, Get, Post, Body, Param, Headers, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
import { WalletOperationDto } from "../common/dto/resource-writes.dto";
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
  // admin/internal only (AUTH-003), tenant resolved by the guard (AUTH-002).
  @Post(":userId/credit")
  @UseGuards(AdminGuard)
  async credit(
    @Param("userId") userId: string,
    @CurrentTenant() tenantId: string,
    @Body() body: WalletOperationDto
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
    @CurrentTenant() tenantId: string,
    @Body() body: WalletOperationDto
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
