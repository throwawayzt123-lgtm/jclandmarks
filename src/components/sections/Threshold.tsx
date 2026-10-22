"use client";

import { useLayoutEffect, useRef } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";

/**
 * Chapter Transition: Architectural Threshold
 * Connects the deep obsidian cinema to the warm silk paper ground with seamless grace.
 */
export default function Threshold() {
 const rootRef = useRef<HTMLElement>(null);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: root,
 start:"top bottom",
 end:"bottom top",
 scrub: 0.8,
        },
      });

 tl.fromTo(
".th-veil",
        { yPercent: 0 },
        { yPercent: -100, ease:"none" },
        0
      )
        .fromTo(
".th-rule",
          { scaleY: 0 },
          { scaleY: 1, ease:"none" },
          0.05
        )
        .fromTo(
".th-mark",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, ease:"power2.out" },
          0.25
        )
        .fromTo(
".th-quote",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease:"power2.out" },
          0.38
        );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 aria-hidden="true"
 className="relative h-[48svh] overflow-hidden bg-[var(--surface)]"
    >
      {/* Seamless dark veil receding */}
      <div className="th-veil absolute inset-0 bg-[linear-gradient(to_bottom,var(--cine-ground)_0%,var(--cine-ground)_55%,rgba(7,9,14,0)_100%)] pointer-events-none" />

      {/* Atmospheric center aperture */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-[var(--gutter)] text-center">
        <span className="th-rule block h-14 w-px origin-top bg-[var(--brand-gold)]" />
        <span className="th-mark u-eyebrow text-[var(--accent)] tracking-[0.38em]">
          Chapter 01 · The Residence
        </span>
        <p className="th-quote font-serif italic text-sm md:text-base text-[var(--on-surface-muted)] max-w-sm">
          Where structure yields to atmosphere
        </p>
      </div>
    </section>
  );
}
