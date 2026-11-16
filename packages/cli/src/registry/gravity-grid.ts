export const gravityGrid = {
  name: "gravity-grid",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "gravity-grid.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface GravityGridProps extends React.HTMLAttributes<HTMLCanvasElement> {
  cell?: number;
  lw?: number;
  mass?: number;
  fall?: number;
  dots?: number;
  wave?: number;
  glow?: number;
  lag?: number;
  bg?: string;
  ink?: string;
  hot?: string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0,P1,P2;uniform float T;
uniform float cell,lw,mass,fall,dots,wave,glow;uniform vec3 bg,ink,hot;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-R)/R.y,q=p;float gs=0.;
  for(int i=0;i<3;i++){
    vec2 m=i==0?P0:(i==1?P1:P2);float w=i==0?1.:(i==1?.65:.4);vec2 d=p-m;float r2=dot(d,d);
    float g=max(mass*w*exp(-r2*fall)*(1.+wave*.5*sin(sqrt(r2)*14.-T*3.)),-.9);q+=d*g;gs+=g;
  }
  float mg=1.+max(gs,-.9);vec2 u=q*cell*.5,f=fract(u)-.5,dl=(.5-abs(f))/cell*2./mg;
  float aa=3./R.y,dd=length(f)/cell*2./mg;
  float la=1.-smoothstep(lw*.5,lw*.5+aa,min(dl.x,dl.y)),da=1.-smoothstep(lw*1.8,lw*1.8+aa,dd);
  vec3 col=bg+hot*glow*.5*exp(-dot(p-P0,p-P0)*fall*.6);
  col=mix(col,mix(ink,hot,clamp(gs*.45,0.,1.)),mix(la,da,dots));
  gl_FragColor=vec4(col,1.);
}\`;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export const GravityGrid = forwardRef<HTMLCanvasElement, GravityGridProps>(function GravityGrid(
  {
    cell = 24,
    lw = 0.012,
    mass = 1.6,
    fall = 3.2,
    dots = 0,
    wave = 0.5,
    glow = 0.6,
    lag = 0.1,
    bg = "#0b0c12",
    ink = "#cfd6ee",
    hot = "#ff6a3d",
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const P = [0, 0, 0, 0, 0, 0];
    const m = { x: 0, y: 0 };
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P[0] += (tx - P[0]) * 0.14;
      P[1] += (ty - P[1]) * 0.14;
      P[2] += (P[0] - P[2]) * lag;
      P[3] += (P[1] - P[3]) * lag;
      P[4] += (P[2] - P[4]) * lag;
      P[5] += (P[3] - P[5]) * lag;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P[0], P[1]);
      gl.uniform2f(gl.getUniformLocation(prog, "P1"), P[2], P[3]);
      gl.uniform2f(gl.getUniformLocation(prog, "P2"), P[4], P[5]);

      gl.uniform1f(gl.getUniformLocation(prog, "cell"), cell);
      gl.uniform1f(gl.getUniformLocation(prog, "lw"), lw);
      gl.uniform1f(gl.getUniformLocation(prog, "mass"), mass);
      gl.uniform1f(gl.getUniformLocation(prog, "fall"), fall);
      gl.uniform1f(gl.getUniformLocation(prog, "dots"), dots);
      gl.uniform1f(gl.getUniformLocation(prog, "wave"), wave);
      gl.uniform1f(gl.getUniformLocation(prog, "glow"), glow);

      const parsedBg = parseHex(bg);
      const parsedInk = parseHex(ink);
      const parsedHot = parseHex(hot);
      gl.uniform3f(gl.getUniformLocation(prog, "bg"), parsedBg[0], parsedBg[1], parsedBg[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "ink"), parsedInk[0], parsedInk[1], parsedInk[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "hot"), parsedHot[0], parsedHot[1], parsedHot[2]);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [cell, lw, mass, fall, dots, wave, glow, lag, bg, ink, hot, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

GravityGrid.displayName = "GravityGrid";
`
};
