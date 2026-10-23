"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useProStatus } from "../../../hooks/useProStatus";

const TOAST_PARTICLES = [
  { cx: "10%", cy: "25%", r: 1, min: 0.2, max: 0.8, d: 4.0, delay: 0 },
  { cx: "25%", cy: "65%", r: 1.2, min: 0.15, max: 0.75, d: 5.2, delay: 1.2 },
  { cx: "40%", cy: "20%", r: 0.8, min: 0.3, max: 0.9, d: 3.6, delay: 0.5 },
  { cx: "60%", cy: "70%", r: 1.3, min: 0.2, max: 0.85, d: 5.8, delay: 1.8 },
  { cx: "75%", cy: "30%", r: 0.9, min: 0.15, max: 0.7, d: 4.5, delay: 2.1 },
  { cx: "88%", cy: "60%", r: 1.1, min: 0.25, max: 0.9, d: 4.8, delay: 0.9 },
  { cx: "92%", cy: "22%", r: 0.8, min: 0.2, max: 0.65, d: 3.9, delay: 1.4 },
  { cx: "18%", cy: "80%", r: 0.9, min: 0.1, max: 0.6, d: 5.5, delay: 0.7 },
] as const;

export function ProPromoNotification() {
  const { isPro } = useProStatus();
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("nexoreui_pro_notification_dismissed");
      if (dismissed === "true") {
        return;
      }
    } catch {
      // Ignore storage restrictions
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("nexoreui_pro_notification_dismissed", "true");
    } catch {
      // Ignore storage restrictions
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <aside
          aria-label="NexoreUI Pro announcement"
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-50 w-auto sm:w-[350px] max-w-[calc(100vw-2rem)] pointer-events-auto select-none"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 30,
              mass: 0.8,
            }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)]"
          >
            {/* Top Atmospheric Gradient Banner with gentle animated sky glow (matching HeroUI) */}
            <div
              className="relative h-32 w-full overflow-hidden p-4 flex flex-col justify-between"
              style={{
                background:
                  "radial-gradient(ellipse 110% 95% at 50% 10%, #38bdf8 0%, #2563eb 55%, #1e1b4b 100%)",
              }}
            >
              {/* Subtle animated floating aura */}
              {!shouldReduceMotion ? (
                <motion.div
                  animate={{
                    x: ["-8%", "8%", "-8%"],
                    y: ["-6%", "6%", "-6%"],
                    opacity: [0.55, 0.85, 0.55],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 -left-6 w-60 h-60 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(56, 189, 248, 0.2) 50%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />
              ) : null}

              {/* Twinkling micro-animated particles */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none text-sky-200/70"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {TOAST_PARTICLES.map((p, idx) => (
                  <motion.circle
                    key={idx}
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    fill="currentColor"
                    initial={{ opacity: p.min }}
                    animate={
                      shouldReduceMotion
                        ? { opacity: p.min }
                        : {
                            opacity: [p.min, p.max, p.min],
                            scale: [1, 1.25, 1],
                          }
                    }
                    transition={{
                      duration: p.d,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </svg>

              {/* Top row: dismiss button only */}
              <div className="relative z-10 flex items-center justify-end w-full">
                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Close notification"
                  className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center Lockup: Pure typographic Pro mark (no photo logo) */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm font-sans">
                    Nexore
                  </span>
                  <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm">
                    Pro
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-sky-100/80 mt-0.5">
                  Now available
                </span>
              </div>
            </div>

            {/* Bottom Content Body (adapts to light and dark theme automatically) */}
            <div className="p-5 space-y-3.5 bg-card">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Build faster with NexoreUI Pro
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All 30+ production templates, unlimited Nexore Make canvas code exports, and 2 permanent developer seats.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="h-9 px-3.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/pricing"
                  onClick={handleDismiss}
                  className="flex-1 h-9 px-3.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-opacity inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Explore Pro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </aside>
      )}
    </AnimatePresence>
  );
}
