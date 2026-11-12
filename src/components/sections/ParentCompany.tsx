"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";
import { PARENT } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";

/**
 * PARENT GROUP — one slim black band above the footer.
 *
 * Left: the JUST & CONST mark, linking to the group's site. It tilts toward
 * the cursor and its ring of gold light quickens on hover.
 * Middle: "Part of the JUST & CONST group" and one line on what that means.
 * Right: the group's two disciplines as rows — hover one and it lights up,
 * and the line under the name changes to describe it.
 */

const DISCIPLINES = [
  {
    key: "just",
    word: "Just",
    name: "Legal",
    line: "Property law, contracts and documentation — handled by the group's legal practice.",
  },
  {
    key: "const",
    word: "Const",
    name: "Construction",
    line: "Design and build of homes and commercial buildings — delivered by JC Landmarks.",
  },
] as const;

const DEFAULT_LINE =
  "JC Landmarks is the construction arm of a group that brings legal and building expertise together — so every project stands on sound ground and sound paperwork.";

export default function ParentCompany() {
  const rootRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLAnchorElement>(null);
  const tiltX = useRef<((v: number) => void) | null>(null);
  const tiltY = useRef<((v: number) => void) | null>(null);
  const [focus, setFocus] = useState<(typeof DISCIPLINES)[number]["key"] | null>(null);
  const active = DISCIPLINES.find((d) => d.key === focus);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root, start: revealStart("top 85%"), toggleActions: "play reset play reset" };
      gsap.fromTo(".pc-mark", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.3, ease: "power3.out", scrollTrigger: st });
      gsap.fromTo(".pc-rise", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.1, ease: "power3.out", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!markRef.current || prefersReducedMotion()) return;
    gsap.set(markRef.current, { transformPerspective: 600 });
    tiltX.current = gsap.quickTo(markRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });
    tiltY.current = gsap.quickTo(markRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
  }, []);

  /** Gold light follows the cursor across the band. */
  const onMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const el = spotRef.current;
    const root = rootRef.current;
    if (!el || !root || e.pointerType === "touch") return;
    const r = root.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.opacity = "1";
  }, []);

  /** The mark leans toward the cursor. */
  const onMarkMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.current?.(((e.clientX - r.left) / r.width - 0.5) * 22);
    tiltY.current?.(((e.clientY - r.top) / r.height - 0.5) * -22);
  };
  const onMarkLeave = () => {
    tiltX.current?.(0);
    tiltY.current?.(0);
  };

  return (
    <section
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={() => spotRef.current && (spotRef.current.style.opacity = "0")}
      aria-labelledby="pc-title"
      className="relative isolate flex min-h-[50vh] items-center overflow-hidden bg-[#000000] py-16 text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_35%_70%_at_12%_50%,rgba(216,180,121,0.14),transparent_70%)]" />
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700"
        style={{ backgroundImage: "radial-gradient(circle 340px at var(--mx, 50%) var(--my, 50%), rgba(216,180,121,0.1), transparent 100%)" }}
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,121,0.35),transparent)]" />

      <div className="u-shell grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* The group's mark — a link to its site */}
        <div className="pc-mark flex justify-center lg:col-span-3 lg:justify-start">
          <a
            ref={markRef}
            href={PARENT.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${PARENT.name} (opens in a new tab)`}
            onPointerMove={onMarkMove}
            onPointerLeave={onMarkLeave}
            className="group relative block aspect-square w-40 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8B479] sm:w-44"
          >
            <span aria-hidden="true" className="pc-ring absolute inset-0 rounded-full transition-[filter] duration-500 group-hover:[animation-duration:2.5s] group-hover:[filter:drop-shadow(0_0_26px_rgba(216,180,121,0.85))]" />
            <span aria-hidden="true" className="absolute inset-[2px] rounded-full bg-[#000000]" />
            <span className="absolute inset-[15%] block transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-[1.06]">
              <Image src={PARENT.logo} alt={`${PARENT.name} logo`} fill sizes="140px" className="pc-logo object-contain" />
            </span>
            {/* "Visit" hint that slides up on hover */}
            <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.3em] text-[#D8B479] opacity-0 transition-all duration-500 group-hover:-bottom-8 group-hover:opacity-100">
              justandconst.com ↗
            </span>
          </a>
        </div>

        {/* The statement */}
        <div className="text-center lg:col-span-5 lg:text-left">
          <p className="pc-rise inline-flex items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
            <span aria-hidden="true" className="h-px w-8 bg-[#D8B479]" />
            Our Parent Group
          </p>
          <h2 id="pc-title" className="pc-rise mt-5 font-serif text-[clamp(1.7rem,2.9vw,2.6rem)] font-light leading-[1.15] text-[rgba(255,255,255,0.88)]">
            Part of the{" "}
            <a href={PARENT.url} target="_blank" rel="noopener noreferrer" className="pc-name font-normal">
              {PARENT.name}
            </a>{" "}
            group.
          </h2>
          <p
            key={active?.key ?? "default"}
            aria-live="polite"
            className="pc-rise u-fade-up mx-auto mt-5 min-h-[3.4em] max-w-md text-[0.95rem] leading-[1.75] text-[rgba(255,255,255,0.62)] lg:mx-0"
          >
            {active ? active.line : DEFAULT_LINE}
          </p>
        </div>

        {/* The two disciplines — hover to explore, click to visit */}
        <div className="lg:col-span-4">
          <ul className="pc-rise">
            {DISCIPLINES.map((d, i) => (
              <li key={d.key}>
                <a
                  href={PARENT.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerEnter={() => setFocus(d.key)}
                  onPointerLeave={() => setFocus(null)}
                  onFocus={() => setFocus(d.key)}
                  onBlur={() => setFocus(null)}
                  className="group relative flex items-baseline gap-5 py-5"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[rgba(255,255,255,0.1)]" />
                  {i === DISCIPLINES.length - 1 && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[rgba(255,255,255,0.1)]" />}
                  {/* Gold line that draws across on hover */}
                  <span aria-hidden="true" className="absolute left-0 top-0 h-px w-full origin-left bg-[#D8B479] [transform:scaleX(0)] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:[transform:scaleX(1)] group-focus-visible:[transform:scaleX(1)]" />
                  <span className="w-16 font-serif text-[1.5rem] font-light text-[rgba(216,180,121,0.55)] transition-colors duration-500 group-hover:text-[#D8B479]">
                    {d.word}
                  </span>
                  <span className="flex-1 text-[0.72rem] uppercase tracking-[0.26em] text-[rgba(255,255,255,0.6)] transition-colors duration-500 group-hover:text-white">
                    {d.name}
                  </span>
                  <span aria-hidden="true" className="text-[#D8B479] opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="pc-rise mt-8 flex flex-wrap items-center gap-4">
            <a
              href={PARENT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="u-btn u-btn--light u-btn--sm"
            >
              <span>Visit the group</span>
              <span aria-hidden="true" className="u-btn__arrow" />
            </a>
            <a
              href={PARENT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${PARENT.name} on Instagram (opens in a new tab)`}
              className="group inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-[#D8B479] focus-visible:text-[#D8B479]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-[box-shadow,background-color,color] duration-300 group-hover:bg-[#D8B479] group-hover:text-black group-hover:shadow-none">
                <SocialIcon name="instagram" className="h-[15px] w-[15px]" />
              </span>
              {PARENT.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
