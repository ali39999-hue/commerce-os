'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ADMIN_BACKEND_ERROR_EVENT,
  ADMIN_BACKEND_RECOVERED_EVENT,
  clearAdminBackendError,
  getLastAdminBackendError,
  isBackendFailureStatus,
  isIntentionalAbort,
  isOptionalRedisOnly503,
  normalizeNetworkError,
  parseApiErrorPayload,
  probeAdminBackendHealth,
  reportAdminBackendError,
  type BackendErrorDetails,
} from '../lib/backend-error';
import { API_BASE } from './types';
import { AdminBackendErrorScreen } from './AdminBackendErrorScreen';

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
    const configured = new URL(API_BASE, window.location.origin);
    const matchesHost =
      resolved.origin === configured.origin || resolved.origin === 'http://localhost:4000';
    return matchesHost && resolved.pathname.startsWith('/v1/');
  } catch {
    return false;
  }
}

export function AdminBackendGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const nativeFetchRef = useRef<typeof fetch | null>(null);
  const [backendError, setBackendError] = useState<BackendErrorDetails | null>(() =>
    getLastAdminBackendError(),
  );
  const [recoveryEpoch, setRecoveryEpoch] = useState(0);

  const probeWithNativeFetch = useCallback(() => {
    const fn = nativeFetchRef.current ?? window.fetch.bind(window);
    return probeAdminBackendHealth(API_BASE, fn);
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

    window.addEventListener(ADMIN_BACKEND_ERROR_EVENT, onBackendError);
    window.addEventListener(ADMIN_BACKEND_RECOVERED_EVENT, onRecovered);

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
          reportAdminBackendError(parsed);
        }
        return response;
      } catch (err) {
        if (!isIntentionalAbort(err)) {
          reportAdminBackendError(normalizeNetworkError(err, url));
        }
        throw err;
      }
    };

    window.fetch = guardedFetch;

    let cancelled = false;
    const initialProbe = async () => {
      const issue = await probeAdminBackendHealth(API_BASE, originalFetch);
      if (!cancelled && issue) {
        setBackendError(issue);
      }
    };
    void initialProbe();

    return () => {
      cancelled = true;
      window.fetch = originalFetch;
      nativeFetchRef.current = null;
      window.removeEventListener(ADMIN_BACKEND_ERROR_EVENT, onBackendError);
      window.removeEventListener(ADMIN_BACKEND_RECOVERED_EVENT, onRecovered);
    };
  }, []);

  const handleRetry = useCallback(() => {
    clearAdminBackendError();
    setBackendError(null);
    setRecoveryEpoch((prev) => prev + 1);
    router.refresh();
  }, [router]);

  if (backendError) {
    return (
      <AdminBackendErrorScreen
        details={backendError}
        onRetry={handleRetry}
        probeFn={probeWithNativeFetch}
      />
    );
  }

  return <React.Fragment key={recoveryEpoch}>{children}</React.Fragment>;
}
