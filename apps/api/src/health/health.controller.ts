import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  live() {
    return { status: 'ok', service: 'commerce-os-api' };
  }

  @Get('ready')
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', dependencies: { postgres: 'ok' } };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        dependencies: { postgres: 'unavailable' },
      });
    }
  }
}
