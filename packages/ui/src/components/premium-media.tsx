"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileCode2,
  FileText,
  Film,
  Image as ImageIcon,
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "./button";

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseClock(durationLabel: string): number {
  const parts = durationLabel.split(":").map((n) => Number(n));
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return Math.max(1, parts[0] * 60 + parts[1]);
  }
  return 180;
}

function isRenderableMediaUrl(src?: string): src is string {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
}

export function AudioWaveform({
  playing = false,
  bars = 32,
  progress = 38,
  onSeek,
  className,
}: {
  playing?: boolean;
  bars?: number;
  progress?: number;
  onSeek?: (pct: number) => void;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const amplitudes = React.useMemo(() => {
    return Array.from({ length: bars }, (_, idx) => {
      const n =
        0.52 +
        0.26 * Math.sin(idx * 0.42 + 0.6) +
        0.18 * Math.cos(idx * 0.91 - 0.3);
      return Math.round(Math.min(1, Math.max(0.18, n)) * 100);
    });
  }, [bars]);

  const handlePointerSeek = (clientX: number) => {
    if (!onSeek || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    onSeek(Math.round(pct * 10) / 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onSeek) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onSeek(Math.min(100, clampedProgress + 5));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onSeek(Math.max(0, clampedProgress - 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      onSeek(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onSeek(100);
    }
  };

  return (
    <div
      ref={containerRef}
      role={onSeek ? "slider" : undefined}
      tabIndex={onSeek ? 0 : undefined}
      aria-label={onSeek ? "Audio progress waveform" : undefined}
      aria-valuemin={onSeek ? 0 : undefined}
      aria-valuemax={onSeek ? 100 : undefined}
      aria-valuenow={onSeek ? Math.round(clampedProgress) : undefined}
      onKeyDown={handleKeyDown}
      onClick={(e) => handlePointerSeek(e.clientX)}
      className={cn(
        "flex h-12 w-full items-center gap-[3px] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-0.5",
        onSeek && "cursor-pointer",
        className
      )}
    >
      {amplitudes.map((baseHeight, idx) => {
        const barPct = ((idx + 0.5) / bars) * 100;
        const isPlayed = barPct <= clampedProgress;
        const animatedScale =
          playing && !shouldReduceMotion
            ? [1, 0.72 + ((idx % 4) * 0.12), 1]
            : 1;

        return (
          <motion.span
            key={idx}
            className={cn(
              "flex-1 rounded-full origin-center transition-colors duration-150",
              isPlayed ? "bg-foreground" : "bg-muted-foreground/30"
            )}
            style={{ height: `${baseHeight}%` }}
            animate={
              playing && !shouldReduceMotion
                ? { scaleY: animatedScale }
                : { scaleY: 1 }
            }
            transition={
              playing && !shouldReduceMotion
                ? {
                    duration: 0.7 + (idx % 5) * 0.14,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.15 }
            }
          />
        );
      })}
    </div>
  );
}

export interface MusicPlayerTrack {
  title: string;
  artist: string;
  album?: string;
  durationSeconds?: number;
}

export function MusicPlayer({
  title,
  artist,
  album,
  tracks,
  className,
}: {
  title: string;
  artist: string;
  album?: string;
  tracks?: MusicPlayerTrack[];
  className?: string;
}) {
  const queue = React.useMemo<MusicPlayerTrack[]>(() => {
    if (tracks && tracks.length > 0) return tracks;
    return [{ title, artist, album, durationSeconds: 222 }];
  }, [tracks, title, artist, album]);

  const [trackIndex, setTrackIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(0);
  const speeds = [1, 1.25, 1.5, 2];

  const activeTrack = queue[trackIndex] ?? queue[0];
  const durationSec = activeTrack.durationSeconds ?? 222;
  const [elapsedSec, setElapsedSec] = React.useState(74);

  React.useEffect(() => {
    if (!playing) return;
    const stepMs = Math.round(1000 / speeds[speedIdx]);
    const id = window.setInterval(() => {
      setElapsedSec((prev) => {
        if (prev + 1 >= durationSec) {
          if (queue.length > 1) {
            setTrackIndex((idx) => (idx + 1) % queue.length);
          }
          return 0;
        }
        return prev + 1;
      });
    }, stepMs);
    return () => window.clearInterval(id);
  }, [playing, speedIdx, durationSec, queue.length]);

  const progressPct = (elapsedSec / Math.max(1, durationSec)) * 100;

  const handleSeek = (pct: number) => {
    setElapsedSec(Math.round((pct / 100) * durationSec));
  };

  const handlePrev = () => {
    if (elapsedSec > 5 || queue.length <= 1) {
      setElapsedSec(0);
      return;
    }
    setTrackIndex((idx) => (idx - 1 + queue.length) % queue.length);
    setElapsedSec(0);
  };

  const handleNext = () => {
    if (queue.length <= 1) {
      setElapsedSec(0);
      return;
    }
    setTrackIndex((idx) => (idx + 1) % queue.length);
    setElapsedSec(0);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 font-mono text-xs font-semibold text-foreground">
            {(trackIndex + 1).toString().padStart(2, "0")}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">
              {activeTrack.title}
            </h4>
            <p className="truncate text-xs text-muted-foreground">
              {activeTrack.artist}
              {activeTrack.album ? ` · ${activeTrack.album}` : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSpeedIdx((prev) => (prev + 1) % speeds.length)}
          aria-label="Toggle playback speed"
          className="shrink-0 rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer tabular-nums"
        >
          {speeds[speedIdx]}x
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <AudioWaveform
          playing={playing}
          bars={36}
          progress={progressPct}
          onSeek={handleSeek}
        />
        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
          <span>{formatClock(elapsedSec)}</span>
          <span>-{formatClock(Math.max(0, durationSec - elapsedSec))}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
        <button
          type="button"
          onClick={() => setMuted((prev) => !prev)}
          aria-label={muted ? "Unmute audio" : "Mute audio"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            aria-label="Previous track"
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            onClick={() => setPlaying((prev) => !prev)}
            aria-label={playing ? "Pause track" : "Play track"}
            className="h-10 w-10 rounded-full"
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 translate-x-0.5" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNext}
            aria-label="Next track"
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <span className="w-8 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
          {queue.length > 1 ? `${trackIndex + 1}/${queue.length}` : "FLAC"}
        </span>
      </div>
    </div>
  );
}

export function VideoPlayer({
  title = "Architecture Walkthrough",
  duration = "3:45",
  thumbnail,
  src,
  className,
}: {
  title?: string;
  duration?: string;
  thumbnail?: string;
  src?: string;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(0);
  const speeds = [1, 1.25, 1.5, 2];

  const totalSeconds = parseClock(duration);
  const [currentSec, setCurrentSec] = React.useState(Math.round(totalSeconds * 0.24));

  React.useEffect(() => {
    if (src && videoRef.current) {
      videoRef.current.muted = muted;
      videoRef.current.playbackRate = speeds[speedIdx];
      if (playing) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      return;
    }

    if (!playing) return;
    const stepMs = Math.round(1000 / speeds[speedIdx]);
    const id = window.setInterval(() => {
      setCurrentSec((prev) => (prev + 1 >= totalSeconds ? 0 : prev + 1));
    }, stepMs);
    return () => window.clearInterval(id);
  }, [playing, muted, speedIdx, src, totalSeconds]);

  const pct = Math.min(100, (currentSec / Math.max(1, totalSeconds)) * 100);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const nextSec = Math.round(ratio * totalSeconds);
    setCurrentSec(nextSec);
    if (videoRef.current) {
      videoRef.current.currentTime = nextSec;
    }
  };

  const handleFullscreen = () => {
    if (typeof document === "undefined" || !containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={isRenderableMediaUrl(thumbnail) ? thumbnail : undefined}
            playsInline
            onTimeUpdate={(e) => setCurrentSec(Math.floor(e.currentTarget.currentTime))}
            className="h-full w-full object-cover"
          />
        ) : isRenderableMediaUrl(thumbnail) ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span className="rounded border border-border bg-background/90 px-2 py-0.5 text-foreground">
                {playing ? "PLAYING" : "STANDBY"}
              </span>
              <span className="tabular-nums">1080P · 60 FPS</span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <svg
                viewBox="0 0 320 120"
                className="h-24 w-full max-w-[280px] text-foreground/75"
                aria-hidden="true"
              >
                <rect
                  x="16"
                  y="14"
                  width="288"
                  height="92"
                  rx="8"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.18"
                />
                <line
                  x1="16"
                  y1="60"
                  x2="304"
                  y2="60"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeDasharray="3 3"
                />
                <path
                  d="M28 76 C68 44, 96 88, 134 52 C172 18, 206 86, 244 48 C264 28, 282 54, 294 42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle
                  cx={28 + (pct / 100) * 266}
                  cy="60"
                  r="4"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground truncate">{title}</span>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {formatClock(currentSec)} / {duration}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setPlaying((prev) => !prev)}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm transition-transform hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 translate-x-0.5" />
          )}
        </button>
      </div>

      <div className="space-y-2.5 px-4 py-3 bg-card">
        <div
          role="slider"
          tabIndex={0}
          aria-label="Video timeline"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          onClick={handleSeek}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setCurrentSec((p) => Math.min(totalSeconds, p + 5));
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setCurrentSec((p) => Math.max(0, p - 5));
            }
          }}
          className="group relative h-2 w-full cursor-pointer rounded-full bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setPlaying((prev) => !prev)}
              aria-label={playing ? "Pause" : "Play"}
              className="h-8 w-8"
            >
              {playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMuted((prev) => !prev)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="h-8 w-8"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {formatClock(currentSec)} / {duration}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSpeedIdx((prev) => (prev + 1) % speeds.length)}
              className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer tabular-nums"
            >
              {speeds[speedIdx]}x
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              aria-label="Toggle fullscreen"
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImageCompare({
  leftImage,
  rightImage,
  leftLabel = "Before",
  rightLabel = "After",
  className,
}: {
  leftImage?: string;
  rightImage?: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}) {
  const [split, setSplit] = React.useState(50);
  const [dragging, setDragging] = React.useState(false);
  const frameRef = React.useRef<HTMLDivElement>(null);

  const updateSplit = (clientX: number) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSplit(Math.round(pct * 10) / 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSplit((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSplit((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSplit(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSplit(100);
    }
  };

  const hasLeftImg = isRenderableMediaUrl(leftImage);
  const hasRightImg = isRenderableMediaUrl(rightImage);

  return (
    <div
      ref={frameRef}
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(split)}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => {
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        updateSplit(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging) updateSplit(e.clientX);
      }}
      onPointerUp={(e) => {
        setDragging(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
      className={cn(
        "relative aspect-[16/10] w-full max-w-xl cursor-ew-resize overflow-hidden rounded-2xl border border-border bg-card select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="absolute inset-0 bg-muted/40">
        {hasRightImg ? (
          <img
            src={rightImage}
            alt={rightLabel}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background p-6">
            <svg viewBox="0 0 320 180" className="h-full w-full text-foreground" aria-hidden="true">
              <rect
                x="48"
                y="24"
                width="224"
                height="132"
                rx="14"
                fill="currentColor"
                fillOpacity="0.06"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="68"
                y="46"
                width="82"
                height="88"
                rx="8"
                fill="currentColor"
                fillOpacity="0.9"
              />
              <rect
                x="166"
                y="46"
                width="86"
                height="24"
                rx="4"
                fill="currentColor"
                fillOpacity="0.2"
              />
              <rect
                x="166"
                y="80"
                width="64"
                height="16"
                rx="4"
                fill="currentColor"
                fillOpacity="0.14"
              />
              <rect
                x="166"
                y="108"
                width="86"
                height="26"
                rx="6"
                fill="currentColor"
                fillOpacity="0.85"
              />
            </svg>
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 bg-muted/70"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        {hasLeftImg ? (
          <img
            src={leftImage}
            alt={leftLabel}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted p-6">
            <svg
              viewBox="0 0 320 180"
              className="h-full w-full text-muted-foreground"
              aria-hidden="true"
            >
              <rect
                x="48"
                y="24"
                width="224"
                height="132"
                rx="14"
                fill="none"
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth="1.25"
              />
              <rect
                x="68"
                y="46"
                width="82"
                height="88"
                rx="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <line x1="68" y1="46" x2="150" y2="134" stroke="currentColor" strokeOpacity="0.35" />
              <line x1="150" y1="46" x2="68" y2="134" stroke="currentColor" strokeOpacity="0.35" />
              <rect x="166" y="46" width="86" height="24" rx="4" fill="none" stroke="currentColor" />
              <rect x="166" y="80" width="64" height="16" rx="4" fill="none" stroke="currentColor" />
              <rect x="166" y="108" width="86" height="26" rx="6" fill="none" stroke="currentColor" />
            </svg>
          </div>
        )}
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-md border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
        {leftLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
        {rightLabel}
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-foreground"
        style={{ left: `${split}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </div>
      </div>

      <span className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
        {Math.round(split)}%
      </span>
    </div>
  );
}

export function ImageCarousel({
  images,
  autoPlay = false,
  interval = 4500,
  className,
}: {
  images: { src: string; alt?: string }[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const count = images.length;

  React.useEffect(() => {
    if (!autoPlay || paused || count <= 1 || shouldReduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, count, interval, shouldReduceMotion]);

  if (count === 0) return null;

  const active = images[index];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex((prev) => (prev - 1 + count) % count);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex((prev) => (prev + 1) % count);
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Media slides"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-muted/40">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${active.src}-${index}`}
            initial={shouldReduceMotion ? false : { opacity: 0.35 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0.35 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
            className="h-full w-full"
          >
            {isRenderableMediaUrl(active.src) ? (
              <img
                src={active.src}
                alt={active.alt ?? `Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground tabular-nums">
                  Frame {(index + 1).toString().padStart(2, "0")}
                </span>
                <p className="text-base font-semibold text-foreground">
                  {active.alt ?? `Slide ${index + 1}`}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <span className="absolute right-3 top-3 rounded-md border border-border bg-background/90 px-2 py-0.5 font-mono text-[11px] text-foreground tabular-nums">
          {(index + 1).toString().padStart(2, "0")} / {count.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-xs font-medium text-foreground">
          {active.alt ?? `Slide ${index + 1}`}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  index === i ? "w-5 bg-foreground" : "w-1.5 bg-muted-foreground/35"
                )}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIndex((prev) => (prev - 1 + count) % count)}
            aria-label="Previous slide"
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIndex((prev) => (prev + 1) % count)}
            aria-label="Next slide"
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const FILE_TYPE_META: Record<
  "file" | "image" | "video" | "pdf" | "code",
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  pdf: { label: "PDF", Icon: FileText },
  image: { label: "IMG", Icon: ImageIcon },
  video: { label: "VID", Icon: Film },
  code: { label: "CODE", Icon: FileCode2 },
  file: { label: "FILE", Icon: FileText },
};

export function FilePreviewCard({
  name,
  size,
  type = "file",
  onDownload,
  className,
}: {
  name: string;
  size: string;
  type?: "file" | "image" | "video" | "pdf" | "code";
  onDownload?: () => void;
  className?: string;
}) {
  const [downloaded, setDownloaded] = React.useState(false);
  const meta = FILE_TYPE_META[type] ?? FILE_TYPE_META.file;
  const Icon = meta.Icon;

  const handleDownload = () => {
    setDownloaded(true);
    onDownload?.();
    window.setTimeout(() => setDownloaded(false), 1600);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-3.5 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
            <span className="rounded border border-border bg-muted px-1 py-0.25 text-[10px] text-foreground">
              {meta.label}
            </span>
            <span>{size}</span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDownload}
        aria-label={`Download ${name}`}
        className="h-8 w-8 shrink-0"
      >
        {downloaded ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export function EmbedCard({
  title,
  description,
  domain,
  favicon,
  href,
  className,
}: {
  title: string;
  description?: string;
  domain: string;
  favicon?: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-muted font-mono text-[10px] font-semibold uppercase text-foreground">
            {favicon ? favicon : domain.slice(0, 1)}
          </span>
          <span className="truncate font-mono text-xs text-muted-foreground">{domain}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const classes = cn(
    "group block w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-colors hover:border-foreground/30",
    className
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return <div className={classes}>{content}</div>;
}

export function GalleryGrid({
  items,
  className,
}: {
  items: { title: string; subtitle?: string; src?: string; color?: string }[];
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % items.length
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + items.length) % items.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, items.length]);

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full", className)}>
        {items.map((item, idx) => {
          const isFeatured = idx === 0 && items.length >= 4;
          return (
            <button
              key={`${item.title}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isFeatured && "sm:col-span-2"
              )}
            >
              {isRenderableMediaUrl(item.src) && (
                <img
                  src={item.src}
                  alt={item.title}
                  className="mb-3 aspect-video w-full rounded-lg object-cover border border-border"
                />
              )}
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground tabular-nums">
                <span>{(idx + 1).toString().padStart(2, "0")}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  Inspect
                </span>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                {item.subtitle && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.subtitle}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-xs p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-base font-semibold text-foreground">
                  {activeItem.title}
                </h4>
                {activeItem.subtitle && (
                  <p className="text-xs text-muted-foreground">{activeItem.subtitle}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Close gallery lightbox"
                onClick={() => setSelectedIndex(null)}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
              {isRenderableMediaUrl(activeItem.src) ? (
                <img
                  src={activeItem.src}
                  alt={activeItem.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center space-y-1 p-6">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {(selectedIndex + 1).toString().padStart(2, "0")} /{" "}
                    {items.length.toString().padStart(2, "0")}
                  </span>
                  <p className="text-base font-semibold text-foreground">
                    {activeItem.title}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedIndex((selectedIndex - 1 + items.length) % items.length)
                }
              >
                Previous
              </Button>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {(selectedIndex + 1).toString().padStart(2, "0")} /{" "}
                {items.length.toString().padStart(2, "0")}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedIndex((selectedIndex + 1) % items.length)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CodeSnippet({
  code,
  language = "tsx",
  filename,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.trimEnd().split("\n");

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
            {language}
          </span>
          {filename && (
            <span className="truncate font-mono text-xs font-medium text-foreground">
              {filename}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx}>
                <td className="w-8 select-none pr-4 text-right text-muted-foreground/50 tabular-nums align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre text-foreground">{line || " "}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TestimonialCarousel({
  testimonials,
  className,
}: {
  testimonials: { quote: string; author: string; role: string }[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [idx, setIdx] = React.useState(0);

  if (testimonials.length === 0) return null;
  const active = testimonials[idx];

  return (
    <div
      className={cn(
        "flex w-full max-w-xl flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.blockquote
          key={idx}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="space-y-4"
        >
          <p className="text-sm sm:text-base leading-relaxed text-foreground">
            &ldquo;{active.quote}&rdquo;
          </p>
          <footer>
            <p className="text-sm font-semibold text-foreground">{active.author}</p>
            <p className="text-xs text-muted-foreground">{active.role}</p>
          </footer>
        </motion.blockquote>
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-border pt-3.5">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {(idx + 1).toString().padStart(2, "0")} /{" "}
          {testimonials.length.toString().padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() =>
              setIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)
            }
            aria-label="Previous quote"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIdx((prev) => (prev + 1) % testimonials.length)}
            aria-label="Next quote"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
