"use client";

import { useLayoutEffect, useRef } from"react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import ParallaxLayers from"@/components/ui/ParallaxLayers";
import { FACADES } from"@/lib/media";

const RESIDENCE_HIGHLIGHTS = [
  { label:"Solar Exposure", value:"South-West Daylight Path" },
  { label:"Spatial Void", value:"Triple-Height Lightwells" },
  { label:"Structural Cladding", value:"Monolithic Travertine" },
  { label:"Exterior Flow", value:"Reflection Water Basins" },
];

export default function Residence() {
 const rootRef = useRef<HTMLElement>(null);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      /* ---------- Eyebrow rule draws, then copy settles ---------- */
      gsap.fromTo(
        ".res-eyebrow",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: revealStart("top 80%"), once: true },
        }
      );

      gsap.fromTo(
        ".res-copy",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: revealStart("top 76%"), once: true },
        }
      );

      // The copy column drifts slowly against the scroll, which keeps the
      // whole block alive rather than frozen once it has landed.
      gsap.fromTo(
        ".res-copy",
        { y: 18 },
        {
          y: -18,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      /* ---------- Attributes: count up behind a drawn rule ---------- */
      gsap.utils.toArray<HTMLElement>(".res-attr-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".res-attr-grid",
              start: revealStart("top 82%"),
              once: true,
            },
          }
        );

        // Each item's own hairline wipes in from the left.
        gsap.fromTo(
          el.querySelector(".res-attr-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            delay: i * 0.08,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: ".res-attr-grid",
              start: revealStart("top 82%"),
              once: true,
            },
          }
        );
      });

      /* ---------- Plate: unmasked from the centre, then held in parallax ---------- */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".res-plates", start: revealStart("top 84%"), once: true },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".res-plate-scale",
        { clipPath: "inset(14% 22% 14% 22%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 },
        0
      ).fromTo(
        ".res-plate-caption > *",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
        0.7
      );

      // A slow continuous scale across the plate's whole scroll range, so it
      // breathes instead of sitting still after the entrance finishes.
      gsap.fromTo(
        ".res-plate-scale",
        { scale: 1.035 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".res-plates",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="residence"
 data-depth="base"
 className="relative z-10 isolate overflow-hidden py-[var(--section-y)] bg-white text-[#11141b]"
    >
      <div className="u-shell">
        <SectionLabel label="The Residence" />

        <div className="mt-12 grid gap-y-8 lg:grid-cols-12 lg:gap-x-16 items-end">
          <div className="col-span-full lg:col-span-7">
            <span className="res-eyebrow text-xs sm:text-sm tracking-[0.28em] uppercase text-[#b58c49] font-bold block mb-3">
              Monumental Architecture
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={[
"A home designed",
"around pure",
                <em key="e" className="font-serif italic font-normal text-[#D8B479]">
 light & volume.
                </em>,
              ]}
            />
          </div>

          <div className="res-copy col-span-full lg:col-span-5">
            <p className="text-lg sm:text-xl text-[#1f2937] font-normal leading-relaxed">
              Every detail has been sculpted to create a sanctuary where
 contemporary architecture, filtered daylight, and landscaped reflection terraces exist as one continuous, harmonious dialogue.
            </p>
          </div>
        </div>

        {/* Architectural Attributes Strip */}
        <div className="res-attr-grid mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 border-y border-[rgba(216,180,121,0.25)] py-7">
          {RESIDENCE_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="res-attr-item relative flex flex-col pt-5">
              <span
                aria-hidden="true"
                className="res-attr-rule absolute inset-x-0 top-0 h-px origin-left bg-[rgba(216,180,121,0.45)]"
              />
              <span className="text-xs tracking-[0.2em] uppercase text-[#b58c49] font-bold">
                {item.label}
              </span>
              <span className="u-display text-lg sm:text-xl text-[#11141b] mt-1.5 font-normal font-serif">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Facade Architectural Showcase Plate */}
      <div className="res-plates relative mt-14 lg:mt-18">
        <div className="res-plate-scale mx-auto w-[min(var(--page-max),94vw)] will-change-transform">
          <ParallaxLayers
 range={50}
 className="h-[55vh] min-h-[22rem] lg:h-[75vh] overflow-hidden shadow-[0_20px_60px_rgba(17,20,27,0.08)] shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)]"
 layers={[
              {
 still: FACADES.phase7Curtain,
 depth: 0.15,
 className:"absolute inset-0",
 sizes:"94vw",
              },
            ]}
          />
          {/* Architectural plate badge */}
          <div className="res-plate-caption mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1f2937] px-2 font-semibold">
            <span>Phase 7 Contemporary Villa · Double-Height Glass Curtain & Travertine Terraces</span>
            <span className="text-[#b58c49] font-bold">Elevation Dossier</span>
          </div>
        </div>
      </div>

      <div className="u-shell mt-16 sm:mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[rgba(216,180,121,0.25)] pt-6 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#4b5563] font-semibold">
          <span className="text-[#b58c49] font-bold">
            Architectural Masterplan Complete
          </span>
          <p>
            Private Residence · Contemporary Collection · 2025 Handover
          </p>
        </div>
      </div>
    </section>
  );
}
