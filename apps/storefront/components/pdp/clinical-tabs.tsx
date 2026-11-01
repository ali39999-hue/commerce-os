'use client';

import React, { useState } from 'react';
import { ExtendedProductData } from '../../lib/pdp-types';
import { InciExplorer } from './inci-explorer';
import { ProtocolTimerSimulation } from './protocol-timer-simulation';
import { ClinicalCaseStudies } from './clinical-case-studies';

interface ClinicalTabsProps {
  productData: ExtendedProductData;
  productSlug: string;
  reviewsElement?: React.ReactNode;
}

type TabKey = 'science' | 'ingredients' | 'protocol' | 'cases' | 'authenticity' | 'faq';

const TAB_DEFS: Array<{ key: TabKey; labelFa: string; icon: string }> = [
  { key: 'science', labelFa: 'توضیحات و عملکرد علمی', icon: '🧬' },
  { key: 'ingredients', labelFa: 'ترکیبات فعال و INCI Explorer', icon: '🧪' },
  { key: 'protocol', labelFa: 'پروتکل و تایمر هوشمند درمان', icon: '⏱️' },
  { key: 'cases', labelFa: 'نتایج VISIA و کیس‌های بالینی', icon: '🔬' },
  { key: 'authenticity', labelFa: 'اطلاعات بالینی و اصالت کالا', icon: '🛡️' },
  { key: 'faq', labelFa: 'پرسش‌های متداول (FAQ) و نظرات', icon: '💬' },
];

export function ClinicalTabs({ productData, reviewsElement }: ClinicalTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('science');

  return (
    <section className="pdp-tabs-section" aria-label="مشخصات بالینی و فنی محصول">
      {/* Desktop Tabs Header */}
      <div className="pdp-tabs-nav-bar" role="tablist" aria-label="بخش‌های اطلاعات تخصصی کالا">
        {TAB_DEFS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              id={`tab-${tab.key}`}
              aria-controls={`panel-${tab.key}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`pdp-tab-trigger ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="pdp-tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="pdp-tab-label">{tab.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pdp-tab-panels-wrapper">
        {/* 1. Science & Clinical Mechanism */}
        <div
          id="panel-science"
          role="tabpanel"
          aria-labelledby="tab-science"
          hidden={activeTab !== 'science'}
          className="pdp-tab-panel"
        >
          <div className="pdp-science-content">
            <div className="pdp-science-hero-banner">
              <div className="pdp-science-badge">مکانیسم بیولوژیکی فعال</div>
              <h3>{productData.scienceMechanism.heading}</h3>
              <p className="pdp-mechanism-summary">{productData.scienceMechanism.summary}</p>
            </div>

            {productData.scienceMechanism.bohrEffectExplanation && (
              <div className="pdp-bohr-effect-card">
                <div className="pdp-bohr-header">
                  <span className="pdp-bohr-badge">مکانیسم اثر بوهر (Bohr Effect)</span>
                  <h4>اکسیژن‌رسانی درونی و ترشح هموگلوبین</h4>
                </div>
                <p className="pdp-bohr-desc">{productData.scienceMechanism.bohrEffectExplanation}</p>
                <div className="pdp-bohr-graph-visual">
                  <div className="pdp-bohr-step">
                    <span className="step-num">۱</span>
                    <span className="step-txt">رهایش موضعی CO2 از ماتریکس ژل</span>
                  </div>
                  <div className="pdp-bohr-arrow" aria-hidden="true">←</div>
                  <div className="pdp-bohr-step">
                    <span className="step-num">۲</span>
                    <span className="step-txt">کاهش موضعی pH عروق ریزگردش</span>
                  </div>
                  <div className="pdp-bohr-arrow" aria-hidden="true">←</div>
                  <div className="pdp-bohr-step highlight">
                    <span className="step-num">۳</span>
                    <span className="step-txt">انفجار اکسیژن آزاد (O2) به سلول‌های پوست</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pdp-clinical-benefits-grid">
              <h4>مزایای فیزیولوژیک اثبات‌شده بالینی:</h4>
              <ul>
                {productData.scienceMechanism.clinicalBenefits.map((benefit, i) => (
                  <li key={i}>
                    <span className="check-bullet" aria-hidden="true">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {productData.scienceMechanism.studyReference && (
              <p className="pdp-study-ref">
                <strong>منبع بالینی:</strong> {productData.scienceMechanism.studyReference}
              </p>
            )}
          </div>
        </div>

        {/* 2. Key Actives & INCI with Interactive INCI Explorer */}
        <div
          id="panel-ingredients"
          role="tabpanel"
          aria-labelledby="tab-ingredients"
          hidden={activeTab !== 'ingredients'}
          className="pdp-tab-panel"
        >
          <div className="pdp-clean-badges-row">
            {productData.cleanBadges.map((badge, i) => (
              <span key={i} className="pdp-clean-badge-item">
                <span className="clean-leaf" aria-hidden="true">🌿</span>
                {badge}
              </span>
            ))}
          </div>

          {/* Interactive INCI Explorer with Drawer & Biochemical Mechanisms */}
          <InciExplorer ingredients={productData.ingredients} />

          {/* Fallback & Full Standard Table */}
          <div className="pdp-ingredients-wrap">
            <h4 className="mt-8">جدول رسمی مشخصات فارماکوپه ترکیبات</h4>
            <div className="pdp-ingredients-table-responsive">
              <table className="pdp-ingredients-table">
                <thead>
                  <tr>
                    <th scope="col">نام ترکیب و نقش</th>
                    <th scope="col">نام رسمی INCI</th>
                    <th scope="col">خلوص / دوز</th>
                    <th scope="col">رتبه ایمنی CIR</th>
                    <th scope="col">عملکرد تخصصی در پوست</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.ingredients.map((ing, idx) => (
                    <tr key={idx} className={ing.isKeyActive ? 'key-active-row' : ''}>
                      <td>
                        <div className="ing-name-wrap">
                          {ing.isKeyActive && <span className="star-tag" title="اکتیو کلیدی">★</span>}
                          <strong>{ing.nameFa}</strong>
                        </div>
                      </td>
                      <td className="inci-col" dir="ltr">{ing.inciName}</td>
                      <td>{ing.purity || ing.percentage || '—'}</td>
                      <td>{ing.cirRating || 'Safe as Used'}</td>
                      <td>{ing.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pdp-full-inci-card">
              <h5>فهرست کامل ترکیبات طبق رگولاتوری بین‌المللی (Full INCI Declaration):</h5>
              <p className="pdp-inci-raw" dir="ltr">
                {productData.ingredients.map((ing) => ing.inciName).join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Usage Protocol with Interactive Simulation & Countdown */}
        <div
          id="panel-protocol"
          role="tabpanel"
          aria-labelledby="tab-protocol"
          hidden={activeTab !== 'protocol'}
          className="pdp-tab-panel"
        >
          {/* Interactive Protocol Timer & Usage Simulation */}
          <ProtocolTimerSimulation />

          <div className="pdp-protocol-wrap mt-8">
            <div className="pdp-routine-timing-pill">
              <span>زمان‌بندی توصیه شده: </span>
              <strong>{productData.usageProtocol.routineTime}</strong>
            </div>

            <div className="pdp-steps-timeline">
              {productData.usageProtocol.steps.map((st) => {
                const STEP_ICONS: Record<number, string> = {
                  1: '🧴', // Cleansing
                  2: '🧪', // Application
                  3: '🫧', // Activation
                  4: '💧', // Rinse
                  5: '✨', // Recovery
                };
                return (
                  <div key={st.stepNumber} className="pdp-step-card">
                    <div className="pdp-step-circle">
                      <span className="step-icon-badge" aria-hidden="true">{STEP_ICONS[st.stepNumber] || '✦'}</span>
                      <span className="step-index-num">{st.stepNumber}</span>
                    </div>
                    <div className="pdp-step-body">
                      <div className="pdp-step-title-row">
                        <h5>{st.title}</h5>
                        {st.frequency && <span className="pdp-step-freq">{st.frequency}</span>}
                      </div>
                      <p className="pdp-step-inst">{st.instruction}</p>
                      {st.warning && (
                        <div className="pdp-step-subwarn">
                          <span aria-hidden="true">⚠️</span> {st.warning}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pdp-pre-post-cards-grid">
              <div className="pdp-guidance-card pre">
                <h6>آمادگی قبل از درمان (Pre-Procedure)</h6>
                <p>{productData.usageProtocol.preProcedure}</p>
              </div>
              <div className="pdp-guidance-card post">
                <h6>مراقبت‌های پس از درمان (Post-Procedure)</h6>
                <p>{productData.usageProtocol.postProcedureCare}</p>
              </div>
            </div>

            {productData.usageProtocol.warnings.length > 0 && (
              <div className="pdp-protocol-warnings-box" role="alert">
                <h6>هشدارهای بالینی و منع مصرف:</h6>
                <ul>
                  {productData.usageProtocol.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 4. Clinical Case Studies & Visia Results Tab */}
        <div
          id="panel-cases"
          role="tabpanel"
          aria-labelledby="tab-cases"
          hidden={activeTab !== 'cases'}
          className="pdp-tab-panel"
        >
          {productData.clinicalCaseStudies && productData.clinicalCaseStudies.length > 0 ? (
            <ClinicalCaseStudies studies={productData.clinicalCaseStudies} />
          ) : (
            <div className="pdp-no-cases-banner">
              <span className="info-icon" aria-hidden="true">🔬</span>
              <div>
                <h5>مستندات کارآزمایی بالینی و کیس‌استادی‌های اختصاصی</h5>
                <p>
                  داده‌های بالینی استاندارد Canfield VISIA برای این دسته از اقلام بر اساس پروتکل‌های مرکز تحقیقات درماتولوژی در حال به‌روزرسانی نهایی می‌باشد.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 5. Authenticity & Certificates */}
        <div
          id="panel-authenticity"
          role="tabpanel"
          aria-labelledby="tab-authenticity"
          hidden={activeTab !== 'authenticity'}
          className="pdp-tab-panel"
        >
          <div className="pdp-authenticity-content">
            <div className="pdp-certs-grid">
              {productData.clinicalOrigin.certifications.map((cert, idx) => (
                <div key={idx} className="pdp-cert-card">
                  <div className="pdp-cert-header">
                    <span className="pdp-cert-icon" aria-hidden="true">🏅</span>
                    <div>
                      <h5>{cert.title}</h5>
                      <span className="pdp-cert-issuer">مرجع صادرکننده: {cert.issuer}</span>
                    </div>
                  </div>
                  <div className="pdp-cert-code-row">
                    <span>شماره ثبت رسمی: </span>
                    <code dir="ltr">{cert.certificateCode}</code>
                  </div>
                  <p className="pdp-cert-desc">{cert.description}</p>
                  {cert.verified && <span className="pdp-cert-status-badge">✓ تأیید و رجیستر شده</span>}
                </div>
              ))}
            </div>

            <div className="pdp-authenticity-details-grid">
              <div className="pdp-auth-item">
                <span className="pdp-auth-icon">🔍</span>
                <div>
                  <strong>استعلام اصالت بچ‌کد (Batch Code)</strong>
                  <p>{productData.clinicalOrigin.batchCodeVerificationInfo}</p>
                </div>
              </div>

              <div className="pdp-auth-item">
                <span className="pdp-auth-icon">🌡️</span>
                <div>
                  <strong>شرایط نگهداری و انبارداری</strong>
                  <p>{productData.clinicalOrigin.storageConditions}</p>
                </div>
              </div>

              <div className="pdp-auth-item">
                <span className="pdp-auth-icon">⏳</span>
                <div>
                  <strong>مدت زمان مصرف پس از باز کردن (PAO)</strong>
                  <p>{productData.clinicalOrigin.shelfLifeAfterOpening}</p>
                </div>
              </div>
            </div>

            <div className="pdp-standards-tags-row">
              <span className="standards-label">استانداردهای بین‌المللی منطبق:</span>
              {productData.clinicalOrigin.ceIsoStandards.map((std, i) => (
                <span key={i} className="std-pill" dir="ltr">{std}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 6. FAQs & Reviews */}
        <div
          id="panel-faq"
          role="tabpanel"
          aria-labelledby="tab-faq"
          hidden={activeTab !== 'faq'}
          className="pdp-tab-panel"
        >
          <div className="pdp-faq-accordion-wrap">
            <h4>پرسش‌های متداول خریداران و اسکین‌تراپیست‌ها</h4>
            <div className="pdp-faq-list">
              {productData.faqs.map((faq, i) => (
                <details key={i} className="pdp-faq-item">
                  <summary className="pdp-faq-question">
                    <span>{faq.question}</span>
                    <span className="pdp-faq-chevron" aria-hidden="true">⌄</span>
                  </summary>
                  <div className="pdp-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {reviewsElement && (
            <div className="pdp-reviews-embed-wrap">
              {reviewsElement}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
