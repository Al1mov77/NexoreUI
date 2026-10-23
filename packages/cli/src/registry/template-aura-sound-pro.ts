export const templateAuraSoundPro = {
  name: "template-aura-sound-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-aura-sound-pro.tsx",
  content: `"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sun,
  Moon,
  Terminal,
  Check,
  RotateCw,
  Activity,
  Layers,
  Shield,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  Headphones,
} from "lucide-react";

const TOTAL_FRAMES = 238;

const FONT_SPACE_GROTESK = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SPACE_MONO = "'Space Mono', monospace";

const PALETTE = {
  dark: {
    bg: "#0C0D0C",
    surface: "#141614",
    surfaceRaised: "#1D201D",
    line: "#262B26",
    text: "#ECEFE8",
    muted: "#8B9185",
    accent: "#C6F432",
    accentInk: "#121A00",
  },
  light: {
    bg: "#F4F6F1",
    surface: "#E8EBE2",
    surfaceRaised: "#DCE0D5",
    line: "#C8CEC0",
    text: "#111310",
    muted: "#606659",
    accent: "#467300",
    accentInk: "#FFFFFF",
  },
} as const;

interface FinishOption {
  id: string;
  name: string;
  hex: string;
  tag: string;
}

const FINISHES = [
  { id: "carbon-black", name: "Carbon Black", hex: "#141614", tag: "Anodized Type III" },
  { id: "matte-titanium", name: "Matte Titanium", hex: "#7D857A", tag: "Bead-Blasted" },
  { id: "stealth-lime", name: "Volt Accent", hex: "#3B4A20", tag: "Precision Ion" },
] as const satisfies readonly FinishOption[];

interface Chapter {
  id: string;
  step: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  metricLabel: string;
  targetProgress: number;
}

const CHAPTERS = [
  {
    id: "transducer",
    step: "01",
    title: "Electro-Deposited Graphene Diaphragm",
    category: "Transducer Foil",
    description: "Monolayer graphene composite diaphragm driven by dual N52 neodymium magnetic rings producing 1.42 Tesla flux density.",
    metric: "< 0.02%",
    metricLabel: "THD at 1kHz 100dB",
    targetProgress: 0.12,
  },
  {
    id: "chamber",
    step: "02",
    title: "Acoustic Cavity Resistance Tuning",
    category: "Chamber Acoustics",
    description: "CNC milled rear enclosure tuned with micro-perforated acoustic resistance screens to eliminate internal standing waves.",
    metric: "10Hz - 42kHz",
    metricLabel: "Calibrated Range",
    targetProgress: 0.38,
  },
  {
    id: "chassis",
    step: "03",
    title: "Grade 5 Titanium Pivot Gimbal",
    category: "Mechanical Rigidity",
    description: "Precision-damped friction hinges machined from solid aerospace titanium billets for zero acoustic mechanical resonance.",
    metric: "338g",
    metricLabel: "Balanced Mass",
    targetProgress: 0.64,
  },
  {
    id: "isolation",
    step: "04",
    title: "Viscoelastic Acoustic Isolation Seals",
    category: "Acoustic Coupling",
    description: "Contoured high-density memory cushions wrapped in micro-vented acoustic weave ensuring consistent sub-bass coupling.",
    metric: "-26 dBA",
    metricLabel: "Passive Reduction",
    targetProgress: 0.88,
  },
] as const satisfies readonly Chapter[];

interface EqProfile {
  id: "flat" | "bass" | "vocal";
  label: string;
  curveNotes: string;
  deviation: string;
}

const EQ_PROFILES = [
  { id: "flat", label: "Studio Flat", curveNotes: "Calibrated for mastering and critical studio monitoring", deviation: "±0.5 dB" },
  { id: "bass", label: "Sub Extension", curveNotes: "Phase-aligned linear extension below 80Hz", deviation: "+3.0 dB" },
  { id: "vocal", label: "Mid Presence", curveNotes: "Gentle mid-forward clarity for tracking and dialogue", deviation: "+2.2 dB" },
] as const satisfies readonly EqProfile[];

interface SpecRow {
  parameter: string;
  measuredValue: string;
  standard: string;
}

const SPECIFICATION_LEDGER = [
  { parameter: "Transducer Architecture", measuredValue: "40 mm Dynamic Electro-Graphene", standard: "IEC 60268-7" },
  { parameter: "Operating Frequency Range", measuredValue: "10 Hz - 42,000 Hz", standard: "DIN 45500 Hi-Res" },
  { parameter: "Nominal Impedance", measuredValue: "32 Ohm ± 5% at 1 kHz", standard: "Balanced Load" },
  { parameter: "Sound Pressure Sensitivity", measuredValue: "106 dB SPL / 1 mW", standard: "Wideband Calibrated" },
  { parameter: "Total Harmonic Distortion", measuredValue: "< 0.02% at 1 kHz, 100 dB SPL", standard: "Audio Precision APx555" },
  { parameter: "Magnetic Flux Density", measuredValue: "1.42 Tesla (Dual N52 Circuit)", standard: "Rare-Earth Circuit" },
  { parameter: "Passive Attenuation", measuredValue: "-26 dBA Broad Spectrum", standard: "Diffuse-Field Ear Simulator" },
  { parameter: "Chassis Material", measuredValue: "Aerospace Grade 5 Titanium and 6061 Billet", standard: "Sub-Millimeter CNC" },
  { parameter: "Interconnect Cable", measuredValue: "3.0 m 6N Oxygen-Free Silver-Plated Copper", standard: "Quad-Core Shielded" },
  { parameter: "Net Headphone Mass", measuredValue: "338 g (Excluding Interconnect)", standard: "Ergonomic Neutral" },
] as const satisfies readonly SpecRow[];

interface TriadCard {
  number: string;
  title: string;
  badge: string;
  description: string;
  spec: string;
}

const ARCHITECTURE_TRIAD = [
  {
    number: "01",
    title: "40mm Graphene Foil",
    badge: "Transducer",
    description: "Electro-deposited monolayer graphene matrix. Zero flex breakup across the audible range with immediate transient recovery.",
    spec: "10 Hz - 42 kHz",
  },
  {
    number: "02",
    title: "Dual Neodymium Ring",
    badge: "Flux Core",
    description: "Symmetrical magnetic motor circuit delivering uniform coil push-pull motion with total harmonic distortion below 0.02%.",
    spec: "1.42 Tesla Flux",
  },
  {
    number: "03",
    title: "Titanium Gimbal Arm",
    badge: "Chassis",
    description: "Milled billet arms with internal silicon damping pads. Eliminates headband resonance and transmits zero handling noise.",
    spec: "Grade 5 Alloy",
  },
] as const satisfies readonly TriadCard[];

interface PackageItem {
  name: string;
  detail: string;
  code: string;
}

const PACKAGE_ITEMS = [
  { name: "Aura Sound Pro Reference Monitor", detail: "Individually serialized and acoustic response certified", code: "ASP-01" },
  { name: "3.0m Oxygen-Free Silver-Plated Cable", detail: "3.5mm dual-entry with locking collar to 6.35mm gold adapter", code: "CBL-30" },
  { name: "1.2m Portable Low-Impedance Interconnect", detail: "Shielded straight cable with 3.5mm gold termination", code: "CBL-12" },
  { name: "CNC Aluminum Hard Flight Transport Case", detail: "Custom laser-cut EVA foam interior with pressure-relief valve", code: "CSE-FL" },
  { name: "Individually Calibrated Frequency Certificate", detail: "Printed serial chart with measured left/right driver match", code: "DOC-QC" },
] as const satisfies readonly PackageItem[];

function findNearestScroller(el: HTMLElement | null): HTMLElement | Window {
  let curr = el?.parentElement;
  while (curr) {
    const s = window.getComputedStyle(curr);
    if (s.overflowY === "auto" || s.overflowY === "scroll") {
      return curr;
    }
    curr = curr.parentElement;
  }
  return window;
}

export default function AuraSoundProTemplate({
  theme = "dark",
  brandName = "AURA SOUND PRO",
  deviceMode = "desktop",
}: {
  theme?: string;
  brandName?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { theme, brandName };
  const prefersReducedMotion = useReducedMotion();

  const [localTheme, setLocalTheme] = useState<"dark" | "light">((config.theme as "dark" | "light") || "dark");
  useEffect(() => {
    if (config.theme) {
      setLocalTheme(config.theme as "dark" | "light");
    }
  }, [config.theme]);

  const isDark = localTheme === "dark";
  const colors = PALETTE[isDark ? "dark" : "light"];
  const brand = config.brandName || "AURA SOUND PRO";

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

  const [scrubProgress, setScrubProgress] = useState(0);
  const [activeFinish, setActiveFinish] = useState<string>("carbon-black");
  const [activeEq, setActiveEq] = useState<"flat" | "bass" | "vocal">("flat");
  const [copiedCli, setCopiedCli] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showcaseRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eqCanvasRef = useRef<HTMLCanvasElement>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [, setLoadedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let count = 0;

    const priorityIndices = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 237];
    const remainingIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!priorityIndices.includes(i)) remainingIndices.push(i);
    }
    const loadSequence = [...priorityIndices, ...remainingIndices];

    loadSequence.forEach((idx) => {
      const pad = String(idx + 1).padStart(3, "0");
      const img = new Image();
      img.decoding = "async";
      img.src = \`/videos/frames/frame_\${pad}.jpg\`;
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
  }, []);

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

      if (Math.abs(p - lastReportedProgressRef.current) > 0.006 || p === 0 || p === 1) {
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

  useEffect(() => {
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const drawEq = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      const gridFrequencies = [0.15, 0.35, 0.6, 0.85];
      gridFrequencies.forEach((xFrac) => {
        ctx.beginPath();
        ctx.moveTo(xFrac * w, 0);
        ctx.lineTo(xFrac * w, h);
        ctx.stroke();
      });

      const gridDb = [0.25, 0.5, 0.75];
      gridDb.forEach((yFrac) => {
        ctx.beginPath();
        ctx.moveTo(0, yFrac * h);
        ctx.lineTo(w, yFrac * h);
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;

      for (let x = 0; x <= w; x += 3) {
        const normX = x / w;
        let baseline = h * 0.5;

        if (activeEq === "flat") {
          baseline += Math.sin(normX * 8 + t) * 1.5;
        } else if (activeEq === "bass") {
          if (normX < 0.4) {
            baseline -= (1 - normX / 0.4) * 26;
          }
          baseline += Math.sin(normX * 10 + t) * 1.8;
        } else if (activeEq === "vocal") {
          if (normX > 0.35 && normX < 0.75) {
            const midProgress = Math.sin(((normX - 0.35) / 0.4) * Math.PI);
            baseline -= midProgress * 20;
          }
          baseline += Math.sin(normX * 9 + t) * 1.4;
        }

        if (x === 0) {
          ctx.moveTo(x, baseline);
        } else {
          ctx.lineTo(x, baseline);
        }
      }
      ctx.stroke();

      animId = requestAnimationFrame(drawEq);
    };

    animId = requestAnimationFrame(drawEq);
    return () => cancelAnimationFrame(animId);
  }, [activeEq, colors]);

  const activeChapterIndex = useMemo(() => {
    if (scrubProgress < 0.25) return 0;
    if (scrubProgress < 0.52) return 1;
    if (scrubProgress < 0.78) return 2;
    return 3;
  }, [scrubProgress]);

  const currentChapter = CHAPTERS[activeChapterIndex];

  const handleSelectChapter = useCallback((index: number) => {
    const chapter = CHAPTERS[index];
    if (!chapter) return;
    targetProgressRef.current = chapter.targetProgress;
    setScrubProgress(chapter.targetProgress);

    const el = showcaseRef.current;
    if (!el) return;
    const scroller = findNearestScroller(el);
    const viewH = scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
    const totalTravel = el.offsetHeight - viewH;
    const destOffset = totalTravel * chapter.targetProgress;

    if (scroller === window) {
      const topPos = el.offsetTop + destOffset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    } else {
      (scroller as HTMLElement).scrollTo({ top: destOffset, behavior: "smooth" });
    }
  }, []);

  const handleCopyCli = useCallback(() => {
    navigator.clipboard.writeText("npx nexoreui add template-aura-sound-pro");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const currentRotationDegrees = Math.round(scrubProgress * 360);

  return (
    <div
      ref={rootRef}
      className="w-full min-h-screen select-none overflow-x-clip transition-colors duration-200"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: FONT_SPACE_GROTESK,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
      />

      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200"
        style={{
          backgroundColor: isDark ? "rgba(12, 13, 12, 0.94)" : "rgba(244, 246, 241, 0.94)",
          borderColor: colors.line,
        }}
      >
        <div className="max-w-[1180px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
                fontFamily: FONT_SPACE_MONO,
              }}
            >
              ASP
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-xs sm:text-sm tracking-wide uppercase"
                style={{ color: colors.text, fontFamily: FONT_SPACE_GROTESK }}
              >
                {brand}
              </span>
              <span
                className="text-[10px] tracking-wider uppercase"
                style={{ color: colors.muted, fontFamily: FONT_SPACE_MONO }}
              >
                Reference Master Monitor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLocalTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className="p-2 border transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
                color: colors.text,
              }}
              aria-label="Toggle theme mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
                color: colors.text,
                fontFamily: FONT_SPACE_MONO,
              }}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit View" : "Exhibition"}</span>
            </button>

            <button
              onClick={handleCopyCli}
              className="flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
                color: colors.text,
                fontFamily: FONT_SPACE_MONO,
              }}
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Terminal className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedCli ? "Copied" : "CLI"}</span>
            </button>

            <a
              href="#order"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-opacity hover:opacity-90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
                fontFamily: FONT_SPACE_MONO,
              }}
            >
              <span>Order ASP-01</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      <section className="px-4 sm:px-6 pt-10 sm:pt-16 pb-8 max-w-[1180px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div
              className="text-xs uppercase tracking-widest font-bold"
              style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}
            >
              Acoustic Architecture Report ASP-2026
            </div>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02]"
              style={{ color: colors.text }}
            >
              40mm Graphene Diaphragm. 0.02% Distortion Floor.
            </h1>
            <p
              className="text-sm sm:text-base max-w-2xl leading-relaxed"
              style={{ color: colors.muted }}
            >
              Designed for mastering engineers who require surgical acoustic truth. Hand-assembled titanium gimbals,
              calibrated graphene foil transducers, and viscoelastic ear cushions provide uncolored spatial separation.
            </p>
          </div>

          <div
            className="lg:col-span-4 p-4 border flex flex-col gap-3"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
            }}
          >
            <div
              className="text-[11px] uppercase tracking-wider font-bold pb-2 border-b flex items-center justify-between"
              style={{ color: colors.muted, borderColor: colors.line, fontFamily: FONT_SPACE_MONO }}
            >
              <span>Bench Readout</span>
              <span style={{ color: colors.accent }}>IEC 60268-7</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ fontFamily: FONT_SPACE_MONO }}>
              <div>
                <div style={{ color: colors.muted }}>Bandwidth</div>
                <div className="font-bold text-sm" style={{ color: colors.text }}>10Hz - 42kHz</div>
              </div>
              <div>
                <div style={{ color: colors.muted }}>Impedance</div>
                <div className="font-bold text-sm" style={{ color: colors.text }}>32 Ohm</div>
              </div>
              <div>
                <div style={{ color: colors.muted }}>Sensitivity</div>
                <div className="font-bold text-sm" style={{ color: colors.text }}>106 dB/mW</div>
              </div>
              <div>
                <div style={{ color: colors.muted }}>Isolation</div>
                <div className="font-bold text-sm" style={{ color: colors.text }}>-26 dBA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={showcaseRef}
        className="relative w-full border-t border-b"
        style={{
          minHeight: isMobile ? "180vh" : "220vh",
          borderColor: colors.line,
        }}
      >
        <div className="sticky top-14 z-20 w-full" style={{ height: "calc(100vh - 3.5rem)" }}>
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 max-w-[1180px] mx-auto">
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: colors.line }}>
              <div className="flex items-center gap-2 text-xs" style={{ fontFamily: FONT_SPACE_MONO }}>
                <span className="font-bold" style={{ color: colors.accent }}>STAGE 360</span>
                <span style={{ color: colors.muted }}>|</span>
                <span style={{ color: colors.text }}>ROTATION: {currentRotationDegrees} DEG</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="hidden sm:inline text-xs uppercase"
                  style={{ color: colors.muted, fontFamily: FONT_SPACE_MONO }}
                >
                  Finish:
                </span>
                <div className="flex items-center gap-1.5 p-1 border" style={{ backgroundColor: colors.surface, borderColor: colors.line }}>
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFinish(f.id)}
                      className="w-4 h-4 border transition-all"
                      style={{
                        backgroundColor: f.hex,
                        borderColor: activeFinish === f.id ? colors.accent : colors.line,
                        outline: activeFinish === f.id ? \`2px solid \${colors.accent}\` : "none",
                      }}
                      title={\`\${f.name} (\${f.tag})\`}
                      aria-label={f.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex-1 w-full flex items-center justify-center my-2 overflow-hidden">
              <div className="relative w-full max-w-3xl aspect-[16/9] flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={540}
                  data-canvas-ok="canvas-ok: real-time 360-degree electro-acoustic driver sequence blit"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>

              <div
                className="absolute left-0 bottom-2 sm:bottom-6 max-w-[280px] sm:max-w-xs p-3.5 border backdrop-blur-md transition-all"
                style={{
                  backgroundColor: isDark ? "rgba(20, 22, 20, 0.9)" : "rgba(232, 235, 226, 0.9)",
                  borderColor: colors.line,
                }}
              >
                <div className="flex items-center gap-2 mb-1" style={{ fontFamily: FONT_SPACE_MONO }}>
                  <span className="font-bold text-xs" style={{ color: colors.accent }}>{currentChapter.step}</span>
                  <span className="text-[10px] uppercase" style={{ color: colors.muted }}>{currentChapter.category}</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm mb-1 leading-snug" style={{ color: colors.text }}>
                  {currentChapter.title}
                </h3>
                <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: colors.muted }}>
                  {currentChapter.description}
                </p>
                <div
                  className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px]"
                  style={{ borderColor: colors.line, fontFamily: FONT_SPACE_MONO }}
                >
                  <span style={{ color: colors.muted }}>{currentChapter.metricLabel}</span>
                  <span className="font-bold" style={{ color: colors.accent }}>{currentChapter.metric}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3" style={{ borderColor: colors.line }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectChapter(idx)}
                      className="p-2 sm:p-2.5 border text-left transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-2"
                      style={{
                        backgroundColor: isActive ? colors.surfaceRaised : colors.surface,
                        borderColor: isActive ? colors.accent : colors.line,
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1" style={{ fontFamily: FONT_SPACE_MONO }}>
                        <span style={{ color: isActive ? colors.accent : colors.muted }}>{ch.step}</span>
                        <span style={{ color: colors.muted }}>{ch.metric}</span>
                      </div>
                      <div
                        className="text-xs font-bold truncate"
                        style={{ color: isActive ? colors.text : colors.muted }}
                      >
                        {ch.category}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1180px] mx-auto border-b" style={{ borderColor: colors.line }}>
        <div className="flex flex-col gap-3 mb-8">
          <div className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}>
            Acoustic Laboratory Measurement
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            Calibrated Frequency Spectrum
          </h2>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: colors.muted }}>
            Real-time harmonic response plotted from 20 Hz to 20,000 Hz. Switch tuning presets to observe the physical response of the graphene driver.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div
            className="lg:col-span-8 p-4 sm:p-5 border flex flex-col gap-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.line }}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.text, fontFamily: FONT_SPACE_MONO }}>
                  SPL Curve vs Frequency
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {EQ_PROFILES.map((eq) => {
                  const isCur = activeEq === eq.id;
                  return (
                    <button
                      key={eq.id}
                      onClick={() => setActiveEq(eq.id)}
                      className="px-2.5 py-1 text-xs border transition-colors focus-visible:outline-2"
                      style={{
                        backgroundColor: isCur ? colors.accent : colors.surfaceRaised,
                        color: isCur ? colors.accentInk : colors.text,
                        borderColor: isCur ? colors.accent : colors.line,
                        fontFamily: FONT_SPACE_MONO,
                      }}
                    >
                      {eq.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative w-full aspect-[2/1] sm:aspect-[2.4/1]">
              <canvas
                ref={eqCanvasRef}
                width={800}
                height={360}
                data-canvas-ok="live audio frequency response curve representation"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-4 text-center text-[11px] pt-2 border-t" style={{ borderColor: colors.line, color: colors.muted, fontFamily: FONT_SPACE_MONO }}>
              <div>20 Hz (Sub)</div>
              <div>200 Hz (Bass)</div>
              <div>2 kHz (Mids)</div>
              <div>20 kHz (Air)</div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            {EQ_PROFILES.map((eq) => {
              const isSelected = activeEq === eq.id;
              return (
                <div
                  key={eq.id}
                  onClick={() => setActiveEq(eq.id)}
                  className="p-4 border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? colors.surfaceRaised : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.line,
                  }}
                >
                  <div className="flex items-center justify-between mb-1" style={{ fontFamily: FONT_SPACE_MONO }}>
                    <span className="font-bold text-xs" style={{ color: isSelected ? colors.accent : colors.text }}>
                      {eq.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: colors.muted }}>
                      {eq.deviation}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                    {eq.curveNotes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1180px] mx-auto border-b" style={{ borderColor: colors.line }}>
        <div className="flex flex-col gap-3 mb-10">
          <div className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}>
            Mechanical Breakdown
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            Engineering Architecture
          </h2>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: colors.muted }}>
            Three critical sub-assemblies machined to sub-micron tolerances for consistent studio performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {ARCHITECTURE_TRIAD.map((triad) => (
            <div
              key={triad.number}
              className="p-5 sm:p-6 border flex flex-col justify-between gap-6 transition-all hover:translate-y-[-2px]"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between" style={{ fontFamily: FONT_SPACE_MONO }}>
                  <span className="text-xs font-bold" style={{ color: colors.accent }}>{triad.number}</span>
                  <span
                    className="text-[10px] uppercase px-1.5 py-0.5 border"
                    style={{ borderColor: colors.line, color: colors.muted }}
                  >
                    {triad.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold" style={{ color: colors.text }}>
                  {triad.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.muted }}>
                  {triad.description}
                </p>
              </div>

              <div
                className="pt-3 border-t text-xs font-bold"
                style={{
                  borderColor: colors.line,
                  color: colors.accent,
                  fontFamily: FONT_SPACE_MONO,
                }}
              >
                SPEC: {triad.spec}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1180px] mx-auto border-b" style={{ borderColor: colors.line }}>
        <div className="flex flex-col gap-3 mb-8">
          <div className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}>
            Verified Lab Bench Ledger
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            Technical Specification Matrix
          </h2>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: colors.muted }}>
            Parameters calibrated per pair using reference acoustic couplers and precision swept sine analysis.
          </p>
        </div>

        <div className="border overflow-hidden" style={{ borderColor: colors.line, backgroundColor: colors.surface }}>
          <div className="divide-y" style={{ borderColor: colors.line }}>
            {SPECIFICATION_LEDGER.map((row, i) => (
              <div
                key={row.parameter}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-3.5 sm:p-4 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  backgroundColor: i % 2 === 0 ? "transparent" : colors.surfaceRaised,
                }}
              >
                <div className="sm:col-span-5 font-bold" style={{ color: colors.text }}>
                  {row.parameter}
                </div>
                <div
                  className="sm:col-span-4 font-bold"
                  style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}
                >
                  {row.measuredValue}
                </div>
                <div
                  className="sm:col-span-3 text-[11px]"
                  style={{ color: colors.muted, fontFamily: FONT_SPACE_MONO }}
                >
                  {row.standard}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="order"
        className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1180px] mx-auto border-b"
        style={{ borderColor: colors.line }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}>
                Studio Flight Case Bundle
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
                Included Package Architecture
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                Every monitor unit ships in an airtight aluminum transport flight case with individual calibration certificates.
              </p>
            </div>

            <div className="border divide-y" style={{ borderColor: colors.line, backgroundColor: colors.surface }}>
              {PACKAGE_ITEMS.map((item) => (
                <div key={item.code} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs sm:text-sm font-bold" style={{ color: colors.text }}>
                      {item.name}
                    </div>
                    <div className="text-xs" style={{ color: colors.muted }}>
                      {item.detail}
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 border shrink-0"
                    style={{
                      borderColor: colors.line,
                      color: colors.accent,
                      fontFamily: FONT_SPACE_MONO,
                    }}
                  >
                    {item.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="lg:col-span-5 p-6 border flex flex-col gap-6"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
            }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: colors.line }}>
              <div className="flex flex-col">
                <span className="text-xs uppercase" style={{ color: colors.muted, fontFamily: FONT_SPACE_MONO }}>
                  Serial Allocation
                </span>
                <span className="font-bold text-lg" style={{ color: colors.text }}>
                  Aura Sound Pro ASP-01
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase" style={{ color: colors.muted, fontFamily: FONT_SPACE_MONO }}>
                  Unit Price
                </span>
                <div className="text-xl font-bold" style={{ color: colors.accent, fontFamily: FONT_SPACE_MONO }}>
                  $449 USD
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs" style={{ fontFamily: FONT_SPACE_MONO }}>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.muted }}>Finish Selection:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {FINISHES.find((f) => f.id === activeFinish)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.muted }}>Acoustic Matching:</span>
                <span className="font-bold" style={{ color: colors.text }}>± 0.3 dB Left/Right</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.muted }}>Dispatch Lead:</span>
                <span className="font-bold" style={{ color: colors.text }}>Within 48 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: colors.muted }}>Warranty Autonomy:</span>
                <span className="font-bold" style={{ color: colors.text }}>3 Years Studio Support</span>
              </div>
            </div>

            <button
              onClick={() => alert("Pre-order reservation initiated for Aura Sound Pro.")}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 active:scale-98 focus-visible:outline-2"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
                fontFamily: FONT_SPACE_MONO,
              }}
            >
              Reserve Calibration Unit
            </button>

            <div className="text-[11px] text-center" style={{ color: colors.muted }}>
              Includes tracked worldwide courier delivery with acoustic test reports.
            </div>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-12 max-w-[1180px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b" style={{ borderColor: colors.line }}>
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 flex items-center justify-center font-bold text-[10px]"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
                fontFamily: FONT_SPACE_MONO,
              }}
            >
              A
            </div>
            <span className="font-bold text-xs uppercase" style={{ color: colors.text, fontFamily: FONT_SPACE_MONO }}>
              {brand} Electro-Acoustics
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 border text-xs"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
              fontFamily: FONT_SPACE_MONO,
            }}
          >
            <span style={{ color: colors.muted }}>CLI:</span>
            <span style={{ color: colors.text }}>npx nexoreui add template-aura-sound-pro</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs" style={{ color: colors.muted }}>
          <div>
            Calibrated studio reference monitors. All specifications measured on calibrated artificial ear simulator.
          </div>
          <div style={{ fontFamily: FONT_SPACE_MONO }}>
            Copyright 2026 NexoreUI Pro.
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};
