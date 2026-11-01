# Specification: Medical Stations & Hardware Consoles (`/carbox`, `/plasmax`, `/carboxypod`)
# Dr Dermer UK Clinical & Commerce OS

> **Routes**:
> - `/carbox`: CarboX™ Dual-Modality Clinical Carboxytherapy Station
> - `/plasmax`: PlasmaX™ Tri-Modality Surgical & Cold Atmospheric Plasma Console
> - `/carboxypod`: CarboxyPod™ Sonophoretic Micro-Vibration Activation System
>
> **Component Architecture**: WebGL / Canvas Sequence Player (`CanvasSequencePlayer.tsx`), Interactive Telemetry Hotspots (`StationHotspotOverlay.tsx`), Modality Engineering Comparison Matrix (`ModalityComparisonTabs.tsx`), Clinical Technical Specifications (`EngineeringSpecDossier.tsx`), and B2B Clinic Quote & Leasing Request Form (`B2BQuoteModal.tsx`).  
> **Primary Purpose**: Provide a museum-grade, tactile product exploration experience for multi-million Toman medical aesthetic hardware. Deliver cinematic 360-degree rotation sequences with scrub physics, interactive component callouts, verified clinical telemetry (flow rates, plasma arc voltages, ultrasound cavitation frequencies), side-by-side technology comparisons, and direct B2B clinic quote/leasing conversion funnels.

---

## 1. Architectural Layout & Hierarchy

```
+--------------------------------------------------------------------------------------------------+
| Station Header: ReeMed™ Medical Hardware Division, CE Medical Class IIb Badge, B2B Priority Line |
+--------------------------------------------------------------------------------------------------+
| Hero 360-Degree Hardware Exploration Stage:                                                      |
| +----------------------------------------------------------------------------------------------+ |
| | Interactive Canvas 360 Sequence Player (CarboX: 82 Frames / PlasmaX: 110 Frames)             | |
| | - Left/Right Pointer Scrubbing with Inertia & Gyroscope Motion Physics                       | |
| | - High-Resolution Preloaded WebP Array (Retina Cleanroom Lighting)                           | |
| | - Dynamic Angle-Bound Telemetry Hotspots (Pins track coordinate points across azimuth angle) | |
| | - Real-time Frame Counter & Azimuth Dial (e.g. "زاویه دید: ۲۴۵° | فریم ۵۶ از ۸۲")            | |
| | - Fullscreen Diagnostic Loupe Inspection Trigger                                             | |
| +----------------------------------------------------------------------------------------------+ |
| Floating Controls: [ ۳۶۰° چرخش خودکار ] [ نمای اشعه ایکس ] [ هندپیس‌ها ] [ بازنشانی زاویه ]       |
+--------------------------------------------------------------------------------------------------+
| Hardware Overview & Primary B2B Action Bar:                                                      |
| - Commercial Model Designation & Certification (ISO 13485 / CE 0123 Medical Class IIb)           |
| - Key Clinical Metrics: e.g. "دقت تزریق ۰.۱ سی‌سی", "سونوفورزیس ۱۲۰ هرتز", "پلاسما سرد آرگون"    |
| - Action CTAs:                                                                                   |
|   [ دریافت پیش‌فاکتور رسمی و پروپوزال لیزینگ ] (Opens B2B Quote Modal)                            |
|   [ رزرو دمو حضوری در کلینیک یا شوروم مرکزی ]                                                   |
|   [ دانلود کاتالوگ فنی و کارآزمایی‌های بالینی (PDF) ]                                             |
+--------------------------------------------------------------------------------------------------+
| Mid-Page Deep-Dive Engineering Modules:                                                          |
| 1. Dual / Tri-Modality Deep Dive: Interactive Tabbed Architecture                                |
| 2. Modality Engineering Comparison Matrix (CarboX vs PlasmaX vs Traditional Ablative Devices)   |
| 3. Handpiece Anatomy & Transducer Micro-Engineering (Ergonomics & Materials)                    |
| 4. Treatment Protocols & Physiological Telemetry (Bohr Effect, Fibroblast Activation, Histology) |
| 5. Return on Investment (ROI) Clinic Calculator (Patient Throughput vs Amortization)             |
| 6. Consumables Ecosystem: Integration with CarboxyGel™ Pro & Sterile Needle Cartridges           |
| 7. B2B Commercial Inquiries, Warranty (۲۴ ماه گارانتی تعویض), and Clinical Training Certification|
+--------------------------------------------------------------------------------------------------+
```

---

## 2. 360-Degree Canvas Sequence Player (`<CanvasSequencePlayer />`)

### 2.1 Frame Sequences & Optical Assets
- **CarboX™ Medical Station (`/carbox`)**:
  - Exactly **82 high-resolution frames** (WebP format, 1920x1080 rendered at 60fps rotational capture in clinical cleanroom obsidian lighting).
  - Production asset path: `/assets/drdermer/2025/carbox/01.webp` through `82.webp`.
  - Captures full 360-degree rotation of chassis, dual articulated handpiece holsters, back-panel medical CO₂ cylinder chamber with dual purge valves, and 12-inch capacitive touch screen.
- **PlasmaX™ Medical Console (`/plasmax`)**:
  - Exactly **110 high-resolution frames** (WebP format, 1920x1080).
  - Production asset path: `/assets/drdermer/2025/plasmax/001.webp` through `110.webp`.
  - Captures the three quick-connect plasma umbilical connectors, ceramic DBD handpiece, cold argon gas micro-nozzle, and continuous arc surgical tip.
- **CarboxyPod™ Activation System (`/carboxypod`)**:
  - **3-Stage Mechanical Breakdown**:
    1. *Stage 1: Outer Casing & Scrub Surface* (46 frames in `/assets/drdermer/2025/slidepod/`).
    2. *Stage 2: Inner Active Ingredients Core* (45 frames in `/assets/drdermer/2025/slidepodint/`).
    3. *Stage 3: Ultrasound Handpiece Synergy* (36 frames in `/assets/drdermer/2025/hppod/`).

### 2.2 Smooth Scrub Physics & Preload Engine
```typescript
export interface SequencePlayerConfig {
  totalFrames: number;
  framePathPattern: string; // e.g. "/assets/drdermer/2025/carbox/%02d.webp"
  canvasWidth: number;
  canvasHeight: number;
  inertiaFactor: number; // 0.92 for smooth decay
  dragSensitivity: number; // pixels dragged per frame change
}

export class SequenceController {
  private images: HTMLImageElement[] = [];
  private currentFrameIndex = 0;
  private isLoaded = false;
  private velocity = 0;
  private lastPointerX = 0;
  private isDragging = false;
  private animationFrameId: number | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private config: SequencePlayerConfig,
    private onFrameChange?: (frameIndex: number, azimuthDegrees: number) => void
  ) {}

  public async preloadSequence(onProgress: (percent: number) => void): Promise<void> {
    const promises: Promise<void>[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= this.config.totalFrames; i++) {
      const img = new Image();
      const paddedIndex = this.config.totalFrames >= 100 
        ? i.toString().padStart(3, '0') 
        : i.toString().padStart(2, '0');
      img.src = this.config.framePathPattern.replace(/%0[23]d/, paddedIndex);

      const p = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          loadedCount++;
          onProgress(Math.round((loadedCount / this.config.totalFrames) * 100));
          resolve();
        };
        img.onerror = reject;
      });

      this.images.push(img);
      promises.push(p);
    }

    await Promise.all(promises);
    this.isLoaded = true;
    this.renderFrame(0);
  }

  public handlePointerDown(clientX: number) {
    this.isDragging = true;
    this.lastPointerX = clientX;
    this.velocity = 0;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  public handlePointerMove(clientX: number) {
    if (!this.isDragging || !this.isLoaded) return;
    const deltaX = clientX - this.lastPointerX;
    this.lastPointerX = clientX;

    // Invert for natural RTL tactile feel
    const frameDelta = -Math.round(deltaX / this.config.dragSensitivity);
    if (frameDelta !== 0) {
      this.updateFrame(this.currentFrameIndex + frameDelta);
      this.velocity = frameDelta;
    }
  }

  public handlePointerUp() {
    this.isDragging = false;
    this.applyInertia();
  }

  private applyInertia() {
    if (Math.abs(this.velocity) < 0.05) return;
    this.velocity *= this.config.inertiaFactor;
    this.updateFrame(this.currentFrameIndex + Math.round(this.velocity));
    this.animationFrameId = requestAnimationFrame(() => this.applyInertia());
  }

  private updateFrame(targetIndex: number) {
    const count = this.config.totalFrames;
    this.currentFrameIndex = ((targetIndex % count) + count) % count;
    this.renderFrame(this.currentFrameIndex);

    const azimuthDegrees = Math.round((this.currentFrameIndex / count) * 360);
    this.onFrameChange?.(this.currentFrameIndex, azimuthDegrees);
  }

  private renderFrame(index: number) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx || !this.images[index]) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.images[index], 0, 0, this.canvas.width, this.canvas.height);
  }
}
```

---

## 3. Angle-Bound Hotspots & Telemetry Overlays (`<StationHotspotOverlay />`)

### 3.1 Hotspot Geometry & Interpolation
Hotspots represent physical points on the medical console (e.g. gas regulation valve, sonic transducer, plasma arc emitter). Since the machine rotates in 3D space, each hotspot has an active visibility window defined by azimuth angles and 2D canvas coordinates ($x, y$ percentages).

```typescript
export interface StationHotspot {
  id: string;
  titleFa: string;
  titleEn: string;
  category: 'pneumatic' | 'ultrasonic' | 'plasma' | 'interface' | 'ergonomics';
  startFrame: number;
  endFrame: number;
  // Normalized coordinates (0 to 100%) mapped across frames
  keyframeCoordinates: Record<number, { x: number; y: number }>;
  telemetry: {
    labelFa: string;
    value: string;
    unit: string;
    tolerance: string;
  };
  descriptionFa: string;
}
```

### 3.2 CarboX™ Interactive Hotspots Roster (`/carbox`)
1. **Hotspot 1: سنسور تنظیم دبی گاز CO2 (Precision CO2 Flow Regulator)**:
   - *Visible Frames*: Frames 10 to 35 (Front-Right quarter view).
   - *Telemetry*: دبی خروجی: `۱۰ الی ۱۰۰ سی‌سی در دقیقه` (خطای کمتر از ۱٪).
   - *Clinical Note*: مجهز به پیش‌گرمکن میکروالکترونیک جهت رساندن دمای گاز تزریقی به ۳۶.۵°C برای حذف کامل درد بیمار.
2. **Hotspot 2: هندپیس سونوفورزیس اولتراسونیک (Ultrasonic Sonophoresis Handpiece)**:
   - *Visible Frames*: Frames 25 to 60 (Side profile view).
   - *Telemetry*: فرکانس نوسان: `۱۲۰ هرتز` | عمق نفوذ ترنس‌درمال: `۴.۲ میلی‌متر`.
   - *Clinical Note*: بازکننده کانال‌های بین‌سلولی اپیدرم برای جذب ماکزیمم ژل کربوکسی و آزادسازی اثر بور.
3. **Hotspot 3: پنل لمسی کنترل پارامترهای بیولوژیک (12-inch Clinical Touchscreen)**:
   - *Visible Frames*: Frames 65 to 82 and 1 to 15 (Frontal view).
   - *Telemetry*: پروتکل‌های هوشمند: `۱۸ برنامه بالینی از پیش تعریف‌شده`.
   - *Clinical Note*: تنظیم خودکار فشار گاز بر اساس ضخامت بافت و مانیتورینگ آنلاین امپدانس بافت.

### 3.3 PlasmaX™ Interactive Hotspots Roster (`/plasmax`)
1. **Hotspot 1: نازل جت پلاسما سرد آرگون (Cold Atmospheric Plasma Jet)**:
   - *Visible Frames*: Frames 15 to 45.
   - *Telemetry*: دمای گاز پلاسمایی: `< ۳۸°C` | جریان آرگون گرید پزشکی: `۲ لیتر/دقیقه`.
   - *Clinical Note*: غیرفعال‌سازی ۱۰۰٪ باکتری Cutibacterium acnes ظرف ۶۰ ثانیه بدون هیچ‌گونه سوختگی حرارتی.
2. **Hotspot 2: هندپیس سرامیکی دی‌الکتریک (Dielectric Barrier Discharge Head)**:
   - *Visible Frames*: Frames 50 to 80.
   - *Telemetry*: ولتاژ تحریک: `۴.۵ کیلوولت` | فرکانس: `۴۵ کیلوهرتز`.
   - *Clinical Note*: افزایش نفوذپذیری غشای سلولی (Electroporation) و تحریک تکثیر فیبروبلاست‌ها تا ۳۰۰٪.
3. **Hotspot 3: میکروسوزن پلاسمای جراحی (Sub-Millimeter Surgical Arc Probe)**:
   - *Visible Frames*: Frames 80 to 105.
   - *Telemetry*: قطر قوس پلاسمایی: `۰.۲ میلی‌متر` | تخلیه بار بدون تماس فیزیکی.
   - *Clinical Note*: بلفاروپلاستی غیرجراحی پلک، سابسیژن ضایعات خوش‌خیم و جمع‌کردن پوست شل (Skin Tightening).

---

## 4. Modality Comparison Tabs (`<ModalityComparisonTabs />`)

A technical matrix enabling doctors and clinic directors to evaluate medical efficacy, pain indices, consumable costs, and downtime across technologies:

```
+-------------------------------------------------------------------------------------------------------------------+
| مقایسه مشخصات فنی و بازدهی بالینی فناوری‌های درمر انگلستان (ENGINEERING & CLINICAL MATRIX)                        |
+-----------------------------------+-----------------------------+-------------------------------+-----------------+
| پارامتر ارزیابی بالینی            | CarboX™ Clinical Station    | PlasmaX™ Tri-Modality         | لیزر فرکشنال CO2 |
+-----------------------------------+-----------------------------+-------------------------------+-----------------+
| ۱. مکانیسم فیزیولوژیک اولیه       | اثر بور، هایپوکسی موضعی و O2 | تحریک تخلیه بار و اکسیداسیون  | تخریب حرارتی بافت |
| ۲. تهاجم و تخریب اپیدرم           | کاملاً غیرتهاجمی / میکروتزریق| غیرتهاجمی تا میکروقوس جراحی   | تهاجمی کامل     |
| ۳. شاخص درد بیمار (VAS 0-10)      | ۰ الی ۱ (بدون نیاز به بی‌حسی)| ۱ الی ۳ (بسته به هندپیس)      | ۶ الی ۹ (بی‌حسی)|
| ۴. دوره نقاهت (Downtime)          | صفر روز (بازگشت فوری به کار)| صفر الی ۳ روز (میکروکِراست)   | ۷ الی ۱۴ روز    |
| ۵. هزینه مواد مصرفی به ازای بیمار| بسیار اندک (ژل و پاد درمر)   | گاز آرگون / تیپ استریل         | تیپ یکبار مصرف گران|
| ۶. خطر PIH (تیرگی پس از التهاب)    | ۰٪ (ایمن برای فتوتیپ I تا VI)| < ۱٪ در پروتکل سرد             | بالا در تیپ ۳ و ۴|
| ۷. توان مصرفی و برق ورودی         | 120W (220V 50Hz)            | 250W (220V 50Hz)              | 800W High Voltage|
| ۸. گواهینامه‌های بین‌المللی        | CE Medical 0123 / ISO 13485 | CE Medical 0123 / ISO 13485   | FDA / CE        |
+-----------------------------------+-----------------------------+-------------------------------+-----------------+
```

---

## 5. B2B Clinic Quote & Leasing Request Modal (`<B2BQuoteModal />`)

### 5.1 Business Logic & Workflow
Medical aesthetic consoles are high-investment assets requiring structured financing, commercial leasing, or installment options:
- **Direct Wholesale Purchase (خرید نقدی کلینیکال)**: 10% instant discount + 1-year complimentary consumables pack (CarboxyGel Pro 1500ml x 6).
- **Medical Equipment Leasing (طرح لیزینگ تجهیزات پزشکی)**: 30% advance deposit with 12 to 24 month low-interest installments through authorized medical financing partners.
- **On-Site Clinic Demonstration (درخواست تست حضوری در کلینیک)**: Clinical field specialist brings demo unit to the physician's practice for live patient trials.

### 5.2 Modal Form Fields Schema
```typescript
export interface B2BQuoteRequest {
  stationModel: 'CarboX_Dual_Station' | 'PlasmaX_Tri_Console' | 'CarboxyPod_Clinical_System';
  acquisitionType: 'direct_purchase' | 'leasing_installments' | 'on_site_demo';
  clinicName: string;
  medicalDirectorName: string;
  medicalCouncilNumber: string; // شماره نظام پزشکی (Mandatory)
  contactPhone: string;
  provinceId: string;
  cityId: string;
  preferredContactTime: 'morning_9_12' | 'afternoon_14_18' | 'evening_18_21';
  estimatedMonthlyPatients: number; // e.g. 50, 100, 200+
  commentsOrCustomRequirements?: string;
}
```

### 5.3 Submission Feedback & SLA Notice
Upon submission:
- Generates an official Quotation Reference Number (e.g. `QUO-1404-MED-8491`).
- Enforces a 4-hour medical representative callback SLA.
- Provides immediate link to download the complete Unabridged Clinical & Regulatory Dossier (PDF).

---

## 6. Technical Engineering Specifications Dossier

### 6.1 CarboX™ Station Technical Dossier
- **CO₂ Gas Reservoir**: Standard medical-grade CO₂ cylinder (purity > 99.995%).
- **Injection Pressure**: Software-governed between 0.2 to 2.5 bar with instant safety pressure dump valve.
- **Micro-Heater System**: Dual ceramic PTC thermistors pre-heating gas stream to 36.5°C ± 0.5°C.
- **Sonophoresis Transducer**: Medical titanium-alloy horn vibrating at 120Hz ± 2Hz, sinusoidal waveform.
- **Chassis Dimensions & Weight**: 420mm (W) x 380mm (D) x 1080mm (H) | Weight: 34 kg (with cylinder).

### 6.2 PlasmaX™ Console Technical Dossier
- **Cold Plasma Ion Source**: High-frequency dielectric barrier discharge in Argon buffer gas.
- **Surgical Arc Frequency**: 100 kHz resonant LC inverter generating controlled micro-plasma spark without ground pad.
- **Argon Gas Flow Controller**: Digital mass flow controller (MFC) 0.5 to 5.0 SLM (Standard Liters per Minute).
- **Sterilization Protocols**: Handpieces fully autoclavable at 134°C (Class B vacuum autoclave).
- **Chassis Dimensions & Weight**: 380mm (W) x 340mm (D) x 240mm (H) | Weight: 14 kg.

---

## 7. Accessibility & Performance Architecture
- **WebP Fallback**: Canvas automatically tests WebP decoding capability; falls back to progressive JPEG sequence if unsupported.
- **Adaptive Memory Management**: On low-memory mobile devices (`navigator.deviceMemory < 4`), the sequence engine halves the frame step (rendering every 2nd frame) to avoid out-of-memory browser crashes.
- **Keyboard Rotation**: Left and Right arrow keys allow users to rotate the machine in 5-degree increments with announceable azimuth headings via `aria-live`.
- **RTL Dial Aesthetics**: Rotation dial displays Persian digits and cardinal headings (روبرو، نمای جانبی، ورودی گاز، هندپیس‌ها).
