"use client";

import Image from"next/image";
import { useLayoutEffect, useRef, useState } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { FACADES, INTERIORS, type Still } from"@/lib/media";

/**
 * PRIVATE AMENITIES — a pinned horizontal gallery.
 *
 * The section pins and the track translates sideways as the page is scrolled,
 * so vertical scroll reads as lateral travel through the rooms. Each card
 * carries its own number, tag, title and spec line; a progress rail and
 * counter track position.
 *
 * Replaces a vertical stack that was tall, static and buried the imagery.
 * Everything animates on transform only, driven by one ScrollTrigger.
 */

interface Amenity {
 tag: string;
 title: string;
 note: string;
 spec: string;
 still: Still;
}

const AMENITIES: Amenity[] = [
  {
 tag:"Master Sanctuary",
 title:"Executive Master Suite",
 note:"Upper Sanctuary",
 spec:"Floating bed platform · Fluted millwork · Warm pendants",
 still: INTERIORS.bedMaster,
  },
  {
 tag:"Acoustic Cinema",
 title:"Private Cinema & Media Salon",
 note:"Lower Ground",
 spec:"Acoustic slat panelling · Concealed LED · Reclining lounge",
 still: INTERIORS.mediaAcoustic,
  },
  {
 tag:"Wellness Wing",
 title:"Guest Wellness Sanctuary",
 note:"Private Wing",
 spec:"Feature wall · Soft ambient lighting · En-suite bath",
 still: INTERIORS.bedGuest,
  },
  {
 tag:"Tasting Salon",
 title:"Fireside Library & Tasting",
 note:"Ground Level",
 spec:"Backlit shelving · Sommelier bar · Intimate fireplace",
 still: INTERIORS.libraryFireside,
  },
  {
 tag:"Great Salon",
 title:"Grand Entertaining Salon",
 note:"Main Level",
 spec:"Double-height proportions · Sculptural seating · Travertine",
 still: INTERIORS.loungeDoubleHeight,
  },
  {
 tag:"Water Cascades",
 title:"Reflection Water Court",
 note:"Ground Level",
 spec:"Illuminated cascades · Cantilevered canopies · Reflection basins",
 still: FACADES.phase7Villa,
  },
];

export default function Amenities() {
 const rootRef = useRef<HTMLElement>(null);
 const trackRef = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(0);
 const activeRef = useRef(0);

 useLayoutEffect(() => {
 const root = rootRef.current;
 const track = trackRef.current;
 if (!root || !track) return;

 if (prefersReducedMotion()) {
      // No pin, no lateral travel: let the track scroll natively so the
      // whole gallery stays reachable by keyboard and touch.
 track.style.transform ="none";
 root.classList.add("am-static");
 return;
    }

 const ctx = gsap.context(() => {
 const stage = root.querySelector<HTMLElement>(".am-stage");
 const bar = root.querySelector<HTMLElement>(".am-bar");
 if (!stage) return;

      /** Distance the track must travel to reveal its right edge. */
 const distance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 64);

 gsap.to(track, {
 x: () => -distance(),
 ease:"none",
 scrollTrigger: {
 trigger: root,
 pin: stage,
 start:"top top",
 end: () => `+=${distance()}`,
 scrub: 0.9,
 anticipatePin: 1,
 invalidateOnRefresh: true,
 onUpdate: (self) => {
 if (bar) bar.style.transform = `scaleX(${self.progress})`;
 const idx = Math.min(
              AMENITIES.length - 1,
              Math.round(self.progress * (AMENITIES.length - 1))
            );
 if (idx !== activeRef.current) {
 activeRef.current = idx;
 setActive(idx);
            }
          },
        },
      });
    }, root);

 return () => ctx.revert();
  }, []);

 const total = String(AMENITIES.length).padStart(2,"0");

 return (
    <section
 ref={rootRef}
 id="amenities"
 className="relative bg-[#11141b] text-[#f4f1ea]"
    >
      <div className="am-stage relative flex h-[100svh] flex-col overflow-hidden">
        {/* ---- Heading rail ---- */}
        <div className="u-shell relative z-20 flex shrink-0 items-end justify-between gap-6 pt-[calc(var(--nav-h)+1.5rem)] pb-6">
          <div>
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#D8B479]">
              Private Amenities
            </span>
            <h2 className="u-display mt-3 text-[clamp(1.9rem,3.6vw,3.2rem)] font-light leading-[1.05] text-[#f4f1ea]">
              Every appointment,{""}
              <em className="font-serif italic text-[#D8B479]">
 a private resort.
              </em>
            </h2>
          </div>

          <span className="hidden shrink-0 font-mono text-[0.72rem] tracking-[0.3em] text-[rgba(244,241,234,0.5)] sm:block">
            {String(active + 1).padStart(2,"0")} / {total}
          </span>
        </div>

        {/* ---- Horizontal track ---- */}
        <div className="relative min-h-0 flex-1">
          <div
 ref={trackRef}
 className="am-track absolute inset-y-0 left-0 flex items-center gap-5 pl-[var(--gutter)] pr-16 will-change-transform sm:gap-7"
          >
            {AMENITIES.map((a, i) => (
              <article
 key={a.tag}
 className="group relative h-[78%] w-[72vw] shrink-0 overflow-hidden sm:w-[46vw] lg:w-[30vw]"
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
 src={a.still.src}
 alt={a.still.alt}
 fill
 sizes="(max-width: 640px) 76vw, (max-width: 1024px) 52vw, 34vw"
 loading="lazy"
 className="object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
 style={{ objectPosition: a.still.position ??"center" }}
                  />

                  {/* Grade so the caption always reads over the photograph. */}
                  <span
 aria-hidden="true"
 className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,20,27,0.92)_0%,rgba(17,20,27,0.35)_42%,rgba(17,20,27,0)_68%)]"
                  />

                  {/* Index, top-left. */}
                  <span className="absolute left-5 top-5 font-mono text-[0.7rem] tracking-[0.26em] text-[rgba(244,241,234,0.75)]">
                    {String(i + 1).padStart(2,"0")}
                  </span>

                  {/* Level, top-right. */}
                  <span className="absolute right-5 top-5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#D8B479]">
                    {a.note}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#D8B479]">
                      {a.tag}
                    </span>
                    <h3 className="u-display mt-2 text-[1.35rem] font-light leading-tight text-[#f4f1ea] sm:text-[1.6rem]">
                      {a.title}
                    </h3>
                    <p className="mt-2.5 text-[0.78rem] leading-relaxed text-[rgba(244,241,234,0.72)]">
                      {a.spec}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ---- Progress rail ---- */}
        <div className="u-shell relative z-20 flex shrink-0 items-center gap-5 pb-9 pt-5">
          <span className="relative h-px flex-1 bg-[rgba(244,241,234,0.16)]">
            <span className="am-bar absolute inset-0 origin-left scale-x-0 bg-[#D8B479]" />
          </span>
          <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(244,241,234,0.45)]">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
