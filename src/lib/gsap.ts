"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 * Importing anywhere in the client bundle guarantees ScrollTrigger is
 * registered exactly once, avoiding duplicate-plugin warnings.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Defaults tuned for restrained, editorial motion.
  gsap.defaults({ ease: "power3.out", duration: 1.1 });

  // ScrollTrigger recalculates on resize; ignore mobile URL-bar height jitter.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

/** True when the user has asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True on narrow, touch-first viewports. */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1023px)").matches;
}

/**
 * A ScrollTrigger `start` that fires when an element is genuinely on screen.
 *
 * The percentage in a start like "top 80%" is where the element's own top sits
 * down the viewport when the trigger fires: a higher number fires earlier,
 * with the element nearer the bottom edge.
 *
 * Desktop percentages assume a short element in a wide viewport. On a phone
 * the same blocks are two to three times taller relative to the screen
 * (.abt-metrics measures 15% of a desktop viewport but 36% of a Pixel 5),
 * so "top 80%" fires while the element still hangs off the bottom and the
 * motion is over before it is ever looked at — which reads as no animation.
 *
 * Mobile therefore uses a LOWER percentage, holding the reveal until the
 * element has climbed properly into view. Returned as a function so a
 * ScrollTrigger refresh after rotation re-measures.
 */
export function revealStart(desktop: string, mobile = "top 68%"): () => string {
  return () => (isMobileViewport() ? mobile : desktop);
}
