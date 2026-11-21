export const dataDisplay = {
  name: "data-display",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "lucide-react"
],
  componentsDependencies: [
  "button",
  "avatar"
],
  fileName: "data-display.tsx",
  content: `"use client";

import * as React from "react";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";

export const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border border-b-2 bg-muted/70 px-1.5 font-mono text-[11px] font-medium leading-none text-foreground select-none tabular-nums",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
);
Kbd.displayName = "Kbd";

export interface AvatarGroupItem {
  src?: string;
  fallback: string;
  alt?: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  limit?: number;
}

export function AvatarGroup({ items, limit = 3, className, ...props }: AvatarGroupProps) {
  const visible = items.slice(0, limit);
  const remaining = items.length - limit;

  return (
    <div
      role="group"
      aria-label={\`Group of \${items.length} members\`}
      className={cn("flex items-center -space-x-2.5", className)}
      {...props}
    >
      {visible.map((item, idx) => (
        <Avatar key={\`\${item.fallback}-\${idx}\`} className="ring-2 ring-background bg-card">
          {item.src ? <AvatarImage src={item.src} alt={item.alt ?? item.fallback} /> : null}
          <AvatarFallback className="text-xs font-medium text-foreground">
            {item.fallback}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground ring-2 ring-background tabular-nums">
          +{remaining}
        </div>
      )}
    </div>
  );
}

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs transition-colors hover:border-foreground/25",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
          {title}
        </p>
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </h3>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium font-mono tabular-nums",
              trend.positive
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  icon?: React.ReactNode;
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={\`\${item.title}-\${index}\`} className="flex items-stretch gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs">
                {item.icon ? (
                  item.icon
                ) : (
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                )}
              </div>
              {!isLast && <div aria-hidden="true" className="my-1.5 w-px flex-1 bg-border" />}
            </div>
            <div className={cn("flex-1 min-w-0", !isLast && "pb-6")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-0.5">
                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  {item.title}
                </h4>
                {item.date && (
                  <time className="text-[11px] font-mono text-muted-foreground tabular-nums">
                    {item.date}
                  </time>
                )}
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3.5 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
            {language}
          </span>
          {filename && (
            <span className="truncate font-mono text-xs text-foreground">{filename}</span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code"}
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText?: string;
  popular?: boolean;
  onButtonClick?: () => void;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  buttonText = "Get started",
  popular = false,
  onButtonClick,
  className,
  ...props
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-xs transition-colors",
        popular ? "border-foreground" : "border-border",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        {popular && (
          <span className="shrink-0 rounded-md border border-border bg-foreground px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-background">
            Featured
          </span>
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-1 border-b border-border pb-5">
        <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {price}
        </span>
        <span className="text-xs text-muted-foreground">/ month</span>
      </div>

      <ul className="my-5 flex-1 space-y-2.5 text-xs sm:text-sm text-foreground">
        {features.map((feature, index) => (
          <li key={\`\${feature}-\${index}\`} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={popular ? "default" : "outline"}
        onClick={onButtonClick}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
}

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch",
        className
      )}
      {...props}
    />
  );
}
`
};
