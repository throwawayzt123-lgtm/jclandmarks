"use client";

import Image from"next/image";
import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { FACADES, INTERIORS, type Still } from"@/lib/media";
import MagneticButton from"@/components/ui/MagneticButton";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * CAPABILITIES — a pinned card relay.
 *
 * One hero card holds the stage. As the pinned section is scrolled, the
 * outgoing card shrinks away to a thumbnail parked top-left while the next
 * one grows from a thumbnail at bottom-right into the hero slot, its copy
 * cross-fading alongside. A [ 01/04 ] counter tracks position.
 *
 * Everything is scrubbed from a single ScrollTrigger and animated on
 * transform/opacity only. The active index is React state, but it changes
 * once per slide — never per frame.
 */

interface Capability {
 index: string;
 title: string;
 body: string;
 still: Still;
}

const CAPABILITIES: Capability[] = [
  {
 index:"01",
 title:"Earthworks",
 body:"Site preparation, deep excavation, shoring and grading — set out and levelled before a single foundation is poured.",
 still: FACADES.prismMonolith,
  },
  {
 index:"02",
 title:"Structure",
 body:"Reinforced concrete frames, cantilevers and steel connections, engineered in-house and cast on site.",
 still: FACADES.phase7Villa,
  },
  {
 index:"03",
 title:"Envelope",
 body:"Unitised glazing, dry-clad stone and weatherproofing — the line where the building meets the weather.",
 still: FACADES.phase7Curtain,
  },
  {
 index:"04",
 title:"Fit-Out",
 body:"Joinery, stone setting, services coordination and final finishes, delivered turnkey by our own trades.",
 still: INTERIORS.loungeDoubleHeight,
  },
];

/** Viewport heights of scroll consumed per slide. */
const SLIDE_VH = 1.1;

export default function Capabilities() {
 const rootRef = useRef<HTMLElement>(null);
 const [active, setActive] = useState(0);
 const activeRef = useRef(0);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root) return;

 const cards = gsap.utils.toArray<HTMLElement>(".cap-card", root);
 const copies = gsap.utils.toArray<HTMLElement>(".cap-copy", root);

 if (prefersReducedMotion()) {
      // No pin, no relay: a plain stacked list that reads top to bottom.
 cards.forEach((c) => {
 c.style.position ="relative";
 c.style.opacity ="1";
 c.style.transform ="none";
      });
 copies.forEach((c) => {
 c.style.position ="relative";
 c.style.opacity ="1";
      });
 root.classList.add("cap-static");
 return;
    }

 const ctx = gsap.context(() => {
 const stage = root.querySelector<HTMLElement>(".cap-stage");
 if (!stage) return;
 const n = cards.length;

      /**
       * Lay out one card for a given"distance from active".
       * d <  0  → already seen: parked small, top-left
       * d == 0  → the hero slot
       * d >  0  → upcoming: waiting small, bottom-right
       * Fractional d is what produces the scrubbed in-between states.
       */
 const place = (el: HTMLElement, d: number) => {
 const t = gsap.utils.clamp(-1, 1, d);
 const away = Math.abs(t);
        // Hero at scale 1; parked cards shrink to a thumbnail.
 const scale = gsap.utils.interpolate(1, 0.16, away);
        // Absolute pixel travel: percentage offsets are relative to a box the
        // scale is simultaneously shrinking, which made parked cards land
        // thousands of px off-screen. Pixels stay predictable.
 const box = el.getBoundingClientRect();
 const reach = Math.max(box.width, 1) / Math.max(scale, 0.01);
 const px = t < 0 ? -reach * 0.42 : reach * 0.4;
 const py = t < 0 ? -reach * 0.3 : reach * 0.26;
 gsap.set(el, {
 x: px * away,
 y: py * away,
 scale,
 opacity: away > 0.96 ? 0 : 1,
 zIndex: Math.round((1 - away) * 100),
        });
      };

 cards.forEach((el, i) => place(el, i));
 copies.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));

 const state = { pos: 0 };

 gsap.to(state, {
 pos: n - 1,
 ease:"none",
 scrollTrigger: {
 trigger: root,
 pin: stage,
 start:"top top",
 end: () => `+=${window.innerHeight * SLIDE_VH * (n - 1)}`,
 scrub: 0.8,
 anticipatePin: 1,
 invalidateOnRefresh: true,
        },
 onUpdate: () => {
 const p = state.pos;
 cards.forEach((el, i) => place(el, i - p));

          // Copy belongs to whichever slide is nearest; cross-fade between.
 copies.forEach((el, i) => {
 const d = Math.abs(i - p);
            // Opaque only very near its own slide; fully clear well before
            // the neighbour arrives, so two headings never co-exist.
 const o = d < 0.18 ? 1 : Math.max(0, 1 - (d - 0.18) * 4.2);
 el.style.opacity = String(o);
 el.style.transform = `translateY(${(i - p) * 26}px)`;
            // Keep faded copy out of hit-testing and the a11y tree.
 el.style.pointerEvents = o > 0.9 ?"auto" :"none";
          });

 const idx = Math.round(p);
 if (idx !== activeRef.current) {
 activeRef.current = idx;
 setActive(idx);
          }
        },
      });
    }, root);

 return () => ctx.revert();
  }, []);

 const total = String(CAPABILITIES.length).padStart(2,"0");

 return (
    <section
 ref={rootRef}
 id="capabilities"
 className="relative bg-[#ffffff] text-[#11141b]"
    >
      <div className="cap-stage relative h-[100svh] overflow-hidden">
        <div className="u-shell grid h-full items-center gap-8 lg:grid-cols-12 lg:gap-x-16">
          {/* ---- Card stage ---- */}
          <div className="relative col-span-full h-[52vh] lg:col-span-7 lg:h-[72vh]">
            {CAPABILITIES.map((c) => (
              <figure
 key={c.index}
 className="cap-card absolute inset-0 overflow-hidden shadow-[0_30px_80px_-30px_rgba(17,20,27,0.45)] will-change-transform"
              >
                <Image
 src={c.still.src}
 alt={c.still.alt}
 fill
 sizes="(max-width: 1024px) 100vw, 58vw"
 loading="lazy"
 className="object-cover"
 style={{ objectPosition: c.still.position ??"center" }}
                />
              </figure>
            ))}
          </div>

          {/* ---- Copy column ---- */}
          <div className="relative col-span-full lg:col-span-4 lg:col-start-9">
            <span className="block font-mono text-[0.72rem] tracking-[0.42em] text-[#9a8f7d]">
 [ {CAPABILITIES[active].index}/{total} ]
            </span>

            {/* Each slide's copy is stacked and cross-faded in place. */}
            <div className="relative mt-5 min-h-[11rem]">
              {CAPABILITIES.map((c) => (
                <div
 key={c.index}
 className="cap-copy absolute inset-x-0 top-0"
 aria-hidden={CAPABILITIES[active].index !== c.index}
                >
                  <h3 className="text-[clamp(1.9rem,3.6vw,3.1rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-[#11141b]">
                    {c.title}
                  </h3>
                  <p className="mt-5 max-w-sm text-[0.98rem] leading-relaxed text-[#3b4150]">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <MagneticButton href="/services">Learn more</MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
