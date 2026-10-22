"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, revealStart, isMobileViewport } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import TenetsSplit from "@/components/sections/TenetsSplit";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

import Link from "next/link";
/**
 * ABOUT — THE ATELIER
 *
 * Rebuilt for air. The previous version crowded three dense blocks into one
 * screen: a two-column intro that dead-ended under the headline, a metrics
 * strip pinched between two rules, and a manifesto sunk in a grey box.
 *
 * This version gives each idea its own breathing room and lets the page
 * scroll: a wide opening statement, a quiet metrics band, an alternating
 * tenets list with one large plate, and a manifesto set as plain type on
 * paper. Nothing is boxed; the rhythm comes from whitespace.
 */

const STUDIO_METRICS = [
  { value: "20+", label: "Years of practice" },
  { value: "42", label: "Private sanctuaries" },
  { value: "03", label: "Annual commissions" },
  { value: "19", label: "Architectural citations" },
];

export default function AboutUs() {
  const rootRef = useRef<HTMLElement>(null);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* ---------- 1. Headline rises word by word ---------- */
      const headWords = splitWords(root.querySelector(".abt-head"));
      gsap.fromTo(
        headWords,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.25,
          stagger: 0.045,
          ease: "power4.out",
          scrollTrigger: { trigger: ".abt-open", start: revealStart("top 84%"), once: true },
        }
      );

      /* ---------- 2. Body copy follows the headline ---------- */
      gsap.fromTo(
        ".abt-lede > *",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: ".abt-open", start: revealStart("top 78%"), once: true },
        }
      );

      /* ---------- 3. Metrics count up as they arrive ---------- */
      gsap.utils.toArray<HTMLElement>(".abt-metric").forEach((el, i) => {
        const figure = el.querySelector<HTMLElement>(".abt-figure");
        const raw = figure?.dataset.value ?? "";
        // Only animate a real number; "20+" keeps its suffix, "03" its padding.
        const target = parseInt(raw, 10);
        const pad = /^0\d/.test(raw);
        const suffix = raw.replace(/[\d]/g, "");

        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".abt-metrics", start: revealStart("top 85%"), once: true },
          }
        );

        if (figure && !Number.isNaN(target)) {
          const counter = { n: 0 };
          gsap.to(counter, {
            n: target,
            duration: 1.6,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: ".abt-metrics", start: revealStart("top 85%"), once: true },
            onUpdate: () => {
              const v = Math.round(counter.n);
              figure.textContent = (pad ? String(v).padStart(2, "0") : String(v)) + suffix;
            },
          });
        }
      });

      // The rule above the metrics draws itself in.
      gsap.fromTo(
        ".abt-metrics-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".abt-metrics", start: revealStart("top 88%"), once: true },
        }
      );

      /* ---------- 5. Manifesto reveals word by word ---------- */
      const quoteWords = splitWords(root.querySelector(".abt-quote"));
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
            trigger: ".abt-manifesto",
            // The quote block is ~65% of a phone viewport, so it gets its own
            // range: begin a little later and scrub over more travel, which
            // keeps the word-by-word reveal legible instead of snapping shut.
            start: revealStart("top 78%", "top 85%"),
            end: () =>
              isMobileViewport() ? "bottom 55%" : "top 32%",
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        ".abt-sign > *",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".abt-sign", start: revealStart("top 90%"), once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="about"
      className="relative bg-[#ffffff] text-[#11141b]"
    >
      {/* ============ Opening statement ============ */}
      <div className="u-shell pt-[clamp(6rem,14vh,11rem)]">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
          About Us · The Atelier
        </span>

        <div className="abt-open mt-12 grid gap-y-12 lg:grid-cols-12 lg:gap-x-20">
          <h2 className="abt-head col-span-full font-serif text-[clamp(2.1rem,4.4vw,3.9rem)] font-light leading-[1.14] tracking-[-0.01em] lg:col-span-7">
            We sculpt spaces where monumentality meets{" "}
            <em className="italic text-[#b58c49]">human intimacy.</em>
          </h2>

          <div className="abt-lede col-span-full lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p className="text-[1.02rem] leading-[1.75] text-[#3b4150]">
              JC Landmarks is an independent architectural atelier and private
              estate practice — building singular, one-of-one residences
              designed to endure across generations.
            </p>
            <p className="mt-6 text-[0.95rem] leading-[1.75] text-[#6b7280]">
              Every commission is a dialogue between geological stone,
              structural steel and the shifting daylight of its own latitude.
            </p>
          </div>
        </div>
      </div>

      {/* ============ Metrics band ============ */}
      <div className="u-shell mt-[clamp(5rem,11vh,9rem)]">
        <div className="abt-metrics relative grid grid-cols-2 gap-y-12 pt-12 lg:grid-cols-4 lg:gap-x-10">
          <span
            aria-hidden="true"
            className="abt-metrics-rule absolute inset-x-0 top-0 h-px origin-left bg-[rgba(20,33,61,0.12)]"
          />
          {STUDIO_METRICS.map((m) => (
            <div key={m.label} className="abt-metric">
              <span
                className="abt-figure block font-serif text-[clamp(2.4rem,4vw,3.4rem)] font-light leading-none text-[#11141b]"
                data-value={m.value}
              >
                {m.value}
              </span>
              <span className="mt-4 block text-[0.68rem] uppercase tracking-[0.2em] text-[#8a8f9a]">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ Core tenets: full-height split screen ============ */}
      <div className="mt-[clamp(5rem,12vh,9rem)]">
        <TenetsSplit />
      </div>

      {/* ============ Manifesto ============ */}
      <div className="u-shell mt-[clamp(6rem,16vh,13rem)] pb-[clamp(6rem,14vh,11rem)]">
        <div className="abt-manifesto mx-auto max-w-3xl text-center">
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
            Founder&rsquo;s Manifesto
          </span>

          <blockquote className="abt-quote mt-10 font-serif text-[clamp(1.4rem,2.7vw,2.3rem)] font-light italic leading-[1.5] text-[#11141b]">
            &ldquo;A true landmark is never imposed upon its environment; it
            emerges from it. We do not build houses for admiration — we build
            sanctuaries that change how one experiences light, shadow and
            time.&rdquo;
          </blockquote>

          <div className="abt-sign mt-12 flex flex-col items-center gap-1">
            <span
              aria-hidden="true"
              className="mb-7 block h-px w-14 bg-[#D8B479]"
            />
            <p className="font-serif text-[1.05rem] text-[#11141b]">
              Julian Castlereagh, AIA
            </p>
            <p className="text-[0.66rem] uppercase tracking-[0.2em] text-[#8a8f9a]">
              Founder &amp; Principal Architect
            </p>
          </div>

          <Link
            href="/contact"
            className="group mt-12 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#11141b]"
          >
            <span className="relative">
              Commission an inquiry
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-[#D8B479] transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-x-0"
              />
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
