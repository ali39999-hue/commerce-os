'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Home, RefreshCw, ServerCrash, WifiOff } from 'lucide-react';
import {
  extractBackendErrorDetails,
  probeBackendHealth,
  type BackendErrorDetails,
} from '../lib/backend-error';
import { apiBase } from '../lib/catalog';

interface BackendErrorScreenProps {
  error?: unknown;
  details?: BackendErrorDetails | null;
  onRetry?: () => void | Promise<void>;
  probeFn?: () => Promise<BackendErrorDetails | null>;
}

const FA_DIGITS = new Intl.NumberFormat('fa-IR', { useGrouping: false });

function formatStatusLabel(details: BackendErrorDetails | null): string {
  if (!details) return 'خطای سرویس مرکزی';
  if (details.kind === 'OFFLINE' || details.statusCode === 0) {
    return 'عدم دسترسی به سرور (Offline / ۵۰۳)';
  }
  return `خطای سرور مرکزی (HTTP ${FA_DIGITS.format(details.statusCode)})`;
}

export function BackendErrorScreen({
  error,
  details: propDetails,
  onRetry,
  probeFn,
}: BackendErrorScreenProps) {
  const initialDetails = propDetails ?? extractBackendErrorDetails(error);
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
    const extracted = extractBackendErrorDetails(error);
    if (extracted) {
      setResolvedDetails(extracted);
      return;
    }

    let cancelled = false;
    const detect = async () => {
      const probeResult = await (probeFn ? probeFn() : probeBackendHealth(apiBase));
      if (cancelled) return;
      if (probeResult) {
        setResolvedDetails(probeResult);
      } else {
        setResolvedDetails({
          kind: 'SERVER_ERROR',
          statusCode: 500,
          endpoint: 'ssr-render',
          detail:
            error instanceof Error && error.message
              ? error.message
              : 'خطای غیرمنتظره در دریافت اطلاعات از سرور رخ داد.',
          timestamp: new Date().toISOString(),
        });
      }
    };
    void detect();

    return () => {
      cancelled = true;
    };
  }, [propDetails, error, probeFn]);

  const isOffline = !resolvedDetails || resolvedDetails.kind === 'OFFLINE' || resolvedDetails.statusCode === 0;

  const handleRetry = async () => {
    setChecking(true);
    setRetryFeedback(null);
    try {
      const stillBroken = await (probeFn ? probeFn() : probeBackendHealth(apiBase));
      if (stillBroken) {
        setResolvedDetails(stillBroken);
        setRetryFeedback(
          stillBroken.kind === 'OFFLINE'
            ? 'سرور بک‌اند هنوز روشن نیست یا در دسترس نمی‌باشد.'
            : `سرور همچنان خطای ${FA_DIGITS.format(stillBroken.statusCode)} برمی‌گرداند.`,
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
    <section
      dir="rtl"
      lang="fa"
      role="alert"
      aria-live="assertive"
      data-testid="backend-error-screen"
      style={{
        minHeight: '72vh',
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
        className="backend-error-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          padding: '32px 28px',
          boxShadow: '0 18px 40px -20px rgba(15, 23, 42, 0.16)',
        }}
      >
        <style>{`
          .backend-error-card button:focus-visible,
          .backend-error-card a:focus-visible,
          .backend-error-card summary:focus-visible {
            outline: 3px solid #0369a1;
            outline-offset: 2px;
          }
          .backend-error-card button:hover:not(:disabled) {
            background: #274b24 !important;
          }
          .backend-error-card a:hover {
            background: #e2e8f0 !important;
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
            <span>{formatStatusLabel(resolvedDetails)}</span>
          </span>

          <span
            style={{
              fontSize: '0.78rem',
              color: '#475569',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Dr Dermer Clinical API Guard
          </span>
        </div>

        <h1
          style={{
            margin: '0 0 12px',
            fontSize: '1.5rem',
            lineHeight: 1.45,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          {isOffline
            ? 'ارتباط با سرور مرکزی فروشگاه برقرار نشد'
            : 'اختلال یا خطای داخلی در پاسخ‌گویی سرور مرکزی'}
        </h1>

        <p
          style={{
            margin: '0 0 20px',
            fontSize: '0.98rem',
            lineHeight: 1.85,
            color: '#334155',
          }}
        >
          {isOffline
            ? 'سرویس بک‌اند (API) در حال حاضر خاموش است یا به درخواست‌ها پاسخ نمی‌دهد. برای جلوگیری از نمایش اطلاعات ناقص یا نادرست قیمت و موجودی، بارگذاری صفحه متوقف شده است.'
            : 'سرور بک‌اند هنگام پردازش این درخواست با خطای غیرمنتظره مواجه شد. تیم فنی می‌تواند با شناسه رهگیری زیر ریشه خطا را بررسی کند.'}
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

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '22px',
          }}
        >
          <button
            type="button"
            onClick={handleRetry}
            disabled={checking}
            aria-busy={checking}
            data-testid="backend-error-retry"
            style={{
              flex: '1 1 200px',
              minHeight: '46px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              border: '1px solid #142b12',
              background: '#1e3a1b',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: checking ? 'wait' : 'pointer',
              opacity: checking ? 0.78 : 1,
            }}
          >
            <RefreshCw size={17} aria-hidden="true" />
            <span>{checking ? 'در حال بررسی اتصال...' : 'تلاش مجدد برای اتصال'}</span>
          </button>

          <a
            href="/"
            style={{
              flex: '0 1 auto',
              minHeight: '46px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #94a3b8',
              background: '#f8fafc',
              color: '#0f172a',
              fontSize: '0.92rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Home size={16} aria-hidden="true" />
            <span>بازگشت به صفحه اصلی</span>
          </a>
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
            جزئیات فنی و وضعیت تشخیص خطا
          </summary>

          <dl
            style={{
              margin: '12px 0 0',
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, auto) 1fr',
              gap: '8px 16px',
              fontSize: '0.84rem',
              lineHeight: 1.7,
            }}
          >
            <dt style={{ color: '#475569', fontWeight: 600 }}>نوع اختلال:</dt>
            <dd style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
              {isOffline ? 'OFFLINE / عدم پاسخ‌گویی سرور' : 'SERVER_ERROR / خطای داخلی سرور'}
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

            <dt style={{ color: '#475569', fontWeight: 600 }}>مسیر درخواستی:</dt>
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
                  data-testid="backend-correlation-id"
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

            <dt style={{ color: '#475569', fontWeight: 600 }}>پیام تشخیص:</dt>
            <dd style={{ margin: 0, color: '#334155', wordBreak: 'break-word' }}>
              {resolvedDetails?.detail ?? 'سرویس API روی پورت 4000 پاسخ نداد.'}
            </dd>
          </dl>
        </details>
      </div>
    </section>
  );
}
