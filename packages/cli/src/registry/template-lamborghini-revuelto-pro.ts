export const templateLamborghiniRevueltoPro = {
  name: "template-lamborghini-revuelto",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-lamborghini-revuelto.tsx",
  content: `"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Shield,
  Zap,
  Flame,
  Wind,
  Terminal,
  Check,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ArrowRight,
  Cpu,
  Layers,
  ChevronRight,
  RotateCw,
} from "lucide-react";

const FONT_SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO = "'Geist Mono', monospace";

const TOTAL_FRAMES = 240;

const FINISHES = [
  { id: "rosso", name: "Rosso Mars", hex: "#dc2626", category: "Metallic" },
  { id: "nero", name: "Nero Nemesis", hex: "#18181b", category: "Matte Satin" },
  { id: "giallo", name: "Giallo Clarus", hex: "#eab308", category: "Pearl" },
  { id: "verde", name: "Verde Scandal", hex: "#16a34a", category: "Solid" },
] as const;

const WHEELS = [
  { id: "altanero", name: 'Altanero Forged 20" / 21"', desc: "Bronze matte with carbon fiber center cap", delta: "-8.4 kg" },
  { id: "venancio", name: 'Venancio Diamond 21" / 22"', desc: "Machined silver face with gloss black inner barrel", delta: "-4.2 kg" },
] as const;

const AERO_CONFIGS = [
  {
    id: "ld",
    name: "Low Drag",
    load: "320 kg at 250 km/h",
    balance: "Front 40% / Rear 60%",
    summary: "Wing flush with the rear bodywork to minimize drag resistance and enable maximum straight-line velocity beyond 350 km/h.",
  },
  {
    id: "hd",
    name: "High Downforce",
    load: "580 kg at 250 km/h",
    balance: "Front 42% / Rear 58%",
    summary: "Active wing raised to maximum attack angle, increasing vertical rear aerodynamic load by 61% for optimal high-speed cornering stability.",
  },
  {
    id: "ab",
    name: "Aero Brake",
    load: "690 kg at 250 km/h",
    balance: "Front 38% / Rear 62%",
    summary: "Maximum wing deployment under emergency deceleration, shifting aerodynamic center rearward to counteract forward pitch.",
  },
] as const;

const CHAPTERS = [
  {
    id: "01",
    range: [0, 60],
    title: "Aero Stance",
    subtitle: "Front aerodynamic channels and Y-signature lighting",
    desc: "Active front splitters and brake ducts optimize thermal air management while generating high front axle downforce.",
    metrics: [
      { label: "Front Downforce", value: "+73%" },
      { label: "Brake Cooling", value: "Dedicated Ducts" },
      { label: "Front Chassis", value: "Forged Carbon" },
    ],
  },
  {
    id: "02",
    range: [61, 120],
    title: "Carbon Monocoque",
    subtitle: "Aviation-grade monofuselage structural tub",
    desc: "Full carbon fiber monocoque architecture paired with a forged composite front structure, delivering superior torsional rigidity.",
    metrics: [
      { label: "Torsional Stiffness", value: "61,000 Nm/deg" },
      { label: "Chassis Weight", value: "-10% vs Aventador" },
      { label: "Front Absorption", value: "Double Energy Capacity" },
    ],
  },
  {
    id: "03",
    range: [121, 180],
    title: "Atmospheric V12",
    subtitle: "Naturally aspirated 6.5-liter L545 combustion core",
    desc: "Mid-mounted naturally aspirated V12 rotated 180 degrees, revving to 9,500 RPM with 128 CV per liter specific output.",
    metrics: [
      { label: "Displacement", value: "6,498 cc" },
      { label: "Combustion Power", value: "825 CV" },
      { label: "Engine Redline", value: "9,500 RPM" },
    ],
  },
  {
    id: "04",
    range: [181, 240],
    title: "Electric All-Wheel Drive",
    subtitle: "Tri-motor powertrain with torque vectoring",
    desc: "Two axial-flux electric motors power the front axle while a third motor is integrated into the 8-speed transverse gearbox.",
    metrics: [
      { label: "Combined Output", value: "1015 CV" },
      { label: "Acceleration", value: "0 to 100 in 2.5s" },
      { label: "Top Speed", value: "Over 350 km/h" },
    ],
  },
] as const;

export default function LamborghiniRevueltoTemplate({
  theme = "dark",
  brandName = "LAMBORGHINI REVUELTO",
  deviceMode = "desktop",
}: {
  theme?: string;
  brandName?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { theme, brandName };
  const prefersReducedMotion = useReducedMotion();

  const [localTheme, setLocalTheme] = useState<"light" | "dark" | null>(null);
  const activeTheme = localTheme ?? (config.theme === "light" ? "light" : "dark");
  const isDark = activeTheme === "dark";
  const brand = config.brandName || "LAMBORGHINI REVUELTO";

  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);

  const colors = useMemo(() => {
    if (isDark) {
      return {
        bg: "#09090b",
        surface: "#121215",
        surfaceRaised: "#18181b",
        line: "#27272a",
        text: "#f4f4f5",
        muted: "#a1a1aa",
        accent: "#dc2626",
        accentInk: "#ffffff",
      };
    }
    return {
      bg: "#ffffff",
      surface: "#f8f9fa",
      surfaceRaised: "#f1f3f5",
      line: "#e4e4e7",
      text: "#09090b",
      muted: "#71717a",
      accent: "#dc2626",
      accentInk: "#ffffff",
    };
  }, [isDark]);

  const [scrubProgress, setScrubProgress] = useState(0);
  const [activeFinish, setActiveFinish] = useState<string>("rosso");
  const [activeWheel, setActiveWheel] = useState<string>("altanero");
  const [activeAero, setActiveAero] = useState<string>("hd");
  const [copiedCli, setCopiedCli] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showcaseRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedFramesCount, setLoadedFramesCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let count = 0;

    const priority = [0, 30, 60, 90, 120, 150, 180, 210, 239];
    const rest: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!priority.includes(i)) rest.push(i);
    }
    const sequence = [...priority, ...rest];

    sequence.forEach((idx) => {
      const pad = String(idx + 1).padStart(3, "0");
      const img = new Image();
      img.decoding = "async";
      img.src = \`/videos/lamborghini_frames/frame_\${pad}.jpg\`;
      img.onload = () => {
        if (cancelled) return;
        framesRef.current[idx] = img;
        count++;
        setLoadedFramesCount(count);
      };
      img.onerror = () => {
        if (cancelled) return;
        count++;
        setLoadedFramesCount(count);
      };
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const findNearestScroller = useCallback((el: HTMLElement | null): HTMLElement | Window => {
    let curr = el?.parentElement;
    while (curr) {
      const style = window.getComputedStyle(curr);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return curr;
      }
      curr = curr.parentElement;
    }
    return window;
  }, []);

  useEffect(() => {
    const el = showcaseRef.current;
    if (!el) return;
    const scroller = findNearestScroller(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const isWin = scroller === window;
      const topOffset = isWin ? rect.top : rect.top - (scroller as HTMLElement).getBoundingClientRect().top;
      const viewH = isWin ? window.innerHeight : (scroller as HTMLElement).clientHeight;
      const totalTravel = rect.height - viewH;
      if (totalTravel <= 0) return;
      const ratio = Math.max(0, Math.min(1, -topOffset / totalTravel));
      targetProgressRef.current = ratio;
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    if (scroller !== window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    onScroll();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (scroller !== window) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [findNearestScroller]);

  const lastRenderedIndexRef = useRef(-1);
  const lastReportedProgressRef = useRef(-1);

  useEffect(() => {
    let animId: number;
    let active = true;

    const loop = () => {
      if (!active) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) < 0.0001) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        currentProgressRef.current += diff * 0.12;
      }

      const p = Math.max(0, Math.min(1, currentProgressRef.current));

      if (Math.abs(p - lastReportedProgressRef.current) > 0.008 || p === 0 || p === 1) {
        lastReportedProgressRef.current = p;
        setScrubProgress(p);
      }

      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(p * (TOTAL_FRAMES - 1)));
      const canvas = canvasRef.current;

      const redrawNeeded =
        frameIndex !== lastRenderedIndexRef.current ||
        (framesRef.current[frameIndex] && lastRenderedIndexRef.current === -1);

      if (canvas && redrawNeeded) {
        const ctx = canvas.getContext("2d");
        const img = framesRef.current[frameIndex] || framesRef.current[0];

        if (ctx && img && img.complete && img.naturalWidth > 0) {
          // canvas-ok: real-time 360-degree frame sequence scrub of Revuelto with hardware canvas blit
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          lastRenderedIndexRef.current = frameIndex;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement && !isFullscreen) {
      setIsFullscreen(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  const copyCli = () => {
    navigator.clipboard.writeText("npx nexoreui add template-lamborghini-revuelto");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const activeChapterIndex = useMemo(() => {
    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(scrubProgress * (TOTAL_FRAMES - 1)));
    const found = CHAPTERS.findIndex((c) => frameIndex >= c.range[0] && frameIndex <= c.range[1]);
    return found !== -1 ? found : 0;
  }, [scrubProgress]);

  const activeChapter = CHAPTERS[activeChapterIndex];

  const jumpToChapter = (idx: number) => {
    const target = (idx * 60) / TOTAL_FRAMES;
    targetProgressRef.current = target;
  };

  return (
    <div
      ref={rootRef}
      className={\`@container w-full min-h-screen overflow-x-clip transition-colors duration-200 \${
        isFullscreen ? "fixed inset-0 z-[99999] w-screen h-screen overflow-y-auto" : ""
      }\`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: FONT_SANS,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
      />

      {/* NAVIGATION */}
      <header
        className="sticky top-0 z-40 border-b px-4 @md:px-8 py-3.5 transition-colors duration-200 backdrop-blur-md"
        style={{
          backgroundColor: isDark ? "rgba(9, 9, 11, 0.85)" : "rgba(255, 255, 255, 0.85)",
          borderColor: colors.line,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <span
              className="text-base @md:text-lg font-semibold tracking-tight uppercase"
              style={{ color: colors.text }}
            >
              Revuelto
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-md font-mono"
              style={{ backgroundColor: colors.surfaceRaised, color: colors.muted }}
            >
              1015 CV
            </span>
          </div>

          {!isMobile && !isTablet && (
            <nav className="flex items-center gap-6 text-sm font-medium" style={{ color: colors.muted }}>
              <a href="#showcase" className="hover:text-foreground transition-colors" style={{ color: colors.muted }}>
                Architecture
              </a>
              <a href="#manifesto" className="hover:text-foreground transition-colors" style={{ color: colors.muted }}>
                Engineering
              </a>
              <a href="#powertrain" className="hover:text-foreground transition-colors" style={{ color: colors.muted }}>
                Powertrain
              </a>
              <a href="#aerodynamics" className="hover:text-foreground transition-colors" style={{ color: colors.muted }}>
                Aerodynamics
              </a>
              <a href="#allocation" className="hover:text-foreground transition-colors" style={{ color: colors.muted }}>
                Allocation
              </a>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocalTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-lg border transition-colors hover:opacity-80"
              style={{
                borderColor: colors.line,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="hidden @sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:opacity-80"
              style={{
                borderColor: colors.line,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden @md:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
            </button>

            <button
              onClick={copyCli}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: colors.accent,
              }}
            >
              {copiedCli ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
              <span>{copiedCli ? "Copied" : "CLI"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="px-4 @md:px-8 pt-12 @md:pt-20 pb-16 border-b" style={{ borderColor: colors.line }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 items-center">
            <div className="@lg:col-span-7 space-y-6">
              <span
                className="text-xs font-mono uppercase tracking-wider block"
                style={{ color: colors.accent }}
              >
                V12 High Performance Electrified Vehicle
              </span>

              <h1
                className="text-4xl @sm:text-5xl @md:text-6xl font-semibold tracking-tight leading-[1.04]"
                style={{ color: colors.text }}
              >
                The first hybrid V12 super sports car.
              </h1>

              <p className="text-base @md:text-lg leading-relaxed max-w-xl" style={{ color: colors.muted }}>
                Sant'Agata Bolognese introduces the Revuelto: an atmospheric 6.5-liter V12 revving to 9,500 RPM, paired with three high-density electric motors and an 8-speed transverse dual-clutch transmission.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#showcase"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-transform active:scale-98"
                  style={{ backgroundColor: colors.accent }}
                >
                  <span>Explore 360 view</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#allocation"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.line,
                    color: colors.text,
                  }}
                >
                  Reserve chassis
                </a>
              </div>
            </div>

            <div className="@lg:col-span-5 grid grid-cols-2 gap-3">
              <div
                className="p-5 rounded-2xl border space-y-2"
                style={{ backgroundColor: colors.surface, borderColor: colors.line }}
              >
                <span className="text-xs font-mono block" style={{ color: colors.muted }}>Total Power</span>
                <div className="text-3xl font-semibold tracking-tight" style={{ color: colors.accent }}>1015 CV</div>
                <span className="text-xs block" style={{ color: colors.muted }}>V12 ICE + Tri-Motor</span>
              </div>

              <div
                className="p-5 rounded-2xl border space-y-2"
                style={{ backgroundColor: colors.surface, borderColor: colors.line }}
              >
                <span className="text-xs font-mono block" style={{ color: colors.muted }}>Acceleration</span>
                <div className="text-3xl font-semibold tracking-tight" style={{ color: colors.text }}>2.5 s</div>
                <span className="text-xs block" style={{ color: colors.muted }}>0 to 100 km/h</span>
              </div>

              <div
                className="p-5 rounded-2xl border space-y-2"
                style={{ backgroundColor: colors.surface, borderColor: colors.line }}
              >
                <span className="text-xs font-mono block" style={{ color: colors.muted }}>Top Velocity</span>
                <div className="text-3xl font-semibold tracking-tight" style={{ color: colors.text }}>&gt;350</div>
                <span className="text-xs block" style={{ color: colors.muted }}>Kilometers per hour</span>
              </div>

              <div
                className="p-5 rounded-2xl border space-y-2"
                style={{ backgroundColor: colors.surface, borderColor: colors.line }}
              >
                <span className="text-xs font-mono block" style={{ color: colors.muted }}>Weight to Power</span>
                <div className="text-3xl font-semibold tracking-tight" style={{ color: colors.text }}>1.75</div>
                <span className="text-xs block" style={{ color: colors.muted }}>Kilograms per CV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3D ROTATION SHOWCASE (SIGNATURE S2) */}
      <section
        id="showcase"
        ref={showcaseRef}
        className="relative border-b"
        style={{
          minHeight: "220vh",
          borderColor: colors.line,
          contain: "layout paint style",
        }}
      >
        <div className="sticky top-16 z-20 w-full" style={{ height: "calc(100vh - 4.25rem)" }}>
          <div className="h-full max-w-6xl mx-auto px-4 @md:px-8 py-4 flex flex-col justify-between">
            {/* Chapter Header Tabs */}
            <div className="flex items-center justify-between gap-2 border rounded-xl p-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.line }}>
              <div className="flex items-center gap-1 overflow-x-auto">
                {CHAPTERS.map((ch, idx) => {
                  const isCurrent = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToChapter(idx)}
                      className={\`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap \${
                        isCurrent ? "text-white shadow-xs" : "hover:opacity-100"
                      }\`}
                      style={{
                        backgroundColor: isCurrent ? colors.accent : "transparent",
                        color: isCurrent ? colors.accentInk : colors.muted,
                      }}
                    >
                      {ch.title}
                    </button>
                  );
                })}
              </div>

              <div className="hidden @sm:flex items-center gap-2 px-3 text-xs font-mono" style={{ color: colors.muted }}>
                <span>Scroll to rotate</span>
              </div>
            </div>

            {/* Vitrine Stage */}
            <div
              className="relative flex-1 flex items-center justify-center my-3 rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: isDark ? colors.surfaceRaised : "#0A0B09",
                borderColor: colors.line,
              }}
            >
              <div className="relative w-full max-w-4xl aspect-[16/9] px-4 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300"
                  style={{
                    filter: "contrast(1.06) brightness(1.06) drop-shadow(0 20px 30px rgba(0,0,0,0.85))",
                    maskImage: "radial-gradient(ellipse at 50% 50%, #000 62%, transparent 92%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 62%, transparent 92%)",
                  }}
                />

                {loadedFramesCount < 10 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: colors.bg }}>
                    <RotateCw className="w-5 h-5 animate-spin" style={{ color: colors.accent }} />
                    <span className="text-xs font-mono" style={{ color: colors.muted }}>
                      Loading frames...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Chapter Details Card */}
            <div
              className="p-4 @md:p-5 rounded-2xl border space-y-3"
              style={{ backgroundColor: colors.surface, borderColor: colors.line }}
            >
              <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-base @md:text-lg font-semibold tracking-tight" style={{ color: colors.text }}>
                    {activeChapter.title}
                  </h3>
                  <p className="text-xs @md:text-sm" style={{ color: colors.muted }}>
                    {activeChapter.subtitle}
                  </p>
                </div>
                <span className="text-xs font-mono font-medium" style={{ color: colors.accent }}>
                  Chapter {activeChapter.id} of 04
                </span>
              </div>

              <p className="text-xs @md:text-sm leading-relaxed" style={{ color: colors.muted }}>
                {activeChapter.desc}
              </p>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t" style={{ borderColor: colors.line }}>
                {activeChapter.metrics.map((m) => (
                  <div key={m.label}>
                    <span className="text-[11px] block" style={{ color: colors.muted }}>
                      {m.label}
                    </span>
                    <span className="text-xs @md:text-sm font-semibold tracking-tight block" style={{ color: colors.text }}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Touch scrubber on mobile */}
            {isMobile && (
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={scrubProgress}
                  onChange={(e) => {
                    targetProgressRef.current = parseFloat(e.target.value);
                  }}
                  className="w-full accent-red-600"
                  aria-label="Rotation scrubber"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: MANIFESTO (TYPOGRAPHIC ONLY) */}
      <section id="manifesto" className="px-4 @md:px-8 py-20 @md:py-28 border-b" style={{ borderColor: colors.line }}>
        <div className="max-w-4xl mx-auto space-y-8 text-center @md:text-left">
          <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: colors.accent }}>
            Engineering thesis
          </span>

          <h2
            className="text-3xl @sm:text-4xl @md:text-5xl font-semibold tracking-tight leading-[1.08]"
            style={{ color: colors.text }}
          >
            Atmospheric power at 9,500 RPM.
          </h2>

          <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 pt-2 text-sm @md:text-base leading-relaxed text-left" style={{ color: colors.muted }}>
            <p>
              While contemporary hypercar manufacturers downsized displacement and concealed throttle hesitation behind twin turbochargers, Lamborghini chose to preserve the unfiltered acoustic resonance and high-revving character of twelve naturally aspirated cylinders.
            </p>
            <p>
              By pairing an atmospheric 6.5-liter internal combustion engine with three oil-cooled axial-flux electric motors, the Revuelto achieves instantaneous low-end torque fill while sustaining a crescendo all the way to its 9,500 RPM limiter.
            </p>
          </div>

          <div className="grid grid-cols-2 @md:grid-cols-4 gap-4 pt-6 border-t text-left" style={{ borderColor: colors.line }}>
            <div>
              <span className="text-xs font-mono block" style={{ color: colors.muted }}>Cylinder Bank</span>
              <span className="text-xl font-semibold" style={{ color: colors.text }}>60 degrees</span>
            </div>
            <div>
              <span className="text-xs font-mono block" style={{ color: colors.muted }}>Specific Output</span>
              <span className="text-xl font-semibold" style={{ color: colors.accent }}>128 CV / liter</span>
            </div>
            <div>
              <span className="text-xs font-mono block" style={{ color: colors.muted }}>Compression</span>
              <span className="text-xl font-semibold" style={{ color: colors.text }}>12.6 to 1</span>
            </div>
            <div>
              <span className="text-xs font-mono block" style={{ color: colors.muted }}>Scavenge Circuit</span>
              <span className="text-xl font-semibold" style={{ color: colors.text }}>7 oil pumps</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: POWERTRAIN MATRIX */}
      <section id="powertrain" className="px-4 @md:px-8 py-20 @md:py-24 border-b" style={{ borderColor: colors.line }}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: colors.accent }}>
              Propulsion Architecture
            </span>
            <h2 className="text-2xl @md:text-3xl font-semibold tracking-tight" style={{ color: colors.text }}>
              Hybrid powertrain breakdown
            </h2>
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 gap-4">
            <div
              className="p-6 rounded-2xl border space-y-3"
              style={{ backgroundColor: colors.surface, borderColor: colors.line }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: colors.muted }}>Core 01</span>
                <Flame className="w-4 h-4" style={{ color: colors.accent }} />
              </div>
              <h3 className="text-base font-semibold" style={{ color: colors.text }}>
                6.5L V12 ICE
              </h3>
              <div className="text-2xl font-semibold tracking-tight" style={{ color: colors.accent }}>
                825 CV
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                Lightweight atmospheric combustion engine weighing 218 kg with redesigned intake ports and dry sump lubrication.
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border space-y-3"
              style={{ backgroundColor: colors.surface, borderColor: colors.line }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: colors.muted }}>Axle 02</span>
                <Zap className="w-4 h-4" style={{ color: colors.accent }} />
              </div>
              <h3 className="text-base font-semibold" style={{ color: colors.text }}>
                Dual Front E-Motors
              </h3>
              <div className="text-2xl font-semibold tracking-tight" style={{ color: colors.accent }}>
                300 CV
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                Two axial-flux motors at the front axle providing electric all-wheel drive, surgical torque vectoring, and regeneration.
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border space-y-3"
              style={{ backgroundColor: colors.surface, borderColor: colors.line }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: colors.muted }}>Gearbox 03</span>
                <Cpu className="w-4 h-4" style={{ color: colors.text }} />
              </div>
              <h3 className="text-base font-semibold" style={{ color: colors.text }}>
                8-Speed Dual Clutch
              </h3>
              <div className="text-2xl font-semibold tracking-tight" style={{ color: colors.text }}>
                193 kg
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                Transversely positioned behind the engine block with an integrated electric motor that acts as starter and rear booster.
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border space-y-3"
              style={{ backgroundColor: colors.surface, borderColor: colors.line }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: colors.muted }}>Tunnel 04</span>
                <Layers className="w-4 h-4" style={{ color: colors.text }} />
              </div>
              <h3 className="text-base font-semibold" style={{ color: colors.text }}>
                Pouch Cell Battery
              </h3>
              <div className="text-2xl font-semibold tracking-tight" style={{ color: colors.text }}>
                3.8 kWh
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                High-density battery pack installed within the central structural tunnel for low yaw inertia and optimal balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AERODYNAMICS LEDGER */}
      <section id="aerodynamics" className="px-4 @md:px-8 py-20 @md:py-24 border-b" style={{ borderColor: colors.line }}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: colors.accent }}>
              Active Aerodynamics
            </span>
            <h2 className="text-2xl @md:text-3xl font-semibold tracking-tight" style={{ color: colors.text }}>
              ALA 2.0 wing configurations
            </h2>
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
            {AERO_CONFIGS.map((cfg) => {
              const selected = activeAero === cfg.id;
              return (
                <div
                  key={cfg.id}
                  onClick={() => setActiveAero(cfg.id)}
                  className="p-6 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:border-zinc-400"
                  style={{
                    backgroundColor: selected ? colors.surfaceRaised : colors.surface,
                    borderColor: selected ? colors.accent : colors.line,
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium uppercase" style={{ color: selected ? colors.accent : colors.muted }}>
                        Configuration
                      </span>
                      <span className="text-xs font-mono" style={{ color: colors.muted }}>
                        {cfg.balance}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight" style={{ color: colors.text }}>
                      {cfg.name}
                    </h3>

                    <p className="text-xs @md:text-sm leading-relaxed" style={{ color: colors.muted }}>
                      {cfg.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t mt-5" style={{ borderColor: colors.line }}>
                    <span className="text-xs font-mono block" style={{ color: colors.muted }}>Vertical Load</span>
                    <span className="text-sm font-semibold tracking-tight" style={{ color: colors.text }}>{cfg.load}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: ALLOCATION CONSOLE */}
      <section id="allocation" className="px-4 @md:px-8 py-20 @md:py-24 border-b" style={{ borderColor: colors.line }}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: colors.accent }}>
              Configuration Console
            </span>
            <h2 className="text-2xl @md:text-3xl font-semibold tracking-tight" style={{ color: colors.text }}>
              Reserve your chassis allocation
            </h2>
          </div>

          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 items-start">
            <div className="@lg:col-span-7 space-y-6">
              {/* Paint Selection */}
              <div
                className="p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: colors.surface, borderColor: colors.line }}
              >
                <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: colors.muted }}>
                  Exterior Livery
                </span>
                <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3">
                  {FINISHES.map((f) => {
                    const sel = activeFinish === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setActiveFinish(f.id)}
                        className="p-3.5 rounded-xl border text-left space-y-2 transition-all cursor-pointer hover:border-zinc-400"
                        style={{
                          borderColor: sel ? colors.accent : colors.line,
                          backgroundColor: sel ? colors.surfaceRaised : colors.bg,
                        }}
                      >
                        <div className="w-full h-7 rounded-lg border" style={{ backgroundColor: f.hex, borderColor: colors.line }} />
                        <div>
                          <span className="text-xs font-semibold block leading-tight" style={{ color: colors.text }}>
                            {f.name}
                          </span>
                          <span className="text-[11px] font-mono block" style={{ color: colors.muted }}>
                            {f.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wheel Selection */}
              <div
                className="p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: colors.surface, borderColor: colors.line }}
              >
                <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: colors.muted }}>
                  Forged Wheels
                </span>
                <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                  {WHEELS.map((w) => {
                    const sel = activeWheel === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => setActiveWheel(w.id)}
                        className="p-4 rounded-xl border text-left space-y-1.5 transition-all cursor-pointer hover:border-zinc-400"
                        style={{
                          borderColor: sel ? colors.accent : colors.line,
                          backgroundColor: sel ? colors.surfaceRaised : colors.bg,
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold" style={{ color: colors.text }}>
                            {w.name}
                          </span>
                          <span className="text-xs font-mono font-medium" style={{ color: colors.accent }}>
                            {w.delta}
                          </span>
                        </div>
                        <span className="text-xs block" style={{ color: colors.muted }}>
                          {w.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div
              className="@lg:col-span-5 p-6 rounded-2xl border space-y-6"
              style={{ backgroundColor: colors.surface, borderColor: colors.line }}
            >
              <div className="border-b pb-4" style={{ borderColor: colors.line }}>
                <span className="text-xs font-mono uppercase block" style={{ color: colors.muted }}>
                  Allocation Summary
                </span>
                <span className="text-xl font-semibold" style={{ color: colors.text }}>
                  Lamborghini Revuelto
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2" style={{ borderColor: colors.line }}>
                  <span style={{ color: colors.muted }}>Powertrain</span>
                  <span className="font-medium">1015 CV Hybrid V12</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: colors.line }}>
                  <span style={{ color: colors.muted }}>Exterior Paint</span>
                  <span className="font-medium">{FINISHES.find((f) => f.id === activeFinish)?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: colors.line }}>
                  <span style={{ color: colors.muted }}>Wheel Package</span>
                  <span className="font-medium">{WHEELS.find((w) => w.id === activeWheel)?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: colors.line }}>
                  <span style={{ color: colors.muted }}>Aero Profile</span>
                  <span className="font-medium">ALA 2.0 Active</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>Dry Weight</span>
                  <span className="font-medium" style={{ color: colors.accent }}>1,772 kg</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={copyCli}
                  className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                  style={{ backgroundColor: colors.accent }}
                >
                  <span>Confirm allocation request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div
                  className="p-3 rounded-xl border text-xs font-mono flex items-center justify-between"
                  style={{ borderColor: colors.line, backgroundColor: colors.bg }}
                >
                  <span className="truncate pr-2" style={{ color: colors.muted }}>
                    npx nexoreui add template-lamborghini-revuelto
                  </span>
                  <button
                    onClick={copyCli}
                    className="font-medium shrink-0 underline cursor-pointer"
                    style={{ color: colors.accent }}
                  >
                    {copiedCli ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: COLOPHON */}
      <footer className="px-4 @md:px-8 py-16" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid grid-cols-1 @md:grid-cols-4 gap-8 text-xs">
            <div className="space-y-2">
              <span className="font-semibold block uppercase tracking-wider" style={{ color: colors.text }}>
                Factory
              </span>
              <p className="leading-relaxed" style={{ color: colors.muted }}>
                Automobili Lamborghini S.p.A.
                <br />
                Via Modena 12, 40019
                <br />
                Sant'Agata Bolognese, Italy
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold block uppercase tracking-wider" style={{ color: colors.text }}>
                Homologation
              </span>
              <p className="leading-relaxed" style={{ color: colors.muted }}>
                Fuel consumption: 10.3 l/100 km
                <br />
                Combined CO2: 276 g/km
                <br />
                Electric range: 10 km
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold block uppercase tracking-wider" style={{ color: colors.text }}>
                Chassis
              </span>
              <p className="leading-relaxed" style={{ color: colors.muted }}>
                Carbon fiber monofuselage
                <br />
                Forged composites front frame
                <br />
                Aluminum rear subframe
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold block uppercase tracking-wider" style={{ color: colors.text }}>
                Template
              </span>
              <p className="leading-relaxed" style={{ color: colors.muted }}>
                NexoreUI Pro Template
                <br />
                Smooth 240 frame canvas scrub
                <br />
                Independent export component
              </p>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-col @sm:flex-row justify-between items-center gap-4 text-xs" style={{ borderColor: colors.line, color: colors.muted }}>
            <span>Automobili Lamborghini Revuelto</span>
            <span>Production ready template for NexoreUI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};
