"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"

// 1. Glass Card - Glassmorphic card
export function GlassCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "bg-white/5 backdrop-blur-md border-white/10 dark:bg-black/20 dark:border-white/5",
        className
      )}
      {...props}
    />
  )
}

// 2. Glow Card - Card with a glow effect on hover
export function GlowCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
      <Card
        className={cn("relative bg-background", className)}
        {...props}
      />
    </div>
  )
}

// 3. Gradient Card - Card with a gradient background
export function GradientCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-purple-500/20",
        className
      )}
      {...props}
    />
  )
}

// 4. Hover Card - Card that lifts on hover
export function HoverCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        className={cn(className)}
        {...props}
      />
    </motion.div>
  )
}


