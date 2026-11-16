export const liquidSmear = {
  name: "liquid-smear",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "liquid-smear.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface LiquidSmearProps extends React.HTMLAttributes<HTMLCanvasElement> {
  push?: number;
  rad?: number;
  relax?: number;
  spread?: number;
  amt?: number;
  disp?: number;
  spec?: number;
  shade?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";

const FS_SIM = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0,pv;uniform sampler2D fd;
uniform float rad,relax,spread;
vec2 dec(vec2 e){return (e*255.-127.)/127.;}
void main(){
  vec2 uv=gl_FragCoord.xy/R,px=1./R;
  vec2 c=dec(texture2D(fd,uv).xy),s=(dec(texture2D(fd,uv+vec2(px.x,0.)).xy)+dec(texture2D(fd,uv-vec2(px.x,0.)).xy)+dec(texture2D(fd,uv+vec2(0.,px.y)).xy)+dec(texture2D(fd,uv-vec2(0.,px.y)).xy))*.25;
  vec2 v=mix(c,s,spread)*relax;v=sign(v)*max(abs(v)-.004,0.);
  vec2 p=(uv*2.-1.)*vec2(R.x/R.y,1.);float d=length(p-P0);v+=pv*exp(-d*d/(rad*rad));
  v=clamp(v,-1.,1.);gl_FragColor=vec4(v*127./255.+127./255.,0.,1.);
}\`;

const FS_DRAW = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform sampler2D tx,fd;
uniform float amt,disp,spec,shade;
vec2 dec(vec2 e){return (e*255.-127.)/127.;}
void main(){
  vec2 uv=gl_FragCoord.xy/R,v=dec(texture2D(fd,uv).xy),o=-v*amt*.07*vec2(R.y/R.x,1.);
  vec3 c=vec3(texture2D(tx,uv+o*(1.+disp)).r,texture2D(tx,uv+o).g,texture2D(tx,uv+o*(1.-disp)).b);
  float m=clamp(length(v)*2.,0.,1.);vec3 n=normalize(vec3(-v*shade,1.));
  c+=spec*pow(max(dot(n,normalize(vec3(-.4,.6,.7))),0.),30.)*m;c*=1.-m*.08;gl_FragColor=vec4(c,1.);
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
  const pal = ["#ff4a2b", "#25e0c0", "#ffc542", "#2d4bff"];
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
  ctx.fillText("Liquid", w * 0.06, h * 0.45);
  ctx.fillText("Type", w * 0.06, h * 0.45 + fs * 0.88);
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

interface FBOData {
  w: number;
  h: number;
  tx: WebGLTexture[];
  fb: WebGLFramebuffer[];
  i: number;
}

function makeFBO(gl: WebGLRenderingContext, fw: number, fh: number): FBOData | null {
  const z = new Uint8Array(fw * fh * 4);
  for (let i = 0; i < z.length; i += 4) {
    z[i] = 127;
    z[i + 1] = 127;
    z[i + 3] = 255;
  }
  const tx: WebGLTexture[] = [];
  const fb: WebGLFramebuffer[] = [];
  for (let i = 0; i < 2; i++) {
    const t = gl.createTexture();
    if (!t) return null;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fw, fh, 0, gl.RGBA, gl.UNSIGNED_BYTE, z);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const f = gl.createFramebuffer();
    if (!f) return null;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    tx.push(t);
    fb.push(f);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { w: fw, h: fh, tx, fb, i: 0 };
}

export const LiquidSmear = forwardRef<HTMLCanvasElement, LiquidSmearProps>(function LiquidSmear(
  {
    push = 1.4,
    rad = 0.22,
    relax = 0.975,
    spread = 0.35,
    amt = 1,
    disp = 0.4,
    spec = 0.6,
    shade = 3,
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
    const fsSim = compileShader(gl, gl.FRAGMENT_SHADER, FS_SIM);
    const fsDraw = compileShader(gl, gl.FRAGMENT_SHADER, FS_DRAW);
    if (!vs || !fsSim || !fsDraw) return;

    const progSim = gl.createProgram();
    const progDraw = gl.createProgram();
    if (!progSim || !progDraw) return;

    gl.attachShader(progSim, vs);
    gl.attachShader(progSim, fsSim);
    gl.bindAttribLocation(progSim, 0, "q");
    gl.linkProgram(progSim);

    gl.attachShader(progDraw, vs);
    gl.attachShader(progDraw, fsDraw);
    gl.bindAttribLocation(progDraw, 0, "q");
    gl.linkProgram(progDraw);

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

    let fbo: FBOData | null = null;

    const m = { x: 0, y: 0 };
    const P0 = [0, 0];
    let prevP = [0, 0];
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

      const fw = Math.min(512, Math.round(w * 0.4));
      const fh = Math.max(2, Math.round(fw / asp));
      if (!fbo || fbo.w !== fw || fbo.h !== fh) {
        if (fbo) {
          fbo.tx.forEach((t) => gl.deleteTexture(t));
          fbo.fb.forEach((f) => gl.deleteFramebuffer(f));
        }
        fbo = makeFBO(gl, fw, fh);
      }

      if (fbo) {
        gl.useProgram(progSim);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fb[1 - fbo.i]);
        gl.viewport(0, 0, fw, fh);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fbo.tx[fbo.i]);
        gl.uniform1i(gl.getUniformLocation(progSim, "fd"), 1);

        gl.uniform2f(gl.getUniformLocation(progSim, "R"), fw, fh);
        gl.uniform2f(gl.getUniformLocation(progSim, "P0"), P0[0], P0[1]);
        gl.uniform2f(
          gl.getUniformLocation(progSim, "pv"),
          (P0[0] - prevP[0]) * 12 * push,
          (P0[1] - prevP[1]) * 12 * push
        );
        prevP = [P0[0], P0[1]];

        gl.uniform1f(gl.getUniformLocation(progSim, "rad"), rad);
        gl.uniform1f(gl.getUniformLocation(progSim, "relax"), relax);
        gl.uniform1f(gl.getUniformLocation(progSim, "spread"), spread);

        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
        fbo.i = 1 - fbo.i;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(progDraw);

      gl.uniform2f(gl.getUniformLocation(progDraw, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(progDraw, "amt"), amt);
      gl.uniform1f(gl.getUniformLocation(progDraw, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(progDraw, "spec"), spec);
      gl.uniform1f(gl.getUniformLocation(progDraw, "shade"), shade);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(progDraw, "tx"), 0);

      if (fbo) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fbo.tx[fbo.i]);
        gl.uniform1i(gl.getUniformLocation(progDraw, "fd"), 1);
      }

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
      if (fbo) {
        fbo.tx.forEach((t) => gl.deleteTexture(t));
        fbo.fb.forEach((f) => gl.deleteFramebuffer(f));
      }
      gl.deleteBuffer(quad);
      gl.deleteProgram(progSim);
      gl.deleteProgram(progDraw);
      gl.deleteShader(vs);
      gl.deleteShader(fsSim);
      gl.deleteShader(fsDraw);
    };
  }, [push, rad, relax, spread, amt, disp, spec, shade, background, paused]);

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

LiquidSmear.displayName = "LiquidSmear";
`
};
