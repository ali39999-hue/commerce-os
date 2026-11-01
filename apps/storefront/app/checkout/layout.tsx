import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسویه حساب و صورتحساب مودیان | دکتر درمر انگلستان',
  description: 'ثبت اطلاعات مشتری، انتخاب ناوگان حمل سرد ۲ الی ۸ درجه، صدور فاکتور رسمی مالیاتی و پرداخت امن شاپرک.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
