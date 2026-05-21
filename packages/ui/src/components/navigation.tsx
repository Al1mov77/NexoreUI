"use client"

import * as React from "react"
import { ChevronRight, MoreHorizontal, ChevronLeft, Check, Home, Search, Bell, User, Settings, Menu } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"
import { motion } from "framer-motion"

// 1. Breadcrumb - Navigation path
interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: { label: string; href?: string }[]
  separator?: React.ReactNode
}

export function Breadcrumb({ items, separator = <ChevronRight className="h-4 w-4" />, className, ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50 width-fit", className)} {...props}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && <span className="text-muted-foreground/50">{separator}</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-primary transition-colors font-medium">
                {item.label}
              </a>
            ) : (
              <span className="font-semibold text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// 2. Pagination - Page navigation
interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  totalPages: number
  currentPage: number
  onPageChange?: (page: number) => void
}

export function Pagination({ totalPages, currentPage, onPageChange, className, ...props }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className={cn("flex justify-center", className)} {...props}>
      <ul className="flex items-center space-x-2">
        <li>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange?.(page)}
              className={cn("rounded-full", currentPage === page && "shadow-lg shadow-primary/30")}
            >
              {page}
            </Button>
          </li>
        ))}
        <li>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

// 3. Steps - Visual progress steps
interface Step {
  title: string
  description?: string
  status: "complete" | "current" | "upcoming"
}

export function Steps({ items, className }: { items: Step[]; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4 group">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                item.status === "complete" && "border-transparent bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20",
                item.status === "current" && "border-primary bg-background text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10",
                item.status === "upcoming" && "border-muted-foreground/30 bg-muted text-muted-foreground"
              )}
            >
              {item.status === "complete" ? (
                <Check className="h-5 w-5 stroke-[3]" />
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.div>
            {index !== items.length - 1 && (
              <div className={cn(
                "h-full w-[2px] min-h-[30px] my-2 transition-colors duration-300",
                item.status === "complete" ? "bg-emerald-500" : "bg-border"
              )} />
            )}
          </div>
          <div className="pt-1.5 flex-1">
            <h4 className={cn("font-semibold text-base transition-colors", item.status === "current" && "text-primary")}>{item.title}</h4>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Backward compatibility navbars and menu items
// ============================================

export const SimpleNavbar = () => (
  <nav className="flex items-center justify-between p-4 border-b bg-background w-full">
    <div className="font-bold text-lg">Logo</div>
    <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
      <a href="#" className="text-foreground">Home</a>
      <a href="#" className="hover:text-foreground">About</a>
      <a href="#" className="hover:text-foreground">Services</a>
      <a href="#" className="hover:text-foreground">Contact</a>
    </div>
    <div className="flex gap-4">
      <button><Search className="w-5 h-5" /></button>
      <button className="md:hidden"><Menu className="w-5 h-5" /></button>
    </div>
  </nav>
)

export const CenteredNavbar = () => (
  <nav className="flex items-center justify-between p-4 border-b bg-background w-full">
    <div className="flex-1"><div className="font-bold text-lg">Logo</div></div>
    <div className="hidden md:flex gap-6 text-sm font-medium">
      <a href="#">Products</a>
      <a href="#">Solutions</a>
      <a href="#">Pricing</a>
    </div>
    <div className="flex-1 flex justify-end gap-2">
      <button className="px-4 py-2 text-sm font-medium">Log in</button>
      <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">Sign up</button>
    </div>
  </nav>
)

export const GlassNavbar = () => (
  <nav className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-[90%] mx-auto mt-4 shadow-lg sticky top-4 z-50">
    <div className="font-bold text-white">Glass UI</div>
    <div className="flex gap-6 text-sm font-medium text-white/80">
      <a href="#" className="hover:text-white transition-colors">Features</a>
      <a href="#" className="hover:text-white transition-colors">Pricing</a>
    </div>
    <button className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold">Start</button>
  </nav>
)

export const FloatingNavbar = () => (
  <nav className="flex items-center justify-center gap-8 px-8 py-3 bg-card border rounded-full w-fit mx-auto mt-4 shadow-xl">
    <a href="#" className="flex flex-col items-center gap-1 text-primary"><Home className="w-5 h-5" /><span className="text-[10px] font-medium">Home</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Search className="w-5 h-5" /><span className="text-[10px] font-medium">Search</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Bell className="w-5 h-5" /><span className="text-[10px] font-medium">Alerts</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><User className="w-5 h-5" /><span className="text-[10px] font-medium">Profile</span></a>
  </nav>
)

export const SidebarMenu = () => (
  <div className="w-64 h-full min-h-[300px] border-r bg-background p-4 flex flex-col gap-2">
    <div className="font-bold text-xl mb-6 px-2">Dashboard</div>
    <a href="#" className="flex items-center gap-3 px-3 py-2 bg-muted rounded-md font-medium text-sm"><Home className="w-4 h-4" /> Overview</a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm"><Settings className="w-4 h-4" /> Settings</a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm mt-auto"><User className="w-4 h-4" /> Account</a>
  </div>
)

export const BottomNav = () => (
  <div className="flex items-center justify-around p-3 border-t bg-background w-full mt-auto">
    <button className="flex flex-col items-center gap-1 text-primary"><Home className="w-5 h-5" /></button>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><Search className="w-5 h-5" /></button>
    <div className="relative -top-5"><button className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg"><Menu className="w-6 h-6" /></button></div>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><Bell className="w-5 h-5" /></button>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><User className="w-5 h-5" /></button>
  </div>
)

export const BreadcrumbTrail = () => (
  <nav className="flex items-center text-sm text-muted-foreground space-x-1">
    <a href="#" className="hover:text-foreground hover:underline">Home</a>
    <ChevronRight className="w-4 h-4" />
    <a href="#" className="hover:text-foreground hover:underline">Products</a>
    <ChevronRight className="w-4 h-4" />
    <span className="text-foreground font-medium">Laptop</span>
  </nav>
)

export const StepIndicator = ({ current = 2 }: any) => (
  <div className="flex items-center w-full max-w-sm">
    <div className="flex items-center text-primary"><div className="w-8 h-8 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div></div>
    <div className="flex-1 h-[2px] bg-primary mx-2"></div>
    <div className="flex items-center text-primary"><div className="w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-sm">2</div></div>
    <div className="flex-1 h-[2px] bg-muted mx-2"></div>
    <div className="flex items-center text-muted-foreground"><div className="w-8 h-8 rounded-full border-2 border-muted bg-background flex items-center justify-center font-bold text-sm">3</div></div>
  </div>
)

export const TabMenu = () => (
  <div className="flex border-b w-full">
    <button className="px-6 py-3 border-b-2 border-primary text-primary font-medium text-sm">Account</button>
    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">Password</button>
    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">Notifications</button>
  </div>
)

export const DropdownMenuVisual = () => (
  <div className="w-48 border bg-card rounded-md shadow-md p-1 flex flex-col">
    <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1">My Account</div>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Profile</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Billing</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Settings</button>
    <div className="border-t my-1"></div>
    <button className="px-2 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 rounded-sm transition-colors">Log out</button>
  </div>
)
