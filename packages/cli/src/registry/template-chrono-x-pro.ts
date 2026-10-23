export const templateChronoXPro = {
  name: "template-chrono-x-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-chrono-x-pro.tsx",
  content: `"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Shield,
  Zap,
  Clock,
  Compass,
  Layers,
  Activity,
  Sun,
  Moon,
  Terminal,
  Check,
  Maximize2,
  Minimize2,
  ChevronDown,
  ArrowUpRight,
  Sliders,
  RotateCw,
} from "lucide-react";

const FONT = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Tenor Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Geist Mono', monospace",
};

const TOTAL_FRAMES = 179;

const CHAPTERS = [
  {
    id: "01",
    title: "Chassis & Forging",
    subtitle: "Grade 5 Aerospace Monobloc Case",
    desc: "Precision-milled from solid titanium Ti-6Al-4V billet. Weighing only 88 grams with satin-brushed flank surfaces and hand-polished bevels.",
    metrics: [
      { label: "Diameter", value: "44.0 mm" },
      { label: "Total Weight", value: "88 g" },
      { label: "Material", value: "Grade 5 Titanium" },
    ],
  },
  {
    id: "02",
    title: "Flying Tourbillon",
    subtitle: "4 Hz Escapement with Silicon Hairspring",
    desc: "Free-sprung flying tourbillon cage completing one rotation every sixty seconds, neutralizing positional gravitational errors with silicon inertia.",
    metrics: [
      { label: "Cadence", value: "28,800 vph" },
      { label: "Daily Rate", value: "±1.5 s/d" },
      { label: "Escapement", value: "Silicon (SiO2)" },
    ],
  },
  {
    id: "03",
    title: "Hermetic Crown",
    subtitle: "Quadruple Gasket 100M Water Guard",
    desc: "Diamond-knurled titanium screw-down crown with quadruple synthetic fluoropolymer seals, tested to 10 ATM static pressure.",
    metrics: [
      { label: "Depth Rating", value: "100 m / 10 ATM" },
      { label: "Crown Seal", value: "Quadruple O-Ring" },
      { label: "Crystal", value: "Mohs 9 Sapphire" },
    ],
  },
  {
    id: "04",
    title: "Caliber CX-01",
    subtitle: "Twin-Barrel 72-Hour Manual Caliber",
    desc: "In-house manual winding architecture featuring twin spring barrels in series for linear torque delivery, 33 ruby jewels, and openworked bridges.",
    metrics: [
      { label: "Power Reserve", value: "72 Hours" },
      { label: "Jewel Count", value: "33 Rubies" },
      { label: "Finishing", value: "Hand Anglage" },
    ],
  },
] as const;

const SPEC_ROWS = [
  { label: "Case Architecture", value: "Grade 5 Titanium (Ti-6Al-4V), satin-finished with diamond-lapped bevels" },
  { label: "Case Proportions", value: "44.0 mm diameter, 12.8 mm height, 51.5 mm lug-to-lug" },
  { label: "Movement Caliber", value: "In-house Caliber CX-01 Manual Winding Mechanical" },
  { label: "Escapement Assembly", value: "60-second Flying Tourbillon with silicon balance spring" },
  { label: "Oscillation Cadence", value: "28,800 vibrations per hour (4.0 Hz)" },
  { label: "Power Autonomy", value: "72 hours continuous reserve via twin serial barrels" },
  { label: "Hermetic Depth", value: "10 ATM / 100 meters / 330 feet static water test" },
  { label: "Front Glazing", value: "Double-domed anti-reflective scratch-resistant sapphire" },
  { label: "Exhibition Caseback", value: "Flat sapphire crystal revealing hand-beveled openwork bridges" },
  { label: "Regulation Tolerance", value: "Adjusted in 5 positions and temperature to ±1.5 s/day" },
] as const;

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Bilateral Titanium Milling",
    desc: "Each monobloc case is milled from aerospace-certified Grade 5 titanium billets under submerged flood coolant, maintaining tolerances below 0.002 mm.",
  },
  {
    step: "02",
    title: "Hand Anglage & Lapping",
    desc: "Every bridge and lug chamfer is cut by hand using traditional boxwood pegs and diamond paste to create light-catching 45-degree polished margins.",
  },
  {
    step: "03",
    title: "Dynamic 5-Position Regulation",
    desc: "Calibers undergo 336 hours of continuous chronometric testing across dial-up, dial-down, crown-up, crown-left, and crown-right orientations.",
  },
] as const;

export default function ChronoXTitaniumTemplate({
  theme = "dark",
  brandName = "CHRONO-X TITANIUM",
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
  const brand = config.brandName || "CHRONO-X TITANIUM";

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
        bg: "#0B0F14",
        surface: "#121821",
        surfaceRaised: "#18222F",
        line: "#1F2733",
        text: "#E9EDF2",
        muted: "#8793A3",
        accent: "#E8B84B",
        accentInk: "#1A1303",
      };
    }
    return {
      bg: "#F5F6F8",
      surface: "#EBF0F5",
      surfaceRaised: "#DFE5ED",
      line: "#D8DFE8",
      text: "#0B0F14",
      muted: "#5B6675",
      accent: "#A17417",
      accentInk: "#FFFFFF",
    };
  }, [isDark]);

  const [scrubProgress, setScrubProgress] = useState(0);
  const [selectedStrap, setSelectedStrap] = useState<"bracelet" | "rubber">("bracelet");
  const [copiedCli, setCopiedCli] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showcaseRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [, setLoadedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let count = 0;

    const priority = [0, 25, 50, 75, 100, 125, 150, 178];
    const rest: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!priority.includes(i)) rest.push(i);
    }
    const sequence = [...priority, ...rest];

    sequence.forEach((idx) => {
      const pad = String(idx + 1).padStart(3, "0");
      const img = new Image();
      img.decoding = "async";
      img.src = \`/videos/chrono_frames/frame_\${pad}.jpg\`;
      img.onload = () => {
        if (cancelled) return;
        framesRef.current[idx] = img;
        count++;
        setLoadedCount(count);
      };
      img.onerror = () => {
        if (cancelled) return;
        count++;
        setLoadedCount(count);
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

      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1))));
      const canvas = canvasRef.current;

      const redrawNeeded =
        frameIndex !== lastRenderedIndexRef.current ||
        (framesRef.current[frameIndex] && lastRenderedIndexRef.current === -1);

      if (canvas && redrawNeeded) {
        const ctx = canvas.getContext("2d");
        const img = framesRef.current[frameIndex] || framesRef.current[0];

        if (ctx && img && img.complete && img.naturalWidth > 0) {
          // canvas-ok: real-time 360-degree frame sequence scrub of Chrono-X Titanium chronometer with hardware blit
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

  const activeChapterIndex =
    scrubProgress < 0.28 ? 0 : scrubProgress < 0.55 ? 1 : scrubProgress < 0.8 ? 2 : 3;
  const currentChapter = CHAPTERS[activeChapterIndex];

  const handleSelectChapter = (index: number) => {
    const targets = [0.08, 0.40, 0.68, 0.92];
    const target = targets[index];
    targetProgressRef.current = target;
    setScrubProgress(target);

    const el = showcaseRef.current;
    if (!el) return;
    const scroller = findNearestScroller(el);
    const viewH = scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
    const totalTravel = el.offsetHeight - viewH;
    const destOffset = totalTravel * target;

    if (scroller === window) {
      const topPos = el.offsetTop + destOffset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    } else {
      (scroller as HTMLElement).scrollTo({ top: destOffset, behavior: "smooth" });
    }
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText("npx nexoreui add template-chrono-x-pro");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={rootRef}
      className="w-full min-h-screen select-none overflow-x-clip transition-colors duration-200"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: FONT.body,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Tenor+Sans&display=swap"
      />

      <header
        className="sticky top-0 z-50 border-b transition-colors duration-200"
        style={{
          backgroundColor: isDark ? "rgba(11, 15, 20, 0.92)" : "rgba(245, 246, 248, 0.94)",
          borderColor: colors.line,
        }}
      >
        <div className="max-w-[1152px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xs border flex items-center justify-center font-mono text-xs font-semibold"
              style={{
                borderColor: colors.line,
                backgroundColor: colors.surface,
                color: colors.accent,
              }}
            >
              CX
            </div>
            <div>
              <span
                className="text-sm font-semibold tracking-wider uppercase block"
                style={{ fontFamily: FONT.display, color: colors.text }}
              >
                {brand}
              </span>
              <span
                className="text-[10px] font-mono tracking-widest uppercase block"
                style={{ color: colors.muted }}
              >
                Chronometrie Suisse
              </span>
            </div>
          </div>

          {!isMobile && !isTablet && (
            <nav className="flex items-center gap-7 text-xs font-medium tracking-wide">
              <a
                href="#hero"
                className="transition-colors duration-150 hover:opacity-100"
                style={{ color: colors.muted }}
              >
                Overview
              </a>
              <a
                href="#showcase"
                className="transition-colors duration-150 hover:opacity-100"
                style={{ color: colors.muted }}
              >
                Showcase
              </a>
              <a
                href="#manifesto"
                className="transition-colors duration-150 hover:opacity-100"
                style={{ color: colors.muted }}
              >
                Philosophy
              </a>
              <a
                href="#specifications"
                className="transition-colors duration-150 hover:opacity-100"
                style={{ color: colors.muted }}
              >
                Specifications
              </a>
              <a
                href="#craftsmanship"
                className="transition-colors duration-150 hover:opacity-100"
                style={{ color: colors.muted }}
              >
                Craftsmanship
              </a>
            </nav>
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLocalTheme(isDark ? "light" : "dark")}
              className="h-9 px-3 rounded-xs border text-xs font-medium flex items-center gap-2 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
                color: colors.text,
              }}
              title="Toggle light and dark theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  <span className="hidden sm:inline">Vellum</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  <span className="hidden sm:inline">Midnight</span>
                </>
              )}
            </button>

            <a
              href="#acquisition"
              className="h-9 px-4 rounded-xs text-xs font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
              }}
            >
              Reserve
            </a>
          </div>
        </div>
      </header>

      <section
        id="hero"
        className="max-w-[1152px] mx-auto px-5 pt-20 pb-16 text-center"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div
            className="text-xs font-mono uppercase tracking-widest inline-block px-3 py-1 rounded-xs border"
            style={{
              borderColor: colors.line,
              backgroundColor: colors.surface,
              color: colors.muted,
            }}
          >
            Mechanical Chronometer CX-01
          </div>

          <h1
            className={\`font-normal tracking-tight \${
              isMobile ? "text-4xl leading-[1.05]" : isTablet ? "text-6xl leading-[1.02]" : "text-7xl lg:text-8xl leading-[0.98]"
            }\`}
            style={{
              fontFamily: FONT.display,
              color: colors.text,
            }}
          >
            Forged in Grade 5 Titanium
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: colors.muted }}
          >
            A manual-wind mechanical chronometer governed by a 28,800 vph flying tourbillon, housed in an aerospace titanium monobloc case.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#showcase"
              className="h-11 px-6 rounded-xs text-xs font-semibold flex items-center justify-center gap-2 transition-transform duration-150 active:scale-[0.98]"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
              }}
            >
              <span>Explore Caliber</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </a>

            <a
              href="#specifications"
              className="h-11 px-6 rounded-xs border text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                borderColor: colors.line,
                color: colors.text,
              }}
            >
              <span>View Data Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div
            className="mt-12 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 text-left"
            style={{ borderColor: colors.line }}
          >
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                Case Architecture
              </div>
              <div className="text-xl sm:text-2xl font-normal mt-1" style={{ fontFamily: FONT.display }}>
                44.0 MM
              </div>
              <div className="text-xs mt-0.5" style={{ color: colors.muted }}>
                Grade 5 Forged Titanium
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                Oscillation Rate
              </div>
              <div className="text-xl sm:text-2xl font-normal mt-1" style={{ fontFamily: FONT.display }}>
                28,800 VPH
              </div>
              <div className="text-xs mt-0.5" style={{ color: colors.muted }}>
                4.0 Hz Silicon Escapement
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                Power Autonomy
              </div>
              <div className="text-xl sm:text-2xl font-normal mt-1" style={{ fontFamily: FONT.display }}>
                72 HOURS
              </div>
              <div className="text-xs mt-0.5" style={{ color: colors.muted }}>
                Twin Serial Barrels
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                Hermetic Rating
              </div>
              <div className="text-xl sm:text-2xl font-normal mt-1" style={{ fontFamily: FONT.display }}>
                100 METERS
              </div>
              <div className="text-xs mt-0.5" style={{ color: colors.muted }}>
                10 Bar Pressure Proof
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="showcase"
        ref={showcaseRef}
        className="relative w-full"
        style={{ minHeight: isMobile ? "180vh" : "240vh" }}
      >
        <div
          className="sticky top-16 z-20 w-full flex flex-col justify-between"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="max-w-[1152px] w-full mx-auto px-5 pt-4 flex items-center justify-between border-b pb-3" style={{ borderColor: colors.line }}>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {CHAPTERS.map((ch, idx) => {
                const isActive = activeChapterIndex === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(idx)}
                    className="px-3 py-1.5 rounded-xs text-xs font-mono tracking-wider transition-colors duration-150 cursor-pointer flex items-center gap-1.5 shrink-0"
                    style={{
                      backgroundColor: isActive ? colors.surfaceRaised : "transparent",
                      color: isActive ? colors.text : colors.muted,
                      border: \`1px solid \${isActive ? colors.line : "transparent"}\`,
                    }}
                  >
                    <span style={{ color: isActive ? colors.accent : colors.muted }}>{ch.id}</span>
                    <span className="hidden sm:inline">{ch.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono shrink-0" style={{ color: colors.muted }}>
              <span className="hidden md:inline">
                {Math.round(scrubProgress * 360)}° ROTATION
              </span>
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-xs border flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: colors.line, color: colors.text }}
                title="Toggle fullscreen view"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4">
            <div
              className="relative w-full max-w-[800px] aspect-[16/9] flex items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: isDark ? "transparent" : "#0A0B0E",
                borderColor: isDark ? "transparent" : colors.line,
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 45%, rgba(0,0,0,0.85) 75%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 45%, rgba(0,0,0,0.85) 75%, transparent 100%)",
              }}
            >
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          </div>

          <div className="max-w-[1152px] w-full mx-auto px-5 pb-4">
            <div
              className="p-4 sm:p-5 rounded-xs border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: colors.accent }}>
                    Chapter {currentChapter.id} / 04
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-normal"
                    style={{ fontFamily: FONT.display, color: colors.text }}
                  >
                    {currentChapter.subtitle}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.muted }}>
                    {currentChapter.desc}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-5 shrink-0" style={{ borderColor: colors.line }}>
                  {currentChapter.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                        {m.label}
                      </div>
                      <div className="text-sm font-semibold mt-0.5" style={{ color: colors.text }}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isMobile && (
                <div className="mt-3 pt-3 border-t flex items-center gap-3" style={{ borderColor: colors.line }}>
                  <RotateCw className="w-3.5 h-3.5 shrink-0" style={{ color: colors.muted }} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.005"
                    value={scrubProgress}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      targetProgressRef.current = val;
                      setScrubProgress(val);
                    }}
                    className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-amber-500 bg-neutral-700"
                  />
                  <span className="text-[11px] font-mono shrink-0" style={{ color: colors.muted }}>
                    {Math.round(scrubProgress * 360)}°
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="manifesto"
        className="max-w-[1152px] mx-auto px-5 py-24 border-t"
        style={{ borderColor: colors.line }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: colors.accent }}
          >
            Chronometric Discipline
          </div>

          <blockquote
            className={\`font-normal tracking-tight italic \${
              isMobile ? "text-2xl leading-snug" : "text-4xl sm:text-5xl leading-tight"
            }\`}
            style={{
              fontFamily: FONT.display,
              color: colors.text,
            }}
          >
            "Time is not a digital signal. It is a kinetic continuum governed by inertia, elasticity, and balance."
          </blockquote>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-6 text-sm sm:text-base leading-relaxed border-t"
            style={{ borderColor: colors.line, color: colors.muted }}
          >
            <p>
              In an era dominated by transient digital screens and planned obsolescence, Chrono-X Titanium returns timekeeping to pure mechanical autonomy. The energy required to measure every second is derived exclusively from the coiled tension of its mainspring barrels.
            </p>
            <p>
              Grade 5 titanium provides forty percent less mass than stainless steel alongside twice the tensile resistance. Paired with a silicon escapement operating without lubricant degradation, the watch preserves timing stability across extreme thermal variations.
            </p>
          </div>
        </div>
      </section>

      <section
        id="specifications"
        className="max-w-[1152px] mx-auto px-5 py-20 border-t"
        style={{ borderColor: colors.line }}
      >
        <div className="max-w-2xl mb-10">
          <div
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: colors.accent }}
          >
            Technical Specification Ledger
          </div>
          <h2
            className="text-3xl sm:text-4xl font-normal mt-2"
            style={{ fontFamily: FONT.display, color: colors.text }}
          >
            Documented Tolerances
          </h2>
        </div>

        <div className="border-t" style={{ borderColor: colors.line }}>
          {SPEC_ROWS.map((row) => (
            <div
              key={row.label}
              className="py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/5 px-2"
              style={{ borderColor: colors.line }}
            >
              <span className="font-mono text-xs uppercase tracking-wider shrink-0 w-64" style={{ color: colors.muted }}>
                {row.label}
              </span>
              <span className="font-medium text-left sm:text-right" style={{ color: colors.text }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="craftsmanship"
        className="max-w-[1152px] mx-auto px-5 py-20 border-t"
        style={{ borderColor: colors.line }}
      >
        <div className="max-w-2xl mb-12">
          <div
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: colors.accent }}
          >
            Manufacture Protocols
          </div>
          <h2
            className="text-3xl sm:text-4xl font-normal mt-2"
            style={{ fontFamily: FONT.display, color: colors.text }}
          >
            Three Pillars of Precision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-xs border space-y-4"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
              }}
            >
              <div
                className="w-8 h-8 rounded-xs border flex items-center justify-center font-mono text-xs font-bold"
                style={{
                  borderColor: colors.line,
                  backgroundColor: colors.surfaceRaised,
                  color: colors.accent,
                }}
              >
                {step.step}
              </div>
              <h3
                className="text-xl font-normal"
                style={{ fontFamily: FONT.display, color: colors.text }}
              >
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.muted }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="acquisition"
        className="max-w-[1152px] mx-auto px-5 py-20 border-t"
        style={{ borderColor: colors.line }}
      >
        <div
          className="p-6 sm:p-10 rounded-xs border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.line,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: colors.accent }}
              >
                Acquisition Console
              </div>

              <h2
                className="text-3xl sm:text-5xl font-normal"
                style={{ fontFamily: FONT.display, color: colors.text }}
              >
                Configure Your Chronometer
              </h2>

              <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                Each piece is numbered and issued with an individualized chronometer performance certificate from our timing observatory. Select your preferred strap configuration below.
              </p>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                  Strap Configuration
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedStrap("bracelet")}
                    className="p-4 rounded-xs border text-left transition-colors cursor-pointer"
                    style={{
                      borderColor: selectedStrap === "bracelet" ? colors.accent : colors.line,
                      backgroundColor: selectedStrap === "bracelet" ? colors.surfaceRaised : "transparent",
                    }}
                  >
                    <div className="text-sm font-semibold" style={{ color: colors.text }}>
                      Grade 5 Titanium Bracelet
                    </div>
                    <div className="text-xs mt-1" style={{ color: colors.muted }}>
                      Solid links with micro-adjust clasp
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedStrap("rubber")}
                    className="p-4 rounded-xs border text-left transition-colors cursor-pointer"
                    style={{
                      borderColor: selectedStrap === "rubber" ? colors.accent : colors.line,
                      backgroundColor: selectedStrap === "rubber" ? colors.surfaceRaised : "transparent",
                    }}
                  >
                    <div className="text-sm font-semibold" style={{ color: colors.text }}>
                      FKM Vulcanized Rubber
                    </div>
                    <div className="text-xs mt-1" style={{ color: colors.muted }}>
                      Hydrophobic with titanium buckle
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2" style={{ borderColor: colors.line }}>
                <div className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                  Developer Integration Command
                </div>
                <div
                  className="p-3 rounded-xs border flex items-center justify-between font-mono text-xs"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.line,
                  }}
                >
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <Terminal className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                    <span style={{ color: colors.text }}>npx nexoreui add template-chrono-x-pro</span>
                  </div>
                  <button
                    onClick={copyCliCommand}
                    className="ml-3 px-2.5 py-1 rounded-xs border text-[11px] font-mono transition-colors shrink-0 cursor-pointer"
                    style={{
                      borderColor: colors.line,
                      color: copiedCli ? colors.accent : colors.text,
                    }}
                  >
                    {copiedCli ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="lg:col-span-5 p-6 rounded-xs border space-y-6"
              style={{
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.line,
              }}
            >
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.muted }}>
                  Total Acquisition Price
                </div>
                <div className="text-3xl sm:text-4xl font-normal mt-1" style={{ fontFamily: FONT.display, color: colors.text }}>
                  $1,850 USD
                </div>
                <div className="text-xs mt-1" style={{ color: colors.muted }}>
                  Includes worldwide insured courier delivery
                </div>
              </div>

              <div className="space-y-2.5 text-xs" style={{ color: colors.muted }}>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                  <span>3-year comprehensive international warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                  <span>Observatory-verified calibration certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                  <span>Grade 5 titanium sizing tool and travel vault</span>
                </div>
              </div>

              <button
                className="w-full h-11 rounded-xs text-xs font-semibold flex items-center justify-center transition-transform active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                Reserve Chronometer
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="colophon"
        className="max-w-[1152px] mx-auto px-5 py-14 border-t text-xs"
        style={{ borderColor: colors.line, color: colors.muted }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <span
              className="text-sm font-semibold tracking-wider uppercase block"
              style={{ fontFamily: FONT.display, color: colors.text }}
            >
              {brand}
            </span>
            <p className="leading-relaxed">
              Dedicated to mechanical chronometry, titanium metallurgy, and high-frequency tourbillon architecture.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: colors.text }}>
              Standards
            </div>
            <div>ISO 1413 Shock Resistance</div>
            <div>ISO 764 Anti-Magnetic Shielding</div>
            <div>10 ATM Hermetic Testing</div>
          </div>

          <div className="space-y-1.5">
            <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: colors.text }}>
              Observatory
            </div>
            <div>Geneva Watchmaking Registry</div>
            <div>Silicon Escapement Laboratory</div>
            <div>Caliber Archive 2026</div>
          </div>

          <div className="space-y-1.5">
            <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: colors.text }}>
              Colophon
            </div>
            <div>Typography: Cormorant & Tenor</div>
            <div>Palette: P2 Midnight Ledger</div>
            <div>Theme: {isDark ? "Midnight Dark" : "Vellum Light"}</div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]" style={{ borderColor: colors.line }}>
          <div>© 2026 {brand}. All rights reserved.</div>
          <div>NexoreUI Professional Production Template</div>
        </div>
      </footer>
    </div>
  );
}
`,
};
