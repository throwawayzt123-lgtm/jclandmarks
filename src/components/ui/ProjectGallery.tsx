"use client";

import Image from "next/image";
import { useState } from "react";
import PhotoViewer from "@/components/ui/PhotoViewer";
import type { Shot } from "@/lib/portfolio";

/**
 * PROJECT GALLERY — a grid of photographs that each open full screen.
 *
 * Click (or press Enter on) any photograph to see it whole, on black, with its
 * title and a short description beneath. Arrow keys, the side buttons or a
 * swipe move between photographs; Esc, the close button or a click on the
 * empty black closes it and returns focus to the photograph that was opened.
 *
 * The caption sits below the picture in its own band, never over it.
 */
interface ProjectGalleryProps {
  shots: Shot[];
  /** Used to name the viewer for screen readers. */
  name: string;
}

export default function ProjectGallery({ shots, name }: ProjectGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const total = shots.length;

  return (
    <>
      <ul className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {shots.map((g, i) => {
          const wide = i % 3 === 2;
          return (
            <li key={g.src} className={wide ? "sm:col-span-2" : undefined}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View ${g.title} full screen`}
                className="group block w-full cursor-zoom-in text-left outline-none"
              >
                <div data-r="plate" className={`relative overflow-hidden bg-[#000000] ${wide ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
                  <div data-r-img className="absolute inset-0">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes={wide ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                      loading="lazy"
                      className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                      style={{ objectPosition: g.position ?? "center" }}
                    />
                  </div>
                  {/* Expand mark — always there on touch screens, on hover for a mouse */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white opacity-100 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 lg:opacity-0"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 2h4v4M6 14H2v-4M14 2 9.5 6.5M2 14l4.5-4.5" />
                    </svg>
                  </span>
                </div>
                <span className="mt-4 flex items-baseline justify-between gap-6">
                  <span className="font-serif text-[1.2rem] font-light leading-[1.2] text-[#11141b] transition-colors duration-500 group-hover:text-[#b58c49] group-focus-visible:text-[#b58c49]">
                    {g.title}
                  </span>
                  <span className="shrink-0 text-[0.6rem] tabular-nums tracking-[0.24em] text-[#8a8f9a]">
                    {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open !== null && <PhotoViewer shots={shots} index={open} name={name} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
