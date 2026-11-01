import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ژل کربوکسی‌تراپی غیرتهاجمی و اثر بوهر ReeSkin CarboxyGel™ | دکتر درمر انگلستان',
  description:
    'کربوکسی‌تراپی غیرتهاجمی و مکانیسم فیزیولوژیک اثر بوهر (Non-invasive Carboxy Therapy & The Bohr Effect). معرفی ۳ فرمولاسیون تخصصی: اسید گلیکولیک، مولتی‌اکتیو و اسید آزالائیک همراه با پروتکل‌های کلینیکی و سفارش مستقیم.',
  keywords: [
    'CarboxyGel',
    'کربوکسی ژل',
    'کربوکسی تراپی غیرتهاجمی',
    'اثر بوهر',
    'Bohr Effect',
    'دکتر درمر',
    'ReeSkin Clinical',
    'اسید گلیکولیک کربوکسی',
    'اسید آزالائیک کربوکسی',
    'مولتی اکتیو کربوکسی',
  ],
  openGraph: {
    title: 'ReeSkin CarboxyGel™ | کربوکسی‌تراپی غیرتهاجمی و اثر بوهر',
    description:
      'معرفی سامانه پیشرفته کربوکسی‌تراپی ترنس‌درمال با تحریک اثر بوهر، بهبود ۳ برابری اکسیژن‌رسانی بافت و ۳ فرمولاسیون درمانی تخصصی.',
    images: [
      {
        url: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
        width: 1062,
        height: 1536,
        alt: 'ReeSkin CarboxyGel Professional Therapy',
      },
    ],
  },
};

export default function CarboxygelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
