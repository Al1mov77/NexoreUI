export const ditherImage = {
  name: "dither-image",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "dither-image.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface DitherImageProps extends React.HTMLAttributes<HTMLCanvasElement> {
  px?: number;
  lv?: number;
  bn?: number;
  cont?: number;
  bias?: number;
  anim?: number;
  mode?: number;
  rad?: number;
  soft?: number;
  rv?: number;
  c0?: string;
  c1?: string;
  c2?: string;
  c3?: string;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0;uniform float T,K;uniform sampler2D tx;
uniform float px,lv,bn,cont,bias,anim,mode,rad,soft,rv;uniform vec3 c0,c1,c2,c3;
float b2(vec2 p){p=mod(p,2.);return p.x<1.?(p.y<1.?0.:3.):(p.y<1.?2.:1.);}
float bay(vec2 p,float n){float v=0.;for(int i=0;i<3;i++){if(float(i)>=n)break;v+=b2(floor(p/exp2(float(i))))*exp2(2.*(n-1.-float(i)));}return (v+.5)/exp2(2.*n);}
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y,fp=floor(gl_FragCoord.xy/(px*K));
  vec3 src=texture2D(tx,uv).rgb;float l=clamp((dot(src,vec3(.299,.587,.114))-.5)*cont+.5+bias,0.,1.);
  float th=bay(fp+floor(T*anim*12.)*vec2(3.,7.),bn)-.5,q=lv-1.;
  float lq=clamp(floor(l*q+th+.5)/q,0.,1.);
  vec3 g=lq<.334?mix(c0,c1,lq*3.):lq<.667?mix(c1,c2,(lq-.334)*3.):mix(c2,c3,(lq-.667)*3.);
  vec3 cc=clamp(floor(src*q+th+.5)/q,0.,1.),d=mix(g,cc,mode);
  gl_FragColor=vec4(mix(d,src,rv*(1.-smoothstep(rad,rad+soft,length(p-P0)))),1.);
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

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);
  const pal = ["#ff6a3d", "#2d3bff", "#f6f1e6", "#8a5cff"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(w * a, h * b, 0, w * a, h * b, Math.max(w, h) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < h; y += 14) {
    ctx.fillRect(0, y, w, 2);
  }
  const fs = Math.min(w / 4, h * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Dither", w * 0.06, h * 0.45);
  ctx.fillText("Pixels", w * 0.06, h * 0.45 + fs * 0.88);
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

export const DitherImage = forwardRef<HTMLCanvasElement, DitherImageProps>(function DitherImage(
  {
    px = 3,
    lv = 3,
    bn = 3,
    cont = 1.3,
    bias = 0,
    anim = 0,
    mode = 0,
    rad = 0.22,
    soft = 0.18,
    rv = 1,
    c0 = "#0a0a0f",
    c1 = "#2d3bff",
    c2 = "#ff6a3d",
    c3 = "#f6f1e6",
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

    let defaultTex = createDefaultTexture(gl, canvas.clientWidth || 600, canvas.clientHeight || 400);
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

    const m = { x: 0, y: 0 };
    const P0 = [0, 0];
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
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h);
        }
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P0[0] += (tx - P0[0]) * 0.14;
      P0[1] += (ty - P0[1]) * 0.14;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "K"), w / canvas.clientWidth);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P0[0], P0[1]);

      gl.uniform1f(gl.getUniformLocation(prog, "px"), px);
      gl.uniform1f(gl.getUniformLocation(prog, "lv"), lv);
      gl.uniform1f(gl.getUniformLocation(prog, "bn"), bn);
      gl.uniform1f(gl.getUniformLocation(prog, "cont"), cont);
      gl.uniform1f(gl.getUniformLocation(prog, "bias"), bias);
      gl.uniform1f(gl.getUniformLocation(prog, "anim"), anim);
      gl.uniform1f(gl.getUniformLocation(prog, "mode"), mode);
      gl.uniform1f(gl.getUniformLocation(prog, "rad"), rad);
      gl.uniform1f(gl.getUniformLocation(prog, "soft"), soft);
      gl.uniform1f(gl.getUniformLocation(prog, "rv"), rv);

      const parsedC0 = parseHex(c0);
      const parsedC1 = parseHex(c1);
      const parsedC2 = parseHex(c2);
      const parsedC3 = parseHex(c3);
      gl.uniform3f(gl.getUniformLocation(prog, "c0"), parsedC0[0], parsedC0[1], parsedC0[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "c1"), parsedC1[0], parsedC1[1], parsedC1[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "c2"), parsedC2[0], parsedC2[1], parsedC2[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "c3"), parsedC3[0], parsedC3[1], parsedC3[2]);

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
      canvas.removeEventListener("pointermove", onPointerMove);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [px, lv, bn, cont, bias, anim, mode, rad, soft, rv, c0, c1, c2, c3, background, paused]);

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

DitherImage.displayName = "DitherImage";
`
};
