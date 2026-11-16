export const scrollWarp = {
  name: "scroll-warp",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "scroll-warp.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface ScrollWarpProps extends React.HTMLAttributes<HTMLCanvasElement> {
  curve?: number;
  skew?: number;
  split?: number;
  wave?: number;
  zoom?: number;
  inertia?: number;
  vgain?: number;
  grain?: number;
  slices?: number;
  words?: string[];
  captions?: string[];
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollProgress?: number;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  wrapScroll?: boolean;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T;uniform sampler2D tx;
uniform float o,vel,N,curve,skew,split,wave,zoom,grain;
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=uv*2.-1.;float asp=R.x/R.y;
  float k=clamp(vel*curve,-.9,.9);p.y=sign(p.y)*pow(abs(p.y)+1e-4,1.+k);
  p/=1.+abs(vel)*zoom*.15;
  p.x=p.x*asp+p.y*vel*skew*.5+sin(p.y*4.+T*1.5)*wave*.05*(.25+abs(vel));
  float ux=p.x/asp*.5+.5,t=o+.5-p.y*.5,sp=split*vel*.04;
  vec3 c=vec3(
    texture2D(tx,vec2(ux,fract(1.-(t+sp)/N))).r,
    texture2D(tx,vec2(ux,fract(1.-t/N))).g,
    texture2D(tx,vec2(ux,fract(1.-(t-sp)/N))).b
  );
  c+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9,78.2))+T)*43758.5)-.5)*grain;
  gl_FragColor=vec4(c,1.);
}\`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  N: number,
  words: string[],
  captions: string[]
): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h * N);
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const cols = [
    ["#ff4a2b", "#0b0b10"],
    ["#0b0b10", "#f2efe8"],
    ["#2d4bff", "#ffe14a"],
    ["#f2efe8", "#0b0b10"],
  ];

  for (let i = 0; i < N; i++) {
    const [bg, fg] = cols[i % cols.length];
    const y0 = i * h;
    ctx.fillStyle = bg;
    ctx.fillRect(0, y0, w, h);
    ctx.fillStyle = fg;

    const word = words[i % words.length] || \`Scene \${i + 1}\`;
    const fs = Math.min(w * 0.22, h * 0.38);
    ctx.font = \`900 \${fs}px system-ui, -apple-system, sans-serif\`;
    ctx.fillText(word, w * 0.06, y0 + h * 0.56);

    ctx.globalAlpha = 0.3;
    ctx.fillRect(w * 0.06, y0 + h * 0.14, w * 0.88, 2);
    ctx.fillRect(w * 0.06, y0 + h * 0.86, w * 0.88, 2);
    ctx.globalAlpha = 1.0;

    const cap = captions[i % captions.length] || "Scroll velocity bends the canvas frame.";
    ctx.font = \`500 \${Math.max(13, h * 0.04)}px system-ui, -apple-system, sans-serif\`;
    ctx.fillText(cap, w * 0.06, y0 + h * 0.92);
  }

  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export const ScrollWarp = forwardRef<HTMLCanvasElement, ScrollWarpProps>(function ScrollWarp(
  {
    curve = 1,
    skew = 0.6,
    split = 0.8,
    wave = 0.4,
    zoom = 0.5,
    inertia = 0.12,
    vgain = 1,
    grain = 0.04,
    slices = 4,
    words = ["Scroll", "Pulls", "The", "Page"],
    captions = [
      "Scroll slowly, then flick.",
      "Speed bends the picture.",
      "Direction picks the side.",
      "One texture, one shader.",
    ],
    scrollContainer,
    scrollProgress,
    captureWheel = false,
    autoScroll = false,
    autoSpeed = 3.5,
    wrapScroll = true,
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

    let defaultTex = createDefaultTexture(
      gl,
      canvas.clientWidth || 600,
      canvas.clientHeight || 400,
      slices,
      words,
      captions
    );
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
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    let sm = 0;
    let sPrev = 0;
    let vsVal = 0;
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
      const vh = canvas.clientHeight || window.innerHeight || 800;
      virtualScroll += e.deltaY * 0.85;
      if (!wrapScroll) {
        const maxScroll = Math.max(1, (slices - 1) * vh);
        if (virtualScroll < 0) virtualScroll = 0;
        if (virtualScroll > maxScroll) virtualScroll = maxScroll;
      }
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
      const vh = canvas.clientHeight || window.innerHeight || 800;
      virtualScroll += dy * 2.4;
      if (!wrapScroll) {
        const maxScroll = Math.max(1, (slices - 1) * vh);
        if (virtualScroll < 0) virtualScroll = 0;
        if (virtualScroll > maxScroll) virtualScroll = maxScroll;
      }
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
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h, slices, words, captions);
        }
      }

      const vh = canvas.clientHeight || window.innerHeight || 800;
      if (autoScroll) {
        virtualScroll += autoSpeed;
      }
      const targetScroll =
        scrollProgress !== undefined
          ? scrollProgress * vh * (slices - 1)
          : captureWheel || autoScroll
          ? virtualScroll
          : currentScroll;

      const ds = Math.min(dt, 50) / 1000 || 0.016;
      sm += (targetScroll - sm) * inertia;
      const v = (sm - sPrev) / vh / ds;
      sPrev = sm;
      vsVal += (Math.max(-2, Math.min(2, v * 0.25 * vgain)) - vsVal) * 0.12;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), ms / 1000);
      gl.uniform1f(gl.getUniformLocation(prog, "o"), sm / vh);
      gl.uniform1f(gl.getUniformLocation(prog, "vel"), vsVal);
      gl.uniform1f(gl.getUniformLocation(prog, "N"), slices);
      gl.uniform1f(gl.getUniformLocation(prog, "curve"), curve);
      gl.uniform1f(gl.getUniformLocation(prog, "skew"), skew);
      gl.uniform1f(gl.getUniformLocation(prog, "split"), split);
      gl.uniform1f(gl.getUniformLocation(prog, "wave"), wave);
      gl.uniform1f(gl.getUniformLocation(prog, "zoom"), zoom);
      gl.uniform1f(gl.getUniformLocation(prog, "grain"), grain);

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
    curve,
    skew,
    split,
    wave,
    zoom,
    inertia,
    vgain,
    grain,
    slices,
    words,
    captions,
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

ScrollWarp.displayName = "ScrollWarp";
`
};
