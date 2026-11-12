import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
import { RestockInventoryDto } from "../common/dto/resource-writes.dto";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
@UseGuards(AdminGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get("admin")
  async listAdminInventory(
    @CurrentTenant() tenantId: string,
    @Query("search") search?: string,
    @Query("filter") filter?: string,
  ) {
    return this.inventoryService.listAdminInventory(tenantId, { search, filter });
  }

  @Post("admin/restock")
  async restockVariant(
    @CurrentTenant() tenantId: string,
    @Body() body: RestockInventoryDto,
  ) {
    return this.inventoryService.restockVariant(tenantId, body);
  }
}
