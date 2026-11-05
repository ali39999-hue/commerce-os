'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { type Ingredient } from '../../lib/ingredients';

interface Props {
  ingredients: Ingredient[];
}

export function IngredientsInteractiveRegistry({ ingredients }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [pregnancyFilter, setPregnancyFilter] = useState(false);

  const classes = useMemo(() => {
    const set = new Set<string>();
    ingredients.forEach((i) => {
      if (i.chemicalClass) set.add(i.chemicalClass);
    });
    return Array.from(set);
  }, [ingredients]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ingredients.filter((ing) => {
      if (pregnancyFilter && ing.safetyProfile.pregnancySafe !== true) {
        return false;
      }
      if (selectedClass !== 'all' && ing.chemicalClass !== selectedClass) {
        return false;
      }
      if (!q) return true;
      return (
        ing.nameFa.toLowerCase().includes(q) ||
        ing.inciName.toLowerCase().includes(q) ||
        ing.casNumber.toLowerCase().includes(q) ||
        ing.clinicalRole.toLowerCase().includes(q) ||
        ing.chemicalClass.toLowerCase().includes(q) ||
        ing.safetyProfile.cirRating.toLowerCase().includes(q) ||
        ing.biologicalMechanism.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [ingredients, searchQuery, selectedClass, pregnancyFilter]);

  return (
    <div>
      {/* ── Search & Filter Control Bar ── */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جست‌وجوی پیشرفته در دانشنامه (نام فارسی، INCI بین‌المللی، شماره ثبت CAS، عملکرد بیوشیمیایی)..."
              aria-label="جست‌وجوی ترکیبات INCI"
              style={{
                width: '100%',
                padding: '14px 44px 14px 16px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: '0.94rem',
                outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: 'var(--muted)',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                aria-label="پاکسازی جستجو"
              >
                ✕
              </button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>
                فیلتر بر اساس دسته بیولوژیک:
              </span>
              <button
                type="button"
                onClick={() => setSelectedClass('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: selectedClass === 'all' ? 'var(--brand)' : 'var(--line)',
                  background: selectedClass === 'all' ? 'var(--brand-tint)' : 'var(--paper)',
                  color: selectedClass === 'all' ? 'var(--brand-deep)' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                همه ({ingredients.length})
              </button>
              {classes.slice(0, 4).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedClass(c === selectedClass ? 'all' : c)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: selectedClass === c ? 'var(--brand)' : 'var(--line)',
                    background: selectedClass === c ? 'var(--brand-tint)' : 'var(--paper)',
                    color: selectedClass === c ? 'var(--brand-deep)' : 'var(--ink)',
                    cursor: 'pointer',
                    maxWidth: '220px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={c}
                >
                  {c.split('/')[0].trim()}
                </button>
              ))}
            </div>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--ink)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={pregnancyFilter}
                onChange={(e) => setPregnancyFilter(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>فقط فرمول‌های مجاز در بارداری (Pregnancy Safe)</span>
            </label>
          </div>
        </div>

        <div
          style={{
            marginTop: '14px',
            fontSize: '0.82rem',
            color: 'var(--muted)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>تعداد ترکیبات منطبق: {new Intl.NumberFormat('fa-IR').format(filtered.length)} ماده مؤثره</span>
          {(searchQuery || selectedClass !== 'all' || pregnancyFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('all');
                setPregnancyFilter(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              پاکسازی فیلترها ↺
            </button>
          )}
        </div>
      </div>

      {/* ── Ingredients Grid ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'var(--surface)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧪</div>
          <h3>ترکیبی با مشخصات جستجویافته یافت نشد</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            می‌توانید عبارت جستجو را کوتاه‌تر کرده یا نام انگلیسی INCI را امتحان فرمایید.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {filtered.map((ing) => (
            <article
              key={ing.id}
              id={ing.slug}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: 'var(--shadow-card)',
                scrollMarginTop: '110px',
              }}
            >
              {/* Header info */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '14px',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: '18px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: 'var(--brand-tint)',
                        color: 'var(--brand-deep)',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        padding: '3px 12px',
                        borderRadius: '999px',
                        display: 'inline-block',
                      }}
                    >
                      {ing.chemicalClass}
                    </span>
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        direction: 'ltr',
                      }}
                      title="شماره استاندارد Chemical Abstracts Service"
                    >
                      CAS: {ing.casNumber}
                    </span>
                  </div>

                  <h2 style={{ margin: '0 0 6px', fontSize: '1.45rem', color: 'var(--brand-deep)' }}>{ing.nameFa}</h2>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.86rem',
                      color: '#475569',
                      direction: 'ltr',
                      textAlign: 'right',
                    }}
                  >
                    <strong>INCI:</strong> {ing.inciName}
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--paper)',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>دوز بالینی استاندارد:</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)', marginTop: '2px' }}>
                    {ing.clinicalConcentration}
                  </div>
                </div>
              </div>

              {/* Clinical Role and Biological Mechanisms */}
              <div style={{ marginBottom: "22px" }}>
                <h3 style={{ fontSize: "1.05rem", color: "var(--ink)", margin: "0 0 8px" }}>
                  🎯 نقش بالینی و تارگت‌های فیزیولوژیک
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.8", color: "#334155", margin: "0 0 14px" }}>
                  {ing.clinicalRole}
                </p>

                <h4 style={{ fontSize: "0.9rem", color: "var(--brand-deep)", margin: "0 0 8px" }}>
                  مکانیسم عملکرد بیولوژیک در سطح سلول:
                </h4>
                <ul style={{ margin: 0, paddingRight: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {ing.biologicalMechanism.map((mech, idx) => (
                    <li key={idx} style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: "1.8" }}>
                      {mech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Profile Matrix */}
              <div
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontSize: "0.95rem", color: "var(--brand-deep)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🛡️</span>
                  <span>پروفایل ایمنی و سم‌شناسی (CIR & Safety Matrix)</span>
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>ارزیابی ایمنی CIR Rating:</span>
                    <strong style={{ fontSize: "0.82rem", color: "#047857" }}>{ing.safetyProfile.cirRating}</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>کد شناسایی استاندارد CAS:</span>
                    <strong style={{ fontSize: "0.82rem", color: "var(--ink)", fontFamily: "monospace" }} dir="ltr">{ing.casNumber}</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>شاخص کومدوژنیک (Comedogenic):</span>
                    <strong style={{ fontSize: "0.82rem", color: "var(--ink)" }}>{ing.safetyProfile.comedogenicRating} از ۵</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>تحمل‌پذیری پوستی:</span>
                    <strong style={{ fontSize: "0.82rem", color: "var(--ink)" }}>{ing.safetyProfile.tolerability}</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>ایمنی در دوران بارداری:</span>
                    <strong
                      style={{
                        fontSize: "0.82rem",
                        color:
                          ing.safetyProfile.pregnancySafe === true
                            ? "#047857"
                            : ing.safetyProfile.pregnancySafe === "ممنوع در بارداری"
                            ? "#b91c1c"
                            : "#b45309",
                      }}
                    >
                      {ing.safetyProfile.pregnancySafe === true ? "مجاز و ایمن" : String(ing.safetyProfile.pregnancySafe)}
                    </strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ display: "block", fontSize: "0.74rem", color: "var(--muted)" }}>محدوده پایداری pH:</span>
                    <strong style={{ fontSize: "0.82rem", color: "var(--ink)" }} dir="ltr">
                      {ing.safetyProfile.phRange}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Synergies & Incompatibilities */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 10px", color: "#166534", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🤝</span>
                    <span>سینرژی و ترکیب‌های هم‌افزا (Synergistic Pairings):</span>
                  </h4>
                  <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {ing.synergisticCombinations.map((syn, sIdx) => (
                      <li key={sIdx} style={{ fontSize: "0.84rem", color: "#14532d", lineHeight: "1.7" }}>
                        <strong>{syn.withIngredient}:</strong> {syn.mechanism}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 10px", color: "#9a3412", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>⚡</span>
                    <span>تداخلات فرمولاسیونی و ناسازگاری‌ها:</span>
                  </h4>
                  <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {ing.incompatibilities.map((inc, iIdx) => (
                      <li key={iIdx} style={{ fontSize: "0.84rem", color: "#7c2d12", lineHeight: "1.7" }}>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Clinical Evidence Note */}
              <div
                style={{
                  borderTop: "1px dashed var(--line)",
                  paddingTop: "14px",
                  fontSize: "0.82rem",
                  color: "var(--muted)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>شواهد بالینی مرجع:</strong> {ing.clinicalEvidence}
                </div>
                <Link href="/blog" style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
                  مطالعه مقالات مرتبط با این ترکیب ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
