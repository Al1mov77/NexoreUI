"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, useSpring, HTMLMotionProps, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. GlowSpotlightCard — Cursor-tracking glowing card
// ============================================
export interface GlowSpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowColor?: string
  glowSize?: number
}

export const GlowSpotlightCard = React.forwardRef<HTMLDivElement, GlowSpotlightCardProps>(
  ({ children, className, glowColor = "rgba(139, 92, 246, 0.15)", glowSize = 300, ...props }, ref) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = React.useCallback(
      ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
      },
      [mouseX, mouseY]
    )

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md",
          className
        )}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(${glowSize}px circle at var(--x, 0px) var(--y, 0px), ${glowColor}, transparent 80%)`,
            // Custom properties injected dynamically
            WebkitMaskImage: "radial-gradient(circle, black, transparent)",
          }}
          animate={{
            opacity: [0, 1],
          }}
        />
        {/* Fallback mouse tracker using CSS variables */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={
            {
              background: `radial-gradient(${glowSize}px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent 80%)`,
              "--mouse-x": mouseX.get() + "px",
              "--mouse-y": mouseY.get() + "px",
            } as React.CSSProperties
          }
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
GlowSpotlightCard.displayName = "GlowSpotlightCard"

// ============================================
// 2. WordFadeReveal — Word-by-word fade with spring
// ============================================
export interface WordFadeRevealProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string
  delay?: number
  delayMultiple?: number
  duration?: number
}

export function WordFadeReveal({
  text,
  className,
  delay = 0,
  delayMultiple = 0.05,
  duration = 0.5,
  ...props
}: WordFadeRevealProps) {
  const words = text.split(" ")

  return (
    <h3 className={cn("flex flex-wrap justify-center gap-x-1.5", className)} {...props}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * delayMultiple,
            duration,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h3>
  )
}

// ============================================
// 3. AnimatedGridBackground — Tech grid with flashing cells
// ============================================
export interface AnimatedGridBackgroundProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  strokeWidth?: number
  strokeColor?: string
  cellFlashColor?: string
  flashInterval?: number
  maxFlashes?: number
  className?: string
}

export function AnimatedGridBackground({
  width = 40,
  height = 40,
  strokeWidth = 1,
  strokeColor = "rgba(255, 255, 255, 0.05)",
  cellFlashColor = "rgba(139, 92, 246, 0.1)",
  flashInterval = 1000,
  maxFlashes = 4,
  className,
  ...props
}: AnimatedGridBackgroundProps) {
  const id = React.useId()
  const [flashingCells, setFlashingCells] = React.useState<{ x: number; y: number; id: number }[]>([])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFlashingCells((prev) => {
        // Randomly add new flash cells and limit maximum flashing cells
        const newFlash = {
          x: Math.floor(Math.random() * 20) * width,
          y: Math.floor(Math.random() * 20) * height,
          id: Math.random(),
        }
        const filtered = prev.filter((_, idx) => idx > prev.length - maxFlashes)
        return [...filtered, newFlash]
      })
    }, flashInterval)

    return () => clearInterval(timer)
  }, [width, height, flashInterval, maxFlashes])

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full pointer-events-none select-none", className)}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x="-1"
          y="-1"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <AnimatePresence>
        {flashingCells.map((cell) => (
          <motion.rect
            key={cell.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            x={cell.x}
            y={cell.y}
            width={width - strokeWidth}
            height={height - strokeWidth}
            fill={cellFlashColor}
          />
        ))}
      </AnimatePresence>
    </svg>
  )
}

// ============================================
// 4. BentoGrid — Premium Dashboard Layout
// ============================================
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px] w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  span?: string // Tailwind grid span class: "md:col-span-2 md:row-span-2" etc
  delay?: number
  className?: string
}

export function BentoCard({
  title,
  description,
  header,
  icon,
  children,
  span = "md:col-span-1",
  className,
  delay = 0,
  ...props
}: BentoCardProps) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/10 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20",
        span,
        className
      )}
      {...(motionSafeProps as HTMLMotionProps<"div">)}
    >
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />

      {header && <div className="w-full overflow-hidden rounded-lg mb-4">{header}</div>}

      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary transition-transform duration-300 group-hover:scale-110">{icon}</div>}
          <h3 className="font-semibold tracking-tight text-card-foreground text-sm md:text-base">
            {title}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground max-w-[220px]">
          {description}
        </p>
      </div>

      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  )
}
