'use client';

import React from 'react';
import { AdminBackendErrorScreen } from '../components/AdminBackendErrorScreen';
import { clearAdminBackendError } from '../lib/backend-error';

export default function AdminGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleRetry = () => {
    clearAdminBackendError();
    reset();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, background: '#f8fafc' }}>
        <AdminBackendErrorScreen error={error} onRetry={handleRetry} />
      </body>
    </html>
  );
}
