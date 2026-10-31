import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Money } from "@commerce-os/domain";

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateWallet(userId: string, tenantId: string) {
    return await this.prisma.wallet.upsert({
      where: {
        tenantId_userId_currency: {
          tenantId,
          userId,
          currency: "IRR",
        },
      },
      update: {},
      create: {
        tenantId,
        userId,
        balance: 0,
        currency: "IRR",
      },
    });
  }

  async getBalance(userId: string, tenantId: string) {
    const wallet = await this.getOrCreateWallet(userId, tenantId);
    const balance = Money.fromRials(BigInt(wallet.balance.toString()));
    return {
      walletId: wallet.id,
      balanceRials: balance.amount.toString(),
      balanceTomans: balance.toTomans().toString(),
      formatted: balance.formatTomans(),
    };
  }

  async credit(params: {
    userId: string;
    tenantId: string;
    amountRials: bigint | number;
    refType: string;
    refId: string;
    description: string;
  }) {
    const { userId, tenantId, amountRials, refType, refId, description } = params;
    const addAmt = BigInt(amountRials);

    return await this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: {
          tenantId_userId_currency: {
            tenantId,
            userId,
            currency: "IRR",
          },
        },
        update: {},
        create: {
          tenantId,
          userId,
          balance: 0,
          currency: "IRR",
        },
      });

      const newBalance = BigInt(wallet.balance.toString()) + addAmt;

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance.toString() },
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          direction: "CREDIT",
          amount: addAmt.toString(),
          refType,
          refId,
          description,
          balanceAfter: newBalance.toString(),
        },
      });

      return { walletId: wallet.id, balanceAfter: newBalance.toString(), txId: txRecord.id };
    });
  }

  async debit(params: {
    userId: string;
    tenantId: string;
    amountRials: bigint | number;
    refType: string;
    refId: string;
    description: string;
  }) {
    const { userId, tenantId, amountRials, refType, refId, description } = params;
    const subAmt = BigInt(amountRials);

    return await this.prisma.$transaction(async (tx) => {
      // Row lock the wallet
      const wallets: any[] = await tx.$queryRaw`
        SELECT id, balance FROM wallets
        WHERE "tenantId" = ${tenantId}::uuid AND "userId" = ${userId}::uuid AND currency = 'IRR'
        FOR UPDATE
      `;

      if (wallets.length === 0) {
        throw new BadRequestException("کیف پول یافت نشد");
      }

      const w = wallets[0];
      const curBalance = BigInt(w.balance.toString());
      if (curBalance < subAmt) {
        throw new BadRequestException("موجودی کیف پول برای این تراکنش کافی نیست");
      }

      const newBalance = curBalance - subAmt;

      await tx.wallet.update({
        where: { id: w.id },
        data: { balance: newBalance.toString() },
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          walletId: w.id,
          direction: "DEBIT",
          amount: subAmt.toString(),
          refType,
          refId,
          description,
          balanceAfter: newBalance.toString(),
        },
      });

      return { walletId: w.id, balanceAfter: newBalance.toString(), txId: txRecord.id };
    });
  }
}
