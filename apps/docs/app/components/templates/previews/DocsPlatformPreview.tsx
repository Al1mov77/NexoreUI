"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Code2,
  Copy,
  Check,
  Send,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileCode,
  Layers,
  Menu,
  X,
  Play,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function DocsPlatformPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [activeLang, setActiveLang] = useState<"curl" | "node" | "python" | "go">("curl");
  const [activeSection, setActiveSection] = useState("auth");
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const codeSnippets = {
    curl: `curl -X POST https://api.codex.dev/v1/inference \\
  -H "Authorization: Bearer sk_live_849204" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "r1-ultra", "stream": true, "max_tokens": 1024}'`,
    node: `import { Codex } from "@codex/sdk";

const client = new Codex({ apiKey: process.env.CODEX_API_KEY });
const stream = await client.inference.stream({
  model: "r1-ultra",
  maxTokens: 1024,
});`,
    python: `from codex import CodexClient

client = CodexClient(api_key="sk_live_849204")
response = client.inference.stream(
    model="r1-ultra",
    max_tokens=1024
)`,
    go: `package main

import "github.com/codex-dev/sdk-go"

func main() {
    client := codex.NewClient("sk_live_849204")
    // stream tokens with zero heap allocs
}`,
  };

  const handleTestApi = () => {
    setIsSending(true);
    setApiResponse(null);
    setTimeout(() => {
      setIsSending(false);
      setApiResponse(
        JSON.stringify(
          {
            status: "success",
            data: {
              id: "inf_94829104",
              model: "r1-ultra",
              ttft_ms: 3.8,
              tokens_streamed: 840,
              cached: true,
            },
          },
          null,
          2
        )
      );
    }, 600);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Global Docs Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="@lg:hidden p-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
              aria-label="Toggle Docs Navigation"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "terminal"} className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm @sm:text-base tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "Codex Docs"}
            </span>
            <span
              className="hidden @sm:inline text-xs font-mono px-2 py-0.5 rounded border"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg-muted)",
              }}
            >
              v3.2 Edge
            </span>
          </div>

          {/* Search Bar */}
          <div
            className="hidden @sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs @sm:text-sm w-64 @lg:w-80"
            style={{
              borderColor: "var(--template-border)",
              backgroundColor: "var(--template-surface)",
              color: "var(--template-fg-muted)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 truncate">Search guides, SDKs, APIs...</span>
            <kbd
              className="px-1.5 py-0.5 rounded border text-xs font-mono"
              style={{ borderColor: "var(--template-border)" }}
            >
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-xs @sm:text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-sm hover:brightness-110 transition-all shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              API Keys
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="@lg:hidden border-b p-4 space-y-4 text-sm overflow-hidden"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
              }}
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
                  Getting Started
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveSection("overview");
                      setMobileNavOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === "overview" ? "font-bold text-white shadow-sm" : "opacity-80"
                    }`}
                    style={{
                      backgroundColor: activeSection === "overview" ? "var(--template-primary)" : "transparent",
                      borderRadius: "var(--template-radius)",
                    }}
                  >
                    Quickstart & Concepts
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("auth");
                      setMobileNavOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === "auth" ? "font-bold text-white shadow-sm" : "opacity-80"
                    }`}
                    style={{
                      backgroundColor: activeSection === "auth" ? "var(--template-primary)" : "transparent",
                      borderRadius: "var(--template-radius)",
                    }}
                  >
                    Authentication & Keys
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
                  Core API Reference
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full text-left px-3 py-1.5 rounded opacity-80 hover:opacity-100"
                  >
                    POST /v1/inference
                  </button>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full text-left px-3 py-1.5 rounded opacity-80 hover:opacity-100"
                  >
                    GET /v1/models
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3-Column Docs Layout (Desktop) / Reflowed (Mobile & Tablet) */}
      <div className="w-full max-w-7xl mx-auto flex flex-col @lg:flex-row">
        {/* Left Column: Navigation Sidebar (Desktop) */}
        <aside
          className="hidden @lg:block w-64 border-r p-5 shrink-0 text-sm space-y-6"
          style={{
            borderColor: "var(--template-border)",
            backgroundColor: "var(--template-surface)",
          }}
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-3">
              Getting Started
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === "overview" ? "font-semibold text-white shadow-sm" : "opacity-75 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: activeSection === "overview" ? "var(--template-primary)" : "transparent",
                  color: activeSection === "overview" ? "#ffffff" : "var(--template-fg)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                Quickstart & Concepts
              </button>
              <button
                onClick={() => setActiveSection("auth")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === "auth" ? "font-semibold text-white shadow-sm" : "opacity-75 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: activeSection === "auth" ? "var(--template-primary)" : "transparent",
                  color: activeSection === "auth" ? "#ffffff" : "var(--template-fg)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                Authentication & Keys
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg opacity-70 hover:opacity-100 transition-colors">
                Rate Limits & Quotas
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-3">
              Core API Reference
            </p>
            <div className="space-y-1.5 font-mono text-xs">
              <button className="w-full text-left px-3 py-1.5 rounded-lg opacity-75 hover:opacity-100 transition-colors">
                POST /v1/inference
              </button>
              <button className="w-full text-left px-3 py-1.5 rounded-lg opacity-75 hover:opacity-100 transition-colors">
                GET /v1/models
              </button>
              <button className="w-full text-left px-3 py-1.5 rounded-lg opacity-75 hover:opacity-100 transition-colors">
                POST /v1/embeddings
              </button>
            </div>
          </div>
        </aside>

        {/* Center Column: Documentation Content */}
        <main className="flex-1 p-5 @sm:p-8 max-w-3xl min-w-0">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono mb-2" style={{ color: "var(--template-fg-muted)" }}>
              <span>Docs</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Authentication</span>
            </div>

            <h1
              className="text-2xl @sm:text-3xl @lg:text-4xl font-bold tracking-tight mb-3"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              Authentication & API Security
            </h1>

            <p className="text-sm @sm:text-base leading-relaxed mb-6" style={{ color: "var(--template-fg-muted)" }}>
              All requests to the Codex API must authenticate using Bearer tokens in the HTTP Authorization header.
              Your secret keys grant complete administrative access to your cluster quota.
            </p>

            {/* Note Callout */}
            <div
              className="p-4 @sm:p-5 rounded-xl border flex items-start gap-3.5 text-xs @sm:text-sm leading-relaxed mb-8 transition-all"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--template-primary)" }} />
              <div>
                <span className="font-semibold" style={{ color: "var(--template-fg)" }}>
                  Security Best Practice:
                </span>{" "}
                Never expose production keys in client-side code or public Git repositories.
                Always access Codex endpoints through server-side environment variables.
              </div>
            </div>

            {/* Multi-Language Code Snippet */}
            <div
              className="rounded-2xl border shadow-lg overflow-hidden font-mono text-xs @sm:text-sm mb-8"
              style={{
                backgroundColor: isDark ? "#08090d" : "#11131a",
                borderColor: "var(--template-border)",
                color: "#fafafa",
                borderRadius: "var(--template-radius)",
              }}
            >
              {/* Language Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2.5 bg-black/30">
                <div className="flex gap-1.5">
                  {(["curl", "node", "python", "go"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1.5 rounded capitalize font-medium text-xs transition-colors ${
                        activeLang === lang
                          ? "bg-white/20 text-white font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeSnippets[activeLang]);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs transition-colors"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <pre className="p-4 @sm:p-5 overflow-x-auto text-zinc-200 text-xs @sm:text-sm leading-relaxed">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>
          </div>
        </main>

        {/* Right Column: Interactive API Playground Runner */}
        <aside
          className="w-full @xl:w-84 border-t @xl:border-t-0 @xl:border-l p-5 shrink-0 text-sm"
          style={{
            borderColor: "var(--template-border)",
            backgroundColor: "var(--template-surface)",
          }}
        >
          <div
            className="p-5 rounded-xl border space-y-3.5 transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Live API Explorer</span>
              <span className="text-xs font-mono text-emerald-500 font-medium">POST /v1/inference</span>
            </div>

            <button
              onClick={handleTestApi}
              disabled={isSending}
              className="w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 shadow-sm text-xs @sm:text-sm"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              {isSending ? (
                <span>Executing Request...</span>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Execute Test Request</span>
                </>
              )}
            </button>

            {apiResponse && (
              <div className="pt-3 border-t font-mono text-xs" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex justify-between items-center mb-1.5 text-xs text-emerald-500 font-semibold">
                  <span>HTTP 200 OK</span>
                  <span>3.8ms</span>
                </div>
                <pre
                  className="p-3 rounded-lg overflow-x-auto border text-xs"
                  style={{
                    backgroundColor: "var(--template-surface-muted)",
                    borderColor: "var(--template-border)",
                    color: "var(--template-fg)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  <code>{apiResponse}</code>
                </pre>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-4 @sm:px-6 border-t text-center text-xs @sm:text-sm"
        style={{
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {config.brandName || "Codex Docs"}. Built for developer experience.</p>
      </footer>
    </div>
  );
}
