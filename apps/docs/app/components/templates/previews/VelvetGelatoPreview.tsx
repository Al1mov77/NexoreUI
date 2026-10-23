"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Sun,
  Moon,
  Check,
  ArrowRight,
  Minus,
  Plus,
  Clock,
  MapPin,
  Calendar,
  Users,
  Copy,
  ShoppingBag,
  Snowflake,
  ShieldCheck,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Young+Serif&family=Albert+Sans:wght@400;500;600;700&display=swap";

const FONT = {
  display: '"Young Serif", Georgia, serif',
  body: '"Albert Sans", -apple-system, BlinkMacSystemFont, sans-serif',
};

const PALETTES = {
  light: {
    bg: "#FAF6EB",
    surface: "#F3EDE0",
    surfaceHover: "#EAE2D2",
    line: "#E2D8C6",
    text: "#1C1714",
    muted: "#6E655C",
    accent: "#C25916",
    accentInk: "#FFFFFF",
  },
  dark: {
    bg: "#0E0C0B",
    surface: "#181513",
    surfaceHover: "#241F1C",
    line: "#2E2824",
    text: "#F5EFE6",
    muted: "#A3998F",
    accent: "#E27B32",
    accentInk: "#0E0C0B",
  },
} as const;

const MOTION = {
  springSoft: { type: "spring", stiffness: 170, damping: 26, mass: 1 } as const,
  springPill: { type: "spring", stiffness: 240, damping: 28, mass: 0.8 } as const,
  easeRise: [0.22, 1, 0.36, 1] as const,
  durationRise: 0.9,
  pressScale: 0.97,
};

interface FlavorItem {
  id: "bronte-pistachio" | "salted-caramel" | "ruby-cacao";
  name: string;
  origin: string;
  churnTemp: string;
  butterfat: string;
  swatch: string;
  notes: string;
  description: string;
  spectrum: {
    creaminess: number;
    richness: number;
    sweetness: number;
    density: number;
  };
}

const FLAVORS: readonly FlavorItem[] = [
  {
    id: "bronte-pistachio",
    name: "Bronte Pistachio",
    origin: "Bronte, Sicily",
    churnTemp: "-14.2°C",
    butterfat: "14.2%",
    swatch: "#84cc16",
    notes: "Piedmont green pistachio paste, whole Jersey cream, sea salt flake",
    description: "Stone-ground Sicilian pistachios folded cold into pasture-raised dairy for a deep nutty sweetness.",
    spectrum: {
      creaminess: 96,
      richness: 98,
      sweetness: 34,
      density: 94,
    },
  },
  {
    id: "salted-caramel",
    name: "Smoked Salted Toffee",
    origin: "Guérande, France",
    churnTemp: "-14.6°C",
    butterfat: "14.8%",
    swatch: "#f59e0b",
    notes: "Copper kettle amber toffee, sel gris crystal, browned grass-fed butter",
    description: "Slow-cooked copper sugar caramelized to golden amber, finished with cold-smoked Atlantic sea salt.",
    spectrum: {
      creaminess: 92,
      richness: 94,
      sweetness: 48,
      density: 96,
    },
  },
  {
    id: "ruby-cacao",
    name: "Dark Ruby Cacao",
    origin: "Chuao, Venezuela",
    churnTemp: "-13.8°C",
    butterfat: "13.6%",
    swatch: "#fb7185",
    notes: "Single-origin dark chocolate, wild red currant reduction, vanilla pod",
    description: "Single-estate Criollo cacao balanced with natural mountain currant acidity and cold vanilla cream.",
    spectrum: {
      creaminess: 90,
      richness: 96,
      sweetness: 30,
      density: 98,
    },
  },
] as const;

interface FormatOption {
  id: "cup" | "pints" | "coffret";
  name: string;
  volume: string;
  servings: string;
  price: number;
  packNote: string;
}

const FORMAT_OPTIONS: readonly FormatOption[] = [
  {
    id: "cup",
    name: "Studio Tub",
    volume: "240ml",
    servings: "1-2 portions",
    price: 14,
    packNote: "Single insulated canister",
  },
  {
    id: "pints",
    name: "Twin Pints",
    volume: "2 x 480ml",
    servings: "4-6 portions",
    price: 28,
    packNote: "Two chilled canisters in carry tote",
  },
  {
    id: "coffret",
    name: "Degustation Flight",
    volume: "4 x 120ml",
    servings: "4 distinct flights",
    price: 36,
    packNote: "Four tasting jars in gift box",
  },
] as const;

interface ToppingOption {
  id: "pistachio" | "smoked-salt" | "cacao-nib" | "none";
  name: string;
  price: number;
}

const TOPPINGS: readonly ToppingOption[] = [
  { id: "pistachio", name: "Pistachio Croquant", price: 2 },
  { id: "smoked-salt", name: "Maldon Smoked Salt", price: 1 },
  { id: "cacao-nib", name: "Roasted Cacao Nibs", price: 2 },
  { id: "none", name: "Pure Velvet", price: 0 },
] as const;

interface ProcessStep {
  step: string;
  title: string;
  temperature: string;
  duration: string;
  summary: string;
}

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    step: "01",
    title: "Cold Infusion",
    temperature: "4°C",
    duration: "18 Hours",
    summary: "Pasture dairy steeps slowly with raw whole nuts, roasted pods, and unrefined cane sugar.",
  },
  {
    step: "02",
    title: "Sub-Zero Rotary Churn",
    temperature: "-14°C",
    duration: "24 Minutes",
    summary: "Cryogenic cylinder limits overrun to eighteen percent, preventing ice crystal lattice formation.",
  },
  {
    step: "03",
    title: "Hermetic Vault Seal",
    temperature: "-18°C",
    duration: "Immediate",
    summary: "Transferred into double-walled insulated canisters to retain volatile aroma and silk texture.",
  },
] as const;

interface TastingSession {
  id: "salon" | "master";
  title: string;
  duration: string;
  portions: string;
  pairing: string;
  pricePerGuest: number;
}

const TASTING_SESSIONS: readonly TastingSession[] = [
  {
    id: "salon",
    title: "Salon Tasting Flight",
    duration: "45 minutes",
    portions: "3 seasonal creations",
    pairing: "Cold-infused alpine chamomile tea",
    pricePerGuest: 32,
  },
  {
    id: "master",
    title: "Master Degustation Session",
    duration: "75 minutes",
    portions: "Full 5-course exploration",
    pairing: "Single-estate roasted Taiwanese oolong",
    pricePerGuest: 58,
  },
] as const;

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

export function VelvetGelatoPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  const [containerWidth, setContainerWidth] = useState(1200);
  const [internalTheme, setInternalTheme] = useState<"light" | "dark">(
    config.theme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    if (config.theme === "dark" || config.theme === "light") {
      setInternalTheme(config.theme);
    }
  }, [config.theme]);

  const activeTheme = internalTheme;
  const isDark = activeTheme === "dark";
  const palette = PALETTES[activeTheme];

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

  const [scrollProgress, setScrollProgress] = useState(0);

  const [activeFlavorId, setActiveFlavorId] = useState<FlavorItem["id"]>("bronte-pistachio");
  const [selectedFormatId, setSelectedFormatId] = useState<FormatOption["id"]>("cup");
  const [selectedToppingId, setSelectedToppingId] = useState<ToppingOption["id"]>("pistachio");
  const [quantity, setQuantity] = useState(1);
  const [orderAdded, setOrderAdded] = useState(false);

  const [selectedSessionId, setSelectedSessionId] = useState<TastingSession["id"]>("salon");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState("Tomorrow 15:00");
  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [cliCopied, setCliCopied] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const s = findScroller(el);
    const target: HTMLElement | Window = s ?? window;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const total = r.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -(r.top - top) / total)) : 0;
      setScrollProgress(p);
    };

    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toggleTheme = () => {
    setInternalTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const currentFlavor = FLAVORS.find((f) => f.id === activeFlavorId) ?? FLAVORS[0];
  const currentFormat = FORMAT_OPTIONS.find((f) => f.id === selectedFormatId) ?? FORMAT_OPTIONS[0];
  const currentTopping = TOPPINGS.find((t) => t.id === selectedToppingId) ?? TOPPINGS[0];
  const currentSession = TASTING_SESSIONS.find((s) => s.id === selectedSessionId) ?? TASTING_SESSIONS[0];

  const totalPrice = (currentFormat.price + currentTopping.price) * quantity;
  const totalReservationPrice = currentSession.pricePerGuest * guestCount;

  const handleAddOrder = () => {
    setOrderAdded(true);
    setTimeout(() => setOrderAdded(false), 2400);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationConfirmed(true);
    setTimeout(() => setReservationConfirmed(false), 3000);
  };

  const copyCli = () => {
    navigator.clipboard.writeText("npx nexoreui add template-velvet-gelato-pro");
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  const scrollTo = (hash: string) => {
    const el = rootRef.current?.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  const motionTransition = reducedMotion
    ? { duration: 0 }
    : MOTION.springSoft;

  return (
    <div
      ref={rootRef}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: FONT.body,
      }}
      className="relative w-full overflow-x-clip min-h-screen select-none transition-colors duration-500"
    >
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      <motion.div
        style={{
          scaleX: scrollProgress,
          backgroundColor: palette.accent,
        }}
        className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left pointer-events-none"
      />

      <header
        style={{
          backgroundColor: isDark ? "rgba(14,12,11,0.85)" : "rgba(250,246,235,0.85)",
          borderColor: palette.line,
        }}
        className={cn(
          "sticky top-0 z-40 border-b flex items-center justify-between transition-colors duration-300 backdrop-blur-md",
          isMobile ? "px-3 py-2.5" : isTablet ? "px-6 py-3" : "px-8 py-3.5"
        )}
      >
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-none shrink-0"
        >
          <div
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
              fontFamily: FONT.display,
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          >
            V
          </div>
          <div>
            <span
              style={{
                color: palette.text,
                fontFamily: FONT.display,
              }}
              className={cn(
                "font-bold tracking-tight block leading-tight",
                isMobile ? "text-sm" : "text-base sm:text-lg"
              )}
            >
              {config.brandName || "VELVET GELATO"}
            </span>
            {!isMobile && (
              <span
                style={{ color: palette.muted }}
                className="text-[11px] block leading-none font-medium mt-0.5"
              >
                Sub-Zero Rotary Churn
              </span>
            )}
          </div>
        </button>

        {!isMobile && !isTablet && (
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={() => scrollTo("#hero")}
              style={{ color: palette.muted }}
              className="hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none"
            >
              Atelier
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#philosophy")}
              style={{ color: palette.muted }}
              className="hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none"
            >
              Philosophy
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#configurator")}
              style={{ color: palette.muted }}
              className="hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none"
            >
              Order Studio
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#process")}
              style={{ color: palette.muted }}
              className="hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none"
            >
              Process
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#tasting-menu")}
              style={{ color: palette.muted }}
              className="hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none"
            >
              Tasting Room
            </button>
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
              color: palette.text,
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer min-h-[44px]",
              isMobile ? "px-2.5 py-2 text-[11px]" : "px-3 py-2 text-xs"
            )}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {!isMobile && <span>Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-700" />
                {!isMobile && <span>Dark</span>}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("#configurator")}
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
            }}
            className={cn(
              "rounded-full font-semibold hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]",
              isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-xs sm:text-sm"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order</span>
          </button>
        </div>
      </header>

      <section
        id="hero"
        className={cn(
          "relative w-full overflow-hidden flex flex-col justify-center",
          isMobile
            ? "min-h-[520px] px-4 py-12"
            : isTablet
            ? "min-h-[620px] px-6 py-20"
            : "min-h-[90vh] px-8 py-28"
        )}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            ref={videoRef}
            src="/videos/velvet-cryo-gelato.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center"
            style={{
              opacity: isDark ? 0.38 : 0.22,
              transform: `scale(${1 + scrollProgress * 0.12})`,
              transition: "transform 0.1s linear, opacity 0.3s ease",
            }}
          />
          <div
            style={{
              background: isDark
                ? `linear-gradient(to bottom, rgba(14,12,11,0.6) 0%, rgba(14,12,11,0.2) 40%, ${palette.bg} 96%)`
                : `linear-gradient(to bottom, rgba(250,246,235,0.6) 0%, rgba(250,246,235,0.2) 40%, ${palette.bg} 96%)`,
            }}
            className="absolute inset-0 pointer-events-none"
          />
          <div
            style={{
              background: `radial-gradient(ellipse 90% 75% at 50% 40%, transparent 25%, ${palette.bg} 92%)`,
            }}
            className="absolute inset-0 pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition}
            >
              <h1
                style={{
                  fontFamily: FONT.display,
                  color: palette.text,
                }}
                className={cn(
                  "font-normal tracking-tight leading-[1.02]",
                  isMobile
                    ? "text-3xl"
                    : isTablet
                    ? "text-5xl"
                    : "text-6xl lg:text-7xl"
                )}
              >
                {config.heroTitle || "Sub-zero churned cream, sculpted with cold air."}
              </h1>
              <p
                style={{ color: palette.muted }}
                className={cn(
                  "font-normal leading-relaxed mt-4 sm:mt-6",
                  isMobile
                    ? "text-sm max-w-sm"
                    : isTablet
                    ? "text-base max-w-xl"
                    : "text-lg max-w-2xl"
                )}
              >
                {config.heroSubtitle ||
                  "Crafted in small batches with whole grass-fed dairy and Sicilian harvest fruits. Frozen at minus fourteen degrees for a dense, silk finish."}
              </p>
            </motion.div>

            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionTransition, delay: 0.1 }}
              className={cn(
                "flex items-center gap-3 mt-8",
                isMobile ? "flex-col w-full" : "flex-row"
              )}
            >
              <button
                type="button"
                onClick={() => scrollTo("#configurator")}
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className={cn(
                  "px-6 py-3.5 rounded-full font-semibold text-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm min-h-[44px]",
                  isMobile ? "w-full" : ""
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Flavor Studio</span>
              </button>
              <button
                type="button"
                onClick={() => scrollTo("#philosophy")}
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                  color: palette.text,
                }}
                className={cn(
                  "px-6 py-3.5 rounded-full border font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]",
                  isMobile ? "w-full" : ""
                )}
              >
                <span>Read Churn Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionTransition, delay: 0.2 }}
            style={{
              backgroundColor: isDark ? "rgba(24,21,19,0.8)" : "rgba(243,237,224,0.8)",
              borderColor: palette.line,
            }}
            className={cn(
              "mt-12 sm:mt-16 rounded-[24px] border p-4 sm:p-6 backdrop-blur-md grid gap-4 items-center",
              isMobile ? "grid-cols-1" : isTablet ? "grid-cols-3" : "grid-cols-3 max-w-3xl"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: FONT.display,
                  color: palette.accent,
                }}
                className="text-2xl sm:text-3xl font-bold tabular-nums"
              >
                -14.2°C
              </span>
              <div>
                <span style={{ color: palette.text }} className="text-xs font-bold block">
                  Rotary Churn Temp
                </span>
                <span style={{ color: palette.muted }} className="text-[11px] block">
                  Sub-zero crystal prevention
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4" style={{ borderColor: palette.line }}>
              <span
                style={{
                  fontFamily: FONT.display,
                  color: palette.accent,
                }}
                className="text-2xl sm:text-3xl font-bold tabular-nums"
              >
                18%
              </span>
              <div>
                <span style={{ color: palette.text }} className="text-xs font-bold block">
                  Low Air Overrun
                </span>
                <span style={{ color: palette.muted }} className="text-[11px] block">
                  Pure dairy density
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4" style={{ borderColor: palette.line }}>
              <span
                style={{
                  fontFamily: FONT.display,
                  color: palette.accent,
                }}
                className="text-2xl sm:text-3xl font-bold tabular-nums"
              >
                14.2%
              </span>
              <div>
                <span style={{ color: palette.text }} className="text-xs font-bold block">
                  Jersey Butterfat
                </span>
                <span style={{ color: palette.muted }} className="text-[11px] block">
                  Zero waxy additives
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="philosophy"
        style={{
          borderColor: palette.line,
        }}
        className={cn(
          "max-w-7xl mx-auto border-t",
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-16" : "px-8 py-24"
        )}
      >
        <div className={cn("grid gap-8 items-start", isDesktop ? "grid-cols-12" : "grid-cols-1")}>
          <div className={isDesktop ? "col-span-5" : "col-span-1"}>
            <span
              style={{ color: palette.accent }}
              className="text-xs font-bold uppercase tracking-wider block mb-3"
            >
              Culinary Philosophy
            </span>
            <h2
              style={{
                fontFamily: FONT.display,
                color: palette.text,
              }}
              className={cn(
                "font-normal tracking-tight leading-[1.08]",
                isMobile ? "text-3xl" : "text-4xl sm:text-5xl"
              )}
            >
              We freeze slower to melt longer on the tongue.
            </h2>
          </div>

          <div className={cn("space-y-6", isDesktop ? "col-span-7" : "col-span-1")}>
            <p
              style={{ color: palette.muted }}
              className={cn("leading-relaxed", isMobile ? "text-sm" : "text-base sm:text-lg")}
            >
              Commercial ice cream relies on whipping high volumes of ambient air into dairy to inflate carton bulk. Our cryogenic rotary churn restricts overrun to eighteen percent. This preserves the pure density of grass-fed milk fats, cold-pressed fruit reductions, and raw nut oils.
            </p>
            <p
              style={{ color: palette.muted }}
              className="text-sm leading-relaxed"
            >
              Because there are zero artificial emulsifiers, the gelato does not leave a waxy film. Each spoonful holds a firm structure at minus fourteen degrees, then yields seamlessly to body warmth, releasing clear top notes followed by deep mineral nuances.
            </p>

            <div
              style={{ borderColor: palette.line }}
              className={cn(
                "grid gap-4 pt-6 border-t",
                isMobile ? "grid-cols-1" : "grid-cols-3"
              )}
            >
              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className="p-4 rounded-2xl border"
              >
                <span
                  style={{
                    fontFamily: FONT.display,
                    color: palette.text,
                  }}
                  className="text-2xl font-bold block"
                >
                  18% Overrun
                </span>
                <span
                  style={{ color: palette.muted }}
                  className="text-xs font-semibold mt-1 block"
                >
                  Dense spoon texture that resists rapid melting
                </span>
              </div>
              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className="p-4 rounded-2xl border"
              >
                <span
                  style={{
                    fontFamily: FONT.display,
                    color: palette.text,
                  }}
                  className="text-2xl font-bold block"
                >
                  -14°C Churn
                </span>
                <span
                  style={{ color: palette.muted }}
                  className="text-xs font-semibold mt-1 block"
                >
                  Continuous cold boundary preventing ice shards
                </span>
              </div>
              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className="p-4 rounded-2xl border"
              >
                <span
                  style={{
                    fontFamily: FONT.display,
                    color: palette.text,
                  }}
                  className="text-2xl font-bold block"
                >
                  100% Farm Dairy
                </span>
                <span
                  style={{ color: palette.muted }}
                  className="text-xs font-semibold mt-1 block"
                >
                  Pure cream without carrageenan or soy lecithin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="configurator"
        style={{
          borderColor: palette.line,
        }}
        className={cn(
          "max-w-7xl mx-auto border-t",
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-16" : "px-8 py-24"
        )}
      >
        <div className="max-w-2xl mb-8 sm:mb-12">
          <span
            style={{ color: palette.accent }}
            className="text-xs font-bold uppercase tracking-wider block mb-2"
          >
            Signature Configurator
          </span>
          <h2
            style={{
              fontFamily: FONT.display,
              color: palette.text,
            }}
            className={cn(
              "font-normal tracking-tight leading-[1.08]",
              isMobile ? "text-3xl" : "text-4xl sm:text-5xl"
            )}
          >
            Compose your fresh cold box.
          </h2>
          <p
            style={{ color: palette.muted }}
            className="mt-3 text-sm sm:text-base leading-relaxed"
          >
            Select your preferred flavor profile, container format, and crunchy toppings. Watch live composition details and total pricing adjust in real time.
          </p>
        </div>

        <div className={cn("grid gap-8 items-start", isDesktop ? "grid-cols-12" : "grid-cols-1")}>
          <div className={cn("space-y-8", isDesktop ? "col-span-7" : "col-span-1")}>
            <div>
              <label
                style={{ color: palette.text }}
                className="text-xs font-bold uppercase tracking-wider block mb-3"
              >
                1. Select Churned Flavor
              </label>
              <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-3")}>
                {FLAVORS.map((flavor) => {
                  const isSelected = activeFlavorId === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setActiveFlavorId(flavor.id)}
                      style={{
                        backgroundColor: isSelected ? palette.surface : palette.bg,
                        borderColor: isSelected ? palette.accent : palette.line,
                        color: palette.text,
                      }}
                      className={cn(
                        "p-4 rounded-2xl border text-left cursor-pointer transition-all min-h-[44px] relative focus-visible:outline-none",
                        isSelected ? "ring-2 ring-offset-2 shadow-sm" : "hover:border-opacity-100"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: flavor.swatch }}
                        />
                        <span
                          style={{ color: palette.muted }}
                          className="text-[10px] font-semibold"
                        >
                          {flavor.butterfat}
                        </span>
                      </div>
                      <span className="font-bold text-sm block leading-snug">
                        {flavor.name}
                      </span>
                      <span
                        style={{ color: palette.muted }}
                        className="text-xs block mt-1 line-clamp-1"
                      >
                        {flavor.origin}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className="mt-4 p-4 rounded-2xl border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.text }} className="text-xs font-bold">
                    Sensory Profile: {currentFlavor.name}
                  </span>
                  <span style={{ color: palette.accent }} className="text-xs font-semibold">
                    {currentFlavor.churnTemp}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: palette.muted }}>Creaminess</span>
                      <span style={{ color: palette.text }} className="font-bold tabular-nums">
                        {currentFlavor.spectrum.creaminess}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: palette.line }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: palette.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentFlavor.spectrum.creaminess}%` }}
                        transition={motionTransition}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: palette.muted }}>Richness</span>
                      <span style={{ color: palette.text }} className="font-bold tabular-nums">
                        {currentFlavor.spectrum.richness}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: palette.line }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: palette.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentFlavor.spectrum.richness}%` }}
                        transition={motionTransition}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: palette.muted }}>Sweetness</span>
                      <span style={{ color: palette.text }} className="font-bold tabular-nums">
                        {currentFlavor.spectrum.sweetness}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: palette.line }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: palette.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentFlavor.spectrum.sweetness}%` }}
                        transition={motionTransition}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: palette.muted }}>Spoon Density</span>
                      <span style={{ color: palette.text }} className="font-bold tabular-nums">
                        {currentFlavor.spectrum.density}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: palette.line }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: palette.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentFlavor.spectrum.density}%` }}
                        transition={motionTransition}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                style={{ color: palette.text }}
                className="text-xs font-bold uppercase tracking-wider block mb-3"
              >
                2. Container Format
              </label>
              <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-3")}>
                {FORMAT_OPTIONS.map((format) => {
                  const isSelected = selectedFormatId === format.id;
                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => setSelectedFormatId(format.id)}
                      style={{
                        backgroundColor: isSelected ? palette.surface : palette.bg,
                        borderColor: isSelected ? palette.accent : palette.line,
                        color: palette.text,
                      }}
                      className={cn(
                        "p-4 rounded-2xl border text-left cursor-pointer transition-all min-h-[44px] relative focus-visible:outline-none",
                        isSelected ? "ring-2 ring-offset-2 shadow-sm" : "hover:border-opacity-100"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{format.name}</span>
                        <span
                          style={{ color: palette.accent }}
                          className="text-xs font-bold tabular-nums"
                        >
                          ${format.price}
                        </span>
                      </div>
                      <span
                        style={{ color: palette.muted }}
                        className="text-xs block"
                      >
                        {format.volume} / {format.servings}
                      </span>
                      <span
                        style={{ color: palette.muted }}
                        className="text-[11px] block mt-2 opacity-80"
                      >
                        {format.packNote}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                style={{ color: palette.text }}
                className="text-xs font-bold uppercase tracking-wider block mb-3"
              >
                3. Texture Crunch Add-on
              </label>
              <div className={cn("grid gap-2.5", isMobile ? "grid-cols-2" : "grid-cols-4")}>
                {TOPPINGS.map((topping) => {
                  const isSelected = selectedToppingId === topping.id;
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => setSelectedToppingId(topping.id)}
                      style={{
                        backgroundColor: isSelected ? palette.surface : palette.bg,
                        borderColor: isSelected ? palette.accent : palette.line,
                        color: palette.text,
                      }}
                      className={cn(
                        "p-3 rounded-full border text-center cursor-pointer transition-all text-xs font-semibold min-h-[44px] flex items-center justify-center gap-1.5 focus-visible:outline-none",
                        isSelected ? "ring-1" : "hover:opacity-90"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                      <span className="truncate">{topping.name}</span>
                      {topping.price > 0 && (
                        <span style={{ color: palette.muted }} className="text-[10px]">
                          +${topping.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: palette.line }}>
              <div>
                <span
                  style={{ color: palette.text }}
                  className="text-xs font-bold uppercase tracking-wider block"
                >
                  Quantity
                </span>
                <span style={{ color: palette.muted }} className="text-xs">
                  Max 12 units per chilled dispatch
                </span>
              </div>
              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className="flex items-center gap-3 p-1 rounded-full border"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{
                    backgroundColor: palette.bg,
                    color: palette.text,
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-95 focus-visible:outline-none"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  style={{ color: palette.text }}
                  className="text-sm font-bold w-6 text-center tabular-nums"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(12, q + 1))}
                  aria-label="Increase quantity"
                  style={{
                    backgroundColor: palette.bg,
                    color: palette.text,
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-95 focus-visible:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className={isDesktop ? "col-span-5" : "col-span-1"}>
            <motion.div
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.line,
              }}
              className="rounded-[28px] border p-6 sm:p-8 space-y-6 sticky top-20 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: palette.accent }}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Real Order Summary
                </span>
                <span
                  style={{
                    backgroundColor: palette.bg,
                    borderColor: palette.line,
                    color: palette.text,
                  }}
                  className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1"
                >
                  <Snowflake className="w-3 h-3 text-sky-500" />
                  <span>Sub-Zero Packed</span>
                </span>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: FONT.display,
                    color: palette.text,
                  }}
                  className="text-2xl font-normal"
                >
                  {currentFormat.name}
                </h3>
                <p
                  style={{ color: palette.muted }}
                  className="text-xs sm:text-sm mt-1"
                >
                  {quantity}x {currentFormat.volume} of {currentFlavor.name}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: palette.bg,
                  borderColor: palette.line,
                }}
                className="rounded-2xl border p-4 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }}>Base Flavor:</span>
                  <span style={{ color: palette.text }} className="font-semibold">
                    {currentFlavor.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }}>Container Format:</span>
                  <span style={{ color: palette.text }} className="font-semibold">
                    {currentFormat.name} (${currentFormat.price})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }}>Added Crunch:</span>
                  <span style={{ color: palette.text }} className="font-semibold">
                    {currentTopping.name} {currentTopping.price > 0 ? `(+$${currentTopping.price})` : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }}>Units:</span>
                  <span style={{ color: palette.text }} className="font-semibold tabular-nums">
                    {quantity}
                  </span>
                </div>
                <div className="pt-2 border-t flex items-center justify-between font-bold" style={{ borderColor: palette.line }}>
                  <span style={{ color: palette.text }}>Total Price:</span>
                  <span
                    style={{
                      fontFamily: FONT.display,
                      color: palette.accent,
                    }}
                    className="text-xl tabular-nums"
                  >
                    ${totalPrice}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-[11px]" style={{ color: palette.muted }}>
                <p>Origin: {currentFlavor.origin}. Churned at {currentFlavor.churnTemp} with {currentFlavor.butterfat} grass-fed butterfat.</p>
                <p>Includes thermal insulated box and reusable ice cells. Shelf life 14 days in standard home freezer.</p>
              </div>

              <button
                type="button"
                onClick={handleAddOrder}
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className="w-full py-3.5 rounded-full font-semibold text-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
              >
                <AnimatePresence mode="wait">
                  {orderAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Added to Tasting Order!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Tasting Order (${totalPrice})</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="process"
        style={{
          borderColor: palette.line,
        }}
        className={cn(
          "max-w-7xl mx-auto border-t",
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-16" : "px-8 py-24"
        )}
      >
        <div className="max-w-2xl mb-8 sm:mb-12">
          <span
            style={{ color: palette.accent }}
            className="text-xs font-bold uppercase tracking-wider block mb-2"
          >
            Sub-Zero Method
          </span>
          <h2
            style={{
              fontFamily: FONT.display,
              color: palette.text,
            }}
            className={cn(
              "font-normal tracking-tight leading-[1.08]",
              isMobile ? "text-3xl" : "text-4xl sm:text-5xl"
            )}
          >
            Three steps from raw cream to velvet scoop.
          </h2>
        </div>

        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : isTablet ? "grid-cols-3" : "grid-cols-3")}>
          {PROCESS_STEPS.map((pStep) => (
            <div
              key={pStep.step}
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.line,
              }}
              className="rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span
                    style={{
                      fontFamily: FONT.display,
                      color: palette.accent,
                    }}
                    className="text-2xl font-bold"
                  >
                    {pStep.step}
                  </span>
                  <div
                    style={{
                      backgroundColor: palette.bg,
                      borderColor: palette.line,
                      color: palette.text,
                    }}
                    className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold"
                  >
                    {pStep.temperature} / {pStep.duration}
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: FONT.display,
                    color: palette.text,
                  }}
                  className="text-xl font-normal"
                >
                  {pStep.title}
                </h3>
                <p
                  style={{ color: palette.muted }}
                  className="mt-3 text-xs sm:text-sm leading-relaxed"
                >
                  {pStep.summary}
                </p>
              </div>

              <div
                style={{
                  borderColor: palette.line,
                  color: palette.muted,
                }}
                className="pt-4 mt-6 border-t text-[11px] font-semibold flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Small batch production daily</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="tasting-menu"
        style={{
          borderColor: palette.line,
        }}
        className={cn(
          "max-w-7xl mx-auto border-t",
          isMobile ? "px-4 py-12" : isTablet ? "px-6 py-16" : "px-8 py-24"
        )}
      >
        <div className="max-w-2xl mb-8 sm:mb-12">
          <span
            style={{ color: palette.accent }}
            className="text-xs font-bold uppercase tracking-wider block mb-2"
          >
            Tasting Room
          </span>
          <h2
            style={{
              fontFamily: FONT.display,
              color: palette.text,
            }}
            className={cn(
              "font-normal tracking-tight leading-[1.08]",
              isMobile ? "text-3xl" : "text-4xl sm:text-5xl"
            )}
          >
            Reserve an intimate salon table.
          </h2>
          <p
            style={{ color: palette.muted }}
            className="mt-3 text-sm sm:text-base leading-relaxed"
          >
            Experience our fresh rotary batches straight from the cryogenic drum. Paired with cold-brewed mountain teas.
          </p>
        </div>

        <div className={cn("grid gap-8 items-start", isDesktop ? "grid-cols-12" : "grid-cols-1")}>
          <div className={cn("space-y-4", isDesktop ? "col-span-7" : "col-span-1")}>
            {TASTING_SESSIONS.map((session) => {
              const isSelected = selectedSessionId === session.id;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSessionId(session.id)}
                  style={{
                    backgroundColor: isSelected ? palette.surface : palette.bg,
                    borderColor: isSelected ? palette.accent : palette.line,
                    color: palette.text,
                  }}
                  className={cn(
                    "w-full p-6 sm:p-7 rounded-[24px] border text-left cursor-pointer transition-all min-h-[44px] relative focus-visible:outline-none",
                    isSelected ? "ring-2 ring-offset-2 shadow-sm" : "hover:border-opacity-100"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: FONT.display,
                        color: palette.text,
                      }}
                      className="text-xl sm:text-2xl font-normal"
                    >
                      {session.title}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT.display,
                        color: palette.accent,
                      }}
                      className="text-xl font-bold tabular-nums"
                    >
                      ${session.pricePerGuest}
                      <span className="text-xs font-normal opacity-70"> / guest</span>
                    </span>
                  </div>

                  <div className={cn("grid gap-2 mt-4 text-xs", isMobile ? "grid-cols-1" : "grid-cols-2")} style={{ color: palette.muted }}>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{session.portions}</span>
                    </div>
                  </div>

                  <p
                    style={{ color: palette.muted }}
                    className="mt-3 text-xs leading-relaxed"
                  >
                    Pairing: {session.pairing}
                  </p>
                </button>
              );
            })}
          </div>

          <div className={isDesktop ? "col-span-5" : "col-span-1"}>
            <form
              onSubmit={handleConfirmReservation}
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.line,
              }}
              className="rounded-[28px] border p-6 sm:p-8 space-y-5 shadow-sm"
            >
              <div>
                <span
                  style={{ color: palette.accent }}
                  className="text-xs font-bold uppercase tracking-wider block"
                >
                  Salon Reservation
                </span>
                <h3
                  style={{
                    fontFamily: FONT.display,
                    color: palette.text,
                  }}
                  className="text-xl sm:text-2xl mt-1 font-normal"
                >
                  {currentSession.title}
                </h3>
              </div>

              <div>
                <label
                  style={{ color: palette.text }}
                  className="text-xs font-bold uppercase tracking-wider block mb-2"
                >
                  Party Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      style={{
                        backgroundColor: guestCount === num ? palette.accent : palette.bg,
                        color: guestCount === num ? palette.accentInk : palette.text,
                        borderColor: guestCount === num ? palette.accent : palette.line,
                      }}
                      className="py-2.5 rounded-full border text-xs font-semibold cursor-pointer transition-all min-h-[44px] flex items-center justify-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      <span>{num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{ color: palette.text }}
                  className="text-xs font-bold uppercase tracking-wider block mb-2"
                >
                  Date and Session
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Tomorrow 15:00", "Tomorrow 18:30", "Saturday 14:00", "Saturday 17:30"].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedDate(slot)}
                      style={{
                        backgroundColor: selectedDate === slot ? palette.surfaceHover : palette.bg,
                        borderColor: selectedDate === slot ? palette.accent : palette.line,
                        color: palette.text,
                      }}
                      className="p-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all min-h-[44px] flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span className="truncate">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: palette.bg,
                  borderColor: palette.line,
                }}
                className="rounded-2xl border p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }}>Table for:</span>
                  <span style={{ color: palette.text }} className="font-semibold">
                    {guestCount} {guestCount === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }}>Time:</span>
                  <span style={{ color: palette.text }} className="font-semibold">
                    {selectedDate}
                  </span>
                </div>
                <div className="pt-2 border-t flex items-center justify-between font-bold" style={{ borderColor: palette.line }}>
                  <span style={{ color: palette.text }}>Estimated Total:</span>
                  <span
                    style={{
                      fontFamily: FONT.display,
                      color: palette.accent,
                    }}
                    className="text-lg tabular-nums"
                  >
                    ${totalReservationPrice}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className="w-full py-3.5 rounded-full font-semibold text-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
              >
                <AnimatePresence mode="wait">
                  {reservationConfirmed ? (
                    <motion.span
                      key="confirmed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Table Reserved! Confirmation Sent</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="confirm"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>Confirm Table Reservation</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderColor: palette.line,
          backgroundColor: palette.surface,
        }}
        className={cn(
          "border-t mt-12 transition-colors duration-300",
          isMobile ? "py-10 px-4" : isTablet ? "py-12 px-6" : "py-16 px-8"
        )}
      >
        <div className={cn("max-w-7xl mx-auto grid gap-8", isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4")}>
          <div>
            <span
              style={{
                fontFamily: FONT.display,
                color: palette.text,
              }}
              className="text-xl font-bold block"
            >
              {config.brandName || "VELVET GELATO"}
            </span>
            <p
              style={{ color: palette.muted }}
              className="mt-2 text-xs leading-relaxed"
            >
              Sub-zero rotary churning atelier. Natural grass-fed dairy, Sicilian harvest fruits, zero synthetic stabilizers.
            </p>
          </div>

          <div>
            <span
              style={{ color: palette.text }}
              className="text-xs font-bold uppercase tracking-wider block mb-2"
            >
              Salon Location
            </span>
            <p style={{ color: palette.muted }} className="text-xs leading-relaxed">
              Via Manzoni 14<br />
              20121 Milano, Italy<br />
              Wednesday to Sunday, 12:00 to 21:00
            </p>
          </div>

          <div>
            <span
              style={{ color: palette.text }}
              className="text-xs font-bold uppercase tracking-wider block mb-2"
            >
              Allergen Policy
            </span>
            <p style={{ color: palette.muted }} className="text-xs leading-relaxed">
              Contains milk and tree nuts (Sicilian pistachios). Gluten-free facility. All dairy is low-heat pasteurized.
            </p>
          </div>

          <div>
            <span
              style={{ color: palette.text }}
              className="text-xs font-bold uppercase tracking-wider block mb-2"
            >
              Install Template
            </span>
            <button
              type="button"
              onClick={copyCli}
              style={{
                backgroundColor: palette.bg,
                borderColor: palette.line,
                color: palette.text,
              }}
              className="w-full p-2.5 rounded-xl border text-xs font-mono font-semibold flex items-center justify-between cursor-pointer hover:opacity-90 active:scale-95 transition-all min-h-[44px]"
            >
              <span className="truncate">npx nexoreui add...</span>
              {cliCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 shrink-0 opacity-70" />
              )}
            </button>
          </div>
        </div>

        <div
          style={{ borderColor: palette.line, color: palette.muted }}
          className="max-w-7xl mx-auto pt-8 mt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-3"
        >
          <p>© 2026 VELVET GELATO. Artisanal sub-zero confectionery.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="hover:underline cursor-pointer"
            >
              Switch to {isDark ? "Light" : "Dark"} Mode
            </button>
            <span>Milano / Paris</span>
          </div>
        </div>
      </footer>

      <div className={cn("fixed z-50", isMobile ? "bottom-4 right-4" : "bottom-6 right-6")}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          style={{
            borderColor: palette.line,
            backgroundColor: palette.surface,
            color: palette.text,
          }}
          className={cn(
            "flex items-center gap-2 rounded-full border shadow-xl font-semibold cursor-pointer transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none min-h-[44px]",
            isMobile ? "px-3 py-2 text-[11px]" : "px-4 py-2.5 text-xs"
          )}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light theme</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-amber-700" />
              <span>Dark theme</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
