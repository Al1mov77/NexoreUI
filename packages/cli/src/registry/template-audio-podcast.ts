export const templateAudioPodcast = {
  name: "template-audio-podcast",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-audio-podcast.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Headphones, Play, Pause, RotateCcw, RotateCw, Download } from "lucide-react";

export default function AudioPodcastTemplate() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(255); // 04:15

  const chapters = [
    { time: "00:00", title: "Cold Open & Benchmarks" },
    { time: "04:15", title: "Lockless Ring Buffers vs Channels" },
    { time: "18:40", title: "Kernel-Bypass Networking with io_uring" },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 pb-24">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-indigo-400" />
          <span className="font-bold text-base">EchoWave Studio</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs hover:bg-white/10">
          Subscribe RSS
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-10 space-y-6">
        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141c] space-y-3">
          <span className="text-xs font-mono text-indigo-400">Episode 148 • 54m 20s</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Zero-Cost Abstractions & High-Throughput I/O</h1>
          <p className="text-xs text-zinc-400">Featuring Linus M. Discussing memory barriers and lock-free concurrency queues.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Chapters</h2>
          {chapters.map((ch) => (
            <div key={ch.time} className="p-3.5 rounded-xl border border-white/10 bg-[#12141c] flex items-center justify-between text-xs">
              <span>{ch.title}</span>
              <span className="font-mono text-indigo-400">{ch.time}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 p-4 border-t border-white/10 bg-[#08090d]/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </button>
          <span className="text-xs font-mono text-zinc-400">04:15 / 54:20</span>
        </div>
      </footer>
    </div>
  );
}
`,
};
