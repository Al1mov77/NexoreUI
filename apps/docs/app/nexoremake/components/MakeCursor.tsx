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

  const lineColor = isPointer ? '#a78bfa' : 'rgba(255,255,255,0.85)';
  const dotColor = isPointer ? '#a78bfa' : '#ffffff';
  const lineLen = isPressed ? 7 : isPointer ? 12 : 10;
  const gapFromCenter = 3;

  return (
    <>
      {/* Hide default cursor via CSS only inside the canvas wrapper */}
      <style>{`
        .make-canvas-wrapper, .make-canvas-wrapper * {
          cursor: none !important;
        }
      `}</style>

      {/* Crosshair cursor container — follows mouse exactly */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          display: isVisible ? 'block' : 'none',
          transition: 'opacity 0.15s ease',
        }}
      >
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            top: '-1.5px',
            left: '-1.5px',
            transition: 'background-color 0.2s ease',
            mixBlendMode: 'difference',
          }}
        />

        {/* Top line */}
        <div
          style={{
            position: 'absolute',
            width: '1.5px',
            height: `${lineLen}px`,
            backgroundColor: lineColor,
            left: '-0.75px',
            bottom: `${gapFromCenter}px`,
            transition: 'height 0.2s cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease',
            mixBlendMode: 'difference',
          }}
        />

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            width: '1.5px',
            height: `${lineLen}px`,
            backgroundColor: lineColor,
            left: '-0.75px',
            top: `${gapFromCenter}px`,
            transition: 'height 0.2s cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease',
            mixBlendMode: 'difference',
          }}
        />

        {/* Left line */}
        <div
          style={{
            position: 'absolute',
            width: `${lineLen}px`,
            height: '1.5px',
            backgroundColor: lineColor,
            top: '-0.75px',
            right: `${gapFromCenter}px`,
            transition: 'width 0.2s cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease',
            mixBlendMode: 'difference',
          }}
        />

        {/* Right line */}
        <div
          style={{
            position: 'absolute',
            width: `${lineLen}px`,
            height: '1.5px',
            backgroundColor: lineColor,
            top: '-0.75px',
            left: `${gapFromCenter}px`,
            transition: 'width 0.2s cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease',
            mixBlendMode: 'difference',
          }}
        />
      </div>
    </>
  );
}
