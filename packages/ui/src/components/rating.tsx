"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, Heart, ThumbsUp } from "lucide-react"
import { cn } from "../utils/cn"

/**
 * Props for the Rating component
 */
export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Current rating value
   */
  value: number
  /**
   * Maximum rating count
   * @default 5
   */
  max?: number
  /**
   * Callback fired when rating value is clicked
   */
  onChange?: (value: number) => void
  /**
   * If true, rating is display-only
   * @default false
   */
  readonly?: boolean
  /**
   * Size of rating icons
   * @default "md"
   */
  size?: "sm" | "md" | "lg"
  /**
   * Visual icon choice
   * @default "star"
   */
  icon?: "star" | "heart" | "thumb"
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Rating component provides a premium selection input for score ratings (Stars, Hearts, Thumbs).
 */
const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      max = 5,
      onChange,
      readonly = false,
      size = "md",
      icon = "star",
      className,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)
    const activeValue = hoverValue !== null ? hoverValue : value

    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    }

    const getIcon = () => {
      switch (icon) {
        case "heart":
          return Heart
        case "thumb":
          return ThumbsUp
        case "star":
        default:
          return Star
      }
    }

    const RatingIcon = getIcon()

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
      if (readonly || !onChange) return

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        onChange(Math.min(max, value + 1))
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        onChange(Math.max(1, value - 1))
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onChange(idx)
      }
    }

    return (
      <div
        ref={ref}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={max}
        className={cn(
          "flex items-center gap-1.5",
          readonly ? "cursor-default" : "cursor-pointer",
          className
        )}
        {...props}
      >
        {Array.from({ length: max }).map((_, i) => {
          const indexValue = i + 1
          const isFilled = indexValue <= activeValue
          const isActuallySelected = indexValue <= value

          return (
            <motion.button
              key={i}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(indexValue)}
              onMouseEnter={() => !readonly && setHoverValue(indexValue)}
              onMouseLeave={() => !readonly && setHoverValue(null)}
              onKeyDown={(e) => handleKeyDown(e, indexValue)}
              className={cn(
                "p-0.5 outline-none rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:bg-muted/35",
                readonly ? "pointer-events-none" : ""
              )}
              whileHover={readonly ? {} : { scale: 1.15 }}
              whileTap={readonly ? {} : { scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <RatingIcon
                className={cn(
                  sizeClasses[size],
                  "transition-all duration-200 stroke-[1.8]",
                  isFilled
                    ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.25)]"
                    : "text-muted-foreground/40 hover:text-muted-foreground/60"
                )}
              />
            </motion.button>
          )
        })}
      </div>
    )
  }
)

Rating.displayName = "Rating"

export { Rating }
