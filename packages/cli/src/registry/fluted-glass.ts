export const flutedGlass = {
  name: "fluted-glass",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "fluted-glass.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface FlutedGlassProps extends React.HTMLAttributes<HTMLCanvasElement> {
  cnt?: number;
  bend?: number;
  disp?: number;
  frost?: number;
  ang?: number;
  warp?: number;
  edge?: number;
  hl?: number;
  pinf?: number;
  tin?: number;
  tint?: string;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0;uniform float T;uniform sampler2D tx;
uniform float cnt,bend,disp,frost,ang,warp,edge,hl,pinf,tin;uniform vec3 tint;
vec3 S(vec2 uv,vec2 o,float bl){
  vec2 b=vec2(bl*.012,0.);
  vec2 st=clamp(uv+o,0.001,0.999);
  vec3 c=texture2D(tx,st).rgb*2.;
  c+=texture2D(tx,clamp(st+b,0.001,0.999)).rgb+texture2D(tx,clamp(st-b,0.001,0.999)).rgb+texture2D(tx,clamp(st+b.yx,0.001,0.999)).rgb+texture2D(tx,clamp(st-b.yx,0.001,0.999)).rgb;
  return c/6.;
}
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y;
  vec2 dir=vec2(cos(ang),sin(ang)),per=vec2(-dir.y,dir.x);
  float r=dot(p,dir)*cnt*.5,pr=dot(P0,dir)*cnt*.5,id=floor(r),f=fract(r)-.5,dd=r-pr,near=exp(-dd*dd*.03);
  vec2 o=dir*(-f*bend*(1.+pinf*near*1.5)*2./cnt)+per*sin(id*.7+T*.6+dot(p,per)*1.2)*warp*.03;
  o*=vec2(R.y/R.x,1.)*.5;
  vec3 c=vec3(S(uv,o*(1.+disp),frost).r,S(uv,o,frost).g,S(uv,o*(1.-disp),frost).b);
  c=mix(c,tint,tin);
  c*=.96+.08*sin(id*1.77+2.1);
  float q=(f+.3)*6.;
  c+=hl*.3*exp(-q*q)*(.5+near);
  c*=max(1.-edge*smoothstep(.3,.5,abs(f)),0.);
  gl_FragColor=vec4(clamp(c,0.,1.),1.);
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
  const cw = Math.max(300, w);
  const ch = Math.max(150, h);
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, cw, ch);
  const pal = ["#ff7a1a", "#ff2e63", "#1b2cff", "#ffd447"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(cw * a, ch * b, 0, cw * a, ch * b, Math.max(cw, ch) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < ch; y += 14) {
    ctx.fillRect(0, y, cw, 2);
  }
  const fs = Math.min(cw / 4, ch * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Fluted", cw * 0.06, ch * 0.45);
  ctx.fillText("Light", cw * 0.06, ch * 0.45 + fs * 0.88);
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

export const FlutedGlass = forwardRef<HTMLCanvasElement, FlutedGlassProps>(function FlutedGlass(
  {
    cnt = 22,
    bend = 0.85,
    disp = 0.25,
    frost = 0.25,
    ang = 0,
    warp = 0.5,
    edge = 0.5,
    hl = 0.8,
    pinf = 1,
    tin = 0,
    tint = "#ffffff",
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
      const cw = canvas.clientWidth || 400;
      const ch = canvas.clientHeight || 200;
      const w = Math.max(1, Math.round(cw * dpr));
      const h = Math.max(1, Math.round(ch * dpr));
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
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P0[0], P0[1]);

      gl.uniform1f(gl.getUniformLocation(prog, "cnt"), cnt);
      gl.uniform1f(gl.getUniformLocation(prog, "bend"), bend);
      gl.uniform1f(gl.getUniformLocation(prog, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(prog, "frost"), frost);
      gl.uniform1f(gl.getUniformLocation(prog, "ang"), ang);
      gl.uniform1f(gl.getUniformLocation(prog, "warp"), warp);
      gl.uniform1f(gl.getUniformLocation(prog, "edge"), edge);
      gl.uniform1f(gl.getUniformLocation(prog, "hl"), hl);
      gl.uniform1f(gl.getUniformLocation(prog, "pinf"), pinf);
      gl.uniform1f(gl.getUniformLocation(prog, "tin"), tin);
      const parsedTint = parseHex(tint);
      gl.uniform3f(gl.getUniformLocation(prog, "tint"), parsedTint[0], parsedTint[1], parsedTint[2]);

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
  }, [cnt, bend, disp, frost, ang, warp, edge, hl, pinf, tin, tint, background, paused]);

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

FlutedGlass.displayName = "FlutedGlass";
`
};
