"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";

/**
 * SERVICES — 01 COMMERCIAL CONSTRUCTION
 *
 * Set as a drawing sheet rather than a photo spread. There is no commercial
 * photography in the library yet, and a house dressed up as an office would
 * undercut the whole page — so the section leans on what the practice
 * actually produces first: the drawing. A front elevation draws itself line
 * by line as the sheet is scrolled, on a faint drafting grid.
 *
 * Every drawable path carries pathLength="1", so one dash value (1) covers any
 * path regardless of its real length and the draw needs no paid plugin.
 */
const SECTORS = [
  { name: "Corporate Offices", note: "Headquarters, floor plates and executive suites" },
  { name: "Retail & Showrooms", note: "Street-front glazing and double-height display halls" },
  { name: "Hospitality", note: "Restaurants, boutique hotels and banqueting" },
  { name: "Mixed-Use Plazas", note: "Retail podiums with offices or apartments above" },
];

const DELIVERY = [
  { no: "01", title: "Design & Build", body: "One contract for drawings, approvals and construction, so cost and programme are owned by a single party." },
  { no: "02", title: "General Contracting", body: "Built to your architect's drawings, with our engineers checking constructability before work starts." },
  { no: "03", title: "Structural Frame", body: "RCC and steel frames, post-tensioned slabs and long clear spans for open, flexible floors." },
  { no: "04", title: "Facade Systems", body: "Curtain wall, stone cladding and louvre screens, detailed and installed by our own teams." },
  { no: "05", title: "MEP Coordination", body: "Services coordinated in the drawings, not on site, so ceilings close up without surprises." },
  { no: "06", title: "Fit-Out", body: "Shell to occupied space: partitions, ceilings, joinery and finishes on the same programme." },
];

/* ---- Elevation geometry (viewBox 0 0 480 560) ---- */
const TOWER_FLOORS = [380, 330, 280, 230, 180];
const MULLIONS = [160, 200, 240, 280, 320];
const AXES: Array<[string, number]> = [["A", 60], ["B", 120], ["C", 240], ["D", 360], ["E", 420]];
const LEVELS: Array<[string, number]> = [["+0.00", 520], ["+9.00", 430], ["+24.00", 280], ["+39.00", 130]];

export default function ServiceCommercial() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".sc-head"));
      gsap.fromTo(
        words,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: { trigger: ".sc-head", start: revealStart("top 85%"), once: true },
        }
      );

      gsap.fromTo(
        ".sc-lede",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sc-head", start: revealStart("top 80%"), once: true },
        }
      );

      /* ---- The elevation draws itself, scrubbed to the sheet ---- */
      const draw = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".sc-sheet",
          start: revealStart("top 82%", "top 92%"),
          // Finish while the whole sheet is still on screen, so the completed
          // elevation is actually seen in one view.
          end: () => (window.matchMedia("(max-width: 1023px)").matches ? "bottom 85%" : "bottom 92%"),
          scrub: 0.8,
        },
      });

      const stroke = (sel: string) => root.querySelectorAll(sel);
      draw
        .fromTo(stroke(".bp-axis"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08 })
        .fromTo(stroke(".bp-ground"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6 }, "<0.2")
        .fromTo(stroke(".bp-mass"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.25 })
        .fromTo(stroke(".bp-floor"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.12 }, "-=0.4")
        .fromTo(stroke(".bp-mullion"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, "-=0.3")
        .fromTo(stroke(".bp-detail"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.1 })
        .fromTo(stroke(".bp-dim"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5 })
        .fromTo(stroke(".bp-label"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.05 }, "-=0.3")
        .fromTo(stroke(".bp-glaze"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, "<");

      /* ---- Sector rows and delivery grid ---- */
      gsap.utils.toArray<HTMLElement>(".sc-sector").forEach((row) => {
        gsap.fromTo(
          row.querySelector(".sc-sector-rule"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power3.inOut", scrollTrigger: { trigger: row, start: revealStart("top 90%"), once: true } }
        );
        gsap.fromTo(
          row.querySelectorAll(".sc-fade"),
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: row, start: revealStart("top 88%"), once: true } }
        );
      });

      gsap.fromTo(
        ".sc-cell",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: { each: 0.09, grid: "auto", from: "start" },
          ease: "power3.out",
          scrollTrigger: { trigger: ".sc-grid", start: revealStart("top 82%"), once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="commercial"
      data-chapter="0"
      className="relative overflow-hidden bg-[#0b0d12] py-[clamp(6rem,15vh,11rem)] text-[#f4f2ee]"
    >
      {/* Drafting grid, faded at the edges so it never reads as a pattern fill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(216,180,121,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(216,180,121,0.055) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 65% 45%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 65% 45%, #000 20%, transparent 75%)",
        }}
      />

      <div className="u-shell relative">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
          01 · Commercial Construction
        </span>

        <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-20">
          <h2 className="sc-head col-span-full font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em] lg:col-span-7">
            Buildings that work as hard as the businesses inside them.
          </h2>
          <p className="sc-lede col-span-full max-w-md text-[0.98rem] leading-[1.8] text-[rgba(244,242,238,0.66)] lg:col-span-4 lg:col-start-9 lg:pt-3">
            Commercial work is judged on programme, cost certainty and how the
            building performs the day it opens. We engineer and build to all
            three, under one contract.
          </p>
        </div>

        <div className="mt-[clamp(4rem,10vh,7rem)] grid gap-y-16 lg:grid-cols-12 lg:gap-x-20">
          {/* Sectors */}
          <div className="col-span-full lg:col-span-5">
            <span className="block text-[0.62rem] uppercase tracking-[0.26em] text-[rgba(244,242,238,0.44)]">
              Sectors we build for
            </span>
            <ul className="mt-8">
              {SECTORS.map((s) => (
                <li key={s.name} className="sc-sector relative py-7">
                  <span aria-hidden="true" className="sc-sector-rule absolute inset-x-0 top-0 block h-px origin-left bg-[rgba(244,242,238,0.13)]" />
                  <span className="sc-fade block font-serif text-[clamp(1.3rem,2vw,1.7rem)] font-light leading-[1.2]">
                    {s.name}
                  </span>
                  <span className="sc-fade mt-2 block text-[0.9rem] leading-[1.7] text-[rgba(244,242,238,0.56)]">
                    {s.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Drawing sheet */}
          <figure className="sc-sheet col-span-full lg:col-span-6 lg:col-start-7">
            <div className="relative bg-[rgba(244,242,238,0.025)] p-5 shadow-[inset_0_0_0_1px_rgba(216,180,121,0.12)] sm:p-8">
              <svg
                viewBox="0 0 480 560"
                className="mx-auto block h-auto w-full lg:max-h-[64vh]"
                role="img"
                aria-label="Front elevation drawing of a mid-rise commercial building with a two-level podium and curtain-wall tower"
                fill="none"
                strokeLinecap="square"
              >
                {/* Grid axes with bubbles */}
                {AXES.map(([label, x]) => (
                  <g key={label} className="bp-axis" stroke="rgba(216,180,121,0.32)" strokeWidth="0.6">
                    <line x1={x} y1={58} x2={x} y2={540} strokeDasharray="6 5" />
                    <circle cx={x} cy={42} r={10} />
                    <text x={x} y={46} textAnchor="middle" fill="rgba(216,180,121,0.8)" stroke="none" fontSize="10" fontFamily="var(--font-body)">
                      {label}
                    </text>
                  </g>
                ))}

                {/* Glazing tint on the tower — fades in once the frame is drawn */}
                <rect className="bp-glaze" x="120" y="130" width="240" height="300" fill="rgba(216,180,121,0.05)" />

                <g stroke="#f4f2ee" strokeWidth="1.4">
                  <path className="bp-ground" pathLength={1} d="M28 520 H426" />
                  {/* Podium, tower, crown */}
                  <path className="bp-mass" pathLength={1} d="M60 520 V430 H420 V520" />
                  <path className="bp-mass" pathLength={1} d="M120 430 V130 H360 V430" />
                  <path className="bp-mass" pathLength={1} d="M150 130 V100 H330 V130" />
                </g>

                <g stroke="rgba(244,242,238,0.62)" strokeWidth="0.8">
                  <path className="bp-floor" pathLength={1} d="M60 475 H420" />
                  {TOWER_FLOORS.map((y) => (
                    <path key={y} className="bp-floor" pathLength={1} d={`M120 ${y} H360`} />
                  ))}
                </g>

                <g stroke="rgba(244,242,238,0.34)" strokeWidth="0.6">
                  {MULLIONS.map((x) => (
                    <path key={x} className="bp-mullion" pathLength={1} d={`M${x} 430 V130`} />
                  ))}
                </g>

                <g stroke="#D8B479" strokeWidth="1">
                  {/* Entrance canopy and door frame */}
                  <path className="bp-detail" pathLength={1} d="M196 488 H284" />
                  <path className="bp-detail" pathLength={1} d="M215 520 V488 M265 488 V520 M240 488 V520" />
                  {/* Roof plant screen */}
                  <path className="bp-detail" pathLength={1} d="M200 100 V84 H280 V100" />
                </g>

                {/* Height dimension */}
                <g stroke="rgba(216,180,121,0.7)" strokeWidth="0.7">
                  <path className="bp-dim" pathLength={1} d="M34 130 V520 M28 130 H40 M28 520 H40" />
                </g>

                {/* Level markers */}
                {LEVELS.map(([label, y]) => (
                  <g key={label} className="bp-label">
                    <path d={`M430 ${y} l6 -6 l6 6 z`} fill="rgba(216,180,121,0.85)" />
                    <text x={448} y={y + 3} fill="rgba(244,242,238,0.66)" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.5">
                      {label}
                    </text>
                  </g>
                ))}
                <text className="bp-label" x={22} y={330} fill="rgba(216,180,121,0.85)" fontSize="9" fontFamily="var(--font-body)" transform="rotate(-90 22 330)" textAnchor="middle">
                  39.00 m
                </text>
              </svg>

              {/* Title block */}
              <figcaption className="mt-6 grid grid-cols-2 gap-y-3 pt-5 text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(244,242,238,0.5)] shadow-[inset_0_1px_0_rgba(216,180,121,0.14)] sm:grid-cols-4">
                <span>JC Landmarks</span>
                <span>Sheet C-201</span>
                <span>Front elevation</span>
                <span className="sm:text-right">Not to scale</span>
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Delivery */}
        <div className="mt-[clamp(5rem,12vh,8rem)]">
          <span className="block text-[0.62rem] uppercase tracking-[0.26em] text-[rgba(244,242,238,0.44)]">
            How we deliver
          </span>
          <div className="sc-grid mt-10 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERY.map((d) => (
              <article key={d.no} className="sc-cell">
                <span className="block h-px w-10 bg-[#D8B479]" aria-hidden="true" />
                <span className="mt-6 block font-serif text-[0.95rem] font-light text-[#D8B479]">{d.no}</span>
                <h3 className="mt-2 font-serif text-[clamp(1.3rem,1.9vw,1.6rem)] font-light leading-[1.22]">{d.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-[1.8] text-[rgba(244,242,238,0.6)]">{d.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
