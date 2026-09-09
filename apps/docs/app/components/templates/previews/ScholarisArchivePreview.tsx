"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Share2,
  Download,
  Copy,
  CheckCircle2,
  X,
  FileText,
  GitBranch,
  Check,
  ExternalLink,
  Sparkles,
  Award,
  Database,
  Code2,
  ChevronRight,
  Search,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function ScholarisArchivePreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedCitationTab, setSelectedCitationTab] = useState<"DERIVATIVES" | "ANTECEDENTS">("DERIVATIVES");
  const [isBibtexModalOpen, setIsBibtexModalOpen] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [archiveToast, setArchiveToast] = useState<string | null>(null);

  const paper = {
    title: "Sub-Quadratic Attention via Orthogonal State Space Projections in High-Dimensional Manifolds",
    authors: [
      { name: "Dr. Evelyn Zhao", affil: "Stanford AI Lab", orcid: "0000-0002-1825-0098" },
      { name: "Prof. Kenneth Sterling", affil: "MIT CSAIL", orcid: "0000-0001-9942-7711" },
      { name: "Tariq Al-Mansoor", affil: "Max Planck Institute", orcid: "0000-0003-4412-8802" },
    ],
    doi: "10.1038/s41586-026-09214-x",
    published: "August 2026",
    journal: "Journal of Machine Learning & Cognitive Systems (Vol 42, Iss 3)",
    citationsCount: 142,
    downloadsCount: "18.4k",
    reproducibilityScore: "9.8 / 10",
    abstract:
      "Traditional Transformer architectures incur quadratic complexity O(N^2) with respect to context sequence length. In this work, we present OrthoMamba, an orthogonal recurrent operator projecting key-value attention tensors onto isometric Stiefel manifolds. Our formulation proves mathematically equivalent convergence bounds while achieving O(N log N) inference throughput across 1,000,000 token horizons.",
    latexFormula: "\\mathcal{L}_{\\text{proj}}(Q, K, V) = \\arg\\min_{W \\in \\text{St}(d, k)} \\| W^T (QK^T) W - V \\|_F^2 + \\lambda \\operatorname{Tr}(W^T W - I)",
  };

  const citations = {
    DERIVATIVES: [
      {
        title: "Long-Horizon Genomics Sequence Modeling with OrthoMamba Kernels",
        authors: "Chen et al., Nature Computational Biology 2026",
        impact: "+48 citations",
        reproduced: true,
      },
      {
        title: "Hardware Accelerators for Non-Euclidean Tensor Attention",
        authors: "Vance & Sato, IEEE Micro 2026",
        impact: "+31 citations",
        reproduced: true,
      },
    ],
    ANTECEDENTS: [
      {
        title: "Structured State Spaces for Sequence Modeling (S4)",
        authors: "Gu et al., ICLR 2022",
        impact: "Foundational S4 Architecture",
        reproduced: true,
      },
      {
        title: "Attention Is All You Need",
        authors: "Vaswani et al., NeurIPS 2017",
        impact: "Transformer Baseline Reference",
        reproduced: true,
      },
    ],
  };

  const bibtexSnippet = `@article{zhao2026orthomamba,
  title={Sub-Quadratic Attention via Orthogonal State Space Projections},
  author={Zhao, Evelyn and Sterling, Kenneth and Al-Mansoor, Tariq},
  journal={Journal of Machine Learning & Cognitive Systems},
  volume={42},
  number={3},
  pages={114--132},
  year={2026},
  doi={10.1038/s41586-026-09214-x}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexSnippet);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleDownloadDataset = () => {
    setArchiveToast("Zenodo Dataset Archive (2.4 GB) download started via IPFS mirror!");
    setTimeout(() => setArchiveToast(null), 3500);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 14, 18, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "box"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Scholaris Archive</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(14, 165, 233, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Academic Research
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Open-Access Scientific Preprints & Citation Dependency Explorer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBibtexModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cite (BibTeX)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {archiveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(14, 165, 233, 0.12)" : "#f0f9ff",
                borderColor: "rgba(14, 165, 233, 0.3)",
                color: "#0284c7",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>{archiveToast}</span>
              </div>
              <button onClick={() => setArchiveToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper Main Header & Abstract */}
        <div
          className="p-6 @sm:p-8 rounded-2xl border space-y-6"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
          }}
        >
          {/* Metadata pill badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 font-mono">
              DOI: {paper.doi}
            </span>
            <span className="opacity-60 font-medium">• {paper.published}</span>
            <span className="opacity-60 font-medium">• {paper.journal}</span>
          </div>

          <h1 className="text-xl @sm:text-2xl @lg:text-3xl font-extrabold tracking-tight leading-snug">
            {paper.title}
          </h1>

          {/* Authors Strip */}
          <div className="flex flex-wrap gap-4 pt-1">
            {paper.authors.map((author) => (
              <div key={author.name} className="text-xs">
                <span className="font-bold block">{author.name}</span>
                <span className="text-[11px] opacity-60">{author.affil}</span>
              </div>
            ))}
          </div>

          {/* Scientific Abstract */}
          <div
            className="p-5 rounded-xl border space-y-3"
            style={{
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
              borderColor: "var(--template-border)",
            }}
          >
            <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Abstract</span>
            <p className="text-xs @sm:text-sm leading-relaxed opacity-85">{paper.abstract}</p>

            {/* LaTeX Mathematical Formula Display */}
            <div
              className="p-3 rounded-lg border font-mono text-xs overflow-x-auto text-sky-600 dark:text-sky-300"
              style={{
                backgroundColor: isDark ? "#06090e" : "#f1f5f9",
                borderColor: "var(--template-border)",
              }}
            >
              {paper.latexFormula}
            </div>
          </div>
        </div>

        {/* Reproducibility & Citation Network Split */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Left: Reproducibility Scorecard (5 cols) */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Open Science Verification
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">REPRODUCIBLE</span>
              </div>

              <div className="space-y-3 text-xs">
                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-sky-500" />
                    <div>
                      <div className="font-bold">Zenodo Open Dataset</div>
                      <div className="text-[10px] opacity-60">2.4 GB • 10M Token Sequence Benchmark</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadDataset}
                    className="p-1.5 rounded-lg border hover:bg-sky-500/10"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    <Download className="w-3.5 h-3.5 text-sky-500" />
                  </button>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-bold">Verified Docker Container</div>
                      <div className="text-[10px] opacity-60">Reproduced on 8x NVIDIA H100 SXM5</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-500">PASS 100%</span>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-bold">Peer Review Consensus</div>
                      <div className="text-[10px] opacity-60">Double-blind evaluation by 4 referees</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-500">Score 9.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Citation Tree (7 cols) */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Citation Dependency Graph
                </span>
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px]">
                  <button
                    onClick={() => setSelectedCitationTab("DERIVATIVES")}
                    className={`px-2 py-1 rounded font-semibold transition-all ${
                      selectedCitationTab === "DERIVATIVES"
                        ? "bg-white dark:bg-zinc-800 shadow-sm"
                        : "opacity-60"
                    }`}
                  >
                    Derivative Works (142)
                  </button>
                  <button
                    onClick={() => setSelectedCitationTab("ANTECEDENTS")}
                    className={`px-2 py-1 rounded font-semibold transition-all ${
                      selectedCitationTab === "ANTECEDENTS"
                        ? "bg-white dark:bg-zinc-800 shadow-sm"
                        : "opacity-60"
                    }`}
                  >
                    Foundational Roots (38)
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {citations[selectedCitationTab].map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border space-y-1"
                    style={{
                      borderColor: "var(--template-border)",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold leading-tight line-clamp-1">{c.title}</span>
                      <span className="text-[10px] font-mono text-sky-500 font-bold shrink-0 ml-2">
                        {c.impact}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-60">{c.authors}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BibTeX Citation Modal */}
      <AnimatePresence>
        {isBibtexModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#090d14" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <h3 className="text-sm font-bold">BibTeX Academic Citation</h3>
                </div>
                <button onClick={() => setIsBibtexModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                className="p-4 rounded-xl border font-mono text-xs overflow-x-auto"
                style={{
                  backgroundColor: isDark ? "#05070a" : "#f8fafc",
                  borderColor: "var(--template-border)",
                }}
              >
                <pre>{bibtexSnippet}</pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs opacity-60">Ready for LaTeX, Overleaf & Zotero</span>
                <button
                  onClick={handleCopyBibtex}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBibtex ? "Copied to Clipboard" : "Copy BibTeX"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
