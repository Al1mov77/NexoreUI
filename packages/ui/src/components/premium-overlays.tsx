"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"
import { X, Search } from "lucide-react"

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: "bottom" | "right" | "left" | "top"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  footer?: React.ReactNode
  snapPoints?: number[]
}

const drawerSizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
}

const slideVariants = {
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    className: "inset-x-0 bottom-0 rounded-t-2xl border-x-0 border-b-0 max-h-[90vh]",
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    className: "inset-x-0 top-0 rounded-b-2xl border-x-0 border-t-0 max-h-[85vh]",
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    className: "inset-y-0 right-0 w-full h-full border-y-0 border-r-0",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    className: "inset-y-0 left-0 w-full h-full border-y-0 border-l-0",
  },
}

export function Drawer({
  open,
  onClose,
  side = "bottom",
  size = "md",
  children,
  className,
  title,
  description,
  footer,
  snapPoints,
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = React.useState(false)
  const [snapIndex, setSnapIndex] = React.useState(0)
  const titleId = React.useId()
  const descId = React.useId()
  const panelRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  const validSnaps = React.useMemo(() => {
    if (side !== "bottom" || !snapPoints || snapPoints.length === 0) return null
    return snapPoints.map((v) => Math.min(0.92, Math.max(0.25, v)))
  }, [side, snapPoints])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (open) {
      setSnapIndex(0)
      previousFocusRef.current = document.activeElement as HTMLElement | null
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      const timer = window.setTimeout(() => {
        panelRef.current?.focus()
      }, 20)
      return () => {
        window.clearTimeout(timer)
        document.body.style.overflow = prevOverflow
        previousFocusRef.current?.focus?.()
      }
    }
    return undefined
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const variant = slideVariants[side]
  const isHorizontalSide = side === "left" || side === "right"
  const activeSnap = validSnaps ? validSnaps[snapIndex] ?? validSnaps[0] : null

  const overlayNode = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-50"
        >
          <div
            className="absolute inset-0 bg-foreground/25 dark:bg-background/80 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : "Drawer panel"}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={shouldReduceMotion ? { opacity: 0 } : variant.initial}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : activeSnap !== null
                ? { ...variant.animate, height: `${Math.round(activeSnap * 100)}vh` }
                : variant.animate
            }
            exit={shouldReduceMotion ? { opacity: 0 } : variant.exit}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
            }
            style={
              shouldReduceMotion && activeSnap !== null
                ? { height: `${Math.round(activeSnap * 100)}vh` }
                : undefined
            }
            className={cn(
              "fixed bg-card text-card-foreground border border-border shadow-md flex flex-col focus:outline-none overflow-hidden",
              variant.className,
              isHorizontalSide && drawerSizeClasses[size],
              className
            )}
          >
            {side === "bottom" && (
              <div className="shrink-0 px-5 pt-3 pb-2 flex items-center justify-between gap-2 border-b border-border/50">
                <span className="w-12" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => {
                    if (validSnaps && validSnaps.length > 1) {
                      setSnapIndex((prev) => (prev + 1) % validSnaps.length)
                    }
                  }}
                  aria-label={
                    validSnaps && validSnaps.length > 1
                      ? "Cycle drawer snap height"
                      : "Drawer handle"
                  }
                  className={cn(
                    "group inline-flex items-center justify-center rounded-full py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    validSnaps && validSnaps.length > 1
                      ? "cursor-pointer hover:bg-muted"
                      : "cursor-default"
                  )}
                >
                  <span className="w-10 h-1 rounded-full bg-muted-foreground/35 group-hover:bg-foreground/60 transition-colors" />
                </button>
                <div className="w-12 flex items-center justify-end gap-1">
                  {validSnaps && validSnaps.length > 1 && (
                    <div className="inline-flex items-center gap-1" role="group" aria-label="Snap detents">
                      {validSnaps.map((snap, idx) => (
                        <button
                          key={snap}
                          type="button"
                          onClick={() => setSnapIndex(idx)}
                          aria-label={`Set drawer height to ${Math.round(snap * 100)}%`}
                          aria-pressed={snapIndex === idx}
                          className={cn(
                            "h-1.5 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            snapIndex === idx
                              ? "w-4 bg-foreground"
                              : "w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {(title || description) && (
              <div className="shrink-0 flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
                <div className="min-w-0 space-y-0.5">
                  {title && (
                    <div className="flex items-center gap-2">
                      <h3 id={titleId} className="font-semibold text-base text-foreground tracking-tight truncate">
                        {title}
                      </h3>
                      {activeSnap !== null && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground tabular-nums shrink-0">
                          {Math.round(activeSnap * 100)}%
                        </span>
                      )}
                    </div>
                  )}
                  {description && (
                    <p id={descId} className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto p-5">{children}</div>

            {footer && (
              <div className="shrink-0 px-5 py-3.5 border-t border-border bg-muted/20">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(overlayNode, document.body)
}

export interface CommandPaletteItem {
  id: string
  label: string
  icon?: React.ReactNode
  group?: string
  shortcut?: string
  description?: string
  keywords?: string[]
  disabled?: boolean
  onSelect?: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items: CommandPaletteItem[]
  placeholder?: string
  className?: string
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command or search...",
  className,
}: CommandPaletteProps) {
  const shouldReduceMotion = useReducedMotion()
  const listboxId = React.useId()
  const [mounted, setMounted] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => {
      if (item.label.toLowerCase().includes(q)) return true
      if (item.description && item.description.toLowerCase().includes(q)) return true
      if (item.group && item.group.toLowerCase().includes(q)) return true
      if (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q))) return true
      return false
    })
  }, [items, query])

  const groups = React.useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>()
    filtered.forEach((item) => {
      const group = item.group || "Results"
      const existing = map.get(group)
      if (existing) {
        existing.push(item)
      } else {
        map.set(group, [item])
      }
    })
    return map
  }, [filtered])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      previousFocusRef.current = document.activeElement as HTMLElement | null
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      const timer = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 15)
      return () => {
        window.clearTimeout(timer)
        document.body.style.overflow = prevOverflow
        previousFocusRef.current?.focus?.()
      }
    }
    return undefined
  }, [open])

  const moveSelection = React.useCallback(
    (direction: 1 | -1) => {
      if (filtered.length === 0) return
      let next = selectedIndex
      for (let i = 0; i < filtered.length; i++) {
        next = (next + direction + filtered.length) % filtered.length
        if (!filtered[next]?.disabled) {
          setSelectedIndex(next)
          return
        }
      }
    },
    [filtered, selectedIndex]
  )

  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        moveSelection(1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        moveSelection(-1)
      } else if (e.key === "Enter") {
        e.preventDefault()
        const target = filtered[selectedIndex]
        if (target && !target.disabled) {
          target.onSelect?.()
          onClose()
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, filtered, selectedIndex, moveSelection, onClose])

  const activeItem = filtered[selectedIndex]

  const paletteNode = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="command-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[16vh] px-4"
        >
          <div
            className="absolute inset-0 bg-foreground/25 dark:bg-background/80 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16, ease: "easeOut" }}
            className={cn(
              "relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-xl shadow-md overflow-hidden",
              className
            )}
          >
            <div className="flex items-center gap-2.5 px-3.5 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-activedescendant={
                  activeItem ? `${listboxId}-${activeItem.id}` : undefined
                }
                aria-label={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-12 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground min-w-0"
                placeholder={placeholder}
              />
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums shrink-0 px-1.5 py-0.5 rounded bg-muted border border-border">
                {filtered.length} / {items.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/60 hover:bg-muted font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                ESC
              </button>
            </div>

            <div
              id={listboxId}
              role="listbox"
              className="max-h-[300px] overflow-y-auto p-2 space-y-2"
            >
              {filtered.length > 0 ? (
                Array.from(groups.entries()).map(([groupName, groupItems]) => (
                  <div key={groupName} className="space-y-0.5">
                    <div className="px-2.5 py-1 text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      {groupName}
                    </div>
                    {groupItems.map((item) => {
                      const globalIndex = filtered.indexOf(item)
                      const isSelected = globalIndex === selectedIndex && !item.disabled
                      return (
                        <button
                          key={item.id}
                          id={`${listboxId}-${item.id}`}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={item.disabled}
                          onMouseEnter={() => {
                            if (!item.disabled) setSelectedIndex(globalIndex)
                          }}
                          onClick={() => {
                            if (item.disabled) return
                            item.onSelect?.()
                            onClose()
                          }}
                          className={cn(
                            "relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-45 disabled:pointer-events-none",
                            isSelected
                              ? "bg-accent border border-border/70 text-foreground"
                              : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-2.5 min-w-0">
                            {item.icon && (
                              <span className="text-muted-foreground shrink-0">{item.icon}</span>
                            )}
                            <span className="min-w-0">
                              <span className="block font-medium truncate">{item.label}</span>
                              {item.description && (
                                <span className="block text-[11px] text-muted-foreground truncate">
                                  {item.description}
                                </span>
                              )}
                            </span>
                          </span>
                          {item.shortcut && (
                            <kbd className="relative z-10 font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground shrink-0">
                              {item.shortcut}
                            </kbd>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs font-mono text-muted-foreground">
                  No matching commands for &ldquo;{query}&rdquo;.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-3.5 py-2 border-t border-border bg-muted/30 text-[10px] font-mono text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Run</span>
              </div>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(paletteNode, document.body)
}

export interface ContextMenuItem {
  label: string
  onClick?: () => void
  shortcut?: string
  icon?: React.ReactNode
  separator?: boolean
  disabled?: boolean
  destructive?: boolean
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  children: React.ReactNode
  className?: string
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [activeIndex, setActiveIndex] = React.useState<number>(-1)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const openAt = React.useCallback((clientX: number, clientY: number) => {
    const estWidth = 200
    const estHeight = Math.min(320, items.length * 34 + 16)
    const clampedX = Math.max(8, Math.min(clientX, window.innerWidth - estWidth - 8))
    const clampedY = Math.max(8, Math.min(clientY, window.innerHeight - estHeight - 8))
    setPosition({ x: clampedX, y: clampedY })
    setActiveIndex(-1)
    setOpen(true)
  }, [items.length])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    openAt(e.clientX, e.clientY)
  }

  React.useLayoutEffect(() => {
    if (!open || !menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const clampedX = Math.max(8, Math.min(position.x, window.innerWidth - rect.width - 8))
    const clampedY = Math.max(8, Math.min(position.y, window.innerHeight - rect.height - 8))
    if (clampedX !== position.x || clampedY !== position.y) {
      setPosition({ x: clampedX, y: clampedY })
    }
  }, [open, position.x, position.y])

  const enabledIndices = React.useMemo(
    () =>
      items
        .map((item, idx) => (!item.separator && !item.disabled ? idx : -1))
        .filter((idx) => idx !== -1),
    [items]
  )

  React.useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleClose = () => setOpen(false)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (enabledIndices.length === 0) return
      const currentPos = enabledIndices.indexOf(activeIndex)
      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIdx = enabledIndices[(currentPos + 1) % enabledIndices.length]
        setActiveIndex(nextIdx)
        itemRefs.current[nextIdx]?.focus()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIdx =
          currentPos === -1
            ? enabledIndices[enabledIndices.length - 1]
            : enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length]
        setActiveIndex(prevIdx)
        itemRefs.current[prevIdx]?.focus()
      } else if (e.key === "Home") {
        e.preventDefault()
        const firstIdx = enabledIndices[0]
        setActiveIndex(firstIdx)
        itemRefs.current[firstIdx]?.focus()
      } else if (e.key === "End") {
        e.preventDefault()
        const lastIdx = enabledIndices[enabledIndices.length - 1]
        setActiveIndex(lastIdx)
        itemRefs.current[lastIdx]?.focus()
      }
    }

    window.addEventListener("mousedown", handlePointerDown)
    window.addEventListener("scroll", handleClose, true)
    window.addEventListener("resize", handleClose)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("mousedown", handlePointerDown)
      window.removeEventListener("scroll", handleClose, true)
      window.removeEventListener("resize", handleClose)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, activeIndex, enabledIndices])

  const menuNode = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="context-menu"
          ref={menuRef}
          role="menu"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.12, ease: "easeOut" }}
          className="fixed z-[100] min-w-[196px] bg-popover text-popover-foreground border border-border rounded-xl shadow-md p-1.5 overflow-hidden"
          style={{ left: position.x, top: position.y }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} role="separator" className="my-1 h-px bg-border" />
            ) : (
              <button
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onMouseEnter={() => {
                  if (!item.disabled) setActiveIndex(i)
                }}
                onFocus={() => {
                  if (!item.disabled) setActiveIndex(i)
                }}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
                className={cn(
                  "relative flex w-full items-center justify-between gap-4 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-45 disabled:pointer-events-none",
                  item.destructive
                    ? "text-destructive hover:bg-destructive/10"
                    : activeIndex === i
                    ? "bg-accent text-foreground"
                    : "text-foreground hover:bg-accent/60"
                )}
              >
                <span className="relative z-10 flex items-center gap-2 min-w-0">
                  {item.icon && <span className="shrink-0 opacity-80">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </span>
                {item.shortcut && (
                  <kbd className="relative z-10 text-[10px] text-muted-foreground font-mono shrink-0">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => {
          if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
            e.preventDefault()
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            openAt(rect.left + rect.width / 2, rect.top + rect.height / 2)
          }
        }}
        className={className}
      >
        {children}
      </div>
      {mounted && createPortal(menuNode, document.body)}
    </>
  )
}

export interface FloatingPopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom"
  align?: "start" | "center" | "end"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  contentClassName?: string
}

export function FloatingPopover({
  trigger,
  children,
  side = "bottom",
  align = "center",
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
}: FloatingPopoverProps) {
  const shouldReduceMotion = useReducedMotion()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  React.useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, setOpen])

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  const sideClasses = {
    bottom: "top-full mt-2",
    top: "bottom-full mb-2",
  }

  const triggerNode = React.isValidElement<React.HTMLAttributes<HTMLElement>>(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(e)
          setOpen(!isOpen)
        },
        "aria-expanded": isOpen,
        "aria-haspopup": "dialog",
      })
    : (
        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="inline-flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
        >
          {trigger}
        </button>
      )

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {triggerNode}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-popover"
            role="dialog"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }
            }
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: "easeOut" }}
            className={cn(
              "absolute z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md",
              sideClasses[side],
              alignClasses[align],
              contentClassName
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
