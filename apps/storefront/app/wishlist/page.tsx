'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../../components/cart';
import { formatToman } from '../../lib/catalog';
import {
  WISHLIST_CHANGED_EVENT,
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from '../../lib/wishlist';

export default function WishlistPage() {
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[] | null>(null);

  useEffect(() => {
    const sync = () => setItems(getWishlist());
    sync();
    window.addEventListener(WISHLIST_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (items === null) {
    return <div className="state-panel">در حال بارگذاری علاقه‌مندی‌ها…</div>;
  }

  if (items.length === 0) {
    return (
      <section className="wishlist-page">
        <div className="state-panel">
          <h2>لیست علاقه‌مندی‌های شما خالی است</h2>
          <p>با زدن نشان ♥ روی کارت هر کالا، آن را برای بعد ذخیره کنید.</p>
          <Link href="/#catalog" className="primary-link">
            بازگشت به فروشگاه و مشاهده کالاها
          </Link>
        </div>
      </section>
    );
  }

  const transferToCart = (item: WishlistItem) => {
    addItem({
      variantId: item.variantId,
      productId: item.productId,
      title: item.title,
      sku: item.sku,
      priceAmount: item.priceAmount,
    });
    removeFromWishlist(item.variantId);
  };

  return (
    <section className="wishlist-page">
      <div className="section-head">
        <div>
          <div className="eyebrow">فهرست شخصی شما</div>
          <h2>علاقه‌مندی‌ها</h2>
        </div>
        <span className="count-label">
          {new Intl.NumberFormat('fa-IR').format(items.length)} کالا
        </span>
      </div>

      <div className="product-grid">
        {items.map((item) => {
          const href = `/products/${encodeURIComponent(item.slug)}`;
          return (
            <article className="product-card" key={item.variantId}>
              <Link className="product-art" href={href} aria-label={`مشاهده ${item.title}`}>
                <span className="art-index">{item.title.slice(0, 1)}</span>
              </Link>
              <div className="product-copy">
                <h3>
                  <Link href={href}>{item.title}</Link>
                </h3>
                <p className="wishlist-sku">کد کالا: {item.sku || '—'}</p>
                <div className="product-bottom">
                  <strong>{formatToman(item.priceAmount)}</strong>
                  <div className="rail-actions">
                    <button type="button" className="btn-transfer" onClick={() => transferToCart(item)}>
                      انتقال به سبد
                    </button>
                    <button
                      type="button"
                      className="btn-remove"
                      aria-label={`حذف ${item.title} از علاقه‌مندی‌ها`}
                      title="حذف از علاقه‌مندی‌ها"
                      onClick={() => removeFromWishlist(item.variantId)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
