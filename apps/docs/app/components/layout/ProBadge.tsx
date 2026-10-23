"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className = "" }: ProBadgeProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[3px] px-1 py-[1px] font-mono text-[8px] font-black tracking-[0.16em] uppercase select-none border border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-400 dark:border-blue-400/50 dark:bg-blue-950/70 shadow-[0_0_8px_-1px_rgba(59,130,246,0.35)] transition-all pointer-events-none ${className}`}
      aria-label="Pro Status"
    >
      {/* Minimalist laser light sheen */}
      {!shouldReduceMotion && (
        <motion.span
          initial={{ x: "-160%" }}
          animate={{ x: "260%" }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            repeatDelay: 2.4,
            ease: "easeInOut",
          }}
          className="absolute inset-y-0 w-3 -skew-x-20 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none"
        />
      )}
      <span className="relative z-10 leading-none">PRO</span>
    </span>
  );
}
