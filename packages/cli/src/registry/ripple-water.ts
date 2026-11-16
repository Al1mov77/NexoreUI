export const rippleWater = {
  name: "ripple-water",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "ripple-water.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface RippleWaterProps extends React.HTMLAttributes<HTMLCanvasElement> {
  fq?: number;
  spd?: number;
  damp?: number;
  wd?: number;
  amp?: number;
  refr?: number;
  disp?: number;
  spec?: number;
  shade?: number;
  gap?: number;
  idle?: number;
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
uniform vec4 RP[16];uniform float fq,spd,damp,wd,refr,disp,spec,shade;
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y,g=vec2(0.);float h=0.;
  for(int i=0;i<16;i++){
    vec4 r=RP[i];float age=T-r.z;
    if(age<0.||age>9.)continue;
    vec2 dv=p-r.xy;float d=length(dv)+1e-4,s=d-age*spd,env=exp(-s*s/(wd*wd))*exp(-age*damp)*r.w*inversesqrt(.25+age*spd);
    float ph=s*fq,dw=(cos(ph)*fq-sin(ph)*2.*s/(wd*wd))*env;
    g+=dv/d*dw;h+=sin(ph)*env;
  }
  vec2 o=g*refr*.0004*vec2(R.y/R.x,1.);
  vec3 c=vec3(texture2D(tx,uv+o*(1.+disp)).r,texture2D(tx,uv+o).g,texture2D(tx,uv+o*(1.-disp)).b);
  vec3 n=normalize(vec3(-g*shade*.01,1.));
  c+=spec*pow(max(dot(n,normalize(vec3(-.4,.6,.7))),0.),40.);
  c*=1.+h*.12;
  gl_FragColor=vec4(c,1.);
}\`;

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
  const pal = ["#0a5cff", "#00d0c0", "#7a2cff", "#d8f4ff"];
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
  ctx.fillText("Still", w * 0.06, h * 0.45);
  ctx.fillText("Water", w * 0.06, h * 0.45 + fs * 0.88);
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

export const RippleWater = forwardRef<HTMLCanvasElement, RippleWaterProps>(function RippleWater(
  {
    fq = 48,
    spd = 1.1,
    damp = 1.1,
    wd = 0.18,
    amp = 1,
    refr = 1.2,
    disp = 0.35,
    spec = 0.8,
    shade = 2.5,
    gap = 0.12,
    idle = 0.6,
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

    const rp = new Float32Array(64);
    for (let i = 0; i < 16; i++) rp[i * 4 + 2] = -100;
    let ri = 0;
    const drop = (x: number, y: number, t: number, a: number) => {
      rp[ri * 4] = x;
      rp[ri * 4 + 1] = y;
      rp[ri * 4 + 2] = t;
      rp[ri * 4 + 3] = a;
      ri = (ri + 1) % 16;
    };

    const m = { x: 0, y: 0 };
    let lx = 0;
    let ly = 0;
    let ls = 0;
    let nd = 0;
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
      const isIdle = !reducedMotion && performance.now() - lm > 2500;

      if (!isIdle && Math.hypot(m.x * asp - lx, m.y - ly) > gap && t - ls > 0.04) {
        drop(m.x * asp, m.y, t, amp);
        lx = m.x * asp;
        ly = m.y;
        ls = t;
        nd = t + 1.5;
      } else if (isIdle && idle > 0 && t > nd) {
        drop((Math.random() * 2 - 1) * asp * 0.85, (Math.random() * 2 - 1) * 0.75, t, amp * (0.7 + Math.random() * 0.5));
        nd = t + (1.8 - 1.6 * idle) * (0.6 + Math.random() * 0.8);
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), t);
      gl.uniform4fv(gl.getUniformLocation(prog, "RP[0]"), rp);

      gl.uniform1f(gl.getUniformLocation(prog, "fq"), fq);
      gl.uniform1f(gl.getUniformLocation(prog, "spd"), spd);
      gl.uniform1f(gl.getUniformLocation(prog, "damp"), damp);
      gl.uniform1f(gl.getUniformLocation(prog, "wd"), wd);
      gl.uniform1f(gl.getUniformLocation(prog, "refr"), refr);
      gl.uniform1f(gl.getUniformLocation(prog, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(prog, "spec"), spec);
      gl.uniform1f(gl.getUniformLocation(prog, "shade"), shade);

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
  }, [fq, spd, damp, wd, amp, refr, disp, spec, shade, gap, idle, background, paused]);

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

RippleWater.displayName = "RippleWater";
`
};
