"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FRAME_COUNT = 240;
const frameUrl = (dir: "desktop" | "mobile", i: number) =>
  `/frames/bear/${dir}/frame_${String(i + 1).padStart(3, "0")}.webp`;
const fallbackFrameUrl = (dir: "desktop" | "mobile", i: number) =>
  `/frames/${dir}/frame_${String(i + 1).padStart(3, "0")}.webp`;

type PlanCategory = "passes" | "coaching" | "programs";

type Plan = {
  id: string;
  name: string;
  price: number;
  note: string;
  at: number;
  category: PlanCategory;
  tag?: string;
  duration: string;
  spec: string;
  icon: "barbell" | "kettlebell" | "plate" | "chalk" | "stopwatch" | "platform";
};

const HERO_PLANS: Plan[] = [
  {
    id: "single",
    name: "Drop-In",
    price: 18,
    note: "Full floor access, coach warm-up & dry cedar sauna",
    at: 0.12,
    category: "passes",
    tag: "Start Here",
    duration: "1 visit · no time limit",
    spec: "Platform + Sauna",
    icon: "kettlebell",
  },
  {
    id: "month",
    name: "Monthly",
    price: 95,
    note: "Unlimited lifting + 2 form checks with the bear coach",
    at: 0.45,
    category: "passes",
    tag: "Most Popular",
    duration: "30 days · 06:00–24:00",
    spec: "Unlimited + 2 Reviews",
    icon: "barbell",
  },
  {
    id: "year",
    name: "Annual",
    price: 790,
    note: "All-inclusive club key with 60-day travel freeze",
    at: 0.8,
    category: "passes",
    tag: "Best Value",
    duration: "365 days + 60d freeze",
    spec: "Private Locker",
    icon: "plate",
  },
];

const CATALOG_ITEMS: Plan[] = [
  ...HERO_PLANS,
  {
    id: "snatch-camp",
    name: "Olympic Snatch & Clean · 8 Wks",
    price: 260,
    note: "Triple-extension mechanics, turnover speed, and block pulls in a 6-lifter squad",
    at: 0.55,
    category: "programs",
    tag: "Cycle",
    duration: "24 sessions · Mon/Wed/Fri",
    spec: "Video Bar Path",
    icon: "platform",
  },
  {
    id: "personal-bear",
    name: "1-on-1 Coaching Block · 10",
    price: 420,
    note: "Custom strength programming, velocity tracking, and cueing on every working set",
    at: 0.45,
    category: "coaching",
    tag: "1-on-1",
    duration: "10 sessions · 75 min each",
    spec: "Eleiko 20/15 kg Bars",
    icon: "barbell",
  },
  {
    id: "morning-pack",
    name: "Morning Lifter Pack · 12",
    price: 78,
    note: "Open platform entry before 4 PM, full competition kettlebell rack, and cold plunge",
    at: 0.12,
    category: "passes",
    duration: "12 visits · 06:00–16:00",
    spec: "Open Platforms",
    icon: "kettlebell",
  },
  {
    id: "power-trio",
    name: "Squat · Bench · Pull · 12 Wks",
    price: 320,
    note: "Percentage-based strength block culminating in a Saturday mock meet on calibrated steel",
    at: 0.8,
    category: "programs",
    tag: "Peak Block",
    duration: "36 sessions · 90 min",
    spec: "Calibrated Plates",
    icon: "plate",
  },
  {
    id: "technique-check",
    name: "Overhead Mobility & Bar Path Audit",
    price: 55,
    note: "Thoracic, ankle, and hip screening with a personalized barbell warm-up protocol",
    at: 0.3,
    category: "coaching",
    duration: "90 minutes · assessment",
    spec: "Protocol + Video",
    icon: "stopwatch",
  },
];

const CHAPTERS = [
  { from: 0, title: "Snatch.", text: "The barbell club where form comes before ego." },
  { from: 0.25, title: "Hook Grip.", text: "Heels planted, lats locked, eyes straight ahead." },
  { from: 0.55, title: "Drive!", text: "Explosive hip extension and the bar floats weightless." },
  { from: 0.82, title: "Locked Out.", text: "Step onto the platform for your first session today." },
];

const STATS = [
  { val: "12", label: "Competition oak-and-rubber lifting platforms with drop zones" },
  { val: "0.25 kg", label: "Fractional change plates for steady, joint-safe progression" },
  { val: "6 max", label: "Athletes per coached barbell group so every rep gets feedback" },
  { val: "92 °C", label: "Dry Nordic cedar sauna and cold shower recovery room" },
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

function GymIcon({ type, className = "w-7 h-7" }: { type: Plan["icon"]; className?: string }) {
  switch (type) {
    case "barbell":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 12h20" />
          <rect x="4" y="6" width="3" height="12" rx="1" />
          <rect x="17" y="6" width="3" height="12" rx="1" />
          <path d="M2 9v6M22 9v6" />
        </svg>
      );
    case "kettlebell":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          <path d="M6.5 11.5a6.5 6.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0Z" />
          <path d="M9.5 14h5" />
        </svg>
      );
    case "plate":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
        </svg>
      );
    case "platform":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polygon points="3 15 12 10 21 15 12 20 3 15" />
          <polyline points="3 18 12 23 21 18" />
          <path d="M8 13l4-2 4 2" />
        </svg>
      );
    case "stopwatch":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M10 2h4M12 2v3M19 6l1.5-1.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      );
  }
}

export function BearLiftPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
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
  const [active, setActive] = useState<string>("single");
  const [activeCategory, setActiveCategory] = useState<"all" | PlanCategory>("all");
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
  const brand = config.brandName || "KODIAK";
  const accentColor = "#ffd23f";

  const total = Object.entries(cart).reduce(
    (s, [id, n]) => s + (CATALOG_ITEMS.find((d) => d.id === id)?.price ?? 0) * n,
    0
  );
  const count = Object.values(cart).reduce((s, n) => s + n, 0);

  const addItem = useCallback((item: Plan) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }));
    setToastText(`Added: ${item.name} (+$${item.price})`);
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

  const jumpTo = (planId: string) => {
    const p = HERO_PLANS.find((d) => d.id === planId);
    const el = wrapRef.current;
    if (!p || !el) return;
    setActive(planId);

    const scroller = findNearestScroller(rootRef.current);
    if (scroller instanceof Window) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * p.at, behavior: "smooth" });
    } else {
      const scrollerRect = scroller.getBoundingClientRect();
      const top = el.getBoundingClientRect().top - scrollerRect.top + scroller.scrollTop;
      const span = el.offsetHeight - scroller.clientHeight;
      scroller.scrollTo({ top: top + span * p.at, behavior: "smooth" });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const root = rootRef.current;
    if (!root) return;
    const targetEl = root.querySelector(`#${sectionId}`) as HTMLElement | null;
    if (!targetEl) return;
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chapter = [...CHAPTERS].reverse().find((c) => progress >= c.from) ?? CHAPTERS[0];
  const currentPlan = HERO_PLANS.find((d) => d.id === active) ?? HERO_PLANS[0];
  const heroFade = Math.min(1, Math.max(0, (progress - 0.88) / 0.12));

  const filteredCatalog = useMemo(() => {
    if (activeCategory === "all") return CATALOG_ITEMS;
    return CATALOG_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div ref={rootRef} className="bear-root overflow-x-clip">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');

        .bear-root {
          --bg-top: #2b4986;
          --bg-mid: #4b6ea9;
          --bg-bot: #6c94c4;
          --page: #f4f7fb;
          --surface: #ffffff;
          --surface-alt: #e9eff8;
          --ink: #0f1d35;
          --ink-soft: #4e607d;
          --accent: ${accentColor};
          --accent-ink: #1a1608;
          --radius-lg: 22px;
          --radius-md: 14px;
          --radius-pill: 999px;
          --shadow: 0 18px 44px -14px rgba(13, 28, 56, 0.32);

          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: var(--ink);
          background: var(--page);
          min-height: 100vh;
        }
        @media (prefers-color-scheme: dark) {
          .bear-root {
            --page: #0c1628;
            --surface: #14223b;
            --surface-alt: #1a2d4d;
            --ink: #eef3fb;
            --ink-soft: #97a9c6;
          }
        }
        .dark .bear-root {
          --page: #0c1628;
          --surface: #14223b;
          --surface-alt: #1a2d4d;
          --ink: #eef3fb;
          --ink-soft: #97a9c6;
        }

        .bear-nav {
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
          background: rgba(20, 38, 72, 0.58);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #fff;
        }
        .bear-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bear-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(255, 210, 63, 0.25);
        }
        .bear-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bear-nav-link {
          background: transparent;
          border: 0;
          color: rgba(255, 255, 255, 0.84);
          font-family: inherit;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .bear-nav-link:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }

        .bear-wrap {
          position: relative;
          height: ${mobile ? "380vh" : "420vh"};
        }
        .bear-sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-mid) 55%, var(--bg-bot) 100%);
        }
        .bear-stage {
          position: absolute;
          inset: 0;
          left: ${mobile ? "0" : "24%"};
          bottom: ${mobile ? "38%" : "0"};
          mask-image: ${
            mobile
              ? "linear-gradient(180deg, #000 78%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)"
          };
          -webkit-mask-image: ${
            mobile
              ? "linear-gradient(180deg, #000 78%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)"
          };
        }
        .bear-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .bear-grid {
          position: relative;
          z-index: 2;
          height: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: ${mobile ? "72px 16px 18px" : "96px 28px 36px"};
          display: flex;
          flex-direction: column;
          justify-content: ${mobile ? "flex-end" : "center"};
        }
        .bear-col {
          max-width: ${mobile ? "100%" : "490px"};
          color: #fff;
        }
        .bear-step {
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 10px;
        }
        .bear-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: ${mobile ? "clamp(32px, 8vw, 42px)" : "clamp(52px, 5.4vw, 76px)"};
          line-height: 0.98;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
          text-shadow: 0 8px 28px rgba(15, 29, 53, 0.35);
        }
        .bear-lead {
          font-size: ${mobile ? "15px" : "18px"};
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 ${mobile ? "14px" : "22px"};
        }

        .bear-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .bear-card {
          background: rgba(15, 29, 53, 0.56);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: ${mobile ? "14px 16px" : "18px 20px"};
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          box-shadow: var(--shadow);
        }
        .bear-card-name {
          font-weight: 800;
          font-size: 17px;
        }
        .bear-card-note {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.78);
          margin-top: 2px;
        }
        .bear-card-price {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: var(--accent);
          white-space: nowrap;
        }

        .bear-btn {
          appearance: none;
          border: 1px solid transparent;
          border-radius: var(--radius-pill);
          padding: ${mobile ? "10px 15px" : "11px 18px"};
          font-family: inherit;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }
        .bear-btn:active { transform: scale(0.97); }
        .bear-btn--primary {
          background: var(--accent);
          color: var(--accent-ink);
        }
        .bear-btn--primary:hover { filter: brightness(1.05); }
        .bear-btn--secondary {
          background: var(--ink);
          color: var(--surface);
        }
        .bear-btn--secondary:hover { opacity: 0.9; }
        .bear-btn--ghost {
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.24);
        }
        .bear-btn--ghost[data-active="true"] {
          background: #fff;
          color: #16294a;
          border-color: #fff;
        }

        .bear-progress {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 12px;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 99px;
          overflow: hidden;
          z-index: 3;
        }
        .bear-progress > i {
          display: block;
          height: 100%;
          background: var(--accent);
        }
        .bear-fade {
          position: absolute;
          inset: 0;
          background: var(--page);
          pointer-events: none;
          z-index: 4;
        }
      `}</style>

      <header className="bear-nav">
        <div className="bear-logo">
          <span className="bear-logo-dot" />
          {brand}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.14)",
              color: "#ffd23f",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            BARBELL CLUB
          </span>
        </div>

        {!mobile && (
          <nav className="bear-nav-links">
            <button type="button" className="bear-nav-link" onClick={() => scrollToSection("bear-catalog")}>
              Passes & Cycles
            </button>
            <button type="button" className="bear-nav-link" onClick={() => scrollToSection("bear-standards")}>
              Platform Spec
            </button>
            <button type="button" className="bear-nav-link" onClick={() => scrollToSection("bear-cta")}>
              First Session
            </button>
          </nav>
        )}

        <Btn variant="primary" onClick={() => scrollToSection("bear-catalog")}>
          {count > 0 ? `Passes (${count}) · $${total}` : "Book Pass"}
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
              background: "#0f1d35",
              color: "#fff",
              border: "1px solid rgba(255, 210, 63, 0.45)",
              borderRadius: 16,
              padding: "12px 18px",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 18px 38px rgba(15,29,53,0.45)",
            }}
          >
            {toastText}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={wrapRef} className="bear-wrap">
        <div className="bear-sticky">
          <div className="bear-stage">
            <canvas ref={canvasRef} className="bear-canvas" />
          </div>

          <div className="bear-grid">
            <div className="bear-col">
              <span className="bear-step">
                {loaded < 16 ? `Warming up ${Math.round((loaded / 16) * 100)}%` : "Scroll — the bear lifts"}
              </span>
              <h1 className="bear-h1">{chapter.title}</h1>
              <p className="bear-lead">{chapter.text}</p>

              <div className="bear-tabs" role="tablist" aria-label="Passes">
                {HERO_PLANS.map((d) => (
                  <Btn
                    key={d.id}
                    variant="ghost"
                    active={active === d.id}
                    onClick={() => jumpTo(d.id)}
                  >
                    {d.name} · ${d.price}
                  </Btn>
                ))}
              </div>

              <div className="bear-card">
                <div>
                  <div className="bear-card-name">{currentPlan.name}</div>
                  <div className="bear-card-note">{currentPlan.note}</div>
                </div>
                <div className="bear-card-price">${currentPlan.price}</div>
                <Btn variant="primary" onClick={() => addItem(currentPlan)}>
                  Book Pass
                </Btn>
              </div>
            </div>
          </div>

          <div className="bear-progress">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="bear-fade" style={{ opacity: heroFade }} />
        </div>
      </div>

      {/* Floor & Equipment Standards */}
      <section
        id="bear-standards"
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
          {STATS.map((st, idx) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                padding: "24px 22px",
                border: "1px solid rgba(15, 29, 53, 0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(26px, 3vw, 34px)",
                  fontWeight: 800,
                  color: "#2b4986",
                  marginBottom: 8,
                }}
              >
                {st.val}
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.45 }}>
                {st.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filterable 8-Item Passes & Strength Cycles Catalog */}
      <section
        id="bear-catalog"
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
                color: "#2b4986",
                marginBottom: 8,
              }}
            >
              PLATFORM ROSTER · 2026 SEASON
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(28px, 3.8vw, 44px)",
                lineHeight: 1.06,
                margin: 0,
              }}
            >
              Passes & Strength Cycles
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
                { id: "all", label: "All Formats (8)" },
                { id: "passes", label: "Club Passes" },
                { id: "programs", label: "Barbell Cycles" },
                { id: "coaching", label: "1-on-1 Coaching" },
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
                    background: isSelected ? "var(--ink)" : "transparent",
                    color: isSelected ? "var(--surface)" : "var(--ink-soft)",
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
            {filteredCatalog.map((d) => {
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
                    border: "1px solid rgba(15, 29, 53, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 18,
                    boxShadow: "0 10px 28px -18px rgba(15, 29, 53, 0.16)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        height: 120,
                        borderRadius: 16,
                        background:
                          "linear-gradient(135deg, rgba(43, 73, 134, 0.12), rgba(255, 210, 63, 0.16))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        marginBottom: 16,
                        color: "#2b4986",
                      }}
                    >
                      {d.tag && (
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            background: "var(--accent)",
                            color: "var(--accent-ink)",
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
                        {d.spec}
                      </span>
                      <GymIcon type={d.icon} className="w-11 h-11" />
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
                      borderTop: "1px solid rgba(15, 29, 53, 0.08)",
                    }}
                  >
                    <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }}>
                      ${d.price}
                    </strong>
                    {qty === 0 ? (
                      <Btn variant="secondary" onClick={() => addItem(d)}>
                        Book Pass
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
                        <Btn variant="primary" onClick={() => addItem(d)}>
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

      {/* Full-Width Barbell Club CTA Banner */}
      <section
        id="bear-cta"
        style={{
          padding: mobile ? "0 16px 64px" : "0 28px 96px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            borderRadius: 28,
            background: "linear-gradient(135deg, #1b315d 0%, #2b4986 60%, #3d63ab 100%)",
            color: "#fff",
            padding: mobile ? "36px 24px" : "60px 56px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            alignItems: mobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: 32,
            boxShadow: "0 28px 60px -20px rgba(15, 29, 53, 0.45)",
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
              opacity: 0.12,
              pointerEvents: "none",
            }}
          >
            <circle cx="100" cy="100" r="88" stroke="#ffd23f" strokeWidth="10" fill="none" strokeDasharray="24 14" />
            <circle cx="100" cy="100" r="56" stroke="#ffffff" strokeWidth="6" fill="none" />
            <circle cx="100" cy="100" r="22" stroke="#ffd23f" strokeWidth="8" fill="none" />
          </motion.svg>

          <div style={{ maxWidth: 620, position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 210, 63, 0.18)",
                color: "#ffd23f",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              OPEN PLATFORM CLINIC · EVERY SATURDAY AT 11:00 AM
            </div>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(26px, 3.6vw, 42px)",
                lineHeight: 1.08,
                margin: "0 0 14px",
              }}
            >
              Dial in your snatch bar path and working percentages in 60 minutes
            </h3>
            <p
              style={{
                margin: 0,
                color: "rgba(255, 255, 255, 0.84)",
                fontSize: 16,
                lineHeight: 1.55,
              }}
            >
              Competition chalk, loaner weightlifting shoes in every size, PVC mobility prep, and live video bar-path breakdown with Coach Kodiak are included in every intro visit.
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
              variant="primary"
              onClick={() => {
                if (count === 0) addItem(HERO_PLANS[0]);
                else setToastText(`Reservation for ${count} pass(es) ($${total}) confirmed!`);
              }}
            >
              {count > 0
                ? `Complete Booking · $${total}`
                : "Book Drop-In Session · $18"}
            </Btn>
            <span style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.72)" }}>
              No auto-renew traps · freeze anytime in one click
            </span>
          </div>
        </div>
      </section>

      {/* Bespoke 4-Column Barbell Club Footer */}
      <footer
        style={{
          background: "#0f1d35",
          color: "#97a9c6",
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
            <div className="bear-logo" style={{ color: "#fff", marginBottom: 14 }}>
              <span className="bear-logo-dot" />
              {brand}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 320 }}>
              Dedicated Olympic weightlifting and powerlifting hall. 12 competition oak platforms, calibrated steel, and dry Nordic cedar heat.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "5px 10px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#fff",
                }}
              >
                06:00 — 24:00 DAILY
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "5px 10px",
                  borderRadius: 8,
                  background: "rgba(255, 210, 63, 0.14)",
                  color: "#ffd23f",
                }}
              >
                12 ELEIKO PLATFORMS
              </span>
            </div>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Disciplines
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li>Olympic Snatch & Clean & Jerk</li>
              <li>Raw Powerlifting Cycles</li>
              <li>Kettlebell Sport Conditioning</li>
              <li>Overhead & Hip Mobility</li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Club House
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li>All-Time Club Record Board</li>
              <li>Private Gear Locker Rental</li>
              <li>Platform Etiquette & Safety</li>
              <li>Nordic Sauna & Cold Plunge</li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Foundry Location
            </h4>
            <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 12px", color: "#dbe5f5" }}>
              418 N. Industrial Way, Bay 4, Portland, OR 97209 (Ground-floor loading bay entrance)
            </p>
            <div style={{ fontSize: 13, color: "#97a9c6" }}>
              Free 3-hour member parking in the north courtyard lot
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
          <span>© 2026 {brand} Barbell Club. All rights reserved.</span>
          <span>240-frame 60fps scroll sequence · Zero platform wait times</span>
        </div>
      </footer>
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  active?: boolean;
};

function Btn({ variant = "primary", active, children, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={`bear-btn bear-btn--${variant}`}
      {...rest}
    >
      {children}
    </button>
  );
}
