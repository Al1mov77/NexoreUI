"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

const sizeMap = {
  sm: "scale-75",
  md: "scale-100",
  lg: "scale-125",
}

export interface LoaderProps {
  variant?:
    | "dots"
    | "ring"
    | "bars"
    | "pulse"
    | "spinner"
    | "wifi"
    | "hourglass"
    | "heartbeat"
    | "box"
    | "clock"
    | "battery"
    | "square-spin"
    | "text"
    | "progress-ring"
    | "skeleton-card"
    | "shimmer-block"
    | "matrix"
    | "orbital"
    | "step-rail"
    | "pipeline"
  size?: "sm" | "md" | "lg" | number
  color?: string
  text?: string
  progress?: number
  strokeWidth?: number
  stages?: string[]
  paused?: boolean
  className?: string
}

export interface SubLoaderProps {
  className?: string
  color?: string
  size?: "sm" | "md" | "lg" | number
}

function resolvePixelSize(size: "sm" | "md" | "lg" | number | undefined, base = 32): number {
  if (typeof size === "number") return size
  if (size === "sm") return Math.round(base * 0.75)
  if (size === "lg") return Math.round(base * 1.25)
  return base
}

export const MatrixLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize = resolvePixelSize(size, 28)
  const cells = [
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
  ]

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-grid grid-cols-3 gap-1", className)}
      style={{ width: pixelSize, height: pixelSize, color }}
    >
      {cells.flat().map((waveDelay, idx) => (
        <motion.span
          key={idx}
          animate={
            shouldReduceMotion
              ? { opacity: waveDelay === 2 ? 1 : 0.35, scale: 1 }
              : { opacity: [0.18, 1, 0.18], scale: [0.85, 1, 0.85] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  repeat: Infinity,
                  duration: 1.25,
                  delay: waveDelay * 0.14,
                  ease: "easeInOut",
                }
          }
          className="rounded-[2px] bg-current w-full h-full"
        />
      ))}
    </div>
  )
}

export const OrbitalLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize = resolvePixelSize(size, 36)

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: pixelSize, height: pixelSize, color }}
    >
      <svg viewBox="0 0 36 36" className="w-full h-full overflow-visible" fill="none">
        <circle
          cx="18"
          cy="18"
          r="15"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeDasharray="1.5 3.5"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="24 72"
          style={{ transformOrigin: "18px 18px" }}
          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { repeat: Infinity, duration: 1.4, ease: "linear" }
          }
        />
        <motion.circle
          cx="18"
          cy="18"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.65"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="14 44"
          style={{ transformOrigin: "18px 18px" }}
          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: -360 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { repeat: Infinity, duration: 1.9, ease: "linear" }
          }
        />
      </svg>
    </div>
  )
}

export const StepRailLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const widthPx = resolvePixelSize(size, 64)

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative inline-flex items-center h-2 rounded-full border border-border bg-muted/60 overflow-hidden p-0.5",
        className
      )}
      style={{ width: widthPx, color }}
    >
      <motion.span
        animate={shouldReduceMotion ? { x: "35%" } : { x: ["-10%", "145%", "-10%"] }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }
        className="h-full w-2/5 rounded-full bg-current"
      />
    </div>
  )
}

export interface PipelineLoaderProps {
  stages?: string[]
  intervalMs?: number
  paused?: boolean
  color?: string
  className?: string
}

const defaultPipelineStages = [
  "Resolving workspace tokens",
  "Building registry manifest",
  "Verifying edge checksums",
]

export const PipelineLoader = ({
  stages = defaultPipelineStages,
  intervalMs = 1800,
  paused = false,
  color = "currentColor",
  className,
}: PipelineLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const safeStages = stages.length > 0 ? stages : defaultPipelineStages
  const [stepIndex, setStepIndex] = React.useState(0)

  React.useEffect(() => {
    setStepIndex(0)
  }, [safeStages.length])

  React.useEffect(() => {
    if (paused || safeStages.length <= 1) return
    const id = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % safeStages.length)
    }, Math.max(500, intervalMs))
    return () => window.clearInterval(id)
  }, [paused, intervalMs, safeStages.length])

  const currentStage = safeStages[stepIndex % safeStages.length]

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs shadow-xs max-w-full",
        className
      )}
      style={{ color }}
    >
      <OrbitalLoader size={18} color="currentColor" className="shrink-0" />
      <div className="relative h-4 overflow-hidden min-w-[170px] sm:min-w-[200px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${stepIndex}-${currentStage}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" }}
            className="block truncate font-medium text-foreground"
          >
            {currentStage}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums shrink-0 border-l border-border pl-2.5">
        {String(stepIndex + 1).padStart(2, "0")}/{String(safeStages.length).padStart(2, "0")}
      </span>
    </div>
  )
}

export const WifiLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const style = typeof size === "number" ? { transform: `scale(${size / 32})` } : {}
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex flex-col items-center justify-end h-8 w-8 gap-1 origin-bottom",
        scaleClass,
        className
      )}
      style={{ ...style, color }}
    >
      <motion.div
        animate={shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
        className="w-8 h-2 bg-current rounded-t-full rounded-b-sm"
      />
      <motion.div
        animate={shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        className="w-5 h-2 bg-current rounded-t-full rounded-b-sm"
      />
      <motion.div
        animate={shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
        className="w-2 h-2 bg-current rounded-full"
      />
    </div>
  )
}

export const HourglassLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-center justify-center", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 180 }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 0.5 }}
        className="relative w-6 h-8 border-y-4 border-x-2 border-x-transparent flex flex-col justify-between items-center"
        style={{ borderTopColor: "currentColor", borderBottomColor: "currentColor" }}
      >
        <div
          className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] opacity-50"
          style={{ borderTopColor: "currentColor" }}
        />
        <div
          className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] opacity-50"
          style={{ borderBottomColor: "currentColor" }}
        />
      </motion.div>
    </div>
  )
}

export const HeartbeatLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const pixelSize =
    typeof size === "number" ? size : size === "sm" ? 24 : size === "lg" ? 40 : 32
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1, 1.22, 1] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
      className={cn("inline-block", scaleClass, className)}
      style={{ color }}
    >
      <svg
        className="fill-current"
        style={{ width: pixelSize, height: pixelSize }}
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  )
}

export const BoxLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize =
    typeof size === "number" ? size : size === "sm" ? 24 : size === "lg" ? 40 : 32
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative inline-block", className)}
      style={{ width: pixelSize, height: pixelSize, color }}
    >
      <motion.div
        animate={
          shouldReduceMotion ? {} : { rotate: 360, borderRadius: ["20%", "50%", "20%"] }
        }
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-full h-full bg-current rounded-md"
      />
    </div>
  )
}

export const BouncingBalls = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex gap-2 items-center origin-center", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.12 }}
          className="w-2.5 h-2.5 rounded-full bg-current"
        />
      ))}
    </div>
  )
}

export const GlowRingLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize =
    typeof size === "number" ? size : size === "sm" ? 28 : size === "lg" ? 44 : 36
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      animate={shouldReduceMotion ? {} : { rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.95, ease: "linear" }}
      className={cn("rounded-full border-[3px] border-muted", className)}
      style={{
        width: pixelSize,
        height: pixelSize,
        color,
        borderTopColor: "currentColor",
      }}
    />
  )
}

export const LineScaleLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex gap-1 items-end h-7 origin-bottom", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={
            shouldReduceMotion
              ? { height: `${35 + (i % 3) * 25}%` }
              : { height: ["25%", "100%", "25%"] }
          }
          transition={{ repeat: Infinity, duration: 0.95, delay: i * 0.1 }}
          className="w-1 rounded-full bg-current"
        />
      ))}
    </div>
  )
}

export const ClockLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize =
    typeof size === "number" ? size : size === "sm" ? 28 : size === "lg" ? 44 : 36
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative rounded-full border-2 border-current", className)}
      style={{ width: pixelSize, height: pixelSize, color }}
    >
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-current rounded-full"
        style={{ height: `${pixelSize / 2 - 5}px` }}
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-current opacity-65 rounded-full"
        style={{ height: `${pixelSize / 2 - 3}px` }}
      />
    </div>
  )
}

export const BatteryLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center origin-left gap-0.5", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      <div className="w-11 h-5 border-2 border-current rounded-sm p-0.5 flex">
        <motion.div
          animate={shouldReduceMotion ? { width: "65%" } : { width: ["10%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          className="h-full bg-current rounded-[1px]"
        />
      </div>
      <div className="w-1 h-2 rounded-r-sm bg-current" />
    </div>
  )
}

export const SquareSpinLoader = ({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) => {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize =
    typeof size === "number" ? size : size === "sm" ? 22 : size === "lg" ? 36 : 28
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      animate={
        shouldReduceMotion
          ? {}
          : { rotateX: [0, 180, 180, 0], rotateY: [0, 0, 180, 180] }
      }
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className={cn("rounded-sm bg-current", className)}
      style={{ width: pixelSize, height: pixelSize, color }}
    />
  )
}

export function SpinnerLoader({
  className,
  size = 24,
  color = "currentColor",
}: {
  className?: string
  size?: number
  color?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.svg
      role="status"
      aria-label="Loading"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={shouldReduceMotion ? {} : { rotate: 360 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { repeat: Infinity, duration: 0.85, ease: "linear" }
      }
      className={className}
      style={{ color }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </motion.svg>
  )
}

export function DotsLoader({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex space-x-1.5 items-center justify-center h-8 origin-center", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      {[0, 0.16, 0.32].map((delay, idx) => (
        <motion.div
          key={idx}
          animate={shouldReduceMotion ? {} : { y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ repeat: Infinity, duration: 0.7, delay, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-current"
        />
      ))}
    </div>
  )
}

export function PulseLoader({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) {
  const shouldReduceMotion = useReducedMotion()
  const pixelSize =
    typeof size === "number" ? size : size === "sm" ? 16 : size === "lg" ? 28 : 20
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: pixelSize, height: pixelSize, color }}
    >
      {!shouldReduceMotion && (
        <motion.span
          animate={{ scale: [0.85, 1.65], opacity: [0.45, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-current"
        />
      )}
      <span
        className="relative inline-flex rounded-full bg-current"
        style={{ width: Math.round(pixelSize * 0.55), height: Math.round(pixelSize * 0.55) }}
      />
    </div>
  )
}

export function BarLoader({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex space-x-1 items-center justify-center h-8 origin-center", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      {[0, 0.15, 0.3].map((delay, idx) => (
        <motion.div
          key={idx}
          animate={shouldReduceMotion ? {} : { scaleY: [0.45, 1, 0.45] }}
          transition={{ repeat: Infinity, duration: 0.85, delay, ease: "easeInOut" }}
          className="w-1 h-5 rounded-full origin-center bg-current"
        />
      ))}
    </div>
  )
}

export function CircleLoader({
  className,
  size = 32,
  color = "currentColor",
}: {
  className?: string
  size?: number
  color?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative", className)}
      style={{ width: size, height: size, color }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-current opacity-20" />
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { repeat: Infinity, duration: 0.9, ease: "linear" }
        }
        className="absolute inset-0 rounded-full border-2 border-transparent border-l-current"
      />
    </div>
  )
}

export function RingLoader({
  className,
  color = "currentColor",
  size = "md",
}: SubLoaderProps) {
  const shouldReduceMotion = useReducedMotion()
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 40 : 1
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-block relative w-10 h-10 origin-center", scaleClass, className)}
      style={{ transform: `scale(${scaleVal})`, color }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-[3px] border-current border-t-transparent"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-[3px] border-current border-b-transparent opacity-50"
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

export function TextLoader({
  text = "Loading",
  className,
  color = "currentColor",
}: {
  text?: string
  className?: string
  color?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("font-mono text-xs sm:text-sm font-medium inline-flex items-center gap-1", className)}
      style={{ color }}
    >
      <span>{text}</span>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {[0, 0.25, 0.5].map((delay, idx) => (
          <motion.span
            key={idx}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.4, delay }}
          >
            .
          </motion.span>
        ))}
      </span>
    </div>
  )
}

export function ProgressRing({
  progress = 50,
  size = 60,
  strokeWidth = 4,
  className,
  color = "currentColor",
}: {
  progress?: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const clamped = Math.min(100, Math.max(0, progress))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size, color }}
    >
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
          style={{ strokeDasharray: circumference, strokeLinecap: "round" }}
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold tabular-nums">
        {Math.round(clamped)}%
      </span>
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  const pulseClass = shouldReduceMotion ? "" : "animate-pulse"

  return (
    <div
      aria-hidden="true"
      className={cn("border border-border bg-card p-4 rounded-xl space-y-3 w-full max-w-sm", className)}
    >
      <div className="flex items-center space-x-3">
        <div className={cn("w-10 h-10 rounded-full bg-muted shrink-0", pulseClass)} />
        <div className="space-y-2 flex-1 min-w-0">
          <div className={cn("h-3.5 w-3/4 bg-muted rounded", pulseClass)} />
          <div className={cn("h-3 w-1/2 bg-muted rounded", pulseClass)} />
        </div>
      </div>
      <div className="space-y-2">
        <div className={cn("h-3.5 w-full bg-muted rounded", pulseClass)} />
        <div className={cn("h-3.5 w-4/5 bg-muted rounded", pulseClass)} />
      </div>
    </div>
  )
}

export function ShimmerBlock({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden bg-muted rounded-md h-24 w-full", className)}
    >
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/[0.07] to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      )}
    </div>
  )
}

export function Loader({
  variant = "dots",
  size = "md",
  color,
  text,
  progress = 50,
  strokeWidth = 4,
  stages,
  paused,
  className,
}: LoaderProps) {
  const activeColor = color || "currentColor"

  switch (variant) {
    case "matrix":
      return <MatrixLoader className={className} color={activeColor} size={size} />
    case "orbital":
      return <OrbitalLoader className={className} color={activeColor} size={size} />
    case "step-rail":
      return <StepRailLoader className={className} color={activeColor} size={size} />
    case "pipeline":
      return <PipelineLoader className={className} color={activeColor} stages={stages} paused={paused} />
    case "ring":
      return <RingLoader className={className} color={activeColor} size={size} />
    case "bars":
      return <BarLoader className={className} color={activeColor} size={size} />
    case "pulse":
      return <PulseLoader className={className} color={activeColor} size={size} />
    case "spinner": {
      const pixelSizeSpinner =
        typeof size === "number" ? size : size === "sm" ? 18 : size === "lg" ? 36 : 24
      return <SpinnerLoader className={className} color={activeColor} size={pixelSizeSpinner} />
    }
    case "wifi":
      return <WifiLoader className={className} color={activeColor} size={size} />
    case "hourglass":
      return <HourglassLoader className={className} color={activeColor} size={size} />
    case "heartbeat":
      return <HeartbeatLoader className={className} color={activeColor} size={size} />
    case "box":
      return <BoxLoader className={className} color={activeColor} size={size} />
    case "clock":
      return <ClockLoader className={className} color={activeColor} size={size} />
    case "battery":
      return <BatteryLoader className={className} color={activeColor} size={size} />
    case "square-spin":
      return <SquareSpinLoader className={className} color={activeColor} size={size} />
    case "text":
      return <TextLoader text={text} className={className} color={activeColor} />
    case "progress-ring": {
      const pixelSizeProgress =
        typeof size === "number" ? size : size === "sm" ? 50 : size === "lg" ? 80 : 60
      return (
        <ProgressRing
          progress={progress}
          size={pixelSizeProgress}
          strokeWidth={strokeWidth}
          className={className}
          color={activeColor}
        />
      )
    }
    case "skeleton-card":
      return <SkeletonCard className={className} />
    case "shimmer-block":
      return <ShimmerBlock className={className} />
    case "dots":
    default:
      return <DotsLoader className={className} color={activeColor} size={size} />
  }
}
