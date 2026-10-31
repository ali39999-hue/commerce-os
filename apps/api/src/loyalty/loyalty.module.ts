import { Module } from "@nestjs/common";
import { LoyaltyService } from "./loyalty.service";
import { LoyaltyController } from "./loyalty.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
