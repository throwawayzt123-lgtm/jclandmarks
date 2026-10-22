"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import RevealImage from"@/components/ui/RevealImage";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import { FACADES, INTERIORS } from"@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

export default function Lifestyle() {
 const rootRef = useRef<HTMLElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Narrative entrance
 gsap.fromTo(
 [".lf-eyebrow",".lf-desc",".lf-quote"],
        { opacity: 0, y: 28 },
        {
 opacity: 1,
 y: 0,
 duration: 1.1,
 stagger: 0.12,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 78%",
 once: true,
          },
        }
      );

 gsap.utils.toArray<HTMLElement>(".lf-drift").forEach((el) => {
 const dir = el.dataset.dir ==="up" ? -1 : 1;
 gsap.fromTo(
 el,
          { y: 18 * dir },
          {
 y: -18 * dir,
 ease:"none",
 scrollTrigger: {
 trigger: el,
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
 id="lifestyle"
 data-depth="deep"
 className="overflow-hidden py-[var(--section-y)] bg-white text-[#11141b] relative"
    >
      <div className="u-shell">
        <SectionLabel label="Living & Horizon" />

        {/* Row 1 — tall plate against the statement */}
        <div className="mt-12 grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lf-drift col-span-full lg:col-span-5" data-dir="down">
            <RevealImage
 still={INTERIORS.loungeDoubleHeight}
 ratio="4/5"
 parallax={10}
 hoverZoom={true}
 sizes="(max-width: 1024px) 100vw, 42vw"
 caption="The Grand Salon · Double-Height Proportions & Sculptural Art"
            />
          </div>

          <div className="lf-drift col-span-full lg:col-span-6 lg:col-start-7" data-dir="up">
            <span className="lf-eyebrow text-[0.72rem] tracking-[0.28em] uppercase text-[#D8B479] font-medium block mb-3">
              Atmospheric Sanctuary
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["More than a home —", <em key="e" className="font-serif italic font-normal text-[#D8B479]">an enduring retreat.</em>]}
            />
            <p className="lf-desc mt-6 text-base sm:text-lg text-[#2d333f] font-normal leading-relaxed">
              A private micro-climate framed by mature olive canopies and water cascades.
              Conceived for tranquil dawn swims, intimate fireside evenings, and uninterrupted connection to nature.
            </p>

            <div className="lf-quote mt-8 border-l-4 border-[#D8B479] bg-[#ffffff] p-6 shadow-sm">
              <p className="font-serif italic text-lg sm:text-xl text-[#11141b] leading-relaxed">
                &ldquo;Architecture should not conquer the landscape; it should welcome it inside.&rdquo;
              </p>
              <span className="text-xs uppercase tracking-[0.2em] text-[#b58c49] font-medium mt-3 block">
                Principal Architectural Philosophy
              </span>
            </div>
          </div>
        </div>

        {/* Row 2 — wide plate and narrow plate */}
        <div className="mt-16 grid gap-y-10 lg:grid-cols-12 lg:gap-x-14">
          <div className="lf-drift col-span-full lg:col-span-7" data-dir="up">
            <RevealImage
 still={FACADES.phase7Curtain}
 ratio="16/10"
 parallax={-8}
 hoverZoom={true}
 sizes="(max-width: 1024px) 100vw, 56vw"
 caption="Double-Height Architectural Curtain Wall at Twilight"
            />
          </div>

          <div className="lf-drift col-span-full lg:col-span-5 lg:col-start-8 lg:mt-8" data-dir="down">
            <RevealImage
 still={INTERIORS.bedMinimal}
 ratio="16/11"
 parallax={10}
 hoverZoom={true}
 sizes="(max-width: 1024px) 100vw, 36vw"
 caption="Minimalist Private Bedroom Sanctuary · Quiet Dawn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
