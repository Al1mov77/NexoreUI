"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import { Check, Copy } from "lucide-react"

// ============================================
// CopyButton — Button with copy-to-clipboard state
// ============================================
export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The value to copy to clipboard */
  value: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium",
        "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-colors",
        className
      )}
      {...props}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}
