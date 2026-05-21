"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"
import { X } from "lucide-react"

// ============================================
// 1. ScrollArea Re-export
// ============================================
export { ScrollArea, type ScrollAreaProps } from "./scroll-area"

// ============================================
// 2. Drawer — Slide-in panel from bottom or side
// ============================================
export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean
  /** Callback when drawer should close */
  onClose: () => void
  /** Direction the drawer slides from */
  side?: "bottom" | "right" | "left"
  /** Drawer content */
  children: React.ReactNode
  /** Additional CSS classes for the drawer panel */
  className?: string
  /** Title for the drawer header */
  title?: string
}

const slideVariants = {
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    className: "inset-x-0 bottom-0 rounded-t-2xl max-h-[85vh]",
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    className: "inset-y-0 right-0 w-full max-w-md h-full",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    className: "inset-y-0 left-0 w-full max-w-md h-full",
  },
}

export function Drawer({
  open,
  onClose,
  side = "bottom",
  children,
  className,
  title,
}: DrawerProps) {
  const variant = slideVariants[side]

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "absolute bg-card border border-border shadow-2xl overflow-y-auto",
              variant.className,
              className
            )}
          >
            {/* Handle for bottom drawer */}
            {side === "bottom" && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
              </div>
            )}
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 3. CommandPalette — Cmd+K search overlay
// ============================================
export interface CommandPaletteItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Optional group/category */
  group?: string
  /** Action when selected */
  onSelect?: () => void
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  open: boolean
  /** Callback when palette should close */
  onClose: () => void
  /** Items to display */
  items: CommandPaletteItem[]
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command or search...",
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const filtered = React.useMemo(
    () => items.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  // Group items
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>()
    filtered.forEach(item => {
      const group = item.group || "Results"
      if (!map.has(group)) map.set(group, [])
      map.get(group)!.push(item)
    })
    return map
  }, [filtered])

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        filtered[selectedIndex]?.onSelect?.()
        onClose()
      } else if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, filtered, selectedIndex, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden",
              className
            )}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 border-b border-border">
              <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={placeholder}
              />
            </div>
            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length > 0 ? (
                Array.from(groups.entries()).map(([groupName, groupItems]) => (
                  <div key={groupName}>
                    <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {groupName}
                    </div>
                    {groupItems.map((item) => {
                      const globalIndex = filtered.indexOf(item)
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            item.onSelect?.()
                            onClose()
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                            globalIndex === selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted/50"
                          )}
                        >
                          {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No results found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 4. ContextMenu — Right-click context menu
// ============================================
export interface ContextMenuItem {
  /** Display label */
  label: string
  /** Action when clicked */
  onClick?: () => void
  /** Keyboard shortcut hint */
  shortcut?: string
  /** Whether this is a separator */
  separator?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether this is a destructive action */
  destructive?: boolean
}

export interface ContextMenuProps {
  /** Items in the context menu */
  items: ContextMenuItem[]
  /** Content to right-click on */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const menuRef = React.useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setOpen(true)
  }

  React.useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener("click", close)
    window.addEventListener("scroll", close)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("click", close)
      window.removeEventListener("scroll", close)
      window.removeEventListener("resize", close)
    }
  }, [open])

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[100] min-w-[180px] bg-card border border-border rounded-lg shadow-xl p-1 overflow-hidden"
            style={{ left: position.x, top: position.y }}
          >
            {items.map((item, i) =>
              item.separator ? (
                <div key={i} className="my-1 h-px bg-border" />
              ) : (
                <button
                  key={i}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm transition-colors",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    item.destructive
                      ? "text-destructive hover:bg-destructive/10"
                      : "hover:bg-accent"
                  )}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[11px] text-muted-foreground font-mono">{item.shortcut}</span>
                  )}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
