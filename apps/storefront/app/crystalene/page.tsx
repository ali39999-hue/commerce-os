import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste | دکتر درمر انگلستان',
  description:
    'خمیر میکرودرم ابریشمی با کریستال‌های آلومینای میکرونی، نیاسینامید، لاکتیک اسید و روغن آرگان جهت لایه‌برداری بدون خراش‌های میکروسکوپی.',
};

export default function CrystalenePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
              <span>Ultra-Fine Resurfacing Paste</span>
              <span className="font-mono">Alumina Microcrystals</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              خمیر پولیش کریستالین{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Crystalene™
              </span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed mb-6">
              کریستالین فرآورده لایه‌بردار با درجه درماتولوژیک است که با عملکرد سایش مکانیکی ملایم کریستال‌های اکسید آلومینیوم
              بسیار ریز، عملکردی برتر از دستگاه‌های میکرودرمابریژن سنتی ارائه می‌دهد. بر خلاف اسکراب‌های زبر، لبه‌های بلورها
              گرد بوده و همراه با نیاسینامید، اسید لاکتیک، بتائین، کره شی‌باتر و روغن آرگان از هرگونه خشکی و تحریک جلوگیری می‌نماید.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products/crystalene"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl transition"
              >
                سفارش تیوب ۲۰۰ میلی‌لیتر (۱٬۷۵۰٬۰۰۰ تومان) ←
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-center justify-center">
            <img
              src="/assets/drdermer/2025/08/15crystalene-1200x1109.webp"
              alt="Crystalene Polish Paste"
              className="max-h-80 w-auto object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
