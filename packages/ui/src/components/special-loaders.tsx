"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// 1. SpinnerLoader
export function SpinnerLoader({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin text-primary", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// 2. DotsLoader
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1.5 items-center", className)}>
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-primary" />
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary" />
    </div>
  )
}

// 3. PulseLoader
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-5 w-5", className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex rounded-full h-5 w-5 bg-primary"></span>
    </div>
  )
}

// 4. BarLoader
export function BarLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-4 bg-primary rounded-full origin-bottom" />
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-4 bg-primary rounded-full origin-bottom" />
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-4 bg-primary rounded-full origin-bottom" />
    </div>
  )
}

// 5. CircleLoader
export function CircleLoader({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
    </div>
  )
}

// 6. RingLoader
export function RingLoader({ className }: { className?: string }) {
  return (
    <div className={cn("inline-block relative w-10 h-10", className)}>
      <motion.div 
        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-2 rounded-full border-4 border-secondary border-b-transparent"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

// 7. TextLoader
export function TextLoader({ text = "Loading...", className }: { text?: string; className?: string }) {
  return (
    <div className={cn("font-mono text-sm font-medium flex items-center gap-2", className)}>
      <span>{text}</span>
      <span className="flex gap-0.5">
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>.</motion.span>
      </span>
    </div>
  )
}

// 8. ProgressRing
export function ProgressRing({ progress = 50, size = 60, strokeWidth = 4, className }: { progress?: number; size?: number; strokeWidth?: number; className?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="text-primary stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference, strokeLinecap: "round" }}
        />
      </svg>
      <span className="absolute text-xs font-medium">{progress}%</span>
    </div>
  )
}

// 9. SkeletonCard
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("border bg-card p-4 rounded-xl space-y-3 w-full max-w-sm", className)}>
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

// 10. ShimmerBlock
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
