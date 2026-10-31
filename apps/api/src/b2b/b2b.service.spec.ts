import { BadRequestException } from '@nestjs/common';
import { B2bService } from './b2b.service';
import { PrismaService } from '../database/prisma.service';

// The workspace packages ship ESM dist (jest loads them as CJS → SyntaxError),
// so the module boundary is mocked in-spec without touching jest.config.cjs.
// validateIranianMobile is not exercised by the status machine under test.
jest.mock('@commerce-os/localization', () => ({
  validateIranianMobile: (phone: string) => /^09\d{9}$/.test(phone ?? ''),
}));

function quoteRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'qr-1',
    status: 'NEW',
    companyName: 'شرکت نمونه',
    contactName: 'رابط فروش عمده',
    phone: '09121234567',
    email: null,
    itemsSummary: '۵۰ کیسه قهوه تک‌خاستگاه عمده',
    desiredQty: 50,
    adminNote: null,
    quotedAt: null,
    createdAt: new Date('2026-10-01T10:00:00.000Z'),
    ...overrides,
  };
}

describe('B2bService.updateStatus forward-only machine', () => {
  let findFirst: jest.Mock;
  let update: jest.Mock;
  let service: B2bService;

  beforeEach(() => {
    findFirst = jest.fn();
    update = jest.fn();
    const prisma = {
      quoteRequest: { findFirst, update },
    } as unknown as PrismaService;
    service = new B2bService(prisma);
  });

  it('advances NEW → IN_REVIEW and persists the status', async () => {
    findFirst.mockResolvedValue(quoteRow({ status: 'NEW' }));
    update.mockResolvedValue(quoteRow({ status: 'IN_REVIEW' }));

    const result = await service.updateStatus('qr-1', 'tenant-1', 'IN_REVIEW');

    expect(update).toHaveBeenCalledWith({
      where: { id: 'qr-1' },
      data: { status: 'IN_REVIEW' },
    });
    expect(result.status).toBe('IN_REVIEW');
  });

  it('advances IN_REVIEW → QUOTED and stamps quotedAt', async () => {
    const quotedAt = new Date('2026-10-31T12:00:00.000Z');
    findFirst.mockResolvedValue(quoteRow({ status: 'IN_REVIEW' }));
    update.mockResolvedValue(quoteRow({ status: 'QUOTED', quotedAt }));

    const result = await service.updateStatus('qr-1', 'tenant-1', 'QUOTED');

    expect(update).toHaveBeenCalledWith({
      where: { id: 'qr-1' },
      data: { status: 'QUOTED', quotedAt: expect.any(Date) },
    });
    expect(result.status).toBe('QUOTED');
    expect(result.quotedAt).toBe(quotedAt.toISOString());
  });

  it('rejects the regression QUOTED → NEW with a Persian 400', async () => {
    findFirst.mockResolvedValue(quoteRow({ status: 'QUOTED' }));

    const err = await service
      .updateStatus('qr-1', 'tenant-1', 'NEW')
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as Error).message).toBe('انتقال وضعیت معتبر نیست');
    expect(update).not.toHaveBeenCalled();
  });

  it('rejects the skip NEW → QUOTED with a Persian 400', async () => {
    findFirst.mockResolvedValue(quoteRow({ status: 'NEW' }));

    const err = await service
      .updateStatus('qr-1', 'tenant-1', 'QUOTED')
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as Error).message).toBe('انتقال وضعیت معتبر نیست');
    expect(update).not.toHaveBeenCalled();
  });
});
