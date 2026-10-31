import { Module } from "@nestjs/common";
import { DigitalService } from "./digital.service";
import { DigitalController } from "./digital.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [DigitalController],
  providers: [DigitalService],
  exports: [DigitalService],
})
export class DigitalModule {}
