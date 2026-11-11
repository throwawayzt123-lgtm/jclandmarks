"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * STATS — big serif figures scattered across a black band.
 *
 * Each figure is set very large and light, with a small italic unit beside it
 * and a short two-line caption underneath. On wide screens they sit on a
 * loose staircase across a 12-column grid rather than in a row, so the band
 * reads like an editorial spread. Figures count up the first time they show.
 */
export interface Stat {
  /** The figure, e.g. "20", "150k", "24/7". Any leading number counts up. */
  value: string;
  /** Small italic unit set beside the figure, e.g. "%", "sq. ft.", "years". */
  unit?: string;
  caption: string;
}

/** Where each figure sits on a wide screen (up to five). */
const PLACES = [
  "lg:col-start-7 lg:col-span-3 lg:row-start-1",
  "lg:col-start-10 lg:col-span-3 lg:row-start-1",
  "lg:col-start-2 lg:col-span-5 lg:row-start-2",
  "lg:col-start-6 lg:col-span-4 lg:row-start-3",
  "lg:col-start-10 lg:col-span-3 lg:row-start-3",
];

export default function StatsScatter({ stats, eyebrow, title }: { stats: Stat[]; eyebrow?: string; title?: string }) {
  const rootRef = useRef<HTMLElement>(null);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".st-item").forEach((el, i) => {
        const st = { trigger: el, start: revealStart("top 88%"), once: true };
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, delay: (i % 2) * 0.1, ease: "power3.out", scrollTrigger: st });

        // Count the leading number up; keep whatever follows it ("k", "+", "/7").
        const fig = el.querySelector<HTMLElement>(".st-fig");
        const raw = fig?.dataset.value ?? "";
        const m = raw.match(/^(\d+)(.*)$/);
        if (!fig || !m) return;
        const target = parseInt(m[1], 10);
        const pad = m[1].length > 1 && m[1].startsWith("0") ? m[1].length : 0;
        const rest = m[2];
        const c = { n: 0 };
        gsap.to(c, {
          n: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: st,
          onUpdate: () => {
            const v = String(Math.round(c.n));
            fig.textContent = (pad ? v.padStart(pad, "0") : v) + rest;
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-[#000000] py-[clamp(5rem,13vh,10rem)] text-white">
      <div className="u-shell grid grid-cols-2 gap-x-6 gap-y-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-[clamp(3rem,8vh,6rem)]">
        {(eyebrow || title) && (
          <div className="col-span-2 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-start">
            {eyebrow && <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">{eyebrow}</span>}
            {title && (
              <p className="mt-5 max-w-sm font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] font-light leading-[1.2] text-[rgba(255,255,255,0.85)]">{title}</p>
            )}
          </div>
        )}

        {stats.slice(0, PLACES.length).map((s, i) => (
          <div key={s.caption} className={`st-item col-span-1 ${i === 2 ? "col-span-2" : ""} ${PLACES[i]}`}>
            <div className="flex items-end gap-2">
              <span
                data-value={s.value}
                className={`st-fig font-serif font-light leading-[0.85] tracking-[-0.03em] lining-nums proportional-nums ${
                  i === 2 ? "text-[clamp(5rem,12vw,11.5rem)]" : "text-[clamp(3.6rem,8.5vw,8.5rem)]"
                }`}
              >
                {s.value}
              </span>
              {s.unit && <span className="mb-[0.45em] font-serif text-[clamp(1.2rem,2.1vw,1.9rem)] font-light italic text-[rgba(255,255,255,0.55)]">{s.unit}</span>}
            </div>
            <p className="mt-4 max-w-[16rem] text-[0.9rem] leading-[1.45] text-[rgba(255,255,255,0.82)]">{s.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
