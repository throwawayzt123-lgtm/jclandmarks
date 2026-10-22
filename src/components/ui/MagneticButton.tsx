"use client";

import { useLayoutEffect, useRef, type ReactNode } from"react";
import Link from"next/link";
import { gsap, prefersReducedMotion } from"@/lib/gsap";

interface MagneticButtonProps {
 children: ReactNode;
 href?: string;
 type?:"button" |"submit";
 className?: string;
  /** Peak displacement toward the cursor, in pixels. */
 strength?: number;
}

/**
 * A bordered CTA that drifts very slightly toward the cursor, and whose ground
 * fills from the bottom on hover.
 *
 * The magnetic behaviour is applied only on devices with a fine pointer, and
 * is skipped entirely under reduced motion. Movement is capped at ~10px — any
 * more reads as a toy rather than a detail.
 */
export default function MagneticButton({
 children,
 href,
 type ="button",
 className ="",
 strength = 10,
}: MagneticButtonProps) {
 const rootRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

 useLayoutEffect(() => {
 const el = rootRef.current;
 if (!el) return;

    // Touch devices and reduced-motion users get a plain, static button.
 const finePointer = window.matchMedia("(pointer: fine)").matches;
 if (!finePointer || prefersReducedMotion()) return;

 const move = gsap.quickTo(el,"x", { duration: 0.6, ease:"power3.out" });
 const moveY = gsap.quickTo(el,"y", { duration: 0.6, ease:"power3.out" });
 const moveLabel = gsap.quickTo(el.querySelector(".mb-label"),"x", {
 duration: 0.7,
 ease:"power3.out",
    });

 const onMove = (e: PointerEvent) => {
      // getBoundingClientRect is read on pointer move only — never inside a
      // scroll or rAF loop — so this does not thrash layout.
 const r = el.getBoundingClientRect();
 const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
 const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
 move(dx * strength);
 moveY(dy * strength * 0.6);
 moveLabel(dx * strength * 0.3);
    };

 const onLeave = () => {
 move(0);
 moveY(0);
 moveLabel(0);
    };

 el.addEventListener("pointermove", onMove);
 el.addEventListener("pointerleave", onLeave);
 return () => {
 el.removeEventListener("pointermove", onMove);
 el.removeEventListener("pointerleave", onLeave);
 gsap.killTweensOf(el);
    };
  }, [strength]);

 const classes = [
"group relative inline-flex items-center justify-center overflow-hidden",
"shadow-[inset_0_0_0_1px_rgba(20,33,61,0.07),0_18px_44px_-28px_rgba(20,33,61,0.3)] bg-white px-10 py-5 shadow-sm",
"text-[0.7rem] uppercase tracking-[0.26em] text-[var(--on-surface)]",
"transition-all duration-500 ease-[var(--ease-luxe)]",
"hover:border-[var(--accent)] hover:shadow-md focus-visible:border-[var(--accent)]",
 className,
  ].join(" ");

 const inner = (
    <>
      {/* Ground fills from the bottom on hover. */}
      <span
 aria-hidden="true"
 className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-[var(--brand-gold-deep)] to-[var(--brand-gold)] transition-transform duration-[600ms] ease-[var(--ease-luxe)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="mb-label relative flex items-center gap-4 transition-colors duration-400 group-hover:text-[#ffffff] group-focus-visible:text-[#ffffff] font-medium">
        {children}
        <span
 aria-hidden="true"
 className="inline-block transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-2"
        >
          →
        </span>
      </span>
    </>
  );

 if (href) {
    // Internal routes go through the Next router (no full page reload);
    // anything else — tel:, mailto:, external sites — stays a plain anchor.
 if (href.startsWith("/")) {
 return (
        <Link ref={rootRef} href={href} className={classes}>
          {inner}
        </Link>
      );
    }
 return (
      <a ref={rootRef} href={href} className={classes}>
        {inner}
      </a>
    );
  }

 return (
    <button ref={rootRef} type={type} className={classes}>
      {inner}
    </button>
  );
}
