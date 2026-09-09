"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Bookmark,
  Share2,
  Search,
  Download,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  ListMusic,
  FileText,
  Sliders,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AudioPodcastPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<"1.0x" | "1.25x" | "1.5x" | "2.0x">("1.0x");
  const [currentSeconds, setCurrentSeconds] = useState(255); // 04:15
  const [totalSeconds] = useState(3260); // 54:20
  const [volume, setVolume] = useState(80);
  const [activeTab, setActiveTab] = useState<"chapters" | "transcript" | "episodes">("chapters");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Playback ticker simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => (prev < totalSeconds ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const chapters = [
    { time: "00:00", secs: 0, title: "Cold Open & Microbenchmark Disclosures" },
    { time: "04:15", secs: 255, title: "Why Ring Buffers Outperform Channel Primitives" },
    { time: "18:40", secs: 1120, title: "Kernel-Bypass Networking with io_uring" },
    { time: "34:25", secs: 2065, title: "Memory Allocation Invariants in High-Throughput Pipelines" },
    { time: "48:10", secs: 2890, title: "Audience Q&A: The Future of Edge WASM" },
  ];

  const transcriptLines = [
    { time: "04:15", speaker: "Host", text: "Welcome back. Today we're analyzing zero-cost abstractions with Linus M. Linus, let's start with lockless ring buffers." },
    { time: "04:32", speaker: "Linus M.", text: "Right. Standard channel implementations incur severe context-switching overhead because of mutex arbitration. With a single-producer single-consumer circular buffer, memory barriers alone guarantee linearizability without kernel traps." },
    { time: "05:10", speaker: "Host", text: "And that drops cache misses dramatically across modern x86 and ARM Neoverse cores." },
    { time: "05:25", speaker: "Linus M.", text: "Precisely. In our benchmarks, throughput increased from 1.2M ops/sec to over 18.4M ops/sec under 100% saturation." },
  ];

  const episodes = [
    { ep: "EP 148", title: "Zero-Cost Abstractions & Kernel Bypass", date: "Sep 08, 2026", duration: "54:20", active: true },
    { ep: "EP 147", title: "Compiling Vector Indexes Directly to NVMe", date: "Sep 01, 2026", duration: "48:15" },
    { ep: "EP 146", title: "The Distributed Systems Graveyard", date: "Aug 25, 2026", duration: "62:10" },
    { ep: "EP 145", title: "Formal Verification of Raft Invariants with TLA+", date: "Aug 18, 2026", duration: "51:40" },
  ];

  const filteredTranscript = transcriptLines.filter((line) =>
    line.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left pb-28"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Studio Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "flame"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm @sm:text-base tracking-tight"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "EchoWave Audio"}
              </span>
              <span className="hidden @md:inline-block text-xs opacity-60 ml-2 font-mono">
                • Systems Broadcast
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="hidden @sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
            >
              <Radio className="h-3 w-3 animate-pulse" />
              <span>24-bit / 96kHz FLAC</span>
            </div>

            <button
              onClick={() => {
                setDownloadToast("Subscribed to RSS feed! Copied feed URL.");
                setTimeout(() => setDownloadToast(null), 3000);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ borderColor: "var(--template-border)" }}
            >
              Subscribe RSS
            </button>
          </div>
        </div>
      </header>

      {/* Featured Episode Hero */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @sm:py-8 space-y-6">
        <div
          className="p-6 @sm:p-8 rounded-3xl border flex flex-col @md:flex-row items-center gap-6 @sm:gap-8 relative overflow-hidden"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          {/* Episode Album Art Mockup */}
          <div className="w-36 h-36 @sm:w-48 @sm:h-48 rounded-2xl bg-gradient-to-tr from-indigo-900 via-violet-700 to-sky-500 flex flex-col justify-between p-4 text-white shadow-2xl shrink-0 relative group">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase opacity-80">
                EchoWave
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20">
                EP 148
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono opacity-80">Season 4</div>
              <div className="text-sm @sm:text-base font-bold leading-tight">Zero-Cost Abstractions</div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl"
              aria-label="Play or Pause"
            >
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
              </div>
            </button>
          </div>

          {/* Episode Metadata & Synopsis */}
          <div className="space-y-3 flex-1 text-center @md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Released Sep 08, 2026 • 54 mins 20 secs</span>
            </div>

            <h1
              className="text-2xl @sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              Zero-Cost Abstractions & Kernel-Bypass Pipelines
            </h1>

            <p className="text-xs @sm:text-sm opacity-75 max-w-2xl leading-relaxed">
              We interview Linus M. about dismantling memory barriers, squeezing 18M ops/second from lockless circular queues, and why traditional OS networking stacks fall short for high-frequency trading.
            </p>

            <div className="flex flex-wrap items-center justify-center @md:justify-start gap-3 pt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2 transition-transform active:scale-95"
                style={{
                  backgroundColor: "var(--template-primary)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{isPlaying ? "Pause Broadcast" : "Listen Episode (54m)"}</span>
              </button>

              <button
                onClick={() => {
                  setDownloadToast("Downloading episode audio (142MB FLAC)...");
                  setTimeout(() => setDownloadToast(null), 3000);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
                style={{ borderColor: "var(--template-border)" }}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls: Chapters, Interactive Transcript, Season Episodes */}
        <div
          className="flex items-center gap-2 border-b pb-2 text-xs font-semibold"
          style={{ borderColor: "var(--template-border)" }}
        >
          {[
            { id: "chapters", label: "Episode Chapters", icon: ListMusic },
            { id: "transcript", label: "Live Transcript", icon: FileText },
            { id: "episodes", label: "Season Archive", icon: Headphones },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Chapters */}
        {activeTab === "chapters" && (
          <div className="space-y-2.5">
            {chapters.map((ch) => {
              const isCurrent = currentSeconds >= ch.secs && currentSeconds < ch.secs + 900;
              return (
                <div
                  key={ch.time}
                  onClick={() => {
                    setCurrentSeconds(ch.secs);
                    setIsPlaying(true);
                  }}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? "border-indigo-500 bg-indigo-500/10 font-bold"
                      : "hover:border-zinc-400 opacity-80"
                  }`}
                  style={{
                    backgroundColor: isCurrent ? undefined : "var(--template-surface)",
                    borderColor: isCurrent ? undefined : "var(--template-border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      {ch.time}
                    </span>
                    <span className="text-xs @sm:text-sm">{ch.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content 2: Searchable Transcript */}
        {activeTab === "transcript" && (
          <div
            className="p-5 @sm:p-6 rounded-2xl border space-y-4"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 opacity-50" />
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript phrases..."
                  className="w-full pl-8 pr-4 py-1.5 rounded-xl border text-xs bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>
              <span className="text-xs opacity-60 font-mono hidden @sm:inline">Synchronized</span>
            </div>

            <div className="space-y-3 pt-2">
              {filteredTranscript.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border space-y-1 text-xs leading-relaxed"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between font-mono text-[11px] opacity-70">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.speaker}</span>
                    <span>{t.time}</span>
                  </div>
                  <p className="opacity-85">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Season Episodes Archive */}
        {activeTab === "episodes" && (
          <div className="space-y-2.5">
            {episodes.map((ep) => (
              <div
                key={ep.ep}
                className="p-4 rounded-xl border flex items-center justify-between"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: "var(--template-border)",
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{ep.ep}</span>
                    <span className="font-bold text-xs @sm:text-sm">{ep.title}</span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5">{ep.date} • {ep.duration}</div>
                </div>

                <button
                  onClick={() => setIsPlaying(true)}
                  className="p-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Persistent Audio Waveform Player Bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-2xl border-t transition-colors shadow-2xl"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.94)" : "rgba(255, 255, 255, 0.95)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-3 flex flex-col @md:flex-row items-center justify-between gap-3">
          {/* Episode Snippet Info */}
          <div className="flex items-center gap-3 w-full @md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-800 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              EP148
            </div>
            <div className="truncate">
              <div className="font-bold text-xs truncate">Zero-Cost Abstractions</div>
              <div className="text-[10px] opacity-60 truncate">Linus M. • EP 148</div>
            </div>
          </div>

          {/* Core Controls & Waveform */}
          <div className="flex flex-col items-center gap-1.5 w-full max-w-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentSeconds(Math.max(0, currentSeconds - 15))}
                className="opacity-70 hover:opacity-100"
                title="Rewind 15s"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentSeconds(Math.min(totalSeconds, currentSeconds + 15))}
                className="opacity-70 hover:opacity-100"
                title="Forward 15s"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              {/* Speed Multiplier */}
              <button
                onClick={() => {
                  const speeds: ("1.0x" | "1.25x" | "1.5x" | "2.0x")[] = ["1.0x", "1.25x", "1.5x", "2.0x"];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border opacity-80 hover:opacity-100"
                style={{ borderColor: "var(--template-border)" }}
              >
                {playbackSpeed}
              </button>
            </div>

            {/* Scrubbable Waveform Visualizer */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono opacity-60 w-10 text-right">
                {formatTime(currentSeconds)}
              </span>

              {/* SVG Dynamic Waveform Bars */}
              <div className="flex-1 flex items-center gap-0.5 h-6 cursor-pointer">
                {Array.from({ length: 45 }).map((_, i) => {
                  const pct = (i / 45) * totalSeconds;
                  const isPassed = currentSeconds >= pct;
                  const h = 6 + ((i * 11) % 18);
                  return (
                    <div
                      key={i}
                      onClick={() => setCurrentSeconds(Math.floor(pct))}
                      className={`flex-1 rounded-full transition-all ${
                        isPassed ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700 opacity-60"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>

              <span className="text-[10px] font-mono opacity-60 w-10">
                {formatTime(totalSeconds)}
              </span>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="hidden @md:flex items-center gap-2">
            <Volume2 className="h-4 w-4 opacity-60" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-20 accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Download Notification Toast */}
      {downloadToast && (
        <div className="fixed bottom-24 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
}
