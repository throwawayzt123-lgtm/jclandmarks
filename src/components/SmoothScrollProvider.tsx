"use client";

import { useEffect } from"react";
import { usePathname } from"next/navigation";
import Lenis from"lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from"@/lib/gsap";

/**
 * Drives Lenis from GSAP's ticker so there is exactly one rAF loop on the
 * page, and keeps ScrollTrigger informed of Lenis-driven scroll positions.
 *
 * Disabled entirely under prefers-reduced-motion, which leaves native
 * scrolling in place.
 */
/** The live Lenis instance, shared with the route-change effect below. */
let activeLenis: Lenis | null = null;

/**
 * Smoothly scroll to a document Y position. Goes through Lenis when it is
 * running (a native smooth scrollTo would be overridden by it), otherwise
 * falls back to the browser.
 */
export function smoothScrollTo(y: number) {
  if (activeLenis) activeLenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/**
 * Freeze or release page scrolling (e.g. while a full-screen menu is open).
 * Lenis drives wheel scrolling itself, so `overflow: hidden` alone would not
 * stop it — it has to be paused too.
 */
/** Everything currently holding the scroll lock (e.g. "loader", "menu"). */
const lockHolders = new Set<string>();
const lockWanted = () => lockHolders.size > 0;

/**
 * Freeze or release page scrolling on behalf of `holder`. Scrolling stays
 * frozen while ANY holder still holds it, so the mobile menu closing can never
 * release the loading screen's lock. Lenis drives wheel scrolling itself, so
 * `overflow: hidden` alone would not stop it — it has to be paused too.
 */
export function setScrollLocked(holder: string, locked: boolean) {
  if (locked) lockHolders.add(holder);
  else lockHolders.delete(holder);
  if (lockWanted()) activeLenis?.stop();
  else activeLenis?.start();
  const root = document.documentElement;
  // Hiding the scrollbar would shift the whole page sideways; pad by its
  // width so nothing moves while the lock is held.
  if (lockWanted() && root.style.overflow !== "hidden") {
    const bar = window.innerWidth - root.clientWidth;
    root.style.paddingRight = bar > 0 ? `${bar}px` : "";
  } else if (!lockWanted()) {
    root.style.paddingRight = "";
  }
  root.style.overflow = lockWanted() ? "hidden" : "";
}

/**
 * After a client-side navigation the new page mounts under a scroller that
 * still remembers the old position. Jump to the top (or to the #hash the
 * link asked for) instantly, then let ScrollTrigger re-measure the new page.
 */
function settleAfterNavigation() {
  const hash = window.location.hash.slice(1);
  const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;

  if (activeLenis) {
    if (target) activeLenis.scrollTo(target, { offset: -64, immediate: true, force: true });
    else activeLenis.scrollTo(0, { immediate: true, force: true });
  } else if (target) {
    target.scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }

  ScrollTrigger.refresh();
}

export default function SmoothScrollProvider() {
 const pathname = usePathname();
 useEffect(() => {
 if (prefersReducedMotion()) return;

 const lenis = new Lenis({
      /**
       * `lerp` rather than duration+easing.
       *
       * The previous expo-out curve covered 50% of the travel in the first
       * 10% of its duration, then crawled the remainder — a lurch followed
       * by a long tail, which is what read as"harsh" even though smoothing
       * was technically running. A frame-rate-independent lerp eases every
       * frame by the same fraction of the remaining distance, so motion is
       * continuous from first frame to last.
       *
       * 0.085 is deliberately unhurried: heavy enough to feel expensive,
       * quick enough never to feel laggy.
       */
 lerp: 0.09,
 smoothWheel: true,
      // Multiplier <1 means one notch of the wheel travels a little less,
      // which makes long editorial pages feel controlled rather than flung.
 wheelMultiplier: 0.82,
      // Native touch scrolling stays — smoothed touch fights the OS and
      // costs far more than it gives.
 syncTouch: false,
 autoRaf: false,
    });

 activeLenis = lenis;
 if (lockWanted()) lenis.stop();
 lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker time is seconds; Lenis expects milliseconds.
 const raf = (time: number) => lenis.raf(time * 1000);
 gsap.ticker.add(raf);
    // Disable GSAP lag smoothing to keep Lenis and ScrollTrigger in perfect lockstep
 gsap.ticker.lagSmoothing(0);

    // Smooth navigation for all internal hash links
 const handleAnchorClick = (e: MouseEvent) => {
 const target = (e.target as HTMLElement).closest("a");
 if (!target) return;
 const href = target.getAttribute("href");
 if (href && href.startsWith("#") && href.length > 1) {
 const id = href.slice(1);
 const element = document.getElementById(id);
 if (element) {
 e.preventDefault();
          // If the element has a pin-spacer (e.g. pinned by ScrollTrigger), scroll to the spacer
 const pinSpacer = element.closest(".pin-spacer") as HTMLElement | null;
 const targetEl = pinSpacer || element;
 const isPinned = Boolean(pinSpacer || element.id ==="worlds");
 lenis.scrollTo(targetEl, { offset: isPinned ? 0 : -64, duration: 1.2 });
        }
      }
    };
 document.addEventListener("click", handleAnchorClick);

    // Lazy-loaded imagery changes document height after mount, which leaves
    // pinned triggers measured against a stale page. Re-sort and refresh
    // at multiple stages to guarantee zero offset drift.
 const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
 // One refresh when everything has loaded, plus one safety pass. (Each
 // refresh re-measures every trigger — a forced reflow — so they are kept few.)
 window.addEventListener("load", refresh);
 const settle1 = window.setTimeout(refresh, 1500);

 return () => {
 document.removeEventListener("click", handleAnchorClick);
 window.removeEventListener("load", refresh);
 window.clearTimeout(settle1);
 gsap.ticker.remove(raf);
 lenis.destroy();
 if (activeLenis === lenis) activeLenis = null;
    };
  }, []);

  // Runs on every route change (and once on first load, harmlessly).
 useEffect(() => {
    // Two frames: one for React to commit the new page, one for layout.
 let raf2 = 0;
 const raf1 = requestAnimationFrame(() => {
 raf2 = requestAnimationFrame(settleAfterNavigation);
    });
    // Late re-measure once lazy images on the new page have sized themselves.
 const late = window.setTimeout(() => ScrollTrigger.refresh(), 900);
 return () => {
 cancelAnimationFrame(raf1);
 cancelAnimationFrame(raf2);
 window.clearTimeout(late);
    };
  }, [pathname]);

 return null;
}
