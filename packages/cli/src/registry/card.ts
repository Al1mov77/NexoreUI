export const card = {
  name: "card",
  dependencies: [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "card.tsx",
  content: `'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-2xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground shadow-sm hover:shadow-md",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-lg",
        gradient: "bg-gradient-to-br from-violet-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5",
        glow: "bg-card border-2 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.2)]",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-lg",
        glow: "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    }
  }
)

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether to enable hover animations
   * @default true
   */
  animate?: boolean;
  /**
   * The title of the card
   */
  title?: React.ReactNode;
  /**
   * The description of the card
   */
  description?: React.ReactNode;
  /**
   * The footer content of the card
   */
  footer?: React.ReactNode;
  /**
   * An image URL to display at the top of the card
   */
  image?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps & HTMLMotionProps<"div">>(
  ({ className, variant, hover, animate = true, title, description, footer, image, children, ...props }, ref) => {
    const isCompound = !title && !description && !footer && !image;
    
    const content = isCompound ? (
      children
    ) : (
      <>
        {image && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
            <img src={image} alt={typeof title === 'string' ? title : 'Card image'} className="object-cover w-full h-full" />
          </div>
        )}
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        {children && <CardContent>{children as React.ReactNode}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </>
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, hover, className }))}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          {...props}
        >
          {content as React.ReactNode}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, className }))}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content as React.ReactNode}
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
    className="font-semibold leading-none tracking-tight text-xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
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
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`
};
