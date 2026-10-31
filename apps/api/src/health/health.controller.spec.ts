import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../database/prisma.service';

describe('HealthController', () => {
  it('reports liveness without claiming database readiness', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: { $queryRaw: jest.fn() } }],
    }).compile();
    const controller = module.get(HealthController);
    expect(controller.live()).toEqual({ status: 'ok', service: 'commerce-os-api' });
    await module.close();
  });

  it('returns ready only when Postgres probe succeeds', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) } }],
    }).compile();
    const controller = module.get(HealthController);
    await expect(controller.ready()).resolves.toEqual({ status: 'ready', dependencies: { postgres: 'ok' } });
    await module.close();
  });
});
