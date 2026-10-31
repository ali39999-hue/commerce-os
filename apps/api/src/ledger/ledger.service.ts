import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  createOrderSaleJournal,
  createOrderRefundJournal,
  CHART_OF_ACCOUNTS,
  buildSepidarCsv,
  formatAccountingJalaliDate,
  getFiscalYear,
  AccountingExportRow,
} from "@commerce-os/finance";
import { Quote, Money } from "@commerce-os/domain";

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensures chart of accounts entries exist for this tenant.
   */
  async ensureAccounts(tenantId: string): Promise<void> {
    for (const [code, def] of Object.entries(CHART_OF_ACCOUNTS)) {
      await this.prisma.ledgerAccount.upsert({
        where: {
          tenantId_code_currency: {
            tenantId,
            code,
            currency: "IRR",
          },
        },
        update: {},
        create: {
          tenantId,
          code,
          nameFa: def.nameFa,
          category: def.category as any,
          currency: "IRR",
        },
      });
    }
  }

  /**
   * Rehydrates a persisted price snapshot (plain JSON from JsonB) into a Quote
   * whose monetary fields are real Money instances — required by the finance
   * package's journal builders which call Money methods.
   */
  private hydrateQuote(raw: any): Quote {
    const toMoney = (v: any): Money => {
      if (v instanceof Money) return v;
      if (typeof v === "string") return Money.fromRials(BigInt(v));
      if (typeof v === "number") return Money.fromRials(BigInt(Math.trunc(v)));
      if (v?.amount !== undefined) return Money.fromRials(BigInt(v.amount.toString()));
      return Money.zero("IRR");
    };
    return {
      ...(raw ?? {}),
      subtotal: toMoney(raw?.subtotal),
      totalDiscount: toMoney(raw?.totalDiscount),
      vat: toMoney(raw?.vat),
      shipping: toMoney(raw?.shipping),
      total: toMoney(raw?.total),
      discounts: Array.isArray(raw?.discounts)
        ? raw.discounts.map((d: any) => ({ ...d, amount: toMoney(d.amount) }))
        : [],
    } as Quote;
  }

  /**
   * Posts a balanced double-entry sale journal for a captured order.
   */
  async postSaleJournal(params: {
    orderId: string;
    tenantId: string;
    storeId: string;
    quote: Quote;
    paymentMethod: "GATEWAY" | "CARD_TO_CARD" | "WALLET";
  }) {
    const { orderId, tenantId, storeId, quote: rawQuote, paymentMethod } = params;
    const quote = this.hydrateQuote(rawQuote);
    await this.ensureAccounts(tenantId);

    const journalBatch = createOrderSaleJournal({
      orderId,
      tenantId,
      storeId,
      quote,
      paymentMethod,
    });

    return await this.prisma.$transaction(async (tx) => {
      // Check idempotency of this journal
      const existing = await tx.ledgerJournal.findUnique({
        where: {
          tenantId_ref: {
            tenantId,
            ref: journalBatch.ref,
          },
        },
      });

      if (existing) {
        return existing;
      }

      const journal = await tx.ledgerJournal.create({
        data: {
          tenantId,
          storeId,
          ref: journalBatch.ref,
          sourceType: journalBatch.sourceType,
          sourceId: journalBatch.sourceId,
          description: journalBatch.description,
        },
      });

      // Fetch account map
      const accounts = await tx.ledgerAccount.findMany({
        where: { tenantId },
      });
      const accountMap = new Map(accounts.map((a) => [a.code, a.id]));

      for (const leg of journalBatch.legs) {
        const accountId = accountMap.get(leg.accountCode);
        if (!accountId) {
          throw new BadRequestException(`حساب معین حسابداری ${leg.accountCode} تعریف نشده است`);
        }

        await tx.ledgerEntry.create({
          data: {
            journalId: journal.id,
            accountId,
            direction: leg.direction as any,
            amount: leg.amount.amount.toString(),
            currency: "IRR",
            description: leg.descriptionFa,
          },
        });
      }

      return journal;
    });
  }

  /**
   * Retrieves trial balance or journal history for audit.
   */
  async getTrialBalance(tenantId: string) {
    const accounts = await this.prisma.ledgerAccount.findMany({
      where: { tenantId },
      include: {
        entries: true,
      },
    });

    return accounts.map((acc) => {
      let debit = 0n;
      let credit = 0n;
      for (const e of acc.entries) {
        const amt = BigInt(e.amount.toString());
        if (e.direction === "DEBIT") debit += amt;
        else credit += amt;
      }
      return {
        code: acc.code,
        nameFa: acc.nameFa,
        category: acc.category,
        totalDebitRials: debit.toString(),
        totalCreditRials: credit.toString(),
        netBalanceRials: (debit - credit).toString(),
      };
    });
  }

  /**
   * Generates official Iranian accounting CSV format for Sepidar / Holoo import with UTF-8 BOM.
   */
  async exportSepidarCsv(tenantId: string): Promise<string> {
    const journals = await this.prisma.ledgerJournal.findMany({
      where: { tenantId },
      include: {
        entries: {
          include: { account: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const rows: AccountingExportRow[] = [];

    for (const j of journals) {
      const jalaliDate = formatAccountingJalaliDate(j.createdAt);
      const isoDate = j.createdAt.toISOString();
      const fiscalPeriod = getFiscalYear(j.createdAt);

      for (const entry of j.entries) {
        const isDebit = entry.direction === "DEBIT";
        rows.push({
          entryNumber: j.ref,
          jalaliDate,
          isoDate,
          fiscalPeriod,
          accountCode: entry.account?.code || "1010",
          accountName: entry.account?.nameFa || "حساب پیش‌فرض",
          entryDescription: j.description,
          lineDescription: entry.description || j.description,
          debit: isDebit ? entry.amount.toString() : "0",
          credit: !isDebit ? entry.amount.toString() : "0",
          currency: entry.currency,
          referenceType: j.sourceType,
          referenceId: j.sourceId,
          status: "POSTED",
        });
      }
    }

    return buildSepidarCsv(rows);
  }
}
