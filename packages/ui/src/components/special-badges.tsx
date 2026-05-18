"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"
import { Badge, badgeVariants } from "./badge"
import { VariantProps } from "class-variance-authority"

// 1. GlowBadge
export function GlowBadge({ className, variant, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <div className="relative inline-flex group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
      <Badge className={cn("relative", className)} variant={variant} {...props} />
    </div>
  )
}

// 2. GlassBadge
export function GlassBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={cn(
        "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20",
        className
      )}
      {...props}
    />
  )
}

// 3. DotBadge
interface DotBadgeProps extends React.ComponentProps<typeof Badge> {
  dotColor?: string
}
export function DotBadge({ className, dotColor = "bg-green-500", children, ...props }: DotBadgeProps) {
  return (
    <Badge className={cn("pl-2.5", className)} variant="outline" {...props}>
      <span className={cn("mr-1.5 flex h-2 w-2 rounded-full", dotColor)} />
      {children}
    </Badge>
  )
}

// 4. GradientBadge
export function GradientBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={cn(
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:opacity-90",
        className
      )}
      {...props}
    />
  )
}

// 5. OutlineGlowBadge
export function OutlineGlowBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-primary text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(var(--color-primary),0.3)]",
        className
      )}
      {...props}
    />
  )
}

// 6. AnimatedBadge (Pulsing)
export function PulseBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="inline-block"
    >
      <Badge className={className} {...props} />
    </motion.div>
  )
}

// 7. SoftBadge
export function SoftBadge({ className, variant = "default", ...props }: React.ComponentProps<typeof Badge>) {
  const softClasses = {
    default: "bg-primary/10 text-primary hover:bg-primary/20 border-transparent",
    secondary: "bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 border-transparent",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent",
    outline: "",
    ghost: ""
  }[variant as string] || ""

  return (
    <Badge className={cn(softClasses, className)} variant="outline" {...props} />
  )
}

// 8. TagBadge (with closing 'x')
export function TagBadge({ className, children, onRemove, ...props }: React.ComponentProps<typeof Badge> & { onRemove?: () => void }) {
  return (
    <Badge className={cn("pr-1", className)} {...props}>
      {children}
      <button
        type="button"
        className="ml-1 rounded-full p-0.5 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          onRemove?.()
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </Badge>
  )
}

// 9. PremiumBadge
export function PremiumBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={cn(
        "bg-gradient-to-br from-amber-200 to-yellow-500 text-black border border-yellow-300 shadow-sm font-semibold",
        className
      )}
      {...props}
    />
  )
}

// 10. MinimalBadge
export function MinimalBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={cn(
        "bg-transparent border-b-2 border-b-primary rounded-none px-1 py-0 text-foreground hover:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}
