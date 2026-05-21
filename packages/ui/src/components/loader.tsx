"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// Helper map for standard sizes
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
  size?: "sm" | "md" | "lg" | number
  color?: string
  text?: string
  progress?: number
  strokeWidth?: number
  className?: string
}

// 1. WifiLoader wrapper & definition
export const WifiLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const style = typeof size === "number" ? { transform: `scale(${size / 32})` } : {}
  return (
    <div 
      className={cn("flex flex-col items-center justify-end h-8 w-8 gap-1 origin-bottom", scaleClass, className)}
      style={{ ...style, color }}
    >
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-8 h-2 bg-current rounded-t-full rounded-b-sm" />
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-5 h-2 bg-current rounded-t-full rounded-b-sm" />
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-current rounded-full" />
    </div>
  )
}

// 2. HourglassLoader wrapper & definition
export const HourglassLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("inline-flex items-center justify-center", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      <motion.div 
        animate={{ rotate: 180 }} 
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 0.5 }}
        className="relative w-6 h-8 border-y-4 border-x-2 border-x-transparent flex flex-col justify-between items-center"
        style={{ borderColor: `${color} transparent ${color} transparent` }}
      >
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] opacity-50" style={{ borderTopColor: color }} />
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] opacity-50" style={{ borderBottomColor: color }} />
      </motion.div>
    </div>
  )
}

// 3. HeartbeatLoader
export const HeartbeatLoader = ({ className, color = "#ef4444", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <motion.div 
      animate={{ scale: [1, 1.2, 1, 1.3, 1] }} 
      transition={{ repeat: Infinity, duration: 1.2 }}
      className={cn("inline-block", scaleClass, className)}
    >
      <svg className="fill-current" style={{ color, width: pixelSize, height: pixelSize }} viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </motion.div>
  )
}

// 4. BoxLoader
export const BoxLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <div className={cn("relative inline-block", className)} style={{ width: pixelSize, height: pixelSize }}>
      <motion.div 
        animate={{ rotate: 360, borderRadius: ["20%", "50%", "20%"] }} 
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
        className="w-full h-full" 
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

// 5. BouncingBalls
export const BouncingBalls = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex gap-2 items-center origin-center", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      {[0, 1, 2].map(i => (
        <motion.div 
          key={i} 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

// 6. GlowRingLoader
export const GlowRingLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 30 : size === "lg" ? 50 : 40)
  return (
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
      className={cn("rounded-full border-4 border-current/25", className)} 
      style={{ 
        width: pixelSize, 
        height: pixelSize, 
        color, 
        borderTopColor: color, 
        boxShadow: `0 0 10px ${color}80` 
      }} 
    />
  )
}

// 7. LineScaleLoader
export const LineScaleLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex gap-1 items-end h-8 origin-bottom", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div 
          key={i} 
          animate={{ height: ["20%", "100%", "20%"] }} 
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} 
          className="w-1.5 rounded-full" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

// 8. ClockLoader
export const ClockLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 30 : size === "lg" ? 50 : 40)
  return (
    <div 
      className={cn("relative rounded-full border-2", className)} 
      style={{ width: pixelSize, height: pixelSize, borderColor: color }}
    >
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }} 
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full" 
        style={{ height: `${(pixelSize / 2) - 4}px`, backgroundColor: color }}
      />
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full opacity-70" 
        style={{ height: `${(pixelSize / 2) - 2}px`, backgroundColor: color }}
      />
    </div>
  )
}

// 9. BatteryLoader
export const BatteryLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex items-center origin-left", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      <div className="w-12 h-6 border-2 rounded-sm p-0.5 flex" style={{ borderColor: color }}>
        <motion.div animate={{ width: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full bg-emerald-500 rounded-sm" />
      </div>
      <div className="w-1 h-2 rounded-r-sm" style={{ backgroundColor: color }} />
    </div>
  )
}

// 10. SquareSpinLoader
export const SquareSpinLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <motion.div 
      animate={{ rotateX: [0, 180, 180, 0], rotateY: [0, 0, 180, 180] }} 
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
      className={className}
      style={{ width: pixelSize, height: pixelSize, backgroundColor: color }} 
    />
  )
}

// 11. SpinnerLoader
export function SpinnerLoader({ className, size = 24, color = "currentColor" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// 12. DotsLoader
export function DotsLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex space-x-1.5 items-center justify-center h-10 origin-center", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

// 13. PulseLoader
export function PulseLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 16 : size === "lg" ? 28 : 20)
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: pixelSize, height: pixelSize }}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full" style={{ backgroundColor: color, width: pixelSize, height: pixelSize }} />
    </div>
  )
}

// 14. BarLoader
export function BarLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex space-x-1 items-center justify-center h-10 origin-center", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
    </div>
  )
}

// 15. CircleLoader
export function CircleLoader({ className, size = 32, color = "currentColor" }: { className?: string; size?: number; color?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: color }} />
      <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-b-transparent animate-spin" style={{ borderLeftColor: color }} />
    </div>
  )
}

// 16. RingLoader
export function RingLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 40 : 1
  return (
    <div className={cn("inline-block relative w-10 h-10 origin-center", scaleClass, className)} style={{ transform: `scale(${scaleVal})` }}>
      <motion.div 
        className="absolute inset-0 rounded-full border-4 border-t-transparent"
        style={{ borderColor: `${color} transparent ${color} ${color}` }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-2 rounded-full border-4 border-b-transparent opacity-50"
        style={{ borderColor: `${color} ${color} transparent ${color}` }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

// 17. TextLoader
export function TextLoader({ text = "Loading...", className, color = "currentColor" }: { text?: string; className?: string; color?: string }) {
  return (
    <div className={cn("font-mono text-sm font-medium flex items-center gap-2", className)} style={{ color }}>
      <span>{text}</span>
      <span className="flex gap-0.5">
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>.</motion.span>
      </span>
    </div>
  )
}

// 18. ProgressRing
export function ProgressRing({ progress = 50, size = 60, strokeWidth = 4, className, color = "currentColor" }: { progress?: number; size?: number; strokeWidth?: number; className?: string; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted stroke-current opacity-20"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ color }}
        />
        <motion.circle
          className="stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference, strokeLinecap: "round", color }}
        />
      </svg>
      <span className="absolute text-xs font-semibold" style={{ color }}>{progress}%</span>
    </div>
  )
}

// 19. SkeletonCard
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("border bg-card p-4 rounded-xl space-y-3 w-full max-w-sm border-border/60", className)}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-[150px] bg-muted animate-pulse rounded" />
          <div className="h-3 w-[100px] bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-[80%] bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}

// 20. ShimmerBlock
export function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted rounded-md h-24 w-full", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ translateX: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

// Unified Loader component
export function Loader({
  variant = "dots",
  size = "md",
  color,
  text,
  progress = 50,
  strokeWidth = 4,
  className,
}: LoaderProps) {
  const activeColor = color || "currentColor"

  switch (variant) {
    case "ring":
      return <RingLoader className={className} color={activeColor} size={size} />
    case "bars":
      return <BarLoader className={className} color={activeColor} size={size} />
    case "pulse":
      return <PulseLoader className={className} color={activeColor} size={size} />
    case "spinner":
      const pixelSizeSpinner = typeof size === "number" ? size : (size === "sm" ? 18 : size === "lg" ? 36 : 24)
      return <SpinnerLoader className={className} color={activeColor} size={pixelSizeSpinner} />
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
    case "progress-ring":
      const pixelSizeProgress = typeof size === "number" ? size : (size === "sm" ? 50 : size === "lg" ? 80 : 60)
      return <ProgressRing progress={progress} size={pixelSizeProgress} strokeWidth={strokeWidth} className={className} color={activeColor} />
    case "skeleton-card":
      return <SkeletonCard className={className} />
    case "shimmer-block":
      return <ShimmerBlock className={className} />
    case "dots":
    default:
      return <DotsLoader className={className} color={activeColor} size={size} />
  }
}
