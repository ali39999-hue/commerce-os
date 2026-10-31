import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'دکتر درمر | سیستم جامع سلامت و مراقبت بالینی پوست',
    short_name: 'دکتر درمر',
    description:
      'فروشگاه رسمی و آکادمی تخصصی برندهای درمانی ReeSkin و ReeMed انگلستان؛ کربوکسی‌تراپی پیشرفته (CarboxyGel)، نوسازی سلولی با اثر بوهر (Bohr Effect) و پورتال ملزومات کلینیکال.',
    start_url: '/',
    display: 'standalone',
    dir: 'rtl',
    lang: 'fa',
    background_color: '#F7F6F2',
    theme_color: '#0F766E',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
