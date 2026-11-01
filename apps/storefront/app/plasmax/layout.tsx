import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سامانه مولتی‌مدالیته پلاسمای سرد و جراحی ReeMed PlasmaX™ | دکتر درمر انگلستان',
  description:
    'تنها سیستم پزشکی دارای گواهینامه CE Class IIb با ترکیب ۳ مدالیته مستقل: تخلیه مداوم پلاسما جهت بلفاروپلاستی غیرجراحی، جت پلاسمای سرد آرگون و هلیوم جهت ترمیم و استریل، و پلاسمای سد دی‌الکتریک (DBD) جهت مزوپلاسمای ترنس‌درمال.',
  keywords: [
    'PlasmaX',
    'پلاسماکس',
    'پلاسمای سرد',
    'بلفاروپلاستی بدون جراحی',
    'پلاسمای آرگون و هلیوم',
    'مزوپلاسما DBD',
    'ReeMed PlasmaX',
    'CE Medical Class IIb',
    'دکتر درمر',
  ],
  openGraph: {
    title: 'ReeMed PlasmaX™ Multi-Modality Medical Plasma | سامانه پلاسمای بالینی',
    description:
      'ترکیب بی‌سابقه سابلیمیشن میکرونی پلک، جت پلاسمای سرد زیر ۳۸ درجه سانتی‌گراد و الکتروپوریشن پوستی DBD.',
    url: 'https://drdermer.ir/plasmax',
    siteName: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/plasmax/001.webp',
        width: 1200,
        height: 960,
        alt: 'ReeMed PlasmaX Medical System 360',
      },
    ],
  },
};

export default function PlasmaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
