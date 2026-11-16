"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface ScrollDrumProps extends React.HTMLAttributes<HTMLCanvasElement> {
  rad?: number;
  gain?: number;
  spd?: number;
  bulge?: number;
  fade?: number;
  split?: number;
  tilt?: number;
  hl?: number;
  inertia?: number;
  vgain?: number;
  words?: string[];
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollProgress?: number;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform sampler2D tx;
uniform float rot,vel,rad,bulge,fade,split,tilt,hl;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-R)/R.y;float c=cos(tilt),s=sin(tilt);p=mat2(c,-s,s,c)*p;
  float y=p.y/rad;vec3 col=vec3(.035,.035,.045);
  if(abs(y)<1.){
    float th=asin(y),cz=cos(th),x=p.x/(1.+bulge*(1.-cz)),u=x/(6.28318*rad)+.5,v=(th+rot)/6.28318,ph=split*vel*.04;
    vec3 t=vec3(texture2D(tx,vec2(u,v+ph)).r,texture2D(tx,vec2(u,v)).g,texture2D(tx,vec2(u,v-ph)).b);
    float q=(th-.35)*3.;t=t*mix(1.,pow(cz,1.3),fade)+hl*.22*exp(-q*q);
    col=mix(col,t,1.-smoothstep(.985,1.,abs(y)));
  }
  gl_FragColor=vec4(col,1.);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDrumTexture(gl: WebGLRenderingContext, words: string[]): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 2048;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const bgs = ["#ff4a2b", "#0b0b10", "#2d4bff", "#f2efe8", "#ffe14a", "#0b0b10", "#25e0c0", "#f2efe8"];
  const fgs = ["#0b0b10", "#f2efe8", "#ffe14a", "#0b0b10", "#0b0b10", "#ff4a2b", "#0b0b10", "#2d4bff"];

  for (let i = 0; i < 8; i++) {
    const text = words[i % words.length] || `Item ${i + 1}`;
    ctx.fillStyle = bgs[i % bgs.length];
    ctx.fillRect(0, i * 256, 2048, 256);
    ctx.fillStyle = fgs[i % fgs.length];
    ctx.font = `900 180px system-ui, -apple-system, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, 1024, i * 256 + 134);
  }

  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return tex;
}

export const ScrollDrum = forwardRef<HTMLCanvasElement, ScrollDrumProps>(function ScrollDrum(
  {
    rad = 1.15,
    gain = 1.2,
    spd = 0.12,
    bulge = 0.35,
    fade = 0.8,
    split = 0.8,
    tilt = -0.12,
    hl = 0.8,
    inertia = 0.1,
    vgain = 1,
    words = ["Design", "Motion", "Depth", "Scroll", "Light", "Glass", "Type", "Flow"],
    scrollContainer,
    scrollProgress,
    captureWheel = false,
    autoScroll = false,
    autoSpeed = 3.5,
    background,
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

    let defaultTex = createDrumTexture(gl, words);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      }
    }

    let sm = 0;
    let sPrev = 0;
    let vsVal = 0;
    let ph = 0;
    let currentScroll = 0;
    let virtualScroll = 0;
    let isDragging = false;
    let dragStartY = 0;

    let isVisible = true;
    let isDocVisible = !document.hidden;

    const onScroll = () => {
      if (scrollContainer && scrollContainer.current) {
        currentScroll = scrollContainer.current.scrollTop;
      } else {
        currentScroll = window.scrollY;
      }
    };

    const targetEl = scrollContainer && scrollContainer.current ? scrollContainer.current : window;
    targetEl.addEventListener("scroll", onScroll as EventListener, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (!captureWheel) return;
      e.preventDefault();
      virtualScroll += e.deltaY * 0.9;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = dragStartY - e.clientY;
      dragStartY = e.clientY;
      virtualScroll += dy * 2.5;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

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

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const vh = canvas.clientHeight || window.innerHeight || 800;
      if (autoScroll) {
        virtualScroll += autoSpeed;
      }
      const targetScroll =
        scrollProgress !== undefined
          ? scrollProgress * vh * 6
          : captureWheel || autoScroll
          ? virtualScroll
          : currentScroll;

      const ds = Math.min(dt, 50) / 1000 || 0.016;
      sm += (targetScroll - sm) * inertia;
      const v = (sm - sPrev) / vh / ds;
      sPrev = sm;
      vsVal += (Math.max(-2, Math.min(2, v * 0.25 * vgain)) - vsVal) * 0.12;
      ph += ds * spd;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "rot"), ph + (sm / vh) * gain);
      gl.uniform1f(gl.getUniformLocation(prog, "vel"), vsVal);
      gl.uniform1f(gl.getUniformLocation(prog, "rad"), rad);
      gl.uniform1f(gl.getUniformLocation(prog, "bulge"), bulge);
      gl.uniform1f(gl.getUniformLocation(prog, "fade"), fade);
      gl.uniform1f(gl.getUniformLocation(prog, "split"), split);
      gl.uniform1f(gl.getUniformLocation(prog, "tilt"), tilt);
      gl.uniform1f(gl.getUniformLocation(prog, "hl"), hl);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

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
      targetEl.removeEventListener("scroll", onScroll as EventListener);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [
    rad,
    gain,
    spd,
    bulge,
    fade,
    split,
    tilt,
    hl,
    inertia,
    vgain,
    words,
    scrollContainer,
    scrollProgress,
    captureWheel,
    background,
    paused,
  ]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none cursor-ns-resize", className)}
      style={style}
      {...props}
    />
  );
});

ScrollDrum.displayName = "ScrollDrum";
