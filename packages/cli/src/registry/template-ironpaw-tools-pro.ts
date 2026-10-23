export const templateIronpawToolsPro = {
  name: "template-ironpaw-tools-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ironpaw-tools-pro.tsx",
  content: `"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback, type SyntheticEvent } from "react";

const FRAME_COUNT = 240;
const frameUrl = (i: number) => \`/frames/\${String(i + 1).padStart(3, "0")}.webp\`;

const KEYS: [number, number][] = [
  [0, 0], [0.05, 36], [0.16, 71], [0.175, 106], [0.31, 134], [0.38, 146], [0.84, 239], [1, 239],
];

const BG =
  "linear-gradient(to bottom, rgb(118,14,22) 0%, rgb(120,17,18) 10%, rgb(127,20,20) 20%, rgb(135,23,24) 30%, rgb(143,29,28) 40%, rgb(147,33,29) 50%, rgb(156,38,34) 60%, rgb(166,45,42) 70%, rgb(191,64,61) 80%, rgb(197,68,63) 90%, rgb(193,65,58) 100%)";

const CAPTIONS = [
  { a: 0.06, b: 0.17, text: "Swing." },
  { a: 0.18, b: 0.33, text: "Drop." },
  { a: 0.34, b: 0.6, text: "Smash." },
  { a: 0.6, b: 0.83, text: "Build." },
];

type IconName = "drill" | "disc" | "hammer" | "wrench" | "tape" | "saw" | "driver" | "level";
const TASKS = ["All", "Drill", "Grind", "Hammer", "Measure", "Cut", "Fasten"] as const;
type Task = (typeof TASKS)[number];

interface Product {
  task: Exclude<Task, "All">;
  icon: IconName;
  name: string;
  spec: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { task: "Drill", icon: "drill", name: "Cordless drill driver 18 V", spec: "Two batteries, 60 N·m torque", price: 89 },
  { task: "Grind", icon: "disc", name: "Angle grinder 125 mm", spec: "900 W, variable speed", price: 55 },
  { task: "Hammer", icon: "hammer", name: "Sledge hammer 3 lb", spec: "Fibreglass handle", price: 29 },
  { task: "Measure", icon: "tape", name: "Tape measure 8 m", spec: "Magnetic hook, steel blade", price: 12 },
  { task: "Drill", icon: "drill", name: "Rotary hammer SDS-Plus", spec: "3 modes, 3.2 J impact energy", price: 119 },
  { task: "Cut", icon: "saw", name: "Hand saw 450 mm", spec: "Hardened teeth, soft grip", price: 15 },
  { task: "Fasten", icon: "driver", name: "Screwdriver set, 12 pieces", spec: "CrV steel, magnetic tips", price: 22 },
  { task: "Measure", icon: "level", name: "Spirit level 60 cm", spec: "Three vials, magnetic edge", price: 18 },
  { task: "Fasten", icon: "wrench", name: "Adjustable wrench 250 mm", spec: "Chrome vanadium steel", price: 17 },
  { task: "Grind", icon: "disc", name: "Random orbit sander", spec: "125 mm pad, dust bag", price: 48 },
  { task: "Cut", icon: "saw", name: "Jigsaw 650 W", spec: "Orbital action, work light", price: 44 },
  { task: "Fasten", icon: "wrench", name: "Combination pliers 200 mm", spec: "Insulated handles, 1000 V", price: 11 },
];

const TILES: { icon: IconName; title: string; text: string }[] = [
  { icon: "drill", title: "Power tools", text: "Muscle for big jobs" },
  { icon: "hammer", title: "Hand tools", text: "No outlet needed" },
  { icon: "disc", title: "Bits & blades", text: "Discs, drills, drivers" },
  { icon: "tape", title: "Measuring", text: "Accurate to the millimetre" },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function frameAt(p: number): number {
  for (let i = 1; i < KEYS.length; i++) {
    if (p <= KEYS[i][0]) {
      const [p0, f0] = KEYS[i - 1];
      const [p1, f1] = KEYS[i];
      return f0 + (f1 - f0) * ((p - p0) / (p1 - p0));
    }
  }
  return FRAME_COUNT - 1;
}

function Symbols() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="i-drill" viewBox="0 0 64 64"><path d="M8 22h30a8 8 0 0 1 8 8v4a4 4 0 0 1-4 4H8z" /><path d="M18 38l-5 18h11l5-18" /><path d="M46 26h8v12h-8z" /><path d="M54 32h6M14 28h12" /></symbol>
      <symbol id="i-disc" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" /><circle cx="32" cy="32" r="14" /><circle cx="32" cy="32" r="4" /><path d="M32 6v4M32 54v4M6 32h4M54 32h4" /></symbol>
      <symbol id="i-hammer" viewBox="0 0 64 64"><path d="M10 10h30v14H10z" /><path d="M40 12c8 0 12 3 14 8-4-1-8-1-14 0" /><rect x="21" y="24" width="8" height="34" rx="3" /></symbol>
      <symbol id="i-wrench" viewBox="0 0 64 64"><path d="M44 8a12 12 0 0 0-10 17L12 47a6 6 0 0 0 8 8l22-22a12 12 0 0 0 17-10l-8 7-8-3-2-8 7-8z" /></symbol>
      <symbol id="i-tape" viewBox="0 0 64 64"><rect x="8" y="16" width="40" height="32" rx="8" /><circle cx="28" cy="32" r="8" /><path d="M48 40h10v8H48M52 40v8" /></symbol>
      <symbol id="i-saw" viewBox="0 0 64 64"><path d="M8 20h30l18 14H8z" /><path d="M8 34l4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6" /><rect x="12" y="23" width="12" height="7" rx="3" /></symbol>
      <symbol id="i-driver" viewBox="0 0 64 64"><rect x="8" y="24" width="20" height="16" rx="7" /><path d="M28 32h26M54 32l4-3v6zM14 24v16M20 24v16" /></symbol>
      <symbol id="i-level" viewBox="0 0 64 64"><rect x="6" y="22" width="52" height="20" rx="4" /><rect x="24" y="27" width="16" height="10" rx="5" /><path d="M12 27v10M50 27v10" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></symbol>
    </svg>
  );
}

function Arrow({ className = "ic arrow-ic" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <use href="#i-arrow" />
    </svg>
  );
}

function Icon({ name, className = "ic" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <use href={\`#i-\${name}\`} />
    </svg>
  );
}

export default function IronpawToolsTemplate({
  brandName = "Ironpaw",
  deviceMode = "desktop",
}: {
  brandName?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { brandName };
  const rootRef = useRef<HTMLDivElement>(null);
  const brand = config.brandName || "Ironpaw";

  const [containerWidth, setContainerWidth] = useState(1200);
  const [task, setTask] = useState<Task>("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(0);
  const [bump, setBump] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);

  const list = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (task === "All" || p.task === task) &&
          (!query || \`\${p.name} \${p.spec}\`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [task, query],
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

  const goShop = useCallback(
    (e?: SyntheticEvent) => {
      e?.preventDefault();
      const el = rootRef.current?.querySelector("#shop");
      if (!el) return;
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    },
    [prefersReducedMotion],
  );

  const addToCart = (name: string) => {
    setCart((c) => c + 1);
    setBump(true);
    setJustAdded(name);
    window.setTimeout(() => setBump(false), 420);
    window.setTimeout(() => setJustAdded((cur) => (cur === name ? null : cur)), 1400);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends Element>(s: string) => root.querySelector(s) as T;
    const story = $<HTMLElement>("#story");
    const stage = $<HTMLElement>("#stage");
    const cv = $<HTMLCanvasElement>("#cv");
    const ctx = cv ? cv.getContext("2d") : null;
    const bgbox = $<HTMLElement>("#bgbox");
    const panel = $<HTMLElement>("#panel");
    const copy = $<HTMLElement>("#copy");
    const hcard = $<HTMLElement>("#hcard");
    const hint = $<HTMLElement>("#hint");
    const topbar = $<HTMLElement>("#top");
    const loader = $<HTMLElement>("#loader");
    const bar = loader ? (loader.firstElementChild as HTMLElement) : null;
    const ham = $<SVGElement>("#bigham");
    const cta = $<HTMLElement>("#cta");
    const caps = Array.from(root.querySelectorAll<HTMLElement>(".cap"));

    if (!story || !stage || !cv || !ctx || !bgbox || !panel || !copy || !hcard || !hint || !topbar || !loader || !bar || !ham || !cta) {
      return;
    }

    const scroller = findNearestScroller(story);
    const imgs: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let done = 0;
    let next = 0;
    let dirty = true;
    let shownIm: HTMLImageElement | null = null;
    let dead = false;

    const loadOne = (i: number) =>
      new Promise<void>((res) => {
        const im = new Image();
        im.decoding = "async";
        const fin = (ok: boolean) => {
          if (ok) imgs[i] = im;
          done++;
          if (bar) bar.style.transform = \`scaleX(\${done / FRAME_COUNT})\`;
          dirty = true;
          if (done === FRAME_COUNT && loader) loader.classList.add("off");
          res();
        };
        im.onload = () => fin(true);
        im.onerror = () => fin(false);
        im.src = frameUrl(i);
      });

    const worker = async () => {
      while (!dead && next < FRAME_COUNT) {
        await loadOne(next++);
      }
    };
    for (let k = 0; k < 8; k++) void worker();

    const layout = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const land = (deviceMode ? deviceMode === "desktop" : W / H > 1.05) && !isMobile;
      let ch: number;
      let top: number;
      let cx: number;
      if (land) {
        ch = H;
        top = 0;
        cx = W > 1000 ? W * 0.72 : W * 0.62;
      } else {
        ch = Math.min(H * 0.8, W * 1.32);
        top = H - ch;
        cx = W * 0.5;
      }
      const cw = (ch * 16) / 9;
      const left = cx - cw / 2;
      Object.assign(cv.style, { left: \`\${left}px\`, top: \`\${top}px\`, width: \`\${cw}px\`, height: \`\${ch}px\` });
      Object.assign(bgbox.style, { top: \`\${top}px\`, height: \`\${ch}px\`, background: BG });
      const parts: string[] = [];
      if (left > 0) parts.push(\`linear-gradient(to right, transparent 0, #000 \${Math.min(0.16 * cw, 220)}px)\`);
      if (top > 0) parts.push(\`linear-gradient(to bottom, transparent 0, #000 \${Math.min(0.14 * ch, 90)}px)\`);
      const m = parts.length ? parts.join(",") : "none";
      cv.style.webkitMaskImage = cv.style.maskImage = m;
      cv.style.webkitMaskComposite = "source-in";
      cv.style.maskComposite = "intersect";
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const bw = Math.min(1024, Math.round(cw * dpr));
      cv.width = bw;
      cv.height = Math.round((bw * 9) / 16);
      dirty = true;
      shownIm = null;
    };

    const draw = (f: number) => {
      const i = clamp(Math.round(f), 0, FRAME_COUNT - 1);
      let im = imgs[i];
      if (!im) {
        for (let j = i; j >= 0; j--) {
          if (imgs[j]) {
            im = imgs[j];
            break;
          }
        }
      }
      if (!im || (im === shownIm && !dirty)) return;
      shownIm = im;
      dirty = false;
      ctx.drawImage(im, 0, 0, cv.width, cv.height);
    };

    let cur = 0;
    let tgt = 0;
    let raf = 0;

    const readTarget = () => {
      const r = story.getBoundingClientRect();
      const scrollerTop = scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const topOffset = r.top - scrollerTop;
      const totalTravel = story.offsetHeight - stage.offsetHeight;
      tgt = totalTravel > 0 ? clamp(-topOffset / totalTravel) : 0;
    };

    const render = (p: number) => {
      draw(frameAt(p));
      const t = clamp(p / 0.1);
      copy.style.opacity = String(1 - t);
      hcard.style.opacity = String(1 - t);
      copy.style.transform = \`translate3d(0,\${-t * 90}px,0)\`;
      copy.style.visibility = t >= 1 ? "hidden" : "visible";
      hcard.style.visibility = t >= 1 ? "hidden" : "visible";
      hint.style.opacity = String(1 - clamp(p / 0.03));
      caps.forEach((el, i) => {
        const { a, b } = CAPTIONS[i];
        const t2 = (p - a) / (b - a);
        if (t2 <= 0 || t2 >= 1) {
          el.style.opacity = "0";
          return;
        }
        const inn = ease(clamp(t2 / 0.22));
        const out = ease(clamp((1 - t2) / 0.22));
        el.style.opacity = String(Math.min(inn, out));
        el.style.transform = \`translate3d(0,\${(1 - inn) * 46 - (1 - out) * 46}px,0)\`;
      });
      const e = ease(clamp((p - 0.84) / 0.16));
      panel.style.transform = \`translate3d(0,\${(1 - e) * 100}%,0)\`;
      topbar.classList.toggle("solid", p > 0.9);
    };

    const tick = () => {
      readTarget();
      cur += (tgt - cur) * (prefersReducedMotion ? 1 : 0.13);
      if (Math.abs(tgt - cur) < 0.0004) cur = tgt;
      render(cur);
      raf = requestAnimationFrame(tick);
    };

    const onScrollHammer = () => {
      const r = cta.getBoundingClientRect();
      const scrollerTop = scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const scrollerHeight = scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
      const relTop = r.top - scrollerTop;
      const k = clamp(1 - (relTop + r.height) / (scrollerHeight + r.height));
      ham.style.transform = \`translateY(-50%) rotate(\${-52 + k * 30}deg)\`;
    };

    const roStage = new ResizeObserver(() => layout());
    roStage.observe(stage);

    window.addEventListener("resize", layout);
    scroller.addEventListener("scroll", onScrollHammer, { passive: true });
    if (scroller !== window) {
      window.addEventListener("scroll", onScrollHammer, { passive: true });
    }

    layout();
    readTarget();
    cur = tgt;
    render(cur);
    raf = requestAnimationFrame(tick);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      roStage.disconnect();
      window.removeEventListener("resize", layout);
      scroller.removeEventListener("scroll", onScrollHammer);
      if (scroller !== window) {
        window.removeEventListener("scroll", onScrollHammer);
      }
    };
  }, [findNearestScroller, isMobile, deviceMode, prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      className={\`ironpaw \${isMobile ? "is-mobile" : isTablet ? "is-tablet" : "is-desktop"}\`}
      style={{ overflowX: "clip" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;900&family=Golos+Text:wght@400;500;600&display=swap"
      />
      <style>{CSS}</style>
      <Symbols />

      <header className="top" id="top">
        <a className="logo" href="#story" aria-label={\`\${brand} Tools\`}>
          {brand}
        </a>
        <button className="btn-cat" type="button" onClick={goShop}>
          <svg className="ic" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span>Catalog</span>
        </button>
        <label className="search">
          <input
            id="q"
            type="search"
            placeholder="Search tools, bits, blades..."
            aria-label="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) goShop();
            }}
          />
          <svg className="ic" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
        </label>
        <button className={\`cart\${bump ? " bump" : ""}\`} type="button" onClick={goShop}>
          Cart <b>{cart}</b>
        </button>
      </header>

      <main>
        <section className="story" id="story">
          <div className="stage" id="stage">
            <div className="bgbox" id="bgbox" />
            {/* canvas-ok: 3D interactive raccoon scrubbing frames from preloaded video */}
            <canvas id="cv" width={1024} height={576} aria-label="A 3D raccoon smashes a watermelon with a sledgehammer" />
            <div className="loader" id="loader">
              <i />
            </div>

            <div className="hero-copy" id="copy">
              <p className="eyebrow">Pro-grade tools for people who make things</p>
              <h1>
                <span className="ln"><span>Break it.</span></span>
                <span className="ln"><span>Build it.</span></span>
              </h1>
              <p className="lede">For repairs, building sites and workshops. Find the right tool for the job.</p>
              <a className="pill" href="#shop" onClick={goShop}>
                Shop tools <i><Arrow /></i>
              </a>
            </div>

            <div className="caps" aria-hidden="true">
              {CAPTIONS.map((c) => (
                <p className="cap" key={c.text}>{c.text}</p>
              ))}
            </div>

            <aside className="hero-card" id="hcard">
              <h2>Aisles</h2>
              <a href="#shop" onClick={goShop}><span>Power tools</span><span><Arrow /></span></a>
              <a href="#shop" onClick={goShop}><span>Hand tools</span><span><Arrow /></span></a>
              <a href="#shop" onClick={goShop}><span>Accessories</span><span><Arrow /></span></a>
            </aside>

            <div className="hint" id="hint">
              <span>Scroll</span>
              <i />
            </div>

            <div className="panel" id="panel">
              <p className="crumb">Catalog · four aisles</p>
              <h2>Tool up.</h2>
              <div className="tiles">
                {TILES.map((t, i) => (
                  <a key={t.title} className={\`tile\${i === 0 ? " hot" : ""}\`} href="#shop" onClick={goShop}>
                    <em><Arrow /></em>
                    <Icon name={t.icon} />
                    <b>{t.title}</b>
                    <span>{t.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shop" id="shop">
          <div className="shop-head">
            <h3>The right tool<br />for the job</h3>
            <span className="count" aria-live="polite">
              {list.length ? \`Showing \${list.length} of \${PRODUCTS.length}\` : "Nothing found. Clear the filter or change your search."}
            </span>
          </div>
          <div className="chips" role="group" aria-label="Filter by job">
            {TASKS.map((t) => (
              <button key={t} type="button" className="chip" aria-pressed={t === task} onClick={() => setTask(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid">
            {list.map((p, i) => (
              <article className="card" key={\`\${task}-\${p.name}\`} style={{ animationDelay: \`\${i * 40}ms\` }}>
                <span className="tag">{p.task}</span>
                <Icon name={p.icon} />
                <h4>{p.name}</h4>
                <p>{p.spec}</p>
                <div className="buy">
                  <b>\${p.price.toLocaleString("en-US")}</b>
                  <button
                    type="button"
                    className={\`add\${justAdded === p.name ? " in" : ""}\`}
                    onClick={() => addToCart(p.name)}
                  >
                    {justAdded === p.name ? (
                      <span className="added-btn">
                        <svg className="ic check-ic" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Added
                      </span>
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta" id="cta">
          <svg className="ic bigham" id="bigham" viewBox="0 0 64 64" aria-hidden="true">
            <use href="#i-hammer" />
          </svg>
          <h2>Gear up for the job.</h2>
          <p>Pick the job, add the tools to your cart and get the whole kit in one order.</p>
          <a className="pill" href="#shop" onClick={goShop}>
            Browse the catalog <i><Arrow /></i>
          </a>
        </section>
      </main>

      <footer>
        <div>
          <span className="logo">{brand}</span>
          <p>Tools for repairs, building sites and workshops.</p>
        </div>
        <div>
          <h5>Catalog</h5>
          <a href="#shop" onClick={goShop}>Power tools</a>
          <a href="#shop" onClick={goShop}>Hand tools</a>
          <a href="#shop" onClick={goShop}>Bits &amp; blades</a>
        </div>
        <div>
          <h5>Support</h5>
          <a href="#shop" onClick={goShop}>Shipping</a>
          <a href="#shop" onClick={goShop}>Payment</a>
          <a href="#shop" onClick={goShop}>Returns</a>
        </div>
        <div>
          <h5>Company</h5>
          <a href="#story">About</a>
          <a href="#story">Contact</a>
        </div>
        <div className="legal">
          &copy; {brand} Tools. Demo page: products and prices are sample content.
        </div>
      </footer>
    </div>
  );
}

const CSS = \`
:root {
  --red: #E10600;
  --red-deep: #B50500;
  --ink: #16110F;
  --paper: #ECEAE5;
  --line: #D0CBC3;
  --muted: #6B645D;
  --sun: #FFC21A;
  --hero-top: rgb(118,14,22);
  --display: 'Inter Tight', 'Arial Narrow', Arial, sans-serif;
  --body: 'Golos Text', 'Segoe UI', Arial, sans-serif;
  color-scheme: light;
}

.ironpaw * {
  box-sizing: border-box;
}

.ironpaw {
  position: relative;
  width: 100%;
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font: 400 16px/1.5 var(--body);
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
}

.ironpaw a {
  color: inherit;
  text-decoration: none;
}

.ironpaw button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.ironpaw :focus-visible {
  outline: 3px solid #fff;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px var(--ink);
}

.ironpaw .ic {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  display: block;
}

.ironpaw .check-ic {
  width: 13px;
  height: 13px;
  stroke-width: 3;
  display: inline-block;
  margin-right: 4px;
}

.ironpaw .added-btn {
  display: inline-flex;
  align-items: center;
}

/* Header */
.ironpaw .top {
  position: fixed;
  z-index: 20;
  left: 12px;
  right: 12px;
  top: 12px;
  height: 58px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 10px 0 20px;
  color: #fff;
  background: rgba(225,6,0,0);
  transition: background .35s, box-shadow .35s;
}

.ironpaw .top.solid {
  background: var(--red);
  box-shadow: 0 10px 30px -12px rgba(120,10,0,.55);
}

.ironpaw .logo {
  font: 900 22px/1 var(--display);
  letter-spacing: -.045em;
  text-transform: uppercase;
  white-space: nowrap;
}

.ironpaw .btn-cat {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 6px;
  background: rgba(20,10,10,.38);
  font: 600 12px/1 var(--body);
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #fff;
  backdrop-filter: blur(6px);
}

.ironpaw .btn-cat .ic {
  font-size: 14px;
}

.ironpaw .search {
  flex: 1;
  min-width: 0;
  max-width: 560px;
  margin-left: auto;
  position: relative;
}

.ironpaw .search input {
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: 6px;
  padding: 0 40px 0 16px;
  background: rgba(255,255,255,.16);
  color: #fff;
  font: 400 13px var(--body);
  backdrop-filter: blur(6px);
}

.ironpaw .search input::placeholder {
  color: rgba(255,255,255,.7);
}

.ironpaw .search .ic {
  position: absolute;
  right: 14px;
  top: 12px;
  font-size: 14px;
  opacity: .85;
}

.ironpaw .cart {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border: 0;
  border-radius: 6px;
  background: #fff;
  color: var(--red);
  font: 700 13px/1 var(--body);
  white-space: nowrap;
}

.ironpaw .cart b {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: var(--red);
  color: #fff;
  font-size: 11px;
  padding: 0 5px;
}

.ironpaw .cart.bump {
  animation: bump .4s;
}

@keyframes bump {
  40% { transform: scale(1.12); }
}

/* Stage & Hero */
.ironpaw .story {
  position: relative;
  height: 640vh;
  height: 640svh;
}

.ironpaw .stage {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: var(--hero-top);
}

.ironpaw .bgbox {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 0;
}

.ironpaw #cv {
  position: absolute;
  z-index: 1;
  display: block;
  max-width: none;
}

.ironpaw .hero-copy {
  position: absolute;
  z-index: 2;
  left: clamp(20px,4.4vw,72px);
  top: 50%;
  margin-top: -19vh;
  width: min(46vw,640px);
  color: #fff;
  will-change: transform, opacity;
}

.ironpaw .eyebrow {
  margin: 0 0 22px;
  font: 600 11px/1.3 var(--body);
  letter-spacing: .16em;
  text-transform: uppercase;
  opacity: .82;
}

.ironpaw h1 {
  margin: 0;
  font: 900 clamp(54px,7vw,128px)/.88 var(--display);
  letter-spacing: -.045em;
  text-transform: uppercase;
}

.ironpaw .ln {
  display: block;
  overflow: hidden;
  padding-bottom: .06em;
}

.ironpaw .ln > span {
  display: block;
  animation: rise .9s cubic-bezier(.2,.8,.2,1) both;
}

.ironpaw .ln:nth-child(2) > span {
  animation-delay: .12s;
}

@keyframes rise {
  from { transform: translateY(105%); }
  to { transform: none; }
}

.ironpaw .lede {
  margin: 26px 0 28px;
  max-width: 30ch;
  font: 400 clamp(14px,1.15vw,17px)/1.45 var(--body);
  opacity: .92;
}

.ironpaw .pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 10px 0 22px;
  border-radius: 24px;
  border: 0;
  background: var(--ink);
  color: #fff;
  font: 600 12px/1 var(--body);
  letter-spacing: .1em;
  text-transform: uppercase;
  transition: transform .2s, background .2s;
}

.ironpaw .pill i {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,.14);
  font-style: normal;
  font-size: 15px;
}

.ironpaw .pill:hover {
  transform: translateY(-2px);
  background: #000;
}

.ironpaw .caps {
  position: absolute;
  z-index: 2;
  left: clamp(20px,4.4vw,72px);
  top: 50%;
  margin-top: -12vh;
  pointer-events: none;
  color: #fff;
}

.ironpaw .cap {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  font: 900 clamp(54px,9.5vw,170px)/.86 var(--display);
  letter-spacing: -.045em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  will-change: transform, opacity;
  text-shadow: 0 8px 40px rgba(60,0,0,.35);
}

.ironpaw .hero-card {
  position: absolute;
  z-index: 2;
  right: clamp(20px,3vw,48px);
  top: 50%;
  margin-top: -90px;
  width: 230px;
  padding: 20px;
  border-radius: 18px;
  background: rgba(18,10,10,.88);
  color: #fff;
}

.ironpaw .hero-card h2 {
  margin: 0 0 14px;
  font: 900 15px/1 var(--display);
  letter-spacing: .08em;
  text-transform: uppercase;
}

.ironpaw .hero-card a {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid rgba(255,255,255,.14);
  font: 500 13px var(--body);
}

.ironpaw .hero-card a:hover {
  color: #ff8a80;
}

.ironpaw .hint {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: calc(22px + env(safe-area-inset-bottom,0px));
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #fff;
  font: 600 11px/1 var(--body);
  letter-spacing: .18em;
  text-transform: uppercase;
  pointer-events: none;
}

.ironpaw .hint i {
  width: 1px;
  height: 34px;
  background: linear-gradient(#fff,transparent);
  animation: drip 1.6s ease-in-out infinite;
}

@keyframes drip {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

.ironpaw .loader {
  position: absolute;
  z-index: 6;
  left: 0;
  right: 0;
  top: 0;
  height: 3px;
  background: rgba(255,255,255,.12);
  transition: opacity .5s .2s;
}

.ironpaw .loader i {
  display: block;
  height: 100%;
  background: #fff;
  transform: scaleX(0);
  transform-origin: left;
}

.ironpaw .loader.off {
  opacity: 0;
}

/* Drawer Panel */
.ironpaw .panel {
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  bottom: 0;
  height: 84%;
  background: var(--paper);
  border-top: 6px solid var(--ink);
  transform: translate3d(0,100%,0);
  will-change: transform;
  padding: clamp(22px,4vh,44px) clamp(16px,4.4vw,72px) 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(14px,3.4vh,34px);
}

.ironpaw .crumb {
  margin: 0;
  font: 600 11px/1 var(--body);
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--muted);
}

.ironpaw .panel h2 {
  margin: 0;
  font: 900 min(15vw,25vh,230px)/.84 var(--display);
  letter-spacing: -.05em;
  text-transform: uppercase;
  color: var(--ink);
}

.ironpaw .tiles {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-auto-rows: 1fr;
  flex: 1;
  min-height: 0;
  max-height: 340px;
  gap: 0;
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.ironpaw .tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: clamp(110px,22vh,200px);
  padding: 20px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  transition: background .25s, color .25s;
}

.ironpaw .tile .ic {
  font-size: 40px;
  stroke-width: 1.8;
  margin-bottom: auto;
}

.ironpaw .tile b {
  font: 700 15px/1.2 var(--body);
}

.ironpaw .tile span {
  font: 400 13px/1.3 var(--body);
  color: var(--muted);
  transition: color .25s;
}

.ironpaw .tile em {
  position: absolute;
  right: 18px;
  top: 16px;
  font-style: normal;
  font-size: 16px;
  opacity: .5;
}

.ironpaw .tile:hover,
.ironpaw .tile.hot {
  background: var(--red);
  color: #fff;
}

.ironpaw .tile:hover span,
.ironpaw .tile.hot span {
  color: rgba(255,255,255,.85);
}

.ironpaw .tile:hover em,
.ironpaw .tile.hot em {
  opacity: 1;
}

/* Shop Catalog */
.ironpaw .shop {
  position: relative;
  z-index: 3;
  background: var(--paper);
  padding: clamp(48px,8vw,110px) clamp(16px,4.4vw,72px) clamp(56px,8vw,120px);
}

.ironpaw .shop-head {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.ironpaw h3 {
  margin: 0;
  font: 900 clamp(28px,4.6vw,64px)/.92 var(--display);
  letter-spacing: -.04em;
  text-transform: uppercase;
}

.ironpaw .count {
  font: 500 13px var(--body);
  color: var(--muted);
}

.ironpaw .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.ironpaw .chip {
  height: 40px;
  padding: 0 18px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: #fff;
  font: 600 12px/1 var(--body);
  letter-spacing: .08em;
  text-transform: uppercase;
  transition: all .2s;
}

.ironpaw .chip:hover {
  border-color: var(--ink);
}

.ironpaw .chip[aria-pressed="true"] {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}

.ironpaw .grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%,250px), 1fr));
  gap: 14px;
}

.ironpaw .card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 20px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid var(--line);
  transition: transform .3s, border-color .3s, box-shadow .3s;
  animation: drift .6s cubic-bezier(.2,.8,.2,1) both;
}

@keyframes drift {
  from { transform: translateY(22px); }
}

.ironpaw .card:hover {
  transform: translateY(-4px);
  border-color: var(--red);
  box-shadow: 0 18px 34px -22px rgba(225,6,0,.6);
}

.ironpaw .card .tag {
  font: 600 10px/1 var(--body);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--red);
}

.ironpaw .card .ic {
  font-size: 64px;
  stroke-width: 1.5;
  margin: 18px 0 22px;
  color: var(--ink);
}

.ironpaw .card h4 {
  margin: 0;
  font: 700 17px/1.2 var(--body);
}

.ironpaw .card p {
  margin: 0 0 14px;
  font: 400 13px/1.4 var(--body);
  color: var(--muted);
}

.ironpaw .buy {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ironpaw .buy b {
  font: 900 21px/1 var(--display);
  letter-spacing: -.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.ironpaw .add {
  height: 38px;
  padding: 0 16px;
  border-radius: 19px;
  border: 1.5px solid var(--ink);
  background: transparent;
  font: 600 11px/1 var(--body);
  letter-spacing: .08em;
  text-transform: uppercase;
  transition: all .2s;
  white-space: nowrap;
}

.ironpaw .add:hover,
.ironpaw .add.in {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}

/* CTA */
.ironpaw .cta {
  position: relative;
  z-index: 3;
  overflow: hidden;
  background: var(--sun);
  color: var(--ink);
  padding: clamp(64px,9vw,130px) clamp(16px,4.4vw,72px);
}

.ironpaw .cta h2 {
  position: relative;
  z-index: 1;
  margin: 0 0 30px;
  font: 900 clamp(46px,9vw,150px)/.88 var(--display);
  letter-spacing: -.045em;
  text-transform: uppercase;
  max-width: 11ch;
}

.ironpaw .cta p {
  position: relative;
  z-index: 1;
  margin: 0 0 30px;
  max-width: 36ch;
  font: 400 17px/1.45 var(--body);
}

.ironpaw .cta .pill {
  position: relative;
  z-index: 1;
  background: var(--ink);
  color: #fff;
}

.ironpaw .cta .pill i {
  background: rgba(255,255,255,.16);
}

.ironpaw .cta .pill:hover {
  background: var(--red);
}

.ironpaw .bigham {
  position: absolute;
  right: -4%;
  top: 50%;
  width: min(62vw,720px);
  aspect-ratio: 1;
  color: var(--ink);
  opacity: .28;
  stroke-width: .55;
  transform: translateY(-50%) rotate(-38deg);
  will-change: transform;
}

/* Footer */
.ironpaw footer {
  position: relative;
  z-index: 3;
  background: var(--ink);
  color: #fff;
  padding: 48px clamp(16px,4.4vw,72px) calc(32px + env(safe-area-inset-bottom,0px));
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 32px;
}

.ironpaw footer .logo {
  font-size: 30px;
}

.ironpaw footer p {
  margin: 10px 0 0;
  max-width: 30ch;
  font: 400 13px/1.45 var(--body);
  color: rgba(255,255,255,.6);
}

.ironpaw footer h5 {
  margin: 0 0 12px;
  font: 600 11px/1 var(--body);
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,.5);
}

.ironpaw footer a {
  display: block;
  padding: 4px 0;
  font: 500 14px var(--body);
}

.ironpaw footer a:hover {
  color: #ff8a80;
}

.ironpaw .legal {
  grid-column: 1 / -1;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,.12);
  font: 400 12px var(--body);
  color: rgba(255,255,255,.45);
}

/* Responsive & Toolbar Preview Modes */
@media (max-width: 1280px) {
  .ironpaw .hero-card { display: none; }
}

@media (max-width: 900px), (orientation: portrait) {
  .ironpaw .tiles { grid-template-columns: repeat(2, 1fr); max-height: none; }
  .ironpaw .tile { min-height: clamp(96px, 17vh, 150px); padding: 14px; }
  .ironpaw .tile .ic { font-size: 30px; }
  .ironpaw footer { grid-template-columns: 1fr 1fr; }
  .ironpaw footer > div:first-child { grid-column: 1 / -1; }
}

@media (max-width: 700px) {
  .ironpaw .search, .ironpaw .btn-cat span { display: none; }
}

@media (max-width: 700px), (orientation: portrait) {
  .ironpaw .btn-cat { padding: 0 12px; }
  .ironpaw .top { margin: 0; padding-left: 16px; }
  .ironpaw .top .cart { margin-left: auto; }
  .ironpaw .hero-copy { left: 16px; right: 16px; width: auto; top: calc(88px + env(safe-area-inset-top,0px)); margin-top: 0; }
  .ironpaw .caps { left: 16px; right: 16px; top: calc(88px + env(safe-area-inset-top,0px)); margin-top: 0; }
  .ironpaw .cap { font-size: clamp(46px, 15vw, 110px); }
  .ironpaw .hero-card { display: none; }
  .ironpaw .lede, .ironpaw .hero-copy .pill { display: none; }
  .ironpaw .eyebrow { margin-bottom: 12px; }
  .ironpaw h1 { font-size: clamp(46px, 15vw, 76px); }
  .ironpaw .panel { height: auto; padding-bottom: clamp(24px, 4vh, 44px); }
  .ironpaw .tiles { max-height: none; flex: none; }
  .ironpaw .panel h2 { font-size: min(20vw, 17vh); }
}

/* Explicit Toolbar Switcher Classes */
.ironpaw.is-mobile .search,
.ironpaw.is-mobile .btn-cat span { display: none; }
.ironpaw.is-mobile .btn-cat { padding: 0 12px; }
.ironpaw.is-mobile .top { margin: 0; padding-left: 16px; }
.ironpaw.is-mobile .top .cart { margin-left: auto; }
.ironpaw.is-mobile .hero-copy { left: 16px; right: 16px; width: auto; top: calc(88px + env(safe-area-inset-top,0px)); margin-top: 0; }
.ironpaw.is-mobile .caps { left: 16px; right: 16px; top: calc(88px + env(safe-area-inset-top,0px)); margin-top: 0; }
.ironpaw.is-mobile .cap { font-size: clamp(46px, 15vw, 110px); }
.ironpaw.is-mobile .hero-card { display: none; }
.ironpaw.is-mobile .lede,
.ironpaw.is-mobile .hero-copy .pill { display: none; }
.ironpaw.is-mobile .eyebrow { margin-bottom: 12px; }
.ironpaw.is-mobile h1 { font-size: clamp(46px, 15vw, 76px); }
.ironpaw.is-mobile .panel { height: auto; padding-bottom: clamp(24px, 4vh, 44px); }
.ironpaw.is-mobile .tiles { max-height: none; flex: none; grid-template-columns: repeat(2, 1fr); }
.ironpaw.is-mobile .tile { min-height: clamp(96px, 17vh, 150px); padding: 14px; }
.ironpaw.is-mobile .tile .ic { font-size: 30px; }
.ironpaw.is-mobile .panel h2 { font-size: min(20vw, 17vh); }
.ironpaw.is-mobile footer { grid-template-columns: 1fr 1fr; }
.ironpaw.is-mobile footer > div:first-child { grid-column: 1 / -1; }

.ironpaw.is-tablet .hero-card { display: none; }
.ironpaw.is-tablet .tiles { grid-template-columns: repeat(2, 1fr); }
.ironpaw.is-tablet footer { grid-template-columns: 1.4fr repeat(3, 1fr); }

@media (prefers-reduced-motion: reduce) {
  .ironpaw .ln > span,
  .ironpaw .card,
  .ironpaw .hint i {
    animation: none;
  }
}
\`;
`,
};
