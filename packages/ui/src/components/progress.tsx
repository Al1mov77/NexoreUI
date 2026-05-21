"use client"

import * as React from "react"
import { cn } from "../utils/cn"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * The size of the progress bar
   * @default "default"
   */
  size?: "default" | "sm" | "lg";
  /**
   * Whether the progress bar is animated
   * @default true
   */
  animated?: boolean;
  /**
   * Whether the progress bar is in an indeterminate loading state
   * @default false
   */
  isIndeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", showLabel = false, size = "default", animated = true, isIndeterminate = false, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variantClasses = {
      default: "bg-primary",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      error: "bg-red-500",
    };

    const sizeClasses = {
      default: "h-4",
      sm: "h-2",
      lg: "h-6",
    };

    return (
      <div className="w-full space-y-1">
        {showLabel && !isIndeterminate && (
          <div className="flex justify-between text-sm font-medium">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-secondary border border-border",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {isIndeterminate ? (
            <div
              className={cn(
                "h-full w-full bg-primary/80 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full"
              )}
              style={{
                animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          ) : (
            <div
              className={cn(
                "h-full transition-all ease-in-out",
                variantClasses[variant],
                animated ? "duration-500" : "duration-0"
              )}
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

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
