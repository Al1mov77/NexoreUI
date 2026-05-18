"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

/** Shared props for avatar components */
interface AvatarBaseProps {
  /** Additional CSS classes */
  className?: string
  /** Avatar image source URL */
  src?: string
  /** Fallback text/initials */
  fallback: string
}

// ============================================
// 1. GlowAvatar — Avatar with glow effect on hover
// ============================================
export function GlowAvatar({ className, src, fallback }: AvatarBaseProps) {
  return (
    <div className="relative inline-block group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
      <Avatar className={cn("relative border-2 border-background", className)}>
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  )
}

// ============================================
// 2. StatusAvatar — Avatar with online status indicator
// ============================================
export interface StatusAvatarProps extends AvatarBaseProps {
  /** Current status */
  status?: "online" | "offline" | "busy" | "away"
}

export function StatusAvatar({ className, src, fallback, status = "online" }: StatusAvatarProps) {
  const statusColor = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    busy: "bg-red-500",
    away: "bg-yellow-500"
  }[status] || "bg-green-500"

  return (
    <div className="relative inline-block">
      <Avatar className={className}>
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <span className={cn("absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full", statusColor)} />
    </div>
  )
}

// ============================================
// 3. HexagonAvatar — Hexagon-clipped avatar
// ============================================
export function HexagonAvatar({ className, src, fallback }: AvatarBaseProps) {
  return (
    <Avatar 
      className={cn("rounded-none", className)} 
      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
    >
      {src && <AvatarImage src={src} />}
      <AvatarFallback className="rounded-none">{fallback}</AvatarFallback>
    </Avatar>
  )
}

// ============================================
// 4. SquircleAvatar — Squircle-shaped avatar
// ============================================
export function SquircleAvatar({ className, src, fallback }: AvatarBaseProps) {
  return (
    <Avatar className={cn("rounded-2xl", className)}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback className="rounded-2xl">{fallback}</AvatarFallback>
    </Avatar>
  )
}

// ============================================
// 5. GradientRingAvatar — Avatar with gradient ring border
// ============================================
export function GradientRingAvatar({ className, src, fallback }: AvatarBaseProps) {
  return (
    <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
      <Avatar className={cn("border-2 border-background", className)}>
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  )
}

// ============================================
// 6. InitialsAvatar — Auto-colored based on name
// ============================================
export interface InitialsAvatarProps {
  /** Additional CSS classes */
  className?: string
  /** User's full name for generating initials */
  name?: string
}

export function InitialsAvatar({ className, name = "User" }: InitialsAvatarProps) {
  const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()
  
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
  const hash = name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
  const colorClass = colors[hash % colors.length]

  return (
    <Avatar className={className}>
      <AvatarFallback className={cn("text-white font-semibold", colorClass)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

// ============================================
// 7. OutlineAvatar — Avatar with dashed outline border
// ============================================
export function OutlineAvatar({ className, src, fallback }: AvatarBaseProps) {
  return (
    <Avatar className={cn("border-2 border-primary border-dashed p-0.5 bg-transparent", className)}>
      {src && <AvatarImage src={src} className="rounded-full" />}
      <AvatarFallback className="bg-muted text-foreground">{fallback}</AvatarFallback>
    </Avatar>
  )
}

// ============================================
// 8. HoverExpandAvatar — Avatar that scales on hover
// ============================================
export function HoverExpandAvatar({ className, src, fallback }: AvatarBaseProps) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Avatar className={className}>
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </motion.div>
  )
}
