import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import * as crypto from "node:crypto";
import { maskPii } from "../logging/pii-sanitizer";

/**
 * PII-safe request logging (§۷.۱: logs must not contain PII).
 *
 * Success: one JSON line { correlationId, tenantId, method, url, statusCode, durationMs }.
 * Error:   one JSON line at level "error" carrying the sanitized exception message only
 *          (no stack here — AllExceptionsFilter owns stack logging).
 *
 * Request/response bodies are NEVER read or logged. The correlationId is
 * resolved as incoming "x-correlation-id" ?? crypto.randomUUID() and echoed on
 * the response header so AllExceptionsFilter and the client see the same id.
 * The tenantId is resolved from "x-tenant-id" (if provided).
 * Any PII embedded in query strings or exception messages is automatically masked.
 */

interface LoggingHttpRequest {
  method?: string | undefined;
  url?: string | undefined;
  originalUrl?: string | undefined;
  headers?: {
    "x-correlation-id"?: string | string[] | undefined;
    "x-tenant-id"?: string | string[] | undefined;
  } | undefined;
}

interface LoggingHttpResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  getHeader(name: string): unknown;
}

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") return next.handle();

    const http = context.switchToHttp();
    const request = http.getRequest<LoggingHttpRequest>();
    const response = http.getResponse<LoggingHttpResponse>();

    const rawCorrHeader = request.headers?.["x-correlation-id"];
    const incomingCorr = Array.isArray(rawCorrHeader) ? rawCorrHeader[0] : rawCorrHeader;
    const correlationId =
      typeof incomingCorr === "string" && incomingCorr.length > 0
        ? incomingCorr
        : crypto.randomUUID();
    response.setHeader("x-correlation-id", correlationId);

    const rawTenantHeader = request.headers?.["x-tenant-id"];
    const incomingTenant = Array.isArray(rawTenantHeader) ? rawTenantHeader[0] : rawTenantHeader;
    const tenantId =
      typeof incomingTenant === "string" && incomingTenant.length > 0 ? incomingTenant : null;

    const method = request.method ?? "UNKNOWN";
    const rawUrl = request.originalUrl ?? request.url ?? "";
    const url = maskPii(rawUrl);
    const startedAtMs = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAtMs;
          // correlationId is read back from the response header per contract.
          const echoed = response.getHeader("x-correlation-id");
          const loggedId =
            typeof echoed === "string" && echoed.length > 0 ? echoed : correlationId;
          console.log(
            JSON.stringify({
              correlationId: loggedId,
              tenantId,
              method,
              url,
              statusCode: response.statusCode,
              durationMs,
            }),
          );
        },
        error: (exception: unknown) => {
          const durationMs = Date.now() - startedAtMs;
          const rawMessage = exception instanceof Error ? exception.message : String(exception);
          const message = maskPii(rawMessage);
          console.error(
            JSON.stringify({
              level: "error",
              correlationId,
              tenantId,
              method,
              url,
              message,
              durationMs,
            }),
          );
        },
      }),
    );
  }
}
