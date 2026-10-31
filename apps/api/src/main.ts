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

  // Security Headers via Helmet middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      xContentTypeOptions: true,
      xFrameOptions: { action: 'sameorigin' },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
  }));

  // Tighten CORS policy: Enforce explicit allowlist from environment variables.
  // Prohibit unrestricted wildcard (* or origin: true) in production mode.
  const isProduction = process.env.NODE_ENV === 'production';
  const configuredOrigins: string[] = [
    process.env.STOREFRONT_URL ?? 'http://localhost:3000',
    process.env.ADMIN_URL ?? 'http://localhost:3001',
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : []),
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim()) : []),
  ].filter((url): url is string => Boolean(url && url.length > 0));

  const allowedOriginsSet = new Set<string>(configuredOrigins);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. server-to-server, mobile native, curl/postman)
      if (!origin) {
        return callback(null, true);
      }

      // In development mode, allow localhost or loopback if explicitly unconfigured
      if (!isProduction) {
        if (
          allowedOriginsSet.has(origin) ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')
        ) {
          return callback(null, true);
        }
      } else {
        // In production mode, require strict match against configured allowlist
        if (allowedOriginsSet.has(origin)) {
          return callback(null, true);
        }
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-id',
      'x-user-id',
      'x-idempotency-key',
      'x-correlation-id',
    ],
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
