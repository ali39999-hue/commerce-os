import { GoneException, HttpException, NotFoundException } from '@nestjs/common';
import { DigitalService } from './digital.service';
import { PrismaService } from '../database/prisma.service';

// The workspace packages ship ESM dist (jest loads them as CJS → SyntaxError),
// so the module boundary is mocked in-spec without touching jest.config.cjs.
// validateIranianMobile is not exercised by the download claim path under test.
jest.mock('@commerce-os/localization', () => ({
  validateIranianMobile: (phone: string) => /^09\d{9}$/.test(phone ?? ''),
}));

function grantRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'grant-1',
    orderId: 'order-1',
    token: 'tok-abc123',
    variantId: 'variant-1',
    productTitle: 'کتاب دیجیتال قهوه',
    downloadCount: 2,
    maxDownloads: 5,
    revokedAt: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2026-10-01T10:00:00.000Z'),
    ...overrides,
  };
}

describe('DigitalService.downloadByToken claim rules', () => {
  let findUnique: jest.Mock;
  let updateMany: jest.Mock;
  let variantFindUnique: jest.Mock;
  let service: DigitalService;

  beforeEach(() => {
    findUnique = jest.fn();
    updateMany = jest.fn();
    variantFindUnique = jest.fn();
    const prisma = {
      digitalGrant: { findUnique, updateMany },
      productVariant: { findUnique: variantFindUnique },
    } as unknown as PrismaService;
    service = new DigitalService(prisma);
  });

  it('returns Persian 404 when the token does not exist', async () => {
    findUnique.mockResolvedValue(null);

    const err = await service.downloadByToken('nope').catch((e: unknown) => e);

    expect(err).toBeInstanceOf(NotFoundException);
    expect((err as HttpException).getStatus()).toBe(404);
    expect((err as Error).message).toBe('لایسنس دیجیتال مورد نظر یافت نشد');
    expect(updateMany).not.toHaveBeenCalled();
  });

  it('returns Persian 410 when the grant is already revoked', async () => {
    findUnique.mockResolvedValue(
      grantRow({ revokedAt: new Date('2026-10-01T00:00:00.000Z') }),
    );

    const err = await service.downloadByToken('tok-abc123').catch((e: unknown) => e);

    expect(err).toBeInstanceOf(GoneException);
    expect((err as HttpException).getStatus()).toBe(410);
    expect((err as Error).message).toBe('این لایسنس باطل شده یا منقضی شده است');
    expect(updateMany).not.toHaveBeenCalled();
  });

  it('returns Persian 410 when the atomic claim claims zero rows (exhausted)', async () => {
    const row = grantRow({ downloadCount: 5, maxDownloads: 5 });
    findUnique.mockResolvedValue(row);
    updateMany.mockResolvedValue({ count: 0 });

    const err = await service.downloadByToken('tok-abc123').catch((e: unknown) => e);

    expect(err).toBeInstanceOf(GoneException);
    expect((err as HttpException).getStatus()).toBe(410);
    expect((err as Error).message).toBe('سقف دانلود این لایسنس به پایان رسیده است');
    // The cap is enforced inside the conditional UPDATE, never in app code
    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: 'grant-1',
        downloadCount: { lt: 5 },
        revokedAt: null,
        expiresAt: { gt: expect.any(Date) },
      },
      data: { downloadCount: { increment: 1 } },
    });
    expect(variantFindUnique).not.toHaveBeenCalled();
  });

  it('claims one download and reports the remaining allowance', async () => {
    const row = grantRow({ downloadCount: 2, maxDownloads: 5 });
    findUnique.mockResolvedValue(row);
    updateMany.mockResolvedValue({ count: 1 });
    variantFindUnique.mockResolvedValue({ digitalFileUrl: 'https://cdn.example.com/ebook.pdf' });

    await expect(service.downloadByToken('tok-abc123')).resolves.toEqual({
      ok: true,
      downloadUrl: 'https://cdn.example.com/ebook.pdf',
      remainingDownloads: 2, // maxDownloads - (downloadCount + 1) = 5 - 3
      expiresAt: row.expiresAt.toISOString(),
    });

    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: 'grant-1',
        downloadCount: { lt: 5 },
        revokedAt: null,
        expiresAt: { gt: expect.any(Date) },
      },
      data: { downloadCount: { increment: 1 } },
    });
    expect(variantFindUnique).toHaveBeenCalledWith({
      where: { id: 'variant-1' },
      select: { digitalFileUrl: true },
    });
  });
});
