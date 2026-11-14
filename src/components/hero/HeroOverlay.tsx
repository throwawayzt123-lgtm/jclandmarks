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
        // The scrim only fades; it must not travel with the text, or its
        // bottom edge lifts and exposes an unshaded strip.
        .to(".hero-scrim", { opacity: 0, duration: 0.22 }, 0.04)
        .to(".hero-cue", { opacity: 0, duration: 0.08 }, 0)

        // Act 2 — The Threshold. The panel (with its full-screen shade) only
        // fades; just the text moves, so the shade never shows an edge.
        .fromTo(".hero-act-2", { opacity: 0 }, { opacity: 1, duration: 0.09 }, 0.3)
        .fromTo(".hero-act-2 .hero-text", { y: 24 }, { y: 0, duration: 0.09 }, 0.3)
        .to(".hero-act-2", { opacity: 0, duration: 0.09 }, 0.46)
        .to(".hero-act-2 .hero-text", { y: -24, duration: 0.09 }, 0.46)

        // Act 3 — The Handover
        .fromTo(".hero-act-3", { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.62)
        .fromTo(".hero-act-3 .hero-text", { y: 32 }, { y: 0, duration: 0.12 }, 0.62)
        .to(".hero-act-3", { opacity: 0, duration: 0.08 }, 0.94);
    }, root);

 return () => ctx.revert();
  }, [active, sectionRef, scrollLengthVh]);

 return (
    <div
 ref={rootRef}
 className="pointer-events-none absolute inset-0 z-10 flex items-end"
    >
      {/* Directional Scrim */}
      <div
 aria-hidden="true"
 className="hero-scrim u-scrim-left absolute inset-0 pointer-events-none"
      />

      {/* ---------- Act 1 — The Approach ---------- */}
      <div className="hero-act-1 u-shell relative w-full pb-[clamp(6.5rem,16vh,9.5rem)]">
        {/* Just the headline: large, light, and left to carry the screen. */}
        <h1
          className="u-display text-[clamp(2.6rem,6.2vw,6.75rem)] leading-[0.95] tracking-[-0.025em] text-[var(--cine-text)] [text-shadow:0_2px_40px_rgba(0,0,0,0.45)]"
        >
          {/* What and where, inside the H1 so search engines read it as the page's subject */}
          <span className="hero-fade mb-6 block font-sans text-[0.66rem] font-semibold uppercase not-italic tracking-[0.34em] text-[#D8B479] [text-shadow:none] sm:text-[0.72rem] md:mb-8">
            Design &amp; build construction · Lahore
            <span className="u-sr-only"> — </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span className="hero-reveal block font-light">Ordinary is not</span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="hero-reveal block pl-[0.06em] font-light italic text-[#EBD2A0] [text-shadow:0_2px_36px_rgba(0,0,0,0.75),0_0_2px_rgba(0,0,0,0.35)]">
              our address.
            </span>
          </span>
        </h1>
        <span
          aria-hidden="true"
          className="hero-fade mt-7 block h-px w-24 bg-[linear-gradient(to_right,#D8B479,rgba(216,180,121,0))] md:mt-10"
        />
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

      {/* ---------- Act 2 — The Threshold (bottom-left, clear of the view) ---------- */}
      <div className="hero-act-2 absolute inset-0 flex items-end opacity-0 pointer-events-none">
        <div aria-hidden="true" className="u-scrim-left absolute inset-0" />
        <div className="hero-text u-shell relative w-full pb-[clamp(6.5rem,16vh,9.5rem)] text-left">
          <span className="u-eyebrow mb-4 block text-[var(--cine-accent)]">Step Inside</span>
          <h2 className="u-display max-w-[16ch] text-h2 text-[var(--cine-text)] [text-shadow:0_2px_36px_rgba(0,0,0,0.6)]">
            Every room, planned with you
          </h2>
        </div>
      </div>

      {/* ---------- Act 3 — The Handover (bottom-left) ---------- */}
      <div className="hero-act-3 absolute inset-0 flex items-end opacity-0 pointer-events-none">
        <div aria-hidden="true" className="u-scrim-left absolute inset-0" />
        <div className="hero-text u-shell relative w-full pb-[clamp(6.5rem,16vh,9.5rem)] text-left">
          <span className="u-eyebrow mb-5 block text-[var(--cine-accent)]">The Handover</span>
          <h2 className="u-display max-w-[18ch] text-h2 leading-[1.1] text-[var(--cine-text)] [text-shadow:0_2px_36px_rgba(0,0,0,0.6)]">
            Built to be lived in.
            <br />
            <span className="italic text-[rgba(247,246,242,0.92)]">Made to last generations.</span>
          </h2>
          <span aria-hidden="true" className="mt-7 block h-px w-14 bg-[var(--cine-accent)]" />
          <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-[rgba(247,246,242,0.82)] sm:text-[0.98rem]">
            Every home we build is handed over complete — keys, drawings and guarantees in one hand.
          </p>
        </div>
      </div>
    </div>
  );
}
