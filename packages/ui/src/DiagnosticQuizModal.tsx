import React, { useState } from "react";
import { designTokens } from "./tokens.js";
import { Modal } from "./Modal.js";
import { Button } from "./Button.js";
import { Badge } from "./Badge.js";
import { PriceTag } from "./PriceTag.js";

export type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive";
export type MainConcern = "aging_wrinkles" | "hyperpigmentation" | "acne_blemishes" | "barrier_repair" | "dullness";
export type TreatmentGoal = "rapid_correction" | "preventative_wellness" | "clinical_maintenance" | "post_procedure";
export type SensitivityLevel = "resilient" | "mildly_sensitive" | "highly_reactive" | "rosacea_prone";

export interface DiagnosticAnswers {
  skinType?: SkinType;
  mainConcern?: MainConcern;
  treatmentGoal?: TreatmentGoal;
  sensitivityLevel?: SensitivityLevel;
}

export interface RegimenRecommendation {
  protocolName: string;
  rationale: string;
  primaryProduct: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    badge?: string;
  };
  companionProducts?: {
    id: string;
    title: string;
    step: string;
  }[];
  contraindicationNotice?: string;
  expectedResultsWeeks: number;
}

export interface DiagnosticQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (answers: DiagnosticAnswers, recommendation: RegimenRecommendation) => void;
  onAddToCart?: (productId: string) => void;
}

export function DiagnosticQuizModal({
  isOpen,
  onClose,
  onComplete,
  onAddToCart,
}: DiagnosticQuizModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetQuiz, 300);
  };

  const skinTypeOptions: { value: SkinType; label: string; desc: string }[] = [
    { value: "dry", label: "پوست خشک و کم‌آب", desc: "احساس کشیدگی مداوم، زبری سطح پوست و کدری" },
    { value: "oily", label: "پوست چرب و مستعد جوش", desc: "ترشح بیش از حد سبوم، منافذ باز و براقیت مداوم" },
    { value: "combination", label: "پوست مختلط", desc: "چربی در ناحیه T-Zone و خشکی در گونه‌ها" },
    { value: "normal", label: "پوست نرمال و متعادل", desc: "تعادل طبیعی هیدرولیپیدی بدون احساس تحریک" },
    { value: "sensitive", label: "پوست حساس و واکنشی", desc: "قرمزی، سوزش و واکنش سریع به عوامل محیطی" },
  ];

  const concernOptions: { value: MainConcern; label: string; desc: string }[] = [
    { value: "aging_wrinkles", label: "خطوط، چروک و افتادگی", desc: "کاهش الاستیسیته فیبروبلاست‌ها و افتادگی کانتور صورت" },
    { value: "hyperpigmentation", label: "لک، ملاسما و تیرگی", desc: "تجمع غیریکنواخت ملانین و لک‌های پس از آکنه/آفتاب" },
    { value: "acne_blemishes", label: "آکنه، جوش و انسداد منافذ", desc: "تکثیر باکتری C. acnes و التهاب فولیکولی" },
    { value: "barrier_repair", label: "آسیب سد دفاعی پوست", desc: "پوست نازک شده بر اثر لایه‌برداری نامناسب یا رتینول" },
    { value: "dullness", label: "کدری و فقدان اکسیژن‌رسانی", desc: "عدم شفافیت سلولی و تجمع لایه‌های شاخی مرده" },
  ];

  const goalOptions: { value: TreatmentGoal; label: string; desc: string }[] = [
    { value: "rapid_correction", label: "اصلاح سریع بالینی (۲ تا ۴ هفته)", desc: "پروتکل فشرده با اکتیوهای قوی و نفوذ عمقی" },
    { value: "clinical_maintenance", label: "نگهداری بلندمدت و ارتقای ساختار", desc: "تثبیت نتایج درمان‌های مطبی و پیشگیری پایدار" },
    { value: "preventative_wellness", label: "پیشگیری و تقویت لایه شاخی", desc: "افزایش مقاومت پوست در برابر استرس اکسیداتیو" },
    { value: "post_procedure", label: "ریکاوری پس از پروسیجر کلینیکی", desc: "ترمیم فوق‌سریع پس از لیزر، میکرونیدلینگ یا پیلینگ" },
  ];

  const sensitivityOptions: { value: SensitivityLevel; label: string; desc: string }[] = [
    { value: "resilient", label: "مقاوم و سازگار", desc: "تحمل آسان AHA/BHA با درصدهای بالا و رتینوئیدها" },
    { value: "mildly_sensitive", label: "حساسیت خفیف", desc: "سوزش گذرا در زمان مصرف غلظت‌های بالای اسید" },
    { value: "highly_reactive", label: "بسیار واکنش‌پذیر", desc: "سوزش شدید، خارش و التهاب با اکثر محصولات اکتیو" },
    { value: "rosacea_prone", label: "مستعد روزاسه و اریتم", desc: "مویرگ‌های قابل مشاهده و گرگرفتگی‌های عروقی" },
  ];

  const generateRecommendation = (ans: DiagnosticAnswers): RegimenRecommendation => {
    if (ans.mainConcern === "aging_wrinkles" || ans.treatmentGoal === "rapid_correction") {
      return {
        protocolName: "پروتکل بیوانرژتیک کربوکسی‌تراپی و پپتید دکتر درمر",
        rationale: "تمرکز بر پدیده بور (Bohr Effect) جهت افزایش اکسیژن‌رسانی بافتی، تحریک سنتز کلاژن تیپ ۱ و اصلاح خطوط عمقی.",
        primaryProduct: {
          id: "dermer-co2-infusion",
          title: "ژل-ماسک کربوکسی ژنراتور کلینیکال Dr Dermer",
          description: "سامانه آزادسازی هدفمند CO2 در ماتریکس درمال با خلوص گرید دارویی برای بازسازی فوری ماتریکس خارج سلولی.",
          price: 2850000,
          currency: "IRT",
          badge: "پروتکل ارجح طلایی",
        },
        companionProducts: [
          { id: "dermer-cleanser", title: "فوم پاک‌کننده فیزیولوژیک آمینواسید", step: "مرحله ۱: آماده‌سازی" },
          { id: "dermer-barrier-cream", title: "کرم سرامیدی بازسازنده سد دفاعی Ceramide-NP", step: "مرحله ۳: ریکاوری" },
        ],
        expectedResultsWeeks: 3,
        contraindicationNotice: ans.sensitivityLevel === "highly_reactive" || ans.sensitivityLevel === "rosacea_prone"
          ? "با توجه به حساسیت عروقی شما، تست پچ ۲۴ ساعته در ناحیه فک الزامی بوده و زمان تماس مرحله اول به ۵ دقیقه محدود شود."
          : undefined,
      };
    }

    if (ans.mainConcern === "hyperpigmentation") {
      return {
        protocolName: "رژیم بالینی مهار ملانوژنز و ترانگزامیک اسید دکتر درمر",
        rationale: "مسدودسازی آبشار سنتز تیروزیناز و تسریع جایگزینی اپیدرمال با هماهنگی فاکتورهای روشن‌کننده بیوتکنولوژیک.",
        primaryProduct: {
          id: "dermer-txa-serum",
          title: "سرم ترانگزامیک ۵٪ و گلوتاتیون لیپوزومال",
          description: "درمان تخصصی ملاسما، لک‌های هورمونی و تیرگی‌های ناشی از اشعه ماورابنفش بدون ایجاد تحریک بافتی.",
          price: 2450000,
          currency: "IRT",
          badge: "فرمولاسیون پزشکی",
        },
        companionProducts: [
          { id: "dermer-enzyme-wash", title: "شوینده آنزیمی پاپایا و آربوتین", step: "مرحله ۱: لایه‌برداری ملایم" },
          { id: "dermer-mineral-spf", title: "ضدآفتاب مینرال با پوشش طیف کامل UVA/UVB", step: "مرحله روزانه: حفاظت" },
        ],
        expectedResultsWeeks: 4,
      };
    }

    return {
      protocolName: "پروتکل ترمیم بیومیمتیک و هیدراتاسیون عمیق سد پوستی",
      rationale: "بازسازی کمپلکس لیپیدی سیمان بین‌سلولی، مهار التهاب زیربالینی و تعادل میکروارگانیسم‌های مفید پوستی.",
      primaryProduct: {
        id: "dermer-barrier-elixir",
        title: "اکسیر بازسازنده استرول و سنتلا آسیاتیکا",
        description: "ترمیم عمیق فیبروبلاست‌ها و بازنشانی هموستاز پوست‌های دهیدراته و حساس.",
        price: 2190000,
        currency: "IRT",
        badge: "پروتکل ضدالتهاب",
      },
      companionProducts: [
        { id: "dermer-cleanser", title: "میسلار واتر غنی‌شده با زینک و آلانتوئین", step: "مرحله ۱: پاکسازی بدون تروما" },
        { id: "dermer-hyaluron-mist", title: "میست اسید هیالورونیک مولکولار چندگانه", step: "مرحله ۲: جذب عمقی" },
      ],
      expectedResultsWeeks: 2,
    };
  };

  const stepsList = [
    { title: "نوع ساختار پوست", field: "skinType" as keyof DiagnosticAnswers },
    { title: "عارضه و دغدغه اصلی", field: "mainConcern" as keyof DiagnosticAnswers },
    { title: "هدف و سرعت درمان", field: "treatmentGoal" as keyof DiagnosticAnswers },
    { title: "سطح تحریک‌پذیری", field: "sensitivityLevel" as keyof DiagnosticAnswers },
    { title: "نسخه بالینی رژیم", field: null },
  ];

  const recommendation = generateRecommendation(answers);

  const canProceed = () => {
    if (currentStep === 0) return !!answers.skinType;
    if (currentStep === 1) return !!answers.mainConcern;
    if (currentStep === 2) return !!answers.treatmentGoal;
    if (currentStep === 3) return !!answers.sensitivityLevel;
    return true;
  };

  const nextStep = () => {
    if (currentStep < 4) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 4) {
        onComplete?.(answers, recommendation);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      ariaLabel="پرسشنامه تشخیص بالینی پوست دکتر درمر"
      showCloseButton
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: designTokens.spacing[5],
          fontFamily: designTokens.typography.fontFamily.sans.join(", "),
        }}
      >
        {/* Progress Tracker */}
        <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: designTokens.typography.fontSize.xs,
                color: designTokens.colors.clinicalTeal[700],
                fontWeight: designTokens.typography.fontWeight.bold,
              }}
            >
              پرسشنامه ارزیابی درماتولوژیک Dr Dermer
            </span>
            <span
              style={{
                fontSize: designTokens.typography.fontSize.xs,
                color: designTokens.colors.text.muted,
              }}
            >
              {currentStep < 4 ? `مرحله ${currentStep + 1} از ۴` : "تحلیل و تجویز بالینی"}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: designTokens.colors.warmMarble.border,
              borderRadius: designTokens.radius.pill,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((currentStep + 1) / 5) * 100}%`,
                height: "100%",
                backgroundColor: designTokens.colors.clinicalTeal.DEFAULT,
                transition: `width ${designTokens.transitions.normal}`,
              }}
            />
          </div>
        </div>

        {/* Step 0: Skin Type */}
        {currentStep === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[3] }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.lg,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.text.primary,
                }}
              >
                ۱. ماهیت بیولوژیک و نوع پوست شما چیست؟
              </h2>
              <p
                style={{
                  margin: `${designTokens.spacing[1]} 0 0`,
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.text.muted,
                }}
              >
                انتخاب بر اساس وضعیت پوست شما ۲ ساعت پس از شستشو بدون مصرف مرطوب‌کننده
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
              {skinTypeOptions.map((opt) => {
                const isSelected = answers.skinType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, skinType: opt.value })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "start",
                      padding: designTokens.spacing[3],
                      borderRadius: designTokens.radius.md,
                      border: `1px solid ${
                        isSelected
                          ? designTokens.colors.clinicalTeal.DEFAULT
                          : designTokens.colors.warmMarble.border
                      }`,
                      backgroundColor: isSelected
                        ? designTokens.colors.clinicalTeal.tint
                        : designTokens.colors.surface.card,
                      cursor: "pointer",
                      transition: `all ${designTokens.transitions.fast}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.semibold,
                        color: isSelected ? designTokens.colors.clinicalTeal[800] : designTokens.colors.text.primary,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.text.muted,
                        marginTop: "2px",
                      }}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Main Concern */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[3] }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.lg,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.text.primary,
                }}
              >
                ۲. اصلی‌ترین دغدغه یا اولویت درمانی شما چیست؟
              </h2>
              <p
                style={{
                  margin: `${designTokens.spacing[1]} 0 0`,
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.text.muted,
                }}
              >
                پروتکل فعال اولیه روی این شاخص کالیبره خواهد شد
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
              {concernOptions.map((opt) => {
                const isSelected = answers.mainConcern === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, mainConcern: opt.value })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "start",
                      padding: designTokens.spacing[3],
                      borderRadius: designTokens.radius.md,
                      border: `1px solid ${
                        isSelected
                          ? designTokens.colors.clinicalTeal.DEFAULT
                          : designTokens.colors.warmMarble.border
                      }`,
                      backgroundColor: isSelected
                        ? designTokens.colors.clinicalTeal.tint
                        : designTokens.colors.surface.card,
                      cursor: "pointer",
                      transition: `all ${designTokens.transitions.fast}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.semibold,
                        color: isSelected ? designTokens.colors.clinicalTeal[800] : designTokens.colors.text.primary,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.text.muted,
                        marginTop: "2px",
                      }}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Treatment Goal */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[3] }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.lg,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.text.primary,
                }}
              >
                ۳. هدف و افق زمانی مطلوب برای دستیابی به نتایج:
              </h2>
              <p
                style={{
                  margin: `${designTokens.spacing[1]} 0 0`,
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.text.muted,
                }}
              >
                تعیین‌کننده دوزاژ و شدت نفوذ ترنس‌درمال
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
              {goalOptions.map((opt) => {
                const isSelected = answers.treatmentGoal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, treatmentGoal: opt.value })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "start",
                      padding: designTokens.spacing[3],
                      borderRadius: designTokens.radius.md,
                      border: `1px solid ${
                        isSelected
                          ? designTokens.colors.clinicalTeal.DEFAULT
                          : designTokens.colors.warmMarble.border
                      }`,
                      backgroundColor: isSelected
                        ? designTokens.colors.clinicalTeal.tint
                        : designTokens.colors.surface.card,
                      cursor: "pointer",
                      transition: `all ${designTokens.transitions.fast}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.semibold,
                        color: isSelected ? designTokens.colors.clinicalTeal[800] : designTokens.colors.text.primary,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.text.muted,
                        marginTop: "2px",
                      }}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Sensitivity Level */}
        {currentStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[3] }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.lg,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.text.primary,
                }}
              >
                ۴. میزان حساسیت و واکنش‌پذیری اپیدرمال شما:
              </h2>
              <p
                style={{
                  margin: `${designTokens.spacing[1]} 0 0`,
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.text.muted,
                }}
              >
                جهت تطبیق هشدارهای بالینی و فرمولاسیون فاقد آلرژن
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
              {sensitivityOptions.map((opt) => {
                const isSelected = answers.sensitivityLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, sensitivityLevel: opt.value })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "start",
                      padding: designTokens.spacing[3],
                      borderRadius: designTokens.radius.md,
                      border: `1px solid ${
                        isSelected
                          ? designTokens.colors.clinicalTeal.DEFAULT
                          : designTokens.colors.warmMarble.border
                      }`,
                      backgroundColor: isSelected
                        ? designTokens.colors.clinicalTeal.tint
                        : designTokens.colors.surface.card,
                      cursor: "pointer",
                      transition: `all ${designTokens.transitions.fast}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.semibold,
                        color: isSelected ? designTokens.colors.clinicalTeal[800] : designTokens.colors.text.primary,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.text.muted,
                        marginTop: "2px",
                      }}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Regimen Prescription Results */}
        {currentStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[4] }}>
            {/* Clinical Regimen Badge Header */}
            <div
              style={{
                backgroundColor: designTokens.colors.clinicalTeal[50],
                border: `1px solid ${designTokens.colors.clinicalTeal[200]}`,
                borderRadius: designTokens.radius.lg,
                padding: designTokens.spacing[4],
                display: "flex",
                flexDirection: "column",
                gap: designTokens.spacing[2],
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: designTokens.spacing[2] }}>
                <Badge variant="clinical" size="sm">
                  تجویز اختصاصی دکتر درمر
                </Badge>
                <Badge variant="success" size="sm">
                  اثربخشی در {recommendation.expectedResultsWeeks} هفته
                </Badge>
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.xl,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.clinicalTeal[900],
                }}
              >
                {recommendation.protocolName}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.clinicalTeal[800],
                  lineHeight: designTokens.typography.lineHeight.normal,
                }}
              >
                {recommendation.rationale}
              </p>
            </div>

            {/* Contraindication Alert if applicable */}
            {recommendation.contraindicationNotice && (
              <div
                style={{
                  backgroundColor: designTokens.colors.amberAccent[50],
                  border: `1px solid ${designTokens.colors.amberAccent[300]}`,
                  borderRadius: designTokens.radius.md,
                  padding: designTokens.spacing[3],
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.amberAccent[900],
                }}
              >
                <strong>توصیه ایمنی بالینی: </strong>
                {recommendation.contraindicationNotice}
              </div>
            )}

            {/* Primary Product Card */}
            <div
              style={{
                border: `1px solid ${designTokens.colors.warmMarble.border}`,
                borderRadius: designTokens.radius.md,
                padding: designTokens.spacing[4],
                backgroundColor: designTokens.colors.surface.card,
                display: "flex",
                flexDirection: "column",
                gap: designTokens.spacing[3],
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  {recommendation.primaryProduct.badge && (
                    <Badge variant="warning" size="sm">
                      {recommendation.primaryProduct.badge}
                    </Badge>
                  )}
                  <h3
                    style={{
                      margin: `${designTokens.spacing[1]} 0`,
                      fontSize: designTokens.typography.fontSize.base,
                      fontWeight: designTokens.typography.fontWeight.bold,
                      color: designTokens.colors.text.primary,
                    }}
                  >
                    {recommendation.primaryProduct.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: designTokens.typography.fontSize.xs,
                      color: designTokens.colors.text.secondary,
                    }}
                  >
                    {recommendation.primaryProduct.description}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: `1px solid ${designTokens.colors.warmMarble.subtle}`,
                  paddingTop: designTokens.spacing[2],
                }}
              >
                <PriceTag
                  amount={recommendation.primaryProduct.price}
                  currency={recommendation.primaryProduct.currency || "IRT"}
                  size="md"
                />

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAddToCart?.(recommendation.primaryProduct.id)}
                >
                  افزودن پروتکل به سبد
                </Button>
              </div>
            </div>

            {/* Companion Steps */}
            {recommendation.companionProducts && (
              <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
                <span
                  style={{
                    fontSize: designTokens.typography.fontSize.xs,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.text.secondary,
                  }}
                >
                  محصولات مکمل رژیم بالینی (Complementary Care):
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[1] }}>
                  {recommendation.companionProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                        backgroundColor: designTokens.colors.warmMarble.subtle,
                        borderRadius: designTokens.radius.sm,
                        fontSize: designTokens.typography.fontSize.xs,
                      }}
                    >
                      <span style={{ fontWeight: designTokens.typography.fontWeight.medium }}>{p.title}</span>
                      <span style={{ color: designTokens.colors.clinicalTeal[700] }}>{p.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${designTokens.colors.warmMarble.border}`,
            paddingTop: designTokens.spacing[3],
          }}
        >
          {currentStep < 4 ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                ← مرحله قبل
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                مرحله بعد →
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={resetQuiz}>
                شروع مجدد آزمون
              </Button>
              <Button variant="secondary" size="sm" onClick={handleClose}>
                بستن و ذخیره نتایج
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
