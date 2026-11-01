import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'لاین محصولات درموسوتیکال ReeSkin™ Clinical | دکتر درمر انگلستان',
  description:
    'محصولات درموسوتیکال تخصصی با تکنولوژی غیرتهاجمی اثر بوهر: CarboxyGel, CarboxyPod, CarboxyPad, Healene, Crystalene, Silicalene.',
};

export default function ReeSkinBrandPage() {
  const reeskinProducts = [
    {
      slug: 'carboxygel',
      title: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel',
      desc: 'سیستم کربوکسی‌تراپی غیرتهاجمی در ۳ فرمولاسیون گلیکولیک اسید، آزالائیک اسید و مولتی‌اکتیو.',
      badge: 'BOHR EFFECT',
      price: 'از ۱٬۹۵۰٬۰۰۰ تومان',
      img: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
    },
    {
      slug: 'carboxypod',
      title: 'پادهای فعال‌ساز کربوکسی‌پاد CarboxyPod',
      desc: 'کپسول‌های فعال‌ساز گاز CO₂ و اسکراب شیمیایی-فیزیکی در انواع Carbon، Vitamin و Hydra.',
      badge: 'ACTIVE PODS',
      price: 'از ۱٬۸۰۰٬۰۰۰ تومان',
      img: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
    },
    {
      slug: 'carboxypad',
      title: 'پدهای فعال‌ساز آلکالاین CarboxyPad',
      desc: 'ماسک‌های پیش‌برش‌خورده ارگونومیک صورت و گردن برای رهایش حداکثری گاز دی‌اکسید کربن.',
      badge: 'ACTIVATOR PADS',
      price: '۱٬۴۰۰٬۰۰۰ تومان',
      img: '/assets/drdermer/2025/07/carboxypad-1024x198.png',
    },
    {
      slug: 'crystalene',
      title: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene',
      desc: 'میکرودرم ابریشمی با کریستال‌های آلومینای فوق‌ریز، نیاسینامید، لاکتیک اسید و روغن آرگان.',
      badge: 'MICRO-RESURFACING',
      price: '۱٬۷۵۰٬۰۰۰ تومان',
      img: '/assets/drdermer/2025/08/15crystalene-1200x1109.webp',
    },
    {
      slug: 'healene',
      title: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene',
      desc: 'آبرسان سبک و التیام‌بخش فوری با نیاسینامید، پانتنول B5، هیالورونیک اسید، سنتلا و میموزا.',
      badge: 'SOOTHING GEL',
      price: '۱٬۶۰۰٬۰۰۰ تومان',
      img: '/assets/drdermer/2025/08/16healene-1200x1109.webp',
    },
    {
      slug: 'silicalene',
      title: 'اسکراب دتوکس سیلیکالین Silicalene',
      desc: 'پاکسازی عمقی منافذ و کنترل چربی با میکروسفرهای سیلیکا، کربن فعال و BHA.',
      badge: 'SILICA DETOX',
      price: '۱٬۵۵۰٬۰۰۰ تومان',
      img: '/assets/drdermer/2025/08/14silicalene-1200x1109.webp',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <span>فرمولاسیون داروسازی کمبریج</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono">Dr. Dermer UK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            لاین بالینی و مراقبت خانگی{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              ReeSkin™ Clinical
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            مجموعه تخصصی محصولات مراقبت پوست با تمرکز بر انتقال ترنس‌درمال دی‌اکسید کربن، تحریک اثر بوهر،
            سرم‌های بازسازی سد دفاعی و لایه‌برداری ابریشمی بدون ایجاد خراش‌های میکروسکوپی.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {reeskinProducts.map((p) => (
            <article
              key={p.slug}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{p.price}</span>
                </div>

                <div className="h-48 flex items-center justify-center p-4 bg-slate-950/40 rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>

                <h2 className="text-base font-bold text-white mb-2 leading-snug">
                  <Link href={`/products/${p.slug}`} className="hover:text-emerald-400 transition">
                    {p.title}
                  </Link>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>

              <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                <Link
                  href={`/products/${p.slug}`}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  مشاهده مشخصات و خرید ←
                </Link>
                <Link
                  href={`/products/${p.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
                >
                  سفارش
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Protocols Strip */}
        <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-900/40 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl font-black text-white mb-3">
            پروتکل‌های گام‌به‌گام درمانی آکادمی دکتر درمر
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            راهنماهای رسمی تنظیم‌شده توسط متخصصین درماتولوژی برای دستیابی به حداکثر اثرگذاری در دوره‌های ۷ روزه و ۱۵ روزه.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/academy"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              مشاهده مقالات و پروتکل‌های آکادمی
            </Link>
            <Link
              href="/ingredients"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              دانشنامه ترکیبات فعال INCI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
