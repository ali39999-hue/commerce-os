import { Module } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";
import { DatabaseModule } from "../database/database.module";
import { PricingModule } from "../pricing/pricing.module";
import { InventoryModule } from "../inventory/inventory.module";

@Module({
  imports: [DatabaseModule, PricingModule, InventoryModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
