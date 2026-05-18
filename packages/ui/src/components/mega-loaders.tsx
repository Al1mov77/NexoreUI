"use client"

import * as React from "react"
import { motion } from "framer-motion"

// 1. WifiLoader (Simulated with simple shapes)
export const WifiLoader = () => (
  <div className="flex flex-col items-center justify-end h-8 w-8 gap-1">
    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-8 h-2 bg-primary rounded-t-full rounded-b-sm" />
    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-5 h-2 bg-primary rounded-t-full rounded-b-sm" />
    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
  </div>
)

// 2. HourglassLoader
export const HourglassLoader = () => (
  <motion.div 
    animate={{ rotate: 180 }} 
    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 0.5 }}
    className="relative w-6 h-8 border-y-4 border-y-primary border-x-2 border-x-transparent flex flex-col justify-between items-center"
  >
    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-primary opacity-50" />
    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-primary opacity-50" />
  </motion.div>
)

// 3. HeartbeatLoader
export const HeartbeatLoader = () => (
  <motion.div animate={{ scale: [1, 1.2, 1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
    <svg className="w-8 h-8 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  </motion.div>
)

// 4. BoxLoader
export const BoxLoader = () => (
  <div className="w-8 h-8 relative">
    <motion.div animate={{ rotate: 360, borderRadius: ["20%", "50%", "20%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-full h-full bg-primary" />
  </div>
)

// 5. BouncingBalls
export const BouncingBalls = () => (
  <div className="flex gap-2">
    {[0, 1, 2].map(i => (
      <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="w-3 h-3 bg-primary rounded-full" />
    ))}
  </div>
)

// 6. GlowRingLoader
export const GlowRingLoader = () => (
  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
)

// 7. LineScaleLoader
export const LineScaleLoader = () => (
  <div className="flex gap-1 items-end h-8">
    {[0, 1, 2, 3, 4].map(i => (
      <motion.div key={i} animate={{ height: ["20%", "100%", "20%"] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} className="w-1.5 bg-primary rounded-full" />
    ))}
  </div>
)

// 8. ClockLoader
export const ClockLoader = () => (
  <div className="relative w-10 h-10 rounded-full border-2 border-primary">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute top-1/2 left-1/2 w-0.5 h-3.5 bg-primary origin-bottom -translate-x-1/2 -translate-y-full" />
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="absolute top-1/2 left-1/2 w-0.5 h-4.5 bg-primary/70 origin-bottom -translate-x-1/2 -translate-y-full" />
  </div>
)

// 9. BatteryLoader
export const BatteryLoader = () => (
  <div className="flex items-center">
    <div className="w-12 h-6 border-2 border-primary rounded-sm p-0.5 flex">
      <motion.div animate={{ width: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full bg-green-500 rounded-sm" />
    </div>
    <div className="w-1 h-2 bg-primary rounded-r-sm" />
  </div>
)

// 10. SquareSpinLoader
export const SquareSpinLoader = () => (
  <motion.div animate={{ rotateX: [0, 180, 180, 0], rotateY: [0, 0, 180, 180] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-8 h-8 bg-primary" />
)
