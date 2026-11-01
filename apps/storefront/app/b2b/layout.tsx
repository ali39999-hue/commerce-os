import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پرتال B2B پزشکان و کلینیک‌ها | دکتر درمر انگلستان',
  description: 'ثبت سفارشات عمده سالنی، استعلام شماره نظام پزشکی، خرید تجهیزات و استعلام پیش‌فاکتور.',
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
