"use client"

import * as React from "react"
import { Search, Mail, AlertCircle, CheckCircle, Upload } from "lucide-react"
import { cn } from "../utils/cn"

// 1. FloatingLabelInput
export const FloatingLabelInput = ({ label, ...props }: any) => (
  <div className="relative">
    <input className="peer w-full border-b-2 border-muted-foreground/30 bg-transparent py-2 pt-6 focus:border-primary focus:outline-none placeholder-transparent" placeholder={label} {...props} />
    <label className="absolute left-0 top-1 text-xs text-primary transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary pointer-events-none">{label}</label>
  </div>
)

// 2. UnderlineInput
export const UnderlineInput = ({ ...props }: any) => (
  <input className="w-full border-b-2 border-muted-foreground bg-transparent py-2 focus:border-primary focus:outline-none transition-colors" {...props} />
)

// 3. IconInputLeft
export const IconInputLeft = ({ icon: Icon = Search, ...props }: any) => (
  <div className="relative flex items-center">
    <Icon className="absolute left-3 h-5 w-5 text-muted-foreground" />
    <input className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" {...props} />
  </div>
)

// 4. IconInputRight
export const IconInputRight = ({ icon: Icon = Mail, ...props }: any) => (
  <div className="relative flex items-center">
    <input className="w-full rounded-md border border-border bg-background py-2 pl-4 pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" {...props} />
    <Icon className="absolute right-3 h-5 w-5 text-muted-foreground" />
  </div>
)

// 5. PillInput
export const PillInput = ({ ...props }: any) => (
  <input className="w-full rounded-full border border-border bg-background px-6 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" {...props} />
)

// 6. ErrorInput
export const ErrorInput = ({ errorMessage, ...props }: any) => (
  <div className="flex flex-col gap-1">
    <div className="relative flex items-center">
      <input className="w-full rounded-md border border-destructive bg-background py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-destructive text-destructive" {...props} />
      <AlertCircle className="absolute right-3 h-5 w-5 text-destructive" />
    </div>
    <span className="text-xs text-destructive">{errorMessage}</span>
  </div>
)

// 7. SuccessInput
export const SuccessInput = ({ ...props }: any) => (
  <div className="relative flex items-center">
    <input className="w-full rounded-md border border-green-500 bg-background py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-green-500 text-green-600" {...props} />
    <CheckCircle className="absolute right-3 h-5 w-5 text-green-500" />
  </div>
)

// 8. GhostInput
export const GhostInput = ({ ...props }: any) => (
  <input className="w-full bg-transparent px-4 py-2 font-medium placeholder-muted-foreground/50 focus:bg-muted/50 focus:outline-none rounded-md transition-colors" {...props} />
)

// 9. NeumorphicInput
export const NeumorphicInput = ({ ...props }: any) => (
  <input className="w-full rounded-xl bg-background px-4 py-3 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] focus:outline-none border border-transparent focus:border-primary/20" {...props} />
)

// 10. MinimalDropInput (simplified file input wrapper)
export const MinimalDropInput = ({ label = "Choose File", ...props }: any) => (
  <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 py-6 hover:bg-muted/50 transition-colors">
    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
    <span className="text-sm font-medium">{label}</span>
    <input type="file" className="hidden" {...props} />
  </label>
)
