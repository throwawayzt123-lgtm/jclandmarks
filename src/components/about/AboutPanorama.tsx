"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { PANORAMAS } from "@/lib/media";

/**
 * ABOUT — STEP INSIDE
 *
 * A wide plate of the panorama that drifts slowly sideways, hinting that
 * there is more to see. Clicking it opens the full-screen viewer, whose code
 * and full-size photo are only fetched at that moment.
 */
const loadViewer = () => import("@/components/ui/PanoramaViewer");
const PanoramaViewer = dynamic(loadViewer, { ssr: false });

type Pano = (typeof PANORAMAS)[keyof typeof PANORAMAS];

interface AboutPanoramaProps {
  pano?: Pano;
  id?: string;
  eyebrow?: string;
  /** Plain lead-in, then the italic gold tail of the heading. */
  heading?: [string, string];
  intro?: string;
  /** Section ground, and the plate's shape (wider for very wide photos). */
  bg?: string;
  plateClass?: string;
}

export default function AboutPanorama({
  pano: PANO = PANORAMAS.livingRoom,
  id = "step-inside",
  eyebrow = "Step Inside",
  heading = ["Look around one of ", "our interiors."],
  intro = "Open the panorama and turn around the room as if you were standing in it — drag, pinch to zoom, or move your phone.",
  bg = "bg-[#ffffff]",
  plateClass = "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]",
}: AboutPanoramaProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        splitWords(root.querySelector(".pn-head")),
        { yPercent: 118, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.045, ease: "power4.out", scrollTrigger: { trigger: ".pn-head", start: revealStart("top 85%"), once: true } }
      );
      gsap.fromTo(
        ".pn-fade",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".pn-head", start: revealStart("top 85%"), once: true } }
      );
      gsap.fromTo(
        ".pn-plate",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: ".pn-plate", start: revealStart("top 88%"), once: true } }
      );
      gsap.fromTo(
        ".pn-img",
        { scale: 1.18 },
        { scale: 1, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: ".pn-plate", start: revealStart("top 88%"), once: true } }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id={id} className={`relative ${bg} pb-[clamp(6rem,15vh,11rem)] text-[#11141b]`}>
      <div className="u-shell">
        <div className="grid items-end gap-y-6 lg:grid-cols-12 lg:gap-x-16">
          <div className="col-span-full lg:col-span-7">
            <span className="pn-fade block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">{eyebrow}</span>
            <h2 className="pn-head mt-8 max-w-2xl font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em]">
              {heading[0]}<em className="italic text-[#b58c49]">{heading[1]}</em>
            </h2>
          </div>
          <p className="pn-fade col-span-full max-w-md text-[0.95rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9">
            {intro}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          onPointerEnter={() => void loadViewer()}
          onFocus={() => void loadViewer()}
          aria-label={`Open the panorama: ${PANO.title}`}
          className={`pn-plate group relative mt-[clamp(3rem,7vh,4.5rem)] block w-full cursor-pointer overflow-hidden bg-[#000000] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b58c49] ${plateClass}`}
        >
          <div className="pn-img absolute inset-0">
            <div className="u-pan absolute inset-y-0 left-0 w-[130%]">
              <Image
                src={PANO.src}
                alt={PANO.alt}
                fill
                sizes="130vw"
                loading="lazy"
                className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Scrim so the invitation reads on any photo */}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.78)] via-[rgba(0,0,0,0.22)] to-transparent" />

          <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-[clamp(1.25rem,3vw,2.5rem)] text-[#f4f2ee]">
            <span>
              <span className="flex items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#D8B479]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <ellipse cx="12" cy="12" rx="10" ry="4" />
                  <path d="M12 2v20" strokeDasharray="1.5 2" />
                  <path d="M19 9.2l2.6 2.8-3.4 1" />
                </svg>
                Panoramic view
              </span>
              <span className="mt-3 block font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-none">{PANO.title}</span>
            </span>

            <span className="flex items-center gap-5 text-[0.68rem] font-medium uppercase tracking-[0.26em]">
              Step inside
              <span aria-hidden="true" className="flex items-center">
                <span className="block h-px w-12 bg-[#D8B479] transition-[width] duration-500 ease-[var(--ease-luxe)] group-hover:w-24" />
                <span className="-ml-[5px] block h-[8px] w-[8px] rotate-45 border-r border-t border-[#D8B479]" />
              </span>
            </span>
          </span>
        </button>
      </div>

      {open && <PanoramaViewer pano={PANO} onClose={() => setOpen(false)} />}
    </section>
  );
}
