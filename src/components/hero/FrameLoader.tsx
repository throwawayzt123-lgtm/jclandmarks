"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { setScrollLocked } from "@/components/SmoothScrollProvider";

/**
 * THE BUILD — loading screen.
 *
 * The page loads the way the company works: on a dark drawing sheet, the
 * Jay-Cee roof mark is set out and built line by line in step with real
 * loading — footings, posts, beam, the crossing roof, then the window. A
 * ledger ticks through the practice's own stages, Setting Out to Handover.
 *
 * At handover the four window panes light up, the wordmark spells itself
 * out, a seam of gold light opens down the middle of the screen, and the
 * sheet parts like a pair of doors onto the hero: the visitor walks in.
 *
 * The full sequence plays once per visit. Returning to the homepage later in
 * the same session gets a short fade instead, and reduced-motion users get
 * the finished drawing and a plain fade.
 */
interface FrameLoaderProps {
  /** 0..1 — share of the frames needed before the hero can be revealed. */
  progress: number;
  /** Flips true once the hero is ready; starts the handover sequence. */
  done: boolean;
  /** Called after the doors have opened. */
  onExited?: () => void;
}

const STAGES = ["Setting out", "Foundations", "Frame", "Façade", "Handover"];

/** Survives client-side navigation, so the intro plays once per visit. */
let introPlayed = false;

/** Shortest time the build is on screen on a first visit, so a warm cache never flashes it. */
const MIN_BUILD_SECONDS = 2.2;

export default function FrameLoader({ progress, done, onExited }: FrameLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const buildRef = useRef<gsap.core.Timeline | null>(null);
  const shown = useRef({ v: 0 });
  const startedAt = useRef(0);
  const quick = useRef(introPlayed);
  // The parent passes a fresh callback on every render; keep the latest one
  // in a ref so the handover effect depends on `done` alone.
  const onExitedRef = useRef(onExited);
  useEffect(() => {
    onExitedRef.current = onExited;
  });

  /* ---------- Build the drawing timeline once, paused; progress scrubs it ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    startedAt.current = performance.now();
    // The page under the loader must not move: start at the top (the browser
    // may restore an old scroll position on reload) and hold it there until
    // the doors have opened.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setScrollLocked("loader", true);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const draw = (sel: string) => root.querySelectorAll(sel);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      const line = (sel: string, at: number, dur: number) =>
        tl.fromTo(draw(sel), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, stagger: dur / 4 }, at);

      gsap.set(draw("[data-stroke]"), { strokeDasharray: 1 });
      line('[data-stroke="foot"]', 0, 0.12);
      line('[data-stroke="post"]', 0.1, 0.26);
      line('[data-stroke="beam"]', 0.32, 0.16);
      line('[data-stroke="roof"]', 0.46, 0.32);
      line('[data-stroke="window"]', 0.76, 0.16);
      line('[data-stroke="dim"]', 0.18, 0.7);
      tl.fromTo(draw("[data-dim-label]"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.12 }, 0.4);
      tl.to({}, { duration: 0.0001 }, 1); // pin the timeline length to exactly 1

      buildRef.current = tl;
      if (reduced || quick.current) tl.progress(1);

      // While the first frames are still on their way, the setting-out lines
      // begin anyway, so the sheet never sits frozen at zero.
      if (!reduced && !quick.current) {
        gsap.to(shown.current, {
          v: 0.07,
          duration: 2.6,
          ease: "power1.out",
          onUpdate: () => {
            buildRef.current?.progress(shown.current.v);
            if (counterRef.current) counterRef.current.textContent = String(Math.round(shown.current.v * 100)).padStart(3, "0");
          },
        });
      }

      // The sheet itself arrives.
      if (!reduced && !quick.current) {
        gsap.fromTo(".ld-sheet > *", { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: 0.08, ease: "power2.out" });
      }
    }, root);

    return () => {
      ctx.revert();
      setScrollLocked("loader", false);
    };
  }, []);

  /* ---------- Follow real loading, smoothly ---------- */
  useEffect(() => {
    if (quick.current) return;
    const tween = gsap.to(shown.current, {
      // Forward only: real progress below the setting-out creep is ignored.
      v: Math.max(shown.current.v, Math.min(1, progress)),
      duration: 0.9,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        const v = shown.current.v;
        buildRef.current?.progress(v);
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
        // At 100% every stage is complete, including Handover.
        const stage = v >= 0.999 ? STAGES.length : Math.min(STAGES.length - 1, Math.floor(v * STAGES.length));
        rootRef.current?.querySelectorAll<HTMLElement>("[data-stage]").forEach((el, i) => {
          el.dataset.state = i < stage ? "done" : i === stage ? "now" : "next";
        });
      },
    });
    return () => {
      tween.kill();
    };
  }, [progress]);

  /* ---------- Handover: lights on, wordmark, doors open ---------- */
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

    // Let the drawing finish (and respect the minimum build time) first.
    const wait = Math.max(0, MIN_BUILD_SECONDS - (performance.now() - startedAt.current) / 1000);

    ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: wait, onComplete: finish });
      tl.to(shown.current, {
        v: 1,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          buildRef.current?.progress(shown.current.v);
          if (counterRef.current) counterRef.current.textContent = String(Math.round(shown.current.v * 100)).padStart(3, "0");
        },
        onComplete: () => root.querySelectorAll<HTMLElement>("[data-stage]").forEach((el) => (el.dataset.state = "done")),
      })
        // Lights on.
        .to(".ld-pane", { fill: "#D8B479", duration: 0.5, stagger: 0.09, ease: "power2.out" })
        .to(".ld-glow", { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, "<")
        .to(".ld-mark [data-stroke]", { stroke: "#D8B479", duration: 0.6 }, "<")
        // The wordmark spells itself out.
        .fromTo(".ld-letter", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: "power3.out" }, "-=0.35")
        .to({}, { duration: 0.45 })
        // The sheet clears; a seam of light opens down the middle.
        .to(".ld-content", { opacity: 0, scale: 0.985, duration: 0.55, ease: "power2.in" })
        .fromTo(".ld-seam", { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.55, ease: "power3.inOut" }, "-=0.25")
        // Doors part onto the hero.
        .to(".ld-door-l", { xPercent: -100, duration: 1.35, ease: "power4.inOut" }, "+=0.05")
        .to(".ld-door-r", { xPercent: 100, duration: 1.35, ease: "power4.inOut" }, "<")
        .to(".ld-seam", { opacity: 0, duration: 0.5 }, "<0.15");
    }, root);

    return () => ctx?.revert();
  }, [done]);

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
      className="fixed inset-0 z-[120] overflow-hidden text-[#f4f2ee]"
    >
      {/* Doors — the two halves of the sheet that part at handover */}
      <div aria-hidden="true" className="ld-door-l absolute inset-y-0 left-0 w-[calc(50%+1px)] bg-[#07090e]" />
      <div aria-hidden="true" className="ld-door-r absolute inset-y-0 right-0 w-[calc(50%+1px)] bg-[#07090e]" />
      <span
        aria-hidden="true"
        className="ld-seam absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-center scale-y-0 bg-[#D8B479] shadow-[0_0_24px_6px_rgba(216,180,121,0.55)]"
      />

      <div className="ld-content absolute inset-0">
        {/* Drawing sheet */}
        <div className="ld-sheet absolute inset-0">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(216,180,121,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(216,180,121,0.07) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 60% 55% at 50% 46%, #000 25%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 46%, #000 25%, transparent 78%)",
            }}
          />
          {/* Sheet border + registration marks */}
          <div aria-hidden="true" className="absolute inset-4 shadow-[inset_0_0_0_1px_rgba(244,242,238,0.07)] sm:inset-6" />
          {["left-4 top-4 sm:left-6 sm:top-6", "right-4 top-4 sm:right-6 sm:top-6", "bottom-4 left-4 sm:bottom-6 sm:left-6", "bottom-4 right-4 sm:bottom-6 sm:right-6"].map((pos) => (
            <span key={pos} aria-hidden="true" className={`absolute ${pos} -m-[7px] block h-[15px] w-[15px]`}>
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(216,180,121,0.55)]" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[rgba(216,180,121,0.55)]" />
            </span>
          ))}

          {/* Sheet header */}
          <div className="absolute inset-x-8 top-8 flex items-start justify-between text-[0.56rem] uppercase tracking-[0.3em] text-[rgba(244,242,238,0.42)] sm:inset-x-12 sm:top-12">
            <span>Jay-Cee Landmarks</span>
            <span className="hidden sm:block">Lahore · 31.52° N 74.36° E</span>
            <span>Sheet 00 · Arrival</span>
          </div>
        </div>

        {/* The mark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-[8vh]">
          <div className="ld-mark relative w-[min(66vw,23rem)]">
            <span
              aria-hidden="true"
              className="ld-glow absolute left-1/2 top-[62%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full bg-[radial-gradient(circle,rgba(216,180,121,0.32),transparent_68%)] opacity-0 blur-xl"
            />
            <svg viewBox="0 0 200 170" className="relative block w-full overflow-visible [&_[data-stroke]]:[stroke-dasharray:1] [&_[data-stroke]]:[stroke-dashoffset:1] [&_[data-dim-label]]:opacity-0 motion-reduce:[&_[data-stroke]]:[stroke-dashoffset:0] motion-reduce:[&_[data-dim-label]]:opacity-100" fill="none" strokeLinecap="square" aria-hidden="true">
              {/* Footings */}
              <g stroke="rgba(244,242,238,0.85)" strokeWidth="1.6">
                <path data-stroke="foot" pathLength={1} d="M14 140 H54" />
                <path data-stroke="foot" pathLength={1} d="M146 140 H186" />
                {/* Posts */}
                <path data-stroke="post" pathLength={1} d="M40 140 V18" />
                <path data-stroke="post" pathLength={1} d="M160 140 V18" />
                {/* Beam */}
                <path data-stroke="beam" pathLength={1} d="M20 32 H180" />
                {/* Crossing roof — each line runs past the apex, as in the logo */}
                <path data-stroke="roof" pathLength={1} d="M22 140 L118 16" />
                <path data-stroke="roof" pathLength={1} d="M178 140 L82 16" />
              </g>
              {/* Window: four panes that light up at handover */}
              <g stroke="rgba(244,242,238,0.85)" strokeWidth="1.2">
                {[
                  [88, 82],
                  [102, 82],
                  [88, 96],
                  [102, 96],
                ].map(([x, y]) => (
                  <rect key={`${x}-${y}`} className="ld-pane" data-stroke="window" pathLength={1} x={x} y={y} width="10" height="10" fill="rgba(216,180,121,0)" />
                ))}
              </g>
              {/* Dimension lines */}
              <g stroke="rgba(216,180,121,0.55)" strokeWidth="0.7">
                <path data-stroke="dim" pathLength={1} d="M40 156 H160 M40 152 V160 M160 152 V160" />
                <path data-stroke="dim" pathLength={1} d="M192 18 V140 M188 18 H196 M188 140 H196" />
              </g>
              <text data-dim-label="" x="100" y="167" textAnchor="middle" fill="rgba(216,180,121,0.8)" fontSize="6.5" letterSpacing="1.5" fontFamily="var(--font-body)">
                12.40 M
              </text>
              <text data-dim-label="" x="199" y="82" textAnchor="middle" fill="rgba(216,180,121,0.8)" fontSize="6.5" letterSpacing="1.5" fontFamily="var(--font-body)" transform="rotate(90 199 82)">
                + 9.60 M
              </text>
            </svg>
          </div>

          {/* Wordmark — spelled out at handover */}
          <p aria-label="Jay-Cee Landmarks" className="mt-10 text-center font-serif">
            <span aria-hidden="true" className="block text-[clamp(1.1rem,2.4vw,1.5rem)] font-light tracking-[0.55em] text-[#D8B479]">
              {"JAY-CEE".split("").map((ch, i) => (
                <span key={i} className={`ld-letter inline-block ${quick.current ? "" : "opacity-0"}`}>
                  {ch}
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="mt-2 block text-[clamp(0.7rem,1.4vw,0.85rem)] tracking-[0.62em] text-[rgba(244,242,238,0.7)]">
              {"LANDMARKS".split("").map((ch, i) => (
                <span key={i} className={`ld-letter inline-block ${quick.current ? "" : "opacity-0"}`}>
                  {ch}
                </span>
              ))}
            </span>
          </p>
        </div>

        {/* Build ledger + counter */}
        <div className="absolute inset-x-8 bottom-9 flex items-end justify-between gap-8 sm:inset-x-12 sm:bottom-12">
          <ol className="flex flex-col gap-2.5 text-[0.56rem] uppercase tracking-[0.26em] sm:text-[0.6rem]">
            {STAGES.map((s, i) => (
              <li
                key={s}
                data-stage=""
                data-state={quick.current ? "done" : i === 0 ? "now" : "next"}
                className="group flex items-center gap-3 text-[rgba(244,242,238,0.22)] transition-colors duration-500 data-[state=done]:text-[rgba(244,242,238,0.5)] data-[state=now]:text-[#f4f2ee]"
              >
                <span
                  aria-hidden="true"
                  className="block h-[6px] w-[6px] rotate-45 bg-transparent shadow-[0_0_0_1px_rgba(244,242,238,0.25)] transition-all duration-500 group-data-[state=done]:bg-[#D8B479] group-data-[state=done]:shadow-none group-data-[state=now]:shadow-[0_0_0_1px_#D8B479,0_0_10px_rgba(216,180,121,0.7)]"
                />
                <span className="tabular-nums text-[rgba(216,180,121,0.7)]">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>

          <div className="text-right">
            <span className="block text-[0.56rem] uppercase tracking-[0.3em] text-[rgba(244,242,238,0.42)]">Built</span>
            <span className="mt-1 flex items-baseline justify-end font-serif font-light leading-none">
              <span ref={counterRef} className="tabular-nums text-[clamp(3rem,8vw,5.5rem)] tracking-[-0.02em]">
                {String(pct).padStart(3, "0")}
              </span>
              <span className="ml-1 text-[1.1rem] text-[#D8B479]">%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
