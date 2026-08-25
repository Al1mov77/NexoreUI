'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function MakeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Show custom cursor only when hovering the active canvas drawing area
      const inCanvas = !!target && !!target.closest('.make-canvas-wrapper');
      
      setIsVisible(inCanvas);

      if (inCanvas) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Cursor follows instantly — no spring delay
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }

        // Check if hovering interactive element
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], [draggable="true"], [onMouseDown]');
        setIsPointer(!!interactive);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Figma-style colors: violet glow on interactive hover, white on neutral
  const accentColor = isPointer ? 'rgba(167, 139, 250, 1)' : 'rgba(255, 255, 255, 0.9)';
  const glowColor = isPointer ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)';
  const lineLen = isPressed ? 8 : isPointer ? 14 : 12;
  const gapFromCenter = 4;
  const dotSize = isPressed ? 4 : 3;

  return (
    <>
      {/* Hide default cursor via CSS only inside the canvas wrapper */}
      <style>{`
        .make-canvas-wrapper, .make-canvas-wrapper * {
          cursor: none !important;
        }
      `}</style>

      {/* Figma-style crosshair cursor — follows mouse exactly */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          display: isVisible ? 'block' : 'none',
          transition: 'opacity 0.15s ease',
        }}
      >
        {/* Outer glow ring — soft halo effect */}
        <div
          style={{
            position: 'absolute',
            width: isPressed ? '18px' : '22px',
            height: isPressed ? '18px' : '22px',
            borderRadius: '50%',
            top: isPressed ? '-9px' : '-11px',
            left: isPressed ? '-9px' : '-11px',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: !isPressed && !isPointer ? 'make-cursor-glow 2.5s ease-in-out infinite' : 'none',
          }}
        />

        {/* Center dot with glow */}
        <div
          style={{
            position: 'absolute',
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: '50%',
            backgroundColor: accentColor,
            top: `${-dotSize / 2}px`,
            left: `${-dotSize / 2}px`,
            boxShadow: `0 0 6px ${glowColor}, 0 0 12px ${isPointer ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Top line — gradient fade */}
        <div
          style={{
            position: 'absolute',
            width: '1.5px',
            height: `${lineLen}px`,
            left: '-0.75px',
            bottom: `${gapFromCenter}px`,
            background: `linear-gradient(to top, ${accentColor}, transparent)`,
            transition: 'height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Bottom line — gradient fade */}
        <div
          style={{
            position: 'absolute',
            width: '1.5px',
            height: `${lineLen}px`,
            left: '-0.75px',
            top: `${gapFromCenter}px`,
            background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
            transition: 'height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Left line — gradient fade */}
        <div
          style={{
            position: 'absolute',
            width: `${lineLen}px`,
            height: '1.5px',
            top: '-0.75px',
            right: `${gapFromCenter}px`,
            background: `linear-gradient(to left, ${accentColor}, transparent)`,
            transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Right line — gradient fade */}
        <div
          style={{
            position: 'absolute',
            width: `${lineLen}px`,
            height: '1.5px',
            top: '-0.75px',
            left: `${gapFromCenter}px`,
            background: `linear-gradient(to right, ${accentColor}, transparent)`,
            transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </>
  );
}
