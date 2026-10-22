"use client";

import Image from"next/image";
import { useLayoutEffect, useRef } from"react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from"@/lib/splitWords";

interface ChevronItem {
 id: string;
 src: string;
 alt: string;
 position: string;
 leftPercent: number; // Exact horizontal offset percentage based on 854x318 reference geometry
}

/**
 * 4 Client images from public/images/touse/
 * Configured with the exact sleek, sharp 45-degree chevron arrow geometry from the reference.
 */
const CHEVRONS: ChevronItem[] = [
  {
 id:"chv-1",
 src:"/images/touse/frontfasades/483Y phase 7.png",
 alt:"483-Y Phase 7 luxury villa facade showcasing double-height glass curtain wall",
 position:"center 22%",
 leftPercent: 0,
  },
  {
 id:"chv-2",
 src:"/images/touse/interiors/bed1.jpg",
 alt:"Executive master bedroom suite with bespoke fluted panelling and warm pendants",
 position:"center 48%",
 leftPercent: 23.653,
  },
  {
 id:"chv-3",
 src:"/images/touse/interiors/l3.jpg",
 alt:"Monumental double-height grand drawing room with vertical chandelier and 30-foot drapery",
 position:"center 42%",
 leftPercent: 47.307,
  },
  {
 id:"chv-4",
 src:"/images/touse/frontfasades/2 Kanal Spanish design by Asad Afzal at Sheikhupura.png",
 alt:"2 Kanal Spanish classical estate featuring grand arches and sweeping forecourt",
 position:"center 30%",
 leftPercent: 70.96,
  },
];

export default function IdentityStatement() {
 const rootRef = useRef<HTMLElement>(null);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Top headline in-and-out entrance
 gsap.fromTo(
".id-header",
        { opacity: 0, y: 28 },
        {
 opacity: 1,
 y: 0,
 duration: 1.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start: revealStart("top 85%"),
 toggleActions:"play reverse play reverse",
          },
        }
      );

      // The headline rises a word at a time rather than as one block.
      const headWords = splitWords(root.querySelector(".id-head"));
      gsap.fromTo(
        headWords,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.05,
          ease: "power4.out",
          scrollTrigger: { trigger: root, start: revealStart("top 82%"), once: true },
        }
      );

      // Staggered forward-chevron entrance
 gsap.fromTo(
".chv-slice",
        { opacity: 0, x: -30, scale: 0.97 },
        {
 opacity: 1,
 x: 0,
 scale: 1,
 duration: 1.1,
 stagger: 0.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".chv-container",
 start: revealStart("top 82%"),
 toggleActions:"play reverse play reverse",
          },
        }
      );

      // The chevron row shears gently across its whole scroll range, so the
      // band is never static once the entrance has played.
      gsap.utils.toArray<HTMLElement>(".chv-slice").forEach((sl, idx) => {
        gsap.fromTo(
          sl,
          { x: (idx - 1.5) * 10 },
          {
            x: (idx - 1.5) * -10,
            ease: "none",
            scrollTrigger: {
              trigger: ".chv-container",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      // Smooth scrub parallax on images inside the chevrons
 gsap.utils.toArray<HTMLElement>(".chv-img-inner").forEach((img, idx) => {
 const offset = idx % 2 === 0 ? 6 : -6;
 gsap.fromTo(
 img,
          { yPercent: -offset, scale: 1.08 },
          {
 yPercent: offset,
 scale: 1.02,
 ease:"none",
 scrollTrigger: {
 trigger:".chv-container",
 start:"top bottom",
 end:"bottom top",
 scrub: true,
            },
          }
        );
      });

      // Bottom narrative lines in-and-out entrance
 gsap.fromTo(
".id-footer > *",
        { opacity: 0, y: 20 },
        {
 opacity: 1,
 y: 0,
 duration: 1,
 stagger: 0.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger:".id-footer",
 start: revealStart("top 88%"),
 toggleActions:"play reverse play reverse",
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="identity"
 data-depth="base"
 className="relative overflow-hidden bg-white text-[#11141b] py-14 sm:py-20 lg:py-28"
    >
      {/* Top Statement Header */}
      <div className="id-header u-shell text-center">
        <h2 className="id-head text-[clamp(2.1rem,4.5vw,4.25rem)] font-normal tracking-tight text-[#11141b] leading-[1.08]">
          This isn’t just{""}
          <span className="font-light text-[#949aa8]">
 about real estate.
          </span>
        </h2>
      </div>

      {/* 4 Sleek Chevron Slices — Pixel-Accurate 854x318 Proportions with Client Photography */}
      <div className="mt-10 sm:mt-14 lg:mt-16 w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <div className="chv-container relative aspect-[854/318] w-full select-none">
          {CHEVRONS.map((chv, idx) => (
            <div
 key={chv.id}
 className="chv-slice group absolute top-0 bottom-0 cursor-pointer overflow-hidden transition-transform duration-500 ease-[var(--ease-luxe)] hover:-translate-y-1 hover:scale-[1.02]"
 style={{
 left: `${chv.leftPercent}%`,
 width:"29.274%",
 clipPath:
"polygon(0% 0%, 53.6% 0%, 100% 50%, 53.6% 100%, 0% 100%, 46.4% 50%)",
 zIndex: idx + 1,
              }}
            >
              <div className="chv-img-inner relative h-full w-full bg-[#11141b] overflow-hidden">
                <Image
 src={chv.src}
 alt={chv.alt}
 fill
 priority={idx < 2}
 sizes="(max-width: 768px) 35vw, 25vw"
 className="object-cover transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-108"
 style={{ objectPosition: chv.position }}
                />
                {/* Subtle soft gradient overlay for architectural richness */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 opacity-50 group-hover:opacity-20 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Narrative Statement */}
      <div className="id-footer mt-10 sm:mt-14 lg:mt-16 u-shell text-center max-w-2xl mx-auto space-y-2.5">
        <p className="text-base sm:text-xl md:text-2xl text-[#11141b] font-medium tracking-tight leading-snug">
          It’s about identity. Progress. Getting unstuck.
        </p>
        <p className="text-sm sm:text-lg md:text-xl text-[#11141b] font-normal leading-relaxed">
          You’re not just looking for a place.{""}
          <span className="text-[#949aa8] font-light">
            You’re looking for alignment. That’s what we help you find.
          </span>
        </p>

        {/* Refined Gold Rule Brand Marker */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[rgba(216,180,121,0.4)]" />
          <span className="text-[0.65rem] tracking-[0.28em] uppercase text-[#D8B479] font-medium">
            JC Landmarks · Monograph Vision
          </span>
          <span className="h-px w-8 bg-[rgba(216,180,121,0.4)]" />
        </div>
      </div>
    </section>
  );
}
