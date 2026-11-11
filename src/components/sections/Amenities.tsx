"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { FACADES, INTERIORS, type Still } from "@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * PRIVATE AMENITIES — a pinned horizontal gallery.
 *
 * The section pins and the track translates sideways as the page is scrolled,
 * so vertical scroll reads as lateral travel through the rooms. Each card
 * carries its own number, tag, title and spec line; a progress rail and
 * counter track position.
 *
 * Desktop: everything animates on transform only, driven by one ScrollTrigger.
 *
 * Phones (and reduced motion): no pin. A pinned sideways track on a narrow
 * screen left one small card floating in an empty dark screen, so the track
 * becomes a native swipe gallery instead: large 16:9 photographs that snap
 * into place, each captioned underneath rather than over the image, with a
 * counter and progress line that follow the swipe.
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
    tag: "Bedrooms",
    title: "Master Bedroom",
    note: "Upper Floor",
    spec: "Upholstered bed wall · False ceiling · Warm pendant lighting",
    still: INTERIORS.bedMaster,
  },
  {
    tag: "Bedrooms",
    title: "Guest Bedroom",
    note: "Ground Floor",
    spec: "Feature wall art · Built-in side tables · Concealed LED",
    still: INTERIORS.mediaAcoustic,
  },
  {
    tag: "Kitchen",
    title: "Fitted Kitchen",
    note: "Ground Floor",
    spec: "Island counter · Full-height cabinets · Built-in appliances",
    still: INTERIORS.kitchen,
  },
  {
    tag: "Bathrooms",
    title: "En-Suite Bathroom",
    note: "Every Bedroom",
    spec: "Glass shower · Wall-hung fittings · Stone vanity",
    still: INTERIORS.bathroom,
  },
  {
    tag: "Living",
    title: "Double-Height Lounge",
    note: "Main Level",
    spec: "Open to the floor above · Pendant cascade · Full-height curtains",
    still: INTERIORS.loungeDoubleHeight,
  },
  {
    tag: "Exterior",
    title: "Front Elevation",
    note: "Street Side",
    spec: "Stone & glass facade · Car porch · Landscaped frontage",
    still: FACADES.phase7Villa,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Amenities() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const bar = root.querySelector<HTMLElement>(".am-bar");

    const show = (idx: number) => {
      if (idx === activeRef.current) return;
      activeRef.current = idx;
      setActive(idx);
    };

    const mm = gsap.matchMedia();

    /* ---------- Desktop: pinned sideways travel ---------- */
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = root.querySelector<HTMLElement>(".am-stage");
      if (!stage) return;

      /** Distance the track must travel to reveal its right edge. */
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          pin: stage,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            show(Math.min(AMENITIES.length - 1, Math.round(self.progress * (AMENITIES.length - 1))));
          },
        },
      });
    });

    /* ---------- Phones, or reduced motion: native swipe ---------- */
    mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      // Reduced motion on desktop keeps the desktop card layout, so the
      // track must be made scrollable here rather than by a breakpoint.
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      if (desktop) Object.assign(track.style, { position: "static", overflowX: "auto", paddingBottom: "1rem" });

      const onScroll = () => {
        const max = track.scrollWidth - track.clientWidth;
        const p = max > 0 ? track.scrollLeft / max : 0;
        const idx = Math.round(p * (AMENITIES.length - 1));
        if (bar) bar.style.transform = `scaleX(${(idx + 1) / AMENITIES.length})`;
        show(idx);
      };
      onScroll();
      track.addEventListener("scroll", onScroll, { passive: true });

      // Cards slide in from the right as the gallery comes into view.
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          track.children,
          { x: 70, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: track, start: revealStart("top 85%", "top 80%"), once: true },
          }
        );
      }

      return () => {
        track.removeEventListener("scroll", onScroll);
        if (desktop) Object.assign(track.style, { position: "", overflowX: "", paddingBottom: "" });
        if (bar) bar.style.transform = "";
      };
    });

    return () => mm.revert();
  }, []);

  const total = pad(AMENITIES.length);

  return (
    <section ref={rootRef} id="amenities" className="relative bg-[#000000] text-[#f4f1ea]">
      <div className="am-stage relative flex flex-col overflow-hidden py-[clamp(4.5rem,11vh,6rem)] lg:h-[100svh] lg:py-0">
        {/* ---- Heading rail ---- */}
        <div className="u-shell relative z-20 flex shrink-0 items-end justify-between gap-6 pb-8 lg:pb-6 lg:pt-[calc(var(--nav-h)+1.5rem)]">
          <div>
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#D8B479]">
              Room by Room
            </span>
            <h2 className="u-display mt-3 text-[clamp(1.9rem,3.6vw,3.2rem)] font-light leading-[1.08] text-[#f4f1ea]">
              Finished to the last <em className="font-serif italic text-[#D8B479]">detail.</em>
            </h2>
          </div>

          <span className="hidden shrink-0 font-mono text-[0.72rem] tracking-[0.3em] text-[rgba(244,241,234,0.5)] lg:block">
            {pad(active + 1)} / {total}
          </span>
        </div>

        {/* ---- Track: swipe row on phones, pinned sideways travel on desktop ---- */}
        <div className="relative lg:min-h-0 lg:flex-1">
          <div
            ref={trackRef}
            className="am-track flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] sm:gap-6 lg:absolute lg:inset-y-0 lg:left-0 lg:snap-none lg:items-center lg:gap-7 lg:overflow-visible lg:pr-16 lg:will-change-transform [&::-webkit-scrollbar]:hidden"
          >
            {AMENITIES.map((a, i) => (
              <article
                key={`${a.tag}-${i}`}
                className="group relative w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:aspect-video lg:w-[44vw] lg:max-w-[calc((100svh-15rem)*16/9)]"
              >
                {/* Photograph: a 16:9 plate on phones, the whole card on desktop */}
                <div className="relative aspect-video overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
                  <Image
                    src={a.still.src}
                    alt={a.still.alt}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 58vw, 44vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                    style={{ objectPosition: a.still.position ?? "center" }}
                  />

                  {/* Desktop only: grade, index and level over the photograph */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 hidden bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0)_68%)] lg:block"
                  />
                  <span className="absolute left-5 top-5 hidden font-mono text-[0.7rem] tracking-[0.26em] text-[rgba(244,241,234,0.75)] lg:block">
                    {pad(i + 1)}
                  </span>
                  <span className="absolute right-5 top-5 hidden text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#D8B479] lg:block">
                    {a.note}
                  </span>
                </div>

                {/* Caption: under the photo on phones, over it on desktop */}
                <div className="pt-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-6">
                  <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[#D8B479]">
                    <span className="lg:hidden">{pad(i + 1)} — </span>
                    {a.tag}
                  </span>
                  <h3 className="u-display mt-2 text-[1.35rem] font-light leading-tight text-[#f4f1ea] sm:text-[1.6rem]">
                    {a.title}
                  </h3>
                  <p className="mt-2.5 hidden text-[0.78rem] leading-relaxed text-[rgba(244,241,234,0.72)] lg:block">
                    {a.spec}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ---- Progress rail ---- */}
        <div className="u-shell relative z-20 flex shrink-0 items-center gap-5 pt-8 lg:pb-9 lg:pt-5">
          <span className="shrink-0 font-mono text-[0.68rem] tracking-[0.26em] text-[rgba(244,241,234,0.6)] lg:hidden">
            {pad(active + 1)} / {total}
          </span>
          <span className="relative h-px flex-1 bg-[rgba(244,241,234,0.16)]">
            {/* Starts empty via `transform` (not Tailwind's scale-x-0, which sets the
                separate `scale` property and would pin the bar at zero forever). */}
            <span className="am-bar absolute inset-0 origin-left bg-[#D8B479] transition-transform duration-500 [transform:scaleX(0)] lg:transition-none" />
          </span>
          <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(244,241,234,0.45)]">
            <span className="lg:hidden">Swipe</span>
            <span className="hidden lg:inline">Scroll to explore</span>
          </span>
        </div>
      </div>
    </section>
  );
}
