"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable, type PropRow } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Copy, Check, Terminal } from "lucide-react";
import { copyToClipboard } from "../../utils/clipboard";

export interface SuiteItem {
  name: string;
  description: string;
  component: React.ReactNode;
  code: string;
  propsData?: PropRow[];
}

export interface SuiteSectionLayoutProps {
  id: string;
  title: string;
  badge?: string;
  description: string;
  cliCommand: string;
  items: SuiteItem[];
  a11yNotes?: string[];
}

export function SuiteSectionLayout({
  id,
  title,
  badge = "Pro Suite",
  description,
  cliCommand,
  items,
  a11yNotes,
}: SuiteSectionLayoutProps) {
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCli = async () => {
    try {
      await copyToClipboard(cliCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section id={id} className="space-y-10 scroll-mt-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground font-medium">
            {badge}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1 max-w-3xl leading-relaxed text-sm">
          {description}
        </p>
      </div>

      {/* CLI Installation Box */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
          <code className="text-xs font-mono text-foreground truncate select-all">
            {cliCommand}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopyCli}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          aria-label={`Copy installation command: ${cliCommand}`}
        >
          {copiedCli ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Copy command</span>
            </>
          )}
        </button>
      </div>

      {/* Items Showcase */}
      <div className="space-y-12">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6 overflow-hidden">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>

            {item.propsData && item.propsData.length > 0 && (
              <div className="mt-4">
                <PropsTable propsData={item.propsData} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Accessibility notice */}
      {a11yNotes && a11yNotes.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
          <A11yHeader />
          <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
            {a11yNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
