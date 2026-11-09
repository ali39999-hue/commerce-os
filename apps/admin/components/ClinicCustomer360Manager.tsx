"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import { faNumber } from "./types";

export type ClinicVerificationStatus = "VERIFIED" | "PENDING_RENEWAL" | "SUSPENDED";
export type ClinicTier = "VIP_PLATINUM" | "GOLD" | "STANDARD";

export interface ClinicDossierItem {
  id: string;
  clinicName: string;
  medicalDirector: string;
  medicalLicenseNumber: string;
  licenseStatus: ClinicVerificationStatus;
  licenseExpiryJalali: string;
  specialty: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  tier: ClinicTier;
  creditLimitTomans: number;
  creditUsedTomans: number;
  paymentTerms: string;
  paymentScore: "A+" | "A" | "B" | "C";
  bohrCertificationStatus: "CERTIFIED" | "IN_TRAINING" | "NOT_ENROLLED";
  hardwareStationSN?: string;
  hardwareStationStatus?: "CALIBRATED" | "SERVICE_DUE" | "NONE";
  totalOrders: number;
  ltvTomans: number;
  lastOrderDate: string;
  joinedAt: string;
  notes: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
  }>;
}

const INITIAL_CLINICS: ClinicDossierItem[] = [
  {
    id: "CLN-401",
    clinicName: "کلینیک فوق تخصصی پوست و لیزر اکسیر ونک",
    medicalDirector: "دکتر مهران افشار",
    medicalLicenseNumber: "۱۲۴۵۹۸",
    licenseStatus: "VERIFIED",
    licenseExpiryJalali: "۱۴۰۶/۰۸/۱۵",
    specialty: "پوست، مو و درماتولوژی بالینی",
    city: "تهران (ونک)",
    address: "میدان ونک، خیابان ملاصدرا، پلاک ۸۲، طبقه ۴",
    phone: "02188776655",
    email: "info@exir-clinic.com",
    tier: "VIP_PLATINUM",
    creditLimitTomans: 250000000,
    creditUsedTomans: 142000000,
    paymentTerms: "اعتباری Net-30 (تضمین چک صیادی)",
    paymentScore: "A+",
    bohrCertificationStatus: "CERTIFIED",
    hardwareStationSN: "PX-2024-8841",
    hardwareStationStatus: "CALIBRATED",
    totalOrders: 28,
    ltvTomans: 680000000,
    lastOrderDate: "2026-11-04T14:20:00.000Z",
    joinedAt: "2024-03-10T00:00:00.000Z",
    notes: [
      {
        id: "nt_1",
        author: "سارا دانش (کارشناس B2B)",
        text: "دوره تخصصی اکسیژن‌رسانی زیرپوستی و اثر بور با موفقیت توسط کادر درمان گذرانده شد و گواهی رسمی صادر گردید.",
        date: "2026-10-15T11:00:00.000Z",
      },
      {
        id: "nt_2",
        author: "حسابدار ارشد",
        text: "چک تسویه فاکتور مهرماه بدون دیرکرد پاس شد. سقف اعتبار از ۱۵۰ به ۲۵۰ میلیون تومان ارتقا یافت.",
        date: "2026-10-25T09:30:00.000Z",
      },
    ],
  },
  {
    id: "CLN-402",
    clinicName: "مرکز درمانی و زیبایی پوست نگین شیراز",
    medicalDirector: "دکتر فرزانه معتمدی",
    medicalLicenseNumber: "۹۸۴۲۱",
    licenseStatus: "VERIFIED",
    licenseExpiryJalali: "۱۴۰۵/۱۲/۲۹",
    specialty: "جراحی پلاستیک و جوان‌سازی پوست",
    city: "شیراز (خیابان زند)",
    address: "خیابان زند، نبش کوچه ۴۱، ساختمان پزشکان پارس",
    phone: "07132334455",
    email: "clinic.negin@yahoo.com",
    tier: "GOLD",
    creditLimitTomans: 120000000,
    creditUsedTomans: 85000000,
    paymentTerms: "اعتباری Net-15",
    paymentScore: "A",
    bohrCertificationStatus: "CERTIFIED",
    hardwareStationSN: "PX-2023-4102",
    hardwareStationStatus: "SERVICE_DUE",
    totalOrders: 19,
    ltvTomans: 390000000,
    lastOrderDate: "2026-10-28T16:45:00.000Z",
    joinedAt: "2024-07-20T00:00:00.000Z",
    notes: [
      {
        id: "nt_3",
        author: "پشتیبانی فنی",
        text: "دستگاه PlasmaX نیازمند کالیبراسیون دوره‌ای ۶ ماهه است. کارشناس فنی هماهنگ شد.",
        date: "2026-11-01T10:00:00.000Z",
      },
    ],
  },
  {
    id: "CLN-403",
    clinicName: "مطب دکتر کیوان رادمنش (متخصص درماتولوژی)",
    medicalDirector: "دکتر کیوان رادمنش",
    medicalLicenseNumber: "۱۱۰۵۴۲",
    licenseStatus: "PENDING_RENEWAL",
    licenseExpiryJalali: "۱۴۰۵/۰۷/۳۰",
    specialty: "درماتولوژی و درمان اسکار آکنه",
    city: "تهران (سعادت‌آباد)",
    address: "سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۳",
    phone: "02122098877",
    email: "dr.radmanesh@gmail.com",
    tier: "STANDARD",
    creditLimitTomans: 40000000,
    creditUsedTomans: 12000000,
    paymentTerms: "تسویه نقدی قبل از ارسال",
    paymentScore: "B",
    bohrCertificationStatus: "IN_TRAINING",
    hardwareStationSN: undefined,
    hardwareStationStatus: "NONE",
    totalOrders: 8,
    ltvTomans: 115000000,
    lastOrderDate: "2026-10-12T11:20:00.000Z",
    joinedAt: "2025-01-15T00:00:00.000Z",
    notes: [
      {
        id: "nt_4",
        author: "سارا دانش (کارشناس B2B)",
        text: "تمدید پروانه مطب در جریان است. سفارشات فعلاً نقدی ثبت می‌شوند تا بارگذاری استعلام نظام پزشکی نهایی گردد.",
        date: "2026-10-20T14:15:00.000Z",
      },
    ],
  },
];

export default function ClinicCustomer360Manager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [clinics, setClinics] = useState<ClinicDossierItem[]>(INITIAL_CLINICS);
  const [selectedClinic, setSelectedClinic] = useState<ClinicDossierItem | null>(INITIAL_CLINICS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [newNoteText, setNewNoteText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredClinics = useMemo(() => {
    return clinics.filter((c) => {
      if (tierFilter !== "ALL" && c.tier !== tierFilter) return false;
      if (statusFilter !== "ALL" && c.licenseStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          c.clinicName.toLowerCase().includes(q) ||
          c.medicalDirector.toLowerCase().includes(q) ||
          c.medicalLicenseNumber.includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [clinics, tierFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalClinics = clinics.length;
    const verified = clinics.filter((c) => c.licenseStatus === "VERIFIED").length;
    const totalLtv = clinics.reduce((sum, c) => sum + c.ltvTomans, 0);
    const totalCreditLimit = clinics.reduce((sum, c) => sum + c.creditLimitTomans, 0);
    const totalCreditUsed = clinics.reduce((sum, c) => sum + c.creditUsedTomans, 0);
    return {
      totalClinics,
      verified,
      totalLtv,
      totalCreditLimit,
      totalCreditUsed,
    };
  }, [clinics]);

  const handleAddNote = () => {
    if (!selectedClinic || !newNoteText.trim()) return;

    const author =
      userRole === "SUPER_ADMIN"
        ? "مدیر ارشد پلتفرم"
        : userRole === "ACCOUNTANT"
        ? "حسابدار ارشد"
        : "اپراتور امور کلینیک‌ها";

    const newNote = {
      id: `nt_${Date.now()}`,
      author,
      text: newNoteText.trim(),
      date: new Date().toISOString(),
    };

    setClinics((prev) =>
      prev.map((c) =>
        c.id === selectedClinic.id ? { ...c, notes: [newNote, ...c.notes] } : c
      )
    );

    setSelectedClinic((prev) => (prev ? { ...prev, notes: [newNote, ...prev.notes] } : null));
    setNewNoteText("");
    setFeedback(`یادداشت عملیاتی با موفقیت در پرونده ${selectedClinic.clinicName} ثبت شد.`);
  };

  const handleRequestCreditIncrease = () => {
    if (!selectedClinic) return;
    setFeedback(
      `درخواست ارتقای اعتبار کلینیک ${selectedClinic.clinicName} برای تصویب به «مرکز تأیید و کنترل‌های دوطرفه (Maker-Checker)» ارسال گردید.`
    );
  };

  return (
    <div className="tab-pane">
      {/* ── Feedback Message ── */}
      {feedback && (
        <div
          className="form-feedback-success"
          style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Summary KPI Cards ── */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card highlight">
          <div className="kpi-title">کلینیک‌ها و مراکز درمانی همکار</div>
          <div className="kpi-value">{faNumber(stats.totalClinics)} کلینیک</div>
          <small style={{ color: "#274b24", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            {faNumber(stats.verified)} مرکز با پروانه نظام پزشکی معتبر
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">مجموع گردش خرید مراجعین (LTV)</div>
          <div className="kpi-value tabular-nums">
            {faNumber(stats.totalLtv.toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            فرمولاسیون و استیشن‌های تخصصی
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">سقف خرید اعتباری فعال (Net-30)</div>
          <div className="kpi-value tabular-nums">
            {faNumber(stats.totalCreditLimit.toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            تضمین چک صیادی و قرارداد حقوقی
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">اعتبار در گردش مصرف‌شده</div>
          <div className="kpi-value tabular-nums" style={{ color: "#d97706" }}>
            {faNumber(stats.totalCreditUsed.toLocaleString())}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>تومان</span>
          </div>
          <small style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
            مانده بدهکاران تجاری در دفاتر
          </small>
        </div>
      </div>

      {/* ── Split Layout: Left Dossier / Right Search & Directory ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", alignItems: "start" }}>
        {/* ── Left Side: Selected Clinic 360 Dossier ── */}
        <div>
          {selectedClinic ? (
            <div className="admin-section-box" style={{ padding: "24px" }}>
              {/* Dossier Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                  paddingBottom: "18px",
                  borderBottom: "1px solid var(--line)",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--brand-deep)", fontSize: "0.9rem" }}>
                      {selectedClinic.id}
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        background:
                          selectedClinic.tier === "VIP_PLATINUM"
                            ? "#e0e7ff"
                            : selectedClinic.tier === "GOLD"
                            ? "#fef3c7"
                            : "#f1f5f9",
                        color:
                          selectedClinic.tier === "VIP_PLATINUM"
                            ? "#4338ca"
                            : selectedClinic.tier === "GOLD"
                            ? "#b45309"
                            : "#475569",
                      }}
                    >
                      {selectedClinic.tier === "VIP_PLATINUM"
                        ? "VIP پلاتینوم"
                        : selectedClinic.tier === "GOLD"
                        ? "طلایی (Gold)"
                        : "استاندارد"}
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        background: selectedClinic.licenseStatus === "VERIFIED" ? "#ecfdf5" : "#fffbeb",
                        color: selectedClinic.licenseStatus === "VERIFIED" ? "#047857" : "#b45309",
                      }}
                    >
                      {selectedClinic.licenseStatus === "VERIFIED"
                        ? "پروانه پزشکی تأیید شده"
                        : "نیازمند تمدید پروانه"}
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--ink)", fontWeight: 800 }}>
                    {selectedClinic.clinicName}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", color: "var(--muted)", fontSize: "0.85rem" }}>
                    <span>مسئول فنی: <strong>{selectedClinic.medicalDirector}</strong></span>
                    <span>|</span>
                    <span>شماره نظام پزشکی: <strong style={{ fontFamily: "monospace" }}>{selectedClinic.medicalLicenseNumber}</strong></span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleRequestCreditIncrease}
                    className="admin-btn"
                    style={{
                      padding: "8px 14px",
                      fontSize: "0.82rem",
                      background: "var(--brand)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    درخواست افزایش اعتبار (Maker-Checker)
                  </button>
                </div>
              </div>

              {/* Dossier Tabs / Metrics Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ background: "var(--paper)", padding: "12px 14px", borderRadius: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>ارزش طول عمر (LTV)</span>
                  <strong className="tabular-nums" style={{ fontSize: "1.1rem", color: "var(--ink)" }}>
                    {faNumber(selectedClinic.ltvTomans.toLocaleString())}{" "}
                    <span style={{ fontSize: "0.75rem", fontWeight: "normal" }}>تومان</span>
                  </strong>
                  <small style={{ display: "block", color: "var(--muted)", fontSize: "0.74rem", marginTop: "2px" }}>
                    مجموع {faNumber(selectedClinic.totalOrders)} سفارش ثبت‌شده
                  </small>
                </div>

                <div style={{ background: "var(--paper)", padding: "12px 14px", borderRadius: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>سقف و مصرف اعتبار</span>
                  <strong className="tabular-nums" style={{ fontSize: "1.1rem", color: "var(--brand-deep)" }}>
                    {faNumber(selectedClinic.creditUsedTomans.toLocaleString())} / {faNumber(selectedClinic.creditLimitTomans.toLocaleString())}
                  </strong>
                  <small style={{ display: "block", color: "#d97706", fontSize: "0.74rem", marginTop: "2px" }}>
                    شرایط: {selectedClinic.paymentTerms}
                  </small>
                </div>

                <div style={{ background: "var(--paper)", padding: "12px 14px", borderRadius: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>رتبه خوش‌حسابی</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                    <span
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        color: selectedClinic.paymentScore.startsWith("A") ? "#047857" : "#b45309",
                      }}
                    >
                      {selectedClinic.paymentScore}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                      تسویه به‌موقع بدون تاخیر
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Competence & Stations */}
              <div
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "0.92rem", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Stethoscope size={18} color="var(--brand)" />
                  صلاحیت‌های علمی و تجهیزات مستقر در کلینیک
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.82rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Award size={18} color="#059669" />
                    <div>
                      <span style={{ color: "var(--muted)", display: "block" }}>گواهی پروتکل اثر بور (Bohr Effect):</span>
                      <strong style={{ color: selectedClinic.bohrCertificationStatus === "CERTIFIED" ? "#047857" : "#d97706" }}>
                        {selectedClinic.bohrCertificationStatus === "CERTIFIED"
                          ? "✓ دارای گواهی رسمی مستری"
                          : "در حال گذراندن دوره آموزش"}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={18} color="#0284c7" />
                    <div>
                      <span style={{ color: "var(--muted)", display: "block" }}>دستگاه پلاسما‌ایکس (PlasmaX):</span>
                      <strong>
                        {selectedClinic.hardwareStationSN
                          ? `${selectedClinic.hardwareStationSN} (${selectedClinic.hardwareStationStatus === "CALIBRATED" ? "کالیبره" : "نیازمند سرویس"})`
                          : "بدون دستگاه پلاسما"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Address */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  fontSize: "0.82rem",
                  paddingBottom: "18px",
                  borderBottom: "1px solid var(--line)",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>تلفن تماس:</span>
                  <strong style={{ fontFamily: "monospace" }}>{selectedClinic.phone}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>ایمیل رسمی:</span>
                  <strong style={{ fontFamily: "monospace" }}>{selectedClinic.email}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>شهر و نشانی:</span>
                  <span>{selectedClinic.address}</span>
                </div>
              </div>

              {/* Interaction Notes Timeline */}
              <div>
                <h4 style={{ margin: "0 0 12px", fontSize: "0.92rem", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MessageSquare size={18} color="var(--brand)" />
                  یادداشت‌ها و تاریخچه تعاملات کلینیکال
                </h4>

                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="ثبت یادداشت جدید در پرونده کلینیک..."
                    className="admin-input"
                    style={{ flexGrow: 1, fontSize: "0.84rem", padding: "8px 12px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNote();
                    }}
                  />
                  <button
                    onClick={handleAddNote}
                    className="admin-btn"
                    style={{
                      padding: "8px 16px",
                      fontSize: "0.82rem",
                      background: "var(--brand-deep)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Plus size={16} />
                    ثبت
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedClinic.notes.map((note) => (
                    <div
                      key={note.id}
                      style={{
                        background: "var(--paper)",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "var(--muted)", fontSize: "0.75rem" }}>
                        <strong>{note.author}</strong>
                        <span>{formatJalaliDateTime(note.date)}</span>
                      </div>
                      <p style={{ margin: 0, color: "var(--ink)", lineHeight: "1.5" }}>{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-section-box" style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
              جهت مشاهده پرونده ۳۶۰ درجه، یک کلینیک را از ستون روبرو انتخاب فرمایید.
            </div>
          )}
        </div>

        {/* ── Right Side: Search & Directory List ── */}
        <div>
          <div className="admin-section-box" style={{ marginBottom: "16px", padding: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="جستجو در نام کلینیک، پزشک، شهر یا پروانه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input"
                style={{ width: "100%", fontSize: "0.82rem", padding: "8px 12px" }}
              />

              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  aria-label="فیلتر رده کلینیک"
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="admin-input"
                  style={{ flex: 1, fontSize: "0.78rem", padding: "6px" }}
                >
                  <option value="ALL">همه رده‌ها</option>
                  <option value="VIP_PLATINUM">VIP پلاتینوم</option>
                  <option value="GOLD">طلایی (Gold)</option>
                  <option value="STANDARD">استاندارد</option>
                </select>

                <select
                  aria-label="فیلتر وضعیت پروانه پزشکی"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-input"
                  style={{ flex: 1, fontSize: "0.78rem", padding: "6px" }}
                >
                  <option value="ALL">همه وضعیت‌ها</option>
                  <option value="VERIFIED">پروانه معتبر</option>
                  <option value="PENDING_RENEWAL">در انتظار تمدید</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  style={{
                    background: isSelected ? "linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)" : "#ffffff",
                    border: `1.5px solid ${isSelected ? "var(--brand)" : "rgba(226, 232, 240, 0.9)"}`,
                    borderRadius: "14px",
                    padding: "14px 16px",
                    boxShadow: isSelected ? "0 4px 14px rgba(13, 148, 136, 0.12)" : "0 2px 6px rgba(15, 23, 42, 0.03)",
                    cursor: "pointer",
                    transition: "all .15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-deep)" }}>
                      {clinic.id}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: clinic.licenseStatus === "VERIFIED" ? "#ecfdf5" : "#fffbeb",
                        color: clinic.licenseStatus === "VERIFIED" ? "#047857" : "#b45309",
                      }}
                    >
                      {clinic.licenseStatus === "VERIFIED" ? "تأیید شده" : "تمدید"}
                    </span>
                  </div>

                  <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--ink)", marginBottom: "4px" }}>
                    {clinic.clinicName}
                  </strong>

                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
                    <span>{clinic.medicalDirector} ({clinic.city})</span>
                    <span className="tabular-nums" style={{ fontWeight: 600, color: "var(--brand-deep)" }}>
                      LTV: {faNumber(clinic.ltvTomans.toLocaleString())} ت
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
