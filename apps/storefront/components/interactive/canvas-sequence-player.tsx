'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import './canvas-sequence-player.css';

export interface HotspotPin {
  id?: number | string;
  label?: string;
  title: string;
  desc?: string;
  description?: string;
  spec?: string;
  badge?: string;
  /** Frame index (1-based) where this hotspot is targeted / focused */
  frame?: number;
  /** Range of frames [start, end] where this hotspot is visible */
  frameRange?: [number, number];
  /** Tolerance in frames when frame is specified (default: 6) */
  frameTolerance?: number;
  /** Position in percentage on canvas (0..100) */
  x?: number;
  y?: number;
  xPercent?: number;
  yPercent?: number;
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
  aspectRatio?: number; // width / height, e.g. 1.33 for carbox, 1.25 for plasmax
  overlayHotspots?: HotspotPin[];
  className?: string;
  label?: string;
  onFrameChange?: (currentFrame: number, totalFrames: number) => void;
  onHotspotSelect?: (hotspot: HotspotPin) => void;
  selectedHotspotId?: number | string | null;
}

/**
 * Ultra-smooth, high-performance HTML5 `<canvas>` frame sequence player.
 * Built for React 19, Canvas 2D, and Next.js 16 with:
 * - High-DPI handling with devicePixelRatio clamped to 2.
 * - Intelligent frame preloading with progressive loading bar.
 * - Double buffering (offscreen canvas buffer) to completely eliminate flicker.
 * - Interactive mouse drag, touch swipe, inertia dampening, and scrubber slider.
 * - Clinical interactive hotspot pins with angle/frame-aware visibility and direct focus.
 */
export function CanvasSequencePlayer({
  frameFolder,
  totalFrames,
  framePrefix = '',
  padDigits = 2,
  fileExtension = '.webp',
  autoRotate = true,
  autoRotateSpeedMs = 55,
  interactiveDrag = true,
  aspectRatio = 1.33,
  overlayHotspots = [],
  className = '',
  label = 'نمایش سه‌بعدی ۳۶۰ درجه دستگاه',
  onFrameChange,
  onHotspotSelect,
  selectedHotspotId: externalSelectedHotspotId,
}: CanvasSequencePlayerProps) {
  // Container & Canvas refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Offscreen buffer canvas for rock-solid double-buffering
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Loaded image cache array: index 0 corresponds to frame 1
  const imageCacheRef = useRef<(HTMLImageElement | null)[]>([]);

  // Animation frame request & timing refs
  const animationFrameIdRef = useRef<number | null>(null);
  const lastFrameTimestampRef = useRef<number>(0);

  // Interaction tracking refs
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartFrameRef = useRef<number>(1);
  const dragVelocityRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const hasUserInteractedRef = useRef<boolean>(false);

  // Playback state
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const currentFrameRef = useRef<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoRotate);
  const isPlayingRef = useRef<boolean>(autoRotate);

  // Preloading progress state
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(false);
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Selected hotspot (internal or external)
  const [internalSelectedHotspotId, setInternalSelectedHotspotId] = useState<number | string | null>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<number | string | null>(null);

  const activeHotspotId =
    externalSelectedHotspotId !== undefined
      ? externalSelectedHotspotId
      : internalSelectedHotspotId;

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync ref with currentFrame state
  useEffect(() => {
    currentFrameRef.current = currentFrame;
    if (onFrameChange) {
      onFrameChange(currentFrame, totalFrames);
    }
  }, [currentFrame, totalFrames, onFrameChange]);

  // Sync ref with isPlaying state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  /**
   * Helper to construct frame URL from frame index (1-based)
   */
  const getFrameUrl = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(1, Math.min(totalFrames, index));
      const formattedNum = String(clampedIndex).padStart(padDigits, '0');
      const normalizedFolder = frameFolder.endsWith('/')
        ? frameFolder
        : `${frameFolder}/`;
      const normalizedExt = fileExtension.startsWith('.')
        ? fileExtension
        : `.${fileExtension}`;
      return `${normalizedFolder}${framePrefix}${formattedNum}${normalizedExt}`;
    },
    [frameFolder, framePrefix, padDigits, fileExtension, totalFrames]
  );

  /**
   * Initialize offscreen canvas once on client
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && !offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
  }, []);

  /**
   * Double-buffered, High-DPI canvas render function
   * Reads from offscreen canvas and blits atomically onto onscreen canvas
   */
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const primaryCtx = canvas.getContext('2d', { alpha: true });
      if (!primaryCtx) return;

      // Find best available image:
      // Exact frame first; if still downloading, fallback to closest loaded frame
      let img = imageCacheRef.current[frameIndex - 1];

      if (!img) {
        for (let offset = 1; offset < totalFrames; offset++) {
          const prev = frameIndex - 1 - offset;
          const next = frameIndex - 1 + offset;
          if (prev >= 0 && imageCacheRef.current[prev]) {
            img = imageCacheRef.current[prev];
            break;
          }
          if (next < totalFrames && imageCacheRef.current[next]) {
            img = imageCacheRef.current[next];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || canvas.clientWidth || 800;
      const displayHeight = rect.height || canvas.clientHeight || displayWidth / aspectRatio;

      // High-DPI handling with devicePixelRatio clamped to 2
      const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
      const targetCanvasWidth = Math.round(displayWidth * dpr);
      const targetCanvasHeight = Math.round(displayHeight * dpr);

      // Resize primary canvas if needed
      if (canvas.width !== targetCanvasWidth || canvas.height !== targetCanvasHeight) {
        canvas.width = targetCanvasWidth;
        canvas.height = targetCanvasHeight;
      }

      // Prepare offscreen buffer canvas
      let offscreen = offscreenCanvasRef.current;
      if (!offscreen) {
        offscreen = document.createElement('canvas');
        offscreenCanvasRef.current = offscreen;
      }

      if (offscreen.width !== targetCanvasWidth || offscreen.height !== targetCanvasHeight) {
        offscreen.width = targetCanvasWidth;
        offscreen.height = targetCanvasHeight;
      }

      const offscreenCtx = offscreen.getContext('2d', { alpha: true });
      if (!offscreenCtx) return;

      // Clear offscreen buffer
      offscreenCtx.clearRect(0, 0, targetCanvasWidth, targetCanvasHeight);

      // Compute aspect ratio containment fit (letterbox / contain)
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const hRatio = targetCanvasWidth / imgWidth;
      const vRatio = targetCanvasHeight / imgHeight;
      const ratio = Math.min(hRatio, vRatio);

      const drawWidth = imgWidth * ratio;
      const drawHeight = imgHeight * ratio;
      const drawX = (targetCanvasWidth - drawWidth) / 2;
      const drawY = (targetCanvasHeight - drawHeight) / 2;

      // Enable high-quality image smoothing
      offscreenCtx.imageSmoothingEnabled = true;
      offscreenCtx.imageSmoothingQuality = 'high';

      // 1. Draw onto offscreen buffer
      offscreenCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // 2. Single atomic blit from offscreen buffer to visible canvas (zero flicker)
      primaryCtx.clearRect(0, 0, targetCanvasWidth, targetCanvasHeight);
      primaryCtx.drawImage(offscreen, 0, 0);
    },
    [aspectRatio, totalFrames]
  );

  /**
   * Preload frames intelligently:
   * 1. Priority 1: Key frames (Frame 1 and hotspot frames)
   * 2. Priority 2: Stride frames for immediate low-res scrubbing
   * 3. Priority 3: All sequential remaining frames in parallel pool
   */
  useEffect(() => {
    let isCancelled = false;

    // Reset cache array
    imageCacheRef.current = new Array(totalFrames).fill(null);
    setLoadedCount(0);
    setIsFullyLoaded(false);

    let count = 0;

    const handleImageLoad = (img: HTMLImageElement, frameIdx: number) => {
      if (isCancelled) return;
      imageCacheRef.current[frameIdx - 1] = img;
      count += 1;
      setLoadedCount(count);

      // Render immediately if this is the active frame or the initial loaded frame
      if (
        frameIdx === currentFrameRef.current ||
        (count === 1 && !imageCacheRef.current[currentFrameRef.current - 1])
      ) {
        renderFrame(frameIdx);
      }

      if (count >= totalFrames) {
        setIsFullyLoaded(true);
      }
    };

    // Build priority list
    const prioritySet = new Set<number>();
    prioritySet.add(1);

    overlayHotspots.forEach((hs) => {
      if (hs.frame && hs.frame >= 1 && hs.frame <= totalFrames) {
        prioritySet.add(hs.frame);
      }
      if (hs.frameRange) {
        const mid = Math.round((hs.frameRange[0] + hs.frameRange[1]) / 2);
        if (mid >= 1 && mid <= totalFrames) prioritySet.add(mid);
      }
    });

    const strideSamples: number[] = [];
    for (let f = 1; f <= totalFrames; f += 4) {
      if (!prioritySet.has(f)) strideSamples.push(f);
    }

    const remainingFrames: number[] = [];
    for (let f = 1; f <= totalFrames; f++) {
      if (!prioritySet.has(f) && !strideSamples.includes(f)) {
        remainingFrames.push(f);
      }
    }

    const orderedSequence = [
      ...Array.from(prioritySet),
      ...strideSamples,
      ...remainingFrames,
    ];

    // Concurrency-limited loader pool (max 8 concurrent downloads)
    let cursor = 0;
    const MAX_CONCURRENT = 8;
    let activeLoads = 0;

    const pumpQueue = () => {
      if (isCancelled) return;
      while (activeLoads < MAX_CONCURRENT && cursor < orderedSequence.length) {
        const frameIdx = orderedSequence[cursor++];
        activeLoads++;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = getFrameUrl(frameIdx);

        img.onload = () => {
          activeLoads--;
          handleImageLoad(img, frameIdx);
          pumpQueue();
        };

        img.onerror = () => {
          activeLoads--;
          count++;
          setLoadedCount(count);
          pumpQueue();
        };
      }
    };

    pumpQueue();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, getFrameUrl, overlayHotspots, renderFrame]);

  /**
   * Re-render current frame on window resize or container resize
   */
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  /**
   * Auto-rotation animation loop with requestAnimationFrame
   */
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastFrameTimestampRef.current) {
        lastFrameTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimestampRef.current;

      if (isPlayingRef.current && !isDraggingRef.current) {
        if (elapsed >= autoRotateSpeedMs) {
          lastFrameTimestampRef.current = timestamp - (elapsed % autoRotateSpeedMs);

          setCurrentFrame((prev) => {
            const next = prev >= totalFrames ? 1 : prev + 1;
            renderFrame(next);
            return next;
          });
        }
      }

      // Handle inertia deceleration after drag release
      if (!isDraggingRef.current && Math.abs(dragVelocityRef.current) > 0.05) {
        dragVelocityRef.current *= 0.92; // friction dampening

        setCurrentFrame((prev) => {
          let next = Math.round(prev + dragVelocityRef.current);
          while (next > totalFrames) next -= totalFrames;
          while (next < 1) next += totalFrames;
          renderFrame(next);
          return next;
        });
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [autoRotateSpeedMs, totalFrames, renderFrame]);

  /**
   * Direct seek to a specific frame
   */
  const seekToFrame = useCallback(
    (targetFrame: number) => {
      let clamped = Math.round(targetFrame);
      while (clamped > totalFrames) clamped -= totalFrames;
      while (clamped < 1) clamped += totalFrames;

      setCurrentFrame(clamped);
      renderFrame(clamped);
    },
    [totalFrames, renderFrame]
  );

  /**
   * Interaction Handlers: Mouse & Touch Dragging
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactiveDrag) return;

      isDraggingRef.current = true;
      setIsDraggingState(true);
      dragStartXRef.current = e.clientX;
      dragStartFrameRef.current = currentFrameRef.current;
      dragVelocityRef.current = 0;
      lastDragTimeRef.current = performance.now();

      if (!hasUserInteractedRef.current) {
        hasUserInteractedRef.current = true;
        setHasInteracted(true);
      }

      // Pause auto-rotation on drag interaction
      if (isPlayingRef.current) {
        setIsPlaying(false);
      }

      // Capture pointer events on container
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore fallback
      }
    },
    [interactiveDrag]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;

      const currentX = e.clientX;
      const deltaX = currentX - dragStartXRef.current;
      const now = performance.now();
      const dt = Math.max(1, now - lastDragTimeRef.current);

      // Sensitivity: 1 full container width corresponds to 1 full 360° turn
      const containerWidth = containerRef.current?.clientWidth || 600;
      const frameDelta = -Math.round((deltaX / containerWidth) * totalFrames * 1.25);

      let targetFrame = dragStartFrameRef.current + frameDelta;
      while (targetFrame > totalFrames) targetFrame -= totalFrames;
      while (targetFrame < 1) targetFrame += totalFrames;

      // Track drag velocity for release inertia
      const instantVelocity = (frameDelta - (currentFrameRef.current - dragStartFrameRef.current)) / (dt / 16.6);
      dragVelocityRef.current = Math.max(-3, Math.min(3, instantVelocity));

      lastDragTimeRef.current = now;

      seekToFrame(targetFrame);
    },
    [totalFrames, seekToFrame]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDraggingState(false);

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore edge case DOM errors
      }
    },
    []
  );

  /**
   * Scrubber Slider Change Handler
   */
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (!hasUserInteractedRef.current) {
        hasUserInteractedRef.current = true;
        setHasInteracted(true);
      }
      setIsPlaying(false);
      dragVelocityRef.current = 0;
      seekToFrame(val);
    }
  };

  /**
   * Hotspot click action: Smoothly scrub/rotate to hotspot target frame
   */
  const handleHotspotClick = (hs: HotspotPin) => {
    if (!hasUserInteractedRef.current) {
      hasUserInteractedRef.current = true;
      setHasInteracted(true);
    }
    setIsPlaying(false);
    dragVelocityRef.current = 0;

    const id = hs.id ?? hs.title;
    setInternalSelectedHotspotId(id);

    if (onHotspotSelect) {
      onHotspotSelect(hs);
    }

    // Direct transition to target frame
    if (hs.frame) {
      seekToFrame(hs.frame);
    } else if (hs.frameRange) {
      const mid = Math.round((hs.frameRange[0] + hs.frameRange[1]) / 2);
      seekToFrame(mid);
    }
  };

  /**
   * Fullscreen toggle
   */
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request failed:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Exit fullscreen failed:', err);
      }
    }
  };

  // Listen to fullscreenchange events
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => renderFrame(currentFrameRef.current), 60);
    };

    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [renderFrame]);

  // Compute angle in degrees (0..360)
  const currentAngleDeg = Math.round(((currentFrame - 1) / totalFrames) * 360);

  // Compute loading percentage
  const loadPercentage = Math.round((loadedCount / Math.max(1, totalFrames)) * 100);

  /**
   * Filter hotspots visible around the current angle/frame
   */
  const visibleHotspots = useMemo(() => {
    return overlayHotspots.map((hs, index) => {
      const pinId = hs.id ?? `hs-${index}`;
      const posX = hs.x ?? hs.xPercent ?? 50;
      const posY = hs.y ?? hs.yPercent ?? 50;

      let isVisible = true;
      let opacity = 1;

      if (hs.frameRange) {
        isVisible = currentFrame >= hs.frameRange[0] && currentFrame <= hs.frameRange[1];
        opacity = isVisible ? 1 : 0;
      } else if (hs.frame) {
        const tolerance = hs.frameTolerance ?? 7;
        let frameDist = Math.abs(currentFrame - hs.frame);
        if (frameDist > totalFrames / 2) {
          frameDist = totalFrames - frameDist;
        }
        isVisible = frameDist <= tolerance;
        opacity = isVisible ? Math.max(0.2, 1 - frameDist / (tolerance + 1)) : 0;
      }

      return {
        ...hs,
        pinId,
        posX,
        posY,
        isVisible,
        opacity,
      };
    });
  }, [overlayHotspots, currentFrame, totalFrames]);

  return (
    <div
      ref={containerRef}
      className={`canvas-sequence-container ${className}`}
      aria-label={label}
    >
      {/* 360 Degree Luxury Badge */}
      <div
        className={`canvas-sequence-360-badge ${!isPlaying ? 'is-paused' : ''}`}
        aria-hidden="true"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19" />
        </svg>
        <span>360° CLINICAL 3D VIEW</span>
      </div>

      {/* Interactive Drag Hint Overlay (fades out after first drag) */}
      {interactiveDrag && !hasInteracted && isFullyLoaded && (
        <div className="canvas-drag-hint" role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 3 12 9 6" />
          </svg>
          <span>جهت چرخش ۳۶۰ درجه بکشید (Drag to Rotate)</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
            <polyline points="15 18 21 12 15 6" />
          </svg>
        </div>
      )}

      {/* Main Interactive Stage with Canvas */}
      <div
        className={`canvas-sequence-stage ${isDraggingState ? 'is-dragging' : ''}`}
        style={{ aspectRatio: `${aspectRatio}` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          className="canvas-sequence-main"
          role="img"
          aria-label={`${label} - زاویه ${currentAngleDeg} درجه (فریم ${currentFrame} از ${totalFrames})`}
        />

        {/* Hotspots Overlay Layer */}
        <div className="canvas-hotspots-layer">
          {visibleHotspots.map((hs) => {
            if (!hs.isVisible) return null;
            const isSelected = activeHotspotId === hs.pinId || activeHotspotId === hs.id;
            const isHovered = hoveredHotspotId === hs.pinId;

            return (
              <div
                key={hs.pinId}
                style={{
                  position: 'absolute',
                  left: `${hs.posX}%`,
                  top: `${hs.posY}%`,
                  opacity: hs.opacity,
                  transition: 'opacity 0.2s ease',
                  zIndex: isSelected ? 28 : 22,
                }}
              >
                <button
                  type="button"
                  className={`canvas-hotspot-pin ${isSelected ? 'is-active' : ''} ${!isSelected ? 'has-pulse' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHotspotClick(hs);
                  }}
                  onMouseEnter={() => setHoveredHotspotId(hs.pinId)}
                  onMouseLeave={() => setHoveredHotspotId(null)}
                  aria-label={`هات‌اسپات: ${hs.title}`}
                >
                  <span>{hs.label || '+'}</span>
                </button>

                {/* Rich Tooltip on Hover or Select */}
                {(isHovered || isSelected) && (
                  <div className="canvas-hotspot-tooltip" role="tooltip">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <strong>{hs.title}</strong>
                      {hs.badge && (
                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: '#0f766e', color: '#fff' }}>
                          {hs.badge}
                        </span>
                      )}
                    </div>
                    {(hs.desc || hs.description) && (
                      <p>{hs.desc || hs.description}</p>
                    )}
                    {hs.spec && (
                      <p style={{ marginTop: 4, color: '#38bdf8', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                        {hs.spec}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Loading Progress Bar Overlay */}
        <div className={`canvas-loading-overlay ${isFullyLoaded ? 'is-loaded' : ''}`}>
          <div className="canvas-loading-card">
            <div className="canvas-loading-spinner" />
            <h4 className="canvas-loading-title">در حال بارگذاری فریم‌های ۳۶۰ درجه</h4>
            <p className="canvas-loading-subtitle">
              کنسول سخت‌افزاری دکتر درمر • رزولوشن بالا و دابل‌بافر
            </p>

            <div className="canvas-progress-track">
              <div
                className="canvas-progress-fill"
                style={{ width: `${loadPercentage}%` }}
              />
            </div>

            <div className="canvas-progress-meta">
              <span>{loadPercentage}%</span>
              <span>{loadedCount} / {totalFrames} Frames</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrubbing & Controls Bar */}
      <div className="canvas-controls-bar">
        {/* Scrubber Slider */}
        <div className="canvas-scrubber-row">
          <div className="canvas-frame-counter">
            <span className="active-frame">{String(currentFrame).padStart(padDigits, '0')}</span>
            <span>/</span>
            <span>{totalFrames}</span>
          </div>

          <input
            type="range"
            min={1}
            max={totalFrames}
            value={currentFrame}
            onChange={handleScrubberChange}
            className="canvas-scrub-slider"
            aria-label="اسکرابر چرخش ۳۶۰ درجه"
          />

          <div className="canvas-angle-indicator">
            {currentAngleDeg}°
          </div>
        </div>

        {/* Action Controls & Hotspots Quick Jump */}
        <div className="canvas-actions-row">
          <div className="canvas-btn-group">
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              className={`canvas-ctrl-btn ${isPlaying ? 'is-active' : ''}`}
              onClick={() => {
                if (!hasUserInteractedRef.current) {
                  hasUserInteractedRef.current = true;
                  setHasInteracted(true);
                }
                dragVelocityRef.current = 0;
                setIsPlaying((p) => !p);
              }}
              aria-label={isPlaying ? 'توقف چرخش خودکار' : 'شروع چرخش خودکار'}
            >
              {isPlaying ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>توقف</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>چرخش خودکار</span>
                </>
              )}
            </button>

            {/* Reset to Frame 1 */}
            <button
              type="button"
              className="canvas-ctrl-btn"
              onClick={() => {
                dragVelocityRef.current = 0;
                seekToFrame(1);
              }}
              aria-label="تنظیم مجدد به نمای روبرو"
              title="نمای روبرو (Front View)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>نمای روبرو</span>
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              className={`canvas-ctrl-btn ${isFullscreen ? 'is-active' : ''}`}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'خروج از تمام‌صفحه' : 'مشاهده تمام‌صفحه'}
              title="تمام‌صفحه"
            >
              {isFullscreen ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>خروج</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>تمام‌صفحه</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Hotspot Jump Pills */}
          {overlayHotspots.length > 0 && (
            <div className="canvas-hotspots-nav" role="toolbar" aria-label="پرش به هات‌اسپات‌های قطعات">
              {overlayHotspots.map((hs, idx) => {
                const pinId = hs.id ?? `hs-${idx}`;
                const isSelected = activeHotspotId === pinId || activeHotspotId === hs.id;
                return (
                  <button
                    key={pinId}
                    type="button"
                    className={`canvas-hotspot-jump-pill ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleHotspotClick(hs)}
                    title={hs.title}
                  >
                    <span className="pill-num">{hs.label || idx + 1}</span>
                    <span>{hs.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
