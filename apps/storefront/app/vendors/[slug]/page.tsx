"use client";

import "../vendors.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiBase, formatToman } from "../../../lib/catalog";
import { DigitalBadge } from "../../../components/discovery/digital-badge";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Stethoscope,
  Award,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

/* ── Types ── */
interface VendorItem {
  id?: string;
  slug?: string;
  titleFa?: string;
  city?: string;
  address?: string;
  phone?: string;
  specialty?: string;
  accreditationLevel?: string;
  description?: string | null;
  logoColor?: string | null;
  productCount?: number | string;
  isVerified?: boolean;
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

interface VendorPayload extends VendorItem {
  source?: string;
  vendor?: VendorItem | null;
  products?: (VendorProduct | null)[] | null;
}

/* ── Demo-equivalent clinics ── */
const ACCREDITED_CLINICS: VendorItem[] = [
  {
    id: "clinic_central",
    slug: "drdermer-clinic",
    titleFa: "مرکز درماتولوژی و پژوهش بالینی دکتر درمر",
    city: "تهران",
    address: "خیابان ولیعصر، بالاتر از پارک وی، مجتمع پزشکی مریم",
    phone: "۰۲۱-۲۲۰۱۴۵۰۰",
    specialty: "کربوکسی‌تراپی غیرتهاجمی بوهر، درمان ملاسما و ایستگاه‌های CarboX",
    accreditationLevel: "کلینیک طلایی مرجع (Centre of Excellence)",
    description:
      "مرکز تخصصی پروتکل‌های ترنس‌درمال دی‌اکسید کربن و تجهیزات نان‌ترمال پلاسما تحت نظارت مستقیم آزمایشگاه‌های کمبریج Dr Dermer UK.",
    logoColor: "#084f4a",
    productCount: 8,
    isVerified: true,
  },
  {
    id: "clinic_derm_lab",
    slug: "derm-lab-partner",
    titleFa: "کلینیک تخصصی پوست و لیزر آیریک (Derm Lab)",
    city: "تهران",
    address: "شهرک غرب، بلوار فرحزادی، تقاطع دریا، ساختمان پزشکان پارسیان",
    phone: "۰۲۱-۸۸۳۷۶۰۰۰",
    specialty: "بازسازی سد دفاعی پوست، لیزر CO₂ فرکشنال و پروتکل‌های کابین ReeMed",
    accreditationLevel: "پزشک معتمد کلینیکال (Accredited Practitioner)",
    description:
      "ارائه‌دهنده رسمی لاین درمانی هیلین و سیلیکالین همراه با تجهیزات کاتالیستی و کابین‌های مراقبت‌های ویژه پس از پروسیجرهای تهاجمی.",
    logoColor: "#0284c7",
    productCount: 6,
    isVerified: true,
  },
  {
    id: "clinic_esfahan_reemed",
    slug: "reemed-esfahan-center",
    titleFa: "مرکز فوق‌تخصصی پوست و ترمیم اسکار هور (اصفهان)",
    city: "اصفهان",
    address: "خیابان توحید میانی، کوچه ۲۴، کلینیک هور",
    phone: "۰۳۱-۳۶۲۵۸۹۰۰",
    specialty: "درمان اسکارهای سوختگی و آتروفیک، پلاسما جت سرد PlasmaX",
    accreditationLevel: "کلینیک طلایی مرجع (Centre of Excellence)",
    description:
      "مرکز مرجع استانی برگزاری کارگاه‌های عملی و پروتکل‌های پیشرفته درمان ملاسما و پیلینگ‌های ترکیبی با استانداردهای رسمی انگلستان.",
    logoColor: "#0d9488",
    productCount: 5,
    isVerified: true,
  },
];

const DEMO_PRODUCTS: Record<string, VendorProduct[]> = {
  "drdermer-clinic": [
    { id: "dp_dermer_1", slug: "carboxygel", title: "ژل تخصصی کربوکسی‌تراپی بالینی CarboxyGel", priceRials: "48500000", kind: "PHYSICAL", inStock: true },
    { id: "dp_dermer_2", slug: "carboxypod", title: "پدهای فعال‌ساز واکنش بوهر CarboxyPod", priceRials: "12500000", kind: "PHYSICAL", inStock: true },
    { id: "dp_dermer_3", slug: "crystalene", title: "سرم کریستالین بازیابی سد دفاعی پوست", priceRials: "18500000", kind: "PHYSICAL", inStock: true },
  ],
  "derm-lab-partner": [
    { id: "dp_partner_1", slug: "healene", title: "ژل-کرم تسکین‌دهنده و ترمیمی هیلین Healene", priceRials: "16500000", kind: "PHYSICAL", inStock: true },
    { id: "dp_partner_2", slug: "silicalene", title: "میکروکپسول‌های ماتریکس سیلیکالین Silicalene", priceRials: "22500000", kind: "PHYSICAL", inStock: true },
  ],
  "reemed-esfahan-center": [
    { id: "dp_esfahan_1", slug: "plasmax", title: "ایستگاه میکروبلفاروپلاستی و جت سرد PlasmaX", priceRials: "1850000000", kind: "PHYSICAL", inStock: true },
    { id: "dp_esfahan_2", slug: "healene", title: "ژل-کرم ترمیم‌کننده پس از لیزر و پلاسما Healene", priceRials: "16500000", kind: "PHYSICAL", inStock: true },
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
        const enriched = ACCREDITED_CLINICS.find((c) => c.slug === slug);
        setVendor(enriched ? { ...enriched, ...resolved } : resolved);
        setProducts(items);
        setIsDemo(false);
      } catch {
        if (!alive) return;
        const demo = ACCREDITED_CLINICS.find((v) => v?.slug === slug) ?? null;
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
    return <div className="state-panel">در حال بارگذاری اطلاعات مرکز درمانی…</div>;
  }

  if (!vendor || !vendor.titleFa) {
    return (
      <section className="vendors-page">
        <div className="state-panel">
          <h2>این مرکز درمانی یافت نشد</h2>
          <p>ممکن است صفحه حذف شده یا آدرس اشتباه باشد.</p>
          <Link href="/vendors" className="primary-link">
            بازگشت به فهرست مراکز مجاز
          </Link>
        </div>
      </section>
    );
  }

  const title = vendor.titleFa;
  const letter = title.slice(0, 1) || "ک";
  const color = safeLogoColor(vendor.logoColor);
  const bannerStyle = color
    ? { background: `linear-gradient(135deg, ${color} 0%, #17463E 100%)` }
    : undefined;

  return (
    <section className="vendors-page">
      {/* ── Breadcrumbs ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "20px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/vendors">مراکز درمانی مجاز</Link>
        <span>/</span>
        <span className="current-crumb">{title}</span>
      </nav>

      {/* ── Header Banner ── */}
      <div className="vendor-banner" style={bannerStyle}>
        <span className="vendor-avatar" aria-hidden="true">
          {letter}
        </span>
        <div className="vendor-banner-info">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
            <span className="vendor-banner-eyebrow">مرکز درمانی و کلینیک همکار</span>
            {vendor.isVerified && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(255,255,255,0.2)",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={12} />
                <span>پروانه معتبر و احراز هویت شده</span>
              </span>
            )}
          </div>
          <h1>{title}</h1>
          {vendor.description && <p className="vendor-banner-desc">{vendor.description}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          <span className="vendor-banner-count">
            {new Intl.NumberFormat("fa-IR").format(products.length)} پروتکل و محصول
          </span>
          <Link
            href="/contact"
            style={{
              background: "var(--accent)",
              color: "#18221d",
              padding: "8px 18px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "0.82rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <CalendarCheck size={14} />
            <span>درخواست نوبت مشاوره</span>
          </Link>
        </div>
      </div>

      {/* ── Clinical Details Row ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {vendor.specialty && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Stethoscope size={20} color="var(--brand)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ fontSize: "0.82rem", color: "var(--brand-deep)", display: "block" }}>
                تخصص‌های کلینیکال:
              </strong>
              <span style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7" }}>
                {vendor.specialty}
              </span>
            </div>
          </div>
        )}

        {vendor.address && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <MapPin size={20} color="var(--brand)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ fontSize: "0.82rem", color: "var(--brand-deep)", display: "block" }}>
                نشانی مرکز:
              </strong>
              <span style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7" }}>
                {vendor.city ? `${vendor.city}، ` : ""}{vendor.address}
              </span>
            </div>
          </div>
        )}

        {vendor.phone && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Phone size={20} color="var(--brand)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ fontSize: "0.82rem", color: "var(--brand-deep)", display: "block" }}>
                شماره تماس پذیرش:
              </strong>
              <span style={{ fontSize: "0.84rem", color: "var(--ink)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {vendor.phone}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Products Showcase ── */}
      <div className="vendor-products-head">
        <h2>فرمولاسیون‌ها و تجهیزات فعال در این مرکز</h2>
        <Link href="/vendors" className="vendor-back-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span>بازگشت به فهرست مراکز مجاز</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="vendor-empty">هنوز پروتکل یا محصولی برای این مرکز ثبت نشده است.</p>
      ) : (
        <div className="vendor-product-grid">
          {products.map((p, i) => {
            const href = p?.slug ? `/${encodeURIComponent(p.slug)}` : null;
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
                    {href && (
                      <Link href={href} className="text-link" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                        مشاهده جزئیات بالینی ←
                      </Link>
                    )}
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
