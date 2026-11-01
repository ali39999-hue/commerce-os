import { Metadata } from 'next';
import Link from 'next/link';
import { CanvasSequencePlayer } from '../../components/interactive/canvas-sequence-player';

export const metadata: Metadata = {
  title: 'دستگاه پزشکی انرژی پلاسما و جت سرد PlasmaX | ReeMed Medical Pro',
  description:
    'پیشرفته‌ترین سیستم پلاسمای پزشکی جهان با ۳ مد درمانی: Continuous Discharge، Cold Argon/Helium Plasma Jet و DBD Plasma جهت بلفاروپلاستی بدون جراحی و ترمیم اسکار.',
};

export default function PlasmaxLandingPage() {
  const plasmaxHotspots = [
    {
      frameRange: [1, 35] as [number, number],
      xPercent: 50,
      yPercent: 30,
      title: 'ژنراتور تخلیه پیوسته فرکانس بالا',
      description: 'کنترل کامل دیجیتال ولتاژ، فرکانس و عمق نفوذ بدون سوختگی حرارتی کنترل‌نشده.',
      badge: 'CONTINUOUS RF',
    },
    {
      frameRange: [30, 75] as [number, number],
      xPercent: 46,
      yPercent: 48,
      title: 'نازل جت پلاسمای سرد آرگون / هلیوم',
      description: 'جریان پلاسمای غیرحرارتی جهت از بین بردن ۹۹.۹٪ بار میکروبی و بیواستیمولیشن سریع سلولی.',
      badge: 'COLD JET 35°C',
    },
    {
      frameRange: [70, 110] as [number, number],
      xPercent: 54,
      yPercent: 65,
      title: 'ماژول دی‌الکتریک بریک‌داون DBD',
      description: 'الکترود محافظت‌شده جهت انرژی‌رسانی یکنواخت سطحی بدون تخریب بافت پوششی.',
      badge: 'SURFACE DBD',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column */}
            <div className="flex-1 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6">
                <span>تکنولوژی انحصاری مدیکال پلاسما</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono">CE 0123 / ISO 13485</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
                سامانه مولتی‌مدالیته پلاسما{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">
                  ReeMed PlasmaX™
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                نخستین و تنها دستگاه پلاسمای جهان با کنترل کامل پزشکی بر فرکانس، ولتاژ، دبی گاز و عمق نفوذ.
                مجهز به تکنولوژی جت پلاسمای سرد آرگون و هلیوم جهت ترمیم زخم، رفع اسکار و ضدعفونی عمقی بدون آسیب حرارتی.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/b2b?kit=plasmax"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  استعلام قیمت و شرایط اقساطی کلینیک ←
                </Link>

                <Link
                  href="/b2b/workshops"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
                >
                  تقویم آموزش کاربری و سرتیفیکیت
                </Link>
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-cyan-400 font-mono font-bold text-lg">99.9%</div>
                  <div className="text-[11px] text-slate-400">کاهش بار باکتریایی</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-cyan-400 font-mono font-bold text-lg">&lt;38°C</div>
                  <div className="text-[11px] text-slate-400">دمای جت سرد آرگون</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-cyan-400 font-mono font-bold text-lg">3 Modes</div>
                  <div className="text-[11px] text-slate-400">مدالیته‌های تخصصی</div>
                </div>
              </div>
            </div>

            {/* Right Column: 360 Canvas Player (110 frames) */}
            <div className="flex-1 w-full max-w-lg">
              <CanvasSequencePlayer
                frameFolder="/assets/drdermer/2025/plasmax"
                totalFrames={110}
                framePrefix=""
                padDigits={3}
                fileExtension=".webp"
                autoRotate={true}
                autoRotateSpeedMs={65}
                aspectRatio={1.15}
                overlayHotspots={plasmaxHotspots}
                label="نمایش ۳۶۰ درجه کنسول پلاسماکس ری‌مد"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Plasma Modes Breakdown */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              ۳ مدالیته بالینی مستقل در یک سیستم
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              تلفیق نوآورانه درمان‌های ترمیمی غیرحرارتی، استرلیزاسیون و جراحی‌های ظریف بلفاروپلاستی
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Mode 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Continuous Discharge Plasma
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  تخلیه مداوم پلاسما با ژنراتور دیجیتال ویژه بلفاروپلاستی غیرتهاجمی پلک، لیفتینگ چین‌وچروک و حذف زوائد خوش‌خیم بدون برش و خونریزی.
                </p>
              </div>
              <div className="text-[11px] text-cyan-400 font-semibold border-t border-slate-800 pt-3">
                کاربرد: پلک و چروک‌های عمقی
              </div>
            </div>

            {/* Mode 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Cold Plasma Jet (Argon &amp; Helium)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  جت غیرحرارتی گاز آرگون و هلیوم برای تولید گونه‌های واکنش‌پذیر اکسیژن و نیتروژن (RONS)، التیام سریع زخم‌ها، پاکسازی آکنه و بهبود جای اسکار.
                </p>
              </div>
              <div className="text-[11px] text-blue-400 font-semibold border-t border-slate-800 pt-3">
                کاربرد: درمان زخم، اسکار و آکنه فعال
              </div>
            </div>

            {/* Mode 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  DBD Surface Plasma
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  پلاسمای سد دی‌الکتریک با توزیع کاملاً همگن برای بهبود نفوذپذیری پوست، تسریع جذب سرم‌های پپتیدی و تقویت اتصالات سلولی اپیدرم.
                </p>
              </div>
              <div className="text-[11px] text-teal-400 font-semibold border-t border-slate-800 pt-3">
                کاربرد: مزوپلازما و افزایش نفوذپذیری
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Strip */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            آموزش تخصصی و تأمین دستگاه با گواهینامه معتبر آکادمی
          </h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            کنسول کامل PlasmaX به همراه پروب‌های جراحی، نازل جت سرد و گارانتی ۲۴ ماهه تعویض قطعات به مراکز درمانی معتبر تحویل می‌گردد.
          </p>
          <div className="inline-flex gap-4">
            <Link
              href="/b2b"
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl transition"
            >
              استعلام قیمت و ارسال کاتالوگ فنی
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
