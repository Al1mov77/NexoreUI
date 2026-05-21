"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "../utils/cn"

/**
 * Interface representing a Command palette item
 */
export interface CommandItem {
  label: string
  value: string
  icon?: React.ReactNode
  onSelect: () => void
}

/**
 * Props for the Command palette component
 */
export interface CommandProps {
  /**
   * Array of command items
   */
  items: CommandItem[]
  /**
   * Input search placeholder text
   * @default "Type a command or search..."
   */
  placeholder?: string
  /**
   * Whether the command dialog is open
   */
  open?: boolean
  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (open: boolean) => void
}

/**
 * Command component provides an interactive Command Palette (Cmd+K / Ctrl+K) dialog.
 */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ items, placeholder = "Type a command or search...", open: customOpen, onOpenChange }, ref) => {
    const [localOpen, setLocalOpen] = React.useState(false)
    const open = customOpen !== undefined ? customOpen : localOpen
    const setOpen = onOpenChange || setLocalOpen

    const [search, setSearch] = React.useState("")
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const listRef = React.useRef<HTMLDivElement>(null)

    // Toggle palette on Cmd+K / Ctrl+K
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault()
          setOpen(!open)
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, setOpen])

    // Filter items based on search query
    const filteredItems = React.useMemo(() => {
      if (!search.trim()) return items
      return items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.value.toLowerCase().includes(search.toLowerCase())
      )
    }, [items, search])

    // Reset selected item when filtered items change
    React.useEffect(() => {
      setSelectedIndex(0)
    }, [filteredItems])

    // Handle key navigation inside the list
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (filteredItems.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selected = filteredItems[selectedIndex]
        if (selected) {
          selected.onSelect()
          setOpen(false)
        }
      }
    }

    return (
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              {/* Overlay */}
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                />
              </DialogPrimitive.Overlay>

              {/* Palette Container */}
              <DialogPrimitive.Content asChild>
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onKeyDown={handleKeyDown}
                    ref={ref}
                    className="relative w-full max-w-[550px] bg-card/95 border border-border/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col focus:outline-none"
                  >
                    {/* Header Input */}
                    <div className="flex items-center gap-3 px-4 border-b border-border/40">
                      <Search className="h-4.5 w-4.5 text-muted-foreground/60 shrink-0" />
                      <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 h-12 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground/40 font-medium"
                      />
                      <kbd className="inline-flex h-5.5 select-none items-center rounded border border-border bg-muted/40 px-1.5 font-mono text-[9px] font-medium text-muted-foreground/50">
                        ESC
                      </kbd>
                    </div>

                    {/* Scrollable list */}
                    <div
                      ref={listRef}
                      className="max-h-[300px] overflow-y-auto p-2 space-y-0.5"
                    >
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, idx) => {
                          const isSelected = idx === selectedIndex
                          return (
                            <button
                              key={item.value + idx}
                              onClick={() => {
                                item.onSelect()
                                setOpen(false)
                              }}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left outline-none",
                                isSelected
                                  ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_1px_rgba(var(--primary-rgb),0.2)]"
                                  : "text-foreground hover:bg-muted/40"
                              )}
                            >
                              {item.icon && (
                                <span className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground/70")}>
                                  {item.icon}
                                </span>
                              )}
                              <span className="flex-1 truncate">{item.label}</span>
                              {isSelected && (
                                <span className="text-[10px] uppercase font-bold tracking-widest text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded-md">
                                  Select
                                </span>
                              )}
                            </button>
                          )
                        })
                      ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground/60">
                          No results found.
                        </div>
                      )}
                    </div>

                    {/* Footer guides */}
                    <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border/40 bg-muted/10">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                        <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted/20 px-1 font-mono text-[8px]">↑↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                        <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted/20 px-1 font-mono text-[8px]">↵</kbd>
                        <span>Select</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    )
  }
)

Command.displayName = "Command"

export { Command }
