"use client";

import Image from"next/image";
import { useLayoutEffect, useRef } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import type { Still } from"@/lib/media";

export interface Layer {
 still: Still;
  /**
   * Depth, 0 → 1. 0 is the far background (barely moves), 1 is the nearest
   * foreground (moves most). Drives drift, scale and blur together, the way a
   * real lens separates planes.
   */
 depth: number;
 className: string;
 ratio?: string;
 sizes?: string;
}

interface ParallaxLayersProps {
 layers: Layer[];
 className?: string;
  /** Overall drift budget in pixels across the element's scroll range. */
 range?: number;
}

/**
 * True multi-plane parallax.
 *
 * Each layer drifts by an amount proportional to its depth, so near planes
 * outrun far ones and the composition gains genuine dimension rather than
 * looking like sliding rectangles. Far layers are also very slightly scaled
 * and desaturated, which is what sells the separation.
 *
 * Everything animates on transform only, and all tweens are scrubbed by one
 * ScrollTrigger per layer inside a single gsap.context.
 */
export default function ParallaxLayers({
 layers,
 className ="",
 range = 70,
}: ParallaxLayersProps) {
 const rootRef = useRef<HTMLDivElement>(null);

 useLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
 gsap.utils.toArray<HTMLElement>(".pl-layer").forEach((el) => {
 const depth = Number(el.dataset.depth ?? 0.5);
        // Far planes drift against the scroll, near planes drift with it.
        // Clamp so a plate can never drift out of its own frame.
 const travel = gsap.utils.clamp(-90, 90, (depth - 0.5) * 2 * range);

 gsap.fromTo(
 el,
          { yPercent: 0, y: -travel },
          {
 y: travel,
 ease:"none",
 scrollTrigger: {
 trigger: root,
 start:"top bottom",
 end:"bottom top",
 scrub: true,
            },
          }
        );
      });

      // The whole group settles from a slight overscale and fades up as it arrives.
 gsap.fromTo(
 root,
        { scale: 1.04, opacity: 0, y: 30 },
        {
 scale: 1,
 opacity: 1,
 y: 0,
 ease:"power3.out",
 duration: 1.4,
 scrollTrigger: {
 trigger: root,
 start:"top 82%",
 once: true,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, [range]);

 return (
    <div ref={rootRef} className={`relative ${className}`}>
      {layers.map((l, i) => (
        <div
 key={l.still.src + i}
 className={`pl-layer ${l.className}`}
 data-depth={l.depth}
 style={{ willChange:"transform" }}
        >
          <div
 className="u-plate h-full w-full"
 style={l.ratio ? { aspectRatio: l.ratio } : undefined}
          >
            <Image
 src={l.still.src}
 alt={l.still.alt}
 fill
 sizes={l.sizes ??"50vw"}
 loading="lazy"
 className="object-cover"
 style={{
 objectPosition: l.still.position ??"center",
                // Far planes sit back: fractionally dimmer and softer.
 filter:
 l.depth < 0.4
                    ?"brightness(0.78) saturate(0.9)"
                    : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
