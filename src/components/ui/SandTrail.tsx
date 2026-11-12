"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * SAND TRAIL — fine grains of gold sand spill from the pointer as it moves.
 *
 * Grains are laid evenly along the path the pointer travelled (not just where
 * it landed each frame), so a fast sweep leaves an unbroken stream. Each grain
 * keeps a little of the pointer's momentum, settles under a light gravity,
 * slows in the air and fades — like sand poured from a moving hand.
 *
 * One canvas over the page, click-through. The animation loop only runs while
 * there are grains to draw, so an idle pointer costs nothing. Mouse and pen
 * only; off for touch and for reduced motion.
 */

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  tone: number;
}

/** Sand tones, light to deep gold — readable on both white and black. */
const TONES = ["#efd9ad", "#e2c38c", "#d8b479", "#c9a063", "#b58c49"];
const MAX_GRAINS = 380;
/** Grains per pixel of pointer travel. */
const DENSITY = 0.3;

export default function SandTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const grains: Grain[] = [];
    let last: { x: number; y: number; t: number } | null = null;
    let raf = 0;
    let prevT = 0;

    const spawn = (x: number, y: number, dx: number, dy: number) => {
      if (grains.length >= MAX_GRAINS) grains.shift();
      const spread = 2.5;
      const max = 0.45 + Math.random() * 0.5; // seconds
      grains.push({
        x: x + (Math.random() - 0.5) * spread * 2,
        y: y + (Math.random() - 0.5) * spread * 2,
        // A share of the pointer's motion, plus a little scatter.
        vx: dx * 0.06 + (Math.random() - 0.5) * 18,
        vy: dy * 0.06 + (Math.random() - 0.5) * 18 - 4,
        life: max,
        max,
        size: 0.8 + Math.random() * 1.2,
        tone: (Math.random() * TONES.length) | 0,
      });
    };

    const tick = (t: number) => {
      const dt = Math.min(0.05, prevT ? (t - prevT) / 1000 : 0.016);
      prevT = t;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = grains.length - 1; i >= 0; i--) {
        const g = grains[i];
        g.life -= dt;
        if (g.life <= 0) {
          grains.splice(i, 1);
          continue;
        }
        // Air drag, then a gentle fall.
        const drag = Math.pow(0.06, dt);
        g.vx *= drag;
        g.vy = g.vy * drag + 90 * dt;
        g.x += g.vx * dt;
        g.y += g.vy * dt;

        const k = g.life / g.max; // 1 → 0
        ctx.globalAlpha = Math.min(1, k * 1.8);
        ctx.fillStyle = TONES[g.tone];
        const s = g.size * (0.55 + 0.45 * k);
        ctx.fillRect(g.x - s / 2, g.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      if (grains.length) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        prevT = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        // Velocity in px/s, for the grains' momentum.
        const sec = Math.max(0.008, (now - last.t) / 1000);
        const vx = dx / sec;
        const vy = dy / sec;
        const n = Math.min(14, Math.round(dist * DENSITY));
        for (let i = 0; i < n; i++) {
          const f = (i + Math.random()) / n;
          spawn(last.x + dx * f, last.y + dy * f, vx, vy);
        }
      }
      last = { x, y, t: now };
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      last = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] h-full w-full"
    />
  );
}
