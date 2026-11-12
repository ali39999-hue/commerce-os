export type BackendErrorKind = 'OFFLINE' | 'SERVER_ERROR';

export interface BackendErrorDetails {
  kind: BackendErrorKind;
  statusCode: number;
  endpoint: string;
  detail: string;
  correlationId?: string;
  code?: string;
  timestamp: string;
}

export const ADMIN_BACKEND_ERROR_EVENT = 'drdermer:admin-backend-error';
export const ADMIN_BACKEND_RECOVERED_EVENT = 'drdermer:admin-backend-recovered';

let lastAdminBackendError: BackendErrorDetails | null = null;

export class AdminBackendServiceError extends Error implements BackendErrorDetails {
  readonly isBackendServiceError = true as const;
  readonly kind: BackendErrorKind;
  readonly statusCode: number;
  readonly endpoint: string;
  readonly detail: string;
  readonly correlationId?: string;
  readonly code?: string;
  readonly timestamp: string;

  constructor(details: BackendErrorDetails) {
    const prefix = details.kind === 'OFFLINE' ? 'BACKEND_OFFLINE' : 'BACKEND_SERVER_ERROR';
    super(`${prefix} (${details.statusCode}) [${details.endpoint}]: ${details.detail}`);
    this.name = 'AdminBackendServiceError';
    this.kind = details.kind;
    this.statusCode = details.statusCode;
    this.endpoint = details.endpoint;
    this.detail = details.detail;
    this.correlationId = details.correlationId;
    this.code = details.code;
    this.timestamp = details.timestamp;
  }
}

export function extractAdminErrorDetails(value: unknown): BackendErrorDetails | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<AdminBackendServiceError>;
  if (
    candidate.isBackendServiceError === true &&
    (candidate.kind === 'OFFLINE' || candidate.kind === 'SERVER_ERROR') &&
    typeof candidate.statusCode === 'number' &&
    typeof candidate.endpoint === 'string'
  ) {
    return {
      kind: candidate.kind,
      statusCode: candidate.statusCode,
      endpoint: candidate.endpoint,
      detail: candidate.detail || candidate.message || 'خطای سرور مرکزی',
      correlationId: candidate.correlationId,
      code: candidate.code,
      timestamp: candidate.timestamp || new Date().toISOString(),
    };
  }
  return null;
}

export function isBackendFailureStatus(status: number): boolean {
  return status >= 500;
}

export function isIntentionalAbort(err: unknown, timedOut?: boolean): boolean {
  if (timedOut) return false;
  if (!err || typeof err !== 'object') return false;
  return (err as { name?: unknown }).name === 'AbortError';
}

export function toSanitizedEndpoint(url: string): string {
  try {
    const parsed = new URL(url, 'http://localhost');
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

export async function isOptionalRedisOnly503(
  response: Response,
  url: string,
): Promise<boolean> {
  if (response.status !== 503) return false;
  const pathname = toSanitizedEndpoint(url).split('?')[0];
  if (!pathname.endsWith('/ready') && !pathname.endsWith('/health/readiness')) {
    return false;
  }
  const payload = (await response.clone().json().catch(() => null)) as {
    dependencies?: { postgres?: string; redis?: string };
  } | null;
  return (
    payload?.dependencies?.postgres === 'ok' &&
    payload?.dependencies?.redis === 'unavailable'
  );
}

export async function parseApiErrorPayload(
  response: Response,
  endpoint: string,
): Promise<AdminBackendServiceError> {
  let detail = `خطای سرور مرکزی (HTTP ${response.status})`;
  let correlationId: string | undefined;
  let code: string | undefined;
  let timestamp = new Date().toISOString();

  try {
    const payload = (await response.clone().json()) as {
      message?: string | string[];
      error?: string;
      code?: string;
      correlationId?: string;
      timestamp?: string;
    } | null;

    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.message) && payload.message.length > 0) {
        detail = payload.message.join(' | ');
      } else if (typeof payload.message === 'string' && payload.message.trim()) {
        detail = payload.message.trim();
      } else if (typeof payload.error === 'string' && payload.error.trim()) {
        detail = payload.error.trim();
      }
      if (typeof payload.correlationId === 'string' && payload.correlationId.trim()) {
        correlationId = payload.correlationId.trim();
      }
      if (typeof payload.code === 'string' && payload.code.trim()) {
        code = payload.code.trim();
      }
      if (typeof payload.timestamp === 'string' && payload.timestamp.trim()) {
        timestamp = payload.timestamp.trim();
      }
    }
  } catch {
    try {
      const text = await response.clone().text();
      if (text.trim()) {
        detail = text.trim().slice(0, 220);
      }
    } catch {
      // Keep default HTTP message
    }
  }

  return new AdminBackendServiceError({
    kind: 'SERVER_ERROR',
    statusCode: response.status,
    endpoint: toSanitizedEndpoint(endpoint),
    detail,
    correlationId,
    code,
    timestamp,
  });
}

export function normalizeNetworkError(err: unknown, endpoint: string): AdminBackendServiceError {
  const errName =
    err && typeof err === 'object' && typeof (err as { name?: unknown }).name === 'string'
      ? (err as { name: string }).name
      : '';
  const errMessage =
    err instanceof Error && err.message
      ? err.message
      : typeof err === 'string'
        ? err
        : 'Connection failed';

  const detail =
    errName === 'TimeoutError'
      ? 'مهلت پاسخ‌گویی سرور مرکزی به پایان رسید (Timeout).'
      : `ارتباط با سرور مرکزی ERP برقرار نشد (${errMessage}).`;

  return new AdminBackendServiceError({
    kind: 'OFFLINE',
    statusCode: 0,
    endpoint: toSanitizedEndpoint(endpoint),
    detail,
    timestamp: new Date().toISOString(),
  });
}

export function reportAdminBackendError(input: BackendErrorDetails | AdminBackendServiceError): void {
  const details: BackendErrorDetails = {
    kind: input.kind,
    statusCode: input.statusCode,
    endpoint: input.endpoint,
    detail: input.detail,
    correlationId: input.correlationId,
    code: input.code,
    timestamp: input.timestamp || new Date().toISOString(),
  };

  if (typeof window === 'undefined') return;

  lastAdminBackendError = details;
  window.dispatchEvent(
    new CustomEvent<BackendErrorDetails>(ADMIN_BACKEND_ERROR_EVENT, { detail: details }),
  );
}

export function getLastAdminBackendError(): BackendErrorDetails | null {
  return lastAdminBackendError;
}

export function clearAdminBackendError(): void {
  lastAdminBackendError = null;
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(ADMIN_BACKEND_RECOVERED_EVENT));
}

export async function probeAdminBackendHealth(
  apiBaseUrl: string,
  fetchFn: typeof fetch = fetch,
): Promise<BackendErrorDetails | null> {
  const readyUrl = `${apiBaseUrl.replace(/\/$/, '')}/v1/ready`;
  let response: Response;
  try {
    response = await fetchFn(readyUrl, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    return normalizeNetworkError(err, readyUrl);
  }

  if (isBackendFailureStatus(response.status)) {
    if (await isOptionalRedisOnly503(response, readyUrl)) {
      return null;
    }
    return parseApiErrorPayload(response, readyUrl);
  }

  return null;
}
