'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../../components/cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';
import {
  WISHLIST_CHANGED_EVENT,
  getWishlist,
  removeFromWishlist,
  addToWishlist,
  type WishlistItem,
} from '../../lib/wishlist';
import { RECOMMENDED_CLINICAL_PRODUCTS } from '../../lib/clinical-specs';
import { CompareButton } from '../../components/discovery/compare-button';

export default function WishlistPage() {
  const { addItem } = useCart();
  const { formatToman } = useLocalizedFormatter();
  const [items, setItems] = useState<WishlistItem[] | null>(null);
  const [transferredAll, setTransferredAll] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  if (items === null) {
    return (
      <section className="wishlist-page page-shell">
        <div className="state-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          در حال بارگذاری لیست علاقه‌مندی‌ها…
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="wishlist-page page-shell">
        <div className="state-panel search-empty-container">
          <div className="search-empty-icon" aria-hidden="true">♡</div>
          <h2>لیست علاقه‌مندی‌های شما خالی است</h2>
          <p>
            با زدن نشان ♥ بر روی هر کالا در کاتالوگ یا صفحه اختصاصی محصول، فرمولاسیون‌ها و کیت‌های درمانی مدنظرتان را
            برای خریدهای بعدی یا مشاوره‌های بالینی خود ذخیره نمایید.
          </p>
          <Link href="/search" className="btn-add-all" style={{ display: 'inline-block', margin: '0 auto 32px' }}>
            مشاهده کاتالوگ و محصولات
          </Link>

          {/* Quick Recommendations when empty */}
          <div className="empty-recommendations-section">
            <h3 className="empty-recommendations-title">
              <span aria-hidden="true">⭐</span>
              <span>پیشنهاد فرمولاسیون‌های محبوب کلینیکال جهت ذخیره</span>
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
                        onClick={() => {
                          addToWishlist({
                            variantId: rec.id,
                            productId: rec.id,
                            slug: rec.slug,
                            title: rec.title,
                            sku: rec.sku,
                            priceAmount: rec.priceAmount,
                          });
                          showToast(`«${rec.title.slice(0, 20)}…» به لیست علاقه‌مندی افزوده شد`);
                        }}
                      >
                        ♥ ذخیره در علاقه‌مندی
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

  const transferToCart = (item: WishlistItem) => {
    addItem({
      variantId: item.variantId,
      productId: item.productId,
      title: item.title,
      sku: item.sku,
      priceAmount: item.priceAmount,
    });
    removeFromWishlist(item.variantId);
    showToast(`«${item.title.slice(0, 25)}…» به سبد خرید منتقل گردید`);
  };

  const transferAllToCart = () => {
    for (const item of items) {
      addItem({
        variantId: item.variantId,
        productId: item.productId,
        title: item.title,
        sku: item.sku,
        priceAmount: item.priceAmount,
      });
      removeFromWishlist(item.variantId);
    }
    setTransferredAll(true);
    showToast('تمامی کالاها با موفقیت به سبد خرید منتقل شدند');
    setTimeout(() => setTransferredAll(false), 2000);
  };

  const handleQuickRemove = (item: WishlistItem) => {
    removeFromWishlist(item.variantId);
    showToast(`«${item.title.slice(0, 20)}…» از لیست حذف شد`);
  };

  return (
    <section className="wishlist-page page-shell">
      {/* Toast Notification */}
      {notification && (
        <div className="compare-toast" role="status" style={{ background: 'var(--brand-dark)', color: '#fff' }}>
          {notification}
        </div>
      )}

      {/* Header and Bulk Action Toolbar */}
      <div className="wishlist-actions-bar">
        <div>
          <div className="eyebrow">فهرست اختصاصی و فرمول‌های ذخیره‌شده</div>
          <h2 style={{ margin: '4px 0 0' }}>
            علاقه‌مندی‌ها ({new Intl.NumberFormat('fa-IR').format(items.length)} کالا)
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-transfer-all"
            onClick={transferAllToCart}
          >
            {transferredAll ? '✓ انتقال انجام شد' : 'انتقال همه به سبد خرید'}
          </button>

          <Link href="/search" className="btn-clear-filters" style={{ textDecoration: 'none' }}>
            + افزودن کالای جدید
          </Link>
        </div>
      </div>

      {/* Responsive Wishlist Grid with Instant Transfer and Quick Removal */}
      <div className="product-grid">
        {items.map((item) => {
          const href = `/products/${encodeURIComponent(item.slug)}`;
          const brandName = item.title.includes('ReeMed') || item.slug.includes('reemed')
            ? 'ReeMed Laboratories'
            : 'ReeSkin Clinical';

          return (
            <article className="product-card wishlist-card-enhanced" key={item.variantId}>
              {/* Quick Removal Top Corner Button */}
              <button
                type="button"
                className="wishlist-quick-remove"
                aria-label={`حذف ${item.title} از علاقه‌مندی‌ها`}
                title="حذف فوری از لیست"
                onClick={() => handleQuickRemove(item)}
              >
                ✕
              </button>

              <Link className="product-art" href={href} aria-label={`مشاهده ${item.title}`}>
                <span className="art-index">{item.title.slice(0, 1)}</span>
                <span className="art-caption">✓ موجود در انبار مرکزی</span>
              </Link>

              <div className="product-copy">
                <span className="product-card-brand">{brandName}</span>
                <h3>
                  <Link href={href}>{item.title}</Link>
                </h3>
                <p className="wishlist-sku">کد کالا (SKU): {item.sku || '—'}</p>

                <div className="product-bottom" style={{ flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong className="product-card-toman">{formatToman(item.priceAmount)}</strong>
                    <CompareButton
                      variantId={item.variantId}
                      productId={item.productId}
                      slug={item.slug}
                      title={item.title}
                      sku={item.sku}
                      priceAmount={item.priceAmount}
                      inStock={true}
                    />
                  </div>

                  {/* Primary CTA: Instant Transfer to Cart */}
                  <button
                    type="button"
                    className="wishlist-transfer-cta"
                    onClick={() => transferToCart(item)}
                  >
                    <span>🛒</span>
                    <span>انتقال به سبد خرید</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
