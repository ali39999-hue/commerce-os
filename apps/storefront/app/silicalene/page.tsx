import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub | دکتر درمر انگلستان',
  description:
    'اسکراب دتوکس با کره‌های سیلیکای کاملاً گرد، پودر کربن فعال دارویی و اسیدهای AHA/BHA جهت تخلیه آلاینده‌های عمقی منافذ و تنظیم ترشح چربی پوست.',
};

export default function SilicalenePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
              <span>Deep Pore Detoxification</span>
              <span className="font-mono">Ultra-Smooth Silica Spheres</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              اسکراب دتوکس سیلیکالین{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Silicalene™
              </span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed mb-6">
              اسکراب ملایم سیلیکالین با استفاده از دانه‌های سیلیکای کاملاً کروی، آلودگی‌ها و سلول‌های مرده سطح پوست را
              بدون صدمه به سد دفاعی پاکسازی می‌کند. فرمولاسیون حاوی کربن فعال، اسید گلیکولیک و سالیسیلیک، زینک PCA،
              بتائین، آلوئه‌ورا و بابونه به پوست شما احساس سبکی، طراوت، ماتی و پاکیزگی مخملی می‌بخشد.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products/silicalene"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl transition"
              >
                سفارش تیوب ۲۰۰ میلی‌لیتر (۱٬۵۵۰٬۰۰۰ تومان) ←
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-center justify-center">
            <img
              src="/assets/drdermer/2025/08/14silicalene-1200x1109.webp"
              alt="Silicalene Mild Scrub"
              className="max-h-80 w-auto object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
