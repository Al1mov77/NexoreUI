export const templateAudioDaw = {
  name: "template-audio-daw",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-audio-daw.tsx",
  content: `"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Disc, Sliders, Volume2, ShoppingBag } from "lucide-react";

export default function AudioDawTemplate() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(140);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => setStep((s) => (s + 1) % 16), (60 / bpm / 4) * 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

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
          <Disc className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-base">SoundForge Studio</span>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 flex items-center gap-1.5">
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Pause" : "Play Groove"}</span>
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">16-Step Beat Grid ({bpm} BPM)</h3>
            <span className="font-mono text-xs opacity-60">Step {step + 1} / 16</span>
          </div>
          <div className="grid grid-cols-16 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={\`h-10 rounded border \${step === i && isPlaying ? "bg-purple-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}\`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`,
};
