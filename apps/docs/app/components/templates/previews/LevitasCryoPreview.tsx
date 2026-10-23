"use client";

import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Check,
  ArrowRight,
  ChevronRight,
  Copy,
  Clock,
  MapPin,
  Calendar,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ───────────────────────────────────────────────────────────────────────────
   1. Typography & P6 Glacier Mono Tokens (True Dark & Crisp Light)
─────────────────────────────────────────────────────────────────────────── */

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap";

const FONT = {
  display: '"Inter Tight", -apple-system, BlinkMacSystemFont, sans-serif',
  body: '"Inter Tight", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

const PALETTES = {
  light: {
    bg: "#EEF1F5",
    surface: "#E2E6EC",
    line: "#CBD1DA",
    text: "#0F141C",
    muted: "#586270",
    accent: "#0A6CFF",
    accentInk: "#FFFFFF",
  },
  dark: {
    bg: "#0B0C0E",
    surface: "#15161A",
    line: "#24252B",
    text: "#EDEDF2",
    muted: "#848794",
    accent: "#3875FF",
    accentInk: "#FFFFFF",
  },
};

const MOTION = {
  springPrecise: { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const,
  springLookbook: { stiffness: 320, damping: 34, mass: 0.8 } as const,
  springMagnet: { stiffness: 450, damping: 35, mass: 0.5 } as const,
  easeClip: [0.2, 0, 0, 1] as const,
  durationClip: 0.5,
  easeHover: [0.2, 0, 0, 1] as const,
  durationHover: 0.18,
  pressScale: 0.98,
};

const VIDEO_PATH = "/videos/levitas-cryo-" + "sph" + "eres.mp4";

/* ───────────────────────────────────────────────────────────────────────────
   2. Real Artisanal Flavor Content Models
─────────────────────────────────────────────────────────────────────────── */

export interface FlavorCreation {
  id: string;
  frameNumber: string;
  name: string;
  subtitle: string;
  ingredients: string;
  editorialNote: string;
  price: number;
  textureNote: string;
}

export const FLAVOR_CREATIONS: FlavorCreation[] = [
  {
    id: "kurogoma",
    frameNumber: "01",
    name: "Kurogoma Sesame",
    subtitle: "Toasted black sesame & Venezuelan cacao",
    ingredients: "Stone-milled black sesame gelato, 85% Venezuelan dark chocolate shell, flaky sea salt.",
    editorialNote: "A crisp dark chocolate shell that gives way to warm, toasted sesame gelato.",
    price: 42,
    textureNote: "Flash-frozen chocolate shell",
  },
  {
    id: "tartufo",
    frameNumber: "02",
    name: "Tartufo Bianco",
    subtitle: "Piedmont white truffle & mascarpone",
    ingredients: "Piedmont white truffle infusion, whipped mascarpone cream, Maldon salt flakes.",
    editorialNote: "Delicate earthiness balanced by chilled velvet mascarpone and sea salt.",
    price: 48,
    textureNote: "Slow-churned velvet emulsion",
  },
  {
    id: "cloudberry",
    frameNumber: "03",
    name: "Nordic Cloudberry",
    subtitle: "Wild Arctic berry & birch sap",
    ingredients: "Wild Lappland cloudberry reduction, cold birch sap essence, roasted alpine pine sugar.",
    editorialNote: "High-latitude berry acidity softened with aromatic birch sap sweetness.",
    price: 44,
    textureNote: "Sub-zero fruit reduction",
  },
  {
    id: "matcha",
    frameNumber: "04",
    name: "Ceremonial Matcha",
    subtitle: "First-harvest Uji tencha & yuzu",
    ingredients: "First-harvest Uji tencha green tea, sweet nitrogenized cream, candied yuzu peel.",
    editorialNote: "Vibrant vegetal umami encased in crisp citrus and sweet frozen cream.",
    price: 46,
    textureNote: "Stone-ground tencha leaf",
  },
];

export const TASTING_FLIGHTS = [
  {
    id: "duo",
    title: "Atelier Duo Flight",
    guests: "2 guests",
    duration: "60 minutes",
    description: "Three flash-frozen creations served sequentially, highlighting crisp chocolate shells and unctuous cream.",
    price: 140,
  },
  {
    id: "cellar",
    title: "Private Cellar Degustation",
    guests: "4 guests",
    duration: "90 minutes",
    description: "Complete four-course seasonal flight paired with cold-brewed rare mountain teas.",
    price: 260,
  },
  {
    id: "single",
    title: "Single Creation Tasting",
    guests: "1 guest",
    duration: "30 minutes",
    description: "Your choice of any seasonal creation served immediately with roasted green tea.",
    price: 42,
  },
];

/* ───────────────────────────────────────────────────────────────────────────
   3. Viewport & Scroll Helpers (Nearest Scroller)
─────────────────────────────────────────────────────────────────────────── */

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

function useViewHeight(ref: RefObject<HTMLElement | null>): number {
  const [h, setH] = useState(800);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const read = () => setH(s ? s.clientHeight : window.innerHeight);
    read();
    if (s) {
      const ro = new ResizeObserver(read);
      ro.observe(s);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [ref]);
  return h;
}

function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  kind: "leave" | "track",
  viewH: number
) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const rel = r.top - top;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -rel / total)) : 0);
    };
    update();
    const target: HTMLElement | Window = s ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, kind, mv, viewH]);
  return mv;
}

function useScrollDepth(ref: RefObject<HTMLElement | null>) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const total = r.height - vh;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -(r.top - top) / total)) : 0);
    };
    update();
    const target: HTMLElement | Window = s ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);
  return mv;
}

/* ───────────────────────────────────────────────────────────────────────────
   4. Micro Components (Magnetic Button, Counters)
─────────────────────────────────────────────────────────────────────────── */

function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplayValue(value);
      return;
    }
    const duration = 1.0;
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

function MagneticButton({
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const x = useSpring(0, MOTION.springMagnet);
  const y = useSpring(0, MOTION.springMagnet);
  const reduce = useReducedMotion();

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: MOTION.pressScale }}
      style={{ x, y, ...style }}
      className={cn(
        "cursor-pointer select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   5. Header with Device-Adaptive Navigation & Theme Controls
─────────────────────────────────────────────────────────────────────────── */

function Header({
  brandName,
  onNavigate,
  palette,
  currentTheme,
  onToggleTheme,
  isMobile,
  isTablet,
  isDesktop,
}: {
  brandName: string;
  onNavigate: (id: string) => void;
  palette: typeof PALETTES.light;
  currentTheme: "light" | "dark";
  onToggleTheme: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}) {
  return (
    <header
      style={{
        borderColor: palette.line,
        backgroundColor: palette.bg,
      }}
      className={cn(
        "sticky top-0 z-40 w-full border-b flex items-center justify-between transition-colors duration-500",
        isMobile ? "px-4 py-3" : isTablet ? "px-6 py-3.5" : "px-10 lg:px-14 py-4"
      )}
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => onNavigate("#hero")}
          style={{ fontFamily: FONT.display, color: palette.text }}
          className={cn(
            "font-bold tracking-tight cursor-pointer focus-visible:outline-none",
            isMobile ? "text-sm" : "text-base sm:text-lg"
          )}
        >
          {brandName}
        </button>

        {!isMobile && (
          <span style={{ color: palette.muted }} className="text-xs sm:text-sm">
            Cryo-Gelato Atelier
          </span>
        )}
      </div>

      {/* Nav links only shown on desktop to prevent crowding on tablet/mobile frame */}
      {isDesktop && (
        <nav aria-label="Main" className="flex items-center gap-8">
          {[
            { id: "hero", label: "Overview" },
            { id: "craft", label: "The Craft" },
            { id: "lookbook", label: "Flavors" },
            { id: "menu", label: "Tasting Menu" },
            { id: "reserve", label: "Reservations" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(`#${item.id}`)}
              style={{ fontFamily: FONT.body, color: palette.muted }}
              className="text-sm hover:text-black dark:hover:text-white transition-colors cursor-pointer focus-visible:outline-none"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {/* Right controls */}
      <div className={cn("flex items-center gap-2 sm:gap-3", isDesktop ? "mr-36 xl:mr-44" : "")}>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme mode"
          style={{
            borderColor: palette.line,
            backgroundColor: palette.surface,
            color: palette.text,
            fontFamily: FONT.body,
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-colors focus-visible:outline-none"
        >
          {currentTheme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5" style={{ color: palette.accent }} />
              {!isMobile && <span>Light</span>}
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5" style={{ color: palette.accent }} />
              {!isMobile && <span>Dark</span>}
            </>
          )}
        </button>

        <MagneticButton
          onClick={() => onNavigate("#reserve")}
          style={{
            backgroundColor: palette.accent,
            color: palette.accentInk,
            fontFamily: FONT.body,
          }}
          className={cn(
            "rounded-full transition-colors font-medium",
            isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
          )}
        >
          Book table
        </MagneticButton>
      </div>
    </header>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   6. Section 1: Hero Stage with Full-Canvas Atmospheric Video
─────────────────────────────────────────────────────────────────────────── */

function HeroSection({
  heroRef,
  palette,
  currentTheme,
  isMobile,
  isTablet,
  onNavigate,
}: {
  heroRef: RefObject<HTMLElement | null>;
  palette: typeof PALETTES.light;
  currentTheme: "light" | "dark";
  isMobile: boolean;
  isTablet: boolean;
  onNavigate: (id: string) => void;
}) {
  return (
    <section
      id="hero"
      ref={heroRef}
      aria-label="Overview"
      style={{ borderColor: palette.line }}
      className={cn(
        "relative w-full flex flex-col justify-between overflow-hidden border-b",
        isMobile
          ? "min-h-[500px] px-5 py-10"
          : isTablet
          ? "min-h-[620px] px-8 py-16"
          : "min-h-[88vh] lg:min-h-[92vh] px-10 lg:px-14 py-20 lg:py-24"
      )}
    >
      {/* Full-Canvas Ambient Living Atmosphere Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          src={VIDEO_PATH}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Adaptive atmosphere scrim gradient based on theme & device */}
        <div
          style={{
            background:
              currentTheme === "dark"
                ? isMobile
                  ? "linear-gradient(to bottom, rgba(11,12,14,0.92) 0%, rgba(11,12,14,0.85) 60%, rgba(11,12,14,0.96) 100%)"
                  : "linear-gradient(to right, rgba(11,12,14,0.96) 0%, rgba(11,12,14,0.85) 45%, rgba(11,12,14,0.35) 100%), linear-gradient(to top, rgba(11,12,14,1) 0%, transparent 40%)"
                : isMobile
                ? "linear-gradient(to bottom, rgba(238,241,245,0.94) 0%, rgba(238,241,245,0.88) 60%, rgba(238,241,245,0.98) 100%)"
                : "linear-gradient(to right, rgba(238,241,245,0.97) 0%, rgba(238,241,245,0.86) 45%, rgba(238,241,245,0.40) 100%), linear-gradient(to top, rgba(238,241,245,1) 0%, transparent 40%)",
          }}
          className="absolute inset-0 transition-colors duration-500"
        />
      </div>

      {/* Hero Headline & Story Layer */}
      <div
        className={cn(
          "relative z-10 space-y-4 sm:space-y-6 my-auto",
          isMobile ? "max-w-full" : "max-w-3xl"
        )}
      >
        <h1
          style={{ fontFamily: FONT.display, color: palette.text }}
          className={cn(
            "font-bold tracking-tight text-left",
            isMobile
              ? "text-3xl leading-[1.05]"
              : isTablet
              ? "text-5xl sm:text-6xl leading-[0.98]"
              : "text-7xl xl:text-8xl leading-[0.95]"
          )}
        >
          Sub-zero gelato, frozen before your eyes.
        </h1>

        <p
          style={{ fontFamily: FONT.body, color: palette.muted }}
          className={cn(
            "leading-relaxed",
            isMobile ? "text-sm max-w-full" : "text-base sm:text-lg max-w-[54ch]"
          )}
        >
          Liquid nitrogen flash-freezing creates an ultra-brittle chocolate and fruit shell that shatters to reveal slow-churned, unctuous gelato inside. Prepared fresh to order for every table.
        </p>

        <div className={cn("pt-2", isMobile ? "flex flex-col gap-3 w-full" : "flex flex-wrap items-center gap-4")}>
          <MagneticButton
            onClick={() => onNavigate("#reserve")}
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
              fontFamily: FONT.body,
            }}
            className={cn(
              "text-sm font-medium rounded-full flex items-center justify-center gap-2 min-h-[44px]",
              isMobile ? "w-full py-3.5" : "px-6 py-3.5"
            )}
          >
            <span>Reserve a tasting table</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <button
            type="button"
            onClick={() => onNavigate("#lookbook")}
            style={{
              borderColor: palette.line,
              backgroundColor: `${palette.surface}90`,
              color: palette.text,
              fontFamily: FONT.body,
            }}
            className={cn(
              "text-sm font-medium border rounded-full hover:border-black dark:hover:border-white transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none backdrop-blur-sm",
              isMobile ? "w-full py-3.5" : "px-5 py-3.5"
            )}
          >
            Explore seasonal flavors
          </button>
        </div>
      </div>

      {/* Bottom Parameter Bar */}
      <div
        style={{ borderColor: palette.line }}
        className={cn(
          "relative z-10 pt-6 sm:pt-8 border-t max-w-4xl",
          isMobile ? "grid grid-cols-1 gap-3" : "grid grid-cols-3 gap-6"
        )}
      >
        <div className={isMobile ? "flex items-center justify-between" : ""}>
          <span style={{ color: palette.muted, fontFamily: FONT.body }} className="text-xs block">
            Serving style
          </span>
          <span style={{ color: palette.text, fontFamily: FONT.display }} className="text-sm sm:text-base font-bold sm:mt-1 block">
            Flash-crystallized
          </span>
        </div>

        <div className={isMobile ? "flex items-center justify-between" : ""}>
          <span style={{ color: palette.muted, fontFamily: FONT.body }} className="text-xs block">
            Base cream
          </span>
          <span style={{ color: palette.text, fontFamily: FONT.display }} className="text-sm sm:text-base font-bold sm:mt-1 block">
            Grass-fed dairy
          </span>
        </div>

        <div className={isMobile ? "flex items-center justify-between" : ""}>
          <span style={{ color: palette.muted, fontFamily: FONT.body }} className="text-xs block">
            Atelier seatings
          </span>
          <span style={{ color: palette.text, fontFamily: FONT.display }} className="text-sm sm:text-base font-bold sm:mt-1 block">
            Intimate tables
          </span>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   7. Section 2: Pure Typographic Editorial Craft
─────────────────────────────────────────────────────────────────────────── */

function CraftSection({
  palette,
  isMobile,
  isTablet,
}: {
  palette: typeof PALETTES.light;
  isMobile: boolean;
  isTablet: boolean;
}) {
  return (
    <section
      id="craft"
      aria-label="The Craft"
      style={{ borderColor: palette.line }}
      className={cn(
        "w-full border-b transition-colors duration-500",
        isMobile ? "py-14 px-5" : isTablet ? "py-20 px-8" : "py-24 px-10 lg:px-14"
      )}
    >
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className={isMobile || isTablet ? "flex flex-col gap-4" : "grid grid-cols-12 gap-8 items-start"}>
          <div className={isMobile || isTablet ? "w-full" : "col-span-6"}>
            <h2
              style={{ fontFamily: FONT.display, color: palette.text }}
              className={cn(
                "font-bold tracking-tight leading-[0.98]",
                isMobile ? "text-2xl sm:text-3xl" : isTablet ? "text-3xl sm:text-4xl" : "text-4xl lg:text-5xl"
              )}
            >
              Freshly churned, frozen in seconds.
            </h2>
          </div>

          <div className={isMobile || isTablet ? "w-full" : "col-span-6"}>
            <p
              style={{ fontFamily: FONT.body, color: palette.muted }}
              className={cn("leading-relaxed", isMobile ? "text-sm" : "text-base sm:text-lg max-w-[58ch]")}
            >
              Traditional freezing takes hours, allowing water molecules to bind into large, coarse ice crystals. By freezing in seconds with liquid nitrogen, ice crystals never have time to grow. The result is an impossibly smooth texture that melts cleanly without gums or artificial emulsifiers.
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: palette.line }} className="h-px w-full" />

        {/* Craft Cards Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <div
          className={cn(
            "grid",
            isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-3 gap-8"
          )}
        >
          <div
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
            }}
            className="p-6 sm:p-8 rounded-2xl border space-y-3"
          >
            <h3
              style={{ fontFamily: FONT.display, color: palette.text }}
              className="text-base sm:text-lg font-bold tracking-tight"
            >
              Instant micro-crystal freeze
            </h3>
            <p
              style={{ fontFamily: FONT.body, color: palette.muted }}
              className="text-xs sm:text-sm leading-relaxed"
            >
              Immersion freezing occurs so fast that dairy fats and fruit reductions remain in microscopic suspension, producing a dense, velvet mouthfeel.
            </p>
          </div>

          <div
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
            }}
            className="p-6 sm:p-8 rounded-2xl border space-y-3"
          >
            <h3
              style={{ fontFamily: FONT.display, color: palette.text }}
              className="text-base sm:text-lg font-bold tracking-tight"
            >
              Zero stabilizers or gums
            </h3>
            <p
              style={{ fontFamily: FONT.body, color: palette.muted }}
              className="text-xs sm:text-sm leading-relaxed"
            >
              Because rapid freezing eliminates ice graininess naturally, we never use guar gum, carrageenan, or industrial emulsifiers. Just pure organic cream and sugar.
            </p>
          </div>

          <div
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
            }}
            className={cn(
              "p-6 sm:p-8 rounded-2xl border space-y-3",
              isTablet ? "col-span-2" : ""
            )}
          >
            <h3
              style={{ fontFamily: FONT.display, color: palette.text }}
              className="text-base sm:text-lg font-bold tracking-tight"
            >
              Brittle chocolate shell
            </h3>
            <p
              style={{ fontFamily: FONT.body, color: palette.muted }}
              className="text-xs sm:text-sm leading-relaxed"
            >
              Each portion is coated in single-origin cacao or candied fruit glaze immediately prior to dipping, forming a paper-thin shell that snaps with a single spoon tap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   8. Section 3: Signature Moment S5 - Pinned Lookbook with Device Adapters
─────────────────────────────────────────────────────────────────────────── */

function HorizontalLookbookSection({
  lookbookRef,
  palette,
  isMobile,
  isTablet,
  onBook,
}: {
  lookbookRef: RefObject<HTMLElement | null>;
  palette: typeof PALETTES.light;
  isMobile: boolean;
  isTablet: boolean;
  onBook: () => void;
}) {
  const reduce = useReducedMotion();
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  const viewH = useViewHeight(lookbookRef);
  const trackProgress = useScrollProgress(lookbookRef, "track", viewH);
  const springProgress = useSpring(trackProgress, MOTION.springLookbook);

  useEffect(() => {
    const unsubscribe = trackProgress.on("change", (v) => {
      const idx = Math.min(
        FLAVOR_CREATIONS.length - 1,
        Math.floor(v * FLAVOR_CREATIONS.length)
      );
      setActiveFrameIndex(idx);
    });
    return () => unsubscribe();
  }, [trackProgress]);

  const translateX = useTransform(
    springProgress,
    [0, 1],
    ["0%", `-${(FLAVOR_CREATIONS.length - 1) * 25}%`]
  );

  return (
    <section
      id="lookbook"
      ref={lookbookRef}
      aria-label="Seasonal Flavors"
      style={{
        borderColor: palette.line,
        height: isMobile ? "auto" : isTablet ? `${viewH * 2.5}px` : `${viewH * 3.4}px`,
      }}
      className={cn(
        "relative w-full border-b transition-colors duration-500",
        isMobile ? "py-14 px-5" : ""
      )}
    >
      {!isMobile ? (
        /* Desktop & Tablet Pinned Horizontal Track */
        <div
          style={{ height: `${viewH}px` }}
          className={cn(
            "sticky top-0 w-full overflow-hidden flex flex-col justify-between",
            isTablet ? "py-8 px-8" : "py-10 px-10 lg:px-14"
          )}
        >
          {/* Header */}
          <div
            style={{ borderColor: palette.line }}
            className="flex items-center justify-between pb-4 sm:pb-6 border-b"
          >
            <div>
              <h2
                style={{ fontFamily: FONT.display, color: palette.text }}
                className={cn(
                  "font-bold tracking-tight",
                  isTablet ? "text-2xl" : "text-2xl sm:text-3xl"
                )}
              >
                Four seasonal creations
              </h2>
              <p
                style={{ fontFamily: FONT.body, color: palette.muted }}
                className="text-xs sm:text-sm mt-0.5 sm:mt-1"
              >
                Explore our current tasting portions, each presented in an intimate seasonal formulation.
              </p>
            </div>

            {/* Frame Jump Navigation */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {FLAVOR_CREATIONS.map((f, i) => {
                const isActive = activeFrameIndex === i;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFrameIndex(i)}
                    style={{
                      fontFamily: FONT.mono,
                      borderColor: isActive ? palette.accent : palette.line,
                      backgroundColor: isActive ? palette.surface : "transparent",
                      color: isActive ? palette.accent : palette.muted,
                    }}
                    className="px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer focus-visible:outline-none"
                  >
                    <span>{f.frameNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Translating Track */}
          <div className="relative w-full overflow-hidden my-auto py-2 sm:py-4">
            <motion.div
              style={{
                x: reduce ? "0%" : translateX,
                width: `${FLAVOR_CREATIONS.length * 100}%`,
              }}
              className="flex items-stretch"
            >
              {/* Frame 1: Kurogoma Sesame (Split: Media Left + Details Right) */}
              <div style={{ width: "25%" }} className="px-3 sm:px-4 flex-shrink-0">
                <div
                  style={{
                    borderColor: palette.line,
                    backgroundColor: palette.surface,
                  }}
                  className={cn(
                    "rounded-3xl border grid items-center",
                    isTablet ? "p-6 grid-cols-12 gap-6" : "p-8 grid-cols-12 gap-8"
                  )}
                >
                  <div className={isTablet ? "col-span-5" : "col-span-5"}>
                    <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-black/5 relative">
                      <video
                        src={VIDEO_PATH}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-105"
                      />
                      <div
                        style={{ boxShadow: `inset 0 0 24px 6px ${palette.surface}` }}
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className={cn("space-y-4 text-left", isTablet ? "col-span-7" : "col-span-7")}>
                    <span
                      style={{ fontFamily: FONT.mono, color: palette.accent }}
                      className="text-xs"
                    >
                      {FLAVOR_CREATIONS[0].frameNumber}
                    </span>

                    <h3
                      style={{ fontFamily: FONT.display, color: palette.text }}
                      className={cn("font-bold tracking-tight", isTablet ? "text-2xl" : "text-3xl")}
                    >
                      {FLAVOR_CREATIONS[0].name}
                    </h3>

                    <p
                      style={{ fontFamily: FONT.body, color: palette.text }}
                      className="text-sm sm:text-base font-medium"
                    >
                      {FLAVOR_CREATIONS[0].subtitle}
                    </p>

                    <p style={{ color: palette.muted }} className="text-xs sm:text-sm leading-relaxed">
                      {FLAVOR_CREATIONS[0].ingredients}
                    </p>

                    <p
                      style={{
                        fontFamily: FONT.body,
                        color: palette.text,
                        borderColor: palette.line,
                      }}
                      className="text-xs sm:text-sm italic pt-2 border-t"
                    >
                      &ldquo;{FLAVOR_CREATIONS[0].editorialNote}&rdquo;
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span style={{ color: palette.text }} className="text-base sm:text-lg font-bold">
                        ${FLAVOR_CREATIONS[0].price}
                      </span>
                      <button
                        type="button"
                        onClick={onBook}
                        style={{ color: palette.accent }}
                        className="text-xs sm:text-sm font-medium hover:underline cursor-pointer"
                      >
                        Reserve in flight &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 2: Tartufo Bianco (Wide Panoramic Top + 2-Col Text Below) */}
              <div style={{ width: "25%" }} className="px-3 sm:px-4 flex-shrink-0">
                <div
                  style={{
                    borderColor: palette.line,
                    backgroundColor: palette.surface,
                  }}
                  className={cn(
                    "rounded-3xl border flex flex-col justify-between",
                    isTablet ? "p-6 space-y-4" : "p-8 space-y-6"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{ fontFamily: FONT.mono, color: palette.accent }}
                      className="text-xs"
                    >
                      {FLAVOR_CREATIONS[1].frameNumber}
                    </span>
                    <span style={{ color: palette.muted }} className="text-xs">
                      {FLAVOR_CREATIONS[1].textureNote}
                    </span>
                  </div>

                  <div className={cn("rounded-2xl overflow-hidden bg-black/5 relative", isTablet ? "aspect-[24/9]" : "aspect-[21/9]")}>
                    <video
                      src={VIDEO_PATH}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-105"
                    />
                    <div
                      style={{ boxShadow: `inset 0 0 24px 6px ${palette.surface}` }}
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                    />
                  </div>

                  <div className="grid grid-cols-12 gap-6 items-start text-left pt-1">
                    <div className="col-span-7 space-y-2">
                      <h3
                        style={{ fontFamily: FONT.display, color: palette.text }}
                        className={cn("font-bold tracking-tight", isTablet ? "text-2xl" : "text-3xl")}
                      >
                        {FLAVOR_CREATIONS[1].name}
                      </h3>
                      <p
                        style={{ fontFamily: FONT.body, color: palette.text }}
                        className="text-xs sm:text-sm italic"
                      >
                        &ldquo;{FLAVOR_CREATIONS[1].editorialNote}&rdquo;
                      </p>
                    </div>

                    <div className="col-span-5 space-y-2">
                      <p style={{ color: palette.muted }} className="text-xs leading-relaxed">
                        {FLAVOR_CREATIONS[1].ingredients}
                      </p>
                      <div
                        className="flex items-center justify-between pt-2 border-t"
                        style={{ borderColor: palette.line }}
                      >
                        <span style={{ color: palette.text }} className="text-base sm:text-lg font-bold">
                          ${FLAVOR_CREATIONS[1].price}
                        </span>
                        <button
                          type="button"
                          onClick={onBook}
                          style={{ color: palette.accent }}
                          className="text-xs sm:text-sm font-medium hover:underline cursor-pointer"
                        >
                          Reserve &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 3: Nordic Cloudberry (Off-Center Card) */}
              <div style={{ width: "25%" }} className="px-3 sm:px-4 flex-shrink-0">
                <div
                  style={{
                    borderColor: palette.line,
                    backgroundColor: palette.surface,
                  }}
                  className={cn(
                    "rounded-3xl border grid items-center text-left",
                    isTablet ? "p-6 grid-cols-12 gap-6" : "p-8 grid-cols-12 gap-8"
                  )}
                >
                  <div className="col-span-6 space-y-4">
                    <span
                      style={{ fontFamily: FONT.mono, color: palette.accent }}
                      className="text-xs"
                    >
                      {FLAVOR_CREATIONS[2].frameNumber}
                    </span>

                    <h3
                      style={{ fontFamily: FONT.display, color: palette.text }}
                      className={cn("font-bold tracking-tight", isTablet ? "text-2xl" : "text-3xl")}
                    >
                      {FLAVOR_CREATIONS[2].name}
                    </h3>

                    <p style={{ color: palette.muted }} className="text-xs sm:text-sm leading-relaxed">
                      {FLAVOR_CREATIONS[2].ingredients}
                    </p>

                    <p
                      style={{
                        fontFamily: FONT.body,
                        color: palette.text,
                        borderColor: palette.accent,
                      }}
                      className="text-xs sm:text-sm italic border-l-2 pl-3"
                    >
                      &ldquo;{FLAVOR_CREATIONS[2].editorialNote}&rdquo;
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span style={{ color: palette.text }} className="text-base sm:text-lg font-bold">
                        ${FLAVOR_CREATIONS[2].price}
                      </span>
                      <button
                        type="button"
                        onClick={onBook}
                        style={{ color: palette.accent }}
                        className="text-xs sm:text-sm font-medium hover:underline cursor-pointer"
                      >
                        Reserve flight &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-black/5 relative">
                      <video
                        src={VIDEO_PATH}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-105"
                      />
                      <div
                        style={{ boxShadow: `inset 0 0 24px 6px ${palette.surface}` }}
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 4: Ceremonial Matcha (Inverted Split) */}
              <div style={{ width: "25%" }} className="px-3 sm:px-4 flex-shrink-0">
                <div
                  style={{
                    borderColor: palette.line,
                    backgroundColor: palette.surface,
                  }}
                  className={cn(
                    "rounded-3xl border grid items-center text-left",
                    isTablet ? "p-6 grid-cols-12 gap-6" : "p-8 grid-cols-12 gap-8"
                  )}
                >
                  <div className="col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        style={{ fontFamily: FONT.mono, color: palette.accent }}
                        className="text-xs"
                      >
                        {FLAVOR_CREATIONS[3].frameNumber}
                      </span>
                      <span style={{ color: palette.muted }} className="text-xs">
                        {FLAVOR_CREATIONS[3].subtitle}
                      </span>
                    </div>

                    <h3
                      style={{ fontFamily: FONT.display, color: palette.text }}
                      className={cn("font-bold tracking-tight", isTablet ? "text-2xl" : "text-3xl")}
                    >
                      {FLAVOR_CREATIONS[3].name}
                    </h3>

                    <p style={{ color: palette.muted }} className="text-xs sm:text-sm leading-relaxed">
                      {FLAVOR_CREATIONS[3].ingredients}
                    </p>

                    <p
                      style={{
                        fontFamily: FONT.body,
                        color: palette.text,
                        borderColor: palette.line,
                      }}
                      className="text-xs sm:text-sm italic pt-2 border-t"
                    >
                      &ldquo;{FLAVOR_CREATIONS[3].editorialNote}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span style={{ color: palette.text }} className="text-base sm:text-lg font-bold">
                        ${FLAVOR_CREATIONS[3].price}
                      </span>
                      <button
                        type="button"
                        onClick={onBook}
                        style={{ color: palette.accent }}
                        className="text-xs sm:text-sm font-medium hover:underline cursor-pointer"
                      >
                        Reserve flight &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="col-span-5">
                    <div className="rounded-2xl overflow-hidden aspect-square bg-black/5 relative">
                      <video
                        src={VIDEO_PATH}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-105"
                      />
                      <div
                        style={{ boxShadow: `inset 0 0 24px 6px ${palette.surface}` }}
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div
            style={{ borderColor: palette.line }}
            className="flex items-center justify-between pt-3 sm:pt-4 border-t"
          >
            <span style={{ color: palette.muted }} className="text-xs">
              Scroll horizontally to view seasonal creations
            </span>

            <div className="w-36 sm:w-48 h-1 rounded-full relative overflow-hidden" style={{ backgroundColor: palette.surface }}>
              <motion.div
                style={{
                  scaleX: trackProgress,
                  backgroundColor: palette.accent,
                }}
                className="absolute inset-0 origin-left rounded-full"
              />
            </div>

            <span
              style={{ fontFamily: FONT.mono, color: palette.text }}
              className="text-xs font-medium"
            >
              0{activeFrameIndex + 1} / 04
            </span>
          </div>
        </div>
      ) : (
        /* Mobile Touch-Friendly Snap Strip (Instant on deviceMode === 'mobile') */
        <div className="space-y-5">
          <div className="space-y-1">
            <h2
              style={{ fontFamily: FONT.display, color: palette.text }}
              className="text-2xl font-bold tracking-tight"
            >
              Four seasonal creations
            </h2>
            <p style={{ color: palette.muted }} className="text-xs">
              Swipe to explore our current tasting portions.
            </p>
          </div>

          <div className="flex gap-2">
            {FLAVOR_CREATIONS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFrameIndex(i)}
                style={{
                  fontFamily: FONT.mono,
                  borderColor: activeFrameIndex === i ? palette.accent : palette.line,
                  backgroundColor: activeFrameIndex === i ? palette.surface : "transparent",
                  color: activeFrameIndex === i ? palette.accent : palette.muted,
                }}
                className="px-3 py-1.5 text-xs rounded-full border cursor-pointer"
              >
                {f.frameNumber}
              </button>
            ))}
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5">
            {FLAVOR_CREATIONS.map((frame) => (
              <div
                key={frame.id}
                style={{
                  borderColor: palette.line,
                  backgroundColor: palette.surface,
                }}
                className="snap-center min-w-[82%] max-w-[88%] rounded-2xl border p-5 flex flex-col justify-between space-y-4 flex-shrink-0"
              >
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: palette.line }}>
                  <span style={{ fontFamily: FONT.mono, color: palette.accent }} className="text-xs">
                    {frame.frameNumber}
                  </span>
                  <span style={{ color: palette.text }} className="text-sm font-bold">
                    ${frame.price}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    style={{ fontFamily: FONT.display, color: palette.text }}
                    className="text-xl font-bold tracking-tight"
                  >
                    {frame.name}
                  </h3>
                  <p style={{ color: palette.muted }} className="text-xs">
                    {frame.subtitle}
                  </p>
                </div>

                <p style={{ color: palette.muted }} className="text-xs leading-relaxed">
                  {frame.ingredients}
                </p>

                <p style={{ color: palette.text }} className="text-xs italic">
                  &ldquo;{frame.editorialNote}&rdquo;
                </p>

                <button
                  type="button"
                  onClick={onBook}
                  style={{
                    backgroundColor: palette.accent,
                    color: palette.accentInk,
                    fontFamily: FONT.body,
                  }}
                  className="w-full py-2.5 text-xs font-medium rounded-full mt-2 cursor-pointer"
                >
                  Reserve this flavor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   9. Section 4: Tasting Menu & Pairings (Device Adaptive)
─────────────────────────────────────────────────────────────────────────── */

function TastingMenuSection({
  palette,
  isMobile,
  isTablet,
  onBook,
}: {
  palette: typeof PALETTES.light;
  isMobile: boolean;
  isTablet: boolean;
  onBook: (flightId: string) => void;
}) {
  return (
    <section
      id="menu"
      aria-label="Tasting Menu"
      style={{ borderColor: palette.line }}
      className={cn(
        "w-full border-b transition-colors duration-500",
        isMobile ? "py-14 px-5" : isTablet ? "py-20 px-8" : "py-24 px-10 lg:px-14"
      )}
    >
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className="space-y-2 sm:space-y-3">
          <h2
            style={{ fontFamily: FONT.display, color: palette.text }}
            className={cn(
              "font-bold tracking-tight",
              isMobile ? "text-2xl sm:text-3xl" : isTablet ? "text-3xl sm:text-4xl" : "text-4xl lg:text-5xl"
            )}
          >
            Tasting flights and pairings
          </h2>
          <p
            style={{ fontFamily: FONT.body, color: palette.muted }}
            className={cn("leading-relaxed", isMobile ? "text-sm" : "text-base sm:text-lg max-w-[60ch]")}
          >
            All tastings are hosted in our dining room with individual portions prepared fresh at your table.
          </p>
        </div>

        {/* 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <div
          className={cn(
            "grid",
            isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-3 gap-6"
          )}
        >
          {TASTING_FLIGHTS.map((flight, idx) => (
            <div
              key={flight.id}
              style={{
                borderColor: palette.line,
                backgroundColor: palette.surface,
              }}
              className={cn(
                "rounded-2xl border p-6 sm:p-8 flex flex-col justify-between space-y-6",
                isTablet && idx === 2 ? "col-span-2" : ""
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ color: palette.muted }} className="text-xs">
                    {flight.guests}
                  </span>
                  <span style={{ color: palette.muted }} className="text-xs">
                    {flight.duration}
                  </span>
                </div>

                <h3
                  style={{ fontFamily: FONT.display, color: palette.text }}
                  className={cn("font-bold tracking-tight", isMobile ? "text-xl" : "text-2xl")}
                >
                  {flight.title}
                </h3>

                <p style={{ color: palette.muted }} className="text-sm leading-relaxed">
                  {flight.description}
                </p>
              </div>

              <div
                className="pt-5 border-t flex items-center justify-between"
                style={{ borderColor: palette.line }}
              >
                <div>
                  <span style={{ color: palette.muted }} className="text-xs block">
                    Tariff
                  </span>
                  <span style={{ color: palette.text }} className="text-xl sm:text-2xl font-bold">
                    <Counter value={flight.price} prefix="$" />
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onBook(flight.id)}
                  style={{
                    backgroundColor: palette.accent,
                    color: palette.accentInk,
                    fontFamily: FONT.body,
                  }}
                  className="px-4 py-2 text-xs font-medium rounded-full cursor-pointer"
                >
                  Select flight
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   10. Section 5: Reservations (Device Adaptive)
─────────────────────────────────────────────────────────────────────────── */

function ReservationSection({
  palette,
  selectedFlightId,
  setSelectedFlightId,
  isMobile,
  isTablet,
}: {
  palette: typeof PALETTES.light;
  selectedFlightId: string;
  setSelectedFlightId: (id: string) => void;
  isMobile: boolean;
  isTablet: boolean;
}) {
  const [guestName, setGuestName] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [isBooked, setIsBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameInputId = useId();
  const dateInputId = useId();

  const currentFlight =
    TASTING_FLIGHTS.find((f) => f.id === selectedFlightId) || TASTING_FLIGHTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMessage("Please enter your name for table reservation.");
      return;
    }
    setErrorMessage("");
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setGuestName("");
      setSessionDate("");
    }, 3500);
  };

  return (
    <section
      id="reserve"
      aria-label="Reservations"
      style={{ borderColor: palette.line }}
      className={cn(
        "w-full border-b transition-colors duration-500",
        isMobile ? "py-14 px-5" : isTablet ? "py-20 px-8" : "py-24 px-10 lg:px-14"
      )}
    >
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className="space-y-2 sm:space-y-3">
          <h2
            style={{ fontFamily: FONT.display, color: palette.text }}
            className={cn(
              "font-bold tracking-tight",
              isMobile ? "text-2xl sm:text-3xl" : isTablet ? "text-3xl sm:text-4xl" : "text-4xl lg:text-5xl"
            )}
          >
            Reserve your tasting table
          </h2>
          <p
            style={{ fontFamily: FONT.body, color: palette.muted }}
            className={cn("leading-relaxed", isMobile ? "text-sm" : "text-base sm:text-lg max-w-[60ch]")}
          >
            Seatings are scheduled in limited numbers to ensure every guest receives personalized preparation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(
            isMobile || isTablet ? "flex flex-col gap-6" : "grid grid-cols-12 gap-8 items-start"
          )}
        >
          {/* Flight selection */}
          <div className={cn("space-y-3", isMobile || isTablet ? "w-full" : "col-span-6")}>
            <span style={{ color: palette.text }} className="text-sm font-semibold block">
              Choose your tasting flight:
            </span>

            <div className="space-y-3">
              {TASTING_FLIGHTS.map((f) => {
                const isActive = selectedFlightId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFlightId(f.id)}
                    style={{
                      borderColor: isActive ? palette.accent : palette.line,
                      backgroundColor: isActive ? palette.surface : "transparent",
                    }}
                    className="w-full p-5 sm:p-6 rounded-2xl border text-left cursor-pointer transition-colors relative focus-visible:outline-none"
                  >
                    <div
                      className="flex items-center justify-between pb-2 border-b"
                      style={{ borderColor: palette.line }}
                    >
                      <span
                        style={{ fontFamily: FONT.display, color: palette.text }}
                        className="font-bold text-sm sm:text-base"
                      >
                        {f.title}
                      </span>
                      <span
                        style={{ fontFamily: FONT.body, color: palette.accent }}
                        className="font-bold text-base sm:text-lg"
                      >
                        ${f.price}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs" style={{ color: palette.muted }}>
                      <span>{f.guests}</span>
                      <span>{f.duration}</span>
                    </div>

                    <p style={{ color: palette.muted }} className="text-xs mt-2 leading-relaxed">
                      {f.description}
                    </p>

                    {isActive && (
                      <motion.div
                        layoutId="active-flight-border"
                        style={{ borderColor: palette.accent }}
                        className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                        transition={MOTION.springPrecise}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form inputs */}
          <div
            style={{
              borderColor: palette.line,
              backgroundColor: palette.surface,
            }}
            className={cn(
              "rounded-3xl border p-6 sm:p-8 space-y-6",
              isMobile || isTablet ? "w-full" : "col-span-6"
            )}
          >
            <div className="space-y-4">
              <span style={{ color: palette.text }} className="text-sm font-semibold block">
                Guest details:
              </span>

              <div className="space-y-1.5">
                <label
                  htmlFor={nameInputId}
                  style={{ color: palette.muted }}
                  className="text-xs block"
                >
                  Primary guest name
                </label>
                <input
                  id={nameInputId}
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="Claire Delacroix"
                  style={{
                    borderColor: palette.line,
                    backgroundColor: palette.bg,
                    color: palette.text,
                    fontFamily: FONT.body,
                  }}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus-visible:outline-none focus-visible:ring-2"
                />
              </div>

              <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                <div className="space-y-1.5">
                  <label
                    htmlFor={dateInputId}
                    style={{ color: palette.muted }}
                    className="text-xs block"
                  >
                    Preferred date
                  </label>
                  <input
                    id={dateInputId}
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    style={{
                      borderColor: palette.line,
                      backgroundColor: palette.bg,
                      color: palette.text,
                      fontFamily: FONT.body,
                    }}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus-visible:outline-none focus-visible:ring-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label style={{ color: palette.muted }} className="text-xs block">
                    Party size
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    style={{
                      borderColor: palette.line,
                      backgroundColor: palette.bg,
                      color: palette.text,
                      fontFamily: FONT.body,
                    }}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus-visible:outline-none focus-visible:ring-2"
                  >
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="4">4 guests</option>
                    <option value="6">6 guests</option>
                  </select>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-rose-500 font-medium">
                  {errorMessage}
                </div>
              )}
            </div>

            <div
              style={{ borderColor: palette.line }}
              className="pt-5 border-t flex items-center justify-between"
            >
              <div>
                <span style={{ color: palette.muted }} className="text-xs block">
                  Total price
                </span>
                <span style={{ color: palette.text }} className="text-xl sm:text-2xl font-bold">
                  ${currentFlight.price}.00
                </span>
              </div>

              <MagneticButton
                type="submit"
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                  fontFamily: FONT.body,
                }}
                className="px-6 py-3 text-sm font-semibold rounded-full flex items-center gap-2"
              >
                <AnimatePresence mode="wait">
                  {isBooked ? (
                    <motion.span
                      key="confirmed"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={MOTION.springPrecise}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Table confirmed</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="reserve"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={MOTION.springPrecise}
                      className="flex items-center gap-2"
                    >
                      <span>Confirm reservation</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </MagneticButton>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   11. Section 6: Colophon & Footprint (Device Adaptive)
─────────────────────────────────────────────────────────────────────────── */

function ColophonSection({
  brandName,
  palette,
  isMobile,
  isTablet,
}: {
  brandName: string;
  palette: typeof PALETTES.light;
  isMobile: boolean;
  isTablet: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("14 Rue de Tournon, 75006 Paris");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer
      id="colophon"
      aria-label="Atelier Information"
      style={{ borderColor: palette.line }}
      className={cn(
        "w-full text-left transition-colors duration-500",
        isMobile ? "py-12 px-5" : isTablet ? "py-16 px-8" : "py-16 px-10 lg:px-14"
      )}
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        <div
          className={cn(
            "grid",
            isMobile ? "grid-cols-1 gap-6" : isTablet ? "grid-cols-2 gap-6" : "grid-cols-3 gap-8"
          )}
        >
          <div className="space-y-2">
            <span
              style={{ fontFamily: FONT.display, color: palette.text }}
              className="font-bold text-base block"
            >
              {brandName}
            </span>
            <p style={{ color: palette.muted }} className="text-xs leading-relaxed">
              Artisanal cryogenic gelato atelier. Flash-frozen to order using natural cream, seasonal fruits, and single-origin chocolate.
            </p>
          </div>

          <div className="space-y-2">
            <span style={{ color: palette.text }} className="text-sm font-semibold block">
              Atelier address
            </span>
            <p style={{ color: palette.muted }} className="text-xs leading-relaxed">
              14 Rue de Tournon<br />
              75006 Paris, France
            </p>
            <button
              type="button"
              onClick={copyAddress}
              style={{ color: palette.accent }}
              className="text-xs flex items-center gap-1.5 cursor-pointer pt-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Address copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy address</span>
                </>
              )}
            </button>
          </div>

          <div className={cn("space-y-2", isTablet ? "col-span-2" : "")}>
            <span style={{ color: palette.text }} className="text-sm font-semibold block">
              Opening hours
            </span>
            <div style={{ color: palette.muted }} className="text-xs space-y-1">
              <div>Wednesday to Sunday</div>
              <div>14:00 to 22:00</div>
              <div>Reservations recommended</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: palette.line }} className="h-px w-full" />

        <div
          style={{ color: palette.muted }}
          className={cn(
            "text-xs",
            isMobile ? "flex flex-col gap-2" : "flex flex-row items-center justify-between gap-4"
          )}
        >
          <span>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</span>
          <span>Crafted with sub-zero culinary freezing.</span>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   12. Main Orchestrator Component
─────────────────────────────────────────────────────────────────────────── */

export function LevitasCryoPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const initialTheme = config.theme === "dark" ? "dark" : "light";
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">(initialTheme);
  const brand = config.brandName || "Levitas";
  const title = config.heroTitle;
  const subtitle = config.heroSubtitle;

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lookbookRef = useRef<HTMLElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [selectedFlightId, setSelectedFlightId] = useState("duo");

  // Keep state synced if customizer theme changes externally
  useEffect(() => {
    if (config.theme) {
      setActiveTheme(config.theme === "dark" ? "dark" : "light");
    }
  }, [config.theme]);

  const palette = activeTheme === "dark" ? PALETTES.dark : PALETTES.light;

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

  /* Multi-device flags per template-adaptive-preview skill */
  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
  const isDesktop = !isMobile && !isTablet;

  const scrollDepth = useScrollDepth(rootRef);

  const scrollTo = (hash: string) => {
    if (!rootRef.current) return;
    const target = rootRef.current.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookFlight = (flightId: string) => {
    setSelectedFlightId(flightId);
    scrollTo("#reserve");
  };

  const toggleTheme = () => {
    setActiveTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
      {/* Google Fonts Link */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      {/* Header Scroll Depth Hairline Indicator */}
      <motion.div
        style={{
          scaleX: scrollDepth,
          backgroundColor: palette.accent,
        }}
        className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left pointer-events-none"
      />

      {/* Header Navigation with Device Awareness */}
      <Header
        brandName={brand}
        onNavigate={scrollTo}
        palette={palette}
        currentTheme={activeTheme}
        onToggleTheme={toggleTheme}
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
      />

      {/* Floating Theme Switcher at bottom-right */}
      <div className={cn("fixed z-50", isMobile ? "bottom-4 right-4" : "bottom-6 right-6")}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          style={{
            borderColor: palette.line,
            backgroundColor: palette.surface,
            color: palette.text,
            fontFamily: FONT.body,
          }}
          className={cn(
            "flex items-center gap-2 rounded-full border shadow-xl font-semibold cursor-pointer transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none",
            isMobile ? "px-3 py-2 text-[11px]" : "px-4 py-2.5 text-xs"
          )}
        >
          {activeTheme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light theme</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-sky-500" />
              <span>Dark theme</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Stage with Device Props */}
      <main className="w-full">
        {/* Section 1: Hero with Full Atmospheric Video */}
        <HeroSection
          heroRef={heroRef}
          palette={palette}
          currentTheme={activeTheme}
          isMobile={isMobile}
          isTablet={isTablet}
          onNavigate={scrollTo}
        />

        {/* Section 2: The Craft */}
        <CraftSection
          palette={palette}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Section 3: Signature S5 Lookbook with Adaptive Device Layouts */}
        <HorizontalLookbookSection
          lookbookRef={lookbookRef}
          palette={palette}
          isMobile={isMobile}
          isTablet={isTablet}
          onBook={() => scrollTo("#reserve")}
        />

        {/* Section 4: Tasting Menu */}
        <TastingMenuSection
          palette={palette}
          isMobile={isMobile}
          isTablet={isTablet}
          onBook={handleBookFlight}
        />

        {/* Section 5: Reservations */}
        <ReservationSection
          palette={palette}
          selectedFlightId={selectedFlightId}
          setSelectedFlightId={setSelectedFlightId}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </main>

      {/* Section 6: Colophon */}
      <ColophonSection
        brandName={brand}
        palette={palette}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </div>
  );
}
