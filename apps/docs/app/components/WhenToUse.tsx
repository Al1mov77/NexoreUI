import React from "react";

export interface WhenToUseItem {
  label: string;
  description: string;
}

export interface WhenToUseProps {
  title?: string;
  items: WhenToUseItem[];
  className?: string;
}

export function WhenToUse({
  title = "When to use",
  items,
  className = "",
}: WhenToUseProps) {
  return (
    <div className={`rounded-xl border border-border bg-card overflow-hidden ${className}`}>
      <div className="px-4 sm:px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
          {title}
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
          {items.length} {items.length === 1 ? "guideline" : "guidelines"}
        </span>
      </div>
      <dl className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1.5 sm:gap-6 px-4 sm:px-5 py-3.5 items-baseline"
          >
            <dt className="min-w-0">
              <code className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-muted/60 font-mono text-[11px] font-medium text-foreground w-fit">
                {item.label}
              </code>
            </dt>
            <dd className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed min-w-0">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
