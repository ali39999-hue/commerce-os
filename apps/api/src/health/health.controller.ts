import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(['health', 'health/liveness'])
  live() {
    return this.healthService.liveness();
  }

  @Get(['ready', 'health/readiness'])
  async ready() {
    const report = await this.healthService.readiness();
    if (report.status === 'not_ready') {
      throw new ServiceUnavailableException(report);
    }
    return report;
  }
}
