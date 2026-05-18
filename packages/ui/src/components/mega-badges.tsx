"use client"

import * as React from "react"
import { Bell, Check, Star } from "lucide-react"

// 1. NotificationBadge
export const NotificationBadge = ({ count, children }: any) => (
  <div className="relative inline-block">
    {children}
    {count > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">{count > 99 ? '99+' : count}</span>}
  </div>
)

// 2. RibbonBadge
export const RibbonBadge = ({ text }: any) => (
  <div className="relative inline-block overflow-hidden pb-1 pl-1">
    <div className="absolute top-0 left-0 w-0 h-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-primary-dark"></div>
    <span className="relative z-10 inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-r-md rounded-bl-md shadow-sm">{text}</span>
  </div>
)

// 3. OutlineDotBadge
export const OutlineDotBadge = ({ text, colorClass = "bg-green-500" }: any) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
    <span className={`h-1.5 w-1.5 rounded-full ${colorClass}`}></span>
    {text}
  </span>
)

// 4. GradientOutlineBadge
export const GradientOutlineBadge = ({ text }: any) => (
  <div className="relative inline-flex items-center justify-center p-[1px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
    <span className="relative inline-block bg-background px-3 py-0.5 rounded-full text-xs font-semibold text-foreground">{text}</span>
  </div>
)

// 5. IconBadge
export const IconBadge = ({ icon: Icon = Star, text }: any) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
    <Icon className="h-3 w-3" />
    {text}
  </span>
)

// 6. FloatingBadge
export const FloatingBadge = ({ text }: any) => (
  <span className="inline-block animate-[bounce_3s_infinite] rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm border border-primary/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
    {text}
  </span>
)

// 7. ProgressBadge
export const ProgressBadge = ({ text, progress = 50 }: any) => (
  <div className="relative inline-flex h-6 w-24 items-center justify-center rounded-full bg-muted overflow-hidden">
    <div className="absolute left-0 top-0 h-full bg-primary/20" style={{ width: `${progress}%` }}></div>
    <span className="relative z-10 text-[10px] font-bold text-foreground">{text} ({progress}%)</span>
  </div>
)

// 8. StatusRingBadge
export const StatusRingBadge = ({ status = "active" }: any) => {
  const colors = status === "active" ? "ring-green-500/30 bg-green-500" : "ring-red-500/30 bg-red-500"
  return (
    <span className={`inline-block h-3 w-3 rounded-full ring-4 ${colors}`}></span>
  )
}

// 9. NeonOutlineBadge
export const NeonOutlineBadge = ({ text }: any) => (
  <span className="inline-block rounded-full border border-cyan-400 px-3 py-0.5 text-xs font-bold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]">
    {text}
  </span>
)

// 10. TagLabel
export const TagLabel = ({ text }: any) => (
  <span className="inline-flex items-center rounded-sm bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer transition-colors before:content-['#'] before:mr-0.5 before:opacity-50">
    {text}
  </span>
)
