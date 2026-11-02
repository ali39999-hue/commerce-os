import { Module } from "@nestjs/common";
import { LedgerService } from "./ledger.service";
import { LedgerController } from "./ledger.controller";
import { DatabaseModule } from "../database/database.module";
import { IdentityModule } from "../identity/identity.module";

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}

