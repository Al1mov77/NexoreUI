"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  variant?: "line" | "circle" | "rect"
  count?: number
  animated?: boolean
}

const variantClasses: Record<"line" | "circle" | "rect", string> = {
  rect: "rounded-md",
  circle: "rounded-full",
  line: "rounded-sm h-4",
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      width,
      height,
      variant = "rect",
      count = 1,
      animated = true,
      style,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const safeCount = Math.max(1, Math.round(count))
    const showShimmer = animated && !shouldReduceMotion

    const resolvedWidth = typeof width === "number" ? `${width}px` : width
    const resolvedHeight = typeof height === "number" ? `${height}px` : height

    const renderBlock = (index: number, attachRef: boolean) => {
      const isLastMultiLine =
        safeCount > 1 && variant === "line" && index === safeCount - 1 && !width

      return (
        <div
          key={index}
          ref={attachRef ? ref : undefined}
          aria-hidden="true"
          className={cn(
            "relative overflow-hidden bg-muted/65 border border-border/35",
            variantClasses[variant],
            isLastMultiLine && "w-3/4",
            className
          )}
          style={{
            width: isLastMultiLine ? undefined : resolvedWidth,
            height: resolvedHeight,
            ...style,
          }}
          {...props}
        >
          {showShimmer && (
            <motion.span
              aria-hidden="true"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-foreground/[0.06] to-transparent"
            />
          )}
        </div>
      )
    }

    if (safeCount > 1) {
      return (
        <div ref={ref} aria-hidden="true" className="w-full space-y-2">
          {Array.from({ length: safeCount }).map((_, index) =>
            renderBlock(index, false)
          )}
        </div>
      )
    }

    return renderBlock(0, true)
  }
)
Skeleton.displayName = "Skeleton"

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  animated?: boolean
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, animated = true, className, ...props }, ref) => {
    const safeLines = Math.max(1, Math.round(lines))

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("w-full space-y-2.5", className)}
        {...props}
      >
        {Array.from({ length: safeLines }).map((_, idx) => {
          const isLast = safeLines > 1 && idx === safeLines - 1
          const isSecondLast = safeLines > 2 && idx === safeLines - 2
          return (
            <Skeleton
              key={idx}
              variant="line"
              animated={animated}
              className={cn(
                "h-3.5",
                isLast ? "w-2/3" : isSecondLast ? "w-5/6" : "w-full"
              )}
            />
          )
        })}
      </div>
    )
  }
)
SkeletonText.displayName = "SkeletonText"

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
  animated?: boolean
}

const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 4, columns = 3, animated = true, className, ...props }, ref) => {
    const safeRows = Math.max(1, Math.round(rows))
    const safeCols = Math.max(1, Math.round(columns))

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "w-full rounded-xl border border-border bg-card overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className="grid gap-3 px-4 py-3 bg-muted/35 border-b border-border"
          style={{ gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeCols }).map((_, cIdx) => (
            <Skeleton
              key={cIdx}
              variant="line"
              animated={animated}
              className="h-3 w-2/3"
            />
          ))}
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: safeRows }).map((_, rIdx) => (
            <div
              key={rIdx}
              className="grid gap-3 px-4 py-3 items-center"
              style={{
                gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: safeCols }).map((_, cIdx) => (
                <Skeleton
                  key={cIdx}
                  variant="line"
                  animated={animated}
                  className={cn(
                    "h-3.5",
                    cIdx === safeCols - 1 ? "w-1/2 ml-auto" : "w-4/5"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
SkeletonTable.displayName = "SkeletonTable"

export interface SkeletonMetricCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean
}

const SkeletonMetricCard = React.forwardRef<
  HTMLDivElement,
  SkeletonMetricCardProps
>(({ animated = true, className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "w-full rounded-xl border border-border bg-card p-4 space-y-3",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-between gap-2">
      <Skeleton variant="line" animated={animated} className="h-3 w-24" />
      <Skeleton variant="rect" animated={animated} className="h-5 w-12 rounded-full" />
    </div>
    <Skeleton variant="rect" animated={animated} className="h-7 w-28" />
    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
      <Skeleton variant="line" animated={animated} className="h-3 w-20" />
      <Skeleton variant="line" animated={animated} className="h-3 w-10" />
    </div>
  </div>
))
SkeletonMetricCard.displayName = "SkeletonMetricCard"

export { Skeleton, SkeletonText, SkeletonTable, SkeletonMetricCard }
