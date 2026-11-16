"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId, useMemo } from "react";
import { cn } from "../utils/cn";

export interface LiveObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  accentColor?: string;
  autoplayIntro?: boolean;
  width?: number | string;
  height?: number | string;
  alt?: string;
  maxTilt?: number;
  perspective?: number;
  ambientSweep?: boolean;
}

interface Streak {
  id: number;
  angle: number;
  length: number;
  width: number;
  delay: number;
}

export const LiveObject = React.forwardRef<HTMLDivElement, LiveObjectProps>(
  (
    {
      src,
      accentColor = "#fafafa",
      autoplayIntro = true,
      width = 440,
      height = 480,
      alt = "Live Object",
      maxTilt = 30,
      perspective = 1000,
      ambientSweep = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const objectId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const objectWrapperRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const targetTiltRef = useRef({ x: 0, y: 0 });
    const currentTiltRef = useRef({ x: 0, y: 0 });
    const isHoveringRef = useRef(false);
    const animFrameRef = useRef<number | null>(null);

    const [gyroSupported, setGyroSupported] = useState(false);
    const [gyroActive, setGyroActive] = useState(false);
    const calibRef = useRef<{ beta: number; gamma: number } | null>(null);

    const [introActive, setIntroActive] = useState(false);
    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
    const [flashOpacity, setFlashOpacity] = useState(0);
    const [glitchOffset, setGlitchOffset] = useState(0);
    const [scaleBounce, setScaleBounce] = useState(1);
    const [streaks, setStreaks] = useState<Streak[]>([]);

    const { chromaShadow, lightGlow } = useMemo(() => {
      return {
        chromaShadow: "rgba(255, 255, 255, 0.4)",
        lightGlow: accentColor,
      };
    }, [accentColor]);

    useEffect(() => {
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouch) {
          setGyroSupported(true);
        }
      }
    }, []);

    const triggerIgnition = useCallback(() => {
      setIntroActive(true);

      const newStreaks: Streak[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 12 + (Math.random() - 0.5) * 22,
        length: 180 + Math.random() * 140,
        width: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 60,
      }));
      setStreaks(newStreaks);

      const startTime = performance.now();
      const introDuration = 700; 

      const stepIntro = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / introDuration);

        if (progress < 0.1) {
          setFlashOpacity((progress / 0.1) * 0.85);
        } else {
          const decayProgress = (progress - 0.1) / 0.9;
          setFlashOpacity(Math.max(0, 0.85 * Math.pow(1 - decayProgress, 3)));
        }

        if (progress < 0.85) {
          const glitchProgress = progress / 0.85;
          const jitter = (Math.random() - 0.5) * 4;
          setGlitchOffset(Math.max(0, (1 - glitchProgress) * 16 + jitter));
        } else {
          setGlitchOffset(0);
        }

        let s = 1;
        if (progress < 0.4) {
          const p = progress / 0.4;
          s = 0.5 + (1.08 - 0.5) * Math.sin((p * Math.PI) / 2);
        } else if (progress < 0.75) {
          const p = (progress - 0.4) / 0.35;
          s = 1.08 - (1.08 - 0.96) * Math.sin((p * Math.PI) / 2);
        } else {
          const p = (progress - 0.75) / 0.25;
          s = 0.96 + (1.0 - 0.96) * Math.sin((p * Math.PI) / 2);
        }
        setScaleBounce(s);

        if (progress < 1) {
          requestAnimationFrame(stepIntro);
        } else {
          setIntroActive(false);
          setFlashOpacity(0);
          setGlitchOffset(0);
          setScaleBounce(1);
          setStreaks([]);
        }
      };

      requestAnimationFrame(stepIntro);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !autoplayIntro || hasPlayedIntro) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !hasPlayedIntro) {
              setHasPlayedIntro(true);
              triggerIgnition();
              observer.disconnect();
              break;
            }
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, [autoplayIntro, hasPlayedIntro, triggerIgnition]);

    const toggleGyro = useCallback(async () => {
      if (typeof window === "undefined") return;

      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof DeviceOrientationEventAny?.requestPermission === "function") {
        try {
          const perm = await DeviceOrientationEventAny.requestPermission();
          if (perm === "granted") {
            setGyroActive(true);
            calibRef.current = null;
          }
        } catch {
        }
      } else {
        setGyroActive((prev) => !prev);
        calibRef.current = null;
      }
    }, []);

    useEffect(() => {
      if (!gyroActive) return;

      const handleOrientation = (e: DeviceOrientationEvent) => {
        const beta = e.beta ?? 0;
        const gamma = e.gamma ?? 0;

        if (!calibRef.current) {
          calibRef.current = { beta, gamma };
          return;
        }

        const deltaGamma = gamma - calibRef.current.gamma;
        const deltaBeta = beta - calibRef.current.beta;

        const clampedY = Math.max(-maxTilt, Math.min(maxTilt, deltaGamma));
        const clampedX = Math.max(-maxTilt, Math.min(maxTilt, -deltaBeta));

        targetTiltRef.current = { x: clampedX, y: clampedY };
      };

      window.addEventListener("deviceorientation", handleOrientation);
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }, [gyroActive, maxTilt]);

    useEffect(() => {
      let isRunning = true;
      let idleTime = 0;

      const physicsLoop = () => {
        if (!isRunning) return;

        idleTime += 0.016;

        let tx = targetTiltRef.current.x;
        let ty = targetTiltRef.current.y;

        if (!isHoveringRef.current && !gyroActive && !introActive) {
          tx += Math.sin(idleTime * 1.4) * 3;
          ty += Math.cos(idleTime * 1.1) * 3.5;
        }

        const lerpFactor = 0.085;
        currentTiltRef.current.x += (tx - currentTiltRef.current.x) * lerpFactor;
        currentTiltRef.current.y += (ty - currentTiltRef.current.y) * lerpFactor;

        const curX = currentTiltRef.current.x;
        const curY = currentTiltRef.current.y;

        if (objectWrapperRef.current) {
          objectWrapperRef.current.style.transform = `perspective(${perspective}px) rotateX(${curX.toFixed(
            2
          )}deg) rotateY(${curY.toFixed(2)}deg) scale3d(${scaleBounce.toFixed(
            3
          )}, ${scaleBounce.toFixed(3)}, ${scaleBounce.toFixed(3)})`;
        }

        if (glareRef.current) {
          const gx = 50 + (curY / maxTilt) * 45;
          const gy = 50 - (curX / maxTilt) * 45;
          glareRef.current.style.setProperty("--gx", `${gx.toFixed(1)}%`);
          glareRef.current.style.setProperty("--gy", `${gy.toFixed(1)}%`);
        }

        animFrameRef.current = requestAnimationFrame(physicsLoop);
      };

      animFrameRef.current = requestAnimationFrame(physicsLoop);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [maxTilt, perspective, scaleBounce, gyroActive, introActive]);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current || gyroActive) return;
        isHoveringRef.current = true;

        const rect = containerRef.current.getBoundingClientRect();
        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        targetTiltRef.current = {
          x: Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt)),
          y: Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt)),
        };
      },
      [gyroActive, maxTilt]
    );

    const handlePointerLeave = useCallback(() => {
      isHoveringRef.current = false;
      if (!gyroActive) {
        targetTiltRef.current = { x: 0, y: 0 };
      }
    }, [gyroActive]);

    const handleTouchMove = useCallback(
      (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || gyroActive) return;
        isHoveringRef.current = true;
        const touch = e.touches[0];
        if (!touch) return;

        const rect = containerRef.current.getBoundingClientRect();
        const normX = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        targetTiltRef.current = {
          x: Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt)),
          y: Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt)),
        };
      },
      [gyroActive, maxTilt]
    );

    const handleTouchEnd = useCallback(() => {
      isHoveringRef.current = false;
      if (!gyroActive) {
        targetTiltRef.current = { x: 0, y: 0 };
      }
    }, [gyroActive]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center select-none overflow-hidden touch-none",
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* Floor contact shadow - grounds the object physically */}
          <div
            className="absolute left-1/2 bottom-[9%] h-6 w-[58%] -translate-x-1/2 rounded-[50%] pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0.45), rgba(0,0,0,0.18) 55%, transparent)",
            }}
          />

          {/* Ambient Diagonal Light Sweep (Passes behind object every 5-6s) */}
          {ambientSweep && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ opacity: 0.15 }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(115deg, transparent 35%, ${accentColor} 50%, transparent 65%)`,
                  animation: "liveObjectSweep 5.8s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              PHASE 1: IGNITION LIGHT STREAKS (10-14 streaks)
          ═══════════════════════════════════════════════════════════════════ */}
          {introActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
              {streaks.map((s) => (
                <div
                  key={s.id}
                  className="absolute origin-left rounded-full"
                  style={{
                    width: `${s.length}px`,
                    height: `${s.width}px`,
                    background: `linear-gradient(90deg, transparent 0%, ${accentColor} 40%, #ffffff 80%, transparent 100%)`,
                    transform: `rotate(${s.angle}deg)`,
                    animation: `liveStreakShoot 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards ${s.delay}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* White / Accent Screen Flash */}
          <div
            className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-75"
            style={{
              backgroundColor: "#ffffff",
              opacity: flashOpacity,
              mixBlendMode: "screen",
            }}
          />

          {/* ═══════════════════════════════════════════════════════════════════
              PHASE 2: 3D FLOATING OBJECT STAGE
          ═══════════════════════════════════════════════════════════════════ */}
          <div
            ref={objectWrapperRef}
            className="relative w-[78%] h-[78%] flex items-center justify-center will-change-transform"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* The Transparent PNG Object with Alpha RGB Glitch Drop-Shadow */}
            <img
              src={src}
              alt={alt}
              className="relative w-full h-full object-contain pointer-events-none select-none z-10"
              style={{
                filter:
                  glitchOffset > 0.1
                    ? `drop-shadow(${glitchOffset.toFixed(1)}px 0 ${chromaShadow}) drop-shadow(-${glitchOffset.toFixed(
                        1
                      )}px 0 rgba(200,200,200,0.3)) drop-shadow(0 20px 35px rgba(0,0,0,0.6))`
                    : "drop-shadow(0 25px 45px rgba(0,0,0,0.65))",
                transform: "translateZ(30px)",
              }}
            />

            {/* Specular Glare Sheen (Masked strictly to product PNG silhouette) */}
            <div
              ref={glareRef}
              className="absolute inset-0 pointer-events-none select-none z-20"
              style={{
                WebkitMaskImage: `url("${src}")`,
                maskImage: `url("${src}")`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                background:
                  "radial-gradient(ellipse 65% 55% at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.18) 32%, transparent 65%)",
                mixBlendMode: "screen",
                transform: "translateZ(31px)",
                opacity: 0.85,
              }}
            />
          </div>


        </div>

        {/* Global Keyframes for Ambient Sweep & Radial Streak Shoot */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes liveObjectSweep {
              0% { transform: translateX(-140%) rotate(25deg); opacity: 0; }
              15% { opacity: 0.18; }
              35% { transform: translateX(140%) rotate(25deg); opacity: 0; }
              100% { transform: translateX(140%) rotate(25deg); opacity: 0; }
            }
            @keyframes liveStreakShoot {
              0% {
                transform: rotate(var(--angle, 0deg)) scaleX(0.1) translateX(0);
                opacity: 0;
              }
              25% {
                opacity: 1;
              }
              100% {
                transform: rotate(var(--angle, 0deg)) scaleX(1.4) translateX(90px);
                opacity: 0;
              }
            }
          `
        }} />
      </div>
    );
  }
);

LiveObject.displayName = "LiveObject";
