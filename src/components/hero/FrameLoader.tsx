"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { setScrollLocked } from "@/components/SmoothScrollProvider";

/**
 * THE CURTAIN — loading screen.
 *
 * The house lights are down: plain black velvet curtains hang closed and the
 * Jay-Cee logo sits on the cloth, with a hairline of gold beneath it that
 * fills as the page really loads.
 *
 * At handover the logo lifts away and the curtains draw apart — gathering into
 * folds as they travel — to reveal the home.
 *
 * It is lightly alive: a sheen of candlelight follows the cursor across the
 * velvet, the cloth sways a hair against it, and the crest drifts.
 *
 * Plays in full once per visit; a return to the homepage gets a short fade, and
 * reduced-motion users get the finished screen and a plain fade.
 */
interface FrameLoaderProps {
  /** 0..1 — share of the frames needed before the hero can be revealed. */
  progress: number;
  /** Flips true once the hero is ready; starts the handover sequence. */
  done: boolean;
  /** Called after the curtains have opened. */
  onExited?: () => void;
}

/** Survives client-side navigation, so the intro plays once per visit. */
let introPlayed = false;

/** Shortest time the curtains hang closed on a first visit, so a warm cache never flashes them. */
const MIN_BUILD_SECONDS = 1.1;

/** Velvet: folds of light and shadow repeating across each curtain, shaded top and bottom. */
const VELVET =
  "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.45) 100%), " +
  "repeating-linear-gradient(90deg, #060606 0%, #141414 2.6%, #262626 4.4%, #1a1a1a 6%, #0b0b0b 8.4%, #050505 10%, #060606 12.5%)";

export default function FrameLoader({ progress, done, onExited }: FrameLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  const startedAt = useRef(0);
  const quick = useRef(introPlayed);
  // The parent passes a fresh callback on every render; keep the latest one
  // in a ref so the handover effect depends on `done` alone.
  const onExitedRef = useRef(onExited);
  useEffect(() => {
    onExitedRef.current = onExited;
  });

  /** Paint a 0..1 loading value into the gold hairline and the counter. */
  const render = useCallback((v: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${v})`;
    if (counterRef.current) counterRef.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
  }, []);

  /* ---------- Set up: lock scrolling, curtains hang closed, slow first creep ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    startedAt.current = performance.now();
    // The page under the loader must not move: start at the top (the browser
    // may restore an old scroll position on reload) and hold it there until
    // the curtains have opened.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setScrollLocked("loader", true);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced || quick.current) {
        render(1);
      } else {
        render(0);
        // While the first frames are still on their way the arc begins anyway,
        // so the medallion never sits frozen at zero.
        gsap.to(shown.current, { v: 0.07, duration: 2.6, ease: "power1.out", onUpdate: () => render(shown.current.v) });
        gsap.fromTo(".ld-center > *", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.3, stagger: 0.12, delay: 0.25, ease: "power3.out" });
      }
    }, root);

    return () => {
      ctx.revert();
      setScrollLocked("loader", false);
    };
  }, [render]);

  /* ---------- Follow real loading, smoothly ---------- */
  useEffect(() => {
    if (quick.current) return;
    const tween = gsap.to(shown.current, {
      // Forward only: real progress below the setting-out creep is ignored.
      v: Math.max(shown.current.v, Math.min(1, progress)),
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => render(shown.current.v),
    });
    return () => {
      tween.kill();
    };
  }, [progress, render]);

  /* ---------- Handover: the crest flares, the curtains draw apart ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!done || !root) return;
    const reduced = prefersReducedMotion();

    let ctx: gsap.Context | undefined;
    const finish = () => {
      introPlayed = true;
      window.scrollTo(0, 0);
      setScrollLocked("loader", false);
      onExitedRef.current?.();
    };

    // Quick variant (repeat visit) and reduced motion: a clean fade.
    if (quick.current || reduced) {
      ctx = gsap.context(() => {
        gsap.to(root, { opacity: 0, duration: quick.current ? 0.45 : 0.6, ease: "power2.out", onComplete: finish });
      }, root);
      return () => ctx?.revert();
    }

    // Let the curtains hang a moment (respecting the minimum) before they open.
    const wait = Math.max(0, MIN_BUILD_SECONDS - (performance.now() - startedAt.current) / 1000);

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: wait,
        onComplete: finish,
        // Tells deferred work (useIntroLayoutEffect) to pause for the curtains.
        onStart: () => root.setAttribute("data-handover", ""),
      });
      tl.to(shown.current, { v: 1, duration: 0.35, ease: "power2.out", onUpdate: () => render(shown.current.v) })
        // The logo lifts away as the cloth begins to move.
        .to(".ld-center", { opacity: 0, y: -18, duration: 0.6, ease: "power2.in" }, "+=0.3")
        .to(".ld-sheen", { opacity: 0, duration: 0.5 }, "<")
        // The curtains gather into folds toward the edges...
        .to(".ld-curtain", { scaleX: 0.13, duration: 1.9, ease: "power3.inOut" }, "-=0.25")
        // ...then slip clear of the screen.
        .to(".ld-curtain-l", { xPercent: -100, duration: 0.7, ease: "power2.in" }, "-=0.55")
        .to(".ld-curtain-r", { xPercent: 100, duration: 0.7, ease: "power2.in" }, "<");
    }, root);

    return () => ctx?.revert();
  }, [done, render]);

  /* ---------- A little life: sheen follows the cursor, cloth sways, crest drifts ---------- */
  const playable = !quick.current && !prefersReducedMotion();
  const sheenRef = useRef<HTMLDivElement>(null);
  const sway = useRef<((v: number) => void) | null>(null);
  const driftX = useRef<((v: number) => void) | null>(null);
  const driftY = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    if (!playable) return;
    sway.current = gsap.quickTo(".ld-curtain", "skewX", { duration: 1.1, ease: "power3.out" });
    driftX.current = gsap.quickTo(".ld-center", "x", { duration: 0.9, ease: "power3.out" });
    driftY.current = gsap.quickTo(".ld-center", "y", { duration: 0.9, ease: "power3.out" });
    return () => {
      sway.current = driftX.current = driftY.current = null;
    };
  }, [playable]);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!playable || e.pointerType === "touch") return;
      const el = sheenRef.current;
      if (el) {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
        el.style.opacity = "1";
      }
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      sway.current?.(nx * 1.4);
      driftX.current?.(nx * -16);
      driftY.current?.(ny * -12);
    },
    [playable]
  );

  const pct = quick.current ? 100 : 0;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Jay-Cee Landmarks"
      // Locks page scrolling through CSS (see globals.css) from the very first
      // paint — before any JavaScript has loaded — and releases it the moment
      // the loader leaves the page.
      data-scroll-lock=""
      onPointerMove={onMove}
      className="fixed inset-0 z-[120] overflow-hidden text-[#f4f2ee]"
    >
      {/* The two curtains. Each gathers toward its own outer edge. */}
      <div
        aria-hidden="true"
        className="ld-curtain ld-curtain-l absolute inset-y-0 left-0 w-[calc(50%+1px)] origin-left"
        style={{ background: VELVET, backgroundColor: "#0a0a0a" }}
      >
      </div>
      <div
        aria-hidden="true"
        className="ld-curtain ld-curtain-r absolute inset-y-0 right-0 w-[calc(50%+1px)] origin-right"
        style={{ background: VELVET, backgroundColor: "#0a0a0a" }}
      >
      </div>

      {/* Candlelight sheen that follows the cursor over the velvet */}
      <div
        ref={sheenRef}
        aria-hidden="true"
        className="ld-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{ backgroundImage: "radial-gradient(circle 340px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.07), transparent 100%)" }}
      />

      {/* A soft pool of light behind the crest, vignette at the corners */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,rgba(255,255,255,0.05),transparent_70%),radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.55)_100%)]"
      />

      {/* Logo on the cloth, with a gold hairline that fills as the page loads */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <div className="ld-center pointer-events-none flex flex-col items-center will-change-transform">
          <div className="grid h-[clamp(9rem,20vw,12rem)] w-[clamp(9rem,20vw,12rem)] place-items-center rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(216,180,121,0.45),0_0_60px_-8px_rgba(216,180,121,0.35)]">
            <div className="relative h-[70%] w-[70%]">
              <Image src="/images/jc-logo-gold.png" alt="" fill priority sizes="130px" className="object-contain" />
            </div>
          </div>
          <div className="mt-10 flex w-[clamp(9rem,22vw,13rem)] items-center gap-4">
            <span className="relative h-px flex-1 bg-[rgba(244,242,238,0.14)]">
              <span ref={barRef} className="absolute inset-0 origin-left bg-[#D8B479]" style={{ transform: `scaleX(${quick.current ? 1 : 0})` }} />
            </span>
            <span className="text-[0.62rem] tabular-nums tracking-[0.2em] text-[rgba(244,242,238,0.6)]">
              <span ref={counterRef}>{String(pct).padStart(3, "0")}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
