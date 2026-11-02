import { Global, Module } from "@nestjs/common";
import { IdentityService } from "./identity.service";
import { IdentityController } from "./identity.controller";
import { DatabaseModule } from "../database/database.module";

// Global so the session-validating AdminGuard (AUTH-001/003) resolves
// IdentityService in every feature module without repeating imports —
// same pattern as the global DatabaseModule.
@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
