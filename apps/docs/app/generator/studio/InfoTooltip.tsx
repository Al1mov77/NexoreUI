"use client";

import { HelpCircle } from "lucide-react";
import React, { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={text}
        style={{ color: "var(--tool-muted)" }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:opacity-80 cursor-pointer"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            backgroundColor: "var(--tool-surface-elevated)",
            borderColor: "var(--tool-border-strong)",
            color: "var(--tool-fg)",
          }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-60 rounded-lg border p-2.5 text-[11px] font-normal leading-relaxed shadow-lg pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  );
}
