export const ultraEffects = {
  name: "ultra-effects",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion"
],
  fileName: "ultra-effects.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface MorphingTextProps {
  texts: string[]
  className?: string
  interval?: number
}

export function MorphingText({
  texts,
  className,
  interval = 3000,
}: MorphingTextProps) {
  const shouldReduceMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (shouldReduceMotion || texts.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)
    return () => clearInterval(timer)
  }, [texts.length, interval, shouldReduceMotion])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={shouldReduceMotion ? false : { y: 16, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={shouldReduceMotion ? undefined : { y: -16, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedList({
  children,
  className,
  delay = 400,
}: AnimatedListProps) {
  const shouldReduceMotion = useReducedMotion()
  const childArray = React.Children.toArray(children)
  const [visibleCount, setVisibleCount] = React.useState(shouldReduceMotion ? childArray.length : 1)

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setVisibleCount(childArray.length)
      return
    }
    setVisibleCount(1)
    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= childArray.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, delay)
    return () => clearInterval(timer)
  }, [childArray.length, delay, shouldReduceMotion])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence initial={!shouldReduceMotion}>
        {childArray.slice(0, visibleCount).map((item, index) => (
          <motion.div
            key={index}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  className?: string
}

export function InteractiveHoverButton({
  text = "Button",
  className,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex min-w-36 items-center justify-center cursor-pointer overflow-hidden rounded-full border border-border bg-background px-6 py-2.5 text-center font-medium text-sm text-foreground transition-colors duration-200",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-200 group-hover:translate-x-8 group-hover:opacity-0">
        <span className="h-2 w-2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-0" />
        <span>{text}</span>
      </span>
      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 -translate-x-8 text-primary-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div className="absolute inset-0 z-0 scale-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
    </button>
  )
}

export interface WordPullUpProps {
  words: string
  className?: string
  delayMultiple?: number
}

export function WordPullUp({
  words,
  className,
  delayMultiple = 0.08,
}: WordPullUpProps) {
  const shouldReduceMotion = useReducedMotion()
  const wordArray = words.split(" ")

  return (
    <div className={cn("flex flex-wrap justify-center gap-x-2", className)}>
      {wordArray.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: shouldReduceMotion ? 0 : i * delayMultiple,
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

export interface BoxRevealProps {
  children: React.ReactNode
  className?: string
  boxColor?: string
  duration?: number
  delay?: number
}

export function BoxReveal({
  children,
  className,
  boxColor = "var(--primary)",
  duration = 0.45,
  delay = 0,
}: BoxRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + duration, duration: 0.01 }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: boxColor, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{
          duration: duration * 2,
          delay,
          ease: "easeInOut",
          times: [0, 0.5, 0.5, 1],
        }}
      />
    </div>
  )
}

export interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  duration?: number
  spread?: number
}

export function TextShimmer({
  children,
  className,
  duration = 2.5,
  spread = 10,
}: TextShimmerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <span
      className={cn(
        "inline-flex bg-clip-text text-transparent",
        !shouldReduceMotion && "animate-text-shimmer",
        className
      )}
      style={{
        backgroundImage: \`linear-gradient(
          110deg,
          var(--muted-foreground) \${Math.max(10, 42 - spread)}%,
          var(--foreground) 50%,
          var(--muted-foreground) \${Math.min(90, 58 + spread)}%
        )\`,
        backgroundSize: "250% 100%",
        animationDuration: \`\${duration}s\`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}
`
};
