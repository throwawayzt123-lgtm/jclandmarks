"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { smoothScrollTo } from "@/components/SmoothScrollProvider";
import { FACADES, INTERIORS, type Still } from "@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * THE TENETS — three full-screen split sections, stacked edge to edge.
 *
 * Each tenet is its own 100vh section: a clean white panel and a full-bleed
 * photograph, with no gap between one section and the next. The photograph
 * alternates sides (right, left, right) and wipes open like a curtain drawn
 * aside, in the matching direction — left-to-right for a right-hand photo,
 * right-to-left for a left-hand one.
 * The page scrolls normally — nothing pins.
 *
 * The left panel lists all three titles, as in an index; the section's own
 * title is set dark and italic, the others in gold, and every title links to
 * its section. Below a hairline sit the counter, the tenet's detail and its
 * figure.
 *
 * On phones each section becomes its photograph followed by its copy.
 */
interface Tenet {
  id: string;
  tag: string;
  title: string;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  still: Still;
}

const TENETS: Tenet[] = [
  {
    id: "tenet-light",
    tag: "Spatial Volumetrics",
    title: "Sculpted Light & Volume",
    tagline: "Architecture defined by light and void, not square footage.",
    description:
      "We begin every commission by carving spatial volumes rather than drafting floor plates. Triple-height lightwells, column-free spans and cantilevered planes carry daylight into the deepest interior rooms.",
    metric: "32 FT",
    metricLabel: "Maximum continuous ceiling void",
    still: INTERIORS.atriumApex,
  },
  {
    id: "tenet-material",
    tag: "Geological Materiality",
    title: "Noble Natural Provenance",
    tagline: "Raw materials selected to age with generational nobility.",
    description:
      "We source directly from heritage quarries, artisan metal workshops and sustainably managed walnut forests. Every surface is monolithic, authentic, and chosen to acquire a dignified patina across decades.",
    metric: "100%",
    metricLabel: "Single-source provenance materials",
    still: FACADES.prismMonolith,
  },
  {
    id: "tenet-water",
    tag: "Water & Horizon",
    title: "Reflection & Seclusion",
    tagline: "Cascading reflection pools and cantilevered terraces.",
    description:
      "To preserve fidelity of craftsmanship, the atelier accepts only three private commissions each year. The principal architect oversees every structural calculation and stonemason joint from inception to handover.",
    metric: "03",
    metricLabel: "Commissions accepted per year",
    still: FACADES.phase7Villa,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Outer padding that lines the panel up with the site's content column. */
const SHELL_EDGE = "max(var(--gutter), calc((100vw - var(--page-max)) / 2 + var(--gutter)))";

export default function TenetsSplit() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ts-section", root).forEach((sec) => {
        const once = { trigger: sec, start: revealStart("top 70%", "top 80%"), once: true };
        const frame = sec.querySelector<HTMLElement>(".ts-frame");
        // The photograph wipes open like a curtain drawn aside — no coloured
        // overlay, just the image itself. Right-hand photo: left -> right.
        // Left-hand photo: right -> left.
        const ltr = sec.dataset.side !== "left";
        gsap
          .timeline({ scrollTrigger: once })
          .fromTo(
            frame,
            { clipPath: ltr ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
            { clipPath: "inset(0 0% 0 0%)", duration: 1.5, ease: "power4.inOut" }
          )
          // ...settling out of a slight zoom as it is uncovered.
          .fromTo(sec.querySelector(".ts-img"), { scale: 1.16 }, { scale: 1, duration: 1.9, ease: "power3.out" }, 0);
        // ...and drifts gently while the section crosses the screen.
        gsap.fromTo(
          sec.querySelector(".ts-drift"),
          { yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } }
        );

        // The index and the detail rise in, in reading order.
        gsap.fromTo(
          sec.querySelectorAll(".ts-rise"),
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1.05, stagger: 0.07, ease: "power3.out", scrollTrigger: once }
        );
        gsap.fromTo(sec.querySelector(".ts-rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut", scrollTrigger: once });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY);
  };

  return (
    <div ref={rootRef} aria-label="The core tenets of our atelier" role="region">
      {TENETS.map((t, i) => {
        const left = i % 2 === 1; // the middle section puts its photograph on the left
        return (
        <section
          key={t.id}
          id={t.id}
          data-side={left ? "left" : "right"}
          className="ts-section grid bg-white lg:h-[100svh] lg:min-h-[40rem] lg:grid-cols-2"
        >
          {/* Photograph — full bleed, alternating sides (always first on phones) */}
          <div className={`relative aspect-[4/3] overflow-hidden bg-white sm:aspect-[16/9] lg:aspect-auto ${left ? "lg:order-1" : "lg:order-2"}`}>
            <div className="ts-frame absolute inset-0 overflow-hidden bg-[#0b0d12]">
            <div className="ts-drift absolute inset-x-0 -inset-y-[5%]">
              <div className="ts-img absolute inset-0">
                <Image
                  src={t.still.src}
                  alt={t.still.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover"
                  style={{ objectPosition: t.still.position ?? "center" }}
                />
              </div>
            </div>
            </div>
          </div>

          {/* Panel — its outer edge lines up with the site's content column */}
          <div
            className={[
              "flex flex-col justify-between px-[var(--gutter)] py-[clamp(3rem,8vh,4.5rem)] lg:pb-[clamp(2.5rem,7vh,4.5rem)] lg:pt-[clamp(6rem,14vh,9rem)]",
              left
                ? "lg:order-2 lg:pl-[clamp(3rem,5vw,6rem)] lg:[padding-right:var(--ts-edge)]"
                : "lg:order-1 lg:pr-[clamp(3rem,5vw,6rem)] lg:[padding-left:var(--ts-edge)]",
            ].join(" ")}
            style={{ ["--ts-edge" as string]: SHELL_EDGE }}
          >
            <div>
              <span className="ts-rise block text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
                Curatorial Philosophy · The Core Tenets
              </span>

              {/* Index of all tenets — this section's own title in dark italic */}
              <ul className="mt-[clamp(1.25rem,3.5vh,2.5rem)] hidden lg:block">
                {TENETS.map((other) => {
                  const own = other.id === t.id;
                  return (
                    <li key={other.id} className="ts-rise">
                      <button
                        type="button"
                        onClick={() => jump(other.id)}
                        aria-current={own ? "true" : undefined}
                        className={[
                          "block py-[0.1em] text-left font-serif text-[clamp(2rem,3.3vw,3.3rem)] font-light leading-[1.12] tracking-[-0.01em] transition-colors duration-500",
                          own ? "italic text-[#11141b]" : "text-[#b58c49]/75 hover:text-[#b58c49]",
                        ].join(" ")}
                      >
                        {other.title}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Phones: just this tenet's title */}
              <h3 className="ts-rise mt-4 font-serif text-[clamp(1.8rem,6.5vw,2.5rem)] font-light italic leading-[1.15] lg:hidden">
                {t.title}
              </h3>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="ts-rise flex items-center gap-5">
                <span className="text-[0.62rem] tabular-nums uppercase tracking-[0.24em] text-[#8a8f9a]">
                  <span className="text-[#11141b]">{pad(i + 1)}</span> / {pad(TENETS.length)}
                </span>
                <span aria-hidden="true" className="ts-rule block h-px flex-1 origin-left bg-[rgba(181,140,73,0.35)]" />
              </div>
              <span className="ts-rise mt-[clamp(1.5rem,3.5vh,2.5rem)] block text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#b58c49]">
                {t.tag}
              </span>
              <p className="ts-rise mt-4 font-serif text-[1.12rem] font-light italic leading-[1.5] text-[#b58c49]">{t.tagline}</p>
              <p className="ts-rise mt-4 max-w-[34rem] text-[0.98rem] leading-[1.8] text-[#374151]">{t.description}</p>
              <div className="ts-rise mt-7 flex items-baseline gap-5">
                <span className="font-serif text-[2rem] font-light leading-none text-[#11141b]">{t.metric}</span>
                <span className="text-[0.64rem] uppercase tracking-[0.2em] text-[#8a8f9a]">{t.metricLabel}</span>
              </div>
            </div>
          </div>
        </section>
        );
      })}
    </div>
  );
}
