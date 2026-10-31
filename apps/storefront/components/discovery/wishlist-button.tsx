'use client';

import { useEffect, useState } from 'react';
import { WISHLIST_CHANGED_EVENT, isWishlisted, toggleWishlist } from '../../lib/wishlist';

export function WishlistButton(props: {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  sku: string;
  priceAmount: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(isWishlisted(props.variantId));
    sync();
    window.addEventListener(WISHLIST_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [props.variantId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const result = toggleWishlist({
      variantId: props.variantId,
      productId: props.productId,
      slug: props.slug,
      title: props.title,
      sku: props.sku,
      priceAmount: props.priceAmount,
    });
    if (result.ok) setActive(result.active);
  };

  return (
    <button
      type="button"
      className={`wishlist-btn${active ? ' active' : ''}`}
      aria-pressed={active}
      aria-label={active ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      title={
        active
          ? `حذف «${props.title}» از علاقه‌مندی‌ها`
          : `افزودن «${props.title}» به علاقه‌مندی‌ها`
      }
      onClick={handleClick}
    >
      {active ? '♥' : '♡'}
    </button>
  );
}
