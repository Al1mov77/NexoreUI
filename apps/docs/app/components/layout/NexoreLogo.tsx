"use client";

import React from "react";

interface NexoreLogoProps {
  className?: string;
  size?: number;
}

export function NexoreLogo({ className, size = 24 }: NexoreLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Bar */}
      <path
        d="M4 5C4 4.44772 4.44772 4 5 4H7C7.55228 4 8 4.44772 8 5V19C8 19.5523 7.55228 20 7 20H5C4.44772 20 4 19.5523 4 19V5Z"
        fill="currentColor"
      />
      {/* Right Bar */}
      <path
        d="M16 5C16 4.44772 16.4477 4 17 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V5Z"
        fill="currentColor"
      />
      {/* Diagonal Connecting Ribbon */}
      <path
        d="M8.5 6.5L15.5 17.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default NexoreLogo;
