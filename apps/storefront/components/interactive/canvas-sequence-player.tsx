'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface HotspotPin {
  frameRange?: [number, number]; // Frame numbers where hotspot is visible
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  title: string;
  description: string;
  badge?: string;
}

export interface CanvasSequencePlayerProps {
  frameFolder: string;
  totalFrames: number;
  framePrefix?: string;
  padDigits?: number;
  fileExtension?: string;
  autoRotate?: boolean;
  autoRotateSpeedMs?: number;
  interactiveDrag?: boolean;
  aspectRatio?: number; // width / height, e.g. 1.2
  overlayHotspots?: HotspotPin[];
  className?: string;
  label?: string;
}

export function CanvasSequencePlayer({
  frameFolder,
  totalFrames,
  framePrefix = '',
  padDigits = 2,
  fileExtension = '.webp',
  autoRotate = true,
  autoRotateSpeedMs = 60,
  interactiveDrag = true,
  aspectRatio = 1.25,
  overlayHotspots = [],
  className = '',
  label = 'نمایش سه‌بعدی ۳۶۰ درجه دستگاه',
}: CanvasSequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [activeHotspot, setActiveHotspot] = useState<HotspotPin | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(1);

  // Helper to format frame file name
  const getFrameUrl = useCallback(
    (index: number) => {
      const padded = String(index).padStart(padDigits, '0');
      const cleanFolder = frameFolder.endsWith('/') ? frameFolder : `${frameFolder}/`;
      return `${cleanFolder}${framePrefix}${padded}${fileExtension}`;
    },
    [frameFolder, framePrefix, padDigits, fileExtension]
  );

  // Preload frames
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames || loaded >= Math.min(20, totalFrames)) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, getFrameUrl]);

  // Draw current frame to canvas with high-DPI scaling
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imagesRef.current[frameIndex - 1];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || 600;
      const displayHeight = rect.height || displayWidth / aspectRatio;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Fit image inside canvas while preserving aspect ratio
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = displayWidth / displayHeight;
      let drawW = displayWidth;
      let drawH = displayHeight;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawH = displayWidth / imgRatio;
        drawY = (displayHeight - drawH) / 2;
      } else {
        drawW = displayHeight * imgRatio;
        drawX = (displayWidth - drawW) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    },
    [aspectRatio]
  );

  // Redraw when currentFrame changes
  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame, drawFrame, loadedCount]);

  // Auto-rotation timer
  useEffect(() => {
    if (!isRotating || isLoading) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1);
    }, autoRotateSpeedMs);

    return () => clearInterval(interval);
  }, [isRotating, isLoading, totalFrames, autoRotateSpeedMs]);

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactiveDrag) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startFrameRef.current = currentFrame;
    setIsRotating(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const sensitivity = 6; // Pixels per frame shift
    const frameShift = Math.floor(deltaX / sensitivity);

    let next = (startFrameRef.current - frameShift) % totalFrames;
    if (next <= 0) next += totalFrames;
    setCurrentFrame(next);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Filter visible hotspots for current frame
  const visibleHotspots = overlayHotspots.filter((h) => {
    if (!h.frameRange) return true;
    return currentFrame >= h.frameRange[0] && currentFrame <= h.frameRange[1];
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 shadow-2xl backdrop-blur-xl ${className}`}
      style={{ minHeight: '380px' }}
      role="region"
      aria-label={label}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-300 font-mono border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">مدلسازی سه‌بعدی ۳۶۰°</span>
          <span className="text-slate-400">({currentFrame} / {totalFrames})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRotating((p) => !p)}
            className="px-2.5 py-1 rounded-md text-xs font-sans transition bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            aria-label={isRotating ? 'توقف چرخش خودکار' : 'فعال‌سازی چرخش خودکار'}
          >
            {isRotating ? '⏸ توقف' : '▶ چرخش'}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ aspectRatio }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-300 font-sans">
              در حال بارگذاری فریم‌های ۳۶۰ درجه ({Math.round((loadedCount / totalFrames) * 100)}٪)...
            </p>
          </div>
        )}

        {/* Interactive Hotspots */}
        {!isLoading &&
          visibleHotspots.map((h, i) => (
            <div
              key={i}
              className="absolute z-10"
              style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot((prev) => (prev?.title === h.title ? null : h));
                }}
                className="relative group p-1.5 focus:outline-none"
                aria-label={`توضیحات: ${h.title}`}
              >
                <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping" />
                <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-lg shadow-emerald-500/50 hover:scale-110 transition-transform">
                  +
                </span>
              </button>

              {activeHotspot?.title === h.title && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 border border-emerald-500/50 rounded-xl shadow-2xl z-30 text-right animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-400 font-sans">
                      {h.title}
                    </span>
                    {h.badge && (
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                        {h.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                    {h.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    className="mt-2 text-[10px] text-slate-400 hover:text-slate-200 underline block text-left w-full"
                  >
                    بستن ✕
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Scrubbing Range Slider */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[11px] text-slate-400 font-sans whitespace-nowrap">
          زاویه چرخش:
        </span>
        <input
          type="range"
          min={1}
          max={totalFrames}
          value={currentFrame}
          onChange={(e) => {
            setIsRotating(false);
            setCurrentFrame(Number(e.target.value));
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          aria-label="کنترل زاویه چرخش دستگاه ۳۶۰ درجه"
        />
        <span className="text-[10px] font-mono text-slate-400 w-8 text-left">
          {Math.round((currentFrame / totalFrames) * 360)}°
        </span>
      </div>

      <p className="text-[11px] text-center text-slate-500 font-sans mt-2">
        برای چرخش دستی دستگاه، نشانگر ماوس یا انگشت را روی تصویر به چپ و راست بکشید.
      </p>
    </div>
  );
}
