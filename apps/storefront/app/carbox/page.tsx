import { Metadata } from 'next';
import Link from 'next/link';
import { CanvasSequencePlayer } from '../../components/interactive/canvas-sequence-player';
import { ProductCardAction } from '../../components/product-card-action';

export const metadata: Metadata = {
  title: 'دستگاه تخصصی کربوکسی‌تراپی و تزریق گاز CO2 مدیکال CarboX | ReeMed Medical Pro',
  description:
    'ایستگاه تخصصی مدیکال تزریق کنترل‌شده زیرجلدی گاز CO2 و هندپیس اولتراسونیک CarboxyPod. دارای استاندارد CE Medical Class IIb اتحادیه اروپا و گواهی کالیبراسیون دقیق.',
};

export default function CarboxLandingPage() {
  const carboxHotspots = [
    {
      frameRange: [1, 25] as [number, number],
      xPercent: 52,
      yPercent: 32,
      title: 'سیستم گرمایش دیجیتال گاز',
      description: 'پیش‌گرمایش گاز تا ۳۶ درجه سانتی‌گراد جهت حذف درد ناشی از انقباض عروقی هنگام تزریق.',
      badge: '36°C HEATING',
    },
    {
      frameRange: [20, 60] as [number, number],
      xPercent: 48,
      yPercent: 45,
      title: 'سنسورهای فشار پیزوالکتریک',
      description: 'تنظیم پیوسته جریان خروجی گاز از ۱۰ تا ۱۰۰ سی‌سی در دقیقه با دقت کالیبره‌شده میکرونی.',
      badge: 'DIGITAL REGULATION',
    },
    {
      frameRange: [50, 82] as [number, number],
      xPercent: 55,
      yPercent: 68,
      title: 'هندپیس اختصاصی CarboxyPod',
      description: 'سوکت اولتراسونیک فعال‌کننده ژل کربوکسی با پادهای درمانی بدون نیاز به سوزن.',
      badge: 'DUAL-MODALITY',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column: Headlines & Specifications */}
            <div className="flex-1 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
                <span>تجهیزات پزشکی تخصصی کلینیک</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono">CE Medical Class IIb</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
                ایستگاه پزشکی کربوکسی‌تراپی{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  ReeMed CarboX™
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                کامل‌ترین و پیشرفته‌ترین سامانه کربوکسی‌تراپی جهان با قابلیت تلفیق دو مدالیته:
                تزریق فوق‌دقیق زیرجلدی گاز CO₂ با حسگرهای پیزوالکتریک، در کنار هندپیس غیرتهاجمی
                کربوکسی‌پاد جهت جوانسازی عمقی بافت بر پایه اثر فیزیولوژیک بوهر (Bohr Effect).
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/b2b?kit=carbox"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  استعلام قیمت همکاری و شرایط اقساطی کلینیک ←
                </Link>

                <Link
                  href="/b2b/workshops"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
                >
                  رزرو ورکشاپ آموزشی تخصصی
                </Link>
              </div>

              {/* Key Medical Telemetry */}
              <div className="grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-mono font-bold text-lg">10–100</div>
                  <div className="text-[11px] text-slate-400">cc/min دبی گاز</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-mono font-bold text-lg">36°C</div>
                  <div className="text-[11px] text-slate-400">گرمایش گاز تزریقی</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-mono font-bold text-lg">Class IIb</div>
                  <div className="text-[11px] text-slate-400">گواهینامه MDR اروپا</div>
                </div>
              </div>
            </div>

            {/* Right Column: 360 Canvas Player */}
            <div className="flex-1 w-full max-w-lg">
              <CanvasSequencePlayer
                frameFolder="/assets/drdermer/2025/carbox"
                totalFrames={82}
                framePrefix=""
                padDigits={2}
                fileExtension=".webp"
                autoRotate={true}
                autoRotateSpeedMs={75}
                aspectRatio={1.15}
                overlayHotspots={carboxHotspots}
                label="نمایش ۳۶۰ درجه کنسول کربوکس ری‌مد"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Modalities Breakdown */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              دو مدالیته کامل در یک ایستگاه بالینی
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              انعطاف‌پذیری بی‌نظیر برای پاسخگویی به کلیه نیازهای درماتولوژی، لیپولیز و جوانسازی غیرتهاجمی
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Modality 1 */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xl mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                تزریق زیرجلدی گاز CO₂ (Subcutaneous Micro-Injection)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                کنترل دیجیتال سرعت خروج گاز از ۱۰ تا ۱۰۰ سی‌سی در دقیقه، تنظیم حجم کل تزریق،
                و گرمایش اتوماتیک گاز مانع از بروز اسپاسم عضلانی و درد بیمار می‌گردد.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <li>• درمان تیرگی و پف اطراف چشم با میکرودوزهای ۳ تا ۵ سی‌سی</li>
                <li>• تحریک فیبروبلاست‌ها و بازسازی استریا و ترک‌های پوستی</li>
                <li>• بهبود سلولیت و لیپولیز متابولیک چربی‌های موضعی</li>
              </ul>
            </div>

            {/* Modality 2 */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xl mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                مدالیته غیرتهاجمی CarboxyPod &amp; Gel
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                استفاده از هندپیس ارگونومیک اولتراسونیک جهت به حرکت درآوردن پادهای کربوکسی‌پاد روی ژل
                مخصوص، بدون سوزن، بدون درد و بدون کوچک‌ترین دوره نقاهت.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <li>• آزادسازی موضعی بیش از ۱۰۰۰ پی‌پی‌ام گاز CO₂ بر سطح پوست</li>
                <li>• تحریک شدید اثر بوهر و افزایش ۴۵ درصدی اکسیژن‌رسانی به بافت</li>
                <li>• لایه‌برداری شیمیایی-فیزیکی همزمان و نفوذ ویتامین‌ها</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certification & B2B Strip */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            تأمین مستقیم تجهیزات با فاکتور رسمی و گارانتی ۲۴ ماهه
          </h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            کلیه دستگاه‌های CarboX همراه با تحویل در محل کلینیک، کالیبراسیون تخصصی، آموزش رایگان پزشک و پرسنل،
            و ۱۰ سال خدمات پس از فروش رسمی ارائه می‌گردند.
          </p>
          <div className="inline-flex gap-4">
            <Link
              href="/b2b"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl transition"
            >
              فرم درخواست کاتالوگ فنی و پیش‌فاکتور
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
