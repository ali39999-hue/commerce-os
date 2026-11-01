# Typography Specification: Dr Dermer UK Clinical & Commerce OS

This specification details the typographic scale, font family pairings, character weights, line heights, and numeral formatting required for bilingual Persian (RTL) and Latin (LTR) clinical commerce interfaces.

---

## 1. Font Family System

### 1.1. Persian Primary Font: Vazirmatn
The primary brand typeface for Persian text across storefront and operational tools is **Vazirmatn** (created by Saber Rastikerdar). It provides optical balance, legibility across low-DPI displays, and native support for Persian glyph shaping.

```css
:root {
  --font-persian: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### 1.2. Latin & Scientific Notation Pairing: Inter / JetBrains Mono
Scientific formulas, International Nomenclature of Cosmetic Ingredients (INCI), Chemical Abstracts Service (CAS) numbers, and telemetry streams require neutral Latin grotesque and monospace pairings.

```css
:root {
  --font-latin: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
```

---

## 2. Weight Distribution & Usage Matrix

To avoid typographic noise, only five discrete font weights are permitted.

| CSS Weight | Weight Name | Persian Usage (Vazirmatn) | Latin / Scientific Usage |
| :--- | :--- | :--- | :--- |
| `400` | Regular | Body paragraphs, INCI descriptions, clinical disclaimers | Explanatory notes, ingredients list |
| `600` | SemiBold | Subheadings, table column headers, form input labels | Technical tags, metric unit suffixes |
| `700` | Bold | Card titles (H3), primary CTA button text, modal headers | Product titles, highlighted metrics |
| `800` | ExtraBold | Section headers (H2), major diagnostic step titles | Prominent category identifiers |
| `900` | Black | Hero display headlines (H1), primary brand logotype | Hero stage typography |

---

## 3. Typographic Scale & Fluid Clamps

All font sizes utilize responsive fluid typography via `clamp()` to guarantee legibility across mobile devices, tablets, and ultra-wide clinical workstations without abrupt breakpoint jumps.

```css
:root {
  /* Display & Major Headings */
  --text-display: clamp(2.25rem, 5vw + 1rem, 3.75rem);   /* 36px to 60px */
  --line-height-display: 1.2;

  --text-h1: clamp(1.875rem, 4vw + 0.5rem, 2.75rem);      /* 30px to 44px */
  --line-height-h1: 1.25;

  --text-h2: clamp(1.5rem, 2.5vw + 0.5rem, 2.125rem);     /* 24px to 34px */
  --line-height-h2: 1.3;

  --text-h3: clamp(1.25rem, 1.5vw + 0.25rem, 1.625rem);   /* 20px to 26px */
  --line-height-h3: 1.4;

  --text-h4: clamp(1.125rem, 1vw + 0.2rem, 1.375rem);     /* 18px to 22px */
  --line-height-h4: 1.45;

  /* Body & Interactive Controls */
  --text-body-lead: clamp(1.0625rem, 0.5vw + 0.75rem, 1.1875rem); /* 17px to 19px */
  --line-height-body-lead: 1.8;

  --text-body: 1rem;                                     /* 16px */
  --line-height-body: 1.85;                              /* Optimal for Persian Vazirmatn reading flow */

  --text-body-sm: 0.875rem;                              /* 14px */
  --line-height-body-sm: 1.7;

  /* Technical Tags, Captions & Telemetry */
  --text-caption: 0.75rem;                               /* 12px */
  --line-height-caption: 1.5;

  --text-micro: 0.6875rem;                               /* 11px */
  --line-height-micro: 1.4;
}
```

---

## 4. Persian Typography Considerations

Persian orthography possesses distinct geometric characteristics compared to Latin alphabets:
1. **Vertical Ascent and Descent**: Vazirmatn requires a larger line-height than Latin text. While Latin body text functions well at `1.5`, Persian body text requires `--line-height-body: 1.85` to avoid clipping diacritics (Erab) and character ascenders/descenders.
2. **Letter Spacing Prohibition**: While Latin uppercase headers frequently utilize tracking (`letter-spacing: 0.05em`), **letter spacing must never be applied to Persian text**. Inserting spacing between connected Persian letters breaks standard ligature cursive joins and destroys legibility.
3. **Bi-Directional Isolation**: Mixed strings containing Persian sentences alongside chemical names, percentages, or English dosage terms must be enclosed in `<bdi>` tags or styled with `unicode-bidi: isolate` to avoid punctuation reversal.

---

## 5. Tabular Figures & Number Formatting

Financial metrics, chemical concentrations, and hardware sensors must remain structurally stable during real-time value updates.

```css
/* All prices, countdown timers, and sensor gauges */
.clinical-numeral,
.price-display,
.telemetry-gauge,
.countdown-timer {
  font-variant-numeric: tabular-nums lining-nums;
  -moz-font-feature-settings: "tnum" 1, "lnum" 1;
  -webkit-font-feature-settings: "tnum" 1, "lnum" 1;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

### Currency and Metric Presentation Rules
- **Toman / Rial Formatting**: Numerals formatted with Persian thousands separators (`,`), followed by a non-breaking space and the currency label (e.g. `۲,۴۵۰,۰۰۰ تومان`).
- **PPM / Telemetry Formatting**: Numbers formatted with tabular figures followed by the unit in monospace (e.g. `850 PPM`, `98.4% O2`).
- **CAS Registry Numbers**: Rendered strictly in monospace typography (e.g. `CAS: 144-55-8`).

---

## 6. CSS Class Helpers for Typographic Elements

```css
/* Display Heading */
.type-display {
  font-family: var(--font-persian);
  font-size: var(--text-display);
  font-weight: 900;
  line-height: var(--line-height-display);
  color: var(--color-text-primary);
}

/* Clinical Telemetry / Raw Chemical Spec */
.type-scientific-spec {
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-teal-400);
  letter-spacing: 0.02em;
}

/* Persian Narrative Body */
.type-body-persian {
  font-family: var(--font-persian);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: var(--line-height-body);
  color: var(--color-text-secondary);
}
```
