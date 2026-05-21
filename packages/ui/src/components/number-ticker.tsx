"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion"
import { cn } from "../utils/cn"

/**
 * Props for the NumberTicker component
 */
export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The target numeric value to animate to
   */
  value: number
  /**
   * Duration of the animation in seconds
   * @default 2
   */
  duration?: number
  /**
   * Optional prefix to display before the number
   */
  prefix?: string
  /**
   * Optional suffix to display after the number
   */
  suffix?: string
  /**
   * Number of decimal places to show
   * @default 0
   */
  decimals?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * NumberTicker component animates a number from 0 to value when it enters the viewport.
 */
const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value,
      duration = 2,
      prefix = "",
      suffix = "",
      decimals = 0,
      className,
      ...props
    },
    ref
  ) => {
    const elementRef = React.useRef<HTMLSpanElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLSpanElement>) || elementRef
    const inView = useInView(combinedRef, { once: true, margin: "0px 0px -50px 0px" })

    // Motion value initialized to 0
    const motionValue = useMotionValue(0)

    // Spring animation for natural spring physics feel
    const springValue = useSpring(motionValue, {
      stiffness: 70,
      damping: 15,
      mass: 1,
    })

    // Transform spring output to clean formatted string
    const displayValue = useTransform(springValue, (latest) => {
      const formatted = Number(latest.toFixed(decimals))
      return formatted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    })

    React.useEffect(() => {
      if (inView) {
        // Animate the motion value from 0 to the target value
        const animation = motionValue.set(value)
      }
    }, [inView, value, motionValue])

    return (
      <span
        ref={combinedRef}
        className={cn(
          "inline-block tabular-nums text-foreground tracking-tight",
          className
        )}
        {...props}
      >
        {prefix}
        <motion.span>{displayValue}</motion.span>
        {suffix}
      </span>
    )
  }
)

NumberTicker.displayName = "NumberTicker"

export { NumberTicker }

export interface AnimatedNumberProps {
  value: number
  className?: string
  duration?: number
  formatFn?: (v: number) => string
}

export function AnimatedNumber({
  value,
  className,
  duration = 0.5,
  formatFn,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 15,
  })

  React.useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  const [displayValue, setDisplayValue] = React.useState(
    formatFn ? formatFn(value) : String(value)
  )

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (formatFn) {
        setDisplayValue(formatFn(latest))
      } else {
        setDisplayValue(String(Math.round(latest)))
      }
    })
    return () => unsubscribe()
  }, [springValue, formatFn])

  return (
    <span className={cn("inline-block tabular-nums", className)}>
      {displayValue}
    </span>
  )
}

