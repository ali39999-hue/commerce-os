"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export interface ContactMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  title?: string;
  address?: string;
}

export default function ContactMap({
  latitude = 35.7724,
  longitude = 51.4181,
  zoom = 16,
  title = "ساختمان کیان (دفتر مرکزی)",
  address = "تهران، خیابان ولیعصر، قبل از تقاطع نیایش، نبش خیابان ناصری، ساختمان کیان (پلاک ۲۵۵۱)",
}: ContactMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let mapInstance: any = null;

    // Dynamically import Leaflet inside useEffect so window is guaranteed to exist
    import("leaflet").then((L) => {
      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      mapInstance = map;

      // OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">Leaflet</a>',
      }).addTo(map);

      // Zoom Controls at bottom-right (matching Khanoumi screenshot)
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Custom Red Ring Target Pin Marker (matching screenshot exactly)
      const customPinIcon = L.divIcon({
        className: "khanoumi-target-pin",
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: 0; border: 3px solid #dc2626; border-radius: 50%; background: rgba(220, 38, 38, 0.12); box-shadow: 0 0 10px rgba(220, 38, 38, 0.35);"></div>
            <div style="width: 13px; height: 13px; border: 2.5px solid #dc2626; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; z-index: 2;">
              <div style="width: 5px; height: 5px; background: #dc2626; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([latitude, longitude], { icon: customPinIcon }).addTo(map);

      marker.bindPopup(`
        <div style="text-align: right; direction: rtl; font-family: Vazirmatn, system-ui, sans-serif; padding: 6px 4px; min-width: 210px;">
          <strong style="color: #0f172a; font-size: 13.5px; display: block; margin-bottom: 4px;">${title}</strong>
          <p style="margin: 0; color: #475569; font-size: 12px; line-height: 1.6;">${address}</p>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #e2e8f0; font-size: 11px; color: #166534; font-weight: 700;">
            📍 موقعیت رسمی دفتر مرکزی
          </div>
        </div>
      `);

      setIsLoaded(true);

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [latitude, longitude, zoom, title, address]);

  return (
    <div
      ref={mapContainerRef}
      className="contact-map-element"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "440px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        position: "relative",
        zIndex: 1,
        background: "#f8fafc",
      }}
    >
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            color: "#64748b",
            fontSize: "14px",
            zIndex: 10,
          }}
        >
          در حال بارگذاری نقشه تعاملی…
        </div>
      )}
    </div>
  );
}
