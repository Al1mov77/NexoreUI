"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Heart,
  Flame,
  Moon,
  Trophy,
  Zap,
  Timer,
  TrendingUp,
  Dumbbell,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Calendar,
  ChevronRight,
  Plus,
  BarChart2,
  Sliders,
  Check,
  X,
  Footprints,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function FitnessAthleticsPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [targetBpm, setTargetBpm] = useState(158);
  const [volumeMetric, setVolumeMetric] = useState<"distance" | "tonnage" | "duration">("distance");
  const [activeTab, setActiveTab] = useState<"dashboard" | "intervals" | "records">("dashboard");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logWorkoutType, setLogWorkoutType] = useState("tempo-run");
  const [logToast, setLogToast] = useState<string | null>(null);

  // Interval checklist state
  const [completedIntervals, setCompletedIntervals] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  // Rest timer
  const [restSeconds, setRestSeconds] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Determine HR zone from BPM
  const getHrZone = (bpm: number) => {
    if (bpm < 120) return { zone: 1, name: "Recovery", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", pct: 15 };
    if (bpm < 140) return { zone: 2, name: "Aerobic Base", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", pct: 40 };
    if (bpm < 160) return { zone: 3, name: "Tempo Pace", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", pct: 70 };
    if (bpm < 175) return { zone: 4, name: "Threshold", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", pct: 85 };
    return { zone: 5, name: "VO2 Max Anaerobic", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", pct: 98 };
  };

  const currentZone = getHrZone(targetBpm);

  const weeklyVolumeData = {
    distance: [
      { day: "Mon", val: 12.4, target: 10 },
      { day: "Tue", val: 8.0, target: 8 },
      { day: "Wed", val: 15.2, target: 14 },
      { day: "Thu", val: 0.0, target: 0 },
      { day: "Fri", val: 10.5, target: 10 },
      { day: "Sat", val: 24.8, target: 22 },
      { day: "Sun", val: 6.2, target: 8 },
    ],
    tonnage: [
      { day: "Mon", val: 8400, target: 8000 },
      { day: "Tue", val: 0, target: 0 },
      { day: "Wed", val: 11200, target: 10000 },
      { day: "Thu", val: 6500, target: 6000 },
      { day: "Fri", val: 9800, target: 9000 },
      { day: "Sat", val: 0, target: 0 },
      { day: "Sun", val: 4200, target: 5000 },
    ],
    duration: [
      { day: "Mon", val: 65, target: 60 },
      { day: "Tue", val: 45, target: 45 },
      { day: "Wed", val: 90, target: 80 },
      { day: "Thu", val: 30, target: 30 },
      { day: "Fri", val: 75, target: 70 },
      { day: "Sat", val: 140, target: 120 },
      { day: "Sun", val: 40, target: 45 },
    ],
  };

  const intervals = [
    { title: "Dynamic Warm-up & Hip Mobility", target: "10 min • Zone 1", rpe: "RPE 4", tag: "Warmup" },
    { title: "Progressive Aerobic Build", target: "15 min @ 138-145 BPM", rpe: "RPE 6", tag: "Zone 2" },
    { title: "4 x 1,000m Lactate Threshold Repeats", target: "4 reps @ 3:42/km (90s rest)", rpe: "RPE 8.5", tag: "Threshold" },
    { title: "VO2 Max Surge Finishers", target: "3 x 400m all-out", rpe: "RPE 9.5", tag: "Zone 5" },
    { title: "Parasympathetic Recovery Cool-down", target: "10 min walk & deep breathing", rpe: "RPE 2", tag: "Recovery" },
  ];

  const personalRecords = [
    { event: "5,000m Track Split", record: "16:48.2", delta: "-14.6s", date: "Last week", icon: Footprints, badge: "Recent PR" },
    { event: "VO2 Max Score", record: "58.4 ml/kg", delta: "+2.1", date: "Lab tested", icon: Activity, badge: "Elite 2%" },
    { event: "Cycling 20m FTP", record: "318 Watts", delta: "+14W", date: "Sep 2026", icon: Zap, badge: "All-Time" },
    { event: "Squat 1RM Load", record: "185 kg", delta: "+7.5 kg", date: "Aug 2026", icon: Dumbbell, badge: "Gold" },
  ];

  const toggleInterval = (index: number) => {
    setCompletedIntervals((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogModalOpen(false);
    setLogToast("Workout logged! Biometric strain recomputed (+3.2 Strain).");
    setTimeout(() => setLogToast(null), 3500);
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
              <TemplateLogo icon={config.logoIcon || "activity"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "AeroPulse Athletics"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Ready to Train
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Cardiovascular Telemetry & Overload Suite</p>
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
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Resting HR: 48 bpm</span>
              <span className="opacity-30">•</span>
              <span className="text-emerald-500">HRV: 74ms</span>
            </div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {logToast && (
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
            <span>{logToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--template-border)" }}>
          <div className="flex items-center gap-1.5 p-1 rounded-xl border text-xs font-medium" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "dashboard" ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold" : "opacity-70 hover:opacity-100"}`}
            >
              Telemetry Dashboard
            </button>
            <button
              onClick={() => setActiveTab("intervals")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "intervals" ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold" : "opacity-70 hover:opacity-100"}`}
            >
              Today's Intervals
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "records" ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold" : "opacity-70 hover:opacity-100"}`}
            >
              PR Hall of Fame
            </button>
          </div>

          <div className="hidden @sm:flex items-center gap-2 text-xs opacity-75">
            <Calendar className="w-3.5 h-3.5" />
            <span>Microcycle 14 • Day 4</span>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
          {/* Recovery Score */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Recovery Readiness</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                88% High
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">88%</span>
              <span className="text-xs text-emerald-500 font-medium">Primed for strain</span>
            </div>
            <p className="text-[11px] opacity-65">HRV baseline +11% above rolling 30-day average.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>

          {/* Daily Strain */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Day Strain Score</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">14.8</span>
              <span className="text-xs opacity-60">/ 21.0 Max</span>
            </div>
            <p className="text-[11px] opacity-65">Target range 14.0 - 17.5 for optimal adaptation.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full w-[70%]" />
            </div>
          </div>

          {/* Active Calorie Burn */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Active Metabolic Burn</span>
              <Activity className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">1,340</span>
              <span className="text-xs opacity-60">kcal</span>
            </div>
            <p className="text-[11px] opacity-65">89% of daily 1,500 kcal exertion target.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-[89%]" />
            </div>
          </div>

          {/* Sleep & Rest */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Sleep Architecture</span>
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">8h 12m</span>
              <span className="text-xs text-indigo-400 font-medium">94% Need met</span>
            </div>
            <p className="text-[11px] opacity-65">1h 48m Deep REM • 2 wake disturbances.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[94%]" />
            </div>
          </div>
        </div>

        {/* Dynamic HR Zone Spectrum Simulator & Weekly Volume */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Heart Rate Spectrum Interactive Tool */}
          <div
            className="@lg:col-span-1 p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Cardio Zone Spectrum</h3>
                  <p className="text-xs opacity-65">Adjust target BPM to test physiological zones</p>
                </div>
                <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${currentZone.bg} ${currentZone.color} ${currentZone.border}`}>
                  Zone {currentZone.zone}
                </div>
              </div>

              {/* Big BPM Display */}
              <div className="p-4 rounded-xl border text-center mb-6" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--template-primary)" }}>
                  {targetBpm} <span className="text-sm font-normal opacity-70">BPM</span>
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${currentZone.color}`}>
                  {currentZone.name}
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-mono opacity-70">
                  <span>100 BPM</span>
                  <span>195 BPM Max</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="195"
                  value={targetBpm}
                  onChange={(e) => setTargetBpm(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Zone distribution meters */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z1 Recovery (&lt;120)</span>
                  <span className="font-mono font-medium">35 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z2 Aerobic Base (120-140)</span>
                  <span className="font-mono font-semibold text-emerald-500">54 min (Primary)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z3 Tempo (140-160)</span>
                  <span className="font-mono font-medium">20 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z4 Threshold (160-175)</span>
                  <span className="font-mono font-medium">15 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z5 Anaerobic (175+)</span>
                  <span className="font-mono font-medium">4 min</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t text-[11px] opacity-60 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Lactate Threshold: 168 BPM</span>
              <span>Aerobic Decoupling: 2.1%</span>
            </div>
          </div>

          {/* Weekly Training Volume & Overload Bar Chart */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Weekly Progressive Overload</h3>
                  <p className="text-xs opacity-65">Total microcycle accumulation vs scheduled stimulus</p>
                </div>
                {/* Metric toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl border text-xs font-medium self-start" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "var(--template-border)" }}>
                  <button
                    onClick={() => setVolumeMetric("distance")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${volumeMetric === "distance" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}`}
                  >
                    Distance (km)
                  </button>
                  <button
                    onClick={() => setVolumeMetric("tonnage")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${volumeMetric === "tonnage" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}`}
                  >
                    Tonnage (kg)
                  </button>
                  <button
                    onClick={() => setVolumeMetric("duration")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${volumeMetric === "duration" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}`}
                  >
                    Duration (m)
                  </button>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-52 flex items-end justify-between gap-2 @sm:gap-4 pt-6 pb-2 px-2 border-b" style={{ borderColor: "var(--template-border)" }}>
                {weeklyVolumeData[volumeMetric].map((item, idx) => {
                  const maxVal = Math.max(...weeklyVolumeData[volumeMetric].map((d) => d.val), 1);
                  const heightPct = Math.max((item.val / maxVal) * 100, 6);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.val}
                      </div>
                      <div className="w-full max-w-[40px] bg-zinc-200 dark:bg-zinc-800 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: `${heightPct}%` }}>
                        <div
                          className="w-full rounded-t-lg transition-all"
                          style={{
                            height: "100%",
                            backgroundColor: item.val >= item.target && item.val > 0 ? "var(--template-primary)" : "#a855f7",
                            opacity: item.val === 0 ? 0.2 : 0.9,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold opacity-75">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--template-primary)" }} />
                  Completed Stimulus
                </span>
                <span className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Target Baseline
                </span>
              </div>
              <div className="font-mono text-emerald-500 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.4% Volume Progression vs W13</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Intervals Checklist & Rest Timer */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Today's Workout Intervals Checklist */}
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
                <h3 className="text-base font-bold tracking-tight">Prescribed Interval Session</h3>
                <p className="text-xs opacity-65">Lactate Threshold Overload • 5 Blocks</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg border" style={{ borderColor: "var(--template-border)" }}>
                {Object.values(completedIntervals).filter(Boolean).length} / {intervals.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {intervals.map((item, idx) => {
                const isCompleted = !!completedIntervals[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleInterval(idx)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isCompleted ? "opacity-60 bg-emerald-500/5 border-emerald-500/20" : "hover:border-indigo-500/40"
                    }`}
                    style={{
                      backgroundColor: !isCompleted ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : undefined,
                      borderColor: !isCompleted ? "var(--template-border)" : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-indigo-500 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 opacity-40 hover:opacity-80" />
                        )}
                      </button>
                      <div>
                        <div className={`text-xs font-bold ${isCompleted ? "line-through opacity-75" : ""}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] opacity-60 font-mono mt-0.5">{item.target}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border" style={{ borderColor: "var(--template-border)" }}>
                        {item.rpe}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rest Interval Timer */}
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
                <h3 className="text-base font-bold tracking-tight">Active Rest Timer</h3>
                <Timer className="w-4 h-4 text-indigo-400" />
              </div>

              {/* Timer Dial */}
              <div className="py-6 text-center">
                <div className="text-5xl font-mono font-extrabold tracking-tight mb-2">
                  01:{restSeconds < 10 ? `0${restSeconds}` : restSeconds}
                </div>
                <p className="text-xs opacity-65">Recovery interval between Threshold splits</p>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-mono">
                {[60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setRestSeconds(sec)}
                    className={`py-1.5 rounded-lg border text-center transition-colors ${
                      restSeconds === sec ? "border-indigo-500 bg-indigo-500/10 font-bold" : "opacity-75 hover:opacity-100"
                    }`}
                    style={{ borderColor: restSeconds === sec ? undefined : "var(--template-border)" }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: "var(--template-primary)" }}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isTimerRunning ? "Pause Rest" : "Start 90s Rest"}</span>
              </button>
              <button
                onClick={() => setRestSeconds(90)}
                className="p-2.5 rounded-xl border text-xs opacity-75 hover:opacity-100"
                style={{ borderColor: "var(--template-border)" }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PR Milestone Hall of Fame */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold tracking-tight">Hall of Fame & All-Time PRs</h3>
            </div>
            <span className="text-xs opacity-65">Verified Telemetry Benchmarks</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
            {personalRecords.map((pr, idx) => {
              const Icon = pr.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {pr.badge}
                    </span>
                    <Icon className="w-4 h-4 opacity-50" />
                  </div>
                  <div className="text-xs opacity-70 mb-1">{pr.event}</div>
                  <div className="text-xl font-extrabold tracking-tight mb-1">{pr.record}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-500 font-semibold">{pr.delta}</span>
                    <span className="opacity-50">{pr.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Log Workout Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
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
                onClick={() => setIsLogModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Log Completed Session</h3>
              </div>

              <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Activity Modality</label>
                  <select
                    value={logWorkoutType}
                    onChange={(e) => setLogWorkoutType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  >
                    <option value="tempo-run">Tempo Threshold Run</option>
                    <option value="cycling-ftp">FTP Cycling Intervals</option>
                    <option value="heavy-squat">Strength & Power Hypertrophy</option>
                    <option value="hiit-row">HIIT Aerobic Capacity</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Duration (Minutes)</label>
                    <input
                      type="number"
                      defaultValue="55"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Average Heart Rate</label>
                    <input
                      type="number"
                      defaultValue="152"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">Perceived Exertion (RPE 1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="8"
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between opacity-60 text-[10px] mt-1">
                    <span>1 Easy Active</span>
                    <span>10 Maximum Exhaustion</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm mt-2 transition-transform active:scale-95"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Confirm & Sync Biometrics
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
