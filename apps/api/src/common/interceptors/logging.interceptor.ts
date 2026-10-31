import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import * as crypto from "node:crypto";

/**
 * PII-safe request logging (§۷.۱: logs must not contain PII).
 *
 * Success: one JSON line { correlationId, method, url, statusCode, durationMs }.
 * Error:   one JSON line at level "error" carrying the exception message only
 *          (no stack here — AllExceptionsFilter owns stack logging).
 *
 * Request/response bodies are NEVER read or logged. The correlationId is
 * resolved as incoming "x-correlation-id" ?? crypto.randomUUID() and echoed on
 * the response header so AllExceptionsFilter and the client see the same id.
 */

interface LoggingHttpRequest {
  method?: string | undefined;
  url?: string | undefined;
  originalUrl?: string | undefined;
  headers?: { "x-correlation-id"?: string | string[] | undefined } | undefined;
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

    const rawHeader = request.headers?.["x-correlation-id"];
    const incoming = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const correlationId =
      typeof incoming === "string" && incoming.length > 0 ? incoming : crypto.randomUUID();
    response.setHeader("x-correlation-id", correlationId);

    const method = request.method ?? "UNKNOWN";
    const url = request.originalUrl ?? request.url ?? "";
    const startedAtMs = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAtMs;
          // correlationId is read back from the response header per contract.
          const echoed = response.getHeader("x-correlation-id");
          const loggedId = typeof echoed === "string" && echoed.length > 0 ? echoed : correlationId;
          console.log(
            JSON.stringify({
              correlationId: loggedId,
              method,
              url,
              statusCode: response.statusCode,
              durationMs,
            }),
          );
        },
        error: (exception: unknown) => {
          const durationMs = Date.now() - startedAtMs;
          const message = exception instanceof Error ? exception.message : String(exception);
          console.error(
            JSON.stringify({ level: "error", correlationId, method, url, message, durationMs }),
          );
        },
      }),
    );
  }
}
