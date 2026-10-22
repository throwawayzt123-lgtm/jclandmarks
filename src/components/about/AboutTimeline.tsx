"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";

/**
 * ABOUT — TRAJECTORY
 *
 * A dark band carrying a vertical spine that draws itself as the section is
 * scrubbed. Each milestone marker fills once the spine passes it, so the
 * reading order and the motion are the same thing.
 *
 * The dark ground is deliberate: it breaks the long run of paper between the
 * masthead and the footer, and echoes the homepage hero.
 */
const MILESTONES = [
  {
    year: "2009",
    title: "The practice opens",
    body: "Founded as a two-person drawing office taking on single-plot residential work in Lahore.",
  },
  {
    year: "2013",
    title: "Engineering brought in-house",
    body: "Structural calculation moved inside the practice, ending the split between what we drew and what others approved.",
  },
  {
    year: "2017",
    title: "Own site teams",
    body: "Directly employed masons, steel fixers and joiners, so finish quality stopped depending on whoever won the tender.",
  },
  {
    year: "2021",
    title: "First triple-height commissions",
    body: "Post-tensioned slabs and column-free salons became standard rather than exceptional requests.",
  },
  {
    year: "Today",
    title: "Three commissions a year",
    body: "Deliberately capped, so the principal stays on every site and no drawing is delegated away.",
  },
];

export default function AboutTimeline() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const headWords = splitWords(root.querySelector(".at-head"));
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
            trigger: ".at-head",
            start: revealStart("top 85%"),
            once: true,
          },
        }
      );

      // The spine draws across the whole list, tied to scroll position.
      gsap.fromTo(
        ".at-spine-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".at-list",
            start: revealStart("top 78%", "top 88%"),
            end: "bottom 65%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".at-item").forEach((item) => {
        gsap.fromTo(
          item.querySelectorAll(".at-fade"),
          { opacity: 0, x: -18 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: revealStart("top 85%"),
              once: true,
            },
          }
        );

        // The marker fills from hollow to gold as the spine reaches it.
        gsap.fromTo(
          item.querySelector(".at-dot"),
          { scale: 0.4, backgroundColor: "rgba(216,180,121,0)" },
          {
            scale: 1,
            backgroundColor: "rgba(216,180,121,1)",
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: revealStart("top 82%"),
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
      id="trajectory"
      className="relative bg-[#0b0d12] py-[clamp(6rem,15vh,11rem)] text-[#f4f2ee]"
    >
      <div className="u-shell">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
          Trajectory
        </span>

        <h2 className="at-head mt-12 max-w-2xl font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em]">
          How the practice took its{" "}
          <em className="italic text-[#D8B479]">present shape.</em>
        </h2>

        <div className="at-list relative mt-[clamp(4rem,10vh,7rem)] pl-10 sm:pl-16">
          {/* Spine: a dim track with a gold fill drawn on scroll. */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[3px] top-2 w-px bg-[rgba(244,242,238,0.14)] sm:left-[27px]"
          />
          <span
            aria-hidden="true"
            className="at-spine-fill absolute bottom-0 left-[3px] top-2 w-px origin-top bg-[#D8B479] sm:left-[27px]"
          />

          {MILESTONES.map((m) => (
            <article
              key={m.year}
              className="at-item relative pb-[clamp(3rem,7vh,5rem)] last:pb-0"
            >
              <span
                aria-hidden="true"
                className="at-dot absolute left-[-37px] top-[0.45rem] block h-[7px] w-[7px] rotate-45 bg-[#D8B479] sm:left-[-61px]"
                style={{ boxShadow: "0 0 0 4px #0b0d12" }}
              />
              <div className="grid gap-y-4 lg:grid-cols-12 lg:gap-x-16">
                <div className="lg:col-span-3">
                  <span className="at-fade block font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] font-light leading-none tracking-[0.02em] text-[#D8B479]">
                    {m.year}
                  </span>
                </div>
                <div className="lg:col-span-8 lg:col-start-5">
                  <h3 className="at-fade font-serif text-[clamp(1.35rem,2.2vw,1.9rem)] font-light leading-[1.22]">
                    {m.title}
                  </h3>
                  <p className="at-fade mt-4 max-w-xl text-[0.95rem] leading-[1.8] text-[rgba(244,242,238,0.62)]">
                    {m.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
