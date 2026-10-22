"use client";

import Image from"next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import { FACADES, INTERIORS, type Still } from"@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

interface Material {
 label: string;
 origin: string;
 detail: string;
 still: Still;
}

const MATERIALS: Material[] = [
  {
 label:"Book-Matched Polish Marble",
 origin:"Tuscany & Verona Quarry Slabs",
 detail:"Seamless floor cladding with continuous veining across the great salon and central lightwell gallery.",
 still: INTERIORS.diningGrand,
  },
  {
 label:"Monolithic Charcoal Stone & Bronze Fins",
 origin:"Architectural Exterior Masonry",
 detail:"Bespoke angled sun louvers integrated into thermal massing stone, sculpted for passive climate resilience.",
 still: FACADES.prismMonolith,
  },
  {
 label:"Acoustic Vertical Fluted Walnut",
 origin:"Appalachian Hardwood Atelier",
 detail:"Concealed ambient LED illumination and precision-milled acoustic wood slats for optimal acoustic warmth.",
 still: INTERIORS.mediaAcoustic,
  },
  {
 label:"Artisanal Plaster & Boucle Textures",
 origin:"Italian Plaster & Textile Studio",
 detail:"Hand-applied mineral wall niches and tailored curved boucle seating curated for tactile tranquility.",
 still: INTERIORS.salonCurved,
  },
];

export default function Materials() {
 const rootRef = useRef<HTMLElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Narrative entrance
 gsap.fromTo(
 [".mat-eyebrow",".mat-desc"],
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

      // 3D perspective staggered card reveal
 gsap.fromTo(
".mat-tile",
        { opacity: 0, y: 45, rotateX: 5 },
        {
 opacity: 1,
 y: 0,
 rotateX: 0,
 duration: 1.1,
 stagger: 0.12,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".mat-grid",
 start:"top 80%",
 once: true,
          },
        }
      );

      // Subtle scrub parallax drift on images inside each card with scale protection to prevent gaps
 gsap.utils.toArray<HTMLElement>(".mat-img").forEach((img) => {
 gsap.fromTo(
 img,
          { yPercent: -3, scale: 1.12 },
          {
 yPercent: 3,
 scale: 1.12,
 ease:"none",
 scrollTrigger: {
 trigger: img.closest(".mat-tile"),
 start:"top bottom",
 end:"bottom top",
 scrub: true,
            },
          }
        );
      });
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="materials"
 data-depth="base"
 className="py-[var(--section-y)] bg-white text-[#11141b] relative overflow-hidden"
    >
      <div className="u-shell">
        <SectionLabel label="Materiality & Craft" />

        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="max-w-xl">
            <span className="mat-eyebrow text-xs sm:text-sm tracking-[0.28em] uppercase text-[#b58c49] font-bold block mb-3">
              Noble Material Palette
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["Materials of", <em key="e" className="font-serif italic font-normal text-[#D8B479]">distinction.</em>]}
            />
          </div>
          <p className="mat-desc max-w-md text-lg sm:text-xl text-[#1f2937] font-normal leading-relaxed">
            Every surface is authentic, tactile, and selected to mature with graceful nobility over generations.
          </p>
        </div>

        {/* Balanced 2x2 Grid with unified aspect ratios and crisp captions */}
        <div className="mat-grid mt-14 grid gap-8 sm:grid-cols-2 [perspective:1200px]">
          {MATERIALS.map((m) => (
            <figure
 key={m.label}
 className="mat-tile group flex flex-col shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-[#ffffff] overflow-hidden shadow-[0_12px_35px_rgba(17,20,27,0.06)] hover:shadow-[0_20px_50px_rgba(216,180,121,0.22)] hover:border-[#D8B479] transition-all duration-500"
            >
              {/* Image Frame with unified 16:10 ratio and full coverage — no gray bar */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#11141b]">
                <div className="mat-img absolute inset-0">
                  <Image
 src={m.still.src}
 alt={m.still.alt}
 fill
 sizes="(max-width: 768px) 100vw, 50vw"
 loading="lazy"
 className="object-cover transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-110"
 style={{ objectPosition: m.still.position ??"center" }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,20,27,0.45)] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Caption Block with dark, readable text */}
              <figcaption className="p-6 sm:p-8 flex flex-col flex-1 justify-between bg-[#ffffff]">
                <div>
                  <h3 className="u-display text-2xl sm:text-3xl text-[#11141b] font-normal font-serif group-hover:text-[#b58c49] transition-colors">
                    {m.label}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-[#1f2937] font-normal leading-relaxed">
                    {m.detail}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[rgba(216,180,121,0.25)]">
                  <span aria-hidden="true" className="h-[6px] w-[6px] rotate-45 bg-[#D8B479]" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[#4b5563] font-semibold">
                    {m.origin}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
