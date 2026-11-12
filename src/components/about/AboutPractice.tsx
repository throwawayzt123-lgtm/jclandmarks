"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { INTERIORS } from "@/lib/media";

/**
 * ABOUT — THE PRACTICE
 *
 * One sticky plate against a list of disciplines. The plate holds while the
 * disciplines scroll past it, which gives the section length without ever
 * letting the image grow to an absurd height — the fault the homepage About
 * section originally had.
 */
const DISCIPLINES = [
  {
    no: "01",
    title: "Architecture",
    body: "Plans, elevations, 3D views and working drawings produced in-house — designed around your plot, your family and your budget rather than a fixed house style.",
  },
  {
    no: "02",
    title: "Structural Engineering",
    body: "Foundations, columns, beams and slabs designed by our own structural engineers from a soil test of your plot — by the same team that drew the building.",
  },
  {
    no: "03",
    title: "Construction",
    body: "Our own site teams and trusted trades for steel, stone and joinery. One site engineer stays with your project from excavation to the final snag list.",
  },
  {
    no: "04",
    title: "Finishing & Handover",
    body: "Plaster, flooring, electrical, plumbing, joinery and paint run to one programme, so the finishing is planned stage by stage rather than rushed at the end.",
  },
];

export default function AboutPractice() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const headWords = splitWords(root.querySelector(".ap-head"));
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
            trigger: ".ap-head",
            start: revealStart("top 84%"),
            toggleActions: "play reset play reset",
          },
        }
      );

      gsap.fromTo(
        ".ap-lede",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ap-head",
            start: revealStart("top 78%"),
            toggleActions: "play reset play reset",
          },
        }
      );

      // Plate unmasks from its centre, matching the homepage tenet rows.
      gsap.fromTo(
        ".ap-plate",
        { clipPath: "inset(12% 20% 12% 20%)", opacity: 0.4 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ap-plate",
            start: revealStart("top 82%"),
            toggleActions: "play reset play reset",
          },
        }
      );

      gsap.fromTo(
        ".ap-plate-img",
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ap-plate",
            start: revealStart("top 82%"),
            toggleActions: "play reset play reset",
          },
        }
      );

      // Each discipline row: hairline draws, then the copy settles.
      gsap.utils.toArray<HTMLElement>(".ap-row").forEach((row) => {
        gsap.fromTo(
          row.querySelector(".ap-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: row,
              start: revealStart("top 86%"),
              toggleActions: "play reset play reset",
            },
          }
        );

        gsap.fromTo(
          row.querySelectorAll(".ap-row-fade"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: revealStart("top 84%"),
              toggleActions: "play reset play reset",
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
      id="practice"
      className="relative bg-[#ffffff] py-[clamp(6rem,15vh,11rem)] text-[#11141b]"
    >
      <div className="u-shell">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
          The Practice
        </span>

        <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-20">
          <h2 className="ap-head col-span-full font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em] lg:col-span-6">
            Four disciplines, one{" "}
            <em className="italic text-[#b58c49]">accountable team.</em>
          </h2>

          <p className="ap-lede col-span-full max-w-md text-[0.98rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9 lg:pt-3">
            Most homes pass through four companies and lose something at
            every handover. We hold all four in-house, so the drawing that is
            approved is the building that gets made.
          </p>
        </div>

        <div className="mt-[clamp(4rem,10vh,7rem)] grid gap-y-14 lg:grid-cols-12 lg:gap-x-20">
          {/* Sticky plate — fixed aspect, so it can never stretch. */}
          <div className="col-span-full lg:col-span-5">
            <div className="lg:sticky lg:top-[14vh]">
              <div className="ap-plate relative aspect-[4/5] overflow-hidden bg-[#000000]">
                <Image
                  src={INTERIORS.foyerGallery.src}
                  alt={INTERIORS.foyerGallery.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  loading="lazy"
                  className="ap-plate-img object-cover"
                  style={{ objectPosition: "center 45%" }}
                />
              </div>
              <p className="mt-5 flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.2em] text-[#8a8f9a]">
                <span aria-hidden="true" className="h-px w-6 bg-[#b58c49]" />
                Arrival foyer · stone set on site by our own masons
              </p>
            </div>
          </div>

          {/* Disciplines */}
          <div className="col-span-full lg:col-span-6 lg:col-start-7">
            {DISCIPLINES.map((d) => (
              <article key={d.no} className="ap-row pb-12 pt-12 first:pt-0">
                <span
                  aria-hidden="true"
                  className="ap-rule mb-10 block h-px origin-left bg-[rgba(20,33,61,0.12)]"
                />
                <div className="flex items-baseline gap-6">
                  <span className="ap-row-fade font-serif text-[1.05rem] font-light text-[#b58c49]">
                    {d.no}
                  </span>
                  <h3 className="ap-row-fade font-serif text-[clamp(1.45rem,2.3vw,2rem)] font-light leading-[1.2]">
                    {d.title}
                  </h3>
                </div>
                <p className="ap-row-fade mt-5 max-w-lg text-[0.95rem] leading-[1.8] text-[#4b5563] sm:pl-[3.1rem]">
                  {d.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
