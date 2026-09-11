'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Zap,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Flame,
  Layers,
  Wand2
} from 'lucide-react';
import { trackEvent } from '../../../../hooks/useAnalytics';

const CHAPTERS = [
  { time: 0, label: '0:00', title: 'Aurora & Intro', icon: Sparkles },
  { time: 15, label: '0:15', title: 'Bento & Components', icon: Layers },
  { time: 45, label: '0:45', title: 'Studio Builder', icon: Zap },
  { time: 80, label: '1:20', title: 'Nexore Make AI', icon: Wand2 },
  { time: 115, label: '1:55', title: 'Framework Export', icon: Flame },
];

export function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(127.8);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const cur = video.currentTime;
      setCurrentTime(cur);

      // Find current chapter
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
      trackEvent({ eventType: 'demo_video_completed', feature: 'landing_showcase' });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      trackEvent({ eventType: 'demo_video_played', feature: 'landing_showcase' });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
    trackEvent({ eventType: 'demo_video_played', feature: 'restart' });
  };

  const jumpToChapter = (time: number, title: string) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    trackEvent({ eventType: 'demo_video_chapter', feature: title });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="py-24 px-4 sm:px-6 border-b border-border/80 bg-muted/20 dark:bg-[#030305] relative overflow-hidden select-none transition-colors duration-300">
      {/* Dynamic ambient backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[480px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10 text-center">
        
        {/* Section Heading */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-violet-950/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>60 FPS INTERACTIVE DEMO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            See <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">NexoreUI</span> in Action
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
            Watch the 2-minute tour: learn how fast you can build, assemble interactive layouts, and export production-ready code with AI.
          </p>
        </div>

        {/* Chapter Quick Jumps */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {CHAPTERS.map((ch, idx) => {
            const Icon = ch.icon;
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.label}
                onClick={() => jumpToChapter(ch.time, ch.title)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105 border border-primary'
                    : 'bg-card/70 hover:bg-card border border-border/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px] opacity-75">{ch.label}</span>
                <span>{ch.title}</span>
              </button>
            );
          })}
        </div>

        {/* Ultra-Stylish Showcase Video Player Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated Glow Border Frame */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 opacity-20 dark:opacity-30 blur-xl group-hover:opacity-50 dark:group-hover:opacity-60 transition duration-1000" />

          {/* Floating Spec Badges */}
          <div className="hidden sm:flex items-center gap-2 absolute -top-5 left-8 z-30 px-3.5 py-1.5 rounded-full bg-card/90 dark:bg-zinc-950/90 border border-violet-500/30 backdrop-blur-xl text-xs font-semibold text-violet-600 dark:text-violet-300 shadow-xl">
            <Sparkles className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
            <span>AI Layout Generation</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 absolute -bottom-5 right-8 z-30 px-3.5 py-1.5 rounded-full bg-card/90 dark:bg-zinc-950/90 border border-cyan-500/30 backdrop-blur-xl text-xs font-semibold text-cyan-600 dark:text-cyan-300 shadow-xl">
            <Zap className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>1-Click Multi-Framework Export</span>
          </div>

          {/* Main Video Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-border dark:border-zinc-700/60 bg-card/90 dark:bg-zinc-950/90 shadow-2xl dark:shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
            {/* macOS Chrome Header */}
            <div className="h-10 border-b border-border dark:border-zinc-800/80 px-4 flex items-center justify-between bg-muted/80 dark:bg-zinc-950/95 backdrop-blur-md select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground dark:text-zinc-400 bg-background/80 dark:bg-zinc-900/80 px-3 py-1 rounded-md border border-border dark:border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-foreground dark:text-zinc-300">nexoreui-cinematic-demo.mp4</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                  60 FPS HD
                </span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center cursor-pointer" onClick={togglePlay}>
              <video
                ref={videoRef}
                src="/videos/demo.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />

              {/* Central Play Indicator on Pause */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Hover Video Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6 pointer-events-none z-30">
                
                {/* Top status */}
                <div className="flex justify-between items-center text-xs font-mono text-white/80">
                  <span className="flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Chapter: {CHAPTERS[activeChapter]?.title}
                  </span>
                  <Link
                    href="/demo"
                    onClick={(e) => e.stopPropagation()}
                    className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-sans transition-colors"
                  >
                    <span>Full Theater Mode</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Bottom interactive controls bar */}
                <div className="space-y-2 pointer-events-auto">
                  {/* Timeline Scrubber */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={duration || 127}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-violet-400 focus:outline-none"
                    />
                    <span className="text-xs font-mono text-white/90 shrink-0">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); restartVideo(); }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                        title="Restart"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                        title={isMuted ? "Unmute Sound" : "Mute Sound"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* Section Action Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-95 transition-all active:scale-98"
          >
            <span>Open Dedicated Demo Page</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card hover:bg-muted border border-border text-foreground font-semibold text-sm transition-all"
          >
            <span>Browse Components</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default DemoVideoSection;
