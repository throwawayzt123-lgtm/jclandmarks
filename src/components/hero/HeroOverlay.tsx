"use client";

import { useLayoutEffect, useRef, type RefObject } from"react";
import { gsap, ScrollTrigger, prefersReducedMotion } from"@/lib/gsap";

interface HeroOverlayProps {
  /** The pinned hero section — shared trigger for the text timeline. */
 sectionRef: RefObject<HTMLElement | null>;
  /** Becomes true once the sequence is ready and the curtain is lifting. */
 active: boolean;
 scrollLengthVh?: number;
}

export default function HeroOverlay({
 sectionRef,
 active,
 scrollLengthVh = 5.5,
}: HeroOverlayProps) {
 const rootRef = useRef<HTMLDivElement>(null);

 useLayoutEffect(() => {
 if (!active) return;
 const root = rootRef.current;
 const section = sectionRef.current;
 if (!root || !section) return;

 const reduced = prefersReducedMotion();

 const ctx = gsap.context(() => {
 if (reduced) {
 gsap.set(".hero-act-1 > *", { opacity: 1, y: 0, clipPath:"none" });
 gsap.set([".hero-act-2",".hero-act-3"], { display:"none" });
 return;
      }

      // Initial state to guarantee clean masked entrance
 gsap.set(".hero-reveal", { yPercent: 120, opacity: 0 });
 gsap.set(".hero-fade", { opacity: 0, y: 20 });

      // Entrance animation on curtain lift
 const intro = gsap.timeline({
 defaults: { ease:"power3.out", duration: 1.4 },
 delay: 0.15,
      });
 intro
        .to(
".hero-reveal",
          { yPercent: 0, opacity: 1, stagger: 0.14 }
        )
        .to(
".hero-fade",
          { opacity: 1, y: 0, stagger: 0.08, duration: 1.0 },
"-=0.9"
        );

      // Scroll choreography synchronized to the frame sequence scrub
 const tl = gsap.timeline({
 scrollTrigger: {
          // The hero pin consumes `scrollLengthVh` viewports BEFORE this
          // trigger is measured, so"top top" resolved to the moment the pin
          // ENDS — putting this whole timeline past the hero and leaving it
          // at progress 0 throughout. Pinning the start to absolute scroll
          // position 0 makes it share the pin's exact range instead.
 trigger: section,
 start: () => 0,
 end: () => window.innerHeight * scrollLengthVh,
 scrub: 0.6,
 invalidateOnRefresh: true,
        },
 defaults: { ease:"none" },
      });

      // Act 1 — The Approach
 tl.to(
".hero-act-1",
        { yPercent: -12, opacity: 0, duration: 0.22 },
        0.04
      )
        .to(".hero-cue", { opacity: 0, duration: 0.08 }, 0)

        // Act 2 — The Threshold
        .fromTo(
".hero-act-2",
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.09 },
          0.3
        )
        .to(".hero-act-2", { opacity: 0, y: -24, duration: 0.09 }, 0.46)

        // Act 3 — The Grand Interior
        .fromTo(
".hero-act-3",
          { opacity: 0, y: 32, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.12 },
          0.62
        )
        .to(".hero-act-3", { opacity: 0, duration: 0.08 }, 0.94);
    }, root);

 return () => ctx.revert();
  }, [active, sectionRef, scrollLengthVh]);

 return (
    <div
 ref={rootRef}
 className="pointer-events-none absolute inset-0 z-10 flex items-end md:items-center"
    >
      {/* Directional Scrim */}
      <div
 aria-hidden="true"
 className="hero-act-1 u-scrim-left absolute inset-0 pointer-events-none"
      />

      {/* ---------- Act 1 — The Approach ---------- */}
      <div className="hero-act-1 u-shell relative w-full pb-24 md:pb-0">
        <div className="max-w-[50rem]">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="hero-reveal u-eyebrow flex items-center gap-2.5 text-[var(--cine-accent)]">
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--cine-accent)] shadow-[0_0_8px_var(--cine-accent)]" />
              Design · Build · Deliver
            </span>
          </div>

          <h1 className="u-display mt-6 text-display text-[var(--cine-text)] leading-[0.94]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-reveal block font-light">We Build</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-reveal block italic text-[rgba(247,246,242,0.92)]">
                What Others Draw
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-6 max-w-sm text-pretty text-[0.82rem] leading-relaxed text-[rgba(247,246,242,0.72)] sm:text-sm md:mt-8 md:max-w-md md:text-base">
            From foundation to final finish — engineered, built and handed
 over by our own teams.
          </p>

          {/* Quick specs badge strip */}
          
        </div>
      </div>

      {/* ---------- Scroll Cue ---------- */}
      <div className="hero-cue hero-fade absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 sm:bottom-10 pointer-events-auto">
        <a
 href="#residence"
 className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-100"
        >
          <span className="u-sr-only">Scroll to explore the residence</span>
          <div className="relative flex h-9 w-5 items-start justify-center shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] p-1 transition-colors group-hover:border-[var(--cine-accent)]">
            <span className="h-1.5 w-1 bg-[var(--cine-accent)] animate-bounce" />
          </div>
        </a>
      </div>

      {/* ---------- Act 2 — The Threshold ---------- */}
      <div className="hero-act-2 absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] text-center opacity-0 pointer-events-none">
        <div aria-hidden="true" className="u-scrim-center absolute inset-0" />
        <span className="u-eyebrow relative mb-4 text-[var(--cine-accent)]">
          Chapter II · The Threshold
        </span>
        <h2 className="u-display relative max-w-[22ch] text-h2 text-[var(--cine-text)]">
          Crossing into the living volume
        </h2>
      </div>

      {/* ---------- Act 3 — The Grand Interior ---------- */}
      <div className="hero-act-3 absolute inset-0 flex flex-col items-start justify-end px-[var(--gutter)] pb-[12vh] opacity-0 pointer-events-none">
        <div
 aria-hidden="true"
 className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,14,0.86)_0%,rgba(7,9,14,0.45)_26%,rgba(7,9,14,0)_52%)]"
        />
        <span className="u-eyebrow relative mb-3 text-[var(--cine-accent)]">
          Chapter III · The Horizon
        </span>
        <h2 className="u-display relative max-w-[20ch] text-h2 text-[var(--cine-text)] leading-[1.08]">
          Where architecture
          <br />
          <span className="italic text-[rgba(247,246,242,0.92)]">gives way to the horizon</span>
        </h2>
      </div>
    </div>
  );
}
