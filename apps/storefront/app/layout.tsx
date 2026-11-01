import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '../components/cart';
import { CartDrawer } from '../components/cart-drawer';
import { LocalizationProvider } from '../lib/localization-context';
import { SiteHeader } from '../components/header';
import { SiteFooter } from '../components/footer';
import { PwaRegister } from '../components/pwa-register';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');
const isProduction = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_IS_STAGING;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F6F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'دکتر درمر | سیستم جامع سلامت و مراقبت تخصصی پوست (ReeSkin & ReeMed)',
    template: '%s | دکتر درمر',
  },
  description:
    'فروشگاه رسمی و آکادمی تخصصی برندهای درمانی ReeSkin و ReeMed انگلستان؛ کربوکسی‌تراپی پیشرفته (CarboxyGel)، نوسازی سلولی با اثر بوهر (Bohr Effect)، تجهیزات پزشکی و پروتکل‌های حرفه‌ای کلینیک.',
  keywords: [
    'کربوکسی تراپی',
    'CarboxyGel',
    'CarboxyPod',
    'ReeSkin',
    'ReeMed',
    'مراقبت بالینی پوست',
    'پپتید و ضد پیری',
    'ترمیم سد دفاعی',
    'پروتکل کلینیکال پوست',
    'دکتر درمر',
    'Bohr Effect',
  ],
  authors: [{ name: 'Dr Dermer Clinical Research Laboratories', url: 'https://www.drdermer.co.uk' }],
  creator: 'Dr Dermer UK Clinical Laboratories',
  publisher: 'Dr Dermer International',
  applicationName: 'Dr Dermer Storefront',
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },
  robots: isProduction
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
      },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE_URL,
    siteName: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
    title: 'دکتر درمر | درمان هدفمند سلولی پوست با فناوری Carboxy CO2',
    description:
      'محصولات برتر بالینی، پروتکل‌های ترمیم سد دفاعی و پورتال اختصاصی تأمین ملزومات کلینیک‌های پوست و زیبایی.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'دکتر درمر - فناوری کربوکسی ژل و مراقبت بالینی پوست',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دکتر درمر | پیشگام درمان‌های ترابافتی و کربوکسی‌تراپی غیرتهاجمی',
    description: 'تلفیق دانش بیوشیمی سلولی و تجربه کلینیکی انگلستان در قالب خانواده‌های ReeSkin و ReeMed.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'fa-IR': `${SITE_URL}/`,
      'en-GB': 'https://www.drdermer.co.uk/',
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
      <body>
        <LocalizationProvider>
          <CartProvider>
            <div className="page-shell-wrapper">
              <SiteHeader />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter />
            </div>
            <CartDrawer />
          </CartProvider>
        </LocalizationProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
