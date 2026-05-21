"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

interface BaseAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

// 1. FadeIn
export const FadeIn = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 2. SlideUp
export const SlideUp = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 3. SlideDown
export const SlideDown = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 4. SlideLeft
export const SlideLeft = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 5. SlideRight
export const SlideRight = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 6. ScaleIn
export const ScaleIn = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 7. Bounce
export const Bounce = ({ children, delay = 0 }: Omit<BaseAnimationProps, 'duration'>) => (
  <motion.div
    initial={{ y: -20 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", bounce: 0.5, delay }}
  >
    {children}
  </motion.div>
)

// 8. Flip
export const Flip = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div
    initial={{ rotateX: 90, opacity: 0 }}
    animate={{ rotateX: 0, opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
)

// 9. Rotate
export const Rotate = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div
    initial={{ rotate: -180, opacity: 0 }}
    animate={{ rotate: 0, opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
)

// 10. Pulse (Continuous)
export const PulseAnim = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    {children}
  </motion.div>
)

// 11. Float (Continuous)
export const Float = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 12. Wiggle (Hover)
export const WiggleHover = ({ children }: { children: React.ReactNode }) => (
  <motion.div whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
)

// 13. Heartbeat
export const Heartbeat = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ scale: [1, 1.1, 1, 1.1, 1] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 14. Reveal (Clip-path)
export const RevealClip = ({ children, delay = 0, duration = 0.8 }: BaseAnimationProps) => (
  <motion.div
    initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    transition={{ delay, duration, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 15. StaggerContainer & Item
export const StaggerContainer = ({ children, delayChildren = 0.1, staggerChildren = 0.1 }: { children: React.ReactNode; delayChildren?: number; staggerChildren?: number }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren, delayChildren }
      }
    }}
    initial="hidden"
    animate="show"
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
    {children}
  </motion.div>
)

// New Components requested by user

export interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: boolean;
  className?: string;
}

export function TypingAnimation({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  cursor = true,
  className,
}: TypingAnimationProps) {
  const [textIndex, setTextIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!texts || texts.length === 0) return;

    let timer: any;

    const handleTyping = () => {
      const fullText = texts[textIndex];
      if (!fullText) return;

      if (!isDeleting) {
        const nextText = fullText.slice(0, currentText.length + 1);
        setCurrentText(nextText);
        
        if (nextText === fullText) {
          if (loop || textIndex < texts.length - 1) {
            timer = setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        } else {
          timer = setTimeout(handleTyping, speed);
        }
      } else {
        const nextText = fullText.slice(0, currentText.length - 1);
        setCurrentText(nextText);
        
        if (nextText === "") {
          setIsDeleting(false);
          setTextIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= texts.length) {
              return loop ? 0 : prevIndex;
            }
            return nextIndex;
          });
        } else {
          timer = setTimeout(handleTyping, deleteSpeed);
        }
      }
    };

    timer = setTimeout(handleTyping, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration, loop]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{currentText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="ml-0.5 inline-block w-[2px] h-[1.1em] bg-current font-normal align-middle"
        >
          |
        </motion.span>
      )}
    </span>
  );
}
