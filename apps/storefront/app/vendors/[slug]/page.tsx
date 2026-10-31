"use client";

import "../vendors.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiBase, formatToman } from "../../../lib/catalog";
import { DigitalBadge } from "../../../components/discovery/digital-badge";

/* ── Types (resilient: every field optional) ── */
interface VendorItem {
  id?: string;
  slug?: string;
  titleFa?: string;
  description?: string | null;
  logoColor?: string | null;
  productCount?: number | string;
}

interface VendorProduct {
  id?: string;
  slug?: string;
  title?: string;
  description?: string | null;
  priceRials?: string | number | null;
  priceTomans?: string | number | null;
  kind?: string | null;
  inStock?: boolean | null;
}

/**
 * Payload contract: { source, vendor, products }.
 * Resilient: some shapes may return the vendor fields flat at top level
 * (alongside `products`) instead of nesting them under `vendor`.
 */
interface VendorPayload extends VendorItem {
  source?: string;
  vendor?: VendorItem | null;
  products?: (VendorProduct | null)[] | null;
}

/* ── Demo-equivalent vendors (same as app/vendors/page.tsx fallback) ── */
const DEMO_VENDORS: VendorItem[] = [
  {
    id: "vendor_demo_roast",
    slug: "roast-coffee",
    titleFa: "روست قهوه",
    description: "برشته‌کاری تخصصی قهوه اسپشیالتی؛ دانه‌های تک‌خاستگاه با برشت تازه و ارسال هفتگی.",
    logoColor: "#8b5cf6",
    productCount: 12,
  },
  {
    id: "vendor_demo_brew",
    slug: "brew-studio",
    titleFa: "استودیو دم‌آوری",
    description: "ابزار و لوازم دم‌آوری حرفه‌ای؛ از دریپر سرامیکی تا ترازو و کتری گووزوم.",
    logoColor: "#f59e0b",
    productCount: 8,
  },
];

const DEMO_PRODUCTS: Record<string, VendorProduct[]> = {
  "roast-coffee": [
    { id: "dp_roast_1", slug: "ethiopian-specialty-coffee", title: "قهوه اسپشیالتی اتیوپی ۲۵۰ گرمی", priceRials: "9500000", kind: "PHYSICAL", inStock: true },
    { id: "dp_roast_2", slug: "ceramic-dripper-v60", title: "دریپر سرامیکی وی‌۶۰", priceRials: "4200000", kind: "PHYSICAL", inStock: true },
    { id: "dp_roast_3", slug: "brewing-guide-ebook", title: "کتاب الکترونیکی راهنمای جامع دم‌آوری", priceRials: "1800000", kind: "DIGITAL", inStock: true },
  ],
  "brew-studio": [
    { id: "dp_brew_1", slug: "artisan-mug", title: "ماگ سرامیکی دست‌ساز", priceRials: "3200000", kind: "PHYSICAL", inStock: true },
    { id: "dp_brew_2", slug: "latte-art-video-course", title: "دوره ویدیویی لاته‌آرت", priceRials: "6500000", kind: "DIGITAL", inStock: true },
  ],
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function safeLogoColor(value?: string | null): string | null {
  return typeof value === "string" && HEX_COLOR.test(value.trim()) ? value.trim() : null;
}

function toRialsString(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(Math.round(value));
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value.trim()))) {
    return String(Math.round(Number(value.trim())));
  }
  return null;
}

function productPriceRials(p?: VendorProduct | null): string | null {
  const rials = toRialsString(p?.priceRials);
  if (rials) return rials;
  const tomans = toRialsString(p?.priceTomans);
  if (tomans) {
    try {
      return (BigInt(tomans) * 10n).toString();
    } catch {
      return null;
    }
  }
  return null;
}

export default function VendorStorefrontPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [vendor, setVendor] = useState<VendorItem | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${apiBase}/v1/vendors/${encodeURIComponent(slug)}`, {
          cache: "no-store",
          headers: { accept: "application/json" },
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as VendorPayload;
        /* Resilient: nested { vendor, products } or flat vendor fields at top level. */
        const resolved: VendorItem | null =
          data?.vendor && typeof data.vendor === "object" && data.vendor !== null
            ? data.vendor
            : typeof data?.titleFa === "string" && data.titleFa
              ? {
                  id: data.id,
                  slug: data.slug ?? slug,
                  titleFa: data.titleFa,
                  description: data.description ?? null,
                  logoColor: data.logoColor ?? null,
                  productCount: data.productCount,
                }
              : null;
        if (data?.source !== "DB" || !resolved?.titleFa) throw new Error("demo source");
        const items = (Array.isArray(data?.products) ? data.products : []).filter(
          (p): p is VendorProduct => Boolean(p),
        );
        if (!alive) return;
        setVendor(resolved);
        setProducts(items);
        setIsDemo(false);
      } catch {
        if (!alive) return;
        const demo = DEMO_VENDORS.find((v) => v?.slug === slug) ?? null;
        setVendor(demo);
        setProducts(demo ? (DEMO_PRODUCTS[demo.slug ?? ""] ?? []) : []);
        setIsDemo(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="state-panel">در حال بارگذاری فروشگاه…</div>;
  }

  if (!vendor || !vendor.titleFa) {
    return (
      <section className="vendors-page">
        <div className="state-panel">
          <h2>این فروشنده یافت نشد</h2>
          <p>ممکن است فروشگاه حذف شده یا نشانی اشتباه باشد.</p>
          <Link href="/vendors" className="primary-link">
            بازگشت به فهرست فروشندگان
          </Link>
        </div>
      </section>
    );
  }

  const title = vendor.titleFa;
  const letter = title.slice(0, 1) || "ف";
  const color = safeLogoColor(vendor.logoColor);
  const count = Number(vendor.productCount ?? products.length);
  const bannerStyle = color
    ? { background: `linear-gradient(135deg, ${color} 0%, #084f4a 100%)` }
    : undefined;

  return (
    <section className="vendors-page">
      {isDemo && (
        <p className="vendors-demo-note">نمایش داده نمونه — اتصال به API برقرار نشد</p>
      )}

      {/* ── Header banner ── */}
      <div className="vendor-banner" style={bannerStyle}>
        <span className="vendor-avatar" aria-hidden="true">
          {letter}
        </span>
        <div className="vendor-banner-info">
          <span className="vendor-banner-eyebrow">فروشگاه همکار</span>
          <h1>{title}</h1>
          {vendor.description && <p className="vendor-banner-desc">{vendor.description}</p>}
        </div>
        <span className="vendor-banner-count">
          {new Intl.NumberFormat("fa-IR").format(Number.isFinite(count) ? count : products.length)} کالا
        </span>
      </div>

      {/* ── Products ── */}
      <div className="vendor-products-head">
        <h2>محصولات این فروشنده</h2>
        <Link href="/vendors" className="vendor-back-link">
          ← بازگشت به فروشندگان
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="vendor-empty">هنوز محصولی برای این فروشنده ثبت نشده است.</p>
      ) : (
        <div className="vendor-product-grid">
          {products.map((p, i) => {
            const href = p?.slug ? `/products/${encodeURIComponent(p.slug)}` : null;
            const rials = productPriceRials(p);
            const isDigital = String(p?.kind ?? "").toUpperCase() === "DIGITAL";
            return (
              <article className="product-card" key={String(p?.id ?? `vprod_${i}`)}>
                {href ? (
                  <Link className="product-art" href={href} aria-label={`مشاهده ${p?.title ?? "محصول"}`}>
                    <span className="art-index">{(p?.title ?? "ک").slice(0, 1)}</span>
                    <span className="art-caption">
                      {isDigital ? "تحویل دیجیتال" : p?.inStock === false ? "اتمام موجودی" : "موجود در انبار"}
                    </span>
                  </Link>
                ) : (
                  <div className="product-art">
                    <span className="art-index">{(p?.title ?? "ک").slice(0, 1)}</span>
                  </div>
                )}
                <div className="product-copy">
                  {isDigital && (
                    <div className="vendor-badge-wrap">
                      <DigitalBadge />
                    </div>
                  )}
                  {href ? (
                    <h3>
                      <Link href={href}>{p?.title ?? "بدون عنوان"}</Link>
                    </h3>
                  ) : (
                    <h3>{p?.title ?? "بدون عنوان"}</h3>
                  )}
                  <p>{p?.description ?? "توضیحات و مشخصات تکمیلی کالا در صفحه محصول."}</p>
                  <div className="product-bottom">
                    <strong>{rials ? formatToman(rials) : "تماس بگیرید"}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
