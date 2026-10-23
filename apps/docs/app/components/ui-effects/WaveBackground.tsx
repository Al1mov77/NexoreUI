"use client";

import React, { useEffect, useRef, useState } from "react";

interface WaveColors {
  bg: [number, number, number];
  ink: [number, number, number];
}

function parseColorToRgb(colorStr: string, fallback: [number, number, number]): [number, number, number] {
  if (!colorStr) return fallback;
  const match = colorStr.match(/\d+(\.\d+)?/g);
  if (match && match.length >= 3) {
    const r = parseFloat(match[0]) / 255;
    const g = parseFloat(match[1]) / 255;
    const b = parseFloat(match[2]) / 255;
    return [
      Math.max(0, Math.min(1, Number.isFinite(r) ? r : fallback[0])),
      Math.max(0, Math.min(1, Number.isFinite(g) ? g : fallback[1])),
      Math.max(0, Math.min(1, Number.isFinite(b) ? b : fallback[2])),
    ];
  }
  return fallback;
}

function getThemeColors(): WaveColors {
  if (typeof window === "undefined") {
    return { bg: [0.035, 0.035, 0.043], ink: [0.98, 0.98, 0.98] };
  }

  const cs = window.getComputedStyle(document.body);
  const isDark =
    document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark";

  const defaultBg: [number, number, number] = isDark ? [0.035, 0.035, 0.043] : [1, 1, 1];
  const defaultInk: [number, number, number] = isDark ? [0.98, 0.98, 0.98] : [0.035, 0.035, 0.043];

  const parsedBg = parseColorToRgb(cs.backgroundColor, defaultBg);
  const parsedInk = parseColorToRgb(cs.color, defaultInk);

  return { bg: parsedBg, ink: parsedInk };
}

export function useWaveShader(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const vsSource = `
      attribute vec2 a;
      void main() {
        gl_Position = vec4(a, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 r;
      uniform float t;
      uniform float s;
      uniform vec2 m;
      uniform vec3 bg;
      uniform vec3 ink;

      void main() {
        vec2 uv = gl_FragCoord.xy / r;
        float asp = r.x / r.y;
        vec2 p = vec2((uv.x - 0.5) * asp * 2.0, (uv.y - 0.5) * 2.0);
        p += (m - 0.5) * vec2(0.08, 0.05);

        float px = 2.2 / r.y;
        float a = 0.0;
        float h = 0.0;

        for (int i = 0; i < 48; i++) {
          float f = float(i) / 47.0;
          float g = f * 2.0 - 1.0;
          float spread = 0.66 + 0.40 * sin(p.x * 0.55 + t * 0.06 + s * 0.8);
          float amp = 0.09 + 0.24 * (1.0 - abs(g)) * (1.0 + 0.35 * sin(s * 1.3));
          float y = g * spread
            + sin(p.x * 1.25 + f * 2.4 + t * 0.30 + s * 1.9) * amp
            + sin(p.x * 2.6 - f * 1.5 + t * 0.19 - s * 0.9) * 0.05
            - 0.12;
          float d = abs(p.y - y);
          float w = 1.0 - 0.45 * abs(g);
          a += smoothstep(2.4 * px, 0.0, d) * (0.34 + 0.40 * (1.0 - abs(g)));
          h += exp(-d * d * 1400.0) * 0.028 * w;
        }

        a = min(a + h, 1.0);
        vec3 col = mix(bg, ink, a * 0.22);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "r");
    const uTime = gl.getUniformLocation(program, "t");
    const uScroll = gl.getUniformLocation(program, "s");
    const uMouse = gl.getUniformLocation(program, "m");
    const uBg = gl.getUniformLocation(program, "bg");
    const uInk = gl.getUniformLocation(program, "ink");

    let colors = getThemeColors();
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let sc = 0;
    let ssc = 0;
    let isVisible = true;
    let isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId: number | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const updateColors = () => {
      colors = getThemeColors();
    };

    const draw = (now: number) => {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      ssc += (sc - ssc) * 0.08;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform1f(uScroll, ssc);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform3f(uBg, colors.bg[0], colors.bg[1], colors.bg[2]);
      gl.uniform3f(uInk, colors.ink[0], colors.ink[1], colors.ink[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();
    updateColors();

    const renderLoop = (now: number) => {
      if (!isVisible) {
        rafId = null;
        return;
      }
      draw(now);
      if (!isReducedMotion) {
        rafId = requestAnimationFrame(renderLoop);
      } else {
        rafId = null;
      }
    };

    // Draw initial frame
    draw(performance.now());
    if (!isReducedMotion) {
      rafId = requestAnimationFrame(renderLoop);
    }

    const onPointerMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight;
      if (isReducedMotion && isVisible) {
        draw(performance.now());
      }
    };

    const onScroll = () => {
      sc = window.scrollY / Math.max(1, window.innerHeight);
      if (isReducedMotion && isVisible) {
        draw(performance.now());
      }
    };

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (isVisible) draw(performance.now());
      }, 100);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (!isReducedMotion && isVisible && !rafId) {
        rafId = requestAnimationFrame(renderLoop);
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    const observer = new MutationObserver(() => {
      updateColors();
      if (isVisible) draw(performance.now());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !isReducedMotion && !rafId) {
          rafId = requestAnimationFrame(renderLoop);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
      io.disconnect();

      gl.deleteBuffer(buffer);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteProgram(program);

      const loseExt = gl.getExtension("WEBGL_lose_context");
      if (loseExt) {
        loseExt.loseContext();
      }
    };
  }, [canvasRef]);
}

export function WaveBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useWaveShader(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full select-none ${className}`}
    />
  );
}

export default WaveBackground;
