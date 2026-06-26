"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../utils/cn"

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * The current value of the progress bar
   * @default 0
   */
  value?: number;
  /**
   * The maximum value of the progress bar
   * @default 100
   */
  max?: number;
  /**
   * The variant of the progress bar
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "error";
  /**
   * Whether to show the percentage label
   * @default false
   */
  showLabel?: boolean;
  /**
   * Custom label text shown next to the percentage
   * @default "Progress"
   */
  progressLabel?: string;
  /**
   * The size of the progress bar
   * @default "default"
   */
  size?: "default" | "sm" | "lg";
  /**
   * Whether the progress bar fill animates smoothly
   * @default true
   */
  animated?: boolean;
  /**
   * Whether the progress bar is in an indeterminate loading state
   * @default false
   */
  isIndeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      showLabel = false,
      progressLabel = "Progress",
      size = "default",
      animated = true,
      isIndeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variantClasses: Record<"default" | "success" | "warning" | "error", string> = {
      default: "bg-gradient-to-r from-primary to-primary/80",
      success: "bg-gradient-to-r from-emerald-500 to-teal-500",
      warning: "bg-gradient-to-r from-amber-500 to-orange-500",
      error: "bg-gradient-to-r from-red-500 to-rose-500",
    };

    const sizeClasses: Record<"default" | "sm" | "lg", string> = {
      default: "h-3.5",
      sm: "h-2",
      lg: "h-5",
    };

    return (
      <div className="w-full space-y-1.5">
        {showLabel && !isIndeterminate && (
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{progressLabel}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          value={isIndeterminate ? null : value}
          max={max}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-muted border border-border/40 shadow-inner",
            sizeClasses[size as "default" | "sm" | "lg"],
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 rounded-full",
              variantClasses[variant as "default" | "success" | "warning" | "error"],
              isIndeterminate
                ? "absolute inset-0 -translate-x-full origin-left bg-gradient-to-r from-primary/30 via-primary to-primary/30"
                : "transition-transform ease-out",
              animated && !isIndeterminate ? "duration-500" : "duration-0"
            )}
            style={
              isIndeterminate
                // Single animation definition — not duplicated between className and style
                ? { animation: "shimmer 1.8s infinite" }
                : { transform: `translateX(-${100 - percentage}%)` }
            }
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

export interface CircularProgressCardProps {
  value?: number;
  max?: number;
  title?: string;
  label?: string;
  unit?: string;
  className?: string;
}

export const CircularProgressCard = ({
  value = 75,
  max = 100,
  title,
  label,
  unit = "%",
  className,
}: CircularProgressCardProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const displayTitle = title || label || "Progress";

  return (
    <div className={cn("p-6 bg-card border rounded-2xl flex flex-col items-center gap-4 w-full max-w-[200px] shadow-sm", className)}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-secondary"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-lg font-bold">
          {value}
          <span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>
        </span>
      </div>
      <span className="text-sm font-semibold text-center text-muted-foreground leading-tight">{displayTitle}</span>
    </div>
  );
};
