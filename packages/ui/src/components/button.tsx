'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-xs",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** @deprecated Use default solid primary button instead */
        premium: "bg-primary text-primary-foreground border border-foreground/10 hover:bg-primary/90 shadow-xs",
        /** @deprecated Use outline or secondary button instead */
        neon: "bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground shadow-xs",
        /** @deprecated Use secondary or ghost button instead */
        glass: "backdrop-blur-md bg-secondary/80 border border-border text-foreground hover:bg-accent shadow-xs",
        /** @deprecated Use default button; prop shimmer is supported across variants */
        shimmer: "relative overflow-hidden bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        /** @deprecated Use secondary or default button instead */
        gradient: "bg-secondary text-secondary-foreground border border-border hover:bg-accent shadow-xs",
        /** @deprecated Glow is deprecated; renders solid default button with shadow-sm */
        glow: "bg-primary text-primary-foreground border border-primary/20 shadow-sm hover:bg-primary/90",
        /** @deprecated Magnetic motion behavior is preserved with monochrome styling */
        magnetic: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        loading: "bg-primary/80 text-primary-foreground/80 pointer-events-none cursor-wait",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Props for the Button component
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 
   * Enable hover/tap spring motion animation
   * @default true 
   */
  animate?: boolean;
  /** 
   * Enable shimmer light animation effect
   * @default false
   */
  shimmer?: boolean;
  /** 
   * Enable neon glow effect
   * @default false
   */
  glow?: boolean;
  /** 
   * Display loading spinner icon and disable actions
   * @default false
   */
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animate = true,
      shimmer = false,
      glow = false,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const isShimmer = variant === 'shimmer' || shimmer;
    const isMagnetic = variant === 'magnetic';
    const isGlow = variant === 'glow' || glow;

    // Track mouse coords for magnetic hover movement
    const [magneticPos, setMagneticPos] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isMagnetic) return;
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      // spring weight multiplier
      setMagneticPos({ x: x * 0.35, y: y * 0.35 });
    };

    const handleMouseLeave = () => {
      if (!isMagnetic) return;
      setMagneticPos({ x: 0, y: 0 });
    };

    const buttonContent = (
      <>
        {isShimmer && (
          <motion.div
            className="absolute inset-0 w-[200%] bg-linear-to-r from-transparent via-foreground/10 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2.2,
              ease: 'linear',
            }}
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="animate-spin h-4 w-4 shrink-0" />}
          {children}
        </span>
      </>
    );

    const activeVariant = isLoading ? "loading" : variant;

    // Disable button if loading
    const disabledState = props.disabled || isLoading;

    // Setup base styles
    const resolvedClassName = cn(
      buttonVariants({ variant: activeVariant, size, className }),
      isShimmer && "relative overflow-hidden"
    );

    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = animate && !shouldReduceMotion;

    if (!shouldAnimate) {
      return (
        <button
          ref={ref}
          disabled={disabledState}
          className={resolvedClassName}
          {...props}
        >
          {buttonContent}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabledState}
        className={resolvedClassName}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={isMagnetic ? { x: magneticPos.x, y: magneticPos.y } : undefined}
        whileHover={{
          scale: isMagnetic ? 1.01 : 1.015,
          y: isMagnetic ? 0 : -1,
        }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

// ----------------------------------------------------
// Deprecated button wrappers for backward compatibility
// ----------------------------------------------------

/**
 * @deprecated Use the unified `<Button variant="neon">` instead.
 */
export const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="neon" glow={true} {...props}>
      {children}
    </Button>
  )
);
NeonButton.displayName = "NeonButton";

/**
 * @deprecated Use custom styles or class variance utilities on the unified `<Button>` instead.
 */
export const ThreeDButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "shadow-[0_5px_0_hsl(var(--primary-dark,240_5.9%_30%))] hover:shadow-[0_2px_0_hsl(var(--primary-dark,240_5.9%_30%))] active:translate-y-0.75 active:shadow-[0_0px_0_transparent] transition-all",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
ThreeDButton.displayName = "ThreeDButton";

/**
 * @deprecated Use custom ripple animations on the unified `<Button>` instead.
 */
export const RippleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "relative overflow-hidden group active:scale-95 transition-transform",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 bg-white/20 scale-0 rounded-full group-active:scale-[2] transition-transform duration-500 origin-center"></span>
      <span className="relative z-10">{children}</span>
    </Button>
  )
);
RippleButton.displayName = "RippleButton";

/**
 * @deprecated Use standard utility classes on the unified `<Button>` instead.
 */
export const CyberpunkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "bg-foreground text-background font-mono font-bold uppercase tracking-widest border-2 border-foreground hover:bg-background hover:text-foreground transition-colors shadow-[3px_3px_0_0_currentColor] rounded-none",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
CyberpunkButton.displayName = "CyberpunkButton";

/**
 * @deprecated Use the unified `<Button variant="magnetic">` instead.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="magnetic" {...props}>
      {children}
    </Button>
  )
);
MagneticButton.displayName = "MagneticButton";

/**
 * @deprecated Use the unified `<Button variant="shimmer">` instead.
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="shimmer" shimmer={true} {...props}>
      {children}
    </Button>
  )
);
ShimmerButton.displayName = "ShimmerButton";

/**
 * @deprecated Use a custom hover effect on the unified `<Button>` instead.
 */
export const BorderBeamButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "relative overflow-hidden border border-border group",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      <span className="relative z-10">{children}</span>
    </Button>
  )
);
BorderBeamButton.displayName = "BorderBeamButton";

/**
 * @deprecated Use the unified `<Button isLoading={...}>` instead.
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps & { isLoading?: boolean }>(
  ({ children, isLoading = true, ...props }, ref) => (
    <Button ref={ref} isLoading={isLoading} {...props}>
      {children}
    </Button>
  )
);
LoadingButton.displayName = "LoadingButton";

/**
 * @deprecated Use the unified `<Button variant="destructive" glow>` instead.
 */
export const DestructiveGlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="destructive" glow={true} {...props}>
      {children}
    </Button>
  )
);
DestructiveGlowButton.displayName = "DestructiveGlowButton";

/**
 * @deprecated Use the unified `<Button variant="outline">` instead.
 */
export const GhostOutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="outline" {...props}>
      {children}
    </Button>
  )
);
GhostOutlineButton.displayName = "GhostOutlineButton";

/**
 * @deprecated Use the unified `<Button variant="glow">` instead.
 */
export const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps & { glowColor?: string }>(
  ({ children, glowColor = "rgba(var(--primary-rgb), 0.08)", className, ...props }, ref) => (
    <div className="relative group inline-block">
      <div
        className="absolute -inset-0.5 rounded-lg opacity-40 group-hover:opacity-75 transition duration-500"
        style={{ backgroundColor: glowColor }}
      />
      <Button ref={ref} className={cn("relative bg-background", className)} {...props}>
        {children}
      </Button>
    </div>
  )
);
GlowButton.displayName = "GlowButton";

/**
 * @deprecated Use the unified `<Button shimmer>` instead.
 */
export const ShinyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} shimmer={true} {...props}>
      {children}
    </Button>
  )
);
ShinyButton.displayName = "ShinyButton";

/**
 * @deprecated Use the unified `<Button variant="gradient">` instead.
 */
export const GradientButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="gradient" {...props}>
      {children}
    </Button>
  )
);
GradientButton.displayName = "GradientButton";

/**
 * @deprecated Use the unified `<Button variant="glass">` instead.
 */
export const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="glass" {...props}>
      {children}
    </Button>
  )
);
GlassButton.displayName = "GlassButton";

