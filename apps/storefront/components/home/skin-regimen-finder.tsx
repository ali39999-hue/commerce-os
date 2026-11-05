"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../cart";

export function SkinRegimenFinderWidget() {
  const { addItem, openDrawer } = useCart();
  const [skinType, setSkinType] = useState<string>("oily_acne");
  const [targetGoal, setTargetGoal] = useState<string>("clarity");
  const [sessionCadence, setSessionCadence] = useState<string>("weekly");
  const [isAdded, setIsAdded] = useState(false);

  // Recommendations matrix:
  // Glycolic CarboxyGel + Carbo-Pod Carbon
  // Azelaic Acid CarboxyGel + Hydra-Pod
  // Multi-Active CarboxyGel + Vita-Pod
  const getRecommendation = () => {
    if (targetGoal === "anti_aging" || skinType === "dry_mature") {
      return {
        gelName: "کربوکسی‌ژل اسید گلیکولیک CarboxyGel™",
        gelSub: "ReeSkin™ Glycolic 10% + Matrixyl 3000 · pH 3.5",
        podName: "پاد ترابافتی CarboxyPod Carbo-Pod",
        podDesc: "محرک سنتز فیبروبلاست و نوسازی کلاژن نوع ۱ و ۳",
        actives: ["اسید گلیکولیک ۱۰٪", "پپتید ماتریکسیل", "اسید هیالورونیک ریزمولکول"],
        image: "/assets/drdermer/2025/07/glycolic-acid-carboxygel-600x600.png",
        variantId: "glycolic-gel-1",
        price: 2680000,
        badge: "کاندید ایده‌آل جوانسازی و خطوط عمیق",
      };
    }
    if (targetGoal === "clarity" || skinType === "oily_acne") {
      return {
        gelName: "کربوکسی‌ژل اسید آزالائیک CarboxyGel™",
        gelSub: "ReeSkin™ Azelaic 15% + Niacinamide 4% · pH 4.0",
        podName: "پاد ترابافتی CarboxyPod Hydra-Pod",
        podDesc: "مهارکننده تیروزیناز، ضداکنه و ضدلک التهابی PIH",
        actives: ["اسید آزالائیک ۱۵٪", "نیاسینامید ۴٪", "ترانگزامیک اسید ۲٪"],
        image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png",
        variantId: "azelaic-gel-1",
        price: 2450000,
        badge: "کاندید ایده‌آل لک ملاسما و آکنه",
      };
    }
    // Default / Sensitive / Barrier
    return {
      gelName: "کربوکسی‌ژل مولتی‌اکتیو CarboxyGel™",
      gelSub: "ReeSkin™ Biomimetic Peptides & Ceramide NP · pH 3.8",
      podName: "پاد ترابافتی CarboxyPod Vita-Pod",
      podDesc: "ترمیم سد دفاعی آسیب‌دیده، تسکین روزاسه و اریتم عروقی",
      actives: ["فاکتور رشد بیومیمتیک EGF", "پپتید مس GHK-Cu", "سرامید NP و پانتنول"],
      image: "/assets/drdermer/2025/07/multi-active-carboxygel-600x600.png",
      variantId: "multi-gel-1",
      price: 2550000,
      badge: "کاندید ایده‌آل سد دفاعی و پوست حساس",
    };
  };

  const rec = getRecommendation();

  const handleAddToCart = () => {
    addItem({
      variantId: rec.variantId,
      productId: "finder-" + rec.variantId,
      title: rec.gelName,
      sku: "FINDER-" + rec.variantId.toUpperCase(),
      priceAmount: (BigInt(rec.price) * 10n).toString(),
      image: rec.image,
    }, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openDrawer();
    }, 800);
  };

  return (
    <section className="regimen-finder-section" aria-labelledby="finder-title">
      <div className="regimen-finder-card">
        {/* Header */}
        <div className="rf-header">
          <div className="rf-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            INTELLIGENT 3-STEP CARBOXYGEL MATCHER
          </div>
          <h2 id="finder-title" className="rf-title">
            ابزار هوشمند انتخاب ژل کربوکسی و پاد فعال‌ساز سازگار
          </h2>
          <p className="rf-lead">
            پاسخ به ۳ پرسش بالینی جهت دریافت نسخه دقیق فرمولاسیون CarboxyGel (گلیکولیک، آزالائیک یا مولتی‌اکتیو) متناسب با ساختار بیوشیمیایی پوست شما.
          </p>
        </div>

        {/* Interactive 3-Step Controls & Instant Recommendation Grid */}
        <div className="rf-interactive-wrap">
          {/* Questions Side */}
          <div className="rf-questions-side">
            {/* Question 1 */}
            <div className="rf-q-block">
              <label className="rf-q-label">
                <span className="q-num">۱</span>
                <span>نوع و وضعیت پوست شما:</span>
              </label>
              <div className="rf-pills-row">
                <button
                  type="button"
                  className={`rf-pill-btn ${skinType === "oily_acne" ? "active" : ""}`}
                  onClick={() => setSkinType("oily_acne")}
                >
                  چرب / مستعد آکنه و کومدون
                </button>
                <button
                  type="button"
                  className={`rf-pill-btn ${skinType === "dry_mature" ? "active" : ""}`}
                  onClick={() => setSkinType("dry_mature")}
                >
                  خشک، بالغ یا دارای خطوط
                </button>
                <button
                  type="button"
                  className={`rf-pill-btn ${skinType === "sensitive_barrier" ? "active" : ""}`}
                  onClick={() => setSkinType("sensitive_barrier")}
                >
                  حساس، مستعد قرمزی و روزاسه
                </button>
              </div>
            </div>

            {/* Question 2 */}
            <div className="rf-q-block">
              <label className="rf-q-label">
                <span className="q-num">۲</span>
                <span>هدف اولیه درمانی:</span>
              </label>
              <div className="rf-pills-row">
                <button
                  type="button"
                  className={`rf-pill-btn ${targetGoal === "clarity" ? "active" : ""}`}
                  onClick={() => setTargetGoal("clarity")}
                >
                  روشن‌سازی لک و یکدستی رنگ
                </button>
                <button
                  type="button"
                  className={`rf-pill-btn ${targetGoal === "anti_aging" ? "active" : ""}`}
                  onClick={() => setTargetGoal("anti_aging")}
                >
                  کلاژن‌سازی و رفع خطوط عمیق
                </button>
                <button
                  type="button"
                  className={`rf-pill-btn ${targetGoal === "barrier_repair" ? "active" : ""}`}
                  onClick={() => setTargetGoal("barrier_repair")}
                >
                  ترمیم فوری سد دفاعی و رفع سوزش
                </button>
              </div>
            </div>

            {/* Question 3 */}
            <div className="rf-q-block">
              <label className="rf-q-label">
                <span className="q-num">۳</span>
                <span>تواتر درمانی مدنظر:</span>
              </label>
              <div className="rf-pills-row">
                <button
                  type="button"
                  className={`rf-pill-btn ${sessionCadence === "weekly" ? "active" : ""}`}
                  onClick={() => setSessionCadence("weekly")}
                >
                  هفته‌ای یک‌بار (پروتکل استاندارد)
                </button>
                <button
                  type="button"
                  className={`rf-pill-btn ${sessionCadence === "biweekly" ? "active" : ""}`}
                  onClick={() => setSessionCadence("biweekly")}
                >
                  هفته‌ای دوبار (دوره فشرده ۴ هفته‌ای)
                </button>
              </div>
            </div>
          </div>

          {/* Recommendation Output Side */}
          <div className="rf-recommendation-side">
            <span className="rf-rec-badge">{rec.badge}</span>

            <div className="rf-rec-top">
              <div className="rf-rec-thumb-box">
                <img src={rec.image} alt={rec.gelName} className="rf-rec-thumb" />
              </div>
              <div className="rf-rec-info">
                <span className="rf-rec-brand">RECOMMENDED CARBOXYGEL</span>
                <h3 className="rf-rec-title">{rec.gelName}</h3>
                <p className="rf-rec-sub">{rec.gelSub}</p>
              </div>
            </div>

            <div className="rf-match-pod">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              <div>
                <span>پاد فعال‌ساز همگام: </span>
                <strong>{rec.podName}</strong>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{rec.podDesc}</div>
              </div>
            </div>

            <div className="rf-actives-list">
              {rec.actives.map((act) => (
                <span key={act} className="rf-active-tag">{act}</span>
              ))}
            </div>

            <button
              type="button"
              className="rf-add-cart-btn"
              onClick={handleAddToCart}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  به سبد نسخه افزوده شد!
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  افزودن این کیت پیشنهادی به سبد ({rec.price.toLocaleString("fa-IR")} تومان)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
