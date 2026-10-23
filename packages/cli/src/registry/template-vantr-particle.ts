export const templateVantrParticle = {
  name: "template-vantr-particle",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-vantr-particle.tsx",
  content: `"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Sun,
  Moon,
  ShoppingBag,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   VANTR — Haute Techwear Atelier Lookbook Template
   High-Fashion Brand Aesthetics (Acronym / Gentle Monster / Veilance)
   Motion-Decay Physics (Zero Black Hole) • Full Studio PRO Customization
   ═══════════════════════════════════════════════════════════════════════════ */

interface Particle {
  ox: number; // Home target X
  oy: number; // Home target Y
  x: number;  // Current X
  y: number;  // Current Y
  vx: number; // Velocity X
  vy: number; // Velocity Y
}

interface ColorBucket {
  color: string;
  particles: Particle[];
}

export interface VantrParticleRevealProps {
  theme?: string;
  brandName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
  showLogo?: boolean;
  customLogoUrl?: string;
  hiddenSections?: Record<string, boolean>;
}

export default function VantrParticleReveal({
  theme = "dark",
  brandName = "VANTR",
  heroTitle = "MONOBLOC SHELL HOOD.",
  heroSubtitle = "Constructed from cold-bonded micro-ripstop with an integrated ergonomic face shroud and polarized amber toric optics. Engineered for atmospheric transition.",
  ctaText = "Acquire Edition",
  deviceMode = "desktop",
  showLogo = true,
  customLogoUrl,
  hiddenSections,
}: VantrParticleRevealProps = {}) {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const config = { theme: currentTheme, brandName, heroTitle, heroSubtitle, ctaText, deviceMode, showLogo, customLogoUrl, hiddenSections };
  const isDark = currentTheme === "dark";

  const primaryColor = isDark ? "#ffffff" : "#000000";

  /* ── Responsive Container Width Tracking ── */
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // Ensure isMobile is true whenever previewer toolbar selects "Mobile" OR container < 768px
  const isMobile = deviceMode === "mobile" || (containerWidth > 0 && containerWidth < 768);

  /* ── Brand State ── */
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [emailRegistered, setEmailRegistered] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");

  /* ── Canvas, Physics & Cached Geometry ── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bucketsRef = useRef<ColorBucket[]>([]);
  const allParticlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Cached canvas bounding rect to eliminate getBoundingClientRect layout reflow on mousemove
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const pointerRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    lastMoved: number;
  }>({
    x: -9999,
    y: -9999,
    active: false,
    lastMoved: 0,
  });

  const updateCachedRect = useCallback(() => {
    if (canvasRef.current) {
      const r = canvasRef.current.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
  }, []);

  useEffect(() => {
    updateCachedRect();
    window.addEventListener("resize", updateCachedRect);
    window.addEventListener("scroll", updateCachedRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateCachedRect);
      window.removeEventListener("scroll", updateCachedRect);
    };
  }, [updateCachedRect]);

  /* ══════════════════════════════════════════════════════════════════════════
     COLOR BUCKETED PIXEL EXTRACTION (GPU-Accelerated 120 FPS Batching)
  ══════════════════════════════════════════════════════════════════════════ */
  const initParticles = useCallback((mobileMode: boolean) => {
    const img = new Image();
    img.src = "/images/templates/vantr-particle.jpg";

    img.onload = () => {
      const targetW = 480;
      const targetH = 720;
      const offscreen = document.createElement("canvas");
      offscreen.width = targetW;
      offscreen.height = targetH;

      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, targetW, targetH);
      const imgData = offCtx.getImageData(0, 0, targetW, targetH).data;

      // Adaptive STEP: 7 on mobile (~4,170 nodes), 6 on desktop (~5,670 nodes)
      const STEP = mobileMode ? 7 : 6;
      const bucketMap = new Map<string, Particle[]>();
      const all: Particle[] = [];

      for (let y = 0; y < targetH; y += STEP) {
        for (let x = 0; x < targetW; x += STEP) {
          const idx = (y * targetW + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];

          // Skip white background and transparent pixels
          if (a < 20 || (r > 240 && g > 240 && b > 240)) {
            continue;
          }

          // Gentle quantization reduces canvas color changes to <90 calls per frame
          const qr = Math.round(r / 10) * 10;
          const qg = Math.round(g / 10) * 10;
          const qb = Math.round(b / 10) * 10;
          const colorKey = \`rgb(\${qr},\${qg},\${qb})\`;

          const p: Particle = {
            ox: x,
            oy: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
          };

          all.push(p);

          let bucket = bucketMap.get(colorKey);
          if (!bucket) {
            bucket = [];
            bucketMap.set(colorKey, bucket);
          }
          bucket.push(p);
        }
      }

      const buckets: ColorBucket[] = [];
      bucketMap.forEach((particles, color) => {
        buckets.push({ color, particles });
      });

      bucketsRef.current = buckets;
      allParticlesRef.current = all;
      setIsLoaded(true);
      updateCachedRect();
    };
  }, [updateCachedRect]);

  useEffect(() => {
    initParticles(isMobile);
  }, [isMobile, initParticles]);

  /* ══════════════════════════════════════════════════════════════════════════
     HIGH-SPEED PHYSICS & ZERO-HOLE MOTION DECAY ENGINE
  ══════════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;
    const targetW = 480;
    const targetH = 720;

    // Physical constants tuned for organic responsiveness
    const radius = 58;        // Natural interaction radius
    const force = 5.2;         // Active impulse strength
    const springK = 0.07;      // Hooke's spring to home target
    const friction = 0.86;     // Damping coefficient
    const maxSpeed = 16;       // Terminal velocity clamp to avoid oscillation

    const pSize = isMobile ? 3.6 : 3.4;
    const halfSize = pSize / 2;

    const renderLoop = () => {
      if (!isRunning) return;

      // Hardware accelerated GPU clear
      ctx.clearRect(0, 0, targetW, targetH);

      const pointer = pointerRef.current;
      const buckets = bucketsRef.current;
      const bLen = buckets.length;

      // Motion decay calculation:
      // When user moves mouse/finger, activity is 1.0 (energetic dispersion).
      // When mouse pauses, activity decays to 0 in 140ms.
      // This completely prevents static craters or persistent black holes!
      const now = performance.now();
      const timeSinceMove = now - pointer.lastMoved;
      const activity = pointer.active ? Math.max(0, 1 - timeSinceMove / 140) : 0;

      // Single pass: update physics & draw by color bucket (GPU batched)
      for (let b = 0; b < bLen; b++) {
        const bucket = buckets[b];
        ctx.fillStyle = bucket.color;
        const list = bucket.particles;
        const pLen = list.length;

        for (let i = 0; i < pLen; i++) {
          const p = list[i];

          /* ── Pointer Repulsion with Motion-Decay (Zero Black Hole) ── */
          if (activity > 0) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.hypot(dx, dy);

            if (dist < radius && dist > 0.001) {
              const factor = ((radius - dist) / radius) * force * activity;
              p.vx += (dx / dist) * factor;
              p.vy += (dy / dist) * factor;
            }
          }

          /* ── Spring Restitution & Friction ── */
          p.vx += (p.ox - p.x) * springK;
          p.vy += (p.oy - p.y) * springK;
          p.vx *= friction;
          p.vy *= friction;

          // Clamp terminal speed for zero-jitter convergence
          const speed = Math.hypot(p.vx, p.vy);
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }

          p.x += p.vx;
          p.y += p.vy;

          // GPU batch fill
          ctx.fillRect(p.x - halfSize, p.y - halfSize, pSize, pSize);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isMobile]);

  /* ══════════════════════════════════════════════════════════════════════════
     0MS ZERO-LATENCY POINTER TRACKING
  ══════════════════════════════════════════════════════════════════════════ */
  const handlePointerEnter = useCallback(() => {
    updateCachedRect();
  }, [updateCachedRect]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    let rect = rectRef.current;
    if (!rect) {
      if (!canvasRef.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      rectRef.current = rect;
    }

    if (rect.width === 0 || rect.height === 0) return;

    pointerRef.current = {
      x: (e.clientX - rect.left) * (480 / rect.width),
      y: (e.clientY - rect.top) * (720 / rect.height),
      active: true,
      lastMoved: performance.now(),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    updateCachedRect();
    handlePointerMove(e);
  }, [updateCachedRect, handlePointerMove]);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false;
  }, []);

  /* Scatter replay: Disperse particles radially into the void to watch reassembly */
  const handleReplay = useCallback(() => {
    const list = allParticlesRef.current;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      p.x = Math.random() * 480;
      p.y = Math.random() * 720;
      p.vx = (Math.random() - 0.5) * 16;
      p.vy = (Math.random() - 0.5) * 16;
    }
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailRegistered(true);
    }
  };

  return (
    <div
      ref={rootRef}
      className={\`min-h-screen w-full font-sans antialiased transition-colors duration-300 overflow-x-hidden \${
        isDark ? "bg-[#09090b] text-[#f4f4f5]" : "bg-[#fafafa] text-[#18181b]"
      }\`}
    >
      {/* ── Haute Fashion Editorial Navigation ── */}
      <nav
        className={\`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 \${
          isDark
            ? "bg-[#09090b]/85 border-white/10 text-white"
            : "bg-white/85 border-black/10 text-black"
        }\`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {config.showLogo !== false && (
              config.customLogoUrl ? (
                <img
                  src={config.customLogoUrl}
                  alt={brandName}
                  className="h-6 w-auto max-w-[120px] object-contain rounded select-none"
                />
              ) : (
                <span className="text-base sm:text-lg font-bold tracking-[0.25em] uppercase select-none">
                  {brandName}
                </span>
              )
            )}
            <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest opacity-60">
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Capsule 01</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Lookbook</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Archive</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Atelier</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={\`p-1.5 sm:p-2 rounded-full border transition-all \${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-amber-400"
                  : "bg-black/5 border-black/10 hover:bg-black/10 text-zinc-800"
              }\`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setCartCount((c) => c + 1)}
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>({cartCount})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Section: Hero Stage (Configurable via Customizer Studio) ── */}
      {!config.hiddenSections?.hero && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Mobile-Friendly Title / Desktop Left Column */}
            <div className="w-full lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left order-1">
              <div className="space-y-1.5 sm:space-y-2">
                <p
                  className={\`text-[11px] sm:text-xs uppercase tracking-[0.25em] font-mono \${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }\`}
                >
                  Autumn / Winter 2026 • Capsule 01
                </p>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extralight tracking-tight leading-[1.08]">
                  {heroTitle}
                </h1>
              </div>

              <p
                className={\`text-xs sm:text-sm lg:text-base leading-relaxed font-light max-w-md mx-auto lg:mx-0 \${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }\`}
              >
                {heroSubtitle}
              </p>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex items-center gap-4 pt-2">
                <button
                  onClick={() => setCartCount((c) => c + 1)}
                  className={\`px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 active:scale-95 flex items-center gap-2 \${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-black text-white hover:bg-zinc-800"
                  }\`}
                >
                  <span>{ctaText}</span>
                  <span className="opacity-40">•</span>
                  <span>$1,280</span>
                </button>

                <button
                  onClick={handleReplay}
                  className={\`px-6 py-3.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all duration-200 active:scale-95 flex items-center gap-2 \${
                    isDark
                      ? "border-white/15 hover:border-white/30 text-zinc-300 hover:bg-white/5"
                      : "border-black/15 hover:border-black/30 text-zinc-700 hover:bg-black/5"
                  }\`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Reveal</span>
                </button>
              </div>

              <div
                className={\`hidden lg:flex pt-3 border-t items-center gap-6 text-xs font-mono \${
                  isDark ? "border-white/10 text-zinc-500" : "border-black/10 text-zinc-400"
                }\`}
              >
                <span>EDITION OF 50</span>
                <span>•</span>
                <span>MADE IN TOKYO</span>
                <span>•</span>
                <span>WORLDWIDE SHIPPING</span>
              </div>
            </div>

            {/* Canvas Column (Always Visually Prominent & Correctly Sized) */}
            <div className="w-full lg:col-span-6 flex flex-col items-center order-2">
              <div className="relative w-full max-w-[310px] sm:max-w-[360px] lg:max-w-[420px]">
                <div
                  className={\`relative aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 \${
                    isDark
                      ? "bg-[#060709] border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
                      : "bg-white border-black/8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)]"
                  }\`}
                >
                  {/* 480x720 Canvas with 0ms pointer tracking & motion decay */}
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={720}
                    onPointerEnter={handlePointerEnter}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    className="w-full h-full block object-contain select-none touch-none cursor-crosshair"
                  />

                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-inherit">
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Floating Replay Pill Button */}
                  <div className="absolute bottom-5 inset-x-0 flex justify-center items-center pointer-events-none z-20">
                    <button
                      onClick={handleReplay}
                      className={\`pointer-events-auto px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase flex items-center gap-2 shadow-xl backdrop-blur-md border transition-all duration-200 active:scale-95 \${
                        isDark
                          ? "bg-zinc-950/80 hover:bg-zinc-900 text-zinc-200 border-white/15 shadow-black/80"
                          : "bg-white/85 hover:bg-white text-zinc-900 border-black/10 shadow-zinc-400/30"
                      }\`}
                    >
                      <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
                      <span>Replay</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile-Only Action Buttons (Positioned directly below canvas on mobile) */}
              <div className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[310px] sm:max-w-[360px] pt-4">
                <button
                  onClick={() => setCartCount((c) => c + 1)}
                  className={\`w-full py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 \${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-black text-white hover:bg-zinc-800"
                  }\`}
                >
                  <span>{ctaText}</span>
                  <span className="opacity-40">•</span>
                  <span>$1,280</span>
                </button>

                <button
                  onClick={handleReplay}
                  className={\`w-full py-2.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 \${
                    isDark
                      ? "border-white/15 text-zinc-300 hover:bg-white/5"
                      : "border-black/15 text-zinc-700 hover:bg-black/5"
                  }\`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Reveal</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section: Capsule 01 Lookbook Archive (Togglable via Studio) ── */}
      {!config.hiddenSections?.archive && (
        <section
          className={\`border-t py-14 sm:py-20 transition-colors duration-300 \${
            isDark ? "border-white/10 bg-[#07080a]" : "border-black/10 bg-white"
          }\`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-2">
              <div>
                <p
                  className={\`text-[11px] sm:text-xs uppercase font-mono tracking-[0.25em] \${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }\`}
                >
                  Lookbook Archive
                </p>
                <h2 className="text-2xl sm:text-4xl font-light tracking-tight mt-1">
                  Capsule 01 Objects
                </h2>
              </div>
              <span
                className={\`text-xs font-mono \${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }\`}
              >
                [ 03 PIECES ALLOCATED ]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Look 01 */}
              <div className="group cursor-pointer">
                <div
                  className={\`aspect-[3/4] rounded-2xl overflow-hidden mb-3 sm:mb-4 border relative transition-all duration-300 \${
                    isDark
                      ? "bg-[#0d0e12] border-white/8 group-hover:border-white/20"
                      : "bg-zinc-100 border-black/8 group-hover:border-black/20"
                  }\`}
                >
                  <img
                    src="/images/templates/vantr-particle.jpg"
                    alt="Monobloc All-Weather Shell"
                    className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                    Look 01
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      All-Weather Monobloc Parka
                    </h3>
                    <p
                      className={\`text-[11px] sm:text-xs mt-0.5 \${
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      }\`}
                    >
                      3-Layer Waterproof Composite • Welded Seams
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-medium">$1,280</span>
                </div>
              </div>

              {/* Look 02 */}
              <div className="group cursor-pointer">
                <div
                  className={\`aspect-[3/4] rounded-2xl overflow-hidden mb-3 sm:mb-4 border relative transition-all duration-300 \${
                    isDark
                      ? "bg-[#0d0e12] border-white/8 group-hover:border-white/20"
                      : "bg-zinc-100 border-black/8 group-hover:border-black/20"
                  }\`}
                >
                  <img
                    src="/images/templates/vantr-particle-thumb.jpg"
                    alt="Toric Amber Ballistic Shield"
                    className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                    Look 02
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Toric Amber Ballistic Shield
                    </h3>
                    <p
                      className={\`text-[11px] sm:text-xs mt-0.5 \${
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      }\`}
                    >
                      High-Contrast Cylindrical Curve • Dual Fog Vents
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-medium">$460</span>
                </div>
              </div>

              {/* Look 03 */}
              <div className="group cursor-pointer">
                <div
                  className={\`aspect-[3/4] rounded-2xl overflow-hidden mb-3 sm:mb-4 border relative transition-all duration-300 flex items-center justify-center \${
                    isDark
                      ? "bg-[#0d0e12] border-white/8 group-hover:border-white/20"
                      : "bg-zinc-100 border-black/8 group-hover:border-black/20"
                  }\`}
                >
                  <img
                    src="/images/templates/vantr-particle.jpg"
                    alt="Articulated Balaclava Collar"
                    className="w-full h-full object-cover object-[center_20%] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                    Look 03
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Articulated Balaclava Collar
                    </h3>
                    <p
                      className={\`text-[11px] sm:text-xs mt-0.5 \${
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      }\`}
                    >
                      Seamless Merino Compression • Laser Perforated
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-medium">$220</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section: Atelier Manifesto (Togglable via Studio) ── */}
      {!config.hiddenSections?.manifesto && (
        <section
          className={\`border-t py-16 sm:py-24 transition-colors duration-300 \${
            isDark ? "border-white/10 bg-[#09090b]" : "border-black/10 bg-[#fafafa]"
          }\`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
            <p
              className={\`text-xs uppercase font-mono tracking-[0.3em] \${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }\`}
            >
              Atelier Manifesto
            </p>
            <blockquote className="text-xl sm:text-3xl lg:text-5xl font-extralight tracking-tight leading-snug">
              &ldquo;We engineer silhouettes at the threshold of physical protection and quiet
              reduction. Free from decorative noise.&rdquo;
            </blockquote>
            <p
              className={\`text-[11px] sm:text-xs font-mono uppercase tracking-widest pt-2 sm:pt-4 \${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }\`}
            >
              TOKYO • NEUCHÂTEL • MILANO
            </p>
          </div>
        </section>
      )}

      {/* ── Section: Private Allocation Register (Togglable via Studio) ── */}
      {!config.hiddenSections?.register && (
        <section
          className={\`border-t py-14 sm:py-20 transition-colors duration-300 \${
            isDark ? "border-white/10 bg-[#07080a]" : "border-black/10 bg-white"
          }\`}
        >
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
            <p
              className={\`text-[11px] sm:text-xs uppercase font-mono tracking-widest \${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }\`}
            >
              Private Register
            </p>
            <h3 className="text-xl sm:text-2xl font-light tracking-tight">
              Reserve Priority Allocation
            </h3>
            <p
              className={\`text-xs font-light leading-relaxed \${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }\`}
            >
              Enter your email to receive direct invitations to future archival drops.
            </p>

            <form onSubmit={handleEmailSubmit} className="pt-2 flex items-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="atelier@domain.com"
                required
                className={\`flex-1 px-4 py-2.5 sm:py-3 rounded-full text-xs font-mono outline-none border transition-colors \${
                  isDark
                    ? "bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-zinc-600"
                    : "bg-black/5 border-black/10 focus:border-black/30 text-black placeholder:text-zinc-400"
                }\`}
              />
              <button
                type="submit"
                className={\`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 \${
                  isDark
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-black text-white hover:bg-zinc-800"
                }\`}
              >
                {emailRegistered ? "Registered" : "Join"}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ── Haute Fashion Brand Footer ── */}
      <footer
        className={\`border-t py-10 transition-colors \${
          isDark ? "border-white/10 bg-[#050608] text-zinc-500" : "border-black/10 bg-zinc-50 text-zinc-400"
        }\`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest text-foreground">{brandName}</span>
            <span>•</span>
            <span>© 2026 ARCHIVAL ATELIER</span>
          </div>

          <div className="flex items-center gap-6 uppercase tracking-wider text-[11px]">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Inquiries</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};
