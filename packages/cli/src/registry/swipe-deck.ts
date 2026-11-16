export const swipeDeck = {
  name: "swipe-deck",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "swipe-deck.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface DeckCardItem {
  word: string;
  bg: string;
  fg: string;
  text: string;
}

export interface SwipeDeckProps extends React.HTMLAttributes<HTMLDivElement> {
  stiff?: number;
  damp?: number;
  tilt?: number;
  fling?: number;
  depth?: number;
  offset?: number;
  shrink?: number;
  radius?: number;
  lift?: number;
  bg?: string;
  cards?: DeckCardItem[];
  paused?: boolean;
}

const DEFAULT_CARDS: DeckCardItem[] = [
  { word: "Move", bg: "#ff4a2b", fg: "#101014", text: "Drag me anywhere." },
  { word: "Slow", bg: "#101014", fg: "#f2efe8", text: "Springs settle, they do not snap." },
  { word: "Press", bg: "#2d4bff", fg: "#ffe14a", text: "A fast flick flies off the table." },
  { word: "Pause", bg: "#f2efe8", fg: "#101014", text: "A slow drag comes back." },
  { word: "Look", bg: "#ffe14a", fg: "#101014", text: "The next card leans in." },
  { word: "Loop", bg: "#25e0c0", fg: "#101014", text: "And then it starts over." },
];

interface CardState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  r: number;
  o: number;
  fl: number;
}

export const SwipeDeck = React.forwardRef<HTMLDivElement, SwipeDeckProps>(
  function SwipeDeck(
    {
      stiff = 220,
      damp = 22,
      tilt = 8,
      fling = 650,
      depth = 3,
      offset = 16,
      shrink = 0.06,
      radius = 26,
      lift = 1.04,
      bg = "#0f1014",
      cards = DEFAULT_CARDS,
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cardNodesRef = useRef<(HTMLDivElement | null)[]>([]);
    const cardStates = useRef<CardState[]>(cards.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, s: 1, r: 0, o: 1, fl: 0 })));
    const orderRef = useRef<number[]>(cards.map((_, i) => i));
    const dragRef = useRef<{ ox: number; oy: number; lx: number; lt: number; vx: number } | null>(null);
    const isVisibleRef = useRef<boolean>(true);

    useEffect(() => {
      cardStates.current = cards.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, s: 1, r: 0, o: 1, fl: 0 }));
      orderRef.current = cards.map((_, i) => i);
    }, [cards]);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const onPointerDown = (e: PointerEvent) => {
        const topIdx = orderRef.current[0];
        if (topIdx === undefined) return;
        const topCardNode = cardNodesRef.current[topIdx];
        if (!topCardNode || !topCardNode.contains(e.target as Node)) return;

        const k = cardStates.current[topIdx];
        if (!k) return;

        dragRef.current = {
          ox: k.x - e.clientX,
          oy: k.y - e.clientY,
          lx: e.clientX,
          lt: performance.now(),
          vx: 0,
        };
        k.fl = 0;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
      };

      const onPointerMove = (e: PointerEvent) => {
        const d = dragRef.current;
        if (!d) return;
        const topIdx = orderRef.current[0];
        if (topIdx === undefined) return;
        const k = cardStates.current[topIdx];
        if (!k) return;

        const now = performance.now();
        const dt = Math.max(1, now - d.lt) / 1000;
        d.vx += ((e.clientX - d.lx) / dt - d.vx) * 0.35;
        d.lx = e.clientX;
        d.lt = now;
        k.x = e.clientX + d.ox;
        k.y = e.clientY + d.oy;
      };

      const onPointerUp = () => {
        const d = dragRef.current;
        if (!d) return;
        dragRef.current = null;

        const topIdx = orderRef.current[0];
        if (topIdx === undefined) return;
        const k = cardStates.current[topIdx];
        if (!k) return;

        const rect = el.getBoundingClientRect();
        const w = rect.width || 400;
        const isFast = Math.abs(d.vx) > fling;

        if (isFast || Math.abs(k.x) > w * 0.3) {
          k.fl = Math.sign(isFast ? d.vx : k.x) || 1;
          k.vx = k.fl * Math.max(Math.abs(d.vx), fling * 1.2);
          k.vy = 0;
          if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
            navigator.vibrate(6);
          }
        } else {
          k.vx = d.vx;
        }
      };

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);

      return () => {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointercancel", onPointerUp);
      };
    }, [fling]);

    useEffect(() => {
      let lastTime = performance.now();
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const el = containerRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const w = rect.width || 400;
            const dt = Math.min((ms - lastTime) / 1000, 0.033) || 0.016;
            lastTime = ms;

            const ord = orderRef.current;
            const states = cardStates.current;
            const n = ord.length;

            const topIdx = ord[0];
            if (topIdx !== undefined) {
              const F = states[topIdx];
              if (F && !dragRef.current) {
                if (F.fl) {
                  F.x += F.vx * dt;
                  if (Math.abs(F.x) > w * 0.5 + 260) {
                    const shifted = ord.shift();
                    if (shifted !== undefined) ord.push(shifted);
                    F.x = 0;
                    F.y = 0;
                    F.vx = 0;
                    F.vy = 0;
                    F.fl = 0;
                    F.o = 0;
                  }
                } else {
                  F.vx += (-stiff * F.x - damp * F.vx) * dt;
                  F.vy += (-stiff * F.y - damp * F.vy) * dt;
                  F.x += F.vx * dt;
                  F.y += F.vy * dt;
                }
              }

              const p = Math.min(1, Math.max(0, Math.abs(F ? F.x : 0) / (w * 0.35)));

              for (let i = 0; i < n; i++) {
                const ci = ord[i];
                if (ci === undefined) continue;
                const k = states[ci];
                const cardNode = cardNodesRef.current[ci];
                if (!k || !cardNode) continue;

                if (i === 0) {
                  k.s += ((dragRef.current ? lift : 1) - k.s) * 0.25;
                  k.r *= 0.85;
                  k.o += (1 - k.o) * 0.3;
                  cardNode.style.transform = \`translate(\${k.x}px, \${k.y}px) rotate(\${(k.x / 100) * tilt + k.r}deg) scale(\${k.s})\`;
                  cardNode.style.setProperty("--sx", \`\${Math.min(120, Math.max(-120, (k.x / w) * 160))}%\`);
                } else {
                  const e = i - p;
                  const ty = e * offset;
                  const ts = 1 - e * shrink;
                  const tr = (i % 2 ? 1 : -1) * e * 1.4;
                  k.x = 0;
                  k.y += (ty - k.y) * 0.2;
                  k.s += (ts - k.s) * 0.2;
                  k.r += (tr - k.r) * 0.2;
                  k.o += ((i < depth ? 1 : 0) - k.o) * 0.2;
                  cardNode.style.transform = \`translate(0px, \${k.y}px) rotate(\${k.r}deg) scale(\${k.s})\`;
                }

                cardNode.style.opacity = String(k.o);
                cardNode.style.zIndex = String(n - i);
                cardNode.style.borderRadius = \`\${radius}px\`;
              }
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, stiff, damp, tilt, depth, offset, shrink, radius, lift]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn(
          "relative flex items-center justify-center w-full h-full overflow-hidden select-none touch-none",
          className
        )}
        style={{ backgroundColor: bg, ...style }}
        {...rest}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(node) => {
              cardNodesRef.current[i] = node;
            }}
            className="absolute flex flex-col justify-between p-[8%] overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl will-change-transform touch-none select-none"
            style={{
              width: "min(320px, 78vw)",
              aspectRatio: "3/4.2",
              backgroundColor: card.bg,
              color: card.fg,
              borderRadius: radius,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.3), transparent 70%)",
                transform: "translateX(var(--sx, -120%))",
              }}
            />
            <span
              className="font-extrabold tracking-tight leading-none"
              style={{
                fontSize: "clamp(3.5rem, 18vw, 6rem)",
                fontVariationSettings: '"wdth" 75',
                letterSpacing: "-0.05em",
              }}
            >
              {card.word}
            </span>
            <span className="font-medium text-xs sm:text-sm max-w-[16ch] leading-snug opacity-90">
              {card.text}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

SwipeDeck.displayName = "SwipeDeck";
`
};
