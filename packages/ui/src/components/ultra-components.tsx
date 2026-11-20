"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  gradientClassName?: string
  duration?: number
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  gradientClassName,
  duration = 4,
}: AnimatedGradientBorderProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={cn("relative rounded-xl p-px", containerClassName)}>
      {!shouldReduceMotion ? (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden",
            gradientClassName
          )}
        >
          <motion.div
            className="absolute inset-[-100%]"
            style={{
              background: "conic-gradient(from 0deg, transparent 0 280deg, var(--primary) 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 rounded-xl border border-primary/40" />
      )}
      <div className={cn("relative rounded-[calc(0.75rem-1px)] bg-background", className)}>
        {children}
      </div>
    </div>
  )
}

export interface ShinyTextProps {
  children: React.ReactNode
  className?: string
  shimmerWidth?: number
}

export function ShinyText({
  children,
  className,
  shimmerWidth = 100,
}: ShinyTextProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        !shouldReduceMotion && "animate-shimmer-text",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--muted-foreground) 35%, var(--foreground) 50%, var(--muted-foreground) 65%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundSize: `${shimmerWidth * 2.5}% 100%`,
      }}
    >
      {children}
    </span>
  )
}

export interface RetroGridProps {
  className?: string
  angle?: number
}

export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]",
        className
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          style={{
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            height: "300vh",
            inset: "-50% 0px",
            marginLeft: "-50%",
            transformOrigin: "100% 0 0",
            width: "600vw",
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 0), linear-gradient(to bottom, var(--border) 1px, transparent 0)",
            opacity: 0.55,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent to-90%" />
    </div>
  )
}

export interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 10, className }: MeteorsProps) {
  const shouldReduceMotion = useReducedMotion()

  const meteors = React.useMemo(() => {
    if (shouldReduceMotion) return []
    return Array.from({ length: number }, (_, idx) => {
      const seed = ((idx + 1) * 37) % 97
      return {
        id: idx,
        size: (idx % 2) + 1,
        left: `${(seed * 100) / 97}%`,
        animationDelay: `${((idx * 0.43) % 2.4).toFixed(2)}s`,
        animationDuration: `${4 + (idx % 5)}s`,
      }
    })
  }, [number, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 animate-meteor rounded-full bg-foreground/25"
          style={{
            left: meteor.left,
            width: `${meteor.size}px`,
            height: `${meteor.size * 18}px`,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        />
      ))}
    </div>
  )
}
