'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminBackendErrorScreen } from '../components/AdminBackendErrorScreen';
import { clearAdminBackendError } from '../lib/backend-error';

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    clearAdminBackendError();
    reset();
    router.refresh();
  };

  return <AdminBackendErrorScreen error={error} onRetry={handleRetry} />;
}
