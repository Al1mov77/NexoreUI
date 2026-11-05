"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export const STORE_NAME = "Toyberry";
export const CURRENCY = "$";
const SCROLL_LENGTH_VH = 900;

const TIMELINE = {
  s1End: 0.28,
  pop: 0.265,
  hold0: 0.3,
  hold1: 0.44,
  s2Start: 0.52,
  s2End: 0.74,
  scan0: 0.76,
  scan1: 0.93,
  done: 0.95,
} as const;

const FRAME_W = 1280;
const FRAME_H = 720;

export interface ToyberryProduct {
  id: string;
  name: string;
  price: number;
  tag: string;
  desc: string;
  specs: string[];
  img: string;
  x: number;
  y: number;
  side: number;
  pad: number;
}

export const PRODUCTS: ToyberryProduct[] = [
  {
    id: "dino",
    name: "Lavender Dino",
    price: 24,
    tag: "New Arrival",
    desc: "Plush lilac dinosaur with soft mint spines and rosy cheeks. Gentle companion for quiet afternoon adventures.",
    specs: ["Cotton Plush", "28 cm", "All Ages"],
    img: "/templates/toyberry/toys/dino.png",
    x: 20,
    y: 32.5,
    side: 16.5,
    pad: 0.0361,
  },
  {
    id: "rocket",
    name: "Starlight Rocket",
    price: 19,
    tag: "Bestseller",
    desc: "Soft vinyl retro rocket with friendly illustrated eyes. Ready for bedtime voyages across the room.",
    specs: ["Soft Vinyl", "15 cm", "Ages 1+"],
    img: "/templates/toyberry/toys/rocket.png",
    x: 50,
    y: 32.5,
    side: 16.5,
    pad: 0.0361,
  },
  {
    id: "bear",
    name: "Pastel Teddy",
    price: 28,
    tag: "Staff Pick",
    desc: "Hand-stitched rainbow bear with a satin sky-blue bowtie. Cloud-soft finish and always ready for hugs.",
    specs: ["Ultra Plush", "30 cm", "All Ages"],
    img: "/templates/toyberry/toys/bear.png",
    x: 80,
    y: 32.5,
    side: 16.5,
    pad: 0.0333,
  },
  {
    id: "pinkcar",
    name: "Peach Cruiser",
    price: 16,
    tag: "Toddler Safe",
    desc: "Rounded wooden coupe in pastel peach with oversized rounded wheels designed for small hands.",
    specs: ["Smooth Vinyl", "10 cm", "Ages 1+"],
    img: "/templates/toyberry/toys/pinkcar.png",
    x: 20,
    y: 50,
    side: 15.5,
    pad: 0.1347,
  },
  {
    id: "duck",
    name: "Sunny Quacker",
    price: 9,
    tag: "Bath Toy",
    desc: "Classic lemon yellow rubber duck with an optimistic smile. Buoyant, hygienic, and splash-proof.",
    specs: ["Natural Rubber", "9 cm", "6 mo+"],
    img: "/templates/toyberry/toys/duck.png",
    x: 50,
    y: 50,
    side: 14.5,
    pad: 0.0361,
  },
  {
    id: "redcar",
    name: "Cherry Racer",
    price: 15,
    tag: "Classic",
    desc: "Glossy crimson roadster with whitewall tires and an arched grill. Engineered for fast floor laps.",
    specs: ["Cast Polymer", "12 cm", "Ages 3+"],
    img: "/templates/toyberry/toys/redcar.png",
    x: 80,
    y: 50,
    side: 16,
    pad: 0.2194,
  },
  {
    id: "robot",
    name: "Beep-Boop Bot",
    price: 36,
    tag: "Top Rated",
    desc: "Retro explorer robot with star buttons and cheerful tactile dials. Built for imaginative expeditions.",
    specs: ["BPA-Free ABS", "22 cm", "Ages 3+"],
    img: "/templates/toyberry/toys/robot.png",
    x: 20,
    y: 67.5,
    side: 16.5,
    pad: 0.0333,
  },
  {
    id: "train",
    name: "Little Conductor",
    price: 32,
    tag: "Solid Wood",
    desc: "Handcrafted wooden locomotive with articulating wheels and magnetic freight couplings.",
    specs: ["Natural Beech", "25 cm", "Ages 3+"],
    img: "/templates/toyberry/toys/train.png",
    x: 80,
    y: 67.5,
    side: 16.5,
    pad: 0.0333,
  },
];

const CART_SLOTS = [
  { x: 38, y: 100 },
  { x: 50, y: 100 },
  { x: 62, y: 100 },
  { x: 44, y: 94 },
  { x: 56, y: 94 },
  { x: 32, y: 95 },
  { x: 68, y: 95 },
  { x: 50, y: 89 },
] as const;

const CART_ZONE = { x0: 18, x1: 84, y0: 68 } as const;
const SCANNER = { x: 48, y: 55.5 } as const;
const BAG = { x: 81, y: 47.5 } as const;

function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function frameName(scene: 1 | 2, i: number): string {
  return `/templates/toyberry/frames/s${scene}/${String(i + 1).padStart(4, "0")}.webp`;
}

function money(amount: number): string {
  return `${CURRENCY}${amount.toFixed(0)}`;
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

function getElementTop(el: HTMLElement, scroller: HTMLElement | Window): number {
  const r = el.getBoundingClientRect();
  if (scroller === window) return r.top + window.scrollY;
  const sRect = (scroller as HTMLElement).getBoundingClientRect();
  return r.top - sRect.top + (scroller as HTMLElement).scrollTop;
}

export interface ToyberryStorePreviewProps {
  resolve?: (path: string) => string;
  frameCounts?: [number, number];
}

interface DragState {
  id: string;
  x: number;
  y: number;
}

export function ToyberryStorePreview({
  resolve = (p) => p,
  frameCounts = [120, 120],
}: ToyberryStorePreviewProps) {
  const prefersReduced = useReducedMotion();
  const [p, setP] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [cart, setCart] = useState<string[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frames = useRef<{ s1: HTMLImageElement[]; s2: HTMLImageElement[] }>({ s1: [], s2: [] });
  const targetP = useRef(0);
  const curP = useRef(0);
  const dragMeta = useRef<{ id: string; sx: number; sy: number; moved: boolean } | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const audio = useRef<AudioContext | null>(null);
  const lastScanned = useRef(0);

  const byId = useCallback((id: string) => {
    return PRODUCTS.find((x) => x.id === id) ?? PRODUCTS[0];
  }, []);

  useEffect(() => {
    const checkViewports = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    checkViewports();
    window.addEventListener("resize", checkViewports);
    return () => window.removeEventListener("resize", checkViewports);
  }, []);

  useEffect(() => {
    let done = 0;
    let dead = false;
    const total = frameCounts[0] + frameCounts[1];
    const load = (src: string) =>
      new Promise<HTMLImageElement>((res) => {
        const im = new Image();
        im.decoding = "async";
        const fin = () => {
          done++;
          if (!dead) setLoaded(done / total);
          res(im);
        };
        im.onload = fin;
        im.onerror = fin;
        im.src = src;
      });

    const loadScene = (scene: 1 | 2, count: number) =>
      Promise.all(Array.from({ length: count }, (_, i) => load(resolve(frameName(scene, i)))));

    Promise.all([loadScene(1, frameCounts[0]), loadScene(2, frameCounts[1])]).then(([s1, s2]) => {
      if (!dead) {
        frames.current = { s1, s2 };
        setLoaded(1.0001);
      }
    });

    PRODUCTS.forEach((pr) => {
      const im = new Image();
      im.src = resolve(pr.img);
    });

    return () => {
      dead = true;
    };
  }, [frameCounts, resolve]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = findNearestScroller(root);

    const read = () => {
      const top = getElementTop(root, scroller);
      const vh = getViewportHeight(scroller);
      const travel = Math.max(1, root.offsetHeight - vh);
      const scrollY = getScrollY(scroller);
      targetP.current = clamp((scrollY - top) / travel);
    };

    read();
    scroller.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    let raf = 0;
    const tick = () => {
      if (prefersReduced) {
        curP.current = targetP.current;
        setP(curP.current);
      } else {
        const delta = targetP.current - curP.current;
        if (Math.abs(delta) > 0.00004) {
          curP.current += delta * 0.14;
          setP(curP.current);
        } else if (curP.current !== targetP.current) {
          curP.current = targetP.current;
          setP(curP.current);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [prefersReduced]);

  useEffect(() => {
    const c = canvasRef.current;
    const { s1, s2 } = frames.current;
    if (!c || !s1.length || !s2.length) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const f1 = Math.round(clamp(p / TIMELINE.s1End) * (s1.length - 1));
    const f2 = Math.round(
      clamp((p - TIMELINE.s2Start) / (TIMELINE.s2End - TIMELINE.s2Start)) * (s2.length - 1)
    );
    const mix = smooth(clamp((p - TIMELINE.hold1) / (TIMELINE.s2Start - TIMELINE.hold1)));

    ctx.globalAlpha = 1;
    if (mix < 1 && s1[f1]) {
      ctx.drawImage(s1[f1], 0, 0, FRAME_W, FRAME_H);
    }
    if (mix > 0 && s2[f2]) {
      ctx.globalAlpha = mix;
      ctx.drawImage(s2[f2], 0, 0, FRAME_W, FRAME_H);
      ctx.globalAlpha = 1;
    }
  }, [p, loaded]);

  useEffect(() => {
    const init = () => {
      try {
        if (!audio.current) {
          const AC =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AC) audio.current = new AC();
        }
        if (audio.current && audio.current.state === "suspended") {
          void audio.current.resume();
        }
      } catch {
        /* audio optional */
      }
    };
    window.addEventListener("pointerdown", init);
    window.addEventListener("keydown", init);
    return () => {
      window.removeEventListener("pointerdown", init);
      window.removeEventListener("keydown", init);
    };
  }, []);

  const beep = useCallback((freq = 1900, dur = 0.09) => {
    const ac = audio.current;
    if (!ac || ac.state !== "running") return;
    try {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ac.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.connect(g).connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + dur + 0.02);
    } catch {
      /* audio ignore */
    }
  }, []);

  const interactive = p >= TIMELINE.hold0 && p <= TIMELINE.hold1 + 0.02;
  const n = cart.length;
  const scanS = clamp((p - TIMELINE.scan0) / (TIMELINE.scan1 - TIMELINE.scan0));
  const itemU = (k: number) => (n ? clamp(scanS * n - k) : 0);
  const scannedCount = p >= TIMELINE.scan0 ? cart.filter((_, k) => itemU(k) >= 0.5).length : 0;
  const scanTotal = cart.slice(0, scannedCount).reduce((s, id) => s + byId(id).price, 0);
  const cartTotal = cart.reduce((s, id) => s + byId(id).price, 0);

  useEffect(() => {
    if (scannedCount > lastScanned.current) beep();
    if (scannedCount === n && n > 0 && lastScanned.current < n) {
      window.setTimeout(() => beep(1200, 0.18), 160);
    }
    lastScanned.current = scannedCount;
  }, [scannedCount, n, beep]);

  const addToCart = (id: string) => {
    setCart((c) => (c.includes(id) ? c : [...c, id]));
    setBump((b) => b + 1);
    beep(900, 0.06);
  };

  const removeFromCart = (id: string) => setCart((c) => c.filter((x) => x !== id));

  const toStage = (cx: number, cy: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return { x: 50, y: 50 };
    return { x: ((cx - r.left) / r.width) * 100, y: ((cy - r.top) / r.height) * 100 };
  };

  const inCartZone = (x: number, y: number) =>
    x > CART_ZONE.x0 && x < CART_ZONE.x1 && y > CART_ZONE.y0;

  const onDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (!interactive || cart.includes(id)) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragMeta.current = { id, sx: e.clientX, sy: e.clientY, moved: false };
    setDrag({ id, ...toStage(e.clientX, e.clientY) });
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = dragMeta.current;
    if (!m) return;
    if (Math.hypot(e.clientX - m.sx, e.clientY - m.sy) > 6) m.moved = true;
    if (m.moved) setDrag({ id: m.id, ...toStage(e.clientX, e.clientY) });
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = dragMeta.current;
    dragMeta.current = null;
    if (!m) return;
    const pt = toStage(e.clientX, e.clientY);
    if (m.moved && inCartZone(pt.x, pt.y)) addToCart(m.id);
    else if (!m.moved) setSelId((s) => (s === m.id ? null : m.id));
    setDrag(null);
  };

  const hoverOn = (id: string) => {
    window.clearTimeout(hoverTimer.current);
    setHoverId(id);
  };

  const hoverOff = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setHoverId(null), 260);
  };

  const scrollToP = (v: number) => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = findNearestScroller(root);
    const top = getElementTop(root, scroller);
    const vh = getViewportHeight(scroller);
    const travel = Math.max(1, root.offsetHeight - vh);
    const target = top + v * travel;
    if (scroller === window) {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      (scroller as HTMLElement).scrollTo({ top: target, behavior: "smooth" });
    }
  };

  const activeId = drag ? null : hoverId ?? selId;
  const transitioning = p > TIMELINE.pop - 0.01 && p < TIMELINE.hold1 + 0.01;
  const fadeShelf = smooth(clamp((p - TIMELINE.hold1) / 0.06));
  const sceneS = smooth(clamp((p - 0.46) / 0.14));
  const bagIn = smooth(clamp((p - (TIMELINE.scan0 - 0.035)) / 0.04));

  const toys = PRODUCTS.map((pr, idx) => {
    const k = cart.indexOf(pr.id);
    const isDrag = drag?.id === pr.id;
    let x = pr.x;
    let foot = pr.y + pr.pad * pr.side;
    let side = pr.side;
    let scale = 1;
    let opacity = 1;
    let z = 10;
    let trans = transitioning;
    let clickable = false;

    if (isDrag && drag) {
      x = drag.x;
      foot = drag.y + side * 0.5;
      side = pr.side * 1.12;
      z = 70;
      trans = false;
    } else if (k >= 0) {
      const slot = CART_SLOTS[k % CART_SLOTS.length];
      const cs = pr.side * 0.8 * (1 - 0.14 * sceneS);
      x = slot.x;
      foot = slot.y + pr.pad * cs;
      side = cs;
      z = 10 + k;
      clickable = interactive;
      if (p >= TIMELINE.scan0 && n) {
        const u = itemU(k);
        const sSide = pr.side * 0.82;
        const bSide = pr.side * 0.5;
        if (u > 0 && u < 1) z = 45;
        if (u > 0) {
          if (u < 0.35) {
            const a = smooth(u / 0.35);
            x = lerp(slot.x, SCANNER.x, a);
            foot = lerp(slot.y, SCANNER.y, a) - Math.sin(Math.PI * a) * 14;
            side = lerp(cs, sSide, a);
          } else if (u < 0.62) {
            x = SCANNER.x;
            foot = SCANNER.y;
            side = sSide;
          } else {
            const a = smooth((u - 0.62) / 0.38);
            const bx = BAG.x + ((k % 3) - 1) * 2.4;
            x = lerp(SCANNER.x, bx, a);
            foot = lerp(SCANNER.y, BAG.y, a) - Math.sin(Math.PI * a) * 16;
            side = lerp(sSide, bSide, a);
            if (u > 0.9) z = 22;
          }
          foot += pr.pad * side;
          if (u >= 1) z = 22;
        }
      }
      trans = transitioning;
    } else {
      const a = smooth(clamp((p - TIMELINE.pop - idx * 0.004) / 0.035));
      opacity = a * (1 - fadeShelf);
      scale = 0.55 + 0.45 * a;
      clickable = interactive;
      if (activeId === pr.id) {
        scale = 1.55;
        z = 50;
      } else if (activeId) {
        opacity *= 0.55;
      }
    }
    return { pr, x, foot, side, scale, opacity, z, trans, clickable, isDrag };
  });

  const active = activeId ? byId(activeId) : null;
  const panelLeft = !!active && active.x > 58;
  const stepIdx =
    p < TIMELINE.s1End ? 0 : p < TIMELINE.s2Start - 0.02 ? 1 : p < TIMELINE.done ? 2 : 3;
  const heroO = 1 - smooth(clamp(p / 0.07));
  const hintO =
    smooth(clamp((p - TIMELINE.hold0) / 0.02)) *
    (1 - smooth(clamp((p - TIMELINE.hold1 + 0.02) / 0.02)));
  const doneO = smooth(clamp((p - TIMELINE.done + 0.015) / 0.03));
  const ready = loaded > 1;

  const scanning =
    p >= TIMELINE.scan0 && n > 0
      ? cart.findIndex((_, k) => itemU(k) > 0.3 && itemU(k) < 0.66)
      : -1;
  const laserT = scanning >= 0 ? (itemU(scanning) - 0.3) / 0.36 : 0;

  return (
    <div
      ref={rootRef}
      className={`tsl-root overflow-x-clip ${isMobile ? "is-mobile" : isTablet ? "is-tablet" : ""}`}
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
      />
      <style>{CSS_STYLES}</style>

      <div className="tsl-sticky">
        <div className="tsl-stage" ref={stageRef}>
          {/* canvas-ok: 240-frame interactive store aisle and self-checkout canvas scrub */}
          <canvas ref={canvasRef} width={FRAME_W} height={FRAME_H} className="tsl-canvas" />
          <div className="tsl-dim" style={{ opacity: active ? 0.32 : 0 }} />

          <div
            className="tsl-zone"
            style={{
              left: `${CART_ZONE.x0}%`,
              width: `${CART_ZONE.x1 - CART_ZONE.x0}%`,
              top: `${CART_ZONE.y0 + 4}%`,
              height: `${96 - CART_ZONE.y0 - 2}%`,
              opacity: drag ? 1 : 0,
            }}
          >
            <span>Drop toy into basket</span>
          </div>

          <div
            className="tsl-kiosk"
            style={{ opacity: smooth(clamp((p - (TIMELINE.scan0 - 0.05)) / 0.03)) }}
          >
            <div className="tsl-kiosk-h">{STORE_NAME} / Self-Checkout</div>
            <ul>
              {cart.slice(0, scannedCount).map((id) => (
                <li key={id}>
                  <span>{byId(id).name}</span>
                  <b>{money(byId(id).price)}</b>
                </li>
              ))}
              {scannedCount === 0 && <li className="tsl-kiosk-wait">Scan barcode on glass</li>}
            </ul>
            <div className="tsl-kiosk-t">
              <span>Subtotal</span>
              <b>{money(scanTotal)}</b>
            </div>
          </div>

          <div
            className="tsl-laser"
            style={{
              opacity: scanning >= 0 ? 1 : 0,
              top: `${lerp(52.5, 57, 0.5 + 0.5 * Math.sin(laserT * Math.PI * 3))}%`,
            }}
          />

          <div
            className="tsl-bag"
            style={{ opacity: bagIn, transform: `scale(${0.6 + 0.4 * bagIn})` }}
          >
            <BagSvg part="back" />
          </div>

          {toys.map(({ pr, x, foot, side, scale, opacity, z, trans, clickable, isDrag }) => (
            <div
              key={pr.id}
              className={`tsl-toy${clickable ? " is-click" : ""}${isDrag ? " is-drag" : ""}${
                activeId === pr.id ? " is-active" : ""
              }`}
              style={{
                left: `${x}%`,
                top: `${foot}%`,
                width: `calc(var(--H) * ${side / 100})`,
                height: `calc(var(--H) * ${side / 100})`,
                transform: `translate(-50%,-100%) scale(${scale})`,
                opacity,
                zIndex: z,
                transition: trans
                  ? "left .75s cubic-bezier(.22,1.25,.36,1), top .75s cubic-bezier(.22,1.25,.36,1), width .5s, height .5s, transform .45s cubic-bezier(.2,.9,.2,1), opacity .3s"
                  : "none",
                pointerEvents: clickable || isDrag ? "auto" : "none",
              }}
              onPointerDown={(e) =>
                cart.includes(pr.id)
                  ? interactive && removeFromCart(pr.id)
                  : onDown(e, pr.id)
              }
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onPointerEnter={(e) =>
                e.pointerType === "mouse" && !cart.includes(pr.id) && hoverOn(pr.id)
              }
              onPointerLeave={(e) => e.pointerType === "mouse" && hoverOff()}
              title={cart.includes(pr.id) ? "Return to shelf" : undefined}
            >
              <img src={resolve(pr.img)} alt={pr.name} draggable={false} />
            </div>
          ))}

          <div
            className="tsl-bag tsl-bag-front"
            style={{ opacity: bagIn, transform: `scale(${0.6 + 0.4 * bagIn})` }}
          >
            <BagSvg part="front" />
          </div>
        </div>

        <header className="tsl-top">
          <button className="tsl-logo" onClick={() => scrollToP(0)}>
            {STORE_NAME}
          </button>
          <nav className="tsl-steps">
            {["01 Aisle", "02 Shelves", "03 Checkout", "04 Receipt"].map((s, i) => (
              <button
                key={s}
                className={i === stepIdx ? "on" : i < stepIdx ? "past" : ""}
                onClick={() => scrollToP([0.02, 0.36, 0.66, 0.99][i])}
              >
                <i />
                {s}
              </button>
            ))}
          </nav>
          <div className="tsl-cartpill" key={bump}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H6" />
            </svg>
            <span>{n}</span>
            <b>{money(cartTotal)}</b>
          </div>
        </header>

        <section
          className="tsl-hero"
          style={{
            opacity: heroO,
            pointerEvents: "none",
            transform: `translateY(${(1 - heroO) * -28}px)`,
          }}
        >
          <h1>{STORE_NAME}</h1>
          <p>The playground on the shelf. Scroll to walk the aisle.</p>
          <div className="tsl-scroll">
            <span>Scroll to browse</span>
            <i />
          </div>
        </section>

        <div className="tsl-hint" style={{ opacity: hintO }}>
          <span>Hover to inspect</span>
          <span>Drag or tap to fill basket</span>
          <span>Scroll down to checkout</span>
        </div>

        <aside
          className={`tsl-panel${active ? " show" : ""}${panelLeft ? " left" : ""}`}
          onPointerEnter={() => active && hoverOn(active.id)}
          onPointerLeave={hoverOff}
        >
          {active && (
            <>
              <div className="tsl-panel-img">
                <img src={resolve(active.img)} alt="" draggable={false} />
              </div>
              <span className="tsl-tag">{active.tag}</span>
              <h2>{active.name}</h2>
              <div className="tsl-price">{money(active.price)}</div>
              <p>{active.desc}</p>
              <div className="tsl-specs">
                {active.specs.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              {cart.includes(active.id) ? (
                <button className="tsl-btn ghost" onClick={() => removeFromCart(active.id)}>
                  In Cart / Tap to Return
                </button>
              ) : (
                <button
                  className="tsl-btn"
                  onClick={() => {
                    addToCart(active.id);
                    setSelId(null);
                    setHoverId(null);
                  }}
                >
                  Add to Basket
                </button>
              )}
              <small>or drag toy directly into cart</small>
            </>
          )}
        </aside>

        <section
          className="tsl-done"
          style={{
            opacity: doneO,
            pointerEvents: doneO > 0.6 ? "auto" : "none",
            transform: `translateY(${(1 - doneO) * 28}px)`,
          }}
        >
          {n > 0 ? (
            <>
              <h2>Order Complete</h2>
              <p>
                {n} {n === 1 ? "toy" : "toys"} packed in your store tote bag. Total:{" "}
                <b>{money(cartTotal)}</b>
              </p>
              <button
                className="tsl-btn"
                onClick={() => {
                  setCart([]);
                  scrollToP(0);
                }}
              >
                Shop Again
              </button>
            </>
          ) : (
            <>
              <h2>Your Cart is Empty</h2>
              <p>Return to the shelves and drop handcrafted toys into your basket.</p>
              <button className="tsl-btn" onClick={() => scrollToP(0.36)}>
                Back to Shelves
              </button>
            </>
          )}
        </section>

        <div className={`tsl-loader${ready ? " hide" : ""}`}>
          <div className="tsl-loader-name">{STORE_NAME}</div>
          <div className="tsl-bar">
            <i style={{ width: `${Math.min(loaded, 1) * 100}%` }} />
          </div>
          <span>Preparing store aisle... {Math.round(Math.min(loaded, 1) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

function BagSvg({ part }: { part: "back" | "front" }) {
  const gradId = useId();
  if (part === "back") {
    return (
      <svg viewBox="0 0 200 220" preserveAspectRatio="none">
        <path
          d="M68 40 C66 -8 134 -8 132 40"
          stroke="#ff7fb0"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M22 36 L178 36 L190 214 L10 214 Z" fill="#ffb3d1" />
        <ellipse cx="100" cy="42" rx="78" ry="11" fill="#4a2350" opacity="0.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 220" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6f0" />
          <stop offset="1" stopColor="#ffb3d1" />
        </linearGradient>
      </defs>
      <path
        d="M12 62 L188 62 L194 212 Q194 218 188 218 L12 218 Q6 218 6 212 Z"
        fill={`url(#${gradId})`}
      />
      <path d="M12 62 L188 62 L187 74 L13 74 Z" fill="#fff6f0" />
      <circle cx="100" cy="148" r="36" fill="#fff" opacity=".92" />
      <path
        d="M100 124 l6 13 14 2 -10 10 3 14 -13 -7 -13 7 3 -14 -10 -10 14 -2 z"
        fill="#ff7fb0"
      />
      <text
        x="100"
        y="196"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="#fff"
        fontFamily="var(--display)"
      >
        {STORE_NAME}
      </text>
    </svg>
  );
}

const CSS_STYLES = `
:root{
  --W:max(100vw,177.7778vh);
  --H:calc(var(--W)*.5625);
  --ink:#4a2350; --pink:#ff7fb0; --pink2:#ffb3d1; --sun:#ffd66b; --cream:#fff6f0;
  --display:'Fredoka',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
  --body:'Nunito',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
}
@media (orientation:portrait){ :root{ --W:100vw; } }
.tsl-root{position:relative;font-family:var(--body);color:var(--ink);background:var(--cream);}
.tsl-root *{box-sizing:border-box;}
.tsl-sticky{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--cream);}
.tsl-stage{position:absolute;left:50%;top:50%;width:var(--W);height:var(--H);transform:translate(-50%,-50%);}
.tsl-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}
.tsl-dim{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(60,20,70,.15),rgba(60,20,70,.7));transition:opacity .35s;pointer-events:none;z-index:5;}

.tsl-toy{position:absolute;transform-origin:50% 100%;touch-action:none;user-select:none;-webkit-user-select:none;}
.tsl-toy img{width:100%;height:100%;display:block;object-fit:contain;pointer-events:none;filter:drop-shadow(0 5px 6px rgba(60,30,60,.28));transition:filter .35s;}
.tsl-toy.is-click{cursor:grab;}
.tsl-toy.is-drag{cursor:grabbing;}
.tsl-toy.is-active img{filter:drop-shadow(0 18px 20px rgba(60,20,70,.45)) drop-shadow(0 0 22px rgba(255,255,255,.55));}

.tsl-zone{position:absolute;z-index:8;border:3px dashed rgba(255,255,255,.95);border-radius:28px;background:rgba(255,127,176,.22);
  box-shadow:0 0 0 6px rgba(255,127,176,.25),0 0 40px rgba(255,127,176,.6);transition:opacity .25s;pointer-events:none;display:flex;align-items:flex-start;justify-content:center;}
.tsl-zone span{margin-top:-1.1em;background:var(--pink);color:#fff;font-weight:800;padding:.35em 1.2em;border-radius:99px;font-size:calc(var(--W)*.0095);}

.tsl-bag{position:absolute;left:73.5%;top:35%;width:calc(var(--W)*.15);height:calc(var(--H)*.27);transform-origin:50% 100%;z-index:14;pointer-events:none;}
.tsl-bag svg{width:100%;height:100%;display:block;filter:drop-shadow(0 8px 8px rgba(60,20,70,.25));}
.tsl-bag-front{z-index:30;}
.tsl-laser{position:absolute;left:41%;width:14%;height:.35%;min-height:2px;background:#ff2d55;box-shadow:0 0 12px 4px rgba(255,45,85,.8);z-index:46;border-radius:9px;pointer-events:none;transition:opacity .12s;}

.tsl-kiosk{position:absolute;left:40.6%;top:14.2%;width:15.2%;height:16.4%;z-index:20;background:linear-gradient(160deg,#fff,#fff6f0);border-radius:.5vw;
  padding:.5% .8%;font-size:calc(var(--W)*.0072);line-height:1.25;color:var(--ink);display:flex;flex-direction:column;transform:perspective(600px) rotateY(-5deg) rotateX(2deg);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);pointer-events:none;overflow:hidden;}
.tsl-kiosk-h{font-weight:800;color:#fff;background:var(--pink);margin:-.5% -.8% 3%;padding:2% 4%;white-space:nowrap;}
.tsl-kiosk ul{list-style:none;margin:0;padding:0;flex:1;overflow:hidden;}
.tsl-kiosk li{display:flex;justify-content:space-between;gap:6px;border-bottom:1px dashed var(--pink2);padding:1.5% 0;white-space:nowrap;}
.tsl-kiosk li span{overflow:hidden;text-overflow:ellipsis;}
.tsl-kiosk-wait{color:var(--ink);opacity:.6;justify-content:center !important;border:0 !important;}
.tsl-kiosk-t{display:flex;justify-content:space-between;font-weight:800;font-size:1.25em;padding-top:2%;}

.tsl-top{position:absolute;z-index:100;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(14px,3vw,40px);pointer-events:none;gap:12px;}
.tsl-top>*{pointer-events:auto;}
.tsl-logo{font-family:var(--display);font-weight:700;font-size:24px;color:var(--ink);background:rgba(255,255,255,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:0;border-radius:99px;padding:8px 22px;cursor:pointer;box-shadow:0 6px 20px rgba(120,50,110,.15);}
.tsl-steps{display:flex;gap:4px;background:rgba(255,255,255,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:5px;border-radius:99px;box-shadow:0 6px 20px rgba(120,50,110,.15);}
.tsl-steps button{display:flex;align-items:center;gap:7px;border:0;background:transparent;font:700 13px var(--body);color:var(--ink);opacity:.65;padding:7px 14px;border-radius:99px;cursor:pointer;transition:.25s;}
.tsl-steps button i{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.5;}
.tsl-steps button.past{opacity:1;}
.tsl-steps button.on{background:var(--pink);color:#fff;opacity:1;}
.tsl-steps button.on i{opacity:1;}
.tsl-cartpill{display:flex;align-items:center;gap:9px;background:var(--ink);color:#fff;border-radius:99px;padding:9px 18px;font-weight:800;font-size:15px;box-shadow:0 6px 20px rgba(74,35,80,.35);animation:tslBump .45s;}
.tsl-cartpill span{background:var(--pink);border-radius:99px;min-width:22px;height:22px;display:grid;place-items:center;font-size:13px;}
@keyframes tslBump{0%{transform:scale(1)}35%{transform:scale(1.18)}100%{transform:scale(1)}}

.tsl-hero{position:absolute;z-index:60;left:0;right:0;top:20%;text-align:center;padding:0 20px;}
.tsl-hero h1{margin:0;font-family:var(--display);font-weight:700;font-size:clamp(54px,9vw,140px);line-height:1;color:var(--ink);text-shadow:0 0 30px rgba(255,255,255,.9),0 4px 0 rgba(255,255,255,.8);}
.tsl-hero p{margin:14px auto 0;max-width:540px;font-size:clamp(16px,1.8vw,24px);font-weight:700;color:var(--ink);text-shadow:0 0 18px #fff,0 0 8px #fff;}
.tsl-scroll{display:inline-flex;flex-direction:column;align-items:center;gap:8px;margin-top:32px;font-weight:800;font-size:14px;background:rgba(255,255,255,.85);padding:10px 20px 8px;border-radius:24px;box-shadow:0 6px 20px rgba(120,50,110,.12);}
.tsl-scroll i{width:12px;height:12px;border-right:3px solid var(--pink);border-bottom:3px solid var(--pink);transform:rotate(45deg);animation:tslDown 1.3s infinite;}
@keyframes tslDown{0%{transform:translateY(-3px) rotate(45deg);opacity:.2}60%{opacity:1}100%{transform:translateY(4px) rotate(45deg);opacity:.2}}

.tsl-hint{position:absolute;z-index:90;left:50%;top:84px;transform:translateX(-50%);display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:max-content;max-width:94vw;pointer-events:none;transition:opacity .3s;}
.tsl-hint span{background:rgba(74,35,80,.88);color:#fff;font-weight:700;font-size:13px;padding:8px 16px;border-radius:99px;}
.tsl-hint span:nth-child(3){background:var(--pink);}

.tsl-panel{position:absolute;z-index:95;top:50%;right:clamp(14px,3vw,44px);width:min(360px,86vw);transform:translate(40px,-50%);opacity:0;pointer-events:none;
  background:rgba(255,255,255,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-radius:32px;padding:92px 26px 22px;box-shadow:0 30px 70px rgba(74,35,80,.35),inset 0 0 0 1.5px rgba(255,255,255,.9);
  transition:opacity .35s,transform .45s cubic-bezier(.2,.9,.2,1);}
.tsl-panel.left{right:auto;left:clamp(14px,3vw,44px);transform:translate(-40px,-50%);}
.tsl-panel.show{opacity:1;transform:translate(0,-50%);pointer-events:auto;}
.tsl-panel-img{position:absolute;left:50%;top:-52px;width:140px;height:140px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,var(--pink2));box-shadow:0 14px 30px rgba(255,127,176,.5);display:grid;place-items:center;}
.tsl-panel-img img{width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 8px 8px rgba(60,20,70,.3));}
.tsl-tag{display:inline-block;background:var(--sun);color:var(--ink);font-weight:800;font-size:12px;letter-spacing:.04em;padding:4px 12px;border-radius:99px;}
.tsl-panel h2{margin:10px 0 2px;font-family:var(--display);font-weight:700;font-size:26px;line-height:1.15;}
.tsl-price{font-family:var(--display);font-weight:700;font-size:32px;color:var(--pink);}
.tsl-panel p{margin:10px 0 14px;font-size:14px;line-height:1.5;font-weight:600;color:var(--ink);opacity:.85;}
.tsl-specs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px;}
.tsl-specs span{background:#fff;border:1px solid var(--pink2);color:var(--ink);font-weight:800;font-size:12px;padding:5px 12px;border-radius:99px;}
.tsl-panel small{display:block;margin-top:10px;text-align:center;color:var(--ink);opacity:.6;font-weight:700;font-size:12px;}
.tsl-btn{width:100%;border:0;cursor:pointer;background:var(--pink);color:#fff;font:800 15px var(--body);padding:13px 20px;border-radius:18px;box-shadow:0 10px 24px rgba(255,127,176,.45);transition:transform .2s,box-shadow .2s;}
.tsl-btn:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(255,127,176,.55);}
.tsl-btn.ghost{background:#fff;border:1px solid var(--pink2);color:var(--ink);box-shadow:none;}

.tsl-done{position:absolute;z-index:96;left:50%;bottom:9%;width:min(440px,90vw);margin-left:calc(min(440px,90vw) / -2);text-align:center;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:30px;padding:26px 28px 28px;box-shadow:0 30px 70px rgba(74,35,80,.35);}
.tsl-done h2{margin:0 0 6px;font-family:var(--display);font-size:34px;}
.tsl-done p{margin:0 0 18px;font-weight:700;font-size:15px;color:var(--ink);opacity:.85;}

.tsl-loader{position:absolute;inset:0;z-index:200;background:var(--cream);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;transition:opacity .6s,visibility .6s;font-weight:800;}
.tsl-loader.hide{opacity:0;visibility:hidden;pointer-events:none;}
.tsl-loader-name{font-family:var(--display);font-weight:700;font-size:52px;}
.tsl-bar{width:min(320px,70vw);height:10px;border-radius:99px;background:#fff;box-shadow:inset 0 0 0 1px var(--pink2);overflow:hidden;}
.tsl-bar i{display:block;height:100%;background:var(--pink);border-radius:99px;transition:width .15s;}

@media (max-width:820px){
  .tsl-steps{display:none;}
  .tsl-logo{font-size:20px;padding:6px 14px;}
  .tsl-panel,.tsl-panel.left{top:auto;bottom:calc(env(safe-area-inset-bottom) + 12px);right:12px;left:12px;width:auto;padding:22px 20px 18px;transform:translateY(30px);}
  .tsl-panel.show{transform:none;}
  .tsl-panel-img{display:none;}
  .tsl-hint span{font-size:12px;padding:7px 12px;}
}
`;
