"use client";

import Image from"next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { INTERIORS } from"@/lib/media";
import TextReveal from"@/components/ui/TextReveal";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * The Grand Atrium
 * Full-bleed cinematic architectural reveal of the triple-height atrium lightwell
 * featuring the spiraling amber glass chandelier.
 */
export default function Atrium() {
 const rootRef = useRef<HTMLElement>(null);
 const imgRef = useRef<HTMLDivElement>(null);
 const contentRef = useRef<HTMLDivElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 const img = imgRef.current;
 const content = contentRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Smooth cinematic parallax on the atrium image
 if (img) {
 gsap.fromTo(
 img,
          { yPercent: -8, scale: 1.15 },
          {
 yPercent: 8,
 scale: 1,
 ease:"none",
 scrollTrigger: {
 trigger: root,
 start:"top bottom",
 end:"bottom top",
 scrub: true,
            },
          }
        );
      }

      // Elegant content reveal
 if (content) {
 gsap.fromTo(
 content.children,
          { opacity: 0, y: 35 },
          {
 opacity: 1,
 y: 0,
 duration: 1.2,
 stagger: 0.15,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 78%",
 toggleActions: "play reset play reset",
            },
          }
        );
      }
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="atrium"
 data-depth="well"
 className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] py-20"
    >
      {/* Background Architectural Canvas */}
      <div
 ref={imgRef}
 className="absolute inset-[-10%] z-0 will-change-transform"
      >
        <Image
 src={INTERIORS.atriumApex.src}
 alt={INTERIORS.atriumApex.alt}
 fill
 sizes="100vw"
 className="object-cover"
 style={{ objectPosition: INTERIORS.atriumApex.position ??"center 45%" }}
        />
        {/* Layered atmospheric vignetting for optimal text legibility and depth */}
        <div
 aria-hidden="true"
 className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.92)] via-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.7)]"
        />
        <div
 aria-hidden="true"
 className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.85)_100%)]"
        />
      </div>

      {/* Centerpiece Content */}
      <div
 ref={contentRef}
 className="relative z-10 u-shell flex flex-col items-center text-center px-4 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-3 mb-8 [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
          <span className="h-2 w-2 rotate-45 bg-[#D8B479] shadow-[0_0_8px_#D8B479]" />
          <span className="text-[0.72rem] tracking-[0.3em] uppercase text-[#D8B479] font-medium">
            Double-Height Living
          </span>
        </div>

        <TextReveal
 as="h2"
 className="u-display text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95] text-white font-normal"
 lines={[
            <span key="l1">
              Room to{" "}
              <span className="font-serif italic text-[#D8B479]">
                breathe
              </span>
            </span>,
          ]}
        />

        <p className="mt-6 font-serif italic text-xl sm:text-2xl text-[rgba(247,246,242,0.95)] max-w-xl leading-relaxed">
          A double-height lounge, open to the floor above, lit by a cascade of pendant lights.
        </p>

        <p className="mt-4 text-base sm:text-lg text-[rgba(247,246,242,0.8)] max-w-xl leading-relaxed font-normal">
          Tall volumes need careful engineering — longer spans, stronger slabs and well-planned lighting. We design them so the space feels open, bright and calm, not empty.
        </p>

        {/* Architectural Details Ribbon */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs tracking-[0.25em] uppercase text-[rgba(247,246,242,0.85)] font-medium [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
          <span>Double-Height Void</span>
          <span className="text-[#D8B479]">·</span>
          <span>Pendant Cascade</span>
          <span className="text-[#D8B479]">·</span>
          <span>Open Upper Gallery</span>
          <span className="text-[#D8B479] hidden sm:inline">·</span>
          <span className="hidden sm:inline">Full-Height Glazing</span>
        </div>
      </div>
    </section>
  );
}
