"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { FACADES, type Still } from "@/lib/media";
import { PROJECTS } from "@/lib/portfolio";
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
 * The panel is kept deliberately quiet: a counter, one title, one sentence
 * and one figure, centred in a lot of white space.
 *
 * On phones each section becomes its photograph followed by its copy.
 */
interface Tenet {
  id: string;
  tag: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  still: Still;
}

/** The 342-U front elevation by day, from the project's own gallery. */
const AURA_FRONT: Still =
  PROJECTS[0].gallery.find((g) => g.src.endsWith("/frontfasade.webp")) ?? PROJECTS[0].cover!;

const TENETS: Tenet[] = [
  {
    id: "tenet-engineering",
    tag: "Engineering",
    title: "Engineered to last.",
    body: "Our own engineers design every frame and foundation from a soil test of your plot, and inspect each pour before concrete is placed.",
    metric: "In-house",
    metricLabel: "Structural & site engineers",
    still: AURA_FRONT,
  },
  {
    id: "tenet-materials",
    tag: "Materials",
    title: "Quality you can inspect.",
    body: "Graded steel, approved cement, tested concrete and branded fittings — and your site stays open to you at every stage.",
    metric: "Open site",
    metricLabel: "Visit at any stage",
    still: FACADES.prismMonolith,
  },
  {
    id: "tenet-delivery",
    tag: "Delivery",
    title: "One team, plot to keys.",
    body: "Design, approvals, construction and finishing under one contract, with one project manager and an itemised cost.",
    metric: "1 contract",
    metricLabel: "Design, build & handover",
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
        const once = { trigger: sec, start: revealStart("top 70%", "top 80%"), toggleActions: "play reset play reset" };
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

  return (
    <div ref={rootRef} aria-label="Our approach to building" role="region">
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
            <div className="ts-frame absolute inset-0 overflow-hidden bg-[#000000]">
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
              "flex flex-col justify-center px-[var(--gutter)] py-[clamp(3.5rem,9vh,5rem)] lg:py-[clamp(5rem,12vh,8rem)]",
              left
                ? "lg:order-2 lg:pl-[clamp(3rem,5vw,6rem)] lg:[padding-right:var(--ts-edge)]"
                : "lg:order-1 lg:pr-[clamp(3rem,5vw,6rem)] lg:[padding-left:var(--ts-edge)]",
            ].join(" ")}
            style={{ ["--ts-edge" as string]: SHELL_EDGE }}
          >
            <div className="max-w-[30rem]">
              {/* Counter: number, hairline, tag */}
              <div className="ts-rise flex items-center gap-4">
                <span className="font-serif text-[1.05rem] italic tabular-nums text-[#b58c49]">{pad(i + 1)}</span>
                <span aria-hidden="true" className="ts-rule block h-px w-12 origin-left bg-[rgba(181,140,73,0.5)]" />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#11141b]">{t.tag}</span>
              </div>

              <h3 className="ts-rise mt-[clamp(1.5rem,4vh,2.25rem)] font-serif text-[clamp(2rem,3.4vw,3.1rem)] font-light leading-[1.12] tracking-[-0.01em] text-[#11141b]">
                {t.title}
              </h3>
              <p className="ts-rise mt-6 text-[1rem] leading-[1.85] text-[#4b5563]">{t.body}</p>

              <div className="ts-rise mt-[clamp(2.25rem,6vh,3.5rem)] flex items-baseline gap-4 pt-6 shadow-[inset_0_1px_0_rgba(20,33,61,0.1)]">
                <span className="font-serif text-[1.6rem] font-light leading-none text-[#11141b]">{t.metric}</span>
                <span className="text-[0.6rem] uppercase tracking-[0.22em] text-[#6b7280]">{t.metricLabel}</span>
              </div>
            </div>
          </div>
        </section>
        );
      })}
    </div>
  );
}
