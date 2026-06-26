"use client";

import React from "react";

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  propsData: PropRow[];
}

export function PropsTable({ propsData }: PropsTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">API Reference (Props)</h3>
      <div className="overflow-x-auto rounded-xl border border-border/50 bg-muted/10">
        <table className="w-full border-collapse text-left text-sm text-muted-foreground">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-foreground">
              <th className="px-5 py-3.5">Prop</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Default</th>
              <th className="px-5 py-3.5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {propsData.map((row) => (
              <tr key={row.name} className="hover:bg-muted/10 transition-colors">
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold text-primary">
                  {row.name}
                  {row.required && <span className="ml-1 text-red-500">*</span>}
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-zinc-300 max-w-[150px] truncate" title={row.type}>
                  {row.type}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-zinc-400">
                  {row.defaultValue !== undefined ? (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                      {row.defaultValue}
                    </code>
                  ) : (
                    <span className="text-[10px] text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs text-zinc-400 leading-relaxed min-w-[200px]">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
