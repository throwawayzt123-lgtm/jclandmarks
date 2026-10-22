"use client";

import Image from"next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import { INTERIORS, type Still } from"@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

interface SpaceItem {
 tag: string;
 title: string;
 subtitle: string;
 spec: string;
 still: Still;
}

const SPACES: SpaceItem[] = [
  {
 tag:"Arrival Foyer",
 title:"Arrival & Private Gallery Foyer",
 subtitle:"Cantilevered Marble & Glass Balustrade",
 spec:"Bookmatched Marble Feature Wall · Autumn Floral Arrangement · Polished Stone",
 still: INTERIORS.foyerGallery,
  },
  {
 tag:"Great Salon",
 title:"Double-Height Grand Salon",
 subtitle:"30-Foot Drapery & Sculptural Lighting",
 spec:"Vertical Pendant Chandelier · Modular Lounge Seating · Cognac Leather Accents",
 still: INTERIORS.salonCurved,
  },
  {
 tag:"Dining & Fireside",
 title:"Fireside Library & Dining Salon",
 subtitle:"Curved Boucle Lounges & Bespoke Joinery",
 spec:"Fluted Timber Feature Wall · Intimate Dining Setting · Concealed LED Glow",
 still: INTERIORS.libraryFireside,
  },
  {
 tag:"Feature Staircase",
 title:"Cantilevered Marble Staircase",
 subtitle:"Floating Steps & Walnut Panelling",
 spec:"Solid Marble Treads · Artisan Stone Console · Botanical Art Installation",
 still: INTERIORS.staircaseCantilever,
  },
  {
 tag:"Master Sanctuary",
 title:"Executive Master Suite Sanctuary",
 subtitle:"Camel Tufted Headboard & Tailored Platform",
 spec:"Geometric Headboard Geometry · Woven Silk Wallpaper · Ambient Warm Pendants",
 still: INTERIORS.bedMaster,
  },
  {
 tag:"Executive Study",
 title:"Private Executive Study",
 subtitle:"Equestrian Oil Canvas & Fluted Desk",
 spec:"Warm Brass Reading Lamp · Bespoke Fluted Joinery · Curated Art Library",
 still: INTERIORS.studyEquestrian,
  },
];

export default function Experience() {
 const rootRef = useRef<HTMLElement>(null);
 const [activeSpace, setActiveSpace] = useState(0);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Narrative entrance
 gsap.fromTo(
 [".exp-eyebrow",".exp-desc"],
        { opacity: 0, y: 24 },
        {
 opacity: 1,
 y: 0,
 duration: 1.1,
 stagger: 0.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 78%",
 once: true,
          },
        }
      );

      // Staggered reveal on spaces
 gsap.fromTo(
".exp-item",
        { opacity: 0, x: -20 },
        {
 opacity: 1,
 x: 0,
 duration: 0.9,
 stagger: 0.08,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".exp-list",
 start:"top 80%",
 once: true,
          },
        }
      );

      // Sticky plate scale entrance
 gsap.fromTo(
".exp-plate-box",
        { opacity: 0, scale: 0.95, y: 30 },
        {
 opacity: 1,
 scale: 1,
 y: 0,
 duration: 1.2,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".exp-plate-box",
 start:"top 80%",
 once: true,
          },
        }
      );

      // Scroll spy: automatically update active space as user scrolls down the list
 gsap.utils.toArray<HTMLElement>(".exp-item").forEach((el, idx) => {
        ScrollTrigger.create({
 trigger: el,
 start:"top 55%",
 end:"bottom 55%",
 onEnter: () => setActiveSpace(idx),
 onEnterBack: () => setActiveSpace(idx),
        });
      });
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="experience"
 data-depth="raised"
 className="relative overflow-visible py-[var(--section-y)] bg-[#ffffff] text-[#11141b]"
    >
      <div className="u-shell">
        <SectionLabel label="Interiors & Experience" />

        <div className="mt-12 grid gap-y-8 lg:grid-cols-12 lg:gap-x-16 items-end">
          <div className="col-span-full lg:col-span-6">
            <span className="exp-eyebrow text-xs sm:text-sm tracking-[0.28em] uppercase text-[#b58c49] font-bold block mb-3">
              Spatial Choreography
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["Everything", <em key="e" className="font-serif italic font-normal text-[#D8B479]">considered.</em>]}
            />
          </div>

          <div className="col-span-full lg:col-span-6">
            <p className="exp-desc text-lg sm:text-xl text-[#1f2937] font-normal leading-relaxed">
              An architectural commission is more than structural geometry. It is a comprehensive suite
 of tactile sanctuaries sculpted from Italian marble, warm walnut joinery, and filtered daylight.
            </p>
          </div>
        </div>

        {/* Interactive Master Showcase */}
        <div className="mt-14 lg:mt-20 grid gap-8 lg:grid-cols-12 items-start relative">
          {/* Left: Spaces List — scrolls continuously */}
          <div className="exp-list col-span-full lg:col-span-6 flex flex-col divide-y divide-[rgba(216,180,121,0.25)] shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-white shadow-[0_10px_30px_rgba(17,20,27,0.04)] overflow-hidden">
            {SPACES.map((space, idx) => {
 const isSelected = activeSpace === idx;
 return (
                <div
 key={space.tag}
 onMouseEnter={() => setActiveSpace(idx)}
 onClick={() => setActiveSpace(idx)}
 className={[
"exp-item group relative py-6 sm:py-7 px-6 sm:px-8 cursor-pointer transition-all duration-300 flex flex-col justify-between",
 isSelected
                      ?"bg-[rgba(216,180,121,0.12)] shadow-inner"
                      :"hover:bg-[rgba(216,180,121,0.05)]",
                  ].join(" ")}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#D8B479]" />
                  )}

                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex flex-col">
                      <span className={[
"text-xs tracking-[0.22em] uppercase font-bold transition-colors",
 isSelected ?"text-[#b58c49]" :"text-[#4b5563]",
                      ].join(" ")}>
                        {space.tag}
                      </span>
                      <h3 className={[
"u-display text-2xl sm:text-3xl mt-1.5 transition-transform duration-300 font-serif",
 isSelected ?"text-[#11141b] translate-x-1" :"text-[#1f2937] group-hover:text-[#11141b]",
                      ].join(" ")}>
                        {space.title}
                      </h3>
                      <p className="text-base text-[#232936] mt-2 font-normal leading-relaxed">
                        {space.subtitle}
                      </p>
                    </div>

                    <span className={[
"text-xl transition-all duration-300 shrink-0",
 isSelected ?"text-[#D8B479] translate-x-1 font-bold" :"text-[#9ca3af] group-hover:text-[#D8B479]",
                    ].join(" ")}>
                      →
                    </span>
                  </div>

                  {/* Mobile Preview Image */}
                  {isSelected && (
                    <div className="mt-5 pt-4 border-t border-[rgba(216,180,121,0.25)] lg:hidden">
                      <div className="relative aspect-[16/10] w-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] shadow-md bg-[#11141b]">
                        <Image
 src={space.still.src}
 alt={space.still.alt}
 fill
 sizes="100vw"
 className="object-cover"
 style={{ objectPosition: space.still.position ??"center" }}
                        />
                      </div>
                      <p className="text-sm text-[#b58c49] mt-2.5 font-medium leading-relaxed">
                        {space.spec}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Desktop Sticky Architectural Plate (stays pinned until section ends) */}
          <div className="hidden lg:block lg:col-span-6 sticky top-28 self-start">
            <div className="exp-plate-box relative aspect-[4/3] overflow-hidden shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-[#11141b] shadow-[0_20px_50px_rgba(17,20,27,0.12)]">
              <Image
 key={SPACES[activeSpace].still.src}
 src={SPACES[activeSpace].still.src}
 alt={SPACES[activeSpace].still.alt}
 fill
 sizes="50vw"
 className="object-cover transition-transform duration-700 hover:scale-105"
 style={{ objectPosition: SPACES[activeSpace].still.position ??"center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,20,27,0.88)] via-[rgba(17,20,27,0.2)] to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-xs text-[#D8B479] uppercase tracking-[0.22em] font-bold block">
                    {SPACES[activeSpace].tag} · Interior Monograph
                  </span>
                  <h4 className="u-display text-3xl sm:text-4xl mt-1.5 text-white font-normal font-serif">
                    {SPACES[activeSpace].title}
                  </h4>
                  <p className="text-sm sm:text-base text-[rgba(247,246,242,0.95)] mt-2 leading-relaxed max-w-md font-normal">
                    {SPACES[activeSpace].spec}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
