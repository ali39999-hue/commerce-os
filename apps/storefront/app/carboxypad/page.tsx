import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad | دکتر درمر انگلستان',
  description:
    'ماسک‌ها و شیت‌های پیش‌برش‌خورده ارگونومیک برای رهایش متراکم گاز دی‌اکسید کربن بر سطح ژل کربوکسی، پوشش کامل صورت و خط فک و گردن.',
};

export default function CarboxypadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
              <span>گام دوم کربوکسی‌تراپی</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono">Anatomical Pre-Cut Mask</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              پدهای فعال‌ساز آلکالاین صورت و گردن{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                CarboxyPad™
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              پدهای اختصاصی کاربوکسی‌پد (CarboxyPad) با الیاف فشرده متخلخل آغشته به فاز اسید میوه خشک طراحی شده‌اند.
              این شیت‌های ماسک با برش آناتومیک اختصاصی، کل صورت، پیشانی، گونه‌ها، بینی و به طور ویژه ناحیه زیر چانه و
              گردن را به طور کامل پوشش داده و مانع از هدررفت و تبخیر سطحی گاز CO₂ می‌شوند.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products/carboxypad"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
              >
                سفارش پکیج ۲۰ عددی پد صورت و گردن ←
              </Link>
              <Link
                href="/carboxygel"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition"
              >
                مشاهده ژل‌های مکمل CarboxyGel
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-center justify-center">
            <img
              src="/assets/drdermer/2025/07/carboxypad-1024x198.png"
              alt="CarboxyPad Mask"
              className="max-h-60 w-auto object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Anatomical Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="text-emerald-400 font-mono text-2xl font-bold mb-3">01</div>
            <h3 className="text-base font-bold text-white mb-2">برش ارگونومیک صورت و گردن</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              طراحی منطبق با زوایای آناتومیک صورت جهت تماس پایدار با ژل، بدون چروک‌خوردن یا فاصله هوایی.
            </p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="text-emerald-400 font-mono text-2xl font-bold mb-3">02</div>
            <h3 className="text-base font-bold text-white mb-2">توزیع همگن کریستال‌های اسید</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              آغشته‌سازی همگن فیبر نبافته با اسید سیتریک گرید فارماکوپه جهت ایجاد جوشش یکدست در تمام بافت پوست.
            </p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="text-emerald-400 font-mono text-2xl font-bold mb-3">03</div>
            <h3 className="text-base font-bold text-white mb-2">بهبود افتادگی و غبغب</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              پد مجزای گردن با تحریک موضعی خونرسانی و لیفت بافت شل‌شده زیر چانه و خط فک.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
