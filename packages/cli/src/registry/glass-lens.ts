export const glassLens = {
  name: "glass-lens",
  dependencies: [
  "clsx",
  "tailwind-merge"
],
  
  fileName: "glass-lens.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface GlassLensProps extends React.HTMLAttributes<HTMLCanvasElement> {
  size?: number;
  thick?: number;
  disp?: number;
  blur?: number;
  mag?: number;
  smo?: number;
  rim?: number;
  spec?: number;
  lag?: number;
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
uniform vec2 R,P0,P1,P2;uniform float T,K;uniform sampler2D tx;
uniform float size,thick,disp,blur,mag,smo,rim,spec,tin;uniform vec3 tint;
float sm(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
vec3 S(vec2 uv,vec2 o,float bl){vec2 b=vec2(bl*.012,0.);vec3 c=texture2D(tx,uv+o).rgb*2.;c+=texture2D(tx,uv+o+b).rgb+texture2D(tx,uv+o-b).rgb+texture2D(tx,uv+o+b.yx).rgb+texture2D(tx,uv+o-b.yx).rgb;return c/6.;}
float F(vec2 p){return sm(sm(length(p-P0)-size,length(p-P1)-size*.78,smo),length(p-P2)-size*.58,smo);}
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y;
  float d=F(p);
  vec3 col=texture2D(tx,uv).rgb;
  col*=1.-.35*(1.-smoothstep(0.,.12,d))*step(0.,d);
  if(d<.01){
    vec2 e=vec2(.003,0.);
    vec2 g=normalize(vec2(F(p+e.xy)-F(p-e.xy),F(p+e.yx)-F(p-e.yx))+1e-5);
    float ed=clamp(-d/(size*.7),0.,1.),bev=pow(1.-ed,2.5)*thick;
    vec2 c0=(P0*R.y+R)*.5/R,u2=c0+(uv-c0)/mag,o=g*bev*.12*vec2(R.y/R.x,1.);
    vec3 c=vec3(S(u2,o*(1.+disp),blur).r,S(u2,o,blur).g,S(u2,o*(1.-disp),blur).b);
    c=mix(c,tint,tin);
    float L=dot(g,normalize(vec2(-.5,.85))),rm=pow(1.-ed,4.);
    c+=rim*rm*(.25+.75*max(L,0.));
    c*=1.-.25*rm*max(-L,0.);
    c+=spec*pow(max(L,0.),3.)*rm*1.4;
    col=mix(col,c,1.-smoothstep(-.003,.003,d));
  }
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

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);
  const pal = ["#ff4a2b", "#25e0c0", "#ffc542", "#6a5cff"];
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
  ctx.fillText("Glass", w * 0.06, h * 0.45 + fs * 0.88);
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

export const GlassLens = forwardRef<HTMLCanvasElement, GlassLensProps>(function GlassLens(
  {
    size = 0.3,
    thick = 1.3,
    disp = 0.3,
    blur = 0.35,
    mag = 1.12,
    smo = 0.35,
    rim = 0.55,
    spec = 0.7,
    lag = 0.12,
    tin = 0.06,
    tint = "#9fd8ff",
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

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * rs;
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

      P[0] += (tx - P[0]) * 0.14;
      P[1] += (ty - P[1]) * 0.14;
      P[2] += (P[0] - P[2]) * lag;
      P[3] += (P[1] - P[3]) * lag;
      P[4] += (P[2] - P[4]) * lag;
      P[5] += (P[3] - P[5]) * lag;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "K"), w / canvas.clientWidth);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P[0], P[1]);
      gl.uniform2f(gl.getUniformLocation(prog, "P1"), P[2], P[3]);
      gl.uniform2f(gl.getUniformLocation(prog, "P2"), P[4], P[5]);

      gl.uniform1f(gl.getUniformLocation(prog, "size"), size);
      gl.uniform1f(gl.getUniformLocation(prog, "thick"), thick);
      gl.uniform1f(gl.getUniformLocation(prog, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(prog, "blur"), blur);
      gl.uniform1f(gl.getUniformLocation(prog, "mag"), mag);
      gl.uniform1f(gl.getUniformLocation(prog, "smo"), smo);
      gl.uniform1f(gl.getUniformLocation(prog, "rim"), rim);
      gl.uniform1f(gl.getUniformLocation(prog, "spec"), spec);
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
  }, [size, thick, disp, blur, mag, smo, rim, spec, lag, tin, tint, background, paused]);

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

GlassLens.displayName = "GlassLens";
`
};
