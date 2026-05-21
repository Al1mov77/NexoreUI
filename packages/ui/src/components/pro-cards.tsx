"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. NeumorphicCard
// ============================================
export function NeumorphicCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl p-6 bg-background shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)]",
      className
    )}>
      {children}
    </div>
  )
}

// ============================================
// 2. GradientMeshCard
// ============================================
export function GradientMeshCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-pink-500/20 dark:from-violet-500/10 dark:to-pink-500/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 dark:bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-3xl" />
      <div className="relative p-6 border border-white/10 dark:border-white/5 rounded-2xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}

// ============================================
// 3. TiltCard — 3D tilt on hover
// ============================================
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [transform, setTransform] = React.useState("")

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(600px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale3d(1.02,1.02,1.02)`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform("")}
      className={cn("rounded-2xl border border-border bg-card p-6 transition-transform duration-200 ease-out", className)}
      style={{ transform }}
    >
      {children}
    </div>
  )
}

// ============================================
// 4. FeatureCard — Card with icon, title, desc
// ============================================
export function FeatureCard({ icon, title, description, className }: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg dark:hover:shadow-primary/5", className)}
    >
      <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ============================================
// 5. MetricCard — Stat card with trend
// ============================================
export function MetricCard({ title, value, change, changeType = "positive", className }: {
  title: string
  value: string
  change: string
  changeType?: "positive" | "negative" | "neutral"
  className?: string
}) {
  const colors = {
    positive: "text-emerald-500 bg-emerald-500/10",
    negative: "text-red-500 bg-red-500/10",
    neutral: "text-muted-foreground bg-muted",
  }
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", colors[changeType])}>{change}</span>
      </div>
    </div>
  )
}
