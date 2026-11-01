import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'تجهیزات و فناوری‌های پزشکی ReeMed™ Medical Pro | دکتر درمر انگلستان',
  description:
    'سامانه‌های پیشرفته پزشکی و ملزومات کلینیکال پوست، مو و زیبایی: CarboX و PlasmaX با استانداردهای MDR اتحادیه اروپا و CE Medical.',
};

export default function ReeMedBrandPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
            <span>تجهیزات و سامانه‌های پزشکی کلینیک</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono">CE 0123 / ISO 13485</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            مهندسی فناوری‌های پیشرفته مدیکال{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">
              ReeMed™ Medical Pro
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            سامانه‌های اختصاصی پزشکان و مراکز درماتولوژی با استانداردهای سخت‌گیرانه کلاس IIb اروپا؛
            ترکیب دوگانه تزریق CO₂ در ایستگاه CarboX و انرژی پلاسمای سرد آرگون در دستگاه PlasmaX.
          </p>
        </div>

        {/* 2 Flagship Devices Showcase */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* CarboX Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/60">
                  DUAL MODALITY STATION
                </span>
                <span className="text-xs text-slate-400">CE Class IIb</span>
              </div>

              <div className="h-64 flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl mb-6">
                <img
                  src="/assets/drdermer/2025/08/01Reeskin-scaled.webp"
                  alt="CarboX Medical Station"
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                />
              </div>

              <h2 className="text-2xl font-black text-white mb-3">
                ایستگاه کربوکسی‌تراپی CarboX™
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                سامانه تزریق گاز دی‌اکسید کربن زیرجلدی با تنظیم دوز از ۱۰ تا ۱۰۰ سی‌سی بر دقیقه به همراه
                هندپیس اولتراسونیک پادهای کربوکسی‌پاد و پیش‌گرمایش گاز تا ۳۶ درجه سانتی‌گراد.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-6 flex flex-wrap gap-3">
              <Link
                href="/carbox"
                className="flex-1 text-center py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                بررسی تعاملی و ۳۶۰ درجه CarboX ←
              </Link>
              <Link
                href="/b2b?kit=carbox"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                استعلام قیمت
              </Link>
            </div>
          </div>

          {/* PlasmaX Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 px-3 py-1 rounded-full border border-cyan-800/60">
                  COLD JET &amp; DBD PLASMA
                </span>
                <span className="text-xs text-slate-400">Class IIb Medical</span>
              </div>

              <div className="h-64 flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl mb-6">
                <img
                  src="/assets/drdermer/2025/08/18plasmax-181x300.webp"
                  alt="PlasmaX Device"
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                />
              </div>

              <h2 className="text-2xl font-black text-white mb-3">
                دستگاه انرژی پلاسما PlasmaX™
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                قوی‌ترین سیستم پلاسمای پزشکی با ۳ مدالیته تخلیه پیوسته برای بلفاروپلاستی غیرتهاجمی،
                جت پلاسمای سرد آرگون و هلیوم برای ترمیم اسکار و ضدعفونی عمقی، و پلاسمای سد دی‌الکتریک.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-6 flex flex-wrap gap-3">
              <Link
                href="/plasmax"
                className="flex-1 text-center py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                بررسی تعاملی و ۳۶۰ درجه PlasmaX ←
              </Link>
              <Link
                href="/b2b?kit=plasmax"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                استعلام قیمت
              </Link>
            </div>
          </div>
        </div>

        {/* B2B Clinic Strip */}
        <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/40 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl font-black text-white mb-3">
            پورتال اختصاصی تأمین و استعلام تجهیزات برای کلینیک‌ها
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            امکان ثبت استعلام رسمی، دریافت پیش‌فاکتور شرکتی، بهره‌مندی از شرایط پرداخت اقساطی ویژه پزشکان،
            و ثبت‌نام در دوره‌های معتبر آموزش کاربری با ارائه سرتیفیکیت اروپایی.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/b2b"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              ورود به پورتال پزشکان و کلینیک‌ها
            </Link>
            <Link
              href="/b2b/workshops"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              تقویم کارگاه‌های آموزشی و مدارک
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
