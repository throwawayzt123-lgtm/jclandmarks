"use client";

import Image from"next/image";
import {
 useImperativeHandle,
 useLayoutEffect,
 useRef,
 type RefObject,
} from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import type { Still } from"@/lib/media";

export interface PreviewHandle {
  /** Show the still at `index`. */
 show: (index: number) => void;
 hide: () => void;
  /** Track the pointer. Coordinates are viewport-relative. */
 move: (x: number, y: number) => void;
}

interface ServiceHoverPreviewProps {
 stills: Still[];
 handleRef: RefObject<PreviewHandle | null>;
}

/**
 * A floating architectural plate that smoothly follows the cursor with organic tilt.
 */
export default function ServiceHoverPreview({
 stills,
 handleRef,
}: ServiceHoverPreviewProps) {
 const rootRef = useRef<HTMLDivElement>(null);
 const plateRef = useRef<HTMLDivElement>(null);
 const apiRef = useRef<PreviewHandle | null>(null);

 useLayoutEffect(() => {
 const el = plateRef.current;
 if (!el) return;

 if (prefersReducedMotion()) {
 apiRef.current = { show: () => {}, hide: () => {}, move: () => {} };
 return;
    }

    // Set origin centering in GSAP so transform matrices never clash with CSS translates
 gsap.set(el, { xPercent: -50, yPercent: -50 });

 const xTo = gsap.quickTo(el,"x", { duration: 0.75, ease:"power3.out" });
 const yTo = gsap.quickTo(el,"y", { duration: 0.75, ease:"power3.out" });
 const rTo = gsap.quickTo(el,"rotation", {
 duration: 0.9,
 ease:"power3.out",
    });

 let lastX = 0;
 const plates = gsap.utils.toArray<HTMLElement>(".shp-plate", el);

 apiRef.current = {
 show(index) {
 el.style.visibility ="visible";
 gsap.to(plates, { opacity: 0, duration: 0.25, overwrite:"auto" });
 gsap.to(plates[index], { opacity: 1, duration: 0.35, overwrite:"auto" });
 gsap.to(el, {
 opacity: 1,
 scale: 1,
 duration: 0.6,
 ease:"power3.out",
 overwrite:"auto",
        });
      },
 hide() {
 gsap.to(el, {
 opacity: 0,
 scale: 0.92,
 duration: 0.4,
 ease:"power2.out",
 overwrite:"auto",
 onComplete: () => {
 el.style.visibility ="hidden";
          },
        });
      },
 move(x, y) {
 xTo(x);
 yTo(y);
 const delta = gsap.utils.clamp(-8, 8, (x - lastX) * 0.35);
 rTo(delta);
 lastX = x;
      },
    };

 return () => {
 gsap.killTweensOf(el);
    };
  }, []);

 useImperativeHandle(handleRef, () => ({
 show: (i: number) => apiRef.current?.show(i),
 hide: () => apiRef.current?.hide(),
 move: (x: number, y: number) => apiRef.current?.move(x, y),
  }));

 return (
    <div
 ref={rootRef}
 aria-hidden="true"
 className="pointer-events-none fixed inset-0 z-50 hidden overflow-hidden lg:block"
    >
      <div
 ref={plateRef}
 style={{ visibility:"hidden" }}
 className="shp-plate-wrap absolute left-0 top-0 h-[22rem] w-[17rem] overflow-hidden border border-[var(--cine-accent)] bg-[var(--cine-ground)] shadow-[0_30px_70px_rgba(0,0,0,0.55)] opacity-0 will-change-transform"
      >
        {stills.map((s, i) => (
          <div key={s.src + i} className="shp-plate absolute inset-0 opacity-0">
            <Image
 src={s.src}
 alt=""
 fill
 sizes="18rem"
 loading="lazy"
 className="object-cover"
 style={{ objectPosition: s.position ??"center" }}
            />
            {/* Ambient luxury gradient & frame tag */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,9,14,0.8)] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[0.58rem] tracking-[0.2em] uppercase text-[rgba(247,246,242,0.85)]">
              <span className="text-[var(--cine-accent)]">Perspective {i + 1}</span>
              <span>4K Cine Plate</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
