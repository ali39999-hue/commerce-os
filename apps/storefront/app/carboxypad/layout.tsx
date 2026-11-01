import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad™ | دکتر درمر انگلستان',
  description:
    'شیت‌ها و ماسک‌های پیش‌برش‌خورده آناتومیک صورت و گردن با لایه اسید سیتریک میکروکریستالی خشک و ماتریکس سلولزی نبافته، جهت به دام انداختن گاز CO2 و نفوذ ترنس‌درمال به لایه‌های زنده پوست.',
  keywords: [
    'CarboxyPad',
    'پد کربوکسی',
    'پد فعال ساز آلکالاین',
    'کربوکسی تراپی بدون سوزن',
    'ماسک گردن و غبغب',
    'ReeSkin CarboxyPad',
    'دکتر درمر',
    'Bohr Effect',
  ],
  openGraph: {
    title: 'Step 2: Alkaline Activator Pads for Face & Neck | ReeSkin CarboxyPad™',
    description:
      'ماسک‌های پیش‌برش‌خورده ارگونومیک صورت و ناحیه گردن جهت رهایش پرفشار گاز دی‌اکسید کربن بر روی لایه ژل کربوکسی و نفوذ عمقی ترنس‌درمال بدون سوزن.',
    url: 'https://drdermer.ir/carboxypad',
    siteName: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/07/carboxypad-1024x198.png',
        width: 1024,
        height: 198,
        alt: 'ReeSkin CarboxyPad Alkaline Activator Pads',
      },
    ],
  },
};

export default function CarboxypadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
