"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "../utils/cn";

/**
 * Product finish configuration item.
 */
export interface ProductFinishItem {
  /** Unique finish identifier (e.g. "raw-titanium", "obsidian-black") */
  id: string;
  /** Primary display name of the finish (e.g. "Raw Titanium") */
  name: string;
  /** Secondary subtitle, edition or material label (e.g. "01 / GRADE 5 TITANIUM") */
  label?: string;
  /** URL to the transparent PNG image of the product silhouette */
  image: string;
  /** 3 to 6 CSS hex/rgb colors defining the iridescent holographic rainbow reflection */
  holoColors: string[];
  /** Optional price tag (e.g. "$1,199") */
  price?: string;
  /** Optional brief material description */
  description?: string;
}

/**
 * Holographic reflection intensity preset.
 */
export type HoloFinishIntensity = "subtle" | "medium" | "vibrant";

/**
 * Props for the HoloFinishCard component.
 */
export interface HoloFinishCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transparent PNG image URL of the product silhouette.
   * If provided without `finishes`, HoloFinishCard runs in standalone single-finish mode for this image.
   */
  src?: string;
  /**
   * Product display name when using `src`.
   * @default "Product Finish"
   */
  title?: string;
  /**
   * Secondary subtitle or edition tag when using `src`.
   */
  subtitle?: string;
  /**
   * Optional price tag string when using `src`.
   */
  price?: string;
  /**
   * Custom holographic iridescent foil colors when using `src`.
   */
  holoColors?: string[];
  /**
   * Array of product finish variants to display.
   * If only one finish is provided, the card renders in standalone showcase mode.
   */
  finishes?: ProductFinishItem[];
  /**
   * Currently active/selected finish ID.
   * If omitted, the first finish in the array is selected by default.
   */
  selectedFinishId?: string;
  /**
   * Callback fired when a finish variant is selected by click or tap.
   */
  onSelectFinish?: (finish: ProductFinishItem) => void;
  /**
   * Card width in pixels or CSS dimension string.
   * @default 360
   */
  cardWidth?: number | string;
  /**
   * Card height in pixels or CSS dimension string.
   * @default 480
   */
  cardHeight?: number | string;
  /**
   * Holographic foil reflection intensity.
   * @default "medium"
   */
  intensity?: HoloFinishIntensity;
  /**
   * Whether to display typographic labels (finish name, series, price, description).
   * @default true
   */
  showLabels?: boolean;
  /**
   * Maximum 3D tilt angle in degrees during cursor tracking.
   * @default 32
   */
  maxTilt?: number;
  /**
   * CSS perspective distance in pixels.
   * @default 900
   */
  perspective?: number;
  /**
   * Product elevation distance along the Z-axis in pixels for the 3D pop effect.
   * @default 45
   */
  elevateZ?: number;
  /**
   * Whether autonomous sinusoidal micro-tilt animation runs when idle.
   * @default true
   */
  idleAnimation?: boolean;
  /**
   * Whether the dynamic specular glare sheen tracks pointer motion.
   * @default true
   */
  showGlare?: boolean;
  /**
   * Whether to render the finish swatch selector bar when multiple finishes exist.
   * @default true
   */
  showSwatches?: boolean;
}

/**
 * HoloFinishCard
 * 
 * An interactive 3D product finish card with real-time physics and holographic foil
 * reflection masked strictly to the product silhouette via CSS masking.
 * 
 * Designed for luxury e-commerce showcases, timepiece finish pickers, sneaker colorways,
 * and high-end tech hardware customizers.
 */
export const HoloFinishCard = React.forwardRef<HTMLDivElement, HoloFinishCardProps>(
  (
    {
      src,
      title,
      subtitle,
      price,
      holoColors,
      finishes,
      selectedFinishId,
      onSelectFinish,
      cardWidth = 360,
      cardHeight = 480,
      intensity = "medium",
      showLabels = true,
      maxTilt = 32,
      perspective = 900,
      elevateZ = 45,
      idleAnimation = true,
      showGlare = true,
      showSwatches = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Resolve finishes list from either finishes array or standalone src prop
    const items = useMemo<ProductFinishItem[]>(() => {
      if (finishes && finishes.length > 0) return finishes;
      if (src) {
        return [
          {
            id: "default-finish",
            name: title || "Product Finish",
            label: subtitle || "PRO EDITION",
            image: src,
            holoColors: holoColors || [
              "rgba(255, 255, 255, 0.9)",
              "rgba(212, 212, 216, 0.7)",
              "rgba(161, 161, 170, 0.6)",
              "rgba(250, 250, 250, 0.95)",
            ],
            price: price,
          },
        ];
      }
      return [];
    }, [finishes, src, title, subtitle, price, holoColors]);

    // Determine active finish
    const [internalSelectedId, setInternalSelectedId] = useState<string>(() => {
      return selectedFinishId || (items.length > 0 ? items[0].id : "");
    });

    const activeId = selectedFinishId ?? internalSelectedId;
    const activeFinish = useMemo(() => {
      const found = items.find((f) => f.id === activeId);
      return found || items[0] || null;
    }, [items, activeId]);

    // Handle finish selection
    const handleSelect = useCallback(
      (finish: ProductFinishItem) => {
        if (!selectedFinishId) {
          setInternalSelectedId(finish.id);
        }
        onSelectFinish?.(finish);
      },
      [selectedFinishId, onSelectFinish]
    );

    // Refs for DOM nodes and physics state
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const foilRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    // Cached bounding rect to eliminate layout thrashing during pointer moves
    const rectRef = useRef<DOMRect | null>(null);
    const isHoveringRef = useRef(false);
    const targetPointerRef = useRef({ x: 0.5, y: 0.5 });
    const animFrameRef = useRef<number | null>(null);

    // Physics interpolation state (LERP)
    const currentPhysicsRef = useRef({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      holoX: 50,
      holoY: 50,
      glareX: 50,
      glareY: 50,
      glareAlpha: 0,
    });

    // Holographic foil opacity based on intensity
    const foilOpacity = useMemo(() => {
      switch (intensity) {
        case "subtle":
          return 0.38;
        case "vibrant":
          return 0.85;
        case "medium":
        default:
          return 0.62;
      }
    }, [intensity]);

    // Update cached rect
    const updateRect = useCallback(() => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    }, []);

    // Pointer events with 0ms latency and cached rect
    const handlePointerEnter = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        updateRect();
        isHoveringRef.current = true;
        if (rectRef.current) {
          const px = Math.max(0, Math.min(1, (e.clientX - rectRef.current.left) / rectRef.current.width));
          const py = Math.max(0, Math.min(1, (e.clientY - rectRef.current.top) / rectRef.current.height));
          targetPointerRef.current = { x: px, y: py };
        }
      },
      [updateRect]
    );

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!rectRef.current) {
        if (cardRef.current) {
          rectRef.current = cardRef.current.getBoundingClientRect();
        }
      }
      if (rectRef.current && rectRef.current.width > 0 && rectRef.current.height > 0) {
        const px = Math.max(0, Math.min(1, (e.clientX - rectRef.current.left) / rectRef.current.width));
        const py = Math.max(0, Math.min(1, (e.clientY - rectRef.current.top) / rectRef.current.height));
        targetPointerRef.current = { x: px, y: py };
      }
    }, []);

    const handlePointerLeave = useCallback(() => {
      isHoveringRef.current = false;
      targetPointerRef.current = { x: 0.5, y: 0.5 };
    }, []);

    // Window resize listener
    useEffect(() => {
      const onResize = () => {
        updateRect();
      };
      window.addEventListener("resize", onResize, { passive: true });
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, [updateRect]);

    // Main 60-120 FPS requestAnimationFrame physics loop
    useEffect(() => {
      let isMounted = true;

      const loop = (timestamp: number) => {
        if (!isMounted) return;

        const card = cardRef.current;
        const foil = foilRef.current;
        const glare = glareRef.current;
        const p = currentPhysicsRef.current;

        let targetRotX = 0;
        let targetRotY = 0;
        let targetScale = 1;
        let targetHX = 50;
        let targetHY = 50;
        let targetGX = 50;
        let targetGY = 50;
        let targetGA = 0;

        if (isHoveringRef.current) {
          const px = targetPointerRef.current.x;
          const py = targetPointerRef.current.y;

          // Target angles
          targetRotY = (px - 0.5) * maxTilt;
          targetRotX = -(py - 0.5) * maxTilt;
          targetScale = 1.025;

          // Hologram coords
          targetHX = px * 100;
          targetHY = py * 100;

          // Glare coords
          targetGX = px * 100;
          targetGY = py * 100;
          targetGA = intensity === "subtle" ? 0.35 : intensity === "vibrant" ? 0.75 : 0.55;
        } else if (idleAnimation) {
          // Autonomous subtle sinusoidal micro-tilt (±2.5 deg)
          const time = timestamp * 0.0015;
          targetRotX = Math.sin(time) * 2.5;
          targetRotY = Math.cos(time * 0.8) * 2.5;
          targetScale = 1;

          targetHX = 50 + Math.sin(time * 1.2) * 35;
          targetHY = 50 + Math.cos(time * 0.9) * 35;

          targetGX = 50 + Math.sin(time * 1.2) * 30;
          targetGY = 50 + Math.cos(time * 0.9) * 30;
          targetGA = 0.22;
        } else {
          targetRotX = 0;
          targetRotY = 0;
          targetScale = 1;
          targetHX = 50;
          targetHY = 50;
          targetGX = 50;
          targetGY = 50;
          targetGA = 0;
        }

        // LERP interpolation (0.09 for hover, 0.05 for return/idle)
        const lerpFactor = isHoveringRef.current ? 0.09 : 0.05;
        p.rotateX += (targetRotX - p.rotateX) * lerpFactor;
        p.rotateY += (targetRotY - p.rotateY) * lerpFactor;
        p.scale += (targetScale - p.scale) * lerpFactor;
        p.holoX += (targetHX - p.holoX) * lerpFactor;
        p.holoY += (targetHY - p.holoY) * lerpFactor;
        p.glareX += (targetGX - p.glareX) * lerpFactor;
        p.glareY += (targetGY - p.glareY) * lerpFactor;
        p.glareAlpha += (targetGA - p.glareAlpha) * lerpFactor;

        // Direct DOM update for zero React render overhead
        if (card) {
          card.style.transform = `rotateX(${p.rotateX.toFixed(2)}deg) rotateY(${p.rotateY.toFixed(2)}deg) scale3d(${p.scale.toFixed(3)}, ${p.scale.toFixed(3)}, ${p.scale.toFixed(3)})`;
        }

        if (foil) {
          foil.style.backgroundPosition = `${p.holoX.toFixed(1)}% ${p.holoY.toFixed(1)}%`;
        }

        if (glare && showGlare) {
          glare.style.background = `radial-gradient(circle at ${p.glareX.toFixed(1)}% ${p.glareY.toFixed(1)}%, rgba(255,255,255,${p.glareAlpha.toFixed(2)}) 0%, rgba(255,255,255,${(p.glareAlpha * 0.35).toFixed(2)}) 22%, transparent 60%)`;
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        isMounted = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [maxTilt, idleAnimation, intensity, showGlare]);

    if (!activeFinish) {
      return null;
    }

    const widthStyle = typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth;
    const heightStyle = typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight;
    const primaryFinishColor = activeFinish.holoColors[0] || "#ffffff";
    const finishGradientString = activeFinish.holoColors.join(", ");
    const refCode = (() => {
      const seed = `${activeFinish.id}:${activeFinish.name}:${activeFinish.label ?? ""}`;
      let h = 2166136261;
      for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(16).slice(-4).toUpperCase().padStart(4, "0");
    })();

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: widthStyle || "100%",
          height: heightStyle || "100%",
          ...style,
        }}
        {...props}
      >
        {/* 3D Perspective Viewport */}
        <div
          ref={containerRef}
          className="relative w-full h-full"
          style={{
            height: heightStyle || "100%",
            perspective: `${perspective}px`,
          }}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* Inner 3D Card Layer */}
          <div
            ref={cardRef}
            className={cn(
              "relative w-full h-full rounded-2xl overflow-hidden cursor-pointer",
              showLabels
                ? "border border-border bg-card shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                : "border-0 bg-transparent shadow-none"
            )}
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              touchAction: "pan-y",
            }}
            onClick={() => handleSelect(activeFinish)}
          >
            {/* Ambient tinted radial glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-15 dark:opacity-20"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 0%, transparent 65%)",
              }}
            />

            {/* Subtle card grid texture / hairline accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Specular Glare Layer */}
            {showGlare && (
              <div
                ref={glareRef}
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  mixBlendMode: "overlay",
                  zIndex: 20,
                }}
              />
            )}

            {/* Header Plate (Elevated in 3D) */}
            {showLabels && (
              <div
                className="absolute top-0 inset-x-0 p-5 sm:p-6 flex items-start justify-between pointer-events-none z-10"
                style={{
                  transform: "translateZ(28px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    {activeFinish.label || "FINISH SPEC"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-medium tracking-[0.08em] text-foreground">
                      REF. {refCode}
                    </span>
                  </div>
                </div>

                {activeFinish.price && (
                  <div className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border text-xs font-mono font-semibold">
                    {activeFinish.price}
                  </div>
                )}
              </div>
            )}

            {/* Floating 3D Product & Hologram Container */}
            <div
              className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 pointer-events-none"
              style={{
                transform: `translateZ(${elevateZ}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Product Base Image */}
              <img
                src={activeFinish.image}
                alt={activeFinish.name}
                className="relative max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-500"
                style={{
                  filter:
                    "drop-shadow(0 25px 35px rgba(0,0,0,0.45)) drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                }}
              />

              {/* Holographic Iridescent Foil Layer (Masked strictly to product silhouette) */}
              <div
                ref={foilRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(115deg, ${finishGradientString})`,
                  backgroundSize: "340% 340%",
                  backgroundPosition: "50% 50%",
                  mixBlendMode: "color-dodge",
                  opacity: foilOpacity,
                  WebkitMaskImage: `url("${activeFinish.image}")`,
                  maskImage: `url("${activeFinish.image}")`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  transform: "translateZ(1px)",
                }}
              />
            </div>

            {/* Footer Finish Details (Elevated in 3D) */}
            {showLabels && (
              <div
                className="absolute bottom-0 inset-x-0 p-5 sm:p-6 pointer-events-none z-10"
                style={{
                  transform: "translateZ(32px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
                      {activeFinish.name}
                    </h3>
                    {activeFinish.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-[240px] leading-relaxed">
                        {activeFinish.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border">
                    <span className="text-[10px] font-mono font-medium text-secondary-foreground uppercase">
                      Finish
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Finish Swatch Selector Bar (Outside 3D canvas for crisp clicking) */}
        {showSwatches && items.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border backdrop-blur-md max-w-full">
            {items.map((finish) => {
              const isSelected = finish.id === activeFinish.id;
              const finishColor = finish.holoColors[0] || "#fff";

              return (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => handleSelect(finish)}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
                    isSelected
                      ? "bg-card text-foreground shadow-xs font-semibold border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
                  )}
                >
                  {/* Holographic mini color swatch badge */}
                  <span
                    className={cn(
                      "w-3.5 h-3.5 rounded-full transition-transform duration-200 shrink-0",
                      isSelected ? "scale-110 ring-2 ring-offset-1 ring-ring ring-offset-background" : "group-hover:scale-105"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${finish.holoColors.join(", ")})`,
                      boxShadow: isSelected ? "0 0 6px rgba(255, 255, 255, 0.3)" : "none",
                    }}
                  />
                  <span className="truncate max-w-[120px]">{finish.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

HoloFinishCard.displayName = "HoloFinishCard";

export default HoloFinishCard;
