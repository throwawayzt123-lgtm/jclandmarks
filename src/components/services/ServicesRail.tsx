"use client";

import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * A slim chapter index pinned to the right edge on wide screens. It appears
 * only while the three service chapters are on screen, and marks whichever
 * one is crossing the middle of the viewport.
 *
 * State lives on DOM attributes rather than in React, so scrolling never
 * triggers a re-render. Hidden below 1440px, where the page gutter is too
 * narrow to hold it without touching content.
 */
const CHAPTERS = [
  { id: "commercial", no: "01", label: "Commercial" },
  { id: "residential", no: "02", label: "Residential" },
  { id: "real-estate", no: "03", label: "Real Estate" },
];

export default function ServicesRail() {
  const railRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.querySelectorAll<HTMLElement>("[data-rail]"));

    const setActive = (i: number) =>
      items.forEach((el, k) => el.toggleAttribute("data-on", k === i));

    const triggers: ScrollTrigger[] = [];

    triggers.push(
      ScrollTrigger.create({
        trigger: "#commercial",
        endTrigger: "#real-estate",
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => rail.toggleAttribute("data-visible", self.isActive),
      })
    );

    CHAPTERS.forEach((c, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: `#${c.id}`,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActive(i),
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <nav
      ref={railRef}
      aria-label="Service chapters"
      className="group/rail pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 opacity-0 transition-opacity duration-700 data-[visible]:pointer-events-auto data-[visible]:opacity-100 min-[1440px]:flex"
    >
      {CHAPTERS.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          data-rail=""
          className="group flex items-center gap-2.5 text-[0.6rem] tracking-[0.2em] text-[#8a8f9a] transition-colors duration-500 data-[on]:text-[#D8B479]"
          aria-label={`${c.no} ${c.label}`}
        >
          <span className="font-serif text-[0.85rem]">{c.no}</span>
          <span
            aria-hidden="true"
            className="block h-px w-4 bg-current transition-[width] duration-500 ease-[var(--ease-luxe)] group-hover:w-6 group-data-[on]:w-6"
          />
        </a>
      ))}
    </nav>
  );
}
