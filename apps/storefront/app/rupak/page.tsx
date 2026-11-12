import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  listCategories,
  listProducts,
  resolveProductImage,
  resolveVariant,
} from '../../lib/catalog';
import { getCanonicalProductHref } from '../../lib/clinical-specs';
import { RupakHero } from '../../components/rupak-hero/rupak-hero';
import { RupakCategoryWave } from '../../components/rupak-hero/rupak-category-wave';
import { RupakSpecialOffers } from '../../components/rupak-hero/rupak-special-offers';
import { RupakNewestProducts } from '../../components/rupak-hero/rupak-newest-products';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Headphones,
  Star,
  ShoppingBag,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'قالب فروشگاهی روپاک شاپ | هیرو سکشن مدرن وردپرس/ووکامرس فارسی',
  description:
    'پیاده‌سازی کامپوننت هیرو سکشن قالب فروشگاهی روپاک شاپ با Next.js 16، ری‌اکت ۱۹ و استایل‌های سفارشی برآمدگی SVG نوبار، اسلایدر چندرسانه‌ای و منحنی انتهای صفحه.',
};

export default async function RupakShowcasePage() {
  const [catalog, categories] = await Promise.all([
    listProducts({ limit: 100 }),
    listCategories(),
  ]);
  const allProducts = catalog?.data ?? [];
  const featuredProducts = (allProducts.filter((p) => p.isFeatured).length > 0
    ? allProducts.filter((p) => p.isFeatured)
    : allProducts
  ).slice(0, 6);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <RupakHero
        cartCount={0}
        cartTotalFormatted="۰ تومان"
        phoneNumber="۰۹۳۵۸۷۲۷۴۹۲"
      />

      <RupakCategoryWave categories={categories} />

      <RupakSpecialOffers products={allProducts} />

      <RupakNewestProducts products={allProducts} />

      {/* ====================================================================
          2. TRUST & CREDIBILITY STRIP
          ==================================================================== */}
      <section className="relative z-10 -mt-6 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-800 mb-1">
              تضمین ۱۰۰٪ اصالت کالا
            </h2>
            <p className="text-xs text-slate-500">
              فرمولاسیون رسمی کمبریج انگلستان
            </p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-800 mb-1">
              پروتکل زنجیره سرد (۲ تا ۸°)
            </h2>
            <p className="text-xs text-slate-500">
              حفظ کامل اثربخشی مواد فعال زیستی
            </p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-800 mb-1">
              مشاوره بالینی رایگان
            </h2>
            <p className="text-xs text-slate-500">
              پاسخگویی مستقیم درماتولوژیست‌ها
            </p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h2 className="font-extrabold text-sm text-slate-800 mb-1">
              پشتیبانی فوری ۲۴/۷
            </h2>
            <p className="text-xs text-slate-500">
              همراهی از انتخاب تا پایان دوره درمان
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. FEATURED PRODUCTS CATALOG SECTION (#rupak-catalog)
          ==================================================================== */}
      <section id="rupak-catalog" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block bg-[#f7d49c] text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-lg mb-3">
              کاتالوگ تخصصی روپاک شاپ
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              محصولات برگزیده مراقبت پوستی و تجهیزات درمانی
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
              تمامی فرآورده‌ها دارای گواهینامه‌های رسمی کنترل کیفی، تاییدیه‌های آزمایشگاهی VISIA و پروتکل‌های ترمیم لایه شاخی پوست هستند.
            </p>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0">
            <Link
              href="/shop"
              className="bg-[#66a884] text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-sm"
            >
              همه محصولات
            </Link>
            <Link
              href="/carboxygel"
              className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-4 py-2 rounded-xl border border-slate-200 whitespace-nowrap transition"
            >
              کربوکسی‌تراپی
            </Link>
            <Link
              href="/shop?cat=serum"
              className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-4 py-2 rounded-xl border border-slate-200 whitespace-nowrap transition"
            >
              سرم و آبرسان
            </Link>
            <Link
              href="/shop?cat=devices"
              className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-4 py-2 rounded-xl border border-slate-200 whitespace-nowrap transition"
            >
              دستگاه‌های پزشکی
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((prod) => {
            const v = resolveVariant(prod);
            const priceTomans = v ? Number(BigInt(v.priceAmount || '0') / 10n).toLocaleString('fa-IR') : '۰';
            const oldTomans =
              v?.originalPriceAmount && BigInt(v.originalPriceAmount) > BigInt(v.priceAmount || '0')
                ? Number(BigInt(v.originalPriceAmount) / 10n).toLocaleString('fa-IR')
                : '';
            const href = getCanonicalProductHref(prod.slug);
            const imgUrl = resolveProductImage(prod);
            const titleFa = prod.titleFa || prod.title;
            const ratingStr = Number(prod.ratingValue ?? 4.9).toLocaleString('fa-IR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
            const reviewsStr = Number(prod.reviewCount ?? 0).toLocaleString('fa-IR');
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                <div className="relative bg-slate-50 p-6 flex items-center justify-center min-h-[220px] overflow-hidden">
                  {prod.badge && (
                    <span className="absolute top-4 right-4 text-[11px] font-extrabold px-3 py-1 rounded-lg bg-amber-100 text-amber-800">
                      {prod.badge}
                    </span>
                  )}

                  <div className="absolute top-4 left-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={href}
                      className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600 transition"
                      title="مشاهده جزئیات محصول"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>

                  <img
                    src={imgUrl}
                    alt={titleFa}
                    className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>{prod.category?.titleFa || 'مراقبت پوستی'}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{ratingStr}</span>
                      <span className="text-slate-400">({reviewsStr})</span>
                    </div>
                  </div>

                  <Link
                    href={href}
                    className="font-black text-slate-900 text-base mb-2 hover:text-[#66a884] transition-colors leading-snug line-clamp-2"
                  >
                    {titleFa}
                  </Link>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {prod.subtitleFa || prod.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {oldTomans && (
                        <span className="block text-[11px] text-slate-400 line-through">
                          {oldTomans} تومان
                        </span>
                      )}
                      <span className="text-base font-black text-slate-900">
                        {priceTomans}{' '}
                        <span className="text-xs font-bold text-slate-500">تومان</span>
                      </span>
                    </div>

                    <Link
                      href={href}
                      className="bg-slate-900 hover:bg-[#66a884] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>ثبت سفارش</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          4. CONTACT FOOTER STRIP (#contact-footer)
          ==================================================================== */}
      <footer id="contact-footer" className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-slate-800 pb-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#66a884] flex items-center justify-center font-black text-white text-xl">
                  R
                </div>
                <div>
                  <h3 className="font-black text-lg">فروشگاه تخصصی | dermavia</h3>
                  <span className="text-xs text-slate-400">
                    مرکز رسمی عرضه فرآورده‌های درماتولوژی
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                محیط تخصصی مراقبت و سلامت پوست، ارائه‌دهنده محصولات با استانداردهای دارویی و بالینی بین‌المللی همراه با مشاوره آنلاین پزشکان.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#ffd098] mb-4">
                دسترسی سریع
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link href="/" className="hover:text-white transition">
                    صفحه اصلی فروشگاه
                  </Link>
                </li>
                <li>
                  <Link href="/carboxygel" className="hover:text-white transition">
                    کربوکسی‌تراپی CarboxyGel
                  </Link>
                </li>
                <li>
                  <Link href="/plasmax" className="hover:text-white transition">
                    دستگاه جراحی و درمانی PlasmaX
                  </Link>
                </li>
                <li>
                  <Link href="/b2b" className="hover:text-white transition">
                    پرتال کلینیک‌ها و مراکز درمانی (B2B)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#ffd098] mb-4">
                ارتباط با کارشناسان روپاک
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                برای دریافت مشاوره تخصصی در زمینه انتخاب محصولات یا ثبت سفارشات عمده کلینیکی:
              </p>
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-slate-400">
                    شماره تماس و پشتیبانی:
                  </span>
                  <span className="font-black text-sm text-white">
                    ۰۹۳۵۸۷۲۷۴۹۲
                  </span>
                </div>
                <a
                  href="tel:09358727492"
                  className="bg-[#ffd098] text-slate-900 font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-[#f7d49c] transition"
                >
                  تماس مستقیم
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              تمامی حقوق مادی و معنوی این سامانه متعلق به روپاک شاپ و Commerce OS می‌باشد.
            </p>
            <div className="flex items-center gap-4">
              <span>نسخه ۲.۰.۰ — معماری بالینی هیبرید</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
