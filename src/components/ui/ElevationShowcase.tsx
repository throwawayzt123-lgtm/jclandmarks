"use client";

import Image from "next/image";
import { useState } from "react";
import RevealScope from "@/components/ui/RevealScope";
import PhotoViewer from "@/components/ui/PhotoViewer";
import type { Elevation } from "@/lib/portfolio";

/**
 * ELEVATIONS — a plain grid of front elevations.
 *
 * One photograph per home, with its plot name and the few facts we hold
 * beneath it. No story, because there isn't one yet — these are elevations,
 * not finished projects. Selecting any photograph opens it full screen in the
 * shared viewer.
 */
interface ElevationShowcaseProps {
  items: Elevation[];
}

export default function ElevationShowcase({ items }: ElevationShowcaseProps) {
  const [open, setOpen] = useState<number | null>(null);
  const shots = items.map((e) => e.image);

  return (
    <RevealScope as="section" id="elevations" className="bg-[#ffffff] pb-[clamp(6rem,14vh,10rem)] text-[#11141b]">
      <div className="u-shell">
        <div className="grid items-end gap-y-6 lg:grid-cols-12 lg:gap-x-16">
          <div className="col-span-full lg:col-span-7">
            <span data-r="up" className="block text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
              More Residences
            </span>
            <h2 data-r="words" className="mt-6 font-serif text-[clamp(1.8rem,3.4vw,2.8rem)] font-light leading-[1.16] tracking-[-0.01em]">
              Front elevations from our project list.
            </h2>
          </div>
          <p data-r="up" className="col-span-full max-w-md text-[0.95rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9">
            Homes from 5 marla to 2 kanal, in Lahore and Sheikhupura. Select an elevation to see it full size.
          </p>
        </div>

        <span data-r="rule" aria-hidden="true" className="mt-10 block h-px origin-left bg-[rgba(20,33,61,0.12)]" />

        <ul className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {items.map((e, i) => (
            <li key={e.plot}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View the ${e.plot} elevation full screen`}
                className="group block w-full cursor-zoom-in text-left outline-none"
              >
                <div data-r="plate" className="relative aspect-[4/3] overflow-hidden bg-[#000000]">
                  <div data-r-img className="absolute inset-0">
                    <Image
                      src={e.image.src}
                      alt={e.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                      style={{ objectPosition: e.image.position ?? "center" }}
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white opacity-100 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 lg:opacity-0"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 2h4v4M6 14H2v-4M14 2 9.5 6.5M2 14l4.5-4.5" />
                    </svg>
                  </span>
                </div>

                <div data-r="stagger" className="pt-5">
                  <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[#b58c49]">
                    {e.size} · {e.area}
                  </span>
                  <h3 className="mt-2.5 font-serif text-[clamp(1.3rem,1.9vw,1.6rem)] font-light leading-[1.2] transition-colors duration-500 group-hover:text-[#b58c49] group-focus-visible:text-[#b58c49]">
                    {e.plot}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-[1.7] text-[#6b7280]">
                    {e.style} elevation
                    {e.credit && <span className="block text-[#8a8f9a]">{e.credit}</span>}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open !== null && <PhotoViewer shots={shots} index={open} name="Residential elevations" onIndex={setOpen} onClose={() => setOpen(null)} />}
    </RevealScope>
  );
}
