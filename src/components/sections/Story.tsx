"use client";

import Image from"next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import { FACADES, INTERIORS, type Still } from"@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

interface Chapter {
 category: string;
 title: string;
 body: string;
 meta: string;
 detail: string;
 still: Still;
}

const CHAPTERS: Chapter[] = [
  {
 category:"The Vision",
 title:"A brief written in light.",
 body:"Every landmark commission begins as a fundamental inquiry into volume and heritage — exploring how classical proportions, arched portals, and sweeping forecourts harmonize with private retreat.",
 meta:"Concept Stage",
 detail:"Architecture · 2 Kanal Spanish Estate",
 still: FACADES.spanishEstate,
  },
  {
 category:"The Structure",
 title:"Structure made quiet.",
 body:"Post-tensioned cantilevers float the upper master suites so the ground salon can remain completely free of load-bearing bulk. Monolithic marble floor slabs and full-height structural glass erase boundaries between interior sanctuaries and outdoor gardens.",
 meta:"Engineering Flow",
 detail:"Engineering · Monolithic Marble Floor Flow",
 still: INTERIORS.diningGrand,
  },
  {
 category:"The Experience",
 title:"Arrival as a choreography.",
 body:"The progression through the residence is deliberately meditative: private landscaped gates, sculptural foyer alcoves, and release into soaring double-height salons tailored for tranquil leisure.",
 meta:"Spatial Delivery",
 detail:"Choreography · Double-Height Grand Salon",
 still: INTERIORS.loungeDoubleHeight,
  },
];

export default function Story() {
 const rootRef = useRef<HTMLElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Narrative entrance
 gsap.fromTo(
".st-desc",
        { opacity: 0, y: 24 },
        {
 opacity: 1,
 y: 0,
 duration: 1.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 78%",
 once: true,
          },
        }
      );

      // First card initial reveal
 gsap.fromTo(
".st-card-wrapper-0",
        { opacity: 0, y: 30 },
        {
 opacity: 1,
 y: 0,
 duration: 1,
 ease:"power3.out",
 clearProps:"transform",
 scrollTrigger: {
 trigger:".st-cards-container",
 start:"top 80%",
 once: true,
          },
        }
      );

 const cardInners = gsap.utils.toArray<HTMLElement>(".st-card-inner");
 const cardWrappers = gsap.utils.toArray<HTMLElement>(".st-card-wrapper");

      // Silky smooth card overlap stacking:
      // Outer wrappers (.st-card-wrapper) hold `position: sticky` natively with ZERO transforms,
      // eliminating browser compositor recalculation jitter and jumpiness.
      // Inner cards (.st-card-inner) receive `scale` anchored to top-center.
      // A dedicated depth veil provides authentic physical stacking depth.
      // Damped scrub (0.5s) eliminates mouse-wheel notches and jitter.
 cardInners.forEach((inner, i) => {
 if (i < cardInners.length - 1) {
 const nextWrapper = cardWrappers[i + 1];
 const veil = inner.querySelector<HTMLElement>(".st-card-veil");

 gsap.to(inner, {
 scale: 0.94,
 ease:"none",
 scrollTrigger: {
 trigger: nextWrapper,
 start:"top 82%",
 end:"top 20%",
 scrub: 0.5,
            },
          });

 if (veil) {
 gsap.to(veil, {
 opacity: 0.25,
 ease:"none",
 scrollTrigger: {
 trigger: nextWrapper,
 start:"top 82%",
 end:"top 20%",
 scrub: 0.5,
              },
            });
          }
        }
      });
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="architecture"
 data-depth="raised"
 className="overflow-visible py-[var(--section-y)] bg-[#ffffff] text-[#11141b] relative z-20 isolate"
    >
      <div id="story" className="u-sr-only" aria-hidden="true" />
      <div className="u-shell">
        <SectionLabel label="Architectural Narrative" />

        <div className="mt-12 grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-16">
          <TextReveal
 as="h2"
 className="u-display col-span-full text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08] lg:col-span-7"
 lines={["The architecture","behind the", <em key="e" className="font-serif italic font-normal text-[#D8B479]">sanctuary.</em>]}
          />
          <p className="st-desc col-span-full max-w-prose text-lg sm:text-xl text-[#1f2937] font-normal leading-relaxed lg:col-span-5 lg:col-start-8">
            Four years in conception and engineering. A singular governing vision — that
 pure spatial volume, rather than mere square footage, defines true architectural nobility.
          </p>
        </div>

        {/* Overlapping Stacking Cards Container */}
        <div className="st-cards-container mt-16 flex flex-col pb-[40vh] relative">
          {CHAPTERS.map((c, i) => {
 const flipped = i % 2 === 1;
 return (
              <div
 key={c.category}
 className={`st-card-wrapper st-card-wrapper-${i} sticky`}
 style={{
 top: `calc(5rem + ${i * 1.5}rem)`,
 zIndex: i + 1,
                }}
              >
                <article
 className="st-card-inner relative shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-white p-6 sm:p-9 lg:p-11 shadow-[0_-8px_30px_rgba(17,20,27,0.06),0_25px_60px_-15px_rgba(17,20,27,0.12)] overflow-hidden will-change-transform"
 style={{
 transformOrigin:"top center",
                  }}
                >
                  {/* Subtle darkening veil for authentic physical stacking depth */}
                  <div
 className="st-card-veil absolute inset-0 bg-[#11141b] pointer-events-none opacity-0"
 style={{ zIndex: 25 }}
                  />

                  {/* Header band */}
                  <div className="flex items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-[rgba(216,180,121,0.25)] relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rotate-45 bg-[#D8B479]" />
                      <span className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#b58c49] font-bold">
                        Chapter 0{i + 1} · {c.category}
                      </span>
                    </div>
                    <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#8a8f9a]">
                      {c.meta}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="mt-6 sm:mt-8 grid gap-y-8 lg:grid-cols-12 lg:items-center lg:gap-x-12 relative z-10">
                    {/* Image Plate — edge to edge, no gray bar */}
                    <div
 className={[
"relative aspect-[16/10] overflow-hidden shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-[#11141b] col-span-full",
 flipped ?"lg:col-start-6 lg:col-end-13" :"lg:col-start-1 lg:col-end-8",
                      ].join(" ")}
                    >
                      <Image
 src={c.still.src}
 alt={c.still.alt}
 fill
 sizes="(max-width: 1024px) 100vw, 58vw"
 loading="lazy"
 className="object-cover scale-[1.03] transition-transform duration-700 ease-out hover:scale-108"
 style={{ objectPosition: c.still.position ??"center" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,20,27,0.55)] via-transparent to-transparent pointer-events-none" />

                    </div>

                    {/* Copy */}
                    <div
 className={[
"col-span-full flex flex-col justify-center lg:row-start-1",
 flipped
                          ?"lg:col-start-1 lg:col-end-6"
                          :"lg:col-start-8 lg:col-end-13",
                      ].join(" ")}
                    >
                      <span className="text-xs uppercase tracking-[0.25em] text-[#b58c49] font-bold block mb-2.5">
                        Design Focus
                      </span>
                      <h3 className="u-display text-2xl sm:text-3xl lg:text-4xl text-[#11141b] font-normal font-serif leading-tight">
                        {c.title}
                      </h3>
                      <p className="mt-4 text-base sm:text-lg text-[#1f2937] font-normal leading-relaxed">
                        {c.body}
                      </p>
                      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[rgba(216,180,121,0.2)]">
                        <span
 aria-hidden="true"
 className="block h-0.5 w-8 bg-[#D8B479]"
                        />
                        <span className="text-xs tracking-[0.2em] uppercase text-[#4b5563] font-semibold">
                          Architectural Chronicle
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
