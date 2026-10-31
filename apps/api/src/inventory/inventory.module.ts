import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
