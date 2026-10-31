'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useCart } from '../../components/cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import {
  COMPARE_CHANGED_EVENT,
  getCompare,
  removeFromCompare,
  addToCompare,
  type CompareItem,
} from '../../lib/compare';
import {
  getClinicalSpecs,
  RECOMMENDED_CLINICAL_PRODUCTS,
} from '../../lib/clinical-specs';

export default function ComparePage() {
  const { addItem } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [items, setItems] = useState<CompareItem[] | null>(null);
  const [addedAll, setAddedAll] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  useEffect(() => {
    const sync = () => setItems(getCompare());
    sync();
    window.addEventListener(COMPARE_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(COMPARE_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const itemsSpecs = useMemo(() => {
    if (!items) return [];
    return items.map((it) => ({
      ...it,
      specs: getClinicalSpecs(it),
    }));
  }, [items]);

  if (items === null) {
    return (
      <section className="compare-page page-shell">
        <div className="state-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          در حال بارگذاری جدول مقایسه بالینی…
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="compare-page page-shell">
        <div className="state-panel search-empty-container">
          <div className="search-empty-icon" aria-hidden="true">⇄</div>
          <h2>کالایی برای مقایسه انتخاب نشده است</h2>
          <p>
            با زدن دکمه ⇄ در کارت هر محصول، حداکثر ۴ کالا را در ماتریس تطبیقی بالینی کنار هم بگذارید
            و از نظر حجم، ترکیبات فعال، کارکرد بالینی، گواهینامه‌ها و قیمت ارزیابی فرمایید.
          </p>
          <Link href="/search" className="btn-add-all" style={{ display: 'inline-block', margin: '0 auto 32px' }}>
            جست‌وجو و انتخاب محصولات
          </Link>

          <div className="empty-recommendations-section">
            <h3 className="empty-recommendations-title">
              <span aria-hidden="true">🔬</span>
              <span>پیشنهاد مقایسه سریع محصولات پرطرفدار</span>
            </h3>
            <div className="empty-recommendations-grid">
              {RECOMMENDED_CLINICAL_PRODUCTS.slice(0, 3).map((rec) => (
                <article className="product-card" key={rec.id}>
                  <Link className="product-art" href={`/products/${encodeURIComponent(rec.slug)}`}>
                    <span className="art-index">{rec.title.slice(0, 1)}</span>
                    <span className="art-caption">✓ موجود در انبار</span>
                  </Link>
                  <div className="product-copy">
                    <span className="product-card-brand">{rec.brand}</span>
                    <h4 style={{ margin: '4px 0 8px', fontSize: '0.92rem' }}>
                      <Link href={`/products/${encodeURIComponent(rec.slug)}`}>{rec.title}</Link>
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{rec.description}</p>
                    <div className="product-bottom">
                      <strong className="product-card-toman">{formatToman(rec.priceAmount)}</strong>
                      <button
                        type="button"
                        className="btn-transfer"
                        onClick={() =>
                          addToCompare({
                            variantId: rec.id,
                            productId: rec.id,
                            slug: rec.slug,
                            title: rec.title,
                            sku: rec.sku,
                            priceAmount: rec.priceAmount,
                            inStock: rec.inStock,
                            categoryTitleFa: rec.categoryTitleFa,
                          })
                        }
                      >
                        + افزودن به مقایسه
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const inStockItems = items.filter((item) => item.inStock);

  const addAllToCart = () => {
    for (const item of inStockItems) {
      addItem({
        variantId: item.variantId,
        productId: item.productId,
        title: item.title,
        sku: item.sku,
        priceAmount: item.priceAmount,
      });
    }
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  const handleAddSingleToCart = (item: CompareItem) => {
    addItem({
      variantId: item.variantId,
      productId: item.productId,
      title: item.title,
      sku: item.sku,
      priceAmount: item.priceAmount,
    });
    setAddedItemMap((prev) => ({ ...prev, [item.variantId]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [item.variantId]: false }));
    }, 1800);
  };

  // Check if properties differ between items
  const brandsDiffer = new Set(itemsSpecs.map((i) => i.specs.brand)).size > 1;
  const volumesDiffer = new Set(itemsSpecs.map((i) => i.specs.volume)).size > 1;
  const pricesDiffer = new Set(itemsSpecs.map((i) => i.priceAmount)).size > 1;

  return (
    <section className="compare-page page-shell">
      {/* Page Header and Controls */}
      <div className="section-head compare-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow">ماتریس تحلیل و ارزیابی درموسوتیکال</div>
          <h2>مقایسه تخصصی کالاها ({new Intl.NumberFormat('fa-IR').format(items.length)} از ۴)</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label className="filter-option" style={{ fontSize: '0.84rem', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
            />
            برجسته‌سازی تفاوت‌ها
          </label>

          <button
            type="button"
            className={`btn-add-all${addedAll ? ' added' : ''}`}
            onClick={addAllToCart}
            disabled={inStockItems.length === 0}
          >
            {addedAll ? '✓ همه افزوده شدند' : 'افزودن همه موجودها به سبد'}
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="compare-matrix-card">
        <table className="compare-matrix-table" aria-label="جدول تطبیقی مشخصات بالینی محصولات">
          <thead>
            <tr>
              <th scope="col">مشخصات بالینی</th>
              {itemsSpecs.map((item) => (
                <th scope="col" key={item.variantId} style={{ minWidth: '220px' }}>
                  <div className="compare-item-header-box">
                    <span className="compare-brand-tag">{item.specs.brand}</span>
                    <Link
                      className="compare-header-title"
                      href={`/products/${encodeURIComponent(item.slug)}`}
                    >
                      {item.title}
                    </Link>
                    <button
                      type="button"
                      className="btn-remove compare-remove"
                      aria-label={`حذف ${item.title} از مقایسه`}
                      title="حذف از جدول مقایسه"
                      onClick={() => removeFromCompare(item.variantId)}
                      style={{ marginTop: '4px' }}
                    >
                      ✕ حذف
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Visual Art / First letter */}
            <tr>
              <th scope="row" className="compare-feature-label">تصویر شاخص</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <Link
                    href={`/products/${encodeURIComponent(item.slug)}`}
                    className="compare-art"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    {item.title.slice(0, 1)}
                  </Link>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className={highlightDifferences && pricesDiffer ? 'compare-highlight-cell' : ''}>
              <th scope="row" className="compare-feature-label">قیمت (تومان)</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <strong style={{ fontSize: '1.15rem', color: 'var(--brand-deep)' }}>
                    {formatToman(item.priceAmount)}
                  </strong>
                </td>
              ))}
            </tr>

            {/* Inventory Status */}
            <tr>
              <th scope="row" className="compare-feature-label">وضعیت انبار</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  {item.inStock ? (
                    <span className="status-pill delivered">✓ موجود در انبار مرکزی</span>
                  ) : (
                    <span className="status-pill cancelled">ناموجود (در انتظار شارژ)</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Volume / Size */}
            <tr className={highlightDifferences && volumesDiffer ? 'compare-highlight-cell' : ''}>
              <th scope="row" className="compare-feature-label">حجم و بسته‌بندی</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <span className="compare-mini-badge clinical">{item.specs.volume}</span>
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr className={highlightDifferences && brandsDiffer ? 'compare-highlight-cell' : ''}>
              <th scope="row" className="compare-feature-label">برند و مبدأ</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <strong>{item.specs.brand}</strong>
                </td>
              ))}
            </tr>

            {/* Active Ingredients */}
            <tr>
              <th scope="row" className="compare-feature-label">ترکیبات فعال کلیدی</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <div className="compare-tags-wrap">
                    {item.specs.activeIngredients.map((ing, idx) => (
                      <span key={idx} className="compare-mini-badge">
                        {ing}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Clinical Function */}
            <tr>
              <th scope="row" className="compare-feature-label">کارکرد بالینی</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell" style={{ fontSize: '0.86rem' }}>
                  {item.specs.clinicalFunction}
                </td>
              ))}
            </tr>

            {/* Certifications & Badges */}
            <tr>
              <th scope="row" className="compare-feature-label">گواهینامه‌ها و استانداردها</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <div className="compare-tags-wrap">
                    {item.specs.certifications.map((cert, idx) => (
                      <span key={idx} className="compare-mini-badge clinical">
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* SKU */}
            <tr>
              <th scope="row" className="compare-feature-label">کد بین‌المللی کالا (SKU)</th>
              {itemsSpecs.map((item) => (
                <td key={item.variantId} className="compare-val-cell">
                  <span className="sku-tag">{item.sku || '—'}</span>
                </td>
              ))}
            </tr>

            {/* Actions: Add to Cart */}
            <tr>
              <th scope="row" className="compare-feature-label">اقدام سریع</th>
              {itemsSpecs.map((item) => {
                const isAdded = addedItemMap[item.variantId];
                return (
                  <td key={item.variantId} className="compare-val-cell">
                    <button
                      type="button"
                      className="btn-transfer"
                      disabled={!item.inStock}
                      style={{
                        width: '100%',
                        background: isAdded ? 'var(--success)' : undefined,
                        color: isAdded ? '#fff' : undefined,
                        borderColor: isAdded ? 'var(--success)' : undefined,
                      }}
                      onClick={() => handleAddSingleToCart(item)}
                    >
                      {isAdded ? '✓ به سبد اضافه شد' : item.inStock ? 'انتقال به سبد خرید' : 'ناموجود'}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* When fewer than 4 items, show quick additions from recommendations */}
      {items.length < 4 && (
        <div style={{ marginTop: '24px', background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '1rem', color: 'var(--brand-deep)' }}>
            افزودن محصولات مکمل جهت تکمیل مقایسه ۴تایی:
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {RECOMMENDED_CLINICAL_PRODUCTS.filter((r) => !items.some((i) => i.slug === r.slug)).map((rec) => (
              <button
                key={rec.id}
                type="button"
                className="btn-transfer"
                onClick={() =>
                  addToCompare({
                    variantId: rec.id,
                    productId: rec.id,
                    slug: rec.slug,
                    title: rec.title,
                    sku: rec.sku,
                    priceAmount: rec.priceAmount,
                    inStock: rec.inStock,
                    categoryTitleFa: rec.categoryTitleFa,
                  })
                }
              >
                + {rec.title.split(' ')[0]} ({rec.brand})
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
