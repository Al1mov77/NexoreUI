"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Check, Copy, Minus, Moon, Plus, Sun } from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

type ThemeName = "dark" | "light";
type PackageId = "dawn" | "day" | "camp";
type DateId = "sat" | "tue" | "thu";

interface Palette {
  bg: string;
  surface: string;
  line: string;
  text: string;
  muted: string;
  rust: string;
  brass: string;
  accentInk: string;
  board: string;
  boardLine: string;
  bar: string;
}

interface Booking {
  packageId: PackageId;
  riders: number;
  deposit: boolean;
  dateId: DateId;
}

const PALETTES = {
  dark: {
    bg: "#120d0a",
    surface: "#1d1510",
    line: "#4a3220",
    text: "#ead6a8",
    muted: "#b9a47c",
    rust: "#c9642c",
    brass: "#dca643",
    accentInk: "#1a0e07",
    board: "#2a1b12",
    boardLine: "#4a3220",
    bar: "rgba(18,13,10,0.86)",
  },
  light: {
    bg: "#f4ead5",
    surface: "#eadbc0",
    line: "#c5ae87",
    text: "#1e140d",
    muted: "#69533e",
    rust: "#b8521c",
    brass: "#9e6b18",
    accentInk: "#fcf6ea",
    board: "#2a1b12",
    boardLine: "#4a3220",
    bar: "rgba(18,13,10,0.86)",
  },
} as const satisfies Record<ThemeName, Palette>;

const FILM = { sand: "#ead6a8", sandDim: "#b9a47c", night: "#16222b", scrim: "10,7,5" } as const;

const FONT = {
  display: "'Bevan', 'Rockwell', Georgia, serif",
  body: "'Newsreader', Georgia, 'Times New Roman', serif",
  mono: "'Special Elite', 'Courier New', monospace",
} as const;

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Bevan:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Special+Elite&display=swap";

const MEDIA = {
  film: "/templates/dustline-dawn/ride.mp4",
  poster: "/templates/dustline-dawn/poster.webp",
  road: "/templates/dustline-dawn/p1.webp",
} as const;

const MOTION = {
  soft: [0.22, 1, 0.36, 1] as const,
  editorial: [0.76, 0, 0.24, 1] as const,
  reveal: 0.8,
};

const CHAPTERS = [
  { from: 0, to: 0.15, title: "Before the light.", body: "Cracked clay, cold air, and nobody else awake for forty miles." },
  { from: 0.17, to: 0.35, title: "The sky does the talking.", body: "We leave camp while the stars are still out. Bring a coat." },
  { from: 0.4, to: 0.7, title: "One horse. One direction.", body: "Small groups, steady horses, and a guide who knows every wash on the ridge." },
  { from: 0.78, to: 1.01, title: "Ride out at first light.", body: "Dawn rides through the canyon country, from one morning to a full week." },
] as const;

const PLATES = [
  { time: "05:20", place: "Cactus Basin", title: "Fog in the valley", text: "Cold air pools in the basin overnight. By the time the sun clears the ridge, the whole valley glows.", src: "/templates/dustline-dawn/p5.webp", alt: "Saguaro cacti standing in morning fog with layered mountains behind" },
  { time: "06:05", place: "Ghost Street", title: "A town with no one in it", text: "Wooden porches, dust in the air, hitching rails still standing. We tie up and walk it on foot.", src: "/templates/dustline-dawn/p4.webp", alt: "Empty frontier town street at dawn with wooden storefronts" },
  { time: "07:15", place: "Camp", title: "Coffee, tack, and woodsmoke", text: "Breakfast over the coals. Check cinches, water the horses, and plan the next ridge.", src: "/templates/dustline-dawn/p3.webp", alt: "Horse hooves kicking dust beside a campfire and leather reins on the ground" },
  { time: "08:40", place: "The rail line", title: "Steam on the plain", text: "The heritage train crosses the flats once a morning. We sit the horses on the rise and watch it go.", src: "/templates/dustline-dawn/p2.webp", alt: "Steam locomotive crossing a grass plain with the sun low behind it" },
] as const;

const PACKAGES = [
  { id: "dawn", name: "Dawn Ride", code: "DAWN", price: 89, text: "Three hours from camp to the ridge and back. Breakfast included." },
  { id: "day", name: "Full Day", code: "DAY", price: 240, text: "Basin, ghost street, and the rail line, with lunch on the trail." },
  { id: "camp", name: "Overnight Camp", code: "CAMP", price: 480, text: "Two days, one night under the stars. Tents, meals, and horses provided." },
] as const satisfies readonly { id: PackageId; name: string; code: string; price: number; text: string }[];

const DEPARTURES = [
  { id: "sat", label: "Saturday 04:30", code: "SAT" },
  { id: "tue", label: "Tuesday 04:30", code: "TUE" },
  { id: "thu", label: "Thursday 04:30", code: "THU" },
] as const satisfies readonly { id: DateId; label: string; code: string }[];

const NAV_LINKS = [
  { id: "route", label: "The route" },
  { id: "rates", label: "Rates" },
] as const;

const GLOBAL_CSS = `
.dl-focus:focus-visible { outline: 2px solid var(--dl-brass); outline-offset: 3px; }
.dl-root ::selection { background: var(--dl-rust); color: var(--dl-ink); }
.dl-link { position: relative; display: inline-flex; align-items: center; min-height: 44px; }
.dl-link::after { content: ""; position: absolute; left: 0; bottom: 8px; height: 1px; width: 100%; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1); }
.dl-link:hover::after, .dl-link:focus-visible::after { transform: scaleX(1); transform-origin: left; }
.dl-chamfer { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
.dl-grain { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
`;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function money(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === "auto" || overflow === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

function useViewHeight(ref: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(800);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = findScroller(el);
    const read = () => setHeight(scroller ? scroller.clientHeight : window.innerHeight);
    read();
    if (scroller) {
      const observer = new ResizeObserver(read);
      observer.observe(scroller);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [ref]);
  return height;
}

function packageFor(id: PackageId) {
  return PACKAGES.find((item) => item.id === id) ?? PACKAGES[0];
}

function totalFor(booking: Booking): number {
  const base = packageFor(booking.packageId).price * booking.riders;
  return booking.deposit ? base * 0.25 : base;
}

function Reveal({ children, reduce, delay = 0, style }: { children: React.ReactNode; reduce: boolean; delay?: number; style?: CSSProperties }) {
  return (
    <motion.div
      style={style}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: reduce ? 0 : MOTION.reveal, ease: MOTION.soft, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

function ChamferButton({ pal, children, onClick, type = "button", full = false }: { pal: Palette; children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; full?: boolean }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="dl-focus dl-chamfer"
      initial={false}
      whileHover={{ backgroundColor: pal.brass }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: MOTION.soft }}
      style={{
        backgroundColor: pal.rust,
        color: pal.accentInk,
        fontFamily: FONT.mono,
        fontSize: 14,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "12px 22px",
        minHeight: 44,
        width: full ? "100%" : undefined,
        border: 0,
        cursor: "pointer",
      }}
    >
      {children}
    </motion.button>
  );
}

function Header({ brand, pal, mode, isMobile, isTablet, progress, onToggleTheme, onJump }: { brand: string; pal: Palette; mode: ThemeName; isMobile: boolean; isTablet: boolean; progress: ReturnType<typeof useMotionValue<number>>; onToggleTheme: () => void; onJump: (id: string) => void }) {
  return (
    <header className="sticky top-0 z-50" style={{ height: 64, marginBottom: -64, background: pal.bar, borderBottom: `1px solid ${pal.line}` }}>
      <div className="mx-auto flex h-full items-center justify-between gap-4" style={{ padding: isMobile ? "0 16px" : "0 32px", maxWidth: 1280 }}>
        <button type="button" onClick={() => onJump("top")} className="dl-focus" style={{ fontFamily: FONT.display, fontSize: 22, letterSpacing: "0.04em", color: FILM.sand, background: "none", border: 0, cursor: "pointer", minHeight: 44 }}>
          {brand}
        </button>
        <nav className="flex items-center gap-3 sm:gap-6">
          {!isMobile && !isTablet &&
            NAV_LINKS.map((link) => (
              <button key={link.id} type="button" onClick={() => onJump(link.id)} className="dl-focus dl-link" style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: FILM.sand, background: "none", border: 0, cursor: "pointer" }}>
                {link.label}
              </button>
            ))}
          <button type="button" onClick={onToggleTheme} aria-label={mode === "dark" ? "Switch to parchment theme" : "Switch to night theme"} className="dl-focus flex items-center justify-center" style={{ width: 44, height: 44, color: FILM.sand, background: "none", border: 0, cursor: "pointer" }}>
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <ChamferButton pal={pal} onClick={() => onJump("book")}>Book a ride</ChamferButton>
        </nav>
      </div>
      <motion.div style={{ scaleX: progress, transformOrigin: "left", background: pal.brass, height: 2, position: "absolute", left: 0, right: 0, bottom: -1 }} />
    </header>
  );
}

function FilmStage({ pal, viewH, isMobile, isTablet, reduce, onJump }: { pal: Palette; viewH: number; isMobile: boolean; isTablet: boolean; reduce: boolean; onJump: (id: string) => void }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clockRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const factor = isMobile ? 4.2 : isTablet ? 5.2 : 6.4;
  const trackHeight = reduce ? viewH : viewH * factor;

  useEffect(() => {
    const outer = outerRef.current;
    const video = videoRef.current;
    if (!outer || !video) return;
    const scroller = findScroller(outer);
    const target: HTMLElement | Window = scroller ?? window;
    let current = 0;
    let ready = false;
    let lastSet = -1;
    let frame = 0;
    let objectUrl = "";
    let alive = true;

    const read = () => {
      const rect = outer.getBoundingClientRect();
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const vh = scroller ? scroller.clientHeight : window.innerHeight;
      const total = rect.height - vh;
      return total > 0 ? clamp(-(rect.top - top) / total, 0, 1) : 0;
    };

    const paint = (p: number) => {
      CHAPTERS.forEach((chapter, index) => {
        const el = chapterRefs.current[index];
        if (!el) return;
        const fade = 0.045;
        let opacity = clamp((p - chapter.from) / fade, 0, 1) * clamp((chapter.to - p) / fade, 0, 1);
        if (index === CHAPTERS.length - 1 && p >= chapter.from + fade) opacity = 1;
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${((1 - opacity) * 18).toFixed(1)}px)`;
        el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
        const marker = markerRefs.current[index];
        if (marker) marker.style.opacity = opacity > 0.5 ? "1" : "0.55";
      });
      const minutes = Math.round(250 + p * 135);
      if (clockRef.current) clockRef.current.textContent = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
      if (fillRef.current) fillRef.current.style.height = `${(p * 100).toFixed(1)}%`;
      if (hintRef.current) hintRef.current.style.opacity = p < 0.02 && !reduce ? "1" : "0";
    };

    const step = () => {
      frame = 0;
      if (!alive) return;
      const goal = reduce ? 1 : read();
      current += (goal - current) * (reduce ? 1 : 0.14);
      if (Math.abs(goal - current) < 0.0004) current = goal;
      if (ready && video.duration && !reduce) {
        const t = current * (video.duration - 0.05);
        if (Math.abs(t - lastSet) > 1 / 60) {
          try {
            video.currentTime = t;
          } catch {
            lastSet = -1;
          }
          lastSet = t;
        }
      }
      paint(current);
      if (current !== goal) request();
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const onReady = () => {
      ready = true;
      if (loadingRef.current) loadingRef.current.style.opacity = "0";
      request();
    };

    if (!reduce) {
      video.addEventListener("loadeddata", onReady, { once: true });
      fetch(MEDIA.film)
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.blob();
        })
        .then((blob) => {
          if (!alive) return;
          objectUrl = URL.createObjectURL(blob);
          video.src = objectUrl;
          video.load();
        })
        .catch(() => {
          if (!alive) return;
          video.src = MEDIA.film;
          video.load();
        });
      target.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
    } else if (loadingRef.current) {
      loadingRef.current.style.opacity = "0";
    }
    request();

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      target.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      video.removeEventListener("loadeddata", onReady);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [reduce, viewH]);

  const jumpToProgress = useCallback(
    (p: number) => {
      const outer = outerRef.current;
      if (!outer) return;
      const scroller = findScroller(outer);
      const rect = outer.getBoundingClientRect();
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const vh = scroller ? scroller.clientHeight : window.innerHeight;
      const origin = rect.top - top + (scroller ? scroller.scrollTop : window.scrollY);
      const destination = origin + p * (rect.height - vh);
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
      if (scroller) scroller.scrollTo({ top: destination, behavior });
      else window.scrollTo({ top: destination, behavior });
    },
    [reduce],
  );

  const margin = isMobile ? 16 : 32;
  return (
    <section ref={outerRef} aria-label="Dawn ride film" style={{ position: "relative", height: trackHeight }}>
      <div style={{ position: "sticky", top: 0, height: viewH, overflow: "hidden", background: FILM.night }}>
        <video ref={videoRef} muted playsInline preload={reduce ? "metadata" : "auto"} poster={MEDIA.poster} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? "58% 50%" : "50% 50%" }} />
        <div ref={loadingRef} style={{ position: "absolute", inset: 0, zIndex: 1, display: "grid", placeItems: "center", background: FILM.night, transition: "opacity 600ms", pointerEvents: "none" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM.sandDim }}>Saddling up</span>
        </div>
        <div className="dl-grain" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0.1, mixBlendMode: "overlay", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: `radial-gradient(ellipse at 50% 45%, rgba(${FILM.scrim},0) 45%, rgba(${FILM.scrim},0.62) 100%), linear-gradient(to top, rgba(${FILM.scrim},0.7), rgba(${FILM.scrim},0) 45%)` }} />

        <div aria-hidden="true" style={{ position: "absolute", zIndex: 4, top: 82, left: margin, display: "flex", alignItems: "baseline", gap: 14 }}>
          <b ref={clockRef} style={{ fontFamily: FONT.mono, fontWeight: 400, fontSize: "clamp(30px, 4vw, 46px)", letterSpacing: "0.06em", color: FILM.sand, fontVariantNumeric: "tabular-nums" }}>04:10</b>
          {!isMobile && <span style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: FILM.sandDim }}>Local time, high desert</span>}
        </div>

        <div aria-hidden="true" style={{ position: "absolute", zIndex: 4, right: margin, top: "50%", transform: "translateY(-50%)", width: 3, height: "28%", background: "rgba(234,214,168,0.22)" }}>
          <i ref={fillRef} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "0%", background: pal.brass }} />
        </div>

        <div role="group" aria-label="Jump to a chapter" style={{ position: "absolute", zIndex: 5, top: isMobile ? 132 : 82, right: isMobile ? undefined : margin + 24, left: isMobile ? margin : undefined, display: "flex", flexDirection: isMobile ? "row" : "column", gap: isMobile ? 4 : 0, alignItems: isMobile ? "center" : "flex-end" }}>
          {CHAPTERS.map((chapter, index) => {
            const minutes = Math.round(250 + chapter.from * 135);
            return (
              <button key={chapter.title} ref={(el) => { markerRefs.current[index] = el; }} type="button" onClick={() => jumpToProgress(Math.min(0.995, chapter.from + 0.03))} className="dl-focus" style={{ minHeight: 44, minWidth: 44, padding: "0 8px", fontFamily: FONT.mono, fontSize: 12, letterSpacing: "0.1em", color: FILM.sand, background: "none", border: 0, cursor: "pointer", fontVariantNumeric: "tabular-nums", opacity: 0.55 }}>
                {`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`}
              </button>
            );
          })}
        </div>

        {CHAPTERS.map((chapter, index) => {
          const isLast = index === CHAPTERS.length - 1;
          const Heading = index === 0 ? "h1" : "h2";
          return (
            <div key={chapter.title} ref={(el) => { chapterRefs.current[index] = el; }} style={{ position: "absolute", zIndex: 4, left: margin, right: margin, bottom: isMobile ? 72 : "max(9%, 64px)", maxWidth: 880, opacity: reduce ? (isLast ? 1 : 0) : 0, transform: "translateY(18px)", pointerEvents: "none" }}>
              <Heading style={{ fontFamily: FONT.display, fontWeight: 400, lineHeight: 1.02, margin: 0, fontSize: "clamp(40px, 8vw, 104px)", color: FILM.sand, textWrap: "balance", textShadow: "0 2px 30px rgba(0,0,0,0.55)" }}>{chapter.title}</Heading>
              <p style={{ fontFamily: FONT.body, fontSize: "clamp(18px, 2.2vw, 24px)", lineHeight: 1.5, maxWidth: "34ch", margin: "18px 0 0", color: FILM.sand, textShadow: "0 1px 14px rgba(0,0,0,0.7)" }}>{chapter.body}</p>
              {isLast && (
                <div style={{ marginTop: 28 }}>
                  <ChamferButton pal={pal} onClick={() => onJump("book")}>Book a ride</ChamferButton>
                </div>
              )}
            </div>
          );
        })}

        <div ref={hintRef} aria-hidden="true" style={{ position: "absolute", zIndex: 4, left: "50%", bottom: 18, transform: "translateX(-50%)", transition: "opacity 400ms", fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM.sandDim }}>
          Scroll to ride
        </div>
      </div>
    </section>
  );
}

function RouteIntro({ pal, isMobile, isTablet, reduce }: { pal: Palette; isMobile: boolean; isTablet: boolean; reduce: boolean }) {
  const padX = isMobile ? 20 : isTablet ? 32 : 64;
  const padY = isMobile ? 64 : isTablet ? 88 : 128;
  return (
    <section id="route" style={{ padding: `${padY}px ${padX}px ${padY / 2}px`, maxWidth: 1280, margin: "0 auto" }}>
      <Reveal reduce={reduce}>
        <p style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.muted, margin: 0 }}>The route, in order of the morning</p>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "minmax(0,1fr)" : "minmax(0,7fr) minmax(0,5fr)", gap: isMobile ? 24 : 48, marginTop: 18, alignItems: "end" }}>
        <motion.h2
          initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: reduce ? 0 : 0.9, ease: MOTION.editorial }}
          style={{ fontFamily: FONT.display, fontWeight: 400, lineHeight: 1.02, margin: 0, fontSize: "clamp(34px, 6vw, 76px)", color: pal.text, textWrap: "balance" }}
        >
          Every stop has its own light.
        </motion.h2>
        <Reveal reduce={reduce} delay={0.1}>
          <p style={{ fontFamily: FONT.body, fontSize: 18, lineHeight: 1.6, maxWidth: "52ch", margin: 0, color: pal.muted }}>
            The trail runs from the basin at sunrise to the open road by midday. These are the stops we keep coming back to.
          </p>
        </Reveal>
      </div>
      <ol style={{ listStyle: "none", margin: "40px 0 0", padding: 0, display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0,1fr))" : "repeat(4, minmax(0,1fr))", borderTop: `1px solid ${pal.line}` }}>
        {PLATES.map((plate) => (
          <li key={plate.time} style={{ padding: "14px 0", borderBottom: isMobile ? `1px solid ${pal.line}` : undefined }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 18, color: pal.brass, fontVariantNumeric: "tabular-nums" }}>{plate.time}</span>
            <span style={{ display: "block", fontFamily: FONT.body, fontSize: 16, color: pal.muted }}>{plate.place}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PlateImage({ src, alt, reduce }: { src: string; alt: string; reduce: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img || reduce) return;
    const scroller = findScroller(frame);
    const target: HTMLElement | Window = scroller ?? window;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const vh = scroller ? scroller.clientHeight : window.innerHeight;
      const k = (rect.top - top + rect.height / 2 - vh / 2) / vh;
      img.style.transform = `translate3d(0, ${(k * -8).toFixed(2)}%, 0)`;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    target.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      target.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [reduce]);
  return (
    <div ref={frameRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <img ref={imgRef} src={src} alt={alt} loading="lazy" style={{ position: "absolute", left: 0, top: reduce ? 0 : "-10%", width: "100%", height: reduce ? "100%" : "120%", objectFit: "cover", willChange: "transform" }} />
    </div>
  );
}

function RoutePlate({ plate, isMobile, isTablet, reduce }: { plate: (typeof PLATES)[number]; isMobile: boolean; isTablet: boolean; reduce: boolean }) {
  const height = isMobile ? "68svh" : isTablet ? "76svh" : "min(88svh, 760px)";
  const padX = isMobile ? 20 : isTablet ? 32 : 64;
  return (
    <figure style={{ position: "relative", height, margin: 0, background: FILM.night, overflow: "hidden" }}>
      <PlateImage src={plate.src} alt={plate.alt} reduce={reduce} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(${FILM.scrim},0.82), rgba(${FILM.scrim},0) 55%)` }} />
      <figcaption style={{ position: "absolute", zIndex: 2, left: padX, right: padX, bottom: isMobile ? 28 : 56, display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,34ch)", gap: "12px 48px", alignItems: "end", maxWidth: 1280, margin: "0 auto" }}>
        <div>
          <span style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM.sandDim }}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{plate.time}</span> {plate.place}
          </span>
          <motion.h3
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: reduce ? 0 : 0.9, ease: MOTION.editorial }}
            style={{ fontFamily: FONT.display, fontWeight: 400, lineHeight: 1.05, margin: "8px 0 0", fontSize: "clamp(30px, 5vw, 60px)", color: FILM.sand, textWrap: "balance" }}
          >
            {plate.title}
          </motion.h3>
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: 18, lineHeight: 1.55, margin: 0, color: FILM.sand }}>{plate.text}</p>
      </figcaption>
    </figure>
  );
}

function Stepper({ pal, value, onChange }: { pal: Palette; value: number; onChange: (next: number) => void }) {
  const buttonStyle: CSSProperties = { width: 44, height: 44, display: "grid", placeItems: "center", background: "none", border: `1px solid ${FILM.sandDim}`, color: FILM.sand, cursor: "pointer" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <button type="button" aria-label="Remove a rider" onClick={() => onChange(clamp(value - 1, 1, 8))} className="dl-focus" style={buttonStyle}>
        <Minus size={16} />
      </button>
      <span aria-live="polite" style={{ minWidth: 72, textAlign: "center", fontFamily: FONT.mono, fontSize: 18, color: pal.brass, fontVariantNumeric: "tabular-nums" }}>
        {value} {value === 1 ? "rider" : "riders"}
      </span>
      <button type="button" aria-label="Add a rider" onClick={() => onChange(clamp(value + 1, 1, 8))} className="dl-focus" style={buttonStyle}>
        <Plus size={16} />
      </button>
    </div>
  );
}

function RateBoard({ pal, booking, setBooking, isMobile, isTablet, reduce, onJump }: { pal: Palette; booking: Booking; setBooking: (next: Booking) => void; isMobile: boolean; isTablet: boolean; reduce: boolean; onJump: (id: string) => void }) {
  const padX = isMobile ? 20 : isTablet ? 32 : 64;
  const padY = isMobile ? 64 : isTablet ? 88 : 128;
  const selected = packageFor(booking.packageId);
  return (
    <section id="rates" style={{ padding: `${padY}px ${padX}px`, maxWidth: 1280, margin: "0 auto" }}>
      <Reveal reduce={reduce}>
        <p style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.muted, margin: 0 }}>Rate board</p>
        <h2 style={{ fontFamily: FONT.display, fontWeight: 400, lineHeight: 1.02, margin: "18px 0 0", fontSize: "clamp(34px, 6vw, 76px)", color: pal.text, textWrap: "balance" }}>Pick your length.</h2>
      </Reveal>
      <Reveal reduce={reduce} delay={0.1} style={{ marginTop: 40 }}>
        <div style={{ position: "relative", padding: isMobile ? 20 : 48, background: pal.board, border: `2px solid ${pal.boardLine}`, boxShadow: `inset 0 0 0 6px ${pal.board}, inset 0 0 0 8px ${pal.brass}55`, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 2px, rgba(0,0,0,0) 2px 9px)" }}>
          <div role="radiogroup" aria-label="Ride length">
            {PACKAGES.map((item, index) => {
              const active = item.id === booking.packageId;
              const base = item.price * booking.riders;
              const shown = booking.deposit ? base * 0.25 : base;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setBooking({ ...booking, packageId: item.id })}
                  className="dl-focus"
                  whileHover={{ backgroundColor: "rgba(234,214,168,0.06)" }}
                  transition={{ duration: 0.25, ease: MOTION.soft }}
                  style={{ position: "relative", display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr) auto" : "minmax(0,1.2fr) minmax(0,2fr) auto", gap: "8px 32px", alignItems: "baseline", width: "100%", textAlign: "left", padding: "24px 16px", minHeight: 44, background: "none", border: 0, borderTop: index === 0 ? 0 : `1px dashed ${FILM.sandDim}66`, color: FILM.sand, cursor: "pointer" }}
                >
                  {active && <motion.span layoutId="dl-rate-indicator" transition={{ duration: reduce ? 0 : 0.5, ease: MOTION.soft }} style={{ position: "absolute", inset: 0, border: `2px solid ${pal.brass}`, pointerEvents: "none" }} />}
                  <span style={{ fontFamily: FONT.display, fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.05 }}>{item.name}</span>
                  <span style={{ fontFamily: FONT.body, fontSize: 17, lineHeight: 1.5, color: FILM.sandDim, gridColumn: isMobile ? "1 / -1" : undefined, order: isMobile ? 3 : undefined }}>{item.text}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "clamp(26px, 3vw, 34px)", color: pal.brass, fontVariantNumeric: "tabular-nums" }}>{money(shown)}</span>
                </motion.button>
              );
            })}
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px dashed ${FILM.sandDim}66`, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
            <Stepper pal={pal} value={booking.riders} onChange={(riders) => setBooking({ ...booking, riders })} />
            <div role="radiogroup" aria-label="Payment" style={{ display: "inline-flex", border: `1px solid ${FILM.sandDim}` }}>
              {[{ id: false, label: "Full rate" }, { id: true, label: "25% deposit" }].map((option) => {
                const active = booking.deposit === option.id;
                return (
                  <button key={option.label} type="button" role="radio" aria-checked={active} onClick={() => setBooking({ ...booking, deposit: option.id })} className="dl-focus" style={{ position: "relative", minHeight: 44, padding: "0 16px", fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: active ? pal.accentInk : FILM.sand, background: "none", border: 0, cursor: "pointer" }}>
                    {active && <motion.span layoutId="dl-pay-indicator" transition={{ duration: reduce ? 0 : 0.4, ease: MOTION.soft }} style={{ position: "absolute", inset: 0, background: pal.brass }} />}
                    <span style={{ position: "relative" }}>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontFamily: FONT.mono, fontSize: 15, color: FILM.sand, fontVariantNumeric: "tabular-nums" }}>
              {selected.name}, {booking.riders} {booking.riders === 1 ? "rider" : "riders"}: {money(totalFor(booking))} {booking.deposit ? "due now" : "total"}
            </p>
            <ChamferButton pal={pal} onClick={() => onJump("book")}>Reserve this ride</ChamferButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Reservation({ pal, booking, setBooking, isMobile, isTablet, reduce }: { pal: Palette; booking: Booking; setBooking: (next: Booking) => void; isMobile: boolean; isTablet: boolean; reduce: boolean }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const selected = packageFor(booking.packageId);
  const departure = DEPARTURES.find((item) => item.id === booking.dateId) ?? DEPARTURES[0];
  const padX = isMobile ? 20 : isTablet ? 32 : 64;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setReference(`DL-${selected.code}-${booking.riders}${departure.code}`);
  };

  const copyReference = () => {
    if (!reference) return;
    void navigator.clipboard.writeText(reference);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="book" style={{ position: "relative", minHeight: isMobile ? "auto" : "86svh", display: "grid", alignItems: "end", overflow: "hidden", background: FILM.night }}>
      <img src={MEDIA.road} alt="Dirt road winding into the distance at golden sunrise" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? "52% 50%" : "50% 50%" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(${FILM.scrim},0.92), rgba(${FILM.scrim},0.1) 60%)` }} />
      <div style={{ position: "relative", zIndex: 2, padding: `${isMobile ? 220 : 96}px ${padX}px ${isMobile ? 40 : 96}px`, maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: isMobile || isTablet ? "minmax(0,1fr)" : "minmax(0,7fr) minmax(0,5fr)", gap: isMobile ? 28 : 56, alignItems: "end" }}>
        <Reveal reduce={reduce}>
          <p style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM.sandDim, margin: 0 }}>Next departure: {DEPARTURES[0].label}</p>
          <h2 style={{ fontFamily: FONT.display, fontWeight: 400, lineHeight: 1.02, margin: "18px 0 0", fontSize: "clamp(40px, 8vw, 104px)", color: FILM.sand, textWrap: "balance" }}>The road is already warm.</h2>
          <p style={{ fontFamily: FONT.body, fontSize: 19, lineHeight: 1.55, maxWidth: "40ch", margin: "18px 0 0", color: FILM.sand }}>Pick a date and we will have a horse saddled when you arrive.</p>
        </Reveal>
        <Reveal reduce={reduce} delay={0.1}>
          <form onSubmit={submit} noValidate style={{ padding: isMobile ? 20 : 28, background: `rgba(${FILM.scrim},0.82)`, border: `2px solid ${pal.boardLine}`, color: FILM.sand }}>
            <AnimatePresence mode="wait" initial={false}>
              {reference ? (
                <motion.div key="done" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.5, ease: MOTION.soft }}>
                  <p style={{ margin: 0, fontFamily: FONT.display, fontSize: 28, lineHeight: 1.1 }}>You are booked, {name.trim()}.</p>
                  <p style={{ margin: "12px 0 0", fontFamily: FONT.body, fontSize: 17, lineHeight: 1.5 }}>
                    {selected.name} for {booking.riders} {booking.riders === 1 ? "rider" : "riders"}, {departure.label}. {money(totalFor(booking))} {booking.deposit ? "deposit due now" : "total"}.
                  </p>
                  <button type="button" onClick={copyReference} className="dl-focus" style={{ marginTop: 20, minHeight: 44, display: "inline-flex", alignItems: "center", gap: 10, padding: "0 16px", fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.1em", color: pal.brass, background: "none", border: `1px dashed ${pal.brass}`, cursor: "pointer" }}>
                    <span>{reference}</span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={copied ? "ok" : "copy"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: MOTION.soft }} style={{ display: "inline-flex" }}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={false} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: "grid", gap: 20 }}>
                  <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM.sandDim, marginBottom: 8 }}>Departure</legend>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {DEPARTURES.map((item) => {
                        const active = item.id === booking.dateId;
                        return (
                          <button key={item.id} type="button" aria-pressed={active} onClick={() => setBooking({ ...booking, dateId: item.id })} className="dl-focus" style={{ position: "relative", minHeight: 44, padding: "0 14px", fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.08em", color: active ? pal.accentInk : FILM.sand, background: "none", border: `1px solid ${FILM.sandDim}`, cursor: "pointer" }}>
                            {active && <motion.span layoutId="dl-date-indicator" transition={{ duration: reduce ? 0 : 0.4, ease: MOTION.soft }} style={{ position: "absolute", inset: -1, background: pal.brass }} />}
                            <span style={{ position: "relative" }}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="dl-name" style={{ display: "block", fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM.sandDim, marginBottom: 8 }}>Name on the booking</label>
                    <input id="dl-name" value={name} onChange={(event) => { setName(event.target.value); setError(false); }} aria-invalid={error} aria-describedby={error ? "dl-name-error" : undefined} autoComplete="name" className="dl-focus" style={{ width: "100%", minHeight: 44, padding: "0 14px", fontFamily: FONT.body, fontSize: 18, color: FILM.sand, background: "transparent", border: `1px solid ${error ? pal.rust : FILM.sandDim}`, borderRadius: 0 }} />
                    {error && <p id="dl-name-error" style={{ margin: "8px 0 0", fontFamily: FONT.body, fontSize: 15, color: pal.rust }}>Enter the name of the lead rider so we can save the saddle.</p>}
                  </div>
                  <p style={{ margin: 0, fontFamily: FONT.mono, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
                    {selected.name}, {booking.riders} {booking.riders === 1 ? "rider" : "riders"}: {money(totalFor(booking))}
                  </p>
                  <ChamferButton pal={pal} type="submit" full={isMobile}>Reserve a spot</ChamferButton>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function DustlineDawnPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [override, setOverride] = useState<ThemeName | null>(null);
  const [booking, setBooking] = useState<Booking>({ packageId: "dawn", riders: 2, deposit: false, dateId: "sat" });
  const progress = useMotionValue(0);
  const viewH = useViewHeight(rootRef);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => entries.forEach((entry) => setWidth(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const scroller = findScroller(el);
    const target: HTMLElement | Window = scroller ?? window;
    const update = () => {
      const top = scroller ? scroller.scrollTop : window.scrollY;
      const max = scroller ? scroller.scrollHeight - scroller.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? clamp(top / max, 0, 1) : 0);
    };
    update();
    target.addEventListener("scroll", update, { passive: true });
    return () => target.removeEventListener("scroll", update);
  }, [progress]);

  const isMobile = deviceMode === "mobile" || width < 640;
  const isTablet = !isMobile && (deviceMode === "tablet" || width < 1024);
  const mode: ThemeName = override ?? (config.theme === "light" ? "light" : "dark");
  const pal: Palette = PALETTES[mode];

  const jump = useCallback(
    (id: string) => {
      const root = rootRef.current;
      if (!root) return;
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
      if (id === "top") {
        const scroller = findScroller(root);
        if (scroller) scroller.scrollTo({ top: 0, behavior });
        else window.scrollTo({ top: 0, behavior });
        return;
      }
      root.querySelector(`#${id}`)?.scrollIntoView({ behavior, block: "start" });
    },
    [reduce],
  );

  return (
    <div
      ref={rootRef}
      className="dl-root relative w-full overflow-x-clip"
      style={{ background: pal.bg, color: pal.text, fontFamily: FONT.body, fontSize: 18, lineHeight: 1.55, ["--dl-brass" as string]: pal.brass, ["--dl-rust" as string]: pal.rust, ["--dl-ink" as string]: pal.accentInk }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONT_URL} />
      <style>{GLOBAL_CSS}</style>
      <Header brand={config.brandName || "Dustline"} pal={pal} mode={mode} isMobile={isMobile} isTablet={isTablet} progress={progress} onToggleTheme={() => setOverride(mode === "dark" ? "light" : "dark")} onJump={jump} />
      <main>
        <FilmStage pal={pal} viewH={viewH} isMobile={isMobile} isTablet={isTablet} reduce={reduce} onJump={jump} />
        <RouteIntro pal={pal} isMobile={isMobile} isTablet={isTablet} reduce={reduce} />
        <div style={{ display: "grid", gap: 6 }}>
          {PLATES.map((plate) => (
            <RoutePlate key={plate.time} plate={plate} isMobile={isMobile} isTablet={isTablet} reduce={reduce} />
          ))}
        </div>
        <RateBoard pal={pal} booking={booking} setBooking={setBooking} isMobile={isMobile} isTablet={isTablet} reduce={reduce} onJump={jump} />
        <Reservation pal={pal} booking={booking} setBooking={setBooking} isMobile={isMobile} isTablet={isTablet} reduce={reduce} />
      </main>
      <footer style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", justifyContent: "space-between", padding: isMobile ? "24px 20px 32px" : "28px 64px 40px", fontFamily: FONT.mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: pal.muted }}>
        <span>Dustline Outfitters</span>
        <span>Sample content for a landing template</span>
      </footer>
    </div>
  );
}
