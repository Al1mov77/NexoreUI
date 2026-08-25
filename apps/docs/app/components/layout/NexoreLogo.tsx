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
      <defs>
        {/* Left Pillar Gradient */}
        <linearGradient id="nx_left_grad" x1="5" y1="4" x2="11" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary, #6366f1)" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Right Pillar Gradient */}
        <linearGradient id="nx_right_grad" x1="21" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Diagonal Ribbon Gradient */}
        <linearGradient id="nx_diag_grad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="var(--primary, #6366f1)" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Left Pillar */}
      <rect
        x="5"
        y="4"
        width="5.5"
        height="24"
        rx="2"
        fill="url(#nx_left_grad)"
      />

      {/* Right Pillar */}
      <rect
        x="21.5"
        y="4"
        width="5.5"
        height="24"
        rx="2"
        fill="url(#nx_right_grad)"
      />

      {/* Diagonal Connecting Ribbon */}
      <path
        d="M7.5 5.5L24.5 26.5"
        stroke="url(#nx_diag_grad)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Specular White Core Highlight */}
      <path
        d="M8.5 6.5L23.5 25.5"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Radiant Apex Dot */}
      <circle cx="24.5" cy="6" r="1.8" fill="#38bdf8" />
    </svg>
  );
}

export default NexoreLogo;
