"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

/**
 * Props for the Marquee component
 */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content of the marquee
   */
  children: React.ReactNode
  /**
   * Speed of the scrolling animation (higher is faster, represented in pixels per second or duration)
   * @default 40
   */
  speed?: number
  /**
   * Direction of the scrolling
   * @default "left"
   */
  direction?: "left" | "right"
  /**
   * Whether to pause scrolling when hovering
   * @default true
   */
  pauseOnHover?: boolean
  /**
   * Gap between items in pixels
   * @default 16
   */
  gap?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Marquee component provides a smooth infinite auto-scrolling marquee of children.
 */
const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      children,
      speed = 40,
      direction = "left",
      pauseOnHover = true,
      gap = 16,
      className,
      ...props
    },
    ref
  ) => {
    // We calculate a duration based on speed
    const duration = 1000 / speed

    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn("group flex overflow-hidden p-2 select-none w-full", className)}
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
        {...props}
      >
        <motion.div
          className="flex shrink-0 min-w-full justify-around items-center"
          style={{ gap: `${gap}px` }}
          animate={{
            x: direction === "left" ? [0, `calc(-50% - ${gap / 2}px)`] : [`calc(-50% - ${gap / 2}px)`, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: duration,
            ease: "linear",
          }}
          // Dynamic control of pause using dynamic style mapping or animation controls
          // For Framer Motion, we can animate play state by using values or simple CSS animation playState
        >
          {/* We duplicate the children array multiple times to ensure seamless infinite overflow */}
          <div className="flex shrink-0 items-center justify-around" style={{ gap: `${gap}px`, animationPlayState: isHovered ? 'paused' : 'running' }}>
            {children}
          </div>
          <div className="flex shrink-0 items-center justify-around" style={{ gap: `${gap}px`, animationPlayState: isHovered ? 'paused' : 'running' }}>
            {children}
          </div>
        </motion.div>
      </div>
    )
  }
)

Marquee.displayName = "Marquee"

export { Marquee }
