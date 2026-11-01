import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'پادهای فعال‌ساز کربوکسی‌پاد CarboxyPod | دکتر درمر انگلستان',
  description:
    'کپسول‌های فعال‌ساز گاز CO₂ و اسکراب شیمیایی-فیزیکی در ۳ نوع Vitamin، Carbon و Hydra جهت استفاده دستی یا اتصال به هندپیس CarboX.',
};

export default function CarboxypodPage() {
  const pods = [
    {
      title: 'Vitamin CARBOXYPOD',
      titleFa: 'پاد ویتامینه ضدچروک و جوانساز',
      desc: 'حاوی ویتامین‌های فعال پوستی جهت تغذیه عمیق، کاهش چشمگیر خطوط و چروک و تقویت چندبرابری اثرات کربوکسی‌تراپی.',
      ingredients: 'Sodium Bicarbonate, Niacinamide, Ascorbyl Glucoside (Vitamin C), Calcium Pantothenate (B5), Retinyl Acetate (Vitamin A)',
      results: 'جوانسازی سلولی، تحریک کلاژن، افزایش الاستیسیته و درخشندگی پوست',
      color: 'from-amber-500/20 to-slate-900',
      border: 'border-amber-500/40',
      badge: 'VITAMIN BOOST',
      img: '/assets/drdermer/2025/07/1-vitapod-1-1-2.png',
    },
    {
      title: 'Carbon CARBOXYPOD',
      titleFa: 'پاد کربن فعال دتوکس و متعادل‌کننده',
      desc: 'فرموله‌شده با پودر کربن فعال دارویی جهت جذب چربی اضافه، تخلیه آلاینده‌های عمقی منافذ و تصفیه پوست‌های چرب و مستعد آکنه.',
      ingredients: 'Sodium Bicarbonate, Activated Carbon Powder, Niacinamide, Zinc Pyrrolidone Carboxylic Acid (Zinc PCA)',
      results: 'کنترل ماندگار سبوم، پاکسازی کومدون‌های سرسیاه و کاهش درخشش چربی پوست',
      color: 'from-slate-700/20 to-slate-900',
      border: 'border-slate-600/40',
      badge: 'ACTIVATED CARBON',
      img: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
    },
    {
      title: 'Hydra CARBOXYPOD',
      titleFa: 'پاد هیدرا آبرسان عمقی و کاهش منافذ',
      desc: 'ترکیب هیالورونیک اسید چندمولکولی و آلانتوئین جهت تزریق رطوبت به سلول‌های دهیدراته همزمان با آزادسازی اکسیژن فعال.',
      ingredients: 'Sodium Bicarbonate, Sodium Hyaluronate, Aloe Vera Extract, Allantoin, Betaine',
      results: 'هیدراتاسیون ماندگار بافت پوست، رفع خطوط ناشی از خشکی و بازیابی طراوت',
      color: 'from-cyan-500/20 to-slate-900',
      border: 'border-cyan-500/40',
      badge: 'HYALURONIC HYDRA',
      img: '/assets/drdermer/2025/07/1-vitapod-1-1-2.png',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
              <span>Next-Gen Transdermal Pods</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono">ReeSkin Dr Dermer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              پادهای فعال‌ساز کربوکسی‌پاد{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                CarboxyPod™
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              روشی نوآورانه و فوق‌العاده اثربخش در مراقبت از پوست؛ پادهای فشرده CarboxyPod با برقراری تماس بر سطح
              ژل کربوکسی، فرآیند لایه‌برداری دوگانه شیمیایی و فیزیکی را آغاز نموده و ضمن تولید متراکم گاز CO₂،
              نفوذ مولکول‌های مغذی و ویتامینه را به لایه‌های عمقی پوست چند برابر می‌کنند.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products/carboxypod"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
              >
                سفارش و مشاهده مشخصات خرید پادها ←
              </Link>
              <Link
                href="/carbox"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition"
              >
                بررسی ایستگاه و هندپیس CarboX
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-center justify-center">
            <img
              src="/assets/drdermer/2025/07/carbon-carboxypod-1.png"
              alt="Carbon CarboxyPod"
              className="max-h-80 w-auto object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>

        {/* 3 Pod Variants Breakdown */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              ۳ نوع پاد فعال‌ساز برای اهداف مختلف درمانی
            </h2>
            <p className="text-sm text-slate-400">
              هر کپسول به صورت اختصاصی با اسیدهای تثبیت‌شده و ترکیبات ارگانیک هدفمند متراکم شده است
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pods.map((p, i) => (
              <div
                key={i}
                className={`bg-gradient-to-b ${p.color} border ${p.border} rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-200 border border-slate-800">
                      {p.badge}
                    </span>
                    <span className="text-xs text-slate-400">باکس ۱۰ عددی</span>
                  </div>

                  <div className="h-44 flex items-center justify-center p-3 mb-4">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-lg"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{p.titleFa}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{p.desc}</p>
                </div>

                <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 space-y-2">
                  <div>
                    <strong className="text-emerald-400">مواد مؤثره:</strong> {p.ingredients}
                  </div>
                  <div>
                    <strong className="text-slate-300">نتیجه مورد انتظار:</strong> {p.results}
                  </div>
                  <Link
                    href="/products/carboxypod"
                    className="mt-3 block text-center py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                  >
                    ثبت سفارش این مدل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
