'use client';

import './digital-badge.css';

/**
 * نشان کوچک «دیجیتال» برای محصولات با kind === 'DIGITAL'.
 * کامپوننت مستقل؛ استایل‌ها در digital-badge.css کنار همین فایل تعریف شده‌اند
 * تا خارج از بخش حساب هم قابل استفاده باشد.
 */
export function DigitalBadge() {
  return (
    <span className="digital-badge" title="این محصول به‌صورت دیجیتال تحویل داده می‌شود">
      ⬇ دیجیتال
    </span>
  );
}

export default DigitalBadge;
