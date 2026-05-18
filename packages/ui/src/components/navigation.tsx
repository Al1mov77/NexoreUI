"use client"

import * as React from "react"
import { ChevronRight, MoreHorizontal, ChevronLeft, Check } from "lucide-react"
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
