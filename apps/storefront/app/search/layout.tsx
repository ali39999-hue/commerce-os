import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'جستجو و فیلتر کاتالوگ بالینی | دکتر درمر انگلستان',
  description: 'جستجوی هوشمند دوزبانه محصولات، فیلتر بر اساس برندهای ReeSkin و ReeMed، رده درمانی و نگرانی پوستی.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
