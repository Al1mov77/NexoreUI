"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface TwistRibbonProps extends React.HTMLAttributes<HTMLCanvasElement> {
  twist?: number;
  flex?: number;
  spd?: number;
  boost?: number;
  wid?: number;
  tilt?: number;
  wamp?: number;
  wfq?: number;
  cam?: number;
  cnt?: number;
  spread?: number;
  rep?: number;
  shade?: number;
  inertia?: number;
  vgain?: number;
  paper?: string;
  ink?: string;
  back?: string;
  bg?: string;
  text?: string;
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollProgress?: number;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = `attribute vec2 a;uniform float asp,ph,tw,wid,tilt,wamp,wfq,cam,spread,rep;uniform vec2 ix;varying vec2 uv;varying float sh;
void main(){
  float x=a.x*3.4,j=ix.x-(ix.y-1.)*.5,ang=x*tw*.5+ph*1.3+j*1.7;
  float y=wid*a.y,py=cos(ang)*y+sin(x*wfq+ph+j*2.)*wamp+j*spread,pz=sin(ang)*y,tl=tilt+j*.18;
  float px=x*cos(tl)-py*sin(tl),qy=x*sin(tl)+py*cos(tl),k=2.4/(cam-pz);
  gl_Position=vec4(px*k/asp,qy*k,-pz*.12,1.);
  uv=vec2((a.x*.5+.5)*rep+ph*.1+j*.37,a.y*.5+.5);sh=cos(ang);
}`;

const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tx;
uniform vec3 paper,ink,back;uniform float shade;varying vec2 uv;varying float sh;
void main(){
  float m=texture2D(tx,uv).r;
  vec3 c=sh>0.?mix(paper,ink,m):mix(back,paper,m);
  c*=1.-shade*(1.-abs(sh))*.9;
  gl_FragColor=vec4(c,1.);
}`;

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

function createRibbonTexture(gl: WebGLRenderingContext, text: string): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 2048, 256);
  ctx.font = `900 190px system-ui, -apple-system, sans-serif`;
  const m = ctx.measureText(text).width;
  ctx.save();
  ctx.scale(2048 / Math.max(1, m), 1);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 134);
  ctx.restore();

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

export const TwistRibbon = forwardRef<HTMLCanvasElement, TwistRibbonProps>(function TwistRibbon(
  {
    twist = 1.6,
    flex = 1.2,
    spd = 0.35,
    boost = 1,
    wid = 0.55,
    tilt = 0.28,
    wamp = 0.3,
    wfq = 1.2,
    cam = 4.5,
    cnt = 2,
    spread = 0.9,
    rep = 3,
    shade = 0.6,
    inertia = 0.12,
    vgain = 1,
    paper = "#f2efe8",
    ink = "#0b0b10",
    back = "#ff4a2b",
    bg = "#15151b",
    text = "Scroll / Twist / ",
    scrollContainer,
    scrollProgress,
    captureWheel = false,
    autoScroll = false,
    autoSpeed = 4.0,
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
    gl.bindAttribLocation(prog, 0, "a");
    gl.linkProgram(prog);

    const RN = 160;
    const ribN = (RN + 1) * 2;
    const ribBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ribBuf);
    const v: number[] = [];
    for (let i = 0; i <= RN; i++) {
      const q = (i / RN) * 2 - 1;
      v.push(q, -1, q, 1);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createRibbonTexture(gl, text);
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

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
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
          ? scrollProgress * vh * 3
          : captureWheel || autoScroll
          ? virtualScroll
          : currentScroll;

      const ds = Math.min(dt, 50) / 1000 || 0.016;
      sm += (targetScroll - sm) * inertia;
      const v = (sm - sPrev) / vh / ds;
      sPrev = sm;
      vsVal += (Math.max(-2, Math.min(2, v * 0.25 * vgain)) - vsVal) * 0.12;
      ph += ds * (spd + vsVal * boost * 2.2);

      const asp = w / h;

      gl.viewport(0, 0, w, h);
      const parsedBg = parseHex(bg);
      gl.clearColor(parsedBg[0], parsedBg[1], parsedBg[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      gl.useProgram(prog);

      gl.uniform1f(gl.getUniformLocation(prog, "asp"), asp);
      gl.uniform1f(gl.getUniformLocation(prog, "ph"), ph);
      gl.uniform1f(gl.getUniformLocation(prog, "tw"), twist + Math.abs(vsVal) * flex);
      gl.uniform1f(gl.getUniformLocation(prog, "wid"), wid);
      gl.uniform1f(gl.getUniformLocation(prog, "tilt"), tilt);
      gl.uniform1f(gl.getUniformLocation(prog, "wamp"), wamp);
      gl.uniform1f(gl.getUniformLocation(prog, "wfq"), wfq);
      gl.uniform1f(gl.getUniformLocation(prog, "cam"), cam);
      gl.uniform1f(gl.getUniformLocation(prog, "spread"), spread);
      gl.uniform1f(gl.getUniformLocation(prog, "rep"), rep);
      gl.uniform1f(gl.getUniformLocation(prog, "shade"), shade);

      const parsedPaper = parseHex(paper);
      const parsedInk = parseHex(ink);
      const parsedBack = parseHex(back);
      gl.uniform3f(gl.getUniformLocation(prog, "paper"), parsedPaper[0], parsedPaper[1], parsedPaper[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "ink"), parsedInk[0], parsedInk[1], parsedInk[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "back"), parsedBack[0], parsedBack[1], parsedBack[2]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, ribBuf);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      for (let i = 0; i < cnt; i++) {
        gl.uniform2f(gl.getUniformLocation(prog, "ix"), i, cnt);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, ribN);
      }

      gl.disable(gl.DEPTH_TEST);
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
      gl.deleteBuffer(ribBuf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [
    twist,
    flex,
    spd,
    boost,
    wid,
    tilt,
    wamp,
    wfq,
    cam,
    cnt,
    spread,
    rep,
    shade,
    inertia,
    vgain,
    paper,
    ink,
    back,
    bg,
    text,
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

TwistRibbon.displayName = "TwistRibbon";
