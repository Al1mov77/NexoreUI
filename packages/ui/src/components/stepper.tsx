"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "../utils/cn"

export interface StepItem {
  title: string
  description?: string
  icon?: React.ReactNode
}

export type StepperVariant = "default" | "circles" | "arrows"
export type StepperSize = "sm" | "md" | "lg"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[]
  currentStep: number
  orientation?: "horizontal" | "vertical"
  variant?: StepperVariant
  size?: StepperSize
  onStepClick?: (stepIndex: number) => void
  className?: string
}

const circleSizes: Record<StepperSize, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-[13px]",
  lg: "h-11 w-11 text-[15px]",
}

const checkSizes: Record<StepperSize, string> = {
  sm: "h-3.5 w-3.5 stroke-[2.5]",
  md: "h-4 w-4 stroke-[2.5]",
  lg: "h-5 w-5 stroke-[2.5]",
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = "horizontal",
      variant = "default",
      size = "md",
      onStepClick,
      className,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const isVertical = orientation === "vertical"
    const isInteractive = Boolean(onStepClick)

    if (isVertical) {
      return (
        <div
          ref={ref}
          role="list"
          className={cn("flex flex-col w-full select-none", className)}
          {...props}
        >
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep
            const isActive = idx === currentStep
            const isLast = idx === steps.length - 1

            return (
              <div key={idx} role="listitem" className="flex items-stretch gap-3.5 group">
                <div className="flex flex-col items-center shrink-0">
                  <motion.button
                    type="button"
                    disabled={!isInteractive}
                    aria-label={`Step ${idx + 1}: ${step.title}`}
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => onStepClick?.(idx)}
                    whileHover={isInteractive && !shouldReduceMotion ? { scale: 1.04 } : undefined}
                    whileTap={isInteractive && !shouldReduceMotion ? { scale: 0.96 } : undefined}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: "easeOut" }}
                    className={cn(
                      "relative flex items-center justify-center border-2 font-semibold transition-colors duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      variant === "arrows" ? "rounded-xl" : "rounded-full",
                      circleSizes[size],
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground shadow-xs"
                        : isActive
                        ? "border-primary text-primary bg-background shadow-xs ring-2 ring-ring/25"
                        : "border-border text-muted-foreground bg-muted/40",
                      isInteractive ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={shouldReduceMotion ? false : { scale: 0.75, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
                      >
                        <Check className={checkSizes[size]} />
                      </motion.div>
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      <span className="font-mono tabular-nums">{idx + 1}</span>
                    )}
                  </motion.button>

                  {!isLast && (
                    <div className="w-0.5 min-h-[28px] bg-border my-1.5 rounded-full relative overflow-hidden flex-1">
                      <motion.div
                        className="absolute top-0 left-0 right-0 bg-primary"
                        initial={false}
                        animate={{ height: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>

                <div
                  onClick={() => isInteractive && onStepClick?.(idx)}
                  className={cn(
                    "flex flex-col text-left pt-1 pb-6 min-w-0",
                    isInteractive ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground mt-0.5 max-w-xs leading-relaxed">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        role="list"
        className={cn("flex items-center w-full select-none justify-between gap-1", className)}
        {...props}
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const isLast = idx === steps.length - 1

          return (
            <React.Fragment key={idx}>
              <button
                type="button"
                role="listitem"
                disabled={!isInteractive}
                aria-label={`Step ${idx + 1}: ${step.title}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => onStepClick?.(idx)}
                className={cn(
                  "flex items-center gap-2 sm:gap-2.5 min-w-0 rounded-lg p-1 -m-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isInteractive ? "cursor-pointer group" : "cursor-default"
                )}
              >
                <motion.span
                  whileHover={isInteractive && !shouldReduceMotion ? { scale: 1.05 } : undefined}
                  whileTap={isInteractive && !shouldReduceMotion ? { scale: 0.96 } : undefined}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: "easeOut" }}
                  className={cn(
                    "relative shrink-0 flex items-center justify-center border-2 font-semibold transition-colors duration-200",
                    variant === "arrows" ? "rounded-xl" : "rounded-full",
                    circleSizes[size],
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-xs"
                      : isActive
                      ? "border-primary text-primary bg-background shadow-xs ring-2 ring-ring/25"
                      : "border-border text-muted-foreground bg-muted/40"
                  )}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={shouldReduceMotion ? false : { scale: 0.75, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
                    >
                      <Check className={checkSizes[size]} />
                    </motion.span>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="font-mono tabular-nums">{idx + 1}</span>
                  )}
                </motion.span>

                <span className="flex flex-col text-left min-w-0">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors truncate max-w-[72px] sm:max-w-[130px]",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground/80"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="hidden lg:inline text-[11px] text-muted-foreground max-w-[120px] truncate">
                      {step.description}
                    </span>
                  )}
                </span>
              </button>

              {!isLast && (
                <div className="flex-1 mx-1.5 sm:mx-2.5 flex items-center min-w-[12px]">
                  {variant === "arrows" ? (
                    <div className="flex items-center justify-center w-full text-muted-foreground/50">
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isCompleted && "text-primary"
                        )}
                      />
                    </div>
                  ) : (
                    <div className="h-0.5 w-full bg-border rounded-full overflow-hidden relative">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={false}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = "Stepper"
