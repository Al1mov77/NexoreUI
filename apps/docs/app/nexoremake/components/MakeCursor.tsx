'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function MakeCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Show custom cursor only when hovering the active canvas drawing area
      const inCanvas = !!target && !!target.closest('.make-canvas-wrapper');
      
      setIsVisible(inCanvas);

      if (inCanvas) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        }

        // Check if hovering interactive element
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], [draggable="true"], [onMouseDown]');
        setIsPointer(!!interactive);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Ring follows with spring-like delay
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }

      requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    const rafId = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Hide default cursor via CSS only inside the canvas wrapper */}
      <style>{`
        .make-canvas-wrapper, .make-canvas-wrapper * {
          cursor: none !important;
        }
      `}</style>

      {/* Inner dot — follows cursor exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isPointer ? '#a78bfa' : '#ffffff',
          opacity: isVisible ? 1 : 0,
          display: isVisible ? 'block' : 'none',
          transition: 'background-color 0.2s ease, opacity 0.15s ease',
          mixBlendMode: 'difference',
        }}
      />

      {/* Outer ring — follows with spring delay */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: isPressed ? '24px' : isPointer ? '40px' : '32px',
          height: isPressed ? '24px' : isPointer ? '40px' : '32px',
          borderRadius: '50%',
          border: `1.5px solid ${isPointer ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.3)'}`,
          opacity: isVisible ? 1 : 0,
          display: isVisible ? 'block' : 'none',
          transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, opacity 0.15s ease',
          transform: 'translate(-16px, -16px)',
        }}
      />
    </>
  );
}
