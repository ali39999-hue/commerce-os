import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../components/cart';
import { SiteHeader } from '../components/header';
import { PwaRegister } from '../components/pwa-register';

export const metadata: Metadata = {
  title: 'فروشگاه دمو | Commerce OS',
  description: 'ویترین فارسی مبتنی بر کاتالوگ واقعی API و معماری کلاس جهانی.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>
          <div className="page-shell">
            <SiteHeader />
            <main>{children}</main>
            <footer className="site-footer">
              <span>سیستم‌عامل تجارت Commerce OS · نسخه ۲.۰</span>
              <span>تلفیق تجربیات itrip-platform و aroux30/site · صددرصد RTL و محاسبات دقیق</span>
            </footer>
          </div>
        </CartProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
