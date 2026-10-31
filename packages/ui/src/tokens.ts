/**
 * Design Tokens for Commerce OS (Firuzo Luxe & Iranian Commerce Standard).
 * Synthesized from itrip-platform and aroux30/site.
 */

export const designTokens = {
  colors: {
    brand: {
      DEFAULT: "#0B6E66", // Firuzo deep turquoise
      hover: "#084F4A",
      tint: "#E6F3F1",
      soft: "#C2E2DE",
    },
    action: {
      DEFAULT: "#F2A33A", // Amber accent CTA
      hover: "#D98822",
      tint: "#FEF6EB",
      contrast: "#1A1A1A",
    },
    surface: {
      page: "#FBF4EE", // Soft warm background
      card: "#FFFFFF",
      elevated: "#FFFFFF",
      subtle: "#F5EDE4",
      border: "#EADCCF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
      muted: "#718096",
      inverse: "#FFFFFF",
    },
    status: {
      success: "#10B981",
      successBg: "#ECFDF5",
      warning: "#F59E0B",
      warningBg: "#FFFBEB",
      danger: "#EF4444",
      dangerBg: "#FEF2F2",
      info: "#3B82F6",
      infoBg: "#EFF6FF",
    },
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    card: "24px",
    pill: "9999px",
  },
  shadows: {
    card: "0 4px 20px -2px rgba(11, 110, 102, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
    elevated: "0 10px 30px -4px rgba(11, 110, 102, 0.10), 0 4px 10px -2px rgba(0, 0, 0, 0.05)",
    dropdown: "0 12px 32px 0 rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: {
      sans: ["Vazirmatn", "IRANSansX", "system-ui", "-apple-system", "sans-serif"],
      mono: ["Courier New", "monospace"],
    },
  },
} as const;
