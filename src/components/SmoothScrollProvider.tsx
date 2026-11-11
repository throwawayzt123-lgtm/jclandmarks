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
/**
 * How far (in viewport heights) the scroll target may run ahead of the page
 * on screen — see the speed governor in the Lenis options. At lerp 0.09 a
 * lead of 0.45vh caps travel near 40px a frame inside the hero (about two
 * film frames per screen refresh); the rest of the page may run twice that.
 */
const HERO_LEAD = 0.45;
const PAGE_LEAD = 0.9;

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
      /**
       * Speed governor. Lenis glides toward a target, and every wheel event
       * pushes that target further on — so a frantic flick could queue up
       * thousands of pixels and the page would then race through them,
       * skipping hero frames faster than they can decode and flinging past
       * the pinned sections. Here the target may only run so far ahead of
       * what is on screen: ordinary scrolling is untouched, a violent flick
       * becomes a fast but continuous glide. The lead is tighter inside the
       * hero, where every scroll pixel is a film frame.
       */
 virtualScroll: (data) => {
 if (!data.event.type.includes("wheel")) return true;
 const lead = lenis.targetScroll - lenis.animatedScroll;
 const sameWay = lead === 0 || Math.sign(data.deltaY) === Math.sign(lead);
        // Reversing direction is never limited.
 if (!sameWay) return true;

 const hero = ScrollTrigger.getById("hero-sequence-pin");
 const inHero = !!hero && lenis.animatedScroll < hero.end;
 const maxLead = window.innerHeight * (inHero ? HERO_LEAD : PAGE_LEAD);
 const room = maxLead - Math.abs(lead);
 if (room <= 0) {
          // Swallow the event entirely (a zero delta would fall through to
          // a native scroll that fights Lenis).
 if (data.event.cancelable) data.event.preventDefault();
 return false;
        }
 data.deltaY = Math.sign(data.deltaY) * Math.min(Math.abs(data.deltaY), room);
 return true;
      },
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
