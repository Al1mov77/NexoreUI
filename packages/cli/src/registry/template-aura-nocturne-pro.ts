export const templateAuraNocturnePro = {
  name: "template-aura-nocturne-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-aura-nocturne-pro.tsx",
  content: `"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  Terminal,
  Copy,
  ChevronRight,
  Sun,
  Moon,
  Plus,
  Minus,
} from "lucide-react";

const FONT = {
  display: "'Instrument Serif', Georgia, serif",
  body: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif",
};

const PALETTE = {
  light: {
    bg: "#F1E6DA",
    surface: "#E7D8C8",
    surfaceRaised: "#DECDBB",
    line: "#D3BFA9",
    text: "#2A1A12",
    muted: "#7A6354",
    accent: "#A8432A",
    accentInk: "#FFF3EA",
  },
  dark: {
    bg: "#1A120E",
    surface: "#261B15",
    surfaceRaised: "#32231C",
    line: "#3D2C24",
    text: "#F1E6DA",
    muted: "#9E8777",
    accent: "#D96547",
    accentInk: "#1A120E",
  },
};

const MOTION = {
  spring: { type: "spring", stiffness: 170, damping: 26, mass: 1 },
  ease: [0.22, 1, 0.36, 1] as const,
  durationSlow: 0.9,
  durationNormal: 0.65,
  durationFast: 0.25,
};

type FragranceKey = "kyara-oudh" | "solar-bergamot" | "rose-fumee";
type FlaconKey = "voyage-30" | "grand-50" | "atelier-100";

interface FragranceData {
  id: FragranceKey;
  number: string;
  name: string;
  tagline: string;
  origin: string;
  concentration: string;
  maceration: string;
  longevity: string;
  pyramid: {
    top: string;
    heart: string;
    base: string;
  };
  character: string;
  description: string;
}

const FRAGRANCES: Record<FragranceKey, FragranceData> = {
  "kyara-oudh": {
    id: "kyara-oudh",
    number: "Extrait 01",
    name: "Kyara Oudh Nocturne",
    tagline: "Wild Kalimantan Agarwood and Volcanic Ambergris",
    origin: "Kalimantan highland ancient reserve, 1,200m elevation",
    concentration: "32% pure oil extrait",
    maceration: "120 days in toasted French oak casks",
    longevity: "18 hours skin intimacy",
    pyramid: {
      top: "Smoked cardamom pods and cold winter bergamot peel",
      heart: "Wild Kalimantan agarwood and frankincense tears",
      base: "Salted ocean ambergris, birch tar, and damp forest moss",
    },
    character: "Resinous, nocturnal, smoldering",
    description:
      "Formulated from wild-harvested Kalimantan agarwood distilled at low temperature in copper alembics. Blended with ocean ambergris and aged oak tannins for an intimate, tactile drydown.",
  },
  "solar-bergamot": {
    id: "solar-bergamot",
    number: "Extrait 02",
    name: "Solar Bergamot & Amber",
    tagline: "Calabrian Winter Peel and Luminescent White Musk",
    origin: "Calabrian coastal groves, winter first pressing",
    concentration: "28% pure oil extrait",
    maceration: "90 days in glass demijohns",
    longevity: "14 hours radiating warmth",
    pyramid: {
      top: "Cold-pressed winter bergamot and bitter orange leaf",
      heart: "Solar amber resin and Grasse orange blossom absolute",
      base: "White botanical musk, clean cedarwood, and benzoin",
    },
    character: "Luminous, golden, crystalline",
    description:
      "A radiant extraction of cold-pressed Italian winter citrus balanced with mineral amber resin. Distilled slowly to preserve volatile top monoterpenes without oxidative decay.",
  },
  "rose-fumee": {
    id: "rose-fumee",
    number: "Extrait 03",
    name: "Rose Fumée Impériale",
    tagline: "Grasse Centifolia Rose and Birch Tar Smoke",
    origin: "Grasse valley dawn harvest, May vintage",
    concentration: "35% pure oil extrait",
    maceration: "150 days in charred oak casks",
    longevity: "20 hours indelible presence",
    pyramid: {
      top: "Crushed pink peppercorn and Damascena dew",
      heart: "Centifolia rose petals and somber incense resin",
      base: "Smoked cade wood, roasted tonka bean, and labdanum",
    },
    character: "Velveteen, somber, ceremonial",
    description:
      "Thousands of morning-harvested Centifolia rose petals macerated alongside birch tar and roasted tonka. A dark floral study exploring smoke, petal velvet, and unhurried resin.",
  },
};

interface FlaconData {
  id: FlaconKey;
  name: string;
  volume: string;
  price: string;
  cents: number;
  stopper: string;
  dimensions: string;
  description: string;
}

const FLACONS: Record<FlaconKey, FlaconData> = {
  "voyage-30": {
    id: "voyage-30",
    name: "Voyage Flacon",
    volume: "30 ml",
    price: "$185",
    cents: 185,
    stopper: "Drop-metered brass travelling sleeve",
    dimensions: "32mm diameter by 98mm height",
    description: "Compact cylindrical vessel designed for daily transit with precision droplet delivery collar.",
  },
  "grand-50": {
    id: "grand-50",
    name: "Grand Flacon",
    volume: "50 ml",
    price: "$280",
    cents: 280,
    stopper: "Precision hand-ground glass stopper",
    dimensions: "42mm diameter by 124mm height",
    description: "Architectural monolithic flacon in UV-filtering terracotta-tinted glass with ground-glass seal.",
  },
  "atelier-100": {
    id: "atelier-100",
    name: "Atelier Decanter",
    volume: "100 ml",
    price: "$460",
    cents: 460,
    stopper: "Faceted ground-glass stopper with brass collar",
    dimensions: "56mm diameter by 154mm height",
    description: "Substantial decanter flacon with numbered archive certificate and lined walnut presentation coffret.",
  },
};

const EXTRACTION_STAGES = [
  {
    stage: "Stage 01",
    title: "Steam Alembic Extraction",
    metric: "88°C gentle condensation",
    detail:
      "Low-temperature steam passes through raw botanical charges in solid copper stills, capturing delicate volatile top and heart notes without heat scorch.",
  },
  {
    stage: "Stage 02",
    title: "120-Day Oak Cask Maceration",
    metric: "French Limousin oak barrels",
    detail:
      "Pure botanical absolutes rest undisturbed in dark stone cellars, allowing natural tannins and wood vanillins to marry into dense velvet concentration.",
  },
  {
    stage: "Stage 03",
    title: "Biophotonic Enclosure",
    metric: "UV-filtering mineral glass",
    detail:
      "Hand-filled into heavy mineral flacons with ground-glass stoppers, shielding light-sensitive molecules against oxidative decay and air ingress.",
  },
];

const MANIFESTO_TEXT =
  "An extrait de parfum formulated without synthetic carriers or accelerated aging. Wild Kalimantan agarwood, Grasse centifolia rose, and cold-pressed winter bergamot distilled in low-temperature copper alembics, suspended in aged organic cane spirit. Patiently macerated for one hundred and twenty days in toasted French oak casks.";

const MANIFESTO_WORDS = MANIFESTO_TEXT.split(" ");

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = window.getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

export default function AuraNocturneTemplate({
  theme = "dark",
  brandName = "AURA NOCTURNE",
  heroTitle,
  heroSubtitle,
  deviceMode = "desktop",
}: {
  theme?: string;
  brandName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { theme, brandName, heroTitle, heroSubtitle };
  const shouldReduceMotion = useReducedMotion();

  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | null>(null);
  const currentTheme = themeOverride ?? (config.theme === "dark" ? "dark" : "light");
  const isDark = currentTheme === "dark";
  const colors = isDark ? PALETTE.dark : PALETTE.light;

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [activeFragrance, setActiveFragrance] = useState<FragranceKey>("kyara-oudh");
  const [activeFlacon, setActiveFlacon] = useState<FlaconKey>("grand-50");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manifestoProgress, setManifestoProgress] = useState(0);

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
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
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

      if (manifestoRef.current) {
        const rect = manifestoRef.current.getBoundingClientRect();
        const scrollerTop = scroller ? scroller.getBoundingClientRect().top : 0;
        const scrollerH = scroller ? scroller.clientHeight : window.innerHeight;
        const relativeTop = rect.top - scrollerTop;
        const start = scrollerH * 0.85;
        const end = scrollerH * 0.2;
        const mp = Math.min(1, Math.max(0, (start - relativeTop) / (start - end)));
        setManifestoProgress(mp);
      }
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx nexoreui add template-aura-nocturne-pro");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePlaceOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => setOrderConfirmed(false), 3200);
  };

  const fragrance = FRAGRANCES[activeFragrance];
  const flacon = FLACONS[activeFlacon];
  const totalPrice = flacon.cents * quantity;
  const brandTitle = config.brandName || "AURA NOCTURNE";
  const heroHeading = config.heroTitle || "Concentrated extraits born of night and resin";
  const heroSub =
    config.heroSubtitle ||
    "Distilled slowly in copper alembics and aged in French oak casks. Wild Kalimantan agarwood, Grasse centifolia rose, and sun-cured bergamot formulated at thirty-two percent parfum concentration.";

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip transition-colors duration-500"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: FONT.body,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap"
      />

      <header
        className="sticky top-0 z-40 w-full transition-colors duration-300"
        style={{
          backgroundColor: colors.bg,
          borderBottom: \`1px solid \${colors.line}\`,
        }}
      >
        <div
          className={\`max-w-[1240px] mx-auto flex items-center justify-between \${
            isMobile ? "px-4 h-14" : isTablet ? "px-6 h-16" : "px-8 h-16"
          }\`}
        >
          <a
            href="#hero"
            className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
            style={{ color: colors.text }}
          >
            <span
              className={\`tracking-tight font-normal \${isMobile ? "text-base" : "text-xl"}\`}
              style={{ fontFamily: FONT.display }}
            >
              {brandTitle}
            </span>
            {!isMobile && (
              <span
                className="text-[11px] tracking-wider uppercase opacity-60"
                style={{ fontFamily: FONT.body }}
              >
                Extrait
              </span>
            )}
          </a>

          {isDesktop && (
            <nav className="flex items-center gap-7">
              <a
                href="#manifesto"
                className="relative text-xs tracking-wider uppercase py-1 group transition-colors duration-200"
                style={{ color: colors.muted }}
              >
                <span>Manifesto</span>
                <span
                  className="absolute left-0 bottom-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                  style={{ backgroundColor: colors.accent }}
                />
              </a>
              <a
                href="#collection"
                className="relative text-xs tracking-wider uppercase py-1 group transition-colors duration-200"
                style={{ color: colors.muted }}
              >
                <span>Extraits</span>
                <span
                  className="absolute left-0 bottom-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                  style={{ backgroundColor: colors.accent }}
                />
              </a>
              <a
                href="#distillation"
                className="relative text-xs tracking-wider uppercase py-1 group transition-colors duration-200"
                style={{ color: colors.muted }}
              >
                <span>Distillation</span>
                <span
                  className="absolute left-0 bottom-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                  style={{ backgroundColor: colors.accent }}
                />
              </a>
              <a
                href="#acquisition"
                className="relative text-xs tracking-wider uppercase py-1 group transition-colors duration-200"
                style={{ color: colors.muted }}
              >
                <span>Acquisition</span>
                <span
                  className="absolute left-0 bottom-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                  style={{ backgroundColor: colors.accent }}
                />
              </a>
            </nav>
          )}

          <div className={\`flex items-center gap-3 \${isDesktop ? "mr-72" : ""}\`}>
            <button
              type="button"
              onClick={() => setThemeOverride(isDark ? "light" : "dark")}
              className={\`flex items-center gap-2 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 cursor-pointer shadow-sm \${
                isMobile ? "p-2 min-h-[44px] min-w-[44px] justify-center" : "px-3 py-1.5 text-xs font-medium"
              }\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
                color: colors.text,
              }}
              aria-label="Toggle visual theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              )}
              {!isMobile && <span>{isDark ? "Light" : "Dark"}</span>}
            </button>

            {!isMobile && (
              <a
                href="#acquisition"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                Acquire Flacon
              </a>
            )}
          </div>
        </div>

        <div className="w-full h-0.5 relative overflow-hidden" style={{ backgroundColor: colors.surface }}>
          <div
            className="h-full transition-all duration-100 ease-out origin-left"
            style={{
              width: \`\${scrollProgress * 100}%\`,
              backgroundColor: colors.accent,
            }}
          />
        </div>
      </header>

      <section
        id="hero"
        className={\`relative max-w-[1240px] mx-auto \${
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-20" : "px-8 py-28"
        }\`}
      >
        <div className={isDesktop ? "grid grid-cols-12 gap-14 items-center" : "flex flex-col gap-10"}>
          <div className={isDesktop ? "col-span-7 flex flex-col justify-center" : "w-full flex flex-col justify-center"}>
            <span
              className="text-xs uppercase tracking-widest font-medium mb-4"
              style={{ color: colors.accent }}
            >
              Extrait de Parfum Maison
            </span>

            <h1
              className={\`leading-[1.02] tracking-tight font-normal mb-6 text-balance \${
                isMobile ? "text-3xl" : isTablet ? "text-5xl" : "text-7xl"
              }\`}
              style={{ fontFamily: FONT.display }}
            >
              {heroHeading}
            </h1>

            <p
              className={\`leading-relaxed max-w-[560px] mb-8 font-normal \${
                isMobile ? "text-sm" : "text-base sm:text-lg"
              }\`}
              style={{ color: colors.muted }}
            >
              {heroSub}
            </p>

            <div className={\`flex items-center gap-4 mb-12 \${isMobile ? "flex-col w-full" : "flex-row flex-wrap"}\`}>
              <motion.a
                href="#acquisition"
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                transition={MOTION.spring}
                className={\`inline-flex items-center justify-center rounded-xl text-sm font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 shadow-sm \${
                  isMobile ? "w-full min-h-[44px] py-3.5 px-4" : "px-6 py-3.5"
                }\`}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                Acquire Flacon Allocation
              </motion.a>

              <motion.a
                href="#collection"
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                transition={MOTION.spring}
                className={\`inline-flex items-center justify-center rounded-xl text-sm font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 \${
                  isMobile ? "w-full min-h-[44px] py-3.5 px-4" : "px-6 py-3.5"
                }\`}
                style={{
                  backgroundColor: colors.surface,
                  border: \`1px solid \${colors.line}\`,
                  color: colors.text,
                }}
              >
                Explore The Extraits
              </motion.a>
            </div>

            <div
              className={\`pt-6 grid \${isMobile ? "grid-cols-3 gap-2" : "grid-cols-3 gap-4"}\`}
              style={{ borderTop: \`1px solid \${colors.line}\` }}
            >
              <div>
                <span
                  className={\`block font-normal \${isMobile ? "text-lg" : "text-2xl"}\`}
                  style={{ fontFamily: FONT.display }}
                >
                  32%
                </span>
                <span className="block text-[11px] uppercase tracking-wider mt-1" style={{ color: colors.muted }}>
                  Oil Ratio
                </span>
              </div>
              <div>
                <span
                  className={\`block font-normal \${isMobile ? "text-lg" : "text-2xl"}\`}
                  style={{ fontFamily: FONT.display }}
                >
                  120 Days
                </span>
                <span className="block text-[11px] uppercase tracking-wider mt-1" style={{ color: colors.muted }}>
                  Cask Aging
                </span>
              </div>
              <div>
                <span
                  className={\`block font-normal \${isMobile ? "text-lg" : "text-2xl"}\`}
                  style={{ fontFamily: FONT.display }}
                >
                  3 Extraits
                </span>
                <span className="block text-[11px] uppercase tracking-wider mt-1" style={{ color: colors.muted }}>
                  Library
                </span>
              </div>
            </div>
          </div>

          <div className={isDesktop ? "col-span-5 order-last" : "w-full order-first"}>
            <div
              className={\`relative rounded-2xl overflow-hidden shadow-md mx-auto \${
                isMobile ? "aspect-[4/3] max-w-sm" : isTablet ? "aspect-[16/11] max-w-md" : "aspect-[4/5] w-full"
              }\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <video
                ref={videoRef}
                src="/videos/aura-nocturne-perfume.mp4"
                poster="/images/nocturne-emblem.jpg"
                className="w-full h-full object-cover object-center pointer-events-none select-none"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
            <div
              className="mt-3 flex items-center justify-between text-xs px-1"
              style={{ color: colors.muted }}
            >
              <span className="font-medium">Flacon Specimen No. 01</span>
              <span>Kyara Oudh Extrait</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="manifesto"
        ref={manifestoRef}
        className="transition-colors duration-500"
        style={{
          backgroundColor: colors.surface,
          borderTop: \`1px solid \${colors.line}\`,
          borderBottom: \`1px solid \${colors.line}\`,
        }}
      >
        <div
          className={\`max-w-[1240px] mx-auto \${
            isMobile ? "px-4 py-12" : isTablet ? "px-6 py-20" : "px-8 py-28"
          }\`}
        >
          <div className={isDesktop ? "grid grid-cols-12 gap-14 items-start" : "flex flex-col gap-8"}>
            <div className={isDesktop ? "col-span-8" : "w-full"}>
              <span
                className="text-xs uppercase tracking-widest font-medium block mb-4"
                style={{ color: colors.accent }}
              >
                Olfactive Thesis
              </span>

              <p
                className={\`font-normal tracking-tight text-balance \${
                  isMobile ? "text-xl leading-[1.3]" : isTablet ? "text-3xl leading-[1.25]" : "text-5xl leading-[1.2]"
                }\`}
                style={{ fontFamily: FONT.display }}
              >
                {MANIFESTO_WORDS.map((word, i) => {
                  const threshold = i / (MANIFESTO_WORDS.length - 1);
                  const delta = manifestoProgress - threshold;
                  const wordOpacity = shouldReduceMotion
                    ? 1
                    : Math.min(1, Math.max(0.22, 0.22 + (delta > 0 ? Math.min(1, delta * 4) * 0.78 : 0)));

                  return (
                    <span
                      key={i}
                      className="inline-block mr-[0.26em] transition-opacity duration-150"
                      style={{
                        opacity: wordOpacity,
                        color: colors.text,
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className={isDesktop ? "col-span-4" : "w-full"}>
              <div
                className={\`rounded-2xl \${isMobile ? "p-4" : "p-6"}\`}
                style={{
                  backgroundColor: colors.bg,
                  border: \`1px solid \${colors.line}\`,
                }}
              >
                <h3
                  className="text-lg font-normal mb-4"
                  style={{ fontFamily: FONT.display }}
                >
                  Distillation Principles
                </h3>

                <ul className="space-y-4 text-xs font-normal">
                  <li className="flex flex-col pb-3" style={{ borderBottom: \`1px solid \${colors.line}\` }}>
                    <span className="uppercase tracking-wider text-[10px]" style={{ color: colors.muted }}>
                      Terroir Origin
                    </span>
                    <span className="text-sm font-medium mt-1">Kalimantan, Grasse, and Calabria</span>
                  </li>
                  <li className="flex flex-col pb-3" style={{ borderBottom: \`1px solid \${colors.line}\` }}>
                    <span className="uppercase tracking-wider text-[10px]" style={{ color: colors.muted }}>
                      Distillation Apparatus
                    </span>
                    <span className="text-sm font-medium mt-1">Charentais Solid Copper Alembic</span>
                  </li>
                  <li className="flex flex-col pb-3" style={{ borderBottom: \`1px solid \${colors.line}\` }}>
                    <span className="uppercase tracking-wider text-[10px]" style={{ color: colors.muted }}>
                      Alcohol Carrier
                    </span>
                    <span className="text-sm font-medium mt-1">100% Organic Cane Spirit Base</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="uppercase tracking-wider text-[10px]" style={{ color: colors.muted }}>
                      Maturation Duration
                    </span>
                    <span className="text-sm font-medium mt-1">120 Days Limousin Oak Aging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="collection"
        className={\`max-w-[1240px] mx-auto \${
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-20" : "px-8 py-28"
        }\`}
      >
        <div className={\`mb-12 flex \${isDesktop ? "flex-row items-end justify-between" : "flex-col gap-6"}\`}>
          <div>
            <span
              className="text-xs uppercase tracking-widest font-medium block mb-2"
              style={{ color: colors.accent }}
            >
              Reserve Collection
            </span>
            <h2
              className={\`font-normal tracking-tight \${isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-5xl"}\`}
              style={{ fontFamily: FONT.display }}
            >
              The Three Extraits de Parfum
            </h2>
          </div>

          <div
            className={\`inline-flex p-1.5 rounded-2xl \${isMobile ? "w-full justify-between" : "self-start"}\`}
            style={{
              backgroundColor: colors.surface,
              border: \`1px solid \${colors.line}\`,
            }}
          >
            {(["kyara-oudh", "solar-bergamot", "rose-fumee"] as FragranceKey[]).map((key) => {
              const item = FRAGRANCES[key];
              const isSelected = activeFragrance === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFragrance(key)}
                  className={\`relative rounded-xl text-xs font-medium tracking-wide transition-colors duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 cursor-pointer \${
                    isMobile ? "px-2.5 py-2 text-[11px] flex-1 text-center min-h-[44px]" : "px-3.5 py-2"
                  }\`}
                  style={{
                    color: isSelected ? colors.accentInk : colors.muted,
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="active-extrait-pill"
                      className="absolute inset-0 rounded-xl -z-10 shadow-sm"
                      style={{ backgroundColor: colors.accent }}
                      transition={MOTION.spring}
                    />
                  )}
                  {item.number}
                </button>
              );
            })}
          </div>
        </div>

        <div className={isDesktop ? "grid grid-cols-12 gap-8 items-start" : "flex flex-col gap-6"}>
          <div className={isDesktop ? "col-span-5" : "w-full"}>
            <div
              className={\`rounded-2xl \${isMobile ? "p-5" : "p-8"}\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: colors.accent }}>
                {fragrance.number}
              </span>
              <h3
                className={\`font-normal tracking-tight mt-1 mb-2 \${isMobile ? "text-xl" : "text-3xl"}\`}
                style={{ fontFamily: FONT.display }}
              >
                {fragrance.name}
              </h3>
              <p className="text-sm font-medium mb-6" style={{ color: colors.muted }}>
                {fragrance.tagline}
              </p>

              <p className="text-sm leading-relaxed mb-8 font-normal">
                {fragrance.description}
              </p>

              <div className="space-y-4 pt-6" style={{ borderTop: \`1px solid \${colors.line}\` }}>
                <div className="flex justify-between text-xs">
                  <span style={{ color: colors.muted }}>Concentration</span>
                  <span className="font-medium">{fragrance.concentration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: colors.muted }}>Maturation</span>
                  <span className="font-medium">{fragrance.maceration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: colors.muted }}>Terroir Origin</span>
                  <span className="font-medium text-right max-w-[220px]">{fragrance.origin}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: colors.muted }}>Skin Longevity</span>
                  <span className="font-medium">{fragrance.longevity}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={isDesktop ? "col-span-7 flex flex-col gap-6" : "w-full flex flex-col gap-6"}>
            <div
              className={\`rounded-2xl \${isMobile ? "p-5" : "p-8"}\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <h4
                className="text-lg font-normal mb-6"
                style={{ fontFamily: FONT.display }}
              >
                Olfactory Note Architecture
              </h4>

              <div className="space-y-4">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  transition={MOTION.spring}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: colors.bg,
                    border: \`1px solid \${colors.line}\`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-wider block font-medium" style={{ color: colors.accent }}>
                    Top Phase / First 30 Minutes
                  </span>
                  <p className="text-sm font-medium mt-1">{fragrance.pyramid.top}</p>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  transition={MOTION.spring}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: colors.bg,
                    border: \`1px solid \${colors.line}\`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-wider block font-medium" style={{ color: colors.accent }}>
                    Heart Phase / 2 to 8 Hours
                  </span>
                  <p className="text-sm font-medium mt-1">{fragrance.pyramid.heart}</p>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  transition={MOTION.spring}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: colors.bg,
                    border: \`1px solid \${colors.line}\`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-wider block font-medium" style={{ color: colors.accent }}>
                    Base Drydown / 8 to 18 Hours
                  </span>
                  <p className="text-sm font-medium mt-1">{fragrance.pyramid.base}</p>
                </motion.div>
              </div>
            </div>

            <div
              className={\`rounded-2xl flex items-center justify-between \${isMobile ? "p-4 flex-col gap-3 text-center" : "p-6"}\`}
              style={{
                backgroundColor: colors.surfaceRaised,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <div>
                <span className="text-xs uppercase tracking-wider block" style={{ color: colors.muted }}>
                  Current Selection
                </span>
                <span className="text-base font-medium">{fragrance.name}</span>
              </div>
              <a
                href="#acquisition"
                className={\`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium rounded-xl transition-transform duration-200 cursor-pointer \${
                  isMobile ? "w-full justify-center min-h-[44px] py-3" : "px-4 py-2"
                }\`}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                <span>Select Volume</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="distillation"
        className="transition-colors duration-500"
        style={{
          backgroundColor: colors.surface,
          borderTop: \`1px solid \${colors.line}\`,
          borderBottom: \`1px solid \${colors.line}\`,
        }}
      >
        <div
          className={\`max-w-[1240px] mx-auto \${
            isMobile ? "px-4 py-12" : isTablet ? "px-6 py-20" : "px-8 py-28"
          }\`}
        >
          <div className="max-w-[680px] mb-14">
            <span
              className="text-xs uppercase tracking-widest font-medium block mb-2"
              style={{ color: colors.accent }}
            >
              The Distillation Method
            </span>
            <h2
              className={\`font-normal tracking-tight mb-4 \${isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-5xl"}\`}
              style={{ fontFamily: FONT.display }}
            >
              Three Stages of Patient Extraction
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.muted }}>
              Every flacon requires slow thermal conduction and unforced maturation. We refuse chemical accelerants, synthetic stabilizers, and industrial centrifugal clarification.
            </p>
          </div>

          <div className={\`grid \${isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-3 gap-6"}\`}>
            {EXTRACTION_STAGES.map((item, idx) => (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: MOTION.durationNormal, ease: MOTION.ease, delay: idx * 0.12 }}
                className={\`rounded-2xl flex flex-col justify-between \${isMobile ? "p-5" : "p-8"}\`}
                style={{
                  backgroundColor: colors.bg,
                  border: \`1px solid \${colors.line}\`,
                }}
              >
                <div>
                  <span className="text-xs uppercase tracking-wider block font-medium mb-3" style={{ color: colors.accent }}>
                    {item.stage}
                  </span>
                  <h3
                    className="text-xl font-normal mb-2"
                    style={{ fontFamily: FONT.display }}
                  >
                    {item.title}
                  </h3>
                  <span
                    className="inline-block text-xs font-mono px-2.5 py-1 rounded-md mb-4"
                    style={{
                      backgroundColor: colors.surface,
                      color: colors.text,
                      border: \`1px solid \${colors.line}\`,
                    }}
                  >
                    {item.metric}
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.muted }}>
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="acquisition"
        className={\`max-w-[1240px] mx-auto \${
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-20" : "px-8 py-28"
        }\`}
      >
        <div className="max-w-[680px] mb-12">
          <span
            className="text-xs uppercase tracking-widest font-medium block mb-2"
            style={{ color: colors.accent }}
          >
            Atelier Allocation
          </span>
          <h2
            className={\`font-normal tracking-tight mb-4 \${isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-5xl"}\`}
            style={{ fontFamily: FONT.display }}
          >
            Acquire Flacon Allocation
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.muted }}>
            Reserve flacons from the current cask aging batch. Dispatched in numbered protective packaging with ground-glass stopper fittings.
          </p>
        </div>

        <div className={isDesktop ? "grid grid-cols-12 gap-8 items-start" : "flex flex-col gap-6"}>
          <div className={isDesktop ? "col-span-7 flex flex-col gap-6" : "w-full flex flex-col gap-6"}>
            <div
              className={\`rounded-2xl \${isMobile ? "p-5" : "p-8"}\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <h3
                className="text-lg font-normal mb-6"
                style={{ fontFamily: FONT.display }}
              >
                Select Vessel Format
              </h3>

              <div className={\`grid \${isMobile ? "grid-cols-1 gap-3" : "grid-cols-3 gap-4"}\`}>
                {(["voyage-30", "grand-50", "atelier-100"] as FlaconKey[]).map((key) => {
                  const item = FLACONS[key];
                  const isSelected = activeFlacon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveFlacon(key)}
                      className={\`relative p-5 rounded-xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 cursor-pointer \${
                        isMobile ? "min-h-[64px]" : ""
                      }\`}
                      style={{
                        backgroundColor: colors.bg,
                        border: isSelected ? \`2px solid \${colors.accent}\` : \`1px solid \${colors.line}\`,
                      }}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-flacon-pill"
                          className="absolute top-2 right-2 w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        />
                      )}
                      <span className="text-xs uppercase tracking-wider block font-medium" style={{ color: colors.muted }}>
                        {item.volume}
                      </span>
                      <span className="text-base font-semibold block mt-1">{item.name}</span>
                      <span className="text-lg font-normal block mt-3" style={{ fontFamily: FONT.display }}>
                        {item.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6" style={{ borderTop: \`1px solid \${colors.line}\` }}>
                <span className="text-xs uppercase tracking-wider block mb-2" style={{ color: colors.muted }}>
                  Flacon Specification
                </span>
                <p className="text-sm leading-relaxed mb-4">{flacon.description}</p>
                <div className={\`grid \${isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"} text-xs font-normal\`}>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: colors.bg, border: \`1px solid \${colors.line}\` }}>
                    <span className="text-[10px] uppercase tracking-wider block" style={{ color: colors.muted }}>Stopper Type</span>
                    <span className="font-medium mt-0.5 block">{flacon.stopper}</span>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: colors.bg, border: \`1px solid \${colors.line}\` }}>
                    <span className="text-[10px] uppercase tracking-wider block" style={{ color: colors.muted }}>Dimensions</span>
                    <span className="font-medium mt-0.5 block">{flacon.dimensions}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={\`rounded-2xl flex \${isMobile ? "flex-col items-start gap-4 p-4" : "flex-row items-center justify-between gap-4 p-6"}\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 shrink-0" style={{ color: colors.accent }} />
                <div className="font-mono text-xs">
                  <span className="opacity-60 block text-[10px] uppercase font-sans">CLI Registry Install</span>
                  <span>npx nexoreui add template-aura-nocturne-pro</span>
                </div>
              </div>

              <button
                type="button"
                onClick={copyCommand}
                className={\`inline-flex items-center justify-center gap-2 rounded-xl text-xs font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 cursor-pointer \${
                  isMobile ? "w-full min-h-[44px] py-3" : "px-4 py-2.5"
                }\`}
                style={{
                  backgroundColor: colors.bg,
                  border: \`1px solid \${colors.line}\`,
                  color: colors.text,
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Command Copied" : "Copy Command"}</span>
              </button>
            </div>
          </div>

          <div className={isDesktop ? "col-span-5 sticky top-24" : "w-full"}>
            <div
              className={\`rounded-2xl \${isMobile ? "p-5" : "p-8"}\`}
              style={{
                backgroundColor: colors.surface,
                border: \`1px solid \${colors.line}\`,
              }}
            >
              <h3
                className="text-xl font-normal mb-6"
                style={{ fontFamily: FONT.display }}
              >
                Allocation Summary
              </h3>

              <div className="space-y-4 text-xs font-normal pb-6" style={{ borderBottom: \`1px solid \${colors.line}\` }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.muted }}>Extrait Formulation</span>
                  <span className="font-medium">{fragrance.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.muted }}>Vessel Capacity</span>
                  <span className="font-medium">{flacon.name} ({flacon.volume})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.muted }}>Maceration Vintage</span>
                  <span className="font-medium">{fragrance.maceration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.muted }}>Delivery Logistics</span>
                  <span className="font-medium">Climate-controlled courier</span>
                </div>
              </div>

              <div className="py-6 flex items-center justify-between" style={{ borderBottom: \`1px solid \${colors.line}\` }}>
                <span className="text-xs uppercase tracking-wider" style={{ color: colors.muted }}>
                  Quantity (Max 6)
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-40 cursor-pointer min-h-[44px] min-w-[44px]"
                    style={{
                      backgroundColor: colors.bg,
                      border: \`1px solid \${colors.line}\`,
                      color: colors.text,
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(6, quantity + 1))}
                    disabled={quantity >= 6}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-40 cursor-pointer min-h-[44px] min-w-[44px]"
                    style={{
                      backgroundColor: colors.bg,
                      border: \`1px solid \${colors.line}\`,
                      color: colors.text,
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="py-6 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider" style={{ color: colors.muted }}>
                  Total Allocation
                </span>
                <span
                  className="text-3xl font-normal tabular-nums"
                  style={{ fontFamily: FONT.display }}
                >
                  \${totalPrice}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={handlePlaceOrder}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="w-full py-4 rounded-xl text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 shadow-sm cursor-pointer min-h-[44px]"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                <AnimatePresence mode="wait">
                  {orderConfirmed ? (
                    <motion.span
                      key="confirmed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Allocation Reserved for Dispatch</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="reserve"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      Acquire Flacon Allocation
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="colophon"
        className="transition-colors duration-500"
        style={{
          backgroundColor: colors.surface,
          borderTop: \`1px solid \${colors.line}\`,
        }}
      >
        <div
          className={\`max-w-[1240px] mx-auto \${
            isMobile ? "px-4 py-12" : isTablet ? "px-6 py-16" : "px-8 py-16"
          }\`}
        >
          <div
            className={\`grid \${
              isMobile ? "grid-cols-1 gap-6" : isTablet ? "grid-cols-2 gap-6" : "grid-cols-4 gap-8"
            } pb-12\`}
            style={{ borderBottom: \`1px solid \${colors.line}\` }}
          >
            <div>
              <span
                className="text-lg tracking-tight font-normal block mb-3"
                style={{ fontFamily: FONT.display }}
              >
                {brandTitle}
              </span>
              <p className="text-xs leading-relaxed max-w-[240px]" style={{ color: colors.muted }}>
                Independent perfume extrait laboratory distilling rare resins and wild botanicals in copper alembics.
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider block font-medium mb-3" style={{ color: colors.text }}>
                Atelier Coordinates
              </span>
              <ul className="space-y-2 text-xs" style={{ color: colors.muted }}>
                <li>Grasse Distillation Stillroom</li>
                <li>Paris Formulation Laboratory</li>
                <li>Kyoto Wood Aging Archive</li>
              </ul>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider block font-medium mb-3" style={{ color: colors.text }}>
                Harvest Ethics
              </span>
              <ul className="space-y-2 text-xs" style={{ color: colors.muted }}>
                <li>Zero synthetic nitro-musks</li>
                <li>Wild-sustainable harvest permits</li>
                <li>Direct terroir producer equity</li>
              </ul>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider block font-medium mb-3" style={{ color: colors.text }}>
                Formulation Standards
              </span>
              <ul className="space-y-2 text-xs" style={{ color: colors.muted }}>
                <li>Organic unbleached cane spirit</li>
                <li>Zero phthalates or parabens</li>
                <li>Triple-chilled mechanical filtration</li>
              </ul>
            </div>
          </div>

          <div
            className={\`pt-8 flex \${
              isMobile ? "flex-col items-start gap-4" : "flex-row items-center justify-between gap-4"
            } text-xs\`}
            style={{ color: colors.muted }}
          >
            <p>© 2026 Aura Nocturne Parfums. Crafted for NexoreUI Pro.</p>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setThemeOverride(isDark ? "light" : "dark")}
                className="flex items-center gap-1.5 hover:underline cursor-pointer"
                style={{ color: colors.text }}
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-stone-700" />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <a href="#hero" className="hover:underline">Back to top</a>
              <a href="#manifesto" className="hover:underline">Manifesto</a>
              <a href="#collection" className="hover:underline">Collection</a>
              <a href="#acquisition" className="hover:underline">Acquire</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};
