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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

