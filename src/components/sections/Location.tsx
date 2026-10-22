"use client";

import Image from"next/image";
import { useLayoutEffect, useRef, useState } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import { FACADES } from"@/lib/media";

const TRANSIT_POINTS = [
  { name:"Private Deepwater Marina", time:"05 min", distance:"2.1 miles" },
  { name:"Private Helipad & FBO", time:"08 min", distance:"3.8 miles" },
  { name:"Championship Golf & Country Club", time:"10 min", distance:"4.5 miles" },
  { name:"Metropolitan Financial Center", time:"14 min", distance:"7.2 miles" },
  { name:"International Private Airport", time:"18 min", distance:"11.0 miles" },
];

export default function Location() {
 const rootRef = useRef<HTMLElement>(null);
 const [activePoint, setActivePoint] = useState<number | null>(null);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
 const st = { trigger: root, start:"top 85%", once: true };

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
 once: true,
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
 once: true,
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
 once: true,
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
        <SectionLabel label="Geography & Seclusion" />
        <div className="mt-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <TextReveal
 as="h2"
 className="u-display max-w-[14ch] text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["An address", <em key="e" className="font-serif italic font-normal text-[#D8B479]">of absolute distinction.</em>]}
          />
          <p className="loc-desc max-w-md text-base text-[#4b5563] leading-relaxed font-normal">
            Nestled inside an exclusive, privately guarded enclave. Buffered by protected coastal reserves yet seamlessly connected to prime air and nautical infrastructure.
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
            <div className="ml-2 sm:ml-4 [text-shadow:0_1px_12px_rgba(11,13,18,0.75)]">
              <span className="u-eyebrow text-[0.62rem] text-[#f4f2ee] font-medium block">
                The Estate Enclave
              </span>
              <span className="mt-1 text-[0.58rem] tracking-wider text-[#D8B479] uppercase hidden sm:block">
                2 Kanal Spanish Classical Estate
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Transit Distance Highlights */}
      <div className="u-shell mt-16">
        <h3 className="u-eyebrow text-[var(--accent)] mb-6">
          Strategic Proximity
        </h3>

        <div className="loc-facts grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TRANSIT_POINTS.map((pt, i) => (
            <div
 key={pt.name}
 onMouseEnter={() => setActivePoint(i)}
 onMouseLeave={() => setActivePoint(null)}
 className={[
"loc-fact u-panel-soft p-5 cursor-default",
              ].join(" ")}
 data-active={activePoint === i}
            >
              <span className="u-eyebrow text-[var(--accent)] text-[0.62rem] block font-mono">
                {pt.time}
              </span>
              <h4 className="u-display text-lg text-[var(--on-surface)] mt-2 font-normal">
                {pt.name}
              </h4>
              <span className="text-[0.65rem] text-[var(--on-surface-muted)] tracking-wider uppercase mt-2 block">
                {pt.distance}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
