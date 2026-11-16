export const blurFade = {
  name: "blur-fade",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion"
],
  
  fileName: "blur-fade.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

export interface BlurFadeProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  blur?: string
  className?: string
  inView?: boolean
  once?: boolean
  margin?: string
}

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
    const shouldReduceMotion = useReducedMotion()
    const localRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef

    type UseInViewOptions = NonNullable<Parameters<typeof useInView>[1]>
    const isInView = useInView(combinedRef, { once, margin: margin as UseInViewOptions["margin"] })
    const animateState = inView ? (isInView ? "visible" : "hidden") : "visible"

    const variants = shouldReduceMotion
      ? {
          hidden: { y: 0, opacity: 1, filter: "none" },
          visible: { y: 0, opacity: 1, filter: "none" },
        }
      : {
          hidden: {
            y: yOffset,
            opacity: 0,
            filter: \`blur(\${blur})\`,
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
        initial={shouldReduceMotion ? false : "hidden"}
        animate={animateState}
        variants={variants}
        transition={{
          delay: shouldReduceMotion ? 0 : delay,
          duration: shouldReduceMotion ? 0 : duration,
          ease: [0.25, 0.4, 0.25, 1.0],
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
`
};
