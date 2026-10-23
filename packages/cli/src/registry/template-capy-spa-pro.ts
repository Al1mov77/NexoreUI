export const templateCapySpaPro = {
  name: "template-capy-spa-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-capy-spa-pro.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 240;
const frameUrl = (dir: "desktop" | "mobile", i: number) =>
  \`/frames/capy/\${dir}/frame_\${String(i + 1).padStart(3, "0")}.webp\`;
const fallbackFrameUrl = (dir: "desktop" | "mobile", i: number) =>
  \`/frames/\${dir}/frame_\${String(i + 1).padStart(3, "0")}.webp\`;

type RitualCategory = "baths" | "massage" | "suites";

type Service = {
  id: string;
  name: string;
  price: number;
  note: string;
  at: number;
  category: RitualCategory;
  tag?: string;
  duration: string;
  temp: string;
  icon: "onsen" | "steam" | "stones" | "citrus" | "tea" | "bamboo";
};

const HERO_SERVICES: Service[] = [
  {
    id: "massage",
    name: "Stone Massage",
    price: 95,
    note: "Warm river basalt & wild cedar oil · 60 min",
    at: 0.12,
    category: "massage",
    tag: "Deep Rest",
    duration: "60 minutes · private room",
    temp: "Basalt 52 °C",
    icon: "stones",
  },
  {
    id: "sauna",
    name: "Yuzu Cedar Soak",
    price: 75,
    note: "Outdoor hinoki tub with fresh citrus & herbal tea",
    at: 0.45,
    category: "baths",
    tag: "House Ritual",
    duration: "90 minutes · garden deck",
    temp: "Soak 41 °C",
    icon: "onsen",
  },
  {
    id: "day",
    name: "Full Day Sanctuary",
    price: 165,
    note: "Massage, steam room, yuzu bath & quiet tea lounge",
    at: 0.8,
    category: "suites",
    tag: "Complete Reset",
    duration: "4 hours · private suite",
    temp: "Steam 75 °C + Yuzu",
    icon: "citrus",
  },
];

const CATALOG_SERVICES: Service[] = [
  ...HERO_SERVICES,
  {
    id: "hinoki-soak",
    name: "Hinoki Cypress Mineral Bath",
    price: 110,
    note: "Steaming spring water infused with whole yuzu fruit, Siberian pine needles, and sea salt",
    at: 0.45,
    category: "baths",
    tag: "Seasonal Harvest",
    duration: "75 minutes · moss garden",
    temp: "Water 40.5 °C",
    icon: "citrus",
  },
  {
    id: "eucalyptus-steam",
    name: "Eucalyptus & Silver Fir Steam",
    price: 120,
    note: "Two-round guided botanical thermal wave with cold spring drench and birch whisking",
    at: 0.3,
    category: "baths",
    duration: "80 minutes · steam master",
    temp: "Soft Steam 70 °C",
    icon: "steam",
  },
  {
    id: "lymph-bamboo",
    name: "Warm Bamboo & Shiatsu Bodywork",
    price: 115,
    note: "Slow myofascial release for neck and shoulders using heated bamboo stalks and acupressure",
    at: 0.12,
    category: "massage",
    duration: "75 minutes · silent suite",
    temp: "Lemongrass Oil",
    icon: "bamboo",
  },
  {
    id: "couple-retreat",
    name: " Sanctuary for Two · Quiet Moss",
    price: 260,
    note: "Private open-air cedar tub terrace, side-by-side basalt stone massage, and aged white tea",
    at: 0.8,
    category: "suites",
    tag: "For Two",
    duration: "180 minutes · private wing",
    temp: "Tub + Hearth",
    icon: "tea",
  },
  {
    id: "sound-float",
    name: "Evening Magnesium Float & Bowls",
    price: 88,
    note: "Zero-gravity warm Epsom soak accompanied by live Tibetan singing bowls and roasted barley tea",
    at: 0.65,
    category: "suites",
    duration: "60 minutes · after 7 PM",
    temp: "Water 36.8 °C",
    icon: "onsen",
  },
];

const CHAPTERS = [
  { from: 0, title: "Stillness.", text: "The thermal sanctuary where nobody is in a rush." },
  { from: 0.25, title: "Step In.", text: "A steaming cedar tub infused with whole yuzu citrus." },
  { from: 0.55, title: "Warmth.", text: "Shoulders drop, and your phone stays locked away." },
  { from: 0.82, title: "Exhale.", text: "Book for tonight — your waffle robe is already warm." },
];

const SANCTUARY_NOTES = [
  { val: "41 °C", label: "Outdoor cedar soaking tubs heated year-round under open sky" },
  { val: "0 dB", label: "Whisper-quiet sanctuary policy — phones rest in your locker safe" },
  { val: "15 min", label: "Unrushed buffer between guests for fresh water and air turnover" },
  { val: "100%", label: "Wild-harvested cedarwood, silver fir, and whole Japanese yuzu" },
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

function SpaIcon({ type, className = "w-7 h-7" }: { type: Service["icon"]; className?: string }) {
  switch (type) {
    case "onsen":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 15c0 3.5 3.6 6 8 6s8-2.5 8-6H4Z" />
          <path d="M8 11c0-1.5 1.2-2.2 1.2-3.8S8 5 8 5" />
          <path d="M12 11c0-1.5 1.2-2.2 1.2-3.8S12 5 12 5" />
          <path d="M16 11c0-1.5 1.2-2.2 1.2-3.8S16 5 16 5" />
        </svg>
      );
    case "stones":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <ellipse cx="12" cy="17" rx="8" ry="3.5" />
          <ellipse cx="12" cy="11.5" rx="6" ry="2.8" />
          <ellipse cx="12" cy="6.8" rx="3.8" ry="2" />
        </svg>
      );
    case "citrus":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="13" r="8" />
          <circle cx="12" cy="13" r="2" />
          <path d="M12 5v6M12 15v6M4 13h6M14 13h6M15 3c1.5 0 3 1 3 2.5" />
        </svg>
      );
    case "steam":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M7 18c-2-2.5 2-4.5 0-7" />
          <path d="M12 19c-2-3 2-5 0-8" />
          <path d="M17 18c-2-2.5 2-4.5 0-7" />
          <path d="M4 21h16" />
        </svg>
      );
    case "tea":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 11h11v4a5.5 5.5 0 0 1-11 0v-4Z" />
          <path d="M16 12h2a2 2 0 0 1 0 4h-2" />
          <path d="M4 20h13" />
          <path d="M9 8V6M12 8V5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 3v18M15 3v18" />
          <path d="M7 8h4M7 15h4M13 11h4M13 17h4" />
        </svg>
      );
  }
}

export default function CapySpaTemplate({
  brandName = "CEDARSOAK",
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
  const [active, setActive] = useState<string>("massage");
  const [activeCategory, setActiveCategory] = useState<"all" | RitualCategory>("all");
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
  const brand = config.brandName || "CEDARSOAK";
  const accentColor = "#ffd24a";

  const total = Object.entries(cart).reduce(
    (s, [id, n]) => s + (CATALOG_SERVICES.find((d) => d.id === id)?.price ?? 0) * n,
    0
  );
  const count = Object.values(cart).reduce((s, n) => s + n, 0);

  const addService = useCallback((service: Service) => {
    setCart((c) => ({ ...c, [service.id]: (c[service.id] ?? 0) + 1 }));
    setToastText(\`Reserved: \${service.name} ($\${service.price})\`);
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
    const dir = mobile ? "mobile" : "desktop";
    let cancelled = false;
    setLoaded(0);
    lastDrawn.current = -1;

    const list: HTMLImageElement[] = new Array(FRAME_COUNT);
    let done = 0;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.src = frameUrl(dir, i);
        im.onload = () => {
          if (cancelled) return resolve();
          done++;
          setLoaded(done);
          if (i === 0) draw(0);
          resolve();
        };
        im.onerror = () => {
          if (!im.dataset.retriedFallback) {
            im.dataset.retriedFallback = "1";
            im.src = fallbackFrameUrl(dir, i);
            return;
          }
          resolve();
        };
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
  }, [mobile, draw]);

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

  const jumpTo = (id: string) => {
    const s = HERO_SERVICES.find((d) => d.id === id);
    const el = wrapRef.current;
    if (!s || !el) return;
    setActive(id);

    const scroller = findNearestScroller(rootRef.current);
    if (scroller instanceof Window) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * s.at, behavior: "smooth" });
    } else {
      const scrollerRect = scroller.getBoundingClientRect();
      const top = el.getBoundingClientRect().top - scrollerRect.top + scroller.scrollTop;
      const span = el.offsetHeight - scroller.clientHeight;
      scroller.scrollTo({ top: top + span * s.at, behavior: "smooth" });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const root = rootRef.current;
    if (!root) return;
    const targetEl = root.querySelector(\`#\${sectionId}\`) as HTMLElement | null;
    if (!targetEl) return;
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chapter = [...CHAPTERS].reverse().find((c) => progress >= c.from) ?? CHAPTERS[0];
  const currentService = HERO_SERVICES.find((d) => d.id === active) ?? HERO_SERVICES[0];
  const heroFade = Math.min(1, Math.max(0, (progress - 0.88) / 0.12));

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return CATALOG_SERVICES;
    return CATALOG_SERVICES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div ref={rootRef} className="capy-root overflow-x-clip">
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap');

        .capy-root {
          --bg-top: #82a08b;
          --bg-mid: #a3bca8;
          --bg-bot: #d8e3d6;
          --page: #f5f3ec;
          --surface: #ffffff;
          --surface-alt: #e7ede5;
          --ink: #1f3a2c;
          --ink-soft: #556b5d;
          --accent: #1f3a2c;
          --accent-ink: #f5f3ec;
          --warm: \${accentColor};
          --radius-lg: 22px;
          --radius-pill: 999px;
          --shadow: 0 18px 44px -16px rgba(26, 48, 36, 0.22);

          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: var(--ink);
          background: var(--page);
          min-height: 100vh;
        }
        @media (prefers-color-scheme: dark) {
          .capy-root {
            --page: #132019;
            --surface: #1b2c23;
            --surface-alt: #22382c;
            --ink: #e9efe9;
            --ink-soft: #9bb0a1;
            --accent: #d8e3d6;
            --accent-ink: #132019;
          }
        }
        .dark .capy-root {
          --page: #132019;
          --surface: #1b2c23;
          --surface-alt: #22382c;
          --ink: #e9efe9;
          --ink-soft: #9bb0a1;
          --accent: #d8e3d6;
          --accent-ink: #132019;
        }

        .capy-nav {
          position: fixed;
          top: 14px;
          left: 16px;
          right: 16px;
          z-index: 30;
          max-width: 1240px;
          margin: 0 auto;
          padding: 10px 14px 10px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: var(--radius-pill);
          background: rgba(245, 243, 236, 0.78);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(31, 58, 44, 0.12);
          color: #1f3a2c;
        }
        .capy-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 17px;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .capy-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--warm);
          box-shadow: 0 0 0 4px rgba(255, 210, 74, 0.32);
        }
        .capy-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .capy-nav-link {
          background: transparent;
          border: 0;
          color: #365343;
          font-family: inherit;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .capy-nav-link:hover {
          background: rgba(31, 58, 44, 0.08);
          color: #1f3a2c;
        }

        .capy-wrap {
          position: relative;
          height: \${mobile ? "380vh" : "420vh"};
        }
        .capy-sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-mid) 52%, var(--bg-bot) 100%);
        }
        .capy-stage {
          position: absolute;
          inset: 0;
          left: \${mobile ? "0" : "28%"};
          bottom: \${mobile ? "38%" : "0"};
          mask-image: \${
            mobile
              ? "linear-gradient(180deg, #000 78%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)"
          };
          -webkit-mask-image: \${
            mobile
              ? "linear-gradient(180deg, #000 78%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)"
          };
        }
        .capy-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .capy-grid {
          position: relative;
          z-index: 2;
          height: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: \${mobile ? "72px 16px 18px" : "96px 28px 36px"};
          display: flex;
          flex-direction: column;
          justify-content: \${mobile ? "flex-end" : "center"};
        }
        .capy-col {
          max-width: \${mobile ? "100%" : "490px"};
          color: #1f3a2c;
        }
        .capy-step {
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2f5240;
          margin-bottom: 10px;
        }
        .capy-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: \${mobile ? "clamp(32px, 8vw, 42px)" : "clamp(50px, 5vw, 72px)"};
          line-height: 1;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
        }
        .capy-lead {
          font-size: \${mobile ? "15px" : "18px"};
          line-height: 1.5;
          color: #2f4a3b;
          margin: 0 0 \${mobile ? "14px" : "22px"};
        }

        .capy-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .capy-card {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(31, 58, 44, 0.14);
          border-radius: var(--radius-lg);
          padding: \${mobile ? "14px 16px" : "18px 20px"};
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          box-shadow: var(--shadow);
        }
        .capy-card-name {
          font-weight: 800;
          font-size: 17px;
          color: #1f3a2c;
        }
        .capy-card-note {
          font-size: 13px;
          color: #4f6658;
          margin-top: 2px;
        }
        .capy-card-price {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 21px;
          color: #1f3a2c;
          white-space: nowrap;
        }

        .capy-btn {
          appearance: none;
          border: 1px solid transparent;
          border-radius: var(--radius-pill);
          padding: \${mobile ? "10px 15px" : "11px 18px"};
          font-family: inherit;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }
        .capy-btn:active { transform: scale(0.97); }
        .capy-btn--primary {
          background: #1f3a2c;
          color: #f5f3ec;
        }
        .capy-btn--primary:hover { background: #294b39; }
        .capy-btn--warm {
          background: var(--warm);
          color: #2b2308;
        }
        .capy-btn--warm:hover { filter: brightness(1.04); }
        .capy-btn--secondary {
          background: var(--accent);
          color: var(--accent-ink);
        }
        .capy-btn--ghost {
          background: rgba(255, 255, 255, 0.55);
          color: #1f3a2c;
          border-color: rgba(31, 58, 44, 0.16);
        }
        .capy-btn--ghost[data-active="true"] {
          background: #1f3a2c;
          color: #f5f3ec;
          border-color: #1f3a2c;
        }

        .capy-progress {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 12px;
          height: 3px;
          background: rgba(31, 58, 44, 0.18);
          border-radius: 99px;
          overflow: hidden;
          z-index: 3;
        }
        .capy-progress > i {
          display: block;
          height: 100%;
          background: #1f3a2c;
        }
        .capy-fade {
          position: absolute;
          inset: 0;
          background: var(--page);
          pointer-events: none;
          z-index: 4;
        }
      \`}</style>

      <header className="capy-nav">
        <div className="capy-logo">
          <span className="capy-logo-dot" />
          {brand}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(31, 58, 44, 0.08)",
              color: "#1f3a2c",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            THERMAL SANCTUARY
          </span>
        </div>

        {!mobile && (
          <nav className="capy-nav-links">
            <button type="button" className="capy-nav-link" onClick={() => scrollToSection("capy-rituals")}>
              Rituals & Soaks
            </button>
            <button type="button" className="capy-nav-link" onClick={() => scrollToSection("capy-sanctuary")}>
              Stillness Etiquette
            </button>
            <button type="button" className="capy-nav-link" onClick={() => scrollToSection("capy-cta")}>
              Private Suites
            </button>
          </nav>
        )}

        <Btn variant="primary" onClick={() => scrollToSection("capy-rituals")}>
          {count > 0 ? \`Bookings (\${count}) · $\${total}\` : "Book Ritual"}
        </Btn>
      </header>

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
              background: "#1f3a2c",
              color: "#f5f3ec",
              border: "1px solid rgba(255, 210, 74, 0.55)",
              borderRadius: 16,
              padding: "12px 18px",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 18px 38px rgba(26,48,36,0.35)",
            }}
          >
            {toastText}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={wrapRef} className="capy-wrap">
        <div className="capy-sticky">
          <div className="capy-stage">
            <canvas ref={canvasRef} className="capy-canvas" />
          </div>

          <div className="capy-grid">
            <div className="capy-col">
              <span className="capy-step">
                {loaded < 16 ? \`Drawing the bath \${Math.round((loaded / 16) * 100)}%\` : "Scroll — the capybara steps in"}
              </span>
              <h1 className="capy-h1">{chapter.title}</h1>
              <p className="capy-lead">{chapter.text}</p>

              <div className="capy-tabs" role="tablist" aria-label="Treatments">
                {HERO_SERVICES.map((d) => (
                  <Btn
                    key={d.id}
                    variant="ghost"
                    active={active === d.id}
                    onClick={() => jumpTo(d.id)}
                  >
                    {d.name} · \${d.price}
                  </Btn>
                ))}
              </div>

              <div className="capy-card">
                <div>
                  <div className="capy-card-name">{currentService.name}</div>
                  <div className="capy-card-note">{currentService.note}</div>
                </div>
                <div className="capy-card-price">\${currentService.price}</div>
                <Btn variant="warm" onClick={() => addService(currentService)}>
                  Book Ritual
                </Btn>
              </div>
            </div>
          </div>

          <div className="capy-progress">
            <i style={{ width: \`\${progress * 100}%\` }} />
          </div>
          <div className="capy-fade" style={{ opacity: heroFade }} />
        </div>
      </div>

      {/* Sanctuary Standards */}
      <section
        id="capy-sanctuary"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: mobile ? "56px 16px 24px" : "88px 28px 36px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {SANCTUARY_NOTES.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                padding: "24px 22px",
                border: "1px solid rgba(31, 58, 44, 0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(26px, 3vw, 34px)",
                  fontWeight: 800,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                {item.val}
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.45 }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filterable 8-Item Thermal Rituals & Baths Catalog */}
      <section
        id="capy-rituals"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: mobile ? "36px 16px 64px" : "56px 28px 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            alignItems: mobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                marginBottom: 8,
              }}
            >
              THERMAL MENU · CEDAR & YUZU
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(28px, 3.8vw, 44px)",
                lineHeight: 1.06,
                margin: 0,
              }}
            >
              Treatments & Soaking Tubs
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              background: "var(--surface-alt)",
              padding: 6,
              borderRadius: 999,
            }}
          >
            {(
              [
                { id: "all", label: "All Rituals (8)" },
                { id: "baths", label: "Cedar Tubs & Steam" },
                { id: "massage", label: "Stone & Bodywork" },
                { id: "suites", label: "Day Suites" },
              ] as const
            ).map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    border: 0,
                    borderRadius: 999,
                    padding: "9px 16px",
                    fontFamily: "inherit",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    background: isSelected ? "var(--accent)" : "transparent",
                    color: isSelected ? "var(--accent-ink)" : "var(--ink-soft)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: mobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((d) => {
              const qty = cart[d.id] ?? 0;
              return (
                <motion.div
                  layout
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: "var(--surface)",
                    borderRadius: "var(--radius-lg)",
                    padding: 22,
                    border: "1px solid rgba(31, 58, 44, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 18,
                    boxShadow: "0 10px 28px -18px rgba(31, 58, 44, 0.15)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        height: 120,
                        borderRadius: 16,
                        background:
                          "linear-gradient(135deg, rgba(130, 160, 139, 0.22), rgba(255, 210, 74, 0.18))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        marginBottom: 16,
                        color: "var(--ink)",
                      }}
                    >
                      {d.tag && (
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            background: "var(--warm)",
                            color: "#2b2308",
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "4px 9px",
                            borderRadius: 999,
                          }}
                        >
                          {d.tag}
                        </span>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--ink-soft)",
                          background: "var(--surface)",
                          padding: "3px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {d.temp}
                      </span>
                      <SpaIcon type={d.icon} className="w-11 h-11" />
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--ink-soft)",
                        marginBottom: 4,
                      }}
                    >
                      {d.duration}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.25 }}>{d.name}</div>
                    <div
                      style={{
                        color: "var(--ink-soft)",
                        fontSize: 13.5,
                        lineHeight: 1.45,
                        marginTop: 6,
                      }}
                    >
                      {d.note}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 12,
                      borderTop: "1px solid rgba(31, 58, 44, 0.08)",
                    }}
                  >
                    <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }}>
                      \${d.price}
                    </strong>
                    {qty === 0 ? (
                      <Btn variant="secondary" onClick={() => addService(d)}>
                        Book Ritual
                      </Btn>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Btn
                          variant="secondary"
                          onClick={() =>
                            setCart((c) => {
                              const next = (c[d.id] ?? 0) - 1;
                              if (next <= 0) {
                                const { [d.id]: _, ...rest } = c;
                                return rest;
                              }
                              return { ...c, [d.id]: next };
                            })
                          }
                        >
                          −
                        </Btn>
                        <span style={{ fontWeight: 800, minWidth: 20, textAlign: "center" }}>
                          {qty}
                        </span>
                        <Btn variant="warm" onClick={() => addService(d)}>
                          +
                        </Btn>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Full-Width Thermal Sanctuary CTA Banner */}
      <section
        id="capy-cta"
        style={{
          padding: mobile ? "0 16px 64px" : "0 28px 96px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            borderRadius: 28,
            background: "linear-gradient(135deg, #1f3a2c 0%, #2d513e 58%, #476d57 100%)",
            color: "#f5f3ec",
            padding: mobile ? "36px 24px" : "60px 56px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            alignItems: mobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: 32,
            boxShadow: "0 28px 60px -20px rgba(26, 48, 36, 0.38)",
          }}
        >
          <motion.svg
            viewBox="0 0 200 200"
            animate={{ rotate: progress * 360 }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            style={{
              position: "absolute",
              right: mobile ? -60 : -40,
              bottom: mobile ? -60 : -50,
              width: mobile ? 220 : 300,
              height: mobile ? 220 : 300,
              opacity: 0.14,
              pointerEvents: "none",
            }}
          >
            <circle cx="100" cy="100" r="86" stroke="#ffd24a" strokeWidth="6" fill="none" strokeDasharray="16 12" />
            <circle cx="100" cy="100" r="62" stroke="#f5f3ec" strokeWidth="4" fill="none" />
            <path d="M100 26v148M26 100h148M48 48l104 104M152 48L48 152" stroke="#ffd24a" strokeWidth="3" />
          </motion.svg>

          <div style={{ maxWidth: 620, position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 210, 74, 0.18)",
                color: "#ffd24a",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              PRIVATE GARDEN DECKS · UNRUSHED SESSIONS
            </div>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(26px, 3.6vw, 42px)",
                lineHeight: 1.08,
                margin: "0 0 14px",
              }}
            >
              Your open-air cedar tub is already heated to 41 °C
            </h3>
            <p
              style={{
                margin: 0,
                color: "rgba(245, 243, 236, 0.84)",
                fontSize: 16,
                lineHeight: 1.55,
              }}
            >
              We draw fresh mineral water with whole yuzu citrus and silver fir boughs before every arrival. Heavy waffle robes, cedar sandals, and a pot of roasted oolong await in your dressing suite.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: mobile ? "stretch" : "flex-end",
              gap: 12,
              position: "relative",
              zIndex: 2,
              width: mobile ? "100%" : "auto",
            }}
          >
            <Btn
              variant="warm"
              onClick={() => {
                if (count === 0) addService(HERO_SERVICES[1]);
                else setToastText(\`Reservation for \${count} ritual(s) ($\${total}) confirmed!\`);
              }}
            >
              {count > 0
                ? \`Complete Booking · $\${total}\`
                : "Reserve Cedar Soak · $75"}
            </Btn>
            <span style={{ fontSize: 12, color: "rgba(245, 243, 236, 0.72)" }}>
              Free rescheduling up to 4 hours before your soak
            </span>
          </div>
        </div>
      </section>

      {/* Bespoke 4-Column Bathhouse Sanctuary Footer */}
      <footer
        style={{
          background: "#16291f",
          color: "#9bb0a1",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: mobile ? "48px 16px 36px" : "72px 28px 48px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: mobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "1.6fr 1fr 1fr 1.2fr",
            gap: 36,
            paddingBottom: 44,
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div>
            <div className="capy-logo" style={{ color: "#f5f3ec", marginBottom: 14 }}>
              <span className="capy-logo-dot" />
              {brand}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 320 }}>
              Quiet thermal bathhouse with open-air cedar soaking tubs, warm river basalt bodywork, and a moss-garden tea room.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "5px 10px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#f5f3ec",
                }}
              >
                09:00 — 23:00 DAILY
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "5px 10px",
                  borderRadius: 8,
                  background: "rgba(255, 210, 74, 0.16)",
                  color: "#ffd24a",
                }}
              >
                41 °C YUZU CEDAR TUBS
              </span>
            </div>
          </div>

          <div>
            <h4
              style={{
                color: "#f5f3ec",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Thermal Zones
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li>Open-Air Red Cedar Tubs</li>
              <li>Hinoki Cypress Mineral Baths</li>
              <li>Silver Fir Soft Steam Room</li>
              <li>Heated Basalt Stone Lounge</li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#f5f3ec",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Guest Care
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li>Linen-Bound Gift Vouchers</li>
              <li>Private Terrace for Two</li>
              <li>Oolong & Botanical Tea Menu</li>
              <li>Silent Sanctuary Etiquette</li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#f5f3ec",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Garden & Address
            </h4>
            <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 12px", color: "#d8e3d6" }}>
              2140 Forest Park Terrace, Hillside Gate, Portland, OR 97210
            </p>
            <div style={{ fontSize: 13, color: "#9bb0a1" }}>
              Private courtyard arrival · surrounded by old-growth firs
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1240,
            margin: "24px auto 0",
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 13,
          }}
        >
          <span>© 2026 {brand} Thermal Sanctuary. All rights reserved.</span>
          <span>240-frame smooth scroll sequence · Your robe is already warm</span>
        </div>
      </footer>
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "warm" | "secondary" | "ghost";
  active?: boolean;
};

function Btn({ variant = "primary", active, children, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={\`capy-btn capy-btn--\${variant}\`}
      {...rest}
    >
      {children}
    </button>
  );
}
`,
};
