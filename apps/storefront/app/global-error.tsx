'use client';

import React from 'react';
import { BackendErrorScreen } from '../components/backend-error-screen';
import { clearReportedBackendError } from '../lib/backend-error';

export default function StorefrontGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleRetry = () => {
    clearReportedBackendError();
    reset();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, background: '#f8fafc' }}>
        <BackendErrorScreen error={error} onRetry={handleRetry} />
      </body>
    </html>
  );
}
