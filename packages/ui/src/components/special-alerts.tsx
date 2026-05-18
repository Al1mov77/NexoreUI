"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"

const alertVariants = {
  info: {
    icon: Info,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    gradient: "from-blue-500 to-cyan-500"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    gradient: "from-yellow-500 to-orange-500"
  },
  success: {
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10 border-green-500/20",
    gradient: "from-green-500 to-emerald-500"
  },
  error: {
    icon: AlertCircle,
    color: "text-red-500 bg-red-500/10 border-red-500/20",
    gradient: "from-red-500 to-pink-500"
  }
}

interface SpecialAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants
  title?: string
  description?: string
}

// 1. Glass Alert - A glassmorphic alert
export function GlassAlert({ variant = "info", title, description, className, ...props }: SpecialAlertProps) {
  const Icon = alertVariants[variant].icon
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 backdrop-blur-md",
        "bg-white/5 border-white/10 dark:bg-black/20 dark:border-white/5",
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-full h-fit", alertVariants[variant].color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1">
          {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
      </div>
    </div>
  )
}

// 2. Gradient Alert - An alert with a gradient border or background
export function GradientAlert({ variant = "info", title, description, className, ...props }: SpecialAlertProps) {
  const Icon = alertVariants[variant].icon
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 bg-background",
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-r", alertVariants[variant].gradient)} />
      <div className="flex gap-3 relative z-10">
        <div className={cn("p-2 rounded-full h-fit", alertVariants[variant].color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1">
          {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
      </div>
    </div>
  )
}

// 3. Dismissible Alert - An alert with a close button
export function DismissibleAlert({ variant = "info", title, description, className, ...props }: SpecialAlertProps) {
  const [visible, setVisible] = React.useState(true)
  const Icon = alertVariants[variant].icon
  // Destructure HTML event handlers that conflict with framer-motion
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...restProps } = props

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 bg-background flex gap-3",
            className
          )}
        >
          <div className={cn("p-2 rounded-full h-fit", alertVariants[variant].color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
            {description && <div className="text-sm text-muted-foreground">{description}</div>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2 -mt-2"
            onClick={() => setVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
