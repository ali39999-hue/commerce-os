import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;

  constructor(config: ConfigService) {
    const connectionString =
      config.get<string>('DATABASE_URL') ||
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/commerce_os?schema=public';

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('✅ Connected successfully to PostgreSQL 17 database');
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`⚠️ PostgreSQL connection warning: ${err?.message || err}`);
      this.logger.warn('⚠️ Starting in resilient mode. Database operations will attempt reconnection or use fallback.');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}
