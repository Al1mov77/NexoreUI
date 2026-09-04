"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "../utils/cn"

/**
 * Representing a single step definition
 */
export interface StepItem {
  title: string
  description?: string
  icon?: React.ReactNode
}

export type StepperVariant = "default" | "circles" | "arrows"
export type StepperSize = "sm" | "md" | "lg"

/**
 * Props for the Stepper component
 */
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of step configurations
   */
  steps: StepItem[]
  /**
   * Index of the current active step (0-indexed)
   */
  currentStep: number
  /**
   * Orientation layout of the stepper
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical"
  /**
   * Style variant of the stepper
   * @default "default"
   */
  variant?: StepperVariant
  /**
   * Sizing scale of the stepper indicators
   * @default "md"
   */
  size?: StepperSize
  /**
   * Callback fired when a step indicator is clicked
   */
  onStepClick?: (stepIndex: number) => void
  /**
   * Additional CSS classes
   */
  className?: string
}

const circleSizes: Record<StepperSize, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-[13px]",
  lg: "h-11 w-11 text-[15px]",
}

const checkSizes: Record<StepperSize, string> = {
  sm: "h-3.5 w-3.5 stroke-[3]",
  md: "h-4 w-4 stroke-[3]",
  lg: "h-5 w-5 stroke-[3]",
}

/**
 * Stepper component displays progress through a multi-step sequence with smooth animations.
 */
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
    const isVertical = orientation === "vertical"
    const isInteractive = Boolean(onStepClick)

    // ============================================
    // Vertical Layout
    // ============================================
    if (isVertical) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col w-full select-none", className)}
          {...props}
        >
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep
            const isActive = idx === currentStep
            const isLast = idx === steps.length - 1

            return (
              <div key={idx} className="flex items-start gap-4 group">
                {/* Left Column: Indicator + Centered Vertical Line */}
                <div className="flex flex-col items-center shrink-0">
                  <motion.button
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => onStepClick?.(idx)}
                    whileHover={isInteractive ? { scale: 1.08 } : {}}
                    whileTap={isInteractive ? { scale: 0.95 } : {}}
                    className={cn(
                      "relative flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 z-10",
                      variant === "arrows" ? "rounded-xl" : "rounded-full",
                      circleSizes[size],
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25"
                        : isActive
                        ? "border-primary text-primary bg-primary/10 shadow-lg shadow-primary/15 ring-4 ring-primary/20"
                        : "border-border text-muted-foreground bg-muted/30",
                      isInteractive ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      >
                        <Check className={checkSizes[size]} />
                      </motion.div>
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      <span>{idx + 1}</span>
                    )}

                    {isActive && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-primary/25 -z-10" />
                    )}
                  </motion.button>

                  {/* Vertical Connector Line perfectly centered under the circle */}
                  {!isLast && (
                    <div className="w-[2px] min-h-[36px] bg-muted/40 my-1 rounded-full relative overflow-hidden flex-1">
                      <motion.div
                        className="absolute top-0 left-0 right-0 bg-primary"
                        initial={{ height: "0%" }}
                        animate={{ height: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Title & Description */}
                <div
                  onClick={() => isInteractive && onStepClick?.(idx)}
                  className={cn(
                    "flex flex-col text-left pt-1 pb-6 transition-colors",
                    isInteractive ? "cursor-pointer" : ""
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive ? "text-foreground" : isCompleted ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground/70 mt-0.5 max-w-xs leading-relaxed">
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

    // ============================================
    // Horizontal Layout
    // ============================================
    return (
      <div
        ref={ref}
        className={cn("flex items-center w-full select-none justify-between", className)}
        {...props}
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const isLast = idx === steps.length - 1

          return (
            <React.Fragment key={idx}>
              {/* Step item: Circle + Text */}
              <div
                onClick={() => isInteractive && onStepClick?.(idx)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 min-w-0 transition-all",
                  isInteractive ? "cursor-pointer group" : "cursor-default"
                )}
              >
                {/* Visual Circle Indicator */}
                <motion.button
                  type="button"
                  disabled={!isInteractive}
                  onClick={() => onStepClick?.(idx)}
                  whileHover={isInteractive ? { scale: 1.1 } : {}}
                  whileTap={isInteractive ? { scale: 0.95 } : {}}
                  className={cn(
                    "relative shrink-0 flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                    variant === "arrows" ? "rounded-xl" : "rounded-full",
                    circleSizes[size],
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25"
                      : isActive
                      ? "border-primary text-primary bg-primary/10 shadow-lg shadow-primary/15 ring-4 ring-primary/20"
                      : "border-border text-muted-foreground bg-muted/30",
                    isInteractive ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <Check className={checkSizes[size]} />
                    </motion.div>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{idx + 1}</span>
                  )}

                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/25 -z-10" />
                  )}
                </motion.button>

                {/* Step Labels */}
                <div className="flex flex-col text-left min-w-0">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors truncate max-w-[90px] sm:max-w-[120px]",
                      isActive
                        ? "text-foreground"
                        : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground/80"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="hidden xl:inline text-[11px] text-muted-foreground/70 max-w-[80px] sm:max-w-[110px] truncate">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector line between steps (never after the last step) */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-3 flex items-center min-w-[14px]">
                  {variant === "arrows" ? (
                    <div className="flex items-center justify-center w-full text-muted-foreground/40">
                      <ChevronRight className={cn("h-4 w-4 shrink-0 transition-colors", isCompleted && "text-primary")} />
                    </div>
                  ) : (
                    <div className="h-[2px] w-full bg-muted/50 rounded-full overflow-hidden relative">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
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
