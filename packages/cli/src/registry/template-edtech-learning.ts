export const templateEdtechLearning = {
  name: "template-edtech-learning",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-edtech-learning.tsx",
  content: `"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, Code2, Award, Flame, Play } from "lucide-react";

export default function EdtechLearningTemplate() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(1);
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans p-6 sm:p-8">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <span className="font-bold text-base">Polymath Academy</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
          <Flame className="h-3.5 w-3.5 fill-current" />
          <span>14 Day Streak</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-[#12141c] space-y-4">
          <div className="text-xs font-mono text-zinc-400">Module 2 • Lesson 2.2</div>
          <h1 className="text-2xl font-bold">Raft Consensus & Majority Quorums</h1>
          <p className="text-xs text-zinc-300 leading-relaxed">
            In Raft, a cluster of 5 nodes requires an affirmative vote from at least 3 nodes before committing any state machine transition.
          </p>

          <div className="space-y-2 pt-2">
            {[
              "Any follower can commit independently without Leader confirmation.",
              "A quorum majority (3 of 5 nodes) ensures overlapping sets and prevents split-brain.",
              "Logs are replicated only during leader step-down events.",
            ].map((ans, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={\`w-full p-3.5 rounded-xl border text-left text-xs transition-colors \${
                  selectedIdx === i
                    ? "border-emerald-500 bg-emerald-500/10 text-white font-semibold"
                    : "border-white/10 bg-[#181a24] text-zinc-300"
                }\`}
              >
                {ans}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsDone(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-2 mt-4"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isDone ? "Solution Verified ✓ (+150 XP)" : "Verify Solution"}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
`,
};
