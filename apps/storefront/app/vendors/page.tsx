"use client";

import "./vendors.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiBase } from "../../lib/catalog";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Stethoscope,
  Phone,
  Award,
  CheckCircle2,
  ExternalLink,
  Search,
  UserCheck,
} from "lucide-react";

/* ── Types ── */
export interface VerifiedPractitioner {
  name: string;
  role: string;
  medicalCouncilNo: string;
  specialty: string;
}

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
  leadPractitioner?: VerifiedPractitioner;
}

interface VendorsPayload {
  source?: string;
  items?: (VendorItem | null)[];
}

/* ── Accredited Partner Clinics & Centers ── */
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
    logoColor: "#1E3A2F",
    productCount: 8,
    isVerified: true,
    leadPractitioner: {
      name: "دکتر مریم سهرابی",
      role: "پزشک مسئول فنی و سرپرست بالینی",
      medicalCouncilNo: "۱۳۹۴۸۲",
      specialty: "بورد تخصصی درماتولوژی، درماتوپاتولوژی و لیزر",
    },
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
    leadPractitioner: {
      name: "دکتر مسعود فرهمند",
      role: "پزشک معتمد پوست و زیبایی",
      medicalCouncilNo: "۱۱۸۹۲۰",
      specialty: "متخصص پوست و سد دفاعی لاملار",
    },
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
    logoColor: "#8C6A42",
    productCount: 5,
    isVerified: true,
    leadPractitioner: {
      name: "دکتر علیرضا ناصری",
      role: "پزشک ناظر و مسئول بخش پلاسما",
      medicalCouncilNo: "۷۴۲۱۰",
      specialty: "بورد تخصصی جراحی و تکنولوژی‌های پلاسما",
    },
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
  const [vendors, setVendors] = useState<VendorItem[]>(ACCREDITED_CLINICS);
  const [isDemo, setIsDemo] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

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
        // Merge with enriched clinical metadata
        setVendors(
          usable.map((u) => {
            const enriched = ACCREDITED_CLINICS.find((c) => c.slug === u.slug);
            return enriched ? { ...enriched, ...u } : u;
          })
        );
        setIsDemo(false);
      } catch {
        if (alive) {
          setVendors(ACCREDITED_CLINICS);
          setIsDemo(true);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filteredClinics = vendors.filter((v) => {
    const title = (v.titleFa ?? "").toLowerCase();
    const city = (v.city ?? "").toLowerCase();
    const specialty = (v.specialty ?? "").toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.includes(q) || city.includes(q) || specialty.includes(q);
    const matchesCity = selectedCity === "all" || v.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <section className="vendors-page">
      {/* ── Breadcrumbs ── */}
      <nav className="breadcrumbs-nav" style={{ marginBottom: "20px" }}>
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <span>متخصصان و همکاران</span>
        <span>/</span>
        <span className="current-crumb">شبکه کلینیک‌ها و مراکز مجاز درمانی</span>
      </nav>

      {/* ── Header Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #17463E 0%, #24594F 100%)",
          color: "#ffffff",
          borderRadius: "20px",
          padding: "36px 32px",
          marginBottom: "32px",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            <ShieldCheck size={16} />
            <span>Accredited Clinical Directory &amp; Partner Network</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)", margin: "0 0 10px", lineHeight: "1.3", fontWeight: 800 }}>
            شبکه کلینیک‌ها و مراکز مجاز درمانی دکتر درمر
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.8", opacity: 0.9 }}>
            فهرست رسمی کلینیک‌های پوست، بیمارستان‌ها و مطب‌های دارای مجوز استفاده از پروتکل‌های کربوکسی‌تراپی،
            تجهیزات CarboX و PlasmaX و عرضه نسخه‌های اورجینال محصولات ReeSkin و ReeMed.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href="/b2b#wizard-section"
            style={{
              background: "var(--accent)",
              color: "#18221d",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "0.9rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            <Building2 size={18} />
            <span>ثبت و احراز صلاحیت کلینیک جدید</span>
          </Link>
          <span style={{ fontSize: "0.74rem", opacity: 0.8, textAlign: "center" }}>
            تاییدیه پروانه مطب ظرف ۴۸ ساعت کاری
          </span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          <Search size={18} color="var(--muted)" />
          <input
            type="text"
            placeholder="جستجوی نام کلینیک، پزشک، تخصص یا خیابان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              fontSize: "0.9rem",
              color: "var(--ink)",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 700 }}>شهر:</span>
          {["all", "تهران", "اصفهان"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCity(c)}
              style={{
                background: selectedCity === c ? "var(--brand)" : "var(--paper)",
                color: selectedCity === c ? "#ffffff" : "var(--ink)",
                border: `1px solid ${selectedCity === c ? "var(--brand)" : "var(--line)"}`,
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {c === "all" ? "همه شهرها" : c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Clinical Partner Cards Grid ── */}
      <div className="vendors-grid">
        {filteredClinics.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              background: "var(--surface)",
              border: "1px dashed var(--line)",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            <Building2 size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: "0.95rem" }}>مرکز درمانی منطبق با عبارت جستجو یافت نشد.</p>
          </div>
        )}

        {filteredClinics.map((v, i) => {
          const slug = String(v?.slug ?? "");
          const title = String(v?.titleFa ?? "کلینیک تخصصی");
          const letter = title.slice(0, 1) || "ک";
          const href = `/vendors/${encodeURIComponent(slug)}`;
          const count = Number(v?.productCount ?? 0);

          return (
            <div key={vendorKey(v, i)} className="vendor-card">
              {/* Header: Logo + Badges */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <span
                  className="vendor-avatar"
                  style={{ background: safeLogoColor(v?.logoColor) }}
                  aria-hidden="true"
                >
                  {letter}
                </span>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  {v.isVerified && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#ecfdf5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>مرکز مجاز تأییدشده</span>
                    </span>
                  )}
                  {v.accreditationLevel && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "var(--paper)",
                        color: "var(--brand-deep)",
                        border: "1px solid var(--line)",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      <Award size={12} color="var(--accent)" />
                      <span>{v.accreditationLevel.split(" (")[0]}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 style={{ fontSize: "1.1rem", margin: "6px 0 2px", color: "var(--brand-deep)", lineHeight: "1.4" }}>
                {title}
              </h3>
              <p className="vendor-desc">{v?.description ?? "مرکز تخصصی ارائه خدمات درماتولوژی و مراقبت‌های پوستی."}</p>

              {/* Clinical Specialties */}
              {v.specialty && (
                <div
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "0.78rem",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <Stethoscope size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "var(--brand-deep)", display: "block" }}>حیطه تخصص و تجهیزات:</strong>
                    <span style={{ color: "var(--muted)", lineHeight: "1.6" }}>{v.specialty}</span>
                  </div>
                </div>
              )}

              {/* Verified Practitioner Badge */}
              {v.leadPractitioner && (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "0.76rem",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <UserCheck size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 800, color: "#14532d" }}>
                      پزشک ناظر بالینی: {v.leadPractitioner.name}
                    </span>
                    <span style={{ color: "#15803d", marginRight: "6px" }}>
                      (نظام پزشکی: {v.leadPractitioner.medicalCouncilNo})
                    </span>
                  </div>
                </div>
              )}

              {/* Location & Contact */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.78rem", color: "var(--muted)" }}>
                {v.address && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={14} color="var(--brand)" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {v.city ? `${v.city}: ` : ""}{v.address}
                    </span>
                  </div>
                )}
                {v.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={14} color="var(--brand)" style={{ flexShrink: 0 }} />
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{v.phone}</span>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="vendor-meta" style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px dashed var(--line)" }}>
                <span className="vendor-count-badge">
                  {new Intl.NumberFormat("fa-IR").format(Number.isFinite(count) ? count : 0)} پروتکل و محصول فعال
                </span>
                <Link href={href} className="vendor-visit" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span>پروفایل و نوبت‌دهی</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
