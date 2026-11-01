# PRODUCT CONTEXT
# Dr Dermer UK Clinical Laboratories & Commerce OS Platform

> **Document Type**: Clinical Product & Pharmaceutical Domain Specification  
> **Brand Entities**: Dr Dermer UK Clinical Laboratories, ReeSkin™, ReeMed™  
> **Authoring Authority**: Clinical UX & Medical Architecture Engineering  
> **Target Audience**: All Engineering Agents, Frontend Architects, and System Designers

---

## 1. Company Heritage & Mission

**Dr Dermer UK Clinical Laboratories** is an advanced dermatological research and medical device engineering enterprise founded at **Cambridge Science Park** (Milton Road, Cambridge CB4 0GF, United Kingdom). The laboratory specializes in transdermal gas-exchange therapies, cold atmospheric plasma biophysics, biomimetic peptide signaling, and non-ablative epidermal restoration.

Regional operations, manufacturing oversight, and professional training academies are coordinated across:
- **Global HQ & R&D**: Cambridge Science Park, Cambridge, United Kingdom.
- **Eurasia Commercial & Clinical Training Hub**: Dumankaya İkon Towers, Ataşehir, Istanbul, Turkey.
- **Middle East Regional Distribution & Cold-Chain Fulfillment**: Tehran, Iran (serving licensed dermatologists, plastic surgery centers, medical spas, and certified home-care consumers).

### Core Medical Philosophy
1. **Physiological Non-Invasiveness**: Replacing traumatic, painful, and ablative clinical procedures with evidence-based cellular triggers.
2. **Biochemical Precision**: Utilizing endogenous human physiological mechanisms—most notably **The Bohr Effect**, transcutaneous partial pressure gradients ($p\text{CO}_2$), and bio-identical wound healing lipid cascades.
3. **Pharmaceutical-Grade Formulation**: Strict INCI disclosure, zero synthetic fragrance, zero parabens, zero bio-accumulative microplastics, and validated cold-chain transport ($2^\circ\text{C}$ to $8^\circ\text{C}$ for labile bio-actives).
4. **End-to-End Serialization**: Full batch traceability adhering to UK Cosmetic Regulations (Schedule 34 of the Product Safety and Metrology Statutory Instrument) and Iranian Food and Drug Administration (IFDA / TTAC) track-and-trace requirements.

---

## 2. Brand Architecture & Commercial Divisions

The product ecosystem is strictly partitioned into two operational divisions, tailored to distinct commercial channels and clinical indications:

```
                            ┌──────────────────────────────────────────────┐
                            │      Dr Dermer UK Clinical Laboratories      │
                            │          Cambridge Science Park, UK          │
                            └──────────────────────┬───────────────────────┘
                                                   │
                 ┌─────────────────────────────────┴─────────────────────────────────┐
                 ▼                                                                   ▼
┌─────────────────────────────────┐                                 ┌─────────────────────────────────┐
│            ReeSkin™             │                                 │            ReeMed™              │
│  Clinical Formulations & Kits   │                                 │ Medical Consoles & Hardware Pro │
└────────────────┬────────────────┘                                 └────────────────┬────────────────┘
                 │                                                                   │
    [B2C & B2B Consumables]                                             [Clinical Hardware Stations]
    • CarboxyGel™ Professional Therapy                                  • Carbox™ Clinical Medical Station
    • CarboxyPod™ Activator Scrub Pods                                  • PlasmaX™ Tri-Modality Station
    • CarboxyPad™ Pre-Cut Activator Masks                               • Ultrasound Sonophoresis Handpieces
    • Crystalene™ Microderm Polish Paste                                • High-Frequency Dermal Transducers
    • Healene™ Epidermal Barrier Gel                                    • Subcutaneous CO2 Regulators
    • Silicalene™ Mild Silica Detox Scrub                               • CE Class IIb Medical Certification
```

---

## 3. Core Technologies & Physiological Mechanisms

### 3.1 The Bohr Effect & Transcutaneous $\text{CO}_2$ Flux
The cornerstone of Dr Dermer UK's non-invasive carboxytherapy is **The Bohr Effect**, first described physiologically by Christian Bohr in 1904.

```
       [ Alkaline Gel Layer: 8.5% NaHCO3 ]  +  [ Acidic Activator: Citric Acid Matrix ]
                                        │
                                        ▼ (Effervescent Chemical Reaction)
                          H+ + HCO3-  ──>  H2CO3  ──>  H2O + CO2 (g)
                                        │
                        (Partial Pressure: pCO2 > 1,100 ppm)
                                        │
                                        ▼ (Transdermal Lipid Diffusion)
                       [ Capillary Beds & Erythrocytes in Dermis ]
                                        │
                       CO2 Hydration: CO2 + H2O <──> H+ + HCO3-
                                        │
                                        ▼
                  Local Tissue Acidosis (Extracellular pH 7.4 -> 6.8)
                                        │
                                        ▼
             Oxyhemoglobin (Hb-O2) Dissociation Curve Shifts RIGHT (Bohr Effect)
                                        │
                                        ▼
       Hb(O2)4 + 4 H+  ──>  Hb(H+)4 + 4 O2 (Rapid Transcutaneous Oxygen Delivery)
                                        │
         ┌──────────────────────────────┴──────────────────────────────┐
         ▼                                                             ▼
Capillary Vasodilation (+138%)                     Fibroblast ATP Synthesis & Neocollagenesis
Hyperoxygenation (+45% to +94% pO2)                 Accelerated Cellular Turnover
```

- **In Vitro & In Vivo Telemetry**: Clinical gas-tension probes record an immediate local increase in tissue oxygenation ($p\text{O}_2$) of **+45% to +94%** within 8 minutes of application, accompanied by a **+138%** surge in microvascular erythrocyte velocity without systemic hypercapnia.

### 3.2 Non-Invasive Needle-Free $\text{CO}_2$ Carboxytherapy
Traditional medical carboxytherapy involves painful subcutaneous puncture using 30G needles connected to compressed gas cylinders, carrying risks of hematoma, localized emphysema, and patient apprehension.

Dr Dermer UK transforms this modality into a topical, painless procedure:
- **Phase A (Alkaline Hydrogel)**: A bio-adhesive polymer gel saturated with pharmaceutical-grade Sodium Bicarbonate ($\text{NaHCO}_3$, 8.5%) and Centella Asiatica ($5.0\%$).
- **Phase B (Solid Phase Matrix)**: Either a micro-porous non-woven mask (`CarboxyPad`) impregnated with dehydrated citric acid crystals or a pressed effervescent pod (`CarboxyPod`).
- **Gaseous Confinement**: The dense polymer network traps the generated carbon dioxide directly against the stratum corneum, creating a forced concentration gradient that drives gaseous molecules through intracellular lipid channels.

### 3.3 Microplasma Biophysics & Epidermal Sublimation
Integrated into the `ReeMed PlasmaX™` medical console, atmospheric microplasma utilizes controlled electrical discharge to ionize ambient atmospheric gases (Nitrogen and Oxygen) into a highly reactive plasma plume:
1. **Continuous Surgical Arc (Sublimation)**: Direct electrical arc discharge vaporizes keratinocytes instantly via sublimation (solid to gas phase transition) without thermal transfer to the deep reticular dermis, preventing hypertrophic scarring.
2. **Cold Atmospheric Plasma (CAP Jet)**: An ionized gas stream at human body temperature ($32^\circ\text{C}$ to $37^\circ\text{C}$) loaded with Reactive Oxygen and Nitrogen Species (RONS: $\text{NO}^\bullet$, $\text{O}_2^{\bullet-}$, $\text{OH}^\bullet$). Destroys bacterial cell walls (*Cutibacterium acnes*, *Staphylococcus aureus*) within 30 seconds of contact while stimulating endothelial nitric oxide synthase (eNOS).
3. **Dielectric Barrier Discharge (DBD Porcelain Head)**: Uniform micro-current ionization that opens transient micropores in the lipid bilayer, dramatically enhancing macromolecular transdermal absorption (needle-free mesotherapy).

### 3.4 Dexpanthenol + Centella Barrier Restoration
A healthy skin barrier requires an intact stratum corneum consisting of corneocytes embedded in a multi-lamellar lipid matrix (ceramides, cholesterol, free fatty acids). Post-procedure skin (chemical peels, laser resurfacing, carboxytherapy) exhibits elevated Transepidermal Water Loss (TEWL) and barrier breakdown.

The `Healene™` clinical formulation utilizes a synergistic dual-pathway:
- **Medical Dexpanthenol (5.0%, Pro-Vitamin B5)**: Penetrates into the viable epidermis, converting enzymatically to Coenzyme A. Coenzyme A is the indispensable cofactor for cellular fatty acid synthesis and lipid membrane assembly.
- **Titrated Extract of Centella Asiatica (TECA 3.0%, with 40% Madecassoside & 30% Asiaticoside)**: Down-regulates pro-inflammatory cytokines ($\text{IL}-1\beta$, $\text{TNF}-\alpha$) while up-regulating Type I and Type III pro-collagen gene expression.
- **Documented Result**: Clinical Tewameter measurements demonstrate a **78% reduction in TEWL within 48 hours**, restoring barrier homeostasis and terminating erythema.

---

## 4. Product Portfolio & Technical Dossier

### 4.1 ReeSkin™ Clinical Formulations

| Product Name | SKU & Pack | Key Active INCI | Clinical Indication | Primary Telemetry |
| :--- | :--- | :--- | :--- | :--- |
| **CarboxyGel™ Professional Therapy** | `CBG-PRO-500ML`<br>`CBG-BULK-1500ML` | Sodium Bicarbonate (8.5%), Centella Asiatica (5%), HA (2%), Glycyrrhiza Glabra | Hypoxic tissue, post-acne scarring, dermal devitalization | +94% $p\text{O}_2$ tissue burst, +138% capillary perfusion |
| **CarboxyPod™ Activator Pods** | `CBP-VIT-6X`<br>`CBP-CRB-6X`<br>`CBP-HYD-6X` | Microcrystalline Citric Acid, Niacinamide, Ascorbyl Glucoside, Zinc PCA | Solid effervescent trigger for CarboxyGel & sonophoresis | > 1,100 ppm effervescent $\text{CO}_2$ release rate |
| **CarboxyPad™ Pre-Cut Activator** | `CPD-FACE-10X`<br>`CPD-NECK-10X` | Lyophilized Citric Acid on Non-Woven Cellulose Matrix | Anatomically zoned activation for full face and neck | 5 targeted facial anatomical zones, zero fiber fray |
| **Crystalene™ Microderm Polish** | `CRS-POL-250ML`<br>`CRS-TUB-100ML` | Rounded Alumina ($\text{Al}_2\text{O}_3$, 12%, 40–50μm), Lactic Acid (1%), Niacinamide (2%) | Stratum corneum desquamation without micro-tears | 62% reduction in keratinocyte hyperkeratosis |
| **Healene™ Barrier Gel** | `HLN-GEL-150ML`<br>`HLN-CLIN-500ML` | Dexpanthenol (5.0%), Madecassoside (40% purity, 3%), Hyaluronic Acid, Zinc PCA | Acute post-procedure erythema, compromised lipid barrier | 78% TEWL reduction in 48h, 92% soothing score |
| **Silicalene™ Detox Scrub** | `SLC-SCR-200ML` | Spherical Amorphous Silica, Salicylic Acid (1.2%), Glycolic Acid (2%), Charcoal | Sebum hypersecretion, open comedones, pollution stress | 54% reduction in oxidized blackheads; 8h matte finish |

### 4.2 ReeMed™ Medical Hardware Consoles

| Hardware Console | Model Identifier | Operational Modalities | Target Operators | Regulatory Class |
| :--- | :--- | :--- | :--- | :--- |
| **Carbox™ Clinical Medical Station** | `RMD-CBX-4000` | • Micro-injection Subcutaneous $\text{CO}_2$<br>• Transdermal Sonophoresis ($1\text{ MHz} / 3\text{ MHz}$)<br>• Vacuum Cavitation Pulsing | Certified Dermatologists, Plastic Surgeons, Med-Spas | CE Medical Class IIb<br>IEC 60601-1-2 |
| **PlasmaX™ Tri-Modality Station** | `RMD-PLX-7000` | • High-Frequency Surgical Micro-Arc ($100\text{ kHz}$)<br>• Cold Atmospheric Plasma Jet (Ar/He Stream)<br>• Dielectric Barrier Discharge (DBD Ceramic Head) | Plastic Surgeons, Dermatological Surgeons | CE Medical Class IIb<br>ISO 13485 |

---

## 5. Dual Target Audience Architecture & Business Rules

The Commerce OS architecture recognizes two distinct customer classes with divergent UX journeys, catalog visibility, tax invoicing, and ordering rules:

```
+───────────────────────────────────────+───────────────────────────────────────+
|      B2C CLINICAL HOME CONSUMER       |      B2B CLINIC & MEDICAL DOCTOR      |
+───────────────────────────────────────+───────────────────────────────────────+
| Discovery via Skin Concern & Quiz     | Discovery via Technical Specifications|
| Single Unit / Consumer Pack Purchases | Wholesale Bulk Packs & Capital Leases |
| Consumer Courier Delivery (Express)   | Cold-Chain Logistics & Freight Pallets|
| Standard Card / Shaparak Shetab / C2C | Formal Proforma Invoicing & Sepidar   |
| Diagnostic Regimen Recommendations    | Medical Council License Validation    |
| Consumer Support & Protocol Guides    | Dedicated Medical Rep & On-site CME   |
+───────────────────────────────────────+───────────────────────────────────────+
```

### 5.1 B2C Patient & Home Consumer Journey
- **Psychological Profile**: Individuals experiencing skin distress (erythema, compromised barrier post-laser, aging, stubborn pigmentation, acne) seeking laboratory-grade efficacy without clinic markups.
- **UI/UX Expectations**:
  - Interactive physiological simulators explaining why and how the product functions (e.g. `BohrSimulator`).
  - Interactive INCI Explorer (`InciExplorer`) revealing scientific CAS numbers, botanical origin, and concentration tiers.
  - VISIA before/after comparison sliders with high-resolution polarization.
  - Transparent pricing in Iranian Tomans and Rials with zero hidden checkout fees.

### 5.2 B2B Clinic, Med-Spa & Dermatologist Journey
- **Psychological Profile**: Medical clinic owners, purchasing directors, and aesthetic physicians requiring dependable batch-to-batch repeatability, commercial profitability, regulatory compliance, and operator certification.
- **Commerce & Regulatory Invariants**:
  1. **Volume Tier Discounts**:
     - 1–4 Units: Base Clinic Rate.
     - 5–19 Units: 12% Volume Discount (`1200 bps`).
     - 20+ Units: 22% Partner Hospital Rate (`2200 bps`).
  2. **Medical Credential Gating**: Purchase of `Carbox™`, `PlasmaX™`, and high-strength acid peels requires a validated Iranian Medical Council number (نظام پزشکی) or Clinic Operating License.
  3. **Iranian Tax Law Compliance (ماده ۱۶۹ مکرر)**: Generating official Moadian-compliant tax invoices detailing National Legal Entity ID (شناسه ملی), Economic Code (کد اقتصادی), and itemized 10% VAT.
  4. **Continuing Medical Education (CME)**: Digital access to surgical video archives, procedural step steppers (`ProtocolStepper`), and verifiable cryptographic completion certificates.

---

## 6. Cold-Chain Logistics & Quality Assurance

Certain clinical bio-actives within the ReeSkin formulation suite require strict temperature control:
- **Temperature Threshold**: Controlled cold-chain ($2^\circ\text{C}$ to $8^\circ\text{C}$) from refrigerated depot to clinic/patient doorstep.
- **Packaging Engineering**: Vacuum-insulated thermal pouches packed with phase-change dry gel packs.
- **Real-time Status Tracking**: Checkout and Order tracking views present explicit temperature status alerts (e.g., "تأیید سلامت زنجیره سرد در انبار مرکزی").

---

## 7. Architectural Alignment in Monorepo

The business and clinical concepts detailed in this document map directly to monorepo implementations:
- **Catalog & Pricing**: `packages/domain/src/quote.ts` (tiered discounts, 10% VAT, coupon caps).
- **Financial Ledger**: `packages/finance/src/journal.ts` (double-entry asset, liability, and tax accounting).
- **Localization**: `packages/localization/src/` (Persian currency formatting, Modulo-11 national ID verification).
- **Interactive Visuals**: `apps/storefront/components/interactive/` and `packages/ui/src/` (canvas 360 sequence viewer, Bohr effect slider, VISIA comparison slider).