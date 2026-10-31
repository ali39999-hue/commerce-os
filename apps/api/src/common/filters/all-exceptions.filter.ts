import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { STATUS_CODES } from "node:http";
import * as crypto from "node:crypto";
import { maskPii } from "../logging/pii-sanitizer";

/**
 * Global exception filter (§۶.۱ API contract: structured errors with code + correlationId).
 *
 * Every response body: { statusCode, message, error, code, correlationId, timestamp }.
 *  - HttpException  -> its status + its response message (array messages joined with " · ").
 *  - Unknown error  -> 500 with a fixed Persian message embedding the correlationId;
 *                      the real exception/stack is logged server-side only (never leaked).
 *
 * correlationId = the id already echoed by LoggingInterceptor (so all layers agree)
 *                 ?? incoming "x-correlation-id" header ?? crypto.randomUUID().
 * The resolved id is echoed back on the "x-correlation-id" response header.
 *
 * PII rule (§۷.۱): request/response bodies are NEVER logged, at any level.
 * Any exception messages or stack traces logged server-side are automatically PII sanitized.
 */

interface ExceptionHttpRequest {
  method?: string | undefined;
  url?: string | undefined;
  originalUrl?: string | undefined;
  headers?: {
    "x-correlation-id"?: string | string[] | undefined;
    "x-tenant-id"?: string | string[] | undefined;
  } | undefined;
}

interface ExceptionHttpResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  getHeader(name: string): unknown;
  status(code: number): ExceptionHttpResponse;
  json(body: unknown): unknown;
}

/** Shape of a Nest-style HttpException response object (and our 429 body). */
interface ExceptionResponseLike {
  message?: string | string[] | undefined;
  error?: string | undefined;
  code?: string | undefined;
  retryAfterSeconds?: number | undefined;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== "http") {
      // This API exposes HTTP only; non-HTTP transports are out of scope.
      console.error(
        JSON.stringify({
          level: "error",
          code: "INTERNAL_ERROR",
          error: maskPii(describeException(exception)),
        }),
      );
      return;
    }

    const http = host.switchToHttp();
    const request = http.getRequest<ExceptionHttpRequest>();
    const response = http.getResponse<ExceptionHttpResponse>();

    const correlationId = this.resolveCorrelationId(request, response);
    const tenantId = this.resolveTenantId(request);
    const method = request.method ?? "UNKNOWN";
    const rawUrl = request.originalUrl ?? request.url ?? "";
    const url = maskPii(rawUrl);

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    let error: string;
    let code: string;
    let retryAfterSeconds: number | undefined;

    if (isHttpException) {
      const raw = exception.getResponse();
      const payload: string | ExceptionResponseLike = typeof raw === "string" ? raw : (raw ?? {});
      if (typeof payload === "string") {
        message = payload;
        error = STATUS_CODES[status] ?? "Error";
        code = `HTTP_${status}`;
      } else {
        message = Array.isArray(payload.message)
          ? payload.message.join(" · ")
          : (payload.message ?? exception.message);
        error = payload.error ?? STATUS_CODES[status] ?? "Error";
        code = payload.code ?? `HTTP_${status}`;
        if (typeof payload.retryAfterSeconds === "number") {
          retryAfterSeconds = payload.retryAfterSeconds;
        }
      }
    } else {
      message = `خطای غیرمنتظره در سرور رخ داد. کد پیگیری: ${correlationId}`;
      error = STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR] ?? "Internal Server Error";
      code = "INTERNAL_ERROR";
    }

    const body: Record<string, unknown> = {
      statusCode: status,
      message,
      error,
      code,
      correlationId,
      timestamp: new Date().toISOString(),
    };
    if (retryAfterSeconds !== undefined) {
      body.retryAfterSeconds = retryAfterSeconds;
    }

    response.setHeader("x-correlation-id", correlationId);
    if (retryAfterSeconds !== undefined) {
      response.setHeader("retry-after", String(Math.max(1, Math.ceil(retryAfterSeconds))));
    }
    response.status(status).json(body);

    // ---- Server-side logging (never request/response bodies, §۷.۱) ----
    if (isHttpException && status < HttpStatus.INTERNAL_SERVER_ERROR) {
      // 4xx: status + exception class only — messages can echo user input, so they stay out of logs.
      console.warn(
        JSON.stringify({
          level: "warn",
          correlationId,
          tenantId,
          method,
          url,
          statusCode: status,
          error: exception.name,
        }),
      );
    } else if (isHttpException) {
      console.error(
        JSON.stringify({
          level: "error",
          correlationId,
          tenantId,
          method,
          url,
          statusCode: status,
          error: exception.name,
        }),
      );
    } else {
      // Unknown 500: full stack stays server-side, keyed by the same correlationId sent to the client.
      const logged =
        exception instanceof Error ? exception : new Error(describeException(exception));
      console.error(
        JSON.stringify({
          level: "error",
          correlationId,
          tenantId,
          method,
          url,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: "INTERNAL_ERROR",
          message: maskPii(logged.message),
          stack: logged.stack ? maskPii(logged.stack) : null,
        }),
      );
    }
  }

  private resolveCorrelationId(
    request: ExceptionHttpRequest,
    response: ExceptionHttpResponse,
  ): string {
    // Prefer the id LoggingInterceptor already echoed onto the response, so the
    // interceptor's log line and this error body always share one id.
    const echoed = response.getHeader("x-correlation-id");
    if (typeof echoed === "string" && echoed.length > 0) return echoed;

    const rawHeader = request.headers?.["x-correlation-id"];
    const incoming = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (typeof incoming === "string" && incoming.length > 0) return incoming;

    return crypto.randomUUID();
  }

  private resolveTenantId(request: ExceptionHttpRequest): string | null {
    const rawHeader = request.headers?.["x-tenant-id"];
    const incoming = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (typeof incoming === "string" && incoming.length > 0) return incoming;
    return null;
  }
}

function describeException(exception: unknown): string {
  return exception instanceof Error ? exception.message : String(exception);
}
