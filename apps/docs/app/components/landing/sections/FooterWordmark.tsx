"use client";

import React, { useEffect, useRef } from "react";

interface FooterWordmarkProps {
  text?: string;
  className?: string;
}

export function FooterWordmark({
  text = "NEXOREUI",
  className = "",
}: FooterWordmarkProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
        }
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const letters = Array.from(text).map((char, i) => (
    <span
      key={i}
      className="nx-l"
      style={{ "--i": i, "--n": text.length } as React.CSSProperties}
    >
      {char}
    </span>
  ));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`nx-word ${className}`.trim()}
      style={{ "--n": text.length } as React.CSSProperties}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const style = e.currentTarget.style;
        style.setProperty("--x", `${e.clientX - rect.left}px`);
        style.setProperty("--y", `${e.clientY - rect.top}px`);
        style.setProperty("--o", "1");
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--o", "0");
      }}
    >
      <div className="nx-row">{letters}</div>
      <div className="nx-row nx-glow">{letters}</div>
    </div>
  );
}

export default FooterWordmark;
