# FORM_STATES.md — Iranian Regulatory Form Validation & States
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Form States, Input Masks & Iranian Regulatory Validation

> **Core Standard**: Every form input across Dr Dermer UK must adhere strictly to Iranian statutory validation standards, real-time client-side feedback without jarring layout shifts, and accessible error messaging.
> **Anti-Slop Invariant**: No generic "Invalid field" alerts. Every validation error provides precise, actionable Persian guidance, input masking, and immediate Modulo-11 algorithmic verification.

---

## 1. Input Validation Standards & Algorithms

### 1.1 Iranian Mobile Phone Number (`09xx`)
- **Specification**: 11 digits starting with `09`, followed by 9 numerical digits.
- **Normalization**: Automatically strip spaces, dashes, parentheses, and convert Eastern Arabic/Persian digits (`۰۱۲۳۴۵۶۷۸۹`) to standard ASCII (`0123456789`).
- **Regular Expression**: `^09[0-9]{9}$` or `^(\+98|0)?9\d{9}$`
- **Mask Pattern**: `09## ### ####` (e.g. `0912 345 6789`)
- **Operator Prefix Verification**:
  - MCI (Hamrah-e Aval): `0910`, `0911`, `0912`, `0913`, `0914`, `0915`, `0916`, `0917`, `0918`, `0919`, `0990`, `0991`, `0992`, `0993`, `0994`
  - MTN Irancell: `0930`, `0933`, `0935`, `0936`, `0937`, `0938`, `0939`, `0901`, `0902`, `0903`, `0904`, `0905`
  - Rightel: `0920`, `0921`, `0922`, `0923`
  - Shatel Mobile: `0998`

### 1.2 Iranian National ID (`کد ملی` - Modulo-11 Checksum)
- **Specification**: Exactly 10 numerical digits. Left-padded with zeros if leading zeroes are omitted by user.
- **Modulo-11 Algorithmic Verification**:
  1. Digits $d_{10}, d_9, \dots, d_2$ are multiplied by position weights $10, 9, \dots, 2$.
  2. Compute Sum: $S = \sum_{i=2}^{10} d_i \times i$.
  3. Compute Remainder: $R = S \pmod{11}$.
  4. Validation Condition:
     - If $R < 2$, check digit $d_1$ must equal $R$.
     - If $R \ge 2$, check digit $d_1$ must equal $11 - R$.
  5. Blacklist Reject: Identical repetitive sequences (`0000000000`, `1111111111`, ..., `9999999999`) fail validation despite satisfying Modulo-11.

```typescript
export function validateIranianNationalId(code: string): boolean {
  // Convert Persian/Arabic digits to ASCII and strip non-digits
  const clean = code.replace(/[^\d]/g, '');
  if (clean.length !== 10) return false;

  // Reject repetitive numbers
  if (/^(\d)\1{9}$/.test(clean)) return false;

  const check = parseInt(clean[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i], 10) * (10 - i);
  }
  const remainder = sum % 11;

  return remainder < 2 ? check === remainder : check === 11 - remainder;
}
```

### 1.3 Iranian Postal Code (`کد پستی ۱۰ رقمی`)
- **Specification**: Exactly 10 digits without punctuation.
- **Regulatory Rules**:
  - Digits cannot contain `0` or `2` in the first 5 digits (State/City sorting code rule per Iran National Post).
  - Repetitive digits or invalid prefixes fail.
- **Regular Expression**: `\b(?!(\d)\1{3})[13-9]{4}[1346-9][0-9]{5}\b`
- **Mask Pattern**: `##### - #####`

### 1.4 Iranian Medical Council License (`شماره نظام پزشکی`)
- **Specification**: Used for B2B clinic quote requests and Doctor CME masterclasses.
- **Format**:
  - Numerical license number: 4 to 6 digits (e.g. `148920`).
  - Prefix / Specialization code optional or required based on branch:
    - `م` (Pezeshk / General Practitioner & Specialists)
    - `د` (Dandansaz / Dentist)
    - `دار` (Darousaz / Pharmacist)
- **Validation Rule**: Minimum 4 digits, maximum 6 digits, strictly numeric after prefix normalization. Cross-referenced via Iranian Medical Council (IRIMC / سازمان نظام پزشکی) lookup API.

### 1.5 Sheba Bank Account Number (`شماره شبا - IBAN`)
- **Specification**: 26 characters starting with `IR`, followed by 24 numerical digits.
- **Checksum**: ISO 7064 Mod 97-10 standard IBAN algorithm.
- **Mask Pattern**: `IR## #### #### #### #### #### ##`

---

## 2. Component Visual States & Feedback Lifecycle

| State | Border & Outline | Background | Typography & Icons | Assistive Helper Text |
| :--- | :--- | :--- | :--- | :--- |
| **Pristine / Idle** | `border: 1px solid rgba(255, 255, 255, 0.12)` | `background: rgba(15, 23, 42, 0.6)` | Placeholder text: `#64748b` | Neutral hint (e.g. "شماره موبایل را بدون صفر وارد کنید") |
| **Focused / Active** | `border: 1px solid #06b6d4; box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2)` | `background: rgba(15, 23, 42, 0.85)` | Label elevated to float position; color `#38bdf8` | Highlighted instructional hint |
| **Typing / Validating** | `border: 1px solid rgba(255, 255, 255, 0.25)` | `background: rgba(15, 23, 42, 0.85)` | Input text `#f8fafc`; Tabular numbers | Debounced inline validator running (300ms) |
| **Valid / Success** | `border: 1px solid #10b981; box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.25)` | `background: rgba(6, 78, 59, 0.15)` | Green checkmark icon (`#10b981`) rendered at end | Success message or silent acceptance |
| **Invalid / Error** | `border: 1px solid #f43f5e; box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.2)` | `background: rgba(136, 19, 55, 0.15)` | Alert exclamation icon (`#f43f5e`) rendered at end | High-contrast error message: `#fb7185` with `role="alert"` |
| **Disabled / Locked** | `border: 1px dashed rgba(255, 255, 255, 0.08)` | `background: rgba(30, 41, 59, 0.4)` | Text `#475569`; Lock icon | "این فیلد توسط مدیر سیستم قفل شده است" |

---

## 3. Persian Regulatory Error Messages & Triggers

| Field | Trigger Condition | Persian Error String (`fa-IR`) | Error Level |
| :--- | :--- | :--- | :--- |
| **Mobile (`09xx`)** | Empty on submit | "شماره موبایل خود را وارد کنید." | Blocking |
| | Format mismatch (e.g. starts with `08`) | "فرمت شماره موبایل صحیح نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)." | Blocking |
| | Length < 11 digits | "شماره موبایل باید دقیقاً ۱۱ رقم باشد." | Inline Warning |
| **National ID (`کد ملی`)**| Empty on submit | "کد ملی ۱۰ رقمی الزامی است." | Blocking |
| | Repetitive numbers (`1111111111`) | "کد ملی وارد شده نامعتبر است." | Blocking |
| | Modulo-11 failure | "رقم کنترلی کد ملی همخوانی ندارد. لطفاً بررسی و اصلاح نمایید." | Blocking |
| **Postal Code (`کد پستی`)**| Contains `0` or `2` in first 5 digits | "کد پستی نامعتبر است (ارقام آغازین نباید صفر یا دو باشند)." | Blocking |
| | Length !== 10 digits | "کد پستی باید دقیقاً ۱۰ رقم بدون فاصله یا خط تیره باشد." | Inline Warning |
| **Medical License** | Non-numeric or length < 4 | "شماره نظام پزشکی معتبر نیست (حداقل ۴ رقم عددی)." | Blocking |
| | Unregistered license | "شماره نظام پزشکی در سامانه تایید هویت یافت نشد." | Async Fallback |
| **Sheba Number** | Checksum Mod-97 failure | "شماره شبا نامعتبر است. کنترل اعتبارسنجی بانکی شکست خورد." | Blocking |

---

## 4. Accessibility & Screen Reader Protocol

1. **Aria Relationships**:
   - Every input has `id="field-[name]"`.
   - Error messages rendered with `id="error-[name]" role="alert" aria-live="assertive"`.
   - Connected via `aria-describedby="error-[name] hint-[name]"`.
   - Invalid inputs dynamically set `aria-invalid="true"`.
2. **Keyboard Focus Flow**:
   - On failed form submission, focus automatically shifts to the first invalid field.
   - Smooth scroll into view with `block: "center"` so helper text is fully visible.
   - Screen reader immediately announces the field label followed by the error text.
3. **Digit Conversion & Bi-Directionality**:
   - Inputs support Persian keyboard layout directly; numerals are normalized internally.
   - Direction set to `dir="ltr"` for phone numbers, national IDs, and card numbers, while labels and helper text remain `dir="rtl"`.
