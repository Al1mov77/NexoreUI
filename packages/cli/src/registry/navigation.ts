export const navigation = {
  name: "navigation",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "lucide-react"
],
  componentsDependencies: [
  "button"
],
  fileName: "navigation.tsx",
  content: `"use client"

import * as React from "react"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Home,
  Search,
  Bell,
  User,
  Settings,
  Menu,
  X,
  Plus,
} from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"
import { motion, useReducedMotion } from "framer-motion"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-3.5 w-3.5" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-xs sm:text-sm text-muted-foreground bg-muted/40 px-3.5 py-2 rounded-lg border border-border w-fit max-w-full overflow-x-auto",
        className
      )}
      {...props}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-muted-foreground/60 shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors font-medium rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-foreground px-1 py-0.5"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  totalPages: number
  currentPage: number
  onPageChange?: (page: number) => void
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className={cn("flex justify-center", className)} {...props}>
      <ul className="flex items-center gap-1.5 tabular-nums">
        <li>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            aria-label="Previous page"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            className="h-8 w-8 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        {pages.map((page) => {
          const isActive = currentPage === page
          return (
            <li key={page}>
              <Button
                type="button"
                variant={isActive ? "default" : "outline"}
                size="icon"
                aria-label={\`Page \${page}\`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onPageChange?.(page)}
                className="h-8 w-8 rounded-lg font-mono text-xs"
              >
                {page}
              </Button>
            </li>
          )
        })}
        <li>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            className="h-8 w-8 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export interface Step {
  title: string
  description?: string
  status: "complete" | "current" | "upcoming"
}

export function Steps({ items, className }: { items: Step[]; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <ol className={cn("space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={index} className="flex items-stretch gap-3.5 group">
            <div className="flex flex-col items-center shrink-0">
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-mono font-semibold transition-colors tabular-nums",
                  item.status === "complete" && "border-primary bg-primary text-primary-foreground",
                  item.status === "current" && "border-primary bg-background text-primary ring-2 ring-ring/20",
                  item.status === "upcoming" && "border-border bg-muted/50 text-muted-foreground"
                )}
              >
                {item.status === "complete" ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 w-0.5 min-h-[24px] my-1.5 transition-colors",
                    item.status === "complete" ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className={cn("pt-1 min-w-0 flex-1", !isLast && "pb-6")}>
              <h4
                className={cn(
                  "font-semibold text-sm",
                  item.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export interface NavbarProps {
  brand?: string
  links?: { label: string; href?: string }[]
  className?: string
}

export function SimpleNavbar({
  brand = "Nexore",
  links = [
    { label: "Overview", href: "#overview" },
    { label: "Components", href: "#components" },
    { label: "Changelog", href: "#changelog" },
    { label: "Pricing", href: "#pricing" },
  ],
  className,
}: NavbarProps) {
  const [active, setActive] = React.useState(links[0]?.label ?? "Overview")
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <nav
      aria-label="Primary"
      className={cn("w-full rounded-xl border border-border bg-card overflow-hidden", className)}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-sm tracking-tight text-foreground">{brand}</span>
        <div className="hidden md:flex items-center gap-5 text-xs font-medium">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => setActive(link.label)}
              className={cn(
                "transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1.5 py-0.5",
                active === link.label
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border px-4 py-2 space-y-1 bg-muted/20">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => {
                setActive(link.label)
                setMobileOpen(false)
              }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer",
                active === link.label
                  ? "bg-background text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

export function CenteredNavbar({
  brand = "Studio",
  links = [
    { label: "Products" },
    { label: "Solutions" },
    { label: "Pricing" },
  ],
  className,
}: NavbarProps) {
  const [active, setActive] = React.useState(links[0]?.label ?? "Products")

  return (
    <nav
      aria-label="Centered"
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card w-full gap-3",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm tracking-tight text-foreground">{brand}</span>
      </div>
      <div className="hidden sm:flex items-center gap-5 text-xs font-medium">
        {links.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => setActive(link.label)}
            className={cn(
              "transition-colors cursor-pointer",
              active === link.label
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </button>
        ))}
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
        <Button type="button" variant="ghost" size="sm" className="h-8 text-xs">
          Log in
        </Button>
        <Button type="button" size="sm" className="h-8 text-xs">
          Sign up
        </Button>
      </div>
    </nav>
  )
}

export function GlassNavbar({
  brand = "Workspace",
  links = [{ label: "Features" }, { label: "Pricing" }, { label: "Docs" }],
  className,
}: NavbarProps) {
  const [active, setActive] = React.useState(links[0]?.label ?? "Features")

  return (
    <nav
      aria-label="Pill navigation"
      className={cn(
        "flex items-center justify-between px-4 py-2 bg-card/85 backdrop-blur-md border border-border rounded-full w-full max-w-md mx-auto shadow-xs gap-3",
        className
      )}
    >
      <span className="font-semibold text-xs text-foreground pl-1">{brand}</span>
      <div className="flex items-center gap-3 text-xs font-medium">
        {links.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => setActive(link.label)}
            className={cn(
              "transition-colors cursor-pointer",
              active === link.label
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </button>
        ))}
      </div>
      <Button type="button" size="sm" className="h-7 rounded-full px-3 text-xs">
        Start
      </Button>
    </nav>
  )
}

export function FloatingNavbar({ className }: { className?: string }) {
  const [active, setActive] = React.useState("Home")
  const navItems = [
    { label: "Home", icon: Home },
    { label: "Search", icon: Search },
    { label: "Alerts", icon: Bell },
    { label: "Profile", icon: User },
  ]

  return (
    <nav
      aria-label="Floating bottom navigation"
      className={cn(
        "flex items-center justify-center gap-2 sm:gap-5 px-4 py-2 bg-card border border-border rounded-full w-fit max-w-full mx-auto shadow-xs",
        className
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = active === item.label
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(item.label)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "text-foreground bg-muted font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function SidebarMenu({ className }: { className?: string }) {
  const [active, setActive] = React.useState("Overview")
  const items = [
    { label: "Overview", icon: Home },
    { label: "Settings", icon: Settings },
    { label: "Account", icon: User },
  ]

  return (
    <aside
      aria-label="Sidebar menu"
      className={cn(
        "w-full max-w-[240px] h-full min-h-[220px] rounded-xl border border-border bg-card p-3 flex flex-col gap-1",
        className
      )}
    >
      <div className="font-semibold text-sm px-2.5 py-2 text-foreground border-b border-border mb-1">
        Workspace
      </div>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = active === item.label
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(item.label)}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-muted text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </aside>
  )
}

export function BottomNav({ className }: { className?: string }) {
  const [active, setActive] = React.useState("Home")

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={cn(
        "flex items-center justify-around px-3 py-2 border border-border rounded-xl bg-card w-full",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setActive("Home")}
        aria-label="Home"
        className={cn(
          "flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
          active === "Home" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Home</span>
      </button>
      <button
        type="button"
        onClick={() => setActive("Search")}
        aria-label="Search"
        className={cn(
          "flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
          active === "Search" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Search className="w-4 h-4" />
        <span className="text-[10px]">Search</span>
      </button>
      <button
        type="button"
        onClick={() => setActive("Create")}
        aria-label="Create item"
        className="flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground rounded-full shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setActive("Alerts")}
        aria-label="Alerts"
        className={cn(
          "flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
          active === "Alerts" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Bell className="w-4 h-4" />
        <span className="text-[10px]">Alerts</span>
      </button>
      <button
        type="button"
        onClick={() => setActive("Profile")}
        aria-label="Profile"
        className={cn(
          "flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
          active === "Profile" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <User className="w-4 h-4" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  )
}

export function BreadcrumbTrail({ className }: { className?: string }) {
  return (
    <Breadcrumb
      className={className}
      items={[
        { label: "Home", href: "#navigation" },
        { label: "Products", href: "#navigation" },
        { label: "Workspace" },
      ]}
    />
  )
}

export function StepIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center w-full max-w-sm", className)}>
      <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-mono font-semibold text-xs shrink-0">
        1
      </div>
      <div className="flex-1 h-0.5 bg-primary mx-2" />
      <div className="w-8 h-8 rounded-full border-2 border-primary bg-background text-primary flex items-center justify-center font-mono font-semibold text-xs shrink-0">
        2
      </div>
      <div className="flex-1 h-0.5 bg-border mx-2" />
      <div className="w-8 h-8 rounded-full border-2 border-border bg-muted text-muted-foreground flex items-center justify-center font-mono font-semibold text-xs shrink-0">
        3
      </div>
    </div>
  )
}

export function TabMenu({ className }: { className?: string }) {
  const [active, setActive] = React.useState("Account")
  const tabs = ["Account", "Password", "Notifications"]

  return (
    <div role="tablist" className={cn("flex border-b border-border w-full overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActive(tab)}
            className={cn(
              "px-4 py-2.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer -mb-px",
              isActive
                ? "border-foreground text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

export function DropdownMenuVisual({ className }: { className?: string }) {
  const [selected, setSelected] = React.useState("Profile")

  return (
    <div
      role="menu"
      className={cn(
        "w-full max-w-[200px] border border-border bg-card rounded-xl shadow-xs p-1.5 flex flex-col gap-0.5",
        className
      )}
    >
      <div className="px-2.5 py-1.5 text-xs font-semibold text-foreground border-b border-border mb-1">
        Account
      </div>
      {["Profile", "Billing", "Settings"].map((item) => (
        <button
          key={item}
          type="button"
          role="menuitem"
          onClick={() => setSelected(item)}
          className={cn(
            "px-2.5 py-1.5 text-xs text-left rounded-md transition-colors flex items-center justify-between cursor-pointer",
            selected === item
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <span>{item}</span>
          {selected === item && <Check className="w-3 h-3" />}
        </button>
      ))}
      <div className="border-t border-border my-1" />
      <button
        type="button"
        role="menuitem"
        className="px-2.5 py-1.5 text-xs text-left text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </div>
  )
}
`
};
