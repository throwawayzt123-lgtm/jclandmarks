"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

const ROW_ONE = [
"ARCHITECTURE",
"✦",
"STRUCTURAL ENGINEERING",
"✦",
"APPROVALS",
"✦",
"GREY STRUCTURE",
"✦",
"FINISHING",
"✦",
"TURNKEY HOMES",
"✦",
"ARCHITECTURE",
"✦",
"STRUCTURAL ENGINEERING",
"✦",
"APPROVALS",
];

const ROW_TWO = [
"RESIDENTIAL",
"✦",
"COMMERCIAL",
"✦",
"RENOVATION",
"✦",
"INTERIORS",
"✦",
"LAHORE",
"✦",
"RESIDENTIAL",
"✦",
"COMMERCIAL",
"✦",
"RENOVATION",
];

export default function ArchitecturalTicker() {
 const rootRef = useRef<HTMLDivElement>(null);
 const track1Ref = useRef<HTMLDivElement>(null);
 const track2Ref = useRef<HTMLDivElement>(null);

 useIntroLayoutEffect(() => {
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
      className="relative select-none overflow-hidden bg-[#ffffff] py-[clamp(4.5rem,9vw,8rem)]"
    >
      {/* Stripe 1 - dark band, tilted up to the right */}
      <div className="relative z-10 -mx-[6%] origin-center rotate-[-2.2deg] bg-[#1b1c1f] py-[clamp(1.1rem,2.2vw,1.9rem)] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)]">
        <div
          ref={track1Ref}
          className="flex w-max shrink-0 items-center gap-10 whitespace-nowrap font-light uppercase tracking-[0.3em] text-[#f4f1ea] will-change-transform text-[0.85rem] sm:text-[1.05rem] md:text-[1.25rem]"
        >
          {[...ROW_ONE, ...ROW_ONE, ...ROW_ONE].map((phrase, idx) => (
            <span key={`r1-${idx}`} className={`shrink-0 ${phrase === "✦" ? "font-normal text-[#D8B479]" : "font-serif"}`}>
              {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* Stripe 2 - gold band, tilted the other way and laid over the first */}
      <div className="relative z-20 -mx-[6%] -mt-[clamp(0.6rem,1.4vw,1.2rem)] origin-center rotate-[2.6deg] bg-[#D8B479] py-[clamp(1.1rem,2.2vw,1.9rem)] shadow-[0_24px_50px_-22px_rgba(0,0,0,0.4)]">
        <div
          ref={track2Ref}
          className="flex w-max shrink-0 items-center gap-10 whitespace-nowrap font-medium uppercase tracking-[0.26em] text-[#000000] will-change-transform text-[0.78rem] sm:text-[0.95rem] md:text-[1.08rem]"
        >
          {[...ROW_TWO, ...ROW_TWO, ...ROW_TWO].map((phrase, idx) => (
            <span key={`r2-${idx}`} className="shrink-0">
              {phrase}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
