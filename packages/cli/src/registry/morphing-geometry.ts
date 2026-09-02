export const morphingGeometry = {
  name: "morphing-geometry",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "morphing-geometry.tsx",
  content: `'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export type MorphingShape = 'pill' | 'circle' | 'square' | 'squircle' | 'custom';
export type MorphingVariant = 'gradient' | 'aurora' | 'neon' | 'glass' | 'outline' | 'subtle';
export type MorphingColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'rainbow' | 'mono';
export type MorphingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export interface MorphingGeometryProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  shape?: MorphingShape;
  radius?: number | string;
  variant?: MorphingVariant;
  color?: MorphingColor;
  size?: MorphingSize;
  dimension?: number;
  spin?: boolean;
  spinDuration?: number;
  interactive?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const MorphingGeometry = React.forwardRef<HTMLDivElement, MorphingGeometryProps>(
  (
    {
      shape = 'squircle',
      radius,
      variant = 'gradient',
      color = 'violet',
      size = 'md',
      dimension,
      spin = false,
      spinDuration = 6,
      interactive = false,
      glow = true,
      icon,
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        animate={spin ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
        transition={{ rotate: { duration: spinDuration, repeat: Infinity, ease: 'linear' }, borderRadius: { duration: 0.4 } }}
        className={cn('relative flex items-center justify-center select-none overflow-hidden transition-all duration-300 w-24 h-24', className)}
        style={{ borderRadius: radius || '24%', ...style }}
        {...props}
      >
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          {icon || children || <Sparkles className="w-6 h-6 text-white" />}
        </div>
      </motion.div>
    );
  }
);

MorphingGeometry.displayName = 'MorphingGeometry';
export default MorphingGeometry;
`
};
