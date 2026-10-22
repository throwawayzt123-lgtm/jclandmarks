"use client";

import { useLayoutEffect, type DependencyList, type EffectCallback } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * A layout effect for scroll-animation setup that steps aside for the intro.
 *
 * On the homepage the loading screen covers everything, and every section
 * below the hero sits 5½ screens down — yet each one used to build its
 * ScrollTriggers (measuring the page each time) in the same instant on load.
 * That was seconds of main-thread work at exactly the moment the hero was
 * trying to appear.
 *
 * While the loading screen is on the page, these setups are queued and run
 * one per idle slot — first during the loading screen itself (time the
 * visitor is already waiting, with the page locked), pausing for the door
 * animation so it stays smooth, then in scroll pauses after the reveal. Where there is no loading screen (every other page,
 * or a return visit) the effect runs immediately, exactly like
 * useLayoutEffect, so content never appears and then snaps hidden.
 */

type Job = { run: () => void; cancelled: boolean };
const queue: Job[] = [];
let draining = false;
let waitingForIntro = false;

const idle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 250 });
  else setTimeout(cb, 16);
};

const introOnPage = () => typeof document !== "undefined" && !!document.querySelector("[data-scroll-lock]");

/**
 * Builds queued sections only when it cannot be felt: while the visitor is
 * not scrolling. If they reach the end of the hero first, everything left is
 * built straight away — those sections are still 2+ screens below, so they
 * are ready before they come into view.
 */
let lastScrollAt = 0;
const noteScroll = () => (lastScrollAt = performance.now());

function heroRemaining(): number {
  const hero = document.querySelector('[aria-label="Cinematic tour of the residence"]');
  const box = (hero?.closest(".pin-spacer") ?? hero) as HTMLElement | null;
  if (!box) return 0;
  return box.getBoundingClientRect().bottom - window.innerHeight;
}

function drain() {
  if (draining) return;
  draining = true;
  window.addEventListener("scroll", noteScroll, { passive: true });
  const step = () => {
    let job = queue.shift();
    while (job && job.cancelled) job = queue.shift();
    if (!job) {
      draining = false;
      window.removeEventListener("scroll", noteScroll);
      // Everything is built: one pass to settle all trigger positions.
      ScrollTrigger.refresh();
      return;
    }
    const intro = document.querySelector<HTMLElement>("[data-scroll-lock]");
    // The doors are opening: keep the main thread free for them.
    if (intro?.hasAttribute("data-handover")) {
      queue.unshift(job);
      window.setTimeout(step, 100);
      return;
    }
    // Just revealed: give the hero a quiet moment before resuming.
    if (!intro && performance.now() - introEndedAt < 700) {
      queue.unshift(job);
      window.setTimeout(step, 120);
      return;
    }
    const urgent = !intro && heroRemaining() < window.innerHeight * 2.5;
    const scrolling = !intro && performance.now() - lastScrollAt < 300;
    if (scrolling && !urgent) {
      queue.unshift(job);
      window.setTimeout(step, 150);
      return;
    }
    job.run();
    if (urgent) window.setTimeout(step, 0);
    else idle(step);
  };
  idle(step);
}

let introEndedAt = 0;
/** Start building at once (during the loader) and note when the loader leaves. */
function waitForIntro() {
  drain();
  if (waitingForIntro) return;
  waitingForIntro = true;
  const check = () => {
    if (introOnPage()) {
      window.setTimeout(check, 100);
      return;
    }
    waitingForIntro = false;
    introEndedAt = performance.now();
  };
  check();
}

export function useIntroLayoutEffect(effect: EffectCallback, deps?: DependencyList) {
  useLayoutEffect(() => {
    if (!introOnPage()) return effect();

    let cleanup: void | (() => void);
    const job: Job = { run: () => (cleanup = effect()), cancelled: false };
    queue.push(job);
    waitForIntro();
    return () => {
      job.cancelled = true;
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
