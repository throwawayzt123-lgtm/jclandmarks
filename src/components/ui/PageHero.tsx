"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import type { Still } from "@/lib/media";
import type { DrawingKind, Fact } from "@/lib/portfolio";
import DrawingPlate from "@/components/ui/DrawingPlate";

import Link from "next/link";
/**
 * The dark masthead shared by every inner page — the same opening note as
 * the homepage hero and the About and Services mastheads, resolving into paper
 * below. Optional breadcrumb, backdrop (photo or drawing) and fact row.
 */
interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Italic gold tail appended to the title. */
  accent?: string;
  lede?: string;
  crumbs?: Crumb[];
  still?: Still;
  drawing?: DrawingKind;
  facts?: Fact[];
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, accent, lede, crumbs, still, drawing, facts, children }: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".ph-title"));
      const accentWords = splitWords(root.querySelector(".ph-accent"));
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(".ph-top > *", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: "power3.out" })
        .fromTo(
          [...words, ...accentWords],
          { yPercent: 118, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.05, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(".ph-after > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: "power3.out" }, "-=0.85");

      gsap.fromTo(
        ".ph-bg",
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const hasBackdrop = Boolean(still || drawing);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[clamp(30rem,72vh,42rem)] items-end overflow-hidden bg-[#0b0d12] text-[#f4f2ee]"
    >
      {hasBackdrop && (
        <div aria-hidden="true" className="ph-bg absolute inset-0">
          {still ? (
            <Image
              src={still.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: still.position ?? "center" }}
            />
          ) : (
            <DrawingPlate kind={drawing} className="absolute inset-0 opacity-70" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(11,13,18,0.94)_0%,rgba(11,13,18,0.74)_48%,rgba(11,13,18,0.42)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0d12] to-transparent" />
        </div>
      )}

      <div className="u-shell relative w-full pb-[clamp(3.5rem,8vh,6rem)] pt-[clamp(8rem,18vh,12rem)]">
        <div className="ph-top">
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.5)]">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-[rgba(244,242,238,0.3)]" />}
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-[#D8B479]">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-[rgba(244,242,238,0.8)]">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">{eyebrow}</span>
        </div>

        <h1 className="mt-8 max-w-4xl font-serif text-[clamp(2.2rem,5vw,4.3rem)] font-light leading-[1.1] tracking-[-0.01em]">
          <span className="ph-title">{title}</span>
          {accent && (
            <>
              {" "}
              <em className="ph-accent italic text-[#D8B479]">{accent}</em>
            </>
          )}
        </h1>

        <div className="ph-after">
          {lede && (
            <p className="mt-8 max-w-xl text-[1.02rem] leading-[1.8] text-[rgba(244,242,238,0.72)]">{lede}</p>
          )}
          {facts && facts.length > 0 && (
            <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.44)]">{f.label}</dt>
                  <dd className="mt-2.5 font-serif text-[1.12rem] font-light text-[#f4f2ee]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
