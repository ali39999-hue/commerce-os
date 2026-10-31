import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root and current directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RateLimitGuard } from './common/rate-limit/rate-limit.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
  }));

  // Enable CORS for storefront (3000) and admin (3001)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Hardening layer: PII-safe logging, structured errors, rate limiting (T-12)
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalGuards(new RateLimitGuard());

  const port = Number.parseInt(process.env.API_PORT ?? process.env.PORT ?? '4000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 [Commerce OS API] Running at http://localhost:${port}/v1`);
}

void bootstrap();
