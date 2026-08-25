"use client";

import React from "react";

interface NexoreLogoProps {
  className?: string;
  size?: number;
}

export function NexoreLogo({
  className = "",
  size = 22,
}: NexoreLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors ${className}`}
    >
      {/* Left Vertical Bar */}
      <rect
        x="3"
        y="3.5"
        width="4"
        height="17"
        rx="1"
        fill="currentColor"
        className="text-foreground"
      />

      {/* Right Vertical Bar */}
      <rect
        x="17"
        y="3.5"
        width="4"
        height="17"
        rx="1"
        fill="currentColor"
        className="text-foreground"
      />

      {/* Dynamic Diagonal Ribbon */}
      <path
        d="M6 4.5L18 19.5"
        stroke="var(--primary, #6366f1)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default NexoreLogo;
