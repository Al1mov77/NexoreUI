"use client";

import React from "react";

interface NexoreLogoProps {
  className?: string;
  size?: number;
}

export function NexoreLogo({
  className = "",
  size = 26,
}: NexoreLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      {/* Left Pillar */}
      <rect
        x="5"
        y="4"
        width="5.5"
        height="24"
        rx="2"
        fill="currentColor"
      />

      {/* Right Pillar */}
      <rect
        x="21.5"
        y="4"
        width="5.5"
        height="24"
        rx="2"
        fill="currentColor"
      />

      {/* Diagonal Connecting Ribbon */}
      <path
        d="M7.5 5.5L24.5 26.5"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Specular Core Highlight */}
      <path
        d="M8.5 6.5L23.5 25.5"
        stroke="var(--background, #09090b)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* Apex Dot */}
      <circle cx="24.5" cy="6" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default NexoreLogo;
