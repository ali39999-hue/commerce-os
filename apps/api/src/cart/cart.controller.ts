import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentCustomer, CurrentTenant } from "../common/guards/current-tenant.decorator";
import { SessionCustomer, SessionUserGuard } from "../common/guards/session-user.guard";
import { SyncCartDto, UpdateCartStageDto } from "../common/dto/resource-writes.dto";
import { CartService } from "./cart.service";

@Controller("cart")
@UseGuards(SessionUserGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Storefront pushes live cart contents & buyer context so Admin ERP tracks
   * purchase intent before checkout is finalized.
   */
  @Post("sync")
  async syncCart(
    @Body() body: SyncCartDto,
    @CurrentCustomer() customer?: SessionCustomer,
  ) {
    return this.cartService.syncCart({
      ...body,
      userId: customer?.id,
      customerPhone: customer?.phone ?? body.customerPhone,
      customerName: customer?.fullName ?? body.customerName,
    });
  }

  /**
   * Storefront pushes live funnel stage progression (CART_REVIEW -> CHECKOUT_STARTED ->
   * SHIPPING_SELECTED -> PAYMENT_INITIATED) as user steps through checkout.
   */
  @Post("stage")
  async updateStage(
    @Body() body: UpdateCartStageDto,
    @CurrentCustomer() customer?: SessionCustomer,
  ) {
    return this.cartService.updateStage({
      ...body,
      userId: customer?.id,
      customerPhone: customer?.phone ?? body.customerPhone,
      customerName: customer?.fullName ?? body.customerName,
    });
  }

  /**
   * Admin ERP live funnel telemetry — exposes customer cart contents, phone & stage
   * strictly behind AdminGuard (fail-closed + tenant-scoped).
   */
  @Get("admin/sessions")
  @UseGuards(AdminGuard)
  async listAdminSessions(
    @CurrentTenant() tenantId: string,
    @Query("limit") limit?: string,
  ) {
    return this.cartService.listAdminCartSessions({
      tenantId,
      limit: limit ? parseInt(limit, 10) : 60,
    });
  }
}
