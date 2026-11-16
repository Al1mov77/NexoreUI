export const numberTicker = {
  name: "number-ticker",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion"
],
  
  fileName: "number-ticker.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion"
import { cn } from "../utils/cn"

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

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

    const motionValue = useMotionValue(0)

    const springValue = useSpring(motionValue, {
      stiffness: 70,
      damping: 15,
      mass: 1,
    })

    const displayValue = useTransform(springValue, (latest) => {
      const formatted = Number(latest.toFixed(decimals))
      return formatted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    })

    React.useEffect(() => {
      if (inView) {
        motionValue.set(value)
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
  duration: _duration = 0.5,
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

`
};
