export const templateAgentWorkflow = {
  name: "template-agent-workflow",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-agent-workflow.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Play, Zap, Database, Cpu, Send, CheckCircle2 } from "lucide-react";

export default function AgentWorkflowTemplate() {
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setLog("Trigger received. Querying vector database...");
    setTimeout(() => {
      setLog("Claude 3.5 Sonnet generated solution. Dispatching webhook...");
      setTimeout(() => {
        setIsRunning(false);
        setLog("✓ Execution completed in 680ms. Payload delivered.");
      }, 700);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-bold text-base">Nexus Nodes Canvas</span>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-2 shadow-md"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{isRunning ? "Running..." : "Test Workflow"}</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { name: "Webhook Ingress", icon: Zap, color: "text-amber-400" },
            { name: "Pinecone Retrieval", icon: Database, color: "text-cyan-400" },
            { name: "Claude 3.5 Reasoning", icon: Cpu, color: "text-blue-400" },
            { name: "Slack Dispatcher", icon: Send, color: "text-emerald-400" },
          ].map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.name} className="p-4 rounded-2xl border border-white/10 bg-[#12141c] space-y-2 text-xs">
                <Icon className={\`h-4 w-4 \${n.color}\`} />
                <div className="font-bold">{n.name}</div>
              </div>
            );
          })}
        </div>

        {log && (
          <div className="p-4 rounded-xl border border-white/10 bg-[#06070a] font-mono text-xs text-blue-400">
            {log}
          </div>
        )}
      </main>
    </div>
  );
}
`,
};
