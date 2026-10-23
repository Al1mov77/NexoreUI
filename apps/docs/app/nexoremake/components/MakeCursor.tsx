'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export default function MakeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const { resolvedTheme, theme } = useTheme();

  const isLight =
    resolvedTheme === 'light' ||
    theme === 'light' ||
    (typeof document !== 'undefined' &&
      !document.documentElement.classList.contains('dark'));

  const isPointerRef = useRef(false);
  const isPressedRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      if (clientX === 0 && clientY === 0) return;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);

      // Only check interactive target when NOT dragging/pressed to avoid layout thrashing & drag lag
      if (!isPressedRef.current && e.target) {
        const target = e.target as HTMLElement | null;
        const interactive = !!target?.closest?.(
          'button, a, input, select, textarea, [role="button"], [draggable="true"], .cursor-pointer, [data-interactive="true"]'
        );
        if (interactive !== isPointerRef.current) {
          isPointerRef.current = interactive;
          setIsPointer(interactive);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleDragOver = (e: DragEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handlePointerDown = (e: PointerEvent) => {
      isPressedRef.current = true;
      setIsPressed(true);

      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 450);
    };

    const handlePointerUp = () => {
      isPressedRef.current = false;
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    // Use capture: true so we intercept events before setPointerCapture or stopPropagation!
    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true });
    window.addEventListener('mousemove', handleMouseMove, { capture: true, passive: true });
    window.addEventListener('dragover', handleDragOver, { capture: true, passive: true });
    window.addEventListener('drag', handleDragOver, { capture: true, passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });
    window.addEventListener('pointerup', handlePointerUp, { capture: true, passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, { capture: true });
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('dragover', handleDragOver, { capture: true });
      window.removeEventListener('drag', handleDragOver, { capture: true });
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      window.removeEventListener('pointerup', handlePointerUp, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <style>{`
        html, body, *, *::before, *::after {
          cursor: none !important;
        }
        #nexore-demo-cursor-root {
          transition: opacity 0.15s ease !important;
          will-change: transform;
        }
        @keyframes make-demo-ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.25);
            opacity: 0.65;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
          }
        }
      `}</style>

      {/* Screen Studio style click ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="fixed pointer-events-none z-[99998]"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.25)',
            border: isLight ? '1.5px solid rgba(0, 0, 0, 0.35)' : '1.5px solid rgba(255, 255, 255, 0.55)',
            animation: 'make-demo-ripple 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* Classic Demo Video Cursor (Zero-lag Vector Arrow Pointer) */}
      <div
        id="nexore-demo-cursor-root"
        ref={cursorRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        <div
          style={{
            transform: isPressed ? 'scale(0.92)' : isPointer ? 'scale(1.08)' : 'scale(1)',
            transformOrigin: '0 0',
            transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: isLight
              ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.28))'
              : 'drop-shadow(0 2px 6px rgba(0,0,0,0.75))',
          }}
        >
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L1 18.5L5.5 14.5L8.5 21L11 20L8 13.5L13.5 13.5L1 1Z"
              fill={isLight ? '#18181b' : '#fafafa'}
              stroke={isLight ? '#ffffff' : '#09090b'}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
