import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../database/prisma.service';

// The workspace packages ship ESM dist (jest loads them as CJS → SyntaxError),
// so the module boundary is mocked in-spec without touching jest.config.cjs.
// validateIranianMobile is not exercised by the status machine under test.
jest.mock('@commerce-os/localization', () => ({
  validateIranianMobile: (phone: string) => /^09\d{9}$/.test(phone ?? ''),
}));

function subRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub-1',
    status: 'ACTIVE',
    quantity: 2,
    phone: '09121234567',
    nextRunAt: new Date('2026-11-10T10:00:00.000Z'),
    lastRunAt: null,
    cyclesRun: 3,
    cancelReason: null,
    createdAt: new Date('2026-10-01T10:00:00.000Z'),
    plan: { id: 'plan-1', slug: 'monthly-ethiopia-coffee', titleFa: 'اشتراک ماهانه قهوه اتیوپی', intervalDays: 30 },
    ...overrides,
  };
}

describe('SubscriptionsService pause/resume/cancel status machine', () => {
  let findFirst: jest.Mock;
  let update: jest.Mock;
  let service: SubscriptionsService;

  beforeEach(() => {
    findFirst = jest.fn();
    update = jest.fn();
    const prisma = {
      subscription: { findFirst, update },
    } as unknown as PrismaService;
    service = new SubscriptionsService(prisma);
  });

  it('pauses an ACTIVE subscription and persists PAUSED', async () => {
    findFirst.mockResolvedValue(subRow({ status: 'ACTIVE' }));
    update.mockResolvedValue(subRow({ status: 'PAUSED' }));

    const result = await service.pause('sub-1', 'tenant-1');

    expect(update).toHaveBeenCalledWith({
      where: { id: 'sub-1' },
      data: { status: 'PAUSED' },
      include: { plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } } },
    });
    expect(result).toMatchObject({ id: 'sub-1', status: 'PAUSED' });
  });

  it('resumes a PAUSED subscription back to ACTIVE', async () => {
    findFirst.mockResolvedValue(subRow({ status: 'PAUSED' }));
    update.mockResolvedValue(subRow({ status: 'ACTIVE' }));

    const result = await service.resume('sub-1', 'tenant-1');

    expect(update).toHaveBeenCalledWith({
      where: { id: 'sub-1' },
      data: { status: 'ACTIVE' },
      include: { plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } } },
    });
    expect(result).toMatchObject({ id: 'sub-1', status: 'ACTIVE' });
  });

  it('cancels an ACTIVE subscription and persists the cancel reason', async () => {
    findFirst.mockResolvedValue(subRow({ status: 'ACTIVE' }));
    update.mockResolvedValue(subRow({ status: 'CANCELLED', cancelReason: 'تغییر ذائقه' }));

    const result = await service.cancel('sub-1', 'tenant-1', 'تغییر ذائقه');

    expect(update).toHaveBeenCalledWith({
      where: { id: 'sub-1' },
      data: { status: 'CANCELLED', cancelReason: 'تغییر ذائقه' },
      include: { plan: { select: { id: true, slug: true, titleFa: true, intervalDays: true } } },
    });
    expect(result).toMatchObject({ id: 'sub-1', status: 'CANCELLED', cancelReason: 'تغییر ذائقه' });
  });

  it('refuses to pause a CANCELLED subscription with a Persian 400', async () => {
    findFirst.mockResolvedValue(subRow({ status: 'CANCELLED' }));

    const err = await service.pause('sub-1', 'tenant-1').catch((e: unknown) => e);

    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as Error).message).toBe('فقط اشتراک فعال قابل توقف است');
    expect(update).not.toHaveBeenCalled();
  });

  it('throws NotFoundException for an unknown subscription id', async () => {
    findFirst.mockResolvedValue(null);

    const err = await service.pause('missing', 'tenant-1').catch((e: unknown) => e);

    expect(err).toBeInstanceOf(NotFoundException);
    expect((err as Error).message).toBe('اشتراک یافت نشد');
    expect(update).not.toHaveBeenCalled();
  });
});
