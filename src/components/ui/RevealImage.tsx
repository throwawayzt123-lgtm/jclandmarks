"use client";

import Image from"next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import type { Still } from"@/lib/media";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

interface RevealImageProps {
 still: Still;
  /** Aspect ratio of the frame, e.g."4/5","16/9". */
 ratio?: string;
  /** Vertical drift, in pixels, across the element's scroll range. */
 parallax?: number;
  /** Enables the hover zoom (use for interactive/linked imagery). */
 hoverZoom?: boolean;
  /** Architectural caption rendered beneath the frame. */
 caption?: string;
 className?: string;
 priority?: boolean;
 sizes?: string;
}

export default function RevealImage({
 still,
 ratio ="16/9",
 parallax = 0,
 hoverZoom = false,
 caption,
 className ="",
 priority = false,
 sizes ="100vw",
}: RevealImageProps) {
 const rootRef = useRef<HTMLElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
 const frame = root.querySelector(".ri-frame");
 const scaleEl = root.querySelector(".ri-scale");

 gsap.fromTo(
 frame,
        { opacity: 0, y: 30, clipPath:"inset(4% 4% 4% 4%)" },
        {
 opacity: 1,
 y: 0,
 clipPath:"inset(0% 0% 0% 0%)",
 ease:"power3.out",
 duration: 1.2,
 scrollTrigger: {
 trigger: root,
 start:"top 82%",
 once: true,
          },
        }
      );

      // GSAP scale is applied ONLY to .ri-scale (which has no CSS transition)
      // This ensures 100% smooth, glitch-free animation without fighting CSS transitions.
 if (scaleEl) {
 gsap.fromTo(
 scaleEl,
          { scale: 1.12 },
          {
 scale: 1,
 ease:"power3.out",
 duration: 1.5,
 scrollTrigger: {
 trigger: root,
 start:"top 82%",
 once: true,
            },
          }
        );
      }

 if (caption) {
 gsap.fromTo(
 root.querySelector(".ri-caption"),
          { opacity: 0, y: 16 },
          {
 opacity: 1,
 y: 0,
 duration: 1,
 scrollTrigger: {
 trigger: root,
 start:"top 82%",
 once: true,
            },
          }
        );
      }

 if (parallax !== 0) {
 gsap.fromTo(
 root.querySelector(".ri-parallax"),
          { yPercent: -parallax / 2 },
          {
 yPercent: parallax / 2,
 ease:"none",
 scrollTrigger: {
 trigger: root,
 start:"top bottom",
 end:"bottom top",
 scrub: true,
            },
          }
        );
      }
    }, root);

 return () => ctx.revert();
  }, [parallax, caption]);

 return (
    <figure ref={rootRef} className={className}>
      <div
 className="ri-frame u-plate u-plate-lift shadow-[0_20px_60px_rgba(9,14,24,0.15)] shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)]"
 style={{ aspectRatio: ratio }}
      >
        <div className="ri-parallax absolute inset-0">
          <div className="ri-scale absolute inset-0">
            <div
 className={[
"ri-inner absolute inset-0 transition-transform duration-[700ms] ease-[var(--ease-luxe)]",
 hoverZoom ?"group-hover:scale-[1.05]" :"",
              ].join(" ")}
            >
              <Image
 src={still.src}
 alt={still.alt}
 fill
 sizes={sizes}
 priority={priority}
 loading={priority ? undefined :"lazy"}
 className="object-cover"
 style={{ objectPosition: still.position ??"center" }}
              />
            </div>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="ri-caption u-eyebrow mt-4 flex items-center gap-3 text-[var(--on-surface-muted)] text-[0.68rem]">
          <span aria-hidden="true" className="h-px w-6 bg-[var(--accent)]" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
