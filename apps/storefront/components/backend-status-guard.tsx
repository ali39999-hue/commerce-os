'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BACKEND_ERROR_EVENT,
  BACKEND_RECOVERED_EVENT,
  extractBackendErrorDetails,
  getLastReportedBackendError,
  clearReportedBackendError,
  isBackendFailureStatus,
  isBackendServiceError,
  isIntentionalAbort,
  isOptionalRedisOnly503,
  normalizeNetworkError,
  parseApiErrorPayload,
  probeBackendHealth,
  reportBackendError,
  type BackendErrorDetails,
} from '../lib/backend-error';
import { apiBase } from '../lib/catalog';
import { BackendErrorScreen } from './backend-error-screen';

function resolveRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
  return '';
}

function isMonitoredApiRequest(rawUrl: string): boolean {
  if (!rawUrl) return false;
  try {
    const resolved = new URL(rawUrl, window.location.origin);
    const configured = new URL(apiBase, window.location.origin);
    const matchesHost =
      resolved.origin === configured.origin || resolved.origin === 'http://localhost:4000';
    return matchesHost && resolved.pathname.startsWith('/v1/');
  } catch {
    return false;
  }
}

export function BackendStatusGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const nativeFetchRef = useRef<typeof fetch | null>(null);
  const [backendError, setBackendError] = useState<BackendErrorDetails | null>(() =>
    getLastReportedBackendError(),
  );
  const [recoveryEpoch, setRecoveryEpoch] = useState(0);

  const probeWithNativeFetch = useCallback(() => {
    const fn = nativeFetchRef.current ?? window.fetch.bind(window);
    return probeBackendHealth(apiBase, fn);
  }, []);

  useEffect(() => {
    const onBackendError = (event: Event) => {
      const custom = event as CustomEvent<BackendErrorDetails>;
      if (custom.detail) {
        setBackendError(custom.detail);
      }
    };

    const onRecovered = () => {
      setBackendError(null);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const details = extractBackendErrorDetails(event.reason);
      if (details) {
        event.preventDefault();
        reportBackendError(details);
      } else if (isBackendServiceError(event.reason)) {
        event.preventDefault();
      }
    };

    window.addEventListener(BACKEND_ERROR_EVENT, onBackendError);
    window.addEventListener(BACKEND_RECOVERED_EVENT, onRecovered);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    const originalFetch = window.fetch.bind(window);
    nativeFetchRef.current = originalFetch;

    const guardedFetch: typeof fetch = async (input, init) => {
      const url = resolveRequestUrl(input);
      if (!isMonitoredApiRequest(url)) {
        return originalFetch(input, init);
      }

      try {
        const response = await originalFetch(input, init);
        if (
          isBackendFailureStatus(response.status) &&
          !(await isOptionalRedisOnly503(response, url))
        ) {
          const parsed = await parseApiErrorPayload(response, url);
          reportBackendError(parsed);
        }
        return response;
      } catch (err) {
        if (!isIntentionalAbort(err)) {
          reportBackendError(normalizeNetworkError(err, url));
        }
        throw err;
      }
    };

    window.fetch = guardedFetch;

    return () => {
      window.fetch = originalFetch;
      nativeFetchRef.current = null;
      window.removeEventListener(BACKEND_ERROR_EVENT, onBackendError);
      window.removeEventListener(BACKEND_RECOVERED_EVENT, onRecovered);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const runProbe = async () => {
      const issue = await probeWithNativeFetch();
      if (!cancelled && issue) {
        setBackendError(issue);
      }
    };
    void runProbe();
    return () => {
      cancelled = true;
    };
  }, [pathname, probeWithNativeFetch]);

  const handleRetry = useCallback(() => {
    clearReportedBackendError();
    setBackendError(null);
    setRecoveryEpoch((prev) => prev + 1);
    router.refresh();
  }, [router]);

  if (backendError) {
    return (
      <BackendErrorScreen
        details={backendError}
        onRetry={handleRetry}
        probeFn={probeWithNativeFetch}
      />
    );
  }

  return <React.Fragment key={recoveryEpoch}>{children}</React.Fragment>;
}
