import { Controller, Get, Post, Body, Param, Headers, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant, CurrentCustomer, DEFAULT_TENANT_ID } from "../common/guards/current-tenant.decorator";
import { SessionUserGuard, SessionCustomer } from "../common/guards/session-user.guard";
import { WalletOperationDto } from "../common/dto/resource-writes.dto";
import { WalletService } from "./wallet.service";

@Controller("wallet")
@UseGuards(SessionUserGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // GET /v1/wallet/my-balance — session-bound (AUTH-002 step 5): the wallet
  // identity comes from the OTP session, never a client-controlled URL.
  @Get("my-balance")
  async myBalance(@CurrentCustomer() customer?: SessionCustomer) {
    if (!customer) {
      throw new UnauthorizedException("برای مشاهده موجودی کیف پول ابتدا وارد شوید");
    }
    return this.walletService.getBalance(customer.id, DEFAULT_TENANT_ID);
  }

  // Legacy verification-script route, locked behind the AdminGuard
  // (AUTH-002 final): wallet balances are financial data and must not be
  // readable by arbitrary user ids from a browser.
  @Get(":userId")
  @UseGuards(AdminGuard)
  async getBalance(@Param("userId") userId: string, @CurrentTenant() tenantId: string) {
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
