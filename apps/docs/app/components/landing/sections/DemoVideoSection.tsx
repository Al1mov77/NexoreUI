'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Zap, Layers, Video } from 'lucide-react';

export function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="py-24 px-6 border-b border-zinc-900/80 bg-[#030305] relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10 text-center">
        
        {/* Section Heading */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-violet-950/20">
            <Video className="h-3.5 w-3.5 text-violet-400" />
            <span>VIDEO SHOWCASE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            See <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">NexoreUI</span> in Action
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            Watch how fast you can build, generate layouts with AI, and export production-ready React components.
          </p>
        </div>

        {/* Ultra-Stylish Showcase Video Player Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated Glow Border Frame */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 opacity-30 blur-xl group-hover:opacity-60 transition duration-1000" />

          {/* Floating Spec Badges */}
          <div className="hidden sm:flex items-center gap-2 absolute -top-5 left-8 z-30 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-violet-500/30 backdrop-blur-xl text-xs font-semibold text-violet-300 shadow-xl">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>AI Layout Generation</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 absolute -bottom-5 right-8 z-30 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-cyan-500/30 backdrop-blur-xl text-xs font-semibold text-cyan-300 shadow-xl">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>1-Click Multi-Framework Export</span>
          </div>

          {/* Main Video Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-zinc-700/60 bg-zinc-950/90 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
            {/* macOS Chrome Header */}
            <div className="h-10 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-zinc-950/95 backdrop-blur-md select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-md border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-zinc-300">nexoreui_demo_showcase.mp4</span>
              </div>

              <div className="text-[10px] font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                4K ULTRA HD
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
                className="w-full h-full object-cover"
              />

              {/* Hover Video Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 pointer-events-none">
                
                {/* Top status */}
                <div className="flex justify-between items-center text-xs font-mono text-white/80">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    LIVE DEMO SHOWCASE
                  </span>
                </div>

                {/* Bottom interactive controls bar */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                      title={isPlaying ? "Pause Video" : "Play Video"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                      title={isMuted ? "Unmute Sound" : "Mute Sound"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-transform active:scale-95 cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

export default DemoVideoSection;
