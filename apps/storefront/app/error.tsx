'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackendErrorScreen } from '../components/backend-error-screen';
import { clearReportedBackendError } from '../lib/backend-error';

export default function StorefrontErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    clearReportedBackendError();
    reset();
    router.refresh();
  };

  return <BackendErrorScreen error={error} onRetry={handleRetry} />;
}
