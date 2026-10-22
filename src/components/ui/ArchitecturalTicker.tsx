"use client";

import { useLayoutEffect, useRef } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";

const ROW_ONE = [
"MONUMENTAL VOLUMES",
"✦",
"TRIPLE-HEIGHT LIGHTWELLS",
"✦",
"TUSCAN BOOKMATCHED MARBLE",
"✦",
"SOUTH-WEST DAYLIGHT PATH",
"✦",
"CANTILEVERED STRUCTURE",
"✦",
"SINGLE-SOURCE PROVENANCE",
"✦",
"MONUMENTAL VOLUMES",
"✦",
"TRIPLE-HEIGHT LIGHTWELLS",
"✦",
"TUSCAN BOOKMATCHED MARBLE",
];

const ROW_TWO = [
"TIMELESS SECLUSION",
"✦",
"32-FT ATRIUM APEX",
"✦",
"ARTISANAL WALNUT JOINERY",
"✦",
"HORIZON WATER BASINS",
"✦",
"PRIVATE ESTATE MONOGRAPH",
"✦",
"ARCHITECTURAL ATELIER",
"✦",
"TIMELESS SECLUSION",
"✦",
"32-FT ATRIUM APEX",
"✦",
"ARTISANAL WALNUT JOINERY",
];

export default function ArchitecturalTicker() {
 const rootRef = useRef<HTMLDivElement>(null);
 const track1Ref = useRef<HTMLDivElement>(null);
 const track2Ref = useRef<HTMLDivElement>(null);

 useLayoutEffect(() => {
 const root = rootRef.current;
 const track1 = track1Ref.current;
 const track2 = track2Ref.current;

 if (!root || !track1 || !track2 || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Row 1 scrubs leftward on scroll down
 gsap.fromTo(
 track1,
        { xPercent: 0 },
        {
 xPercent: -18,
 ease:"none",
 scrollTrigger: {
 trigger: root,
 start:"top bottom",
 end:"bottom top",
 scrub: 1.2,
          },
        }
      );

      // Row 2 scrubs rightward on scroll down
 gsap.fromTo(
 track2,
        { xPercent: -18 },
        {
 xPercent: 0,
 ease:"none",
 scrollTrigger: {
 trigger: root,
 start:"top bottom",
 end:"bottom top",
 scrub: 1.2,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <div
 ref={rootRef}
 aria-hidden="true"
 className="relative overflow-hidden border-y border-[rgba(216,180,121,0.25)] bg-[#ffffff] py-8 sm:py-10 select-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]"
    >
      {/* Ambient gold glow along hairlines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D8B479] to-transparent opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8B479] to-transparent opacity-60" />

      {/* Track 1 — Leftward Scrub */}
      <div
 ref={track1Ref}
 className="flex w-max shrink-0 whitespace-nowrap will-change-transform gap-8 text-[0.85rem] sm:text-[1.05rem] md:text-[1.2rem] tracking-[0.32em] uppercase font-light text-[#11141b]"
      >
        {[...ROW_ONE, ...ROW_ONE, ...ROW_ONE].map((phrase, idx) => (
          <span
 key={`r1-${idx}`}
 className={`shrink-0 ${phrase === "✦" ? "text-[#D8B479] font-normal" : "font-serif"}`}
          >
            {phrase}
          </span>
        ))}
      </div>

      {/* Track 2 — Rightward Scrub */}
      <div
 ref={track2Ref}
 className="mt-3 flex w-max shrink-0 whitespace-nowrap will-change-transform gap-8 text-[0.75rem] sm:text-[0.95rem] md:text-[1.05rem] tracking-[0.28em] uppercase text-[#374151]"
      >
        {[...ROW_TWO, ...ROW_TWO, ...ROW_TWO].map((phrase, idx) => (
          <span
 key={`r2-${idx}`}
 className={`shrink-0 ${phrase === "✦" ? "text-[#D8B479] font-normal" : ""}`}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
