"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Palette,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { TemplateConfig, RADIUS_VALUES } from "../../context/TemplateCustomizerContext";
import { TemplateItem } from "../../data/templates";

interface TemplateCodeExportModalProps {
  template: TemplateItem;
  config: TemplateConfig;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateCodeExportModal({
  template,
  config,
  isOpen,
  onClose,
}: TemplateCodeExportModalProps) {
  const [activeTab, setActiveTab] = useState<"code" | "css" | "cli">("code");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate customized code snippet incorporating user's choices
  const customizedTsx = `// ============================================================================
// NexoreUI Production Template: ${template.title}
// Customized configuration:
// - Brand: "${config.brandName}"
// - Primary Color: "${config.colors.primary}"
// - Font Family: "${config.typography.fontFamily}"
// - Heading Font: "${config.typography.headingFont}"
// - Border Radius: "${config.ui.radius}" (${RADIUS_VALUES[config.ui.radius]})
// - Theme: "${config.theme}"
// ============================================================================

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export const templateConfig = ${JSON.stringify(config, null, 2)};

${template.codeSnippet.replace(/Synthetix AI|Aura Cloud|Prism Analytics|HyperTerminal|Studio Monolith|Apex Capital|Atelier Objects|Vanguard Digital|Cortex Assistant|Orbit Flow|Genesis Stealth|Codex Docs/g, config.brandName)}
`;

  const customizedCss = `/* NexoreUI Customized Design Tokens for ${template.title} */
:root {
  --template-primary: ${config.colors.primary};
  --template-secondary: ${config.colors.secondary};
  --template-accent: ${config.colors.accent};
  --template-font: '${config.typography.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --template-heading-font: '${config.typography.headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --template-radius: ${RADIUS_VALUES[config.ui.radius]};
  --template-density: ${config.ui.density === "compact" ? "0.85" : config.ui.density === "relaxed" ? "1.2" : "1"};
  --template-spacing: ${config.ui.density === "compact" ? "0.85rem" : config.ui.density === "relaxed" ? "1.2rem" : "1rem"};
  --template-motion: ${config.motion === "reduced" ? "0" : config.motion === "expressive" ? "1.4" : "1"};
  
  /* Semantic Light/Dark Tokens */
  --template-bg: ${config.theme === "dark" ? "#090a0f" : "#ffffff"};
  --template-surface: ${config.theme === "dark" ? "#12141c" : "#f8f9fa"};
  --template-surface-elevated: ${config.theme === "dark" ? "#181a24" : "#ffffff"};
  --template-surface-muted: ${config.theme === "dark" ? "#161822" : "#f1f3f5"};
  --template-border: ${config.theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"};
  --template-fg: ${config.theme === "dark" ? "#f4f4f7" : "#0f172a"};
  --template-fg-muted: ${config.theme === "dark" ? "#9aa0aa" : "#475569"};
}
`;

  const customizedCli = `# Install ${template.title} directly into your Next.js project
npx nexoreui add ${template.id}

# Or clone standalone repository with Tailwind CSS v4 & Framer Motion
npx create-nexore-app@latest my-app --template=${template.slug}
`;

  const currentSnippet =
    activeTab === "code" ? customizedTsx : activeTab === "css" ? customizedCss : customizedCli;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([customizedTsx], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.slug}.custom.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl rounded-2xl border bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border-white/10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: config.colors.primary }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold tracking-tight">
                  Export Customized Code: {template.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Configured for: {config.brandName} • {config.colors.primary} • {config.typography.fontFamily}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between px-5 pt-3 border-b border-white/10 bg-zinc-900/50">
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 pb-2.5 px-2 border-b-2 font-medium transition-all ${
                  activeTab === "code"
                    ? "border-indigo-400 text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>React Component (.tsx)</span>
              </button>
              <button
                onClick={() => setActiveTab("css")}
                className={`flex items-center gap-1.5 pb-2.5 px-2 border-b-2 font-medium transition-all ${
                  activeTab === "css"
                    ? "border-indigo-400 text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Custom CSS Tokens</span>
              </button>
              <button
                onClick={() => setActiveTab("cli")}
                className={`flex items-center gap-1.5 pb-2.5 px-2 border-b-2 font-medium transition-all ${
                  activeTab === "cli"
                    ? "border-indigo-400 text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>CLI Command</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pb-2.5">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              {activeTab === "code" && (
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .tsx</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="p-4 flex-1 overflow-y-auto no-scrollbar font-mono text-xs bg-[#090a10]">
            <pre className="text-zinc-200 leading-relaxed overflow-x-auto">
              <code>{currentSnippet}</code>
            </pre>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
