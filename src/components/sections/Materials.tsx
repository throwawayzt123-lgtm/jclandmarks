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
 label:"Wood & Textured Wall Finishes",
 origin:"Interiors · Dining & living",
 detail:"Wood-finish panelling and textured wallpaper add warmth to large rooms, paired with marble-finish tiles that are easy to keep.",
 still: INTERIORS.diningGrand,
  },
  {
 label:"Stone Cladding & Glazing",
 origin:"Exterior · Front elevation",
 detail:"Natural and engineered stone over a reinforced concrete frame, with aluminium-framed glazing sized for light and privacy.",
 still: FACADES.prismMonolith,
  },
  {
 label:"Lighting & Ceiling Work",
 origin:"Interiors · Bedrooms",
 detail:"False ceilings with concealed LED, pendants and wall lights — planned with the electrical layout, not added at the end.",
 still: INTERIORS.mediaAcoustic,
  },
  {
 label:"Flooring & Soft Finishes",
 origin:"Interiors · Lounges",
 detail:"Large-format porcelain and marble-finish flooring, full-height curtains and fitted furniture, chosen with you and installed by our team.",
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
        <SectionLabel label="Materials & Finishes" />

        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="max-w-xl">
            <span className="mat-eyebrow text-xs sm:text-sm tracking-[0.28em] uppercase text-[#b58c49] font-bold block mb-3">
              What Goes Into a Home
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["Materials you", <em key="e" className="font-serif italic font-normal text-[#D8B479]">can trust.</em>]}
            />
          </div>
          <p className="mat-desc max-w-md text-lg sm:text-xl text-[#1f2937] font-normal leading-relaxed">
            We use tested materials from approved suppliers, and you choose every visible finish with us before it is ordered.
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
              <figcaption className="relative isolate overflow-hidden p-6 sm:p-8 flex flex-col flex-1 justify-between bg-[#ffffff]">
                {/* Dark fill that drops down from the top edge on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-top bg-[#000000] [transform:scaleY(0)] transition-transform duration-[700ms] ease-[var(--ease-luxe)] group-hover:[transform:scaleY(1)]"
                />
                <div>
                  <h3 className="u-display text-2xl sm:text-3xl text-[#11141b] font-normal font-serif transition-colors duration-500 group-hover:text-white">
                    {m.label}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-[#1f2937] font-normal leading-relaxed transition-colors duration-500 group-hover:text-[rgba(255,255,255,0.82)]">
                    {m.detail}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[rgba(216,180,121,0.25)]">
                  <span aria-hidden="true" className="h-[6px] w-[6px] rotate-45 bg-[#D8B479]" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[#4b5563] font-semibold transition-colors duration-500 group-hover:text-[#D8B479]">
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
