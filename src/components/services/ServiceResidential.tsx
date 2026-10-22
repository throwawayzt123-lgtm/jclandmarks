"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart, isMobileViewport } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { FACADES } from "@/lib/media";

/**
 * SERVICES — 02 RESIDENTIAL CONSTRUCTION
 *
 * Opens with an aperture: one plate that starts as a narrow vertical slit and
 * widens to full bleed as it travels up the screen, scrubbed — so the house is
 * literally revealed by scrolling. No pin, which keeps the section free of
 * the measurement problems pinned triggers bring.
 *
 * Below it, the build options are set as a specification table rather than
 * cards, because that is how owners actually compare them: what is included,
 * and who it suits.
 */
const OPTIONS = [
  {
    name: "Design & Build",
    includes: "Architecture, structural design and authority approvals, followed by the complete build to handover.",
    suits: "Owners starting from an empty plot.",
  },
  {
    name: "Grey Structure",
    includes: "Excavation, foundations, RCC frame, brickwork, roof slabs, and plumbing and electrical conduits.",
    suits: "Owners who want to manage finishing themselves.",
  },
  {
    name: "Turnkey",
    includes: "Grey structure plus finishes, joinery, kitchens, bathrooms, MEP and landscaping — keys on handover.",
    suits: "Owners who want one contract and one handover date.",
  },
  {
    name: "Renovation & Extension",
    includes: "Structural alterations, added floors and complete interior renewal of an existing home.",
    suits: "Homes that need more space, or a second life.",
  },
];

const STAGES = [
  { title: "Survey & Brief", body: "Site survey, soil report and a written brief." },
  { title: "Design & Approvals", body: "Drawings, structure and authority approvals." },
  { title: "Grey Structure", body: "Foundations to roof slab, inspected at every pour." },
  { title: "Finishing", body: "Stone, joinery, services and fittings." },
  { title: "Handover", body: "Snag list closed, documents and keys." },
];

export default function ServiceResidential() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".sr-head"));
      gsap.fromTo(
        words,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: { trigger: ".sr-head", start: revealStart("top 85%"), once: true },
        }
      );

      gsap.fromTo(
        ".sr-lede",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sr-head", start: revealStart("top 80%"), once: true },
        }
      );

      /* ---- Aperture: slit to full bleed, scrubbed ---- */
      const aperture = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".sr-aperture",
          start: "top bottom",
          end: "center 55%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      aperture
        .fromTo(
          ".sr-aperture",
          { clipPath: () => (isMobileViewport() ? "inset(6% 22% 6% 22%)" : "inset(4% 36% 4% 36%)") },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }
        )
        .fromTo(".sr-aperture-img", { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
        .fromTo(".sr-aperture-cap", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.3 }, 0.72);

      /* ---- Specification rows ---- */
      gsap.utils.toArray<HTMLElement>(".sr-opt").forEach((row) => {
        gsap.fromTo(
          row.querySelector(".sr-opt-rule"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: row, start: revealStart("top 90%"), once: true } }
        );
        gsap.fromTo(
          row.querySelectorAll(".sr-fade"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.95, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: row, start: revealStart("top 88%"), once: true } }
        );
      });

      /* ---- Process line draws, stages light up in turn ---- */
      const stages = gsap.utils.toArray<HTMLElement>(".sr-stage");
      const process = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".sr-process",
          start: revealStart("top 78%", "top 85%"),
          end: () => (isMobileViewport() ? "bottom 60%" : "bottom 45%"),
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      process.fromTo(".sr-line-x", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      process.fromTo(".sr-line-y", { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
      stages.forEach((stage, i) => {
        const at = (i / Math.max(1, stages.length - 1)) * 0.92;
        process
          .fromTo(
            stage.querySelector(".sr-node"),
            { backgroundColor: "rgba(181,140,73,0)", scale: 0.6 },
            { backgroundColor: "rgba(181,140,73,1)", scale: 1, duration: 0.08 },
            at
          )
          .fromTo(stage.querySelectorAll(".sr-stage-fade"), { opacity: 0.18 }, { opacity: 1, duration: 0.08 }, at);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="residential"
      data-chapter="1"
      className="relative bg-[#ffffff] py-[clamp(6rem,15vh,11rem)] text-[#11141b]"
    >
      <div className="u-shell">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
          02 · Residential Construction
        </span>

        <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-20">
          <h2 className="sr-head col-span-full font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em] lg:col-span-7">
            Homes built exactly as they were{" "}
            <em className="italic text-[#b58c49]">drawn.</em>
          </h2>
          <p className="sr-lede col-span-full max-w-md text-[0.98rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9 lg:pt-3">
            From a single plot to a full estate, we take a residence from survey
            to handover with our own engineers and site teams — and one person
            accountable for the whole of it.
          </p>
        </div>
      </div>

      {/* Aperture plate */}
      <div className="u-shell mt-[clamp(4rem,10vh,7rem)]">
        <figure className="sr-aperture relative h-[clamp(24rem,78vh,46rem)] overflow-hidden bg-[#0b0d12]">
          <Image
            src={FACADES.phase7Villa.src}
            alt={FACADES.phase7Villa.alt}
            fill
            sizes="100vw"
            loading="lazy"
            className="sr-aperture-img object-cover"
            style={{ objectPosition: FACADES.phase7Villa.position }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,13,18,0.7)_0%,rgba(11,13,18,0)_42%)]" />
          <figcaption className="sr-aperture-cap absolute bottom-0 left-0 p-6 text-[#f4f2ee] sm:p-10">
            <span className="block text-[0.62rem] uppercase tracking-[0.26em] text-[#D8B479]">Residence · Phase 7</span>
            <span className="mt-3 block font-serif text-[clamp(1.3rem,2.2vw,1.9rem)] font-light">1 Kanal contemporary home</span>
          </figcaption>
        </figure>
      </div>

      {/* Build options as a specification table */}
      <div className="u-shell mt-[clamp(5rem,12vh,8rem)]">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-20">
          <h3 className="col-span-full font-serif text-[clamp(1.6rem,2.8vw,2.4rem)] font-light leading-[1.2] lg:col-span-5">
            Choose how much of it we build.
          </h3>
        </div>

        {/* Column headings — desktop only, the rows label themselves on mobile */}
        <div className="mt-12 hidden grid-cols-12 gap-x-12 pb-5 text-[0.6rem] uppercase tracking-[0.24em] text-[#8a8f9a] lg:grid">
          <span className="col-span-3">Service</span>
          <span className="col-span-5">What is included</span>
          <span className="col-span-4">Best suited to</span>
        </div>

        <ul className="mt-6 lg:mt-0">
          {OPTIONS.map((o) => (
            <li key={o.name} className="sr-opt relative grid gap-y-4 py-9 lg:grid-cols-12 lg:gap-x-12">
              <span aria-hidden="true" className="sr-opt-rule absolute inset-x-0 top-0 block h-px origin-left bg-[rgba(20,33,61,0.12)]" />
              <span className="sr-fade col-span-3 font-serif text-[clamp(1.35rem,2vw,1.7rem)] font-light leading-[1.2]">
                {o.name}
              </span>
              <p className="sr-fade col-span-5 text-[0.95rem] leading-[1.8] text-[#4b5563]">
                <span className="mb-1 block text-[0.58rem] uppercase tracking-[0.22em] text-[#8a8f9a] lg:hidden">Included</span>
                {o.includes}
              </p>
              <p className="sr-fade col-span-4 font-serif text-[1.02rem] italic leading-[1.6] text-[#b58c49]">
                <span className="mb-1 block font-sans text-[0.58rem] not-italic uppercase tracking-[0.22em] text-[#8a8f9a] lg:hidden">Best suited to</span>
                {o.suits}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Process */}
      <div className="u-shell mt-[clamp(5rem,12vh,8rem)]">
        <span className="block text-[0.62rem] uppercase tracking-[0.26em] text-[#8a8f9a]">From plot to keys</span>

        <ol className="sr-process relative mt-12 grid gap-y-10 pl-9 lg:grid-cols-5 lg:gap-x-8 lg:pl-0 lg:pt-12">
          {/* Track + fill: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute left-[5px] top-1 bottom-1 w-px bg-[rgba(20,33,61,0.12)] lg:hidden" />
          <span aria-hidden="true" className="sr-line-y absolute left-[5px] top-1 bottom-1 w-px origin-top bg-[#b58c49] lg:hidden" />
          <span aria-hidden="true" className="absolute left-0 right-0 top-[5px] hidden h-px bg-[rgba(20,33,61,0.12)] lg:block" />
          <span aria-hidden="true" className="sr-line-x absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-[#b58c49] lg:block" />

          {STAGES.map((s, i) => (
            <li key={s.title} className="sr-stage relative">
              <span
                aria-hidden="true"
                className="sr-node absolute left-[-36px] top-[0.4rem] block h-[11px] w-[11px] rotate-45 bg-[#b58c49] lg:left-0 lg:top-[-48px]"
                style={{ boxShadow: "0 0 0 1px #b58c49, 0 0 0 5px #ffffff" }}
              />
              <span className="sr-stage-fade block font-serif text-[0.95rem] font-light text-[#b58c49]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sr-stage-fade mt-2 block font-serif text-[1.3rem] font-light leading-[1.25]">{s.title}</span>
              <span className="sr-stage-fade mt-2 block text-[0.88rem] leading-[1.7] text-[#6b7280]">{s.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
