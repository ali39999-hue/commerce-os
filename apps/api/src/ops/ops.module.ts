import { Module } from "@nestjs/common";
import { OpsService } from "./ops.service";
import { OpsController } from "./ops.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [OpsController],
  providers: [OpsService],
  exports: [OpsService],
})
export class OpsModule {}
