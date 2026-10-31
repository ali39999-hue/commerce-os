import { Controller, Get } from "@nestjs/common";
import { OpsService } from "./ops.service";

@Controller("ops")
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
