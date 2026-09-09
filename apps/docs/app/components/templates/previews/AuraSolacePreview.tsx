"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Wind,
  Volume2,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Smile,
  BookOpen,
  PenTool,
  Check,
  Moon,
  Sun,
  Flame,
  CloudRain,
  Music,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AuraSolacePreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [breathPhase, setBreathPhase] = useState<"INHALE" | "HOLD" | "EXHALE">("INHALE");
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [selectedMood, setSelectedMood] = useState("Peaceful Grounded");
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [soundVolumes, setSoundVolumes] = useState({
    rain: 65,
    bowls: 40,
    fire: 30,
    solfeggio: 55,
  });
  const [solaceToast, setSolaceToast] = useState<string | null>(null);

  // Breathing pacer cycle (4-7-8 rhythm)
  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          if (breathPhase === "INHALE") {
            setBreathPhase("HOLD");
            return 7;
          } else if (breathPhase === "HOLD") {
            setBreathPhase("EXHALE");
            return 8;
          } else {
            setBreathPhase("INHALE");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [breathPhase]);

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJournalOpen(false);
    setSolaceToast("Mindful reflection entry saved to encrypted private sanctuary.");
    setTimeout(() => setSolaceToast(null), 3500);
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
          backgroundColor: isDark ? "rgba(10, 14, 18, 0.85)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "sparkles"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">AuraSolace</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(20, 184, 166, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Mental Health
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Somatic Nervous System Sanctuary & Ambient Soundscape
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJournalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Mindful Journal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {solaceToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(20, 184, 166, 0.12)" : "#f0fdfa",
                borderColor: "rgba(20, 184, 166, 0.3)",
                color: "#0d9488",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>{solaceToast}</span>
              </div>
              <button onClick={() => setSolaceToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Somatic Breath Pacer Stage & Sound Studio */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Left: 4-7-8 Breath Pacer Engine (7 cols) */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-6 @sm:p-8 rounded-2xl border flex flex-col items-center justify-between text-center min-h-[440px] relative overflow-hidden"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="w-full flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <span className="text-xs font-mono opacity-60">AUTONOMIC REGULATION</span>
                  <h3 className="text-base font-bold tracking-tight">4-7-8 Parasympathetic Pacer</h3>
                </div>
                <span className="text-xs font-mono text-teal-500 font-bold">CALM VAGUS NERVE</span>
              </div>

              {/* Animated Breath Orb */}
              <div className="my-8 relative flex items-center justify-center">
                {/* Glowing Outer Ripple */}
                <motion.div
                  animate={{
                    scale: breathPhase === "INHALE" ? 1.4 : breathPhase === "HOLD" ? 1.4 : 0.9,
                    opacity: breathPhase === "HOLD" ? 0.8 : 0.4,
                  }}
                  transition={{ duration: breathPhase === "INHALE" ? 4 : breathPhase === "HOLD" ? 7 : 8, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-full bg-teal-500/20 blur-xl absolute"
                />

                {/* Main Interactive Circle */}
                <motion.div
                  animate={{
                    scale: breathPhase === "INHALE" ? 1.25 : breathPhase === "HOLD" ? 1.25 : 0.95,
                  }}
                  transition={{ duration: breathPhase === "INHALE" ? 4 : breathPhase === "HOLD" ? 7 : 8, ease: "easeInOut" }}
                  className="w-44 h-44 rounded-full border-2 border-teal-500 flex flex-col items-center justify-center p-4 relative shadow-lg"
                  style={{
                    backgroundColor: isDark ? "#061314" : "#f0fdfa",
                  }}
                >
                  <Wind className="w-6 h-6 text-teal-500 mb-1" />
                  <span className="text-xs font-black tracking-wider uppercase text-teal-600 dark:text-teal-400">
                    {breathPhase === "INHALE" ? "Breathe In" : breathPhase === "HOLD" ? "Hold Breath" : "Release Gently"}
                  </span>
                  <span className="text-3xl font-black text-teal-500 font-mono mt-0.5">
                    {phaseSeconds}s
                  </span>
                </motion.div>
              </div>

              {/* Subtle Guide Text */}
              <p className="text-xs opacity-70 max-w-sm">
                Follow the sphere rhythm. Inhale deeply through your nose, hold gently at top, and slowly exhale through relaxed lips.
              </p>
            </div>
          </div>

          {/* Right: Ambient Acoustic Soundscape Studio (5 cols) */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Acoustic Sanctuary Mixer
                </span>
                <Volume2 className="w-4 h-4 text-teal-500" />
              </div>

              {/* Sound Faders */}
              <div className="space-y-3.5 text-xs">
                {[
                  { key: "rain", label: "Pacific Coastal Rain", icon: CloudRain },
                  { key: "bowls", label: "Tibetan Singing Bowls", icon: Music },
                  { key: "fire", label: "Cedar Wood Fireplace", icon: Flame },
                  { key: "solfeggio", label: "432 Hz Solfeggio Harmony", icon: Sparkles },
                ].map((item) => {
                  const val = soundVolumes[item.key as keyof typeof soundVolumes];
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Icon className="w-3.5 h-3.5 text-teal-500" />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-mono opacity-60">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) =>
                          setSoundVolumes({ ...soundVolumes, [item.key]: parseInt(e.target.value) })
                        }
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Daily Emotional Dialectic */}
              <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--template-border)" }}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">
                  Daily Emotional State Check-In
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Peaceful Grounded", "Open & Curious", "Gentle Reflection", "Overwhelmed"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedMood === m
                          ? "bg-teal-500 text-white shadow-sm"
                          : "border opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        borderColor: selectedMood === m ? undefined : "var(--template-border)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mindful Journal Modal */}
      <AnimatePresence>
        {isJournalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#081214" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-teal-500" />
                  <h3 className="text-sm font-bold">Mindful Reflection Journal</h3>
                </div>
                <button onClick={() => setIsJournalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveJournal} className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border bg-teal-500/5 text-teal-600 dark:text-teal-300 italic" style={{ borderColor: "var(--template-border)" }}>
                  "What emotion or physical sensation is asking for your compassionate attention right now?"
                </div>

                <textarea
                  rows={4}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="Pour your thoughts freely without judgment..."
                  className="w-full p-3 rounded-xl border bg-transparent outline-none resize-none"
                  style={{ borderColor: "var(--template-border)" }}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsJournalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ backgroundColor: "var(--template-primary)" }}
                  >
                    Save to Private Journal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
