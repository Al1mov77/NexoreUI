"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

// 1. StackAvatar (Avatar Group element)
export const StackAvatar = ({ urls = [], max = 3, fallback = "U" }: any) => {
  const visibleUrls = urls.slice(0, max);
  const remaining = urls.length - max;
  
  return (
    <div className="flex -space-x-4">
      {visibleUrls.map((src: string, i: number) => (
        <Avatar key={i} className="border-2 border-background ring-2 ring-transparent transition-transform hover:-translate-y-1 hover:ring-primary relative z-[1]">
          <AvatarImage src={src} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <Avatar className="border-2 border-background relative z-[1]">
          <AvatarFallback className="bg-muted text-foreground">+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

// 2. DottedAvatar
export const DottedAvatar = ({ src, fallback }: any) => (
  <Avatar className="border-2 border-dashed border-primary p-0.5 bg-transparent">
    {src && <AvatarImage src={src} className="rounded-full" />}
    <AvatarFallback className="bg-muted">{fallback}</AvatarFallback>
  </Avatar>
)

// 3. ShadowAvatar
export const ShadowAvatar = ({ src, fallback }: any) => (
  <Avatar className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] border">
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

// 4. PolymorphAvatar (Organic shape)
export const PolymorphAvatar = ({ src, fallback }: any) => (
  <Avatar className="rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border">
    {src && <AvatarImage src={src} className="rounded-[30%_70%_70%_30%/30%_30%_70%_70%]" />}
    <AvatarFallback className="rounded-[30%_70%_70%_30%/30%_30%_70%_70%]">{fallback}</AvatarFallback>
  </Avatar>
)

// 5. GlassAvatar
export const GlassAvatar = ({ src, fallback }: any) => (
  <div className="p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
    <Avatar>
      {src && <AvatarImage src={src} />}
      <AvatarFallback className="bg-transparent text-white">{fallback}</AvatarFallback>
    </Avatar>
  </div>
)

// 6. AnimatedBorderAvatar
export const AnimatedBorderAvatar = ({ src, fallback }: any) => (
  <div className="relative p-[2px] rounded-full overflow-hidden inline-block">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,hsl(var(--primary))_360deg)]" />
    <Avatar className="relative border-2 border-background">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  </div>
)

// 7. InitialsGradientAvatar
export const InitialsGradientAvatar = ({ initials }: any) => (
  <Avatar>
    <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg">
      {initials}
    </AvatarFallback>
  </Avatar>
)

// 8. SquareAvatar
export const SquareAvatar = ({ src, fallback }: any) => (
  <Avatar className="rounded-md border">
    {src && <AvatarImage src={src} className="rounded-md" />}
    <AvatarFallback className="rounded-md">{fallback}</AvatarFallback>
  </Avatar>
)

// 9. TooltipAvatar (Visual only for docs)
export const TooltipAvatar = ({ src, fallback, tooltip }: any) => (
  <div className="group relative inline-block">
    <Avatar className="border cursor-pointer">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {tooltip}
    </div>
  </div>
)

// 10. PulseAvatar
export const PulseAvatar = ({ src, fallback }: any) => (
  <div className="relative inline-block">
    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></span>
    <Avatar className="relative border-2 border-background">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  </div>
)
