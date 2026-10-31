import { NotFoundException } from '@nestjs/common';
import { InvalidStateTransitionError } from '@commerce-os/domain';
import { OrdersService } from './orders.service';
import { PrismaService } from '../database/prisma.service';

// The workspace packages ship ESM dist (jest loads them as CJS → SyntaxError),
// so the module boundaries are mocked in-spec without touching jest.config.cjs.
// domain: the real, import-free state-machine source keeps the guard honest.
jest.mock('@commerce-os/domain', () => ({
  ...jest.requireActual('../../../../packages/domain/src/state-machines.ts'),
}));

// finance is unrelated to transitionStatus; only the named imports are stubbed.
jest.mock('@commerce-os/finance', () => ({
  DEFAULT_SELLER_INFO: {},
  generateOfficialTaxInvoiceHtml: jest.fn(() => '<html></html>'),
  numberToPersianWords: jest.fn(() => ''),
  formatAccountingJalaliDate: jest.fn(() => ''),
}));

describe('OrdersService.transitionStatus', () => {
  let findUnique: jest.Mock;
  let orderUpdate: jest.Mock;
  let historyCreate: jest.Mock;
  let service: OrdersService;

  beforeEach(() => {
    findUnique = jest.fn();
    orderUpdate = jest.fn();
    historyCreate = jest.fn();

    // txMock wraps the same fns: inside $transaction the service only touches tx
    const tx = {
      order: { update: orderUpdate },
      orderStatusHistory: { create: historyCreate },
    };
    const prisma = {
      order: { findUnique, update: orderUpdate },
      orderStatusHistory: { create: historyCreate },
      $transaction: jest.fn((cb: (tx: unknown) => Promise<unknown>) => cb(tx)),
    } as unknown as PrismaService;

    service = new OrdersService(prisma);
  });

  it('persists a valid transition and records history', async () => {
    findUnique.mockResolvedValue({ id: 'order-1', status: 'PAID' });
    const updated = { id: 'order-1', status: 'PROCESSING' };
    orderUpdate.mockResolvedValue(updated);

    await expect(
      service.transitionStatus('order-1', 'PROCESSING', 'admin-1', 'شروع بسته‌بندی'),
    ).resolves.toBe(updated);

    expect(orderUpdate).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'PROCESSING' },
    });
    expect(historyCreate).toHaveBeenCalledWith({
      data: {
        orderId: 'order-1',
        fromStatus: 'PAID',
        toStatus: 'PROCESSING',
        actor: 'admin-1',
        reason: 'شروع بسته‌بندی',
      },
    });
  });

  it('rejects an invalid transition without touching the order', async () => {
    findUnique.mockResolvedValue({ id: 'order-2', status: 'CANCELLED' });

    const err = await service
      .transitionStatus('order-2', 'PAID', 'admin-1')
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(InvalidStateTransitionError);
    expect((err as Error).message).toBe(
      'Invalid Order state transition: cannot transition from CANCELLED to PAID',
    );
    expect(orderUpdate).not.toHaveBeenCalled();
    expect(historyCreate).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the order does not exist', async () => {
    findUnique.mockResolvedValue(null);

    const err = await service
      .transitionStatus('missing', 'PAID', 'admin-1')
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(NotFoundException);
    expect((err as Error).message).toBe('سفارش یافت نشد');
    expect(orderUpdate).not.toHaveBeenCalled();
    expect(historyCreate).not.toHaveBeenCalled();
  });
});
