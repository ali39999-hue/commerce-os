'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, ServerCrash, WifiOff } from 'lucide-react';
import {
  extractAdminErrorDetails,
  probeAdminBackendHealth,
  type BackendErrorDetails,
} from '../lib/backend-error';
import { API_BASE } from './types';

interface AdminBackendErrorScreenProps {
  error?: unknown;
  details?: BackendErrorDetails | null;
  onRetry?: () => void | Promise<void>;
  probeFn?: () => Promise<BackendErrorDetails | null>;
}

const FA_DIGITS = new Intl.NumberFormat('fa-IR', { useGrouping: false });

export function AdminBackendErrorScreen({
  error,
  details: propDetails,
  onRetry,
  probeFn,
}: AdminBackendErrorScreenProps) {
  const initialDetails = propDetails ?? extractAdminErrorDetails(error);
  const [resolvedDetails, setResolvedDetails] = useState<BackendErrorDetails | null>(
    initialDetails,
  );
  const [checking, setChecking] = useState(false);
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (propDetails) {
      setResolvedDetails(propDetails);
      return;
    }
    const extracted = extractAdminErrorDetails(error);
    if (extracted) {
      setResolvedDetails(extracted);
      return;
    }

    let cancelled = false;
    const detect = async () => {
      const probeResult = await (probeFn ? probeFn() : probeAdminBackendHealth(API_BASE));
      if (cancelled) return;
      if (probeResult) {
        setResolvedDetails(probeResult);
      } else {
        setResolvedDetails({
          kind: 'SERVER_ERROR',
          statusCode: 500,
          endpoint: 'admin-ui-render',
          detail:
            error instanceof Error && error.message
              ? error.message
              : 'خطای غیرمنتظره در بارگذاری پنل مدیریت رخ داد.',
          timestamp: new Date().toISOString(),
        });
      }
    };
    void detect();

    return () => {
      cancelled = true;
    };
  }, [propDetails, error, probeFn]);

  const isOffline =
    !resolvedDetails || resolvedDetails.kind === 'OFFLINE' || resolvedDetails.statusCode === 0;

  const statusLabel = isOffline
    ? 'عدم دسترسی به هسته ERP (Offline / ۵۰۳)'
    : `خطای سرور ERP (HTTP ${FA_DIGITS.format(resolvedDetails.statusCode)})`;

  const handleRetry = async () => {
    setChecking(true);
    setRetryFeedback(null);
    try {
      const stillBroken = await (probeFn ? probeFn() : probeAdminBackendHealth(API_BASE));
      if (stillBroken) {
        setResolvedDetails(stillBroken);
        setRetryFeedback(
          stillBroken.kind === 'OFFLINE'
            ? 'سرور بک‌اند (پورت 4000) هنوز روشن نشده یا در دسترس نیست.'
            : `سرور همچنان وضعیت HTTP ${FA_DIGITS.format(stillBroken.statusCode)} برمی‌گرداند.`,
        );
        return;
      }
      if (onRetry) {
        await onRetry();
      } else if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <main
      dir="rtl"
      lang="fa"
      role="alert"
      aria-live="assertive"
      data-testid="admin-backend-error-screen"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'var(--paper, #f8fafc)',
        color: 'var(--ink, #0f172a)',
        fontFamily:
          'Vazirmatn, IRANSansX, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        className="admin-backend-error-card"
        style={{
          width: '100%',
          maxWidth: '660px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid #cbd5e1',
          borderRadius: '18px',
          padding: '32px 28px',
          boxShadow: '0 20px 45px -24px rgba(15, 23, 42, 0.2)',
        }}
      >
        <style>{`
          .admin-backend-error-card button:focus-visible,
          .admin-backend-error-card summary:focus-visible {
            outline: 3px solid #0369a1;
            outline-offset: 2px;
          }
          .admin-backend-error-card button:hover:not(:disabled) {
            background: #1e3a1b !important;
          }
        `}</style>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.84rem',
              fontWeight: 700,
            }}
          >
            {isOffline ? <WifiOff size={16} aria-hidden="true" /> : <ServerCrash size={16} aria-hidden="true" />}
            <span>{statusLabel}</span>
          </span>

          <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
            Dr. Dermer Operations ERP
          </span>
        </div>

        <h1
          style={{
            margin: '0 0 12px',
            fontSize: '1.45rem',
            lineHeight: 1.45,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          {isOffline
            ? 'اتصال پنل مدیریت به سرور بک‌اند قطع است'
            : 'سرور مرکزی ERP با خطای داخلی مواجه شد'}
        </h1>

        <p
          style={{
            margin: '0 0 20px',
            fontSize: '0.96rem',
            lineHeight: 1.85,
            color: '#334155',
          }}
        >
          {isOffline
            ? 'عملیات مالی، انبارداری و ثبت سفارش نیازمند اتصال زنده به سرویس API روی پایگاه‌داده هستند. برای حفظ یکپارچگی داده‌های ERP، دسترسی به فرم‌ها تا زمان اتصال مجدد متوقف شد.'
            : 'درخواست ارسالی به هسته ERP با خطای سرور مواجه شد. جزئیات و شناسه رهگیری برای بررسی فنی در زیر ثبت شده است.'}
        </p>

        {retryFeedback && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              color: '#92400e',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <AlertTriangle size={16} aria-hidden="true" />
            <span>{retryFeedback}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
          <button
            type="button"
            onClick={handleRetry}
            disabled={checking}
            aria-busy={checking}
            data-testid="admin-backend-error-retry"
            style={{
              minHeight: '46px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '10px',
              border: '1px solid #142b12',
              background: '#274b24',
              color: '#ffffff',
              fontSize: '0.94rem',
              fontWeight: 700,
              cursor: checking ? 'wait' : 'pointer',
              opacity: checking ? 0.78 : 1,
            }}
          >
            <RefreshCw size={17} aria-hidden="true" />
            <span>{checking ? 'در حال بررسی سرویس ERP...' : 'بررسی مجدد و اتصال به سرور'}</span>
          </button>
        </div>

        <details
          open
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            background: '#f8fafc',
            padding: '12px 16px',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            لاگ تشخیصی سرویس بک‌اند (API Diagnostics)
          </summary>

          <dl
            style={{
              margin: '12px 0 0',
              display: 'grid',
              gridTemplateColumns: 'minmax(125px, auto) 1fr',
              gap: '8px 16px',
              fontSize: '0.84rem',
              lineHeight: 1.7,
            }}
          >
            <dt style={{ color: '#475569', fontWeight: 600 }}>وضعیت:</dt>
            <dd style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
              {isOffline ? 'OFFLINE / عدم پاسخ از بک‌اند' : 'SERVER_ERROR / خطای داخلی سرور'}
            </dd>

            <dt style={{ color: '#475569', fontWeight: 600 }}>کد وضعیت HTTP:</dt>
            <dd
              style={{
                margin: 0,
                color: '#0f172a',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                direction: 'ltr',
                textAlign: 'right',
              }}
            >
              {resolvedDetails?.statusCode ? String(resolvedDetails.statusCode) : '0 (No Response)'}
            </dd>

            <dt style={{ color: '#475569', fontWeight: 600 }}>مسیر API:</dt>
            <dd
              style={{
                margin: 0,
                color: '#0f172a',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                direction: 'ltr',
                textAlign: 'right',
                wordBreak: 'break-all',
              }}
            >
              {resolvedDetails?.endpoint ?? '/v1/ready'}
            </dd>

            {resolvedDetails?.correlationId && (
              <>
                <dt style={{ color: '#475569', fontWeight: 600 }}>شناسه رهگیری (Correlation ID):</dt>
                <dd
                  data-testid="admin-backend-correlation-id"
                  style={{
                    margin: 0,
                    color: '#991b1b',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontWeight: 700,
                    direction: 'ltr',
                    textAlign: 'right',
                    wordBreak: 'break-all',
                  }}
                >
                  {resolvedDetails.correlationId}
                </dd>
              </>
            )}

            <dt style={{ color: '#475569', fontWeight: 600 }}>پیام خطا:</dt>
            <dd style={{ margin: 0, color: '#334155', wordBreak: 'break-word' }}>
              {resolvedDetails?.detail ?? 'سرویس API روی پورت 4000 پاسخ نداد.'}
            </dd>
          </dl>
        </details>
      </div>
    </main>
  );
}
