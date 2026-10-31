import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'فروشگاه بازارک | Commerce OS',
    short_name: 'بازارک',
    description:
      'خرید مطمئن کالاهای باکیفیت با ضمانت اصالت، ارسال سریع سراسری و پرداخت امن شاپرک؛ ویترین رسمی Commerce OS.',
    start_url: '/',
    display: 'standalone',
    dir: 'rtl',
    lang: 'fa',
    background_color: '#FBF4EE',
    theme_color: '#084F4A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
