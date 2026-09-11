'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Layers,
  Wand2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Code2,
  Laptop,
  Share2,
  Check
} from 'lucide-react';
import { trackEvent } from '../../hooks/useAnalytics';

interface Chapter {
  time: number;
  label: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CHAPTERS: Chapter[] = [
  {
    time: 0,
    label: '0:00',
    title: 'Aurora & Intro',
    desc: 'Cinematic brand reveal with reactive ambient gradients and tactile sound design.',
    icon: Sparkles,
  },
  {
    time: 15,
    label: '0:15',
    title: 'Bento Grid & Component Anatomy',
    desc: 'Morphing geometry, fluid border glow physics, and copy-paste component APIs.',
    icon: Layers,
  },
  {
    time: 45,
    label: '0:45',
    title: 'Interactive Studio & Templates',
    desc: 'Live multi-device template previews, customizable color tokens, and instant presets.',
    icon: Zap,
  },
  {
    time: 80,
    label: '1:20',
    title: 'Nexore Make AI Generator',
    desc: 'Natural language UI creation directly in your browser with real-time live preview.',
    icon: Wand2,
  },
  {
    time: 115,
    label: '1:55',
    title: 'Framework Export & Smooth Outro',
    desc: 'One-click exports for Next.js, Vite, React 19, and rock-solid subpixel outro.',
    icon: Flame,
  },
];

export function DemoPageClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(127.8);
  const [activeChapter, setActiveChapter] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

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
      trackEvent({ eventType: 'demo_video_completed', feature: 'demo_page_theater' });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    // Initial play event
    trackEvent({ eventType: 'demo_video_played', feature: 'demo_page_theater' });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Keyboard shortcut listener (Space = play/pause, M = mute/unmute, F = fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      trackEvent({ eventType: 'demo_video_played', feature: 'demo_page_theater' });
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

  const cyclePlaybackRate = () => {
    if (!videoRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const copyPageLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/20 pb-28">
      {/* Ambient background glow radiating from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-12 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-violet-950/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>60 FPS CINEMATIC PRODUCT TOUR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Experience <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">NexoreUI</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-2xl mx-auto">
            Take a 2-minute tour through our design system, real-time AI builder, and interactive components engineered for visual excellence.
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-primary/20"
            >
              <span>Explore Docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Studio Builder</span>
            </Link>

            <Link
              href="/nexoremake"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-violet-500" />
              <span>Nexore Make AI</span>
            </Link>

            <button
              onClick={copyPageLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Demo'}</span>
            </button>
          </div>
        </div>

        {/* Video Player Theater Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Video Theater Window (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-2xl border border-border dark:border-zinc-800 bg-card/90 dark:bg-zinc-950/90 shadow-2xl overflow-hidden group">
              
              {/* macOS Chrome Header Bar */}
              <div className="h-10 border-b border-border dark:border-zinc-800/80 px-4 flex items-center justify-between bg-muted/80 dark:bg-zinc-950/95 backdrop-blur-md select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground dark:text-zinc-400 bg-background/80 dark:bg-zinc-900/80 px-3 py-1 rounded-md border border-border dark:border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-foreground dark:text-zinc-300">nexoreui-cinematic-tour.mp4</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                    60 FPS 1080p
                  </span>
                </div>
              </div>

              {/* Video Screen */}
              <div
                className="relative aspect-video bg-black overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src="/videos/demo.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                />

                {/* Big Play Overlay if paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-18 h-18 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Hover Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6 pointer-events-none z-30">
                  
                  {/* Top Header status */}
                  <div className="flex justify-between items-center text-xs font-mono text-white/90">
                    <span className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-md backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Section: {CHAPTERS[activeChapter]?.title}
                    </span>
                    <span className="text-[11px] text-white/70 bg-black/50 px-2 py-1 rounded-md">
                      [Space: Play/Pause] [M: Mute] [F: Fullscreen]
                    </span>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="space-y-2 pointer-events-auto">
                    {/* Scrub bar */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={duration || 127.8}
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

                        <button
                          onClick={(e) => { e.stopPropagation(); cyclePlaybackRate(); }}
                          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-mono transition-transform active:scale-95 cursor-pointer"
                          title="Change Speed"
                        >
                          {playbackRate}x
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
            </div>

            {/* Quick spec pills under video */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  60 FPS Smooth Frame Blending
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Tactile Audio Synthesis
                </span>
              </div>
              <span className="font-mono text-[11px] opacity-70">
                Duration: 02:07 • Remastered Master
              </span>
            </div>
          </div>

          {/* Interactive Chapter Timeline Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Chapters & Highlights</span>
                </h2>
                <span className="text-[11px] font-mono text-muted-foreground">5 Key Milestones</span>
              </div>

              <div className="space-y-2">
                {CHAPTERS.map((ch, idx) => {
                  const Icon = ch.icon;
                  const isActive = activeChapter === idx;
                  return (
                    <button
                      key={ch.label}
                      onClick={() => jumpToChapter(ch.time, ch.title)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        isActive
                          ? 'bg-primary/10 border-primary/40 shadow-sm'
                          : 'bg-background/40 hover:bg-background/80 border-border/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              isActive ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {ch.title}
                          </span>
                          <span className="text-[11px] font-mono font-bold opacity-75">
                            {ch.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {ch.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 via-card to-cyan-500/10 backdrop-blur-md space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Start Building Today
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add NexoreUI components to your React / Next.js app in seconds with our unified CLI.
              </p>
              <div className="p-2.5 rounded-lg bg-black/80 font-mono text-xs text-emerald-400 flex items-center justify-between">
                <code>npx nexoreui add button</code>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Engineered for Modern Web Teams
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Everything demonstrated in this tour is ready to use in your applications today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Aesthetic Engineering</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dark-first glassmorphism, Aurora reactive borders, and smooth spring physics tuned for 60 FPS performance.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Nexore Make AI</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate production-ready React components and responsive landing sections directly in your browser with AI.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Multi-Framework Exports</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export cleanly to Next.js 15, Vite, Remix, or React 19 with Tailwind CSS v4 support out of the box.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DemoPageClient;
