"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  max?: number
  variant?: "default" | "success" | "warning" | "error" | "info"
  showLabel?: boolean
  progressLabel?: string
  formatValue?: (value: number, max: number) => string
  size?: "default" | "sm" | "lg"
  segments?: number
  animated?: boolean
  isIndeterminate?: boolean
}

const variantFillClasses: Record<
  "default" | "success" | "warning" | "error" | "info",
  string
> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  info: "bg-info",
}

const variantTextClasses: Record<
  "default" | "success" | "warning" | "error" | "info",
  string
> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
}

const sizeClasses: Record<"default" | "sm" | "lg", string> = {
  sm: "h-1.5",
  default: "h-2.5",
  lg: "h-4",
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      showLabel = false,
      progressLabel = "Progress",
      formatValue,
      size = "default",
      segments,
      animated = true,
      isIndeterminate = false,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const safeMax = max > 0 ? max : 100
    const clampedValue = Math.min(safeMax, Math.max(0, value))
    const percentage = (clampedValue / safeMax) * 100
    const displayValue = formatValue
      ? formatValue(clampedValue, safeMax)
      : `${Math.round(percentage)}%`

    const activeSegmentCount =
      segments && segments > 1 ? Math.round(segments) : 0

    return (
      <div className="w-full space-y-1.5">
        {showLabel && (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-muted-foreground truncate">
              {progressLabel}
            </span>
            {!isIndeterminate && (
              <span
                className={cn(
                  "font-mono font-semibold tabular-nums shrink-0",
                  variantTextClasses[variant]
                )}
              >
                {displayValue}
              </span>
            )}
          </div>
        )}

        {activeSegmentCount > 0 ? (
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : clampedValue}
            aria-valuemin={0}
            aria-valuemax={safeMax}
            aria-label={progressLabel}
            className={cn(
              "grid w-full gap-1",
              sizeClasses[size],
              className
            )}
            style={{
              gridTemplateColumns: `repeat(${activeSegmentCount}, minmax(0, 1fr))`,
            }}
            {...(props as React.HTMLAttributes<HTMLDivElement>)}
          >
            {Array.from({ length: activeSegmentCount }).map((_, idx) => {
              const stepStart = (idx / activeSegmentCount) * 100
              const stepSpan = 100 / activeSegmentCount
              const fillPct = isIndeterminate
                ? idx === 0
                  ? 100
                  : 0
                : Math.min(100, Math.max(0, ((percentage - stepStart) / stepSpan) * 100))

              return (
                <div
                  key={idx}
                  className="h-full w-full overflow-hidden rounded-full bg-muted border border-border/50"
                >
                  <div
                    className={cn(
                      "h-full rounded-full",
                      variantFillClasses[variant],
                      animated && !shouldReduceMotion
                        ? "transition-[width] duration-300 ease-out"
                        : "transition-none"
                    )}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <ProgressPrimitive.Root
            ref={ref}
            value={isIndeterminate ? null : clampedValue}
            max={safeMax}
            aria-label={progressLabel}
            className={cn(
              "relative w-full overflow-hidden rounded-full bg-muted border border-border/50",
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {isIndeterminate ? (
              shouldReduceMotion ? (
                <div
                  className={cn(
                    "h-full w-1/3 mx-auto rounded-full",
                    variantFillClasses[variant]
                  )}
                />
              ) : (
                <motion.div
                  className={cn(
                    "h-full w-2/5 rounded-full",
                    variantFillClasses[variant]
                  )}
                  initial={{ x: "-100%" }}
                  animate={{ x: "260%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                />
              )
            ) : (
              <ProgressPrimitive.Indicator
                className={cn(
                  "h-full w-full flex-1 rounded-full",
                  variantFillClasses[variant],
                  animated && !shouldReduceMotion
                    ? "transition-transform duration-300 ease-out"
                    : "transition-none"
                )}
                style={{ transform: `translateX(-${100 - percentage}%)` }}
              />
            )}
          </ProgressPrimitive.Root>
        )}
      </div>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

export interface CircularProgressCardProps {
  value?: number
  max?: number
  title?: string
  label?: string
  subtitle?: string
  unit?: string
  size?: number
  variant?: "default" | "success" | "warning" | "error" | "info"
  className?: string
}

export const CircularProgressCard = ({
  value = 75,
  max = 100,
  title,
  label,
  subtitle,
  unit = "%",
  size = 96,
  variant = "default",
  className,
}: CircularProgressCardProps) => {
  const shouldReduceMotion = useReducedMotion()
  const safeMax = max > 0 ? max : 100
  const clampedValue = Math.min(safeMax, Math.max(0, value))
  const percentage = (clampedValue / safeMax) * 100
  const displayTitle = title || label || "Progress"

  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (circumference * percentage) / 100

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={displayTitle}
      className={cn(
        "p-5 bg-card text-card-foreground border border-border rounded-xl flex flex-col items-center gap-3 w-full max-w-[210px] shadow-xs",
        className
      )}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg className="-rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              variantTextClasses[variant],
              shouldReduceMotion
                ? "transition-none"
                : "transition-[stroke-dashoffset] duration-500 ease-out"
            )}
          />
        </svg>
        <span className="absolute font-mono text-base font-bold text-foreground tabular-nums">
          {clampedValue}
          <span className="text-[11px] font-normal text-muted-foreground ml-0.5">
            {unit}
          </span>
        </span>
      </div>
      <div className="text-center space-y-0.5">
        <div className="text-xs font-semibold text-foreground leading-tight">
          {displayTitle}
        </div>
        {subtitle && (
          <div className="text-[11px] font-mono text-muted-foreground tabular-nums">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export interface StackedProgressSegment {
  label: string
  value: number
  tone?: "primary" | "success" | "warning" | "info" | "destructive" | "muted"
}

export interface StackedProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  segments: StackedProgressSegment[]
  max?: number
  unit?: string
  title?: string
}

const stackedToneClasses: Record<
  NonNullable<StackedProgressSegment["tone"]>,
  string
> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground/40",
}

export const StackedProgress = React.forwardRef<
  HTMLDivElement,
  StackedProgressProps
>(({ segments, max, unit = "GB", title, className, ...props }, ref) => {
  const shouldReduceMotion = useReducedMotion()
  const totalValue = segments.reduce((sum, item) => sum + Math.max(0, item.value), 0)
  const resolvedMax = max && max > 0 ? max : Math.max(1, totalValue)

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-foreground truncate">
          {title || "Allocation"}
        </span>
        <span className="font-mono text-muted-foreground tabular-nums shrink-0">
          <span className="text-foreground font-semibold">{totalValue}</span> / {resolvedMax} {unit}
        </span>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted gap-0.5 p-0.5 border border-border/50">
        {segments.map((seg) => {
          const widthPct = Math.min(100, (Math.max(0, seg.value) / resolvedMax) * 100)
          if (widthPct <= 0) return null
          return (
            <div
              key={seg.label}
              title={`${seg.label}: ${seg.value} ${unit}`}
              className={cn(
                "h-full rounded-full first:rounded-l-full last:rounded-r-full",
                stackedToneClasses[seg.tone || "primary"],
                shouldReduceMotion
                  ? "transition-none"
                  : "transition-[width] duration-300 ease-out"
              )}
              style={{ width: `${widthPct}%` }}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
        {segments.map((seg) => (
          <div key={seg.label} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                stackedToneClasses[seg.tone || "primary"]
              )}
            />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-mono font-medium text-foreground tabular-nums">
              {seg.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
StackedProgress.displayName = "StackedProgress"

export { Progress }
