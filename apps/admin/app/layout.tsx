import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'پنل مدیریت یکپارچه دکتر درمر | Dr. Dermer UK Operations ERP',
  description: 'مدیریت سفارشات، پایش زنجیره سرد، کاتالوگ PIM/DAM، کوپن‌ها و دفاتر دوبل مالی.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

