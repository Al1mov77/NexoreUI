"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { LucideIcon } from 'lucide-react';

interface SpecialPremiumCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  gradient?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SpecialPremiumCard = ({
  title,
  description,
  icon: Icon,
  gradient = "from-pink-500 via-red-500 to-yellow-500",
  className,
  children
}: SpecialPremiumCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-1 rounded-2xl overflow-hidden group transition-all duration-300",
        className
      )}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-300",
        gradient
      )} />

      {/* Card Content */}
      <div className="relative bg-black/80 backdrop-blur-xl p-6 rounded-2xl h-full flex flex-col justify-between border border-white/10 group-hover:border-white/20 transition-colors duration-300">
        <div>
          {Icon && (
            <div className="p-3 bg-white/5 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};
