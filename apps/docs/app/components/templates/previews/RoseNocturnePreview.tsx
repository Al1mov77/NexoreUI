"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const IMAGES = {
  rose1: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
  lab: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop",
  abstract: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  bottle: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
};

const PROTOCOL_PHASES = [
  {
    num: "01",
    title: "Midnight Harvest",
    subtitle: "03:00 AM / Valley of the Roses",
    desc: "Gathered before morning sunlight initiates evaporation of delicate volatile damascenone esters. Locked under zero ultraviolet light exposure.",
    img: IMAGES.rose1,
    tag: "Dew Point 03:00 AM",
    metricLabel: "Esters Intact",
    metricVal: "99.8%",
  },
  {
    num: "02",
    title: "Cryo-Suspension",
    subtitle: "-196.0°C / Nitrogen Plunge",
    desc: "Petals submerged into liquid nitrogen at -196°C to arrest enzymatic breakdown, fixing the flower cellular state at the moment of harvest.",
    img: IMAGES.lab,
    tag: "Sub-Zero Quench",
    metricLabel: "Temperature",
    metricVal: "-196.4°C",
  },
  {
    num: "03",
    title: "Isochoric Extraction",
    subtitle: "0.0001 Pa / Acoustic Resonance",
    desc: "Acoustic resonance separation conducted within an oxygen-depleted vacuum chamber. Ultrasonic frequencies decouple aromatic oils without heat.",
    img: IMAGES.abstract,
    tag: "Vacuum Separation",
    metricLabel: "Chamber Pressure",
    metricVal: "0.0001 Pa",
  },
  {
    num: "04",
    title: "Obsidian Maturation",
    subtitle: "180 Days / Borosilicate Rest",
    desc: "Conditioned over six months inside opaque black borosilicate vessels to harmonize complex resinous and floral accords in absolute darkness.",
    img: IMAGES.bottle,
    tag: "Vessel Cask Rest",
    metricLabel: "Maturation Period",
    metricVal: "180 Days",
  },
];

export function RoseNocturnePreview() {
  const { config } = useTemplateCustomizer();
  const shouldReduceMotion = useReducedMotion();
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | Window | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const protocolSectionRef = useRef<HTMLElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const protocolProgressRef = useRef<HTMLDivElement>(null);
  const activePhaseRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;

    let container: HTMLElement | Window = window;
    let el = root.parentElement;
    while (el) {
      const style = window.getComputedStyle(el);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        container = el;
        break;
      }
      el = el.parentElement;
    }
    containerRef.current = container;

    let rafId: number | null = null;

    const updateScroll = () => {
      if (protocolSectionRef.current && trackRef.current && trackWrapperRef.current) {
        const pEl = protocolSectionRef.current;
        const pRect = pEl.getBoundingClientRect();
        const cTop = container === window ? 0 : (container as HTMLElement).getBoundingClientRect().top;
        const cHeight = container === window ? window.innerHeight : (container as HTMLElement).clientHeight;

        const totalPinDistance = pRect.height - cHeight;
        const scrolledPinDistance = cTop - pRect.top;

        let protoProgress = 0;
        if (totalPinDistance > 0) {
          protoProgress = Math.min(1, Math.max(0, scrolledPinDistance / totalPinDistance));
        }

        const wrapperWidth = trackWrapperRef.current.clientWidth;
        const trackWidth = trackRef.current.scrollWidth;
        const maxTranslate = Math.max(0, trackWidth - wrapperWidth + 32);
        const translateX = protoProgress * maxTranslate;

        trackRef.current.style.transform = `translate3d(-${translateX}px, 0, 0)`;

        if (protocolProgressRef.current) {
          protocolProgressRef.current.style.transform = `scaleX(${protoProgress})`;
        }

        const phaseIdx = Math.min(3, Math.max(0, Math.floor(protoProgress * 3.999)));
        if (phaseIdx !== activePhaseRef.current) {
          activePhaseRef.current = phaseIdx;
          setActivePhaseIndex(phaseIdx);
        }
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateScroll();
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScroll();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToPhase = (idx: number) => {
    const pEl = protocolSectionRef.current;
    const c = containerRef.current || window;
    if (!pEl) return;

    const cTop = c === window ? 0 : (c as HTMLElement).getBoundingClientRect().top;
    const pRect = pEl.getBoundingClientRect();
    const cHeight = c === window ? window.innerHeight : (c as HTMLElement).clientHeight;
    const currentScroll =
      c === window ? window.scrollY || document.documentElement.scrollTop : (c as HTMLElement).scrollTop;

    const totalDistance = pRect.height - cHeight;
    const sectionStart = currentScroll + (pRect.top - cTop);
    const targetScroll = sectionStart + (idx / 3) * totalDistance + 4;

    c.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full min-h-screen bg-black font-sans text-white selection:bg-rose-500 selection:text-white relative select-none overflow-x-clip"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      <div className="w-full relative">
        {/* ── TOP NAVIGATION ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 select-none bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <span
              className="text-xs sm:text-sm tracking-[0.28em] font-semibold uppercase text-white"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {config.brandName || "NOCTURNE ATELIER"}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase text-white/70">
              <span className="hover:text-white transition-colors cursor-pointer">Protocol</span>
              <span className="hover:text-white transition-colors cursor-pointer">Archive</span>
              <span className="hover:text-white transition-colors cursor-pointer">Specifications</span>
            </div>
            <button
              type="button"
              onClick={() => scrollToPhase(0)}
              className="text-[11px] font-mono uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/15 transition-colors cursor-pointer"
            >
              Explore
            </button>
          </div>
        </nav>

        {/* ── SECTION 1: CINEMATIC VIDEO HERO ── */}
        <section className="relative w-full min-h-[96vh] flex items-center justify-center overflow-hidden bg-black px-6 pt-24 pb-16">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              src="/videos/rose-nocturne-atelier.mp4"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              className="w-full h-full object-cover pointer-events-none opacity-45 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/85" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            <h1
              className="text-[13vw] sm:text-[11vw] font-bold uppercase leading-[0.84] tracking-[-0.03em] text-white flex flex-col items-center"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <motion.span
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT }}
              >
                Absolute
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.1, ease: EASE_OUT }}
                className="text-zinc-200"
              >
                Purity
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.2, ease: EASE_OUT }}
              className="mt-8 text-base sm:text-lg text-zinc-300 font-light max-w-xl tracking-wide leading-relaxed"
            >
              Cryogenic botanical extraction of nocturnal Damascena petals gathered before dawn.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.3, ease: EASE_OUT }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                type="button"
                onClick={() => scrollToPhase(0)}
                className="px-8 py-3.5 rounded-lg bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Explore Protocol
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("specifications");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3.5 rounded-lg border border-white/20 bg-black/40 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                View Chamber
              </button>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-[1px] h-6 bg-white/30" />
          </div>
        </section>

        {/* ── SECTION 2: EDITORIAL MANIFESTO ── */}
        <section className="relative z-10 w-full bg-zinc-950 py-28 sm:py-36 px-6 sm:px-12 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="w-8 h-[1px] bg-rose-500/60 mb-8" />

            <div className="flex flex-col gap-5 max-w-3xl">
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[-0.01em] leading-[1.2] text-white"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Conventional thermal methods degrade the living molecular structure.
              </h2>
              <p className="text-zinc-400 text-base sm:text-xl font-light leading-relaxed">
                Boiling and chemical distillation destroy the fragile volatile damascenone esters.
              </p>
              <p className="text-zinc-300 text-sm sm:text-base font-mono tracking-wide">
                Sub-zero cryo-maceration locks the exact aromatic profile of the blossom at peak dew point.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: THE EXTRACTION PROTOCOL (PINNED HORIZONTAL SCROLL) ── */}
        <section
          ref={protocolSectionRef}
          className="relative h-[300vh] w-full bg-zinc-950 border-t border-zinc-900"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 px-6 sm:px-12 bg-black z-20">
            {/* Top Bar: Title & Phase Switcher Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 shrink-0">
              <div>
                <span className="text-[10px] font-mono tracking-[0.28em] text-zinc-400 uppercase">
                  Extraction Sequence
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-1"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Protocol Phases
                </h2>
              </div>

              {/* Phase Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {PROTOCOL_PHASES.map((p, idx) => {
                  const isActive = activePhaseIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToPhase(idx)}
                      className={`relative px-3.5 py-2 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                        isActive
                          ? "bg-white/15 text-white border-white/40"
                          : "bg-zinc-900/80 text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-rose-400" : "bg-zinc-600"
                        }`}
                      />
                      <span className="font-bold">{p.num}</span>
                      <span className="hidden sm:inline">{p.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle: Horizontal Cards Viewport & Track */}
            <div
              ref={trackWrapperRef}
              className="w-full flex-1 flex items-center overflow-hidden relative my-2"
            >
              <div
                ref={trackRef}
                className="flex gap-6 sm:gap-10 items-center will-change-transform pr-16"
                style={{ transform: "translate3d(0, 0, 0)" }}
              >
                {PROTOCOL_PHASES.map((p, idx) => {
                  const isActive = activePhaseIndex === idx;
                  return (
                    <div
                      key={p.num}
                      className={`w-[85vw] sm:w-[78vw] max-w-[960px] shrink-0 transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      <div className="w-full rounded-2xl bg-zinc-950 border border-white/15 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-2 right-8 text-[120px] sm:text-[180px] font-bold text-white/[0.03] leading-none select-none pointer-events-none">
                          {p.num}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                          <div className="lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl bg-zinc-900 border border-white/10 relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${p.img})`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            </div>

                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? "bg-rose-400" : "bg-zinc-500"
                                }`}
                              />
                              <span className="text-[10px] font-mono text-white/90 tracking-wider uppercase">
                                Phase {p.num} / {p.tag}
                              </span>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3.5 py-1.5 rounded-md border border-white/10 text-right">
                              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                                {p.metricLabel}
                              </div>
                              <div className="text-sm font-mono font-semibold text-rose-300 mt-0.5">
                                {p.metricVal}
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-5 flex flex-col justify-between h-full">
                            <div className="flex flex-col gap-3">
                              <div className="text-[10px] font-mono tracking-[0.2em] text-rose-300 uppercase font-medium">
                                {p.subtitle}
                              </div>

                              <h3
                                className="text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight leading-tight"
                                style={{ fontFamily: "'Cinzel', serif" }}
                              >
                                {p.title}
                              </h3>

                              <div className="w-12 h-[1px] bg-rose-500/50 my-1" />

                              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                                {p.desc}
                              </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                                Stage {idx + 1} of 4{isActive ? " (Active)" : ""}
                              </span>

                              <button
                                type="button"
                                onClick={() => scrollToPhase((idx + 1) % 4)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 font-mono text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer"
                              >
                                <span>{idx === 3 ? "Return to Start" : "Next Stage"}</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar: Progress & Status */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-mono tracking-widest text-zinc-400 uppercase relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-36 sm:w-52 h-[2px] bg-zinc-800 rounded-full overflow-hidden relative">
                  <div
                    ref={protocolProgressRef}
                    className="h-full bg-rose-500 origin-left will-change-transform"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
                <span className="text-white/60">Phase 0{activePhaseIndex + 1} of 04</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                <span>Scroll vertically to advance sequence</span>
              </div>

              <div className="text-zinc-300">
                {PROTOCOL_PHASES[activePhaseIndex]?.title}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: ARCHITECTURE SPECIFICATIONS ── */}
        <section
          id="specifications"
          className="relative z-10 w-full py-28 sm:py-36 px-6 sm:px-12 bg-zinc-950 border-t border-zinc-900"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex flex-col items-center text-center">
              <h2
                className="text-3xl sm:text-6xl font-bold uppercase tracking-tight text-white mb-3"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Chamber Specifications
              </h2>

              <p className="text-zinc-400 max-w-xl text-base sm:text-lg font-light">
                Engineering tolerances designed to isolate delicate aromatic compounds from atmospheric degradation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-8 h-80 flex flex-col justify-end relative overflow-hidden group hover:border-white/20 transition-colors">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${IMAGES.abstract})` }}
                />
                <div className="relative z-10">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
                    Atmosphere
                  </div>
                  <h3 className="text-3xl font-bold uppercase text-white font-mono">0.0001 Pa</h3>
                  <p className="text-sm text-zinc-300 mt-2 font-light">
                    Near-vacuum environment prevents oxidation during ultrasonic extraction.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-80 relative overflow-hidden group shadow-2xl flex flex-col justify-end text-center hover:border-white/20 transition-colors">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${IMAGES.bottle})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10">
                  <h3
                    className="text-2xl font-bold uppercase text-white mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Borosilicate Flacon
                  </h3>
                  <p className="text-zinc-300 text-sm font-light">
                    Opaque obsidian vessel protects light-sensitive aromatic bonds.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-8 h-80 flex flex-col justify-end relative overflow-hidden group hover:border-white/20 transition-colors">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${IMAGES.lab})` }}
                />
                <div className="relative z-10">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
                    Thermal Baseline
                  </div>
                  <h3 className="text-3xl font-bold uppercase text-white font-mono">-196°C</h3>
                  <p className="text-sm text-zinc-300 mt-2 font-light">
                    Liquid nitrogen arrest halts enzymatic breakdown within milliseconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: RESERVATION & FOOTER ── */}
        <footer className="relative z-10 w-full py-28 px-6 sm:px-12 bg-black border-t border-zinc-900 text-center flex flex-col items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center flex flex-col items-center w-full max-w-4xl px-6">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 mb-4">
              Annual Harvest Allocation
            </span>

            <h2
              className="text-5xl sm:text-7xl font-bold uppercase tracking-tight text-white mb-8"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Acquire Flacon
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-10 font-light leading-relaxed">
              Produced in limited seasonal runs from midnight harvest Damascena petals.
            </p>

            <button
              type="button"
              className="px-10 py-4 rounded-lg bg-white text-black font-mono uppercase tracking-[0.18em] text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Request Allocation
            </button>
          </div>

          <div className="w-full max-w-6xl mt-24 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            <div>© {config.brandName || "NOCTURNE ATELIER"}</div>
            <div className="flex gap-8">
              <span className="hover:text-white transition-colors cursor-pointer">Protocol</span>
              <span className="hover:text-white transition-colors cursor-pointer">Archive</span>
              <span className="hover:text-white transition-colors cursor-pointer">Inquiries</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
