'use client';

import { useEffect, useRef, useState } from 'react';
import { COMPARE_CHANGED_EVENT, isComparing, toggleCompare } from '../../lib/compare';

export function CompareButton(props: {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  sku: string;
  priceAmount: string;
  inStock?: boolean;
  categoryTitleFa?: string | null;
}) {
  const [active, setActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const sync = () => setActive(isComparing(props.variantId));
    sync();
    window.addEventListener(COMPARE_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(COMPARE_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, [props.variantId]);

  const showToastMessage = () => {
    setShowToast(true);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setShowToast(false), 2400);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const result = toggleCompare({
      variantId: props.variantId,
      productId: props.productId,
      slug: props.slug,
      title: props.title,
      sku: props.sku,
      priceAmount: props.priceAmount,
      inStock: props.inStock,
      categoryTitleFa: props.categoryTitleFa,
    });
    if (result.ok) {
      setActive(result.active);
      return;
    }
    if (result.reason === 'max') showToastMessage();
  };

  return (
    <>
      <button
        type="button"
        className={`compare-btn${active ? ' active' : ''}`}
        aria-pressed={active}
        aria-label={active ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
        title={active ? `حذف «${props.title}» از مقایسه` : `افزودن «${props.title}» به مقایسه`}
        onClick={handleClick}
      >
        ⇄
      </button>
      {showToast && (
        <div className="compare-toast" role="status">
          حداکثر ۴ کالا برای مقایسه
        </div>
      )}
    </>
  );
}
