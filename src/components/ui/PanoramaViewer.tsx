"use client";

import { useEffect, useRef, useState } from "react";
import { setScrollLocked } from "@/components/SmoothScrollProvider";
import { prefersReducedMotion } from "@/lib/gsap";
import type { Panorama } from "@/lib/media";

/**
 * FULL-SCREEN PANORAMA VIEWER — no library, one WebGL fragment shader.
 *
 * Every pixel casts a ray from the camera (yaw, pitch, field of view), turns
 * it into longitude/latitude and samples the equirectangular photo there.
 * A full 360 × 180 photo wraps all the way round; a partial one (e.g. 180°)
 * is clamped so the view stops at its edges, which fade into the dark ground.
 *
 *   drag / swipe      look around (with a little inertia)
 *   wheel / pinch     zoom
 *   arrows, + / −     the same from the keyboard
 *   "Move phone"      look around by turning the device (gyroscope)
 *
 * Loaded on demand (next/dynamic) the first time a visitor opens a panorama,
 * so neither this code nor the photo costs anything on page load.
 */

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tex;
uniform vec2 res;
uniform float yaw;
uniform float pitch;
uniform float tanHalf;
uniform vec2 cover;
uniform float wrap;
const vec3 BG = vec3(0.043, 0.051, 0.071);
void main() {
  vec2 q = gl_FragCoord.xy / res * 2.0 - 1.0;
  vec3 d = normalize(vec3(q.x * tanHalf * res.x / res.y, q.y * tanHalf, -1.0));
  float cp = cos(pitch), sp = sin(pitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  d = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  vec2 uv = vec2(0.5 + lon / cover.x, 0.5 - lat / cover.y);
  if (wrap > 0.5) uv.x = fract(uv.x);
  vec2 edge = min(uv, 1.0 - uv);
  float a = smoothstep(-0.004, 0.008, min(wrap > 0.5 ? 1.0 : edge.x, edge.y));
  vec3 c = texture2D(tex, clamp(uv, 0.0, 1.0)).rgb;
  gl_FragColor = vec4(mix(BG, c, a), 1.0);
}`;

const RAD = Math.PI / 180;
const MIN_FOV = 30 * RAD;
const MAX_FOV = 90 * RAD;

type Gyro = "unavailable" | "off" | "on";

/** Controls handed from the render effect to the buttons. */
interface Api {
  zoom: (factor: number) => void;
  setGyro: (on: boolean) => void;
}

export default function PanoramaViewer({ pano, onClose }: { pano: Panorama; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const apiRef = useRef<Api | null>(null);
  const [shown, setShown] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "flat">("loading");
  const [touched, setTouched] = useState(false);
  // Client-only component (loaded with ssr: false), so this can read the device.
  const [gyro, setGyro] = useState<Gyro>(() =>
    typeof DeviceOrientationEvent !== "undefined" && window.matchMedia("(pointer: coarse)").matches ? "off" : "unavailable"
  );

  const close = () => {
    setShown(false);
    window.setTimeout(onClose, 380);
  };

  // Fade in, hold the page still, trap Esc, and hand focus back on the way out.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    setScrollLocked("pano", true);
    const raf = requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      setScrollLocked("pano", false);
      opener?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) {
      setStatus("flat");
      return;
    }

    // ---- GL setup -------------------------------------------------------
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setStatus("flat");
      return;
    }
    gl.useProgram(prog);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("res"), uYaw = u("yaw"), uPitch = u("pitch"), uTan = u("tanHalf");
    gl.uniform2f(u("cover"), pano.hfov * RAD, pano.vfov * RAD);
    const wrap = pano.hfov >= 359;
    gl.uniform1f(u("wrap"), wrap ? 1 : 0);

    // ---- Camera ---------------------------------------------------------
    const cover = { h: pano.hfov * RAD, v: pano.vfov * RAD };
    const cam = { yaw: 0, pitch: 0, fov: Math.min(70 * RAD, cover.v * 0.95) };
    const vel = { yaw: 0, pitch: 0 };
    let aspect = 1;
    let dirty = true;
    let ready = false;
    let interacted = false;
    let disposed = false;

    /** Keep the view inside what the photo covers. */
    const clamp = () => {
      let maxFov = Math.min(MAX_FOV, cover.v * 0.98);
      if (!wrap && cover.h < Math.PI) maxFov = Math.min(maxFov, 2 * Math.atan(Math.tan(cover.h / 2) / aspect));
      cam.fov = Math.max(Math.min(MIN_FOV, maxFov), Math.min(maxFov, cam.fov));
      const half = cam.fov / 2;
      const pLim = Math.max(0, cover.v / 2 - half);
      cam.pitch = Math.max(-pLim, Math.min(pLim, cam.pitch));
      if (wrap) {
        cam.yaw = ((cam.yaw + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      } else {
        const hHalf = Math.atan(Math.tan(half) * aspect);
        const yLim = Math.max(0, cover.h / 2 - hHalf);
        if (Math.abs(cam.yaw) > yLim) vel.yaw = 0;
        cam.yaw = Math.max(-yLim, Math.min(yLim, cam.yaw));
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      aspect = w / Math.max(1, h);
      gl.viewport(0, 0, w, h);
      clamp();
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- Photo ----------------------------------------------------------
    const texture = gl.createTexture();
    const img = new Image();
    img.decoding = "async";
    img.src = pano.src;
    img
      .decode()
      .then(() => {
        if (disposed) return;
        const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
        let source: TexImageSource = img;
        if (img.naturalWidth > max || img.naturalHeight > max) {
          const k = max / Math.max(img.naturalWidth, img.naturalHeight);
          const c = document.createElement("canvas");
          c.width = Math.floor(img.naturalWidth * k);
          c.height = Math.floor(img.naturalHeight * k);
          c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
          source = c;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        ready = true;
        dirty = true;
        setStatus("ready");
      })
      .catch(() => !disposed && setStatus("flat"));

    // ---- Render loop: draws only when something moved -------------------
    const sway = !prefersReducedMotion();
    let t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      if (!ready) return;

      // A slow drift until the visitor takes over, so it reads as "live".
      if (!interacted && sway) {
        cam.yaw += 0.05 * dt * (wrap ? 1 : Math.cos(now / 9000) * 1.6);
        dirty = true;
      }
      if (Math.abs(vel.yaw) > 1e-4 || Math.abs(vel.pitch) > 1e-4) {
        cam.yaw += vel.yaw;
        cam.pitch += vel.pitch;
        vel.yaw *= 0.9;
        vel.pitch *= 0.9;
        dirty = true;
      }
      if (!dirty) return;
      dirty = false;
      clamp();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uYaw, cam.yaw);
      gl.uniform1f(uPitch, cam.pitch);
      gl.uniform1f(uTan, Math.tan(cam.fov / 2));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    const takeOver = () => {
      if (interacted) return;
      interacted = true;
      setTouched(true);
    };

    // ---- Drag, pinch, wheel, keys ---------------------------------------
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    /** Radians per CSS pixel: dragging moves the photo with the finger. */
    const perPx = () => cam.fov / Math.max(1, canvas.clientHeight);

    const onDown = (e: PointerEvent) => {
      takeOver();
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      vel.yaw = vel.pitch = 0;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const next = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, next);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0) cam.fov *= pinch / d;
        pinch = d;
      } else {
        const k = perPx();
        vel.yaw = -(next.x - prev.x) * k;
        vel.pitch = (next.y - prev.y) * k;
        cam.yaw += vel.yaw;
        cam.pitch += vel.pitch;
      }
      dirty = true;
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinch = 0;
      if (pointers.size > 0) vel.yaw = vel.pitch = 0;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      takeOver();
      cam.fov *= Math.exp(e.deltaY * 0.0012);
      dirty = true;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = cam.fov * 0.12;
      const moves: Record<string, () => void> = {
        ArrowLeft: () => (cam.yaw -= step),
        ArrowRight: () => (cam.yaw += step),
        ArrowUp: () => (cam.pitch += step),
        ArrowDown: () => (cam.pitch -= step),
        "+": () => (cam.fov *= 0.88),
        "=": () => (cam.fov *= 0.88),
        "-": () => (cam.fov /= 0.88),
      };
      const fn = moves[e.key];
      if (!fn) return;
      e.preventDefault();
      takeOver();
      fn();
      dirty = true;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("keydown", onKey);

    // ---- Gyroscope: applied as changes, so dragging still works on top --
    let last: { a: number; b: number; g: number } | null = null;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      const now = { a: e.alpha, b: e.beta, g: e.gamma };
      if (last) {
        let da = now.a - last.a;
        if (da > 180) da -= 360;
        if (da < -180) da += 360;
        const angle = screen.orientation?.angle ?? 0;
        // Portrait tilts with beta; landscape with gamma (sign follows the turn).
        const dp = angle === 90 ? -(now.g - last.g) : angle === 270 || angle === -90 ? now.g - last.g : now.b - last.b;
        // Ignore the jump gamma makes when the phone passes upright.
        if (Math.abs(dp) < 30) cam.pitch += dp * RAD;
        cam.yaw -= da * RAD;
        dirty = true;
      }
      last = now;
    };
    apiRef.current = {
      zoom: (f) => {
        takeOver();
        cam.fov *= f;
        dirty = true;
      },
      setGyro: async (on) => {
        if (!on) {
          window.removeEventListener("deviceorientation", onTilt);
          last = null;
          setGyro("off");
          return;
        }
        takeOver();
        // iOS asks the visitor first, and only from a tap.
        const ask = (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission;
        if (ask && (await ask().catch(() => "denied")) !== "granted") return;
        window.addEventListener("deviceorientation", onTilt);
        setGyro("on");
      },
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("deviceorientation", onTilt);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("keydown", onKey);
      // Free what this run created, but leave the context alive: React's
      // development double-run mounts this effect again on the same canvas,
      // and a lost context would make the second run fall back to flat.
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
    };
  }, [pano]);

  const ctrl =
    "grid h-11 w-11 place-items-center text-[#f4f2ee] transition-colors duration-300 hover:text-[#D8B479] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b58c49]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Panorama — ${pano.title}`}
      className={`fixed inset-0 z-[130] bg-[#000000] text-[#f4f2ee] transition-opacity duration-[380ms] ease-[var(--ease-luxe)] ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      {status === "flat" ? (
        // No WebGL: the photo itself, scrolled sideways by hand.
        <div className="h-full overflow-x-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pano.src} alt={pano.alt} className="h-full w-auto max-w-none" />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label={`${pano.alt}. Drag, or use the arrow keys, to look around; plus and minus to zoom.`}
          className="absolute inset-0 h-full w-full cursor-grab touch-none outline-none active:cursor-grabbing"
        />
      )}

      {/* Loading line */}
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="block text-[0.62rem] uppercase tracking-[0.3em] text-[#D8B479]">Opening the room</span>
            <span className="relative mx-auto mt-4 block h-px w-40 overflow-hidden bg-[rgba(244,242,238,0.15)]">
              <span className="absolute inset-y-0 left-0 w-1/3 animate-[u-load_1.2s_ease-in-out_infinite] bg-[#D8B479]" />
            </span>
          </div>
        </div>
      )}

      {/* Top: title + close, on a soft scrim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[rgba(0,0,0,0.72)] to-transparent pb-16">
        <div className="u-shell flex items-start justify-between pt-6 sm:pt-8">
          <div>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#D8B479]">Panoramic view</span>
            <span className="mt-2 block font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] font-light leading-none">{pano.title}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="pointer-events-auto -mr-2 flex items-center gap-3 px-2 py-2 text-[0.66rem] uppercase tracking-[0.24em] transition-colors duration-300 hover:text-[#D8B479] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b58c49]"
          >
            Close
            <span aria-hidden="true" className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {/* Bottom: hint + controls */}
      {status === "ready" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(0,0,0,0.72)] to-transparent pt-16">
          <div className="u-shell flex items-end justify-between gap-6 pb-6 sm:pb-8">
            <p
              className={`flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.8)] transition-opacity duration-700 ${
                touched ? "opacity-0" : "opacity-100"
              }`}
            >
              <span aria-hidden="true" className="h-[6px] w-[6px] rotate-45 bg-[#D8B479]" />
              <span className="hidden sm:inline">Drag to look around · scroll to zoom</span>
              <span className="sm:hidden">Swipe to look around</span>
            </p>

            <div className="pointer-events-auto flex items-center gap-1">
              {gyro !== "unavailable" && (
                <button
                  type="button"
                  aria-pressed={gyro === "on"}
                  onClick={() => apiRef.current?.setGyro(gyro !== "on")}
                  className={`mr-3 flex items-center gap-2.5 whitespace-nowrap py-3 text-[0.62rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
                    gyro === "on" ? "text-[#D8B479]" : "text-[#f4f2ee]"
                  }`}
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M5 1.5h6v13H5z" />
                    <path d="M7 12.5h2" />
                  </svg>
                  Move phone
                </button>
              )}
              <button type="button" aria-label="Zoom out" onClick={() => apiRef.current?.zoom(1 / 0.82)} className={ctrl}>
                <span aria-hidden="true" className="block h-px w-4 bg-current" />
              </button>
              <button type="button" aria-label="Zoom in" onClick={() => apiRef.current?.zoom(0.82)} className={ctrl}>
                <span aria-hidden="true" className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                  <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
