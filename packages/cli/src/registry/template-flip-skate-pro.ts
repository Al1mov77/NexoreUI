export const templateFlipSkatePro = {
  name: "template-flip-skate-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-flip-skate-pro.tsx",
  content: `"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Product {
  id: string;
  name: string;
  note: string;
  price: number;
  at: number;
  thumb: number;
  hero?: boolean;
}

const PRODUCTS: Product[] = [
  { id: "deck", name: 'Flip Pro Deck 8.25"', note: "7-ply maple, medium concave", price: 79, at: 0.25, thumb: 0.25, hero: true },
  { id: "trucks", name: "Hollow Trucks, pair", note: "Lightweight, 149 mm axle", price: 64, at: 0.55, thumb: 0.55, hero: true },
  { id: "wheels", name: "Cloud Wheels 54 mm", note: "99A, set of four", price: 38, at: 0.92, thumb: 0.92, hero: true },
  { id: "bearings", name: "Swiss Bearings", note: "Set of eight, pre-lubed", price: 24, at: 0.7, thumb: 0.5 },
  { id: "grip", name: "Black Grip Tape", note: '9" x 33" sheet, cut-to-fit', price: 9, at: 0.1, thumb: 0.37 },
];

const CHAPTERS = [
  { t: "Drop in.", p: "Every board on the shop floor starts on the ground and ends up in your hands." },
  { t: "Flip it.", p: "Seven plies of maple and a concave that pops exactly when you ask it to." },
  { t: "Take it apart.", p: "Trucks, wheels, bearings. Swap one piece and the whole board rides new." },
  { t: "Land it.", p: "Rolling again. Pick your parts below and we ship same day." },
];

const usd = (n: number) => \`$\${n.toFixed(0)}\`;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const pad = (n: number) => String(n).padStart(3, "0");

const defaultSrc = (i: number, m: boolean) => \`/frames/\${m ? "mobile" : "desktop"}/frame_\${pad(i)}.webp\`;

function findScroller(el: HTMLElement | null): HTMLElement | Window {
  if (typeof window === "undefined") return null as unknown as Window;
  let cur = el?.parentElement;
  while (cur && cur !== document.body) {
    const s = getComputedStyle(cur);
    if ((s.overflowY === "auto" || s.overflowY === "scroll") && cur.scrollHeight > cur.clientHeight + 10) {
      return cur;
    }
    cur = cur.parentElement;
  }
  return window;
}

export default function FlipSkateTemplate({
  brandName = "FLIP",
  deviceMode = "desktop",
}: {
  brandName?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { brandName };
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [loaded, setLoaded] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [solid, setSolid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("deck");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const lock = useRef(0);
  const imgs = useRef<HTMLImageElement[]>([]);
  const target = useRef(0);
  const cur = useRef(0);

  const isMobile = deviceMode === "mobile" || containerWidth <= 900;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth <= 1024);
  const frameCount = 240;

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

  const active = useMemo(() => PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0], [activeId]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const setQty = (id: string, q: number) => setCart((c) => ({ ...c, [id]: Math.max(0, q) }));

  useEffect(() => {
    let dead = false;
    let n = 0;
    setLoaded(0);
    imgs.current = Array.from({ length: frameCount }, (_, i) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = im.onerror = () => {
        n++;
        if (!dead && (n % 6 === 0 || n === frameCount)) setLoaded(n);
      };
      im.src = defaultSrc(i + 1, isMobile);
      return im;
    });
    return () => {
      dead = true;
    };
  }, [isMobile]);

  const draw = useCallback((idx: number) => {
    const c = canvasRef.current;
    if (!c) return;
    let im = imgs.current[idx];
    for (let k = idx; k >= 0 && !(im && im.complete && im.naturalWidth); k--) {
      im = imgs.current[k];
    }
    if (!im || !im.naturalWidth) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const scale = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight);
    const w = im.naturalWidth * scale;
    const h = im.naturalHeight * scale;
    ctx.drawImage(im, (c.width - w) / 2, (c.height - h) / 2, w, h);
  }, []);

  useEffect(() => {
    const scroller = findScroller(rootRef.current);
    let raf = 0;
    let shown = -1;
    let ch = -1;
    let act = "";

    const tick = () => {
      const w = wrapRef.current;
      if (w) {
        const r = w.getBoundingClientRect();
        const scrollerH = scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
        const totalScrollable = Math.max(1, r.height - scrollerH);
        target.current = clamp(-r.top / totalScrollable);

        const d = target.current - cur.current;
        const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        cur.current = reduce || Math.abs(d) < 0.0004 ? target.current : cur.current + d * 0.1;

        const idx = Math.round(cur.current * (frameCount - 1));
        if (idx !== shown || imgs.current[idx]?.complete) {
          shown = idx;
          draw(idx);
        }

        const c = Math.min(3, Math.floor(target.current * 4));
        if (c !== ch) {
          ch = c;
          setChapter(c);
        }

        setProgress((prev) => (Math.abs(prev - target.current) > 0.004 ? target.current : prev));

        const a = target.current < 0.4 ? "deck" : target.current < 0.75 ? "trucks" : "wheels";
        if (a !== act && performance.now() > lock.current) {
          act = a;
          setActiveId(a);
        }

        setSolid(r.bottom <= 68);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("flip-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    el.querySelectorAll(".flip-rv").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const jump = (p: Product) => {
    const w = wrapRef.current;
    if (!w) return;
    setActiveId(p.id);
    lock.current = performance.now() + 1400;
    const scroller = findScroller(rootRef.current);
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollerH = scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
    const currentScroll = scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop;
    const r = w.getBoundingClientRect();
    const scrollerTop = scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
    const targetY = currentScroll + (r.top - scrollerTop) + p.at * (w.offsetHeight - scrollerH);

    scroller.scrollTo({ top: targetY, behavior: reduce ? "auto" : "smooth" });
  };

  const addHero = () => {
    setQty(active.id, (cart[active.id] ?? 0) + 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const pct = Math.round((loaded / frameCount) * 100);

  return (
    <div
      ref={rootRef}
      className="flip-root relative w-full overflow-x-clip text-[#14180a] dark:text-[#eef2dc] bg-[#f3f5e9] dark:bg-[#11140a] selection:bg-[#c4d454] selection:text-[#14180a]"
      style={{
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@700;800;900&display=swap"
      />

      <style>{\`
        .flip-root h1, .flip-root h2, .flip-root h3, .flip-root .flip-heading {
          font-family: 'Unbounded', sans-serif;
          letter-spacing: -0.04em;
        }
        .flip-btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 1.25rem;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 6px;
          border: 2px solid #14180a;
          background: #f3f5e9;
          color: #14180a;
          transition: transform 0.12s ease, background 0.12s ease, color 0.12s ease;
          cursor: pointer;
          user-select: none;
        }
        .dark .flip-btn {
          border-color: #eef2dc;
          background: #11140a;
          color: #eef2dc;
        }
        .flip-btn:hover {
          transform: translateY(-1px);
          background: #c4d454;
          color: #14180a;
        }
        .flip-btn:active {
          transform: translateY(1px);
        }
        .flip-btn:focus-visible {
          outline: 3px solid #d9420b;
          outline-offset: 2px;
        }
        .flip-btn-primary {
          background: #d9420b !important;
          color: #ffffff !important;
          border-color: #14180a !important;
        }
        .dark .flip-btn-primary {
          background: #d9420b !important;
          color: #ffffff !important;
          border-color: #eef2dc !important;
        }
        .flip-btn-primary:hover {
          background: #bd3706 !important;
          color: #ffffff !important;
        }
        .flip-btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none !important;
        }
        .flip-btn-ghost {
          background: transparent !important;
          border-color: transparent !important;
        }
        .flip-btn-ghost:hover {
          background: rgba(20, 24, 10, 0.08) !important;
          color: inherit !important;
        }
        .dark .flip-btn-ghost:hover {
          background: rgba(238, 242, 220, 0.12) !important;
        }
        .flip-marquee-track {
          display: flex;
          width: max-content;
          animation: flipMarquee 26s linear infinite;
        }
        @keyframes flipMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flip-marquee-track {
            animation: none !important;
          }
          .flip-rv {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .flip-btn {
            transition: none !important;
            transform: none !important;
          }
        }
        .flip-rv {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .flip-rv.flip-in {
          opacity: 1;
          transform: translateY(0);
        }
      \`}</style>

      {/* Persistent / Dynamic Header */}
      <header
        className={\`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 h-16 transition-colors duration-200 \${
          solid
            ? "bg-[#f3f5e9] dark:bg-[#11140a] text-[#14180a] dark:text-[#eef2dc] border-b-2 border-[#14180a] dark:border-[#eef2dc]"
            : "bg-transparent text-[#14180a]"
        }\`}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <a
          href="#top"
          className="flip-heading text-2xl font-black tracking-tight"
          aria-label={\`\${brandName} skate shop, home\`}
        >
          {brandName}
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold" aria-label="Main">
          <a href="#shop" className="hover:text-[#d9420b] transition-colors">
            Shop
          </a>
          <a href="#how" className="hover:text-[#d9420b] transition-colors">
            How it works
          </a>
          <a href="#faq" className="hover:text-[#d9420b] transition-colors">
            FAQ
          </a>
        </nav>

        <button
          type="button"
          className="flip-btn !px-4 !py-2 !text-xs md:!text-sm"
          aria-label={\`Cart, \${count} items, \${usd(total)}\`}
          onClick={() => {
            const el = rootRef.current?.querySelector("#shop");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>
            Cart ({count}) {usd(total)}
          </span>
        </button>
      </header>

      {/* Hero: 520vh sticky canvas sequence */}
      <div
        id="top"
        ref={wrapRef}
        className="relative w-full"
        style={{ height: isMobile ? "460vh" : "520vh" }}
      >
        <div
          className="sticky top-0 w-full h-[100svh] overflow-hidden flex flex-col justify-between"
          style={{ backgroundColor: "#869833" }}
        >
          {/* Top Progress Line */}
          {pct < 100 && (
            <div
              className="absolute top-0 left-0 right-0 h-[3px] bg-[#14180a]/20 z-40"
              role="progressbar"
              aria-label="Loading frames"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-[#14180a] transition-all duration-100 ease-out"
                style={{ width: \`\${pct}%\` }}
              />
            </div>
          )}

          {/* Loading Indicator */}
          {pct < 100 && (
            <span className="absolute top-4 right-5 text-xs font-mono font-bold tracking-wider text-[#14180a] z-40">
              Loading {pct}%
            </span>
          )}

          {/* Desktop Layout: Left Scrim + Right Canvas */}
          {/* Mobile Layout: Top Canvas + Bottom Controls */}
          <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between">
            {/* Canvas Stage */}
            <div
              className={\`relative flex items-center justify-center overflow-hidden \${
                isMobile
                  ? "w-full h-[50svh] mt-14"
                  : "absolute right-0 top-0 bottom-0 w-[66%] h-full"
              }\`}
            >
              {/* canvas-ok: 240-frame scroll scrub showing real physical skateboard assembly */}
              <canvas
                ref={canvasRef}
                width={isMobile ? 750 : 1000}
                height={isMobile ? 600 : 750}
                className="max-h-full max-w-full object-contain pointer-events-none select-none"
                role="img"
                aria-label="A skateboard flips, comes apart into deck, trucks and wheels, and lands."
              />
              {/* Soft canvas edge blend scrims */}
              {!isMobile && (
                <div
                  className="absolute inset-y-0 left-0 w-24 pointer-events-none"
                  style={{
                    background: "linear-gradient(to right, #869833 0%, transparent 100%)",
                  }}
                />
              )}
            </div>

            {/* Scroll Progress Vertical Cue */}
            <div
              className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-[#14180a]/20 rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="w-full bg-[#14180a] transition-all duration-75 ease-out rounded-full"
                style={{ height: \`\${progress * 100}%\` }}
              />
            </div>

            {/* Copy / Chapters & Selection Bar */}
            <div
              className={\`relative z-20 flex flex-col justify-center \${
                isMobile
                  ? "w-full px-5 pb-8 pt-2 flex-1 justify-between"
                  : "w-[44%] h-full pl-16 pr-6 py-24"
              }\`}
            >
              {/* Chapters Crossfade */}
              <div className="relative min-h-[140px] md:min-h-[190px] flex items-center" aria-live="polite">
                {CHAPTERS.map((c, i) => {
                  const on = i === chapter;
                  return (
                    <div
                      key={c.t}
                      className={\`transition-all duration-300 \${
                        on
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
                      }\`}
                      aria-hidden={!on}
                    >
                      {i === 0 ? (
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#14180a] leading-[1.02]">
                          {c.t}
                        </h1>
                      ) : (
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#14180a] leading-[1.02]">
                          {c.t}
                        </h2>
                      )}
                      <p className="mt-3 md:mt-4 text-base sm:text-lg text-[#14180a]/90 font-medium max-w-md">
                        {c.p}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Part Chips Picker */}
              <div className="mt-6 flex items-center gap-2" role="group" aria-label="Jump to a part">
                {PRODUCTS.filter((p) => p.hero).map((p) => {
                  const isSel = p.id === active.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={\`flip-btn !min-h-[38px] !h-10 !px-4 !text-xs sm:!text-sm uppercase tracking-wider \${
                        isSel
                          ? "!bg-[#14180a] !text-[#f3f5e9] !border-[#14180a]"
                          : "!bg-transparent !border-[#14180a] !text-[#14180a] hover:!bg-[#14180a]/10"
                      }\`}
                      aria-pressed={isSel}
                      onClick={() => jump(p)}
                    >
                      {p.id[0].toUpperCase() + p.id.slice(1)}
                    </button>
                  );
                })}
              </div>

              {/* Active Part Card */}
              <div className="mt-5 p-4 rounded-[6px] border-2 border-[#14180a] bg-[#f3f5e9] text-[#14180a] flex items-center justify-between gap-4 max-w-md shadow-sm">
                <div className="flex flex-col min-w-0">
                  <strong className="text-sm sm:text-base font-black truncate">{active.name}</strong>
                  <span className="text-xs sm:text-sm font-semibold opacity-85">
                    {usd(active.price)} &nbsp;·&nbsp; {active.note}
                  </span>
                </div>
                <button
                  type="button"
                  className={\`flip-btn flip-btn-primary shrink-0 !min-h-[40px] !h-10 !px-4 !text-xs sm:!text-sm \${
                    added ? "!bg-[#14180a] !border-[#14180a]" : ""
                  }\`}
                  onClick={addHero}
                >
                  {added ? "Added" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Strip (CSS Only) */}
      <div
        className="w-full py-4 border-y-2 border-[#14180a] dark:border-[#eef2dc] bg-[#c4d454] text-[#14180a] overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="flip-marquee-track text-sm sm:text-base font-extrabold uppercase tracking-wider gap-8">
          {[0, 1, 2, 3].map((set) => (
            <React.Fragment key={set}>
              <span>Decks</span>
              <span>·</span>
              <span>Trucks</span>
              <span>·</span>
              <span>Wheels</span>
              <span>·</span>
              <span>Bearings</span>
              <span>·</span>
              <span>Grip</span>
              <span>·</span>
              <span>Free shipping over $75</span>
              <span>·</span>
              <span>Same-day dispatch</span>
              <span>·</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Section: Shop / Product Carousel */}
      <section
        id="shop"
        className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28"
        aria-labelledby="shop-heading"
      >
        <div className="flip-rv flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 id="shop-heading" className="text-3xl sm:text-4xl md:text-5xl font-black">
              Build the board you ride.
            </h2>
            <p className="mt-2 text-sm sm:text-base opacity-75 max-w-lg">
              Precision milled 7-ply maple, lightweight hollow trucks, and fast urethane wheels. All in stock.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <button
              type="button"
              className="flip-btn flip-btn-primary !px-6 !py-3 !text-base"
              disabled={!count}
              onClick={() => setStatus(\`Demo store: no payment taken. Order total \${usd(total)}.\`)}
            >
              Checkout {count ? usd(total) : ""}
            </button>
            {status && (
              <p className="text-xs font-mono font-bold text-[#d9420b]" role="status">
                {status}
              </p>
            )}
          </div>
        </div>

        {/* Carousel with scroll-snap */}
        <div
          className="flip-rv flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-[#d9420b] rounded-[6px]"
          tabIndex={0}
          aria-label="Products, scroll sideways"
        >
          {PRODUCTS.map((p) => {
            const q = cart[p.id] ?? 0;
            return (
              <article
                key={p.id}
                className="min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start flex flex-col rounded-[6px] border-2 border-[#14180a] dark:border-[#eef2dc] bg-white dark:bg-[#181d0f] overflow-hidden shadow-xs"
              >
                <div className="relative aspect-[4/3] bg-[#869833] overflow-hidden flex items-center justify-center border-b-2 border-[#14180a] dark:border-[#eef2dc]">
                  <img
                    src={defaultSrc(Math.round(p.thumb * (frameCount - 1)) + 1, false)}
                    alt={\`\${p.name} on a green background\`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#14180a] text-[#f3f5e9] text-[11px] font-mono uppercase px-2 py-1 rounded-[4px] font-bold">
                    {usd(p.price)}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-snug">{p.name}</h3>
                    <p className="mt-1 text-xs opacity-70">{p.note}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#14180a]/15 dark:border-[#eef2dc]/15">
                    <span className="text-lg font-extrabold font-mono">{usd(p.price)}</span>
                    {q === 0 ? (
                      <button
                        type="button"
                        className="flip-btn !min-h-[40px] !h-10 !px-4 !text-xs font-bold"
                        onClick={() => setQty(p.id, 1)}
                      >
                        Add to cart
                      </button>
                    ) : (
                      <div
                        className="inline-flex items-center rounded-[6px] border-2 border-[#14180a] dark:border-[#eef2dc] bg-[#f3f5e9] dark:bg-[#11140a] overflow-hidden h-10"
                        role="group"
                        aria-label={\`Quantity of \${p.name}\`}
                      >
                        <button
                          type="button"
                          className="px-3 h-full font-black text-base hover:bg-[#c4d454] hover:text-[#14180a] transition-colors"
                          aria-label="Remove one"
                          onClick={() => setQty(p.id, q - 1)}
                        >
                          &minus;
                        </button>
                        <output className="px-3 font-mono font-bold text-sm min-w-[28px] text-center">
                          {q}
                        </output>
                        <button
                          type="button"
                          className="px-3 h-full font-black text-base hover:bg-[#c4d454] hover:text-[#14180a] transition-colors"
                          aria-label="Add one"
                          onClick={() => setQty(p.id, q + 1)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Section: How It Works */}
      <section
        id="how"
        className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 border-t-2 border-[#14180a] dark:border-[#eef2dc]"
        aria-labelledby="how-heading"
      >
        <h2 id="how-heading" className="flip-rv text-3xl sm:text-4xl md:text-5xl font-black mb-12">
          From cart to curb in three steps.
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Pick your parts", "Start with a deck, then add trucks and wheels that match its width."],
            ["We assemble it", "Free setup in the shop: grip applied, bearings seated, bolts torqued."],
            ["Ride it today", "Pick up in store or get it at your door in two business days."],
          ].map(([t, d], i) => (
            <li
              key={t}
              className="flip-rv p-6 rounded-[6px] border-2 border-[#14180a] dark:border-[#eef2dc] bg-white dark:bg-[#181d0f] flex flex-col justify-between"
            >
              <b className="text-4xl font-mono font-black text-[#d9420b] leading-none mb-6">
                0{i + 1}
              </b>
              <div>
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm opacity-75">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Section: Three Big Stats on Lime Background */}
      <section
        className="w-full py-16 md:py-24 border-y-2 border-[#14180a] dark:border-[#eef2dc] bg-[#c4d454] text-[#14180a]"
        aria-label={\`\${brandName} in numbers\`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            ["12,000+", "boards built since 2014"],
            ["48 h", "average time to your door"],
            ["30 days", "to swap any part you don't love"],
          ].map(([n, l]) => (
            <div key={n} className="flip-rv flex flex-col items-center md:items-start">
              <b className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-3">
                {n}
              </b>
              <span className="text-sm sm:text-base font-semibold tracking-wide uppercase opacity-85">
                {l}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section: FAQ */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28"
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading" className="flip-rv text-3xl sm:text-4xl md:text-5xl font-black mb-10">
          Questions skaters ask.
        </h2>
        <div className="flip-rv flex flex-col gap-4">
          {[
            [
              "Which deck width should I pick?",
              '8.0" to 8.25" suits most street riders. Go narrower if you\\'re under 5\\'6" or just starting out.',
            ],
            [
              "Do trucks come with hardware?",
              "Yes. Every set includes axle nuts, kingpin nuts and mounting bolts.",
            ],
            [
              "Can I return a part I've ridden?",
              "Within 30 days, as long as it isn't cracked or chipped. We'll swap it or refund it.",
            ],
            [
              "How long does shipping take?",
              "Orders before 2 pm leave the same day. Standard delivery in the US takes 2 business days.",
            ],
          ].map(([q, a]) => (
            <details
              key={q}
              className="group p-5 rounded-[6px] border-2 border-[#14180a] dark:border-[#eef2dc] bg-white dark:bg-[#181d0f]"
            >
              <summary className="flex items-center justify-between text-base sm:text-lg font-bold cursor-pointer list-none select-none">
                <span>{q}</span>
                <span className="text-xl font-mono group-open:rotate-45 transition-transform duration-150">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed pt-2 border-t border-[#14180a]/10 dark:border-[#eef2dc]/10">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Section: Final CTA */}
      <section
        className="w-full border-t-2 border-[#14180a] dark:border-[#eef2dc] bg-[#869833] text-[#14180a] py-20 md:py-28"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flip-rv flex flex-col items-start gap-5">
            <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.05]">
              Your board is ready when you are.
            </h2>
            <p className="text-base sm:text-lg opacity-90 max-w-md font-medium">
              Build it now and we'll have it set up and waiting in store or at your door.
            </p>
            <button
              type="button"
              className="flip-btn flip-btn-primary !px-7 !py-4 !text-base font-black"
              onClick={() => {
                const el = rootRef.current?.querySelector("#shop");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Shop all parts
            </button>
          </div>
          <div className="flip-rv rounded-[6px] border-2 border-[#14180a] overflow-hidden aspect-[4/3] bg-[#14180a]/10">
            <img
              src={defaultSrc(frameCount, isMobile)}
              alt="A finished skateboard on the ground"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full border-t-2 border-[#14180a] dark:border-[#eef2dc] bg-[#f3f5e9] dark:bg-[#11140a] text-[#14180a] dark:text-[#eef2dc] pt-16 pb-12"
        style={{ paddingBottom: "calc(3rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-base font-black uppercase mb-3">Brooklyn</h3>
              <p className="text-sm opacity-80 leading-relaxed">214 Wythe Ave</p>
              <p className="text-sm opacity-80 leading-relaxed">Brooklyn, NY 11249</p>
            </div>
            <div>
              <h3 className="text-base font-black uppercase mb-3">Portland</h3>
              <p className="text-sm opacity-80 leading-relaxed">38 SE Grand Ave</p>
              <p className="text-sm opacity-80 leading-relaxed">Portland, OR 97214</p>
            </div>
            <div>
              <h3 className="text-base font-black uppercase mb-3">Hours</h3>
              <p className="text-sm opacity-80 leading-relaxed">Mon to Fri, 11 am to 8 pm</p>
              <p className="text-sm opacity-80 leading-relaxed">Sat and Sun, 10 am to 6 pm</p>
            </div>
            <div>
              <h3 className="text-base font-black uppercase mb-3">Follow</h3>
              <div className="flex flex-col gap-1 text-sm font-semibold">
                <a href="#top" className="hover:text-[#d9420b] transition-colors">
                  Instagram
                </a>
                <a href="#top" className="hover:text-[#d9420b] transition-colors">
                  YouTube
                </a>
                <a href="#top" className="hover:text-[#d9420b] transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Email Subscribe Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubbed(true);
            }}
            className="mb-14 max-w-md flex flex-col gap-2"
          >
            <label htmlFor="flip-email" className="text-sm font-bold">
              Get drops and shop events by email
            </label>
            <div className="flex gap-2">
              <input
                id="flip-email"
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="flex-1 px-4 min-h-[44px] rounded-[6px] border-2 border-[#14180a] dark:border-[#eef2dc] bg-white dark:bg-[#181d0f] text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9420b]"
              />
              <button type="submit" className="flip-btn shrink-0">
                {subbed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </form>

          {/* Giant SVG Typography */}
          <div className="w-full overflow-hidden select-none mb-8" aria-hidden="true">
            <svg className="w-full h-auto" viewBox="0 0 1000 250" role="img" aria-label={brandName}>
              <text
                x="0"
                y="228"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fontFamily="Unbounded, sans-serif"
                fontWeight="900"
                fontSize="290"
                fill="currentColor"
                opacity="0.9"
              >
                {brandName}
              </text>
            </svg>
          </div>

          <div className="pt-6 border-t border-[#14180a]/15 dark:border-[#eef2dc]/15 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold opacity-75 gap-3">
            <span>&copy; 2026 {brandName} Skate Shop. All rights reserved.</span>
            <span>Prices in USD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};
