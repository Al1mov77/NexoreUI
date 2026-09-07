export const templateAiStartup = {
  name: "template-ai-startup",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ai-startup.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Zap,
  Shield,
  Check,
  ChevronRight,
  Send,
  Terminal,
  Activity,
} from "lucide-react";

export default function AiStartupTemplate() {
  const [selectedModel, setSelectedModel] = useState<"DeepSeek-R1" | "Claude-3.5" | "GPT-4o">("DeepSeek-R1");
  const [promptText, setPromptText] = useState("Synthesize an edge-routed vector indexing service");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(
    "✓ Tensor graph compiled. 4 regions provisioned. TTFT: 14ms. Throughput: 142 tok/s."
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGeneratedOutput(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(
        \`✓ [\${selectedModel}] execution complete. 2,140 tokens streamed with zero-copy serialization. Latency: 1.1ms.\`
      );
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10 bg-[#08090d]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Synthetix AI</span>
          </div>
          <button className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
            Get API Key
          </button>
        </div>
      </header>

      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-6">
          <Cpu className="h-3 w-3" />
          <span>Next-Gen Autonomous Inference Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
          Zero Latency. Real Autonomous Intelligence.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-10">
          Stream deep reasoning tokens directly to edge clients. Synthesize complex backend architectures,
          fine-tune proprietary weights, and run microsecond telemetry without cold starts.
        </p>

        <form
          onSubmit={handleSynthesize}
          className="max-w-2xl mx-auto p-2 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col sm:flex-row gap-2 shadow-2xl"
        >
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shrink-0"
          >
            {isGenerating ? "Synthesizing..." : "Execute"}
          </button>
        </form>

        <AnimatePresence>
          {generatedOutput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs font-mono text-indigo-300 max-w-2xl mx-auto text-left"
            >
              {generatedOutput}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
`,
};
