"use client";

import { useLayoutEffect, useRef, useState } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";

interface SpecItem {
 label: string;
 value: string;
 unit?: string;
 note?: string;
 category:"spatial" |"luxury" |"estate";
}

const ALL_SPECS: SpecItem[] = [
  // Spatial
  { category:"spatial", label:"Total Interior Footprint", value:"12,500", unit:"sq ft", note:"Air-conditioned volume" },
  { category:"spatial", label:"Exterior Terraces & Decks", value:"4,800", unit:"sq ft", note:"Multi-level living" },
  { category:"spatial", label:"Vertical Levels", value:"4", unit:"levels", note:"Including lower wellness floor" },
  { category:"spatial", label:"Bedroom En-Suites", value:"7", unit:"suites", note:"All with private balconies" },
  { category:"spatial", label:"Bathrooms & Powder Rooms", value:"9", unit:"baths", note:"Book-matched Carrara stone" },

  // Luxury
  { category:"luxury", label:"Grand Atrium Void", value:"32", unit:"feet", note:"Triple-height central lightwell" },
  { category:"luxury", label:"Private Infinity Oasis", value:"25", unit:"metres", note:"Heated saltwater system" },
  { category:"luxury", label:"Private Cinema", value:"14", unit:"seats", note:"Dolby Atmos acoustic panelling" },
  { category:"luxury", label:"Sommelier Wine Vault", value:"1,200", unit:"bottles", note:"Dual-zone temperature controlled" },

  // Estate
  { category:"estate", label:"Private Gallery Parking", value:"4", unit:"vehicles", note:"EV fast-charging integrated" },
  { category:"estate", label:"Security & Perimeter", value:"Gated", note:"Biometric & 24/7 concierge" },
  { category:"estate", label:"Completion Year", value:"2025", note:"Brand-new construction" },
];

export default function Specifications() {
 const rootRef = useRef<HTMLElement>(null);
 const [activeCategory, setActiveCategory] = useState<"all" |"spatial" |"luxury" |"estate">("all");

 const displayedSpecs = activeCategory ==="all"
    ? ALL_SPECS
    : ALL_SPECS.filter((s) => s.category === activeCategory);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Header entrance
 gsap.fromTo(
 [".spec-eyebrow",".spec-pills"],
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

 gsap.fromTo(
".spec-line",
        { scaleX: 0 },
        {
 scaleX: 1,
 duration: 1.1,
 stagger: 0.05,
 ease:"power3.inOut",
 scrollTrigger: {
 trigger:".spec-table",
 start:"top 80%",
 once: true,
          },
        }
      );

 gsap.fromTo(
".spec-row dt",
        { x: -16, opacity: 0 },
        {
 x: 0,
 opacity: 1,
 duration: 0.9,
 stagger: 0.04,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".spec-table",
 start:"top 80%",
 once: true,
          },
        }
      );

 gsap.fromTo(
".spec-row dd",
        { x: 16, opacity: 0 },
        {
 x: 0,
 opacity: 1,
 duration: 0.9,
 stagger: 0.04,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".spec-table",
 start:"top 80%",
 once: true,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, [activeCategory]);

 return (
    <section
 ref={rootRef}
 id="details"
 data-depth="base"
 className="py-[var(--section-y)] bg-white text-[#11141b] relative overflow-hidden"
    >
      <div className="u-shell">
        <SectionLabel label="Architectural Specifications" />

        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="spec-eyebrow text-[0.72rem] tracking-[0.28em] uppercase text-[#D8B479] font-medium block mb-3">
              Dimensional Masterplan
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["The architectural", <em key="e" className="font-serif italic font-normal text-[#D8B479]">specifications.</em>]}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="spec-pills flex flex-wrap items-center gap-2">
            {[
              { id:"all", label:"All Dimensions" },
              { id:"spatial", label:"Volume & Space" },
              { id:"luxury", label:"Signature Amenities" },
              { id:"estate", label:"Estate & Privacy" },
            ].map((tab) => (
              <button
 key={tab.id}
 type="button"
 onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
 className={[
"px-5 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300 border font-medium",
 activeCategory === tab.id
                    ?"border-[#D8B479] bg-[#D8B479] text-[#11141b] shadow-sm"
                    :"border-[rgba(216,180,121,0.25)] bg-[#ffffff] text-[#4b5563] hover:border-[#D8B479] hover:text-[#11141b]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specifications Table */}
        <dl className="spec-table mt-14 overflow-hidden shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-[#ffffff] shadow-sm p-4 sm:p-6">
          {displayedSpecs.map((s) => (
            <div
 key={s.label}
 className="spec-row group relative grid grid-cols-12 items-center gap-4 py-5 px-3 transition-colors duration-300 hover:bg-[rgba(216,180,121,0.08)]"
            >
              {/* Properly positioned top border hairline */}
              <span
 aria-hidden="true"
 className="spec-line absolute inset-x-0 top-0 h-px origin-left bg-[rgba(216,180,121,0.2)] group-hover:bg-[#D8B479] transition-colors duration-300"
              />

              <dt className="col-span-12 sm:col-span-6 flex flex-col transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1.5">
                <span className="text-base text-[#11141b] font-medium">
                  {s.label}
                </span>
                {s.note && (
                  <span className="text-xs sm:text-sm text-[#6b7280] tracking-wide mt-0.5">
                    {s.note}
                  </span>
                )}
              </dt>

              <dd className="col-span-12 sm:col-span-6 flex items-baseline justify-between sm:justify-end gap-3 transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1">
                <span className="u-display text-2xl sm:text-3xl text-[#11141b] font-normal">
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-xs uppercase tracking-wider text-[#b58c49] font-medium">
                    {s.unit}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
