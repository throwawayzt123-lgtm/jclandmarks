"use client";

import Link from "next/link";
import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, prefersReducedMotion, revealStart, isMobileViewport } from "@/lib/gsap";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * THE PROMISE — the founder's words, held up on black.
 *
 * One quotation, set large in the display serif. As the section is scrolled,
 * its words light up one after another from a dim ghost to full strength, so
 * the sentence is read at the pace of the page. The phrases that carry the
 * meaning are set in gold italic. Beneath it, the company's statement and the
 * call to action.
 *
 * The wording is the client's own, word for word.
 */

/** [word, emphasised] — authored in its final state; the scroll only dims it. */
const QUOTE: Array<[string, boolean]> = [
  ["We", false], ["animate", false], ["blueprints", false], ["into", false], ["landmarks.", true],
  ["Every", false], ["nail,", false], ["every", false], ["deadline—a", false], ["promise", true], ["fulfilled.", true],
  ["That", false], ["is", false], ["my", false], ["legacy", false], ["and", false], ["the", false], ["soul", false], ["of", false],
  ["Jay-Cee", true], ["Landmarks.", true],
];

/** Indexes of two QUOTE words that must stay on one line. */
const KEEP_TOGETHER = [8, 9] as const;

export default function FounderStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // The quote lights up word by word as it is scrolled through.
      gsap.fromTo(
        ".fq-w",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".fq-quote",
            start: revealStart("top 80%", "top 88%"),
            end: () => (isMobileViewport() ? "bottom 52%" : "bottom 48%"),
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        ".fq-mark",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: root, start: revealStart("top 75%"), toggleActions: "play reset play reset" } }
      );
      gsap.fromTo(
        ".fq-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: ".fq-by", start: revealStart("top 90%"), toggleActions: "play reset play reset" } }
      );
      gsap.fromTo(
        ".fq-rise",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fq-rest", start: revealStart("top 82%"), toggleActions: "play reset play reset" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  /** A pool of gold light follows the pointer across the section. */
  const onMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const el = glowRef.current;
    const root = rootRef.current;
    if (!el || !root || e.pointerType === "touch") return;
    const r = root.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.opacity = "1";
  }, []);

  return (
    <section
      ref={rootRef}
      id="promise"
      aria-labelledby="promise-title"
      onPointerMove={onMove}
      onPointerLeave={() => glowRef.current && (glowRef.current.style.opacity = "0")}
      className="relative isolate overflow-hidden bg-[#000000] py-[clamp(6rem,15vh,11rem)] text-[#f4f2ee]"
    >
      {/* Faint drafting grid, strongest behind the quotation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(216,180,121,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(216,180,121,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 32%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 32%, #000 20%, transparent 75%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_26%,rgba(216,180,121,0.12),transparent_72%)]" />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700"
        style={{ backgroundImage: "radial-gradient(circle 360px at var(--mx, 50%) var(--my, 50%), rgba(216,180,121,0.09), transparent 100%)" }}
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,121,0.4),transparent)]" />

      <div className="u-shell">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.36em] text-[#D8B479]">
            <span aria-hidden="true" className="h-px w-10 bg-[#D8B479]" />
            Our Promise
            <span aria-hidden="true" className="h-px w-10 bg-[#D8B479]" />
          </p>

          {/* The founder's words */}
          <figure className="relative mt-10">
            <span
              aria-hidden="true"
              className="fq-mark pointer-events-none absolute -top-[0.38em] left-1/2 -translate-x-1/2 select-none font-serif text-[clamp(7rem,18vw,15rem)] leading-none text-[#D8B479]/[0.16]"
            >
              &ldquo;
            </span>

            <blockquote className="relative">
              <h2 id="promise-title" className="sr-only">
                We animate blueprints into landmarks. Every nail, every deadline&mdash;a promise fulfilled. That is my legacy and the soul of Jay-Cee Landmarks.
              </h2>
              <p
                aria-hidden="true"
                className="fq-quote pt-[clamp(2.5rem,6vw,4.5rem)] font-serif text-[clamp(1.7rem,4.4vw,3.7rem)] font-light leading-[1.22] tracking-[-0.01em] [text-wrap:balance]"
              >
                {QUOTE.map(([word, em], i) => {
                  const w = (
                    <span key={i} className={`fq-w inline-block ${em ? "italic text-[#D8B479]" : ""}`}>
                      {word}
                      {i < QUOTE.length - 1 ? " " : ""}
                    </span>
                  );
                  // "deadline—a" and "promise" never part across a line break.
                  return i === KEEP_TOGETHER[0] ? (
                    <span key={i} className="whitespace-nowrap">
                      {w}
                      <span className={`fq-w inline-block italic text-[#D8B479]`}>{QUOTE[KEEP_TOGETHER[1]][0]}{" "}</span>
                    </span>
                  ) : i === KEEP_TOGETHER[1] ? null : (
                    w
                  );
                })}
              </p>
            </blockquote>

            <figcaption className="fq-by mt-10 flex flex-col items-center gap-4">
              <span aria-hidden="true" className="fq-rule block h-px w-20 origin-center bg-[#D8B479]" />
              <cite className="text-[0.74rem] font-semibold uppercase not-italic tracking-[0.36em] text-[#D8B479]">M. Naveed</cite>
            </figcaption>
          </figure>

          {/* The company's statement */}
          <div className="fq-rest mx-auto mt-[clamp(4rem,10vh,7rem)] max-w-3xl">
            <h3 className="fq-rise font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-[1.25] [text-wrap:balance]">
              We don&rsquo;t just erect <span className="whitespace-nowrap">structures&mdash;we</span> craft{" "}
              <em className="italic text-[#D8B479]">enduring legacies.</em>
            </h3>
            <p className="fq-rise mt-7 text-[1.02rem] leading-[1.9] text-white/65">
              From groundbreaking to grand unveiling, we fuse architectural artistry with masterful project management, delivering
              precision, transparency, and unwavering excellence. Your vision, our <span className="whitespace-nowrap">mastery&mdash;transformed</span> into reality.
            </p>
            <p className="fq-rise mt-6 font-serif text-[clamp(1.2rem,2.2vw,1.6rem)] font-light italic leading-[1.4] text-[#D8B479]">
              Let&rsquo;s build something extraordinary together.
            </p>

            <div className="fq-rise mt-11 flex flex-col items-center gap-6">
              <p className="text-[0.66rem] uppercase tracking-[0.3em] text-white/45">Reach out today&mdash;and turn your blueprint into a landmark.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="u-btn u-btn--gold">
                  <span>Start your project</span>
                  <span aria-hidden="true" className="u-btn__arrow" />
                </Link>
                <Link href="/projects" className="u-btn u-btn--light">
                  <span>See our work</span>
                  <span aria-hidden="true" className="u-btn__arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
