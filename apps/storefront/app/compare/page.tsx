'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../../components/cart';
import { formatToman } from '../../lib/catalog';
import {
  COMPARE_CHANGED_EVENT,
  getCompare,
  removeFromCompare,
  type CompareItem,
} from '../../lib/compare';

export default function ComparePage() {
  const { addItem } = useCart();
  const [items, setItems] = useState<CompareItem[] | null>(null);
  const [addedAll, setAddedAll] = useState(false);

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

  if (items === null) {
    return <div className="state-panel">در حال بارگذاری جدول مقایسه…</div>;
  }

  if (items.length === 0) {
    return (
      <section className="compare-page">
        <div className="state-panel">
          <h2>چیزی برای مقایسه انتخاب نشده است</h2>
          <p>روی نشان ⇄ کارت هر کالا بزنید تا حداکثر ۴ کالا را کنار هم ببینید.</p>
          <Link href="/#catalog" className="primary-link">
            مشاهده کالاها و شروع مقایسه
          </Link>
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
    setTimeout(() => setAddedAll(false), 1800);
  };

  return (
    <section className="compare-page">
      <div className="section-head compare-head">
        <div>
          <div className="eyebrow">کنار هم بگذارید و انتخاب کنید</div>
          <h2>مقایسه کالاها</h2>
        </div>
        <button
          type="button"
          className={`btn-add-all${addedAll ? ' added' : ''}`}
          onClick={addAllToCart}
          disabled={inStockItems.length === 0}
        >
          {addedAll ? '✓ به سبد افزوده شد' : 'افزودن همه به سبد'}
        </button>
      </div>

      <div className="compare-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">کالا</th>
              {items.map((item) => (
                <th scope="col" key={item.variantId}>
                  <Link href={`/products/${encodeURIComponent(item.slug)}`}>{item.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">تصویر / حرف</th>
              {items.map((item) => (
                <td key={item.variantId}>
                  <div className="compare-art" aria-hidden="true">
                    {item.title.slice(0, 1)}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">عنوان</th>
              {items.map((item) => (
                <td key={item.variantId}>
                  <Link className="compare-title-link" href={`/products/${encodeURIComponent(item.slug)}`}>
                    {item.title}
                  </Link>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">قیمت</th>
              {items.map((item) => (
                <td key={item.variantId}>
                  <strong>{formatToman(item.priceAmount)}</strong>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">موجودی</th>
              {items.map((item) => (
                <td key={item.variantId}>
                  {item.inStock ? (
                    <span className="status-pill delivered">موجود</span>
                  ) : (
                    <span className="status-pill cancelled">ناموجود</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">دسته</th>
              {items.map((item) => (
                <td key={item.variantId}>{item.categoryTitleFa ?? '—'}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">SKU</th>
              {items.map((item) => (
                <td key={item.variantId}>
                  <span className="sku-tag">{item.sku || '—'}</span>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">حذف</th>
              {items.map((item) => (
                <td key={item.variantId}>
                  <button
                    type="button"
                    className="btn-remove compare-remove"
                    aria-label={`حذف ${item.title} از مقایسه`}
                    title="حذف از مقایسه"
                    onClick={() => removeFromCompare(item.variantId)}
                  >
                    ✕
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {inStockItems.length === 0 && (
        <p className="compare-note">
          هیچ‌کدام از کالاهای مقایسه‌شده موجود نیستند؛ افزودن به سبد فقط برای کالاهای موجود امکان‌پذیر است.
        </p>
      )}
    </section>
  );
}
