"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type CSSProperties,
  Fragment,
} from "react";
import { useReducedMotion } from "framer-motion";

export interface Beat {
  from: number;
  to: number;
  align: "left" | "right" | "center" | "giant" | "top" | "topright";
  kicker?: string;
  lines: string[];
  body?: string;
  outline?: boolean;
}

export interface PlateItem {
  n: string;
  title: string;
  still: "halo" | "panther" | "tiger";
  x: number;
  y: number;
  zoom: number;
  hex: string;
  pigment: string;
}

const BRAND = "Karmin";
const TAGLINE = "Pigment Study 01";

const CHAPTERS = [
  { id: "overture", label: "Overture" },
  { id: "iris", label: "I / Iris" },
  { id: "smoke", label: "II / Smoke" },
  { id: "black", label: "III / Black" },
  { id: "pigment", label: "IV / Pigment" },
  { id: "stripes", label: "V / Stripes" },
  { id: "plates", label: "VI / Plates" },
  { id: "index", label: "VII / Index" },
] as const;

const HERO_DATA = {
  eyebrow: `${BRAND} / ${TAGLINE}`,
  lines: ["Nothing quiet", "was ever", "this *red.*"],
  sub: "Three films, three stills and one animal changing its mind.",
  cue: "Scroll",
};

const IRIS_BEATS: Beat[] = [
  { from: 0.04, to: 0.4, align: "left", kicker: "I / Iris", lines: ["It sees you", "*first.*"] },
  {
    from: 0.55,
    to: 1.08,
    align: "right",
    kicker: "Fact",
    lines: ["The red is", "an *insect.*"],
    body: "Carmine is ground from dried cochineal insects. It has dyed cloth, robes and lipstick for five hundred years.",
  },
];

const SMOKE_BEATS: Beat[] = [
  {
    from: 0.03,
    to: 0.3,
    align: "left",
    kicker: "II / Smoke",
    lines: ["The room fills", "before the", "animal *does.*"],
  },
  {
    from: 0.4,
    to: 0.7,
    align: "right",
    lines: ["Stay *still.*"],
    body: "Rose smoke, red rim light. It keeps its distance, then closes it.",
  },
  { from: 0.8, to: 1.08, align: "center", lines: ["Eye *contact.*"] },
];

const BLACK_INTERLUDE = {
  kicker: "III / Black",
  lines: ["Black makes", "red *louder.*"],
  marquee: ["Carmine", "Rose Madder", "Magenta", "Cochineal", "Alizarin"],
};

const MORPH_BEATS: Beat[] = [
  { from: 0.02, to: 0.24, align: "top", kicker: "IV / Pigment", lines: ["Add *paint.*"] },
  { from: 0.04, to: 0.5, align: "giant", outline: true, lines: ["Panther"] },
  { from: 0.52, to: 1.08, align: "giant", outline: true, lines: ["Tiger"] },
  {
    from: 0.66,
    to: 1.08,
    align: "topright",
    body: "Same weight, same stare. Only the alarm changed.",
    lines: [],
  },
];

const STRIPES_DATA = {
  kicker: "V / Stripes",
  lines: ["No two", "*alike.*"],
  body: "A tiger’s stripes run through the skin as well as the fur. Every animal carries its own pattern for life.",
};

const PLATES_DATA: { kicker: string; lines: string[]; body: string; items: PlateItem[] } = {
  kicker: "VI / Plates",
  lines: ["Five crops,", "five *reds.*"],
  body: "Every hex below was sampled from the film frames above, not picked from a chart.",
  items: [
    { n: "01", title: "Iris", still: "halo", x: 0.7, y: 0.44, zoom: 2.6, hex: "#D5637E", pigment: "Cochineal" },
    { n: "02", title: "Muzzle", still: "panther", x: 0.51, y: 0.7, zoom: 2.0, hex: "#732B3D", pigment: "Oxblood" },
    { n: "03", title: "Rim light", still: "panther", x: 0.3, y: 0.58, zoom: 2.2, hex: "#C51B3A", pigment: "Carmine" },
    { n: "04", title: "Stare", still: "tiger", x: 0.61, y: 0.44, zoom: 2.0, hex: "#A0103A", pigment: "Crimson Lake" },
    { n: "05", title: "Brow", still: "tiger", x: 0.5, y: 0.3, zoom: 1.8, hex: "#E43479", pigment: "Rose Madder" },
  ],
};

const SWATCHES = [
  { name: "Magenta", hex: "#FC318D" },
  { name: "Rose Madder", hex: "#E43479" },
  { name: "Alizarin", hex: "#C90C4E" },
  { name: "Carmine", hex: "#C51B3A" },
  { name: "Cochineal", hex: "#D5637E" },
];

const FINALE_DATA = {
  kicker: "VII / Index",
  lines: ["Pick a *red.*"],
  body: "Five reds sampled from these films. Tap one.",
  cta: "Get the swatch book",
  footnote: `${BRAND} is a concept page. Media generated with AI.`,
};

function clamp(v: number, a = 0, b = 1): number {
  return Math.min(b, Math.max(a, v));
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function range(v: number, a: number, b: number): number {
  return clamp((v - a) / (b - a));
}
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function findNearestScroller(el: HTMLElement | null): HTMLElement | Window {
  let curr = el?.parentElement ?? null;
  while (curr) {
    const style = window.getComputedStyle(curr);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      if (curr.scrollHeight > curr.clientHeight) return curr;
    }
    curr = curr.parentElement;
  }
  return window;
}

function getScrollY(scroller: HTMLElement | Window): number {
  if (scroller === window) return window.scrollY;
  return (scroller as HTMLElement).scrollTop;
}

function getViewportHeight(scroller: HTMLElement | Window): number {
  if (scroller === window) return window.innerHeight;
  return (scroller as HTMLElement).clientHeight;
}

function getMaxScroll(scroller: HTMLElement | Window): number {
  if (scroller === window) {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  const el = scroller as HTMLElement;
  return Math.max(1, el.scrollHeight - el.clientHeight);
}

function getElementTop(el: HTMLElement, scroller: HTMLElement | Window): number {
  const r = el.getBoundingClientRect();
  if (scroller === window) {
    return r.top + window.scrollY;
  }
  const sRect = (scroller as HTMLElement).getBoundingClientRect();
  return r.top - sRect.top + (scroller as HTMLElement).scrollTop;
}

class SlidingFrameSet {
  readonly count: number;
  loaded = 0;
  ready = false;
  private blobs: (Blob | null)[];
  private bitmaps = new Map<number, ImageBitmap>();
  private pending = new Set<number>();
  private lo = 0;
  private hi = -1;
  private loading: Promise<void> | null = null;

  constructor(readonly urls: string[]) {
    this.count = urls.length;
    this.blobs = new Array(this.count).fill(null);
  }

  load(onProgress?: (fraction: number) => void, concurrency = 4): Promise<void> {
    if (this.loading) return this.loading;
    let next = 0;
    const worker = async () => {
      while (next < this.count) {
        const i = next++;
        try {
          const res = await fetch(this.urls[i]);
          if (res.ok) {
            this.blobs[i] = await res.blob();
          }
        } catch {
          this.blobs[i] = null;
        }
        this.loaded++;
        onProgress?.(this.loaded / this.count);
      }
    };
    this.loading = Promise.all(Array.from({ length: concurrency }, worker)).then(() => {
      this.ready = true;
    });
    return this.loading;
  }

  window(center: number, radius = 12) {
    const lo = Math.max(0, Math.floor(center - radius));
    const hi = Math.min(this.count - 1, Math.ceil(center + radius));
    this.lo = lo;
    this.hi = hi;
    for (let i = lo; i <= hi; i++) {
      const blob = this.blobs[i];
      if (!blob || this.bitmaps.has(i) || this.pending.has(i)) continue;
      this.pending.add(i);
      createImageBitmap(blob)
        .then((bm) => {
          this.pending.delete(i);
          if (i < this.lo - radius || i > this.hi + radius) bm.close();
          else this.bitmaps.set(i, bm);
        })
        .catch(() => this.pending.delete(i));
    }
    for (const [k, bm] of this.bitmaps) {
      if (k < lo - radius || k > hi + radius) {
        bm.close();
        this.bitmaps.delete(k);
      }
    }
  }

  release() {
    if (!this.bitmaps.size) return;
    this.bitmaps.forEach((bm) => bm.close());
    this.bitmaps.clear();
  }

  get(i: number): ImageBitmap | undefined {
    return this.bitmaps.get(i);
  }

  nearest(i: number): ImageBitmap | null {
    const base = Math.round(i);
    for (let d = 0; d < this.count; d++) {
      const a = this.bitmaps.get(base - d);
      if (a) return a;
      const b = this.bitmaps.get(base + d);
      if (b) return b;
    }
    return null;
  }
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\*[^*]+\*)/g)
        .filter(Boolean)
        .map((part, i) =>
          part.startsWith("*") ? (
            <i key={i} className="font-serif italic text-[var(--k-accent)]">
              {part.slice(1, -1)}
            </i>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          )
        )}
    </>
  );
}

function LinesView({ lines, mode = "line" }: { lines: string[]; mode?: "line" | "rise" }) {
  return (
    <>
      {lines.map((text, i) => (
        <span
          key={i}
          className={mode === "rise" ? "k-rise" : "k-line"}
          style={{ "--i": i } as CSSProperties}
        >
          <span className={mode === "rise" ? "k-rise-in" : "k-line-in"}>
            <RichText text={text} />
          </span>
        </span>
      ))}
    </>
  );
}

const padNum = (n: number) => String(n).padStart(4, "0");
const makeSeq = (scene: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/templates/karmin/frames/${scene}/${padNum(i + 1)}.webp`);

const ASSETS = {
  eye: makeSeq("eye", 120),
  smoke: makeSeq("smoke", 120),
  morph: makeSeq("morph", 120),
  halo: "/templates/karmin/stills/halo.webp",
  panther: "/templates/karmin/stills/panther.webp",
  tiger: "/templates/karmin/stills/tiger.webp",
};

export function KarminFilmPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedAccentIndex, setSelectedAccentIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const frameSets = useMemo(
    () => ({
      eye: new SlidingFrameSet(ASSETS.eye),
      smoke: new SlidingFrameSet(ASSETS.smoke),
      morph: new SlidingFrameSet(ASSETS.morph),
    }),
    []
  );

  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);

  const irisSecRef = useRef<HTMLElement>(null);
  const irisCanvasRef = useRef<HTMLCanvasElement>(null);
  const irisClockRef = useRef<HTMLSpanElement>(null);
  const irisBeatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const smokeSecRef = useRef<HTMLElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const smokeClockRef = useRef<HTMLSpanElement>(null);
  const smokeBeatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const interludeSecRef = useRef<HTMLElement>(null);
  const interludeClipRef = useRef<HTMLDivElement>(null);
  const interludeImgRef = useRef<HTMLImageElement>(null);
  const interludeRowARef = useRef<HTMLDivElement>(null);
  const interludeRowBRef = useRef<HTMLDivElement>(null);
  const interludeBeatRef = useRef<HTMLDivElement>(null);

  const morphSecRef = useRef<HTMLElement>(null);
  const morphCanvasRef = useRef<HTMLCanvasElement>(null);
  const morphClockRef = useRef<HTMLSpanElement>(null);
  const morphBeatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const stripesSecRef = useRef<HTMLElement>(null);
  const stripesStageRef = useRef<HTMLDivElement>(null);
  const stripesImgRef = useRef<HTMLImageElement>(null);
  const stripesBeatRef = useRef<HTMLDivElement>(null);

  const platesSecRef = useRef<HTMLElement>(null);
  const platesTrackRef = useRef<HTMLDivElement>(null);
  const plateImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const plateCardRefs = useRef<(HTMLElement | null)[]>([]);

  const finaleSecRef = useRef<HTMLElement>(null);
  const finaleBgRef = useRef<HTMLImageElement>(null);
  const finaleCtaRef = useRef<HTMLAnchorElement>(null);

  const mouseRef = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });

  const activeColor = SWATCHES[selectedAccentIndex].hex;

  useEffect(() => {
    let eyeFrac = 0;
    let heroDone = false;
    const updateProgress = () => {
      setLoadPct(Math.min(0.99, eyeFrac * 0.85 + (heroDone ? 0.15 : 0)));
    };

    const heroImg = new Image();
    heroImg.src = ASSETS.halo;
    const heroPromise = heroImg
      .decode()
      .catch(() => undefined)
      .then(() => {
        heroDone = true;
        updateProgress();
      });

    const eyePromise = frameSets.eye.load((f) => {
      eyeFrac = f;
      updateProgress();
    });

    const start = performance.now();
    Promise.all([heroPromise, eyePromise]).then(async () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, 1000 - elapsed);
      await new Promise((r) => setTimeout(r, wait));
      setLoadPct(1);
      setReady(true);
      frameSets.smoke.load().then(() => frameSets.morph.load());
    });
  }, [frameSets]);

  useEffect(() => {
    const scroller = findNearestScroller(containerRef.current);
    let easedY = getScrollY(scroller);
    let targetY = easedY;
    let animFrame = 0;
    let lastTime = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;

      const cta = finaleCtaRef.current;
      if (cta) {
        const r = cta.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const near = dist < Math.max(r.width, r.height) * 0.9;
        pointerRef.current.active = near;
        pointerRef.current.tx = near ? (e.clientX - cx) * 0.28 : 0;
        pointerRef.current.ty = near ? (e.clientY - cy) * 0.28 : 0;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    const fitPlates = () => {
      const track = platesTrackRef.current;
      const sec = platesSecRef.current;
      if (track && sec) {
        const vh = getViewportHeight(scroller);
        const travel = Math.max(0, track.scrollWidth - window.innerWidth);
        sec.style.height = `${travel + vh}px`;
      }
    };
    fitPlates();
    window.addEventListener("resize", fitPlates);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000) || 0.016;
      lastTime = now;
      targetY = getScrollY(scroller);
      const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 8);
      easedY += (targetY - easedY) * k;
      if (Math.abs(targetY - easedY) < 0.05) easedY = targetY;

      const vh = getViewportHeight(scroller);
      const maxScroll = getMaxScroll(scroller);
      const pTotal = clamp(easedY / maxScroll);
      setScrollProgress(pTotal);

      const m = mouseRef.current;
      m.sx = lerp(m.sx, m.x, 0.06);
      m.sy = lerp(m.sy, m.y, 0.06);

      const q = pointerRef.current;
      q.x = lerp(q.x, q.tx, 0.14);
      q.y = lerp(q.y, q.ty, 0.14);
      if (finaleCtaRef.current) {
        finaleCtaRef.current.style.transform = `translate3d(${q.x.toFixed(2)}px, ${q.y.toFixed(2)}px, 0)`;
      }

      const pClampHero = clamp(easedY / Math.max(1, vh));
      if (heroImgRef.current && pClampHero < 1) {
        heroImgRef.current.style.transform = `translate3d(${(-m.sx * 26).toFixed(2)}px, ${(
          pClampHero * vh * 0.2 -
          m.sy * 16
        ).toFixed(2)}px, 0) scale(${(1.06 + pClampHero * 0.14).toFixed(4)})`;
      }
      if (heroGlowRef.current && pClampHero < 1) {
        heroGlowRef.current.style.opacity = String(0.55 + pClampHero * 0.45);
        heroGlowRef.current.style.transform = `scale(${(1 + pClampHero * 1.4).toFixed(3)})`;
      }
      if (heroCopyRef.current && pClampHero < 1) {
        heroCopyRef.current.style.transform = `translate3d(0, ${(-pClampHero * vh * 0.14).toFixed(2)}px, 0)`;
        heroCopyRef.current.style.opacity = String(Math.max(0, 1 - pClampHero * 1.5));
      }

      const handleScene = (
        secEl: HTMLElement | null,
        canvasEl: HTMLCanvasElement | null,
        clockEl: HTMLSpanElement | null,
        beatEls: (HTMLDivElement | null)[],
        set: SlidingFrameSet,
        beats: Beat[],
        focal: [number, number],
        zoomRange: [number, number],
        seconds: number
      ) => {
        if (!secEl || !canvasEl) return;
        const top = getElementTop(secEl, scroller);
        const height = secEl.offsetHeight;
        const travel = Math.max(1, height - vh);
        const p = clamp((easedY - top) / travel);
        const visible = easedY + vh > top && easedY < top + height;
        const near = easedY + vh * 2.5 > top && easedY < top + height + vh * 1.5;

        if (near) {
          const index = p * (set.count - 1);
          set.window(index, 12);
        }

        if (visible) {
          const index = p * (set.count - 1);
          const i0 = Math.floor(index);
          const f = index - i0;
          const i1 = Math.min(set.count - 1, i0 + 1);
          const a = set.get(i0) ?? set.nearest(i0);
          if (a) {
            const ctx = canvasEl.getContext("2d");
            if (ctx) {
              const W = canvasEl.width;
              const H = canvasEl.height;
              const zoom = lerp(zoomRange[0], zoomRange[1], p);
              const scale = Math.max(W / a.width, H / a.height) * zoom;
              const dw = a.width * scale;
              const dh = a.height * scale;
              const dx = (W - dw) * focal[0];
              const dy = (H - dh) * focal[1];
              ctx.globalAlpha = 1;
              ctx.drawImage(a, dx, dy, dw, dh);
              const b = f > 0.02 ? set.get(i1) : undefined;
              if (b) {
                ctx.globalAlpha = f;
                ctx.drawImage(b, dx, dy, dw, dh);
                ctx.globalAlpha = 1;
              }
            }
          }

          if (clockEl) {
            const s = Math.max(0, p * seconds);
            const min = Math.floor(s / 60);
            clockEl.textContent = `${String(min).padStart(2, "0")}:${(s - min * 60).toFixed(1).padStart(4, "0")}`;
          }

          beats.forEach((b, idx) => {
            const el = beatEls[idx];
            if (!el) return;
            const on = p >= b.from && p <= b.to;
            el.style.visibility = on ? "visible" : "hidden";
            if (!on) return;
            const inP = smooth(range(p, b.from, b.from + 0.07));
            const outP = smooth(range(p, b.to - 0.06, b.to));
            el.style.setProperty("--in", inP.toFixed(4));
            el.style.setProperty("--out", outP.toFixed(4));
          });
        }
      };

      handleScene(
        irisSecRef.current,
        irisCanvasRef.current,
        irisClockRef.current,
        irisBeatRefs.current,
        frameSets.eye,
        IRIS_BEATS,
        [0.5, 0.5],
        [1, 1.12],
        10
      );

      handleScene(
        smokeSecRef.current,
        smokeCanvasRef.current,
        smokeClockRef.current,
        smokeBeatRefs.current,
        frameSets.smoke,
        SMOKE_BEATS,
        [0.5, 0.45],
        [1, 1.06],
        10
      );

      handleScene(
        morphSecRef.current,
        morphCanvasRef.current,
        morphClockRef.current,
        morphBeatRefs.current,
        frameSets.morph,
        MORPH_BEATS,
        [0.5, 0.4],
        [1.02, 1],
        10
      );

      if (interludeSecRef.current) {
        const sec = interludeSecRef.current;
        const top = getElementTop(sec, scroller);
        const height = sec.offsetHeight;
        const travel = Math.max(1, height - vh);
        const p = clamp((easedY - top) / travel);
        const visible = easedY + vh > top && easedY < top + height;
        if (visible) {
          const open = smooth(range(p, 0.02, 0.5));
          if (interludeClipRef.current) {
            interludeClipRef.current.style.clipPath = `circle(${(open * 78).toFixed(2)}% at 50% 44%)`;
          }
          if (interludeImgRef.current) {
            interludeImgRef.current.style.transform = `scale(${lerp(1.3, 1, smooth(range(p, 0, 0.8))).toFixed(4)})`;
          }
          const dist = window.innerWidth * 2.2;
          if (interludeRowARef.current) {
            interludeRowARef.current.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
          }
          if (interludeRowBRef.current) {
            interludeRowBRef.current.style.transform = `translate3d(${(p * dist - dist).toFixed(1)}px, 0, 0)`;
          }
          if (interludeBeatRef.current) {
            interludeBeatRef.current.style.setProperty("--in", smooth(range(p, 0.42, 0.55)).toFixed(4));
            interludeBeatRef.current.style.setProperty("--out", "0");
          }
        }
      }

      if (stripesSecRef.current) {
        const sec = stripesSecRef.current;
        const top = getElementTop(sec, scroller);
        const height = sec.offsetHeight;
        const travel = Math.max(1, height - vh);
        const p = clamp((easedY - top) / travel);
        const visible = easedY + vh > top && easedY < top + height;
        if (visible) {
          const open = smooth(range(p, 0.03, 0.6));
          if (stripesStageRef.current) {
            stripesStageRef.current.style.setProperty("--r", (open * 1.004).toFixed(4));
          }
          if (stripesImgRef.current) {
            stripesImgRef.current.style.transform = `scale(${lerp(1.16, 1, open).toFixed(4)})`;
          }
          if (stripesBeatRef.current) {
            stripesBeatRef.current.style.setProperty("--in", smooth(range(p, 0.45, 0.62)).toFixed(4));
            stripesBeatRef.current.style.setProperty("--out", "0");
          }
        }
      }

      if (platesSecRef.current && platesTrackRef.current) {
        const sec = platesSecRef.current;
        const track = platesTrackRef.current;
        const top = getElementTop(sec, scroller);
        const height = sec.offsetHeight;
        const travel = Math.max(1, height - vh);
        const p = clamp((easedY - top) / travel);
        const visible = easedY + vh > top && easedY < top + height;
        if (visible) {
          const maxTrackTravel = Math.max(0, track.scrollWidth - window.innerWidth);
          track.style.transform = `translate3d(${(-p * maxTrackTravel).toFixed(1)}px, 0, 0)`;
          const vw = window.innerWidth;
          plateImgRefs.current.forEach((im, i) => {
            const card = plateCardRefs.current[i];
            if (!im || !card) return;
            const r = card.getBoundingClientRect();
            const off = (r.left + r.width / 2 - vw / 2) / vw;
            im.style.setProperty("--shift", `${(off * -6).toFixed(2)}%`);
          });
        }
      }

      if (finaleSecRef.current) {
        const sec = finaleSecRef.current;
        const top = getElementTop(sec, scroller);
        const height = sec.offsetHeight;
        const travel = Math.max(1, height - vh);
        const p = clamp((easedY - top) / travel);
        const visible = easedY + vh > top && easedY < top + height;
        if (visible && finaleBgRef.current) {
          finaleBgRef.current.style.transform = `scale(${lerp(1.05, 1.28, smooth(p)).toFixed(4)})`;
        }
      }

      const chapterIds = ["overture", "iris", "smoke", "black", "pigment", "stripes", "plates", "index"];
      let activeIndex = 0;
      chapterIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const top = getElementTop(el, scroller);
          if (easedY + vh * 0.5 >= top) activeIndex = i;
        }
      });
      setActiveChapter(activeIndex);

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", fitPlates);
    };
  }, [reducedMotion, frameSets]);

  useEffect(() => {
    const handleResize = () => {
      [irisCanvasRef.current, smokeCanvasRef.current, morphCanvasRef.current].forEach((c) => {
        if (!c) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const w = Math.min(1600, Math.round(c.clientWidth * dpr));
        c.width = w;
        c.height = Math.max(1, Math.round((w * c.clientHeight) / Math.max(1, c.clientWidth)));
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const marqueeWords = useMemo(
    () => [...BLACK_INTERLUDE.marquee, ...BLACK_INTERLUDE.marquee, ...BLACK_INTERLUDE.marquee],
    []
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#07030A] text-[#F7E9EE] font-sans overflow-x-clip selection:bg-[#FC318D] selection:text-[#07030A]"
      style={
        {
          "--k-ink": "#07030A",
          "--k-ink-2": "#12070E",
          "--k-paper": "#F7E9EE",
          "--k-muted": "#B8929F",
          "--k-line": "rgba(247, 233, 238, 0.14)",
          "--k-accent": activeColor,
        } as CSSProperties
      }
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800&display=swap"
      />

      <style>{`
        .font-serif {
          font-family: 'Bodoni Moda', 'Didot', Georgia, serif;
          font-optical-sizing: auto;
        }
        .font-sans {
          font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .k-line {
          white-space: nowrap;
          --t: clamp(0, calc(var(--in, 0) * 2 - var(--i, 0) * 0.38), 1);
          display: block;
          overflow: hidden;
          padding: 0.06em 0 0.16em;
          margin-bottom: -0.16em;
        }
        .k-line-in {
          display: block;
          transform: translate3d(0, calc((1 - var(--t) - var(--out, 0)) * 112%), 0);
          will-change: transform;
        }
        .k-rise {
          display: block;
          overflow: hidden;
          padding: 0.06em 0 0.16em;
          margin-bottom: -0.16em;
        }
        .k-rise-in {
          display: block;
          transform: translate3d(0, ${ready ? "0%" : "112%"}, 0);
          transition: transform 1.4s cubic-bezier(0.16, 0.84, 0.2, 1) calc(var(--i, 0) * 0.12s + 0.35s);
        }
      `}</style>

      {/* Preloader */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 bg-[#07030A] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          ready ? "-translate-y-full pointer-events-none" : "translate-y-0"
        }`}
        role="status"
        aria-live="polite"
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B8929F]">
          {TAGLINE}
        </p>
        <div className="self-end my-auto text-right">
          <p className="font-serif text-6xl md:text-9xl font-medium tracking-tight text-[#F7E9EE] tabular-nums">
            {String(Math.round(loadPct * 100)).padStart(3, "0")}
            <span className="text-2xl md:text-3xl text-[#B8929F] ml-2">%</span>
          </p>
        </div>
        <p className="font-serif italic text-6xl md:text-[18vw] leading-none tracking-tight text-[var(--k-accent)]">
          {BRAND}
        </p>
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--k-accent)] origin-left transition-transform duration-300"
          style={{ transform: `scaleX(${loadPct})` }}
        />
      </div>

      {/* Persistent Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 grid grid-cols-2 md:grid-cols-3 items-center px-5 md:px-12 py-5 bg-gradient-to-b from-[#07030A]/90 to-transparent pointer-events-none">
        <a
          href="#overture"
          className="pointer-events-auto font-serif italic text-2xl font-medium tracking-tight text-[#F7E9EE] hover:opacity-80 transition-opacity"
        >
          {BRAND}
        </a>
        <p className="hidden md:block pointer-events-auto text-center font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[#F7E9EE]">
          <span>{CHAPTERS[activeChapter]?.label}</span>
        </p>
        <p className="pointer-events-auto justify-self-end font-sans text-xs md:text-sm font-medium tracking-widest text-[#B8929F] tabular-nums">
          {String(Math.round(scrollProgress * 100)).padStart(3, "0")}
          <span className="text-[10px] ml-0.5">%</span>
        </p>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#C51B3A] to-[#FC318D] origin-left"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* Main Experience */}
      <main className="relative">
        {/* Overture Hero */}
        <section
          id="overture"
          className="relative flex items-end min-h-screen min-h-[100svh] overflow-hidden bg-[#07030A]"
        >
          <img
            ref={heroImgRef}
            src={ASSETS.halo}
            alt="A black panther with pink eyes in front of a magenta glow"
            className="absolute inset-0 w-full h-full object-cover object-[76%_38%] scale-105 will-change-transform"
          />
          <div
            ref={heroGlowRef}
            className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(38%_52%_at_72%_38%,rgba(252,49,141,0.5),transparent_72%)] origin-[72%_38%]"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#07030A]/95 via-[#07030A]/50 to-transparent" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07030A] via-[#07030A]/40 to-transparent" />

          <div
            ref={heroCopyRef}
            className="relative z-10 max-w-4xl px-6 md:px-16 pb-20 md:pb-32 will-change-transform"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-5">
              {HERO_DATA.eyebrow}
            </p>
            <h1 className="font-serif font-medium text-5xl md:text-8xl lg:text-9xl tracking-tight leading-[0.92]">
              <LinesView lines={HERO_DATA.lines} mode="rise" />
            </h1>
            <p className="max-w-md mt-6 text-sm md:text-base leading-relaxed text-[#B8929F]">
              {HERO_DATA.sub}
            </p>
          </div>

          <div className="absolute right-6 md:right-16 bottom-8 hidden md:flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#F7E9EE]">
            <span>{HERO_DATA.cue}</span>
            <div className="relative w-16 h-[1px] bg-white/20 overflow-hidden">
              <div className="absolute inset-0 bg-[#F7E9EE] -translate-x-full animate-[pulse_2.2s_ease-in-out_infinite]" />
            </div>
          </div>
        </section>

        {/* Scene I: Iris */}
        {/* canvas-ok: 120-frame continuous scroll-driven canvas playback of AI macro film sequences */}
        <section ref={irisSecRef} id="iris" className="relative h-[380vh] bg-[#07030A]">
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden bg-[#07030A]">
            <canvas ref={irisCanvasRef} className="absolute inset-0 w-full h-full block" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_46%,transparent_38%,rgba(7,3,10,0.78)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none bg-gradient-to-t from-[#07030A]/90 to-transparent" />

            <div className="absolute inset-0 pointer-events-none">
              {IRIS_BEATS.map((beat, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    irisBeatRefs.current[i] = el;
                  }}
                  className={`absolute px-6 md:px-16 transition-opacity duration-300 ${
                    beat.align === "left"
                      ? "left-0 bottom-16 md:bottom-28 max-w-xl text-left"
                      : "right-0 bottom-16 md:bottom-28 max-w-xl text-left md:text-right"
                  }`}
                >
                  {beat.kicker && (
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                      {beat.kicker}
                    </p>
                  )}
                  <h2 className="font-serif font-medium text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.94]">
                    <LinesView lines={beat.lines} />
                  </h2>
                  {beat.body && (
                    <p className="mt-5 text-sm md:text-base leading-relaxed text-[#B8929F] max-w-md md:ml-auto">
                      {beat.body}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 right-6 md:right-12 hidden md:flex items-baseline gap-2 text-xs font-mono tracking-widest text-[#B8929F] tabular-nums pointer-events-none">
              <span ref={irisClockRef} className="text-[#F7E9EE]">
                00:00.0
              </span>
              <span>/ 00:10.0</span>
            </div>
          </div>
        </section>

        {/* Scene II: Smoke */}
        <section ref={smokeSecRef} id="smoke" className="relative h-[520vh] bg-[#07030A]">
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden bg-[#07030A]">
            <canvas ref={smokeCanvasRef} className="absolute inset-0 w-full h-full block" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_46%,transparent_38%,rgba(7,3,10,0.78)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none bg-gradient-to-t from-[#07030A]/90 to-transparent" />

            <div className="absolute inset-0 pointer-events-none">
              {SMOKE_BEATS.map((beat, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    smokeBeatRefs.current[i] = el;
                  }}
                  className={`absolute px-6 md:px-16 transition-opacity duration-300 ${
                    beat.align === "left"
                      ? "left-0 bottom-16 md:bottom-28 max-w-xl text-left"
                      : beat.align === "right"
                      ? "right-0 bottom-16 md:bottom-28 max-w-xl text-left md:text-right"
                      : "inset-x-0 bottom-20 md:bottom-32 text-center max-w-none"
                  }`}
                >
                  {beat.kicker && (
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                      {beat.kicker}
                    </p>
                  )}
                  <h2 className="font-serif font-medium text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.94]">
                    <LinesView lines={beat.lines} />
                  </h2>
                  {beat.body && (
                    <p className="mt-5 text-sm md:text-base leading-relaxed text-[#B8929F] max-w-md md:ml-auto">
                      {beat.body}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 right-6 md:right-12 hidden md:flex items-baseline gap-2 text-xs font-mono tracking-widest text-[#B8929F] tabular-nums pointer-events-none">
              <span ref={smokeClockRef} className="text-[#F7E9EE]">
                00:00.0
              </span>
              <span>/ 00:10.0</span>
            </div>
          </div>
        </section>

        {/* Scene III: Black (Interlude with Circular Iris + Marquee) */}
        <section ref={interludeSecRef} id="black" className="relative h-[280vh] bg-[#07030A]">
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden bg-[#07030A]">
            <div ref={interludeClipRef} className="absolute inset-0 will-change-[clip-path]">
              <img
                ref={interludeImgRef}
                src={ASSETS.panther}
                alt="A black panther with red rim light staring at the camera"
                className="w-full h-full object-cover object-[50%_40%] origin-[50%_44%] will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07030A]/90 to-transparent" />
            </div>

            {/* Sliding outline marquee with clean typography separator (no prohibited spark/gemini glyphs) */}
            <div
              ref={interludeRowARef}
              className="absolute left-0 top-[10vh] md:top-[9vh] flex items-center whitespace-nowrap font-serif italic text-5xl md:text-9xl lg:text-[14vw] text-transparent [-webkit-text-stroke:1px_rgba(255,108,168,0.7)] pointer-events-none will-change-transform"
              aria-hidden="true"
            >
              {marqueeWords.map((w, i) => (
                <span key={i} className="inline-flex items-center">
                  <span>{w}</span>
                  <span className="mx-4 md:mx-8 not-italic text-sm md:text-2xl text-[var(--k-accent)] opacity-60">
                    /
                  </span>
                </span>
              ))}
            </div>

            <div
              ref={interludeRowBRef}
              className="absolute left-0 top-[22vh] md:top-[26vh] flex items-center whitespace-nowrap font-serif italic text-5xl md:text-9xl lg:text-[14vw] text-transparent [-webkit-text-stroke:1px_rgba(255,108,168,0.7)] pointer-events-none will-change-transform"
              aria-hidden="true"
            >
              {marqueeWords.map((w, i) => (
                <span key={i} className="inline-flex items-center">
                  <span>{w}</span>
                  <span className="mx-4 md:mx-8 not-italic text-sm md:text-2xl text-[var(--k-accent)] opacity-60">
                    /
                  </span>
                </span>
              ))}
            </div>

            <div
              ref={interludeBeatRef}
              className="absolute left-0 bottom-16 md:bottom-24 px-6 md:px-16 max-w-xl text-left"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                {BLACK_INTERLUDE.kicker}
              </p>
              <h2 className="font-serif font-medium text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.94]">
                <LinesView lines={BLACK_INTERLUDE.lines} />
              </h2>
            </div>
          </div>
        </section>

        {/* Scene IV: Pigment (Panther -> Tiger morph) */}
        <section ref={morphSecRef} id="pigment" className="relative h-[560vh] bg-[#07030A]">
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden bg-[#07030A]">
            <canvas ref={morphCanvasRef} className="absolute inset-0 w-full h-full block" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_46%,transparent_38%,rgba(7,3,10,0.78)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none bg-gradient-to-t from-[#07030A]/90 to-transparent" />

            <div className="absolute inset-0 pointer-events-none">
              {MORPH_BEATS.map((beat, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    morphBeatRefs.current[i] = el;
                  }}
                  className={`absolute px-6 md:px-16 transition-opacity duration-300 ${
                    beat.outline
                      ? "inset-x-0 bottom-2 md:bottom-6 text-center max-w-none"
                      : beat.align === "top"
                      ? "left-0 top-20 md:top-28 max-w-xl text-left"
                      : "right-0 top-20 md:top-28 max-w-md text-left md:text-right"
                  }`}
                >
                  {beat.kicker && (
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                      {beat.kicker}
                    </p>
                  )}
                  {beat.outline ? (
                    <h2 className="font-serif font-medium text-7xl md:text-[22vw] leading-[0.9] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_#FC318D]">
                      {beat.lines[0]}
                    </h2>
                  ) : (
                    <h2 className="font-serif font-medium text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.94]">
                      <LinesView lines={beat.lines} />
                    </h2>
                  )}
                  {beat.body && (
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-[#B8929F]">
                      {beat.body}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 right-6 md:right-12 hidden md:flex items-baseline gap-2 text-xs font-mono tracking-widest text-[#B8929F] tabular-nums pointer-events-none">
              <span ref={morphClockRef} className="text-[#F7E9EE]">
                00:00.0
              </span>
              <span>/ 00:10.0</span>
            </div>
          </div>
        </section>

        {/* Scene V: Stripes (Tiger Vertical Slat CSS Mask Reveal) */}
        <section ref={stripesSecRef} id="stripes" className="relative h-[290vh] bg-[#07030A]">
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden bg-[#07030A]">
            <div
              ref={stripesStageRef}
              className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(228,52,121,0.28)_0_1px,transparent_1px_calc(100%/14))]"
              style={{ "--pitch": "calc(100% / 14)" } as CSSProperties}
            >
              <img
                ref={stripesImgRef}
                src={ASSETS.tiger}
                alt="A hot pink tiger with dark crimson stripes staring at the camera"
                className="w-full h-full object-cover object-[50%_40%] origin-[50%_45%] will-change-transform [-webkit-mask-image:repeating-linear-gradient(90deg,#000_0,#000_calc(var(--r,0)*100%/14),transparent_calc(var(--r,0)*100%/14),transparent_calc(100%/14))] [mask-image:repeating-linear-gradient(90deg,#000_0,#000_calc(var(--r,0)*100%/14),transparent_calc(var(--r,0)*100%/14),transparent_calc(100%/14))]"
              />
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#07030A]/85 via-transparent to-transparent" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07030A]/80 via-transparent to-transparent" />

            <div
              ref={stripesBeatRef}
              className="absolute left-0 bottom-16 md:bottom-24 px-6 md:px-16 max-w-xl text-left"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                {STRIPES_DATA.kicker}
              </p>
              <h2 className="font-serif font-medium text-4xl md:text-7xl lg:text-8xl tracking-tight leading-[0.94]">
                <LinesView lines={STRIPES_DATA.lines} />
              </h2>
              <p className="mt-5 text-sm md:text-base leading-relaxed text-[#B8929F] max-w-md">
                {STRIPES_DATA.body}
              </p>
            </div>
          </div>
        </section>

        {/* Scene VI: Plates (Horizontal Gallery Driven by Scroll) */}
        <section ref={platesSecRef} id="plates" className="relative bg-[#07030A]">
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden flex items-center bg-[radial-gradient(60%_60%_at_20%_50%,rgba(197,27,58,0.14),transparent_70%)] bg-[#07030A]">
            <div
              ref={platesTrackRef}
              className="flex items-center gap-8 md:gap-16 w-max h-full px-6 md:px-16 will-change-transform"
            >
              <div className="flex-none w-[80vw] md:w-[34rem] pr-6">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                  {PLATES_DATA.kicker}
                </p>
                <h2 className="font-serif font-medium text-4xl md:text-7xl tracking-tight leading-[0.94]">
                  <LinesView lines={PLATES_DATA.lines} mode="rise" />
                </h2>
                <p className="mt-5 text-sm md:text-base leading-relaxed text-[#B8929F]">
                  {PLATES_DATA.body}
                </p>
              </div>

              {PLATES_DATA.items.map((pl, i) => (
                <figure
                  key={pl.n}
                  ref={(el) => {
                    plateCardRefs.current[i] = el;
                  }}
                  className={`flex-none w-[72vw] sm:w-[50vw] md:w-[30vw] max-w-[480px] m-0 transition-transform ${
                    i % 2 === 0 ? "translate-y-4 md:translate-y-8" : "-translate-y-4 md:-translate-y-8"
                  }`}
                  style={{ "--hex": pl.hex } as CSSProperties}
                >
                  <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#12070E]">
                    <img
                      ref={(el) => {
                        plateImgRefs.current[i] = el;
                      }}
                      src={ASSETS[pl.still]}
                      alt={`Close crop: ${pl.title}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover will-change-transform"
                      style={
                        {
                          objectPosition: `${pl.x * 100}% ${pl.y * 100}%`,
                          transformOrigin: `${pl.x * 100}% ${pl.y * 100}%`,
                          transform: `translate3d(var(--shift, 0%), 0, 0) translate(calc((0.5 - ${pl.x}) * 100%), calc((0.5 - ${pl.y}) * 100%)) scale(${pl.zoom})`,
                        } as CSSProperties
                      }
                    />
                  </div>
                  <figcaption className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-baseline gap-2 md:gap-4 mt-4">
                    <div>
                      <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-[#B8929F]">
                        Plate {pl.n}
                      </span>
                      <span className="block font-serif italic text-2xl md:text-3xl font-medium tracking-tight mt-1">
                        {pl.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: pl.hex, boxShadow: `0 0 16px ${pl.hex}` }}
                      />
                      <div className="text-left">
                        <span className="block text-xs font-semibold tracking-wide">{pl.pigment}</span>
                        <code className="block text-[11px] font-mono tracking-wider text-[#B8929F]">
                          {pl.hex}
                        </code>
                      </div>
                    </div>
                  </figcaption>
                </figure>
              ))}

              <div className="flex-none w-12 md:w-32" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Scene VII: Finale & Swatches */}
        <section
          ref={finaleSecRef}
          id="index"
          className="relative min-h-[160vh] bg-[#07030A] transition-colors duration-500"
        >
          <div className="sticky top-0 h-screen h-[100svh] overflow-hidden flex items-center bg-[#07030A]">
            <img
              ref={finaleBgRef}
              src={ASSETS.halo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-[76%_40%] opacity-55 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07030A]/95 via-[#07030A]/65 to-[#07030A]/85" />

            <div className="relative z-10 max-w-3xl px-6 md:px-16 py-12">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--k-accent)] mb-4">
                {FINALE_DATA.kicker}
              </p>
              <h2 className="font-serif font-medium text-5xl md:text-8xl tracking-tight leading-[0.9]">
                <LinesView lines={FINALE_DATA.lines} />
              </h2>
              <p className="mt-5 text-sm md:text-base leading-relaxed text-[#B8929F] max-w-md">
                {FINALE_DATA.body}
              </p>

              <div className="flex flex-wrap gap-2.5 mt-8" role="radiogroup" aria-label="Pigments">
                {SWATCHES.map((swatch, idx) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    role="radio"
                    aria-checked={idx === selectedAccentIndex}
                    onClick={() => setSelectedAccentIndex(idx)}
                    className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-xs md:text-sm font-medium transition-all ${
                      idx === selectedAccentIndex
                        ? "border-[var(--k-accent)] bg-[#07030A]/80 shadow-[0_0_16px_var(--k-accent)]"
                        : "border-white/10 bg-[#07030A]/40 hover:border-white/30 text-[#F7E9EE]"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span>{swatch.name}</span>
                    <code className="text-[11px] font-mono text-[#B8929F]">{swatch.hex}</code>
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <a
                  ref={finaleCtaRef}
                  href="#overture"
                  className="inline-flex items-center gap-4 px-8 py-4 rounded-[999px] text-xs md:text-sm font-bold uppercase tracking-wider bg-[var(--k-accent)] text-[#170610] shadow-lg hover:brightness-110 active:scale-95 transition-all will-change-transform"
                >
                  <span>{FINALE_DATA.cta}</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    className="shrink-0 stroke-current fill-none stroke-2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>

            <p className="absolute left-6 md:left-16 right-6 md:right-16 bottom-6 text-xs text-[#B8929F] tracking-wide">
              {FINALE_DATA.footnote}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
