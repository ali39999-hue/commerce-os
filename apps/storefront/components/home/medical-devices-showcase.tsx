"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CanvasSequencePlayer, HotspotPin } from "../interactive/canvas-sequence-player";

interface DeviceHotspot {
  id: number;
  label: string;
  frame: number;
  x: number; // percentage left
  y: number; // percentage top
  title: string;
  desc: string;
  spec: string;
}

interface MedicalDevice {
  id: "carbox" | "plasmax";
  name: string;
  subtitle: string;
  badge: string;
  classTag: string;
  image: string;
  frameFolder: string;
  totalFrames: number;
  framePrefix: string;
  padDigits: number;
  aspectRatio: number;
  overview: string;
  hotspots: DeviceHotspot[];
}

export function MedicalDevicesShowcase() {
  const [activeDevice, setActiveDevice] = useState<"carbox" | "plasmax">("carbox");
  const [selectedHotspotId, setSelectedHotspotId] = useState<number>(1);

  const devices: Record<"carbox" | "plasmax", MedicalDevice> = {
    carbox: {
      id: "carbox",
      name: "کنسول تخصصی کربوکسی‌تراپی CarboX™ Medical Pro",
      subtitle: "سامانه ترابافتی رهاسازی موضعی CO₂ و تحریک اثر بوهر بدون سوزن",
      badge: "ISO 13485 & CE MEDICAL CLASS IIA",
      classTag: "IN-OFFICE TRANSDERMAL CONSOLE",
      image: "/assets/drdermer/2025/07/carbox-lr-scaled.png",
      frameFolder: "/assets/drdermer/2025/carbox",
      totalFrames: 82,
      framePrefix: "",
      padDigits: 2,
      aspectRatio: 1.33,
      overview:
        "کنسول بالینی CarboX پیشرفته‌ترین سامانه اکسیژن‌رسانی عروقی در مطب‌های پوست و مو است. این دستگاه با امواج ارتعاشی سینوسی و همگامی با پادهای ترابافتی CarboxyPod، ریزجریان‌های خونی درمیس را تا ۲۴۰٪ تقویت می‌کند.",
      hotspots: [
        {
          id: 1,
          label: "۱",
          frame: 1,
          x: 25,
          y: 42,
          title: "هندپیس ارتعاشی سینوسی ۱۲۰Hz (Sinusoidal Acoustic Head)",
          desc: "انتقال میکروویبراسیون‌های فرکانس بالا جهت تسهیل کاویتاسیون حباب‌های CO₂ و نفوذ عمیق بیومواد پپتیدی به عمق ۱.۵ میلی‌متری درم بدون کوچک‌ترین ترومای سطحی.",
          spec: "فرکانس تشدید: ۱۲۰ هرتز · دامنه ارتعاش: ۰.۸ میلی‌متر · بدنه آلیاژ تیتانیوم گرید پزشکی",
        },
        {
          id: 2,
          label: "۲",
          frame: 22,
          x: 48,
          y: 35,
          title: "محفظه هرمتیک اتصال پادهای ترابافتی (Hermetic CarboxyPod Dock)",
          desc: "اتصال قفل‌شونده هوابند برای کپسول‌های یک‌بارمصرف CarboxyPod ۱۷۰ml؛ حفظ غلظت ماکزیمم گاز دی‌اکسید کربن فعال و پیشگیری کامل از آلودگی متقاطع بین بیماران.",
          spec: "سیستم داکینگ مگنتی مغناطیسی · Cleanroom Grade ISO 5 · پکینگ استریل فویل آلومینیوم",
        },
        {
          id: 3,
          label: "۳",
          frame: 45,
          x: 72,
          y: 50,
          title: "ماژول پایش دیجیتال فلوریت و فشار اسمزی (Osmotic Barometer)",
          desc: "سنسورهای فشار پیزوالکتریک که با پایش لحظه‌ای مقاومت اپیدرم، سرعت جریان نانوحباب‌ها را در محدوده امن فیزیولوژیک بافت زنده کنترل و تنظیم می‌کنند.",
          spec: "دقت دبی: ±۰.۰۵ میلی‌لیتر در دقیقه · سنسور میکروپروسسوری ۳۲ بیتی STM32",
        },
        {
          id: 4,
          label: "۴",
          frame: 68,
          x: 52,
          y: 68,
          title: "سیستم تثبیت سرمایشی و پایداری پپتیدها (Cryo Thermal Stabilizer)",
          desc: "ماژول پایدارکننده دمای ژل در محدوده بهینه ۱۸ تا ۲۲ درجه سانتی‌گراد جهت حفظ فعالیت زیستی فاکتورهای رشد EGF و پپتیدهای کمپلکس مس در حین اعمال پروتکل.",
          spec: "تکنولوژی خنک‌کننده ترموالکتریک Peltier · سنسور دمای مادون قرمز NTC",
        },
      ],
    },
    plasmax: {
      id: "plasmax",
      name: "سامانه پلاسمای سرد اتمسفری PlasmaX™ Cold Jet",
      subtitle: "استریلیزاسیون میکروجت، الکتروپوریشن غشای سلول و تحریک کلاژنز",
      badge: "COLD ATMOSPHERIC PLASMA (CAP)",
      classTag: "SURGICAL & CLINIC REGENERATIVE JET",
      image: "/assets/drdermer/2025/07/1-plasma22-465x1024.png",
      frameFolder: "/assets/drdermer/2025/plasmax",
      totalFrames: 110,
      framePrefix: "",
      padDigits: 3,
      aspectRatio: 1.25,
      overview:
        "دستگاه PlasmaX از فناوری پلاسمای سرد در فشار اتمسفریک بهره می‌برد. این سیستم با تولید گونه‌های فعال اکسیژن و نیتروژن (RONS) بدون ایجاد حرارت یا سوختگی، باکتری‌های مولد آکنه را ریشه‌کن کرده و منافذ غشای سلولی را برای جذب کربوکسی‌ژل باز می‌کند.",
      hotspots: [
        {
          id: 1,
          label: "۱",
          frame: 1,
          x: 50,
          y: 20,
          title: "نازل میکروجت پلاسمای سرد (Cold Atmospheric Micro-Jet Nozzle)",
          desc: "خروجی پلاسمای یونیزه با دمای زیر ۳۵ درجه سانتی‌گراد؛ تخریب فوری دیواره سلولی C. acnes با کارایی ۹۹.۹٪ بدون آسیب رساندن به بافت سالم اپیدرم.",
          spec: "گاز حامل: هلیوم / آرگون گرید مدیکال ۹۹.۹۹۹٪ · ولتاژ شکست: ۳.۲ کیلوولت در فرکانس ۴۰kHz",
        },
        {
          id: 2,
          label: "۲",
          frame: 28,
          x: 35,
          y: 45,
          title: "بریر دی‌الکتریک کوارتز گرید پزشکی (Medical Quartz DBD Tube)",
          desc: "تیوب دی‌الکتریک از جنس کوارتز با خلوص بالا برای کنترل تخلیه بار الکتریکی و تضمین ایمنی صددرصدی بیمار در برابر هرگونه شوک یا سوختگی حرارتی.",
          spec: "کوارتز فوق خالص نوری · عایق دی‌الکتریک ۲۰kV · استاندارد ایمنی الکتریکی IEC 60601-1",
        },
        {
          id: 3,
          label: "۳",
          frame: 58,
          x: 65,
          y: 58,
          title: "ماژول نفوذپذیری الکتروپوریشن گذرا (Cellular Electroporation Trigger)",
          desc: "ایجاد روزنه‌های نانومتری برگشت‌پذیر در فسفولیپیدهای غشا، که جذب ترابافتی ماکرومولکول‌های سرم‌های پپتیدی و اسید هیالورونیک را تا ۵ برابر افزایش می‌دهد.",
          spec: "مدت بازماندن منافذ غشایی: ۴۵ ثانیه تا ۲ دقیقه · کاملاً بدون درد و بدون نیاز به بی‌حسی",
        },
        {
          id: 4,
          label: "۴",
          frame: 85,
          x: 50,
          y: 82,
          title: "رابط کاربری لمسی پروتکل‌های کلینیکال (Smart Clinical Touch Console)",
          desc: "پنل رنگی با برنامه‌های از پیش کالیبره‌شده برای آکنه فعال، اسکار جراحی، بلفاروپلاستی غیرجراحی، ملاسما و دوره پس از لیزرهای تهاجمی CO2.",
          spec: "نمایشگر لمسی خازنی ۱۰ اینچ صنعتی · سیستم عامل درماتولوژی اختصاصی Dr. Dermer OS",
        },
      ],
    },
  };

  const dev = devices[activeDevice];
  const activeSpot = dev.hotspots.find((h) => h.id === selectedHotspotId) || dev.hotspots[0];

  return (
    <section className="devices-showcase-section" aria-labelledby="devices-title">
      <div className="devices-showcase-wrapper">
        {/* Section Header */}
        <div className="devices-header">
          <div className="dev-badge-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            REEMED™ CLINICAL HARDWARE SHOWCASE
          </div>
          <h2 id="devices-title" className="dev-main-title">
            تجهیزات پیشرفته درماتولوژی و پزشکی بازساختی: CarboX و PlasmaX
          </h2>
          <p className="dev-lead-text">
            روی هات‌اسپات‌های تعاملی کلیک کنید تا با معماری فنی، قطعات مهندسی پزشکی و مکانیسم عملکرد سخت‌افزارهای بالینی دکتر درمر بریتانیا در مطب‌ها آشنا شوید.
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className="device-tabs-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeDevice === "carbox"}
            className={`dev-tab-btn ${activeDevice === "carbox" ? "active" : ""}`}
            onClick={() => {
              setActiveDevice("carbox");
              setSelectedHotspotId(1);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>کنسول کربوکسی‌تراپی CarboX™ Pro</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeDevice === "plasmax"}
            className={`dev-tab-btn ${activeDevice === "plasmax" ? "active" : ""}`}
            onClick={() => {
              setActiveDevice("plasmax");
              setSelectedHotspotId(1);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>سامانه پلاسمای سرد PlasmaX™ Cold Jet</span>
          </button>
        </div>

        {/* 360-Style Interactive Hotspot Viewer Stage */}
        <div className="device-stage-grid">
          {/* High-Performance 360 Canvas Sequence Player with Hotspot Pins */}
          <div className="device-hotspot-viewer" style={{ padding: 0, minHeight: 'unset', background: 'transparent' }}>
            <CanvasSequencePlayer
              key={dev.id}
              frameFolder={dev.frameFolder}
              totalFrames={dev.totalFrames}
              framePrefix={dev.framePrefix}
              padDigits={dev.padDigits}
              fileExtension=".webp"
              aspectRatio={dev.aspectRatio}
              autoRotate={true}
              autoRotateSpeedMs={60}
              interactiveDrag={true}
              overlayHotspots={dev.hotspots.map((hs) => ({
                id: hs.id,
                label: hs.label,
                title: hs.title,
                desc: hs.desc,
                spec: hs.spec,
                frame: hs.frame,
                x: hs.x,
                y: hs.y,
              }))}
              selectedHotspotId={selectedHotspotId}
              onHotspotSelect={(hs) => {
                if (typeof hs.id === 'number') {
                  setSelectedHotspotId(hs.id);
                }
              }}
              label={dev.name}
            />
          </div>

          {/* Hotspot Technical Detail Card */}
          <div className="hotspot-detail-panel">
            <div className="hdp-tag-line">
              <span>{dev.classTag}</span>
              <span>•</span>
              <span>{dev.badge}</span>
            </div>

            <h3 className="hdp-title">{activeSpot.title}</h3>
            <p className="hdp-desc">{activeSpot.desc}</p>

            <div className="hdp-spec-box">
              <strong>مشخصات فنی مهندسی پزشکی:</strong>
              <p>{activeSpot.spec}</p>
            </div>

            <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              {dev.overview}
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              <Link href={activeDevice === "carbox" ? "/carbox" : "/plasmax"} className="hdp-cta-btn" style={{ flex: 1, minWidth: "220px", background: "var(--color-brand-forest, #1E3A2F)" }}>
                <span>مشاهده پرونده تخصصی و ۳۶۰° {activeDevice === "carbox" ? "CarboX" : "PlasmaX"}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>
              <Link href="/b2b" className="hdp-cta-btn" style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                <span>استعلام پیش‌فاکتور B2B</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
