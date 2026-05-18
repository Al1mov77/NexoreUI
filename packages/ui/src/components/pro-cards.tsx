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
// 2. GradientCard V2
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
// 5. PricingCardPro — Full-featured pricing card
// ============================================
export function PricingCardPro({ name, price, period = "/mo", features, popular = false, className, ctaText = "Get Started" }: {
  name: string
  price: string
  period?: string
  features: string[]
  popular?: boolean
  className?: string
  ctaText?: string
}) {
  return (
    <div className={cn(
      "relative rounded-2xl border p-6 flex flex-col",
      popular ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card",
      className
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
          Popular
        </div>
      )}
      <h4 className="font-semibold text-lg">{name}</h4>
      <div className="mt-3 mb-5">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground text-sm">{period}</span>
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>
      <button className={cn(
        "w-full py-2.5 rounded-lg font-semibold transition-colors",
        popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}>
        {ctaText}
      </button>
    </div>
  )
}

// ============================================
// 6. TestimonialCard
// ============================================
export function TestimonialCardV2({ quote, author, role, avatar, className }: {
  quote: string
  author: string
  role: string
  avatar?: string
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <svg className="w-8 h-8 text-primary/20 mb-3" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/></svg>
      <p className="text-foreground mb-4 leading-relaxed">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
          {avatar || author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 7. MetricCard — Stat card with trend
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

// ============================================
// 8. ImageOverlayCard
// ============================================
export function ImageOverlayCard({ title, subtitle, gradient = "from-black/60 to-transparent", className }: {
  title: string
  subtitle: string
  gradient?: string
  className?: string
}) {
  return (
    <div className={cn("relative h-64 rounded-2xl overflow-hidden bg-muted group cursor-pointer", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-70" />
      <div className={cn("absolute inset-0 bg-gradient-to-t", gradient)} />
      <div className="absolute bottom-0 left-0 p-5">
        <h4 className="text-white font-bold text-lg">{title}</h4>
        <p className="text-white/70 text-sm">{subtitle}</p>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </div>
  )
}

// ============================================
// 9. ProfileCardFull
// ============================================
export function ProfileCardFull({ name, role, bio, stats, className }: {
  name: string
  role: string
  bio?: string
  stats?: { label: string; value: string }[]
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card overflow-hidden", className)}>
      <div className="h-20 bg-gradient-to-r from-violet-500 to-pink-500" />
      <div className="px-5 pb-5">
        <div className="w-16 h-16 rounded-full border-4 border-card bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl -mt-8 mb-3">
          {name.charAt(0)}
        </div>
        <h4 className="font-bold text-lg">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
        {bio && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{bio}</p>}
        {stats && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-border">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 10. NotificationCard
// ============================================
export function NotificationCard({ title, message, time, type = "info", className }: {
  title: string
  message: string
  time: string
  type?: "info" | "success" | "warning" | "error"
  className?: string
}) {
  const colors = {
    info: "border-l-blue-500",
    success: "border-l-emerald-500",
    warning: "border-l-amber-500",
    error: "border-l-red-500",
  }
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 border-l-4", colors[type], className)}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
