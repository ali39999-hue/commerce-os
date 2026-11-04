import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { OpsService } from "./ops.service";

@Controller("ops")
@UseGuards(AdminGuard)
export class OpsController {
  constructor(private readonly opsService: OpsService) {}

  @Get("exceptions")
  exceptions() {
    return this.opsService.exceptions();
  }

  @Get("metrics")
  metrics() {
    return this.opsService.metrics();
  }
}
