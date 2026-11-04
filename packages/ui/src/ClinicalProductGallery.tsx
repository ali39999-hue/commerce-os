"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { designTokens } from "./tokens.js";

export interface ClinicalGalleryImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  badge?: string;
  type?: "main" | "texture" | "ingredients" | "how_to" | "results";
}

export interface ClinicalProductGalleryProps {
  images: ClinicalGalleryImage[];
  productName: string;
  initialIndex?: number;
  onImageSelect?: (index: number) => void;
  className?: string;
}

export const ClinicalProductGallery: React.FC<ClinicalProductGalleryProps> = ({
  images,
  productName,
  initialIndex = 0,
  onImageSelect,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: "rtl",
    startIndex: initialIndex,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    onImageSelect?.(index);
  }, [emblaApi, onImageSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "1/1",
          background: designTokens.colors.surface.subtle,
          borderRadius: designTokens.radius.card,
          display: "grid",
          placeItems: "center",
          color: designTokens.colors.text.muted,
          border: `1px solid ${designTokens.colors.surface.border}`,
        }}
      >
        <span>تصویر محصول در دسترس نیست</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div
      className={`clinical-product-gallery ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        direction: "rtl",
      }}
    >
      {/* ── Main Viewport Stage ── */}
      <div
        style={{
          position: "relative",
          borderRadius: designTokens.radius.card,
          overflow: "hidden",
          background: "#ffffff",
          border: `1px solid ${designTokens.colors.surface.border}`,
          boxShadow: designTokens.shadows.card,
        }}
      >
        {/* Badges / Clinical Tags */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {currentImage.badge && (
            <span
              style={{
                background: "rgba(36, 89, 79, 0.9)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                fontSize: "0.76rem",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {currentImage.badge}
            </span>
          )}
          <span
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              color: designTokens.colors.text.primary,
              fontSize: "0.74rem",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "999px",
              border: `1px solid ${designTokens.colors.surface.border}`,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {selectedIndex + 1} / {images.length}
          </span>
        </div>

        {/* Embla Viewport */}
        <div ref={emblaRef} style={{ overflow: "hidden", width: "100%", cursor: "grab" }}>
          <div style={{ display: "flex", touchAction: "pan-y" }}>
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                style={{
                  flex: "0 0 100%",
                  minWidth: 0,
                  position: "relative",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  padding: "24px",
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt || `${productName} - تصویر ${idx + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    userSelect: "none",
                  }}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="تصویر قبلی"
              style={{
                position: "absolute",
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${designTokens.colors.surface.border}`,
                boxShadow: designTokens.shadows.sm,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: designTokens.colors.text.primary,
                zIndex: 10,
                transition: "all 0.15s ease",
              }}
            >
              <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="تصویر بعدی"
              style={{
                position: "absolute",
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${designTokens.colors.surface.border}`,
                boxShadow: designTokens.shadows.sm,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: designTokens.colors.text.primary,
                zIndex: 10,
                transition: "all 0.15s ease",
              }}
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail Navigation Reel ── */}
      {images.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(images.length, 6)}, minmax(0, 1fr))`,
            gap: "10px",
            width: "100%",
          }}
        >
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => scrollTo(idx)}
                aria-label={`مشاهده تصویر ${idx + 1}`}
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: designTokens.radius.md,
                  border: isSelected
                    ? `2px solid ${designTokens.colors.brand.DEFAULT}`
                    : `1px solid ${designTokens.colors.surface.border}`,
                  padding: "4px",
                  background: isSelected ? "#ffffff" : designTokens.colors.surface.subtle,
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.18s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected ? designTokens.shadows.sm : "none",
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt || `پیش‌نمایش ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
