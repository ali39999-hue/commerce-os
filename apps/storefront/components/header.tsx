"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart";
import { COMPARE_CHANGED_EVENT, getCompare } from "../lib/compare";
import { WISHLIST_CHANGED_EVENT, getWishlist } from "../lib/wishlist";

export function SiteHeader() {
  const { itemCount, isReady } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const syncWishlist = () => setWishlistCount(getWishlist().length);
    const syncCompare = () => setCompareCount(getCompare().length);
    const syncAll = () => {
      syncWishlist();
      syncCompare();
    };
    syncWishlist();
    syncCompare();
    window.addEventListener(WISHLIST_CHANGED_EVENT, syncWishlist);
    window.addEventListener(COMPARE_CHANGED_EVENT, syncCompare);
    window.addEventListener("storage", syncAll);
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncWishlist);
      window.removeEventListener(COMPARE_CHANGED_EVENT, syncCompare);
      window.removeEventListener("storage", syncAll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/#catalog");
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand-group">
          <Link className="brand" href="/">
            بازارک <span>COMMERCE OS</span>
          </Link>
          <span className="header-badge">فروشگاه مدرن ایرانی</span>
        </div>

        <form onSubmit={handleSearch} className="header-search-form">
          <input
            type="search"
            placeholder="جست‌وجوی کالا (مثال: قهوه، ماگ، هدفون…)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="header-search-input"
          />
          <button type="submit" className="header-search-btn" aria-label="جست‌وجو">
            🔍
          </button>
        </form>

        <nav className="header-nav">
          <Link href="/#catalog" className="nav-link">
            محصولات
          </Link>
          <Link href="/blog" className="nav-link">
            وبلاگ
          </Link>
          <Link href="/subscriptions" className="nav-link">
            اشتراک‌ها
          </Link>
          <Link href="/account" className="nav-link">
            حساب من
          </Link>
          <Link href="/wishlist" className="nav-link nav-link-badge" aria-label="علاقه‌مندی‌ها">
            علاقه‌مندی‌ها
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </Link>
          <Link href="/compare" className="nav-link nav-link-badge" aria-label="مقایسه">
            مقایسه
            {compareCount > 0 && <span className="badge-count">{compareCount}</span>}
          </Link>
          <Link href="/cart" className="cart-trigger" aria-label="مشاهده سبد خرید">
            <span>سبد خرید</span>
            {isReady && itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
