"use client"

import React from "react"

interface NexoreLogoProps {
  className?: string
  size?: number
  animate?: boolean
}

export function NexoreLogo({ className, size = 28, animate = true }: NexoreLogoProps) {
  const id = React.useId().replace(/:/g, "")

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Primary gradient — rich violet-indigo spectrum */}
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="40%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Outer glow */}
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft inner glow for bg shape */}
        <radialGradient id={`bgGlow-${id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background shape with soft glow */}
      <rect
        x="2"
        y="2"
        width="32"
        height="32"
        rx="10"
        fill={`url(#bgGlow-${id})`}
        stroke={`url(#grad-${id})`}
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />

      {/* The N lettermark — bold geometric strokes */}
      <path
        d="M11 25V11L25 25V11"
        stroke={`url(#grad-${id})`}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${id})`}
      >
        {animate && (
          <animate
            attributeName="stroke-dasharray"
            values="0 100;56 0"
            dur="1.2s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        )}
      </path>

      {/* Corner accent dot — top right */}
      <circle
        cx="28"
        cy="8"
        r="1.5"
        fill={`url(#grad-${id})`}
        opacity="0.6"
      >
        {animate && (
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  )
}
