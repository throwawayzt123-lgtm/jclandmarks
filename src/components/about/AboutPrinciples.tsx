"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { FACADES, INTERIORS } from "@/lib/media";

/**
 * ABOUT — HOW WE WORK
 *
 * Three principles over a pair of plates that drift against each other on
 * scroll. The offset plates give the band depth without a border or a card,
 * which is the rule the rest of the site follows: edges come from tone and a
 * single hairline, never an outline.
 */
const PRINCIPLES = [
  {
    no: "01",
    title: "The drawing is a promise",
    body: "What is drawn is what gets built. If a detail cannot be built as drawn, it is redrawn before work begins — never improvised on site.",
  },
  {
    no: "02",
    title: "Materials are chosen once",
    body: "Stone, metal and timber are selected at the outset from a single source, so a run of cladding matches along its whole length years later.",
  },
  {
    no: "03",
    title: "Three commissions a year",
    body: "A deliberate cap. It is the only way the principal can be on every site often enough to catch the things drawings do not show.",
  },
];

export default function AboutPrinciples() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const headWords = splitWords(root.querySelector(".pr-head"));
      gsap.fromTo(
        headWords,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.045,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".pr-head",
            start: revealStart("top 85%"),
            once: true,
          },
        }
      );

      // Plates unmask, then drift apart slowly across the whole band.
      gsap.utils.toArray<HTMLElement>(".pr-plate").forEach((plate, i) => {
        gsap.fromTo(
          plate,
          { clipPath: "inset(14% 14% 14% 14%)", opacity: 0.35 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: plate,
              start: revealStart("top 86%"),
              once: true,
            },
          }
        );

        gsap.fromTo(
          plate,
          { y: i === 0 ? 28 : -28 },
          {
            y: i === 0 ? -28 : 28,
            ease: "none",
            scrollTrigger: {
              trigger: ".pr-plates",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".pr-item").forEach((item) => {
        gsap.fromTo(
          item.querySelector(".pr-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: item,
              start: revealStart("top 88%"),
              once: true,
            },
          }
        );

        gsap.fromTo(
          item.querySelectorAll(".pr-fade"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: revealStart("top 86%"),
              once: true,
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
      id="principles"
      className="relative bg-[#ffffff] py-[clamp(6rem,15vh,11rem)] text-[#11141b]"
    >
      <div className="u-shell">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
          How We Work
        </span>

        <h2 className="pr-head mt-12 max-w-2xl font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em]">
          Three rules we have never{" "}
          <em className="italic text-[#b58c49]">traded away.</em>
        </h2>

        <div className="mt-[clamp(4rem,10vh,7rem)] grid gap-y-16 lg:grid-cols-12 lg:gap-x-20">
          {/* Offset plate pair */}
          <div className="pr-plates col-span-full lg:col-span-6">
            <div className="grid grid-cols-5 gap-5">
              <div className="pr-plate relative col-span-3 aspect-[3/4] overflow-hidden bg-[#0b0d12]">
                <Image
                  src={INTERIORS.atriumApex.src}
                  alt={INTERIORS.atriumApex.alt}
                  fill
                  sizes="(max-width: 1024px) 60vw, 28vw"
                  loading="lazy"
                  className="object-cover"
                  style={{ objectPosition: "center 45%" }}
                />
              </div>
              <div className="pr-plate relative col-span-2 mt-[14%] aspect-[3/4] self-start overflow-hidden bg-[#0b0d12]">
                <Image
                  src={FACADES.prismMonolith.src}
                  alt={FACADES.prismMonolith.alt}
                  fill
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  loading="lazy"
                  className="object-cover"
                  style={{ objectPosition: "center 50%" }}
                />
              </div>
            </div>
          </div>

          {/* Principles */}
          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            {PRINCIPLES.map((p) => (
              <article key={p.no} className="pr-item pb-11 pt-11 first:pt-0">
                <span
                  aria-hidden="true"
                  className="pr-rule mb-9 block h-px origin-left bg-[rgba(20,33,61,0.12)]"
                />
                <span className="pr-fade block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#b58c49]">
                  {p.no}
                </span>
                <h3 className="pr-fade mt-4 font-serif text-[clamp(1.35rem,2.1vw,1.8rem)] font-light leading-[1.22]">
                  {p.title}
                </h3>
                <p className="pr-fade mt-4 text-[0.95rem] leading-[1.8] text-[#4b5563]">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
