"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export { Marquee, type MarqueeProps } from "./marquee"
export { NumberTicker, type NumberTickerProps } from "./number-ticker"
export { TypingAnimation, type TypingAnimationProps } from "./special-animations"

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
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,hsl(var(--primary))_360deg)]"
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
      <div className={cn("relative rounded-xl bg-background", className)}>
        {children}
      </div>
    </div>
  )
}

export interface AnimatedBeamProps {
  className?: string
  children: React.ReactNode
}

export function AnimatedBeam({ className, children }: AnimatedBeamProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
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
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "bg-[length:250%_100%] animate-shimmer-text",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(110deg, currentColor 35%, rgba(255,255,255,0.8) 50%, currentColor 65%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        backgroundSize: `${shimmerWidth * 3}% 100%`,
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
            backgroundImage: `linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 0),
                              linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 0)`,
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
    return [...Array(number)].map((_, idx) => ({
      id: idx,
      size: Math.floor(Math.random() * 2) + 1,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${(Math.random() * 2).toFixed(1)}s`,
      animationDuration: `${Math.floor(Math.random() * 6 + 4)}s`,
    }))
  }, [number, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 animate-meteor rounded-full bg-foreground/20 shadow-xs"
          style={{
            left: meteor.left,
            width: `${meteor.size}px`,
            height: `${meteor.size * 18}px`,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 w-px h-full bg-linear-to-b from-foreground/30 to-transparent" />
        </span>
      ))}
    </div>
  )
}
