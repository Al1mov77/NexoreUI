"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, X, AlertTriangle, WifiOff, FileBox, UploadCloud } from "lucide-react"

// 1. ConfettiSuccess (Visual)
export const ConfettiSuccess = () => (
  <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-card text-center relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none flex justify-center">
      {[1,2,3,4,5,6].map(i => <motion.div key={i} animate={{ y: [0, 100], x: [(i%2===0?1:-1)*20, (i%2===0?1:-1)*40], opacity: [1, 0], rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.2 }} className={`w-2 h-2 absolute top-0 ${i%3===0?'bg-red-500':i%2===0?'bg-blue-500':'bg-yellow-500'}`} />)}
    </div>
    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 relative z-10"><CheckCircle2 className="w-8 h-8" /></div>
    <h3 className="text-2xl font-bold mb-2 relative z-10">Payment Successful!</h3>
    <p className="text-muted-foreground relative z-10">Your order #12345 has been processed.</p>
  </div>
)

// 2. ActionToast
export const ActionToast = () => (
  <div className="flex items-center justify-between p-4 bg-foreground text-background rounded-lg shadow-xl max-w-sm mx-auto">
    <div><p className="text-sm font-medium">Item moved to trash</p></div>
    <div className="flex gap-4 items-center"><button className="text-sm font-bold text-primary hover:underline">Undo</button><button><X className="w-4 h-4 text-muted" /></button></div>
  </div>
)

// 3. MultiStepProgress
export const MultiStepProgress = ({ current = 2 }: any) => (
  <div className="w-full">
    <div className="flex justify-between mb-2 text-sm font-medium"><span className="text-primary">Cart</span><span className="text-primary">Shipping</span><span className="text-muted-foreground">Payment</span></div>
    <div className="flex h-2 bg-muted rounded-full overflow-hidden"><div className="w-1/3 bg-primary border-r-2 border-background" /><div className="w-1/3 bg-primary/50" /></div>
  </div>
)

// 4. SkeletonList
export const SkeletonList = () => (
  <div className="space-y-4 w-full border p-4 rounded-xl bg-card">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-1/3 animate-pulse" /><div className="h-3 bg-muted rounded w-1/2 animate-pulse" /></div>
      </div>
    ))}
  </div>
)

// 5. EmptyStatePro
export const EmptyStatePro = () => (
  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground"><FileBox className="w-8 h-8" /></div>
    <h3 className="text-xl font-bold mb-2">No projects found</h3>
    <p className="text-muted-foreground mb-6 max-w-sm">Get started by creating a new project. You can also import an existing one.</p>
    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:opacity-90">Create Project</button>
  </div>
)

// 6. TooltipForm (Visual)
export const TooltipForm = () => (
  <div className="relative inline-block mt-8">
    <button className="px-4 py-2 bg-muted rounded-md font-medium">Hover me</button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-card border shadow-xl rounded-lg z-10">
      <h4 className="font-bold text-sm mb-2">Quick Edit</h4>
      <input className="w-full p-2 border rounded text-xs mb-2 bg-background" placeholder="New name..." />
      <button className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded">Save</button>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-b border-r transform rotate-45" />
    </div>
  </div>
)

// 7. OfflineBanner
export const OfflineBanner = () => (
  <div className="w-full bg-destructive text-destructive-foreground p-3 flex justify-center items-center gap-2 text-sm font-medium shadow-sm">
    <WifiOff className="w-4 h-4" /> You are currently offline. Some features may be unavailable.
  </div>
)

// 8. RateLimitAlert
export const RateLimitAlert = () => (
  <div className="border border-orange-500/50 bg-orange-500/10 p-4 rounded-xl flex gap-3 items-start">
    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
    <div>
      <h4 className="font-bold text-orange-600 dark:text-orange-400">Rate Limit Exceeded</h4>
      <p className="text-sm text-orange-600/80 dark:text-orange-400/80 mt-1 mb-3">You have made too many requests. Please wait 45 seconds before trying again.</p>
      <div className="w-full h-1.5 bg-orange-500/20 rounded-full overflow-hidden"><motion.div animate={{ width: ["100%", "0%"] }} transition={{ duration: 45 }} className="h-full bg-orange-500" /></div>
    </div>
  </div>
)

// 9. PasswordStrengthMeter
export const PasswordStrengthMeter = ({ score = 3 }: any) => (
  <div className="w-full max-w-sm space-y-2">
    <input type="password" placeholder="Password" className="w-full p-2 border rounded-md" defaultValue="Str0ngP@ss" />
    <div className="flex gap-1 h-1.5">
      {[1, 2, 3, 4].map(i => <div key={i} className={`flex-1 rounded-full ${i <= score ? (score < 2 ? 'bg-red-500' : score < 4 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-muted'}`} />)}
    </div>
    <p className={`text-xs font-medium ${score < 2 ? 'text-red-500' : score < 4 ? 'text-yellow-500' : 'text-green-500'}`}>{score < 2 ? 'Weak' : score < 4 ? 'Good' : 'Strong'}</p>
  </div>
)

// 10. UploadProgress
export const UploadProgress = () => (
  <div className="w-full max-w-sm border rounded-lg p-3 flex items-center gap-4 bg-card shadow-sm">
    <div className="p-2 bg-primary/10 text-primary rounded-md"><UploadCloud className="w-5 h-5" /></div>
    <div className="flex-1">
      <div className="flex justify-between text-sm mb-1"><span className="font-medium truncate max-w-[150px]">design-assets.zip</span><span className="text-muted-foreground">45%</span></div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary w-[45%]" /></div>
    </div>
    <button><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
  </div>
)
