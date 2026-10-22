"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import SectionLabel from "@/components/ui/SectionLabel";
import { FACADES, type Still } from "@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

import Link from "next/link";
/**
 * HOMEPAGE — OUR SERVICES
 *
 * Three tall panels in a row. Pointing at (or tabbing into) one widens it and
 * reveals its detail, while the others narrow to a title — so the section
 * reads as one composition and still gives each service room to speak.
 * Each panel links to its chapter on /services.
 *
 * Below 1024px the panels stack and show their detail permanently: there is
 * no hover on touch, and a hidden-until-tapped layout would bury the content.
 */
interface Service {
  id: string;
  no: string;
  title: string;
  lede: string;
  points: string[];
  cta: string;
  still: Still;
}

const SERVICES: Service[] = [
  {
    id: "commercial",
    no: "01",
    title: "Commercial Construction",
    lede: "Offices, retail, hospitality and mixed-use plazas — engineered and built under a single contract.",
    points: ["Design & build", "Structural frame & facades", "Fit-out"],
    cta: "Explore commercial",
    still: FACADES.prismMonolith,
  },
  {
    id: "residential",
    no: "02",
    title: "Residential Construction",
    lede: "Custom homes from grey structure to turnkey, built by our own engineers and site teams.",
    points: ["Design & build", "Grey structure", "Turnkey & renovation"],
    cta: "Explore residential",
    still: FACADES.phase7Villa,
  },
  {
    id: "real-estate",
    no: "03",
    title: "Real Estate",
    lede: "Homes for sale, valuations and purchase — advised by people who know how a house is built.",
    points: ["Homes for sale", "Valuation", "Sell or purchase"],
    cta: "Explore real estate",
    still: FACADES.spanishEstate,
  },
];

const ACTIVE_GROW = 2.6;
const DEFAULT_ACTIVE = 1;

export default function HomeServices() {
  const rootRef = useRef<HTMLElement>(null);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();
    const panels = gsap.utils.toArray<HTMLElement>(".hs-panel", root);
    const details = panels.map((p) => p.querySelector<HTMLElement>(".hs-detail"));
    const hints = panels.map((p) => p.querySelector<HTMLElement>(".hs-hint"));

    const mm = gsap.matchMedia();

    /* ---------- Desktop: expanding panels ---------- */
    mm.add("(min-width: 1024px)", () => {
      let current = DEFAULT_ACTIVE;

      panels.forEach((p, i) => {
        const on = i === current;
        gsap.set(p, { flexGrow: on ? ACTIVE_GROW : 1 });
        // Collapsed detail takes no height, so every collapsed title sits on the
        // same baseline. Opacity and height only — never visibility — so links
        // in collapsed panels stay in the tab order; focusing one opens it.
        gsap.set(details[i], { height: on ? "auto" : 0, opacity: on ? 1 : 0, y: on ? 0 : 18, overflow: "hidden" });
        gsap.set(hints[i], { autoAlpha: on ? 0 : 1 });
        p.toggleAttribute("data-active", on);
      });

      const activate = (i: number) => {
        if (i === current) return;
        const prev = current;
        current = i;
        const d = reduced ? 0 : 1;

        panels.forEach((p, k) => {
          gsap.to(p, { flexGrow: k === i ? ACTIVE_GROW : 1, duration: 0.95 * d, ease: "power3.inOut", overwrite: "auto" });
          p.toggleAttribute("data-active", k === i);
        });
        gsap.to(details[prev], { height: 0, opacity: 0, y: 18, duration: 0.55 * d, ease: "power3.inOut", overwrite: "auto" });
        gsap.to(hints[prev], { autoAlpha: 1, duration: 0.4 * d, delay: 0.3 * d, overwrite: "auto" });
        gsap.to(hints[i], { autoAlpha: 0, duration: 0.25 * d, overwrite: "auto" });
        gsap.fromTo(
          details[i],
          { height: 0, opacity: 0, y: 18 },
          { height: "auto", opacity: 1, y: 0, duration: 0.85 * d, delay: 0.2 * d, ease: "power3.out", overwrite: "auto" }
        );
      };

      const offs = panels.map((p, i) => {
        const on = () => activate(i);
        p.addEventListener("pointerenter", on);
        p.addEventListener("focusin", on);
        return () => {
          p.removeEventListener("pointerenter", on);
          p.removeEventListener("focusin", on);
        };
      });

      return () => {
        offs.forEach((off) => off());
        panels.forEach((p) => p.removeAttribute("data-active"));
      };
    });

    /* ---------- Scroll motion ---------- */
    if (!reduced) {
      mm.add("(min-width: 0px)", () => {
        const words = splitWords(root.querySelector(".hs-head"));
        gsap.fromTo(
          words,
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.045,
            ease: "power4.out",
            scrollTrigger: { trigger: ".hs-head", start: revealStart("top 85%"), once: true },
          }
        );

        gsap.fromTo(
          ".hs-lede",
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".hs-head", start: revealStart("top 80%"), once: true },
          }
        );

        // Panels rise out of their own baseline, one after another.
        // The hidden starting state is set on EVERY panel up front: a staggered
        // fromTo only applied it to the first, so panels 2 and 3 sat fully
        // visible, then snapped hidden when their turn came — the "jerk".
        const imgs = gsap.utils.toArray<HTMLElement>(".hs-img", root);
        gsap.set(panels, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(imgs, { scale: 1.22 });
        const reveal = { trigger: ".hs-panels", start: revealStart("top 80%"), once: true };
        gsap.to(panels, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, stagger: 0.14, ease: "power4.inOut", scrollTrigger: reveal });
        gsap.to(imgs, { scale: 1, duration: 1.9, stagger: 0.14, ease: "power3.out", scrollTrigger: { ...reveal } });

        // Slow parallax drift inside each plate while the band crosses the screen.
        gsap.utils.toArray<HTMLElement>(".hs-drift").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: el.closest(".hs-panel"), start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
            }
          );
        });

        gsap.fromTo(
          ".hs-foot-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".hs-foot", start: revealStart("top 92%"), once: true },
          }
        );
        gsap.fromTo(
          ".hs-foot-fade",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".hs-foot", start: revealStart("top 92%"), once: true },
          }
        );
      });
    }

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="services"
      data-depth="base"
      className="relative z-10 isolate overflow-hidden bg-white py-[var(--section-y)] text-[#11141b]"
    >
      {/* Legacy anchor: the navbar, hero CTA and skip link still target #residence. */}
      <div id="residence" className="absolute top-0" aria-hidden="true" />

      <div className="u-shell">
        <SectionLabel label="Our Services" />

        <div className="mt-12 grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-16">
          <div className="col-span-full lg:col-span-7">
            <span className="mb-4 block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
              What We Do
            </span>
            <h2 className="hs-head font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.12] tracking-[-0.01em]">
              We design, build and sell —{" "}
              <em className="italic text-[#b58c49]">under one roof.</em>
            </h2>
          </div>
          <p className="hs-lede col-span-full max-w-md text-[1rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9">
            Commercial buildings, private homes and the homes we help people
            buy and sell — all handled by one team that answers for every
            stage, from the first drawing to the final key.
          </p>
        </div>

        {/* Panels */}
        <div className="hs-panels mt-[clamp(3.5rem,8vh,5.5rem)] flex flex-col gap-4 lg:h-[clamp(32rem,76vh,44rem)] lg:flex-row lg:gap-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              className="hs-panel group relative h-[clamp(26rem,78vh,36rem)] overflow-hidden bg-[#0b0d12] text-[#f4f2ee] lg:h-auto lg:min-w-0 lg:basis-0"
              style={{ flexGrow: i === DEFAULT_ACTIVE ? ACTIVE_GROW : 1 }}
            >
              <div className="hs-drift absolute inset-x-0 -inset-y-[6%]">
                <div className="hs-img absolute inset-0">
                  <Image
                    src={s.still.src}
                    alt={s.still.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    loading="lazy"
                    className="object-cover"
                    style={{ objectPosition: s.still.position ?? "center" }}
                  />
                </div>
              </div>

              {/* Tone: darker when collapsed so the narrow panels recede */}
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,13,18,0.92)_0%,rgba(11,13,18,0.5)_45%,rgba(11,13,18,0.2)_100%)]" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[rgba(11,13,18,0.38)] transition-opacity duration-700 lg:group-data-[active]:opacity-0 max-lg:opacity-0"
              />

              {/* Number + collapsed hint */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-8">
                <span className="font-serif text-[1rem] font-light text-[#D8B479]">{s.no}</span>
                <span aria-hidden="true" className="hs-hint hidden text-[1.2rem] leading-none text-[#D8B479] lg:block">
                  +
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                <h3 className="font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] font-light leading-[1.15]">
                  {s.title}
                </h3>

                <div className="hs-detail lg:w-[min(28rem,36vw)]">
                  <span aria-hidden="true" className="mt-5 block h-px w-10 bg-[#D8B479]" />
                  <p className="mt-5 max-w-md text-[0.95rem] leading-[1.75] text-[rgba(244,242,238,0.78)]">
                    {s.lede}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.62)]">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2">
                        <span aria-hidden="true" className="block h-[5px] w-[5px] rotate-45 bg-[#D8B479]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services#${s.id}`}
                    className="group/link mt-7 inline-flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.26em] text-[#f4f2ee] outline-none focus-visible:text-[#D8B479]"
                  >
                    <span className="relative">
                      {s.cta}
                      <span aria-hidden="true" className="absolute -bottom-1.5 left-0 block h-px w-full origin-left scale-x-0 bg-[#D8B479] transition-transform duration-500 group-hover/link:scale-x-100" />
                    </span>
                    <span aria-hidden="true" className="text-[#D8B479] transition-transform duration-500 group-hover/link:translate-x-1.5">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer row */}
        <div className="hs-foot relative mt-[clamp(3.5rem,8vh,5rem)] flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <span aria-hidden="true" className="hs-foot-rule absolute inset-x-0 top-0 block h-px origin-left bg-[rgba(20,33,61,0.12)]" />
          <p className="hs-foot-fade max-w-lg font-serif text-[1.15rem] font-light italic leading-[1.5] text-[#4b5563]">
            One team, one contract, one point of accountability.
          </p>
          <Link
            href="/services"
            className="hs-foot-fade group inline-flex items-center gap-4 self-start bg-[#11141b] px-9 py-5 text-[0.66rem] uppercase tracking-[0.26em] text-[#f4f2ee] transition-colors duration-500 hover:bg-[#b58c49] sm:self-auto"
          >
            View all services
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
