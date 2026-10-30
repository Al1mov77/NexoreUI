"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

export type ToppingId = "mozzarella" | "pepperoni" | "mushrooms" | "basil" | "olives" | "onion";
export type Phase = "intro" | "build" | "baking" | "done";
export type HandPose = "open" | "pinch" | "ok" | "point";
export type Fulfilment = "delivery" | "pickup";

export interface Point {
  x: number;
  y: number;
}

export interface ToppingDef {
  id: ToppingId;
  label: string;
  price: number;
  tray: string;
  pieces: readonly string[];
  count: number;
  size: number;
}

export interface PlacedPiece {
  key: string;
  toppingId: ToppingId;
  src: string;
  x: number;
  y: number;
  rot: number;
  scale: number;
  fromX: number;
  fromY: number;
  delay: number;
  leaving: boolean;
}

export interface PizzaGeometry {
  cx: number;
  cy: number;
  d: number;
}

const ASSET_BASE = "/templates/vesuvio-pizza";

const ASSETS = {
  counter: `${ASSET_BASE}/scene/counter.jpg`,
  boxClosed: `${ASSET_BASE}/scene/box-closed.webp`,
  boxBase: `${ASSET_BASE}/scene/box-base.webp`,
  boxAjar: `${ASSET_BASE}/scene/box-ajar.webp`,
  timer: `${ASSET_BASE}/scene/timer.webp`,
  dough: `${ASSET_BASE}/pizza/dough.webp`,
  sauce: `${ASSET_BASE}/pizza/sauce.webp`,
  crustBaked: `${ASSET_BASE}/pizza/crust-baked.webp`,
  pizzaBakedFull: `${ASSET_BASE}/pizza/pizza-baked-full.webp`,
  pieces: {
    mozzarella: [`${ASSET_BASE}/toppings/mozzarella-1.webp`, `${ASSET_BASE}/toppings/mozzarella-2.webp`],
    pepperoni: [`${ASSET_BASE}/toppings/pepperoni-1.webp`, `${ASSET_BASE}/toppings/pepperoni-2.webp`],
    mushrooms: [`${ASSET_BASE}/toppings/mushroom-1.webp`, `${ASSET_BASE}/toppings/mushroom-2.webp`],
    basil: [
      `${ASSET_BASE}/toppings/basil-1.webp`,
      `${ASSET_BASE}/toppings/basil-2.webp`,
      `${ASSET_BASE}/toppings/basil-3.webp`,
    ],
    olives: [`${ASSET_BASE}/toppings/olive-1.webp`],
    onion: [`${ASSET_BASE}/toppings/onion-1.webp`, `${ASSET_BASE}/toppings/onion-2.webp`],
  },
  trays: {
    mozzarella: `${ASSET_BASE}/trays/tray-mozzarella.webp`,
    pepperoni: `${ASSET_BASE}/trays/tray-pepperoni.webp`,
    mushrooms: `${ASSET_BASE}/trays/tray-mushrooms.webp`,
    basil: `${ASSET_BASE}/trays/tray-basil.webp`,
    olives: `${ASSET_BASE}/trays/tray-olives.webp`,
    onion: `${ASSET_BASE}/trays/tray-onion.webp`,
  },
  hands: {
    open: `${ASSET_BASE}/hands/hand-open.webp`,
    pinch: `${ASSET_BASE}/hands/hand-pinch.webp`,
    ok: `${ASSET_BASE}/hands/hand-ok.webp`,
    point: `${ASSET_BASE}/hands/hand-point.webp`,
  },
} as const;

export const BRAND = {
  name: "VESUVIO",
  suffix: "PIZZA ATELIER",
  tagline: "Hand-stretched sourdough. 850° volcanic stone hearth.",
  mascot: "Maestro Don Vesuvio",
} as const;

export const BASE_PRICE = 14;
export const DELIVERY_FEE = 3.5;
export const BAKE_MS = 4200;

export const TOPPINGS: readonly ToppingDef[] = [
  {
    id: "mozzarella",
    label: "Fior di Latte",
    price: 2.75,
    tray: ASSETS.trays.mozzarella,
    pieces: ASSETS.pieces.mozzarella,
    count: 7,
    size: 0.2,
  },
  {
    id: "pepperoni",
    label: "Calabrian Salame",
    price: 3.25,
    tray: ASSETS.trays.pepperoni,
    pieces: ASSETS.pieces.pepperoni,
    count: 9,
    size: 0.165,
  },
  {
    id: "mushrooms",
    label: "Wild Cremini",
    price: 2.5,
    tray: ASSETS.trays.mushrooms,
    pieces: ASSETS.pieces.mushrooms,
    count: 8,
    size: 0.17,
  },
  {
    id: "basil",
    label: "Genovese Basil",
    price: 1.5,
    tray: ASSETS.trays.basil,
    pieces: ASSETS.pieces.basil,
    count: 6,
    size: 0.17,
  },
  {
    id: "olives",
    label: "Castelvetrano",
    price: 2.0,
    tray: ASSETS.trays.olives,
    pieces: ASSETS.pieces.olives,
    count: 15,
    size: 0.062,
  },
  {
    id: "onion",
    label: "Tropea Sweet Onion",
    price: 1.75,
    tray: ASSETS.trays.onion,
    pieces: ASSETS.pieces.onion,
    count: 10,
    size: 0.21,
  },
];

export const TOPPING_BY_ID: Record<ToppingId, ToppingDef> = Object.fromEntries(
  TOPPINGS.map((t) => [t.id, t])
) as Record<ToppingId, ToppingDef>;

export const HAND_HOTSPOT: Record<HandPose, { x: number; y: number }> = {
  open: { x: 0.06, y: 0.32 },
  pinch: { x: 0.11, y: 0.52 },
  ok: { x: 0.06, y: 0.38 },
  point: { x: 0.02, y: 0.23 },
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const GOLDEN_ANGLE = 2.399963;
const SAUCE_LIMIT = 0.78;

function layoutPieces(def: ToppingDef, seed: number, origin: Point): PlacedPiece[] {
  const rand = mulberry32(hashString(`${def.id}:${seed}`));
  const rMax = SAUCE_LIMIT - def.size * 0.85;
  const rMin = 0.05;
  const phase = rand() * Math.PI * 2;
  const variantOffset = Math.floor(rand() * def.pieces.length);

  return Array.from({ length: def.count }, (_, i) => {
    const t = (i + 0.5) / def.count;
    const r = (rMin + (rMax - rMin) * Math.sqrt(t)) * (0.9 + rand() * 0.2);
    const theta = i * GOLDEN_ANGLE + phase + (rand() - 0.5) * 0.5;
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    return {
      key: `${def.id}-${seed}-${i}`,
      toppingId: def.id,
      src: def.pieces[(i + variantOffset) % def.pieces.length] as string,
      x,
      y,
      rot: rand() * 360,
      scale: 0.92 + rand() * 0.16,
      fromX: origin.x - x * 0.5,
      fromY: origin.y - y * 0.5,
      delay: i * 8 + rand() * 10,
      leaving: false,
    };
  });
}

type Easing = (t: number) => number;
const easeOut: Easing = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
const sleep = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));

function tween(
  ms: number,
  onFrame: (t: number) => void,
  ease: Easing = easeOut,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const step = (now: number) => {
      if (signal?.aborted) {
        resolve();
        return;
      }
      const t = clamp((now - start) / ms, 0, 1);
      onFrame(ease(t));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const money = (value: number): string => `$${value.toFixed(2)}`;

function etaWindow(fromMin: number, toMin: number, now: Date = new Date()): string {
  const a = new Date(now.getTime() + fromMin * 60_000);
  const b = new Date(now.getTime() + toMin * 60_000);
  const hhmm = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${hhmm(a)}–${hhmm(b)}`;
}

const HAND_BASE_ANGLE = 22;

export interface HeldPiece {
  src: string;
  px: number;
}

export interface HandController {
  rootRef: RefObject<HTMLDivElement | null>;
  pose: HandPose;
  visible: boolean;
  held: HeldPiece | null;
  setPose: (pose: HandPose) => void;
  setHeld: (held: HeldPiece | null) => void;
  place: (p: Point, angle?: number) => void;
  show: () => void;
  hide: () => void;
}

function useHand(): HandController {
  const rootRef = useRef<HTMLDivElement>(null);
  const current = useRef({ x: -300, y: -300, a: HAND_BASE_ANGLE });
  const poseRef = useRef<HandPose>("open");
  const visibleRef = useRef(false);

  const [pose, setPoseState] = useState<HandPose>("open");
  const [visible, setVisibleState] = useState(false);
  const [held, setHeld] = useState<HeldPiece | null>(null);

  const apply = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const { x, y, a } = current.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${a}deg)`;
  }, []);

  const place = useCallback(
    (p: Point, angle: number = HAND_BASE_ANGLE) => {
      current.current = { x: p.x, y: p.y, a: angle };
      apply();
    },
    [apply]
  );

  const setPose = useCallback((next: HandPose) => {
    if (poseRef.current !== next) {
      poseRef.current = next;
      setPoseState(next);
    }
  }, []);

  const show = useCallback(() => {
    if (!visibleRef.current) {
      visibleRef.current = true;
      setVisibleState(true);
    }
  }, []);

  const hide = useCallback(() => {
    if (visibleRef.current) {
      visibleRef.current = false;
      setVisibleState(false);
    }
  }, []);

  return useMemo(
    () => ({ rootRef, pose, visible, held, setPose, setHeld, place, show, hide }),
    [pose, visible, held, setPose, place, show, hide]
  );
}

function MoneyCounter({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    const ac = new AbortController();
    void tween(
      420,
      (t) => {
        const v = start + (value - start) * t;
        from.current = v;
        setShown(v);
      },
      easeOut,
      ac.signal
    );
    return () => ac.abort();
  }, [value]);

  return <span className="vsv-money">{money(shown)}</span>;
}

function PieceItem({ piece }: { piece: PlacedPiece }) {
  const ref = useRef<HTMLImageElement>(null);
  const size = TOPPING_BY_ID[piece.toppingId].size;

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const d = parent.clientWidth || 320;
    const dx = piece.fromX * d;
    const dy = piece.fromY * d;
    const anim = el.animate(
      [
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${piece.rot - 240}deg) scale(0.25)`,
          opacity: 0,
        },
        { opacity: 1, offset: 0.2 },
        { transform: `translate(-50%, -50%) rotate(${piece.rot}deg) scale(${piece.scale})`, opacity: 1 },
      ],
      { duration: 320, delay: piece.delay, easing: "cubic-bezier(0.2, 0.85, 0.25, 1)", fill: "backwards" }
    );
    return () => anim.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = {
    left: `${50 + piece.x * 50}%`,
    top: `${50 + piece.y * 50}%`,
    width: `${size * 100}%`,
    "--rot": `${piece.rot}deg`,
    "--s": piece.scale,
  } as CSSProperties;

  return (
    <img
      ref={ref}
      className="vsv-piece"
      data-id={piece.toppingId}
      data-leaving={piece.leaving}
      src={piece.src}
      style={style}
      alt=""
      draggable={false}
    />
  );
}

const SCOPED_CSS = `
.vsv-root {
  --vsv-red: #c4271c;
  --vsv-red-dark: #9f1d14;
  --vsv-green: #2f6b3a;
  --vsv-ink: #1b2130;
  --vsv-muted: #6b7280;
  --vsv-card: #fbfaf6;
  --vsv-font-display: 'Lilita One', 'Arial Rounded MT Bold', 'Trebuchet MS', system-ui, sans-serif;
  --vsv-font-body: 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --vsv-font-serif: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
  --vsv-font-mono: 'DM Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 680px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  background-color: #9ba0a4;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  font-family: var(--vsv-font-body);
  color: var(--vsv-ink);
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  -webkit-font-smoothing: antialiased;
}
.vsv-root *, .vsv-root *::before, .vsv-root *::after {
  box-sizing: border-box;
}
.vsv-root[data-cursor="hand"],
.vsv-root[data-cursor="hand"] * {
  cursor: none !important;
}
.vsv-root::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(20, 24, 30, 0.36));
}

.vsv-root .vsv-header {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  padding: clamp(14px, 2vw, 24px) clamp(16px, 3vw, 40px) 0;
}
.vsv-root .vsv-header__brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}
.vsv-root .vsv-header__top {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.vsv-root .vsv-logo {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  font-family: var(--vsv-font-display);
  color: var(--vsv-red);
  line-height: 1;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.55);
}
.vsv-root .vsv-logo__name {
  font-size: clamp(26px, 3.2vw, 38px);
  letter-spacing: 0.01em;
}
.vsv-root .vsv-logo__suffix {
  font-size: clamp(12px, 1.3vw, 15px);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.vsv-root .vsv-header__tag {
  margin: 0;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  color: var(--vsv-ink);
}
.vsv-root .vsv-pill {
  border: 0;
  padding: 8px 16px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--vsv-font-body);
  background: rgba(255, 255, 255, 0.94);
  color: var(--vsv-ink);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s, background 0.15s;
}
.vsv-root .vsv-pill:enabled:hover {
  transform: translateY(-1px);
  background: #ffffff;
}
.vsv-root .vsv-pill:disabled {
  opacity: 0.9;
}

.vsv-root .vsv-stage {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: minmax(220px, 300px) minmax(0, 1fr) minmax(250px, 320px);
  gap: clamp(12px, 2vw, 32px);
  padding: 0 clamp(14px, 3vw, 40px) clamp(14px, 2.4vw, 32px);
  min-height: 0;
}
.vsv-root .vsv-stage__left {
  position: relative;
  align-self: center;
  min-height: 0;
}
.vsv-root .vsv-stage__center {
  container-type: size;
  display: grid;
  place-items: center;
  min-height: 0;
  min-width: 0;
}
.vsv-root .vsv-stage__right {
  align-self: center;
  min-width: 0;
}

.vsv-root .vsv-board {
  position: relative;
  width: min(100cqw, 100cqh);
  max-width: 560px;
  max-height: 560px;
  aspect-ratio: 1;
}
.vsv-root .vsv-board__base,
.vsv-root .vsv-board__lid,
.vsv-root .vsv-pizza {
  position: absolute;
  left: 50%;
  top: 50%;
}
.vsv-root .vsv-board__base {
  width: 96%;
  height: auto;
  max-width: none;
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.32));
  transition: opacity 0.5s ease 0.15s, transform 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.1) 0.15s;
}
.vsv-root .vsv-board__base[data-open="true"] {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.vsv-root .vsv-board__lid {
  width: 96%;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: none;
  z-index: 6;
  transform: translate(-50%, -50%);
  transition: transform 0.95s cubic-bezier(0.55, 0.05, 0.25, 1), opacity 0.6s ease 0.1s;
}
.vsv-root .vsv-board__lid-wrap {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}
.vsv-root .vsv-board__lid[data-idle="true"] .vsv-board__lid-wrap {
  animation: vsv-lid-float 3.6s ease-in-out infinite;
}
.vsv-root .vsv-board__lid[data-idle="true"]:hover .vsv-board__lid-wrap {
  animation-play-state: paused;
}
@keyframes vsv-lid-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
.vsv-root .vsv-board__lid-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.35));
  transition: transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity 0.26s ease;
}
.vsv-root .vsv-board__lid-img--ajar {
  opacity: 0;
  transform: scale(0.98) rotate(-1deg);
}
.vsv-root .vsv-board__lid[data-idle="true"]:hover .vsv-board__lid-img--closed {
  opacity: 0;
  transform: rotate(-2deg) scale(1.01);
}
.vsv-root .vsv-board__lid[data-idle="true"]:hover .vsv-board__lid-img--ajar {
  opacity: 1;
  transform: scale(1.02) rotate(0deg);
}
.vsv-root .vsv-board__lid[data-on="false"] {
  transform: translate(-28%, -90%) rotate(18deg) scale(1.2);
  opacity: 0;
  pointer-events: none;
}

.vsv-root .vsv-pizza {
  width: 74%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  z-index: 3;
  filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.3));
}
.vsv-root .vsv-pizza > img,
.vsv-root .vsv-pizza__body,
.vsv-root .vsv-pizza__pieces,
.vsv-root .vsv-pizza__glow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.vsv-root .vsv-pizza__body {
  filter: brightness(1) saturate(1) contrast(1) sepia(0);
  transition: filter 3.6s ease-in-out;
}
.vsv-root .vsv-pizza__body img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
}
.vsv-root .vsv-pizza__dough {
  opacity: 0;
  transform: scale(0.86);
}
.vsv-root .vsv-pizza[data-open="true"] .vsv-pizza__dough {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.4s ease 0.4s, transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2) 0.4s;
}
.vsv-root .vsv-pizza__sauce {
  clip-path: circle(0% at 50% 50%);
  transform: rotate(-55deg) scale(0.92);
}
.vsv-root .vsv-pizza[data-open="true"] .vsv-pizza__sauce {
  clip-path: circle(78% at 50% 50%);
  transform: rotate(0) scale(1);
  transition: clip-path 1.1s cubic-bezier(0.3, 0.7, 0.2, 1) 0.85s, transform 1.2s cubic-bezier(0.3, 0.7, 0.2, 1) 0.85s;
}

.vsv-root .vsv-pizza__pieces {
  pointer-events: none;
}
.vsv-root .vsv-piece {
  position: absolute !important;
  height: auto !important;
  max-width: none !important;
  transform: translate(-50%, -50%) rotate(var(--rot)) scale(var(--s));
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35)) brightness(1) saturate(1) sepia(0);
  transition: filter 3.4s ease-in-out, opacity 0.28s, transform 0.28s;
  pointer-events: none;
}
.vsv-root .vsv-piece[data-leaving="true"] {
  opacity: 0 !important;
  transform: translate(-50%, -50%) rotate(var(--rot)) scale(0.45) !important;
}

.vsv-root .vsv-pizza[data-baked="true"] .vsv-pizza__body {
  filter: brightness(0.9) saturate(1.2) contrast(1.1) sepia(0.2);
}
.vsv-root .vsv-pizza[data-baked="true"] .vsv-piece {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35)) brightness(0.92) saturate(1.15) sepia(0.2);
}
.vsv-root .vsv-pizza[data-baked="true"] .vsv-piece[data-id="basil"] {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35)) brightness(0.55) saturate(0.85) sepia(0.15);
}
.vsv-root .vsv-pizza[data-baked="true"] .vsv-piece[data-id="mozzarella"] {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35)) brightness(0.97) saturate(1.35) sepia(0.45);
}
.vsv-root .vsv-pizza[data-baked="true"] .vsv-piece[data-id="olives"] {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35)) brightness(0.8) saturate(1) sepia(0);
}
.vsv-root .vsv-pizza[data-baked="true"] .vsv-piece[data-id="onion"] {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35)) brightness(0.88) saturate(0.95) sepia(0.35);
}

.vsv-root .vsv-pizza__crust {
  opacity: 0;
  pointer-events: none;
  max-width: none;
  transition: opacity 3s ease-in 0.5s;
}
.vsv-root .vsv-pizza[data-baked="true"] .vsv-pizza__crust {
  opacity: 1;
}

.vsv-root .vsv-pizza__glow {
  inset: -4%;
  width: 108%;
  height: 108%;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle, rgba(255, 140, 40, 0) 58%, rgba(255, 120, 30, 0.52) 80%, rgba(255, 90, 20, 0) 100%);
  transition: opacity 0.6s;
}
.vsv-root .vsv-pizza[data-heat="true"] .vsv-pizza__glow {
  opacity: 1;
  animation: vsv-heat 1.1s ease-in-out infinite alternate;
}
@keyframes vsv-heat {
  from { transform: scale(0.98); filter: blur(2px); }
  to { transform: scale(1.03); filter: blur(5px); }
}

.vsv-root .vsv-rail {
  position: relative;
}
.vsv-root .vsv-rail__intro {
  margin-bottom: 14px;
  transition: opacity 0.4s, transform 0.5s;
}
.vsv-root .vsv-rail__intro h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
  font-family: var(--vsv-font-display);
  color: var(--vsv-red);
  font-weight: 400;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}
.vsv-root .vsv-rail__intro p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #2a3140;
}

.vsv-root .vsv-trays {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.vsv-root .vsv-tray {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  padding: 0;
  border: 0;
  background: none;
  touch-action: none;
  opacity: 0;
  transform: translateX(-70px);
  transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.05);
  transition-delay: calc(var(--i) * 70ms + 300ms);
}
.vsv-root .vsv-rail[data-phase="build"] .vsv-tray {
  opacity: 1;
  transform: none;
}
.vsv-root .vsv-rail[data-phase="baking"] .vsv-tray,
.vsv-root .vsv-rail[data-phase="done"] .vsv-tray {
  opacity: 0;
  transform: translateX(-130%);
  pointer-events: none;
  transition-delay: calc(var(--i) * 40ms);
}
.vsv-root .vsv-rail[data-phase="intro"] .vsv-tray {
  transition-delay: 0s;
  pointer-events: none;
}
.vsv-root .vsv-rail:not([data-phase="build"]) .vsv-rail__intro {
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
}
.vsv-root .vsv-tray:focus-visible {
  outline: 2px solid var(--vsv-red);
  outline-offset: 4px;
  border-radius: 8px;
}
.vsv-root .vsv-tray__photo {
  position: relative;
  display: block;
}
.vsv-root .vsv-tray__photo img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s;
}
.vsv-root .vsv-tray:hover .vsv-tray__photo img {
  transform: translateY(-3px) rotate(-0.8deg);
}
.vsv-root .vsv-tray__badge {
  position: absolute;
  top: -7px;
  right: -7px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  background: #ffffff;
  color: var(--vsv-ink);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: background 0.2s, color 0.2s, transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
}
.vsv-root .vsv-tray[data-selected="true"] .vsv-tray__badge {
  background: var(--vsv-red);
  color: #ffffff;
  transform: scale(1.12);
}
.vsv-root .vsv-tray__label {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-size: 11.5px;
  padding: 0 2px;
  color: var(--vsv-ink);
}
.vsv-root .vsv-tray__label b {
  font-weight: 700;
}
.vsv-root .vsv-tray__label i {
  font-style: normal;
  color: #2d3544;
  font-family: var(--vsv-font-mono);
  font-size: 11px;
}

.vsv-root .vsv-timer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-60%) scale(0.7);
  transition: opacity 0.4s ease, transform 0.8s cubic-bezier(0.25, 1.5, 0.4, 1);
}
.vsv-root .vsv-timer[data-show="true"] {
  opacity: 1;
  transform: none;
  transition-delay: 0.45s;
}
.vsv-root .vsv-timer__dial {
  position: relative;
  width: min(100%, 170px);
  aspect-ratio: 1;
}
.vsv-root .vsv-timer__dial img {
  width: 100%;
  display: block;
  filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.35));
}
.vsv-root .vsv-timer__ring {
  position: absolute;
  inset: -6%;
  width: 112%;
  height: 112%;
  overflow: visible;
  transform: rotate(-90deg);
}
.vsv-root .vsv-timer__ring circle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.95);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 308;
  stroke-dashoffset: 308;
}
.vsv-root .vsv-timer[data-show="true"] .vsv-timer__ring circle {
  animation: vsv-dial var(--bake-ms, 4200ms) linear 0.45s forwards;
}
@keyframes vsv-dial {
  to { stroke-dashoffset: 0; }
}
.vsv-root .vsv-timer[data-ringing="true"] .vsv-timer__dial {
  animation: vsv-ring 0.12s linear infinite alternate;
}
@keyframes vsv-ring {
  from { transform: rotate(-5deg); }
  to { transform: rotate(5deg); }
}
.vsv-root .vsv-timer__label {
  font-family: var(--vsv-font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.vsv-root .vsv-card {
  position: relative;
  padding: 22px 22px 20px;
  background: var(--vsv-card);
  border-radius: 12px;
  box-shadow: 0 22px 44px rgba(20, 24, 32, 0.32), 0 1px 0 rgba(255, 255, 255, 0.7) inset;
  animation: vsv-card-in 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.08) both;
}
@keyframes vsv-card-in {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: none; }
}
.vsv-root .vsv-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 11.5px;
  color: var(--vsv-muted);
}
.vsv-root .vsv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3aa957;
  box-shadow: 0 0 0 3px rgba(58, 169, 87, 0.2);
}
.vsv-root .vsv-card h1,
.vsv-root .vsv-card h2 {
  margin: 0;
  font-size: clamp(28px, 2.6vw, 38px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: var(--vsv-ink);
}
.vsv-root .vsv-card h2 {
  font-size: clamp(24px, 2.2vw, 30px);
}
.vsv-root .vsv-card em {
  font-family: var(--vsv-font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--vsv-red);
  letter-spacing: 0;
}
.vsv-root .vsv-card--done em {
  color: var(--vsv-green);
}
.vsv-root .vsv-lead {
  margin: 12px 0 18px;
  font-size: 14px;
  line-height: 1.45;
  color: #475063;
}
.vsv-root .vsv-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 18px;
  border: 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--vsv-font-body);
  color: #ffffff;
  background: var(--vsv-red);
  box-shadow: 0 6px 14px rgba(196, 39, 28, 0.35), inset 0 -2px 0 rgba(0, 0, 0, 0.18);
  transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
}
.vsv-root .vsv-cta:enabled:hover {
  background: var(--vsv-red-dark);
  transform: translateY(-1px);
}
.vsv-root .vsv-cta:enabled:active {
  transform: translateY(1px);
}
.vsv-root .vsv-cta:disabled {
  opacity: 0.55;
}
.vsv-root .vsv-meta {
  display: grid;
  gap: 8px;
  margin: 16px 0 0;
  padding-top: 14px;
  border-top: 1px dashed #d8d4c9;
}
.vsv-root .vsv-meta div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
}
.vsv-root .vsv-meta dt {
  font-weight: 700;
}
.vsv-root .vsv-meta dd {
  margin: 0;
  color: var(--vsv-muted);
}
.vsv-root .vsv-check {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 14px;
  font-size: 18px;
  color: #ffffff;
  background: var(--vsv-green);
  border-radius: 50%;
}
.vsv-root .vsv-eta {
  margin: 0 0 18px;
  padding: 10px 12px;
  font-family: var(--vsv-font-mono);
  font-size: 12.5px;
  background: #eef4ee;
  border-radius: 6px;
  color: var(--vsv-green);
}

.vsv-root .vsv-receipt {
  font-family: var(--vsv-font-mono);
  padding-bottom: 24px;
  border-radius: 12px 12px 0 0;
}
.vsv-root .vsv-receipt::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 10px;
  background: radial-gradient(circle at 7px 10px, transparent 6px, var(--vsv-card) 6.5px) 0 0 / 14px 10px repeat-x;
}
.vsv-root .vsv-receipt__brand {
  margin: 0;
  text-align: center;
  font-family: var(--vsv-font-display);
  font-size: 22px;
  letter-spacing: 0.04em;
  color: var(--vsv-red);
}
.vsv-root .vsv-receipt__sub {
  margin: 2px 0 12px;
  text-align: center;
  font-size: 11px;
  color: var(--vsv-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.vsv-root .vsv-receipt__lines {
  list-style: none;
  margin: 0 0 12px;
  padding: 10px 0;
  border-block: 1px dashed #cfcabd;
  font-size: 12px;
}
.vsv-root .vsv-receipt__lines li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}
.vsv-root .vsv-receipt__new {
  animation: vsv-line-in 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.1) both;
}
@keyframes vsv-line-in {
  from { opacity: 0; transform: translateX(-14px); }
  to { opacity: 1; transform: none; }
}
.vsv-root .vsv-receipt__how {
  margin: 0 0 8px;
  padding: 0;
  border: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
}
.vsv-root .vsv-receipt__how legend {
  width: 100%;
  padding: 0;
  margin-bottom: 6px;
  font-family: var(--vsv-font-body);
  font-size: 12px;
  font-weight: 700;
}
.vsv-root .vsv-receipt__how label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border: 1px solid #d8d4c9;
  border-radius: 6px;
  transition: border-color 0.2s, background 0.2s;
}
.vsv-root .vsv-receipt__how label[data-on="true"] {
  border-color: var(--vsv-red);
  background: #fdf1ef;
}
.vsv-root .vsv-receipt__how input {
  accent-color: var(--vsv-red);
  margin: 0;
}
.vsv-root .vsv-receipt__fee,
.vsv-root .vsv-receipt__total {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 12px;
  padding: 3px 0;
}
.vsv-root .vsv-receipt__total {
  margin: 6px 0 14px;
  padding-top: 8px;
  border-top: 1px dashed #cfcabd;
  font-size: 16px;
  font-weight: 500;
}
.vsv-root .vsv-money {
  font-variant-numeric: tabular-nums;
}
.vsv-root .vsv-barcode {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 2px;
  height: 30px;
  margin-top: 16px;
  opacity: 0.85;
}
.vsv-root .vsv-barcode span {
  background: #20242c;
}

.vsv-root .vsv-hand {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s;
  will-change: transform;
  --hand-w: clamp(115px, 14vmin, 155px);
}
.vsv-root .vsv-hand[data-visible="true"] {
  opacity: 1;
}
.vsv-root .vsv-hand__img {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--hand-w);
  height: auto;
  max-width: none !important;
  opacity: 0;
  transition: opacity 0.06s;
  filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.36));
}
.vsv-root .vsv-hand__img[data-active="true"] {
  opacity: 1;
}
.vsv-root .vsv-hand__held {
  position: absolute;
  left: 0;
  top: 0;
  height: auto;
  max-width: none !important;
  transform: translate(-50%, -50%) rotate(-22deg);
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.4));
}

.vsv-root[data-device="tablet"] .vsv-stage {
  grid-template-columns: minmax(200px, 250px) minmax(0, 1fr) minmax(230px, 280px);
  gap: 14px;
  padding: 0 16px 20px;
}

.vsv-root[data-device="mobile"] .vsv-header__tag {
  display: none;
}
.vsv-root[data-device="mobile"] .vsv-stage {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto auto;
  gap: 8px;
  padding: 0 12px 14px;
}
.vsv-root[data-device="mobile"] .vsv-stage__center {
  order: 1;
}
.vsv-root[data-device="mobile"] .vsv-stage__left {
  order: 2;
  align-self: end;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.8s cubic-bezier(0.3, 0.7, 0.2, 1);
}
.vsv-root[data-device="mobile"][data-phase="build"] .vsv-stage__left,
.vsv-root[data-device="mobile"][data-phase="baking"] .vsv-stage__left {
  max-height: 230px;
}
.vsv-root[data-device="mobile"] .vsv-stage__right {
  order: 3;
}
.vsv-root[data-device="mobile"] .vsv-rail__intro {
  display: none;
}
.vsv-root[data-device="mobile"] .vsv-trays {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 12px;
  padding: 10px 12px 0 4px;
}
.vsv-root[data-device="mobile"] .vsv-tray__photo img {
  max-height: 54px;
  width: auto;
  max-width: 100%;
  margin: 0 auto;
}
.vsv-root[data-device="mobile"] .vsv-tray__label {
  font-size: 10.5px;
  flex-direction: column;
  gap: 0;
  align-items: center;
}
.vsv-root[data-device="mobile"] .vsv-tray__label i {
  font-size: 10px;
}
.vsv-root[data-device="mobile"] .vsv-timer {
  flex-direction: row;
  gap: 14px;
}
.vsv-root[data-device="mobile"] .vsv-timer__dial {
  width: 96px;
}
.vsv-root[data-device="mobile"] .vsv-card {
  padding: 14px 16px;
}
.vsv-root[data-device="mobile"] .vsv-card h1 {
  font-size: 26px;
}
.vsv-root[data-device="mobile"] .vsv-lead {
  margin: 8px 0 12px;
  font-size: 13px;
}
.vsv-root[data-device="mobile"] .vsv-meta {
  display: none;
}
.vsv-root[data-device="mobile"] .vsv-eyebrow {
  margin-bottom: 8px;
}
.vsv-root[data-device="mobile"] .vsv-receipt {
  padding: 12px 14px 16px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 12px;
  align-items: center;
}
.vsv-root[data-device="mobile"] .vsv-receipt__brand,
.vsv-root[data-device="mobile"] .vsv-receipt__sub,
.vsv-root[data-device="mobile"] .vsv-barcode,
.vsv-root[data-device="mobile"] .vsv-receipt::after,
.vsv-root[data-device="mobile"] .vsv-receipt__fee {
  display: none;
}
.vsv-root[data-device="mobile"] .vsv-receipt__lines {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
  margin: 0 0 8px;
  padding: 0 0 8px;
  border-top: 0;
}
.vsv-root[data-device="mobile"] .vsv-receipt__lines li {
  padding: 2px 8px;
  font-size: 11px;
  background: #efece3;
  border-radius: 99px;
  gap: 6px;
}
.vsv-root[data-device="mobile"] .vsv-receipt__lines li:first-child {
  display: none;
}
.vsv-root[data-device="mobile"] .vsv-receipt__how {
  margin: 0;
  flex-wrap: nowrap;
}
.vsv-root[data-device="mobile"] .vsv-receipt__how legend {
  display: none;
}
.vsv-root[data-device="mobile"] .vsv-receipt__how label {
  padding: 6px 8px;
  font-size: 11.5px;
}
.vsv-root[data-device="mobile"] .vsv-receipt__total {
  grid-column: 2;
  grid-row: 2;
  margin: 0;
  padding: 0;
  border: 0;
  gap: 8px;
  font-size: 15px;
}
.vsv-root[data-device="mobile"] .vsv-receipt .vsv-cta {
  grid-column: 1 / -1;
  margin-top: 10px;
  padding: 11px;
}
.vsv-root[data-device="mobile"] .vsv-card--done .vsv-check {
  margin-bottom: 8px;
}
.vsv-root[data-device="mobile"] .vsv-hand {
  --hand-w: 110px;
}

@media (prefers-reduced-motion: reduce) {
  .vsv-root .vsv-board__lid[data-idle="true"] .vsv-board__lid-wrap,
  .vsv-root .vsv-pizza[data-heat="true"] .vsv-pizza__glow {
    animation: none;
  }
}
`;

export function VesuvioPizzaPreview() {
  const { deviceMode } = useTemplateCustomizer();
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [cursorHandActive, setCursorHandActive] = useState(false);

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

  useEffect(() => {
    const urls = [
      ASSETS.boxBase,
      ASSETS.boxAjar,
      ASSETS.dough,
      ASSETS.sauce,
      ASSETS.crustBaked,
      ...Object.values(ASSETS.pieces).flat(),
    ];
    for (const url of urls) {
      const img = new Image();
      img.src = url;
    }
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 860;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1080);

  const [phase, setPhase] = useState<Phase>("intro");
  const [pieces, setPieces] = useState<PlacedPiece[]>([]);
  const [order, setOrder] = useState<ToppingId[]>([]);
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [ringing, setRinging] = useState(false);

  const pizzaRef = useRef<HTMLDivElement>(null);
  const trayRefs = useRef(new Map<ToppingId, HTMLElement>());
  const hand = useHand();
  const handRef = useRef(hand);
  const live = useRef({ phase, order, pieces });
  const flow = useRef(0);
  const seeds = useRef(0);

  const draggingRef = useRef(false);

  useEffect(() => {
    handRef.current = hand;
    live.current = { phase, order, pieces };
  });

  const toLocal = useCallback((clientX: number, clientY: number): Point => {
    const root = rootRef.current;
    if (!root) return { x: clientX, y: clientY };
    const r = root.getBoundingClientRect();
    const scaleX = root.offsetWidth > 0 ? r.width / root.offsetWidth : 1;
    const scaleY = root.offsetHeight > 0 ? r.height / root.offsetHeight : 1;
    return {
      x: (clientX - r.left) / scaleX,
      y: (clientY - r.top) / scaleY,
    };
  }, []);

  const takeTicket = () => {
    flow.current += 1;
    return flow.current;
  };
  const isStale = (ticket: number) => ticket !== flow.current;

  const registerTray = useCallback((id: ToppingId, el: HTMLElement | null) => {
    if (el) trayRefs.current.set(id, el);
    else trayRefs.current.delete(id);
  }, []);

  const trayCenter = useCallback(
    (id: ToppingId): Point => {
      const el = trayRefs.current.get(id);
      if (!el) return { x: 140, y: 260 };
      const r = el.getBoundingClientRect();
      return toLocal(r.left + r.width / 2, r.top + r.height / 2);
    },
    [toLocal]
  );

  const geometry = useCallback((): PizzaGeometry | null => {
    const el = pizzaRef.current;
    const root = rootRef.current;
    if (!el || !root) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return null;
    const rootRect = root.getBoundingClientRect();
    const scaleX = root.offsetWidth > 0 ? rootRect.width / root.offsetWidth : 1;
    const center = toLocal(r.left + r.width / 2, r.top + r.height / 2);
    return { cx: center.x, cy: center.y, d: r.width / scaleX };
  }, [toLocal]);

  const placeTopping = (id: ToppingId, at: Point) => {
    const geo = geometry();
    const def = TOPPING_BY_ID[id];
    if (!geo) return;
    seeds.current += 1;
    const origin: Point = {
      x: clamp((at.x - geo.cx) / geo.d, -0.5, 0.5),
      y: clamp((at.y - geo.cy) / geo.d, -0.5, 0.5),
    };
    const fresh = layoutPieces(def, seeds.current, origin);
    setPieces((prev) => [...prev.filter((p) => p.toppingId !== id), ...fresh]);
    setOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeTopping = (id: ToppingId) => {
    setPieces((prev) => prev.map((p) => (p.toppingId === id ? { ...p, leaving: true } : p)));
    setOrder((prev) => prev.filter((t) => t !== id));
    window.setTimeout(() => setPieces((prev) => prev.filter((p) => !(p.toppingId === id && p.leaving))), 320);
  };

  const heldFor = (id: ToppingId): HeldPiece => {
    const geo = geometry();
    const def = TOPPING_BY_ID[id];
    return { src: def.pieces[0] as string, px: Math.max(38, (geo?.d ?? 320) * def.size * 0.8) };
  };

  const onRootPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const pt = toLocal(e.clientX, e.clientY);
    if (!cursorHandActive) setCursorHandActive(true);

    if (draggingRef.current) return;

    const h = handRef.current;
    const targetEl = e.target as HTMLElement | null;
    const onInteractive = targetEl?.closest("button, label, input");

    if (live.current.phase === "baking") {
      h.setPose("ok");
    } else if (onInteractive) {
      h.setPose("point");
    } else {
      h.setPose("open");
    }

    h.place(pt, HAND_BASE_ANGLE);
    h.show();
  };

  const onRootPointerLeave = () => {
    setCursorHandActive(false);
    if (!draggingRef.current) {
      handRef.current.hide();
    }
  };

  const onTrayPointerDown = (id: ToppingId, e: ReactPointerEvent<HTMLElement>) => {
    if (live.current.phase !== "build") return;
    e.preventDefault();
    const h = handRef.current;
    const startPt = toLocal(e.clientX, e.clientY);
    const wasSelected = live.current.order.includes(id);
    let dragging = false;
    let sway = 0;
    let lastX = startPt.x;

    draggingRef.current = true;
    h.setHeld(heldFor(id));
    h.setPose("pinch");
    h.place(startPt, HAND_BASE_ANGLE);
    h.show();

    const onMove = (ev: PointerEvent) => {
      const p = toLocal(ev.clientX, ev.clientY);
      if (!dragging && Math.hypot(p.x - startPt.x, p.y - startPt.y) > 18) {
        dragging = true;
      }
      sway += (clamp((p.x - lastX) * 0.55, -12, 12) - sway) * 0.3;
      lastX = p.x;
      h.place(p, HAND_BASE_ANGLE + sway);
    };

    const finish = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      draggingRef.current = false;
      const p = toLocal(ev.clientX, ev.clientY);

      h.setHeld(null);
      h.setPose("open");
      h.place(p, HAND_BASE_ANGLE);

      const distFromStart = Math.hypot(p.x - startPt.x, p.y - startPt.y);
      if (!dragging || distFromStart < 36) {
        if (wasSelected) {
          removeTopping(id);
        } else {
          const from = trayCenter(id);
          placeTopping(id, from);
        }
        return;
      }

      const geo = geometry();
      const over = geo !== null && Math.hypot(p.x - geo.cx, p.y - geo.cy) < geo.d * 0.85;
      if (over) {
        placeTopping(id, p);
      } else if (!wasSelected && geo !== null && (p.x > startPt.x + 40 || p.y < startPt.y - 40)) {
        placeTopping(id, { x: geo.cx, y: geo.cy });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  const toggleTopping = (id: ToppingId) => {
    if (live.current.phase !== "build") return;
    if (live.current.order.includes(id)) {
      removeTopping(id);
      return;
    }
    const from = trayCenter(id);
    placeTopping(id, from);
  };

  const start = () => {
    if (live.current.phase !== "intro") return;
    takeTicket();
    setPhase("build");
  };

  const bake = async () => {
    if (live.current.phase !== "build") return;
    const ticket = takeTicket();
    const h = handRef.current;
    h.setHeld(null);
    h.setPose("ok");
    setPhase("baking");

    await sleep(BAKE_MS);
    if (isStale(ticket)) return;
    setRinging(true);
    await sleep(1000);
    if (isStale(ticket)) return;
    setRinging(false);
    await sleep(250);
    if (isStale(ticket)) return;
    h.setPose("open");
    setPhase("done");
  };

  const reset = () => {
    takeTicket();
    draggingRef.current = false;
    handRef.current.setHeld(null);
    handRef.current.setPose("open");
    setPieces([]);
    setOrder([]);
    setRinging(false);
    setPhase("intro");
  };

  const total = useMemo(() => {
    const toppings = order.reduce((sum, id) => sum + TOPPING_BY_ID[id].price, 0);
    return BASE_PRICE + toppings + (fulfilment === "delivery" ? DELIVERY_FEE : 0);
  }, [order, fulfilment]);

  const eta = useMemo(() => etaWindow(25, 35), []);
  const open = phase !== "intro";
  const baked = phase === "baking" || phase === "done";
  const lidOn = phase === "intro" || phase === "done";
  const headerAction = phase === "intro" ? start : phase === "done" ? reset : undefined;

  const headerLabels: Record<Phase, string> = {
    intro: "Craft Your Pizza",
    build: "Live Hearth Board",
    baking: "Firing at 850°",
    done: "Bake Another",
  };

  const barcodeBars = useMemo(() => Array.from({ length: 44 }, (_, i) => 1 + ((i * 7 + 3) % 5)), []);

  return (
    <div
      ref={rootRef}
      className="vsv-root"
      data-phase={phase}
      data-cursor={cursorHandActive && !isMobile ? "hand" : "default"}
      data-device={isMobile ? "mobile" : isTablet ? "tablet" : "desktop"}
      onPointerMove={onRootPointerMove}
      onPointerLeave={onRootPointerLeave}
      style={
        {
          backgroundImage: `url(${ASSETS.counter})`,
          "--bake-ms": `${BAKE_MS}ms`,
        } as CSSProperties
      }
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Instrument+Serif:ital@1&family=Lilita+One&display=swap"
      />
      <style>{SCOPED_CSS}</style>

      <header className="vsv-header">
        <div className="vsv-header__brand">
          <div className="vsv-header__top">
            <span className="vsv-logo" aria-label={`${BRAND.name} ${BRAND.suffix}`}>
              <span className="vsv-logo__name">{BRAND.name}</span>
              <span className="vsv-logo__suffix">{BRAND.suffix}</span>
            </span>
            <button type="button" className="vsv-pill" onClick={headerAction} disabled={!headerAction}>
              {headerLabels[phase]}
            </button>
          </div>
          <p className="vsv-header__tag">{BRAND.tagline}</p>
        </div>
      </header>

      <main className="vsv-stage">
        <section className="vsv-stage__left">
          <div className="vsv-rail" data-phase={phase}>
            <div className="vsv-rail__intro">
              <h2>Select artisanal toppings.</h2>
              <p>Drag onto the pizza, or tap to drop.</p>
            </div>

            <div className="vsv-trays">
              {TOPPINGS.map((t, i) => {
                const on = order.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className="vsv-tray"
                    data-selected={on}
                    style={{ "--i": i } as CSSProperties}
                    ref={(el) => registerTray(t.id, el)}
                    onPointerDown={(e) => onTrayPointerDown(t.id, e)}
                    onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleTopping(t.id);
                      }
                    }}
                    aria-pressed={on}
                    aria-label={`${t.label}, ${money(t.price)}`}
                    tabIndex={phase === "build" ? 0 : -1}
                  >
                    <span className="vsv-tray__photo">
                      <img src={t.tray} alt="" draggable={false} />
                      <span className="vsv-tray__badge" aria-hidden="true">
                        {on ? "✓" : "+"}
                      </span>
                    </span>
                    <span className="vsv-tray__label">
                      <b>{t.label}</b>
                      <i>{money(t.price)}</i>
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="vsv-timer"
              data-show={phase === "baking"}
              data-ringing={ringing}
              aria-hidden={phase !== "baking"}
            >
              <div className="vsv-timer__dial">
                <img src={ASSETS.timer} alt="" draggable={false} />
                <svg viewBox="0 0 100 100" className="vsv-timer__ring">
                  <circle cx="50" cy="50" r="49" />
                </svg>
              </div>
              <span className="vsv-timer__label">Firing 850°…</span>
            </div>
          </div>
        </section>

        <section className="vsv-stage__center">
          <div className="vsv-board" data-phase={phase}>
            <img className="vsv-board__base" data-open={open} src={ASSETS.boxBase} alt="" draggable={false} />

            <div
              className="vsv-pizza"
              ref={pizzaRef}
              data-open={open}
              data-baked={baked}
              data-heat={phase === "baking"}
            >
              <div className="vsv-pizza__body">
                <img className="vsv-pizza__dough" src={ASSETS.dough} alt="" draggable={false} />
                <img className="vsv-pizza__sauce" src={ASSETS.sauce} alt="" draggable={false} />
              </div>
              <div className="vsv-pizza__pieces">
                {pieces.map((p) => (
                  <PieceItem key={p.key} piece={p} />
                ))}
              </div>
              <img className="vsv-pizza__crust" src={ASSETS.crustBaked} alt="" draggable={false} />
              <div className="vsv-pizza__glow" />
            </div>

            <button
              type="button"
              className="vsv-board__lid"
              data-on={lidOn}
              data-idle={phase === "intro"}
              onClick={start}
              disabled={phase !== "intro"}
              aria-label="Open the pizza box and craft your pie"
            >
              <span className="vsv-board__lid-wrap">
                <img
                  className="vsv-board__lid-img vsv-board__lid-img--closed"
                  src={ASSETS.boxClosed}
                  alt="Pizza box"
                  draggable={false}
                />
                <img
                  className="vsv-board__lid-img vsv-board__lid-img--ajar"
                  src={ASSETS.boxAjar}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
              </span>
            </button>
          </div>
        </section>

        <aside className="vsv-stage__right">
          {phase === "intro" && (
            <div className="vsv-card vsv-card--intro">
              <p className="vsv-eyebrow">
                <span className="vsv-dot" /> Volcanic Hearth Active · 850° Stone
              </p>
              <h1>
                Artisan pizza, crafted by <em>your hands.</em>
              </h1>
              <p className="vsv-lead">
                Drag authentic Italian DOP toppings onto slow-ferment dough, blister in our wood hearth, and boxed
                steaming hot.
              </p>
              <button type="button" className="vsv-cta" onClick={start}>
                Open Box &amp; Craft
              </button>
              <dl className="vsv-meta">
                <div>
                  <dt>Hearth bake</dt>
                  <dd>90s at 850°F volcanic stone</dd>
                </div>
                <div>
                  <dt>Delivery window</dt>
                  <dd>Arrives hot in 25–35 min</dd>
                </div>
              </dl>
            </div>
          )}

          {phase === "done" && (
            <div className="vsv-card vsv-card--done">
              <span className="vsv-check" aria-hidden="true">
                ✓
              </span>
              <h2>
                Fired &amp; boxed. <em>Perfetto.</em>
              </h2>
              <p className="vsv-lead">
                Your pie is blistered to charred perfection, sliced into 6, and sealed in our insulated thermal box.
              </p>
              <p className="vsv-eta">Estimated arrival: {eta}</p>
              <button type="button" className="vsv-cta" onClick={reset}>
                Craft Another Pie
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}

          {(phase === "build" || phase === "baking") && (
            <div className="vsv-card vsv-receipt">
              <p className="vsv-receipt__brand">VESUVIO ATELIER</p>
              <p className="vsv-receipt__sub">Custom Hearth Ticket</p>

              <ul className="vsv-receipt__lines">
                <li>
                  <span>12″ Sourdough + San Marzano DOP</span>
                  <span>{money(BASE_PRICE)}</span>
                </li>
                {order.map((id) => (
                  <li key={id} className="vsv-receipt__new">
                    <span>{TOPPING_BY_ID[id].label}</span>
                    <span>{money(TOPPING_BY_ID[id].price)}</span>
                  </li>
                ))}
              </ul>

              <fieldset className="vsv-receipt__how">
                <legend>Order Type</legend>
                <label data-on={fulfilment === "delivery"}>
                  <input
                    type="radio"
                    name="how"
                    checked={fulfilment === "delivery"}
                    onChange={() => setFulfilment("delivery")}
                  />
                  Delivery
                </label>
                <label data-on={fulfilment === "pickup"}>
                  <input
                    type="radio"
                    name="how"
                    checked={fulfilment === "pickup"}
                    onChange={() => setFulfilment("pickup")}
                  />
                  Pickup
                </label>
              </fieldset>

              <p className="vsv-receipt__fee">
                <span>{fulfilment === "delivery" ? "Courier Fee" : "Hearth Pickup"}</span>
                <span>{fulfilment === "delivery" ? money(DELIVERY_FEE) : "Free"}</span>
              </p>
              <p className="vsv-receipt__total">
                <span>Total Due</span>
                <MoneyCounter value={total} />
              </p>

              <button type="button" className="vsv-cta" onClick={bake} disabled={phase !== "build"}>
                Fire in Hearth
                <span aria-hidden="true">↗</span>
              </button>

              <div className="vsv-barcode" aria-hidden="true">
                {barcodeBars.map((w, i) => (
                  <span key={i} style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      <div className="vsv-hand" ref={hand.rootRef} data-visible={hand.visible} aria-hidden="true">
        {hand.held && (
          <img
            className="vsv-hand__held"
            src={hand.held.src}
            style={{ width: hand.held.px }}
            alt=""
            draggable={false}
          />
        )}
        {(["open", "pinch", "ok", "point"] as const).map((pose) => (
          <img
            key={pose}
            className="vsv-hand__img"
            data-active={hand.pose === pose}
            src={ASSETS.hands[pose]}
            style={{
              transform: `translate(${-HAND_HOTSPOT[pose].x * 100}%, ${-HAND_HOTSPOT[pose].y * 100}%)`,
            }}
            alt=""
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
