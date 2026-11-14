"use client";

import Image from"next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import { FACADES } from"@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

const ATTRIBUTES = [
  { no: "01", name: "Architecture", detail: "Concept to drawings" },
  { no: "02", name: "Structural Engineering", detail: "Designed to stand" },
  { no: "03", name: "Approvals", detail: "Handled for you" },
  { no: "04", name: "Construction", detail: "Built by one team" },
  { no: "05", name: "Finishing & Handover", detail: "Complete, key in hand" },
];

export default function Location() {
 const rootRef = useRef<HTMLElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
 const st = { trigger: root, start:"top 85%", toggleActions: "play reset play reset" };

 gsap.fromTo(
".loc-ring",
        { scale: 0.3, opacity: 0 },
        {
 scale: 1,
 opacity: 1,
 duration: 1.2,
 ease:"power3.out",
 scrollTrigger: st,
        }
      );
 gsap.fromTo(
".loc-tether",
        { scaleX: 0 },
        {
 scaleX: 1,
 duration: 0.9,
 delay: 0.35,
 ease:"power3.inOut",
 scrollTrigger: st,
        }
      );
      // Gentle beacon pulse
 gsap.to(".loc-pulse", {
 scale: 2.6,
 opacity: 0,
 duration: 2.6,
 repeat: -1,
 ease:"power2.out",
      });

      // Photo plate parallax scrub
 gsap.fromTo(
".loc-plate-img",
        { yPercent: -6, scale: 1.08 },
        {
 yPercent: 6,
 scale: 1,
 ease:"none",
 scrollTrigger: {
 trigger:".loc-plate-wrap",
 start:"top bottom",
 end:"bottom top",
 scrub: true,
          },
        }
      );

      // Narrative entrance
 gsap.fromTo(
".loc-desc",
        { opacity: 0, y: 24 },
        {
 opacity: 1,
 y: 0,
 duration: 1.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 78%",
 toggleActions: "play reset play reset",
          },
        }
      );

      // Plate entrance
 gsap.fromTo(
".loc-plate-wrap",
        { opacity: 0, y: 35, scale: 0.96 },
        {
 opacity: 1,
 y: 0,
 scale: 1,
 duration: 1.2,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".loc-plate-wrap",
 start:"top 80%",
 toggleActions: "play reset play reset",
          },
        }
      );

 gsap.fromTo(
".loc-fact",
        { opacity: 0, y: 20 },
        {
 opacity: 1,
 y: 0,
 duration: 0.85,
 stagger: 0.08,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".loc-facts",
 start:"top 80%",
 toggleActions: "play reset play reset",
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="location"
 data-depth="base"
 className="py-[var(--section-y)] relative overflow-hidden bg-white text-[#11141b]"
    >
      <div className="u-shell">
        <SectionLabel label="Who We Are" />
        <div className="mt-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <TextReveal
 as="h2"
 className="u-display max-w-[14ch] text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["Building across", <em key="e" className="font-serif italic font-normal text-[#D8B479]">Lahore.</em>]}
          />
          <p className="loc-desc max-w-md text-base text-[#4b5563] leading-relaxed font-normal">
            From DHA to Valencia Town and beyond, we build in the city we live in — on plots of every size, for families and businesses who want it done properly the first time.
          </p>
        </div>
      </div>

      {/* Main Visual Plate with Surveyor Radar */}
      <div className="loc-plate-wrap relative mt-16 u-shell">
        <div className="u-plate aspect-[16/9] w-full md:aspect-[21/9] shadow-[0_20px_60px_rgba(17,20,27,0.08)] shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] overflow-hidden">
          <div className="loc-plate-img absolute inset-0">
            <Image
 src={FACADES.spanishEstate.src}
 alt={FACADES.spanishEstate.alt}
 fill
 sizes="100vw"
 loading="lazy"
 className="object-cover"
 style={{ objectPosition: FACADES.spanishEstate.position }}
            />
          </div>
          <div
 aria-hidden="true"
 className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(17,20,27,0.3)_0%,rgba(17,20,27,0.6)_100%)]"
          />

          {/* Surveyor Marker */}
          <div className="absolute left-[36%] top-[50%] flex items-center -translate-y-1/2">
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="loc-pulse absolute h-5 w-5 rotate-45 shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)]" />
              <span className="loc-ring block h-4 w-4 rotate-45 shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-[rgba(216,180,121,0.25)]" />
              <span className="absolute h-1.5 w-1.5 rotate-45 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            </span>
            <span
 aria-hidden="true"
 className="loc-tether h-px w-10 sm:w-20 origin-left bg-gradient-to-r from-[var(--accent)] to-transparent"
            />
            <div className="ml-2 sm:ml-4 [text-shadow:0_1px_12px_rgba(0,0,0,0.75)]">
              <span className="u-eyebrow text-[0.62rem] text-[#f4f2ee] font-medium block">
                Jay-Cee Landmarks
              </span>
              <span className="mt-1 text-[0.58rem] tracking-wider text-[#D8B479] uppercase hidden sm:block">
                2-Kanal Residence · Design &amp; Build
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Company attributes — each card floods dark from the top on hover */}
      <div className="u-shell mt-16">
        <h3 className="u-eyebrow font-sans text-[var(--accent)] mb-6">
          Company Attributes
        </h3>

        <div className="loc-facts grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ATTRIBUTES.map((a) => (
            <div
              key={a.name}
              className="loc-fact group relative isolate cursor-default overflow-hidden bg-white p-6 shadow-[inset_0_0_0_1px_rgba(20,33,61,0.06),0_18px_44px_-28px_rgba(20,33,61,0.3)] transition-shadow duration-500 hover:shadow-[0_24px_54px_-26px_rgba(0,0,0,0.55)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-top bg-[#000000] [transform:scaleY(0)] transition-transform duration-[700ms] ease-[var(--ease-luxe)] group-hover:[transform:scaleY(1)]"
              />
              <span className="u-eyebrow block text-[0.62rem] text-[var(--accent)]">
                {a.no}
              </span>
              <h4 className="u-display mt-3 text-[1.35rem] font-normal leading-snug text-[#11141b] transition-colors duration-500 group-hover:text-white">
                {a.name}
              </h4>
              <span className="mt-4 block text-[0.65rem] uppercase tracking-wider text-[#4b5563] transition-colors duration-500 group-hover:text-[rgba(255,255,255,0.7)]">
                {a.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
