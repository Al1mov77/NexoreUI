"use client"

import * as React from "react"
import { motion, useInView, HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

/**
 * Props for the BlurFade component
 */
export interface BlurFadeProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /**
   * Children components to animate
   */
  children: React.ReactNode
  /**
   * Animation delay in seconds
   * @default 0
   */
  delay?: number
  /**
   * Animation duration in seconds
   * @default 0.4
   */
  duration?: number
  /**
   * Y axis offset translation on start
   * @default 6
   */
  yOffset?: number
  /**
   * Start blur level (CSS blur radius value)
   * @default "4px"
   */
  blur?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to animate based on viewport entry
   * @default true
   */
  inView?: boolean
  /**
   * Trigger animation only once
   * @default true
   */
  once?: boolean
  /**
   * Viewport margin threshold for in-view trigger
   * @default "-50px"
   */
  margin?: string
}

/**
 * BlurFade animates elements with a smooth blur and fade transition as they enter the viewport.
 */
const BlurFade = React.forwardRef<HTMLDivElement, BlurFadeProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.4,
      yOffset = 6,
      blur = "4px",
      className,
      inView = true,
      once = true,
      margin = "-50px",
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef
    
    // Check if element is in view (if requested)
    type UseInViewOptions = NonNullable<Parameters<typeof useInView>[1]>
    const isInView = useInView(combinedRef, { once, margin: margin as UseInViewOptions["margin"] })
    const animateState = inView ? (isInView ? "visible" : "hidden") : "visible"

    const variants = {
      hidden: {
        y: yOffset,
        opacity: 0,
        filter: `blur(${blur})`,
      },
      visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
      },
    }

    return (
      <motion.div
        ref={combinedRef}
        initial="hidden"
        animate={animateState}
        variants={variants}
        transition={{
          delay,
          duration,
          ease: [0.25, 0.4, 0.25, 1.0], // smooth cubic-bezier physics feel
        }}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

BlurFade.displayName = "BlurFade"

export { BlurFade }
