import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing Gel | دکتر درمر انگلستان',
  description:
    'ژل التیام‌بخش فوری و خنک‌کننده پوست پس از درمان‌های لیزر، میکرونیدلینگ، کربوکسی و پیلینگ. حاوی نیاسینامید، پانتنول، هیالورونیک اسید و ۷ عصاره گیاهی آرام‌بخش.',
};

export default function HealenePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
              <span>Post-Procedure Dermal Relief</span>
              <span className="font-mono">Panthenol &amp; Cica Matrix</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              ژل التیام‌بخش و تسکین‌دهنده{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Healene™
              </span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed mb-6">
              ژل خنک‌کننده هیلین اختصاصاً برای کاهش فوری سوزش، رفع قرمزی و بازسازی سریع سد لیپیدی پوست آسیب‌دیده
              پس از مداخلات بالینی طراحی شده است. بافت آکوا و بسیار سبک آن بدون ایجاد چربی بلافاصله جذب پوست شده
              و با بهره‌گیری از نیاسینامید، پروویتامین B5، سدیم PCA و عصاره‌های میموزا، کالاندولا، سنتلا و بابونه
              احساس خنکی و راحتی عمیقی را به ارمغان می‌آورد.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products/healene"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl transition"
              >
                سفارش بطری پمپی ۲۵۰ میلی‌لیتر (۱٬۶۰۰٬۰۰۰ تومان) ←
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-center justify-center">
            <img
              src="/assets/drdermer/2025/08/16healene-1200x1109.webp"
              alt="Healene Soothing Gel"
              className="max-h-80 w-auto object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
