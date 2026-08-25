"use client";

import React from "react";

interface NexoreLogoProps {
  className?: string;
  size?: number;
  rounded?: string;
}

export function NexoreLogo({
  className = "",
  size = 26,
  rounded = "rounded-lg",
}: NexoreLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105 ${rounded} ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/nexore-avatar.png"
        alt="NexoreUI Logo"
        width={size}
        height={size}
        className={`w-full h-full object-cover select-none ${rounded}`}
      />
    </div>
  );
}

export default NexoreLogo;
