"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "nexoreui";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FRAME_COUNT = 240;
const frameUrl = (dir: "desktop" | "mobile", i: number) =>
  `/frames/burlit/${dir}/frame_${String(i + 1).padStart(3, "0")}.webp`;
const fallbackFrameUrl = (dir: "desktop" | "mobile", i: number) =>
  `/frames/${dir}/frame_${String(i + 1).padStart(3, "0")}.webp`;

type CoffeeCategory = "All" | "Espresso Bar" | "Milk & Cream" | "Filter & Cold" | "Whole Bean";
const CATEGORIES: readonly CoffeeCategory[] = [
  "All",
  "Espresso Bar",
  "Milk & Cream",
  "Filter & Cold",
  "Whole Bean",
] as const;

type CoffeeIcon = "portafilter" | "pitcher" | "cup" | "beans";

interface Drink {
  id: string;
  category: Exclude<CoffeeCategory, "All">;
  icon: CoffeeIcon;
  name: string;
  price: number;
  note: string;
  spec: string;
  at: number;
  hero?: boolean;
}

const DRINKS: readonly Drink[] = [
  {
    id: "espresso",
    category: "Espresso Bar",
    icon: "portafilter",
    name: "Espresso",
    price: 4,
    note: "Pulled fresh, drink right away",
    spec: "36 g yield · Ethiopia Yirgacheffe · 93 °C",
    at: 0.12,
    hero: true,
  },
  {
    id: "flat",
    category: "Milk & Cream",
    icon: "pitcher",
    name: "Flat White",
    price: 6,
    note: "Double ristretto, silky microfoam",
    spec: "160 ml · Double shot · 60 °C steamed milk",
    at: 0.45,
    hero: true,
  },
  {
    id: "raf",
    category: "Milk & Cream",
    icon: "cup",
    name: "Vanilla Raf",
    price: 7,
    note: "Cream, vanilla bean, clouds of steam",
    spec: "220 ml · 11% sweet cream · Madagascar vanilla",
    at: 0.8,
    hero: true,
  },
  {
    id: "cortado",
    category: "Espresso Bar",
    icon: "portafilter",
    name: "Cortado",
    price: 5,
    note: "Equal parts espresso and warm milk",
    spec: "120 ml · 1:1 ratio · Roasted hazelnut notes",
    at: 0.28,
  },
  {
    id: "v60",
    category: "Filter & Cold",
    icon: "cup",
    name: "Hario V60 Pourover",
    price: 6,
    note: "Clean floral cup, hand-poured in 3 blooms",
    spec: "250 ml · Kenya Nyeri AA · Blackcurrant & bergamot",
    at: 0.35,
  },
  {
    id: "coldbrew",
    category: "Filter & Cold",
    icon: "pitcher",
    name: "18-Hour Cold Brew",
    price: 6,
    note: "Slow-steeped over filtered ice, zero bitterness",
    spec: "280 ml · Colombia Huila · Dark cacao finish",
    at: 0.6,
  },
  {
    id: "beans-ethiopia",
    category: "Whole Bean",
    icon: "beans",
    name: "House Espresso Blend",
    price: 19,
    note: "Whole bean bag roasted every Tuesday",
    spec: "250 g bag · Washed & Natural · Milk chocolate",
    at: 0.75,
  },
  {
    id: "beans-kenya",
    category: "Whole Bean",
    icon: "beans",
    name: "Single Origin Filter Bag",
    price: 22,
    note: "Light omni-roast for pourover and AeroPress",
    spec: "250 g bag · High-altitude lot · Jasmine & peach",
    at: 0.9,
  },
] as const;

const HERO_DRINKS = DRINKS.filter((d) => d.hero);

interface Chapter {
  from: number;
  title: string;
  text: string;
}

const CHAPTERS: readonly Chapter[] = [
  { from: 0, title: "Brewing.", text: "The roastery where every cup is poured by a cat." },
  { from: 0.25, title: "Pouring.", text: "Thin steady stream, dense velvety crema." },
  { from: 0.55, title: "Oops, spilled!", text: "Extra on the house — grab another cup." },
  { from: 0.82, title: "Ready.", text: "Piping hot coffee in 3 minutes flat." },
] as const;

function CoffeeGlyph({ name, className = "bh-ic" }: { name: CoffeeIcon; className?: string }) {
  switch (name) {
    case "portafilter":
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 18h20a6 6 0 0 1-6 10h-8a6 6 0 0 1-6-10Z" />
          <path d="M28 21h14M15 28v6M21 28v6M18 38v4" />
        </svg>
      );
    case "pitcher":
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 14h20l-2 24a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4l-2-24Z" />
          <path d="M32 18h5a4 4 0 0 1 0 8h-6M10 14h24" />
        </svg>
      );
    case "beans":
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <ellipse cx="20" cy="24" rx="9" ry="13" transform="rotate(-18 20 24)" />
          <path d="M17 12c4 7-2 17 3 24" />
          <ellipse cx="31" cy="25" rx="8" ry="11" transform="rotate(20 31 25)" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M10 20h22v10a11 11 0 0 1-22 0V20Z" />
          <path d="M32 22h4a4 4 0 0 1 0 8h-4M8 38h26M17 14c0-3 2-3 2-6M25 14c0-3 2-3 2-6" />
        </svg>
      );
  }
}

export function BurlitCoffeePreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const emblemRef = useRef<SVGSVGElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const lastDrawn = useRef(-1);

  const [containerWidth, setContainerWidth] = useState(1280);
  const [viewportMobile, setViewportMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string>("espresso");
  const [category, setCategory] = useState<CoffeeCategory>("All");
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  const brand = config.brandName || "PURRPOUR";
  const isDark = config.theme === "dark";

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
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setViewportMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReducedMotion(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const isMobile = deviceMode === "mobile" || viewportMobile || containerWidth <= 768;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
  const dir: "desktop" | "mobile" = isMobile ? "mobile" : "desktop";

  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  const sum = DRINKS.reduce((s, d) => s + (cart[d.id] || 0) * d.price, 0);

  const filteredDrinks = useMemo(
    () => DRINKS.filter((d) => category === "All" || d.category === category),
    [category],
  );

  const findNearestScroller = useCallback((el: HTMLElement | null): HTMLElement | Window => {
    if (!el || typeof window === "undefined") return window;
    let curr = el.parentElement;
    while (curr) {
      const style = window.getComputedStyle(curr);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return curr;
      }
      curr = curr.parentElement;
    }
    return window;
  }, []);

  useEffect(() => {
    let alive = true;
    imgs.current = [];
    lastDrawn.current = -1;
    setLoaded(0);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const im = new Image();
      im.decoding = "async";
      let triedFallback = false;
      im.onload = () => {
        if (alive) setLoaded((n) => n + 1);
      };
      im.onerror = () => {
        if (!triedFallback && alive) {
          triedFallback = true;
          im.src = fallbackFrameUrl(dir, i);
        }
      };
      im.src = frameUrl(dir, i);
      imgs.current[i] = im;
    }
    return () => {
      alive = false;
    };
  }, [dir]);

  const draw = useCallback((idx: number) => {
    const c = canvasRef.current;
    if (!c) return;
    let im = imgs.current[idx];
    if (!im || !im.complete || !im.naturalWidth) {
      for (let j = idx - 1; j >= 0; j--) {
        const prev = imgs.current[j];
        if (prev && prev.complete && prev.naturalWidth) {
          im = prev;
          break;
        }
      }
    }
    if (!im || !im.complete || !im.naturalWidth) return;
    if (c.width !== im.naturalWidth || c.height !== im.naturalHeight) {
      c.width = im.naturalWidth;
      c.height = im.naturalHeight;
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(im, 0, 0);
    lastDrawn.current = idx;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const scroller = findNearestScroller(el);

    const onScroll = () => {
      const targetEl = wrapRef.current;
      if (!targetEl) return;
      const r = targetEl.getBoundingClientRect();
      const scrollerTop =
        scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const viewH =
        scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
      const max = Math.max(1, targetEl.offsetHeight - viewH);
      target.current = Math.min(1, Math.max(0, -(r.top - scrollerTop) / max));

      if (ctaRef.current && emblemRef.current && !reducedMotion) {
        const cr = ctaRef.current.getBoundingClientRect();
        const relTop = cr.top - scrollerTop;
        const k = Math.min(1, Math.max(0, 1 - (relTop + cr.height) / (viewH + cr.height)));
        emblemRef.current.style.transform = `translateY(-50%) rotate(${-36 + k * 32}deg)`;
      }
    };

    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    if (scroller !== window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onScroll);

    let raf = 0;
    const tick = () => {
      current.current += (target.current - current.current) * (reducedMotion ? 1 : 0.1);
      const p = current.current;
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))));
      if (idx !== lastDrawn.current) draw(idx);
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      if (scroller !== window) {
        window.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", onScroll);
    };
  }, [draw, dir, findNearestScroller, reducedMotion]);

  useEffect(() => {
    if (loaded > 0) {
      draw(Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(current.current * (FRAME_COUNT - 1)))));
    }
  }, [loaded, draw]);

  const jumpTo = useCallback(
    (p: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const scroller = findNearestScroller(el);
      const viewH =
        scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
      const max = Math.max(0, el.offsetHeight - viewH);
      const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";

      if (scroller === window) {
        const rect = el.getBoundingClientRect();
        const top = window.scrollY + rect.top + max * p;
        window.scrollTo({ top, behavior });
      } else {
        const scrollerEl = scroller as HTMLElement;
        const rect = el.getBoundingClientRect();
        const scrollerRect = scrollerEl.getBoundingClientRect();
        const top = rect.top - scrollerRect.top + scrollerEl.scrollTop + max * p;
        scrollerEl.scrollTo({ top, behavior });
      }
    },
    [findNearestScroller, reducedMotion],
  );

  const scrollToMenu = useCallback(() => {
    const menuEl = rootRef.current?.querySelector("#menu");
    if (!menuEl) return;
    menuEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion]);

  const scrollToTop = useCallback(() => {
    jumpTo(0);
  }, [jumpTo]);

  const handleCheckout = useCallback(() => {
    if (!total) return;
    const msg = `Order received: ${total} ${total === 1 ? "item" : "items"}, $${sum}`;
    setOrderNotice(msg);
    if (typeof window !== "undefined") {
      window.setTimeout(() => setOrderNotice((curr) => (curr === msg ? null : curr)), 4000);
    }
  }, [total, sum]);

  const chapter = [...CHAPTERS].reverse().find((c) => progress >= c.from) || CHAPTERS[0];
  const drink = DRINKS.find((d) => d.id === active) || DRINKS[0];
  const fade = Math.min(1, Math.max(0, (progress - 0.94) / 0.06));
  const ready = loaded >= FRAME_COUNT * 0.6;

  return (
    <div
      ref={rootRef}
      className={`bh-root ${isMobile ? "is-mobile" : isTablet ? "is-tablet" : "is-desktop"} ${
        isDark ? "is-dark" : ""
      }`}
      style={{ overflowX: "clip" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;800&family=Manrope:wght@400;600&display=swap"
      />
      <style>{CSS}</style>

      <header className="bh-bar">
        <b>{config.heroTitle || brand}</b>
        <Button
          type="button"
          variant="default"
          animate={false}
          className="bh-cart"
          onClick={scrollToMenu}
        >
          Cart · {total}
          {sum ? ` · $${sum}` : ""}
        </Button>
      </header>

      <div ref={wrapRef} className="bh-wrap">
        <section className="bh-stage" style={{ opacity: 1 - fade * 0.4 }}>
          {/* canvas-ok: 240-frame cat barista scroll scrub sequence */}
          <canvas
            ref={canvasRef}
            className="bh-canvas"
            aria-label="Cat barista pouring coffee"
          />

          {!ready && (
            <div className="bh-loader" role="status" aria-live="polite">
              Steaming milk… {Math.round((loaded / FRAME_COUNT) * 100)}%
            </div>
          )}

          <div className="bh-copy">
            <h1 key={chapter.title}>{chapter.title}</h1>
            <p key={chapter.text}>{config.heroSubtitle || chapter.text}</p>

            <div className="bh-chips" role="tablist" aria-label="Choose a drink">
              {HERO_DRINKS.map((d) => (
                <Button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={active === d.id}
                  variant={active === d.id ? "default" : "ghost"}
                  animate={false}
                  className={`bh-btn ${active === d.id ? "solid" : "ghost"}`}
                  onClick={() => {
                    setActive(d.id);
                    jumpTo(d.at);
                  }}
                >
                  {d.name}
                </Button>
              ))}
            </div>

            <div className="bh-card">
              <div>
                <strong>
                  {drink.name} · ${drink.price}
                </strong>
                <span>{drink.note}</span>
              </div>
              <Button
                type="button"
                variant="default"
                animate={false}
                className="bh-btn solid"
                onClick={() =>
                  setCart((c) => ({ ...c, [drink.id]: (c[drink.id] || 0) + 1 }))
                }
              >
                Order
              </Button>
            </div>
          </div>

          <div className="bh-hint" style={{ opacity: progress < 0.03 ? 1 : 0 }}>
            Scroll — the cat pours
          </div>
          <div className="bh-line" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
        </section>
      </div>

      <section id="menu" className="bh-menu">
        <div className="bh-menu-head">
          <div>
            <p className="bh-eyebrow">Roastery Bar &amp; Whole Bean</p>
            <h2>Menu</h2>
          </div>
          <span className="bh-count" aria-live="polite">
            Showing {filteredDrinks.length} of {DRINKS.length} items
          </span>
        </div>

        <div className="bh-filter-row" role="group" aria-label="Filter menu by category">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={category === cat ? "default" : "ghost"}
              animate={false}
              aria-pressed={category === cat}
              className={`bh-btn ${category === cat ? "solid" : "ghost"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="bh-grid">
          {filteredDrinks.map((d) => (
            <Card key={d.id} hover="none" animate={false} className="bh-item">
              <CardHeader className="bh-item-head">
                <div className="bh-item-top">
                  <span className="bh-tag">{d.category}</span>
                  <CoffeeGlyph name={d.icon} />
                </div>
                <CardTitle className="bh-item-title">{d.name}</CardTitle>
                <CardDescription className="bh-item-desc">{d.note}</CardDescription>
                <p className="bh-item-spec">{d.spec}</p>
              </CardHeader>
              <CardFooter className="bh-row">
                <b>${d.price}</b>
                <div className="bh-qty">
                  <Button
                    type="button"
                    variant="ghost"
                    animate={false}
                    aria-label={`Remove ${d.name}`}
                    className="bh-btn ghost"
                    onClick={() =>
                      setCart((c) => ({
                        ...c,
                        [d.id]: Math.max(0, (c[d.id] || 0) - 1),
                      }))
                    }
                  >
                    −
                  </Button>
                  <span className="bh-qty-val">{cart[d.id] || 0}</span>
                  <Button
                    type="button"
                    variant="default"
                    animate={false}
                    aria-label={`Add ${d.name}`}
                    className="bh-btn solid"
                    onClick={() =>
                      setCart((c) => ({ ...c, [d.id]: (c[d.id] || 0) + 1 }))
                    }
                  >
                    +
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bh-checkout">
          <Button
            type="button"
            variant="default"
            animate={false}
            disabled={!total}
            className="bh-btn solid bh-submit"
            onClick={handleCheckout}
          >
            {total ? `Checkout · $${sum}` : "Select a drink"}
          </Button>
          {orderNotice && (
            <p className="bh-notice" role="status" aria-live="polite">
              {orderNotice}
            </p>
          )}
        </div>
      </section>

      <section ref={ctaRef} className="bh-cta">
        <svg
          ref={emblemRef}
          className="bh-emblem"
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <path d="M10 22h28a8 8 0 0 1-8 14H18a8 8 0 0 1-8-14Z" />
          <path d="M38 26h18M19 36v8M29 36v8M24 48v6" />
        </svg>
        <p className="bh-cta-kicker">Small-Batch Drum Roastery</p>
        <h2>Fresh roast, poured to order.</h2>
        <p className="bh-cta-sub">
          Pick your bar drink or whole-bean bag above. We pull every shot on a
          dual-boiler lever machine and roast single-origin lots every Tuesday.
        </p>
        <Button
          type="button"
          variant="default"
          animate={false}
          className="bh-btn solid bh-cta-btn"
          onClick={total ? handleCheckout : scrollToMenu}
        >
          {total ? `Complete Order · $${sum}` : "Explore Espresso Bar"}
        </Button>
      </section>

      <footer className="bh-footer">
        <div>
          <span className="bh-footer-logo">{brand}</span>
          <p>
            Specialty coffee roastery and espresso bar. Every cup dialed in and
            poured to order.
          </p>
        </div>
        <div>
          <h5>Espresso Bar</h5>
          <button type="button" onClick={() => { setCategory("Espresso Bar"); scrollToMenu(); }}>
            Double Espresso
          </button>
          <button type="button" onClick={() => { setCategory("Milk & Cream"); scrollToMenu(); }}>
            Flat White &amp; Raf
          </button>
          <button type="button" onClick={() => { setCategory("Filter & Cold"); scrollToMenu(); }}>
            V60 &amp; Cold Brew
          </button>
        </div>
        <div>
          <h5>Roastery</h5>
          <button type="button" onClick={() => { setCategory("Whole Bean"); scrollToMenu(); }}>
            Whole Bean Bags
          </button>
          <button type="button" onClick={scrollToTop}>
            Watch the Pour
          </button>
          <button type="button" onClick={scrollToMenu}>
            Roast Schedule
          </button>
        </div>
        <div>
          <h5>Hours &amp; Bar</h5>
          <span>Mon – Fri · 07:00 – 20:00</span>
          <span>Sat – Sun · 08:00 – 21:00</span>
          <span>Roastery Pickup Counter</span>
        </div>
        <div className="bh-legal">
          &copy; {brand} Roastery. Specialty coffee bar and small-batch roaster.
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.bh-root {
  --cream: #f6efe4;
  --ink: #2b1a10;
  --cof: #b9713b;
  --sand: #e0b175;
  --line: rgba(43, 26, 16, 0.16);
  position: relative;
  min-height: 100vh;
  font-family: Manrope, system-ui, sans-serif;
  background: var(--cream);
  color: var(--ink);
  box-sizing: border-box;
}
@media (prefers-color-scheme: dark) {
  .bh-root {
    --cream: #1d140e;
    --ink: #f6efe4;
    --line: rgba(246, 239, 228, 0.16);
  }
}
.bh-root.is-dark {
  --cream: #1d140e;
  --ink: #f6efe4;
  --line: rgba(246, 239, 228, 0.16);
}
.bh-root *,
.bh-root *::before,
.bh-root *::after {
  box-sizing: border-box;
}
.bh-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;
  margin-bottom: -68px;
  padding: calc(12px + env(safe-area-inset-top, 0px)) 20px 12px;
  font: 800 15px Unbounded, sans-serif;
  color: #fff;
  letter-spacing: 0.04em;
}
.bh-bar b {
  text-shadow: 0 2px 12px rgba(43, 26, 16, 0.35);
}
.bh-cart {
  font: 600 13px Manrope, sans-serif !important;
  color: #2b1a10 !important;
  background: #fff !important;
  border: 0 !important;
  border-radius: 99px !important;
  padding: 9px 16px !important;
  min-height: 44px !important;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(43, 26, 16, 0.18) !important;
}
.bh-cart:focus-visible {
  outline: 2px solid #fff !important;
  outline-offset: 2px !important;
}
.bh-wrap {
  height: 420vh;
  position: relative;
  background: var(--cream);
}
.bh-stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  background: linear-gradient(180deg, #b9713b, #c8894f 50%, #e0b175);
}
.bh-canvas {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 62%;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 28%);
  mask-image: linear-gradient(90deg, transparent, #000 28%);
}
.bh-copy {
  position: absolute;
  left: 5vw;
  top: 50%;
  transform: translateY(-50%);
  width: min(440px, 42vw);
  color: #fff;
  z-index: 3;
}
.bh-copy h1 {
  font: 800 clamp(40px, 6vw, 88px)/1 Unbounded, sans-serif;
  margin: 0 0 14px;
  animation: bh-in 0.45s ease both;
}
.bh-copy p {
  font-size: 18px;
  line-height: 1.45;
  margin: 0 0 24px;
  color: #fff8ee;
  animation: bh-in 0.45s 0.05s ease both;
}
@keyframes bh-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
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
  background: rgba(43, 26, 16, 0.82);
  border-radius: 18px;
  padding: 14px 16px;
  backdrop-filter: blur(8px);
}
.bh-card strong {
  display: block;
  font-size: 15px;
  color: #fff;
  font-variant-numeric: tabular-nums;
}
.bh-card span {
  font-size: 13px;
  color: #fff8ee;
  opacity: 0.85;
}
.bh-btn {
  font: 600 14px Manrope, sans-serif !important;
  border-radius: 99px !important;
  padding: 11px 18px !important;
  border: 2px solid #fff !important;
  cursor: pointer;
  transition: transform 0.15s, background 0.2s, color 0.2s !important;
  min-height: 44px !important;
  min-width: 44px !important;
  box-shadow: none !important;
}
.bh-btn:focus-visible {
  outline: 2px solid #fff !important;
  outline-offset: 2px !important;
}
.bh-btn:active {
  transform: scale(0.95);
}
.bh-btn:disabled {
  opacity: 0.4 !important;
  cursor: not-allowed;
}
.bh-btn.solid {
  background: #fff !important;
  color: #2b1a10 !important;
}
.bh-btn.ghost {
  background: transparent !important;
  color: #fff !important;
}
.bh-hint {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 13px;
  transition: opacity 0.3s;
  z-index: 3;
  pointer-events: none;
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
  background: #fff;
  transform-origin: left;
}
.bh-loader {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  font: 600 16px Manrope, sans-serif;
  z-index: 5;
  background: #b9713b;
}
.bh-menu {
  padding: 88px 5vw 96px;
  max-width: 1180px;
  margin: 0 auto;
}
.bh-menu-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 22px;
}
.bh-eyebrow {
  margin: 0 0 8px;
  font: 600 11px/1 Manrope, sans-serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.65;
}
.bh-menu h2 {
  font: 800 clamp(32px, 5vw, 56px)/0.96 Unbounded, sans-serif;
  margin: 0;
  color: var(--ink);
}
.bh-count {
  font: 500 13px Manrope, sans-serif;
  opacity: 0.7;
}
.bh-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}
.bh-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}
.bh-item {
  border: 2px solid var(--ink) !important;
  border-radius: 22px !important;
  padding: 20px !important;
  background: transparent !important;
  color: var(--ink) !important;
  box-shadow: none !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s ease;
}
.bh-item:hover {
  transform: translateY(-3px);
}
.bh-item-head {
  padding: 0 !important;
  margin-bottom: 18px;
}
.bh-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.bh-tag {
  font: 600 10px/1 Manrope, sans-serif;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cof);
}
.bh-ic {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.85;
}
.bh-item-title {
  margin: 0 0 6px !important;
  font: 800 19px/1.15 Unbounded, sans-serif !important;
  color: var(--ink) !important;
}
.bh-item-desc {
  margin: 0 0 8px !important;
  font: 500 14px/1.4 Manrope, sans-serif !important;
  color: var(--ink) !important;
  opacity: 0.82;
}
.bh-item-spec {
  margin: 0;
  font: 400 12px/1.35 Manrope, sans-serif;
  opacity: 0.6;
}
.bh-row {
  padding: 0 !important;
  border: 0 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.bh-row b {
  font: 800 20px/1 Unbounded, sans-serif;
  font-variant-numeric: tabular-nums;
}
.bh-qty {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bh-qty-val {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.bh-menu .bh-btn {
  border-color: var(--ink) !important;
}
.bh-menu .bh-btn:focus-visible {
  outline-color: var(--ink) !important;
}
.bh-menu .solid {
  background: var(--ink) !important;
  color: var(--cream) !important;
}
.bh-menu .ghost {
  background: transparent !important;
  color: var(--ink) !important;
}
.bh-checkout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.bh-notice {
  margin: 0;
  font: 600 14px Manrope, sans-serif;
  color: var(--ink);
}

/* CTA BANNER */
.bh-cta {
  position: relative;
  overflow: hidden;
  background: #e0b175;
  color: #2b1a10;
  padding: clamp(56px, 8vw, 110px) 5vw;
}
.bh-cta-kicker {
  position: relative;
  z-index: 1;
  margin: 0 0 12px;
  font: 700 11px/1 Manrope, sans-serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.bh-cta h2 {
  position: relative;
  z-index: 1;
  margin: 0 0 18px;
  max-width: 14ch;
  font: 800 clamp(34px, 6vw, 76px)/0.94 Unbounded, sans-serif;
  letter-spacing: -0.03em;
}
.bh-cta-sub {
  position: relative;
  z-index: 1;
  margin: 0 0 28px;
  max-width: 44ch;
  font: 500 16px/1.5 Manrope, sans-serif;
  opacity: 0.88;
}
.bh-cta-btn {
  position: relative;
  z-index: 1;
  background: #2b1a10 !important;
  border-color: #2b1a10 !important;
  color: #f6efe4 !important;
}
.bh-emblem {
  position: absolute;
  right: -2%;
  top: 50%;
  width: min(52vw, 520px);
  aspect-ratio: 1;
  fill: none;
  stroke: #2b1a10;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.16;
  transform: translateY(-50%) rotate(-24deg);
  pointer-events: none;
}

/* FOOTER */
.bh-footer {
  background: #180e08;
  color: #f6efe4;
  padding: 52px 5vw calc(36px + env(safe-area-inset-bottom, 0px));
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 32px;
}
.bh-footer-logo {
  display: block;
  font: 800 22px/1 Unbounded, sans-serif;
  letter-spacing: 0.04em;
}
.bh-footer p {
  margin: 12px 0 0;
  max-width: 30ch;
  font: 400 13px/1.5 Manrope, sans-serif;
  color: rgba(246, 239, 228, 0.65);
}
.bh-footer h5 {
  margin: 0 0 12px;
  font: 700 11px/1 Manrope, sans-serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(246, 239, 228, 0.48);
}
.bh-footer button,
.bh-footer span {
  display: block;
  padding: 4px 0;
  background: none;
  border: 0;
  color: rgba(246, 239, 228, 0.86);
  font: 500 14px Manrope, sans-serif;
  text-align: left;
}
.bh-footer button {
  cursor: pointer;
}
.bh-footer button:hover {
  color: #e0b175;
}
.bh-legal {
  grid-column: 1 / -1;
  padding-top: 24px;
  border-top: 1px solid rgba(246, 239, 228, 0.12);
  font: 400 12px Manrope, sans-serif;
  color: rgba(246, 239, 228, 0.45);
}

/* TABLET ERGONOMICS (768px - 1024px & Toolbar Switcher) */
.bh-root.is-tablet .bh-copy {
  width: min(400px, 46%);
  left: 4vw;
}
.bh-root.is-tablet .bh-copy h1 {
  font-size: clamp(36px, 5vw, 56px);
}
.bh-root.is-tablet .bh-grid {
  grid-template-columns: repeat(2, 1fr);
}
.bh-root.is-tablet .bh-footer {
  grid-template-columns: 1fr 1fr;
}

/* MOBILE ERGONOMICS (<=768px & Toolbar Switcher) */
@media (max-width: 768px) {
  .bh-wrap {
    height: 380vh;
  }
  .bh-canvas {
    left: 0;
    right: auto;
    width: 100%;
    height: 58%;
    -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent);
    mask-image: linear-gradient(180deg, #000 70%, transparent);
  }
  .bh-copy {
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    transform: none;
    width: auto;
    padding: 0 18px calc(24px + env(safe-area-inset-bottom, 0px));
  }
  .bh-copy h1 {
    font-size: clamp(34px, 10vw, 48px);
  }
  .bh-copy p {
    font-size: 15px;
    margin-bottom: 14px;
  }
  .bh-card {
    flex-direction: row;
  }
  .bh-hint {
    display: none;
  }
  .bh-grid {
    grid-template-columns: 1fr;
  }
  .bh-submit {
    width: 100%;
  }
  .bh-footer {
    grid-template-columns: 1fr 1fr;
  }
  .bh-footer > div:first-child {
    grid-column: 1 / -1;
  }
}

.bh-root.is-mobile .bh-wrap {
  height: 380vh;
}
.bh-root.is-mobile .bh-canvas {
  left: 0;
  right: auto;
  width: 100%;
  height: 58%;
  -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent);
  mask-image: linear-gradient(180deg, #000 70%, transparent);
}
.bh-root.is-mobile .bh-copy {
  left: 0;
  right: 0;
  top: auto;
  bottom: 0;
  transform: none;
  width: auto;
  padding: 0 18px calc(24px + env(safe-area-inset-bottom, 0px));
}
.bh-root.is-mobile .bh-copy h1 {
  font-size: clamp(34px, 10vw, 48px);
}
.bh-root.is-mobile .bh-copy p {
  font-size: 15px;
  margin-bottom: 14px;
}
.bh-root.is-mobile .bh-card {
  flex-direction: row;
}
.bh-root.is-mobile .bh-hint {
  display: none;
}
.bh-root.is-mobile .bh-grid {
  grid-template-columns: 1fr;
}
.bh-root.is-mobile .bh-submit {
  width: 100%;
}
.bh-root.is-mobile .bh-footer {
  grid-template-columns: 1fr 1fr;
}
.bh-root.is-mobile .bh-footer > div:first-child {
  grid-column: 1 / -1;
}

@media (prefers-reduced-motion: reduce) {
  .bh-copy h1,
  .bh-copy p {
    animation: none;
  }
}
`;
