"use client";

import "./vendors.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiBase } from "../../lib/catalog";

/* ── Types (resilient: every field optional) ── */
interface VendorItem {
  id?: string;
  slug?: string;
  titleFa?: string;
  description?: string | null;
  logoColor?: string | null;
  productCount?: number | string;
}

interface VendorsPayload {
  source?: string;
  items?: (VendorItem | null)[];
}

/* ── Demo-equivalent vendors (shown when API is down or source==='FALLBACK') ── */
const DEMO_VENDORS: VendorItem[] = [
  {
    id: "vendor_demo_central",
    slug: "drdermer-clinic",
    titleFa: "کلینیک مرکزی دکتر درمر",
    description: "مرکز تخصصی پروتکل‌های کربوکسی‌تراپی و اکسیژن‌رسانی غیرتهاجمی Dr. Dermer UK Clinical Laboratories.",
    logoColor: "#084f4a",
    productCount: 8,
  },
  {
    id: "vendor_demo_partner",
    slug: "derm-lab-partner",
    titleFa: "کلینیک و داروخانه تخصصی درماتولوژی",
    description: "توزیع‌کننده رسمی فرآورده‌های درموسوتیکال، سرم‌های بیومیمتیک و ملزومات کلینیکال پوست.",
    logoColor: "#0284c7",
    productCount: 6,
  },
];

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function safeLogoColor(value?: string | null): string {
  return typeof value === "string" && HEX_COLOR.test(value.trim()) ? value.trim() : "#084f4a";
}

function vendorKey(v: VendorItem, i: number): string {
  return String(v?.id ?? v?.slug ?? `vendor_${i}`);
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorItem[]>(DEMO_VENDORS);
  const [isDemo, setIsDemo] = useState(true);

  /* ── Live fetch, hard-coded demo on fallback/failure ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/v1/vendors?storeSlug=demo`, {
          cache: "no-store",
          headers: { accept: "application/json" },
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as VendorsPayload;
        const items = (data?.items ?? []).filter((v): v is VendorItem => Boolean(v));
        const usable = items.filter((v) => typeof v?.slug === "string" && v.slug && typeof v?.titleFa === "string" && v.titleFa);
        if (data?.source !== "DB" || usable.length === 0) throw new Error("demo source");
        if (!alive) return;
        setVendors(usable);
        setIsDemo(false);
      } catch {
        if (alive) {
          setVendors(DEMO_VENDORS);
          setIsDemo(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="vendors-page">
      {isDemo && (
        <p className="vendors-demo-note">نمایش داده نمونه — اتصال به API برقرار نشد</p>
      )}

      <div className="vendors-head">
        <div className="eyebrow">بازار فروشندگان همکار</div>
        <h1>فروشندگان همکار</h1>
      </div>

      <div className="vendors-grid">
        {vendors.length === 0 && (
          <p className="vendor-empty">هنوز فروشنده‌ای در این فروشگاه ثبت نشده است.</p>
        )}
        {vendors.map((v, i) => {
          const slug = String(v?.slug ?? "");
          const title = String(v?.titleFa ?? "فروشنده");
          const letter = title.slice(0, 1) || "ف";
          const href = `/vendors/${encodeURIComponent(slug)}`;
          const count = Number(v?.productCount ?? 0);
          return (
            <Link key={vendorKey(v, i)} href={href} className="vendor-card" aria-label={`مشاهده فروشگاه ${title}`}>
              <span
                className="vendor-avatar"
                style={{ background: safeLogoColor(v?.logoColor) }}
                aria-hidden="true"
              >
                {letter}
              </span>
              <h3>{title}</h3>
              <p className="vendor-desc">{v?.description ?? "معرفی این فروشنده به‌زودی تکمیل می‌شود."}</p>
              <div className="vendor-meta">
                <span className="vendor-count-badge">
                  {new Intl.NumberFormat("fa-IR").format(Number.isFinite(count) ? count : 0)} کالا
                </span>
                <span className="vendor-visit">مشاهده فروشگاه ←</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
