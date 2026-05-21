"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. MorphingText — Text morphing between values
// ============================================
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
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)
    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// ============================================
// 2. AnimatedList — Animated notification list
// ============================================
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// 3. BlurFade Re-export
// ============================================
export { BlurFade, type BlurFadeProps } from "./blur-fade"

// ============================================
// 4. InteractiveHoverButton — Button with expanding hover
// ============================================
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
        "group relative w-32 cursor-pointer overflow-hidden rounded-full border border-border bg-background p-2 text-center font-semibold transition-colors duration-300",
        className
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:rounded-none" />
    </button>
  )
}

// ============================================
// 5. PulsatingButton — Button with pulsating ring
// ============================================
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
  return (
    <button
      className={cn(
        "relative text-center cursor-pointer flex justify-center items-center rounded-lg text-white bg-primary px-4 py-2",
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
      <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse-ring -translate-x-1/2 -translate-y-1/2" />
    </button>
  )
}

// ============================================
// 6. RainbowButton — Button with rainbow gradient border
// ============================================
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
        "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",
        "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(30,100%,63%),hsl(60,100%,63%),hsl(120,100%,63%),hsl(180,100%,63%),hsl(240,100%,63%),hsl(300,100%,63%),hsl(360,100%,63%))]",
        "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(30,100%,63%),hsl(60,100%,63%),hsl(120,100%,63%),hsl(180,100%,63%),hsl(240,100%,63%),hsl(300,100%,63%),hsl(360,100%,63%))]",
        "dark:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ============================================
// 7. CoolMode — Particles burst on click
// ============================================
export interface CoolModeProps {
  children: React.ReactElement
  className?: string
}

export function CoolMode({ children, className }: CoolModeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const count = 15

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div")
      const size = Math.random() * 8 + 4
      const angle = (Math.PI * 2 * i) / count
      const velocity = Math.random() * 80 + 40

      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all ${0.5 + Math.random() * 0.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `

      containerRef.current?.appendChild(particle)

      requestAnimationFrame(() => {
        particle.style.transform = `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`
        particle.style.opacity = "0"
      })

      setTimeout(() => particle.remove(), 1000)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)} onClick={handleClick}>
      {children}
    </div>
  )
}

// ============================================
// 8. WordPullUp — Words pulling up animation
// ============================================
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
  const wordArray = words.split(" ")

  return (
    <div className={cn("flex flex-wrap justify-center gap-x-2", className)}>
      {wordArray.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: i * delayMultiple,
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// ============================================
// 9. BoxReveal — Box reveal animation
// ============================================
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
  duration = 0.5,
  delay = 0,
}: BoxRevealProps) {
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

// ============================================
// 10. TextShimmer — Text with color shimmer
// ============================================
export interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  duration?: number
  spread?: number
}

export function TextShimmer({
  children,
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-flex animate-text-shimmer bg-clip-text text-transparent",
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
