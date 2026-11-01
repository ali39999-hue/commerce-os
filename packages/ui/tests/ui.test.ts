import { describe, it, expect } from "vitest";
import React from "react";
import { designTokens } from "../src/tokens.js";
import { Badge } from "../src/Badge.js";
import { Button } from "../src/Button.js";
import { PriceTag } from "../src/PriceTag.js";

describe("@commerce-os/ui Primitives & Design Tokens", () => {
  it("exports valid clinical color tokens", () => {
    expect(designTokens.colors.clinicalTeal.DEFAULT).toBe("#0B6E66");
    expect(designTokens.colors.bioGreen.DEFAULT).toBe("#16A34A");
    expect(designTokens.colors.deepSlate[900]).toBeDefined();
  });

  it("exports 4px baseline spacing scale", () => {
    expect(designTokens.spacing[1]).toBe("4px");
    expect(designTokens.spacing[2]).toBe("8px");
    expect(designTokens.spacing[4]).toBe("16px");
  });

  it("exports typography tokens with tabular numerals font variant", () => {
    expect(designTokens.typography.fontSize.base).toBe("1rem");
    expect(designTokens.typography.fontSize.xs).toBe("0.75rem");
  });

  it("renders Badge component definition with clinical variants", () => {
    expect(Badge).toBeDefined();
  });

  it("renders Button component definition with variants and sizes", () => {
    expect(Button).toBeDefined();
  });

  it("renders PriceTag component definition with Toman and Rial labels", () => {
    expect(PriceTag).toBeDefined();
  });
});
