"use client"

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
    if (shouldReduceMotion) return
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
  delay = 500,
}: AnimatedListProps) {
  const [items, setItems] = React.useState<React.ReactNode[]>([])
  const childArray = React.Children.toArray(children)

  React.useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < childArray.length) {
        setItems((prev) => [...prev, childArray[i]])
        i++
      } else {
        clearInterval(timer)
      }
    }, delay)
    return () => clearInterval(timer)
  }, []) 

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export { BlurFade, type BlurFadeProps } from "./blur-fade"

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
      className={cn(
        "group relative w-36 cursor-pointer overflow-hidden rounded-full border border-border bg-background p-2.5 text-center font-medium text-sm transition-colors duration-200",
        className
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-200 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:rounded-none" />
    </button>
  )
}

export interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string
  duration?: string
  className?: string
}

export function PulsatingButton({
  className,
  children,
  pulseColor = "hsl(var(--primary))",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <button
      className={cn(
        "relative text-center cursor-pointer flex justify-center items-center rounded-lg text-primary-foreground bg-primary px-4 py-2 text-sm font-medium shadow-xs hover:bg-primary/90 transition-colors",
        className
      )}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      {!shouldReduceMotion && (
        <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      )}
    </button>
  )
}

export interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-primary/20 bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface CoolModeProps {
  children: React.ReactElement
  className?: string
}

export function CoolMode({ children, className }: CoolModeProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      {children}
    </div>
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
  boxColor = "hsl(var(--primary))",
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
  spread = 2,
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
        backgroundImage: `linear-gradient(
          110deg,
          hsl(var(--foreground)) 35%,
          hsl(var(--primary)) ${50 - spread}%,
          hsl(var(--primary)) ${50 + spread}%,
          hsl(var(--foreground)) 65%
        )`,
        backgroundSize: "250% 100%",
        animationDuration: `${duration}s`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}
