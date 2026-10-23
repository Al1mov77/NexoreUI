"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  ArrowRight,
  Layers,
} from "lucide-react";
import { trackEvent } from "../../../../hooks/useAnalytics";

interface Chapter {
  readonly time: number;
  readonly endTime: number;
  readonly label: string;
  readonly title: string;
}

const CHAPTERS: readonly Chapter[] = [
  { time: 0, endTime: 22, label: "0:00", title: "Philosophy" },
  { time: 22, endTime: 48, label: "0:22", title: "Components" },
  { time: 48, endTime: 78, label: "0:48", title: "Nexore Make" },
  { time: 78, endTime: 95.25, label: "1:18", title: "Code Export" },
] as const;

export function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(95.25);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const cur = video.currentTime;
      setCurrentTime(cur);

      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        if (cur >= CHAPTERS[i].time) {
          setActiveChapter(i);
          break;
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration) setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      trackEvent({ eventType: "demo_video_completed", feature: "landing_showcase" });
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
      trackEvent({ eventType: "demo_video_played", feature: "landing_showcase" });
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const restartVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
    trackEvent({ eventType: "demo_video_played", feature: "restart" });
  }, []);

  const jumpToChapter = useCallback(
    (time: number, title: string) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = time;
      if (!isPlaying) {
        video.play().catch(() => {});
        setIsPlaying(true);
      }
      trackEvent({ eventType: "demo_video_chapter", feature: title });
    },
    [isPlaying]
  );

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section
      id="demo"
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden border-b border-border/60 bg-muted/20 dark:bg-zinc-950/40 select-none transition-colors duration-300"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,0,0,0.03),transparent_75%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,255,255,0.04),transparent_75%)]" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground block">
            Product Walkthrough
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.035em] text-foreground leading-[1.08] text-balance">
            See NexoreUI in action
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            A concise architectural tour: core components, visual builder, and instant Next.js production code exports.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card/80 dark:bg-zinc-900/80 border border-border/80 dark:border-white/10 backdrop-blur-xl shadow-xs max-w-full overflow-x-auto no-scrollbar">
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={ch.time}
                  type="button"
                  onClick={() => jumpToChapter(ch.time, ch.title)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="demoChapterTab"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 450, damping: 32 }
                      }
                      className="absolute inset-0 bg-background dark:bg-zinc-800 rounded-lg border border-border/80 dark:border-white/15 shadow-xs"
                    />
                  )}
                  <span className="relative z-10 font-mono text-[10px] text-muted-foreground">
                    {ch.label}
                  </span>
                  <span className="relative z-10">{ch.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="group relative rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-zinc-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12),0_8px_20px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />

            <div
              className="relative aspect-video bg-black overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src="/videos/demo.mp4"
                poster="/videos/demo-poster.jpg"
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />

              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px] flex items-center justify-center z-20 pointer-events-none">
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105"
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                  </motion.div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 pointer-events-none z-30">
                <div className="space-y-3 pointer-events-auto">
                  <div className="flex gap-1.5 w-full h-1.5 cursor-pointer">
                    {CHAPTERS.map((ch) => {
                      const chDuration = ch.endTime - ch.time;
                      const chProgress = Math.max(
                        0,
                        Math.min(1, (currentTime - ch.time) / chDuration)
                      );
                      const widthPercent = (chDuration / (duration || 95.25)) * 100;

                      return (
                        <div
                          key={ch.time}
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToChapter(ch.time, ch.title);
                          }}
                          style={{ width: `${widthPercent}%` }}
                          className="relative h-full bg-white/20 hover:bg-white/35 rounded-full overflow-hidden transition-colors"
                        >
                          <div
                            className="h-full bg-white transition-all duration-100"
                            style={{ width: `${chProgress * 100}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-white pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-white" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          restartVideo();
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                        aria-label="Restart"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                        aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <span className="text-xs font-mono text-zinc-300 pl-2 tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                      aria-label="Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-foreground text-background font-semibold text-xs shadow-md transition-opacity hover:opacity-90 cursor-pointer"
          >
            <span>Explore All Components</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/nexoremake"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-border/80 bg-card hover:bg-muted font-semibold text-xs text-foreground transition-colors shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Launch Nexore Make</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DemoVideoSection;
