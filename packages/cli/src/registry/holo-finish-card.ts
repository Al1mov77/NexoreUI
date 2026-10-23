export const holoFinishCard = {
  name: "holo-finish-card",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "holo-finish-card.tsx",
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "../utils/cn";

export interface ProductFinishItem {
  id: string;
  name: string;
  label?: string;
  image: string;
  holoColors: string[];
  price?: string;
  description?: string;
}

export type HoloFinishIntensity = "subtle" | "medium" | "vibrant";

export interface HoloFinishCardProps extends React.HTMLAttributes<HTMLDivElement> {
  finishes: ProductFinishItem[];
  selectedFinishId?: string;
  onSelectFinish?: (finish: ProductFinishItem) => void;
  cardWidth?: number | string;
  cardHeight?: number | string;
  intensity?: HoloFinishIntensity;
  showLabels?: boolean;
  maxTilt?: number;
  perspective?: number;
  elevateZ?: number;
  idleAnimation?: boolean;
  showGlare?: boolean;
  showSwatches?: boolean;
}

export const HoloFinishCard = React.forwardRef<HTMLDivElement, HoloFinishCardProps>(
  (
    {
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
    const [internalSelectedId, setInternalSelectedId] = useState<string>(() => {
      return selectedFinishId || (finishes.length > 0 ? finishes[0].id : "");
    });

    const activeId = selectedFinishId ?? internalSelectedId;
    const activeFinish = useMemo(() => {
      const found = finishes.find((f) => f.id === activeId);
      return found || finishes[0] || null;
    }, [finishes, activeId]);

    const handleSelect = useCallback(
      (finish: ProductFinishItem) => {
        if (!selectedFinishId) {
          setInternalSelectedId(finish.id);
        }
        onSelectFinish?.(finish);
      },
      [selectedFinishId, onSelectFinish]
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const foilRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const rectRef = useRef<DOMRect | null>(null);
    const isHoveringRef = useRef(false);
    const targetPointerRef = useRef({ x: 0.5, y: 0.5 });
    const animFrameRef = useRef<number | null>(null);

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

    const updateRect = useCallback(() => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    }, []);

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
      if (!rectRef.current && cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
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

    useEffect(() => {
      const onResize = () => {
        updateRect();
      };
      window.addEventListener("resize", onResize, { passive: true });
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, [updateRect]);

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

          targetRotY = (px - 0.5) * maxTilt;
          targetRotX = -(py - 0.5) * maxTilt;
          targetScale = 1.025;

          targetHX = px * 100;
          targetHY = py * 100;

          targetGX = px * 100;
          targetGY = py * 100;
          targetGA = intensity === "subtle" ? 0.35 : intensity === "vibrant" ? 0.75 : 0.55;
        } else if (idleAnimation) {
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

        const lerpFactor = isHoveringRef.current ? 0.09 : 0.05;
        p.rotateX += (targetRotX - p.rotateX) * lerpFactor;
        p.rotateY += (targetRotY - p.rotateY) * lerpFactor;
        p.scale += (targetScale - p.scale) * lerpFactor;
        p.holoX += (targetHX - p.holoX) * lerpFactor;
        p.holoY += (targetHY - p.holoY) * lerpFactor;
        p.glareX += (targetGX - p.glareX) * lerpFactor;
        p.glareY += (targetGY - p.glareY) * lerpFactor;
        p.glareAlpha += (targetGA - p.glareAlpha) * lerpFactor;

        if (card) {
          card.style.transform = \`rotateX(\${p.rotateX.toFixed(2)}deg) rotateY(\${p.rotateY.toFixed(2)}deg) scale3d(\${p.scale.toFixed(3)}, \${p.scale.toFixed(3)}, \${p.scale.toFixed(3)})\`;
        }

        if (foil) {
          foil.style.backgroundPosition = \`\${p.holoX.toFixed(1)}% \${p.holoY.toFixed(1)}%\`;
        }

        if (glare && showGlare) {
          glare.style.background = \`radial-gradient(circle at \${p.glareX.toFixed(1)}% \${p.glareY.toFixed(1)}%, rgba(255,255,255,\${p.glareAlpha.toFixed(2)}) 0%, rgba(255,255,255,\${(p.glareAlpha * 0.35).toFixed(2)}) 22%, transparent 60%)\`;
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

    const widthStyle = typeof cardWidth === "number" ? \`\${cardWidth}px\` : cardWidth;
    const heightStyle = typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight;
    const primaryFinishColor = activeFinish.holoColors[0] || "#ffffff";
    const finishGradientString = activeFinish.holoColors.join(", ");

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center select-none", className)}
        style={{
          width: widthStyle,
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className="relative w-full"
          style={{
            height: heightStyle,
            perspective: \`\${perspective}px\`,
          }}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div
            ref={cardRef}
            className={cn(
              "relative w-full h-full rounded-3xl overflow-hidden cursor-pointer",
              "border border-black/[0.08] dark:border-white/[0.12]",
              "bg-gradient-to-b from-white via-slate-50 to-slate-100",
              "dark:from-[#151821] dark:via-[#0e1017] dark:to-[#090b10]",
              "shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]",
              "dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.12)]",
              "transition-shadow duration-300"
            )}
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              touchAction: "pan-y",
            }}
            onClick={() => handleSelect(activeFinish)}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-20 dark:opacity-25"
              style={{
                background: \`radial-gradient(circle at 50% 50%, \${primaryFinishColor} 0%, transparent 65%)\`,
              }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

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

            {showLabels && (
              <div
                className="absolute top-0 inset-x-0 p-5 sm:p-6 flex items-start justify-between pointer-events-none z-10"
                style={{
                  transform: "translateZ(28px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                    {activeFinish.label || "FINISH SPEC"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shadow-xs"
                      style={{
                        backgroundColor: primaryFinishColor,
                        boxShadow: \`0 0 8px \${primaryFinishColor}\`,
                      }}
                    />
                    <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                      REF. {activeFinish.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {activeFinish.price && (
                  <div className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-xs font-mono font-semibold text-slate-800 dark:text-white">
                    {activeFinish.price}
                  </div>
                )}
              </div>
            )}

            <div
              className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 pointer-events-none"
              style={{
                transform: \`translateZ(\${elevateZ}px)\`,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={activeFinish.image}
                alt={activeFinish.name}
                className="relative max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-500"
                style={{
                  filter:
                    "drop-shadow(0 25px 35px rgba(0,0,0,0.45)) drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                }}
              />

              <div
                ref={foilRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: \`linear-gradient(115deg, \${finishGradientString})\`,
                  backgroundSize: "340% 340%",
                  backgroundPosition: "50% 50%",
                  mixBlendMode: "color-dodge",
                  opacity: foilOpacity,
                  WebkitMaskImage: \`url("\${activeFinish.image}")\`,
                  maskImage: \`url("\${activeFinish.image}")\`,
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
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                      {activeFinish.name}
                    </h3>
                    {activeFinish.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-[240px] leading-relaxed">
                        {activeFinish.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: primaryFinishColor }}
                    />
                    <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 uppercase">
                      Finish
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showSwatches && finishes.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md max-w-full">
            {finishes.map((finish) => {
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
                      ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs font-semibold border border-black/10 dark:border-white/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 border border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "w-3.5 h-3.5 rounded-full transition-transform duration-200 shrink-0",
                      isSelected ? "scale-110 ring-2 ring-offset-1 ring-slate-400 dark:ring-white/40 ring-offset-white dark:ring-offset-black" : "group-hover:scale-105"
                    )}
                    style={{
                      background: \`linear-gradient(135deg, \${finish.holoColors.join(", ")})\`,
                      boxShadow: isSelected ? \`0 0 8px \${finishColor}66\` : "none",
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
`
};
