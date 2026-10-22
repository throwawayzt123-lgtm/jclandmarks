"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { FACADES } from "@/lib/media";

/**
 * ABOUT — MASTHEAD
 *
 * Deliberately dark, like the homepage hero, so the page opens on the same
 * note and then resolves into paper. No pinning and no frame sequence: this
 * is a reading page, so the masthead states the practice and gets out of the
 * way.
 */
export default function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".ah-head"));

      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        ".ah-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      )
        .fromTo(
          words,
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.3,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.5"
        )
        .fromTo(
          ".ah-lede",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
          "-=0.85"
        )
        .fromTo(
          ".ah-meta > *",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out" },
          "-=0.7"
        );

      // The plate settles out of an overscale as the masthead scrolls away,
      // which keeps the dark band alive without a second trigger.
      gsap.fromTo(
        ".ah-plate-img",
        { scale: 1.14 },
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

      gsap.to(".ah-veil", {
        opacity: 0.86,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[clamp(34rem,82vh,46rem)] items-end overflow-hidden bg-[#0b0d12] text-[#f4f2ee]"
    >
      <div className="absolute inset-0">
        <Image
          src={FACADES.phase7Curtain.src}
          alt={FACADES.phase7Curtain.alt}
          fill
          priority
          sizes="100vw"
          className="ah-plate-img object-cover"
          style={{ objectPosition: "center 42%" }}
        />
        <div className="ah-veil absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-[rgba(11,13,18,0.72)] to-[rgba(11,13,18,0.52)]" />
      </div>

      <div className="u-shell relative w-full pb-[clamp(3.5rem,8vh,6rem)] pt-[clamp(8rem,18vh,12rem)]">
        <span className="ah-eyebrow block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
          About Us · The Atelier
        </span>

        <h1 className="ah-head mt-8 max-w-4xl font-serif text-[clamp(2.3rem,5.4vw,4.6rem)] font-light leading-[1.1] tracking-[-0.01em]">
          Builders of landmarks, and of the quiet that lives inside them.
        </h1>

        <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-20">
          <p className="ah-lede col-span-full max-w-xl text-[1.02rem] leading-[1.8] text-[rgba(244,242,238,0.74)] lg:col-span-5">
            JC Landmarks is an architecture, engineering and construction
            practice. We draw a residence, we calculate it, and we build it with
            our own site teams — one continuous responsibility from first survey
            to handover.
          </p>

          <dl className="ah-meta col-span-full grid grid-cols-2 gap-x-8 gap-y-8 self-end lg:col-span-5 lg:col-start-8 lg:grid-cols-3">
            {[
              ["Founded", "2009"],
              ["Discipline", "Design · Build"],
              ["Practice", "Lahore, PK"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.62rem] uppercase tracking-[0.2em] text-[rgba(244,242,238,0.44)]">
                  {k}
                </dt>
                <dd className="mt-3 font-serif text-[1.15rem] font-light text-[#f4f2ee]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
