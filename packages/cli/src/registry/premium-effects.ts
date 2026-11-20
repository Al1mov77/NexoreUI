export const premiumEffects = {
  name: "premium-effects",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion"
],
  
  fileName: "premium-effects.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

export interface GlowSpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowColor?: string
  glowSize?: number
}

export const GlowSpotlightCard = React.forwardRef<HTMLDivElement, GlowSpotlightCardProps>(
  ({ children, className, glowColor = "color-mix(in srgb, var(--primary) 16%, transparent)", glowSize = 300, ...props }, ref) => {
    const [pos, setPos] = React.useState({ x: 0, y: 0 })

    const handleMouseMove = React.useCallback(
      ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = currentTarget.getBoundingClientRect()
        setPos({ x: clientX - left, y: clientY - top })
      },
      []
    )

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow duration-300 hover:shadow-sm",
          className
        )}
        {...props}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: \`radial-gradient(\${glowSize}px circle at \${pos.x}px \${pos.y}px, \${glowColor}, transparent 80%)\`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
GlowSpotlightCard.displayName = "GlowSpotlightCard"

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
  duration = 0.4,
  ...props
}: WordFadeRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const words = text.split(" ")

  return (
    <h3 className={cn("flex flex-wrap justify-center gap-x-1.5", className)} {...props}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: shouldReduceMotion ? 0 : delay + i * delayMultiple,
            duration: shouldReduceMotion ? 0 : duration,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h3>
  )
}

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
  strokeColor = "color-mix(in srgb, var(--border) 60%, transparent)",
  cellFlashColor = "color-mix(in srgb, var(--primary) 14%, transparent)",
  flashInterval = 1000,
  maxFlashes = 4,
  className,
  ...props
}: AnimatedGridBackgroundProps) {
  const shouldReduceMotion = useReducedMotion()
  const id = React.useId().replace(/:/g, "")
  const [flashingCells, setFlashingCells] = React.useState<{ x: number; y: number; id: number }[]>([])

  React.useEffect(() => {
    if (shouldReduceMotion) return

    const timer = setInterval(() => {
      setFlashingCells((prev) => {
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
  }, [width, height, flashInterval, maxFlashes, shouldReduceMotion])

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
            d={\`M \${width} 0 L 0 0 0 \${height}\`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={\`url(#\${id})\`} />
      {!shouldReduceMotion && (
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
      )}
    </svg>
  )
}

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

export interface BentoCardProps extends HTMLMotionProps<"div"> {
  title: string
  description: string
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  span?: string
  delay?: number
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
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : delay, duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/10 p-6 transition-all duration-200 hover:shadow-sm hover:border-primary/20",
        span,
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-tr from-primary/5 via-transparent to-transparent" />

      {header && <div className="w-full overflow-hidden rounded-lg mb-4">{header}</div>}

      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary transition-transform duration-200 group-hover:scale-105">{icon}</div>}
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
`
};
