"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { TemplateItem } from "../../../data/templates";
import { TemplateCard } from "./TemplateCard";

export interface MarqueeColumnProps {
  templates: readonly TemplateItem[];
  direction: "up" | "down";
  duration: number;
  columnIndex: number;
  reducedMotion: boolean;
  focusClass?: string;
  visibilityClass?: string;
}

const HOVER_PLAYBACK_RATE = 0.12;
const NORMAL_PLAYBACK_RATE = 1;
const RATE_LERP_FACTOR = 0.08;

export const MarqueeColumn = memo(function MarqueeColumn({
  templates,
  direction,
  duration,
  columnIndex,
  reducedMotion,
  focusClass = "",
  visibilityClass = "block",
}: MarqueeColumnProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const currentRateRef = useRef<number>(NORMAL_PLAYBACK_RATE);
  const targetRateRef = useRef<number>(NORMAL_PLAYBACK_RATE);
  const rafRef = useRef<number | null>(null);

  const interpolatePlaybackRate = useCallback((nextTarget: number) => {
    targetRateRef.current = nextTarget;
    if (rafRef.current !== null) return;

    const tick = () => {
      const anim = animationRef.current;
      if (!anim) {
        rafRef.current = null;
        return;
      }

      const current = currentRateRef.current;
      const target = targetRateRef.current;
      const delta = target - current;

      if (Math.abs(delta) < 0.004) {
        currentRateRef.current = target;
        anim.playbackRate = target;
        rafRef.current = null;
        return;
      }

      const nextRate = current + delta * RATE_LERP_FACTOR;
      currentRateRef.current = nextRate;
      anim.playbackRate = nextRate;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reducedMotion) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const keyframes: Keyframe[] =
      direction === "up"
        ? [
            { transform: "translate3d(0, 0%, 0)" },
            { transform: "translate3d(0, -50%, 0)" },
          ]
        : [
            { transform: "translate3d(0, -50%, 0)" },
            { transform: "translate3d(0, 0%, 0)" },
          ];

    const anim = track.animate(keyframes, {
      duration: duration * 1000,
      iterations: Infinity,
      easing: "linear",
    });

    animationRef.current = anim;
    currentRateRef.current = NORMAL_PLAYBACK_RATE;
    targetRateRef.current = NORMAL_PLAYBACK_RATE;

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      anim.cancel();
      animationRef.current = null;
    };
  }, [direction, duration, reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;
    interpolatePlaybackRate(HOVER_PLAYBACK_RATE);
  }, [interpolatePlaybackRate, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;
    interpolatePlaybackRate(NORMAL_PLAYBACK_RATE);
  }, [interpolatePlaybackRate, reducedMotion]);

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: reducedMotion ? 0 : columnIndex * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full w-full md:w-[252px] xl:w-[268px] shrink-0 origin-center ${visibilityClass}`}
    >
      <div className={`relative h-full w-full origin-center ${focusClass}`}>
        <div
          ref={trackRef}
          className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          <div className="flex flex-col gap-4 pb-4">
            {templates.map((tmpl, idx) => (
              <TemplateCard
                key={tmpl.id}
                template={tmpl}
                priority={idx < 3}
              />
            ))}
          </div>

          {!reducedMotion && (
            <div className="flex flex-col gap-4 pb-4" aria-hidden="true">
              {templates.map((tmpl) => (
                <TemplateCard
                  key={`${tmpl.id}-loop`}
                  template={tmpl}
                  priority={false}
                  tabIndex={-1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
