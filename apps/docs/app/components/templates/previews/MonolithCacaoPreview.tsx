"use client";

import React, { useEffect, useRef, useState, RefObject } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

/* ───────────────────────────────────────────────────────────────────────────
   Tokens & Physics
─────────────────────────────────────────────────────────────────────────── */

const SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const;
const TILT = { stiffness: 260, damping: 24, mass: 0.6 } as const;

const SPECULAR =
  "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 32px -4px rgba(0, 0, 0, 0.5)";

type EditionKey = "criollo" | "gianduja" | "espresso";

const EDITIONS: Record<
  EditionKey,
  {
    name: string;
    sub: string;
    cacao: number;
    accent: string;
    swatch: string;
    notes: string;
    price: number;
  }
> = {
  criollo: {
    name: "Obsidian Criollo",
    sub: "Sur del Lago single-estate dark cacao with smoked alderwood salt.",
    cacao: 85,
    accent: "#f59e0b",
    swatch: "#12100e",
    notes: "Sur del Lago 85%, vanilla orchid, alderwood salt.",
    price: 64,
  },
  gianduja: {
    name: "Smoked Gianduja",
    sub: "Roasted Piedmont hazelnut praline with slow-flowing molten core.",
    cacao: 72,
    accent: "#ea580c",
    swatch: "#20140e",
    notes: "Piedmont hazelnut, roasted cocoa nibs, oak smoke.",
    price: 68,
  },
  espresso: {
    name: "Gold Espresso",
    sub: "Cold-brew Geisha infusion with micro-thin dark biscuit layers.",
    cacao: 78,
    accent: "#eab308",
    swatch: "#18130e",
    notes: "Geisha cold brew, 24K gold leaf flakes, Guayas cacao.",
    price: 72,
  },
};

const PHASES = [
  {
    step: "01",
    title: "Polyhedral basalt facets.",
    body: "Cast from high-density granite molds into sharp geometric cuts. The dry surface provides mechanical anchoring for the glaze layer.",
    figure: 12,
    unit: " facets",
    caption: "Geometric cuts",
  },
  {
    step: "02",
    title: "29.4°C mirror glaze pour.",
    body: "Poured at the exact lipid equilibrium curve. Dynamic surface tension guides the chocolate sheet over facet edges without teardrop pooling.",
    figure: 29.4,
    unit: "°C",
    caption: "Tempering window",
  },
  {
    step: "03",
    title: "Form V crystalline snap.",
    body: "Controlled cooling locks cocoa butter into a dense beta-crystalline matrix. Produces an acoustic fracture and a chiaroscuro mirror finish.",
    figure: 99.4,
    unit: "%",
    caption: "Specular reflection",
  },
] as const;

const WEIGHTS = [
  { label: "340 g", multiplier: 1, serves: "Serves 4–6" },
  { label: "680 g", multiplier: 1.75, serves: "Serves 8–12" },
] as const;

/* ───────────────────────────────────────────────────────────────────────────
   Scroll helpers (nearest scroll container inside modal or viewport)
─────────────────────────────────────────────────────────────────────────── */

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

function useViewHeight(ref: RefObject<HTMLElement | null>) {
  const [h, setH] = useState(800);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = findScroller(el);
    const read = () => setH(scroller ? scroller.clientHeight : window.innerHeight);
    read();
    if (scroller) {
      const ro = new ResizeObserver(read);
      ro.observe(scroller);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [ref]);
  return h;
}

function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  kind: "leave" | "track",
  viewH: number
) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const vh = scroller ? scroller.clientHeight : window.innerHeight;
      const rel = r.top - top;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -rel / total)) : 0);
    };
    update();
    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, kind, mv, viewH]);
  return mv;
}

/* ───────────────────────────────────────────────────────────────────────────
   Micro Components
─────────────────────────────────────────────────────────────────────────── */

function SplitWords({
  text,
  className,
  delay = 0,
  onView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  onView?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            {...(onView
              ? { whileInView: { y: 0 }, viewport: { once: true, margin: "-10% 0px" } }
              : { animate: { y: 0 } })}
            transition={{ ...SPRING, delay: delay + i * 0.07 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  to,
  suffix = "",
  delay = 0,
  duration = 1.8,
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  delay?: number;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: reduce ? 0 : duration,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => setV(x),
    });
    return () => c.stop();
  }, [inView, to, delay, duration, reduce]);

  const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

function MagneticButton({
  children,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      style={{ x, y, ...style }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Signature Wow: Glaze Pour Stage with Pointer Chiaroscuro Raytracing
─────────────────────────────────────────────────────────────────────────── */

function GlazeStage({
  progress,
  accent,
  isDark,
  isMobile,
}: {
  progress: MotionValue<number>;
  accent: string;
  isDark: boolean;
  isMobile: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 520, h: 440 });

  const ptrX = useSpring(260, { stiffness: 220, damping: 28 });
  const ptrY = useSpring(140, { stiffness: 220, damping: 28 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setSize({ w: Math.round(width), h: Math.round(height) });
        }
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    ptrX.set(size.w * 0.38);
    ptrY.set(size.h * 0.28);
  }, [size, ptrX, ptrY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running = true;

    const render = () => {
      if (!running) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = size.w;
      const h = size.h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 + 10;
      const r = Math.min(w, h) * (isMobile ? 0.34 : 0.36);

      const p = progress.get();
      const topY = cy - r * 1.08;
      const botY = cy + r * 0.96;
      // Pour height progression tied to scroll
      const pourY = topY + (botY - topY) * Math.min(1, Math.max(0, p * 1.25));

      const lx = ptrX.get();
      const ly = ptrY.get();

      // Plinth pedestal
      ctx.beginPath();
      ctx.ellipse(cx, botY + 28, r * 1.15, r * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.03)";
      ctx.fill();
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Contact shadow
      ctx.beginPath();
      ctx.ellipse(cx, botY + 24, r * 0.78, r * 0.15, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.55)" : "rgba(0, 0, 0, 0.16)";
      ctx.fill();

      // Polyhedral Monolith Vertices
      const facetCount = 6;
      const eqPoints: { x: number; y: number; z: number }[] = [];
      const rot = 0.24;
      for (let i = 0; i < facetCount; i++) {
        const th = rot + (i * Math.PI * 2) / facetCount;
        eqPoints.push({
          x: cx + Math.cos(th) * r,
          y: cy + Math.sin(th) * (r * 0.32),
          z: Math.sin(th) * r,
        });
      }

      const topPt = { x: cx, y: topY, z: 0 };
      const botPt = { x: cx, y: botY, z: 0 };

      const drawFacet = (
        p1: { x: number; y: number; z: number },
        p2: { x: number; y: number; z: number },
        p3: { x: number; y: number; z: number },
        normal: { x: number; y: number; z: number }
      ) => {
        if (normal.z <= -0.05) return;

        const midY = (p1.y + p2.y + p3.y) / 3;
        const midX = (p1.x + p2.x + p3.x) / 3;

        const isGlazed = midY <= pourY;
        const glazeRatio = Math.min(1, Math.max(0, (pourY - (midY - r * 0.25)) / (r * 0.5)));

        const ldx = lx - midX;
        const ldy = ly - midY;
        const ldz = 160;
        const lLen = Math.hypot(ldx, ldy, ldz) || 1;
        const nx = ldx / lLen;
        const ny = ldy / lLen;
        const nz = ldz / lLen;

        const diffuse = Math.max(0, normal.x * nx + normal.y * ny + normal.z * nz);
        const spec = Math.pow(diffuse, isGlazed ? 22 : 6);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        if (isDark) {
          if (glazeRatio > 0.75) {
            const baseLum = 8 + diffuse * 14;
            ctx.fillStyle = `rgb(${Math.round(baseLum + spec * 62)}, ${Math.round(baseLum + spec * 44)}, ${Math.round(baseLum + spec * 22)})`;
          } else if (glazeRatio > 0.2) {
            ctx.fillStyle = `rgb(${Math.round(14 + spec * 40)}, ${Math.round(12 + spec * 30)}, ${Math.round(10 + spec * 15)})`;
          } else {
            const baseLum = 18 + diffuse * 22;
            ctx.fillStyle = `rgb(${Math.round(baseLum + spec * 12)}, ${Math.round(baseLum + spec * 10)}, ${Math.round(baseLum + spec * 8)})`;
          }
        } else {
          if (glazeRatio > 0.75) {
            const baseLum = 24 + diffuse * 30;
            ctx.fillStyle = `rgb(${Math.round(baseLum + spec * 70)}, ${Math.round(baseLum + spec * 50)}, ${Math.round(baseLum + spec * 30)})`;
          } else {
            const baseLum = 60 + diffuse * 40;
            ctx.fillStyle = `rgb(${Math.round(baseLum + spec * 20)}, ${Math.round(baseLum + spec * 16)}, ${Math.round(baseLum + spec * 12)})`;
          }
        }
        ctx.fill();

        const edgeGlow = spec > 0.55 && isGlazed;
        ctx.strokeStyle = edgeGlow
          ? accent
          : isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.15)";
        ctx.lineWidth = edgeGlow ? 1.6 : 1;
        ctx.stroke();

        if (spec > 0.72 && isGlazed) {
          ctx.beginPath();
          ctx.arc(midX, midY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }
      };

      const computeNormal = (
        p1: { x: number; y: number; z: number },
        p2: { x: number; y: number; z: number },
        p3: { x: number; y: number; z: number }
      ) => {
        const v1x = p2.x - p1.x, v1y = p2.y - p1.y, v1z = p2.z - p1.z;
        const v2x = p3.x - p1.x, v2y = p3.y - p1.y, v2z = p3.z - p1.z;
        const nx = v1y * v2z - v1z * v2y;
        const ny = v1z * v2x - v1x * v2z;
        const nz = v1x * v2y - v1y * v2x;
        const len = Math.hypot(nx, ny, nz) || 1;
        return { x: nx / len, y: ny / len, z: nz / len };
      };

      // Top Pyramid
      for (let i = 0; i < facetCount; i++) {
        const next = (i + 1) % facetCount;
        const p1 = topPt;
        const p2 = eqPoints[i];
        const p3 = eqPoints[next];
        const normal = computeNormal(p1, p2, p3);
        drawFacet(p1, p2, p3, normal);
      }

      // Bottom Pyramid
      for (let i = 0; i < facetCount; i++) {
        const next = (i + 1) % facetCount;
        const p1 = eqPoints[next];
        const p2 = eqPoints[i];
        const p3 = botPt;
        const normal = computeNormal(p1, p2, p3);
        drawFacet(p1, p2, p3, normal);
      }

      // Glaze pour flowing ripple line
      if (pourY > topY + 6 && pourY < botY + 14) {
        ctx.beginPath();
        ctx.ellipse(cx, pourY, r * 0.9, 7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Incident chiaroscuro beam
      ctx.beginPath();
      ctx.setLineDash([3, 4]);
      ctx.moveTo(lx, ly);
      ctx.lineTo(topPt.x, topPt.y);
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Light emitter pip
      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      running = false;
      cancelAnimationFrame(animId);
    };
  }, [size, progress, accent, isDark, isMobile, ptrX, ptrY]);

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ptrX.set(e.clientX - r.left);
        ptrY.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        ptrX.set(size.w * 0.38);
        ptrY.set(size.h * 0.28);
      }}
      className="relative w-full h-full flex items-center justify-center cursor-crosshair select-none"
      style={{ touchAction: "pan-y" }}
    >
      <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />
      <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase opacity-40 pointer-events-none">
        Chiaroscuro ray / Facet normal
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Detail: Cursor-lit Mirror Glaze Close-Up
─────────────────────────────────────────────────────────────────────────── */

function FacetDetail({ accent, isMobile }: { accent: string; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(240, { stiffness: 220, damping: 28 });
  const y = useSpring(180, { stiffness: 220, damping: 28 });

  const center = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(r.width * 0.65);
    y.set(r.height * 0.45);
  };

  useEffect(() => {
    center();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mask = useMotionTemplate`radial-gradient(circle 200px at ${x}px ${y}px, #000 0%, transparent 100%)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={center}
      className="relative overflow-hidden rounded-2xl border cursor-crosshair"
      style={{
        height: isMobile ? 360 : 460,
        backgroundColor: "#0d0b09",
        borderColor: "rgba(255,255,255,0.1)",
        boxShadow: SPECULAR,
        touchAction: "pan-y",
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Base matte cacao surface */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#120f0d",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Lit mirror glaze layer with amber chiaroscuro refraction */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: "#080605",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%), linear-gradient(to right, ${accent}33 1px, transparent 1px), linear-gradient(to bottom, ${accent}33 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
        <h3
          className={`font-black tracking-[-0.04em] leading-[1] text-white ${
            isMobile ? "text-4xl" : "text-6xl"
          }`}
        >
          Mirror glaze, up close.
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
          Tempered at 29.4°C to align cocoa butter crystals into a mirror sheen. Move over the facet
          to inspect the reflection.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Choice: Edition Tilt Card
─────────────────────────────────────────────────────────────────────────── */

function EditionCard({
  data,
  active,
  onSelect,
  surface,
  border,
  muted,
}: {
  data: (typeof EDITIONS)[EditionKey];
  active: boolean;
  onSelect: () => void;
  surface: string;
  border: string;
  muted: string;
}) {
  const rx = useSpring(0, TILT);
  const ry = useSpring(0, TILT);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 55%)`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 12);
        rx.set(-(py - 0.5) * 12);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        gx.set(50);
        gy.set(50);
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        backgroundColor: surface,
        borderColor: border,
        boxShadow: SPECULAR,
      }}
      className="relative text-left rounded-2xl border p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div
          className="relative h-36 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: data.swatch,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        >
          <div
            className="w-14 h-14 rounded-lg rotate-45 border"
            style={{
              borderColor: data.accent,
              background: `linear-gradient(135deg, ${data.accent}44, transparent)`,
            }}
          />
          <div
            className="absolute right-4 inset-y-0 w-1"
            style={{ backgroundColor: data.accent }}
          />
          <motion.div className="absolute inset-0" style={{ background: glare }} />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-[-0.02em]">{data.name}</span>
            <span className="font-mono text-xs tabular-nums text-zinc-400">{data.cacao}% cacao</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: muted }}>
            {data.sub}
          </p>
        </div>
      </div>

      <div
        className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono"
        style={{ borderColor: border }}
      >
        <span style={{ color: muted }}>Starting at</span>
        <span className="font-bold tabular-nums text-sm">${data.price}</span>
      </div>

      {active && (
        <motion.span
          layoutId="edition-ring"
          transition={SPRING}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1.5px solid ${data.accent}` }}
        />
      )}
    </motion.button>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Main Template Component
─────────────────────────────────────────────────────────────────────────── */

export function MonolithCacaoPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const isDark = config.theme === "dark";
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  useEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);

  const viewH = useViewHeight(rootRef);
  const headerH = isMobile ? 64 : 80;
  const heroH = Math.min(Math.max(viewH, 560), 880);
  const trackH = viewH * 3.4;

  /* Scroll-driven motions */
  const rootP = useScrollProgress(rootRef, "track", viewH);
  const rootSpring = useSpring(rootP, { stiffness: 200, damping: 34, mass: 0.4 });
  const heroP = useScrollProgress(heroRef, "leave", viewH);
  const heroSpring = useSpring(heroP, { stiffness: 120, damping: 28, mass: 0.4 });
  const trackP = useScrollProgress(trackRef, "track", viewH);
  const trackSpring = useSpring(trackP, { stiffness: 140, damping: 30, mass: 0.5 });

  const headerBg = useTransform(rootP, [0, 0.015], ["rgba(8,8,10,0)", "rgba(8,8,10,0.85)"]);
  const headerBorder = useTransform(
    rootP,
    [0, 0.015],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"]
  );

  const videoScale = useTransform(heroSpring, [0, 1], [1.08, 1.3]);
  const videoFilter = useTransform(
    heroSpring,
    [0, 1],
    ["blur(0px) brightness(1)", "blur(14px) brightness(0.35)"]
  );
  const titleY = useTransform(heroSpring, [0, 1], [0, -140]);
  const titleOpacity = useTransform(heroSpring, [0, 0.55], [1, 0]);
  const statsOpacity = useTransform(heroSpring, [0, 0.4], [1, 0]);

  const px = useSpring(0, { stiffness: 80, damping: 22 });
  const py = useSpring(0, { stiffness: 80, damping: 22 });
  const titleX = useTransform(px, (v) => -v * 1.4);

  /* Sticky Scene Phases */
  const [activePhase, setActivePhase] = useState(0);
  useMotionValueEvent(trackP, "change", (v) => {
    setActivePhase(v < 0.4 ? 0 : v < 0.72 ? 1 : 2);
  });

  /* Selection state */
  const [edition, setEdition] = useState<EditionKey>("criollo");
  const [selectedWeight, setSelectedWeight] = useState<"340 g" | "680 g">("340 g");
  const [reserved, setReserved] = useState(false);

  const currentEdition = EDITIONS[edition];
  const currentPhase = PHASES[activePhase];
  const weight = WEIGHTS.find((w) => w.label === selectedWeight) || WEIGHTS[0];
  const finalPrice = Math.round(currentEdition.price * weight.multiplier);

  /* Neutrals & Single Accent */
  const fg = isDark ? "#f4f4f5" : "#18181b";
  const muted = isDark ? "#a1a1aa" : "#52525b";
  const bg = isDark ? "#08080a" : "#faf8f5";
  const surface = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.9)";
  const border = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(24, 24, 27, 0.08)";
  const pill = isDark ? "rgba(255,255,255,0.08)" : "rgba(24,24,27,0.06)";

  const brand = config.brandName || "Monolith Cacao";
  const sectionPad = isMobile ? "px-5 py-20" : "px-10 py-32";

  const go = (id: string) => {
    rootRef.current
      ?.querySelector(`#monolith-${id}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const handleReserve = () => {
    setReserved(true);
    setTimeout(() => setReserved(false), 2400);
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip font-sans selection:bg-white/20"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* ── 1. Header (wordmark, 3 links, 1 action) ────────────────────── */}
      <motion.header
        className="sticky top-0 z-40 flex items-center justify-between backdrop-blur-xl border-b"
        style={{
          height: headerH,
          marginBottom: -headerH,
          paddingInline: isMobile ? 20 : 40,
          backgroundColor: headerBg,
          borderBottomColor: headerBorder,
        }}
      >
        <span className="text-sm font-bold tracking-[-0.02em] text-white">{brand}</span>

        {!isMobile && (
          <nav className="flex items-center gap-8 text-xs text-zinc-300">
            {[
              ["process", "Process"],
              ["facet", "Surface"],
              ["editions", "Editions"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        <motion.button
          type="button"
          onClick={() => go("order")}
          whileTap={{ scale: 0.96 }}
          transition={SPRING}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 cursor-pointer min-h-[44px]"
        >
          Reserve
        </motion.button>

        <motion.div
          className="absolute bottom-0 inset-x-0 h-px origin-left"
          style={{ scaleX: rootSpring, backgroundColor: currentEdition.accent }}
        />
      </motion.header>

      {/* ── 2. Hero (full-bleed video + monumental typography + 3 stats) ── */}
      <section
        ref={heroRef}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set(((e.clientX - r.left) / r.width - 0.5) * -18);
          py.set(((e.clientY - r.top) / r.height - 0.5) * -12);
        }}
        className="relative w-full overflow-hidden flex flex-col"
        style={{ height: heroH }}
      >
        <motion.video
          src="/videos/monolith-cacao-glaze.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ scale: videoScale, filter: videoFilter, x: px, y: py }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,10,0.7) 0%, rgba(8,8,10,0.12) 35%, rgba(8,8,10,0.55) 72%, #08080a 100%)",
          }}
        />

        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5"
          style={{ y: titleY, x: titleX, opacity: titleOpacity }}
        >
          <h1
            className={`font-black leading-[0.95] tracking-[-0.04em] text-white ${
              isMobile ? "text-5xl" : isTablet ? "text-7xl" : "text-8xl"
            }`}
          >
            <SplitWords text={config.heroTitle || "Carved from dark cacao."} delay={0.1} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.55 }}
            className={`mt-6 text-zinc-300 max-w-md ${isMobile ? "text-sm" : "text-base"}`}
          >
            {config.heroSubtitle ||
              "Single-estate Venezuelan Criollo, tempered to a mirror finish. Three geometric cuts, zero additives."}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative z-10 grid grid-cols-3 border-t"
          style={{
            opacity: statsOpacity,
            borderColor: "rgba(255,255,255,0.12)",
            marginInline: isMobile ? 20 : 40,
            paddingTop: isMobile ? 20 : 24,
            paddingBottom: isMobile ? 24 : 40,
          }}
        >
          {[
            { to: 85, suffix: "%", l: "Sur del Lago Criollo", dec: 0 },
            { to: 72, suffix: " h", l: "Stone conched", dec: 0 },
            { to: 29.4, suffix: "°C", l: "Temper curve", dec: 1 },
          ].map((s, i) => (
            <div key={s.l}>
              <div
                className={`font-bold tracking-[-0.03em] text-white ${
                  isMobile ? "text-base" : "text-3xl"
                }`}
              >
                <Counter to={s.to} suffix={s.suffix} delay={0.8 + i * 0.12} decimals={s.dec} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. Scene: Glaze Pour & Chiaroscuro Specular Raytracing ──────── */}
      {!config.hiddenSections?.process && (
        <div id="monolith-process" ref={trackRef} style={{ height: trackH }} className="relative">
        <div
          className="sticky top-0 overflow-hidden flex flex-col justify-center"
          style={{ height: viewH, paddingTop: headerH }}
        >
          <div
            className={`max-w-6xl mx-auto w-full h-full flex flex-col justify-center ${
              isMobile ? "px-5 py-6" : "px-10 py-10"
            }`}
          >
            <div
              className={`grid items-center h-full gap-8 ${
                isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-12"
              }`}
            >
              {/* Visual Stage */}
              <div
                className={`h-full min-h-[300px] flex items-center justify-center ${
                  isMobile ? "order-1 h-[260px]" : isTablet ? "order-1" : "col-span-7"
                }`}
              >
                <GlazeStage
                  progress={trackSpring}
                  accent={currentEdition.accent}
                  isDark={isDark}
                  isMobile={isMobile}
                />
              </div>

              {/* Phase Copy */}
              <div
                className={`flex flex-col justify-center ${
                  isMobile ? "order-2" : isTablet ? "order-2" : "col-span-5"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={SPRING}
                    className="space-y-4"
                  >
                    <h2
                      className={`font-black tracking-[-0.03em] leading-[1.05] ${
                        isMobile ? "text-2xl" : "text-4xl"
                      }`}
                    >
                      {currentPhase.title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: muted }}>
                      {currentPhase.body}
                    </p>

                    <div className="pt-4 border-t" style={{ borderColor: border }}>
                      <div
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: currentEdition.accent }}
                      >
                        {currentPhase.figure}
                        {currentPhase.unit}
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 mt-0.5">
                        {currentPhase.caption}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ── 4. Detail: Cursor-lit Mirror Glaze Close-Up ─────────────────── */}
      {!config.hiddenSections?.facet && (
        <section id="monolith-facet" className={`max-w-6xl mx-auto w-full ${sectionPad}`}>
          <Reveal>
            <FacetDetail accent={currentEdition.accent} isMobile={isMobile} />
          </Reveal>
        </section>
      )}

      {/* ── 5. Choice: Three Geometric Cuts (Tilt Cards + Weight) ──────── */}
      {!config.hiddenSections?.editions && (
        <section id="monolith-editions" className={`max-w-6xl mx-auto w-full ${sectionPad}`}>
          <Reveal>
            <div className="max-w-md">
              <h2
                className={`font-black tracking-[-0.04em] leading-[1] ${
                  isMobile ? "text-3xl" : "text-5xl"
                }`}
              >
                Three geometric cuts.
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: muted }}>
                Each single-origin bar is poured to order into CNC-milled basalt forms.
              </p>
            </div>
          </Reveal>

          <div
            className={`mt-10 grid gap-4 ${
              isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {(["criollo", "gianduja", "espresso"] as const).map((key) => (
              <EditionCard
                key={key}
                data={EDITIONS[key]}
                active={edition === key}
                onSelect={() => setEdition(key)}
                surface={surface}
                border={border}
                muted={muted}
              />
            ))}
          </div>

          {/* Weight Selector */}
          <div className="mt-8 flex items-center justify-between flex-wrap gap-4 pt-6 border-t" style={{ borderColor: border }}>
            <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Format & Serving
            </div>
            <div className="flex items-center gap-2">
              {WEIGHTS.map((w) => {
                const isSelected = selectedWeight === w.label;
                return (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => setSelectedWeight(w.label as any)}
                    className="relative px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[44px]"
                    style={{ color: isSelected ? fg : muted }}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="weight-pill"
                        transition={SPRING}
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{ backgroundColor: pill }}
                      />
                    )}
                    <span className="relative z-10">{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Action: Order Card & Magnetic Button ────────────────────── */}
      {!config.hiddenSections?.order && (
        <section id="monolith-order" className={`max-w-6xl mx-auto w-full ${sectionPad}`}>
          <Reveal>
            <div
              className="p-6 sm:p-10 rounded-3xl border relative overflow-hidden"
              style={{
                backgroundColor: surface,
                borderColor: border,
                boxShadow: SPECULAR,
              }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-[-0.03em]">
                    Reserve a monolith.
                  </h3>
                  <p className="text-sm leading-relaxed max-w-md" style={{ color: muted }}>
                    {currentEdition.name} ({weight.label}). Single-estate Venezuelan Criollo,
                    tempered to order and packed in temperature-controlled packaging.
                  </p>
                  <div className="font-mono text-xs text-zinc-400">
                    Dispatched within 48 hours. Climate-controlled delivery.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-3xl font-black tabular-nums tracking-[-0.03em]">
                      ${finalPrice}
                    </div>
                    <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 mt-0.5">
                      {weight.serves}
                    </div>
                  </div>

                  <MagneticButton
                    onClick={handleReserve}
                    className="px-8 py-4 rounded-xl text-xs font-bold bg-white text-zinc-950 cursor-pointer shadow-lg min-h-[44px]"
                  >
                    <AnimatePresence mode="wait">
                      {reserved ? (
                        <motion.span
                          key="reserved"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={SPRING}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Added to Order</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={SPRING}
                          className="flex items-center gap-2"
                        >
                          <span>Reserve Monolith</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── 7. Footer: One line ────────────────────────────────────────── */}
      <footer
        className="border-t py-8 px-5 sm:px-10 text-center text-xs font-mono"
        style={{ borderColor: border, color: muted }}
      >
        <p>© 2026 Monolith Cacao. Single-estate dark chocolate.</p>
      </footer>
    </div>
  );
}
