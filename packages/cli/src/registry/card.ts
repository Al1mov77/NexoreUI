export const card = {
  name: "card",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "framer-motion"
],
  
  fileName: "card.tsx",
  content: `"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, useReducedMotion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-xl text-card-foreground transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-border bg-card text-card-foreground shadow-xs hover:border-foreground/25 hover:shadow-sm",
        glass: "backdrop-blur-md bg-card/85 border border-border shadow-xs",
        gradient: "bg-card border border-border shadow-xs hover:border-foreground/25",
        glow: "bg-card border border-border shadow-xs hover:border-foreground/30",
        bento: "border border-border bg-card text-card-foreground shadow-xs hover:border-foreground/25 relative",
        spotlight: "border border-border bg-card text-card-foreground relative hover:border-foreground/25 shadow-xs",
        flip: "bg-transparent border-0 shadow-none overflow-visible relative",
        tilt: "border border-border bg-card text-card-foreground shadow-xs",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-0.5 hover:shadow-sm",
        glow: "hover:border-foreground/30 hover:shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    },
  }
)

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof cardVariants> {
  animate?: boolean
  backContent?: React.ReactNode
  spotlightColor?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      hover,
      animate = true,
      backContent,
      spotlightColor = "rgb(var(--primary-rgb) / 0.08)",
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const isSpotlight = variant === "spotlight"
    const isFlip = variant === "flip"
    const isTilt = variant === "tilt"

    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
    const handleMouseMoveSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSpotlight) return
      const { currentTarget, clientX, clientY } = e
      const { left, top } = currentTarget.getBoundingClientRect()
      setMousePos({ x: clientX - left, y: clientY - top })
    }

    const [tiltPos, setTiltPos] = React.useState({ rotateX: 0, rotateY: 0 })
    const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTilt || shouldReduceMotion) return
      const { currentTarget, clientX, clientY } = e
      const { left, top, width, height } = currentTarget.getBoundingClientRect()
      const x = clientX - left
      const y = clientY - top
      const maxTilt = 8
      const rotateX = ((y - height / 2) / (height / 2)) * -maxTilt
      const rotateY = ((x - width / 2) / (width / 2)) * maxTilt
      setTiltPos({ rotateX, rotateY })
    }

    const handleMouseLeaveTilt = () => {
      if (!isTilt) return
      setTiltPos({ rotateX: 0, rotateY: 0 })
    }

    const [isFlipped, setIsFlipped] = React.useState(false)

    if (isFlip) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant, hover, className }),
            "[perspective:1000px] w-full h-full min-h-[210px]"
          )}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          onClick={() => setIsFlipped((prev) => !prev)}
          {...props}
        >
          <motion.div
            className="relative w-full h-full min-h-[210px] [transform-style:preserve-3d]"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <div className="absolute inset-0 [backface-visibility:hidden] border border-border bg-card text-card-foreground rounded-xl shadow-xs flex flex-col justify-between overflow-hidden">
              {children}
            </div>

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border border-border bg-muted/60 text-card-foreground rounded-xl shadow-xs flex flex-col p-6 items-center justify-center text-center overflow-hidden">
              {backContent || (
                <div className="text-sm font-medium text-muted-foreground">
                  Flip side content
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

    const spotlightEffect = isSpotlight && (
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: \`radial-gradient(360px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
        }}
      />
    )

    const cardClass = cn(
      cardVariants({ variant, hover: isTilt ? "none" : hover, className }),
      isSpotlight && "group"
    )

    const shouldAnimate = (animate && !shouldReduceMotion) || (isTilt && !shouldReduceMotion)

    if (shouldAnimate && isTilt) {
      return (
        <motion.div
          ref={ref}
          className={cardClass}
          onMouseMove={handleMouseMoveTilt}
          onMouseLeave={handleMouseLeaveTilt}
          animate={{ rotateX: tiltPos.rotateX, rotateY: tiltPos.rotateY }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cardClass}
        onMouseMove={isSpotlight ? handleMouseMoveSpotlight : props.onMouseMove}
        {...props}
      >
        {spotlightEffect}
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-[-0.03em] text-lg text-foreground [text-wrap:balance]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 leading-relaxed text-sm text-foreground/90", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

export const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glass" {...props}>
      {children}
    </Card>
  )
)
GlassCard.displayName = "GlassCard"

export const GlowCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glow" {...props}>
      {children}
    </Card>
  )
)
GlowCard.displayName = "GlowCard"

export const GradientCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="gradient" {...props}>
      {children}
    </Card>
  )
)
GradientCard.displayName = "GradientCard"

export const HoverCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} hover="lift" {...props}>
      {children}
    </Card>
  )
)
HoverCard.displayName = "HoverCard"

export const SpotlightCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="spotlight" {...props}>
      {children}
    </Card>
  )
)
SpotlightCard.displayName = "SpotlightCard"
`
};
