export const templateGamifiedHabits = {
  name: "template-gamified-habits",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-gamified-habits.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Shield, Sword, Sparkles, Coins, Flame, CheckCircle2 } from "lucide-react";

export default function GamifiedHabitsTemplate() {
  const [xp, setXp] = useState(2450);
  const [gold, setGold] = useState(1420);
  const [quests, setQuests] = useState([
    { id: 1, title: "Slay 90m Deep Focus Work Block", xp: 180, done: false },
    { id: 2, title: "Drink 2.5L Water Elixir", xp: 60, done: true },
  ]);

  const toggle = (id: number, questXp: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && !q.done) {
          setXp((x) => x + questXp);
          setGold((g) => g + 40);
          return { ...q, done: true };
        }
        return q;
      })
    );
  };

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-base">QuestCraft RPG</span>
        </div>
        <div className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
          <Coins className="w-3.5 h-3.5" />
          <span>{gold} Gold</span>
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="font-extrabold text-base mb-1">Level 14 Paladin • {xp} / 3,000 XP</h2>
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: \`\${(xp / 3000) * 100}%\` }} />
          </div>
        </div>
      </main>
    </div>
  );
}`,
};
