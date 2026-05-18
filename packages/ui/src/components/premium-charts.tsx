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
