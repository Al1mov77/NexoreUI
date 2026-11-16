"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  gap?: number
  className?: string
}

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
        >
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
