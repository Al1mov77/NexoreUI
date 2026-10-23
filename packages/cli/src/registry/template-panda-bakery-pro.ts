export const templatePandaBakeryPro = {
  name: "template-panda-bakery-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-panda-bakery-pro.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 240;
const frameUrl = (dir: "desktop" | "mobile", i: number) =>
  \`/frames/panda/\${dir}/frame_\${String(i + 1).padStart(3, "0")}.webp\`;

type Product = {
  id: string;
  name: string;
  price: number;
  note: string;
  at: number;
  tone: string;
  tag?: string;
  spec: string;
};

const PRODUCTS: Product[] = [
  {
    id: "bun",
    name: "Cinnamon Morning Bun",
    price: 4.5,
    note: "Ceylon cinnamon, flaky laminated dough, paw-twisted glaze",
    at: 0.12,
    tone: "#ffb867",
    tag: "Signature",
    spec: "Twice-Baked · Ceylon Spice",
  },
  {
    id: "croissant",
    name: "Golden Butter Croissant",
    price: 5.5,
    note: "81 laminated Normandy butter folds, crackles across the room",
    at: 0.6,
    tone: "#ff9a3c",
    tag: "Bestseller",
    spec: "Normandy Butter · 81 Layers",
  },
  {
    id: "box",
    name: "Morning Baker Box",
    price: 24.0,
    note: "6 warm pastries fresh from the first stone-hearth bake",
    at: 0.9,
    tone: "#ffd36b",
    tag: "Best Value",
    spec: "6 Pastries · Fresh Hearth Pull",
  },
  {
    id: "baguette",
    name: "Artisan French Baguette",
    price: 4.0,
    note: "Thin blistered crust, open honeycombed crumb structure",
    at: 0.45,
    tone: "#f2c48a",
    spec: "Slow Poolish · Crisp Crust",
  },
  {
    id: "eclair",
    name: "Madagascar Vanilla Éclair",
    price: 6.5,
    note: "Choux pastry filled with real vanilla bean cream & dark chocolate",
    at: 0.35,
    tone: "#ff8a5c",
    spec: "Bourbon Vanilla · Dark Cacao",
  },
  {
    id: "sour",
    name: "24-Hour Country Sourdough",
    price: 9.0,
    note: "Natural wild fermentation, caramelized crust, mild tang",
    at: 0.75,
    tone: "#e0a96d",
    tag: "Wild Starter",
    spec: "100% Organic Stoneground",
  },
];

const HERO_ITEMS = PRODUCTS.slice(0, 3);

const CHAPTERS = [
  { from: 0, title: "Crisp.", text: "The artisanal bakery where every batch is kneaded by a red panda." },
  { from: 0.25, title: "Knead.", text: "Dough rests for exactly as long as slow wild fermentation demands." },
  { from: 0.55, title: "Oven Fresh!", text: "Golden croissants emerge hot from the stone hearth every hour." },
  { from: 0.82, title: "Taste First.", text: "Grab your warm morning bag while steam is still rising." },
];

const MARQUEE = [
  "Fresh Every Morning",
  "Wild Sourdough Starter",
  "Baking Since 5:00 AM",
  "Hot From The Stone Hearth",
  "Crustcraft Bakery",
];

const STEPS = [
  {
    num: "01",
    title: "Select Your Batch",
    desc: "Pick your morning buns, flaky croissants, and sourdough boules straight from the hearth schedule.",
  },
  {
    num: "02",
    title: "Flash Hearth Finish",
    desc: "Your order receives a final 4-minute hearth reheat so every layer arrives crisp and fragrant.",
  },
  {
    num: "03",
    title: "Pick Up or Doorstep",
    desc: "Packed warm into double-lined thermal kraft bags, ready at the counter in 12 minutes.",
  },
];

const NUMS = [
  { val: "5:00 AM", label: "First stone deck oven fire and sourdough pull" },
  { val: "12 min", label: "From the hearth deck into your warm bag" },
  { val: "24 hr", label: "Slow cold fermentation for optimal digestibility" },
  { val: "0", label: "Frozen doughs or commercial pre-mixes ever used" },
];

const REVIEWS = [
  {
    name: "Claire Montgomery",
    quote: "Came for a single croissant, walked out with the full morning box and a promise to return tomorrow. The crust truly crackles across the courtyard.",
  },
  {
    name: "Julian Reed",
    quote: "The sourdough crumb structure is rivaled only by bakeries in rural France. Plus, watching the red panda at the wooden peel is pure morning joy.",
  },
  {
    name: "Elena Vance",
    quote: "Ordered three morning boxes for our design team meeting. Every single pastry was devoured in eight minutes flat. Flakiest lamination in town.",
  },
];

const GALLERY = [
  { frameIdx: 0, cap: "Hearth Stone Fire" },
  { frameIdx: 47, cap: "Flour & Lamination" },
  { frameIdx: 95, cap: "Wild Dough Proofing" },
  { frameIdx: 143, cap: "Golden Oven Rise" },
  { frameIdx: 191, cap: "Glazing & Sugar" },
  { frameIdx: 239, cap: "Hearth Pull Ready" },
];

const FAQ = [
  {
    q: "What time does the bakery open?",
    a: "Our doors open daily at 7:00 AM, with the very first stone-hearth sourdough pull emerging hot at 5:00 AM for neighborhood early risers.",
  },
  {
    q: "Can I schedule a pre-order for the morning?",
    a: "Yes. Choose your pastries online up to 48 hours in advance and pick up your warm bag at the counter without waiting in line.",
  },
  {
    q: "Do you offer gluten-sensitive options?",
    a: "On weekends we bake rice-flour cinnamon buns and almond financiers in a dedicated pastry zone with certified separate utensils.",
  },
  {
    q: "How does neighborhood courier delivery work?",
    a: "Our couriers deliver within a 5-mile radius in custom insulated thermal sleeves, arriving at your doorstep in under 45 minutes.",
  },
  {
    q: "Can I order catering for an office or event?",
    a: "Yes! For orders of 20 or more pastries, please give us 24 hours notice so our night bakers can proof extra sourdough and butter dough.",
  },
];

function findNearestScroller(el: HTMLElement | null): HTMLElement | Window {
  let curr = el?.parentElement ?? null;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    const style = window.getComputedStyle(curr);
    if (/(auto|scroll|overlay)/.test(style.overflowY)) {
      return curr;
    }
    curr = curr.parentElement;
  }
  return window;
}

export default function PandaBakeryTemplate({
  brandName = "CRUSTCRAFT",
  deviceMode = "desktop",
}: {
  brandName?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { brandName };
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const lastDrawn = useRef(-1);

  const [containerWidth, setContainerWidth] = useState(1280);
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string>("bun");
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth || window.innerWidth);
    return () => ro.disconnect();
  }, []);

  const mobile = deviceMode === "mobile" || containerWidth <= 768;
  const isTablet = deviceMode === "tablet" || (!mobile && containerWidth <= 1024);
  const dir: "desktop" | "mobile" = mobile ? "mobile" : "desktop";
  const brand = config.brandName || "CRUSTCRAFT";

  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  const sum = PRODUCTS.reduce((s, d) => s + (cart[d.id] || 0) * d.price, 0);

  const add = useCallback((id: string, n = 1) => {
    setDone(false);
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + n);
      if (next === 0) {
        const { [id]: _, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: next };
    });
    const item = PRODUCTS.find((p) => p.id === id);
    if (item && n > 0) {
      setToastText(\`Added to bag: \${item.name} ($\${item.price.toFixed(2)})\`);
    }
  }, []);

  useEffect(() => {
    if (!toastText) return;
    const timer = setTimeout(() => setToastText(null), 2400);
    return () => clearTimeout(timer);
  }, [toastText]);

  const draw = useCallback((idx: number) => {
    const c = canvasRef.current;
    const img = imgs.current[idx];
    if (!c || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (w === 0 || h === 0) return;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw = w;
    let dh = h;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
    } else {
      dw = w;
      dh = w / ir;
    }
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoaded(0);
    lastDrawn.current = -1;

    const list: HTMLImageElement[] = new Array(FRAME_COUNT);
    let doneCount = 0;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.src = frameUrl(dir, i);
        im.onload = () => {
          if (cancelled) return resolve();
          doneCount++;
          setLoaded(doneCount);
          if (i === 0) draw(0);
          resolve();
        };
        im.onerror = () => resolve();
        list[i] = im;
      });

    imgs.current = list;

    (async () => {
      await Promise.all(Array.from({ length: Math.min(16, FRAME_COUNT) }, (_, i) => loadOne(i)));
      const batch = 16;
      for (let i = 16; i < FRAME_COUNT && !cancelled; i += batch) {
        await Promise.all(
          Array.from({ length: Math.min(batch, FRAME_COUNT - i) }, (_, k) => loadOne(i + k))
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dir, draw]);

  useEffect(() => {
    let raf = 0;
    const scroller = findNearestScroller(rootRef.current);

    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const viewportH =
        scroller instanceof Window ? window.innerHeight : scroller.clientHeight;
      const scrollerTop =
        scroller instanceof Window ? 0 : scroller.getBoundingClientRect().top;
      const relativeTop = r.top - scrollerTop;
      const span = Math.max(1, el.offsetHeight - viewportH);
      target.current = Math.min(1, Math.max(0, -relativeTop / span));
    };

    const tick = () => {
      current.current += (target.current - current.current) * 0.1;
      if (Math.abs(target.current - current.current) < 0.0005) {
        current.current = target.current;
      }
      const p = current.current;
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))));
      if (idx !== lastDrawn.current) {
        draw(idx);
        lastDrawn.current = idx;
      }
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      lastDrawn.current = -1;
      onScroll();
    };

    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [draw, containerWidth]);

  const jumpTo = (p: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const scroller = findNearestScroller(rootRef.current);
    if (scroller instanceof Window) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * p, behavior: "smooth" });
    } else {
      const scrollerRect = scroller.getBoundingClientRect();
      const top = el.getBoundingClientRect().top - scrollerRect.top + scroller.scrollTop;
      const span = el.offsetHeight - scroller.clientHeight;
      scroller.scrollTo({ top: top + span * p, behavior: "smooth" });
    }
  };

  const scrollToMenu = () => {
    const root = rootRef.current;
    if (!root) return;
    const targetEl = root.querySelector("#menu") as HTMLElement | null;
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const chapter = [...CHAPTERS].reverse().find((c) => progress >= c.from) || CHAPTERS[0];
  const currentItem = PRODUCTS.find((d) => d.id === active) || PRODUCTS[0];
  const fade = Math.min(1, Math.max(0, (progress - 0.94) / 0.06));
  const ready = loaded >= FRAME_COUNT * 0.6;

  return (
    <div ref={rootRef} className="panda-root overflow-x-clip">
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');

        .panda-root {
          --cream: #fff6ea;
          --ink: #1c2b2d;
          --card: #ffffff;
          --alt: #ffecd2;
          --teal: #0f3a41;
          --orange: #ff9a3c;
          --orange-ink: #1c2b2d;
          --radius-lg: 24px;
          --radius-pill: 999px;

          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: var(--ink);
          background: var(--cream);
          min-height: 100vh;
        }

        @media (prefers-color-scheme: dark) {
          .panda-root {
            --cream: #0c1a1c;
            --ink: #fff6ea;
            --card: #13292c;
            --alt: #102326;
          }
        }
        .dark .panda-root {
          --cream: #0c1a1c;
          --ink: #fff6ea;
          --card: #13292c;
          --alt: #102326;
        }

        .bh-bar {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 30;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: calc(14px + env(safe-area-inset-top, 0px)) 20px 14px;
          color: #fff;
          max-width: 1240px;
          margin: 0 auto;
        }
        .bh-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
        }
        .bh-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 0 4px rgba(255, 154, 60, 0.3);
        }
        .bh-cart {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #1c2b2d;
          background: var(--orange);
          border: 0;
          border-radius: 999px;
          padding: 9px 16px;
          cursor: pointer;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .bh-cart:hover { filter: brightness(1.05); }
        .bh-cart:active { transform: scale(0.96); }

        .bh-wrap {
          height: \${mobile ? "380vh" : "420vh"};
          position: relative;
        }
        .bh-stage {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          background: linear-gradient(180deg, #10353b 0%, #154249 30%, #1f5760 62%, #4a7a7e 85%, #69979b 100%);
        }
        .bh-canvas {
          position: absolute;
          right: 0;
          top: \${mobile ? "calc(52px + env(safe-area-inset-top, 0px))" : "0"};
          left: \${mobile ? "0" : "auto"};
          height: \${mobile ? "auto" : "100%"};
          width: \${mobile ? "100%" : "72%"};
          aspect-ratio: \${mobile ? "19/18" : "auto"};
          object-fit: cover;
          -webkit-mask-image: \${
            mobile
              ? "linear-gradient(180deg, #000 72%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)"
          };
          mask-image: \${
            mobile
              ? "linear-gradient(180deg, #000 72%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)"
          };
        }

        .bh-copy {
          position: absolute;
          left: \${mobile ? "0" : "5vw"};
          right: \${mobile ? "0" : "auto"};
          top: \${mobile ? "auto" : "50%"};
          bottom: \${mobile ? "0" : "auto"};
          transform: \${mobile ? "none" : "translateY(-50%)"};
          width: \${mobile ? "auto" : "min(460px, 38vw)"};
          padding: \${mobile ? "0 18px calc(24px + env(safe-area-inset-bottom, 0px))" : "0"};
          color: #fff;
          z-index: 3;
        }
        .bh-copy h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: \${mobile ? "clamp(34px, 10vw, 48px)" : "clamp(48px, 5.5vw, 84px)"};
          line-height: 1;
          letter-spacing: -0.03em;
          margin: 0 0 14px;
        }
        .bh-copy p {
          font-size: \${mobile ? "15px" : "18px"};
          line-height: 1.5;
          margin: 0 0 20px;
          color: #d9eeee;
        }

        .bh-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .bh-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          background: rgba(7, 30, 34, 0.88);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 18px;
          padding: 14px 18px;
          backdrop-filter: blur(8px);
        }
        .bh-card strong {
          display: block;
          font-size: 16px;
        }
        .bh-card span {
          font-size: 13px;
          opacity: 0.82;
        }

        .bh-btn {
          font-family: inherit;
          font-weight: 700;
          font-size: 14px;
          border-radius: 999px;
          padding: 11px 18px;
          border: 2px solid #fff;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease;
          min-height: 44px;
          white-space: nowrap;
        }
        .bh-btn:active { transform: scale(0.96); }
        .bh-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .bh-btn.solid {
          background: var(--orange);
          border-color: var(--orange);
          color: #1c2b2d;
        }
        .bh-btn.solid:hover { filter: brightness(1.05); }
        .bh-btn.ghost {
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.28);
        }
        .bh-btn.ghost:hover { background: rgba(255, 255, 255, 0.24); }

        .bh-hint {
          position: absolute;
          bottom: 26px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 13px;
          letter-spacing: 0.04em;
          transition: opacity 0.3s;
          z-index: 3;
        }
        .bh-line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
        }
        .bh-line i {
          display: block;
          height: 100%;
          background: var(--orange);
          transform-origin: left;
        }
        .bh-loader {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 20px;
          z-index: 5;
          background: #10353b;
        }

        /* Marquee */
        .marq {
          background: var(--orange);
          color: #1c2b2d;
          overflow: hidden;
          border-block: 3px solid #1c2b2d;
        }
        .marq > div {
          display: flex;
          width: max-content;
          animation: mq 32s linear infinite;
        }
        .marq span {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(22px, 3.4vw, 44px);
          padding: 16px 26px;
          white-space: nowrap;
          letter-spacing: -0.02em;
        }
        @keyframes mq {
          to { transform: translateX(-50%); }
        }

        /* Section Layouts */
        .sec {
          padding: 96px 5vw;
          max-width: 1200px;
          margin: 0 auto;
        }
        .alt {
          background: var(--alt);
          max-width: none;
        }
        .alt > * {
          max-width: 1100px;
          margin-inline: auto;
        }
        .sec h2, .cta h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(30px, 4.8vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin: 0 0 36px;
        }

        /* Rail / Carousel */
        .rail {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 16px;
          -webkit-overflow-scrolling: touch;
        }
        .hit {
          flex: 0 0 min(290px, 78vw);
          scroll-snap-align: start;
          background: var(--card);
          border: 2px solid var(--ink);
          border-radius: 26px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .pic {
          height: 150px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 19px;
          color: #1c2b2d;
          text-align: center;
          padding: 12px;
          border: 1px solid rgba(28, 43, 45, 0.12);
        }
        .hit p {
          margin: 14px 0;
          opacity: 0.85;
          font-size: 14px;
          line-height: 1.45;
          min-height: 44px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(28, 43, 45, 0.1);
        }
        .row b {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
        }
        .qty {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sec .bh-btn, .faq .bh-btn {
          border-color: var(--ink);
        }
        .sec .bh-btn.solid {
          background: var(--ink);
          color: var(--cream);
        }
        .sec .bh-btn.ghost {
          color: var(--ink);
          border-color: rgba(28, 43, 45, 0.35);
        }
        .order {
          margin-top: 28px;
        }

        /* Steps */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .step b {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(56px, 8vw, 110px);
          line-height: 1;
          color: var(--orange);
          display: block;
        }
        .step h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 22px;
          margin: 10px 0 8px;
        }
        .step p {
          font-size: 15px;
          line-height: 1.55;
          color: var(--ink);
          opacity: 0.88;
          margin: 0;
        }

        /* Numbers */
        .nums {
          background: var(--orange);
          color: #1c2b2d;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 72px 5vw;
        }
        .nums b {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(40px, 5.5vw, 76px);
          line-height: 1;
          margin-bottom: 8px;
        }
        .nums span {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.4;
        }

        /* Reviews Sticky Stack */
        .stack {
          position: relative;
        }
        .rev {
          position: sticky;
          margin: 0 0 28px;
          background: var(--card);
          border: 2px solid var(--ink);
          border-radius: 28px;
          padding: 32px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }
        .rev p {
          font-size: clamp(17px, 2.2vw, 24px);
          line-height: 1.4;
          font-weight: 600;
          margin: 0 0 16px;
        }
        .rev cite {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.04em;
          font-style: normal;
          color: var(--orange);
        }

        /* Gallery */
        .gal {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .gal figure {
          margin: 0;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 4/5;
          background: #154249;
          border: 2px solid var(--ink);
        }
        .gal img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .gal figure:hover img {
          transform: scale(1.06);
        }
        .gal figcaption {
          position: absolute;
          left: 12px;
          bottom: 12px;
          background: #fff;
          color: #1c2b2d;
          border-radius: 999px;
          padding: 6px 14px;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }

        /* FAQ */
        .faq {
          max-width: 860px;
        }
        details {
          border-bottom: 2px solid var(--ink);
          padding: 20px 0;
        }
        summary {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(17px, 2vw, 22px);
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        summary::-webkit-details-marker { display: none; }
        summary::after {
          content: "+";
          font-size: 26px;
          line-height: 1;
          color: var(--orange);
          font-weight: 700;
        }
        details[open] summary::after {
          content: "−";
        }
        details p {
          margin: 14px 0 0;
          opacity: 0.88;
          max-width: 65ch;
          line-height: 1.6;
          font-size: 15px;
        }

        /* CTA */
        .cta {
          background: var(--teal);
          color: #fff6ea;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 32px;
          align-items: center;
          padding: 90px 5vw;
          overflow: hidden;
        }
        .cta p {
          font-size: 18px;
          margin: 0 0 24px;
          max-width: 40ch;
          line-height: 1.55;
          color: #d9eeee;
        }
        .cta img {
          width: 100%;
          border-radius: 28px;
          display: block;
          border: 2px solid rgba(255, 255, 255, 0.16);
        }
        .cta .bh-btn.solid {
          background: var(--orange);
          color: #1c2b2d;
        }

        /* Footer */
        .ft {
          background: #081f23;
          color: #fff6ea;
          padding: 80px 5vw calc(28px + env(safe-area-inset-bottom, 0px));
        }
        .ft .big {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(52px, 16vw, 240px);
          line-height: 0.88;
          color: var(--orange);
          margin-bottom: 56px;
          letter-spacing: -0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-align: center;
        }
        .ft .cols {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .ft h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 14px;
          color: var(--orange);
        }
        .ft p {
          margin: 0;
          line-height: 1.7;
          opacity: 0.88;
          font-size: 14px;
        }
        .ft a {
          color: inherit;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .ft a:hover {
          color: var(--orange);
        }
        .sub {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .sub input {
          flex: 1 1 150px;
          min-height: 44px;
          border-radius: 999px;
          border: 2px solid rgba(255, 246, 234, 0.3);
          background: transparent;
          color: #fff6ea;
          padding: 0 16px;
          font: inherit;
          font-size: 14px;
        }
        .sub input:focus {
          outline: none;
          border-color: var(--orange);
        }
        .ft .bh-btn {
          border-color: var(--orange);
        }
        .copy {
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 246, 234, 0.18);
          font-size: 13px;
          opacity: 0.75;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .sec { padding: 64px 20px; }
          .steps { grid-template-columns: 1fr; }
          .nums { grid-template-columns: 1fr 1fr; padding: 56px 20px; gap: 20px; }
          .gal { grid-template-columns: 1fr 1fr; }
          .cta { grid-template-columns: 1fr; padding: 64px 20px; }
          .ft .cols { grid-template-columns: 1fr 1fr; }
          .rev { top: 76px !important; }
          .bh-hint { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .marq > div { animation: none; }
        }
      \`}</style>

      {/* Header Bar */}
      <header className="bh-bar">
        <div className="bh-logo">
          <span className="bh-logo-dot" />
          <b>{brand}</b>
        </div>
        <button type="button" className="bh-cart" onClick={scrollToMenu}>
          Bag · {total} {total > 0 ? \`· $\${sum.toFixed(2)}\` : ""}
        </button>
      </header>

      {/* Floating Add-to-bag Toast */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 60,
              background: "#1c2b2d",
              color: "#fff",
              border: "1px solid rgba(255, 154, 60, 0.5)",
              borderRadius: 16,
              padding: "12px 18px",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 18px 38px rgba(0,0,0,0.35)",
            }}
          >
            {toastText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO WITH 240-FRAME SCROLL CANVAS */}
      <div ref={wrapRef} className="bh-wrap">
        <section className="bh-stage" style={{ opacity: 1 - fade * 0.4 }}>
          <canvas ref={canvasRef} className="bh-canvas" aria-label="Red panda baker kneading dough" />
          {!ready && (
            <div className="bh-loader">
              Heating the hearth… {Math.round((loaded / FRAME_COUNT) * 100)}%
            </div>
          )}

          <div className="bh-copy">
            <h1>{chapter.title}</h1>
            <p>{chapter.text}</p>
            <div className="bh-chips">
              {HERO_ITEMS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={\`bh-btn \${active === d.id ? "solid" : "ghost"}\`}
                  onClick={() => {
                    setActive(d.id);
                    jumpTo(d.at);
                  }}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div className="bh-card">
              <div>
                <strong>
                  {currentItem.name} · \${currentItem.price.toFixed(2)}
                </strong>
                <span>{currentItem.note}</span>
              </div>
              <button
                type="button"
                className="bh-btn solid"
                onClick={() => add(currentItem.id)}
              >
                Add to Bag
              </button>
            </div>
          </div>

          <div className="bh-hint" style={{ opacity: progress < 0.03 ? 1 : 0 }}>
            Scroll — the panda bakes
          </div>
          <div className="bh-line">
            <i style={{ transform: \`scaleX(\${progress})\` }} />
          </div>
        </section>
      </div>

      {/* 2. INFINITE MARQUEE */}
      <div className="marq" aria-hidden>
        <div>
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>{t} ✦</span>
          ))}
        </div>
      </div>

      {/* 3. BAKERY HITS (CAROUSEL / RAIL) */}
      <section id="menu" className="sec">
        <h2>Bakery Hits & Loaves</h2>
        <div className="rail">
          {PRODUCTS.map((d) => (
            <article key={d.id} className="hit">
              <div>
                <div
                  className="pic"
                  style={{
                    background: \`radial-gradient(circle at 30% 30%, #fff 0, \${d.tone} 65%)\`,
                  }}
                >
                  {d.name}
                </div>
                <div style={{ marginTop: 12 }}>
                  {d.tag && (
                    <span
                      style={{
                        background: "var(--orange)",
                        color: "#1c2b2d",
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {d.tag}
                    </span>
                  )}
                  <p>{d.note}</p>
                </div>
              </div>

              <div className="row">
                <b>\${d.price.toFixed(2)}</b>
                <div className="qty">
                  <button
                    type="button"
                    className="bh-btn ghost"
                    style={{ minHeight: 36, padding: "6px 12px" }}
                    aria-label="Decrease quantity"
                    onClick={() => add(d.id, -1)}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 800, minWidth: 20, textAlign: "center" }}>
                    {cart[d.id] || 0}
                  </span>
                  <button
                    type="button"
                    className="bh-btn solid"
                    style={{ minHeight: 36, padding: "6px 12px" }}
                    aria-label="Increase quantity"
                    onClick={() => add(d.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="order">
          <button
            type="button"
            className="bh-btn solid"
            disabled={!total}
            onClick={() => {
              setDone(true);
              setToastText("Order received — hearth is firing up!");
            }}
          >
            {done
              ? "Order accepted — firing the hearth!"
              : total
              ? \`Checkout Bag · \${total} items · $\${sum.toFixed(2)}\`
              : "Select pastries to order"}
          </button>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="sec alt">
        <h2>How It Works</h2>
        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.num} className="step">
              <b>{s.num}</b>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BY THE NUMBERS */}
      <section className="nums">
        {NUMS.map((n) => (
          <div key={n.label}>
            <b>{n.val}</b>
            <span>{n.label}</span>
          </div>
        ))}
      </section>

      {/* 6. REVIEWS STICKY STACK */}
      <section className="sec">
        <h2>Guest Table Notes</h2>
        <div className="stack">
          {REVIEWS.map((r, i) => (
            <blockquote key={r.name} className="rev" style={{ top: 90 + i * 20 }}>
              <p>“{r.quote}”</p>
              <cite>— {r.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* 7. KITCHEN LIFE GALLERY */}
      <section className="sec alt">
        <h2>From the Hearth Floor</h2>
        <div className="gal">
          {GALLERY.map((g) => (
            <figure key={g.cap}>
              <img
                src={frameUrl("desktop", g.frameIdx)}
                alt={g.cap}
                loading="lazy"
              />
              <figcaption>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="sec faq">
        <h2>Frequently Asked Questions</h2>
        {FAQ.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="cta">
        <div>
          <h2>While It's Still Warm.</h2>
          <p>
            Lock in your morning batch online, and our panda baker will flash-bake your pastries to arrive crisp and golden.
          </p>
          <button type="button" className="bh-btn solid" onClick={scrollToMenu}>
            Order Pastry Bag
          </button>
        </div>
        <img
          src={frameUrl("desktop", FRAME_COUNT - 1)}
          alt="Red panda baker with fresh baked croissants"
          loading="lazy"
        />
      </section>

      {/* 10. BESPOKE 4-COLUMN FOOTER */}
      <footer className="ft">
        <div className="big" aria-hidden>
          {brand}
        </div>
        <div className="cols">
          <div>
            <h4>Bakehouses</h4>
            <p>
              1204 NW 23rd Ave, Portland, OR
              <br />
              3420 SE Division St, Portland, OR
            </p>
          </div>
          <div>
            <h4>Hearth Hours</h4>
            <p>
              Daily 07:00 — 20:00
              <br />
              First sourdough pull at 05:00 AM
            </p>
          </div>
          <div>
            <h4>Dispatch & Social</h4>
            <p>
              <a href="#instagram">Instagram @crustcraft</a>
              <br />
              <a href="#tiktok">TikTok @pandabakes</a>
              <br />
              <a href="#journal">Weekly Baker Journal</a>
            </p>
          </div>
          <div>
            <h4>Morning Dispatch</h4>
            <div className="sub">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
              />
              <button
                type="button"
                className="bh-btn solid"
                onClick={() => {
                  if (email) {
                    setToastText(\`Subscribed \${email} to morning dispatch!\`);
                    setEmail("");
                  }
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="copy">
          <span>© 2026 {brand} Artisanal Bakery. All rights reserved.</span>
          <span>240 frames 60fps stone-hearth video scrub · Never frozen</span>
        </div>
      </footer>
    </div>
  );
}
`,
};
