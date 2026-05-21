"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "../utils/cn"

/**
 * Representing a single step definition
 */
export interface StepItem {
  title: string
  description?: string
  icon?: React.ReactNode
}

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
  variant?: "default" | "circles" | "arrows"
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Stepper component displays progress through a multi-step sequence with animations.
 */
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = "horizontal",
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical"

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full select-none",
          isVertical ? "flex-col space-y-4" : "flex-row items-center justify-between gap-4",
          className
        )}
        {...props}
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const isLast = idx === steps.length - 1

          return (
            <React.Fragment key={idx}>
              <div
                className={cn(
                  "flex items-center gap-3 relative",
                  isVertical ? "w-full" : "flex-1"
                )}
              >
                {/* Visual indicator (number/circle/icon) */}
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-full shrink-0 border-2 transition-all duration-300",
                    variant === "arrows" ? "rounded-lg" : "",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : isActive
                      ? "border-primary text-primary bg-primary/5 scale-110 shadow-md shadow-primary/10"
                      : "border-muted text-muted-foreground bg-muted/20",
                    variant === "circles" ? "h-9 w-9 text-[13px] font-bold" : "h-8 w-8 text-[12px] font-medium"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-4.5 w-4.5 stroke-[3]" />
                    </motion.div>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{idx + 1}</span>
                  )}

                  {/* Active pulsing effect */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 -z-10" />
                  )}
                </div>

                {/* Text Labels */}
                <div className="flex flex-col text-left">
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors duration-200",
                      isActive ? "text-foreground" : isCompleted ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground/70 mt-0.5 max-w-[200px]">
                      {step.description}
                    </span>
                  )}
                </div>

                {/* Connector line for horizontal view (inside the step flex box) */}
                {!isLast && !isVertical && variant !== "arrows" && (
                  <div className="flex-1 h-[2px] bg-muted/40 ml-2 rounded-full overflow-hidden relative min-w-[30px]">
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    />
                  </div>
                )}

                {/* Arrow indicator for variant="arrows" (horizontal only) */}
                {!isLast && !isVertical && variant === "arrows" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground/30 mx-2 shrink-0"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </div>

              {/* Connector line for vertical view */}
              {!isLast && isVertical && (
                <div className="h-8 w-[2px] bg-muted/40 ml-4 rounded-full relative">
                  <motion.div
                    className="absolute top-0 left-0 right-0 bg-primary"
                    initial={{ height: "0%" }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  />
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

export { Stepper }
