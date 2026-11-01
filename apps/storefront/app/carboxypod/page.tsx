import { Metadata } from 'next';
import { CarboxypodInteractiveLanding } from './carboxypod-interactive';

export const metadata: Metadata = {
  title: 'پادهای فعال‌ساز کربوکسی‌پاد ReeSkin CarboxyPod™ | دکتر درمر انگلستان',
  description:
    'کپسول‌های فعال‌ساز گاز CO₂ و اسکراب شیمیایی-فیزیکی در ۳ نوع Vitamin، Carbon و Hydra جهت استفاده دستی یا اتصال به هندپیس CarboX.',
  keywords: [
    'CarboxyPod',
    'کربوکسی پاد',
    'اسکراب فیبریک',
    'پاد ویتامینه',
    'پاد کربن فعال',
    'پاد هیدرا',
    'دکتر درمر',
    'ReeSkin CarboxyPod',
    'Bohr Effect',
    'CarboX Handpiece',
  ],
  openGraph: {
    title: 'ReeSkin CarboxyPod™ | پادهای فعال‌ساز کربوکسی‌پاد و اسکراب فیبریک',
    description:
      'کپسول‌های درمانی فشرده با ساختار متخلخل فیبریک، نسل نوین لایه‌برداری دوگانه شیمیایی و مکانیکی با آزادسازی گاز CO₂.',
    url: 'https://drdermer.ir/carboxypod',
    siteName: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
        width: 1200,
        height: 630,
        alt: 'ReeSkin CarboxyPod Professional Therapy',
      },
    ],
  },
};

export default function CarboxypodPage() {
  return <CarboxypodInteractiveLanding />;
}

