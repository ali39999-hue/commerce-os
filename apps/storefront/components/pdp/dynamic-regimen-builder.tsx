'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';

export interface TreatmentGelOption {
  id: string;
  sku: string;
  title: string;
  volume: string;
  sessions: string;
  priceAmount: string; // Rials string
  originalPriceAmount: string;
  badge?: string;
}

export interface ActivationPodOption {
  id: string;
  sku: string;
  title: string;
  packSize: string;
  purposeFa: string;
  priceAmount: string;
  originalPriceAmount: string;
  isRecommended?: boolean;
}

export interface RecoveryAddonOption {
  id: string;
  sku: string;
  title: string;
  volume: string;
  roleFa: string;
  priceAmount: string;
  originalPriceAmount: string;
  discountPercentage: number;
}

const DEFAULT_GEL_OPTIONS: TreatmentGelOption[] = [
  {
    id: 'gel_500ml',
    sku: 'CBG-PRO-500ML',
    title: 'ژل CarboxyGel پک کلینیکال ۵۰۰ میلی‌لیتر',
    volume: '500ml',
    sessions: '۲۰ جلسه کلینیکی کامل',
    priceAmount: '48500000', // 4,850,000 Tomans
    originalPriceAmount: '56000000',
    badge: 'به‌صرفه‌ترین قیمت در هر جلسه',
  },
  {
    id: 'gel_box5',
    sku: 'CBG-HOME-5X',
    title: 'کیت هوم‌کر ۵ عددی (۵ تیوب ۲۵ میلی‌لیتر)',
    volume: '5x25ml',
    sessions: '۵ جلسه درمان کامل',
    priceAmount: '19500000', // 1,950,000 Tomans
    originalPriceAmount: '23000000',
    badge: 'محبوب‌ترین انتخاب مراجعین',
  },
  {
    id: 'gel_50ml',
    sku: 'CBG-TUBE-50ML',
    title: 'تیوب تکی ۵۰ میلی‌لیتر',
    volume: '50ml',
    sessions: '۲ جلسه تست یا تمدید',
    priceAmount: '8900000', // 890,000 Tomans
    originalPriceAmount: '10500000',
  },
];

const DEFAULT_POD_OPTIONS: ActivationPodOption[] = [
  {
    id: 'pod_carboxypod_box5',
    sku: 'RMD-CPD-005',
    title: 'پدهای فعال‌ساز فیبری CarboxyPod (باکس ۵ ساشه وکیوم)',
    packSize: '۵ عدد ساشه استریل',
    purposeFa: 'پدهای ارگونومیک با الیاف بارگذاری شده با اسید سیتریک میکروکپسوله',
    priceAmount: '12500000', // 1,250,000 Tomans
    originalPriceAmount: '14800000',
    isRecommended: true,
  },
  {
    id: 'pod_carboxypad_neck',
    sku: 'RMD-CPAD-NECK5',
    title: 'پدهای فعال‌ساز تخصصی صورت و دکلته CarboxyPad',
    packSize: '۵ ست صورت و گردن',
    purposeFa: 'برش آناتومیک اختصاصی برای زاویه فک، غبغب و خطوط گردن',
    priceAmount: '15500000', // 1,550,000 Tomans
    originalPriceAmount: '18000000',
  },
  {
    id: 'pod_carboxypod_box20',
    sku: 'RMD-CPD-020',
    title: 'پک اقتصادی کلینیکال CarboxyPod (باکس ۲۰ ساشه مطبی)',
    packSize: '۲۰ ساشه سالنی',
    purposeFa: 'تأمین سالنی ویژه پزشکان و اسکین‌تراپیست‌ها با بالاترین تخفیف',
    priceAmount: '44000000', // 4,400,000 Tomans
    originalPriceAmount: '52000000',
  },
];

const DEFAULT_RECOVERY_ADDONS: RecoveryAddonOption[] = [
  {
    id: 'addon_healene_250',
    sku: 'DD-HEA-250ML',
    title: 'ژل تسکین‌بخش و خنک‌کننده هیلین Healene Soothing Gel',
    volume: '250ml پمپی',
    roleFa: 'رفع آنی قرمزی و ترمیم سد دفاعی پوست با پانتنول و ۷ عصاره سیکا',
    priceAmount: '16000000', // 1,600,000 Tomans
    originalPriceAmount: '18500000',
    discountPercentage: 15,
  },
  {
    id: 'addon_crystalene_200',
    sku: 'DD-CRY-200ML',
    title: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste',
    volume: '200ml تیوب',
    roleFa: 'آماده‌سازی پوست و حذف سلول‌های کدر پیش از کربوکسی با میکروآلومینا',
    priceAmount: '17500000', // 1,750,000 Tomans
    originalPriceAmount: '20500000',
    discountPercentage: 15,
  },
];

export function DynamicRegimenBuilder() {
  const { addItem } = useCart();
  const { formatToman } = useLocalizedFormatter();

  // State: Chosen Gel, Pod, and Addons
  const [selectedGelId, setSelectedGelId] = useState<string>(DEFAULT_GEL_OPTIONS[1].id); // 5x kit
  const [selectedPodId, setSelectedPodId] = useState<string>(DEFAULT_POD_OPTIONS[0].id); // 5 pads
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    addon_healene_250: true, // Default checked for optimal regimen
  });
  const [bundleAdded, setBundleAdded] = useState(false);

  const selectedGel = DEFAULT_GEL_OPTIONS.find((g) => g.id === selectedGelId) || DEFAULT_GEL_OPTIONS[0];
  const selectedPod = DEFAULT_POD_OPTIONS.find((p) => p.id === selectedPodId) || DEFAULT_POD_OPTIONS[0];
  const activeAddonsList = DEFAULT_RECOVERY_ADDONS.filter((a) => selectedAddons[a.id]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Pricing math
  const gelPrice = BigInt(selectedGel.priceAmount);
  const podPrice = BigInt(selectedPod.priceAmount);
  const addonsPrice = activeAddonsList.reduce((sum, a) => sum + BigInt(a.priceAmount), 0n);

  const subtotalRials = gelPrice + podPrice + addonsPrice;

  // Tiered Regimen Savings:
  // 2 items (gel + pod) => 10% extra bundle discount
  // 3 items (gel + pod + 1 addon) => 15% extra bundle discount
  // 4 items (gel + pod + 2 addons) => 20% extra bundle discount
  const totalItemCount = 2 + activeAddonsList.length;
  let bundleDiscountPercent = 10;
  if (totalItemCount === 3) bundleDiscountPercent = 15;
  if (totalItemCount >= 4) bundleDiscountPercent = 20;

  const bundleDiscountAmount = (subtotalRials * BigInt(bundleDiscountPercent)) / 100n;
  const finalPriceRials = subtotalRials - bundleDiscountAmount;

  // Calculate full original non-bundle price for comparison
  const originalGel = BigInt(selectedGel.originalPriceAmount);
  const originalPod = BigInt(selectedPod.originalPriceAmount);
  const originalAddons = activeAddonsList.reduce((sum, a) => sum + BigInt(a.originalPriceAmount), 0n);
  const totalOriginalRials = originalGel + originalPod + originalAddons;
  const totalCustomerSavings = totalOriginalRials - finalPriceRials;

  const handleAddCustomRegimen = () => {
    // 1. Add Gel
    addItem({
      variantId: `var_${selectedGel.sku}`,
      productId: 'prod_skin_001',
      title: selectedGel.title,
      sku: selectedGel.sku,
      priceAmount: selectedGel.priceAmount,
    });

    // 2. Add Pod
    addItem({
      variantId: `var_${selectedPod.sku}`,
      productId: 'prod_clinical_carboxypod',
      title: selectedPod.title,
      sku: selectedPod.sku,
      priceAmount: selectedPod.priceAmount,
    });

    // 3. Add active addons
    activeAddonsList.forEach((addon) => {
      addItem({
        variantId: `var_${addon.sku}`,
        productId: addon.id,
        title: addon.title,
        sku: addon.sku,
        priceAmount: addon.priceAmount,
      });
    });

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2800);
  };

  return (
    <section className="regimen-builder-root" aria-label="باندل‌ساز پویا و شخصی‌سازی پروتکل">
      <div className="regimen-builder-card">
        {/* Header with tiered savings badge */}
        <div className="regimen-builder-header">
          <div className="regimen-header-top-row">
            <span className="regimen-builder-badge">سازنده هوشمند رژیم درمانی</span>
            <div className="regimen-tiered-discount-pill">
              <span>تخفیف پلکانی همزمان: </span>
              <strong>{bundleDiscountPercent}٪ تخفیف مازاد روی پکیج</strong>
            </div>
          </div>
          <h3 className="regimen-builder-title">پروتکل اختصاصی خود را بسازید (Dynamic Regimen Builder)</h3>
          <p className="regimen-builder-desc">
            حجم ژل کربوکسی، مدل پد فعال‌ساز و ژل‌های تسکین‌بخش بعد از عمل را متناسب با نیاز کلینیک یا هوم‌کر خود سفارشی کرده و از تخفیف پلکانی خودکار بهره‌مند شوید.
          </p>
        </div>

        {/* Step 1: Select Gel Volume */}
        <div className="regimen-step-block">
          <div className="step-label-row">
            <span className="step-num-circle">۱</span>
            <div>
              <h4 className="step-heading">انتخاب حجم ژل فعال‌ساز CarboxyGel</h4>
              <p className="step-subheading">پایه ژلی بی‌کربنات سدیم با خلوص بالا برای القای اثر بوهر</p>
            </div>
          </div>

          <div className="regimen-options-grid cols-3" role="radiogroup" aria-label="انتخاب حجم ژل">
            {DEFAULT_GEL_OPTIONS.map((gel) => {
              const isSelected = gel.id === selectedGelId;
              return (
                <button
                  key={gel.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedGelId(gel.id)}
                  className={`regimen-option-card ${isSelected ? 'is-selected' : ''}`}
                >
                  {gel.badge && <span className="option-top-badge">{gel.badge}</span>}
                  <div className="option-select-radio">
                    <span className={`radio-dot ${isSelected ? 'active' : ''}`} />
                    <strong className="option-volume">{gel.volume}</strong>
                  </div>
                  <h5 className="option-title">{gel.title}</h5>
                  <span className="option-sessions">{gel.sessions}</span>
                  <div className="option-pricing">
                    <span className="option-current-price">{formatToman(gel.priceAmount)}</span>
                    <span className="option-orig-price">{formatToman(gel.originalPriceAmount)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Activation Pod / Pad Variant */}
        <div className="regimen-step-block">
          <div className="step-label-row">
            <span className="step-num-circle">۲</span>
            <div>
              <h4 className="step-heading">انتخاب مدل پدهای فیبری فعال‌ساز (CarboxyPod / CarboxyPad)</h4>
              <p className="step-subheading">الیاف متخلخل گرید درماتولوژی حاوی کریستال‌های اسید سیتریک</p>
            </div>
          </div>

          <div className="regimen-options-grid cols-3" role="radiogroup" aria-label="انتخاب مدل پد">
            {DEFAULT_POD_OPTIONS.map((pod) => {
              const isSelected = pod.id === selectedPodId;
              return (
                <button
                  key={pod.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedPodId(pod.id)}
                  className={`regimen-option-card ${isSelected ? 'is-selected' : ''}`}
                >
                  {pod.isRecommended && (
                    <span className="option-top-badge rec">توصیه متخصصین</span>
                  )}
                  <div className="option-select-radio">
                    <span className={`radio-dot ${isSelected ? 'active' : ''}`} />
                    <strong className="option-volume">{pod.packSize}</strong>
                  </div>
                  <h5 className="option-title">{pod.title}</h5>
                  <p className="option-sessions">{pod.purposeFa}</p>
                  <div className="option-pricing">
                    <span className="option-current-price">{formatToman(pod.priceAmount)}</span>
                    <span className="option-orig-price">{formatToman(pod.originalPriceAmount)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Add-on Soothing & Priming Steps (Optional Multi-Select) */}
        <div className="regimen-step-block">
          <div className="step-label-row">
            <span className="step-num-circle">۳</span>
            <div>
              <h4 className="step-heading">افزودن محصولات ریکاوری و آماده‌سازی سد دفاعی</h4>
              <p className="step-subheading">افزودن هر مورد درصد تخفیف کل سبد رژیم را ۵٪ افزایش می‌دهد</p>
            </div>
          </div>

          <div className="regimen-addons-grid" role="group" aria-label="محصولات مکمل ریکاوری">
            {DEFAULT_RECOVERY_ADDONS.map((addon) => {
              const isChecked = !!selectedAddons[addon.id];
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`regimen-addon-card ${isChecked ? 'is-checked' : ''}`}
                >
                  <label className="addon-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Handled by card click
                      className="addon-real-checkbox"
                      aria-label={`افزودن ${addon.title}`}
                    />
                    <span className="addon-custom-check" aria-hidden="true" />
                  </label>

                  <div className="addon-content">
                    <div className="addon-head-row">
                      <h5 className="addon-title">{addon.title}</h5>
                      <span className="addon-vol-tag">{addon.volume}</span>
                    </div>
                    <p className="addon-role">{addon.roleFa}</p>
                    <div className="addon-price-row">
                      <strong className="addon-price">{formatToman(addon.priceAmount)}</strong>
                      <span className="addon-disc-tag">{addon.discountPercentage}٪ تخفیف مکمل</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer with Live Price & Instant Checkout */}
        <div className="regimen-summary-footer">
          <div className="regimen-summary-meta">
            <div className="regimen-selected-items-summary">
              <span className="items-count-badge">اقلام پکیج: {totalItemCount} کالا</span>
              <span className="items-list-preview">
                {selectedGel.volume} + {selectedPod.packSize}
                {activeAddonsList.length > 0 && ` + ${activeAddonsList.map((a) => a.title.split(' ')[0]).join(', ')}`}
              </span>
            </div>

            <div className="regimen-pricing-display">
              <div className="regimen-calc-line">
                <span className="calc-orig-label">قیمت اصلی قبل از تخفیف:</span>
                <del className="calc-orig-val">{formatToman(totalOriginalRials)}</del>
              </div>

              <div className="regimen-calc-final-row">
                <span className="calc-final-label">مبلغ پرداختی نهایی با {bundleDiscountPercent}٪ تخفیف پلکانی:</span>
                <strong className="calc-final-val">{formatToman(finalPriceRials)}</strong>
              </div>

              {totalCustomerSavings > 0n && (
                <div className="regimen-saving-pill">
                  <span>مجموع سود شما در این رژیم: </span>
                  <strong>{formatToman(totalCustomerSavings)}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="regimen-cta-box">
            <button
              type="button"
              onClick={handleAddCustomRegimen}
              className={`regimen-submit-btn ${bundleAdded ? 'btn-success' : ''}`}
            >
              {bundleAdded
                ? '✓ پکیج سفارشی به سبد خرید افزوده شد'
                : `افزودن کل پکیج سفارشی به سبد (${formatToman(finalPriceRials)})`}
            </button>

            {bundleAdded && (
              <div className="regimen-cart-quick-link">
                <Link href="/cart">مشاهده فاکتور و ادامه ثبت سفارش ←</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
