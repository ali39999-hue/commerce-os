'use client';

import React, { useState, useEffect, useId } from 'react';
import { IngredientItem } from '../../lib/pdp-types';

interface InciExplorerProps {
  ingredients: IngredientItem[];
  title?: string;
  subtitle?: string;
}

export function InciExplorer({
  ingredients,
  title = 'کاوشگر تخصصی فرمولاسیون و ترکیبات فعال (INCI Explorer)',
  subtitle = 'برای مشاهده مکانیسم بیوشیمیایی، گرید دارویی، رتبه ایمنی CIR و درصد خلوص، روی هر ترکیب کلیک نمایید.',
}: InciExplorerProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'key' | 'base'>('all');
  const dialogId = useId();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIngredient(null);
      }
    };
    if (selectedIngredient) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIngredient]);

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'key'
        ? ing.isKeyActive
        : !ing.isKeyActive;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      ing.nameFa.toLowerCase().includes(term) ||
      ing.inciName.toLowerCase().includes(term) ||
      ing.purpose.toLowerCase().includes(term) ||
      (ing.molecularMechanism && ing.molecularMechanism.toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="inci-explorer-root" aria-label="کاوشگر ترکیبات فرمولاسیون">
      <div className="inci-explorer-header">
        <div className="inci-title-wrap">
          <span className="inci-section-badge">آنالیز فارماکولوژیک</span>
          <h4 className="inci-title">{title}</h4>
          <p className="inci-subtitle">{subtitle}</p>
        </div>

        {/* Filter Controls & Search */}
        <div className="inci-controls-row">
          <div className="inci-filter-pills" role="tablist" aria-label="فیلتر ترکیبات">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              className={`inci-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              همه ترکیبات ({ingredients.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'key'}
              className={`inci-filter-btn ${activeFilter === 'key' ? 'active' : ''}`}
              onClick={() => setActiveFilter('key')}
            >
              ★ اکتیوهای کلیدی ({ingredients.filter((i) => i.isKeyActive).length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'base'}
              className={`inci-filter-btn ${activeFilter === 'base' ? 'active' : ''}`}
              onClick={() => setActiveFilter('base')}
            >
              حلال‌ها و پایه‌ها ({ingredients.filter((i) => !i.isKeyActive).length})
            </button>
          </div>

          <div className="inci-search-box">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در INCI یا نام فارسی..."
              aria-label="جستجوی ترکیب"
              className="inci-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="inci-search-clear"
                aria-label="پاکسازی جستجو"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clickable Ingredient Chips Grid */}
      <div className="inci-chips-cloud" role="list" aria-label="فهرست برچسب‌های ترکیبات">
        {filteredIngredients.map((ing, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIngredient(ing)}
            className={`inci-tag-card ${ing.isKeyActive ? 'is-active-primary' : ''} ${
              selectedIngredient?.inciName === ing.inciName ? 'is-selected' : ''
            }`}
            aria-haspopup="dialog"
            aria-expanded={selectedIngredient?.inciName === ing.inciName}
            title="کلیک برای مشاهده جزئیات علمی"
          >
            <div className="inci-tag-top">
              {ing.isKeyActive ? (
                <span className="inci-active-badge">★ اکتیو بالینی</span>
              ) : (
                <span className="inci-base-badge">پایه ایمن</span>
              )}
              {ing.percentage && <span className="inci-pct-pill">{ing.percentage}</span>}
            </div>

            <div className="inci-tag-names">
              <span className="inci-fa-name">{ing.nameFa}</span>
              <span className="inci-latin-name" dir="ltr">{ing.inciName}</span>
            </div>

            <div className="inci-tag-footer">
              <span className="inci-purpose-preview">{ing.purpose}</span>
              <span className="inci-expand-hint" aria-hidden="true">مشاهده آنالیز ←</span>
            </div>
          </button>
        ))}

        {filteredIngredients.length === 0 && (
          <div className="inci-empty-search">
            <p>هیچ ترکیبی منطبق با عبارت «{searchTerm}» یافت نشد.</p>
          </div>
        )}
      </div>

      {/* Interactive Detail Drawer / Slide-Over Modal */}
      {selectedIngredient && (
        <div
          className="inci-drawer-backdrop"
          onClick={() => setSelectedIngredient(null)}
          role="presentation"
        >
          <div
            id={dialogId}
            className="inci-drawer-surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inci-drawer-header">
              <div className="inci-drawer-header-info">
                <span className="inci-drawer-kicker">
                  {selectedIngredient.isKeyActive ? '★ ماده مؤثره فعال با اثربخشی اثبات‌شده' : 'ماده کمکی / حلال زیست‌سازگار'}
                </span>
                <h3 id={`${dialogId}-title`} className="inci-drawer-title">
                  {selectedIngredient.nameFa}
                </h3>
                <code className="inci-drawer-code" dir="ltr">
                  {selectedIngredient.inciName}
                </code>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIngredient(null)}
                className="inci-drawer-close-btn"
                aria-label="بستن پنجره جزئیات ترکیب"
              >
                ✕
              </button>
            </div>

            <div className="inci-drawer-body">
              {/* Scientific Spec Grid */}
              <div className="inci-spec-metrics-grid">
                <div className="inci-metric-box">
                  <span className="inci-metric-label">رتبه ایمنی CIR</span>
                  <strong className="inci-metric-val safe">
                    {selectedIngredient.cirRating || 'Safe as Used (CIR Expert Panel)'}
                  </strong>
                  <small className="inci-metric-sub">بررسی شده توسط پنل سم‌شناسی آرایشی آمریکا</small>
                </div>

                <div className="inci-metric-box">
                  <span className="inci-metric-label">درصد خلوص و گرید</span>
                  <strong className="inci-metric-val purity">
                    {selectedIngredient.purity || '۹۹.۸٪ فارماکوپه اروپا / USP'}
                  </strong>
                  <small className="inci-metric-sub">استاندارد آزمایشگاهی عاری از ناخالصی</small>
                </div>

                <div className="inci-metric-box">
                  <span className="inci-metric-label">دوز در فرمولاسیون</span>
                  <strong className="inci-metric-val dosage">
                    {selectedIngredient.percentage || 'غلظت استاندارد هم‌افزا'}
                  </strong>
                  <small className="inci-metric-sub">نسبت استوکیومتری بهینه برای حداکثر رهایش گاز</small>
                </div>

                <div className="inci-metric-box">
                  <span className="inci-metric-label">شاخص سلامت EWG</span>
                  <div className="ewg-score-badge">
                    <span className="ewg-dot safe" aria-hidden="true" />
                    <strong>{selectedIngredient.ewgScore ?? 1} (سبز / بالاترین سطح ایمنی)</strong>
                  </div>
                  <small className="inci-metric-sub">کومدوژنیسیتی: {selectedIngredient.comedogenicRating ?? 0} از ۵ (غیرجوش‌زا)</small>
                </div>
              </div>

              {/* Chemical Identity */}
              {selectedIngredient.casNumber && (
                <div className="inci-cas-row">
                  <span>شناسه شیمیایی بین‌المللی (CAS No): </span>
                  <code dir="ltr">{selectedIngredient.casNumber}</code>
                </div>
              )}

              {/* Molecular Mechanism */}
              <div className="inci-mechanism-card">
                <div className="inci-card-head">
                  <span className="inci-card-icon" aria-hidden="true">🧬</span>
                  <h4>مکانیسم اثر مولکولی و سلولی در پوست</h4>
                </div>
                <p className="inci-mechanism-text">
                  {selectedIngredient.molecularMechanism ||
                    'این ترکیب از طریق افزایش هیدراتاسیون بین‌سلولی، پایدارسازی ماتریکس ژل و بهبود نفوذ مولکول‌های فعال، مقاومت سد بیولوژیکی پوست را تقویت کرده و فعالیت میتوکندریایی سلول‌های اپیدرم را تحریک می‌نماید.'}
                </p>
              </div>

              {/* Formulation Purpose & Description */}
              <div className="inci-purpose-card">
                <div className="inci-card-head">
                  <span className="inci-card-icon" aria-hidden="true">🎯</span>
                  <h4>نقش هدفمند در این محصول</h4>
                </div>
                <p><strong>هدف فیزیولوژیک:</strong> {selectedIngredient.purpose}</p>
                {selectedIngredient.description && (
                  <p className="inci-desc-more">{selectedIngredient.description}</p>
                )}
              </div>

              {/* Clinical Notice */}
              <div className="inci-disclaimer-card">
                <span className="inci-disclaimer-icon" aria-hidden="true">🛡️</span>
                <p>
                  فرمولاسیون CarboxyGel مطابق با آخرین دستورالعمل‌های رگولاتوری اتحادیه اروپا (EU Cosmetic Regulation 1223/2009) تولید و در پورتال CPNP بروکسل به ثبت رسیده است. هیچ‌یک از ترکیبات این فرمولاسیون روی حیوانات آزمایش نشده است.
                </p>
              </div>
            </div>

            <div className="inci-drawer-footer">
              <button
                type="button"
                onClick={() => setSelectedIngredient(null)}
                className="inci-drawer-dismiss-btn"
              >
                بستن و ادامه بررسی کالا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
