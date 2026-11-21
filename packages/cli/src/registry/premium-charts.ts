export const premiumCharts = {
  name: "premium-charts",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion"
],
  
  fileName: "premium-charts.tsx",
  content: `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../utils/cn";

const FALLBACK_SERIES_COLORS = [
  "var(--primary)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatCompactAxisValue(value: number, prefix = ""): string {
  if (Math.abs(value) >= 1000) {
    const scaled = value / 1000;
    const text = Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1);
    return \`\${prefix}\${text}k\`;
  }
  return \`\${prefix}\${Math.round(value)}\`;
}

export function DonutChart({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = "var(--primary)",
  label,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(0, value), safeMax);
  const progress = clamped / safeMax;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/60"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={shouldReduceMotion ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
          }
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
          {Math.round(progress * 100)}%
        </span>
        {label && (
          <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export function BarChartSimple({
  data,
  height = 180,
  className,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="flex items-end gap-2.5 border-b border-border pb-1"
        style={{ height }}
      >
        {data.map((item, idx) => {
          const pct = Math.max(4, Math.min(88, (item.value / maxVal) * 86));
          return (
            <div
              key={\`\${item.label}-\${idx}\`}
              className="group flex h-full flex-1 min-w-0 flex-col items-center justify-end gap-1.5"
            >
              <span className="font-mono text-[10px] text-muted-foreground opacity-80 group-hover:text-foreground group-hover:opacity-100 tabular-nums transition-opacity">
                {item.value.toLocaleString()}
              </span>
              <motion.div
                className="w-full max-w-[32px] rounded-t-sm transition-opacity group-hover:opacity-85"
                style={{
                  backgroundColor: item.color ?? "var(--primary)",
                }}
                initial={shouldReduceMotion ? false : { height: 0 }}
                animate={{ height: \`\${pct}%\` }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.55, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }
                }
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        {data.map((item, idx) => (
          <span
            key={\`\${item.label}-lbl-\${idx}\`}
            className="flex-1 min-w-0 truncate text-center font-mono text-[10px] text-muted-foreground"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AreaChartSimple({
  data,
  height = 80,
  color = "var(--primary)",
  className,
}: {
  data: number[];
  height?: number;
  color?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const gradientId = React.useId().replace(/:/g, "");

  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const denominator = Math.max(1, data.length - 1);

  const points = data.map((val, i) => {
    const x = (i / denominator) * 100;
    const y = 94 - ((val - min) / range) * 76;
    return \`\${x},\${y}\`;
  });

  const linePath = \`M \${points.join(" L ")}\`;
  const areaPath = \`\${linePath} L 100,100 L 0,100 Z\`;

  return (
    <div className={cn("w-full overflow-hidden", className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={\`area-simple-\${gradientId}\`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill={\`url(#area-simple-\${gradientId})\`}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={shouldReduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.85, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

export function StatWidget({
  title,
  value,
  change,
  changeType = "positive",
  data = [],
  className,
}: {
  title: string;
  value: string;
  change: string;
  changeType?: "positive" | "negative";
  data?: number[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums",
            changeType === "positive"
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive"
          )}
        >
          {change}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </div>
      {data.length > 0 && (
        <div className="mt-4">
          <AreaChartSimple
            data={data}
            height={44}
            color={changeType === "positive" ? "var(--success)" : "var(--destructive)"}
          />
        </div>
      )}
    </div>
  );
}

export function ProgressCircle({
  value,
  size = 64,
  label,
  className,
}: {
  value: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const strokeWidth = Math.max(4, Math.round(size * 0.09));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/60"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--primary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={shouldReduceMotion ? false : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute font-mono text-xs font-semibold text-foreground tabular-nums">
          {Math.round(clamped)}%
        </span>
      </div>
      {label && (
        <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

export function ComparisonBar({
  label1,
  label2,
  value1,
  value2,
  className,
}: {
  label1: string;
  label2: string;
  value1: number;
  value2: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const safeV1 = Math.max(0, value1);
  const safeV2 = Math.max(0, value2);
  const total = safeV1 + safeV2;
  const p1 = total > 0 ? (safeV1 / total) * 100 : 50;
  const p2 = 100 - p1;

  return (
    <div className={cn("w-full space-y-2.5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 rounded-xs bg-foreground shrink-0" />
          <span className="font-medium text-foreground truncate">{label1}</span>
          <span className="font-mono text-muted-foreground tabular-nums">
            {safeV1.toLocaleString()} ({Math.round(p1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-muted-foreground tabular-nums">
            {safeV2.toLocaleString()} ({Math.round(p2)}%)
          </span>
          <span className="font-medium text-muted-foreground truncate">{label2}</span>
          <span className="h-2 w-2 rounded-xs bg-muted-foreground/40 shrink-0" />
        </div>
      </div>
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted p-0.5">
        <motion.div
          className="h-full rounded-l-full bg-foreground"
          initial={shouldReduceMotion ? false : { width: 0 }}
          animate={{ width: \`\${p1}%\` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
        />
        <motion.div
          className="h-full rounded-r-full bg-muted-foreground/40"
          initial={shouldReduceMotion ? false : { width: 0 }}
          animate={{ width: \`\${p2}%\` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function HeatmapGrid({
  data,
  columns = 7,
  className,
}: {
  data: number[];
  columns?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const levels = [
    "bg-muted/70",
    "bg-foreground/15",
    "bg-foreground/35",
    "bg-foreground/65",
    "bg-foreground",
  ];

  return (
    <div className={cn("w-full space-y-2.5", className)}>
      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>Activity density</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {levels.map((tone, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn("h-2.5 w-2.5 rounded-[2px] border border-border/40", tone)}
            />
          ))}
          <span>More</span>
        </div>
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: \`repeat(\${columns}, minmax(0, 1fr))\` }}
      >
        {data.map((val, i) => {
          const level = Math.min(Math.max(0, Math.round(val)), 4);
          return (
            <motion.div
              key={i}
              title={\`Cell \${i + 1}: level \${level}\`}
              aria-label={\`Activity level \${level} of 4\`}
              className={cn(
                "aspect-square rounded-sm border border-border/30",
                levels[level]
              )}
              initial={shouldReduceMotion ? false : { scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay: Math.min(i * 0.008, 0.25), duration: 0.2 }
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export function LeaderboardWidget({
  items,
  title,
  className,
}: {
  items: { name: string; value: string | number; avatar?: string }[];
  title: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Rank
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={\`\${item.name}-\${i}\`}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { delay: i * 0.05, duration: 0.25 }
            }
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-semibold tabular-nums",
                  i === 0
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/50 text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-6 w-6 shrink-0 rounded-full object-cover border border-border"
                />
              ) : null}
              <span className="truncate text-sm font-medium text-foreground">
                {item.name}
              </span>
            </div>
            <span className="shrink-0 font-mono text-xs font-semibold text-foreground tabular-nums">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FunnelChart({
  steps,
  className,
}: {
  steps: { label: string; value: number; color?: string }[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const baseVal = steps[0]?.value ?? 1;
  const maxVal = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className={cn("w-full space-y-3", className)}>
      {steps.map((step, i) => {
        const pctWidth = Math.max(8, (step.value / maxVal) * 100);
        const conversionPct = baseVal > 0 ? Math.round((step.value / baseVal) * 100) : 0;

        return (
          <div key={\`\${step.label}-\${i}\`} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-medium text-foreground truncate">{step.label}</span>
              <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
                <span className="text-foreground font-semibold">
                  {step.value.toLocaleString()}
                </span>
                <span className="w-10 text-right text-[11px] text-muted-foreground">
                  {conversionPct}%
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    step.color ??
                    FALLBACK_SERIES_COLORS[i % FALLBACK_SERIES_COLORS.length],
                }}
                initial={shouldReduceMotion ? false : { width: 0 }}
                animate={{ width: \`\${pctWidth}%\` }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.65, delay: i * 0.06, ease: "easeOut" }
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function KPIDashboard({
  metrics,
  className,
}: {
  metrics: { label: string; value: string; delta: string; positive: boolean }[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full", className)}>
      {metrics.map((metric, i) => (
        <motion.div
          key={\`\${metric.label}-\${i}\`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { delay: i * 0.05, duration: 0.25 }
          }
          className="rounded-xl border border-border bg-card p-4 shadow-xs"
        >
          <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground truncate">
            {metric.label}
          </span>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
              {metric.value}
            </span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums shrink-0",
                metric.positive
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive"
              )}
            >
              {metric.delta}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export interface ModernAreaChartProps {
  data: { label: string; value: number; formattedValue?: string }[];
  title?: string;
  subtitle?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  smooth?: boolean;
  className?: string;
}

export function ModernAreaChart({
  data,
  title,
  subtitle,
  height = 220,
  color = "var(--primary)",
  showGrid = true,
  showTooltip = true,
  smooth = true,
  className,
}: ModernAreaChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const gradientId = React.useId().replace(/:/g, "");

  if (data.length === 0) return null;

  const hasCurrency = data.some((d) => d.formattedValue?.startsWith("$"));
  const currencyPrefix = hasCurrency ? "$" : "";

  const rawMax = Math.max(...data.map((d) => d.value), 1);
  const rawMin = Math.min(...data.map((d) => d.value), 0);
  const yMin = rawMin < 0 ? rawMin : 0;
  const span = rawMax - yMin || 1;
  const yMax = rawMax + span * 0.08;

  const svgWidth = 600;
  const svgHeight = Math.max(170, height);
  const padding = { top: 14, right: 16, bottom: 28, left: 48 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;
  const denominator = Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const x = padding.left + (i / denominator) * plotW;
    const y = padding.top + plotH - ((d.value - yMin) / (yMax - yMin)) * plotH;
    return { x, y, item: d };
  });

  const buildPath = () => {
    if (points.length === 1) {
      return \`M \${points[0].x} \${points[0].y}\`;
    }
    if (!smooth) {
      return \`M \${points.map((p) => \`\${p.x.toFixed(1)},\${p.y.toFixed(1)}\`).join(" L ")}\`;
    }
    let path = \`M \${points[0].x.toFixed(1)},\${points[0].y.toFixed(1)}\`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.42;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.58;
      const cy2 = p1.y;
      path += \` C \${cx1.toFixed(1)},\${cy1.toFixed(1)} \${cx2.toFixed(1)},\${cy2.toFixed(1)} \${p1.x.toFixed(1)},\${p1.y.toFixed(1)}\`;
    }
    return path;
  };

  const linePath = buildPath();
  const baseLineY = padding.top + plotH;
  const areaPath =
    points.length > 1
      ? \`\${linePath} L \${points[points.length - 1].x.toFixed(1)},\${baseLineY} L \${points[0].x.toFixed(1)},\${baseLineY} Z\`
      : linePath;

  const yTicks = [0, 0.33, 0.67, 1].map((ratio) => ({
    ratio,
    value: yMin + (yMax - yMin) * (1 - ratio),
    y: padding.top + plotH * ratio,
  }));

  const activeIndex = hoveredIdx ?? data.length - 1;
  const activePoint = points[activeIndex];

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {showTooltip && activePoint && (
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs tabular-nums">
            <span className="font-mono text-muted-foreground">
              {activePoint.item.label}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="font-mono font-semibold text-foreground">
              {activePoint.item.formattedValue ?? activePoint.item.value.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="relative w-full" onMouseLeave={() => setHoveredIdx(null)}>
        <svg
          viewBox={\`0 0 \${svgWidth} \${svgHeight}\`}
          className="h-auto w-full overflow-visible select-none"
          role="img"
          aria-label={title ?? "Area chart"}
        >
          <defs>
            <linearGradient id={\`modern-area-\${gradientId}\`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, idx) => (
            <g key={idx}>
              {showGrid && (
                <line
                  x1={padding.left}
                  y1={tick.y}
                  x2={svgWidth - padding.right}
                  y2={tick.y}
                  stroke="currentColor"
                  strokeDasharray={idx === yTicks.length - 1 ? undefined : "3 4"}
                  className={
                    idx === yTicks.length - 1 ? "text-border" : "text-border/60"
                  }
                  strokeWidth={1}
                />
              )}
              <text
                x={padding.left - 8}
                y={tick.y + 3}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[10px]"
              >
                {formatCompactAxisValue(tick.value, currencyPrefix)}
              </text>
            </g>
          ))}

          {points.length > 1 && (
            <motion.path
              d={areaPath}
              fill={\`url(#modern-area-\${gradientId})\`}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
            />
          )}

          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={shouldReduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.85, ease: "easeOut" }}
          />

          {hoveredIdx !== null && activePoint && (
            <line
              x1={activePoint.x}
              y1={padding.top}
              x2={activePoint.x}
              y2={baseLineY}
              stroke="currentColor"
              className="text-muted-foreground/45"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            const colWidth = plotW / Math.max(1, points.length);
            return (
              <g
                key={\`\${p.item.label}-\${idx}\`}
                className="cursor-pointer outline-none"
                tabIndex={0}
                onMouseEnter={() => setHoveredIdx(idx)}
                onFocus={() => setHoveredIdx(idx)}
                aria-label={\`\${p.item.label}: \${p.item.formattedValue ?? p.item.value}\`}
              >
                <rect
                  x={p.x - colWidth / 2}
                  y={padding.top}
                  width={colWidth}
                  height={plotH + padding.bottom}
                  fill="transparent"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 4.5 : 2.5}
                  fill="var(--background)"
                  stroke={color}
                  strokeWidth={isHovered ? 2.5 : 1.75}
                />
                <text
                  x={p.x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  className={cn(
                    "font-mono text-[10px] transition-colors",
                    isHovered
                      ? "fill-foreground font-semibold"
                      : "fill-muted-foreground"
                  )}
                >
                  {p.item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export interface ModernBarChartProps {
  data: { label: string; value: number; formattedValue?: string; color?: string }[];
  title?: string;
  subtitle?: string;
  height?: number;
  barColor?: string;
  showGrid?: boolean;
  className?: string;
}

export function ModernBarChart({
  data,
  title,
  subtitle,
  height = 200,
  barColor = "var(--primary)",
  showGrid = true,
  className,
}: ModernBarChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const activeItem = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {activeItem && (
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs tabular-nums">
            <span className="font-mono text-muted-foreground">{activeItem.label}</span>
            <span className="h-3 w-px bg-border" />
            <span className="font-mono font-semibold text-foreground">
              {activeItem.formattedValue ?? activeItem.value.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div
        className="relative flex items-end gap-2 sm:gap-3 border-b border-border px-1"
        style={{ height }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {showGrid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
          >
            <div className="border-t border-dashed border-border/50" />
            <div className="border-t border-dashed border-border/50" />
            <div className="border-t border-dashed border-border/50" />
            <div />
          </div>
        )}

        {data.map((item, idx) => {
          const heightPct = Math.max(6, Math.min(84, (item.value / maxVal) * 82));
          const isHovered = hoveredIdx === idx;
          const isDimmed = hoveredIdx !== null && !isHovered;

          return (
            <button
              key={\`\${item.label}-\${idx}\`}
              type="button"
              onMouseEnter={() => setHoveredIdx(idx)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx((prev) => (prev === idx ? null : prev))}
              aria-label={\`\${item.label}: \${item.formattedValue ?? item.value}\`}
              className="group relative z-10 flex h-full flex-1 min-w-0 flex-col items-center justify-end gap-1.5 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums transition-opacity duration-150",
                  isHovered
                    ? "font-semibold text-foreground opacity-100"
                    : "text-muted-foreground opacity-75"
                )}
              >
                {item.formattedValue ?? item.value.toLocaleString()}
              </span>
              <motion.div
                className={cn(
                  "w-full max-w-[36px] rounded-t-md transition-opacity duration-150",
                  isDimmed ? "opacity-35" : "opacity-100"
                )}
                style={{
                  backgroundColor: item.color ?? barColor,
                }}
                initial={shouldReduceMotion ? false : { height: 0 }}
                animate={{ height: \`\${heightPct}%\` }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.55, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }
                }
              />
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-center gap-2 sm:gap-3 px-1">
        {data.map((item, idx) => (
          <span
            key={\`\${item.label}-axis-\${idx}\`}
            className={cn(
              "flex-1 min-w-0 truncate text-center font-mono text-[10px] transition-colors",
              hoveredIdx === idx
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface ModernDonutChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  className?: string;
}

export function ModernDonutChart({
  data,
  title,
  centerLabel = "Total",
  centerValue,
  size = 168,
  className,
}: ModernDonutChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const total = data.reduce((acc, item) => acc + Math.max(0, item.value), 0) || 1;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = React.useMemo(() => {
    let offsetAccumulator = 0;
    return data.map((item, idx) => {
      const ratio = Math.max(0, item.value) / total;
      const strokeLength = ratio * circumference;
      const offset = -offsetAccumulator;
      offsetAccumulator += strokeLength;
      return {
        ...item,
        ratio,
        pct: Math.round(ratio * 100),
        strokeLength,
        offset,
        fill: item.color ?? FALLBACK_SERIES_COLORS[idx % FALLBACK_SERIES_COLORS.length],
      };
    });
  }, [data, total, circumference]);

  const activeSeg = hoveredIdx !== null ? segments[hoveredIdx] : null;
  const displayedCenterLabel = activeSeg ? activeSeg.label : centerLabel;
  const displayedCenterValue = activeSeg
    ? \`\${activeSeg.pct}%\`
    : centerValue ?? total.toLocaleString();

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      {title && <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div
          className="relative flex shrink-0 items-center justify-center"
          style={{ width: size, height: size }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {segments.map((seg, idx) => {
              const isHovered = hoveredIdx === idx;
              const isDimmed = hoveredIdx !== null && !isHovered;
              return (
                <motion.circle
                  key={\`\${seg.label}-\${idx}\`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.fill}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={\`\${seg.strokeLength} \${circumference}\`}
                  strokeDashoffset={seg.offset}
                  className="cursor-pointer transition-opacity duration-150"
                  style={{ opacity: isDimmed ? 0.32 : 1 }}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { strokeDasharray: \`0 \${circumference}\` }
                  }
                  animate={{ strokeDasharray: \`\${seg.strokeLength} \${circumference}\` }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.75, delay: idx * 0.06, ease: "easeOut" }
                  }
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
            <span className="max-w-full truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {displayedCenterLabel}
            </span>
            <span className="mt-0.5 text-lg font-semibold tracking-tight text-foreground tabular-nums">
              {displayedCenterValue}
            </span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-1.5 min-w-0">
          {segments.map((seg, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <button
                key={\`\${seg.label}-legend-\${idx}\`}
                type="button"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(idx)}
                onBlur={() => setHoveredIdx(null)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isHovered ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: seg.fill }}
                  />
                  <span className="truncate font-medium text-foreground">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 font-mono tabular-nums">
                  <span className="text-muted-foreground">
                    {seg.value.toLocaleString()}
                  </span>
                  <span className="w-8 text-right font-semibold text-foreground">
                    {seg.pct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
`
};
