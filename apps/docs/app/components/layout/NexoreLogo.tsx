"use client";

import React from "react";

interface NexoreLogoProps {
  className?: string;
  size?: number;
  withBadge?: boolean;
  withGlow?: boolean;
}

export function NexoreLogo({
  className = "",
  size = 36,
  withBadge = false,
  withGlow = false,
}: NexoreLogoProps) {
  if (withBadge) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 group shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* Ambient Glow */}
        {withGlow && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/50 via-violet-500/40 to-cyan-400/40 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none scale-110" />
        )}

        {/* Badge Frame */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-zinc-800/95 to-zinc-950 dark:from-zinc-900 dark:to-black p-1 border border-white/20 dark:border-white/15 shadow-xl shadow-black/25 flex items-center justify-center">
          <NexoreLogoMark size={Math.round(size * 0.82)} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 bg-primary/40 blur-md rounded-full pointer-events-none scale-125" />
      )}
      <NexoreLogoMark size={size} />
    </div>
  );
}

/* ─── Nexore High-End Geometric 'N' Logo Mark (Vector SVG) ─── */
function NexoreLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        {/* Primary Radiant Gradient */}
        <linearGradient id="nx_grad_main" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary, #6366f1)" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Left Column Gradient */}
        <linearGradient id="nx_grad_left" x1="4" y1="4" x2="14" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary, #6366f1)" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Right Column Gradient */}
        <linearGradient id="nx_grad_right" x1="22" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Diagonal Ribbon Gradient with Specular Sheen */}
        <linearGradient id="nx_grad_diagonal" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="45%" stopColor="#c084fc" />
          <stop offset="75%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>

        {/* Subtle Drop Shadow for 3D Depth */}
        <filter id="nx_depth_shadow" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Hex/Octagonal Modern Outer Frame (Subtle) */}
      <rect
        x="1.5"
        y="1.5"
        width="33"
        height="33"
        rx="9"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="url(#nx_grad_main)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Left Column Pillar */}
      <rect
        x="6"
        y="6.5"
        width="6.5"
        height="23"
        rx="3.2"
        fill="url(#nx_grad_left)"
      />

      {/* Right Column Pillar */}
      <rect
        x="23.5"
        y="6.5"
        width="6.5"
        height="23"
        rx="3.2"
        fill="url(#nx_grad_right)"
      />

      {/* Diagonal Luminous Floating Ribbon (Core 'N' Crossbar) */}
      <g filter="url(#nx_depth_shadow)">
        <path
          d="M9 9.5L27 26.5"
          stroke="url(#nx_grad_diagonal)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Specular Center Highlight Core */}
        <path
          d="M10 10.5L26 25.5"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
      </g>

      {/* Top-Right Glowing Sparkle Orb */}
      <circle cx="27" cy="7" r="2.5" fill="#38bdf8" />
      <circle cx="27" cy="7" r="1.2" fill="#ffffff" />
    </svg>
  );
}

export default NexoreLogo;
