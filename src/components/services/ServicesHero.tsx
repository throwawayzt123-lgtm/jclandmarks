"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { FACADES } from "@/lib/media";

/**
 * SERVICES — INDEX MASTHEAD
 *
 * The three services are the masthead. Each is a large serif row; pointing at
 * one cross-fades the backdrop to that service's plate, so the hero works as
 * a table of contents rather than a banner. Touch devices simply tap through
 * to the chapter — the backdrop swap is a pointer-only nicety.
 */
const SERVICES = [
  {
    no: "01",
    id: "commercial",
    title: "Commercial Construction",
    note: "Offices · Retail · Hospitality · Mixed-use",
    still: FACADES.prismMonolith,
  },
  {
    no: "02",
    id: "residential",
    title: "Residential Construction",
    note: "Custom homes · Grey structure · Turnkey",
    still: FACADES.phase7Villa,
  },
  {
    no: "03",
    id: "real-estate",
    title: "Real Estate",
    note: "Homes for sale · Purchase · Valuation",
    still: FACADES.spanishEstate,
  },
];

export default function ServicesHero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const plates = gsap.utils.toArray<HTMLElement>(".sh-bg", root);
    const rows = gsap.utils.toArray<HTMLElement>(".sh-row", root);
    gsap.set(plates, { opacity: 0 });
    gsap.set(plates[1], { opacity: 1 });

    const reduced = prefersReducedMotion();
    let current = 1;

    const show = (i: number) => {
      if (i === current) return;
      current = i;
      plates.forEach((p, k) =>
        gsap.to(p, {
          opacity: k === i ? 1 : 0,
          duration: reduced ? 0 : 0.9,
          ease: "power2.out",
          overwrite: true,
        })
      );
      rows.forEach((r, k) => r.toggleAttribute("data-active", k === i));
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];
    if (finePointer) {
      rows.forEach((row, i) => {
        const enter = () => show(i);
        row.addEventListener("pointerenter", enter);
        row.addEventListener("focus", enter);
        cleanups.push(() => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("focus", enter);
        });
      });
    }

    if (reduced) return () => cleanups.forEach((c) => c());

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".sh-head"));
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        ".sh-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      )
        .fromTo(
          words,
          { yPercent: 118, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.05, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          ".sh-rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, stagger: 0.1, ease: "power3.inOut" },
          "-=0.8"
        )
        .fromTo(
          ".sh-row-inner",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "power4.out" },
          "<0.15"
        );

      // The whole backdrop settles out of an overscale as the hero leaves.
      gsap.fromTo(
        ".sh-bg-wrap",
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);

    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden bg-[#0b0d12] text-[#f4f2ee]"
    >
      <div aria-hidden="true" className="sh-bg-wrap absolute inset-0">
        {SERVICES.map((s, i) => (
          <div key={s.id} className="sh-bg absolute inset-0">
            <Image
              src={s.still.src}
              alt=""
              fill
              priority={i === 1}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: s.still.position ?? "center" }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(11,13,18,0.94)_0%,rgba(11,13,18,0.78)_45%,rgba(11,13,18,0.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0d12] to-transparent" />
      </div>

      <div className="u-shell relative pb-[clamp(4rem,9vh,7rem)] pt-[clamp(9rem,20vh,13rem)]">
        <span className="sh-eyebrow block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
          Our Services
        </span>

        <h1 className="sh-head mt-8 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.3rem)] font-light leading-[1.1] tracking-[-0.01em]">
          Three ways we put landmarks on the ground.
        </h1>

        <nav aria-label="Services" className="mt-[clamp(3.5rem,9vh,6rem)]">
          <ul>
            {SERVICES.map((s, i) => (
              <li key={s.id} className="relative">
                <span
                  aria-hidden="true"
                  className="sh-rule absolute inset-x-0 top-0 block h-px origin-left bg-[rgba(244,242,238,0.16)]"
                />
                <a
                  href={`#${s.id}`}
                  data-active={i === 1 ? "" : undefined}
                  className="sh-row group block overflow-hidden py-7 outline-none sm:py-8"
                >
                  <span className="sh-row-inner grid grid-cols-[2.6rem_1fr_auto] items-baseline gap-x-4 sm:grid-cols-[4rem_1fr_auto] lg:grid-cols-[5rem_1fr_22rem_auto]">
                    <span className="font-serif text-[0.95rem] font-light text-[#D8B479]">
                      {s.no}
                    </span>
                    <span className="font-serif text-[clamp(1.55rem,3.6vw,3.1rem)] font-light leading-[1.1] text-[rgba(244,242,238,0.62)] transition-[color,transform] duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-3 group-hover:text-[#f4f2ee] group-focus-visible:text-[#f4f2ee] group-data-[active]:text-[#f4f2ee]">
                      {s.title}
                    </span>
                    <span className="hidden text-[0.64rem] uppercase tracking-[0.2em] text-[rgba(244,242,238,0.46)] lg:block">
                      {s.note}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[1.1rem] text-[#D8B479] opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-1 group-hover:opacity-100 group-data-[active]:opacity-100"
                    >
                      ↓
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="sh-rule block h-px origin-left bg-[rgba(244,242,238,0.16)]" />
        </nav>
      </div>
    </section>
  );
}
