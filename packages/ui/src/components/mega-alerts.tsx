"use client"

import * as React from "react"
import { AlertCircle, Info, CheckCircle2, XCircle, Cookie, BellRing } from "lucide-react"
import { cn } from "../utils/cn"

// 1. CyberAlert
export const CyberAlert = ({ title, description }: any) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null;
  return (
    <div className="border-l-4 border-yellow-400 bg-black text-white p-4 shadow-[4px_4px_0_0_rgba(250,204,21,1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 cursor-pointer hover:bg-yellow-500" onClick={() => setVisible(false)}>DISMISS</div>
      <h4 className="font-mono font-bold tracking-tight text-yellow-400 uppercase pr-10">{title}</h4>
      <p className="font-mono text-sm opacity-90">{description}</p>
    </div>
  )
}

// 2. SoftAlert
export const SoftAlert = ({ title, description, type = "info" }: any) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null;
  const colors = type === "error" ? "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300" : "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
  return (
    <div className={`p-4 rounded-2xl ${colors} relative`}>
      <button onClick={() => setVisible(false)} className="absolute top-4 right-4 hover:opacity-70"><XCircle className="w-5 h-5" /></button>
      <h4 className="font-bold mb-1 pr-6">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  )
}

// 3. MinimalAlert
export const MinimalAlert = ({ text }: any) => (
  <div className="flex items-center gap-3 py-2 px-4 border rounded-full text-sm font-medium w-fit">
    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
    {text}
  </div>
)

// 4. LeftBorderAlert
export const LeftBorderAlert = ({ title, description }: any) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null;
  return (
    <div className="border-l-4 border-primary bg-muted/50 p-4 relative">
      <button onClick={() => setVisible(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><XCircle className="w-4 h-4" /></button>
      <h4 className="font-semibold pr-6">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

// 5. IconTopAlert
export const IconTopAlert = ({ title, description, icon: Icon = AlertCircle }: any) => (
  <div className="flex flex-col items-center text-center p-6 bg-card border rounded-xl">
    <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
)

// 6. SolidAlert
export const SolidAlert = ({ title, description }: any) => (
  <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
    <div className="flex gap-3">
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>
    </div>
  </div>
)

// 7. ToastAlertWrapper (Visual representation)
export const ToastAlertWrapper = ({ title, description, time }: any) => (
  <div className="max-w-sm w-full bg-background border shadow-xl rounded-lg p-4 flex gap-4 items-start pointer-events-none">
    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="font-medium text-sm">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    <span className="text-xs text-muted-foreground">{time}</span>
  </div>
)

// 8. BannerAlert
export const BannerAlert = ({ text, actionText }: any) => (
  <div className="w-full bg-indigo-600 text-white px-4 py-3 flex items-center justify-between sm:rounded-lg">
    <div className="flex items-center gap-3">
      <BellRing className="h-5 w-5" />
      <p className="text-sm font-medium">{text}</p>
    </div>
    <button className="text-sm font-bold bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors">{actionText}</button>
  </div>
)

// 9. CookieAlert
export const CookieAlert = () => (
  <div className="max-w-md bg-card border rounded-xl p-6 shadow-2xl">
    <div className="flex items-center gap-3 mb-4">
      <Cookie className="h-6 w-6 text-orange-500" />
      <h4 className="font-bold">Cookie Preferences</h4>
    </div>
    <p className="text-sm text-muted-foreground mb-6">We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.</p>
    <div className="flex gap-3">
      <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Accept All</button>
      <button className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted">Decline</button>
    </div>
  </div>
)

// 10. NeonAlert
export const NeonAlert = ({ title, description }: any) => (
  <div className="p-4 rounded-lg border border-purple-500 bg-purple-500/10 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
    <h4 className="font-bold text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">{title}</h4>
    <p className="text-sm mt-1">{description}</p>
  </div>
)
