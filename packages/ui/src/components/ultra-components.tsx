"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. Marquee, NumberTicker, and TypingAnimation Re-exports
// ============================================
export { Marquee, type MarqueeProps } from "./marquee"
export { NumberTicker, type NumberTickerProps } from "./number-ticker"
export { TypingAnimation, type TypingAnimationProps } from "./special-animations"

// ============================================
// 5. AnimatedGradientBorder — Animated gradient border
// ============================================
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
  duration = 3,
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative rounded-xl p-[1px]", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl",
          gradientClassName
        )}
        style={{
          background: "linear-gradient(var(--angle, 0deg), #ff0080, #7928ca, #ff0080)",
        }}
        animate={{
          "--angle": ["0deg", "360deg"],
        } as any}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className={cn("relative rounded-xl bg-background", className)}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// 6. Dock — macOS-style dock with magnify effect
// ============================================
export interface DockProps {
  items: {
    icon: React.ReactNode
    label: string
    onClick?: () => void
  }[]
  className?: string
  magnification?: number
  distance?: number
}

export function Dock({
  items,
  className,
  magnification = 60,
  distance = 140,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-14 items-end gap-3 rounded-2xl border border-border bg-background/80 px-4 pb-2 backdrop-blur-md",
        className
      )}
    >
      {items.map((item, i) => (
        <DockIcon key={i} mouseX={mouseX} magnification={magnification} distance={distance} {...item} />
      ))}
    </motion.div>
  )
}

function DockIcon({
  mouseX,
  magnification,
  distance,
  icon,
  label,
  onClick,
}: {
  mouseX: any
  magnification: number
  distance: number
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  const distanceVal = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(
    distanceVal,
    [-distance, 0, distance],
    [40, magnification, 40]
  )

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-muted/80 hover:bg-accent transition-colors"
      onClick={onClick}
      title={label}
    >
      <div className="flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {label}
      </span>
    </motion.div>
  )
}

// ============================================
// 7. AnimatedBeam — SVG beam connecting elements
// ============================================
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

// ============================================
// 8. ShinyText — Text with a shimmering highlight
// ============================================
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

// ============================================
// 9. RetroGrid — Retro perspective grid background
// ============================================
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
          className="animate-grid"
          style={{
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            height: "300vh",
            inset: "-50% 0px",
            marginLeft: "-50%",
            transformOrigin: "100% 0 0",
            width: "600vw",
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 0),
                              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 0)`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent to-90%" />
    </div>
  )
}

// ============================================
// 10. Meteors — Falling meteors animation
// ============================================
export interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const meteors = React.useMemo(() => {
    return [...Array(number)].map((_, idx) => ({
      id: idx,
      size: Math.floor(Math.random() * 2) + 1,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${(Math.random() * 2).toFixed(1)}s`,
      animationDuration: `${Math.floor(Math.random() * 8 + 5)}s`,
    }))
  }, [number])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 animate-meteor rounded-full bg-foreground/20 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            left: meteor.left,
            width: `${meteor.size}px`,
            height: `${meteor.size * 20}px`,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 w-[1px] h-full bg-gradient-to-b from-foreground/30 to-transparent" />
        </span>
      ))}
    </div>
  )
}
