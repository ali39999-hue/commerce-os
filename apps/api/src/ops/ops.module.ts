import { Module } from "@nestjs/common";
import { OpsService } from "./ops.service";
import { OpsController } from "./ops.controller";
import { DatabaseModule } from "../database/database.module";
import { IdentityModule } from "../identity/identity.module";

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [OpsController],
  providers: [OpsService],
  exports: [OpsService],
})
export class OpsModule {}
