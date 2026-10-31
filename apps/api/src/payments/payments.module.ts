import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { DatabaseModule } from "../database/database.module";
import { InventoryModule } from "../inventory/inventory.module";
import { LedgerModule } from "../ledger/ledger.module";

@Module({
  imports: [DatabaseModule, InventoryModule, LedgerModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
