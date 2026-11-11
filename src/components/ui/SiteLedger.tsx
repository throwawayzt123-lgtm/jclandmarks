"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { enquiryHref, type Site } from "@/lib/portfolio";

/**
 * The project ledger — every site as one slim bar rather than a heavy card,
 * so eighteen projects read as a confident list, not a wall of tiles.
 *
 *   index · plot size · plot & area · type · credits · status
 *
 * A row with a photograph reveals it in a thumbnail on hover (desktop) — the
 * photo stays out of the way until asked for. Filters switch the list
 * in place; rows re-enter with a short stagger.
 */
type Filter = "all" | "residential" | "commercial" | "completed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All ongoing" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "completed", label: "Recently completed" },
];

export default function SiteLedger({ sites }: { sites: Site[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLOListElement>(null);
  const first = useRef(true);

  const counts = useMemo(() => {
    const ongoing = sites.filter((s) => s.status === "ongoing");
    return {
      all: ongoing.length,
      residential: ongoing.filter((s) => s.type === "residential").length,
      commercial: ongoing.filter((s) => s.type === "commercial").length,
      completed: sites.filter((s) => s.status === "completed").length,
    } as Record<Filter, number>;
  }, [sites]);

  const shown = useMemo(() => {
    if (filter === "completed") return sites.filter((s) => s.status === "completed");
    const ongoing = sites.filter((s) => s.status === "ongoing");
    return filter === "all" ? ongoing : ongoing.filter((s) => s.type === filter);
  }, [filter, sites]);

  // Rows rise in when the list scrolls into view, and again on each filter change.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    const rows = list.querySelectorAll<HTMLElement>("[data-row]");
    const ctx = gsap.context(() => {
      gsap.set(rows, { opacity: 0, y: 18 });
      const play = () => gsap.to(rows, { opacity: 1, y: 0, duration: 0.7, stagger: 0.045, ease: "power3.out" });
      if (first.current) {
        first.current = false;
        gsap.to(rows, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: list, start: "top 85%", once: true },
        });
      } else play();
    }, list);
    return () => ctx.revert();
  }, [shown]);

  return (
    <div>
      {/* Filters — plain text tabs, the active one underlined in gold */}
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-[rgba(20,33,61,0.1)]">
        {FILTERS.map((f) => {
          const on = f.key === filter;
          return (
            <button
              key={f.key}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setFilter(f.key)}
              className={[
                "relative -mb-px pb-4 text-[0.66rem] uppercase tracking-[0.24em] transition-colors duration-300",
                on ? "text-[#11141b]" : "text-[#8a8f9a] hover:text-[#11141b]",
              ].join(" ")}
            >
              {f.label}
              <span className="ml-2 tabular-nums text-[#b58c49]">{String(counts[f.key]).padStart(2, "0")}</span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 block h-[2px] origin-left bg-[#b58c49] transition-transform duration-500 ${on ? "scale-x-100" : "scale-x-0"}`}
              />
            </button>
          );
        })}
      </div>

      {/* Column labels — desktop only */}
      <div className="hidden grid-cols-[3rem_7rem_1fr_9rem_minmax(0,16rem)_8rem] gap-x-6 pb-3 pt-8 text-[0.56rem] uppercase tracking-[0.24em] text-[#a3a8b2] lg:grid">
        <span>No.</span>
        <span>Plot size</span>
        <span>Project</span>
        <span>Type</span>
        <span>Credits</span>
        <span className="text-right">Status</span>
      </div>

      <ol ref={listRef} className="mt-4 lg:mt-0">
        {shown.map((s, i) => {
          const done = s.status === "completed";
          return (
            <li
              key={`${s.plot}-${s.area}`}
              data-row=""
              className="group relative border-t border-[rgba(20,33,61,0.08)] first:border-t-0 last:border-b"
            >
              {/* Gold bar that sweeps in on hover */}
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-[#b58c49] transition-transform duration-500 group-hover:scale-y-100" />

              <div className="grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 gap-y-1.5 py-5 pl-3 transition-colors duration-300 group-hover:bg-[#f5f6f8] lg:grid-cols-[3rem_7rem_1fr_9rem_minmax(0,16rem)_8rem] lg:items-center lg:gap-x-6 lg:py-6">
                <span className="text-[0.66rem] tabular-nums tracking-[0.14em] text-[#a3a8b2]">{String(i + 1).padStart(2, "0")}</span>

                {/* Plot size — prominent on desktop; inline with the title on phones */}
                <span className="hidden font-serif text-[1.25rem] font-light leading-none text-[#b58c49] lg:block">{s.size}</span>

                <div className="min-w-0">
                  <span className="block font-serif text-[clamp(1.15rem,1.7vw,1.4rem)] font-light leading-[1.2] text-[#11141b]">
                    {s.plot}
                    {s.note && <span className="ml-2 font-serif text-[0.95rem] italic text-[#b58c49]">{s.note}</span>}
                  </span>
                  <span className="mt-1 block text-[0.78rem] text-[#6b7280]">
                    <span className="lg:hidden">{s.size} · </span>
                    {s.area}, Lahore
                  </span>
                </div>

                <span className="hidden text-[0.62rem] uppercase tracking-[0.2em] text-[#4b5563] lg:block">{s.type}</span>

                <span className="col-span-2 col-start-2 text-[0.72rem] leading-[1.6] text-[#8a8f9a] lg:col-span-1 lg:col-start-auto">
                  {s.credits?.length ? s.credits.join(" · ") : <span className="hidden lg:inline">—</span>}
                </span>

                <span className="row-start-1 col-start-3 flex items-center justify-end gap-2 text-[0.6rem] uppercase tracking-[0.2em] lg:row-start-auto lg:col-start-auto">
                  <span
                    aria-hidden="true"
                    className={`block h-[6px] w-[6px] rotate-45 ${done ? "bg-[#4b5563]" : "bg-[#b58c49] shadow-[0_0_0_3px_rgba(181,140,73,0.18)]"}`}
                  />
                  <span className={done ? "text-[#4b5563]" : "text-[#b58c49]"}>{done ? "Completed" : "On site"}</span>
                </span>
              </div>

              {/* Photo preview on hover, for rows that have one (desktop) */}
              {s.photo && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[10.5rem] top-1/2 z-10 hidden aspect-video w-56 -translate-y-1/2 scale-95 overflow-hidden opacity-0 shadow-[0_24px_50px_-16px_rgba(17,20,27,0.45)] transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100 xl:block"
                >
                  <Image src={s.photo.src} alt="" fill sizes="224px" className="object-cover" style={{ objectPosition: s.photo.position ?? "center" }} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-[0.82rem] leading-[1.7] text-[#8a8f9a]">
        Want to see one of these projects in person?{" "}
        <Link href={enquiryHref("site-visit")} className="text-[#11141b] underline decoration-[#b58c49] underline-offset-4 transition-colors hover:text-[#b58c49]">
          Arrange a site visit
        </Link>
        .
      </p>
    </div>
  );
}
