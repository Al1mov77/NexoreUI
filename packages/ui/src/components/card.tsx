'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, useReducedMotion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-xl text-card-foreground transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-border bg-card text-card-foreground shadow-xs hover:border-foreground/20 hover:shadow-sm",
        glass: "backdrop-blur-md bg-card/80 border border-border shadow-xs",
        gradient: "bg-card border border-border shadow-xs hover:border-foreground/20",
        glow: "bg-card border border-border shadow-xs hover:border-foreground/25",
        // New variants
        bento: "border border-border bg-card text-card-foreground shadow-xs hover:border-foreground/20 relative",
        spotlight: "border border-border bg-card text-card-foreground relative hover:border-foreground/20",
        flip: "bg-transparent border-0 shadow-none overflow-visible relative",
        tilt: "border border-border bg-card text-card-foreground shadow-xs",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-sm",
        glow: "hover:border-foreground/25 hover:shadow-xs",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    }
  }
)

/**
 * Props for the Card component
 */
export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether to enable hover spring animations
   * @default true
   */
  animate?: boolean;
  /**
   * Back content displayed when using the `flip` variant on hover
   */
  backContent?: React.ReactNode;
  /**
   * Custom radial spotlight background color (e.g., rgba(var(--primary-rgb), 0.06))
   * @default "rgba(var(--primary-rgb), 0.06)"
   */
  spotlightColor?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      hover,
      animate = true,
      backContent,
      spotlightColor = "rgba(var(--primary-rgb), 0.06)",
      children,
      ...props
    },
    ref
  ) => {
    // Feature toggles based on variants
    const isSpotlight = variant === "spotlight";
    const isFlip = variant === "flip";
    const isTilt = variant === "tilt";

    // Spotlight mouse tracking state
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const handleMouseMoveSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSpotlight) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      setMousePos({ x: clientX - left, y: clientY - top });
    };

    // Tilt mouse tracking state
    const [tiltPos, setTiltPos] = React.useState({ rotateX: 0, rotateY: 0 });
    const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTilt) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const maxTilt = 12; // degrees max rotation
      const rotateX = ((y - height / 2) / (height / 2)) * -maxTilt;
      const rotateY = ((x - width / 2) / (width / 2)) * maxTilt;
      setTiltPos({ rotateX, rotateY });
    };

    const handleMouseLeaveTilt = () => {
      if (!isTilt) return;
      setTiltPos({ rotateX: 0, rotateY: 0 });
    };

    // Flip card hover state
    const [isFlipped, setIsFlipped] = React.useState(false);

    // Destructure custom props to avoid DOM validation warnings
    const { ...htmlProps } = props;

    // Flip Variant Render
    if (isFlip) {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, hover, className }), "perspective-1000 w-full h-full")}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          <motion.div
            className="relative w-full h-full transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {/* Front Face */}
            <div className="absolute inset-0 backface-hidden border bg-card text-card-foreground rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
              {children}
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 border bg-linear-to-br from-primary/10 to-primary/5 text-card-foreground rounded-xl shadow-sm flex flex-col p-6 items-center justify-center text-center overflow-hidden">
              {backContent || (
                <div className="text-sm font-medium text-muted-foreground">
                  Flip side content placeholder
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    // Spotlight Variant Render Extra Element
    const spotlightEffect = isSpotlight && (
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
    );

    // Build the resolved element attributes
    const cardClass = cn(cardVariants({ variant, hover: isFlip || isTilt ? "none" : hover, className }), isSpotlight && "group");

    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = (animate && !shouldReduceMotion) || isTilt;

    if (shouldAnimate) {
      return (
        <motion.div
          ref={ref}
          className={cardClass}
          onMouseMove={(e) => {
            if (isSpotlight) handleMouseMoveSpotlight(e);
            if (isTilt) handleMouseMoveTilt(e);
          }}
          onMouseLeave={() => {
            if (isTilt) handleMouseLeaveTilt();
          }}
          animate={
            isTilt
              ? { rotateX: tiltPos.rotateX, rotateY: tiltPos.rotateY }
              : undefined
          }
          whileHover={isTilt ? undefined : { scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
        >
          {spotlightEffect}
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClass}
        {...props}
      >
        {children}
      </div>
    );
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
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-[-0.035em] text-xl text-foreground [text-wrap:balance]", className)}
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
    className={cn("text-sm text-muted-foreground leading-relaxed mt-1", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 leading-relaxed text-sm text-foreground/90", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-border/10 mt-auto", className)}
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
);
GlassCard.displayName = "GlassCard";

export const GlowCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glow" {...props}>
      {children}
    </Card>
  )
);
GlowCard.displayName = "GlowCard";

export const GradientCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="gradient" {...props}>
      {children}
    </Card>
  )
);
GradientCard.displayName = "GradientCard";

export const HoverCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} hover="lift" {...props}>
      {children}
    </Card>
  )
);
HoverCard.displayName = "HoverCard";

export const SpotlightCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="spotlight" {...props}>
      {children}
    </Card>
  )
);
SpotlightCard.displayName = "SpotlightCard";




