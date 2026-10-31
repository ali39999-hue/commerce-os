/**
 * Design Tokens for Commerce OS (Firuzo Luxe, Clinical & Iranian Commerce Standard).
 * Synthesized for high-trust health, luxury, and regional e-commerce workflows.
 */

export const designTokens = {
  colors: {
    // Clinical Teal: Primary brand palette for healthcare, trust, and luxury wellness
    clinicalTeal: {
      50: "#F0FDFB",
      100: "#CCFBF4",
      200: "#99F6E7",
      300: "#5EEAD6",
      400: "#2DD4BE",
      500: "#0B6E66", // Firuzo primary
      600: "#085751",
      700: "#06433F",
      800: "#04302D",
      900: "#021E1C",
      DEFAULT: "#0B6E66",
      hover: "#085751",
      tint: "#E6F3F1",
      soft: "#C2E2DE",
    },

    // Bio-Green: Health, organic verification, vitality, and clinical validation
    bioGreen: {
      50: "#F0FDF4",
      100: "#DCFCE7",
      200: "#BBF7D0",
      300: "#86EFAC",
      400: "#4ADE80",
      500: "#16A34A",
      600: "#15803D",
      700: "#166534",
      800: "#14532D",
      900: "#052E16",
      DEFAULT: "#16A34A",
      hover: "#15803D",
      tint: "#F0FDF4",
    },

    // Deep Slate: Modern technical neutrality, high-contrast typography, and structure
    deepSlate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
      950: "#020617",
      DEFAULT: "#0F172A",
    },

    // Warm Marble: Gentle background warmth, luxury tactile feel
    warmMarble: {
      50: "#FDFBF7",
      100: "#FBF4EE", // Soft warm background
      200: "#F5EDE4", // Subtle surface
      300: "#EADCCF", // Border
      400: "#DAC3B0",
      500: "#BFA38E",
      DEFAULT: "#FBF4EE",
      subtle: "#F5EDE4",
      border: "#EADCCF",
    },

    // Amber Accent: Warm high-conversion CTAs, badges, discounts, and highlights
    amberAccent: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F2A33A", // Signature Amber CTA
      600: "#D97706",
      700: "#B45309",
      800: "#92400E",
      900: "#78350F",
      DEFAULT: "#F2A33A",
      hover: "#D97706",
      tint: "#FEF6EB",
      contrast: "#1A1A1A",
    },

    // Backward-compatible Brand & Action mappings
    brand: {
      DEFAULT: "#0B6E66",
      hover: "#085751",
      tint: "#E6F3F1",
      soft: "#C2E2DE",
    },
    action: {
      DEFAULT: "#F2A33A",
      hover: "#D97706",
      tint: "#FEF6EB",
      contrast: "#1A1A1A",
    },

    // Surfaces
    surface: {
      page: "#FBF4EE",
      card: "#FFFFFF",
      elevated: "#FFFFFF",
      subtle: "#F5EDE4",
      border: "#EADCCF",
      borderFocus: "#0B6E66",
      glass: "rgba(255, 255, 255, 0.85)",
      glassDark: "rgba(15, 23, 42, 0.85)",
      backdrop: "rgba(15, 23, 42, 0.6)",
    },

    // Typography
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      muted: "#64748B",
      hint: "#94A3B8",
      inverse: "#FFFFFF",
      brand: "#0B6E66",
      bio: "#15803D",
      accent: "#B45309",
    },

    // Status Colors
    status: {
      success: "#10B981",
      successBg: "#ECFDF5",
      successBorder: "#A7F3D0",
      warning: "#F59E0B",
      warningBg: "#FFFBEB",
      warningBorder: "#FDE68A",
      danger: "#EF4444",
      dangerBg: "#FEF2F2",
      dangerBorder: "#FECACA",
      info: "#3B82F6",
      infoBg: "#EFF6FF",
      infoBorder: "#BFDBFE",
    },
  },

  // Spacing Scale
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },

  // Border Radii
  radius: {
    none: "0px",
    xs: "4px",
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "20px",
    card: "24px",
    pill: "9999px",
    full: "9999px",
  },

  // Shadows
  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
    sm: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
    md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)",
    card: "0 4px 20px -2px rgba(11, 110, 102, 0.07), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
    elevated: "0 10px 30px -4px rgba(11, 110, 102, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)",
    dropdown: "0 12px 32px 0 rgba(15, 23, 42, 0.14)",
    modal: "0 20px 48px -8px rgba(15, 23, 42, 0.22), 0 8px 16px -4px rgba(15, 23, 42, 0.12)",
    drawer: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
  },

  // Z-Indices
  zIndices: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    drawer: 1400,
    popover: 1500,
    toast: 1600,
    tooltip: 1700,
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ["Vazirmatn", "IRANSansX", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      mono: ["Fira Code", "Courier New", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem",// 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Transitions
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "400ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type DesignTokens = typeof designTokens;
