"use client";

import { useEffect, useRef } from"react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";

/**
 * Bespoke luxury architectural cursor with ambient trailing dot and magnetic expansion.
 * Automatically disabled on touch screens and prefers-reduced-motion.
 */
export default function CustomCursor() {
 const dotRef = useRef<HTMLDivElement>(null);
 const ringRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    // Only run on fine pointers (desktop mouse) and if reduced motion is off
 const finePointer = window.matchMedia("(pointer: fine)").matches;
 if (!finePointer || prefersReducedMotion()) return;

 const dot = dotRef.current;
 const ring = ringRef.current;
 if (!dot || !ring) return;

 gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

 const xDot = gsap.quickTo(dot,"x", { duration: 0.15, ease:"power2.out" });
 const yDot = gsap.quickTo(dot,"y", { duration: 0.15, ease:"power2.out" });

 const xRing = gsap.quickTo(ring,"x", { duration: 0.45, ease:"power3.out" });
 const yRing = gsap.quickTo(ring,"y", { duration: 0.45, ease:"power3.out" });

 let isVisible = false;

 const onPointerMove = (e: PointerEvent) => {
 if (!isVisible) {
 gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
 isVisible = true;
      }
 xDot(e.clientX);
 yDot(e.clientY);
 xRing(e.clientX);
 yRing(e.clientY);
    };

 const onPointerLeave = () => {
 gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
 isVisible = false;
    };

 const onMouseOver = (e: MouseEvent) => {
 const target = e.target as HTMLElement | null;
 if (!target) return;
 const isInteractive = target.closest("a, button, input, textarea, .u-plate, .spec-row, [role='button']");

 if (isInteractive) {
 gsap.to(ring, {
 scale: 1.8,
 borderColor:"var(--brand-gold)",
 backgroundColor:"rgba(203, 163, 107, 0.08)",
 duration: 0.35,
 ease:"power2.out",
        });
 gsap.to(dot, { scale: 0.5, duration: 0.35 });
      } else {
 gsap.to(ring, {
 scale: 1,
 borderColor:"rgba(203, 163, 107, 0.35)",
 backgroundColor:"transparent",
 duration: 0.35,
 ease:"power2.out",
        });
 gsap.to(dot, { scale: 1, duration: 0.35 });
      }
    };

 window.addEventListener("pointermove", onPointerMove, { passive: true });
 document.addEventListener("mouseleave", onPointerLeave);
 document.addEventListener("mouseover", onMouseOver, { passive: true });

 return () => {
 window.removeEventListener("pointermove", onPointerMove);
 document.removeEventListener("mouseleave", onPointerLeave);
 document.removeEventListener("mouseover", onMouseOver);
 gsap.killTweensOf([dot, ring]);
    };
  }, []);

 return (
    <div
 aria-hidden="true"
 className="pointer-events-none fixed inset-0 z-[200] overflow-hidden hidden md:block"
    >
      {/* Precision Core Dot */}
      <div
 ref={dotRef}
 className="fixed left-0 top-0 h-1.5 w-1.5 rotate-45 bg-[var(--brand-gold)] shadow-[0_0_8px_var(--brand-gold)]"
      />

      {/* Trailing Ambient Ring */}
      <div
 ref={ringRef}
 className="fixed left-0 top-0 h-8 w-8 rotate-45 border border-[rgba(203,163,107,0.35)] transition-[border-color,background-color] duration-300"
      />
    </div>
  );
}
