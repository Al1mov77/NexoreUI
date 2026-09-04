"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Heart, ThumbsUp, Flame, Trophy, Smile, CheckCircle2 } from "lucide-react"
import { cn } from "../utils/cn"

export type RatingVariant = "amber" | "primary" | "emerald" | "rose" | "cyan"
export type RatingIconType = "star" | "heart" | "thumb" | "flame" | "trophy" | "smile"
export type RatingSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /**
   * Controlled rating score value
   */
  value?: number
  /**
   * Default initial rating value for uncontrolled usage
   * @default 0
   */
  defaultValue?: number
  /**
   * Maximum rating score count
   * @default 5
   */
  max?: number
  /**
   * Callback fired when rating value changes
   */
  onChange?: (value: number) => void
  /**
   * If true, rating is display-only and non-interactive
   * @default false
   */
  readonly?: boolean
  /**
   * Size of rating icons
   * @default "md"
   */
  size?: RatingSize
  /**
   * Visual icon choice
   * @default "star"
   */
  icon?: RatingIconType
  /**
   * Color theme variant
   * @default "amber"
   */
  variant?: RatingVariant
  /**
   * Allow half-step (0.5) fractional rating precision
   * @default false
   */
  allowHalf?: boolean
  /**
   * Display score number label alongside the rating icons
   * @default false
   */
  showScore?: boolean
  /**
   * Array of tooltip labels corresponding to each step
   * (e.g. ["Poor", "Fair", "Good", "Very Good", "Exceptional"])
   */
  tooltips?: string[]
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeClasses: Record<RatingSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
}

const variantStyles: Record<RatingVariant, { active: string; glow: string }> = {
  amber: {
    active: "fill-amber-400 text-amber-400",
    glow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]",
  },
  primary: {
    active: "fill-primary text-primary",
    glow: "drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.35)]",
  },
  emerald: {
    active: "fill-emerald-400 text-emerald-400",
    glow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]",
  },
  rose: {
    active: "fill-rose-500 text-rose-500",
    glow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.35)]",
  },
  cyan: {
    active: "fill-cyan-400 text-cyan-400",
    glow: "drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]",
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

/**
 * Rating component provides a luxury interactive scoring component supporting stars,
 * hearts, flames, trophies, half-star precision, color themes, and tooltips.
 */
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
      variant = "amber",
      allowHalf = false,
      showScore = false,
      tooltips,
      className,
      ...props
    },
    ref
  ) => {
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
      const computed = isLeftHalf ? index + 0.5 : index + 1
      setHoverValue(computed)
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
    const styling = variantStyles[variant] || variantStyles.amber

    // Current tooltip label to display
    const currentTooltip =
      tooltips && activeValue > 0
        ? tooltips[Math.min(tooltips.length - 1, Math.ceil(activeValue) - 1)]
        : null

    return (
      <div
        ref={ref}
        role="slider"
        aria-valuenow={currentValue}
        aria-valuemin={allowHalf ? 0.5 : 1}
        aria-valuemax={max}
        tabIndex={readonly ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-2 select-none outline-none",
          readonly ? "cursor-default" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5" onMouseLeave={() => !readonly && setHoverValue(null)}>
          {Array.from({ length: max }).map((_, i) => {
            const indexValue = i + 1
            const isFull = indexValue <= activeValue
            const isHalf = allowHalf && activeValue === i + 0.5

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
                  "relative p-0.5 outline-none rounded-md transition-transform focus-visible:ring-2 focus-visible:ring-primary/40",
                  readonly ? "pointer-events-none" : "cursor-pointer"
                )}
                whileHover={readonly ? {} : { scale: 1.15 }}
                whileTap={readonly ? {} : { scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                title={tooltips ? tooltips[i] : `${indexValue} / ${max}`}
              >
                {/* Background Unfilled Icon */}
                <RatingIcon
                  className={cn(
                    sizeClasses[size],
                    "transition-all duration-200 stroke-[1.8] text-muted-foreground/30"
                  )}
                />

                {/* Filled Overlay */}
                {(isFull || isHalf) && (
                  <div
                    className="absolute inset-0 p-0.5 overflow-hidden transition-all duration-150"
                    style={{ width: isHalf ? "50%" : "100%" }}
                  >
                    <RatingIcon
                      className={cn(
                        sizeClasses[size],
                        "transition-all duration-200 stroke-[1.8]",
                        styling.active,
                        styling.glow
                      )}
                    />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Score & Tooltip Label */}
        {(showScore || currentTooltip) && (
          <div className="flex items-center gap-2 text-xs font-semibold">
            {showScore && (
              <span className="font-mono text-foreground px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50">
                {currentValue.toFixed(allowHalf ? 1 : 0)} / {max}
              </span>
            )}
            {currentTooltip && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTooltip}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
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

// ============================================
// RatingBreakdown Component
// ============================================

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
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 max-w-sm w-full space-y-4 shadow-lg backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">out of 5</span>
          </div>
          <Rating value={rating} readonly size="sm" variant="amber" allowHalf className="mt-1" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-foreground block">{totalReviews.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">verified ratings</span>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const pct = distribution[stars] || 0
          return (
            <div key={stars} className="flex items-center gap-2.5 text-xs">
              <div className="w-6 flex items-center gap-0.5 font-mono font-medium text-foreground/80 shrink-0">
                <span>{stars}</span>
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: (5 - stars) * 0.08 }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] text-muted-foreground">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// ReviewCard Component
// ============================================

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
        "rounded-2xl border border-border/70 bg-card/60 p-5 w-full max-w-md space-y-3 backdrop-blur-md shadow-md hover:border-primary/40 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={author} className="w-9 h-9 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{author}</span>
              {verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{date}</span>
          </div>
        </div>

        <Rating value={rating} readonly size="sm" variant="amber" allowHalf />
      </div>

      {title && <h4 className="font-semibold text-sm text-foreground">{title}</h4>}
      <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}
