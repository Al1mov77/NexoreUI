"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "../../../utils/clipboard";

function InstallCommand() {
  const [tab, setTab] = useState<'cli' | 'npm'>('cli');
  const [copied, setCopied] = useState(false);

  const cmd = tab === 'cli' ? 'npx nexoreui-cli add button' : 'npm i nexoreui';

  const handleCopy = async () => {
    await copyToClipboard(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-2.5 max-w-md w-full">
      <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
        <button
          type="button"
          onClick={() => setTab('cli')}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            tab === 'cli' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          CLI (Direct Copy)
        </button>
        <button
          type="button"
          onClick={() => setTab('npm')}
          className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
            tab === 'npm' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          npm Package
        </button>
      </div>

      <div className="w-full flex items-center justify-between gap-3 bg-card border border-border rounded-xl px-5 py-3 font-mono text-xs sm:text-sm shadow-sm">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Terminal size={14} className="text-primary shrink-0" />
          <span className="text-foreground truncate">{cmd}</span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy install command"
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

export function CTASection() {
  return (
    <section className="py-32 px-6 border-t border-border/50 relative z-10 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Subtle glow — no JS particles, just CSS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/8 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto flex flex-col items-center relative">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Ship your next project{" "}
          <span className="text-primary">faster</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          Beautiful, accessible components you can paste straight into your codebase.
          The code is yours — customize it, extend it, ship it.
        </p>

        <InstallCommand />

        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/docs/installation"
            id="cta-get-started"
            className="group inline-flex items-center justify-center h-12 px-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_5px_30px_rgba(var(--primary-rgb),0.35)] cursor-pointer"
          >
            Read the Docs
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            id="cta-github"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border bg-card/50 text-muted-foreground text-sm font-semibold hover:bg-card hover:text-foreground transition-all cursor-pointer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
