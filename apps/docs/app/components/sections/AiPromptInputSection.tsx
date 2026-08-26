"use client";

import React, { useState } from "react";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { AiPromptInput, AttachedFile } from "nexoreui";
import { Sparkles, Bot, Globe, Mic, Send, MessageSquare, Wand2, Paperclip, Code2 } from "lucide-react";

const aiPromptInputPropsData = [
  {
    name: "variant",
    type: '"default" | "glow" | "aurora" | "glass" | "minimal"',
    defaultValue: '"default"',
    description: "Visual container styling with glow halo, Aurora border, or frosted glassmorphism.",
    required: false,
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Overall scale, padding, and font size of the input bar.",
    required: false,
  },
  {
    name: "placeholder",
    type: "string",
    defaultValue: '"Ask anything or describe what you want to build..."',
    description: "Custom placeholder text shown inside the textarea.",
    required: false,
  },
  {
    name: "isLoading",
    type: "boolean",
    defaultValue: "false",
    description: "Toggles the active state (switches submit arrow to a square stop button).",
    required: false,
  },
  {
    name: "isListening",
    type: "boolean",
    defaultValue: "false",
    description: "Activates the microphone pulsing audio waveform state.",
    required: false,
  },
  {
    name: "webSearchEnabled",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the live web search toggle button is highlighted.",
    required: false,
  },
  {
    name: "reasoningEnabled",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the Deep Reasoning / Deep Think mode toggle is active.",
    required: false,
  },
  {
    name: "value",
    type: "string",
    defaultValue: "—",
    description: "Controlled prompt string value.",
    required: false,
  },
  {
    name: "onSubmit",
    type: "(prompt: string, options) => void",
    defaultValue: "—",
    description: "Callback fired when the user submits their prompt (via Enter key or submit button).",
    required: false,
  },
];

export function AiPromptInputSection() {
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [reasoning, setReasoning] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    { id: "1", name: "design_system.pdf", size: "2.4 MB", type: "file" },
  ]);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <section id="ai-prompt-input" className="space-y-10 scroll-mt-20">
      {/* ─── Header ─── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            AI Prompt Input
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            New
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          An ultra-premium prompt input bar for next-generation AI chat, copilot, and agent workflows.
          Features auto-expanding textarea, model selector dropdown, attachment chips, voice recording pulse, and morphing submit controls.
        </p>
      </div>

      {/* ─── Interactive Playground (PropsEditor) ─── */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          Interactive Playground
        </h3>
        <PropsEditor
          component={AiPromptInput}
          componentName="AiPromptInput"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "glow", "aurora", "glass", "minimal"],
              defaultValue: "default",
              description: "Visual container preset with glow halo or frosted backdrop.",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Dimension scale and text size.",
            },
            {
              name: "placeholder",
              type: "text",
              defaultValue: "Ask anything or describe what you want to build...",
              description: "Text input placeholder.",
            },
            {
              name: "isLoading",
              type: "boolean",
              defaultValue: false,
              description: "Toggles generation state (morphs send to stop button).",
            },
            {
              name: "webSearchEnabled",
              type: "boolean",
              defaultValue: true,
              description: "Enables web search pill highlight.",
            },
            {
              name: "reasoningEnabled",
              type: "boolean",
              defaultValue: false,
              description: "Enables Deep Think pill highlight.",
            },
          ]}
        />
      </div>

      {/* ─── API Reference (Props Table) ─── */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            API Reference
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Complete list of properties and callbacks available for <code className="text-primary font-mono text-xs">AiPromptInput</code>.
          </p>
        </div>
        <PropsTable propsData={aiPromptInputPropsData} />
      </div>

      {/* ─── Real-World Examples (1 Page, 2 Best Examples) ─── */}
      <div className="space-y-6 pt-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Real-World Examples
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Production-ready implementation patterns for modern AI applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Example 1: Full-featured Multimodal AI Agent Bar */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                Multimodal Copilot Bar
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Full-featured agent bar with file attachments, search toggle, and voice recorder.
              </p>
            </div>

            <div className="py-4">
              <AiPromptInput
                variant="glow"
                size="md"
                value={promptText}
                onChange={setPromptText}
                onSubmit={handleSubmit}
                isLoading={isGenerating}
                onStop={() => setIsGenerating(false)}
                files={attachedFiles}
                onRemoveFile={(id) => setAttachedFiles((f) => f.filter((x) => x.id !== id))}
                webSearchEnabled={webSearch}
                onWebSearchToggle={() => setWebSearch(!webSearch)}
                reasoningEnabled={reasoning}
                onReasoningToggle={() => setReasoning(!reasoning)}
                isListening={isMicOn}
                onVoiceToggle={() => setIsMicOn(!isMicOn)}
                onAttachClick={() =>
                  setAttachedFiles((prev) => [
                    ...prev,
                    { id: Date.now().toString(), name: "screenshot.png", size: "480 KB", type: "image" },
                  ])
                }
              />
            </div>

            <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto max-h-36">
                <code>{`import { AiPromptInput } from "nexoreui";

export default function AgentChat() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AiPromptInput
      variant="glow"
      value={text}
      onChange={setText}
      onSubmit={(prompt) => console.log(prompt)}
      isLoading={loading}
      webSearchEnabled
      onWebSearchToggle={() => {}}
      onAttachClick={() => {}}
      onVoiceToggle={() => {}}
    />
  );
}`}</code>
              </pre>
            </div>
          </div>

          {/* Example 2: Minimalist Aurora AI Command Bar */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                Floating Aurora Prompt Bar
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Compact glowing prompt field tailored for centered landing hero sections and command hubs.
              </p>
            </div>

            <div className="py-4">
              <AiPromptInput
                variant="aurora"
                size="lg"
                placeholder="What would you like to build with AI today?"
                onSubmit={(p) => alert(`Submitted: ${p}`)}
                onAttachClick={() => {}}
                onVoiceToggle={() => {}}
              />
            </div>

            <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto max-h-36">
                <code>{`import { AiPromptInput } from "nexoreui";

export default function HeroPrompt() {
  return (
    <AiPromptInput
      variant="aurora"
      size="lg"
      placeholder="What would you like to build with AI today?"
      onSubmit={(prompt) => console.log(prompt)}
      onAttachClick={() => {}}
      onVoiceToggle={() => {}}
    />
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AiPromptInputSection;
