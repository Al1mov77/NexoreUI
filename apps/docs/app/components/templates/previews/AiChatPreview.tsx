"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  Cpu,
  Terminal,
  Paperclip,
  Globe,
  CornerDownLeft,
  ChevronRight,
  Menu,
  X,
  BrainCircuit,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AiChatPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [activeModel, setActiveModel] = useState<"Cortex Reasoning R1" | "Cortex Fast 4o" | "Vision Pro">("Cortex Reasoning R1");
  const [inputText, setInputText] = useState("");
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "user",
      content: "Write an edge-safe cache key generator in TypeScript with SHA-256 cryptographic fingerprinting.",
    },
    {
      role: "assistant",
      thought: "Using the Web Crypto API crypto.subtle.digest to guarantee edge runtime compatibility without Node.js crypto dependencies.",
      content: `export async function createEdgeCacheKey(
  pathname: string,
  params: Record<string, string>
): Promise<string> {
  const normalizedParams = Object.keys(params)
    .sort()
    .map((k) => \`\${k}=\${encodeURIComponent(params[k])}\`)
    .join("&");
  const rawKey = \`\${pathname}?\${normalizedParams}\`;
  
  const msgBuffer = new TextEncoder().encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}`,
    },
  ]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg },
      {
        role: "assistant",
        thought: "Analyzing request against edge vector index and generating structured response...",
        content: `Acknowledged: "${userMsg}". Edge telemetry active. Generated response stream in 1.4ms.`,
      },
    ]);
    setInputText("");
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors flex flex-col @md:flex-row font-sans"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Mobile Top Navigation Header */}
      <header
        className="@md:hidden flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{
          backgroundColor: "var(--template-surface)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg border text-xs"
            style={{ borderColor: "var(--template-border)", color: "var(--template-fg)" }}
            aria-label="Toggle threads drawer"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
          >
            <TemplateLogo icon={config.logoIcon || "sparkles"} className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "var(--template-heading-font)" }}>
            {config.brandName || "Cortex AI"}
          </span>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setInputText("");
          }}
          className="p-2 rounded-lg border text-xs flex items-center gap-1.5"
          style={{ borderColor: "var(--template-border)" }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </button>
      </header>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="@md:hidden border-b p-4 space-y-3 text-sm overflow-hidden"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
            }}
          >
            <p className="text-xs font-mono uppercase tracking-wider opacity-60">Recent Threads</p>
            <div className="space-y-1.5">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-white text-left truncate"
                style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Edge Cache Key Generator</span>
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 text-left truncate"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Postgres Vector Indexing</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sessions Sidebar */}
      <aside
        className="hidden @md:flex w-64 border-r p-5 shrink-0 flex-col justify-between transition-colors text-sm"
        style={{
          backgroundColor: "var(--template-surface)",
          borderColor: "var(--template-border)",
        }}
      >
        <div>
          {/* Header */}
          <div
            className="flex items-center justify-between pb-3.5 mb-4 border-b"
            style={{ borderColor: "var(--template-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
              >
                <TemplateLogo icon={config.logoIcon || "sparkles"} className="h-4 w-4" />
              </div>
              <span
                className="font-bold text-sm tracking-tight truncate"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Cortex AI"}
              </span>
            </div>

            <button
              onClick={() => {
                setMessages([]);
                setInputText("");
              }}
              title="New Chat"
              className="p-2 rounded-lg border hover:opacity-80 transition-opacity"
              style={{ borderColor: "var(--template-border)", borderRadius: "var(--template-radius)" }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Session History */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider opacity-60">Recent Threads</p>
            <div className="space-y-1.5">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-white text-left truncate shadow-sm"
                style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Edge Cache Key Generator</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-75 hover:opacity-100 text-left truncate transition-opacity">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Postgres Vector Indexing</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-75 hover:opacity-100 text-left truncate transition-opacity">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Rust WebSocket Gateway</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t text-xs font-mono opacity-70" style={{ borderColor: "var(--template-border)" }}>
          <span>1,420 / 10,000 Monthly Credits</span>
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col justify-between min-h-[600px] overflow-hidden min-w-0">
        {/* Model Bar */}
        <div
          className="px-4 @sm:px-6 py-3 border-b flex items-center justify-between text-xs @sm:text-sm transition-colors shrink-0"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60 uppercase font-mono">Model:</span>
            <span className="font-semibold" style={{ color: "var(--template-primary)" }}>
              {activeModel}
            </span>
          </div>

          <span className="text-xs font-mono text-emerald-500 font-medium">● Connected</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 @sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              {msg.role === "user" ? (
                <div
                  className="max-w-xl p-4 rounded-2xl text-xs @sm:text-sm font-medium text-white shadow-sm"
                  style={{
                    backgroundColor: "var(--template-primary)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  {msg.content}
                </div>
              ) : (
                <div
                  className="w-full max-w-3xl p-4 @sm:p-6 rounded-2xl border text-xs @sm:text-sm space-y-3.5 transition-all"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                    borderRadius: "var(--template-radius)",
                    boxShadow: "var(--template-card-shadow)",
                  }}
                >
                  {/* Thought process indicator */}
                  {msg.thought && (
                    <div
                      className="p-3.5 rounded-xl border text-xs @sm:text-sm leading-relaxed transition-all"
                      style={{
                        backgroundColor: "var(--template-surface-muted)",
                        borderColor: "var(--template-border)",
                        color: "var(--template-fg-muted)",
                        borderRadius: "var(--template-radius)",
                      }}
                    >
                      <button
                        onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                        className="w-full flex items-center justify-between font-medium mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <BrainCircuit className="h-4 w-4" style={{ color: "var(--template-primary)" }} />
                          <span style={{ color: "var(--template-fg)" }}>Reasoning Trace</span>
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isThinkingOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isThinkingOpen && (
                        <p className="pt-1.5 opacity-90">{msg.thought}</p>
                      )}
                    </div>
                  )}

                  {/* Code snippet block */}
                  <div
                    className="rounded-xl border font-mono text-xs @sm:text-sm overflow-hidden"
                    style={{
                      backgroundColor: isDark ? "#08090d" : "#11131a",
                      borderColor: "var(--template-border)",
                      color: "#fafafa",
                      borderRadius: "var(--template-radius)",
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10 text-xs">
                      <span className="text-zinc-400">TypeScript (Edge Runtime)</span>
                      <button
                        onClick={() => handleCopyCode(msg.content)}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-zinc-200 text-xs @sm:text-sm leading-relaxed">
                      <code>{msg.content}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className="p-3 @sm:p-5 border-t transition-colors shrink-0"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
          }}
        >
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2.5 p-2 rounded-xl border transition-all focus-within:ring-1"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <button
              type="button"
              className="p-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity shrink-0"
              aria-label="Attach File"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a technical or architectural question..."
              className="flex-1 bg-transparent text-xs @sm:text-sm focus:outline-none min-w-0"
              style={{ color: "var(--template-fg)" }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-lg text-white transition-all disabled:opacity-40 hover:brightness-110 shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "calc(var(--template-radius) - 2px)",
              }}
              aria-label="Send prompt"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
