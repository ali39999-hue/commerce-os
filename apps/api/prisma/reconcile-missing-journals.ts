/**
 * Ledger reconciliation (RB-01 spirit): finds orders marked PAID that are
 * missing their JRN-SALE-<orderId> journal and posts it idempotently.
 * Run: pnpm --filter @commerce-os/api exec tsx prisma/reconcile-missing-journals.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '.env', override: false });
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import {
  createOrderSaleJournal,
  CHART_OF_ACCOUNTS,
} from '@commerce-os/finance';
import { Money } from '@commerce-os/domain';

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const toMoney = (v: any): Money => {
    if (typeof v === 'string') return Money.fromRials(BigInt(v));
    if (typeof v === 'number') return Money.fromRials(BigInt(Math.trunc(v)));
    if (v?.amount !== undefined) return Money.fromRials(BigInt(v.amount.toString()));
    return Money.zero('IRR');
  };

  function hydrateQuote(raw: any) {
    return {
      ...raw,
      subtotal: toMoney(raw?.subtotal),
      totalDiscount: toMoney(raw?.totalDiscount),
      vat: toMoney(raw?.vat),
      shipping: toMoney(raw?.shipping),
      total: toMoney(raw?.total),
      discounts: Array.isArray(raw?.discounts)
        ? raw.discounts.map((d: any) => ({ ...d, amount: toMoney(d.amount) }))
        : [],
    };
  }

  const paidOrders = await prisma.order.findMany({
    where: { status: 'PAID' },
    include: { paymentIntents: true },
  });

  let posted = 0;
  let skipped = 0;

  for (const order of paidOrders) {
    const ref = `JRN-SALE-${order.id}`;
    const existing = await prisma.ledgerJournal.findUnique({
      where: { tenantId_ref: { tenantId: order.tenantId, ref } },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const intent = order.paymentIntents?.[0];
    const method =
      (intent?.method as string) === 'CARD_TO_CARD'
        ? 'CARD_TO_CARD'
        : (intent?.method as string) === 'WALLET'
          ? 'WALLET'
          : 'GATEWAY';

    const batch = createOrderSaleJournal({
      orderId: order.id,
      tenantId: order.tenantId,
      storeId: order.storeId,
      quote: hydrateQuote(order.priceSnapshot) as any,
      paymentMethod: method as 'GATEWAY' | 'CARD_TO_CARD' | 'WALLET',
    });

    const journal = await prisma.ledgerJournal.create({
      data: {
        tenantId: order.tenantId,
        storeId: order.storeId,
        ref: batch.ref,
        sourceType: batch.sourceType,
        sourceId: batch.sourceId,
        description: batch.description,
      },
    });

    const accounts = await prisma.ledgerAccount.findMany({ where: { tenantId: order.tenantId } });
    const accountMap = new Map(accounts.map((a) => [a.code, a.id]));

    for (const leg of batch.legs) {
      const accountId = accountMap.get(leg.accountCode);
      if (!accountId) throw new Error(`حساب ${leg.accountCode} یافت نشد`);
      await prisma.ledgerEntry.create({
        data: {
          journalId: journal.id,
          accountId,
          direction: leg.direction,
          amount: leg.amount.amount.toString(),
          currency: 'IRR',
          description: leg.descriptionFa,
        },
      });
    }

    posted++;
    console.log(`✅ سند ثبت شد: ${ref} (${batch.legs.length} ردیف)`);
  }

  console.log(`📊 مغایرت‌گیری کامل: ${posted} سند جدید · ${skipped} از قبل موجود`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('خطای مغایرت‌گیری:', err?.message ?? err);
  process.exit(1);
});
