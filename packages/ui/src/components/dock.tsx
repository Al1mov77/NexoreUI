"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface DockItem {
  id?: string
  icon: React.ReactNode
  label: string
  badge?: string | number
  shortcut?: string
  dividerAfter?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface DockProps {
  items: DockItem[]
  activeId?: string
  defaultActiveId?: string
  onActiveChange?: (id: string) => void
  variant?: "expanding" | "rail" | "minimal"
  orientation?: "horizontal" | "vertical"
  className?: string
  magnification?: number
  distance?: number
}

export function Dock({
  items,
  activeId,
  defaultActiveId,
  onActiveChange,
  variant = "expanding",
  orientation = "horizontal",
  className,
}: DockProps) {
  const shouldReduceMotion = useReducedMotion()
  const instanceId = React.useId().replace(/:/g, "")
  const isControlled = activeId !== undefined
  const firstId = items[0] ? items[0].id ?? items[0].label : ""
  const [internalActiveId, setInternalActiveId] = React.useState<string>(
    defaultActiveId ?? firstId
  )
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const currentActiveId = isControlled ? activeId : internalActiveId
  const isVertical = orientation === "vertical"

  const selectItem = (item: DockItem, itemId: string) => {
    if (item.disabled) return
    if (!isControlled) {
      setInternalActiveId(itemId)
    }
    onActiveChange?.(itemId)
    item.onClick?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight"
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft"

    const enabledIndices = items
      .map((item, idx) => (item.disabled ? -1 : idx))
      .filter((idx) => idx !== -1)

    if (enabledIndices.length === 0) return
    const pos = enabledIndices.indexOf(currentIndex)

    if (e.key === nextKey) {
      e.preventDefault()
      const nextIdx = enabledIndices[(pos + 1) % enabledIndices.length]
      buttonRefs.current[nextIdx]?.focus()
    } else if (e.key === prevKey) {
      e.preventDefault()
      const prevIdx =
        enabledIndices[(pos - 1 + enabledIndices.length) % enabledIndices.length]
      buttonRefs.current[prevIdx]?.focus()
    } else if (e.key === "Home") {
      e.preventDefault()
      buttonRefs.current[enabledIndices[0]]?.focus()
    } else if (e.key === "End") {
      e.preventDefault()
      buttonRefs.current[enabledIndices[enabledIndices.length - 1]]?.focus()
    }
  }

  return (
    <div
      role="toolbar"
      aria-label="Command dock"
      aria-orientation={orientation}
      onMouseLeave={() => setHoveredId(null)}
      className={cn(
        "inline-flex items-center max-w-full border border-border bg-card shadow-sm p-1.5 select-none",
        isVertical
          ? "flex-col rounded-2xl gap-1 w-fit overflow-visible"
          : "flex-row flex-wrap sm:flex-nowrap justify-center rounded-2xl gap-1 overflow-visible",
        variant === "minimal" && "bg-background shadow-xs rounded-xl p-1",
        className
      )}
    >
      {items.map((item, idx) => {
        const itemId = item.id ?? item.label ?? String(idx)
        const isActive = currentActiveId === itemId
        const isHovered = hoveredId === itemId
        const showInlineLabel = variant === "expanding" && !isVertical && isActive

        return (
          <React.Fragment key={itemId}>
            <button
              ref={(el) => {
                buttonRefs.current[idx] = el
              }}
              type="button"
              disabled={item.disabled}
              aria-label={item.label}
              aria-pressed={isActive}
              onClick={() => selectItem(item, itemId)}
              onMouseEnter={() => setHoveredId(itemId)}
              onFocus={() => setHoveredId(itemId)}
              onBlur={() => setHoveredId((prev) => (prev === itemId ? null : prev))}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                "group relative flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:pointer-events-none",
                showInlineLabel ? "h-9 px-3 gap-2" : "h-9 w-9",
                isActive
                  ? variant === "minimal"
                    ? "text-foreground"
                    : "text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isHovered && !isActive && (
                <motion.span
                  layoutId={`dock-hover-${instanceId}`}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 450, damping: 34 }
                  }
                  className="absolute inset-0 rounded-xl bg-muted z-0"
                />
              )}

              {isActive && (
                <motion.span
                  layoutId={`dock-active-${instanceId}`}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                  className={cn(
                    "absolute inset-0 rounded-xl z-0",
                    variant === "minimal"
                      ? "bg-muted border border-border"
                      : "bg-foreground shadow-xs"
                  )}
                />
              )}

              <span className="relative z-10 flex items-center justify-center shrink-0">
                {item.icon}
              </span>

              {showInlineLabel && (
                <AnimatePresence initial={false}>
                  <motion.span
                    initial={shouldReduceMotion ? false : { opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, width: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" }}
                    className="relative z-10 text-xs font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                </AnimatePresence>
              )}

              {item.badge !== undefined && (
                <span
                  className={cn(
                    "relative z-10 font-mono text-[10px] leading-none px-1.5 py-0.5 rounded-full tabular-nums",
                    showInlineLabel
                      ? "bg-background/20 text-background"
                      : isActive
                      ? variant === "minimal"
                        ? "absolute -top-1 -right-1 bg-foreground text-background"
                        : "absolute -top-1 -right-1 bg-background text-foreground border border-border"
                      : "absolute -top-1 -right-1 bg-muted text-foreground border border-border"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {!showInlineLabel && (
                <span
                  role="tooltip"
                  className={cn(
                    "pointer-events-none absolute z-20 flex items-center gap-1.5 rounded-md border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground shadow-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
                    isVertical
                      ? "left-full ml-2 top-1/2 -translate-y-1/2"
                      : "-top-9 left-1/2 -translate-x-1/2"
                  )}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {item.shortcut}
                    </kbd>
                  )}
                </span>
              )}
            </button>

            {item.dividerAfter && idx < items.length - 1 && (
              <div
                aria-hidden="true"
                className={cn(
                  "bg-border shrink-0",
                  isVertical ? "h-px w-5 my-1" : "w-px h-5 mx-1"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
