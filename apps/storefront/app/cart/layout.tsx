import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سبد خرید و ملزومات بالینی | دکتر درمر انگلستان',
  description: 'مدیریت اقلام سبد خرید، انتخاب دوز، محاسبه حجم مصرفی و ارسال زنجیره سرد ۲ تا ۸ درجه.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
