"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart, isMobileViewport } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * ABOUT — CLOSING STATEMENT
 *
 * The page ends the way the homepage About section does: plain type on paper,
 * scrubbed word by word, then a single call to action. No box, no card.
 */
export default function AboutClose() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const quoteWords = splitWords(root.querySelector(".ac-quote"));
      gsap.fromTo(
        quoteWords,
        { opacity: 0.08, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".ac-quote",
            // Long block, so mobile begins later and scrubs over more travel.
            start: revealStart("top 78%", "top 86%"),
            end: () => (isMobileViewport() ? "bottom 58%" : "top 34%"),
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        ".ac-cta > *",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ac-cta",
            start: revealStart("top 88%"),
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
      id="about-close"
      className="relative bg-[#ffffff] pb-[clamp(6rem,15vh,11rem)] pt-[clamp(5rem,12vh,9rem)] text-[#11141b]"
    >
      <div className="u-shell">
        <div className="mx-auto max-w-3xl text-center">
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
            In Closing
          </span>

          {/* The founder's words, exactly as given. */}
          <blockquote className="mt-10">
            <p className="ac-quote font-serif text-[clamp(1.4rem,2.7vw,2.3rem)] font-light italic leading-[1.5]">
              &ldquo;We animate blueprints into landmarks. Every nail, every
              deadline&mdash;a promise fulfilled. That is my legacy and the soul
              of Jay-Cee Landmarks.&rdquo;
            </p>
            <footer className="ac-cta mt-8 flex flex-col items-center gap-3">
              <span aria-hidden="true" className="block h-px w-14 bg-[rgba(20,33,61,0.16)]" />
              <cite className="text-[0.66rem] font-semibold uppercase not-italic tracking-[0.3em] text-[#b58c49]">
                M. Naveed
              </cite>
            </footer>
          </blockquote>

          <div className="ac-cta mt-14 flex flex-col items-center gap-7">
            <p className="max-w-2xl text-[1rem] leading-[1.85] text-[#374151]">
              We don&rsquo;t just erect structures&mdash;we craft enduring legacies.
              From groundbreaking to grand unveiling, we fuse architectural artistry
              with masterful project management, delivering precision, transparency,
              and unwavering excellence. Your vision, our mastery&mdash;transformed
              into reality. Let&rsquo;s build something extraordinary together.
            </p>
            <p className="font-serif text-[clamp(1.15rem,2.2vw,1.6rem)] font-light italic leading-[1.35] text-[#11141b]">
              Reach out today&mdash;and turn your blueprint into a landmark.
            </p>
            <MagneticButton href="/contact">
              Talk to our team
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
