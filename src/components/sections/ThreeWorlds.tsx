"use client";

import Image from"next/image";
import { useLayoutEffect, useRef, useState } from"react";
import { gsap, ScrollTrigger, prefersReducedMotion } from"@/lib/gsap";
import { FACADES, INTERIORS, type Still } from"@/lib/media";

interface WorldItem {
 id: string;
 number: string;
 tag: string;
 title: string;
 subtitle: string;
 spec: string;
 still: Still;
}

const WORLDS: WorldItem[] = [
  {
 id:"horizon",
 number:"01",
 tag:"Interior Realm",
 title:"The Panoramic Salon",
 subtitle:"Double-Height Horizon Glazing & Curved Living",
 spec:"30-Foot Glazed Drapery · Bespoke Modular Seating · Italian Calacatta",
 still: INTERIORS.salonCurved,
  },
  {
 id:"monolith",
 number:"02",
 tag:"Exterior Architecture",
 title:"The Monolithic Villa",
 subtitle:"Cascading Water Terraces & Cantilevered Volumes",
 spec:"Titanium Cladding · Perimeter Reflection Pools · South-West Sun Path",
 still: FACADES.phase7Villa,
  },
  {
 id:"atrium",
 number:"03",
 tag:"Spatial Apex",
 title:"The Grand Atrium",
 subtitle:"Triple-Height Lightwell with Amber Chandelier",
 spec:"32-Foot Vertical Void · Floating Mezzanines · Bookmatched Marble",
 still: INTERIORS.atriumApex,
  },
];

export default function ThreeWorlds() {
 const sectionRef = useRef<HTMLElement>(null);
 const stageRef = useRef<HTMLDivElement>(null);
 const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
 const [activeIdx, setActiveIdx] = useState(0);

 useLayoutEffect(() => {
 const section = sectionRef.current;
 const stage = stageRef.current;
 if (!section || !stage) return;

 if (prefersReducedMotion()) return;

 const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
 if (cards.length === 0) return;

 const ctx = gsap.context(() => {
      // Internal scrub state representing normalized progress across cards [0 .. 2]
 const state = { progress: 0 };

      // Function to position all 3 cards along the 3D cylindrical arc based on current progress
 const update3DStage = (currProg: number) => {
 const total = WORLDS.length; // 3
 const centerIndex = currProg * (total - 1); // 0 .. 2

 cards.forEach((card, i) => {
          // delta is relative position from dead-center:
          // 0 = centered, -1 = one step to left, +1 = one step to right
 const delta = i - centerIndex;
 const absDelta = Math.abs(delta);

          // Horizontal offset: each step spreads out proportionally
          // Responsive spacing between card centers: ~104%
 const xPercent = delta * 104;

          // 3D Curvature:
          // Left cards tilt right (negative delta -> positive rotateY or vice versa)
          // To create a concave cylinder facing the camera:
          // Left card (delta < 0) should rotate rightwards around Y (positive rotateY)
          // Right card (delta > 0) should rotate leftwards around Y (negative rotateY)
 const rotateY = -delta * 22;

          // Depth: center card pushes forward (+40px), side cards recede (-80px)
 const z = 40 - Math.min(absDelta, 1.8) * 110;

          // Scale: center card is prominent (1.04), side cards subtly scale down
 const scale = Math.max(0.85, 1.04 - absDelta * 0.12);

          // Atmospheric lighting / depth opacity
 const opacity = Math.max(0.4, 1 - absDelta * 0.35);

 gsap.set(card, {
 xPercent,
 rotationY: rotateY,
 z: z,
 scale: scale,
 opacity: opacity,
 transformPerspective: 1400,
 transformOrigin:"center center",
          });
        });

        // Determine nearest active index for UI indicators
 const nearest = Math.round(centerIndex);
 setActiveIdx(nearest);
      };

      // Set initial positions (start at World 1)
 update3DStage(0);

      // Pinned vertical scrub timeline
 gsap.to(state, {
 progress: 1,
 ease:"none",
 scrollTrigger: {
 id:"three-worlds-pin",
 trigger: section,
 start:"top top",
 end:"+=2600",
 pin: true,
 pinSpacing: true,
 scrub: 1,
 anticipatePin: 1,
 invalidateOnRefresh: true,
 refreshPriority: 5,
 onUpdate: () => {
 update3DStage(state.progress);
          },
        },
      });

      // Headline entrance
 gsap.fromTo(
".tw-title-elem",
        { opacity: 0, y: 30 },
        {
 opacity: 1,
 y: 0,
 duration: 1.2,
 stagger: 0.12,
 ease:"power3.out",
 scrollTrigger: {
 trigger: section,
 start:"top 70%",
 once: true,
          },
        }
      );

      // Re-sort triggers in document order
      ScrollTrigger.sort();
    }, section);

 return () => ctx.revert();
  }, []);

  // Quick navigation handler when user clicks indicator dots
 const jumpToWorld = (targetIdx: number) => {
 const section = sectionRef.current;
 if (!section) return;
 const st = ScrollTrigger.getById("three-worlds-pin") || ScrollTrigger.getAll().find(s => s.trigger === section);
 if (st) {
 const targetScroll = st.start + (targetIdx / (WORLDS.length - 1)) * (st.end - st.start);
 window.scrollTo({ top: targetScroll, behavior:"smooth" });
    }
  };

 return (
    <section
 ref={sectionRef}
 id="worlds"
 data-depth="well"
 className="relative z-20 isolate h-screen min-h-[640px] max-h-screen w-full bg-[#050608] text-white overflow-hidden flex flex-col justify-between py-8 sm:py-12 select-none"
    >
      {/* ---------- 3D Reflective Gloss Ribbon Backdrop (from user screenshot) ---------- */}
      <div
 aria-hidden="true"
 className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35"
      >
        <svg
 viewBox="0 0 1920 1080"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="w-full h-full object-cover"
        >
          <path
 d="M -200 1180 C 400 900 600 200 960 400 C 1320 600 1600 -100 2120 100"
 stroke="url(#metallicRibbon)"
 strokeWidth="140"
 strokeLinecap="round"
 className="filter blur-[1px]"
          />
          <path
 d="M -100 1000 C 500 750 700 150 1060 320 C 1420 500 1700 -50 2200 50"
 stroke="url(#hairlineGold)"
 strokeWidth="2.5"
 strokeLinecap="round"
          />
          <defs>
            <linearGradient id="metallicRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111520" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#303848" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#D8B479" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#1a202c" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#050608" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hairlineGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor="#D8B479" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#fff2d6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Radial depth vignettes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,180,121,0.06)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,6,8,0.7)_0%,transparent_35%,transparent_70%,rgba(5,6,8,0.95)_100%)]" />
      </div>

      {/* ---------- Header Typography matching screenshot ---------- */}
      <div className="relative z-10 w-full text-center px-4 pt-4 sm:pt-6">
        <div className="tw-title-elem flex items-center justify-center gap-3 mb-2">
          <span className="h-1.5 w-1.5 rotate-45 bg-[#D8B479] shadow-[0_0_8px_#D8B479]" />
          <span className="text-[0.65rem] sm:text-[0.72rem] tracking-[0.35em] uppercase text-[#D8B479] font-medium">
            Architectural Trilogy
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-[#D8B479] shadow-[0_0_8px_#D8B479]" />
        </div>

        {/* Script / Italic serif"The three" */}
        <p className="tw-title-elem font-serif italic text-3xl sm:text-5xl lg:text-6xl text-[rgba(247,246,242,0.92)] font-light leading-tight tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          The three
        </p>

        {/* Grand monumental serif"WORLDS" */}
        <h2 className="tw-title-elem font-serif tracking-[0.14em] uppercase text-5xl sm:text-7xl lg:text-9xl text-white font-normal leading-[0.88] mt-1 sm:mt-2 drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
          WORLDS
        </h2>
      </div>

      {/* ---------- 3D Curvy Cylindrical Stage Container ---------- */}
      <div
 ref={stageRef}
 className="relative z-10 w-full h-[52vh] sm:h-[58vh] max-h-[620px] my-auto flex items-center justify-center overflow-visible"
 style={{
 perspective:"1400px",
 transformStyle:"preserve-3d",
        }}
      >
        <div
 className="relative w-[82vw] sm:w-[68vw] max-w-[860px] h-full flex items-center justify-center"
 style={{ transformStyle:"preserve-3d" }}
        >
          {WORLDS.map((world, i) => (
            <div
 key={world.id}
 ref={(el) => {
 cardRefs.current[i] = el;
              }}
 onClick={() => jumpToWorld(i)}
 className="absolute inset-0 sm: overflow-hidden shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] shadow-[0_30px_90px_rgba(0,0,0,0.85)] bg-[#0c0f17] will-change-transform group cursor-pointer transition-shadow duration-500 hover:shadow-[0_30px_100px_rgba(216,180,121,0.25)]"
 style={{
 transformStyle:"preserve-3d",
 backfaceVisibility:"hidden",
              }}
            >
              {/* Card Image */}
              <div className="absolute inset-0">
                <Image
 src={world.still.src}
 alt={world.still.alt}
 fill
 sizes="(max-width: 1024px) 85vw, 68vw"
 className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
 style={{ objectPosition: world.still.position ??"center" }}
 priority={i === 1}
                />

                {/* Subtle Curvature Edge Shading (enhances the cylinder 3D look) */}
                <div
 aria-hidden="true"
 className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,6,8,0.55)_100%)] pointer-events-none"
                />

                {/* Bottom Atmospheric Vignette */}
                <div
 aria-hidden="true"
 className="absolute inset-0 bg-gradient-to-t from-[rgba(5,6,8,0.92)] via-[rgba(5,6,8,0.3)] to-transparent pointer-events-none"
                />
              </div>

              {/* Top Badge: World Number & Realm Tag */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-2 shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-sm">
                  <span className="h-1.5 w-1.5 rotate-45 bg-[#D8B479] shadow-[0_0_6px_#D8B479]" />
                  <span className="text-[0.62rem] sm:text-[0.68rem] tracking-[0.26em] uppercase text-white font-semibold font-mono">
                    WORLD {world.number}
                  </span>
                </div>

                <span className="text-[0.62rem] sm:text-[0.68rem] tracking-[0.24em] uppercase text-[#D8B479] font-medium drop-shadow-md hidden sm:inline-block">
                  {world.tag}
                </span>
              </div>

              {/* Bottom Card Copy */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-9 right-6 sm:right-9 z-10">
                <span className="text-[0.65rem] sm:text-[0.72rem] tracking-[0.26em] uppercase text-[#D8B479] font-semibold block mb-1">
                  {world.subtitle}
                </span>
                <h3 className="u-display text-2xl sm:text-4xl lg:text-5xl text-white font-normal font-serif drop-shadow-md">
                  {world.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[rgba(247,246,242,0.85)] font-normal leading-relaxed max-w-xl hidden sm:block">
                  {world.spec}
                </p>
              </div>

              {/* Hairline Golden Edge Glow */}
              <div
 aria-hidden="true"
 className="pointer-events-none absolute inset-0 sm: border border-white/10 group-hover:border-[#D8B479]/60 transition-colors duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Bottom Controls & Scroll Cue ---------- */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        {/* Step indicator buttons */}
        <div className="flex items-center gap-3">
          {WORLDS.map((w, idx) => (
            <button
 key={w.id}
 onClick={() => jumpToWorld(idx)}
 className="group flex items-center gap-2 py-1 focus:outline-none"
 aria-label={`Jump to World ${w.number}: ${w.title}`}
            >
              <span
 className={`h-1.5 transition-all duration-300 ${
 activeIdx === idx
                    ?"w-8 bg-[#D8B479] shadow-[0_0_8px_#D8B479]"
                    :"w-2 bg-white/30 group-hover:bg-white/60"
                }`}
              />
              <span
 className={`text-[0.62rem] tracking-[0.2em] uppercase font-mono transition-colors ${
 activeIdx === idx ?"text-[#D8B479] font-bold" :"text-white/40 group-hover:text-white/70"
                }`}
              >
                {w.number}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator prompt */}
        <div className="flex items-center gap-2.5 text-[0.62rem] sm:text-[0.68rem] tracking-[0.28em] uppercase text-white/50">
          <span className="h-1 w-1 rotate-45 bg-[#D8B479] animate-ping" />
          <span>Scroll to rotate worlds</span>
          <span className="text-[#D8B479]">↓</span>
        </div>
      </div>
    </section>
  );
}
