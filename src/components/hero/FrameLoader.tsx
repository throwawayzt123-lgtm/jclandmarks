"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { setScrollLocked } from "@/components/SmoothScrollProvider";

/**
 * THE MARK — loading screen.
 *
 * The logo holds the centre of a black screen. Around it, a hairline gold arc
 * closes as the page loads — a ring being drawn, not a spinner — and four gold
 * panes light in turn beneath it, one for each quarter of the load, echoing
 * the window in the mark. Fine motes of gold drift up through the dark behind
 * everything.
 *
 * At handover the ring completes and flares, a ripple of light leaves the mark,
 * the tagline resolves beneath it, and the whole screen irises away from the
 * centre to reveal the site.
 *
 * Lightly alive: a pool of light follows the cursor and the mark leans a hair
 * toward it. Plays in full once per visit; a return to the homepage gets a
 * short fade, and reduced-motion users get the finished screen and a plain fade.
 */
interface FrameLoaderProps {
  /** 0..1 — share of the frames needed before the hero can be revealed. */
  progress: number;
  /** Flips true once the hero is ready; starts the handover sequence. */
  done: boolean;
  /** Called after the screen has cleared. */
  onExited?: () => void;
}

/** Survives client-side navigation, so the intro plays once per visit. */
let introPlayed = false;

/** Shortest time the screen stays on a first visit, so a warm cache never flashes it. */
const MIN_BUILD_SECONDS = 1.3;

/** Ring geometry, in the SVG's own units. */
const R = 92;
const CIRC = 2 * Math.PI * R;

/** Motes of gold drifting up behind the mark: [left%, delay s, duration s, size px]. */
const MOTES: Array<[number, number, number, number]> = [
  [8, 0, 13, 2], [17, 3.4, 16, 1], [26, 1.4, 11, 2], [35, 6, 15, 1],
  [44, 2.4, 12, 2], [53, 7.6, 17, 1], [62, 0.8, 14, 2], [71, 4.6, 12, 1],
  [80, 2, 16, 2], [89, 6.8, 13, 1], [95, 1.2, 15, 1], [3, 5.2, 12, 2],
];

export default function FrameLoader({ progress, done, onExited }: FrameLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const panesRef = useRef<HTMLSpanElement[]>([]);
  const shown = useRef({ v: 0 });
  const startedAt = useRef(0);
  // Fixed for the component's whole life, so they may be read during render.
  const [quick] = useState(() => introPlayed);
  const [reduced] = useState(() => prefersReducedMotion());
  const exiting = useRef(false);
  // The parent passes a fresh callback on every render; keep the latest one
  // in a ref so the handover effect depends on `done` alone.
  const onExitedRef = useRef(onExited);
  useEffect(() => {
    onExitedRef.current = onExited;
  });

  /** Paint a 0..1 loading value into the arc, the panes and the counter. */
  const render = useCallback((v: number) => {
    if (arcRef.current) arcRef.current.style.strokeDashoffset = String(CIRC * (1 - v));
    if (counterRef.current) counterRef.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
    // Each pane fills over its own quarter of the load.
    panesRef.current.forEach((pane, i) => {
      if (!pane) return;
      const k = Math.min(1, Math.max(0, v * 4 - i));
      pane.style.opacity = String(0.14 + k * 0.86);
      pane.style.transform = `scale(${0.82 + k * 0.18})`;
    });
  }, []);

  /* ---------- Set up: lock scrolling, dark screen, slow first creep ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    startedAt.current = performance.now();
    panesRef.current = Array.from(root.querySelectorAll<HTMLSpanElement>(".ld-pane"));
    // The page under the loader must not move: start at the top (the browser
    // may restore an old scroll position on reload) and hold it there until
    // the screen has cleared.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setScrollLocked("loader", true);

    const ctx = gsap.context(() => {
      if (reduced || quick) {
        render(1);
        gsap.set(".ld-tag", { opacity: 1, y: 0 });
      } else {
        render(0);
        // While the first frames are still on their way the arc begins anyway,
        // so the mark never sits frozen at zero.
        gsap.to(shown.current, { v: 0.07, duration: 2.6, ease: "power1.out", onUpdate: () => render(shown.current.v) });
        gsap.fromTo(".ld-mark", { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" });
        gsap.fromTo(".ld-rise", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, delay: 0.35, ease: "power3.out" });
      }
    }, root);

    return () => {
      ctx.revert();
      setScrollLocked("loader", false);
    };
  }, [render, quick, reduced]);

  /* ---------- Follow real loading, smoothly ---------- */
  useEffect(() => {
    if (quick) return;
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
  }, [progress, render, quick]);

  /* ---------- Handover: the ring flares, the screen irises away ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!done || !root) return;

    let ctx: gsap.Context | undefined;
    const finish = () => {
      introPlayed = true;
      window.scrollTo(0, 0);
      setScrollLocked("loader", false);
      onExitedRef.current?.();
    };

    // Quick variant (repeat visit) and reduced motion: a clean fade.
    if (quick || reduced) {
      ctx = gsap.context(() => {
        gsap.to(root, { opacity: 0, duration: quick ? 0.45 : 0.6, ease: "power2.out", onComplete: finish });
      }, root);
      return () => ctx?.revert();
    }

    // Let the mark be seen a moment (respecting the minimum) before handover.
    const wait = Math.max(0, MIN_BUILD_SECONDS - (performance.now() - startedAt.current) / 1000);

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: wait,
        onComplete: finish,
        // Tells deferred work (useIntroLayoutEffect) to pause for the screen.
        onStart: () => {
          exiting.current = true;
          root.setAttribute("data-handover", "");
        },
      });
      tl.to(shown.current, { v: 1, duration: 0.4, ease: "power2.out", onUpdate: () => render(shown.current.v) })
        // The ring completes and flares.
        .to(".ld-ring", { filter: "drop-shadow(0 0 26px rgba(216,180,121,0.75))", duration: 0.5, ease: "power2.out" }, "-=0.1")
        .to(".ld-mark", { scale: 1.05, duration: 0.6, ease: "power2.out" }, "<")
        // A ripple of light leaves the mark.
        .fromTo(".ld-ripple", { opacity: 0.55, scale: 0.9 }, { opacity: 0, scale: 2.6, duration: 1.2, ease: "power2.out" }, "<")
        // The tagline resolves beneath it.
        .fromTo(".ld-tag", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<0.2")
        .to(".ld-meta", { opacity: 0, duration: 0.5, ease: "power2.in" }, "<")
        // Then the screen irises away from the centre.
        .to(".ld-mark, .ld-tag", { opacity: 0, scale: 1.14, duration: 0.9, ease: "power3.in" }, "+=0.55")
        .to(root, { clipPath: "circle(0% at 50% 50%)", duration: 1.1, ease: "power4.inOut" }, "<0.25");
    }, root);

    return () => ctx?.revert();
  }, [done, render, quick, reduced]);

  /* ---------- A little life: light follows the cursor, the mark leans ---------- */
  const playable = !quick && !reduced;
  const sheenRef = useRef<HTMLDivElement>(null);
  const tiltX = useRef<((v: number) => void) | null>(null);
  const tiltY = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    if (!playable || !markRef.current) return;
    gsap.set(markRef.current, { transformPerspective: 800 });
    tiltX.current = gsap.quickTo(markRef.current, "rotationY", { duration: 0.9, ease: "power3.out" });
    tiltY.current = gsap.quickTo(markRef.current, "rotationX", { duration: 0.9, ease: "power3.out" });
    return () => {
      tiltX.current = tiltY.current = null;
    };
  }, [playable]);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!playable || exiting.current || e.pointerType === "touch") return;
      const el = sheenRef.current;
      if (el) {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
        el.style.opacity = "1";
      }
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tiltX.current?.(nx * 14);
      tiltY.current?.(ny * -14);
    },
    [playable]
  );

  const pct = quick ? 100 : 0;

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
      className="fixed inset-0 z-[120] overflow-hidden bg-[#050505] text-[#f4f2ee] [clip-path:circle(150%_at_50%_50%)]"
    >
      {/* A deep pool of warm light behind the mark, and a vignette at the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_42%_at_50%_46%,rgba(216,180,121,0.11),transparent_72%),radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_52%,rgba(0,0,0,0.7)_100%)]"
      />

      {/* Motes of gold drifting up through the dark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {!quick &&
          !reduced &&
          MOTES.map(([left, delay, dur, size], i) => (
            <span
              key={i}
              className="ld-mote absolute bottom-[-6%] rounded-full bg-[#D8B479]"
              style={{
                left: `${left}%`,
                width: size,
                height: size,
                animation: `ld-mote ${dur}s linear ${delay}s infinite`,
              }}
            />
          ))}
      </div>

      {/* Light that follows the cursor */}
      <div
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{ backgroundImage: "radial-gradient(circle 300px at var(--mx, 50%) var(--my, 50%), rgba(216,180,121,0.07), transparent 100%)" }}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        {/* The mark, inside the closing ring */}
        <div ref={markRef} className="ld-mark relative grid h-[clamp(13rem,30vw,17rem)] w-[clamp(13rem,30vw,17rem)] place-items-center will-change-transform">
          {/* Ripple that leaves the mark at handover */}
          <span aria-hidden="true" className="ld-ripple absolute inset-0 rounded-full opacity-0 shadow-[0_0_0_1px_rgba(216,180,121,0.6)]" />

          {/* The ring: a faint track, and the gold arc that closes as it loads */}
          <svg aria-hidden="true" viewBox="0 0 200 200" className="ld-ring absolute inset-0 h-full w-full -rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(244,242,238,0.09)" strokeWidth="1" />
            <circle
              ref={arcRef}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="#D8B479"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              style={{ strokeDashoffset: quick ? 0 : CIRC }}
            />
          </svg>

          {/* The logo itself. Its artwork sits on an opaque black square, so
              its edges are feathered into the screen rather than left as a box. */}
          <span
            className="relative block h-[64%] w-[64%]"
            style={{
              maskImage: "radial-gradient(ellipse 72% 86% at 50% 50%, #000 72%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 72% 86% at 50% 50%, #000 72%, transparent 100%)",
            }}
          >
            <Image src="/images/jc-logo-gold.png" alt="" fill priority sizes="(max-width: 640px) 150px, 190px" className="object-contain" />
          </span>
        </div>

        {/* Four panes — one per quarter of the load, echoing the window in the mark */}
        <div className="ld-rise ld-meta mt-10 grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className="ld-pane block h-2.5 w-2.5 bg-[#D8B479]"
              style={{ opacity: quick ? 1 : 0.14, transform: `scale(${quick ? 1 : 0.82})` }}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="ld-rise ld-meta mt-7 text-[0.62rem] tabular-nums tracking-[0.34em] text-[rgba(244,242,238,0.5)]">
          <span ref={counterRef}>{String(pct).padStart(3, "0")}</span>
        </span>

        {/* The tagline resolves at handover */}
        <p className="ld-tag mt-8 text-center font-serif text-[clamp(1rem,2.6vw,1.35rem)] font-light italic leading-snug text-[#EBD2A0] opacity-0 [text-wrap:balance]">
          Ordinary is not our address.
        </p>
      </div>
    </div>
  );
}
