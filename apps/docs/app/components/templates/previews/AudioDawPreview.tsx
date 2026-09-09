"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Radio,
  Disc,
  Headphones,
  Music,
  CheckCircle2,
  X,
  Download,
  Share2,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AudioDawPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // Sequencer playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(140);
  const [selectedLicense, setSelectedLicense] = useState("wav");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutToast, setCheckoutToast] = useState<string | null>(null);

  // FX states
  const [reverbWet, setReverbWet] = useState(32);
  const [delayTime, setDelayTime] = useState(250);
  const [filterCutoff, setFilterCutoff] = useState(12500);

  // Sequencer 16-step matrix (4 instruments x 16 steps)
  const [pattern, setPattern] = useState<Record<string, boolean[]>>({
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    perc: [false, false, true, false, false, false, true, false, false, true, false, false, false, false, true, false],
  });

  // Mixer channels
  const [channels, setChannels] = useState([
    { id: "drums", name: "Drums Bus", volume: 82, pan: 0, mute: false, solo: false, peak: "-2.1 dB" },
    { id: "bass", name: "808 Sub-Bass", volume: 90, pan: 0, mute: false, solo: false, peak: "-0.8 dB" },
    { id: "synth", name: "Neon Synth Lead", volume: 74, pan: -15, mute: false, solo: false, peak: "-4.2 dB" },
    { id: "vocals", name: "Glitch Vox Chops", volume: 68, pan: 20, mute: false, solo: false, peak: "-5.6 dB" },
  ]);

  // Step sequencer animation ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const stepDuration = (60 / bpm / 4) * 1000;
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 16);
      }, stepDuration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  const toggleStep = (instrument: string, stepIdx: number) => {
    setPattern((prev) => ({
      ...prev,
      [instrument]: prev[instrument].map((active, idx) => (idx === stepIdx ? !active : active)),
    }));
  };

  const toggleMute = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, mute: !ch.mute } : ch))
    );
  };

  const toggleSolo = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, solo: !ch.solo } : ch))
    );
  };

  const updateVolume = (channelId: string, val: number) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, volume: val } : ch))
    );
  };

  const licenses = [
    { id: "mp3", title: "Standard MP3", price: "$29", format: "320kbps MP3", streams: "100,000 Streams", tag: "Starter" },
    { id: "wav", title: "Premium WAV", price: "$69", format: "24-bit 48kHz WAV", streams: "500,000 Streams", tag: "Most Popular" },
    { id: "stems", title: "Trackout Stems", price: "$149", format: "Separated Audio Stems", streams: "Unlimited Distribution", tag: "Pro Mix" },
    { id: "exclusive", title: "Full Exclusive", price: "$399", format: "Full Master Ownership", streams: "Complete Copyright Transfer", tag: "Sole Owner" },
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutModalOpen(false);
    setCheckoutToast("License agreement issued! High-res stems download link ready.");
    setTimeout(() => setCheckoutToast(null), 4000);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Header */}
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
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "disc"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "SoundForge Studio"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DAW Engine v4.2
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Virtual Sequencer & Audio Stem Marketplace</p>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="hidden @md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Session: Midnight Cyberpunk</span>
              <span className="opacity-30">•</span>
              <span className="text-amber-500">Key: D Minor</span>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>License Beat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {checkoutToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{checkoutToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Top Transport & Master Visualizer Bar */}
        <div
          className="p-5 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-4">
            {/* Playback controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: "var(--template-primary)" }}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono opacity-60">MASTER TEMPO</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">{bpm} BPM</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="90"
                    max="180"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-32 accent-indigo-500 cursor-pointer"
                  />
                  <button
                    onClick={() => setBpm(140)}
                    className="px-2 py-0.5 rounded border text-[10px] font-mono opacity-70 hover:opacity-100"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Spectrum Visualizer simulation */}
            <div className="flex items-end gap-1 h-12 px-4 py-1 rounded-xl border flex-1 max-w-md justify-between overflow-hidden" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
              {[45, 68, 85, 92, 60, 78, 95, 82, 70, 88, 55, 40, 65, 80, 50, 30].map((barHeight, idx) => (
                <div
                  key={idx}
                  className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t transition-all duration-75"
                  style={{
                    height: isPlaying ? `${Math.max(barHeight * (Math.sin(currentStep + idx) * 0.4 + 0.6), 15)}%` : "15%",
                    backgroundColor: isPlaying ? "var(--template-primary)" : "currentColor",
                    opacity: isPlaying ? 0.9 : 0.2,
                  }}
                />
              ))}
            </div>

            {/* Master Volume Output */}
            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <div className="text-right">
                <span className="opacity-50 block text-[10px]">MASTER OUTPUT</span>
                <span className="font-bold text-emerald-500">-0.4 dB LUFS</span>
              </div>
              <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive 16-Step Drum Sequencer Grid */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Interactive 16-Step Rhythm Sequencer</h2>
              <p className="text-xs opacity-65">Click trigger pads to craft rhythm loops. Current playhead moves in real time.</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() =>
                  setPattern({
                    kick: Array(16).fill(false),
                    snare: Array(16).fill(false),
                    hihat: Array(16).fill(false),
                    perc: Array(16).fill(false),
                  })
                }
                className="px-2.5 py-1 rounded-lg border opacity-70 hover:opacity-100"
                style={{ borderColor: "var(--template-border)" }}
              >
                Clear
              </button>
              <button
                onClick={() =>
                  setPattern({
                    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
                    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    perc: [false, false, true, false, false, false, true, false, false, true, false, false, false, false, true, false],
                  })
                }
                className="px-2.5 py-1 rounded-lg border text-indigo-400 font-semibold"
                style={{ borderColor: "var(--template-border)" }}
              >
                Load Default Groove
              </button>
            </div>
          </div>

          <div className="space-y-3 overflow-x-auto pb-2">
            {Object.keys(pattern).map((instrument) => (
              <div key={instrument} className="flex items-center gap-3 min-w-[620px]">
                <div className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider opacity-80">
                  {instrument === "kick"
                    ? "Kick 808"
                    : instrument === "snare"
                    ? "Snare Clap"
                    : instrument === "hihat"
                    ? "Hi-Hat Clsd"
                    : "Perc / Rim"}
                </div>

                <div className="flex-1 grid grid-cols-16 gap-1.5">
                  {pattern[instrument].map((active, stepIdx) => {
                    const isPlayhead = isPlaying && currentStep === stepIdx;
                    const isQuarter = stepIdx % 4 === 0;

                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(instrument, stepIdx)}
                        className={`h-11 rounded-lg border transition-all flex items-center justify-center relative ${
                          active
                            ? "shadow-sm"
                            : isDark
                            ? "bg-zinc-900/60"
                            : "bg-zinc-100"
                        } ${isPlayhead ? "ring-2 ring-amber-400" : ""}`}
                        style={{
                          backgroundColor: active ? "var(--template-primary)" : undefined,
                          borderColor: isQuarter ? (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)") : "var(--template-border)",
                        }}
                      >
                        {active && <span className="w-2 h-2 rounded-full bg-white shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 & 3: 4-Track DAW Mixer & Master FX Rack */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* 4-Track DAW Console Mixer */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Multi-Track Stem Mixer</h3>
                <p className="text-xs opacity-65">Faders, Mute/Solo logic & Stereo Panning</p>
              </div>
              <span className="text-xs font-mono opacity-70">4 Stems Routed</span>
            </div>

            <div className="grid grid-cols-2 @sm:grid-cols-4 gap-4 pt-2">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-xl border flex flex-col items-center text-center gap-3"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <span className="text-xs font-bold truncate max-w-full">{ch.name}</span>

                  {/* Fader & dB Meter */}
                  <div className="flex items-center gap-3 h-36">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ch.mute ? 0 : ch.volume}
                      disabled={ch.mute}
                      onChange={(e) => updateVolume(ch.id, Number(e.target.value))}
                      className="h-32 accent-indigo-500 cursor-pointer -rotate-90 w-32"
                    />

                    <div className="h-32 w-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex flex-col justify-end">
                      <div
                        className="w-full rounded-full transition-all"
                        style={{
                          height: ch.mute ? "0%" : `${ch.volume}%`,
                          backgroundColor: ch.volume > 85 ? "#f43f5e" : "#10b981",
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono opacity-70">{ch.mute ? "MUTED" : ch.peak}</span>

                  {/* Mute and Solo buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleMute(ch.id)}
                      className={`w-7 h-7 rounded text-[11px] font-bold border transition-colors ${
                        ch.mute ? "bg-rose-500 text-white border-rose-500" : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ borderColor: ch.mute ? undefined : "var(--template-border)" }}
                    >
                      M
                    </button>
                    <button
                      onClick={() => toggleSolo(ch.id)}
                      className={`w-7 h-7 rounded text-[11px] font-bold border transition-colors ${
                        ch.solo ? "bg-amber-500 text-white border-amber-500" : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ borderColor: ch.solo ? undefined : "var(--template-border)" }}
                    >
                      S
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master FX Controls */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Analog FX Rack</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DSP Active
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="opacity-80">Studio Plate Reverb Wet</span>
                    <span className="font-bold">{reverbWet}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverbWet}
                    onChange={(e) => setReverbWet(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="opacity-80">Analog Tape Delay Feedback</span>
                    <span className="font-bold">{delayTime} ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="800"
                    value={delayTime}
                    onChange={(e) => setDelayTime(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="opacity-80">Moog Low-Pass Filter Cutoff</span>
                    <span className="font-bold">{filterCutoff} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="20000"
                    value={filterCutoff}
                    onChange={(e) => setFilterCutoff(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Oversampling: 4x Linear Phase</span>
              <span>Bit Depth: 32-bit Float</span>
            </div>
          </div>
        </div>

        {/* Section 4: Beat Licensing Marketplace Tiers */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Royalty-Free Audio Licensing Tiers</h3>
              <p className="text-xs opacity-65">Instantly clear production rights for Spotify, YouTube, Apple Music, and Film Sync</p>
            </div>
            <span className="text-xs font-mono opacity-70">Instant Automated PDF Agreement</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
            {licenses.map((lic) => {
              const isSelected = selectedLicense === lic.id;
              return (
                <div
                  key={lic.id}
                  onClick={() => setSelectedLicense(lic.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }`}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">
                      {lic.tag}
                    </span>
                    <span className="text-lg font-extrabold font-mono">{lic.price}</span>
                  </div>
                  <h4 className="text-xs font-bold mb-1">{lic.title}</h4>
                  <p className="text-[11px] opacity-60 mb-2">{lic.format}</p>
                  <p className="text-[10px] text-emerald-500 font-semibold">{lic.streams}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "var(--template-bg)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Acquire Audio License</h3>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Selected Production Tier</label>
                  <select
                    value={selectedLicense}
                    onChange={(e) => setSelectedLicense(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  >
                    <option value="mp3">Standard MP3 Lease ($29)</option>
                    <option value="wav">Premium Lossless WAV ($69)</option>
                    <option value="stems">Trackout Stems Bundle ($149)</option>
                    <option value="exclusive">Full Exclusive Master Rights ($399)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">Licensee Artist / Label Legal Name</label>
                  <input
                    type="text"
                    defaultValue="Echo Soundworks Ltd."
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  />
                </div>

                <div className="p-3 rounded-xl border flex items-center justify-between font-mono" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
                  <span className="opacity-70">Payable Total:</span>
                  <span className="font-bold text-sm text-emerald-500">
                    {selectedLicense === "mp3" ? "$29" : selectedLicense === "wav" ? "$69" : selectedLicense === "stems" ? "$149" : "$399"} USD
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Authorize Payment & Download Stems
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
