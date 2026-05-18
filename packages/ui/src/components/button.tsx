'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
        destructive: "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New WOW Variants
        premium: "bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30",
        neon: "bg-background border-2 border-primary text-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.7)]",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-black/30 shadow-lg",
        shimmer: "relative overflow-hidden bg-slate-900 text-white dark:bg-white dark:text-black",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Enable hover/tap motion animation @default true */
  animate?: boolean;
  /** Enable shimmer light effect across the button */
  shimmer?: boolean;
  /** Enable neon glow effect */
  glow?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animate = true, shimmer = false, glow = false, children, ...props }, ref) => {
    
    const isShimmer = variant === 'shimmer' || shimmer;

    const buttonContent = (
      <>
        {isShimmer && (
          <motion.div
            className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2,
              ease: 'linear',
            }}
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </>
    );

    if (!animate) {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }), isShimmer && "relative overflow-hidden")}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </button>
      );
    }

    // Destructure HTML-only event handlers that shouldn't go to motion.button
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props;

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ 
          scale: 1.03,
          y: -1,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        {...motionSafeProps as HTMLMotionProps<"button">}
      >
        {buttonContent}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
