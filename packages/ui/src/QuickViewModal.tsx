import React, { useState } from "react";
import { designTokens } from "./tokens.js";
import { Modal } from "./Modal.js";
import { Button } from "./Button.js";
import { Badge } from "./Badge.js";
import { PriceTag } from "./PriceTag.js";

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  attributes?: Record<string, string>; // e.g. { Volume: "50ml", Concentration: "15%" }
}

export interface QuickViewProduct {
  id: string;
  title: string;
  subtitle?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  images: {
    url: string;
    alt?: string;
  }[];
  price: number;
  originalPrice?: number;
  currency?: string;
  description: string;
  clinicalHighlights?: string[];
  variants?: ProductVariant[];
  sku?: string;
}

export interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: QuickViewProduct | null;
  onAddToCart?: (product: QuickViewProduct, selectedVariant: ProductVariant | null, quantity: number) => void;
  onViewDetails?: (productId: string) => void;
  isAddingToCart?: boolean;
}

export function QuickViewModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onViewDetails,
  isAddingToCart = false,
}: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const currentVariant = product.variants?.find((v) => v.id === selectedVariantId) || null;
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;
  const isOutOfStock = currentVariant ? currentVariant.inStock === false : false;

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    onAddToCart?.(product, currentVariant, quantity);
  };

  const images = product.images.length > 0 ? product.images : [{ url: "", alt: product.title }];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      ariaLabel={`نمای سریع محصول ${product.title}`}
      showCloseButton
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: designTokens.spacing[6],
          alignItems: "start",
          fontFamily: designTokens.typography.fontFamily.sans.join(", "),
        }}
      >
        {/* Left Column: Gallery & Thumbnail Switcher */}
        <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[3] }}>
          {/* Main Selected Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1/1",
              backgroundColor: designTokens.colors.warmMarble[100],
              borderRadius: designTokens.radius.lg,
              overflow: "hidden",
              border: `1px solid ${designTokens.colors.warmMarble.border}`,
            }}
          >
            {images[selectedImageIndex]?.url ? (
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt || product.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: designTokens.colors.text.hint,
                  fontSize: designTokens.typography.fontSize.sm,
                }}
              >
                تصویر در دسترس نیست
              </div>
            )}

            {product.brand && (
              <div
                style={{
                  position: "absolute",
                  top: designTokens.spacing[3],
                  left: designTokens.spacing[3],
                }}
              >
                <Badge variant="clinical" size="sm">
                  {product.brand}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: designTokens.spacing[2],
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
              {images.map((img, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`انتخاب تصویر ${idx + 1}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: designTokens.radius.md,
                      overflow: "hidden",
                      border: `2px solid ${
                        isSelected
                          ? designTokens.colors.clinicalTeal.DEFAULT
                          : designTokens.colors.warmMarble.border
                      }`,
                      padding: 0,
                      cursor: "pointer",
                      backgroundColor: designTokens.colors.warmMarble[50],
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `تصویر کوچک ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Purchase Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[4] }}>
          <div>
            {product.subtitle && (
              <span
                style={{
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.clinicalTeal[600],
                  fontWeight: designTokens.typography.fontWeight.semibold,
                }}
              >
                {product.subtitle}
              </span>
            )}
            <h1
              style={{
                margin: `${designTokens.spacing[1]} 0`,
                fontSize: designTokens.typography.fontSize["2xl"],
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              {product.title}
            </h1>
            {product.sku && (
              <span style={{ fontSize: "0.6875rem", color: designTokens.colors.text.hint }}>
                شناسه بالینی / SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Pricing Row */}
          <div>
            <PriceTag
              amount={activePrice}
              originalAmount={activeOriginalPrice}
              currency={product.currency || "IRT"}
              size="lg"
            />
          </div>

          {/* Clinical Highlights / Efficacy points */}
          {product.clinicalHighlights && product.clinicalHighlights.length > 0 && (
            <div
              style={{
                backgroundColor: designTokens.colors.clinicalTeal[50],
                borderRadius: designTokens.radius.md,
                padding: designTokens.spacing[3],
                border: `1px solid ${designTokens.colors.clinicalTeal[200]}`,
              }}
            >
              <div
                style={{
                  fontSize: designTokens.typography.fontSize.xs,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.clinicalTeal[800],
                  marginBottom: "4px",
                }}
              >
                شاخص‌های بالینی و فرمولاسیون:
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingInlineStart: designTokens.spacing[4],
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.clinicalTeal[900],
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                {product.clinicalHighlights.map((hl, i) => (
                  <li key={i}>{hl}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Description Snippet */}
          <p
            style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.sm,
              color: designTokens.colors.text.secondary,
              lineHeight: designTokens.typography.lineHeight.normal,
            }}
          >
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
              <span
                style={{
                  fontSize: designTokens.typography.fontSize.xs,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: designTokens.colors.text.primary,
                }}
              >
                انتخاب مشخصه / حجم:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: designTokens.spacing[2] }}>
                {product.variants.map((v) => {
                  const isSelected = v.id === (selectedVariantId || product.variants?.[0]?.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={v.inStock === false}
                      style={{
                        padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                        borderRadius: designTokens.radius.md,
                        border: `1px solid ${
                          isSelected
                            ? designTokens.colors.clinicalTeal.DEFAULT
                            : designTokens.colors.warmMarble.border
                        }`,
                        backgroundColor: isSelected
                          ? designTokens.colors.clinicalTeal.tint
                          : designTokens.colors.surface.card,
                        color:
                          v.inStock === false
                            ? designTokens.colors.text.hint
                            : isSelected
                            ? designTokens.colors.clinicalTeal[800]
                            : designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.xs,
                        fontWeight: isSelected
                          ? designTokens.typography.fontWeight.bold
                          : designTokens.typography.fontWeight.normal,
                        cursor: v.inStock === false ? "not-allowed" : "pointer",
                        textDecoration: v.inStock === false ? "line-through" : "none",
                      }}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: designTokens.spacing[3],
              marginTop: designTokens.spacing[2],
            }}
          >
            {/* Quantity Controller */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: `1px solid ${designTokens.colors.warmMarble.border}`,
                borderRadius: designTokens.radius.md,
                height: "40px",
                backgroundColor: designTokens.colors.warmMarble.subtle,
              }}
            >
              <button
                type="button"
                aria-label="کاهش تعداد"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: "36px",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: designTokens.colors.text.primary,
                }}
              >
                -
              </button>
              <span
                style={{
                  width: "36px",
                  textAlign: "center",
                  fontSize: designTokens.typography.fontSize.sm,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                }}
              >
                {new Intl.NumberFormat("fa-IR").format(quantity)}
              </span>
              <button
                type="button"
                aria-label="افزایش تعداد"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: "36px",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: designTokens.colors.text.primary,
                }}
              >
                +
              </button>
            </div>

            {/* Add to Cart CTA */}
            <Button
              variant="primary"
              size="md"
              fullWidth
              isLoading={isAddingToCart}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? "ناموجود" : "افزودن به سبد خرید"}
            </Button>
          </div>

          {/* Secondary Details Link */}
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(product.id)}
              style={{ alignSelf: "center", marginTop: designTokens.spacing[1] }}
            >
              مشاهده پرونده تخصصی و مشخصات کامل محصول ←
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
