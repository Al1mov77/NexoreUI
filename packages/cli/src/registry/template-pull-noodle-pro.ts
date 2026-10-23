export const templatePullNoodlePro = {
  name: "template-pull-noodle-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-pull-noodle-pro.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

const FRAME_COUNT = 240;
const frameUrl = (dir: "desktop" | "mobile", i: number) =>
  \`/frames/noodle/\${dir}/frame_\${String(i + 1).padStart(3, "0")}.webp\`;
const fallbackFrameUrl = (dir: "desktop" | "mobile", i: number) =>
  \`/frames/\${dir}/frame_\${String(i + 1).padStart(3, "0")}.webp\`;

type Product = {
  id: string;
  name: string;
  price: number;
  note: string;
  at: number;
  tone: string;
};

const PRODUCTS: Product[] = [
  { id: "classic", name: "Classic Pull", price: 12, note: "Plain hand-pulled noodles, light broth", at: 0.12, tone: "#ffe2b8" },
  { id: "chili", name: "Chili Oil", price: 14, note: "Hot chili oil, garlic, scallions", at: 0.62, tone: "#ff8a4c" },
  { id: "sesame", name: "Sesame Crunch", price: 13, note: "Toasted sesame and crispy shallots", at: 0.93, tone: "#ffd34e" },
  { id: "beef", name: "Spicy Beef", price: 16, note: "Slow-braised beef, Sichuan pepper", at: 0.62, tone: "#e5603d" },
  { id: "veggie", name: "Veggie Garden", price: 12, note: "Bok choy, mushrooms, black vinegar", at: 0.62, tone: "#b7d97a" },
  { id: "extra", name: "Extra Noodles", price: 4, note: "Another pull, because why not", at: 0.3, tone: "#fff0d0" },
];

const HERO = PRODUCTS.slice(0, 3);

const CHAPTERS = [
  { from: 0, title: "Pull.", text: "Hand-pulled noodles, made while you watch." },
  { from: 0.25, title: "Stretch.", text: "Fresh dough, no shortcuts, no machines." },
  { from: 0.55, title: "Pile it high.", text: "Straight from the pull into the bowl." },
  { from: 0.82, title: "Slurp.", text: "Chili oil, sesame, steam. Order now." },
];

const STEPS = [
  ["01", "Choose", "Pick a bowl and your spice level."],
  ["02", "We pull", "Dough is stretched to order, never pre-made."],
  ["03", "Slurp", "A hot bowl at your table in 8 minutes."],
];

const STATS = [
  ["8 min", "from dough to bowl"],
  ["100%", "hand-pulled, zero machines"],
  ["12", "sauces made in-house"],
  ["0", "pre-made noodles"],
];

const FAQ = [
  ["How fresh are the noodles?", "Every portion is pulled by hand after you order."],
  ["Do you have vegetarian options?", "Yes. Veggie Garden is fully plant-based, and any bowl can swap the broth."],
  ["How spicy is the chili oil?", "Medium by default. Ask for mild or extra hot at the counter."],
  ["Do you deliver?", "Yes, within 3 miles. Noodles travel in a separate box so they stay springy."],
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

export default function PullNoodleTemplate({
  brandName = "PULL",
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

  const [containerWidth, setContainerWidth] = useState(1200);
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string>("classic");
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [light, setLight] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const isMobile = deviceMode === "mobile" || containerWidth <= 768;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth <= 1024);
  const dir: "desktop" | "mobile" = isMobile ? "mobile" : "desktop";
  const brand = config.brandName || "PULL";

  const total = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const sum = useMemo(() => PRODUCTS.reduce((s, d) => s + (cart[d.id] || 0) * d.price, 0), [cart]);

  const add = (id: string, n = 1) => {
    setDone(false);
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + n);
      if (next === 0) {
        const { [id]: _, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: next };
    });
  };

  useEffect(() => {
    let alive = true;
    imgs.current = [];
    lastDrawn.current = -1;
    setLoaded(0);

    const list: HTMLImageElement[] = new Array(FRAME_COUNT);
    let doneCount = 0;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.src = frameUrl(dir, i);
        im.onload = () => {
          if (!alive) return resolve();
          doneCount++;
          setLoaded(doneCount);
          if (i === 0) draw(0);
          resolve();
        };
        im.onerror = () => {
          im.src = fallbackFrameUrl(dir, i);
          im.onload = () => {
            if (!alive) return resolve();
            doneCount++;
            setLoaded(doneCount);
            if (i === 0) draw(0);
            resolve();
          };
          im.onerror = () => resolve();
        };
        list[i] = im;
      });

    imgs.current = list;

    (async () => {
      await Promise.all(Array.from({ length: Math.min(20, FRAME_COUNT) }, (_, i) => loadOne(i)));
      const batch = 20;
      for (let i = 20; i < FRAME_COUNT && alive; i += batch) {
        await Promise.all(
          Array.from({ length: Math.min(batch, FRAME_COUNT - i) }, (_, k) => loadOne(i + k))
        );
      }
    })();

    return () => {
      alive = false;
    };
  }, [dir]);

  const draw = useCallback((idx: number) => {
    const c = canvasRef.current;
    const im = imgs.current[idx];
    if (!c || !im || !im.complete || !im.naturalWidth) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    if (c.width !== im.naturalWidth || c.height !== im.naturalHeight) {
      c.width = im.naturalWidth;
      c.height = im.naturalHeight;
    }
    ctx.drawImage(im, 0, 0);
    lastDrawn.current = idx;
  }, []);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const scroller = findNearestScroller(rootRef.current);

    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const viewportH = scroller instanceof Window ? window.innerHeight : scroller.clientHeight;
      const scrollerTop = scroller instanceof Window ? 0 : scroller.getBoundingClientRect().top;
      const relativeTop = r.top - scrollerTop;
      const max = Math.max(1, el.offsetHeight - viewportH);
      target.current = Math.min(1, Math.max(0, -relativeTop / max));

      setLight(-relativeTop > el.offsetHeight - viewportH * 0.85);
    };

    onScroll();
    const scrollTarget = scroller instanceof Window ? window : scroller;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const tick = () => {
      current.current += (target.current - current.current) * (reduce ? 1 : 0.1);
      if (Math.abs(target.current - current.current) < 0.0005) {
        current.current = target.current;
      }
      const p = current.current;
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))));
      if (idx !== lastDrawn.current) {
        draw(idx);
      }
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [draw, dir]);

  useEffect(() => {
    if (loaded > 0) {
      draw(Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(current.current * (FRAME_COUNT - 1)))));
    }
  }, [loaded, draw]);

  const jumpTo = (p: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const scroller = findNearestScroller(rootRef.current);
    const viewportH = scroller instanceof Window ? window.innerHeight : scroller.clientHeight;
    const max = el.offsetHeight - viewportH;

    if (scroller instanceof Window) {
      const top = el.offsetTop + max * p;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      const elRect = el.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const top = elRect.top - scrollerRect.top + scroller.scrollTop + max * p;
      scroller.scrollTo({ top, behavior: "smooth" });
    }
  };

  const toMenu = () => {
    const menu = rootRef.current?.querySelector("#menu");
    if (!menu) return;
    menu.scrollIntoView({ behavior: "smooth" });
  };

  const chapter = [...CHAPTERS].reverse().find((c) => progress >= c.from) || CHAPTERS[0];
  const item = PRODUCTS.find((d) => d.id === active) || PRODUCTS[0];
  const fade = Math.min(1, Math.max(0, (progress - 0.94) / 0.06));
  const ready = loaded >= FRAME_COUNT * 0.45;

  return (
    <div
      ref={rootRef}
      className={\`bh-root \${isMobile ? "is-mobile" : isTablet ? "is-tablet" : "is-desktop"}\`}
      style={{ overflowX: "clip", position: "relative" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800;900&family=Manrope:wght@400;500;600;700&display=swap"
      />
      <style>{CSS}</style>

      {/* HEADER */}
      <header className={\`bh-bar\${light ? " light" : ""}\`}>
        <b>{brand}</b>
        <button type="button" className="bh-cart" onClick={toMenu}>
          Cart · {total}
          {sum ? \` · $\${sum}\` : ""}
        </button>
      </header>

      {/* HERO */}
      <div ref={wrapRef} className="bh-wrap">
        <section className="bh-stage" style={{ opacity: 1 - fade * 0.35 }}>
          <canvas
            ref={canvasRef}
            className="bh-canvas"
            aria-label="Hands pulling fresh noodles into a red bowl"
          />

          {!ready && (
            <div className="bh-loader">
              <div className="bh-loader-spinner" />
              <span>Boiling water… {Math.min(100, Math.round((loaded / FRAME_COUNT) * 100))}%</span>
            </div>
          )}

          <div className="bh-copy">
            <h1 key={chapter.title}>{chapter.title}</h1>
            <p key={chapter.text}>{chapter.text}</p>
            <div className="bh-chips">
              {HERO.map((d) => (
                <button
                  type="button"
                  key={d.id}
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
                  {item.name} · \${item.price}
                </strong>
                <span>{item.note}</span>
              </div>
              <button
                type="button"
                className="bh-btn solid"
                onClick={() => add(item.id)}
              >
                Add to cart
              </button>
            </div>
          </div>

          <div className="bh-hint" style={{ opacity: progress < 0.03 ? 1 : 0 }}>
            Scroll — watch the pull
          </div>
          <div className="bh-line">
            <i style={{ transform: \`scaleX(\${progress})\` }} />
          </div>
        </section>
      </div>

      {/* MENU */}
      <section id="menu" className="sec">
        <h2>The bowls</h2>
        <div className="rail">
          {PRODUCTS.map((d) => (
            <article key={d.id} className="hit">
              <div
                className="pic"
                style={{
                  background: \`radial-gradient(circle at 30% 30%, #fff8 0, \${d.tone} 62%)\`,
                }}
              >
                {d.name}
              </div>
              <p>{d.note}</p>
              <div className="row">
                <b>\${d.price}</b>
                <div className="qty">
                  <button
                    type="button"
                    className="bh-btn ghost"
                    aria-label="Remove one"
                    onClick={() => add(d.id, -1)}
                  >
                    −
                  </button>
                  <span>{cart[d.id] || 0}</span>
                  <button
                    type="button"
                    className="bh-btn solid"
                    aria-label="Add one"
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
            onClick={() => setDone(true)}
          >
            {done
              ? "Order placed — pulling now!"
              : total
              ? \`Checkout · $\${sum}\`
              : "Pick a bowl"}
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec alt">
        <h2>How it works</h2>
        <div className="steps">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="step">
              <b>{n}</b>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="nums">
        {STATS.map(([n, t]) => (
          <div key={n}>
            <b>{n}</b>
            <span>{t}</span>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="sec faq">
        <h2>Good questions</h2>
        <div className="faq-list">
          {FAQ.map(([q, a], idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={q}
                className={\`faq-item \${isOpen ? "open" : ""}\`}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="faq-q">
                  <span>{q}</span>
                  <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && <p className="faq-a">{a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div>
          <h2>Hot. Fresh. Pulled.</h2>
          <p>Build your bowl and we will start pulling the second you order.</p>
          <button type="button" className="bh-btn solid" onClick={toMenu}>
            Order now
          </button>
        </div>
        <img
          src={frameUrl("desktop", FRAME_COUNT - 1)}
          alt="A bowl of noodles with chili oil"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackFrameUrl("desktop", FRAME_COUNT - 1);
          }}
        />
      </section>

      {/* FOOTER */}
      <footer className="ft">
        <div className="big" aria-hidden="true">
          {brand}
        </div>
        <div className="cols">
          <div>
            <h4>Find us</h4>
            <p>
              24 Mercer St, New York
              <br />
              118 Bedford Ave, Brooklyn
            </p>
          </div>
          <div>
            <h4>Hours</h4>
            <p>
              Daily 11am – 11pm
              <br />
              Late night Fri–Sat until 2am
            </p>
          </div>
          <div>
            <h4>Follow</h4>
            <p>
              <a href="#instagram">Instagram</a>
              <br />
              <a href="#tiktok">TikTok</a>
              <br />
              <a href="#x">X</a>
            </p>
          </div>
          <div>
            <h4>Noodle news</h4>
            <div className="sub">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email"
              />
              <button
                type="button"
                className="bh-btn solid"
                onClick={() => {
                  if (email) {
                    setSubscribed(true);
                    setEmail("");
                    setTimeout(() => setSubscribed(false), 3000);
                  }
                }}
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
        <div className="copy">
          © 2026 {brand} Noodle Bar. All rights reserved. <a href="#privacy">Privacy policy</a>
        </div>
      </footer>
    </div>
  );
}

const CSS = \`
:root {
  --cream: #fff4ec;
  --ink: #2a0d0b;
  --card: #ffffff;
  --alt: #ffe3d3;
  --red: #5e1411;
  --gold: #ffc845;
}
@media (prefers-color-scheme: dark) {
  :root {
    --cream: #170a09;
    --ink: #fff4ec;
    --card: #2a1210;
    --alt: #1f0e0c;
  }
}

.bh-root {
  box-sizing: border-box;
  margin: 0;
  font-family: 'Manrope', system-ui, -apple-system, sans-serif;
  background: var(--cream);
  color: var(--ink);
  line-height: 1.5;
}
.bh-root * {
  box-sizing: border-box;
}

.bh-bar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(14px + env(safe-area-inset-top, 0px)) 24px 14px;
  font: 800 18px 'Unbounded', sans-serif;
  color: #fff;
  letter-spacing: 0.06em;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
}
.bh-bar b {
  transition: color 0.3s ease;
}
.bh-bar.light {
  background: var(--cream);
  box-shadow: 0 1px 0 rgba(42, 13, 11, 0.12);
  color: var(--ink);
}
.bh-bar.light b {
  color: var(--ink);
}

.bh-cart {
  font: 700 13px 'Manrope', sans-serif;
  color: #2a0d0b;
  background: #ffc845;
  border: 0;
  border-radius: 99px;
  padding: 10px 16px;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
  min-height: 40px;
}
.bh-cart:hover {
  filter: brightness(1.05);
}
.bh-cart:active {
  transform: scale(0.96);
}

.bh-wrap {
  height: 520vh;
  position: relative;
}
.bh-root.is-mobile .bh-wrap {
  height: 460vh;
}

.bh-stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  background: linear-gradient(180deg, #741e20 0%, #5a1514 60%, #2a1815 100%);
}
.bh-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(90deg, #4a0f0e 0%, #4a0f0e 24%, rgba(74, 15, 14, 0) 52%);
}

.bh-canvas {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 74%;
  object-fit: cover;
  object-position: 70% 50%;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 16%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 16%);
}

.bh-copy {
  position: absolute;
  left: 5vw;
  top: 50%;
  transform: translateY(-50%);
  width: min(440px, 38vw);
  color: #fff;
  z-index: 3;
}
.bh-copy h1 {
  font: 800 clamp(42px, 6vw, 84px)/1 'Unbounded', sans-serif;
  margin: 0 0 16px;
  letter-spacing: -0.03em;
}
.bh-copy p {
  font-size: 18px;
  line-height: 1.5;
  margin: 0 0 24px;
  color: #ffe3d3;
}

.bh-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.bh-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  background: rgba(30, 6, 5, 0.88);
  color: #fff;
  border-radius: 18px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
}
.bh-card strong {
  display: block;
  font-size: 15px;
}
.bh-card span {
  font-size: 13px;
  opacity: 0.8;
}

.bh-btn {
  font: 700 14px 'Manrope', sans-serif;
  border-radius: 99px;
  padding: 11px 20px;
  border: 2px solid #fff;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease, filter 0.2s ease;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bh-btn:focus-visible,
.bh-cart:focus-visible {
  outline: 3px solid #ffc845;
  outline-offset: 2px;
}
.bh-btn:active {
  transform: scale(0.96);
}
.bh-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.bh-btn.solid {
  background: #ffc845;
  border-color: #ffc845;
  color: #2a0d0b;
}
.bh-btn.solid:hover:not(:disabled) {
  filter: brightness(1.05);
}
.bh-btn.ghost {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}
.bh-btn.ghost:hover {
  background: rgba(255, 255, 255, 0.15);
}

.bh-hint {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
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
  z-index: 3;
}
.bh-line i {
  display: block;
  height: 100%;
  background: #ffc845;
  transform-origin: left;
}

.bh-loader {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #fff;
  z-index: 10;
  background: #4a0f0e;
  font: 700 16px 'Unbounded', sans-serif;
}
.bh-loader-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 200, 69, 0.3);
  border-top-color: #ffc845;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

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

.sec h2,
.cta h2 {
  font: 800 clamp(32px, 5vw, 56px)/1.08 'Unbounded', sans-serif;
  margin: 0 0 36px;
  letter-spacing: -0.03em;
}

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
}
.pic {
  height: 160px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  font: 800 20px 'Unbounded', sans-serif;
  color: #2a0d0b;
  text-align: center;
  padding: 12px;
}
.hit p {
  margin: 14px 0;
  opacity: 0.85;
  font-size: 14px;
  min-height: 44px;
  flex: 1;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.row b {
  font: 800 22px 'Unbounded', sans-serif;
}
.qty {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
}
.sec .bh-btn {
  border-color: var(--ink);
}
.sec .bh-btn.solid {
  background: var(--ink);
  color: var(--cream);
  border-color: var(--ink);
}
.sec .bh-btn.ghost {
  color: var(--ink);
  border-color: var(--ink);
}

.order {
  margin-top: 32px;
}
.order .bh-btn {
  min-width: 220px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.step {
  display: flex;
  flex-direction: column;
}
.step b {
  font: 800 clamp(56px, 8vw, 100px)/1 'Unbounded', sans-serif;
  color: #e5483a;
}
.step h3 {
  font: 800 24px 'Unbounded', sans-serif;
  margin: 12px 0 8px;
}
.step p {
  margin: 0;
  opacity: 0.85;
  font-size: 15px;
  line-height: 1.5;
}

.nums {
  background: #ffc845;
  color: #2a0d0b;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 72px 5vw;
}
.nums b {
  display: block;
  font: 800 clamp(40px, 6vw, 76px)/1 'Unbounded', sans-serif;
}
.nums span {
  font-size: 16px;
  font-weight: 700;
  margin-top: 6px;
  display: block;
}

.faq {
  max-width: 860px;
}
.faq-list {
  display: flex;
  flex-direction: column;
}
.faq-item {
  border-bottom: 2px solid var(--ink);
  padding: 20px 0;
  cursor: pointer;
  user-select: none;
}
.faq-q {
  font: 800 clamp(16px, 2vw, 22px) 'Unbounded', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.faq-icon {
  font-size: 28px;
  line-height: 1;
  color: #e5483a;
  font-weight: 800;
}
.faq-a {
  margin: 14px 0 0;
  opacity: 0.85;
  max-width: 65ch;
  font-size: 15px;
  line-height: 1.6;
}

.cta {
  background: var(--red);
  color: #fff4ec;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 36px;
  align-items: center;
  padding: 96px 5vw;
  overflow: hidden;
}
.cta p {
  font-size: 18px;
  margin: 0 0 28px;
  max-width: 38ch;
  color: #ffe3d3;
}
.cta img {
  width: 100%;
  border-radius: 28px;
  display: block;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
}
.cta .bh-btn.solid {
  background: #ffc845;
  border-color: #ffc845;
  color: #2a0d0b;
}

.ft {
  background: #1a0807;
  color: #fff4ec;
  padding: 80px 5vw calc(36px + env(safe-area-inset-bottom, 0px));
}
.ft .big {
  font: 800 clamp(80px, 26vw, 360px)/0.88 'Unbounded', sans-serif;
  color: #ffc845;
  margin-bottom: 56px;
  letter-spacing: -0.04em;
  white-space: nowrap;
  overflow: hidden;
}
.ft .cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.ft h4 {
  font: 800 15px 'Unbounded', sans-serif;
  margin: 0 0 14px;
  color: #ffc845;
}
.ft p {
  margin: 0;
  line-height: 1.7;
  opacity: 0.9;
  font-size: 14px;
}
.ft a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.sub {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.sub input {
  flex: 1 1 150px;
  min-height: 44px;
  border-radius: 99px;
  border: 2px solid rgba(255, 244, 236, 0.35);
  background: transparent;
  color: #fff4ec;
  padding: 0 18px;
  font: inherit;
  font-size: 14px;
}
.sub input:focus-visible {
  outline: 2px solid #ffc845;
  outline-offset: 2px;
}
.ft .bh-btn {
  border-color: #ffc845;
  background: #ffc845;
  color: #2a0d0b;
}
.copy {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 244, 236, 0.2);
  font-size: 13px;
  opacity: 0.7;
}

/* TABLET MODE */
.bh-root.is-tablet .bh-copy {
  width: min(390px, 44vw);
}
.bh-root.is-tablet .bh-canvas {
  width: 78%;
}
.bh-root.is-tablet .steps {
  gap: 16px;
}
.bh-root.is-tablet .ft .cols {
  grid-template-columns: 1fr 1fr;
}

/* MOBILE MODE */
.bh-root.is-mobile .bh-stage::before {
  display: none;
}
.bh-root.is-mobile .bh-stage {
  background: #4a1110;
}
.bh-root.is-mobile .bh-canvas {
  left: 0;
  right: auto;
  top: calc(56px + env(safe-area-inset-top, 0px));
  width: 100%;
  height: auto;
  aspect-ratio: 5/4;
  -webkit-mask-image: linear-gradient(180deg, #000 74%, transparent);
  mask-image: linear-gradient(180deg, #000 74%, transparent);
}
.bh-root.is-mobile .bh-copy {
  left: 0;
  right: 0;
  top: auto;
  bottom: 0;
  transform: none;
  width: auto;
  padding: 0 20px calc(24px + env(safe-area-inset-bottom, 0px));
}
.bh-root.is-mobile .bh-copy h1 {
  font-size: clamp(34px, 10vw, 48px);
}
.bh-root.is-mobile .bh-copy p {
  font-size: 15px;
  margin-bottom: 14px;
}
.bh-root.is-mobile .bh-hint {
  display: none;
}
.bh-root.is-mobile .sec {
  padding: 64px 20px;
}
.bh-root.is-mobile .steps {
  grid-template-columns: 1fr;
}
.bh-root.is-mobile .nums {
  grid-template-columns: 1fr 1fr;
  padding: 56px 20px;
}
.bh-root.is-mobile .cta {
  grid-template-columns: 1fr;
  padding: 64px 20px;
}
.bh-root.is-mobile .ft .cols {
  grid-template-columns: 1fr;
}
\`;
`,
};
