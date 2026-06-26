import * as React from "react"
import { cn } from "../utils/cn"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The width of the skeleton
   */
  width?: string | number;
  /**
   * The height of the skeleton
   */
  height?: string | number;
  /**
   * The variant of the skeleton
   * @default "rect"
   */
  variant?: "line" | "circle" | "rect";
  /**
   * The number of skeletons to render
   * @default 1
   */
  count?: number;
  /**
   * Whether the skeleton is animated
   * @default true
   */
  animated?: boolean;
}

function Skeleton({
  className,
  width,
  height,
  variant = "rect",
  count = 1,
  animated = true,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    rect: "rounded-md",
    circle: "rounded-full",
    line: "rounded-sm h-4",
  };

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={cn(
        "relative overflow-hidden bg-muted/60 border border-border/30",
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    >
      {animated && (
        <span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-[shimmer_2s_infinite]"
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  ));

  if (count > 1) {
    return <div className="space-y-2">{skeletons}</div>;
  }

  return skeletons[0];
}

export { Skeleton }
