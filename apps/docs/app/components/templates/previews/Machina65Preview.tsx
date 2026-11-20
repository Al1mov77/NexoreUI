"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { AnimatePresence, MotionValue, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUp, Check, Copy, Moon, RotateCcw, Sun, Volume2, VolumeX } from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FONT = {
  display: "'Bricolage Grotesque', sans-serif",
  body: "'Hanken Grotesk', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const PALETTE = {
  dark: {
    bg: "#0B0C0D",
    surface: "#141517",
    surfaceAlt: "#1C1E21",
    line: "#26282C",
    text: "#F4F4F2",
    muted: "#92969D",
    accent: "#FF5B24",
    accentInk: "#0B0C0D",
  },
  light: {
    bg: "#F7F7F6",
    surface: "#ECECEB",
    surfaceAlt: "#E2E2E0",
    line: "#D4D4D2",
    text: "#0E0F10",
    muted: "#5A5C60",
    accent: "#E04716",
    accentInk: "#FFFFFF",
  },
} as const;

const MOTION_TOKENS = {
  spring: { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.7 },
  ease: [0.2, 0, 0, 1] as const,
  reveal: 0.42,
  stagger: 0.045,
};

type SwitchId = "linear" | "tactile" | "silent";
type PlateId = "alu" | "brass" | "pc";
type KnobId = "none" | "brass" | "black" | "orange";
type EscCapId = "default" | "orange" | "brass";
type TrimKind = "knob" | "esc" | "enter" | "space" | "cable";

interface KeyDef {
  id: string;
  label: string;
  code: string;
  zone: "alpha" | "mod";
  x: number;
  y: number;
  w: number;
  h: number;
  char?: string;
}

const KEYS_65: readonly KeyDef[] = [
  { id: "esc", label: "ESC", code: "Escape", zone: "mod", x: 64, y: 82, w: 86, h: 91 },
  { id: "1", label: "1", code: "Digit1", zone: "alpha", x: 158, y: 82, w: 86, h: 91, char: "1" },
  { id: "2", label: "2", code: "Digit2", zone: "alpha", x: 249, y: 82, w: 86, h: 91, char: "2" },
  { id: "3", label: "3", code: "Digit3", zone: "alpha", x: 340, y: 82, w: 86, h: 91, char: "3" },
  { id: "4", label: "4", code: "Digit4", zone: "alpha", x: 431, y: 82, w: 86, h: 91, char: "4" },
  { id: "5", label: "5", code: "Digit5", zone: "alpha", x: 522, y: 82, w: 86, h: 91, char: "5" },
  { id: "6", label: "6", code: "Digit6", zone: "alpha", x: 612, y: 82, w: 86, h: 91, char: "6" },
  { id: "7", label: "7", code: "Digit7", zone: "alpha", x: 702, y: 82, w: 86, h: 91, char: "7" },
  { id: "8", label: "8", code: "Digit8", zone: "alpha", x: 792, y: 82, w: 86, h: 91, char: "8" },
  { id: "9", label: "9", code: "Digit9", zone: "alpha", x: 882, y: 82, w: 86, h: 91, char: "9" },
  { id: "0", label: "0", code: "Digit0", zone: "alpha", x: 972, y: 82, w: 86, h: 91, char: "0" },
  { id: "minus", label: "-", code: "Minus", zone: "alpha", x: 1064, y: 82, w: 86, h: 91, char: "-" },
  { id: "equal", label: "=", code: "Equal", zone: "alpha", x: 1158, y: 82, w: 86, h: 91, char: "=" },
  { id: "bksp", label: "BKSP", code: "Backspace", zone: "mod", x: 1255, y: 82, w: 176, h: 91 },

  { id: "tab", label: "TAB", code: "Tab", zone: "mod", x: 64, y: 182, w: 132, h: 90 },
  { id: "q", label: "Q", code: "KeyQ", zone: "alpha", x: 205, y: 182, w: 86, h: 90, char: "Q" },
  { id: "w", label: "W", code: "KeyW", zone: "alpha", x: 296, y: 182, w: 85, h: 90, char: "W" },
  { id: "e", label: "E", code: "KeyE", zone: "alpha", x: 387, y: 182, w: 85, h: 90, char: "E" },
  { id: "r", label: "R", code: "KeyR", zone: "alpha", x: 477, y: 182, w: 85, h: 90, char: "R" },
  { id: "t", label: "T", code: "KeyT", zone: "alpha", x: 568, y: 182, w: 85, h: 90, char: "T" },
  { id: "y", label: "Y", code: "KeyY", zone: "alpha", x: 658, y: 182, w: 85, h: 90, char: "Y" },
  { id: "u", label: "U", code: "KeyU", zone: "alpha", x: 748, y: 182, w: 85, h: 90, char: "U" },
  { id: "i", label: "I", code: "KeyI", zone: "alpha", x: 838, y: 182, w: 85, h: 90, char: "I" },
  { id: "o", label: "O", code: "KeyO", zone: "alpha", x: 929, y: 182, w: 85, h: 90, char: "O" },
  { id: "p", label: "P", code: "KeyP", zone: "alpha", x: 1021, y: 182, w: 85, h: 90, char: "P" },
  { id: "lbrk", label: "[", code: "BracketLeft", zone: "alpha", x: 1112, y: 182, w: 88, h: 90, char: "[" },
  { id: "rbrk", label: "]", code: "BracketRight", zone: "alpha", x: 1206, y: 182, w: 88, h: 90, char: "]" },
  { id: "bslh", label: "\\", code: "Backslash", zone: "alpha", x: 1301, y: 182, w: 135, h: 90, char: "\\" },
  { id: "del", label: "DEL", code: "Delete", zone: "mod", x: 1446, y: 182, w: 86, h: 90 },

  { id: "caps", label: "CAPS", code: "CapsLock", zone: "mod", x: 64, y: 280, w: 160, h: 91 },
  { id: "a", label: "A", code: "KeyA", zone: "alpha", x: 230, y: 280, w: 86, h: 91, char: "A" },
  { id: "s", label: "S", code: "KeyS", zone: "alpha", x: 321, y: 280, w: 85, h: 91, char: "S" },
  { id: "d", label: "D", code: "KeyD", zone: "alpha", x: 411, y: 280, w: 85, h: 91, char: "D" },
  { id: "f", label: "F", code: "KeyF", zone: "alpha", x: 502, y: 280, w: 85, h: 91, char: "F" },
  { id: "g", label: "G", code: "KeyG", zone: "alpha", x: 592, y: 280, w: 85, h: 91, char: "G" },
  { id: "h", label: "H", code: "KeyH", zone: "alpha", x: 682, y: 280, w: 86, h: 91, char: "H" },
  { id: "j", label: "J", code: "KeyJ", zone: "alpha", x: 773, y: 280, w: 85, h: 91, char: "J" },
  { id: "k", label: "K", code: "KeyK", zone: "alpha", x: 863, y: 280, w: 85, h: 91, char: "K" },
  { id: "l", label: "L", code: "KeyL", zone: "alpha", x: 953, y: 280, w: 85, h: 91, char: "L" },
  { id: "semi", label: ";", code: "Semicolon", zone: "alpha", x: 1046, y: 280, w: 85, h: 91, char: ";" },
  { id: "quot", label: "'", code: "Quote", zone: "alpha", x: 1138, y: 280, w: 86, h: 91, char: "'" },
  { id: "enter", label: "ENTER", code: "Enter", zone: "mod", x: 1230, y: 280, w: 199, h: 91 },
  { id: "pgdn", label: "PGDN", code: "PageDown", zone: "mod", x: 1446, y: 280, w: 86, h: 91 },

  { id: "lshift", label: "SHIFT", code: "ShiftLeft", zone: "mod", x: 64, y: 378, w: 202, h: 90 },
  { id: "z", label: "Z", code: "KeyZ", zone: "alpha", x: 274, y: 378, w: 86, h: 90, char: "Z" },
  { id: "x", label: "X", code: "KeyX", zone: "alpha", x: 365, y: 378, w: 86, h: 90, char: "X" },
  { id: "c", label: "C", code: "KeyC", zone: "alpha", x: 456, y: 378, w: 86, h: 90, char: "C" },
  { id: "v", label: "V", code: "KeyV", zone: "alpha", x: 547, y: 378, w: 85, h: 90, char: "V" },
  { id: "b", label: "B", code: "KeyB", zone: "alpha", x: 638, y: 378, w: 86, h: 90, char: "B" },
  { id: "n", label: "N", code: "KeyN", zone: "alpha", x: 729, y: 378, w: 86, h: 90, char: "N" },
  { id: "m", label: "M", code: "KeyM", zone: "alpha", x: 820, y: 378, w: 86, h: 90, char: "M" },
  { id: "comma", label: ",", code: "Comma", zone: "alpha", x: 912, y: 378, w: 85, h: 90, char: "," },
  { id: "dot", label: ".", code: "Period", zone: "alpha", x: 1003, y: 378, w: 86, h: 90, char: "." },
  { id: "slash", label: "/", code: "Slash", zone: "alpha", x: 1094, y: 378, w: 86, h: 90, char: "/" },
  { id: "rshift", label: "SHIFT", code: "ShiftRight", zone: "mod", x: 1187, y: 378, w: 150, h: 90 },
  { id: "up", label: "UP", code: "ArrowUp", zone: "mod", x: 1347, y: 378, w: 88, h: 90 },

  { id: "lctrl", label: "CTRL", code: "ControlLeft", zone: "mod", x: 65, y: 476, w: 105, h: 86 },
  { id: "win", label: "WIN", code: "MetaLeft", zone: "mod", x: 181, y: 476, w: 105, h: 86 },
  { id: "lalt", label: "ALT", code: "AltLeft", zone: "mod", x: 296, y: 476, w: 108, h: 86 },
  { id: "space", label: "SPACE", code: "Space", zone: "alpha", x: 413, y: 476, w: 560, h: 86, char: " " },
  { id: "ralt", label: "ALT", code: "AltRight", zone: "mod", x: 980, y: 476, w: 104, h: 86 },
  { id: "fn", label: "FN", code: "ContextMenu", zone: "mod", x: 1094, y: 476, w: 106, h: 86 },
  { id: "left", label: "LEFT", code: "ArrowLeft", zone: "mod", x: 1246, y: 476, w: 88, h: 86 },
  { id: "down", label: "DOWN", code: "ArrowDown", zone: "mod", x: 1347, y: 476, w: 88, h: 86 },
  { id: "right", label: "RIGHT", code: "ArrowRight", zone: "mod", x: 1446, y: 476, w: 86, h: 86 },
];

const CHASSIS_FINISHES = [
  { id: "silver", name: "Raw Silver", code: "SLV", rgb: [216, 216, 212] as const, priceDelta: 0, native: true },
  { id: "black", name: "Obsidian Black", code: "OBS", rgb: [24, 25, 28] as const, priceDelta: 20, native: false },
  { id: "titanium", name: "Bead Titanium", code: "TIT", rgb: [132, 136, 142] as const, priceDelta: 25, native: false },
  { id: "orange", name: "Signal Oxide", code: "OXD", rgb: [232, 80, 30] as const, priceDelta: 35, native: false },
] as const;

const ALPHA_FINISHES = [
  { id: "chalk", name: "Warm Chalk", code: "CHK", rgb: [236, 234, 228] as const, native: true },
  { id: "obsidian", name: "Graphite PBT", code: "GRP", rgb: [36, 38, 42] as const, native: false },
  { id: "stone", name: "Ash Grey", code: "ASH", rgb: [168, 170, 172] as const, native: false },
] as const;

const MOD_FINISHES = [
  { id: "pewter", name: "Stone Pewter", code: "PWT", rgb: [200, 198, 192] as const, native: true },
  { id: "charcoal", name: "Matte Charcoal", code: "CHR", rgb: [28, 30, 33] as const, native: false },
  { id: "signal", name: "Safety Orange", code: "SGN", rgb: [232, 82, 32] as const, native: false },
] as const;

const PLATES: readonly { id: PlateId; name: string; code: string; img: string; massDelta: number; priceDelta: number; resonanceHz: number; summary: string }[] = [
  { id: "alu", name: "Anodized Aluminum", code: "ALU", img: "/templates/machina-65/plate-alu.webp", massDelta: 110, priceDelta: 0, resonanceHz: 1850, summary: "Crisp clack" },
  { id: "brass", name: "Sandblasted Brass", code: "BRS", img: "/templates/machina-65/plate-brass.webp", massDelta: 245, priceDelta: 45, resonanceHz: 1320, summary: "Dense ping" },
  { id: "pc", name: "Frosted Polycarbonate", code: "PC", img: "/templates/machina-65/plate-pc.webp", massDelta: 48, priceDelta: 15, resonanceHz: 420, summary: "Deep thock" },
];

const SWITCHES: readonly { id: SwitchId; name: string; code: string; img: string; force: string; travel: string; priceDelta: number; summary: string }[] = [
  { id: "linear", name: "Linear POM", code: "LIN", img: "/templates/machina-65/switch-linear.webp", force: "55 g", travel: "3.8 mm", priceDelta: 0, summary: "Smooth bottom" },
  { id: "tactile", name: "Tactile Smoked", code: "TAC", img: "/templates/machina-65/switch-tactile.webp", force: "62 g", travel: "3.6 mm", priceDelta: 18, summary: "Crisp bump" },
  { id: "silent", name: "Silent Pewter", code: "SIL", img: "/templates/machina-65/switch-silent.webp", force: "50 g", travel: "3.5 mm", priceDelta: 22, summary: "Damped core" },
];

const EXPLODED_LAYERS = [
  {
    id: "keycaps",
    step: "01",
    name: "Double Shot PBT Keycaps",
    spec: "1.6 mm thick",
    note: "Matte pebble texture resists shine across years of coding.",
    img: "/templates/machina-65/exploded-1-keycaps.webp",
    offsetCollapsed: -92,
    offsetExpanded: -162,
  },
  {
    id: "switches",
    step: "02",
    name: "Hot Swap Switches",
    spec: "65 mechanical",
    note: "Factory lubed stems sit inside damped housing mounts.",
    img: "/templates/machina-65/exploded-2-switches.webp",
    offsetCollapsed: -60,
    offsetExpanded: -108,
  },
  {
    id: "plate",
    step: "03",
    name: "CNC Switch Plate",
    spec: "1.5 mm relief cut",
    note: "Interchangeable metal or polymer core shapes key acoustics.",
    img: "/templates/machina-65/exploded-3-plate.webp",
    offsetCollapsed: -28,
    offsetExpanded: -54,
  },
  {
    id: "foam",
    step: "04",
    name: "Poron Acoustic Core",
    spec: "3.5 mm cell foam",
    note: "Removes hollow case echo while keeping switch tone clean.",
    img: "/templates/machina-65/exploded-4-foam.webp",
    offsetCollapsed: 4,
    offsetExpanded: 2,
  },
  {
    id: "pcb",
    step: "05",
    name: "QMK Hot Swap PCB",
    spec: "1.6 mm matte black",
    note: "South facing sockets, hardware encoder header, USB-C.",
    img: "/templates/machina-65/exploded-5-pcb.webp",
    offsetCollapsed: 36,
    offsetExpanded: 58,
  },
  {
    id: "chassis",
    step: "06",
    name: "6063 CNC Chassis",
    spec: "Silicone gasket rim",
    note: "Isolated top and bottom halves cushion every bottom out.",
    img: "/templates/machina-65/exploded-6-chassis.webp",
    offsetCollapsed: 72,
    offsetExpanded: 120,
  },
  {
    id: "weight",
    step: "07",
    name: "Internal Brass Bar",
    spec: "580 g solid mass",
    note: "Sandblasted block anchors the board flat on your desk.",
    img: "/templates/machina-65/exploded-7-weight.webp",
    offsetCollapsed: 132,
    offsetExpanded: 194,
  },
] as const;

const SWATCHES = [
  {
    id: "alu",
    title: "6063 Anodized Aluminum",
    metric: "180 grit bead blast",
    detail: "Micro matte grain catches oblique desk light along crisp chamfers.",
    img: "/templates/machina-65/swatch-alu.webp",
  },
  {
    id: "brass",
    title: "C36000 Solid Brass",
    metric: "580 g bottom bar",
    detail: "Fine sandblasted mass tunes low frequency chassis resonance.",
    img: "/templates/machina-65/swatch-brass.webp",
  },
  {
    id: "pbt",
    title: "Double Shot PBT",
    metric: "1.6 mm wall",
    detail: "Sharp dual molded legends remain crisp through heavy daily typing.",
    img: "/templates/machina-65/swatch-pbt.webp",
  },
] as const;

const TRIM_ASSETS = {
  knobs: [
    { id: "brass" as const, label: "Brass Knob", img: "/templates/machina-65/knob-brass.webp", price: 24, mass: 38 },
    { id: "black" as const, label: "Black Knob", img: "/templates/machina-65/knob-black.webp", price: 18, mass: 16 },
    { id: "orange" as const, label: "Orange Knob", img: "/templates/machina-65/knob-orange.webp", price: 20, mass: 16 },
  ],
  escs: [
    { id: "orange" as const, label: "Orange ESC", img: "/templates/machina-65/cap-esc-orange.webp", price: 12, mass: 4 },
    { id: "brass" as const, label: "Brass ESC", img: "/templates/machina-65/cap-esc-brass.webp", price: 28, mass: 18 },
  ],
  enter: { label: "Accent Enter", img: "/templates/machina-65/cap-enter-accent.webp", price: 14, mass: 6 },
  space: { label: "Charcoal Space", img: "/templates/machina-65/cap-space-accent.webp", price: 16, mass: 12 },
  cable: { label: "Coiled LEMO", img: "/templates/machina-65/cable-coiled.webp", price: 48, mass: 145 },
} as const;

const FAQ_ITEMS = [
  {
    q: "Can I swap switches without soldering?",
    a: "Yes. All 65 sockets use gold plated hot swap clips rated for repeated changes.",
  },
  {
    q: "Does the encoder knob work with custom shortcuts?",
    a: "Yes. QMK and VIA let you map rotation and press to volume, zoom, or timeline scrubbing.",
  },
  {
    q: "What changes between Aluminum, Brass, and Polycarbonate plates?",
    a: "Aluminum offers balanced snap, Brass deepens metallic weight, and Polycarbonate softens bottom out.",
  },
  {
    q: "Is the carry case included with every kit?",
    a: "Yes. Each unit ships inside the custom molded EVA shell with matching polycarbonate dust cover.",
  },
  {
    q: "Does it support macOS, Windows, and Linux?",
    a: "Yes. Layer toggles live in onboard memory so keymaps travel across machines without software.",
  },
] as const;

const HARDWARE_SPECS = [
  { label: "Layout", value: "65% ANSI or ISO, rotary blocker" },
  { label: "Mount", value: "Isolated silicone gasket socks" },
  { label: "Front Height", value: "18.8 mm ergonomic lip" },
  { label: "Chassis Alloy", value: "CNC milled 6063 aluminum" },
  { label: "Firmware", value: "QMK & VIA open keymap" },
  { label: "Connection", value: "Recessed rear USB-C port" },
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

function useViewHeight(ref: RefObject<HTMLElement | null>) {
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

function useScrollProgress(ref: RefObject<HTMLElement | null>, kind: "leave" | "track", viewH: number) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -(r.top - top) / total)) : 0);
    };
    update();
    const t: HTMLElement | Window = s ?? window;
    t.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      t.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, kind, mv, viewH]);
  return mv;
}

function SplitWords({
  text,
  className,
  delay = 0,
  onView = false,
  reduced = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  onView?: boolean;
  reduced?: boolean;
}) {
  const words = text.split(" ");
  if (reduced) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            {...(onView ? { whileInView: { y: 0 }, viewport: { once: true, margin: "-8% 0px" } } : { animate: { y: 0 } })}
            transition={{ duration: MOTION_TOKENS.reveal, ease: MOTION_TOKENS.ease, delay: delay + i * MOTION_TOKENS.stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [val, setVal] = useState(to);
  const prevRef = useRef(to);

  useEffect(() => {
    const start = prevRef.current;
    prevRef.current = to;
    if (reduce || start === to) {
      setVal(to);
      return;
    }
    const t0 = performance.now();
    const dur = 280;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (to - start) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

class AcousticSynth {
  private ctx: AudioContext | null = null;

  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) this.ctx = new Ctor();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => undefined);
    }
    return this.ctx;
  }

  playKey(switchId: SwitchId, plateId: PlateId, gainScale: number, isLargeKey: boolean) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    const vol = Math.max(0.08, Math.min(0.95, gainScale));
    master.gain.setValueAtTime(vol * (switchId === "silent" ? 0.38 : 0.72), now);
    master.connect(ctx.destination);

    // Sub body thock
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    const baseFreq = plateId === "pc" ? 135 : plateId === "brass" ? 185 : 165;
    const keyFactor = isLargeKey ? 0.78 : 1.0 + (Math.random() - 0.5) * 0.08;
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(baseFreq * keyFactor * 1.45, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.52 * keyFactor, now + 0.045);
    bodyGain.gain.setValueAtTime(switchId === "silent" ? 0.25 : 0.55, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + (switchId === "silent" ? 0.032 : 0.055));
    bodyOsc.connect(bodyGain);
    bodyGain.connect(master);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.06);

    // Plate resonance ring
    const plateOsc = ctx.createOscillator();
    const plateGain = ctx.createGain();
    const plateFreq = plateId === "brass" ? 1320 : plateId === "alu" ? 1850 : 420;
    plateOsc.type = "sine";
    plateOsc.frequency.setValueAtTime(plateFreq * (0.97 + Math.random() * 0.06), now);
    plateGain.gain.setValueAtTime(plateId === "pc" ? 0.06 : switchId === "silent" ? 0.02 : 0.16, now);
    plateGain.gain.exponentialRampToValueAtTime(0.001, now + (plateId === "brass" ? 0.085 : 0.048));
    plateOsc.connect(plateGain);
    plateGain.connect(master);
    plateOsc.start(now);
    plateOsc.stop(now + 0.09);

    // Tactile transient bump or crisp snap
    const noiseDur = switchId === "silent" ? 0.015 : 0.024;
    const len = Math.floor(ctx.sampleRate * noiseDur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(switchId === "tactile" ? 2400 : switchId === "linear" ? 1750 : 900, now);
    filter.Q.setValueAtTime(switchId === "tactile" ? 2.4 : 1.2, now);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(switchId === "silent" ? 0.18 : switchId === "tactile" ? 0.65 : 0.42, now);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(master);
    noise.start(now);

    if (switchId === "tactile") {
      // Second crisp upstroke leaf transient
      const leaf = ctx.createOscillator();
      const lGain = ctx.createGain();
      leaf.type = "square";
      leaf.frequency.setValueAtTime(2900, now + 0.012);
      leaf.frequency.exponentialRampToValueAtTime(1100, now + 0.026);
      lGain.gain.setValueAtTime(0.08, now + 0.012);
      lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
      leaf.connect(lGain);
      lGain.connect(master);
      leaf.start(now + 0.012);
      leaf.stop(now + 0.03);
    }
  }

  playDetent() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.018);
    g.gain.setValueAtTime(0.14, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.022);
  }

  playZip() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let k = 0; k < 10; k++) {
      const t = now + k * 0.026;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(900 + k * 55, t);
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.016);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.018);
    }
  }
}

const synth = new AcousticSynth();

function isInsideRect(x: number, y: number, r: { x: number; y: number; w: number; h: number }): boolean {
  return x >= r.x - 2 && x <= r.x + r.w + 2 && y >= r.y - 2 && y <= r.y + r.h + 2;
}

function classifyPixelZone(x: number, y: number): "chassis" | "alpha" | "mod" | "gap" {
  // Outside keybed cavity or inside anodized blockers
  if (x < 59 || x > 1540 || y < 75 || y > 573) return "chassis";
  if (x >= 1433 && y <= 178) return "chassis";
  if (x >= 1436 && y >= 372 && y <= 472) return "chassis";
  if (x >= 1202 && x <= 1244 && y >= 472) return "chassis";

  for (let i = 0; i < KEYS_65.length; i++) {
    if (isInsideRect(x, y, KEYS_65[i])) {
      return KEYS_65[i].zone;
    }
  }
  return "gap";
}

function ExplodedLayerRow({
  layer,
  index,
  activeIdx,
  progress,
  isDark,
  reduce,
  total,
  spreadScale,
}: {
  layer: (typeof EXPLODED_LAYERS)[number];
  index: number;
  activeIdx: number;
  progress: MotionValue<number>;
  isDark: boolean;
  reduce: boolean | null;
  total: number;
  spreadScale: number;
}) {
  const y = useTransform(progress, [0.06, 0.88], [layer.offsetCollapsed * spreadScale, layer.offsetExpanded * spreadScale]);
  const isActive = activeIdx === index;
  const zIndex = total - index;

  return (
    <motion.div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none"
      style={{ y: reduce ? layer.offsetExpanded * spreadScale * 0.65 : y, zIndex }}
      animate={{
        opacity: isActive ? 1 : 0.88,
        scale: isActive ? 1.02 : 0.995,
      }}
      transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
    >
      <img
        src={layer.img}
        alt={layer.name}
        className="w-[84%] max-w-[640px] h-auto object-contain select-none"
        style={{
          filter: isActive
            ? `drop-shadow(0 18px 28px ${isDark ? "rgba(0,0,0,0.72)" : "rgba(14,15,16,0.26)"})`
            : `drop-shadow(0 8px 14px ${isDark ? "rgba(0,0,0,0.45)" : "rgba(14,15,16,0.12)"})`,
        }}
      />
    </motion.div>
  );
}

export function Machina65Preview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const layersTrackRef = useRef<HTMLElement>(null);
  const benchBoardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [localThemeOverride, setLocalThemeOverride] = useState<"light" | "dark" | null>(null);
  useEffect(() => {
    setLocalThemeOverride(null);
  }, [config.theme]);

  const isDark = (localThemeOverride ?? (config.theme === "light" ? "light" : "dark")) === "dark";
  const pal = isDark ? PALETTE.dark : PALETTE.light;

  // Responsive container measurement for preview frame parity
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || width < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && width < 1024);

  const viewH = useViewHeight(rootRef);
  const pageProgress = useScrollProgress(rootRef, "track", viewH);
  const layersProgress = useScrollProgress(layersTrackRef, "track", viewH);
  const smoothLayersProgress = useSpring(layersProgress, { stiffness: 190, damping: 28, mass: 0.5 });

  // Active section highlight for header indicator
  const [activeNav, setActiveNav] = useState("chassis");
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);

  useMotionValueEvent(layersProgress, "change", (v) => {
    const idx = Math.min(EXPLODED_LAYERS.length - 1, Math.max(0, Math.floor(v * EXPLODED_LAYERS.length)));
    setActiveLayerIdx(idx);
  });

  // Hero subtle pointer shadow tracking
  const heroShadowX = useSpring(0, { stiffness: 220, damping: 28 });
  const heroShadowY = useSpring(18, { stiffness: 220, damping: 28 });
  const [heroHotspot, setHeroHotspot] = useState<"esc" | "knob" | "weight" | null>(null);

  // Workbench interactive build state
  const [chassisId, setChassisId] = useState<(typeof CHASSIS_FINISHES)[number]["id"]>("silver");
  const [alphaId, setAlphaId] = useState<(typeof ALPHA_FINISHES)[number]["id"]>("chalk");
  const [modId, setModId] = useState<(typeof MOD_FINISHES)[number]["id"]>("pewter");
  const [plateId, setPlateId] = useState<PlateId>("brass");
  const [switchId, setSwitchId] = useState<SwitchId>("tactile");
  const [knobId, setKnobId] = useState<KnobId>("brass");
  const [knobAngle, setKnobAngle] = useState(25);
  const [knobVolume, setKnobVolume] = useState(72);
  const [escCapId, setEscCapId] = useState<EscCapId>("orange");
  const [enterAccent, setEnterAccent] = useState(false);
  const [spaceAccent, setSpaceAccent] = useState(false);
  const [cableAttached, setCableAttached] = useState(false);
  const [benchZone, setBenchZone] = useState<"finish" | "plate" | "switch" | "trims">("finish");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingCapture, setTypingCapture] = useState(false);

  // Pressed key visual + oscilloscope state
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [typedTape, setTypedTape] = useState("MACHINA 65 READY");
  const [lastTypedKey, setLastTypedKey] = useState("READY");
  const oscEnergyRef = useRef(0);
  const oscCanvasRef = useRef<HTMLCanvasElement>(null);
  const kbCanvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const [baseImgReady, setBaseImgReady] = useState(false);

  // Drag and drop floating state
  const [dragState, setDragState] = useState<{
    kind: TrimKind;
    value: string;
    label: string;
    img: string;
    x: number;
    y: number;
    active: boolean;
  } | null>(null);
  const [hoverDropZone, setHoverDropZone] = useState<TrimKind | null>(null);

  // Material optical loupe state
  const [activeSwatch, setActiveSwatch] = useState<string>("alu");
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; visible: boolean }>({ x: 50, y: 50, visible: false });

  // Before/After CNC wipe state
  const [wipePercent, setWipePercent] = useState(52);
  const wipeContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingWipe, setIsDraggingWipe] = useState(false);

  // Layout & Packaging state
  const [layoutMode, setLayoutMode] = useState<"ANSI" | "ISO">("ANSI");
  const [packStage, setPackStage] = useState<0 | 1 | 2 | 3>(0);
  const [packedBoardSrc, setPackedBoardSrc] = useState<string>("/templates/machina-65/top-master.webp");
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Derived totals
  const chassisObj = CHASSIS_FINISHES.find((c) => c.id === chassisId) ?? CHASSIS_FINISHES[0];
  const alphaObj = ALPHA_FINISHES.find((a) => a.id === alphaId) ?? ALPHA_FINISHES[0];
  const modObj = MOD_FINISHES.find((m) => m.id === modId) ?? MOD_FINISHES[0];
  const plateObj = PLATES.find((p) => p.id === plateId) ?? PLATES[0];
  const switchObj = SWITCHES.find((s) => s.id === switchId) ?? SWITCHES[0];
  const knobObj = TRIM_ASSETS.knobs.find((k) => k.id === knobId);
  const escObj = TRIM_ASSETS.escs.find((e) => e.id === escCapId);

  const totalMass = useMemo(() => {
    let m = 1140 + plateObj.massDelta;
    if (knobObj) m += knobObj.mass;
    if (escObj) m += escObj.mass;
    if (enterAccent) m += TRIM_ASSETS.enter.mass;
    if (spaceAccent) m += TRIM_ASSETS.space.mass;
    if (cableAttached) m += TRIM_ASSETS.cable.mass;
    return m;
  }, [plateObj, knobObj, escObj, enterAccent, spaceAccent, cableAttached]);

  const totalPrice = useMemo(() => {
    let p = 290 + chassisObj.priceDelta + plateObj.priceDelta + switchObj.priceDelta;
    if (knobObj) p += knobObj.price;
    if (escObj) p += escObj.price;
    if (enterAccent) p += TRIM_ASSETS.enter.price;
    if (spaceAccent) p += TRIM_ASSETS.space.price;
    if (cableAttached) p += TRIM_ASSETS.cable.price;
    return p;
  }, [chassisObj, plateObj, switchObj, knobObj, escObj, enterAccent, spaceAccent, cableAttached]);

  const buildCode = useMemo(() => {
    return `M65 ${layoutMode} ${chassisObj.code} ${plateObj.code} ${switchObj.code}`;
  }, [layoutMode, chassisObj, plateObj, switchObj]);

  // Load top-master.webp once for real-time canvas zone tinting
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/templates/machina-65/top-master.webp";
    img.onload = () => {
      baseImageRef.current = img;
      setBaseImgReady(true);
    };
  }, []);

  // Recompute tinted 1600x632 top-down canvas whenever chassis / alpha / mod / plate changes
  useEffect(() => {
    const canvas = kbCanvasRef.current;
    const img = baseImageRef.current;
    if (!canvas || !img || !baseImgReady) return;
    const w = 1600;
    const h = 632;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    if (chassisObj.native && alphaObj.native && modObj.native && plateId === "alu") {
      return;
    }

    const frame = ctx.getImageData(0, 0, w, h);
    const data = frame.data;
    const cRgb = chassisObj.rgb;
    const aRgb = alphaObj.rgb;
    const mRgb = modObj.rgb;
    const isDarkAlpha = (aRgb[0] + aRgb[1] + aRgb[2]) / 3 < 110;
    const isDarkMod = (mRgb[0] + mRgb[1] + mRgb[2]) / 3 < 110;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const alpha = data[idx + 3];
        if (alpha < 15) continue;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = (r + g + b) / 3;
        const zone = classifyPixelZone(x, y);

        if (zone === "chassis" && !chassisObj.native) {
          const factor = Math.min(1.18, lum / 210);
          const spec = lum > 224 ? (lum - 224) * 1.3 : 0;
          data[idx] = Math.min(255, Math.round(cRgb[0] * factor + spec));
          data[idx + 1] = Math.min(255, Math.round(cRgb[1] * factor + spec));
          data[idx + 2] = Math.min(255, Math.round(cRgb[2] * factor + spec));
        } else if (zone === "alpha" && !alphaObj.native) {
          if (isDarkAlpha && lum < 86) {
            const inkLift = Math.round(218 - lum * 0.9);
            data[idx] = inkLift;
            data[idx + 1] = inkLift;
            data[idx + 2] = inkLift - 4;
          } else {
            const f = Math.min(1.12, lum / 225);
            data[idx] = Math.min(255, Math.round(aRgb[0] * f));
            data[idx + 1] = Math.min(255, Math.round(aRgb[1] * f));
            data[idx + 2] = Math.min(255, Math.round(aRgb[2] * f));
          }
        } else if (zone === "mod" && !modObj.native) {
          if (isDarkMod && lum < 86) {
            const inkLift = Math.round(224 - lum * 0.85);
            data[idx] = inkLift;
            data[idx + 1] = inkLift;
            data[idx + 2] = inkLift - 2;
          } else {
            const f = Math.min(1.14, lum / 205);
            data[idx] = Math.min(255, Math.round(mRgb[0] * f));
            data[idx + 1] = Math.min(255, Math.round(mRgb[1] * f));
            data[idx + 2] = Math.min(255, Math.round(mRgb[2] * f));
          }
        } else if (zone === "gap" && plateId !== "alu") {
          if (plateId === "brass") {
            data[idx] = Math.min(255, Math.round(r * 0.8 + 46));
            data[idx + 1] = Math.min(255, Math.round(g * 0.78 + 34));
            data[idx + 2] = Math.max(0, Math.round(b * 0.6));
          } else if (plateId === "pc") {
            data[idx] = Math.min(255, r + 26);
            data[idx + 1] = Math.min(255, g + 26);
            data[idx + 2] = Math.min(255, b + 28);
          }
        }
      }
    }
    ctx.putImageData(frame, 0, 0);
  }, [baseImgReady, chassisObj, alphaObj, modObj, plateId]);

  // Trigger a single key press (from screen tap or physical keyboard)
  const triggerKey = useCallback(
    (k: KeyDef) => {
      setPressedKeys((prev) => ({ ...prev, [k.id]: true }));
      window.setTimeout(() => {
        setPressedKeys((prev) => {
          const next = { ...prev };
          delete next[k.id];
          return next;
        });
      }, 135);

      oscEnergyRef.current = 1;
      setLastTypedKey(k.label);

      if (k.id === "bksp") {
        setTypedTape((prev) => (prev.length > 0 ? prev.slice(0, -1) : ""));
      } else if (k.id === "enter") {
        setTypedTape("CONFIRMED");
      } else if (k.id === "esc") {
        setTypedTape("");
      } else if (k.char) {
        setTypedTape((prev) => {
          const base = prev === "MACHINA 65 READY" || prev === "CONFIRMED" ? "" : prev;
          return (base + k.char).slice(-28);
        });
      }

      if (soundEnabled) {
        const isBig = k.w > 140;
        synth.playKey(switchId, plateId, knobVolume / 100, isBig);
      }
    },
    [soundEnabled, switchId, plateId, knobVolume]
  );

  // Physical keyboard capture when bench is active
  useEffect(() => {
    if (!typingCapture) return;
    const onDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const match = KEYS_65.find((k) => k.code === e.code);
      if (!match) return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") {
        e.preventDefault();
      }
      if (!e.repeat) triggerKey(match);
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, [typingCapture, triggerKey]);

  // Real-time oscilloscope canvas loop
  useEffect(() => {
    const canvas = oscCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let phase = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const energy = oscEnergyRef.current;
      oscEnergyRef.current = reduce ? 0 : energy * 0.89;
      phase += 0.24;

      // Baseline hairline
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Active waveform
      const freqMult = plateId === "brass" ? 0.14 : plateId === "alu" ? 0.19 : 0.08;
      const damp = switchId === "silent" ? 0.45 : switchId === "tactile" ? 1.1 : 0.85;
      ctx.strokeStyle = energy > 0.05 ? pal.accent : pal.muted;
      ctx.lineWidth = energy > 0.05 ? 2 : 1.25;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const env = Math.sin((x / w) * Math.PI);
        const amp = (energy * 18 * damp + 1.5) * env;
        const y = h / 2 + Math.sin(x * freqMult + phase) * amp * Math.cos(x * 0.04 - phase * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (energy > 0.015 || !reduce) {
        raf = requestAnimationFrame(draw);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [pal.accent, pal.line, pal.muted, plateId, switchId, reduce]);

  // Drag & Drop pointer tracking for trims
  const handleTrimPointerDown = (
    e: React.PointerEvent,
    kind: TrimKind,
    value: string,
    label: string,
    img: string
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;

    const applyEquip = () => {
      if (kind === "knob") {
        const v = value as Exclude<KnobId, "none">;
        setKnobId((cur) => (cur === v ? "none" : v));
      } else if (kind === "esc") {
        const v = value as Exclude<EscCapId, "default">;
        setEscCapId((cur) => (cur === v ? "default" : v));
      } else if (kind === "enter") {
        setEnterAccent((cur) => !cur);
      } else if (kind === "space") {
        setSpaceAccent((cur) => !cur);
      } else if (kind === "cable") {
        setCableAttached((cur) => !cur);
      }
      if (soundEnabled) synth.playDetent();
    };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > 8) {
        moved = true;
      }
      if (moved) {
        setDragState({ kind, value, label, img, x: ev.clientX, y: ev.clientY, active: true });
        const rect = benchBoardRef.current?.getBoundingClientRect();
        if (
          rect &&
          ev.clientX >= rect.left - 30 &&
          ev.clientX <= rect.right + 30 &&
          ev.clientY >= rect.top - 70 &&
          ev.clientY <= rect.bottom + 30
        ) {
          setHoverDropZone(kind);
        } else {
          setHoverDropZone(null);
        }
      }
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!moved) {
        applyEquip();
      } else {
        const rect = benchBoardRef.current?.getBoundingClientRect();
        if (
          rect &&
          ev.clientX >= rect.left - 30 &&
          ev.clientX <= rect.right + 30 &&
          ev.clientY >= rect.top - 70 &&
          ev.clientY <= rect.bottom + 30
        ) {
          if (kind === "knob") setKnobId(value as Exclude<KnobId, "none">);
          if (kind === "esc") setEscCapId(value as Exclude<EscCapId, "default">);
          if (kind === "enter") setEnterAccent(true);
          if (kind === "space") setSpaceAccent(true);
          if (kind === "cable") setCableAttached(true);
          if (soundEnabled) synth.playDetent();
        }
      }
      setDragState(null);
      setHoverDropZone(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // Before/after finish wipe drag
  const updateWipeFromClientX = useCallback((clientX: number) => {
    const el = wipeContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setWipePercent(Math.min(96, Math.max(4, Math.round(pct))));
  }, []);

  useEffect(() => {
    if (!isDraggingWipe) return;
    const onMove = (e: PointerEvent) => updateWipeFromClientX(e.clientX);
    const onUp = () => setIsDraggingWipe(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDraggingWipe, updateWipeFromClientX]);

  // Multi-stage EVA case packing sequence
  const runPackSequence = () => {
    if (packStage > 0) {
      setPackStage(0);
      return;
    }
    if (kbCanvasRef.current && baseImgReady) {
      try {
        setPackedBoardSrc(kbCanvasRef.current.toDataURL("image/webp", 0.85));
      } catch {
        setPackedBoardSrc("/templates/machina-65/top-master.webp");
      }
    }
    setPackStage(1);
    if (soundEnabled) synth.playDetent();
    window.setTimeout(() => setPackStage(2), reduce ? 50 : 420);
    window.setTimeout(() => {
      setPackStage(3);
      if (soundEnabled) synth.playZip();
    }, reduce ? 100 : 960);
  };

  const handleCopySpec = () => {
    const text = `${buildCode} | ${totalMass} g | $${totalPrice} | Plate ${plateObj.name} | Switch ${switchObj.name}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    setCopiedSpec(true);
    window.setTimeout(() => setCopiedSpec(false), 1800);
  };

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const root = rootRef.current;
    if (!root) return;
    const target = root.querySelector(`#${id}`);
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const rotateKnob = () => {
    setKnobAngle((a) => a + 45);
    setKnobVolume((v) => (v >= 100 ? 40 : v + 15));
    if (soundEnabled) synth.playDetent();
  };

  const resetAllTrims = () => {
    setKnobId("none");
    setEscCapId("default");
    setEnterAccent(false);
    setSpaceAccent(false);
    setCableAttached(false);
    if (soundEnabled) synth.playDetent();
  };

  const displayBrand = config.brandName?.trim() || "MACHINA 65";
  const displayHeadline = config.heroTitle?.trim() || "MILLED FROM SOLID BLOCK";
  const displaySubtitle =
    config.heroSubtitle?.trim() || "CNC aluminum 65% keyboard with brass mass, swappable plates, and live acoustic bench.";

  const hidden = config.hiddenSections || {};
  const shadowString = useMotionTemplate`${heroShadowX}px ${heroShadowY}px 32px ${
    isDark ? "rgba(0, 0, 0, 0.72)" : "rgba(14, 15, 16, 0.22)"
  }`;

  const navItems = [
    { id: "layers", label: "Layers" },
    { id: "bench", label: "Bench" },
    { id: "materials", label: "Materials" },
    { id: "finish", label: "Finish" },
    { id: "pack", label: "Pack" },
  ];

  const pxPad = isMobile ? "px-5" : isTablet ? "px-8" : "px-12";

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip antialiased selection:bg-[#FF5B24] selection:text-white"
      style={{
        backgroundColor: pal.bg,
        color: pal.text,
        fontFamily: FONT.body,
      }}
    >
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      {/* Dragging ghost preview */}
      {dragState?.active && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: dragState.x, top: dragState.y }}
        >
          <img
            src={dragState.img}
            alt={dragState.label}
            className="w-20 h-20 object-contain scale-110"
            style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.45))" }}
          />
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          backgroundColor: isDark ? "rgba(11,12,13,0.88)" : "rgba(247,247,246,0.9)",
          borderColor: pal.line,
        }}
      >
        <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "h-14" : "h-16"} flex items-center justify-between gap-3`}>
          <button
            type="button"
            onClick={() => scrollToSection("chassis")}
            className="flex items-center gap-2.5 text-left min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: pal.accent }}
          >
            {config.customLogoUrl ? (
              <img src={config.customLogoUrl} alt={displayBrand} className="h-6 w-auto object-contain" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <rect x="1.5" y="3.5" width="17" height="13" stroke={pal.text} strokeWidth="1.6" />
                <rect x="4" y="6.5" width="3.5" height="3" fill={pal.accent} />
                <rect x="9" y="6.5" width="7" height="3" fill={pal.text} />
                <rect x="4" y="11" width="12" height="2.5" fill={pal.text} />
              </svg>
            )}
            <span
              className="text-sm font-bold tracking-tight uppercase whitespace-nowrap"
              style={{ fontFamily: FONT.display, color: pal.text }}
            >
              {displayBrand}
            </span>
          </button>

          {!isMobile && (
            <nav aria-label="Primary sections" className={`flex items-center ${isTablet ? "gap-0.5" : "gap-1"}`}>
              {navItems.map((item) => {
                const active = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`relative ${isTablet ? "px-2" : "px-3"} py-2 text-xs font-medium tracking-wide uppercase transition-colors min-h-[44px] whitespace-nowrap`}
                    style={{
                      fontFamily: FONT.mono,
                      color: active ? pal.text : pal.muted,
                    }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="m65-nav-rule"
                        transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                        className="absolute inset-x-3 bottom-2 h-[2px]"
                        style={{ backgroundColor: pal.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Mute switch audio" : "Enable switch audio"}
              onClick={() => setSoundEnabled((s) => !s)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-[2px] border transition-colors"
              style={{ borderColor: pal.line, backgroundColor: pal.surface, color: soundEnabled ? pal.accent : pal.muted }}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setLocalThemeOverride(isDark ? "light" : "dark")}
              className="inline-flex items-center justify-center w-11 h-11 rounded-[2px] border transition-colors"
              style={{ borderColor: pal.line, backgroundColor: pal.surface, color: pal.text }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {!isMobile && (
              <motion.button
                type="button"
                whileTap={reduce ? undefined : { scale: 0.97 }}
                onClick={() => scrollToSection("pack")}
                className={`${isTablet ? "px-3.5" : "px-4"} min-h-[44px] rounded-[2px] text-xs font-semibold tracking-wide uppercase transition-opacity hover:opacity-90 whitespace-nowrap shrink-0`}
                style={{
                  fontFamily: FONT.mono,
                  backgroundColor: pal.accent,
                  color: pal.accentInk,
                }}
              >
                Pack build
              </motion.button>
            )}
          </div>
        </div>

        {/* Hairline scroll indicator */}
        <motion.div
          className="h-[2px] origin-left"
          style={{
            backgroundColor: pal.accent,
            scaleX: reduce ? 1 : pageProgress,
          }}
        />
      </header>

      {/* Section 1: Hero */}
      {!hidden.hero && (
        <section
          id="chassis"
          ref={heroRef}
          onPointerMove={(e) => {
            if (isMobile || reduce) return;
            const r = e.currentTarget.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            heroShadowX.set(Math.round(-nx * 24));
            heroShadowY.set(Math.round(18 - ny * 12));
          }}
          className="border-b"
          style={{ borderColor: pal.line }}
        >
          <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "py-10" : isTablet ? "py-16" : "py-24"}`}>
            <div className={`grid gap-10 items-center ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
              {/* Hero hardware visual: top on mobile, right on desktop */}
              <div className={`${isMobile ? "order-1" : "order-2 col-span-7"} relative`}>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: MOTION_TOKENS.ease }}
                  className="relative"
                >
                  <motion.img
                    src="/templates/machina-65/hero-board.webp"
                    alt="Machina 65 silver CNC mechanical keyboard"
                    className="w-full h-auto object-contain select-none"
                    style={{ filter: reduce ? undefined : shadowString }}
                  />

                  {/* Subtle interactive physical hotspot pins */}
                  <button
                    type="button"
                    aria-label="Inspect Escape keycap"
                    onMouseEnter={() => setHeroHotspot("esc")}
                    onMouseLeave={() => setHeroHotspot(null)}
                    onClick={() => setHeroHotspot((h) => (h === "esc" ? null : "esc"))}
                    className="absolute w-7 h-7 rounded-[2px] border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110"
                    style={{
                      left: "9%",
                      top: "30%",
                      fontFamily: FONT.mono,
                      backgroundColor: heroHotspot === "esc" ? pal.accent : pal.surface,
                      color: heroHotspot === "esc" ? pal.accentInk : pal.text,
                      borderColor: pal.line,
                    }}
                  >
                    01
                  </button>

                  <button
                    type="button"
                    aria-label="Inspect Brass rotary encoder"
                    onMouseEnter={() => setHeroHotspot("knob")}
                    onMouseLeave={() => setHeroHotspot(null)}
                    onClick={() => setHeroHotspot((h) => (h === "knob" ? null : "knob"))}
                    className="absolute w-7 h-7 rounded-[2px] border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110"
                    style={{
                      left: "82%",
                      top: "8%",
                      fontFamily: FONT.mono,
                      backgroundColor: heroHotspot === "knob" ? pal.accent : pal.surface,
                      color: heroHotspot === "knob" ? pal.accentInk : pal.text,
                      borderColor: pal.line,
                    }}
                  >
                    02
                  </button>

                  <button
                    type="button"
                    aria-label="Inspect Brass chassis seam"
                    onMouseEnter={() => setHeroHotspot("weight")}
                    onMouseLeave={() => setHeroHotspot(null)}
                    onClick={() => setHeroHotspot((h) => (h === "weight" ? null : "weight"))}
                    className="absolute w-7 h-7 rounded-[2px] border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110"
                    style={{
                      left: "8%",
                      top: "74%",
                      fontFamily: FONT.mono,
                      backgroundColor: heroHotspot === "weight" ? pal.accent : pal.surface,
                      color: heroHotspot === "weight" ? pal.accentInk : pal.text,
                      borderColor: pal.line,
                    }}
                  >
                    03
                  </button>
                </motion.div>

                <div
                  className="mt-4 min-h-[36px] border-t pt-2.5 flex items-center justify-between text-xs"
                  style={{ borderColor: pal.line, fontFamily: FONT.mono, color: pal.muted }}
                >
                  <span>
                    {heroHotspot === "esc"
                      ? "01 Signal orange PBT accent keycap"
                      : heroHotspot === "knob"
                      ? "02 Knurled brass rotary encoder"
                      : heroHotspot === "weight"
                      ? "03 Solid brass side chassis rail"
                      : "Select numbered callout to inspect hardware detail"}
                  </span>
                  <span style={{ color: pal.text }}>65% FORM</span>
                </div>
              </div>

              {/* Left copy & actions */}
              <div className={`${isMobile ? "order-2" : "order-1 col-span-5"} flex flex-col gap-6`}>
                <h1
                  className="font-bold tracking-[-0.03em] leading-[0.95] text-balance"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(2.5rem, 5.2vw, 4.6rem)",
                    color: pal.text,
                  }}
                >
                  <SplitWords text={displayHeadline} reduced={Boolean(reduce)} />
                </h1>

                <p className="text-base leading-[1.55] max-w-[44ch]" style={{ color: pal.muted }}>
                  {displaySubtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    type="button"
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    onClick={() => scrollToSection("bench")}
                    className="px-6 min-h-[48px] rounded-[2px] text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-90"
                    style={{
                      fontFamily: FONT.mono,
                      backgroundColor: pal.accent,
                      color: pal.accentInk,
                    }}
                  >
                    Build board
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    onClick={() => {
                      setSoundEnabled(true);
                      scrollToSection("bench");
                    }}
                    className="px-6 min-h-[48px] rounded-[2px] border text-sm font-medium tracking-wide uppercase transition-colors"
                    style={{
                      fontFamily: FONT.mono,
                      borderColor: pal.line,
                      backgroundColor: pal.surface,
                      color: pal.text,
                    }}
                  >
                    Hear switches
                  </motion.button>
                </div>

                <div
                  className="grid grid-cols-3 border-t border-b divide-x"
                  style={{ borderColor: pal.line }}
                >
                  {[
                    { k: "Keys", v: "65 keys" },
                    { k: "Mass", v: "1,840 g" },
                    { k: "Sockets", v: "Hot swap" },
                  ].map((item) => (
                    <div key={item.k} className="py-3.5 px-3" style={{ borderColor: pal.line }}>
                      <div className="text-[11px] uppercase tracking-wider" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                        {item.k}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold tabular-nums" style={{ color: pal.text }}>
                        {item.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: 7-Layer Exploded Stack */}
      {!hidden.anatomy && (
        <section
          id="layers"
          ref={layersTrackRef}
          className="relative border-b"
          style={{
            borderColor: pal.line,
            height: reduce ? "auto" : isMobile ? `${Math.round(viewH * 2.1)}px` : `${Math.round(viewH * 2.9)}px`,
          }}
        >
          <div
            className={reduce ? "py-14" : `sticky ${isMobile ? "top-14" : "top-16"} overflow-hidden flex items-center`}
            style={{ height: reduce ? "auto" : `${viewH - (isMobile ? 56 : 64)}px` }}
          >
            <div className={`mx-auto w-full max-w-[1360px] ${pxPad} grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-12 items-center"}`}>
              {/* Stage */}
              <div className={`${isMobile ? "col-span-1 h-[310px]" : isTablet ? "col-span-7 h-[450px]" : "col-span-8 h-[560px]"} relative overflow-hidden`}>
                {EXPLODED_LAYERS.map((layer, i) => (
                  <ExplodedLayerRow
                    key={layer.id}
                    layer={layer}
                    index={i}
                    activeIdx={activeLayerIdx}
                    progress={smoothLayersProgress}
                    isDark={isDark}
                    reduce={reduce}
                    total={EXPLODED_LAYERS.length}
                    spreadScale={isMobile ? 0.52 : isTablet ? 0.78 : 1}
                  />
                ))}
              </div>

              {/* Layer Rail */}
              <div className={`${isMobile ? "col-span-1" : isTablet ? "col-span-5" : "col-span-4"} flex flex-col`}>
                <h2
                  className="font-bold tracking-[-0.025em] leading-[1.05] mb-3"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    color: pal.text,
                  }}
                >
                  Seven isolated layers.
                </h2>

                <div className="border-t" style={{ borderColor: pal.line }}>
                  {(isMobile ? [EXPLODED_LAYERS[activeLayerIdx]] : EXPLODED_LAYERS).map((layer, idx) => {
                    const realIdx = isMobile ? activeLayerIdx : idx;
                    const active = realIdx === activeLayerIdx;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setActiveLayerIdx(realIdx)}
                        className="relative w-full text-left py-2.5 px-3 border-b flex items-center justify-between gap-3 transition-colors min-h-[44px]"
                        style={{
                          borderColor: pal.line,
                          backgroundColor: active ? pal.surface : "transparent",
                        }}
                      >
                        {active && (
                          <motion.span
                            layoutId="m65-layer-accent"
                            transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                            className="absolute left-0 top-0 bottom-0 w-[3px]"
                            style={{ backgroundColor: pal.accent }}
                          />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] tabular-nums" style={{ fontFamily: FONT.mono, color: active ? pal.accent : pal.muted }}>
                              {layer.step}
                            </span>
                            <span className="text-sm font-semibold truncate" style={{ color: pal.text }}>
                              {layer.name}
                            </span>
                          </div>
                          {active && (
                            <p className="mt-1 text-xs leading-snug" style={{ color: pal.muted }}>
                              {layer.note}
                            </p>
                          )}
                        </div>
                        <span className="text-[11px] shrink-0" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          {layer.spec}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isMobile && (
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {EXPLODED_LAYERS.map((l, i) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setActiveLayerIdx(i)}
                        className="w-full min-h-[44px] px-2 border text-xs font-medium rounded-[2px]"
                        style={{
                          fontFamily: FONT.mono,
                          borderColor: i === activeLayerIdx ? pal.accent : pal.line,
                          backgroundColor: i === activeLayerIdx ? pal.accent : pal.surface,
                          color: i === activeLayerIdx ? pal.accentInk : pal.text,
                        }}
                      >
                        {l.step}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Interactive Top-Down Acoustic & Hardware Bench */}
      {!hidden.workbench && (
        <section id="bench" className="border-b" style={{ borderColor: pal.line }}>
          <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "py-12" : "py-20"}`}>
            {/* Section Title Row + Live Audio Oscilloscope */}
            <div className={`flex ${isMobile ? "flex-col items-stretch" : "flex-row items-end justify-between"} gap-6 mb-8`}>
              <div className="min-w-0">
                <h2
                  className="font-bold tracking-[-0.03em] leading-[1.0]"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    color: pal.text,
                  }}
                >
                  Configure, equip, and type live.
                </h2>
                <p className="mt-2 text-sm max-w-[50ch]" style={{ color: pal.muted }}>
                  Click keys or capture your keyboard. Drag hardware trims onto the frame or tap to fit.
                </p>
              </div>

              <div
                className={`flex items-center justify-between gap-3 border px-3 py-2 rounded-[2px] ${isMobile ? "w-full" : "shrink-0"} max-w-full overflow-hidden`}
                style={{ borderColor: pal.line, backgroundColor: pal.surface }}
              >
                <div className={isMobile ? "min-w-0 flex-1" : "shrink-0 min-w-[130px]"}>
                  <div className="text-[11px] uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                    Acoustic out
                  </div>
                  <div className="text-xs font-semibold truncate" style={{ fontFamily: FONT.mono, color: pal.text }}>
                    {switchObj.code} {plateObj.code} {lastTypedKey}
                  </div>
                </div>
                <canvas
                  ref={oscCanvasRef}
                  width={140}
                  height={36}
                  className={`block h-9 shrink-0 ${isMobile ? "w-[110px]" : "w-[140px]"}`}
                  // canvas-ok: live keystroke audio waveform synthesizer readout
                />
              </div>
            </div>

            {/* Bench Grid: Board Stage + Controls */}
            <div className={`grid gap-8 ${isMobile || isTablet ? "grid-cols-1" : "grid-cols-12 items-start"}`}>
              {/* Interactive Keyboard Surface */}
              <div className={`${isMobile || isTablet ? "col-span-1" : "col-span-8"}`}>
                {/* Live typing ribbon */}
                <div
                  className="flex flex-wrap items-center justify-between gap-2 border border-b-0 px-3 py-2 rounded-t-[2px]"
                  style={{ borderColor: pal.line, backgroundColor: pal.surface }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] uppercase" style={{ fontFamily: FONT.mono, color: pal.accent }}>
                      Tape
                    </span>
                    <span className="text-xs font-medium truncate tracking-wide" style={{ fontFamily: FONT.mono, color: pal.text }}>
                      {typedTape || "READY"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTypingCapture((t) => !t)}
                      className="px-3 min-h-[36px] border text-[11px] uppercase tracking-wider rounded-[2px] transition-colors"
                      style={{
                        fontFamily: FONT.mono,
                        borderColor: typingCapture ? pal.accent : pal.line,
                        backgroundColor: typingCapture ? pal.accent : pal.bg,
                        color: typingCapture ? pal.accentInk : pal.text,
                      }}
                    >
                      {typingCapture ? "Keyboard live" : "Capture typing"}
                    </button>
                    <button
                      type="button"
                      onClick={resetAllTrims}
                      title="Remove custom trims"
                      className="px-2.5 min-h-[36px] border text-[11px] uppercase rounded-[2px] inline-flex items-center gap-1.5"
                      style={{ fontFamily: FONT.mono, borderColor: pal.line, backgroundColor: pal.bg, color: pal.muted }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Strip trims</span>
                    </button>
                  </div>
                </div>

                {/* Keyboard Canvas + 67-Key Click/Press Overlay + Drop Targets */}
                <div
                  className={`relative border rounded-b-[2px] ${isMobile ? "p-3" : isTablet ? "p-6" : "p-8"} select-none`}
                  style={{ borderColor: pal.line, backgroundColor: pal.surfaceAlt }}
                >
                  <div ref={benchBoardRef} className="relative mx-auto w-full max-w-[820px]" style={{ aspectRatio: "1600 / 632" }}>
                    {/* Attached Coiled USB-C Cable */}
                    <AnimatePresence>
                      {cableAttached && (
                        <motion.img
                          src={TRIM_ASSETS.cable.img}
                          alt="Coiled aviator cable"
                          initial={reduce ? false : { opacity: 0, y: -14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={MOTION_TOKENS.spring}
                          onClick={() => setCableAttached(false)}
                          className="absolute cursor-pointer object-contain pointer-events-auto z-0"
                          style={{
                            left: "16%",
                            bottom: "91%",
                            width: "9.5%",
                            transformOrigin: "bottom center",
                            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Fallback sharp image while canvas warms */}
                    <img
                      src="/templates/machina-65/top-master.webp"
                      alt="Machina 65 top view"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      style={{ opacity: baseImgReady ? 0 : 1 }}
                    />

                    {/* Real-time multi-zone color canvas */}
                    <canvas
                      ref={kbCanvasRef}
                      className="relative z-10 w-full h-full block pointer-events-none"
                      style={{ filter: `drop-shadow(0 20px 30px ${isDark ? "rgba(0,0,0,0.68)" : "rgba(14,15,16,0.22)"})` }}
                      // canvas-ok: recolors CNC chassis, alpha keycaps, modifier keycaps, and switch plate per build selection
                    />

                    {/* Drop zone cue outlines while dragging */}
                    {hoverDropZone === "cable" && (
                      <div
                        className="absolute z-30 border-2 border-dashed px-2 py-1 text-[10px] uppercase"
                        style={{
                          left: "16%",
                          top: "-10%",
                          width: "12%",
                          height: "14%",
                          borderColor: pal.accent,
                          color: pal.accent,
                          fontFamily: FONT.mono,
                        }}
                      >
                        USB-C
                      </div>
                    )}

                    {/* Accent Cap Overlays + Interactive 65-key Hitboxes */}
                    <div className="absolute inset-0 z-20">
                      {KEYS_65.map((k) => {
                        const isPressed = Boolean(pressedKeys[k.id]);
                        const hasOrangeEsc = k.id === "esc" && escCapId === "orange";
                        const hasBrassEsc = k.id === "esc" && escCapId === "brass";
                        const hasEnterOverlay = k.id === "enter" && enterAccent;
                        const hasSpaceOverlay = k.id === "space" && spaceAccent;

                        const showDropHighlight =
                          (hoverDropZone === "esc" && k.id === "esc") ||
                          (hoverDropZone === "enter" && k.id === "enter") ||
                          (hoverDropZone === "space" && k.id === "space");

                        return (
                          <button
                            key={k.id}
                            type="button"
                            aria-label={`Key ${k.label}`}
                            onPointerDown={() => {
                              setTypingCapture(true);
                              triggerKey(k);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setTypingCapture(true);
                                triggerKey(k);
                              }
                            }}
                            className="absolute rounded-[2px] transition-transform duration-75 focus-visible:outline-2"
                            style={{
                              left: `${(k.x / 1600) * 100}%`,
                              top: `${(k.y / 632) * 100}%`,
                              width: `${(k.w / 1600) * 100}%`,
                              height: `${(k.h / 632) * 100}%`,
                              transform: isPressed ? "translateY(3px) scale(0.96)" : "translateY(0)",
                              boxShadow: showDropHighlight
                                ? `inset 0 0 0 2px ${pal.accent}`
                                : isPressed
                                ? `inset 0 2px 10px rgba(0,0,0,0.45), 0 0 0 1px ${pal.accent}`
                                : undefined,
                              outlineColor: pal.accent,
                            }}
                          >
                            {hasOrangeEsc && (
                              <img
                                src={TRIM_ASSETS.escs[0].img}
                                alt="Orange ESC"
                                className="w-full h-full object-contain scale-[1.06] pointer-events-none"
                              />
                            )}
                            {hasBrassEsc && (
                              <img
                                src={TRIM_ASSETS.escs[1].img}
                                alt="Brass ESC"
                                className="w-full h-full object-contain scale-[1.06] pointer-events-none"
                              />
                            )}
                            {hasEnterOverlay && (
                              <img
                                src={TRIM_ASSETS.enter.img}
                                alt="Accent Enter"
                                className="w-full h-full object-fill scale-[1.04] pointer-events-none"
                              />
                            )}
                            {hasSpaceOverlay && (
                              <img
                                src={TRIM_ASSETS.space.img}
                                alt="Charcoal Spacebar"
                                className="w-full h-full object-fill scale-[1.03] pointer-events-none"
                              />
                            )}
                          </button>
                        );
                      })}

                      {/* Rotary Encoder Socket */}
                      <button
                        type="button"
                        aria-label="Rotate encoder knob"
                        onClick={rotateKnob}
                        onWheel={(e) => {
                          e.preventDefault();
                          rotateKnob();
                        }}
                        className="absolute flex items-center justify-center rounded-full"
                        style={{
                          left: "89.3%",
                          top: "12.4%",
                          width: "6.4%",
                          height: "15.8%",
                          boxShadow: hoverDropZone === "knob" ? `0 0 0 2px ${pal.accent}` : undefined,
                        }}
                      >
                        {knobObj && (
                          <motion.img
                            src={knobObj.img}
                            alt={knobObj.label}
                            animate={{ rotate: knobAngle }}
                            transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                            className="w-[88%] h-[88%] object-contain pointer-events-none"
                            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))" }}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Test Keys Bar for thumb typing on mobile */}
                  <div className="mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: pal.line }}>
                    <div className="flex flex-wrap gap-1.5">
                      {["M", "A", "C", "H", "I", "N", "A", "Space", "Enter"].map((label, idx) => {
                        const match = KEYS_65.find((x) => x.label.toLowerCase() === label.toLowerCase() || x.id === label.toLowerCase());
                        if (!match) return null;
                        return (
                          <button
                            key={`${label}-${idx}`}
                            type="button"
                            onClick={() => triggerKey(match)}
                            className="px-3 min-h-[40px] border text-xs font-medium rounded-[2px] active:translate-y-[2px] transition-transform"
                            style={{
                              fontFamily: FONT.mono,
                              borderColor: pal.line,
                              backgroundColor: pal.surface,
                              color: pal.text,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-xs tabular-nums" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      Gain {knobVolume}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Right / Bottom Configurator Controls */}
              <div className={`${isMobile || isTablet ? "col-span-1" : "col-span-4"} flex flex-col gap-5`}>
                {/* Zone tabs */}
                <div className="grid grid-cols-4 border rounded-[2px]" style={{ borderColor: pal.line, backgroundColor: pal.surface }}>
                  {(
                    [
                      { id: "finish", label: "Colors" },
                      { id: "plate", label: "Plate" },
                      { id: "switch", label: "Switch" },
                      { id: "trims", label: "Trims" },
                    ] as const
                  ).map((tab) => {
                    const active = benchZone === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBenchZone(tab.id)}
                        className="relative py-2.5 text-xs font-medium uppercase tracking-wide min-h-[44px]"
                        style={{
                          fontFamily: FONT.mono,
                          color: active ? pal.accentInk : pal.muted,
                        }}
                      >
                        {active && (
                          <motion.span
                            layoutId="m65-bench-tab"
                            transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                            className="absolute inset-0"
                            style={{ backgroundColor: pal.accent }}
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Zone Panel */}
                <div className="border p-4 rounded-[2px] flex flex-col gap-5" style={{ borderColor: pal.line, backgroundColor: pal.surface }}>
                  {benchZone === "finish" && (
                    <>
                      <div>
                        <div className="text-xs uppercase tracking-wider mb-2.5 flex justify-between" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          <span>CNC Chassis</span>
                          <span style={{ color: pal.text }}>{chassisObj.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {CHASSIS_FINISHES.map((c) => {
                            const active = c.id === chassisId;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setChassisId(c.id)}
                                className="flex items-center gap-2.5 px-3 min-h-[44px] border text-left rounded-[2px] text-xs font-medium transition-colors"
                                style={{
                                  borderColor: active ? pal.accent : pal.line,
                                  backgroundColor: pal.bg,
                                  color: pal.text,
                                }}
                              >
                                <span
                                  className="w-4 h-4 shrink-0 border"
                                  style={{ backgroundColor: `rgb(${c.rgb.join(",")})`, borderColor: pal.line }}
                                />
                                <span className="truncate">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider mb-2.5 flex justify-between" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          <span>Alphas</span>
                          <span style={{ color: pal.text }}>{alphaObj.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {ALPHA_FINISHES.map((a) => {
                            const active = a.id === alphaId;
                            return (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => setAlphaId(a.id)}
                                className="flex items-center gap-2 px-2.5 min-h-[44px] border text-left rounded-[2px] text-xs font-medium"
                                style={{
                                  borderColor: active ? pal.accent : pal.line,
                                  backgroundColor: pal.bg,
                                  color: pal.text,
                                }}
                              >
                                <span
                                  className="w-3.5 h-3.5 shrink-0 border"
                                  style={{ backgroundColor: `rgb(${a.rgb.join(",")})`, borderColor: pal.line }}
                                />
                                <span className="truncate">{a.code}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider mb-2.5 flex justify-between" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          <span>Modifiers</span>
                          <span style={{ color: pal.text }}>{modObj.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {MOD_FINISHES.map((m) => {
                            const active = m.id === modId;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setModId(m.id)}
                                className="flex items-center gap-2 px-2.5 min-h-[44px] border text-left rounded-[2px] text-xs font-medium"
                                style={{
                                  borderColor: active ? pal.accent : pal.line,
                                  backgroundColor: pal.bg,
                                  color: pal.text,
                                }}
                              >
                                <span
                                  className="w-3.5 h-3.5 shrink-0 border"
                                  style={{ backgroundColor: `rgb(${m.rgb.join(",")})`, borderColor: pal.line }}
                                />
                                <span className="truncate">{m.code}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {benchZone === "plate" && (
                    <div className="flex flex-col gap-2.5">
                      {PLATES.map((p) => {
                        const active = p.id === plateId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPlateId(p.id);
                              if (soundEnabled) synth.playKey(switchId, p.id, knobVolume / 100, false);
                            }}
                            className="flex items-center gap-3 p-2.5 border text-left rounded-[2px] min-h-[68px]"
                            style={{
                              borderColor: active ? pal.accent : pal.line,
                              backgroundColor: pal.bg,
                            }}
                          >
                            <img src={p.img} alt={p.name} className="w-14 h-14 object-cover rounded-[2px] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold" style={{ color: pal.text }}>
                                {p.name}
                              </div>
                              <div className="text-xs flex items-center gap-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                                <span>{p.summary}</span>
                                <span>{p.resonanceHz} Hz</span>
                              </div>
                            </div>
                            <span className="text-xs tabular-nums" style={{ fontFamily: FONT.mono, color: pal.text }}>
                              +{p.massDelta}g
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {benchZone === "switch" && (
                    <div className="flex flex-col gap-2.5">
                      {SWITCHES.map((s) => {
                        const active = s.id === switchId;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSwitchId(s.id);
                              oscEnergyRef.current = 1;
                              if (soundEnabled) synth.playKey(s.id, plateId, knobVolume / 100, false);
                            }}
                            className="flex items-center gap-3 p-2.5 border text-left rounded-[2px] min-h-[72px]"
                            style={{
                              borderColor: active ? pal.accent : pal.line,
                              backgroundColor: pal.bg,
                            }}
                          >
                            <img src={s.img} alt={s.name} className="w-14 h-14 object-contain shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold" style={{ color: pal.text }}>
                                {s.name}
                              </div>
                              <div className="text-xs flex items-center gap-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                                <span>{s.force}</span>
                                <span>{s.summary}</span>
                              </div>
                            </div>
                            <span className="text-xs tabular-nums" style={{ fontFamily: FONT.mono, color: pal.accent }}>
                              {s.priceDelta ? `+$${s.priceDelta}` : "Base"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {benchZone === "trims" && (
                    <div className="flex flex-col gap-3">
                      <div className="text-xs" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                        Drag onto keyboard or tap to attach
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {TRIM_ASSETS.knobs.map((k) => {
                          const active = knobId === k.id;
                          return (
                            <button
                              key={k.id}
                              type="button"
                              onPointerDown={(e) => handleTrimPointerDown(e, "knob", k.id, k.label, k.img)}
                              className="flex items-center gap-2.5 p-2 border rounded-[2px] min-h-[54px] cursor-grab active:cursor-grabbing text-left touch-none"
                              style={{
                                borderColor: active ? pal.accent : pal.line,
                                backgroundColor: pal.bg,
                              }}
                            >
                              <img src={k.img} alt={k.label} className="w-9 h-9 object-contain shrink-0 pointer-events-none" />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold truncate" style={{ color: pal.text }}>
                                  {k.label}
                                </div>
                                <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                                  +${k.price}
                                </div>
                              </div>
                            </button>
                          );
                        })}

                        {TRIM_ASSETS.escs.map((cap) => {
                          const active = escCapId === cap.id;
                          return (
                            <button
                              key={cap.id}
                              type="button"
                              onPointerDown={(e) => handleTrimPointerDown(e, "esc", cap.id, cap.label, cap.img)}
                              className="flex items-center gap-2.5 p-2 border rounded-[2px] min-h-[54px] cursor-grab active:cursor-grabbing text-left touch-none"
                              style={{
                                borderColor: active ? pal.accent : pal.line,
                                backgroundColor: pal.bg,
                              }}
                            >
                              <img src={cap.img} alt={cap.label} className="w-9 h-9 object-contain shrink-0 pointer-events-none" />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold truncate" style={{ color: pal.text }}>
                                  {cap.label}
                                </div>
                                <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                                  +${cap.price}
                                </div>
                              </div>
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          onPointerDown={(e) =>
                            handleTrimPointerDown(e, "enter", "accent", TRIM_ASSETS.enter.label, TRIM_ASSETS.enter.img)
                          }
                          className="flex items-center gap-2.5 p-2 border rounded-[2px] min-h-[54px] cursor-grab active:cursor-grabbing text-left touch-none"
                          style={{
                            borderColor: enterAccent ? pal.accent : pal.line,
                            backgroundColor: pal.bg,
                          }}
                        >
                          <img src={TRIM_ASSETS.enter.img} alt={TRIM_ASSETS.enter.label} className="w-9 h-9 object-contain shrink-0 pointer-events-none" />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate" style={{ color: pal.text }}>
                              {TRIM_ASSETS.enter.label}
                            </div>
                            <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                              +${TRIM_ASSETS.enter.price}
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onPointerDown={(e) =>
                            handleTrimPointerDown(e, "space", "accent", TRIM_ASSETS.space.label, TRIM_ASSETS.space.img)
                          }
                          className="flex items-center gap-2.5 p-2 border rounded-[2px] min-h-[54px] cursor-grab active:cursor-grabbing text-left touch-none"
                          style={{
                            borderColor: spaceAccent ? pal.accent : pal.line,
                            backgroundColor: pal.bg,
                          }}
                        >
                          <img src={TRIM_ASSETS.space.img} alt={TRIM_ASSETS.space.label} className="w-9 h-9 object-contain shrink-0 pointer-events-none" />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate" style={{ color: pal.text }}>
                              {TRIM_ASSETS.space.label}
                            </div>
                            <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                              +${TRIM_ASSETS.space.price}
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onPointerDown={(e) =>
                            handleTrimPointerDown(e, "cable", "lemo", TRIM_ASSETS.cable.label, TRIM_ASSETS.cable.img)
                          }
                          className="col-span-2 flex items-center justify-between gap-2.5 p-2.5 border rounded-[2px] min-h-[54px] cursor-grab active:cursor-grabbing text-left touch-none"
                          style={{
                            borderColor: cableAttached ? pal.accent : pal.line,
                            backgroundColor: pal.bg,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <img src={TRIM_ASSETS.cable.img} alt={TRIM_ASSETS.cable.label} className="w-8 h-9 object-contain shrink-0 pointer-events-none" />
                            <div>
                              <div className="text-xs font-semibold" style={{ color: pal.text }}>
                                {TRIM_ASSETS.cable.label}
                              </div>
                              <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                                {cableAttached ? "Connected to rear USB-C" : "Drop near top edge"}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs tabular-nums" style={{ fontFamily: FONT.mono, color: pal.accent }}>
                            +${TRIM_ASSETS.cable.price}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Build Tally */}
                <div className="border p-4 rounded-[2px] flex items-center justify-between gap-4" style={{ borderColor: pal.line, backgroundColor: pal.surface }}>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      {buildCode}
                    </div>
                    <div className="text-lg font-bold tabular-nums mt-0.5 flex items-baseline gap-3" style={{ fontFamily: FONT.display, color: pal.text }}>
                      <span>$<Counter to={totalPrice} /></span>
                      <span className="text-sm font-medium" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                        <Counter to={totalMass} suffix=" g" />
                      </span>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    onClick={() => scrollToSection("pack")}
                    className="px-4 min-h-[44px] rounded-[2px] text-xs font-semibold uppercase tracking-wide"
                    style={{
                      fontFamily: FONT.mono,
                      backgroundColor: pal.accent,
                      color: pal.accentInk,
                    }}
                  >
                    Case pack
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Material Macro Loupe */}
      {!hidden.materials && (
        <section id="materials" className="border-b" style={{ borderColor: pal.line }}>
          <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "py-12" : "py-20"}`}>
            <div className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-12 items-start"}`}>
              <div className={`${isMobile ? "col-span-1" : "col-span-4"}`}>
                <h2
                  className="font-bold tracking-[-0.03em] leading-[1.0]"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)",
                    color: pal.text,
                  }}
                >
                  Three raw surfaces.
                </h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: pal.muted }}>
                  Inspect bead blasted aluminum, sandblasted solid brass, and double shot PBT texture up close.
                </p>

                <div className="mt-6 flex items-center gap-3 border p-3 rounded-[2px]" style={{ borderColor: pal.line, backgroundColor: pal.surface }}>
                  <img src="/templates/machina-65/puller-tool.webp" alt="CNC switch and cap puller" className="w-12 h-12 object-contain shrink-0" />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: pal.text }}>
                      Steel Switch Puller
                    </div>
                    <div className="text-xs" style={{ color: pal.muted }}>
                      Included inside every EVA kit.
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${isMobile ? "col-span-1" : "col-span-8"} grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
                {SWATCHES.map((sw) => {
                  const selected = activeSwatch === sw.id;
                  return (
                    <div
                      key={sw.id}
                      onClick={() => setActiveSwatch(sw.id)}
                      onPointerMove={(e) => {
                        if (isMobile || reduce) return;
                        const r = e.currentTarget.getBoundingClientRect();
                        setActiveSwatch(sw.id);
                        setLoupePos({
                          x: ((e.clientX - r.left) / r.width) * 100,
                          y: ((e.clientY - r.top) / r.height) * 100,
                          visible: true,
                        });
                      }}
                      onPointerLeave={() => setLoupePos((p) => ({ ...p, visible: false }))}
                      className="group relative border rounded-[2px] overflow-hidden cursor-zoom-in transition-colors"
                      style={{
                        borderColor: selected ? pal.accent : pal.line,
                        backgroundColor: pal.surface,
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={sw.img}
                          alt={sw.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />

                        {/* Optical magnification loupe */}
                        {selected && (loupePos.visible || isMobile) && !reduce && (
                          <div
                            className="pointer-events-none absolute w-24 h-24 rounded-full border-2 shadow-xl -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${isMobile ? 50 : loupePos.x}%`,
                              top: `${isMobile ? 50 : loupePos.y}%`,
                              borderColor: pal.accent,
                              backgroundImage: `url(${sw.img})`,
                              backgroundSize: "240% 240%",
                              backgroundPosition: `${isMobile ? 50 : loupePos.x}% ${isMobile ? 50 : loupePos.y}%`,
                            }}
                          />
                        )}
                      </div>

                      <div className="p-3.5 border-t" style={{ borderColor: pal.line }}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold" style={{ color: pal.text }}>
                            {sw.title}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] uppercase" style={{ fontFamily: FONT.mono, color: pal.accent }}>
                          {sw.metric}
                        </div>
                        <p className="mt-1.5 text-xs leading-snug" style={{ color: pal.muted }}>
                          {sw.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Raw CNC vs Anodized Finish Wipe */}
      {!hidden.finish && (
        <section id="finish" className="border-b" style={{ borderColor: pal.line }}>
          <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "py-12" : "py-20"}`}>
            <div className={`flex ${isMobile ? "flex-col items-start" : "flex-row items-end justify-between"} gap-4 mb-6`}>
              <div>
                <h2
                  className="font-bold tracking-[-0.03em] leading-[1.0]"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(1.8rem, 3.6vw, 2.9rem)",
                    color: pal.text,
                  }}
                >
                  Raw mill marks against fine bead blast.
                </h2>
                <p className="mt-2 text-sm" style={{ color: pal.muted }}>
                  Drag the divider across the underside block to compare unanodized CNC paths against finished anodization.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { label: "Raw CNC", pct: 90 },
                  { label: "Split", pct: 50 },
                  { label: "Anodized", pct: 10 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setWipePercent(preset.pct)}
                    className="px-3 min-h-[44px] border text-xs uppercase rounded-[2px]"
                    style={{
                      fontFamily: FONT.mono,
                      borderColor: Math.abs(wipePercent - preset.pct) < 12 ? pal.accent : pal.line,
                      backgroundColor: pal.surface,
                      color: pal.text,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={wipeContainerRef}
              className="relative w-full overflow-hidden border rounded-[2px] select-none"
              style={{ borderColor: pal.line, aspectRatio: "1400 / 871", maxHeight: "560px" }}
            >
              {/* Anodized base */}
              <img
                src="/templates/machina-65/compare-finished.webp"
                alt="Anodized black aluminum chassis with brushed brass weight"
                className="w-full h-full object-cover block"
              />

              {/* Raw CNC layer clipped by wipePercent */}
              <img
                src="/templates/machina-65/compare-raw-cnc.webp"
                alt="Raw CNC milled aluminum with toolpaths"
                className="absolute inset-0 w-full h-full object-cover block"
                style={{ clipPath: `inset(0 ${100 - wipePercent}% 0 0)` }}
              />

              {/* Wipe handle */}
              <div
                onPointerDown={(e) => {
                  e.preventDefault();
                  setIsDraggingWipe(true);
                }}
                role="slider"
                tabIndex={0}
                aria-label="Compare raw CNC and anodized finish"
                aria-valuemin={4}
                aria-valuemax={96}
                aria-valuenow={wipePercent}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") setWipePercent((p) => Math.max(4, p - 4));
                  if (e.key === "ArrowRight") setWipePercent((p) => Math.min(96, p + 4));
                }}
                className="absolute inset-y-0 w-10 -translate-x-1/2 cursor-ew-resize flex items-center justify-center touch-none focus-visible:outline-2"
                style={{ left: `${wipePercent}%`, outlineColor: pal.accent }}
              >
                <div className="w-[2px] h-full" style={{ backgroundColor: pal.accent }} />
                <div
                  className="absolute w-9 h-9 rounded-[2px] border flex items-center justify-center text-[11px] font-bold"
                  style={{
                    fontFamily: FONT.mono,
                    backgroundColor: pal.bg,
                    borderColor: pal.accent,
                    color: pal.text,
                  }}
                >
                  {wipePercent}
                </div>
              </div>

              <div
                className="absolute left-3 bottom-3 px-2.5 py-1 text-[11px] uppercase border"
                style={{ fontFamily: FONT.mono, backgroundColor: pal.bg, borderColor: pal.line, color: pal.text }}
              >
                Raw CNC
              </div>
              <div
                className="absolute right-3 bottom-3 px-2.5 py-1 text-[11px] uppercase border"
                style={{ fontFamily: FONT.mono, backgroundColor: pal.bg, borderColor: pal.line, color: pal.text }}
              >
                Anodized
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Carry Case Pack Ritual */}
      {!hidden.pack && (
        <section id="pack" className="border-b" style={{ borderColor: pal.line }}>
          <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "py-12" : "py-20"}`}>
            <div className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-12 items-center"}`}>
              {/* Spec & Pack Action */}
              <div className={`${isMobile ? "col-span-1" : "col-span-5"} flex flex-col gap-5`}>
                <h2
                  className="font-bold tracking-[-0.03em] leading-[1.0]"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                    color: pal.text,
                  }}
                >
                  Seal inside molded EVA.
                </h2>

                <div className="flex gap-2">
                  {(["ANSI", "ISO"] as const).map((mode) => {
                    const active = layoutMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setLayoutMode(mode)}
                        className="relative flex-1 min-h-[44px] border text-xs font-semibold uppercase tracking-wide rounded-[2px]"
                        style={{
                          fontFamily: FONT.mono,
                          borderColor: active ? pal.accent : pal.line,
                          backgroundColor: active ? pal.accent : pal.surface,
                          color: active ? pal.accentInk : pal.text,
                        }}
                      >
                        {mode} 65%
                      </button>
                    );
                  })}
                </div>

                {/* Spec Summary */}
                <div className="border rounded-[2px] divide-y text-xs" style={{ borderColor: pal.line, backgroundColor: pal.surface }}>
                  {[
                    { k: "Chassis", v: chassisObj.name },
                    { k: "Keycaps", v: `${alphaObj.name} + ${modObj.name}` },
                    { k: "Plate", v: plateObj.name },
                    { k: "Switch", v: switchObj.name },
                    { k: "Trims", v: `${knobObj ? knobObj.label : "No knob"}, ${cableAttached ? "LEMO Cable" : "Board only"}` },
                    { k: "Total", v: `$${totalPrice} (${totalMass} g)` },
                  ].map((row) => (
                    <div key={row.k} className="px-3.5 py-2.5 flex items-center justify-between gap-4" style={{ borderColor: pal.line }}>
                      <span className="uppercase" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                        {row.k}
                      </span>
                      <span className="font-medium text-right" style={{ color: pal.text }}>
                        {row.v}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    type="button"
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    onClick={runPackSequence}
                    className="flex-1 min-h-[48px] px-5 rounded-[2px] text-sm font-semibold uppercase tracking-wide"
                    style={{
                      fontFamily: FONT.mono,
                      backgroundColor: pal.accent,
                      color: pal.accentInk,
                    }}
                  >
                    {packStage === 0 ? "Pack build" : packStage === 3 ? "Open case" : "Packing..."}
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleCopySpec}
                    className="min-h-[48px] px-4 border rounded-[2px] inline-flex items-center gap-2 text-xs uppercase"
                    style={{ fontFamily: FONT.mono, borderColor: pal.line, backgroundColor: pal.surface, color: pal.text }}
                  >
                    {copiedSpec ? <Check className="w-4 h-4" style={{ color: pal.accent }} /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSpec ? "Copied" : "Copy spec"}</span>
                  </button>
                </div>
              </div>

              {/* Animated Multi-Layer Carry Case Stage */}
              <div
                className={`${isMobile ? "col-span-1 p-3" : "col-span-7 p-6"} relative border rounded-[2px] overflow-hidden`}
                style={{ borderColor: pal.line, backgroundColor: pal.surfaceAlt }}
              >
                <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: "1200 / 999" }}>
                  {/* Open clamshell group: fades and folds closed along hinge when sealed */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: packStage === 3 ? 0 : 1,
                      scaleY: packStage === 3 ? 0.54 : 1,
                      y: packStage === 3 ? 28 : 0,
                    }}
                    transition={reduce ? { duration: 0 } : { duration: 0.34, ease: MOTION_TOKENS.ease }}
                    className="absolute inset-0 origin-center"
                  >
                    <img
                      src="/templates/machina-65/case-bottom.webp"
                      alt="Open velvet lined EVA carry case"
                      className="w-full h-full object-contain block"
                    />

                    {/* Seated mini board inside exact lower velvet cradle */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: packStage >= 1 ? 1 : 0,
                        y: packStage >= 1 ? 0 : -44,
                        scale: packStage >= 1 ? 1 : 1.04,
                      }}
                      transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                      className="absolute pointer-events-none"
                      style={{
                        left: "6.6%",
                        top: "58.2%",
                        width: "66.2%",
                        aspectRatio: "1600 / 632",
                      }}
                    >
                      <img
                        src={packedBoardSrc}
                        alt="Configured board packed inside case"
                        className="w-full h-full object-contain block"
                      />
                      {knobObj && (
                        <img
                          src={knobObj.img}
                          alt={knobObj.label}
                          className="absolute object-contain"
                          style={{ left: "89.8%", top: "13%", width: "5.8%", aspectRatio: "1 / 1" }}
                        />
                      )}
                      {escCapId !== "default" && (
                        <img
                          src={escCapId === "brass" ? TRIM_ASSETS.escs[1].img : TRIM_ASSETS.escs[0].img}
                          alt="Accent Esc"
                          className="absolute object-contain"
                          style={{ left: "4.0%", top: "13%", width: "5.4%", height: "14.4%" }}
                        />
                      )}
                      {enterAccent && (
                        <img
                          src={TRIM_ASSETS.enter.img}
                          alt="Accent Enter"
                          className="absolute object-fill"
                          style={{ left: "76.9%", top: "44.3%", width: "12.4%", height: "14.4%" }}
                        />
                      )}
                      {spaceAccent && (
                        <img
                          src={TRIM_ASSETS.space.img}
                          alt="Charcoal Spacebar"
                          className="absolute object-fill"
                          style={{ left: "25.8%", top: "75.3%", width: "35.0%", height: "13.5%" }}
                        />
                      )}
                    </motion.div>

                    {/* Frosted polycarbonate dust cover */}
                    <motion.img
                      src="/templates/machina-65/case-dustcover.webp"
                      alt="Frosted polycarbonate dust cover"
                      initial={false}
                      animate={{
                        opacity: packStage >= 2 ? 0.92 : 0,
                        y: packStage >= 2 ? 0 : -36,
                      }}
                      transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                      className="absolute pointer-events-none object-contain"
                      style={{
                        left: "6.4%",
                        top: "58.0%",
                        width: "66.6%",
                      }}
                    />
                  </motion.div>

                  {/* Single closed ribbed ballistic EVA case centered when sealed */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: packStage === 3 ? 1 : 0,
                      scale: packStage === 3 ? 1 : 0.94,
                      y: packStage === 3 ? 0 : -16,
                    }}
                    transition={reduce ? { duration: 0 } : { duration: 0.42, ease: MOTION_TOKENS.ease, delay: packStage === 3 ? 0.14 : 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <img
                      src="/templates/machina-65/case-lid.webp"
                      alt="Closed EVA carry case"
                      className="w-[92%] h-auto object-contain block"
                      style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.42))" }}
                    />
                  </motion.div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs border-t pt-3" style={{ borderColor: pal.line, fontFamily: FONT.mono, color: pal.muted }}>
                  <span>
                    {packStage === 0
                      ? "Case open"
                      : packStage === 1
                      ? "Board seated"
                      : packStage === 2
                      ? "Dust cover aligned"
                      : "Sealed and ready"}
                  </span>
                  <span style={{ color: pal.text }}>{buildCode}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 7: Spec Ledger & FAQ + Footer */}
      {!hidden.specs && (
        <section id="specs" className="border-b" style={{ borderColor: pal.line }}>
          <div className={`mx-auto max-w-[1360px] ${pxPad} ${isMobile ? "py-12" : "py-20"}`}>
            <div className={`grid gap-10 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
              {/* Ruled hardware table */}
              <div className={`${isMobile ? "col-span-1" : "col-span-5"}`}>
                <h2
                  className="font-bold tracking-[-0.025em] leading-[1.05] mb-5"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(1.65rem, 3vw, 2.3rem)",
                    color: pal.text,
                  }}
                >
                  Hardware tolerances.
                </h2>
                <div className="border-t" style={{ borderColor: pal.line }}>
                  {HARDWARE_SPECS.map((sp) => (
                    <div key={sp.label} className="py-3 border-b flex items-baseline justify-between gap-4 text-xs" style={{ borderColor: pal.line }}>
                      <span className="uppercase" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                        {sp.label}
                      </span>
                      <span className="font-medium text-right" style={{ color: pal.text }}>
                        {sp.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className={`${isMobile ? "col-span-1" : "col-span-7"}`}>
                <h2
                  className="font-bold tracking-[-0.025em] leading-[1.05] mb-5"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: "clamp(1.65rem, 3vw, 2.3rem)",
                    color: pal.text,
                  }}
                >
                  Common questions.
                </h2>
                <div className="border-t" style={{ borderColor: pal.line }}>
                  {FAQ_ITEMS.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={item.q} className="border-b" style={{ borderColor: pal.line }}>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full py-4 flex items-center justify-between gap-4 text-left min-h-[52px]"
                        >
                          <span className="text-sm font-semibold" style={{ color: pal.text }}>
                            {item.q}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={reduce ? { duration: 0 } : MOTION_TOKENS.spring}
                            className="text-lg leading-none shrink-0"
                            style={{ fontFamily: FONT.mono, color: isOpen ? pal.accent : pal.muted }}
                          >
                            +
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={reduce ? false : { height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={reduce ? undefined : { height: 0, opacity: 0 }}
                              transition={reduce ? { duration: 0 } : { duration: 0.25, ease: MOTION_TOKENS.ease }}
                              className="overflow-hidden"
                            >
                              <p className="pb-4 text-sm leading-relaxed max-w-[60ch]" style={{ color: pal.muted }}>
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Minimal Monochrome Footer */}
      <footer style={{ backgroundColor: pal.surface }}>
        <div className={`mx-auto max-w-[1360px] ${pxPad} py-8 flex ${isMobile ? "flex-col items-start" : "flex-row items-center justify-between"} gap-4`}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-tight uppercase" style={{ fontFamily: FONT.display, color: pal.text }}>
              {displayBrand}
            </span>
            <span className="text-xs" style={{ fontFamily: FONT.mono, color: pal.muted }}>
              65% CNC Mechanical Kit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocalThemeOverride(isDark ? "light" : "dark")}
              className="px-3 min-h-[44px] border text-xs uppercase rounded-[2px]"
              style={{ fontFamily: FONT.mono, borderColor: pal.line, backgroundColor: pal.bg, color: pal.text }}
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("chassis")}
              aria-label="Back to top"
              className="w-11 h-11 border rounded-[2px] inline-flex items-center justify-center"
              style={{ borderColor: pal.line, backgroundColor: pal.bg, color: pal.text }}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
