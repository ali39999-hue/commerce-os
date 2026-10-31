import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../database/prisma.service';

describe('HealthController', () => {
  it('reports liveness without claiming database readiness', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
            outboxEvent: { count: jest.fn().mockResolvedValue(0) },
            inventoryReservation: { count: jest.fn().mockResolvedValue(0) },
          },
        },
      ],
    }).compile();

    const controller = module.get(HealthController);
    const result = controller.live();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('commerce-os-api');
    expect(typeof result.uptimeSeconds).toBe('number');
    await module.close();
  });

  it('returns ready when all dependencies pass or are within thresholds', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
            outboxEvent: { count: jest.fn().mockResolvedValue(5) },
            inventoryReservation: { count: jest.fn().mockResolvedValue(2) },
          },
        },
      ],
    }).compile();

    const controller = module.get(HealthController);
    const result = await controller.ready();
    expect(result.dependencies.postgres).toBe('ok');
    expect(result.checks.outboxDlq.count).toBe(5);
    expect(result.checks.staleReservations.count).toBe(2);
    await module.close();
  });
});
