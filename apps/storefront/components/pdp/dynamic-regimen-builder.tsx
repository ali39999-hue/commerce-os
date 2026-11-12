'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import { listProducts, resolveProductImage, type Product } from '../../lib/catalog';

export interface TreatmentGelOption {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  volume: string;
  sessions: string;
  priceAmount: string;
  originalPriceAmount: string;
  badge?: string;
  image?: string;
}

export interface ActivationPodOption {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  packSize: string;
  purposeFa: string;
  priceAmount: string;
  originalPriceAmount: string;
  isRecommended?: boolean;
  image?: string;
}

export interface RecoveryAddonOption {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  volume: string;
  roleFa: string;
  priceAmount: string;
  originalPriceAmount: string;
  discountPercentage: number;
  image?: string;
}

interface GelDescriptor {
  sku: string;
  volume: string;
  sessions: string;
  badge?: string;
}

interface PodDescriptor {
  productSlug: string;
  sku: string;
  packSize: string;
  purposeFa: string;
  isRecommended?: boolean;
}

interface AddonDescriptor {
  productSlug: string;
  sku: string;
  volume: string;
  roleFa: string;
  discountPercentage: number;
}

const GEL_DESCRIPTORS: GelDescriptor[] = [
  {
    sku: 'CBG-PRO-500ML',
    volume: '500ml',
    sessions: '۲۰ جلسه کلینیکی کامل',
    badge: 'به‌صرفه‌ترین قیمت در هر جلسه',
  },
  {
    sku: 'CBG-HOME-5X',
    volume: '5x25ml',
    sessions: '۵ جلسه درمان کامل',
    badge: 'محبوب‌ترین انتخاب مراجعین',
  },
  {
    sku: 'CBG-TUBE-50ML',
    volume: '50ml',
    sessions: '۲ جلسه تست یا تمدید',
  },
];

const POD_DESCRIPTORS: PodDescriptor[] = [
  {
    productSlug: 'carboxypod',
    sku: 'RMD-CPD-005',
    packSize: '۵ عدد ساشه استریل',
    purposeFa: 'پدهای ارگونومیک با الیاف بارگذاری شده با اسید سیتریک میکروکپسوله',
    isRecommended: true,
  },
  {
    productSlug: 'carboxypad',
    sku: 'RMD-CPAD-NECK5',
    packSize: '۵ ست صورت و گردن',
    purposeFa: 'برش آناتومیک اختصاصی برای زاویه فک، غبغب و خطوط گردن',
  },
  {
    productSlug: 'carboxypod',
    sku: 'RMD-CPD-020',
    packSize: '۲۰ ساشه سالنی',
    purposeFa: 'تأمین سالنی ویژه پزشکان و اسکین‌تراپیست‌ها با بالاترین تخفیف',
  },
];

const ADDON_DESCRIPTORS: AddonDescriptor[] = [
  {
    productSlug: 'healene',
    sku: 'DD-HEA-250ML',
    volume: '250ml پمپی',
    roleFa: 'رفع آنی قرمزی و ترمیم سد دفاعی پوست با پانتنول و ۷ عصاره سیکا',
    discountPercentage: 15,
  },
  {
    productSlug: 'crystalene',
    sku: 'DD-CRY-200ML',
    volume: '200ml تیوب',
    roleFa: 'آماده‌سازی پوست و حذف سلول‌های کدر پیش از کربوکسی با میکروآلومینا',
    discountPercentage: 15,
  },
];

export function DynamicRegimenBuilder({
  catalogProducts,
}: {
  catalogProducts?: Product[];
}) {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [products, setProducts] = useState<Product[]>(catalogProducts ?? []);
  const [loading, setLoading] = useState(!catalogProducts);

  useEffect(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      setProducts(catalogProducts);
      setLoading(false);
      return;
    }
    let mounted = true;
    listProducts({ limit: 100 })
      .then((res) => {
        if (mounted && res?.data) {
          setProducts(res.data);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [catalogProducts]);

  const { gelOptions, podOptions, recoveryAddons } = useMemo(() => {
    const gelProd = products.find((p) => p.slug === 'carboxygel');
    const gels: TreatmentGelOption[] = gelProd
      ? GEL_DESCRIPTORS.map((desc): TreatmentGelOption | null => {
          const variant = gelProd.variants.find((v) => v.sku === desc.sku);
          if (!variant) return null;
          return {
            productId: gelProd.id,
            variantId: variant.id,
            sku: variant.sku,
            title: variant.title || gelProd.title,
            volume: desc.volume,
            sessions: desc.sessions,
            priceAmount: variant.priceAmount,
            originalPriceAmount: variant.originalPriceAmount || variant.priceAmount,
            badge: desc.badge,
            image: resolveProductImage(gelProd),
          };
        }).filter((g): g is TreatmentGelOption => g !== null)
      : [];

    const pods: ActivationPodOption[] = POD_DESCRIPTORS.map((desc): ActivationPodOption | null => {
      const prod = products.find((p) => p.slug === desc.productSlug);
      const variant = prod?.variants.find((v) => v.sku === desc.sku);
      if (!prod || !variant) return null;
      return {
        productId: prod.id,
        variantId: variant.id,
        sku: variant.sku,
        title: `${prod.title} (${variant.title})`,
        packSize: desc.packSize,
        purposeFa: desc.purposeFa,
        priceAmount: variant.priceAmount,
        originalPriceAmount: variant.originalPriceAmount || variant.priceAmount,
        isRecommended: desc.isRecommended,
        image: resolveProductImage(prod),
      };
    }).filter((p): p is ActivationPodOption => p !== null);

    const addons: RecoveryAddonOption[] = ADDON_DESCRIPTORS.map((desc): RecoveryAddonOption | null => {
      const prod = products.find((p) => p.slug === desc.productSlug);
      const variant = prod?.variants.find((v) => v.sku === desc.sku);
      if (!prod || !variant) return null;
      return {
        productId: prod.id,
        variantId: variant.id,
        sku: variant.sku,
        title: prod.title,
        volume: desc.volume,
        roleFa: desc.roleFa,
        priceAmount: variant.priceAmount,
        originalPriceAmount: variant.originalPriceAmount || variant.priceAmount,
        discountPercentage: variant.discountPercent || desc.discountPercentage,
        image: resolveProductImage(prod),
      };
    }).filter((a): a is RecoveryAddonOption => a !== null);

    return { gelOptions: gels, podOptions: pods, recoveryAddons: addons };
  }, [products]);

  const [selectedGelSku, setSelectedGelSku] = useState<string>('CBG-HOME-5X');
  const [selectedPodSku, setSelectedPodSku] = useState<string>('RMD-CPD-005');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    'DD-HEA-250ML': true,
  });
  const [bundleAdded, setBundleAdded] = useState(false);

  const selectedGel =
    gelOptions.find((g) => g.sku === selectedGelSku) || gelOptions[0];
  const selectedPod =
    podOptions.find((p) => p.sku === selectedPodSku) || podOptions[0];
  const activeAddonsList = recoveryAddons.filter((a) => selectedAddons[a.sku]);

  if (loading || !selectedGel || !selectedPod) {
    return null;
  }

  const toggleAddon = (sku: string) => {
    setSelectedAddons((prev) => ({ ...prev, [sku]: !prev[sku] }));
  };

  const gelPrice = BigInt(selectedGel.priceAmount);
  const podPrice = BigInt(selectedPod.priceAmount);
  const addonsPrice = activeAddonsList.reduce(
    (sum, a) => sum + BigInt(a.priceAmount),
    0n
  );

  const subtotalRials = gelPrice + podPrice + addonsPrice;
  const totalItemCount = 2 + activeAddonsList.length;
  let bundleDiscountPercent = 10;
  if (totalItemCount === 3) bundleDiscountPercent = 15;
  if (totalItemCount >= 4) bundleDiscountPercent = 20;

  const bundleDiscountAmount = (subtotalRials * BigInt(bundleDiscountPercent)) / 100n;
  const finalPriceRials = subtotalRials - bundleDiscountAmount;

  const originalGel = BigInt(selectedGel.originalPriceAmount);
  const originalPod = BigInt(selectedPod.originalPriceAmount);
  const originalAddons = activeAddonsList.reduce(
    (sum, a) => sum + BigInt(a.originalPriceAmount),
    0n
  );
  const totalOriginalRials = originalGel + originalPod + originalAddons;
  const totalCustomerSavings =
    totalOriginalRials > finalPriceRials ? totalOriginalRials - finalPriceRials : 0n;

  const handleAddCustomRegimen = () => {
    addItem({
      variantId: selectedGel.variantId,
      productId: selectedGel.productId,
      title: selectedGel.title,
      sku: selectedGel.sku,
      priceAmount: selectedGel.priceAmount,
      image: selectedGel.image,
    });

    addItem({
      variantId: selectedPod.variantId,
      productId: selectedPod.productId,
      title: selectedPod.title,
      sku: selectedPod.sku,
      priceAmount: selectedPod.priceAmount,
      image: selectedPod.image,
    });

    activeAddonsList.forEach((addon) => {
      addItem({
        variantId: addon.variantId,
        productId: addon.productId,
        title: addon.title,
        sku: addon.sku,
        priceAmount: addon.priceAmount,
        image: addon.image,
      });
    });

    setBundleAdded(true);
    openDrawer();
    setTimeout(() => setBundleAdded(false), 2800);
  };

  return (
    <section className="regimen-builder-root" aria-label="باندل‌ساز پویا و شخصی‌سازی پروتکل">
      <div className="regimen-builder-card">
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

        <div className="regimen-step-block">
          <div className="step-label-row">
            <span className="step-num-circle">۱</span>
            <div>
              <h4 className="step-heading">انتخاب حجم ژل فعال‌ساز CarboxyGel</h4>
              <p className="step-subheading">پایه ژلی بی‌کربنات سدیم با خلوص بالا برای القای اثر بوهر</p>
            </div>
          </div>

          <div className="regimen-options-grid cols-3" role="radiogroup" aria-label="انتخاب حجم ژل">
            {gelOptions.map((gel) => {
              const isSelected = gel.sku === selectedGel.sku;
              return (
                <button
                  key={gel.variantId}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedGelSku(gel.sku)}
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
                    {gel.originalPriceAmount !== gel.priceAmount && (
                      <span className="option-orig-price">{formatToman(gel.originalPriceAmount)}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="regimen-step-block">
          <div className="step-label-row">
            <span className="step-num-circle">۲</span>
            <div>
              <h4 className="step-heading">انتخاب مدل پدهای فیبری فعال‌ساز (CarboxyPod / CarboxyPad)</h4>
              <p className="step-subheading">الیاف متخلخل گرید درماتولوژی حاوی کریستال‌های اسید سیتریک</p>
            </div>
          </div>

          <div className="regimen-options-grid cols-3" role="radiogroup" aria-label="انتخاب مدل پد">
            {podOptions.map((pod) => {
              const isSelected = pod.sku === selectedPod.sku;
              return (
                <button
                  key={pod.variantId}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedPodSku(pod.sku)}
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
                    {pod.originalPriceAmount !== pod.priceAmount && (
                      <span className="option-orig-price">{formatToman(pod.originalPriceAmount)}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {recoveryAddons.length > 0 && (
          <div className="regimen-step-block">
            <div className="step-label-row">
              <span className="step-num-circle">۳</span>
              <div>
                <h4 className="step-heading">افزودن محصولات ریکاوری و آماده‌سازی سد دفاعی</h4>
                <p className="step-subheading">افزودن هر مورد درصد تخفیف کل سبد رژیم را ۵٪ افزایش می‌دهد</p>
              </div>
            </div>

            <div className="regimen-addons-grid" role="group" aria-label="محصولات مکمل ریکاوری">
              {recoveryAddons.map((addon) => {
                const isChecked = !!selectedAddons[addon.sku];
                return (
                  <div
                    key={addon.variantId}
                    onClick={() => toggleAddon(addon.sku)}
                    className={`regimen-addon-card ${isChecked ? 'is-checked' : ''}`}
                  >
                    <label className="addon-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
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
        )}

        <div className="regimen-summary-footer">
          <div className="regimen-summary-meta">
            <div className="regimen-selected-items-summary">
              <span className="items-count-badge">اقلام پکیج: {totalItemCount} کالا</span>
              <span className="items-list-preview">
                {selectedGel.volume} + {selectedPod.packSize}
                {activeAddonsList.length > 0 &&
                  ` + ${activeAddonsList.map((a) => a.title.split(' ')[0]).join('، ')}`}
              </span>
            </div>

            <div className="regimen-pricing-display">
              <div className="regimen-calc-line">
                <span className="calc-orig-label">قیمت اصلی قبل از تخفیف:</span>
                <del className="calc-orig-val">{formatToman(totalOriginalRials)}</del>
              </div>

              <div className="regimen-calc-final-row">
                <span className="calc-final-label">
                  مبلغ پرداختی نهایی با {bundleDiscountPercent}٪ تخفیف پلکانی:
                </span>
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
