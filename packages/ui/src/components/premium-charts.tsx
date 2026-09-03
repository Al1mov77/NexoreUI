"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. DonutChart — Animated donut/ring chart
// ============================================
export function DonutChart({ value, max = 100, size = 120, strokeWidth = 10, color = "hsl(var(--primary))", label, className }: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = (value / max) * 100
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/30" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}

// ============================================
// 2. BarChartSimple — Animated vertical bars
// ============================================
export function BarChartSimple({ data, height = 200, className }: {
  data: { label: string; value: number; color?: string }[]
  height?: number
  className?: string
}) {
  const maxVal = Math.max(...data.map(d => d.value))

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-2 justify-between" style={{ height }}>
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">{item.value}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxVal) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className={cn("w-full rounded-t-md min-h-[4px]", item.color || "bg-primary")}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 3. AreaChart — Simple area/sparkline chart
// ============================================
export function AreaChartSimple({ data, height = 80, color = "hsl(var(--primary))", className }: {
  data: number[]
  height?: number
  color?: string
  className?: string
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 300
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((v - min) / range) * (height - 10) - 5,
  }))
  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ")
  const areaD = `${pathD} L${w},${height} L0,${height} Z`

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaD}
          fill="url(#area-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

// ============================================
// 4. StatWidget — Stat with sparkline
// ============================================
export function StatWidget({ title, value, change, changeType = "positive", data = [], className }: {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative"
  data?: number[]
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        {change && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
            changeType === "positive" ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
          )}>{change}</span>
        )}
      </div>
      <p className="text-2xl font-bold mb-3">{value}</p>
      {data.length > 0 && (
        <AreaChartSimple data={data} height={40} color={changeType === "positive" ? "#10b981" : "#ef4444"} />
      )}
    </div>
  )
}

// ============================================
// 5. ProgressCircle — Circular progress ring
// ============================================
export function ProgressCircle({ value, size = 60, label, className }: {
  value: number
  size?: number
  label?: string
  className?: string
}) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/20" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-primary"
        />
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}

// ============================================
// 6. ComparisonBar — Horizontal comparison
// ============================================
export function ComparisonBar({ label1, label2, value1, value2, className }: {
  label1: string
  label2: string
  value1: number
  value2: number
  className?: string
}) {
  const total = value1 + value2
  const percent1 = (value1 / total) * 100
  const percent2 = (value2 / total) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{label1} <span className="text-muted-foreground">({value1})</span></span>
        <span className="font-medium">{label2} <span className="text-muted-foreground">({value2})</span></span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent1}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-primary rounded-l-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent2}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-violet-500 rounded-r-full"
        />
      </div>
    </div>
  )
}

// ============================================
// 7. HeatmapGrid — Activity heatmap
// ============================================
export function HeatmapGrid({ data, columns = 7, className }: {
  data: number[]
  columns?: number
  className?: string
}) {
  const max = Math.max(...data)

  return (
    <div className={cn("inline-grid gap-1", className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {data.map((val, i) => {
        const intensity = max > 0 ? val / max : 0
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: `hsl(var(--primary) / ${0.1 + intensity * 0.9})` }}
            title={`${val}`}
          />
        )
      })}
    </div>
  )
}

// ============================================
// 8. LeaderboardWidget — Ranked list
// ============================================
export function LeaderboardWidget({ items, title, className }: {
  items: { name: string; score: number; avatar?: string }[]
  title?: string
  className?: string
}) {
  const maxScore = Math.max(...items.map(i => i.score))

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      {title && <h4 className="font-semibold mb-4">{title}</h4>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
              i === 0 ? "bg-amber-500/20 text-amber-500" :
              i === 1 ? "bg-slate-300/20 text-slate-400" :
              i === 2 ? "bg-orange-500/20 text-orange-500" :
              "bg-muted text-muted-foreground"
            )}>{i + 1}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {item.avatar || item.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.score / maxScore) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-muted-foreground shrink-0">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 9. FunnelChart — Conversion funnel
// ============================================
export function FunnelChart({ steps, className }: {
  steps: { label: string; value: number; color?: string }[]
  className?: string
}) {
  const maxVal = steps[0]?.value || 1

  return (
    <div className={cn("w-full space-y-2", className)}>
      {steps.map((step, i) => {
        const widthPercent = (step.value / maxVal) * 100
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-muted-foreground w-20 text-right shrink-0">{step.label}</span>
            <div className="flex-1 h-8 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={cn("h-full rounded-md flex items-center px-3", step.color || "bg-primary")}
                style={{ minWidth: "40px" }}
              >
                <span className="text-xs font-medium text-primary-foreground">{step.value.toLocaleString()}</span>
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================
// 10. KPIDashboard — Multi-stat KPI row
// ============================================
export function KPIDashboard({ metrics, className }: {
  metrics: { label: string; value: string; icon?: React.ReactNode; trend?: string; trendType?: "up" | "down" }[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{m.label}</span>
            {m.icon && <span className="text-muted-foreground">{m.icon}</span>}
          </div>
          <p className="text-xl font-bold">{m.value}</p>
          {m.trend && (
            <span className={cn("text-xs font-medium",
              m.trendType === "up" ? "text-emerald-500" : "text-red-500"
            )}>
              {m.trendType === "up" ? "↑" : "↓"} {m.trend}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// Modern Charts Engine (SVG + Framer Motion)
// ============================================

const chartColorMap: Record<string, { stroke: string; fill: string; glow: string; text: string }> = {
  violet: { stroke: "#8b5cf6", fill: "rgba(139, 92, 246, 0.2)", glow: "rgba(139, 92, 246, 0.4)", text: "text-violet-400" },
  cyan: { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.2)", glow: "rgba(6, 182, 212, 0.4)", text: "text-cyan-400" },
  emerald: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.2)", glow: "rgba(16, 185, 129, 0.4)", text: "text-emerald-400" },
  rose: { stroke: "#f43f5e", fill: "rgba(244, 63, 94, 0.2)", glow: "rgba(244, 63, 94, 0.4)", text: "text-rose-400" },
  amber: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", glow: "rgba(245, 158, 11, 0.4)", text: "text-amber-400" },
};

export interface ModernAreaChartProps {
  data?: { label: string; value: number }[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  currency?: string;
  className?: string;
}

export function ModernAreaChart({
  data = [
    { label: "Mon", value: 3400 },
    { label: "Tue", value: 4200 },
    { label: "Wed", value: 3900 },
    { label: "Thu", value: 5800 },
    { label: "Fri", value: 6400 },
    { label: "Sat", value: 5900 },
    { label: "Sun", value: 7800 },
  ],
  color = "violet",
  height = 240,
  showGrid = true,
  showTooltip = true,
  currency = "$",
  className,
}: ModernAreaChartProps) {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.violet;

  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - minVal) / Math.max(1, maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1] || { label: "", value: 0 };

  return (
    <div className={cn("relative w-full select-none", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={`area-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorTheme.stroke} stopOpacity="0.4" />
            <stop offset="85%" stopColor={colorTheme.stroke} stopOpacity="0.02" />
            <stop offset="100%" stopColor={colorTheme.stroke} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {showGrid && (
          <g className="stroke-border/40" strokeDasharray="3 3">
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = padding.top + chartHeight * ratio;
              return <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} />;
            })}
          </g>
        )}

        {areaD && (
          <motion.path
            d={areaD}
            fill={`url(#area-grad-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        <motion.path
          d={pathD}
          fill="none"
          stroke={colorTheme.stroke}
          strokeWidth="2.5"
          filter={`url(#glow-${color})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {points.map((p, i) => (
          <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)}>
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5.5 : 3.5}
              fill="#09090b"
              stroke={colorTheme.stroke}
              strokeWidth={hoverIndex === i ? 3 : 2}
              className="transition-all duration-150"
            />
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className={cn(
                "text-[11px] font-mono fill-muted-foreground transition-colors",
                hoverIndex === i && "fill-foreground font-bold"
              )}
            >
              {p.label}
            </text>
          </g>
        ))}

        {hoverIndex !== null && (
          <line
            x1={activePoint.x}
            y1={padding.top}
            x2={activePoint.x}
            y2={padding.top + chartHeight}
            stroke={colorTheme.stroke}
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        )}
      </svg>

      {showTooltip && (
        <div className="absolute top-2 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorTheme.stroke }} />
          <span className="text-xs font-mono text-muted-foreground">{activePoint.label}:</span>
          <span className="text-xs font-mono font-bold text-foreground">
            {currency}
            {activePoint.value.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

export interface ModernBarChartProps {
  data?: { label: string; value: number }[];
  color?: string;
  height?: number;
  className?: string;
}

export function ModernBarChart({
  data = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 85 },
    { label: "Apr", value: 52 },
    { label: "May", value: 94 },
    { label: "Jun", value: 76 },
    { label: "Jul", value: 110 },
  ],
  color = "cyan",
  height = 220,
  className,
}: ModernBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.cyan;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;

  return (
    <div className={cn("w-full select-none space-y-2", className)}>
      <div className="flex items-end gap-3 justify-between w-full px-2" style={{ height }}>
        {data.map((item, idx) => {
          const heightPct = (item.value / maxVal) * 100;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full gap-2 cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className={cn(
                  "text-[10px] font-mono text-muted-foreground transition-all duration-150",
                  isHovered && "text-foreground font-bold scale-110"
                )}
              >
                {item.value}
              </span>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={cn(
                  "w-full rounded-t-lg transition-all duration-200 relative overflow-hidden",
                  isHovered ? "opacity-100 shadow-lg" : "opacity-80 hover:opacity-100"
                )}
                style={{
                  backgroundColor: colorTheme.stroke,
                  boxShadow: isHovered ? `0 0 20px ${colorTheme.glow}` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20" />
              </motion.div>

              <span
                className={cn(
                  "text-[11px] font-mono text-muted-foreground",
                  isHovered && "text-foreground font-bold"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface ModernDonutChartProps {
  percentage?: number;
  title?: string;
  subtitle?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ModernDonutChart({
  percentage = 78,
  title = "78%",
  subtitle = "Conversion Rate",
  color = "emerald",
  size = 180,
  strokeWidth = 14,
  className,
}: ModernDonutChartProps) {
  const colorTheme = chartColorMap[color] || chartColorMap.emerald;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none", className)}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorTheme.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${colorTheme.glow})`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">{title}</span>
        {subtitle && (
          <span className="text-[11px] font-mono text-muted-foreground mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
