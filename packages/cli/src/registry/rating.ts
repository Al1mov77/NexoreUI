export const rating = {
  name: "rating",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "lucide-react"
],
  
  fileName: "rating.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Star, Heart, ThumbsUp, Flame, Trophy, Smile, CheckCircle2 } from "lucide-react"
import { cn } from "../utils/cn"

export type RatingVariant = "amber" | "primary" | "emerald" | "rose" | "cyan"
export type RatingIconType = "star" | "heart" | "thumb" | "flame" | "trophy" | "smile"
export type RatingSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: number
  defaultValue?: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: RatingSize
  icon?: RatingIconType
  variant?: RatingVariant
  allowHalf?: boolean
  showScore?: boolean
  tooltips?: string[]
  className?: string
}

const sizeClasses: Record<RatingSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
}

const variantStyles: Record<RatingVariant, { active: string }> = {
  amber: {
    active: "fill-warning text-warning",
  },
  primary: {
    active: "fill-foreground text-foreground",
  },
  emerald: {
    active: "fill-success text-success",
  },
  rose: {
    active: "fill-destructive text-destructive",
  },
  cyan: {
    active: "fill-info text-info",
  },
}

const getIconComponent = (icon: RatingIconType) => {
  switch (icon) {
    case "heart":
      return Heart
    case "thumb":
      return ThumbsUp
    case "flame":
      return Flame
    case "trophy":
      return Trophy
    case "smile":
      return Smile
    case "star":
    default:
      return Star
  }
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue = 0,
      max = 5,
      onChange,
      readonly = false,
      size = "md",
      icon = "star",
      variant = "primary",
      allowHalf = false,
      showScore = false,
      tooltips,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue)
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    const currentValue = isControlled ? value : internalValue
    const activeValue = hoverValue !== null ? hoverValue : currentValue

    React.useEffect(() => {
      if (!isControlled && defaultValue !== undefined) {
        setInternalValue(defaultValue)
      }
    }, [defaultValue, isControlled])

    const handleSelect = (val: number) => {
      if (readonly) return
      if (!isControlled) {
        setInternalValue(val)
      }
      onChange?.(val)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
      if (readonly) return
      if (!allowHalf) {
        setHoverValue(index + 1)
        return
      }

      const rect = e.currentTarget.getBoundingClientRect()
      const isLeftHalf = e.clientX - rect.left < rect.width / 2
      setHoverValue(isLeftHalf ? index + 0.5 : index + 1)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (readonly) return
      const step = allowHalf ? 0.5 : 1

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        handleSelect(Math.min(max, currentValue + step))
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        handleSelect(Math.max(allowHalf ? 0.5 : 1, currentValue - step))
      }
    }

    const RatingIcon = getIconComponent(icon)
    const styling = variantStyles[variant] || variantStyles.primary

    const currentTooltip =
      tooltips && activeValue > 0
        ? tooltips[Math.min(tooltips.length - 1, Math.ceil(activeValue) - 1)]
        : null

    return (
      <div
        ref={ref}
        role="slider"
        aria-label={props["aria-label"] ?? "Rating"}
        aria-valuenow={currentValue}
        aria-valuemin={allowHalf ? 0.5 : 1}
        aria-valuemax={max}
        tabIndex={readonly ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-2.5 select-none outline-none rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          readonly ? "cursor-default" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => !readonly && setHoverValue(null)}
        >
          {Array.from({ length: max }).map((_, i) => {
            const indexValue = i + 1
            const isFull = indexValue <= activeValue
            const isHalf = allowHalf && !isFull && activeValue >= i + 0.5

            return (
              <motion.button
                key={i}
                type="button"
                tabIndex={-1}
                disabled={readonly}
                onClick={(e) => {
                  if (allowHalf) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const isLeftHalf = e.clientX - rect.left < rect.width / 2
                    handleSelect(isLeftHalf ? i + 0.5 : indexValue)
                  } else {
                    handleSelect(indexValue)
                  }
                }}
                onMouseMove={(e) => handleMouseMove(e, i)}
                className={cn(
                  "relative p-0.5 outline-none rounded-sm inline-flex items-center justify-center",
                  readonly ? "pointer-events-none" : "cursor-pointer"
                )}
                whileHover={readonly || prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={readonly || prefersReducedMotion ? undefined : { scale: 0.94 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.14, ease: "easeOut" }}
                title={tooltips ? tooltips[i] : \`\${indexValue} / \${max}\`}
              >
                <span className={cn("relative inline-flex items-center justify-center", sizeClasses[size])}>
                  <RatingIcon
                    className={cn(
                      sizeClasses[size],
                      "stroke-[1.75] text-muted-foreground/35 transition-colors duration-150"
                    )}
                  />
                  {(isFull || isHalf) && (
                    <span
                      className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-150"
                      style={{ width: isHalf ? "50%" : "100%" }}
                    >
                      <RatingIcon
                        className={cn(
                          sizeClasses[size],
                          "stroke-[1.75] shrink-0",
                          styling.active
                        )}
                      />
                    </span>
                  )}
                </span>
              </motion.button>
            )
          })}
        </div>

        {(showScore || currentTooltip) && (
          <div className="flex items-center gap-2 text-xs font-semibold">
            {showScore && (
              <span className="font-mono text-foreground px-1.5 py-0.5 rounded-md bg-muted border border-border tabular-nums">
                {currentValue.toFixed(allowHalf ? 1 : 0)} / {max}
              </span>
            )}
            {currentTooltip && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTooltip}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: 4 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  className="text-muted-foreground font-medium"
                >
                  {currentTooltip}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    )
  }
)
Rating.displayName = "Rating"

export interface RatingBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  totalReviews: number
  distribution?: Record<number, number>
  className?: string
}

export function RatingBreakdown({
  rating,
  totalReviews,
  distribution = { 5: 68, 4: 20, 3: 7, 2: 3, 1: 2 },
  className,
  ...props
}: RatingBreakdownProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 max-w-sm w-full space-y-4 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">out of 5</span>
          </div>
          <Rating value={rating} readonly size="sm" variant="primary" allowHalf className="mt-1.5" />
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-foreground block tabular-nums">
            {totalReviews.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            verified ratings
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const pct = distribution[stars] || 0
          return (
            <div key={stars} className="flex items-center gap-2.5 text-xs">
              <div className="w-7 flex items-center gap-1 font-mono font-medium text-foreground shrink-0 tabular-nums">
                <span>{stars}</span>
                <Star className="w-3 h-3 fill-foreground text-foreground" />
              </div>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden relative">
                <motion.div
                  initial={prefersReducedMotion ? false : { width: 0 }}
                  animate={{ width: \`\${pct}%\` }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.5,
                    delay: prefersReducedMotion ? 0 : (5 - stars) * 0.06,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-foreground"
                />
              </div>
              <span className="w-9 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string
  avatarUrl?: string
  rating: number
  date: string
  title?: string
  content: string
  verified?: boolean
  className?: string
}

export function ReviewCard({
  author,
  avatarUrl,
  rating,
  date,
  title,
  content,
  verified = true,
  className,
  ...props
}: ReviewCardProps) {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 w-full max-w-md space-y-3 shadow-xs hover:border-foreground/25 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted border border-border text-foreground font-mono font-semibold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate">{author}</span>
              {verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-success font-medium bg-success/10 px-1.5 py-0.5 rounded-full border border-success/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">{date}</span>
          </div>
        </div>

        <Rating value={rating} readonly size="sm" variant="primary" allowHalf className="shrink-0" />
      </div>

      {title && <h4 className="font-semibold text-sm text-foreground">{title}</h4>}
      <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}
`
};
