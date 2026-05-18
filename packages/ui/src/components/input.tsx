'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex h-10 w-full rounded-lg border bg-transparent px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 focus:border-white/30 dark:focus:border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-white/10",
        gradient: "border-purple-500/20 bg-background/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20",
        underline: "rounded-none border-t-0 border-x-0 border-b border-muted bg-transparent px-1 focus:border-primary focus:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  animate?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, animate = true, ...props }, ref) => {
    return (
      <motion.div
        className="relative w-full"
        initial={animate ? { opacity: 0, y: 5 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.3 }}
      >
        <input
          type={type}
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
        {variant === "gradient" && (
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 opacity-0 blur transition-opacity peer-focus:opacity-20" />
        )}
      </motion.div>
    )
  }
)
Input.displayName = "Input"

export { Input }
