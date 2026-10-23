"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  Copy,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Thermometer,
  Plus,
  Minus,
  ArrowUpRight,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FONT = {
  sans: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
};

const PALETTE = {
  light: {
    bg: "#ffffff",
    surface: "#fafafa",
    surfaceRaised: "#f4f4f5",
    line: "#e4e4e7",
    text: "#09090b",
    muted: "#71717a",
    accent: "#18181b",
    accentInk: "#fafafa",
    badge: "#059669",
  },
  dark: {
    bg: "#09090b",
    surface: "#121215",
    surfaceRaised: "#18181b",
    line: "#27272a",
    text: "#fafafa",
    muted: "#a1a1aa",
    accent: "#fafafa",
    accentInk: "#09090b",
    badge: "#10b981",
  },
};

const MOTION = {
  spring: { type: "spring", stiffness: 180, damping: 28, mass: 1 },
  ease: [0.16, 1, 0.3, 1] as const,
  durationSlow: 0.7,
  durationNormal: 0.45,
  durationFast: 0.2,
};

type BlendKey = "zen-jade" | "amber-reserve" | "highland-orchid";
type BottleSize = "375" | "750";

interface BotanicalBlend {
  id: BlendKey;
  name: string;
  cultivar: string;
  origin: string;
  elevation: string;
  harvest: string;
  extractionHours: string;
  temp: string;
  theanine: string;
  palate: string[];
  summary: string;
}

const BLENDS: Record<BlendKey, BotanicalBlend> = {
  "zen-jade": {
    id: "zen-jade",
    name: "Zen Jade Ceremonial",
    cultivar: "Shade-Grown Uji Gyokuro & White Peach Blossom",
    origin: "Uji Terroir, Kyoto",
    elevation: "320m valley slope",
    harvest: "First Flush Spring",
    extractionHours: "22 Hours",
    temp: "1.8 deg C",
    theanine: "168 mg",
    palate: ["Steamed sencha leaf", "White peach blossom", "Ocean umami", "Sweet dew"],
    summary:
      "Deep savory density with vibrant chlorophyll resonance, extracted at sub-zero temperatures to preserve calm mental clarity.",
  },
  "amber-reserve": {
    id: "amber-reserve",
    name: "Golden Amber Reserve",
    cultivar: "Wuyi Rock Oolong & Cryo-Macerated Mountain Jasmine",
    origin: "Wuyi Cliffs, Fujian",
    elevation: "1,200m rocky ridge",
    harvest: "Autumn Flush",
    extractionHours: "18 Hours",
    temp: "2.2 deg C",
    theanine: "142 mg",
    palate: ["Wildflower honey", "Dry cedarwood", "Mountain jasmine", "Amber caustics"],
    summary:
      "Rich amber liqueur bearing roasted stone fruit character and mountain floral sweetness that lingers cleanly on the palate.",
  },
  "highland-orchid": {
    id: "highland-orchid",
    name: "Highland Orchid",
    cultivar: "Alishan High Mountain Oolong & Alpine Osmanthus",
    origin: "Mount Ali Alpine Belt, Chiayi",
    elevation: "1,450m cloud forest",
    harvest: "Spring Solstice",
    extractionHours: "20 Hours",
    temp: "2.0 deg C",
    theanine: "154 mg",
    palate: ["Osmanthus petals", "Crushed river stones", "Mountain mist", "Crisp apricot"],
    summary:
      "Luminous pale gold infusion with high-altitude floral aromatics and a refreshing, persistent finish.",
  },
};

interface TimelineStage {
  step: string;
  title: string;
  duration: string;
  temperature: string;
  description: string;
}

const TIMELINE_STAGES: TimelineStage[] = [
  {
    step: "01",
    title: "Alpine Shade Harvest",
    duration: "Daybreak hand-pick",
    temperature: "14 deg C field temp",
    description:
      "First-flush tender terminal buds shade-grown for twenty-one days to maximize endogenous L-theanine and chlorophyll concentration.",
  },
  {
    step: "02",
    title: "Sub-Zero Cryo-Infusion",
    duration: "18 to 22 Hours",
    temperature: "1.8 deg C to 2.2 deg C",
    description:
      "Whole unbroken leaf tissue immersed in alpine spring water under pressurized chilled circulation, extracting aromatic esters without astringency.",
  },
  {
    step: "03",
    title: "Quartz Sediment Clarification",
    duration: "Continuous gravity flow",
    temperature: "2.0 deg C steady",
    description:
      "Passive decantation through fine quartz sand and triple-washed plant cellulose filters, yielding pure crystalline transparency.",
  },
  {
    step: "04",
    title: "Hermetic Mineral Bottling",
    duration: "Immediate inert seal",
    temperature: "4.0 deg C chilled storage",
    description:
      "Transferred into heavy ultraviolet-filtering mineral glass decanters with nitrogen head-space flush to prevent oxidative flavor degradation.",
  },
];

interface SpecRow {
  label: string;
  metric: string;
  detail: string;
}

const SPECIFICATIONS: SpecRow[] = [
  {
    label: "Extraction Architecture",
    metric: "Sub-zero continuous cold maceration",
    detail: "Preserves volatile terpene compounds degraded by heated brewing methods.",
  },
  {
    label: "Bioactive Compound Retention",
    metric: "168 mg per 250 ml",
    detail: "High-concentration L-theanine promoting measured, sustained cognitive composure.",
  },
  {
    label: "Tannin Extraction Profile",
    metric: "Below 0.04 percent dry weight",
    detail: "Zero astringency or bitter finish, eliminating the need for sweetener additions.",
  },
  {
    label: "Carrier Water Source",
    metric: "Natural alpine mineral spring",
    detail: "Soft mineral profile (pH 7.2, TDS 42 ppm) balanced for optimal tea ester extraction.",
  },
  {
    label: "Decanter Enclosure",
    metric: "375 ml / 750 ml violet glass",
    detail: "Blocks light spectrum from 400 nm to 750 nm to inhibit photo-oxidation.",
  },
  {
    label: "Storage Recommendation",
    metric: "Keep chilled at 2 to 6 deg C",
    detail: "Consume within thirty days of bottling seal release for peak aromatic vibrancy.",
  },
];

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = window.getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

export function ZenithElixirPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const shouldReduceMotion = useReducedMotion();

  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | null>(null);
  const currentTheme = themeOverride ?? (config.theme === "dark" ? "dark" : "light");
  const isDark = currentTheme === "dark";
  const colors = isDark ? PALETTE.dark : PALETTE.light;

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [activeBlend, setActiveBlend] = useState<BlendKey>("zen-jade");
  const [activeSize, setActiveSize] = useState<BottleSize>("375");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);

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
  const isDesktop = !isMobile && !isTablet;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = findScroller(root);
    const target = scroller || window;

    const handleScroll = () => {
      let currentTop = 0;
      let scrollHeight = 1;

      if (scroller) {
        currentTop = scroller.scrollTop;
        scrollHeight = scroller.scrollHeight - scroller.clientHeight;
      } else {
        currentTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      }

      const p = scrollHeight > 0 ? Math.min(1, Math.max(0, currentTop / scrollHeight)) : 0;
      setScrollProgress(p);

      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const scrollerTop = scroller ? scroller.getBoundingClientRect().top : 0;
        const relativeTop = rect.top - scrollerTop;
        const totalDist = window.innerHeight + rect.height;
        const raw = (window.innerHeight - relativeTop) / totalDist;
        setTimelineProgress(Math.min(1, Math.max(0, raw)));
      }
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  const copyCli = () => {
    navigator.clipboard.writeText("npx nexoreui add template-zenith-elixir-pro");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReserve = () => {
    setIsReserved(true);
    setTimeout(() => setIsReserved(false), 3600);
  };

  const unitPrice = activeSize === "375" ? 38 : 64;
  const totalPrice = unitPrice * quantity;
  const currentBlend = BLENDS[activeBlend];

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip transition-colors duration-300 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-black"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: FONT.sans,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
      />

      <div
        className="fixed top-0 left-0 right-0 h-[1px] z-50 pointer-events-none transition-all"
        style={{
          backgroundColor: colors.accent,
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "0% 50%",
        }}
      />

      <header
        className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
        style={{
          borderColor: colors.line,
          backgroundColor: isDark ? "rgba(9, 9, 11, 0.85)" : "rgba(255, 255, 255, 0.85)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <span className="font-mono text-xs uppercase tracking-wider">
              {config.brandName || "ZENITH ELIXIR"}
            </span>
          </a>

          {!isMobile && (
            <nav className="flex items-center gap-6 text-xs font-medium tracking-normal">
              <a
                href="#manifesto"
                className="transition-colors hover:text-foreground"
                style={{ color: colors.muted }}
              >
                Philosophy
              </a>
              <a
                href="#timeline"
                className="transition-colors hover:text-foreground"
                style={{ color: colors.muted }}
              >
                Extraction
              </a>
              <a
                href="#blends"
                className="transition-colors hover:text-foreground"
                style={{ color: colors.muted }}
              >
                Formulations
              </a>
              <a
                href="#specifications"
                className="transition-colors hover:text-foreground"
                style={{ color: colors.muted }}
              >
                Specs
              </a>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeOverride(isDark ? "light" : "dark")}
              className="flex items-center justify-center w-8 h-8 rounded-md border transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              style={{
                borderColor: colors.line,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <a
              href="#reserve"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium tracking-normal transition-all hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 shadow-sm"
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

      <main className="w-full">
        <section id="hero" className="w-full relative overflow-hidden">
          <div
            className={`relative w-full overflow-hidden ${
              isMobile ? "h-[220px]" : isTablet ? "h-[340px]" : "h-[460px]"
            }`}
          >
            <video
              ref={videoRef}
              src="/videos/zenith-tea-elixir.mp4"
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
              className="w-full h-full object-cover scale-[1.03] filter contrast-[1.04] brightness-[0.95] pointer-events-none select-none"
              style={{ pointerEvents: "none" }}
            />

            <div
              className="absolute inset-0 select-none z-10"
              style={{
                background: isDark
                  ? "linear-gradient(to bottom, rgba(9, 9, 11, 0.4) 0%, transparent 25%, transparent 60%, rgba(9, 9, 11, 0.8) 85%, #09090b 100%), radial-gradient(ellipse 90% 75% at 50% 50%, transparent 45%, rgba(9, 9, 11, 0.5) 85%, #09090b 100%)"
                  : "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 25%, transparent 60%, rgba(255, 255, 255, 0.8) 85%, #ffffff 100%), radial-gradient(ellipse 90% 75% at 50% 50%, transparent 45%, rgba(255, 255, 255, 0.5) 85%, #ffffff 100%)",
              }}
            />
          </div>

          <div
            className={`w-full max-w-4xl mx-auto px-4 relative z-10 text-center ${
              isMobile ? "-mt-8 pb-10" : isTablet ? "-mt-12 pb-16" : "-mt-16 pb-20"
            }`}
          >
            <div className="flex flex-col items-center max-w-2xl mx-auto">
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.durationSlow, ease: MOTION.ease }}
                className={`font-semibold tracking-[-0.04em] mb-3 text-balance ${
                  isMobile ? "text-2xl leading-snug" : isTablet ? "text-4xl leading-tight" : "text-5xl leading-tight"
                }`}
              >
                Botanical purity brewed at two degrees.
              </motion.h1>

              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.durationNormal, ease: MOTION.ease, delay: 0.1 }}
                className={`leading-relaxed max-w-xl mx-auto mb-6 ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
                style={{ color: colors.muted }}
              >
                Cold-macerated whole leaf botanicals distilled over eighteen hours in alpine spring water. Formulated without heat degradation, artificial flavors, or added cane sugars.
              </motion.p>

              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.durationFast, ease: MOTION.ease, delay: 0.2 }}
                className={`flex items-center justify-center gap-2.5 mx-auto ${
                  isMobile ? "flex-col w-full max-w-xs" : "flex-row w-auto"
                }`}
              >
                <a
                  href="#reserve"
                  className={`inline-flex items-center justify-center rounded-md text-xs font-medium tracking-normal transition-all hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 shadow-sm ${
                    isMobile ? "w-full py-2.5" : "px-4 py-2"
                  }`}
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.accentInk,
                  }}
                >
                  <span>Reserve decanter</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>

                <a
                  href="#timeline"
                  className={`inline-flex items-center justify-center rounded-md text-xs font-medium tracking-normal border transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                    isMobile ? "w-full py-2.5" : "px-4 py-2"
                  }`}
                  style={{
                    borderColor: colors.line,
                    backgroundColor: colors.surface,
                    color: colors.text,
                  }}
                >
                  Extraction process
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="manifesto"
          className={`w-full max-w-4xl mx-auto px-4 border-t ${
            isMobile ? "py-10" : isTablet ? "py-14" : "py-20"
          }`}
          style={{ borderColor: colors.line }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className={`font-semibold tracking-[-0.035em] mb-4 ${
                isMobile ? "text-xl leading-snug" : isTablet ? "text-2xl" : "text-3xl"
              }`}
            >
              Heat oxidizes delicate plant terpenes. We distill in ice.
            </h2>
            <div
              className={`space-y-3 leading-relaxed ${isMobile ? "text-xs" : "text-sm"}`}
              style={{ color: colors.muted }}
            >
              <p>
                Standard hot infusion scalds active phytochemicals, triggering rapid oxidation that releases astringent bitter tannins while boiling off high-register floral volatiles.
              </p>
              <p>
                Zenith inverts the traditional tea ceremony. By maintaining constant sub-zero circulation between 1.8 and 2.2 degrees Celsius for up to twenty-two hours, alpine spring water gently coaxes sweet amino acids and intact catechins without disrupting the physical structure of unbroken leaf tissue.
              </p>
              <p>
                The resulting elixir exhibits pure clarity, natural sweetness, and a restorative concentration of bioavailable L-theanine.
              </p>
            </div>

            <div
              className={`mt-6 rounded-xl border ${isMobile ? "p-4" : "p-5"}`}
              style={{
                borderColor: colors.line,
                backgroundColor: colors.surface,
              }}
            >
              <div className={`grid ${isMobile ? "grid-cols-1 gap-3.5" : "grid-cols-3 gap-6"} text-left`}>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: colors.muted }}>
                    Extraction Temp
                  </span>
                  <p className="text-lg font-semibold tracking-tight">
                    1.8 - 2.2 deg C
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: colors.muted }}>
                    Maceration Span
                  </span>
                  <p className="text-lg font-semibold tracking-tight">
                    18 - 22 Hours
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: colors.muted }}>
                    Bioactive L-Theanine
                  </span>
                  <p className="text-lg font-semibold tracking-tight">
                    168 mg / serving
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="timeline"
          ref={timelineRef}
          className={`w-full max-w-4xl mx-auto px-4 border-t ${
            isMobile ? "py-10" : isTablet ? "py-14" : "py-20"
          }`}
          style={{ borderColor: colors.line }}
        >
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2
              className={`font-semibold tracking-[-0.035em] mb-2 ${
                isMobile ? "text-xl leading-snug" : isTablet ? "text-2xl" : "text-3xl"
              }`}
            >
              The cold-infusion timeline
            </h2>
            <p className="text-xs" style={{ color: colors.muted }}>
              Four uninterrupted stages from high-altitude shade garden harvest to hermetic inert bottling.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className={`absolute ${isMobile ? "left-4" : "left-5"} top-4 bottom-4 w-[1px]`}>
              <div className="w-full h-full" style={{ backgroundColor: colors.line }} />
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{
                  backgroundColor: colors.accent,
                  height: shouldReduceMotion ? "100%" : `${Math.min(100, Math.max(0, timelineProgress * 120))}%`,
                }}
              />
            </div>

            <div className="space-y-6 relative">
              {TIMELINE_STAGES.map((stage, idx) => {
                const threshold = (idx + 0.3) / TIMELINE_STAGES.length;
                const isPassed = shouldReduceMotion || timelineProgress >= threshold;

                return (
                  <motion.div
                    key={stage.step}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: MOTION.durationNormal, ease: MOTION.ease }}
                    className={`flex items-start ${isMobile ? "gap-3" : "gap-5"}`}
                  >
                    <div
                      className={`relative z-10 flex items-center justify-center rounded-lg border shrink-0 transition-colors duration-300 font-mono text-xs font-semibold ${
                        isMobile ? "w-8 h-8 text-[11px]" : "w-10 h-10"
                      }`}
                      style={{
                        borderColor: isPassed ? colors.accent : colors.line,
                        backgroundColor: isPassed ? colors.surfaceRaised : colors.surface,
                        color: isPassed ? colors.text : colors.muted,
                      }}
                    >
                      {stage.step}
                    </div>

                    <div
                      className={`flex-1 rounded-xl border transition-all ${
                        isMobile ? "p-3.5" : "p-5"
                      }`}
                      style={{
                        borderColor: colors.line,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                        <h3 className={`font-semibold tracking-tight ${isMobile ? "text-sm" : "text-base"}`}>
                          {stage.title}
                        </h3>
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                          style={{
                            borderColor: colors.line,
                            backgroundColor: colors.surfaceRaised,
                            color: colors.muted,
                          }}
                        >
                          {stage.temperature}
                        </span>
                      </div>

                      <p className="font-mono text-[11px] mb-2" style={{ color: colors.muted }}>
                        {stage.duration}
                      </p>

                      <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="blends"
          className={`w-full max-w-4xl mx-auto px-4 border-t ${
            isMobile ? "py-10" : isTablet ? "py-14" : "py-20"
          }`}
          style={{ borderColor: colors.line }}
        >
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2
              className={`font-semibold tracking-[-0.035em] mb-2 ${
                isMobile ? "text-xl leading-snug" : isTablet ? "text-2xl" : "text-3xl"
              }`}
            >
              Cold botanical formulations
            </h2>
            <p className="text-xs" style={{ color: colors.muted }}>
              Distinct botanical profiles calibrated for calm wakefulness, digestive ease, and aromatic richness.
            </p>
          </div>

          <div
            className={`inline-flex p-1 rounded-lg border max-w-full overflow-x-auto mb-6 ${
              isMobile ? "w-full justify-start" : "justify-center"
            }`}
            style={{
              borderColor: colors.line,
              backgroundColor: colors.surfaceRaised,
            }}
          >
            {(Object.keys(BLENDS) as BlendKey[]).map((key) => {
              const b = BLENDS[key];
              const isSelected = activeBlend === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveBlend(key)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 shrink-0 ${
                    isMobile ? "flex-1 text-center" : ""
                  }`}
                  style={{
                    color: isSelected ? colors.text : colors.muted,
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="active-blend-pill"
                      className="absolute inset-0 rounded-md border shadow-sm"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.line,
                      }}
                      transition={MOTION.spring}
                    />
                  )}
                  <span className="relative z-10">{isMobile ? b.name.split(" ")[0] : b.name}</span>
                </button>
              );
            })}
          </div>

          <div
            className={`rounded-xl border transition-all ${isMobile ? "p-4" : "p-6"}`}
            style={{
              borderColor: colors.line,
              backgroundColor: colors.surface,
            }}
          >
            <div className={`grid ${isMobile || isTablet ? "grid-cols-1 gap-5" : "grid-cols-12 gap-8"} items-start`}>
              <div className={isMobile || isTablet ? "w-full" : "col-span-7"}>
                <h3 className={`font-semibold tracking-[-0.035em] mb-2 ${isMobile ? "text-lg" : "text-2xl"}`}>
                  {currentBlend.name}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: colors.muted }}>
                  {currentBlend.summary}
                </p>

                <div className="mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-wider block mb-2" style={{ color: colors.muted }}>
                    Palate Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentBlend.palate.map((note) => (
                      <span
                        key={note}
                        className="px-2 py-0.5 rounded-md text-xs font-medium border"
                        style={{
                          borderColor: colors.line,
                          backgroundColor: colors.surfaceRaised,
                          color: colors.text,
                        }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`pt-4 border-t grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 gap-4"}`} style={{ borderColor: colors.line }}>
                  <div>
                    <span className="font-mono text-[10px] block" style={{ color: colors.muted }}>L-Theanine</span>
                    <span className="text-xs font-semibold">{currentBlend.theanine}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] block" style={{ color: colors.muted }}>Infusion</span>
                    <span className="text-xs font-semibold">{currentBlend.extractionHours}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] block" style={{ color: colors.muted }}>Temperature</span>
                    <span className="text-xs font-semibold">{currentBlend.temp}</span>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg border space-y-2.5 ${isMobile || isTablet ? "w-full p-4" : "col-span-5 p-5"}`}
                style={{
                  borderColor: colors.line,
                  backgroundColor: colors.surfaceRaised,
                }}
              >
                <h4 className="font-mono text-[10px] uppercase tracking-wider" style={{ color: colors.text }}>
                  Provenance Specs
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-0.5 border-b" style={{ borderColor: colors.line }}>
                    <span style={{ color: colors.muted }}>Cultivar</span>
                    <span className="font-medium text-right max-w-[170px]">{currentBlend.cultivar}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b" style={{ borderColor: colors.line }}>
                    <span style={{ color: colors.muted }}>Origin</span>
                    <span className="font-medium">{currentBlend.origin}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b" style={{ borderColor: colors.line }}>
                    <span style={{ color: colors.muted }}>Elevation</span>
                    <span className="font-medium">{currentBlend.elevation}</span>
                  </div>
                  <div className="flex justify-between py-0.5" style={{ borderColor: colors.line }}>
                    <span style={{ color: colors.muted }}>Harvest</span>
                    <span className="font-medium">{currentBlend.harvest}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#reserve"
                    className="w-full inline-flex items-center justify-center py-2 rounded-md text-xs font-medium tracking-normal transition-all hover:opacity-90 active:scale-95 shadow-sm"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.accentInk,
                    }}
                  >
                    Select formulation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="specifications"
          className={`w-full max-w-4xl mx-auto px-4 border-t ${
            isMobile ? "py-10" : isTablet ? "py-14" : "py-20"
          }`}
          style={{ borderColor: colors.line }}
        >
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2
              className={`font-semibold tracking-[-0.035em] mb-2 ${
                isMobile ? "text-xl leading-snug" : isTablet ? "text-2xl" : "text-3xl"
              }`}
            >
              Extraction ledger
            </h2>
            <p className="text-xs" style={{ color: colors.muted }}>
              Measured physical standards and chemical analysis of cold-macerated botanical batches.
            </p>
          </div>

          <div className="rounded-xl border divide-y overflow-hidden" style={{ borderColor: colors.line }}>
            {SPECIFICATIONS.map((spec) => (
              <div
                key={spec.label}
                className={`p-3.5 transition-colors flex ${
                  isMobile ? "flex-col gap-1 text-left" : "flex-row items-center justify-between gap-4"
                }`}
                style={{ backgroundColor: colors.surface }}
              >
                <div className={isMobile ? "w-full" : "w-1/3"}>
                  <span className="font-mono text-[10px] uppercase tracking-wider block" style={{ color: colors.muted }}>
                    {spec.label}
                  </span>
                </div>
                <div className={isMobile ? "w-full" : "w-1/3"}>
                  <span className="text-xs font-semibold">
                    {spec.metric}
                  </span>
                </div>
                <div className={isMobile ? "w-full" : "w-1/3"}>
                  <span className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                    {spec.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="reserve"
          className={`w-full max-w-4xl mx-auto px-4 border-t ${
            isMobile ? "py-10" : isTablet ? "py-14" : "py-20"
          }`}
          style={{ borderColor: colors.line }}
        >
          <div className={`grid ${isMobile || isTablet ? "grid-cols-1 gap-6" : "grid-cols-12 gap-8"} items-start`}>
            <div className={isMobile || isTablet ? "w-full" : "col-span-6"}>
              <h2
                className={`font-semibold tracking-[-0.035em] mb-2 ${
                  isMobile ? "text-xl leading-snug" : "text-2xl sm:text-3xl"
                }`}
              >
                Reserve harvest allotment
              </h2>
              <p className="text-xs leading-relaxed mb-4" style={{ color: colors.muted }}>
                Every flacon is hand-filled under sterile nitrogen flow, numbered by bottling date, and dispatched in insulated cold containers.
              </p>

              <div
                className="p-3.5 rounded-xl border mb-4 space-y-2"
                style={{
                  borderColor: colors.line,
                  backgroundColor: colors.surface,
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: colors.muted }}>
                  <span>CLI Command</span>
                  <span>Standalone component</span>
                </div>
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <code className="text-xs font-mono truncate" style={{ color: colors.text }}>
                    npx nexoreui add template-zenith-elixir-pro
                  </code>
                  <button
                    type="button"
                    onClick={copyCli}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono shrink-0 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    style={{
                      borderColor: colors.line,
                      backgroundColor: colors.surfaceRaised,
                      color: colors.text,
                    }}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs" style={{ color: colors.muted }}>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[11px]">UV-filtered glass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Cold transit</span>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl border shadow-sm ${
                isMobile || isTablet ? "w-full p-4" : "col-span-6 p-6"
              }`}
              style={{
                borderColor: colors.line,
                backgroundColor: colors.surface,
              }}
            >
              <div className="mb-4">
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: colors.muted }}>
                  Formulation
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(BLENDS) as BlendKey[]).map((key) => {
                    const b = BLENDS[key];
                    const isSelected = activeBlend === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveBlend(key)}
                        className="py-1.5 px-1 rounded-md text-xs font-medium border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 truncate"
                        style={{
                          borderColor: isSelected ? colors.accent : colors.line,
                          backgroundColor: isSelected ? colors.surfaceRaised : "transparent",
                          color: isSelected ? colors.text : colors.muted,
                        }}
                      >
                        {b.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: colors.muted }}>
                  Decanter Volume
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSize("375")}
                    className="p-2.5 rounded-md border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    style={{
                      borderColor: activeSize === "375" ? colors.accent : colors.line,
                      backgroundColor: activeSize === "375" ? colors.surfaceRaised : "transparent",
                    }}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-semibold">375 ml</span>
                      <span className="text-xs font-mono font-semibold">$38</span>
                    </div>
                    <span className="text-[10px] block" style={{ color: colors.muted }}>Single reserve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSize("750")}
                    className="p-2.5 rounded-md border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    style={{
                      borderColor: activeSize === "750" ? colors.accent : colors.line,
                      backgroundColor: activeSize === "750" ? colors.surfaceRaised : "transparent",
                    }}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-semibold">750 ml</span>
                      <span className="text-xs font-mono font-semibold">$64</span>
                    </div>
                    <span className="text-[10px] block" style={{ color: colors.muted }}>Grand allocation</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: colors.muted }}>
                  Allocation Quantity
                </label>
                <div className="flex items-center justify-between p-2 rounded-md border" style={{ borderColor: colors.line }}>
                  <span className="text-xs" style={{ color: colors.muted }}>Decanters (Max 6)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded border flex items-center justify-center transition-colors disabled:opacity-40"
                      style={{ borderColor: colors.line, color: colors.text }}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-mono font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(6, q + 1))}
                      disabled={quantity >= 6}
                      className="w-7 h-7 rounded border flex items-center justify-center transition-colors disabled:opacity-40"
                      style={{ borderColor: colors.line, color: colors.text }}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t mb-4 space-y-1" style={{ borderColor: colors.line }}>
                <div className="flex justify-between text-xs" style={{ color: colors.muted }}>
                  <span className="truncate max-w-[200px]">{currentBlend.name} ({activeSize}ml x {quantity})</span>
                  <span className="font-mono">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: colors.muted }}>
                  <span>Cold Packaging</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-1.5 border-t" style={{ borderColor: colors.line }}>
                  <span>Total</span>
                  <span className="font-mono">${totalPrice}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserve}
                disabled={isReserved}
                className="w-full py-2.5 rounded-md text-xs font-medium tracking-normal transition-all hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 shadow-sm flex items-center justify-center"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                <AnimatePresence mode="wait">
                  {isReserved ? (
                    <motion.span
                      key="reserved"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Reservation Confirmed</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                    >
                      Complete Decanter Reservation
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="colophon"
        className={`w-full border-t transition-colors ${
          isMobile ? "py-8 px-4" : "py-12 px-4 sm:px-6"
        }`}
        style={{
          borderColor: colors.line,
          backgroundColor: colors.surface,
        }}
      >
        <div className={`max-w-4xl mx-auto flex ${isMobile ? "flex-col gap-6" : "flex-row items-start justify-between gap-6"}`}>
          <div className={isMobile ? "w-full" : "max-w-xs"}>
            <span className="text-xs font-mono uppercase tracking-wider block mb-1 font-semibold">
              {config.brandName || "ZENITH ELIXIR"}
            </span>
            <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
              Sub-zero botanical cold maceration atelier. Formulated from first-flush shade leaves and alpine spring water.
            </p>
          </div>

          <div className={`flex gap-8 text-xs font-mono ${isMobile ? "w-full justify-between" : ""}`}>
            <div>
              <span className="font-semibold block mb-2 uppercase tracking-wider text-[11px]" style={{ color: colors.text }}>
                Ateliers
              </span>
              <ul className="space-y-1" style={{ color: colors.muted }}>
                <li>Kyoto, Japan</li>
                <li>Wuyi, Fujian</li>
                <li>Zurich Lab</li>
              </ul>
            </div>

            <div>
              <span className="font-semibold block mb-2 uppercase tracking-wider text-[11px]" style={{ color: colors.text }}>
                Navigation
              </span>
              <ul className="space-y-1" style={{ color: colors.muted }}>
                <li><a href="#hero" className="hover:text-foreground">Overview</a></li>
                <li><a href="#manifesto" className="hover:text-foreground">Philosophy</a></li>
                <li><a href="#timeline" className="hover:text-foreground">Extraction</a></li>
                <li><a href="#blends" className="hover:text-foreground">Formulations</a></li>
                <li><a href="#reserve" className="hover:text-foreground">Reserve</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={`max-w-4xl mx-auto pt-5 mt-6 border-t flex ${
            isMobile ? "flex-col items-start gap-2" : "flex-row items-center justify-between gap-3"
          } text-xs font-mono`}
          style={{
            borderColor: colors.line,
            color: colors.muted,
          }}
        >
          <span>Crafted with Geist and Geist Mono. Zinc monochrome design.</span>
          <a
            href="#hero"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <span>Back to top</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
