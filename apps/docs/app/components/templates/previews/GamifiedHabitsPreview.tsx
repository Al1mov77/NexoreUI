"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sword,
  Sparkles,
  Flame,
  Coins,
  Heart,
  Zap,
  BookOpen,
  Dumbbell,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  Award,
  ChevronRight,
  Package,
  X,
  Target,
  Crown,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function GamifiedHabitsPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // RPG states
  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(14);
  const [gold, setGold] = useState(1420);
  const [bossHp, setBossHp] = useState(2450);
  const [isFocusTimerRunning, setIsFocusTimerRunning] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(1500); // 25 min
  const [rpgToast, setRpgToast] = useState<string | null>(null);

  // Quests
  const [quests, setQuests] = useState([
    { id: 1, title: "Slay 90m Deep Focus Work Block", rewardXp: 180, rewardGold: 45, type: "Legendary", stat: "+2 Focus", completed: false },
    { id: 2, title: "Quench Thirst: 2.5L Pure Water Elixir", rewardXp: 60, rewardGold: 15, type: "Daily", stat: "+1 Vitality", completed: true },
    { id: 3, title: "Iron Temple: 45m Strength Hypertrophy", rewardXp: 140, rewardGold: 35, type: "Hard", stat: "+2 Strength", completed: false },
    { id: 4, title: "Grimoire Study: Read 20 Pages of Tech Docs", rewardXp: 90, rewardGold: 20, type: "Medium", stat: "+1 Wisdom", completed: false },
  ]);

  // Inventory Shop
  const [inventory, setInventory] = useState([
    { id: "helm", name: "Crown of Deep Concentration", cost: 350, bonus: "+4 Wisdom & Focus", bought: true },
    { id: "boots", name: "Hermes Agile Swiftboots", cost: 280, bonus: "+3 Task Velocity", bought: false },
    { id: "elixir", name: "Cold Brew Espresso Elixir", cost: 120, bonus: "+20 Energy Stamina", bought: false },
  ]);

  const toggleQuest = (questId: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextCompleted = !q.completed;
          if (nextCompleted) {
            setXp((curr) => {
              const newXp = curr + q.rewardXp;
              if (newXp >= 3000) {
                setLevel((lvl) => lvl + 1);
                return newXp - 3000;
              }
              return newXp;
            });
            setGold((g) => g + q.rewardGold);
            setBossHp((hp) => Math.max(hp - q.rewardXp * 2, 0));
            setRpgToast(`Quest Complete! +${q.rewardXp} XP, +${q.rewardGold} Gold! Boss hit for -${q.rewardXp * 2} HP.`);
            setTimeout(() => setRpgToast(null), 3500);
          }
          return { ...q, completed: nextCompleted };
        }
        return q;
      })
    );
  };

  const buyItem = (itemId: string, cost: number) => {
    if (gold < cost) {
      setRpgToast("Not enough Gold! Complete more daily quests first.");
      setTimeout(() => setRpgToast(null), 3000);
      return;
    }
    setGold((g) => g - cost);
    setInventory((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, bought: true } : it))
    );
    setRpgToast("Item equipped! Attributes permanently boosted.");
    setTimeout(() => setRpgToast(null), 3500);
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
              <TemplateLogo icon={config.logoIcon || "shield"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "QuestCraft RPG"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Level {level} Paladin
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Gamified Productivity & Habit Progression RPG</p>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-400">{gold} G</span>
              <span className="opacity-30">•</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="text-orange-500">21d Streak</span>
            </div>

            <button
              onClick={() => setIsFocusTimerRunning(!isFocusTimerRunning)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{isFocusTimerRunning ? "Pause Focus" : "Start Dungeon"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {rpgToast && (
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
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{rpgToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Character Hero Card & Vitals */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shrink-0 relative"
                style={{
                  backgroundColor: "var(--template-primary)",
                  borderColor: "var(--template-border)",
                }}
              >
                <span>L{level}</span>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-400 text-black">
                  <Crown className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-extrabold tracking-tight">Sir Tristan of Code</h1>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                    Grandmaster Architect
                  </span>
                </div>
                <p className="text-xs opacity-65">Experience Bar: {xp} / 3,000 XP to Level {level + 1}</p>
                <div className="w-64 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${(xp / 3000) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* RPG Attributes Grid */}
            <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Strength</span>
                  <Sword className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-bold font-mono">18 <span className="text-[10px] text-emerald-500">+4</span></div>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Wisdom</span>
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <div className="text-lg font-bold font-mono">24 <span className="text-[10px] text-emerald-500">+6</span></div>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Focus</span>
                  <Target className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold font-mono">22 <span className="text-[10px] text-emerald-500">+8</span></div>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Vitality</span>
                  <Heart className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-lg font-bold font-mono">20 <span className="text-[10px] text-emerald-500">+3</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Daily Quests & Weekly Raid Boss */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Daily Quest Board */}
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
                <h3 className="text-base font-bold tracking-tight">Active Guild Quests</h3>
                <p className="text-xs opacity-65">Complete tasks to earn XP, gold coins, and damage the raid boss</p>
              </div>
              <span className="text-xs font-mono opacity-70">Reset in 8h 14m</span>
            </div>

            <div className="space-y-3">
              {quests.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleQuest(q.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    q.completed ? "opacity-60 bg-emerald-500/5 border-emerald-500/20" : "hover:border-indigo-500/40"
                  }`}
                  style={{
                    backgroundColor: !q.completed ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : undefined,
                    borderColor: !q.completed ? "var(--template-border)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-indigo-500 shrink-0">
                      {q.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 opacity-40 hover:opacity-80" />
                      )}
                    </button>
                    <div>
                      <div className={`text-xs font-bold ${q.completed ? "line-through opacity-75" : ""}`}>
                        {q.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] opacity-65 font-mono mt-0.5">
                        <span className="text-amber-400 font-bold">+{q.rewardXp} XP</span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">+{q.rewardGold} Gold</span>
                        <span>•</span>
                        <span className="text-emerald-500">{q.stat}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      q.type === "Legendary"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : q.type === "Hard"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {q.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Raid Boss Card */}
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
                  <Shield className="w-4 h-4 text-rose-500" />
                  <h3 className="text-base font-bold tracking-tight">Weekly Raid Boss</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Level 20 Boss
                </span>
              </div>

              {/* Boss Visual */}
              <div className="p-4 rounded-xl border text-center mb-4" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2">
                  <Sword className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold">The Procrastination Behemoth</h4>
                <div className="text-xs font-mono font-bold text-rose-500 mt-1">
                  {bossHp} / 5,000 HP Left
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(bossHp / 5000) * 100}%` }} />
                </div>
              </div>

              <p className="text-xs opacity-65 leading-relaxed text-center">
                Every completed quest directly inflicts 2x XP as raw damage. Defeat by Sunday midnight for 500 bonus Gold!
              </p>
            </div>

            <div className="pt-4 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Party Members: 4 Active</span>
              <span className="text-emerald-500 font-semibold">Victory in Sight</span>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Armory Shop & Dungeon Focus Timer */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Armory & Shop */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold tracking-tight">Armory & Magic Loot Merchant</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">{gold} Gold Available</span>
            </div>

            <div className="grid grid-cols-1 @sm:grid-cols-3 gap-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div>
                    <h4 className="text-xs font-bold mb-1">{item.name}</h4>
                    <p className="text-[11px] text-emerald-500 font-semibold mb-3">{item.bonus}</p>
                  </div>

                  {item.bought ? (
                    <span className="w-full py-1.5 rounded-lg border text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                      Equipped
                    </span>
                  ) : (
                    <button
                      onClick={() => buyItem(item.id, item.cost)}
                      className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white shadow-sm transition-transform active:scale-95"
                      style={{ backgroundColor: "var(--template-primary)" }}
                    >
                      Buy for {item.cost} G
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dungeon Focus Timer */}
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
                <h3 className="text-base font-bold tracking-tight">Dungeon Dive Timer</h3>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="py-4 text-center">
                <div className="text-4xl font-extrabold font-mono mb-1">
                  25:00
                </div>
                <p className="text-xs opacity-65">Floor 4: Catacombs of Flow State</p>
              </div>
            </div>

            <button
              onClick={() => {
                setRpgToast("Entered Dungeon of Deep Focus! 25-minute Pomodoro running.");
                setTimeout(() => setRpgToast(null), 3500);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              Enter Flow Dungeon (+60 XP)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
