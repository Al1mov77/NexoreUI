"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "../utils/cn";

export interface SoundPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transparent PNG image URL of the product.
   */
  src: string;
  /**
   * Gradient start color for audio bars and ambient glow.
   * @default "#71717a"
   */
  accentFrom?: string;
  /**
   * Gradient end color for audio bars and ambient glow.
   * @default "#fafafa"
   */
  accentTo?: string;
  /**
   * Tempo in beats per minute for the algorithmic Web Audio synthesizer.
   * @default 100
   */
  bpm?: number;
  /**
   * Image accessibility alt text description.
   * @default "SoundPulse Audio-Reactive Product"
   */
  alt?: string;
  /**
   * Width or maximum width of the stage in pixels or CSS dimension.
   * @default 460
   */
  stageSize?: number | string;
}

const TOTAL_BARS = 56;

/**
 * SoundPulse
 *
 * Audio-reactive physical product presentation component with an integrated
 * procedural Web Audio API synthesizer step-sequencer. Features 56 radial frequency
 * analyzer bars, dynamic bass-reactive atmospheric radial glow, and micro-harmonic
 * product scale pulsing.
 */
export const SoundPulse = React.forwardRef<HTMLDivElement, SoundPulseProps>(
  (
    {
      src,
      accentFrom = "#71717a",
      accentTo = "#fafafa",
      bpm = 100,
      alt = "SoundPulse Audio-Reactive Product",
      stageSize = 460,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sequencerTimerRef = useRef<number | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const stepRef = useRef<number>(0);
    const bassSmoothedRef = useRef<number>(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [containerPx, setContainerPx] = useState(460);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Dynamic reactive visual state
    const [barHeights, setBarHeights] = useState<number[]>(() =>
      Array.from({ length: TOTAL_BARS }, () => 8)
    );
    const [barOpacities, setBarOpacities] = useState<number[]>(() =>
      Array.from({ length: TOTAL_BARS }, () => 0.4)
    );
    const [bassLevel, setBassLevel] = useState<number>(0);

    // Track prefers-reduced-motion
    useEffect(() => {
      if (typeof window === "undefined") return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    // Track container dimensions for DPR and radius calculation
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateDimensions = () => {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerPx(rect.width);
        }
      };

      updateDimensions();
      const ro = new ResizeObserver(updateDimensions);
      ro.observe(container);
      return () => ro.disconnect();
    }, []);

    // Synthesize procedural white noise buffer for hi-hats
    const createNoiseBuffer = useCallback((ctx: AudioContext, durationSec: number): AudioBuffer => {
      const bufferSize = Math.floor(ctx.sampleRate * durationSec);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }, []);

    // Step sequencer note execution
    const playSequencerStep = useCallback(
      (ctx: AudioContext, master: GainNode, step: number) => {
        const now = ctx.currentTime;

        // Kick on steps 0 and 4: sine oscillator dropping 120 -> 40 Hz in 0.14s, gain 0.9 -> 0.001 in 0.16s
        if (step === 0 || step === 4) {
          try {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.type = "sine";
            kickOsc.frequency.setValueAtTime(120, now);
            kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

            kickGain.gain.setValueAtTime(0.9, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            kickOsc.connect(kickGain);
            kickGain.connect(master);
            kickOsc.start(now);
            kickOsc.stop(now + 0.16);
          } catch (e) {
            // AudioContext glitch fallback
          }
        }

        // Hi-hat on odd steps (1, 3, 5, 7): 50ms white noise through highpass 7000 Hz, fast decay
        if (step % 2 === 1) {
          try {
            const noise = ctx.createBufferSource();
            noise.buffer = createNoiseBuffer(ctx, 0.05);

            const filter = ctx.createBiquadFilter();
            filter.type = "highpass";
            filter.frequency.setValueAtTime(7000, now);

            const hatGain = ctx.createGain();
            hatGain.gain.setValueAtTime(0.28, now);
            hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            noise.connect(filter);
            filter.connect(hatGain);
            hatGain.connect(master);
            noise.start(now);
            noise.stop(now + 0.05);
          } catch (e) {
            // AudioContext glitch fallback
          }
        }

        // Bass on steps 0, 3, 6: sawtooth through lowpass 900 Hz (55, 73.4, 65.4 Hz), decay 0.3s
        if (step === 0 || step === 3 || step === 6) {
          try {
            const bassOsc = ctx.createOscillator();
            const bassFilter = ctx.createBiquadFilter();
            const bassGain = ctx.createGain();

            bassOsc.type = "sawtooth";
            const freq = step === 0 ? 55 : step === 3 ? 73.4 : 65.4;
            bassOsc.frequency.setValueAtTime(freq, now);

            bassFilter.type = "lowpass";
            bassFilter.frequency.setValueAtTime(900, now);

            bassGain.gain.setValueAtTime(0.42, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            bassOsc.connect(bassFilter);
            bassFilter.connect(bassGain);
            bassGain.connect(master);

            bassOsc.start(now);
            bassOsc.stop(now + 0.3);
          } catch (e) {
            // AudioContext glitch fallback
          }
        }
      },
      [createNoiseBuffer]
    );

    // AudioContext initialization and resume on user click
    const togglePlay = useCallback(async () => {
      if (typeof window === "undefined") return;

      if (!isPlaying) {
        let ctx = audioCtxRef.current;
        if (!ctx || ctx.state === "closed") {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          const master = ctx.createGain();
          master.gain.setValueAtTime(isMuted ? 0 : 0.85, ctx.currentTime);
          masterGainRef.current = master;

          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.8;
          analyserRef.current = analyser;

          master.connect(analyser);
          analyser.connect(ctx.destination);
        }

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // Start step sequencer: 8 steps (eighth notes), interval 60000 / bpm / 2 ms
        const intervalMs = Math.max(50, 60000 / bpm / 2);
        if (sequencerTimerRef.current) {
          window.clearInterval(sequencerTimerRef.current);
        }

        sequencerTimerRef.current = window.setInterval(() => {
          if (!audioCtxRef.current || !masterGainRef.current) return;
          playSequencerStep(audioCtxRef.current, masterGainRef.current, stepRef.current);
          stepRef.current = (stepRef.current + 1) % 8;
        }, intervalMs);

        setIsPlaying(true);
      } else {
        // Pause sequencer
        if (sequencerTimerRef.current) {
          window.clearInterval(sequencerTimerRef.current);
          sequencerTimerRef.current = null;
        }
        if (audioCtxRef.current && audioCtxRef.current.state === "running") {
          await audioCtxRef.current.suspend();
        }
        setIsPlaying(false);
      }
    }, [isPlaying, isMuted, bpm, playSequencerStep]);

    // Handle mute toggle
    const toggleMute = useCallback(() => {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          nextMuted ? 0 : 0.85,
          audioCtxRef.current.currentTime
        );
      }
    }, [isMuted]);

    // Continuous requestAnimationFrame visual rendering loop
    useEffect(() => {
      let active = true;
      const dataArray = new Uint8Array(64);

      const render = (time: number) => {
        if (!active) return;

        if (prefersReducedMotion) {
          setBarHeights(Array.from({ length: TOTAL_BARS }, () => 8));
          setBarOpacities(Array.from({ length: TOTAL_BARS }, () => 0.4));
          setBassLevel(0);
          rafIdRef.current = requestAnimationFrame(render);
          return;
        }

        const analyser = analyserRef.current;
        const heights: number[] = new Array(TOTAL_BARS);
        const opacities: number[] = new Array(TOTAL_BARS);

        if (isPlaying && analyser) {
          analyser.getByteFrequencyData(dataArray);

          // Lower ~75% of spectrum = first 48 bins
          const maxBins = Math.floor(analyser.frequencyBinCount * 0.75);

          // Calculate bass = average of first 8 bins
          let bassSum = 0;
          for (let b = 0; b < 8; b++) {
            bassSum += dataArray[b] || 0;
          }
          const rawBass = bassSum / (8 * 255);
          bassSmoothedRef.current += (rawBass - bassSmoothedRef.current) * 0.25;

          for (let i = 0; i < TOTAL_BARS; i++) {
            // Symmetrical distribution or linear mapping across lower 75%
            const binIdx = Math.min(
              maxBins - 1,
              Math.floor((i / TOTAL_BARS) * maxBins)
            );
            const v = (dataArray[binIdx] || 0) / 255;
            heights[i] = 6 + v * 46;
            opacities[i] = 0.35 + v * 0.65;
          }

          setBassLevel(bassSmoothedRef.current);
          setBarHeights(heights);
          setBarOpacities(opacities);
        } else {
          // Idle state before play: sinusoidal wave movement so it doesn't look dead
          bassSmoothedRef.current += (0 - bassSmoothedRef.current) * 0.1;
          for (let i = 0; i < TOTAL_BARS; i++) {
            const wave = Math.sin(time * 0.0028 + (i / TOTAL_BARS) * Math.PI * 4);
            const idleV = (wave + 1) * 0.5;
            heights[i] = 6 + idleV * 16;
            opacities[i] = 0.3 + idleV * 0.35;
          }

          setBassLevel(bassSmoothedRef.current);
          setBarHeights(heights);
          setBarOpacities(opacities);
        }

        rafIdRef.current = requestAnimationFrame(render);
      };

      rafIdRef.current = requestAnimationFrame(render);

      return () => {
        active = false;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [isPlaying, prefersReducedMotion]);

    // Cleanup AudioContext and timers on unmount
    useEffect(() => {
      return () => {
        if (sequencerTimerRef.current) {
          clearInterval(sequencerTimerRef.current);
          sequencerTimerRef.current = null;
        }
        if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
        }
      };
    }, []);

    // Radius calculation for radial placement: 46% of container dimension
    const radius = containerPx * 0.46;
    const productScale = prefersReducedMotion ? 1 : 1 + bassLevel * 0.07;
    const glowScale = prefersReducedMotion ? 1 : 1 + bassLevel * 0.42;
    const glowOpacity = prefersReducedMotion ? 0.3 : 0.25 + bassLevel * 0.75;

    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col items-center select-none", className)}
        style={{ maxWidth: stageSize, width: "100%", ...style }}
        {...props}
      >
        {/* Main 1:1 Stage Scene */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square rounded-3xl bg-zinc-950/80 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md"
          style={
            {
              "--accent-from": accentFrom,
              "--accent-to": accentTo,
            } as React.CSSProperties
          }
        >
          {/* Ambient Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Layer 1: Ambient Glow behind product (radial-gradient, blur ~20px) */}
          <div
            className="absolute pointer-events-none rounded-full blur-[24px] transition-transform duration-75 ease-out"
            style={{
              width: "56%",
              height: "56%",
              background: `radial-gradient(circle, ${accentFrom}44 0%, ${accentTo}22 45%, transparent 72%)`,
              transform: `scale(${glowScale})`,
              opacity: glowOpacity,
            }}
          />

          {/* Layer 2: 56 Radial Bars around product */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: TOTAL_BARS }).map((_, i) => {
              const angle = (360 / TOTAL_BARS) * i;
              const h = barHeights[i] || 6;
              const op = barOpacities[i] || 0.35;

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: "3.5px",
                    height: `${h}px`,
                    transformOrigin: "50% 100%",
                    transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-${radius}px)`,
                    opacity: op,
                    background: `linear-gradient(to top, ${accentFrom}, ${accentTo})`,
                    borderRadius: "9999px",
                    boxShadow: `0 0 6px rgba(255, 255, 255, 0.25)`,
                    willChange: "height, opacity",
                  }}
                />
              );
            })}
          </div>

          {/* Layer 3: Central Product Silhouette (~52% width, bass scale pulse) */}
          <div
            className="relative z-10 w-[52%] h-[52%] flex items-center justify-center transition-transform duration-75 ease-out pointer-events-none"
            style={{
              transform: `scale(${productScale})`,
              filter: `drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1))`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain select-none drag-none"
              draggable={false}
            />
          </div>

          {/* Quick Sound Mute Toggle */}
          {isPlaying && (
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 border border-white/10 text-zinc-400 hover:text-white hover:bg-black/70 backdrop-blur-md transition-colors cursor-pointer"
              title={isMuted ? "Unmute sound" : "Mute sound"}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
            </button>
          )}

          {/* Play/Pause Control at Bottom */}
          <div className="absolute bottom-4 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-zinc-900/85 hover:bg-zinc-800 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer active:scale-95"
              aria-label={isPlaying ? "Pause SoundPulse" : "Start SoundPulse"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current text-zinc-300" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-zinc-300" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SoundPulse.displayName = "SoundPulse";
