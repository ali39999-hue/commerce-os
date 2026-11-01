import { Metadata } from 'next';
import Link from 'next/link';
import { ProductCardAction } from '../../components/product-card-action';

export const metadata: Metadata = {
  title: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel | Dr Dermer UK Clinical Laboratories',
  description:
    'کربوکسی‌تراپی غیرتهاجمی بدون سوزن بر پایه پدیده فیزیولوژیک اثر بوهر (Bohr Effect). دارای ۳ فرمولاسیون اختصاصی: Glycolic Acid, Multi-Active, Azelaic Acid.',
};

export default function CarboxygelPage() {
  const formulations = [
    {
      title: 'Glycolic Acid CarboxyGel',
      titleFa: 'فرمولاسیون اسید گلیکولیک (روشن‌کنندگی و لایه‌برداری عمیق)',
      desc: 'حاوی اسید گلیکولیک دارویی با pH کنترل‌شده برای پاکسازی پیگمانتاسیون سطحی، بهبود ملاسما و افزایش جذب ترکیبات فعال.',
      ph: 'pH 3.5 - 3.8',
      indication: 'لک، تیرگی چهره و خطوط ریز سطحی',
      actives: 'Glycolic Acid 6%, Sodium Bicarbonate, Centella Asiatica',
    },
    {
      title: 'Multi-Active CarboxyGel',
      titleFa: 'فرمولاسیون مولتی‌اکتیو (جوانسازی جامع و بازسازی کلاژن)',
      desc: 'غنی‌شده با نانوپپتیدهای بیومیمتیک و آنتی‌اکسیدان‌های قوی جهت تحریک فیبروبلاست‌ها و لیفتینگ الاستیک بافت پوست.',
      ph: 'pH 3.8 - 4.0',
      indication: 'افتادگی پوست، خطوط عمقی و خستگی ماتریکس سلولی',
      actives: 'Biomimetic Peptides, Hyaluronic Acid, Niacinamide, Sodium Bicarbonate',
    },
    {
      title: 'Azelaic Acid CarboxyGel',
      titleFa: 'فرمولاسیون اسید آزالائیک (مهار آکنه، قرمزی و ضدالتهاب)',
      desc: 'طراحی ویژه پوست‌های چرب، مستعد آکنه التهابی و قرمزی اریتما، با مهار مسیرهای تیروزیناز و باکتری C. acnes.',
      ph: 'pH 3.6 - 3.8',
      indication: 'آکنه، اسکار التهابی، هایپرپیگمنتیشن پس از التهاب (PIH)',
      actives: 'Azelaic Acid 8%, Zinc PCA, Sodium Bicarbonate, Allantoin',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Hero */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
              <span>Non-Invasive Carboxy Therapy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono">The Bohr Effect</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              ژل کربوکسی‌تراپی غیرتهاجمی{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                CarboxyGel™
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              کربوکسی‌تراپی بدون سوزن دکتر درمر درمانی نوآورانه است که در آن ژل مخصوص کربوکسی با ضخامت
              یکنواخت روی پوست قرار گرفته و سپس پد فعال‌ساز آلکالاین روی آن فیکس می‌شود. با آغاز واکنش سطحی،
              دی‌اکسید کربن فعال وارد پوست شده و پدیده شگفت‌انگیز <strong>اثر بوهر (Bohr Effect)</strong> را در
              لایه‌های زنده درم القا می‌کند.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products/carboxygel"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
              >
                سفارش و مشاهده مشخصات خرید کالا ←
              </Link>
              <Link
                href="/b2b"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition"
              >
                خرید پک ۵۰۰ میل کابین کلینیک
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-6">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold text-lg">+۴۵٪</div>
                <div className="text-[11px] text-slate-400">اشباع اکسیژن بافت</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold text-lg">0 Day</div>
                <div className="text-[11px] text-slate-400">دوره نقاهت (Zero Downtime)</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold text-lg">CE Medical</div>
                <div className="text-[11px] text-slate-400">استاندارد کلاس I اروپا</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-center">
            <img
              src="/assets/drdermer/2025/07/azelaic-acid-carboxygel.png"
              alt="CarboxyGel Dr Dermer"
              className="max-h-96 w-auto object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>

        {/* 3 Formulations Breakdown */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              ۳ فرمولاسیون اختصاصی متناسب با نوع پوست و هدف درمانی
            </h2>
            <p className="text-sm text-slate-400">
              انتخاب هدفمند پزشک و مصرف‌کننده بر اساس اندیکاسیون بالینی مورد نظر
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {formulations.map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded">
                      {f.ph}
                    </span>
                    <span className="text-xs text-slate-400">تخصصی کلینیکال</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.titleFa}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{f.desc}</p>
                </div>

                <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <strong className="text-emerald-400">اندیکاسیون:</strong> {f.indication}
                  </div>
                  <div>
                    <strong className="text-slate-300">ترکیبات فعال:</strong> {f.actives}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Bohr Effect Scientific Principle */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-900/40 rounded-3xl p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Scientific Principle &amp; Physiology
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-6">
              اصل علمی: اثر بوهر (The Bohr Effect)
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              اثر بوهر یک فرآیند فیزیولوژیک اثبات‌شده در پزشکی است که طی آن، افزایش غلظت موضعی دی‌اکسید کربن
              (CO₂) و کاهش جزئی pH خون مویرگی، تمایل هموگلوبین به اکسیژن را کاهش می‌دهد. در نتیجه این واکنش،
              هموگلوبین اکسیژن متصل به خود را با شدت بالا در بافت تحت درمان آزاد می‌کند. اکسیژن اشباع‌شده، ریزجریان
              خون مویرگی را تقویت نموده و ساخت سریع فیبروبلاست، کلاژن و الاستین را تحریک می‌کند.
            </p>

            <Link
              href="/academy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              مطالعه مقاله کامل مکانیسم اثر بوهر در آکادمی دکتر درمر ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
