"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { FACADES, INTERIORS, type Still } from "@/lib/media";
import { enquiryHref } from "@/lib/portfolio";

import Link from "next/link";
/**
 * SERVICES — 03 REAL ESTATE
 *
 * Two sides of the same desk, behind a tab switch: buying a home, and selling
 * one. The buy side is a staggered two-column set of residences whose columns
 * drift against each other on scroll; the sell side is a three-step process.
 *
 * The tabs follow the WAI-ARIA tabs pattern (arrow keys move between them),
 * and the gold indicator slides to the active tab rather than jumping.
 */
type Tab = "buy" | "sell";

interface Listing {
  title: string;
  area: string;
  plot: string;
  features: string;
  still: Still;
}

/* Placeholder set drawn from the practice's own photography. Availability is
   not stated on purpose — every card routes to an enquiry. */
const LISTINGS: Listing[] = [
  { title: "Contemporary Residence", area: "Phase 7", plot: "1 Kanal", features: "Reflection pool · Cantilevered terrace", still: FACADES.phase7Villa },
  { title: "Spanish Estate", area: "Sheikhupura", plot: "2 Kanal", features: "Arched portals · Sweeping forecourt", still: FACADES.spanishEstate },
  { title: "Glass Pavilion Residence", area: "Phase 7", plot: "On request", features: "Double-height glazing · Travertine terraces", still: FACADES.phase7Curtain },
  { title: "Monolith Residence", area: "Phase 9 Prism", plot: "On request", features: "Charcoal stone · Bronze louvres", still: FACADES.prismMonolith },
];

const SELL_STEPS = [
  { no: "01", title: "Valuation", body: "A site visit and a written valuation grounded in recent sales and the real build quality of the house — not just its plot size." },
  { no: "02", title: "Presentation", body: "Architectural photography, a measured floor plan and a short written account of how the house was built, shown to qualified buyers only." },
  { no: "03", title: "Transfer", body: "Negotiation, documentation and transfer handled end to end. Where it suits both sides, we will also make a direct offer." },
];

export default function ServiceRealEstate() {
  const rootRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ buy: null, sell: null });
  const firstRun = useRef(true);
  const [tab, setTab] = useState<Tab>("buy");

  /* ---------- Scroll-driven entrance (once) ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = splitWords(root.querySelector(".re-head"));
      gsap.fromTo(
        words,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: { trigger: ".re-head", start: revealStart("top 85%"), once: true },
        }
      );

      gsap.fromTo(
        ".re-intro > *",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".re-head", start: revealStart("top 80%"), once: true },
        }
      );

      // Each plate unveils upward from its base.
      gsap.utils.toArray<HTMLElement>(".re-media").forEach((media) => {
        gsap.fromTo(
          media,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: media, start: revealStart("top 88%"), once: true } }
        );
        gsap.fromTo(
          media.querySelector(".re-media-img"),
          { scale: 1.25 },
          { scale: 1, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: media, start: revealStart("top 88%"), once: true } }
        );
      });

      // The two columns drift against each other — desktop only, where they sit side by side.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(".re-col-a", { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: ".re-grid", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".re-col-b", { y: -10 }, { y: 70, ease: "none", scrollTrigger: { trigger: ".re-grid", start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* ---------- Tab switch: slide indicator, stagger the new panel in ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const ind = indicatorRef.current;
    const btn = tabRefs.current[tab];
    if (!root || !ind || !btn) return;

    const reduced = prefersReducedMotion();
    const place = (animate: boolean) =>
      gsap.to(ind, {
        x: btn.offsetLeft,
        width: btn.offsetWidth,
        duration: animate && !reduced ? 0.7 : 0,
        ease: "power3.inOut",
        overwrite: true,
      });

    place(!firstRun.current);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);

    if (!firstRun.current) {
      if (!reduced) {
        gsap.fromTo(
          root.querySelectorAll(`[data-panel="${tab}"] .re-item`),
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: "power3.out", overwrite: true }
        );
      }
      // Panel heights differ, so everything below has moved.
      ScrollTrigger.refresh();
    }
    firstRun.current = false;

    return () => window.removeEventListener("resize", onResize);
  }, [tab]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next: Tab = tab === "buy" ? "sell" : "buy";
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const tabClass = (t: Tab) =>
    [
      "relative pb-4 text-[0.7rem] uppercase tracking-[0.26em] transition-colors duration-500 outline-none focus-visible:text-[#11141b]",
      tab === t ? "text-[#11141b]" : "text-[#8a8f9a] hover:text-[#11141b]",
    ].join(" ");

  const columnA = LISTINGS.filter((_, i) => i % 2 === 0);
  const columnB = LISTINGS.filter((_, i) => i % 2 === 1);

  const card = (l: Listing) => (
    <article key={l.title} className="re-item group">
      <Link href={enquiryHref("buy", l.title)} className="block outline-none">
        <div className="re-media relative aspect-[5/4] overflow-hidden bg-[#0b0d12]">
          <div className="re-media-img absolute inset-0">
            <Image
              src={l.still.src}
              alt={l.still.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              loading="lazy"
              className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
              style={{ objectPosition: l.still.position ?? "center" }}
            />
          </div>
        </div>
        <div className="pt-7">
          <span className="flex items-baseline justify-between gap-4 text-[0.62rem] uppercase tracking-[0.26em]">
            <span className="font-semibold text-[#b58c49]">{l.area} · {l.plot}</span>
            <span className="text-[#8a8f9a]">Price on request</span>
          </span>
          <h4 className="mt-3 font-serif text-[clamp(1.4rem,2.1vw,1.85rem)] font-light leading-[1.2]">{l.title}</h4>
          <span
            aria-hidden="true"
            className="mt-4 block h-px w-10 origin-left bg-[#b58c49] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-[3]"
          />
          <p className="mt-4 text-[0.9rem] leading-[1.7] text-[#6b7280]">{l.features}</p>
          <span className="mt-5 inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em] text-[#11141b] group-focus-visible:text-[#b58c49]">
            Enquire about this home
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </span>
        </div>
      </Link>
    </article>
  );

  return (
    <section
      ref={rootRef}
      id="real-estate"
      data-chapter="2"
      className="relative bg-[#f5f6f8] py-[clamp(6rem,15vh,11rem)] text-[#11141b]"
    >
      <div className="u-shell">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
          03 · Real Estate
        </span>

        <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-20">
          <h2 className="re-head col-span-full font-serif text-[clamp(1.9rem,3.8vw,3.3rem)] font-light leading-[1.16] tracking-[-0.01em] lg:col-span-7">
            Buying or selling a home, with builders on your side of the table.
          </h2>
          <div className="re-intro col-span-full lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p className="max-w-md text-[0.98rem] leading-[1.8] text-[#4b5563]">
              Because we build, we can tell you what a house is really made of —
              the structure behind the finishes, and what it will cost to keep.
              That changes what a fair price looks like.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mt-[clamp(3.5rem,8vh,5.5rem)]">
          <div role="tablist" aria-label="Real estate services" className="relative flex gap-10 sm:gap-14">
            {(["buy", "sell"] as const).map((t) => (
              <button
                key={t}
                ref={(el) => {
                  tabRefs.current[t] = el;
                }}
                id={`re-tab-${t}`}
                role="tab"
                type="button"
                aria-selected={tab === t}
                aria-controls={`re-panel-${t}`}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
                onKeyDown={onTabKey}
                className={tabClass(t)}
              >
                {t === "buy" ? "Homes for Sale" : "Sell or Purchase"}
              </button>
            ))}
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute -bottom-px left-0 block h-[2px] w-0 bg-[#b58c49]"
            />
          </div>
          <span aria-hidden="true" className="block h-px bg-[rgba(20,33,61,0.1)]" />
        </div>

        {/* Buy panel */}
        <div
          id="re-panel-buy"
          role="tabpanel"
          aria-labelledby="re-tab-buy"
          data-panel="buy"
          hidden={tab !== "buy"}
          className="mt-[clamp(3rem,7vh,5rem)]"
        >
          <div className="re-grid grid gap-y-16 lg:grid-cols-2 lg:gap-x-20">
            <div className="re-col-a flex flex-col gap-16 lg:gap-24">{columnA.map(card)}</div>
            <div className="re-col-b flex flex-col gap-16 lg:mt-32 lg:gap-24">{columnB.map(card)}</div>
          </div>
          <p className="re-item mt-16 max-w-lg text-[0.88rem] leading-[1.8] text-[#8a8f9a] lg:mt-24">
            Availability changes week to week, and some homes are offered privately
            and never listed. Ask us for the current set.
          </p>
        </div>

        {/* Sell panel */}
        <div
          id="re-panel-sell"
          role="tabpanel"
          aria-labelledby="re-tab-sell"
          data-panel="sell"
          hidden={tab !== "sell"}
          className="mt-[clamp(3rem,7vh,5rem)]"
        >
          <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-20">
            <div className="re-item relative col-span-full aspect-[4/5] overflow-hidden bg-[#0b0d12] lg:col-span-5">
              <Image
                src={INTERIORS.salonCurved.src}
                alt={INTERIORS.salonCurved.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                loading="lazy"
                className="object-cover"
                style={{ objectPosition: INTERIORS.salonCurved.position }}
              />
            </div>

            <div className="col-span-full lg:col-span-6 lg:col-start-7">
              <h3 className="re-item font-serif text-[clamp(1.6rem,2.8vw,2.4rem)] font-light leading-[1.2]">
                Sell your home to the right buyer — or to us.
              </h3>
              <ol className="mt-12">
                {SELL_STEPS.map((s) => (
                  <li key={s.no} className="re-item relative grid grid-cols-[3.5rem_1fr] py-9 sm:grid-cols-[5rem_1fr]">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 block h-px bg-[rgba(20,33,61,0.12)]" />
                    <span className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-none text-[#b58c49]">{s.no}</span>
                    <div>
                      <h4 className="font-serif text-[clamp(1.3rem,1.9vw,1.6rem)] font-light leading-[1.2]">{s.title}</h4>
                      <p className="mt-3 text-[0.93rem] leading-[1.8] text-[#4b5563]">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href={enquiryHref("sell")}
                className="re-item group mt-6 inline-flex items-center gap-4 bg-[#11141b] px-9 py-5 text-[0.66rem] uppercase tracking-[0.26em] text-[#f4f2ee] transition-colors duration-500 hover:bg-[#b58c49]"
              >
                Request a valuation
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
