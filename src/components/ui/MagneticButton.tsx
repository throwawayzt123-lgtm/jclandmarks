"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  /** Which .u-btn variant to draw (see globals.css). */
  variant?: "dark" | "line" | "gold" | "light";
  className?: string;
  /** Peak displacement toward the cursor, in pixels. */
  strength?: number;
}

/**
 * A site button (.u-btn) that drifts very slightly toward the cursor.
 *
 * The magnetic behaviour is applied only on devices with a fine pointer, and
 * is skipped entirely under reduced motion. Movement is capped at ~8px — any
 * more reads as a toy rather than a detail.
 */
export default function MagneticButton({
  children,
  href,
  type = "button",
  variant = "dark",
  className = "",
  strength = 8,
}: MagneticButtonProps) {
  const rootRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Touch devices and reduced-motion users get a plain, static button.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    const move = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const moveLabel = gsap.quickTo(el.querySelector(".mb-label"), "x", { duration: 0.7, ease: "power3.out" });

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

  const classes = `u-btn u-btn--${variant} ${className}`;

  const inner = (
    <span className="mb-label flex items-center gap-[inherit]">
      <span>{children}</span>
      <span aria-hidden="true" className="u-btn__arrow" />
    </span>
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
