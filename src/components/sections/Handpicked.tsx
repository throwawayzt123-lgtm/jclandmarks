"use client";

import Image from"next/image";
import { useLayoutEffect, useRef, useState } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { FACADES, INTERIORS, type Still } from"@/lib/media";

import Link from "next/link";
/**
 * OUR PROJECTS — a three-panel editorial showcase.
 *
 * A tall centre plate is flanked by two side plates cropped at the screen
 * edges, with an oversized serif title layered across the centre image.
 * Scroll advances the set; (1)(2)(3) pagination tracks position.
 *
 * Deliberately flat — no 3D rotation. Depth comes from the crop and the
 * title overlay, which is what gives the reference its editorial feel.
 */

interface Project {
 title: [string, string];
 body: string;
 centre: Still;
 left: Still;
 right: Still;
}

const PROJECTS: Project[] = [
  {
 title: ["Phase 7","Cantilever Villa"],
 body:"A 1-kanal residence built around a cantilevered upper floor, reflection terraces and full-height structural glazing.",
 centre: INTERIORS.loungeDoubleHeight,
 left: FACADES.phase7Villa,
 right: INTERIORS.diningGrand,
  },
  {
 title: ["464-D","Prism Monolith"],
 body:"Dry-clad charcoal stone over a reinforced concrete frame, with bronze louvres and a concealed services spine.",
 centre: INTERIORS.salonCurved,
 left: FACADES.prismMonolith,
 right: INTERIORS.staircaseCantilever,
  },
  {
 title: ["483-Y","Glass Curtain"],
 body:"Unitised curtain-wall glazing and travertine terraces, delivered turnkey from foundation to final finish.",
 centre: INTERIORS.atriumApex,
 left: FACADES.phase7Curtain,
 right: INTERIORS.foyerGallery,
  },
];

/** Viewport heights of scroll consumed per project. */
const SLIDE_VH = 1.15;

export default function Handpicked() {
 const rootRef = useRef<HTMLElement>(null);
 const [active, setActive] = useState(0);
 const activeRef = useRef(0);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root) return;

 const slides = gsap.utils.toArray<HTMLElement>(".pj-slide", root);

 if (prefersReducedMotion()) {
 slides.forEach((s) => {
 s.style.position ="relative";
 s.style.opacity ="1";
      });
 root.classList.add("pj-static");
 return;
    }

 const ctx = gsap.context(() => {
 const stage = root.querySelector<HTMLElement>(".pj-stage");
 if (!stage) return;
 const n = slides.length;

      // Only the active slide is visible; neighbours lift away and fade.
 const place = (el: HTMLElement, d: number) => {
 const away = Math.min(Math.abs(d), 1);
 gsap.set(el, {
 opacity: Math.max(0, 1 - away * 2.4),
 yPercent: d * -9,
 scale: 1 - away * 0.05,
 zIndex: away < 0.5 ? 2 : 1,
 pointerEvents: away < 0.3 ?"auto" :"none",
        });
      };

 slides.forEach((el, i) => place(el, i));

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
 slides.forEach((el, i) => place(el, i - p));
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

 return (
    <section
 ref={rootRef}
 id="handpicked"
 className="relative bg-[#15171a] text-[#f2f0ec]"
    >
      <div className="pj-stage relative h-[100svh] overflow-hidden">
        {/* ---- Section label + pagination ---- */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[var(--gutter)] pt-[calc(var(--nav-h)+1.75rem)]">
          <span className="font-serif text-[0.95rem] italic tracking-wide text-[#f2f0ec]">
            (Our Projects)
          </span>
          <div className="flex items-center gap-3 font-serif text-[0.9rem]">
            {PROJECTS.map((_, i) => (
              <span
 key={i}
 className={
 i === active
                    ?"text-[#f2f0ec]"
                    :"text-[rgba(242,240,236,0.32)]"
                }
              >
                ({i + 1})
              </span>
            ))}
          </div>
        </div>

        {/* ---- Slides ---- */}
        {PROJECTS.map((p, i) => (
          <article
 key={p.title.join("-")}
 className="pj-slide absolute inset-0 flex flex-col justify-center will-change-transform"
 aria-hidden={i !== active}
          >
            {/* Three-panel band */}
            <div className="relative mt-10 flex h-[56vh] items-center justify-center sm:h-[60vh]">
              {/* Left panel — cropped off the left edge. */}
              <div className="absolute left-0 top-1/2 hidden h-[62%] w-[14vw] -translate-y-1/2 overflow-hidden md:block">
                <Image
 src={p.left.src}
 alt={p.left.alt}
 fill
 sizes="14vw"
 loading="lazy"
 className="object-cover"
 style={{ objectPosition: p.left.position ??"center" }}
                />
              </div>

              {/* Centre plate — portrait, the hero of the composition. */}
              <div className="relative h-full w-[72vw] overflow-hidden sm:w-[46vw] lg:w-[30vw]">
                <Image
 src={p.centre.src}
 alt={p.centre.alt}
 fill
 sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 30vw"
 loading="lazy"
 className="object-cover"
 style={{ objectPosition: p.centre.position ??"center" }}
                />
              </div>

              {/* Right panel — cropped off the right edge. */}
              <div className="absolute right-0 top-1/2 hidden h-[62%] w-[14vw] -translate-y-1/2 overflow-hidden md:block">
                <Image
 src={p.right.src}
 alt={p.right.alt}
 fill
 sizes="14vw"
 loading="lazy"
 className="object-cover"
 style={{ objectPosition: p.right.position ??"center" }}
                />
              </div>

              {/* Oversized title, layered across the centre plate. */}
              <h2 className="pointer-events-none absolute inset-x-0 top-[8%] z-20 mx-auto w-[72vw] px-4 sm:w-[46vw] lg:w-[30vw] text-center font-serif text-[clamp(1.35rem,2.5vw,2.3rem)] font-normal uppercase leading-[1.06] tracking-[0.04em] text-[#f7f5f1] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
                {p.title[0]}
                <br />
                {p.title[1]}
              </h2>
            </div>

            {/* Description + CTA */}
            <div className="mt-8 flex flex-col items-center gap-5 px-[var(--gutter)] text-center sm:mt-10 sm:flex-row sm:justify-center sm:gap-10 sm:text-left">
              <p className="max-w-[22rem] text-[0.82rem] leading-relaxed text-[rgba(242,240,236,0.74)] sm:text-[0.9rem]">
                {p.body}
              </p>
              <Link
 href="/projects"
 className="shrink-0 shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] px-7 py-3 text-[0.68rem] tracking-[0.18em] uppercase text-[#f2f0ec] transition-colors duration-500 hover:border-[#f2f0ec] hover:bg-white hover:text-[#15171a]"
              >
                Learn more
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
