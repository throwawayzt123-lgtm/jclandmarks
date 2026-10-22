"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { enquiryHref } from "@/lib/portfolio";

import Link from "next/link";
/**
 * SERVICES — CLOSING BAND
 *
 * Dark, to bookend the dark masthead. One question, and three routes into the
 * enquiry form, each named for the service so the visitor never has to work
 * out which door is theirs.
 */
const ROUTES = [
  { label: "Commercial project", note: "Offices, retail, hospitality", topic: "commercial" },
  { label: "Residential build", note: "New home, grey structure, turnkey", topic: "residential" },
  { label: "Buy or sell a home", note: "Listings, valuation, purchase", topic: "buy" },
];

export default function ServicesClose() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".scl-head"));
      gsap.fromTo(
        words,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.25,
          stagger: 0.045,
          ease: "power4.out",
          scrollTrigger: { trigger: ".scl-head", start: revealStart("top 86%"), once: true },
        }
      );

      gsap.fromTo(
        ".scl-route",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".scl-routes", start: revealStart("top 88%"), once: true },
        }
      );

      gsap.fromTo(
        ".scl-route-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".scl-routes", start: revealStart("top 88%"), once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="services-close"
      className="relative bg-[#0b0d12] py-[clamp(6rem,15vh,11rem)] text-[#f4f2ee]"
    >
      <div className="u-shell">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
          Begin a Conversation
        </span>
        <h2 className="scl-head mt-10 max-w-3xl font-serif text-[clamp(2rem,4.4vw,3.8rem)] font-light leading-[1.12] tracking-[-0.01em]">
          Tell us what you are planning to build, buy or sell.
        </h2>

        <ul className="scl-routes mt-[clamp(3.5rem,9vh,6rem)] grid gap-y-2 lg:grid-cols-3 lg:gap-x-10">
          {ROUTES.map((r) => (
            <li key={r.label} className="scl-route">
              <Link href={enquiryHref(r.topic)} className="group relative block py-8 outline-none">
                <span aria-hidden="true" className="scl-route-rule absolute inset-x-0 top-0 block h-px origin-left bg-[rgba(244,242,238,0.16)]" />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 block h-px w-full origin-left scale-x-0 bg-[#D8B479] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="flex items-baseline justify-between gap-6">
                  <span className="font-serif text-[clamp(1.35rem,2vw,1.75rem)] font-light leading-[1.2] transition-colors duration-500 group-hover:text-[#D8B479] group-focus-visible:text-[#D8B479]">
                    {r.label}
                  </span>
                  <span aria-hidden="true" className="text-[#D8B479] transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </span>
                <span className="mt-3 block text-[0.64rem] uppercase tracking-[0.2em] text-[rgba(244,242,238,0.46)]">
                  {r.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
