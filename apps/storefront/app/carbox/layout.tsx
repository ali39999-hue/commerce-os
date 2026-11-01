import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ایستگاه بالینی کربوکسی‌تراپی ReeMed CarboX™ Station | دکتر درمر انگلستان',
  description:
    'کامل‌ترین ایستگاه بالینی کربوکسی‌تراپی با ترکیب انحصاری دو مدالیته تزریق زیرجلدی گاز CO₂ با پیش‌گرمایش ۳۶ درجه و هندپیس ترنس‌درمال CarboxyPod اولتراسونیک. دارای سرتیفیکیت رسمی CE Medical Class IIb.',
  keywords: [
    'CarboX',
    'کربوکسی تراپی',
    'ایستگاه بالینی CarboX',
    'ReeMed CarboX',
    'دستگاه کربوکسی',
    'هندپیس CarboxyPod',
    'تزریق زیرجلدی CO2',
    'CE Medical Class IIb',
    'دکتر درمر',
  ],
  openGraph: {
    title: 'ReeMed CarboX™ Medical Station | ایستگاه بالینی کربوکسی‌تراپی دوگانه',
    description:
      'ترکیب انحصاری تزریق زیرجلدی گاز طبی ۳۶ درجه سانتی‌گراد و هندپیس ترنس‌درمال اولتراسونیک ۱۲۰ هرتز بدون سوزن.',
    url: 'https://drdermer.ir/carbox',
    siteName: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/carbox/01.webp',
        width: 1200,
        height: 900,
        alt: 'ReeMed CarboX Medical Station 360',
      },
    ],
  },
};

export default function CarboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
