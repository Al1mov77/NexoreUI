"use client"

import React, { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "../utils/cn"

export interface DockProps {
  items: {
    icon: React.ReactNode
    label: string
    onClick?: () => void
  }[]
  className?: string
  magnification?: number
  distance?: number
}

export function Dock({
  items,
  className,
  magnification = 60,
  distance = 140,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-14 items-end gap-3 rounded-2xl border border-border bg-background/80 px-4 pb-2 backdrop-blur-md",
        className
      )}
    >
      {items.map((item, i) => (
        <DockIcon key={i} mouseX={mouseX} magnification={magnification} distance={distance} {...item} />
      ))}
    </motion.div>
  )
}

function DockIcon({
  mouseX,
  magnification,
  distance,
  icon,
  label,
  onClick,
}: {
  mouseX: any
  magnification: number
  distance: number
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distanceVal = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(
    distanceVal,
    [-distance, 0, distance],
    [40, magnification, 40]
  )

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-muted/80 hover:bg-accent transition-colors"
      onClick={onClick}
      title={label}
    >
      <div className="flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {label}
      </span>
    </motion.div>
  )
}
